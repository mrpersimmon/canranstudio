'use strict';
// Current placement calibration. Keep accepted source-art / production receipts
// immutable; this pass is about shoes, chair legs and counter feet on the paving.
const portraitScale={neighborhood:.650,visits:.567,kindness:.625,home:.630,outdoors:.573,making:.672,hospitality:.592,seasons:.642,everyday:.608,caring:.626,memories:.642,appointments:.642,preparations:.534,decisions:.591,departures:.696,messages:.534,learning:.642,choices:.586,surprises:.650,stories:.684,possibilities:.573,news:.562,woodland:.549};
function calibrateGround(chapters,characters){
  return Object.fromEntries(Object.entries(chapters).map(([key,chapter])=>[key,Object.fromEntries(Object.entries(chapter).map(([composition,scene])=>{
    const ids=Object.keys(scene.nodes),nodes=Object.fromEntries(ids.map((id,index)=>{
      const original=scene.nodes[id];
      if(composition==='portrait'){
        const character=characters[id],visibleWidth=character.bounds[2]-character.bounds[0];
        const maxWidth=Math.min(original.width,[.27,.26,.32][index]/visibleWidth);
        return[id,{...original,width:original.width*(portraitScale[key]||.68),maxWidth,feet:index===0?[original.feet[0],.82]:index===1?[.43,.48]:original.feet}];
      }
      return[id,index===1?{...original,width:original.width*.90,feet:[.55,.50]}:original];
    }));
    if(key==='opening'&&composition==='portrait'){
      nodes[ids[0]]={...nodes[ids[0]],feet:[.349,.82],width:.245,maxWidth:.332};
      nodes[ids[1]]={...nodes[ids[1]],feet:[.43,.48],width:.26,maxWidth:.34};
      nodes[ids[2]]={...nodes[ids[2]],feet:[.74,.24],width:.30,maxWidth:.40};
    }
    if(key==='neighborhood'&&composition==='portrait')nodes[ids[1]].maxWidth=.31;
    if(composition==='portrait'){
      // Restore one shared proportion across all three depths. Independently
      // growing each person to its cap would make the background group taller
      // than the middle group on a wide phone.
      const restore=Math.min(...ids.map(id=>nodes[id].maxWidth/nodes[id].width));
      for(const id of ids)nodes[id].maxWidth=nodes[id].width*restore;
    }
    return[composition,{...scene,nodes}];
  }))]));
}
module.exports={calibrateGround};
