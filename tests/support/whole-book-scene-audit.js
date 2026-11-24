'use strict';
function inspectWholeBookScene(surface){
 const world=surface.querySelector('.learning-story-art');if(!world||!globalThis.CanranCore.learningVisual)return [];
 const visible=e=>e.getClientRects().length&&!e.closest('[hidden]')&&getComputedStyle(e).visibility!=='hidden'&&+getComputedStyle(e).opacity!==0;
 const faults=[],box=world.getBoundingClientRect();
 for(const label of world.querySelectorAll('.actor-label'))if(visible(label)){
  const r=label.getBoundingClientRect();if(r.left<box.left-1||r.right>box.right+1||r.bottom>box.bottom+1)faults.push({type:'name-outside-stage',name:label.textContent});
  const actor=label.closest('.dialogue-actor'),cast=label.closest('.learning-caption-cast'),portraits=actor?[...actor.querySelectorAll(':scope>img')]:[],images=portraits.length?portraits:cast?[...cast.querySelectorAll(':scope>img')]:[];
  for(const image of images.filter(visible)){const b=image.getBoundingClientRect();if(Math.min(r.right,b.right)-Math.max(r.left,b.left)>.5&&Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top)>.5)faults.push({type:'name-over-portrait',name:label.textContent});}
 }
 for(const label of world.querySelectorAll('p[class$="-location"]'))if(visible(label))faults.push({type:'floating-place-label',text:label.textContent});
 const unit=document.documentElement.dataset.unit;
 if(['unit123-124','unit125-126'].includes(unit))for(const image of world.querySelectorAll('.learning-caption-actor>img,.garden-group-image'))if(visible(image)){
  const r=image.getBoundingClientRect(),ratio=image.naturalWidth/image.naturalHeight,paintedHeight=Math.min(r.height,r.width/ratio);
  if(paintedHeight<box.height*.45)faults.push({type:'portrait-reduced-by-legacy-offset',src:image.getAttribute('src'),paintedHeight,stageHeight:box.height});
 }
 const stage=world.parentElement,visual=CanranCore.learningVisual;let background=visual.background;
 for(const [key,values]of Object.entries(visual.backgroundStates||{}))background=values[world.dataset[key]]||background;
 if(visual.fullScene)background=visual.fullScene.image||world.querySelector('.room-image')?.getAttribute('src')||background;
 if(background&&!getComputedStyle(stage).backgroundImage.includes(background))faults.push({type:'narrative-background-missing',background});
 return faults;
}
module.exports={inspectWholeBookScene};
