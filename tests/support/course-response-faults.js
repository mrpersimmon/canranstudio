'use strict';

// Test-server HTTP boundary: worker fetches must see the same faults as page
// fetches. page.route() cannot reliably intercept requests owned by a worker.
// This module is installed only by tests/login/server.js, never the app server.
function installCourseResponseFaults(server) {
  const handlers = server.listeners('request');
  const faults = new Map(), held = new Set();
  server.removeAllListeners('request');
  server.on('request', async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    if (pathname === '/__test__/course-responses') {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const { path, result, reset } = JSON.parse(Buffer.concat(chunks).toString() || '{}');
      if (reset) faults.clear();
      else if (result) faults.set(path, result);
      else faults.delete(path);
      for (const item of held) if (reset || item.path === path) { item.response.writeHead(503).end(); held.delete(item); }
      response.writeHead(200, { 'Content-Type': 'application/json' }).end('{}');
      return;
    }
    const entry = [...faults].find(([pattern]) => new RegExp('^' + pattern.split('*').map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*') + '$').test(pathname));
    if (!entry) { for (const handler of handlers) handler(request, response); return; }
    const [path, fault] = entry;
    if (fault.hold) {
      const item = { path, response }; held.add(item);
      response.on('close', () => held.delete(item));
      return;
    }
    response.writeHead(fault.status || 200, {
      'Content-Type': fault.contentType || 'text/plain', 'Cache-Control': 'no-store'
    }).end(Buffer.from(fault.body || '', 'base64'));
  });
}

async function courseResponse(page, path, result) {
  const response = await page.request.post('/__test__/course-responses', { data: {
    path, result: result && {
      ...result, json: undefined,
      contentType: result.json ? 'application/json' : result.contentType,
      body: Buffer.from(result.json ? JSON.stringify(result.json) : result.body || '').toString('base64')
    }
  } });
  if (!response.ok()) throw new Error('Course fault server unavailable: ' + response.status());
}

module.exports = { installCourseResponseFaults, courseResponse };
