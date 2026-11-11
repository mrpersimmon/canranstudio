'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const flow=require('../support/thirteen-types-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:8000});

async function observe(page){
 await page.addInitScript(()=>{
  const decoded=new Set(),decode=HTMLImageElement.prototype.decode,complete=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'complete'),nodes=new WeakMap();
  window.paintGuardEvents=[];window.paintGuardFrames=[];window.paintGuardReady=false;window.delayWarmPictureNodes=false;window.transientPictureReads=0;
  HTMLImageElement.prototype.decode=function(...args){const image=this;return decode.apply(image,args).then(value=>{if(image.naturalWidth)decoded.add(image.currentSrc||image.src);return value;});};
  // A decoded source and a newly inserted element have separate readiness.
  // The native IAB recording caught this interval. Widen only that interval
  // for already-decoded sources, without delaying bytes or changing pixels.
  Object.defineProperty(HTMLImageElement.prototype,'complete',{...complete,get(){
   const actual=complete.get.call(this),src=this.src;
   if(!window.paintGuardReady||!window.delayWarmPictureNodes||!this.isConnected||!decoded.has(src)||this.closest('#courseLoader'))return actual;
   let state=nodes.get(this);if(!state||state.src!==src){state={src,since:performance.now()};nodes.set(this,state);}
   if(performance.now()-state.since<40){window.transientPictureReads++;return false;}return actual;
  }});
  document.addEventListener('canran:course-ready',()=>{window.paintGuardReady=true;for(const image of document.images)nodes.set(image,{src:image.src,since:-Infinity});});
  const detail=()=>({time:performance.now(),question:document.querySelector('.learning-surface .progress-copy')?.textContent,painting:document.documentElement.hasAttribute('data-course-painting'),loader:!!document.getElementById('courseLoader'),pending:[...document.images].filter(i=>!i.closest('#courseLoader')&&(!i.complete||!i.naturalWidth)).map(i=>({src:i.currentSrc||i.src,decodedBefore:decoded.has(i.currentSrc||i.src),connected:i.isConnected,complete:i.complete,width:i.naturalWidth}))});
  new MutationObserver(records=>{
   if(!window.paintGuardReady)return;
   for(const record of records){
    if(record.type==='attributes'&&record.attributeName==='data-course-painting'&&record.oldValue===null)window.paintGuardEvents.push({type:'guard-enter',...detail()});
    if(record.type==='childList'&&[...record.addedNodes].some(n=>n.nodeType===1&&n.id==='courseLoader'))window.paintGuardEvents.push({type:'loader-insert',...detail()});
   }
  }).observe(document,{childList:true,subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['data-course-painting']});
  const frame=()=>{if(window.paintGuardReady&&(document.documentElement.hasAttribute('data-course-painting')||document.querySelector('#courseLoader')))window.paintGuardFrames.push(detail());requestAnimationFrame(frame);};requestAnimationFrame(frame);
 });
}
async function review(page,activity,index){
 await page.locator('.learning-milestones').getByRole('link',{name:activity==='trans'?'语法':'挑战',exact:true}).click();
 await expect(page.locator('.stage-'+activity)).toHaveClass(/learning-surface/);
 await page.getByRole('button',{name:'更多学习操作'}).click();await page.getByRole('button',{name:'回看本轮答题',exact:true}).click();
 const room=page.locator('.stage-'+activity);for(let i=0;i<index;i++)await room.getByRole('button',{name:'下一题',exact:true}).click();return room;
}
const scenarios=[...devices.map(device=>({device,fallback:false})),{device:devices[0],fallback:true}];
for(const{device,fallback}of scenarios)test(`${device.name}${fallback?' 内存降级':''}：已准备图片的作答和只读回看不重新盖住整页`,async({page,browser},info)=>{
 test.setTimeout(180000);await adminLogin(page,base);const account=await createStudent(page,'绘制保护-'+device.id,'小禾',[/Lesson 1–2 /]);const s=await studentLogin(browser,account,base,{...contextOptions(device),...(fallback?{serviceWorkers:'block'}:{})}),p=s.page;
 try{
  await observe(p);await p.goto(base+'unit1-2/#learn/trans');await courseReadyForAssertions(p);
  if(fallback)await expect(p.locator('#courseResourceNotice')).toBeVisible();
  await flow.activity(p,'1-2','trans',{base:base.slice(0,-1),navigate:false});await flow.activity(p,'1-2','exam',{base:base.slice(0,-1)});
  await p.reload();await courseReadyForAssertions(p);
  await p.evaluate(()=>window.delayWarmPictureNodes=true);
  const before=await p.evaluate(()=>{const n=JSON.parse(localStorage.getItem(CanranCore.unit12.progress.learningKey));return {groups:n.groups,records:n.records};});
  for(const[activity,target]of [['trans',5],['exam',7]]){
   const room=await review(p,activity,target-1);
   for(let round=0;round<8;round++){
    await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(room.locator('.progress-copy')).toHaveText(`回看 ${target+1} / ${activity==='trans'?12:10}`);
    await room.getByRole('button',{name:'上一题',exact:true}).click();
   }
   await room.getByRole('button',{name:'返回结果',exact:true}).click();
  }
  const after=await p.evaluate(()=>{const n=JSON.parse(localStorage.getItem(CanranCore.unit12.progress.learningKey));return {groups:n.groups,records:n.records};});expect(after).toEqual(before);
  const proof=await p.evaluate(()=>({events:window.paintGuardEvents,frames:window.paintGuardFrames,transientReads:window.transientPictureReads}));await fs.writeFile(info.outputPath('paint-guard.json'),JSON.stringify(proof,null,2));expect(proof.transientReads).toBeGreaterThan(0);
  expect(proof.events.length,'图片节点暂时未complete不能重新进入全屏准备流程；详情见 paint-guard.json').toBe(0);
  expect(proof.frames.length,'不能仅检查加载层后面的题卡几何').toBe(0);
 }finally{await s.context.close();}
});

