'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {encode,decode}=require('../../core/course-catalog-wire');
test('the complete authored catalog round-trips with every value and order intact',()=>{
  const course=require('../../content/learning-course.json'),wire=encode(course);
  assert.deepEqual(decode(JSON.parse(JSON.stringify(wire))),course);
  assert.equal(JSON.stringify(decode(wire)),JSON.stringify(course));
  assert.ok(Buffer.byteLength(JSON.stringify(wire))<Buffer.byteLength(JSON.stringify(course))*0.55);
});
test('transport distinguishes strings, references, primitives and special object keys',()=>{
  const values=JSON.parse('{"__proto__":{"safe":true},"constructor":7,"items":[-1,0,1,null,true,false,"",[],{},["same"],["same"]]}');
  assert.deepEqual(decode(encode(values)),values);
  assert.equal({}.safe,undefined);
  assert.throws(()=>encode({bad:undefined}),/JSON/);
});
test('corrupt transport fails closed instead of substituting incomplete course data',()=>{
  const wire=encode({lesson:'Lesson 144',tasks:[{answer:'done'}]});
  for(const change of [
    w=>{w.codec='unknown';},
    w=>{w.nodes[0][0]=9;},
    w=>{w.root=w.nodes.length;},
    w=>{w.nodes[0]=[0,0];},
    w=>{w.root=-w.strings.length-1;},
    w=>{w.root=[{}];},
    w=>{w.nodes[0]=[1,0,[true],0,[false]];}
  ]){const bad=structuredClone(wire);change(bad);assert.throws(()=>decode(bad));}
});
