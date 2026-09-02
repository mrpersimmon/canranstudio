'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');

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
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://127.0.0.1').pathname);
  const withIndex = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const absolute = path.resolve(ROOT, `.${withIndex}`);
  if (absolute !== ROOT && !absolute.startsWith(`${ROOT}${path.sep}`)) {
    return null;
  }
  return absolute;
}

const server = http.createServer(async (request, response) => {
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
    const body = await fs.readFile(file);
    const headers = {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    };
    if (file === path.join(ROOT, 'core/course-package-service-worker.js')) {
      headers['Service-Worker-Allowed'] = '/';
    }
    response.writeHead(200, headers);
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
