'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{definition}=require('../../server/progress'),learning=require('../../server/learning'),wire=require('../../server/public/learning-observer');
const course='unit143-144',unit=definition(process.cwd(),course,'/'),bytes=o=>Buffer.byteLength(JSON.stringify(o));
function round(i){const groups={};for(const [id,qs] of Object.entries(unit.questions)){
 const runId='round-'+i+'-'+id;groups[id]={runId,signature:qs.map(q=>q.id).join('|'),contentSignature:JSON.stringify([unit.version,qs],(k,v)=>k==='hint'?undefined:v),states:qs.map(q=>({runId,questionId:q.id,selection:q.answer,checked:true,firstCorrect:true,correct:true,attempts:1}))};
 }return wire.snapshot({groups});}
test('offline observations survive bounded UTF-8 transfers, reload, retry and an answer arriving in flight',t=>{
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{DatabaseSync}=require('node:sqlite');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'canran-offline-rounds-')),store=require('../../server/store').openStore(dir),db=new DatabaseSync(path.join(dir,'learning.sqlite'));
 t.after(()=>{db.close();store.close();fs.rmSync(dir,{recursive:true,force:true});});
 const cls=store.createClass('离线'),[student]=store.createStudents([{name:'学生',pinyin:'xuesheng'}],cls.id);
 const {questionState}=require('../../review-bench/state-model');
 let observations,corrected;for(let i=0;i<25;i++){
  const work=round(i);
  if(i===0){const original=work.groups[0].states[0],q=Object.values(unit.questions).flat().find(q=>q.id===original.questionId);
   work.groups[0].states[0]=questionState(q,original.runId,'wrong');
   corrected=round(i);corrected.groups[0].states[0]=questionState(q,original.runId,'corrected');
  }
  observations=wire.merge(observations,work);
 }
 let pending={studentId:'test',course,generation:0,grant:'lesson',value:{activity:{unitCompleted:{text:'原文'}}},observations};
 assert.ok(bytes(pending)>1500000);const seen=new Map();let uploads=0;
 while(pending){
  const chunk=wire.nextUpload(pending);assert.ok(bytes(chunk)<=512*1024);assert.deepEqual(wire.nextUpload(JSON.parse(JSON.stringify(pending))),chunk);
  const records=learning.submissions(chunk.observations,unit,course);
  store.saveObservations(student.id,course,0,records);
  if(!uploads)store.saveObservations(student.id,course,0,records); // response lost and same bytes retried
  for(const row of records)seen.set(row.run+'/'+row.question,row);
  if(++uploads===1){
   pending={...pending,observations:wire.merge(pending.observations,corrected)};
  }
  pending=wire.afterUpload(pending,chunk);
  if(pending){pending=JSON.parse(JSON.stringify(pending));assert.equal(chunk.observationsOnly,true);}else assert.equal(chunk.value.activity.unitCompleted.text,'原文');
  assert.ok(uploads<20);
 }
 assert.ok(uploads>1);assert.equal(seen.size,25*65);assert.ok([...seen.values()].some(r=>r.attempts===2&&!r.firstCorrect&&r.correct));
 const totals=db.prepare('SELECT count(*) n,sum(attempts) attempts,sum(firstCorrect) firsts,sum(correct) correct FROM learning_submissions').get();
 assert.deepEqual({...totals},{n:1625,attempts:1626,firsts:1624,correct:1625});
});

test('a large group splits on submitted states, and a newer generation cannot be cleared by its receipt',()=>{
 const group=round(1).groups[0],p={studentId:'a',course,generation:1,value:{},observations:{version:1,groups:[group]}};
 const target=bytes({...p,value:{},observationsOnly:true,observations:{version:1,groups:[{...group,states:group.states.slice(0,1)}]}});
 const batch=wire.nextUpload(p,target);assert.equal(batch.observations.groups[0].states.length,1);assert.ok(bytes(batch)<=target);
 const later={...p,generation:2};assert.equal(wire.afterUpload(later,batch),later);
 assert.equal(wire.afterUpload(p,batch).observations.groups[0].states.length,group.states.length-1);
 assert.throws(()=>wire.nextUpload({...p,observations:{version:1,groups:[]},value:{data:'字'.repeat(500000)}}),e=>e.code==='UPLOAD_TOO_LARGE');
});
