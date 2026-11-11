'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseReadyForAssertions}=require('../support/completion-layout');
const {devices,contextOptions}=require('../support/required-phone-devices');
const flows={'3-4':require('../support/unit34-v154'),'5-6':require('../support/unit56-v154')};
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const cases=[{pair:'3-4',grammar:'reply',reference:'认领表达参考'},{pair:'5-6',grammar:'introduce',reference:'介绍表达参考'}];
const answer=(pair,id,i)=>pair==='3-4'?flows[pair].ANSWERS[id][i]:flows[pair].CURRENT[id][i].answer;
const snapshot=p=>p.evaluate(()=>{const n=JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey));return {groups:n.groups,records:n.records};});
async function start(page,browser,c,device){await adminLogin(page,base);const a=await createStudent(page,'新学习界面-'+c.pair+'-'+device.id,'小禾',[new RegExp('Lesson '+c.pair.replace('-','–')+' ')]);return studentLogin(browser,a,base,contextOptions(device));}
async function correct(room,pair,id,i){await flows[pair].select(room,answer(pair,id,i));await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');}
test.use({actionTimeout:8000});

for(const c of cases)for(const device of devices)test(`${c.pair} ${device.name}：统一导航、完整故事、回看与参考可用`,async({page,browser},info)=>{
 test.setTimeout(150000);const s=await start(page,browser,c,device),p=s.page;
 try{
  await p.addInitScript(()=>{window.learningGuardEntries=0;let ready=false;document.addEventListener('canran:course-ready',()=>ready=true);new MutationObserver(rows=>{if(ready)for(const r of rows)if(r.attributeName==='data-course-painting'&&r.oldValue===null)window.learningGuardEntries++;}).observe(document,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['data-course-painting']});});
  await p.goto(base+'unit'+c.pair+'/#learn/words');await courseReadyForAssertions(p);await p.screenshot({path:info.outputPath('words.png'),scale:'css'});
  await expect(p.locator('body')).toHaveAttribute('data-learning-shell','');await expect(p.locator('.learning-milestones a')).toHaveCount(5);await expect(p.getByRole('combobox',{name:'切换学习关卡'})).toHaveCount(0);
  await expect(p.getByRole('button',{name:'下一组词卡',exact:true})).toBeInViewport({ratio:1});const word=p.locator('.unit-word').first();await word.click();await expect(word.locator('.word-meaning')).toBeVisible();await word.click();
  await p.locator('.learning-milestones').getByRole('link',{name:'故事',exact:true}).click();const story=p.locator('.stage-text');await expect(story).toHaveClass(/learning-surface/);
  await story.getByRole('button',{name:'开始故事',exact:true}).click();for(let i=1;i<flows[c.pair].DIALOGUE.length;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();
  const log=story.getByRole('log',{name:'课文对话',exact:true}),last=log.locator('.bubble-row').last();
  await info.attach('story-geometry',{body:JSON.stringify(await log.evaluate(el=>({log:el.getBoundingClientRect().toJSON(),scroll:el.scrollTop,scrollLeft:el.scrollLeft,total:el.scrollHeight,last:el.lastElementChild.getBoundingClientRect().toJSON(),parent:el.parentElement.getBoundingClientRect().toJSON(),scene:el.closest('.dialogue-stage').getBoundingClientRect().toJSON(),styles:{position:getComputedStyle(el).position,top:getComputedStyle(el).top,bottom:getComputedStyle(el).bottom,height:getComputedStyle(el).height,display:getComputedStyle(el).display}}))),contentType:'application/json'});
  await p.screenshot({path:info.outputPath('story-before-translation.png'),scale:'css'});await expect(last).toBeInViewport({ratio:1});await expect(log).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  await last.getByRole('button',{name:'看中文',exact:true}).click();await expect(last.locator('.bcn')).toBeInViewport({ratio:1});
  const geometry=await story.locator('.dialogue-stage').evaluate(scene=>{const b=scene.getBoundingClientRect();return {h:b.height,overflow:scene.scrollWidth-scene.clientWidth,actors:[...scene.querySelectorAll('.dialogue-actor>img,.classroom-person>img')].map(im=>{const r=im.getBoundingClientRect();return {source:im.currentSrc,inside:r.left>=b.left-1&&r.right<=b.right+1&&r.top>=b.top-1&&r.bottom<=b.bottom+1,height:r.height};})};});
  expect(geometry.h).toBeLessThanOrEqual(640);expect(geometry.overflow).toBeLessThanOrEqual(1);expect(geometry.actors.length).toBeGreaterThanOrEqual(2);expect(geometry.actors.every(x=>x.inside&&x.height>=100)).toBe(true);
  await p.screenshot({path:info.outputPath('story-last.png'),scale:'css'});await story.getByRole('button',{name:'去练习',exact:true}).click();await expect(p).toHaveURL(/#learn\/roles$/);
  const room=p.locator('.stage-roles');await correct(room,c.pair,'roles',0);await room.getByRole('button',{name:'下一题',exact:true}).click();const saved=await snapshot(p);await room.getByRole('button',{name:'上一题',exact:true}).click();await expect(room.locator('.progress-copy')).toHaveText('回看 1 / 3');expect(await snapshot(p)).toEqual(saved);await room.getByRole('button',{name:'回到当前题',exact:true}).click();expect(await snapshot(p)).toEqual(saved);
  await p.locator('.learning-milestones').getByRole('link',{name:'语法',exact:true}).click();const grammar=p.locator('.stage-'+c.grammar);await correct(grammar,c.pair,c.grammar,0);
  if(c.pair==='3-4'){
   const help=grammar.getByRole('button',{name:'讲解',exact:true});await expect(help.locator('img')).toHaveAttribute('src',/hint\.svg$/);const x=await help.boundingBox(),a=await grammar.getByRole('button',{name:'上一题',exact:true}).boundingBox(),b=await grammar.getByRole('button',{name:'下一题',exact:true}).boundingBox();expect(x.x).toBeGreaterThanOrEqual(a.x+a.width);expect(x.x+x.width).toBeLessThanOrEqual(b.x);
  }
  const before=await snapshot(p);await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:'学习记录',exact:true}).click();const records=p.getByRole('dialog',{name:'学习记录',exact:true});await expect(records.locator('.learning-record-group[open]')).toHaveAttribute('data-activity',c.grammar);await expect(records.getByRole('button',{name:'关闭',exact:true})).toBeInViewport({ratio:1});await records.getByRole('button',{name:'关闭',exact:true}).click();
  await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:c.reference,exact:true}).click();const refs=p.getByRole('dialog',{name:c.reference,exact:true});await expect(refs).toBeVisible();await expect(refs.getByRole('button',{name:'关闭学习参考',exact:true})).toBeInViewport({ratio:1});await p.screenshot({path:info.outputPath('reference.png'),scale:'css'});await refs.getByRole('button',{name:'关闭学习参考',exact:true}).click();expect(await snapshot(p)).toEqual(before);
  expect(await p.evaluate(()=>window.learningGuardEntries)).toBe(0);await p.reload();await courseReadyForAssertions(p);expect(await snapshot(p)).toEqual(before);await expect(grammar.locator('.fb')).toHaveText('答对了！');await expect(p.locator('#starCount')).toHaveText('0');expect(await p.evaluate(()=>window.learningGuardEntries)).toBe(0);
  // Completed reading mounts its unlocked practice before the word grid exists.
  // A new account cannot expose this startup-order regression.
  await p.goto(base+'unit'+c.pair+'/#learn/words');await p.reload();await courseReadyForAssertions(p);await expect(p.locator('.learning-word-content .unit-word')).toHaveCount(6);expect(await snapshot(p)).toEqual(before);
 }finally{await s.context.close();}
});

