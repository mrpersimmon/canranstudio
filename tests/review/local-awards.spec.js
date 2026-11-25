'use strict';
const {test,expect}=require('@playwright/test'),{devices}=require('../support/required-phone-devices');
for(const device of devices)test(device.id+' reviews local star animation and unconfirmed full card',async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit:'unit1-2',page:'award:listen',state:'pending',device:device.id,stars:'1'}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 await expect(page.locator('#state-buttons [data-state=pending]')).toBeVisible();let frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());const reveal=frame.locator('.award-reveal[open]');
 await expect(reveal).toHaveAttribute('data-dismissible','true');await expect(reveal).toContainText('待同步');await expect(frame.locator('#starCount')).toHaveText('1');await page.locator('#frame-shell').screenshot({path:info.outputPath('local-star.png')});
 await page.goto('/?'+new URLSearchParams({unit:'unit1-2',page:'card',state:'pending',device:device.id,stars:'5'}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 await expect(frame.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');await expect(frame.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();await expect(frame.locator('#certificateDate')).toBeHidden();await expect(frame.locator('.story-award-status')).toContainText('待同步');
 await page.locator('#frame-shell').screenshot({path:info.outputPath('pending-full-card.png')});
 await page.locator('#state-buttons [data-state=card]').click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(frame.getByRole('button',{name:'保存动图',exact:true})).toBeEnabled();await expect(frame.locator('#certificateDate')).toBeVisible();
});
