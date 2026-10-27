'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, studentLogin: loginStudent } = require('./helpers');
// Student windows are fresh contexts: carry mobile settings into them too.
const {defaultBrowserType,...mobileProfile}=require('@playwright/test').devices['iPhone 13'];
const studentLogin=(browser,account,base)=>loginStudent(browser,account,base,process.env.UNIT4142_BROWSER==='webkit'?mobileProfile:{});
const { activity, story } = require('../support/unit4142-v153');
const {courseResponse}=require('../support/course-response-faults');
// Wait for real course readiness before examining content. Windows WebKit can
// spend more than five seconds preparing the complete protected package.
async function ready(page){const start=Date.now();await expect(page.locator('#wordPageProgress')).toBeVisible({timeout:30000});test.info().annotations.push({type:'course-ready',description:String(Date.now()-start)+'ms after navigation'});}

test.afterEach(async({request})=>{await request.post('/__test__/course-responses',{data:{reset:true}});});
test.use({actionTimeout:10000,...(process.env.UNIT4142_BROWSER==='webkit'?{...require('@playwright/test').devices['iPhone 13'],browserName:'webkit'}:{})});

test('课程入口保持班级授权：新课可单独开放', async ({ page, browser }) => {
  const base = process.env.AWARD_TEST_BASE || '/lesson/';
  await adminLogin(page, base);
  const account = await createStudent(page, '线索验收班', '小芽', [/Lesson 41–42/]);
  const learner = await studentLogin(browser, account, base);
  try {
    await expect(learner.page.locator('.course')).toHaveCount(1);
    await expect(learner.page.locator('.course')).toContainText('购物袋里的发现');
    await learner.page.locator('.course').getByRole('link', { name: /开始学习/ }).click();
    await expect(learner.page).toHaveURL(/unit41-42\/#learn\/words/);await ready(learner.page);
    await expect(learner.page.locator('.unit-word')).toHaveCount(6);
  } finally { await learner.context.close(); }
});

test('未开放本课的班级看不到入口，直接链接也不能进入',async({page,browser})=>{
  const base=process.env.AWARD_TEST_BASE||'/lesson/';
  await adminLogin(page,base);
  const account=await createStudent(page,'只开放旧课班','小叶',[/Lesson 3–4/]);
  const learner=await studentLogin(browser,account,base);
  try{
    await expect(learner.page.locator('.course')).not.toContainText('购物袋里的发现');
    await learner.page.goto(base+'unit41-42/#learn/words');
    await expect(learner.page.locator('.unit-word')).toHaveCount(0);
    await expect(learner.page.getByText('这节课还没向你的班级开放',{exact:true})).toBeVisible();
  }finally{await learner.context.close();}
});

test('真实账号全流程：五颗星同步、纪念册放大、GIF、跨设备与离线恢复',async({page,browser,browserName},info)=>{
  test.setTimeout(240000);
  const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  await adminLogin(page,base);
  const account=await createStudent(page,'线索完整验收班','小禾',[/Lesson 41–42/]);
  const first=await studentLogin(browser,account,base);let second;
  const errors=[],voices=[];
  first.page.on('pageerror',e=>errors.push(e.message));
  first.page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
  try{
    const learner=first.page;
    await learner.addInitScript(()=>{
      window.unit4142Frames={interruptions:[],flights:[]};
      const observe=()=>{
        const modal=document.querySelector('dialog.award-reveal[open]');
        if(modal){
          const loader=document.querySelector('#courseLoader');
          const missing=[...modal.querySelectorAll('img')].some(img=>img.getClientRects().length&&(!img.complete||!img.naturalWidth));
          const playing=[...document.querySelectorAll('.completion-card')].some(el=>el.dataset.resultMotion==='playing');
          if(missing||playing||(loader&&loader.getBoundingClientRect().width>0)||getComputedStyle(modal).visibility!=='visible')window.unit4142Frames.interruptions.push({missing,playing});
          const star=modal.querySelector('.travelling-star');
          if(star){const b=star.getBoundingClientRect(),key=Math.round(b.x)+','+Math.round(b.y);if(!window.unit4142Frames.flights.includes(key))window.unit4142Frames.flights.push(key);}
        }
        requestAnimationFrame(observe);
      };requestAnimationFrame(observe);
    });
    await story(learner,prefix);
    let count=0;
    for(const id of ['listen','roles','grammar','apply','exam']){
      const room=await activity(learner,id,{base:prefix,keepAward:true});
      const modal=learner.getByRole('dialog',{name:/纪念卡结算/});
      await expect(modal.getByRole('group',{name:`已获得 ${++count} / 5 颗星`,exact:true})).toBeVisible();
      await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','pending');
      await expect.poll(()=>learner.evaluate(()=>window.unit4142Frames.flights.length)).toBeGreaterThan(3);
      await require('../support/reward-dialog').waitForRewardDismissal(learner);
      await modal.press('Escape');
      await room.locator('.completion-stats').scrollIntoViewIfNeeded();
      await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
      expect(await learner.evaluate(()=>window.unit4142Frames.interruptions)).toEqual([]);
    }
    await expect(learner.locator('#starCount')).toHaveText('5');
    await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await learner.goto(base+'unit41-42/#learn/certificate');await ready(learner);
    await expect(learner.locator('#certificateName')).toHaveText('小禾');
    // This existing edition is the original certificate: preserve its original
    // Round 400 typography as well as its art, date and GIF. New classroom text
    // uses the current Gothic/Nunito scheme; no shared font policy is weakened.
    expect(await learner.locator('#certificateName').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Round');
    expect(await learner.locator('#certificateName').evaluate(e=>getComputedStyle(e).fontWeight)).toBe('400');
    const date=await learner.locator('#certificateDate').textContent();
    await learner.locator('.stage-certificate').screenshot({path:info.outputPath('five-star-card.png')});
    await learner.getByRole('link',{name:'我的纪念册',exact:true}).click();
    const card=learner.getByRole('button',{name:'放大 Lesson 41–42 购物袋小管家',exact:true});
    await expect(card.locator('.certificate')).toHaveAttribute('data-stars','5',{timeout:30000});
    await card.click();
    const modal=learner.getByRole('dialog',{name:'Lesson 41–42 纪念卡'});
    await expect(modal).toContainText('小禾');
    expect(await modal.locator('.card-name').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Book');
    await modal.screenshot({path:info.outputPath('book-card-closeup.png')});
    await learner.getByRole('button',{name:'关闭纪念卡',exact:true}).click();
    second=await studentLogin(browser,account,base);
    await expect(second.page.locator('.course')).toContainText('5 / 5');
    await second.page.goto(base+'unit41-42/#learn/certificate');await ready(second.page);
    await expect(second.page.locator('#certificateDate')).toHaveText(date);
    const download=second.page.waitForEvent('download');
    await second.page.getByRole('button',{name:'保存动图',exact:true}).click();
    const gif=await download;
    const file=await gif.path();const bytes=require('node:fs').readFileSync(file);
    expect(bytes.subarray(0,6).toString()).toBe('GIF89a');expect(bytes.length).toBeGreaterThan(10000);
    const output=info.outputPath('keepsake.gif');await gif.saveAs(output);
    const sharp=require('sharp'),metadata=await sharp(output,{animated:true}).metadata();
    expect(metadata.pages).toBe(60);expect(metadata.loop).toBe(0);
    expect(metadata.width).toBe(984);expect(metadata.pageHeight).toBe(528);
    const crop=(frame,rect)=>sharp(output,{page:frame}).extract(rect).raw().toBuffer();
    const lights={left:40,top:330,width:400,height:100},title={left:55,top:150,width:360,height:55};
    expect((await crop(0,lights)).equals(await crop(15,lights))).toBe(false);
    expect((await crop(0,title)).equals(await crop(15,title))).toBe(true);
    for(const region of [{left:55,top:255,width:350,height:78},{left:510,top:180,width:425,height:290}])expect((await crop(0,region)).equals(await crop(15,region))).toBe(true);
    await sharp(output,{page:15}).png().toFile(info.outputPath('keepsake-frame-15.png'));
    for(const width of [320,390]){
      await second.page.setViewportSize({width,height:844});
      await second.page.locator('.stage-certificate').scrollIntoViewIfNeeded();
      await second.page.locator('.stage-certificate').screenshot({path:info.outputPath(`card-${width}.png`)});
    }
    await second.page.setViewportSize({width:1280,height:900});
    await second.page.goto(base+'unit41-42/#learn/grammar');await ready(second.page);
    await expect(second.page.locator('.stage-grammar .completion-number')).toHaveText(['14','14','0']);
    await second.page.locator('.stage-grammar').getByRole('button',{name:'再练一轮',exact:true}).click();
    await second.context.setOffline(true);
    await require('../support/unit4142-v153').select(second.page.locator('.stage-grammar'),{fills:['is','is']});
    await second.page.locator('.stage-grammar').getByRole('button',{name:'检查答案',exact:true}).click();
    await second.page.locator('.stage-grammar').getByRole('button',{name:'下一题',exact:true}).click();
    let navigationFailed=false;
    try{await second.page.reload({timeout:12000});}catch(error){
      if(browserName!=='webkit'||!/WebKit encountered an internal error/.test(error.message))throw error;
      navigationFailed=true;info.annotations.push({type:'engine-boundary',description:'WebKit offline navigation rejected before app fallback; reconnect and record recovery checked separately.'});
    }
    if(navigationFailed){await second.context.setOffline(false);await second.page.goto(base+'unit41-42/#learn/grammar');await ready(second.page);}
    else{await expect(second.page.getByRole('heading',{name:'联网后再进入',exact:true})).toBeVisible();await second.context.setOffline(false);await second.page.getByRole('button',{name:'再试一次',exact:true}).click();}
    await expect(second.page.locator('.stage-grammar .progress-copy')).toHaveText('第 2 / 14 题');
    await expect(second.page.locator('#starCount')).toHaveText('5');
    expect(await second.page.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
    expect(errors).toEqual([]);expect(voices).toEqual([]);
  }finally{await first.context.close();await second?.context.close();}
});


test('缺图先拦截，恢复后完整进入；复访复用素材并恢复词卡页',async({page,browser})=>{
  test.setTimeout(60000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
  await adminLogin(page,base);const account=await createStudent(page,'线索加载验收班','小林',[/Lesson 41–42/]);
  const student=await studentLogin(browser,account,base);const p=student.page;
  try{
    // Fail this unit's independent stage asset, not a duplicated vocabulary icon.
    const pattern=base+'resources/*/cast-penny-bag-v153.webp';
    const missing=[];p.on('response',r=>{if(r.url().includes('/resources/')&&r.url().endsWith('/cast-penny-bag-v153.webp')&&r.status()===404)missing.push(r.url());});
    await courseResponse(p,pattern,{status:404,body:'missing illustration'});
    await p.goto(base+'unit41-42/#learn/words');
    const loader=p.getByRole('region',{name:'课程加载',exact:true});
    await expect(loader.getByRole('button',{name:'再试一次',exact:true})).toBeVisible({timeout:20000});
    expect(missing.length).toBeGreaterThan(0);
    await expect(p.locator('.unit-word')).toHaveCount(0);
    await courseResponse(p,pattern);await loader.getByRole('button',{name:'再试一次',exact:true}).click();
    await expect(p.locator('.unit-word')).toHaveCount(6,{timeout:30000});await expect(p.locator('#courseLoader')).toHaveCount(0);
    expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
    await p.getByRole('button',{name:'下一组词卡',exact:true}).click();await expect(p.locator('#wordPageProgress')).toHaveText('2 / 4');
    await p.getByRole('link',{name:'我的课程',exact:true}).click();
    const downloads=[];p.on('request',r=>{if(r.url().includes('/resources/'))downloads.push(r.url());});
    await p.locator('.course').getByRole('link',{name:/学习/}).click();await ready(p);
    await expect(p.locator('#wordPageProgress')).toHaveText('2 / 4');
    expect(downloads).toEqual([]);
    expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  }finally{await student.context.close();}
});

test('同姓名同星数对照认可卡：新卡、书页和一星动图显示一致',async({page,browser},info)=>{
  test.setTimeout(240000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  await adminLogin(page,base);const account=await createStudent(page,'线索视觉对照班','小禾',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 5–6/,/Lesson 41–42/]);
  const student=await studentLogin(browser,account,base),p=student.page;
  try{
    await p.goto(base+'unit41-42/#learn/certificate');await ready(p);
    await expect(p.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled({timeout:30000});
    for(const pair of ['1-2','3-4','5-6','41-42']){
      if(pair==='41-42')await activity(p,'listen',{base:prefix});
      else if(pair==='1-2')await require('../support/unit1-2-award-flow').finishZone(p,'listen',{base:base+'unit1-2/'});
      else await require('../support/units1-30-tasks').activity(p,pair,'listen',{base:prefix});
      await p.goto(base+'unit'+pair+'/#learn/certificate');await ready(p);
      await expect(p.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','1');
      await expect(p.locator('#certificateName')).toHaveText('小禾');
      await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('compare-'+pair+'.png')});
    }
    const card=p.locator('.stage-certificate .story-award-paper');
    const shine=card.locator('.award-star[data-earned="true"] .star-glint');
    const changes=await shine.evaluate(async el=>{
      const frames=new Set(),start=performance.now();
      while(performance.now()-start<5000&&frames.size<5){frames.add(getComputedStyle(el).opacity);await new Promise(requestAnimationFrame);}
      return frames.size;
    });expect(changes).toBeGreaterThan(3);
    const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();
    const gif=await download,file=info.outputPath('one-star.gif');await gif.saveAs(file);
    const sharp=require('sharp'),meta=await sharp(file,{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.loop).toBe(0);
    const area={left:40,top:330,width:400,height:100};
    expect((await sharp(file,{page:0}).extract(area).raw().toBuffer()).equals(await sharp(file,{page:15}).extract(area).raw().toBuffer())).toBe(false);
    await sharp(file,{page:15}).png().toFile(info.outputPath('one-star-frame.png'));
    await p.getByRole('link',{name:'我的纪念册',exact:true}).click();
    await p.getByRole('button',{name:'目录',exact:true}).click();
    await p.getByRole('button',{name:/Lesson 41–42/}).click();
    const cover=p.getByRole('button',{name:'放大 Lesson 41–42 购物袋小管家',exact:true});
    await expect(cover.locator('.certificate')).toHaveAttribute('data-stars','1');
    await p.locator('.book').screenshot({path:info.outputPath('comparison-book.png')});
    await cover.click();await p.getByRole('dialog',{name:'Lesson 41–42 纪念卡'}).screenshot({path:info.outputPath('one-star-book-closeup.png')});
  }finally{await student.context.close();}
});

test('长姓名手机卡、另一学生隔离、教师预览不能保存个人成果',async({page,browser},info)=>{
 test.setTimeout(70000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
 await adminLogin(page,base);const account=await createStudent(page,'线索身份边界班','欧阳小禾同学',[/Lesson 41–42/]);
 const preview=await page.getByRole('link',{name:'预览这个班',exact:true}).getAttribute('href');
 const first=await studentLogin(browser,account,base);let other;
 try{
  await activity(first.page,'listen',{base:prefix,keepAward:true});
  const reveal=first.page.getByRole('dialog',{name:/纪念卡结算/});await expect(reveal.getByRole('group',{name:'已获得 1 / 5 颗星',exact:true})).toBeVisible();await expect(reveal).not.toHaveAttribute('data-dismissible', 'false'); await reveal.press('Escape');await expect(reveal).toBeHidden();
  await first.page.setViewportSize({width:320,height:568});await first.page.goto(base+'unit41-42/#learn/certificate');await ready(first.page);
  await expect(first.page.locator('#certificateName')).toHaveText('欧阳小禾同学');
  const card=first.page.locator('.stage-certificate .story-award-paper'),name=first.page.locator('#certificateName');
  await expect(card).toHaveAttribute('data-stars','1');
  const b=await card.boundingBox(),n=await name.boundingBox();expect(n.x).toBeGreaterThan(b.x);expect(n.x+n.width).toBeLessThan(b.x+b.width);expect(n.y+n.height).toBeLessThan(b.y+b.height);
  expect(await name.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollHeight<=el.clientHeight+1)).toBe(true);await card.screenshot({path:info.outputPath('long-name-320.png')});
  const second=await require('./helpers').addStudent(page,'小竹');other=await studentLogin(browser,second,base);await other.page.goto(base+'unit41-42/#learn/certificate');await ready(other.page);await expect(other.page.locator('#starCount')).toHaveText('0');await expect(other.page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  await page.goto(preview);await page.getByRole('link',{name:/购物袋里的发现/}).click();await page.goto((await page.url()).replace(/#.*$/,'#learn/certificate'));await ready(page);
  await expect(page.locator('#starCount')).toHaveText('0');await expect(page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
 }finally{await first.context.close();await other?.context.close();}
});

test('关课重开保留收藏，导出故障可重试且离开取消下载',async({page,browser},info)=>{
 test.setTimeout(150000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
 const {saveCourses}=require('./helpers');await adminLogin(page,base);const account=await createStudent(page,'消息成果保留班','小溪',[/Lesson 41–42/]);
 const student=await studentLogin(browser,account,base),p=student.page,downloads=[];p.on('download',d=>downloads.push(d));
 try{
  await activity(p,'listen',{base:prefix});await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await page.getByRole('checkbox',{name:/Lesson 41–42/}).uncheck();await saveCourses(page);
  await p.goto(base);await expect(p.locator('.course')).toHaveCount(0);
  await p.getByRole('link',{name:'我的纪念册',exact:true}).click();const oldCard=p.getByRole('button',{name:'放大 Lesson 41–42 购物袋小管家',exact:true});
  await expect(oldCard.locator('.certificate')).toHaveAttribute('data-stars','1',{timeout:30000});await oldCard.screenshot({path:info.outputPath('closed-course-collection.png')});
  await page.getByRole('checkbox',{name:/Lesson 41–42/}).check();await saveCourses(page);
  await p.goto(base+'unit41-42/#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('#certificateName')).toHaveText('小溪');
  // Inject a failure at the browser canvas boundary, not in learning or award data.
  await p.evaluate(()=>{window.originalGifRead=CanvasRenderingContext2D.prototype.getImageData;window.failedGifReads=0;CanvasRenderingContext2D.prototype.getImageData=function(...args){if(this.canvas.width===984&&this.canvas.height===528){window.failedGifReads++;throw new DOMException('Simulated export canvas failure','InvalidStateError');}return Reflect.apply(window.originalGifRead,this,args);};});
  await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('暂时没能保存，请再试一次。');expect(await p.evaluate(()=>window.failedGifReads)).toBeGreaterThan(0);expect(downloads).toHaveLength(0);
  await p.evaluate(()=>{CanvasRenderingContext2D.prototype.getImageData=window.originalGifRead;});const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();const gif=await download;await gif.saveAs(info.outputPath('export-recovered.gif'));
  const meta=await require('sharp')(info.outputPath('export-recovered.gif'),{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.width).toBe(984);expect(meta.pageHeight).toBe(528);await expect(p.locator('.story-award-status')).toHaveText('动图已生成');expect(downloads).toHaveLength(1);
  await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('正在保存…');await p.getByRole('link',{name:'我的课程',exact:true}).click();await expect(p.locator('.course')).toHaveCount(1);await expect(p.locator('.course')).toContainText('1 / 5');expect(downloads).toHaveLength(1);
  await p.goto(base+'unit41-42/#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('.story-award-status')).toBeEmpty();expect(downloads).toHaveLength(1);
 }finally{await student.context.close();}
});
