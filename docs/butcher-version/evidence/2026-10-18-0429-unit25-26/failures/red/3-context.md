# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit25-26-v153.spec.js >> 三道继承语法题在未答时有短示范，新提交才登记帮助
- Location: tests\e2e\unit25-26-v153.spec.js:6:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.stage-grammar').getByRole('region', { name: '短示范', exact: true })
Expected substring: "There is a pen in the box."
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
      - option "先认识厨房"
      - option "走进史密斯家"
      - option "学会介绍物品" [selected]
      - option "说清物品位置"
      - option "完成厨房探访"
- img "史密斯太太介绍厨房，蓝电炉在左，白冰箱在右，桌上放着空瓶子与干净杯子"
- paragraph: 新概念英语 · Lesson 25–26
- heading "厨房探访记" [level=1]
- paragraph: 看看厨房里有什么，学会介绍物品、询问位置。
- button "继续冒险"
- main:
  - heading "先认识厨房" [level=2]
  - text: ☆
  - region "厨房小图鉴":
    - heading "厨房小图鉴" [level=3]
    - button "Mrs.":
      - strong: Mrs.
      - text: /ˈmɪsɪz/ Mrs. Smith
    - button "kitchen":
      - strong: kitchen
      - text: /ˈkɪtʃən/
    - button "refrigerator":
      - strong: refrigerator
      - text: /rɪˈfrɪdʒəreɪt̬ɚ/
    - button "electric":
      - strong: electric
      - text: /ɪˈlektrɪk/ electric cooker
    - button "cooker":
      - strong: cooker
      - text: /ˈkʊkɚ/
    - button "electric cooker":
      - strong: electric cooker
      - text: /ɪˈlektrɪk ˈkʊkɚ/
    - button "上一组词卡" [disabled]
    - text: 1 / 6
    - button "下一组词卡"
  - region "单词寻宝":
    - heading "单词寻宝" [level=3]
    - paragraph:
      - text: 第 1 / 7 题
      - progressbar "本轮进度"
    - heading "给位置词组选择配对" [level=3]
    - group "英文":
      - button "on the left"
      - button "on the right"
      - button "in the middle"
    - group "词义":
      - button "在右边" [disabled]
      - button "在左边" [disabled]
      - button "在中间" [disabled]
    - paragraph: 已配 0 / 3 对
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
  - heading "走进史密斯家" [level=2]
  - text: ☆
  - region "厨房小导览":
    - heading "厨房小导览" [level=3]
    - group "史密斯太太的厨房，从画面正面看":
      - paragraph: 厨房 · 从画面正面看
      - img "左侧蓝色电炉，右侧白色冰箱，中间桌上有一个空瓶子和一只干净杯子"
    - log "课文原文":
      - paragraph: What colour is the electric cooker?
    - status "尚未开始阅读"
    - button "开始看课文"
  - region "课文小侦探":
    - heading "课文小侦探" [level=3]
    - button "先看课文"
  - heading "学会介绍物品" [level=2]
  - text: ☆
  - region "语法小工坊":
    - heading "语法小工坊" [level=3]
    - paragraph:
      - text: 第 11 / 13 题
      - progressbar "本轮进度"
    - heading "选择位置词" [level=3]
    - img "左图：勺子在杯子里面；右图：叉子放在罐子上面。"
    - group "选择回应":
      - group "第1处填空":
        - paragraph: There is a spoon ___ the cup.
        - button "in"
        - button "on"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
    - group: 语法小参考 ＋
  - heading "说清物品位置" [level=2]
  - text: ☆
  - region "厨房小帮手":
    - heading "厨房小帮手" [level=3]
    - paragraph:
      - text: 第 1 / 5 题
      - progressbar "本轮进度"
    - heading "翻译这句话" [level=3]
    - note: 读清介绍，再检查。
    - region "阅读材料":
      - paragraph: There is a bottle on the table.
    - group "选择回应":
      - group "已选词块": … … … 。
      - group "待选词块":
        - button "没有"
        - button "一个杯子"
        - button "桌子上"
        - button "桌子里"
        - button "一个瓶子"
        - button "有"
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "检查答案" [disabled]
    - group: 课本小参考 · 第26课 ＋
  - heading "完成厨房探访" [level=2]
  - text: ☆
  - region "综合挑战":
    - heading "综合挑战" [level=3]
    - paragraph:
      - text: 第 1 / 17 题
      - progressbar "本轮进度"
    - heading "哪幅图符合这段介绍？" [level=3]
    - region "题目材料":
      - paragraph: There is a glass in the cupboard.
      - paragraph: The glass is empty.
    - note: 读清介绍，再检查。
    - group "选择回应":
      - button "甲图":
        - img "空玻璃杯在橱柜里面"
        - text: 甲图
      - button "丙图":
        - img "空玻璃杯放在橱柜顶面上"
        - text: 丙图
      - button "乙图":
        - img "装满液体的玻璃杯在橱柜里面"
        - text: 乙图
    - region "答题反馈":
      - status
    - group "作答操作":
      - button "给点线索"
      - button "检查答案" [disabled]
  - region "我的单元纪念卡":
    - heading "我的单元纪念卡" [level=3]
    - article "我的单元纪念卡":
      - paragraph: 灿然英语工作室
      - heading "细心厨房小向导" [level=3]
      - paragraph: 登录后显示姓名
      - group "已获得 0 / 5 颗星"
      - img "史密斯太太介绍厨房，蓝电炉在左，白冰箱在右，桌上放着空瓶子与干净杯子"
      - paragraph: Lesson 25–26
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
  3  | const {ANSWERS,select,story}=require('../support/unit2526-fivezones');
  4  | test.use({actionTimeout:7000,...(process.env.UNIT2526_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5  | async function next(room,answer,last=false){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:last?'完成这一站':'下一题',exact:true}).click();}
  6  | test('三道继承语法题在未答时有短示范，新提交才登记帮助',async({page},info)=>{
  7  |  await page.setViewportSize({width:320,height:568});await page.goto('/unit25-26/#learn/grammar');const room=page.locator('.stage-grammar');for(const a of ANSWERS.grammar.slice(0,10))await next(room,a);
> 8  |  for(const[n,text]of [[11,'There is a pen in the box.'],[12,'The plate is clean.'],[13,'Where is the book? It is on the table.']]){const model=room.getByRole('region',{name:'短示范',exact:true});await room.screenshot({path:info.outputPath('grammar-'+n+'-unanswered.png')});await expect(model).toContainText(text);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await next(room,ANSWERS.grammar[n-1],n===13);}
     |                                                                                                                                                                                                                                                                                                   ^ Error: expect(locator).toContainText(expected) failed
  9  |  const b=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit25-26:learning:v1')));for(const id of ['u2526-types-v1-t08','u2526-clicks-v1-clean','u2526-types-v1-t10'])expect(b.records[id].revealed).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  10 | });
  11 | for(const[area,number,lines]of [
  12 |  ['roles',3,['The refrigerator is white.','It is on the right.']],
  13 |  ['exam',3,['The refrigerator is white.','It is on the right.','The cooker is blue.','It is on the left.','There is a table in the middle of the room.']],
  14 |  ['exam',4,['There is a bottle on the table.','The bottle is empty.','There is a cup on the table, too.','The cup is clean.']]
  15 | ])test(`${area}第${number}题在未选和刷新后提供完整原文依据`,async({page},info)=>{
  16 |  await page.setViewportSize({width:320,height:568});if(area==='roles')await story(page);await page.goto('/unit25-26/#learn/'+area);const room=page.locator('.stage-'+area);for(const a of ANSWERS[area].slice(0,number-1))await next(room,a);
  17 |  await room.screenshot({path:info.outputPath(area+'-'+number+'-unanswered.png')});for(const line of lines)await expect(room.locator('.practice-context')).toContainText(line);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();for(const line of lines)await expect(room.locator('.practice-context')).toContainText(line);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await next(room,ANSWERS[area][number-1],number===ANSWERS[area].length);
  18 | });
  19 | test('五轮故事的手记说明准确，原题身份和已存目标不因标签修正改变',async({page},info)=>{
  20 |  await page.goto('/unit25-26/#learn/apply');const room=page.locator('.stage-apply');for(const a of ANSWERS.apply.slice(0,3))await next(room,a);await expect(room.locator('.task-reading-turn')).toHaveCount(5);await expect(room.locator('.task-reading')).not.toContainText('Here you are.');await select(room,ANSWERS.apply[3]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.getByRole('button',{name:'学习手记',exact:true}).click();const note=page.getByRole('dialog',{name:'学习手记',exact:true});await note.screenshot({path:info.outputPath('notebook-story-target.png')});await expect(note).toContainText('整合请求、属性与位置');await expect(note).not.toContainText('整合六轮故事');
  21 |  const r=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit25-26:learning:v1')).records['u2526-five-a-cup-story']);expect(r.target).toBe('整合六轮故事中的物品条件与位置');expect(r.attempts).toBe(1);
  22 | });
  23 | 
```