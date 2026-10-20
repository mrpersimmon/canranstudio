# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit27-28-v153-content.spec.js >> G2和G11短示范记录实际支持，G10与G12保留撤支持练习
- Location: tests\e2e\unit27-28-v153-content.spec.js:24:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.stage-grammar').getByRole('region', { name: '短示范', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.stage-grammar').getByRole('region', { name: '短示范', exact: true })

```

```yaml
- banner:
  - link "我的课程":
    - /url: /
  - img "星星"
  - text: 0/5
  - button "学习手记"
  - navigation "学习关卡":
    - link "先认识客厅":
      - /url: "#l1"
    - link "走进史密斯家":
      - /url: "#l2"
    - link "学会介绍一些":
      - /url: "#l3"
    - link "问清物品位置":
      - /url: "#l4"
    - link "完成客厅导览":
      - /url: "#l5"
- img "史密斯太太示意音响上的书，扶手椅靠近桌子，桌上有报纸"
- paragraph: 新概念英语 · Lesson 27–28
- heading "客厅发现之旅" [level=1]
- paragraph: 走进客厅，发现一些物品，问清它们在哪里。
- button "继续冒险"
- main:
  - heading "先认识客厅" [level=2]
  - text: ☆
  - region "客厅小图鉴":
    - heading "客厅小图鉴" [level=3]
    - button "living room":
      - strong: living room
      - text: /ˈlɪvɪŋ ˌruːm/
    - button "near":
      - strong: near
      - text: /nɪr/ near the window
    - button "window":
      - strong: window
      - text: /ˈwɪndoʊ/
    - button "armchair":
      - strong: armchair
      - text: /ˈɑːrmtʃer/
    - button "door":
      - strong: door
      - text: /dɔːr/
    - button "picture":
      - strong: picture
      - text: /ˈpɪktʃɚ/
    - button "上一组词卡" [disabled]
    - text: 1 / 5
    - button "下一组词卡"
  - region "单词寻宝":
    - heading "单词寻宝" [level=3]
    - paragraph:
      - text: 第 1 / 8 题
      - progressbar "本轮进度"
    - heading "选出这个词组的意思" [level=3]
    - region "题目材料":
      - paragraph: living room
    - button "厨房"
    - button "卧室"
    - button "客厅"
    - button "办公室"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
  - heading "走进史密斯家" [level=2]
  - text: ☆
  - region "客厅小导览":
    - heading "客厅小导览" [level=3]
    - group "史密斯太太的客厅":
      - paragraph: 史密斯太太的客厅
      - img "门旁的音响上有三本书，窗旁的电视机上有两本杂志，两把扶手椅靠近放着两份报纸的桌子，墙上有两幅画"
    - log "课文原文":
      - paragraph: Where are the books?
    - status "尚未开始阅读"
    - button "开始看课文"
  - region "课文小侦探":
    - heading "课文小侦探" [level=3]
    - button "先看课文"
  - heading "学会介绍一些" [level=2]
  - text: ☆
  - region "语法小工坊":
    - heading "语法小工坊" [level=3]
    - paragraph:
      - text: 第 2 / 12 题
      - progressbar "本轮进度"
    - heading "空格填什么？" [level=3]
    - region "题目材料":
      - paragraph: There ___ some armchairs in the room.
    - group "选择回应":
      - button "are"
      - button "is"
      - button "am"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
    - group: 语法小参考 ＋
  - heading "问清物品位置" [level=2]
  - text: ☆
  - region "客厅小向导":
    - heading "客厅小向导" [level=3]
    - paragraph:
      - text: 第 1 / 5 题
      - progressbar "本轮进度"
    - heading "墙上有一些图画" [level=3]
    - note: 读清情况，再检查。
    - group "选择回应":
      - group "已选词块": …
      - group "待选词块":
        - button "on"
        - button "the"
        - button "pictures"
        - button "wall."
        - button "are"
        - button "There"
        - button "some"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
    - group: 课本小参考 · 第28课 ＋
  - heading "完成客厅导览" [level=2]
  - text: ☆
  - region "综合挑战":
    - heading "综合挑战" [level=3]
    - paragraph:
      - text: 第 1 / 16 题
      - progressbar "本轮进度"
    - heading "哪幅图符合介绍？" [level=3]
    - region "题目材料":
      - paragraph: There are some forks on the shelf.
      - paragraph: They're near those spoons.
    - note: 读清情况，再检查。
    - group "选择回应":
      - button "乙图":
        - img "叉子和勺子相邻放在桌子上"
        - text: 乙图
      - button "丙图":
        - img "叉子在左边架子上，勺子在远处的另一个架子上"
        - text: 丙图
      - button "甲图":
        - img "叉子和勺子相邻放在同一架子上"
        - text: 甲图
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
  - region "我的单元纪念卡":
    - heading "我的单元纪念卡" [level=3]
    - article "我的单元纪念卡":
      - paragraph: 灿然英语工作室
      - heading "细心客厅发现家" [level=3]
      - paragraph: 登录后显示姓名
      - group "已获得 0 / 5 颗星"
      - img "史密斯太太示意音响上的三本书，扶手椅靠近桌子，桌上放着两份报纸"
      - paragraph: Lesson 27–28
    - button "保存动图" [disabled]
    - link "返回课程":
      - /url: http://127.0.0.1:4308/
    - status
    - group: 星星进度
    - group: 课后练习纸 ＋
