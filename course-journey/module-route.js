'use strict';
// Historical v2 endpoint fitter, retained for traceability only.
// It is not imported by the current runtime: non-uniform road scaling is
// prohibited by J32. Current paths are pixels of the single chapter terrain.
// Decorative path endpoints follow the local stage rectangles. They never
// change character placement, rewards, click targets or the document flow.
function connectCourtyards(previous,next,asset){
  const point=value=>Array.isArray(value)&&value.length===2&&value.every(Number.isFinite);
  const rect=value=>value&&[value.left,value.top,value.width,value.height].every(Number.isFinite)&&value.width>0&&value.height>0;
  if(!rect(previous)||!rect(next)||!point(previous.exit)||!point(next.entry)||!point(asset?.from)||!point(asset?.to))return null;
  const from={x:previous.left+previous.width*previous.exit[0],y:previous.top+previous.height*previous.exit[1]};
  const to={x:next.left+next.width*next.entry[0],y:next.top+next.height*next.entry[1]};
  const width=(from.x-to.x)/(asset.from[0]-asset.to[0]);
  const height=(to.y-from.y)/(asset.to[1]-asset.from[1]);
  if(!(Number.isFinite(width)&&Number.isFinite(height)&&width>0&&height>0))return null;
  return {left:from.x-width*asset.from[0],top:from.y-height*asset.from[1],width,height};
}
function layoutCourtyardLinks(stages,asset){
  return stages.slice(0,-1).flatMap((stage,index)=>{
    const next=stages[index+1],box=connectCourtyards(stage,next,asset);
    return box?[{id:stage.id,next:next.id,...box}]:[];
  });
}
module.exports={connectCourtyards,layoutCourtyardLinks};
