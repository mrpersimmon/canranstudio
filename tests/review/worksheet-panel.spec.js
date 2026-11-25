'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
test('worksheet menu print invokes the original print action once',async({page})=>{
  for(const unit of ['unit1-2','unit3-4','unit5-6']){
    await page.goto('/?'+new URLSearchParams({unit,page:'writing',state:'open',device:devices[0].id}));
    await expect(page.locator('#loading')).toBeHidden({timeout:30000});
    const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
    // Observe the browser print boundary without opening a system print dialog.
    await frame.locator('body').evaluate(()=>{window.auditPrintCalls=0;window.print=()=>window.auditPrintCalls++;});
    await frame.getByRole('dialog',{name:'学习操作',exact:true}).getByRole('button',{name:'打印练习纸',exact:true}).click();
    await expect.poll(()=>frame.locator('body').evaluate(()=>window.auditPrintCalls)).toBe(1);
    await expect(frame.locator('body')).toHaveClass(/print-writing/);
    await page.emulateMedia({media:'print'});
    await expect(frame.locator('#unitWriting li').first()).toBeVisible();
    await expect(frame.locator('#unitWriting li').last()).toBeVisible();
    await expect(frame.locator('.practice-screen-menu')).not.toBeVisible();
    await page.emulateMedia({media:'screen'});
    await frame.locator('body').evaluate(()=>window.dispatchEvent(new Event('afterprint')));
    await expect(frame.locator('body')).not.toHaveClass(/print-writing/);
    await expect(frame.locator('#unitWriting')).not.toHaveAttribute('open','');
  }
});
for(const device of devices)test('worksheet header and print remain reachable on '+device.name,async({page},info)=>{
  test.setTimeout(120000);
  for(const unit of ['unit1-2','unit3-4','unit5-6']){
    await page.goto('/?'+new URLSearchParams({unit,page:'writing',state:'open',device:device.id}));
    await expect(page.locator('#loading')).toBeHidden({timeout:30000});await expect(page.locator('#error')).toBeHidden();
    const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),dialog=frame.getByRole('dialog',{name:'学习操作',exact:true}),close=dialog.getByRole('button',{name:'关闭',exact:true});
    const assertClose=async()=>{
      const r=await close.evaluate(el=>{const b=el.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom,w:innerWidth,h:innerHeight};});
      expect(r.y).toBeGreaterThanOrEqual(8);expect(r.bottom).toBeLessThanOrEqual(r.h-8);expect(r.x).toBeGreaterThanOrEqual(8);expect(r.right).toBeLessThanOrEqual(r.w-8);
    };
    await assertClose();
    const button=dialog.getByRole('button',{name:'打印练习纸',exact:true});await button.scrollIntoViewIfNeeded();
    await assertClose();await expect(button).toBeVisible();
    const geometry=await dialog.evaluate(el=>({outer:el.scrollTop,body:el.querySelector('.practice-screen-menu-content').scrollTop,horizontal:el.scrollWidth-el.clientWidth}));
    expect(geometry.outer).toBe(0);expect(geometry.body).toBeGreaterThan(0);expect(geometry.horizontal).toBe(0);
    const boxes=await button.evaluate(el=>{const r=el.getBoundingClientRect();return {bottom:r.bottom,height:r.height,h:innerHeight};});
    expect(boxes.bottom).toBeLessThanOrEqual(boxes.h-8);expect(boxes.height).toBeGreaterThanOrEqual(44);
    await page.screenshot({path:info.outputPath(unit+'-worksheet-bottom.png')});
    await close.click();await expect(dialog).not.toBeVisible();
    await frame.getByRole('button',{name:'更多学习操作',exact:true}).click();await assertClose();await dialog.press('Escape');await expect(dialog).not.toBeVisible();
  }
});
