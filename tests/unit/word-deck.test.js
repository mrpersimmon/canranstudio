'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {definition,normalize}=require('../../server/progress');
const root=path.resolve(__dirname,'../..'),units=['unit1-2','unit3-4','unit5-6','unit7-8','unit9-10','unit11-12'];
function model(){assert.ok(fs.existsSync(path.join(root,'core/word-deck.js')),'The grouped course word deck is not implemented');return require('../../core/word-deck');}
test('all 132 course words have exactly one reviewed group and authentic context sources',()=>{
 assert.ok(fs.existsSync(path.join(root,'docs/designs/word-cards/lesson1-12-classification.json')),'Word-by-word classification is missing');
 const {compileProfiles}=require('../../scripts/prepare-word-decks');const registry=require('../../docs/designs/word-cards/lesson1-12-classification.json');
 let count=0;
 for(const id of units){const unit=JSON.parse(JSON.stringify(definition(root,id,'/'))),before=JSON.stringify(unit),profiles=compileProfiles(unit,registry.units[id]);
  assert.deepEqual(Object.keys(profiles),unit.learning.WORDS.map(w=>w.en));count+=Object.keys(profiles).length;
  const runtime={CanranCore:{}};vm.runInNewContext(fs.readFileSync(path.join(root,id,'learning-words.js'),'utf8'),runtime);assert.deepEqual(JSON.parse(JSON.stringify(runtime.CanranCore.learningWordCards)),profiles,id+' compiled word profiles are current');
  const pages=model().createPages(unit.learning.WORDS,profiles),words=pages.flatMap(p=>p.words.map(w=>w.en));
  assert.equal(words.length,unit.learning.WORDS.length);assert.equal(new Set(words).size,words.length);
  assert.equal(pages.length,Math.ceil(unit.learning.WORDS.length/6));
  for(const [index,page]of pages.entries())assert.equal(page.words.length,index===pages.length-1?unit.learning.WORDS.length-index*6:6);
  assert.deepEqual(words,['illustration','context'].flatMap(kind=>unit.learning.WORDS.filter(w=>profiles[w.en].kind===kind).map(w=>w.en)),'illustrations first, contexts immediately after, no artificial blank slots');
  assert.equal(JSON.stringify(unit),before);
 }
 assert.equal(count,132);
});
test('legacy page positions migrate by the original word, and newer anchors survive regrouping',()=>{
 const deck=model(),words='abcdefghijklm'.split('').map(en=>({en})),profiles=Object.fromEntries(words.map((w,i)=>[w.en,{kind:i%2?'context':'illustration'}]));
 const pages=deck.createPages(words,profiles);
 assert.deepEqual(pages.map(p=>p.words.map(w=>w.en).join('')),['acegik','mbdfhj','l']);
 assert.deepEqual(deck.restore(pages,words,null,1),{index:0,anchor:'g'});
 assert.deepEqual(deck.restore(pages,words,{version:1,anchor:'j'},0),{index:1,anchor:'j'});
 assert.deepEqual(deck.restore(pages,words,{version:1,anchor:'missing'},2),{index:1,anchor:'m'});
 assert.equal(deck.createPages(words,Object.fromEntries(words.map(w=>[w.en,{kind:'context'}]))).every(p=>p.kind==='context'),true);
});
test('word position sync is metadata and cannot award stars or manufacture answers',()=>{
 const unit=definition(root,'unit1-2','/');const value={version:1,groups:{},records:{},activity:{unitWordPage:2,unitWordDeck:{version:1,anchor:'is',anchors:{context:'is',illustration:'pen'}},unitCompleted:{listen:'forged'}}};
 const actual=normalize(value,unit,'unit1-2');
 assert.deepEqual(actual.activity.unitWordDeck,value.activity.unitWordDeck);
 assert.equal(actual.activity.unitWordPage,2);assert.deepEqual(actual.groups,{});assert.deepEqual(actual.records,{});assert.deepEqual(actual.activity.unitCompleted,{});
 const invalid=normalize({...value,activity:{unitWordPage:999,unitWordDeck:{version:1,anchor:'unknown'}}},unit,'unit1-2');
 assert.equal(invalid.activity.unitWordDeck,undefined);assert.equal(invalid.activity.unitWordPage,undefined);
});
test('new learners start with the first available group, while a real legacy page zero keeps its word',()=>{
 const deck=model(),words=[{en:'whose'},{en:'blue'}],pages=deck.createPages(words,{whose:{kind:'context'},blue:{kind:'illustration'}});
 assert.deepEqual(deck.restore(pages,words,null,undefined),{index:0,anchor:'blue'});
 assert.deepEqual(deck.restore(pages,words,null,0),{index:0,anchor:'whose'});
});
