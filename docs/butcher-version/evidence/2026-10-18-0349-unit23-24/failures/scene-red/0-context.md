# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit23-24-v153.spec.js >> 候选杯组先由简拿起，被否定后放回，再换拿搁板杯组
- Location: tests\e2e\unit23-24-v153.spec.js:18:1

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  locator('.stage-text').locator('.table-set')
Expected: hidden
Received: visible
Timeout:  5000ms

Call log:
  - Expect "toBeHidden" with timeout 5000ms
  - waiting for locator('.stage-text').locator('.table-set')
    14 × locator resolved to <g class="table-set is-focus" transform="translate(0 0)">…</g>
       - unexpected value "visible"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "我的课程" [ref=e4] [cursor=pointer]:
        - /url: /
      - generic [ref=e5]:
        - generic [ref=e6]:
          - img "星星" [ref=e7]
          - text: 0/5
        - button "学习手记" [ref=e8] [cursor=pointer]
    - navigation "学习关卡" [ref=e9]:
      - generic [ref=e10]:
        - text: 所在关卡
        - combobox "选择关卡" [ref=e11]:
          - option "认识房间物品"
          - option "帮简找对杯子" [selected]
          - option "看清物品位置"
          - option "说清哪一些"
          - option "完成寻物委托"
  - generic [ref=e12]:
    - img "男士双手托着刚接过的一组玻璃杯，简双手空着，两人相视微笑" [ref=e14]
    - generic [ref=e15]:
      - paragraph [ref=e16]: 新概念英语 · Lesson 23–24
      - heading "房间寻物队" [level=1] [ref=e17]
      - paragraph [ref=e18]: 和简一起找对哪一些，用位置把要求说清楚。
      - button "继续冒险" [ref=e19] [cursor=pointer]
  - main [ref=e20]:
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading "认识房间物品" [level=2] [ref=e23]
        - generic "本关 0 / 1 颗星" [ref=e24]: ☆
      - region "寻物小图鉴" [ref=e25]:
        - heading "寻物小图鉴" [level=3] [ref=e28]
        - generic [ref=e29]:
          - button "on" [ref=e30] [cursor=pointer]:
            - strong [ref=e31]: "on"
            - generic [ref=e32]: /ɑːn/
            - generic [ref=e33]: on the shelf
          - button "shelf" [ref=e34] [cursor=pointer]:
            - strong [ref=e35]: shelf
            - generic [ref=e36]: /ʃelf/
          - button "desk" [ref=e37] [cursor=pointer]:
            - strong [ref=e38]: desk
            - generic [ref=e39]: /desk/
          - button "table" [ref=e40] [cursor=pointer]:
            - strong [ref=e41]: table
            - generic [ref=e42]: /ˈteɪbəl/
          - button "plate" [ref=e43] [cursor=pointer]:
            - strong [ref=e44]: plate
            - generic [ref=e45]: /pleɪt/
          - button "cupboard" [ref=e46] [cursor=pointer]:
            - strong [ref=e47]: cupboard
            - generic [ref=e48]: /ˈkʌbɚd/
        - generic [ref=e49]:
          - button "上一组词卡" [disabled] [ref=e50]
          - generic [ref=e51]: 1 / 5
          - button "下一组词卡" [ref=e52] [cursor=pointer]
      - region "单词寻宝" [ref=e53]:
        - heading "单词寻宝" [level=3] [ref=e56]
        - generic [ref=e57]:
          - generic [ref=e58]:
            - paragraph [ref=e59]:
              - generic [ref=e60]: 第 1 / 13 题
              - progressbar "本轮进度" [ref=e61]
            - heading "on 在这里表示什么？" [level=3] [ref=e75]
            - region "题目材料" [ref=e76]:
              - paragraph [ref=e77]: on the shelf
            - generic [ref=e78]:
              - button "在……下面" [ref=e79] [cursor=pointer]
              - button "在……旁边" [ref=e80] [cursor=pointer]
              - button "在……里面" [ref=e81] [cursor=pointer]
              - button "在……上面" [ref=e82] [cursor=pointer]
          - generic [ref=e83]:
            - region "答题反馈" [ref=e84]:
              - status [ref=e85]
            - group "作答操作" [ref=e86]:
              - button "检查答案" [disabled] [ref=e87]
    - generic [ref=e88]:
      - generic [ref=e89]:
        - heading "帮简找对杯子" [level=2] [ref=e90]
        - generic "本关 0 / 1 颗星" [ref=e91]: ☆
      - region "找杯子小剧场" [ref=e92]:
        - heading "找杯子小剧场" [level=3] [ref=e95]
        - generic [ref=e96]:
          - group "男士和简在房间里确认并交接玻璃杯" [ref=e97]:
            - paragraph [ref=e98]: 房间里
            - generic [ref=e99]:
              - img "桌面和墙上搁板上各放着一组玻璃杯" [ref=e101]
              - generic [ref=e131]:
                - generic [ref=e132]:
                  - img "男士双手空着，面向对方" [ref=e133]
                  - generic [ref=e134]: 男士
                - generic [ref=e135]:
                  - img "简双手空着，面向对方" [ref=e136]
                  - generic [ref=e137]: 简（Jane）
          - generic [ref=e138]:
            - log "课文对话" [ref=e139]:
              - generic [ref=e141]:
                - generic [ref=e142]: 男士
                - paragraph [ref=e143]:
                  - generic [ref=e144]: Give me some glasses please, Jane.
                - button "看中文" [ref=e146] [cursor=pointer]
              - generic [ref=e148]:
                - generic [ref=e149]: 简（Jane）
                - paragraph [ref=e150]:
                  - generic [ref=e151]: Which glasses?
                - button "看中文" [ref=e153] [cursor=pointer]
              - generic [ref=e155]:
                - generic [ref=e156]: 简（Jane）
                - paragraph [ref=e157]:
                  - generic [ref=e158]: These glasses?
                - button "看中文" [ref=e160] [cursor=pointer]
            - status "已读 3 / 8 句课文" [ref=e161]: 3 / 8
            - generic [ref=e162]:
              - button "重新上演" [ref=e164] [cursor=pointer]
              - button "下一句" [active] [ref=e165] [cursor=pointer]
      - region "故事小侦探" [ref=e166]:
        - heading "故事小侦探" [level=3] [ref=e169]
        - button "先看故事" [ref=e171] [cursor=pointer]
    - generic [ref=e172]:
      - generic [ref=e173]:
        - heading "看清物品位置" [level=2] [ref=e174]
        - generic "本关 0 / 1 颗星" [ref=e175]: ☆
      - region "语法小工坊" [ref=e176]:
        - heading "语法小工坊" [level=3] [ref=e179]
        - generic [ref=e180]:
          - generic [ref=e181]:
            - generic [ref=e182]:
              - paragraph [ref=e183]:
                - generic [ref=e184]: 第 1 / 9 题
                - progressbar "本轮进度" [ref=e185]
              - region "短示范" [ref=e195]:
                - generic [ref=e196]:
                  - paragraph [ref=e197]: The glasses are on the shelf.
                  - generic [ref=e198]: 玻璃杯放在搁板表面上，杯底与搁板相接。
              - heading "几本书平放在桌面上，空格选什么？" [level=3] [ref=e199]
            - region "题目材料" [ref=e200]:
              - paragraph [ref=e201]: The books are ___ the table.
              - paragraph [ref=e202]: in：在里面；under：在下面。
            - group "选择回应" [ref=e203]:
              - button "under" [ref=e204] [cursor=pointer]
              - button "in" [ref=e205] [cursor=pointer]
              - button "on" [ref=e206] [cursor=pointer]
          - generic [ref=e207]:
            - region "答题反馈" [ref=e208]:
              - status [ref=e209]
            - group "作答操作" [ref=e210]:
              - button "检查答案" [disabled] [ref=e211]
        - group [ref=e212]:
          - generic "语法小参考 ＋" [ref=e213] [cursor=pointer]
    - generic [ref=e214]:
      - generic [ref=e215]:
        - heading "说清哪一些" [level=2] [ref=e216]
        - generic "本关 0 / 1 颗星" [ref=e217]: ☆
      - region "寻物小帮手" [ref=e218]:
        - heading "寻物小帮手" [level=3] [ref=e221]
        - generic [ref=e222]:
          - generic [ref=e223]:
            - generic [ref=e224]:
              - paragraph [ref=e225]:
                - generic [ref=e226]: 第 1 / 6 题
                - progressbar "本轮进度" [ref=e227]
              - heading "哪句话符合新要求？" [level=3] [ref=e234]
              - region "题目材料" [ref=e235]:
                - paragraph [ref=e236]: 原来要一本书，现在要几本。
              - note [ref=e237]: 读清要求，再检查。
            - group "选择回应" [ref=e238]:
              - button "Give me some books, please." [ref=e239] [cursor=pointer]
              - button "Give me some book, please." [ref=e240] [cursor=pointer]
              - button "Give me a book, please." [ref=e241] [cursor=pointer]
          - generic [ref=e242]:
            - region "答题反馈" [ref=e243]:
              - status [ref=e244]
            - group "作答操作" [ref=e245]:
              - button "给点线索" [ref=e246] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e248]
        - group [ref=e249]:
          - generic "课本小参考 · 第24课 ＋" [ref=e250] [cursor=pointer]
    - generic [ref=e251]:
      - generic [ref=e252]:
        - heading "完成寻物委托" [level=2] [ref=e253]
        - generic "本关 0 / 1 颗星" [ref=e254]: ☆
      - region "综合挑战" [ref=e255]:
        - heading "综合挑战" [level=3] [ref=e258]
        - generic [ref=e259]:
          - generic [ref=e260]:
            - generic [ref=e261]:
              - paragraph [ref=e262]:
                - generic [ref=e263]: 第 1 / 15 题
                - progressbar "本轮进度" [ref=e264]
              - heading "应该怎样做？" [level=3] [ref=e280]
              - region "题目材料" [ref=e281]:
                - paragraph [ref=e282]: 简是女士，这里的 her 指简。
                - paragraph [ref=e283]: Give her some magazines, please.
                - paragraph [ref=e284]: The ones on the bed.
              - note [ref=e285]: 读清要求，再检查。
            - group "选择回应" [ref=e286]:
              - button "把床上的几本杂志递给简。" [ref=e287] [cursor=pointer]
              - button "把床上的几本杂志递给说话的人。" [ref=e288] [cursor=pointer]
              - button "把架子上的几本杂志递给简。" [ref=e289] [cursor=pointer]
          - generic [ref=e290]:
            - region "答题反馈" [ref=e291]:
              - status [ref=e292]
            - group "作答操作" [ref=e293]:
              - button "给点线索" [ref=e294] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e296]
      - region "我的单元纪念卡" [ref=e297]:
        - heading "我的单元纪念卡" [level=3] [ref=e300]
        - generic [ref=e301]:
          - article "我的单元纪念卡" [ref=e302]:
            - paragraph [ref=e303]: 灿然英语工作室
            - heading "细心寻物小达人" [level=3] [ref=e304]
            - paragraph [ref=e305]: 登录后显示姓名
            - group "已获得 0 / 5 颗星" [ref=e306]
            - img "男士双手托着刚接过的一组玻璃杯，简双手空着，两人相视微笑"
            - paragraph [ref=e312]:
              - generic [ref=e313]: Lesson 23–24
          - generic [ref=e314]:
            - button "保存动图" [disabled] [ref=e315]
            - link "返回课程" [ref=e316] [cursor=pointer]:
              - /url: http://127.0.0.1:4308/
          - status [ref=e317]
          - group [ref=e318]:
            - generic "星星进度" [ref=e319] [cursor=pointer]
        - group [ref=e320]:
          - generic "课后练习纸 ＋" [ref=e321] [cursor=pointer]
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
  16 |  await page.goto('/unit23-24/#learn/exam');const room=page.locator('.stage-exam');for(const answer of ANSWERS.exam.slice(0,7))await next(room,answer);await room.screenshot({path:info.outputPath('exam-8-unanswered.png')});await expect(room.locator('.practice-context')).toContainText('他们请简把这些盒子递回给自己。');await expect(room.locator('.grammar-model')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await select(room,{fills:['our']});await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.locator('.practice-context')).toContainText('他们请简把这些盒子递回给自己。');await select(room,ANSWERS.exam[7]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
  17 | });
  18 | test('候选杯组先由简拿起，被否定后放回，再换拿搁板杯组',async({page},info)=>{
  19 |  await page.setViewportSize({width:390,height:844});await page.goto('/unit23-24/#learn/text');const room=page.locator('.stage-text');
  20 |  for(let i=0;i<8;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();const jane=room.locator('.jane .cast-image'),man=room.locator('.man .cast-image');
> 21 |   await expect(room.locator('.table-set'))[i===2||i===3?'toBeHidden':'toBeVisible']();await expect(room.locator('.shelf-set'))[i<4?'toBeVisible':'toBeHidden']();
     |                                                                                    ^ Error: expect(locator).toBeHidden() failed
  22 |   await expect(jane).toHaveAttribute('data-holding',String(i>=2&&i<6));await expect(man).toHaveAttribute('data-holding',String(i>=6));
  23 |   if(i===2||i===3){await expect(jane).toHaveAttribute('alt','简双手托着桌上的候选杯组');await room.screenshot({path:info.outputPath('candidate-held-'+i+'.png')});}
  24 |   if(i===4){await expect(jane).toHaveAttribute('alt','简双手托着从搁板取下的目标杯组');await page.reload();await expect(room.locator('.btext span')).toHaveCount(5);await expect(room.locator('.table-set')).toBeVisible();await expect(room.locator('.shelf-set')).toBeHidden();await room.screenshot({path:info.outputPath('shelf-held-after-reload.png')});}
  25 |  }
  26 | });
  27 | 
```