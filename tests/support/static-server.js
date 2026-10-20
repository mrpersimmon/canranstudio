'use strict';

const http = require('node:http');
const path = require('node:path');
const { relocateSource, subpathRuntime } = require('../../scripts/public-base-path');
const { createCoursePackages } = require('../../scripts/course-packages');
const { LESSON_HEADER_CONTRACT } = require('../../scripts/http-header-contract');
const { TYPES, publicPath, readPreviewFile } = require('./preview-files');

const ROOT = process.cwd();
const PORT = Number(process.env.COURSE_TEST_PORT || 4173);
let lessonPackages;
// Historical suites need the same frozen source for raw URLs and generated
// packages. Page routing alone cannot intercept service-worker requests.
const unit78LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit7-8/'+name));
const unit910LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit9-10/'+name));
const unit1112LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit11-12/'+name));
const unit1314LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit13-14/'+name));
const unit1516LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit15-16/'+name));
const unit1718LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit17-18/'+name));
const unit1920LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit19-20/'+name));
const unit2122LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit21-22/'+name));
const unit2324LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit23-24/'+name));
const unit2526LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit25-26/'+name));
const unit2728LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit27-28/'+name));
const unit2930LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit29-30/'+name));
const unit3132LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit31-32/'+name));
const unit3334LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit33-34/'+name));
const unit3536LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit35-36/'+name));
const unit3738LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit37-38/'+name));
const unit3940LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js'].map(name=>'unit39-40/'+name));
const unit4142V153LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js','grammar.js','previous-questions.js'].map(name=>'unit41-42/'+name));
const unit4344V153LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js','grammar.js'].map(name=>'unit43-44/'+name));
const unit4546V153LegacyFiles = new Set(['index.html','content.js','unit.js','unit.css','scene.js','grammar.js','typography.css'].map(name=>'unit45-46/'+name));
const readSource = relative => process.env.COURSE_UNIT78_LEGACY === '1' && unit78LegacyFiles.has(relative)
  ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit7-8-before-fivezones',path.posix.basename(relative)))
  : process.env.COURSE_UNIT910_LEGACY === '1' && unit910LegacyFiles.has(relative)
    ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit9-10-before-fivezones',path.posix.basename(relative)))
    : process.env.COURSE_UNIT1112_LEGACY === '1' && unit1112LegacyFiles.has(relative)
      ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit11-12-before-fivezones',path.posix.basename(relative)))
      : process.env.COURSE_UNIT1314_LEGACY === '1' && unit1314LegacyFiles.has(relative)
        ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit13-14-before-fivezones',path.posix.basename(relative)))
        : process.env.COURSE_UNIT1516_LEGACY === '1' && unit1516LegacyFiles.has(relative)
          ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit15-16-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT4546_V153_LEGACY === '1' && unit4546V153LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit45-46-before-v153',path.posix.basename(relative)))
          : process.env.COURSE_UNIT4344_V153_LEGACY === '1' && unit4344V153LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit43-44-before-v153',path.posix.basename(relative)))
          : process.env.COURSE_UNIT4142_V153_LEGACY === '1' && unit4142V153LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit41-42-before-v153',path.posix.basename(relative)))
          : process.env.COURSE_UNIT3940_LEGACY === '1' && unit3940LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit39-40-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT3738_LEGACY === '1' && unit3738LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit37-38-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT3536_LEGACY === '1' && unit3536LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit35-36-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT3334_LEGACY === '1' && unit3334LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit33-34-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT3132_LEGACY === '1' && unit3132LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit31-32-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT2930_LEGACY === '1' && unit2930LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit29-30-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT2728_LEGACY === '1' && unit2728LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit27-28-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT2526_LEGACY === '1' && unit2526LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit25-26-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT2324_LEGACY === '1' && unit2324LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit23-24-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT2122_LEGACY === '1' && unit2122LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit21-22-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT1920_LEGACY === '1' && unit1920LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit19-20-before-fivezones',path.posix.basename(relative)))
          : process.env.COURSE_UNIT1718_LEGACY === '1' && unit1718LegacyFiles.has(relative)
            ? require('node:fs/promises').readFile(path.join(ROOT,'tests/fixtures/unit17-18-before-fivezones',path.posix.basename(relative)))
            : readPreviewFile(ROOT, relative);

