'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,waitForCourseReady}=require('./helpers');
const flow=require('../support/unit56-v154');
const {devices}=require('../support/required-phone-devices');
const base=process.env.AWARD_TEST_BASE||'/lesson/';

test('完成按钮只显示下一站，手机不拆行且仍进入正确关卡',async({page,browser},info)=>{
 test.setTimeout(90000);await adminLogin(page,base);const a=await createStudent(page,'下一站验收','卡片同学',[/Lesson 5–6/]),s=await studentLogin(browser,a,base,{viewport:{width:387,height:741}}),p=s.page;
 try{
  const room=await flow.activity(p,'listen',{base:base.slice(0,-1)}),next=room.getByRole('button',{name:'下一站：教室小剧场',exact:true});
  await expect(next).toHaveText('下一站');
  for(const width of [320,387,600,1280]){
   await p.setViewportSize({width,height:741});await next.scrollIntoViewIfNeeded();
   // Count actual text boxes: WebKit also returns the enclosing span box
   // when selectNodeContents(button) includes an inline child element.
   const metrics=await next.evaluate(el=>{const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),tops=[];let text;while((text=walker.nextNode())){if(!text.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(text);tops.push(...[...r.getClientRects()].filter(x=>x.width).map(x=>Math.round(x.top)));}return {lines:new Set(tops).size,width:el.clientWidth,content:el.scrollWidth};});
   expect(metrics.lines).toBe(1);expect(metrics.content).toBeLessThanOrEqual(metrics.width);
  }
  await p.setViewportSize({width:387,height:741});await p.screenshot({path:info.outputPath('completion-387.png')});const before=(await(await p.request.get(base+'api/awards')).json()).cards;await next.click();await expect(p).toHaveURL(/#learn\/text$/);await p.goBack();await expect(next).toBeVisible();expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual(before);
 }finally{await s.context.close();}
});

test('词卡保留24词与释义，汽车图使用绘本素材，窄屏展开不会挤动相邻卡片',async({page,browser},info)=>{
 test.setTimeout(150000);await adminLogin(page,base);const a=await createStudent(page,'词卡样板验收','卡片同学',[/Lesson 5–6/]),s=await studentLogin(browser,a,base,{viewport:{width:387,height:741},hasTouch:true}),p=s.page;
 try{
  await p.goto(base+'unit5-6/#learn/words');await flow.ready(p);const seen=[];
  for(const {width,height} of [{width:320,height:568},...devices.map(d=>d.viewport)]){
   await p.setViewportSize({width,height});
   if(width!==320)for(let n=0;n<3;n++)await p.getByRole('button',{name:'上一组词卡',exact:true}).click();
   for(let group=0;group<4;group++){
   await expect(p.locator('#wordPageProgress')).toHaveText((group+1)+' / 4');await expect(p.locator('.unit-word')).toHaveCount(6);
   if(width===320)seen.push(...await p.locator('.unit-word').evaluateAll(cards=>cards.map(c=>c.getAttribute('aria-label'))));
   for(const card of await p.locator('.unit-word').all()){
    const before=await card.boundingBox();await card.tap();await expect(card).toHaveAttribute('aria-expanded','true');await expect(card.locator('.word-meaning')).toBeVisible();await expect(card.locator('strong')).toBeVisible();await expect(card.locator('.word-phonetic')).toBeVisible();expect((await card.boundingBox()).height).toBeCloseTo(before.height,0);
    const geometry=await card.evaluate(el=>{const r=el.getBoundingClientRect();return {label:el.getAttribute('aria-label'),overflow:[...el.children].filter(c=>!c.hidden&&c.getClientRects().length).filter(c=>{const b=c.getBoundingClientRect();return b.bottom>r.bottom-2||b.left<r.left||b.right>r.right||c.scrollWidth>c.clientWidth+1;}).map(c=>c.className||c.tagName)};});
    expect(geometry.overflow,`${width}px ${geometry.label} 的词义/例句不可裁切`).toEqual([]);await card.tap();
   }
   if(group<3)await p.getByRole('button',{name:'下一组词卡',exact:true}).click();
   }
  }
  expect(seen).toHaveLength(24);expect(new Set(seen).size).toBe(24);await expect(p.getByRole('button',{name:'下一站：单词寻宝',exact:true})).toHaveText('下一站');
  expect((await p.request.get(base+'assets/unit5-6-word-cards/raw/volvo-v1.png')).status()).toBe(403);
  for(const width of [320,387,600,768,1280]){
   await p.setViewportSize({width,height:741});const cards=p.locator('.unit-word');
   await expect.poll(()=>cards.locator('.word-art img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
   expect(await cards.locator('.word-art img').evaluateAll(imgs=>imgs.every(img=>img.currentSrc.includes('unit5-6-word-cards')&&img.naturalWidth>=480))).toBe(true);
   expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await cards.first().scrollIntoViewIfNeeded();await p.screenshot({path:info.outputPath('cars-'+width+'.png')});
  }
  await p.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(p).toHaveURL(/#learn\/listen$/);
  expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual([]);
 }finally{await s.context.close();}
});

test('首课、中段和末课的末组词卡都用短下一站并保留原目的地',async({page,browser})=>{
 test.setTimeout(60000);await adminLogin(page,base);
 const account=await createStudent(page,'短按钮跨课回归','导航同学',[/Lesson 1–2 /,/Lesson 49–50 /,/Lesson 143–144 /]),s=await studentLogin(browser,account,base,{viewport:{width:320,height:568}}),p=s.page;
 try{
  for(const pair of ['1-2','49-50','143-144']){
   await p.goto(base+'unit'+pair+'/#learn/words');await waitForCourseReady(p);
   const total=Number((await p.locator('#wordPageProgress').innerText()).split('/')[1]);
   for(let group=1;group<total;group++)await p.getByRole('button',{name:/^下一组(?:词卡)?$/}).click();
   const next=p.getByRole('button',{name:/^下一站：/}).filter({visible:true}).first();
   await expect(next).toHaveText('下一站');await next.click();await expect(p).toHaveURL(/#learn\/listen$/);
  }
  expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual([]);
 }finally{await s.context.close();}
});
