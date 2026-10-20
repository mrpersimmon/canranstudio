# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit9-10-fivezones-upgrade.spec.js >> 真实旧账号15星升级：保留历史与日期，跨设备新题空白、首星独立入册
- Location: tests\login\unit9-10-fivezones-upgrade.spec.js:10:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.stage-listen').getByRole('status')
Expected substring: "答对了！"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.stage-listen').getByRole('status')

```

```yaml
- region "课程加载":
  - heading "街角问候站" [level=1]
  - status "课程准备状态": 正在准备画面…
  - progressbar "课程准备进度"
  - paragraph
  - link "返回课程":
    - /url: /lesson/
```

# Test source

```ts
  1  | 'use strict';
  2  | const taskCases=require('./units1-30-tasks');
  3  | const {expect}=require('@playwright/test');
  4  | const {EXAM}=require('./unit9-10-exam');
  5  | // Independent transcription from PDF 51–54 and the reviewed question manuscript.
  6  | const DIALOGUE=['Hello, Helen.','Hi, Steven.','How are you today?',"I'm very well, thank you.",'And you?',"I'm fine, thanks.",'How is Tony?',"He's fine, thanks.","How's Emma?","She's very well, too, Helen.",'Goodbye, Helen.','Nice to see you.','Nice to see you, too, Steven.','Goodbye.'];
  7  | const SPEAKERS=['Steven','Helen','Steven','Helen','Helen','Steven','Steven','Helen','Helen','Steven','Steven','Steven','Helen','Helen'];
  8  | const ANSWERS=Object.fromEntries(Object.keys(taskCases.CASES['9-10'].old).map(id=>[id,taskCases.answers('9-10',id).map(q=>q.answer)]));
  9  | async function completeStory(page,base=""){
  10 |  await page.goto(base+'/unit9-10/#learn/text');const room=page.locator('.stage-text');
  11 |  for(let i=0;i<14;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));await expect(room.getByRole('button',{name:i===13?'完成课文':'下一句',exact:true})).toBeEnabled({timeout:15000});}
  12 |  await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('故事看完了！');
  13 | }
  14 | async function completeActivity(page,id,base=""){
  15 |  await page.goto(base+'/unit9-10/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
  16 |  for(let i=0;i<answers.length;i++){
  17 |   const check=room.getByRole('button',{name:'检查答案',exact:true}),answer=answers[i];await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  18 |   if(answer&&typeof answer==='object'&&!Array.isArray(answer))await taskCases.select(room,answer);
  19 |     else if(Array.isArray(answer)){for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();}else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
  20 |   await expect(check).toBeEnabled({timeout:15000});await check.click();await expect(room.getByRole('status')).toContainText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
> 21 |   if(id==='listen'&&i===11){await page.reload();await expect(room.getByRole('status')).toContainText('答对了！');}
     |                                                                                        ^ Error: expect(locator).toContainText(expected) failed
  22 |   await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
  23 |  }
  24 |  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
  25 | }
  26 | async function completeUnit910(page,base=""){await completeActivity(page,'listen',base);await completeStory(page,base);for(const id of ['roles','reply','describe','exam'])await completeActivity(page,id,base);await page.goto(base+'/unit9-10/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
  27 | module.exports={DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit910};
  28 | 
```