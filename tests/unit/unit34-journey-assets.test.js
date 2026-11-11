'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),sharp=require('sharp');
const {createCoursePackages}=require('../../scripts/course-packages');
test('Lesson3–4 runtime includes nine adopted WebPs and original card, without generation PNGs or changing Lesson5–6',async()=>{
 const root=path.resolve(__dirname,'../..'),basePath='/lesson/';
 const {index,generated}=await createCoursePackages({root,basePath,courseIds:['unit3-4','unit5-6']});
 const manifest=id=>JSON.parse(generated.get(index.courses[id].manifest.slice(basePath.length)).body);
 const keys=manifest('unit3-4').required.map(x=>x.key),runtime=keys.filter(x=>x.includes('/unit3-4-journey/'));
 assert.equal(runtime.length,9);assert(runtime.every(x=>x.endsWith('.webp')));assert(keys.includes('/lesson/assets/awards/unit3-4-umbrella.webp'));assert(keys.some(x=>x.includes('/course-journey/umbrella-counter-v1.webp')));
 assert(!manifest('unit5-6').required.some(x=>x.key.includes('/unit3-4-journey/')));
});
test('The three teaching umbrellas retain equal canvas and separate red, yellow and purple canopies with transparent margins',async()=>{
 const colors=['red','yellow','purple'],data=[];
 for(const color of colors){
  const {data:rgba,info}=await sharp(`assets/unit3-4-journey/umbrella-${color}-v1.webp`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,1024);assert.equal(info.height,1536);assert.equal(rgba[3],0);assert.equal(rgba[(info.width*info.height-1)*4+3],0);
  let colored=0,matching=0;for(let y=220;y<700;y++)for(let x=100;x<930;x++){
   const i=(y*info.width+x)*4,[r,g,b,a]=rgba.subarray(i,i+4);if(a<220||Math.max(r,g,b)-Math.min(r,g,b)<35)continue;colored++;
   if(color==='red'?r>g*1.25&&r>b*1.2:color==='yellow'?r>b*1.2&&g>b*1.15:b>g*1.08&&r>g*1.05)matching++;
  }
  assert(colored>20000,color+' canopy must remain substantial');assert(matching/colored>.65,color+' teaching color must not become another umbrella');data.push(rgba);
 }
 for(let n=1;n<data.length;n++){let union=0,intersection=0;for(let i=3;i<data[0].length;i+=4){const a=data[0][i]>16,b=data[n][i]>16;if(a||b)union++;if(a&&b)intersection++;}assert(intersection/union>.985,'Switching umbrellas must not shift their silhouette');}
});
