# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit27-28-v153-content.spec.js >> E3在未答页保留三种读物的原句，独立整合位置
- Location: tests\e2e\unit27-28-v153-content.spec.js:18:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.stage-exam').locator('.practice-context')
Expected substring: "There are some magazines on the television."
Received string:    "根据课文：magazines、newspapers、books"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.stage-exam').locator('.practice-context')
    14 × locator resolved to <div role="region" aria-label="题目材料" class="practice-context">…</div>
       - unexpected value "根据课文：magazines、newspapers、books"

```

```yaml
- region "题目材料":
  - paragraph: 根据课文：magazines、newspapers、books
```

# Test source

```ts
  1  | 'use strict';
  2  | const {test,expect}=require('@playwright/test');
  3  | const {ANSWERS,select,story,activity}=require('../support/unit2728-fivezones');
  4  | test.use({actionTimeout:7000,...(process.env.UNIT2728_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5  | async function reach(page,id,index){
  6  |  if(id==='roles')await story(page);
  7  |  await page.goto('/unit27-28/#learn/'+id);const room=page.locator('.stage-'+id);
  8  |  for(const answer of ANSWERS[id].slice(0,index)){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}
  9  |  return room;
  10 | }
  11 | test('R2在未答页提供原文，区分物品与邻近参照物',async({page},info)=>{
  12 |  const room=await reach(page,'roles',1);await room.screenshot({path:info.outputPath('roles-02-unanswered.png')});
  13 |  await expect(room.locator('.practice-context')).toContainText('There are some armchairs in the room.');
  14 |  await expect(room.locator('.practice-context')).toContainText('The armchairs are near the table.');
  15 |  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  16 |  await select(room,'the window');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  17 | });
  18 | test('E3在未答页保留三种读物的原句，独立整合位置',async({page},info)=>{
  19 |  const room=await reach(page,'exam',2);await room.screenshot({path:info.outputPath('exam-03-unanswered.png')});
> 20 |  for(const line of ['There are some magazines on the television.','There are some newspapers on the table.','There are some books on the stereo.'])await expect(room.locator('.practice-context')).toContainText(line);
     |                                                                                                                                                                                                    ^ Error: expect(locator).toContainText(expected) failed
  21 |  await expect(room.locator('.grammar-model')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  22 |  await select(room,'television · stereo · table');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  23 | });
  24 | test('G2和G11短示范记录实际支持，G10与G12保留撤支持练习',async({page},info)=>{
  25 |  test.setTimeout(120000);await activity(page,'grammar',{inspect:async(room,index,state)=>{
  26 |   if(state!=='before')return;
  27 |   if([1,10].includes(index)){await room.screenshot({path:info.outputPath('grammar-'+(index+1)+'-model.png')});await expect(room.getByRole('region',{name:'短示范',exact:true})).toBeVisible();}
  28 |   if([9,11].includes(index))await expect(room.locator('.grammar-model')).toHaveCount(0);
  29 |  }});
  30 |  const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit27-28:learning:v1')).records);
  31 |  for(const id of ['u2728-v1-plural-existence','u2728-v1-ask-existence'])expect(records[id].revealed).toBe(true);
  32 |  for(const id of ['u2728-v1-irregular','u2728-v1-they-reference'])expect(Boolean(records[id].revealed)).toBe(false);
  33 | });
  34 | 
```