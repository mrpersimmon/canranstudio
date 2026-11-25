'use strict';
// Test-only measurements. Keep resource paths and durations, never headers,
// cookies, query strings, response bodies or pupil identifiers in the report.
function kind(raw){
 let pathname;try{const u=new URL(raw);if(!['http:','https:'].includes(u.protocol))return null;pathname=u.pathname.replace(/^\/lesson\//,'/');}catch{return null;}
 const obj=pathname.match(/^\/resources\/[a-f0-9]{64}\/([^/]+)$/);
 if(obj)return {kind:'object',path:pathname,format:obj[1].split('.').pop()};
 if(/^\/api\/courses\/unit\d+-\d+\/(?:enter|permit)$/.test(pathname))return {kind:'access',path:pathname};
 if(/^\/(?:course-index\.json|course-(?:packages|status|withdrawals)\/)/.test(pathname))return {kind:'manifest',path:pathname};
 if(/^\/(?:unit\d+-\d+\/|core\/|assets\/|awards\/static\/)/.test(pathname)||/^\/(?:access-client|learning-observer|system-upgrade|viewport-metrics)\.js$/.test(pathname))return {kind:'display',path:pathname};
 return null;
}
function summarize(rows,workerAccess=[],expected={}){
 // Chromium may mark a streamed fetch "failed" after delivering its last
 // byte. Count the observed payload even for a partial response; never
 // substitute the manifest length, or count a worker replay as a download.
 const observed=rows.filter(r=>r.kind==='object'&&!r.worker&&!r.httpCache&&(r.status===200||r.status===206));
 const objects=observed.filter(r=>Object.hasOwn(expected,r.path));
 const encoded=r=>!r.encoding||r.encoding==='identity'?r.bodyBytes:r.encodedBodyBytes;
 const groups={};for(const r of objects){const g=groups[r.format]||={count:0,bodyBytes:0};g.count++;g.bodyBytes+=r.bodyBytes;}
 const measured=objects.filter(r=>Number.isFinite(r.transferred));
 return {objects:objects.length,objectBodyBytes:objects.reduce((n,r)=>n+r.bodyBytes,0),byFormat:groups,
  encodedObjectBodyBytes:objects.every(r=>Number.isFinite(encoded(r)))?objects.reduce((n,r)=>n+encoded(r),0):null,
  otherObjectBodyBytes:observed.filter(r=>!Object.hasOwn(expected,r.path)).reduce((n,r)=>n+r.bodyBytes,0),
  fullReceipts:objects.filter(r=>r.status===200&&r.bodyBytes===expected[r.path]).length,
  rangeReceipts:objects.filter(r=>{const m=/^bytes (\d+)-(\d+)\/(\d+)$/.exec(r.contentRange||'');return r.status===206&&m&&+m[3]===expected[r.path]&&+m[2]===+m[3]-1&&+m[2]- +m[1]+1===r.bodyBytes;}).length,
  objectTransferBytes:objects.length===measured.length?measured.reduce((n,r)=>n+r.transferred,0):null,
  firstObjectMs:objects.length?Math.min(...objects.map(r=>r.at)):null,lastObjectMs:objects.length?Math.max(...objects.map(r=>r.done)):null,
  workerHits:rows.filter(r=>r.hit==='hit').length,access:rows.filter(r=>r.kind==='access').map(r=>({path:r.path,at:r.at,duration:r.done-r.at})),workerAccess};
}
function attach(cdp){
 const records=new Map();
 cdp.on('Network.requestWillBeSent',e=>{const file=kind(e.request.url);if(file)records.set(e.requestId,{...file,start:e.wallTime*1000,clock:e.timestamp,bodyBytes:0});});
 cdp.on('Network.requestServedFromCache',e=>{const r=records.get(e.requestId);if(r)r.httpCache=true;});
 cdp.on('Network.responseReceived',e=>{const r=records.get(e.requestId);if(!r)return;
  const h=Object.fromEntries(Object.entries(e.response.headers).map(([k,v])=>[k.toLowerCase(),v]));
  Object.assign(r,{status:e.response.status,ttfb:Math.round((e.timestamp-r.clock)*1000),worker:!!e.response.fromServiceWorker,hit:h['x-course-cache']||null,
   protocol:e.response.protocol,encoding:h['content-encoding']||null,contentRange:h['content-range']||null,httpCache:!!(r.httpCache||e.response.fromDiskCache||e.response.fromPrefetchCache)});
 });
 cdp.on('Network.dataReceived',e=>{const r=records.get(e.requestId);if(r)r.bodyBytes+=e.dataLength;});
 const end=(e,failed)=>{const r=records.get(e.requestId);if(r)Object.assign(r,{end:r.start+(e.timestamp-r.clock)*1000,transferred:e.encodedDataLength??null,failed});};
 cdp.on('Network.loadingFinished',e=>end(e,false));cdp.on('Network.loadingFailed',e=>end(e,true));
 return async(ctx,start,duration,expected,resourceTiming=[])=>{
  const until=start+duration,rows=[...records.values()].filter(r=>r.start>=start-2&&r.start<=until&&r.end<=until+2).map(({clock,start:s,end:e,...r})=>({...r,at:Math.round(s-start),done:Math.round(e-start)}));
  for(const r of rows)if(r.kind==='object'&&r.encoding){
   const timing=resourceTiming.find(t=>t.path===r.path&&t.decoded===r.bodyBytes&&Math.abs(t.at-start-r.at)<25);
   if(timing?.encoded>0)r.encodedBodyBytes=timing.encoded;
  }
  // A worker's authorization checks do not appear as page requests. Resource
  // Timing here is a separate view, not another contribution to page bytes.
  const workers=(await Promise.all(ctx.serviceWorkers().map(w=>w.evaluate(()=>performance.getEntriesByType('resource').map(e=>({url:e.name,start:performance.timeOrigin+e.startTime,duration:e.duration,encoded:e.encodedBodySize}))).catch(()=>[])))).flat()
   .filter(e=>e.start>=start-2&&e.start<=until).map(e=>({...kind(e.url),at:Math.round(e.start-start),duration:Math.round(e.duration),encoded:e.encoded})).filter(e=>e.kind==='access'||e.kind==='object');
  const summary=summarize(rows,workers.filter(r=>r.kind==='access'),expected);
  summary.workerObjectFetches=workers.filter(r=>r.kind==='object');
  const spanning=[...records.values()].filter(r=>r.start<start-2&&r.end>=start&&r.kind==='object').map(r=>({path:r.path,at:Math.round(r.start-start),done:Math.round(r.end-start),failed:r.failed,bodyBytes:r.bodyBytes}));
  return {summary,rows,startedBeforeClick:spanning};
 };
}
module.exports={attach,kind,summarize};
