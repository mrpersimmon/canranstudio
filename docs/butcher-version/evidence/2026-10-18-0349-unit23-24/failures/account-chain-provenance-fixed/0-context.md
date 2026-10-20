# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit23-24-v153-upgrade.spec.js >> 原45题五星同库更新：原卡全部帧、日期、未改轮次和跨设备历史保留
- Location: tests\login\unit23-24-v153-upgrade.spec.js:12:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 52
+ Received  + 52

@@ -39,22 +39,22 @@
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "matchOrder": Array [
+       "1",
+       "3",
        "2",
-       "3",
-       "1",
      ],
      "pairs": Array [
        "1",
        "2",
        "3",
      ],
      "prompt": "给物品词配对。",
      "questionId": "u2324-tasks-v4-objects",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "[\"1\",\"2\",\"3\"]",
      "target": "区分餐具与两类读物",
    },
    "u2324-tasks-v4-story-place": Object {
      "attempts": 1,
@@ -62,11 +62,11 @@
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "prompt": "点出说明杯子位置的词组。",
      "questionId": "u2324-tasks-v4-story-place",
-     "runId": "74a0baeb-d575-4e98-9504-1fea345ccde6",
+     "runId": "d1973b73-2ca2-4403-93df-cc6a7068f92a",
      "selection": "on the shelf",
      "target": "原文中找到位置限制",
    },
    "u2324-v1-build-confirm": Object {
      "attempts": 1,
@@ -74,16 +74,16 @@
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "prompt": "哪些？这些吗？",
      "questionId": "u2324-v1-build-confirm",
-     "runId": "5b83f5ce-dc5f-4b42-8336-30f7acc08b94",
+     "runId": "77489527-2116-45d2-b702-9f0cbfd38193",
      "selection": "Which ones? These?",
      "target": "组织复数询问和确认",
      "tokenOrder": Array [
-       2,
        1,
+       2,
        0,
      ],
      "tokens": Array [
        0,
        1,
@@ -96,22 +96,22 @@
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "prompt": "不，不是那些。桌子上的那些。",
      "questionId": "u2324-v1-build-location",
-     "runId": "5b83f5ce-dc5f-4b42-8336-30f7acc08b94",
+     "runId": "77489527-2116-45d2-b702-9f0cbfd38193",
      "selection": "No, not those. The ones on the table.",
      "target": "否定当前一组并用位置限定",
      "tokenOrder": Array [
        7,
-       2,
+       1,
+       0,
        4,
        3,
-       0,
-       1,
        6,
        5,
+       2,
      ],
      "tokens": Array [
        0,
        1,
        2,
@@ -128,19 +128,19 @@
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "prompt": "请给我们一些盒子。",
      "questionId": "u2324-v1-build-request",
-     "runId": "5b83f5ce-dc5f-4b42-8336-30f7acc08b94",
+     "runId": "77489527-2116-45d2-b702-9f0cbfd38193",
      "selection": "Give us some boxes, please.",
      "target": "组织带复数物品的请求",
      "tokenOrder": Array [
        1,
-       4,
+       0,
+       2,
        3,
-       2,
-       0,
+       4,
      ],
      "tokens": Array [
        0,
        1,
        2,
@@ -310,55 +310,55 @@
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
        "丙组",
-       "甲组",
        "乙组",
+       "甲组",
      ],
      "prompt": "The books on the desk.
  应该拿哪一组书？",
      "questionId": "u2324-v1-on-contact",
-     "runId": "dea037d0-f674-4674-a697-1996981a2de3",
+     "runId": "a5270a1e-f885-447a-b808-20a220d5b673",
      "selection": "甲组",
      "target": "根据表面接触关系理解位置限定",
    },
    "u2324-v1-recipient-us": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
+       "our",
        "us",
-       "our",
        "we",
      ],
      "prompt": "两位同学请简把雨伞递回给自己，一起说：
  Those are our umbrellas.
  Give ___ our umbrellas please.
  空格填什么？",
      "questionId": "u2324-v1-recipient-us",
-     "runId": "dea037d0-f674-4674-a697-1996981a2de3",
+     "runId": "a5270a1e-f885-447a-b808-20a220d5b673",
      "selection": "us",
      "target": "为已明确的接收者选择宾格形式",
    },
    "u2324-v1-request-plural": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
+       "Give me some books, please.",
        "Give me some book, please.",
        "Give me a book, please.",
