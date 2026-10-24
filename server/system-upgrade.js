'use strict';
// One explicit, backed-up cutover. Runtime reads never reset a learner.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync, backup } = require('node:sqlite');
const { UNITS } = require('./catalog');
const catalog = require('./award-catalog');
const { definition } = require('./progress');

const EPOCH = 'five-star-system-20261024-v1';
const MESSAGE = '课程体系已全面升级，未完成课程将重新开始，已获得的证书完整保留。';
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const date = value => typeof value === 'string' && value.length <= 50 && Number.isFinite(Date.parse(value));
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const paperCourses = new Set([...Array.from({ length: 20 }, (_, i) => `unit${i * 2 + 1}-${i * 2 + 2}`), 'unit49-50']);
const historyKey = /^unit(?:\d+)?(?:LegacyProgress|LegacySnapshot|HistoryProgress|HistorySnapshot|V153Progress|V153Snapshot)$/;
const quote = value => '"' + value.replaceAll('"', '""') + '"';

function fingerprint(db) {
  const tables = db.prepare("SELECT name,sql FROM sqlite_master WHERE type='table' ORDER BY name").all();
  return digest(JSON.stringify(tables.map(({ name, sql }) => [name, sql,
    db.prepare('SELECT * FROM ' + quote(name)).all().map(row => JSON.stringify(row)).sort()])));
}
function parse(value, description) {
  let result;
  try { result = JSON.parse(value); } catch { throw Error(description + '损坏，升级已停止；原数据未清除。'); }
  if (!object(result)) throw Error(description + '格式未知，升级已停止；原数据未清除。');
  return result;
}
function archiveId(who, item) {
  return digest(JSON.stringify([who, item.course, item.kind, item.edition, item.name, item.issuedAt]));
}
function paperReceipts(course, book) {
  const found = [], seen = new Set();
  function visit(snapshot, sourceKey, depth) {
    if (!object(snapshot) || depth > 8) throw Error('历史证书来源格式未知，升级已停止；原数据未清除。');
    const activity = snapshot.activity;
    if (activity === undefined) return;
    if (!object(activity)) throw Error('历史证书活动记录损坏，升级已停止；原数据未清除。');
    // Prefer the original inner archive over an enclosing later-course book.
    for (const [key, nested] of Object.entries(activity)) if (historyKey.test(key)) visit(nested, sourceKey ? sourceKey + '.' + key : key, depth + 1);
    for (const field of ['unitClassroomCertificateIssuedAt', 'unitCertificateIssuedAt']) {
      const issuedAt = activity[field];
      if (issuedAt === undefined || issuedAt === null || issuedAt === '') continue;
      if (!paperCourses.has(course) || !date(issuedAt)) throw Error('发现未支持或日期损坏的历史证书，升级已停止；请先核对原件。');
      const name = typeof activity.unitName === 'string' ? activity.unitName : '';
      const kind = field === 'unitClassroomCertificateIssuedAt' ? 'classroom' : 'original';
      const edition = 'legacy-paper:' + kind;
      const identity = JSON.stringify([name, issuedAt]);
      if (seen.has(identity)) continue;
      seen.add(identity);
      found.push({ course, kind: 'legacy-paper', edition, name, issuedAt,
        meta: { issuedAtField: field }, snapshot: structuredClone(snapshot), sourceKey: sourceKey || 'root' });
    }
  }
  visit(book, '', 0);
  return found;
}

