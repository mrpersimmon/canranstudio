'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {UNITS}=require('../../server/catalog'),{definition}=require('../../server/progress');
const {loadCatalog}=require('../../scripts/review-bench');
const contract=require('../fixtures/learning-shell-content-contract.json');
const references=require('../../review-bench/references.json');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');

test('whole-book review catalog includes all 72 units and their original questions',async()=>{
  const catalog=await loadCatalog(process.cwd());
  assert.deepEqual(catalog.courses.map(c=>c.id),UNITS);
  for(const course of catalog.courses){
    const unit=definition(process.cwd(),course.id,'/lesson/');
    assert.equal(course.entries.filter(e=>e.kind==='question').length,Object.values(unit.questions).flat().length,course.id);
    assert.equal(new Set(course.entries.map(e=>e.id)).size,course.entries.length,course.id+' unique review entries');
    assert.equal(course.entries.filter(e=>e.kind==='reference').length,references[course.id].length,course.id+' authored reference panels');
  }
});

test('every paired course opts into the shared learning shell and exposes presentation progress',()=>{
  for(const id of UNITS){
    const html=fs.readFileSync(id+'/index.html','utf8'),source=fs.readFileSync(id+'/unit.js','utf8');
    for(const file of ['core/learning-flow.js','core/learning-flow.css','core/practice-screen.js','core/practice-screen.css'])assert.ok(html.includes('/'+file),id+' loads '+file);
    assert.match(source,/core\.learningProgress\s*=/,id+' publishes readonly progress');
    assert.match(source,/allowReview:\s*true/,id+' exposes readonly current-round history');
  }
});

test('word-card derivatives preserve teaching geometry and leave original assets intact',()=>{
 const receipt=require('../../assets/learning-words/receipt.json');
 assert.equal(receipt.units.length,72);
 for(const unit of receipt.units)for(const art of unit.items){
  assert.ok(fs.existsSync('.'+art.original),art.original);assert.ok(fs.existsSync('.'+art.adopted),art.adopted);
  if(art.method!=='native-vector-lighting')continue;
  const original=fs.readFileSync('.'+art.original,'utf8'),adopted=fs.readFileSync('.'+art.adopted,'utf8');
  const geometry=svg=>svg.replace(/<defs>[\s\S]*?<\/defs>/g,'').replace(/fill="[^"]*"/g,'fill="unchanged"');
  assert.equal(geometry(adopted),geometry(original),art.word+' retains all silhouettes, text and teaching positions');
 }
});

test('presentation rollout preserves all teaching definitions and existing reward artwork',()=>{
  assert.deepEqual(contract.units.map(u=>u.id),UNITS);
  for(const expected of contract.units){
    const u=definition(process.cwd(),expected.id,'/lesson/');
    assert.equal(u.version,expected.version,expected.id+' version');
    // The original Windows byte fingerprint remains in the fixture for provenance.
    // Git checks out LF on Linux; normalize only CRLF, preserving every other byte.
    assert.equal(hash(fs.readFileSync(expected.id+'/content.js','utf8').replace(/\r\n/g,'\n')),expected.contentLf,expected.id+' content source');
    assert.equal(hash(JSON.stringify(u.questions)),expected.questions,expected.id+' questions');
    assert.equal(hash(JSON.stringify(u.learning.WORDS)),expected.words,expected.id+' word data');
    assert.equal(hash(JSON.stringify(u.reward)),expected.reward,expected.id+' reward rules');
    assert.equal(hash(fs.readFileSync(expected.rewardPath)),expected.rewardImage,expected.id+' original keepsake art');
  }
});
