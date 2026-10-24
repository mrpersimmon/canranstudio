'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { openStore } = require('../../server/store');
const { EPOCH, MESSAGE } = require('../../server/system-upgrade');
const { definition } = require('../../server/progress');
const root = path.resolve(__dirname, '../..');
const unit = course => definition(root, course, '/');

function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'canran-system-upgrade-')), directory = path.join(base, 'live');
  const store = openStore(directory), group = store.createClass('统一升级验收班');
  const [first, second] = store.createStudents([{ name: '原获奖姓名', pinyin: 'yuanhuojiang' }, { name: '未通关同学', pinyin: 'weitongguan' }], group.id);
  let closed = false;
  const close = () => { if (!closed) { store.close(); closed = true; } };
  t.after(() => { close(); assert(path.resolve(base).startsWith(path.resolve(os.tmpdir()) + path.sep)); fs.rmSync(base, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 }); });
  return { base, directory, store, first, second, group, close, backup: path.join(base, 'backup') };
}
function read(directory, query, ...args) {
  const db = new DatabaseSync(path.join(directory, 'learning.sqlite'), { readOnly: true });
  try { return db.prepare(query).all(...args); } finally { db.close(); }
}
function seedAwards(store, who, course, count = 5, reward = unit(course).reward) {
  return store.grantAwards(who, course, reward, reward.zones.slice(0, count).map(zone => [zone.id, { runId: 'valid-completed-round' }]));
}

test('explicit cutover backs up exact rows and key, preserves full originals, and resets all old student courses only once', async t => {
  const f = fixture(t), course = 'unit1-2', current = unit(course);
  const full = seedAwards(f.store, f.first.id, course);
  seedAwards(f.store, f.second.id, course, 2);
  const oldBook = { version: 1, groups: { draft: { index: 3, states: [{ firstCorrect: false }] } }, records: { old: { attempts: 2 } }, activity: {} };
  f.store.saveProgress(f.first.id, course, 4, oldBook); f.store.saveProgress(f.second.id, course, 2, oldBook);
  const token = f.store.session('student', f.second.id, Date.now()), auth = f.store.lookupSession(token, 'student', Date.now());
  const oldGrant = f.store.grant(auth, 'unit143-144', Date.now());
  const originalRow = read(f.directory, 'SELECT value FROM unit_awards WHERE student=? AND course=? AND edition=?', f.first.id, course, current.reward.edition)[0].value;
  const key = fs.readFileSync(path.join(f.directory, 'card-key'));
  assert.equal(f.store.systemUpgrade(f.first.id), null);
  const result = await f.store.applySystemUpgrade({ backupDirectory: f.backup });
  assert.equal(result.epoch, EPOCH); assert.equal(result.courseStates, 144); assert.equal(result.completedCourses, 1);
  assert.equal(result.archivedCertificates, 1); assert.equal(result.resetIncompleteCourses, 143);
  assert.equal(result.revokedGrants, 1);
  assert.equal(f.store.systemUpgrade(f.first.id).message, MESSAGE);
  assert.equal(f.store.courseUpgrade(f.first.id, course).completed, true);
  assert.equal(f.store.courseUpgrade(f.second.id, course).completed, false);
  assert.equal(f.store.progress(f.first.id, course).generation, 5);
  assert.deepEqual(f.store.progress(f.first.id, course).value, {});
  assert.equal(f.store.progress(f.second.id, course).generation, 3);
  assert.equal(f.store.progress(f.second.id, 'unit143-144').generation, 1, 'Even never-uploaded offline courses must reject generation zero');
  assert.equal(f.store.validGrant(oldGrant.id, f.second.id, 'unit143-144'), false);
  assert.equal(Object.keys(f.store.award(f.second.id, course, current.reward.edition).zones).length, 0);
  assert.equal(read(f.directory, 'SELECT value FROM unit_awards WHERE student=? AND course=? AND edition=?', f.first.id, course, current.reward.edition)[0].value, originalRow);
  assert.deepEqual(f.store.award(f.first.id, course, current.reward.edition), full);
  assert.deepEqual(fs.readFileSync(path.join(f.backup, 'card-key')), key);
  assert.equal(JSON.parse(fs.readFileSync(path.join(f.backup, 'backup.json'))).format, 1);
  assert.equal(read(f.backup, 'SELECT value FROM progress WHERE student=? AND course=?', f.second.id, course)[0].value, JSON.stringify(oldBook));
  assert.equal(read(f.backup, 'SELECT COUNT(*) AS n FROM grants')[0].n, 1);
  const archive = f.store.certificateArchives(f.first.id)[0];
  assert.equal(archive.kind, 'card'); assert.equal(archive.name, f.first.name); assert.equal(archive.issuedAt, full.firstFullStarAt);
  assert.equal(archive.sourceValue, originalRow); assert.deepEqual(archive.snapshot, full);
  assert.deepEqual(f.store.certificateArchive(f.first.id, archive.id), archive);
  assert.equal(f.store.certificateArchive(f.second.id, archive.id), null, 'Certificate IDs never bypass ownership');
  f.store.updateStudent(f.first.id, '后来改过的名字', f.group.id, true);
  assert.equal(f.store.certificateArchive(f.first.id, archive.id).name, '原获奖姓名', 'Account edits cannot rewrite the archived certificate name');
  // A new genuine round after cutover must survive repeated management commands.
  const fresh = { version: 1, activity: { unitCompleted: {} }, groups: {}, records: { fresh: { attempts: 1 } } };
  f.store.saveProgress(f.second.id, course, 3, fresh);
  seedAwards(f.store, f.second.id, course, 1);
  const repeated = await f.store.applySystemUpgrade({ backupDirectory: path.join(f.base, 'unused-second-backup') });
  assert.equal(repeated.alreadyApplied, true); assert(!fs.existsSync(path.join(f.base, 'unused-second-backup')));
  assert.deepEqual(f.store.progress(f.second.id, course).value, fresh);
  assert.equal(Object.keys(f.store.award(f.second.id, course, current.reward.edition).zones).length, 1);
  f.close(); const reopened = openStore(f.directory);
  try {
    assert.equal(reopened.systemUpgrade(f.first.id).affected, true);
    assert.deepEqual(reopened.progress(f.second.id, course).value, fresh);
    const newStudent = reopened.createStudents([{ name: '新同学', pinyin: 'xintongxue' }], f.group.id)[0];
    assert.equal(reopened.systemUpgrade(newStudent.id).epoch, EPOCH); assert.equal(reopened.systemUpgrade(newStudent.id).affected, false);
    assert.equal(reopened.courseUpgrade(newStudent.id, course), null);
  } finally { reopened.close(); }
});

