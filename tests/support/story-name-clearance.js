'use strict';
// Return geometry in the course frame's CSS pixels, not the review bench zoom.
function inspectStoryNameClearance(surface){
 const visible=e=>e.getClientRects().length&&!e.closest('[hidden]')&&getComputedStyle(e).visibility!=='hidden'&&Number(getComputedStyle(e).opacity)!==0;
 const images=[...surface.querySelectorAll('.learning-story-art img.cast-image')].filter(visible);
 const labels=[...surface.querySelectorAll('.learning-story-art .actor-label')].filter(visible),issues=[];
 for(const label of labels){const box=label.getBoundingClientRect();
  for(const image of images){const art=image.getBoundingClientRect(),width=Math.min(box.right,art.right)-Math.max(box.left,art.left),height=Math.min(box.bottom,art.bottom)-Math.max(box.top,art.top);
   if(width>.5&&height>.5)issues.push({name:label.textContent,image:image.getAttribute('src'),overlap:{width,height}});
  }
  const world=label.closest('.learning-story-art').getBoundingClientRect();if(box.left<world.left-1||box.right>world.right+1||box.bottom>world.bottom+1)issues.push({name:label.textContent,type:'name-outside-stage'});
 }
 return {names:labels.map(e=>e.textContent),issues};
}
module.exports={inspectStoryNameClearance};
