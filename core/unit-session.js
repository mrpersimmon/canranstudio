(function(root){
 'use strict';
 // Only shared persistence and navigation; the unit owns its signatures and story.
 function location(routes,practice,onVisit){
  let active='';
  return {get active(){return active;},mark(id){
   if(!routes.has(id))return;
   if(active!==id){root.dispatchEvent(new Event('lesson49:leave-activity'));active=id;}
   if(id==='cover')return;
   practice.activity('unitLocation',id);
   const chapter=document.getElementById(id).closest('.shop-chapter');
   for(const link of document.querySelectorAll('.chapter-links a')){
    if(link.hash==='#'+chapter?.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
   }
   if(chapter)document.querySelector('.chapter-select select').value=chapter.id;
   const start=document.querySelector('#startBtn');if(start.textContent!=='继续冒险')start.textContent='继续冒险';
   onVisit?.();
  }};
 }
 function completion(completed,signatures,practice,updateProgress){
  /* @bench:completion */
  return id=>{completed[id]=signatures[id];practice.activity('unitCompleted',completed);updateProgress();};
 }
 root.CanranCore.unitSession={location,completion};
})(globalThis);
