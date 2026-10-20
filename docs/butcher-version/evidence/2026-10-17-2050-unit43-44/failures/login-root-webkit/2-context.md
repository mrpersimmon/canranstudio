# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit43-44.spec.js >> 缺图先拦截，恢复后完整进入；复访复用素材并恢复词卡页
- Location: tests\login\unit43-44.spec.js:135:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.unit-word')
Expected: 6
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.unit-word')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - link "灿然英语工作室" [ref=e3]:
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
          - button "管理 茶桌验收班" [ref=e18] [cursor=pointer]: 茶桌验收班
          - button "管理 只开放旧课班" [ref=e19] [cursor=pointer]: 只开放旧课班
          - button "管理 茶桌完整验收班" [ref=e20] [cursor=pointer]: 茶桌完整验收班
          - button "管理 茶桌加载验收班" [ref=e21] [cursor=pointer]: 茶桌加载验收班
        - generic [ref=e22]:
          - generic [ref=e23]: 新班级名称
          - textbox "新班级名称" [ref=e24]
          - button "创建班级" [ref=e25] [cursor=pointer]
      - generic [ref=e26]:
        - text: 查找学生（姓名或学号）
        - searchbox "查找学生（姓名或学号）" [ref=e27]
      - generic [ref=e28]:
        - generic [ref=e29]:
          - heading "茶桌加载验收班 · 班级设置" [level=2] [ref=e30]
          - link "预览这个班" [ref=e31] [cursor=pointer]:
            - /url: /?preview=43472153-ff39-45c1-9c98-0fc868911b51
        - generic [ref=e32]:
          - paragraph [ref=e33]: 负责老师：尚未分配
          - button "分配老师" [ref=e34] [cursor=pointer]
        - generic [ref=e35]:
          - generic [ref=e36]: 班级名称
          - generic [ref=e37]:
            - textbox "班级名称" [ref=e38]: 茶桌加载验收班
            - button "保存班级名称" [ref=e39] [cursor=pointer]
        - generic [ref=e40]:
          - heading "开放课程" [level=3] [ref=e41]
          - generic [ref=e42]:
            - button "全选课程" [ref=e43] [cursor=pointer]
            - generic [ref=e44]: 已选 1 / 72 门课程
          - generic [ref=e45]:
            - generic [ref=e46]:
              - checkbox "Lesson 1–2 礼貌小帮手" [ref=e47]
              - text: Lesson 1–2 礼貌小帮手
            - generic [ref=e48]:
              - checkbox "Lesson 3–4 雨伞认领小帮手" [ref=e49]
              - text: Lesson 3–4 雨伞认领小帮手
            - generic [ref=e50]:
              - checkbox "Lesson 5–6 新朋友见面会" [ref=e51]
              - text: Lesson 5–6 新朋友见面会
            - generic [ref=e52]:
              - checkbox "Lesson 7–8 新朋友采访站" [ref=e53]
              - text: Lesson 7–8 新朋友采访站
            - generic [ref=e54]:
              - checkbox "Lesson 9–10 街角问候站" [ref=e55]
              - text: Lesson 9–10 街角问候站
            - generic [ref=e56]:
              - checkbox "Lesson 11–12 失物招领小侦探" [ref=e57]
              - text: Lesson 11–12 失物招领小侦探
            - generic [ref=e58]:
              - checkbox "Lesson 13–14 新衣配色屋" [ref=e59]
              - text: Lesson 13–14 新衣配色屋
            - generic [ref=e60]:
              - checkbox "Lesson 15–16 护照小检查站" [ref=e61]
              - text: Lesson 15–16 护照小检查站
            - generic [ref=e62]:
              - checkbox "Lesson 17–18 办公室探访记" [ref=e63]
              - text: Lesson 17–18 办公室探访记
            - generic [ref=e64]:
              - checkbox "Lesson 19–20 冰淇淋休息站" [ref=e65]
              - text: Lesson 19–20 冰淇淋休息站
            - generic [ref=e66]:
              - checkbox "Lesson 21–22 寻物交接站" [ref=e67]
              - text: Lesson 21–22 寻物交接站
            - generic [ref=e68]:
              - checkbox "Lesson 23–24 房间寻物队" [ref=e69]
              - text: Lesson 23–24 房间寻物队
            - generic [ref=e70]:
              - checkbox "Lesson 25–26 厨房探访记" [ref=e71]
              - text: Lesson 25–26 厨房探访记
            - generic [ref=e72]:
              - checkbox "Lesson 27–28 客厅发现之旅" [ref=e73]
              - text: Lesson 27–28 客厅发现之旅
            - generic [ref=e74]:
              - checkbox "Lesson 29–30 房间整理行动" [ref=e75]
              - text: Lesson 29–30 房间整理行动
            - generic [ref=e76]:
              - checkbox "Lesson 31–32 花园观察小队" [ref=e77]
              - text: Lesson 31–32 花园观察小队
            - generic [ref=e78]:
              - checkbox "Lesson 33–34 晴天河畔发现之旅" [ref=e79]
              - text: Lesson 33–34 晴天河畔发现之旅
            - generic [ref=e80]:
              - checkbox "Lesson 35–36 村庄相册探险" [ref=e81]
              - text: Lesson 35–36 村庄相册探险
            - generic [ref=e82]:
              - checkbox "Lesson 37–38 书架制作小工坊" [ref=e83]
              - text: Lesson 37–38 书架制作小工坊
            - generic [ref=e84]:
              - checkbox "Lesson 39–40 花瓶安放小帮手" [ref=e85]
              - text: Lesson 39–40 花瓶安放小帮手
            - generic [ref=e86]:
              - checkbox "Lesson 41–42 购物袋里的发现" [ref=e87]
              - text: Lesson 41–42 购物袋里的发现
            - generic [ref=e88]:
              - checkbox "Lesson 43–44 茶具躲猫猫" [checked] [ref=e89]
              - text: Lesson 43–44 茶具躲猫猫
            - generic [ref=e90]:
              - checkbox "Lesson 45–46 一封难读的信" [ref=e91]
              - text: Lesson 45–46 一封难读的信
            - generic [ref=e92]:
              - checkbox "Lesson 47–48 一杯咖啡的心意" [ref=e93]
              - text: Lesson 47–48 一杯咖啡的心意
            - generic [ref=e94]:
              - checkbox "Lesson 49–50 晚餐采购大冒险" [ref=e95]
              - text: Lesson 49–50 晚餐采购大冒险
            - generic [ref=e96]:
              - checkbox "Lesson 51–52 希腊四季明信片" [ref=e97]
              - text: Lesson 51–52 希腊四季明信片
            - generic [ref=e98]:
              - checkbox "Lesson 53–54 天气观察站" [ref=e99]
              - text: Lesson 53–54 天气观察站
            - generic [ref=e100]:
              - checkbox "Lesson 55–56 索耶家的一天" [ref=e101]
              - text: Lesson 55–56 索耶家的一天
            - generic [ref=e102]:
              - checkbox "Lesson 57–58 今天不一样" [ref=e103]
              - text: Lesson 57–58 今天不一样
            - generic [ref=e104]:
              - checkbox "Lesson 59–60 别忘了找零" [ref=e105]
              - text: Lesson 59–60 别忘了找零
            - generic [ref=e106]:
              - checkbox "Lesson 61–62 给 Jimmy 请医生" [ref=e107]
              - text: Lesson 61–62 给 Jimmy 请医生
            - generic [ref=e108]:
              - checkbox "Lesson 63–64 Jimmy 好些了" [ref=e109]
              - text: Lesson 63–64 Jimmy 好些了
            - generic [ref=e110]:
              - checkbox "Lesson 65–66 Jill 的晚间约定" [ref=e111]
              - text: Lesson 65–66 Jill 的晚间约定
            - generic [ref=e112]:
              - checkbox "Lesson 67–68 街角的周末消息" [ref=e113]
              - text: Lesson 67–68 街角的周末消息
            - generic [ref=e114]:
              - checkbox "Lesson 69–70 赛车日的时光相册" [ref=e115]
              - text: Lesson 69–70 赛车日的时光相册
            - generic [ref=e116]:
              - checkbox "Lesson 71–72 电话里的昨天" [ref=e117]
              - text: Lesson 71–72 电话里的昨天
            - generic [ref=e118]:
              - checkbox "Lesson 73–74 街角的短语手册" [ref=e119]
              - text: Lesson 73–74 街角的短语手册
            - generic [ref=e120]:
              - checkbox "Lesson 75–76 鞋店里的时间线索" [ref=e121]
              - text: Lesson 75–76 鞋店里的时间线索
            - generic [ref=e122]:
              - checkbox "Lesson 77–78 诊所里的预约时间" [ref=e123]
              - text: Lesson 77–78 诊所里的预约时间
            - generic [ref=e124]:
              - checkbox "Lesson 79–80 一起写购物清单" [ref=e125]
              - text: Lesson 79–80 一起写购物清单
            - generic [ref=e126]:
              - checkbox "Lesson 81–82 晚餐前的小意外" [ref=e127]
              - text: Lesson 81–82 晚餐前的小意外
            - generic [ref=e128]:
              - checkbox "Lesson 83–84 出发前的行李箱" [ref=e129]
              - text: Lesson 83–84 出发前的行李箱
            - generic [ref=e130]:
              - checkbox "Lesson 85–86 电影院外聊巴黎" [ref=e131]
              - text: Lesson 85–86 电影院外聊巴黎
            - generic [ref=e132]:
              - checkbox "Lesson 87–88 修理厂里的进度单" [ref=e133]
              - text: Lesson 87–88 修理厂里的进度单
            - generic [ref=e134]:
              - checkbox "Lesson 89–90 看房时的时间线索" [ref=e135]
              - text: Lesson 89–90 看房时的时间线索
            - generic [ref=e136]:
              - checkbox "Lesson 91–92 邻居们的明日约定" [ref=e137]
              - text: Lesson 91–92 邻居们的明日约定
            - generic [ref=e138]:
              - checkbox "Lesson 93–94 新邻居的飞行手记" [ref=e139]
              - text: Lesson 93–94 新邻居的飞行手记
            - generic [ref=e140]:
              - checkbox "Lesson 95–96 车站里的时间谜题" [ref=e141]
              - text: Lesson 95–96 车站里的时间谜题
            - generic [ref=e142]:
              - checkbox "Lesson 97–98 蓝色箱子的归属" [ref=e143]
              - text: Lesson 97–98 蓝色箱子的归属
            - generic [ref=e144]:
              - checkbox "Lesson 99–100 把话传清楚" [ref=e145]
              - text: Lesson 99–100 把话传清楚
            - generic [ref=e146]:
              - checkbox "Lesson 101–102 来自Jimmy的明信片" [ref=e147]
              - text: Lesson 101–102 来自Jimmy的明信片
            - generic [ref=e148]:
              - checkbox "Lesson 103–104 考场外的对话" [ref=e149]
              - text: Lesson 103–104 考场外的对话
            - generic [ref=e150]:
              - checkbox "Lesson 105–106 办公室的小礼物" [ref=e151]
              - text: Lesson 105–106 办公室的小礼物
            - generic [ref=e152]:
              - checkbox "Lesson 107–108 服装店里的比较" [ref=e153]
              - text: Lesson 107–108 服装店里的比较
            - generic [ref=e154]:
              - checkbox "Lesson 109–110 咖啡桌上的数量" [ref=e155]
              - text: Lesson 109–110 咖啡桌上的数量
            - generic [ref=e156]:
              - checkbox "Lesson 111–112 电视机店里的比较" [ref=e157]
              - text: Lesson 111–112 电视机店里的比较
            - generic [ref=e158]:
              - checkbox "Lesson 113–114 公共汽车上的零钱" [ref=e159]
              - text: Lesson 113–114 公共汽车上的零钱
            - generic [ref=e160]:
              - checkbox "Lesson 115–116 敲门后的花园聚会" [ref=e161]
              - text: Lesson 115–116 敲门后的花园聚会
            - generic [ref=e162]:
              - checkbox "Lesson 117–118 早餐时的意外" [ref=e163]
              - text: Lesson 117–118 早餐时的意外
            - generic [ref=e164]:
              - checkbox "Lesson 119–120 夜里的声音" [ref=e165]
              - text: Lesson 119–120 夜里的声音
            - generic [ref=e166]:
              - checkbox "Lesson 121–122 书店里的帽子" [ref=e167]
              - text: Lesson 121–122 书店里的帽子
            - generic [ref=e168]:
              - checkbox "Lesson 123–124 旅行照片里的故事" [ref=e169]
              - text: Lesson 123–124 旅行照片里的故事
            - generic [ref=e170]:
              - checkbox "Lesson 125–126 雨中的双人茶时光" [ref=e171]
              - text: Lesson 125–126 雨中的双人茶时光
            - generic [ref=e172]:
              - checkbox "Lesson 127–128 咖啡馆里的辨认" [ref=e173]
              - text: Lesson 127–128 咖啡馆里的辨认
            - generic [ref=e174]:
              - checkbox "Lesson 129–130 路边的一次提醒" [ref=e175]
              - text: Lesson 129–130 路边的一次提醒
            - generic [ref=e176]:
              - checkbox "Lesson 131–132 客厅里的假期计划" [ref=e177]
              - text: Lesson 131–132 客厅里的假期计划
            - generic [ref=e178]:
              - checkbox "Lesson 133–134 机场采访与一份报纸" [ref=e179]
              - text: Lesson 133–134 机场采访与一份报纸
            - generic [ref=e180]:
              - checkbox "Lesson 135–136 饭店里的最新消息" [ref=e181]
              - text: Lesson 135–136 饭店里的最新消息
            - generic [ref=e182]:
              - checkbox "Lesson 137–138 美好梦想里的如果" [ref=e183]
              - text: Lesson 137–138 美好梦想里的如果
            - generic [ref=e184]:
              - checkbox "Lesson 139–140 电话那头的问话" [ref=e185]
              - text: Lesson 139–140 电话那头的问话
            - generic [ref=e186]:
              - checkbox "Lesson 141–142 Sally的火车初体验" [ref=e187]
              - text: Lesson 141–142 Sally的火车初体验
            - generic [ref=e188]:
              - checkbox "Lesson 143–144 树林里的告示牌" [ref=e189]
              - text: Lesson 143–144 树林里的告示牌
          - button "保存开放课程" [ref=e190] [cursor=pointer]
      - generic [ref=e191]:
        - generic [ref=e192]:
          - heading "班级学生" [level=2] [ref=e193]
          - button "打印全班账号" [ref=e194] [cursor=pointer]
        - generic [ref=e195]:
          - generic [ref=e196]: 学生姓名或课堂称呼，每行一位
          - textbox "学生姓名或课堂称呼，每行一位" [ref=e197]
          - button "核对姓名拼音" [ref=e198] [cursor=pointer]
        - generic [ref=e200]:
          - generic [ref=e201]:
            - generic [ref=e202] [cursor=pointer]:
              - checkbox "全选当前列表（1 人）" [ref=e203]
              - text: 全选当前列表（1 人）
            - generic [ref=e204]: 已选 0 人
            - generic [ref=e205]:
              - button "重置所选密码" [disabled] [ref=e206]
              - button "打印所选账号" [disabled] [ref=e207]
          - generic [ref=e208]:
            - generic [ref=e209] [cursor=pointer]:
              - checkbox "选择 小林 x00000004" [ref=e210]
              - generic [ref=e211]:
                - strong [ref=e212]: 小林
                - generic [ref=e213]: x00000004
                - generic [ref=e214]: 茶桌加载验收班 · 可学习 · 待设置密码
            - generic [ref=e215]:
              - button "查看学习进度" [ref=e216] [cursor=pointer]
              - button "查看账号" [ref=e217] [cursor=pointer]
              - button "管理学生" [ref=e218] [cursor=pointer]
      - status [ref=e219]
