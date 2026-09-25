'use strict';
const { test, expect } = require('@playwright/test');
const http = require('node:http');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { createApp } = require('../../server/app');
const { openStore } = require('../../server/store');
const { createCoursePackages } = require('../../scripts/course-packages');
const { UNITS } = require('../../server/catalog');

const root = path.resolve(__dirname, '../..');
const adminPassword = 'Test-only-security-admin-2026!';
let bundle;
async function fixture({ seed, ...options } = {}) {
  bundle ||= await createCoursePackages({ root, basePath: '/lesson/', courseIds: UNITS, isolatedDefinitions: true });
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-security-test-'));
  if (seed) await seed(directory);
  else { const store = openStore(directory); store.setAdmin('teacher', adminPassword); store.close(); }
  let server, address;
  async function start() {
    const reservation = http.createServer();
    await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
    const port = reservation.address().port;
    await new Promise(resolve => reservation.close(resolve));
    address = 'http://127.0.0.1:' + port;
    server = await createApp({ root, dataDir: directory, origin: address, bundle, ...options });
    await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  }
  async function stop() { await new Promise(resolve => server.close(resolve)); }
  await start();
  return {
    directory,
    async call(endpoint, data, cookie, forwarded, extra = {}) {
      const response = await fetch(address + '/lesson/api/' + endpoint, {
        method: data === undefined ? 'GET' : 'POST',
        headers: { Origin: address, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), ...(forwarded ? { 'X-Forwarded-For': forwarded } : {}), ...extra },
        body: data === undefined ? undefined : JSON.stringify(data)
      });
      return { status: response.status, body: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0], setCookie: response.headers.get('set-cookie') };
    },
    address: () => address,
    async restart() { await stop(); await start(); },
    async close() { await stop(); await fs.rm(directory, { recursive: true, force: true }); }
  };
}
async function learner(f, name = '李明', pinyin = 'liming', forwarded) {
  const admin = await f.call('admin/login', { username: 'teacher', password: adminPassword }, null, forwarded);
  expect(admin.status).toBe(200);
  const group = await f.call('admin/classes', { name: '安全验证班' }, admin.cookie);
  await f.call('admin/classes', { id: group.body.id, name: '安全验证班', courses: ['unit13-14'] }, admin.cookie);
  const made = await f.call('admin/students', { classId: group.body.id, students: [{ name, pinyin }] }, admin.cookie);
  const student = made.body.students[0];
  const card = await f.call('admin/accounts', { studentId: student.id }, admin.cookie);
  return { ...student, ...card.body.accounts[0], admin: admin.cookie };
}

test('初始密码随机且独立：拼音不能抢先激活，同名学生不能共用初始密码', async () => {
  const f = await fixture();
  try {
    const a = await learner(f), b = await learner(f);
    expect(a.initialPassword).not.toBe('liming');
    expect(a.initialPassword).toMatch(/^[A-Za-z0-9_-]{16}$/);
    expect(b.initialPassword).not.toBe(a.initialPassword);
    expect(a.initialPasswordExpiresAt).toBeGreaterThan(Date.now());
    expect((await f.call('login', { studentNumber: a.studentNumber, password: 'liming' })).status).toBe(401);
    expect((await f.call('login', { studentNumber: b.studentNumber, password: a.initialPassword })).status).toBe(401);
    const setup = await f.call('login', { studentNumber: a.studentNumber, password: a.initialPassword });
    expect(setup.status).toBe(200); expect(setup.body.mustChangePassword).toBe(true);
    expect((await f.call('courses/unit13-14/enter', {}, setup.cookie)).status).toBe(403);
    const password = 'My-real-password-2026!';
    const changed = await f.call('password', { password, confirmPassword: password }, setup.cookie);
    expect(changed.status).toBe(200);
    expect((await f.call('me', undefined, changed.cookie)).body.student.id).toBe(a.id);
    expect((await f.call('me', undefined, setup.cookie)).status).toBe(401);
    expect((await f.call('login', { studentNumber: a.studentNumber, password: a.initialPassword })).status).toBe(401);
    const account = (await f.call('admin/accounts', { studentId: a.id }, a.admin)).body.accounts[0];
    expect(account.initialPassword).toBeNull();
    expect(account.initialPasswordExpiresAt).toBeNull();
    expect((await f.call('admin/accounts', { studentId: a.id })).status).toBe(401);
    expect((await f.call('admin/accounts', { studentId: a.id }, changed.cookie)).status).toBe(403);
  } finally { await f.close(); }
});

