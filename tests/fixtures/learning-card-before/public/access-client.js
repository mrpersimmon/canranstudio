(function(){
'use strict';
const course=location.pathname.match(/\/(unit\d+-\d+)(?:\/|$)/)?.[1];
if(!course)return;
const preview=new URLSearchParams(location.search).get('preview');
const native={get:Storage.prototype.getItem,set:Storage.prototype.setItem,remove:Storage.prototype.removeItem};
const read=k=>native.get.call(localStorage,k),write=(k,v)=>native.set.call(localStorage,k,v);
const key='canran:lesson:'+course+':learning:v1';
let access,owner,prefix,timer,pending,lastSnapshot='',renewing=false,flushing=false,hiddenAt=0,renewAt=0,locked=false;
const memory=new Map();
const privacyStyle=document.createElement('style');privacyStyle.textContent='html[data-access-locked] body>[data-access-inert]{visibility:hidden!important}';document.head.append(privacyStyle);
const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('canran-lesson-identity'):null;
const isCourseKey=k=>/^canran:lesson:/.test(k)||/^lesson:(?:l\d+|phonics-magic)-stars/.test(k);
async function api(route,data){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{const response=await fetch('/lesson/api/'+route,{cache:'no-store',signal:controller.signal,...(data===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})});const value=await response.json();if(!response.ok)throw Object.assign(new Error(value.error),{status:response.status});return value;}finally{clearTimeout(timeout);}}
function syncStatus(text){let tag=document.getElementById('studentSyncStatus');if(tag)tag.textContent=access?.preview?'班级预览 · 不记录成绩':text;}
function notifyPending(){syncStatus(pending?'已保存到本机 · 等待同步':'学习成果已同步');}
function completedSnapshot(book){
 const groups={},records={},activity={unitCompleted:book.activity?.unitCompleted||{}};
 for(const [id,group] of Object.entries(book.groups||{}))if(group.index===group.signature?.split('|').length&&group.states?.every(s=>s?.checked&&s.correct)){groups[id]=group;for(const state of group.states)if(book.records?.[state.questionId])records[state.questionId]=book.records[state.questionId];}
 for(const id of ['unitDialogue','subjectRound'])if(book.activity?.[id]?.done)activity[id]=book.activity[id];
 for(const id of ['unitName','unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'])if(book.activity?.[id])activity[id]=book.activity[id];
 return {version:1,groups,records,activity};
}
function saveQueue(){if(access?.preview)return;const value=read(prefix+key);if(!value)return;try{const completed=completedSnapshot(JSON.parse(value)),snapshot=JSON.stringify(completed);if(snapshot===lastSnapshot)return;lastSnapshot=snapshot;pending={studentId:owner,course,generation:access.progress.generation,grant:access.grant,value:completed};write(prefix+'pending:'+course,JSON.stringify(pending));notifyPending();clearTimeout(timer);timer=setTimeout(flush,400);}catch{syncStatus('暂未保存，请先别关闭页面');}}
async function flush(){if(!pending||flushing||access?.preview)return;flushing=true;const sent=pending;try{const result=await api('progress',sent);if(result.stale){pending=null;native.remove.call(localStorage,prefix+'pending:'+course);lock('学习记录已在另一台设备重置，请重新进入课程。',()=>location.reload());return;}if(pending===sent){pending=null;native.remove.call(localStorage,prefix+'pending:'+course);}notifyPending();}catch{syncStatus('已保存到本机 · 联网后同步');}finally{flushing=false;if(pending&&pending!==sent)setTimeout(flush,400);}}
function lock(message,retry=()=>location.reload()){
 locked=true;document.documentElement.setAttribute('data-access-locked','');
 let gate=document.getElementById('accessGate');if(!gate){gate=document.createElement('div');gate.id='accessGate';gate.setAttribute('role','alertdialog');gate.setAttribute('aria-label','课程访问');gate.style='position:fixed;inset:0;z-index:2147483646;background:#fcf8ef;display:grid;place-items:center;padding:24px;color:#4b3428;font:18px/1.7 system-ui';document.body.append(gate);}
 for(const child of document.body.children)if(child!==gate&&!child.inert){child.inert=true;child.dataset.accessInert='';}
 gate.style.setProperty('display','grid','important');gate.style.setProperty('visibility','visible','important');gate.replaceChildren();const box=document.createElement('div'),copy=document.createElement('h2'),button=document.createElement('button'),back=document.createElement('a');copy.textContent=message;button.textContent='再试一次';button.style='font:inherit;padding:12px 24px;margin:12px;border-radius:18px';button.onclick=retry;back.textContent='返回课程';back.href='/lesson/';box.append(copy,button,back);gate.append(box);button.focus({preventScroll:true});window.dispatchEvent(new Event('lesson49:leave-activity'));
}
function unlock(){document.querySelectorAll('[data-access-inert]').forEach(el=>{el.inert=false;delete el.dataset.accessInert;});locked=false;document.documentElement.removeAttribute('data-access-locked');document.getElementById('accessGate')?.remove();}
async function renew(){if(renewing)return;renewing=true;for(const child of document.body.children)if(!child.inert){child.inert=true;child.dataset.accessInert='';}try{const next=await api('courses/'+course+'/enter',{preview});if(next.student.id!==owner){lock('学习身份已改变，请重新进入课程。');return;}access.grant=next.grant;access.expires=next.expires;renewAt=Date.now()+7200000;unlock();await pinAgain();flush();}catch(error){lock(error.status===403?error.message:'暂时无法核验，请联网后再试。',renew);}finally{renewing=false;}}
async function pinAgain(){const controller=navigator.serviceWorker?.controller;if(!controller||!window.CanranCourseCache)return;const pack=await window.CanranCourseCache.open('/lesson/').current(course);if(pack)controller.postMessage({type:'course:pin',id:course,revision:pack.revision});}
function mergeRemote(local,remote){const v=local&&typeof local==='object'?local:{version:1,groups:{},records:{},activity:{}};v.groups={...v.groups,...remote.groups};v.records={...v.records,...remote.records};v.activity={...v.activity,...remote.activity,unitCompleted:{...v.activity?.unitCompleted,...remote.activity?.unitCompleted}};return v;}
function installStorage(){
 Storage.prototype.getItem=function(k){k=String(k);if(this!==localStorage||!isCourseKey(k))return native.get.call(this,k);return access.preview?(memory.get(k)??null):native.get.call(this,prefix+k);};
 Storage.prototype.setItem=function(k,v){k=String(k);if(this!==localStorage||!isCourseKey(k))return native.set.call(this,k,v);if(access.preview){memory.set(k,String(v));return;}native.set.call(this,prefix+k,v);if(k===key)saveQueue();};
 Storage.prototype.removeItem=function(k){k=String(k);if(this!==localStorage||!isCourseKey(k))return native.remove.call(this,k);if(access.preview){memory.delete(k);return;}native.remove.call(this,prefix+k);};
}
window.CanranAccessReady=(async()=>{
 access=await api('courses/'+course+'/enter',{preview});owner=access.student.id;prefix='canran:student:'+owner+':';renewAt=Date.now()+7200000;
 if(!access.preview){
  const generationKey=prefix+'generation:'+course;const oldGeneration=Number(read(generationKey)||0);
  let local=null;try{local=JSON.parse(read(prefix+key)||'null');pending=JSON.parse(read(prefix+'pending:'+course)||'null');}catch{}
  if(oldGeneration!==access.progress.generation){local=null;pending=null;native.remove.call(localStorage,prefix+'pending:'+course);}
  write(prefix+key,JSON.stringify(mergeRemote(local,access.progress.value)));write(generationKey,String(access.progress.generation));
 }
 lastSnapshot=JSON.stringify(completedSnapshot(JSON.parse(read(prefix+key)||'{}')));installStorage();return access;
})();
window.CanranAccessReady.catch(error=>{const show=()=>lock(error.status===403?error.message:'请联网后重新进入课程。');if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});else show();});
channel?.addEventListener('message',()=>lock('学习身份已改变，请重新进入课程。'));
navigator.serviceWorker?.addEventListener('message',event=>{if(event.data?.type==='identity:changed')lock('学习身份已改变，请重新进入课程。');});
window.addEventListener('online',flush);
window.addEventListener('pagehide',event=>{if(event.persisted)lock('正在核验课程…',renew);});
window.addEventListener('pageshow',event=>{if(event.persisted)renew();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)hiddenAt=Date.now();else if(access&&Date.now()-hiddenAt>1800000)renew();});
setInterval(()=>{if(access&&!document.hidden&&!locked&&Date.now()>=renewAt)renew();},10000);
document.addEventListener('click',event=>{if(locked&&!event.target.closest('#accessGate')){event.preventDefault();event.stopImmediatePropagation();}},true);
document.addEventListener('canran:course-ready',()=>{
 const actions=document.querySelector('.unit-top-actions')||document.getElementById('starCountWrap')?.parentElement;if(!actions)return;
 const strip=document.createElement('div');strip.className='student-access-bar';document.getElementById('chapterNav').before(strip);
 const style=document.createElement('style');style.textContent=`
 .student-access-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:1120px;margin:0 auto;padding:4px 16px 8px}
 .student-access-bar .workspace-back{min-height:36px;font-size:13px;padding:4px 12px;white-space:nowrap}
 .student-access-bar #studentSyncStatus{font:12px/1.4 system-ui;color:#6f655b}
 .unit-top-actions{flex-shrink:0}.unit-top-actions #starCountWrap{white-space:nowrap}
 .student-settings-dialog{width:min(440px,calc(100% - 32px));max-height:calc(100dvh - 32px);padding:24px;margin:auto;overscroll-behavior:contain}
 .student-settings-dialog .unit-dialog-heading{align-items:flex-start;gap:16px}
 .student-settings-dialog h2{min-width:0;font-size:22px;line-height:1.5;overflow-wrap:anywhere}
 .student-settings-dialog h2 span{display:inline-block;white-space:nowrap}
 .student-settings-dialog .student-settings-close{flex-shrink:0}
 .student-settings-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
 .student-settings-dialog .student-settings-actions button,.student-settings-dialog .student-settings-reset button{width:100%;min-height:48px;padding:10px 12px;font-size:16px;white-space:normal;overflow-wrap:anywhere}
 .student-settings-reset{margin-top:24px;padding-top:20px;border-top:1px solid #dac8b4}
 .student-settings-dialog .student-settings-reset button{background:#fff1e7;color:#823b2e}
 .student-settings-dialog .student-settings-reset p{margin:10px 0 0;font-size:14px;line-height:1.5;color:#6f655b}
 .student-settings-dialog .student-settings-status{margin:16px 0 0;font-size:15px;line-height:1.5;color:#823b2e}
 .student-settings-dialog button:focus-visible{outline:3px solid #79542d;outline-offset:4px}
 @media(max-width:400px){.student-settings-dialog{padding:20px}.student-settings-dialog h2{font-size:20px}}
 `;document.head.append(style);
 const label=document.createElement('span');label.id='studentSyncStatus';label.setAttribute('role','status');strip.append(label);
 const identity=document.createElement('button');identity.className='workspace-back';identity.textContent=access.preview?'返回班级管理':access.student.name+' · 学习设置';
 identity.onclick=()=>{
  if(access.preview){location.href='/lesson/admin/';return;}
  const dialog=document.createElement('dialog');dialog.className='unit-dialog student-settings-dialog';dialog.setAttribute('aria-labelledby','studentSettingsTitle');
  const heading=document.createElement('div');heading.className='unit-dialog-heading';
  const title=document.createElement('h2');title.id='studentSettingsTitle';title.append(document.createTextNode(access.student.name+'的'));
  const titleLabel=document.createElement('span');titleLabel.textContent='学习设置';title.append(titleLabel);
  const close=document.createElement('button');close.className='workspace-back student-settings-close';close.textContent='关闭';close.autofocus=true;close.onclick=()=>dialog.close();heading.append(title,close);
  const status=document.createElement('p');status.className='student-settings-status';status.setAttribute('role','status');status.hidden=true;
  const showError=message=>{status.textContent=message;status.hidden=false;};
  const accountActions=document.createElement('div');accountActions.className='student-settings-actions';
  const switcher=document.createElement('button');switcher.className='workspace-back';switcher.textContent='切换学生';
  switcher.onclick=async()=>{try{await flush();await api('logout',{});channel?.postMessage('changed');navigator.serviceWorker?.controller?.postMessage({type:'identity:changed'});location.assign('/lesson/');}catch{showError('请联网后再切换学生或退出登录');}};
  const exit=document.createElement('button');exit.className='workspace-back';exit.textContent='退出登录';exit.onclick=switcher.onclick;accountActions.append(switcher,exit);
  const resetArea=document.createElement('div');resetArea.className='student-settings-reset';
  const reset=document.createElement('button');reset.className='workspace-back';reset.textContent='重开本课';
  const resetNote=document.createElement('p');resetNote.textContent='只清空本课的个人学习成果。';
  reset.onclick=()=>{
   reset.textContent='确认清空本课个人成果';
   reset.onclick=async()=>{try{const result=await api('progress/reset',{course});native.remove.call(localStorage,prefix+key);native.remove.call(localStorage,prefix+'pending:'+course);write(prefix+'generation:'+course,String(result.generation));location.reload();}catch(error){showError(error.message);}};
  };
  resetArea.append(reset,resetNote);dialog.append(heading,accountActions,resetArea,status);document.body.append(dialog);
  dialog.addEventListener('close',()=>{dialog.remove();identity.focus({preventScroll:true});});dialog.showModal();
 };strip.append(identity);
 if(preview)document.getElementById('logo')?.setAttribute('href','/lesson/?preview='+encodeURIComponent(preview));notifyPending();flush();
});
})();
