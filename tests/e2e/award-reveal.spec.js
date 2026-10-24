'use strict';
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
const {waitForRewardDismissal,dismissRewardDialog}=require('../support/reward-dialog');

test.use({ reducedMotion: 'reduce' });

test('真实答题首星显示悬浮纪念卡，无按钮，点击卡片退出并保持获星，刷新不重播', async ({ page }) => {
  await flow.activity(page, '1-2', 'listen', { keepAward: true });
  const reveal = page.getByRole('dialog', { name: /纪念卡结算/ });
  await expect(reveal).toBeVisible();
  await expect(reveal.getByRole('group', { name: '已获得 1 / 5 颗星', exact: true })).toBeVisible();
  await expect(reveal.getByRole('button')).toHaveCount(0);
  await expect(reveal.locator('.story-award-illustration')).toHaveAttribute('src', /unit1-2-handbag-closeup/);
  await expect(reveal.locator('time')).toBeHidden();
  await expect(reveal).not.toContainText('课程已升级');
  await waitForRewardDismissal(page); await reveal.getByRole('article').click();
  await expect(reveal).not.toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('1');
  await expect(page.locator('.stage-listen').getByRole('button', { name: '再练一轮', exact: true })).toBeFocused();
  await page.reload();
  await expect(page.locator('#starCount')).toHaveText('1');
  await expect(reveal).not.toBeVisible();
});

const otherFlow = require('../support/units1-30-tasks');
const fs = require('node:fs/promises');
const OUT = 'output/playwright/award-reveal';
const upgradeCopy = '课程已升级，重新挑战，全对即可点亮星星！';
const zones = { '1-2': ['listen','roles','trans','manners','exam'], '3-4': ['listen','roles','manners','reply','exam'], '5-6': ['listen','roles','introduce','cars','exam'] };
const activity = (page,pair,id,options) => (pair==='1-2'?flow:otherFlow).activity(page,pair,id,{...options,keepAward:true});

for (const pair of Object.keys(zones)) test(`${pair} 五个真实答题区依次点星、第五颗金边流光、首次日期固定`, async ({ page }) => {
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  await (pair==='1-2'?flow:otherFlow).story(page,pair);
  for (const [i,id] of zones[pair].entries()) {
    await activity(page,pair,id);
    const reveal=page.getByRole('dialog',{name:/纪念卡结算/});
    await expect(reveal).toBeVisible();
    await expect(reveal.getByRole('group',{name:`已获得 ${i+1} / 5 颗星`,exact:true})).toBeVisible();
    await expect(reveal.getByRole('button')).toHaveCount(0);
    await expect(reveal.locator('.story-award-illustration')).toHaveAttribute('src',new RegExp(`unit${pair}-`));
    await expect(reveal.locator('time'))[i===4?'toBeVisible':'toBeHidden']();
    if(i===4){
      const ring=reveal.locator('.gold-light-ring');
      await expect(ring).toHaveCSS('opacity','1');
      const angle=await ring.evaluate(el=>getComputedStyle(el).getPropertyValue('--gold-angle'));
      await expect.poll(()=>ring.evaluate(el=>getComputedStyle(el).getPropertyValue('--gold-angle'))).not.toBe(angle);
      await expect(reveal.locator('.award-star').last()).toHaveCSS('filter','none');
      await page.screenshot({path:`${OUT}/unit${pair}-full.png`});
      const date=await reveal.locator('time').textContent();
      await dismissRewardDialog(page,'Escape');await page.clock.setFixedTime(new Date(Date.now()+3*86400000));
      await page.goto(`/unit${pair}/#learn/certificate`);
      await expect(page.locator('#certificateDate')).toHaveText(date);
      await expect(page.locator('dialog.award-reveal')).not.toBeVisible();
    } else await dismissRewardDialog(page,i%2?' ':'Enter');
  }
  expect(errors).toEqual([]);
});

