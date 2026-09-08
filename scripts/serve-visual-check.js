'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { prepare } = require('./build-learning-path-release');
const { ROOT, PROOF, VIEWPORTS, fingerprint, validateReport } = require('./visual-proof');
function createVisualServer({sharded=false}={}) {
  const prepared = prepare(), stamp = fingerprint(prepared), token = crypto.randomBytes(24).toString('hex');
  const files = new Map(prepared.files);
  const html = files.get('index.html').toString();
  // Classic scrollbars consume layout width; overlay-only headless defaults
  // must not hide narrow-screen overflow. Keep this device fixture out of releases.
  const fixtureHtml = html.replace('</head>','<link rel="stylesheet" href="/__qa__/scrollbar.css"></head>');
  // Retain the exact production HTML, including critical loader CSS. Only the
  // package installer is replaced with a deterministic, test-only adapter.
  files.set('__qa__/frame.html', Buffer.from(fixtureHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace('</body>','<script src="/__qa__/fixture-boot.js"></script></body>')));
  files.set('__qa__/loader.html', Buffer.from(fixtureHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace('</body>','<script src="/__qa__/axe.js"></script></body>')));
  for (const file of fs.readdirSync(path.join(ROOT,'tests/browser'))) files.set('__qa__/'+file,fs.readFileSync(path.join(ROOT,'tests/browser',file)));
  files.set('__qa__/axe.js',fs.readFileSync(require.resolve('axe-core/axe.min.js')));
  files.set('__qa__/config.json',Buffer.from(JSON.stringify({token, fingerprint:stamp, viewports:VIEWPORTS})));
  let report = null;
  const partials=new Map();
  const server = http.createServer((req,res)=>{
    const url = new URL(req.url,'http://127.0.0.1'), relative = url.pathname.slice(1);
    if(sharded&&relative==='__qa__/config.json'){
      const shard=Number(url.searchParams.get('shard'));
      if(!url.searchParams.has('shard')||!Number.isInteger(shard)||!VIEWPORTS[shard]){res.writeHead(400);res.end('Invalid viewport shard');return;}
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
      res.end(JSON.stringify({token,fingerprint:stamp,viewports:[VIEWPORTS[shard]],shard}));return;
    }
    if (req.method==='POST' && relative==='__qa__/result') {
      if (req.headers.origin !== 'http://'+req.headers.host) {res.writeHead(403);res.end();return;}
      let bytes = 0, chunks = [];
      req.on('data',chunk=>{bytes+=chunk.length;if(bytes>32*1024*1024)req.destroy();else chunks.push(chunk);});
      req.on('end',()=>{
        try {
          const payload=JSON.parse(Buffer.concat(chunks));
          if(payload.token!==token||payload.fingerprint!==stamp)throw Error('Wrong test run');
          if(sharded){
            if(!Number.isInteger(payload.shard)||!VIEWPORTS[payload.shard]||partials.has(payload.shard))throw Error('Invalid or repeated viewport shard');
            if(payload.checks.some(check=>String(check.viewport)!==String(VIEWPORTS[payload.shard])))throw Error('Wrong viewport in shard evidence');
            partials.set(payload.shard,payload);
            const runs=[...partials.values()];
            report={schema:1,fingerprint:stamp,finishedAt:new Date().toISOString(),status:runs.some(run=>run.status!=='passed')?'failed':partials.size===VIEWPORTS.length?'passed':'running',checks:runs.flatMap(run=>run.checks),mutations:runs.flatMap(run=>run.mutations),failures:runs.filter(run=>run.failure).map(run=>({shard:run.shard,failure:run.failure}))};
          }else report={...payload,token:undefined,finishedAt:new Date().toISOString()};
          if(report.status==='running'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({accepted:payload.shard,remaining:VIEWPORTS.length-partials.size}));return;}
          if(report.status==='passed')validateReport(report);
          fs.mkdirSync(path.join(ROOT,'test-results'),{recursive:true});
          const name=report.status==='passed'?PROOF:'test-results/readability-failed.json';
          if(report.status!=='passed')fs.rmSync(path.join(ROOT,PROOF),{force:true});
          fs.writeFileSync(path.join(ROOT,name),JSON.stringify(report,null,2)+'\n');
          res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({saved:name}));
        }catch(error){res.writeHead(400);res.end(error.message);}
      });return;
    }
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    const body=files.get(relative || 'index.html');
    if(!body){res.writeHead(404);res.end();return;}
    const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg','.woff2':'font/woff2'};
    res.writeHead(200,{'Content-Type':types[path.extname(relative)]||'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Service-Worker-Allowed':'/'});
    res.end(req.method==='HEAD'?undefined:body);
  });
  return {server, getReport:()=>report};
}
if(require.main===module){const {server}=createVisualServer();const port=Number(process.env.PORT||42819);server.listen(port,'127.0.0.1',()=>process.stdout.write('Browser readability check: http://127.0.0.1:'+port+'/__qa__/runner.html\n'));}
module.exports={createVisualServer};