for(const c of cases)test(`${c.pair}：订正、题数统计、重练里程碑与旧记录保持`,async({page,browser},info)=>{
 test.setTimeout(150000);const s=await start(page,browser,c,devices[0]),p=s.page;
 try{
  await p.goto(base+'unit'+c.pair+'/#learn/'+c.grammar);await courseReadyForAssertions(p);const room=p.locator('.stage-'+c.grammar),right=answer(c.pair,c.grammar,0);
  await room.locator('.practice-options').getByRole('button').filter({hasNotText:right}).first().click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答错了，再试试。');await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await flows[c.pair].activity(p,c.grammar,{base:base.slice(0,-1),navigate:false});const total=c.pair==='3-4'?10:11;
  await expect(room.locator('.completion-stat-label')).toHaveText(['连续答对','首答正确','订正完成']);await expect(room.locator('.completion-number')).toHaveText([String(total),String(total-1),'1']);await expect(p.locator('#starCount')).toHaveText('0');await expect(p.locator('.learning-milestones .is-complete')).toHaveCount(0);await expect(p.locator('.learning-course')).toContainText('已学 1/5');
  await p.screenshot({path:info.outputPath('corrected-result.png'),scale:'css'});const saved=await snapshot(p);await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:'回看本轮答题',exact:true}).click();await expect(room.locator('.fb')).toHaveText('订正后答对');await room.getByRole('button',{name:'返回结果',exact:true}).click();expect(await snapshot(p)).toEqual(saved);
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await expect(p.locator('.learning-milestones .is-complete')).toHaveCount(0);await expect(p.locator('.learning-course')).toContainText('已学 1/5');await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:'学习记录',exact:true}).click();await expect(p.locator('#unitNotebook')).toContainText('此前订正完成');await p.locator('#unitNotebook').getByRole('button',{name:'关闭',exact:true}).click();await p.reload();await courseReadyForAssertions(p);await expect(room.locator('.progress-copy')).toHaveText(`第 1 / ${total} 题`);await expect(p.locator('.learning-milestones .is-complete')).toHaveCount(0);await expect(p.locator('.learning-course')).toContainText('已学 1/5');
 }finally{await s.context.close();}
});

