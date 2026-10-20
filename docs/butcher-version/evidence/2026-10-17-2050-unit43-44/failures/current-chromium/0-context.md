# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit43-44-v153-upgrade.spec.js >> 原错答、双空草稿、词卡页与阅读位置保留，服务器只承接可核实历史
- Location: tests\e2e\unit43-44-v153-upgrade.spec.js:6:1

# Error details

```
TypeError: Cannot read properties of undefined (reading 'records')
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
        - link "认识茶桌" [ref=e11] [cursor=pointer]:
          - /url: "#l1"
        - link "茶具藏在哪" [ref=e12] [cursor=pointer]:
          - /url: "#l2"
        - link "我会这样说" [ref=e13] [cursor=pointer]:
          - /url: "#l3"
        - link "一起找茶具" [ref=e14] [cursor=pointer]:
          - /url: "#l4"
        - link "茶桌大挑战" [ref=e15] [cursor=pointer]:
          - /url: "#l5"
  - generic [ref=e16]:
    - img "Penny 指向茶壶后面的茶叶，Sam 正在寻找杯子" [ref=e18]
    - generic [ref=e19]:
      - paragraph [ref=e20]: 新概念英语 · Lesson 43–44
      - heading "茶具躲猫猫" [level=1] [ref=e21]
      - paragraph [ref=e22]: 帮 Sam 找到茶叶和杯子，把能做什么说清楚。
      - button "继续冒险" [ref=e23] [cursor=pointer]
  - main [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "认识茶桌" [level=2] [ref=e27]
        - generic "本关 0 / 1 颗星" [ref=e28]: ☆
      - region "茶具小图鉴" [ref=e29]:
        - heading "茶具小图鉴" [level=3] [ref=e32]
        - generic [ref=e33]:
          - button "cup" [ref=e34] [cursor=pointer]:
            - strong [ref=e35]: cup
            - generic [ref=e36]: /kʌp/
          - button "cupboard" [ref=e37] [cursor=pointer]:
            - strong [ref=e38]: cupboard
            - generic [ref=e39]: /ˈkʌbəd/
          - button "see" [ref=e40] [cursor=pointer]:
            - strong [ref=e41]: see
            - generic [ref=e42]: /siː/
          - button "can" [ref=e43] [cursor=pointer]:
            - strong [ref=e44]: can
            - generic [ref=e45]: /kæn/
          - button "some" [ref=e46] [cursor=pointer]:
            - strong [ref=e47]: some
            - generic [ref=e48]: /sʌm/
          - button "any" [ref=e49] [cursor=pointer]:
            - strong [ref=e50]: any
            - generic [ref=e51]: /ˈeni/
        - generic [ref=e52]:
          - button "上一组词卡" [ref=e53] [cursor=pointer]
          - generic [ref=e54]: 3 / 3
          - button "下一站：单词寻宝" [ref=e55] [cursor=pointer]:
            - generic [ref=e56]: 下一站：
            - generic [ref=e57]: 单词寻宝
      - region "单词寻宝" [ref=e58]:
        - heading "单词寻宝" [level=3] [ref=e61]
        - generic [ref=e62]:
          - generic [ref=e63]:
            - paragraph [ref=e64]:
              - generic [ref=e65]: 第 1 / 7 题
              - progressbar "本轮进度" [ref=e66]
            - heading "图中是什么？" [level=3] [ref=e74]
            - img "带拱形提手的烧水壶" [ref=e75]
            - generic [ref=e76]:
              - button "kettle" [ref=e77] [cursor=pointer]
              - button "cup" [ref=e78] [cursor=pointer]
              - button "teapot" [ref=e79] [cursor=pointer]
          - generic [ref=e80]:
            - region "答题反馈" [ref=e81]:
              - status [ref=e82]
            - group "作答操作" [ref=e83]:
              - button "检查答案" [disabled] [ref=e84]
    - generic [ref=e85]:
      - generic [ref=e86]:
        - heading "茶具藏在哪" [level=2] [ref=e87]
        - generic "本关 0 / 1 颗星" [ref=e88]: ☆
      - region "茶桌小剧场" [ref=e89]:
        - heading "茶桌小剧场" [level=3] [ref=e92]
        - generic [ref=e93]:
          - group "Sam、Penny 的茶桌" [ref=e94]:
            - generic [ref=e95]: Sam
            - generic [ref=e97]: Penny
            - img "杯柜" [ref=e99]
            - img "茶壶后面的茶叶" [ref=e100]
            - img "茶壶" [ref=e101]
            - img "水壶" [ref=e102]
            - img "橱柜里的两只杯子" [ref=e103]
          - log "课文对话" [ref=e104]:
            - generic [ref=e106]:
              - generic [ref=e107]: Penny
              - paragraph [ref=e108]:
                - generic [ref=e109]: Can you make the tea, Sam?
              - button "看中文" [ref=e111] [cursor=pointer]
            - generic [ref=e113]:
              - generic [ref=e114]: Sam
              - paragraph [ref=e115]:
                - generic [ref=e116]: Yes, of course I can, Penny.
              - button "看中文" [ref=e118] [cursor=pointer]
            - generic [ref=e120]:
              - generic [ref=e121]: Sam
              - paragraph [ref=e122]:
                - generic [ref=e123]: Is there any water in this kettle?
              - button "看中文" [ref=e125] [cursor=pointer]
            - generic [ref=e127]:
              - generic [ref=e128]: Penny
              - paragraph [ref=e129]:
                - generic [ref=e130]: Yes, there is.
              - button "看中文" [ref=e132] [cursor=pointer]
            - generic [ref=e134]:
              - generic [ref=e135]: Sam
              - paragraph [ref=e136]:
                - generic [ref=e137]: Where’s the tea?
              - button "看中文" [ref=e139] [cursor=pointer]
            - generic [ref=e141]:
              - generic [ref=e142]: Penny
              - paragraph [ref=e143]:
                - generic [ref=e144]: It’s over there, behind the teapot.
              - button "看中文" [ref=e146] [cursor=pointer]
            - generic [ref=e148]:
              - generic [ref=e149]: Penny
              - paragraph [ref=e150]:
                - generic [ref=e151]: Can you see it?
              - button "看中文" [ref=e153] [cursor=pointer]
            - generic [ref=e155]:
              - generic [ref=e156]: Sam
              - paragraph [ref=e157]:
                - generic [ref=e158]: I can see the teapot, but I can’t see the tea.
              - button "看中文" [ref=e160] [cursor=pointer]
        - status "已读 8 / 15 句课文" [ref=e161]: 8 / 15
        - generic [ref=e162]:
          - button "重新上演" [ref=e164] [cursor=pointer]
          - button "下一句" [active] [ref=e165] [cursor=pointer]
      - region "故事小侦探" [ref=e166]:
        - heading "故事小侦探" [level=3] [ref=e169]
        - button "先看故事" [ref=e171] [cursor=pointer]
    - generic [ref=e172]:
      - generic [ref=e173]:
        - heading "我会这样说" [level=2] [ref=e174]
        - generic "本关 0 / 1 颗星" [ref=e175]: ☆
      - region "语法小工坊" [ref=e176]:
        - heading "语法小工坊" [level=3] [ref=e179]
        - generic [ref=e180]:
          - generic [ref=e181]:
            - generic [ref=e182]:
              - paragraph [ref=e183]:
                - generic [ref=e184]: 第 2 / 12 题
                - progressbar "本轮进度" [ref=e185]
              - region "短示范" [ref=e198]:
                - generic [ref=e199]:
                  - paragraph [ref=e200]: Penny can open the door.
                  - generic [ref=e201]: Penny 能开门。
                - generic [ref=e202]:
                  - paragraph [ref=e203]: They can open the door.
                  - generic [ref=e204]: 他们能开门；can 没变。
              - heading "两个人都能找到杯子，补全句子" [level=3] [ref=e205]
            - group "选择回应" [ref=e206]:
              - group "第1处填空" [ref=e207]:
                - paragraph [ref=e208]:
                  - text: I
                  - generic [ref=e209]: cans
                  - text: find the cups.
                - generic [ref=e210]:
                  - button "can" [ref=e211] [cursor=pointer]
                  - button "cans" [pressed] [ref=e212] [cursor=pointer]
              - group "第2处填空" [ref=e213]:
                - paragraph [ref=e214]:
                  - text: He
                  - generic [ref=e215]: ___
                  - text: find the cups.
                - generic [ref=e216]:
                  - button "can" [ref=e217] [cursor=pointer]
                  - button "cans" [ref=e218] [cursor=pointer]
          - generic [ref=e219]:
            - region "答题反馈" [ref=e220]:
              - status [ref=e221]
            - group "作答操作" [ref=e222]:
              - button "给点线索" [ref=e223] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e225]
        - group [ref=e226]:
          - generic "换个物品问一问 ＋" [ref=e227] [cursor=pointer]
        - group [ref=e228]:
          - generic "名词变复数 ＋" [ref=e229] [cursor=pointer]
          - text: → → → → → → → → → →
    - generic [ref=e230]:
      - generic [ref=e231]:
        - heading "一起找茶具" [level=2] [ref=e232]
        - generic "本关 0 / 1 颗星" [ref=e233]: ☆
      - region "茶桌小帮手" [ref=e234]:
        - heading "茶桌小帮手" [level=3] [ref=e237]
        - generic [ref=e238]:
          - generic [ref=e239]:
            - generic [ref=e240]:
              - paragraph [ref=e241]:
                - generic [ref=e242]: 第 1 / 5 题
                - progressbar "本轮进度" [ref=e243]
              - heading "你会沏茶，怎样回答 Penny？" [level=3] [ref=e249]
              - region "题目材料" [ref=e250]:
                - paragraph [ref=e251]: "Penny: Can you make the tea?"
              - group "Sam、Penny 的茶桌" [ref=e252]:
                - generic [ref=e253]: Sam
                - generic [ref=e255]: Penny
                - img "杯柜" [ref=e257]
                - img "茶壶后面的茶叶" [ref=e258]
                - img "茶壶" [ref=e259]
                - img "水壶" [ref=e260]
                - img "橱柜里的两只杯子" [ref=e261]
                - paragraph [ref=e262]: 杯子：柜里 2 只 · 水壶前 0 只
            - group "选择回应" [ref=e263]:
              - button "Yes, I can." [ref=e264] [cursor=pointer]
              - button "Yes, there is." [ref=e265] [cursor=pointer]
              - button "Yes, I am." [ref=e266] [cursor=pointer]
          - generic [ref=e267]:
            - region "答题反馈" [ref=e268]:
              - status [ref=e269]
            - group "作答操作" [ref=e270]:
              - button "给点线索" [ref=e271] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e273]
    - generic [ref=e274]:
      - generic [ref=e275]:
        - heading "茶桌大挑战" [level=2] [ref=e276]
        - generic "本关 0 / 1 颗星" [ref=e277]: ☆
      - region "综合挑战" [ref=e278]:
        - heading "综合挑战" [level=3] [ref=e281]
        - generic [ref=e282]:
          - generic [ref=e283]:
            - paragraph [ref=e284]:
              - generic [ref=e285]: 第 1 / 15 题
              - progressbar "本轮进度" [ref=e286]
            - heading "选出 kettle" [level=3] [ref=e302]
            - generic [ref=e303]:
              - button "水壶" [ref=e304] [cursor=pointer]
              - button "杯子" [ref=e306] [cursor=pointer]
              - button "茶壶" [ref=e308] [cursor=pointer]
          - generic [ref=e310]:
            - region "答题反馈" [ref=e311]:
              - status [ref=e312]
            - group "作答操作" [ref=e313]:
              - button "检查答案" [disabled] [ref=e314]
      - region "我的单元纪念卡" [ref=e315]:
        - heading "我的单元纪念卡" [level=3] [ref=e318]
        - generic [ref=e319]:
          - article "我的单元纪念卡" [ref=e320]:
            - paragraph [ref=e321]: 灿然英语工作室
            - heading "茶桌小帮手" [level=3] [ref=e322]
            - paragraph [ref=e323]: 登录后显示姓名
            - group "已获得 0 / 5 颗星" [ref=e324]
            - img "Penny 指出圆茶壶后面的茶叶，Sam 露出发现的笑容，旁边是水壶和两只杯子"
            - paragraph [ref=e330]:
              - generic [ref=e331]: Lesson 43–44
          - generic [ref=e332]:
            - button "保存动图" [disabled] [ref=e333]
            - link "返回课程" [ref=e334] [cursor=pointer]:
              - /url: http://127.0.0.1:4308/
          - status [ref=e335]
          - group [ref=e336]:
            - generic "星星进度" [ref=e337] [cursor=pointer]
        - group [ref=e338]:
          - generic "课后练习纸 ＋" [ref=e339] [cursor=pointer]
  - text: ·
```

