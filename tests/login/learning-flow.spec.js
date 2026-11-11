'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseReadyForAssertions}=require('../support/completion-layout');
const flow=require('../support/thirteen-types-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:8000});
async function header(p){
 const size=await p.evaluate(()=>({old:document.querySelector('#topbar').getBoundingClientRect().height,current:document.querySelector('.practice-screen-toolbar').getBoundingClientRect().height,icons:[...document.querySelectorAll('.practice-screen-toolbar img')].filter(img=>img.complete&&img.naturalWidth>0).length}));
 expect(size.old).toBe(0);expect(size.current).toBeCloseTo(48,0);expect(size.icons).toBe(2);
}
test('Lesson1–2课文、答题、得星结算和返回保持同一导航与操作位置',async({page,browser},info)=>{
 test.setTimeout(120000);await adminLogin(page,base);const a=await createStudent(page,'学习流程打磨','小禾',[/Lesson 1–2 /]),s=await studentLogin(browser,a,base,{viewport:{width:375,height:667},hasTouch:true}),p=s.page;
 try{
  await p.addInitScript(()=>{window.learningFrames=[];const frame=()=>{if(document.body?.hasAttribute('data-learning-shell')&&!document.querySelector('#courseLoader')&&window.learningFrames.length<1600){const nav=document.querySelector('.practice-screen-toolbar'),panel=document.querySelector('[data-learning-motion="entering"]');window.learningFrames.push({view:document.body.dataset.learningView,height:nav?.getBoundingClientRect().height,legacy:document.querySelector('#topbar')?.getBoundingClientRect().height,moving:!!panel,opacity:panel?Number(getComputedStyle(panel).opacity):1});}requestAnimationFrame(frame);};requestAnimationFrame(frame);});
  await p.goto(base+'unit1-2/#learn/text');await courseReadyForAssertions(p);await header(p);
  const story=p.locator('.stage-text');await p.screenshot({path:info.outputPath('story-start-375.png')});
  for(const[width,height]of [[320,568],[667,375],[375,667]]){await p.setViewportSize({width,height});await header(p);await expect(story.getByRole('button',{name:'开始故事',exact:true})).toBeInViewport({ratio:1});expect(await story.locator('.dialogue-actor>img:not(.dialogue-handbag)').evaluateAll(images=>images.every(image=>{const b=image.getBoundingClientRect(),s=image.closest('.dialogue-stage').getBoundingClientRect();return b.top>=s.top&&b.bottom<=s.bottom&&b.left>=s.left&&b.right<=s.right;}))).toBe(true);}
  await story.getByRole('button',{name:'开始故事',exact:true}).click();await story.getByRole('button',{name:'看中文',exact:true}).click();await expect(story.locator('.bcn')).toBeInViewport({ratio:1});await header(p);await story.getByRole('button',{name:'收起中文',exact:true}).click();for(let i=1;i<7;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();
  await p.screenshot({path:info.outputPath('last-dialogue-375.png')});
  const dialogueGeometry=await story.locator('.dialogue-log').evaluate(el=>({height:el.clientHeight,scroll:el.scrollTop,total:el.scrollHeight,box:el.getBoundingClientRect().toJSON(),last:el.lastElementChild.getBoundingClientRect().toJSON(),behavior:getComputedStyle(el).scrollBehavior,parents:[el.parentElement,el.closest('.learning-surface'),document.body,document.documentElement,...document.querySelectorAll('.stage-text>.stage-ctrl,.stage-text>.stage-ctrl .btn')].map(x=>({name:x.className,rect:x.getBoundingClientRect().toJSON(),scrollLeft:x.scrollLeft,width:x.clientWidth,total:x.scrollWidth,display:getComputedStyle(x).display,minWidth:getComputedStyle(x).minWidth,flex:getComputedStyle(x).flex}))}));
  await info.attach('dialogue-geometry',{body:JSON.stringify(dialogueGeometry),contentType:'application/json'});
  await expect(story.locator('.bubble-row').last()).toBeInViewport({ratio:1});
  expect(await story.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollLeft===0)).toBe(true);
  await expect(story.locator('.bubble-row')).toHaveCount(7);await header(p);
  const onward=story.getByRole('button',{name:'去练习',exact:true});await expect(onward).toBeInViewport({ratio:1});const initial=await onward.boundingBox(),y=initial.y+initial.height;
  await p.screenshot({path:info.outputPath('story-end-375.png')});await onward.click();await expect(p).toHaveURL(/#learn\/roles$/);await header(p);
  const room=p.locator('.stage-roles');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeInViewport({ratio:1});
  await flow.activity(p,'1-2','roles',{base:base.slice(0,-1),navigate:false,keepAward:true});
  const reveal=p.getByRole('dialog',{name:/纪念卡结算/});await expect(reveal).toHaveAttribute('data-dismissible','true');await header(p);await reveal.press('Escape');
  await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await header(p);expect(await room.evaluate(el=>el.contains(document.activeElement))).toBe(true);
  const next=room.getByRole('button',{name:'下一站：语法小工坊',exact:true});await expect(next).toBeInViewport({ratio:1});const resultButton=await next.boundingBox();expect(Math.abs(resultButton.y+resultButton.height-y)).toBeLessThanOrEqual(2);
  await p.screenshot({path:info.outputPath('result-375.png')});const before=(await(await p.request.get(base+'api/awards')).json()).cards;
  await next.click();await expect(p).toHaveURL(/#learn\/trans$/);await header(p);await p.screenshot({path:info.outputPath('grammar-375.png')});
  await p.goBack();await expect(next).toBeVisible();await header(p);expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual(before);
  const frames=await p.evaluate(()=>window.learningFrames);expect(frames.length).toBeGreaterThan(20);expect(frames.every(x=>x.height===48&&x.legacy===0)).toBe(true);expect(new Set(frames.filter(x=>x.moving&&x.opacity<1).map(x=>x.opacity)).size).toBeGreaterThan(1);
  for(const[width,height]of [[320,568],[768,1024],[1366,768]]){await p.setViewportSize({width,height});await header(p);await expect(next).toBeInViewport({ratio:1});await expect(room.getByRole('list',{name:'本轮成果'})).toBeInViewport({ratio:1});}
  await p.setViewportSize({width:375,height:667});await room.getByRole('button',{name:'再练一轮',exact:true}).click();await expect(room.locator('.progress-copy')).toHaveText('第 1 / 5 题');await header(p);await expect(p.locator('#starCount')).toHaveText('1');expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual(before);
 }finally{await s.context.close();}
});

test('减少动态时保留稳定页面，下一题和返回不改变已选答案',async({page,browser},info)=>{
 test.setTimeout(90000);await adminLogin(page,base);const a=await createStudent(page,'减弱过渡验收','小禾',[/Lesson 1–2 /]),s=await studentLogin(browser,a,base,{viewport:{width:375,height:667},hasTouch:true,reducedMotion:'reduce'}),p=s.page;
 try{
  await p.goto(base+'unit1-2/#learn/trans');await courseReadyForAssertions(p);await header(p);
  const room=p.locator('.stage-trans'),choice=room.getByRole('button',{name:'This is your book.',exact:true});await choice.click();
  const before=await p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1')));await p.locator('.learning-milestones').getByRole('link',{name:'故事',exact:true}).click();await header(p);await p.goBack();await expect(choice).toHaveAttribute('aria-pressed','true');
  const after=await p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1')));expect(after.groups).toEqual(before.groups);expect(after.records).toEqual(before.records);
  expect(await p.locator('.learning-surface').evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity&&a.playState==='running').length)).toBe(0);
  await p.screenshot({path:info.outputPath('reduced-motion-selected.png')});
 }finally{await s.context.close();}
});

test('词卡、原纪念卡和练习纸仍可用，阅读页面沿用同一导航',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);const a=await createStudent(page,'阅读入口打磨','小禾',[/Lesson 1–2 /]),s=await studentLogin(browser,a,base,{viewport:{width:375,height:667},hasTouch:true}),p=s.page;
 try{
  await p.goto(base+'unit1-2/#learn/words');await courseReadyForAssertions(p);await header(p);await p.getByRole('button',{name:'下一组',exact:true}).click();await expect(p.locator('#wordPageProgress')).toHaveText('2 / 4');expect(await p.locator('.stage-words').evaluate(el=>el.scrollTop)).toBe(0);
  await p.goto(base+'unit1-2/#learn/certificate');await courseReadyForAssertions(p);await header(p);
  const card=p.locator('.stage-certificate .story-award-paper');await expect(card).toBeVisible();expect(await card.evaluate(el=>{const r=el.getBoundingClientRect();return Math.abs(r.width/r.height-1640/880);})).toBeLessThan(.003);await expect(p.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  await p.locator('#unitWriting summary').click();await p.evaluate(()=>{window.print=()=>{};});await p.getByRole('button',{name:'打印练习纸',exact:true}).click();await p.emulateMedia({media:'print'});
  await expect(p.locator('#unitWriting .writing-lines li')).toHaveCount(7);expect(await p.locator('#unitWriting').evaluate(el=>{const surface=el.closest('.learning-surface');return getComputedStyle(surface).position==='static'&&surface.scrollHeight<=surface.clientHeight+1;})).toBe(true);
  await p.emulateMedia({media:'screen'});await p.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await header(p);
  expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual([]);
 }finally{await s.context.close();}
});