```

# Test source

```ts
  47  |     await learner.addInitScript(()=>{
  48  |       window.unit4344Frames={interruptions:[],flights:[]};
  49  |       const observe=()=>{
  50  |         const modal=document.querySelector('dialog.award-reveal[open]');
  51  |         if(modal){
  52  |           const loader=document.querySelector('#courseLoader');
  53  |           const missing=[...modal.querySelectorAll('img')].some(img=>img.getClientRects().length&&(!img.complete||!img.naturalWidth));
  54  |           const playing=[...document.querySelectorAll('.completion-card')].some(el=>el.dataset.resultMotion==='playing');
  55  |           if(missing||playing||(loader&&loader.getBoundingClientRect().width>0)||getComputedStyle(modal).visibility!=='visible')window.unit4344Frames.interruptions.push({missing,playing});
  56  |           const star=modal.querySelector('.travelling-star');
  57  |           if(star){const b=star.getBoundingClientRect(),key=Math.round(b.x)+','+Math.round(b.y);if(!window.unit4344Frames.flights.includes(key))window.unit4344Frames.flights.push(key);}
  58  |         }
  59  |         requestAnimationFrame(observe);
  60  |       };requestAnimationFrame(observe);
  61  |     });
  62  |     await story(learner,prefix);
  63  |     let count=0;
  64  |     for(const id of ['listen','roles','grammar','apply','exam']){
  65  |       const room=await activity(learner,id,{base:prefix,keepAward:true});
  66  |       const modal=learner.getByRole('dialog',{name:/纪念卡结算/});
  67  |       await expect(modal.getByRole('group',{name:`已获得 ${++count} / 5 颗星`,exact:true})).toBeVisible();
  68  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','pending');
  69  |       await expect.poll(()=>learner.evaluate(()=>window.unit4344Frames.flights.length)).toBeGreaterThan(3);
  70  |       await modal.press('Escape');
  71  |       await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  72  |       await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  73  |       expect(await learner.evaluate(()=>window.unit4344Frames.interruptions)).toEqual([]);
  74  |     }
  75  |     await expect(learner.locator('#starCount')).toHaveText('5');
  76  |     await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  77  |     await learner.goto(base+'unit43-44/#learn/certificate');
  78  |     await expect(learner.locator('#certificateName')).toHaveText('小禾');
  79  |     const date=await learner.locator('#certificateDate').textContent();
  80  |     await learner.locator('.stage-certificate').screenshot({path:info.outputPath('five-star-card.png')});
  81  |     await learner.getByRole('link',{name:'我的纪念册',exact:true}).click();
  82  |     const card=learner.getByRole('button',{name:'放大 Lesson 43–44 茶桌小帮手',exact:true});
  83  |     await expect(card.locator('.certificate')).toHaveAttribute('data-stars','5');
  84  |     await card.click();
  85  |     const modal=learner.getByRole('dialog',{name:'Lesson 43–44 纪念卡'});
  86  |     await expect(modal).toContainText('小禾');
  87  |     await modal.screenshot({path:info.outputPath('book-card-closeup.png')});
  88  |     await learner.getByRole('button',{name:'关闭纪念卡',exact:true}).click();
  89  |     second=await studentLogin(browser,account,base);
  90  |     await expect(second.page.locator('.course')).toContainText('5 / 5');
  91  |     await second.page.goto(base+'unit43-44/#learn/certificate');
  92  |     await expect(second.page.locator('#certificateDate')).toHaveText(date);
  93  |     const download=second.page.waitForEvent('download');
  94  |     await second.page.getByRole('button',{name:'保存动图',exact:true}).click();
  95  |     const gif=await download;
  96  |     const file=await gif.path();const bytes=require('node:fs').readFileSync(file);
  97  |     expect(bytes.subarray(0,6).toString()).toBe('GIF89a');expect(bytes.length).toBeGreaterThan(10000);
  98  |     const output=info.outputPath('keepsake.gif');await gif.saveAs(output);
  99  |     const sharp=require('sharp'),metadata=await sharp(output,{animated:true}).metadata();
  100 |     expect(metadata.pages).toBe(60);expect(metadata.loop).toBe(0);
  101 |     expect(metadata.width).toBe(984);expect(metadata.pageHeight).toBe(528);
  102 |     const crop=(frame,rect)=>sharp(output,{page:frame}).extract(rect).raw().toBuffer();
  103 |     const lights={left:40,top:330,width:400,height:100},title={left:55,top:150,width:360,height:55};
  104 |     expect((await crop(0,lights)).equals(await crop(15,lights))).toBe(false);
  105 |     expect((await crop(0,title)).equals(await crop(15,title))).toBe(true);
  106 |     await sharp(output,{page:15}).png().toFile(info.outputPath('keepsake-frame-15.png'));
  107 |     for(const width of [320,390]){
  108 |       await second.page.setViewportSize({width,height:844});
  109 |       await second.page.locator('.stage-certificate').scrollIntoViewIfNeeded();
  110 |       await second.page.locator('.stage-certificate').screenshot({path:info.outputPath(`card-${width}.png`)});
  111 |     }
  112 |     await second.page.setViewportSize({width:1280,height:900});
  113 |     await second.page.goto(base+'unit43-44/#learn/grammar');
  114 |     await expect(second.page.locator('.stage-grammar .completion-number')).toHaveText(['13','13','0']);
  115 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'再练一轮',exact:true}).click();
  116 |     await second.context.setOffline(true);
  117 |     await require('../support/units1-30-tasks').select(second.page.locator('.stage-grammar'),'会；能够');
  118 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'检查答案',exact:true}).click();
  119 |     await second.page.locator('.stage-grammar').getByRole('button',{name:'下一题',exact:true}).click();
  120 |     let navigationFailed=false;
  121 |     try{await second.page.reload({timeout:12000});}catch(error){
  122 |       if(browserName!=='webkit'||!/WebKit encountered an internal error/.test(error.message))throw error;
  123 |       navigationFailed=true;info.annotations.push({type:'engine-boundary',description:'WebKit offline navigation rejected before app fallback; reconnect and record recovery checked separately.'});
  124 |     }
  125 |     if(navigationFailed){await second.context.setOffline(false);await second.page.goto(base+'unit43-44/#learn/grammar');}
  126 |     else{await expect(second.page.getByRole('heading',{name:'联网后再进入',exact:true})).toBeVisible();await second.context.setOffline(false);await second.page.getByRole('button',{name:'再试一次',exact:true}).click();}
  127 |     await expect(second.page.locator('.stage-grammar .progress-copy')).toHaveText('第 2 / 13 题');
  128 |     await expect(second.page.locator('#starCount')).toHaveText('5');
  129 |     expect(await second.page.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  130 |     expect(errors).toEqual([]);expect(voices).toEqual([]);
  131 |   }finally{await first.context.close();await second?.context.close();}
  132 | });
  133 | 
  134 | 
  135 | test('缺图先拦截，恢复后完整进入；复访复用素材并恢复词卡页',async({page,browser})=>{
  136 |   test.setTimeout(60000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
  137 |   await adminLogin(page,base);const account=await createStudent(page,'茶桌加载验收班','小林',[/Lesson 43–44/]);
  138 |   const student=await studentLogin(browser,account,base);const p=student.page;
  139 |   try{
  140 |     const pattern=base+'resources/*/kettle.svg';
  141 |     await courseResponse(p,pattern,{status:404,body:'missing illustration'});
  142 |     await p.goto(base+'unit43-44/#learn/words');
  143 |     const loader=p.getByRole('region',{name:'课程加载',exact:true});
  144 |     await expect(loader.getByRole('button',{name:'再试一次',exact:true})).toBeVisible({timeout:20000});
  145 |     await expect(p.locator('.unit-word')).toHaveCount(0);
  146 |     await courseResponse(p,pattern);await loader.getByRole('button',{name:'再试一次',exact:true}).click();
> 147 |     await expect(p.locator('.unit-word')).toHaveCount(6);await expect(p.locator('#courseLoader')).toHaveCount(0);
      |                                           ^ Error: expect(locator).toHaveCount(expected) failed
  148 |     expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  149 |     await p.getByRole('button',{name:'下一组词卡',exact:true}).click();await expect(p.locator('#wordPageProgress')).toHaveText('2 / 3');
  150 |     await p.getByRole('link',{name:'我的课程',exact:true}).click();
  151 |     const downloads=[];p.on('request',r=>{if(r.url().includes('/resources/'))downloads.push(r.url());});
  152 |     await p.locator('.course').getByRole('link',{name:/学习/}).click();
  153 |     await expect(p.locator('#wordPageProgress')).toHaveText('2 / 3');
  154 |     expect(downloads).toEqual([]);
  155 |     expect(await p.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  156 |   }finally{await student.context.close();}
  157 | });
  158 | 
  159 | test('同姓名同星数对照认可卡：新卡、书页和一星动图显示一致',async({page,browser},info)=>{
  160 |   test.setTimeout(120000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  161 |   await adminLogin(page,base);const account=await createStudent(page,'茶桌视觉对照班','小禾',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 43–44/]);
  162 |   const student=await studentLogin(browser,account,base),p=student.page;
  163 |   try{
  164 |     await p.goto(base+'unit43-44/#learn/certificate');
  165 |     await expect(p.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  166 |     for(const pair of ['1-2','3-4','43-44']){
  167 |       if(pair==='43-44')await activity(p,'listen',{base:prefix});
  168 |       else if(pair==='1-2')await require('../support/unit1-2-award-flow').finishZone(p,'listen',{base:base+'unit1-2/'});
  169 |       else await require('../support/units1-30-tasks').activity(p,pair,'listen',{base:prefix});
  170 |       await p.goto(base+'unit'+pair+'/#learn/certificate');
  171 |       await expect(p.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','1');
  172 |       await expect(p.locator('#certificateName')).toHaveText('小禾');
  173 |       await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('compare-'+pair+'.png')});
  174 |     }
  175 |     const card=p.locator('.stage-certificate .story-award-paper');
  176 |     const shine=card.locator('.award-star[data-earned="true"] .star-glint');
  177 |     const changes=await shine.evaluate(async el=>{
  178 |       const frames=new Set(),start=performance.now();
  179 |       while(performance.now()-start<5000&&frames.size<5){frames.add(getComputedStyle(el).opacity);await new Promise(requestAnimationFrame);}
  180 |       return frames.size;
  181 |     });expect(changes).toBeGreaterThan(3);
  182 |     const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();
  183 |     const gif=await download,file=info.outputPath('one-star.gif');await gif.saveAs(file);
  184 |     const sharp=require('sharp'),meta=await sharp(file,{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.loop).toBe(0);
  185 |     const area={left:40,top:330,width:400,height:100};
  186 |     expect((await sharp(file,{page:0}).extract(area).raw().toBuffer()).equals(await sharp(file,{page:15}).extract(area).raw().toBuffer())).toBe(false);
  187 |     await sharp(file,{page:15}).png().toFile(info.outputPath('one-star-frame.png'));
  188 |     await p.getByRole('link',{name:'我的纪念册',exact:true}).click();
  189 |     await p.getByRole('button',{name:'目录',exact:true}).click();
  190 |     await p.getByRole('button',{name:/Lesson 43–44/}).click();
  191 |     const cover=p.getByRole('button',{name:'放大 Lesson 43–44 茶桌小帮手',exact:true});
  192 |     await expect(cover.locator('.certificate')).toHaveAttribute('data-stars','1');
  193 |     await p.locator('.book').screenshot({path:info.outputPath('comparison-book.png')});
  194 |     await cover.click();await p.getByRole('dialog',{name:'Lesson 43–44 纪念卡'}).screenshot({path:info.outputPath('one-star-book-closeup.png')});
  195 |   }finally{await student.context.close();}
  196 | });
  197 | 
  198 | test('长姓名手机卡、另一学生隔离、教师预览不能保存个人成果',async({page,browser},info)=>{
  199 |  test.setTimeout(70000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  200 |  await adminLogin(page,base);const account=await createStudent(page,'茶桌身份边界班','欧阳小禾同学',[/Lesson 43–44/]);
  201 |  const preview=await page.getByRole('link',{name:'预览这个班',exact:true}).getAttribute('href');
  202 |  const first=await studentLogin(browser,account,base);let other;
  203 |  try{
  204 |   await activity(first.page,'listen',{base:prefix});await first.page.setViewportSize({width:320,height:568});await first.page.goto(base+'unit43-44/#learn/certificate');
  205 |   await expect(first.page.locator('#certificateName')).toHaveText('欧阳小禾同学');
  206 |   const card=first.page.locator('.stage-certificate .story-award-paper'),name=first.page.locator('#certificateName');
  207 |   const b=await card.boundingBox(),n=await name.boundingBox();expect(n.x).toBeGreaterThan(b.x);expect(n.x+n.width).toBeLessThan(b.x+b.width);expect(n.y+n.height).toBeLessThan(b.y+b.height);
  208 |   expect(await name.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollHeight<=el.clientHeight+1)).toBe(true);await card.screenshot({path:info.outputPath('long-name-320.png')});
  209 |   const second=await require('./helpers').addStudent(page,'小竹');other=await studentLogin(browser,second,base);await other.page.goto(base+'unit43-44/#learn/certificate');await expect(other.page.locator('#starCount')).toHaveText('0');await expect(other.page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  210 |   await page.goto(preview);await page.getByRole('link',{name:/茶具躲猫猫/}).click();await page.goto((await page.url()).replace(/#.*$/,'#learn/certificate'));
  211 |   await expect(page.locator('#starCount')).toHaveText('0');await expect(page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
  212 |  }finally{await first.context.close();await other?.context.close();}
  213 | });
  214 | 
  215 | const ready=async p=>expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
  216 | test('关课重开保留收藏，导出故障可重试且离开取消下载',async({page,browser},info)=>{
  217 |  test.setTimeout(150000);const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1);
  218 |  const {saveCourses}=require('./helpers');await adminLogin(page,base);const account=await createStudent(page,'消息成果保留班','小溪',[/Lesson 43–44/]);
  219 |  const student=await studentLogin(browser,account,base),p=student.page,downloads=[];p.on('download',d=>downloads.push(d));
  220 |  try{
  221 |   await activity(p,'listen',{base:prefix});await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  222 |   await page.getByRole('checkbox',{name:/Lesson 43–44/}).uncheck();await saveCourses(page);
  223 |   await p.goto(base);await expect(p.locator('.course')).toHaveCount(0);
  224 |   await p.getByRole('link',{name:'我的纪念册',exact:true}).click();const oldCard=p.getByRole('button',{name:'放大 Lesson 43–44 茶桌小帮手',exact:true});
  225 |   await expect(oldCard.locator('.certificate')).toHaveAttribute('data-stars','1',{timeout:30000});await oldCard.screenshot({path:info.outputPath('closed-course-collection.png')});
  226 |   await page.getByRole('checkbox',{name:/Lesson 43–44/}).check();await saveCourses(page);
  227 |   await p.goto(base+'unit43-44/#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('#certificateName')).toHaveText('小溪');
  228 |   // Inject a failure at the browser canvas boundary, not in learning or award data.
  229 |   await p.evaluate(()=>{window.originalGifRead=CanvasRenderingContext2D.prototype.getImageData;window.failedGifReads=0;CanvasRenderingContext2D.prototype.getImageData=function(...args){if(this.canvas.width===984&&this.canvas.height===528){window.failedGifReads++;throw new DOMException('Simulated export canvas failure','InvalidStateError');}return Reflect.apply(window.originalGifRead,this,args);};});
  230 |   await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('暂时没能保存，请再试一次。');expect(await p.evaluate(()=>window.failedGifReads)).toBeGreaterThan(0);expect(downloads).toHaveLength(0);
  231 |   await p.evaluate(()=>{CanvasRenderingContext2D.prototype.getImageData=window.originalGifRead;});const download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();const gif=await download;await gif.saveAs(info.outputPath('export-recovered.gif'));
  232 |   const meta=await require('sharp')(info.outputPath('export-recovered.gif'),{animated:true}).metadata();expect(meta.pages).toBe(60);expect(meta.width).toBe(984);expect(meta.pageHeight).toBe(528);await expect(p.locator('.story-award-status')).toHaveText('动图已生成');expect(downloads).toHaveLength(1);
  233 |   await p.getByRole('button',{name:'保存动图',exact:true}).click();await expect(p.locator('.story-award-status')).toHaveText('正在保存…');await p.getByRole('link',{name:'我的课程',exact:true}).click();await expect(p.locator('.course')).toHaveCount(1);await expect(p.locator('.course')).toContainText('1 / 5');expect(downloads).toHaveLength(1);
  234 |   await p.goto(base+'unit43-44/#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('1');await expect(p.locator('.story-award-status')).toBeEmpty();expect(downloads).toHaveLength(1);
  235 |  }finally{await student.context.close();}
  236 | });
  237 | 
  238 | 
  239 | 
  240 | 
```