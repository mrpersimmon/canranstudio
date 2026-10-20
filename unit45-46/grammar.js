(function(core){
  'use strict';
  const pictures={negative:['read'],question:['office'],who:['office'],what:['bird'],where:['read'],when:['minute'],how:['key'],many:['books'],much:['water'],change:['read']};
  function create({element,art}){
    const base=core.unit12Grammar.create({element,art});
    return {...base,present(question,progress){
      base.present(question,progress);const demo=element.querySelector('.grammar-model');if(!demo)return;
      demo.classList.add('office-model');const key=question.id.replace('u4546-v1-g-','').replace(/-v153$/,''),sources=pictures[key]||[];
      demo.querySelectorAll('.grammar-model-line').forEach((line,index)=>{if(!sources[index])return;const img=document.createElement('img');img.src='/assets/unit45-46/'+sources[index]+'.svg';img.alt='';img.className='grammar-example-art';line.prepend(img);});
    }};
  }
  core.unit4546Grammar={create};
})(globalThis.CanranCore);
