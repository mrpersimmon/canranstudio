'use strict';
const preserved=require('../../../content/expansion/lesson1-50-preservation.json');
const policies=require('./legacy-feedback-policies.json');
const clone=x=>JSON.parse(JSON.stringify(x));
// Reverse only the explicitly reviewed v6.1 changes. The original first-50
// SHA-256 checks below still verify every field of the reconstructed fixture.
function priorItem(unit,field,item){
 const value=clone(item);
 if(field==='nodes'){
  value.activityIds=value.activityIds.filter(id=>!unit.grammar.activityIds.includes(id));
  if(value.title==='巩固已学词句'){value.title='换个情境再试试';value.completionTitle='换个情境再试试，完成！';}
 }
 if(field==='activities'){
  if(Object.hasOwn(policies,value.id)){if(policies[value.id]===null)delete value.feedbackPlayback;else value.feedbackPlayback=policies[value.id];}
  if(unit.history.assessments[value.id])value.assessment=clone(unit.history.assessments[value.id]);
 }
 if(field==='challenges')value.questions=clone(unit.history.challenges.find(c=>c.id===value.id).questions);
 return value;
}
function priorCourse(current){
 const unit={...current,...current.keyboardHistory};
 const old=clone(unit);old.recordSchema=4;delete old.keyboardHistory;
 for(const [field,hashes]of Object.entries(preserved))old[field]=Array.isArray(unit[field])?unit[field].filter(x=>hashes[x.id]).map(x=>priorItem(unit,field,x)):Object.fromEntries(Object.entries(unit[field]).filter(([id])=>hashes[id]).map(([id,x])=>[id,priorItem(unit,field,x)]));
 old.lessonIds=Array.from({length:50},(_,i)=>i+1);old.checkpointIds=old.nodes.flatMap(n=>n.checkpointIds);
 for(const n of old.nodes)old.checkpointActivities[n.id]=[...n.activityIds];
 old.placement=clone(unit.history.placement);old.answerPolicyVersion=1;
 delete old.history;delete old.contractVersion;delete old.grammar;
 return old;
}
function evidenceOnly(record){const copy=clone(record);delete copy.contractVersion;delete copy.completedNodeContracts;delete copy.contentMigration;for(const r of Object.values(copy.results))delete r.contractVersion;return copy;}
module.exports={priorItem,priorCourse,evidenceOnly};