const server = http.createServer(async (request, response) => {
  const host = request.headers.host, port = server.address().port;
  const hostCount = request.rawHeaders.filter((value, index) => index % 2 === 0 && value.toLowerCase() === 'host').length;
  if (hostCount !== 1 || ![`127.0.0.1:${port}`, `localhost:${port}`].includes(host)
      || (request.headers.origin && request.headers.origin !== `http://${host}`)) {
    response.writeHead(403).end('Forbidden'); return;
  }
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  let pathname;
  try {
    if (!request.url.startsWith('/') || request.url.startsWith('//')) throw Error('Invalid path');
    pathname = decodeURIComponent(new URL(request.url, 'http://' + host).pathname);
  } catch { response.writeHead(400).end('Bad Request'); return; }
  const scoped = pathname.startsWith('/lesson/');
  const relative = (scoped ? pathname.slice('/lesson/'.length) : pathname.slice(1)) + (pathname.endsWith('/') ? 'index.html' : '');
  const generatedPath = /^(?:course-index\.json|course-packages\/(?:home|unit\d+-\d+|lesson\d+|soundmark)\/[a-f0-9]{64}\.json|resources\/[a-f0-9]{64}\/[^/]+)$/.test(relative);
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (scoped) for (const [key, value] of Object.entries(LESSON_HEADER_CONTRACT)) response.setHeader(key, value);
  if (pathname === '/lesson' || /^\/lesson\/home(?:\/|\/index\.html)?$/.test(pathname)) {
    response.writeHead(308, { Location: '/lesson/' }).end(); return;
  }
  if (!publicPath(relative) && !(scoped && generatedPath)) { response.writeHead(403).end('Forbidden'); return; }
  try {
    if (scoped && !pathname.startsWith('/lesson/tests/')) {
      lessonPackages ||= createCoursePackages({ root: ROOT, basePath: '/lesson/', readSource });
      const packages = await lessonPackages;
      const item = packages.generated.get(relative);
      if (item) {
        response.writeHead(200, { 'Content-Type': item.type, 'Cache-Control': item.immutable ? 'public, max-age=31536000, immutable' : 'no-cache', ...(item.worker ? { 'Service-Worker-Allowed': '/lesson/' } : {}) }).end(request.method === 'HEAD' ? undefined : item.body);
        return;
      }
      if (generatedPath) { response.writeHead(404).end('Not Found'); return; }
    }
    const generated = scoped && subpathRuntime('/lesson/')[pathname.slice('/lesson/'.length)];
    if (generated) {
      response.writeHead(200, { 'Content-Type': TYPES['.js'], 'Service-Worker-Allowed': '/lesson/' }).end(request.method === 'HEAD' ? undefined : generated); return;
    }
    // Raw URLs and package aliases use the same public-source boundary.
    let body = await readSource(relative);
    if (scoped && /\.(?:html|js|css|json|svg)$/.test(relative)) body = relocateSource(body.toString(), relative, '/lesson/');
    response.writeHead(200, {
      'Content-Type': TYPES[path.extname(relative).toLowerCase()],
      ...(pathname === '/tests/fixtures/root-media-worker.js' ? { 'Service-Worker-Allowed': '/' } : {}),
      'Cache-Control': 'no-store'
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    if (error.status === 403) { response.writeHead(403).end('Forbidden'); return; }
    if (['ENOENT', 'EISDIR', 'ENOTDIR', 'ELOOP'].includes(error.code)) {
      response.writeHead(404).end('Not Found');
      return;
    }
    response.writeHead(500).end('Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  process.stdout.write(`static test server listening on http://127.0.0.1:${server.address().port}\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