-       "Give me some books, please.",
      ],
      "prompt": "原来要一本书，现在要几本。
  哪句话符合新要求？",
      "questionId": "u2324-v1-request-plural",
-     "runId": "5ffb8b22-9e9a-4f60-9c82-953b1c69c2d4",
+     "runId": "77489527-2116-45d2-b702-9f0cbfd38193",
      "selection": "Give me some books, please.",
      "target": "数量改变时同步改变限定词与名词",
    },
    "u2324-v1-story-ones": Object {
      "attempts": 1,
@@ -372,11 +372,11 @@
        "数字一",
      ],
      "prompt": "男士说：The ones on the shelf.
  这里的 ones 代替什么？",
      "questionId": "u2324-v1-story-ones",
-     "runId": "74a0baeb-d575-4e98-9504-1fea345ccde6",
+     "runId": "d1973b73-2ca2-4403-93df-cc6a7068f92a",
      "selection": "前面说到的那些玻璃杯",
      "target": "根据前文确定复数代词指向",
    },
    "u2324-v1-these-perspective": Object {
      "attempts": 1,
@@ -390,180 +390,180 @@
        "This one?",
      ],
      "prompt": "你指着自己手边的两本书问“这些吗？”
  应该说什么？",
      "questionId": "u2324-v1-these-perspective",
-     "runId": "5ffb8b22-9e9a-4f60-9c82-953b1c69c2d4",
+     "runId": "77489527-2116-45d2-b702-9f0cbfd38193",
      "selection": "These?",
      "target": "从说话者手边的多件物品确认",
    },
    "u2324-v1-vocab-bed": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
+       "desk",
        "chair",
+       "cupboard",
        "bed",
-       "cupboard",
-       "desk",
      ],
      "prompt": "看看图，选出英文。",
      "questionId": "u2324-v1-vocab-bed",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "bed",
      "target": "理解 bed 的本课含义",
    },
    "u2324-v1-vocab-cigarette": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
-       "勺子",
        "香烟",
-       "粉笔",
+       "勺子",
        "钢笔",
+       "粉笔",
      ],
      "prompt": "cigarette
  选出这个词的意思。",
      "questionId": "u2324-v1-vocab-cigarette",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "香烟",
      "target": "理解 cigarette 的本课含义",
    },
    "u2324-v1-vocab-cupboard": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
+       "橱柜",
        "地板",
-       "床",
-       "橱柜",
        "梳妆台",
+       "床",
      ],
      "prompt": "cupboard
  选出这个词的意思。",
      "questionId": "u2324-v1-vocab-cupboard",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "橱柜",
      "target": "理解 cupboard 的本课含义",
    },
    "u2324-v1-vocab-desk": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
+       "床",
+       "盘子",
        "椅子",
        "书桌；课桌",
-       "盘子",
-       "床",
      ],
      "prompt": "desk
  选出这个词的意思。",
      "questionId": "u2324-v1-vocab-desk",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "书桌；课桌",
      "target": "理解 desk 的本课含义",
    },
    "u2324-v1-vocab-dressing table": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
+       "shelf",
        "bed",
        "cupboard",
        "dressing table",
-       "shelf",
      ],
      "prompt": "看看图，选出英文。",
      "questionId": "u2324-v1-vocab-dressing table",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "dressing table",
      "target": "理解 dressing table 的本课含义",
    },
    "u2324-v1-vocab-floor": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
+       "屋顶",
        "地板",
-       "屋顶",
+       "桌面",
        "书架",
-       "桌面",
      ],
      "prompt": "on the floor
  floor 在这里表示什么？",
      "questionId": "u2324-v1-vocab-floor",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "地板",
      "target": "理解 floor 的本课含义",
    },
    "u2324-v1-vocab-on": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
+       "在……旁边",
        "在……里面",
        "在……上面",
        "在……下面",
-       "在……旁边",
      ],
      "prompt": "on the shelf
  on 在这里表示什么？",
      "questionId": "u2324-v1-vocab-on",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "在……上面",
      "target": "理解 on 的本课含义",
    },
    "u2324-v1-vocab-shelf": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
-       "架子；搁板",
        "椅子",
+       "架子；搁板",
        "书",
        "盘子",
      ],
      "prompt": "shelf
  选出这个词的意思。",
      "questionId": "u2324-v1-vocab-shelf",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "架子；搁板",
      "target": "理解 shelf 的本课含义",
    },
    "u2324-v1-vocab-some": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
