# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit23-24-v153.spec.js >> 归属与接收者题在未答时明确递回请求，不能只给物主事实
- Location: tests\e2e\unit23-24-v153.spec.js:15:1

# Error details

```
TimeoutError: locator.click: Timeout 7000ms exceeded.
Call log:
  - waiting for locator('.stage-exam').getByRole('button', { name: '检查答案', exact: true })
    - locator resolved to <button disabled type="button" class="btn btn-green">检查答案</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    13 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - banner [ref=f1e2]:
    - generic [ref=f1e3]:
      - link "我的课程" [ref=f1e4] [cursor=pointer]:
        - /url: /
      - generic [ref=f1e5]:
        - generic [ref=f1e6]:
          - img "星星" [ref=f1e7]
          - text: 0/5
        - button "学习手记" [ref=f1e8] [cursor=pointer]
    - navigation "学习关卡" [ref=f1e9]:
      - generic [ref=f1e10]:
        - link "认识房间物品" [ref=f1e11] [cursor=pointer]:
          - /url: "#l1"
        - link "帮简找对杯子" [ref=f1e12] [cursor=pointer]:
          - /url: "#l2"
        - link "看清物品位置" [ref=f1e13] [cursor=pointer]:
          - /url: "#l3"
        - link "说清哪一些" [ref=f1e14] [cursor=pointer]:
          - /url: "#l4"
        - link "完成寻物委托" [ref=f1e15] [cursor=pointer]:
          - /url: "#l5"
  - generic [ref=f1e16]:
    - img "男士双手托着刚接过的一组玻璃杯，简双手空着，两人相视微笑" [ref=f1e18]
    - generic [ref=f1e19]:
      - paragraph [ref=f1e20]: 新概念英语 · Lesson 23–24
      - heading "房间寻物队" [level=1] [ref=f1e21]
      - paragraph [ref=f1e22]: 和简一起找对哪一些，用位置把要求说清楚。
      - button "继续冒险" [ref=f1e23] [cursor=pointer]
  - main [ref=f1e24]:
    - generic [ref=f1e25]:
      - generic [ref=f1e26]:
        - heading "认识房间物品" [level=2] [ref=f1e27]
        - generic "本关 0 / 1 颗星" [ref=f1e28]: ☆
      - region "寻物小图鉴" [ref=f1e29]:
        - heading "寻物小图鉴" [level=3] [ref=f1e32]
        - generic [ref=f1e33]:
          - button "on" [ref=f1e34] [cursor=pointer]:
            - strong [ref=f1e35]: "on"
            - generic [ref=f1e36]: /ɑːn/
            - generic [ref=f1e37]: on the shelf
          - button "shelf" [ref=f1e38] [cursor=pointer]:
            - strong [ref=f1e39]: shelf
            - generic [ref=f1e40]: /ʃelf/
          - button "desk" [ref=f1e41] [cursor=pointer]:
            - strong [ref=f1e42]: desk
            - generic [ref=f1e43]: /desk/
          - button "table" [ref=f1e44] [cursor=pointer]:
            - strong [ref=f1e45]: table
            - generic [ref=f1e46]: /ˈteɪbəl/
          - button "plate" [ref=f1e47] [cursor=pointer]:
            - strong [ref=f1e48]: plate
            - generic [ref=f1e49]: /pleɪt/
          - button "cupboard" [ref=f1e50] [cursor=pointer]:
            - strong [ref=f1e51]: cupboard
            - generic [ref=f1e52]: /ˈkʌbɚd/
        - generic [ref=f1e53]:
          - button "上一组词卡" [disabled] [ref=f1e54]
          - generic [ref=f1e55]: 1 / 5
          - button "下一组词卡" [ref=f1e56] [cursor=pointer]
      - region "单词寻宝" [ref=f1e57]:
        - heading "单词寻宝" [level=3] [ref=f1e60]
        - generic [ref=f1e61]:
          - generic [ref=f1e62]:
            - paragraph [ref=f1e63]:
              - generic [ref=f1e64]: 第 1 / 13 题
              - progressbar "本轮进度" [ref=f1e65]
            - heading "on 在这里表示什么？" [level=3] [ref=f1e79]
            - region "题目材料" [ref=f1e80]:
              - paragraph [ref=f1e81]: on the shelf
            - generic [ref=f1e82]:
              - button "在……旁边" [ref=f1e83] [cursor=pointer]
              - button "在……上面" [ref=f1e84] [cursor=pointer]
              - button "在……下面" [ref=f1e85] [cursor=pointer]
              - button "在……里面" [ref=f1e86] [cursor=pointer]
          - generic [ref=f1e87]:
            - region "答题反馈" [ref=f1e88]:
              - status [ref=f1e89]
            - group "作答操作" [ref=f1e90]:
              - button "检查答案" [disabled] [ref=f1e91]
    - generic [ref=f1e92]:
      - generic [ref=f1e93]:
        - heading "帮简找对杯子" [level=2] [ref=f1e94]
        - generic "本关 0 / 1 颗星" [ref=f1e95]: ☆
      - region "找杯子小剧场" [ref=f1e96]:
        - heading "找杯子小剧场" [level=3] [ref=f1e99]
        - generic [ref=f1e100]:
          - group "男士和简在房间里确认并交接玻璃杯" [ref=f1e101]:
            - paragraph [ref=f1e102]: 房间里
            - generic [ref=f1e103]:
              - img "桌面和墙上搁板上各放着一组玻璃杯" [ref=f1e105]
              - generic [ref=f1e135]:
                - generic [ref=f1e136]:
                  - img "男士双手空着，面向对方" [ref=f1e137]
                  - generic [ref=f1e138]: 男士
                - generic [ref=f1e139]:
                  - img "简双手空着，面向对方" [ref=f1e140]
                  - generic [ref=f1e141]: 简（Jane）
          - generic [ref=f1e142]:
            - log "课文对话" [ref=f1e143]:
              - paragraph [ref=f1e145]: Which glasses does the man want?
            - status "尚未开始阅读" [ref=f1e146]
            - button "开始看课文" [ref=f1e148] [cursor=pointer]
      - region "故事小侦探" [ref=f1e149]:
        - heading "故事小侦探" [level=3] [ref=f1e152]
        - button "先看故事" [ref=f1e154] [cursor=pointer]
    - generic [ref=f1e155]:
      - generic [ref=f1e156]:
        - heading "看清物品位置" [level=2] [ref=f1e157]
        - generic "本关 0 / 1 颗星" [ref=f1e158]: ☆
      - region "语法小工坊" [ref=f1e159]:
        - heading "语法小工坊" [level=3] [ref=f1e162]
        - generic [ref=f1e163]:
          - generic [ref=f1e164]:
            - generic [ref=f1e165]:
              - paragraph [ref=f1e166]:
                - generic [ref=f1e167]: 第 1 / 9 题
                - progressbar "本轮进度" [ref=f1e168]
              - region "短示范" [ref=f1e178]:
                - generic [ref=f1e179]:
                  - paragraph [ref=f1e180]: The glasses are on the shelf.
                  - generic [ref=f1e181]: 玻璃杯放在搁板表面上，杯底与搁板相接。
              - heading "几本书平放在桌面上，空格选什么？" [level=3] [ref=f1e182]
            - region "题目材料" [ref=f1e183]:
              - paragraph [ref=f1e184]: The books are ___ the table.
              - paragraph [ref=f1e185]: in：在里面；under：在下面。
            - group "选择回应" [ref=f1e186]:
              - button "under" [ref=f1e187] [cursor=pointer]
              - button "on" [ref=f1e188] [cursor=pointer]
              - button "in" [ref=f1e189] [cursor=pointer]
          - generic [ref=f1e190]:
            - region "答题反馈" [ref=f1e191]:
              - status [ref=f1e192]
            - group "作答操作" [ref=f1e193]:
              - button "检查答案" [disabled] [ref=f1e194]
        - group [ref=f1e195]:
          - generic "语法小参考 ＋" [ref=f1e196] [cursor=pointer]
    - generic [ref=f1e197]:
      - generic [ref=f1e198]:
        - heading "说清哪一些" [level=2] [ref=f1e199]
        - generic "本关 0 / 1 颗星" [ref=f1e200]: ☆
      - region "寻物小帮手" [ref=f1e201]:
        - heading "寻物小帮手" [level=3] [ref=f1e204]
        - generic [ref=f1e205]:
          - generic [ref=f1e206]:
            - generic [ref=f1e207]:
              - paragraph [ref=f1e208]:
                - generic [ref=f1e209]: 第 1 / 6 题
                - progressbar "本轮进度" [ref=f1e210]
              - heading "哪句话符合新要求？" [level=3] [ref=f1e217]
              - region "题目材料" [ref=f1e218]:
                - paragraph [ref=f1e219]: 原来要一本书，现在要几本。
              - note [ref=f1e220]: 读清要求，再检查。
            - group "选择回应" [ref=f1e221]:
              - button "Give me a book, please." [ref=f1e222] [cursor=pointer]
              - button "Give me some books, please." [ref=f1e223] [cursor=pointer]
              - button "Give me some book, please." [ref=f1e224] [cursor=pointer]
          - generic [ref=f1e225]:
            - region "答题反馈" [ref=f1e226]:
              - status [ref=f1e227]
            - group "作答操作" [ref=f1e228]:
              - button "给点线索" [ref=f1e229] [cursor=pointer]
              - button "检查答案" [disabled] [ref=f1e231]
        - group [ref=f1e232]:
          - generic "课本小参考 · 第24课 ＋" [ref=f1e233] [cursor=pointer]
    - generic [ref=f1e234]:
      - generic [ref=f1e235]:
        - heading "完成寻物委托" [level=2] [ref=f1e236]
        - generic "本关 0 / 1 颗星" [ref=f1e237]: ☆
      - region "综合挑战" [ref=f1e238]:
        - heading "综合挑战" [level=3] [ref=f1e241]
        - generic [ref=f1e242]:
          - generic [ref=f1e243]:
            - generic [ref=f1e244]:
              - paragraph [ref=f1e245]:
                - generic [ref=f1e246]: 第 8 / 15 题
                - progressbar "本轮进度" [ref=f1e247]
              - heading "两位同学请求递回自己的盒子，一起说：" [level=3] [ref=f1e263]
              - region "题目材料" [ref=f1e264]:
                - paragraph [ref=f1e265]: 盒子属于说话的这两位同学。他们请简把这些盒子递回给自己。
              - note [ref=f1e266]: 读清要求，再检查。
            - group "选择回应" [ref=f1e267]:
              - group "第1处填空" [ref=f1e268]:
                - paragraph [ref=f1e269]:
                  - text: Those are
                  - generic [ref=f1e270]: ___
                  - text: boxes.
                - generic [ref=f1e271]:
                  - button "our" [ref=f1e272] [cursor=pointer]
                  - button "us" [ref=f1e273] [cursor=pointer]
                  - button "their" [ref=f1e274] [cursor=pointer]
              - group "第2处填空" [ref=f1e275]:
                - paragraph [ref=f1e276]:
                  - text: Give
                  - generic [ref=f1e277]: us
                  - text: those boxes, please.
                - generic [ref=f1e278]:
                  - button "us" [active] [pressed] [ref=f1e279] [cursor=pointer]
                  - button "our" [ref=f1e280] [cursor=pointer]
                  - button "them" [ref=f1e281] [cursor=pointer]
          - generic [ref=f1e282]:
            - region "答题反馈" [ref=f1e283]:
              - status [ref=f1e284]
            - group "作答操作" [ref=f1e285]:
              - button "给点线索" [ref=f1e286] [cursor=pointer]
              - button "检查答案" [disabled] [ref=f1e288]
      - region "我的单元纪念卡" [ref=f1e289]:
        - heading "我的单元纪念卡" [level=3] [ref=f1e292]
        - generic [ref=f1e293]:
          - article "我的单元纪念卡" [ref=f1e294]:
            - paragraph [ref=f1e295]: 灿然英语工作室
            - heading "细心寻物小达人" [level=3] [ref=f1e296]
            - paragraph [ref=f1e297]: 登录后显示姓名
            - group "已获得 0 / 5 颗星" [ref=f1e298]
            - img "男士双手托着刚接过的一组玻璃杯，简双手空着，两人相视微笑"
            - paragraph [ref=f1e304]:
              - generic [ref=f1e305]: Lesson 23–24
          - generic [ref=f1e306]:
            - button "保存动图" [disabled] [ref=f1e307]
            - link "返回课程" [ref=f1e308] [cursor=pointer]:
              - /url: http://127.0.0.1:4308/
          - status [ref=f1e309]
          - group [ref=f1e310]:
            - generic "星星进度" [ref=f1e311] [cursor=pointer]
        - group [ref=f1e312]:
          - generic "课后练习纸 ＋" [ref=f1e313] [cursor=pointer]
  - text: ·
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
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ^ TimeoutError: locator.click: Timeout 7000ms exceeded.
  17 | });
  18 | test('候选杯组先由简拿起，被否定后放回，再换拿搁板杯组',async({page},info)=>{
  19 |  await page.setViewportSize({width:390,height:844});await page.goto('/unit23-24/#learn/text');const room=page.locator('.stage-text');
  20 |  for(let i=0;i<8;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();const jane=room.locator('.jane .cast-image'),man=room.locator('.man .cast-image');
  21 |   await expect(room.locator('.table-set'))[i===2||i===3?'toBeHidden':'toBeVisible']();await expect(room.locator('.shelf-set'))[i<4?'toBeVisible':'toBeHidden']();
  22 |   await expect(jane).toHaveAttribute('data-holding',String(i>=2&&i<6));await expect(man).toHaveAttribute('data-holding',String(i>=6));
  23 |   if(i===2||i===3){await expect(jane).toHaveAttribute('alt','简双手托着桌上的候选杯组');await room.screenshot({path:info.outputPath('candidate-held-'+i+'.png')});}
  24 |   if(i===4){await expect(jane).toHaveAttribute('alt','简双手托着从搁板取下的目标杯组');await page.reload();await expect(room.locator('.btext span')).toHaveCount(5);await expect(room.locator('.table-set')).toBeVisible();await expect(room.locator('.shelf-set')).toBeHidden();await room.screenshot({path:info.outputPath('shelf-held-after-reload.png')});}
  25 |  }
  26 | });
  27 | 
```