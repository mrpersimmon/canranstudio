'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS,select,story,activity}=require('../support/unit2728-fivezones');
test.use({actionTimeout:7000,viewport:{width:320,height:568},...(process.env.UNIT2728_BROWSER==='webkit'?{browserName:'webkit'}:{})});
async function reach(page,id,index){
 if(id==='roles')await story(page);
 await page.goto('/unit27-28/#learn/'+id);const room=page.locator('.stage-'+id);
 for(const answer of ANSWERS[id].slice(0,index)){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}
 return room;
}
test('R2在未答页提供原文，区分物品与邻近参照物',async({page},info)=>{
 const room=await reach(page,'roles',1);await room.screenshot({path:info.outputPath('roles-02-unanswered.png')});
 await expect(room.locator('.practice-context')).toContainText('There are some armchairs in the room.');
 await expect(room.locator('.practice-context')).toContainText('The armchairs are near the table.');
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await expect(room.locator('.practice-context')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await select(room,'the window');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
});
test('E3在未答页保留三种读物的原句，独立整合位置',async({page},info)=>{
 const room=await reach(page,'exam',2);await room.screenshot({path:info.outputPath('exam-03-unanswered.png')});
 for(const line of ['There are some magazines on the television.','There are some newspapers on the table.','There are some books on the stereo.'])await expect(room.locator('.practice-context')).toContainText(line);
 await expect(room.locator('.grammar-model')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await expect(room.locator('.practice-context')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await select(room,'television · stereo · table');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
});
test('G2和G11短示范记录实际支持，G10与G12保留撤支持练习',async({page},info)=>{
 test.setTimeout(120000);await activity(page,'grammar',{inspect:async(room,index,state)=>{
  if(state!=='before')return;
  if([1,10].includes(index)){await room.screenshot({path:info.outputPath('grammar-'+(index+1)+'-model.png')});await expect(room.getByRole('region',{name:'短示范',exact:true})).toBeVisible();}
  if([9,11].includes(index))await expect(room.locator('.grammar-model')).toHaveCount(0);
 }});
 const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit27-28:learning:v1')).records);
 for(const id of ['u2728-v1-plural-existence','u2728-v1-ask-existence'])expect(records[id].revealed).toBe(true);
 for(const id of ['u2728-v1-irregular','u2728-v1-they-reference'])expect(Boolean(records[id].revealed)).toBe(false);
});