test('初始密码只能领取一次：并发重放失败，重置轮换密码并撤销待改密会话', async () => {
  const f = await fixture();
  try {
    const a = await learner(f);
    const attempts = await Promise.all([0, 1].map(() => f.call('login', { studentNumber: a.studentNumber, password: a.initialPassword })));
    expect(attempts.map(r => r.status).sort()).toEqual([200, 401]);
    const setup = attempts.find(r => r.status === 200);
    let card = (await f.call('admin/accounts', { studentId: a.id }, a.admin)).body.accounts[0];
    expect(card.initialPassword).toBeNull(); expect(card.initialPasswordState).toBe('used');
    await f.restart();
    expect((await f.call('me', undefined, setup.cookie)).body.mustChangePassword).toBe(true);
    expect((await f.call('login', { studentNumber: a.studentNumber, password: a.initialPassword })).status).toBe(401);
    expect((await f.call('admin/reset-password', { studentId: a.id, pinyin: 'liming' }, a.admin)).status).toBe(200);
    card = (await f.call('admin/accounts', { studentId: a.id }, a.admin)).body.accounts[0];
    expect(card.studentNumber).toBe(a.studentNumber); expect(card.initialPassword).not.toBe(a.initialPassword);
    expect((await f.call('me', undefined, setup.cookie)).status).toBe(401);
    const password = 'Replay-rejected-2026!';
    expect((await f.call('password', { password, confirmPassword: password }, setup.cookie)).status).toBe(401);
    expect((await f.call('login', { studentNumber: a.studentNumber, password: a.initialPassword })).status).toBe(401);
    expect((await f.call('login', { studentNumber: a.studentNumber, password: 'liming' })).status).toBe(401);
    expect((await f.call('login', { studentNumber: a.studentNumber, password: card.initialPassword })).status).toBe(200);
  } finally { await f.close(); }
});

test('初始密码到期不能登录或继续改密；查看、打印、重启均不延期', async ({ browser }) => {
  const f = await fixture(); let context;
  const changeDeadline = (id, time) => {
    const db = new DatabaseSync(path.join(f.directory, 'learning.sqlite'));
    db.prepare('UPDATE students SET initialPasswordExpiresAt=? WHERE id=?').run(time, id); db.close();
  };
  try {
    const a = await learner(f), b = await learner(f, '小雨', 'xiaoyu');
    const repeated = (await f.call('admin/accounts', { studentId: a.id }, a.admin)).body.accounts[0];
    expect(repeated.initialPasswordExpiresAt).toBe(a.initialPasswordExpiresAt);
    expect(repeated.initialPassword).toBe(a.initialPassword);
    changeDeadline(a.id, Date.now() + 120000);
    const setup = await f.call('login', { studentNumber: a.studentNumber, password: a.initialPassword });
    expect(setup.status).toBe(200);
    const maxAge = Number(setup.setCookie.match(/Max-Age=(\d+)/)[1]);
    expect(maxAge).toBeGreaterThan(0); expect(maxAge).toBeLessThanOrEqual(120);
    changeDeadline(a.id, Date.now() - 1); changeDeadline(b.id, Date.now() - 1);
    const password = 'Too-late-password-2026!';
    expect((await f.call('password', { password, confirmPassword: password }, setup.cookie)).status).toBe(401);
    expect((await f.call('login', { studentNumber: b.studentNumber, password: b.initialPassword })).status).toBe(401);
    await f.restart();
    expect((await f.call('login', { studentNumber: b.studentNumber, password: b.initialPassword })).status).toBe(401);
    const expired = (await f.call('admin/accounts', { studentId: b.id }, b.admin)).body.accounts[0];
    expect(expired.initialPassword).toBeNull(); expect(expired.initialPasswordState).toBe('expired');
    await f.call('admin/students', { id: b.id, name: b.name, classId: a.classId, active: true }, a.admin);
    await f.call('admin/students', { classId: a.classId, students: [{ name: '小星', pinyin: 'xiaoxing' }] }, a.admin);
    context = await browser.newContext();
    await context.addCookies([{ name: 'canran_admin', value: a.admin.split('=')[1], url: f.address() + '/lesson/' }]);
    const page = await context.newPage(); await page.goto(f.address() + '/lesson/admin/');
    await page.getByRole('button', { name: '管理 安全验证班', exact: true }).first().click();
    await page.getByRole('button', { name: '打印全班账号' }).click();
    await expect(page.locator('.learning-card')).toHaveCount(3);
    await expect(page.locator('.learning-card').filter({ hasText: '李明' })).toContainText('初始密码已使用');
    await expect(page.locator('.learning-card').filter({ hasText: '小雨' })).toContainText('初始密码已过期');
    await expect(page.locator('.initial-password')).toHaveCount(1);
  } finally { await context?.close(); await f.close(); }
});

