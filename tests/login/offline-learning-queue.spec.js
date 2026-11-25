'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseReadyForAssertions}=require('../support/completion-layout');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress'),observer=require('../../server/public/learning-observer'),model=require('../../review-bench/state-model');
const base=process.env.AWARD_TEST_BASE||'/lesson/',course='unit143-144';
function offlineWork(prefix){
 const unit=definition(process.cwd(),course,base);let observations,book;
 for(let n=0;n<25;n++){
  const groups={},activity={unitCompleted:{},unitAwardClaims:{}},records={};
  for(const [id,qs]of Object.entries(unit.questions)){
   const runId=prefix+'-'+n+'-'+id,states=qs.map(q=>model.questionState(q,runId,'correct'));
   const signature=qs.map(q=>q.id).join('|'),contentSignature=JSON.stringify([unit.version,qs],(k,v)=>k==='hint'?undefined:v);
   groups['unit143144-'+id+'-practice/v1']={runId,signature,contentSignature,states,index:qs.length,draftVersion:2};
   for(const s of states)records[s.questionId]=s;activity.unitCompleted[id]=JSON.stringify([unit.version,qs]);
   activity.unitAwardClaims[id]={runId,contentSignature,states,index:qs.length,edition:unit.reward.edition,roundPolicy:unit.reward.edition};
  }
  book={version:1,groups,activity,records};observations=observer.merge(observations,observer.snapshot(book));
 }
 return {value:book,observations};
}
for(const device of devices)test('offline queue drains from the course and home on '+device.name,async({page,browser})=>{
 test.setTimeout(150000);await adminLogin(page,base);const account=await createStudent(page,'离线验收 '+device.id,'离线同学',[/^Lesson 143–144 /]);
 const {context,page:p}=await studentLogin(browser,account,base,contextOptions(device));
 try{
  let date;
  for(const surface of ['course','home']){
   await p.goto(base+course+'/#learn/exam');await courseReadyForAssertions(p);
   await expect(p.locator('.learning-surface .practice-content')).toBeVisible();
   const meta=await p.evaluate(async()=>{const a=await window.CanranAccessReady;return {studentId:a.student.id,grant:a.grant,epoch:a.systemUpgrade?.epoch,generation:a.progress.generation};});
   const work=offlineWork(surface),payload={...meta,course,...work};
   expect(Buffer.byteLength(JSON.stringify(payload))).toBeGreaterThan(1500000);
   const stored=await p.evaluate(q=>{const k=window.CanranSystemUpgrade.namespace(q.studentId,window.CanranStudentAccess.systemUpgrade)+'pending:'+q.course;localStorage.setItem(k,JSON.stringify(q));return k;},payload);
   const posts=[];
   const read=r=>{if(r.url().endsWith('/api/progress')&&r.request().method()==='POST')posts.push({body:r.request().postData(),status:r.status()});};
   p.on('response',read);
   if(surface==='course')await p.reload();else await p.goto(base);
   await expect.poll(()=>p.evaluate(k=>localStorage.getItem(k),stored).then(x=>x===null),{timeout:50000}).toBe(true);
   p.off('response',read);
   expect(posts.length).toBeGreaterThan(1);expect(posts.every(r=>r.status===200&&Buffer.byteLength(r.body)<=512*1024)).toBe(true);
   const sent=posts.map(r=>JSON.parse(r.body)),states=new Set(sent.flatMap(q=>(q.observations?.groups||[]).flatMap(g=>g.states.map(s=>g.runId+'/'+s.questionId))));
   expect([...states].filter(k=>k.startsWith(surface+'-')).length).toBe(25*65);
   const who=await (await p.request.get(base+'api/me')).json(),summary=who.courses.find(c=>c.id===course);
   expect(summary.stars).toBe(5);expect(summary.firstFullStarAt).toBeTruthy();
   if(date)expect(summary.firstFullStarAt).toBe(date);date=summary.firstFullStarAt;
   const teacher=await (await page.request.get(base+'api/admin/students/'+meta.studentId+'/learning/'+course)).json();
   expect(teacher.course.stars).toBe(5);
  }
 }finally{await context.close();}
});
