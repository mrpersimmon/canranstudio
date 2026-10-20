(function(core){
 'use strict';
 const localKey='unit34HistorySnapshot',remoteKey='unit34HistoryProgress',marker='unit34V154Seen';
 const node=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
 const date=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
 function evidence(book){return Boolean(book&&(Object.keys(book.records||{}).length||Object.values(book.groups||{}).some(g=>g.states?.some(s=>s?.attempts>0||s?.selection!=null))||book.activity?.unitDialogue?.i>=0||date(book.activity?.unitCertificateIssuedAt)||date(book.activity?.unitClassroomCertificateIssuedAt)));}
 function preserve(practice,unit){
  if(practice.activity(marker))return;
  try{
   const local=JSON.parse(localStorage.getItem(unit.progress.learningKey)||'null'),remote=practice.activity(remoteKey);
   if(evidence(local)){
    const activity={...local.activity};delete activity[localKey];delete activity[remoteKey];delete activity[marker];
    const snapshot={...local,activity};practice.activity(localKey,snapshot);if(!remote)practice.activity(remoteKey,snapshot);
   }
   practice.activity(marker,true);
  }catch{/* The original data remains in place; shared save controls report failures. */}
 }
 function voicedCertificate(snapshot){
  return !Object.keys(snapshot.groups||{}).some(k=>/\/(?:tasks-v4|grammar-v1|v154)$/.test(k))&&
   Object.values(snapshot.records||{}).some(r=>typeof r.target==='string'&&r.target.startsWith('听辨 '));
 }
 function badgeTitles(snapshot){return voicedCertificate(snapshot)?['认领前准备','找回我的伞','礼貌认领','你我的小工坊','认领小达人']:['认领前准备','找回我的伞','办一次认领','换人说一说','认领小达人'];}
 function show(practice,surface){
  const snapshot=practice.activity(localKey)||practice.activity(remoteKey);if(!evidence(snapshot))return;
  const activity=snapshot.activity||{},details=node('details','','offline-task legacy-learning');
  details.append(node('summary','之前的学习记录与证书'));
  details.append(node('p','原来的作答和错答保留在这里。已获得的纪念卡仍在纪念册中，原五星日期保持不变。'));
  const records=node('details'),list=node('ul','','legacy-records');
  for(const r of Object.values(snapshot.records||{}))list.append(node('li',(r.target||'原练习')+' · '+(r.correct?'已答对':'尚未完成')+' · 提交'+(Number.isFinite(r.attempts)?r.attempts:'—')+'次'));
  records.append(node('summary',`查看原作答（${list.children.length}条）`),list);details.append(records);
  const issuedAt=[activity.unitClassroomCertificateIssuedAt,activity.unitCertificateIssuedAt].find(date);
  if(issuedAt){
   const name=typeof activity.unitName==='string'?activity.unitName:'';
   details.append(node('p','原领证姓名：'+(name.trim()||'雨伞认领小帮手'),'legacy-name'));
   const issued=node('p','原领证日期：'+new Date(issuedAt).toLocaleDateString('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'long',day:'numeric'}),'legacy-issued-date');issued.dataset.issuedAt=issuedAt;details.append(issued);
   const host=node('div','','legacy-certificate-host');details.append(host);
   const art=(name,label='')=>{if(!['visitor','attendant'].includes(name))return core.lesson49Icons.create(name,label);const im=node('img','','shop-icon');im.src='/assets/unit3-4/'+name+'.svg';im.alt=label;return im;};
   const view=core.unit34LegacyCertificate.mount({element:host,initialName:name,initialIssuedAt:issuedAt,canClaim:()=>true,onClaim:()=>{},design:{
    copy:{title:'认领小达人',course:'雨伞认领小帮手 · Lesson 3–4',completion:voicedCertificate(snapshot)?'完成 Lesson 3–4 单元练习':'完成 Lesson 3–4 课堂配套练习',thanks:'仔细确认，礼貌认领！'},
    characters:['visitor','attendant'],characterLabels:['客人','工作人员'],icon:art,defaultName:'雨伞认领小帮手',dialogTitle:'旧版雨伞认领小帮手纪念',fileName:'Lesson3-4-旧版雨伞认领小帮手.png',
    badges:badgeTitles(snapshot).map((title,i)=>({title,icon:['cards','book','heart','question','star'][i],color:['#FFF0BC','#FBE2CD','#E1EDD5','#DFEAF1','#F8DCD4'][i]}))
   }});
   view.update({complete:true,completedChapters:[true,true,true,true,true],next:null});
   host.querySelector('input').readOnly=true;
   for(const selector of ['input','.certificate-name-label','.certificate-greeting','.certificate-track'])host.querySelector(selector).hidden=true;
   host.querySelector('.unit-certificate-actions button:last-child').textContent='查看旧证书';
   document.getElementById('legacyCertificateDialog').classList.add('legacy-certificate-dialog');
  }
  surface.append(details);
 }
 core.unit34History={preserve,show};
})(globalThis.CanranCore);