```

# Test source

```ts
  1  | 'use strict';
  2  | const {test,expect}=require('@playwright/test');
  3  | const {ANSWERS,select,story,activity}=require('../support/unit2728-fivezones');
  4  | test.use({actionTimeout:7000,...(process.env.UNIT2728_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5  | async function reach(page,id,index){
  6  |  if(id==='roles')await story(page);
  7  |  await page.goto('/unit27-28/#learn/'+id);const room=page.locator('.stage-'+id);
  8  |  for(const answer of ANSWERS[id].slice(0,index)){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}
  9  |  return room;
  10 | }
  11 | test('R2在未答页提供原文，区分物品与邻近参照物',async({page},info)=>{
  12 |  const room=await reach(page,'roles',1);await room.screenshot({path:info.outputPath('roles-02-unanswered.png')});
  13 |  await expect(room.locator('.practice-context')).toContainText('There are some armchairs in the room.');
  14 |  await expect(room.locator('.practice-context')).toContainText('The armchairs are near the table.');
  15 |  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  16 |  await select(room,'the window');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  17 | });
  18 | test('E3在未答页保留三种读物的原句，独立整合位置',async({page},info)=>{
  19 |  const room=await reach(page,'exam',2);await room.screenshot({path:info.outputPath('exam-03-unanswered.png')});
  20 |  for(const line of ['There are some magazines on the television.','There are some newspapers on the table.','There are some books on the stereo.'])await expect(room.locator('.practice-context')).toContainText(line);
  21 |  await expect(room.locator('.grammar-model')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  22 |  await select(room,'television · stereo · table');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  23 | });
  24 | test('G2和G11短示范记录实际支持，G10与G12保留撤支持练习',async({page},info)=>{
  25 |  test.setTimeout(120000);await activity(page,'grammar',{inspect:async(room,index,state)=>{
  26 |   if(state!=='before')return;
> 27 |   if([1,10].includes(index)){await room.screenshot({path:info.outputPath('grammar-'+(index+1)+'-model.png')});await expect(room.getByRole('region',{name:'短示范',exact:true})).toBeVisible();}
     |                                                                                                                                                                              ^ Error: expect(locator).toBeVisible() failed
  28 |   if([9,11].includes(index))await expect(room.locator('.grammar-model')).toHaveCount(0);
  29 |  }});
  30 |  const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit27-28:learning:v1')).records);
  31 |  for(const id of ['u2728-v1-plural-existence','u2728-v1-ask-existence'])expect(records[id].revealed).toBe(true);
  32 |  for(const id of ['u2728-v1-irregular','u2728-v1-they-reference'])expect(Boolean(records[id].revealed)).toBe(false);
  33 | });
  34 | 
```