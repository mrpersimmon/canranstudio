'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { openStore } = require('../../server/store');

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-admin-accounts-'));
  const store = openStore(directory);
  t.after(() => { store.close(); fs.rmSync(directory, { recursive: true, force: true }); });
  const group = store.createClass('测试甲班'), other = store.createClass('测试乙班');
  const students = [...store.createStudents([{ name: '李明', pinyin: 'liming' }, { name: '吕月', pinyin: 'lvyue' }], group.id), ...store.createStudents([{ name: '陈晨', pinyin: 'chenchen' }], other.id)];
  return { store, students, directory };
}

test('new students receive verified pinyin plus three digits, with leading zeros and distinct namesake credentials', t => {
  const { store, students } = fixture(t), crypto = require('node:crypto');
  t.mock.method(crypto, 'randomInt', () => 7);
  const created = store.createStudents([{ name: '李雷', pinyin: 'lilei' }, { name: '李蕾', pinyin: 'lilei' }, { name: '吕乐', pinyin: 'lvle' }], students[0].classId);
  const passwords = created.map(s => store.initialCredential(s.id).initialPassword);
  assert.deepEqual(passwords, ['lilei007', 'lilei008', 'lvle007']);
  assert.notEqual(created[0].studentNumber, created[1].studentNumber);
  assert.equal(store.studentLogin(created[1].studentNumber, passwords[0]), null);
  assert.equal(store.studentLogin(created[0].studentNumber, 'lilei'), null);
  assert.ok(store.studentLogin(created[0].studentNumber, passwords[0]).mustChangePassword);
  assert.equal(store.studentLogin(created[0].studentNumber, passwords[0]), null);
});

test('batch resets only selected students, revokes sessions and retains identities, status and progress', async t => {
  const { store, students } = fixture(t);
  const passwords = students.map(s => store.initialCredential(s.id).initialPassword);
  const sessions = students.map(s => store.session('student', s.id, Date.now()));
  const setup = store.studentLogin(students[1].studentNumber, passwords[1]);
  store.saveProgress(students[0].id, 'unit13-14', 3, { retained: 'proof' });
  store.updateStudent(students[1].id, students[1].name, students[1].classId, false);
  const unchanged = store.initialCredential(students[2].id);
  assert.equal(await store.resetPasswords(students.slice(0, 2).map(s => s.id)), 2);
  for (let i = 0; i < 2; i++) {
    const next = store.initialCredential(students[i].id);
    assert.match(next.initialPassword, i ? /^lvyue\d{3}$/ : /^liming\d{3}$/);
    assert.notEqual(next.initialPassword, passwords[i]);
    assert.ok(next.initialPasswordExpiresAt > Date.now() + 6 * 86400000);
    assert.equal(store.checkStudentPassword(students[i].id, passwords[i]), false);
    assert.equal(store.lookupSession(sessions[i], 'student', Date.now()), undefined);
    assert.equal(store.student(students[i].id).studentNumber, students[i].studentNumber);
  }
  assert.equal(store.lookupSession(setup.setupToken, 'student-setup', Date.now()), undefined);
  assert.equal(store.student(students[1].id).active, 0);
  assert.deepEqual(store.progress(students[0].id, 'unit13-14'), { generation: 3, value: { retained: 'proof' } });
  assert.deepEqual(store.initialCredential(students[2].id), unchanged);
  assert.ok(store.lookupSession(sessions[2], 'student', Date.now()));
  const next = store.initialCredential(students[0].id).initialPassword;
  assert.ok(store.studentLogin(students[0].studentNumber, next).mustChangePassword);
  assert.equal(store.studentLogin(students[0].studentNumber, next), null);
});

test('invalid, duplicate and stale batches never partially reset passwords', async t => {
  const { store, students } = fixture(t), id = students[0].id;
  const before = store.initialCredential(id);
  for (const ids of [[], [id, id], [id, 'missing'], [id, null], Array(1001).fill(id)]) await assert.rejects(store.resetPasswords(ids));
  assert.deepEqual(store.initialCredential(id), before);
  const pending = store.resetPasswords(students.slice(0, 2).map(s => s.id));
  store.changePassword(students[1].id, 'Changed-during-reset-2026');
  await assert.rejects(pending, error => error.status === 409);
  assert.deepEqual(store.initialCredential(id), before);
  assert.ok(store.checkStudentPassword(students[1].id, 'Changed-during-reset-2026'));
  await assert.rejects(store.resetPasswords([id], () => { throw Object.assign(Error('expired admin session'), { status: 401 }); }), error => error.status === 401);
  assert.deepEqual(store.initialCredential(id), before);
});

