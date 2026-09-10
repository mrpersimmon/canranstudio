'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const catalog=require('../../core/learning-course-catalog');
const runtime=require('../../core/learning-path-runtime');
const store=require('../../core/learning-store');
const placement=require('../../core/learning-placement');
const answers=require('../../core/learning-challenges');
const history=require('../../content/history/lesson1-144-v6.0.json');
const unit=catalog.getCourse(), clone=x=>JSON.parse(JSON.stringify(x));
const key=`poc:learning-path:${unit.unitId}:${unit.experienceRevision}`;
const oldUnit=()=>({...clone(unit),contractVersion:undefined,history:undefined,placement:clone(history.placement)});
function oldPlacement(){const old=oldUnit(), record=runtime.emptyRecord(old);const attempt=placement.createAttempt(old,record,'lesson-23-24',8,'2026-09-09T00:00:00Z');return {old,record,attempt};}
test('an active legacy placement retains its sample when future questions are appended',()=>{
 const {record,attempt}=oldPlacement();record.placement={attempts:{[attempt.targetId]:attempt}};
 const changed=clone(unit);changed.placement.questions.push({...changed.placement.questions.at(-1),id:'future-regression'});
 const rt=runtime.createRuntime({unit:changed,adapter:store.createMemoryAdapter({[key]:{revision:1,value:record}})});
 assert.equal(rt.snapshot().screen,'map');assert.deepEqual(rt.snapshot().record.placement.attempts[attempt.targetId].questionIds,attempt.questionIds);
});
test('a historical wrong answer is not regraded using an expanded answer policy',()=>{
 const {old,record,attempt}=oldPlacement();const q=placement.question(old,attempt.questionIds[0]);
 const graded=placement.grade(old,attempt,'historically wrong','2026-09-09');record.placement={attempts:{[attempt.targetId]:graded}};
 const changed=clone(unit);changed.placement.questions.find(x=>x.id===q.id).answers.push('historically wrong');
 const rt=runtime.createRuntime({unit:changed,adapter:store.createMemoryAdapter({[key]:{revision:1,value:record}})});
 assert.equal(rt.snapshot().screen,'map');assert.equal(rt.snapshot().record.placement.attempts[attempt.targetId].responses[0].correct,false);
});
test('adding assessment metadata preserves original result evidence',()=>{
 const old=oldUnit(), record=runtime.emptyRecord(old), a=Object.values(old.activities).find(a=>a.resultId&&a.kind==='cloze');
 record.completed[a.id]={at:'2026-09-09'};record.results[a.resultId]={activityId:a.id,initialEvidence:'supported',intervalStage:0,nextDueDay:'2026-09-10',assessment:history.assessments[a.id]};
 const changed=clone(unit);changed.activities[a.id].assessment={...a.assessment,grammarSkillId:'added-skill'};
 const rt=runtime.createRuntime({unit:changed,adapter:store.createMemoryAdapter({[key]:{revision:1,value:record}})});
 assert.equal(rt.snapshot().screen,'map');assert.deepEqual(rt.snapshot().record.results[a.resultId].assessment,history.assessments[a.id]);
});
test('reviewed translations apply to early challenges and placement without forgiving grammar errors',()=>{
 const q=unit.challenges.find(c=>c.id==='CH21-22').questions.find(q=>q.sourceRef==='L21-E02');
 assert.ok(answers.accepts(q,'Give an empty glass to me.'));assert.ok(!answers.accepts(q,'Give me a empty glass.'));
 assert.ok(answers.accepts(unit.placement.questions.find(item=>item.id==='PL-'+q.id),'Give an empty glass to me.'));
});
function local(seed={}){const data=new Map(Object.entries(seed)),writes=[];const storage={getItem:k=>data.get(k)??null,setItem(k,v){writes.push({key:k,bytes:v.length});data.set(k,v);},removeItem:k=>data.delete(k)};return {data,writes,adapter:store.createLocalStorageAdapter(storage)};}
test('migration first preserves the original bytes outside the primary record',()=>{
 const {record}=oldPlacement(), raw=JSON.stringify({revision:3,value:record}),s=local({[key]:raw});
 const rt=runtime.createRuntime({unit,adapter:s.adapter});assert.equal(rt.snapshot().screen,'map');
 assert.equal(s.data.get(key+':recovery:migration'),raw);assert.equal(rt.snapshot().record.contractVersion,2);
});
test('corrupt records offer export and explicit scoped recovery, preserving corrupt bytes',()=>{
 const raw='{broken', s=local({[key]:raw,unrelated:'keep'}),rt=runtime.createRuntime({unit,adapter:s.adapter});
 assert.equal(rt.snapshot().screen,'blocked');
 assert.equal(rt.dispatch({type:'recovery-export'}).effects[0].content,raw);
 rt.dispatch({type:'recovery-reset'});assert.equal(s.data.get(key),raw);
 const v=rt.dispatch({type:'recovery-confirm'}).view;assert.equal(v.screen,'map');assert.equal(s.data.get('unrelated'),'keep');assert.equal(s.data.get(key+':recovery:quarantine'),raw);
});
test('restoration detects a different raw record written while confirmation is open',()=>{
 const s=local({[key]:'{old'}), rt=runtime.createRuntime({unit,adapter:s.adapter});rt.dispatch({type:'recovery-reset'});s.data.set(key,'{new');
 assert.equal(rt.dispatch({type:'recovery-confirm'}).view.screen,'blocked');assert.equal(s.data.get(key),'{new');
});
test('placement typing journals small durable drafts without rewriting course progress',()=>{
 const s=local(), rt=runtime.createRuntime({unit,adapter:s.adapter,random:()=>.2});
 rt.dispatch({type:'open-placement',id:'lesson-23-24'});rt.dispatch({type:'placement-start'});
 const a=rt.snapshot().record.placement.attempts['lesson-23-24'];s.writes.length=0;
 const value='Give me an empty glass.';
 for(let i=1;i<=value.length;i++)rt.dispatch({type:'placement-input',value:value.slice(0,i),attemptId:a.id,questionId:a.questionIds[0]});
 assert.equal(s.writes.filter(w=>w.key===key).length,0);assert.ok(s.writes.every(w=>w.bytes<1000));
 const restored=runtime.createRuntime({unit,adapter:store.createLocalStorageAdapter({getItem:k=>s.data.get(k)??null,setItem:(k,v)=>s.data.set(k,v)})});
 restored.dispatch({type:'open-placement',id:a.targetId});
 assert.equal(restored.dispatch({type:'placement-start'}).view.placementAnswer,value);
});
test('grammar pilot uses new IDs and distinguishes writing, transfer and delayed retrieval',()=>{
 assert.equal(unit.grammar?.activityIds.length,6);
 for(const id of unit.grammar.activityIds){const a=unit.activities[id];assert.equal(a.kind,'input');assert.ok(a.assessment.grammarSkillId);assert.equal(history.assessments[id],undefined);}
 assert.equal(unit.grammar.delayedQuestions.length,3);
 assert.equal(unit.activities['L49:grammar-correct'].assessment.authoredSupport,'error-sentence');
 assert.equal(unit.activities['L49:grammar-question'].assessment.authoredSupport,'source-sentence');
 const order=unit.nodes.flatMap(n=>n.activityIds),first=order.indexOf(unit.grammar.activityIds[0]);
 const refs=new Set(order.slice(0,first).flatMap(id=>unit.activities[id].sourceRefs));
 const prior=[...refs].map(ref=>unit.sources[ref].text.toLowerCase());
 const known=new Set(prior.join(' ').match(/[a-z]+/g));
 for(const ref of [...unit.grammar.activityIds.map(id=>unit.activities[id].sourceRefs[0]),...unit.grammar.delayedQuestions.map(q=>q.sourceRef)]){
  const text=unit.sources[ref].text.toLowerCase();assert.ok(!prior.includes(text),ref+' must use a new sentence');
  for(const word of text.match(/[a-z]+/g))assert.ok(known.has(word),ref+' introduces an untaught word: '+word);
 }
});
test('a correct sentence task can continue when optional reference audio fails',()=>{
 const u=clone(unit),a=u.activities['L21:gap-1'];u.nodes=[{id:'only',activityIds:[a.id]}];
 const rt=runtime.createRuntime({unit:u,adapter:store.createMemoryAdapter()});rt.dispatch({type:'open-node',nodeId:'only'});
 rt.dispatch({type:'select',id:a.answer[0]});let v=rt.dispatch({type:'check'}).view;
 if(v.audio)v=rt.dispatch({type:'audio-error',requestId:v.audio.requestId,index:v.audio.index}).view;
 assert.equal(v.canContinue,true);
});
test('wrong challenge answers survive correction and enter next-day review without mainline credit',()=>{
 const u=clone(unit), c=u.challenges.find(c=>c.id==='CH21-22');u.nodes=[{id:c.unlockNodeId,activityIds:[]}];let date='2026-09-09T12:00:00';
 const rt=runtime.createRuntime({unit:u,adapter:store.createMemoryAdapter(),now:()=>new Date(date)});
 rt.dispatch({type:'open-challenge',id:c.id});rt.dispatch({type:'challenge-start'});
 rt.dispatch({type:'challenge-input',value:'wrong'});rt.dispatch({type:'challenge-check'});
 assert.ok(Object.keys(rt.snapshot().record.retrievalReviews||{}).length,'wrong answer is durable before correction');
 rt.dispatch({type:'challenge-retry'});rt.dispatch({type:'challenge-input',value:c.questions[0].answers[0]});rt.dispatch({type:'challenge-check'});rt.dispatch({type:'challenge-next'});
 const before=rt.snapshot().record;assert.equal(before.challenges[c.id].answers[0].wrong,1);
 rt.dispatch({type:'map'});date='2026-09-10T12:00:00';assert.ok(rt.snapshot().dueCount>0);
 let v=rt.dispatch({type:'review'}).view;assert.equal(v.screen,'challenge');assert.equal(v.mode,'review');
 rt.dispatch({type:'challenge-input',value:c.questions[0].answers[0]});rt.dispatch({type:'challenge-check'});v=rt.dispatch({type:'challenge-next'}).view;
 assert.equal(v.screen,'review-complete');assert.deepEqual(v.record.completed,{});assert.deepEqual(v.record.results,{});assert.deepEqual(v.record.challenges[c.id].answers,before.challenges[c.id].answers);
 assert.equal(Object.values(v.record.retrievalReviews)[0].lastEvidence,'independent');
});
test('an ongoing old placement uses the new answer policy only for its new responses',()=>{
 const {old,attempt:initial}=oldPlacement();let a=initial;const id='PL-CH21-22-1';assert.ok(a.questionIds.includes(id));
 while(a.questionIds[a.cursor]!==id){a=placement.grade(old,a,placement.question(old,a.questionIds[a.cursor]).answers[0],'2026-09-09');a.cursor++;a.draft='';}
 const earlier=clone(a.responses),graded=placement.grade(unit,a,'Give an empty glass to me.','2026-09-10');
 assert.equal(graded.responses.at(-1).correct,true);assert.equal(graded.responses.at(-1).answerPolicyVersion,2);assert.deepEqual(graded.responses.slice(0,-1),earlier);
 assert.ok(placement.validProgress({attempts:{[a.targetId]:graded}},unit));
});
test('two tabs cannot silently replace each other’s journal',()=>{
 const s=local(),make=()=>runtime.createRuntime({unit,adapter:store.createLocalStorageAdapter({getItem:k=>s.data.get(k)??null,setItem:(k,v)=>s.data.set(k,v)})});
 const a=make();a.dispatch({type:'open-placement',id:'umbrella'});a.dispatch({type:'placement-start'});
 const b=make();b.dispatch({type:'open-placement',id:'umbrella'});b.dispatch({type:'placement-start'});
 const attempt=a.snapshot().placementAttempt,event={type:'placement-input',attemptId:attempt.id,questionId:attempt.questionIds[0]};
 a.dispatch({...event,value:'first tab'});assert.equal(b.dispatch({...event,value:'second tab'}).view.saveState,'conflict');
 assert.equal(JSON.parse(s.data.get(key+':draft')).value,'first tab');
});
test('a failed independent migration backup never overwrites the original record',()=>{
 const {record}=oldPlacement(),raw=JSON.stringify({revision:5,value:record});const data=new Map([[key,raw]]);
 const adapter=store.createLocalStorageAdapter({getItem:k=>data.get(k)??null,setItem(k,v){if(k.endsWith(':migration'))throw Error('quota');data.set(k,v);}});
 const rt=runtime.createRuntime({unit,adapter});assert.equal(rt.snapshot().saveState,'failed');assert.equal(data.get(key),raw);
});
test('pilot prerequisite skills appear in a wide placement while the 20-question rule is retained',()=>{
 for(const seed of [0,8,37,100]){const ids=placement.sample(unit,unit.chapters[0].id,'lesson-101-102',seed);assert.equal(ids.length,20);for(const skill of unit.grammar.skills)assert.ok(ids.some(id=>placement.question(unit,id).grammarSkillId===skill.id));}
});
test('v1 grading and sampling contracts remain immutable across later releases',()=>{
 const crypto=require('node:crypto');
 for(const [field,hash] of Object.entries({placement:'485c80224817cc6b33c480b6bc103118c0e3b3f1810c84226200600f0184f5ec',challenges:'8954e4ab1e2ccd8ae6bd9cc97176660bd62ec68e328601da3e832a06f587bb02',assessments:'127d61e3d6b7b7a44595dcf2bc181ce16ea50ad1e3d344eaf8c1bfefd1571263',nodes:'1d89a9ee83e9068360103317826ce94085363ce90e26a4687635f281131c968e',placementSourceText:'6a2077704f2ca16fd481ed103dc9225e6d5996d0771fcf927e54e694d236195b'}))assert.equal(crypto.createHash('sha256').update(JSON.stringify(history[field])).digest('hex'),hash,field);
});
test('unknown placement answer policies fail validation without crashing record recovery',()=>{
 const {record,attempt}=oldPlacement();const graded=placement.grade(unit,attempt,'wrong','2026-09-09');graded.responses[0].answerPolicyVersion=999;
 record.placement={attempts:{[graded.targetId]:graded}};assert.equal(runtime.validRecord(record,unit),false);
});
test('the light presentation view is immutable while full exports remain isolated copies',()=>{
 const rt=runtime.createRuntime({unit,adapter:store.createMemoryAdapter()});assert.throws(()=>{rt.snapshot(true).record.completed.fake={at:'today'};},TypeError);
 const exported=rt.snapshot();exported.record.completed.fake={at:'today'};assert.equal(rt.snapshot().record.completed.fake,undefined);
});
test('pilot writing preserves the actual diagnostic and routes novel sentences to later review',()=>{
 const u=clone(unit),id='L49:grammar-s',a=u.activities[id];u.nodes=[{id:'only',activityIds:[id]}];
 const rt=runtime.createRuntime({unit:u,adapter:store.createMemoryAdapter(),now:()=>new Date('2026-09-09T12:00:00')});
 rt.dispatch({type:'open-node',nodeId:'only'});rt.dispatch({type:'activity-input',id,value:'like'});assert.equal(rt.dispatch({type:'check'}).view.inputDiagnostic.code,'missing-s');
 const immediate=Object.values(rt.snapshot().record.retrievalReviews || {});assert.equal(immediate.length,1);assert.equal(immediate[0].errors[0].code,'missing-s');
 rt.dispatch({type:'check'});assert.equal(Object.values(rt.snapshot().record.retrievalReviews)[0].wrong,1,'repeated check must not duplicate an error');
 rt.dispatch({type:'retry'});rt.dispatch({type:'activity-input',id,value:'likes'});rt.dispatch({type:'check'});const v=rt.dispatch({type:'continue'}).view;
 assert.equal(v.record.results[a.resultId].initialEvidence,'supported');assert.equal(v.record.results[a.resultId].errors[0].value,'like');
 const entry=Object.values(v.record.retrievalReviews)[0];assert.equal(entry.nextDueDay,'2026-09-10');assert.notEqual(answers.reviewQuestion(unit,entry).sourceRef,a.sourceRefs[0]);
});

