'use strict';
const {expect,test}=require('@playwright/test');
async function directoryReady(page){
 const start=Date.now();
 await page.waitForURL(url=>url.pathname==='/'||url.pathname==='/lesson/',{waitUntil:'domcontentloaded',timeout:30000});
 // The /lesson/ directory is a real package, including shared fonts. Check
 // its visible loading boundary before asserting its links or saved records.
 // Performance suites keep their separate 5 s / 1.5 s budgets unchanged.
 await expect(page.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
 await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing','');
 test.info().annotations.push({type:'directory-ready',description:`${Date.now()-start} ms after navigation`});
}
module.exports={directoryReady};
