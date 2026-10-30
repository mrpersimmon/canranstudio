'use strict';
const {expect}=require('@playwright/test');
const area=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
const distance=(a,b)=>Math.hypot(Math.max(0,a.left-b.right,b.left-a.right),Math.max(0,a.top-b.bottom,b.top-a.bottom));

// Usable Lesson UI is distinct from the shared terrain and each original
// character finishing decode. Failure of one character must stay local.
async function waitForModulesReady(page,ids){
 const chapter=await page.locator('.journey-map').getAttribute('data-chapter');
 // A resize usually leaves the same decoded scene ready. Check every existing
 // readiness condition in one DOM snapshot instead of repeatedly recording
 // locator snapshots for thousands of settled viewport samples. If anything
 // is incomplete, keep the original waits, deadlines and diagnostics below.
 const ready=await page.evaluate(({chapter,ids})=>{
  const scenes=[...document.querySelectorAll('.journey-map-scene')];
  const modules=[...document.querySelectorAll('[data-module-course]')];
  if(scenes.length!==1||scenes[0].dataset.chapter!==chapter||scenes[0].dataset.composition!=='modules')return false;
  if(ids?(modules.length!==ids.length||modules.some((node,index)=>node.dataset.moduleCourse!==ids[index])):modules.length===0)return false;
  const terrain=[...document.querySelectorAll('[data-route-terrain]')];
  if(ids?.length===0)return terrain.length===0&&document.querySelectorAll('.journey-world-passage').length===0;
  const worlds=[...document.querySelectorAll('[data-route-world]')];
  const images=modules.flatMap(node=>[...node.querySelectorAll('[data-module-ground],[data-story-course]')]);
  return !!(worlds.length===1&&worlds[0].dataset.worldState==='ready'&&
   terrain.length===1&&terrain[0].complete&&terrain[0].naturalWidth>0&&
   modules.every(node=>node.dataset.artState==='ready')&&
   images.length>0&&images.every(img=>img.complete&&img.naturalWidth>0)&&
   modules.every(node=>!node.querySelector('.journey-module-status')));
 },{chapter,ids});
 if(ready)return;
 await expect(page.locator('.journey-map-scene')).toHaveCount(1);
 await expect(page.locator('.journey-map-scene')).toHaveAttribute('data-chapter',chapter);
 await expect(page.locator('.journey-map-scene')).toHaveAttribute('data-composition','modules');
 const modules=page.locator('[data-module-course]');
 if(ids){await expect(modules).toHaveCount(ids.length);expect(await modules.evaluateAll(nodes=>nodes.map(node=>node.dataset.moduleCourse))).toEqual(ids);}
 else await expect.poll(()=>modules.count()).toBeGreaterThan(0);
 if(ids?.length===0){await expect(page.locator('[data-route-terrain]')).toHaveCount(0);await expect(page.locator('.journey-world-passage')).toHaveCount(0);return;}
 await expect(page.locator('[data-route-world]')).toHaveAttribute('data-world-state','ready');
 await expect(page.locator('[data-route-terrain]')).toHaveCount(1);
 await expect.poll(()=>page.locator('[data-route-terrain]').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
 await expect(page.locator('[data-module-course]:not([data-art-state="ready"])')).toHaveCount(0);
 await expect.poll(()=>modules.locator('[data-module-ground],[data-story-course]').evaluateAll(images=>images.length>0&&images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
 await expect(modules.locator('.journey-module-status')).toHaveCount(0);
}

// One DOM inspection for callers in module, banner and second-chapter specs.
// Positions are normalized to the complete square artboard, NOT the smaller
// flex stage that leaves room for ordinary-flow stars and the Lesson control.
async function inspectModules(page,bounds){
 return page.evaluate(bounds=>{
  const rect=el=>el?el.getBoundingClientRect().toJSON():null;
  const relative=(r,parent)=>({x:(r.left-parent.left)/parent.width,y:(r.top-parent.top)/parent.height,w:r.width/parent.width,h:r.height/parent.height});
  const scene=document.querySelector('.journey-map-scene'),world=document.querySelector('[data-route-world]'),terrain=document.querySelector('[data-route-terrain]');
  const currentLesson=document.querySelector('.journey-current-lesson'),currentRange=document.createRange();
  if(currentLesson)currentRange.selectNodeContents(currentLesson);
  return {width:innerWidth,windowWidth:innerWidth,overflow:document.documentElement.scrollWidth,scrollWidth:document.documentElement.scrollWidth,scene:rect(scene),world:rect(world),scroll:[scene.scrollLeft,scene.scrollTop],
   selectedCourse:document.querySelector('.journey-dock')?.dataset.selectedCourse,
   currentLesson:currentLesson?{text:currentLesson.textContent,box:rect(currentLesson),copyBox:rect(currentLesson.closest('.journey-dock-copy')),content:currentRange.getBoundingClientRect().toJSON(),lines:new Set([...currentRange.getClientRects()].filter(r=>r.width&&r.height).map(r=>Math.round(r.top))).size}:null,
   terrain:terrain?{box:rect(terrain),loaded:terrain.complete&&terrain.naturalWidth>0,source:terrain.currentSrc,ratio:terrain.naturalWidth/terrain.naturalHeight,native:[terrain.naturalWidth,terrain.naturalHeight],declared:[Number(terrain.getAttribute('width')),Number(terrain.getAttribute('height'))]}:null,
   terrainCount:document.querySelectorAll('[data-route-terrain]').length,bridgeCount:document.querySelectorAll('[data-module-link]').length,
   passages:[...world.querySelectorAll('.journey-world-passage')].map(el=>({box:rect(el),hidden:el.getAttribute('aria-hidden'),text:el.textContent,courseId:el.getAttribute('data-module-course'),controls:el.querySelectorAll('button,a,input,[tabindex]').length})),
   modules:[...document.querySelectorAll('[data-module-course]')].map(article=>{
    const id=article.dataset.moduleCourse,stage=article.querySelector('[data-module-stage]'),ground=article.querySelector('[data-module-ground]'),art=article.querySelector('[data-story-course]'),row=article.querySelector('[data-stars-course]'),label=article.querySelector('[data-map-course]'),medal=article.querySelector('[data-completion-medal]'),motion=article.querySelector('.journey-story-motion'),frame=article.querySelector('[data-ground-frame]');
    const s=rect(stage),a=rect(art),g=rect(ground),board=rect(motion),b=bounds[id],span=label.querySelector('.journey-node-lesson-text'),range=document.createRange();
    range.selectNodeContents(span);
    const textRects=[...range.getClientRects()].filter(r=>r.width&&r.height);
    return {id,index:Number(article.dataset.worldIndex),tag:article.tagName,box:rect(article),stage:s,board,ground:g,art:a,frame:rect(frame),
     visible:{left:a.left+b[0]*a.width,top:a.top+b[1]*a.height,right:a.left+b[2]*a.width,bottom:a.top+b[3]*a.height},
     loaded:[art,ground].every(img=>img.complete&&img.naturalWidth>0),source:ground.currentSrc,groundMask:getComputedStyle(frame).maskImage||getComputedStyle(frame).webkitMaskImage,
     ratios:{art:art.naturalWidth/art.naturalHeight,ground:ground.naturalWidth/ground.naturalHeight,board:board.width/board.height,stage:s.width/s.height},
     localArt:relative(a,board),localGround:relative(g,board),artInGround:relative(a,g),artboardRatio:board.width/board.height,
     sameStage:art.closest('[data-module-stage]')===stage&&ground.closest('[data-module-stage]')===stage,
     sameMotion:!!motion&&motion.contains(art)&&motion.contains(ground),motionCount:motion?.getAnimations().length||0,
     stageScroll:[stage.scrollLeft,stage.scrollTop],stageOverflow:getComputedStyle(stage).overflowY,stageScrollHeight:stage.scrollHeight,stageClientHeight:stage.clientHeight,
     row:rect(row),reward:rect(row),label:rect(label),medal:medal?rect(medal):null,
     rowPosition:getComputedStyle(row).position,labelPosition:getComputedStyle(label).position,
     text:label.innerText.trim(),accessibleName:label.getAttribute('aria-label'),
     type:{rect:rect(span),content:range.getBoundingClientRect().toJSON(),lines:new Set(textRects.map(r=>Math.round(r.top))).size,fontSize:parseFloat(getComputedStyle(span).fontSize),scrollWidth:span.scrollWidth,clientWidth:span.clientWidth}};
   })};
 },bounds);
}

function assertModuleGeometry(view,ids,width,reference){
 expect(view.modules.map(m=>m.id),'complete authorized course order').toEqual(ids);
 expect(view.overflow,'no horizontal document overflow').toBeLessThanOrEqual(width);
 expect(view.scroll,'normal document scroll, not nested map camera').toEqual([0,0]);
 if(!ids.length){expect(view.terrainCount).toBe(0);expect(view.passages).toHaveLength(0);expect(view.bridgeCount).toBe(0);return;}
 expect(view.currentLesson,'current-course Lesson range is present').not.toBeNull();
 expect(view.currentLesson.text,'current range belongs to the selected course').toBe('Lesson '+view.selectedCourse.replace('unit','').replace('-','–'));
 expect(view.currentLesson.lines,'keep the whole Lesson range together, including three-digit lessons').toBe(1);
 expect(view.currentLesson.content.left,'current Lesson is not clipped on the left').toBeGreaterThanOrEqual(view.currentLesson.copyBox.left-1);
 expect(view.currentLesson.content.right,'current Lesson fits beside the course illustration and action').toBeLessThanOrEqual(view.currentLesson.copyBox.right+1);
 expect(view.terrainCount,'one authoritative near-field image').toBe(1);
 expect(view.bridgeCount,'no independent stretched bridge layer').toBe(0);
 expect(view.terrain.loaded,'terrain really loaded').toBe(true);
 expect(view.terrain.native,'registered native dimensions match the decoded file').toEqual(view.terrain.declared);
 expect(Math.abs(view.terrain.native[1]-view.terrain.native[0]*3),'at most one native pixel of aspect quantization').toBeLessThanOrEqual(1);
 expect(view.terrain.box.width/view.terrain.box.height,'terrain keeps its native aspect ratio').toBeCloseTo(view.terrain.ratio,5);
 expect(view.terrain.box.width,'world and terrain use one horizontal scale').toBeCloseTo(view.world.width,1);
 const slots=[...view.modules.map(m=>m.box),...view.passages.map(p=>p.box)].sort((a,b)=>a.top-b.top);
 for(const [index,slot]of slots.entries()){
  expect(slot.width/slot.height,'each stop or passage keeps one native third of the terrain').toBeCloseTo(3*view.terrain.ratio,4);
  expect(slot.left,'all slots share the painted world left edge').toBeCloseTo(view.world.left,1);
  expect(slot.width,'all slots share one world scale').toBeCloseTo(view.world.width,1);
  if(index)expect(slot.top,'no artificial gap accumulates between painted sections').toBeCloseTo(slots[index-1].bottom,1);
 }
 for(const passage of view.passages){expect(passage.hidden).toBe('true');expect(passage.text).toBe('');expect(passage.courseId).toBe(null);expect(passage.controls).toBe(0);}
 for(const m of view.modules){
  const context=width+'px '+m.id;
  expect(m.loaded,context+' original figure and same-source ground patch loaded').toBe(true);
  expect(m.tag,context+' complete course container').toBe('ARTICLE');
  expect(m.sameStage,context+' same local stage').toBe(true);
  expect(m.sameMotion,context+' person and ground patch move together').toBe(true);
  expect(m.motionCount,context+' settled layout sample').toBe(0);
  expect(m.ratios.board,context+' complete local artboard is square').toBeCloseTo(1,4);
  expect(m.box.width/m.box.height,context+' ordinary-flow stop follows exact native section ratio').toBeCloseTo(3*view.terrain.ratio,4);
  expect(m.board.width,context+' artboard shares world scale').toBeCloseTo(view.world.width,1);
  expect(m.board.top,context+' artboard begins at its original slot').toBeCloseTo(m.box.top,1);
  expect(m.board.top-view.terrain.box.top,context+' original section index stays attached to actual source rows').toBeCloseTo(m.index*view.terrain.box.height/3,1);
  expect(m.art.width/m.art.height,context+' character keeps original aspect').toBeCloseTo(m.ratios.art,3);
  expect(m.ground.width/m.ground.height,context+' patch source is not stretched').toBeCloseTo(m.ratios.ground,5);
  expect(m.source,context+' patch uses the exact same image and retry version').toBe(view.terrain.source);
  expect(m.groundMask,context+' no opaque full-image sweep or duplicate terrain').not.toBe('none');
  // At rest, a masked duplicate of the source is pixel-aligned with the single
  // static world. This catches an index or height error even if feet do not move.
  for(const edge of ['left','top','right','bottom'])expect(m.ground[edge],context+' same-source crop '+edge).toBeCloseTo(view.terrain.box[edge],1);
  for(const edge of ['left','top','right','bottom'])expect(m.frame[edge],context+' square mask frame '+edge).toBeCloseTo(m.board[edge],1);
  expect(m.box.left,context).toBeGreaterThanOrEqual(view.scene.left-1);
  expect(m.box.right,context).toBeLessThanOrEqual(view.scene.right+1);
  expect(m.box.top,context).toBeGreaterThanOrEqual(view.scene.top-1);
  expect(m.box.bottom,context).toBeLessThanOrEqual(view.scene.bottom+1);
  for(const [edge,compare]of [['left','toBeGreaterThanOrEqual'],['top','toBeGreaterThanOrEqual'],['right','toBeLessThanOrEqual'],['bottom','toBeLessThanOrEqual']]){
   expect(m.visible[edge],context+' complete visible silhouette '+edge)[compare](m.stage[edge]+(edge==='left'||edge==='top'?-1:1));
  }
  expect(m.stageScroll,context+' no internal scroll').toEqual([0,0]);
  if(/auto|scroll/.test(m.stageOverflow))expect(m.stageScrollHeight,context+' not nested scroll').toBeLessThanOrEqual(m.stageClientHeight+1);
  expect(m.rowPosition,context+' stars in document flow').not.toMatch(/absolute|fixed/);
  expect(m.labelPosition,context+' Lesson in document flow').not.toMatch(/absolute|fixed/);
  expect(m.row.top-m.stage.bottom,context+' reserved stage ends before rewards').toBeGreaterThanOrEqual(5);
  expect(m.row.top-m.stage.bottom,context+' reserved stage / rewards gap').toBeLessThanOrEqual(7);
  // A whole terrain section may be tall on desktop. Belonging to its article
  // is not sufficient: rewards must remain close to the actual figure/prop.
  expect(m.row.top-m.visible.bottom,context+' rewards stay below figure').toBeGreaterThanOrEqual(12);
  expect(m.row.top-m.visible.bottom,context+' rewards stay close to figure').toBeLessThanOrEqual(16);
  expect(m.label.top-m.row.bottom,context+' Lesson below own stars').toBeGreaterThanOrEqual(7);
  expect(m.label.top-m.row.bottom,context+' Lesson / rewards gap').toBeLessThanOrEqual(9);
  expect(Math.abs((m.row.left+m.row.right-m.board.left-m.board.right)/2),context+' own centered stars').toBeLessThanOrEqual(1);
  expect(Math.abs((m.label.left+m.label.right-m.row.left-m.row.right)/2),context+' own centered Lesson').toBeLessThanOrEqual(1);
  expect(m.label.height,context+' 44px touch target').toBeGreaterThanOrEqual(44);
  expect(m.label.bottom,context+' entire control inside own stop').toBeLessThanOrEqual(m.box.bottom-15);
  expect(m.text,context+' only Lesson number on map').toBe('Lesson '+m.id.replace('unit','').replace('-','–'));
  // Several real titles begin with a character name (Jimmy, Jill, Sally).
  // Require the complete Lesson/name/reward structure and Chinese content,
  // without requiring that the very first title character be Chinese.
  expect(m.accessibleName,context+' bilingual course title is accessible').toMatch(/^选择 Lesson \d+–\d+ (?=[^，]*[\u3400-\u9fff])[^，]+，\d+ \/ \d+ 颗星$/);
  expect(m.type.lines,context+' no cropped or wrapped number').toBe(1);
  expect(m.type.fontSize,context+' readable size').toBeGreaterThanOrEqual(14);
  expect(m.type.scrollWidth,context+' no clipping').toBeLessThanOrEqual(m.type.clientWidth+1);
  expect(m.type.content.left,context).toBeGreaterThanOrEqual(m.label.left+1);
  expect(m.type.content.right,context).toBeLessThanOrEqual(m.label.right-1);
  expect(m.type.content.top,context).toBeGreaterThanOrEqual(m.label.top+1);
  expect(m.type.content.bottom,context).toBeLessThanOrEqual(m.label.bottom-1);
  if(m.medal){expect(m.medal.width,context+' medal target width').toBeGreaterThanOrEqual(44);expect(m.medal.height,context+' medal target height').toBeGreaterThanOrEqual(44);expect(m.medal.left,context+' medal ownership').toBeGreaterThanOrEqual(m.row.left-1);expect(m.medal.right,context+' medal ownership').toBeLessThanOrEqual(m.row.right+1);}
  for(const other of view.modules)if(other.id!==m.id){
   expect(area(m.box,other.box),context+' complete stops do not overlap').toBeLessThanOrEqual(1);
   for(const own of [m.stage,m.row,m.label])for(const theirs of [other.stage,other.row,other.label]){
    expect(area(own,theirs),context+' distinct control ownership '+other.id).toBeLessThanOrEqual(1);
    expect(distance(own,theirs),context+' breathing room '+other.id).toBeGreaterThanOrEqual(11);
   }
  }
  const old=reference?.modules.find(item=>item.id===m.id);if(old)assertStableModule(old,m,context);
 }
}
async function assertModules(page,bounds,width,reference){
 const ids=Object.keys(bounds).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));
 await waitForModulesReady(page,ids);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 let view;
 await expect(async()=>{view=await inspectModules(page,bounds);assertModuleGeometry(view,ids,width,reference);}).toPass({timeout:5000});
 return view;
}
function assertStableModule(before,after,context='module'){
 for(const kind of ['localArt','localGround','artInGround'])for(const key of ['x','y','w','h'])expect(Math.abs(after[kind][key]-before[kind][key]),context+' stable local '+kind+'.'+key).toBeLessThanOrEqual(.005);
 expect(after.artboardRatio,context+' square artboard ratio').toBeCloseTo(before.artboardRatio,4);
}
module.exports={assertModules,assertStableModule,waitForModulesReady,inspectModules,assertModuleGeometry};
