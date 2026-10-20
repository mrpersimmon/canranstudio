'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const catalog = require('../core/course-catalog');
const awardRules = require('../core/award-rules');
const {relocateSource}=require('../scripts/public-base-path');
const record = value => value && typeof value === 'object' && !Array.isArray(value);
function definition(root, course, basePath = '/lesson/') {
  const sandbox = { CanranCore: { courseCatalog: catalog }, document: { documentElement: { dataset: { unit:course } } } };
  vm.runInNewContext(relocateSource(fs.readFileSync(path.join(root, course, 'content.js'), 'utf8'),course+'/content.js',basePath), sandbox);
  const unit=sandbox.CanranCore['unit' + course.slice(4).replace('-', '')];
  return unit;
}
function sameSignature(saved,current){if(saved===current)return true;if(typeof saved!=='string'||typeof current!=='string')return false;try{const clean=s=>JSON.stringify(JSON.parse(s),(key,value)=>key==='hint'?undefined:typeof value==='string'?value.replace(/^\/lesson\/(?=assets\/)/,'/'):value);return clean(saved)===clean(current);}catch{return false;}}
let legacyButcher;
function butcherLegacyDefinition(){
  if(!legacyButcher){
    const sandbox={CanranCore:{courseCatalog:catalog}};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit49-50-content.js'),'utf8'),sandbox);
    legacyButcher=sandbox.CanranCore.unit4950;
  }
  return legacyButcher;
}
let interviewLegacy;
function interviewLegacyDefinition(){
  if(!interviewLegacy){
    const sandbox={CanranCore:{courseCatalog:catalog}};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit7-8-content.js'),'utf8'),sandbox);
    interviewLegacy=sandbox.CanranCore.unit78;
  }
  return interviewLegacy;
}
let greetingLegacy;
function greetingLegacyDefinition(){
  if(!greetingLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit9-10-content.js'),'utf8'),sandbox);greetingLegacy=sandbox.CanranCore.unit910;}
  return greetingLegacy;
}
let ownershipLegacy;
function ownershipLegacyDefinition(){
  if(!ownershipLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit11-12-content.js'),'utf8'),sandbox);ownershipLegacy=sandbox.CanranCore.unit1112;}
  return ownershipLegacy;
}
let colourLegacy;
function colourLegacyDefinition(){
  if(!colourLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit13-14-content.js'),'utf8'),sandbox);colourLegacy=sandbox.CanranCore.unit1314;}
  return colourLegacy;
}
let travelLegacy;
function travelLegacyDefinition(){
  if(!travelLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit15-16-content.js'),'utf8'),sandbox);travelLegacy=sandbox.CanranCore.unit1516;}
  return travelLegacy;
}
let officeLegacy;
function officeLegacyDefinition(){
  if(!officeLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit17-18-content.js'),'utf8'),sandbox);officeLegacy=sandbox.CanranCore.unit1718;}
  return officeLegacy;
}
let parkLegacy;
function parkLegacyDefinition(){
  if(!parkLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit19-20-content.js'),'utf8'),sandbox);parkLegacy=sandbox.CanranCore.unit1920;}
  return parkLegacy;
}
let booksLegacy;
function booksLegacyDefinition(){
  if(!booksLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit21-22-content.js'),'utf8'),sandbox);booksLegacy=sandbox.CanranCore.unit2122;}
  return booksLegacy;
}
let glassesLegacy;
function glassesLegacyDefinition(){
  if(!glassesLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit23-24-content.js'),'utf8'),sandbox);glassesLegacy=sandbox.CanranCore.unit2324;}
  return glassesLegacy;
}
let kitchenLegacy;
function kitchenLegacyDefinition(){
  if(!kitchenLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit25-26-content.js'),'utf8'),sandbox);kitchenLegacy=sandbox.CanranCore.unit2526;}
  return kitchenLegacy;
}
let livingRoomLegacy;
function livingRoomLegacyDefinition(){
  if(!livingRoomLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit27-28-content.js'),'utf8'),sandbox);livingRoomLegacy=sandbox.CanranCore.unit2728;}
  return livingRoomLegacy;
}
let tidyingLegacy;
function tidyingLegacyDefinition(){
  if(!tidyingLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit29-30-content.js'),'utf8'),sandbox);tidyingLegacy=sandbox.CanranCore.unit2930;}
  return tidyingLegacy;
}
let gardenLegacy;
function gardenLegacyDefinition(){
  if(!gardenLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit31-32-content.js'),'utf8'),sandbox);gardenLegacy=sandbox.CanranCore.unit3132;}
  return gardenLegacy;
}
let riversideLegacy;
function riversideLegacyDefinition(){
  if(!riversideLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit33-34-content.js'),'utf8'),sandbox);riversideLegacy=sandbox.CanranCore.unit3334;}
  return riversideLegacy;
}
let villageLegacy;
function villageLegacyDefinition(){
  if(!villageLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit35-36-content.js'),'utf8'),sandbox);villageLegacy=sandbox.CanranCore.unit3536;}
  return villageLegacy;
}
let workshopLegacy;
function workshopLegacyDefinition(){
  if(!workshopLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit37-38-content.js'),'utf8'),sandbox);workshopLegacy=sandbox.CanranCore.unit3738;}
  return workshopLegacy;
}
let vaseLegacy;
function vaseLegacyDefinition(){
  if(!vaseLegacy){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy/unit39-40-content.js'),'utf8'),sandbox);vaseLegacy=sandbox.CanranCore.unit3940;}
  return vaseLegacy;
}
let bagV153Previous;
function bagV153PreviousDefinition(){
 if(!bagV153Previous){const sandbox={CanranCore:{courseCatalog:catalog}};for(const file of ['unit41-42-previous-questions.js','unit41-42-content.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy',file),'utf8'),sandbox);bagV153Previous=sandbox.CanranCore.unit4142;}
 return bagV153Previous;
}
let teaV153Previous;
function teaV153PreviousDefinition(){
 if(!teaV153Previous){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy','unit43-44-content.js'),'utf8'),sandbox);teaV153Previous=sandbox.CanranCore.unit4344;}
 return teaV153Previous;
}
let officeV153Previous;
function officeV153PreviousDefinition(){
 if(!officeV153Previous){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy','unit45-46-content.js'),'utf8'),sandbox);officeV153Previous=sandbox.CanranCore.unit4546;}
 return officeV153Previous;
}
let parkV153Previous;
function parkV153PreviousDefinition(){
 if(!parkV153Previous){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy','unit19-20-before-v153-content.js'),'utf8'),sandbox);parkV153Previous=sandbox.CanranCore.unit1920;}
 return parkV153Previous;
}
let roomV153Previous;
function roomV153PreviousDefinition(){
 if(!roomV153Previous){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy','unit23-24-before-v153-content.js'),'utf8'),sandbox);roomV153Previous=sandbox.CanranCore.unit2324;}
 return roomV153Previous;
}
let kitchenV153Previous;
function kitchenV153PreviousDefinition(){
 if(!kitchenV153Previous){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy','unit25-26-before-v153-content.js'),'utf8'),sandbox);kitchenV153Previous=sandbox.CanranCore.unit2526;}
 return kitchenV153Previous;
}
let livingRoomV153Previous;
function livingRoomV153PreviousDefinition(){
 if(!livingRoomV153Previous){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy','unit27-28-before-v153-content.js'),'utf8'),sandbox);livingRoomV153Previous=sandbox.CanranCore.unit2728;}
 return livingRoomV153Previous;
}
let tidyingV153Previous;
function tidyingV153PreviousDefinition(){
 if(!tidyingV153Previous){const sandbox={CanranCore:{courseCatalog:catalog}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'legacy','unit29-30-before-v153-content.js'),'utf8'),sandbox);tidyingV153Previous=sandbox.CanranCore.unit2930;}
 return tidyingV153Previous;
}
function normalize(value, unit, course) {
  const result={version:1,groups:{},records:{},activity:{unitCompleted:{}}};
  if (!record(value) || !record(value.activity)) return result;
  if (unit.reward) {
    result.activity.unitAwardClaims = Object.fromEntries(unit.reward.zones
      .filter(zone => awardRules.validClaim(unit, zone.id, value.activity.unitAwardClaims?.[zone.id]))
      .map(zone => [zone.id, value.activity.unitAwardClaims[zone.id]]));
  }
  // The course id stays the same when the old 15-completion-star edition is
  // replaced. Its wire format must not be applied to the new five-zone unit.
  const legacyFormat=course==='unit49-50'&&!unit.reward;
  const signatures = Object.fromEntries(Object.entries(unit.questions).map(([id,items])=>[id,legacyFormat?'v1:'+items.map(q=>q.id).join('|'):JSON.stringify([unit.version,items])]));
  signatures.text=legacyFormat?'v1:'+unit.learning.DIALOGUE.map(line=>line.text).join('|'):JSON.stringify([unit.version,unit.learning.DIALOGUE]);
  if(legacyFormat)signatures.subjects='v1:'+unit.learning.SUBJECTS.version;
  for(const [id,signature] of Object.entries(value.activity.unitCompleted||{})) {
    if(!sameSignature(signature,signatures[id]))continue;
    if(id==='text') {
      const dialogue=value.activity.unitDialogue;
      if(!dialogue?.done || !(dialogue.heard||dialogue.viewed)?.length || !unit.learning.DIALOGUE.every((_,i)=>(dialogue.heard||dialogue.viewed)[i]===true))continue;
      result.activity.unitDialogue=dialogue;
    } else if(id==='subjects'&&legacyFormat) {
      const run=value.activity.subjectRound;
      if(!run?.done||run.version!==unit.learning.SUBJECTS.version||!unit.learning.SUBJECTS.questions.every(q=>{const last=run.submissions?.filter(s=>s.questionId===q.id).at(-1);return last?.checked&&last.correct&&last.selection===q.answer&&last.runId===run.runId;}))continue;
      result.activity.subjectRound=value.activity.subjectRound;
    } else {
      const questions=unit.questions[id];
      const entries=Object.entries(value.groups||{});
      const valid=([,group])=>group.signature===questions.map(q=>q.id).join('|')&&group.index===questions.length&&questions.every((q,i)=>{const s=group.states?.[i];return s?.checked===true&&s.correct===true&&s.selection===q.answer&&s.attempts>0&&s.questionId===q.id&&s.runId===group.runId;});
      // These reviewed courses can carry completion and five-star editions together.
      // The same question IDs do not make their completed rounds identical.
      // Prefer this definition's real session, then retain the legacy fallback.
      const expectedKey=['unit19-20','unit21-22','unit23-24','unit25-26','unit27-28','unit29-30'].includes(course)&&unit.reward?course.replace('-','')+'-'+id+'-practice/'+(unit.taskSessions?.[id]||'v1'):null;
      const entry=(expectedKey&&entries.find(item=>item[0]===expectedKey&&valid(item)))||entries.find(valid);
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
  // Versioned question replacements can have several exact predecessors.
  // Keep their completed evidence for the client to carry unchanged answers;
  // it must never count as completion of the replacement activity.
  const taskProofs={};
  if(!complete||unit.historyArchive)for(const[id,sources]of Object.entries(unit.taskPredecessors||{})){
    if(result.activity.unitCompleted[id]&&!unit.historyArchive)continue;
    for(const{key,questions,activity}of sources){
      if(['__proto__','constructor','prototype'].includes(key)||!Array.isArray(questions))continue;
      const signature=JSON.stringify([unit.version,questions]);
      const proof=value.activity.unitPreviousTaskCompleted?.[key]||value.activity.unitCompleted?.[activity||id]||
        Object.values(value.activity.unitCompleted||{}).find(saved=>sameSignature(saved,signature));
      const group=value.groups?.[key],content=JSON.stringify([unit.version,questions],(field,item)=>field==='hint'?undefined:item);
      if(!sameSignature(proof,signature)||!group||group.draftVersion!==2||typeof group.runId!=='string'||!group.runId||
        group.index!==questions.length||group.signature!==questions.map(q=>q.id).join('|')||!sameSignature(group.contentSignature,content))continue;
      if(!questions.every((q,i)=>{const s=group.states?.[i];return s?.checked===true&&s.correct===true&&s.selection===q.answer&&
        Number.isInteger(s.attempts)&&s.attempts>0&&typeof s.firstCorrect==='boolean'&&s.questionId===q.id&&s.runId===group.runId;}))continue;
      result.groups[key]={...group,contentSignature:content};taskProofs[key]=signature;
      for(const q of questions)if(record(value.records?.[q.id]))result.records[q.id]=value.records[q.id];
    }
  }
  if(Object.keys(taskProofs).length)result.activity.unitPreviousTaskCompleted=taskProofs;
  // Lesson 1–2 keeps its exact question/reward editions. Its read-only archive
  // preserves validated completed predecessors even after all current zones
  // are complete; local drafts stay on the device. Never use this for new stars.
  if(course==='unit1-2'&&!unit.historyArchive){
    if(value.activity.unit12V154Seen===true)result.activity.unit12V154Seen=true;
    if(record(value.activity.unit12HistoryProgress)){
      const archived=normalize(value.activity.unit12HistoryProgress,{...unit,reward:null,historyArchive:true},course);
      if(Object.keys(archived.groups).length||archived.activity.unitDialogue||archived.activity.unitCertificateIssuedAt||archived.activity.unitClassroomCertificateIssuedAt)result.activity.unit12HistoryProgress=archived;
    }
  }
  if(course==='unit3-4'&&!unit.historyArchive){
    if(value.activity.unit34V154Seen===true)result.activity.unit34V154Seen=true;
    if(record(value.activity.unit34HistoryProgress)){
      const archived=normalize(value.activity.unit34HistoryProgress,{...unit,reward:null,historyArchive:true},course);
      if(Object.keys(archived.groups).length||archived.activity.unitDialogue||archived.activity.unitCertificateIssuedAt||archived.activity.unitClassroomCertificateIssuedAt)result.activity.unit34HistoryProgress=archived;
    }
  }
  if(course==='unit5-6'&&!unit.historyArchive){
    if(value.activity.unit56V154Seen===true)result.activity.unit56V154Seen=true;
    if(record(value.activity.unit56HistoryProgress)){
      const archived=normalize(value.activity.unit56HistoryProgress,{...unit,reward:null,historyArchive:true},course);
      if(Object.keys(archived.groups).length||archived.activity.unitDialogue||archived.activity.unitCertificateIssuedAt||archived.activity.unitClassroomCertificateIssuedAt)result.activity.unit56HistoryProgress=archived;
    }
  }
  if(course==='unit49-50'&&unit.legacyEdition==='unit49-50-completion-v1'){
    // Validate the frozen previous questions before retaining history. This
    // evidence is deliberately outside current completion and award claims.
    const legacy=normalize(value.activity.unitLegacyProgress||value,butcherLegacyDefinition(),course);
    if(Object.keys(legacy.activity.unitCompleted).length)result.activity.unitLegacyProgress=legacy;
  }
  if(course==='unit7-8'&&unit.legacyEdition==='unit7-8-completion-v1'){
    const predecessor=value.activity.unit78LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit78-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){
      const legacy=normalize(predecessor||value,interviewLegacyDefinition(),course);
      if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit78LegacyProgress=legacy;
    }
  }
  if(course==='unit9-10'&&unit.legacyEdition==='unit9-10-completion-v1'){
    const predecessor=value.activity.unit910LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit910-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,greetingLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit910LegacyProgress=legacy;}
  }
  if(course==='unit11-12'&&unit.legacyEdition==='unit11-12-completion-v1'){
    const predecessor=value.activity.unit1112LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit1112-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,ownershipLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit1112LegacyProgress=legacy;}
  }
  if(course==='unit13-14'&&unit.legacyEdition==='unit13-14-completion-v1'){
    const predecessor=value.activity.unit1314LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit1314-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,colourLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit1314LegacyProgress=legacy;}
  }
  if(course==='unit15-16'&&unit.legacyEdition==='unit15-16-completion-v1'){
    const predecessor=value.activity.unit1516LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit1516-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,travelLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit1516LegacyProgress=legacy;}
  }
  if(course==='unit17-18'&&unit.legacyEdition==='unit17-18-completion-v1'){
    const predecessor=value.activity.unit1718LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit1718-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,officeLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit1718LegacyProgress=legacy;}
  }
  if(course==='unit19-20'&&unit.legacyEdition==='unit19-20-completion-v1'){
    const predecessor=value.activity.unit1920LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit1920-')&&!/\/(?:five-zones-v1|v153)$/.test(key));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,parkLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit1920LegacyProgress=legacy;}
  }
  if(course==='unit21-22'&&unit.legacyEdition==='unit21-22-completion-v1'){
    const predecessor=value.activity.unit2122LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit2122-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,booksLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit2122LegacyProgress=legacy;}
  }
  if(course==='unit23-24'&&unit.legacyEdition==='unit23-24-completion-v1'){
    const predecessor=value.activity.unit2324LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit2324-')&&!/\/(?:five-zones-v1|v153)$/.test(key));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,glassesLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit2324LegacyProgress=legacy;}
  }
  if(course==='unit25-26'&&unit.legacyEdition==='unit25-26-completion-v1'){
    const predecessor=value.activity.unit2526LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit2526-')&&!/\/(?:five-zones-v1|v153)$/.test(key));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,kitchenLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit2526LegacyProgress=legacy;}
  }
  if(course==='unit27-28'&&unit.legacyEdition==='unit27-28-completion-v1'){
    const predecessor=value.activity.unit2728LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit2728-')&&!/\/(?:five-zones-v1|v153)$/.test(key));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,livingRoomLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit2728LegacyProgress=legacy;}
  }
  if(course==='unit29-30'&&unit.legacyEdition==='unit29-30-completion-v1'){
    const predecessor=value.activity.unit2930LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit2930-')&&!/\/(?:five-zones-v1|v153)$/.test(key));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,tidyingLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit2930LegacyProgress=legacy;}
  }
  if(course==='unit31-32'&&unit.legacyEdition==='unit31-32-completion-v1'){
    const predecessor=value.activity.unit3132LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit3132-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,gardenLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit3132LegacyProgress=legacy;}
  }
  if(course==='unit33-34'&&unit.legacyEdition==='unit33-34-completion-v1'){
    const predecessor=value.activity.unit3334LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit3334-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,riversideLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit3334LegacyProgress=legacy;}
  }
  if(course==='unit35-36'&&unit.legacyEdition==='unit35-36-completion-v1'){
    const predecessor=value.activity.unit3536LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit3536-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,villageLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit3536LegacyProgress=legacy;}
  }
  if(course==='unit37-38'&&unit.legacyEdition==='unit37-38-completion-v1'){
    const predecessor=value.activity.unit3738LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit3738-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,workshopLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit3738LegacyProgress=legacy;}
  }
  if(course==='unit39-40'&&unit.legacyEdition==='unit39-40-completion-v1'){
    const predecessor=value.activity.unit3940LegacyProgress;
    const hasOldRound=Object.keys(value.groups||{}).some(key=>key.startsWith('unit3940-')&&!key.endsWith('/five-zones-v1'));
    const hasOldCertificate=['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(key=>typeof value.activity[key]==='string'&&Number.isFinite(Date.parse(value.activity[key])));
    if(predecessor||hasOldRound||hasOldCertificate){const legacy=normalize(predecessor||value,vaseLegacyDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||legacy.activity.unitCertificateIssuedAt||legacy.activity.unitClassroomCertificateIssuedAt)result.activity.unit3940LegacyProgress=legacy;}
  }
  if(course==='unit41-42'&&unit.contentRevision==='bag-teaching-v153'){
    const predecessor=value.activity.unit4142V153Progress;
    const oldRounds=!value.activity.unit4142V153Migration&&Object.keys(value.groups||{}).some(key=>key.startsWith('unit4142-')&&!key.endsWith('/v153'));
    if(predecessor||oldRounds){const legacy=normalize(predecessor||value,bagV153PreviousDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||Object.keys(legacy.records).length)result.activity.unit4142V153Progress=legacy;}
    if(value.activity.unit4142V153Migration===true)result.activity.unit4142V153Migration=true;
  }
  if(course==='unit43-44'&&unit.contentRevision==='tea-teaching-v153'){
    const predecessor=value.activity.unit4344V153Progress;
    const oldRounds=!value.activity.unit4344V153Migration&&Object.keys(value.groups||{}).some(key=>key.startsWith('unit4344-')&&key.endsWith('/v1'));
    if(predecessor||oldRounds){const legacy=normalize(predecessor||value,teaV153PreviousDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||Object.keys(legacy.records).length)result.activity.unit4344V153Progress=legacy;}
    if(value.activity.unit4344V153Migration===true)result.activity.unit4344V153Migration=true;
  }
  if(course==='unit45-46'&&unit.contentRevision==='office-teaching-v153'){
    const predecessor=value.activity.unit4546V153Progress;
    const oldRounds=!value.activity.unit4546V153Migration&&Object.keys(value.groups||{}).some(key=>key.startsWith('unit4546-')&&key.endsWith('/v1'));
    if(predecessor||oldRounds){const legacy=normalize(predecessor||value,officeV153PreviousDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||Object.keys(legacy.records).length)result.activity.unit4546V153Progress=legacy;}
    if(value.activity.unit4546V153Migration===true)result.activity.unit4546V153Migration=true;
  }
  if(course==='unit19-20'&&unit.contentRevision==='park-teaching-v153'){
    const predecessor=value.activity.unit1920V153Progress;
    const oldRounds=!value.activity.unit1920V153Migration&&Object.keys(value.groups||{}).some(key=>key.startsWith('unit1920-')&&key.endsWith('/five-zones-v1'));
    if(predecessor||oldRounds){const legacy=normalize(predecessor||value,parkV153PreviousDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||Object.keys(legacy.records).length)result.activity.unit1920V153Progress=legacy;}
    if(value.activity.unit1920V153Migration===true)result.activity.unit1920V153Migration=true;
  }
  if(course==='unit23-24'&&unit.contentRevision==='room-teaching-v153'){
    const predecessor=value.activity.unit2324V153Progress;
    const oldRounds=!value.activity.unit2324V153Migration&&Object.keys(value.groups||{}).some(key=>key.startsWith('unit2324-')&&key.endsWith('/five-zones-v1'));
    if(predecessor||oldRounds){const legacy=normalize(predecessor||value,roomV153PreviousDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||Object.keys(legacy.records).length)result.activity.unit2324V153Progress=legacy;}
    if(value.activity.unit2324V153Migration===true)result.activity.unit2324V153Migration=true;
  }
  if(course==='unit25-26'&&unit.contentRevision==='kitchen-teaching-v153'){
    const predecessor=value.activity.unit2526V153Progress;
    const oldRounds=!value.activity.unit2526V153Migration&&Object.keys(value.groups||{}).some(key=>key.startsWith('unit2526-')&&key.endsWith('/five-zones-v1'));
    if(predecessor||oldRounds){const legacy=normalize(predecessor||value,kitchenV153PreviousDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||Object.keys(legacy.records).length)result.activity.unit2526V153Progress=legacy;}
    if(value.activity.unit2526V153Migration===true)result.activity.unit2526V153Migration=true;
  }
  // Personal certificate text is metadata, never proof of completion. A new
  // question or a partial sync must not erase it when scores are revalidated.
  // Authentication still owns this record; only the validated groups above can
  // award stars or unlock a certificate. An explicit course reset clears both.
  if(typeof value.activity.unitName==='string')result.activity.unitName=value.activity.unitName.slice(0,20);
  if(course==='unit27-28'&&unit.contentRevision==='living-room-teaching-v153'){
    const predecessor=value.activity.unit2728V153Progress;
    const oldRounds=!value.activity.unit2728V153Migration&&Object.keys(value.groups||{}).some(key=>key.startsWith('unit2728-')&&key.endsWith('/five-zones-v1'));
    if(predecessor||oldRounds){const legacy=normalize(predecessor||value,livingRoomV153PreviousDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||Object.keys(legacy.records).length)result.activity.unit2728V153Progress=legacy;}
    if(value.activity.unit2728V153Migration===true)result.activity.unit2728V153Migration=true;
  }
  if(course==='unit29-30'&&unit.contentRevision==='tidying-teaching-v153'){
    const predecessor=value.activity.unit2930V153Progress;
    const oldRounds=!value.activity.unit2930V153Migration&&Object.keys(value.groups||{}).some(key=>key.startsWith('unit2930-')&&key.endsWith('/five-zones-v1'));
    if(predecessor||oldRounds){const legacy=normalize(predecessor||value,tidyingV153PreviousDefinition(),course);if(Object.keys(legacy.activity.unitCompleted).length||Object.keys(legacy.records).length)result.activity.unit2930V153Progress=legacy;}
    if(value.activity.unit2930V153Migration===true)result.activity.unit2930V153Migration=true;
  }
  for(const key of ['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt']) {
    const date=value.activity[key];
    if(typeof date==='string'&&date.length<=50&&Number.isFinite(Date.parse(date)))result.activity[key]=new Date(date).toISOString();
  }
  return result;
}
function merge(left,right){
 const activity={...left.activity,...right.activity,unitCompleted:{...left.activity?.unitCompleted,...right.activity?.unitCompleted},...(left.activity?.unitAwardClaims||right.activity?.unitAwardClaims?{unitAwardClaims:{...right.activity?.unitAwardClaims,...left.activity?.unitAwardClaims}}:{})};
 if(left.activity?.unit12HistoryProgress&&right.activity?.unit12HistoryProgress)activity.unit12HistoryProgress=merge(right.activity.unit12HistoryProgress,left.activity.unit12HistoryProgress);
 if(left.activity?.unit34HistoryProgress&&right.activity?.unit34HistoryProgress)activity.unit34HistoryProgress=merge(right.activity.unit34HistoryProgress,left.activity.unit34HistoryProgress);
 if(left.activity?.unit56HistoryProgress&&right.activity?.unit56HistoryProgress)activity.unit56HistoryProgress=merge(right.activity.unit56HistoryProgress,left.activity.unit56HistoryProgress);
 // Both inputs have already been normalized against the frozen predecessor.
 // A partial old-client upload must not replace a complete history archive.
 if(left.activity?.unitLegacyProgress&&right.activity?.unitLegacyProgress)activity.unitLegacyProgress=merge(left.activity.unitLegacyProgress,right.activity.unitLegacyProgress);
 if(left.activity?.unit78LegacyProgress&&right.activity?.unit78LegacyProgress)activity.unit78LegacyProgress=merge(left.activity.unit78LegacyProgress,right.activity.unit78LegacyProgress);
 if(left.activity?.unit910LegacyProgress&&right.activity?.unit910LegacyProgress)activity.unit910LegacyProgress=merge(left.activity.unit910LegacyProgress,right.activity.unit910LegacyProgress);
 if(left.activity?.unit1112LegacyProgress&&right.activity?.unit1112LegacyProgress)activity.unit1112LegacyProgress=merge(left.activity.unit1112LegacyProgress,right.activity.unit1112LegacyProgress);
 if(left.activity?.unit1314LegacyProgress&&right.activity?.unit1314LegacyProgress)activity.unit1314LegacyProgress=merge(left.activity.unit1314LegacyProgress,right.activity.unit1314LegacyProgress);
 if(left.activity?.unit1516LegacyProgress&&right.activity?.unit1516LegacyProgress)activity.unit1516LegacyProgress=merge(left.activity.unit1516LegacyProgress,right.activity.unit1516LegacyProgress);
 if(left.activity?.unit1718LegacyProgress&&right.activity?.unit1718LegacyProgress)activity.unit1718LegacyProgress=merge(left.activity.unit1718LegacyProgress,right.activity.unit1718LegacyProgress);
 if(left.activity?.unit1920LegacyProgress&&right.activity?.unit1920LegacyProgress)activity.unit1920LegacyProgress=merge(left.activity.unit1920LegacyProgress,right.activity.unit1920LegacyProgress);
 if(left.activity?.unit2122LegacyProgress&&right.activity?.unit2122LegacyProgress)activity.unit2122LegacyProgress=merge(left.activity.unit2122LegacyProgress,right.activity.unit2122LegacyProgress);
 // The archived 32-question evidence is not the latest reused question's work.
 // Keep its first validated record; a later old device can still fill gaps.
 if(left.activity?.unit2324LegacyProgress&&right.activity?.unit2324LegacyProgress)activity.unit2324LegacyProgress=merge(right.activity.unit2324LegacyProgress,left.activity.unit2324LegacyProgress);
 // Later same-ID practice must not rewrite the frozen 27-question archive.
 if(left.activity?.unit2526LegacyProgress&&right.activity?.unit2526LegacyProgress)activity.unit2526LegacyProgress=merge(right.activity.unit2526LegacyProgress,left.activity.unit2526LegacyProgress);
 if(left.activity?.unit2728LegacyProgress&&right.activity?.unit2728LegacyProgress)activity.unit2728LegacyProgress=merge(right.activity.unit2728LegacyProgress,left.activity.unit2728LegacyProgress);
 if(left.activity?.unit2930LegacyProgress&&right.activity?.unit2930LegacyProgress)activity.unit2930LegacyProgress=merge(right.activity.unit2930LegacyProgress,left.activity.unit2930LegacyProgress);
 if(left.activity?.unit3132LegacyProgress&&right.activity?.unit3132LegacyProgress)activity.unit3132LegacyProgress=merge(left.activity.unit3132LegacyProgress,right.activity.unit3132LegacyProgress);
 if(left.activity?.unit3334LegacyProgress&&right.activity?.unit3334LegacyProgress)activity.unit3334LegacyProgress=merge(left.activity.unit3334LegacyProgress,right.activity.unit3334LegacyProgress);
 if(left.activity?.unit3536LegacyProgress&&right.activity?.unit3536LegacyProgress)activity.unit3536LegacyProgress=merge(left.activity.unit3536LegacyProgress,right.activity.unit3536LegacyProgress);
 if(left.activity?.unit3738LegacyProgress&&right.activity?.unit3738LegacyProgress)activity.unit3738LegacyProgress=merge(left.activity.unit3738LegacyProgress,right.activity.unit3738LegacyProgress);
 if(left.activity?.unit3940LegacyProgress&&right.activity?.unit3940LegacyProgress)activity.unit3940LegacyProgress=merge(left.activity.unit3940LegacyProgress,right.activity.unit3940LegacyProgress);
 if(left.activity?.unit4142V153Progress&&right.activity?.unit4142V153Progress)activity.unit4142V153Progress=merge(left.activity.unit4142V153Progress,right.activity.unit4142V153Progress);
 if(left.activity?.unit4344V153Progress&&right.activity?.unit4344V153Progress)activity.unit4344V153Progress=merge(left.activity.unit4344V153Progress,right.activity.unit4344V153Progress);
 if(left.activity?.unit4546V153Progress&&right.activity?.unit4546V153Progress)activity.unit4546V153Progress=merge(left.activity.unit4546V153Progress,right.activity.unit4546V153Progress);
 // Keep the first validated 65-question evidence when current unchanged
 // questions are practised again; late old-client work may still fill gaps.
 if(left.activity?.unit1920V153Progress&&right.activity?.unit1920V153Progress)activity.unit1920V153Progress=merge(right.activity.unit1920V153Progress,left.activity.unit1920V153Progress);
 // The first validated pre-review evidence stays intact when the student
 // practises unchanged questions again; older devices may still fill gaps.
 if(left.activity?.unit2324V153Progress&&right.activity?.unit2324V153Progress)activity.unit2324V153Progress=merge(right.activity.unit2324V153Progress,left.activity.unit2324V153Progress);
 if(left.activity?.unit2526V153Progress&&right.activity?.unit2526V153Progress)activity.unit2526V153Progress=merge(right.activity.unit2526V153Progress,left.activity.unit2526V153Progress);
 if(left.activity?.unit2728V153Progress&&right.activity?.unit2728V153Progress)activity.unit2728V153Progress=merge(right.activity.unit2728V153Progress,left.activity.unit2728V153Progress);
 if(left.activity?.unit2930V153Progress&&right.activity?.unit2930V153Progress)activity.unit2930V153Progress=merge(right.activity.unit2930V153Progress,left.activity.unit2930V153Progress);
 return {version:1,groups:{...left.groups,...right.groups},records:{...left.records,...right.records},activity};
}
// The reward ledger remains authoritative where installed. Grammar-only units
// use the complete-round claims already validated by normalize().
function zoneAwarded(normalized,zone,award=null){return Boolean(award?award.zones?.[zone]:normalized.activity.unitAwardClaims?.[zone]);}
function summary(value,unit,course,award=null){
  const normalized=normalize(value,unit,course),saved=normalized.activity.unitCompleted;
  let stars=0,next='certificate';
  for(const stage of unit.stages)stars+=Math.floor(stage.required.filter(id=>saved[id]).length/stage.required.length*3);
  for(const stage of unit.stages){const unfinished=stage.required.find(id=>!saved[id]);if(unfinished){next=unfinished;break;}}
  const versioned=Array.isArray(unit.reward?.zones);
  if(versioned)stars=unit.reward.zones.filter(zone=>zoneAwarded(normalized,zone.id,award)).length;
  const started=Boolean(stars||Object.keys(saved).length);
  return {stars,maxStars:versioned?unit.reward.zones.length:unit.stages.length*3,
    rewardRule:versioned?'first-correct-v1':'completion-v1',rewardEdition:versioned?unit.reward.edition:null,
    firstFullStarAt:versioned?(award?.firstFullStarAt||null):null,
    started,next:started?next:'words'};
}
module.exports={definition,normalize,merge,summary,zoneAwarded};
