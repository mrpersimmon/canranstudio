'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const catalog = require('../core/course-catalog');
const {relocateSource}=require('../scripts/public-base-path');
const record = value => value && typeof value === 'object' && !Array.isArray(value);
function definition(root, course, basePath = '/lesson/') {
  const sandbox = { CanranCore: { courseCatalog: catalog }, document: { documentElement: { dataset: { unit:course } } } };
  vm.runInNewContext(relocateSource(fs.readFileSync(path.join(root, course, 'content.js'), 'utf8'),course+'/content.js',basePath), sandbox);
  const unit=sandbox.CanranCore['unit' + course.slice(4).replace('-', '')];
  return unit;
}
function sameSignature(saved,current){if(saved===current)return true;if(typeof saved!=='string'||typeof current!=='string')return false;try{const clean=s=>JSON.stringify(JSON.parse(s),(key,value)=>key==='hint'?undefined:typeof value==='string'?value.replace(/^\/lesson\/(?=assets\/)/,'/'):value);return clean(saved)===clean(current);}catch{return false;}}
function normalize(value, unit, course) {
  const result={version:1,groups:{},records:{},activity:{unitCompleted:{}}};
  if (!record(value) || !record(value.activity)) return result;
  const signatures = Object.fromEntries(Object.entries(unit.questions).map(([id,items])=>[id,course==='unit49-50'?'v1:'+items.map(q=>q.id).join('|'):JSON.stringify([unit.version,items])]));
  signatures.text=course==='unit49-50'?'v1:'+unit.learning.DIALOGUE.map(line=>line.text).join('|'):JSON.stringify([unit.version,unit.learning.DIALOGUE]);
  if(course==='unit49-50')signatures.subjects='v1:'+unit.learning.SUBJECTS.version;
  for(const [id,signature] of Object.entries(value.activity.unitCompleted||{})) {
    if(!sameSignature(signature,signatures[id]))continue;
    if(id==='text') {
      const dialogue=value.activity.unitDialogue;
      if(!dialogue?.done || !(dialogue.heard||dialogue.viewed)?.length || !unit.learning.DIALOGUE.every((_,i)=>(dialogue.heard||dialogue.viewed)[i]===true))continue;
      result.activity.unitDialogue=dialogue;
    } else if(id==='subjects'&&course==='unit49-50') {
      const run=value.activity.subjectRound;
      if(!run?.done||run.version!==unit.learning.SUBJECTS.version||!unit.learning.SUBJECTS.questions.every(q=>{const last=run.submissions?.filter(s=>s.questionId===q.id).at(-1);return last?.checked&&last.correct&&last.selection===q.answer&&last.runId===run.runId;}))continue;
      result.activity.subjectRound=value.activity.subjectRound;
    } else {
      const questions=unit.questions[id];
      const entry=Object.entries(value.groups||{}).find(([,group])=>group.signature===questions.map(q=>q.id).join('|')&&group.index===questions.length&&questions.every((q,i)=>{const s=group.states?.[i];return s?.checked===true&&s.correct===true&&s.selection===q.answer&&s.attempts>0&&s.questionId===q.id&&s.runId===group.runId;}));
      if(!entry)continue;
      if(['__proto__','constructor','prototype'].includes(entry[0]))continue;
      const currentContent=JSON.stringify([unit.version??null,questions],(key,item)=>key==='hint'?undefined:item);
      result.groups[entry[0]]=sameSignature(entry[1].contentSignature,currentContent)?{...entry[1],contentSignature:currentContent}:entry[1];
      for(const q of questions)if(record(value.records?.[q.id]))result.records[q.id]=value.records[q.id];
    }
    result.activity.unitCompleted[id]=signatures[id];
  }
  const complete=unit.stages.flatMap(s=>s.required).every(id=>result.activity.unitCompleted[id]===signatures[id]);
  // An explicitly merged course may need validated predecessor rounds on a
  // second device. Keep them as migration sources, never as current completion.
  // Unsubmitted drafts and arbitrary notebook history still stay on their device.
  const predecessors=[...new Set(Object.values(unit.activityPredecessors||{}).flat())];
  const retained={};
  if(!complete)for(const id of predecessors){
    const questions=unit.previousQuestions?.[id];if(!Array.isArray(questions))continue;
    const signature=JSON.stringify([unit.version,questions]);
    const proof=value.activity.unitPreviousCompleted?.[id]||value.activity.unitCompleted?.[id];
    if(!sameSignature(proof,signature))continue;
    const key=course.replace('-','')+'-'+id+'-practice/v1';
    const group=value.groups?.[key],content=JSON.stringify([unit.version,questions],(field,item)=>field==='hint'?undefined:item);
    if(!group||group.draftVersion!==2||typeof group.runId!=='string'||!group.runId||group.index!==questions.length||group.signature!==questions.map(q=>q.id).join('|')||!sameSignature(group.contentSignature,content))continue;
    if(!questions.every((q,i)=>{const s=group.states?.[i];return s?.checked===true&&s.correct===true&&s.selection===q.answer&&Number.isInteger(s.attempts)&&s.attempts>0&&typeof s.firstCorrect==='boolean'&&s.questionId===q.id&&s.runId===group.runId;}))continue;
    result.groups[key]={...group,contentSignature:content};retained[id]=signature;
    for(const q of questions)if(record(value.records?.[q.id]))result.records[q.id]=value.records[q.id];
  }
  if(Object.keys(retained).length)result.activity.unitPreviousCompleted=retained;
  for(const [id, priorIds] of Object.entries(unit.activityPredecessors||{})){
    if(result.activity.unitCompleted[id])continue;
    const questions=unit.questions[id];
    const states=questions.map(q=>{
      for(const priorId of priorIds){
        if(!retained[priorId])continue;
        const i=unit.previousQuestions[priorId].findIndex(old=>sameSignature(JSON.stringify(old),JSON.stringify(q)));
        if(i>=0)return result.groups[course.replace('-','')+'-'+priorId+'-practice/v1'].states[i];
      }
      return null;
    });
    // Only unchanged, explicitly checked answers can complete a merged activity.
    // A new question (such as her) keeps this entire activity pending.
    if(!states.every(Boolean))continue;
    const runId='merged:'+states.map(state=>state.runId).filter((value,index,all)=>all.indexOf(value)===index).join(':');
    result.groups[course.replace('-','')+'-'+id+'-practice/v2']={index:questions.length,states:states.map(state=>({...state,runId})),runId,draftVersion:2,signature:questions.map(q=>q.id).join('|'),contentSignature:JSON.stringify([unit.version,questions],(key,item)=>key==='hint'?undefined:item)};
    result.activity.unitCompleted[id]=signatures[id];
  }
  // Personal certificate text is metadata, never proof of completion. A new
  // question or a partial sync must not erase it when scores are revalidated.
  // Authentication still owns this record; only the validated groups above can
  // award stars or unlock a certificate. An explicit course reset clears both.
  if(typeof value.activity.unitName==='string')result.activity.unitName=value.activity.unitName.slice(0,20);
  for(const key of ['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt']) {
    const date=value.activity[key];
    if(typeof date==='string'&&date.length<=50&&Number.isFinite(Date.parse(date)))result.activity[key]=new Date(date).toISOString();
  }
  return result;
}
function merge(left,right){return {version:1,groups:{...left.groups,...right.groups},records:{...left.records,...right.records},activity:{...left.activity,...right.activity,unitCompleted:{...left.activity?.unitCompleted,...right.activity?.unitCompleted}}};}
function summary(value,unit,course){const saved=normalize(value,unit,course).activity.unitCompleted;let stars=0,next='certificate';for(const stage of unit.stages){stars+=Math.floor(stage.required.filter(id=>saved[id]).length/stage.required.length*3);}for(const stage of unit.stages){const unfinished=stage.required.find(id=>!saved[id]);if(unfinished){next=unfinished;break;}}return {stars,next:stars===0?'words':next};}
module.exports={definition,normalize,merge,summary};
