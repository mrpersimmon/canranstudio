'use strict';
const {test,expect}=require('@playwright/test');
const {legacy,audioBoundary}=require('../support/unit4950-legacy');
const {activity,story}=require('../support/unit4950');
// Original-paper comparison uses the agreed Shanghai calendar day.
// UTC/Honolulu cross-day preservation is covered by units17-30-upgrade in login.
test.use({timezoneId:'Asia/Shanghai'});
for(const selected of [false,true])test(`旧${selected?'已选未交':'空白'}草稿升级：新题不代答，新轮全对正常获星`,async({page})=>{
 const upgrade=await legacy(page);await page.goto('/unit49-50/#learn/listen');
 if(selected)await page.locator('.stage-listen').getByRole('button',{name:'butcher',exact:true}).click();
 await page.reload();await upgrade();await page.reload();
 const room=page.locator('.stage-listen');await expect(room.locator('.progress-copy')).toHaveText('第 1 / 8 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('button',{pressed:true})).toHaveCount(0);
 await activity(page,'listen');await expect(page.locator('#starCount')).toHaveText('1');await page.reload();await expect(page.locator('#starCount')).toHaveText('1');
});
test('旧故事真实读到中段后升级，保留已展示的原文，不代做理解题',async({page})=>{
 const upgrade=await legacy(page);await audioBoundary(page);await page.goto('/unit49-50/#learn/text');const room=page.locator('.stage-text');
 await room.getByRole('button',{name:'开始听课文',exact:true}).click();for(let i=0;i<4;i++)await room.getByRole('button',{name:'下一句',exact:true}).click();
 await upgrade();await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(5);await expect(room.locator('.bubble-row').last()).toContainText('This lamb’s very good.');
 await story(page);await page.goto('/unit49-50/#learn/roles');await expect(page.locator('.stage-roles .progress-copy')).toHaveText('第 1 / 6 题');await expect(page.locator('.stage-roles').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(page.locator('#starCount')).toHaveText('0');
});
test('真实旧版15星、姓名和领证日期保留为历史；五个新区均未作答',async({page})=>{
 test.setTimeout(120000);const upgrade=await legacy(page);await require('../support/unit49-50-flow').completeUnit(page);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const date=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');
 await upgrade();await page.reload();await expect(page.locator('#starCount')).toHaveText('0');
 const history=page.locator('.legacy-learning');await history.locator('summary').click();await expect(history).toContainText('15 / 15');expect((await history.locator('.legacy-issued-date').innerText()).match(/\d+/g)).toEqual(date.match(/\d+/g));await expect(history.locator('.legacy-name')).toContainText('小禾');
 for(const[id,count]of [['listen',8],['roles',6],['grammar',14],['apply',8],['exam',24]]){await page.goto('/unit49-50/#learn/'+id);const room=page.locator('.stage-'+id);await expect(room.locator('.progress-copy')).toHaveText(`第 1 / ${count} 题`);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();}
 await activity(page,'listen');await expect(page.locator('#starCount')).toHaveText('1');await page.goto('/unit49-50/#learn/certificate');await history.locator('summary').click();await expect(history).toContainText('15 / 15');
});
test('旧路线进入对应新区，返回首页与继续冒险均可恢复新位置',async({page})=>{
 for(const[old,id]of [['doare','grammar'],['subjects','apply'],['trans','apply'],['give','apply'],['either','apply']]){await page.goto('/unit49-50/#learn/'+old);await expect(page).toHaveURL(new RegExp('#learn/'+id+'$'));await expect(page.locator('.stage-'+id)).toBeVisible();}
 await page.getByRole('link',{name:'我的课程',exact:true}).click();const card=page.getByRole('region',{name:'晚餐采购大冒险',exact:true});await card.getByRole('link',{name:'继续学习',exact:true}).click();await expect(page).toHaveURL(/#learn\/apply$/);
});
