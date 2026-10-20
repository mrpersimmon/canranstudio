# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit45-46-v153.spec.js >> 所有声音失败仍能完成故事和五个答题区
- Location: tests\e2e\unit45-46-v153.spec.js:96:1

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "我的课程" [ref=e4]:
        - /url: /
      - generic [ref=e5]:
        - generic [ref=e6]:
          - img "星星" [ref=e7]
          - text: 5/5
        - button "学习手记" [ref=e8] [cursor=pointer]
    - navigation "学习关卡" [ref=e9]:
      - generic [ref=e10]:
        - link "走进办公室" [ref=e11]:
          - /url: "#l1"
        - link "老板的信" [ref=e12]:
          - /url: "#l2"
        - link "问出想知道的" [ref=e13]:
          - /url: "#l3"
        - link "帮忙传个话" [ref=e14]:
          - /url: "#l4"
        - link "沟通大挑战" [ref=e15]:
          - /url: "#l5"
  - generic [ref=e16]:
    - img "Bob 和 Pamela 一起辨认信上的字迹，旁边放着打字机" [ref=e18]
    - generic [ref=e19]:
      - paragraph [ref=e20]: 新概念英语 · Lesson 45–46
      - heading "一封难读的信" [level=1] [ref=e21]
      - paragraph [ref=e22]: 跟 Bob 送一封信，把问题问清楚，把困难说出来。
      - button "继续冒险" [ref=e23] [cursor=pointer]
  - main [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "走进办公室" [level=2] [ref=e27]
        - generic "本关 1 / 1 颗星" [ref=e28]: ★
      - region "办公室小图鉴" [ref=e29]:
        - heading "办公室小图鉴" [level=3] [ref=e32]
        - generic [ref=e33]:
          - button "can" [ref=e34] [cursor=pointer]:
            - strong [ref=e35]: can
            - generic [ref=e36]: /kæn/
          - button "boss" [ref=e37] [cursor=pointer]:
            - strong [ref=e38]: boss
            - generic [ref=e39]: /bɒs/
          - button "minute" [ref=e40] [cursor=pointer]:
            - strong [ref=e41]: minute
            - generic [ref=e42]: /ˈmɪnɪt/
          - button "ask" [ref=e43] [cursor=pointer]:
            - strong [ref=e44]: ask
            - generic [ref=e45]: /ɑːsk/
          - button "handwriting" [ref=e46] [cursor=pointer]:
            - strong [ref=e47]: handwriting
            - generic [ref=e48]: /ˈhændraɪtɪŋ/
          - button "terrible" [ref=e49] [cursor=pointer]:
            - strong [ref=e50]: terrible
            - generic [ref=e51]: /ˈterəbl/
        - generic [ref=e52]:
          - button "上一组词卡" [disabled] [ref=e53]
          - generic [ref=e54]: 1 / 4
          - button "下一组词卡" [ref=e55] [cursor=pointer]
      - region "单词寻宝" [ref=e56]:
        - heading "单词寻宝" [level=3] [ref=e59]
        - generic [ref=e61]:
          - heading "单词寻宝完成！" [level=4] [ref=e63]
          - list "本轮成果" [ref=e64]:
            - listitem "本轮最高连续答对 7 次" [ref=e65]:
              - generic [ref=e66]: 连续答对
              - generic [ref=e67]:
                - strong [ref=e69]: "7"
                - generic [ref=e70]: 次
            - listitem "本轮实际提交答对，包含订正 7 次" [ref=e71]:
              - generic [ref=e72]: 本次答对
              - generic [ref=e73]:
                - strong [ref=e75]: "7"
                - generic [ref=e76]: 次
            - listitem "本轮实际提交答错，重复错答分别计数 0 次" [ref=e77]:
              - generic [ref=e78]: 本次答错
              - generic [ref=e79]:
                - strong [ref=e81]: "0"
                - generic [ref=e82]: 次
          - paragraph [ref=e83]: 这颗星已经点亮。
          - group "完成后的操作" [ref=e84]:
            - button "再练一轮" [ref=e85] [cursor=pointer]
            - button "下一站：办公室小剧场" [ref=e87] [cursor=pointer]:
              - generic [ref=e88]: 下一站
              - generic [ref=e89]: 办公室小剧场
    - generic [ref=e90]:
      - generic [ref=e91]:
        - heading "老板的信" [level=2] [ref=e92]
        - generic "本关 1 / 1 颗星" [ref=e93]: ★
      - region "办公室小剧场" [ref=e94]:
        - heading "办公室小剧场" [level=3] [ref=e97]
        - generic [ref=e98]:
          - group "一封信在办公室里的旅程" [ref=e99]:
            - generic [ref=e100]:
              - generic [ref=e101]: Bob
              - generic [ref=e104]:
                - img "Pamela接到的同一封信" [ref=e106]
                - generic [ref=e107]: Pamela
              - generic [ref=e108]:
                - img "空文件盘" [ref=e109]
                - img "打字机" [ref=e110]
            - paragraph [ref=e111]: 隔壁 · Pamela 的办公室
          - generic [ref=e112]:
            - log "课文对话" [ref=e113]:
              - generic [ref=e115]:
                - generic [ref=e116]: The boss
                - paragraph [ref=e117]:
                  - generic [ref=e118]: Can you come here a minute please, Bob?
                - button "看中文" [ref=e120] [cursor=pointer]
              - generic [ref=e122]:
                - generic [ref=e123]: Bob
                - paragraph [ref=e124]:
                  - generic [ref=e125]: Yes, sir?
                - button "看中文" [ref=e127] [cursor=pointer]
              - generic [ref=e129]:
                - generic [ref=e130]: The boss
                - paragraph [ref=e131]:
                  - generic [ref=e132]: Where’s Pamela?
                - button "看中文" [ref=e134] [cursor=pointer]
              - generic [ref=e136]:
                - generic [ref=e137]: Bob
                - paragraph [ref=e138]:
                  - generic [ref=e139]: She’s next door. She’s in her office, sir.
                - button "看中文" [ref=e141] [cursor=pointer]
              - generic [ref=e143]:
                - generic [ref=e144]: The boss
                - paragraph [ref=e145]:
                  - generic [ref=e146]: Can she type this letter for me? Ask her please.
                - button "看中文" [ref=e148] [cursor=pointer]
              - generic [ref=e150]:
                - generic [ref=e151]: Bob
                - paragraph [ref=e152]:
                  - generic [ref=e153]: Yes, sir.
                - button "看中文" [ref=e155] [cursor=pointer]
              - generic [ref=e157]:
                - generic [ref=e158]: Bob
                - paragraph [ref=e159]:
                  - generic [ref=e160]: Can you type this letter for the boss please, Pamela?
                - button "看中文" [ref=e162] [cursor=pointer]
              - generic [ref=e164]:
                - generic [ref=e165]: Pamela
                - paragraph [ref=e166]:
                  - generic [ref=e167]: Yes, of course I can.
                - button "看中文" [ref=e169] [cursor=pointer]
              - generic [ref=e171]:
                - generic [ref=e172]: Bob
                - paragraph [ref=e173]:
                  - generic [ref=e174]: Here you are.
                - button "看中文" [ref=e176] [cursor=pointer]
              - generic [ref=e178]:
                - generic [ref=e179]: Pamela
                - paragraph [ref=e180]:
                  - generic [ref=e181]: Thank you, Bob.
                - button "看中文" [ref=e183] [cursor=pointer]
              - generic [ref=e185]:
                - generic [ref=e186]: Pamela
                - paragraph [ref=e187]:
                  - generic [ref=e188]: Bob!
                - button "看中文" [ref=e190] [cursor=pointer]
              - generic [ref=e192]:
                - generic [ref=e193]: Bob
                - paragraph [ref=e194]:
                  - generic [ref=e195]: Yes? What’s the matter?
                - button "看中文" [ref=e197] [cursor=pointer]
              - generic [ref=e199]:
                - generic [ref=e200]: Pamela
                - paragraph [ref=e201]:
                  - generic [ref=e202]: I can’t type this letter.
                - button "看中文" [ref=e204] [cursor=pointer]
              - generic [ref=e206]:
                - generic [ref=e207]: Pamela
                - paragraph [ref=e208]:
                  - generic [ref=e209]: I can’t read it! The boss’s handwriting is terrible!
                - button "看中文" [ref=e211] [cursor=pointer]
            - status "已读 14 / 14 句课文" [ref=e212]: 14 / 14
        - generic [ref=e213]:
          - paragraph [ref=e214]: 课文看完了！
          - group "完成后的操作" [ref=e215]:
            - button "再看一遍" [ref=e216] [cursor=pointer]
            - button "下一站：故事小侦探" [ref=e218] [cursor=pointer]
      - region "故事小侦探" [ref=e219]:
        - heading "故事小侦探" [level=3] [ref=e222]
        - generic [ref=e224]:
          - heading "故事读懂啦！" [level=4] [ref=e226]
          - list "本轮成果" [ref=e227]:
            - listitem "本轮最高连续答对 5 次" [ref=e228]:
              - generic [ref=e229]: 连续答对
              - generic [ref=e230]:
                - strong [ref=e232]: "5"
                - generic [ref=e233]: 次
            - listitem "本轮实际提交答对，包含订正 5 次" [ref=e234]:
              - generic [ref=e235]: 本次答对
              - generic [ref=e236]:
                - strong [ref=e238]: "5"
                - generic [ref=e239]: 次
            - listitem "本轮实际提交答错，重复错答分别计数 0 次" [ref=e240]:
              - generic [ref=e241]: 本次答错
              - generic [ref=e242]:
                - strong [ref=e244]: "0"
                - generic [ref=e245]: 次
          - paragraph [ref=e246]: 这颗星已经点亮。
          - group "完成后的操作" [ref=e247]:
            - button "再练一轮" [ref=e248] [cursor=pointer]
            - button "下一站：语法小工坊" [ref=e250] [cursor=pointer]:
              - generic [ref=e251]: 下一站
              - generic [ref=e252]: 语法小工坊
    - generic [ref=e253]:
      - generic [ref=e254]:
        - heading "问出想知道的" [level=2] [ref=e255]
        - generic "本关 1 / 1 颗星" [ref=e256]: ★
      - region "语法小工坊" [ref=e257]:
        - heading "语法小工坊" [level=3] [ref=e260]
        - generic [ref=e262]:
          - heading "会提问啦！" [level=4] [ref=e264]
          - list "本轮成果" [ref=e265]:
            - listitem "本轮最高连续答对 16 次" [ref=e266]:
              - generic [ref=e267]: 连续答对
              - generic [ref=e268]:
                - strong [ref=e270]: "16"
                - generic [ref=e271]: 次
            - listitem "本轮实际提交答对，包含订正 16 次" [ref=e272]:
              - generic [ref=e273]: 本次答对
              - generic [ref=e274]:
                - strong [ref=e276]: "16"
                - generic [ref=e277]: 次
            - listitem "本轮实际提交答错，重复错答分别计数 0 次" [ref=e278]:
              - generic [ref=e279]: 本次答错
              - generic [ref=e280]:
                - strong [ref=e282]: "0"
                - generic [ref=e283]: 次
          - paragraph [ref=e284]: 这颗星已经点亮。
          - group "完成后的操作" [ref=e285]:
            - button "再练一轮" [ref=e286] [cursor=pointer]
            - button "下一站：办公室小帮手" [ref=e288] [cursor=pointer]:
              - generic [ref=e289]: 下一站
              - generic [ref=e290]: 办公室小帮手
        - group [ref=e291]:
          - generic "语法小参考 ＋" [ref=e292] [cursor=pointer]
        - group [ref=e293]:
          - generic "本领对比与数字 ＋" [ref=e294] [cursor=pointer]
    - generic [ref=e295]:
      - generic [ref=e296]:
        - heading "帮忙传个话" [level=2] [ref=e297]
        - generic "本关 1 / 1 颗星" [ref=e298]: ★
      - region "办公室小帮手" [ref=e299]:
        - heading "办公室小帮手" [level=3] [ref=e302]
        - generic [ref=e304]:
          - heading "传话完成啦！" [level=4] [ref=e306]
          - list "本轮成果" [ref=e307]:
            - listitem "本轮最高连续答对 5 次" [ref=e308]:
              - generic [ref=e309]: 连续答对
              - generic [ref=e310]:
                - strong [ref=e312]: "5"
                - generic [ref=e313]: 次
            - listitem "本轮实际提交答对，包含订正 5 次" [ref=e314]:
              - generic [ref=e315]: 本次答对
              - generic [ref=e316]:
                - strong [ref=e318]: "5"
                - generic [ref=e319]: 次
            - listitem "本轮实际提交答错，重复错答分别计数 0 次" [ref=e320]:
              - generic [ref=e321]: 本次答错
              - generic [ref=e322]:
                - strong [ref=e324]: "0"
                - generic [ref=e325]: 次
          - paragraph [ref=e326]: 这颗星已经点亮。
          - group "完成后的操作" [ref=e327]:
            - button "再练一轮" [ref=e328] [cursor=pointer]
            - button "下一站：综合挑战" [ref=e330] [cursor=pointer]:
              - generic [ref=e331]: 下一站
              - generic [ref=e332]: 综合挑战
    - generic [ref=e333]:
      - generic [ref=e334]:
        - heading "沟通大挑战" [level=2] [ref=e335]
        - generic "本关 1 / 1 颗星" [ref=e336]: ★
      - region "综合挑战" [ref=e337]:
        - heading "综合挑战" [level=3] [ref=e340]
        - generic [ref=e342]:
          - heading "综合挑战完成！" [level=4] [ref=e344]
          - list "本轮成果" [ref=e345]:
            - listitem "本轮最高连续答对 21 次" [ref=e346]:
              - generic [ref=e347]: 连续答对
              - generic [ref=e348]:
                - strong [ref=e350]: "21"
                - generic [ref=e351]: 次
            - listitem "本轮实际提交答对，包含订正 21 次" [ref=e352]:
              - generic [ref=e353]: 本次答对
              - generic [ref=e354]:
                - strong [ref=e356]: "21"
                - generic [ref=e357]: 次
            - listitem "本轮实际提交答错，重复错答分别计数 0 次" [ref=e358]:
              - generic [ref=e359]: 本次答错
              - generic [ref=e360]:
                - strong [ref=e362]: "0"
                - generic [ref=e363]: 次
          - paragraph [ref=e364]: 这颗星已经点亮。
          - group "完成后的操作" [ref=e365]:
            - button "再练一轮" [active] [ref=e366] [cursor=pointer]
            - button "下一站：我的单元纪念卡" [ref=e368] [cursor=pointer]:
              - generic [ref=e369]: 下一站
              - generic [ref=e370]: 我的单元纪念卡
      - region "我的单元纪念卡" [ref=e371]:
        - heading "我的单元纪念卡" [level=3] [ref=e374]
        - generic [ref=e375]:
          - article "我的单元纪念卡" [ref=e376]:
            - paragraph [ref=e377]: 灿然英语工作室
            - heading "沟通小能手" [level=3] [ref=e378]
            - paragraph [ref=e379]: 登录后显示姓名
            - group "已获得 5 / 5 颗星" [ref=e380]
            - img "Pamela举着字迹潦草的信，Bob靠近一起辨认，旁边放着紫色打字机"
            - paragraph [ref=e386]:
              - generic [ref=e387]: Lesson 45–46
              - time [ref=e388]: ·2026.10.17
          - generic [ref=e389]:
            - button "保存动图" [disabled] [ref=e390]
            - link "返回课程" [ref=e391]:
              - /url: http://127.0.0.1:4308/
          - status [ref=e392]
          - group [ref=e393]:
            - generic "星星进度" [ref=e394] [cursor=pointer]
        - group [ref=e395]:
          - generic "课后练习纸 ＋" [ref=e396] [cursor=pointer]
  - text: ·
```

# Test source

```ts
  1   | 'use strict';
  2   | const {test,expect}=require('@playwright/test');
  3   | const {activity,story,ANSWERS}=require('../support/unit4546-v153');
  4   | const {select}=require('../support/units1-30-tasks');
  5   | test.use({actionTimeout:7000,...(process.env.UNIT4546_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  6   | test('54题完整流程、三卡五区五星及无配音',async({page},info)=>{
  7   |  test.setTimeout(120000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
  8   |  await story(page);await expect(page.locator('.bubble-row')).toHaveCount(14);await expect(page.locator('#starCount')).toHaveText('0');
  9   |  let count=0;
  10  |  for(const id of Object.keys(ANSWERS)){
  11  |   const room=await activity(page,id,{inspect:async(surface,i,phase)=>{if(phase==='before')await surface.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  12  |   await expect(page.locator('#starCount')).toHaveText(String(++count));
  13  |   await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  14  |   for(const [i,name] of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  15  |   await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
  16  |  }
  17  |  await page.goto('/unit45-46/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');
  18  |  await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
  19  |  await expect.poll(()=>page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  20  |  expect(errors).toEqual([]);expect(voices).toEqual([]);
  21  | });
  22  | 
  23  | test('24张词卡、音标、翻义与末组推进；不依赖配音',async({page})=>{
  24  |  await page.goto('/unit45-46/#learn/words');const room=page.locator('.stage-words');
  25  |  const first=room.getByRole('button',{name:'can',exact:true});await expect(first).toContainText('/kæn/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('能；会');
  26  |  await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
  27  |  for(let i=0;i<4;i++){
  28  |   await expect(room.locator('.unit-word')).toHaveCount(6);await expect(room.locator('.word-phonetic')).toHaveCount(6);
  29  |   // Keep each IPA transcription in one complete phonetic face; the new Latin
  30  |   // course face lacks several symbols and must not override this exception.
  31  |   expect(await room.locator('.word-phonetic').evaluateAll(nodes=>nodes.every(el=>getComputedStyle(el).fontFamily.startsWith('Arial')))).toBe(true);
  32  |   await expect.poll(()=>room.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  33  |   if(i<3)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
  34  |  }
  35  |  await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('4 / 4');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);await expect(page.locator('#starCount')).toHaveText('0');
  36  | });
  37  | 
  38  | test('14段三人原文：隔壁切景、只有一封信、接到信后才发现字迹问题',async({page},info)=>{
  39  |  await page.goto('/unit45-46/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.office-world');
  40  |  await room.getByRole('button',{name:'开始看课文',exact:true}).click();
  41  |  const lines=['Can you come here a minute please, Bob?','Yes, sir?','Where’s Pamela?','She’s next door. She’s in her office, sir.','Can she type this letter for me? Ask her please.','Yes, sir.','Can you type this letter for the boss please, Pamela?','Yes, of course I can.','Here you are.','Thank you, Bob.','Bob!','Yes? What’s the matter?','I can’t type this letter.','I can’t read it! The boss’s handwriting is terrible!'];
  42  |  for(let i=0;i<14;i++){
  43  |   await expect(room.locator('.bubble-row')).toHaveCount(i+1);await expect(room.locator('.bubble-row').last().locator('.btext')).toHaveText(lines[i]);
  44  |   await expect(world.locator('.office-letter')).toHaveCount(1);await expect(world).toHaveAttribute('data-room',i<6?'boss':'pamela');await expect(world).toHaveAttribute('data-owner',i<6?'boss':i<9?'bob':'pamela');await expect(world).toHaveAttribute('data-problem',String(i>=12));
  45  |   if(i===8){await room.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();await expect(room.locator('.bubble-row').last()).toContainText('给你');await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(9);}
  46  |   if([4,6,8,13].includes(i))await room.screenshot({path:info.outputPath('story-'+i+'.png')});
  47  |   if(i<13)await room.getByRole('button',{name:'下一句',exact:true}).click();
  48  |  }
  49  |  await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('0');await expect(room.locator('.completion-stats')).toHaveCount(0);
  50  |  for(const width of [390,1280]){await page.setViewportSize({width,height:844});await page.reload();const box=await room.getByRole('log').boundingBox();await expect.poll(async()=>{const last=await room.locator('.bubble-row').last().locator('.btext').boundingBox();return last.y>=box.y&&last.y+last.height<=box.y+box.height;}).toBe(true);}
  51  | });
  52  | 
  53  | test('语法反复错答、部分填空、撤回、提示与刷新；订正不发星，重练可获星',async({page})=>{
  54  |  test.setTimeout(70000);await page.goto('/unit45-46/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
  55  |  await expect(room.getByRole('region',{name:'短示范'})).toContainText('I cannot read it.');
  56  |  for(let i=0;i<2;i++){await select(room,'I can type.');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  57  |  for(const [i,answer]of ANSWERS.grammar.entries()){
  58  |   if(i===1){await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'can’t',exact:true}).click();await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'can’t',exact:true}).click();}
  59  |   if(i===2){await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'Can',exact:true}).press('Enter');await page.reload();await expect(room.getByRole('group',{name:'已选词块'})).toContainText('Can');await room.getByRole('button',{name:'撤回 Can',exact:true}).click();await expect(check).toBeDisabled();}
  60  |   if(i===8){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  61  |   if(i===15)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  62  |   // Static-page DOM swaps load images asynchronously; broken assets still fail this bounded wait.
  63  |   await expect.poll(()=>room.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  64  |   await select(room,answer);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===15?'完成这一站':'下一题',exact:true}).click();
  65  |  }
  66  |  await expect(room.locator('.completion-number')).toHaveText(['16','16','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['16','16','2']);
  67  |  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
  68  | });
  69  | 
  70  | test('场景第三题错两次：3／5／2；仅检查正确后递信，刷新仍只有一封',async({page})=>{
  71  |  await page.goto('/unit45-46/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.office-world');
  72  |  for(let i=0;i<5;i++){
  73  |   if(i===2){for(let n=0;n<2;n++){await select(room,'老板');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(world).toHaveAttribute('data-owner','bob');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}}
  74  |   if(i===2){const material=await room.getByRole('region',{name:'题目材料',exact:true}).boundingBox(),stage=await world.boundingBox();expect(material.y+material.height).toBeLessThanOrEqual(stage.y);}
  75  |   await select(room,ANSWERS.apply[i]);if(i===2){await expect(world).toHaveAttribute('data-owner','bob');await page.reload();await expect(world).toHaveAttribute('data-owner','bob');}
  76  |   await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
  77  |   if(i>=2){await expect(world).toHaveAttribute('data-owner','pamela');await expect(world.locator('.office-letter')).toHaveCount(1);await page.reload();await expect(world).toHaveAttribute('data-owner','pamela');}
  78  |   if(i===4)await expect(room.locator('.practice-finish')).toHaveCount(0);
  79  |   await room.getByRole('button',{name:i===4?'完成这一站':'下一题',exact:true}).click();
  80  |  }
  81  |  await expect(room.locator('.completion-number')).toHaveText(['3','5','2']);await expect(page.locator('#starCount')).toHaveText('0');
  82  | });
  83  | 
  84  | test('配对部分不能检查；已配可撤销；刷新不代答',async({page})=>{
  85  |  await page.goto('/unit45-46/#learn/listen');const room=page.locator('.stage-listen');
  86  |  for(const answer of ANSWERS.listen.slice(0,3)){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
  87  |  await select(room,{pairs:[['ask','问；请求']]});await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  88  |  await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  89  |  await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'ask',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'问；请求',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 3 对');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  90  |  await select(room,{pairs:[['ask','打字'],['type','问；请求'],['lift','举起']]});await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
  91  |  // Retry retains editable pairs. Undo each end through the actual controls.
  92  |  for(const [left,right] of [['ask','打字'],['type','问；请求'],['lift','举起']]){await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:left,exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:right,exact:true}).click();}
  93  |  await select(room,ANSWERS.listen[3]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
  94  | });
  95  | 
  96  | test('所有声音失败仍能完成故事和五个答题区',async({page})=>{
  97  |  test.setTimeout(90000);let failures=0;await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,route=>{failures++;return route.abort();});
  98  |  await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);
> 99  |  await expect(page.locator('#starCount')).toHaveText('5');expect(failures).toBeGreaterThan(0);
      |                                                                            ^ Error: expect(received).toBeGreaterThan(expected)
  100 | });
  101 | 
  102 | test('Lesson46八组对比、全部数字和7+8书写题有入口',async({page})=>{
  103 |  await page.goto('/unit45-46/#learn/grammar');await page.getByText('本领对比与数字',{exact:true}).click();await expect(page.locator('.reference-card')).toHaveCount(8);await expect(page.locator('.reference-card').first()).toContainText('1,000 · a thousand');await expect(page.locator('.reference-card').last()).toContainText('1,000,000 · a million');
  104 |  await page.getByText('语法小参考',{exact:true}).click();await expect(page.locator('.grammar-reference')).toContainText('can not');
  105 |  await page.goto('/unit45-46/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(7);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(8);await expect(page.locator('#starCount')).toHaveText('0');
  106 | });
  107 | 
  108 | for(const width of [320,390,768,1280])test(`${width}宽及短屏：场景、题型、三卡和两按钮`,async({page},info)=>{
  109 |  test.setTimeout(90000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});await story(page);await page.locator('.stage-text').screenshot({path:info.outputPath('story.png')});
  110 |  for(const id of ['grammar','apply','exam']){
  111 |   const room=await activity(page,id,{inspect:async(surface,i,phase)=>{
  112 |    if(phase==='before'){
  113 |     expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  114 |     await expect.poll(()=>surface.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  115 |     for(const button of await surface.locator('button:visible').all()){const box=await button.boundingBox();expect(box.height).toBeGreaterThanOrEqual(43);}
  116 |     if((id==='grammar'&&[0,1,4,7,11].includes(i))||(id==='apply'&&[1,3,4].includes(i))||(id==='exam'&&[9,14].includes(i)))await surface.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});
  117 |    }
  118 |   }});
  119 |   await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  120 |   const boxes=await room.locator('.completion-stat').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().y));expect(Math.max(...boxes)-Math.min(...boxes)).toBeLessThan(2);
  121 |   await room.screenshot({path:info.outputPath(id+'-completion.png')});
  122 |   for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all()){await btn.scrollIntoViewIfNeeded();const box=await btn.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44);expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(page.viewportSize().height);}
  123 |   const visibleTogether=await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(el=>{const b=el.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}));expect(visibleTogether).toBe(true);
  124 |  }
  125 | });
  126 | 
  127 | 
```