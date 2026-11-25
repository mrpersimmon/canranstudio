'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),vm=require('node:vm');
const model=require('../../review-bench/state-model');
const {loadCatalog,createReviewServer,instrumentSource}=require('../../scripts/review-bench');
const root=path.resolve(__dirname,'../..');

test('review catalog enumerates real Lessons1–6, all 106 questions, story lines and word groups',async()=>{
 const catalog=await loadCatalog(root);
 const samples=catalog.courses.slice(0,3);
 assert.deepEqual(samples.map(c=>c.id),['unit1-2','unit3-4','unit5-6']);
 assert.equal(samples.flatMap(c=>c.entries).filter(e=>e.kind==='question').length,106);
 assert.deepEqual(samples.map(c=>c.entries.filter(e=>e.kind==='story-line').length),[7,12,20]);
 for(const c of samples){assert(c.entries.some(e=>e.kind==='record'));assert(c.entries.some(e=>e.kind==='reference'));assert.equal(new Set(c.entries.map(e=>e.id)).size,c.entries.length);assert.deepEqual(c.entries.find(e=>e.kind==='card').states,['card','pending']);assert.equal(model.normalize(catalog,{unit:c.id,page:'card',state:'tasks'}).state,'card');}
 assert(catalog.devices.some(d=>d.width===375&&d.height===667));assert(catalog.devices.some(d=>d.width===430&&d.height===932));assert(catalog.devices.some(d=>d.width===440&&d.height===956));
});

test('every real question has valid isolated before/correct/wrong/corrected examples without editing its definition',async()=>{
 const catalog=await loadCatalog(root),scope={CanranCore:{}};vm.runInNewContext(await fs.readFile(path.join(root,'core/lesson49-task-inputs.js'),'utf8'),scope);
 const adapters=scope.CanranCore.lesson49TaskInputs;
 for(const {unit}of catalog.internal){for(const q of Object.values(unit.questions).flat()){
  const original=JSON.stringify(q);
  for(const mode of ['before','selected','correct','wrong','corrected']){
   const s=model.questionState(q,'review-run',mode);
   assert.equal(s.questionId,q.id);assert.equal(s.runId,'review-run');
   if(adapters.supports(q))assert(adapters.valid(q,s),q.id+' '+mode);
   else if(q.type==='order')assert.equal(s.selection,s.tokens?.map(i=>q.tokens[i]).join(' ')||null);
   else assert(s.selection===null||q.options.includes(s.selection),q.id);
   if(mode==='correct'||mode==='corrected')assert.equal(s.selection,q.answer);
   if(mode==='wrong'){assert.notEqual(s.selection,q.answer);assert(s.checked&&!s.correct);}
  }
  assert.equal(JSON.stringify(q),original);
 }}
});

test('the local bench has a GET-only allowlist, no account API, and instrumentation stays out of production source',async t=>{
 const before=await fs.readFile(path.join(root,'core/lesson49-practice.js'),'utf8');assert(!before.includes('CanranReviewRuntime'));
 const server=await createReviewServer({root,port:0});t.after(()=>new Promise(resolve=>server.close(resolve)));
 const origin='http://127.0.0.1:'+server.address().port;
 const html=await (await fetch(origin+'/')).text();assert(html.includes('页面验收台'));
 const catalog=await(await fetch(origin+'/review/catalog.json')).json();assert.equal(catalog.courses.length,72);
 for(const file of ['/.data/learning.sqlite','/.git/config','/server/store.js','/api/me','/lesson/unit145-146/'])assert.equal((await fetch(origin+file)).status,404,file);
 assert.equal((await fetch(origin+'/api/progress',{method:'POST',body:'{}'})).status,405);
 // Node fetch normalizes Host; use the raw HTTP client to exercise a foreign Host.
 const foreignStatus=await new Promise((resolve,reject)=>require('node:http').get(origin+'/',{headers:{Host:'foreign.invalid'}},res=>{res.resume();resolve(res.statusCode);}).on('error',reject));
 assert.equal(foreignStatus,403);
 const course=await fetch(origin+'/lesson/unit3-4/');assert.equal(course.status,200);assert.match(course.headers.get('content-security-policy'),/frame-ancestors 'self'/);
 assert.equal(course.headers.get('x-frame-options'),'SAMEORIGIN');
 assert.equal(await fs.readFile(path.join(root,'core/lesson49-practice.js'),'utf8'),before);
 assert.throws(()=>instrumentSource('core/lesson49-practice.js','changed renderer'),/adapter/i);
});

test('ordinary production packages do not contain any review adapter or open their framing policy',async()=>{
 const {createCoursePackages}=require('../../scripts/course-packages');
 const {generated}=await createCoursePackages({root,basePath:'/lesson/',courseIds:['unit1-2','unit3-4','unit5-6'],isolatedDefinitions:true});
 for(const [file,item]of generated){
  assert(!file.startsWith('review/'),file);
  if(item.type.includes('javascript')||item.type.includes('html'))assert(!item.body.toString().includes('CanranReviewRuntime'),file);
 }
 assert.match(generated.get('core/subpath-worker.js').body.toString().split('\n')[0],/frame-ancestors 'none'/);
});

test('catalog requests share a build until invalidation; force refresh works without moving the page',async t=>{
 let invalidate;
 const server=await createReviewServer({root,port:0,watchInputs:(_root,changed)=>{invalidate=changed;return {close(){}};}});
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const url='http://127.0.0.1:'+server.address().port+'/review/catalog.json';
 async function revision(suffix=''){const res=await fetch(url+suffix);assert.equal(res.status,200);await res.arrayBuffer();return res.headers.get('x-review-build');}
 const initial=await revision();assert.ok(initial);assert.equal(await revision(),initial);
 invalidate();const [a,b]=await Promise.all([revision(),revision()]);assert.notEqual(a,initial);assert.equal(a,b);
 assert.notEqual(await revision('?refresh=1'),a);
});

test('the source watcher sees a saved course file without watching the output directory',async t=>{
 const {watchSources}=require('../../scripts/review-bench'),os=require('node:os'),dir=await fs.mkdtemp(path.join(os.tmpdir(),'canran-bench-watch-'));
 t.after(()=>fs.rm(dir,{recursive:true,force:true}));
 for(const name of [...require('../../server/catalog').UNITS,'core','assets','review-bench','tests/support','docs/designs/word-cards','output'])await fs.mkdir(path.join(dir,name),{recursive:true});
 let changed=0,notify;const signalled=new Promise(resolve=>notify=resolve);
 const watcher=watchSources(dir,()=>{changed++;notify();});t.after(()=>watcher.close());
 assert.equal(watcher.reliable(),true);await fs.writeFile(path.join(dir,'output','result.json'),'{}');
 await new Promise(resolve=>setTimeout(resolve,80));assert.equal(changed,0);
 await fs.writeFile(path.join(dir,'unit1-2','content.js'),'// saved');
 let timer;try{await Promise.race([signalled,new Promise((_,reject)=>timer=setTimeout(()=>reject(Error('did not see course edit')),3000))]);}finally{clearTimeout(timer);}
 assert.ok(changed>0);
});

test('ordinary whitespace edits do not invalidate the award preview adapter',async()=>{
 const source=await fs.readFile(path.join(root,'core/unit-awards.js'),'utf8');
 const reformatted=source.replaceAll('save();','save();  ').replaceAll(' = root.CanranStudentAccess','  =  root.CanranStudentAccess');
 const adapted=instrumentSource('core/unit-awards.js',reformatted);new vm.Script(adapted);assert.match(adapted,/registerAwards/);
});
