# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit21-22-teaching-review.spec.js >> Our与a/an复习题先有短示范，示范与当前完整答案错开并如实记录
- Location: tests\e2e\unit21-22-teaching-review.spec.js:7:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.stage-grammar').getByRole('region', { name: '短示范', exact: true })
Expected substring: "My books are red."
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
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
    - text: 所在关卡
    - combobox "选择关卡":
      - option "先认识物品"
      - option "帮简找对书"
      - option "看清递给谁" [selected]
      - option "把要求说清楚"
      - option "完成小委托"
- img "男士拿着刚接过的红书，简双手空着，两人相视微笑"
- paragraph: 新概念英语 · Lesson 21–22
- heading "寻物交接站" [level=1]
- paragraph: 帮简确认哪一本、递给谁，把物品交到对的人手中。
- button "继续冒险"
- main:
  - heading "先认识物品" [level=2]
  - text: ☆
  - region "寻物小图鉴":
    - heading "寻物小图鉴" [level=3]
    - button "give":
      - strong: give
      - text: /ɡɪv/ Give me a book, please.
    - button "one":
      - strong: one
      - text: /wʌn/ This one?
    - button "which":
      - strong: which
      - text: /wɪtʃ/ Which book?
    - button "book":
      - strong: book
      - text: /bʊk/
    - button "red":
      - strong: red
      - text: /red/
    - button "blue":
      - strong: blue
      - text: /bluː/
    - button "上一组词卡" [disabled]
    - text: 1 / 6
    - button "下一组词卡"
  - region "单词寻宝":
    - heading "单词寻宝" [level=3]
    - paragraph:
      - text: 第 1 / 10 题
      - progressbar "本轮进度"
    - heading "give 在这句话里表示什么？" [level=3]
    - region "题目材料":
      - paragraph: Give me a book, please.
    - button "阅读"
    - button "看"
    - button "给；递给"
    - button "寻找"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
  - heading "帮简找对书" [level=2]
  - text: ☆
  - region "找书小剧场":
    - heading "找书小剧场" [level=3]
    - group "男士与简在书桌旁确认和交接书本":
      - paragraph: 书桌旁
      - img "男士和简双手空着，桌上放着两本书"
      - text: 男士 简（Jane）
    - log "课文对话":
      - paragraph: Which book does the man want?
    - status "尚未开始阅读"
    - button "开始看课文"
  - region "故事小侦探":
    - heading "故事小侦探" [level=3]
    - button "先看故事"
  - heading "看清递给谁" [level=2]
  - text: ☆
  - region "语法小工坊":
    - heading "语法小工坊" [level=3]
    - paragraph:
      - text: 第 9 / 10 题
      - progressbar "本轮进度"
    - heading "空格填什么？" [level=3]
    - region "题目材料":
      - paragraph: 两位同学一起回答：
      - paragraph: “Are these your pens?”
      - paragraph: “No, they’re not. ___ pens are blue.”
    - group "选择回应":
      - button "His"
      - button "Our"
      - button "Their"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
    - group: 语法小参考 ＋
  - heading "把要求说清楚" [level=2]
  - text: ☆
  - region "交接小帮手":
    - heading "交接小帮手" [level=3]
    - paragraph:
      - text: 第 1 / 7 题
      - progressbar "本轮进度"
    - heading "接收者是谁？" [level=3]
    - region "题目材料":
      - paragraph: 几位同学站在一起，其中一位说：
      - paragraph: Give us a book, please.
    - note: 选好表达，再检查。
    - group "选择回应":
      - button "说话的人和他的同伴"
      - button "只有说话的人"
      - button "只有他的同伴"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
    - group: 课本小参考 · 第22课 ＋
  - heading "完成小委托" [level=2]
  - text: ☆
  - region "综合挑战":
    - heading "综合挑战" [level=3]
    - paragraph:
      - text: 第 1 / 16 题
      - progressbar "本轮进度"
    - heading "读一读，完成交接" [level=3]
    - note: 选好表达，再检查。
    - group "选择回应":
      - text: 简（Jane） 说
      - paragraph: Give me a bottle, please. The small one.
      - paragraph: 选物品
      - group "待选物品":
        - button "大瓶子":
          - img "大瓶子"
          - text: 甲
        - button "小叉子":
          - img "小叉子"
          - text: 乙
        - button "小瓶子":
          - img "小瓶子"
          - text: 丙
      - paragraph: 递给谁
      - group "接收者":
        - button "男士"
        - button "简（Jane）"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
  - region "我的单元纪念卡":
    - heading "我的单元纪念卡" [level=3]
    - article "我的单元纪念卡":
      - paragraph: 灿然英语工作室
      - heading "细心交接小达人" [level=3]
      - paragraph: 登录后显示姓名
      - group "已获得 0 / 5 颗星"
      - img "男士拿着刚接过的红书，简双手空着，两人相视微笑"
      - paragraph: Lesson 21–22
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
  3  | const {ANSWERS,select,activity}=require('../support/unit2122-fivezones');
  4  | const {beforeReview,readLearning}=require('../support/unit2122-teaching-review');
  5  | test.use({actionTimeout:7000,...(process.env.UNIT2122_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  6  | async function answerNext(room,answer,last=false){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:last?'完成这一站':'下一题',exact:true}).click();}
  7  | test('Our与a/an复习题先有短示范，示范与当前完整答案错开并如实记录',async({page},info)=>{
  8  |  await page.setViewportSize({width:320,height:568});await page.goto('/unit21-22/#learn/grammar');const room=page.locator('.stage-grammar');
  9  |  for(const answer of ANSWERS.grammar.slice(0,8))await answerNext(room,answer);
> 10 |  const model=room.getByRole('region',{name:'短示范',exact:true});await expect(model).toContainText('My books are red.');await expect(model).toContainText('Our book is blue.');await expect(model).not.toContainText('Our pens are blue.');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await room.screenshot({path:info.outputPath('grammar-9-unanswered-320.png')});await answerNext(room,ANSWERS.grammar[8]);
     |                                                                                   ^ Error: expect(locator).toContainText(expected) failed
  11 |  await expect(model).toContainText('a full bottle');await expect(model).toContainText('an old bottle');await expect(model).not.toContainText('an empty glass');await room.screenshot({path:info.outputPath('grammar-10-unanswered-320.png')});await answerNext(room,ANSWERS.grammar[9],true);
  12 |  const book=await readLearning(page);for(const id of ['u2122-v1-owner-our','u2122-v1-article-empty'])expect(book.records[id].revealed).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  13 | });
  14 | test('当前45题版交接错答和语法草稿、阅读词卡及两个分页原样续做',async({page})=>{
  15 |  const upgrade=await beforeReview(page);await page.goto('/unit21-22/#learn/grammar');const grammar=page.locator('.stage-grammar');await answerNext(grammar,ANSWERS.grammar[0]);await select(grammar,{fills:['her']});
  16 |  await page.goto('/unit21-22/#learn/exam');const room=page.locator('.stage-exam');await room.getByRole('group',{name:'待选物品',exact:true}).getByRole('button',{name:'小瓶子',exact:true}).click();await room.getByRole('group',{name:'接收者',exact:true}).getByRole('button',{name:'男士',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  17 |  await page.goto('/unit21-22/#learn/words');for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();await page.goto('/unit21-22/#learn/text');await page.getByRole('button',{name:'开始看课文',exact:true}).click();for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一句',exact:true}).click();
  18 |  await page.goto('/unit21-22/#learn/apply');await page.getByText('课本小参考 · 第22课',{exact:true}).click();for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一组物品图',exact:true}).click();for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一份问答',exact:true}).click();const before=await readLearning(page);
  19 |  await upgrade();await page.reload();const after=await readLearning(page);expect(after.groups).toEqual(before.groups);expect(after.records).toEqual(before.records);for(const key of ['unitDialogue','unitWordPage','unitGalleryPage','unitModelPage','unit2122LegacySnapshot'])expect(after.activity[key]).toEqual(before.activity[key]);
  20 |  await page.goto('/unit21-22/#learn/grammar');await expect(grammar.locator('.progress-copy')).toHaveText('第 2 / 10 题');await expect(grammar.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(grammar.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'her',exact:true})).toHaveAttribute('aria-pressed','true');
  21 |  await page.goto('/unit21-22/#learn/exam');await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.handoff-arrived')).toHaveCount(0);await page.goto('/unit21-22/#learn/text');await expect(page.locator('.btext span')).toHaveCount(4);await page.goto('/unit21-22/#learn/words');await expect(page.locator('#wordPageProgress')).toHaveText('3 / 6');
  22 |  await page.goto('/unit21-22/#learn/apply');await page.getByText('课本小参考 · 第22课',{exact:true}).click();await expect(page.locator('.gallery-current + .reference-pager span')).toHaveText('4 / 8');await expect(page.locator('.gallery-current small')).toHaveText(['1,007','1,008']);await expect(page.locator('.model-current + .reference-pager span')).toHaveText('3 / 8');
  23 | });
  24 | test('现有完整语法轮次和星星保留，不向旧独立作答追记示范',async({page})=>{
  25 |  test.setTimeout(90000);const upgrade=await beforeReview(page);await activity(page,'grammar');const before=await readLearning(page);expect(Boolean(before.records['u2122-v1-owner-our'].revealed)).toBe(false);
  26 |  await upgrade();await page.reload();const room=page.locator('.stage-grammar');await expect(room.locator('.completion-number')).toHaveText(['10','10','0']);await expect(page.locator('#starCount')).toHaveText('1');const after=await readLearning(page);expect(after.groups).toEqual(before.groups);expect(after.records).toEqual(before.records);
  27 |  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await select(room,'I');await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.reload();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(page.locator('#starCount')).toHaveText('1');
  28 | });
  29 | 
```