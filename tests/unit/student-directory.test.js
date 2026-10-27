'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const directory=require('../../server/public/course-directory');
const collection=require('../../core/award-collection-view');

test('course book searches exact Lesson numbers and titles within the authorized list',()=>{
  const courses=[{id:'unit31-32',title:'花园观察小队',label:'Lesson 31–32'}, {id:'unit1-2',title:'礼貌小帮手',label:'Lesson 1–2'}, {id:'unit11-12',title:'失物招领小侦探',label:'Lesson 11–12'}];
  assert.deepEqual(courses.filter(course=>directory.matches(course,'2')).map(course=>course.id),['unit1-2']);
  assert.deepEqual(courses.filter(course=>directory.matches(course,'lesson 32')).map(course=>course.id),['unit31-32']);
  assert.equal(directory.matches(courses[0],'花园'),true);
  assert.equal(directory.matches(courses[0],'31-32'),true);
  assert.equal(directory.matches(courses[0],'不存在'),false);
  assert.deepEqual(courses.filter(course=>directory.matches(course,'50')),[]);
  assert.equal(directory.matches({id:'unit49-50',title:'晚餐采购大冒险'},'Lesson 50'),true);
});

test('course book page bounds keep the first, last, and only authorized course reachable',()=>{
  const courses=Array.from({length:45},(_,i)=>({id:`unit${i*2+1}-${i*2+2}`}));
  assert.equal(directory.page(courses,-1).index,0);
  assert.equal(directory.page(courses,0).previous,false);
  assert.equal(directory.page(courses,44).next,false);
  assert.equal(directory.page(courses,99).course.id,'unit89-90');
  assert.equal(directory.page(courses,24).course.id,'unit49-50');
  assert.equal(directory.page([courses[24]],0).total,1);
  assert.equal(directory.page([],0),null);
});

test('one main card per course; historical stars and first-earned dates are preserved independently',()=>{
  const old={id:'unit1-2:old',course:'unit1-2',edition:'old',current:false,stars:5,firstFullStarAt:'2026-09-01T00:00:00Z'};
  const current={id:'unit1-2:new',course:'unit1-2',edition:'new',current:true,stars:1,firstFullStarAt:null};
  const onlyOld={id:'unit3-4:old',course:'unit3-4',edition:'old',current:false,stars:5,firstFullStarAt:'2026-09-02T00:00:00Z'};
  const input=[old,current,onlyOld];
  const before=JSON.stringify(input);
  const result=collection.split(input);
  assert.deepEqual(result.primary.map(card=>card.id),[current.id,onlyOld.id]);
  assert.deepEqual(result.history,[old]);
  assert.equal(result.primary[0].stars,1);
  assert.equal(result.history[0].firstFullStarAt,'2026-09-01T00:00:00Z');
  assert.equal(JSON.stringify(input),before);
  assert.deepEqual(collection.split([]),{primary:[],history:[]});
});
