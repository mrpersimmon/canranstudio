'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS,select,activity}=require('../support/unit2122-fivezones');
const {beforeReview,readLearning}=require('../support/unit2122-teaching-review');
test.use({actionTimeout:7000,...(process.env.UNIT2122_BROWSER==='webkit'?{browserName:'webkit'}:{})});
async function answerNext(room,answer,last=false){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:last?'完成这一站':'下一题',exact:true}).click();}
test('Our与a/an复习题先有短示范，示范与当前完整答案错开并如实记录',async({page},info)=>{
 await page.setViewportSize({width:320,height:568});await page.goto('/unit21-22/#learn/grammar');const room=page.locator('.stage-grammar');
 for(const answer of ANSWERS.grammar.slice(0,8))await answerNext(room,answer);
 const model=room.getByRole('region',{name:'短示范',exact:true});await expect(model).toContainText('My books are red.');await expect(model).toContainText('Our book is blue.');await expect(model).not.toContainText('Our pens are blue.');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await room.screenshot({path:info.outputPath('grammar-9-unanswered-320.png')});await answerNext(room,ANSWERS.grammar[8]);
 await expect(model).toContainText('a full bottle');await expect(model).toContainText('an old bottle');await expect(model).not.toContainText('an empty glass');await room.screenshot({path:info.outputPath('grammar-10-unanswered-320.png')});await answerNext(room,ANSWERS.grammar[9],true);
 const book=await readLearning(page);for(const id of ['u2122-v1-owner-our','u2122-v1-article-empty'])expect(book.records[id].revealed).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('当前45题版交接错答和语法草稿、阅读词卡及两个分页原样续做',async({page})=>{
 const upgrade=await beforeReview(page);await page.goto('/unit21-22/#learn/grammar');const grammar=page.locator('.stage-grammar');await answerNext(grammar,ANSWERS.grammar[0]);await select(grammar,{fills:['he']});
 await page.goto('/unit21-22/#learn/exam');const room=page.locator('.stage-exam');await room.getByRole('group',{name:'待选物品',exact:true}).getByRole('button',{name:'小瓶子',exact:true}).click();await room.getByRole('group',{name:'接收者',exact:true}).getByRole('button',{name:'男士',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
 await page.goto('/unit21-22/#learn/words');for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();await page.goto('/unit21-22/#learn/text');await page.getByRole('button',{name:'开始看课文',exact:true}).click();for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一句',exact:true}).click();
 await page.goto('/unit21-22/#learn/apply');await page.getByText('课本小参考 · 第22课',{exact:true}).click();for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一组物品图',exact:true}).click();for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一份问答',exact:true}).click();const before=await readLearning(page);
 await upgrade();await page.reload();const after=await readLearning(page);expect(after.groups).toEqual(before.groups);expect(after.records).toEqual(before.records);for(const key of ['unitDialogue','unitWordPage','unitGalleryPage','unitModelPage','unit2122LegacySnapshot'])expect(after.activity[key]).toEqual(before.activity[key]);
 await page.goto('/unit21-22/#learn/grammar');await expect(grammar.locator('.progress-copy')).toHaveText('第 2 / 10 题');await expect(grammar.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(grammar.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'he',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.goto('/unit21-22/#learn/exam');await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.handoff-arrived')).toHaveCount(0);await page.goto('/unit21-22/#learn/text');await expect(page.locator('.btext span')).toHaveCount(4);await page.goto('/unit21-22/#learn/words');await expect(page.locator('#wordPageProgress')).toHaveText('3 / 6');
 await page.goto('/unit21-22/#learn/apply');await page.getByText('课本小参考 · 第22课',{exact:true}).click();await expect(page.locator('.gallery-current + .reference-pager span')).toHaveText('4 / 8');await expect(page.locator('.gallery-current small')).toHaveText(['1,007','1,008']);await expect(page.locator('.model-current + .reference-pager span')).toHaveText('3 / 8');
});
test('现有完整语法轮次和星星保留，不向旧独立作答追记示范',async({page})=>{
 test.setTimeout(90000);const upgrade=await beforeReview(page);await activity(page,'grammar');const before=await readLearning(page);expect(Boolean(before.records['u2122-v1-owner-our'].revealed)).toBe(false);
 await upgrade();await page.reload();const room=page.locator('.stage-grammar');await expect(room.locator('.completion-number')).toHaveText(['10','10','0']);await expect(page.locator('#starCount')).toHaveText('1');const after=await readLearning(page);expect(after.groups).toEqual(before.groups);expect(after.records).toEqual(before.records);
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await select(room,'I');await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.reload();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(page.locator('#starCount')).toHaveText('1');
});
