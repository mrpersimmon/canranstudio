'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const catalog = require('../core/course-catalog');
const { normalizeBasePath, relocateSource } = require('./public-base-path');
const { LESSON_HEADER_CONTRACT } = require('./http-header-contract');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const RESOURCE = /\.(?:js|css|woff2|svg|png|webp|avif|jpe?g|mp3)(?:[?#].*)?$/i;
const IMAGE = /\.(?:svg|png|webp|avif|jpe?g)$/i;
// Explicit teaching mode: adding a course requires a deliberate audio decision.
const VOICED = new Set(['unit1-2', 'unit3-4', 'unit5-6', 'unit49-50', 'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark']);
const CLASSROOM = new Set(['home', 'unit7-8', 'unit9-10', 'unit11-12', 'unit13-14', 'unit15-16', 'unit17-18', 'unit19-20', 'unit21-22', 'unit23-24', 'unit25-26', 'unit27-28', 'unit29-30']);

function scopeSource(source, relative, basePath) {
  return relocateSource(source, relative, basePath).replace(new RegExp('<script src="' + basePath + 'core/subpath-entry\\.js"></script>\\s*'), '');
}

function loaderMarkup(basePath, course, brandImage) {
  return `<div id="courseLoader" role="region" aria-label="课程加载"><div class="course-loader-card"><img src="${brandImage}" width="88" height="88" alt=""><h1>${course.title.replace(/[<>&"]/g, '')}</h1><p role="status" aria-label="课程准备状态" id="courseLoadingStatus">正在准备课程…</p><progress aria-label="课程准备进度" id="courseLoadingProgress" max="100" value="0"></progress><p id="courseLoadingDetail"></p><div class="course-loader-actions"><button id="courseLoadingRetry" type="button" hidden>再试一次</button><a href="${basePath}">返回课程</a></div></div></div>`;
}

const LOADER_CSS = `#courseLoader .course-loader-card>img{display:block;width:88px;height:88px;object-fit:contain;margin:0 auto}@keyframes course-loader-show{from{opacity:0}to{opacity:1}}#courseLoader .course-loader-card{animation:course-loader-show .001s step-end .2s both}html[data-course-painting] #courseLoader .course-loader-card,#courseLoader:has(button:not([hidden])) .course-loader-card{animation:none}@media(prefers-reduced-motion:reduce){#courseLoader .course-loader-card{animation:none}}html[data-course-painting] body>:not(#courseLoader){visibility:hidden!important}html[data-course-preparing] body>:not(#courseLoader){display:none!important}#courseLoader{position:fixed;inset:0;z-index:2147483000;overflow:auto;display:grid;place-items:center;padding:20px;box-sizing:border-box;background:#fcf8ef;color:#4b3428;font:18px/1.6 system-ui,sans-serif}#courseLoader .course-loader-card{text-align:center;width:min(420px,100%);box-sizing:border-box;padding:28px 24px;background:#fffdf7;border:3px solid #4b3428;border-radius:28px;box-shadow:0 6px 0 #e4daca}#courseLoader h1{font-size:25px;margin:10px 0}#courseLoader progress{accent-color:#7fae62;width:100%;height:20px}#courseLoader .course-loader-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:20px}#courseLoader button,#courseLoader a{font:700 16px/1.5 system-ui,sans-serif;display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border:2px solid #4b3428;border-radius:20px;background:#fffdf7;color:#4b3428;text-decoration:none;cursor:pointer;box-sizing:border-box}#courseLoader button{background:#85ae65;color:#fff}#courseLoader [hidden]{display:none!important}#courseLoadingDetail{font-size:14px;min-height:22px}#courseResourceNotice{font:14px/1.5 system-ui,sans-serif;padding:8px 12px;background:#fff2cf;color:#4b3428;text-align:center}html[data-course-preparing] body{margin:0!important}#courseLoader button:focus-visible,#courseLoader a:focus-visible{outline:3px solid #e99c1f;outline-offset:4px}`;

function entryHtml(source, basePath, course, brandImage) {
  let html = source.replace(/<script\b([^>]*)>/gi, (_, attributes) => '<script type="application/x-course"' + attributes.replace(/\s+type\s*=\s*["'][^"']*["']/gi, '') + '>')
    .replace(/(<img\b[^>]*?)\bsrc=/gi, '$1data-course-src=')
    .replace(/(<(?:img|source)\b[^>]*?)\bsrcset=/gi, '$1data-course-srcset=')
    .replace(/(<link\b[^>]*?)\bhref=/gi, '$1data-course-href=');
  html = html.replace(/<style\b/gi, '<style type="application/x-course"');
  html = html.replace(/<html\b/i, '<html data-course-preparing');
  const failed = "document.getElementById('courseLoadingStatus').textContent='还没准备好，请刷新后再试。';document.getElementById('courseLoadingRetry').hidden=false;document.getElementById('courseLoadingRetry').onclick=function(){location.reload()}";
  html = html.replace(/<head>/i, `<head><style id="courseLoaderStyle">${LOADER_CSS}</style><script defer src="${basePath}core/course-cache.js" onerror="${failed}"></script><script defer src="${basePath}core/course-loader.js" data-course="${course.id}" data-base="${basePath}" onerror="${failed}"></script>`);
  // Keep real text navigation available when scripting is disabled. The normal
  // page stays gated, so this fallback cannot expose a partly loaded picture.
  const fallback = course.id === 'home'
    ? (source.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || '')
      .replace(/<img\b[^>]*>/gi, '').replace(/\s+id="[^"]*"/g, '')
    : `<h1>${course.title.replace(/[<>&"]/g, '')}</h1><p>请开启浏览器的 JavaScript 后再进入课程。</p><a href="${basePath}">返回课程</a>`;
  const noScript = `<noscript id="courseNoScript"><style>#courseLoader{display:none!important}html[data-course-preparing] body>#courseNoScript{display:block!important;font:18px/1.6 system-ui,sans-serif;padding:24px;color:#4b3428;background:#fcf8ef}noscript a{display:inline-block;padding:12px;color:inherit}noscript section{margin:24px 0}noscript [hidden]{display:none!important}</style>${fallback}</noscript>`;
  return html.replace(/(<body\b[^>]*>)/i, '$1' + loaderMarkup(basePath, course, brandImage) + noScript);
}

async function createCoursePackages({ root, basePath = '/' }) {
  normalizeBasePath(basePath);
  const generated = new Map(), sourceFiles = new Map(), resourceEntries = new Map();
  async function bytes(relative) {
    if (!sourceFiles.has(relative)) {
      if (relative.startsWith('/') || relative.split('/').includes('..')) throw new Error('Invalid course resource: ' + relative);
      let value = await fs.readFile(path.join(root, relative));
      if (/\.(?:html|js|css|json|svg)$/.test(relative)) value = Buffer.from(scopeSource(value.toString(), relative, basePath));
      sourceFiles.set(relative, value);
    }
    return sourceFiles.get(relative);
  }
  async function resource(relative) {
    if (resourceEntries.has(relative)) return resourceEntries.get(relative);
    const data = await bytes(relative), sha256 = digest(data), type = TYPES[path.extname(relative)] || 'application/octet-stream';
    const address = `resources/${sha256}/${path.posix.basename(relative)}`;
    generated.set(address, { body: data, type, immutable: true });
    const value = { key: basePath + relative, url: basePath + address, sha256, bytes: data.length, type };
    resourceEntries.set(relative, value);
    return value;
  }
  function virtualResource(relative, data, type) {
    const sha256 = digest(data), address = `resources/${sha256}/${path.posix.basename(relative)}`;
    generated.set(address, { body: data, type, immutable: true });
    return { key: basePath + relative, url: basePath + address, sha256, bytes: data.length, type };
  }
  async function walk(directory) {
    const entries = await fs.readdir(path.join(root, directory), { withFileTypes: true }).catch(error => { if (error.code === 'ENOENT') return []; throw error; });
    const lists = await Promise.all(entries.map(entry => entry.isDirectory() ? walk(directory + '/' + entry.name) : Promise.resolve([directory + '/' + entry.name])));
    return lists.flat();
  }
  const units = (await fs.readdir(root, { withFileTypes: true })).filter(entry => entry.isDirectory() && /^unit\d+-\d+$/.test(entry.name)).map(entry => entry.name).sort((a, b) => parseInt(a.slice(4)) - parseInt(b.slice(4)));
  const courses = [{ id: 'home', entry: 'index.html' }, ...units.map(id => ({ id, entry: id + '/index.html' })), ...catalog.COURSES.filter(course => course.status === 'published').map(course => ({ id: course.id, entry: course.entry }))];
  // COURSE registration uses published map state; keep the source entry list authoritative.
  for (const item of require('./course-registry').PUBLISHED_COURSES) if (!courses.some(course => course.id === item.id)) courses.push({ id: item.id, entry: item.entry });
  const withdrawn = JSON.parse(await fs.readFile(path.join(root, 'core/course-withdrawals.json'), 'utf8'));
  if (!Array.isArray(withdrawn) || withdrawn.some(value => !/^(?:home|unit\d+-\d+|lesson\d+|soundmark)@[a-f0-9]{64}$/.test(value))) throw new Error('Invalid withdrawn course versions');
  const index = { schema: 1, basePath, protocol: 1, courses: {}, withdrawn };
  // Reuse the site's actual brand image without another request on the loading screen.
  const brandImage = 'data:image/png;base64,' + (await bytes('assets/brand/starflower.png')).toString('base64');

  for (const course of courses) {
    const source = (await bytes(course.entry)).toString();
    course.title = course.id === 'home' ? '灿然英语工作室' : (source.match(/<title>([^<]+)<\/title>/i)?.[1] || '我的课程').split(' · ')[0];
    if (!VOICED.has(course.id) && !CLASSROOM.has(course.id)) throw new Error('Declare the teaching mode for ' + course.id);
    const noVoice = CLASSROOM.has(course.id);
    const wanted = new Set([course.entry]), scanned = new Set();
    const add = value => {
      if (!value || /^(?:data:|blob:|https?:|#)/.test(value)) return;
      let key = value.split(/[?#]/)[0];
      if (key.startsWith(basePath)) key = key.slice(basePath.length);
      if (key.startsWith('/')) key = key.slice(1);
      key = path.posix.normalize(key);
      if (RESOURCE.test(key) && (!noVoice || !/\/audio\/.*\.mp3$/.test(key))) wanted.add(key);
    };
    async function addDirectory(dir) {
      for (const file of await walk(dir)) if (RESOURCE.test(file) && !/\.(?:js|css)$/.test(file)) add(basePath + file);
    }
    if (course.id !== 'home') {
      await addDirectory('assets/lesson49/icons');
      await addDirectory('assets/' + course.id);
      if (['lesson49', 'unit49-50'].includes(course.id)) await addDirectory('assets/lesson49/subjects');
      if (!noVoice) {
        if (course.id === 'unit49-50') { await addDirectory('lesson49/audio'); await addDirectory('lesson50/audio'); }
        else await addDirectory(course.id + '/audio');
      }
      await addDirectory('assets/feedback');
    }
    for (;;) {
      const pending = [...wanted].filter(file => !scanned.has(file));
      if (!pending.length) break;
      for (const file of pending) {
        scanned.add(file);
        if (!/\.(?:html|js|css)$/.test(file)) continue;
        const text = (await bytes(file)).toString();
        for (const match of text.matchAll(/(?:src|href)=["']([^"']+)["']/g)) add(match[1].startsWith('/') ? match[1] : basePath + path.posix.join(path.posix.dirname(file), match[1]));
        for (const match of text.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) add(match[1].startsWith('/') ? match[1] : basePath + path.posix.join(path.posix.dirname(file), match[1]));
        // Catalogs describe other courses too. Their unused artwork and retired voices are not dependencies.
        if (file === 'core/course-catalog.js' || (course.id === 'home' && /\/content\.js$/.test(file))) continue;
        for (const match of text.matchAll(/["'`]((?:\/lesson)?\/assets\/[^"'`\s]+)["'`]/g)) {
          const value = match[1];
          if (value.endsWith('/')) await addDirectory(value.replace(/^\/(?:lesson\/)?/, ''));
          else if (!value.includes('${')) add(value);
        }
      }
    }
    if (/^(?:lesson\d+|soundmark)$/.test(course.id)) {
      const definition = catalog.COURSES.find(item => item.id === course.id);
      const collect = value => {
        if (typeof value === 'string' && value.startsWith('assets/') && RESOURCE.test(value)) add(basePath + value);
        else if (value && typeof value === 'object') Object.values(value).forEach(collect);
      };
      collect(definition?.map);
    }
    wanted.add('core/course-loader.js');
    wanted.add('core/course-cache.js');
    const resources = await Promise.all([...wanted].sort().map(resource));
    const entry = Buffer.from(entryHtml(source, basePath, course, brandImage));
    const shell = virtualResource('course-shells/' + course.id + '.html', entry, TYPES['.html']);
    resources.push(shell);
    const required = resources.filter(item => !item.type.startsWith('audio/'));
    const audio = resources.filter(item => item.type.startsWith('audio/'));
    const mode = noVoice ? 'classroom' : 'voiced';
    const revision = digest(JSON.stringify([mode, resources.map(item => [item.key, item.sha256])]));
    const manifest = { schema: 1, protocol: 1, basePath, id: course.id, title: course.title, entry: basePath + course.entry, shell: shell.key, route: course.id === 'home' ? basePath : basePath + course.id + '/', revision, mode, required, audio, narration: audio.filter(item => !item.key.includes('/assets/feedback/')), feedback: audio.filter(item => item.key.includes('/assets/feedback/')) };
    const manifestBody = Buffer.from(JSON.stringify(manifest));
    const manifestPath = `course-packages/${course.id}/${revision}.json`;
    generated.set(manifestPath, { body: manifestBody, type: TYPES['.json'], immutable: true });
    generated.set(course.entry, { body: entry, type: TYPES['.html'] });
    index.courses[course.id] = { title: course.title, revision, manifest: basePath + manifestPath, sha256: digest(manifestBody) };
  }
  generated.set('course-index.json', { body: Buffer.from(JSON.stringify(index)), type: TYPES['.json'] });
  for (const relative of ['core/course-cache.js', 'core/course-loader.js']) generated.set(relative, { body: await bytes(relative), type: TYPES['.js'] });
  generated.set('core/subpath-worker.js', { body: Buffer.concat([Buffer.from('self.courseResponseHeaders = ' + JSON.stringify(LESSON_HEADER_CONTRACT) + ';\n'), await bytes('core/course-cache.js'), Buffer.from('\n'), await bytes('core/course-worker.js')]), type: TYPES['.js'], worker: true });
  return { generated, index };
}

async function writeCoursePackages(options) {
  const result = await createCoursePackages(options);
  for (const [relative, item] of result.generated) {
    const file = path.join(options.out, relative);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, item.body);
  }
  return result.index;
}

module.exports = { createCoursePackages, writeCoursePackages, entryHtml, TYPES, IMAGE };
