(function(core){
 'use strict';
 // Exact runtime files keep original PNGs and generation receipts out of the package.
 const portraits={visitor:'/assets/unit3-4-journey/visitor-v1.webp',attendant:'/assets/unit3-4-journey/attendant-v1.webp',counter:'/assets/unit3-4-journey/counter-v1.webp',coat:'/assets/unit3-4-journey/coat-v1.webp',ticket:'/assets/unit3-4-journey/ticket-v1.webp',umbrella:'/assets/unit3-4-journey/umbrella-purple-v1.webp','umbrella-held':'/assets/unit3-4-journey/umbrella-purple-v1.webp','umbrella-red':'/assets/unit3-4-journey/umbrella-red-v1.webp','umbrella-yellow':'/assets/unit3-4-journey/umbrella-yellow-v1.webp'};
 function image(name){return portraits[name]||'/assets/'+(name==='coat'?'unit1-2/':'unit3-4/')+name+'.svg';}
 function grammar({element,art}){const view=core.unit12Grammar.create({element,art});return {...view,hasVisibleModel(){return Boolean(element.querySelector('.grammar-model:not([hidden])'));}};}
 function completion(){const box=document.createElement('div'),im=document.createElement('img');box.className='completion-art current-completion journey-completion';box.setAttribute('aria-hidden','true');im.src='/assets/course-journey/umbrella-counter-v1.webp';im.alt='';box.append(im);return box;}
 document.body.dataset.unit34Journey='v1';
 core.unit34Current={image,grammar,completion};
})(globalThis.CanranCore);