test('图片保护仍拦截未知坏图和已准备图片的真实解码失败，忽略已移除节点的迟到失败',async({page,browser},info)=>{
 test.setTimeout(120000);await adminLogin(page,base);const account=await createStudent(page,'图片保护边界','小禾',[/Lesson 1–2 /]);const s=await studentLogin(browser,account,base,contextOptions(devices[0])),p=s.page;
 const saved=()=>p.evaluate(()=>{const n=JSON.parse(localStorage.getItem(CanranCore.unit12.progress.learningKey));return {groups:n.groups,records:n.records};});
 try{
  await flow.activity(p,'1-2','listen',{base:base.slice(0,-1)});await expect(p.locator('#starCount')).toHaveText('1');const original=await saved();
  for(const mode of ['unknown','prepared-failure','prepared-error-event']){
   await p.evaluate(mode=>{
    if(mode==='prepared-error-event'){
     const existing=document.querySelector('.stage-listen .current-completion img');
     Object.defineProperty(existing,'complete',{get:()=>true});Object.defineProperty(existing,'naturalWidth',{get:()=>0});
     existing.decode=()=>Promise.reject(new DOMException('Later failure of an existing image','EncodingError'));
     existing.dispatchEvent(new Event('error'));return;
    }
    const image=new Image();image.id='guard-failure-probe';image.width=48;image.height=48;
    if(mode==='unknown')image.src='data:image/svg+xml,<svg>broken';
    else{
     image.src=document.querySelector('.stage-listen .current-completion img').src;
     Object.defineProperty(image,'complete',{get:()=>false});
     image.decode=()=>Promise.reject(new DOMException('Intentional DOM image failure','EncodingError'));
    }
    document.body.append(image);
   },mode);
   await expect(p.getByRole('region',{name:'课程加载'})).toContainText('错误编号：L05');
   await expect(p.locator('html')).toHaveAttribute('data-course-painting','');expect(await saved()).toEqual(original);
   await fs.writeFile(info.outputPath(mode+'-guard-layout.json'),JSON.stringify(await p.evaluate(()=>{
    const overlay=document.getElementById('courseLoader'),card=overlay.querySelector('.course-loader-card'),button=overlay.querySelector('button');
    const describe=e=>({rect:e.getBoundingClientRect().toJSON(),opacity:getComputedStyle(e).opacity,visibility:getComputedStyle(e).visibility,animation:getComputedStyle(e).animation,transform:getComputedStyle(e).transform,pointerEvents:getComputedStyle(e).pointerEvents,scrollTop:e.scrollTop});
    const b=button.getBoundingClientRect();return {overlay:describe(overlay),card:describe(card),button:describe(button),hit:document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)?.outerHTML.slice(0,500),html:document.documentElement.outerHTML.slice(0,200)};
   }),null,2));
   await p.screenshot({path:info.outputPath(mode+'.png'),scale:'css'});
   // Observe the new document, not the brief interval after the old loader
   // disappears and before the replacement document mounts its loader.
   await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.getByRole('button',{name:'再试一次',exact:true}).click()]);
   await courseReadyForAssertions(p);expect(await saved()).toEqual(original);await expect(p.locator('#starCount')).toHaveText('1');
  }
  await p.evaluate(()=>{
   const image=new Image();image.id='guard-stale-probe';image.width=48;image.height=48;image.src=document.querySelector('.stage-listen .current-completion img').src;
   Object.defineProperty(image,'complete',{get:()=>false});window.staleGuardChecked=false;
   image.decode=()=>new Promise((resolve,reject)=>{window.staleGuardChecked=true;window.rejectStaleGuard=reject;});document.body.append(image);
  });
  await p.waitForFunction(()=>window.staleGuardChecked);
  await p.evaluate(async()=>{document.getElementById('guard-stale-probe').remove();window.rejectStaleGuard(new DOMException('Old question removed','EncodingError'));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
  await expect(p.locator('#courseLoader')).toHaveCount(0);await expect(p.locator('html')).not.toHaveAttribute('data-course-painting','');expect(await saved()).toEqual(original);
 }finally{await s.context.close();}
});
