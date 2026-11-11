'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {approvedMaps,mergeMaps}=require('../../scripts/prepare-learning-word-art');
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const vm=require('node:vm'),crypto=require('node:crypto');
const accepted={unit:'unit143-144',word:'wood',asset:'/assets/word-art-v2/wood-v1.webp',method:'reference-generation',status:'accepted',references:['assets/unit143-144/keepsake-story-v1.webp'],promptId:'wood',meaningReview:'树林不是木材',sourceReview:'已对照树冠、轮廓、纸感',screenEvidence:['evidence/words.png']};
test('changing fill/material alone can never approve an illustration',()=>{
 assert.throws(()=>approvedMaps({entries:[{...accepted,method:'native-vector-lighting'}]}),/素材方法/);
 assert.throws(()=>approvedMaps({entries:[{...accepted,references:[]}]}),/参考/);
 assert.throws(()=>approvedMaps({entries:[{...accepted,screenEvidence:[]}]}),/页面/);
});
test('unreviewed assets remain pending, and explicit adoption retains other fallbacks',()=>{
 const maps=approvedMaps({entries:[accepted,{...accepted,word:'city',status:'pending'}]});
 assert.deepEqual(maps,{'unit143-144':{wood:accepted.asset}});
 assert.deepEqual(mergeMaps({wood:'/old.svg',city:'/city.svg'},maps['unit143-144'],[]),{wood:accepted.asset,city:'/city.svg'});
});
test('a blocked reuse is removed only when it is still the flagged source',()=>{
 const banned=[{word:'I',asset:'/assets/unit7-8/cast-robert-v1.webp'}];
 assert.deepEqual(mergeMaps({I:banned[0].asset,am:'/am.svg'},{},banned),{am:'/am.svg'});
 assert.deepEqual(mergeMaps({I:'/new-single-person.webp'},{},banned),{I:'/new-single-person.webp'});
});
test('reviewed assets preserve transparency and original keepsake, and ship without raw generations',async()=>{
 const registry=require('../../assets/word-art-v2/adoptions.json'),root=path.resolve(__dirname,'../..');
 for(const item of registry.entries){
  const {data,info}=await sharp(path.join(root,item.asset)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,512);assert.equal(info.height,512);assert.equal(data[3],0);assert.equal(data[(info.width*info.height-1)*4+3],0);
  for(const source of item.references)assert.ok(fs.existsSync(path.join(root,source)));
 }
 const {createCoursePackages}=require('../../scripts/course-packages');
 const pack=await createCoursePackages({root,basePath:'/lesson/',courseIds:['unit143-144']});
 const manifest=JSON.parse(pack.generated.get(pack.index.courses['unit143-144'].manifest.slice('/lesson/'.length)).body),keys=manifest.required.map(x=>x.key);
 for(const item of registry.entries)assert.ok(keys.includes('/lesson'+item.asset));
 assert.ok(keys.includes('/lesson/assets/unit143-144/keepsake-story-v1.webp'));
 assert.ok(!keys.some(x=>x.includes('/word-art-v2/raw/')));
});
test('runtime illustration labels require accepted, unchanged artwork and existing evidence',()=>{
 const registry=require('../../assets/word-art-v2/adoptions.json');
 for(const id of require('../../server/catalog').UNITS){
  const scope={CanranCore:{}};vm.runInNewContext(fs.readFileSync(id+'/learning-artwork.js','utf8'),scope);
  for(const word of Object.keys(scope.CanranCore.learningWordPresentation||{})){
   const item=registry.entries.find(x=>x.unit===id&&x.word===word);assert.ok(item&&item.status==='accepted',id+' '+word+' must be reviewed');
   assert.equal(scope.CanranCore.learningWordArtwork[word],item.asset);
   assert.equal(crypto.createHash('sha256').update(fs.readFileSync('.'+item.asset)).digest('hex'),item.sha256);
   for(const evidence of [...item.references,...item.screenEvidence])assert.ok(fs.existsSync(evidence),evidence);
  }
 }
});
