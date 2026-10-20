# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit15-16-fivezones.spec.js >> 缺图先拦截，恢复后完整进入；复访复用素材并恢复词卡页
- Location: tests\login\unit15-16-fivezones.spec.js:146:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('#wordPageProgress')
Expected: "2 / 4"
Received: "2 / 5"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('#wordPageProgress')
    14 × locator resolved to <span class="" id="wordPageProgress">2 / 5</span>
       - unexpected value "2 / 5"

```

```yaml
- text: 2 / 5
```

# Test source

```ts
  63  |           const star=modal.querySelector('.travelling-star');
  64  |           if(star){const b=star.getBoundingClientRect(),key=Math.round(b.x)+','+Math.round(b.y);if(!window.unit1516Frames.flights.includes(key))window.unit1516Frames.flights.push(key);}
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
  76  |       await expect.poll(()=>learner.evaluate(()=>window.unit1516Frames.flights.length)).toBeGreaterThan(3);
  77  |       await modal.press('Escape');
  78  |       await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  79  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  80  |       expect(await learner.evaluate(()=>window.unit1516Frames.interruptions)).toEqual([]);
  81  |     }
  82  |     await expect(learner.locator('#starCount')).toHaveText('5');
  83  |     await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  84  |     await learner.goto(base+'unit15-16/#learn/certificate');await ready(learner);
  85  |     await expect(learner.locator('#certificateName')).toHaveText('小禾');
  86  |     expect(await learner.locator('#certificateName').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Gothic');
  87  |     expect(await learner.locator('#certificateName').evaluate(e=>getComputedStyle(e).fontWeight)).toBe('500');
  88  |     const date=await learner.locator('#certificateDate').textContent();
  89  |     await learner.locator('.stage-certificate').screenshot({path:info.outputPath('five-star-card.png')});
  90  |     await learner.getByRole('link',{name:'我的纪念册',exact:true}).click();
  91  |     const card=learner.getByRole('button',{name:'放大 Lesson 15–16 结伴出行小达人',exact:true});
  92  |     await expect(card.locator('.certificate')).toHaveAttribute('data-stars','5',{timeout:30000});
  93  |     await card.click();
  94  |     const modal=learner.getByRole('dialog',{name:'Lesson 15–16 纪念卡'});
  95  |     await expect(modal).toContainText('小禾');
  96  |     expect(await modal.locator('.card-name').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Gothic');
  97  |     await modal.screenshot({path:info.outputPath('book-card-closeup.png')});
  98  |     await learner.getByRole('button',{name:'关闭纪念卡',exact:true}).click();
  99  |     second=await studentLogin(browser,account,base);
  100 |     await expect(second.page.locator('.course')).toContainText('5 / 5');
  101 |     await second.page.goto(base+'unit15-16/#learn/certificate');await ready(second.page);
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
  112 |     const crop=(frame,rect)=>sharp(output,{page:frame}).extract(rect).raw().toBuffer();
  113 |     const lights={left:40,top:330,width:400,height:100},title={left:55,top:150,width:360,height:55};
  114 |     expect((await crop(0,lights)).equals(await crop(15,lights))).toBe(false);
  115 |     expect((await crop(0,title)).equals(await crop(15,title))).toBe(true);
  116 |     for(const region of [{left:55,top:255,width:350,height:78},{left:510,top:180,width:425,height:290}])expect((await crop(0,region)).equals(await crop(15,region))).toBe(true);
  117 |     await sharp(output,{page:15}).png().toFile(info.outputPath('keepsake-frame-15.png'));
  118 |     for(const width of [320,390]){
  119 |       await second.page.setViewportSize({width,height:844});
  120 |       await second.page.locator('.stage-certificate').scrollIntoViewIfNeeded();
  121 |       await second.page.locator('.stage-certificate').screenshot({path:info.outputPath(`card-${width}.png`)});
  122 |     }
  123 |     await second.page.setViewportSize({width:1280,height:900});
  124 |     await second.page.goto(base+'unit15-16/#learn/grammar');await ready(second.page);
  125 |     await expect(second.page.locator('.stage-grammar .completion-number')).toHaveText(['16','16','0']);
  126 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'再练一轮',exact:true}).click();
  127 |     await second.context.setOffline(true);
  128 |     await require('../support/unit1516-fivezones').select(second.page.locator('.stage-grammar'),{fills:['officers']});
  129 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'检查答案',exact:true}).click();
  130 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'下一题',exact:true}).click();
  131 |     let navigationFailed=false;
  132 |     try{await second.page.reload({timeout:12000});}catch(error){
  133 |       if(browserName!=='webkit'||!/WebKit encountered an internal error/.test(error.message))throw error;
  134 |       navigationFailed=true;info.annotations.push({type:'engine-boundary',description:'WebKit offline navigation rejected before app fallback; reconnect and record recovery checked separately.'});
  135 |     }
  136 |     if(navigationFailed){await second.context.setOffline(false);await second.page.goto(base+'unit15-16/#learn/grammar');await ready(second.page);}
  137 |     else{await expect(second.page.getByRole('heading',{name:'联网后再进入',exact:true})).toBeVisible();await second.context.setOffline(false);await second.page.getByRole('button',{name:'再试一次',exact:true}).click();}
  138 |     await expect(second.page.locator('.stage-grammar .progress-copy')).toHaveText('第 2 / 16 题');
  139 |     await expect(second.page.locator('#starCount')).toHaveText('5');
  140 |     expect(await second.page.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  141 |     expect(errors).toEqual([]);expect(voices).toEqual([]);
  142 |   }finally{await first.context.close();await second?.context.close();}
  143 | });
  144 | 
  145 | 
  146 | test('缺图先拦截，恢复后完整进入；复访复用素材并恢复词卡页',async({page,browser})=>{
  147 |   test.setTimeout(60000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
  148 |   await adminLogin(page,base);const account=await createStudent(page,'线索加载验收班','小林',[/Lesson 15–16/]);
  149 |   const student=await studentLogin(browser,account,base);const p=student.page;
  150 |   try{
  151 |     // Fail this unit's independent stage asset, not a duplicated vocabulary icon.
  152 |     const pattern=base+'resources/*/cast-officer-v1.webp';
  153 |     const missing=[];p.on('response',r=>{if(r.url().includes('/resources/')&&r.url().endsWith('/cast-officer-v1.webp')&&r.status()===404)missing.push(r.url());});
  154 |     await courseResponse(p,pattern,{status:404,body:'missing illustration'});
  155 |     await p.goto(base+'unit15-16/#learn/words');
  156 |     const loader=p.getByRole('region',{name:'课程加载',exact:true});
  157 |     await expect(loader.getByRole('button',{name:'再试一次',exact:true})).toBeVisible({timeout:20000});
  158 |     expect(missing.length).toBeGreaterThan(0);
  159 |     await expect(p.locator('.unit-word')).toHaveCount(0);
  160 |     await courseResponse(p,pattern);await loader.getByRole('button',{name:'再试一次',exact:true}).click();
  161 |     await expect(p.locator('.unit-word')).toHaveCount(6,{timeout:30000});await expect(p.locator('#courseLoader')).toHaveCount(0);
  162 |     expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
> 163 |     await p.getByRole('button',{name:'下一组词卡',exact:true}).click();await expect(p.locator('#wordPageProgress')).toHaveText('2 / 4');
      |                                                                                                                ^ Error: expect(locator).toHaveText(expected) failed
  164 |     await p.getByRole('link',{name:'我的课程',exact:true}).click();
  165 |     const downloads=[];p.on('request',r=>{if(r.url().includes('/resources/'))downloads.push(r.url());});
  166 |     await p.locator('.course').getByRole('link',{name:/学习/}).click();await ready(p);
  167 |     await expect(p.locator('#wordPageProgress')).toHaveText('2 / 4');
  168 |     expect(downloads).toEqual([]);
  169 |     expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  170 |   }finally{await student.context.close();}
  171 | });
  172 | 
  173 | test('同姓名同星数对照认可卡：新卡、书页和一星动图显示一致',async({page,browser},info)=>{
  174 |   test.setTimeout(240000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  175 |   await adminLogin(page,base);const account=await createStudent(page,'线索视觉对照班','小禾',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 5–6/,/Lesson 15–16/]);
  176 |   const student=await studentLogin(browser,account,base),p=student.page;
  177 |   try{
  178 |     await p.goto(base+'unit15-16/#learn/certificate');await ready(p);
  179 |     await expect(p.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled({timeout:30000});
  180 |     for(const pair of ['1-2','3-4','5-6','13-14']){
  181 |       if(pair==='13-14')await activity(p,'listen',{base:prefix});
  182 |       else if(pair==='1-2')await require('../support/unit1-2-award-flow').finishZone(p,'listen',{base:base+'unit1-2/'});
  183 |       else await require('../support/units1-30-tasks').activity(p,pair,'listen',{base:prefix});
  184 |       await p.goto(base+'unit'+pair+'/#learn/certificate');await ready(p);
  185 |       await expect(p.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','1');
  186 |       await expect(p.locator('#certificateName')).toHaveText('小禾');
  187 |       await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('compare-'+pair+'.png')});
  188 |     }
  189 |     const card=p.locator('.stage-certificate .story-award-paper');
  190 |     const shine=card.locator('.award-star[data-earned="true"] .star-glint');
  191 |     const changes=await shine.evaluate(async el=>{
  192 |       const frames=new Set(),start=performance.now();
  193 |       while(performance.now()-start<5000&&frames.size<5){frames.add(getComputedStyle(el).opacity);await new Promise(requestAnimationFrame);}
  194 |       return frames.size;
  195 |     });expect(changes).toBeGreaterThan(3);
  196 |     const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();
  197 |     const gif=await download,file=info.outputPath('one-star.gif');await gif.saveAs(file);
  198 |     const sharp=require('sharp'),meta=await sharp(file,{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.loop).toBe(0);
  199 |     const area={left:40,top:330,width:400,height:100};
  200 |     expect((await sharp(file,{page:0}).extract(area).raw().toBuffer()).equals(await sharp(file,{page:15}).extract(area).raw().toBuffer())).toBe(false);
  201 |     await sharp(file,{page:15}).png().toFile(info.outputPath('one-star-frame.png'));
  202 |     await p.getByRole('link',{name:'我的纪念册',exact:true}).click();
  203 |     await p.getByRole('button',{name:'目录',exact:true}).click();
  204 |     await p.getByRole('button',{name:/Lesson 15–16/}).click();
  205 |     const cover=p.getByRole('button',{name:'放大 Lesson 15–16 结伴出行小达人',exact:true});
  206 |     await expect(cover.locator('.certificate')).toHaveAttribute('data-stars','1');
  207 |     await p.locator('.book').screenshot({path:info.outputPath('comparison-book.png')});
  208 |     await cover.click();await p.getByRole('dialog',{name:'Lesson 15–16 纪念卡'}).screenshot({path:info.outputPath('one-star-book-closeup.png')});
  209 |   }finally{await student.context.close();}
  210 | });
  211 | 
  212 | test('长姓名手机卡、另一学生隔离、教师预览不能保存个人成果',async({page,browser},info)=>{
  213 |  test.setTimeout(70000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  214 |  await adminLogin(page,base);const account=await createStudent(page,'线索身份边界班','欧阳小禾同学',[/Lesson 15–16/]);
  215 |  const preview=await page.getByRole('link',{name:'预览这个班',exact:true}).getAttribute('href');
  216 |  const first=await studentLogin(browser,account,base);let other;
  217 |  try{
  218 |   await activity(first.page,'listen',{base:prefix,keepAward:true});
  219 |   const reveal=first.page.getByRole('dialog',{name:/纪念卡结算/});await expect(reveal.getByRole('group',{name:'已获得 1 / 5 颗星',exact:true})).toBeVisible();await reveal.press('Escape');await expect(reveal).toBeHidden();
  220 |   await first.page.setViewportSize({width:320,height:568});await first.page.goto(base+'unit15-16/#learn/certificate');await ready(first.page);
  221 |   await expect(first.page.locator('#certificateName')).toHaveText('欧阳小禾同学');
  222 |   const card=first.page.locator('.stage-certificate .story-award-paper'),name=first.page.locator('#certificateName');
  223 |   await expect(card).toHaveAttribute('data-stars','1');
  224 |   const b=await card.boundingBox(),n=await name.boundingBox();expect(n.x).toBeGreaterThan(b.x);expect(n.x+n.width).toBeLessThan(b.x+b.width);expect(n.y+n.height).toBeLessThan(b.y+b.height);
  225 |   expect(await name.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollHeight<=el.clientHeight+1)).toBe(true);await card.screenshot({path:info.outputPath('long-name-320.png')});
  226 |   const second=await require('./helpers').addStudent(page,'小竹');other=await studentLogin(browser,second,base);await other.page.goto(base+'unit15-16/#learn/certificate');await ready(other.page);await expect(other.page.locator('#starCount')).toHaveText('0');await expect(other.page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  227 |   await page.goto(preview);await page.getByRole('link',{name:/护照小检查站/}).click();await page.goto((await page.url()).replace(/#.*$/,'#learn/certificate'));await ready(page);
  228 |   await expect(page.locator('#starCount')).toHaveText('0');await expect(page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  229 |  }finally{await first.context.close();await other?.context.close();}
  230 | });
  231 | 
  232 | test('关课重开保留收藏，导出故障可重试且离开取消下载',async({page,browser},info)=>{
  233 |  test.setTimeout(150000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  234 |  const {saveCourses}=require('./helpers');await adminLogin(page,base);const account=await createStudent(page,'消息成果保留班','小溪',[/Lesson 15–16/]);
  235 |  const student=await studentLogin(browser,account,base),p=student.page,downloads=[];p.on('download',d=>downloads.push(d));
  236 |  try{
  237 |   await activity(p,'listen',{base:prefix});await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  238 |   await page.getByRole('checkbox',{name:/Lesson 15–16/}).uncheck();await saveCourses(page);
  239 |   await p.goto(base);await expect(p.locator('.course')).toHaveCount(0);
  240 |   await p.getByRole('link',{name:'我的纪念册',exact:true}).click();const oldCard=p.getByRole('button',{name:'放大 Lesson 15–16 结伴出行小达人',exact:true});
  241 |   await expect(oldCard.locator('.certificate')).toHaveAttribute('data-stars','1',{timeout:30000});await oldCard.screenshot({path:info.outputPath('closed-course-collection.png')});
  242 |   await page.getByRole('checkbox',{name:/Lesson 15–16/}).check();await saveCourses(page);
  243 |   await p.goto(base+'unit15-16/#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('#certificateName')).toHaveText('小溪');
  244 |   // Inject a failure at the browser canvas boundary, not in learning or award data.
  245 |   await p.evaluate(()=>{window.originalGifRead=CanvasRenderingContext2D.prototype.getImageData;window.failedGifReads=0;CanvasRenderingContext2D.prototype.getImageData=function(...args){if(this.canvas.width===984&&this.canvas.height===528){window.failedGifReads++;throw new DOMException('Simulated export canvas failure','InvalidStateError');}return Reflect.apply(window.originalGifRead,this,args);};});
  246 |   await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('暂时没能保存，请再试一次。');expect(await p.evaluate(()=>window.failedGifReads)).toBeGreaterThan(0);expect(downloads).toHaveLength(0);
  247 |   await p.evaluate(()=>{CanvasRenderingContext2D.prototype.getImageData=window.originalGifRead;});const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();const gif=await download;await gif.saveAs(info.outputPath('export-recovered.gif'));
  248 |   const meta=await require('sharp')(info.outputPath('export-recovered.gif'),{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.width).toBe(984);expect(meta.pageHeight).toBe(528);await expect(p.locator('.story-award-status')).toHaveText('动图已生成');expect(downloads).toHaveLength(1);
  249 |   await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('正在保存…');await p.getByRole('link',{name:'我的课程',exact:true}).click();await expect(p.locator('.course')).toHaveCount(1);await expect(p.locator('.course')).toContainText('1 / 5');expect(downloads).toHaveLength(1);
  250 |   await p.goto(base+'unit15-16/#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('.story-award-status')).toBeEmpty();expect(downloads).toHaveLength(1);
  251 |  }finally{await student.context.close();}
  252 | });
  253 | 
  254 | 
  255 | 
```