'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {definition}=require('../../server/progress');
test('six context samples keep original words and use verified course sentences without changing definitions',()=>{
 assert.ok(fs.existsSync(path.resolve(__dirname,'../../review-bench/word-concept/data.js')),'Context card sample is not implemented');
 const {buildConceptData,conceptEntries}=require('../../review-bench/word-concept/data');
 const units=['unit1-2','unit7-8','unit9-10','unit11-12'].map(id=>definition(process.cwd(),id,'/'));
 const before=JSON.stringify(units),data=buildConceptData(units,require('../../assets/word-art-v2/adoptions.json'));
 assert.deepEqual(data.groups[0].cards.map(c=>c.en),['is','am','are','perhaps','today','very much']);
 for(const card of data.groups.flatMap(g=>g.cards)){
  const unit=units.find(u=>u.id===card.unit),word=unit.learning.WORDS.find(w=>w.en===card.en);
  assert.equal(card.cn,word.cn);assert.equal(card.ph,word.ph);
  if(card.type==='context'){
   assert.ok(card.example===word.example||unit.learning.DIALOGUE.some(l=>l.text===card.example));
   assert.ok(card.example.toLowerCase().includes(card.en));assert.equal(card.asset,undefined);
  }else assert.ok(card.asset.endsWith('.webp'));
 }
 assert.deepEqual(data.groups.map(g=>[...new Set(g.cards.map(c=>c.type))]),[['context'],['illustration']],'illustrations and sentence cards must never share a group');
 assert.deepEqual(data.groups.map(g=>g.cards.length),[6,6]);
 assert.equal(JSON.stringify(units),before);
 assert.equal(conceptEntries.length,2);
});
