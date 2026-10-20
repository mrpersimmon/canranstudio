(function(core){
'use strict';
const models={
 'u1920-tasks-v4-be-subject':{rule:'children是复数，配are；their mother的中心词是一个mother，配is。',model:{lines:[['The girl is happy. The girls are happy.','一位女孩用is，多位女孩用are。happy：高兴的。'],['I am happy.','说我怎么样时，I配am。']]}},
 'u1920-v1-be-adjective':{rule:'They指两只鞋子；形容词clean保持原形。',model:{lines:[['This hat is new. These hats are new.','一顶或多顶帽子，表示状态的new都不加s。']]}}
};
function create({element,art}){const base=core.unit12Grammar.create({element,art});return{...base,
 present(question,progress){base.present({...question,workshop:question.workshop||models[question.id]||{rule:question.explanation}},progress);element.querySelector('.grammar-model')?.classList.add('park-model');},
 hasVisibleModel(){const model=element.querySelector('.grammar-model');return Boolean(model&&!model.hidden);}
};}
core.unit1920Grammar={create};
})(globalThis.CanranCore);
