'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const sharp=require('sharp'),path=require('node:path'),inkCache=new Map();
async function ink(file){
 if(inkCache.has(file))return inkCache.get(file);
 const {data,info}=await sharp(path.join(process.cwd(),file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});let top=info.height,bottom=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>16){top=Math.min(top,y);bottom=Math.max(bottom,y+1);}
 const result={top:top/info.height,bottom:bottom/info.height};inkCache.set(file,result);return result;
}
const fullRooms=['unit25-26','unit27-28','unit31-32','unit33-34','unit35-36','unit37-38','unit39-40'];
const composites=['unit129-130','unit131-132','unit133-134','unit135-136','unit137-138','unit139-140','unit141-142'];
const cases=[...fullRooms.map(unit=>({unit,kind:'full-room'})),...composites.map(unit=>({unit,kind:'caption',page:unit==='unit135-136'?'story-5':undefined})),
 {unit:'unit133-134',kind:'caption',page:'story-7',label:'reading-pose'},
 {unit:'unit5-6',kind:'class',page:'story-0'},
 {unit:'unit15-16',kind:'friends',page:'story-3'},
 {unit:'unit19-20',kind:'vendor',page:'story-6'},
 {unit:'unit47-48',kind:'furniture',page:'story-0'},
 {unit:'unit49-50',kind:'furniture',page:'story-0'},
 {unit:'unit55-56',kind:'surface',page:'story-4'},
 {unit:'unit71-72',kind:'surface',page:'story-0'},
 {unit:'unit65-66',kind:'key',page:'story-8'},
 {unit:'unit125-126',kind:'garden',page:'story-0'},
 {unit:'unit143-144',kind:'forest',page:'story-5'}];
