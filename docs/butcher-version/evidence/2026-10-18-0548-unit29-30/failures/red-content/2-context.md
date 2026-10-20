# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit29-30-v153-content.spec.js >> R2在未答和刷新后提供连续原文，不靠猜测唯一家务流程
- Location: tests\e2e\unit29-30-v153-content.spec.js:6:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.stage-roles').locator('.practice-context')
Expected substring: "Then put these clothes in the wardrobe."
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.stage-roles').locator('.practice-context')

```

```yaml
- banner:
  - link "我的课程":
    - /url: /
  - img "星星"
  - text: 0/5
  - button "学习手记"
  - navigation "学习关卡":
    - text: 所在关卡
    - combobox "选择关卡":
      - option "认识整理动作"
      - option "艾米的整理任务" [selected]
      - option "读懂任务要求"
      - option "把动作说清楚"
      - option "我的整理行动"
- img "琼斯太太向艾米说明整理任务，艾米拿着一把扫帚，床铺和地面仍待整理"
- paragraph: 新概念英语 · Lesson 29–30
- heading "房间整理行动" [level=1]
- paragraph: 读懂整理任务，问清必须做什么，再把行动说清楚。
- button "继续冒险"
- main:
  - heading "认识整理动作" [level=2]
  - text: ☆
  - region "整理小图鉴":
    - heading "整理小图鉴" [level=3]
    - button "shut":
      - strong: shut
      - text: /ʃʌt/ shut the door
    - button "bedroom":
      - strong: bedroom
      - text: /ˈbedruːm/
    - button "untidy":
      - strong: untidy
      - text: /ʌnˈtaɪdi/
    - button "must":
      - strong: must
      - text: /mʌst/ What must I do?
    - button "open":
      - strong: open
      - text: /ˈoʊpən/ open the window
    - button "air":
      - strong: air
      - text: /er/ air the room
    - button "上一组词卡" [disabled]
    - text: 1 / 5
    - button "下一组词卡"
  - region "单词寻宝":
    - heading "单词寻宝" [level=3]
    - paragraph:
      - text: 第 1 / 10 题
      - progressbar "本轮进度"
    - heading "选出这个词的意思" [level=3]
    - region "题目材料":
      - paragraph: bedroom
    - button "厨房"
    - button "卧室"
    - button "客厅"
    - button "办公室"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
  - heading "艾米的整理任务" [level=2]
  - text: ☆
  - region "房间小剧场":
    - heading "房间小剧场" [level=3]
    - group "琼斯太太与艾米在卧室里谈整理任务":
      - paragraph: 卧室里
      - img "窗户关着，衣服还在未整理的床上，梳妆台有灰尘，地面有纸屑"
      - img "琼斯太太面向艾米说明任务"
      - text: 琼斯太太
      - img "艾米面向琼斯太太，握着一把扫帚"
      - text: 艾米
    - log "课文原文":
      - text: 琼斯太太
      - paragraph: Come in, Amy.
      - button "看中文"
      - text: 琼斯太太
      - paragraph: Shut the door, please.
      - button "看中文"
      - text: 琼斯太太
      - paragraph: This bedroom's very untidy.
      - button "看中文"
      - text: 艾米
      - paragraph: What must I do, Mrs. Jones?
      - button "看中文"
      - text: 琼斯太太
      - paragraph: Open the window and air the room.
      - button "看中文"
      - text: 琼斯太太
      - paragraph: Then put these clothes in the wardrobe.
      - button "看中文"
      - text: 琼斯太太
      - paragraph: Then make the bed.
      - button "看中文"
      - text: 琼斯太太
      - paragraph: Dust the dressing table.
      - button "看中文"
      - text: 琼斯太太
      - paragraph: Then sweep the floor.
      - button "看中文"
    - status "已读 9 / 9 句课文": 9 / 9
    - paragraph: 课文看完了！
    - group "完成后的操作":
      - button "再看一遍"
      - button "下一站：课文小侦探"
  - region "课文小侦探":
    - heading "课文小侦探" [level=3]
    - paragraph:
      - text: 第 2 / 2 题
      - progressbar "本轮进度"
    - heading "按照课文顺序排好" [level=3]
    - group "已选词块": …
    - group "待选词块":
      - button "Then sweep the floor."
      - button "Dust the dressing table."
      - button "Then make the bed."
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
  - heading "读懂任务要求" [level=2]
  - text: ☆
  - region "语法小工坊":
    - heading "语法小工坊" [level=3]
    - paragraph:
      - text: 第 1 / 11 题
      - progressbar "本轮进度"
    - region "短示范":
      - paragraph: We must clean the room.
      - text: 我们必须打扫房间。must后接clean的原形。
    - heading "用must说明她必须扫地，选出合适的动作词" [level=3]
    - region "题目材料":
      - paragraph: She must ___ the floor.
    - group "选择回应":
      - button "sweeps"
      - button "to sweep"
      - button "sweep"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
    - group: 语法小参考 ＋
  - heading "把动作说清楚" [level=2]
  - text: ☆
  - region "整理小帮手":
    - heading "整理小帮手" [level=3]
    - paragraph:
      - text: 第 1 / 7 题
      - progressbar "本轮进度"
    - heading "让台灯亮起来" [level=3]
    - note: 读清任务，再检查。
    - group "选择回应":
      - group "第1处填空":
        - paragraph: ___ the lamp.
        - button "Turn on"
        - button "Open"
        - button "Turn off"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
    - group: 课本小参考 · 第30课 ＋
  - heading "我的整理行动" [level=2]
  - text: ☆
  - region "综合挑战":
    - heading "综合挑战" [level=3]
    - paragraph:
      - text: 第 1 / 20 题
      - progressbar "本轮进度"
    - heading "做完后是哪幅图？" [level=3]
    - region "题目材料":
      - paragraph: Turn off the lamp.
      - paragraph: Then open the book.
    - note: 读清任务，再检查。
    - group "选择回应":
      - button "甲图":
        - img "灯没有发光，书摊开着"
        - text: 甲图
      - button "乙图":
        - img "灯有光芒，书摊开着"
        - text: 乙图
      - button "丙图":
        - img "灯没有发光，书合着"
        - text: 丙图
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
  - region "我的单元纪念卡":
    - heading "我的单元纪念卡" [level=3]
    - article "我的单元纪念卡":
      - paragraph: 灿然英语工作室
      - heading "能干整理小帮手" [level=3]
      - paragraph: 登录后显示姓名
      - group "已获得 0 / 5 颗星"
      - img "琼斯太太向艾米说明整理任务，艾米拿着一把扫帚，床铺和地面仍待整理"
      - paragraph: Lesson 29–30
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
  3  | const {ANSWERS,select,story,activity}=require('../support/unit2930-fivezones');
  4  | test.use({actionTimeout:7000,viewport:{width:320,height:568},...(process.env.UNIT2930_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5  | async function reach(page,id,index){if(id==='roles')await story(page);await page.goto('/unit29-30/#learn/'+id);const room=page.locator('.stage-'+id);for(const answer of ANSWERS[id].slice(0,index)){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}return room;}
  6  | test('R2在未答和刷新后提供连续原文，不靠猜测唯一家务流程',async({page},info)=>{
> 7  |  const room=await reach(page,'roles',1);await room.screenshot({path:info.outputPath('roles-02-unanswered.png')});for(const line of ['Then put these clothes in the wardrobe.','Then make the bed.','Dust the dressing table.','Then sweep the floor.'])await expect(room.locator('.practice-context')).toContainText(line);
     |                                                                                                                                                                                                                                                                                                        ^ Error: expect(locator).toContainText(expected) failed
  8  |  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await expect(room.locator('.practice-context')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  9  |  await select(room,['Dust the dressing table.','Then make the bed.','Then sweep the floor.']);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  10 | });
  11 | test('E4在未答和刷新后提供开窗后的原句，独立判断先后',async({page},info)=>{
  12 |  const room=await reach(page,'exam',3);await room.screenshot({path:info.outputPath('exam-04-unanswered.png')});for(const line of ['Open the window and air the room.','Then put these clothes in the wardrobe.','Then make the bed.'])await expect(room.locator('.practice-context')).toContainText(line);
  13 |  await expect(room.locator('.grammar-model')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await expect(room.locator('.practice-context')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  14 |  await select(room,'整理床铺 · 收衣服进衣柜');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  15 | });
  16 | test('G9与G11提供短示范并记录支持，G10继续撤支持练习',async({page},info)=>{
  17 |  test.setTimeout(120000);await activity(page,'grammar',{inspect:async(room,index,state)=>{if(state!=='before')return;if([8,10].includes(index)){await room.screenshot({path:info.outputPath('grammar-'+(index+1)+'-model.png')});await expect(room.getByRole('region',{name:'短示范',exact:true})).toBeVisible();}if(index===9)await expect(room.locator('.grammar-model')).toHaveCount(0);}});
  18 |  const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit29-30:learning:v1')).records);for(const id of ['u2930-v1-must-purpose','u2930-v1-bedroom-is'])expect(records[id].revealed).toBe(true);expect(Boolean(records['u2930-v1-base-verb'].revealed)).toBe(false);
  19 | });
  20 | 
```