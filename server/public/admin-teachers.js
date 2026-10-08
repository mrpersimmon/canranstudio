(function () {
  'use strict';
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  function dialog(title, content, trigger) {
    const element = document.createElement('dialog'); element.className = 'teacher-dialog';
    element.setAttribute('aria-labelledby', 'teacherDialogTitle');
    element.innerHTML = `<div class="toolbar"><h2 id="teacherDialogTitle">${e(title)}</h2><button class="compact" type="button" data-close aria-label="关闭">×</button></div>${content}`;
    element.querySelector('[data-close]').onclick = () => element.close();
    element.addEventListener('close', () => { element.remove(); if (trigger?.isConnected) trigger.focus(); }, { once: true });
    document.body.append(element); element.showModal(); return element;
  }
  async function submit(form, action) {
    if (form.dataset.busy) return;
    form.dataset.busy = 'true';
    const controls = [...form.querySelectorAll('input,select,button')], error = form.querySelector('[role=alert]');
    error.textContent = ''; error.hidden = true; controls.forEach(c => c.disabled = true);
    try { await action(); } catch (problem) { error.textContent = problem.message || '保存未成功，请重试'; error.hidden = false; }
    finally { controls.forEach(c => c.disabled = false); delete form.dataset.busy; }
  }
  const selections = (classes, selected) => classes.length ? `<div class="teacher-class-choices">${classes.map(c => `<label><input type="checkbox" name="classId" value="${e(c.id)}" ${selected.includes(c.id) ? 'checked' : ''}><span>${e(c.name)}</span></label>`).join('')}</div>` : '<p class="muted">还没有班级，可先创建老师，稍后再分配。</p>';
  function account(config, result, trigger) {
    const { teacher: t, credential: c } = result;
    const message = c.initialPasswordState === 'set' ? '老师已设置自己的密码。如忘记密码，请重置。' : c.initialPasswordState === 'used' ? '初始密码已使用。若未完成改密，请重置后重新领取。' : '初始密码已过期，请重置后重新领取。';
    const view = dialog('老师账号', `<p>${e(t.name)}${t.active ? '' : ' · 已禁用'}</p><dl class="teacher-credential"><dt>工号</dt><dd class="student-number">${e(t.teacherNumber)}</dd>${c.initialPassword ? `<dt>初始密码</dt><dd class="initial-password">${e(c.initialPassword)}</dd>` : ''}</dl>${c.initialPassword ? `<p>有效至 ${e(new Date(c.initialPasswordExpiresAt).toLocaleString('zh-CN', { hour12: false }))}。仅可登录一次，随后须设置新密码。</p>` : `<p>${e(message)}</p>`}<p class="muted">管理入口：${e(location.origin + '/lesson/admin/')}</p><div class="actions"><button type="button" class="primary" data-done>知道了</button></div>`, trigger);
    view.querySelector('[data-done]').onclick = () => view.close();
  }
  function editor(config, data, teacher, trigger, refresh) {
    const creating = !teacher;
    const view = dialog(creating ? '新增老师' : '编辑老师', `<form id="teacherForm"><label for="teacherName">老师姓名</label><input id="teacherName" name="name" autofocus maxlength="60" value="${e(teacher?.name)}" required><div class="teacher-pinyin-label"><label for="teacherPinyin">姓名拼音（请核对）</label><button type="button" class="text-button" data-suggest>按姓名生成</button></div><input id="teacherPinyin" name="pinyin" value="${e(teacher?.loginPinyin)}" pattern="[a-z][a-z0-9]{0,119}" maxlength="120" autocomplete="off" autocapitalize="none" spellcheck="false" required><p class="muted">${creating ? '老师工号为拼音首字母＋1 开头的编号，由系统生成。初始密码为这里的拼音＋3 位随机数字。' : `工号 <span class="student-number">${e(teacher.teacherNumber)}</span> 保持不变。修改拼音只影响下次重置密码。`}</p><fieldset><legend>负责班级 · 可多选</legend>${selections(data.classes, teacher?.classIds || [])}</fieldset><div class="actions"><button class="primary" type="submit">${creating ? '创建老师' : '保存老师信息'}</button><button type="button" data-cancel>取消</button></div><p role="alert" hidden></p></form>`, trigger);
    const form = view.querySelector('form'), nameInput = form.elements.name, pinyinInput = form.elements.pinyin;
    let suggestedName = teacher?.name || '', suggestion = 0;
    const suggest = async () => {
      const name = nameInput.value.trim(), version = ++suggestion, original = pinyinInput.value;
      if (!name) return;
      try {
        const result = await config.api('admin/teacher-preview', { name });
        if (version === suggestion && nameInput.value.trim() === name && pinyinInput.value === original && form.isConnected && !form.dataset.busy) { pinyinInput.value = result.pinyin; suggestedName = name; }
      } catch (error) { form.querySelector('[role=alert]').hidden = false; form.querySelector('[role=alert]').textContent = error.message; }
    };
    form.querySelector('[data-suggest]').onclick = suggest;
    nameInput.addEventListener('blur', () => { if (creating && nameInput.value.trim() !== suggestedName) suggest(); });
    form.querySelector('[data-cancel]').onclick = () => view.close();
    form.onsubmit = event => {
      event.preventDefault(); const values = new FormData(form), body = { name: values.get('name').trim(), pinyin: values.get('pinyin').trim(), classIds: values.getAll('classId') };
      if (teacher) Object.assign(body, { id: teacher.id, revision: teacher.revision, active: teacher.active });
      submit(form, async () => {
        const result = await config.api('admin/teachers', body); view.close(); await refresh();
        if (creating) account(config, result, document.getElementById('newTeacher'));
        else config.saved('老师信息和负责班级已保存。', document.getElementById('newTeacher'));
      });
    };
  }
  function confirm(config, teacher, type, trigger, refresh) {
    const resetting = type === 'reset', enabling = !teacher.active;
    const title = resetting ? '重置老师密码' : enabling ? '启用老师' : '禁用老师';
    const view = dialog(title, `<p>${e(teacher.name)} · <span class="student-number">${e(teacher.teacherNumber)}</span></p><p>${resetting ? '生成姓名拼音＋3 位随机数字的新密码，原密码和已有登录立即失效。班级和学生数据保留。' : enabling ? '恢复登录权限，原负责班级继续保留。' : '已有登录立即失效，老师将无法继续管理班级。负责班级和学生数据保留，其他老师不受影响。'}</p><form><div class="actions"><button type="submit" class="primary">确认${resetting ? '重置密码' : enabling ? '启用' : '禁用'}</button><button type="button" data-cancel>取消</button></div><p role="alert" hidden></p></form>`, trigger);
    const form = view.querySelector('form'); form.querySelector('[data-cancel]').onclick = () => view.close();
    form.onsubmit = event => { event.preventDefault(); submit(form, async () => {
      const result = resetting ? await config.api('admin/teacher-reset-password', { teacherId: teacher.id, revision: teacher.revision }) : await config.api('admin/teachers', { id: teacher.id, name: teacher.name, pinyin: teacher.loginPinyin, active: enabling, classIds: teacher.classIds, revision: teacher.revision });
      view.close(); await refresh();
      if (resetting) account(config, result, document.getElementById('newTeacher'));
      else config.saved(`老师已${enabling ? '启用' : '禁用'}。`, document.getElementById('newTeacher'));
    }); };
  }
  async function open(config) {
    let data, query = '', active = 'all';
    async function refresh() { data = await config.api('admin/teachers'); render(); }
    function render() {
      config.app.innerHTML = `<div class="toolbar teacher-heading"><div><p class="muted">灿然英语工作室 · 管理员</p><h1>老师管理</h1><p class="muted">按班级分配管理权限，老师可共同负责同一个班级。</p></div><div class="actions"><button class="primary" id="newTeacher">新增老师</button><button class="compact" id="backClasses">返回班级</button></div></div><div class="teacher-filters"><label>查找老师<input type="search" id="teacherSearch" placeholder="姓名或工号" value="${e(query)}"></label><label>账号状态<select id="teacherActive"><option value="all">全部状态</option><option value="active">已启用</option><option value="disabled">已禁用</option></select></label></div><section class="panel teacher-table-panel"><table class="teacher-table"><thead><tr><th>老师</th><th>工号</th><th>负责班级</th><th>状态</th><th>操作</th></tr></thead><tbody></tbody></table><p class="teacher-empty" hidden></p></section><p role="status" aria-live="polite"></p>`;
      document.getElementById('teacherActive').value = active;
      document.getElementById('newTeacher').onclick = event => editor(config, data, null, event.currentTarget, refresh);
      document.getElementById('backClasses').onclick = () => config.back();
      document.getElementById('teacherSearch').oninput = event => { query = event.target.value; rows(); };
      document.getElementById('teacherActive').onchange = event => { active = event.target.value; rows(); };
      rows();
    }
    function rows() {
      const list = data.teachers.filter(t => (active === 'all' || t.active === (active === 'active')) && (t.name.toLowerCase().includes(query.trim().toLowerCase()) || t.teacherNumber.includes(query.trim().toLowerCase())));
      config.app.querySelector('tbody').innerHTML = list.map(t => `<tr data-teacher="${e(t.id)}"><td data-label="老师"><strong>${e(t.name)}</strong></td><td data-label="工号" class="student-number">${e(t.teacherNumber)}</td><td data-label="负责班级"><div class="teacher-tags">${t.classIds.map(id => `<span>${e(data.classes.find(c => c.id === id)?.name)}</span>`).join('') || '<span class="muted">尚未分配</span>'}</div></td><td data-label="状态"><span class="teacher-state ${t.active ? 'enabled' : ''}">${t.active ? '已启用' : '已禁用'}</span></td><td data-label="操作"><div class="teacher-row-actions"><button class="text-button" data-edit>编辑</button><button class="text-button" data-account>查看账号</button><button class="text-button" data-reset>重置密码</button><button class="text-button" data-toggle>${t.active ? '禁用' : '启用'}</button></div></td></tr>`).join('');
      const empty = config.app.querySelector('.teacher-empty'); empty.hidden = !!list.length; empty.textContent = data.teachers.length ? '没有符合条件的老师。' : '还没有老师，点击“新增老师”开始分配班级。';
      config.app.querySelectorAll('[data-teacher]').forEach(row => {
        const teacher = data.teachers.find(t => t.id === row.dataset.teacher);
        row.querySelector('[data-edit]').onclick = event => editor(config, data, teacher, event.currentTarget, refresh);
        row.querySelector('[data-reset]').onclick = event => confirm(config, teacher, 'reset', event.currentTarget, refresh);
        row.querySelector('[data-toggle]').onclick = event => confirm(config, teacher, 'toggle', event.currentTarget, refresh);
        row.querySelector('[data-account]').onclick = async event => {
          const button = event.currentTarget; button.disabled = true;
          try { account(config, await config.api('admin/teacher-account', { teacherId: teacher.id }), button); }
          catch (error) { config.app.querySelector('[role=status]').textContent = error.message; }
          finally { button.disabled = false; }
        };
      });
    }
    await refresh();
  }
  async function assign(config, group, trigger) {
    const data = await config.api('admin/teachers'), expected = data.teachers.filter(t => t.classIds.includes(group.id)).map(t => t.id);
    const view = dialog('分配负责老师', `<p>${e(group.name)} · 可选择多名老师</p><form><div class="teacher-class-choices">${data.teachers.map(t => `<label><input type="checkbox" name="teacherId" value="${e(t.id)}" ${expected.includes(t.id) ? 'checked' : ''}><span>${e(t.name)} <span class="student-number">${e(t.teacherNumber)}</span>${t.active ? '' : '（已禁用）'}</span></label>`).join('') || '<p class="muted">还没有老师，请先在“老师管理”中创建。</p>'}</div><p class="muted">取消勾选会收回这个班级的权限。已禁用的老师仍不能登录。</p><div class="actions"><button class="primary" type="submit">保存负责老师</button><button type="button" data-cancel>取消</button></div><p role="alert" hidden></p></form>`, trigger);
    const form = view.querySelector('form'); form.querySelector('[data-cancel]').onclick = () => view.close();
    form.onsubmit = event => { event.preventDefault(); const teacherIds = new FormData(form).getAll('teacherId'); submit(form, async () => { await config.api('admin/class-teachers', { classId: group.id, teacherIds, expectedIds: expected }); view.close(); await config.back(group.id); config.saved('负责老师已保存。', document.getElementById('assignTeachers')); }); };
  }
  function password(config, identity, required) {
    config.app.innerHTML = `<section class="login panel"><h1>${required ? '设置老师新密码' : '修改老师密码'}</h1><p>${e(identity.name)} · <span class="student-number">${e(identity.teacherNumber)}</span></p><p class="muted">${required ? '初始密码已使用，请在 15 分钟内设置新密码；超时请联系管理员重置。' : ''}使用 8–64 位字符，包含字母和数字。</p><form id="teacherPassword">${required ? '' : '<label for="teacherOld">当前密码</label><input id="teacherOld" name="currentPassword" type="password" autocomplete="current-password" maxlength="128" required>'}<label for="teacherNew">新密码</label><input id="teacherNew" name="password" type="password" autocomplete="new-password" minlength="8" maxlength="64" required><label for="teacherConfirm">再输一次新密码</label><input id="teacherConfirm" name="confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="64" required><button class="primary" type="submit">保存新密码，进入管理</button><p role="alert" hidden></p></form><button class="compact" id="teacherPasswordBack">${required ? '退出登录' : '返回班级'}</button></section>`;
    const form = document.getElementById('teacherPassword');
    form.onsubmit = event => { event.preventDefault(); const body = Object.fromEntries(new FormData(form)); submit(form, async () => { await config.api('admin/password', body); await config.back(); }); };
    document.getElementById('teacherPasswordBack').onclick = () => required ? config.logout() : config.back();
  }
  window.CanranAdminTeachers = { open, assign, password };
})();
