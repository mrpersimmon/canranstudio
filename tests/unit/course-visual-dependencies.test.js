'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {createCoursePackages}=require('../../scripts/course-packages'),{UNITS}=require('../../server/catalog');
const {definition}=require('../../server/progress');
const root=path.resolve(__dirname,'../..');
const worlds=['learning-sample-v1/street-world-v1','unit3-4-journey/cloakroom-interior-v1','learning-sample-v1/classroom-world-v1','learning-sample-v1/interview-world-v1','learning-sample-v1/greeting-world-v1','learning-sample-v1/claim-world-v1','learning-sample-v2/dressing-world-v1','learning-sample-v2/customs-world-v1','learning-sample-v2/office-world-v1','learning-sample-v2/park-world-v1','learning-sample-v2/reading-world-v1','learning-sample-v2/shelf-world-v1'].map(s=>'assets/'+s+'.webp');
for(const basePath of ['/','/lesson/'])test('each course prepares its own backgrounds and actual shared illustrations at '+basePath,async()=>{
 const pack=await createCoursePackages({root,basePath,courseIds:UNITS,isolatedDefinitions:true});
 for(const [n,id]of UNITS.entries()){
  const descriptor=pack.index.courses[id],manifest=JSON.parse(pack.generated.get(descriptor.manifest.slice(basePath.length)).body),keys=new Set(manifest.required.map(i=>i.key.slice(basePath.length)));
  // An explicitly borrowed world is valid: e.g. 57–58 uses two settings.
  const sources=fs.readdirSync(path.join(root,id)).filter(f=>/\.(?:js|html|css)$/.test(f)).map(f=>fs.readFileSync(path.join(root,id,f),'utf8')).join('\n');
  const wanted=worlds.filter((w,i)=>i===n||sources.includes('/'+w));
  assert.deepEqual(worlds.filter(w=>keys.has(w)),wanted,id+' scenery');
  if(id==='unit1-2')assert.ok(keys.has('assets/unit3-4-journey/coat-v1.webp'),'the coat is a borrowed word illustration');
 }
});
test('cross-course paths composed in teaching data retain exactly the resolved borrowed files',async()=>{
 const basePath='/lesson/',pack=await createCoursePackages({root,basePath,courseIds:['unit3-4','unit49-50'],isolatedDefinitions:true});
 for(const [id,other] of [['unit3-4','unit1-2'],['unit49-50','unit47-48']]){
  const prefix=basePath+'assets/'+other+'/',unit=definition(root,id,basePath),used=new Set();
  const visit=x=>{if(typeof x==='string'&&x.startsWith(prefix))used.add(x);else if(x&&typeof x==='object')Object.values(x).forEach(visit);};visit(unit);
  const d=pack.index.courses[id],m=JSON.parse(pack.generated.get(d.manifest.slice(basePath.length)).body),entries=m.required.filter(i=>i.key.startsWith(prefix));
  for(const url of used)assert.ok(entries.some(i=>i.key===url),id+' preserves '+url);
  if(id==='unit49-50')assert.deepEqual(entries.map(i=>i.key).sort(),[...used].sort());
 }
});

test('runtime functions cannot be treated as a closed list of borrowed filenames',async()=>{
 const pack=await createCoursePackages({root,basePath:'/',courseIds:['unit49-50'],isolatedDefinitions:true,readSource:async file=>{
  const src=await fs.promises.readFile(path.join(root,file));return file==='unit49-50/content.js'?Buffer.concat([src,Buffer.from("\nglobalThis.CanranCore.unit4950.lookupFruit=name=>'/assets/unit47-48/'+name+'.svg';")]):src;
 }});
 const d=pack.index.courses['unit49-50'],m=JSON.parse(pack.generated.get(d.manifest.slice(1)).body);
 assert.ok(m.required.some(r=>r.key==='/assets/unit47-48/cover-scene.svg'));
});

test('the existing private retention window keeps an old manifest and the exact removed background bytes',async t=>{
 const os=require('node:os'),{retainPackages}=require('../../server/bundles');
 const dir=await fs.promises.mkdtemp(path.join(os.tmpdir(),'canran-scenery-history-'));t.after(()=>fs.promises.rm(dir,{recursive:true,force:true}));
 const rootOptions={root,basePath:'/',courseIds:['unit1-2'],isolatedDefinitions:true},foreign=worlds[9];
 const before=await createCoursePackages({...rootOptions,readSource:async file=>{
  const src=await fs.promises.readFile(path.join(root,file));return file==='core/learning-sample.css'?Buffer.concat([src,Buffer.from("\nbody.unit1920-workspace{--sample-world:url('/"+foreign+"')}")]):src;
 }});
 const prior=before.index.courses['unit1-2'],priorBytes=before.generated.get(prior.manifest.slice(1)).body;
 const item=JSON.parse(priorBytes).required.find(i=>i.key==='/'+foreign);assert.ok(item);
 await retainPackages(before,dir,'/');
 const next=await createCoursePackages(rootOptions);assert.notEqual(next.index.courses['unit1-2'].revision,prior.revision);
 assert.ok(!next.generated.has(item.url.slice(1)));const retained=await retainPackages(next,dir,'/');
 assert.ok(retained.some(p=>p.id==='unit1-2'&&p.revision===prior.revision&&p.accessPolicy==='class-v1'));
 assert.deepEqual(next.generated.get(prior.manifest.slice(1)).body,priorBytes);
 assert.deepEqual(next.generated.get(item.url.slice(1)).body,before.generated.get(item.url.slice(1)).body);
});
