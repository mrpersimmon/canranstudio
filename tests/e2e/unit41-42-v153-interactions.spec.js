'use strict';const{test,expect}=require('@playwright/test');const{select,activity,ANSWERS}=require('../support/unit4142-v153');test.use({actionTimeout:7000,...(process.env.UNIT4142_BROWSER==='webkit'?{browserName:'webkit'}:{})});
test('场景先选后检查：数量改变有依据，第三题两次错答结算为3／5／2',async({page})=>{
  await page.goto('/unit41-42/#learn/apply');const room=page.locator('.stage-apply');
  const check=room.getByRole('button',{name:'检查答案',exact:true});
  await expect(room.locator('.bag-inventory')).toContainText('袋子里：空');
  await page.setViewportSize({width:1280,height:1000});
  await page.evaluate(()=>document.fonts.ready);
  await room.locator('.practice-options').scrollIntoViewIfNeeded();
  const before=await check.boundingBox();
  await select(room,'milk');
  await expect(room.locator('.bag-inventory')).toContainText('袋子里：空');
  expect(Math.abs((await check.boundingBox()).y-before.y)).toBeLessThan(2);
  await select(room,'bread');await check.click();
  await expect(room.locator('.bag-inventory')).toContainText('袋子里：一条面包');
  await page.reload();await expect(room.locator('.bag-inventory')).toContainText('袋子里：一条面包');
  await room.getByRole('button',{name:'下一题',exact:true}).click();
  await select(room,'两瓶牛奶');await check.click();
  await expect(room.locator('.bag-inventory')).toContainText('袋子里：一条面包、两瓶牛奶');
  await room.getByRole('button',{name:'下一题',exact:true}).click();
  for(let i=0;i<2;i++){
    await select(room,'Yes, there is.');await check.click();
    await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
    await expect(room.locator('.bag-inventory')).toContainText('袋子里：一条面包、两瓶牛奶');
    await room.getByRole('button',{name:'再试一次',exact:true}).click();
  }
  for(let i=2;i<5;i++){
    await select(room,ANSWERS.apply[i]);await check.click();
    await expect(room.locator('.fb')).toHaveText('答对了！');
    if(i===4){await expect(room.locator('.progress-copy')).toHaveText('第 5 / 5 题');await expect(room.locator('.practice-finish')).toHaveCount(0);}
    await room.getByRole('button',{name:i===4?'完成这一站':'下一题',exact:true}).click();
  }
  await expect(room.locator('.completion-number')).toHaveText(['3','5','2']);
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('同一批物品连续整理：错答和选择不移动，一瓶移出后刷新仍守恒',async({page})=>{
 await page.goto('/unit41-42/#learn/apply');const room=page.locator('.stage-apply');
 for(const answer of ['bread','两瓶牛奶','No, there isn’t.']){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 const instruction=room.getByRole('region',{name:'题目材料',exact:true});
 await expect(instruction).toContainText('Put a bottle of milk on the table.');
 const instructions=await instruction.boundingBox(),stage=await room.locator('.pantry-world').boundingBox();
 expect(instructions.y+instructions.height).toBeLessThanOrEqual(stage.y);
 const bag=room.locator('.bag-contents');const table=room.locator('.pantry-item');
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(2);await expect(table.getByRole('img')).toHaveCount(0);
 await select(room,'椅子上');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(2);await expect(table.getByRole('img')).toHaveCount(0);
 await room.getByRole('button',{name:'再试一次',exact:true}).click();const milk=await bag.locator('[data-item="milk-2"]').elementHandle();await select(room,'桌上');
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(2);await expect(table.getByRole('img')).toHaveCount(0);
 await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(1);await expect(table.getByRole('img',{name:'桌上的一瓶牛奶'})).toHaveCount(1);expect(await table.locator('img').evaluate((el,original)=>el===original,milk)).toBe(true);
 await page.reload();await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(1);await expect(table.getByRole('img')).toHaveCount(1);
 await room.getByRole('button',{name:'下一题',exact:true}).click();
 await expect(room.getByRole('heading',{name:'替 Penny 记下桌上的物品'})).toBeVisible();
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(1);await expect(table.getByRole('img')).toHaveCount(1);
 await expect(room.getByText('翻译这句话',{exact:true})).toHaveCount(0);
 await select(room,['There is','a bottle','of milk','on the table']);await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await room.getByRole('button',{name:'完成这一站',exact:true}).click();await expect(room.locator('.completion-number')).toHaveText(['3','5','1']);await expect(page.locator('#starCount')).toHaveText('0');
});
