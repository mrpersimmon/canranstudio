# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit11-12-fivezones.spec.js >> 课程入口保持班级授权：新课可单独开放
- Location: tests\login\unit11-12-fivezones.spec.js:16:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#wordPageProgress')
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('#wordPageProgress')

```

```yaml
- region "课程加载":
  - heading "失物招领小侦探" [level=1]
  - status "课程准备状态": 课程未能打开，再试一次。
  - progressbar "课程准备进度"
  - paragraph: 学习记录会保留。错误编号：L06
  - button "再试一次"
  - link "返回课程":
    - /url: /lesson/
```

# Test source

```ts
  1   | 'use strict';
  2   | const { test, expect } = require('@playwright/test');
  3   | const { adminLogin, createStudent, studentLogin: loginStudent } = require('./helpers');
  4   | // Student windows are fresh contexts: carry mobile settings into them too.
  5   | const {defaultBrowserType,...mobileProfile}=require('@playwright/test').devices['iPhone 13'];
  6   | const studentLogin=(browser,account,base)=>loginStudent(browser,account,base,process.env.UNIT1112_BROWSER==='webkit'?mobileProfile:{});
  7   | const { activity, story } = require('../support/unit1112-fivezones');
  8   | const {courseResponse}=require('../support/course-response-faults');
  9   | // Wait for real course readiness before examining content. Windows WebKit can
  10  | // spend more than five seconds preparing the complete protected package.
