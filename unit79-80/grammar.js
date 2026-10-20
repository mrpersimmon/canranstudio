(function(core){
'use strict';
function create({element,art}){const base=core.unit12Grammar.create({element,art});return {...base,present(question,progress){const display=question.id==='u7980-v1-g-must-reply'?{...question,workshop:{...question.workshop,model:{lines:[['Must he finish today? — No, he needn’t.','没有必要时用needn’t回答；人称与所说的人对应。']]}}}:question;base.present(display,progress);element.querySelector('.grammar-model')?.classList.add('visit-model');}};}
core.unit7980Grammar={create};
})(globalThis.CanranCore);
