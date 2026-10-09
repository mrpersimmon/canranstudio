'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {openStore}=require('../../server/store'),progress=require('../../server/progress'),learning=require('../../server/learning');
const observer=require('../../server/public/learning-observer');
const {UNITS}=require('../../server/catalog');
const root=path.resolve(__dirname,'../..');
const definitions=Object.fromEntries(UNITS.map(id=>[id,progress.definition(root,id)]));
const descriptions=UNITS.map(id=>({id,title:definitions[id].title,label:id}));
function book(course='unit13-14',ids=['colours'],runId='round-1'){
 const unit=definitions[course],groups={},records={},activity={unitCompleted:{}};
 for(const id of ids){const questions=unit.questions[id];const states=questions.map(q=>({questionId:q.id,runId,checked:true,selection:q.answer,attempts:1,firstCorrect:true,correct:true}));groups[id]={signature:questions.map(q=>q.id).join('|'),contentSignature:JSON.stringify([unit.version??null,questions],(k,v)=>k==='hint'?undefined:v),runId,states,index:questions.length,draftVersion:2};states.forEach(s=>records[s.questionId]={...s});activity.unitCompleted[id]=course==='unit49-50'?'v1:'+questions.map(q=>q.id).join('|'):JSON.stringify([unit.version,questions]);}
 return {version:1,groups,records,activity};
}
function completeBook(course='unit13-14'){
 const unit=definitions[course],parts=learning.activities(unit,course),value=book(course,parts.filter(a=>a.questions.length&&!a.subjects).map(a=>a.id));
 value.activity.unitDialogue={done:true,viewed:unit.learning.DIALOGUE.map(()=>true)};
 value.activity.unitCompleted.text=course==='unit49-50'?'v1:'+unit.learning.DIALOGUE.map(line=>line.text).join('|'):JSON.stringify([unit.version,unit.learning.DIALOGUE]);
 if(parts.some(a=>a.subjects)){
  const runId='complete-subjects';value.activity.subjectRound={done:true,version:unit.learning.SUBJECTS.version,runId,submissions:unit.learning.SUBJECTS.questions.map(q=>({questionId:q.id,runId,checked:true,correct:true,selection:q.answer}))};
  value.activity.unitCompleted.subjects='v1:'+unit.learning.SUBJECTS.version;
 }
 return value;
}
function fixture(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'canran-learning-unit-')),store=openStore(dir);t.after(()=>{store.close();fs.rmSync(dir,{recursive:true,force:true});});const group=store.createClass('模拟班');store.updateClass(group.id,group.name,['unit13-14']);const [student]=store.createStudents([{name:'同名学生',pinyin:'tongmingxuesheng'}],group.id);return {store,student,group};}
function view(store,student,now=Date.now()){const data=store.learning.read({studentId:student.id});return learning.studentView(data.students[0],data,definitions,descriptions,now);}