# Test source

```ts
  1  | 'use strict';const{test,expect}=require('@playwright/test');const{legacy}=require('../support/unit4344-v153-legacy'),old=require('../support/unit4344'),fresh=require('../support/unit4344-v153');
  2  | test.use({actionTimeout:7000,...(process.env.UNIT4344_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  3  | for(const selected of [false,true])test(`真实旧${selected?'仅选择':'空白'}升级：不虚构提交并可零错获星`,async({page})=>{
  4  |  const upgrade=await legacy(page);await page.goto('/unit43-44/#learn/listen');const room=page.locator('.stage-listen');if(selected)await fresh.select(room,'kettle');await page.reload();await upgrade();await page.reload();await expect(page.locator('#starCount')).toHaveText('0');await expect(room.locator('.progress-copy')).toHaveText('第 1 / 7 题');if(selected)await expect(room.getByRole('button',{name:'kettle',exact:true})).toHaveAttribute('aria-pressed','true');await fresh.activity(page,'listen');await expect(page.locator('#starCount')).toHaveText('1');
  5  | });
  6  | test('原错答、双空草稿、词卡页与阅读位置保留，服务器只承接可核实历史',async({page})=>{
  7  |  const upgrade=await legacy(page);await page.goto('/unit43-44/#learn/grammar');const room=page.locator('.stage-grammar');await fresh.select(room,'会；能够');await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();await fresh.select(room,{fills:['cans','cans']});await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('group',{name:'第2处填空',exact:true}).getByRole('button',{name:'cans',exact:true}).click();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  8  |  await page.goto('/unit43-44/#learn/words');for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();await page.goto('/unit43-44/#learn/text');await page.getByRole('button',{name:'开始看课文',exact:true}).click();for(let i=0;i<7;i++)await page.getByRole('button',{name:'下一句',exact:true}).click();const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit43-44:learning:v1')));
> 9  |  const p=require('../../server/progress'),path=require('node:path'),unit=p.definition(path.resolve(__dirname,'../..'),'unit43-44'),n=p.normalize(before,unit,'unit43-44');expect(Object.keys(n.activity.unit4344V153Progress.records)).toHaveLength(2);
     |                                                                                                                                                                                                                              ^ TypeError: Cannot read properties of undefined (reading 'records')
  10 |  await upgrade();await page.reload();await expect(page.locator('.btext span')).toHaveCount(8);await page.goto('/unit43-44/#learn/words');await expect(page.locator('#wordPageProgress')).toHaveText('3 / 3');const snapshot=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit43-44:learning:v1')).activity.unit4344V153Snapshot);expect(snapshot.groups).toEqual(before.groups);expect(snapshot.records).toEqual(before.records);expect(snapshot.activity.unitDialogue).toEqual(before.activity.unitDialogue);
  11 |  await page.goto('/unit43-44/#learn/grammar');await expect(room.locator('.progress-copy')).toHaveText('第 2 / 13 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'cans',exact:true})).toHaveAttribute('aria-pressed','true');await page.goto('/unit43-44/#learn/certificate');await page.getByText('改版前的学习记录',{exact:true}).click();await expect(page.locator('.historical-learning')).toContainText('提交1次');
  12 | });
  13 | test('实际44题旧五星保留；未改apply轮不重开；新增与修订题未答',async({page})=>{
  14 |  test.setTimeout(180000);const upgrade=await legacy(page);await require('../support/reward-dialog').handleRewardDialog(page);await old.story(page);for(const id of Object.keys(old.ANSWERS)){await old.activity(page,id);const room=page.locator('.stage-'+id);await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');}await expect(page.locator('#starCount')).toHaveText('5');const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit43-44:learning:v1')));await upgrade();await page.reload();await expect(page.locator('#starCount')).toHaveText('5');for(const[id,index,total]of [['roles',4,5],['grammar',6,13],['exam',16,16]]){await page.goto('/unit43-44/#learn/'+id);const room=page.locator('.stage-'+id);await expect(room.locator('.progress-copy')).toHaveText(`第 ${index} / ${total} 题`);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();}
  15 |  await page.goto('/unit43-44/#learn/apply');await expect(page.locator('.stage-apply .completion-number')).toHaveText(['5','5','0']);const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit43-44:learning:v1')));expect(after.groups['unit4344-apply-practice/v1']).toEqual(before.groups['unit4344-apply-practice/v1']);expect(after.activity.unit4344V153Snapshot.records).toEqual(before.records);
  16 | });
  17 | 
```