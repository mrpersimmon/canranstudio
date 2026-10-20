(function(core){
'use strict';
// Keep the old 15 completion-stars as history, never as a claim for five new
// zero-error awards. New runners have new keys and question ids.
const required={l1:['listen'],l2:['text','roles'],l3:['doare','give','needs','pouch','either'],l4:['subjects','fill','choice','trans'],l5:['exam']};
const titles={listen:'听音寻宝',text:'老板与客人',roles:'故事小侦探',doare:'问话小帮手',give:'交接小帮手',needs:'餐桌小任务',pouch:'表达小锦囊',either:'心声接力',subjects:'分拣小能手',fill:'动词换装间',choice:'句子检查站',trans:'词块拼装台',exam:'采购小挑战'};
function preserve(practice,unit){
 if(practice.activity('unitLegacyProgress'))return;
 const complete=practice.activity('unitCompleted');if(!complete||!Object.values(complete).some(value=>typeof value==='string'&&value.startsWith('v1:')))return;
 try{const saved=JSON.parse(localStorage.getItem(unit.progress.learningKey));if(!saved?.activity)return;const activity={...saved.activity};delete activity.unitLegacyProgress;practice.activity('unitLegacyProgress',{version:1,groups:saved.groups||{},records:saved.records||{},activity});}catch{/* The shared notebook reports storage failures without erasing old data. */}
}
function reading(practice,unit,signature){
 const draft=practice.activity('unitDialogue');if(!draft||typeof draft.signature!=='string'||!draft.signature.startsWith('v1:'))return draft;
 const clean=s=>s.replace(/[’]/g,"'");
 if(clean(draft.signature)!=='v1:'+unit.learning.DIALOGUE.map(line=>clean(line.text)).join('|'))return draft;
 if(!Number.isInteger(draft.i)||draft.i<0||draft.i>=unit.learning.DIALOGUE.length||!Array.isArray(draft.heard))return draft;
 // A displayed sentence counts as viewed in the reading edition. This does
 // not claim its recording finished, and it does not answer any new question.
 const viewed=unit.learning.DIALOGUE.map((_,i)=>i<=draft.i&&Boolean(i===draft.i||draft.heard[i]));
 const next={i:draft.i,viewed: viewed.slice(0,draft.i+1),done:draft.done===true&&viewed.every(Boolean),signature};
 practice.activity('unitDialogue',next);return next;
}
function show(practice,surface){
 const legacy=practice.activity('unitLegacyProgress');if(!legacy)return;
 const saved=legacy.activity?.unitCompleted||{},passed=id=>typeof saved[id]==='string'&&saved[id].startsWith('v1:');
 const date=legacy.activity?.unitCertificateIssuedAt;
 const hasCertificate=typeof date==='string'&&Number.isFinite(Date.parse(date));
 const completed=Object.values(required).flat().filter(passed);if(!completed.length&&!hasCertificate)return;
 const stars=hasCertificate?15:Object.values(required).reduce((sum,ids)=>sum+Math.floor(ids.filter(passed).length/ids.length*3),0);
 const details=document.createElement('details');details.className='offline-task legacy-learning';
 const summary=document.createElement('summary');summary.textContent='旧版学习记录与证书';
 const result=document.createElement('p');result.textContent=`旧版已获 ${stars} / 15 颗完成星。记录保留；本版五颗星分别记录五个答题区的整轮零错表现。`;
 const names=document.createElement('p');names.textContent='已完成：'+completed.map(id=>titles[id]).join('、');details.append(summary,result,names);
 const name=legacy.activity?.unitName;
 if(typeof name==='string'&&name.trim()){const label=document.createElement('p');label.className='legacy-name';label.textContent='原领证姓名：'+name;details.append(label);}
 if(hasCertificate){
  const label=document.createElement('p');label.className='legacy-issued-date';label.dataset.issuedAt=date;label.textContent='原领证日期：'+new Date(date).toLocaleDateString('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'long',day:'numeric'});details.append(label);
  const host=document.createElement('div');host.className='legacy-certificate-host';details.append(host);
  const view=core.unit4950LegacyCertificate.mount({element:host,initialName:typeof name==='string'?name:'',initialIssuedAt:date,canClaim:()=>true});
  view.update({complete:true,completedChapters:[true,true,true,true,true],next:null});
  // The original form remains private to the preserved renderer; children only
  // open their existing certificate, never edit or claim it for a second time.
  host.querySelector('input').readOnly=true;host.querySelector('input').hidden=true;
  for(const selector of ['.certificate-name-label','.certificate-greeting','.certificate-track'])host.querySelector(selector).hidden=true;
  host.querySelector('.unit-certificate-actions button:last-child').textContent='查看旧证书';
 }else{const pending=document.createElement('p');pending.textContent='旧版尚无有效领取日期；学习记录保留，不补造证书或领取时间。';details.append(pending);}
 surface.append(details);
}
core.unit4950Legacy={preserve,reading,show};
})(globalThis.CanranCore);
