# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit17-18-teaching-review.spec.js >> 首组不规则复数有错开的短示范；新词就近释义，示范使用如实入手记
- Location: tests\e2e\unit17-18-teaching-review.spec.js:8:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.stage-grammar').getByRole('region', { name: '短示范', exact: true })
Expected substring: "one milkman → two milkmen"
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
      - option "敲开办公室"
      - option "认识新同事"
      - option "身份与复数" [selected]
      - option "介绍新同事"
      - option "小小介绍员"
- img "Jackson向Richards介绍Jim，Jim抱着蓝灰色文件夹微笑"
- paragraph: 新概念英语 · Lesson 17–18
- heading "办公室探访记" [level=1]
- paragraph: 走进办公室，认识新同事，把人物身份和职业说清楚。
- button "继续冒险"
- main:
  - heading "敲开办公室" [level=2]
  - text: ☆
  - region "职业小图鉴":
    - heading "职业小图鉴" [level=3]
    - button "employee":
      - strong: employee
      - text: /ɪmˈplɔɪiː/
    - button "hard-working":
      - strong: hard-working
      - text: /ˌhɑːrdˈwɝːkɪŋ/
    - button "sales rep":
      - strong: sales rep
      - text: /ˈseɪlz ˌrep/
    - button "man":
      - strong: man
      - text: /mæn/
    - button "office":
      - strong: office
      - text: /ˈɑːfɪs/
    - button "assistant":
      - strong: assistant
      - text: /əˈsɪstənt/
    - button "上一组词卡" [disabled]
    - text: 1 / 5
    - button "下一组词卡"
  - region "单词寻宝":
    - heading "单词寻宝" [level=3]
    - paragraph:
      - text: 第 1 / 8 题
      - progressbar "本轮进度"
    - heading "选出这个词的意思" [level=3]
    - region "题目材料":
      - paragraph: employee
    - button "朋友"
    - button "游客"
    - button "雇员；员工"
    - button "老板"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
  - heading "认识新同事" [level=2]
  - text: ☆
  - region "办公室小剧场":
    - heading "办公室小剧场" [level=3]
    - group "Jackson和Richards在办公室介绍同事":
      - paragraph: 办公室
      - img "Jackson面向右侧，伸手介绍同事"
      - text: Mr. Jackson
      - img "Richards戴着帽子和眼镜，面向左侧听介绍"
      - text: Mr. Richards
    - log "课文对话":
      - paragraph: What are Michael Baker and Jeremy Short's jobs?
    - status "尚未开始阅读"
    - button "开始看课文"
  - region "故事小侦探":
    - heading "故事小侦探" [level=3]
    - button "先看故事"
  - heading "身份与复数" [level=2]
  - text: ☆
  - region "语法小工坊":
    - heading "语法小工坊" [level=3]
    - paragraph:
      - text: 第 4 / 20 题
      - progressbar "本轮进度"
    - heading "给单数标签找到复数伙伴" [level=3]
    - group "选择回应":
      - group "单数":
        - button "man"
        - button "woman"
        - button "policewoman"
        - button "housewife"
      - group "复数":
        - button "women" [disabled]
        - button "housewives" [disabled]
        - button "men" [disabled]
        - button "policewomen" [disabled]
      - paragraph: 已配 0 / 4 对
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
    - group: 语法小参考 ＋
  - heading "介绍新同事" [level=2]
  - text: ☆
  - region "访客小帮手":
    - heading "访客小帮手" [level=3]
    - paragraph:
      - text: 第 1 / 6 题
      - progressbar "本轮进度"
    - heading "想认识眼前这位年轻人，问“他是谁”，该说哪句？" [level=3]
    - note: 选好表达，再检查。
    - group "选择回应":
      - button "What's his job?"
      - button "How do you do?"
      - button "Who is this young man?"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
    - group: 课本小参考 · 第18课 ＋
  - heading "小小介绍员" [level=2]
  - text: ☆
  - region "综合挑战":
    - heading "综合挑战" [level=3]
    - paragraph:
      - text: 第 1 / 24 题
      - progressbar "本轮进度"
    - heading "你向另一位访客介绍这两位同事，应该说：" [level=3]
    - region "题目材料":
      - paragraph: 两位同事说：We are keyboard operators.
    - note: 选好表达，再检查。
    - group "选择回应":
      - button "We are keyboard operators."
      - button "Their are keyboard operators."
      - button "They are keyboard operators."
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
  - region "我的单元纪念卡":
    - heading "我的单元纪念卡" [level=3]
    - article "我的单元纪念卡":
      - paragraph: 灿然英语工作室
      - heading "同事介绍小达人" [level=3]
      - paragraph: 登录后显示姓名
      - group "已获得 0 / 5 颗星"
      - img "Jackson向Richards介绍Jim，Jim抱着蓝灰色文件夹微笑"
      - paragraph: Lesson 17–18
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
  3  | const {ANSWERS,select,activity}=require('../support/unit1718-fivezones');
  4  | const {beforeReview,readLearning}=require('../support/unit1718-teaching-review');
  5  | test.use({actionTimeout:7000,...(process.env.UNIT1718_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  6  | async function answerThenNext(room,answer){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}
  7  | 
  8  | test('首组不规则复数有错开的短示范；新词就近释义，示范使用如实入手记',async({page},info)=>{
  9  |  await page.setViewportSize({width:320,height:568});await page.goto('/unit17-18/#learn/grammar');const room=page.locator('.stage-grammar');
  10 |  for(const answer of ANSWERS.grammar.slice(0,3))await answerThenNext(room,answer);
  11 |  const model=room.getByRole('region',{name:'短示范',exact:true});
> 12 |  await expect(model).toContainText('one milkman → two milkmen');await expect(model).toContainText('one knife → two knives');
     |                      ^ Error: expect(locator).toContainText(expected) failed
  13 |  await expect(model).not.toContainText('housewives');await expect(model).not.toContainText('policewomen');
  14 |  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  15 |  await room.screenshot({path:info.outputPath('grammar4-unanswered-320.png')});
  16 |  await answerThenNext(room,ANSWERS.grammar[3]);
  17 |  const saved=await readLearning(page);expect(saved.records['u1718-tasks-v4-plural-labels'].revealed).toBe(true);
  18 |  await expect(room.getByRole('note',{name:'本题词义',exact:true})).toHaveText('child：孩子；foot：脚；tooth：牙齿；mouse：老鼠。');
  19 |  await expect(room.getByRole('note',{name:'本题词义',exact:true})).not.toContainText('children');
  20 |  await room.screenshot({path:info.outputPath('grammar5-unanswered-320.png')});
  21 |  await answerThenNext(room,ANSWERS.grammar[4]);await page.reload();expect((await readLearning(page)).records['u1718-tasks-v4-plural-labels'].revealed).toBe(true);
  22 |  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  23 | });
  24 | 
  25 | test('当前62题版错答、两空草稿、阅读词卡与两处参考分页原样续做',async({page})=>{
  26 |  const upgrade=await beforeReview(page);await page.goto('/unit17-18/#learn/words');
  27 |  for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  28 |  await page.goto('/unit17-18/#learn/text');await page.getByRole('button',{name:'开始看课文',exact:true}).click();for(let i=0;i<6;i++)await page.getByRole('button',{name:'下一句',exact:true}).click();
  29 |  await page.goto('/unit17-18/#learn/apply');await page.getByText('课本小参考 · 第18课',{exact:true}).click();for(let i=0;i<4;i++)await page.getByRole('button',{name:'下一幅职业图',exact:true}).click();for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一份问答',exact:true}).click();
  30 |  await page.goto('/unit17-18/#learn/listen');const listen=page.locator('.stage-listen');await select(listen,'老板');await listen.getByRole('button',{name:'检查答案',exact:true}).click();await expect(listen.locator('.fb')).toHaveText('再看看，试一次。');
  31 |  await page.goto('/unit17-18/#learn/grammar');const room=page.locator('.stage-grammar');for(const answer of ANSWERS.grammar.slice(0,2))await answerThenNext(room,answer);await select(room,{fills:['are']});const before=await readLearning(page);
  32 |  await upgrade();await page.reload();await expect(room.locator('.progress-copy')).toHaveText('第 3 / 20 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();const after=await readLearning(page);
  33 |  expect(after.groups).toEqual(before.groups);expect(after.records).toEqual(before.records);
  34 |  for(const key of ['unitWordPage','unitDialogue','unitGalleryPage','unitModelPage','unit1718LegacySnapshot','unit1718FiveZoneMigration'])expect(after.activity[key]).toEqual(before.activity[key]);
  35 |  await expect(room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'are',exact:true})).toHaveAttribute('aria-pressed','true');
  36 |  await page.goto('/unit17-18/#learn/listen');await expect(listen.locator('.fb')).toHaveText('再看看，试一次。');await page.goto('/unit17-18/#learn/text');await expect(page.locator('.btext span')).toHaveCount(7);
  37 |  await page.goto('/unit17-18/#learn/words');await expect(page.locator('#wordPageProgress')).toHaveText('4 / 5');
  38 |  await page.goto('/unit17-18/#learn/apply');await page.getByText('课本小参考 · 第18课',{exact:true}).click();await expect(page.locator('.gallery-current + .reference-pager span')).toHaveText('5 / 15');await expect(page.locator('.model-current + .reference-pager span')).toHaveText('4 / 10');
  39 | });
  40 | 
  41 | test('当前62题版已完成语法不重开；此前独立记录不被追记示范，重练仍保留原星',async({page})=>{
  42 |  test.setTimeout(150000);const upgrade=await beforeReview(page);await activity(page,'grammar');const before=await readLearning(page);expect(Boolean(before.records['u1718-tasks-v4-plural-labels'].revealed)).toBe(false);
  43 |  await expect(page.locator('#starCount')).toHaveText('1');await upgrade();await page.reload();const room=page.locator('.stage-grammar');await expect(room.locator('.completion-number')).toHaveText(['20','20','0']);await expect(room.locator('.completion-title')).toHaveText('身份与复数练习完成！');
  44 |  const after=await readLearning(page);expect(after.groups).toEqual(before.groups);expect(after.records).toEqual(before.records);await expect(page.locator('#starCount')).toHaveText('1');
  45 |  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await select(room,'She is a nurse.');await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.reload();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(page.locator('#starCount')).toHaveText('1');
  46 | });
  47 | 
```