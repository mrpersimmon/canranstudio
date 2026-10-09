'use strict';
const {expect}=require('@playwright/test');
// Frozen predecessor answers navigate already-reviewed content. New expectations
// were transcribed from the v4 teaching draft; never read answers from the page.
const CASES=require('./units1-30-task-cases.json');
async function select(room,answer){
 if(answer?.scene)await room.getByRole('group',{name:'在场景中选择',exact:true}).getByRole('button',{name:answer.scene,exact:true}).click();
 else if(answer?.fills){for(let i=0;i<answer.fills.length;i++)await room.getByRole('group',{name:'第'+(i+1)+'处填空',exact:true}).getByRole('button',{name:answer.fills[i],exact:true}).click();}
 else if(answer?.pairs){for(const[en,cn]of answer.pairs){await room.getByRole('group',{name:answer.leftLabel||'英文',exact:true}).getByRole('button',{name:en,exact:true}).click();await room.getByRole('group',{name:answer.rightLabel||'词义',exact:true}).getByRole('button',{name:cn,exact:true}).click();}}
 else if(answer?.object){await room.getByRole('group',{name:'待选物品',exact:true}).getByRole('button',{name:answer.object,exact:true}).click();await room.getByRole('group',{name:'接收者',exact:true}).getByRole('button',{name:answer.recipient,exact:true}).click();}
 else if(Array.isArray(answer)){const bank=room.getByRole('group',{name:'待选词块',exact:true});for(const token of answer)await bank.getByRole('button',{name:token,exact:true}).and(bank.locator('button:enabled')).first().click();}
 else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
}
async function story(page,pair,base=''){
 await page.goto(`${base}/unit${pair}/#learn/text`);const room=page.locator('.stage-text');
 await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing','');
 await expect(room).toBeVisible();
 const voice=pair==='1-2',start=voice?'开始听课文':'开始看课文',finish=voice?'完成课文学习':'完成课文';
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:start,exact:true}).isVisible())await room.getByRole('button',{name:start,exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:finish,exact:true}).click();
}
function currentGroup(pair,id){return pair==='5-6'?({refer:'introduce',articles:'introduce',choice:'cars',trans:'cars'}[id]||id):id;}
function answers(pair,group,old=false){if(!old&&pair==='5-6'&&['introduce','cars'].includes(group))return (group==='introduce'?['refer','articles']:['choice','trans']).flatMap(id=>answers(pair,id));const c=CASES[pair];return (!old&&c.changes.find(x=>x.group===group)?.answers)||c.old[group];}
async function activity(page,pair,group,{base='',old=false,capture,wrongNew=false,hintNew=false}={}){
 if(!old)group=currentGroup(pair,group);
 await page.goto(`${base}/unit${pair}/#learn/${group}`);const room=page.locator('.stage-'+group),items=answers(pair,group,old);
 await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing','');
 await expect(room).toBeVisible();
 if(await room.locator('.practice-finish').isVisible())return;
 const copy=await room.locator('.progress-copy').innerText();const first=Number(copy.match(/第 (\d+)/)[1])-1;
 for(let i=first;i<items.length;i++){
  const q=items[i],check=room.getByRole('button',{name:'检查答案',exact:true});
  if(await check.isVisible()){
   await expect(check).toBeDisabled();
   if(q.audio)await room.getByRole('button',{name:'听一遍',exact:true}).click();
   if(q.fresh&&capture)await capture(room,q,'blank');
   if(q.fresh&&hintNew){
    const hint=room.getByRole('button',{name:'给点线索',exact:true});
    if(await hint.isVisible()){
     const actions=room.getByRole('group',{name:'作答操作',exact:true});
     const before=await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY);
     await hint.click();await expect(check).toBeDisabled();
     await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
     await expect(room.locator('.practice-options .is-correct')).toHaveCount(0);
     expect(Math.abs(await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY)-before)).toBeLessThanOrEqual(2);
    }
   }
   if(q.fresh&&wrongNew){
    const answer=q.answer;
    if(answer?.scene){const choices=room.getByRole('group',{name:'在场景中选择',exact:true});const labels=await choices.getByRole('button').evaluateAll(bs=>bs.map(b=>b.getAttribute('aria-label')));await choices.getByRole('button',{name:labels.find(x=>x!==answer.scene),exact:true}).click();}
    else if(answer?.pairs){await select(room,{...answer,pairs:answer.pairs.map(([en,cn],j)=>[en,answer.pairs[(j+1)%answer.pairs.length][1]])});}
    else if(answer?.fills){for(let j=0;j<answer.fills.length;j++){const choices=room.getByRole('group',{name:'第'+(j+1)+'处填空',exact:true});const wrong=(await choices.getByRole('button').allTextContents()).find(t=>t!==answer.fills[j]);await choices.getByRole('button',{name:wrong,exact:true}).click();};}
    else if(Array.isArray(answer))await select(room,[...answer].reverse());
    else await room.locator('.practice-options').getByRole('button').filter({hasNotText:answer}).first().click();
    await check.click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
    await expect(room.locator('.is-correct')).toHaveCount(0);if(capture)await capture(room,q,'wrong');
    await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
    await room.getByRole('button',{name:'再试一次',exact:true}).click();
   }
   await select(room,q.answer);await expect(check).toBeEnabled();
   if(q.fresh&&capture)await capture(room,q,'selected');
   await check.click();
  }
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  if(q.fresh&&capture)await capture(room,q,'correct');
  await room.getByRole('button',{name:i===items.length-1?(group==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
module.exports={CASES,select,story,answers,activity,currentGroup};
