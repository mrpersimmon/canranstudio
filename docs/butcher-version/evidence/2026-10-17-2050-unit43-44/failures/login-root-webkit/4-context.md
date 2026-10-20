# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit43-44.spec.js >> 长姓名手机卡、另一学生隔离、教师预览不能保存个人成果
- Location: tests\login\unit43-44.spec.js:198:1

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: getByRole('button', { name: '保存动图', exact: true })
Expected: disabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for getByRole('button', { name: '保存动图', exact: true })

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
  193 |     await p.locator('.book').screenshot({path:info.outputPath('comparison-book.png')});
  194 |     await cover.click();await p.getByRole('dialog',{name:'Lesson 43–44 纪念卡'}).screenshot({path:info.outputPath('one-star-book-closeup.png')});
  195 |   }finally{await student.context.close();}
  196 | });
  197 | 
  198 | test('长姓名手机卡、另一学生隔离、教师预览不能保存个人成果',async({page,browser},info)=>{
  199 |  test.setTimeout(70000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  200 |  await adminLogin(page,base);const account=await createStudent(page,'茶桌身份边界班','欧阳小禾同学',[/Lesson 43–44/]);
  201 |  const preview=await page.getByRole('link',{name:'预览这个班',exact:true}).getAttribute('href');
  202 |  const first=await studentLogin(browser,account,base);let other;
  203 |  try{
  204 |   await activity(first.page,'listen',{base:prefix});await first.page.setViewportSize({width:320,height:568});await first.page.goto(base+'unit43-44/#learn/certificate');
  205 |   await expect(first.page.locator('#certificateName')).toHaveText('欧阳小禾同学');
  206 |   const card=first.page.locator('.stage-certificate .story-award-paper'),name=first.page.locator('#certificateName');
  207 |   const b=await card.boundingBox(),n=await name.boundingBox();expect(n.x).toBeGreaterThan(b.x);expect(n.x+n.width).toBeLessThan(b.x+b.width);expect(n.y+n.height).toBeLessThan(b.y+b.height);
  208 |   expect(await name.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollHeight<=el.clientHeight+1)).toBe(true);await card.screenshot({path:info.outputPath('long-name-320.png')});
> 209 |   const second=await require('./helpers').addStudent(page,'小竹');other=await studentLogin(browser,second,base);await other.page.goto(base+'unit43-44/#learn/certificate');await expect(other.page.locator('#starCount')).toHaveText('0');await expect(other.page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
      |                                                                                                                                                                                                                                                                                                               ^ Error: expect(locator).toBeDisabled() failed
  210 |   await page.goto(preview);await page.getByRole('link',{name:/茶具躲猫猫/}).click();await page.goto((await page.url()).replace(/#.*$/,'#learn/certificate'));
  211 |   await expect(page.locator('#starCount')).toHaveText('0');await expect(page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  212 |  }finally{await first.context.close();await other?.context.close();}
  213 | });
  214 | 
  215 | const ready=async p=>expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
  216 | test('关课重开保留收藏，导出故障可重试且离开取消下载',async({page,browser},info)=>{
  217 |  test.setTimeout(150000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  218 |  const {saveCourses}=require('./helpers');await adminLogin(page,base);const account=await createStudent(page,'消息成果保留班','小溪',[/Lesson 43–44/]);
  219 |  const student=await studentLogin(browser,account,base),p=student.page,downloads=[];p.on('download',d=>downloads.push(d));
  220 |  try{
  221 |   await activity(p,'listen',{base:prefix});await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  222 |   await page.getByRole('checkbox',{name:/Lesson 43–44/}).uncheck();await saveCourses(page);
  223 |   await p.goto(base);await expect(p.locator('.course')).toHaveCount(0);
  224 |   await p.getByRole('link',{name:'我的纪念册',exact:true}).click();const oldCard=p.getByRole('button',{name:'放大 Lesson 43–44 茶桌小帮手',exact:true});
  225 |   await expect(oldCard.locator('.certificate')).toHaveAttribute('data-stars','1',{timeout:30000});await oldCard.screenshot({path:info.outputPath('closed-course-collection.png')});
  226 |   await page.getByRole('checkbox',{name:/Lesson 43–44/}).check();await saveCourses(page);
  227 |   await p.goto(base+'unit43-44/#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('#certificateName')).toHaveText('小溪');
  228 |   // Inject a failure at the browser canvas boundary, not in learning or award data.
  229 |   await p.evaluate(()=>{window.originalGifRead=CanvasRenderingContext2D.prototype.getImageData;window.failedGifReads=0;CanvasRenderingContext2D.prototype.getImageData=function(...args){if(this.canvas.width===984&&this.canvas.height===528){window.failedGifReads++;throw new DOMException('Simulated export canvas failure','InvalidStateError');}return Reflect.apply(window.originalGifRead,this,args);};});
  230 |   await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('暂时没能保存，请再试一次。');expect(await p.evaluate(()=>window.failedGifReads)).toBeGreaterThan(0);expect(downloads).toHaveLength(0);
  231 |   await p.evaluate(()=>{CanvasRenderingContext2D.prototype.getImageData=window.originalGifRead;});const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();const gif=await download;await gif.saveAs(info.outputPath('export-recovered.gif'));
  232 |   const meta=await require('sharp')(info.outputPath('export-recovered.gif'),{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.width).toBe(984);expect(meta.pageHeight).toBe(528);await expect(p.locator('.story-award-status')).toHaveText('动图已生成');expect(downloads).toHaveLength(1);
  233 |   await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('正在保存…');await p.getByRole('link',{name:'我的课程',exact:true}).click();await expect(p.locator('.course')).toHaveCount(1);await expect(p.locator('.course')).toContainText('1 / 5');expect(downloads).toHaveLength(1);
  234 |   await p.goto(base+'unit43-44/#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('.story-award-status')).toBeEmpty();expect(downloads).toHaveLength(1);
  235 |  }finally{await student.context.close();}
  236 | });
  237 | 
  238 | 
  239 | 
  240 | 
```