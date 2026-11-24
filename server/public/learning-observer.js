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
const groupKey=g=>JSON.stringify([g.runId,g.signature,g.contentSignature,g.subjectVersion]);
function merge(left,right){
 const groups=new Map();
 for(const group of [...(left?.groups||[]),...(right?.groups||[])]){
  const key=groupKey(group),prior=groups.get(key),states=new Map((prior?.states||[]).map(s=>[s.questionId,s]));
  for(const s of group.states||[])if(!states.has(s.questionId)||states.get(s.questionId).attempts<s.attempts)states.set(s.questionId,s);
  groups.set(key,{...group,states:[...states.values()]});
 }
 return {version:1,groups:[...groups.values()]};
}
const encoder=new TextEncoder(),bytes=x=>encoder.encode(JSON.stringify(x)).length;
function tooLarge(){return Object.assign(Error('单份学习记录过大，已保存在本机。'),{code:'UPLOAD_TOO_LARGE'});}
// Keep the legacy on-disk format. Send observations before completion proof:
// a completed round is a baseline and must not mask previously unsent attempts.
function nextUpload(pending,target=512*1024){
 const hard=1500000,groups=pending.observations?.groups||[];
 if(bytes(pending)<=target)return pending;
 if(!groups.some(g=>g.states.length)){if(bytes(pending)>hard)throw tooLarge();return pending;}
 const chunk={...pending,value:{},observationsOnly:true,observations:{version:1,groups:[]}},out=chunk.observations.groups;
 let size=bytes(chunk);
 for(const g of groups){
  if(!g.states.length)continue;
  const add=bytes(g)+(out.length?1:0);
  if(size+add<=target){out.push(g);size+=add;continue;}
  if(out.length)break;
  const portion={...g,states:[]};size+=bytes(portion);
  for(const state of g.states){const cost=bytes(state)+(portion.states.length?1:0);
   if(portion.states.length&&size+cost>target)break;
   if(size+cost>hard)throw tooLarge();
   portion.states.push(state);size+=cost;
  }
  out.push(portion);break;
 }
 return chunk;
}
// The learner may submit a correction or start a new round during this POST.
// Subtract only acknowledged attempts, never a whole key by age or position.
function afterUpload(current,sent){
 if(!current)return null;
 if(['studentId','course','epoch','generation'].some(k=>current[k]!==sent[k]))return current;
 if(current===sent&&!sent.observationsOnly)return null;
 const receipts=new Map((sent.observations?.groups||[]).map(g=>[groupKey(g),new Map(g.states.map(s=>[s.questionId,s.attempts]))]));
 const groups=[];
 for(const g of current.observations?.groups||[]){const r=receipts.get(groupKey(g));if(!r){groups.push(g);continue;}
  const states=g.states.filter(s=>s.attempts>(r.get(s.questionId)||0));if(states.length)groups.push({...g,states});
 }
 if(!sent.observationsOnly&&!groups.length&&JSON.stringify(current.value)===JSON.stringify(sent.value))return null;
 return {...current,observations:{version:1,groups}};
}
return {snapshot,merge,nextUpload,afterUpload};
});
