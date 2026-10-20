'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS,select,activity}=require('../support/unit1920-fivezones');
test.use({actionTimeout:7000,...(process.env.UNIT1920_BROWSER==='webkit'?{browserName:'webkit'}:{})});
test('综合挑战每次最多两空；全部未答材料可见且保留独立作答',async({page},info)=>{
 test.setTimeout(120000);await activity(page,'exam',{inspect:async(room,index,state)=>{
  if(state!=='before')return;
  const fills=room.getByRole('group',{name:/第\d+处填空/});expect(await fills.count()).toBeLessThanOrEqual(2);
  await expect(room.locator('.grammar-model')).toHaveCount(0);
  if([3,4,7,13].includes(index))await room.screenshot({path:info.outputPath('exam-'+(index+1)+'-unanswered.png')});
 }});
});
test('主语be和形容词两道旧题补短示范；实际帮助入手记',async({page},info)=>{
 test.setTimeout(120000);await page.setViewportSize({width:320,height:568});await page.goto('/unit19-20/#learn/grammar');const room=page.locator('.stage-grammar');
 for(let i=0;i<14;i++){await select(room,ANSWERS.grammar[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 for(let i=14;i<16;i++){
  await expect(room.getByRole('region',{name:'短示范',exact:true})).toBeVisible();
  await room.screenshot({path:info.outputPath('grammar-'+(i+1)+'-unanswered-320.png')});
  await select(room,ANSWERS.grammar[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
  await room.getByRole('button',{name:i===15?'完成这一站':'下一题',exact:true}).click();
 }
 const book=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit19-20:learning:v1')));
 expect(book.records['u1920-tasks-v4-be-subject'].revealed).toBe(true);expect(book.records['u1920-v1-be-adjective'].revealed).toBe(true);
 await expect(room.locator('.completion-title')).toHaveText('存在与状态练习完成！');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
