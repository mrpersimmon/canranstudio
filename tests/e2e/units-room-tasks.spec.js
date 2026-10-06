'use strict';
const {test,expect}=require('@playwright/test');
const {story}=require('../support/units1-30-tasks');
test.use({reducedMotion:'reduce',actionTimeout:4000});
for(const[pair,correct,wrong,copy]of [['27-28','音响上的书','电视机上的杂志','There are some books on the stereo.']])test(`${pair} 在房间内依据英文找物，选择后不直接判分`,async({page})=>{
 await story(page,pair);await page.goto(`/unit${pair}/#learn/roles`);const room=page.locator('.stage-roles');
 const scene=room.getByRole('group',{name:'在场景中选择',exact:true});await expect(room.locator('.task-reference')).toHaveText(copy);
 await scene.getByRole('button',{name:wrong,exact:true}).click();await expect(room.getByRole('status')).toBeEmpty();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();await scene.getByRole('button',{name:correct,exact:true}).press('Enter');await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');await expect(room.getByRole('status')).toHaveText('答对了！');
});
