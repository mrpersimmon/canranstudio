'use strict';
const {test,expect}=require('@playwright/test'),fs=require('fs'),crypto=require('crypto');
const {adminLogin,createStudent,studentLogin}=require('./helpers'),flow=require('../support/unit34-v154');
const {courseResponse}=require('../support/course-response-faults');
const {imageHash}=require('../support/home-banners-1730');
const pixels=locator=>locator.evaluate(async im=>{await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',ctx.getImageData(0,0,c.width,c.height).data)),v=>v.toString(16).padStart(2,'0')).join('');});
test.use({browserName:process.env.UNIT34_REVIEW_BROWSER||'chromium',actionTimeout:10000});
test('账号首页四宽、真实素材失败重试、原选择续做和权限边界',async({page,browser},info)=>{
 test.setTimeout(150000);const base=process.env.AWARD_TEST_BASE||'/lesson/';await adminLogin(page,base);const account=await createStudent(page,'雨伞入口验收','小伞',[/Lesson 3–4/]);const student=await studentLogin(browser,account,base,{serviceWorkers:'block'}),p=student.page,resource=base+'resources/*/visitor-v154.webp';
 try{
  const home=p.locator('[data-unit="unit3-4"]'),sha=crypto.createHash('sha256').update(fs.readFileSync('assets/awards/unit3-4-umbrella.webp')).digest('hex'),reference=await pixels(home.locator('.featured-art img'));
  for(const width of [320,390,768,1280]){await p.setViewportSize({width,height:900});await expect(home.locator('.featured-art img')).toHaveCount(1);expect(await imageHash(home.locator('.featured-art img'))).toBe(sha);expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);await home.screenshot({path:info.outputPath('home-'+width+'.png')});}
  let failures=0;p.on('response',r=>{if(/\/resources\/[^/]+\/visitor-v154.webp/.test(r.url())&&r.status()===503)failures++;});await courseResponse(page,resource,{status:503});await home.locator('.primary-button').click();await expect(p.locator('#courseLoadingRetry')).toBeVisible({timeout:30000});expect(failures).toBeGreaterThan(0);await expect(p.locator('#lessonWorkspace')).toBeHidden();await p.screenshot({path:info.outputPath('actual-503.png')});
  await courseResponse(page,resource,null);await p.locator('#courseLoadingRetry').click();await flow.ready(p);expect(await pixels(p.locator('#cover .unit-cover-art img'))).toBe(reference);expect(await pixels(p.locator('.stage-certificate .story-award-illustration'))).toBe(reference);await expect(p.locator('.legacy-learning')).toHaveCount(0);
  await p.goto(base+'unit3-4/#learn/reply');await flow.ready(p);const room=p.locator('.stage-reply');await room.getByRole('button',{name:'This is not my coat.',exact:true}).click();await p.reload();await flow.ready(p);await expect(room.getByRole('button',{name:'This is not my coat.',exact:true})).toHaveAttribute('aria-pressed','true');
  await p.getByRole('link',{name:'我的课程',exact:true}).click();await p.reload();await home.locator('.primary-button').click();await flow.ready(p);await expect(room.getByRole('button',{name:'This is not my coat.',exact:true})).toHaveAttribute('aria-pressed','true');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
  await flow.activity(p,'manners',{base:base.slice(0,-1),capture:async(section,i,state)=>{if(i===3&&state==='blank'){for(const who of ['visitor','attendant'])expect(await pixels(section.locator('.counter-'+who+'>img'))).toBe(await pixels(p.locator('.stage-text .dialogue-'+who+'>img')));await section.screenshot({path:info.outputPath('packaged-actors.png')});}}});
  await p.goto(base+'unit5-6/');await expect(p.getByRole('heading',{name:'这节课还没向你的班级开放',exact:true})).toBeVisible();info.annotations.push({type:'actual-503',description:String(failures)});
 }finally{await courseResponse(page,resource,null);await student.context.close();}
});
// The original account/statistics cases remain in unit3-4-grammar.spec.js and
// are discovered separately, including when CI divides the complete suite.
