(function(core){
'use strict';
const key='unit2728LegacySnapshot', marker='unit2728FiveZoneMigration';
const old=core.unit2728LegacyDefinition;
const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
function hasEvidence(snapshot){
 const activity=snapshot?.activity||{};
 return Object.keys(snapshot?.groups||{}).some(k=>k.startsWith('unit2728-')&&!/\/(?:five-zones-v1|v153)$/.test(k))||
  Object.keys(snapshot?.records||{}).length>0||Object.keys(activity.unitCompleted||{}).length>0||
  (Number.isInteger(activity.unitDialogue?.i)&&activity.unitDialogue.i>=0)||
  ['unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'].some(k=>typeof activity[k]==='string'&&Number.isFinite(Date.parse(activity[k])));
}
function preserve(practice,unit){
 if(practice.activity(marker))return;
 // Capture before new routes, completion or question runners write anything.
 // Keep every predecessor key, including unfinished drafts and old errors.
 try{
  const local=JSON.parse(localStorage.getItem(unit.progress.learningKey)||'null');
  const hasNewRound=Object.keys(local?.groups||{}).some(k=>/\/(?:five-zones-v1|v153)$/.test(k));
  const saved=practice.activity('unit2728LegacyProgress')||(hasNewRound?null:local);
  // A login name alone is not evidence that this learner used an old course.
  if(hasEvidence(saved)){
   const activity={...(saved.activity||{})};delete activity[key];delete activity[marker];
   const snapshot={...saved,version:1,groups:saved.groups||{},records:saved.records||{},activity};
   practice.activity(key,snapshot);
   practice.activity('unit2728LegacyProgress',snapshot);
  }
  practice.activity(marker,true);
 }catch{/* Preserve the original bytes; the normal notebook reports storage errors. */}
}
function reading(practice,unit,signature){
 const draft=practice.activity('unitDialogue');
 if(!draft||draft.signature===signature)return draft;
 // Only identical full text and speaker order may keep the reading cursor.
 const oldSignature=JSON.stringify([old.version,old.learning.DIALOGUE]);
 if(!practice.sameContentSignature(draft.signature,oldSignature))return draft;
 return {...draft,signature};
}
function show(practice,surface){
 const snapshot=practice.activity(key);if(!hasEvidence(snapshot))return;
 const activity=snapshot.activity||{},completed=activity.unitCompleted||{};
 const passed=id=>practice.sameContentSignature(completed[id],JSON.stringify([old.version,id==='text'?old.learning.DIALOGUE:old.questions[id]]));
 const dates=[activity.unitClassroomCertificateIssuedAt,activity.unitCertificateIssuedAt];
 const issuedAt=dates.find(value=>typeof value==='string'&&Number.isFinite(Date.parse(value)));
 const stars=issuedAt?15:old.stages.reduce((sum,stage)=>sum+Math.floor(stage.required.filter(passed).length/stage.required.length*3),0);
 const details=node('details','','offline-task legacy-learning');details.append(node('summary','旧版学习记录与证书'));
 details.append(node('p',`旧版完成星：${stars} / 15。原作答、错误和阅读记录保留；本版五颗星独立记录。`));
 const list=node('ul','','legacy-records');
 for(const record of Object.values(snapshot.records||{})){
  const li=node('li');li.append(node('strong',record.target||'旧版练习'),node('span',` · ${record.correct?'已答对':'尚未完成'} · 提交${Number.isFinite(record.attempts)?record.attempts:'—'}次`));list.append(li);
 }
 const records=node('details','','legacy-record-details');records.append(node('summary',`查看旧作答（${list.children.length}条）`),list);details.append(records);
 if(activity.unitDialogue&&Number.isInteger(activity.unitDialogue.i))details.append(node('p',`旧版课文读到第${activity.unitDialogue.i+1} / 13句。`));
 if(issuedAt){
  const originalName=typeof activity.unitName==='string'?activity.unitName:'';
  details.append(node('p','原领证姓名：'+(originalName.trim()||'细心的客厅发现家'),'legacy-name'));
  const date=node('p','原领证日期：'+new Date(issuedAt).toLocaleDateString('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'long',day:'numeric'}),'legacy-issued-date');date.dataset.issuedAt=issuedAt;details.append(date);
  const host=node('div','','legacy-certificate-host');details.append(host);
  // Keep the original image sizing hook as well as the original SVG bytes.
  const art=(name,label='')=>{const im=node('img','','shop-icon');im.src='/assets/unit27-28/'+name+'.svg';im.alt=label;return im;};
  const view=core.unit2728LegacyCertificate.mount({element:host,initialName:originalName,initialIssuedAt:issuedAt,canClaim:()=>true,onClaim:()=>{},design:{
   copy:{title:'细心的客厅发现家',course:'客厅发现之旅 · Lesson 27–28',completion:'完成 Lesson 27–28 课堂配套练习',thanks:'找到物品，问清位置，带朋友认识小客厅！'},
   keepsakes:[],
   characters:['Mrs','armchair'],characterLabels:['史密斯太太','扶手椅'],icon:art,defaultName:'细心的客厅发现家',dialogTitle:'旧版客厅发现之旅纪念',fileName:'Lesson27-28-旧版客厅发现之旅.png',
   badges:old.stages.map((stage,i)=>({title:stage.title,icon:['cards','book','question','order','star'][i],color:['#FFF0BC','#E9E5F2','#E1EDD5','#DFEAF1','#F8DCD4'][i]}))}});
  view.update({complete:true,completedChapters:[true,true,true,true,true],next:null});
  // Viewing a previously issued certificate is read-only, even after new mistakes.
  host.querySelector('input').readOnly=true;
  host.querySelector('.certificate-name-label').hidden=true;host.querySelector('input').hidden=true;
  host.querySelector('.certificate-greeting').hidden=true;host.querySelector('.certificate-track').hidden=true;
  host.querySelector('.unit-certificate-actions button:last-child').textContent='查看旧证书';
  document.getElementById('legacyCertificateDialog').classList.add('legacy-certificate-dialog');
 } else details.append(node('p','旧版尚无有效领取日期；保留学习记录，不补发或编造旧证书。'));
 surface.append(details);
}
core.unit2728Legacy={preserve,reading,show};
})(globalThis.CanranCore);
