'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
for(const base of ['', '/lesson'])test(`unit9-10 词卡翻面、示范阅读和刷新都不请求英语配音 ${base||'/'}`,async({page})=>{
 const voices=[];await page.route(/\.(mp3|wav|ogg)(\?|$)/,route=>{if(!new URL(route.request().url()).pathname.includes('/assets/feedback/'))voices.push(route.request().url());return route.abort();});
 await page.goto(base+'/unit9-10/#learn/words');const room=page.locator('.stage-words');
 for(let i=0;i<22;i+=6){
  for(const card of await room.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await card.click();await expect(card.locator('.word-meaning')).toBeHidden();await expect(card.locator('.word-phonetic')).toBeVisible();}
  if(i+6<22)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
 await page.reload();await expect(room.locator('.word-phonetic').first()).toBeVisible();
 for(const activity of ['phrases','models']){await page.goto(base+'/unit9-10/#learn/'+activity);const section=page.locator('.stage-'+activity);for(const summary of await section.locator('summary').all())await summary.click();await expect(section.locator('button.phrase-card')).toHaveCount(0);await expect(section.locator('article.phrase-card')).not.toHaveCount(0);}
 await expect(page.locator('#starCount')).toHaveText('0');expect(voices).toEqual([]);
});
