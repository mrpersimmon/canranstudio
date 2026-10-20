# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit11-12-fivezones.spec.js >> 真实账号全流程：五颗星同步、纪念册放大、GIF、跨设备与离线恢复
- Location: tests\login\unit11-12-fivezones.spec.js:43:1

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('.stage-grammar').getByRole('group', { name: '第1处填空', exact: true }).getByRole('button', { name: 'are', exact: true })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - link "灿然英语工作室" [ref=e3] [cursor=pointer]:
      - /url: /lesson/
  - main [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - paragraph [ref=e7]: 灿然英语工作室
        - heading "班级管理" [level=1] [ref=e8]
      - generic [ref=e9]:
        - button "老师管理" [ref=e10] [cursor=pointer]
        - button "学习进度" [ref=e11] [cursor=pointer]
        - button "退出管理" [ref=e12] [cursor=pointer]
    - generic [ref=e13]:
      - generic [ref=e14]:
        - heading "我的班级" [level=2] [ref=e15]
        - generic [ref=e16]:
          - button "所有学生" [ref=e17] [cursor=pointer]
          - button "管理 线索验收班" [ref=e18] [cursor=pointer]: 线索验收班
          - button "管理 只开放旧课班" [ref=e19] [cursor=pointer]: 只开放旧课班
          - button "管理 线索完整验收班" [ref=e20] [cursor=pointer]: 线索完整验收班
        - generic [ref=e21]:
          - generic [ref=e22]: 新班级名称
          - textbox "新班级名称" [ref=e23]
          - button "创建班级" [ref=e24] [cursor=pointer]
      - generic [ref=e25]:
        - text: 查找学生（姓名或学号）
        - searchbox "查找学生（姓名或学号）" [ref=e26]
      - generic [ref=e27]:
        - generic [ref=e28]:
          - heading "线索完整验收班 · 班级设置" [level=2] [ref=e29]
          - link "预览这个班" [ref=e30] [cursor=pointer]:
            - /url: /lesson/?preview=b1d96fa7-3706-4293-8a4e-d2b3af987945
        - generic [ref=e31]:
          - paragraph [ref=e32]: 负责老师：尚未分配
          - button "分配老师" [ref=e33] [cursor=pointer]
        - generic [ref=e34]:
          - generic [ref=e35]: 班级名称
          - generic [ref=e36]:
            - textbox "班级名称" [ref=e37]: 线索完整验收班
            - button "保存班级名称" [ref=e38] [cursor=pointer]
        - generic [ref=e39]:
          - heading "开放课程" [level=3] [ref=e40]
          - generic [ref=e41]:
            - button "全选课程" [ref=e42] [cursor=pointer]
            - generic [ref=e43]: 已选 1 / 72 门课程
          - generic [ref=e44]:
            - generic [ref=e45]:
              - checkbox "Lesson 1–2 礼貌小帮手" [ref=e46]
              - text: Lesson 1–2 礼貌小帮手
            - generic [ref=e47]:
              - checkbox "Lesson 3–4 雨伞认领小帮手" [ref=e48]
              - text: Lesson 3–4 雨伞认领小帮手
            - generic [ref=e49]:
              - checkbox "Lesson 5–6 新朋友见面会" [ref=e50]
              - text: Lesson 5–6 新朋友见面会
            - generic [ref=e51]:
              - checkbox "Lesson 7–8 新朋友采访站" [ref=e52]
              - text: Lesson 7–8 新朋友采访站
            - generic [ref=e53]:
              - checkbox "Lesson 9–10 街角问候站" [ref=e54]
              - text: Lesson 9–10 街角问候站
            - generic [ref=e55]:
              - checkbox "Lesson 11–12 失物招领小侦探" [checked] [ref=e56]
              - text: Lesson 11–12 失物招领小侦探
            - generic [ref=e57]:
              - checkbox "Lesson 13–14 新衣配色屋" [ref=e58]
              - text: Lesson 13–14 新衣配色屋
            - generic [ref=e59]:
              - checkbox "Lesson 15–16 护照小检查站" [ref=e60]
              - text: Lesson 15–16 护照小检查站
            - generic [ref=e61]:
              - checkbox "Lesson 17–18 办公室探访记" [ref=e62]
              - text: Lesson 17–18 办公室探访记
            - generic [ref=e63]:
              - checkbox "Lesson 19–20 冰淇淋休息站" [ref=e64]
              - text: Lesson 19–20 冰淇淋休息站
            - generic [ref=e65]:
              - checkbox "Lesson 21–22 寻物交接站" [ref=e66]
              - text: Lesson 21–22 寻物交接站
            - generic [ref=e67]:
              - checkbox "Lesson 23–24 房间寻物队" [ref=e68]
              - text: Lesson 23–24 房间寻物队
            - generic [ref=e69]:
              - checkbox "Lesson 25–26 厨房探访记" [ref=e70]
              - text: Lesson 25–26 厨房探访记
            - generic [ref=e71]:
              - checkbox "Lesson 27–28 客厅发现之旅" [ref=e72]
              - text: Lesson 27–28 客厅发现之旅
            - generic [ref=e73]:
              - checkbox "Lesson 29–30 房间整理行动" [ref=e74]
              - text: Lesson 29–30 房间整理行动
            - generic [ref=e75]:
              - checkbox "Lesson 31–32 花园观察小队" [ref=e76]
              - text: Lesson 31–32 花园观察小队
            - generic [ref=e77]:
              - checkbox "Lesson 33–34 晴天河畔发现之旅" [ref=e78]
              - text: Lesson 33–34 晴天河畔发现之旅
            - generic [ref=e79]:
              - checkbox "Lesson 35–36 村庄相册探险" [ref=e80]
              - text: Lesson 35–36 村庄相册探险
            - generic [ref=e81]:
              - checkbox "Lesson 37–38 书架制作小工坊" [ref=e82]
              - text: Lesson 37–38 书架制作小工坊
            - generic [ref=e83]:
              - checkbox "Lesson 39–40 花瓶安放小帮手" [ref=e84]
              - text: Lesson 39–40 花瓶安放小帮手
            - generic [ref=e85]:
              - checkbox "Lesson 41–42 购物袋里的发现" [ref=e86]
              - text: Lesson 41–42 购物袋里的发现
            - generic [ref=e87]:
              - checkbox "Lesson 43–44 茶具躲猫猫" [ref=e88]
              - text: Lesson 43–44 茶具躲猫猫
            - generic [ref=e89]:
              - checkbox "Lesson 45–46 一封难读的信" [ref=e90]
              - text: Lesson 45–46 一封难读的信
            - generic [ref=e91]:
              - checkbox "Lesson 47–48 一杯咖啡的心意" [ref=e92]
              - text: Lesson 47–48 一杯咖啡的心意
            - generic [ref=e93]:
              - checkbox "Lesson 49–50 晚餐采购大冒险" [ref=e94]
              - text: Lesson 49–50 晚餐采购大冒险
            - generic [ref=e95]:
              - checkbox "Lesson 51–52 希腊四季明信片" [ref=e96]
              - text: Lesson 51–52 希腊四季明信片
            - generic [ref=e97]:
              - checkbox "Lesson 53–54 天气观察站" [ref=e98]
              - text: Lesson 53–54 天气观察站
            - generic [ref=e99]:
              - checkbox "Lesson 55–56 索耶家的一天" [ref=e100]
              - text: Lesson 55–56 索耶家的一天
            - generic [ref=e101]:
              - checkbox "Lesson 57–58 今天不一样" [ref=e102]
              - text: Lesson 57–58 今天不一样
            - generic [ref=e103]:
              - checkbox "Lesson 59–60 别忘了找零" [ref=e104]
              - text: Lesson 59–60 别忘了找零
            - generic [ref=e105]:
              - checkbox "Lesson 61–62 给 Jimmy 请医生" [ref=e106]
              - text: Lesson 61–62 给 Jimmy 请医生
            - generic [ref=e107]:
              - checkbox "Lesson 63–64 Jimmy 好些了" [ref=e108]
              - text: Lesson 63–64 Jimmy 好些了
            - generic [ref=e109]:
              - checkbox "Lesson 65–66 Jill 的晚间约定" [ref=e110]
              - text: Lesson 65–66 Jill 的晚间约定
            - generic [ref=e111]:
              - checkbox "Lesson 67–68 街角的周末消息" [ref=e112]
              - text: Lesson 67–68 街角的周末消息
            - generic [ref=e113]:
              - checkbox "Lesson 69–70 赛车日的时光相册" [ref=e114]
              - text: Lesson 69–70 赛车日的时光相册
            - generic [ref=e115]:
              - checkbox "Lesson 71–72 电话里的昨天" [ref=e116]
              - text: Lesson 71–72 电话里的昨天
            - generic [ref=e117]:
              - checkbox "Lesson 73–74 街角的短语手册" [ref=e118]
              - text: Lesson 73–74 街角的短语手册
            - generic [ref=e119]:
              - checkbox "Lesson 75–76 鞋店里的时间线索" [ref=e120]
              - text: Lesson 75–76 鞋店里的时间线索
            - generic [ref=e121]:
              - checkbox "Lesson 77–78 诊所里的预约时间" [ref=e122]
              - text: Lesson 77–78 诊所里的预约时间
            - generic [ref=e123]:
              - checkbox "Lesson 79–80 一起写购物清单" [ref=e124]
              - text: Lesson 79–80 一起写购物清单
            - generic [ref=e125]:
              - checkbox "Lesson 81–82 晚餐前的小意外" [ref=e126]
              - text: Lesson 81–82 晚餐前的小意外
            - generic [ref=e127]:
              - checkbox "Lesson 83–84 出发前的行李箱" [ref=e128]
              - text: Lesson 83–84 出发前的行李箱
            - generic [ref=e129]:
              - checkbox "Lesson 85–86 电影院外聊巴黎" [ref=e130]
              - text: Lesson 85–86 电影院外聊巴黎
            - generic [ref=e131]:
              - checkbox "Lesson 87–88 修理厂里的进度单" [ref=e132]
              - text: Lesson 87–88 修理厂里的进度单
            - generic [ref=e133]:
              - checkbox "Lesson 89–90 看房时的时间线索" [ref=e134]
              - text: Lesson 89–90 看房时的时间线索
            - generic [ref=e135]:
              - checkbox "Lesson 91–92 邻居们的明日约定" [ref=e136]
              - text: Lesson 91–92 邻居们的明日约定
            - generic [ref=e137]:
              - checkbox "Lesson 93–94 新邻居的飞行手记" [ref=e138]
              - text: Lesson 93–94 新邻居的飞行手记
            - generic [ref=e139]:
              - checkbox "Lesson 95–96 车站里的时间谜题" [ref=e140]
              - text: Lesson 95–96 车站里的时间谜题
            - generic [ref=e141]:
              - checkbox "Lesson 97–98 蓝色箱子的归属" [ref=e142]
              - text: Lesson 97–98 蓝色箱子的归属
            - generic [ref=e143]:
              - checkbox "Lesson 99–100 把话传清楚" [ref=e144]
              - text: Lesson 99–100 把话传清楚
            - generic [ref=e145]:
              - checkbox "Lesson 101–102 来自Jimmy的明信片" [ref=e146]
              - text: Lesson 101–102 来自Jimmy的明信片
            - generic [ref=e147]:
              - checkbox "Lesson 103–104 考场外的对话" [ref=e148]
              - text: Lesson 103–104 考场外的对话
            - generic [ref=e149]:
              - checkbox "Lesson 105–106 办公室的小礼物" [ref=e150]
              - text: Lesson 105–106 办公室的小礼物
            - generic [ref=e151]:
              - checkbox "Lesson 107–108 服装店里的比较" [ref=e152]
              - text: Lesson 107–108 服装店里的比较
            - generic [ref=e153]:
              - checkbox "Lesson 109–110 咖啡桌上的数量" [ref=e154]
              - text: Lesson 109–110 咖啡桌上的数量
            - generic [ref=e155]:
              - checkbox "Lesson 111–112 电视机店里的比较" [ref=e156]
              - text: Lesson 111–112 电视机店里的比较
            - generic [ref=e157]:
              - checkbox "Lesson 113–114 公共汽车上的零钱" [ref=e158]
              - text: Lesson 113–114 公共汽车上的零钱
            - generic [ref=e159]:
              - checkbox "Lesson 115–116 敲门后的花园聚会" [ref=e160]
              - text: Lesson 115–116 敲门后的花园聚会
            - generic [ref=e161]:
              - checkbox "Lesson 117–118 早餐时的意外" [ref=e162]
              - text: Lesson 117–118 早餐时的意外
            - generic [ref=e163]:
              - checkbox "Lesson 119–120 夜里的声音" [ref=e164]
              - text: Lesson 119–120 夜里的声音
            - generic [ref=e165]:
              - checkbox "Lesson 121–122 书店里的帽子" [ref=e166]
              - text: Lesson 121–122 书店里的帽子
            - generic [ref=e167]:
              - checkbox "Lesson 123–124 旅行照片里的故事" [ref=e168]
              - text: Lesson 123–124 旅行照片里的故事
            - generic [ref=e169]:
              - checkbox "Lesson 125–126 雨中的双人茶时光" [ref=e170]
              - text: Lesson 125–126 雨中的双人茶时光
            - generic [ref=e171]:
              - checkbox "Lesson 127–128 咖啡馆里的辨认" [ref=e172]
              - text: Lesson 127–128 咖啡馆里的辨认
            - generic [ref=e173]:
              - checkbox "Lesson 129–130 路边的一次提醒" [ref=e174]
              - text: Lesson 129–130 路边的一次提醒
            - generic [ref=e175]:
              - checkbox "Lesson 131–132 客厅里的假期计划" [ref=e176]
              - text: Lesson 131–132 客厅里的假期计划
            - generic [ref=e177]:
              - checkbox "Lesson 133–134 机场采访与一份报纸" [ref=e178]
              - text: Lesson 133–134 机场采访与一份报纸
            - generic [ref=e179]:
              - checkbox "Lesson 135–136 饭店里的最新消息" [ref=e180]
              - text: Lesson 135–136 饭店里的最新消息
            - generic [ref=e181]:
              - checkbox "Lesson 137–138 美好梦想里的如果" [ref=e182]
              - text: Lesson 137–138 美好梦想里的如果
            - generic [ref=e183]:
              - checkbox "Lesson 139–140 电话那头的问话" [ref=e184]
              - text: Lesson 139–140 电话那头的问话
            - generic [ref=e185]:
              - checkbox "Lesson 141–142 Sally的火车初体验" [ref=e186]
              - text: Lesson 141–142 Sally的火车初体验
            - generic [ref=e187]:
              - checkbox "Lesson 143–144 树林里的告示牌" [ref=e188]
              - text: Lesson 143–144 树林里的告示牌
          - button "保存开放课程" [ref=e189] [cursor=pointer]
      - generic [ref=e190]:
        - generic [ref=e191]:
          - heading "班级学生" [level=2] [ref=e192]
          - button "打印全班账号" [ref=e193] [cursor=pointer]
        - generic [ref=e194]:
          - generic [ref=e195]: 学生姓名或课堂称呼，每行一位
          - textbox "学生姓名或课堂称呼，每行一位" [ref=e196]
          - button "核对姓名拼音" [ref=e197] [cursor=pointer]
        - generic [ref=e199]:
          - generic [ref=e200]:
            - generic [ref=e201] [cursor=pointer]:
              - checkbox "全选当前列表（1 人）" [ref=e202]
              - text: 全选当前列表（1 人）
            - generic [ref=e203]: 已选 0 人
            - generic [ref=e204]:
              - button "重置所选密码" [disabled] [ref=e205]
              - button "打印所选账号" [disabled] [ref=e206]
          - generic [ref=e207]:
            - generic [ref=e208] [cursor=pointer]:
              - checkbox "选择 小禾 x00000003" [ref=e209]
              - generic [ref=e210]:
                - strong [ref=e211]: 小禾
                - generic [ref=e212]: x00000003
                - generic [ref=e213]: 线索完整验收班 · 可学习 · 待设置密码
            - generic [ref=e214]:
              - button "查看学习进度" [ref=e215] [cursor=pointer]
              - button "查看账号" [ref=e216] [cursor=pointer]
              - button "管理学生" [ref=e217] [cursor=pointer]
      - status [ref=e218]
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
     |                                                                                                                                                                                     ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
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