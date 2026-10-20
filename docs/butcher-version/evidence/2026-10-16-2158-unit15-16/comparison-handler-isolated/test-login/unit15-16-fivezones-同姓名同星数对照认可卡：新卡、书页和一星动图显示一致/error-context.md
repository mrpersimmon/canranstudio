# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit15-16-fivezones.spec.js >> 同姓名同星数对照认可卡：新卡、书页和一星动图显示一致
- Location: tests\login\unit15-16-fivezones.spec.js:173:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('dialog.award-reveal[open]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('dialog.award-reveal[open]')
    - found locator('dialog.award-reveal[open]'), intercepting action to run the handler
    - locator handler has finished, waiting for locator('dialog.award-reveal[open]') to be hidden
    - interception handler has finished, continuing

```

```yaml
- banner:
  - link "我的课程":
    - /url: /
  - img "星星"
  - text: 1/5
  - button "学习手记"
  - status: 学习成果已同步
  - button "小禾 · 学习设置"
  - navigation "学习关卡":
    - link "结伴出发":
      - /url: "#l1"
    - link "护照小故事":
      - /url: "#l2"
    - link "把复数说清楚":
      - /url: "#l3"
    - link "一起做介绍":
      - /url: "#l4"
    - link "出行小伙伴":
      - /url: "#l5"
- img "两位姑娘向海关官员出示两本护照，身边放着棕色行李"
- paragraph: 新概念英语 · Lesson 15–16
- heading "护照小检查站" [level=1]
- paragraph: 和同伴一起出发，把人物、护照和行李说清楚。
- button "继续冒险"
- main:
  - heading "结伴出发" [level=2]
  - text: ★
  - region "出行小图鉴":
    - heading "出行小图鉴" [level=3]
    - button "customs":
      - strong: customs
      - text: /ˈkʌstəmz/ customs officer
    - button "officer":
      - strong: officer
      - text: /ˈɑːfɪsɚ/ customs officer
    - button "girl":
      - strong: girl
      - text: /ɡɝːl/
    - button "Danish":
      - strong: Danish
      - text: /ˈdeɪnɪʃ/
    - button "friend":
      - strong: friend
      - text: /frend/
    - button "Norwegian":
      - strong: Norwegian
      - text: /nɔːrˈwiːdʒən/
    - button "上一组词卡" [disabled]
    - text: 1 / 5
    - button "下一组词卡"
  - region "单词寻宝":
    - heading "单词寻宝" [level=3]
    - heading "单词寻宝完成！" [level=4]
    - list "本轮成果":
      - listitem "本轮最高连续答对 8 次":
        - text: 连续答对
        - strong: "8"
        - text: 次
      - listitem "本轮实际提交答对，包含订正 8 次":
        - text: 本次答对
        - strong: "8"
        - text: 次
      - listitem "本轮实际提交答错，重复错答分别计数 0 次":
        - text: 本次答错
        - strong: "0"
        - text: 次
    - paragraph: 这颗星已经点亮。
    - group "完成后的操作":
      - button "再练一轮"
      - button "下一站：海关小剧场": 下一站 海关小剧场
  - heading "护照小故事" [level=2]
  - text: ☆
  - region "海关小剧场":
    - heading "海关小剧场" [level=3]
    - group "海关官员与两位姑娘的检查站":
      - paragraph: 海关检查站
      - img "海关官员面向右侧的姑娘们，伸手示意"
      - text: 海关官员
      - img "两位姑娘站在一起，面向左侧的官员"
      - text: 姑娘们
      - img "两位同行朋友在旁边等候"
      - text: 同行朋友
    - log "课文对话":
      - paragraph: Is there a problem with the customs officer?
    - status "尚未开始阅读"
    - button "开始看课文"
  - region "故事小侦探":
    - heading "故事小侦探" [level=3]
    - button "先看故事"
  - heading "把复数说清楚" [level=2]
  - text: ☆
  - region "语法小工坊":
    - heading "语法小工坊" [level=3]
    - paragraph:
      - text: 第 1 / 16 题
      - progressbar "本轮进度"
    - region "短示范":
      - paragraph: one passport → two passports
      - text: 一本护照变成两本，passport加s。
    - heading "给两位官员选复数标签" [level=3]
    - region "题目材料":
      - paragraph: officer：官员。这里共有两位。
    - group "选择回应":
      - group "第1处填空":
        - paragraph: two ___
        - button "officers"
        - button "officer"
        - button "officeres"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
    - group: 语法小参考 ＋
  - heading "一起做介绍" [level=2]
  - text: ☆
  - region "出行小帮手":
    - heading "出行小帮手" [level=3]
    - paragraph:
      - text: 第 1 / 6 题
      - progressbar "本轮进度"
    - heading "你们一起回答官员" [level=3]
    - note: 选好表达，再检查。
    - group "选择回应":
      - paragraph: 两位姑娘都是游客。
      - group "第1处填空":
        - paragraph: 官员：Are you tourists? 姑娘们： ___
        - button "Yes, we are."
        - button "Yes, they are."
        - button "Yes, I am."
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
    - group: 课本小参考 · 第16课 ＋
  - heading "出行小伙伴" [level=2]
  - text: ☆
  - region "综合挑战":
    - heading "综合挑战" [level=3]
    - paragraph:
      - text: 第 1 / 21 题
      - progressbar "本轮进度"
    - heading "哪条记录与卡片一致？" [level=3]
    - region "题目材料":
      - paragraph: 读一张新的出行卡：
      - paragraph: Our friends are Russian. They are tourists.
    - note: 选好表达，再检查。
    - group "选择回应":
      - button "朋友：Norwegian；身份：tourists"
      - button "朋友：Russian；身份：officers"
      - button "朋友：Russian；身份：tourists"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
  - region "我的单元纪念卡":
    - heading "我的单元纪念卡" [level=3]
    - article "我的单元纪念卡":
      - paragraph: 灿然英语工作室
      - heading "结伴出行小达人" [level=3]
      - paragraph: 小禾
      - group "已获得 1 / 5 颗星"
      - img "两位姑娘向海关官员出示两本护照，身边放着棕色行李"
      - paragraph: Lesson 15–16
    - button "保存动图"
    - link "我的纪念册":
      - /url: http://127.0.0.1:4181/awards/
    - status
    - group: 星星进度
    - group: 课后练习纸 ＋
    - group: 旧版学习记录与证书 ＋
```

# Test source

```ts
  1  | 'use strict';
  2  | const {expect}=require('@playwright/test');
  3  | const {select:commonSelect}=require('./units1-30-tasks');
  4  | const {ANSWERS:OLD,DIALOGUE,SPEAKERS}=require('./unit15-16-flow');
  5  | // Independent manuscript: reviewed source pages and target map, never runtime answers.
  6  | const ANSWERS={
  7  | listen:OLD.listen,
  8  | roles:[...OLD.roles,'不能确定，只知道不属于姑娘们'],
  9  | grammar:[{fills:['officers']},{fills:['cases']},{fills:['watches','boxes']},{fills:['babies','boys']},{fills:['Henrys']},{fills:['photos','potatoes']},{fills:['knives','leaves']},'handkerchiefs；英式也可用handkerchieves',{fills:['am','is']},{fills:["They're","I'm not"]},"We aren't tourists. / We're not tourists.",{fills:['Are','these']},{fills:['We','Our']},{fills:['an','a']},'只指小林一个人的',{fills:['are','cars']}],
  10 | apply:[OLD.reply[0],OLD.reply[1],...OLD.trans,'Your passports, please.'],
  11 | exam:[OLD.exam[0],OLD.exam[1],{fills:["we aren't"]},{fills:['are','Dutch']},{fills:['Are','these']},{fills:['are','Our']},OLD.exam[6],{fills:['friends','dresses']},{fills:['an','a']},OLD.exam[9],OLD.exam[10],{fills:['cities','keys']},{fills:['radios','tomatoes']},{fills:['leaves','roofs']},'two Henrys','两种复数写法都可以','We are not tourists.',{fills:['am','is']},'不能，your可能指一人或多人','These are my passports.','We are tourists.']};
  12 | async function select(room,answer){await commonSelect(room,answer);}
  13 | async function story(page,base=''){
  14 |  await page.goto(base+'/unit15-16/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
  15 |  if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
  16 |  if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
  17 |  while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
  18 |  await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
  19 | }
  20 | async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
  21 |  await page.goto(base+'/unit15-16/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
  22 |  if(await room.locator('.practice-finish').isVisible())return room;
  23 |  const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
  24 |  for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
  25 |  if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
  26 |  if(!keepAward){
  27 |   const modal=page.locator('dialog.award-reveal[open]'),card=room.locator('.completion-card');
  28 |   // A server-confirmed award may appear after numeric results are already in
  29 |   // the DOM. Follow the public settlement sequence before the next activity.
> 30 |   if(expectPerfect){await expect(modal).toBeVisible();await page.keyboard.press('Escape');}
     |                                         ^ Error: expect(locator).toBeVisible() failed
  31 |   await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  32 |   await expect(card).toHaveAttribute('data-result-motion','finished');
  33 |  }
  34 |  return room;
  35 | }
  36 | module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
  37 | 
```