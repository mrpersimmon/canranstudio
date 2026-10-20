(function(core){
'use strict';
// Review supports live in the view so existing questions and rounds retain
// their signatures. New submissions record the model that was actually shown.
const models={
 'u2122-v1-owner-our':{rule:'两位同学一起介绍自己的笔，用Our；物品数量不决定说话者或物主人数。',model:{lines:[['My books are red.','Anna一个人介绍自己的几本书。'],['Our book is blue.','Ben和Tom一起介绍共同的一本书。']]}},
 'u2122-v1-article-empty':{rule:'empty的起始音是元音音素，所以用an empty glass；不只看glass的开头。',model:{lines:[['a full bottle; an old bottle','冠词跟着full／old的起始音选择，不只看后面的bottle。']]}}
};
function create({element,art}){const base=core.unit12Grammar.create({element,art});return{...base,
 present(question,progress){base.present({...question,workshop:question.workshop||models[question.id]||{rule:question.explanation}},progress);element.querySelector('.grammar-model')?.classList.add('desk-model');},
 hasVisibleModel(){const model=element.querySelector('.grammar-model');return Boolean(model&&!model.hidden);}
};}
core.unit2122Grammar={create};
})(globalThis.CanranCore);
