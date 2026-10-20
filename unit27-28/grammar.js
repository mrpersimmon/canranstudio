(function(core){
'use strict';
const models={
 'u2728-v1-plural-existence':{model:{lines:[['There is a book on the desk. → There are some books on the desk.','一本书变成一些书，book变books，is也要变are；地点不变。']]},rule:'armchairs是复数物品，这个存在句用There are。some后面还可以是不可数物质，要继续看名词。'},
 'u2728-v1-ask-existence':{model:{lines:[['Are there any cups in the cupboard? / Where are the cups?','前一句问橱柜里有没有杯子；后一句问这些杯子在哪里。先确定想知道哪种信息。']]},rule:'想知道房间里有没有图画，用Are there any…?；Where are…?问的是位置。'}
};
function create({element,art}){const base=core.unit12Grammar.create({element,art});return{...base,
 present(question,progress){base.present({...question,workshop:question.workshop||models[question.id]||{rule:question.explanation}},progress);element.querySelector('.grammar-model')?.classList.add('desk-model');},
 hasVisibleModel(){const model=element.querySelector('.grammar-model');return Boolean(model&&!model.hidden);}
};}
core.unit2728Grammar={create};
})(globalThis.CanranCore);