test('published courses keep their independent reward totals and validate submitted question families',()=>{
 for(const course of UNITS){const unit=definitions[course],ids=learning.activities(unit,course).filter(a=>a.questions.length&&!a.subjects).map(a=>a.id),value=book(course,ids);const wanted=ids.reduce((n,id)=>n+unit.questions[id].length,0);assert.equal(learning.submissions(observer.snapshot(value),unit,course).length,wanted,course);assert.equal(progress.summary({},unit,course).maxStars,course==='unit1-2'?5:15,course);assert.equal(learning.courseSummary({unit,course,value:{}}).completed,false);}
});
test('unsubmitted choices stay private, a retry retains the previous submission, and offline rounds merge',()=>{
 const value=book(),group=value.groups.colours;group.index=0;group.states[0].checked=false;group.states[0].selection='an unsubmitted draft';group.states[1].attempts=0;group.states[1].checked=false;delete value.records[group.states[1].questionId];
 const wire=observer.snapshot(value);assert.equal(wire.groups[0].states.length,1);assert.equal(wire.groups[0].states[0].selection,"What colour's your hat?");assert.ok(!JSON.stringify(wire).includes('unsubmitted draft'));
 const later=observer.snapshot(book('unit13-14',['colours'],'round-2'));assert.equal(observer.merge(wire,later).groups.length,2);
 const empty=observer.snapshot({groups:{fresh:{runId:'fresh',states:[{checked:false,attempts:0,selection:'secret'}]}}});assert.equal(empty.groups.length,0);
});
test('observation validation rejects wrong identity, future content, unsubmitted and fabricated result flags',()=>{
 const payload=observer.snapshot(book()),unit=definitions['unit13-14'];assert.equal(learning.submissions(payload,unit,'unit13-14').length,2);
 for(const mutate of [s=>s.checked=false,s=>s.runId='other',s=>s.correct=false,s=>s.attempts=0,s=>s.firstCorrect=false,s=>s.selection='not a valid answer']){const copy=structuredClone(payload);mutate(copy.groups[0].states[0]);assert.equal(learning.submissions(copy,unit,'unit13-14').length,1);}
 const stale=structuredClone(payload);stale.groups[0].contentSignature='[999,[]]';assert.equal(learning.submissions(stale,unit,'unit13-14').length,0);
 const sibling=structuredClone(payload);sibling.groups[0].states[0].questionId='elsewhere';assert.equal(learning.submissions(sibling,unit,'unit13-14').length,1);
});
test('partial wrong submission is observable without awards or resumable completion',t=>{
 const {store,student}=fixture(t),value=book(),g=value.groups.colours;g.states=g.states.slice(0,1);g.states[0]={...g.states[0],selection:"What colour are your hat?",correct:false,firstCorrect:false};
 // Use a real distractor in this question, retaining independently known correct answer above.
 const q=definitions['unit13-14'].questions.colours[0];g.states[0].selection=q.options.find(v=>v!==q.answer);
 const observations=learning.submissions(observer.snapshot({...value,records:{}}),definitions['unit13-14'],'unit13-14');assert.equal(observations.length,1);
 store.saveLearning(student.id,'unit13-14',0,{},observations,false);
 const course=view(store,student).courses[0];assert.equal(course.status,'in-progress');assert.equal(course.submitted,1);assert.equal(course.correct,0);assert.equal(course.stars,0);assert.equal(course.completedActivities,0);assert.deepEqual(store.progress(student.id,'unit13-14').value,{});
});
test('duplicate/out-of-order uploads and refresh do not renew timestamps; corrections advance once',t=>{
 const {store,student}=fixture(t),records=learning.submissions(observer.snapshot(book()),definitions['unit13-14'],'unit13-14'),r={...records[0],correct:0,firstCorrect:0};
 store.learning.enter(student.id,'unit13-14',0,1000);store.learning.sync(student.id,'unit13-14',0,[r],false,2000);
 store.learning.enter(student.id,'unit13-14',0,9000);store.learning.sync(student.id,'unit13-14',0,[r],false,10000);
 let c=view(store,student).courses[0];assert.equal(c.enteredAt,1000);assert.equal(c.lastRecordAt,2000);assert.equal(c.lastProgressAt,2000);
 const corrected={...r,correct:1,attempts:2};store.learning.sync(student.id,'unit13-14',0,[corrected],false,11000);store.learning.sync(student.id,'unit13-14',0,[r],false,12000);
 c=view(store,student).courses[0];assert.equal(c.correct,1);assert.equal(c.lastRecordAt,11000);assert.equal(c.lastProgressAt,11000);
 store.learning.sync(student.id,'unit13-14',0,[{...corrected,run:'another-device',attempts:1,firstCorrect:1}],false,13000);
 c=view(store,student).courses[0];assert.equal(c.submitted,1);assert.equal(c.correct,1);assert.equal(c.lastRecordAt,13000);assert.equal(c.lastProgressAt,11000);
});
test('reset isolates a new generation and preserves earlier observation history',t=>{
 const {store,student}=fixture(t),value=book(),records=learning.submissions(observer.snapshot(value),definitions['unit13-14'],'unit13-14');
 store.saveLearning(student.id,'unit13-14',0,value,records,true);assert.equal(view(store,student).courses[0].stars,3);
 store.resetLearning(student.id,'unit13-14',1);const c=view(store,student).courses[0];assert.equal(c.status,'not-started');assert.equal(c.stars,0);assert.equal(c.submitted,0);assert.equal(c.lastRecordAt,null);assert.equal(c.previousGenerations,1);assert.equal(store.learning.read({studentId:student.id}).observations.length,2);
});
test('legacy completion has unknown dates; version changes cannot inherit current question counts',t=>{
 const {store,student}=fixture(t);store.saveProgress(student.id,'unit13-14',0,book());let c=view(store,student).courses[0];assert.equal(c.stars,3);assert.equal(c.lastRecordAt,null);assert.equal(c.enteredAt,null);
 const unit=definitions['unit13-14'];
 const known=progress.normalize(store.progress(student.id,'unit13-14').value,unit,'unit13-14');
 const replay=learning.submissions(observer.snapshot(book()),unit,'unit13-14',known);assert.equal(replay.length,0);store.saveLearning(student.id,'unit13-14',0,known,replay,false);assert.equal(view(store,student).courses[0].lastProgressAt,null);assert.equal(view(store,student).courses[0].lastRecordAt,null);
 const retry=learning.submissions(observer.snapshot(book('unit13-14',['colours'],'new-round')),unit,'unit13-14',known);store.learning.sync(student.id,'unit13-14',0,retry,false,900);assert.equal(view(store,student).courses[0].lastRecordAt,900);assert.equal(view(store,student).courses[0].lastProgressAt,null);
 const records=learning.submissions(observer.snapshot(book()),unit,'unit13-14');store.learning.sync(student.id,'unit13-14',0,records,false,1000);
 const revised=structuredClone(unit);revised.questions.colours[0].prompt='A changed task';c=learning.courseSummary({unit:revised,course:'unit13-14',value:book(),observations:store.learning.read({studentId:student.id}).observations});assert.equal(c.submitted,0);assert.equal(c.stars,0);assert.equal(c.hasHistoricalVersion,true);
});
test('course closure, transfer and disabled accounts preserve learning status and history',t=>{
 const {store,student,group}=fixture(t);store.saveProgress(student.id,'unit13-14',0,book());store.learning.enter(student.id,'unit13-14',0);
 store.updateClass(group.id,'改名班',[]);let v=view(store,student);assert.equal(v.courses[0].open,false);assert.equal(v.historySummary.completedActivities,1);assert.equal(v.summary.totalCourses,0);
 const other=store.createClass('转入班');store.updateClass(other.id,other.name,['unit13-14']);store.updateStudent(student.id,student.name,other.id,true);v=view(store,student);assert.equal(v.student.className,'转入班');assert.equal(v.courses[0].stars,3);assert.equal(v.courses[0].status,'in-progress');
 assert.equal(view(store,student,Date.now()+8*86400000).courses[0].status,'in-progress');store.updateStudent(student.id,student.name,other.id,false);assert.equal(view(store,student,Date.now()+8*86400000).courses[0].status,'in-progress');
});
test('5-star adapters preserve independent awards and the first full-star date; totals never convert 15 to 5',()=>{
 const unit=structuredClone(definitions['unit13-14']);unit.reward={edition:'edition-one',zones:['listen','roles','colours','trans','exam'].map(id=>({id}))};const award={zones:{listen:{},roles:{},colours:{},trans:{},exam:{}},firstFullStarAt:'2026-10-01T00:00:00.000Z'};
 const s=progress.summary({},unit,'unit13-14',award);assert.equal(s.stars,5);assert.equal(s.maxStars,5);assert.equal(s.firstFullStarAt,award.firstFullStarAt);
 const c=learning.courseSummary({unit,course:'unit13-14',award});assert.equal(c.completed,false);assert.equal(c.stars,5);
 const all=learning.totals([c,learning.courseSummary({unit:definitions['unit13-14'],course:'unit13-14'})]);assert.equal(all.rewards.length,2);assert.deepEqual(all.rewards.map(r=>r.maxStarsPerCourse),[5,15]);
});
test('student identity, pagination and filters expose learning summaries only',t=>{
 const {store,student,group}=fixture(t);store.createStudents(Array.from({length:26},()=>({name:'同名学生',pinyin:'tongmingxuesheng'})),group.id);
 const data=store.learning.read(),first=learning.dashboard(data,definitions,descriptions),second=learning.dashboard(data,definitions,descriptions,{page:2});assert.equal(first.total,27);assert.equal(first.rows.length,25);assert.equal(second.rows.length,2);assert.notEqual(first.rows[0].student.id,first.rows[1].student.id);
 const one=learning.dashboard(store.learning.read({q:student.studentNumber}),definitions,descriptions);assert.equal(one.total,1);assert.equal(one.rows[0].student.id,student.id);assert.ok(!/password|loginPinyin|selection|contentSignature|followup/.test(JSON.stringify(one)));
 const before=store.progress(student.id,'unit13-14');assert.deepEqual(before,{generation:0,value:{}});
});

