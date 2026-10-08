(function () {
  'use strict';
  const app = document.getElementById('app'), adminMode = location.pathname.startsWith('/lesson/admin');
  const preview = new URLSearchParams(location.search).get('preview');
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel('canran-lesson-identity') : null;
  let state, currentClass, selectedStudents = new Set();
  async function api(endpoint, value, timeoutMs = 15000) {
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),timeoutMs);
    try{const response = await fetch('/lesson/api/' + endpoint, { signal:controller.signal,cache:'no-store', ...(value === undefined ? {} : { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(value) }) });
    const result = await response.json(); if (!response.ok) { if(adminMode && state && response.status===401 && endpoint!=='admin/login'){state=null;document.querySelectorAll('.teacher-dialog,.admin-save-dialog').forEach(d=>d.close());login(true,'登录已失效，请重新登录；若账号被禁用，请联系管理员。');} throw Object.assign(new Error(result.error), { status:response.status }); } return result;}finally{clearTimeout(timeout);}
  }
  async function worker() { try {
    const api = navigator.serviceWorker;
    const reg = await api?.register('/lesson/core/subpath-worker.js', {scope:'/lesson/',updateViaCache:'none'}); await reg?.update();
    // publicFile substitutes the deployment base; only the new root retires the old scope.
    if (api && '/lesson/' === '/') for (const old of await api.getRegistrations()) {
      if (/^\/lesson\/$/.test(new URL(old.scope).pathname)) await old.update();
    }
  } catch {} }
  worker();
  function changed() { channel?.postMessage('changed'); navigator.serviceWorker?.controller?.postMessage({type:'identity:changed'}); }
  function status(message) { const target=app.querySelector('[role=status]'); if(target)target.textContent=message; }
  async function attempt(action) { try { await action(); } catch(error) { status(error.message || '暂时无法连接，请重试'); } }
  const logo='<img class="hero-logo" src="/lesson/assets/brand/starflower.png" alt="">';
  function login(admin = false, message = '') {
    app.innerHTML=`<section class="login panel">${logo}<h1>${admin?'班级管理':'开始你的小冒险'}</h1><form id="loginForm" method="post">${admin?'<label for="username">管理员账号或老师工号</label><input id="username" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required><label for="password">管理员密码 / 老师密码</label><input id="password" name="password" type="password" autocomplete="current-password" required>':'<label for="studentNumber">学号</label><input id="studentNumber" name="studentNumber" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="例如 d00000001" maxlength="32" required><label for="password">密码</label><input id="password" name="password" type="password" autocomplete="current-password" maxlength="128" required>'}<button class="primary">${admin?'登录管理页':'进入我的课程'}</button><p role="status" aria-live="polite">${e(message)}</p></form>${admin?'<a href="/lesson/">返回学生入口</a>':'<button class="compact" id="forgot">忘记学号或密码</button><p class="muted">第一次登录，使用老师发放的一次性初始密码。</p><a class="muted" href="/lesson/admin/">老师管理入口</a>'}</section>`;
    document.getElementById('forgot')?.addEventListener('click',()=>status('请联系老师：学号可以查回，密码可以重置，学习成果会保留。'));
    document.getElementById('loginForm').onsubmit=event=>{event.preventDefault();attempt(async()=>{
      const form=new FormData(event.target);const button=event.target.querySelector('button');button.disabled=true;
      try {await api(admin?'admin/login':'login',Object.fromEntries(form));if(admin)await loadAdmin();else{changed();await home();}}finally{button.disabled=false;}
    });};
  }
  function passwordForm(who, required) {
    app.innerHTML=`<section class="login panel">${logo}<h1>${required?'设置你的新密码':'修改密码'}</h1><p>${e(who.student.name)} · <span class="student-number">${e(who.student.studentNumber)}</span></p><p class="muted">${required?'初始密码已使用，请在 15 分钟内设置新密码。关闭页面后可在原浏览器继续；超时或切换学生后，请联系老师重置。':''}使用 8–64 位字符，包含字母和数字。</p><form id="passwordForm" method="post">${required?'':'<label for="currentPassword">当前密码</label><input id="currentPassword" name="currentPassword" type="password" autocomplete="current-password" maxlength="128" required>'}<label for="newPassword">新密码</label><input id="newPassword" name="password" type="password" autocomplete="new-password" minlength="8" maxlength="64" required><label for="confirmPassword">再输一次新密码</label><input id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="64" required><button class="primary">${required?'保存新密码，开始学习':'保存新密码'}</button><p role="status" aria-live="polite"></p></form><button id="cancelPassword" class="compact">${required?'切换学生':'返回课程'}</button></section>`;
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
    if(location.pathname.startsWith('/lesson/')&&/^unit\d+-\d+\//.test(location.pathname.slice('/lesson/'.length))){location.reload();return;}
    const waiting=who.preview?0:await syncPending(who.student.id);
    if(!who.preview)who=await api('me');
    app.innerHTML=`<section class="login panel">${logo}<h1>灿然英语工作室</h1><p role="status">正在准备画面…</p></section>`;
    // Prepare the whole directory before revealing any of its illustrations.
    try {
      const fontLink = document.getElementById('courseFonts') || Object.assign(document.createElement('link'), {id:'courseFonts', rel:'stylesheet', href:'/lesson/assets/fonts/fonts.css'});
      if (!fontLink.isConnected) await new Promise((resolve,reject)=>{fontLink.onload=resolve;fontLink.onerror=()=>{fontLink.remove();reject(Error('字体尚未就绪'));};document.head.append(fontLink);});
      await Promise.all([document.fonts.load('600 20px "Baloo 2"'),document.fonts.load('24px "ZCOOL KuaiLe"'),...new Set(who.courses.flatMap(c=>c.artwork?.length?c.artwork:[c.image]).filter(Boolean))].map(value=>typeof value==='string'?new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>image.decode().then(resolve,reject);image.onerror=reject;image.src=value;}):value));
    } catch {app.innerHTML='<section class="login panel"><h1>画面还没准备好</h1><button id="retry">再试一次</button></section>';document.getElementById('retry').onclick=home;return;}
    const banners=who.courses.map(c=>{
      const pictures=c.artwork?.length?c.artwork:[c.image];
      const img=(src,cls='')=>`<img class="${cls}" src="${e(src)}" alt="">`;
      const art=pictures.length===5?img(pictures[0],'actor')+`<div class="food-cards">${pictures.slice(1,4).map(src=>img(src)).join('')}</div>`+img(pictures[4],'actor'):pictures.map(src=>img(src,'featured-scene')).join('');
      const action=c.stars?'继续学习':'开始学习';
      return `<section class="featured-course course" data-unit="${e(c.id)}" aria-labelledby="${e(c.id)}-title"><div class="featured-copy"><p class="lesson-label">${e(c.label)}</p><h2 id="${e(c.id)}-title">${e(c.title)}</h2><p class="course-intro">${e(c.intro)}</p>${c.stars?`<p class="resume-location">★ ${c.stars} / ${c.maxStars}</p>`:''}<a class="primary-button" aria-label="${action}：${e(c.title)}" href="/lesson/${e(c.id)}/${preview?'?preview='+encodeURIComponent(preview):''}#learn/${e(c.next||'words')}">${action}</a></div><div class="featured-art" aria-hidden="true">${art}</div></section>`;
    }).join('');
    app.innerHTML=`<div class="toolbar"><div><p class="muted">${e(who.className)}${who.preview?' · 预览不记录成绩':' · <span class="student-number">'+e(who.student.studentNumber)+'</span>'}</p><h1>${e(who.student.name)}的课程</h1></div>${who.preview?'<a class="button compact" href="/lesson/admin/">返回班级管理</a>':'<div class="actions"><button class="compact" id="changePassword">修改密码</button><button class="compact" id="logout">切换学生</button></div>'}</div><div class="course-directory">${banners}</div>${who.courses.length?'':'<section class="panel empty"><h2>老师还没开放课程</h2><p>开课后，再回来看看吧。</p><button id="refresh">刷新课程</button></section>'}<p role="status"></p><details class="panel" style="margin-top:28px"><summary>本机旧记录</summary><p class="muted">这些记录来自使用学生账号之前，不计入当前学生。</p><ul id="legacy"></ul></details>`;
    document.getElementById('changePassword')?.addEventListener('click',()=>passwordForm(who,false));
    if(waiting)status('还有学习成果保存在本机，联网后将继续同步。');
    document.getElementById('logout')?.addEventListener('click',()=>attempt(async()=>{await api('logout',{});changed();location.replace('/lesson/');}));
    document.getElementById('refresh')?.addEventListener('click',home);
    const list=document.getElementById('legacy');let found=false;
    for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!/^canran:(?:lesson:)?(?:unit\d+-\d+:learning|l\d+:progress|soundmark:progress)/.test(key))continue;try{const value=JSON.parse(localStorage.getItem(key));const item=document.createElement('li');const unit=key.match(/unit\d+-\d+|l\d+/)?.[0];item.textContent=unit+' · '+(value.activity?.unitCompleted?Object.keys(value.activity.unitCompleted).length+' 项活动完成':Object.values(value.ratings||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+' 颗星');list.append(item);found=true;}catch{}}
    if(!found)list.textContent='这台设备没有旧记录。';
  }
  async function loadAdmin(selected=currentClass) {
    state=await api('admin/state');currentClass=selected==='all'||state.classes.some(c=>c.id===selected)?selected:undefined;
    if(state.identity?.mustChangePassword){window.CanranAdminTeachers.password(teacherConfig(),state.identity,true);return;}
    if(location.hash.startsWith('#learning'))await openLearning();else renderAdmin();
  }
  const teacherConfig=()=>({app,api,back:async selected=>{history.replaceState(null,'',location.pathname+location.search);await loadAdmin(selected);},saved:showSavedDialog,logout:async()=>{await api('logout',{admin:true});state=null;changed();login(true);}});
  async function openLearning(studentId) {
    return window.CanranAdminLearning.open({app,api,classes:state.classes,courses:state.courses,role:state.identity?.role,classId:currentClass==='all'?'':currentClass||'',studentId,back:()=>{history.replaceState(null,'',location.pathname+location.search);renderAdmin();}});
  }
  function studentRows(students) {
    return students.map(s=>`<div class="student-row" data-student="${e(s.id)}"><label class="student-select"><input type="checkbox" data-select="${e(s.id)}" aria-label="选择 ${e(s.name)} ${e(s.studentNumber)}"><span><strong>${e(s.name)}</strong><span class="student-number">${e(s.studentNumber)}</span><span class="muted"><span data-class-name="${e(s.classId)}">${e(state.classes.find(c=>c.id===s.classId)?.name)}</span> · ${s.active?'可学习':'已停用'} · ${s.mustChangePassword?'待设置密码':'已设置密码'}</span></span></label><div class="actions"><button class="compact" data-learning="${e(s.id)}">查看学习进度</button><button class="compact" data-account="${e(s.id)}">查看账号</button><button class="compact" data-edit="${e(s.id)}">管理学生</button></div></div>`).join('');
  }
  function studentList(students) {
    return `<div class="student-list"><div class="selection-toolbar"><label class="select-all"><input type="checkbox" data-select-all ${students.length?'':'disabled'}>全选当前列表（${students.length} 人）</label><span class="selection-count" aria-live="polite">已选 0 人</span><div class="actions"><button class="compact" data-reset-selected disabled>重置所选密码</button><button class="compact" data-print-selected disabled>打印所选账号</button></div></div>${studentRows(students)||'<p class="muted">暂无学生。</p>'}</div>`;
  }
  function updateSelection() {
    app.querySelectorAll('[data-select]').forEach(input=>{input.checked=selectedStudents.has(input.dataset.select);});
    app.querySelectorAll('.student-list').forEach(list=>{
      const inputs=[...list.querySelectorAll('[data-select]')],count=inputs.filter(input=>input.checked).length,all=list.querySelector('[data-select-all]');
      all.checked=inputs.length>0&&count===inputs.length;all.indeterminate=count>0&&count<inputs.length;
      list.querySelector('.selection-count').textContent=`已选 ${count} 人`;
      list.querySelectorAll('[data-reset-selected],[data-print-selected]').forEach(button=>{button.disabled=!count;});
    });
  }
  function bindStudents() {
    app.querySelectorAll('[data-learning]').forEach(button=>button.onclick=()=>attempt(()=>openLearning(button.dataset.learning)));
    app.querySelectorAll('[data-account]').forEach(button=>button.onclick=()=>attempt(()=>accounts({studentId:button.dataset.account})));
    app.querySelectorAll('[data-edit]').forEach(button=>button.onclick=()=>editStudent(button.dataset.edit));
    app.querySelectorAll('[data-select]').forEach(input=>input.onchange=()=>{if(input.checked)selectedStudents.add(input.dataset.select);else selectedStudents.delete(input.dataset.select);updateSelection();});
    app.querySelectorAll('[data-select-all]').forEach(input=>input.onchange=()=>{input.closest('.student-list').querySelectorAll('[data-select]').forEach(row=>{if(input.checked)selectedStudents.add(row.dataset.select);else selectedStudents.delete(row.dataset.select);});updateSelection();});
    app.querySelectorAll('[data-reset-selected]').forEach(button=>button.onclick=()=>batchResetForm([...selectedStudents]));
    app.querySelectorAll('[data-print-selected]').forEach(button=>button.onclick=()=>attempt(()=>accounts({studentIds:[...selectedStudents]})));
    updateSelection();
  }
  function renderAdmin(){
    selectedStudents.clear();
    const group=state.classes.find(c=>c.id===currentClass),isAdmin=state.identity?.role==='admin';
    app.innerHTML=`<div class="toolbar"><div><p class="muted">灿然英语工作室</p><h1>班级管理</h1>${!isAdmin?`<p class="staff-identity">${e(state.identity.name)} · <span class="student-number">${e(state.identity.teacherNumber)}</span></p>`:''}</div><div class="actions">${isAdmin?'<button id="openTeachers" class="compact">老师管理</button>':'<button id="teacherChangePassword" class="compact">修改密码</button>'}<button id="openLearning" class="primary">学习进度</button><button id="adminLogout" class="compact">退出管理</button></div></div><div class="stack"><section class="panel"><h2>我的班级</h2><div class="tabs">${state.classes.map(c=>`<button class="compact" data-class="${e(c.id)}" aria-label="管理 ${e(c.name)}" aria-current="${c.id===currentClass}">${e(c.name)}</button>`).join('')}</div>${isAdmin?'<form id="newClass"><label for="className">新班级名称</label><input id="className" name="name" maxlength="60" required><button>创建班级</button></form>':state.classes.length?'':'<p>尚未分配班级，请联系管理员。</p><button id="refreshClasses" class="compact">刷新班级</button>'}</section><section class="panel"><label for="studentSearch">查找学生（姓名或学号）</label><input id="studentSearch" type="search" placeholder="${isAdmin?'在所有班级中查找':'在负责的班级中查找'}" autocomplete="off"><div id="searchResults"></div></section>${group?`<section class="panel"><div class="toolbar"><h2><span data-class-name="${e(group.id)}">${e(group.name)}</span> · 班级设置</h2><a class="button compact" href="/lesson/?preview=${e(group.id)}">预览这个班</a></div><div class="class-teachers"><p>负责老师：${(state.classTeachers?.[group.id]||[]).map(t=>e(t.name)+(t.active?'':'（已禁用）')).join('、')||'尚未分配'}</p>${isAdmin?'<button class="compact" id="assignTeachers">分配老师</button>':''}</div><form id="renameClass"><label for="editClassName">班级名称</label><div class="class-name-fields"><input id="editClassName" name="name" value="${e(group.name)}" maxlength="60" required><button type="submit" class="compact">保存班级名称</button></div><p role="alert" hidden></p></form><form id="courses"><h3 class="class-courses-title">开放课程</h3><div class="course-selection-toolbar"><button type="button" id="toggleAllCourses" class="compact">全选课程</button><span id="courseSelectionCount" aria-live="polite"></span></div><div class="check-grid">${state.courses.map(c=>`<label><input type="checkbox" name="course" value="${e(c.id)}" ${group.courses.includes(c.id)?'checked':''}>${e(c.label)} ${e(c.title)}</label>`).join('')}</div><button type="submit" class="primary">保存开放课程</button><p role="alert" hidden></p></form></section><section class="panel" id="classStudents"><div class="toolbar"><h2>班级学生</h2><button id="allAccounts" class="compact">打印全班账号</button></div><form id="newStudents"><label for="names">学生姓名或课堂称呼，每行一位</label><textarea id="names" name="names" rows="3" required></textarea><button>核对姓名拼音</button></form><div>${studentRows(state.students.filter(s=>s.classId===group.id))}</div></section>`:''}<p role="status" aria-live="polite"></p></div>`;
    app.querySelectorAll('[data-class]').forEach(button=>button.onclick=()=>{currentClass=button.dataset.class;renderAdmin();});
    const allStudentsButton=document.createElement('button');allStudentsButton.className='compact';allStudentsButton.textContent='所有学生';allStudentsButton.setAttribute('aria-current',String(currentClass==='all'));allStudentsButton.onclick=()=>{currentClass='all';renderAdmin();};app.querySelector('.tabs').prepend(allStudentsButton);
    if(currentClass==='all'){
      const section=document.createElement('section');section.className='panel';section.id='classStudents';section.innerHTML='<h2>所有班级的学生</h2>'+studentList(state.students);app.querySelector('.stack').insertBefore(section,app.querySelector('.stack > [role=status]'));
    }else if(group){
      const list=document.getElementById('classStudents').lastElementChild;list.innerHTML=studentList(state.students.filter(s=>s.classId===group.id));
    }
    document.getElementById('studentSearch').oninput=event=>{
      const query=event.target.value.trim().toLowerCase(),target=document.getElementById('searchResults');
      selectedStudents.clear();
      document.getElementById('classStudents')?.toggleAttribute('hidden',!!query);
      target.innerHTML=query?studentList(state.students.filter(s=>s.name.toLowerCase().includes(query)||s.studentNumber.includes(query))):'';bindStudents();
    };
    document.getElementById('openLearning').onclick=()=>attempt(()=>openLearning());
    document.getElementById('adminLogout').onclick=()=>attempt(teacherConfig().logout);
    document.getElementById('openTeachers')?.addEventListener('click',()=>attempt(()=>window.CanranAdminTeachers.open(teacherConfig())));
    document.getElementById('teacherChangePassword')?.addEventListener('click',()=>window.CanranAdminTeachers.password(teacherConfig(),state.identity,false));
    document.getElementById('assignTeachers')?.addEventListener('click',event=>attempt(()=>window.CanranAdminTeachers.assign(teacherConfig(),group,event.currentTarget)));
    document.getElementById('refreshClasses')?.addEventListener('click',()=>attempt(()=>loadAdmin()));
    document.getElementById('newClass')?.addEventListener('submit',event=>{event.preventDefault();attempt(async()=>{const button=event.target.querySelector('button');button.disabled=true;try{const created=await api('admin/classes',{name:new FormData(event.target).get('name')});await loadAdmin(created.id);status('班级已创建');}finally{button.disabled=false;}});});
    document.getElementById('renameClass')?.addEventListener('submit',event=>{
      event.preventDefault();
      if(event.currentTarget.querySelector('[type=submit]').disabled)return;
      saveClassChanges(event.currentTarget,group,{name:new FormData(event.currentTarget).get('name').trim()});
    });
    const renameForm=document.getElementById('renameClass');if(renameForm)renameForm.dataset.expectedName=group.name;
    const courseForm=document.getElementById('courses');
    if(courseForm){
      courseForm.dataset.expectedCourses=JSON.stringify(group.courses);
      const boxes=[...courseForm.querySelectorAll('input[name=course]')],toggle=document.getElementById('toggleAllCourses');
      const updateCourses=()=>{
        const count=boxes.filter(box=>box.checked).length;
        toggle.textContent=count===boxes.length?'取消全选':'全选课程';
        document.getElementById('courseSelectionCount').textContent=`已选 ${count} / ${boxes.length} 门课程`;
      };
      toggle.onclick=()=>{const checked=boxes.some(box=>!box.checked);boxes.forEach(box=>{box.checked=checked;});updateCourses();};
      courseForm.addEventListener('change',updateCourses);updateCourses();
      courseForm.addEventListener('submit',event=>{
        event.preventDefault();
        saveClassChanges(courseForm,group,{courses:new FormData(courseForm).getAll('course')});
      });
    }
    document.getElementById('newStudents')?.addEventListener('submit',event=>{event.preventDefault();attempt(async()=>{const draft=await api('admin/student-preview',{names:new FormData(event.target).get('names')});enrolmentForm(draft.students,group.id);});});
    document.getElementById('allAccounts')?.addEventListener('click',()=>attempt(()=>accounts({classId:group.id})));
    bindStudents();
  }
  function showSavedDialog(message,trigger) {
    document.querySelector('.admin-save-dialog')?.close();
    const dialog=document.createElement('dialog');dialog.className='admin-save-dialog';
    dialog.setAttribute('aria-labelledby','adminSaveTitle');dialog.setAttribute('aria-describedby','adminSaveMessage');
    dialog.innerHTML='<span class="saved-mark" aria-hidden="true">✓</span><h2 id="adminSaveTitle">保存成功</h2><p id="adminSaveMessage"></p><form method="dialog"><button class="primary" autofocus>知道了</button></form>';
    dialog.querySelector('p').textContent=message;
    dialog.addEventListener('close',()=>{dialog.remove();if(trigger?.isConnected)trigger.focus();},{once:true});
    document.body.append(dialog);dialog.showModal();
  }
  async function saveClassChanges(form,group,changes) {
    const button=form.querySelector('button[type=submit]');if(button.disabled)return;
    const controls=[...form.querySelectorAll('input,button')].map(element=>({element,disabled:element.disabled}));
    const label=button.textContent,errorMessage=form.querySelector('[role=alert]');
    errorMessage.hidden=true;errorMessage.textContent='';status('');
    controls.forEach(({element})=>{element.disabled=true;});button.textContent='正在保存…';
    let message;
    try{
      const result=await api('admin/classes',{id:group.id,...changes,...(changes.name!==undefined?{expectedName:form.dataset.expectedName}:{expectedCourses:JSON.parse(form.dataset.expectedCourses)})}),saved=result.class;
      Object.assign(state.classes.find(c=>c.id===group.id)||group,saved);
      app.querySelectorAll('[data-class]').forEach(tab=>{if(tab.dataset.class===saved.id){tab.textContent=saved.name;tab.setAttribute('aria-label','管理 '+saved.name);}});
      app.querySelectorAll('[data-class-name]').forEach(label=>{if(label.dataset.className===saved.id)label.textContent=saved.name;});
      if(changes.name!==undefined){
        form.dataset.expectedName=saved.name;form.querySelector('[name=name]').value=saved.name;message=`班级名称已保存：${saved.name}。`;
      }else {form.dataset.expectedCourses=JSON.stringify(saved.courses);message=`「${saved.name}」的开放课程已保存，已开放 ${saved.courses.length} 门课程。`;}
      if(form.isConnected)status(message);
    }catch(error){
      if(form.isConnected){errorMessage.textContent=error.message||'保存未成功，请重试。';errorMessage.hidden=false;}
    }finally{
      controls.forEach(({element,disabled})=>{element.disabled=disabled;});button.textContent=label;
    }
    if(message&&form.isConnected)showSavedDialog(message,button);
  }
  function enrolmentForm(students,classId) {
    app.innerHTML=`<section class="panel"><h1>核对姓名拼音</h1><p>拼音用于确认姓名和学号首字母，ü 用 v。保存后分配唯一学号，初始密码为已核对的姓名拼音 + 3 位随机数字。</p><form id="enrolment">${students.map((s,i)=>`<div class="spelling-row"><strong>${i+1}. ${e(s.name)}</strong><label for="spelling${i}">第 ${i+1} 位学生的姓名拼音</label><input id="spelling${i}" name="pinyin${i}" value="${e(s.pinyin)}" pattern="[a-z][a-z0-9]{0,119}" maxlength="120" autocomplete="off" autocapitalize="none" spellcheck="false" required></div>`).join('')}<div class="actions"><button type="button" id="back">返回修改姓名</button><button class="primary">确认添加学生</button></div><p role="status" aria-live="polite"></p></form></section>`;
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
    app.innerHTML=`<section class="login panel"><h1>重置 ${e(student.name)}的密码</h1><p class="student-number">${e(student.studentNumber)}</p><p>新密码为姓名拼音 + 3 位随机数字，7 天内可登录一次，随后须设置新密码。原密码和旧登录失效，学号与学习成果保留。</p><form id="resetForm" method="post"><label for="resetPinyin">姓名拼音（核对学生）</label><input id="resetPinyin" name="pinyin" value="${e(student.loginPinyin)}" pattern="[a-z][a-z0-9]{0,119}" maxlength="120" autocapitalize="none" spellcheck="false" required><button class="primary">确认重置密码</button><p role="status"></p></form><button id="back" class="compact">取消</button></section>`;
    document.getElementById('back').onclick=()=>editStudent(student.id);
    document.getElementById('resetForm').onsubmit=event=>{event.preventDefault();attempt(async()=>{const button=event.target.querySelector('button');button.disabled=true;try{await api('admin/reset-password',{studentId:student.id,pinyin:new FormData(event.target).get('pinyin')});await accounts({studentId:student.id});status('密码已重置，学生下次登录需要设置新密码');}finally{button.disabled=false;}});};
  }
  function batchResetForm(ids) {
    const students=state.students.filter(s=>ids.includes(s.id));if(!students.length)return;
    app.innerHTML=`<section class="panel"><h1>重置 ${students.length} 位学生的密码</h1><p>每位学生的新密码为已核对的姓名拼音 + 3 位随机数字，7 天内可登录一次，随后须设置新密码。原密码和旧登录将失效，学号、班级及学习成果保留。</p><p>请核对以下名单${students.some(s=>!s.active)?'（包含已停用学生，重置后仍保持停用）':''}：</p><ul class="reset-roster">${students.map(s=>`<li><strong>${e(s.name)}</strong> · ${e(state.classes.find(c=>c.id===s.classId)?.name)} · <span class="student-number">${e(s.studentNumber)}</span></li>`).join('')}</ul><div class="actions"><button id="cancelBatchReset">取消</button><button id="confirmBatchReset" class="primary">确认重置 ${students.length} 人密码</button></div><p role="status" aria-live="polite"></p></section>`;
    document.getElementById('cancelBatchReset').onclick=renderAdmin;
    document.getElementById('confirmBatchReset').onclick=()=>attempt(async()=>{
      const buttons=[...app.querySelectorAll('button')];buttons.forEach(button=>{button.disabled=true;});status('正在重置，请稍候…');
      try{
        const result=await api('admin/reset-passwords',{studentIds:ids},120000);
        app.innerHTML=`<section class="panel"><h1>已重置 ${result.count} 位学生的密码</h1><button id="viewResetAccounts">查看新的账号单</button><button id="back">返回班级</button><p role="status" aria-live="polite"></p></section>`;
        document.getElementById('viewResetAccounts').onclick=()=>attempt(()=>accounts({studentIds:ids}));document.getElementById('back').onclick=()=>attempt(()=>loadAdmin());
        try{await accounts({studentIds:ids});status(`已重置 ${result.count} 位学生的密码，可以打印新的账号单。`);}catch{status('密码已经重置，账号单暂时未加载，请点击“查看新的账号单”重试。');}
      }
      finally{buttons.forEach(button=>{button.disabled=false;});}
    });
  }
  async function accounts(selection){
    const result=await api('admin/accounts',selection);
    // Give unusually long names/passwords more rows without shrinking credentials.
    const perPage=result.accounts.some(c=>c.name.length>28||(c.className||'').length>40||(c.initialPassword||'').length>64)?4:result.accounts.some(c=>c.name.length>14||(c.className||'').length>22||(c.initialPassword||'').length>32)?6:10;
    const card=c=>`<article class="learning-card"><header class="account-heading"><strong>灿然英语工作室</strong><h2>${e(c.name)}</h2><p>${e(c.className)}</p></header><div class="account-field"><span>学号</span><div class="student-number account-number">${e(c.studentNumber)}</div></div>${c.initialPassword?`<div class="account-field"><span>初始密码</span><div class="initial-password">${e(c.initialPassword)}</div></div><p class="initial-expiry">有效至 ${e(new Date(c.initialPasswordExpiresAt).toLocaleString('zh-CN', {hour12:false}))}</p><p class="account-instruction">仅可登录一次，请随后完成改密。</p>`:`<p class="account-instruction">${c.initialPasswordState==='used'?'初始密码已使用；若未完成改密，请重置后重新领取':c.initialPasswordState==='expired'?'初始密码已过期，请重置后重新领取':c.mustChangePassword?'请先核对拼音并重置密码':'已设置密码，请使用自己的密码'}</p>`}<p class="account-url">${e(c.url)}</p><p class="account-help">密码区分大小写 · 忘记密码请联系老师</p></article>`;
    const sheets=[];for(let i=0;i<result.accounts.length;i+=perPage)sheets.push(`<section class="account-sheet" style="--account-rows:${perPage/2}">${result.accounts.slice(i,i+perPage).map(card).join('')}</section>`);
    app.innerHTML=`<div class="toolbar no-print"><div><h1>学生账号</h1><p class="muted">A4 纵向 · 每页最多 ${perPage} 张 · 共 ${result.accounts.length} 人，${sheets.length} 页</p></div><div class="actions"><button class="primary" id="printAccounts">打印账号</button><button id="back">返回班级</button></div></div><p role="status" class="no-print" aria-live="polite"></p><div class="cards account-cards">${sheets.join('')}</div>`;
    const printButton=document.getElementById('printAccounts');
    printButton.onclick=()=>attempt(async()=>{
      printButton.disabled=true;status('正在准备打印…');
      try{
        const fonts=await document.fonts.load('600 18px "Maple Mono NL"');if(!fonts.length)throw Error('账号字体尚未加载，请刷新后重试打印');await document.fonts.ready;
        // Some embedded browsers expose print() but silently ignore the request.
        status('如未出现打印窗口，请在 Chrome 或 Safari 中打开本页，再点“打印账号”。');
        window.print();
      }finally{printButton.disabled=false;}
    });
    document.getElementById('back').onclick=()=>attempt(()=>loadAdmin());
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
