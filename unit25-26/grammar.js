(function(core){
'use strict';
const models={
 'u2526-types-v1-t08':{model:{lines:[['There is a pen in the box.','钢笔在盒子里面，用in；物品放在表面上时用on。']]},rule:'勺子在杯子里面，选in；旁边的叉子在罐子表面上，用on。'},
 'u2526-clicks-v1-clean':{model:{lines:[['The plate is clean.','盘子是干净的。clean说明是否清洁，empty说明里面有没有东西，不能互相代替。']]},rule:'题目说明杯子干净，用clean；没有说它是空的，也不能据此猜空满。'},
 'u2526-types-v1-t10':{model:{lines:[['Where is the book? It is on the table.','Where问位置，回答书在哪里；颜色、空满和物品名称是不同信息。']]},rule:'Where问在哪里；根据阅读材料，玻璃杯在橱柜里。'}
};
function create({element,art}){const base=core.unit12Grammar.create({element,art});return{...base,
 present(question,progress){base.present({...question,workshop:question.workshop||models[question.id]||{rule:question.explanation}},progress);element.querySelector('.grammar-model')?.classList.add('desk-model');},
 hasVisibleModel(){const model=element.querySelector('.grammar-model');return Boolean(model&&!model.hidden);}
};}
core.unit2526Grammar={create};
})(globalThis.CanranCore);
