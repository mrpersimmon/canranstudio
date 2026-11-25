'use strict';
const {test,expect}=require('@playwright/test');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseReadyForAssertions}=require('../support/completion-layout');
const flow=require('../support/thirteen-types-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:8000});

for(const device of devices)test(`${device.name}：参考资料不挤压结算，独立查看后恢复原任务`,async({page,browser},info)=>{
 test.setTimeout(120000);await adminLogin(page,base);
 const account=await createStudent(page,'参考资料-'+device.id,'小禾',[/Lesson 1–2 /]);
 const student=await studentLogin(browser,account,base,contextOptions(device)),p=student.page;
 const saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1')));
 try{
  await flow.activity(p,'1-2','manners',{base:base.slice(0,-1)});const room=p.locator('.stage-manners');
  await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await p.screenshot({path:info.outputPath('result.png'),scale:'css'});
  for(const reference of await room.locator(':scope > details.grammar-reference').all())await expect(reference).not.toBeVisible();
  await expect(room.getByRole('list',{name:'本轮成果'})).toBeInViewport({ratio:1});
  const next=room.getByRole('button',{name:'下一站：综合挑战',exact:true}),beforeBox=await next.boundingBox(),before=await saved();
  const more=p.getByRole('button',{name:'更多学习操作',exact:true});await more.tap();await p.getByRole('button',{name:'礼貌用语',exact:true}).tap();
  const phrases=p.getByRole('dialog',{name:'礼貌用语',exact:true});await expect(phrases).toBeVisible();await expect(p.locator('dialog[open]')).toHaveCount(1);
  await expect(phrases.locator('dt')).toHaveText(['Excuse me!','Yes?','Pardon?','Yes, it is.','Thank you very much.']);
  await expect(phrases.locator('dt').filter({hasText:'Pardon?'}).locator('+ dd')).toHaveText('没听清，请再说一遍');
  const box=await phrases.boundingBox();expect(box.x).toBeGreaterThanOrEqual(14);expect(box.y).toBeGreaterThanOrEqual(16);expect(Math.abs(box.x+box.width/2-device.viewport.width/2)).toBeLessThanOrEqual(1);
  expect(await phrases.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);await p.screenshot({path:info.outputPath('phrases.png'),scale:'css'});
  await phrases.locator('dd').last().scrollIntoViewIfNeeded();const close=phrases.getByRole('button',{name:'关闭学习参考',exact:true});await expect(close).toBeInViewport({ratio:1});await close.tap();await expect(more).toBeFocused();
  expect(await saved()).toEqual(before);expect((await next.boundingBox()).y).toBe(beforeBox.y);
  await more.tap();await p.getByRole('button',{name:'换个物品问一问',exact:true}).tap();const models=p.getByRole('dialog',{name:'换个物品问一问',exact:true});
  const originals=await room.locator(':scope > details.grammar-reference .phrase-card strong').allTextContents();await expect(models.locator('.phrase-card strong')).toHaveText(originals);
  await models.locator('.phrase-card').last().scrollIntoViewIfNeeded();await expect(models.locator('.phrase-card').last()).toBeInViewport({ratio:1});await expect(models.getByRole('button',{name:'关闭学习参考'})).toBeInViewport({ratio:1});
  await p.screenshot({path:info.outputPath('models-last.png'),scale:'css'});await models.press('Escape');await expect(more).toBeFocused();expect(await saved()).toEqual(before);
  // The same reference entry remains available during a new active round.
  await room.getByRole('button',{name:'再练一轮',exact:true}).tap();await expect(room.locator('.progress-copy')).toHaveText('第 1 / 5 题');const draft=await saved();
  await more.tap();await p.getByRole('button',{name:'礼貌用语',exact:true}).tap();await phrases.getByRole('button',{name:'关闭学习参考'}).tap();expect(await saved()).toEqual(draft);
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeInViewport({ratio:1});
  await p.reload();await courseReadyForAssertions(p);await expect(room.locator('.progress-copy')).toHaveText('第 1 / 5 题');
 }finally{await student.context.close();}
});
