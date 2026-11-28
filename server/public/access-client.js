(function(){
'use strict';
const course=location.pathname.match(/\/(unit\d+-\d+)(?:\/|$)/)?.[1];
if(!course)return;
const preview=new URLSearchParams(location.search).get('preview');
const native={get:Storage.prototype.getItem,set:Storage.prototype.setItem,remove:Storage.prototype.removeItem};
const handoff=window.CanranStudentHandoff;
let staging=!!handoff?.preparing;
const stagedValues=new Map(),initialValues=new Map();
const read=k=>staging&&stagedValues.has(k)?stagedValues.get(k):native.get.call(localStorage,k);
function change(k,v){
 if(staging){if(!initialValues.has(k))initialValues.set(k,native.get.call(localStorage,k));stagedValues.set(k,v);return;}
 if(v===null)native.remove.call(localStorage,k);else native.set.call(localStorage,k,v);
}
const write=(k,v)=>change(k,String(v));
const key='canran:lesson:'+course+':learning:v1';
let access,owner,prefix,timer,retryTimer,pending,pendingWriteFailed=false,lastSnapshot='',urgentPending=false,retryDelay=1000,renewing=false,flushing=false,hiddenAt=0,renewAt=0,locked=false;
const memory=new Map();
const privacyStyle=document.createElement('style');privacyStyle.textContent='html[data-access-locked] body>[data-access-inert]{visibility:hidden!important}';document.head.append(privacyStyle);
const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('canran-lesson-identity'):null;
const isCourseKey=k=>/^canran:lesson:/.test(k)||/^lesson:(?:l\d+|phonics-magic)-stars/.test(k);
async function api(route,data){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{const response=await fetch('/lesson/api/'+route,{cache:'no-store',signal:controller.signal,...(data===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})});if(!response.ok){const error=await response.json().catch(()=>({}));throw Object.assign(new Error(error.error||response.statusText),{status:response.status});}return await response.json();}finally{clearTimeout(timeout);}}
function syncStatus(text,state='failed'){
 const tag=document.getElementById('studentSyncStatus');
 if(!tag)return;
 tag.textContent=access?.preview?'班级预览 · 不记录成绩':text;
 tag.dataset.syncState=access?.preview?'preview':state;
 // Course storage is namespaced on subpaths; this cross-script event must stay stable.
 window.dispatchEvent(new CustomEvent('lesson-sync:status',{detail:{state:tag.dataset.syncState,text:tag.textContent}}));
}
function notifyPending(){syncStatus(pending?'已保存到本机 · 等待同步':course==='unit1-2'?'已同步':'学习成果已同步',pending?'pending':'synced');}
function completedSnapshot(book){
 const groups={},records={},activity={unitCompleted:book.activity?.unitCompleted||{}};
 for(const [id,group] of Object.entries(book.groups||{}))if(group.index===group.signature?.split('|').length&&group.states?.every(s=>s?.checked&&s.correct)){groups[id]=group;for(const state of group.states)if(book.records?.[state.questionId])records[state.questionId]=book.records[state.questionId];}
 for(const id of ['unitDialogue','subjectRound'])if(book.activity?.[id]?.done)activity[id]=book.activity[id];
 for(const id of ['unitName','unitCertificateIssuedAt','unitClassroomCertificateIssuedAt'])if(book.activity?.[id])activity[id]=book.activity[id];
 // Reading position is synchronized separately from completion evidence.
 // The server validates the word anchor; this metadata never awards a star.
 // All paired courses now use the shared word deck. Authorization and the
 // valid anchor list remain checked by the server, independent of this UI.
 if(course){
  if(book.activity?.unitWordDeck?.version===1)activity.unitWordDeck=book.activity.unitWordDeck;
  if(Number.isInteger(book.activity?.unitWordPage)&&book.activity.unitWordPage>=0)activity.unitWordPage=book.activity.unitWordPage;
 }
 if(book.activity?.unitAwardClaims)activity.unitAwardClaims=book.activity.unitAwardClaims;
 if(access?.systemUpgrade?.epoch)return {version:1,groups,records,activity};
 if(course==='unit1-2'){
  if(book.activity?.unit12HistoryProgress)activity.unit12HistoryProgress=book.activity.unit12HistoryProgress;
  if(book.activity?.unit12V154Seen===true)activity.unit12V154Seen=true;
 }
 if(course==='unit3-4'){
  if(book.activity?.unit34HistoryProgress)activity.unit34HistoryProgress=book.activity.unit34HistoryProgress;
  if(book.activity?.unit34V154Seen===true)activity.unit34V154Seen=true;
 }
 if(course==='unit5-6'){
  if(book.activity?.unit56HistoryProgress)activity.unit56HistoryProgress=book.activity.unit56HistoryProgress;
  if(book.activity?.unit56V154Seen===true)activity.unit56V154Seen=true;
 }
 // The reading edition replaces unitDialogue. Carry the separately frozen
 // predecessor proof too, so its completed story survives another device.
 if(course==='unit49-50'&&book.activity?.unitLegacyProgress)activity.unitLegacyProgress=book.activity.unitLegacyProgress;
 // This course already had a five-star edition before the scoped review.
 // Carry its frozen evidence, and distinguish fresh current work from it.
 if(course==='unit19-20'){
  if(book.activity?.unit1920V153Progress)activity.unit1920V153Progress=book.activity.unit1920V153Progress;
  if(book.activity?.unit1920V153Migration===true)activity.unit1920V153Migration=true;
 }
 if(course==='unit23-24'){
  if(book.activity?.unit2324LegacyProgress)activity.unit2324LegacyProgress=book.activity.unit2324LegacyProgress;
  if(book.activity?.unit2324V153Progress)activity.unit2324V153Progress=book.activity.unit2324V153Progress;
  if(book.activity?.unit2324V153Migration===true)activity.unit2324V153Migration=true;
 }
 if(course==='unit25-26'){
  if(book.activity?.unit2526LegacyProgress)activity.unit2526LegacyProgress=book.activity.unit2526LegacyProgress;
  if(book.activity?.unit2526V153Progress)activity.unit2526V153Progress=book.activity.unit2526V153Progress;
  if(book.activity?.unit2526V153Migration===true)activity.unit2526V153Migration=true;
 }
 if(course==='unit27-28'){
  if(book.activity?.unit2728LegacyProgress)activity.unit2728LegacyProgress=book.activity.unit2728LegacyProgress;
  if(book.activity?.unit2728V153Progress)activity.unit2728V153Progress=book.activity.unit2728V153Progress;
  if(book.activity?.unit2728V153Migration===true)activity.unit2728V153Migration=true;
 }
 if(course==='unit29-30'){
  if(book.activity?.unit2930LegacyProgress)activity.unit2930LegacyProgress=book.activity.unit2930LegacyProgress;
  if(book.activity?.unit2930V153Progress)activity.unit2930V153Progress=book.activity.unit2930V153Progress;
  if(book.activity?.unit2930V153Migration===true)activity.unit2930V153Migration=true;
 }
 return {version:1,groups,records,activity};
}
function saveQueue(){
 if(access?.preview||staging)return;const value=read(prefix+key);if(!value)return;
 try{
  const book=JSON.parse(value),completed=completedSnapshot(book),observations=CanranLearningObserver.snapshot(book),snapshot=JSON.stringify([completed,observations]);if(snapshot===lastSnapshot)return;
  const prior=lastSnapshot?JSON.parse(lastSnapshot)[0]:{},claims=completed.activity?.unitAwardClaims||{};
  urgentPending ||= Object.entries(claims).some(([id,claim])=>typeof claim?.runId==='string'&&claim.runId!==prior.activity?.unitAwardClaims?.[id]?.runId);
  const stored=pendingWriteFailed?pending:JSON.parse(read(prefix+'pending:'+course)||'null');
  pending={studentId:owner,course,epoch:access.systemUpgrade?.epoch,generation:access.progress.generation,grant:access.grant,value:completed,observations:CanranLearningObserver.merge(stored?.generation===access.progress.generation?stored.observations:null,observations)};
  pendingWriteFailed=true;write(prefix+'pending:'+course,JSON.stringify(pending));pendingWriteFailed=false;lastSnapshot=snapshot;notifyPending();clearTimeout(timer);
  // A microtask includes the remaining completion writes in this same click.
  // Keep one in-flight request; only ordinary observations use the debounce.
  if(urgentPending)queueMicrotask(flush);else timer=setTimeout(flush,400);
 }catch{syncStatus('暂未保存，请先别关闭页面');}
}
let upload;
function flush(){
 if(upload)return upload;
 if(staging||!pending||access?.preview||locked)return Promise.resolve();
 const job=sendPending();upload=job;
 const clear=()=>{if(upload===job)upload=null;};job.then(clear,clear);return job;
}
async function sendPending(){
 if(!pending||flushing||access?.preview||locked)return;
 if(navigator.onLine===false){syncStatus('已保存到本机 · 联网后同步','retry');return;}
 clearTimeout(retryTimer);
 const outbox=prefix+'pending:'+course;
 try{const stored=read(outbox);if(stored&&!pendingWriteFailed)pending=JSON.parse(stored);pending.grant=access.grant;write(outbox,JSON.stringify(pending));pendingWriteFailed=false;}catch{syncStatus('暂未保存，请先别关闭页面');return;}
 flushing=true;const sent=pending;urgentPending=false;
 try{
  const chunk=CanranLearningObserver.nextUpload(sent),result=await api('progress',chunk);
  retryDelay=1000;
  if(result.stale){pending=null;native.remove.call(localStorage,prefix+'pending:'+course);lock(result.systemUpgrade?.message||'学习记录已在另一台设备重置，请重新进入课程。',()=>location.reload());return;}
  if(result.awards){access.awards=result.awards;access.awardReviews=result.awardReviews||[];window.dispatchEvent(new CustomEvent('lesson-awards:synced',{detail:{...result.awards,reviews:access.awardReviews}}));}
  const raw=read(outbox),remaining=CanranLearningObserver.afterUpload(pendingWriteFailed?pending:JSON.parse(raw),chunk);
  if(remaining)write(outbox,JSON.stringify(remaining));else native.remove.call(localStorage,outbox);
  pending=remaining;pendingWriteFailed=false;notifyPending();
  const latest=JSON.parse(read(prefix+key)||'{}').activity?.unitAwardClaims||{};
  if(result.awardReviews?.some(item=>!item.accepted&&latest[item.zone]?.runId===item.runId&&!result.awards?.zones?.[item.zone]))syncStatus('本轮得星未获确认，请查看本轮结果。','review');
 }catch(error){
  if(error.status===401||error.status===403){
   const reviews=Object.entries(sent.value?.activity?.unitAwardClaims||{}).map(([zone,claim])=>({zone,runId:claim.runId,edition:claim.edition,accepted:false,reason:'access'}));
   access.awardReviews=reviews;window.dispatchEvent(new CustomEvent('lesson-awards:synced',{detail:{...access.awards,reviews}}));
   lock('请重新进入课程核验学习身份，作答记录已保留。',renew);
  }else if(error.code==='UPLOAD_TOO_LARGE'||error.status===413){
   syncStatus('这份记录暂时无法上传，已保存在本机。','review');
  }else{
   syncStatus('已保存到本机 · 联网后同步','retry');
   if(navigator.onLine!==false&&(!error.status||error.status>=500||error.status===429)){retryTimer=setTimeout(flush,retryDelay);retryDelay=Math.min(30000,retryDelay*2);}
  }
 }finally{flushing=false;upload=null;if(pending&&pending!==sent){clearTimeout(retryTimer);if(urgentPending)queueMicrotask(flush);else timer=setTimeout(flush,400);}}
}
function lock(message,retry=()=>location.reload()){
 if(handoff?.retired)return;
 locked=true;document.documentElement.setAttribute('data-access-locked','');
 let gate=document.getElementById('accessGate');if(!gate){gate=document.createElement('div');gate.id='accessGate';gate.setAttribute('role','alertdialog');gate.setAttribute('aria-label','课程访问');gate.style='position:fixed;inset:0;z-index:2147483646;background:#fcf8ef;display:grid;place-items:center;padding:24px;color:#4b3428;font:18px/1.7 system-ui';document.body.append(gate);}
 for(const child of document.body.children)if(child!==gate&&!child.inert){child.inert=true;child.dataset.accessInert='';}
 gate.style.setProperty('display','grid','important');gate.style.setProperty('visibility','visible','important');gate.replaceChildren();const box=document.createElement('div'),copy=document.createElement('h2'),button=document.createElement('button'),back=document.createElement('a');copy.textContent=message;button.textContent='再试一次';button.style='font:inherit;padding:12px 24px;margin:12px;border-radius:18px';button.onclick=retry;back.textContent='返回课程';back.href='/lesson/';box.append(copy,button,back);gate.append(box);button.focus({preventScroll:true});window.dispatchEvent(new Event('lesson49:leave-activity'));
}
function unlock(){document.querySelectorAll('[data-access-inert]').forEach(el=>{el.inert=false;delete el.dataset.accessInert;});locked=false;document.documentElement.removeAttribute('data-access-locked');document.getElementById('accessGate')?.remove();}
async function renew(){if(renewing||staging||handoff?.retired)return;renewing=true;for(const child of document.body.children)if(!child.inert){child.inert=true;child.dataset.accessInert='';}try{const next=await api('courses/'+course+'/enter',{preview});if(next.student.id!==owner){lock('学习身份已改变，请重新进入课程。');return;}if(next.systemUpgrade?.epoch!==access.systemUpgrade?.epoch){lock(next.systemUpgrade?.message||'课程已更新，请刷新课程。',()=>location.reload());return;}access.grant=next.grant;access.expires=next.expires;if(next.awards){access.awards=next.awards;window.dispatchEvent(new CustomEvent('lesson-awards:synced',{detail:next.awards}));}renewAt=Date.now()+7200000;unlock();await pinAgain();flush();}catch(error){lock(error.status===403?error.message:'暂时无法核验，请联网后再试。',renew);}finally{renewing=false;}}
async function pinAgain(){const controller=navigator.serviceWorker?.controller;if(!controller||!window.CanranCourseCache)return;const pack=await window.CanranCourseCache.open('/lesson/').current(course);if(pack)controller.postMessage({type:'course:pin',id:course,revision:pack.revision});}
function mergeRemote(local,remote){
 const v=local&&typeof local==='object'?local:{version:1,groups:{},records:{},activity:{}};
 const localWordPosition=v.activity?.unitWordDeck,localWordPage=v.activity?.unitWordPage;
 const groups={...v.groups,...remote.groups};
 // A restarted round is a local draft. An older completed round from the
 // server must not replace it on reload; the earned star is kept separately.
 for(const [id,draft] of Object.entries(v.groups||{})){
  const saved=remote.groups?.[id];
  if(saved&&typeof draft?.runId==='string'&&typeof draft.signature==='string'&&typeof draft.contentSignature==='string'&&draft.runId!==saved.runId&&
    draft.contentSignature===saved.contentSignature&&draft.signature===saved.signature&&
    Number.isInteger(draft.index)&&draft.index>=0&&draft.index<draft.signature.split('|').length)groups[id]=draft;
 }
 v.groups=groups;v.records={...v.records,...remote.records};
 v.activity={...v.activity,...remote.activity,unitCompleted:{...v.activity?.unitCompleted,...remote.activity?.unitCompleted},...(v.activity?.unitAwardClaims||remote.activity?.unitAwardClaims?{unitAwardClaims:{...v.activity?.unitAwardClaims,...remote.activity?.unitAwardClaims}}:{})};
 // A queued reading position is newer than the server snapshot. Preserve only
 // that navigation metadata; score merging and reset-generation rules stay intact.
 if(pending?.course===course&&localWordPosition?.version===1&&pending.value?.activity?.unitWordDeck?.anchor===localWordPosition.anchor){
  v.activity.unitWordDeck=localWordPosition;if(Number.isInteger(localWordPage))v.activity.unitWordPage=localWordPage;
 }
 return v;
}
function installStorage(){
 Storage.prototype.getItem=function(k){k=String(k);if(this!==localStorage||!isCourseKey(k))return native.get.call(this,k);return access.preview?(memory.get(k)??null):read(prefix+k);};
 Storage.prototype.setItem=function(k,v){k=String(k);if(this!==localStorage||!isCourseKey(k))return native.set.call(this,k,v);if(access.preview){memory.set(k,String(v));return;}write(prefix+k,v);if(k===key)saveQueue();};
 Storage.prototype.removeItem=function(k){k=String(k);if(this!==localStorage||!isCourseKey(k))return native.remove.call(this,k);if(access.preview){memory.delete(k);return;}change(prefix+k,null);};
}
window.CanranAccessReady=(async()=>{
 access=await api('courses/'+course+'/enter',staging?{preview,prepareOnly:true}:{preview});owner=access.student.id;prefix=window.CanranSystemUpgrade?.namespace(owner,access.systemUpgrade)||'canran:student:'+owner+':'+(access.systemUpgrade?.epoch?'epoch:'+access.systemUpgrade.epoch+':':'');renewAt=Date.now()+7200000;
 if(!access.preview){
  const generationKey=prefix+'generation:'+course;const oldGeneration=Number(read(generationKey)||0);
  let local=null;try{local=JSON.parse(read(prefix+key)||'null');pending=JSON.parse(read(prefix+'pending:'+course)||'null');}catch{}
  if(oldGeneration!==access.progress.generation){local=null;pending=null;change(prefix+'pending:'+course,null);}
  write(prefix+key,JSON.stringify(mergeRemote(local,access.progress.value)));write(generationKey,String(access.progress.generation));
 }
 const initial=JSON.parse(read(prefix+key)||'{}');lastSnapshot=JSON.stringify([completedSnapshot(initial),CanranLearningObserver.snapshot(initial)]);installStorage();window.CanranStudentAccess=access;
 // The notebook is the durable evidence source. Rebuild an outbox that could
 // not be saved earlier, without resurrecting an explicitly rejected round.
 let rejected={};try{rejected=JSON.parse(read(prefix+key+':awards:'+access.awards?.edition)||'{}').rejected||{};}catch{}
 if(!access.preview&&!pending&&Object.entries(initial.activity?.unitAwardClaims||{}).some(([id,claim])=>typeof claim?.runId==='string'&&!access.awards?.zones?.[id]&&rejected[id]?.runId!==claim.runId)){lastSnapshot='';saveQueue();}
 if(handoff){
  handoff.beforeLeave=flush;
  handoff.onActivate=async()=>{
   if(!staging)return;
   const next=await api('courses/'+course+'/permit?student-view=1');
   if(!handoff.currentRequest())throw Error('导航已取消');
   if(next.studentId!==owner||next.systemUpgrade?.epoch!==access.systemUpgrade?.epoch){handoff.error('identity');throw Error('学习身份已改变');}
   if(next.generation!==access.progress.generation||[...initialValues].some(([k,value])=>native.get.call(localStorage,k)!==value))throw Error('学习记录已更新，请重试');
   return ()=>{
    staging=false;
    for(const [k,value] of stagedValues)change(k,value);
    stagedValues.clear();initialValues.clear();saveQueue();notifyPending();void flush();
    void api('courses/'+course+'/enter',{openedGrant:access.grant,studentId:owner,generation:access.progress.generation}).catch(error=>{if(error.status===401||error.status===403)lock(error.message,renew);});
   };
  };
 }
 return access;
})();
window.CanranAccessReady.catch(error=>{handoff?.error(error.status);const show=()=>lock(error.status===403?error.message:'请联网后重新进入课程。');if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});else show();});
channel?.addEventListener('message',()=>lock('学习身份已改变，请重新进入课程。'));
navigator.serviceWorker?.addEventListener('message',event=>{if(event.data?.type==='identity:changed')lock('学习身份已改变，请重新进入课程。');});
window.addEventListener('online',()=>{retryDelay=1000;flush();});
window.addEventListener('offline',()=>clearTimeout(retryTimer));
window.addEventListener('pagehide',event=>{if(event.persisted)lock('正在核验课程…',renew);});
window.addEventListener('pageshow',event=>{if(event.persisted)renew();});
document.addEventListener('visibilitychange',()=>{if(handoff?.retired)return;if(document.hidden)hiddenAt=Date.now();else if(access&&Date.now()-hiddenAt>1800000)renew();});
setInterval(()=>{if(access&&!document.hidden&&!locked&&Date.now()>=renewAt)renew();},10000);
document.addEventListener('click',event=>{if(locked&&!event.target.closest('#accessGate')){event.preventDefault();event.stopImmediatePropagation();}},true);
document.addEventListener('canran:course-ready',()=>{
 window.CanranSystemUpgrade?.notice(access,document.querySelector('main')||document.body);
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
 .student-settings-name{margin:0 0 18px;color:#6f655b}
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
 const identity=document.createElement('button');identity.className='workspace-back';identity.textContent=access.preview?'返回班级管理':course==='unit1-2'?'学习设置':access.student.name+' · 学习设置';
 identity.onclick=()=>{
  if(access.preview){location.href='/lesson/admin/';return;}
  const dialog=document.createElement('dialog');dialog.className='unit-dialog student-settings-dialog';dialog.setAttribute('aria-labelledby','studentSettingsTitle');
  const heading=document.createElement('div');heading.className='unit-dialog-heading';
  const title=document.createElement('h2');title.id='studentSettingsTitle';if(course!=='unit1-2')title.append(document.createTextNode(access.student.name+'的'));
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
  const resetNote=document.createElement('p');resetNote.textContent=access.awards?'重开练习，保留星星和首次满星日期。':'只清空本课的个人学习成果。';
  reset.onclick=()=>{
   reset.textContent=access.awards?'确认重开练习':'确认清空本课个人成果';
   reset.onclick=async()=>{try{await flush();if(pending){showError('还有成果等待同步，请联网后再重开练习。');return;}const result=await api('progress/reset',{course,epoch:access.systemUpgrade?.epoch});native.remove.call(localStorage,prefix+key);native.remove.call(localStorage,prefix+'pending:'+course);write(prefix+'generation:'+course,String(result.generation));location.reload();}catch(error){showError(error.message);}};
  };
  resetArea.append(reset,resetNote);dialog.append(heading);
  if(course==='unit1-2'){const name=document.createElement('p');name.className='student-settings-name';name.textContent=access.student.name;dialog.append(name);}
  dialog.append(accountActions,resetArea,status);document.body.append(dialog);
  dialog.addEventListener('close',()=>{dialog.remove();identity.focus({preventScroll:true});});dialog.showModal();
 };strip.append(identity);
 if(preview)document.getElementById('logo')?.setAttribute('href','/lesson/?preview='+encodeURIComponent(preview));notifyPending();flush();
});
})();
