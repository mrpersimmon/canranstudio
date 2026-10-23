'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const { createCoursePackages } = require('../../scripts/course-packages');
const { createApp } = require('../../server/app');
const { openStore } = require('../../server/store');
const { UNITS } = require('../../server/catalog');
const root = path.resolve(__dirname, '../..');
const etag = body => '"' + createHash('sha256').update(body).digest('hex') + '"';

// Build real packages: a lesson change must invalidate only that lesson's
// status, while emergency withdrawals must reach every open lesson.
test('static update metadata stays small, versioned and outside lesson dependencies', async () => {
  const options = { root, basePath: '/lesson/', courseIds: ['unit1-2', 'unit3-4'] };
  const first = await createCoursePackages(options);
  const readSource = async relative => {
    const bytes = await fs.readFile(path.join(root, relative));
    return relative === 'unit1-2/index.html' ? Buffer.concat([bytes, Buffer.from('\n<!-- metadata regression update -->')]) : bytes;
  };
  const changed = await createCoursePackages({ ...options, readSource });
  const withdrawn = ['unit1-2@' + first.index.courses['unit1-2'].revision];
  const revoked = await createCoursePackages({ ...options, readSource: relative => relative === 'core/course-withdrawals.json' ? Buffer.from(JSON.stringify(withdrawn)) : readSource(relative) });
  for (const courseId of options.courseIds) {
    for (const kind of ['course-status', 'course-withdrawals']) {
      const file = kind + '/' + courseId + '.json', item = first.generated.get(file);
      assert.ok(item, file + ' must be a separately generated metadata document');
      assert.ok(item.body.length < 1024, file + ' must not carry the full course index');
      assert.equal(item.etag, etag(item.body));
      assert.equal(item.immutable, undefined);
      const expected = { schema: 1, protocol: 1, basePath: options.basePath, courseId, ...(kind === 'course-status' ? { descriptor: first.index.courses[courseId] } : {}), withdrawn: [] };
      assert.deepEqual(JSON.parse(item.body), expected);
      assert.deepEqual(JSON.parse(revoked.generated.get(file).body).withdrawn, withdrawn);
      assert.notEqual(revoked.generated.get(file).etag, changed.generated.get(file).etag);
    }
    const pack = JSON.parse(first.generated.get(first.index.courses[courseId].manifest.slice(options.basePath.length)).body);
    assert.ok([...pack.required, ...pack.audio].every(item => !/course-(?:status|withdrawals)\//.test(item.key)));
  }
  assert.notEqual(first.generated.get('course-status/unit1-2.json').etag, changed.generated.get('course-status/unit1-2.json').etag);
  assert.equal(first.generated.get('course-status/unit3-4.json').etag, changed.generated.get('course-status/unit3-4.json').etag);
  assert.equal(first.generated.get('course-withdrawals/unit1-2.json').etag, changed.generated.get('course-withdrawals/unit1-2.json').etag);
});

for (const basePath of ['/', '/lesson/']) test('conditional metadata HTTP authorizes before 304 at ' + basePath, async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-update-metadata-'));
  let server, store, db;
  t.after(async () => {
    if (server?.listening) await new Promise(resolve => server.close(resolve));
    db?.close(); store?.close();
    const target = path.resolve(directory), temp = path.resolve(os.tmpdir()) + path.sep;
    assert.ok(target.startsWith(temp) && path.basename(target).startsWith('canran-update-metadata-'));
    await fs.rm(target, { recursive: true, force: true });
  });
  store = openStore(directory);
  const group = store.createClass('更新元数据临时班');
  store.updateClass(group.id, group.name, ['unit1-2']);
  const [student, setup] = store.createStudents([{ name: '测试同学', pinyin: 'ceshitongxue' }, { name: '待设密码', pinyin: 'daishemima' }], group.id);
  store.changePassword(student.id, 'Metadata-test-only-2026!');
  const token = store.session('student', student.id, Date.now());
  const cookie = 'canran_student=' + token;
  const auth = store.lookupSession(token, 'student', Date.now());
  const bundle = await createCoursePackages({ root, basePath, courseIds: UNITS, isolatedDefinitions: true });
  server = await createApp({ root, dataDir: directory, origin: 'http://127.0.0.1', basePath, bundle });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const get = (route, headers = {}, method = 'GET') => fetch(origin + basePath + route, { method, headers });
  db = new DatabaseSync(path.join(directory, 'learning.sqlite'));
  const records = () => Object.fromEntries(['progress', 'unit_awards', 'learning_submissions'].map(name => [name, db.prepare('SELECT * FROM ' + name).all()]));
  const before = records();
  for (const kind of ['course-status', 'course-withdrawals']) {
    const route = kind + '/unit1-2.json';
    const initial = await get(route, { Cookie: cookie });
    assert.equal(initial.status, 200, route + ' must be served to its learner');
    const body = Buffer.from(await initial.arrayBuffer()), tag = initial.headers.get('etag');
    assert.ok(body.length < 1024); assert.equal(tag, etag(body));
    assert.equal(initial.headers.get('cache-control'), 'private, no-cache');
    assert.equal(initial.headers.get('vary'), 'Cookie');
    assert.deepEqual(body, bundle.generated.get(route).body);
    for (const method of ['GET', 'HEAD']) {
      const unchanged = await get(route, { Cookie: cookie, 'If-None-Match': tag }, method);
      assert.equal(unchanged.status, 304); assert.equal(await unchanged.text(), '');
      assert.equal(unchanged.headers.get('etag'), tag);
      assert.equal(unchanged.headers.get('cache-control'), 'private, no-cache');
      assert.equal((await get(route, { 'If-None-Match': tag }, method)).status, 401);
      assert.equal((await get(kind + '/unit3-4.json', { Cookie: cookie, 'If-None-Match': '*' }, method)).status, 403);
    }
    const head = await get(route, { Cookie: cookie }, 'HEAD');
    assert.equal(head.status, 200); assert.equal(await head.text(), ''); assert.equal(head.headers.get('etag'), tag);
    assert.equal((await get(route, { Cookie: cookie, 'If-None-Match': '"outdated"' })).status, 200);
    assert.equal((await get(route, { Cookie: cookie, 'If-None-Match': '"other", W/' + tag })).status, 304);
    const setupCookie = 'canran_student=' + store.session('student', setup.id, Date.now());
    assert.equal((await get(route, { Cookie: setupCookie, 'If-None-Match': tag })).status, 403);
    // A live lesson grant survives a class's course-list change; polling must
    // retain that existing continuation contract, including its own 304.
    store.grant(auth, 'unit1-2', Date.now());
    store.updateClass(group.id, group.name, []);
    assert.equal((await get(route, { Cookie: cookie, 'If-None-Match': tag })).status, 304);
    // Force the inactive-account branch with a still-existing session/grant.
    // The endpoint must not leak even a cached validator to a disabled user.
    db.prepare('UPDATE students SET active=0 WHERE id=?').run(student.id);
    assert.equal((await get(route, { Cookie: cookie, 'If-None-Match': tag })).status, 403);
    db.prepare('UPDATE students SET active=1 WHERE id=?').run(student.id);
    store.updateClass(group.id, group.name, ['unit1-2']);
  }
  assert.deepEqual(records(), before, 'metadata reads must leave progress, certificates and earned dates untouched');
});
