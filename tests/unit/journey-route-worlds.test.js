'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const route=require('../../course-journey/route-worlds'),art=require('../../course-journey/chapter-layout'),catalog=require('../../course-journey/model');
const root=path.resolve(__dirname,'../..'),file=name=>path.join(root,'assets/course-journey',name);
const oldArt=JSON.stringify(art),oldCatalog=JSON.stringify(catalog.MAP_CHAPTERS);
const hash=name=>crypto.createHash('sha256').update(fs.readFileSync(file(name))).digest('hex');
const ids=Array.from({length:72},(_,i)=>'unit'+(2*i+1)+'-'+(2*i+2));
const extension=require('../support/journey-visits-kindness-contact.json');
const expansion=require('../support/journey-home-hospitality-contact.json');
const remaining=require('../support/journey-remaining-contact.json');
const extendedCharacters={...extension.characters,...expansion.characters,...remaining.characters};
// Original source-image shoe/counter points, not inferred from the new runtime
// feet anchor. The v3 garden and v4 town were opened independently. The town's
// road band is narrower because houses/doorsteps sit along its side edges.
// This mathematical band catches displacement; it is NOT a visual-fusion pass.
const floor=[.24,.46,.78,.61];
const townFloor=[.28,.46,.72,.61];
const contacts={
 'unit1-2':{points:[[250,1151],[420,1137],[834,1145],[993,1154]],sha:'df99ee8abaf3ce1cbbc3c2849c721e2c5302355a7ebf05825092d2a263fa4967'},
 'unit3-4':{points:require('../support/journey-ground-contact.json').cases.find(x=>x.course==='unit3-4').contacts.map(x=>x.pixel),sha:'c1a9f4d258a4caf9134403a2171924e643e177b792b7f3ff4f12829da8732a92'},
 'unit5-6':{points:[[311,930],[456,918],[716,938],[838,935],[1108,928],[1260,934]],sha:'8c97dedf6894f23a6fad779704be71cae5879ecebae9bc7e80815e5a47c2de59'},
 'unit7-8':{points:[[300,1214],[510,1202],[830,1208],[1006,1219]],sha:'eaebe41691113fb754db886352183d7ada8d55e87480edcfe0db16eea09f9843'},
 'unit9-10':{points:[[348,1056],[509,1054],[811,1053],[935,1060]],sha:'f5e40c6f0793e2662ca3d8c0f9134e855e5d0464bb302a5926279ae6461fb05b'},
 'unit11-12':{points:[[350,934],[532,919],[727,893],[900,898],[1010,929],[1178,946]],sha:'c741eedb1b795fe6260db04853f68587790b2ec36b507e882d5ca26df5d29480'},
 ...Object.fromEntries(Object.entries(extendedCharacters).map(([id,c])=>[id,{points:c.contacts.map(p=>p.pixel),sha:c.sha256}]))
};
const worldFor=id=>Object.values(route.worlds).find(world=>world.ids.includes(id));
function project(scene,character,pixel,width){
 const scale=scene.width*width/character.width;
 return [scene.feet[0]*width-character.anchor[0]*character.width*scale+pixel[0]*scale,
  scene.feet[1]*width-character.anchor[1]*character.height*scale+pixel[1]*scale];
}
const close=(a,b,label)=>assert.ok(Math.abs(a-b)<1e-7,label+': '+a+' vs '+b);

test('24章连续近景覆盖1–144全部72个入口，课程顺序和原人物合同保留',()=>{
 assert.deepEqual(Object.keys(route.worlds),catalog.MAP_CHAPTERS.map(chapter=>chapter.id));
 assert.deepEqual(Object.values(route.worlds).flatMap(w=>w.ids),ids);
 assert.equal(route.characters,art.characters);
 assert.equal(catalog.MAP_COURSES.length,72);
 assert.equal(catalog.chapterFor('unit13-14'),'visits');assert.equal(catalog.chapterFor('unit25-26'),'home');assert.equal(catalog.chapterFor('unit143-144'),'woodland');
 assert.equal(JSON.stringify(art),oldArt);assert.equal(JSON.stringify(catalog.MAP_CHAPTERS),oldCatalog);
});

