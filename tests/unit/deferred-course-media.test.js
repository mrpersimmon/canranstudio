'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {verifiedMedia,activePackageResponse,META_CACHE_NAME,ACTIVE_POINTER_PATH}=require('../../core/course-package-service-worker');
const {validateManifest}=require('../../core/course-package-installer');
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const origin='https://course.test';
function memoryCache(){const entries=new Map();return{entries,match:async key=>entries.get(typeof key==='string'?key:key.url)?.clone(),put:async(key,response)=>entries.set(typeof key==='string'?key:key.url,response.clone())};}
function fixture(){
  const bytes=Buffer.from('verified native audio recording'),entry={url:'/assets/lesson1-50/audio/l25-d01.mp3',bytes:bytes.length,sha256:digest(bytes),kind:'audio'},cache=memoryCache();
  const calls=[];const scope={crypto:crypto.webcrypto,fetch:async request=>{calls.push(request);await new Promise(resolve=>setImmediate(resolve));return new Response(bytes,{headers:{'Content-Type':'audio/mpeg'}});}};
  return{bytes,entry,cache,calls,scope,request:new Request(origin+entry.url,{headers:{Range:'bytes=0-10'}})};
}
test('concurrent native audio requests fetch one full recording and cache only verified bytes',async()=>{
  const f=fixture();const responses=await Promise.all([verifiedMedia(f.scope,f.cache,f.request,f.entry),verifiedMedia(f.scope,f.cache,f.request,f.entry)]);
  assert.equal(f.calls.length,1);assert.equal(f.calls[0].headers.get('Range'),null);
  for(const response of responses)assert.deepEqual(Buffer.from(await response.arrayBuffer()),f.bytes);
  const offline={crypto:crypto.webcrypto,fetch:()=>{throw Error('offline');}};
  const replay=await verifiedMedia(offline,f.cache,f.request,f.entry,await f.cache.match(f.request));
  assert.deepEqual(Buffer.from(await replay.arrayBuffer()),f.bytes);
});
test('a corrupt cached recording is repaired; a corrupt download is rejected without poisoning the cache',async()=>{
  const f=fixture();const repaired=await verifiedMedia(f.scope,f.cache,f.request,f.entry,new Response('broken'));
  assert.deepEqual(Buffer.from(await repaired.arrayBuffer()),f.bytes);
  const empty=memoryCache();
  await assert.rejects(verifiedMedia({...f.scope,fetch:async()=>new Response('wrong')},empty,f.request,f.entry),/integrity/);
  assert.equal(empty.entries.size,0);
  const retry=await verifiedMedia(f.scope,empty,f.request,f.entry);
  assert.deepEqual(Buffer.from(await retry.arrayBuffer()),f.bytes,'a failed request does not remain stuck in the in-flight map');
});
test('an active deferred-media release fails closed when its pinned index is absent or corrupt',async()=>{
  const f=fixture(),meta=memoryCache();
  const index=Buffer.from(JSON.stringify({entries:[f.entry]}));
  const pointer={cacheName:'active',mediaIndex:{url:'/poc/learning-path/course-package/media-index.json',bytes:index.length,sha256:digest(index)}};
  await meta.put(origin+'/'+ACTIVE_POINTER_PATH,new Response(JSON.stringify(pointer)));
  Object.assign(f.scope,{registration:{scope:origin+'/'},caches:{open:async name=>name===META_CACHE_NAME?meta:f.cache}});
  await assert.rejects(activePackageResponse(f.scope,f.request),/index is missing/);
  await f.cache.put(origin+pointer.mediaIndex.url,new Response('bad index'));
  await assert.rejects(activePackageResponse(f.scope,f.request),/index integrity/);
  assert.equal(f.calls.length,0,'an unavailable index cannot trigger unverified network fallback');
  await f.cache.put(origin+pointer.mediaIndex.url,new Response(index));
  const response=await activePackageResponse(f.scope,f.request);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),f.bytes);
  await assert.rejects(activePackageResponse(f.scope,new Request(origin+'/assets/missing.png')),/outside the active/);
});
test('a manifest cannot name an unverified media index',()=>{
  const manifest=require('../../poc/learning-path/course-package-manifest.json');
  assert.throws(()=>validateManifest({...manifest,mediaIndexUrl:'/unverified.json'},{origin,scopeUrl:origin+manifest.scopePath}),/verified startup entry/);
});
test('concurrent and warm media requests share one verified index per activation identity',async()=>{
 const f=fixture(),meta=memoryCache(),index=Buffer.from(JSON.stringify({entries:[f.entry]}));let indexHashes=0;
 const pointer={cacheName:'warm',mediaIndex:{url:'/index.json',bytes:index.length,sha256:digest(index)}};
 await meta.put(origin+'/'+ACTIVE_POINTER_PATH,new Response(JSON.stringify(pointer)));await f.cache.put(origin+'/index.json',new Response(index));
 f.scope.crypto={subtle:{digest:async(algorithm,bytes)=>{if(bytes.byteLength===index.length)indexHashes++;return crypto.webcrypto.subtle.digest(algorithm,bytes);}}};
 Object.assign(f.scope,{registration:{scope:origin+'/'},caches:{open:async name=>name===META_CACHE_NAME?meta:f.cache}});
 await Promise.all([activePackageResponse(f.scope,f.request),activePackageResponse(f.scope,f.request)]);await activePackageResponse(f.scope,f.request);
 assert.equal(indexHashes,1);
 await meta.put(origin+'/'+ACTIVE_POINTER_PATH,new Response(JSON.stringify({...pointer,cacheName:'next'})));
 await activePackageResponse(f.scope,f.request);assert.equal(indexHashes,2);
});
