(function(core){
  'use strict';
  const pictures={ability:['/assets/lesson49/icons/book.svg'],person:['/assets/unit43-44/cast-penny-point-v153.webp','/assets/lesson49/icons/people.svg'],verb:['/assets/unit43-44/kettle.svg'],negative:['/assets/unit43-44/cup.svg'],question:['/assets/unit43-44/see.svg'],some:['/assets/unit21-22/spoon.svg','/assets/unit41-42/bread.svg'],there:['/assets/unit41-42/milk.svg','/assets/lesson49/icons/book.svg'],es:['/assets/unit43-44/bus.svg'],ves:['/assets/unit41-42/two-loaves.svg']};
  function create({element,art}){
    const base=core.unit12Grammar.create({element,art});
    return {...base,present(question,progress){
      base.present(question,progress);const demo=element.querySelector('.grammar-model');if(!demo)return;
      demo.classList.add('tea-model');const key=question.id.replace('u4344-v1-g-','').replace(/-v153$/,''),sources=pictures[key]||[];
      demo.querySelectorAll('.grammar-model-line').forEach((line,index)=>{if(!sources[index])return;const img=document.createElement('img');img.src=sources[index];img.alt='';img.className='grammar-example-art';line.prepend(img);});
    }};
  }
  core.unit4344Grammar={create};
})(globalThis.CanranCore);
