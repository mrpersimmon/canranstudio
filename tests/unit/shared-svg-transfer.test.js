'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {createCoursePackages}=require('../../scripts/course-packages');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const basePath of ['/','/lesson/'])test('shared artwork transfers reproduce the exact original SVG bytes at '+basePath,async()=>{
 const pack=await createCoursePackages({root:process.cwd(),basePath,courseIds:['unit45-46','unit47-48','unit49-50'],isolatedDefinitions:true});
 for(const [id,count,minSaving] of [['unit45-46',3,5000000],['unit47-48',1,1300000],['unit49-50',0,0]]){
  const d=pack.index.courses[id],m=JSON.parse(pack.generated.get(d.manifest.slice(basePath.length)).body),original=new Map(),wire=new Map();
  const layers=new Set();let inlineBytes=0;
  for(const f of m.required){original.set(f.sha256,f.bytes);
   if(!f.svgParts){wire.set(f.sha256,f.bytes);continue;}
   const body=pack.generated.get(f.url.slice(basePath.length)).body;
   const joined=f.svgParts.map(part=>{if(typeof part==='string'){inlineBytes+=Buffer.byteLength(part);return part;}
    const data=pack.generated.get(part.url.slice(basePath.length)).body;assert.equal(data.length,part.bytes);assert.equal(sha(data),part.sha256);wire.set(part.sha256,part.bytes);layers.add(part.sha256);return data.toString('base64');
   }).join('');assert.deepEqual(Buffer.from(joined),body,f.key);assert.equal(sha(Buffer.from(joined)),f.sha256);
  }
  assert.equal(layers.size,count,id);const sum=map=>[...map.values()].reduce((a,b)=>a+b,0);
  assert.ok(sum(original)-sum(wire)-inlineBytes>=minSaving,id);
 }
});

test('shared raster URLs require the owning course, retain the original sheet URLs, and survive a previous release',async t=>{
 const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),{createApp}=require('../../server/app'),{openStore}=require('../../server/store'),{retainPackages}=require('../../server/bundles');
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'canran-art-owners-')),root=process.cwd(),basePath='/',ids=['unit1-2','unit45-46','unit47-48'];
 let store,server;t.after(async()=>{if(server)await new Promise(r=>server.close(r));store?.close();await fs.rm(dir,{recursive:true,force:true});});
 store=openStore(dir);const cookies={};
 for(const id of ids){const g=store.createClass(id);store.updateClass(g.id,id,[id]);const [s]=store.createStudents([{name:'试读',pinyin:'shidu'}],g.id);store.changePassword(s.id,'Only-for-this-test-2026!');
  cookies[id]='canran_student='+store.session('student',s.id,Date.now());}
 const pack=await createCoursePackages({root,basePath,courseIds:ids,isolatedDefinitions:true});
 const manifest=(p,id)=>JSON.parse(p.generated.get(p.index.courses[id].manifest.slice(1)).body);
 const m=manifest(pack,'unit45-46'),original=m.required.find(i=>i.svgParts),layer=original.svgParts.find(v=>typeof v!=='string');
 await retainPackages(pack,dir,basePath);
 const small=await createCoursePackages({root,basePath,courseIds:['unit1-2'],isolatedDefinitions:true});
 const history=await retainPackages(small,dir,basePath);assert.ok(history.some(p=>p.revision===m.revision));assert.equal(sha(small.generated.get(layer.url.slice(1)).body),layer.sha256);
 // The account server serves the complete catalog. Simulate a later artwork
 // edition so this specific old layer is reachable only through retention.
 const next=await createCoursePackages({root,basePath,courseIds:require('../../server/catalog').UNITS,isolatedDefinitions:true,readSource:async file=>{
  const src=await fs.readFile(path.join(root,file));return /^assets\/unit45-46\/.+\.svg$/.test(file)?Buffer.from(src.toString().replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g,'data:image/png;base64,iVBORw0KGgo=')):src;
 }});
 assert.ok(!next.generated.has(layer.url.slice(1)));server=await createApp({root,dataDir:dir,basePath,bundle:next,origin:'http://127.0.0.1'});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 for(const item of [layer,original])for(const [user,wanted]of [[null,401],['unit1-2',403],['unit45-46',200]]){
  const res=await fetch('http://127.0.0.1:'+server.address().port+item.url,{headers:user?{Cookie:cookies[user]}:{}});
  assert.equal(res.status,wanted);const bytes=Buffer.from(await res.arrayBuffer());if(wanted===200)assert.equal(sha(bytes),item.sha256);
 }
 const font=manifest(next,'unit1-2').required.find(i=>i.key.endsWith('/fonts/award-gothic-500.woff2')),url='http://127.0.0.1:'+server.address().port+font.url;
 const denied=await fetch(url,{headers:{Range:'bytes=524288-'}});assert.equal(denied.status,401);await denied.arrayBuffer();
 const suffix=await fetch(url,{headers:{Cookie:cookies['unit1-2'],Range:'bytes=524288-'}});
 assert.equal(suffix.status,206);assert.equal(suffix.headers.get('Content-Range'),'bytes 524288-'+(font.bytes-1)+'/'+font.bytes);
 assert.equal(sha(Buffer.concat([next.generated.get(font.url.slice(1)).body.subarray(0,524288),Buffer.from(await suffix.arrayBuffer())])),font.sha256);
});