test('HTTP endpoints enforce admin/owner/generation boundaries and retire follow-up writes',async t=>{
 const {store,student,group}=fixture(t);store.setAdmin('teacher','Teacher-test-password-2026');store.changePassword(student.id,'Student-test-password-2026');
 const [other]=store.createStudents([{name:'同名学生',pinyin:'tongmingxuesheng'}],group.id);store.changePassword(other.id,'Student-test-password-2026');
 const {createApp}=require('../../server/app');const server=await createApp({dataDir:store.directory,origin:'http://127.0.0.1',basePath:'/'});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const base='http://127.0.0.1:'+server.address().port,admin='canran_admin='+store.session('admin','teacher',Date.now()),learner='canran_student='+store.session('student',student.id,Date.now()),another='canran_student='+store.session('student',other.id,Date.now());
  const call=(url,cookie='',data,origin='http://127.0.0.1')=>fetch(base+'/api/'+url,{headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json'},...(data===undefined?{}:{method:'POST',body:JSON.stringify(data)})});
  for(const route of ['admin/learning','admin/students/'+student.id+'/learning','admin/students/'+student.id+'/learning/unit13-14']){
   assert.equal((await call(route)).status,401);assert.equal((await call(route,learner)).status,403);assert.equal((await call(route,admin)).status,200);
  }
  const enter=await (await call('courses/unit13-14/enter',learner,{})).json();
  const full=book(),partial=structuredClone(full);partial.groups.colours.index=0;partial.groups.colours.states.length=1;partial.activity.unitCompleted={};
  const payload={studentId:student.id,course:'unit13-14',generation:0,grant:enter.grant,value:partial,observations:observer.snapshot(partial)};
  assert.equal((await call('progress',another,payload)).status,403);assert.equal((await call('progress',learner,payload,'https://other.invalid')).status,403);
  assert.equal((await call('progress',learner,payload)).status,200);
  const details=await(await call('admin/students/'+student.id+'/learning/unit13-14',admin)).json();assert.equal(details.course.status,'in-progress');assert.equal(details.course.stars,0);assert.ok(Number.isFinite(details.course.lastLearnedAt));assert.ok(!/"(?:selection|password|groups|contentSignature|submitted|correct|completedActivities|totalActivities|activities|lastRecordAt|enteredAt|resetAt|percent)"\s*:/.test(JSON.stringify(details)));
  store.saveProgress(other.id,'unit13-14',0,completeBook());
  for(const [query,ids] of [
   ['status=in-progress,completed&sort=stars-desc',[other.id,student.id]],
   ['status=in-progress&status=completed&sort=stars-asc',[student.id,other.id]],
   ['status=in-progress,in-progress',[student.id]],
   ['status=completed',[other.id]],
   ['status=&sort=stars-desc',[other.id,student.id]]
  ]){
   const response=await call('admin/learning?'+query,admin);assert.equal(response.status,200);
   assert.deepEqual((await response.json()).rows.map(row=>row.student.id),ids,query);
  }
  for(const query of ['status=completed,unknown','status=completed&status=unknown','status=in-progress,,completed','sort=unsupported'])assert.equal((await call('admin/learning?'+query,admin)).status,400,query);
  const notes={id:'http-followup-001',course:'unit13-14',status:'waiting',nextDate:'2026-11-10',note:'Private teacher note'};
  assert.equal((await call('admin/students/'+student.id+'/followup',learner,notes)).status,403);
  assert.equal((await call('admin/students/'+student.id+'/followup',admin,notes)).status,404);
  assert.ok(!/followup|Private teacher note/.test(JSON.stringify(await(await call('admin/students/'+student.id+'/learning',admin)).json())));
  await call('progress/reset',learner,{course:'unit13-14'});assert.deepEqual(await(await call('progress',learner,payload)).json(),{stale:true,generation:1});
  const current=await(await call('admin/students/'+student.id+'/learning/unit13-14',admin)).json();assert.equal(current.course.status,'not-started');assert.equal(current.course.stars,0);assert.equal(current.course.lastLearnedAt,null);assert.equal(view(store,student).courses[0].previousGenerations,1);
  store.updateStudent(student.id,student.name,group.id,false);assert.equal((await call('progress',learner,{...payload,generation:1})).status,403);
  assert.equal((await call('admin/students/not-found/learning',admin)).status,404);assert.equal((await call('admin/learning?course=bad',admin)).status,400);assert.equal((await call('admin/learning?status=unknown',admin)).status,400);
 }finally{await new Promise(resolve=>server.close(resolve));}
});

test('Lesson 49–50 subject retries synchronize only submitted appearances and their attempt sequence',()=>{
 const unit=definitions['unit49-50'],first=unit.learning.SUBJECTS.questions[0],runId='subject-round';
 const wrong={runId,questionId:first.id,checked:true,selection:'第一人称',correct:false};
 const right={...wrong,selection:'第三人称单数',correct:true};
 const wire=observer.snapshot({activity:{subjectRound:{version:unit.learning.SUBJECTS.version,runId,submissions:[wrong,right],current:{questionId:'S02',selection:'draft-only',checked:false}}}});
 assert.equal(wire.groups[0].states.length,1);assert.equal(wire.groups[0].states[0].attempts,2);assert.equal(wire.groups[0].states[0].firstCorrect,false);
 const records=learning.submissions(wire,unit,'unit49-50');assert.equal(records.length,1);assert.equal(records[0].correct,1);assert.equal(records[0].firstCorrect,0);assert.equal(records[0].activity,'subjects');
 wire.groups[0].subjectVersion='unsupported';assert.equal(learning.submissions(wire,unit,'unit49-50').length,0);
});


test('three learning statuses require current work, not visits, stars or old content',()=>{
 const course='unit13-14',unit=definitions[course];
 const empty=learning.courseSummary({unit,course,meta:{enteredAt:1000,lastRecordAt:2000},observations:[{activity:'colours',revision:'retired-content',question:'old-task',correct:1}]});
 assert.equal(empty.status,'not-started');
 const full=completeBook(course),reading={activity:{unitCompleted:{text:full.activity.unitCompleted.text},unitDialogue:full.activity.unitDialogue}};
 assert.equal(learning.courseSummary({unit,course,value:reading}).status,'in-progress');
 const fiveStar=structuredClone(unit);fiveStar.reward={edition:'independent-awards',zones:['listen','roles','colours','trans','exam'].map(id=>({id}))};
 const finished=learning.courseSummary({unit:fiveStar,course,value:full});
 assert.equal(finished.status,'completed');assert.equal(finished.stars,0);
 const drafts=book();drafts.activity.unitCompleted={};
 assert.equal(learning.courseSummary({unit,course,value:drafts}).status,'not-started');
});
test('all 21 courses reach completed only with every required activity including reading',()=>{
 for(const course of UNITS){
  const value=completeBook(course),unit=definitions[course];
  assert.equal(learning.courseSummary({unit,course,value}).status,'completed',course);
  delete value.activity.unitDialogue;
  assert.equal(learning.courseSummary({unit,course,value}).status,'in-progress',course);
 }
});
test('class/course status filters distinguish zero-star work, completion, empty scopes and mixed courses',t=>{
 const {store,student,group}=fixture(t),course='unit13-14';
 const [started,finished]=store.createStudents([{name:'已开始同学',pinyin:'kaishi'},{name:'已完成同学',pinyin:'wancheng'}],group.id);
 store.learning.enter(student.id,course,0);
 const records=learning.submissions(observer.snapshot(book()),definitions[course],course);
 store.saveLearning(started.id,course,0,{},[{...records[0],correct:0,firstCorrect:0}],false);
 store.saveProgress(finished.id,course,0,completeBook());
 const other=store.createClass('尚未开课班');store.createStudents([{name:'待开课同学',pinyin:'kaike'}],other.id);
 const rows=(filters={})=>learning.dashboard(store.learning.read({active:'all'}),definitions,descriptions,filters).rows;
 for(const [status,id]of [['not-started',student.id],['in-progress',started.id],['completed',finished.id]]){
  const filtered=rows({status});assert.equal(filtered.length,1);assert.equal(filtered[0].student.id,id);
  assert.deepEqual(Object.keys(filtered[0].summary).sort(),['lastLearnedAt','rewards','status']);
 }
 for(const selected of [['not-started','in-progress'],['in-progress','completed'],['not-started','completed'],['not-started','in-progress','completed']]){
  const filtered=rows({status:selected.join(',')});assert.equal(filtered.length,selected.length);
  assert.deepEqual(new Set(filtered.map(row=>row.summary.status)),new Set(selected));
 }
 assert.equal(rows({status:''}).length,4);
 assert.equal(rows({status:'in-progress'})[0].summary.rewards[0].stars,0);
 assert.equal(rows().find(row=>row.student.classId===other.id).summary.status,null);
 store.updateClass(group.id,group.name,[course,'unit1-2']);
 assert.equal(rows().find(row=>row.student.id===finished.id).summary.status,'in-progress');
 assert.equal(rows({course,status:'completed'})[0].student.id,finished.id);
 store.updateStudent(started.id,started.name,group.id,false);
 assert.equal(rows({course,status:'in-progress'})[0].student.active,0);
});


test('star ordering covers the full query before pagination, keeps ties stable and follows the course scope',t=>{
 const {store,student,group}=fixture(t),course='unit13-14';
 const students=[student,...store.createStudents(Array.from({length:29},()=>({name:'同名学生',pinyin:'tongmingxuesheng'})),group.id)];
 store.saveProgress(students[1].id,course,0,book());
 store.saveProgress(students[27].id,course,0,book());
 store.saveProgress(students[29].id,course,0,completeBook());
 const zero=students.filter((_,index)=>![1,27,29].includes(index));
 const dashboard=filters=>learning.dashboard(store.learning.read({active:'all'}),definitions,descriptions,filters);
 for(const [sort,expected]of [
  ['stars-asc',[...zero,students[1],students[27],students[29]]],
  ['stars-desc',[students[29],students[1],students[27],...zero]]
 ]){
  const first=dashboard({course,sort}),second=dashboard({course,sort,page:2});
  assert.equal(first.rows.length,25);assert.equal(second.rows.length,5);
  assert.deepEqual([...first.rows,...second.rows].map(row=>row.student.id),expected.map(row=>row.id),sort);
 }
 assert.equal(dashboard({}).rows[0].student.id,student.id);
 assert.deepEqual(dashboard({course,status:'in-progress,completed',sort:'stars-desc'}).rows.map(row=>row.student.id),[students[29].id,students[1].id,students[27].id]);
 // Keep this cross-course sorting fixture on two completion-based 15-star courses.
 // Lesson 1–2 awards now require a separate zero-error round, not completion alone.
 store.updateClass(group.id,group.name,[course,'unit3-4']);
 store.saveProgress(students[1].id,'unit3-4',0,completeBook('unit3-4'));
 assert.equal(dashboard({sort:'stars-desc'}).rows[0].student.id,students[1].id);
 assert.equal(dashboard({course,sort:'stars-desc'}).rows[0].student.id,students[29].id);
 store.updateClass(group.id,group.name,[course]);
 assert.equal(dashboard({sort:'stars-desc'}).rows[0].student.id,students[29].id);
});


test('last learned time uses accepted work in the current scope, never visits, replays, resets or undated imports',t=>{
 const {store,student,group}=fixture(t),course='unit13-14';
 const record=learning.submissions(observer.snapshot(book()),definitions[course],course)[0];
 const report=()=>learning.studentReport(view(store,student));
 const summary=filters=>learning.dashboard(store.learning.read(),definitions,descriptions,filters).rows[0].summary;
 store.learning.enter(student.id,course,0,1000);
 assert.equal(summary({}).lastLearnedAt,null);
 store.learning.sync(student.id,course,0,[{...record,correct:0,firstCorrect:0}],false,2000);
 assert.equal(summary({}).lastLearnedAt,2000);assert.equal(summary({}).status,'in-progress');
 store.learning.enter(student.id,course,0,3000);
 store.learning.sync(student.id,course,0,[{...record,correct:0,firstCorrect:0}],false,4000);
 assert.equal(report().courses[0].lastLearnedAt,2000);
 store.learning.sync(student.id,course,0,[{...record,correct:0,firstCorrect:0,attempts:2}],false,5000);
 assert.equal(summary({}).lastLearnedAt,5000); // Trying again counts even when no stars are earned.
 store.updateClass(group.id,group.name,[course,'unit1-2']);
 const full=completeBook('unit1-2'),reading={activity:{unitCompleted:{text:full.activity.unitCompleted.text},unitDialogue:full.activity.unitDialogue}};
 store.saveProgress(student.id,'unit1-2',0,reading);store.learning.sync(student.id,'unit1-2',0,[],true,7000);
 assert.equal(summary({}).lastLearnedAt,7000);assert.equal(summary({course}).lastLearnedAt,5000);
 store.updateClass(group.id,group.name,[course]);
 assert.equal(summary({}).lastLearnedAt,5000);assert.equal(summary({course:'unit1-2'}).lastLearnedAt,7000);
 store.resetLearning(student.id,course,1);
 assert.equal(summary({}).lastLearnedAt,null);assert.equal(summary({}).status,'not-started');
 store.saveProgress(student.id,course,1,book());
 assert.equal(summary({}).lastLearnedAt,null);assert.equal(summary({}).status,'in-progress');
 store.updateClass(group.id,group.name,[]);assert.equal(summary({}).lastLearnedAt,null);
 const retired=learning.courseSummary({unit:definitions[course],course,meta:{lastRecordAt:9000},observations:[{...record,revision:'retired-content',receivedAt:9000}]});
 assert.equal(retired.status,'not-started');assert.equal(retired.lastLearnedAt,null);
});
