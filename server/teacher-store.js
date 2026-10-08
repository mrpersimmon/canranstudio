'use strict';
const crypto = require('node:crypto');
const { validPinyin } = require('./student-credentials');
const fail = (status, message) => Object.assign(Error(message), { status });
const uniqueIds = values => Array.isArray(values) && values.every(id => typeof id === 'string') && new Set(values).size === values.length;
const sameIds = (a, b) => a.length === b.length && a.every(id => b.includes(id));

// Teacher identities are distinct from students and the site administrator.
function teacherStore({ db, transaction, seal, unseal, encodePassword, passwordMatches, createSession, authThrottle }) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS teacher_numbers(sequence INTEGER PRIMARY KEY AUTOINCREMENT);
    CREATE TABLE IF NOT EXISTS teachers(
      id TEXT PRIMARY KEY, name TEXT NOT NULL, teacherNumber TEXT NOT NULL UNIQUE,
      loginPinyin TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1,
      passwordHash TEXT NOT NULL, mustChangePassword INTEGER NOT NULL DEFAULT 1,
      initialPassword TEXT, initialPasswordExpiresAt INTEGER,
      revision INTEGER NOT NULL DEFAULT 1, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS class_teachers(
      classId TEXT NOT NULL REFERENCES classes(id), teacherId TEXT NOT NULL REFERENCES teachers(id),
      PRIMARY KEY(classId,teacherId)
    );
    CREATE INDEX IF NOT EXISTS class_teachers_teacher ON class_teachers(teacherId,classId);
    CREATE TABLE IF NOT EXISTS management_audit(
      id INTEGER PRIMARY KEY AUTOINCREMENT, actorRole TEXT NOT NULL, actorId TEXT NOT NULL,
      action TEXT NOT NULL, target TEXT NOT NULL, details TEXT NOT NULL, createdAt INTEGER NOT NULL
    );
  `);
  const raw = id => typeof id === 'string' ? db.prepare('SELECT * FROM teachers WHERE id=?').get(id) : null;
  const classIds = id => db.prepare('SELECT classId FROM class_teachers WHERE teacherId=? ORDER BY classId').all(id).map(row => row.classId);
  const safe = row => row ? { id: row.id, name: row.name, teacherNumber: row.teacherNumber, loginPinyin: row.loginPinyin, active: !!row.active, mustChangePassword: !!row.mustChangePassword, revision: row.revision, classIds: classIds(row.id) } : null;
  const get = id => safe(raw(id));
  const audit = (actor, action, target, details = {}) => {
    if (!actor) return;
    db.prepare('INSERT INTO management_audit(actorRole,actorId,action,target,details,createdAt) VALUES (?,?,?,?,?,?)')
      .run(actor.role, actor.subject, action, target, JSON.stringify(details), Date.now());
  };
  const revoke = id => {
    db.prepare("DELETE FROM sessions WHERE subject=? AND role IN ('teacher','teacher-setup')").run(id);
    const teacher = raw(id);
    if (teacher) authThrottle.clear('teacher', teacher.teacherNumber);
    authThrottle.clear('teacher-password', id);
  };
  const validate = (name, pinyin, ids) => {
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 60) throw fail(400, '姓名请填写 1–60 个字');
    if (!validPinyin(pinyin)) throw fail(400, '请核对姓名拼音，使用小写字母，不加空格和声调；ü 用 v');
    if (!uniqueIds(ids) || ids.some(id => !db.prepare('SELECT 1 FROM classes WHERE id=?').get(id))) throw fail(400, '负责班级已变化，请刷新后重试');
  };
  const number = prefix => {
    let value;
    do {
      const sequence = Number(db.prepare('INSERT INTO teacher_numbers DEFAULT VALUES').run().lastInsertRowid);
      if (sequence > 9999999) throw fail(409, '老师工号已达到当前位数上限');
      value = prefix + '1' + String(sequence).padStart(7, '0');
    } while (db.prepare('SELECT 1 FROM admin WHERE lower(username)=?').get(value));
    return value;
  };
  const secret = (pinyin, previous) => {
    const issued = new Set(db.prepare('SELECT initialPassword FROM teachers WHERE loginPinyin=? AND initialPassword IS NOT NULL').all(pinyin).map(row => unseal(row.initialPassword)));
    const candidates = Array.from({ length: 1000 }, (_, i) => pinyin + String(i).padStart(3, '0')).filter(value => !issued.has(value));
    while (candidates.length) {
      const value = candidates.splice(crypto.randomInt(candidates.length), 1)[0];
      if (!previous || !passwordMatches(value, previous)) return { hash: encodePassword(value), sealed: seal(value), expires: Date.now() + 7 * 86400000 };
    }
    throw fail(409, '相同拼音的待领取密码已用完，请先完成首次改密');
  };
  const assign = (id, ids) => {
    db.prepare('DELETE FROM class_teachers WHERE teacherId=?').run(id);
    for (const classId of ids) db.prepare('INSERT INTO class_teachers VALUES (?,?)').run(classId, id);
  };
  const current = (id, revision) => {
    const row = raw(id);
    if (!row) throw fail(404, '老师不存在');
    if (!Number.isInteger(revision) || revision !== row.revision) throw fail(409, '老师信息已被更新，请刷新后核对再保存');
    return row;
  };
  const credential = (id, now = Date.now()) => {
    const row = raw(id);
    if (!row) throw fail(404, '老师不存在');
    const state = !row.mustChangePassword ? 'set' : !row.initialPassword ? 'used' : row.initialPasswordExpiresAt <= now ? 'expired' : 'ready';
    return { initialPassword: state === 'ready' ? unseal(row.initialPassword) : null, initialPasswordExpiresAt: row.initialPasswordExpiresAt, initialPasswordState: state };
  };
  return {
    get, classIds, audit, credential,
    list: () => db.prepare('SELECT * FROM teachers ORDER BY rowid').all().map(safe),
    checkIntegrity: () => { for (const row of db.prepare('SELECT initialPassword FROM teachers WHERE initialPassword IS NOT NULL').all()) unseal(row.initialPassword); },
    create({ name, pinyin, classIds: ids = [] }, actor) {
      return transaction(() => {
        validate(name, pinyin, ids);
        const id = crypto.randomUUID(), password = secret(pinyin), now = Date.now();
        db.prepare('INSERT INTO teachers(id,name,teacherNumber,loginPinyin,passwordHash,initialPassword,initialPasswordExpiresAt,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?)')
          .run(id, name.trim(), number(pinyin[0]), pinyin, password.hash, password.sealed, password.expires, now, now);
        assign(id, ids); audit(actor, 'teacher.create', id, { name: name.trim(), classIds: ids });
        return get(id);
      });
    },
    update({ id, name, pinyin, active, classIds: ids, revision }, actor) {
      return transaction(() => {
        const prior = current(id, revision); validate(name, pinyin, ids);
        if (typeof active !== 'boolean') throw fail(400, '请选择老师状态');
        db.prepare('UPDATE teachers SET name=?,loginPinyin=?,active=?,revision=revision+1,updatedAt=? WHERE id=?')
          .run(name.trim(), pinyin, active ? 1 : 0, Date.now(), id);
        const before = { name: prior.name, pinyin: prior.loginPinyin, active: !!prior.active, classIds: classIds(id) };
        assign(id, ids); if (!active || !!prior.active !== active) revoke(id);
        audit(actor, 'teacher.update', id, { before, after: { name: name.trim(), pinyin, active, classIds: ids } });
        return get(id);
      });
    },
    reset(id, revision, actor) {
      return transaction(() => {
        const prior = current(id, revision), password = secret(prior.loginPinyin, prior.passwordHash);
        db.prepare('UPDATE teachers SET passwordHash=?,mustChangePassword=1,initialPassword=?,initialPasswordExpiresAt=?,revision=revision+1,updatedAt=? WHERE id=?')
          .run(password.hash, password.sealed, password.expires, Date.now(), id);
        revoke(id); audit(actor, 'teacher.reset-password', id);
        return get(id);
      });
    },
    assignClass(classId, teacherIds, expectedIds, actor) {
      return transaction(() => {
        if (!db.prepare('SELECT 1 FROM classes WHERE id=?').get(classId)) throw fail(404, '班级不存在');
        if (!uniqueIds(teacherIds) || teacherIds.some(id => !raw(id))) throw fail(400, '请重新选择负责老师');
        const before = db.prepare('SELECT teacherId FROM class_teachers WHERE classId=?').all(classId).map(row => row.teacherId);
        if (!uniqueIds(expectedIds) || !sameIds(before, expectedIds)) throw fail(409, '负责老师已被更新，请刷新后核对再保存');
        db.prepare('DELETE FROM class_teachers WHERE classId=?').run(classId);
        for (const id of teacherIds) db.prepare('INSERT INTO class_teachers VALUES (?,?)').run(classId, id);
        for (const id of new Set([...before, ...teacherIds])) db.prepare('UPDATE teachers SET revision=revision+1,updatedAt=? WHERE id=?').run(Date.now(), id);
        audit(actor, 'class.assign-teachers', classId, { before, after: teacherIds });
      });
    },
    login(number, password, now = Date.now()) {
      return transaction(() => {
        const row = db.prepare('SELECT * FROM teachers WHERE teacherNumber=?').get(number.trim().toLowerCase());
        const matches = passwordMatches(password, row?.passwordHash || '00112233445566778899aabbccddeeff00:' + '00'.repeat(64));
        if (!matches || !row?.active) return null;
        if (!row.mustChangePassword) return get(row.id);
        if (!row.initialPassword || row.initialPasswordExpiresAt <= now) return null;
        db.prepare('UPDATE teachers SET initialPassword=NULL WHERE id=?').run(row.id); revoke(row.id);
        return { ...get(row.id), setupToken: createSession('teacher-setup', row.id, now, row.initialPasswordExpiresAt), setupExpiresAt: Math.min(now + 15 * 60000, row.initialPasswordExpiresAt) };
      });
    },
    validSession(id, setup, now) {
      const row = raw(id);
      return !!row?.active && (setup ? !!row.mustChangePassword && !row.initialPassword && row.initialPasswordExpiresAt > now : !row.mustChangePassword);
    },
    checkPassword(id, value) { const row = raw(id); return !!row && passwordMatches(value, row.passwordHash); },
    changePassword(id, value, actor) {
      return transaction(() => {
        db.prepare('UPDATE teachers SET passwordHash=?,mustChangePassword=0,initialPassword=NULL,initialPasswordExpiresAt=NULL,updatedAt=? WHERE id=?')
          .run(encodePassword(value), Date.now(), id);
        revoke(id); audit(actor, 'teacher.change-password', id);
      });
    }
  };
}
module.exports = { teacherStore };
