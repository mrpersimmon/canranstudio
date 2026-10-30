(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CanranStudentShell=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  async function signOut(base){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetch(base+'api/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal:controller.signal});
      if(!response.ok)throw Error('暂时无法退出，请再试一次。');
      if(typeof BroadcastChannel==='function'){const channel=new BroadcastChannel('canran-lesson-identity');channel.postMessage('changed');channel.close();}
      navigator.serviceWorker?.controller?.postMessage({type:'identity:changed'});
      location.replace(base);
    }finally{clearTimeout(timer);}
  }
  function mount(target,{base='/',student=null,current='courses',preview=false,onAccount=null}={}){
    const active=page=>current===page?' aria-current="page"':'';
    const account=onAccount?'<button type="button" class="student-account-trigger" aria-haspopup="dialog">我的</button>':'<a href="'+base+'?account=profile">我的</a>';
    target.innerHTML=`<header class="student-header"><a class="student-brand" href="${base}" aria-label="灿然英语工作室首页"><img src="${base}assets/brand/starflower.png" alt=""><span>灿然英语工作室</span></a>${student?`<nav class="student-nav" aria-label="主导航">${preview?`<a href="${base}admin/">返回班级管理</a>`:`<a href="${base}"${active('courses')}>我的课程</a><a href="${base}awards/"${active('awards')}>我的纪念册</a>${account}`}</nav>`:''}</header>`;
    const trigger=target.querySelector('.student-account-trigger');
    if(trigger)trigger.addEventListener('click',onAccount);
    return()=>trigger?.removeEventListener('click',onAccount);
  }
  return {mount,signOut};
});
