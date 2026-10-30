(function(){
  'use strict';
  if(window.CanranViewportMetrics||typeof window.crypto?.randomUUID!=='function')return;
  const script=document.currentScript,base=script?.dataset.base,kind=script?.dataset.pageKind;
  if(!base||new URLSearchParams(location.search).has('preview'))return;
  let timer,retryTimer,stopped=false,ready=false,last=null,seen=new Set(),changes=0,capped=false,activeKind=null;
  const pending=new Map(),controllers=new Set();
  function pageKind(){
    if(kind!=='portal')return kind;
    if(document.querySelector('.login-fallback,[data-session-state="checking"],[data-session-state="error"]'))return null;
    if(document.querySelector('#loginForm,#passwordForm,#teacherPassword'))return 'login';
    if(location.pathname.startsWith(base+'admin'))return 'admin';
    const workspace=document.querySelector('[data-student-workspace]');
    if(workspace)return workspace.dataset.page==='courses'?'home':workspace.dataset.page==='awards'?'album':null;
    return document.querySelector('[data-journey-ready]')?'home':'other';
  }
  function measure(){
    const viewport=window.visualViewport;
    const data={layoutWidth:Math.round(innerWidth),layoutHeight:Math.round(innerHeight),clientWidth:document.documentElement.clientWidth,
      visualWidth:viewport?Math.round(viewport.width):null,visualHeight:viewport?Math.round(viewport.height):null,
      visualScale:viewport?Math.round(viewport.scale*100)/100:null,dpr:devicePixelRatio||1};
    return data.layoutWidth>0&&data.layoutHeight>0&&data.clientWidth>0?data:null;
  }
  function bands(value){return[value.layoutWidth<=360,value.layoutWidth<600,value.layoutWidth<1024,value.layoutHeight<520,value.layoutHeight<=820].join(',');}
  function transmit(payload,retry=false){
    if(stopped)return;
    pending.set(payload.eventId,payload);
    const controller=new AbortController();controllers.add(controller);
    fetch(base+'api/client-viewports',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',keepalive:true,body:JSON.stringify(payload),signal:controller.signal})
      .then(response=>{
        if(response.headers.get('X-Viewport-Metrics')==='disabled'){stop();return;}
        if(response.status>=500)throw Error('retry');
        pending.delete(payload.eventId);
      }).catch(()=>{
        if(stopped)return;
        if(!retry&&navigator.onLine!==false)retryTimer=setTimeout(()=>transmit(payload,true),1000);
        else pending.delete(payload.eventId);
      }).finally(()=>controllers.delete(controller));
  }
  function sample(){
    if(stopped||!ready||document.visibilityState!=='visible')return;
    const current=pageKind(),data=measure();if(!current||!data)return;
    if(current!==activeKind){activeKind=current;last=null;seen=new Set();changes=0;capped=false;}
    const identity=JSON.stringify([current,...Object.values(data)]);
    if(seen.has(identity))return;
    let reason='initial';
    if(last){
      const layout=Math.abs(data.layoutWidth-last.layoutWidth)>=8||Math.abs(data.layoutHeight-last.layoutHeight)>=32||bands(data)!==bands(last)||data.dpr!==last.dpr;
      const visual=Math.abs((data.visualWidth||0)-(last.visualWidth||0))>=8||Math.abs((data.visualHeight||0)-(last.visualHeight||0))>=32||data.visualScale!==last.visualScale;
      if(!layout&&!visual)return;
      reason=layout?'layout-change':'visual-change';
      if(changes>=10){
        if(!capped){capped=true;transmit({v:1,eventId:crypto.randomUUID(),pageKind:current,reason:'capped'});}
        return;
      }
      changes++;
    }
    last=data;seen.add(identity);
    transmit({v:1,eventId:crypto.randomUUID(),pageKind:current,reason,...data});
  }
  function schedule(){if(stopped)return;clearTimeout(timer);timer=setTimeout(sample,750);}
  function visibility(){
    if(document.visibilityState==='visible'){schedule();return;}
    if(typeof navigator.sendBeacon!=='function')return;
    for(const [id,payload] of pending){
      try{if(navigator.sendBeacon(base+'api/client-viewports',new Blob([JSON.stringify(payload)],{type:'application/json'})))pending.delete(id);}catch{}
    }
  }
  function pageshow(event){if(event.persisted){last=null;seen=new Set();changes=0;capped=false;schedule();}}
  const observer=new MutationObserver(schedule);
  function stop(){
    stopped=true;clearTimeout(timer);clearTimeout(retryTimer);observer.disconnect();
    window.removeEventListener('resize',schedule);window.visualViewport?.removeEventListener('resize',schedule);
    document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pageshow',pageshow);
    for(const controller of controllers)controller.abort();controllers.clear();pending.clear();
  }
  window.CanranViewportMetrics={stop};
  Promise.resolve(document.fonts?.ready).catch(()=>{}).then(()=>{
    if(stopped)return;ready=true;
    // Portal login/home transitions happen without a full document navigation.
    const app=document.getElementById('app');if(kind==='portal'&&app)observer.observe(app,{childList:true,subtree:true});
    schedule();
  });
  window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);
  document.addEventListener('visibilitychange',visibility);window.addEventListener('pageshow',pageshow);
})();
