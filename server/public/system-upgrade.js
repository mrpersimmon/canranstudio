(function(root){
 'use strict';
 const namespace=(studentId,upgrade)=>'canran:student:'+studentId+':'+(upgrade?.epoch?'epoch:'+upgrade.epoch+':':'');
 function notice(access,parent){
  const upgrade=access?.systemUpgrade,student=access?.student;
  if(!upgrade?.affected||!student||access.preview||!parent)return;
  const key='canran:student:'+student.id+':system-upgrade-notice:'+upgrade.epoch;
  try{if(localStorage.getItem(key)==='seen')return;}catch{}
  if(document.getElementById('systemUpgradeNotice'))return;
  const box=document.createElement('section');box.id='systemUpgradeNotice';box.setAttribute('role','region');box.setAttribute('aria-label','课程体系升级说明');
  box.style='display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin:12px auto 20px;max-width:1080px;padding:18px 22px;border:1px solid #cfdbc5;border-radius:20px;background:#f1f6e9;color:#355440;box-sizing:border-box;font:16px/1.7 system-ui,sans-serif';
  const copy=document.createElement('p');copy.textContent=upgrade.message;copy.style='flex:1;min-width:min(240px,100%);margin:0';
  const close=document.createElement('button');close.type='button';close.textContent='知道了';close.style='font:inherit;font-weight:700;border:0;border-radius:14px;background:#42664c;color:#fff;padding:10px 20px;min-height:44px;cursor:pointer';
  close.onclick=()=>{try{localStorage.setItem(key,'seen');}catch{}box.remove();};box.append(copy,close);parent.prepend(box);
 }
 root.CanranSystemUpgrade={namespace,notice};
})(globalThis);
