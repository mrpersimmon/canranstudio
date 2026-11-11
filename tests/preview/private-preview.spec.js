'use strict';
const {test,expect}=require('@playwright/test');
const {devices,contextOptions}=require('../support/required-phone-devices');
async function ready(page){
  // After a form redirect, a missing #loading is not proof that the course is ready.
  await expect(page.locator('#frame-shell iframe:not(.pending)')).toBeVisible({timeout:45000});
  await expect(page.locator('#loading')).toBeHidden();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');
  await expect(page.locator('#error')).toBeHidden();
}
for(const device of devices)test(device.name+' private entry, original review interaction and logout',async({browser,baseURL},info)=>{
  const context=await browser.newContext({...contextOptions(device),baseURL});const page=await context.newPage();
  page.setDefaultTimeout(10000);
  try {
    await page.goto('/?unit=unit143-144&page=q%3Au143144-v1-a-past&state=review&device='+device.id);
    await expect(page.getByRole('heading',{name:'页面验收台'})).toBeVisible();
    const field=page.getByLabel('验收口令',{exact:true});await field.fill('incorrect-preview-code');
    await page.getByRole('button',{name:'进入验收台'}).click();await expect(page.getByRole('alert')).toHaveText('口令不正确，请重试。');
    await field.fill('synthetic-preview-code-123');await page.getByRole('button',{name:'进入验收台'}).click();
    await ready(page);
    expect(new URL(page.url()).searchParams.get('unit')).toBe('unit143-144');
    await expect(page.locator('.local-badge')).toContainText('aaaaaaaa');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(const selector of ['.bench-header','.toolbar','#state-buttons']){
      const rect=await page.locator(selector).boundingBox();expect(rect.x).toBeGreaterThanOrEqual(0);expect(rect.x+rect.width).toBeLessThanOrEqual(device.viewport.width+1);
    }
    const header=await page.locator('.bench-header').boundingBox(),toolbar=await page.locator('.toolbar').boundingBox();expect(header.y+header.height).toBeLessThanOrEqual(toolbar.y+1);
    const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
    await page.locator('#state-buttons [data-state="wrong"]').click();
    await ready(page);
    await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
    await page.locator('#state-buttons [data-state="full"]').click();
    await ready(page);
    await expect(frame.getByRole('dialog',{name:'题目材料',exact:true})).toBeVisible();
    await frame.getByRole('button',{name:'关闭学习参考'}).click();
    await expect(frame.getByRole('dialog',{name:'题目材料',exact:true})).toBeHidden();
    await page.getByRole('button',{name:'实测模式',exact:true}).click();
    await expect.poll(()=>frame.locator('body').evaluate(()=>innerWidth)).toBe(device.viewport.width);
    await expect(page.locator('#frame-shell iframe:not(.pending)')).toHaveCSS('transform','none');
    expect((await page.locator('#frame-shell').boundingBox()).height).toBeGreaterThan(device.viewport.height-60);
    await page.screenshot({path:info.outputPath('actual-phone-preview.png')});
    await page.getByRole('button',{name:'返回验收台',exact:false}).click();
    await expect(page.locator('.toolbar')).toBeVisible();
    expect(await page.evaluate(async()=>('serviceWorker'in navigator?(await navigator.serviceWorker.getRegistrations()).length:0))).toBe(0);
    await page.screenshot({path:info.outputPath('authenticated-preview.png'),fullPage:true});
    await page.getByRole('button',{name:'退出验收',exact:true}).click();
    await expect(page.getByRole('button',{name:'进入验收台'})).toBeVisible();
    expect((await page.request.get('/review/catalog.json')).status()).toBe(401);
    await page.goto('/lesson/unit143-144/');await expect(page.getByLabel('验收口令',{exact:true})).toBeVisible();
  } finally {await context.close();}
});