test('旧拼音账号安全升级：只轮换待激活账号，保留正式密码、学号和成果', async () => {
  let pending, formal, unknown, oldSetup, oldNormal;
  const f = await fixture({ seed(directory) {
    const legacy = require('../fixtures/pinyin-accounts-before/store').openStore(directory);
    legacy.setAdmin('teacher', adminPassword);
    const group = legacy.createClass('旧账号班'); legacy.updateClass(group.id, group.name, ['unit13-14']);
    [pending, formal] = legacy.createStudents([{ name: '李明', pinyin: 'liming' }, { name: '小雨', pinyin: 'xiaoyu' }], group.id);
    legacy.changePassword(formal.id, 'Existing-permanent-2026!');
    legacy.saveProgress(formal.id, 'unit13-14', 3, { fixture: 'preserve-existing-data' });
    oldSetup = 'canran_student=' + legacy.session('student-setup', pending.id, Date.now());
    oldNormal = 'canran_student=' + legacy.session('student', formal.id, Date.now());
    legacy.close();
    const cards = require('../fixtures/learning-card-before/store').openStore(directory);
    unknown = cards.createStudent('😀', group.id); cards.close();
  } });
  try {
    const admin = await f.call('admin/login', { username: 'teacher', password: adminPassword });
    const pendingCard = (await f.call('admin/accounts', { studentId: pending.id }, admin.cookie)).body.accounts[0];
    expect(pendingCard.studentNumber).toBe(pending.studentNumber); expect(pendingCard.initialPassword).not.toBe('liming');
    expect(pendingCard.initialPassword).toMatch(/^[A-Za-z0-9_-]{16}$/);
    expect((await f.call('login', { studentNumber: pending.studentNumber, password: 'liming' })).status).toBe(401);
    expect((await f.call('me', undefined, oldSetup)).status).toBe(401);
    expect((await f.call('me', undefined, oldNormal)).body.student.id).toBe(formal.id);
    expect((await f.call('login', { studentNumber: formal.studentNumber, password: 'Existing-permanent-2026!' })).status).toBe(200);
    const unknownCard = (await f.call('admin/accounts', { studentId: unknown.id }, admin.cookie)).body.accounts[0];
    expect(unknownCard.initialPasswordState).toBe('unverified'); expect(unknownCard.initialPassword).toBeNull();
    await f.restart();
    const again = (await f.call('admin/accounts', { studentId: pending.id }, admin.cookie)).body.accounts[0];
    expect(again.initialPassword).toBe(pendingCard.initialPassword); expect(again.initialPasswordExpiresAt).toBe(pendingCard.initialPasswordExpiresAt);
    const db = new DatabaseSync(path.join(f.directory, 'learning.sqlite'));
    expect(db.prepare('SELECT generation,value FROM progress WHERE student=?').get(formal.id)).toEqual({ generation: 3, value: '{"fixture":"preserve-existing-data"}' });
    expect(db.prepare('SELECT initialPassword FROM students WHERE id=?').get(pending.id).initialPassword).not.toBe(pendingCard.initialPassword);
    db.close();
    expect((await f.call('login', { studentNumber: pending.studentNumber, password: pendingCard.initialPassword })).status).toBe(200);
  } finally { await f.close(); }
});

test('直连时伪造转发头不能换限流身份', async () => {
  const f = await fixture();
  try {
    for (let i = 0; i < 120; i++) await f.call('admin/login', { username: 'unknown', password: 'wrong' }, null, '192.0.2.' + (i + 1));
    expect((await f.call('admin/login', { username: 'teacher', password: adminPassword }, null, '198.51.100.1', { 'X-Real-IP': '198.51.100.2', Forwarded: 'for=198.51.100.3' })).status).toBe(429);
  } finally { await f.close(); }
});

