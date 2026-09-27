'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('15–16 护照先递交，箱子先否认再指出另一对，刷新与重演不串场',async({page})=>{
 await page.goto('/unit15-16/#learn/text');const room=page.locator('.stage-text'),scene=room.locator('.customs-cast'),passports=scene.locator('.story-passports'),wrong=scene.locator('.story-other-cases'),own=scene.locator('.story-own-cases');
 await expect(scene).toHaveAttribute('data-phase','arrival');await expect(passports).toBeHidden();await expect(own).toBeHidden();
 for(let i=0;i<18;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
  if(i<6)await expect(passports).toBeHidden();else await expect(passports).toBeVisible();
  if(i===6)await expect(passports).toHaveAttribute('data-place','girls');
  if(i===7){await expect(passports).toHaveAttribute('data-place','counter');await page.reload();await expect(passports).toHaveAttribute('data-place','counter');}
  if(i<8)await expect(wrong).toBeHidden();else await expect(wrong).toBeVisible();
  if(i<10)await expect(own).toBeHidden();else await expect(own).toBeVisible();
  if(i===11){await expect(own).toHaveAttribute('data-place','girls');await expect(wrong).toHaveAttribute('src',/cases-grey\.svg$/);}
  if(i<16)await expect(scene.locator('.customs-clear')).toBeHidden();else await expect(scene.locator('.customs-clear')).toBeVisible();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await room.getByRole('button',{name:'再看一遍',exact:true}).click();await expect(scene).toHaveAttribute('data-phase','arrival');await expect(passports).toBeHidden();await expect(own).toBeHidden();
});
test('15–16 画册每次一幅，共十五幅，翻页与刷新保留位置',async({page})=>{
 await page.goto('/unit15-16/#learn/models');const room=page.locator('.stage-models'),album=room.getByRole('group',{name:'当前出行图',exact:true});
 const labels=['books · red','shirts · white','coats · grey','tickets · yellow','suits · blue','hats · black and grey','passports · green','umbrellas · black','handbags · white','ties · orange','dogs · brown and white','pens · blue','cars · red','dresses · green','blouses · yellow'];
 for(let i=0;i<labels.length;i++){await expect(album).toContainText(labels[i]);await expect(album.locator('img')).toHaveCount(1);if(i<14)await room.getByRole('button',{name:'下一幅出行图',exact:true}).click();}
 await expect(room.getByRole('button',{name:'下一幅出行图',exact:true})).toBeDisabled();await page.reload();await expect(album).toContainText(labels[14]);await room.getByRole('button',{name:'下一站：单词变一变',exact:true}).click();await expect(page).toHaveURL(/#learn\/forms$/);
});

for(const width of [320,390,768,1280])test(`${width} 对白与所有角色分区，长句中文完整，箱子和操作不被遮挡`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/unit15-16/#learn/text');const room=page.locator('.stage-text'),log=room.getByRole('log'),cast=room.locator('.customs-cast'),ctrl=room.locator('.stage-ctrl');
 const top=()=>ctrl.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await top();
 for(let i=0;i<18;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();expect(await top()).toBeCloseTo(before,0);
  if([3,7,9,11,17].includes(i)){
   await log.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();const b=await log.boundingBox(),cn=await log.locator('.bubble-row').last().locator('.bcn').boundingBox();expect(cn.y+cn.height).toBeLessThanOrEqual(b.y+b.height+.5);
   for(const figure of await cast.locator('.dialogue-actor,.customs-friends').all()){const r=await figure.boundingBox();expect(r.y).toBeGreaterThanOrEqual(b.y+b.height);}
   if(width>=701){const girls=await cast.locator('[data-actor=student]').boundingBox(),friends=await cast.locator('.customs-friends').boundingBox();expect(girls.x+girls.width).toBeLessThan(friends.x);}
   expect(await top()).toBeCloseTo(before,0);
   await room.screenshot({path:`output/playwright/unit15-16/scene-${i+1}-${width}.png`});
  }
 }
 await page.reload();await expect(log.locator('.bubble-row').last()).toBeInViewport({ratio:1});
});
test('720高桌面屏里当前对白、人物与下一句同时可见',async({page})=>{
 await page.setViewportSize({width:1280,height:720});await page.goto('/unit15-16/#learn/text');const room=page.locator('.stage-text');
 await expect(room.getByRole('button',{name:'开始看课文',exact:true})).toBeInViewport({ratio:1});
 for(let i=0;i<12;i++)await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
 await expect(room.getByRole('log').locator('.bubble-row').last()).toBeInViewport({ratio:1});await expect(room.getByRole('button',{name:'下一句',exact:true})).toBeInViewport({ratio:1});
 await room.screenshot({path:'output/playwright/unit15-16/story-desktop-720.png'});
});
test('护照题选择、线索和错答不递交，检查正确才出现结果',async({page})=>{
 await page.goto('/unit15-16/#learn/exam');const room=page.locator('.stage-exam'),scene=room.locator('.customs-task');
 await room.getByRole('button',{name:'朋友：Russian；身份：tourists',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 const picture=scene.locator('.customs-evidence>img');await expect(picture).toHaveCSS('transform','matrix(1, 0, 0, 1, 48, 0)');
 await room.getByRole('button',{name:'给点线索',exact:true}).click();await room.getByRole('button',{name:'Yes, we are.',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(scene).toHaveAttribute('data-phase','waiting');await expect(scene.locator('.customs-task-result')).toBeEmpty();await expect(picture).toHaveCSS('transform','matrix(1, 0, 0, 1, 48, 0)');
 await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:'Yes, they are.',exact:true}).click();await expect(scene).toHaveAttribute('data-phase','waiting');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(scene).toHaveAttribute('data-phase','checked');await expect(scene.locator('.customs-task-result')).toContainText('确认的是两本护照');await expect(picture).toHaveCSS('transform','matrix(1, 0, 0, 1, -48, 0)');
});
