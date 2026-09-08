'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {getCourse,validateCourse}=require('../../core/learning-course-catalog');
const {setup}=require('./support/course-harness');
const baseline=require('../../content/expansion/lesson1-6-baseline.json');
const unit=getCourse();
test('a blank targets a whole word instead of matching his inside This',()=>{
  const {testedSpan}=require('../../scripts/lib/textbook-authoring');
  assert.deepEqual(testedSpan('This is his shirt.','his'),{prefix:'This is ',suffix:' shirt.'});
  assert.deepEqual(testedSpan('They are coming out of the building.','out of'),{prefix:'They are coming ',suffix:' the building.'});
  assert.throws(()=>testedSpan('This is a shirt.','his'),/absent/);
  for(const a of Object.values(unit.activities).filter(a=>a.cloze)){
    const answer=a.options.find(o=>a.answer.includes(o.id)).text;
    assert.ok(!/[a-z]$/i.test(a.cloze.prefix)||!/^[a-z]/i.test(answer),a.id);
    assert.ok(!/^[a-z]/i.test(a.cloze.suffix)||!/[a-z]$/i.test(answer),a.id);
  }
  for(const c of unit.challenges)for(const q of c.questions.filter(q=>q.kind==='gap')){
    const source=unit.sources[q.sourceRef].text;
    assert.deepEqual({prefix:q.prefix,suffix:q.suffix},testedSpan(source,q.answers[0]),q.id);
  }
});

test('all 72 textbook pairs have original text, teaching, retrieval and an optional written challenge',()=>{
  assert.deepEqual(unit.lessonIds,Array.from({length:144},(_,i)=>i+1));
  assert.equal(unit.chapters.length,72);
  assert.equal(unit.referenceGroups.length,144);
  const introduced=new Set(Object.values(baseline.activities).flatMap(a=>a.sourceRefs));
  for(let lesson=7;lesson<=143;lesson+=2){
    const chapter=unit.chapters.find(c=>c.lessonIds[0]===lesson);
    assert.deepEqual(chapter.lessonIds,[lesson,lesson+1]);
    const nodes=unit.nodes.filter(n=>n.chapterId===chapter.id);
    const acts=nodes.flatMap(n=>n.activityIds.map(id=>unit.activities[id]));
    const story=acts.find(a=>a.kind==='interactive-story');
    assert.ok(story,lesson);
    const original=Object.values(unit.sources).filter(s=>s.lessonId===lesson&&['dialogue','narrative'].includes(s.sourceKind));
    assert.deepEqual(story.beats.filter(b=>b.kind==='line').map(b=>b.ref),original.map(s=>s.sourceId));
    assert.ok(story.beats.some(b=>b.kind==='checkpoint'));
    const taught=new Set(acts.filter(a=>a.kind==='teach').flatMap(a=>a.items.map(i=>i.sourceRef)));
    for(const ref of [...taught,...story.sourceRefs])introduced.add(ref);
    const words=Object.values(unit.sources).filter(s=>[lesson,lesson+1].includes(s.lessonId)&&s.sourceKind==='vocabulary'&&!['cigarette','tobacco','Scotch whisky','wine','beer'].includes(s.text));
    for(const word of words)assert.ok(taught.has(word.sourceId),'word never introduced: '+word.sourceId);
    const challenge=unit.challenges.find(c=>c.unlockNodeId===nodes.at(-1).id);
    assert.ok(challenge,'missing challenge for '+lesson);
    assert.ok(challenge.questions.some(q=>q.kind==='translation'));
    assert.ok(challenge.questions.some(q=>q.kind==='gap'));
    for(const q of challenge.questions)assert.ok(introduced.has(q.sourceRef),'challenge precedes teaching: '+q.id+' '+q.sourceRef);
    assert.ok(acts.some(a=>a.kind==='order'));
    assert.ok(acts.some(a=>a.kind==='cloze'));
  }
});

test('the six-lesson catalog and its learner identity remain unchanged when the course expands',()=>{
  assert.equal(unit.unitId,baseline.unitId);
  assert.equal(unit.experienceRevision,baseline.experienceRevision);
  assert.notEqual(unit.releaseRevision,unit.experienceRevision);
  for(const [id,activity] of Object.entries(baseline.activities))assert.deepEqual(unit.activities[id],activity,id);
  for(const node of baseline.nodes)assert.deepEqual(unit.nodes.find(n=>n.id===node.id),node,node.id);
  const old=setup({unit:baseline});for(const node of baseline.nodes)old.finish(node.id);
  const before=JSON.stringify(old.adapter.load(old.rt.storageKey));
  const upgraded=setup({adapter:old.adapter});
  assert.equal(upgraded.view().completedCount,baseline.nodes.length);
  assert.deepEqual(upgraded.view().record,old.view().record);
  assert.equal(JSON.stringify(old.adapter.load(old.rt.storageKey)),before);
  assert.equal(upgraded.view().nodes.find(n=>n.id==='L07-STORY').available,true);
  upgraded.send({type:'open-node',nodeId:'L07-STORY'});
  assert.equal(upgraded.view().activityId,'L07:story');
});

test('expansion preserves a six-lesson reset backup and restores it without inventing new progress',()=>{
  const old=setup({unit:baseline});old.finish('K01');
  const before=structuredClone(old.view().record);
  old.send({type:'map'});old.send({type:'reset-request',scope:'course'});old.send({type:'reset-confirm'});
  assert.ok(old.view().record.resetBackup);
  const upgraded=setup({adapter:old.adapter});
  assert.equal(upgraded.view().completedCount,0);
  upgraded.send({type:'reset-undo'});
  assert.deepEqual(upgraded.view().record,before);
  assert.equal(upgraded.view().completedCount,1);
  assert.equal(upgraded.view().nodes.find(n=>n.id==='L07-STORY').available,false);
});

test('source completeness, scene identity and lesson-pair bounds are enforced on expanded content',()=>{
  const missing=structuredClone(unit);missing.activities['L25:story'].beats.pop();
  assert.ok(validateCourse(missing).length);
  const person=structuredClone(unit);person.entities['L49-actor-butcher'].characterSpecies='human';
  assert.ok(validateCourse(person).some(e=>e.includes('cat')));
  const wrong=structuredClone(unit);wrong.chapters.at(-1).lessonIds=[49,51];
  assert.ok(validateCourse(wrong).length);
});
