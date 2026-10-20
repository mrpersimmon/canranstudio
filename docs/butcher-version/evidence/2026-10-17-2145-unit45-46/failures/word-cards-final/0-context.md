# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit45-46-v153-materials.spec.js >> 窄屏24词卡长单词不拆行，数字采用新字形且可读
- Location: tests\e2e\unit45-46-v153-materials.spec.js:14:1

# Error details

```
Error: handwriting

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 30
Received:    25.65625
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
          - option "走进办公室" [selected]
          - option "老板的信"
          - option "问出想知道的"
          - option "帮忙传个话"
          - option "沟通大挑战"
  - generic [ref=e12]:
    - img "Bob 和 Pamela 一起辨认信上的字迹，旁边放着打字机" [ref=e14]
    - generic [ref=e15]:
      - paragraph [ref=e16]: 新概念英语 · Lesson 45–46
      - heading "一封难读的信" [level=1] [ref=e17]
      - paragraph [ref=e18]: 跟 Bob 送一封信，把问题问清楚，把困难说出来。
      - button "继续冒险" [ref=e19] [cursor=pointer]
  - main [ref=e20]:
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading "走进办公室" [level=2] [ref=e23]
        - generic "本关 0 / 1 颗星" [ref=e24]: ☆
      - region "办公室小图鉴" [ref=e25]:
        - heading "办公室小图鉴" [level=3] [ref=e28]
        - generic [ref=e29]:
          - button "can" [ref=e30] [cursor=pointer]:
            - strong [ref=e31]: can
            - generic [ref=e32]: /kæn/
          - button "boss" [ref=e33] [cursor=pointer]:
            - strong [ref=e34]: boss
            - generic [ref=e35]: /bɒs/
          - button "minute" [ref=e36] [cursor=pointer]:
            - strong [ref=e37]: minute
            - generic [ref=e38]: /ˈmɪnɪt/
          - button "ask" [ref=e39] [cursor=pointer]:
            - strong [ref=e40]: ask
            - generic [ref=e41]: /ɑːsk/
          - button "handwriting" [ref=e42] [cursor=pointer]:
            - strong [ref=e43]: handwriting
            - generic [ref=e44]: /ˈhændraɪtɪŋ/
          - button "terrible" [ref=e45] [cursor=pointer]:
            - strong [ref=e46]: terrible
            - generic [ref=e47]: /ˈterəbl/
        - generic [ref=e48]:
          - button "上一组词卡" [disabled] [ref=e49]
          - generic [ref=e50]: 1 / 4
          - button "下一组词卡" [ref=e51] [cursor=pointer]
      - region "单词寻宝" [ref=e52]:
        - heading "单词寻宝" [level=3] [ref=e55]
        - generic [ref=e56]:
          - generic [ref=e57]:
            - paragraph [ref=e58]:
              - generic [ref=e59]: 第 1 / 7 题
              - progressbar "本轮进度" [ref=e60]
            - heading "boss 是谁？" [level=3] [ref=e68]
            - img "故事里的老板" [ref=e69]
            - generic [ref=e70]:
              - button "客人" [ref=e71] [cursor=pointer]
              - button "老板" [ref=e72] [cursor=pointer]
              - button "同学" [ref=e73] [cursor=pointer]
          - generic [ref=e74]:
            - region "答题反馈" [ref=e75]:
              - status [ref=e76]
            - group "作答操作" [ref=e77]:
              - button "检查答案" [disabled] [ref=e78]
    - generic [ref=e79]:
      - generic [ref=e80]:
        - heading "老板的信" [level=2] [ref=e81]
        - generic "本关 0 / 1 颗星" [ref=e82]: ☆
      - region "办公室小剧场" [ref=e83]:
        - heading "办公室小剧场" [level=3] [ref=e86]
        - generic [ref=e87]:
          - group "一封信在办公室里的旅程" [ref=e88]:
            - generic [ref=e89]:
              - generic [ref=e90]:
                - img "老板手里的信" [ref=e92]
                - generic [ref=e93]: The boss
              - generic [ref=e94]: Bob
              - img "空文件盘" [ref=e98]
            - paragraph [ref=e99]: 老板的办公室
          - generic [ref=e100]:
            - log "课文对话" [ref=e101]:
              - paragraph [ref=e103]: Why can’t Pamela type the letter?
            - status "尚未开始阅读" [ref=e104]
            - button "开始看课文" [ref=e106] [cursor=pointer]
      - region "故事小侦探" [ref=e107]:
        - heading "故事小侦探" [level=3] [ref=e110]
        - button "先看课文" [ref=e112] [cursor=pointer]
    - generic [ref=e113]:
      - generic [ref=e114]:
        - heading "问出想知道的" [level=2] [ref=e115]
        - generic "本关 0 / 1 颗星" [ref=e116]: ☆
      - region "语法小工坊" [ref=e117]:
        - heading "语法小工坊" [level=3] [ref=e120]
        - generic [ref=e121]:
          - generic [ref=e122]:
            - generic [ref=e123]:
              - paragraph [ref=e124]:
                - generic [ref=e125]: 第 1 / 16 题
                - progressbar "本轮进度" [ref=e126]
              - region "短示范" [ref=e143]:
                - generic [ref=e144]:
                  - paragraph [ref=e145]: I cannot read it. → I can’t read it.
                  - generic [ref=e146]: cannot → can’t；否定意思不变。
              - heading "选择与 I cannot type. 意思相同的一句" [level=3] [ref=e147]
            - group "选择回应" [ref=e148]:
              - button "I can type." [ref=e149] [cursor=pointer]
              - button "I am typing." [ref=e150] [cursor=pointer]
              - button "I can’t type." [ref=e151] [cursor=pointer]
          - generic [ref=e152]:
            - region "答题反馈" [ref=e153]:
              - status [ref=e154]
            - group "作答操作" [ref=e155]:
              - button "给点线索" [ref=e156] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e158]
        - group [ref=e159]:
          - generic "语法小参考 ＋" [ref=e160] [cursor=pointer]
        - group [ref=e161]:
          - generic "本领对比与数字 ＋" [ref=e162] [cursor=pointer]
    - generic [ref=e163]:
      - generic [ref=e164]:
        - heading "帮忙传个话" [level=2] [ref=e165]
        - generic "本关 0 / 1 颗星" [ref=e166]: ☆
      - region "办公室小帮手" [ref=e167]:
        - heading "办公室小帮手" [level=3] [ref=e170]
        - generic [ref=e171]:
          - generic [ref=e172]:
            - generic [ref=e173]:
              - paragraph [ref=e174]:
                - generic [ref=e175]: 第 1 / 5 题
                - progressbar "本轮进度" [ref=e176]
              - heading "请Bob来帮忙，怎样说？" [level=3] [ref=e182]
              - region "题目材料" [ref=e183]:
                - paragraph [ref=e184]: The boss is here. Bob is over there.
                - paragraph [ref=e185]: 老板想请Bob过来帮忙。
              - group "一封信在办公室里的旅程" [ref=e186]:
                - generic [ref=e187]:
                  - generic [ref=e188]:
                    - img "老板手里的信" [ref=e190]
                    - generic [ref=e191]: The boss
                  - generic [ref=e192]: Bob
                  - img "空文件盘" [ref=e196]
                - paragraph [ref=e197]: 老板的办公室
            - group "选择回应" [ref=e198]:
              - button "I can’t come here." [ref=e199] [cursor=pointer]
              - button "Where can you come?" [ref=e200] [cursor=pointer]
              - button "Can you come here, please?" [ref=e201] [cursor=pointer]
          - generic [ref=e202]:
            - region "答题反馈" [ref=e203]:
              - status [ref=e204]
            - group "作答操作" [ref=e205]:
              - button "给点线索" [ref=e206] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e208]
    - generic [ref=e209]:
      - generic [ref=e210]:
        - heading "沟通大挑战" [level=2] [ref=e211]
        - generic "本关 0 / 1 颗星" [ref=e212]: ☆
      - region "综合挑战" [ref=e213]:
        - heading "综合挑战" [level=3] [ref=e216]
        - generic [ref=e217]:
          - generic [ref=e218]:
            - paragraph [ref=e219]:
              - generic [ref=e220]: 第 1 / 21 题
              - progressbar "本轮进度" [ref=e221]
            - heading "给词和意思选择配对" [level=3] [ref=e243]
            - generic [ref=e244]:
              - generic [ref=e245]:
                - group "英文" [ref=e246]:
                  - button "boss" [ref=e247] [cursor=pointer]:
                    - generic [ref=e248]: "1"
                  - button "minute" [ref=e250] [cursor=pointer]:
                    - generic [ref=e251]: "2"
                  - button "ask" [ref=e253] [cursor=pointer]:
                    - generic [ref=e254]: "3"
                  - button "handwriting" [ref=e256] [cursor=pointer]:
                    - generic [ref=e257]: "4"
                - group "词义" [ref=e259]:
                  - button "分钟" [disabled] [ref=e260]:
                    - generic [ref=e261]: –
                  - button "字迹" [disabled] [ref=e263]:
                    - generic [ref=e264]: –
                  - button "老板" [disabled] [ref=e266]:
                    - generic [ref=e267]: –
                  - button "问；请求" [disabled] [ref=e269]:
                    - generic [ref=e270]: –
              - paragraph [ref=e272]: 已配 0 / 4 对
          - generic [ref=e273]:
            - region "答题反馈" [ref=e274]:
              - status [ref=e275]
            - group "作答操作" [ref=e276]:
              - button "检查答案" [disabled] [ref=e277]
      - region "我的单元纪念卡" [ref=e278]:
        - heading "我的单元纪念卡" [level=3] [ref=e281]
        - generic [ref=e282]:
          - article "我的单元纪念卡" [ref=e283]:
            - paragraph [ref=e284]: 灿然英语工作室
            - heading "沟通小能手" [level=3] [ref=e285]
            - paragraph [ref=e286]: 登录后显示姓名
            - group "已获得 0 / 5 颗星" [ref=e287]
            - img "Pamela举着字迹潦草的信，Bob靠近一起辨认，旁边放着紫色打字机"
            - paragraph [ref=e293]:
              - generic [ref=e294]: Lesson 45–46
          - generic [ref=e295]:
            - button "保存动图" [disabled] [ref=e296]
            - link "返回课程" [ref=e297] [cursor=pointer]:
              - /url: http://127.0.0.1:4509/
          - status [ref=e298]
          - group [ref=e299]:
            - generic "星星进度" [ref=e300] [cursor=pointer]
        - group [ref=e301]:
          - generic "课后练习纸 ＋" [ref=e302] [cursor=pointer]
  - text: ·
```

