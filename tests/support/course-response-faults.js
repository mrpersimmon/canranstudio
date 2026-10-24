'use strict';

// Test-server HTTP boundary: worker fetches must see the same faults as page
// fetches. page.route() cannot reliably intercept requests owned by a worker.
// This module is installed only by tests/login/server.js, never the app server.
function installCourseResponseFaults(server) {
  const handlers = server.listeners('request');
  const faults = new Map(), held = new Set(), network = []; let nextHeldId = 0;
  server.removeAllListeners('request');
  server.on('request', async (request, response) => {
    const target = new URL(request.url, 'http://localhost'), pathname = target.pathname;
    if (pathname === '/__test__/course-network') {
      response.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(network));return;
    }
    if (pathname === '/__test__/course-held') {
      // Expose only request IDs and route names, never cookies, bodies or pupil data.
      const details=target.searchParams.get('details')==='1';
      response.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify([...held].map(item=>details?{id:item.id,path:item.path}:item.path)));return;
    }
    if (/\/course-(?:status\/|withdrawals\/|index\.json)/.test(pathname)) {
      let bytes=0;const write=response.write,end=response.end;
      const count=chunk=>{if(typeof chunk==='string'||Buffer.isBuffer(chunk)||ArrayBuffer.isView(chunk))bytes+=Buffer.byteLength(chunk);};
      response.write=function(chunk,...args){count(chunk);return write.call(this,chunk,...args);};
      response.end=function(chunk,...args){count(chunk);return end.call(this,chunk,...args);};
      response.on('finish',()=>network.push({path:pathname,status:response.statusCode,bytes,conditional:!!request.headers['if-none-match']}));
    }
    if (pathname === '/__test__/course-responses') {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const { path, result, reset, resumeHeld } = JSON.parse(Buffer.concat(chunks).toString() || '{}');
      if (reset) { faults.clear(); network.length=0; }
      else if (result) faults.set(path, result);
      else faults.delete(path);
      for (const item of held) if (reset || item.path === path) {
        held.delete(item);
        if(resumeHeld&&!reset)for(const handler of handlers)handler(item.request,item.response);
        else item.response.writeHead(503).end();
      }
      response.writeHead(200, { 'Content-Type': 'application/json' }).end('{}');
      return;
    }
    // Simulated publication updates must expose the same new metadata as the
    // production builder. Keep this at HTTP level so workers see it too.
    const metadata = pathname.match(/^(.*\/)(course-status|course-withdrawals)\/([^/]+)\.json$/);
    const indexFault = metadata && faults.get(metadata[1]+'course-index.json');
    if (indexFault && !faults.has(pathname) && (!indexFault.status || indexFault.status === 200)) {
      try {
        const index = JSON.parse(Buffer.from(indexFault.body,'base64').toString());
        const descriptor = index.courses[metadata[3]];
        if (descriptor) {
          const value = {schema:index.schema,protocol:index.protocol,basePath:index.basePath,courseId:metadata[3],...(metadata[2]==='course-status'?{descriptor}:{}),withdrawn:index.withdrawn||[]};
          const body = JSON.stringify(value),etag='"'+require('node:crypto').createHash('sha256').update(body).digest('hex')+'"';
          response.writeHead(request.headers['if-none-match']===etag?304:200,{'Content-Type':'application/json','Cache-Control':'private, no-cache',ETag:etag}).end(request.headers['if-none-match']===etag?undefined:body);return;
        }
      } catch { /* Invalid-index fault remains a fault of the original route. */ }
    }
    const entry = [...faults].find(([pattern]) => new RegExp('^' + pattern.split('*').map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*') + '$').test(pathname));
    if (!entry) { for (const handler of handlers) handler(request, response); return; }
    const [path, fault] = entry;
    if (fault.hold) {
      const item = { id: ++nextHeldId, path, request, response }; held.add(item);
      response.on('close', () => held.delete(item));
      return;
    }
    response.writeHead(fault.status || 200, {
      'Content-Type': fault.contentType || 'text/plain', 'Cache-Control': 'no-store'
    }).end(Buffer.from(fault.body || '', 'base64'));
  });
}

async function courseResponse(page, path, result, {resumeHeld=false}={}) {
  const response = await page.request.post('/__test__/course-responses', { data: {
    path, resumeHeld, result: result && {
      ...result, json: undefined,
      contentType: result.json ? 'application/json' : result.contentType,
      body: Buffer.from(result.json ? JSON.stringify(result.json) : result.body || '').toString('base64')
    }
  } });
  if (!response.ok()) throw new Error('Course fault server unavailable: ' + response.status());
}

module.exports = { installCourseResponseFaults, courseResponse };
