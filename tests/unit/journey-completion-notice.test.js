'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {takeNewCompletions}=require('../../course-journey/completion-notice');
const course=(id,stars)=>({id,stars,maxStars:5});
function memory(){const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};}

test('已有满星首次访问安静展示；看过未满星后真正集齐只庆祝一次',()=>{
  const storage=memory(),historical=course('unit1-2',5),next=course('unit3-4',1);
  assert.deepEqual(takeNewCompletions(storage,'a',[historical,next]),[]);
  assert.deepEqual(takeNewCompletions(storage,'a',[historical,course(next.id,5)]),[next.id]);
  assert.deepEqual(takeNewCompletions(storage,'a',[historical,course(next.id,5)]),[]);
  assert.equal(next.stars,1);assert.equal(historical.stars,5);
});
test('提醒按学生隔离，新增授权和重新授权不会伪造一次新满星',()=>{
  const storage=memory();
  takeNewCompletions(storage,'a',[course('unit1-2',0)]);
  assert.deepEqual(takeNewCompletions(storage,'b',[course('unit1-2',5)]),[]);
  assert.deepEqual(takeNewCompletions(storage,'a',[course('unit1-2',5),course('unit5-6',5)]),['unit1-2']);
  takeNewCompletions(storage,'a',[]);
  assert.deepEqual(takeNewCompletions(storage,'a',[course('unit5-6',5)]),[]);
});
test('存储禁用或旧记录损坏不妨碍首页，也不把历史成绩当作新奖励',()=>{
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  assert.deepEqual(takeNewCompletions(blocked,'a',[course('unit1-2',5)]),[]);
  const corrupt={getItem:()=>'{broken',setItem(){}};
  assert.deepEqual(takeNewCompletions(corrupt,'a',[course('unit1-2',5)]),[]);
});
