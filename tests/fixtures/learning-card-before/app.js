'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { openStore } = require('./store');
const { UNITS, RETIRED } = require('../../../server/catalog');
const { createCoursePackages } = require('../../../scripts/course-packages');
const progress = require('../../../server/progress');
const {retainPackages}=require('../../../server/bundles');
const QRCode = require('qrcode');
const BASE = '/lesson/';
const fail = (status, message) => Object.assign(new Error(message), { status });
const cleanName = value => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 60 ? value.trim() : (() => { throw fail(400, '名称请填写 1–60 个字'); })();
const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
async function createApp({ root = path.resolve(__dirname, '../../..'), dataDir = path.join(root, '.data/lesson-access'), origin = 'http://127.0.0.1:4181', bundle = null } = {}) {
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
  for(const pack of await retainPackages(packages,dataDir)){addOwner(BASE+'course-packages/'+pack.id+'/'+pack.revision+'.json',pack.id);for(const item of [...pack.required,...pack.audio])addOwner(item.url,pack.id);}
  const descriptions = await Promise.all(UNITS.map(async id => {
    const source = await fs.readFile(path.join(root, id, 'index.html'), 'utf8');
    const image = source.match(/<section id="cover"[\s\S]*?<img[^>]+src="([^"]+)"/)?.[1];
    return { id, title: packages.index.courses[id].title, label: 'Lesson ' + id.slice(4).replace('-', '–'), image: image?.startsWith('/') ? BASE.slice(0, -1) + image : null };
  }));
  const definitions = Object.fromEntries(UNITS.map(id=>[id,progress.definition(root,id)]));
  const rate = new Map();
  function throttle(request, kind, credential) {
    const now = Date.now();
    const ipKey='ip:'+request.socket.remoteAddress;const ip=rate.get(ipKey)||{count:0,until:now+60000};
    if(ip.until>now&&++ip.count>120)throw fail(429,'尝试有些频繁，请一分钟后再试');rate.set(ipKey,ip.until>now?ip:{count:1,until:now+60000});
    const key = kind + ':' + require('node:crypto').createHash('sha256').update(String(credential)).digest('hex');
    for (const [k,v] of rate) if (v.until <= now) rate.delete(k);
    const entry = rate.get(key) || { count: 0, until: now + 60000 };
    if (++entry.count > 12) throw fail(429, '尝试有些频繁，请一分钟后再试');
    rate.set(key, entry);
  }
  function cookie(request, role) { return request.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('canran_' + role + '='))?.split('=')[1]; }
  function session(request, role, required = true) { const value = store.lookupSession(cookie(request, role), role, Date.now()); if (!value && required) throw fail(role==='admin'&&store.lookupSession(cookie(request,'student'),'student',Date.now())?403:401, '请先登录'); return value; }
  function setCookie(response, role, token, maxAge) { response.setHeader('Set-Cookie', `canran_${role}=${token}; Path=/lesson/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${origin.startsWith('https:') ? '; Secure' : ''}`); }
  async function body(request) {
    if (request.headers.origin !== origin || !request.headers['content-type']?.startsWith('application/json')) throw fail(403, '请求来源不正确');
    let raw = ''; for await (const chunk of request) { raw += chunk; if (Buffer.byteLength(raw) > 1500000) throw fail(413, '提交内容过大'); }
    try { return JSON.parse(raw); } catch { throw fail(400, '提交内容不完整'); }
  }
  function identity(request, preview) {
    if (preview) {
      session(request, 'admin'); const group = store.classes().find(c => c.id === preview); if (!group) throw fail(404, '班级不存在');
      return { student: { id: 'preview-' + group.id, name: '班级预览', classId: group.id }, className: group.name, courses: group.courses, preview: true };
    }
    const auth = session(request, 'student'), student = store.student(auth.subject);
    if (!student || !student.active) throw fail(403, '学习卡已停用，请联系老师');
    return { student, className: store.classes().find(c => c.id === student.classId)?.name || '', courses: store.allowed(student.id), preview: false, auth };
  }
  const json = (res, value, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }).end(JSON.stringify(value)); };
  async function publicFile(res, file, type, status = 200) { res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }).end(await fs.readFile((['access-worker.js','access-client.js'].includes(file) ? path.join(root,'server/public',file) : path.join(__dirname,'public',file)))); }
  function notice(res, title, code) { res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' }).end(`<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/lesson/portal.css"><title>${escape(title)}</title><main><section class="login panel"><h1>${escape(title)}</h1><a class="button primary" href="/lesson/">返回课程</a></section></main></html>`); }
  const server = http.createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store'); response.setHeader('X-Content-Type-Options', 'nosniff'); response.setHeader('Referrer-Policy', 'no-referrer'); response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
    try {
      const url = new URL(request.url, origin), pathname = decodeURIComponent(url.pathname), relative = pathname.slice(BASE.length);
      if (pathname === '/lesson') return response.writeHead(308, { Location: BASE }).end();
      if (!pathname.startsWith(BASE) || relative.split('/').some(part => part === '..' || part.startsWith('.'))) throw fail(404, '页面不存在');
      if (relative === 'health') return json(response, { ok: true, access: 'class-v1' });
      if (relative === 'core/course-worker.js') { response.writeHead(200, { 'Content-Type':'text/javascript' }); return response.end(await fs.readFile(path.join(root, relative))); }
      if (['portal.css','portal.js','access-client.js','access-worker.js'].includes(relative)) {
        if (relative === 'access-worker.js') response.setHeader('Service-Worker-Allowed', BASE);
        return publicFile(response, relative, relative.endsWith('.css') ? 'text/css' : 'text/javascript');
      }
      if (relative === 'core/subpath-worker.js') { response.setHeader('Service-Worker-Allowed', BASE); return publicFile(response, 'access-worker.js', 'text/javascript'); }
      if (['assets/brand/starflower.png','assets/brand/starflower-favicon.png','assets/brand/starflower-apple-touch.png'].includes(relative)) { response.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control':'public, max-age=86400' }); return response.end(await fs.readFile(path.join(root, relative))); }
      if (/^api\//.test(relative)) {
        const input = request.method === 'POST' ? await body(request) : null;
        if (request.method !== 'GET' && request.method !== 'POST') throw fail(405, '不支持此操作');
        if (relative === 'api/admin/login' && input) { throttle(request, 'admin',input.username); const who = store.adminLogin(String(input.username || ''), String(input.password || '')); if (!who) throw fail(401, '账号或密码不正确'); setCookie(response, 'admin', store.session('admin', who, Date.now()), 43200); return json(response, { ok: true }); }
        if (relative === 'api/login' && input) { throttle(request, 'student',String(input.code||'').replace(/[\s-]/g,'').toUpperCase()); const who = store.studentLogin(String(input.code || '')); if (!who) throw fail(401, '学习码不正确或已停用'); setCookie(response, 'student', store.session('student', who, Date.now()), 2592000); return json(response, { ok: true }); }
        if (relative === 'api/logout' && input) { const role = input.admin ? 'admin' : 'student'; store.logout(cookie(request, role)); setCookie(response, role, '', 0); return json(response, { ok: true }); }
        if (relative.startsWith('api/admin/')) {
          session(request, 'admin');
          if (relative === 'api/admin/state' && !input) return json(response, { classes: store.classes(), students: store.students(), courses: descriptions });
          if (relative === 'api/admin/classes' && input) {
            const name = cleanName(input.name);
            if(input.id&&(!Array.isArray(input.courses)||input.courses.some(id=>!UNITS.includes(id))))throw fail(400,'只能开放现行教学单元');
            if (input.id) { if (!store.updateClass(input.id, name, input.courses)) throw fail(404, '班级不存在'); return json(response, { ok: true }); }
            return json(response, store.createClass(name));
          }
          if (relative === 'api/admin/students' && input) {
            if (!store.classes().some(c => c.id === input.classId)) throw fail(400, '请选择班级');
            if (input.id) { if (!store.updateStudent(input.id, cleanName(input.name), input.classId, input.active === true)) throw fail(404, '学生不存在'); return json(response, { ok: true }); }
            const names = String(input.names || '').split('\n').filter(name => name.trim()).map(cleanName);
            if (!names.length || names.length > 100) throw fail(400, '每次填写 1–100 位学生');
            return json(response, { students: names.map(name => store.createStudent(name, input.classId)) });
          }
          if (relative === 'api/admin/cards' && input) {
            const selected = store.students().filter(s => input.studentId ? s.id === input.studentId : s.classId === input.classId);
            if (!selected.length) throw fail(404, '没有找到学生');
            if (input.renew && selected.length !== 1) throw fail(400, '请逐个重发学习卡');
            if (input.renew) store.renewCard(selected[0].id);
            const cards = await Promise.all(selected.map(async s => { const code = store.card(s.id), target = origin + BASE + '#card=' + code; return { ...s, code, className: store.classes().find(c => c.id === s.classId)?.name, svg: await QRCode.toString(target, { type: 'svg', margin: 2, color: { dark: '#4b3428', light: '#ffffff' } }) }; }));
            return json(response, { cards });
          }
          throw fail(404, '管理操作不存在');
        }
        if (relative === 'api/me' && !input) { const who = identity(request, url.searchParams.get('preview')); return json(response, { ...who, auth: undefined, courses: descriptions.filter(c => who.courses.includes(c.id)).map(c=>({...c,...progress.summary(who.preview?{}:store.progress(who.student.id,c.id).value,definitions[c.id],c.id)})) }); }
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
          return json(response, { student: who.student, preview: who.preview, grant: grant.id, expires: grant.expires, progress: who.preview ? { generation: 0, value: {} } : store.progress(who.student.id, course) });
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
        let who; try { who = identity(request, url.searchParams.get('preview')); } catch (error) { if (error.status === 401) return publicFile(response, 'index.html', 'text/html; charset=utf-8'); throw error; }
        if (!who.courses.includes(course)) return notice(response, '这节课还没向你的班级开放', 403);
        const entry = packages.generated.get(course + '/index.html').body.toString().replace('<head>', '<head><script src="/lesson/access-client.js"></script>');
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(request.method === 'HEAD' ? undefined : entry); return;
      }
      const auth = session(request, 'student', false), admin = session(request, 'admin', false);
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
