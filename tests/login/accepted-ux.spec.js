'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const flow=require('../support/thirteen-types-flow');
const {dismissRewardDialog}=require('../support/reward-dialog');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:8000});
async function start(page,browser,name,options){await adminLogin(page,base);const account=await createStudent(page,name,'小禾',[/Lesson 1–2 /]);return studentLogin(browser,account,base,options);}
const saved=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1')));

for(const device of devices)test(`${device.name}：固定翻组、简短错答、已学进度、记录关闭及回看返回`,async({page,browser},info)=>{
 test.setTimeout(180000);const s=await start(page,browser,'确认体验-'+device.id,contextOptions(device)),p=s.page;
 try{
  await p.goto(base+'unit1-2/#learn/words');await courseReadyForAssertions(p);const words=p.locator('.stage-words');
  await expect(words.getByRole('button',{name:'下一组',exact:true})).toBeInViewport({ratio:1});await expect(words.locator('#wordPageProgress')).toBeInViewport({ratio:1});
  await p.screenshot({path:info.outputPath('words.png'),scale:'css'});
  await words.getByRole('button',{name:'handbag',exact:true}).click();await expect(words.getByRole('button',{name:'handbag',exact:true})).toContainText('手提包');
  for(let i=0;i<3;i++)await words.getByRole('button',{name:'下一组',exact:true}).click();await expect(words.getByRole('button',{name:'下一站：单词寻宝',exact:true})).toBeInViewport({ratio:1});
  await expect(words.locator('.learning-word-destination')).toHaveText('接下来：单词寻宝');
  await words.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();const room=p.locator('.stage-listen');
  await expect(room.locator('.fb')).toHaveText('本组每题一次答对，可点亮一颗星。');
  await flow.select(room,{pairs:[['coat','连衣裙'],['dress','外套'],['skirt','半身裙']]});await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.locator('.fb')).toHaveText('答错了，再试试。');await room.getByRole('button',{name:'再试一次',exact:true}).click();
  // Matching retries preserve correct pairs; clicking that same pair again
  // would deliberately unpair it. Correct only the two changed associations.
  await flow.select(room,{pairs:[['coat','外套'],['dress','连衣裙']]});await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();
  await flow.activity(p,'1-2','listen',{base:base.slice(0,-1),navigate:false});await expect(p.locator('.learning-milestones .is-complete')).toHaveCount(1);await expect(p.locator('#starCount')).toHaveText('0');
  await expect(room.locator('.stat-streak img')).toBeVisible();await expect(room.locator('.completion-award')).toHaveText('已完成！再练一轮全对，可点亮星星。');
  await expect(room.locator('.station-destination')).toHaveText('接下来：相遇小剧场');
  const before=await saved(p);await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:'学习记录',exact:true}).click();
  const notebook=p.getByRole('dialog',{name:'学习记录',exact:true});await expect(notebook.locator('.learning-record-group[open]')).toContainText('单词寻宝');await expect(notebook).toContainText('本轮订正完成');
  await notebook.getByText('家长说明',{exact:true}).click();await expect(notebook.getByRole('button',{name:'关闭',exact:true})).toBeInViewport({ratio:1});
  await p.screenshot({path:info.outputPath('records.png'),scale:'css'});const notebookBox=await notebook.boundingBox();await p.mouse.click(notebookBox.x-5,notebookBox.y+20);await expect(notebook).not.toBeVisible();expect(await saved(p)).toEqual(before);
  await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:'回看本轮答题',exact:true}).click();await expect(room.locator('.fb')).toHaveText('订正后答对');
  await room.getByRole('button',{name:'返回结果',exact:true}).click();expect(await saved(p)).toEqual(before);
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await expect(p.getByRole('list',{name:'学习进度：已学 1 / 5 个阶段',exact:true})).toBeVisible();await expect(p.locator('#starCount')).toHaveText('0');
  await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:'学习记录',exact:true}).click();await expect(notebook).toContainText('此前订正完成');await notebook.press('Escape');
  await p.reload();await courseReadyForAssertions(p);await expect(p.locator('.learning-milestones .is-complete')).toHaveCount(1);await expect(room.locator('.progress-copy')).toHaveText('第 1 / 5 题');
 }finally{await s.context.close();}
});