# Test source

```ts
  1  | 'use strict';const{test,expect}=require('@playwright/test');const{ANSWERS,select,activity}=require('../support/unit4546-v153');test.use({actionTimeout:7000,...(process.env.UNIT4546_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  2  | test('八组双侧材料、全部英文数字及原例在手机和桌面可读',async({page},info)=>{
  3  |  test.setTimeout(60000);await page.goto('/unit45-46/#learn/grammar');await page.getByText('本领对比与数字',{exact:true}).click();const cards=page.locator('.reference-card');await expect(cards.locator('small')).toHaveText(['1,000 · a thousand','5,000 · five thousand','10,000 · ten thousand','100,000 · a hundred thousand','210,000 · two hundred and ten thousand','350,000 · three hundred and fifty thousand','500,000 · five hundred thousand','1,000,000 · a million']);for(const width of [320,1280]){await page.setViewportSize({width,height:900});for(let i=0;i<8;i++){const card=cards.nth(i);await expect(card.locator('img')).toHaveAttribute('src',/reference-\d+-v153\.svg$/);await card.locator('img').evaluate(e=>e.decode());expect(await card.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);await card.screenshot({path:info.outputPath('reference-'+width+'-'+i+'.png')});}}await page.getByText('语法小参考',{exact:true}).click();for(const t of ['I can’t play the piano.','Can you see an orange on the table?','Who can sing in English in your class?','How many boats can you see in the river?'])await expect(page.locator('.grammar-reference')).toContainText(t);
  4  | });
  5  | test('原信件归属、手部接触区域和前景始终一致，镜像只影响人物',async({page},info)=>{
  6  |  test.setTimeout(90000);for(const width of [320,1280]){await page.setViewportSize({width,height:900});await page.goto('/unit45-46/#learn/text');const room=page.locator('.stage-text');for(let i=0;i<14;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();const owner=i<6?'boss':i<9?'bob':'pamela',world=room.locator('.office-world'),paper=world.locator('.office-letter'),body=world.locator('.actor-'+owner+' .office-person');await expect(world).toHaveAttribute('data-owner',owner);await expect(body.locator('.office-letter')).toHaveCount(1);await expect(world.locator('.office-letter')).toHaveCount(1);const b=await body.boundingBox(),p=await paper.boundingBox();expect(Math.abs(p.x+p.width/2-b.x-b.width/2)).toBeLessThan(2);expect(p.y).toBeGreaterThan(b.y);expect(p.y+p.height).toBeLessThan(b.y+b.height);expect(await paper.evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).a)).toBeGreaterThan(0);if([0,5,6,8,9,13].includes(i))await world.locator('.office-visual').screenshot({path:info.outputPath('hands-'+width+'-'+(i+1)+'.png')});}await room.getByRole('button',{name:'从头看',exact:true}).click();}
  7  | });
  8  | test('应用只在正确检查后移动同一封信，错答刷新不交接',async({page})=>{
  9  |  await page.goto('/unit45-46/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true});await select(room,ANSWERS.apply[0]);await check.click();await expect(room.locator('.office-world')).toHaveAttribute('data-owner','boss');await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(room.getByRole('region',{name:'题目材料'})).toContainText('Bob已经拿到老板的这封信');await select(room,ANSWERS.apply[1]);await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();await select(room,'老板');await check.click();await expect(room.locator('.actor-bob .office-letter')).toHaveCount(1);await page.reload();await expect(room.locator('.actor-bob .office-letter')).toHaveCount(1);await room.getByRole('button',{name:'再试一次',exact:true}).click();const original=await room.locator('.office-letter').elementHandle();await select(room,'Pamela');await expect(room.locator('.actor-bob .office-letter')).toHaveCount(1);await check.click();await expect(room.locator('.actor-pamela .office-letter')).toHaveCount(1);expect(await room.locator('.office-letter').evaluate((e,old)=>e===old,original)).toBe(true);await page.reload();await expect(room.locator('.actor-pamela .office-letter')).toHaveCount(1);
  10 | });
  11 | test('可见示范记录帮助，零错重练后答错仍保留原星',async({page})=>{
  12 |  test.setTimeout(90000);await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit45-46:learning:v1')).groups['unit4546-grammar-practice/v153'].states[3].revealed)).toBe(true);const room=page.locator('.stage-grammar');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await select(room,'I can type.');await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.reload();await expect(page.locator('#starCount')).toHaveText('1');
  13 | });
  14 | test('窄屏24词卡长单词不拆行，数字采用新字形且可读',async({page},info)=>{
> 15 |  await page.setViewportSize({width:320,height:568});await page.goto('/unit45-46/#learn/words');await page.evaluate(()=>document.fonts.ready);for(let i=0;i<4;i++){for(const card of await page.locator('.unit-word').all()){const en=await card.getAttribute('aria-label'),bounds=await card.boundingBox(),text=card.locator('strong'),rects=await text.evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);return [...r.getClientRects()].map(x=>({x:x.x,right:x.right,width:x.width}));});if(!en.includes(' '))expect(rects.length,en+'不应拆成多行').toBe(1);for(const r of rects){expect(r.x,en).toBeGreaterThanOrEqual(bounds.x);expect(r.right,en).toBeLessThanOrEqual(bounds.x+bounds.width);}if(['thousand','million'].includes(en))await expect(card.locator('img')).toHaveAttribute('src',new RegExp(en+'-v153.svg$'));}await page.locator('.stage-words').screenshot({path:info.outputPath('words-'+(i+1)+'.png')});if(i<3)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ^ Error: handwriting
  16 | });
  17 | 
```