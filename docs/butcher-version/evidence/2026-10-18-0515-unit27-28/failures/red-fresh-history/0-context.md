# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit27-28-fivezones.spec.js >> 课程入口保持班级授权：新课可单独开放
- Location: tests\login\unit27-28-fivezones.spec.js:16:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.legacy-learning')
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.legacy-learning')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - link "灿然英语工作室" [ref=e3] [cursor=pointer]:
      - /url: /
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
        - generic [ref=e19]:
          - generic [ref=e20]: 新班级名称
          - textbox "新班级名称" [ref=e21]
          - button "创建班级" [ref=e22] [cursor=pointer]
      - generic [ref=e23]:
        - text: 查找学生（姓名或学号）
        - searchbox "查找学生（姓名或学号）" [ref=e24]
      - generic [ref=e25]:
        - generic [ref=e26]:
          - heading "线索验收班 · 班级设置" [level=2] [ref=e27]
          - link "预览这个班" [ref=e28] [cursor=pointer]:
            - /url: /?preview=46e84f0b-be00-48bf-b6be-6ba799ae1264
        - generic [ref=e29]:
          - paragraph [ref=e30]: 负责老师：尚未分配
          - button "分配老师" [ref=e31] [cursor=pointer]
        - generic [ref=e32]:
          - generic [ref=e33]: 班级名称
          - generic [ref=e34]:
            - textbox "班级名称" [ref=e35]: 线索验收班
            - button "保存班级名称" [ref=e36] [cursor=pointer]
        - generic [ref=e37]:
          - heading "开放课程" [level=3] [ref=e38]
          - generic [ref=e39]:
            - button "全选课程" [ref=e40] [cursor=pointer]
            - generic [ref=e41]: 已选 1 / 72 门课程
          - generic [ref=e42]:
            - generic [ref=e43]:
              - checkbox "Lesson 1–2 礼貌小帮手" [ref=e44]
              - text: Lesson 1–2 礼貌小帮手
            - generic [ref=e45]:
              - checkbox "Lesson 3–4 雨伞认领小帮手" [ref=e46]
              - text: Lesson 3–4 雨伞认领小帮手
            - generic [ref=e47]:
              - checkbox "Lesson 5–6 新朋友见面会" [ref=e48]
              - text: Lesson 5–6 新朋友见面会
            - generic [ref=e49]:
              - checkbox "Lesson 7–8 新朋友采访站" [ref=e50]
              - text: Lesson 7–8 新朋友采访站
            - generic [ref=e51]:
              - checkbox "Lesson 9–10 街角问候站" [ref=e52]
              - text: Lesson 9–10 街角问候站
            - generic [ref=e53]:
              - checkbox "Lesson 11–12 失物招领小侦探" [ref=e54]
              - text: Lesson 11–12 失物招领小侦探
            - generic [ref=e55]:
              - checkbox "Lesson 13–14 新衣配色屋" [ref=e56]
              - text: Lesson 13–14 新衣配色屋
            - generic [ref=e57]:
              - checkbox "Lesson 15–16 护照小检查站" [ref=e58]
              - text: Lesson 15–16 护照小检查站
            - generic [ref=e59]:
              - checkbox "Lesson 17–18 办公室探访记" [ref=e60]
              - text: Lesson 17–18 办公室探访记
            - generic [ref=e61]:
              - checkbox "Lesson 19–20 冰淇淋休息站" [ref=e62]
              - text: Lesson 19–20 冰淇淋休息站
            - generic [ref=e63]:
              - checkbox "Lesson 21–22 寻物交接站" [ref=e64]
              - text: Lesson 21–22 寻物交接站
            - generic [ref=e65]:
              - checkbox "Lesson 23–24 房间寻物队" [ref=e66]
              - text: Lesson 23–24 房间寻物队
            - generic [ref=e67]:
              - checkbox "Lesson 25–26 厨房探访记" [ref=e68]
              - text: Lesson 25–26 厨房探访记
            - generic [ref=e69]:
              - checkbox "Lesson 27–28 客厅发现之旅" [checked] [ref=e70]
              - text: Lesson 27–28 客厅发现之旅
            - generic [ref=e71]:
              - checkbox "Lesson 29–30 房间整理行动" [ref=e72]
              - text: Lesson 29–30 房间整理行动
            - generic [ref=e73]:
              - checkbox "Lesson 31–32 花园观察小队" [ref=e74]
              - text: Lesson 31–32 花园观察小队
            - generic [ref=e75]:
              - checkbox "Lesson 33–34 晴天河畔发现之旅" [ref=e76]
              - text: Lesson 33–34 晴天河畔发现之旅
            - generic [ref=e77]:
              - checkbox "Lesson 35–36 村庄相册探险" [ref=e78]
              - text: Lesson 35–36 村庄相册探险
            - generic [ref=e79]:
              - checkbox "Lesson 37–38 书架制作小工坊" [ref=e80]
              - text: Lesson 37–38 书架制作小工坊
            - generic [ref=e81]:
              - checkbox "Lesson 39–40 花瓶安放小帮手" [ref=e82]
              - text: Lesson 39–40 花瓶安放小帮手
            - generic [ref=e83]:
              - checkbox "Lesson 41–42 购物袋里的发现" [ref=e84]
              - text: Lesson 41–42 购物袋里的发现
            - generic [ref=e85]:
              - checkbox "Lesson 43–44 茶具躲猫猫" [ref=e86]
              - text: Lesson 43–44 茶具躲猫猫
            - generic [ref=e87]:
              - checkbox "Lesson 45–46 一封难读的信" [ref=e88]
              - text: Lesson 45–46 一封难读的信
            - generic [ref=e89]:
              - checkbox "Lesson 47–48 一杯咖啡的心意" [ref=e90]
              - text: Lesson 47–48 一杯咖啡的心意
            - generic [ref=e91]:
              - checkbox "Lesson 49–50 晚餐采购大冒险" [ref=e92]
              - text: Lesson 49–50 晚餐采购大冒险
            - generic [ref=e93]:
              - checkbox "Lesson 51–52 希腊四季明信片" [ref=e94]
              - text: Lesson 51–52 希腊四季明信片
            - generic [ref=e95]:
              - checkbox "Lesson 53–54 天气观察站" [ref=e96]
              - text: Lesson 53–54 天气观察站
            - generic [ref=e97]:
              - checkbox "Lesson 55–56 索耶家的一天" [ref=e98]
              - text: Lesson 55–56 索耶家的一天
            - generic [ref=e99]:
              - checkbox "Lesson 57–58 今天不一样" [ref=e100]
              - text: Lesson 57–58 今天不一样
            - generic [ref=e101]:
              - checkbox "Lesson 59–60 别忘了找零" [ref=e102]
              - text: Lesson 59–60 别忘了找零
            - generic [ref=e103]:
              - checkbox "Lesson 61–62 给 Jimmy 请医生" [ref=e104]
              - text: Lesson 61–62 给 Jimmy 请医生
            - generic [ref=e105]:
              - checkbox "Lesson 63–64 Jimmy 好些了" [ref=e106]
              - text: Lesson 63–64 Jimmy 好些了
            - generic [ref=e107]:
              - checkbox "Lesson 65–66 Jill 的晚间约定" [ref=e108]
              - text: Lesson 65–66 Jill 的晚间约定
            - generic [ref=e109]:
              - checkbox "Lesson 67–68 街角的周末消息" [ref=e110]
              - text: Lesson 67–68 街角的周末消息
            - generic [ref=e111]:
              - checkbox "Lesson 69–70 赛车日的时光相册" [ref=e112]
              - text: Lesson 69–70 赛车日的时光相册
            - generic [ref=e113]:
              - checkbox "Lesson 71–72 电话里的昨天" [ref=e114]
              - text: Lesson 71–72 电话里的昨天
            - generic [ref=e115]:
              - checkbox "Lesson 73–74 街角的短语手册" [ref=e116]
              - text: Lesson 73–74 街角的短语手册
            - generic [ref=e117]:
              - checkbox "Lesson 75–76 鞋店里的时间线索" [ref=e118]
              - text: Lesson 75–76 鞋店里的时间线索
            - generic [ref=e119]:
              - checkbox "Lesson 77–78 诊所里的预约时间" [ref=e120]
              - text: Lesson 77–78 诊所里的预约时间
            - generic [ref=e121]:
              - checkbox "Lesson 79–80 一起写购物清单" [ref=e122]
              - text: Lesson 79–80 一起写购物清单
            - generic [ref=e123]:
              - checkbox "Lesson 81–82 晚餐前的小意外" [ref=e124]
              - text: Lesson 81–82 晚餐前的小意外
            - generic [ref=e125]:
              - checkbox "Lesson 83–84 出发前的行李箱" [ref=e126]
              - text: Lesson 83–84 出发前的行李箱
            - generic [ref=e127]:
              - checkbox "Lesson 85–86 电影院外聊巴黎" [ref=e128]
              - text: Lesson 85–86 电影院外聊巴黎
            - generic [ref=e129]:
              - checkbox "Lesson 87–88 修理厂里的进度单" [ref=e130]
              - text: Lesson 87–88 修理厂里的进度单
            - generic [ref=e131]:
              - checkbox "Lesson 89–90 看房时的时间线索" [ref=e132]
              - text: Lesson 89–90 看房时的时间线索
            - generic [ref=e133]:
              - checkbox "Lesson 91–92 邻居们的明日约定" [ref=e134]
              - text: Lesson 91–92 邻居们的明日约定
            - generic [ref=e135]:
              - checkbox "Lesson 93–94 新邻居的飞行手记" [ref=e136]
              - text: Lesson 93–94 新邻居的飞行手记
            - generic [ref=e137]:
              - checkbox "Lesson 95–96 车站里的时间谜题" [ref=e138]
              - text: Lesson 95–96 车站里的时间谜题
            - generic [ref=e139]:
              - checkbox "Lesson 97–98 蓝色箱子的归属" [ref=e140]
              - text: Lesson 97–98 蓝色箱子的归属
            - generic [ref=e141]:
              - checkbox "Lesson 99–100 把话传清楚" [ref=e142]
              - text: Lesson 99–100 把话传清楚
            - generic [ref=e143]:
              - checkbox "Lesson 101–102 来自Jimmy的明信片" [ref=e144]
              - text: Lesson 101–102 来自Jimmy的明信片
            - generic [ref=e145]:
              - checkbox "Lesson 103–104 考场外的对话" [ref=e146]
              - text: Lesson 103–104 考场外的对话
            - generic [ref=e147]:
              - checkbox "Lesson 105–106 办公室的小礼物" [ref=e148]
              - text: Lesson 105–106 办公室的小礼物
            - generic [ref=e149]:
              - checkbox "Lesson 107–108 服装店里的比较" [ref=e150]
              - text: Lesson 107–108 服装店里的比较
            - generic [ref=e151]:
              - checkbox "Lesson 109–110 咖啡桌上的数量" [ref=e152]
              - text: Lesson 109–110 咖啡桌上的数量
            - generic [ref=e153]:
              - checkbox "Lesson 111–112 电视机店里的比较" [ref=e154]
              - text: Lesson 111–112 电视机店里的比较
            - generic [ref=e155]:
              - checkbox "Lesson 113–114 公共汽车上的零钱" [ref=e156]
              - text: Lesson 113–114 公共汽车上的零钱
            - generic [ref=e157]:
              - checkbox "Lesson 115–116 敲门后的花园聚会" [ref=e158]
              - text: Lesson 115–116 敲门后的花园聚会
            - generic [ref=e159]:
              - checkbox "Lesson 117–118 早餐时的意外" [ref=e160]
              - text: Lesson 117–118 早餐时的意外
            - generic [ref=e161]:
              - checkbox "Lesson 119–120 夜里的声音" [ref=e162]
              - text: Lesson 119–120 夜里的声音
            - generic [ref=e163]:
              - checkbox "Lesson 121–122 书店里的帽子" [ref=e164]
              - text: Lesson 121–122 书店里的帽子
            - generic [ref=e165]:
              - checkbox "Lesson 123–124 旅行照片里的故事" [ref=e166]
              - text: Lesson 123–124 旅行照片里的故事
            - generic [ref=e167]:
              - checkbox "Lesson 125–126 雨中的双人茶时光" [ref=e168]
              - text: Lesson 125–126 雨中的双人茶时光
            - generic [ref=e169]:
              - checkbox "Lesson 127–128 咖啡馆里的辨认" [ref=e170]
              - text: Lesson 127–128 咖啡馆里的辨认
            - generic [ref=e171]:
              - checkbox "Lesson 129–130 路边的一次提醒" [ref=e172]
              - text: Lesson 129–130 路边的一次提醒
            - generic [ref=e173]:
              - checkbox "Lesson 131–132 客厅里的假期计划" [ref=e174]
              - text: Lesson 131–132 客厅里的假期计划
            - generic [ref=e175]:
              - checkbox "Lesson 133–134 机场采访与一份报纸" [ref=e176]
              - text: Lesson 133–134 机场采访与一份报纸
            - generic [ref=e177]:
              - checkbox "Lesson 135–136 饭店里的最新消息" [ref=e178]
              - text: Lesson 135–136 饭店里的最新消息
            - generic [ref=e179]:
              - checkbox "Lesson 137–138 美好梦想里的如果" [ref=e180]
              - text: Lesson 137–138 美好梦想里的如果
            - generic [ref=e181]:
              - checkbox "Lesson 139–140 电话那头的问话" [ref=e182]
              - text: Lesson 139–140 电话那头的问话
            - generic [ref=e183]:
              - checkbox "Lesson 141–142 Sally的火车初体验" [ref=e184]
              - text: Lesson 141–142 Sally的火车初体验
            - generic [ref=e185]:
              - checkbox "Lesson 143–144 树林里的告示牌" [ref=e186]
              - text: Lesson 143–144 树林里的告示牌
          - button "保存开放课程" [ref=e187] [cursor=pointer]
      - generic [ref=e188]:
        - generic [ref=e189]:
          - heading "班级学生" [level=2] [ref=e190]
          - button "打印全班账号" [ref=e191] [cursor=pointer]
        - generic [ref=e192]:
          - generic [ref=e193]: 学生姓名或课堂称呼，每行一位
          - textbox "学生姓名或课堂称呼，每行一位" [ref=e194]
          - button "核对姓名拼音" [ref=e195] [cursor=pointer]
        - generic [ref=e197]:
          - generic [ref=e198]:
            - generic [ref=e199] [cursor=pointer]:
              - checkbox "全选当前列表（1 人）" [ref=e200]
              - text: 全选当前列表（1 人）
            - generic [ref=e201]: 已选 0 人
            - generic [ref=e202]:
              - button "重置所选密码" [disabled] [ref=e203]
              - button "打印所选账号" [disabled] [ref=e204]
          - generic [ref=e205]:
            - generic [ref=e206] [cursor=pointer]:
              - checkbox "选择 小芽 x00000001" [ref=e207]
              - generic [ref=e208]:
                - strong [ref=e209]: 小芽
                - generic [ref=e210]: x00000001
                - generic [ref=e211]: 线索验收班 · 可学习 · 待设置密码
            - generic [ref=e212]:
              - button "查看学习进度" [ref=e213] [cursor=pointer]
              - button "查看账号" [ref=e214] [cursor=pointer]
              - button "管理学生" [ref=e215] [cursor=pointer]
      - status [ref=e216]
