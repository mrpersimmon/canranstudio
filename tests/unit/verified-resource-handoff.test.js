'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),{webcrypto,createHash,randomUUID}=require('node:crypto');
const source=fs.readFileSync(require.resolve('../../core/course-cache'),'utf8'),sha=b=>createHash('sha256').update(b).digest('hex'),step=256*1024;
const latch=()=>{let resolve;return {promise:new Promise(r=>resolve=r),resolve};};
function diskStore(){const rows=new Map();return {rows,async match(k){return rows.get(k)?.clone();},async put(k,r){rows.set(k,r.clone());},async delete(k){return rows.delete(k);}};}
function page(base,disk,fetch){
 const self={location:{origin:'https://course.test'},navigator:{locks:navigator.locks}};
 vm.runInNewContext(source,{self,URL,Response,TextEncoder,btoa,Uint8Array,crypto:webcrypto,AbortController,DOMException,Date,setTimeout,clearTimeout,fetch,
  caches:{open:async()=>disk},indexedDB:{open(){const r={result:{}};queueMicrotask(()=>r.onsuccess());return r;}}});
 return self.CanranCourseCache.open(base);
}
for(const mode of ['valid','ignored','wrong-range','wrong-type','damaged-prefix','expired','denied','checkpoint-quota'])test('font navigation reuses only a verified whole font: '+mode,async()=>{
 const base='/font-'+randomUUID()+'/',disk=diskStore(),data=Buffer.alloc(2*1024*1024+37);
 for(let i=0;i<data.length;i++)data[i]=(i*31+i%37)&255;
 const hash=sha(data),item={key:base+'assets/awards/fonts/award-gothic-500.woff2',url:base+'resources/'+hash+'/award-gothic-500.woff2',sha256:hash,bytes:data.length,type:'font/woff2'};
 const gate=latch(),stop=new AbortController(),completeKey=base+'resources/'+hash;
 if(mode==='checkpoint-quota'){const put=disk.put.bind(disk);disk.put=async(k,r)=>{if(k!==completeKey)throw Error('quota');return put(k,r);};}
 const first=page(base,disk,async(url,{signal})=>{
  let n=0;const body=new ReadableStream({start(controller){signal.addEventListener('abort',()=>controller.error(new DOMException('cancel','AbortError')),{once:true});},
   pull(c){if(n++===0){c.enqueue(data.subarray(0,2*step+37));}else if(n===2){c.enqueue(Uint8Array.of(3));}else{gate.resolve();return new Promise(()=>{});}}
  });return new Response(body,{headers:{'Content-Type':'font/woff2'}});
 });
 const pending=first.obtain(item,{signal:stop.signal,checkpointFonts:true});await gate.promise;stop.abort();await assert.rejects(pending);assert.ok(!disk.rows.has(completeKey),'partial must not be a cache hit');
 const partKey=[...disk.rows.keys()][0];if(mode==='damaged-prefix'&&partKey){const prior=disk.rows.get(partKey),b=Buffer.from(await prior.arrayBuffer());b[200]^=1;disk.rows.set(partKey,new Response(b,{headers:prior.headers}));}
 if(mode==='expired'&&partKey){const prior=disk.rows.get(partKey),headers=new Headers(prior.headers);headers.set('X-Font-Until','1');disk.rows.set(partKey,new Response(await prior.arrayBuffer(),{headers}));}
 const calls=[],second=page(base,disk,async(url,options)=>{
  const range=new Headers(options.headers).get('range');calls.push(range);
  const start=Number(range?.match(/^bytes=(\d+)-$/)?.[1]||0);
  if(mode==='denied')return new Response('',{status:403});
  if(!range||mode==='ignored')return new Response(data,{headers:{'Content-Type':'font/woff2'}});
  return new Response(data.subarray(start),{status:206,headers:{'Content-Type':mode==='wrong-type'?'text/plain':'font/woff2','Content-Range':'bytes '+(mode==='wrong-range'?start+1:start)+'-'+(data.length-1)+'/'+data.length}});
 });
 if(mode==='denied'){await assert.rejects(second.obtain(item));assert.ok(!disk.rows.has(completeKey));return;}
 const restored=await second.obtain(item);assert.equal(sha(Buffer.from(restored)),hash);
 assert.equal(calls[0],['checkpoint-quota','expired'].includes(mode)?null:'bytes='+2*step+'-');
 if(['wrong-range','wrong-type','damaged-prefix'].includes(mode))assert.deepEqual(calls,['bytes='+2*step+'-',null]);
 else assert.equal(calls.length,1);
 assert.deepEqual([...disk.rows.keys()],[completeKey]);assert.equal(sha(Buffer.from(await (await disk.match(completeKey)).arrayBuffer())),hash);
});

test('a damaged shared layer is never used and later views fall back without downloading it again',async()=>{
 const base='/art-bad-'+randomUUID()+'/',png=Buffer.from('private approved layer'),part={type:'image/png',bytes:png.length,sha256:sha(png)};part.url=base+'resources/'+part.sha256+'/shared-art.png';
 const disk=diskStore(),calls=[],files=new Map(),store=page(base,disk,async url=>{calls.push(url);return new Response(url===part.url?Buffer.alloc(png.length):files.get(url),{headers:{'Content-Type':url===part.url?'image/png':'image/svg+xml'}});});
 for(const name of ['cover','result']){
  const start='<svg id="'+name+'"><image href="data:image/png;base64,',end='"/></svg>',data=Buffer.from(start+png.toString('base64')+end),h=sha(data),url=base+'resources/'+h+'/'+name+'.svg';files.set(url,data);
  const obtained=await store.obtain({url,key:base+name+'.svg',type:'image/svg+xml',sha256:h,bytes:data.length,svgParts:[start,part,end]});
  assert.deepEqual(Buffer.from(obtained),data);
 }
 assert.equal(calls.filter(p=>p===part.url).length,3);assert.ok(!disk.rows.has(base+'resources/'+part.sha256));assert.equal(calls.filter(p=>p!==part.url).length,2);
});
test('two SVGs fetch one shared picture, and an invalid recipe falls back to the original verified SVG',async()=>{
 const base='/art-'+randomUUID()+'/',png=Buffer.alloc(256,72),part={type:'image/png',bytes:png.length,sha256:sha(png)};part.url=base+'resources/'+part.sha256+'/shared-art.png';
 const payload=new Map([[part.url,png]]),calls=[],disk=diskStore(),store=page(base,disk,async(u)=>{calls.push(u);return new Response(payload.get(u),{headers:{'Content-Type':u===part.url?'image/png':'image/svg+xml'}});});
 const items=['first','second','fallback'].map((id,i)=>{const prefix='<svg id="'+id+'"><image href="data:image/png;base64,',suffix='"/></svg>',body=Buffer.from(prefix+png.toString('base64')+suffix),h=sha(body),url=base+'resources/'+h+'/'+id+'.svg';payload.set(url,body);return {key:base+id+'.svg',url,sha256:h,bytes:body.length,type:'image/svg+xml',svgParts:[prefix,part,i===2?'wrong':suffix]};});
 await Promise.all(items.slice(0,2).map(i=>store.obtain(i)));assert.deepEqual(calls,[part.url]);
 const f=await store.obtain(items[2]);assert.equal(sha(Buffer.from(f)),items[2].sha256);assert.deepEqual(calls,[part.url,items[2].url]);
});