test('3-4：完整词库展开、固定分页与桌面课文均可用',async({page,browser},info)=>{
 test.setTimeout(150000);const c=cases[0],s=await start(page,browser,c,devices[0]),p=s.page;
 try{
  await p.goto(base+'unit3-4/#learn/words');await courseReadyForAssertions(p);
  const source=await p.evaluate(()=>CanranCore.learningContext.learning.WORDS.map(w=>({en:w.en,cn:w.cn,ph:w.ph,example:w.example||''})));
  const pages=Math.ceil(source.length/6);
  for(const {width,height}of [{width:320,height:568},...devices.map(d=>d.viewport)]){
   await p.setViewportSize({width,height});
   while(await p.getByRole('button',{name:'上一组词卡',exact:true}).isEnabled())await p.getByRole('button',{name:'上一组词卡',exact:true}).click();
   for(let group=0;group<pages;group++){
    await expect(p.locator('#wordPageProgress')).toHaveText(`${group+1} / ${pages}`);
    const cards=await p.locator('.unit-word').all();
    for(let i=0;i<cards.length;i++){
     const card=cards[i],word=source[group*6+i],heightBefore=(await card.boundingBox()).height;
     await card.click();await expect(card.locator('strong')).toHaveText(word.en);await expect(card.locator('.word-meaning')).toHaveText(word.cn);await expect(card.locator('.word-phonetic')).toHaveText(word.ph);if(word.example)await expect(card.locator('.word-example')).toHaveText(word.example);
     expect((await card.boundingBox()).height).toBe(heightBefore);
     expect(await card.evaluate(el=>{const box=el.getBoundingClientRect();return [...el.children].filter(c=>c.getClientRects().length&&!c.hidden).filter(c=>{const b=c.getBoundingClientRect();return b.top<box.top||b.bottom>box.bottom||b.left<box.left||b.right>box.right||c.scrollWidth>c.clientWidth+1;}).map(c=>c.textContent);})).toEqual([]);
     await card.click();
    }
    const next=p.getByRole('button',{name:group===pages-1?'下一站：单词寻宝':'下一组词卡',exact:true});await expect(next).toBeInViewport({ratio:1});
    if(group<pages-1)await next.click();
   }
  }
  await p.setViewportSize({width:1435,height:1244});await flows['3-4'].story(p,base.slice(0,-1));await p.goto(base+'unit3-4/#learn/text');await courseReadyForAssertions(p);
  const scene=p.locator('.stage-text .dialogue-stage');expect((await scene.boundingBox()).height).toBeLessThanOrEqual(560);await expect(scene.locator('.bubble-row').last()).toBeInViewport({ratio:1});await p.screenshot({path:info.outputPath('story-desktop.png'),scale:'css'});
 }finally{await s.context.close();}
});

test('5-6：原班级人物、桌面与短横屏阅读和独立合影可达',async({page,browser},info)=>{
 test.setTimeout(120000);const c=cases[1],s=await start(page,browser,c,devices[0]),p=s.page;
 try{
  await flows['5-6'].story(p,base.slice(0,-1));await p.goto(base+'unit5-6/#learn/text');await courseReadyForAssertions(p);
  for(const viewport of [{width:1435,height:1244},{width:768,height:1024},{width:667,height:375}]){
   await p.setViewportSize(viewport);const stage=p.locator('.stage-text'),scene=stage.locator('.dialogue-stage');
   expect((await scene.boundingBox()).height).toBeLessThanOrEqual(560);await expect(stage.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeInViewport({ratio:1});
   expect(await stage.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);await p.screenshot({path:info.outputPath(`classroom-${viewport.width}.png`),scale:'css'});
  }
  await p.setViewportSize(devices[0].viewport);await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:'班级合影',exact:true}).click();const sheet=p.getByRole('dialog',{name:'班级合影',exact:true});await expect(sheet.locator('.photo-people img')).toHaveCount(7);await expect(sheet.getByRole('button',{name:'关闭学习参考'})).toBeInViewport({ratio:1});await p.screenshot({path:info.outputPath('class-photo.png'),scale:'css'});
 }finally{await s.context.close();}
});
