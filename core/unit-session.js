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
 function navigate(id){
  if(!root.CanranStudentHandoff?.navigateFragment(id))root.location.hash=id;
 }
 function navigator(normalize,show){
  return requested=>{
   const id=normalize(requested);
   // Resume also works after scrolling back to the cover with the same hash.
   if(root.location.hash==='#'+id)show();else navigate(id);
  };
 }
 function scrollToRoute(id){
  const target=document.getElementById(id);
  if(!root.CanranStudentHandoff?.preparing){target.scrollIntoView({block:'start',behavior:'instant'});return;}
  // scrollIntoView can move every ancestor, including the map in WebKit.
  const padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
  root.scrollTo({top:root.scrollY+target.getBoundingClientRect().top-padding,behavior:'instant'});
 }
 root.CanranCore.unitSession={location,completion,navigate,navigator,scrollToRoute};
})(globalThis);
