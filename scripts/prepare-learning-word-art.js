'use strict';
// Adopt explicitly reviewed illustrations. The former blanket SVG-gradient
// recipe is retired: changing material cannot establish visual consistency.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {UNITS}=require('../server/catalog'),{definition}=require('../server/progress');
function approvedMaps(registry,{preview=false}={}){
 const maps={};
 for(const item of registry.entries){
  if(item.status!=='accepted'&&!(preview&&item.status==='source-reviewed'))continue;
  if(!['reference-generation','approved-source-reuse'].includes(item.method))throw Error('素材方法不能代表画风通过：'+item.word);
  if(!item.references?.length)throw Error('缺少真实参考：'+item.word);
  if(!item.meaningReview||!item.sourceReview)throw Error('缺少词义或原图审查：'+item.word);
  if(item.method==='reference-generation'&&!item.promptId)throw Error('缺少生成提示词：'+item.word);
  if(item.status==='accepted'&&!item.screenEvidence?.length)throw Error('缺少真实页面对照：'+item.word);
  if(!UNITS.includes(item.unit))throw Error('未知单元：'+item.unit);
  if(maps[item.unit]?.[item.word])throw Error('重复采用：'+item.word);
  (maps[item.unit]||={})[item.word]=item.asset;
 }
 return maps;
}
function mergeMaps(previous,accepted,blocked){
 const result={...previous,...accepted};
 for(const item of blocked)if(result[item.word]===item.asset)delete result[item.word];
 return result;
}
function readMap(root,id){
 const file=path.join(root,id,'learning-artwork.js');if(!fs.existsSync(file))return {};
 const box={CanranCore:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),box,{timeout:500});return {...box.CanranCore.learningWordArtwork};
}
function run(argv=process.argv.slice(2),root=path.resolve(__dirname,'..')){
 const registry=JSON.parse(fs.readFileSync(path.join(root,'assets/word-art-v2/adoptions.json'),'utf8'));
 const preview=argv.includes('--preview'),write=argv.includes('--write'),maps=approvedMaps(registry,{preview});
 for(const item of registry.entries.filter(x=>x.status==='accepted')){
  const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,item.asset))).digest('hex');
  if(hash!==item.sha256)throw Error('采用素材已改变，须重新审查：'+item.word);
  for(const evidence of [...item.references,...item.screenEvidence])if(!fs.existsSync(path.join(root,evidence)))throw Error('缺失对照证据：'+evidence);
 }
 const touched=new Set([...Object.keys(maps),...registry.blockedReuses.map(x=>x.unit)]),files=[];
 for(const id of touched){
  const next=mergeMaps(readMap(root,id),maps[id]||{},registry.blockedReuses.filter(x=>x.unit===id));
  for(const asset of Object.values(next))if(!fs.existsSync(path.join(root,asset)))throw Error('缺失素材：'+asset);
  const presentation=Object.fromEntries(Object.keys(maps[id]||{}).map(word=>[word,'illustration']));
  const source='/* Display mappings only; visual acceptance is tracked in assets/word-art-v2/adoptions.json. */\nCanranCore.learningWordArtwork='+JSON.stringify(next,null,2)+';\nCanranCore.learningWordPresentation='+JSON.stringify(presentation,null,2)+';\n';
  const file=path.join(root,id,'learning-artwork.js');if(fs.readFileSync(file,'utf8')!==source){files.push(id+'/learning-artwork.js');if(write)fs.writeFileSync(file,source);}
 }
 const coverage=UNITS.map(id=>{
  const unit=definition(root,id,'/'),display=write?readMap(root,id):mergeMaps(readMap(root,id),maps[id]||{},registry.blockedReuses.filter(x=>x.unit===id));
  return {unit:id,words:unit.learning.WORDS.map(word=>{const review=registry.entries.find(x=>x.unit===id&&x.word===word.en);return {word:word.en,original:word.image,display:display[word.en]||word.image,status:review?.status||'not-audited',note:id==='unit5-6'?'Existing unit5-6/current.js artwork adapter remains authoritative':undefined};})};
 });
 if(write)fs.writeFileSync(path.join(root,'docs/designs/word-art-v2/coverage.json'),JSON.stringify({version:2,units:coverage},null,2)+'\n');
 console.log(JSON.stringify({mode:preview?'preview-not-acceptance':'accepted-only',write,files,accepted:registry.entries.filter(x=>x.status==='accepted').length,remainingUnaudited:coverage.flatMap(x=>x.words).filter(x=>x.status!=='accepted').length}));
}
if(require.main===module)run();
module.exports={approvedMaps,mergeMaps,run};
