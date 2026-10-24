(function(root){
 'use strict';
 root.CanranCore ||= {};
 const BASE=document.querySelector('meta[name="archive-base"]').content,id=document.querySelector('meta[name="archive-id"]').content;
 const asset=(course,value)=>BASE+'awards/history-assets/'+course+'/'+String(value).replace(/^\//,'');
 const text=(tag,value,cls='')=>{const element=document.createElement(tag);element.textContent=value;element.className=cls;return element;};
 async function imagesReady(){await document.fonts.ready;await Promise.all([...document.images].filter(image=>image.src).map(image=>image.decode()));}
 async function show(){
  const status=document.getElementById('certificateArchiveStatus'),host=document.getElementById('certificateArchiveView');
  try{
   const local=document.querySelector('meta[name="archive-local"]')?.content==='true';
   const response=await fetch(BASE+(local?'api/awards':'api/certificates/'+encodeURIComponent(id)),{cache:'no-store'});
   if(!response.ok)throw Error(response.status===401?'请登录后查看自己的证书。':'暂时无法读取这张证书，请返回纪念册重试。');
   const result=await response.json(),archive=local?(await root.CanranLocalCertificates.collect(result)).find(item=>item.id===id&&item.course===document.documentElement.dataset.unit):result.archive||result;
   if(!archive||!Number.isFinite(Date.parse(archive.issuedAt)))throw Error('原领取记录不完整，请联系老师核对。');
   if(archive.kind==='card'){
    const meta=local?root.CanranArchiveCardMetadata?.[archive.edition]:archive.meta;
    if(!meta?.scene)throw Error('这张本机证书的原模板暂不可用，请先下载保留副本。');
    const unit={id:archive.course,copy:{compact:true},reward:{...meta,scene:asset(archive.course,meta.scene),zones:[]}};
    const retained={...archive,meta:unit.reward};
    root.CanranStudentAccess={student:{name:archive.name},preview:false,retainedCertificate:retained};
    root.CanranAccessReady=Promise.resolve(root.CanranStudentAccess);
    const view=root.CanranCore.storyCertificate.mount({element:host,unit,returnUrl:new URL(BASE,location.href).href,go:()=>{}});
    view.update({stars:5,zones:{},pendingZones:[],firstFullStarAt:archive.issuedAt});
    host.querySelector('.story-award-tasks')?.remove();
    await imagesReady();status.textContent='原证书';return;
   }
   if(archive.kind!=='legacy-paper')throw Error('暂不支持这类证书。');
   const snapshot=structuredClone(archive.snapshot),digits=archive.course.slice(4).replace('-','');
   snapshot.activity={...snapshot.activity,unitName:archive.name};
   delete snapshot.activity.unitCertificateIssuedAt;delete snapshot.activity.unitClassroomCertificateIssuedAt;
   const issuedField=archive.meta?.issuedAtField==='unitClassroomCertificateIssuedAt'?'unitClassroomCertificateIssuedAt':'unitCertificateIssuedAt';
   snapshot.activity[issuedField]=archive.issuedAt;
   // The original renderer receives an isolated read-only view. No course
   // notebook, storage namespace, answer runner or synchronization is loaded.
   const practice={activity:()=>snapshot,sameContentSignature:(a,b)=>a===b};
   const renderer=root.CanranCore['unit'+digits+(['unit1-2','unit3-4','unit5-6'].includes(archive.course)?'History':'Legacy')];
   if(!renderer?.show)throw Error('原证书模板暂时不可用。');
   const detached=document.createElement('div');renderer.show(practice,detached);
   const open=detached.querySelector('.legacy-certificate-host .unit-certificate-actions button:last-child'),dialog=document.getElementById('legacyCertificateDialog');
   if(!open||!dialog)throw Error('原证书暂时未能恢复，请联系老师核对。');
   open.textContent='查看原证书';const actions=text('div','','certificate-archive-actions');actions.append(open);host.append(actions);
   dialog.dataset.archivePreparing='true';open.click();
   await Promise.all([document.fonts.load('400 32px "ZCOOL KuaiLe"',archive.name),document.fonts.load('700 32px "Baloo 2"','Lesson')]);
   await imagesReady();delete dialog.dataset.archivePreparing;status.textContent='原证书';
  }catch(error){document.getElementById('legacyCertificateDialog')?.close();status.textContent=error.message;}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});else void show();
})(globalThis);
