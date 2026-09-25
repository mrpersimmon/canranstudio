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
    app.innerHTML=`<section class="login panel">${logo}<h1>${admin?'班级管理':'开始你的小冒险'}</h1><form id="loginForm" method="post">${admin?'<label for="username">管理员账号</label><input id="username" name="username" autocomplete="username" required><label for="password">管理员密码</label><input id="password" name="password" type="password" autocomplete="current-password" required>':'<label for="studentNumber">学号</label><input id="studentNumber" name="studentNumber" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="例如 d00000001" maxlength="32" required><label for="password">密码</label><input id="password" name="password" type="password" autocomplete="current-password" maxlength="120" required>'}<button class="primary">${admin?'登录管理页':'进入我的课程'}</button><p role="status" aria-live="polite">${e(message)}</p></form>${admin?'<a href="/lesson/">返回学生入口</a>':'<button class="compact" id="forgot">忘记学号或密码</button><p class="muted">第一次登录，使用老师确认的姓名拼音密码。</p><a class="muted" href="/lesson/admin/">老师管理入口</a>'}</section>`;
    document.getElementById('forgot')?.addEventListener('click',()=>status('请联系老师：学号可以查回，密码可以重置，学习成果会保留。'));
    document.getElementById('loginForm').onsubmit=event=>{event.preventDefault();attempt(async()=>{
      const form=new FormData(event.target);const button=event.target.querySelector('button');button.disabled=true;
      try {await api(admin?'admin/login':'login',Object.fromEntries(form));if(admin)await loadAdmin();else{changed();await home();}}finally{button.disabled=false;}
    });};
  }
  function passwordForm(who, required) {
    app.innerHTML=`<section class="login panel">${logo}<h1>${required?'设置你的新密码':'修改密码'}</h1><p>${e(who.student.name)} · <span class="student-number">${e(who.student.studentNumber)}</span></p><p class="muted">${required?'第一次登录或老师重置后，需要设置新密码。':''}使用 8–64 位字符，包含字母和数字。</p><form id="passwordForm" method="post">${required?'':'<label for="currentPassword">当前密码</label><input id="currentPassword" name="currentPassword" type="password" autocomplete="current-password" maxlength="120" required>'}<label for="newPassword">新密码</label><input id="newPassword" name="password" type="password" autocomplete="new-password" minlength="8" maxlength="64" required><label for="confirmPassword">再输一次新密码</label><input id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="64" required><button class="primary">${required?'保存新密码，开始学习':'保存新密码'}</button><p role="status" aria-live="polite"></p></form><button id="cancelPassword" class="compact">${required?'切换学生':'返回课程'}</button></section>`;
    document.getElementById('passwordForm').onsubmit=event=>{event.preventDefault();attempt(async()=>{
      const button=event.target.querySelector('button');button.disabled=true;
      try{await api('password',Object.fromEntries(new FormData(event.target)));changed();await home();}finally{button.disabled=false;}
    });};
    document.getElementById('cancelPassword').onclick=()=>attempt(async()=>{if(required){await api('logout',{});changed();}await home();});
  }
  async function syncPending(studentId){
    const prefix='canran:student:'+studentId+':';let remaining=0;
    const keys=Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).filter(k=>k.startsWith(prefix+'pending:'));
    for(const key of keys){try{const pending=JSON.parse(localStorage.getItem(key));if(pending.studentId!==studentId)continue;const result=await api('progress',pending);if(result.stale){localStorage.removeItem(prefix+'canran:lesson:'+pending.course+':learning:v1');localStorage.setItem(prefix+'generation:'+pending.course,String(result.generation));}localStorage.removeItem(key);}catch{remaining++;}}
    return remaining;
  }
  async function home() {
    let who;try{who=await api('me'+(preview?'?preview='+encodeURIComponent(preview):''));}catch(error){return login(false,error.status===401?'':error.message);}
    if(who.mustChangePassword)return passwordForm(who,true);
    if(/^\/lesson\/unit\d+-\d+\//.test(location.pathname)){location.reload();return;}
    const waiting=who.preview?0:await syncPending(who.student.id);
    if(!who.preview)who=await api('me');
    app.innerHTML=`<section class="login panel">${logo}<h1>灿然英语工作室</h1><p role="status">正在准备画面…</p></section>`;
    try{await Promise.all(who.courses.filter(c=>c.image).map(c=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>image.decode().then(resolve,reject);image.onerror=reject;image.src=c.image;})));}catch{app.innerHTML='<section class="login panel"><h1>画面还没准备好</h1><button id="retry">再试一次</button></section>';document.getElementById('retry').onclick=home;return;}
    app.innerHTML=`<div class="toolbar"><div><p class="muted">${e(who.className)}${who.preview?' · 预览不记录成绩':' · '+e(who.student.studentNumber)}</p><h1>${e(who.student.name)}的课程</h1></div>${who.preview?'<a class="button compact" href="/lesson/admin/">返回班级管理</a>':'<div class="actions"><button class="compact" id="changePassword">修改密码</button><button class="compact" id="logout">切换学生</button></div>'}</div><div class="grid">${who.courses.map(c=>`<a class="panel course" href="/lesson/${e(c.id)}/${preview?'?preview='+encodeURIComponent(preview):''}#learn/${e(c.next||'words')}">${c.image?`<img src="${e(c.image)}" alt="">`:''}<span><small>${e(c.label)}</small><strong>${e(c.title)}</strong><span>${c.stars?'★ '+c.stars+' / 15 · 继续学习':'开始学习'} →</span></span></a>`).join('')}</div>${who.courses.length?'':'<section class="panel empty"><h2>老师还没开放课程</h2><p>开课后，再回来看看吧。</p><button id="refresh">刷新课程</button></section>'}<p role="status"></p><details class="panel" style="margin-top:28px"><summary>本机旧记录</summary><p class="muted">这些记录来自使用学生账号之前，不计入当前学生。</p><ul id="legacy"></ul></details>`;
    document.getElementById('changePassword')?.addEventListener('click',()=>passwordForm(who,false));
    if(waiting)status('还有学习成果保存在本机，联网后将继续同步。');
    document.getElementById('logout')?.addEventListener('click',()=>attempt(async()=>{await api('logout',{});changed();location.replace('/lesson/');}));
    document.getElementById('refresh')?.addEventListener('click',home);
    const list=document.getElementById('legacy');let found=false;
    for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!/^canran:(?:lesson:)?(?:unit\d+-\d+:learning|l\d+:progress|soundmark:progress)/.test(key))continue;try{const value=JSON.parse(localStorage.getItem(key));const item=document.createElement('li');const unit=key.match(/unit\d+-\d+|l\d+/)?.[0];item.textContent=unit+' · '+(value.activity?.unitCompleted?Object.keys(value.activity.unitCompleted).length+' 项活动完成':Object.values(value.ratings||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+' 颗星');list.append(item);found=true;}catch{}}
    if(!found)list.textContent='这台设备没有旧记录。';
  }
  async function loadAdmin(selected=currentClass) { state=await api('admin/state');currentClass=selected;renderAdmin(); }
  function studentRows(students) {
    return students.map(s=>`<div class="student-row" data-student="${e(s.id)}"><div><strong>${e(s.name)}</strong><p><span class="student-number">${e(s.studentNumber)}</span></p><p class="muted">${e(state.classes.find(c=>c.id===s.classId)?.name)} · ${s.active?'可学习':'已停用'} · ${s.mustChangePassword?'待设置密码':'已设置密码'}</p></div><div class="actions"><button class="compact" data-account="${e(s.id)}">查看账号</button><button class="compact" data-edit="${e(s.id)}">管理学生</button></div></div>`).join('');
  }
  function bindStudents() {
    app.querySelectorAll('[data-account]').forEach(button=>button.onclick=()=>attempt(()=>accounts({studentId:button.dataset.account})));
    app.querySelectorAll('[data-edit]').forEach(button=>button.onclick=()=>editStudent(button.dataset.edit));
  }
  function renderAdmin(){
    const group=state.classes.find(c=>c.id===currentClass);
    app.innerHTML=`<div class="toolbar"><div><p class="muted">灿然英语工作室</p><h1>班级管理</h1></div><button id="adminLogout" class="compact">退出管理</button></div><div class="stack"><section class="panel"><h2>我的班级</h2><div class="tabs">${state.classes.map(c=>`<button class="compact" data-class="${e(c.id)}" aria-label="管理 ${e(c.name)}" aria-current="${c.id===currentClass}">${e(c.name)}</button>`).join('')}</div><form id="newClass"><label for="className">新班级名称</label><input id="className" name="name" maxlength="60" required><button>创建班级</button></form></section><section class="panel"><label for="studentSearch">查找学生（姓名或学号）</label><input id="studentSearch" type="search" placeholder="在所有班级中查找" autocomplete="off"><div id="searchResults"></div></section>${group?`<section class="panel"><div class="toolbar"><h2>${e(group.name)} · 开放课程</h2><a class="button compact" href="/lesson/?preview=${e(group.id)}">预览这个班</a></div><form id="courses"><label for="editClassName">班级名称</label><input id="editClassName" name="name" value="${e(group.name)}" maxlength="60" required><div class="check-grid">${state.courses.map(c=>`<label><input type="checkbox" name="course" value="${e(c.id)}" ${group.courses.includes(c.id)?'checked':''}>${e(c.label)} ${e(c.title)}</label>`).join('')}</div><button class="primary">保存开放课程</button></form></section><section class="panel" id="classStudents"><div class="toolbar"><h2>班级学生</h2><button id="allAccounts" class="compact">打印全班账号</button></div><form id="newStudents"><label for="names">学生姓名或课堂称呼，每行一位</label><textarea id="names" name="names" rows="3" required></textarea><button>核对姓名拼音</button></form><div>${studentRows(state.students.filter(s=>s.classId===group.id))}</div></section>`:''}<p role="status" aria-live="polite"></p></div>`;
    app.querySelectorAll('[data-class]').forEach(button=>button.onclick=()=>{currentClass=button.dataset.class;renderAdmin();});
    document.getElementById('studentSearch').oninput=event=>{
      const query=event.target.value.trim().toLowerCase(),target=document.getElementById('searchResults');
      document.getElementById('classStudents')?.toggleAttribute('hidden',!!query);
      target.innerHTML=query?(studentRows(state.students.filter(s=>s.name.toLowerCase().includes(query)||s.studentNumber.includes(query)))||'<p>没有找到学生，请换个姓名或学号。</p>'):'';bindStudents();
    };
    document.getElementById('adminLogout').onclick=()=>attempt(async()=>{await api('logout',{admin:true});login(true);});
    document.getElementById('newClass').onsubmit=event=>{event.preventDefault();attempt(async()=>{const button=event.target.querySelector('button');button.disabled=true;try{const created=await api('admin/classes',{name:new FormData(event.target).get('name')});await loadAdmin(created.id);status('班级已创建');}finally{button.disabled=false;}});};
    document.getElementById('courses')?.addEventListener('submit',event=>{event.preventDefault();attempt(async()=>{const form=new FormData(event.target);await api('admin/classes',{id:group.id,name:form.get('name'),courses:form.getAll('course')});group.name=form.get('name');group.courses=form.getAll('course');status('开放课程已保存');});});
    document.getElementById('newStudents')?.addEventListener('submit',event=>{event.preventDefault();attempt(async()=>{const draft=await api('admin/student-preview',{names:new FormData(event.target).get('names')});enrolmentForm(draft.students,group.id);});});
    document.getElementById('allAccounts')?.addEventListener('click',()=>attempt(()=>accounts({classId:group.id})));
    bindStudents();
  }
  function enrolmentForm(students,classId) {
    app.innerHTML=`<section class="panel"><h1>核对姓名拼音</h1><p>拼音用作初始密码。多音字请核对，ü 用 v。保存后分配唯一学号。</p><form id="enrolment">${students.map((s,i)=>`<div class="spelling-row"><strong>${i+1}. ${e(s.name)}</strong><label for="spelling${i}">第 ${i+1} 位学生的姓名拼音</label><input id="spelling${i}" name="pinyin${i}" value="${e(s.pinyin)}" pattern="[a-z][a-z0-9]{0,119}" maxlength="120" autocomplete="off" autocapitalize="none" spellcheck="false" required></div>`).join('')}<div class="actions"><button type="button" id="back">返回修改姓名</button><button class="primary">确认添加学生</button></div><p role="status" aria-live="polite"></p></form></section>`;
    document.getElementById('back').onclick=()=>{renderAdmin();document.getElementById('names').value=students.map(s=>s.name).join('\n');};
    document.getElementById('enrolment').onsubmit=event=>{event.preventDefault();attempt(async()=>{const button=event.target.querySelector('.primary');button.disabled=true;try{const form=new FormData(event.target);await api('admin/students',{classId,students:students.map((s,i)=>({name:s.name,pinyin:form.get('pinyin'+i)}))});await loadAdmin(classId);status('学生已添加，可以查看或打印账号');}finally{button.disabled=false;}});};
  }
  function editStudent(id){
    const student=state.students.find(s=>s.id===id);
    app.innerHTML=`<section class="panel"><h1>管理 ${e(student.name)}</h1><p>学号：<strong class="student-number">${e(student.studentNumber)}</strong></p><form id="editStudent"><label for="studentName">学生称呼</label><input id="studentName" name="name" value="${e(student.name)}" maxlength="60" required><label for="studentClass">当前班级</label><select id="studentClass" name="classId">${state.classes.map(c=>`<option value="${e(c.id)}" ${c.id===student.classId?'selected':''}>${e(c.name)}</option>`).join('')}</select><label for="studentActive">学习状态</label><select id="studentActive" name="active"><option value="true" ${student.active?'selected':''}>可学习</option><option value="false" ${student.active?'':'selected'}>已停用</option></select><button class="primary">保存学生信息</button></form><div class="actions"><button id="resetPassword">重置密码</button><button id="back">返回班级</button></div><p role="status"></p></section>`;
    document.getElementById('back').onclick=()=>attempt(()=>loadAdmin(student.classId));
    document.getElementById('editStudent').onsubmit=event=>{event.preventDefault();attempt(async()=>{const form=Object.fromEntries(new FormData(event.target));await api('admin/students',{...form,id,active:form.active==='true'});await loadAdmin(form.classId);status('学生信息已保存，学号和密码保持不变');});};
    document.getElementById('resetPassword').onclick=()=>resetPasswordForm(student);
  }
  function resetPasswordForm(student) {
    app.innerHTML=`<section class="login panel"><h1>重置 ${e(student.name)}的密码</h1><p class="student-number">${e(student.studentNumber)}</p><p>原密码与已登录状态会失效；学习成果保留。下次登录后需要设置新密码。</p><form id="resetForm" method="post"><label for="resetPinyin">姓名拼音（重置后的初始密码）</label><input id="resetPinyin" name="pinyin" value="${e(student.loginPinyin)}" pattern="[a-z][a-z0-9]{0,119}" maxlength="120" autocapitalize="none" spellcheck="false" required><button class="primary">确认重置密码</button><p role="status"></p></form><button id="back" class="compact">取消</button></section>`;
    document.getElementById('back').onclick=()=>editStudent(student.id);
    document.getElementById('resetForm').onsubmit=event=>{event.preventDefault();attempt(async()=>{const button=event.target.querySelector('button');button.disabled=true;try{await api('admin/reset-password',{studentId:student.id,pinyin:new FormData(event.target).get('pinyin')});await accounts({studentId:student.id});status('密码已重置，学生下次登录需要设置新密码');}finally{button.disabled=false;}});};
  }
  async function accounts(selection){
    const result=await api('admin/accounts',selection);
    app.innerHTML=`<div class="toolbar no-print"><h1>学生账号</h1><div class="actions"><button class="primary" id="printAccounts">打印账号</button><button id="back">返回班级</button></div></div><div class="cards">${result.accounts.map(c=>`<article class="learning-card"><strong>灿然英语工作室</strong><h2>${e(c.name)}</h2><p>${e(c.className)}</p><p>学号</p><div class="student-number account-number">${e(c.studentNumber)}</div>${c.initialPassword?`<p>初始密码</p><div class="initial-password">${e(c.initialPassword)}</div><p class="muted">首次登录后设置自己的新密码</p>`:`<p>${c.mustChangePassword?'请先核对拼音并重置密码':'已设置密码，请使用自己的密码'}</p>`}<p class="account-url">${e(c.url)}</p><p class="muted">忘记学号或密码，请联系老师。</p></article>`).join('')}</div><p role="status"></p>`;
    document.getElementById('printAccounts').onclick=()=>print();document.getElementById('back').onclick=()=>attempt(()=>loadAdmin());
  }
  async function start(){
    if(adminMode){try{await loadAdmin();}catch(error){login(true,error.status===401?'':error.message);}return;}
    const card=new URLSearchParams(location.hash.slice(1)).get('card');
    if(card){history.replaceState(null,'',location.pathname+location.search);login(false,'已改为学号和密码登录，请向老师领取账号。旧学习码不再使用。');return;}
    await home();
  }
  channel?.addEventListener('message',()=>{if(!adminMode)location.reload();});
  start().catch(error=>login(adminMode,error.message));
})();
