(function(core){
'use strict';
function create({element,art}){const base=core.unit12Grammar.create({element,art});return {...base,present(question,progress){base.present(question,progress);element.querySelector('.grammar-model')?.classList.add('moment-model');}};}
core.unit5758Grammar={create};
})(globalThis.CanranCore);
