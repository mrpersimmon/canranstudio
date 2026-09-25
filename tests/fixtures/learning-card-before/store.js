'use strict';
const { DatabaseSync, backup } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { UNITS } = require('../../../server/catalog');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const token = () => crypto.randomBytes(32).toString('base64url');
const id = () => crypto.randomUUID();
const encodePassword = password => { const salt = crypto.randomBytes(16).toString('hex'); return salt + ':' + crypto.scryptSync(password, salt, 64).toString('hex'); };
function passwordMatches(password, encoded) {
  const [salt, expected] = encoded.split(':');
  const actual = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
function openStore(directory) {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const filename = path.join(directory, 'learning.sqlite');
  const db = new DatabaseSync(filename);
  fs.chmodSync(filename, 0o600);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS admin (username TEXT PRIMARY KEY, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS classes (id TEXT PRIMARY KEY, name TEXT NOT NULL, courses TEXT NOT NULL DEFAULT '[]');
    CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, name TEXT NOT NULL, classId TEXT NOT NULL REFERENCES classes(id), active INTEGER NOT NULL DEFAULT 1, codeHash TEXT NOT NULL UNIQUE, card TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, role TEXT NOT NULL, subject TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS grants (id TEXT PRIMARY KEY, session TEXT NOT NULL, student TEXT NOT NULL, course TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS progress (student TEXT NOT NULL, course TEXT NOT NULL, generation INTEGER NOT NULL DEFAULT 0, value TEXT NOT NULL DEFAULT '{}', PRIMARY KEY(student, course));
  `);
  const keyFile = path.join(directory, 'card-key');
  if (!fs.existsSync(keyFile) && db.prepare('SELECT 1 FROM students LIMIT 1').get()) { db.close(); throw Error('学习卡密钥缺失，请恢复与数据库配套的 card-key；不会生成新密钥覆盖旧卡。'); }
  if (!fs.existsSync(keyFile)) fs.writeFileSync(keyFile, crypto.randomBytes(32), { mode: 0o600, flag: 'wx' });
  const key = fs.readFileSync(keyFile);
  const seal = value => { const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', key, iv); return Buffer.concat([iv, cipher.update(value), cipher.final(), cipher.getAuthTag()]).toString('base64'); };
  const unseal = value => { const bytes = Buffer.from(value, 'base64'), decipher = crypto.createDecipheriv('aes-256-gcm', key, bytes.subarray(0, 12)); decipher.setAuthTag(bytes.subarray(-16)); return Buffer.concat([decipher.update(bytes.subarray(12, -16)), decipher.final()]).toString(); };
  const allClasses = () => db.prepare('SELECT * FROM classes ORDER BY rowid').all().map(row => ({ ...row, courses: JSON.parse(row.courses) }));
  try { const existing=db.prepare('SELECT card FROM students LIMIT 1').get();if(existing)unseal(existing.card); } catch {db.close();throw Error('学习卡密钥与数据库不匹配，请使用配套备份恢复。');}
  const student = who => db.prepare('SELECT id,name,classId,active FROM students WHERE id=?').get(who);
  return {
    directory,
    close: () => db.close(),
    hasAdmin:()=>!!db.prepare('SELECT 1 FROM admin LIMIT 1').get(),
    checkIntegrity:()=>{if(db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('数据库完整性检查未通过');for(const row of db.prepare('SELECT card FROM students').all())unseal(row.card);},
    async backup(destination) { await backup(db, destination); fs.chmodSync(destination, 0o600); },
    setAdmin(username, password) {
      if (!username || password.length < 14) throw new Error('账号不能为空，管理员密码至少 14 个字符');
      db.exec('BEGIN IMMEDIATE');
      try { db.prepare('DELETE FROM admin').run(); db.prepare('INSERT INTO admin VALUES (?,?)').run(username, encodePassword(password)); db.prepare("DELETE FROM sessions WHERE role='admin'").run(); db.exec('COMMIT'); } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    adminLogin(username, password) { const row = db.prepare('SELECT * FROM admin WHERE username=?').get(username); return row && passwordMatches(password, row.password) ? row.username : null; },
    session(role, subject, now) { db.prepare('DELETE FROM sessions WHERE expires<=?').run(now); const raw = token(); db.prepare('INSERT INTO sessions VALUES (?,?,?,?)').run(hash(raw), role, subject, now + (role === 'admin' ? 12 * 3600000 : 30 * 86400000)); return raw; },
    lookupSession(raw, role, now) { return raw && db.prepare('SELECT * FROM sessions WHERE hash=? AND role=? AND expires>?').get(hash(raw), role, now); },
    logout(raw) { if (raw) db.prepare('DELETE FROM sessions WHERE hash=?').run(hash(raw)); },
    classes: allClasses,
    createClass(name) { const row = { id: id(), name, courses: [] }; db.prepare('INSERT INTO classes VALUES (?,?,?)').run(row.id, row.name, '[]'); return row; },
    updateClass(classId, name, courses) { if (!Array.isArray(courses) || courses.some(course => !UNITS.includes(course))) throw new Error('只能开放现行教学单元'); return db.prepare('UPDATE classes SET name=?,courses=? WHERE id=?').run(name, JSON.stringify([...new Set(courses)]), classId).changes; },
    student,
    students: () => db.prepare('SELECT id,name,classId,active FROM students ORDER BY rowid').all(),
    createStudent(name, classId) {
      const code = crypto.randomBytes(12).toString('hex').toUpperCase(), who = id();
      db.prepare('INSERT INTO students(id,name,classId,codeHash,card) VALUES(?,?,?,?,?)').run(who, name, classId, hash(code), seal(code));
      return student(who);
    },
    studentLogin(code) { const row = db.prepare('SELECT id FROM students WHERE codeHash=? AND active=1').get(hash(code.replace(/[\s-]/g, '').toUpperCase())); return row?.id; },
    card(who) { const row = db.prepare('SELECT card FROM students WHERE id=?').get(who); return row && unseal(row.card); },
    updateStudent(who, name, classId, active) { return db.prepare('UPDATE students SET name=?,classId=?,active=? WHERE id=?').run(name, classId, active ? 1 : 0, who).changes; },
    renewCard(who) { const code = crypto.randomBytes(12).toString('hex').toUpperCase(); db.prepare('UPDATE students SET codeHash=?,card=? WHERE id=?').run(hash(code), seal(code), who); db.prepare("DELETE FROM sessions WHERE subject=? AND role='student'").run(who); return code; },
    allowed(who) { const row = db.prepare('SELECT courses FROM classes JOIN students ON students.classId=classes.id WHERE students.id=? AND students.active=1').get(who); return row ? JSON.parse(row.courses) : []; },
    grant(session, course, now) { const row = { id: token(), session: session.hash, student: session.subject, course, expires: now + 2 * 3600000 }; db.prepare('INSERT INTO grants VALUES (?,?,?,?,?)').run(row.id, row.session, row.student, course, row.expires); db.prepare('DELETE FROM grants WHERE expires<?').run(now - 30 * 86400000); return row; },
    activeCourses(session, now) { return db.prepare('SELECT DISTINCT course FROM grants WHERE session=? AND expires>?').all(session.hash, now).map(row => row.course); },
    activeGrant(session, course, now) { return db.prepare('SELECT * FROM grants WHERE session=? AND course=? AND expires>? ORDER BY expires DESC LIMIT 1').get(session.hash,course,now); },
    progress(who, course) { const row = db.prepare('SELECT generation,value FROM progress WHERE student=? AND course=?').get(who, course); return row ? { generation: row.generation, value: JSON.parse(row.value) } : { generation: 0, value: {} }; },
    saveProgress(who, course, generation, value) { db.prepare('INSERT INTO progress VALUES (?,?,?,?) ON CONFLICT(student,course) DO UPDATE SET generation=excluded.generation,value=excluded.value').run(who, course, generation, JSON.stringify(value)); },
    validGrant(grantId, who, course) { return !!db.prepare('SELECT id FROM grants WHERE id=? AND student=? AND course=?').get(grantId, who, course); }
  };
}
module.exports = { openStore };
