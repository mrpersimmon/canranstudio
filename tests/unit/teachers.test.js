'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const { openStore } = require('../../server/store');
const { createApp } = require('../../server/app');
const actor = { role: 'admin', subject: 'test-admin' };
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-teachers-')), store = openStore(directory);
  t.after(() => { store.close(); fs.rmSync(directory, { recursive: true, force: true }); });
  const classes = ['甲班', '乙班', '丙班'].map(name => store.createClass(name));
  for (const c of classes) store.updateClass(c.id, c.name, [c.name === '丙班' ? 'unit1-2' : 'unit13-14']);
  const students = classes.map(c => store.createStudents([{ name: c.name + '学生', pinyin: 'ceshixuesheng' }], c.id)[0]);
  return { store, directory, classes, students };
}
const update = (t, changes = {}) => ({ ...t, pinyin: t.loginPinyin, ...changes });

test('teacher examples use a global 1-prefixed sequence independent of 0-prefixed students, immutable after edits and restart', t => {
  const { store, directory, classes, students } = fixture(t);
  const teachers = [['段晓东', 'duanxiaodong'], ['韩秋婉', 'hanqiuwan'], ['韩肖肖', 'hanxiaoxiao']].map(([name,pinyin]) => store.teachers.create({ name, pinyin, classIds: [classes[0].id] }, actor));
  assert.deepEqual(teachers.map(t => t.teacherNumber), ['d10000001', 'h10000002', 'h10000003']);
  assert.deepEqual(students.map(s => s.studentNumber), ['c00000001', 'c00000002', 'c00000003']);
  for (const teacher of teachers) assert.match(store.teachers.credential(teacher.id).initialPassword, new RegExp('^' + teacher.loginPinyin + '\\d{3}$'));
  let changed = store.teachers.update(update(teachers[0], { name: '吕晓东', pinyin: 'lvxiaodong', active: false }), actor);
  changed = store.teachers.reset(changed.id, changed.revision, actor);
  changed = store.teachers.update(update(changed, { active: true }), actor);
  assert.equal(changed.teacherNumber, 'd10000001');
  const reopened = openStore(directory);
  try { assert.equal(reopened.teachers.create({ name: '段老师', pinyin: 'duanlaoshi' }, actor).teacherNumber, 'd10000004'); }
  finally { reopened.close(); }
  assert.throws(() => store.setAdmin('d10000001', 'Test-only-collision-2026'), /重复/);
});

test('both namespaces stop before crossing their fixed leading digit', t => {
  const { store, directory, classes } = fixture(t), db = new DatabaseSync(path.join(directory, 'learning.sqlite'));
  try {
    store.teachers.create({ name: '段老师', pinyin: 'duanlaoshi' });
    db.prepare("UPDATE sqlite_sequence SET seq=9999998 WHERE name IN ('teacher_numbers','student_numbers')").run();
    assert.equal(store.teachers.create({ name: '末位老师', pinyin: 'moweilaoshi' }).teacherNumber, 'm19999999');
    assert.equal(store.createStudents([{ name: '末位学生', pinyin: 'moweixuesheng' }], classes[0].id)[0].studentNumber, 'm09999999');
    assert.throws(() => store.teachers.create({ name: '越界老师', pinyin: 'yuejie' }), /上限/);
    assert.throws(() => store.createStudents([{ name: '越界学生', pinyin: 'yuejie' }], classes[0].id), /上限/);
    assert.equal(store.teachers.list().length, 2);
  } finally { db.close(); }
});