test.describe.configure({mode:'parallel'});
for(const item of cases.filter(c=>!process.env.STORY_UNITS||process.env.STORY_UNITS.split(',').includes(c.unit)))test(item.unit+' '+item.kind+(item.label?' '+item.label:'')+' follows the reviewed theatre composition',async({page},info)=>{
 const contacts={};if(item.kind==='furniture')for(const [selector,file]of Object.entries(item.unit==='unit49-50'?{'.market-counter':'counter','.market-steak':'counter-steak','.market-scale':'scale'}:{'.coffee-table':'table','.coffee-cup':'coffee','.coffee-sugar':'sugar','.coffee-milk':'milk-jug'}))contacts[selector]=await ink('assets/'+item.unit+'/'+file+'.svg');
 for(const device of devices){
  await page.goto('/?'+new URLSearchParams({unit:item.unit,page:item.page||'story-3',state:'english',device:device.id}));
  await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
  const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),stage=frame.locator('.learning-surface .dialogue-stage');
  const measurement=await stage.evaluate((stage,{kind,contacts})=>{
   const box=e=>e.getBoundingClientRect(),visible=e=>e.getClientRects().length&&!e.closest('[hidden]')&&getComputedStyle(e).display!=='none';
   const painted=im=>{const r=box(im),scale=Math.min(r.width/im.naturalWidth,r.height/im.naturalHeight);return {width:im.naturalWidth*scale,height:im.naturalHeight*scale,left:r.left+(r.width-im.naturalWidth*scale)/2,right:r.right-(r.width-im.naturalWidth*scale)/2};};
   const world=stage.querySelector('.learning-story-art'),r=box(stage),v={background:getComputedStyle(stage).backgroundImage,width:r.width};
   if(kind==='full-room'){v.backgroundWidth=parseFloat(getComputedStyle(stage).getPropertyValue('--sample-bg-width'))||0;v.insetImages=[...stage.querySelectorAll('.room-image')].filter(visible).length;v.actors=[...stage.querySelectorAll('.desk-cast .cast-image')].filter(visible).map(painted);}
   if(kind==='caption')v.groups=[...stage.querySelectorAll('.learning-caption-cast')].map(c=>{const im=[...c.querySelectorAll(':scope>img')].find(visible),paint=painted(im);return {image:paint,labels:[...c.querySelectorAll('.actor-label')].filter(visible).map(x=>{const broken=[];if(x.firstChild?.nodeType===Node.TEXT_NODE)for(const m of x.textContent.matchAll(/\b[A-Za-z]{4,}\b/g)){const range=document.createRange();range.setStart(x.firstChild,m.index);range.setEnd(x.firstChild,m.index+m[0].length);if(new Set([...range.getClientRects()].map(r=>Math.round(r.top))).size>1)broken.push(m[0]);}return {left:box(x).left,right:box(x).right,broken};})};});
   if(kind==='caption')v.scene=world.dataset.scene;
   if(['class','friends','vendor'].includes(kind)){const selector={class:'.students-group>img',friends:'.travel-friends>img',vendor:'.park-vendor'}[kind];v.heights=[...stage.querySelectorAll(selector)].filter(visible).map(im=>painted(im).height);}
   if(kind==='class'){v.feet=[...stage.querySelectorAll('.students-group>img')].filter(visible).map(im=>box(im).bottom);v.floor=r.bottom-parseFloat(getComputedStyle(stage).getPropertyValue('--sample-bg-height'))*.36;}
   if(kind==='furniture'){
    v.furniture=box(stage.querySelector('.coffee-table,.market-counter')).height;v.people=[...stage.querySelectorAll('.learning-caption-actor>img')].filter(visible).map(im=>painted(im).height);
    const entries=Object.entries(contacts),surface=stage.querySelector(entries[0][0]),surfaceBox=box(surface),surfaceHeight=painted(surface).height,surfaceY=surfaceBox.top+(surfaceBox.height-surfaceHeight)/2+surfaceHeight*entries[0][1].top;
    v.contacts=entries.slice(1).map(([selector,area])=>{const im=stage.querySelector(selector);if(!visible(im))return null;const r=box(im),height=painted(im).height;return {selector,gap:surfaceY-(r.top+(r.height-height)/2+height*area.bottom)};}).filter(Boolean);
   }
   if(kind==='surface')v.surfaces=[...stage.querySelectorAll('.story-prop-surface')].filter(visible).length;
   if(kind==='key'){const key=box(stage.querySelector('.story-key')),actor=stage.querySelector('[data-actor="'+world.dataset.keyOwner+'"] img'),person=box(actor);v.keyNearOwner=key.left+key.width/2>=person.left&&key.left+key.width/2<=person.right&&key.top>=person.top&&key.bottom<=person.bottom;}
   if(kind==='garden')v.insetProps=[...stage.querySelectorAll('.garden-door,.garden-planter')].filter(visible).length;
   if(kind==='forest'){v.baskets=stage.querySelector('.litter-view').getAttribute('src');v.litter=stage.querySelector('.forest-debris').getAttribute('src');}
   return v;
  },{kind:item.kind,contacts});
  await page.locator('#frame-shell').screenshot({path:info.outputPath(device.id+'.png')});
  if(item.kind==='full-room'){expect(measurement.background).toMatch(/url\(/);expect(measurement.backgroundWidth).toBeGreaterThan(measurement.width*.94);expect(measurement.insetImages).toBe(0);if(measurement.actors.length){for(const actor of measurement.actors)expect(actor.height).toBeGreaterThan(100);expect(measurement.actors.at(-1).right-measurement.actors[0].left).toBeGreaterThan(measurement.width*.8);}}
  if(item.kind==='caption')for(const group of measurement.groups)for(const label of group.labels){expect(label.left).toBeGreaterThanOrEqual(group.image.left-8);expect(label.right).toBeLessThanOrEqual(group.image.right+8);expect(label.broken,'English names may wrap at spaces, never inside a word').toEqual([]);}
  if(item.kind==='caption'&&item.unit==='unit133-134')for(const group of measurement.groups){const anchors=measurement.scene==='street'?[.375,.625]:[.33,.67];group.labels.forEach((label,index)=>expect(Math.abs((label.left+label.right)/2-(group.image.left+group.image.width*anchors[index])),'the name follows its reviewed person, excluding transparent side margins').toBeLessThanOrEqual(10));}
  if(['class','friends','vendor'].includes(item.kind)){expect(measurement.heights.length).toBeGreaterThan(0);for(const height of measurement.heights)expect(height).toBeGreaterThan(item.kind==='class'?54:90);}
  if(item.kind==='class')for(const foot of measurement.feet)expect(foot,'classmates must stand on the classroom floor, not the blackboard ledge').toBeGreaterThanOrEqual(measurement.floor);
  if(item.kind==='furniture'){expect(measurement.people.length).toBe(2);expect(measurement.furniture).toBeLessThan(Math.min(...measurement.people)*.72);for(const prop of measurement.contacts){expect(prop.gap,prop.selector+' rests on the painted surface, not the transparent image box').toBeLessThanOrEqual(3);expect(prop.gap,prop.selector+' is not sunk beneath the surface').toBeGreaterThanOrEqual(-8);}}
  if(item.kind==='surface')expect(measurement.surfaces).toBe(1);
  if(item.kind==='key')expect(measurement.keyNearOwner).toBe(true);
  if(item.kind==='garden'){expect(measurement.insetProps).toBe(0);expect(measurement.background).toContain('garden-home-v2.webp');}
  if(item.kind==='forest'){expect(measurement.baskets).toContain('forest-baskets-v2.webp');expect(measurement.litter).toContain('forest-litter-v2.webp');}
 }
});
