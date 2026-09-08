'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const unit=require('../../content/learning-course.json'),preserved=require('../../content/expansion/lesson1-50-preservation.json');
const {setup}=require('./support/course-harness');
test('learner notes keep language explanations separate from authoring and implementation instructions',()=>{
  const notes=Object.values(unit.sources).filter(s=>s.lessonId>50&&s.sourceKind==='course-note');
  assert.ok(notes.length>=47);
  for(const note of notes)assert.doesNotMatch(note.text,/新练习|主动练习|不设计.*操作|不把.*奖励|不进入.*练习|设为.*任务|catalog|编译/,note.sourceId);
});
const canonical=value=>JSON.stringify(sort(value));
function sort(value){if(Array.isArray(value))return value.map(sort);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,sort(value[k])]));return value;}
test('expanding to 144 does not change any first-50 node, task, answer, source or reference contract',()=>{
  for(const [field,hashes]of Object.entries(preserved)){
    const index=Array.isArray(unit[field])?Object.fromEntries(unit[field].map(x=>[x.id,x])):unit[field];
    for(const [id,expected]of Object.entries(hashes))assert.equal(crypto.createHash('sha256').update(canonical(index[id])).digest('hex'),expected,field+'/'+id);
  }
});
test('new authoring has continuous pairs, complete original stories and correct post-test PDF page offsets',()=>{
  const authored=require('../../content/book1');
  assert.deepEqual(authored.map(x=>x.lesson),Array.from({length:47},(_,i)=>51+i*2));
  for(const lesson of authored){
    const story=unit.activities['L'+lesson.lesson+':story'];
    assert.deepEqual(story.beats.filter(x=>x.kind==='line').map(x=>unit.sources[x.ref].text),lesson.lines.trim().split('\n').filter(Boolean).map(x=>x.split('|')[1]));
    const rows=lesson.checks.trim().split('\n');
    assert.equal(story.beats.filter(x=>x.kind==='checkpoint').length,rows.length);
    for(const id of [lesson.lesson,lesson.lesson+1]){
      const sources=Object.values(unit.sources).filter(s=>s.lessonId===id);
      assert.ok(sources.length);
      for(const source of sources)assert.equal(source.sourcePage,33+id*2+(id>=73?4:0),source.sourceId);
    }
  }
  for(const id of ['lesson88','lesson90'])assert.ok(unit.referenceGroups.find(x=>x.id===id).sourceRefs.some(x=>x.includes('-N-FORM')));
});
test('new recordings keep full natural utterances, explicit pronunciations and original first-50 audio addresses',()=>{
  const requests=require('../../content/expansion/audio-request.json');
  assert.equal(requests.revision,'f3ff3571791e39611d31c381e3a41a3af07b4987');
  for(const item of requests.items){
    const source=unit.sources[item.sourceId];
    assert.equal(item.text,source.text);assert.equal(item.speed,1);
    assert.equal(item.renderMode,'natural-utterance');
    assert.equal(item.outputPath,'.'+source.audioSrc);
    assert.ok(source.audioSrc.startsWith(source.lessonId>50?'/assets/lesson1-144/audio/':'/assets/lesson1-50/audio/'));
    if(source.lessonId>50)assert.deepEqual(item.phonemeOverrides,{pamela:'pˈæmələ',ann:'ˈæn',christine:'kɹɪstˈin',...require('../../content/book1/pronunciations.json')});
  }
});
test('typed challenges accept reviewed relative clauses, contractions and clock variants but reject grammar changes',()=>{
  const {accepts}=require('../../core/learning-challenges');
  const questions=unit.challenges.flatMap(x=>x.questions),find=id=>questions.find(x=>x.id===id);
  for(const [id,text]of [['CH121-122-0','that'],['CH139-140-0','whether'],['CH57-58-7',"It's eight fifteen."],['CH65-66-7','We must leave at three forty-five.']])assert.equal(accepts(find(id),text),true,id);
  assert.equal(accepts(find('CH121-122-0'),'what'),false);
  assert.equal(accepts(find('CH57-58-7'),"It's eight fifty."),false);
  for(const q of questions){assert.ok(q.answers.every(x=>x.length<=180),q.id);if(q.kind==='gap')assert.ok((q.prefix+q.answers[0]+q.suffix).length<=240,q.id);}
});
test('written answers distinguish auxiliary contractions from main verbs and modal complements',()=>{
  const {accepts}=require('../../core/learning-challenges');
  const questions=unit.challenges.flatMap(x=>x.questions),find=id=>questions.find(x=>x.id===id);
  for(const [id,text]of [
    ['CH61-62-5',"He's a toothache."],
    ['CH67-68-recall-0',"Can I've the key, please?"],
    ['CH109-110-1',"She's fewer books than me."],
    ['CH111-112-recall-1',"She's fewer books than me."],
    ['CH125-126-1',"She's to leave immediately."],
    ['CH127-128-recall-1',"She's to leave immediately."]
  ])assert.equal(accepts(find(id),text),false,id+' rejects '+text);
  for(const [id,text]of [
    ['CH61-62-5','He has a toothache.'],
    ['CH67-68-recall-0','Can I have the key, please?'],
    ['CH109-110-1','She has fewer books than me.'],
    ['CH125-126-1','She has to leave immediately.'],
    ['CH83-84-1',"She's just had some fruit."],
    ['CH89-90-3',"He's done his homework."],
    ['CH113-114-1',"I've got none."]
  ])assert.equal(accepts(find(id),text),true,id+' accepts '+text);
  const reviewed=require('../../content/book1/accepted-translations.json');
  for(const [ref,entry]of Object.entries(reviewed)){
    assert.equal(entry.canonical,unit.sources[ref].text,ref+' review matches source');
    const translations=questions.filter(q=>q.kind==='translation'&&q.sourceRef===ref&&Number(q.id.match(/^CH(\d+)/)?.[1])>50);
    assert.ok(translations.length,ref+' is exercised');
    for(const q of translations)for(const answer of entry.alternatives)assert.equal(accepts(q,answer),true,q.id+' accepts reviewed '+answer);
  }
});
test('a finished first-50 record survives upgrade and resumes at Lesson 51 without inventing progress',()=>{
  const oldUnit=structuredClone(unit);
  for(const [field,hashes]of Object.entries(preserved))oldUnit[field]=Array.isArray(unit[field])?oldUnit[field].filter(x=>hashes[x.id]):Object.fromEntries(Object.entries(oldUnit[field]).filter(([id])=>hashes[id]));
  oldUnit.lessonIds=Array.from({length:50},(_,i)=>i+1);
  oldUnit.checkpointIds=oldUnit.nodes.flatMap(n=>n.checkpointIds);
  const old=setup({unit:oldUnit});for(const node of oldUnit.nodes)old.finish(node.id);
  old.send({type:'map'});
  const before=structuredClone(old.view().record),stored=JSON.stringify(old.adapter.load(old.rt.storageKey));
  const upgraded=setup({adapter:old.adapter});
  assert.deepEqual(upgraded.view().record,before);
  assert.equal(JSON.stringify(old.adapter.load(old.rt.storageKey)),stored);
  assert.equal(upgraded.view().completedCount,129);
  assert.equal(upgraded.view().nodes.find(x=>x.id==='L51-STORY').available,true);
  assert.equal(upgraded.view().nodes.find(x=>x.id==='L53-STORY').available,false);
  upgraded.send({type:'open-node',nodeId:'L51-STORY'});
  assert.equal(upgraded.view().activityId,'L51:story');
});
