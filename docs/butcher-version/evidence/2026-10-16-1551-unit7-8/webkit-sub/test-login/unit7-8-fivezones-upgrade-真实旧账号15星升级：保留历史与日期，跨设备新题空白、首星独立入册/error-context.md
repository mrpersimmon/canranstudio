# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit7-8-fivezones-upgrade.spec.js >> 真实旧账号15星升级：保留历史与日期，跨设备新题空白、首星独立入册
- Location: tests\login\unit7-8-fivezones-upgrade.spec.js:10:1

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: locator('.stage-listen').getByRole('button', { name: '检查答案', exact: true })
Expected: disabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for locator('.stage-listen').getByRole('button', { name: '检查答案', exact: true })

```

```yaml
- region "课程加载":
  - heading "新朋友采访站" [level=1]
  - status "课程准备状态": 正在准备课程…
  - progressbar "课程准备进度"
  - paragraph
  - link "返回课程":
    - /url: /lesson/
```

# Test source

```ts
  1  | 'use strict';
  2  | const taskCases=require('./units1-30-tasks');
  3  | const { expect } = require('@playwright/test');
  4  | // Independent expectations from textbook paper pages 14–17 and the unit manuscript.
  5  | const DIALOGUE=['I am a new student.',"My name's Robert.",'Nice to meet you.',"My name's Sophie.",'Are you French?','Yes, I am.','Are you French, too?','No, I am not.','What nationality are you?',"I'm Italian.",'Are you a teacher?',"No, I'm not.","What's your job?","I'm a keyboard operator.","What's your job?","I'm an engineer."];
  6  | const SPEAKERS=['Robert','Robert','Sophie','Sophie','Robert','Sophie','Sophie','Robert','Sophie','Robert','Robert','Sophie','Robert','Sophie','Sophie','Robert'];
  7  | const ANSWERS=Object.fromEntries(Object.keys(taskCases.CASES['7-8'].old).map(id=>[id,taskCases.answers('7-8',id).map(q=>q.answer)]));
  8  | async function completeStory(page,base=''){
  9  |  await page.goto(base+'/unit7-8/#learn/text');const room=page.locator('.stage-text');
  10 |  for(let i=0;i<DIALOGUE.length;i++){
  11 |   await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
  12 |   await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));
  13 |   await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
  14 |   await expect(room.getByRole('button',{name:i===15?'完成课文':'下一句',exact:true})).toBeEnabled({timeout:15000});
  15 |  }
  16 |  await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('故事看完了！');
  17 | }
  18 | async function completeActivity(page,id,base=''){
  19 |  await page.goto(base+'/unit7-8/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
  20 |  for(let i=0;i<answers.length;i++){
  21 |   const answer=answers[i],check=room.getByRole('button',{name:'检查答案',exact:true});
> 22 |   await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
     |                       ^ Error: expect(locator).toBeDisabled() failed
  23 |   if(answer&&typeof answer==='object'&&!Array.isArray(answer))await taskCases.select(room,answer);
  24 |     else if(Array.isArray(answer)){for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();}
  25 |   else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
  26 |   await expect(check).toBeEnabled({timeout:15000});await check.click();await expect(room.getByRole('status')).toContainText('答对了！');
  27 |   await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  28 |   if(id==='listen'&&i===11){await page.reload();await expect(room.getByRole('status')).toContainText('答对了！');}
  29 |   await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
  30 |  }
  31 |  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
  32 | }
  33 | async function completeUnit78(page,base=''){await completeActivity(page,'listen',base);await completeStory(page,base);for(const id of ['roles','reply','interview','exam'])await completeActivity(page,id,base);await page.goto(base+'/unit7-8/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
  34 | module.exports={DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit78};
  35 | 
```