> 11  | async function ready(page){const start=Date.now();await expect(page.locator('#wordPageProgress')).toBeVisible({timeout:30000});test.info().annotations.push({type:'course-ready',description:String(Date.now()-start)+'ms after navigation'});}
      |                                                                                                   ^ Error: expect(locator).toBeVisible() failed
  12  | 
  13  | test.afterEach(async({request})=>{await request.post('/__test__/course-responses',{data:{reset:true}});});
  14  | test.use({actionTimeout:10000,...(process.env.UNIT1112_BROWSER==='webkit'?{...require('@playwright/test').devices['iPhone 13'],browserName:'webkit'}:{})});
  15  | 
  16  | test('课程入口保持班级授权：新课可单独开放', async ({ page, browser }) => {
  17  |   const base = process.env.AWARD_TEST_BASE || '/lesson/';
  18  |   await adminLogin(page, base);
  19  |   const account = await createStudent(page, '线索验收班', '小芽', [/Lesson 11–12/]);
  20  |   const learner = await studentLogin(browser, account, base);
  21  |   try {
  22  |     await expect(learner.page.locator('.course')).toHaveCount(1);
  23  |     await expect(learner.page.locator('.course')).toContainText('失物招领小侦探');
  24  |     await learner.page.getByRole('link', { name: /开始学习/ }).click();
  25  |     await expect(learner.page).toHaveURL(/unit11-12\/#learn\/words/);await ready(learner.page);
  26  |     await expect(learner.page.locator('.unit-word')).toHaveCount(6);
  27  |   } finally { await learner.context.close(); }
  28  | });
  29  | 
  30  | test('未开放本课的班级看不到入口，直接链接也不能进入',async({page,browser})=>{
  31  |   const base=process.env.AWARD_TEST_BASE||'/lesson/';
  32  |   await adminLogin(page,base);
  33  |   const account=await createStudent(page,'只开放旧课班','小叶',[/Lesson 3–4/]);
  34  |   const learner=await studentLogin(browser,account,base);
  35  |   try{
  36  |     await expect(learner.page.locator('.course')).not.toContainText('失物招领小侦探');
  37  |     await learner.page.goto(base+'unit11-12/#learn/words');
  38  |     await expect(learner.page.locator('.unit-word')).toHaveCount(0);
  39  |     await expect(learner.page.getByText('这节课还没向你的班级开放',{exact:true})).toBeVisible();
  40  |   }finally{await learner.context.close();}
  41  | });
  42  | 
  43  | test('真实账号全流程：五颗星同步、纪念册放大、GIF、跨设备与离线恢复',async({page,browser,browserName},info)=>{
  44  |   test.setTimeout(240000);
  45  |   const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  46  |   await adminLogin(page,base);
  47  |   const account=await createStudent(page,'线索完整验收班','小禾',[/Lesson 11–12/]);
  48  |   const first=await studentLogin(browser,account,base);let second;
  49  |   const errors=[],voices=[];
  50  |   first.page.on('pageerror',e=>errors.push(e.message));
  51  |   first.page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
  52  |   try{
  53  |     const learner=first.page;
  54  |     await learner.addInitScript(()=>{
  55  |       window.unit1112Frames={interruptions:[],flights:[]};
  56  |       const observe=()=>{
  57  |         const modal=document.querySelector('dialog.award-reveal[open]');
  58  |         if(modal){
  59  |           const loader=document.querySelector('#courseLoader');
  60  |           const missing=[...modal.querySelectorAll('img')].some(img=>img.getClientRects().length&&(!img.complete||!img.naturalWidth));
  61  |           const playing=[...document.querySelectorAll('.completion-card')].some(el=>el.dataset.resultMotion==='playing');
  62  |           if(missing||playing||(loader&&loader.getBoundingClientRect().width>0)||getComputedStyle(modal).visibility!=='visible')window.unit1112Frames.interruptions.push({missing,playing});
  63  |           const star=modal.querySelector('.travelling-star');
  64  |           if(star){const b=star.getBoundingClientRect(),key=Math.round(b.x)+','+Math.round(b.y);if(!window.unit1112Frames.flights.includes(key))window.unit1112Frames.flights.push(key);}
  65  |         }
  66  |         requestAnimationFrame(observe);
  67  |       };requestAnimationFrame(observe);
  68  |     });
  69  |     await story(learner,prefix);
  70  |     let count=0;
  71  |     for(const id of ['listen','roles','grammar','apply','exam']){
  72  |       const room=await activity(learner,id,{base:prefix,keepAward:true});
  73  |       const modal=learner.getByRole('dialog',{name:/纪念卡结算/});
  74  |       await expect(modal.getByRole('group',{name:`已获得 ${++count} / 5 颗星`,exact:true})).toBeVisible();
  75  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','pending');
  76  |       await expect.poll(()=>learner.evaluate(()=>window.unit1112Frames.flights.length)).toBeGreaterThan(3);
  77  |       await modal.press('Escape');
  78  |       await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  79  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  80  |       expect(await learner.evaluate(()=>window.unit1112Frames.interruptions)).toEqual([]);
  81  |     }
  82  |     await expect(learner.locator('#starCount')).toHaveText('5');
  83  |     await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  84  |     await learner.goto(base+'unit11-12/#learn/certificate');await ready(learner);
  85  |     await expect(learner.locator('#certificateName')).toHaveText('小禾');
  86  |     expect(await learner.locator('#certificateName').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Gothic');
  87  |     expect(await learner.locator('#certificateName').evaluate(e=>getComputedStyle(e).fontWeight)).toBe('500');
  88  |     const date=await learner.locator('#certificateDate').textContent();
  89  |     await learner.locator('.stage-certificate').screenshot({path:info.outputPath('five-star-card.png')});
  90  |     await learner.getByRole('link',{name:'我的纪念册',exact:true}).click();
  91  |     const card=learner.getByRole('button',{name:'放大 Lesson 11–12 归还物品小能手',exact:true});
  92  |     await expect(card.locator('.certificate')).toHaveAttribute('data-stars','5',{timeout:30000});
  93  |     await card.click();
  94  |     const modal=learner.getByRole('dialog',{name:'Lesson 11–12 纪念卡'});
  95  |     await expect(modal).toContainText('小禾');
  96  |     expect(await modal.locator('.card-name').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Gothic');
  97  |     await modal.screenshot({path:info.outputPath('book-card-closeup.png')});
  98  |     await learner.getByRole('button',{name:'关闭纪念卡',exact:true}).click();
  99  |     second=await studentLogin(browser,account,base);
  100 |     await expect(second.page.locator('.course')).toContainText('5 / 5');
  101 |     await second.page.goto(base+'unit11-12/#learn/certificate');await ready(second.page);
  102 |     await expect(second.page.locator('#certificateDate')).toHaveText(date);
  103 |     const download=second.page.waitForEvent('download');
  104 |     await second.page.getByRole('button',{name:'保存动图',exact:true}).click();
  105 |     const gif=await download;
  106 |     const file=await gif.path();const bytes=require('node:fs').readFileSync(file);
  107 |     expect(bytes.subarray(0,6).toString()).toBe('GIF89a');expect(bytes.length).toBeGreaterThan(10000);
  108 |     const output=info.outputPath('keepsake.gif');await gif.saveAs(output);
  109 |     const sharp=require('sharp'),metadata=await sharp(output,{animated:true}).metadata();
  110 |     expect(metadata.pages).toBe(60);expect(metadata.loop).toBe(0);
  111 |     expect(metadata.width).toBe(984);expect(metadata.pageHeight).toBe(528);
```