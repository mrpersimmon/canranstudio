'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {definition}=require('../../server/progress');
const registry=require('../../assets/word-art-v2/adoptions.json');
const units=['unit1-2','unit3-4','unit5-6','unit7-8','unit9-10','unit11-12'];
test('Lesson 1–12 has an individually reviewed presentation for every vocabulary item',()=>{
 const missing=[];
 for(const id of units) for(const word of definition(process.cwd(),id,'/').learning.WORDS){
  const adopted=registry.entries.find(x=>x.unit===id&&x.word===word.en&&x.status==='accepted');
  if(!adopted)missing.push(id+': '+word.en);
 }
 assert.deepEqual(missing,[], 'Vocabulary visual review is incomplete; layout results cannot approve artwork');
});
