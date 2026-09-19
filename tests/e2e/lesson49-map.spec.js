'use strict';
const { test, expect } = require('@playwright/test');

test('Lesson 49 从导航进入再返回，回到自己的词卡并保留星星', async ({ page }) => {
  await page.addInitScript(()=>{
    if(localStorage.getItem('seeded'))return;
    localStorage.setItem('seeded','yes');
    localStorage.setItem('canran:l49:progress:v2',JSON.stringify({version:2,ratings:{l1:3,l2:0,l3:0,l4:0,l5:0}}));
  });
  await page.goto('/?district=first-book-49-60&focus=lesson49');
  const card=page.getByRole('link',{name:/Lesson 49 肉店大冒险/});
  await expect(card).toBeFocused();await expect(card).toContainText('3 / 15 颗星');
  await card.click();await expect(page.locator('#starCount')).toHaveText('3');
  await page.getByRole('link',{name:'我的课程',exact:true}).click();
  await expect(card).toBeFocused();await expect(card).toContainText('3 / 15 颗星');
});
