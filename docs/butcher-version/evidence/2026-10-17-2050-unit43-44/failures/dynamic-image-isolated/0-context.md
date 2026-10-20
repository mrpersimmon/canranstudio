# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit43-44-v153.spec.js >> 语法反复错答、部分填空、撤回、提示与刷新；订正不发星，重练可获星
- Location: tests\e2e\unit43-44-v153.spec.js:48:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=f4e1]:
  - banner [ref=f4e2]:
    - generic [ref=f4e3]:
      - link "我的课程" [ref=f4e4] [cursor=pointer]:
        - /url: /
      - generic [ref=f4e5]:
        - generic [ref=f4e6]:
          - img "星星" [ref=f4e7]
          - text: 0/5
        - button "学习手记" [ref=f4e8] [cursor=pointer]
    - navigation "学习关卡" [ref=f4e9]:
      - generic [ref=f4e10]:
        - link "认识茶桌" [ref=f4e11] [cursor=pointer]:
          - /url: "#l1"
        - link "茶具藏在哪" [ref=f4e12] [cursor=pointer]:
          - /url: "#l2"
        - link "我会这样说" [ref=f4e13] [cursor=pointer]:
          - /url: "#l3"
        - link "一起找茶具" [ref=f4e14] [cursor=pointer]:
          - /url: "#l4"
        - link "茶桌大挑战" [ref=f4e15] [cursor=pointer]:
          - /url: "#l5"
  - generic [ref=f4e16]:
    - img "Penny 指向茶壶后面的茶叶，Sam 正在寻找杯子" [ref=f4e18]
    - generic [ref=f4e19]:
      - paragraph [ref=f4e20]: 新概念英语 · Lesson 43–44
      - heading "茶具躲猫猫" [level=1] [ref=f4e21]
      - paragraph [ref=f4e22]: 帮 Sam 找到茶叶和杯子，把能做什么说清楚。
      - button "继续冒险" [ref=f4e23] [cursor=pointer]
  - main [ref=f4e24]:
    - generic [ref=f4e25]:
      - generic [ref=f4e26]:
        - heading "认识茶桌" [level=2] [ref=f4e27]
        - generic "本关 0 / 1 颗星" [ref=f4e28]: ☆
      - region "茶具小图鉴" [ref=f4e29]:
        - heading "茶具小图鉴" [level=3] [ref=f4e32]
        - generic [ref=f4e33]:
          - button "kettle" [ref=f4e34] [cursor=pointer]:
            - strong [ref=f4e35]: kettle
            - generic [ref=f4e36]: /ˈketl/
          - button "teapot" [ref=f4e37] [cursor=pointer]:
            - strong [ref=f4e38]: teapot
            - generic [ref=f4e39]: /ˈtiːpɒt/
          - button "behind" [ref=f4e40] [cursor=pointer]:
            - strong [ref=f4e41]: behind
            - generic [ref=f4e42]: /bɪˈhaɪnd/
          - button "of course" [ref=f4e43] [cursor=pointer]:
            - strong [ref=f4e44]: of course
            - generic [ref=f4e45]: /əv ˈkɔːs/
          - button "now" [ref=f4e46] [cursor=pointer]:
            - strong [ref=f4e47]: now
            - generic [ref=f4e48]: /naʊ/
          - button "find" [ref=f4e49] [cursor=pointer]:
            - strong [ref=f4e50]: find
            - generic [ref=f4e51]: /faɪnd/
        - generic [ref=f4e52]:
          - button "上一组词卡" [disabled] [ref=f4e53]
          - generic [ref=f4e54]: 1 / 3
          - button "下一组词卡" [ref=f4e55] [cursor=pointer]
      - region "单词寻宝" [ref=f4e56]:
        - heading "单词寻宝" [level=3] [ref=f4e59]
        - generic [ref=f4e60]:
          - generic [ref=f4e61]:
            - paragraph [ref=f4e62]:
              - generic [ref=f4e63]: 第 1 / 7 题
              - progressbar "本轮进度" [ref=f4e64]
            - heading "图中是什么？" [level=3] [ref=f4e72]
            - img "带拱形提手的烧水壶" [ref=f4e73]
            - generic [ref=f4e74]:
              - button "kettle" [ref=f4e75] [cursor=pointer]
              - button "teapot" [ref=f4e76] [cursor=pointer]
              - button "cup" [ref=f4e77] [cursor=pointer]
          - generic [ref=f4e78]:
            - region "答题反馈" [ref=f4e79]:
              - status [ref=f4e80]
            - group "作答操作" [ref=f4e81]:
              - button "检查答案" [disabled] [ref=f4e82]
    - generic [ref=f4e83]:
      - generic [ref=f4e84]:
        - heading "茶具藏在哪" [level=2] [ref=f4e85]
        - generic "本关 0 / 1 颗星" [ref=f4e86]: ☆
      - region "茶桌小剧场" [ref=f4e87]:
        - heading "茶桌小剧场" [level=3] [ref=f4e90]
        - generic [ref=f4e91]:
          - group "Sam、Penny 的茶桌" [ref=f4e92]:
            - generic [ref=f4e93]:
              - generic [ref=f4e94]: Sam
              - generic [ref=f4e96]: Penny
              - generic [ref=f4e98]:
                - img "茶壶后面的茶叶" [ref=f4e99]
                - img "茶壶" [ref=f4e100]
                - img "水壶" [ref=f4e101]
              - generic [ref=f4e102]:
                - img "杯柜" [ref=f4e103]
                - img "橱柜里的两只杯子" [ref=f4e104]
          - generic [ref=f4e105]:
            - log "课文对话" [ref=f4e106]:
              - paragraph [ref=f4e108]: How do you know Sam doesn’t make the tea very often?
            - status "尚未开始阅读" [ref=f4e109]
            - button "开始看课文" [ref=f4e111] [cursor=pointer]
      - region "故事小侦探" [ref=f4e112]:
        - heading "故事小侦探" [level=3] [ref=f4e115]
        - button "先看课文" [ref=f4e117] [cursor=pointer]
    - generic [ref=f4e118]:
      - generic [ref=f4e119]:
        - heading "我会这样说" [level=2] [ref=f4e120]
        - generic "本关 0 / 1 颗星" [ref=f4e121]: ☆
      - region "语法小工坊" [ref=f4e122]:
        - heading "语法小工坊" [level=3] [ref=f4e125]
        - generic [ref=f4e126]:
          - generic [ref=f4e127]:
            - generic [ref=f4e128]:
              - paragraph [active] [ref=f4e129]:
                - generic [ref=f4e130]: 第 7 / 13 题
                - progressbar "本轮进度" [ref=f4e131]
              - region "短示范" [ref=f4e145]:
                - generic [ref=f4e146]:
                  - paragraph [ref=f4e147]: I can see some spoons.
                  - generic [ref=f4e148]: 我能看见一些勺子。
                - generic [ref=f4e149]:
                  - paragraph [ref=f4e150]: I can’t see any bread.
                  - generic [ref=f4e151]: 我看不见面包。
              - heading "看得见一些杯子，看不见玻璃杯" [level=3] [ref=f4e152]
            - group "选择回应" [ref=f4e153]:
              - group "第1处填空" [ref=f4e154]:
                - paragraph [ref=f4e155]:
                  - text: I can see
                  - generic [ref=f4e156]: ___
                  - text: cups.
                - generic [ref=f4e157]:
                  - button "some" [ref=f4e158] [cursor=pointer]
                  - button "any" [ref=f4e159] [cursor=pointer]
              - group "第2处填空" [ref=f4e160]:
                - paragraph [ref=f4e161]:
                  - text: I can’t see
                  - generic [ref=f4e162]: ___
                  - text: glasses.
                - generic [ref=f4e163]:
                  - button "some" [ref=f4e164] [cursor=pointer]
                  - button "any" [ref=f4e165] [cursor=pointer]
          - generic [ref=f4e166]:
            - region "答题反馈" [ref=f4e167]:
              - status [ref=f4e168]
            - group "作答操作" [ref=f4e169]:
              - button "给点线索" [ref=f4e170] [cursor=pointer]
              - button "检查答案" [disabled] [ref=f4e172]
        - group [ref=f4e173]:
          - generic "语法小参考 ＋" [ref=f4e174] [cursor=pointer]
        - group [ref=f4e175]:
          - generic "换个物品问一问 ＋" [ref=f4e176] [cursor=pointer]
        - group [ref=f4e177]:
          - generic "名词变复数 ＋" [ref=f4e178] [cursor=pointer]
          - text: → → → → → → → → → →
        - group [ref=f4e179]:
          - generic "跟老师编对话 ＋" [ref=f4e180] [cursor=pointer]
    - generic [ref=f4e181]:
      - generic [ref=f4e182]:
        - heading "一起找茶具" [level=2] [ref=f4e183]
        - generic "本关 0 / 1 颗星" [ref=f4e184]: ☆
      - region "茶桌小帮手" [ref=f4e185]:
        - heading "茶桌小帮手" [level=3] [ref=f4e188]
        - generic [ref=f4e189]:
          - generic [ref=f4e190]:
            - generic [ref=f4e191]:
              - paragraph [ref=f4e192]:
                - generic [ref=f4e193]: 第 1 / 5 题
                - progressbar "本轮进度" [ref=f4e194]
              - heading "你会沏茶，怎样回答 Penny？" [level=3] [ref=f4e200]
              - region "题目材料" [ref=f4e201]:
                - paragraph [ref=f4e202]: "Penny: Can you make the tea?"
              - group "Sam、Penny 的茶桌" [ref=f4e203]:
                - generic [ref=f4e204]:
                  - generic [ref=f4e205]: Sam
                  - generic [ref=f4e207]: Penny
                  - generic [ref=f4e209]:
                    - img "茶壶后面的茶叶" [ref=f4e210]
                    - img "茶壶" [ref=f4e211]
                    - img "水壶" [ref=f4e212]
                  - generic [ref=f4e213]:
                    - img "杯柜" [ref=f4e214]
                    - img "橱柜里的两只杯子" [ref=f4e215]
                - paragraph [ref=f4e216]: 杯子：柜里 2 只 · 水壶前 0 只
            - group "选择回应" [ref=f4e217]:
              - button "Yes, I am." [ref=f4e218] [cursor=pointer]
              - button "Yes, I can." [ref=f4e219] [cursor=pointer]
              - button "Yes, there is." [ref=f4e220] [cursor=pointer]
          - generic [ref=f4e221]:
            - region "答题反馈" [ref=f4e222]:
              - status [ref=f4e223]
            - group "作答操作" [ref=f4e224]:
              - button "给点线索" [ref=f4e225] [cursor=pointer]
              - button "检查答案" [disabled] [ref=f4e227]
    - generic [ref=f4e228]:
      - generic [ref=f4e229]:
        - heading "茶桌大挑战" [level=2] [ref=f4e230]
        - generic "本关 0 / 1 颗星" [ref=f4e231]: ☆
      - region "综合挑战" [ref=f4e232]:
        - heading "综合挑战" [level=3] [ref=f4e235]
        - generic [ref=f4e236]:
          - generic [ref=f4e237]:
            - paragraph [ref=f4e238]:
              - generic [ref=f4e239]: 第 1 / 16 题
              - progressbar "本轮进度" [ref=f4e240]
            - heading "选出 kettle" [level=3] [ref=f4e257]
            - generic [ref=f4e258]:
              - button "茶壶" [ref=f4e259] [cursor=pointer]
              - button "水壶" [ref=f4e261] [cursor=pointer]
              - button "杯子" [ref=f4e263] [cursor=pointer]
          - generic [ref=f4e265]:
            - region "答题反馈" [ref=f4e266]:
              - status [ref=f4e267]
            - group "作答操作" [ref=f4e268]:
              - button "检查答案" [disabled] [ref=f4e269]
      - region "我的单元纪念卡" [ref=f4e270]:
        - heading "我的单元纪念卡" [level=3] [ref=f4e273]
        - generic [ref=f4e274]:
          - article "我的单元纪念卡" [ref=f4e275]:
            - paragraph [ref=f4e276]: 灿然英语工作室
            - heading "茶桌小帮手" [level=3] [ref=f4e277]
            - paragraph [ref=f4e278]: 登录后显示姓名
            - group "已获得 0 / 5 颗星" [ref=f4e279]
            - img "Penny 指出圆茶壶后面的茶叶，Sam 露出发现的笑容，旁边是水壶和两只杯子"
            - paragraph [ref=f4e285]:
              - generic [ref=f4e286]: Lesson 43–44
          - generic [ref=f4e287]:
            - button "保存动图" [disabled] [ref=f4e288]
            - link "返回课程" [ref=f4e289] [cursor=pointer]:
              - /url: http://127.0.0.1:4308/
          - status [ref=f4e290]
          - group [ref=f4e291]:
            - generic "星星进度" [ref=f4e292] [cursor=pointer]
        - group [ref=f4e293]:
          - generic "课后练习纸 ＋" [ref=f4e294] [cursor=pointer]
  - text: ·
