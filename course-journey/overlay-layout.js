'use strict';
// Every course is one visual stack: the actual alpha silhouette, the complete
// reward row, and a fixed single-line Lesson button. Old Chinese-title metrics
// and recursive caption offsets never participate in the camera or placement.
const rect=box=>({...box,right:box.right??box.left+box.width,bottom:box.bottom??box.top+box.height});
const distance=(a,b)=>Math.hypot(Math.max(0,a.left-b.right,b.left-a.right),Math.max(0,a.top-b.bottom,b.top-a.bottom));
const lessonWidth=desktop=>desktop?156:132;
function overlayLayout({scene,characters,width,height,viewportWidth,desktop=false}){
  const compact=!desktop&&viewportWidth<=360,compactDesktop=desktop&&viewportWidth<1300;
  const rewardWidth=desktop?(compactDesktop?148:184):compact?120:132,rewardHeight=desktop?48:44;
  const labelWidth=lessonWidth(desktop),items={},figures={};
  for(const [id,node]of Object.entries(scene.nodes)){
    const character=characters[id],b=character.bounds,w=node.width*width,h=w*character.height/character.width;
    const x=node.feet[0]*width-character.anchor[0]*w,y=node.feet[1]*height-character.anchor[1]*h;
    const figure={left:x+b[0]*w,right:x+b[2]*w,top:y+b[1]*h,bottom:y+b[3]*h};
    figures[id]=figure;
    const center=(figure.left+figure.right)/2;
    const rewards={left:center-rewardWidth/2,top:figure.bottom+6,width:rewardWidth,height:rewardHeight};
    items[id]={rewards,label:{left:center-labelWidth/2,top:rewards.top+rewardHeight+8,width:labelWidth,height:44,beside:false,multiline:false},starSize:desktop?(compactDesktop?18:22):compact?14:16,starGap:desktop&&!compactDesktop?3:1};
  }
  const entries=Object.entries(items),collisions=[];
  // Check all three parts, including the Lesson plate, against every other
  // course. Testing rewards alone missed the next character's head previously.
  for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
    const [id,a]=entries[i],[other,b]=entries[j];
    const own=[figures[id],rect(a.rewards),rect(a.label)],next=[figures[other],rect(b.rewards),rect(b.label)];
    if(own.some(first=>next.some(second=>distance(first,second)<12-.001)))collisions.push([id,other]);
  }
  const bottom=Math.max(...entries.map(([,item])=>item.label.top+item.label.height));
  return{items,figures,bottom,collisions};
}
function fitFrame({scene,characters,viewportWidth,desktop=false,composition}){
  const ratio=scene.width/scene.height;
  const halfRow=Math.max(lessonWidth(desktop),desktop?(viewportWidth<1300?148:184):viewportWidth<=360?120:132)/2;
  function candidate(scale){
    // All figures recover together between independently calibrated landing
    // limits. Neither a selected course nor its title changes these limits.
    const nodes=Object.fromEntries(Object.entries(scene.nodes).map(([id,node])=>[id,{...node,width:node.width+(Math.max(node.width,node.maxWidth??node.width)-node.width)*scale}]));
    let width=viewportWidth*1.2;
    // Bound the shared camera using silhouettes and complete entry stacks.
    // If even natural width is unsafe, preserve the bound and centre the art
    // with side space; forcing width >= viewportWidth silently cropped text.
    for(const [id,node]of Object.entries(nodes)){
      const character=characters[id],b=character.bounds;
      const min=node.feet[0]+(b[0]-character.anchor[0])*node.width,max=node.feet[0]+(b[2]-character.anchor[0])*node.width;
      if(min<.5)width=Math.min(width,(viewportWidth/2-6)/(.5-min));
      if(max>.5)width=Math.min(width,(viewportWidth/2-6)/(max-.5));
      const center=(min+max)/2;
      if(Math.abs(center-.5)>.0001)width=Math.min(width,(viewportWidth/2-halfRow-6)/Math.abs(center-.5));
    }
    width=Math.max(1,width);
    const canvasHeight=width/ratio,left=(viewportWidth-width)/2,top=0;
    const overlays=overlayLayout({scene:{...scene,nodes},characters,width,height:canvasHeight,viewportWidth,desktop});
    for(const [id,item]of Object.entries(overlays.items)){
      const boxes=[overlays.figures[id],rect(item.rewards),rect(item.label)];
      if(boxes.some(box=>box.left+left<6-.001||box.right+left>viewportWidth-6+.001||box.top<6-.001))overlays.collisions.push([id,'viewport-boundary']);
    }
    const height=Math.max(canvasHeight,overlays.bottom+14);
    return{composition,height,width,canvasHeight,left,top,nodes,overlays};
  }
  const largest=candidate(1);
  if(!largest.overlays.collisions.length)return largest;
  let best=candidate(0);
  if(best.overlays.collisions.length)return best;
  let low=0,high=1;
  for(let n=0;n<20;n++){
    const scale=(low+high)/2,next=candidate(scale);
    if(next.overlays.collisions.length)high=scale;
    else{low=scale;best=next;}
  }
  return best;
}
module.exports={overlayLayout,fitFrame};
