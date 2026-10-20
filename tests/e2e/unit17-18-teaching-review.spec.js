'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS,select,activity}=require('../support/unit1718-fivezones');
const {beforeReview,readLearning}=require('../support/unit1718-teaching-review');
test.use({actionTimeout:7000,...(process.env.UNIT1718_BROWSER==='webkit'?{browserName:'webkit'}:{})});
async function answerThenNext(room,answer){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}

test('首组不规则复数有错开的短示范；新词就近释义，示范使用如实入手记',async({page},info)=>{
 await page.setViewportSize({width:320,height:568});await page.goto('/unit17-18/#learn/grammar');const room=page.locator('.stage-grammar');
 for(const answer of ANSWERS.grammar.slice(0,3))await answerThenNext(room,answer);
 const model=room.getByRole('region',{name:'短示范',exact:true});
 await expect(model).toContainText('one milkman → two milkmen');await expect(model).toContainText('one knife → two knives');
 await expect(model).not.toContainText('housewives');await expect(model).not.toContainText('policewomen');
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await room.screenshot({path:info.outputPath('grammar4-unanswered-320.png')});
 await answerThenNext(room,ANSWERS.grammar[3]);
 const saved=await readLearning(page);expect(saved.records['u1718-tasks-v4-plural-labels'].revealed).toBe(true);
 await expect(room.getByRole('note',{name:'本题词义',exact:true})).toHaveText('child：孩子；foot：脚；tooth：牙齿；mouse：老鼠。');
 await expect(room.getByRole('note',{name:'本题词义',exact:true})).not.toContainText('children');
 await room.screenshot({path:info.outputPath('grammar5-unanswered-320.png')});
 await answerThenNext(room,ANSWERS.grammar[4]);await page.reload();expect((await readLearning(page)).records['u1718-tasks-v4-plural-labels'].revealed).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('当前62题版错答、两空草稿、阅读词卡与两处参考分页原样续做',async({page})=>{
 const upgrade=await beforeReview(page);await page.goto('/unit17-18/#learn/words');
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
 await page.goto('/unit17-18/#learn/text');await page.getByRole('button',{name:'开始看课文',exact:true}).click();for(let i=0;i<6;i++)await page.getByRole('button',{name:'下一句',exact:true}).click();
 await page.goto('/unit17-18/#learn/apply');await page.getByText('课本小参考 · 第18课',{exact:true}).click();for(let i=0;i<4;i++)await page.getByRole('button',{name:'下一幅职业图',exact:true}).click();for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一份问答',exact:true}).click();
 await page.goto('/unit17-18/#learn/listen');const listen=page.locator('.stage-listen');await select(listen,'老板');await listen.getByRole('button',{name:'检查答案',exact:true}).click();await expect(listen.locator('.fb')).toHaveText('再看看，试一次。');
 await page.goto('/unit17-18/#learn/grammar');const room=page.locator('.stage-grammar');for(const answer of ANSWERS.grammar.slice(0,2))await answerThenNext(room,answer);await select(room,{fills:['are']});const before=await readLearning(page);
 await upgrade();await page.reload();await expect(room.locator('.progress-copy')).toHaveText('第 3 / 20 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();const after=await readLearning(page);
 expect(after.groups).toEqual(before.groups);expect(after.records).toEqual(before.records);
 for(const key of ['unitWordPage','unitDialogue','unitGalleryPage','unitModelPage','unit1718LegacySnapshot','unit1718FiveZoneMigration'])expect(after.activity[key]).toEqual(before.activity[key]);
 await expect(room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'are',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.goto('/unit17-18/#learn/listen');await expect(listen.locator('.fb')).toHaveText('再看看，试一次。');await page.goto('/unit17-18/#learn/text');await expect(page.locator('.btext span')).toHaveCount(7);
 await page.goto('/unit17-18/#learn/words');await expect(page.locator('#wordPageProgress')).toHaveText('4 / 5');
 await page.goto('/unit17-18/#learn/apply');await page.getByText('课本小参考 · 第18课',{exact:true}).click();await expect(page.locator('.gallery-current + .reference-pager span')).toHaveText('5 / 15');await expect(page.locator('.model-current + .reference-pager span')).toHaveText('4 / 10');
});

test('当前62题版已完成语法不重开；此前独立记录不被追记示范，重练仍保留原星',async({page})=>{
 test.setTimeout(150000);const upgrade=await beforeReview(page);await activity(page,'grammar');const before=await readLearning(page);expect(Boolean(before.records['u1718-tasks-v4-plural-labels'].revealed)).toBe(false);
 await expect(page.locator('#starCount')).toHaveText('1');await upgrade();await page.reload();const room=page.locator('.stage-grammar');await expect(room.locator('.completion-number')).toHaveText(['20','20','0']);await expect(room.locator('.completion-title')).toHaveText('身份与复数练习完成！');
 const after=await readLearning(page);expect(after.groups).toEqual(before.groups);expect(after.records).toEqual(before.records);await expect(page.locator('#starCount')).toHaveText('1');
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await select(room,'She is a nurse.');await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.reload();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(page.locator('#starCount')).toHaveText('1');
});
