'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const catalog=require('../../core/learning-course-catalog');
const exercises=require('../../core/learning-exercises'),runtime=require('../../core/learning-path-runtime'),store=require('../../core/learning-store'),scene=require('../../core/learning-path-scene'),placement=require('../../core/learning-placement');
const unit=catalog.getCourse(),at='2026-09-10T12:00:00.000Z';
function solve(rt,q){
  const send=e=>rt.dispatch(e).view;
  for(const ref of q.listenRefs){let v=send({type:'exercise-listen',id:ref,questionId:q.id});assert.equal(v.audio.status,'loading');send({type:'audio-ended',requestId:v.audio.requestId,index:v.audio.index});}
  for(const [left,right]of exercises.solution(q).pairs){send({type:'exercise-select',id:left,questionId:q.id});const v=rt.snapshot();if(['loading','playing'].includes(v.audio?.status))send({type:'audio-ended',requestId:v.audio.requestId,index:0});send({type:'exercise-select',id:right,questionId:q.id});}
  for(const id of q.answer)send({type:'exercise-select',id,questionId:q.id});
}
test('all current student question banks exclude free text and keep every old target mapped',()=>{
  const u=catalog.getCourse();
  assert.equal(u.recordSchema,5);
  const live=[...Object.values(u.activities),...u.challenges.flatMap(c=>c.questions),...u.placement.questions,...u.grammar.delayedQuestions];
  assert.equal(live.filter(q=>['input','gap','translation'].includes(q.kind)).length,0);
  assert.equal(u.keyboardMigration.questions.length,1181);
  assert.equal(new Set(u.keyboardMigration.questions.map(q=>q.oldId)).size,1181);
  assert.equal(u.nodes.length,354);
  for(const q of live.filter(q=>q.kind==='exercise'&&q.form==='T10'&&q.listenRefs.length)){assert.equal(q.assessment.skill,'listening-meaning');assert.equal(q.assessment.cue,'audio-without-transcript');}
  assert.deepEqual(catalog.validateCourse(),[]);
});
test('every live tap activity can be completed through actions and records supported capabilities',()=>{
  for(const a of Object.values(unit.activities).filter(a=>a.kind==='exercise')){
    const n=unit.nodes.find(n=>n.id===a.nodeId),u={...unit,nodes:[{...n,activityIds:[a.id]}],checkpointIds:[n.id],checkpointActivities:{[n.id]:[a.id]}};
    const rt=runtime.createRuntime({unit:u,adapter:store.createMemoryAdapter(),now:()=>new Date(at)});
    rt.dispatch({type:'open-node',nodeId:n.id});
    const html=scene.createRenderer(u).render(rt.snapshot());assert.doesNotMatch(html,/<textarea|contenteditable|<input\b|请输入|输入挑战/);
    solve(rt,a);assert.ok(exercises.ready(a,rt.snapshot().response,rt.snapshot().heardRefs),a.id);
    assert.equal(rt.dispatch({type:'check'}).view.feedback,'correct',a.id);
    if(a.mechanism==='repair'){const accepted=scene.createRenderer(u).render(rt.snapshot());assert.match(accepted,/She does not like steak/);assert.doesNotMatch(accepted,/lp-repair-sentence/);}
    const v=rt.dispatch({type:'continue'}).view;assert.equal(v.screen,'celebration',a.id);assert.ok(runtime.validRecord(v.record,u),a.id);
    assert.equal(v.record.results[a.resultId].assessment.support,a.assessment.support);
  }
});
test('all challenge definitions score through the same structural contract; arbitrary text is rejected',()=>{
  for(const c of unit.challenges)for(const q of c.questions){assert.ok(exercises.accepts(q,exercises.solution(q)),q.id);assert.equal(exercises.accepts(q,q.feedbackText),false);}
  const kinds=new Set(Object.values(unit.activities).filter(q=>q.kind==='exercise').map(q=>q.mechanism));assert.deepEqual([...kinds].sort(),['choice','cloze','mission','multi','order','pairs','repair']);
});
test('multi-select, duplicate tokens, repair and mission enforce their authored boundaries',()=>{
  const q=Object.values(unit.activities).find(q=>q.mechanism==='multi');let r=exercises.empty();
  r=exercises.reduce(q,r,q.answer[0]);assert.equal(exercises.ready(q,r,q.listenRefs),false);r=exercises.reduce(q,r,q.answer[0]);assert.equal(r.selected.length,0);
  for(const id of q.answer)r=exercises.reduce(q,r,id);const full=JSON.stringify(r);r=exercises.reduce(q,r,q.options.find(o=>!q.answer.includes(o.id)).id);assert.equal(JSON.stringify(r),full);assert.equal(exercises.ready(q,r,[]),false);
  const mission=Object.values(unit.activities).find(q=>q.mechanism==='mission');assert.deepEqual(exercises.reduce(mission,exercises.empty(),mission.answer[1]),exercises.empty());
  const repair=Object.values(unit.activities).find(q=>q.mechanism==='repair');assert.deepEqual(exercises.reduce(repair,exercises.empty(),repair.answer[1]),exercises.empty());
});
test('old typed progress is backed up, archived and resumes without relocking or fabricated new evidence',()=>{
  const oldUnit=unit.keyboardHistory,old=runtime.emptyRecord(oldUnit),c=oldUnit.challenges[0];
  const q=c.questions[0];old.challenges[c.id]={answers:[{questionId:q.id,value:q.answers[0],answerPolicyVersion:2,evidence:'independent',at}],draft:{questionId:c.questions[1].id,value:'unfinished typing',wrong:1,hintUsed:true}};
  const completed=placement.createAttempt(oldUnit,old,'umbrella',17,at);
  let a=completed;while(a.status==='active'){const q=placement.question(oldUnit,a.questionIds[a.cursor]);a=placement.grade(oldUnit,a,q.answers[0],at);if(a.status==='active'){a.cursor++;a.draft='';}}
  old.placement={attempts:{umbrella:a}};
  old.placement.attempts.friends=placement.createAttempt(oldUnit,old,'friends',18,at);
  assert.ok(runtime.validRecord(old,oldUnit));
  const key=`poc:learning-path:${unit.unitId}:${unit.experienceRevision}`,adapter=store.createMemoryAdapter({[key]:{revision:7,value:old}});
  const rt=runtime.createRuntime({unit,adapter,now:()=>new Date(at)}),v=rt.snapshot();assert.equal(v.screen,'map');assert.equal(v.record.schema,5);
  assert.deepEqual(v.record.keyboardArchive.record,old);assert.equal(JSON.parse(adapter.inspect(key).migration).revision,7);
  assert.equal(v.record.challenges[c.id].legacyCount,1);assert.equal(v.record.challenges[c.id].answers.length,0);
  assert.equal(v.record.placement.attempts.umbrella.status,'passed');assert.equal(v.record.placement.attempts.friends,undefined);assert.equal(v.record.interruptedPlacements[0].reason,'版本更新中止');
  assert.equal(adapter.commit(key,{expectedRevision:7,value:old}).status,'conflict');
  rt.dispatch({type:'open-challenge',id:c.id});rt.dispatch({type:'challenge-start'});assert.equal(rt.snapshot().challengeIndex,1);assert.deepEqual(rt.snapshot().response,exercises.empty());
  solve(rt,unit.challenges[0].questions[1]);rt.dispatch({type:'challenge-check'});assert.equal(rt.dispatch({type:'challenge-next'}).view.challengeIndex,2);assert.ok(runtime.validRecord(rt.snapshot().record,unit));
});
test('placement still fails on the fifth wrong response and counts a question only once',()=>{
  const rt=runtime.createRuntime({unit,adapter:store.createMemoryAdapter(),now:()=>new Date(at)});rt.dispatch({type:'open-placement',id:'umbrella'});rt.dispatch({type:'placement-start'});
  for(let i=0;i<5;i++){
    const v=rt.snapshot(),a=v.placementAttempt,q=placement.question(unit,a.questionIds[a.cursor]),identity={attemptId:a.id,questionId:q.id};solve(rt,q);
    // Change a selected choice or swap word positions, still submitting a complete answer.
    if(q.mechanism==='order'){for(const id of q.answer)rt.dispatch({type:'exercise-select',id,questionId:q.id});for(const id of [...q.answer].reverse())rt.dispatch({type:'exercise-select',id,questionId:q.id});}
    else rt.dispatch({type:'exercise-select',id:q.options.find(o=>!q.answer.includes(o.id)).id,questionId:q.id});
    rt.dispatch({type:'placement-check',...identity});const after=rt.snapshot();assert.equal(after.placementAttempt.responses.length,i+1);
    rt.dispatch({type:'placement-check',...identity});assert.equal(rt.snapshot().placementAttempt.responses.length,i+1);
    if(i<4)rt.dispatch({type:'placement-next',...identity});
  }
  assert.equal(rt.snapshot().placementAttempt.status,'failed');assert.equal(rt.snapshot().passedCount,0);assert.ok(runtime.validRecord(rt.snapshot().record,unit));
});

