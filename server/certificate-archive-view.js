'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),vm=require('node:vm');
const {UNITS}=require('./catalog');
const {normalizeBasePath}=require('../scripts/public-base-path');
const catalog=require('../core/course-catalog');
const awardCatalog=require('./award-catalog');
const paperCourses=new Set([1,3,5,...Array.from({length:17},(_,i)=>7+i*2),49].map(n=>'unit'+n+'-'+(n+1)));
const types={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function createCertificateArchiveView({root,basePath='/'}){
 const BASE=normalizeBasePath(basePath),prepared=new Map();
 const prefix=course=>BASE+'awards/history-assets/'+course+'/';
 const relocate=(source,course)=>source.replace(/(["'(`])\/(assets|core|unit\d+-\d+)\//g,(_,quote,folder)=>quote+prefix(course)+folder+'/');
 async function specification(course){
  if(!UNITS.includes(course))throw Error('Unknown certificate course');
  if(prepared.has(course))return prepared.get(course);
  const pending=(async()=>{
   const index=await fs.readFile(path.join(root,course,'index.html'),'utf8');
   const styles=[...index.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(match=>match[1].split('?')[0].replace(/^\//,''));
   const digits=course.slice(4).replace('-',''),early=['unit1-2','unit3-4','unit5-6'].includes(course);
   const scripts=paperCourses.has(course)?['core/lesson49-icons.js',...(early||course==='unit49-50'?[]:['archive-definition.js']),course+'/legacy-certificate.js',course+(early?'/history.js':'/legacy.js')]:[];
   const allowed=new Set([...styles,...scripts,'core/vendor/gifenc.js','core/award-gif.js','core/award-card-layout.js','core/story-certificate.js']);
   // CSS dependencies remain scoped to declared source styles. Teaching scripts,
   // content definitions, server sources and arbitrary files are never exposed.
   async function cssDependencies(file){
    const css=await fs.readFile(path.join(root,file),'utf8');
    for(const match of css.matchAll(/(?:url\(\s*["']?|@import\s+["'])([^)'"\s]+)["']?\s*\)?/g)){
     const value=match[1].split(/[?#]/)[0];if(/^(?:data:|https?:|#)/.test(value))continue;
     const relative=value.startsWith('/')?value.slice(1):path.posix.normalize(path.posix.join(path.posix.dirname(file),value));
     if(!relative||relative.startsWith('../')||path.posix.isAbsolute(relative))throw Error('Invalid certificate stylesheet resource');
     if(allowed.has(relative))continue;allowed.add(relative);
     if(relative.endsWith('.css'))await cssDependencies(relative);
    }
   }
   for(const file of styles)await cssDependencies(file);
   let definition='';
   if(scripts.includes('archive-definition.js')){
    const sandbox={CanranCore:{courseCatalog:catalog},document:{documentElement:{dataset:{unit:course}}}};
    vm.runInNewContext(await fs.readFile(path.join(root,'server/legacy',course+'-content.js'),'utf8'),sandbox);
    const old=sandbox.CanranCore['unit'+digits];
    if(!old?.stages)throw Error('Original certificate headings are unavailable');
    // Only the original certificate's badge captions are needed. Do not send
    // either historical or current questions/answers to this read-only viewer.
    definition='globalThis.CanranCore.unit'+digits+'LegacyDefinition='+JSON.stringify({stages:old.stages.map(stage=>({title:stage.title}))})+';';
   }
   const bodyClass=index.match(/<body[^>]*class="([^"]*)"/)?.[1]||'lesson-workspace unit-workspace unit'+digits+'-workspace';
   return{styles,scripts,allowed,definition,bodyClass};
  })();
  prepared.set(course,pending);return pending;
 }
 async function page(archive){
  if(!archive||!['card','legacy-paper'].includes(archive.kind))throw Error('Unknown certificate kind');
  if(archive.kind==='legacy-paper'&&!paperCourses.has(archive.course))throw Error('Original paper renderer unavailable');
  const spec=await specification(archive.course),address=prefix(archive.course);
  const scripts=archive.kind==='legacy-paper'?spec.scripts:['core/vendor/gifenc.js','core/award-gif.js','core/award-card-layout.js','core/story-certificate.js'];
  return `<!doctype html><html lang="zh-CN" data-unit="${escape(archive.course)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="archive-base" content="${escape(BASE)}"><meta name="archive-id" content="${escape(archive.id)}">${archive.local?'<meta name="archive-local" content="true">':''}<title>原证书 · 灿然英语工作室</title>${spec.styles.map(file=>`<link rel="stylesheet" href="${escape(address+file)}">`).join('')}<link rel="stylesheet" href="${BASE}history-certificates.css"><script defer src="${BASE}local-certificate-copies.js"></script><script defer src="${BASE}history-certificates.js"></script>${archive.local&&archive.kind==='card'?`<script defer src="${escape(address)}archive-card-metadata.js"></script>`:''}${scripts.map(file=>`<script defer src="${escape(address+file)}"></script>`).join('')}</head><body class="${escape(spec.bodyClass)} certificate-archive-page"><header class="certificate-archive-header"><a href="${BASE}awards/">返回我的纪念册</a><h1>${archive.local?'这台设备保留的原证书':'已获得的原证书'}</h1><p>${archive.local?'只读查看本机保留资料，不补发星星或改写学习记录。':'原姓名、原内容与领取日期完整保留。'}</p></header><main id="certificateArchive"><p id="certificateArchiveStatus" role="status">正在准备原证书…</p><div id="certificateArchiveView"></div></main></body></html>`;
 }
 async function resource(course,relative){
  if(!UNITS.includes(course)||typeof relative!=='string'||!relative||relative!==path.posix.normalize(relative)||relative.includes('\\')||relative.startsWith('/')||relative.split('/').includes('..'))return null;
  const spec=await specification(course);
  if(relative==='archive-definition.js')return spec.definition?{body:Buffer.from(spec.definition),type:'text/javascript'}:null;
  if(relative==='archive-card-metadata.js')return{body:Buffer.from('globalThis.CanranArchiveCardMetadata='+JSON.stringify(awardCatalog[course]||{})+';'),type:'text/javascript'};
  const extension=path.extname(relative).toLowerCase(),imageOrFont=['.svg','.png','.webp','.jpg','.jpeg','.avif','.woff2','.woff','.ttf'].includes(extension);
  const knownArtwork=imageOrFont&&[`assets/${course}/`,'assets/lesson49/icons/','assets/awards/','assets/fonts/','assets/brand/',...(course==='unit1-2'?['assets/unit1-2/scene/']:[])].some(folder=>relative.startsWith(folder));
  if(!spec.allowed.has(relative)&&!knownArtwork)return null;
  if(!types[extension])return null;
  const absolute=path.resolve(root,relative),realRoot=await fs.realpath(root);let resolved;
  try{resolved=await fs.realpath(absolute);}catch(error){if(error.code==='ENOENT')return null;throw error;}
  if(!resolved.startsWith(realRoot+path.sep))return null;
  const bytes=await fs.readFile(resolved);
  return{body:['.js','.css'].includes(extension)?Buffer.from(relocate(bytes.toString('utf8'),course)):bytes,type:types[extension]};
 }
 return{page,resource};
}
module.exports={createCertificateArchiveView,paperCourses};
