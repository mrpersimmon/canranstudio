# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit45-46-v153-layout.spec.js >> 390宽：对白在场景内、14句全程无重叠，翻译与推进不跳动
- Location: tests\e2e\unit45-46-v153-layout.spec.js:57:39

# Error details

```
Error: locator.evaluate: Error: strict mode violation: locator('.stage-text').locator('.office-world').locator('.office-actor:visible').first().locator('.office-person>img') resolved to 2 elements:
    1) <img alt="" class="" data-pose="boss-read" src="/assets/unit45-46/boss-read.svg"/> aka locator('.office-person > img').first()
    2) <img alt="老板手里的信" class="office-letter office-held" src="/assets/unit45-46/letter.svg"/> aka getByLabel('办公室小剧场').getByRole('img', { name: '老板手里的信' })

Call log:
  - waiting for locator('.stage-text').locator('.office-world').locator('.office-actor:visible').first().locator('.office-person>img')

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
          - option "走进办公室"
          - option "老板的信" [selected]
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
              - button "同学" [ref=e72] [cursor=pointer]
              - button "老板" [ref=e73] [cursor=pointer]
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
              - generic [ref=e103]:
                - generic [ref=e104]: The boss
                - paragraph [ref=e105]:
                  - generic [ref=e106]: Can you come here a minute please, Bob?
                - paragraph [ref=e107]: 请你来一下好吗，鲍勃？
                - button "收起中文" [expanded] [active] [ref=e109] [cursor=pointer]
            - status "已读 1 / 14 句课文" [ref=e110]: 1 / 14
            - generic [ref=e111]:
              - button "从头看" [ref=e113] [cursor=pointer]
              - button "下一句" [ref=e114] [cursor=pointer]
      - region "故事小侦探" [ref=e115]:
        - heading "故事小侦探" [level=3] [ref=e118]
        - button "先看课文" [ref=e120] [cursor=pointer]
    - generic [ref=e121]:
      - generic [ref=e122]:
        - heading "问出想知道的" [level=2] [ref=e123]
        - generic "本关 0 / 1 颗星" [ref=e124]: ☆
      - region "语法小工坊" [ref=e125]:
        - heading "语法小工坊" [level=3] [ref=e128]
        - generic [ref=e129]:
          - generic [ref=e130]:
            - generic [ref=e131]:
              - paragraph [ref=e132]:
                - generic [ref=e133]: 第 1 / 16 题
                - progressbar "本轮进度" [ref=e134]
              - region "短示范" [ref=e151]:
                - generic [ref=e152]:
                  - paragraph [ref=e153]: I cannot read it. → I can’t read it.
                  - generic [ref=e154]: cannot → can’t；否定意思不变。
              - heading "选择与 I cannot type. 意思相同的一句" [level=3] [ref=e155]
            - group "选择回应" [ref=e156]:
              - button "I can’t type." [ref=e157] [cursor=pointer]
              - button "I am typing." [ref=e158] [cursor=pointer]
              - button "I can type." [ref=e159] [cursor=pointer]
          - generic [ref=e160]:
            - region "答题反馈" [ref=e161]:
              - status [ref=e162]
            - group "作答操作" [ref=e163]:
              - button "给点线索" [ref=e164] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e166]
        - group [ref=e167]:
          - generic "语法小参考 ＋" [ref=e168] [cursor=pointer]
        - group [ref=e169]:
          - generic "本领对比与数字 ＋" [ref=e170] [cursor=pointer]
    - generic [ref=e171]:
      - generic [ref=e172]:
        - heading "帮忙传个话" [level=2] [ref=e173]
        - generic "本关 0 / 1 颗星" [ref=e174]: ☆
      - region "办公室小帮手" [ref=e175]:
        - heading "办公室小帮手" [level=3] [ref=e178]
        - generic [ref=e179]:
          - generic [ref=e180]:
            - generic [ref=e181]:
              - paragraph [ref=e182]:
                - generic [ref=e183]: 第 1 / 5 题
                - progressbar "本轮进度" [ref=e184]
              - heading "请Bob来帮忙，怎样说？" [level=3] [ref=e190]
              - region "题目材料" [ref=e191]:
                - paragraph [ref=e192]: The boss is here. Bob is next door.
                - paragraph [ref=e193]: 老板想请Bob过来帮忙。
              - group "一封信在办公室里的旅程" [ref=e194]:
                - generic [ref=e195]:
                  - generic [ref=e196]:
                    - img "老板手里的信" [ref=e198]
                    - generic [ref=e199]: The boss
                  - generic [ref=e200]: Bob
                  - img "空文件盘" [ref=e204]
                - paragraph [ref=e205]: 老板的办公室
            - group "选择回应" [ref=e206]:
              - button "Where can you come?" [ref=e207] [cursor=pointer]
              - button "Can you come here, please?" [ref=e208] [cursor=pointer]
              - button "I can’t come here." [ref=e209] [cursor=pointer]
          - generic [ref=e210]:
            - region "答题反馈" [ref=e211]:
              - status [ref=e212]
            - group "作答操作" [ref=e213]:
              - button "给点线索" [ref=e214] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e216]
    - generic [ref=e217]:
      - generic [ref=e218]:
        - heading "沟通大挑战" [level=2] [ref=e219]
        - generic "本关 0 / 1 颗星" [ref=e220]: ☆
      - region "综合挑战" [ref=e221]:
        - heading "综合挑战" [level=3] [ref=e224]
        - generic [ref=e225]:
          - generic [ref=e226]:
            - paragraph [ref=e227]:
              - generic [ref=e228]: 第 1 / 21 题
              - progressbar "本轮进度" [ref=e229]
            - heading "给词和意思选择配对" [level=3] [ref=e251]
            - generic [ref=e252]:
              - generic [ref=e253]:
                - group "英文" [ref=e254]:
                  - button "boss" [ref=e255] [cursor=pointer]:
                    - generic [ref=e256]: "1"
                  - button "minute" [ref=e258] [cursor=pointer]:
                    - generic [ref=e259]: "2"
                  - button "ask" [ref=e261] [cursor=pointer]:
                    - generic [ref=e262]: "3"
                  - button "handwriting" [ref=e264] [cursor=pointer]:
                    - generic [ref=e265]: "4"
                - group "词义" [ref=e267]:
                  - button "字迹" [disabled] [ref=e268]:
                    - generic [ref=e269]: –
                  - button "分钟" [disabled] [ref=e271]:
                    - generic [ref=e272]: –
                  - button "老板" [disabled] [ref=e274]:
                    - generic [ref=e275]: –
                  - button "问；请求" [disabled] [ref=e277]:
                    - generic [ref=e278]: –
              - paragraph [ref=e280]: 已配 0 / 4 对
          - generic [ref=e281]:
            - region "答题反馈" [ref=e282]:
              - status [ref=e283]
            - group "作答操作" [ref=e284]:
              - button "检查答案" [disabled] [ref=e285]
      - region "我的单元纪念卡" [ref=e286]:
        - heading "我的单元纪念卡" [level=3] [ref=e289]
        - generic [ref=e290]:
          - article "我的单元纪念卡" [ref=e291]:
            - paragraph [ref=e292]: 灿然英语工作室
            - heading "沟通小能手" [level=3] [ref=e293]
            - paragraph [ref=e294]: 登录后显示姓名
            - group "已获得 0 / 5 颗星" [ref=e295]
            - img "Pamela举着字迹潦草的信，Bob靠近一起辨认，旁边放着紫色打字机"
            - paragraph [ref=e301]:
              - generic [ref=e302]: Lesson 45–46
          - generic [ref=e303]:
            - button "保存动图" [disabled] [ref=e304]
            - link "返回课程" [ref=e305] [cursor=pointer]:
              - /url: http://127.0.0.1:4308/
          - status [ref=e306]
          - group [ref=e307]:
            - generic "星星进度" [ref=e308] [cursor=pointer]
        - group [ref=e309]:
          - generic "课后练习纸 ＋" [ref=e310] [cursor=pointer]
  - text: ·
```

