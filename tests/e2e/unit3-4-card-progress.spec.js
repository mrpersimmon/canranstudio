'use strict';
const {test,expect}=require('@playwright/test'),flow=require('../support/unit34-v154');
test.use({browserName:process.env.UNIT34_REVIEW_BROWSER||'chromium',reducedMotion:'reduce'});
test('纪念卡只用顶部获星进度，返回有错结算后重练不清除旧记录',async({page},info)=>{
 await flow.story(page);await page.goto('/unit3-4/#learn/roles');const room=page.locator('.stage-roles');
 await room.getByRole('button',{name:'外套',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'再试一次',exact:true}).click();await flow.activity(page,'roles');
 await expect(room.locator('.completion-stat-label')).toHaveText(['连续答对','首答正确','订正完成']);await expect(room.locator('.completion-number')).toHaveText(['3','2','1']);await expect(page.locator('#starCount')).toHaveText('0');const before=await flow.book(page);
 await page.goto('/unit3-4/#learn/certificate');await expect(page.locator('.story-award-tasks')).toHaveCount(0);const task=page.locator('.learning-milestones [data-zone="roles"]');
 await expect(task).toHaveAttribute('aria-label',/已学完，未获星/);await page.goto('/unit3-4/#learn/roles');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await expect(room.locator('.progress-copy')).toHaveText('第 1 / 3 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 const after=await flow.book(page);expect(after.records).toEqual(before.records);await room.screenshot({path:info.outputPath('new-round-from-card.png')});
 await flow.activity(page,'roles');await expect(page.locator('#starCount')).toHaveText('1');await page.goto('/unit3-4/#learn/certificate');await page.reload();await flow.ready(page);await expect(task).toHaveAttribute('aria-label',/已获星/);await page.locator('.stage-certificate').screenshot({path:info.outputPath('card-progress.png')});
});
