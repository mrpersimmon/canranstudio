'use strict';
// Local, read-only prototype server. Course APIs and private data are not served.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const prototypePath = '/poc/award-reveal-prototype/';
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
const modules = new Set(['/core/story-certificate.css', '/unit1-2/completion.css', '/unit1-2/completion.js']);
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname === '/') return res.writeHead(302, {Location:prototypePath}).end();
  let relative;
  try { relative=decodeURIComponent(url.pathname); } catch { return res.writeHead(400).end(); }
  const allowed = relative.startsWith('/assets/') || modules.has(relative) ||
    ['index.html','prototype.css','prototype.js'].some(name => relative === prototypePath + name) || relative === prototypePath;
  if (!allowed || !['GET','HEAD'].includes(req.method)) return res.writeHead(404).end();
  const file = path.resolve(root, '.' + relative + (relative.endsWith('/') ? 'index.html' : ''));
  if (!file.startsWith(root + path.sep)) return res.writeHead(404).end();
  try {
    const body=await fs.readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD' ? undefined : body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4271,'127.0.0.1',()=>console.log('Reward prototype: http://127.0.0.1:4271'+prototypePath+'?variant=A&case=earned'));
