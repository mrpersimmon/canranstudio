'use strict';
const { DatabaseSync, backup } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { UNITS } = require('./catalog');
const { suggestPinyin, validPinyin } = require('./student-credentials');
const { createAuthThrottle } = require('./auth-throttle');
const { learningStore } = require('./learning-store');
const { teacherStore } = require('./teacher-store');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const token = () => crypto.randomBytes(32).toString('base64url');
const id = () => crypto.randomUUID();
const INITIAL_PASSWORD_TTL = 7 * 86400000;
const DUMMY_PASSWORD_HASH = '00112233445566778899aabbccddeeff00:' + '00'.repeat(64);
const encodePassword = password => { const salt = crypto.randomBytes(16).toString('hex'); return salt + ':' + crypto.scryptSync(password, salt, 64).toString('hex'); };
function passwordMatches(password, encoded) {
  const [salt, expected] = encoded.split(':');
  const actual = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
function openStore(directory) {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  fs.chmodSync(directory, 0o700);
  const filename = path.join(directory, 'learning.sqlite');
  const db = new DatabaseSync(filename);
  fs.chmodSync(filename, 0o600);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS admin (username TEXT PRIMARY KEY, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS classes (id TEXT PRIMARY KEY, name TEXT NOT NULL, courses TEXT NOT NULL DEFAULT '[]');
    CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, name TEXT NOT NULL, classId TEXT NOT NULL REFERENCES classes(id), active INTEGER NOT NULL DEFAULT 1, codeHash TEXT NOT NULL UNIQUE, card TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, role TEXT NOT NULL, subject TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS grants (id TEXT PRIMARY KEY, session TEXT NOT NULL, student TEXT NOT NULL, course TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS grants_expires ON grants(expires);
    CREATE INDEX IF NOT EXISTS grants_session_expires ON grants(session,expires);
    CREATE INDEX IF NOT EXISTS grants_session_course_expires ON grants(session,course,expires DESC);
    CREATE TABLE IF NOT EXISTS progress (student TEXT NOT NULL, course TEXT NOT NULL, generation INTEGER NOT NULL DEFAULT 0, value TEXT NOT NULL DEFAULT '{}', PRIMARY KEY(student, course));
    CREATE TABLE IF NOT EXISTS unit_awards (student TEXT NOT NULL REFERENCES students(id), course TEXT NOT NULL, edition TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY(student, course, edition));
  `);
  const keyFile = path.join(directory, 'card-key');
  if (!fs.existsSync(keyFile) && (db.prepare('SELECT 1 FROM students LIMIT 1').get() || (db.prepare("SELECT 1 FROM sqlite_master WHERE name='teachers'").get() && db.prepare('SELECT 1 FROM teachers LIMIT 1').get()))) { db.close(); throw Error('学习卡密钥缺失，请恢复与数据库配套的 card-key；不会生成新密钥覆盖旧卡。'); }
  if (!fs.existsSync(keyFile)) fs.writeFileSync(keyFile, crypto.randomBytes(32), { mode: 0o600, flag: 'wx' });
  fs.chmodSync(keyFile, 0o600);
  const key = fs.readFileSync(keyFile);
  const seal = value => { const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', key, iv); return Buffer.concat([iv, cipher.update(value), cipher.final(), cipher.getAuthTag()]).toString('base64'); };
  const unseal = value => { const bytes = Buffer.from(value, 'base64'), decipher = crypto.createDecipheriv('aes-256-gcm', key, bytes.subarray(0, 12)); decipher.setAuthTag(bytes.subarray(-16)); return Buffer.concat([decipher.update(bytes.subarray(12, -16)), decipher.final()]).toString(); };
  const allClasses = () => db.prepare('SELECT * FROM classes ORDER BY rowid').all().map(row => ({ ...row, courses: JSON.parse(row.courses) }));
  try { const existing=db.prepare('SELECT card FROM students LIMIT 1').get();if(existing)unseal(existing.card); } catch {db.close();throw Error('学习卡密钥与数据库不匹配，请使用配套备份恢复。');}
  const transaction = action => {
    db.exec('BEGIN IMMEDIATE');
    try { const value = action(); db.exec('COMMIT'); return value; }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  };
  const nextNumber = prefix => {
    const sequence = Number(db.prepare('INSERT INTO student_numbers DEFAULT VALUES').run().lastInsertRowid);
    if (sequence > 9999999) throw Error('学生学号已达到 0 开头的编号上限');
    return prefix + '0' + String(sequence).padStart(7, '0');
  };
  const newInitialPassword = password => {
    return { encoded: encodePassword(password), sealed: seal(password), expires: Date.now() + INITIAL_PASSWORD_TTL };
  };
  const newStudentSecret = spelling => {
    const issued = new Set(db.prepare('SELECT initialPassword FROM students WHERE loginPinyin=? AND initialPassword IS NOT NULL').all(spelling).map(row => unseal(row.initialPassword)));
    const available = Array.from({ length: 1000 }, (_, suffix) => spelling + String(suffix).padStart(3, '0')).filter(password => !issued.has(password));
    if (!available.length) throw Object.assign(Error('相同拼音的待领取密码已用完，请先让学生完成首次改密'), { status: 400 });
    return available[crypto.randomInt(available.length)];
  };
  const resetSecret = (spelling, previous) => {
    let password;
    do { password = spelling + String(crypto.randomInt(1000)).padStart(3, '0'); } while (passwordMatches(password, previous));
    return password;
  };
  // Upgrade in place: UUIDs remain the owners of all progress and local drafts.
  transaction(() => {
    const columns = new Set(db.prepare('PRAGMA table_info(students)').all().map(row => row.name));
    for (const [name, type] of [['studentNumber','TEXT'], ['loginPinyin','TEXT'], ['passwordHash','TEXT'], ['mustChangePassword','INTEGER NOT NULL DEFAULT 1'], ['initialPassword','TEXT'], ['initialPasswordExpiresAt','INTEGER']]) {
      if (!columns.has(name)) db.exec(`ALTER TABLE students ADD COLUMN ${name} ${type}`);
    }
    db.exec('CREATE TABLE IF NOT EXISTS student_numbers (sequence INTEGER PRIMARY KEY AUTOINCREMENT)');
    for (const row of db.prepare('SELECT id,name FROM students WHERE studentNumber IS NULL ORDER BY rowid').all()) {
      const spelling = suggestPinyin(row.name);
      db.prepare('UPDATE students SET studentNumber=?,loginPinyin=?,passwordHash=?,mustChangePassword=1 WHERE id=?')
        .run(nextNumber(spelling[0] || 's'), spelling, encodePassword(token()), row.id);
      db.prepare("DELETE FROM sessions WHERE subject=? AND role IN ('student','student-setup')").run(row.id);
    }
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS students_number ON students(studentNumber)');
    // Only legacy, unactivated accounts need rotation. A consumed or expired
    // credential keeps its deadline, so a restart can never reissue it.
    for (const row of db.prepare('SELECT id,loginPinyin FROM students WHERE mustChangePassword=1 AND initialPasswordExpiresAt IS NULL').all()) {
      db.prepare("DELETE FROM sessions WHERE subject=? AND role IN ('student','student-setup')").run(row.id);
      // Unverified legacy names still require teacher confirmation/reset.
      if (!validPinyin(row.loginPinyin)) continue;
      const initial = newInitialPassword(newStudentSecret(row.loginPinyin));
      db.prepare('UPDATE students SET passwordHash=?,initialPassword=?,initialPasswordExpiresAt=? WHERE id=?')
        .run(initial.encoded, initial.sealed, initial.expires, row.id);
    }
  });
  const learning = learningStore(db);
  const student = who => db.prepare('SELECT id,name,classId,active,studentNumber,mustChangePassword FROM students WHERE id=?').get(who);
  const award = (who, course, edition) => {
    const row = db.prepare('SELECT value FROM unit_awards WHERE student=? AND course=? AND edition=?').get(who, course, edition);
    return row ? JSON.parse(row.value) : { edition, zones: {}, firstFullStarAt: null };
  };
  const credentials = who => db.prepare('SELECT studentNumber,loginPinyin,passwordHash,mustChangePassword FROM students WHERE id=?').get(who);
  const authThrottle = createAuthThrottle(db);
  const clearStudentFailures = who => {
    const row = credentials(who);
    if (row) authThrottle.clear('student', row.studentNumber);
    authThrottle.clear('password', who);
  };
  const revokeStudent = who => {
    db.prepare("DELETE FROM sessions WHERE subject=? AND role IN ('student','student-setup')").run(who);
    // Old grants can only upload this student's pending completed work after
    // signing in again. Their revoked session cannot enter or load a course.
  };
  const createSession = (role, subject, now, deadline = Infinity) => {
    db.prepare('DELETE FROM sessions WHERE expires<=?').run(now);
    const raw = token(), duration = ['admin','teacher'].includes(role) ? 12 * 3600000 : ['student-setup','teacher-setup'].includes(role) ? 15 * 60000 : 30 * 86400000;
    db.prepare('INSERT INTO sessions VALUES (?,?,?,?)').run(hash(raw), role, subject, Math.min(now + duration, deadline));
    return raw;
  };
  const teachers = teacherStore({ db, transaction, seal, unseal, encodePassword, passwordMatches, createSession, authThrottle });
  try { teachers.checkIntegrity(); } catch { db.close(); throw Error('老师密码密钥与数据库不匹配，请恢复配套备份。'); }
  const insertStudent = (name, classId, spelling) => {
    if (!validPinyin(spelling)) throw Error('请核对姓名拼音');
    const code = crypto.randomBytes(12).toString('hex').toUpperCase(), who = id(), initial = newInitialPassword(newStudentSecret(spelling));
    db.prepare('INSERT INTO students(id,name,classId,codeHash,card,studentNumber,loginPinyin,passwordHash,initialPassword,initialPasswordExpiresAt) VALUES(?,?,?,?,?,?,?,?,?,?)')
      .run(who, name, classId, hash(code), seal(code), nextNumber(spelling[0]), spelling, initial.encoded, initial.sealed, initial.expires);
    learning.student(who);
    return student(who);
  };
  return {
    directory,
    authThrottle,
    learning,
    teachers,
    close: () => db.close(),
    hasAdmin:()=>!!db.prepare('SELECT 1 FROM admin LIMIT 1').get(),
    adminUsername:()=>db.prepare('SELECT username FROM admin LIMIT 1').get()?.username,
    checkIntegrity:()=>{teachers.checkIntegrity();if(db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('数据库完整性检查未通过');for(const row of db.prepare('SELECT card,initialPassword FROM students').all()){unseal(row.card);if(row.initialPassword)unseal(row.initialPassword);}},
    async backup(destination) { await backup(db, destination); fs.chmodSync(destination, 0o600); },
    setAdmin(username, password) {
      if (!username || typeof password !== 'string' || password.length < 12 || password.length > 256) throw new Error('账号不能为空，管理员密码请使用 12–256 个字符');
      if (teachers.list().some(t=>t.teacherNumber===username.trim().toLowerCase())) throw Error('管理员账号不能与老师工号重复');
      db.exec('BEGIN IMMEDIATE');
      try { db.prepare('DELETE FROM admin').run(); db.prepare('INSERT INTO admin VALUES (?,?)').run(username, encodePassword(password)); db.prepare("DELETE FROM sessions WHERE role='admin'").run(); authThrottle.clearAdmin(); db.exec('COMMIT'); } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    adminLogin(username, password) { const row = db.prepare('SELECT * FROM admin WHERE username=?').get(username); const matches = passwordMatches(password, row?.password || DUMMY_PASSWORD_HASH); return matches && row ? row.username : null; },
    session: createSession,
    lookupSession(raw, role, now) {
      const auth = raw && db.prepare('SELECT * FROM sessions WHERE hash=? AND role=? AND expires>?').get(hash(raw), role, now);
      if (auth && ['teacher','teacher-setup'].includes(role) && !teachers.validSession(auth.subject, role === 'teacher-setup', now)) return null;
      if (auth && role === 'student-setup') {
        const row = db.prepare('SELECT active,mustChangePassword,initialPassword,initialPasswordExpiresAt FROM students WHERE id=?').get(auth.subject);
        if (!row?.active || !row.mustChangePassword || row.initialPassword || !(row.initialPasswordExpiresAt > now)) return null;
      }
      return auth;
    },
    logout(raw) { if (raw) db.prepare('DELETE FROM sessions WHERE hash=?').run(hash(raw)); },
    classes: allClasses,
    createClass(name) { const row = { id: id(), name, courses: [] }; db.prepare('INSERT INTO classes VALUES (?,?,?)').run(row.id, row.name, '[]'); return row; },
    updateClass(classId, name, courses) { if (!Array.isArray(courses) || courses.some(course => !UNITS.includes(course))) throw new Error('只能开放现行教学单元'); return transaction(() => { const changed=db.prepare('UPDATE classes SET name=?,courses=? WHERE id=?').run(name, JSON.stringify([...new Set(courses)]), classId).changes; if(changed)learning.courses(classId,courses); return changed; }); },
    student,
    students: () => db.prepare('SELECT id,name,classId,active,studentNumber,loginPinyin,mustChangePassword FROM students ORDER BY rowid').all(),
    createStudents(rows, classId) { return transaction(() => rows.map(row => insertStudent(row.name, classId, row.pinyin))); },
    initialCredential(who, now = Date.now()) {
      const row = db.prepare('SELECT mustChangePassword,initialPassword,initialPasswordExpiresAt FROM students WHERE id=?').get(who);
      const state = !row?.mustChangePassword ? 'set' : !row.initialPasswordExpiresAt ? 'unverified' : !row.initialPassword ? 'used' : row.initialPasswordExpiresAt <= now ? 'expired' : 'ready';
      return { initialPassword: state === 'ready' ? unseal(row.initialPassword) : null, initialPasswordExpiresAt: row?.initialPasswordExpiresAt ?? null, initialPasswordState: state };
    },
    studentLogin(number, password, now = Date.now()) { return transaction(() => {
      const row = db.prepare('SELECT id,active,passwordHash,mustChangePassword,initialPassword,initialPasswordExpiresAt FROM students WHERE studentNumber=?').get(number.trim().toLowerCase());
      // A dummy hash keeps unknown-account and incorrect-password work comparable.
      const encoded = row?.passwordHash || DUMMY_PASSWORD_HASH;
      const matches = passwordMatches(password, encoded);
      if (!matches || !row?.active) return null;
      if (!row.mustChangePassword) return student(row.id);
      if (!row.initialPassword || !(row.initialPasswordExpiresAt > now)) return null;
      // Redeem and issue the only setup session in the same transaction.
      db.prepare('UPDATE students SET initialPassword=NULL WHERE id=?').run(row.id);
      revokeStudent(row.id);
      return { ...student(row.id), setupToken: createSession('student-setup', row.id, now, row.initialPasswordExpiresAt), setupExpiresAt: Math.min(now + 15 * 60000, row.initialPasswordExpiresAt) };
    }); },
    credentials,
    checkStudentPassword(who, password) { const row = credentials(who); return !!row && passwordMatches(password, row.passwordHash); },
    changePassword(who, password) { return transaction(() => {
      db.prepare('UPDATE students SET passwordHash=?,mustChangePassword=0,initialPassword=NULL,initialPasswordExpiresAt=NULL WHERE id=?').run(encodePassword(password), who);
      revokeStudent(who);
      clearStudentFailures(who);
    }); },
    resetPassword(who, spelling) { return transaction(() => {
      if (!validPinyin(spelling)) throw Error('请核对姓名拼音');
      const prior = credentials(who); if (!prior) return 0;
      const initial = newInitialPassword(resetSecret(spelling, prior.passwordHash));
      const result = db.prepare('UPDATE students SET loginPinyin=?,passwordHash=?,mustChangePassword=1,initialPassword=?,initialPasswordExpiresAt=? WHERE id=?')
        .run(spelling, initial.encoded, initial.sealed, initial.expires, who);
      revokeStudent(who); clearStudentFailures(who); return result.changes;
    }); },
    async resetPasswords(studentIds, authorize = () => {}) {
      if (!Array.isArray(studentIds) || !studentIds.length || studentIds.length > 1000 || studentIds.some(who => typeof who !== 'string') || new Set(studentIds).size !== studentIds.length) {
        throw Object.assign(Error('请选择 1–1000 位不同的学生'), { status: 400 });
      }
      const rows = studentIds.map(who => {
        const row = credentials(who);
        if (!row) throw Object.assign(Error('学生名单已变化，请刷新后重试'), { status: 404 });
        if (!validPinyin(row.loginPinyin)) throw Object.assign(Error('请先在管理学生中核对姓名拼音：' + row.studentNumber), { status: 400 });
        return { ...row, id: who };
      });
      // Hash outside the transaction and yield to the server between students.
      // Large classes must not block everyone else's requests while resetting.
      for (const row of rows) {
        const password = resetSecret(row.loginPinyin, row.passwordHash), salt = crypto.randomBytes(16).toString('hex');
        const encoded = await new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, value) => error ? reject(error) : resolve(value.toString('hex'))));
        row.initial = { encoded: salt + ':' + encoded, sealed: seal(password) };
      }
      return transaction(() => {
        authorize();
        // A simultaneous password change/reset wins; never partially reset a list.
        for (const row of rows) {
          const current = credentials(row.id);
          if (!current || current.passwordHash !== row.passwordHash || current.loginPinyin !== row.loginPinyin) throw Object.assign(Error('学生账号已更新，请刷新后重试'), { status: 409 });
        }
        const expires = Date.now() + INITIAL_PASSWORD_TTL;
        for (const row of rows) {
          db.prepare('UPDATE students SET passwordHash=?,mustChangePassword=1,initialPassword=?,initialPasswordExpiresAt=? WHERE id=?')
            .run(row.initial.encoded, row.initial.sealed, expires, row.id);
          revokeStudent(row.id); clearStudentFailures(row.id);
        }
        return rows.length;
      });
    },
    updateStudent(who, name, classId, active) { return transaction(() => { const prior=student(who); const changed=db.prepare('UPDATE students SET name=?,classId=?,active=? WHERE id=?').run(name, classId, active ? 1 : 0, who).changes; if(changed&&(prior.classId!==classId||(!prior.active&&active)))learning.reassigned(who);return changed; }); },
    allowed(who) { const row = db.prepare('SELECT courses FROM classes JOIN students ON students.classId=classes.id WHERE students.id=? AND students.active=1').get(who); return row ? JSON.parse(row.courses) : []; },
    grant(session, course, now) { return transaction(() => {
      // Retain old IDs for queued completed-work uploads. Only new entries for
      // this session/course reuse a row; other devices remain independent.
      const prior = db.prepare('SELECT * FROM grants WHERE session=? AND student=? AND course=? ORDER BY expires DESC LIMIT 1').get(session.hash, session.subject, course);
      const row = { id: prior?.id || token(), session: session.hash, student: session.subject, course, expires: now + 2 * 3600000 };
      if (prior) db.prepare('UPDATE grants SET expires=? WHERE id=?').run(row.expires, row.id);
      else db.prepare('INSERT INTO grants VALUES (?,?,?,?,?)').run(row.id, row.session, row.student, course, row.expires);
      db.prepare('DELETE FROM grants WHERE expires<?').run(now - 30 * 86400000);
      return row;
    }); },
    activeCourses(session, now) { return db.prepare('SELECT DISTINCT course FROM grants WHERE session=? AND expires>?').all(session.hash, now).map(row => row.course); },
    activeGrant(session, course, now) { return db.prepare('SELECT * FROM grants WHERE session=? AND course=? AND expires>? ORDER BY expires DESC LIMIT 1').get(session.hash,course,now); },
    progress(who, course) { const row = db.prepare('SELECT generation,value FROM progress WHERE student=? AND course=?').get(who, course); return row ? { generation: row.generation, value: JSON.parse(row.value) } : { generation: 0, value: {} }; },
    saveProgress(who, course, generation, value) { db.prepare('INSERT INTO progress VALUES (?,?,?,?) ON CONFLICT(student,course) DO UPDATE SET generation=excluded.generation,value=excluded.value').run(who, course, generation, JSON.stringify(value)); },
    saveLearning(who, course, generation, value, records, advanced) { return transaction(() => { this.saveProgress(who,course,generation,value);return learning.sync(who,course,generation,records,advanced); }); },
    resetLearning(who, course, generation) { return transaction(() => { this.saveProgress(who,course,generation,{});learning.reset(who,course,generation); }); },
    award,
    awards(who) {
      return db.prepare('SELECT course, edition, value FROM unit_awards WHERE student=?').all(who)
        .map(row => ({course:row.course, edition:row.edition, ...JSON.parse(row.value)}));
    },
    grantAwards(who, course, reward, claims) { return transaction(() => {
      const saved = award(who, course, reward.edition), now = new Date().toISOString();
      for (const [zone, claim] of claims) if (!saved.zones[zone]) saved.zones[zone] = { runId: claim.runId, earnedAt: now };
      if (!saved.firstFullStarAt && reward.zones.length === 5 && reward.zones.every(zone => saved.zones[zone.id])) saved.firstFullStarAt = now;
      // Replay, progress reset, and newer card editions cannot rewrite this row's first full-star date.
      db.prepare('INSERT INTO unit_awards VALUES (?,?,?,?) ON CONFLICT(student,course,edition) DO UPDATE SET value=excluded.value')
        .run(who, course, reward.edition, JSON.stringify(saved));
      return saved;
    }); },
    validGrant(grantId, who, course) { return !!db.prepare('SELECT id FROM grants WHERE id=? AND student=? AND course=?').get(grantId, who, course); }
  };
}
module.exports = { openStore };
