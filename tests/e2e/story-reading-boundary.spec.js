'use strict';
const {test,expect}=require('@playwright/test');
// Independent scope from the 2026-10-19 acceptance review. The lesson transcript
// remains unchanged; the regression is the extra automatic interpretation layer.
const cases=[
 ['53-54','.weather-board-label',/春夏 · 白天长|秋冬 · 白天短/],
 ['55-56','.family-prop-label',/早晨 · 去上班和上学|夜晚 · 作业、读报与休息/],
 ['57-58',null,/早晨 · 去上学|上午 · 去商店|下午 · 花园喝茶|傍晚 · 花园玩耍|今晚 · 读一本书/],
 ['59-60','.counter-note',/只有小盒粉笔|买好文具，等找零/],
 ['65-66','.key-owner',/Jill 已接过|爸爸保管/],
 ...['67-68','69-70','71-72','73-74','75-76','77-78','79-80','81-82','83-84','85-86','87-88','89-90'].map(id=>[id,'.story-timeline',null])
];
test.use({browserName:process.env.DESIGN_REVIEW_BROWSER||'chromium',actionTimeout:8000});
for(const [pair,extra,banned]of cases)test('Lesson '+pair+' 原文初始、推进、续读和完成回看不附剧情结论',async({page},info)=>{
 test.setTimeout(90000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/unit'+pair+'/#learn/text');
 const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 const check=async()=>{if(extra)await expect(room.locator(extra)).toHaveCount(0);if(banned)await expect(room).not.toContainText(banned);if(['75-76','89-90'].includes(pair))await expect(room.locator('.story-note')).toHaveCount(0);await expect(room.locator('.bcn:visible')).toHaveCount(0);};
 await check();await room.getByRole('button',{name:'开始看课文',exact:true}).click();let i=0;
 while(true){await check();if(i===2){const transcript=await room.locator('.btext').allTextContents();await page.reload();await expect(room).toBeVisible({timeout:30000});await expect(room.locator('.btext')).toHaveText(transcript);await check();}
  const next=room.getByRole('button',{name:/^下一(句|段)$/,exact:true});if(!await next.isVisible())break;await next.click();if(++i>30)throw Error('Reading did not finish');}
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await check();await page.reload();await expect(room).toBeVisible({timeout:30000});await check();
 // The ordinary original translation remains opt-in and can still be closed.
 const last=room.locator('.bubble-row').last();await last.getByRole('button',{name:'看中文',exact:true}).click();await expect(last.locator('.bcn')).toBeVisible();await last.getByRole('button',{name:'收起中文',exact:true}).click();await check();
 for(const width of [320,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await room.screenshot({path:info.outputPath('story-'+width+'.png')});}
 expect(errors).toEqual([]);
});
