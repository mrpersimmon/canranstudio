# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit43-44.spec.js >> 缺图先拦截，恢复后完整进入；复访复用素材并恢复词卡页
- Location: tests\login\unit43-44.spec.js:137:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('#wordPageProgress')
Expected: "2 / 3"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('#wordPageProgress')

```

```yaml
- region "课程加载":
  - heading "茶具躲猫猫" [level=1]
  - status "课程准备状态": 正在准备画面…
  - progressbar "课程准备进度"
  - paragraph
  - link "返回课程":
    - /url: /
```

# Test source

```ts
  55  |           const missing=[...modal.querySelectorAll('img')].some(img=>img.getClientRects().length&&(!img.complete||!img.naturalWidth));
  56  |           const playing=[...document.querySelectorAll('.completion-card')].some(el=>el.dataset.resultMotion==='playing');
  57  |           if(missing||playing||(loader&&loader.getBoundingClientRect().width>0)||getComputedStyle(modal).visibility!=='visible')window.unit4344Frames.interruptions.push({missing,playing});
  58  |           const star=modal.querySelector('.travelling-star');
  59  |           if(star){const b=star.getBoundingClientRect(),key=Math.round(b.x)+','+Math.round(b.y);if(!window.unit4344Frames.flights.includes(key))window.unit4344Frames.flights.push(key);}
  60  |         }
  61  |         requestAnimationFrame(observe);
  62  |       };requestAnimationFrame(observe);
  63  |     });
  64  |     await story(learner,prefix);
  65  |     let count=0;
  66  |     for(const id of ['listen','roles','grammar','apply','exam']){
  67  |       const room=await activity(learner,id,{base:prefix,keepAward:true});
  68  |       const modal=learner.getByRole('dialog',{name:/纪念卡结算/});
  69  |       await expect(modal.getByRole('group',{name:`已获得 ${++count} / 5 颗星`,exact:true})).toBeVisible();
  70  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','pending');
  71  |       await expect.poll(()=>learner.evaluate(()=>window.unit4344Frames.flights.length)).toBeGreaterThan(3);
  72  |       await modal.press('Escape');
  73  |       await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  74  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  75  |       expect(await learner.evaluate(()=>window.unit4344Frames.interruptions)).toEqual([]);
  76  |     }
  77  |     await expect(learner.locator('#starCount')).toHaveText('5');
  78  |     await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  79  |     await learner.goto(base+'unit43-44/#learn/certificate');await ready(learner);
  80  |     await expect(learner.locator('#certificateName')).toHaveText('小禾');
  81  |     const date=await learner.locator('#certificateDate').textContent();
  82  |     await learner.locator('.stage-certificate').screenshot({path:info.outputPath('five-star-card.png')});
  83  |     await learner.getByRole('link',{name:'我的纪念册',exact:true}).click();
  84  |     const card=learner.getByRole('button',{name:'放大 Lesson 43–44 茶桌小帮手',exact:true});
  85  |     await expect(card.locator('.certificate')).toHaveAttribute('data-stars','5');
  86  |     await card.click();
  87  |     const modal=learner.getByRole('dialog',{name:'Lesson 43–44 纪念卡'});
  88  |     await expect(modal).toContainText('小禾');
  89  |     await modal.screenshot({path:info.outputPath('book-card-closeup.png')});
  90  |     await learner.getByRole('button',{name:'关闭纪念卡',exact:true}).click();
  91  |     second=await studentLogin(browser,account,base);
  92  |     await expect(second.page.locator('.course')).toContainText('5 / 5');
  93  |     await second.page.goto(base+'unit43-44/#learn/certificate');await ready(second.page);
  94  |     await expect(second.page.locator('#certificateDate')).toHaveText(date);
  95  |     const download=second.page.waitForEvent('download');
  96  |     await second.page.getByRole('button',{name:'保存动图',exact:true}).click();
  97  |     const gif=await download;
  98  |     const file=await gif.path();const bytes=require('node:fs').readFileSync(file);
  99  |     expect(bytes.subarray(0,6).toString()).toBe('GIF89a');expect(bytes.length).toBeGreaterThan(10000);
  100 |     const output=info.outputPath('keepsake.gif');await gif.saveAs(output);
  101 |     const sharp=require('sharp'),metadata=await sharp(output,{animated:true}).metadata();
  102 |     expect(metadata.pages).toBe(60);expect(metadata.loop).toBe(0);
  103 |     expect(metadata.width).toBe(984);expect(metadata.pageHeight).toBe(528);
  104 |     const crop=(frame,rect)=>sharp(output,{page:frame}).extract(rect).raw().toBuffer();
  105 |     const lights={left:40,top:330,width:400,height:100},title={left:55,top:150,width:360,height:55};
  106 |     expect((await crop(0,lights)).equals(await crop(15,lights))).toBe(false);
  107 |     expect((await crop(0,title)).equals(await crop(15,title))).toBe(true);
  108 |     await sharp(output,{page:15}).png().toFile(info.outputPath('keepsake-frame-15.png'));
  109 |     for(const width of [320,390]){
  110 |       await second.page.setViewportSize({width,height:844});
  111 |       await second.page.locator('.stage-certificate').scrollIntoViewIfNeeded();
  112 |       await second.page.locator('.stage-certificate').screenshot({path:info.outputPath(`card-${width}.png`)});
  113 |     }
  114 |     await second.page.setViewportSize({width:1280,height:900});
  115 |     await second.page.goto(base+'unit43-44/#learn/grammar');await ready(second.page);
  116 |     await expect(second.page.locator('.stage-grammar .completion-number')).toHaveText(['13','13','0']);
  117 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'再练一轮',exact:true}).click();
  118 |     await second.context.setOffline(true);
  119 |     await require('../support/units1-30-tasks').select(second.page.locator('.stage-grammar'),'会；能够');
  120 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'检查答案',exact:true}).click();
  121 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'下一题',exact:true}).click();
  122 |     let navigationFailed=false;
  123 |     try{await second.page.reload({timeout:12000});}catch(error){
  124 |       if(browserName!=='webkit'||!/WebKit encountered an internal error/.test(error.message))throw error;
  125 |       navigationFailed=true;info.annotations.push({type:'engine-boundary',description:'WebKit offline navigation rejected before app fallback; reconnect and record recovery checked separately.'});
  126 |     }
  127 |     if(navigationFailed){await second.context.setOffline(false);await second.page.goto(base+'unit43-44/#learn/grammar');await ready(second.page);}
  128 |     else{await expect(second.page.getByRole('heading',{name:'联网后再进入',exact:true})).toBeVisible();await second.context.setOffline(false);await second.page.getByRole('button',{name:'再试一次',exact:true}).click();}
  129 |     await expect(second.page.locator('.stage-grammar .progress-copy')).toHaveText('第 2 / 13 题');
  130 |     await expect(second.page.locator('#starCount')).toHaveText('5');
  131 |     expect(await second.page.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  132 |     expect(errors).toEqual([]);expect(voices).toEqual([]);
  133 |   }finally{await first.context.close();await second?.context.close();}
  134 | });
  135 | 
  136 | 
  137 | test('缺图先拦截，恢复后完整进入；复访复用素材并恢复词卡页',async({page,browser})=>{
  138 |   test.setTimeout(60000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
  139 |   await adminLogin(page,base);const account=await createStudent(page,'茶桌加载验收班','小林',[/Lesson 43–44/]);
  140 |   const student=await studentLogin(browser,account,base);const p=student.page;
  141 |   try{
  142 |     const pattern=base+'resources/*/kettle.svg';
  143 |     await courseResponse(p,pattern,{status:404,body:'missing illustration'});
  144 |     await p.goto(base+'unit43-44/#learn/words');
  145 |     const loader=p.getByRole('region',{name:'课程加载',exact:true});
  146 |     await expect(loader.getByRole('button',{name:'再试一次',exact:true})).toBeVisible({timeout:20000});
  147 |     await expect(p.locator('.unit-word')).toHaveCount(0);
  148 |     await courseResponse(p,pattern);await loader.getByRole('button',{name:'再试一次',exact:true}).click();
  149 |     await ready(p);await expect(p.locator('.unit-word')).toHaveCount(6);await expect(p.locator('#courseLoader')).toHaveCount(0);
  150 |     expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  151 |     await p.getByRole('button',{name:'下一组词卡',exact:true}).click();await expect(p.locator('#wordPageProgress')).toHaveText('2 / 3');
  152 |     await p.getByRole('link',{name:'我的课程',exact:true}).click();
  153 |     const downloads=[];p.on('request',r=>{if(r.url().includes('/resources/'))downloads.push(r.url());});
  154 |     await p.locator('.course').getByRole('link',{name:/学习/}).click();
> 155 |     await expect(p.locator('#wordPageProgress')).toHaveText('2 / 3');
      |                                                  ^ Error: expect(locator).toHaveText(expected) failed
  156 |     expect(downloads).toEqual([]);
  157 |     expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  158 |   }finally{await student.context.close();}
  159 | });
  160 | 
  161 | test('同姓名同星数对照认可卡：新卡、书页和一星动图显示一致',async({page,browser},info)=>{
  162 |   test.setTimeout(120000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  163 |   await adminLogin(page,base);const account=await createStudent(page,'茶桌视觉对照班','小禾',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 5–6/,/Lesson 43–44/]);
  164 |   const student=await studentLogin(browser,account,base),p=student.page;
  165 |   try{
  166 |     await p.goto(base+'unit43-44/#learn/certificate');await ready(p);
  167 |     await expect(p.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  168 |     for(const pair of ['1-2','3-4','5-6','43-44']){
  169 |       if(pair==='43-44')await activity(p,'listen',{base:prefix});
  170 |       else if(pair==='1-2')await require('../support/unit1-2-award-flow').finishZone(p,'listen',{base:base+'unit1-2/'});
  171 |       else await require('../support/units1-30-tasks').activity(p,pair,'listen',{base:prefix});
  172 |       await p.goto(base+'unit'+pair+'/#learn/certificate');await ready(p);
  173 |       await expect(p.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','1');
  174 |       await expect(p.locator('#certificateName')).toHaveText('小禾');
  175 |       await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('compare-'+pair+'.png')});
  176 |     }
  177 |     const card=p.locator('.stage-certificate .story-award-paper');
  178 |     const shine=card.locator('.award-star[data-earned="true"] .star-glint');
  179 |     const changes=await shine.evaluate(async el=>{
  180 |       const frames=new Set(),start=performance.now();
  181 |       while(performance.now()-start<5000&&frames.size<5){frames.add(getComputedStyle(el).opacity);await new Promise(requestAnimationFrame);}
  182 |       return frames.size;
  183 |     });expect(changes).toBeGreaterThan(3);
  184 |     const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();
  185 |     const gif=await download,file=info.outputPath('one-star.gif');await gif.saveAs(file);
  186 |     const sharp=require('sharp'),meta=await sharp(file,{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.loop).toBe(0);
  187 |     const area={left:40,top:330,width:400,height:100};
  188 |     expect((await sharp(file,{page:0}).extract(area).raw().toBuffer()).equals(await sharp(file,{page:15}).extract(area).raw().toBuffer())).toBe(false);
  189 |     await sharp(file,{page:15}).png().toFile(info.outputPath('one-star-frame.png'));
  190 |     await p.getByRole('link',{name:'我的纪念册',exact:true}).click();
  191 |     await p.getByRole('button',{name:'目录',exact:true}).click();
  192 |     await p.getByRole('button',{name:/Lesson 43–44/}).click();
  193 |     const cover=p.getByRole('button',{name:'放大 Lesson 43–44 茶桌小帮手',exact:true});
  194 |     await expect(cover.locator('.certificate')).toHaveAttribute('data-stars','1');
  195 |     await p.locator('.book').screenshot({path:info.outputPath('comparison-book.png')});
  196 |     await cover.click();await p.getByRole('dialog',{name:'Lesson 43–44 纪念卡'}).screenshot({path:info.outputPath('one-star-book-closeup.png')});
  197 |   }finally{await student.context.close();}
  198 | });
  199 | 
  200 | test('长姓名手机卡、另一学生隔离、教师预览不能保存个人成果',async({page,browser},info)=>{
  201 |  test.setTimeout(70000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  202 |  await adminLogin(page,base);const account=await createStudent(page,'茶桌身份边界班','欧阳小禾同学',[/Lesson 43–44/]);
  203 |  const preview=await page.getByRole('link',{name:'预览这个班',exact:true}).getAttribute('href');
  204 |  const first=await studentLogin(browser,account,base);let other;
  205 |  try{
  206 |   await activity(first.page,'listen',{base:prefix});await first.page.setViewportSize({width:320,height:568});await first.page.goto(base+'unit43-44/#learn/certificate');await ready(first.page);
  207 |   await expect(first.page.locator('#certificateName')).toHaveText('欧阳小禾同学');
  208 |   const card=first.page.locator('.stage-certificate .story-award-paper'),name=first.page.locator('#certificateName');
  209 |   const b=await card.boundingBox(),n=await name.boundingBox();expect(n.x).toBeGreaterThan(b.x);expect(n.x+n.width).toBeLessThan(b.x+b.width);expect(n.y+n.height).toBeLessThan(b.y+b.height);
  210 |   expect(await name.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollHeight<=el.clientHeight+1)).toBe(true);await card.screenshot({path:info.outputPath('long-name-320.png')});
  211 |   const second=await require('./helpers').addStudent(page,'小竹');other=await studentLogin(browser,second,base);await other.page.goto(base+'unit43-44/#learn/certificate');await ready(other.page);await expect(other.page.locator('#starCount')).toHaveText('0');await expect(other.page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  212 |   await page.goto(preview);await page.getByRole('link',{name:/茶具躲猫猫/}).click();await page.goto((await page.url()).replace(/#.*$/,'#learn/certificate'));await ready(page);
  213 |   await expect(page.locator('#starCount')).toHaveText('0');await expect(page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  214 |  }finally{await first.context.close();await other?.context.close();}
  215 | });
  216 | 
  217 | // Course preparation and the content assertion have separate contracts.
  218 | async function ready(page){const start=Date.now();await expect(page.locator('#wordPageProgress')).toBeVisible({timeout:30000});test.info().annotations.push({type:'course-ready',description:String(Date.now()-start)+'ms after navigation'});}
  219 | test('关课重开保留收藏，导出故障可重试且离开取消下载',async({page,browser},info)=>{
  220 |  test.setTimeout(150000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  221 |  const {saveCourses}=require('./helpers');await adminLogin(page,base);const account=await createStudent(page,'消息成果保留班','小溪',[/Lesson 43–44/]);
  222 |  const student=await studentLogin(browser,account,base),p=student.page,downloads=[];p.on('download',d=>downloads.push(d));
  223 |  try{
  224 |   await activity(p,'listen',{base:prefix});await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  225 |   await page.getByRole('checkbox',{name:/Lesson 43–44/}).uncheck();await saveCourses(page);
  226 |   await p.goto(base);await expect(p.locator('.course')).toHaveCount(0);
  227 |   await p.getByRole('link',{name:'我的纪念册',exact:true}).click();const oldCard=p.getByRole('button',{name:'放大 Lesson 43–44 茶桌小帮手',exact:true});
  228 |   await expect(oldCard.locator('.certificate')).toHaveAttribute('data-stars','1',{timeout:30000});await oldCard.screenshot({path:info.outputPath('closed-course-collection.png')});
  229 |   await page.getByRole('checkbox',{name:/Lesson 43–44/}).check();await saveCourses(page);
  230 |   await p.goto(base+'unit43-44/#learn/certificate');await ready(p);await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('#certificateName')).toHaveText('小溪');
  231 |   // Inject a failure at the browser canvas boundary, not in learning or award data.
  232 |   await p.evaluate(()=>{window.originalGifRead=CanvasRenderingContext2D.prototype.getImageData;window.failedGifReads=0;CanvasRenderingContext2D.prototype.getImageData=function(...args){if(this.canvas.width===984&&this.canvas.height===528){window.failedGifReads++;throw new DOMException('Simulated export canvas failure','InvalidStateError');}return Reflect.apply(window.originalGifRead,this,args);};});
  233 |   await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('暂时没能保存，请再试一次。');expect(await p.evaluate(()=>window.failedGifReads)).toBeGreaterThan(0);expect(downloads).toHaveLength(0);
  234 |   await p.evaluate(()=>{CanvasRenderingContext2D.prototype.getImageData=window.originalGifRead;});const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();const gif=await download;await gif.saveAs(info.outputPath('export-recovered.gif'));
  235 |   const meta=await require('sharp')(info.outputPath('export-recovered.gif'),{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.width).toBe(984);expect(meta.pageHeight).toBe(528);await expect(p.locator('.story-award-status')).toHaveText('动图已生成');expect(downloads).toHaveLength(1);
  236 |   await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('正在保存…');await p.getByRole('link',{name:'我的课程',exact:true}).click();await expect(p.locator('.course')).toHaveCount(1);await expect(p.locator('.course')).toContainText('1 / 5');expect(downloads).toHaveLength(1);
  237 |   await p.goto(base+'unit43-44/#learn/certificate');await ready(p);await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('.story-award-status')).toBeEmpty();expect(downloads).toHaveLength(1);
  238 |  }finally{await student.context.close();}
  239 | });
  240 | 
  241 | 
  242 | 
  243 | 
```