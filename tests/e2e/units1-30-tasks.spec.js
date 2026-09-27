'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('7–8 逐空补完介绍，未填完不能检查，错答后可改且恢复草稿',async({page})=>{
 await page.goto('/unit7-8/#learn/reply');const room=page.locator('.stage-reply');
 await room.getByRole('button',{name:"I'm Italian.",exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 const first=room.getByRole('group',{name:'第1处填空',exact:true}),second=room.getByRole('group',{name:'第2处填空',exact:true}),check=room.getByRole('button',{name:'检查答案',exact:true});
 await first.getByRole('button',{name:'am',exact:true}).click();await expect(check).toBeDisabled();await page.reload();await expect(first.getByRole('button',{name:'am',exact:true})).toHaveAttribute('aria-pressed','true');
 await second.getByRole('button',{name:'am',exact:true}).click();await check.click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await room.getByRole('button',{name:'再试一次',exact:true}).click();await first.getByRole('button',{name:'is',exact:true}).press('Enter');await check.press('Enter');await expect(room.getByRole('status')).toHaveText('答对了！');
 await expect(room.locator('.cloze-sentence').first()).toHaveText('My name is Robert.');await expect(room.locator('.cloze-sentence').nth(1)).toHaveText('I am Italian.');
});
test('1–2 在完整感谢语中找程度词，错选不代答，刷新后原题可重试',async({page})=>{
 await page.addInitScript(()=>{window.Audio=class extends EventTarget{play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};});
 await page.goto('/unit1-2/#learn/text');const story=page.locator('.stage-text');
 await story.getByRole('button',{name:'开始听课文',exact:true}).click();
 for(let i=1;i<7;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();
 await story.getByRole('button',{name:'完成课文学习',exact:true}).click();
 await page.goto('/unit1-2/#learn/roles');const room=page.locator('.stage-roles');
 for(const answer of ['对面的女士','手提包']){await room.getByRole('button',{name:answer,exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 const source=room.getByRole('group',{name:'原文选词',exact:true});
 await expect(source).toContainText('Thank you very much.');
 await source.getByRole('button',{name:'you',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await page.reload();
 await room.getByRole('button',{name:'再试一次',exact:true}).click();
 await source.getByRole('button',{name:'very much',exact:true}).press('Enter');await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');
 await expect(room.getByRole('status')).toHaveText('答对了！');await room.getByRole('button',{name:'完成这一站',exact:true}).click();
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
});
