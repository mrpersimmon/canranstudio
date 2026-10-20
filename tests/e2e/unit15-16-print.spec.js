'use strict';
const {test,expect}=require('@playwright/test');
const {legacy}=require('../support/unit1516-legacy');
const {completeUnit1516}=require('../support/unit15-16-flow');
test('练习纸保留A六题、B十二题、原例和24条书写线与6个填空位，实际PDF无隐藏题目',async({page},info)=>{
 await page.goto('/unit15-16/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await expect(page.locator('body')).toHaveClass(/print-writing/);await page.emulateMedia({media:'print'});
 await expect(page.locator('.writing-a li')).toHaveCount(6);await expect(page.locator('.writing-b li')).toHaveCount(12);await expect(page.locator('.writing-rule')).toHaveCount(24);
 await expect(page.locator('.writing-blank')).toHaveCount(6);expect(await page.locator('.writing-blank').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=32&&e.getBoundingClientRect().width>=70))).toBe(true);
 expect(await page.locator('.writing-rule').evaluateAll(es=>es.every(e=>getComputedStyle(e).visibility==='visible'&&e.getBoundingClientRect().height>=32))).toBe(true);
 await page.pdf({path:info.outputPath('worksheet.pdf'),format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'14mm',right:'14mm'}});
});
test('已领旧证书升级后仍能打印原姓名和日期，打印不变成新版空卡',async({page},info)=>{
 test.setTimeout(120000);const upgrade=await legacy(page);await completeUnit1516(page);await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const original=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');await upgrade();await page.reload();await page.locator('.legacy-learning>summary').click();await page.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(page.locator('#legacyCertificateDate')).toHaveText(original);
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印证书',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('#legacyCertificateName')).toBeVisible();await expect(page.locator('#legacyCertificateName')).toHaveText('小禾');await expect(page.locator('.story-award-panel')).toBeHidden();
 await page.pdf({path:info.outputPath('legacy-certificate.pdf'),format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'14mm',right:'14mm'}});
});
