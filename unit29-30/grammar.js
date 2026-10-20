(function(core){
'use strict';
const models={
 'u2930-v1-must-purpose':{model:{lines:[['What must we do?','我们必须做什么？What问要做的任务，we表示我们；这里不是问物品的位置。']]},rule:'What must I do?询问我应该做什么；I指正在提问的艾米。'},
 'u2930-v1-bedroom-is':{model:{lines:[['The book’s new. / Amy’s book','前一句的’s是is，说明书的状态；后一句的’s表示艾米的，说明所属。']]},rule:'This bedroom’s very untidy.说明卧室的状态，bedroom’s在这里是bedroom is。'}
};
function create({element,art}){const base=core.unit12Grammar.create({element,art});return{...base,
 present(question,progress){base.present({...question,workshop:question.workshop||models[question.id]||{rule:question.explanation}},progress);element.querySelector('.grammar-model')?.classList.add('desk-model');},
 hasVisibleModel(){const model=element.querySelector('.grammar-model');return Boolean(model&&!model.hidden);}
};}
core.unit2930Grammar={create};
})(globalThis.CanranCore);
