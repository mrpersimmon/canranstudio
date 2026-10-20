'use strict';
const {test,expect}=require('@playwright/test');
const {legacy,readLearning}=require('../support/unit1920-v153-legacy');
const old=require('../support/unit1920-before-v153'),fresh=require('../support/unit1920-fivezones');
test.use({actionTimeout:7000,...(process.env.UNIT1920_BROWSER==='webkit'?{browserName:'webkit'}:{})});
for(const selected of [false,true])test(`65题版综合${selected?'仅选未提交':'空白'}更新后，完整新轮仍可获星`,async({page})=>{
 test.setTimeout(120000);const upgrade=await legacy(page);await page.goto('/unit19-20/#learn/exam');const room=page.locator('.stage-exam');if(selected)await old.select(room,old.ANSWERS.exam[0]);
 await page.reload();await upgrade();await page.reload();await expect(room.locator('.progress-copy')).toHaveText('第 1 / 24 题');await expect(page.locator('#starCount')).toHaveText('0');
 await expect(room.getByRole('button',{name:'检查答案',exact:true}))[selected?'toBeEnabled':'toBeDisabled']();await fresh.activity(page,'exam');await expect(page.locator('#starCount')).toHaveText('1');
});
test('65题版双空草稿、综合错答、词卡阅读与双图参考分页完整保护',async({page})=>{
 test.setTimeout(120000);const upgrade=await legacy(page);await page.goto('/unit19-20/#learn/grammar');const grammar=page.locator('.stage-grammar');await old.select(grammar,old.ANSWERS.grammar[0]);await grammar.getByRole('button',{name:'检查答案',exact:true}).click();await grammar.getByRole('button',{name:'下一题',exact:true}).click();await old.select(grammar,{fills:['are']});
 await page.goto('/unit19-20/#learn/exam');const exam=page.locator('.stage-exam');await old.select(exam,'累了；口渴');await exam.getByRole('button',{name:'检查答案',exact:true}).click();await expect(exam.locator('.fb')).toHaveText('再看看，试一次。');
 await page.goto('/unit19-20/#learn/words');for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
 await page.goto('/unit19-20/#learn/text');await page.getByRole('button',{name:'开始看课文',exact:true}).click();for(let i=0;i<6;i++)await page.getByRole('button',{name:'下一句',exact:true}).click();
 await page.goto('/unit19-20/#learn/apply');await page.getByText('课本小参考 · 第20课',{exact:true}).click();for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一幅对比图',exact:true}).click();for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一份问答',exact:true}).click();const before=await readLearning(page);
 await upgrade();await page.reload();const after=await readLearning(page),snapshot=after.activity.unit1920V153Snapshot;expect(snapshot.records).toEqual(before.records);expect(snapshot.groups).toEqual(before.groups);for(const key of ['unitWordPage','unitDialogue','unitGalleryPage','unitModelPage'])expect(snapshot.activity[key]).toEqual(before.activity[key]);
 await page.goto('/unit19-20/#learn/grammar');await expect(grammar.locator('.progress-copy')).toHaveText('第 2 / 16 题');await expect(grammar.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(grammar.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'are',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.goto('/unit19-20/#learn/exam');await expect(exam.locator('.fb')).toHaveText('再看看，试一次。');await exam.getByRole('button',{name:'再试一次',exact:true}).click();await fresh.activity(page,'exam',{expectPerfect:false});await expect(page.locator('#starCount')).toHaveText('0');await exam.getByRole('button',{name:'再练一轮',exact:true}).click();await fresh.activity(page,'exam');await expect(page.locator('#starCount')).toHaveText('1');
 await page.goto('/unit19-20/#learn/words');await expect(page.locator('#wordPageProgress')).toHaveText('4 / 6');await page.goto('/unit19-20/#learn/text');await expect(page.locator('.btext span')).toHaveCount(7);
 await page.goto('/unit19-20/#learn/apply');await page.getByText('课本小参考 · 第20课',{exact:true}).click();await expect(page.locator('.gallery-current + .reference-pager span')).toHaveText('4 / 10');await expect(page.locator('.gallery-current small')).toHaveText(['433','434']);await expect(page.locator('.model-current + .reference-pager span')).toHaveText('3 / 10');
 expect((await readLearning(page)).activity.unit1920V153Snapshot.records).toEqual(before.records);
});
test('原65题五星与四个未改轮次保留，综合四道调整题未答，完成后旧历史仍在',async({page})=>{
 test.setTimeout(180000);const upgrade=await legacy(page);await old.story(page);for(const id of Object.keys(old.ANSWERS))await old.activity(page,id);const before=await readLearning(page);await expect(page.locator('#starCount')).toHaveText('5');
 await upgrade();await page.reload();await expect(page.locator('#starCount')).toHaveText('5');for(const id of ['listen','roles','grammar','apply']){await page.goto('/unit19-20/#learn/'+id);await expect(page.locator('.stage-'+id+' .completion-number')).toHaveText([String(old.ANSWERS[id].length),String(old.ANSWERS[id].length),'0']);const key='unit1920-'+id+'-practice/five-zones-v1';expect((await readLearning(page)).groups[key]).toEqual(before.groups[key]);}
 const visited=[];await fresh.activity(page,'exam',{expectPerfect:false,inspect:async(room,i,state)=>{if(state==='before'&&await room.locator('.fb').innerText()!=='答对了！'){visited.push(i+1);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();}}});expect(visited).toEqual([4,5,8,14]);
 const after=await readLearning(page);expect(after.activity.unit1920V153Snapshot.records).toEqual(before.records);expect(Boolean(after.activity.unit1920V153Snapshot.records['u1920-tasks-v4-be-subject'].revealed)).toBe(false);await expect(page.locator('#starCount')).toHaveText('5');
 await page.goto('/unit19-20/#learn/certificate');await page.getByText('之前的五星学习记录',{exact:true}).click();await expect(page.locator('.historical-learning li')).toHaveCount(65);
});
