'use strict';
const crypto = require('node:crypto');
const digest = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const accountKey = (kind, credential) => kind + ':' + digest(credential);
const MAX_KEYS = 10000;

// SQLite preserves budgets across restarts and serializes multiple local workers.
// No raw account names, passwords or client addresses are stored here.
function createAuthThrottle(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS auth_throttle (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS auth_throttle_expires ON auth_throttle(expires);`);
  const get = db.prepare('SELECT count,expires FROM auth_throttle WHERE key=?');
  const put = db.prepare('INSERT INTO auth_throttle VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,expires=excluded.expires');
  const remove = db.prepare('DELETE FROM auth_throttle WHERE key=?');
  function atomic(action) {
    db.exec('BEGIN IMMEDIATE');
    try { const result = action(); db.exec('COMMIT'); return result; }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  const blocked = (until, now, long = false) => ({
    status: 429, retryAfter: Math.max(1, Math.ceil((until - now) / 1000)),
    message: long ? '尝试有些频繁，请十五分钟后再试' : '尝试有些频繁，请一分钟后再试'
  });
  function increment(key, duration, limit, now) {
    const old = get.get(key);
    const row = old?.expires > now ? old : { count: 0, expires: now + duration };
    // Keep active buckets when full: evicting them would reset attack budgets.
    if (!old && db.prepare('SELECT count(*) AS n FROM auth_throttle').get().n >= MAX_KEYS) return blocked(now + 60000, now);
    row.count = Math.min(row.count + 1, limit + 1);
    put.run(key, row.count, row.expires);
    return row.count > limit ? blocked(row.expires, now) : null;
  }
  return {
    check(address, kind, credential, now = Date.now()) {
      // Return denials from the transaction, so blocked attempts still consume
      // the source budget instead of rolling it back on an exception.
      const denial = atomic(() => {
        db.prepare('DELETE FROM auth_throttle WHERE expires<=?').run(now);
        const source = increment('ip:' + digest(address), 60000, 120, now);
        if (source) return source;
        const key = accountKey(kind, credential), failures = get.get('failure:' + key);
        if (failures?.count >= 10) return blocked(failures.expires, now, true);
        if (!failures) {
          if (db.prepare('SELECT count(*) AS n FROM auth_throttle').get().n >= MAX_KEYS) return blocked(now + 60000, now);
          put.run('failure:' + key, 0, now + 15 * 60000);
        }
        return increment('account:' + key, 60000, 12, now);
      });
      if (denial) throw Object.assign(new Error(denial.message), denial);
    },
    failed(kind, credential, now = Date.now()) {
      return atomic(() => increment('failure:' + accountKey(kind, credential), 15 * 60000, 10, now));
    },
    clear(kind, credential) {
      const key = accountKey(kind, credential);
      remove.run('account:' + key); remove.run('failure:' + key);
    },
    clearAdmin() {
      db.prepare("DELETE FROM auth_throttle WHERE key LIKE 'account:admin:%' OR key LIKE 'failure:admin:%'").run();
    }
  };
}
module.exports = { createAuthThrottle };
