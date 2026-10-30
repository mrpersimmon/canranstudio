'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const model=require('../../award-book/model');
const view=require('../../core/award-collection-view');
const catalog=require('../../server/award-catalog');
const cards=Object.entries(catalog).map(([course,editions])=>{
 const [edition,meta]=Object.entries(editions).at(-1);
 return {id:course+':'+edition,course,edition,...meta,current:true,name:'收藏同学',stars:5,date:'2026.10.16'};
}).sort((a,b)=>model.range(a)[0]-model.range(b)[0]);
test('72 owned units are grouped exactly once into 24 stable three-card letters',()=>{
 const before=JSON.stringify(cards),groups=model.chapters([...cards].reverse());
 assert.equal(cards.length,72);assert.equal(groups.length,24);
 assert.deepEqual(groups.flatMap(group=>group.cards.map(card=>card.course)),cards.map(card=>card.course));
 assert.ok(groups.every(group=>group.slots.length===3&&group.cards.length===3));
 assert.equal(groups[0].name,'初识小镇');assert.equal(groups[1].name,'邻里来信');assert.equal(groups[23].label,'Lesson 139–144');
 assert.equal(JSON.stringify(cards),before,'grouping must not rewrite personal card data');
});
test('numeric search uses exact lesson intervals, normalized full-width text and overlapping ranges',()=>{
 const find=q=>cards.filter(card=>model.matches(card,q)).map(card=>card.course);
 assert.deepEqual(find('2'),['unit1-2']);assert.deepEqual(find('Lesson ８'),['unit7-8']);
 assert.deepEqual(find('Ｌｅｓｓｏｎ　１４４'),['unit143-144']);assert.deepEqual(find('第１１课'),['unit11-12']);
 assert.deepEqual(find('7—12'),['unit7-8','unit9-10','unit11-12']);assert.deepEqual(find('8至9'),['unit7-8','unit9-10']);
 assert.deepEqual(find('12-7'),[]);assert.deepEqual(find('145'),[]);assert.equal(find('').length,72);
 assert.ok(find('礼貌').includes('unit1-2'));assert.deepEqual(find('不存在的卡名'),[]);
});
test('sparse collections keep stable positions, partial stars and earned cards after course closure',()=>{
 const first={...cards[0],stars:1,date:null},last=cards[2],groups=model.chapters([last,first]);
 assert.equal(groups.length,1);assert.deepEqual(groups[0].slots.map(slot=>slot.card?.course||null),['unit1-2',null,'unit5-6']);
 assert.strictEqual(groups[0].cards[0],first);assert.equal(first.stars,1);assert.equal(first.date,null);
 assert.strictEqual(model.adjacent(groups[0],first,1),last);assert.equal(model.adjacent(groups[0],last,1),null);
 assert.deepEqual(model.chapters([]),[]);
});
test('session restoration never selects another owner or an absent chapter card',()=>{
 const group=model.chapters(cards)[1];assert.strictEqual(model.rememberedCard(group,cards[5].id),cards[5]);
 assert.strictEqual(model.rememberedCard(group,cards[0].id),cards[3]);
 assert.strictEqual(model.restore(cards,'other-owner:missing'),cards[0]);assert.equal(model.restore([],'missing'),null);
 assert.equal(model.chapterFor(model.chapters(cards),cards[5]).id,'neighborhood');
});
test('old editions retain their names and dates without duplicating the chapter primary card',()=>{
 const old={...cards[0],id:'old',edition:'old',current:false,name:'原姓名',stars:2,date:null};
 const {primary,history}=view.split([...cards,old]);assert.equal(primary.length,72);assert.deepEqual(history,[old]);
 assert.equal(model.chapters(primary)[0].cards.length,3);assert.equal(old.name,'原姓名');assert.equal(old.stars,2);
});
test('an owned card outside the current course catalog remains accessible',()=>{
 const future={id:'future',course:'unit145-146',lesson:'Lesson 145–146',name:'历史同学',stars:3};
 const groups=model.chapters([...cards,future]);assert.strictEqual(groups.at(-1).cards[0],future);
 assert.strictEqual(model.chapterFor(groups,future),groups.at(-1));
});
