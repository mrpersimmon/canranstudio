(function(core){
'use strict';const marker='unit4546V153Migration',key='unit4546V153Snapshot';
function preserve(practice,unit){if(practice.activity(marker))return;try{
 const local=JSON.parse(localStorage.getItem(unit.progress.learningKey)||'null'),saved=practice.activity('unit4546V153Progress')||local;
 if(saved&&['groups','records','activity'].some(k=>saved[k]&&Object.keys(saved[k]).length)){
  const activity={...(saved.activity||{})};delete activity[key];delete activity[marker];delete activity.unit4546V153Progress;
  const snapshot={...saved,activity};practice.activity(key,snapshot);practice.activity('unit4546V153Progress',snapshot);
 }
 practice.activity(marker,true);
}catch{/* Leave the original book intact; shared storage UI reports failures. */}}
function show(practice,surface){const snapshot=practice.activity(key)||practice.activity('unit4546V153Progress');if(!snapshot)return;
 const records=Object.values(snapshot.records||{});if(!records.length)return;
 const details=document.createElement('details');details.className='offline-task historical-learning';const summary=document.createElement('summary');summary.textContent='改版前的学习记录';details.append(summary);
 const note=document.createElement('p');note.textContent='原作答与错误记录保留。已获星、原纪念卡及首次五星日期继续沿用；修改后的题目需要重新作答。';details.append(note);
 const list=document.createElement('ul');for(const r of records){const li=document.createElement('li');li.textContent=(r.target||'原练习')+' · '+(r.correct?'已答对':'尚未完成')+' · 提交'+(Number.isFinite(r.attempts)?r.attempts:'—')+'次';list.append(li);}details.append(list);surface.append(details);
}
core.unit4546History={preserve,show};
})(globalThis.CanranCore);
