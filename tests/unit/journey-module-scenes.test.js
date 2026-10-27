'use strict';
// Historical modules-v2 asset/placement reference, retained for traceability.
// This file does not validate the current J32 continuous-world renderer;
// current geometry lives in journey-route-worlds.test.js and browser helpers.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const root=path.resolve(__dirname,'../..');
const filename=path.join(root,'course-journey/module-scenes.js');
const art=require('../../course-journey/chapter-layout'),catalog=require('../../course-journey/model');
const originalArt=JSON.stringify(art),originalCatalog=JSON.stringify(catalog.MAP_CHAPTERS);
const ids=['unit1-2','unit3-4','unit5-6','unit7-8','unit9-10','unit11-12'];
function modules(){assert.ok(fs.existsSync(filename),'缺少 Lesson 1–12 独立场景模块');return require(filename);}
const file=(name)=>path.join(root,'assets/course-journey',name);
const hash=(name)=>crypto.createHash('sha256').update(fs.readFileSync(file(name))).digest('hex');
// 已逐张目视 modules-v2 六张开放庭院 PNG；以下矩形范围用于发现明显错位，
// 不取运行模型中的 floor 作为期望，也不等同于逐像素识别倾斜铺地/前沿石栏。
// 目视发现 1–2、3–4、7–8 接近新前沿后，运行模型将脚锚点向庭院内收；
// 本测试继续使用原鞋底/柜台像素，确认内收后仍在本课地面。真实页面合成另行验收。
// 接地点来自原人物图的可见鞋底/柜台角，允许人工读取约5原图像素误差。
// 3–4沿用既有原图接地点，地面则独立使用本次新平台范围；不沿用旧大地图的铺地坐标。
const fixtures={
 'unit1-2':{floor:[.23,.57,.77,.74],points:[[250,1151],[420,1137],[834,1145],[993,1154]],sha:'df99ee8abaf3ce1cbbc3c2849c721e2c5302355a7ebf05825092d2a263fa4967'},
 'unit3-4':{floor:[.23,.56,.77,.75],points:require('../support/journey-ground-contact.json').cases.find(x=>x.course==='unit3-4').contacts.map(x=>x.pixel),sha:'c1a9f4d258a4caf9134403a2171924e643e177b792b7f3ff4f12829da8732a92'},
 'unit5-6':{floor:[.23,.56,.77,.75],points:[[311,930],[456,918],[716,938],[838,935],[1108,928],[1260,934]],sha:'8c97dedf6894f23a6fad779704be71cae5879ecebae9bc7e80815e5a47c2de59'},
 'unit7-8':{floor:[.23,.56,.77,.75],points:[[300,1214],[510,1202],[830,1208],[1006,1219]],sha:'eaebe41691113fb754db886352183d7ada8d55e87480edcfe0db16eea09f9843'},
 'unit9-10':{floor:[.20,.56,.80,.78],points:[[348,1056],[509,1054],[811,1053],[935,1060]],sha:'f5e40c6f0793e2662ca3d8c0f9134e855e5d0464bb302a5926279ae6461fb05b'},
 'unit11-12':{floor:[.22,.56,.78,.78],points:[[350,934],[532,919],[727,893],[900,898],[1010,929],[1178,946]],sha:'c741eedb1b795fe6260db04853f68587790b2ec36b507e882d5ca26df5d29480'}
};
function pointInStage(scene,character,pixel,stageWidth){
 const stageHeight=stageWidth*scene.height/scene.width, spriteWidth=stageWidth*scene.position.width,scale=spriteWidth/character.width;
 return [(scene.position.feet[0]*stageWidth-character.anchor[0]*spriteWidth+pixel[0]*scale)/stageWidth,
 (scene.position.feet[1]*stageHeight-character.anchor[1]*character.height*scale+pixel[1]*scale)/stageHeight];
}
test('独立场景只接管前六组，72课目录、13课以后场景与授权归属保持原合同',()=>{
 const m=modules();assert.deepEqual(m.ids,ids);assert.deepEqual(Object.keys(m.chapters),['opening','neighborhood']);
 assert.deepEqual(m.chapters.opening,ids.slice(0,3));assert.deepEqual(m.chapters.neighborhood,ids.slice(3));
 assert.deepEqual(Object.keys(m.scenes),ids);assert.equal(m.characters,art.characters);
 assert.equal(JSON.stringify(art),originalArt);assert.equal(JSON.stringify(catalog.MAP_CHAPTERS),originalCatalog);
 assert.equal(catalog.MAP_COURSES.length,72);assert.equal(catalog.chapterFor('unit13-14'),'visits');assert.equal(catalog.chapterFor('unit143-144'),'woodland');
 assert.deepEqual(catalog.mapChapters([{id:'unit3-4'},{id:'unit143-144'}]).map(x=>x.id),['opening','woodland']);
 assert.equal(m.scenes['unit13-14'],undefined);
});
test('六组沿用原人物文件及像素身份，避免为适配重生或悄悄改变人物',async()=>{
 const m=modules();
 for(const id of ids){const c=m.characters[id];assert.equal(hash(c.file),fixtures[id].sha,id);const meta=await sharp(file(c.file)).metadata();assert.deepEqual([meta.width,meta.height],[c.width,c.height],id);}
});
test('新地面原PNG与WebP真实存在，3:2画布及alpha边界来自实际像素',async()=>{
 const m=modules();
 for(const id of ids){
  const g=m.scenes[id].ground;
  for(const name of [g.png,g.file]){const meta=await sharp(file(name)).metadata();assert.deepEqual([meta.width,meta.height],[1536,1024],name);assert.equal(meta.hasAlpha,true,name);}
  const {data,info}=await sharp(file(g.png)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let min=255,max=0,box=[1536,1024,-1,-1];
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const a=data[(y*info.width+x)*4+3];min=Math.min(min,a);max=Math.max(max,a);if(a>16)box=[Math.min(box[0],x),Math.min(box[1],y),Math.max(box[2],x),Math.max(box[3],y)];}
  assert.deepEqual(g.alphaRange,[min,max],id);assert.deepEqual(g.bounds,[box[0]/1536,box[1]/1024,(box[2]+1)/1536,(box[3]+1)/1024],id);
  assert.equal(min,0,id+' must have real transparency');assert.deepEqual(g.floor,fixtures[id].floor,id);
 }
 const a=await sharp(file(m.ambient.file)).metadata();assert.deepEqual([a.width,a.height],[m.ambient.width,m.ambient.height]);
});
test('六个代表画布宽度下，原人物可见轮廓完整且尺寸一致，鞋底/柜台仍落在各自独立地面',()=>{
 const m=modules();
 // 这是局部画布比例的纯几何验证；浏览器滚动、UI碰撞和真机画面由页面检查覆盖。
 for(const width of [288,320,360,390,768,1024])for(const id of ids){
  const s=m.scenes[id],c=m.characters[id],f=fixtures[id];assert.equal(s.width/s.height,1.5,id);
  const topLeft=pointInStage(s,c,[c.bounds[0]*c.width,c.bounds[1]*c.height],width);
  const bottomRight=pointInStage(s,c,[c.bounds[2]*c.width,c.bounds[3]*c.height],width);
  assert.ok(topLeft[0]>=0&&topLeft[1]>=0&&bottomRight[0]<=1&&bottomRight[1]<=1,id+' visible image escapes canvas');
  const visibleHeight=(bottomRight[1]-topLeft[1])*width*s.height/s.width;
  assert.ok(Math.abs(visibleHeight-width*.40)<.01,id+' visible group height must stay at 40% of stage width');
  for(const pixel of f.points){
   const [x,y]=pointInStage(s,c,pixel,width);
   assert.ok(x>=f.floor[0]&&x<=f.floor[2]&&y>=f.floor[1]&&y<=f.floor[3],id+' shoe/prop '+pixel+' outside floor at '+width+': '+[x,y]);
  }
 }
});
test('地面与人物属于局部场景：改成旧地图的上层落点会被鞋底规则识别',()=>{
 const m=modules(),s=m.scenes['unit3-4'],c=m.characters['unit3-4'],f=fixtures['unit3-4'];
 const displaced={...s,position:{...s.position,feet:[.74,.24]}};
 assert.ok(f.points.some(p=>{const [x,y]=pointInStage(displaced,c,p,390);return x<f.floor[0]||x>f.floor[2]||y<f.floor[1]||y>f.floor[3];}));
});
