(function(core){
'use strict';
function create({element,art}){const base=core.unit12Grammar.create({element,art});return{...base,present(question,progress){base.present({...question,workshop:question.workshop||{rule:question.explanation}},progress);element.querySelector('.grammar-model')?.classList.add('office-model');}};}
core.unit1718Grammar={create};
})(globalThis.CanranCore);
