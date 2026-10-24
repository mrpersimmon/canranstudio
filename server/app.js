'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { openStore } = require('./store');
const { UNITS, RETIRED } = require('./catalog');
const { createCoursePackages } = require('../scripts/course-packages');
const progress = require('./progress');
const learning = require('./learning');
const { createManagement } = require('./management');
const { validClaim } = require('../core/award-rules');
const { createAwardBook } = require('../scripts/award-book-bundle');
const {retainPackages}=require('./bundles');
const { passwordProblem } = require('./student-credentials');
const { clientAddress } = require('./client-address');
const { normalizeBasePath } = require('../scripts/public-base-path');
const fail = (status, message) => Object.assign(new Error(message), { status });
const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const PORTAL_CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
// The course loader executes integrity-checked cached scripts inline. Keep that
// compatibility only on authorized course documents, never the account portal.
const COURSE_CSP = PORTAL_CSP.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'");
async function createApp({ root = path.resolve(__dirname, '..'), dataDir = path.join(root, '.data/lesson-access'), origin = 'http://127.0.0.1:4181', bundle = null, trustProxy = false, basePath = '/lesson/' } = {}) {
  const BASE = normalizeBasePath(basePath);
  if (trustProxy !== false && trustProxy !== 'loopback') throw Error('trustProxy must be false or loopback');
  const store = openStore(dataDir);
  const awardBook = await createAwardBook(root, BASE);
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
  const navigation = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  const descriptions = await Promise.all(UNITS.map(async id => {
    const source = await fs.readFile(path.join(root, id, 'index.html'), 'utf8');
    const image = source.match(/<section id="cover"[\s\S]*?<img[^>]+src="([^"]+)"/)?.[1];
    const section = navigation.match(new RegExp('<section[^>]+data-unit="' + id + '"[\\s\\S]*?</section>'))?.[0] || '';
    const intro = section.match(/<p class="course-intro">([^<]*)<\/p>/)?.[1] || '';
    const artwork = [...section.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => BASE.slice(0,-1) + match[1]);
    return { id, intro, artwork, title: packages.index.courses[id].title, label: 'Lesson ' + id.slice(4).replace('-', '–'), image: image?.startsWith('/') ? BASE.slice(0, -1) + image : null };
  }));
  const definitions = Object.fromEntries(UNITS.map(id=>[id,progress.definition(root,id,BASE)]));
  const currentProgress = (studentId, course) => { const saved = store.progress(studentId, course); return { ...saved, value: progress.normalize(saved.value, definitions[course], course, Boolean(store.systemUpgrade())) }; };
  const currentAwards = (studentId, course) => definitions[course].reward ? store.award(studentId, course, definitions[course].reward.edition) : null;
  const archiveSummary = archive => ({id:archive.id,course:archive.course,kind:archive.kind,edition:archive.edition,name:archive.name,issuedAt:archive.issuedAt,meta:archive.meta,url:BASE+'awards/history/'+archive.id+'/'});
  function retainedCertificate(who, course) {
    const retained = store.courseUpgrade(who, course);
    if (!retained?.completed) return null;
    const archive = retained.certificateIds.map(id=>store.certificateArchive(who,id)).find(Boolean);
    if (!archive) return null;
    const summary = archiveSummary(archive);
    if (summary.kind === 'card') summary.meta = {...summary.meta,scene:BASE+'awards/history-assets/'+course+'/'+archive.meta.scene.replace(/^\/+/, '')};
    return summary;
  }
  let certificateView;
  const archiveView = async () => certificateView ||= await require('./certificate-archive-view').createCertificateArchiveView({root,basePath:BASE});
  function throttle(request, kind, credential) {
    store.authThrottle.check(clientAddress(request, trustProxy), kind, credential);
  }
  function credentialFailure(kind, credential, status, message) {
    store.authThrottle.failed(kind, credential);
    throw fail(status, message);
  }
  function cookie(request, role) { return request.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('canran_' + role + '='))?.split('=')[1]; }
  function session(request, role, required = true) { const value = store.lookupSession(cookie(request, role), role, Date.now()); if (!value && required) throw fail(role==='admin'&&store.lookupSession(cookie(request,'student'),'student',Date.now())?403:401, '请先登录'); return value; }
  const management = createManagement({ store, cookie, definitions, descriptions, origin, basePath: BASE });
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
      const group = management.group(management.authenticate(request), preview);
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
    response.setHeader('Content-Security-Policy', PORTAL_CSP);
    try {
      const url = new URL(request.url, origin), pathname = decodeURIComponent(url.pathname), relative = pathname.slice(BASE.length);
      if (BASE === '/' && pathname === '/lesson/core/subpath-worker.js') { response.setHeader('Service-Worker-Allowed', '/lesson/'); return publicFile(response, 'retired-worker.js', 'text/javascript'); }
      if (BASE === '/' && (pathname === '/lesson' || pathname.startsWith('/lesson/'))) return notice(response, '旧课程入口已移除', 410);
      if (BASE !== '/' && pathname === BASE.slice(0, -1)) return response.writeHead(308, { Location: BASE }).end();
      if (!pathname.startsWith(BASE) || relative.split('/').some(part => part === '..' || part.startsWith('.'))) throw fail(404, '页面不存在');
      if (relative === 'health') return json(response, { ok: true, access: 'class-v1' });
      if (['GET','HEAD'].includes(request.method) && awardBook.files.has(relative)) {
        const file = awardBook.files.get(relative);
        response.writeHead(200, {'Content-Type':file.type, 'Cache-Control':'public, max-age=31536000, immutable'});
        return response.end(request.method === 'HEAD' ? undefined : file.body);
      }
      if (relative === 'core/course-worker.js') { response.writeHead(200, { 'Content-Type':'text/javascript' }); return response.end(await fs.readFile(path.join(root, relative))); }
      if (['portal.css','portal.js','admin-learning.js','admin-learning.css','admin-teachers.js','admin-teachers.css','access-client.js','learning-observer.js','access-worker.js','system-upgrade.js','history-certificates.js','history-certificates.css','local-certificate-copies.js'].includes(relative)) {
        if (relative === 'access-worker.js') response.setHeader('Service-Worker-Allowed', BASE);
        return publicFile(response, relative, relative.endsWith('.css') ? 'text/css' : 'text/javascript');
      }
      if (relative === 'fonts/maple-mono-nl-semibold.woff2') {
        response.writeHead(200, { 'Content-Type': 'font/woff2', 'Cache-Control': 'public, max-age=86400' });
        return response.end(await fs.readFile(path.join(root, 'server/public', relative)));
      }
      if (relative === 'core/course-banners.css') { response.writeHead(200, {'Content-Type':'text/css', 'Cache-Control':'no-cache'}); return response.end(await fs.readFile(path.join(root,relative))); }
      if (relative === 'core/subpath-worker.js') { response.setHeader('Service-Worker-Allowed', BASE); return publicFile(response, 'access-worker.js', 'text/javascript'); }
      if (BASE === '/' && relative === 'core/course-package-service-worker.js') { response.setHeader('Service-Worker-Allowed', BASE); return publicFile(response, 'access-worker.js', 'text/javascript'); }
      if (['assets/brand/starflower.png','assets/brand/starflower-favicon.png','assets/brand/starflower-apple-touch.png'].includes(relative)) { response.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control':'public, max-age=86400' }); return response.end(await fs.readFile(path.join(root, relative))); }
      if (/^api\//.test(relative)) {
        const input = request.method === 'POST' ? await body(request) : null;
        if (request.method !== 'GET' && request.method !== 'POST') throw fail(405, '不支持此操作');
        if (relative === 'api/admin/login' && input) {
          const supplied = String(input.username || ''), password = String(input.password || '');
          const isTeacher = supplied !== store.adminUsername() && /^[a-z]1\d{7}$/i.test(supplied.trim());
          const username = isTeacher ? supplied.trim().toLowerCase() : supplied, kind = isTeacher ? 'teacher' : 'admin';
          throttle(request, kind, username);
          if (username.length > 128 || password.length > 256) credentialFailure(kind, username, 401, '账号或密码不正确');
          const who = isTeacher ? store.teachers.login(username, password) : store.adminLogin(username, password);
          if (!who) credentialFailure(kind, username, 401, '账号或密码不正确，或账号已停用。初始密码已使用或过期时，请联系管理员重置。');
          store.authThrottle.clear(kind, username); store.logout(cookie(request, 'admin'));
          const setup = isTeacher && who.mustChangePassword;
          setCookie(response, 'admin', setup ? who.setupToken : store.session(isTeacher ? 'teacher' : 'admin', isTeacher ? who.id : who, Date.now()), setup ? Math.max(0, Math.floor((who.setupExpiresAt - Date.now()) / 1000)) : 43200);
          return json(response, { ok: true, mustChangePassword: !!setup });
        }
        if (relative === 'api/admin/password' && input) {
          const who = management.authenticate(request, true);
          if (who.role !== 'teacher') throw fail(403, '此入口用于老师修改自己的密码');
          const id = who.teacher.id;
          throttle(request, 'teacher-password', id);
          const problem = passwordProblem(input.password, { loginPinyin: who.teacher.loginPinyin, teacherNumber: who.teacher.teacherNumber });
          if (problem) throw fail(400, problem);
          if (input.password !== input.confirmPassword) throw fail(400, '两次输入的新密码不一致');
          const old = String(input.currentPassword || '');
          if (who.auth.role !== 'teacher-setup' && (old.length > 128 || !store.teachers.checkPassword(id, old))) credentialFailure('teacher-password', id, 400, '当前密码不正确');
          if (store.teachers.checkPassword(id, input.password)) throw fail(400, '新密码不能与原密码相同');
          store.teachers.changePassword(id, input.password, who.auth);
          setCookie(response, 'admin', store.session('teacher', id, Date.now()), 43200);
          return json(response, { ok: true });
        }
        if (relative === 'api/login' && input) {
          const number = String(input.studentNumber || '').trim().toLowerCase(), password = String(input.password || '');
          throttle(request, 'student', number);
          if (number.length > 32 || password.length > 128) credentialFailure('student', number, 401, '学号或密码不正确，或账号已停用');
          const student = store.studentLogin(number, password);
          if (!student) credentialFailure('student', number, 401, '学号或密码不正确，或账号已停用。初始密码已使用或过期时，请联系老师重置。');
          store.authThrottle.clear('student', number);
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
          const currentPassword = String(input.currentPassword || '');
          if (auth.role !== 'student-setup' && (currentPassword.length > 120 || !store.checkStudentPassword(student.id, currentPassword))) credentialFailure('password', student.id, 400, '当前密码不正确');
          if (store.checkStudentPassword(student.id, input.password)) throw fail(400, '新密码不能与原密码相同');
          store.changePassword(student.id, input.password);
          store.authThrottle.clear('password', student.id);
          setCookie(response, 'student', store.session('student', student.id, Date.now()), 2592000);
          return json(response, { ok: true });
        }
        if (relative === 'api/logout' && input) { const role = input.admin ? 'admin' : 'student'; store.logout(cookie(request, role)); setCookie(response, role, '', 0); return json(response, { ok: true }); }
        if (relative.startsWith('api/admin/')) return json(response, await management.handle(request, url, relative, input));
        if (relative === 'api/awards' && !input) {
          const {student} = studentSession(request);
          // Earned keepsakes belong to the student even after a class closes a
          // course. No course entry or answers are granted by this read endpoint.
          const archives = store.certificateArchives(student.id);
          const cards = store.awards(student.id).flatMap(saved => {
            if (saved.retainedCompletion) return [];
            const original = archives.find(a=>a.kind==='card'&&a.course===saved.course&&a.edition===saved.edition);
            const liveMeta = awardBook.editions[saved.course]?.[saved.edition];
            const meta = original ? {...original.meta,scene:BASE+'awards/history-assets/'+saved.course+'/'+original.meta.scene.replace(/^\/+/, '')} : liveMeta;
            const stars = Math.min(5, Object.values(saved.zones || {}).filter(zone=>zone?.earnedAt).length);
            return meta && stars ? [{...meta,id:saved.course+':'+saved.edition,course:saved.course,edition:saved.edition,
              ...(original?{name:original.name,archiveId:original.id}:{}),stars,firstFullStarAt:stars===5?saved.firstFullStarAt:null}] : [];
          }).sort((a,b)=>Number(a.course.match(/\d+/)[0])-Number(b.course.match(/\d+/)[0]) || a.edition.localeCompare(b.edition));
          return json(response, {student:{id:student.id,name:student.name},cards,archives:archives.map(archiveSummary),availableCourses:[...new Set([...store.allowed(student.id),...archives.map(a=>a.course)])],systemUpgrade:store.systemUpgrade(student.id)});
        }
        if (relative === 'api/certificates' && !input) {
          const {student}=studentSession(request);
          return json(response,{archives:store.certificateArchives(student.id).map(archiveSummary)});
        }
        const certificate = relative.match(/^api\/certificates\/([a-zA-Z0-9_-]+)$/);
        if (certificate && !input) {
          const {student}=studentSession(request),archive=store.certificateArchive(student.id,certificate[1]);
          if(!archive)throw fail(404,'证书不存在');
          return json(response,{archive});
        }
        if (relative === 'api/me' && !input) {
          if (!url.searchParams.get('preview')) {
            const { student, auth } = studentSession(request, true);
            if (student.mustChangePassword || auth.role === 'student-setup') return json(response, { student, mustChangePassword: true, courses: [] });
          }
          const who = identity(request, url.searchParams.get('preview'));
          const upgrade=who.preview?null:store.systemUpgrade(who.student.id);
          return json(response, { ...who, auth: undefined, systemUpgrade:upgrade, courses: descriptions.filter(c => who.courses.includes(c.id)).map(c=>{
            const summary=progress.summary(who.preview?{}:store.progress(who.student.id,c.id).value,definitions[c.id],c.id,who.preview?null:currentAwards(who.student.id,c.id),Boolean(upgrade));
            const retained=who.preview?null:store.courseUpgrade(who.student.id,c.id);
            return {...c,...summary,completed:summary.stars===5,retainedCompletion:Boolean(retained?.completed),...(retained?.completed?{next:'words'}:{})};
          }) });
        }
        const entering = relative.match(/^api\/courses\/(unit\d+-\d+)\/enter$/);
        const permitting = relative.match(/^api\/courses\/(unit\d+-\d+)\/permit$/);
        if (permitting && !input) {
          const auth = session(request,'student',false), admin = session(request,'admin',false);
          const grant = auth && store.activeGrant(auth, permitting[1], Date.now());
          if (!grant && !admin) throw fail(403,'请重新进入课程');
          return json(response,{studentId:auth?.subject || 'admin-preview',expires:grant?.expires || Date.now()+7200000,systemUpgrade:auth?store.systemUpgrade(auth.subject):null});
        }
        if (entering && input) {
          const who = identity(request, input.preview), course = entering[1];
          if (!UNITS.includes(course) || !who.courses.includes(course)) throw fail(403, '这节课还没向你的班级开放');
          const grant = who.preview ? { id: '', expires: Date.now() + 7200000 } : store.grant(who.auth, course, Date.now());
          if(!who.preview)store.learning.enter(who.student.id,course,store.progress(who.student.id,course).generation);
          return json(response, { student: who.student, preview: who.preview, grant: grant.id, expires: grant.expires, systemUpgrade:who.preview?null:store.systemUpgrade(who.student.id),retainedCompletion:who.preview?null:store.courseUpgrade(who.student.id,course),retainedCertificate:who.preview?null:retainedCertificate(who.student.id,course),awards: who.preview ? null : currentAwards(who.student.id, course), progress: who.preview ? { generation: 0, value: {} } : currentProgress(who.student.id, course) });
        }
        if (relative === 'api/progress' && input) {
          const {auth} = studentSession(request), course = input.course;
          if (input.studentId !== auth.subject || !UNITS.includes(course)) throw fail(403,'学习记录不属于当前身份或课程');
          const current = store.progress(auth.subject,course);
          const upgrade=store.systemUpgrade(auth.subject);
          if(upgrade&&input.epoch!==upgrade.epoch)return json(response,{stale:true,generation:current.generation,systemUpgrade:upgrade});
          if(!store.validGrant(input.grant,auth.subject,course))throw fail(403,'学习记录不属于当前身份或课程');
          if (input.generation !== current.generation) return json(response,{stale:true,generation:current.generation});
          const before=progress.normalize(current.value,definitions[course],course,Boolean(upgrade));
          const value = progress.merge(before,progress.normalize(input.value,definitions[course],course,Boolean(upgrade)));
          const advanced=Object.keys(value.activity.unitCompleted).some(id=>!before.activity.unitCompleted[id]);
          const unit = definitions[course];
          const claims = Object.entries(input.value?.activity?.unitAwardClaims || {}).filter(([zone, claim]) => validClaim(unit, zone, claim));
          const awards = unit.reward ? store.grantAwards(auth.subject, course, unit.reward, claims) : null;
          store.saveLearning(auth.subject,course,current.generation,value,learning.submissions(input.observations,definitions[course],course,before),advanced);
          return json(response,{ok:true,awards});
        }
        if (relative === 'api/progress/reset' && input) {
          const who=identity(request),course=input.course;
          if (!who.courses.includes(course)) throw fail(403,'这节课还没向你的班级开放');
          const upgrade=store.systemUpgrade(who.student.id);
          if(upgrade&&input.epoch!==upgrade.epoch)return json(response,{stale:true,generation:store.progress(who.student.id,course).generation,systemUpgrade:upgrade});
          const generation=store.progress(who.student.id,course).generation+1;
          store.resetLearning(who.student.id,course,generation);
          return json(response,{generation});
        }
        throw fail(404, '操作不存在');
      }
      if (!['GET','HEAD'].includes(request.method)) throw fail(405, '不支持此操作');
      const localArchivePage=relative.match(/^awards\/local-history\/(unit\d+-\d+)\/(card|legacy-paper)\/([a-f0-9]{64})\/?$/);
      if(localArchivePage){
        let student;try{({student}=studentSession(request));}catch(error){if(error.status===401)return publicFile(response,'index.html','text/html; charset=utf-8');throw error;}
        const [,course,kind,id]=localArchivePage;
        if(!store.allowed(student.id).includes(course)&&!store.certificateArchives(student.id,course).length)throw fail(403,'该课程当前未开放；本机原证资料仍保留');
        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':COURSE_CSP,'Cache-Control':'no-store'});
        return response.end(request.method==='HEAD'?undefined:await(await archiveView()).page({id,course,kind,local:true}));
      }
      const archivePage=relative.match(/^awards\/history\/([a-zA-Z0-9_-]+)\/?$/);
      if(archivePage){
        let student;try{({student}=studentSession(request));}catch(error){if(error.status===401)return publicFile(response,'index.html','text/html; charset=utf-8');throw error;}
        const archive=store.certificateArchive(student.id,archivePage[1]);if(!archive)throw fail(404,'证书不存在');
        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':COURSE_CSP,'Cache-Control':'no-store'});
        return response.end(request.method==='HEAD'?undefined:await(await archiveView()).page(archive));
      }
      const archiveAsset=relative.match(/^awards\/history-assets\/(unit\d+-\d+)\/(.+)$/);
      if(archiveAsset){
        const {student}=studentSession(request);
        if(!store.certificateArchives(student.id,archiveAsset[1]).length&&!store.allowed(student.id).includes(archiveAsset[1]))throw fail(403,'证书不属于当前账号');
        const resource=await(await archiveView()).resource(archiveAsset[1],archiveAsset[2]);if(!resource)throw fail(404,'证书资源不存在');
        const etag='"'+crypto.createHash('sha256').update(resource.body).digest('hex')+'"';
        const headers={'Content-Type':resource.type,'Cache-Control':'private, no-cache',Vary:'Cookie',ETag:etag};
        if(request.headers['if-none-match']?.split(',').some(value=>value.trim().replace(/^W\//,'')===etag))return response.writeHead(304,headers).end();
        response.writeHead(200,headers);
        return response.end(request.method==='HEAD'?undefined:resource.body);
      }
      if (RETIRED.includes(relative.split('/')[0]) && /^(?:lesson\d+|soundmark)\/?(?:index\.html)?$/.test(relative)) return notice(response, '这节课已下架', 410);
      if (['','index.html','admin/','admin','home/','home/index.html'].includes(relative)) return publicFile(response, 'index.html', 'text/html; charset=utf-8');
      if (['awards','awards/'].includes(relative)) {
        try { studentSession(request); } catch(error) {
          if (error.status===401 || error.message==='请先设置新密码') return publicFile(response,'index.html','text/html; charset=utf-8');
          throw error;
        }
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        return response.end(request.method==='HEAD'?undefined:awardBook.html);
      }
      const courseRoute = relative.match(/^(unit\d+-\d+)(?:\/(?:index\.html)?)?$/);
      if (courseRoute) {
        const course = courseRoute[1]; if (!UNITS.includes(course)) throw fail(404, '课程不存在');
        let who; try { who = identity(request, url.searchParams.get('preview')); } catch (error) { if (error.status === 401 || error.message === '请先设置新密码') return publicFile(response, 'index.html', 'text/html; charset=utf-8'); throw error; }
        if (!who.courses.includes(course)) return notice(response, '这节课还没向你的班级开放', 403);
        const entry = packages.generated.get(course + '/index.html').body.toString().replace('<head>', '<head><script src="' + BASE + 'system-upgrade.js"></script><script src="' + BASE + 'learning-observer.js"></script><script src="' + BASE + 'access-client.js"></script>');
        response.setHeader('Content-Security-Policy', COURSE_CSP);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(request.method === 'HEAD' ? undefined : entry); return;
      }
      const auth = session(request, 'student', false), admin = management.authenticate(request, false, false);
      if (!admin && store.lookupSession(cookie(request, 'student'), 'student-setup', Date.now())) throw fail(403, '请先设置新密码');
      const allowed = [...new Set([...(admin ? management.courses(admin) : []), ...(auth ? [...store.allowed(auth.subject), ...store.activeCourses(auth, Date.now())] : [])])];
      const metadataRoute = relative.match(/^(?:course-status|course-withdrawals)\/((?:unit\d+-\d+|lesson\d+|soundmark|home))\.json$/);
      if (metadataRoute) {
        // Never answer a conditional request before checking current account
        // state and course access. A cached ETag is not an authorization token.
        if (!admin) studentSession(request);
        if (!allowed.includes(metadataRoute[1])) throw fail(403, '这节课还没向你的班级开放');
        const item = packages.generated.get(relative);
        if (!item) throw fail(404, '课程不存在');
        const headers = { 'Content-Type': item.type, 'Cache-Control': 'private, no-cache', Vary: 'Cookie', ETag: item.etag };
        const unchanged = request.headers['if-none-match']?.split(',').some(value => value.trim() === '*' || value.trim().replace(/^W\//, '') === item.etag);
        if (unchanged) return response.writeHead(304, headers).end();
        response.writeHead(200, { ...headers, 'Content-Length': item.body.length });
        return response.end(request.method === 'HEAD' ? undefined : item.body);
      }
      if (relative === 'course-index.json') {
        if (!auth && !admin) throw fail(401, '请先登录');
        const sharedFonts=(packages.index.sharedFonts||[]).filter(item=>[...(owners.get(item.url)||[])].some(id=>allowed.includes(id)));
        return json(response, { ...packages.index, sharedFonts, courses: Object.fromEntries(Object.entries(packages.index.courses).filter(([id]) => allowed.includes(id))) });
      }
      const infrastructure = ['core/course-cache.js','core/course-loader.js'];
      if (relative === 'core/course-catalog.js') throw fail(403, '请使用本课程的教学定义');
      if (!infrastructure.includes(relative) && ![...(owners.get(pathname) || [])].some(id => allowed.includes(id))) throw fail(auth || admin ? 403 : 401, '请先进入有权限的课程');
      const item = packages.generated.get(relative) || logical.get(relative); if (!item) throw fail(404, '资源不存在');
      if (item.type.startsWith('text/html')) response.setHeader('Content-Security-Policy', COURSE_CSP);
      response.setHeader('Content-Type', item.type);
      const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      if (range) { const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), item.body.length - 1) : item.body.length - 1; if (start > end) return response.writeHead(416, { 'Content-Range': 'bytes */' + item.body.length }).end(); response.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${item.body.length}`, 'Accept-Ranges':'bytes' }).end(request.method === 'HEAD' ? undefined : item.body.subarray(start, end + 1)); return; }
      response.writeHead(200).end(request.method === 'HEAD' ? undefined : item.body);
    } catch (error) {
      if (!response.headersSent && error.status === 429 && error.retryAfter) response.setHeader('Retry-After', String(error.retryAfter));
      if (!response.headersSent) json(response, { error: error.status ? error.message : '暂时无法完成，请重试' }, error.status || 500); else response.end();
      if (!error.status) console.error('Lesson request failed:', error.code || error.name);
    }
  });
  server.requestTimeout=30000;server.headersTimeout=15000;
  server.on('close', () => store.close());
  return server;
}
module.exports = { createApp };
