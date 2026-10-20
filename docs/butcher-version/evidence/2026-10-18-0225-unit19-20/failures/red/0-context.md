# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit19-20-v153.spec.js >> 主语be和形容词两道旧题补短示范；实际帮助入手记
- Location: tests\e2e\unit19-20-v153.spec.js:13:1

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
    - text: 所在关卡
    - combobox "选择关卡":
      - option "公园歇一歇"
      - option "跟着故事走"
      - option "发现身边的事物" [selected]
      - option "把情况说清楚"
      - option "再出发"
- img "妈妈和两个孩子相视微笑，孩子们各拿着一份冰淇淋"
- paragraph: 新概念英语 · Lesson 19–20
- heading "冰淇淋休息站" [level=1]
- paragraph: 跟着妈妈和孩子们，发现身边的人和物，把情况说清楚。
- button "继续冒险"
- main:
  - heading "公园歇一歇" [level=2]
  - text: ☆
  - region "公园小图鉴":
    - heading "公园小图鉴" [level=3]
    - button "tired":
      - strong: tired
      - text: /taɪrd/
    - button "thirsty":
      - strong: thirsty
      - text: /ˈθɝːsti/
    - button "children":
      - strong: children
      - text: /ˈtʃɪldrən/
    - button "boy":
      - strong: boy
      - text: /bɔɪ/
    - button "mum":
      - strong: mum
      - text: /mʌm/
    - button "ice cream":
      - strong: ice cream
      - text: /ˈaɪs ˌkriːm/
    - button "上一组词卡" [disabled]
    - text: 1 / 6
    - button "下一组词卡"
  - region "单词寻宝":
    - heading "单词寻宝" [level=3]
    - paragraph:
      - text: 第 1 / 15 题
      - progressbar "本轮进度"
    - heading "选出这个词的意思" [level=3]
    - region "题目材料":
      - paragraph: tired
    - button "年轻的"
    - button "累的；疲倦的"
    - button "忙碌的"
    - button "口渴的"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
  - heading "跟着故事走" [level=2]
  - text: ☆
  - region "公园小剧场":
    - heading "公园小剧场" [level=3]
    - group "妈妈和两个孩子在公园长椅旁":
      - paragraph: 公园
      - img "妈妈关心站在长椅旁的两个孩子"
      - text: 妈妈 女孩 男孩
    - log "课文对话":
      - paragraph: Why do the children thank their mother?
    - status "尚未开始阅读"
    - button "开始看课文"
  - region "故事小侦探":
    - heading "故事小侦探" [level=3]
    - button "先看故事"
  - heading "发现身边的事物" [level=2]
  - text: ☆
  - region "语法小工坊":
    - heading "语法小工坊" [level=3]
    - paragraph:
      - text: 第 15 / 16 题
      - progressbar "本轮进度"
    - heading "把孩子们和妈妈的情况补完整" [level=3]
    - group "选择回应":
      - group "第1处填空":
        - paragraph: Those children ___ tired.
        - button "are"
        - button "is"
        - button "am"
      - group "第2处填空":
        - paragraph: Their mother ___ tired, too.
        - button "is"
        - button "are"
        - button "am"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
    - group: 语法小参考 ＋
  - heading "把情况说清楚" [level=2]
  - text: ☆
  - region "公园小帮手":
    - heading "公园小帮手" [level=3]
    - paragraph:
      - text: 第 1 / 8 题
      - progressbar "本轮进度"
    - heading "把每个短语和这里的意思配好" [level=3]
    - note: 选好表达，再检查。
    - group "选择回应":
      - group "英文":
        - button "old hats"
        - button "old men"
        - button "short trousers"
        - button "short men"
      - group "这里的意思":
        - button "年老的男士" [disabled]
        - button "矮个男士" [disabled]
        - button "短的裤子" [disabled]
        - button "旧帽子" [disabled]
      - paragraph: 已配 0 / 4 对
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
    - group: 课本小参考 · 第20课 ＋
  - heading "再出发" [level=2]
  - text: ☆
  - region "综合挑战":
    - heading "综合挑战" [level=3]
    - paragraph:
      - text: 第 1 / 23 题
      - progressbar "本轮进度"
    - heading "哪条记录符合他们说的话？" [level=3]
    - region "题目材料":
      - paragraph: 新来的孩子们说：
      - paragraph: We’re tired. We aren’t thirsty.
    - note: 选好表达，再检查。
    - group "选择回应":
      - button "累了；不渴"
      - button "不累；口渴"
      - button "累了；口渴"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
  - region "我的单元纪念卡":
    - heading "我的单元纪念卡" [level=3]
    - article "我的单元纪念卡":
      - paragraph: 灿然英语工作室
      - heading "公园观察小达人" [level=3]
      - paragraph: 登录后显示姓名
      - group "已获得 0 / 5 颗星"
      - img "妈妈和两个孩子相视微笑，孩子们各拿着一份冰淇淋"
      - paragraph: Lesson 19–20
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
  3  | const {ANSWERS,select,activity}=require('../support/unit1920-fivezones');
  4  | test.use({actionTimeout:7000,...(process.env.UNIT1920_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5  | test('综合挑战每次最多两空；全部未答材料可见且保留独立作答',async({page},info)=>{
  6  |  test.setTimeout(120000);await activity(page,'exam',{inspect:async(room,index,state)=>{
  7  |   if(state!=='before')return;
  8  |   const fills=room.getByRole('group',{name:/第\d+处填空/});expect(await fills.count()).toBeLessThanOrEqual(2);
  9  |   await expect(room.locator('.grammar-model')).toHaveCount(0);
  10 |   if([3,4,7,13].includes(index))await room.screenshot({path:info.outputPath('exam-'+(index+1)+'-unanswered.png')});
  11 |  }});
  12 | });
  13 | test('主语be和形容词两道旧题补短示范；实际帮助入手记',async({page},info)=>{
  14 |  test.setTimeout(120000);await page.setViewportSize({width:320,height:568});await page.goto('/unit19-20/#learn/grammar');const room=page.locator('.stage-grammar');
  15 |  for(let i=0;i<14;i++){await select(room,ANSWERS.grammar[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
  16 |  for(let i=14;i<16;i++){
> 17 |   await expect(room.getByRole('region',{name:'短示范',exact:true})).toBeVisible();
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  18 |   await room.screenshot({path:info.outputPath('grammar-'+(i+1)+'-unanswered-320.png')});
  19 |   await select(room,ANSWERS.grammar[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
  20 |   await room.getByRole('button',{name:i===15?'完成这一站':'下一题',exact:true}).click();
  21 |  }
  22 |  const book=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit19-20:learning:v1')));
  23 |  expect(book.records['u1920-tasks-v4-be-subject'].revealed).toBe(true);expect(book.records['u1920-v1-be-adjective'].revealed).toBe(true);
  24 |  await expect(room.locator('.completion-title')).toHaveText('存在与状态练习完成！');
  25 |  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  26 | });
  27 | 
```