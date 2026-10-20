# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit43-44.spec.js >> 真实账号全流程：五颗星同步、纪念册放大、GIF、跨设备与离线恢复
- Location: tests\login\unit43-44.spec.js:36:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('#certificateDate')
Expected: "2026.10.17"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('#certificateDate')

```

```yaml
- region "课程加载":
  - heading "茶具躲猫猫" [level=1]
  - status "课程准备状态": 正在准备课程…
  - progressbar "课程准备进度"
  - paragraph
  - link "返回课程":
    - /url: /
```

# Test source

```ts
  1   | 'use strict';
  2   | const { test, expect } = require('@playwright/test');
  3   | const { adminLogin, createStudent, studentLogin } = require('./helpers');
  4   | const { activity, story } = require('../support/unit4344-v153');
  5   | const {courseResponse}=require('../support/course-response-faults');
  6   | test.afterEach(async({request})=>{await request.post('/__test__/course-responses',{data:{reset:true}});});
  7   | test.use({actionTimeout:10000,...(process.env.UNIT4344_BROWSER==='webkit'?{...require('@playwright/test').devices['iPhone 13'],browserName:'webkit'}:{})});
  8   | 
  9   | test('课程入口保持班级授权：新课可单独开放', async ({ page, browser }) => {
  10  |   const base = process.env.AWARD_TEST_BASE || '/lesson/';
  11  |   await adminLogin(page, base);
  12  |   const account = await createStudent(page, '茶桌验收班', '小芽', [/Lesson 43–44/]);
  13  |   const learner = await studentLogin(browser, account, base);
  14  |   try {
  15  |     await expect(learner.page.locator('.course')).toHaveCount(1);
  16  |     await expect(learner.page.locator('.course')).toContainText('茶具躲猫猫');
  17  |     await learner.page.getByRole('link', { name: /开始学习/ }).click();
  18  |     await expect(learner.page).toHaveURL(/unit43-44\/#learn\/words/);
  19  |     await expect(learner.page.locator('.unit-word')).toHaveCount(6);
  20  |   } finally { await learner.context.close(); }
  21  | });
  22  | 
  23  | test('未开放本课的班级看不到入口，直接链接也不能进入',async({page,browser})=>{
  24  |   const base=process.env.AWARD_TEST_BASE||'/lesson/';
  25  |   await adminLogin(page,base);
  26  |   const account=await createStudent(page,'只开放旧课班','小叶',[/Lesson 3–4/]);
  27  |   const learner=await studentLogin(browser,account,base);
  28  |   try{
  29  |     await expect(learner.page.locator('.course')).not.toContainText('茶具躲猫猫');
  30  |     await learner.page.goto(base+'unit43-44/#learn/words');
  31  |     await expect(learner.page.locator('.unit-word')).toHaveCount(0);
  32  |     await expect(learner.page.getByText('这节课还没向你的班级开放',{exact:true})).toBeVisible();
  33  |   }finally{await learner.context.close();}
  34  | });
  35  | 
  36  | test('真实账号全流程：五颗星同步、纪念册放大、GIF、跨设备与离线恢复',async({page,browser,browserName},info)=>{
  37  |   test.setTimeout(180000);
  38  |   const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  39  |   await adminLogin(page,base);
  40  |   const account=await createStudent(page,'茶桌完整验收班','小禾',[/Lesson 43–44/]);
  41  |   const first=await studentLogin(browser,account,base);let second;
  42  |   const errors=[],voices=[];
  43  |   first.page.on('pageerror',e=>errors.push(e.message));
  44  |   first.page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
  45  |   try{
  46  |     const learner=first.page;
  47  |     await learner.addInitScript(()=>{
  48  |       window.unit4344Frames={interruptions:[],flights:[]};
  49  |       const observe=()=>{
  50  |         const modal=document.querySelector('dialog.award-reveal[open]');
  51  |         if(modal){
  52  |           const loader=document.querySelector('#courseLoader');
  53  |           const missing=[...modal.querySelectorAll('img')].some(img=>img.getClientRects().length&&(!img.complete||!img.naturalWidth));
  54  |           const playing=[...document.querySelectorAll('.completion-card')].some(el=>el.dataset.resultMotion==='playing');
  55  |           if(missing||playing||(loader&&loader.getBoundingClientRect().width>0)||getComputedStyle(modal).visibility!=='visible')window.unit4344Frames.interruptions.push({missing,playing});
  56  |           const star=modal.querySelector('.travelling-star');
  57  |           if(star){const b=star.getBoundingClientRect(),key=Math.round(b.x)+','+Math.round(b.y);if(!window.unit4344Frames.flights.includes(key))window.unit4344Frames.flights.push(key);}
  58  |         }
  59  |         requestAnimationFrame(observe);
  60  |       };requestAnimationFrame(observe);
  61  |     });
  62  |     await story(learner,prefix);
  63  |     let count=0;
  64  |     for(const id of ['listen','roles','grammar','apply','exam']){
  65  |       const room=await activity(learner,id,{base:prefix,keepAward:true});
  66  |       const modal=learner.getByRole('dialog',{name:/纪念卡结算/});
  67  |       await expect(modal.getByRole('group',{name:`已获得 ${++count} / 5 颗星`,exact:true})).toBeVisible();
  68  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','pending');
  69  |       await expect.poll(()=>learner.evaluate(()=>window.unit4344Frames.flights.length)).toBeGreaterThan(3);
  70  |       await modal.press('Escape');
  71  |       await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  72  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  73  |       expect(await learner.evaluate(()=>window.unit4344Frames.interruptions)).toEqual([]);
  74  |     }
  75  |     await expect(learner.locator('#starCount')).toHaveText('5');
  76  |     await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  77  |     await learner.goto(base+'unit43-44/#learn/certificate');
  78  |     await expect(learner.locator('#certificateName')).toHaveText('小禾');
  79  |     const date=await learner.locator('#certificateDate').textContent();
  80  |     await learner.locator('.stage-certificate').screenshot({path:info.outputPath('five-star-card.png')});
  81  |     await learner.getByRole('link',{name:'我的纪念册',exact:true}).click();
  82  |     const card=learner.getByRole('button',{name:'放大 Lesson 43–44 茶桌小帮手',exact:true});
  83  |     await expect(card.locator('.certificate')).toHaveAttribute('data-stars','5');
  84  |     await card.click();
  85  |     const modal=learner.getByRole('dialog',{name:'Lesson 43–44 纪念卡'});
  86  |     await expect(modal).toContainText('小禾');
  87  |     await modal.screenshot({path:info.outputPath('book-card-closeup.png')});
  88  |     await learner.getByRole('button',{name:'关闭纪念卡',exact:true}).click();
  89  |     second=await studentLogin(browser,account,base);
  90  |     await expect(second.page.locator('.course')).toContainText('5 / 5');
  91  |     await second.page.goto(base+'unit43-44/#learn/certificate');
> 92  |     await expect(second.page.locator('#certificateDate')).toHaveText(date);
      |                                                           ^ Error: expect(locator).toHaveText(expected) failed
  93  |     const download=second.page.waitForEvent('download');
  94  |     await second.page.getByRole('button',{name:'保存动图',exact:true}).click();
  95  |     const gif=await download;
  96  |     const file=await gif.path();const bytes=require('node:fs').readFileSync(file);
  97  |     expect(bytes.subarray(0,6).toString()).toBe('GIF89a');expect(bytes.length).toBeGreaterThan(10000);
  98  |     const output=info.outputPath('keepsake.gif');await gif.saveAs(output);
  99  |     const sharp=require('sharp'),metadata=await sharp(output,{animated:true}).metadata();
  100 |     expect(metadata.pages).toBe(60);expect(metadata.loop).toBe(0);
  101 |     expect(metadata.width).toBe(984);expect(metadata.pageHeight).toBe(528);
  102 |     const crop=(frame,rect)=>sharp(output,{page:frame}).extract(rect).raw().toBuffer();
  103 |     const lights={left:40,top:330,width:400,height:100},title={left:55,top:150,width:360,height:55};
  104 |     expect((await crop(0,lights)).equals(await crop(15,lights))).toBe(false);
  105 |     expect((await crop(0,title)).equals(await crop(15,title))).toBe(true);
  106 |     await sharp(output,{page:15}).png().toFile(info.outputPath('keepsake-frame-15.png'));
  107 |     for(const width of [320,390]){
  108 |       await second.page.setViewportSize({width,height:844});
  109 |       await second.page.locator('.stage-certificate').scrollIntoViewIfNeeded();
  110 |       await second.page.locator('.stage-certificate').screenshot({path:info.outputPath(`card-${width}.png`)});
  111 |     }
  112 |     await second.page.setViewportSize({width:1280,height:900});
  113 |     await second.page.goto(base+'unit43-44/#learn/grammar');
  114 |     await expect(second.page.locator('.stage-grammar .completion-number')).toHaveText(['13','13','0']);
  115 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'再练一轮',exact:true}).click();
  116 |     await second.context.setOffline(true);
  117 |     await require('../support/units1-30-tasks').select(second.page.locator('.stage-grammar'),'会；能够');
  118 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'检查答案',exact:true}).click();
  119 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'下一题',exact:true}).click();
  120 |     let navigationFailed=false;
  121 |     try{await second.page.reload({timeout:12000});}catch(error){
  122 |       if(browserName!=='webkit'||!/WebKit encountered an internal error/.test(error.message))throw error;
  123 |       navigationFailed=true;info.annotations.push({type:'engine-boundary',description:'WebKit offline navigation rejected before app fallback; reconnect and record recovery checked separately.'});
  124 |     }
  125 |     if(navigationFailed){await second.context.setOffline(false);await second.page.goto(base+'unit43-44/#learn/grammar');}
  126 |     else{await expect(second.page.getByRole('heading',{name:'联网后再进入',exact:true})).toBeVisible();await second.context.setOffline(false);await second.page.getByRole('button',{name:'再试一次',exact:true}).click();}
  127 |     await expect(second.page.locator('.stage-grammar .progress-copy')).toHaveText('第 2 / 13 题');
  128 |     await expect(second.page.locator('#starCount')).toHaveText('5');
  129 |     expect(await second.page.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  130 |     expect(errors).toEqual([]);expect(voices).toEqual([]);
  131 |   }finally{await first.context.close();await second?.context.close();}
  132 | });
  133 | 
  134 | 
  135 | test('缺图先拦截，恢复后完整进入；复访复用素材并恢复词卡页',async({page,browser})=>{
  136 |   test.setTimeout(60000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
  137 |   await adminLogin(page,base);const account=await createStudent(page,'茶桌加载验收班','小林',[/Lesson 43–44/]);
  138 |   const student=await studentLogin(browser,account,base);const p=student.page;
  139 |   try{
  140 |     const pattern=base+'resources/*/kettle.svg';
  141 |     await courseResponse(p,pattern,{status:404,body:'missing illustration'});
  142 |     await p.goto(base+'unit43-44/#learn/words');
  143 |     const loader=p.getByRole('region',{name:'课程加载',exact:true});
  144 |     await expect(loader.getByRole('button',{name:'再试一次',exact:true})).toBeVisible({timeout:20000});
  145 |     await expect(p.locator('.unit-word')).toHaveCount(0);
  146 |     await courseResponse(p,pattern);await loader.getByRole('button',{name:'再试一次',exact:true}).click();
  147 |     await expect(p.locator('.unit-word')).toHaveCount(6);await expect(p.locator('#courseLoader')).toHaveCount(0);
  148 |     expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  149 |     await p.getByRole('button',{name:'下一组词卡',exact:true}).click();await expect(p.locator('#wordPageProgress')).toHaveText('2 / 3');
  150 |     await p.getByRole('link',{name:'我的课程',exact:true}).click();
  151 |     const downloads=[];p.on('request',r=>{if(r.url().includes('/resources/'))downloads.push(r.url());});
  152 |     await p.locator('.course').getByRole('link',{name:/学习/}).click();
  153 |     await expect(p.locator('#wordPageProgress')).toHaveText('2 / 3');
  154 |     expect(downloads).toEqual([]);
  155 |     expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  156 |   }finally{await student.context.close();}
  157 | });
  158 | 
  159 | test('同姓名同星数对照认可卡：新卡、书页和一星动图显示一致',async({page,browser},info)=>{
  160 |   test.setTimeout(120000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  161 |   await adminLogin(page,base);const account=await createStudent(page,'茶桌视觉对照班','小禾',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 43–44/]);
  162 |   const student=await studentLogin(browser,account,base),p=student.page;
  163 |   try{
  164 |     await p.goto(base+'unit43-44/#learn/certificate');
  165 |     await expect(p.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  166 |     for(const pair of ['1-2','3-4','43-44']){
  167 |       if(pair==='43-44')await activity(p,'listen',{base:prefix});
  168 |       else if(pair==='1-2')await require('../support/unit1-2-award-flow').finishZone(p,'listen',{base:base+'unit1-2/'});
  169 |       else await require('../support/units1-30-tasks').activity(p,pair,'listen',{base:prefix});
  170 |       await p.goto(base+'unit'+pair+'/#learn/certificate');
  171 |       await expect(p.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','1');
  172 |       await expect(p.locator('#certificateName')).toHaveText('小禾');
  173 |       await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('compare-'+pair+'.png')});
  174 |     }
  175 |     const card=p.locator('.stage-certificate .story-award-paper');
  176 |     const shine=card.locator('.award-star[data-earned="true"] .star-glint');
  177 |     const changes=await shine.evaluate(async el=>{
  178 |       const frames=new Set(),start=performance.now();
  179 |       while(performance.now()-start<5000&&frames.size<5){frames.add(getComputedStyle(el).opacity);await new Promise(requestAnimationFrame);}
  180 |       return frames.size;
  181 |     });expect(changes).toBeGreaterThan(3);
  182 |     const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();
  183 |     const gif=await download,file=info.outputPath('one-star.gif');await gif.saveAs(file);
  184 |     const sharp=require('sharp'),meta=await sharp(file,{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.loop).toBe(0);
  185 |     const area={left:40,top:330,width:400,height:100};
  186 |     expect((await sharp(file,{page:0}).extract(area).raw().toBuffer()).equals(await sharp(file,{page:15}).extract(area).raw().toBuffer())).toBe(false);
  187 |     await sharp(file,{page:15}).png().toFile(info.outputPath('one-star-frame.png'));
  188 |     await p.getByRole('link',{name:'我的纪念册',exact:true}).click();
  189 |     await p.getByRole('button',{name:'目录',exact:true}).click();
  190 |     await p.getByRole('button',{name:/Lesson 43–44/}).click();
  191 |     const cover=p.getByRole('button',{name:'放大 Lesson 43–44 茶桌小帮手',exact:true});
  192 |     await expect(cover.locator('.certificate')).toHaveAttribute('data-stars','1');
```