function createSystemUpgrade({ db, directory, keyFile, transaction, learning }) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_upgrades(epoch TEXT PRIMARY KEY,appliedAt TEXT NOT NULL,backupDirectory TEXT NOT NULL,report TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS course_upgrade_state(student TEXT NOT NULL REFERENCES students(id),course TEXT NOT NULL,epoch TEXT NOT NULL,generation INTEGER NOT NULL,completed INTEGER NOT NULL,firstFullStarAt TEXT,certificateIds TEXT NOT NULL,PRIMARY KEY(student,course));
    CREATE TABLE IF NOT EXISTS certificate_archives(id TEXT PRIMARY KEY,student TEXT NOT NULL REFERENCES students(id),course TEXT NOT NULL,value TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS certificate_archives_owner ON certificate_archives(student,course);
  `);
  function systemUpgrade(who) {
    const row = db.prepare('SELECT epoch,appliedAt FROM system_upgrades WHERE epoch=?').get(EPOCH);
    return row ? { ...row, message: MESSAGE, affected: Boolean(who && db.prepare('SELECT 1 FROM course_upgrade_state WHERE student=? AND epoch=? LIMIT 1').get(who, EPOCH)) } : null;
  }
  function courseUpgrade(who, course) {
    const row = db.prepare('SELECT epoch,generation,completed,firstFullStarAt,certificateIds FROM course_upgrade_state WHERE student=? AND course=?').get(who, course);
    return row ? { ...row, completed: Boolean(row.completed), stars: row.completed ? 5 : 0, certificateIds: JSON.parse(row.certificateIds) } : null;
  }
  function certificateArchives(who, course) {
    return (course === undefined
      ? db.prepare('SELECT value FROM certificate_archives WHERE student=? ORDER BY course,id').all(who)
      : db.prepare('SELECT value FROM certificate_archives WHERE student=? AND course=? ORDER BY id').all(who, course)).map(row => JSON.parse(row.value));
  }
  function certificateArchive(who, id) {
    const row = db.prepare('SELECT value FROM certificate_archives WHERE student=? AND id=?').get(who, id);
    return row ? JSON.parse(row.value) : null;
  }
  async function applySystemUpgrade({ backupDirectory, root = path.resolve(__dirname, '..') } = {}) {
    const existing = db.prepare('SELECT report FROM system_upgrades WHERE epoch=?').get(EPOCH);
    if (existing) return { ...JSON.parse(existing.report), alreadyApplied: true };
    if (!backupDirectory) throw Error('统一升级必须指定新的独立备份目录。');
    const requested = path.resolve(backupDirectory);
    const target = path.join(fs.realpathSync(path.dirname(requested)), path.basename(requested));
    const relative = path.relative(fs.realpathSync(directory), target);
    if (!relative || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative))) throw Error('升级备份必须位于学习数据目录之外。');
    fs.mkdirSync(target, { mode: 0o700 });
    const databaseFile = path.join(target, 'learning.sqlite'), backupKey = path.join(target, 'card-key');
    await backup(db, databaseFile); fs.chmodSync(databaseFile, 0o600);
    fs.copyFileSync(keyFile, backupKey); fs.chmodSync(backupKey, 0o600);
    const snapshot = new DatabaseSync(databaseFile, { readOnly: true });
    let sourceFingerprint;
    try {
      if (snapshot.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw Error('升级备份完整性检查失败，未清除原数据。');
      sourceFingerprint = fingerprint(snapshot);
    } finally { snapshot.close(); }
    const keyHash = digest(fs.readFileSync(backupKey));
    const metadata = { format: 1, createdAt: new Date().toISOString(), purpose: EPOCH,
      databaseSha256: digest(fs.readFileSync(databaseFile)), cardKeySha256: keyHash, sourceFingerprint };
    fs.writeFileSync(path.join(target, 'backup.json'), JSON.stringify(metadata, null, 2) + '\n', { mode: 0o600 });

    return transaction(() => {
      const repeated = db.prepare('SELECT report FROM system_upgrades WHERE epoch=?').get(EPOCH);
      if (repeated) return { ...JSON.parse(repeated.report), alreadyApplied: true };
      if (fingerprint(db) !== sourceFingerprint || digest(fs.readFileSync(keyFile)) !== keyHash) throw Error('备份后学习数据发生变化；请停止服务后重新备份升级，原数据未清除。');
      const students = db.prepare('SELECT id,name FROM students ORDER BY id').all();
      const definitions = Object.fromEntries(UNITS.map(course => [course, definition(root, course, '/')]));
      const progressRows = db.prepare('SELECT student,course,generation,value FROM progress').all();
      const awardRows = db.prepare('SELECT student,course,edition,value FROM unit_awards').all();
      const progress = new Map(), awards = new Map(), receipts = new Map();
      const studentIds = new Set(students.map(student => student.id));
      for (const row of [...progressRows, ...awardRows]) if (!studentIds.has(row.student) || !UNITS.includes(row.course)) throw Error('发现未支持的学生或课程记录，升级已停止；请先核对备份。');
      for (const row of progressRows) {
        if (!Number.isSafeInteger(row.generation) || row.generation < 0 || row.generation >= Number.MAX_SAFE_INTEGER) throw Error('课程代次损坏，升级已停止。');
        const book = parse(row.value, '课程进度');
        progress.set(row.student + ':' + row.course, row);
        receipts.set(row.student + ':' + row.course, paperReceipts(row.course, book));
      }
      for (const row of awardRows) {
        const value = parse(row.value, '课程星数');
        if (!catalog[row.course]?.[row.edition] || value.edition !== row.edition || !object(value.zones)) throw Error('发现未知奖励版本，升级已停止；请先核对原纪念卡。');
        const zones = Object.values(value.zones);
        if (zones.length > 5 || zones.some(zone => !object(zone) || !date(zone.earnedAt)) ||
          (value.firstFullStarAt !== null && value.firstFullStarAt !== undefined && !date(value.firstFullStarAt)) ||
          (zones.length === 5 && !date(value.firstFullStarAt)) || (zones.length < 5 && value.firstFullStarAt)) throw Error('纪念卡获星或日期记录损坏，升级已停止。');
        const key = row.student + ':' + row.course;
        if (!awards.has(key)) awards.set(key, []);
        awards.get(key).push({ ...row, ledger: value, full: zones.length === 5 });
      }
      const plan = [];
      for (const student of students) for (const course of UNITS) {
        const key = student.id + ':' + course, unit = definitions[course], rows = awards.get(key) || [];
        if (unit.reward?.zones?.length !== 5) throw Error('当前课程未采用五星制，升级已停止：' + course);
        const archives = [...(receipts.get(key) || [])];
        for (const row of rows.filter(row => row.full)) archives.push({ course, kind: 'card', edition: row.edition,
          name: student.name, issuedAt: row.ledger.firstFullStarAt, meta: structuredClone(catalog[course][row.edition]),
          snapshot: structuredClone(row.ledger), sourceKey: 'unit_awards:' + row.edition, sourceValue: row.value });
        for (const archive of archives) archive.id = archiveId(student.id, archive);
        archives.sort((a, b) => {
          const preferred = item => item.kind === 'card' && item.edition === unit.reward.edition ? 0 : item.kind === 'legacy-paper' ? 1 : 2;
          return preferred(a) - preferred(b) || Date.parse(a.issuedAt) - Date.parse(b.issuedAt) || a.id.localeCompare(b.id);
        });
        plan.push({ student: student.id, course, unit, rows, archives, generation: (progress.get(key)?.generation || 0) + 1 });
      }
      // All inspection succeeds before the first reset write. The backup and
      // the transaction together protect both malformed data and interruption.
      const putArchive = db.prepare('INSERT INTO certificate_archives VALUES (?,?,?,?)');
      const putState = db.prepare('INSERT INTO course_upgrade_state VALUES (?,?,?,?,?,?,?)');
      const putProgress = db.prepare('INSERT INTO progress VALUES (?,?,?,?) ON CONFLICT(student,course) DO UPDATE SET generation=excluded.generation,value=excluded.value');
      const putAward = db.prepare('INSERT INTO unit_awards VALUES (?,?,?,?) ON CONFLICT(student,course,edition) DO UPDATE SET value=excluded.value');
      const report = { epoch: EPOCH, appliedAt: new Date().toISOString(), backupDirectory: target,
        students: students.length, courses: UNITS.length, courseStates: plan.length, completedCourses: 0, archivedCertificates: 0,
        resetIncompleteCourses: 0, revokedGrants: db.prepare('SELECT COUNT(*) AS n FROM grants').get().n, alreadyApplied: false };
      for (const item of plan) {
        const completed = item.archives.length > 0, original = item.archives[0];
        for (const archive of item.archives) putArchive.run(archive.id, item.student, item.course, JSON.stringify(archive));
        putState.run(item.student, item.course, EPOCH, item.generation, Number(completed), original?.issuedAt || null, JSON.stringify(item.archives.map(archive => archive.id)));
        putProgress.run(item.student, item.course, item.generation, '{}');
        learning.reset(item.student, item.course, item.generation);
        for (const row of item.rows.filter(row => !row.full)) db.prepare('DELETE FROM unit_awards WHERE student=? AND course=? AND edition=?').run(item.student, item.course, row.edition);
        if (completed && !item.rows.some(row => row.full && row.edition === item.unit.reward.edition)) {
          const value = { edition: item.unit.reward.edition,
            zones: Object.fromEntries(item.unit.reward.zones.map(zone => [zone.id, { earnedAt: original.issuedAt, retainedFrom: original.id }])),
            firstFullStarAt: original.issuedAt, retainedCompletion: true, retainedFrom: original.id };
          putAward.run(item.student, item.course, item.unit.reward.edition, JSON.stringify(value));
        }
        report.completedCourses += Number(completed);
        report.resetIncompleteCourses += Number(!completed);
        report.archivedCertificates += item.archives.length;
      }
      db.exec('DELETE FROM grants; DELETE FROM learning_submissions;');
      db.prepare('INSERT INTO system_upgrades VALUES (?,?,?,?)').run(EPOCH, report.appliedAt, target, JSON.stringify(report));
      return report;
    });
  }
  return { systemUpgrade, courseUpgrade, certificateArchives, certificateArchive, applySystemUpgrade };
}

module.exports = { EPOCH, MESSAGE, createSystemUpgrade };
