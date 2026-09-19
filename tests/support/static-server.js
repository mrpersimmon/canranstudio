'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const { relocateSource, subpathRuntime } = require('../../scripts/public-base-path');

const ROOT = process.cwd();
const PORT = 4173;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function resolveRequestPath(requestUrl) {
  let pathname = decodeURIComponent(new URL(requestUrl, 'http://127.0.0.1').pathname);
  if (pathname.startsWith('/lesson/')) pathname = pathname.slice('/lesson'.length);
  const withIndex = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const absolute = path.resolve(ROOT, `.${withIndex}`);
  if (absolute !== ROOT && !absolute.startsWith(`${ROOT}${path.sep}`)) {
    return null;
  }
  return absolute;
}

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  const scoped = pathname.startsWith('/lesson/');
  if (pathname === '/lesson' || /^\/lesson\/home(?:\/|\/index\.html)?$/.test(pathname)) {
    response.writeHead(308, { Location: '/lesson/' }).end(); return;
  }
  const generated = scoped && subpathRuntime('/lesson/')[pathname.slice('/lesson/'.length)];
  if (generated) {
    response.writeHead(200, { 'Content-Type': TYPES['.js'], 'Service-Worker-Allowed': '/lesson/' }).end(generated); return;
  }
  let file;
  try {
    file = resolveRequestPath(request.url);
  } catch {
    response.writeHead(400).end('Bad Request');
    return;
  }

  if (!file) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    let body = await fs.readFile(file);
    if (scoped && /\.(?:html|js|css|json|svg)$/.test(file)) body = relocateSource(body.toString(), path.relative(ROOT, file), '/lesson/');
    response.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      ...(pathname === '/tests/fixtures/root-media-worker.js' ? { 'Service-Worker-Allowed': '/' } : {}),
      'Cache-Control': 'no-store'
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      response.writeHead(404).end('Not Found');
      return;
    }
    response.writeHead(500).end('Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  process.stdout.write(`static test server listening on http://127.0.0.1:${PORT}\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
