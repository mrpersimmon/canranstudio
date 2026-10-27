'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,openCourseDirectory}=require('./helpers');
const {landmarks,referenceArtworkPixels}=require('../support/home-banners-1730');
const {courseResponse}=require('../support/course-response-faults');
const crypto=require('crypto'),fs=require('fs');
const pixels=locator=>locator.evaluate(async im=>{await im.decode();const canvas=document.createElement('canvas');canvas.width=im.naturalWidth;canvas.height=im.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(im,0,0);const bytes=ctx.getImageData(0,0,canvas.width,canvas.height).data;return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');});
test.use({actionTimeout:10000,browserName:process.env.UNIT12_REVIEW_BROWSER||'chromium'});
test('账号地图四宽与课内封面、纪念卡原图保护，图片故障命中后可重试续做',async({page,browser},info)=>{
 test.setTimeout(120000);const base=process.env.AWARD_TEST_BASE||'/lesson/';await adminLogin(page,base);const account=await createStudent(page,'首课入口验收','小禾',[/Lesson 1–2/]);
 const student=await studentLogin(browser,account,base,{serviceWorkers:'block'}),p=student.page;
 const sha=crypto.createHash('sha256').update(fs.readFileSync('assets/awards/unit1-2-handbag-closeup.webp')).digest('hex');
 try{
  const home=p.locator('[data-unit="unit1-2"]');
  const referencePixels=await referenceArtworkPixels(p,base+'assets/awards/unit1-2-handbag-closeup.webp',sha);
  await landmarks(p,base,info,undefined,['1-2']);await openCourseDirectory(p);
  let failed=0;p.on('response',r=>{if(/\/resources\/[^/]+\/man-v154.webp/.test(r.url())&&r.status()===503)failed++;});
  const resource=base+'resources/*/man-v154.webp';await courseResponse(page,resource,{status:503});
  await home.locator('.primary-button').click();await expect(p.locator('#courseLoadingRetry')).toBeVisible({timeout:30000});expect(failed).toBeGreaterThan(0);await expect(p.locator('#lessonWorkspace')).toBeHidden();
  await p.screenshot({path:info.outputPath('actual-asset-failure.png')});await courseResponse(page,resource,null);await p.locator('#courseLoadingRetry').click();await expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
  // Without a Worker, the loader displays blob images. Its restrictive CSP
  // does not allow fetch(blob:); compare the actual decoded pixels instead.
  expect(await pixels(p.locator('#cover .unit-cover-art img'))).toBe(referencePixels);expect(await pixels(p.locator('.stage-certificate .story-award-illustration'))).toBe(referencePixels);
  const ready=()=>expect(p.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:30000});
  await p.goto(base+'unit1-2/#learn/trans');await ready();const room=p.locator('.stage-trans');await room.getByRole('button',{name:'Is this your book?',exact:true}).click();await p.reload();await ready();await expect(room.getByRole('button',{name:'Is this your book?',exact:true})).toHaveAttribute('aria-pressed','true');
  await p.getByRole('link',{name:'我的课程',exact:true}).click();await p.reload();await openCourseDirectory(p);await home.locator('.primary-button').click();await ready();await expect(room.getByRole('button',{name:'Is this your book?',exact:true})).toHaveAttribute('aria-pressed','true');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
  await require('../support/thirteen-types-flow').activity(p,'1-2','manners',{base:base.slice(0,-1),capture:async(section,i,state)=>{
   if(i!==3||state!=='blank')return;
   for(const[who,label]of [['man','男士'],['woman','女士']])expect(await pixels(section.getByRole('button',{name:label,exact:true}).locator('img'))).toBe(await pixels(p.locator(`#unit12-dialogue .dialogue-actor[data-actor="${who}"]>img`)));
   await section.screenshot({path:info.outputPath('packaged-recipient-portraits.png')});
  }});
  await p.goto(base+'unit3-4/');await expect(p.getByRole('heading',{name:'这节课还没向你的班级开放',exact:true})).toBeVisible();
  info.annotations.push({type:'actual-503',description:String(failed)});
 }catch(error){await require('fs/promises').writeFile(info.outputPath('image-diagnostic.json'),JSON.stringify({error:String(error),images:await p.locator('#cover img,.stage-certificate .story-award-illustration').evaluateAll(images=>images.map(im=>({src:im.getAttribute('src'),current:im.currentSrc,width:im.naturalWidth,complete:im.complete})))}));throw error;}
 finally{await courseResponse(page,base+'resources/*/man-v154.webp',null);await student.context.close();}
});
// The full account flow remains independently discoverable in unit1-2-award.spec.js.
// Do not import another .spec file: full CI collection must register each test once.
