/* The learner keeps using the current document while the next one renders.
   Only the exact same-origin frame created for this turn can take its place. */
(() => {
  'use strict';
  if (window.CanranStudentHandoff) return;
  const base = new URL('.', document.currentScript.src);
  const marker = 'student-view';
  const pane = window.parent !== window && window.frameElement?.hasAttribute('data-student-view');
  const host = pane ? window.parent.CanranStudentHandoff : null;
  const nativeReplace = history.replaceState.bind(history);
  const nativePush = history.pushState.bind(history);
  let owner, pending, active, leaving, notice, noticeTarget, idleTimer, progressTimer;
  let retired = false, staged = !!host, finishFade;
  const initial = route(location.href);
  let visible = initial;

  function route(href) {
    const url = new URL(href, location.href);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return null;
    url.searchParams.delete(marker);
    if (url.search) return null;
    const path = url.pathname.slice(base.pathname.length);
    if ((!path || path === 'index.html') && !url.hash) return {kind:'home', url:base.href};
    if ((path === 'awards/' || path === 'awards') && !url.hash) return {kind:'album', url:new URL('awards/',base).href};
    const unit = /^(unit\d+-\d+)(?:\/(?:index\.html)?)?$/.exec(path);
    return unit ? {kind:'lesson', course:unit[1], url:new URL(unit[1]+'/'+url.hash,base).href} : null;
  }
  function sameStudent(a,b) {
    return a && b && a.id === b.id && a.epoch === b.epoch;
  }
  function sourceWindow() { return active?.contentWindow || window; }
  function clearNotice() {
    notice?.remove(); notice=null;
    if(noticeTarget?.getAttribute('aria-busy')==='true') noticeTarget.removeAttribute('aria-busy');
    noticeTarget=null;
  }
  function clearTimers() { clearTimeout(idleTimer);clearTimeout(progressTimer); }
  function cancel(restore=true) {
    const item=pending;
    pending=null;clearTimers();clearNotice();item?.frame?.remove();
    if(item?.pop && restore && visible) nativeReplace(history.state,'',visible.url);
    if(item&&restore)sourceWindow().dispatchEvent(new Event('canran:resume-student-view'));
  }
  function renderNotice(item,error) {
    if(pending!==item)return;
    clearNotice();
    const doc=sourceWindow().document;
    const box=doc.createElement('div'); box.className='student-navigation-status student-document-status';box.setAttribute('role','status');
    const label=doc.createElement('span'),name={lesson:'课程',album:'纪念册',home:'学习旅程'}[item.target.kind];
    label.textContent=error?'暂时无法打开'+name+'。':'正在打开'+name+'…';box.append(label);
    function action(text,label,run) {
      const button=doc.createElement('button');button.type='button';button.textContent=text;
      button.setAttribute('aria-label',label);button.onclick=run;box.append(button);
    }
    if(error)action('重试','重试切换',()=>open(item.target,item.trigger,item.pop));
    action('取消','取消切换',()=>{const from=item.trigger;cancel();from?.focus({preventScroll:true});});
    (doc.querySelector('dialog[open]')||doc.body).append(box);notice=box;
    if(item.trigger){noticeTarget=item.trigger;noticeTarget.setAttribute('aria-busy','true');}
  }
  function fail(item) {
    if(pending!==item)return;
    clearTimers();item.frame?.remove();item.frame=null;renderNotice(item,true);
    sourceWindow().dispatchEvent(new Event('canran:resume-student-view'));
  }
  function arm(item) {
    clearTimeout(idleTimer);idleTimer=setTimeout(()=>fail(item),80000);
  }
  function privacyBoundary(url) {
    cancel(false);document.documentElement.style.visibility='hidden';
    const target=new URL(url,base);
    if(target.pathname===location.pathname && target.search===location.search){
      nativeReplace(null,'',target.href);location.reload();
    }else location.replace(target.href);
  }
  function frameFor(item) {
    const frame=document.createElement('iframe'),url=new URL(item.target.url);
    frame.className='student-document-pane';frame.dataset.studentView='preparing';
    frame.title={lesson:'课程学习',album:'我的纪念册',home:'我的课程'}[item.target.kind];frame.inert=true;frame.setAttribute('aria-hidden','true');
    // The course restores its own section. A native fragment on a newly
    // inserted frame can also scroll the visible parent in WebKit.
    frame.dataset.initialHash=url.hash;url.hash='';
    url.searchParams.set(marker,'1');frame.src=url.href;
    let loadedDocument;
    frame.addEventListener('load',()=>{
      if(pending!==item && active!==frame)return;
      try{
        const child=frame.contentWindow;
        if(child.location.href==='about:blank')return;
        if(active===frame && loadedDocument && loadedDocument!==child.document){
          const address=new URL(child.location.href);address.searchParams.delete(marker);
          privacyBoundary(address.href);return;
        }
        loadedDocument=child.document;
        if(!child.CanranStudentHandoff?.embedded){
          if(pending===item)fail(item);
          else location.replace(new URL(child.location.href,base).href);
        }
      }catch{if(pending===item)fail(item);else location.replace(visible.url);}
    });
    item.frame=frame;document.body.append(frame);
  }
  async function open(target,trigger,pop=false) {
    if(!target)return;
    if(pending?.target.url===target.url && pending.frame && !pop)return;
    cancel(false);
    const item={target,trigger,pop,frame:null};pending=item;
    const source=sourceWindow();
    source.dispatchEvent(new Event('canran:cancel-workspace-navigation'));
    source.dispatchEvent(new CustomEvent('canran:save-workspace',{detail:{target:target.url}}));
    source.dispatchEvent(new Event('canran:prepare-student-view'));
    progressTimer=setTimeout(()=>renderNotice(item,false),160);arm(item);
    try{
      await source.CanranStudentHandoff?.beforeLeave?.();
      if(pending===item)frameFor(item);
    }catch{fail(item);}
  }
  function finishPrevious(){
    if(leaving){
      leaving.contentWindow?.dispatchEvent(new Event('canran:retire-student-view'));
      leaving.remove();leaving=null;
    }
    if(retired)document.documentElement.setAttribute('data-student-host','');
  }
  function reveal(frame){
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    if(motion.matches||document.hidden)return;
    frame.style.opacity='0';
    return new Promise(resolve=>{
      let last,tick,elapsed=0;
      const finish=()=>{
        cancelAnimationFrame(tick);frame.style.removeProperty('opacity');
        document.removeEventListener('visibilitychange',finish);finishFade=null;resolve();
      };
      function paint(now){
        // A long layout task can consume 240 ms between two WebKit paints.
        // Advance on presented frames so it cannot skip the whole transition.
        if(last!==undefined)elapsed+=Math.min(now-last,48);
        last=now;
        const progress=Math.min(1,elapsed/240);
        if(progress===1||motion.matches||!frame.isConnected){finish();return;}
        frame.style.opacity=String(1-(1-progress)**3);
        tick=requestAnimationFrame(paint);
      }
      finishFade=finish;document.addEventListener('visibilitychange',finish);
      tick=requestAnimationFrame(paint);
    });
  }
  async function prepared(child, identity) {
    const item=pending,frame=item?.frame;
    if(!frame || frame.contentWindow!==child || item.committing)return;
    if(!sameStudent(owner,identity)){privacyBoundary(item.target.url);return;}
    item.committing=true;
    try{
      const activate=await child.CanranStudentHandoff.validate();
      if(pending!==item)return;
      const destination=route(child.location.href);
      if(!destination||destination.kind!==item.target.kind)throw Error('Unexpected student destination');
      child.CanranStudentHandoff.activate(activate);
      clearTimers();clearNotice();pending=null;
      finishFade?.();
      finishPrevious();
      const previous=active;
      sourceWindow().dispatchEvent(new CustomEvent('canran:save-workspace',{detail:{target:item.target.url}}));
      active=frame;visible=destination;
      if(!retired){
        document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
        retired=true;
      }
      const state={...history.state,studentDocument:true};
      if(item.pop)nativeReplace(state,'',destination.url);else nativePush(state,'',destination.url);
      document.title=child.document.title;frame.dataset.studentView='active';
      frame.inert=false;frame.removeAttribute('aria-hidden');leaving=previous;
      if(previous){previous.contentWindow.CanranStudentHandoff.retire();previous.inert=true;previous.setAttribute('aria-hidden','true');previous.dataset.studentView='leaving';}
      for(const node of document.body.children)if(node!==frame&&node!==previous)node.inert=true;
      frame.focus({preventScroll:true});
      await reveal(frame);
      if(active===frame)finishPrevious();
      if(!previous)window.dispatchEvent(new Event('canran:retire-student-view'));
    }catch(error){if(pending===item){if(error?.status===401)privacyBoundary(item.target.url);else fail(item);}}
  }
  function ready(who) {
    if(!who?.student?.id || who.preview || who.mustChangePassword)return;
    if(!bind(who))return;
    if(host && staged)host.prepared(window,owner);
  }
  function bind(who){
    if(!who?.student?.id||who.preview||who.mustChangePassword)return false;
    const next={id:who.student.id,epoch:who.systemUpgrade?.epoch||null};
    if(owner&&!sameStudent(owner,next)&&(host||pending||active)){(host||api).identityChanged(window);return false;}
    owner=next;return true;
  }
  function sourceClick(event) {
    if(retired||!owner||event.defaultPrevented||event.button!==0||
       event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
    const link=event.target.closest?.('a[href]');
    if(!link){
      const control=event.target.closest?.('button,input,select,textarea');
      if(control&&!control.closest('.student-document-status'))(host||api).cancelFrom(window,control);
      return;
    }
    if(link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
    const current=route(location.href),target=route(link.href);
    if(host&&!staged&&current?.kind==='lesson'&&target?.kind==='lesson'&&new URL(target.url).pathname===location.pathname){
      event.preventDefault();api.fragment(target.url,true);
    }else if(followLink(link,link)){
      event.preventDefault();
    }else if(host && !staged && (!target || (current?.kind==='lesson' && new URL(link.href).pathname!==location.pathname))){
      const url=new URL(link.href);
      if(url.origin===base.origin && (url.pathname!==location.pathname||url.search!==location.search)){event.preventDefault();host.native(window,url.href);}
    }else if(!event.target.closest('.student-document-status'))(host||api).cancelFrom(window);
  }
  function followLink(link,trigger){
    if(!owner||retired||staged)return false;
    const current=route(location.href),target=route(link.href);
    if(!((current?.kind==='home'&&target?.kind==='lesson')||(current?.kind==='lesson'&&target?.kind==='home')))return false;
    (host||api).request(window,target.url,trigger);
    return true;
  }
  const api={
    embedded:!!host,get preparing(){return staged;},get retired(){return retired;},ready,
    retire(){retired=true;},
    bind,followLink,
    returningCourse(who){return host?.lessonForHome(window,{id:who.student.id,epoch:who.systemUpgrade?.epoch||null});},
    lessonForHome(child,identity){
      if(pending?.target.kind==='home'&&pending.frame?.contentWindow===child&&sameStudent(owner,identity))return visible?.course;
    },
    beforeLeave:null,onActivate:null,
    currentRequest(){return !host || host.waitingFor(window);},
    waitingFor(child){return pending?.frame?.contentWindow===child;},
    validate(){return api.onActivate?.();},
    navigateFragment(id){
      if(!host||staged)return false;
      const next=new URL(location.href);next.hash=id;
      if(next.href!==location.href)api.fragment(next.href,true);
      return true;
    },
    activate(commit){commit?.();staged=false;window.dispatchEvent(new Event('canran:student-view-active'));},
    request(child,href,link){if(child===sourceWindow()&&owner)open(route(href),link);},
    cancelFrom(child,control){if(child===sourceWindow()&&pending&&(!control||pending.trigger!==control))cancel();},
    identityChanged(child){if(child===sourceWindow()||child===pending?.frame?.contentWindow)privacyBoundary(base.href);},
    native(child,url){if(child===sourceWindow()&&new URL(url).origin===base.origin)location.assign(url);},
    fragment(href,push){
      const url=new URL(href),oldURL=location.href;
      url.searchParams.set(marker,'1');if(url.href===oldURL)return;
      nativeReplace(history.state,'',url.href);
      if(push)host.mirrored(window,url.href,true);
      window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL,newURL:url.href}));
    },
    prepared,
    progress(){if(host)host.advanced(window);},
    advanced(child){if(pending?.frame?.contentWindow===child)arm(pending);},
    error(code){if(host)host.rejected(window,code);},
    rejected(child,code){const item=pending;if(item?.frame?.contentWindow===child){
      if(code===401||code==='identity')privacyBoundary(item.target.url);else fail(item);
    }else if(active?.contentWindow===child&&(code===401||code==='identity'))privacyBoundary(visible.url);},
    mirrored(child,href,push){
      if(active?.contentWindow!==child)return;
      const next=route(href);if(!next||next.url===visible?.url)return;
      visible=next;(push?nativePush:nativeReplace)({...history.state,studentDocument:true},'',next.url);
    }
  };
  window.CanranStudentHandoff=api;
  document.addEventListener('click',sourceClick);
  if(host){
    if(window.frameElement.dataset.initialHash && !location.hash){
      nativeReplace(history.state,'',location.pathname+location.search+window.frameElement.dataset.initialHash);
    }
    for(const method of ['pushState','replaceState'])history[method]=function(state,unused,url){
      const next=new URL(url??location.href,location.href);next.searchParams.set(marker,'1');
      nativeReplace(state,unused,next.href);
      if(!staged)host.mirrored(window,location.href,method==='pushState');
    };
    window.addEventListener('hashchange',()=>{if(!staged)host.mirrored(window,location.href,true);});
    const error=document.querySelector('meta[name="student-view-error"]');
    if(error)api.error(Number(error.content));
  }else{
    const identity=()=>{if(pending||active)privacyBoundary(base.href);};
    if(typeof BroadcastChannel==='function')new BroadcastChannel('canran-lesson-identity').addEventListener('message',identity);
    navigator.serviceWorker?.addEventListener('message',e=>{if(e.data?.type==='identity:changed')identity();});
    window.addEventListener('popstate',event=>{
      if(!retired){if(pending)cancel(false);return;}
      const next=route(location.href);
      if(!next){location.reload();return;}
      event.stopImmediatePropagation();
      if(next.kind==='lesson'&&visible?.kind==='lesson'&&new URL(next.url).pathname===new URL(visible.url).pathname&&active){
        cancel(false);visible=next;active.contentWindow.CanranStudentHandoff.fragment(next.url,false);return;
      }
      if(next.url!==visible?.url)open(next,null,true);
    },true);
    window.addEventListener('hashchange',event=>{if(retired)event.stopImmediatePropagation();},true);
    document.addEventListener('visibilitychange',()=>{if(document.hidden && pending)cancel();});
    window.addEventListener('pagehide',()=>cancel(false));
    window.addEventListener('pageshow',event=>{if(event.persisted&&retired)location.reload();});
  }
  document.addEventListener('canran:course-ready',()=>ready(window.CanranStudentAccess));
})();
