'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { openStore } = require('./store');
const { UNITS, RETIRED } = require('./catalog');
const { createCoursePackages } = require('../scripts/course-packages');
const progress = require('./progress');
const {retainPackages}=require('./bundles');
const { suggestPinyin, validPinyin, passwordProblem } = require('./student-credentials');
const { clientAddress } = require('./client-address');
const { normalizeBasePath } = require('../scripts/public-base-path');
const fail = (status, message) => Object.assign(new Error(message), { status });
const cleanName = value => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 60 ? value.trim() : (() => { throw fail(400, '名称请填写 1–60 个字'); })();
const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
async function createApp({ root = path.resolve(__dirname, '..'), dataDir = path.join(root, '.data/lesson-access'), origin = 'http://127.0.0.1:4181', bundle = null, trustProxy = false, basePath = '/lesson/' } = {}) {
  const BASE = normalizeBasePath(basePath);
  if (trustProxy !== false && trustProxy !== 'loopback') throw Error('trustProxy must be false or loopback');
  const store = openStore(dataDir);
  const packages = bundle || await createCoursePackages({ root, basePath: BASE, courseIds: UNITS, isolatedDefinitions: true });
  const logical = new Map(), owners = new Map();
  const addOwner = (address, course) => { if (!owners.has(address)) owners.set(address, new Set()); owners.get(address).add(course); };
  for (const [course, descriptor] of Object.entries(packages.index.courses)) {
    const pack = JSON.parse(packages.generated.get(descriptor.manifest.slice(BASE.length)).body);
    addOwner(descriptor.manifest, course);
    for (const item of [...pack.required, ...pack.audio]) {
      logical.set(item.key.slice(BASE.length), packages.generated.get(item.url.slice(BASE.length)));
      addOwner(item.key, course); addOwner(item.url, course);
    }
  }
  for(const pack of await retainPackages(packages,dataDir,BASE)){addOwner(BASE+'course-packages/'+pack.id+'/'+pack.revision+'.json',pack.id);for(const item of [...pack.required,...pack.audio])addOwner(item.url,pack.id);}
  const descriptions = await Promise.all(UNITS.map(async id => {
    const source = await fs.readFile(path.join(root, id, 'index.html'), 'utf8');
    const image = source.match(/<section id="cover"[\s\S]*?<img[^>]+src="([^"]+)"/)?.[1];
    return { id, title: packages.index.courses[id].title, label: 'Lesson ' + id.slice(4).replace('-', '–'), image: image?.startsWith('/') ? BASE.slice(0, -1) + image : null };
  }));
  const definitions = Object.fromEntries(UNITS.map(id=>[id,progress.definition(root,id,BASE)]));
  const currentProgress = (studentId, course) => { const saved = store.progress(studentId, course); return { ...saved, value: progress.normalize(saved.value, definitions[course], course) }; };
  const rate = new Map();
  function clearFailures(kind, credential) {
    rate.delete(kind + ':' + require('node:crypto').createHash('sha256').update(String(credential)).digest('hex'));
  }
  function throttle(request, kind, credential) {
    const now = Date.now();
    for (const [k,v] of rate) if (v.until <= now) rate.delete(k);
    const ipKey='ip:'+clientAddress(request, trustProxy);const ip=rate.get(ipKey)||{count:0,until:now+60000};
    if(ip.until>now&&++ip.count>120)throw fail(429,'尝试有些频繁，请一分钟后再试');rate.set(ipKey,ip.until>now?ip:{count:1,until:now+60000});
    const key = kind + ':' + require('node:crypto').createHash('sha256').update(String(credential)).digest('hex');
    const entry = rate.get(key) || { count: 0, until: now + 60000 };
    if (++entry.count > 12) throw fail(429, '尝试有些频繁，请一分钟后再试');
    rate.set(key, entry);
  }
  function cookie(request, role) { return request.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('canran_' + role + '='))?.split('=')[1]; }
  function session(request, role, required = true) { const value = store.lookupSession(cookie(request, role), role, Date.now()); if (!value && required) throw fail(role==='admin'&&store.lookupSession(cookie(request,'student'),'student',Date.now())?403:401, '请先登录'); return value; }
  function studentSession(request, allowSetup = false) {
    const raw = cookie(request, 'student');
    const auth = store.lookupSession(raw, 'student', Date.now()) || store.lookupSession(raw, 'student-setup', Date.now());
    if (!auth) throw fail(401, '请先登录');
    const student = store.student(auth.subject);
    if (!student?.active) throw fail(403, '学生账号已停用，请联系老师');
    if (!allowSetup && (student.mustChangePassword || auth.role === 'student-setup')) throw fail(403, '请先设置新密码');
    return { auth, student };
  }
  function setCookie(response, role, token, maxAge) { response.setHeader('Set-Cookie', `canran_${role}=${token}; Path=${BASE}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${origin.startsWith('https:') ? '; Secure' : ''}`); }
  async function body(request) {
    if (request.headers.origin !== origin || !request.headers['content-type']?.startsWith('application/json')) throw fail(403, '请求来源不正确');
    // Network chunks can split a UTF-8 character. Decode once after collecting
    // bytes so Chinese learning records retain their exact completion proof.
    const chunks = []; let bytes = 0;
    for await (const chunk of request) { bytes += chunk.length; if (bytes > 1500000) throw fail(413, '提交内容过大'); chunks.push(chunk); }
    try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw fail(400, '提交内容不完整'); }
  }
  function identity(request, preview) {
    if (preview) {
      session(request, 'admin'); const group = store.classes().find(c => c.id === preview); if (!group) throw fail(404, '班级不存在');
      return { student: { id: 'preview-' + group.id, name: '班级预览', classId: group.id }, className: group.name, courses: group.courses, preview: true };
    }
    const { auth, student } = studentSession(request);
    return { student, className: store.classes().find(c => c.id === student.classId)?.name || '', courses: store.allowed(student.id), preview: false, auth };
  }
  const json = (res, value, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }).end(JSON.stringify(value)); };
  async function publicFile(res, file, type, status = 200) { const content = await fs.readFile(path.join(root, 'server/public', file), 'utf8'); res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }).end(content.replaceAll('/lesson/', BASE)); }
  function notice(res, title, code) { res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' }).end(`<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${BASE}portal.css"><title>${escape(title)}</title><main><section class="login panel"><h1>${escape(title)}</h1><a class="button primary" href="${BASE}">返回课程</a></section></main></html>`); }
  const server = http.createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store'); response.setHeader('X-Content-Type-Options', 'nosniff'); response.setHeader('Referrer-Policy', 'no-referrer'); response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
    try {
      const url = new URL(request.url, origin), pathname = decodeURIComponent(url.pathname), relative = pathname.slice(BASE.length);
      if (BASE === '/' && pathname === '/lesson/core/subpath-worker.js') { response.setHeader('Service-Worker-Allowed', '/lesson/'); return publicFile(response, 'retired-worker.js', 'text/javascript'); }
      if (BASE === '/' && (pathname === '/lesson' || pathname.startsWith('/lesson/'))) return notice(response, '旧课程入口已移除', 410);
      if (BASE !== '/' && pathname === BASE.slice(0, -1)) return response.writeHead(308, { Location: BASE }).end();
      if (!pathname.startsWith(BASE) || relative.split('/').some(part => part === '..' || part.startsWith('.'))) throw fail(404, '页面不存在');
      if (relative === 'health') return json(response, { ok: true, access: 'class-v1' });
      if (relative === 'core/course-worker.js') { response.writeHead(200, { 'Content-Type':'text/javascript' }); return response.end(await fs.readFile(path.join(root, relative))); }
      if (['portal.css','portal.js','access-client.js','access-worker.js'].includes(relative)) {
        if (relative === 'access-worker.js') response.setHeader('Service-Worker-Allowed', BASE);
        return publicFile(response, relative, relative.endsWith('.css') ? 'text/css' : 'text/javascript');
      }
      if (relative === 'core/subpath-worker.js') { response.setHeader('Service-Worker-Allowed', BASE); return publicFile(response, 'access-worker.js', 'text/javascript'); }
      if (BASE === '/' && relative === 'core/course-package-service-worker.js') { response.setHeader('Service-Worker-Allowed', BASE); return publicFile(response, 'access-worker.js', 'text/javascript'); }
      if (['assets/brand/starflower.png','assets/brand/starflower-favicon.png','assets/brand/starflower-apple-touch.png'].includes(relative)) { response.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control':'public, max-age=86400' }); return response.end(await fs.readFile(path.join(root, relative))); }
      if (/^api\//.test(relative)) {
        const input = request.method === 'POST' ? await body(request) : null;
        if (request.method !== 'GET' && request.method !== 'POST') throw fail(405, '不支持此操作');
        if (relative === 'api/admin/login' && input) { throttle(request, 'admin',input.username); if (String(input.password || '').length > 256) throw fail(401, '账号或密码不正确'); const who = store.adminLogin(String(input.username || ''), String(input.password || '')); if (!who) throw fail(401, '账号或密码不正确'); clearFailures('admin', input.username); setCookie(response, 'admin', store.session('admin', who, Date.now()), 43200); return json(response, { ok: true }); }
        if (relative === 'api/login' && input) {
          const number = String(input.studentNumber || '').trim().toLowerCase(), password = String(input.password || '');
          throttle(request, 'student', number);
          if (number.length > 32 || password.length > 120) throw fail(401, '学号或密码不正确，或账号已停用');
          const student = store.studentLogin(number, password);
          if (!student) throw fail(401, '学号或密码不正确，或账号已停用。初始密码已使用或过期时，请联系老师重置。');
          clearFailures('student', number);
          store.logout(cookie(request, 'student'));
          const setup = !!student.mustChangePassword;
          setCookie(response, 'student', setup ? student.setupToken : store.session('student', student.id, Date.now()), setup ? Math.max(0, Math.floor((student.setupExpiresAt - Date.now()) / 1000)) : 2592000);
          return json(response, { ok: true, mustChangePassword: setup });
        }
        if (relative === 'api/password' && input) {
          const { auth, student } = studentSession(request, true);
          throttle(request, 'password', student.id);
          const credential = store.credentials(student.id), problem = passwordProblem(input.password, credential);
          if (problem) throw fail(400, problem);
          if (input.password !== input.confirmPassword) throw fail(400, '两次输入的新密码不一致');
          if (auth.role !== 'student-setup' && !store.checkStudentPassword(student.id, String(input.currentPassword || '').slice(0, 120))) throw fail(400, '当前密码不正确');
          if (store.checkStudentPassword(student.id, input.password)) throw fail(400, '新密码不能与原密码相同');
          store.changePassword(student.id, input.password);
          clearFailures('password', student.id);
          setCookie(response, 'student', store.session('student', student.id, Date.now()), 2592000);
          return json(response, { ok: true });
        }
        if (relative === 'api/logout' && input) { const role = input.admin ? 'admin' : 'student'; store.logout(cookie(request, role)); setCookie(response, role, '', 0); return json(response, { ok: true }); }
        if (relative.startsWith('api/admin/')) {
          session(request, 'admin');
          if (relative === 'api/admin/state' && !input) return json(response, { classes: store.classes(), students: store.students(), courses: descriptions });
          if (relative === 'api/admin/student-preview' && input) {
            const names = String(input.names || '').split('\n').filter(name => name.trim()).map(cleanName);
            if (!names.length || names.length > 100) throw fail(400, '每次填写 1–100 位学生');
            return json(response, { students: names.map(name => ({ name, pinyin: suggestPinyin(name) })) });
          }
          if (relative === 'api/admin/classes' && input) {
            const name = cleanName(input.name);
            if(input.id&&(!Array.isArray(input.courses)||input.courses.some(id=>!UNITS.includes(id))))throw fail(400,'只能开放现行教学单元');
            if (input.id) { if (!store.updateClass(input.id, name, input.courses)) throw fail(404, '班级不存在'); return json(response, { ok: true }); }
            return json(response, store.createClass(name));
          }
          if (relative === 'api/admin/students' && input) {
            if (!store.classes().some(c => c.id === input.classId)) throw fail(400, '请选择班级');
            if (input.id) { if (!store.updateStudent(input.id, cleanName(input.name), input.classId, input.active === true)) throw fail(404, '学生不存在'); return json(response, { ok: true }); }
            if (!Array.isArray(input.students) || !input.students.length || input.students.length > 100) throw fail(400, '每次填写 1–100 位学生，并核对姓名拼音');
            const rows = input.students.map(row => ({ name: cleanName(row.name), pinyin: row.pinyin }));
            if (rows.some(row => !validPinyin(row.pinyin))) throw fail(400, '姓名拼音请用小写字母，不加空格和声调；ü 用 v');
            return json(response, { students: store.createStudents(rows, input.classId) });
          }
          if (relative === 'api/admin/accounts' && input) {
            const selected = store.students().filter(s => input.studentId ? s.id === input.studentId : s.classId === input.classId);
            if (!selected.length) throw fail(404, '没有找到学生');
            return json(response, { accounts: selected.map(s => ({ ...s, ...store.initialCredential(s.id), className: store.classes().find(c => c.id === s.classId)?.name, url: origin + BASE })) });
          }
          if (relative === 'api/admin/reset-password' && input) {
            if (!validPinyin(input.pinyin)) throw fail(400, '请核对姓名拼音，用小写字母，不加空格和声调；ü 用 v');
            if (!store.resetPassword(input.studentId, input.pinyin)) throw fail(404, '学生不存在');
            return json(response, { ok: true });
          }
          throw fail(404, '管理操作不存在');
        }
        if (relative === 'api/me' && !input) {
          if (!url.searchParams.get('preview')) {
            const { student, auth } = studentSession(request, true);
            if (student.mustChangePassword || auth.role === 'student-setup') return json(response, { student, mustChangePassword: true, courses: [] });
          }
          const who = identity(request, url.searchParams.get('preview'));
          return json(response, { ...who, auth: undefined, courses: descriptions.filter(c => who.courses.includes(c.id)).map(c=>({...c,...progress.summary(who.preview?{}:store.progress(who.student.id,c.id).value,definitions[c.id],c.id)})) });
        }
        const entering = relative.match(/^api\/courses\/(unit\d+-\d+)\/enter$/);
        const permitting = relative.match(/^api\/courses\/(unit\d+-\d+)\/permit$/);
        if (permitting && !input) {
          const auth = session(request,'student',false), admin = session(request,'admin',false);
          const grant = auth && store.activeGrant(auth, permitting[1], Date.now());
          if (!grant && !admin) throw fail(403,'请重新进入课程');
          return json(response,{studentId:auth?.subject || 'admin-preview',expires:grant?.expires || Date.now()+7200000});
        }
        if (entering && input) {
          const who = identity(request, input.preview), course = entering[1];
          if (!UNITS.includes(course) || !who.courses.includes(course)) throw fail(403, '这节课还没向你的班级开放');
          const grant = who.preview ? { id: '', expires: Date.now() + 7200000 } : store.grant(who.auth, course, Date.now());
          return json(response, { student: who.student, preview: who.preview, grant: grant.id, expires: grant.expires, progress: who.preview ? { generation: 0, value: {} } : currentProgress(who.student.id, course) });
        }
        if (relative === 'api/progress' && input) {
          const auth = session(request,'student'), course = input.course;
          if (input.studentId !== auth.subject || !UNITS.includes(course) || !store.validGrant(input.grant,auth.subject,course)) throw fail(403,'学习记录不属于当前身份或课程');
          const current = store.progress(auth.subject,course);
          if (input.generation !== current.generation) return json(response,{stale:true,generation:current.generation});
          const value = progress.merge(progress.normalize(current.value,definitions[course],course),progress.normalize(input.value,definitions[course],course));
          store.saveProgress(auth.subject,course,current.generation,value);
          return json(response,{ok:true});
        }
        if (relative === 'api/progress/reset' && input) {
          const who=identity(request),course=input.course;
          if (!who.courses.includes(course)) throw fail(403,'这节课还没向你的班级开放');
          const generation=store.progress(who.student.id,course).generation+1;
          store.saveProgress(who.student.id,course,generation,{});
          return json(response,{generation});
        }
        throw fail(404, '操作不存在');
      }
      if (!['GET','HEAD'].includes(request.method)) throw fail(405, '不支持此操作');
      if (RETIRED.includes(relative.split('/')[0]) && /^(?:lesson\d+|soundmark)\/?(?:index\.html)?$/.test(relative)) return notice(response, '这节课已下架', 410);
      if (['','index.html','admin/','admin','home/','home/index.html'].includes(relative)) return publicFile(response, 'index.html', 'text/html; charset=utf-8');
      const courseRoute = relative.match(/^(unit\d+-\d+)(?:\/(?:index\.html)?)?$/);
      if (courseRoute) {
        const course = courseRoute[1]; if (!UNITS.includes(course)) throw fail(404, '课程不存在');
        let who; try { who = identity(request, url.searchParams.get('preview')); } catch (error) { if (error.status === 401 || error.message === '请先设置新密码') return publicFile(response, 'index.html', 'text/html; charset=utf-8'); throw error; }
        if (!who.courses.includes(course)) return notice(response, '这节课还没向你的班级开放', 403);
        const entry = packages.generated.get(course + '/index.html').body.toString().replace('<head>', '<head><script src="' + BASE + 'access-client.js"></script>');
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(request.method === 'HEAD' ? undefined : entry); return;
      }
      const auth = session(request, 'student', false), admin = session(request, 'admin', false);
      if (!admin && store.lookupSession(cookie(request, 'student'), 'student-setup', Date.now())) throw fail(403, '请先设置新密码');
      const allowed = admin ? UNITS : auth ? [...store.allowed(auth.subject), ...store.activeCourses(auth, Date.now())] : [];
      if (relative === 'course-index.json') {
        if (!auth && !admin) throw fail(401, '请先登录');
        return json(response, { ...packages.index, courses: Object.fromEntries(Object.entries(packages.index.courses).filter(([id]) => allowed.includes(id))) });
      }
      const infrastructure = ['core/course-cache.js','core/course-loader.js'];
      if (relative === 'core/course-catalog.js') throw fail(403, '请使用本课程的教学定义');
      if (!infrastructure.includes(relative) && ![...(owners.get(pathname) || [])].some(id => allowed.includes(id))) throw fail(auth || admin ? 403 : 401, '请先进入有权限的课程');
      const item = packages.generated.get(relative) || logical.get(relative); if (!item) throw fail(404, '资源不存在');
      response.setHeader('Content-Type', item.type);
      const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      if (range) { const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), item.body.length - 1) : item.body.length - 1; if (start > end) return response.writeHead(416, { 'Content-Range': 'bytes */' + item.body.length }).end(); response.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${item.body.length}`, 'Accept-Ranges':'bytes' }).end(request.method === 'HEAD' ? undefined : item.body.subarray(start, end + 1)); return; }
      response.writeHead(200).end(request.method === 'HEAD' ? undefined : item.body);
    } catch (error) {
      if (!response.headersSent) json(response, { error: error.status ? error.message : '暂时无法完成，请重试' }, error.status || 500); else response.end();
      if (!error.status) console.error('Lesson request failed:', error.code || error.name);
    }
  });
  server.requestTimeout=30000;server.headersTimeout=15000;
  server.on('close', () => store.close());
  return server;
}
module.exports = { createApp };
