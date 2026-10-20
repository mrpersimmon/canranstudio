'use strict';
const {test,expect}=require('@playwright/test'),flow=require('../support/unit34-v154');
test.use({browserName:process.env.UNIT34_REVIEW_BROWSER||'chromium',reducedMotion:'reduce'});
test('纪念卡显示真实完成状态，并能从有错结算开始新一轮而不清除旧记录',async({page},info)=>{
 await flow.story(page);await page.goto('/unit3-4/#learn/roles');const room=page.locator('.stage-roles');
 await room.getByRole('button',{name:'外套',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'再试一次',exact:true}).click();await flow.activity(page,'roles');
 await expect(room.locator('.completion-number')).toHaveText(['3','3','1']);await expect(page.locator('#starCount')).toHaveText('0');const before=await flow.book(page);
 await page.goto('/unit3-4/#learn/certificate');await page.locator('.story-award-tasks summary').click();const task=page.locator('.story-award-tasks li').filter({hasText:'故事小侦探'});
 await expect(task).not.toContainText(/待挑战|未开始/);await task.getByRole('button').click();await expect(room.locator('.progress-copy')).toHaveText('第 1 / 3 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 const after=await flow.book(page);expect(after.records).toEqual(before.records);await room.screenshot({path:info.outputPath('new-round-from-card.png')});
 await flow.activity(page,'roles');await expect(page.locator('#starCount')).toHaveText('1');await page.goto('/unit3-4/#learn/certificate');await page.reload();await flow.ready(page);await page.locator('.story-award-tasks summary').click();await expect(task).toContainText(/已获|已完成|已点亮/);await page.locator('.stage-certificate').screenshot({path:info.outputPath('card-progress.png')});
});
