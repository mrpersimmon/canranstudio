# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit29-30-v153-content.spec.js >> E4在未答和刷新后提供开窗后的原句，独立判断先后
- Location: tests\e2e\unit29-30-v153-content.spec.js:11:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.stage-exam').locator('.practice-context')
Expected substring: "Then put these clothes in the wardrobe."
Received string:    "原文中，Open the window and air the room. 后面，"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.stage-exam').locator('.practice-context')
    14 × locator resolved to <div role="region" aria-label="题目材料" class="practice-context">…</div>
       - unexpected value "原文中，Open the window and air the room. 后面，"

```

```yaml
- region "题目材料":
  - paragraph: 原文中，Open the window and air the room. 后面，
```

# Test source

```ts
  1  | 'use strict';
  2  | const {test,expect}=require('@playwright/test');
  3  | const {ANSWERS,select,story,activity}=require('../support/unit2930-fivezones');
  4  | test.use({actionTimeout:7000,viewport:{width:320,height:568},...(process.env.UNIT2930_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5  | async function reach(page,id,index){if(id==='roles')await story(page);await page.goto('/unit29-30/#learn/'+id);const room=page.locator('.stage-'+id);for(const answer of ANSWERS[id].slice(0,index)){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}return room;}
  6  | test('R2在未答和刷新后提供连续原文，不靠猜测唯一家务流程',async({page},info)=>{
  7  |  const room=await reach(page,'roles',1);await room.screenshot({path:info.outputPath('roles-02-unanswered.png')});for(const line of ['Then put these clothes in the wardrobe.','Then make the bed.','Dust the dressing table.','Then sweep the floor.'])await expect(room.locator('.practice-context')).toContainText(line);
  8  |  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await expect(room.locator('.practice-context')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  9  |  await select(room,['Dust the dressing table.','Then make the bed.','Then sweep the floor.']);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  10 | });
  11 | test('E4在未答和刷新后提供开窗后的原句，独立判断先后',async({page},info)=>{
> 12 |  const room=await reach(page,'exam',3);await room.screenshot({path:info.outputPath('exam-04-unanswered.png')});for(const line of ['Open the window and air the room.','Then put these clothes in the wardrobe.','Then make the bed.'])await expect(room.locator('.practice-context')).toContainText(line);
     |                                                                                                                                                                                                                                                                                       ^ Error: expect(locator).toContainText(expected) failed
  13 |  await expect(room.locator('.grammar-model')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await expect(room.locator('.practice-context')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  14 |  await select(room,'整理床铺 · 收衣服进衣柜');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  15 | });
  16 | test('G9与G11提供短示范并记录支持，G10继续撤支持练习',async({page},info)=>{
  17 |  test.setTimeout(120000);await activity(page,'grammar',{inspect:async(room,index,state)=>{if(state!=='before')return;if([8,10].includes(index)){await room.screenshot({path:info.outputPath('grammar-'+(index+1)+'-model.png')});await expect(room.getByRole('region',{name:'短示范',exact:true})).toBeVisible();}if(index===9)await expect(room.locator('.grammar-model')).toHaveCount(0);}});
  18 |  const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit29-30:learning:v1')).records);for(const id of ['u2930-v1-must-purpose','u2930-v1-bedroom-is'])expect(records[id].revealed).toBe(true);expect(Boolean(records['u2930-v1-base-verb'].revealed)).toBe(false);
  19 | });
  20 | 
```