# Test source

```ts
  1   | 'use strict';
  2   | const {test,expect}=require('@playwright/test');
  3   | 
  4   | test.use({actionTimeout:7000,...(process.env.UNIT4546_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5   | 
  6   | async function assertBobFacesPartner(world){
  7   |  const facing=await world.evaluate(el=>{
  8   |   const bob=el.querySelector('.actor-bob'),partner=el.querySelector('.office-actor:not(.actor-bob):not([hidden])');
  9   |   const b=bob.getBoundingClientRect(),p=partner.getBoundingClientRect();
  10  |   // The approved Bob poses face right in the source artwork. Compare their
  11  |   // displayed direction with the partner's actual position in both rooms.
  12  |   const direction=new DOMMatrixReadOnly(getComputedStyle(bob.querySelector('.office-person>img')).transform).a;
  13  |   return {towardsPartner:direction*((p.x+p.width/2)-(b.x+b.width/2)),captionDirection:new DOMMatrixReadOnly(getComputedStyle(bob.querySelector('span')).transform).a};
  14  |  });
  15  |  expect(facing.towardsPartner,'Bob 应面向当前同场人物，不能朝向场景外侧').toBeGreaterThan(0);
  16  |  expect(facing.captionDirection,'人物朝向变化不能镜像姓名').toBeGreaterThan(0);
  17  | }
  18  | 
  19  | async function assertUncut(image){
> 20  |  await image.evaluate(img=>img.decode());
      |              ^ Error: locator.evaluate: Error: strict mode violation: locator('.stage-text').locator('.office-world').locator('.office-actor:visible').first().locator('.office-person>img') resolved to 2 elements:
  21  |  // Inspect pixels of the actual browser-rendered asset, not its SVG source.
  22  |  const edgePixels=await image.evaluate(img=>{
  23  |   const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
  24  |   const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);
  25  |   const pixels=ctx.getImageData(0,0,c.width,c.height).data;let count=0;
  26  |   for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(pixels[(y*c.width+x)*4+3]>32)count++;
  27  |   return count;
  28  |  });
  29  |  expect(edgePixels,'人物两侧必须留出透明安全边，不把手截在图片边界').toBe(0);
  30  | }
  31  | 
  32  | test('办公室开场问题、地点和翻译使用同一套中文字体',async({page},info)=>{
  33  |  await page.goto('/unit45-46/#learn/text');
  34  |  const room=page.locator('.stage-text');
  35  |  await room.screenshot({path:info.outputPath('intro.png')});
  36  |  const headingFont=await room.locator('.stage-heading h3').evaluate(el=>getComputedStyle(el).fontFamily.split(',')[0].replaceAll('"','').trim());
  37  |  for(const target of [room.locator('.story-lead p'),room.locator('.office-location')])
  38  |   await expect(target).toHaveCSS('font-family',new RegExp(headingFont));
  39  |  await room.getByRole('button',{name:'开始看课文',exact:true}).click();
  40  |  await room.getByRole('button',{name:'看中文',exact:true}).click();
  41  |  await expect(room.locator('.bcn')).toHaveCSS('font-family',new RegExp(headingFont));
  42  | });
  43  | 
  44  | test('第6句老板指向右侧时，实际图片边缘没有被截断的人物像素',async({page},info)=>{
  45  |  await page.goto('/unit45-46/#learn/text');
  46  |  const room=page.locator('.stage-text');
  47  |  await room.getByRole('button',{name:'开始看课文',exact:true}).click();
  48  |  for(let i=1;i<6;i++)await room.getByRole('button',{name:'下一句',exact:true}).click();
  49  |  await expect(room.locator('.bubble-row').last().locator('.btext')).toHaveText('Yes, sir.');
  50  |  const image=room.locator('.actor-boss .office-person>img');
  51  |  await image.evaluate(img=>img.decode());
  52  |  await room.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  53  |  await room.screenshot({path:info.outputPath('boss-point.png')});
  54  |  await assertUncut(image);
  55  | });
  56  | 
  57  | for(const width of [320,390,768,1280])test(`${width}宽：对白在场景内、14句全程无重叠，翻译与推进不跳动`,async({page},info)=>{
  58  |  test.setTimeout(60000);
  59  |  await page.setViewportSize({width,height:width<400?568:900});
  60  |  await page.goto('/unit45-46/#learn/text');
  61  |  const room=page.locator('.stage-text'),world=room.locator('.office-world'),log=room.getByRole('log');
  62  |  const worldBox=await world.boundingBox(),logBox=await log.boundingBox();
  63  |  await room.screenshot({path:info.outputPath('intro.png')});
  64  |  await assertBobFacesPartner(world);
  65  |  expect(logBox.x,'对白留在场景内').toBeGreaterThanOrEqual(worldBox.x);
  66  |  expect(logBox.x+logBox.width).toBeLessThanOrEqual(worldBox.x+worldBox.width);
  67  |  expect(logBox.y).toBeGreaterThanOrEqual(worldBox.y);
  68  |  expect(logBox.y+logBox.height,'对白不能另起一块排在场景下方').toBeLessThanOrEqual(worldBox.y+worldBox.height);
  69  |  const locationBox=await room.locator('.office-location').boundingBox();
  70  |  expect(locationBox.width,'地点是紧凑标牌，不是铺满地板的横条').toBeLessThan(worldBox.width*.8);
  71  |  await room.getByRole('button',{name:'开始看课文',exact:true}).click();
  72  |  for(let i=0;i<14;i++){
  73  |   const latest=room.locator('.bubble-row').last();
  74  |   await expect(room.locator('.bubble-row')).toHaveCount(i+1);
  75  |   await assertBobFacesPartner(world);
  76  |   const next=room.getByRole('button',{name:i===13?'完成课文':'下一句',exact:true});
  77  |   // Read with the transcript below the sticky navigation. Centering just the
  78  |   // next button can put the translation control behind that navigation.
  79  |   await log.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  80  |   const before=await next.boundingBox();
  81  |   await latest.getByRole('button',{name:'看中文',exact:true}).click();
  82  |   const after=await next.boundingBox();
  83  |   expect(Math.abs(after.y-before.y),'展开中文不能推动整页或按钮').toBeLessThan(2);
  84  |   const bounds=await log.boundingBox(),line=await latest.boundingBox();
  85  |   expect(line.y).toBeGreaterThanOrEqual(bounds.y-1);
  86  |   expect(line.y+line.height).toBeLessThanOrEqual(bounds.y+bounds.height+1);
  87  |   for(const person of await world.locator('.office-actor:visible').all()){
  88  |    await assertUncut(person.locator('.office-person>img'));
  89  |    const b=await person.boundingBox(),w=await world.boundingBox();
  90  |    const caption=await world.locator('.office-location').boundingBox();
  91  |    expect(bounds.y+bounds.height,'对白不能遮住人物').toBeLessThanOrEqual(b.y);
  92  |    expect(caption.y+caption.height,'地点标牌不能遮住对白').toBeLessThanOrEqual(bounds.y);
  93  |    expect(caption.y+caption.height,'地点标牌不能压住人物头部').toBeLessThanOrEqual(b.y);
  94  |    expect(b.x).toBeGreaterThanOrEqual(w.x);
  95  |    expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);
  96  |    expect(b.y).toBeGreaterThanOrEqual(w.y);
  97  |    expect(b.y+b.height).toBeLessThanOrEqual(w.y+w.height);
  98  |   }
  99  |   if(await world.locator('.office-machine').isVisible()){
  100 |    const caption=await world.locator('.office-location').boundingBox(),machine=await world.locator('.office-machine').boundingBox();
  101 |    expect(caption.y+caption.height,'地点标牌不能遮挡打字机').toBeLessThanOrEqual(machine.y);
  102 |    expect(bounds.y+bounds.height,'对白不能遮住打字机').toBeLessThanOrEqual(machine.y);
  103 |   }
  104 |   if([0,5,6,13].includes(i)){
  105 |    // Show the whole stage without embedding the sticky bar mid-illustration.
  106 |    await room.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  107 |    await room.screenshot({path:info.outputPath(`line-${i+1}.png`)});
  108 |   }
  109 |   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  110 |   if(i<13)await next.click();
  111 |  }
  112 |  await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(14);
  113 |  await assertBobFacesPartner(world);
  114 |  await room.getByRole('button',{name:'完成课文',exact:true}).click();
  115 |  await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();
  116 |  await expect(page.locator('#starCount')).toHaveText('0');
  117 | });
  118 | 
```