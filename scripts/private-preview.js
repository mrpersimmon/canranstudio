'use strict';
// A separate, authenticated demo origin. No student database or production account APIs.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const {promisify} = require('node:util');
const scrypt = promisify(crypto.scrypt);
const {createReviewServer} = require('./review-bench');
const escapeHtml = value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isLoopback = host=>['localhost','127.0.0.1','[::1]'].includes(host);
function normalizeOrigin(value) {
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/' ||
    (url.protocol !== 'https:' && !(url.protocol === 'http:' && isLoopback(url.hostname)))) {
    throw Error('Preview requires an HTTPS origin (HTTP is allowed only on loopback for tests).');
  }
  return url.origin;
}
async function hashCode(code, salt = crypto.randomBytes(16)) {
  if (typeof code !== 'string' || code.length < 12 || code.length > 256) throw Error('Preview code must contain 12–256 characters.');
  const hash = await scrypt(code,salt,32);
  return 'scrypt$'+salt.toString('hex')+'$'+hash.toString('hex');
}
function parseHash(encoded) {
  if (!/^scrypt\$[0-9a-f]{32}\$[0-9a-f]{64}$/.test(encoded || '')) throw Error('A valid preview access-code hash is required.');
  const [,salt,hash] = encoded.split('$');
  return {salt:Buffer.from(salt,'hex'),hash:Buffer.from(hash,'hex')};
}
function safeNext(value, origin) {
  if (typeof value !== 'string' || value.length > 2048 || !value.startsWith('/') || /[\\\r\n]/.test(value)) return '/';
  try {
    if (/^\/\//.test(decodeURIComponent(value))) return '/';
    const url=new URL(value,origin);
    return url.origin === origin && !url.pathname.startsWith('/_preview/') ? url.pathname+url.search : '/';
  } catch { return '/'; }
}
function cookies(header) {
  return Object.fromEntries(String(header||'').split(';').map(part=>part.trim().split('=')).filter(pair=>pair.length===2));
}
const LOGIN_CSP="default-src 'none'; style-src 'self'; script-src 'self'; img-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'";
// Same-origin forms must retain their Origin; no-referrer turns it into "null".
const BASE_HEADERS={'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'same-origin','x-robots-tag':'noindex, nofollow, noarchive'};
async function createPrivatePreviewServer({root=path.resolve(__dirname,'..'),port=4403,origin,accessHash,version,
  clock=Date.now,sessionMs=8*60*60*1000,loginLimit=12,reviewFactory=createReviewServer}={}) {
  origin=normalizeOrigin(origin);
  if (!/^[a-f0-9]{40}$/.test(version||'')) throw Error('Preview must identify an immutable 40-character commit.');
  const encoded=parseHash(accessHash),secure=origin.startsWith('https:'),host=new URL(origin).host;
  const cookieName=secure?'__Host-canran_preview':'canran_preview_dev';
  const sessionCookie=(token,ttl)=>cookieName+'='+token+'; Path=/; HttpOnly; SameSite=Strict; Max-Age='+ttl+(secure?'; Secure':'');
  const sessions=new Map(),attempts=new Map();let activeLogins=0,globalWindow={start:clock(),count:0};
  const upstream=await reviewFactory({root,port:0});
  const upstreamPort=upstream.address().port;
  const internalOrigin='http://127.0.0.1:'+upstreamPort;
  const loginTemplate=await fs.readFile(path.join(root,'review-bench/private-login.html'),'utf8');
  const css=await fs.readFile(path.join(root,'review-bench/private-access.css'));
  const script=await fs.readFile(path.join(root,'review-bench/private-access.js'));
  const digest=token=>crypto.createHash('sha256').update(token).digest('hex');
  function session(request) {
    const token=cookies(request.headers.cookie)[cookieName];
    if (!/^[a-f0-9]{64}$/.test(token||'')) return null;
    const key=digest(token),expires=sessions.get(key);
    if (!expires || expires <= clock()) { sessions.delete(key);return null; }
    return {key,expires};
  }
  function canAttempt(request) {
    const now=clock();
    for(const [key,value] of attempts)if(value.start+60000<=now)attempts.delete(key);
    if(globalWindow.start+60000<=now)globalWindow={start:now,count:0};
    // Only the dedicated loopback reverse proxy may set this header; nginx overwrites it.
    const ip=String(request.headers['x-real-ip']||request.socket.remoteAddress).slice(0,80);
    const current=attempts.get(ip)||{start:now,count:0};
    if(globalWindow.count>=120 || current.count>=loginLimit || activeLogins>=4 || attempts.size>=4096&&!attempts.has(ip))return false;
    current.count++;globalWindow.count++;attempts.set(ip,current);return true;
  }
  const send=(response,status,body='',headers={})=>{response.writeHead(status,{...BASE_HEADERS,...headers});response.end(body);};
  const login=(response,next,error='',status=200)=>send(response,status,loginTemplate
    .replaceAll('{{NEXT}}',escapeHtml(safeNext(next,origin))).replaceAll('{{ERROR}}',escapeHtml(error))
    .replaceAll('{{VERSION}}',version.slice(0,8)),{'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':LOGIN_CSP,'X-Frame-Options':'DENY'});
  async function readForm(request) {
    if(!/^application\/x-www-form-urlencoded(?:;|$)/i.test(request.headers['content-type']||''))throw Object.assign(Error('Form required'),{status:415});
    return new Promise((resolve,reject)=>{
      let bytes=0,body='',failed=false;
      request.on('data',part=>{bytes+=part.length;if(bytes>4096){if(!failed){failed=true;reject(Object.assign(Error('Form too large'),{status:413}));}}else if(!failed)body+=part.toString();});
      request.on('end',()=>{if(!failed)resolve(new URLSearchParams(body));});request.on('error',reject);
    });
  }
  const server=http.createServer(async(request,response)=>{
    try {
      if(String(request.headers.host||'').toLowerCase()!==host.toLowerCase() ||
        request.headers.origin && request.headers.origin!==origin) return send(response,403,'Forbidden');
      if(!request.url.startsWith('/') || request.url.startsWith('//'))return send(response,400,'Invalid request target');
      const url=new URL(request.url,origin),route=url.pathname;
      if(request.method==='POST') {
        if(request.headers.origin!==origin)return send(response,403,'Origin required');
        if(route==='/_preview/logout') {
          const old=session(request);if(old)sessions.delete(old.key);
          return send(response,303,'',{'Location':'/_preview/login','Set-Cookie':sessionCookie('',0),'Clear-Site-Data':'"cache", "storage"'});
        }
        if(route!=='/_preview/login')return send(response,405,'Method not allowed',{'Allow':'GET, HEAD'});
        if(!canAttempt(request))return send(response,429,'尝试次数较多，请稍后再试。',{'Retry-After':'60','Content-Type':'text/plain; charset=utf-8'});
        const form=await readForm(request),code=form.get('code')||'',next=safeNext(form.get('next'),origin);
        if(code.length>256 || code.length<12)return login(response,next,'口令不正确，请重试。',401);
        activeLogins++;
        let matches;
        try { matches=crypto.timingSafeEqual(await scrypt(code,encoded.salt,32),encoded.hash); }
        finally { activeLogins--; }
        if(!matches)return login(response,next,'口令不正确，请重试。',401);
        for(const [key,expires]of sessions)if(expires<=clock())sessions.delete(key);
        const old=session(request);if(old)sessions.delete(old.key);
        if(sessions.size>=128)return send(response,429,'请稍后再试。',{'Retry-After':'60'});
        const token=crypto.randomBytes(32).toString('hex');sessions.set(digest(token),clock()+sessionMs);
        return send(response,303,'',{'Location':next,'Set-Cookie':sessionCookie(token,Math.floor(sessionMs/1000))});
      }
      if(!['GET','HEAD'].includes(request.method))return send(response,405,'Method not allowed',{'Allow':'GET, HEAD'});
      if(route==='/_preview/access.css')return send(response,200,request.method==='HEAD'?'':css,{'Content-Type':'text/css; charset=utf-8'});
      if(route==='/_preview/access.js')return send(response,200,request.method==='HEAD'?'':script,{'Content-Type':'text/javascript; charset=utf-8'});
      if(route==='/_preview/login')return login(response,url.searchParams.get('next'));
      const current=session(request);
      if(!current) {
        if(route==='/' || (request.headers.accept||'').includes('text/html'))return send(response,303,'',{'Location':'/_preview/login?next='+encodeURIComponent(safeNext(request.url,origin))});
        return send(response,401,'Authentication required');
      }
      if(route==='/_preview/session')return send(response,200,request.method==='HEAD'?'':JSON.stringify({version,expires:current.expires}),{'Content-Type':'application/json; charset=utf-8'});
      if(request.headers['sec-fetch-dest']==='serviceworker' || route.endsWith('/subpath-worker.js'))return send(response,404,'Not found');
      const proxy=http.request({hostname:'127.0.0.1',port:upstreamPort,path:request.url,method:request.method,
        headers:{host:'127.0.0.1:'+upstreamPort,origin:internalOrigin}},incoming=>{
        const headers={...incoming.headers,...BASE_HEADERS};
        delete headers['content-length'];delete headers['set-cookie'];
        headers['content-security-policy']=(headers['content-security-policy']||LOGIN_CSP)
          .split(';').map(value=>value.trim()).filter(value=>value&&!/^worker-src(?:\s|$)/.test(value)).concat("worker-src 'none'").join('; ');
        if(route==='/' && request.method==='GET' && incoming.statusCode===200) {
          let body='';incoming.setEncoding('utf8');incoming.on('data',part=>body+=part);incoming.on('end',()=>{
            const extra='<link rel="stylesheet" href="/_preview/access.css"><script defer src="/_preview/access.js"></script>';
            body=body.replace('<body>','<body class="private-review">').replace('</head>',extra+'</head>').replace('本地 · 演示数据','私有验收 · '+version.slice(0,8))
              .replace('<button id="refresh">','<button id="preview-focus" type="button">实测模式</button><form class="preview-exit" method="post" action="/_preview/logout"><button>退出验收</button></form><button id="refresh">')
              .replace('<main class="workspace">','<main class="workspace"><div id="preview-focus-bar" hidden><button id="preview-unfocus" type="button">← 返回验收台</button><span>演示预览</span></div>');
            send(response,200,body,headers);
          });
        } else {response.writeHead(incoming.statusCode,headers);incoming.pipe(response);}
      });
      proxy.on('error',()=>{if(!response.headersSent)send(response,502,'Preview temporarily unavailable');else response.destroy();});
      response.on('close',()=>proxy.destroy());proxy.end();
    } catch(error) { if(!response.headersSent)send(response,error.status||500,'请求暂时无法完成。');else response.destroy(); }
  });
  server.requestTimeout=15000;server.headersTimeout=10000;
  server.on('close',()=>{upstream.closeAllConnections?.();upstream.close();sessions.clear();});
  try {await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});}
  catch(error){upstream.close();throw error;}
  return server;
}
if(require.main===module)(async()=>{
  if(!process.env.PREVIEW_CONFIG_FILE)throw Error('PREVIEW_CONFIG_FILE must name the private JSON configuration.');
  const config=JSON.parse(await fs.readFile(process.env.PREVIEW_CONFIG_FILE,'utf8'));
  const release=JSON.parse(await fs.readFile(path.resolve(__dirname,'../preview-release.json'),'utf8'));
  if(release.commit!==config.version || release.units!==72)throw Error('Private preview configuration does not match this packaged release.');
  process.env.REVIEW_FIXED_BUILD='1';
  const server=await createPrivatePreviewServer({...config,root:path.resolve(__dirname,'..'),port:Number(process.env.PREVIEW_PORT||4403)});
  console.log('Private preview listening on loopback port '+server.address().port+'; version '+config.version.slice(0,8));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={createPrivatePreviewServer,hashCode,normalizeOrigin,safeNext};
