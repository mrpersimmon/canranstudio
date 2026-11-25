'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {approvedMaps,mergeMaps,questionArtwork}=require('../../scripts/prepare-learning-word-art');
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const vm=require('node:vm'),crypto=require('node:crypto');
const accepted={unit:'unit143-144',word:'wood',asset:'/assets/word-art-v2/wood-v1.webp',method:'reference-generation',status:'accepted',references:['assets/unit143-144/keepsake-story-v1.webp'],promptId:'wood',meaningReview:'树林不是木材',sourceReview:'已对照树冠、轮廓、纸感',screenEvidence:['evidence/words.png']};
test('changing fill/material alone can never approve an illustration',()=>{
 assert.throws(()=>approvedMaps({entries:[{...accepted,method:'native-vector-lighting'}]}),/素材方法/);
 assert.throws(()=>approvedMaps({entries:[{...accepted,references:[]}]}),/参考/);
 assert.throws(()=>approvedMaps({entries:[{...accepted,screenEvidence:[]}]}),/页面/);
});
test('exact teaching symbols require a factual review and cannot claim painted illustration status',()=>{
 const flag={...accepted,unit:'unit5-6',word:'French',method:'factual-source-preservation',presentation:'fact',factReview:'Original flag geometry retained; translated captions belong only to exercise diagrams'};
 assert.deepEqual(approvedMaps({entries:[flag]}),{'unit5-6':{French:flag.asset}});
 assert.throws(()=>approvedMaps({entries:[{...flag,factReview:''}]}),/教学事实/);
 assert.throws(()=>approvedMaps({entries:[{...flag,presentation:'illustration'}]}),/教学事实/);
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

test('question artwork follows explicit cross-unit objects, never ambiguous symbols or teaching diagrams',()=>{
 const umbrella='/assets/unit3-4/umbrella.svg',icon='/assets/lesson49/icons/heart.svg',car='/assets/unit5-6/volvo.svg';
 const definitions={
  'unit3-4':{learning:{WORDS:[{en:'umbrella',image:umbrella},{en:'sorry',image:icon}]},questions:[]},
  'unit5-6':{learning:{WORDS:[{en:'Volvo',image:car}]},questions:[{image:car}]},
  'unit9-10':{learning:{WORDS:[]},questions:[{image:umbrella,options:[{image:icon},{image:car}]}]}
 };
 const entries=[{unit:'unit3-4',word:'umbrella',presentation:'illustration'}, {unit:'unit3-4',word:'sorry',presentation:'illustration'}, {unit:'unit5-6',word:'Volvo',presentation:'illustration'}];
 const maps={'unit3-4':{umbrella:'/purple.webp',sorry:'/person.webp'},'unit5-6':{Volvo:'/car.webp'}};
 assert.deepEqual(questionArtwork({entries},definitions,maps),{'unit3-4':{},'unit5-6':{},'unit9-10':{[umbrella]:'/purple.webp'}});
 definitions['unit3-4'].learning.WORDS.push({en:'parasol',image:umbrella});
 entries.push({unit:'unit3-4',word:'parasol',presentation:'illustration'});maps['unit3-4'].parasol='/another.webp';
 assert.deepEqual(questionArtwork({entries},definitions,maps)['unit9-10'],{});
});
test('reviewed assets preserve transparency and original keepsake, and ship without raw generations',async()=>{
 const registry=require('../../assets/word-art-v2/adoptions.json'),root=path.resolve(__dirname,'../..'),acceptedEntries=registry.entries.filter(item=>item.status==='accepted');
 for(const item of acceptedEntries){
  if(item.method==='reference-generation'){
   const {data,info}=await sharp(path.join(root,item.asset)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   assert.equal(info.width,512);assert.equal(info.height,512);assert.equal(data[3],0);assert.equal(data[(info.width*info.height-1)*4+3],0);
  }
  for(const source of item.references)assert.ok(fs.existsSync(path.join(root,source)));
 }
 const {createCoursePackages}=require('../../scripts/course-packages');
 const ids=[...new Set(acceptedEntries.map(item=>item.unit))],pack=await createCoursePackages({root,basePath:'/lesson/',courseIds:ids});
 for(const id of ids){
  const manifest=JSON.parse(pack.generated.get(pack.index.courses[id].manifest.slice('/lesson/'.length)).body),keys=manifest.required.map(x=>x.key);
  for(const item of acceptedEntries.filter(item=>item.unit===id))for(const asset of [item.asset,...item.composition?.sources||[]])assert.ok(keys.includes('/lesson'+asset),id+' ships '+asset);
  const scope={CanranCore:{}};vm.runInNewContext(fs.readFileSync(id+'/learning-artwork.js','utf8'),scope);
  for(const asset of Object.values(scope.CanranCore.learningQuestionArtwork||{}))assert.ok(keys.includes('/lesson'+asset),id+' ships cross-unit object '+asset);
  if(id==='unit143-144')assert.ok(keys.includes('/lesson/assets/unit143-144/keepsake-story-v1.webp'));
  if(id==='unit23-24')assert.ok(!keys.includes('/lesson/assets/word-art-v2/sample13-24/dressing-table-v1.webp'),'rejected white-halo variant stays out of the course package');
  assert.ok(!keys.some(x=>x.includes('/raw/')),'source generations stay outside course packages');
 }
});
test('runtime illustration labels require accepted, unchanged artwork and existing evidence',()=>{
 const registry=require('../../assets/word-art-v2/adoptions.json');
 for(const id of require('../../server/catalog').UNITS){
  const scope={CanranCore:{}};vm.runInNewContext(fs.readFileSync(id+'/learning-artwork.js','utf8'),scope);
  for(const word of Object.keys(scope.CanranCore.learningWordPresentation||{})){
   const item=registry.entries.find(x=>x.unit===id&&x.word===word);assert.ok(item&&item.status==='accepted',id+' '+word+' must be reviewed');
   assert.equal(scope.CanranCore.learningWordArtwork[word],item.asset);
   assert.equal(crypto.createHash('sha256').update(fs.readFileSync('.'+item.asset)).digest('hex'),item.sha256);
   for(const source of item.composition?.sources||[])assert.equal(crypto.createHash('sha256').update(fs.readFileSync('.'+source)).digest('hex'),item.renderedSourceHashes?.[source],word+' relation source');
   for(const evidence of [...item.references,...item.screenEvidence])assert.ok(fs.existsSync(evidence),evidence);
  }
 }
});
