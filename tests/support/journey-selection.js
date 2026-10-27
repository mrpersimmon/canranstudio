'use strict';
// Observe the first painted frames, rather than waiting for the final selected
// colour. Alpha backgrounds are composed over black for a conservative check
// of the current dark text / cream fill; selected green is fully opaque.
async function sampleSelectionColors(page){
 return page.evaluate(async()=>{
  const rgb=s=>s.match(/[\d.]+/g).map(Number);
  const light=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
  const frames=[];
  for(let frame=0;frame<4;frame++){
   await new Promise(resolve=>requestAnimationFrame(resolve));
   frames.push({frame,nodes:[...document.querySelectorAll('[data-map-course]')].filter(n=>!n.closest('[data-staging=true]')).map(n=>{
    const css=getComputedStyle(n),fg=rgb(css.color),raw=rgb(css.backgroundColor),bg=raw.slice(0,3).map(v=>v*(raw[3]??1)),a=light(fg.slice(0,3)),b=light(bg);
    return{id:n.dataset.mapCourse,selected:n.getAttribute('aria-pressed')==='true',color:css.color,background:css.backgroundColor,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
   })});
  }
  return frames;
 });
}
module.exports={sampleSelectionColors};
