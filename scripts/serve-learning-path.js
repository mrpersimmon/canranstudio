'use strict';

const http = require('node:http');
const path = require('node:path');
const { prepare } = require('./build-learning-path-release');
const { parseByteRange } = require('../core/course-package-service-worker');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.woff2': 'font/woff2'
};

function createServer() {
  // Serve exactly the root-page artifact, including its package scope and hashes.
  // Restart after rebuilding to load a new snapshot.
  const { files } = prepare();
  return http.createServer((request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { response.writeHead(400); response.end(); return; }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (pathname === '/index.html' || (!files.has(relative) && (!path.extname(pathname) || /\.html?$/i.test(pathname)))) {
      response.writeHead(302, { Location: '/', 'Cache-Control': 'no-cache' }); response.end(); return;
    }
    const bytes = files.get(relative);
    if (!bytes) { response.writeHead(404); response.end(); return; }
    const headers = {
      'Content-Type': TYPES[path.extname(relative)] || 'application/octet-stream',
      'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff',
      'Service-Worker-Allowed': '/', 'Accept-Ranges': 'bytes'
    };
    let body = bytes, status = 200;
    if (request.headers.range) {
      const range = parseByteRange(request.headers.range, bytes.length);
      if (!range) {
        response.writeHead(416, { ...headers, 'Content-Range': 'bytes */' + bytes.length }); response.end(); return;
      }
      status = 206;
      headers['Content-Range'] = 'bytes ' + range.start + '-' + range.end + '/' + bytes.length;
      body = bytes.subarray(range.start, range.end + 1);
    }
    response.writeHead(status, { ...headers, 'Content-Length': body.length });
    response.end(request.method === 'HEAD' ? undefined : body);
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 42817);
  createServer().listen(port, '127.0.0.1', () => process.stdout.write('Learning path: http://127.0.0.1:' + port + '/\n'));
}
module.exports = { createServer };
