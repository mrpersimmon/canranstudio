(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.CanranLearningObserver=api;})(typeof globalThis==='undefined'?null:globalThis,function(){
'use strict';
// Only submitted answers cross this boundary. Attempts are a question's sequence.
const submitted=s=>s?.checked===true&&Number.isInteger(s.attempts)&&s.attempts>0;
const copy=s=>({questionId:s.questionId,runId:s.runId,checked:true,selection:s.selection,correct:s.correct,firstCorrect:s.firstCorrect,attempts:s.attempts});
function snapshot(book){
 const groups=[];
 for(const group of Object.values(book.groups||{})){
  const states=(group.states||[]).map(s=>submitted(s)?s:book.records?.[s?.questionId]).filter(s=>submitted(s)&&s.runId===group.runId).map(copy);
  if(states.length)groups.push({runId:group.runId,signature:group.signature,contentSignature:group.contentSignature,states});
 }
 const run=book.activity?.subjectRound;
 if(run?.submissions?.length){const states=new Map();for(const s of run.submissions){if(!s.checked||s.runId!==run.runId)continue;const prior=states.get(s.questionId);states.set(s.questionId,copy({...s,attempts:(prior?.attempts||0)+1,firstCorrect:prior?.firstCorrect??s.correct}));}if(states.size)groups.push({runId:run.runId,subjectVersion:run.version,states:[...states.values()]});}
 return {version:1,groups};
}
function merge(left,right){
 const groups=new Map();
 for(const group of [...(left?.groups||[]),...(right?.groups||[])]){
  const key=JSON.stringify([group.runId,group.signature,group.contentSignature,group.subjectVersion]),prior=groups.get(key),states=new Map((prior?.states||[]).map(s=>[s.questionId,s]));
  for(const s of group.states||[])if(!states.has(s.questionId)||states.get(s.questionId).attempts<s.attempts)states.set(s.questionId,s);
  groups.set(key,{...group,states:[...states.values()]});
 }
 return {version:1,groups:[...groups.values()]};
}
return {snapshot,merge};
});
