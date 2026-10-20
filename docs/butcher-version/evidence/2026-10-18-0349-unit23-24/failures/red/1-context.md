# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit23-24-v153.spec.js >> 回指题在选择和提示前显示请求原文，刷新仍能据原文判断
- Location: tests\e2e\unit23-24-v153.spec.js:12:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.stage-roles').locator('.practice-context')
Expected substring: "Give me some glasses please, Jane."
Received string:    "男士说：The ones on the shelf."
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.stage-roles').locator('.practice-context')
    14 × locator resolved to <div role="region" aria-label="题目材料" class="practice-context">…</div>
       - unexpected value "男士说：The ones on the shelf."

```

```yaml
- region "题目材料":
  - paragraph: 男士说：The ones on the shelf.
```

# Test source

```ts
  1  | 'use strict';
  2  | const {test,expect}=require('@playwright/test');
  3  | const {ANSWERS,select,story}=require('../support/unit2324-fivezones');
  4  | test.use({actionTimeout:7000,...(process.env.UNIT2324_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5  | async function next(room,answer,last=false){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:last?'完成这一站':'下一题',exact:true}).click();}
  6  | test('两道继承复习题在未答时有短示范，并只向本次提交登记帮助',async({page},info)=>{
  7  |  await page.setViewportSize({width:320,height:568});await page.goto('/unit23-24/#learn/grammar');const room=page.locator('.stage-grammar');for(const answer of ANSWERS.grammar.slice(0,7))await next(room,answer);
  8  |  const model=room.getByRole('region',{name:'短示范',exact:true});await room.screenshot({path:info.outputPath('grammar-8-unanswered.png')});await expect(model).toContainText('The pens are on the table.');await expect(model).not.toContainText('甲组');await next(room,ANSWERS.grammar[7]);
  9  |  await room.screenshot({path:info.outputPath('grammar-9-unanswered.png')});await expect(model).toContainText('Give me my book, please.');await expect(model).toContainText('Give us our pens, please.');await expect(model).not.toContainText('Give us our umbrellas');await next(room,ANSWERS.grammar[8],true);
  10 |  const book=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit23-24:learning:v1')));for(const id of ['u2324-v1-on-contact','u2324-v1-recipient-us'])expect(book.records[id].revealed).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  11 | });
  12 | test('回指题在选择和提示前显示请求原文，刷新仍能据原文判断',async({page},info)=>{
> 13 |  await story(page);await page.goto('/unit23-24/#learn/roles');const room=page.locator('.stage-roles');await next(room,ANSWERS.roles[0]);await room.screenshot({path:info.outputPath('roles-2-unanswered.png')});await expect(room.locator('.practice-context')).toContainText('Give me some glasses please, Jane.');await expect(room.locator('.practice-context')).toContainText('No, not those. The ones on the shelf.');await expect(room.locator('.practice-context')).not.toContainText('ones代替');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await expect(room.locator('.practice-context')).toContainText('Give me some glasses please, Jane.');await next(room,ANSWERS.roles[1],true);
     |                                                                                                                                                                                                                                                                 ^ Error: expect(locator).toContainText(expected) failed
  14 | });
  15 | test('归属与接收者题在未答时明确递回请求，不能只给物主事实',async({page},info)=>{
  16 |  await page.goto('/unit23-24/#learn/exam');const room=page.locator('.stage-exam');for(const answer of ANSWERS.exam.slice(0,7))await next(room,answer);await room.screenshot({path:info.outputPath('exam-8-unanswered.png')});await expect(room.locator('.practice-context')).toContainText('他们请简把这些盒子递回给自己。');await expect(room.locator('.grammar-model')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await select(room,{fills:['our']});await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.locator('.practice-context')).toContainText('他们请简把这些盒子递回给自己。');await select(room,ANSWERS.exam[7]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
  17 | });
  18 | 
```