test('可信代理必须提交单个合法地址；IPv4 映射和 IPv6 写法不能绕过限制', async () => {
  const f = await fixture({ trustProxy: 'loopback' });
  try {
    for (const value of [undefined, 'not-an-ip', '192.0.2.1:80', '[::1]', '192.0.2.1, 192.0.2.2', '::1%lo0']) {
      expect((await f.call('admin/login', { username: 'teacher', password: adminPassword }, null, value)).status).toBe(400);
    }
    const duplicate = await new Promise((resolve, reject) => {
      const data = JSON.stringify({ username: 'teacher', password: adminPassword });
      const req = http.request(f.address() + '/lesson/api/admin/login', { method: 'POST', headers: ['Origin', f.address(), 'Content-Type', 'application/json', 'Content-Length', String(Buffer.byteLength(data)), 'X-Forwarded-For', '192.0.2.1', 'x-forwarded-for', '192.0.2.2'] }, res => { res.resume(); res.on('end', () => resolve(res.statusCode)); });
      req.on('error', reject); req.end(data);
    });
    expect(duplicate).toBe(400);
    for (const [normal, alternate] of [['192.0.2.1', '::ffff:c000:201'], ['2001:db8::1', '2001:0DB8:0000:0000:0000:0000:0000:0001']]) {
      for (let i = 0; i < 120; i++) await f.call('admin/login', { username: 'unknown', password: 'wrong' }, null, normal);
      expect((await f.call('admin/login', { username: 'teacher', password: adminPassword }, null, alternate)).status).toBe(429);
    }
    const { clientAddress } = require('../../server/client-address');
    const request = { socket: { remoteAddress: '::ffff:127.0.0.1' }, rawHeaders: ['X-Forwarded-For', '192.0.2.3'], headers: { 'x-forwarded-for': '192.0.2.3' } };
    expect(clientAddress(request, 'loopback')).toBe('192.0.2.3');
    request.socket.remoteAddress = '203.0.113.1';
    expect(clientAddress(request, 'loopback')).toBe('203.0.113.1');
  } finally { await f.close(); }
});

test('经过真实 HTTP 代理覆盖转发头后，客户端伪造来源仍被同一来源限流', async () => {
  const f = await fixture({ trustProxy: 'loopback' }); let proxy;
  try {
    proxy = http.createServer((req, res) => {
      const upstream = http.request(f.address() + req.url, { method: req.method, headers: { ...req.headers, 'x-forwarded-for': req.socket.remoteAddress } }, result => { res.writeHead(result.statusCode, result.headers); result.pipe(res); });
      upstream.on('error', () => res.writeHead(502).end()); req.pipe(upstream);
    });
    await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve));
    const endpoint = 'http://127.0.0.1:' + proxy.address().port + '/lesson/api/admin/login';
    for (let i = 0; i < 121; i++) {
      const response = await fetch(endpoint, { method: 'POST', headers: { Origin: f.address(), 'Content-Type': 'application/json', 'X-Forwarded-For': '192.0.2.' + (i + 1) }, body: JSON.stringify(i === 120 ? { username: 'teacher', password: adminPassword } : { username: 'unknown', password: 'wrong' }) });
      await response.arrayBuffer(); if (i === 120) expect(response.status).toBe(429);
    }
  } finally { if (proxy) await new Promise(resolve => proxy.close(resolve)); await f.close(); }
});

test('部署合同要求显式可信代理，Nginx 覆写来源且不追加客户端输入', async () => {
  const { spawnSync } = require('node:child_process');
  const nginx = await fs.readFile(path.join(root, 'deploy/login/nginx.conf'), 'utf8');
  const service = await fs.readFile(path.join(root, 'deploy/login/canran-lesson.service'), 'utf8');
  expect(nginx).toMatch(/proxy_set_header X-Forwarded-For \$remote_addr;/);
  expect(nginx).not.toContain('$proxy_add_x_forwarded_for');
  expect(service).toContain('Environment=LESSON_TRUST_PROXY=loopback');
  for (const trust of ['', 'true', '*']) {
    const result = spawnSync(process.execPath, ['server/run.js'], { cwd: root, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'production', LESSON_ORIGIN: 'https://school.invalid', LESSON_DATA_DIR: path.join(os.tmpdir(), 'canran-unused-security-data'), LESSON_TRUST_PROXY: trust } });
    expect(result.status).not.toBe(0); expect(result.stderr).toContain('LESSON_TRUST_PROXY');
  }
});

test('真实来源分别限流：攻击来源被拒绝后，其他学生及管理员仍能登录', async () => {
  const f = await fixture({ trustProxy: 'loopback' });
  try {
    const a = await learner(f, '李明', 'liming', '192.0.2.10');
    for (let i = 0; i < 120; i++) await f.call('admin/login', { username: 'unknown', password: 'wrong' }, null, '192.0.2.1');
    expect((await f.call('login', { studentNumber: a.studentNumber, password: a.initialPassword }, null, '192.0.2.1')).status).toBe(429);
    expect((await f.call('login', { studentNumber: a.studentNumber, password: a.initialPassword }, null, '192.0.2.2')).status).toBe(200);
    expect((await f.call('admin/login', { username: 'teacher', password: adminPassword }, null, '192.0.2.3')).status).toBe(200);
  } finally { await f.close(); }
});
