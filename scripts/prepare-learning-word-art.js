'use strict';
// Adopt explicitly reviewed illustrations. The former blanket SVG-gradient
// recipe is retired: changing material cannot establish visual consistency.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {UNITS}=require('../server/catalog'),{definition}=require('../server/progress');
const {reviewedUnits,compileProfiles}=require('./prepare-word-decks');
function approvedMaps(registry,{preview=false}={}){
 const maps={};
 for(const item of registry.entries){
  if(item.status!=='accepted'&&!(preview&&item.status==='source-reviewed'))continue;
  if(!['reference-generation','approved-source-reuse','factual-source-preservation'].includes(item.method))throw Error('素材方法不能代表画风通过：'+item.word);
  if(item.method==='factual-source-preservation'&&(!item.factReview||item.presentation!=='fact'))throw Error('教学事实保留必须单独核对并标记：'+item.word);
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
// Keep cross-unit object references consistent without rewriting the question
// source. Shared symbols, relation diagrams and labelled brand art are not
// interchangeable pictures; ambiguous original sources deliberately stay put.
function questionArtwork(registry,definitions,maps){
 const candidates=new Map(),ambiguous=new Set();
 for(const item of registry.entries){
  const target=maps[item.unit]?.[item.word];
  if(!target||item.presentation!=='illustration'||item.composition)continue;
  const source=definitions[item.unit]?.learning.WORDS.find(w=>w.en===item.word)?.image;
  if(!/^\/assets\/unit\d+-\d+\//.test(source||'')||source.startsWith('/assets/unit5-6/'))continue;
  if(candidates.has(source)&&candidates.get(source)!==target)ambiguous.add(source);
  candidates.set(source,target);
 }
 for(const source of ambiguous)candidates.delete(source);
 const result={};
 for(const [id,unit]of Object.entries(definitions)){
  const sources=new Set();
  function collect(value){if(typeof value==='string')sources.add(value);else if(value&&typeof value==='object')Object.values(value).forEach(collect);}
  collect(unit.questions);
  const protectedSources=new Set();
  if(Number(id.match(/\d+/)?.[0])>=25){
   const factual=/\b(colou?r|red|blue|white|black|green|yellow|purple|brown|pink|grey|gray|orange|count|how many|o.clock|clock|minutes?|left|right|between|under|behind|in front|on top|pounds?|pence|price|cost)\b|颜色|数量|几个|几只|多少|红色|白色|蓝色|左边|右边|上面|下面|中间|时钟|几点|价钱|费用|往返|箭头/i;
   for(const question of Object.values(unit.questions).flat()){if(!factual.test(JSON.stringify(question)))continue;const found=new Set();(function protect(value){if(typeof value==='string'&&value.startsWith('/assets/'))found.add(value);else if(value&&typeof value==='object')Object.values(value).forEach(protect);})(question);for(const source of found)protectedSources.add(source);}
  }
  result[id]=id==='unit5-6'?{}:Object.fromEntries([...candidates].filter(([source])=>sources.has(source)&&!protectedSources.has(source)));
 }
 return result;
}
function run(argv=process.argv.slice(2),root=path.resolve(__dirname,'..')){
 const registry=JSON.parse(fs.readFileSync(path.join(root,'assets/word-art-v2/adoptions.json'),'utf8'));
 const preview=argv.includes('--preview'),write=argv.includes('--write'),maps=approvedMaps(registry,{preview});
 for(const item of registry.entries.filter(x=>x.status==='accepted')){
  const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,item.asset))).digest('hex');
  if(hash!==item.sha256)throw Error('采用素材已改变，须重新审查：'+item.word);
  for(const source of item.composition?.sources||[]){
   const sourceHash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,source))).digest('hex');
   if(sourceHash!==item.renderedSourceHashes?.[source])throw Error('关系图素材已改变，须重新审查：'+item.word);
  }
  for(const evidence of [...item.references,...item.screenEvidence])if(!fs.existsSync(path.join(root,evidence)))throw Error('缺失对照证据：'+evidence);
 }
 const reviews=reviewedUnits(root),sampleUnits=Object.keys(reviews);
 const questionMaps=questionArtwork(registry,Object.fromEntries(sampleUnits.map(id=>[id,definition(root,id,'/')])),maps);
 const touched=new Set([...Object.keys(maps),...registry.blockedReuses.map(x=>x.unit)]),files=[];
 for(const id of touched){
  const next=mergeMaps(readMap(root,id),maps[id]||{},registry.blockedReuses.filter(x=>x.unit===id));
  for(const asset of Object.values(next))if(!fs.existsSync(path.join(root,asset)))throw Error('缺失素材：'+asset);
  const reviewed=registry.entries.filter(item=>item.unit===id&&maps[id]?.[item.word]);
  const presentation=Object.fromEntries(reviewed.map(item=>[item.word,item.presentation||'illustration']));
  const compositions=Object.fromEntries(reviewed.filter(item=>item.composition).map(item=>[item.word,item.composition]));
  const source='/* Display mappings only; visual acceptance is tracked in assets/word-art-v2/adoptions.json. */\nCanranCore.learningWordArtwork='+JSON.stringify(next,null,2)+';\nCanranCore.learningWordPresentation='+JSON.stringify(presentation,null,2)+';\n'+(Object.keys(compositions).length?'CanranCore.learningWordComposition='+JSON.stringify(compositions,null,2)+';\n':'')+(sampleUnits.includes(id)?'CanranCore.learningQuestionArtwork='+JSON.stringify(questionMaps[id],null,2)+';\n':'');
  const file=path.join(root,id,'learning-artwork.js');if(fs.readFileSync(file,'utf8')!==source){files.push(id+'/learning-artwork.js');if(write)fs.writeFileSync(file,source);}
 }
 const coverage=UNITS.map(id=>{
  const unit=definition(root,id,'/'),profiles=reviews[id]?compileProfiles(unit,reviews[id]):{},display=write?readMap(root,id):mergeMaps(readMap(root,id),maps[id]||{},registry.blockedReuses.filter(x=>x.unit===id));
  return {unit:id,words:unit.learning.WORDS.map(word=>{const review=registry.entries.find(x=>x.unit===id&&x.word===word.en),context=profiles[word.en]?.kind==='context';return {word:word.en,original:word.image,display:context?null:display[word.en]||word.image,status:context?(profiles[word.en].presentation==='word'?'accepted-text':'accepted-context'):review?.status||'not-audited',sentence:context?profiles[word.en].sentence:undefined,note:id==='unit5-6'?'Existing unit5-6/current.js artwork adapter remains authoritative':undefined};})};
 });
 if(write)fs.writeFileSync(path.join(root,'docs/designs/word-art-v2/coverage.json'),JSON.stringify({version:2,units:coverage},null,2)+'\n');
 console.log(JSON.stringify({mode:preview?'preview-not-acceptance':'accepted-only',write,files,accepted:registry.entries.filter(x=>x.status==='accepted').length,contextWords:coverage.flatMap(x=>x.words).filter(x=>x.status==='accepted-context').length,remainingUnaudited:coverage.flatMap(x=>x.words).filter(x=>!['accepted','accepted-context','accepted-text'].includes(x.status)).length}));
}
if(require.main===module)run();
module.exports={approvedMaps,mergeMaps,questionArtwork,run};
