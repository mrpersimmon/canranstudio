# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit19-20-v153.spec.js >> 综合挑战每次最多两空；全部未答材料可见且保留独立作答
- Location: tests\e2e\unit19-20-v153.spec.js:5:1

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 2
Received:    3
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
        - link "公园歇一歇" [ref=e11] [cursor=pointer]:
          - /url: "#l1"
        - link "跟着故事走" [ref=e12] [cursor=pointer]:
          - /url: "#l2"
        - link "发现身边的事物" [ref=e13] [cursor=pointer]:
          - /url: "#l3"
        - link "把情况说清楚" [ref=e14] [cursor=pointer]:
          - /url: "#l4"
        - link "再出发" [ref=e15] [cursor=pointer]:
          - /url: "#l5"
  - generic [ref=e16]:
    - img "妈妈和两个孩子相视微笑，孩子们各拿着一份冰淇淋" [ref=e18]
    - generic [ref=e19]:
      - paragraph [ref=e20]: 新概念英语 · Lesson 19–20
      - heading "冰淇淋休息站" [level=1] [ref=e21]
      - paragraph [ref=e22]: 跟着妈妈和孩子们，发现身边的人和物，把情况说清楚。
      - button "继续冒险" [ref=e23] [cursor=pointer]
  - main [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "公园歇一歇" [level=2] [ref=e27]
        - generic "本关 0 / 1 颗星" [ref=e28]: ☆
      - region "公园小图鉴" [ref=e29]:
        - heading "公园小图鉴" [level=3] [ref=e32]
        - generic [ref=e33]:
          - button "tired" [ref=e34] [cursor=pointer]:
            - strong [ref=e35]: tired
            - generic [ref=e36]: /taɪrd/
          - button "thirsty" [ref=e37] [cursor=pointer]:
            - strong [ref=e38]: thirsty
            - generic [ref=e39]: /ˈθɝːsti/
          - button "children" [ref=e40] [cursor=pointer]:
            - strong [ref=e41]: children
            - generic [ref=e42]: /ˈtʃɪldrən/
          - button "boy" [ref=e43] [cursor=pointer]:
            - strong [ref=e44]: boy
            - generic [ref=e45]: /bɔɪ/
          - button "mum" [ref=e46] [cursor=pointer]:
            - strong [ref=e47]: mum
            - generic [ref=e48]: /mʌm/
          - button "ice cream" [ref=e49] [cursor=pointer]:
            - strong [ref=e50]: ice cream
            - generic [ref=e51]: /ˈaɪs ˌkriːm/
        - generic [ref=e52]:
          - button "上一组词卡" [disabled] [ref=e53]
          - generic [ref=e54]: 1 / 6
          - button "下一组词卡" [ref=e55] [cursor=pointer]
      - region "单词寻宝" [ref=e56]:
        - heading "单词寻宝" [level=3] [ref=e59]
        - generic [ref=e60]:
          - generic [ref=e61]:
            - paragraph [ref=e62]:
              - generic [ref=e63]: 第 1 / 15 题
              - progressbar "本轮进度" [ref=e64]
            - heading "选出这个词的意思" [level=3] [ref=e80]
            - region "题目材料" [ref=e81]:
              - paragraph [ref=e82]: tired
            - generic [ref=e83]:
              - button "累的；疲倦的" [ref=e84] [cursor=pointer]
              - button "忙碌的" [ref=e85] [cursor=pointer]
              - button "口渴的" [ref=e86] [cursor=pointer]
              - button "年轻的" [ref=e87] [cursor=pointer]
          - generic [ref=e88]:
            - region "答题反馈" [ref=e89]:
              - status [ref=e90]
            - group "作答操作" [ref=e91]:
              - button "检查答案" [disabled] [ref=e92]
    - generic [ref=e93]:
      - generic [ref=e94]:
        - heading "跟着故事走" [level=2] [ref=e95]
        - generic "本关 0 / 1 颗星" [ref=e96]: ☆
      - region "公园小剧场" [ref=e97]:
        - heading "公园小剧场" [level=3] [ref=e100]
        - generic [ref=e101]:
          - group "妈妈和两个孩子在公园长椅旁" [ref=e102]:
            - paragraph [ref=e103]: 公园
            - generic [ref=e104]:
              - img "妈妈关心站在长椅旁的两个孩子" [ref=e105]
              - generic [ref=e106]:
                - generic [ref=e107]: 妈妈
                - generic [ref=e109]: 女孩
                - generic [ref=e111]: 男孩
          - generic [ref=e113]:
            - log "课文对话" [ref=e114]:
              - paragraph [ref=e116]: Why do the children thank their mother?
            - status "尚未开始阅读" [ref=e117]
            - button "开始看课文" [ref=e119] [cursor=pointer]
      - region "故事小侦探" [ref=e120]:
        - heading "故事小侦探" [level=3] [ref=e123]
        - button "先看故事" [ref=e125] [cursor=pointer]
    - generic [ref=e126]:
      - generic [ref=e127]:
        - heading "发现身边的事物" [level=2] [ref=e128]
        - generic "本关 0 / 1 颗星" [ref=e129]: ☆
      - region "语法小工坊" [ref=e130]:
        - heading "语法小工坊" [level=3] [ref=e133]
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e136]:
              - paragraph [ref=e137]:
                - generic [ref=e138]: 第 1 / 16 题
                - progressbar "本轮进度" [ref=e139]
              - region "短示范" [ref=e156]:
                - generic [ref=e157]:
                  - paragraph [ref=e158]: There is a cat in the park.
                  - generic [ref=e159]: 公园里有一只猫。there be说明某处存在什么。
              - heading "这条记录说明了什么？" [level=3] [ref=e160]
            - region "题目材料" [ref=e161]:
              - paragraph [ref=e162]: There are two children by the bench.
              - paragraph [ref=e163]: by the bench：在长椅旁。
            - group "选择回应" [ref=e164]:
              - button "两个孩子拥有一张长椅。" [ref=e165] [cursor=pointer]
              - button "长椅旁没有孩子。" [ref=e166] [cursor=pointer]
              - button "长椅旁有两个孩子。" [ref=e167] [cursor=pointer]
          - generic [ref=e168]:
            - region "答题反馈" [ref=e169]:
              - status [ref=e170]
            - group "作答操作" [ref=e171]:
              - button "检查答案" [disabled] [ref=e172]
        - group [ref=e173]:
          - generic "语法小参考 ＋" [ref=e174] [cursor=pointer]
    - generic [ref=e175]:
      - generic [ref=e176]:
        - heading "把情况说清楚" [level=2] [ref=e177]
        - generic "本关 0 / 1 颗星" [ref=e178]: ☆
      - region "公园小帮手" [ref=e179]:
        - heading "公园小帮手" [level=3] [ref=e182]
        - generic [ref=e183]:
          - generic [ref=e184]:
            - generic [ref=e185]:
              - paragraph [ref=e186]:
                - generic [ref=e187]: 第 1 / 8 题
                - progressbar "本轮进度" [ref=e188]
              - heading "把每个短语和这里的意思配好" [level=3] [ref=e197]
              - note [ref=e198]: 选好表达，再检查。
            - group "选择回应" [ref=e199]:
              - generic [ref=e200]:
                - group "英文" [ref=e201]:
                  - button "old hats" [ref=e202] [cursor=pointer]:
                    - generic [ref=e203]: "1"
                  - button "old men" [ref=e205] [cursor=pointer]:
                    - generic [ref=e206]: "2"
                  - button "short trousers" [ref=e208] [cursor=pointer]:
                    - generic [ref=e209]: "3"
                  - button "short men" [ref=e211] [cursor=pointer]:
                    - generic [ref=e212]: "4"
                - group "这里的意思" [ref=e214]:
                  - button "年老的男士" [disabled] [ref=e215]:
                    - generic [ref=e216]: –
                  - button "矮个男士" [disabled] [ref=e218]:
                    - generic [ref=e219]: –
                  - button "旧帽子" [disabled] [ref=e221]:
                    - generic [ref=e222]: –
                  - button "短的裤子" [disabled] [ref=e224]:
                    - generic [ref=e225]: –
              - paragraph [ref=e227]: 已配 0 / 4 对
          - generic [ref=e228]:
            - region "答题反馈" [ref=e229]:
              - status [ref=e230]
            - group "作答操作" [ref=e231]:
              - button "检查答案" [disabled] [ref=e232]
        - group [ref=e233]:
          - generic "课本小参考 · 第20课 ＋" [ref=e234] [cursor=pointer]
    - generic [ref=e235]:
      - generic [ref=e236]:
        - heading "再出发" [level=2] [ref=e237]
        - generic "本关 0 / 1 颗星" [ref=e238]: ☆
      - region "综合挑战" [ref=e239]:
        - heading "综合挑战" [level=3] [ref=e242]
        - generic [ref=e243]:
          - generic [ref=e244]:
            - generic [ref=e245]:
              - paragraph [active] [ref=e246]:
                - generic [ref=e247]: 第 13 / 23 题
                - progressbar "本轮进度" [ref=e248]
              - heading "把清单上的物品记录下来" [level=3] [ref=e272]
              - region "题目材料" [ref=e273]:
                - paragraph [ref=e274]: 清单：椅子上一顶帽子，地板上两个袋子，杯里一些牛奶。
                - paragraph [ref=e275]: floor：地板；milk：牛奶。
              - note [ref=e276]: 选好表达，再检查。
            - group "选择回应" [ref=e277]:
              - group "第1处填空" [ref=e278]:
                - paragraph [ref=e279]:
                  - text: There
                  - generic [ref=e280]: ___
                  - text: a hat on the chair.
                - generic [ref=e281]:
                  - button "is" [ref=e282] [cursor=pointer]
                  - button "are" [ref=e283] [cursor=pointer]
              - group "第2处填空" [ref=e284]:
                - paragraph [ref=e285]:
                  - text: There
                  - generic [ref=e286]: ___
                  - text: two bags on the floor.
                - generic [ref=e287]:
                  - button "is" [ref=e288] [cursor=pointer]
                  - button "are" [ref=e289] [cursor=pointer]
              - group "第3处填空" [ref=e290]:
                - paragraph [ref=e291]:
                  - text: There
                  - generic [ref=e292]: ___
                  - text: some milk in the glass.
                - generic [ref=e293]:
                  - button "is" [ref=e294] [cursor=pointer]
                  - button "are" [ref=e295] [cursor=pointer]
          - generic [ref=e296]:
            - region "答题反馈" [ref=e297]:
              - status [ref=e298]
            - group "作答操作" [ref=e299]:
              - button "检查答案" [disabled] [ref=e300]
      - region "我的单元纪念卡" [ref=e301]:
        - heading "我的单元纪念卡" [level=3] [ref=e304]
        - generic [ref=e305]:
          - article "我的单元纪念卡" [ref=e306]:
            - paragraph [ref=e307]: 灿然英语工作室
            - heading "公园观察小达人" [level=3] [ref=e308]
            - paragraph [ref=e309]: 登录后显示姓名
            - group "已获得 0 / 5 颗星" [ref=e310]
            - img "妈妈和两个孩子相视微笑，孩子们各拿着一份冰淇淋"
            - paragraph [ref=e316]:
              - generic [ref=e317]: Lesson 19–20
          - generic [ref=e318]:
            - button "保存动图" [disabled] [ref=e319]
            - link "返回课程" [ref=e320] [cursor=pointer]:
              - /url: http://127.0.0.1:4308/
          - status [ref=e321]
          - group [ref=e322]:
            - generic "星星进度" [ref=e323] [cursor=pointer]
        - group [ref=e324]:
          - generic "课后练习纸 ＋" [ref=e325] [cursor=pointer]
  - text: ·
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
> 8  |   const fills=room.getByRole('group',{name:/第\d+处填空/});expect(await fills.count()).toBeLessThanOrEqual(2);
     |                                                                                    ^ Error: expect(received).toBeLessThanOrEqual(expected)
  9  |   await expect(room.locator('.grammar-model')).toHaveCount(0);
  10 |   if([3,4,7,13].includes(index))await room.screenshot({path:info.outputPath('exam-'+(index+1)+'-unanswered.png')});
  11 |  }});
  12 | });
  13 | test('主语be和形容词两道旧题补短示范；实际帮助入手记',async({page},info)=>{
  14 |  test.setTimeout(120000);await page.setViewportSize({width:320,height:568});await page.goto('/unit19-20/#learn/grammar');const room=page.locator('.stage-grammar');
  15 |  for(let i=0;i<14;i++){await select(room,ANSWERS.grammar[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
  16 |  for(let i=14;i<16;i++){
  17 |   await expect(room.getByRole('region',{name:'短示范',exact:true})).toBeVisible();
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