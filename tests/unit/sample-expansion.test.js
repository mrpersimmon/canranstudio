'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {definition,normalize}=require('../../server/progress'),{profilesFor}=require('../../scripts/prepare-word-decks');
const {createPages}=require('../../core/word-deck');
const units=Array.from({length:6},(_,i)=>'unit'+(13+i*2)+'-'+(14+i*2));
test('Lesson 13–24 has reviewed word presentation and keeps original words and page anchors',()=>{
 let count=0;
 for(const id of units){
  const unit=definition(process.cwd(),id,'/'),before=JSON.stringify(unit),profiles=profilesFor(process.cwd(),id,unit);
  assert.ok(profiles,id+' needs an individually reviewed word deck');
  const scope={CanranCore:{}};vm.runInNewContext(fs.readFileSync(id+'/learning-words.js','utf8'),scope);
  assert.deepEqual(JSON.parse(JSON.stringify(scope.CanranCore.learningWordCards)),profiles);
  const pages=createPages(unit.learning.WORDS,profiles);count+=unit.learning.WORDS.length;
  assert.deepEqual(pages.flatMap(p=>p.words.map(w=>w.en)),['illustration','context'].flatMap(kind=>unit.learning.WORDS.filter(w=>profiles[w.en].kind===kind).map(w=>w.en)));
  assert.equal(pages.length,Math.ceil(unit.learning.WORDS.length/6));assert.equal(JSON.stringify(unit),before);
  const anchor=unit.learning.WORDS.at(-1).en,position={version:1,anchor,anchors:{context:anchor}};
  const value=normalize({version:1,groups:{},records:{},activity:{unitWordDeck:position,unitWordPage:1}},unit,id);
  assert.deepEqual(value.activity.unitWordDeck,position);assert.deepEqual(value.groups,{});assert.deepEqual(value.records,{});
 }
 assert.equal(count,176);
});
test('every expanded course uses the reviewed visual adapter without replacing its original keepsake',()=>{
 for(const id of units){
  const html=fs.readFileSync(id+'/index.html','utf8');for(const file of ['core/learning-sample.js','core/learning-sample.css','core/word-deck.js','core/word-deck.css',id+'/learning-words.js'])assert.ok(html.includes('/'+file),id+' '+file);
  assert.match(fs.readFileSync(id+'/unit.js','utf8'),/core\.wordDeck\.mount\(/);
  const unit=definition(process.cwd(),id,'/');assert.equal(unit.reward.scene,'/assets/'+id+'/keepsake-story-v1.webp');
 }
});

test('all 115 illustrated words have accepted sources and actual phone evidence',()=>{
 const registry=require('../../assets/word-art-v2/adoptions.json');let count=0;
 for(const id of units){const unit=definition(process.cwd(),id,'/'),profiles=profilesFor(process.cwd(),id,unit);
  for(const word of unit.learning.WORDS){if(profiles[word.en].kind==='context')continue;count++;const item=registry.entries.find(x=>x.unit===id&&x.word===word.en);assert.equal(item?.status,'accepted',id+' '+word.en);for(const evidence of item.screenEvidence)assert.ok(fs.existsSync(evidence),evidence);}
 }
 assert.equal(count,115);
});

test('review bench exposes the same continuous pages for the six expanded units',async()=>{
 const {loadCatalog}=require('../../scripts/review-bench'),catalog=await loadCatalog(process.cwd());
 for(const id of units){const unit=definition(process.cwd(),id,'/'),pages=createPages(unit.learning.WORDS,profilesFor(process.cwd(),id,unit));const entries=catalog.courses.find(c=>c.id===id).entries.filter(e=>e.kind==='words');assert.deepEqual(entries.map(e=>e.wordKeys),pages.map(p=>p.words.map(w=>w.en)));}
});

test('travel word flags hide translated captions and preserve exact teaching flag pixels',async()=>{
 const sharp=require('sharp');
 for(const word of ['danish','norwegian','russian','dutch','swedish','english','american']){
  const source='assets/unit15-16/'+word+'.svg',target='assets/word-art-v2/sample13-24/flags/'+word+'.svg',svg=fs.readFileSync(target,'utf8');assert.doesNotMatch(svg,/\p{Script=Han}|aria-label=|data-label=|<text\b/u);
  const meta=await sharp(source).metadata(),crop={left:0,top:0,width:meta.width,height:meta.width===160?118:90};
  assert.deepEqual(await sharp(target).extract(crop).ensureAlpha().raw().toBuffer(),await sharp(source).extract(crop).ensureAlpha().raw().toBuffer(),word+' flag geometry');
 }
});
