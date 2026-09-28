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
const readSource = relative => readPreviewFile(ROOT, relative);

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
