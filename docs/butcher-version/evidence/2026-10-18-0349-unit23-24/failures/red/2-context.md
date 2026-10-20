# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit23-24-v153.spec.js >> 归属与接收者题在未答时明确递回请求，不能只给物主事实
- Location: tests\e2e\unit23-24-v153.spec.js:15:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.stage-exam').locator('.practice-context')
Expected substring: "他们请简把这些盒子递回给自己。"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.stage-exam').locator('.practice-context')

```

```yaml
- banner:
  - link "我的课程":
    - /url: /
  - img "星星"
  - text: 0/5
  - button "学习手记"
  - navigation "学习关卡":
    - link "认识房间物品":
      - /url: "#l1"
    - link "帮简找对杯子":
      - /url: "#l2"
    - link "看清物品位置":
      - /url: "#l3"
    - link "说清哪一些":
      - /url: "#l4"
    - link "完成寻物委托":
      - /url: "#l5"
- img "男士双手托着刚接过的一组玻璃杯，简双手空着，两人相视微笑"
- paragraph: 新概念英语 · Lesson 23–24
- heading "房间寻物队" [level=1]
- paragraph: 和简一起找对哪一些，用位置把要求说清楚。
- button "继续冒险"
- main:
  - heading "认识房间物品" [level=2]
  - text: ☆
  - region "寻物小图鉴":
    - heading "寻物小图鉴" [level=3]
    - button "on":
      - strong: "on"
      - text: /ɑːn/ on the shelf
    - button "shelf":
      - strong: shelf
      - text: /ʃelf/
    - button "desk":
      - strong: desk
      - text: /desk/
    - button "table":
      - strong: table
      - text: /ˈteɪbəl/
    - button "plate":
      - strong: plate
      - text: /pleɪt/
    - button "cupboard":
      - strong: cupboard
      - text: /ˈkʌbɚd/
    - button "上一组词卡" [disabled]
    - text: 1 / 5
    - button "下一组词卡"
  - region "单词寻宝":
    - heading "单词寻宝" [level=3]
    - paragraph:
      - text: 第 1 / 13 题
      - progressbar "本轮进度"
    - heading "on 在这里表示什么？" [level=3]
    - region "题目材料":
      - paragraph: on the shelf
    - button "在……旁边"
    - button "在……上面"
    - button "在……下面"
    - button "在……里面"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
  - heading "帮简找对杯子" [level=2]
  - text: ☆
  - region "找杯子小剧场":
    - heading "找杯子小剧场" [level=3]
    - group "男士和简在房间里确认并交接玻璃杯":
      - paragraph: 房间里
      - img "桌面和墙上搁板上各放着一组玻璃杯"
      - img "男士双手空着，面向对方"
      - text: 男士
      - img "简双手空着，面向对方"
      - text: 简（Jane）
    - log "课文对话":
      - paragraph: Which glasses does the man want?
    - status "尚未开始阅读"
    - button "开始看课文"
  - region "故事小侦探":
    - heading "故事小侦探" [level=3]
    - button "先看故事"
  - heading "看清物品位置" [level=2]
  - text: ☆
  - region "语法小工坊":
    - heading "语法小工坊" [level=3]
    - paragraph:
      - text: 第 1 / 9 题
      - progressbar "本轮进度"
    - region "短示范":
      - paragraph: The glasses are on the shelf.
      - text: 玻璃杯放在搁板表面上，杯底与搁板相接。
    - heading "几本书平放在桌面上，空格选什么？" [level=3]
    - region "题目材料":
      - paragraph: The books are ___ the table.
      - paragraph: in：在里面；under：在下面。
    - group "选择回应":
      - button "on"
      - button "in"
      - button "under"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
    - group: 语法小参考 ＋
  - heading "说清哪一些" [level=2]
  - text: ☆
  - region "寻物小帮手":
    - heading "寻物小帮手" [level=3]
    - paragraph:
      - text: 第 1 / 6 题
      - progressbar "本轮进度"
    - heading "哪句话符合新要求？" [level=3]
    - region "题目材料":
      - paragraph: 原来要一本书，现在要几本。
    - note: 读清要求，再检查。
    - group "选择回应":
      - button "Give me some book, please."
      - button "Give me a book, please."
      - button "Give me some books, please."
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
    - group: 课本小参考 · 第24课 ＋
  - heading "完成寻物委托" [level=2]
  - text: ☆
  - region "综合挑战":
    - heading "综合挑战" [level=3]
    - paragraph:
      - text: 第 8 / 15 题
      - progressbar "本轮进度"
    - heading "两位同学一起把盒子认回来" [level=3]
    - note: 读清要求，再检查。
    - group "选择回应":
      - paragraph: 盒子属于说话的这两位同学。
      - group "第1处填空":
        - paragraph: Those are ___ boxes.
        - button "our"
        - button "us"
        - button "their"
      - group "第2处填空":
        - paragraph: Give ___ those boxes, please.
        - button "us"
        - button "our"
        - button "them"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
  - region "我的单元纪念卡":
    - heading "我的单元纪念卡" [level=3]
    - article "我的单元纪念卡":
      - paragraph: 灿然英语工作室
      - heading "细心寻物小达人" [level=3]
      - paragraph: 登录后显示姓名
      - group "已获得 0 / 5 颗星"
      - img "男士双手托着刚接过的一组玻璃杯，简双手空着，两人相视微笑"
      - paragraph: Lesson 23–24
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
  3  | const {ANSWERS,select,story}=require('../support/unit2324-fivezones');
  4  | test.use({actionTimeout:7000,...(process.env.UNIT2324_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5  | async function next(room,answer,last=false){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:last?'完成这一站':'下一题',exact:true}).click();}
  6  | test('两道继承复习题在未答时有短示范，并只向本次提交登记帮助',async({page},info)=>{
  7  |  await page.setViewportSize({width:320,height:568});await page.goto('/unit23-24/#learn/grammar');const room=page.locator('.stage-grammar');for(const answer of ANSWERS.grammar.slice(0,7))await next(room,answer);
  8  |  const model=room.getByRole('region',{name:'短示范',exact:true});await room.screenshot({path:info.outputPath('grammar-8-unanswered.png')});await expect(model).toContainText('The pens are on the table.');await expect(model).not.toContainText('甲组');await next(room,ANSWERS.grammar[7]);
  9  |  await room.screenshot({path:info.outputPath('grammar-9-unanswered.png')});await expect(model).toContainText('Give me my book, please.');await expect(model).toContainText('Give us our pens, please.');await expect(model).not.toContainText('Give us our umbrellas');await next(room,ANSWERS.grammar[8],true);
  10 |  const book=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit23-24:learning:v1')));for(const id of ['u2324-v1-on-contact','u2324-v1-recipient-us'])expect(book.records[id].revealed).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  11 | });
  12 | test('回指题在选择和提示前显示请求原文，刷新仍能据原文判断',async({page},info)=>{
  13 |  await story(page);await page.goto('/unit23-24/#learn/roles');const room=page.locator('.stage-roles');await next(room,ANSWERS.roles[0]);await room.screenshot({path:info.outputPath('roles-2-unanswered.png')});await expect(room.locator('.practice-context')).toContainText('Give me some glasses please, Jane.');await expect(room.locator('.practice-context')).toContainText('No, not those. The ones on the shelf.');await expect(room.locator('.practice-context')).not.toContainText('ones代替');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await expect(room.locator('.practice-context')).toContainText('Give me some glasses please, Jane.');await next(room,ANSWERS.roles[1],true);
  14 | });
  15 | test('归属与接收者题在未答时明确递回请求，不能只给物主事实',async({page},info)=>{
> 16 |  await page.goto('/unit23-24/#learn/exam');const room=page.locator('.stage-exam');for(const answer of ANSWERS.exam.slice(0,7))await next(room,answer);await room.screenshot({path:info.outputPath('exam-8-unanswered.png')});await expect(room.locator('.practice-context')).toContainText('他们请简把这些盒子递回给自己。');await expect(room.locator('.grammar-model')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await select(room,{fills:['our']});await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.locator('.practice-context')).toContainText('他们请简把这些盒子递回给自己。');await select(room,ANSWERS.exam[7]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
     |                                                                                                                                                                                                                                                                              ^ Error: expect(locator).toContainText(expected) failed
  17 | });
  18 | 
```