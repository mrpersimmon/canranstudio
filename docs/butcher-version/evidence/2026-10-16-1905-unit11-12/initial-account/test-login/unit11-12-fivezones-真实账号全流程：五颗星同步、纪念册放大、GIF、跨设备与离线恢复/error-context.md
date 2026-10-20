# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit11-12-fivezones.spec.js >> 真实账号全流程：五颗星同步、纪念册放大、GIF、跨设备与离线恢复
- Location: tests\login\unit11-12-fivezones.spec.js:43:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.stage-text')
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('.stage-text')

```

```yaml
- region "课程加载":
  - heading "失物招领小侦探" [level=1]
  - status "课程准备状态": 课程未能打开，再试一次。
  - progressbar "课程准备进度"
  - paragraph: 学习记录会保留。错误编号：L06
  - button "再试一次"
  - link "返回课程":
    - /url: /lesson/
```

# Test source

```ts
  1  | 'use strict';
  2  | const {expect}=require('@playwright/test');
  3  | const {select:commonSelect}=require('./units1-30-tasks');
  4  | const {ANSWERS:OLD,DIALOGUE,SPEAKERS}=require('./unit11-12-flow');
  5  | // Independently transcribed from the reviewed target map and source pages.
  6  | const ANSWERS={listen:OLD.listen,roles:[...OLD.roles,'Tim: Yes, sir.','回应老师叫自己，等老师说什么事'],
  7  | grammar:[{fills:['Who','Whose']},'Whose book is this? / Whose is this book?',OLD.owner[0],OLD.owner[1],{fills:['our','their']},{fills:['It’s','Its']},{fills:['my','mine']},OLD.owner[2],{fills:['girl’s']},{fills:['boys’']},{fills:['Jo and May’s']},{fills:['Jo’s and May’s']},{fills:['my brother’s']},'不是Dave的，真正主人还不确定'],
  8  | apply:[...OLD.trans,'No, it isn’t. It’s May’s.','Here you are.','向Jo核实是不是他的',['It’s','his','pen.']],
  9  | exam:[...OLD.exam.slice(0,4),{fills:['my','your']},{fills:['father’s','his']},...OLD.exam.slice(6),{fills:['their','our']},{fills:['Its','It’s']},{fills:['mine','my']},{fills:['girls’','boy’s']},{fills:['Ann and Ben’s','Ann’s and Ben’s']},{fills:['Whose','Who']},'不是Ann的，真正主人尚待确认','Whose pen is that? / Whose is that pen?']};
  10 | async function select(room,answer){await commonSelect(room,answer);}
  11 | async function story(page,base=''){
> 12 |  await page.goto(base+'/unit11-12/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
     |                                                                                                           ^ Error: expect(locator).toBeVisible() failed
  13 |  if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
  14 |  if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
  15 |  while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
  16 |  await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
  17 | }
  18 | async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
  19 |  await page.goto(base+'/unit11-12/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
  20 |  if(await room.locator('.practice-finish').isVisible())return room;
  21 |  const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
  22 |  for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
  23 |  if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
  24 |  if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
  25 | }
  26 | module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
  27 | 
```