test('old full-card editions and issued legacy paper receipts archive independently and retain five stars without invented answers', async t => {
  const f = fixture(t), course = 'unit3-4', current = unit(course);
  const oldReward = { edition: 'story-card-v1', zones: ['listen', 'roles', 'manners', 'reply', 'exam'].map(id => ({ id })) };
  const previous = seedAwards(f.store, f.first.id, course, 5, oldReward);
  seedAwards(f.store, f.first.id, course, 1);
  const issuedAt = '2020-07-02T16:05:06.789Z';
  const snapshot = { version: 1, groups: { 'unit3738-exam-practice/v1': { index: 15 } }, records: { old: { target: '原成果摘录', attempts: 2 } },
    activity: { unitName: '原纸证姓名', unitClassroomCertificateIssuedAt: issuedAt, unitCertificateIssuedAt: issuedAt } };
  f.store.saveProgress(f.first.id, 'unit37-38', 0, { version: 1, groups: {}, records: {}, activity: { unit3738LegacyProgress: snapshot } });
  const result = await f.store.applySystemUpgrade({ backupDirectory: f.backup });
  assert.equal(result.completedCourses, 2); assert.equal(result.archivedCertificates, 2, 'Duplicate receipt fields do not manufacture duplicate certificates');
  const preserved = f.store.award(f.first.id, course, current.reward.edition);
  assert.equal(Object.keys(preserved.zones).length, 5); assert.equal(preserved.firstFullStarAt, previous.firstFullStarAt);
  assert.equal(preserved.retainedCompletion, true);
  assert(Object.values(preserved.zones).every(zone => zone.retainedFrom && !zone.runId));
  assert.deepEqual(f.store.progress(f.first.id, course).value, {}, 'Retained completion never synthesizes current answers or claims');
  const archive = f.store.certificateArchives(f.first.id, 'unit37-38')[0];
  assert.equal(archive.kind, 'legacy-paper'); assert.equal(archive.name, '原纸证姓名'); assert.equal(archive.issuedAt, issuedAt);
  assert.equal(archive.sourceKey, 'unit3738LegacyProgress'); assert.deepEqual(archive.snapshot, snapshot);
  assert.equal(f.store.courseUpgrade(f.first.id, 'unit37-38').firstFullStarAt, issuedAt);
  assert.equal(f.store.award(f.first.id, 'unit37-38', unit('unit37-38').reward.edition).firstFullStarAt, issuedAt);
});

