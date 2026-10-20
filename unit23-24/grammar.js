(function(core){
'use strict';
const models={
 'u2324-v1-on-contact':{model:{lines:[['The pens are on the table.','钢笔直接放在桌面上。判断on要看接触哪一个表面，不只看画面高低。']]}},
 'u2324-v1-recipient-us':{model:{lines:[['This is my book. Give me my book, please.','Anna请求把自己的书递回：my说谁的，me说给谁。'],['These are our pens. Give us our pens, please.','两位同学共同请求递回自己的笔：our说明所属，us说明接收者。']]}}
};
function create({element,art}){const base=core.unit12Grammar.create({element,art});return{...base,
 present(question,progress){base.present({...question,workshop:question.workshop||{rule:question.explanation,...models[question.id]}},progress);element.querySelector('.grammar-model')?.classList.add('desk-model');},
 hasVisibleModel(){const model=element.querySelector('.grammar-model');return Boolean(model&&!model.hidden);}
};}
core.unit2324Grammar={create};
})(globalThis.CanranCore);
