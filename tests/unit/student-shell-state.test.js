'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {readLegacyRecords}=require('../../student-ui/legacy-records');
test('shared account legacy view reads anonymous copies without claiming student or pending data',()=>{
 const values=new Map([
  ['canran:lesson:unit1-2:learning:v1',JSON.stringify({activity:{unitCompleted:{a:1,b:1}}})],
  ['canran:l49:progress:v1',JSON.stringify({ratings:{a:3,b:4}})],
  ['canran:soundmark:progress:v1',JSON.stringify({ratings:{a:2}})],
  ['canran:student:other:canran:lesson:unit1-2:learning:v1','{}'],
  ['canran:student:me:pending:unit1-2','{}'],
  ['canran:unit3-4:learning:v1','broken'],
 ]);
 const before=[...values],storage={length:values.size,key:i=>[...values.keys()][i],getItem:k=>values.get(k)};
 assert.deepEqual(readLegacyRecords(storage).map(r=>[r.label,r.summary]),[['Lesson 1–2','2 项活动完成'],['Lesson 49','7 颗星'],['音标课程','2 颗星']]);
 assert.deepEqual([...values],before);
});
test('blocked or invalid storage cannot prevent opening account actions',()=>{
 assert.deepEqual(readLegacyRecords({get length(){throw Error('blocked');}}),[]);
 assert.deepEqual(readLegacyRecords({length:1,key:()=> 'canran:unit1-2:learning:v1',getItem:()=> 'null'}),[]);
});
