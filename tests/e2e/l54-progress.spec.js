'use strict';
const {test,expect}=require('@playwright/test');
const KEY='canran:l54:progress:v2';

async function seed(page,ratings){
  await page.addInitScript(({key,values})=>{
    if(localStorage.getItem(key)===null){
      localStorage.setItem(key,JSON.stringify({version:2,ratings:values}));
    }
  },{key:KEY,values:ratings});
}

test('Lesson 54 exposes an actionable locked certificate from zero stars',async({page})=>{
  await page.goto('/lesson54/#cert');
  await expect(page.locator('#btnPrint')).toBeEnabled();
  await expect(page.locator('#btnPrint')).toHaveAttribute('data-certificate-state','locked');
  await page.locator('#btnPrint').click();
  await expect(page.locator('[data-certificate-count]')).toHaveText('还差 15 颗星，还有 5 关未满星。');
});

test('Lesson 54 jumps to its first not-full-star passport stop',async({page})=>{
  await seed(page,{l1:3,l2:2,l3:3,l4:0,l5:3});
  await page.goto('/lesson54/#cert');
  await page.locator('#btnPrint').click();
  await expect(page.locator('[data-certificate-go]')).toHaveText('前往「机场广播剧」补满星');
  await page.locator('[data-certificate-go]').click();
  await expect(page).toHaveURL(/#w2$/);
  await expect(page.locator('#w2 h2')).toBeFocused();
});

test('Lesson 54 blocks fourteen stars and prints at fifteen',async({page})=>{
  await seed(page,{l1:3,l2:3,l3:3,l4:3,l5:2});
  await page.addInitScript(()=>{window.__printCalls=0;window.print=()=>{window.__printCalls+=1;};});
  await page.goto('/lesson54/#cert');
  await page.locator('#certName').fill('小明');
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(()=>window.__printCalls)).toBe(0);
  await page.waitForTimeout(700);
  expect(await page.evaluate(()=>window.__printCalls)).toBe(0);
  await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({
    version:2,ratings:{l1:3,l2:3,l3:3,l4:3,l5:3}
  })),KEY);
  await page.reload();
  await page.locator('#certName').fill('小明');
  await page.locator('#btnPrint').click();
  await expect.poll(()=>page.evaluate(()=>window.__printCalls),{timeout:1500}).toBe(1);
});
