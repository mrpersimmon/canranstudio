(function(core){
'use strict';
function create({element,art}){const base=core.unit12Grammar.create({element,art});return{...base,present(question,progress){let workshop=question.workshop||{rule:question.explanation};if(question.id==='u3132-five-g-state')workshop={...workshop,model:{lines:[['Tom is in the classroom. / Tom is reading in the classroom.','前句只说地点；后句说正在做的动作。']]}};base.present({...question,workshop},progress);element.querySelector('.grammar-model')?.classList.add('desk-model');}};}
core.unit3132Grammar={create};
})(globalThis.CanranCore);