test('a backup failure leaves progress and awards untouched', async t => {
  const f = fixture(t); const full = seedAwards(f.store, f.first.id, 'unit1-2');
  f.store.saveProgress(f.first.id, 'unit1-2', 7, { activity: { test: true } });
  fs.mkdirSync(f.backup);
  await assert.rejects(f.store.applySystemUpgrade({ backupDirectory: f.backup }), /EEXIST/);
  assert.equal(f.store.systemUpgrade(f.first.id), null); assert.equal(f.store.progress(f.first.id, 'unit1-2').generation, 7);
  assert.deepEqual(f.store.award(f.first.id, 'unit1-2', unit('unit1-2').reward.edition), full);
  await assert.rejects(f.store.applySystemUpgrade({ backupDirectory: path.join(f.directory, 'inside') }), /目录之外/);
});

test('corrupt or unsupported evidence stops the entire transaction after a recoverable backup', async t => {
  const f = fixture(t); seedAwards(f.store, f.first.id, 'unit1-2');
  f.store.saveProgress(f.first.id, 'unit1-2', 4, { activity: {} });
  f.store.saveProgress(f.second.id, 'unit37-38', 2, { activity: { unitCertificateIssuedAt: 'not-a-date' } });
  const prior = read(f.directory, 'SELECT * FROM progress ORDER BY student,course');
  await assert.rejects(f.store.applySystemUpgrade({ backupDirectory: f.backup }), /日期损坏/);
  assert.deepEqual(read(f.directory, 'SELECT * FROM progress ORDER BY student,course'), prior);
  assert.equal(f.store.systemUpgrade(f.first.id), null);
  assert.equal(f.store.certificateArchives(f.first.id).length, 0);
  assert.equal(read(f.backup, 'PRAGMA integrity_check')[0].integrity_check, 'ok');
  assert.equal(read(f.backup, 'SELECT COUNT(*) AS n FROM unit_awards')[0].n, 1);
});

test('startup alone is nondestructive and the explicit command requires a backup destination', async t => {
  const f = fixture(t), course = 'unit1-2';
  seedAwards(f.store, f.first.id, course, 2); f.store.saveProgress(f.first.id, course, 2, { activity: { unfinished: true } });
  f.close(); const reopened = openStore(f.directory);
  try {
    assert.equal(reopened.systemUpgrade(), null); assert.equal(reopened.progress(f.first.id, course).generation, 2);
    assert.equal(Object.keys(reopened.award(f.first.id, course, unit(course).reward.edition).zones).length, 2);
    await assert.rejects(reopened.applySystemUpgrade(), /必须指定/);
  } finally { reopened.close(); }
});

test('a genuine write after the backup snapshot aborts the cutover instead of discarding new learning', async t => {
  const f = fixture(t), course = 'unit1-2';
  const original = { activity: { marker: 'before-backup' } }, newer = { activity: { marker: 'after-backup' } };
  f.store.saveProgress(f.first.id, course, 2, original);
  const copy = fs.copyFileSync;
  let changed = false;
  t.mock.method(fs, 'copyFileSync', (...args) => {
    const result = copy(...args);
    if (!changed && args[1] === path.join(f.backup, 'card-key')) {
      changed = true; f.store.saveProgress(f.first.id, course, 2, newer);
    }
    return result;
  });
  await assert.rejects(f.store.applySystemUpgrade({ backupDirectory: f.backup }), /备份后学习数据发生变化/);
  assert(changed); assert.equal(f.store.systemUpgrade(f.first.id), null);
  assert.deepEqual(f.store.progress(f.first.id, course), { generation: 2, value: newer });
  assert.equal(read(f.backup, 'SELECT value FROM progress WHERE student=? AND course=?', f.first.id, course)[0].value, JSON.stringify(original));
});

test('the paired backup restores old partial stars and exact progress without auto-applying the destructive migration', async t => {
  const f = fixture(t), course = 'unit3-4';
  const partial = seedAwards(f.store, f.second.id, course, 3);
  const original = { version: 1, groups: { old: { index: 2 } }, records: {}, activity: { marker: 'original' } };
  f.store.saveProgress(f.second.id, course, 8, original);
  await f.store.applySystemUpgrade({ backupDirectory: f.backup });
  const restoredDirectory = path.join(f.base, 'restored'); fs.mkdirSync(restoredDirectory);
  for (const name of ['learning.sqlite', 'card-key']) fs.copyFileSync(path.join(f.backup, name), path.join(restoredDirectory, name));
  const restored = openStore(restoredDirectory);
  try {
    restored.checkIntegrity(); assert.equal(restored.systemUpgrade(f.second.id), null);
    assert.deepEqual(restored.progress(f.second.id, course), { generation: 8, value: original });
    assert.deepEqual(restored.award(f.second.id, course, unit(course).reward.edition), partial);
  } finally { restored.close(); }
});