test('retired tabs cannot overwrite a journal after the primary record advances',()=>{
 const adapter=store.createMemoryAdapter({lesson:{revision:2,value:{schema:4}}});adapter.loadDraft('lesson');
 assert.equal(adapter.commit('lesson',{expectedRevision:2,value:{schema:5}}).status,'committed');
 assert.equal(adapter.saveDraft('lesson',{baseRevision:2,kind:'activity',identity:'old',value:'old typing'}).status,'conflict');
 assert.equal(adapter.loadDraft('lesson').value,null);
});
test('each placement range retains three available mechanisms and live prompts never request writing',()=>{
 for(const c of unit.chapters.slice(1))for(const seed of [17,37,81])assert.ok(new Set(placement.sample(unit,'found',c.id,seed).map(id=>placement.question(unit,id).mechanism)).size>=3,c.id);
 for(const q of [...Object.values(unit.activities),...unit.challenges.flatMap(c=>c.questions),...unit.placement.questions,...unit.grammar.delayedQuestions])for(const key of ['title','prompt','hint','hints','instruction','wrongFeedback'])assert.doesNotMatch(String(q[key]||''),/输入|手写|写出|写整句|翻译/,q.id);
});
test('replaying a paired recording preserves its match and explains incomplete listening after restore',()=>{
 const q=Object.values(unit.activities).find(q=>q.mechanism==='pairs'),answer=exercises.solution(q);
 const replayed=exercises.reduce(q,answer,q.pairs[0].id);assert.deepEqual(replayed.pairs,answer.pairs);
 const changed=exercises.reduce(q,replayed,q.pairs[1].answer);assert.equal(new Set(changed.pairs.map(p=>p[0])).size,changed.pairs.length);
 const n=unit.nodes.find(n=>n.id===q.nodeId),u={...unit,nodes:[{...n,activityIds:[q.id]}],checkpointIds:[n.id],checkpointActivities:{[n.id]:[q.id]}};
 const rt=runtime.createRuntime({unit:u,adapter:store.createMemoryAdapter()});rt.dispatch({type:'open-node',nodeId:n.id});
 const v={...rt.snapshot(),response:answer,heardRefs:[]};
 assert.match(scene.createRenderer(u).render(v),/已听完 0 \/ 3/);assert.equal(exercises.ready(q,answer,[]),false);
});
