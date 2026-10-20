# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit21-22-teaching-review.spec.js >> 当前45题版交接错答和语法草稿、阅读词卡及两个分页原样续做
- Location: tests\e2e\unit21-22-teaching-review.spec.js:14:1

# Error details

```
TimeoutError: locator.click: Timeout 7000ms exceeded.
Call log:
  - waiting for locator('.stage-grammar').getByRole('group', { name: '第1处填空', exact: true }).getByRole('button', { name: 'her', exact: true })

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
        - link "先认识物品" [ref=e11] [cursor=pointer]:
          - /url: "#l1"
        - link "帮简找对书" [ref=e12] [cursor=pointer]:
          - /url: "#l2"
        - link "看清递给谁" [ref=e13] [cursor=pointer]:
          - /url: "#l3"
        - link "把要求说清楚" [ref=e14] [cursor=pointer]:
          - /url: "#l4"
        - link "完成小委托" [ref=e15] [cursor=pointer]:
          - /url: "#l5"
  - generic [ref=e16]:
    - img "男士拿着刚接过的红书，简双手空着，两人相视微笑" [ref=e18]
    - generic [ref=e19]:
      - paragraph [ref=e20]: 新概念英语 · Lesson 21–22
      - heading "寻物交接站" [level=1] [ref=e21]
      - paragraph [ref=e22]: 帮简确认哪一本、递给谁，把物品交到对的人手中。
      - button "继续冒险" [ref=e23] [cursor=pointer]
  - main [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "先认识物品" [level=2] [ref=e27]
        - generic "本关 0 / 1 颗星" [ref=e28]: ☆
      - region "寻物小图鉴" [ref=e29]:
        - heading "寻物小图鉴" [level=3] [ref=e32]
        - generic [ref=e33]:
          - button "give" [ref=e34] [cursor=pointer]:
            - strong [ref=e35]: give
            - generic [ref=e36]: /ɡɪv/
            - generic [ref=e37]: Give me a book, please.
          - button "one" [ref=e38] [cursor=pointer]:
            - strong [ref=e39]: one
            - generic [ref=e40]: /wʌn/
            - generic [ref=e41]: This one?
          - button "which" [ref=e42] [cursor=pointer]:
            - strong [ref=e43]: which
            - generic [ref=e44]: /wɪtʃ/
            - generic [ref=e45]: Which book?
          - button "book" [ref=e46] [cursor=pointer]:
            - strong [ref=e47]: book
            - generic [ref=e48]: /bʊk/
          - button "red" [ref=e49] [cursor=pointer]:
            - strong [ref=e50]: red
            - generic [ref=e51]: /red/
          - button "blue" [ref=e52] [cursor=pointer]:
            - strong [ref=e53]: blue
            - generic [ref=e54]: /bluː/
        - generic [ref=e55]:
          - button "上一组词卡" [disabled] [ref=e56]
          - generic [ref=e57]: 1 / 6
          - button "下一组词卡" [ref=e58] [cursor=pointer]
      - region "单词寻宝" [ref=e59]:
        - heading "单词寻宝" [level=3] [ref=e62]
        - generic [ref=e63]:
          - generic [ref=e64]:
            - paragraph [ref=e65]:
              - generic [ref=e66]: 第 1 / 10 题
              - progressbar "本轮进度" [ref=e67]
            - heading "give 在这句话里表示什么？" [level=3] [ref=e78]
            - region "题目材料" [ref=e79]:
              - paragraph [ref=e80]: Give me a book, please.
            - generic [ref=e81]:
              - button "阅读" [ref=e82] [cursor=pointer]
              - button "给；递给" [ref=e83] [cursor=pointer]
              - button "寻找" [ref=e84] [cursor=pointer]
              - button "看" [ref=e85] [cursor=pointer]
          - generic [ref=e86]:
            - region "答题反馈" [ref=e87]:
              - status [ref=e88]
            - group "作答操作" [ref=e89]:
              - button "检查答案" [disabled] [ref=e90]
    - generic [ref=e91]:
      - generic [ref=e92]:
        - heading "帮简找对书" [level=2] [ref=e93]
        - generic "本关 0 / 1 颗星" [ref=e94]: ☆
      - region "找书小剧场" [ref=e95]:
        - heading "找书小剧场" [level=3] [ref=e98]
        - generic [ref=e99]:
          - group "男士与简在书桌旁确认和交接书本" [ref=e100]:
            - paragraph [ref=e101]: 书桌旁
            - generic [ref=e102]:
              - img "男士和简双手空着，桌上放着两本书" [ref=e103]
              - generic [ref=e104]:
                - generic [ref=e105]: 男士
                - generic [ref=e107]: 简（Jane）
          - generic [ref=e109]:
            - log "课文对话" [ref=e110]:
              - paragraph [ref=e112]: Which book does the man want?
            - status "尚未开始阅读" [ref=e113]
            - button "开始看课文" [ref=e115] [cursor=pointer]
      - region "故事小侦探" [ref=e116]:
        - heading "故事小侦探" [level=3] [ref=e119]
        - button "先看故事" [ref=e121] [cursor=pointer]
    - generic [ref=e122]:
      - generic [ref=e123]:
        - heading "看清递给谁" [level=2] [ref=e124]
        - generic "本关 0 / 1 颗星" [ref=e125]: ☆
      - region "语法小工坊" [ref=e126]:
        - heading "语法小工坊" [level=3] [ref=e129]
        - generic [ref=e130]:
          - generic [ref=e131]:
            - generic [ref=e132]:
              - paragraph [active] [ref=e133]:
                - generic [ref=e134]: 第 2 / 10 题
                - progressbar "本轮进度" [ref=e135]
              - region "短示范" [ref=e146]:
                - generic [ref=e147]:
                  - paragraph [ref=e148]: He is Tom. Give him a book.
                  - generic [ref=e149]: 把书递给他，he变成him。
                - generic [ref=e150]:
                  - paragraph [ref=e151]: She is Jane. Give her a book.
                  - generic [ref=e152]: 把书递给她，she变成her。
              - heading "分别把物品递给Ben和Anna" [level=3] [ref=e153]
            - region "题目材料" [ref=e154]:
              - paragraph [ref=e155]: 第一句：Ben是男士，接收盒子。
              - paragraph [ref=e156]: 第二句：Anna是女士，接收杯子。
            - group "选择回应" [ref=e157]:
              - group "第1处填空" [ref=e158]:
                - paragraph [ref=e159]:
                  - text: Give
                  - generic [ref=e160]: ___
                  - text: a box, please.
                - generic [ref=e161]:
                  - button "him" [ref=e162] [cursor=pointer]
                  - button "he" [ref=e163] [cursor=pointer]
                  - button "his" [ref=e164] [cursor=pointer]
              - group "第2处填空" [ref=e165]:
                - paragraph [ref=e166]:
                  - text: Give
                  - generic [ref=e167]: ___
                  - text: a cup, please.
                - generic [ref=e168]:
                  - button "her" [ref=e169] [cursor=pointer]
                  - button "she" [ref=e170] [cursor=pointer]
                  - button "his" [ref=e171] [cursor=pointer]
          - generic [ref=e172]:
            - region "答题反馈" [ref=e173]:
              - status [ref=e174]
            - group "作答操作" [ref=e175]:
              - button "检查答案" [disabled] [ref=e176]
        - group [ref=e177]:
          - generic "语法小参考 ＋" [ref=e178] [cursor=pointer]
    - generic [ref=e179]:
      - generic [ref=e180]:
        - heading "把要求说清楚" [level=2] [ref=e181]
        - generic "本关 0 / 1 颗星" [ref=e182]: ☆
      - region "交接小帮手" [ref=e183]:
        - heading "交接小帮手" [level=3] [ref=e186]
        - generic [ref=e187]:
          - generic [ref=e188]:
            - generic [ref=e189]:
              - paragraph [ref=e190]:
                - generic [ref=e191]: 第 1 / 7 题
                - progressbar "本轮进度" [ref=e192]
              - heading "接收者是谁？" [level=3] [ref=e200]
              - region "题目材料" [ref=e201]:
                - paragraph [ref=e202]: 几位同学站在一起，其中一位说：
                - paragraph [ref=e203]: Give us a book, please.
              - note [ref=e204]: 选好表达，再检查。
            - group "选择回应" [ref=e205]:
              - button "只有他的同伴" [ref=e206] [cursor=pointer]
              - button "说话的人和他的同伴" [ref=e207] [cursor=pointer]
              - button "只有说话的人" [ref=e208] [cursor=pointer]
          - generic [ref=e209]:
            - region "答题反馈" [ref=e210]:
              - status [ref=e211]
            - group "作答操作" [ref=e212]:
              - button "给点线索" [ref=e213] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e215]
        - group [ref=e216]:
          - generic "课本小参考 · 第22课 ＋" [ref=e217] [cursor=pointer]
    - generic [ref=e218]:
      - generic [ref=e219]:
        - heading "完成小委托" [level=2] [ref=e220]
        - generic "本关 0 / 1 颗星" [ref=e221]: ☆
      - region "综合挑战" [ref=e222]:
        - heading "综合挑战" [level=3] [ref=e225]
        - generic [ref=e226]:
          - generic [ref=e227]:
            - generic [ref=e228]:
              - paragraph [ref=e229]:
                - generic [ref=e230]: 第 1 / 16 题
                - progressbar "本轮进度" [ref=e231]
              - heading "读一读，完成交接" [level=3] [ref=e248]
              - note [ref=e249]: 选好表达，再检查。
            - group "选择回应" [ref=e250]:
              - generic [ref=e251]:
                - generic [ref=e252]: 简（Jane） 说
                - paragraph [ref=e254]: Give me a bottle, please. The small one.
              - generic [ref=e255]:
                - generic [ref=e256]:
                  - paragraph [ref=e257]: 选物品
                  - group "待选物品" [ref=e258]:
                    - button "大瓶子" [ref=e259] [cursor=pointer]:
                      - img "大瓶子" [ref=e261]
                      - generic [ref=e262]: 甲
                    - button "小叉子" [ref=e263] [cursor=pointer]:
                      - img "小叉子" [ref=e265]
                      - generic [ref=e266]: 乙
                    - button "小瓶子" [ref=e267] [cursor=pointer]:
                      - img "小瓶子" [ref=e269]
                      - generic [ref=e270]: 丙
                - generic [ref=e271]:
                  - paragraph [ref=e272]: 递给谁
                  - group "接收者" [ref=e273]:
                    - button "男士" [ref=e274] [cursor=pointer]
                    - button "简（Jane）" [ref=e278] [cursor=pointer]
          - generic [ref=e282]:
            - region "答题反馈" [ref=e283]:
              - status [ref=e284]
            - group "作答操作" [ref=e285]:
              - button "给点线索" [ref=e286] [cursor=pointer]
              - button "检查答案" [disabled] [ref=e288]
      - region "我的单元纪念卡" [ref=e289]:
        - heading "我的单元纪念卡" [level=3] [ref=e292]
        - generic [ref=e293]:
          - article "我的单元纪念卡" [ref=e294]:
            - paragraph [ref=e295]: 灿然英语工作室
            - heading "细心交接小达人" [level=3] [ref=e296]
            - paragraph [ref=e297]: 登录后显示姓名
            - group "已获得 0 / 5 颗星" [ref=e298]
            - img "男士拿着刚接过的红书，简双手空着，两人相视微笑"
            - paragraph [ref=e304]:
              - generic [ref=e305]: Lesson 21–22
          - generic [ref=e306]:
            - button "保存动图" [disabled] [ref=e307]
            - link "返回课程" [ref=e308] [cursor=pointer]:
              - /url: http://127.0.0.1:4308/
          - status [ref=e309]
          - group [ref=e310]:
            - generic "星星进度" [ref=e311] [cursor=pointer]
        - group [ref=e312]:
          - generic "课后练习纸 ＋" [ref=e313] [cursor=pointer]
  - text: ·
```

