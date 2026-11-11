'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),http=require('node:http');
const {createPrivatePreviewServer,hashCode,normalizeOrigin,safeNext}=require('../../scripts/private-preview');
const CODE='synthetic-preview-code-123',VERSION='a'.repeat(40),ORIGIN='https://preview.example.test';
async function start(t,options={}) {
  const forwarded=[];
  const server=await createPrivatePreviewServer({port:0,origin:ORIGIN,version:VERSION,accessHash:await hashCode(CODE),
    reviewFactory:async()=>{const upstream=http.createServer((req,res)=>{
      forwarded.push({path:req.url,host:req.headers.host,origin:req.headers.origin});
      if(req.url==='/'){res.writeHead(200,{'content-type':'text/html','content-security-policy':"default-src 'self'; worker-src 'self'",'cache-control':'public, max-age=3600','referrer-policy':'no-referrer'});res.end('<html><head></head><body><span>本地 · 演示数据</span><button id="refresh">刷新代码</button></body></html>');}
      else if(req.url==='/review/catalog.json'){res.setHeader('Content-Type','application/json');res.end('{"courses":["demo"]}');}
      else if(req.url==='/lesson/unit1-2/'){res.setHeader('Content-Type','text/html');res.end('<html>demo course</html>');}
      else {res.writeHead(404);res.end('Not found');}
    });await new Promise(resolve=>upstream.listen(0,'127.0.0.1',resolve));return upstream;},...options});
  t.after(()=>new Promise(resolve=>{server.closeAllConnections?.();server.close(resolve);}));
  const request=(url,opts={})=>new Promise((resolve,reject)=>{
    const req=http.request({hostname:'127.0.0.1',port:server.address().port,path:url,method:opts.method||'GET',
      headers:{Host:'preview.example.test',...opts.headers}},res=>{let body='';res.on('data',b=>body+=b);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));});
    req.on('error',reject);req.end(opts.body);
  });
  const login=(code=CODE,next='/')=>request('/_preview/login',{method:'POST',headers:{Origin:ORIGIN,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,next}).toString()});
  return {request,login,forwarded};
}
test('private configuration rejects public HTTP, weak codes and foreign return URLs',async()=>{
  assert.throws(()=>normalizeOrigin('http://preview.example.test'),/HTTPS/);
  assert.throws(()=>normalizeOrigin('https://user:pass@preview.example.test'),/HTTPS/);
  assert.throws(()=>normalizeOrigin('https://preview.example.test/path'),/HTTPS/);
  assert.equal(normalizeOrigin('http://127.0.0.1:4403'),'http://127.0.0.1:4403');
  await assert.rejects(hashCode('short'),/12/);
  for(const value of ['//evil.test','/\\evil.test','/%2f%2fevil.test','https://evil.test','/\r\nLocation: evil','/_preview/logout'])assert.equal(safeNext(value,ORIGIN),'/',value);
  assert.equal(safeNext('/?unit=unit143-144&page=words-0',ORIGIN),'/?unit=unit143-144&page=words-0');
});
test('anonymous requests cannot read course assets or bypass Host/Origin, even with forged cookies',async t=>{
  const {request,forwarded}=await start(t);
  assert.equal((await request('/')).status,303);
  for(const url of ['/review/catalog.json','/lesson/unit1-2/','/lesson/resources/abc','/.git/config','/api/me'])assert.equal((await request(url)).status,401,url);
  assert.equal((await request('/review/catalog.json',{headers:{Cookie:'__Host-canran_preview='+ '1'.repeat(64)}})).status,401);
  assert.equal((await request('/_preview/login',{headers:{Host:'evil.test'}})).status,403);
  assert.equal((await request('/_preview/login',{headers:{Origin:'https://evil.test'}})).status,403);
  assert.equal((await request('/_preview/login',{method:'POST',body:'code='+CODE})).status,403);
  assert.equal(forwarded.length,0);
  const form=await request('/_preview/login?next='+encodeURIComponent('/?x="<script>'));
  assert.equal(form.status,200);assert(!form.body.includes('<script>'));assert.equal(form.headers['cache-control'],'no-store');
});
test('successful entry preserves its deep link, protects cookies, and proxies only allowed demo routes',async t=>{
  const {request,login,forwarded}=await start(t);
  const result=await login(CODE,'/?unit=unit143-144&page=words-0');assert.equal(result.status,303);
  assert.equal(result.headers.location,'/?unit=unit143-144&page=words-0');
  const cookie=result.headers['set-cookie'][0];for(const flag of ['__Host-canran_preview=','HttpOnly','SameSite=Strict','Secure','Path=/'])assert(cookie.includes(flag));
  const headers={Cookie:cookie.split(';')[0]};
  const page=await request('/',{headers});assert.equal(page.status,200);assert.match(page.body,/私有验收 · aaaaaaaa/);assert.match(page.body,/退出验收/);
  assert.equal(page.headers['cache-control'],'no-store');assert.match(page.headers['content-security-policy'],/worker-src 'none'/);
  assert.equal(page.headers['referrer-policy'],'same-origin','upstream header casing cannot override form Origin preservation');
  assert.equal(page.headers['content-security-policy'].match(/worker-src/g).length,1,'the first worker directive must not retain upstream caching');
  assert.equal((await request('/review/catalog.json',{headers})).status,200);
  assert.equal((await request('/lesson/unit1-2/',{headers})).status,200);
  for(const url of ['/.git/config','/api/progress','/.data/learning.sqlite'])assert.equal((await request(url,{headers})).status,404);
  assert.equal((await request('/lesson/core/subpath-worker.js',{headers})).status,404);
  assert.equal((await request('/other-worker',{headers:{...headers,'Sec-Fetch-Dest':'serviceworker'}})).status,404);
  const meta=await request('/_preview/session',{headers});assert.equal(JSON.parse(meta.body).version,VERSION);
  assert(forwarded.every(r=>/^127\.0\.0\.1:\d+$/.test(r.host)&&r.origin==='http://'+r.host));
});
test('oversized login bodies and absolute request targets are rejected',async t=>{
  const {request}=await start(t);
  assert.equal((await request('http://elsewhere.invalid/')).status,400);
  const tooBig=await request('/_preview/login',{method:'POST',headers:{Origin:ORIGIN,'Content-Type':'application/x-www-form-urlencoded'},body:'code='+ 'x'.repeat(5000)});
  assert.equal(tooBig.status,413);
});
test('logout revokes a copied session token and expired sessions cannot access assets',async t=>{
  let now=1000000;const {request,login}=await start(t,{clock:()=>now,sessionMs:1000});
  const cookie=(await login()).headers['set-cookie'][0].split(';')[0],headers={Cookie:cookie,Origin:ORIGIN};
  const result=await request('/_preview/logout',{method:'POST',headers});assert.equal(result.status,303);
  assert.match(result.headers['clear-site-data'],/storage/);assert.match(result.headers['set-cookie'][0],/Max-Age=0/);
  assert.equal((await request('/review/catalog.json',{headers})).status,401);
  const later=(await login()).headers['set-cookie'][0].split(';')[0];now+=1001;
  assert.equal((await request('/_preview/session',{headers:{Cookie:later}})).status,401);
});
test('incorrect codes are rate limited and recover after the bounded window',async t=>{
  let now=1000000;const {login}=await start(t,{clock:()=>now,loginLimit:2});
  assert.equal((await login('incorrect-preview-code')).status,401);
  assert.equal((await login('incorrect-preview-code')).status,401);
  const limited=await login();assert.equal(limited.status,429);assert.equal(limited.headers['retry-after'],'60');
  now+=60001;assert.equal((await login()).status,303);
});
test('access-file creation separates the hashed configuration and never silently rotates an existing code',async t=>{
  const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
  const {createAccessFiles}=require('../../scripts/preview-access');
  const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'canran-private-access-'));
  t.after(async()=>{const resolved=path.resolve(tmp);assert(resolved.startsWith(path.resolve(os.tmpdir())+path.sep+'canran-private-access-'));await fs.rm(resolved,{recursive:true,force:true});});
  const input={origin:ORIGIN,version:VERSION,configFile:path.join(tmp,'config.json'),credentialsFile:path.join(tmp,'access.txt')};
  const output=await createAccessFiles(input),config=JSON.parse(await fs.readFile(input.configFile,'utf8'));
  const credentials=await fs.readFile(input.credentialsFile,'utf8'),code=credentials.match(/验收口令：([^\n]+)/)[1];
  assert.equal(code.length,24);assert.match(config.accessHash,/^scrypt\$/);assert(!JSON.stringify(config).includes(code));assert(!JSON.stringify(output).includes(code));
  await assert.rejects(createAccessFiles(input),/overwrite/);assert.equal(await fs.readFile(input.credentialsFile,'utf8'),credentials);
  await assert.rejects(createAccessFiles({...input,configFile:path.resolve('review-bench/secret.json')}),/source control/);
});