test('teacher initial/reset secrets preserve three digits, redemption, deadlines, and revocation through backup/restart', async t => {
  const { store, directory, classes } = fixture(t);
  const mock = t.mock.method(crypto, 'randomInt', () => 7);
  let teacher = store.teachers.create({ name: '吕乐', pinyin: 'lvle', classIds: [classes[0].id] }, actor);
  const namesake = store.teachers.create({ name: '吕勒', pinyin: 'lvle' }, actor);
  assert.equal(store.teachers.credential(teacher.id).initialPassword, 'lvle007');
  assert.equal(store.teachers.credential(namesake.id).initialPassword, 'lvle008');
  mock.mock.restore();
  const first = store.teachers.credential(teacher.id), login = store.teachers.login(teacher.teacherNumber.toUpperCase(), first.initialPassword);
  assert.equal(login.mustChangePassword, true); assert.ok(store.lookupSession(login.setupToken, 'teacher-setup', Date.now()));
  assert.equal(store.teachers.login(teacher.teacherNumber, first.initialPassword), null);
  assert.equal(store.teachers.credential(teacher.id).initialPassword, null);
  assert.equal(store.lookupSession(login.setupToken, 'teacher-setup', Date.now() + 16 * 60000), undefined);
  const reopened = openStore(directory);
  try { assert.equal(reopened.teachers.login(teacher.teacherNumber, first.initialPassword), null); } finally { reopened.close(); }
  store.teachers.changePassword(teacher.id, 'Teacher-new-password-2026', { role: 'teacher', subject: teacher.id });
  assert.equal(store.lookupSession(login.setupToken, 'teacher-setup', Date.now()), undefined);
  const session = store.session('teacher', teacher.id, Date.now());
  teacher = store.teachers.get(teacher.id); store.teachers.reset(teacher.id, teacher.revision, actor);
  assert.equal(store.lookupSession(session, 'teacher', Date.now()), undefined);
  assert.equal(store.teachers.login(teacher.teacherNumber, 'Teacher-new-password-2026'), null);
  const next = store.teachers.credential(teacher.id); assert.match(next.initialPassword, /^lvle\d{3}$/);
  assert.equal(store.teachers.login(teacher.teacherNumber, next.initialPassword, next.initialPasswordExpiresAt), null);
  assert.equal(store.teachers.credential(teacher.id, next.initialPasswordExpiresAt).initialPassword, null);
  const restored = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-teachers-restore-'));
  try {
    await store.backup(path.join(restored, 'learning.sqlite')); fs.copyFileSync(path.join(directory, 'card-key'), path.join(restored, 'card-key'));
    const copy = openStore(restored);
    try { copy.checkIntegrity(); assert.deepEqual(copy.teachers.credential(teacher.id), next); assert.equal(copy.teachers.get(teacher.id).teacherNumber, teacher.teacherNumber); }
    finally { copy.close(); }
  } finally { fs.rmSync(restored, { recursive: true, force: true }); }
});

test('teacher and class assignment revisions reject stale writes; disabling preserves peer permissions and student learning; audit omits secrets', t => {
  const { store, directory, classes, students } = fixture(t);
  let first = store.teachers.create({ name: '老师甲', pinyin: 'laoshijia', classIds: [classes[0].id, classes[1].id] }, actor);
  const peer = store.teachers.create({ name: '老师乙', pinyin: 'laoshiyi', classIds: [classes[1].id, classes[2].id] }, actor);
  store.saveProgress(students[0].id, 'unit13-14', 2, { unchanged: true });
  const password = store.teachers.credential(first.id).initialPassword;
  store.teachers.changePassword(first.id, 'Test-teacher-active-2026');
  assert.equal(store.teachers.get(first.id).revision, first.revision, 'self password change must not invalidate a pending profile/disable action');
  first = store.teachers.get(first.id);
  const token = store.session('teacher', first.id, Date.now());
  assert.ok(store.lookupSession(token, 'teacher', Date.now()));
  assert.equal(store.lookupSession(token, 'teacher', Date.now() + 12 * 3600000), undefined);
  store.teachers.assignClass(classes[1].id, [peer.id], [first.id, peer.id], actor);
  assert.throws(() => store.teachers.update(update(first, { name: '过期草稿' }), actor), error => error.status === 409);
  assert.throws(() => store.teachers.assignClass(classes[1].id, [], [first.id, peer.id], actor), error => error.status === 409);
  first = store.teachers.get(first.id);
  first = store.teachers.update(update(first, { active: false }), actor);
  assert.equal(store.lookupSession(token, 'teacher', Date.now()), undefined);
  assert.deepEqual(first.classIds, [classes[0].id]);
  assert.deepEqual(new Set(store.teachers.get(peer.id).classIds), new Set([classes[1].id, classes[2].id]));
  store.teachers.update(update(first, { active: true }), actor);
  assert.equal(store.lookupSession(token, 'teacher', Date.now()), undefined);
  assert.deepEqual(store.progress(students[0].id, 'unit13-14'), { generation: 2, value: { unchanged: true } });
  const db = new DatabaseSync(path.join(directory, 'learning.sqlite'));
  try { const audit = JSON.stringify(db.prepare('SELECT * FROM management_audit').all()); assert.match(audit, /teacher.update/); for (const secret of [password, token, 'Test-teacher-active-2026', 'passwordHash']) assert.ok(!audit.includes(secret)); }
  finally { db.close(); }
});

