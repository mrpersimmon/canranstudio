'use strict';
// Legacy v2 asset registration and measurement reference only.
// Current Lesson 1–144 rendering uses route-worlds.js / PanoramaJourney.
// Lesson 1–12 pilot: local 3:2 dioramas replace the large background's contact
// planes. Open courtyards and a decorative connecting route live in modules-v2.
// This module only reads legacy character metadata; later chapters are untouched.
const {characters}=require('./chapter-layout');
const ids=Object.freeze(['unit1-2','unit3-4','unit5-6','unit7-8','unit9-10','unit11-12']);
const chapters=Object.freeze({
  opening:Object.freeze(ids.slice(0,3)),
  neighborhood:Object.freeze(ids.slice(3))
});
const ambient=Object.freeze({file:'modules-v2/garden-route-v2.webp',width:724,height:2172});
const ambientDesktop=Object.freeze({file:'modules-v2/garden-route-desktop-v2.webp',width:1254,height:1254});
const connector=Object.freeze({file:'modules-v2/stone-link-v2.webp',width:1536,height:1024,from:[.91,0],to:[.03,.93]});
const measured={
  'unit1-2':{alpha:[0,68,1535,1023],floor:[.23,.57,.77,.74],feet:[.5,.67]},
  'unit3-4':{alpha:[0,30,1535,1023],floor:[.23,.56,.77,.75],feet:[.5,.67]},
  'unit5-6':{alpha:[0,42,1535,978],floor:[.23,.56,.77,.75],feet:[.5,.72]},
  'unit7-8':{alpha:[0,83,1535,1023],floor:[.23,.56,.77,.75],feet:[.5,.69]},
  'unit9-10':{alpha:[0,90,1535,979],floor:[.20,.56,.80,.78],feet:[.5,.72]},
  'unit11-12':{alpha:[0,32,1535,938],floor:[.22,.56,.78,.78],feet:[.5,.72]}
};
const scenes=Object.freeze(Object.fromEntries(ids.map(id=>{
  const c=characters[id],m=measured[id],width=1536,height=1024;
  return [id,Object.freeze({
    id,width,height,
    ground:Object.freeze({
      file:'modules-v2/'+id+'-ground.webp',png:'modules-v2/'+id+'-ground.png',
      width,height,alphaRange:Object.freeze([0,254]),
      // Half-open normalized alpha >16 bounding rectangle.
      bounds:Object.freeze([m.alpha[0]/width,m.alpha[1]/height,(m.alpha[2]+1)/width,(m.alpha[3]+1)/height]),
      floor:Object.freeze(m.floor)
    }),
    // Entry pavement in the last two images is lower than the first four.
    // These ports connect decoration only, never the characters' feet.
    route:Object.freeze({entry:[.06,['unit9-10','unit11-12'].includes(id)?.40:.28],exit:[.94,.73]}),
    position:Object.freeze({
      // The visible character group is 40% of local stage width, independent
      // of global viewport height, lesson text length, selection, and rewards.
      width:.40/((c.bounds[3]-c.bounds[1])*c.height/c.width),
      feet:Object.freeze(m.feet)
    })
  })];
})));
module.exports={ids,chapters,ambient,ambientDesktop,connector,characters,scenes};
