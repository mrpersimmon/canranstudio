(function(core){
'use strict';
const pictures={time:['books','tea'],base:['jam'],third:['biscuit'],dont:['milk'],doesnt:['egg'],do:['apple'],does:['tea'],replies:['jam']};
function create({element,art}){
 const base=core.unit12Grammar.create({element,art});
 return {...base,present(question,progress){base.present(question,progress);const demo=element.querySelector('.grammar-model');if(!demo)return;demo.classList.add('coffee-model');const key=question.id.replace('u4748-v1-g-',''),sources=pictures[key]||[];demo.querySelectorAll('.grammar-model-line').forEach((line,i)=>{if(!sources[i])return;const img=document.createElement('img');img.src='/assets/unit47-48/'+sources[i]+'.svg';img.alt='';img.className='grammar-example-art';line.prepend(img);});}};
}
core.unit4748Grammar={create};
})(globalThis.CanranCore);
