'use strict';
// Read models for student learning progress. Observations never restore drafts or award stars.
const crypto = require('node:crypto');
const progress = require('./progress');
const statuses = Object.freeze(['not-started','in-progress','completed']);
const canonical = value => JSON.stringify(value, (key, item) => key === 'hint' ? undefined : typeof item === 'string' ? item.replace(/^\/lesson\/(?=assets\/)/, '/') : item);
const digest = value => crypto.createHash('sha256').update(canonical(value)).digest('hex');
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const id = value => typeof value === 'string' && value.length > 0 && value.length <= 150 && !['__proto__','constructor','prototype'].includes(value);
const newest = values => values.filter(Number.isFinite).reduce((a,b) => Math.max(a,b), 0) || null;
function activities(unit, course) {
  return [...new Set(unit.stages.flatMap(stage => stage.required))].map(key => {
    const stage = unit.stages.find(s => s.required.includes(key));
    const subjects = course === 'unit49-50' && key === 'subjects';
    const questions = subjects ? unit.learning.SUBJECTS.questions : unit.questions[key] || [];
    const content = subjects ? unit.learning.SUBJECTS : key === 'text' ? unit.learning.DIALOGUE : questions;
    return { id:key, title:stage.activities.find(a=>a[0]===key)?.[1] || key, stage:stage.title,
      questions, revision:digest([unit.version ?? null, content]), contentSignature:canonical([unit.version ?? null, questions]),
      subjects, dialogue:key === 'text' };
  });
}
function validSelection(q, selection) {
  if (typeof selection !== 'string' || !selection || selection.length > 2000) return false;
  if (q.options) return q.options.includes(selection);
  if (q.type === 'write') return selection === selection.trim().toLowerCase();
  if (q.type === 'order' || q.type === 'wordbank') {
    // The wire only includes the submitted answer, never the draft's controls.
    const remaining = [...q.tokens];
    function consume(text, count) {
      if (!text) return count === (q.slots || q.tokens.length);
      if (count >= (q.slots || q.tokens.length)) return false;
      const tried=new Set();
      for (let i=0;i<remaining.length;i++) {
        const token=remaining[i]; if(tried.has(token))continue;tried.add(token);if (token===null || !(text===token || text.startsWith(token+' '))) continue;
        remaining[i]=null; const ok=consume(text===token?'':text.slice(token.length+1),count+1); remaining[i]=token;
        if(ok)return true;
      }
      return false;
    }
    return consume(selection,0);
  }
  let list; try { list=JSON.parse(selection); } catch { return false; }
  if (!Array.isArray(list)) return false;
  if (q.type === 'cloze') return list.length===q.blanks.length && list.every((v,i)=>q.blanks[i].options.includes(v));
  if (q.type === 'match') return list.length===q.pairs.length && new Set(list).size===list.length && list.every(v=>q.pairs.some(p=>p.id===v));
  if (q.type === 'handoff') return list.length===2 && q.objects.some(x=>x.id===list[0]) && q.recipients.some(x=>x.id===list[1]);
  return false;
}
function submissions(payload, unit, course, known={}) {
  if (!object(payload) || payload.version!==1 || !Array.isArray(payload.groups)) return [];
  const specs=activities(unit,course), results=[];
  for (const group of payload.groups) {
    if (!object(group) || !id(group.runId) || !Array.isArray(group.states) || group.states.length>1000) continue;
    const spec=specs.find(a=>a.subjects ? group.subjectVersion===unit.learning.SUBJECTS.version : group.signature===a.questions.map(q=>q.id).join('|') && a.questions.length && (()=>{try{return canonical(JSON.parse(group.contentSignature))===a.contentSignature;}catch{return false;}})());
    if (!spec) continue;
    for (const state of group.states) {
      const q=spec.questions.find(q=>q.id===state?.questionId);
      if (!q || state.runId!==group.runId || state.checked!==true || !Number.isInteger(state.attempts) || state.attempts<1 || state.attempts>10000 || typeof state.firstCorrect!=='boolean' || typeof state.correct!=='boolean') continue;
      if (state.correct !== (state.selection===q.answer) || (state.attempts===1 && state.firstCorrect!==state.correct)) continue;
      if (spec.subjects ? ![q.answer,...Object.keys(q.wrong || {})].includes(state.selection) : !validSelection(q,state.selection)) continue;
      // Existing completed proof is a baseline, not a fresh learning event.
      // This also covers an older client re-uploading completed work after rollout.
      const prior=spec.subjects?known.activity?.subjectRound?.submissions?.filter(s=>s.runId===group.runId&&s.questionId===q.id):Object.values(known.groups||{}).flatMap(g=>g.runId===group.runId?(g.states||[]).filter(s=>s?.questionId===q.id):[]);
      if(prior?.some(s=>spec.subjects?prior.length>=state.attempts:s.attempts>=state.attempts))continue;
      results.push({ knownComplete:Boolean(known.activity?.unitCompleted?.[spec.id]),activity:spec.id, revision:spec.revision, run:group.runId, question:q.id, attempts:state.attempts, correct:Number(state.correct), firstCorrect:Number(state.firstCorrect) });
    }
  }
  return results;
}
function courseSummary({unit,course,value={},observations=[],meta={},award=null}) {
  const normalized=progress.normalize(value,unit,course), completed=normalized.activity.unitCompleted;
  const reward=progress.summary(normalized,unit,course,award);
  const specs=activities(unit,course);
  const parts=specs.map(spec=>{
    const records=observations.filter(row=>row.activity===spec.id && row.revision===spec.revision);
    const answered=new Set(records.map(row=>row.question)), correct=new Set(records.filter(row=>row.correct).map(row=>row.question));
    const done=Boolean(completed[spec.id]);
    return {id:spec.id,title:spec.title,stage:spec.stage,completed:done,questionTotal:spec.questions.length,
      submitted:done?spec.questions.length:answered.size,correct:done?spec.questions.length:correct.size,
      status:done?'completed':answered.size?'in-progress':'not-started',
      lastRecordAt:newest(records.map(row=>row.receivedAt)),
      stars:unit.reward?Number(Boolean(award?.zones?.[spec.id])):null};
  });
  const completedActivities=parts.filter(a=>a.completed).length,totalActivities=parts.length;
  const complete=totalActivities>0&&completedActivities===totalActivities;
  const status=complete?'completed':parts.some(a=>a.completed||a.submitted>0)?'in-progress':'not-started';
  return {...reward,status,completedActivities,totalActivities,percent:totalActivities?Math.floor(completedActivities/totalActivities*100):0,
    completed:complete,
    submitted:parts.reduce((sum,a)=>sum+a.submitted,0),correct:parts.reduce((sum,a)=>sum+a.correct,0),questionTotal:parts.reduce((sum,a)=>sum+a.questionTotal,0),
    nextActivity:parts.find(a=>!a.completed)?.title || null,activities:parts,
    enteredAt:meta.enteredAt || null,lastRecordAt:meta.lastRecordAt || null,lastProgressAt:meta.lastProgressAt || null,resetAt:meta.resetAt || null,
    hasHistoricalVersion:observations.some(row=>!specs.some(a=>a.id===row.activity&&a.revision===row.revision)),
    hasRecord:completedActivities>0 || observations.length>0 || Boolean(meta.lastRecordAt)};
}
function totals(courses) {
  const rewards=new Map();
  for(const c of courses){const key=c.rewardRule+':'+c.maxStars;if(!rewards.has(key))rewards.set(key,{rule:c.rewardRule,maxStarsPerCourse:c.maxStars,stars:0,maxStars:0,courses:0});const row=rewards.get(key);row.stars+=c.stars;row.maxStars+=c.maxStars;row.courses++;}
  const totalActivities=courses.reduce((n,c)=>n+c.totalActivities,0),completedActivities=courses.reduce((n,c)=>n+c.completedActivities,0);
  const status=!courses.length?null:courses.every(c=>c.status==='completed')?'completed':courses.some(c=>c.status==='in-progress'||c.status==='completed')?'in-progress':'not-started';
  return {status,totalCourses:courses.length,completedCourses:courses.filter(c=>c.completed).length,totalActivities,completedActivities,
    percent:totalActivities?Math.floor(completedActivities/totalActivities*100):0,rewards:[...rewards.values()],
    lastRecordAt:newest(courses.map(c=>c.lastRecordAt)),lastProgressAt:newest(courses.map(c=>c.lastProgressAt))};
}
function studentView(student, dataset, definitions, descriptions) {
  const group=dataset.classes.find(c=>c.id===student.classId);
  const saved=dataset.progress.filter(row=>row.student===student.id),meta=dataset.meta.filter(row=>row.student===student.id),records=dataset.observations.filter(row=>row.student===student.id);
  const awards=dataset.awards.filter(row=>row.student===student.id);
  const ids=new Set([...(group?.courses||[]),...saved.map(row=>row.course),...meta.map(row=>row.course),...awards.map(row=>row.course)]);
  const courses=descriptions.filter(c=>ids.has(c.id)).map(description=>{
    const course=description.id,unit=definitions[course],savedRow=saved.find(row=>row.course===course),metadata=meta.find(row=>row.course===course);
    const open=Boolean(group?.courses.includes(course));
    const summary=courseSummary({unit,course,value:savedRow?.value,observations:records.filter(row=>row.course===course&&row.generation===(savedRow?.generation||0)),meta:metadata,award:awards.find(row=>row.course===course&&row.edition===unit.reward?.edition)?.value});
    return {previousGenerations:new Set(records.filter(row=>row.course===course&&row.generation!==(savedRow?.generation||0)).map(row=>row.generation)).size,id:course,label:description.label,title:description.title,open,...summary};
  });
  return {student:{id:student.id,name:student.name,studentNumber:student.studentNumber,active:student.active,classId:student.classId,className:group?.name||''},
    courses,summary:totals(courses.filter(c=>c.open)),historySummary:totals(courses.filter(c=>!c.open)),observedFrom:student.observedFrom};
}
// Only the teaching-facing status and stars leave the read model.
function summaryRecord({status,rewards}) { return {status,rewards}; }
function courseRecord({id,label,title,open,status,stars,maxStars,rewardRule}) {
  return {id,label,title,open,status,stars,maxStars,rewardRule};
}
function studentReport(view) {
  return {student:view.student,summary:summaryRecord(view.summary),courses:view.courses.map(courseRecord)};
}
function dashboard(dataset,definitions,descriptions,filters={}) {
  let rows=dataset.students.map(student=>{
    const view=studentView(student,dataset,definitions,descriptions);
    const scope=view.courses.filter(c=>filters.course?c.id===filters.course:c.open);
    return {student:view.student,summary:totals(scope),scope};
  });
  if(filters.course)rows=rows.filter(r=>r.scope.length);
  const before=rows.length;
  if(statuses.includes(filters.status))rows=rows.filter(r=>r.summary.status===filters.status);
  rows.sort((a,b)=>a.student.studentNumber.localeCompare(b.student.studentNumber));
  const pageSize=25,page=Math.min(Math.max(1,Number.parseInt(filters.page,10)||1),Math.max(1,Math.ceil(rows.length/pageSize)));
  return {classes:dataset.classes.map(({id,name})=>({id,name})),courses:descriptions.map(({id,title,label})=>({id,title,label})),total:rows.length,scopeTotal:before,page,pageSize,
    rows:rows.slice((page-1)*pageSize,page*pageSize).map(({student,summary})=>({student,summary:summaryRecord(summary)}))};
}
module.exports={statuses,activities,submissions,courseSummary,totals,studentView,studentReport,courseRecord,dashboard};
