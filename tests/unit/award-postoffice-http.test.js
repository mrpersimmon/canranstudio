'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {openStore}=require('../../server/store'),{createApp}=require('../../server/app'),{definition}=require('../../server/progress');
const view=require('../../core/award-collection-view'),model=require('../../award-book/model');
for(const basePath of ['/','/lesson/'])test('postoffice real HTTP retains ownership, partial cards and immutable resources at '+basePath,async()=>{
 const root=path.resolve(__dirname,'../..'),dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'canran-postoffice-http-'));
 let server;
 try{
  const store=openStore(dataDir),group=store.createClass('邮局接口测试');store.updateClass(group.id,group.name,['unit1-2']);
  const [owner,other]=store.createStudents([{name:'原收藏姓名',pinyin:'yuanshoucang'},{name:'另一位同学',pinyin:'lingyiwei'}],group.id);
  for(const student of [owner,other])store.changePassword(student.id,'Test-only-postoffice-2026!');
  for(const [course,count] of [['unit1-2',1],['unit5-6',5]]){const d=definition(root,course,basePath);store.grantAwards(owner.id,course,d.reward,d.reward.zones.slice(0,count).map(zone=>[zone.id,{runId:'fixture'}]));}
  const before=store.awards(owner.id),token=store.session('student',owner.id,Date.now()),otherToken=store.session('student',other.id,Date.now());store.close();
  server=await createApp({root,dataDir,basePath,origin:'http://127.0.0.1'});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port,headers={cookie:'canran_student='+token};
  const get=(url,options={headers})=>fetch(origin+url,options);
  assert.equal((await get(basePath+'api/awards',{headers:{}})).status,401);
  const response=await get(basePath+'api/awards');assert.equal(response.headers.get('cache-control'),'no-store');
  const data=await response.json();assert.equal(data.student.name,'原收藏姓名');assert.deepEqual(data.cards.map(c=>c.stars),[1,5]);
  assert.equal(data.cards[0].firstFullStarAt,null);assert.equal(data.cards[1].firstFullStarAt,before.find(c=>c.course==='unit5-6').firstFullStarAt);
  assert.equal(model.chapters(view.split(data.cards).primary)[0].slots[1].card,null);
  assert.equal((await get(basePath+'unit5-6/')).status,403,'closed courses remain inaccessible even though their earned card is retained');
  assert.deepEqual((await(await get(basePath+'api/awards?studentId='+owner.id,{headers:{cookie:'canran_student='+otherToken}})).json()).cards,[]);
  const html=await(await get(basePath+'awards/')).text();assert.ok(html.includes('name="award-base" content="'+basePath+'"'));
  const css=html.match(/href="([^"]+album-[^"]+\.css)"/)[1];assert.equal((await get(css)).status,200);
  const art=await get(data.cards[1].scene);assert.equal(art.status,200);assert.match(art.headers.get('cache-control'),/immutable/);assert.ok((await art.arrayBuffer()).byteLength>1000);
  const verify=openStore(dataDir);assert.deepEqual(verify.awards(owner.id),before);verify.close();
 }finally{
  if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});
  if(!path.resolve(dataDir).startsWith(path.join(os.tmpdir(),'canran-postoffice-http-')))throw Error('Unexpected test cleanup path');
  fs.rmSync(dataDir,{recursive:true,force:true});
 }
});
