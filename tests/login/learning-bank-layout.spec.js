'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseReadyForAssertions}=require('../support/completion-layout');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {inspectLearningLayout}=require('../support/learning-layout-audit');
const flow=require('../support/unit56-v154');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const scenarios=[
 {name:'窗口缩放',options:{viewport:{width:375,height:667},hasTouch:true,isMobile:false},sizes:[...devices.map(d=>d.viewport),{width:320,height:568}]},
 {name:'固定320手机压力',options:{...contextOptions(devices[0]),viewport:{width:320,height:568},screen:{width:320,height:568}},sizes:[{width:320,height:568}]}
];
for(const scenario of scenarios)test(`长词块连续出现时仍完整可选，分列不重排词块或学习记录：${scenario.name}`,async({page,browser},info)=>{
 test.setTimeout(150000);await adminLogin(page,base);const a=await createStudent(page,'合法词块排列-'+scenario.name,'小禾',[/Lesson 5–6 /]),s=await studentLogin(browser,a,base,scenario.options),p=s.page;
 const order=['a French student.','a Swedish student.',"She's","isn't",'She'];
 try{
  await p.goto(base+'unit5-6/#learn/exam');await courseReadyForAssertions(p);
  await flow.activity(p,'exam',{base:base.slice(0,-1),navigate:false,capture:async(room,index,phase)=>{
   if(index===8&&phase==='correct'){
    // Control only the next legal Fisher-Yates shuffle. No answer, grade,
    // question or persisted progress is injected into the exercise.
    await p.evaluate(wanted=>{
     const tokens=CanranCore.learningContext.questions.exam[9].tokens,values=tokens.map((_,i)=>i),target=wanted.map(t=>tokens.indexOf(t));
     if(target.some(i=>i<0))throw Error('The expected teaching tokens changed');
     const draws=[];for(let i=values.length-1;i>0;i--){const j=values.indexOf(target[i]);draws.push((j+.5)/(i+1));[values[i],values[j]]=[values[j],values[i]];}
     const original=Math.random;let n=0;Math.random=()=>{const value=draws[n++];if(n===draws.length)Math.random=original;return value;};
    },order);
   }
   if(index!==9||phase!=='blank')return;
   const bank=room.locator('.wordbank');await expect(bank.locator('button')).toHaveCount(5);
   expect(await bank.locator('button').evaluateAll(items=>items.map(b=>b.getAttribute('aria-label')))).toEqual(order);
   for(const viewport of scenario.sizes){
    await p.setViewportSize(viewport);await expect(p.locator('body')).toHaveAttribute('data-practice-viewport',viewport.width+'x'+viewport.height);
    const bounds=await room.locator('.practice-content').boundingBox();
    for(const button of await bank.locator('button').all()){
     const r=await button.boundingBox();expect(r.width).toBeGreaterThanOrEqual(44);expect(r.height).toBeGreaterThanOrEqual(44);
     // Match the full-question check's 1 CSS px boundary tolerance. An exact
     // IntersectionObserver ratio of 1 quantizes fractional pixels in WebKit.
     expect(r.x).toBeGreaterThanOrEqual(Math.max(0,bounds.x)-1);expect(r.y).toBeGreaterThanOrEqual(Math.max(0,bounds.y)-1);
     expect(r.x+r.width).toBeLessThanOrEqual(Math.min(viewport.width,bounds.x+bounds.width)+1);expect(r.y+r.height).toBeLessThanOrEqual(Math.min(viewport.height,bounds.y+bounds.height)+1);
    }
    expect(await room.evaluate(inspectLearningLayout)).toEqual([]);expect(await bank.locator('button').evaluateAll(items=>items.map(b=>b.getAttribute('aria-label')))).toEqual(order);
    if(viewport.width===320)await p.screenshot({path:info.outputPath('compact-bank-320.png'),scale:'css'});
   }
  }});
  await expect(p.locator('#starCount')).toHaveText('1');
 }finally{
  if(info.status!==info.expectedStatus){
   await require('node:fs/promises').writeFile(info.outputPath('viewport-diagnostic.json'),JSON.stringify(await p.evaluate(()=>({inner:[innerWidth,innerHeight],visual:visualViewport&&{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale},screen:[screen.width,screen.height],document:[document.documentElement.clientWidth,document.documentElement.scrollWidth],active:document.activeElement?.outerHTML,wide:[...document.body.querySelectorAll('*')].filter(el=>el.getBoundingClientRect().width>320&&el.getClientRects().length).slice(-30).map(el=>({tag:el.tagName,class:el.className,width:el.getBoundingClientRect().width,scroll:el.scrollWidth,min:getComputedStyle(el).minWidth,visibility:getComputedStyle(el).visibility}))})),null,2));
   await p.screenshot({path:info.outputPath('viewport-failure.png'),scale:'css'});
  }
  await s.context.close();
 }
});