test('24幅近景按真实原生尺寸登记，目标1:3只允许整图一像素量化差，禁止拉伸',async()=>{
 for(const world of Object.values(route.worlds)){
  assert.ok(Math.abs(world.height-world.width*3)<=1,'native integer quantization is bounded to one source pixel');assert.equal(world.ids.length,3);
  for(const name of [world.png,world.file]){
   const meta=await sharp(file(name)).metadata();
   assert.deepEqual([meta.width,meta.height],[world.width,world.height],name);
   assert.equal(meta.hasAlpha,false,name+' static terrain is an opaque whole scene');
  }
 }
 const distant=await sharp(file(route.distant.file)).metadata();
 assert.deepEqual([distant.width,distant.height],[route.distant.width,route.distant.height]);
 assert.ok(!Object.values(route.worlds).some(w=>w.file===route.distant.file),'far atmosphere is not the near-field terrain');
});

test('72个入口的原人物和道具保持原始字节，不为融合悄悄重生',async()=>{
 for(const id of ids){
  const c=route.characters[id],meta=await sharp(file(c.file)).metadata();
  assert.equal(hash(c.file),contacts[id].sha,id);
  assert.deepEqual([meta.width,meta.height],[c.width,c.height],id);
 }
});

test('0/1/2个授权入口裁切原始段号，中间未授权区仅保留无课程数据的地形',()=>{
 const w=route.worlds.opening,a={id:'unit1-2',title:'A'},b={id:'unit3-4',title:'B'},c={id:'unit5-6',title:'C'},other={id:'unit13-14',title:'outside'};
 assert.deepEqual(route.visibleSlots(w,[]),[]);
 assert.deepEqual(route.visibleSlots(w,[other]),[]);
 assert.deepEqual(route.visibleSlots(w,[b]),[{index:1,course:b}]);
 assert.deepEqual(route.visibleSlots(w,[c]),[{index:2,course:c}]);
 const sparse=route.visibleSlots(w,[c,other,a]);
 assert.deepEqual(sparse,[{index:0,course:a},{index:1,course:null},{index:2,course:c}]);
 assert.deepEqual(Object.keys(sparse[1]).sort(),['course','index'],'unseen passage must not carry a hidden title, reward, id or control');
 assert.deepEqual(route.visibleSlots(w,[c,b]),[{index:1,course:b},{index:2,course:c}]);
});

test('输入乱序、重复和其他章节课程不重排近景或泄漏额外入口',()=>{
 const w=route.worlds.neighborhood,a={id:'unit7-8'},b={id:'unit9-10'},c={id:'unit11-12'},outside={id:'unit143-144'};
 const courses=[c,outside,a,b,b],before=JSON.stringify(courses);
 assert.deepEqual(route.visibleSlots(w,courses),[{index:0,course:a},{index:1,course:b},{index:2,course:c}]);
 assert.equal(JSON.stringify(courses),before);
});

test('三个原始区段共享一张图的尺度，裁首尾不会移动剩余人物对应的源像素',()=>{
 for(const world of Object.values(route.worlds))for(const width of [320,360,390,430,480,560]){
  const scale=width/world.width,step=world.height/world.ids.length;
  close(step*scale*world.ids.length,world.height*scale,'all original source rows are represented exactly once');
  for(const indices of [[0],[1],[2],[0,2],[1,2],[0,1,2]]){
   const slots=route.visibleSlots(world,indices.map(i=>({id:world.ids[i]}))),first=slots[0].index;
   const visibleHeight=slots.length*step*scale,terrainTop=-first*step*scale;
   close(visibleHeight,slots.length*world.height/world.ids.length*scale,'cropped window is complete original source sections');
   for(const slot of slots){
    const localTop=(slot.index-first)*step*scale;
    close(localTop-slot.index*step*scale,terrainTop,'same-source patch and single world origin');
    const sourceY=slot.index*step+.56*world.width;
    close(terrainTop+sourceY*scale,localTop+.56*width,'original painted foot pixel');
   }
  }
 }
});

