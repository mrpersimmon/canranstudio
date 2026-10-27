'use strict';
const {characters}=require('./chapter-layout');
const distant={file:'modules-v3/distant-garden-v1.webp',width:1536,height:1024};
// Keep the previous chapter URL usable for already-loaded clients.
const legacyAssets=[{file:'modules-v3/neighborhood-world-v1.webp'}];
const worlds={
  opening:{file:'modules-v3/opening-world-v1.webp',png:'modules-v3/opening-world-v1.png',width:724,height:2172,ids:['unit1-2','unit3-4','unit5-6'],alignSilhouette:true},
  neighborhood:{file:'modules-v4/neighborhood-town-v1.webp',png:'modules-v4/neighborhood-town-v1.png',width:724,height:2172,ids:['unit7-8','unit9-10','unit11-12'],floor:[.28,.46,.72,.61],patchRadii:[.29,.07],alignSilhouette:true},
  visits:{file:'modules-v5/visits-gallery-v1.webp',png:'modules-v5/visits-gallery-v1.png',width:724,height:2172,ids:['unit13-14','unit15-16','unit17-18'],floor:[.25,.49,.77,.61],patchRadii:[.29,.07],alignSilhouette:true},
  kindness:{file:'modules-v5/kindness-courtyard-v1.webp',png:'modules-v5/kindness-courtyard-v1.png',width:724,height:2172,ids:['unit19-20','unit21-22','unit23-24'],floor:[.30,.50,.72,.60],patchRadii:[.28,.06],alignSilhouette:true},
  home:{file:'modules-v6/home-interior-v3.webp',png:'modules-v6/home-interior-v3.png',width:724,height:2172,ids:['unit25-26','unit27-28','unit29-30'],floor:[.32,.48,.72,.61],patchRadii:[.26,.07],alignSilhouette:true},
  outdoors:{file:'modules-v6/outdoors-riverwalk-v1.webp',png:'modules-v6/outdoors-riverwalk-v1.png',width:724,height:2172,ids:['unit31-32','unit33-34','unit35-36'],floors:{'unit31-32':[.32,.49,.68,.61],'unit33-34':[.29,.49,.73,.61],'unit35-36':[.34,.49,.70,.61]},patchRadii:[.25,.06],alignSilhouette:true},
  making:{file:'modules-v6/making-workshop-v2.webp',png:'modules-v6/making-workshop-v2.png',width:724,height:2172,ids:['unit37-38','unit39-40','unit41-42'],floor:[.27,.47,.75,.61],patchRadii:[.29,.08],alignSilhouette:true},
  hospitality:{file:'modules-v6/hospitality-sunroom-v2.webp',png:'modules-v6/hospitality-sunroom-v2.png',width:724,height:2172,ids:['unit43-44','unit45-46','unit47-48'],floor:[.29,.48,.73,.61],patchRadii:[.28,.07],alignSilhouette:true},
  ...require('./remaining-route-worlds.json')
};
// Narrow-screen audit revisions retain the approved original actor geometry.
// Keep their old registered URLs for clients holding an earlier page bundle.
for(const [chapter,revision] of Object.entries(require('./mobile-audit-worlds.json'))){
 legacyAssets.push({file:revision.previousFile});
 worlds[chapter]={...worlds[chapter],...revision};
}
function sceneFor(world,id){
 const character=characters[id];
 const width=.36/((character.bounds[3]-character.bounds[1])*character.height/character.width);
 // Keep source anchors unchanged; all72 actual silhouettes share the same
 // reward/lesson axis, including the opening couple and wide luggage groups.
 const center=(character.bounds[0]+character.bounds[2])/2;
 const feet=[.5+(world.alignSilhouette?(character.anchor[0]-center)*width:0),.56];
 // Rewards follow the complete visible figure/prop silhouette, not the
 // remaining height of its square terrain section.
 const visualBottom=feet[1]+width*character.height/character.width*(character.bounds[3]-character.anchor[1]);
 return {index:world.ids.indexOf(id),feet,width,visualBottom,floor:world.floors?.[id]||world.floor||[.20,.42,.80,.64],patchRadii:world.patchRadii||[.36,.09]};
}
// Keep original chapter order and the painted road between authorized stops.
// An absent middle stop has terrain only, without a hidden course control.
function visibleSlots(world,courses){
 const byId=new Map(courses.map(course=>[course.id,course]));
 const indices=world.ids.flatMap((id,index)=>byId.has(id)?[index]:[]);
 if(!indices.length)return [];
 return world.ids.slice(indices[0],indices.at(-1)+1).map((id,offset)=>({index:indices[0]+offset,course:byId.get(id)||null}));
}
module.exports={worlds,distant,legacyAssets,characters,sceneFor,visibleSlots};