for(const pair of Object.keys(zones)) test(`${pair} 历史途中升级只提醒一次，不加星；重练后正常获星`,async({page})=>{
  test.setTimeout(60000);let before=true;
  await page.route(`**/unit${pair}/*`,async route=>{
    const name=new URL(route.request().url()).pathname.split('/').pop()||'index.html';
    if(before&&['index.html','content.js','unit.js'].includes(name))await route.fulfill({body:await fs.readFile(`tests/fixtures/unit${pair}-before-awards/`+name),contentType:name.endsWith('.js')?'text/javascript':'text/html'});
    else await route.continue();
  });
  await page.goto(`/unit${pair}/#learn/listen`);const room=page.locator('.stage-listen');
  await flow.select(room,pair==='1-2'?flow.ANSWERS['1-2'].listen[0]:otherFlow.answers(pair,'listen')[0].answer);
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
  before=false;await page.reload();await activity(page,pair,'listen');
  const reveal=page.getByRole('dialog',{name:/纪念卡结算/});
  await expect(reveal).toBeVisible();await expect(reveal.locator('.award-upgrade-reminder')).toHaveText(upgradeCopy);
  await expect(reveal.getByRole('group',{name:'已获得 0 / 5 颗星',exact:true})).toBeVisible();
  await expect(reveal.locator('time')).toBeHidden();await expect(reveal.locator('.travelling-star')).toHaveCount(0);
  for(const size of [{width:1280,height:800},{width:390,height:844},{width:320,height:640},{width:390,height:500}]){
    await page.setViewportSize(size);
    const box=await reveal.locator('.award-reveal-panel').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(size.width);
    expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(size.height);
    await page.screenshot({path:`${OUT}/unit${pair}-upgrade-${size.width}-${size.height}.png`});
  }
  await reveal.getByText(upgradeCopy,{exact:true}).click();await expect(reveal).not.toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.reload();await expect(room.locator('.award-round-result')).toHaveText(upgradeCopy);await expect(reveal).not.toBeVisible();
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,pair,'listen');
  await expect(reveal.getByRole('group',{name:'已获得 1 / 5 颗星',exact:true})).toBeVisible();await expect(reveal).not.toContainText(upgradeCopy);
});

test('错答订正不弹获星，重练全对展示已有卡片但不重复点星，刷新不重播',async({page})=>{
  await page.goto('/unit1-2/#learn/manners');const room=page.locator('.stage-manners');
  await flow.select(room,{fills:['it']});await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await flow.select(room,{fills:['me']});await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await activity(page,'1-2','manners');
  await expect(page.locator('#starCount')).toHaveText('0');await expect(room.locator('.award-round-result')).toContainText('这轮有过答错');
  await expect(page.locator('dialog.award-reveal')).not.toBeVisible();
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'1-2','manners');
  await waitForRewardDismissal(page); await page.getByRole('dialog',{name:/纪念卡结算/}).click({position:{x:8,y:8}});
  await expect(page.locator('#starCount')).toHaveText('1');
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'1-2','manners');
  const replay=page.getByRole('dialog',{name:/纪念卡结算/});
  await expect(replay).toBeVisible();await expect(replay).toHaveAttribute('data-kind','replay');
  await expect(replay.getByRole('group',{name:'已获得 1 / 5 颗星',exact:true})).toBeVisible();
  await expect(replay.locator('.travelling-star')).toHaveCount(0);
  await expect(replay.getByRole('button')).toHaveCount(0);
  const glint=replay.locator('.award-star[data-earned="true"] .star-glint').first();
  const opacity=await glint.evaluate(el=>getComputedStyle(el).opacity);
  await expect.poll(()=>glint.evaluate(el=>getComputedStyle(el).opacity)).not.toBe(opacity);
  await waitForRewardDismissal(page); await replay.click({position:{x:8,y:8}});
  await expect(page.locator('#starCount')).toHaveText('1');await expect(room.locator('.award-round-result')).toHaveText('已获星');
  await page.reload();await expect(replay).not.toBeVisible();
});

test('系统减少动态开启时奖励仍默认有动效；星飞完成后才允许关闭且保留星星',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await activity(page,'1-2','listen');
  const reveal=page.getByRole('dialog',{name:/纪念卡结算/});await expect(reveal.locator('.travelling-star')).toBeVisible();
  await reveal.click({position:{x:8,y:8}});await expect(reveal).toBeVisible();
  await reveal.press('Escape');await expect(reveal).toBeVisible();
  await expect(reveal).toHaveAttribute('data-dismissible','true');
  await reveal.click({position:{x:8,y:8}});await expect(reveal).not.toBeVisible();
  await expect(page.locator('.travelling-star,.sparkle,.star-trail,.star-bloom')).toHaveCount(0);await expect(page.locator('#starCount')).toHaveText('1');
  await page.emulateMedia({reducedMotion:'no-preference'});await activity(page,'1-2','manners');
  await expect(reveal.locator('.travelling-star')).toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(reveal.getByRole('group',{name:'已获得 2 / 5 颗星',exact:true})).toBeVisible();
  await expect(reveal.locator('.travelling-star')).toHaveCount(0);
  await expect(reveal.locator('.award-star[data-earned="true"] .star-glint').first()).toHaveCSS('animation-name','star-twinkle');
  const glint=reveal.locator('.award-star[data-earned="true"] .star-glint').first();
  const opacity=await glint.evaluate(el=>getComputedStyle(el).opacity);
  await expect.poll(()=>glint.evaluate(el=>getComputedStyle(el).opacity)).not.toBe(opacity);
  await dismissRewardDialog(page,'Escape');await expect(reveal).not.toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('2');
});
