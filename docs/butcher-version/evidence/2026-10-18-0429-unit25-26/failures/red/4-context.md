# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit25-26-v153.spec.js >> 五轮故事的手记说明准确，原题身份和已存目标不因标签修正改变
- Location: tests\e2e\unit25-26-v153.spec.js:19:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('dialog', { name: '学习手记', exact: true })
Expected substring: "整合请求、属性与位置"
Received string:    "学习手记关闭每个答题区整轮零错获一颗星；用过线索会单独记录。这份小记不评价自由口语或独立写作。读懂存在与位置 · 用中文词块说出这句话的意思。：未用额外提示答对（首次答对，额外提示未用，提交 1 次）首提的 an 与再指的 The · 先介绍一台电炉，再说同一台。：未用额外提示答对（首次答对，额外提示未用，提交 1 次）用缩写介绍表面位置 · 用 There's 开头说：罐子上有一把叉子。：未用额外提示答对（首次答对，额外提示未用，提交 1 次）整合六轮故事中的物品条件与位置 · 读到这里，乙接下来应该怎么做？：未用额外提示答对（首次答对，额外提示未用，提交 1 次）学徒手记已保存在这台设备。重试保存"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByRole('dialog', { name: '学习手记', exact: true })
    14 × locator resolved to <dialog open="" id="unitNotebook" class="unit-dialog" aria-labelledby="notebookTitle">…</dialog>
       - unexpected value "学习手记关闭每个答题区整轮零错获一颗星；用过线索会单独记录。这份小记不评价自由口语或独立写作。读懂存在与位置 · 用中文词块说出这句话的意思。：未用额外提示答对（首次答对，额外提示未用，提交 1 次）首提的 an 与再指的 The · 先介绍一台电炉，再说同一台。：未用额外提示答对（首次答对，额外提示未用，提交 1 次）用缩写介绍表面位置 · 用 There's 开头说：罐子上有一把叉子。：未用额外提示答对（首次答对，额外提示未用，提交 1 次）整合六轮故事中的物品条件与位置 · 读到这里，乙接下来应该怎么做？：未用额外提示答对（首次答对，额外提示未用，提交 1 次）学徒手记已保存在这台设备。重试保存"

```

```yaml
- dialog "学习手记":
  - heading "学习手记" [level=2]
  - button "关闭"
  - paragraph: 每个答题区整轮零错获一颗星；用过线索会单独记录。这份小记不评价自由口语或独立写作。
  - list:
    - listitem: 读懂存在与位置 · 用中文词块说出这句话的意思。：未用额外提示答对（首次答对，额外提示未用，提交 1 次）
    - listitem: 首提的 an 与再指的 The · 先介绍一台电炉，再说同一台。：未用额外提示答对（首次答对，额外提示未用，提交 1 次）
    - listitem: 用缩写介绍表面位置 · 用 There's 开头说：罐子上有一把叉子。：未用额外提示答对（首次答对，额外提示未用，提交 1 次）
    - listitem: 整合六轮故事中的物品条件与位置 · 读到这里，乙接下来应该怎么做？：未用额外提示答对（首次答对，额外提示未用，提交 1 次）
  - status: 学徒手记已保存在这台设备。
```

# Test source

```ts
  1  | 'use strict';
  2  | const {test,expect}=require('@playwright/test');
  3  | const {ANSWERS,select,story}=require('../support/unit2526-fivezones');
  4  | test.use({actionTimeout:7000,...(process.env.UNIT2526_BROWSER==='webkit'?{browserName:'webkit'}:{})});
  5  | async function next(room,answer,last=false){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:last?'完成这一站':'下一题',exact:true}).click();}
  6  | test('三道继承语法题在未答时有短示范，新提交才登记帮助',async({page},info)=>{
  7  |  await page.setViewportSize({width:320,height:568});await page.goto('/unit25-26/#learn/grammar');const room=page.locator('.stage-grammar');for(const a of ANSWERS.grammar.slice(0,10))await next(room,a);
  8  |  for(const[n,text]of [[11,'There is a pen in the box.'],[12,'The plate is clean.'],[13,'Where is the book? It is on the table.']]){const model=room.getByRole('region',{name:'短示范',exact:true});await room.screenshot({path:info.outputPath('grammar-'+n+'-unanswered.png')});await expect(model).toContainText(text);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await next(room,ANSWERS.grammar[n-1],n===13);}
  9  |  const b=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit25-26:learning:v1')));for(const id of ['u2526-types-v1-t08','u2526-clicks-v1-clean','u2526-types-v1-t10'])expect(b.records[id].revealed).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  10 | });
  11 | for(const[area,number,lines]of [
  12 |  ['roles',3,['The refrigerator is white.','It is on the right.']],
  13 |  ['exam',3,['The refrigerator is white.','It is on the right.','The cooker is blue.','It is on the left.','There is a table in the middle of the room.']],
  14 |  ['exam',4,['There is a bottle on the table.','The bottle is empty.','There is a cup on the table, too.','The cup is clean.']]
  15 | ])test(`${area}第${number}题在未选和刷新后提供完整原文依据`,async({page},info)=>{
  16 |  await page.setViewportSize({width:320,height:568});if(area==='roles')await story(page);await page.goto('/unit25-26/#learn/'+area);const room=page.locator('.stage-'+area);for(const a of ANSWERS[area].slice(0,number-1))await next(room,a);
  17 |  await room.screenshot({path:info.outputPath(area+'-'+number+'-unanswered.png')});for(const line of lines)await expect(room.locator('.practice-context')).toContainText(line);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();for(const line of lines)await expect(room.locator('.practice-context')).toContainText(line);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await next(room,ANSWERS[area][number-1],number===ANSWERS[area].length);
  18 | });
  19 | test('五轮故事的手记说明准确，原题身份和已存目标不因标签修正改变',async({page},info)=>{
> 20 |  await page.goto('/unit25-26/#learn/apply');const room=page.locator('.stage-apply');for(const a of ANSWERS.apply.slice(0,3))await next(room,a);await expect(room.locator('.task-reading-turn')).toHaveCount(5);await expect(room.locator('.task-reading')).not.toContainText('Here you are.');await select(room,ANSWERS.apply[3]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.getByRole('button',{name:'学习手记',exact:true}).click();const note=page.getByRole('dialog',{name:'学习手记',exact:true});await note.screenshot({path:info.outputPath('notebook-story-target.png')});await expect(note).toContainText('整合请求、属性与位置');await expect(note).not.toContainText('整合六轮故事');
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ^ Error: expect(locator).toContainText(expected) failed
  21 |  const r=await page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit25-26:learning:v1')).records['u2526-five-a-cup-story']);expect(r.target).toBe('整合六轮故事中的物品条件与位置');expect(r.attempts).toBe(1);
  22 | });
  23 | 
```