+       "一副眼镜。",
+       "正好两个玻璃杯。",
        "一些玻璃杯，没说具体几只。",
        "只有一个玻璃杯。",
-       "一副眼镜。",
-       "正好两个玻璃杯。",
      ],
      "prompt": "some glasses
  这里表示多少？",
      "questionId": "u2324-v1-vocab-some",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "一些玻璃杯，没说具体几只。",
      "target": "理解 some 的本课含义",
    },
    "u2324-v1-vocab-stereo": Object {
      "attempts": 1,
@@ -571,37 +571,37 @@
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
        "台灯",
-       "立体声音响",
        "电视机",
        "书桌",
+       "立体声音响",
      ],
      "prompt": "stereo
  本课说的是哪种物品？",
      "questionId": "u2324-v1-vocab-stereo",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "立体声音响",
      "target": "理解 stereo 的本课含义",
    },
    "u2324-v1-vocab-table": Object {
      "attempts": 1,
      "checked": true,
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
-       "bed",
        "table",
        "shelf",
        "plate",
+       "bed",
      ],
      "prompt": "桌子
  选出对应的英文。",
      "questionId": "u2324-v1-vocab-table",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "table",
      "target": "理解 table 的本课含义",
    },
    "u2324-v1-vocab-television": Object {
      "attempts": 1,
@@ -609,17 +609,17 @@
      "correct": true,
      "firstCorrect": true,
      "hintUsed": false,
      "optionOrder": Array [
        "cupboard",
-       "stereo",
        "newspaper",
+       "stereo",
        "television",
      ],
      "prompt": "电视机
  选出对应的英文。",
      "questionId": "u2324-v1-vocab-television",
-     "runId": "295fb0d0-ef8d-4862-8776-421b2c9ede48",
+     "runId": "1e3e8cca-0f23-416d-8ab0-664bf8a4fedf",
      "selection": "television",
      "target": "理解 television 的本课含义",
    },
  }
