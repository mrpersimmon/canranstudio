'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {createApp}=require('../../server/app');
const modules=require('../../course-journey/module-scenes');
const worlds=require('../../course-journey/route-worlds');
test('当前24章近景和远景真实可取，历史场景URL兼容，原稿不公开',async()=>{
  const root=path.resolve(__dirname,'../..'),parent=path.join(root,'.data');
  await fs.mkdir(parent,{recursive:true});
  const dataDir=await fs.mkdtemp(path.join(parent,'module-assets-test-'));
  let server;
  try{
    server=await createApp({root,dataDir,basePath:'/lesson/',origin:'http://127.0.0.1'});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const origin='http://127.0.0.1:'+server.address().port+'/lesson/';
    const current=[...Object.values(worlds.worlds).map(world=>world.file),worlds.distant.file];
    const legacy=[modules.ambient.file,modules.ambientDesktop.file,modules.connector.file,...Object.values(modules.scenes).map(s=>s.ground.file)];
    assert.equal(new Set(current).size,25,'24张权威近景共用一张远景');
    assert.equal(new Set(legacy).size,9,'旧URL兼容不代表当前仍渲染独立平台和桥');
    assert.deepEqual(new Set(worlds.legacyAssets.map(item=>item.file)),new Set(['modules-v3/neighborhood-world-v1.webp','modules-v3/opening-world-v1.webp','modules-v5/kindness-courtyard-v1.webp','modules-v6/making-workshop-v2.webp','modules-v7/everyday-evening-v2.webp','modules-v7/caring-veranda-v2.webp','modules-v7/memories-arcade-v1.webp']),'此前采用URL保持兼容，未采用草稿不公开');
    const files=[...current,...legacy,...worlds.legacyAssets.map(item=>item.file)];
    for(const file of ['modules-v8/unknown.webp','modules-v8/opening-mobile-clearance-v1.webp','production/modules-v8/requests.json']){
      const response=await fetch(origin+'assets/course-journey/'+file);
      assert.notEqual(response.status,200,file+' 未采用稿或私有凭据不能公开');await response.arrayBuffer();
    }
    for(const file of files){
      const response=await fetch(origin+'assets/course-journey/'+file+'?retry=1');
      assert.equal(response.status,200,file);
      assert.match(response.headers.get('content-type'),/image\/webp/);
      const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
      assert.equal(digest(Buffer.from(await response.arrayBuffer())),digest(await fs.readFile(path.join(root,'assets/course-journey',file))),file+' 返回真实图片');
    }
    for(const file of ['modules-v7/unknown.webp','modules-v7/woodland-station-v1.webp','modules-v7/departures-promenade-v1.webp','production/modules-v7/requests.json',...Object.values(worlds.worlds).map(world=>world.png),'modules-v6/making-workshop-v1.webp','modules-v6/unknown.webp','production/modules-v6/requests.json','modules-v5/unknown.webp','production/modules-v5/requests.json','modules-v4/unknown.webp','production/modules-v4/requests.json','modules-v3/neighborhood-world-v1.png','modules-v3/distant-garden-v1.png','modules-v3/unknown.webp','production/modules-v3/opening-request.json','modules-v1/unit1-2-ground.png','modules-v2/unit1-2-ground.png','modules-v2/stone-link-v2.png','modules-v2/garden-route-v2.png','modules-v2/garden-route-desktop-v2.png','modules-v2/unknown.webp','production/modules-v2/unit9-12-receipts.json']){
      const response=await fetch(origin+'assets/course-journey/'+file);
      assert.notEqual(response.status,200,file+' 不属于登记的网页资产');
      await response.arrayBuffer();
    }
  }finally{
    if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
    assert.equal(path.dirname(path.resolve(dataDir)),parent);
    assert.ok(path.basename(dataDir).startsWith('module-assets-test-'));
    await fs.rm(dataDir,{recursive:true,force:true});
  }
});
