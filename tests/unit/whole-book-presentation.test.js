'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {definition,normalize}=require('../../server/progress'),{profilesFor}=require('../../scripts/prepare-word-decks'),{createPages}=require('../../core/word-deck');
const units=Array.from({length:60},(_,i)=>'unit'+(25+i*2)+'-'+(26+i*2));
test('the remaining sixty units preserve every original word and stable reading anchors',()=>{
 let words=0,pages=0;
 for(const id of units){const unit=definition(process.cwd(),id,'/'),before=JSON.stringify(unit),profile=profilesFor(process.cwd(),id,unit);assert.ok(profile,id+' must have a complete word review');
  assert.deepEqual(Object.keys(profile),Array.from(unit.learning.WORDS,w=>w.en));const deck=createPages(unit.learning.WORDS,profile);words+=unit.learning.WORDS.length;pages+=deck.length;
  assert.equal(deck.length,Math.ceil(unit.learning.WORDS.length/6));assert.equal(new Set(deck.flatMap(p=>p.words.map(w=>w.en))).size,unit.learning.WORDS.length);
  const runtime={CanranCore:{}};vm.runInNewContext(fs.readFileSync(id+'/learning-words.js','utf8'),runtime);assert.deepEqual(JSON.parse(JSON.stringify(runtime.CanranCore.learningWordCards)),profile);
  const position={version:1,anchor:unit.learning.WORDS.at(-1).en,anchors:{}},saved=normalize({version:1,groups:{},records:{},activity:{unitWordDeck:position,unitWordPage:0}},unit,id);
  assert.deepEqual(saved.activity.unitWordDeck,position);assert.deepEqual(saved.records,{});assert.deepEqual(saved.groups,{});assert.equal(JSON.stringify(unit),before);
 }
 assert.equal(words,1601);assert.ok(pages>250);
});
test('all sixty real courses mount the shared deck and reviewed presentation layer',()=>{
 for(const id of units){const html=fs.readFileSync(id+'/index.html','utf8');for(const p of ['core/word-deck.js','core/word-deck.css','core/learning-sample.js','core/learning-sample.css',id+'/learning-words.js'])assert.ok(html.includes('/'+p),id+' '+p);assert.match(fs.readFileSync(id+'/unit.js','utf8'),/core\.wordDeck\.mount\(/);}
});

test('visual profiles preserve every declared story background and own the original pose data',()=>{
 for(const id of units){const box={CanranCore:{}};vm.runInNewContext(fs.readFileSync(id+'/learning-visual.js','utf8'),box);const spec=box.CanranCore.learningVisual;assert.ok(['picture','room-cast','plane','cast','composite','forest'].includes(spec.layout));for(const source of [spec.background,spec.fullScene?.image,...Object.values(spec.backgroundStates||{}).flatMap(Object.values)].filter(Boolean))assert.ok(fs.existsSync('.'+source),id+' '+source);assert.ok(!Object.keys(spec).some(k=>['questions','answers','learning','reward'].includes(k)));}
});
test('whole-book source changes enter scoped impact checks instead of document-only shortcuts',()=>{
 const workflow=require('../../scripts/check-workflow.config');for(const file of ['docs/designs/word-cards/lesson25-144-classification.json','unit95-96/learning-visual.js','core/word-deck.js'])assert.ok(workflow.select([file]).includes('whole-book-presentation-unit'));
 const task=workflow.tasks(process.cwd(),['unit95-96/learning-visual.js'])['browser-whole-book-presentation'];assert.ok(task.args.includes('--course-scope=unit95-96'));
});

test('polysemous words use this lesson meaning instead of an unrelated reused image',()=>{
 const review=require('../../docs/designs/word-cards/lesson25-144-classification.json').units;
 for(const[id,word]of [['unit123-124','Australia'],['unit125-126','water'],['unit101-102','little'],['unit109-110','little'],['unit95-96','catch'],['unit99-100','catch']])assert.equal(review[id][word].kind,'context');
 const oranges=require('../../docs/designs/word-cards/lesson25-144-artwork-plan.json').entries.find(e=>e.unit==='unit83-84'&&e.word==='oranges');assert.equal(oranges.composition.sources.length,2);assert.ok(oranges.composition.sources.every(s=>s.includes('orange-fruit')));
});

test('review material states reference real original question images',()=>{
 const index=require('../../review-bench/material-entries.json');let count=0;
 for(const[id,keys]of Object.entries(index)){const unit=definition(process.cwd(),id,'/');for(const key of keys){const question=Object.values(unit.questions).flat().find(q=>q.id===key);assert.ok(question?.image,id+' '+key);count++;}}
 assert.equal(count,31);
});

test('George reading in bed and the downstairs light remain nighttime states',()=>{
 const spec=require('../../docs/designs/learning-flow/lesson25-144-scenes.json')['unit119-120'];assert.ok(spec.background.includes('night-dark'));assert.ok(spec.backgroundStates.place.bedroom.includes('night-home'));assert.ok(spec.backgroundStates.place.lit.includes('night-home'));
});
