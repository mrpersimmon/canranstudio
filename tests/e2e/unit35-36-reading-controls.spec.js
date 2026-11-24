'use strict';
const {courseButton,courseTimeline}=require('../support/course-controls');
const {test,expect}=require('@playwright/test');
test.use({actionTimeout:7000,...(process.env.UNIT3536_BROWSER==='webkit'?{browserName:'webkit'}:{})});
for(const [width,height]of [[320,568],[390,500],[1280,720]])test(`${width}x${height} 逐句阅读与中文展开时当前对白和推进按钮同屏`,async({page},info)=>{
 await page.setViewportSize({width,height});await page.goto('/unit35-36/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<15;i++){
  await courseButton(room, i?'下一句':"startStory").click();
  const line=room.locator('.bubble-row').last(),advance=courseButton(room, i===14?"finishStory":'下一句');
  const readable=async()=>{const text=await line.locator('.btext').boundingBox(),next=await advance.boundingBox(),nav=await courseTimeline(page).boundingBox(),log=await room.locator('.dialogue-log').boundingBox();expect(text.y).toBeGreaterThanOrEqual(Math.max(nav.y+nav.height,log.y));expect(text.y+text.height).toBeLessThanOrEqual(log.y+log.height);expect(log.y+log.height).toBeLessThanOrEqual(next.y);expect(next.y+next.height).toBeLessThanOrEqual(height);if(await line.locator('.bcn').isVisible()){const cn=await line.locator('.bcn').boundingBox();expect(cn.y).toBeGreaterThanOrEqual(log.y);expect(cn.y+cn.height).toBeLessThanOrEqual(log.y+log.height);}};
  await readable();const scroll=await page.evaluate(()=>scrollY);await line.getByRole('button',{name:'看中文',exact:true}).click();await readable();expect(Math.abs(await page.evaluate(()=>scrollY)-scroll)).toBeLessThan(2);await expect(line.locator('.bcn')).toBeVisible();
 }
 await page.screenshot({path:info.outputPath(`reading-${width}x${height}.png`)});
 await courseButton(room, "finishStory").click();const next=await room.getByRole('button',{name:'下一站：相册小侦探',exact:true}).boundingBox();expect(next.y).toBeGreaterThanOrEqual(0);expect(next.y+next.height).toBeLessThanOrEqual(height);
});
