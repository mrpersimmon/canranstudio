(function(core){
'use strict';const marker='unit1920V153Migration',key='unit1920V153Snapshot',remote='unit1920V153Progress';
function preserve(practice,unit){
 if(practice.activity(marker))return;
 try{
  const local=JSON.parse(localStorage.getItem(unit.progress.learningKey)||'null');
  const hasFiveZone=Object.keys(local?.groups||{}).some(k=>k.startsWith('unit1920-')&&k.endsWith('/five-zones-v1'));
  const saved=practice.activity(remote)||(hasFiveZone?local:null);
  if(saved){const activity={...(saved.activity||{})};delete activity[key];delete activity[marker];delete activity[remote];const snapshot={...saved,activity};practice.activity(key,snapshot);practice.activity(remote,snapshot);}
  practice.activity(marker,true);
 }catch{/* Preserve the original book; the shared save status reports failure. */}
}
function show(practice,surface){
 const snapshot=practice.activity(key)||practice.activity(remote),records=Object.values(snapshot?.records||{});if(!records.length)return;
 const details=document.createElement('details');details.className='offline-task historical-learning';const summary=document.createElement('summary');summary.textContent='之前的五星学习记录';details.append(summary);
 const note=document.createElement('p');note.textContent='之前的作答和错答都在这里，原来的纪念卡仍可查看。现在可以继续练习。';details.append(note);
 const list=document.createElement('ul');for(const r of records){const li=document.createElement('li');li.textContent=(r.target||'原练习')+' · '+(r.correct?'已答对':'尚未完成')+' · 提交'+(Number.isFinite(r.attempts)?r.attempts:'—')+'次';list.append(li);}details.append(list);surface.append(details);
}
core.unit1920History={preserve,show};
})(globalThis.CanranCore);
