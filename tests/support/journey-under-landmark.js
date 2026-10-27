'use strict';
const {expect}=require('@playwright/test');
const area=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
const distance=(a,b)=>Math.hypot(Math.max(0,a.left-b.right,b.left-a.right),Math.max(0,a.top-b.bottom,b.top-a.bottom));
async function assertUnderLandmarks(page,bounds,width){
 let view;
 // WebKit can expose a valid previous-height frame after setViewportSize.
 // Let ResizeObserver, the scheduled measurement and React finish first.
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
 await expect(async()=>{
  view=await page.evaluate(bounds=>{
   const rect=e=>e.getBoundingClientRect().toJSON(),scene=document.querySelector('.journey-map-scene');
   const art=[...document.querySelectorAll('[data-story-course]')].map(img=>{
    const id=img.dataset.storyCourse,r=rect(img),b=bounds[id];
    return{id,loaded:img.complete&&img.naturalWidth>0,left:r.left+r.width*b[0],right:r.left+r.width*b[2],top:r.top+r.height*b[1],bottom:r.top+r.height*b[3],height:r.height*(b[3]-b[1]),ratio:r.width/r.height,native:img.naturalWidth/img.naturalHeight};
   });
   const info=art.map(({id})=>{
    const label=document.querySelector('[data-map-course="'+id+'"]'),progress=document.querySelector('[data-stars-course="'+id+'"]'),medal=document.querySelector('[data-completion-medal="'+id+'"]');
    const text=[...label.querySelectorAll('.journey-node-lesson-text')].map(span=>{
     const range=document.createRange();range.selectNodeContents(span);
     const fragments=[...range.getClientRects()].filter(box=>box.width>0&&box.height>0);
     return{...rect(span),content:range.getBoundingClientRect().toJSON(),lines:new Set(fragments.map(box=>Math.round(box.top))).size,fontSize:parseFloat(getComputedStyle(span).fontSize),clientWidth:span.clientWidth,scrollWidth:span.scrollWidth};
    });
    return{id,label:rect(label),progress:rect(progress),medal:medal?rect(medal):null,visibleText:label.innerText.trim(),accessibleName:label.getAttribute('aria-label'),text};
   });
   return{scene:rect(scene),composition:scene.dataset.composition,scroll:[scene.scrollLeft,scene.scrollTop],overflow:document.documentElement.scrollWidth,art,info};
  },bounds);
  const context=width+'px '+view.composition;
  expect(view.art,context).toHaveLength(3);expect(view.scroll,context).toEqual([0,0]);expect(view.overflow,context).toBeLessThanOrEqual(width);
  for(const figure of view.art){
   expect(figure.loaded,figure.id).toBe(true);expect(Math.abs(figure.ratio-figure.native),figure.id).toBeLessThan(.002);
   expect(figure.left,context+' '+figure.id).toBeGreaterThanOrEqual(view.scene.left-1);expect(figure.right,context+' '+figure.id).toBeLessThanOrEqual(view.scene.right+1);
   expect(figure.top,context+' '+figure.id).toBeGreaterThanOrEqual(view.scene.top-1);expect(figure.bottom,context+' '+figure.id).toBeLessThanOrEqual(view.scene.bottom+1);
   const own=view.info.find(group=>group.id===figure.id),row=own.progress;
   // Independent visible-silhouette measurements, not the old caption anchor,
   // determine ownership. These assertions also apply when the medal appears.
   expect(Math.abs((row.left+row.right-figure.left-figure.right)/2),context+' '+figure.id+' reward center').toBeLessThanOrEqual(1);
   expect(row.top-figure.bottom,context+' '+figure.id+' below feet').toBeGreaterThanOrEqual(5);
   expect(row.top-figure.bottom,context+' '+figure.id+' below feet').toBeLessThanOrEqual(7);
   // The accepted single-column entrance replaces the former side caption.
   // Read all three actual DOM centers: changing only the text would leave the
   // old caption box/avoidance rules behind and could reintroduce ambiguity.
   expect(Math.abs((own.label.left+own.label.right-figure.left-figure.right)/2),context+' '+figure.id+' Lesson center').toBeLessThanOrEqual(1);
   expect(Math.abs((own.label.left+own.label.right-row.left-row.right)/2),context+' '+figure.id+' Lesson / reward center').toBeLessThanOrEqual(1);
   expect(own.label.top-row.bottom,context+' '+figure.id+' Lesson below rewards').toBeGreaterThanOrEqual(8-1);
   expect(own.label.top-row.bottom,context+' '+figure.id+' Lesson stays attached to rewards').toBeLessThanOrEqual(9);
   for(const group of view.info)for(const [kind,box]of [['label',group.label],['rewards',group.progress]])expect(area(box,figure),context+' '+group.id+' '+kind+' obstructs '+figure.id).toBeLessThanOrEqual(1);
  }
  for(const group of view.info){
   const {label,row=group.progress,medal}=group;
   const lesson='Lesson '+group.id.replace('unit','').replace('-','–');
   expect(group.visibleText,context+' '+group.id+' map label contains only Lesson numbers').toBe(lesson);
   expect(group.accessibleName,context+' '+group.id+' accessible name retains Lesson').toContain(lesson);
   expect(group.accessibleName,context+' '+group.id+' accessible name retains the Chinese course title').toMatch(/选择 Lesson \d+–\d+ [\u3400-\u9fff].+，\d+ \/ \d+ 颗星$/);
   expect(group.text,context+' '+group.id+' complete Lesson text').toHaveLength(1);
   expect(label.left,context).toBeGreaterThanOrEqual(view.scene.left+6);expect(label.right,context).toBeLessThanOrEqual(view.scene.right-6);
   expect(label.bottom,context).toBeLessThanOrEqual(view.scene.bottom-5);expect(label.height,context).toBeGreaterThanOrEqual(44);
   expect(row.left,context+' reward frame').toBeGreaterThanOrEqual(view.scene.left+3);expect(row.right,context+' reward frame').toBeLessThanOrEqual(view.scene.right-3);expect(row.bottom,context).toBeLessThanOrEqual(view.scene.bottom-3);
   for(const text of group.text){
    expect(text.left,context+' complete caption').toBeGreaterThanOrEqual(label.left+1);expect(text.right,context+' complete caption').toBeLessThanOrEqual(label.right-1);expect(text.top,context+' caption top').toBeGreaterThanOrEqual(label.top+1);expect(text.bottom,context+' caption bottom').toBeLessThanOrEqual(label.bottom-1);
    // Measure the rendered text range as well as its span. A clipped span can
    // fit its plate while hiding digits or wrapping a long Lesson range.
    expect(text.lines,context+' '+group.id+' single-line Lesson').toBe(1);
    expect(text.fontSize,context+' '+group.id+' readable Lesson').toBeGreaterThanOrEqual(14);
    expect(text.scrollWidth,context+' '+group.id+' no clipped Lesson').toBeLessThanOrEqual(text.clientWidth+1);
    expect(text.content.width,context+' '+group.id+' complete Lesson width').toBeLessThanOrEqual(label.width-2);
    expect(text.content.height,context+' '+group.id+' complete Lesson height').toBeLessThanOrEqual(label.height-2);
    expect(text.content.left).toBeGreaterThanOrEqual(label.left+1);expect(text.content.right).toBeLessThanOrEqual(label.right-1);expect(text.content.top).toBeGreaterThanOrEqual(label.top+1);expect(text.content.bottom).toBeLessThanOrEqual(label.bottom-1);
   }
   if(medal){expect(medal.width,context).toBeGreaterThanOrEqual(44);expect(medal.height,context).toBeGreaterThanOrEqual(44);expect(medal.left,context).toBeGreaterThanOrEqual(row.left);expect(medal.right,context).toBeLessThanOrEqual(row.right);}
   for(const other of view.info){
    expect(area(row,other.label),context+' '+group.id+' rewards / '+other.id+' caption separation').toBeLessThanOrEqual(1);
    if(group.id!==other.id){
     expect(area(row,other.progress),context+' separate rewards').toBeLessThanOrEqual(1);expect(area(label,other.label),context+' separate captions').toBeLessThanOrEqual(1);
     // A full entrance needs breathing room from every part of its neighbour,
     // not just zero intersection. This catches a Lesson plate creeping up
     // against the next person's hat even when every rectangle is disjoint.
     const ownFigure=view.art.find(figure=>figure.id===group.id),otherFigure=view.art.find(figure=>figure.id===other.id);
     for(const [ownKind,ownBox]of [['figure',ownFigure],['rewards',row],['Lesson',label]])for(const [otherKind,otherBox]of [['figure',otherFigure],['rewards',other.progress],['Lesson',other.label]])expect(distance(ownBox,otherBox),context+' '+group.id+' '+ownKind+' / '+other.id+' '+otherKind+' entrance gap').toBeGreaterThanOrEqual(11);
    }
   }
  }
 }).toPass({timeout:5000});
 return view;
}
module.exports={assertUnderLandmarks};