# Test source

```ts
  1  | 'use strict';
  2  | const {expect}=require('@playwright/test');
  3  | // Frozen predecessor answers navigate already-reviewed content. New expectations
  4  | // were transcribed from the v4 teaching draft; never read answers from the page.
  5  | const CASES=require('./units1-30-task-cases.json');
  6  | async function select(room,answer){
  7  |  if(answer?.scene)await room.getByRole('group',{name:'在场景中选择',exact:true}).getByRole('button',{name:answer.scene,exact:true}).click();
> 8  |  else if(answer?.fills){for(let i=0;i<answer.fills.length;i++)await room.getByRole('group',{name:'第'+(i+1)+'处填空',exact:true}).getByRole('button',{name:answer.fills[i],exact:true}).click();}
     |                                                                                                                                                                                     ^ TimeoutError: locator.click: Timeout 7000ms exceeded.
  9  |  else if(answer?.pairs){for(const[en,cn]of answer.pairs){await room.getByRole('group',{name:answer.leftLabel||'英文',exact:true}).getByRole('button',{name:en,exact:true}).click();await room.getByRole('group',{name:answer.rightLabel||'词义',exact:true}).getByRole('button',{name:cn,exact:true}).click();}}
  10 |  else if(answer?.object){await room.getByRole('group',{name:'待选物品',exact:true}).getByRole('button',{name:answer.object,exact:true}).click();await room.getByRole('group',{name:'接收者',exact:true}).getByRole('button',{name:answer.recipient,exact:true}).click();}
  11 |  else if(Array.isArray(answer)){
  12 |   // Word-bank retries retain the learner's assembly; undo it through the UI.
  13 |   const chosen=room.getByRole('group',{name:'已选词块',exact:true}).getByRole('button');
  14 |   for(let remaining=await chosen.count();remaining>0;remaining--)await chosen.first().click();
  15 |   const bank=room.getByRole('group',{name:'待选词块',exact:true});for(const token of answer)await bank.getByRole('button',{name:token,exact:true}).and(bank.locator('button:enabled')).first().click();
  16 |  }
  17 |  else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
  18 | }
  19 | async function story(page,pair,base=''){
  20 |  await page.goto(`${base}/unit${pair}/#learn/text`);const room=page.locator('.stage-text');
  21 |  await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:30000});
  22 |  await expect(room).toBeVisible();
  23 |  const voice=pair==='1-2',start=voice?'开始听课文':'开始看课文',finish=voice?'完成课文学习':'完成课文';
  24 |  if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
  25 |  if(await room.getByRole('button',{name:start,exact:true}).isVisible())await room.getByRole('button',{name:start,exact:true}).click();
  26 |  while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
  27 |  await room.getByRole('button',{name:finish,exact:true}).click();
  28 | }
  29 | function currentGroup(pair,id){return pair==='5-6'?({refer:'introduce',articles:'introduce',choice:'cars',trans:'cars'}[id]||id):id;}
  30 | function answers(pair,group,old=false){
  31 |  if(!old&&pair==='3-4'){
  32 |   const {GRAMMAR,TRANSFER}=require('./unit34-grammar');
  33 |   if(group==='reply')return GRAMMAR.map((answer,i)=>({id:'grammar-'+i,answer,fresh:true}));
  34 |   if(group==='exam')return [...CASES[pair].old.exam,...TRANSFER.map((answer,i)=>({id:'transfer-'+i,answer,fresh:true}))];
  35 |  }
  36 |  if(!old&&pair==='5-6'&&['introduce','cars'].includes(group))return (group==='introduce'?['refer','articles']:['choice','trans']).flatMap(id=>answers(pair,id));
  37 |  const c=CASES[pair];return (!old&&c.changes.find(x=>x.group===group)?.answers)||c.old[group];
  38 | }
  39 | async function activity(page,pair,group,{base='',old=false,capture,wrongNew=false,hintNew=false,keepAward=false}={}){
  40 |  await require('./reward-dialog').handleRewardDialog(page,keepAward);
  41 |  if(!old)group=currentGroup(pair,group);
  42 |  await page.goto(`${base}/unit${pair}/#learn/${group}`);const room=page.locator('.stage-'+group),items=answers(pair,group,old);
  43 |  await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:30000});
  44 |  await expect(room).toBeVisible();
  45 |  if(await room.locator('.practice-finish').isVisible())return;
  46 |  const copy=await room.locator('.progress-copy').innerText();const first=Number(copy.match(/第 (\d+)/)[1])-1;
  47 |  for(let i=first;i<items.length;i++){
  48 |   const q=items[i],check=room.getByRole('button',{name:'检查答案',exact:true});
  49 |   if(await check.isVisible()){
  50 |    await expect(check).toBeDisabled();
  51 |    if(q.audio)await room.getByRole('button',{name:'听一遍',exact:true}).click();
  52 |    if(q.fresh&&capture)await capture(room,q,'blank');
  53 |    if(q.fresh&&hintNew){
  54 |     const hint=room.getByRole('button',{name:'给点线索',exact:true});
  55 |     if(await hint.isVisible()){
  56 |      const actions=room.getByRole('group',{name:'作答操作',exact:true});
  57 |      const before=await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY);
  58 |      await hint.click();await expect(check).toBeDisabled();
  59 |      await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  60 |      await expect(room.locator('.practice-options .is-correct')).toHaveCount(0);
  61 |      expect(Math.abs(await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY)-before)).toBeLessThanOrEqual(2);
  62 |     }
  63 |    }
  64 |    if(q.fresh&&wrongNew){
  65 |     const answer=q.answer;
  66 |     if(answer?.scene){const choices=room.getByRole('group',{name:'在场景中选择',exact:true});const labels=await choices.getByRole('button').evaluateAll(bs=>bs.map(b=>b.getAttribute('aria-label')));await choices.getByRole('button',{name:labels.find(x=>x!==answer.scene),exact:true}).click();}
  67 |     else if(answer?.pairs){await select(room,{...answer,pairs:answer.pairs.map(([en,cn],j)=>[en,answer.pairs[(j+1)%answer.pairs.length][1]])});}
  68 |     else if(answer?.fills){for(let j=0;j<answer.fills.length;j++){const choices=room.getByRole('group',{name:'第'+(j+1)+'处填空',exact:true});const wrong=(await choices.getByRole('button').allTextContents()).find(t=>t!==answer.fills[j]);await choices.getByRole('button',{name:wrong,exact:true}).click();};}
  69 |     else if(Array.isArray(answer))await select(room,[...answer].reverse());
  70 |     else await room.locator('.practice-options').getByRole('button').filter({hasNotText:answer}).first().click();
  71 |     await check.click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  72 |     await expect(room.locator('.is-correct')).toHaveCount(0);if(capture)await capture(room,q,'wrong');
  73 |     await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  74 |     await room.getByRole('button',{name:'再试一次',exact:true}).click();
  75 |    }
  76 |    await select(room,q.answer);await expect(check).toBeEnabled();
  77 |    if(q.fresh&&capture)await capture(room,q,'selected');
  78 |    await check.click();
  79 |   }
  80 |   await expect(room.getByRole('status')).toHaveText('答对了！');
  81 |   await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  82 |   if(q.fresh&&capture)await capture(room,q,'correct');
  83 |   await room.getByRole('button',{name:i===items.length-1?(group==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
  84 |  }
  85 |  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
  86 |  if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');
  87 | }
  88 | module.exports={CASES,select,story,answers,activity,currentGroup};
  89 | 
```