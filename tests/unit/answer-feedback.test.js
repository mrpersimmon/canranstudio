'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const unit=require('../../content/learning-course.json');
const {setup}=require('./support/course-harness');
const {answer}=require('./support/tap-exercise');
const scene=require('../../core/learning-path-scene');
test('all live order tiles omit punctuation while source sentences keep it',()=>{
  const questions=[...Object.values(unit.activities),...unit.challenges.flatMap(c=>c.questions),...unit.placement.questions,...unit.grammar.delayedQuestions];
  const order=questions.filter(q=>q.kind==='order'||q.mechanism==='order');
  assert.ok(order.length>500);
  for(const q of order)for(const o of q.options){
    assert.ok(o.text.trim(),q.id+' empty tile');
    assert.doesNotMatch(o.text.replace(/(?<=[\p{L}\p{N}])['’\-](?=[\p{L}\p{N}])/gu,''),/[\p{P}\p{S}]/u,q.id+' '+o.text);
  }
  assert.equal(unit.sources['NCE-U01-C-Q-CAR'].text,'Is this your car?');
  assert.ok(order.some(q=>q.options.some(o=>o.text.includes("o'clock"))));
});
test('the route renders every chapter without section paging controls',()=>{
  const h=setup(),html=scene.createRenderer(unit).render(h.view());
  assert.equal((html.match(/class="journey-node"/g)||[]).length,unit.nodes.length);
  assert.doesNotMatch(html,/journey-expand|journey-section|展开全部路线|上一分区|下一分区/);
  assert.match(html,/journey-lesson-index/);assert.match(html,/journey-locate/);
});
test('grading emits one feedback sound and resuming does not replay it',()=>{
  const h=setup({random:()=>2/4294967296});h.send({type:'open-placement',id:'friends'});h.send({type:'placement-start'});
  const a=h.view().placementAttempt,q=unit.placement.questions.find(q=>q.id===a.questionIds[a.cursor]);
  answer(h,q);const event={type:'placement-check',attemptId:a.id,questionId:q.id};
  const first=h.rt.dispatch(event);assert.deepEqual(first.effects.filter(e=>e.type==='play-feedback').map(e=>e.sound),['correct']);
  assert.equal(h.rt.dispatch(event).effects.filter(e=>e.type==='play-feedback').length,0);
  h.send({type:'map'});h.send({type:'open-placement',id:'friends'});
  assert.equal(h.rt.dispatch({type:'placement-start'}).effects.filter(e=>e.type==='play-feedback').length,0);
  for(const sound of ['correct','incorrect','complete','failed'])assert.match(unit.feedbackSounds[sound].src,/^\/assets\/feedback\/duolingo-.*\.mp3$/);
});
const sounds=result=>result.effects.filter(e=>e.type==='play-feedback').map(e=>e.sound);
test('story character choices retain one feedback message without a picture-card footer',()=>{
  const h=setup();h.reach('v3.6:story:owner');h.hear();h.send({type:'select',id:'handbag-owner'});h.send({type:'check'});
  const html=scene.createRenderer(unit).render(h.view());
  assert.equal((html.match(/class="lp-feedback /g)||[]).length,1);
  assert.doesNotMatch(html,/lp-picture-feedback-slot/);
});
test('main practice and challenge distinguish retry, correct, completion and repeated events',()=>{
  const q=Object.values(unit.activities).find(q=>q.mechanism==='order'),n=unit.nodes.find(n=>n.id===q.nodeId);
  const challenge={...unit.challenges[0],unlockNodeId:n.id,questions:unit.challenges[0].questions.slice(0,1)};
  const u={...unit,nodes:[{...n,activityIds:[q.id]}],checkpointIds:[n.id],checkpointActivities:{[n.id]:[q.id]},challenges:[challenge]};
  const h=setup({unit:u});h.send({type:'open-node',nodeId:n.id});
  answer(h,q,false);assert.deepEqual(sounds(h.rt.dispatch({type:'check'})),['incorrect']);
  assert.deepEqual(sounds(h.rt.dispatch({type:'check'})),[]);
  h.send({type:'retry'});answer(h,q);assert.deepEqual(sounds(h.rt.dispatch({type:'check'})),['correct']);
  // A supported answer adds the existing reinforcement step before settlement.
  assert.deepEqual(sounds(h.rt.dispatch({type:'continue'})),[]);
  answer(h,q);assert.deepEqual(sounds(h.rt.dispatch({type:'check'})),['correct']);
  assert.deepEqual(sounds(h.rt.dispatch({type:'continue'})),['complete']);
  assert.deepEqual(sounds(h.rt.dispatch({type:'continue'})),[]);
  h.send({type:'map'});h.send({type:'open-challenge',id:challenge.id});h.send({type:'challenge-start'});
  answer(h,challenge.questions[0]);assert.deepEqual(sounds(h.rt.dispatch({type:'challenge-check'})),['correct']);
  assert.deepEqual(sounds(h.rt.dispatch({type:'challenge-next'})),['complete']);
  assert.deepEqual(sounds(h.rt.dispatch({type:'reload'})),[]);
});
test('placement plays answer feedback first and the result sound only after manual continue',()=>{
  for(const correct of [true,false]){
    const h=setup({random:()=>2/4294967296});h.send({type:'open-placement',id:'friends'});h.send({type:'placement-start'});
    for(let i=0;i<(correct?20:5);i++){
      const a=h.view().placementAttempt,q=unit.placement.questions.find(q=>q.id===a.questionIds[a.cursor]),identity={attemptId:a.id,questionId:q.id};
      answer(h,q,correct);
      const result=h.rt.dispatch({type:'placement-check',...identity}),last=i===(correct?19:4);
      assert.deepEqual(sounds(result),[correct?'correct':'incorrect']);
      assert.deepEqual(sounds(h.rt.dispatch({type:'placement-check',...identity})),[]);
      const next=h.rt.dispatch({type:'placement-next',...identity});
      assert.deepEqual(sounds(next),last?[correct?'complete':'failed']:[]);
    }
  }
});
test('identical visible words are interchangeable in the original order activity',()=>{
  const q=unit.activities['L113:transfer'],n=unit.nodes.find(n=>n.id===q.nodeId);
  const u={...unit,nodes:[{...n,activityIds:[q.id]}],checkpointIds:[n.id],checkpointActivities:{[n.id]:[q.id]}};
  const h=setup({unit:u});h.send({type:'open-node',nodeId:n.id});h.hear();
  const ids=[...q.answer];[ids[0],ids[ids.length-1]]=[ids.at(-1),ids[0]];
  assert.equal(q.options.find(o=>o.id===ids[0]).text,q.options.find(o=>o.id===ids.at(-1)).text);
  for(const id of ids)h.send({type:'select',id});
  assert.equal(h.rt.dispatch({type:'check'}).view.feedback,'correct');
});
test('punctuation removal preserves old placement verdicts while accepting equal words in new answers',()=>{
  const placement=require('../../core/learning-placement'),exercises=require('../../core/learning-exercises');
  const q=unit.placement.questions.find(q=>q.id==='PL-CH113-114-3:tap');
  assert.deepEqual(q.priorOrderTexts,['I','cannot','swim.','Neither','can','I.']);
  const initial=setup().view().record,targetId=unit.chapters.at(-1).id;
  let a;for(let seed=0;seed<1000;seed++){const candidate=placement.createAttempt(unit,initial,targetId,seed,'2026-09-10T00:00:00Z');if(candidate.questionIds.includes(q.id)){a=candidate;break;}}
  assert.ok(a);
  while(a.questionIds[a.cursor]!==q.id){const other=placement.question(unit,a.questionIds[a.cursor]);a=placement.grade(unit,a,exercises.solution(other),'2026-09-10T00:00:00Z',other.listenRefs);a.cursor++;a.draft=exercises.empty();}
  const value=exercises.solution(q);[value.selected[0],value.selected[value.selected.length-1]]=[value.selected.at(-1),value.selected[0]];
  const oldUnit={...unit,placement:{...unit.placement,questions:unit.placement.questions.map(item=>item===q?{...q,options:q.options.map((o,i)=>({...o,text:q.priorOrderTexts[i]}))}:item)}};
  const old=placement.grade(oldUnit,a,value,'2026-09-10T00:00:00Z',q.listenRefs);delete old.responses.at(-1).wordBankVersion;
  assert.equal(old.responses.at(-1).correct,false);assert.equal(placement.validProgress({attempts:{[targetId]:old}},unit),true);
  const store=require('../../core/learning-store'),key=setup().rt.storageKey;
  const restored=setup({adapter:store.createMemoryAdapter({[key]:{revision:1,value:{...initial,placement:{attempts:{[targetId]:old}}}}})});
  assert.equal(restored.view().screen,'map');assert.equal(restored.view().record.placement.attempts[targetId].responses.at(-1).correct,false);
  const current=placement.grade(unit,a,value,'2026-09-10T00:00:00Z',q.listenRefs);
  assert.equal(current.responses.at(-1).correct,true);assert.equal(current.responses.at(-1).wordBankVersion,2);assert.equal(placement.validProgress({attempts:{[targetId]:current}},unit),true);
  current.responses.at(-1).correct=false;assert.equal(placement.validProgress({attempts:{[targetId]:current}},unit),false);
});