test('a pilot challenge error recalls a new sentence of the same grammar skill',()=>{
 const u=clone(unit),c=u.challenges.find(c=>c.id==='CH49-50');u.nodes=[{id:c.unlockNodeId,activityIds:[]}];let date='2026-09-09T12:00:00';
 const rt=runtime.createRuntime({unit:u,adapter:store.createMemoryAdapter(),now:()=>new Date(date)});
 rt.dispatch({type:'open-challenge',id:c.id});rt.dispatch({type:'challenge-start'});
 rt.dispatch({type:'challenge-input',value:'like'});rt.dispatch({type:'challenge-check'});
 const entry=Object.values(rt.snapshot().record.retrievalReviews)[0];
 assert.equal(entry.grammarSkillId,c.questions[0].grammarSkillId);
 assert.equal(entry.errors[0].code,'missing-s');
 const novel=answers.reviewQuestion(u,entry);assert.notEqual(novel.sourceRef,c.questions[0].sourceRef);
 rt.dispatch({type:'map'});date='2026-09-10T12:00:00';
 assert.equal(rt.dispatch({type:'review'}).view.reviewQuestion.id,novel.id);
 rt.dispatch({type:'challenge-input',value:novel.answers[0]});rt.dispatch({type:'challenge-check'});rt.dispatch({type:'challenge-next'});
 const saved=rt.snapshot().record.retrievalReviews[entry.questionId];assert.equal(saved.lastQuestionId,novel.id);assert.equal(saved.lastAnswer,novel.answers[0]);
 assert.equal(saved.lastAnswerPolicyVersion,2);assert.equal(saved.lastEvidence,'independent');
 assert.deepEqual(rt.snapshot().record.challenges[c.id].answers,[]);
});

