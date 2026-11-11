'use strict';
// A separate, loopback-only preview. Never imports the account server or opens its database.
const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const {definition}=require('../server/progress');
const {createCoursePackages}=require('./course-packages');
const {LESSON_HEADER_CONTRACT}=require('./http-header-contract');
const model=require('../review-bench/state-model');
const ids=require('../server/catalog').UNITS,base='/lesson/';
async function loadCatalog(root){
 const internal=ids.map(id=>({unit:definition(root,id,base)}));
 const references=JSON.parse(await fs.readFile(path.join(root,'review-bench/references.json'),'utf8'));
 for(const {unit}of internal)unit.reviewReferences=references[unit.id]||[];
 vm.runInNewContext(await fs.readFile(path.join(root,'unit1-2/learning-copy.js'),'utf8'),{CanranCore:{unit12:internal[0].unit}});
 const presets=JSON.parse(await fs.readFile(path.join(root,'tests/support/required-phone-devices.json'),'utf8'));
 return {version:1,courses:internal.map(({unit})=>({id:unit.id,title:'Lesson '+unit.id.slice(4).replace('-','–'),entries:model.entriesFor(unit)})),devices:[...presets.devices.map(d=>({id:d.id,name:d.name,...d.viewport})),{id:'small-phone',name:'320 小屏压力',width:320,height:568},{id:'tablet',name:'平板',width:768,height:1024},{id:'desktop',name:'电脑',width:1366,height:768}],internal};
}
function replaceOnce(source,needle,replacement){if(source.split(needle).length!==2)throw Error('Review adapter anchor changed: '+needle);return source.replace(needle,replacement);}
function instrumentSource(relative,source,{prefix=''}={}){
 if(relative==='core/course-cache.js')return prefix+'\n'+source;
 if(relative==='core/learning-flow.js')return replaceOnce(source,'referenceSheet.showModal();referenceContent.scrollTop=0;','referenceSheet.showModal();referenceContent.scrollTop=0;root.CanranReviewRuntime?.referenceOpened(source);');
 if(ids.some(id=>relative===id+'/content.js'))return source+'\nif(typeof document!=="undefined") globalThis.CanranReviewRuntime?.prepareUnit(CanranCore.learningContext);\n';
 if(ids.some(id=>relative===id+'/unit.js')){
  const markers=source.match(/const completed\s*=[^;]+;/g)||[];
  if(markers.length!==1)throw Error('Review completion adapter anchor changed: '+relative);
  return replaceOnce(source,markers[0],markers[0]+`\n  root.CanranReviewRuntime?.registerCompletionReset(() => {
    for (const id of Object.keys(completed)) delete completed[id];
    completed.text = signatures.text;
    practice.activity('unitCompleted', completed);
  });`);
 }
 if(relative==='core/unit-awards.js'){
  source=replaceOnce(source,'const access = root.CanranStudentAccess;','const access = null; // Local review uses the existing local-only award ledger.');
  return replaceOnce(source,'save(); return { record, state };',`save();
    root.CanranReviewRuntime?.registerAwards(() => {
      claims = {}; practice.activity('unitAwardClaims', claims);
      ledger = JSON.parse(localStorage.getItem(key)); save();
    });
    return { record, state };`);
 }
 if(relative==='core/lesson49-practice.js'){
  source=replaceOnce(source,'let group = notebook.groups[key];','const reviewSeed = root.CanranReviewRuntime?.seedPractice({unit:context,questions,key,draftVersion:DRAFT_VERSION,contentSignature,roundPolicy});\n    if(reviewSeed){notebook.groups[key]=reviewSeed.group;Object.assign(notebook.records,reviewSeed.records);}\n    let group = notebook.groups[key];');
  return replaceOnce(source,'controllers.set(element,controller); return controller;',`root.CanranReviewRuntime?.registerPractice(element, () => {
      const seed = root.CanranReviewRuntime.seedPractice({unit:context,questions,key,draftVersion:DRAFT_VERSION,contentSignature,roundPolicy});
      for (const q of questions) delete notebook.records[q.id];
      Object.assign(notebook.records,seed.records);
      group = notebook.groups[key] = seed.group;
      reviewIndex = null; cachedResult = null;
      normalizeDraft(); save(); render();
    }, () => {
      const index = reviewIndex === null ? group.index : reviewIndex;
      return { questionId: questions[index]?.id, review: reviewIndex !== null,
        result: reviewIndex === null && group.index === questions.length,
        corrected: group.states.some(state => state?.firstCorrect === false), state: group.states[index] };
    }, (questionId, preset) => {
      const index = group.index;
      if (reviewIndex !== null || questions[index]?.id !== questionId) return false;
      // Keep the completed prefix and its real attempts in this demonstration.
      // A readonly example needs a completed suffix for the original review controls.
      const readonly = preset === 'review';
      const end = readonly ? questions.length : index + 1;
      const mode = readonly || preset === 'explanation' ? 'correct' : preset;
      for (let i = index; i < end; i++) {
        const question = questions[i];
        const example = root.CanranReviewState.questionState(question, group.runId, mode);
        if (preset === 'hint') example.hintUsed = true;
        group.states[i] = example;
        if (example.attempts) notebook.records[question.id] = {...example, target:question.target, prompt:question.prompt};
      }
      if (readonly) { reviewIndex = index; group.index = questions.length; }
      cachedResult = null; save(); render(); return true;
    });
    controllers.set(element,controller); return controller;`);
 }
 return source;
}
async function createReviewServer({root=process.cwd(),port=4401}={}){
 const courseHeaders={...LESSON_HEADER_CONTRACT,'x-frame-options':'SAMEORIGIN'};
 const cspKey=Object.keys(courseHeaders).find(k=>k.toLowerCase()==='content-security-policy');
 courseHeaders[cspKey]=courseHeaders[cspKey].replace(/frame-ancestors [^;]+/,"frame-ancestors 'self'");
 let current,previous,building;
 async function build(){
  if(building)return building;
  building=(async()=>{
   const catalog=await loadCatalog(root),publicCatalog={version:catalog.version,courses:catalog.courses,devices:catalog.devices};
   const prefix=await fs.readFile(path.join(root,'review-bench/state-model.js'),'utf8')+'\n;if(typeof document!=="undefined") globalThis.CanranReviewCatalog='+JSON.stringify(publicCatalog)+';\n'+await fs.readFile(path.join(root,'review-bench/runtime.js'),'utf8');
   const pack=await createCoursePackages({root,basePath:base,courseIds:ids,isolatedDefinitions:true,readSource:async relative=>{
    const bytes=await fs.readFile(path.join(root,relative));
    return relative.endsWith('.js')?Buffer.from(instrumentSource(relative,bytes.toString(),{prefix})):bytes;
   }});
   const worker=pack.generated.get('core/subpath-worker.js');
   worker.body=Buffer.from(worker.body.toString().replace(/^self\.courseResponseHeaders = [^\n]+/, 'self.courseResponseHeaders = '+JSON.stringify(courseHeaders)+';'));
   const logical=new Map();for(const descriptor of Object.values(pack.index.courses)){
    const manifest=JSON.parse(pack.generated.get(descriptor.manifest.slice(base.length)).body);
    for(const item of [...manifest.required,...manifest.audio])logical.set(item.key.slice(base.length),pack.generated.get(item.url.slice(base.length)));
   }
   previous=current;current={...pack,logical,catalog:publicCatalog};return current;
  })().finally(()=>{building=null;});return building;
 }
 await build();
 const publicFiles=new Map([['/','review-bench/index.html'],['/review/app.js','review-bench/app.js'],['/review/styles.css','review-bench/styles.css'],['/review/state-model.js','review-bench/state-model.js']]);
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
 const server=http.createServer(async(request,response)=>{
  try{
   const allowed=['127.0.0.1:'+server.address().port,'localhost:'+server.address().port];
   if(!allowed.includes(request.headers.host)||request.headers.origin&&!allowed.map(h=>'http://'+h).includes(request.headers.origin))return response.writeHead(403).end();
   if(!['GET','HEAD'].includes(request.method))return response.writeHead(405,{Allow:'GET, HEAD'}).end();
   const url=new URL(request.url,'http://'+request.headers.host);
   let item,headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'"};
   if(url.pathname==='/review/catalog.json'){if(process.env.REVIEW_FIXED_BUILD!=='1')await build();item={body:Buffer.from(JSON.stringify(current.catalog)),type:'application/json; charset=utf-8'};}
   else if(publicFiles.has(url.pathname)){const file=publicFiles.get(url.pathname);item={body:await fs.readFile(path.join(root,file)),type:types[path.extname(file)]};}
   else if(url.pathname.startsWith(base)){
    const relative=url.pathname.slice(base.length)+(url.pathname.endsWith('/')?'index.html':'');
    item=current.generated.get(relative)||current.logical.get(relative)||previous?.generated.get(relative)||previous?.logical.get(relative);
    headers={...courseHeaders,'Cache-Control':'no-cache','Service-Worker-Allowed':base};
   }
   if(!item)return response.writeHead(404).end('Not found');
   response.writeHead(200,{...headers,'Content-Type':item.type});response.end(request.method==='HEAD'?undefined:item.body);
  }catch(error){console.error('Review request:',error.message);response.writeHead(500,{'Content-Type':'text/plain; charset=utf-8'}).end('验收服务暂时不可用，请查看本地日志。');}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});return server;
}
if(require.main===module)createReviewServer({port:Number(process.env.REVIEW_PORT||4401)}).then(server=>console.log('页面验收台：http://127.0.0.1:'+server.address().port+'/')).catch(error=>{console.error(error);process.exitCode=1;});
module.exports={loadCatalog,instrumentSource,createReviewServer};
