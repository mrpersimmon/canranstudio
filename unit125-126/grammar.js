(function(core){
'use strict';
function create({element,art}){const base=core.unit12Grammar.create({element,art});return {...base,present(question,progress){base.present(question,progress);element.querySelector('.grammar-model')?.classList.add('garden-model');}};}
core.unit125126Grammar={create};
})(globalThis.CanranCore);