test('malformed new error histories and input drafts reach record recovery without throwing',()=>{
 const q=unit.grammar.delayedQuestions[0];
 for(const error of [null,3,'invalid',{}, {value:'wrong',at:null}]){
  const record=runtime.emptyRecord(unit);record.retrievalReviews={[q.id]:{origin:'grammar',questionId:q.id,nextDueDay:'2026-09-10',intervalStage:0,wrong:1,errors:[error]}};
  assert.equal(runtime.validRecord(record,unit),false);
  const raw=JSON.stringify({revision:1,value:record}),s=local({[key]:raw});
  const rt=runtime.createRuntime({unit,adapter:s.adapter});assert.equal(rt.snapshot().screen,'blocked');assert.equal(rt.dispatch({type:'recovery-export'}).effects[0].content,raw);
 }
 for(const extra of [{value:{}},{value:'x'.repeat(181)},{errors:[null]}]){
  const record=runtime.emptyRecord(unit);record.attempts['L49:grammar-s']={wrong:1,hintUsed:true,...extra};
  assert.equal(runtime.validRecord(record,unit),false);
 }
});

test('a grandfathered completed node can earn its newly added input evidence',()=>{
 const u=clone(unit),node=u.nodes.find(n=>n.id==='L49-USE');u.nodes=[node];u.checkpointIds=[node.id];
 const old=clone(u);delete old.contractVersion;delete old.history;
 old.nodes[0].activityIds=clone(history.nodes[node.id]);old.checkpointActivities[node.id]=clone(history.nodes[node.id]);
 for(const a of Object.values(old.activities))if(a.resultId&&history.assessments[a.id])a.assessment=clone(history.assessments[a.id]);
 const h=require('./support/course-harness').setup({unit:old});h.finish(node.id);
 const rt=runtime.createRuntime({unit:u,adapter:h.adapter});assert.equal(rt.snapshot().completedCount,1,'old completion stays visible');
 const before=clone(rt.snapshot().record.results),opened=rt.dispatch({type:'open-node',nodeId:node.id}).view;
 assert.equal(opened.mode,'main');assert.equal(opened.activityId,'L49:grammar-s');
 rt.dispatch({type:'activity-input',id:opened.activityId,value:'likes'});rt.dispatch({type:'check'});rt.dispatch({type:'continue'});
 assert.equal(rt.snapshot().record.results['L49:grammar-s:result'].initialEvidence,'independent');
 for(const [id,result] of Object.entries(before))assert.deepEqual(rt.snapshot().record.results[id],result,'old evidence must stay unchanged');
 assert.equal(rt.snapshot().completedCount,1);
});