```

# Test source

```ts
  1   | 'use strict';
  2   | const { test, expect } = require('@playwright/test');
  3   | const { adminLogin, createStudent, studentLogin: loginStudent } = require('./helpers');
  4   | // Student windows are fresh contexts: carry mobile settings into them too.
  5   | const {defaultBrowserType,...mobileProfile}=require('@playwright/test').devices['iPhone 13'];
  6   | const studentLogin=(browser,account,base)=>loginStudent(browser,account,base,process.env.UNIT2728_BROWSER==='webkit'?mobileProfile:{});
  7   | const { activity, story } = require('../support/unit2728-fivezones');
  8   | const {courseResponse}=require('../support/course-response-faults');
  9   | // Wait for real course readiness before examining content. Windows WebKit can
  10  | // spend more than five seconds preparing the complete protected package.
  11  | async function ready(page){const start=Date.now();await expect(page.locator('#wordPageProgress')).toBeVisible({timeout:30000});test.info().annotations.push({type:'course-ready',description:String(Date.now()-start)+'ms after navigation'});}
  12  | 
  13  | test.afterEach(async({request})=>{await request.post('/__test__/course-responses',{data:{reset:true}});});
  14  | test.use({actionTimeout:10000,...(process.env.UNIT2728_BROWSER==='webkit'?{...require('@playwright/test').devices['iPhone 13'],browserName:'webkit'}:{})});
  15  | 
  16  | test('课程入口保持班级授权：新课可单独开放', async ({ page, browser }) => {
  17  |   const base = process.env.AWARD_TEST_BASE || '/lesson/';
  18  |   await adminLogin(page, base);
  19  |   const account = await createStudent(page, '线索验收班', '小芽', [/Lesson 27–28/]);
  20  |   const learner = await studentLogin(browser, account, base);
  21  |   try {
  22  |     await expect(learner.page.locator('.course')).toHaveCount(1);
  23  |     await expect(learner.page.locator('.course')).toContainText('客厅发现之旅');
  24  |     await learner.page.getByRole('link', { name: /开始学习/ }).click();
  25  |     await expect(learner.page).toHaveURL(/unit27-28\/#learn\/words/);await ready(learner.page);
  26  |     await expect(learner.page.locator('.unit-word')).toHaveCount(6);
  27  |     await learner.page.goto(base+'unit27-28/#learn/certificate');await ready(learner.page);
> 28  |     await expect(learner.page.locator('.legacy-learning')).toHaveCount(0);
      |                                                            ^ Error: expect(locator).toHaveCount(expected) failed
  29  |     await expect(learner.page.locator('.historical-learning')).toHaveCount(0);
  30  |   } finally { await learner.context.close(); }
  31  | });
  32  | 
  33  | test('未开放本课的班级看不到入口，直接链接也不能进入',async({page,browser})=>{
  34  |   const base=process.env.AWARD_TEST_BASE||'/lesson/';
  35  |   await adminLogin(page,base);
  36  |   const account=await createStudent(page,'只开放旧课班','小叶',[/Lesson 3–4/]);
  37  |   const learner=await studentLogin(browser,account,base);
  38  |   try{
  39  |     await expect(learner.page.locator('.course')).not.toContainText('客厅发现之旅');
  40  |     await learner.page.goto(base+'unit27-28/#learn/words');
  41  |     await expect(learner.page.locator('.unit-word')).toHaveCount(0);
  42  |     await expect(learner.page.getByText('这节课还没向你的班级开放',{exact:true})).toBeVisible();
  43  |   }finally{await learner.context.close();}
  44  | });
  45  | 
  46  | test('真实账号全流程：五颗星同步、纪念册放大、GIF、跨设备与离线恢复',async({page,browser,browserName},info)=>{
  47  |   test.setTimeout(240000);
  48  |   const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  49  |   await adminLogin(page,base);
  50  |   const account=await createStudent(page,'线索完整验收班','小禾',[/Lesson 27–28/]);
  51  |   const first=await studentLogin(browser,account,base);let second;
  52  |   const errors=[],voices=[];
  53  |   first.page.on('pageerror',e=>errors.push(e.message));
  54  |   first.page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
  55  |   try{
  56  |     const learner=first.page;
  57  |     await learner.addInitScript(()=>{
  58  |       window.unit2728Frames={interruptions:[],flights:[]};
  59  |       const observe=()=>{
  60  |         const modal=document.querySelector('dialog.award-reveal[open]');
  61  |         if(modal){
  62  |           const loader=document.querySelector('#courseLoader');
  63  |           const missing=[...modal.querySelectorAll('img')].some(img=>img.getClientRects().length&&(!img.complete||!img.naturalWidth));
  64  |           const playing=[...document.querySelectorAll('.completion-card')].some(el=>el.dataset.resultMotion==='playing');
  65  |           if(missing||playing||(loader&&loader.getBoundingClientRect().width>0)||getComputedStyle(modal).visibility!=='visible')window.unit2728Frames.interruptions.push({missing,playing});
  66  |           const star=modal.querySelector('.travelling-star');
  67  |           if(star){const b=star.getBoundingClientRect(),key=Math.round(b.x)+','+Math.round(b.y);if(!window.unit2728Frames.flights.includes(key))window.unit2728Frames.flights.push(key);}
  68  |         }
  69  |         requestAnimationFrame(observe);
  70  |       };requestAnimationFrame(observe);
  71  |     });
  72  |     await story(learner,prefix);
  73  |     let count=0;
  74  |     for(const id of ['listen','roles','grammar','apply','exam']){
  75  |       const room=await activity(learner,id,{base:prefix,keepAward:true});
  76  |       const modal=learner.getByRole('dialog',{name:/纪念卡结算/});
  77  |       await expect(modal.getByRole('group',{name:`已获得 ${++count} / 5 颗星`,exact:true})).toBeVisible();
  78  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','pending');
  79  |       await expect.poll(()=>learner.evaluate(()=>window.unit2728Frames.flights.length)).toBeGreaterThan(3);
  80  |       await modal.press('Escape');
  81  |       await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  82  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  83  |       expect(await learner.evaluate(()=>window.unit2728Frames.interruptions)).toEqual([]);
  84  |     }
  85  |     await expect(learner.locator('#starCount')).toHaveText('5');const freshHistory=await learner.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit27-28:learning:v1')).activity);expect(freshHistory.unit2728LegacyProgress).toBeUndefined();expect(freshHistory.unit2728V153Progress).toBeUndefined();expect(freshHistory.unit2728V153Migration).toBe(true);
  86  |     await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  87  |     await learner.goto(base+'unit27-28/#learn/certificate');await ready(learner);
  88  |     await expect(learner.locator('#certificateName')).toHaveText('小禾');
  89  |     expect(await learner.locator('#certificateName').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Gothic');
  90  |     expect(await learner.locator('#certificateName').evaluate(e=>getComputedStyle(e).fontWeight)).toBe('500');
  91  |     const date=await learner.locator('#certificateDate').textContent();
  92  |     await learner.locator('.stage-certificate').screenshot({path:info.outputPath('five-star-card.png')});
  93  |     await learner.getByRole('link',{name:'我的纪念册',exact:true}).click();
  94  |     const card=learner.getByRole('button',{name:'放大 Lesson 27–28 细心客厅发现家',exact:true});
  95  |     await expect(card.locator('.certificate')).toHaveAttribute('data-stars','5',{timeout:30000});
  96  |     await card.click();
  97  |     const modal=learner.getByRole('dialog',{name:'Lesson 27–28 纪念卡'});
  98  |     await expect(modal).toContainText('小禾');
  99  |     expect(await modal.locator('.card-name').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Gothic');
  100 |     await modal.screenshot({path:info.outputPath('book-card-closeup.png')});
  101 |     await learner.getByRole('button',{name:'关闭纪念卡',exact:true}).click();
  102 |     second=await studentLogin(browser,account,base);
  103 |     await expect(second.page.locator('.course')).toContainText('5 / 5');
  104 |     await second.page.goto(base+'unit27-28/#learn/certificate');await ready(second.page);
  105 |     await expect(second.page.locator('#certificateDate')).toHaveText(date);
  106 |     const download=second.page.waitForEvent('download');
  107 |     await second.page.getByRole('button',{name:'保存动图',exact:true}).click();
  108 |     const gif=await download;
  109 |     const file=await gif.path();const bytes=require('node:fs').readFileSync(file);
  110 |     expect(bytes.subarray(0,6).toString()).toBe('GIF89a');expect(bytes.length).toBeGreaterThan(10000);
  111 |     const output=info.outputPath('keepsake.gif');await gif.saveAs(output);
  112 |     const sharp=require('sharp'),metadata=await sharp(output,{animated:true}).metadata();
  113 |     expect(metadata.pages).toBe(60);expect(metadata.loop).toBe(0);
  114 |     expect(metadata.width).toBe(984);expect(metadata.pageHeight).toBe(528);
  115 |     const crop=(frame,rect)=>sharp(output,{page:frame}).extract(rect).raw().toBuffer();
  116 |     const lights={left:40,top:330,width:400,height:100},title={left:55,top:150,width:360,height:55};
  117 |     expect((await crop(0,lights)).equals(await crop(15,lights))).toBe(false);
  118 |     expect((await crop(0,title)).equals(await crop(15,title))).toBe(true);
  119 |     for(const region of [{left:55,top:255,width:350,height:78},{left:510,top:180,width:425,height:290}])expect((await crop(0,region)).equals(await crop(15,region))).toBe(true);
  120 |     await sharp(output,{page:15}).png().toFile(info.outputPath('keepsake-frame-15.png'));
  121 |     for(const width of [320,390]){
  122 |       await second.page.setViewportSize({width,height:844});
  123 |       await second.page.locator('.stage-certificate').scrollIntoViewIfNeeded();
  124 |       await second.page.locator('.stage-certificate').screenshot({path:info.outputPath(`card-${width}.png`)});
  125 |     }
  126 |     await second.page.setViewportSize({width:1280,height:900});
  127 |     await second.page.goto(base+'unit27-28/#learn/grammar');await ready(second.page);
  128 |     await expect(second.page.locator('.stage-grammar .completion-number')).toHaveText(['12','12','0']);
```