```

# Test source

```ts
  1   | 'use strict';
  2   | const {test,expect}=require('@playwright/test');
  3   | const {activity,story,ANSWERS}=require('../support/unit4344-v153');
  4   | const {select}=require('../support/units1-30-tasks');
  5   | test.use({actionTimeout:7000,...(process.env.UNIT4344_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  6   | test('46题完整流程、三卡五区五星及无配音',async({page},info)=>{
  7   |  test.setTimeout(120000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
  8   |  await story(page);await expect(page.locator('.bubble-row')).toHaveCount(15);await expect(page.locator('#starCount')).toHaveText('0');
  9   |  let count=0;
  10  |  for(const id of Object.keys(ANSWERS)){
  11  |   const room=await activity(page,id,{inspect:async(surface,i,phase)=>{if(phase==='before')await surface.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  12  |   await expect(page.locator('#starCount')).toHaveText(String(++count));
  13  |   await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  14  |   for(const [i,name] of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  15  |   await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
  16  |  }
  17  |  await page.goto('/unit43-44/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');
  18  |  await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
  19  |  expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  20  |  expect(errors).toEqual([]);expect(voices).toEqual([]);
  21  | });
  22  | 
  23  | test('18张词卡、音标、翻义与末组推进；不依赖配音',async({page})=>{
  24  |  await page.goto('/unit43-44/#learn/words');const room=page.locator('.stage-words');
  25  |  const first=room.getByRole('button',{name:'kettle',exact:true});await expect(first).toContainText('/ˈketl/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('水壶');
  26  |  await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
  27  |  for(let i=0;i<3;i++){
  28  |   await expect(room.locator('.unit-word')).toHaveCount(6);await expect(room.locator('.word-phonetic')).toHaveCount(6);
  29  |   expect(await room.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  30  |   if(i<2)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
  31  |  }
  32  |  await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('3 / 3');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);await expect(page.locator('#starCount')).toHaveText('0');
  33  | });
  34  | 
  35  | test('15句课文完整历史：找到茶叶与杯子、最后水开；原文没有移动杯子',async({page})=>{
  36  |  await page.goto('/unit43-44/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.tea-world');
  37  |  await room.getByRole('button',{name:'开始看课文',exact:true}).click();await expect(room.getByRole('log')).toContainText('Can you make the tea, Sam?');
  38  |  for(let i=0;i<15;i++){
  39  |   await expect(room.locator('.bubble-row')).toHaveCount(i+1);await expect(world).toHaveAttribute('data-cups','cupboard');await expect(world).toHaveAttribute('data-boiling',String(i===14));
  40  |   if(i===7){await room.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();await expect(room.locator('.bubble-row').last()).toContainText('茶壶我看见了');await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(8);}
  41  |   if(i===9)await expect(world).toHaveAttribute('data-found','true');
  42  |   if(i<14)await room.getByRole('button',{name:'下一句',exact:true}).click();
  43  |  }
  44  |  await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('0');await expect(room.locator('.completion-stats')).toHaveCount(0);
  45  |  for(const width of [390,1280]){await page.setViewportSize({width,height:844});await page.reload();const box=await room.getByRole('log').boundingBox();await expect.poll(async()=>{const last=await room.locator('.bubble-row').last().locator('.btext').boundingBox();return last.y>=box.y&&last.y+last.height<=box.y+box.height;}).toBe(true);}
  46  | });
  47  | 
  48  | test('语法反复错答、部分填空、撤回、提示与刷新；订正不发星，重练可获星',async({page})=>{
  49  |  test.setTimeout(70000);await page.goto('/unit43-44/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
  50  |  await expect(room.getByRole('region',{name:'短示范'})).toContainText('I can read this book.');
  51  |  for(let i=0;i<2;i++){await select(room,'必须');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  52  |  for(const [i,answer]of ANSWERS.grammar.entries()){
  53  |   if(i===1){await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'can',exact:true}).click();await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'can',exact:true}).click();}
  54  |   if(i===4){await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'Can',exact:true}).press('Enter');await page.reload();await expect(room.getByRole('group',{name:'已选词块'})).toContainText('Can');await room.getByRole('button',{name:'撤回 Can',exact:true}).click();await expect(check).toBeDisabled();}
  55  |   if(i===8){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  56  |   if(i===11)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
> 57  |   expect(await room.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
      |                                                                                                    ^ Error: expect(received).toBe(expected) // Object.is equality
  58  |   await select(room,answer);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===12?'完成这一站':'下一题',exact:true}).click();
  59  |  }
  60  |  await expect(room.locator('.completion-number')).toHaveText(['13','13','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['13','13','2']);
  61  |  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
  62  | });
  63  | 
  64  | test('场景第三题错两次：3／5／2；杯子仅检查正确后移动，刷新物品守恒',async({page})=>{
  65  |  await page.goto('/unit43-44/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.tea-world');
  66  |  for(let i=0;i<5;i++){
  67  |   if(i===2){for(let n=0;n<2;n++){await select(room,'Yes, I can.');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(world).toHaveAttribute('data-cups','cupboard');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}}
  68  |   if(i===3){const material=await room.getByRole('region',{name:'题目材料',exact:true}).boundingBox(),stage=await world.boundingBox();expect(material.y+material.height).toBeLessThanOrEqual(stage.y);await expect(room).toContainText('Put the cups in front of the kettle.');}
  69  |   await select(room,ANSWERS.apply[i]);if(i===3){await expect(world).toHaveAttribute('data-cups','cupboard');await page.reload();await expect(world).toHaveAttribute('data-cupboard-count','2');}
  70  |   await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
  71  |   if(i>=3){await expect(world).toHaveAttribute('data-cupboard-count','0');await expect(world).toHaveAttribute('data-counter-count','2');await expect(world.locator('.tea-cups')).toHaveCount(1);await page.reload();await expect(world).toHaveAttribute('data-cups','counter');}
  72  |   if(i===4)await expect(room.locator('.practice-finish')).toHaveCount(0);
  73  |   await room.getByRole('button',{name:i===4?'完成这一站':'下一题',exact:true}).click();
  74  |  }
  75  |  await expect(room.locator('.completion-number')).toHaveText(['3','5','2']);await expect(page.locator('#starCount')).toHaveText('0');
  76  | });
  77  | 
  78  | test('配对部分不能检查；已配可撤销；刷新不代答',async({page})=>{
  79  |  await page.goto('/unit43-44/#learn/listen');const room=page.locator('.stage-listen');
  80  |  for(const answer of ANSWERS.listen.slice(0,3)){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
  81  |  await select(room,{pairs:[['find','找到']]});await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  82  |  await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  83  |  await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'find',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'找到',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 3 对');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  84  |  await select(room,ANSWERS.listen[3]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
  85  | });
  86  | 
  87  | test('Lesson44全部12组替换、10个复数和7+10书写题有入口',async({page})=>{
  88  |  await page.goto('/unit43-44/#learn/grammar');await page.getByText('换个物品问一问',{exact:true}).click();await expect(page.locator('.reference-card')).toHaveCount(12);await expect(page.locator('.reference-card').first()).toContainText('70 · seventy');await expect(page.locator('.reference-card').last()).toContainText('900 · nine hundred');
  89  |  await page.getByText('名词变复数',{exact:true}).click();await expect(page.locator('.plural-reference dt')).toHaveCount(10);await expect(page.locator('.plural-reference')).toContainText('wives');
  90  |  await page.goto('/unit43-44/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(7);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(10);await expect(page.locator('#starCount')).toHaveText('0');
  91  | });
  92  | 
  93  | for(const width of [320,390,768,1280])test(`${width}宽及短屏：场景、题型、三卡和两按钮`,async({page},info)=>{
  94  |  test.setTimeout(90000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});await story(page);await page.locator('.stage-text').screenshot({path:info.outputPath('story.png')});
  95  |  for(const id of ['grammar','apply','exam']){
  96  |   const room=await activity(page,id,{inspect:async(surface,i,phase)=>{
  97  |    if(phase==='before'){
  98  |     expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  99  |     expect(await surface.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  100 |     for(const button of await surface.locator('button:visible').all()){const box=await button.boundingBox();expect(box.height).toBeGreaterThanOrEqual(43);}
  101 |     if((id==='grammar'&&[0,1,4,7,11].includes(i))||(id==='apply'&&[1,3,4].includes(i))||(id==='exam'&&[9,14].includes(i)))await surface.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});
  102 |    }
  103 |   }});
  104 |   await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  105 |   const boxes=await room.locator('.completion-stat').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().y));expect(Math.max(...boxes)-Math.min(...boxes)).toBeLessThan(2);
  106 |   await room.screenshot({path:info.outputPath(id+'-completion.png')});
  107 |   for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all()){await btn.scrollIntoViewIfNeeded();const box=await btn.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44);expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(page.viewportSize().height);}
  108 |   const visibleTogether=await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(el=>{const b=el.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}));expect(visibleTogether).toBe(true);
  109 |  }
  110 | });
  111 | 
```