(function(core){
 'use strict';
 const portraits={visitor:'/assets/unit3-4-current/visitor-v154.webp',attendant:'/assets/unit3-4-current/attendant-v154.webp'};
 function image(name){return portraits[name]||'/assets/'+(name==='coat'?'unit1-2/':'unit3-4/')+name+'.svg';}
 function grammar({element,art}){const view=core.unit12Grammar.create({element,art});return {...view,hasVisibleModel(){return Boolean(element.querySelector('.grammar-model:not([hidden])'));}};}
 function completion(){const box=document.createElement('div'),im=document.createElement('img');box.className='completion-art current-completion';box.setAttribute('aria-hidden','true');im.src='/assets/awards/unit3-4-umbrella.webp';im.alt='';box.append(im);return box;}
 core.unit34Current={image,grammar,completion};
})(globalThis.CanranCore);
