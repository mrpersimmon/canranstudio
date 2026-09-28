'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { openStore } = require('../../server/store');
const { createAuthThrottle } = require('../../server/auth-throttle');

test('grant renewal bounds allocation, preserves old IDs and isolates devices/courses', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-grant-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  let store = openStore(dir);
  const group = store.createClass('模拟班级');
  const [student, other] = store.createStudents([{ name: '李明', pinyin: 'liming' }, { name: '小雨', pinyin: 'xiaoyu' }], group.id);
  const now = Date.now(), session = store.lookupSession(store.session('student', student.id, now), 'student', now);
  const first = store.grant(session, 'unit13-14', now);
  store.close();
  let db = new DatabaseSync(path.join(dir, 'learning.sqlite'));
  // A pre-upgrade duplicate must remain usable by its original pending upload.
  db.prepare('INSERT INTO grants VALUES (?,?,?,?,?)').run('legacy-grant', session.hash, student.id, 'unit13-14', now - 1);
  for (const name of ['grants_expires', 'grants_session_expires', 'grants_session_course_expires']) db.exec('DROP INDEX ' + name);
  db.close();
  store = openStore(dir); t.after(() => store.close());
  for (let i = 1; i <= 100; i++) {
    const grant = store.grant(session, 'unit13-14', now + i * 1000);
    assert.equal(grant.id, first.id); assert.equal(grant.expires, now + i * 1000 + 7200000);
  }
  assert.ok(store.validGrant('legacy-grant', student.id, 'unit13-14'));
  assert.equal(store.validGrant('legacy-grant', other.id, 'unit13-14'), false);
  assert.equal(store.validGrant('legacy-grant', student.id, 'unit15-16'), false);
  const device = store.lookupSession(store.session('student', student.id, now), 'student', now);
  assert.notEqual(store.grant(device, 'unit13-14', now).id, first.id);
  assert.notEqual(store.grant(session, 'unit15-16', now).id, first.id);
  db = new DatabaseSync(path.join(dir, 'learning.sqlite')); t.after(() => db.close());
  assert.equal(db.prepare('SELECT count(*) AS n FROM grants').get().n, 4);
  for (const [sql, args, index] of [
    ['SELECT DISTINCT course FROM grants WHERE session=? AND expires>?', [session.hash, now], 'SEARCH grants USING (?:COVERING )?INDEX grants_session_(?:course_)?expires'],
    ['SELECT * FROM grants WHERE session=? AND course=? AND expires>? ORDER BY expires DESC LIMIT 1', [session.hash, 'unit13-14', now], 'grants_session_course_expires'],
    ['DELETE FROM grants WHERE expires<?', [now], 'grants_expires']
  ]) assert.match(db.prepare('EXPLAIN QUERY PLAN ' + sql).all(...args).map(row => row.detail).join(' '), new RegExp(index));
  // Password reset revokes the old session, while its original upload IDs survive.
  store.resetPassword(student.id, 'liming');
  assert.ok(store.validGrant(first.id, student.id, 'unit13-14'));
  assert.equal(db.prepare('SELECT count(*) AS n FROM sessions WHERE hash=?').get(session.hash).n, 0);
});

test('persistent failure windows survive reopen, expire without extension, and never clear source budgets', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-throttle-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const filename = path.join(dir, 'rate.sqlite');
  let db = new DatabaseSync(filename), rate = createAuthThrottle(db);
  const now = 1000000;
  for (let i = 0; i < 10; i++) { rate.check('192.0.2.' + i, 'student', 'a123', now + i * 60001); rate.failed('student', 'a123', now + i * 60001); }
  db.close(); db = new DatabaseSync(filename); t.after(() => db.close()); rate = createAuthThrottle(db);
  assert.throws(() => rate.check('198.51.100.1', 'student', 'a123', now + 600010), e => e.status === 429 && e.retryAfter === 300);
  assert.doesNotThrow(() => rate.check('198.51.100.2', 'student', 'someone-else', now + 600010));
  // The denied request did not move the original 15-minute deadline.
  assert.doesNotThrow(() => rate.check('198.51.100.1', 'student', 'a123', now + 900000));
  for (let i = 0; i < 120; i++) { rate.check('203.0.113.1', 'admin', 'teacher', now + 900001); rate.clear('admin', 'teacher'); }
  assert.throws(() => rate.check('203.0.113.1', 'student', 'another', now + 900001), e => e.status === 429 && e.retryAfter === 60);
  const keys = db.prepare('SELECT key FROM auth_throttle').all().map(row => row.key).join(' ');
  assert.ok(!keys.includes('teacher') && !keys.includes('a123') && !keys.includes('203.0.113.1'));
});

test('throttle state stays bounded and refuses new identities without evicting active budgets', t => {
  const db = new DatabaseSync(':memory:'); t.after(() => db.close());
  const rate = createAuthThrottle(db), now = 1000000;
  const insert = db.prepare('INSERT INTO auth_throttle VALUES (?,?,?)');
  db.exec('BEGIN');
  for (let i = 0; i < 10000; i++) insert.run('retained:' + i, 10, now + 900000);
  db.exec('COMMIT');
  assert.throws(() => rate.check('192.0.2.1', 'student', 'new', now), e => e.status === 429);
  assert.equal(db.prepare('SELECT count(*) AS n FROM auth_throttle').get().n, 10000);
  assert.doesNotThrow(() => rate.check('192.0.2.1', 'student', 'new', now + 900000));
});

test('opening an existing data directory restores private directory and key modes', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-modes-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  let store = openStore(dir); store.close();
  fs.chmodSync(dir, 0o755); fs.chmodSync(path.join(dir, 'card-key'), 0o644);
  store = openStore(dir); t.after(() => store.close());
  assert.equal(fs.statSync(dir).mode & 0o777, 0o700);
  assert.equal(fs.statSync(path.join(dir, 'card-key')).mode & 0o777, 0o600);
  assert.equal(fs.statSync(path.join(dir, 'learning.sqlite')).mode & 0o777, 0o600);
});
