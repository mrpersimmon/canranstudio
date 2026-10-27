(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CanranStudentShell=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
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
  function mount(target,{base='/',student=null,current='courses',preview=false}={}){
    const active=page=>current===page?' aria-current="page"':'';
    target.innerHTML=`<header class="student-header"><a class="student-brand" href="${base}" aria-label="灿然英语工作室首页"><img src="${base}assets/brand/starflower.png" alt=""><span>灿然英语工作室</span></a>${student?`<nav class="student-nav" aria-label="主导航">${preview?`<a href="${base}admin/">返回班级管理</a>`:`<a href="${base}"${active('courses')}>我的课程</a><a href="${base}awards/"${active('awards')}>我的纪念册</a><details class="student-account"><summary>我的</summary><div class="student-menu"><p class="student-menu-name">${escape(student.name)}</p>${student.studentNumber?`<p class="student-menu-number">${escape(student.studentNumber)}</p>`:''}<a href="${base}?account=password">修改密码</a><button type="button" data-student-logout>退出登录</button><a class="student-menu-secondary" href="${base}?account=history">本机旧记录</a><p class="student-menu-status" role="status" aria-live="polite"></p></div></details>`}</nav>`:''}</header>`;
    const menu=target.querySelector('details'),summary=menu?.querySelector('summary'),logout=target.querySelector('[data-student-logout]');
    const outside=event=>{if(menu&&!menu.contains(event.target))menu.open=false;};
    const key=event=>{if(event.key==='Escape'&&menu?.open){menu.open=false;summary.focus();}};
    document.addEventListener('click',outside);document.addEventListener('keydown',key);
    if(logout)logout.onclick=async()=>{
      logout.disabled=true;const status=target.querySelector('[role=status]');status.textContent='';
      try{await signOut(base);}catch{status.textContent='暂时无法退出，请再试一次。';logout.disabled=false;}
    };
    return()=>{document.removeEventListener('click',outside);document.removeEventListener('keydown',key);};
  }
  return {mount,signOut};
});
