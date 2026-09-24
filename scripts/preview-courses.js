'use strict';
const http = require('node:http');
const { createCoursePackages } = require('./course-packages');
const { LESSON_HEADER_CONTRACT } = require('./http-header-contract');

async function serveCourses({ root = process.cwd(), port = 4176 } = {}) {
  const base = '/lesson/';
  const { generated, index } = await createCoursePackages({ root, basePath: base });
  const logical = new Map();
  for (const descriptor of Object.values(index.courses)) {
    const pack = JSON.parse(generated.get(descriptor.manifest.slice(base.length)).body);
    for (const item of [...pack.required, ...pack.audio]) logical.set(item.key.slice(base.length), generated.get(item.url.slice(base.length)));
  }
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (url.pathname === '/' || url.pathname === '/lesson' || /^\/lesson\/home(?:\/|\/index\.html)?$/.test(url.pathname)) return response.writeHead(308, { Location: base }).end();
    if (!url.pathname.startsWith(base) || !['GET', 'HEAD'].includes(request.method)) return response.writeHead(404).end();
    const relative = url.pathname.slice(base.length) + (url.pathname.endsWith('/') ? 'index.html' : '');
    const item = generated.get(relative) || logical.get(relative);
    if (!item) return response.writeHead(404).end('Not Found');
    const headers = { ...LESSON_HEADER_CONTRACT, 'Content-Type': item.type, 'Cache-Control': item.immutable ? 'public, max-age=31536000, immutable' : 'no-cache', 'Service-Worker-Allowed': base };
    const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), item.body.length - 1) : item.body.length - 1;
      if (start > end) return response.writeHead(416, headers).end();
      headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + item.body.length;
      return response.writeHead(206, headers).end(request.method === 'HEAD' ? undefined : item.body.subarray(start, end + 1));
    }
    response.writeHead(200, headers).end(request.method === 'HEAD' ? undefined : item.body);
  });
  await new Promise((resolve, reject) => { server.on('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return server;
}
if (require.main === module) serveCourses().then(() => console.log('课程缓存预览：http://127.0.0.1:4176/lesson/')).catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { serveCourses };