test('HTTP teacher permissions cover setup, many-to-many scope, search/detail, batch, transfer, previews/resources and revocation', async t => {
  const { store, directory, classes, students } = fixture(t);
  store.setAdmin('test-admin', 'Test-only-admin-2026');
  const teacher = store.teachers.create({ name: '段晓东', pinyin: 'duanxiaodong', classIds: classes.slice(0, 2).map(c => c.id) }, actor);
  const server = await createApp({ dataDir: directory, origin: 'http://127.0.0.1', basePath: '/' });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const call = (route, data, cookie = '', origin = 'http://127.0.0.1') => fetch(base + route, { headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/json' }, ...(data === undefined ? {} : { method: 'POST', body: JSON.stringify(data) }) });
    const admin = 'canran_admin=' + store.session('admin', 'test-admin', Date.now());
    const initial = store.teachers.credential(teacher.id).initialPassword;
    let login = await call('/api/admin/login', { username: ' '+teacher.teacherNumber.toUpperCase()+' ', password: initial });
    assert.equal(login.status, 200); let cookie = login.headers.get('set-cookie').split(';')[0];
    assert.equal((await login.json()).mustChangePassword, true);
    let state = await (await call('/api/admin/state', undefined, cookie)).json();
    assert.deepEqual(state.students, []); assert.equal(state.identity.role, 'teacher');
    for (const route of ['/api/admin/learning', '/api/admin/teachers', '/api/me?preview='+classes[0].id, '/course-index.json']) assert.ok([401,403].includes((await call(route, undefined, cookie)).status), route);
    assert.equal((await call('/api/admin/password', { password: 'Teacher-only-2026', confirmPassword: 'mismatch' }, cookie)).status, 400);
    const invalidNumber=await call('/api/admin/password',{password:teacher.teacherNumber,confirmPassword:teacher.teacherNumber},cookie);
    assert.equal(invalidNumber.status,400); assert.match((await invalidNumber.json()).error,/工号/);
    const changed = await call('/api/admin/password', { password: 'Teacher-only-2026', confirmPassword: 'Teacher-only-2026' }, cookie);
    assert.equal(changed.status, 200); const oldSetup = cookie; cookie = changed.headers.get('set-cookie').split(';')[0];
    assert.equal((await call('/api/admin/state', undefined, oldSetup)).status, 401);
    state = await (await call('/api/admin/state', undefined, cookie)).json();
    assert.deepEqual(new Set(state.classes.map(c=>c.id)), new Set(classes.slice(0,2).map(c=>c.id)));
    assert.deepEqual(state.students.map(s=>s.id), students.slice(0,2).map(s=>s.id));
    assert.ok(!JSON.stringify(state).includes(initial));
    for (const [route, body] of [
      ['/api/admin/teachers', undefined], ['/api/admin/teachers', { name:'越权老师', pinyin:'yuequan' }],
      ['/api/admin/class-teachers', { classId:classes[0].id, teacherIds:[], expectedIds:[teacher.id] }],
      ['/api/admin/teacher-reset-password', {teacherId:teacher.id,revision:store.teachers.get(teacher.id).revision}],
      ['/api/admin/teacher-account', {teacherId:teacher.id}], ['/api/admin/classes', {name:'越权班级'}],
      ['/api/admin/classes', {id:classes[2].id,name:'越权改名'}],
      ['/api/admin/students', {id:students[2].id,classId:classes[0].id,name:'偷转班',active:true}],
      ['/api/admin/students', {id:students[0].id,classId:classes[2].id,name:'越权转班',active:true}],
      ['/api/admin/accounts', {studentIds:[students[0].id,students[2].id]}],
      ['/api/admin/accounts', {classId:classes[2].id}], ['/api/admin/reset-password', {studentId:students[2].id,pinyin:'xuesheng'}],
      ['/api/admin/learning?classId='+classes[2].id, undefined],
      ['/api/admin/students/'+students[2].id+'/learning',undefined],
      ['/api/admin/students/'+students[2].id+'/learning/unit1-2',undefined],
      ['/api/me?preview='+classes[2].id,undefined], ['/api/courses/unit1-2/enter',{preview:classes[2].id}]
    ]) assert.equal((await call(route,body,cookie)).status,403,route);
    assert.equal((await call('/api/admin/delete-teacher',{teacherId:teacher.id},admin)).status,404);
    assert.equal((await fetch(base+'/api/admin/teachers',{method:'DELETE',headers:{Cookie:admin}})).status,405);
    const before = store.initialCredential(students[0].id);
    assert.equal((await call('/api/admin/reset-passwords',{studentIds:[students[0].id,students[2].id]},cookie)).status,403);
    assert.deepEqual(store.initialCredential(students[0].id), before);
    assert.equal((await call('/api/admin/reset-passwords',{studentIds:[students[0].id]},cookie,'https://other.invalid')).status,403);
    assert.equal((await call('/api/admin/reset-passwords',{studentIds:[students[0].id]},cookie)).status,200);
    assert.notEqual(store.initialCredential(students[0].id).initialPassword,before.initialPassword);
    assert.equal((await call('/api/admin/accounts',{studentId:students[0].id},cookie)).status,200);
    assert.equal((await call('/api/admin/learning?q='+encodeURIComponent('丙班学生'),undefined,cookie)).status,200);
    const dashboard = await (await call('/api/admin/learning?classIds='+classes[2].id,undefined,cookie)).json();
    assert.ok(!JSON.stringify(dashboard).includes(students[2].id));
    assert.equal((await call('/api/admin/students/'+students[0].id+'/learning',undefined,cookie)).status,200);
    assert.equal((await call('/api/admin/classes',{id:classes[0].id,name:'新甲班',expectedName:classes[0].name},cookie)).status,200);
    assert.equal((await call('/api/admin/classes',{id:classes[0].id,name:'过期甲班',expectedName:classes[0].name},cookie)).status,409);
    assert.equal((await call('/api/admin/classes',{id:classes[0].id,courses:['unit13-14'],expectedCourses:['unit13-14']},cookie)).status,200);
    assert.equal((await call('/api/admin/students',{id:students[0].id,name:students[0].name,classId:classes[1].id,active:true},cookie)).status,200);
    const peer = store.teachers.create({name:'班级接手老师',pinyin:'jieshou',classIds:[classes[2].id]}); store.teachers.changePassword(peer.id,'Peer-teacher-2026');
    const peerCookie = 'canran_admin='+store.session('teacher',peer.id,Date.now());
    assert.equal((await call('/api/admin/students/'+students[0].id+'/learning',undefined,peerCookie)).status,403);
    store.updateStudent(students[0].id,students[0].name,classes[2].id,true);
    assert.equal((await call('/api/admin/students/'+students[0].id+'/learning',undefined,cookie)).status,403);
    assert.equal((await call('/api/admin/students/'+students[0].id+'/learning',undefined,peerCookie)).status,200);
    assert.equal((await call('/api/me?preview='+classes[0].id,undefined,cookie)).status,200);
    assert.equal((await call('/unit13-14/?preview='+classes[0].id,undefined,cookie)).status,200);
    assert.equal((await call('/unit1-2/?preview='+classes[0].id,undefined,cookie)).status,403);
    const index = await (await call('/course-index.json',undefined,cookie)).json(); assert.deepEqual(Object.keys(index.courses), ['unit13-14']);
    const adminIndex = await (await call('/course-index.json',undefined,admin)).json();
    assert.equal((await call(adminIndex.courses['unit1-2'].manifest,undefined,cookie)).status,403);
    store.changePassword(students[2].id,'Student-own-course-2026');
    const combinedCookie=cookie+'; canran_student='+store.session('student',students[2].id,Date.now());
    assert.equal((await call(adminIndex.courses['unit1-2'].manifest,undefined,combinedCookie)).status,200,'a separate valid student login retains access to its own course');
    assert.equal((await call('/api/admin/students/'+students[2].id+'/learning',undefined,combinedCookie)).status,403,'student cookie cannot extend teacher management scope');
    const pack = await (await call(index.courses['unit13-14'].manifest,undefined,cookie)).json();
    const resource = pack.required.find(r=>r.key.includes('/unit13-14/'));
    assert.ok(resource); assert.equal((await call(resource.url,undefined,cookie)).status,200);
    store.teachers.assignClass(classes[0].id,[],[teacher.id],actor); store.teachers.assignClass(classes[1].id,[],[teacher.id],actor);
    assert.equal((await call('/api/me?preview='+classes[0].id,undefined,cookie)).status,403);
    assert.equal((await call(resource.url,undefined,cookie)).status,403);
    state = await (await call('/api/admin/state',undefined,cookie)).json(); assert.deepEqual(state.students,[]); assert.deepEqual(state.classes,[]);
    assert.equal((await (await call('/api/admin/learning',undefined,cookie)).json()).rows.length,0);
    const latest = store.teachers.get(teacher.id); store.teachers.update(update(latest,{active:false}),actor);
    assert.equal((await call('/api/admin/state',undefined,cookie)).status,401);
    assert.equal((await call('/api/admin/state',undefined,peerCookie)).status,200);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});

test('async batch rechecks teacher assignment and student transfer before committing any password', async t => {
  const { store, directory, classes, students } = fixture(t);
  const teacher = store.teachers.create({name:'并发老师',pinyin:'bingfa',classIds:[classes[0].id,classes[1].id]}); store.teachers.changePassword(teacher.id,'Teacher-parallel-2026');
  const cookie = 'canran_admin='+store.session('teacher',teacher.id,Date.now());
  const server = await createApp({dataDir:directory,origin:'http://127.0.0.1',basePath:'/'}); await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    for (const change of ['assignment','transfer','disable']) {
      const current = store.teachers.get(teacher.id); store.teachers.update(update(current,{classIds:[classes[0].id,classes[1].id]}));
      store.updateStudent(students[0].id,students[0].name,classes[0].id,true);
      const before = students.slice(0,2).map(s=>store.initialCredential(s.id));
      let seen, release; const started = new Promise(resolve=>seen=resolve), real = crypto.scrypt;
      const mock = t.mock.method(crypto,'scrypt',function(...args) { const callback=args.pop(); return real(...args,(...result)=>{if(release){callback(...result);return;} release=()=>callback(...result);seen();}); });
      const pending = fetch('http://127.0.0.1:'+server.address().port+'/api/admin/reset-passwords',{method:'POST',headers:{Origin:'http://127.0.0.1','Content-Type':'application/json',Cookie:cookie},body:JSON.stringify({studentIds:students.slice(0,2).map(s=>s.id)})});
      await started;
      if(change==='assignment') store.teachers.assignClass(classes[0].id,[],[teacher.id]);
      if(change==='transfer') store.updateStudent(students[0].id,students[0].name,classes[2].id,true);
      if(change==='disable') store.teachers.update(update(store.teachers.get(teacher.id),{active:false}));
      release(); const response=await pending; mock.mock.restore();
      assert.equal(response.status,change==='disable'?401:403,change);
      assert.deepEqual(students.slice(0,2).map(s=>store.initialCredential(s.id)),before,change);
    }
  } finally { await new Promise(resolve=>server.close(resolve)); }
});

test('teacher login cooldown normalizes case and spaces, persists across restart, and administrator reset restores login', async t => {
  const { store, directory } = fixture(t);
  store.setAdmin('test-admin', 'Test-only-admin-2026');
  const teacher = store.teachers.create({ name: '限流老师', pinyin: 'xianliu' }, actor);
  let server;
  const start = async () => { server = await createApp({ dataDir:directory, origin:'http://127.0.0.1', basePath:'/' }); await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve)); };
  const call = (route, body, cookie='') => fetch('http://127.0.0.1:'+server.address().port+'/api/'+route,{method:'POST',headers:{Origin:'http://127.0.0.1','Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(body)});
  await start();
  try {
    for(let n=0;n<10;n++) assert.equal((await call('admin/login',{username:n%2?' '+teacher.teacherNumber.toUpperCase()+' ':teacher.teacherNumber,password:'Wrong-test-password'})).status,401);
    let response=await call('admin/login',{username:teacher.teacherNumber,password:store.teachers.credential(teacher.id).initialPassword});
    assert.equal(response.status,429); assert.ok(Number(response.headers.get('retry-after'))>0);
    await new Promise(resolve=>server.close(resolve)); await start();
    assert.equal((await call('admin/login',{username:teacher.teacherNumber,password:store.teachers.credential(teacher.id).initialPassword})).status,429);
    const admin='canran_admin='+store.session('admin','test-admin',Date.now());
    response=await call('admin/teacher-reset-password',{teacherId:teacher.id,revision:teacher.revision},admin); assert.equal(response.status,200);
    const result=await response.json();
    response=await call('admin/login',{username:teacher.teacherNumber,password:result.credential.initialPassword}); assert.equal(response.status,200);
    assert.equal((await response.json()).mustChangePassword,true);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
