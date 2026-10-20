(function(core){
'use strict';
// These teaching supports leave the assessed question, answer and session
// untouched. Already completed rounds retain their original evidence.
const firstPluralModel={
 rule:'有些名词的复数要记住特殊词形；复合职业词也要核对表示人的部分。不能把所有f或fe结尾的词都按同一种方法变化。',
 model:{lines:[
  ['one milkman → two milkmen','一位送奶工 → 两位送奶工；这个职业词中的man变为men。'],
  ['one knife → two knives','一把刀 → 两把刀；knife的fe变为ves，其他词要分别核对。']
 ]}
};
function create({element,art}){
 const base=core.unit12Grammar.create({element,art});
 return{...base,
  present(question,progress){
   const workshop=question.workshop||(question.id==='u1718-tasks-v4-plural-labels'?firstPluralModel:{rule:question.explanation});
   base.present({...question,workshop},progress);
   element.querySelector('.grammar-model')?.classList.add('office-model');
   if(question.id==='u1718-five-g-irregular'){
    const notes=document.createElement('p');notes.className='practice-context grammar-word-notes';notes.setAttribute('role','note');notes.setAttribute('aria-label','本题词义');
    notes.textContent='child：孩子；foot：脚；tooth：牙齿；mouse：老鼠。';
    element.querySelector('.grammar-intro').append(notes);
   }
  },
  hasVisibleModel(){const model=element.querySelector('.grammar-model');return Boolean(model&&!model.hidden);}
 };
}
core.unit1718Grammar={create};
})(globalThis.CanranCore);