test('single reset uses verified spelling and exactly three digits, including leading zeros', t => {
  const { store, students } = fixture(t), crypto = require('node:crypto');
  const random = t.mock.method(crypto, 'randomInt', () => 7);
  store.resetPassword(students[0].id, 'lilei');
  assert.equal(store.initialCredential(students[0].id).initialPassword, 'lilei007');
  random.mock.restore();
  store.resetPassword(students[0].id, 'lilei');
  assert.notEqual(store.initialCredential(students[0].id).initialPassword, 'lilei007');
});

test('custom admin reset reads stdin, keeps username and data, revokes old sessions without logging credentials', t => {
  const { store, students, directory } = fixture(t);
  store.setAdmin('class-admin', 'Previous-admin-password');
  const old = store.session('admin', 'class-admin', Date.now());
  const password = 'Demo5211314.';
  const run = value => spawnSync(process.execPath, ['server/manage.js', 'reset-admin', '--password-stdin'], { cwd: path.resolve(__dirname, '../..'), env: { ...process.env, LESSON_DATA_DIR: directory }, input: value + '\n', encoding: 'utf8' });
  const invalid = run('short');assert.notEqual(invalid.status, 0);
  assert.equal(store.adminLogin('class-admin', 'Previous-admin-password'), 'class-admin');
  const result = run(password);assert.equal(result.status, 0, result.stderr);
  assert.ok(!result.stdout.includes(password) && !result.stderr.includes(password));
  assert.equal(store.adminLogin('class-admin', password), 'class-admin');
  assert.equal(store.adminLogin('class-admin', 'Previous-admin-password'), null);
  assert.equal(store.lookupSession(old, 'admin', Date.now()), undefined);
  assert.equal(store.students().length, students.length);
  assert.equal(fs.statSync(path.join(directory, 'admin-first-login.txt')).mode & 0o777, 0o600);
});

test('batch API enforces admin and origin, returns only requested accounts and accepts long reset passwords', async t => {
  const { store, students, directory } = fixture(t);
  const { createApp } = require('../../server/app');
  store.setAdmin('teacher', 'Test-admin-api-password');
  const server = await createApp({ dataDir: directory, origin: 'http://127.0.0.1', basePath: '/' });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const call = (route, data, cookie = '', origin = 'http://127.0.0.1') => fetch(base + '/api/' + route, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify(data) });
    const ids = students.slice(0, 2).map(s => s.id), body = { studentIds: ids };
    assert.equal((await call('admin/reset-passwords', body)).status, 401);
    const studentCookie = 'canran_student=' + store.session('student', students[0].id, Date.now());
    assert.equal((await call('admin/reset-passwords', body, studentCookie)).status, 403);
    const login = await call('admin/login', { username: 'teacher', password: 'Test-admin-api-password' });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    const before = store.initialCredential(ids[0]);
    assert.equal((await call('admin/reset-passwords', body, cookie, 'https://other.invalid')).status, 403);
    assert.equal((await call('admin/reset-passwords', { studentIds: [ids[0], 'missing'] }, cookie)).status, 404);
    assert.deepEqual(store.initialCredential(ids[0]), before);
    const reset = await call('admin/reset-passwords', body, cookie);
    assert.deepEqual(await reset.json(), { ok: true, count: 2 });
    const result = await (await call('admin/accounts', body, cookie)).json();
    assert.deepEqual(result.accounts.map(s => s.id), ids);
    assert.match(result.accounts[0].initialPassword, /^liming\d{3}$/);
    const spelling = 'a'.repeat(120);
    assert.equal((await call('admin/reset-password', { studentId: ids[0], pinyin: spelling }, cookie)).status, 200);
    const password = store.initialCredential(ids[0]).initialPassword;
    assert.equal(password.length, 123);
    const signedIn = await call('login', { studentNumber: students[0].studentNumber, password });
    assert.equal(signedIn.status, 200);
    assert.equal((await signedIn.json()).mustChangePassword, true);
    assert.equal((await fetch(base + '/fonts/maple-mono-nl-semibold.woff2')).headers.get('content-type'), 'font/woff2');
  } finally { await new Promise(resolve => server.close(resolve)); }
});
