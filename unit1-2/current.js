(function(core){
 'use strict';
 const characters={man:'/assets/unit1-2-current/man-v154.webp',woman:'/assets/unit1-2-current/woman-v154.webp'};
 const image=name=>characters[name]||'/assets/unit1-2/'+name+'.svg';
 function grammar({element,art}){
  const view=core.unit12Grammar.create({element,art});
  return {...view,hasVisibleModel(){return Boolean(element.querySelector('.grammar-model:not([hidden])'));}};
 }
 function completion(){
  const box=document.createElement('div');box.className='completion-art current-completion';box.setAttribute('aria-hidden','true');
  const picture=document.createElement('img');picture.src='/assets/awards/unit1-2-handbag-closeup.webp';picture.alt='';box.append(picture);return box;
 }
 // Update displayed portraits, never the question object used for saved rounds.
 function refreshPortraits(element){
  // Package loaders may replace source URLs with blobs. The named candidate
  // remains the identity in root, subpath and Worker-unavailable rendering.
  for(const button of element.querySelectorAll('.picture-option')){
   const label=button.getAttribute('aria-label')||button.querySelector(':scope>span')?.textContent;
   const who=({'男士':'man','女士':'woman'})[label],img=button.querySelector('img');
   if(who&&img&&img.dataset.unit12Portrait!==who){img.dataset.unit12Portrait=who;img.src=characters[who];}
  }
 }
 core.unit12Current={image,grammar,completion,refreshPortraits};
 const observer=new MutationObserver(()=>refreshPortraits(document.getElementById('lessonWorkspace')));
 observer.observe(document.getElementById('lessonWorkspace'),{childList:true,subtree:true});
})(globalThis.CanranCore);
