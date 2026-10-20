'use strict';

const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000,...(process.env.UNIT2324_BROWSER==='webkit'?{browserName:'webkit'}:{})});
async function reachContainers(page){
 await page.goto('/unit23-24/#learn/listen');
 const room=page.locator('.stage-listen');
 for(const answer of ['在……上面','架子；搁板','书桌；课桌','table']){
  await room.getByRole('button',{name:answer,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await room.getByRole('button',{name:'下一题',exact:true}).click();
 }
 return room;
}
async function pair(room,left,right){
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:left,exact:true}).click();
 await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:right,exact:true}).click();
}
test('配对先完整选择再检查，错配和刷新保留原位，修改后才计进度',async({page})=>{
 const room=await reachContainers(page),check=room.getByRole('button',{name:'检查答案',exact:true});
 await expect(room.getByRole('heading',{name:'给物品词选择配对',exact:true})).toBeVisible();
 await expect(room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'杂志',exact:true})).toBeDisabled();
 const labels=await room.getByRole('group',{name:'词义',exact:true}).getByRole('button').evaluateAll(xs=>xs.map(x=>x.getAttribute('aria-label')));
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'plate',exact:true}).press('Enter');
 await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'杂志',exact:true}).press('Enter');await expect(check).toBeDisabled();
 await page.reload();await expect(room.locator('.match-count')).toHaveText('已配 1 / 3 对');await expect(check).toBeDisabled();
 await pair(room,'magazine','盘子');await pair(room,'newspaper','报纸');
 await expect(room.getByRole('status')).toBeEmpty();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','4');
 await check.click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await expect(room.locator('.is-correct')).toHaveCount(0);
 await room.getByRole('button',{name:'再试一次',exact:true}).click();
 expect(await room.getByRole('group',{name:'词义',exact:true}).getByRole('button').evaluateAll(xs=>xs.map(x=>x.getAttribute('aria-label')))).toEqual(labels);
 await pair(room,'plate','盘子');await expect(check).toBeDisabled();
 await pair(room,'newspaper','报纸');await expect(room.locator('.match-count')).toHaveText('已配 1 / 3 对');await pair(room,'newspaper','报纸');
 await pair(room,'magazine','杂志');await check.click();
 await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','5');
 await page.getByRole('button',{name:'学习手记',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'学习手记',exact:true})).toContainText('修正后完成');
});
test('原文定位保留完整句子，错选只提示重试，点选不直接判分',async({page})=>{
 await require('../support/unit2324-fivezones').story(page);
 await page.goto('/unit23-24/#learn/roles');const room=page.locator('.stage-roles');
 const text=room.getByRole('group',{name:'原文选词',exact:true});
 await expect(text).toContainText('The ones on the shelf.');
 await text.getByRole('button',{name:'The ones',exact:true}).click();
 await expect(room.getByRole('status')).toBeEmpty();
 await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await page.reload();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
 await room.getByRole('button',{name:'再试一次',exact:true}).click();
 await text.getByRole('button',{name:'on the shelf',exact:true}).press('Enter');
 await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');
 await expect(room.getByRole('status')).toHaveText('答对了！');
 await room.getByRole('button',{name:'下一题',exact:true}).click();
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
