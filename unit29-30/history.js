(function(core){
'use strict';const marker='unit2930V153Migration',key='unit2930V153Snapshot',remote='unit2930V153Progress';
function preserve(practice,unit){
 if(practice.activity(marker))return;
 try{
  const local=JSON.parse(localStorage.getItem(unit.progress.learningKey)||'null');
  const hasFiveZone=Object.keys(local?.groups||{}).some(k=>k.startsWith('unit2930-')&&k.endsWith('/five-zones-v1'));
  // Local drafts and older retained rows belong in the device snapshot.
  // Keep an existing validated remote archive separately; it is not a full
  // copy of local history and must not replace it before the new view mounts.
  const validated=practice.activity(remote),saved=hasFiveZone?local:validated;
  if(saved){const activity={...(saved.activity||{})};delete activity[key];delete activity[marker];delete activity[remote];const snapshot={...saved,activity};practice.activity(key,snapshot);if(!validated)practice.activity(remote,snapshot);}
  practice.activity(marker,true);
 }catch{/* Preserve the original book; the shared save status reports failure. */}
}
function show(practice,surface){
 // Keep all raw evidence in the snapshot, while this section displays only
 // records belonging to the actual previous fifty-question edition.
 const snapshot=practice.activity(key)||practice.activity(remote),ids=new Set(Object.values(core.unit2930V153PreviousDefinition.questions).flat().map(q=>q.id)),records=Object.entries(snapshot?.records||{}).filter(([id])=>ids.has(id)).map(([,record])=>record);if(!records.length)return;
 const details=document.createElement('details');details.className='offline-task historical-learning';const summary=document.createElement('summary');summary.textContent='之前的五星学习记录';details.append(summary);
 const note=document.createElement('p');note.textContent='之前的作答和错答都在这里，原来的纪念卡仍可查看。现在可以继续练习。';details.append(note);
 const list=document.createElement('ul');for(const r of records){const li=document.createElement('li');li.textContent=(r.target||'原练习')+' · '+(r.correct?'已答对':'尚未完成')+' · 提交'+(Number.isFinite(r.attempts)?r.attempts:'—')+'次';list.append(li);}details.append(list);surface.append(details);
}
core.unit2930History={preserve,show};
})(globalThis.CanranCore);