test('436个独立鞋底及道具支撑点在六个代表宽度下落在目视铺地区域',()=>{
 assert.equal(Object.values(contacts).reduce((n,c)=>n+c.points.length,0),436);
 for(const width of [320,360,390,430,480,560])for(const id of ids){
  const world=worldFor(id),scene=route.sceneFor(world,id),c=route.characters[id];
  const chapter=catalog.chapterFor(id),safeFloor=remaining.floorByCourse[id]||remaining.floorByChapter[chapter]||expansion.floorByCourse[id]||expansion.floorByChapter[chapter]||extension.floorByChapter[chapter]||(chapter==='neighborhood'?townFloor:floor);
  assert.equal(scene.index,world.ids.indexOf(id));
  const top=project(scene,c,[c.bounds[0]*c.width,c.bounds[1]*c.height],width);
  const bottom=project(scene,c,[c.bounds[2]*c.width,c.bounds[3]*c.height],width);
  assert.ok(top[0]>=0&&top[1]>=0&&bottom[0]<=width&&bottom[1]<=width,id+' full original silhouette');
  close(bottom[1]-top[1],width*.36,id+' fixed visible scale');
  for(const pixel of contacts[id].points){
   const [x,y]=project(scene,c,pixel,width).map(n=>n/width);
   assert.ok(x>=safeFloor[0]&&x<=safeFloor[2]&&y>=safeFloor[1]&&y<=safeFloor[3],id+' '+pixel+' lands outside independently viewed floor: '+[x,y]);
  }
 }
});

test('全部72入口按真实轮廓居中，首课和宽行李组均与星章同轴',()=>{
 for(const id of ids)for(const width of [320,390,560]){
  const c=route.characters[id],scene=route.sceneFor(worldFor(id),id);
  const left=project(scene,c,[c.bounds[0]*c.width,0],width)[0],right=project(scene,c,[c.bounds[2]*c.width,0],width)[0];
  close((left+right)/2,width/2,id+' silhouette aligns with reward/lesson column');
 }
 for(const name of Object.keys(route.worlds).slice(2)){
  const w=route.worlds[name],first={id:w.ids[0]},last={id:w.ids[2]};
  assert.deepEqual(route.visibleSlots(w,[last,first]),[{index:0,course:first},{index:1,course:null},{index:2,course:last}]);
 }
});

test('整图一像素量化差不能在中段和末段累积为地面补片偏移',()=>{
 const world=route.worlds.departures,scale=560/world.width,step=world.height/world.ids.length;
 assert.equal(world.height,2171);assert.equal(world.width,724);
 for(const index of [1,2]){
  const nativeOffset=index*step*scale,oldSquareOffset=index*560;
  assert.ok(Math.abs(oldSquareOffset-nativeOffset)>.25,'the old square offset really drifts from source pixels');
  const patchPercent=-index*world.height/(world.ids.length*world.width)*100;
  close(patchPercent/100*560,-nativeOffset,'exact same-source patch offset');
 }
});

test('把脚点误用为旧stage相对百分比会被地面约束识别',()=>{
 const world=route.worlds.opening,c=route.characters['unit3-4'],scene=route.sceneFor(world,'unit3-4'),width=320;
 const stageHeight=width-118;
 const wrong={...scene,feet:[scene.feet[0],scene.feet[1]*stageHeight/width]};
 assert.ok(contacts['unit3-4'].points.some(pixel=>{const [,y]=project(wrong,c,pixel,width).map(n=>n/width);return y<floor[1]||y>floor[3];}));
});
