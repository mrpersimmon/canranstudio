(function () {
  'use strict';
  const app = document.getElementById('app'), adminMode = location.pathname.startsWith('/lesson/admin');
  const preview = new URLSearchParams(location.search).get('preview');
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel('canran-lesson-identity') : null;
  let state, currentClass;
  async function api(endpoint, value) {
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
    try{const response = await fetch('/lesson/api/' + endpoint, { signal:controller.signal,cache:'no-store', ...(value === undefined ? {} : { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(value) }) });
    const result = await response.json(); if (!response.ok) throw Object.assign(new Error(result.error), { status:response.status }); return result;}finally{clearTimeout(timeout);}
  }
  async function worker() { try { const reg = await navigator.serviceWorker?.register('/lesson/core/subpath-worker.js', {scope:'/lesson/',updateViaCache:'none'}); await reg?.update(); } catch {} }
  worker();
  function changed() { channel?.postMessage('changed'); navigator.serviceWorker?.controller?.postMessage({type:'identity:changed'}); }
  function status(message) { const target=app.querySelector('[role=status]'); if(target)target.textContent=message; }
  async function attempt(action) { try { await action(); } catch(error) { status(error.message || '暂时无法连接，请重试'); } }
  const logo='<img class="hero-logo" src="/lesson/assets/brand/starflower.png" alt="">';
  function login(admin = false, message = '') {
    app.innerHTML=`<section class="login panel">${logo}<h1>${admin?'班级管理':'开始你的小冒险'}</h1><form id="loginForm">${admin?'<label for="username">管理员账号</label><input id="username" name="username" autocomplete="username" required><label for="password">管理员密码</label><input id="password" name="password" type="password" autocomplete="current-password" required>':'<label for="code">个人学习码</label><input id="code" name="code" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="输入学习卡上的代码" required>'}<button class="primary">${admin?'登录管理页':'进入我的课程'}</button><p role="status">${e(message)}</p></form>${admin?'<a href="/lesson/">返回学生入口</a>':'<p class="muted">使用老师发给你的个人学习卡</p><a class="muted" href="/lesson/admin/">老师管理入口</a>'}</section>`;
    document.getElementById('loginForm').onsubmit=event=>{event.preventDefault();attempt(async()=>{
      const form=new FormData(event.target);const button=event.target.querySelector('button');button.disabled=true;
      try {await api(admin?'admin/login':'login',Object.fromEntries(form));if(admin)await loadAdmin();else{changed();if(/^\/lesson\/unit\d+-\d+\//.test(location.pathname))location.reload();else await home();}}finally{button.disabled=false;}
    });};
  }
  async function syncPending(studentId){
    const prefix='canran:student:'+studentId+':';let remaining=0;
    const keys=Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).filter(k=>k.startsWith(prefix+'pending:'));
    for(const key of keys){try{const pending=JSON.parse(localStorage.getItem(key));if(pending.studentId!==studentId)continue;const result=await api('progress',pending);if(result.stale){localStorage.removeItem(prefix+'canran:lesson:'+pending.course+':learning:v1');localStorage.setItem(prefix+'generation:'+pending.course,String(result.generation));}localStorage.removeItem(key);}catch{remaining++;}}
    return remaining;
  }
  async function home() {
    let who;try{who=await api('me'+(preview?'?preview='+encodeURIComponent(preview):''));}catch(error){return login(false,error.status===401?'':error.message);}
    const waiting=who.preview?0:await syncPending(who.student.id);
    if(!who.preview)who=await api('me');
    app.innerHTML=`<section class="login panel">${logo}<h1>灿然英语工作室</h1><p role="status">正在准备画面…</p></section>`;
    try{await Promise.all(who.courses.filter(c=>c.image).map(c=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>image.decode().then(resolve,reject);image.onerror=reject;image.src=c.image;})));}catch{app.innerHTML='<section class="login panel"><h1>画面还没准备好</h1><button id="retry">再试一次</button></section>';document.getElementById('retry').onclick=home;return;}
    app.innerHTML=`<div class="toolbar"><div><p class="muted">${e(who.className)}${who.preview?' · 预览不记录成绩':''}</p><h1>${e(who.student.name)}的课程</h1></div>${who.preview?'<a class="button compact" href="/lesson/admin/">返回班级管理</a>':'<button class="compact" id="logout">切换学生</button>'}</div><div class="grid">${who.courses.map(c=>`<a class="panel course" href="/lesson/${e(c.id)}/${preview?'?preview='+encodeURIComponent(preview):''}#learn/${e(c.next||'words')}">${c.image?`<img src="${e(c.image)}" alt="">`:''}<span><small>${e(c.label)}</small><strong>${e(c.title)}</strong><span>${c.stars?'★ '+c.stars+' / 15 · 继续学习':'开始学习'} →</span></span></a>`).join('')}</div>${who.courses.length?'':'<section class="panel empty"><h2>老师还没开放课程</h2><p>开课后，再回来看看吧。</p><button id="refresh">刷新课程</button></section>'}<p role="status"></p><details class="panel" style="margin-top:28px"><summary>本机旧记录</summary><p class="muted">这些记录来自使用学习卡之前，不计入当前学生。</p><ul id="legacy"></ul></details>`;
    if(waiting)status('还有学习成果保存在本机，联网后将继续同步。');
    document.getElementById('logout')?.addEventListener('click',()=>attempt(async()=>{await api('logout',{});changed();location.replace('/lesson/');}));
    document.getElementById('refresh')?.addEventListener('click',home);
    const list=document.getElementById('legacy');let found=false;
    for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!/^canran:(?:lesson:)?(?:unit\d+-\d+:learning|l\d+:progress|soundmark:progress)/.test(key))continue;try{const value=JSON.parse(localStorage.getItem(key));const item=document.createElement('li');const unit=key.match(/unit\d+-\d+|l\d+/)?.[0];item.textContent=unit+' · '+(value.activity?.unitCompleted?Object.keys(value.activity.unitCompleted).length+' 项活动完成':Object.values(value.ratings||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+' 颗星');list.append(item);found=true;}catch{}}
    if(!found)list.textContent='这台设备没有旧记录。';
  }
  async function loadAdmin(selected=currentClass) { state=await api('admin/state');currentClass=selected;renderAdmin(); }
  function renderAdmin(){
    const group=state.classes.find(c=>c.id===currentClass);
    app.innerHTML=`<div class="toolbar"><div><p class="muted">灿然英语工作室</p><h1>班级管理</h1></div><button id="adminLogout" class="compact">退出管理</button></div><div class="stack"><section class="panel"><h2>我的班级</h2><div class="tabs">${state.classes.map(c=>`<button class="compact" data-class="${e(c.id)}" aria-label="管理 ${e(c.name)}" aria-current="${c.id===currentClass}">${e(c.name)}</button>`).join('')}</div><form id="newClass"><label for="className">新班级名称</label><input id="className" name="name" maxlength="60" required><button>创建班级</button></form></section>${group?`<section class="panel"><div class="toolbar"><h2>${e(group.name)} · 开放课程</h2><a class="button compact" href="/lesson/?preview=${e(group.id)}">预览这个班</a></div><form id="courses"><label for="editClassName">班级名称</label><input id="editClassName" name="name" value="${e(group.name)}" maxlength="60" required><div class="check-grid">${state.courses.map(c=>`<label><input type="checkbox" name="course" value="${e(c.id)}" ${group.courses.includes(c.id)?'checked':''}>${e(c.label)} ${e(c.title)}</label>`).join('')}</div><button class="primary">保存开放课程</button></form></section><section class="panel"><div class="toolbar"><h2>班级学生</h2><button id="allCards" class="compact">打印全班学习卡</button></div><form id="newStudents"><label for="names">学生姓名或课堂称呼，每行一位</label><textarea id="names" name="names" rows="3" required></textarea><button>添加学生</button></form><div>${state.students.filter(s=>s.classId===group.id).map(s=>`<div class="student-row" data-student="${e(s.id)}"><div><strong>${e(s.name)}</strong><p class="muted">${s.active?'可学习':'已停用'} · ${s.id.slice(0,8)}</p></div><div class="actions"><button class="compact" data-card="${e(s.id)}">学习卡</button><button class="compact" data-edit="${e(s.id)}">管理学生</button></div></div>`).join('')}</div></section>`:''}<p role="status" aria-live="polite"></p></div>`;
    app.querySelectorAll('[data-class]').forEach(button=>button.onclick=()=>{currentClass=button.dataset.class;renderAdmin();});
    document.getElementById('adminLogout').onclick=()=>attempt(async()=>{await api('logout',{admin:true});login(true);});
    document.getElementById('newClass').onsubmit=event=>{event.preventDefault();attempt(async()=>{const created=await api('admin/classes',{name:new FormData(event.target).get('name')});await loadAdmin(created.id);status('班级已创建');});};
    document.getElementById('courses')?.addEventListener('submit',event=>{event.preventDefault();attempt(async()=>{const form=new FormData(event.target);await api('admin/classes',{id:group.id,name:form.get('name'),courses:form.getAll('course')});group.name=form.get('name');group.courses=form.getAll('course');status('开放课程已保存');});});
    document.getElementById('newStudents')?.addEventListener('submit',event=>{event.preventDefault();attempt(async()=>{await api('admin/students',{classId:group.id,names:new FormData(event.target).get('names')});await loadAdmin();status('学生已添加，可以领取学习卡');});});
    app.querySelectorAll('[data-card]').forEach(button=>button.onclick=()=>attempt(()=>cards({studentId:button.dataset.card})));
    document.getElementById('allCards')?.addEventListener('click',()=>attempt(()=>cards({classId:group.id})));
    app.querySelectorAll('[data-edit]').forEach(button=>button.onclick=()=>editStudent(button.dataset.edit));
  }
  function editStudent(id){const student=state.students.find(s=>s.id===id);app.innerHTML=`<section class="panel"><h1>管理 ${e(student.name)}</h1><form id="editStudent"><label for="studentName">学生称呼</label><input id="studentName" name="name" value="${e(student.name)}" required><label for="studentClass">当前班级</label><select id="studentClass" name="classId">${state.classes.map(c=>`<option value="${e(c.id)}" ${c.id===student.classId?'selected':''}>${e(c.name)}</option>`).join('')}</select><label for="studentActive">学习状态</label><select id="studentActive" name="active"><option value="true" ${student.active?'selected':''}>可学习</option><option value="false" ${student.active?'':'selected'}>已停用</option></select><button class="primary">保存学生信息</button></form><div class="actions"><button id="renew">重发学习卡</button><button id="back">返回班级</button></div><p role="status"></p></section>`;
    document.getElementById('back').onclick=()=>attempt(()=>loadAdmin());
    document.getElementById('editStudent').onsubmit=event=>{event.preventDefault();attempt(async()=>{const form=Object.fromEntries(new FormData(event.target));await api('admin/students',{...form,id,active:form.active==='true'});await loadAdmin(form.classId);status('学生信息已保存');});};
    document.getElementById('renew').onclick=()=>{const button=document.getElementById('renew');button.textContent='确认重发，旧卡将失效';button.onclick=()=>attempt(()=>cards({studentId:id,renew:true}));};
  }
  async function cards(selection){const result=await api('admin/cards',selection);app.innerHTML=`<div class="toolbar no-print"><h1>个人学习卡</h1><div class="actions"><button class="primary" id="printCards">打印学习卡</button><button id="back">返回班级</button></div></div><div class="cards">${result.cards.map(c=>`<article class="learning-card"><strong>灿然英语工作室</strong><h2>${e(c.name)}</h2><p>${e(c.className)}</p>${c.svg}<div class="learning-code">${e(c.code.match(/.{1,4}/g).join('-'))}</div><p class="muted">扫码或打开网站输入学习码</p></article>`).join('')}</div><p role="status"></p>`;document.getElementById('printCards').onclick=()=>print();document.getElementById('back').onclick=()=>attempt(()=>loadAdmin());}
  async function start(){
    if(adminMode){try{await loadAdmin();}catch(error){login(true,error.status===401?'':error.message);}return;}
    const card=new URLSearchParams(location.hash.slice(1)).get('card');
    if(card){history.replaceState(null,'',location.pathname+location.search);try{await api('login',{code:card});changed();}catch(error){login(false,error.message);return;}}
    await home();
  }
  channel?.addEventListener('message',()=>{if(!adminMode)location.reload();});
  start().catch(error=>login(adminMode,error.message));
})();
