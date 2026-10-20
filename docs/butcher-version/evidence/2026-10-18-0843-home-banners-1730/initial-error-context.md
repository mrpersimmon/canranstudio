# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home-banners-1730.spec.js >> 登录首页七个入口与课内封面、纪念卡使用同一现行插画，刷新和权限保留
- Location: tests\login\home-banners-1730.spec.js:6:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-unit="unit17-18"]').locator('.featured-art img')
Expected: 1
Received: 5
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('[data-unit="unit17-18"]').locator('.featured-art img')
    14 × locator resolved to 5 elements
       - unexpected value "5"

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
          - button "管理 首页插画核对班" [ref=e18] [cursor=pointer]: 首页插画核对班
        - generic [ref=e19]:
          - generic [ref=e20]: 新班级名称
          - textbox "新班级名称" [ref=e21]
          - button "创建班级" [ref=e22] [cursor=pointer]
      - generic [ref=e23]:
        - text: 查找学生（姓名或学号）
        - searchbox "查找学生（姓名或学号）" [ref=e24]
      - generic [ref=e25]:
        - generic [ref=e26]:
          - heading "首页插画核对班 · 班级设置" [level=2] [ref=e27]
          - link "预览这个班" [ref=e28] [cursor=pointer]:
            - /url: /?preview=6c02d690-f902-4380-9d19-2fa2e6ff0ada
        - generic [ref=e29]:
          - paragraph [ref=e30]: 负责老师：尚未分配
          - button "分配老师" [ref=e31] [cursor=pointer]
        - generic [ref=e32]:
          - generic [ref=e33]: 班级名称
          - generic [ref=e34]:
            - textbox "班级名称" [ref=e35]: 首页插画核对班
            - button "保存班级名称" [ref=e36] [cursor=pointer]
        - generic [ref=e37]:
          - heading "开放课程" [level=3] [ref=e38]
          - generic [ref=e39]:
            - button "全选课程" [ref=e40] [cursor=pointer]
            - generic [ref=e41]: 已选 7 / 72 门课程
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
              - checkbox "Lesson 17–18 办公室探访记" [checked] [ref=e60]
              - text: Lesson 17–18 办公室探访记
            - generic [ref=e61]:
              - checkbox "Lesson 19–20 冰淇淋休息站" [checked] [ref=e62]
              - text: Lesson 19–20 冰淇淋休息站
            - generic [ref=e63]:
              - checkbox "Lesson 21–22 寻物交接站" [checked] [ref=e64]
              - text: Lesson 21–22 寻物交接站
            - generic [ref=e65]:
              - checkbox "Lesson 23–24 房间寻物队" [checked] [ref=e66]
              - text: Lesson 23–24 房间寻物队
            - generic [ref=e67]:
              - checkbox "Lesson 25–26 厨房探访记" [checked] [ref=e68]
              - text: Lesson 25–26 厨房探访记
            - generic [ref=e69]:
              - checkbox "Lesson 27–28 客厅发现之旅" [checked] [ref=e70]
              - text: Lesson 27–28 客厅发现之旅
            - generic [ref=e71]:
              - checkbox "Lesson 29–30 房间整理行动" [checked] [ref=e72]
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
              - checkbox "选择 小禾 x00000001" [ref=e207]
              - generic [ref=e208]:
                - strong [ref=e209]: 小禾
                - generic [ref=e210]: x00000001
                - generic [ref=e211]: 首页插画核对班 · 可学习 · 待设置密码
            - generic [ref=e212]:
              - button "查看学习进度" [ref=e213] [cursor=pointer]
              - button "查看账号" [ref=e214] [cursor=pointer]
              - button "管理学生" [ref=e215] [cursor=pointer]
      - status [ref=e216]
```

# Test source

```ts
  1  | 'use strict';
  2  | const {expect}=require('@playwright/test');
  3  | const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
  4  | // These seven illustrations are the adopted course artwork, independently
  5  | // selected from the visual review. Other courses may use another composition.
  6  | const PAIRS=['17-18','19-20','21-22','23-24','25-26','27-28','29-30'];
  7  | const ART=Object.fromEntries(PAIRS.map(pair=>[pair,`assets/unit${pair}/keepsake-story-v1.webp`]));
  8  | const SHA=Object.fromEntries(PAIRS.map(pair=>[pair,crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../..',ART[pair]))).digest('hex')]));
  9  | async function imageHash(locator){return locator.evaluate(async im=>{await im.decode();const bytes=await(await fetch(im.currentSrc)).arrayBuffer();return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');});}
  10 | async function banners(page,base,info){
  11 |  for(const width of [320,390,768,1280]){
  12 |   await page.setViewportSize({width,height:900});
  13 |   for(const pair of PAIRS){
  14 |    const card=page.locator(`[data-unit="unit${pair}"]`),picture=card.locator('.featured-art img');
> 15 |    await expect(picture).toHaveCount(1);await expect(picture).toHaveAttribute('src',base+ART[pair]);await expect(picture).toBeVisible();
     |                          ^ Error: expect(locator).toHaveCount(expected) failed
  16 |    await expect.poll(()=>picture.evaluate(im=>im.complete&&im.naturalWidth>0)).toBe(true);
  17 |    const bounds=await picture.evaluate(im=>{const a=im.getBoundingClientRect(),b=im.closest('.featured-art').getBoundingClientRect(),c=im.closest('.featured-course').querySelector('.featured-copy').getBoundingClientRect();return{image:{x:a.x,y:a.y,w:a.width,h:a.height},art:{x:b.x,y:b.y,w:b.width,h:b.height},copy:{x:c.x,y:c.y,w:c.width,h:c.height},fit:getComputedStyle(im).objectFit};});
  18 |    expect(bounds.fit).toBe('contain');expect(bounds.image.w).toBeGreaterThan(150);expect(bounds.image.h).toBeGreaterThan(100);
  19 |    expect(bounds.image.x).toBeGreaterThanOrEqual(bounds.art.x-1);expect(bounds.image.x+bounds.image.w).toBeLessThanOrEqual(bounds.art.x+bounds.art.w+1);expect(bounds.image.y).toBeGreaterThanOrEqual(bounds.art.y-1);expect(bounds.image.y+bounds.image.h).toBeLessThanOrEqual(bounds.art.y+bounds.art.h+1);
  20 |    const a=bounds.image,c=bounds.copy;expect(a.x+a.w<=c.x+1||c.x+c.w<=a.x+1||a.y+a.h<=c.y+1||c.y+c.h<=a.y+1).toBe(true);
  21 |    await expect(card.locator('.primary-button')).toHaveAttribute('href',base+'unit'+pair+'/#learn/words');
  22 |    if([320,1280].includes(width))await card.screenshot({path:info.outputPath(`banner-${pair}-${width}.png`)});
  23 |   }
  24 |   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  25 |  }
  26 |  for(const pair of PAIRS)expect(await imageHash(page.locator(`[data-unit="unit${pair}"] .featured-art img`))).toBe(SHA[pair]);
  27 | }
  28 | module.exports={PAIRS,ART,SHA,banners,imageHash};
  29 | 
```