```

# Test source

```ts
  1  | 'use strict';
  2  | const {test,expect}=require('@playwright/test');
  3  | const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
  4  | const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
  5  | const {adminLogin,createStudent,signIn}=require('./helpers');
  6  | const old=require('../support/unit2324-before-v153'),fresh=require('../support/unit2324-fivezones');
  7  | const {FILES}=require('../support/unit2324-v153-legacy');
  8  | const readLearning=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit23-24:learning:v1')));
  9  | const {defaultBrowserType,...mobileProfile}=require('@playwright/test').devices['iPhone 13'];
  10 | test.use({actionTimeout:10000,...(process.env.UNIT2324_BROWSER==='webkit'?{...mobileProfile,browserName:'webkit'}:{})});
  11 | async function linkOrCopy(a,b){if((await fs.stat(a)).isDirectory())await fs.symlink(a,b,process.platform==='win32'?'junction':'dir');else await fs.copyFile(a,b);}
  12 | test('原45题五星同库更新：原卡全部帧、日期、未改轮次和跨设备历史保留',async({browser},info)=>{
  13 |  test.setTimeout(360000);
  14 |  const root=path.resolve(__dirname,'../..'),temporary=await fs.mkdtemp(path.join(os.tmpdir(),'canran-u2324-v153-')),oldRoot=path.join(temporary,'old-site'),dataDir=path.join(temporary,'accounts');
  15 |  const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1),ports=require('../support/login-test-ports'),origin=ports.origin(4271),chain=process.env.UNIT2324_CHAIN_LEGACY==='1';
  16 |  let server,first,second,oldIssuedAt,oldDate;
  17 |  const ledger=()=>{const {DatabaseSync}=require('node:sqlite'),db=new DatabaseSync(path.join(dataDir,'learning.sqlite'),{readOnly:true});try{return db.prepare('SELECT edition,value FROM unit_awards WHERE course=? ORDER BY edition').all('unit23-24');}finally{db.close();}};
  18 |  const ready=async p=>expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
  19 |  const restore45=async()=>{for(const n of FILES)await fs.copyFile(path.join(root,'tests/fixtures/unit23-24-before-v153',n),path.join(oldRoot,'unit23-24',n));};
  20 |  try{
  21 |   await fs.mkdir(oldRoot);for(const entry of await fs.readdir(root,{withFileTypes:true})){if(['.git','unit23-24'].includes(entry.name))continue;if(/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const n of await fs.readdir(path.join(root,entry.name)))await linkOrCopy(path.join(root,entry.name,n),path.join(oldRoot,entry.name,n));}else await linkOrCopy(path.join(root,entry.name),path.join(oldRoot,entry.name));}
  22 |   await fs.mkdir(path.join(oldRoot,'unit23-24'));await restore45();
  23 |   if(chain){for(const n of ['index.html','content.js','unit.js','unit.css','scene.js'])await fs.copyFile(path.join(root,'tests/fixtures/unit23-24-before-fivezones',n),path.join(oldRoot,'unit23-24',n));await fs.copyFile(path.join(root,'core/course-catalog.js'),path.join(oldRoot,'unit23-24/legacy-catalog.js'));const html=path.join(oldRoot,'unit23-24/index.html');await fs.writeFile(html,(await fs.readFile(html,'utf8')).replaceAll('/tests/fixtures/unit23-24-before-fivezones/','/unit23-24/').replace('/core/course-catalog.js','/unit23-24/legacy-catalog.js'));}
  24 |   const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();
  25 |   const stop=async()=>{await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;};const start=async previous=>{server=await createApp({root:previous?oldRoot:root,dataDir,origin,basePath:base});await new Promise(resolve=>server.listen(ports.port(4271),'127.0.0.1',resolve));};
  26 |   await start(true);first=await browser.newContext({baseURL:origin,...(process.env.UNIT2324_BROWSER==='webkit'?mobileProfile:{})});const p=await first.newPage();await adminLogin(p,base);const account=await createStudent(p,'五星记录保留验收班','小禾',[/Lesson 23–24/]);await signIn(p,account,base);
  27 |   if(chain){await require('../support/unit23-24-flow').completeUnit2324(p,prefix);await p.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await p.getByRole('button',{name:'领取单元证书',exact:true}).click();oldDate=await p.locator('#certificateDate').innerText();oldIssuedAt=(await readLearning(p)).activity.unitClassroomCertificateIssuedAt;await p.keyboard.press('Escape');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await stop();await restore45();await start(true);await p.goto(base+'unit23-24/?course-retry=1#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('0');info.annotations.push({type:'historical-chain',description:'Real 32-question 15-star certificate -> real 45-question five-star edition -> current 45-question edition'});}
  28 |   await old.story(p,prefix);for(const id of Object.keys(old.ANSWERS)){const room=await old.activity(p,id,{base:prefix,expectPerfect:!chain});if(chain){await room.getByRole('button',{name:'再练一轮',exact:true}).click();await old.activity(p,id,{base:prefix});}}
  29 |   await expect(p.locator('#starCount')).toHaveText('5');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await p.goto(base+'unit23-24/#learn/certificate');await ready(p);
  30 |   const date=await p.locator('#certificateDate').innerText(),before=await readLearning(p),awards=ledger();await fs.writeFile(info.outputPath('before45-progress.json'),JSON.stringify(before));expect(awards).toHaveLength(1);expect(awards[0].edition).toBe('glasses-five-zones-v1');const priorRecords={...before.records};if(chain){expect(Object.keys(priorRecords)).toHaveLength(46);expect(priorRecords['u2324-v1-final-v2-on']).toEqual(before.activity.unit2324LegacySnapshot.records['u2324-v1-final-v2-on']);delete priorRecords['u2324-v1-final-v2-on'];}expect(Object.keys(priorRecords)).toHaveLength(45);expect(Boolean(before.records['u2324-v1-on-contact'].revealed)).toBe(false);
  31 |   await fs.writeFile(info.outputPath('before45-progress.json'),JSON.stringify(before));
  32 |   const original=info.outputPath('original-five-star.gif');let download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();await(await download).saveAs(original);
  33 |   await stop();await start(false);await p.goto(base+'unit23-24/?course-retry=1#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('5');await expect(p.locator('#certificateDate')).toHaveText(date);await expect(p.locator('#certificateName')).toHaveText('小禾');await p.getByText('之前的五星学习记录',{exact:true}).click();await expect(p.locator('.historical-learning li')).toHaveCount(45);
  34 |   const retained=info.outputPath('retained-five-star.gif');download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();await(await download).saveAs(retained);const sharp=require('sharp');expect((await sharp(original,{animated:true}).raw().toBuffer()).equals(await sharp(retained,{animated:true}).raw().toBuffer())).toBe(true);expect(ledger()).toEqual(awards);await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('retained-five-star-card.png')});
  35 |   second=await browser.newContext({baseURL:origin,...(process.env.UNIT2324_BROWSER==='webkit'?mobileProfile:{})});const other=await second.newPage();await signIn(other,account,base);await other.goto(base+'unit23-24/#learn/certificate');await ready(other);await expect(other.locator('#starCount')).toHaveText('5');await expect(other.locator('#certificateDate')).toHaveText(date);await expect(other.locator('#certificateName')).toHaveText('小禾');
> 36 |   const after=await readLearning(other);await fs.writeFile(info.outputPath('after45-progress.json'),JSON.stringify(after));info.annotations.push({type:'history-storage',description:JSON.stringify({snapshot:Boolean(after.activity.unit2324V153Snapshot),remote:Boolean(after.activity.unit2324V153Progress),marker:after.activity.unit2324V153Migration,remoteRecords:Object.keys(after.activity.unit2324V153Progress?.records||{}).length})});expect((after.activity.unit2324V153Snapshot||after.activity.unit2324V153Progress).records).toEqual(priorRecords);if(chain){expect(Object.keys(after.activity.unit2324LegacyProgress.records)).toHaveLength(32);expect(after.activity.unit2324LegacyProgress.records).toEqual(before.activity.unit2324LegacyProgress.records);}await other.getByText('之前的五星学习记录',{exact:true}).click();await expect(other.locator('.historical-learning li')).toHaveCount(45);
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ^ Error: expect(received).toEqual(expected) // deep equality
  37 |   for(const id of ['listen','grammar','apply']){await other.goto(base+'unit23-24/#learn/'+id);await ready(other);await expect(other.locator('.stage-'+id+' .completion-number')).toHaveText([String(old.ANSWERS[id].length),String(old.ANSWERS[id].length),'0']);const key='unit2324-'+id+'-practice/five-zones-v1';expect(after.groups[key].runId).toBe(before.groups[key].runId);expect(after.groups[key].states).toEqual(before.groups[key].states);}
  38 |   await other.goto(base+'unit23-24/#learn/roles');await expect(other.locator('.stage-roles .progress-copy')).toHaveText('第 2 / 2 题');await expect(other.locator('.stage-roles').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await fresh.activity(other,'roles',{base:prefix,expectPerfect:false});
  39 |   await other.goto(base+'unit23-24/#learn/exam');await expect(other.locator('.stage-exam .progress-copy')).toHaveText('第 8 / 15 题');await expect(other.locator('.stage-exam').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await fresh.activity(other,'exam',{base:prefix,expectPerfect:false});
  40 |   // Re-practising unchanged questions records the new visible support without
  41 |   // rewriting the frozen original independent submissions or old award date.
  42 |   await other.goto(base+'unit23-24/#learn/grammar');await other.locator('.stage-grammar').getByRole('button',{name:'再练一轮',exact:true}).click();await fresh.activity(other,'grammar',{base:prefix});await expect(other.locator('#studentSyncStatus')).toHaveText('学习成果已同步');expect(ledger()).toEqual(awards);await p.reload();await ready(p);expect((await readLearning(p)).activity.unit2324V153Snapshot.records).toEqual(before.records);await expect(p.locator('#certificateDate')).toHaveText(date);
  43 |   if(chain){for(const tab of [p,other]){await tab.goto(base+'unit23-24/#learn/certificate');await ready(tab);await tab.locator('.legacy-learning>summary').click();await expect(tab.locator('.legacy-issued-date')).toHaveAttribute('data-issued-at',oldIssuedAt);await tab.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(tab.locator('#legacyCertificateDate')).toHaveText(oldDate);await expect(tab.locator('#legacyCertificateName')).toHaveText('小禾');await tab.keyboard.press('Escape');}await p.locator('.legacy-learning').screenshot({path:info.outputPath('retained-15-star-history.png')});}
  44 |  }finally{await first?.close();await second?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});if(!path.resolve(temporary).startsWith(path.join(os.tmpdir(),'canran-u2324-v153-')))throw Error('Unexpected test cleanup path');await fs.rm(temporary,{recursive:true,force:true});}
  45 | });
  46 | 
```