test('课文末句一次进入练习，全文独立阅读、文案与桌面工作区正确',async({page,browser},info)=>{
 test.setTimeout(120000);const s=await start(page,browser,'全文与文案',contextOptions(devices[0])),p=s.page;
 try{
  await p.goto(base+'unit1-2/#learn/text');await courseReadyForAssertions(p);const story=p.locator('.stage-text');await story.getByRole('button',{name:'开始故事',exact:true}).click();for(let i=1;i<7;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();
  await story.getByRole('button',{name:'去练习',exact:true}).click();await expect(p).toHaveURL(/#learn\/roles$/);
  const room=p.locator('.stage-roles');await flow.select(room,['这是','你的','手提包','吗？']);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
  const before=await saved(p),full=room.getByRole('button',{name:'查看全文',exact:true});await expect(full).toBeInViewport({ratio:1});await full.click();const reading=p.getByRole('dialog',{name:'完整故事',exact:true});await expect(reading.locator('.task-reading-turn')).toHaveCount(7);await reading.locator('.task-reading-turn').last().scrollIntoViewIfNeeded();await expect(reading.getByRole('button',{name:'关闭学习参考'})).toBeInViewport({ratio:1});await reading.press('Escape');await expect(full).toBeFocused();expect(await saved(p)).toEqual(before);
  await p.goto(base+'unit1-2/#learn/trans');await courseReadyForAssertions(p);const grammar=p.locator('.stage-trans');
  for(let i=0;i<4;i++){await flow.select(grammar,flow.ANSWERS['1-2'].trans[i]);await grammar.getByRole('button',{name:'检查答案',exact:true}).click();await grammar.getByRole('button',{name:'下一题',exact:true}).click();}
  await expect(grammar.getByRole('heading',{name:'用词块问：我是学生吗？',exact:true})).toBeVisible();
  await p.setViewportSize({width:1435,height:1244});await expect(p.locator('body')).toHaveAttribute('data-practice-viewport','1435x1244');
  const gap=await grammar.evaluate(el=>el.querySelector('.practice-submit-row').getBoundingClientRect().top-el.querySelector('.practice-content').getBoundingClientRect().bottom);expect(gap).toBeLessThanOrEqual(220);await p.screenshot({path:info.outputPath('desktop.png')});
  await p.goto(base+'unit1-2/#learn/exam');await courseReadyForAssertions(p);await expect(p.locator('.stage-exam .learning-question-heading .task-reference')).toHaveText('手提包是女士的。');
 }finally{await s.context.close();}
});

test('奖卡退出优先继续，满星入口与单张收藏不误导',async({page,browser},info)=>{
 test.setTimeout(240000);const s=await start(page,browser,'奖励与首页',contextOptions(devices[0])),p=s.page;
 try{
  await flow.activity(p,'1-2','listen',{base:base.slice(0,-1),keepAward:true});const reveal=p.getByRole('dialog',{name:/纪念卡结算/});await expect(reveal).toHaveAttribute('data-dismissible','true');await reveal.press('Escape');const next=p.locator('.stage-listen').getByRole('button',{name:'下一站：相遇小剧场',exact:true});await expect(next).toBeFocused();await next.press('Enter');await expect(p).toHaveURL(/#learn\/text$/);
  await flow.complete(p,'1-2',base.slice(0,-1));const awards=(await(await p.request.get(base+'api/awards')).json()).cards;
  await p.getByRole('link',{name:'我的课程',exact:true}).click();
  const directory=p.getByRole('dialog',{name:'全部课程',exact:true});await expect(directory).toBeVisible();await directory.getByRole('button',{name:'关闭课程目录',exact:true}).click();await expect(directory).not.toBeVisible();
  const entry=p.getByRole('region',{name:'当前课程',exact:true}).getByRole('link',{name:'查看纪念卡：礼貌小帮手',exact:true});await expect(entry).toBeVisible();await entry.click();await expect(p).toHaveURL(/#learn\/certificate$/);await courseReadyForAssertions(p);
  await p.getByRole('link',{name:'我的纪念册',exact:true}).click();await p.getByRole('button',{name:'查看并保存纪念卡：Lesson 1–2 礼貌小帮手',exact:true}).click();const card=p.getByRole('dialog',{name:'Lesson 1–2 纪念卡',exact:true});await expect(card.getByRole('button',{name:'上一张纪念卡'})).toHaveCount(0);await expect(card.getByRole('button',{name:'下一张纪念卡'})).toHaveCount(0);await expect(card.getByRole('button',{name:'保存动图',exact:true})).toBeInViewport({ratio:1});
  await p.screenshot({path:info.outputPath('single-card.png'),scale:'css'});expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual(awards);
 }finally{await s.context.close();}
});
