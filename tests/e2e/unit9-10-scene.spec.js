'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function capture(page,name){
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 const id=new URL(page.url()).hash.slice('#learn/'.length),clip=await page.locator('.stage-'+id).boundingBox();
 await page.screenshot({path:`output/playwright/unit9-10/${name}.png`,fullPage:true,clip});
}

test('聊到的朋友按原文出现，不把 Tony 和 Emma 放进对话角色',async({page})=>{
 await page.goto('/unit9-10/#learn/text');const room=page.locator('.stage-text'),friends=room.getByRole('group',{name:'聊到的朋友',exact:true});
 await expect(friends).toHaveCount(1);
 await expect(friends.getByText('Tony',{exact:true})).not.toBeVisible();
 for(let i=0;i<10;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
  if(i===5)await expect(friends.getByText('Tony',{exact:true})).not.toBeVisible();
  if(i===6){await expect(friends.getByText('Tony',{exact:true})).toBeVisible();await expect(friends).not.toContainText("He's fine.");}
  if(i===7){await expect(friends).toContainText("He's fine.");await expect(friends.getByText('Emma',{exact:true})).not.toBeVisible();}
 }
 await expect(friends).toContainText("She's very well.");await expect(room.locator('.dialogue-actor span')).toHaveText(['Steven','Helen']);
 await page.reload();await expect(room.locator('.bubble-row').last()).toBeInViewport({ratio:1});
 await room.getByRole('button',{name:'重新上演',exact:true}).click();await expect(friends.getByText('Tony',{exact:true})).not.toBeVisible();
});

test('手机对白占整行，人物在下方；桌面人物落在同一地面',async({page})=>{
 test.setTimeout(60000);
 for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:844});await page.goto('/unit9-10/#learn/text');
  const scene=page.locator('.dialogue-stage'),log=scene.getByRole('log'),actors=scene.locator('.dialogue-actor');
  const s=await scene.boundingBox(),l=await log.boundingBox(),a=await actors.first().boundingBox(),b=await actors.last().boundingBox();
  expect(Math.abs(a.y+a.height-b.y-b.height)).toBeLessThan(3);
  if(width<701){expect(l.width).toBeGreaterThan(s.width*.85);expect(a.y).toBeGreaterThanOrEqual(l.y+l.height-2);}
  expect(await log.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const room=page.locator('.stage-text');await room.getByRole('button',{name:'重新上演',exact:true}).click();
  for(let i=0;i<10;i++){
   await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
   if(i===2)await capture(page,`story-3-${width}`);
   if(i===3){
    const tools=room.locator('.stage-ctrl'),before=await tools.evaluate(el=>el.getBoundingClientRect().top+scrollY);
    await log.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();
    const cn=await log.locator('.bubble-row').last().locator('.bcn').boundingBox(),bounds=await log.boundingBox();
    expect(cn.y+cn.height).toBeLessThanOrEqual(bounds.y+bounds.height-2);
    expect(await tools.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(before,0);
    await capture(page,`story-translation-${width}`);
   }
  }
  await capture(page,`story-friends-${width}`);
 }
});

test('问候接力包含选答和拼句，只有正确检查后才出现回应',async({page})=>{
 await page.goto('/unit9-10/#learn/reply');const room=page.locator('.stage-reply');
 await expect(room).toContainText('第 1 / 3 题');const response=room.locator('.greeting-response');
 await room.getByRole('button',{name:"I'm Italian.",exact:true}).click();await expect(response).toBeHidden();
 await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(response).toBeHidden();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:"I'm fine, thanks.",exact:true}).click();await expect(response).toBeHidden();
 await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(response).toHaveText("I'm fine, thanks.");
 await page.reload();await expect(response).toHaveText("I'm fine, thanks.");await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(response).toBeHidden();
 await expect(room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button')).toHaveCount(5);
});

test('观察窗六个主题每次只展示一对，冷热另一个画面不改写故事',async({page})=>{
 await page.goto('/unit9-10/#learn/models');const room=page.locator('.stage-models'),tabs=room.getByRole('group',{name:'选择观察主题',exact:true});
 await expect(tabs.getByRole('button')).toHaveCount(6);
 for(const label of ['胖瘦','高矮','脏净','冷热','老少','忙与懒']){
  await tabs.getByRole('button',{name:label,exact:true}).click();await expect(tabs.getByRole('button',{name:label,exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(room.locator('.observation-pair:visible .phrase-card')).toHaveCount(2);
  if(label==='冷热')await expect(room.locator('.observation-pair:visible')).toContainText('另一幅画面');
  await capture(page,`models-theme-${label}`);
 }
 await expect(room).toContainText('休息不等于懒惰');
});

for(const width of [320,390,1280])test(`${width} 问候正确回应出现后操作区不被推移，拼句与结束状态完整`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/unit9-10/#learn/reply');await page.evaluate(()=>document.fonts.ready);
 const room=page.locator('.stage-reply'),actions=room.getByRole('group',{name:'作答操作',exact:true}),check=room.getByRole('button',{name:'检查答案',exact:true});
 const answers=["I'm fine, thanks.",["I'm",'fine,','thanks.','And','you?'],'Nice to see you, too.'];
 for(const [i,answer]of answers.entries()){
  if(Array.isArray(answer)){for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();}else await room.getByRole('button',{name:answer,exact:true}).click();
  const before=await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY);await check.click();expect(await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(before,0);
  await capture(page,`reply-${i+1}-${width}`);await room.getByRole('button',{name:i===2?'完成这一站':'下一题',exact:true}).click();
 }
 const finish=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(finish.getByRole('button')).toHaveCount(2);await capture(page,`reply-finish-${width}`);
});
