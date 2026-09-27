'use strict';
const taskCases=require('./units1-30-tasks');
const {expect}=require('@playwright/test');
const { EXAMS } = require('./units1-6-exam');
// Literal textbook expectations, kept outside the runtime content/answer table.
async function completeUnit12(page) {
  await page.addInitScript(()=>{
    window.Audio=class extends EventTarget{constructor(src){super();this.src=src;this.currentTime=0;}play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};
  });
  await page.goto('/unit1-2/#learn/text');const text=page.locator('.stage-text');
  await text.getByRole('button',{name:'开始听课文',exact:true}).click();
  for(let i=1;i<7;i++)await text.getByRole('button',{name:'下一句',exact:true}).click();
  await text.getByRole('button',{name:'完成课文学习',exact:true}).click();
  const groups=Object.fromEntries(Object.keys(taskCases.CASES['1-2'].old).map(id=>[id,taskCases.answers('1-2',id).map(q=>q.answer)]));
  for(const [id,answers] of Object.entries(groups)){
    await page.goto('/unit1-2/#learn/'+id);const room=page.locator('.stage-'+id);
    for(let i=0;i<answers.length;i++){
      const answer=answers[i];
      if(id==='listen'||(id==='exam'&&EXAMS['1-2'][i].audio))await room.getByRole('button',{name:'听一遍',exact:true}).click();
      if(answer&&typeof answer==='object'&&!Array.isArray(answer))await taskCases.select(room,answer);
    else if(Array.isArray(answer))for(const word of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:word,exact:true}).click();
      else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
      await room.getByRole('button',{name:'检查答案',exact:true}).click();
      await expect(room.getByRole('status').filter({hasText:'答对了！'})).toBeVisible();
      await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
    }
  }
  await page.goto('/unit1-2/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports={completeUnit12};
