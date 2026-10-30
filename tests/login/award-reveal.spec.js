'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,addStudent,studentLogin}=require('./helpers');
const flow=require('../support/thirteen-types-flow');
const tasks=require('../support/units1-30-tasks');
const {waitForRewardDismissal,dismissRewardDialog}=require('../support/reward-dialog');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const options={base:base.replace(/\/$/,''),keepAward:true};

// Observe rendered frames as well as short-lived DOM changes: a final-state
// assertion misses the loading screen that used to cover the flying star.
async function observeReveal(page) {
  await page.addInitScript(() => {
    const samples = { interruptions: [], flightPositions: [] };
    window.awardRevealFrames = samples;
    const inspect = frame => {
      const reveal = document.querySelector('dialog.award-reveal[open]');
      if (!reveal) return;
      const loader = document.querySelector('#courseLoader');
      const hidden = getComputedStyle(reveal).visibility !== 'visible';
      const covered = !!loader && loader.getBoundingClientRect().width > 0;
      const missingImage = frame && [...reveal.querySelectorAll('img')].some(image =>
        image.getClientRects().length && (!image.complete || !image.naturalWidth));
      if ((hidden || covered || missingImage) && samples.interruptions.length < 10) {
        samples.interruptions.push({ hidden, covered, missingImage,
          unreadyImages: [...document.images].filter(image => image.src && (!image.complete || !image.naturalWidth))
            .map(image => ({ path: new URL(image.src).pathname, parent: image.parentElement?.className }))
        });
      }
      const star = reveal.querySelector('.travelling-star');
      if (frame && star && !hidden && !covered) {
        const rect = star.getBoundingClientRect();
        const position = Math.round(rect.x) + ',' + Math.round(rect.y);
        if (!samples.flightPositions.includes(position)) samples.flightPositions.push(position);
      }
    };
    new MutationObserver(() => inspect(false)).observe(document, {
      subtree: true, childList: true, attributes: true,
      attributeFilter: ['open', 'src', 'data-course-painting']
    });
    const frame = () => { inspect(true); requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  });
}

test('悬浮卡关闭后才播放三张统计卡，重练展示已有星光且不重复获星', async ({ page, browser }) => {
  test.setTimeout(90000);
  await adminLogin(page, base);
  const account = await createStudent(page, '结算动效验收', '小禾', [/Lesson 1–2/]);
  const student = await studentLogin(browser, account, base), p = student.page;
  try {
    await p.emulateMedia({ reducedMotion: 'reduce' });
    await p.addInitScript(() => {
      window.resultMotionFrames = [];
      const sample = () => {
        const finish = document.querySelector('.stage-listen .completion-card');
        if (finish && window.resultMotionFrames.length < 900) window.resultMotionFrames.push({
          modal: !!document.querySelector('.award-reveal[open]'),
          phase: finish.dataset.resultMotion,
          numbers: [...finish.querySelectorAll('.completion-number')].map(el => el.textContent),
          transforms: [...finish.querySelectorAll('.completion-stat')].map(el => getComputedStyle(el).transform)
        });
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await flow.activity(p, '1-2', 'listen', options);
    const reveal = p.getByRole('dialog', { name: /纪念卡结算/ });
    const result = p.locator('.stage-listen .completion-card');
    await expect(reveal.getByRole('group', { name: '已获得 1 / 5 颗星', exact: true })).toBeVisible();
    await expect(result).toHaveAttribute('data-result-motion', 'pending');
    await dismissRewardDialog(p,'Escape');
    await expect(result).toHaveAttribute('data-result-motion', 'finished');
    let frames = await p.evaluate(() => window.resultMotionFrames);
    expect(frames.filter(frame => frame.modal && frame.phase === 'playing')).toEqual([]);
    expect(frames.filter(frame => !frame.modal && frame.phase === 'playing').length).toBeGreaterThan(3);
    expect(new Set(frames.filter(frame => !frame.modal).map(frame => frame.transforms[0])).size).toBeGreaterThan(3);
    await p.locator('.stage-listen').getByRole('button', { name: '再练一轮', exact: true }).click();
    await flow.activity(p, '1-2', 'listen', options);
    await expect(reveal).toHaveAttribute('data-kind', 'replay');
    await expect(reveal).toBeVisible(); await expect(reveal.locator('.travelling-star')).toHaveCount(0);
    await expect(p.locator('#starCount')).toHaveText('1');
    await dismissRewardDialog(p,'Escape');
    await expect(result).toHaveAttribute('data-result-motion', 'finished');
    await p.reload(); await expect(reveal).not.toBeVisible(); await expect(p.locator('#starCount')).toHaveText('1');
  } finally { await student.context.close(); }
});

for (const [pair, width, motion] of [
  ['1-2', 1280, 'reduce'], ['1-2', 390, 'no-preference'],
  ['3-4', 1280, 'reduce'], ['5-6', 390, 'reduce']
]) test(`${pair} ${width} 在线获星动画全程不闪回加载页，星星仍飞入并点亮`, async ({ page, browser }) => {
  await adminLogin(page, base);
  const account = await createStudent(page, '获星画面验收班', '小雨', [new RegExp('Lesson ' + pair.replace('-', '–'))]);
  const student = await studentLogin(browser, account, base);
  try {
    const p = student.page;
    await p.setViewportSize({ width, height: width < 600 ? 844 : 800 });
    await p.emulateMedia({ reducedMotion: motion });
    await observeReveal(p);
    await (pair === '1-2' ? flow : tasks).activity(p, pair, 'listen', options);
    const reveal = p.getByRole('dialog', { name: /纪念卡结算/ });
    await expect(reveal.getByRole('group', { name: '已获得 1 / 5 颗星', exact: true })).toBeVisible();
    await expect(reveal.locator('.star-bloom')).toHaveCount(0);
    const frames = await p.evaluate(() => window.awardRevealFrames);
    expect(frames.interruptions, '纪念卡展示时不得被整页加载保护隐藏').toEqual([]);
    expect(frames.flightPositions.length, '保留真实移动的飞入星星').toBeGreaterThan(3);
    const glint = reveal.locator('.award-star[data-earned="true"] .star-glint').first();
    const opacity = await glint.evaluate(el => getComputedStyle(el).opacity);
    await expect.poll(() => glint.evaluate(el => getComputedStyle(el).opacity)).not.toBe(opacity);
    await waitForRewardDismissal(p); await reveal.click({ position: { x: 8, y: 8 } });
    await expect(reveal).not.toBeVisible();
    await expect(p.locator('#starCount')).toHaveText('1');
  } finally { await student.context.close(); }
});

test('真实账号离线零错不预发星，恢复同步不打断结算，主动复练显示原星与当前姓名',async({page,browser})=>{
  test.setTimeout(120000);
  await adminLogin(page,base);const name='热爱探险和英语学习的小朋友李明小明';
  const account=await createStudent(page,'悬浮卡同步验收班',name,[/Lesson 1–2/]);const other=await addStudent(page,'另一位同学');
  const first=await studentLogin(browser,account,base);const p=first.page;
  await observeReveal(p);
  await p.emulateMedia({reducedMotion:'reduce'});await p.goto(base+'unit1-2/#learn/listen');
  await expect(p.locator('.stage-listen').getByRole('button',{name:'检查答案',exact:true})).toBeVisible();
  await first.context.setOffline(true);
  // The cached course remains usable; all answers are genuine page actions.
  await flow.activity(p,'1-2','listen',options);
  await expect(p.locator('#starCount')).toHaveText('0');await expect(p.locator('.stage-listen .award-round-result')).toContainText('联网后同步星星');
  const reveal=p.getByRole('dialog',{name:/纪念卡结算/});await expect(reveal).not.toBeVisible();
  const finish=p.locator('.stage-listen .completion-card');
  await expect(finish).toHaveAttribute('data-result-motion','finished');
  await first.context.setOffline(false);
  await expect(p.locator('#starCount')).toHaveText('1');
  await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
  await expect(reveal).not.toBeVisible();
  await expect(finish).toHaveAttribute('data-result-motion','finished');
  const confirmed=await p.evaluate(()=>CanranStudentAccess.awards);
  // A late network acknowledgement updates the ledger silently. Only an
  // explicit new perfect round may open the already-earned card again.
  await finish.getByRole('button',{name:'再练一轮',exact:true}).click();
  await flow.activity(p,'1-2','listen',options);
  await expect(reveal).toHaveAttribute('data-kind','replay');
  await expect(reveal.getByRole('group',{name:'已获得 1 / 5 颗星',exact:true})).toBeVisible();
  await expect(reveal.locator('.travelling-star')).toHaveCount(0);
  await expect(reveal.locator('.star-bloom')).toHaveCount(0);
  expect(await p.evaluate(()=>window.awardRevealFrames.interruptions)).toEqual([]);
  await expect(reveal.locator('.story-award-name')).toHaveText(name);
  for(const size of [{width:1280,height:800},{width:390,height:844},{width:320,height:640}]){
    await p.setViewportSize(size);
    expect(await reveal.locator('.story-award-name').evaluate(el=>el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1)).toBe(true);
    await p.screenshot({path:`output/playwright/award-reveal/account-${size.width}.png`});
  }
  await dismissRewardDialog(p,'Escape');await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
  expect(await p.evaluate(()=>CanranStudentAccess.awards)).toEqual(confirmed);
  const second=await studentLogin(browser,account,base);await second.page.goto(base+'unit1-2/#learn/certificate');
  await expect(second.page.locator('#certificateName')).toHaveText(name);await expect(second.page.locator('#starCount')).toHaveText('1');
  await expect(second.page.getByRole('dialog',{name:/纪念卡结算/})).not.toBeVisible();
  await p.reload();await expect(p.locator('#starCount')).toHaveText('1');await expect(reveal).not.toBeVisible();
  const different=await studentLogin(browser,other,base);await different.page.goto(base+'unit1-2/#learn/certificate');
  await expect(different.page.locator('#starCount')).toHaveText('0');await expect(different.page.locator('#certificateName')).toHaveText('另一位同学');
  await Promise.all([first.context.close(),second.context.close(),different.context.close()]);
});

test('服务器确认第五颗星后显示金边和固定日期，卡片与纪念册一致',async({page,browser})=>{
  test.setTimeout(120000);await adminLogin(page,base);
  const account=await createStudent(page,'五星结算验收班','小雨',[/Lesson 3–4/]);const student=await studentLogin(browser,account,base),p=student.page;
  await observeReveal(p);
  await p.emulateMedia({reducedMotion:'reduce'});await tasks.story(p,'3-4',options.base);
  for(const[id,index]of ['listen','roles','manners','reply','exam'].map((id,index)=>[id,index])){
    await tasks.activity(p,'3-4',id,options);
    const reveal=p.getByRole('dialog',{name:/纪念卡结算/});
    await expect(reveal.getByRole('group',{name:`已获得 ${index+1} / 5 颗星`,exact:true})).toBeVisible();
    await expect(reveal.locator('.star-bloom')).toHaveCount(0);
    expect(await p.evaluate(()=>window.awardRevealFrames.interruptions)).toEqual([]);
    await expect(reveal.locator('.story-award-name')).toHaveText('小雨');
    if(index<4)await expect(reveal.locator('time')).toBeHidden();
    else{
      await expect(reveal.locator('time')).toBeVisible();await expect(reveal.locator('.gold-light-ring')).toHaveCSS('opacity','1');
      const date=await reveal.locator('time').textContent();await p.screenshot({path:'output/playwright/award-reveal/account-full.png'});
      await dismissRewardDialog(p,'Enter');await p.goto(base+'unit3-4/#learn/certificate');await expect(p.locator('#certificateDate')).toHaveText(date);
      await p.clock.setFixedTime(new Date(Date.now()+86400000));await p.reload();await expect(p.locator('#certificateDate')).toHaveText(date);
      await p.goto(base+'unit3-4/#learn/listen');
      await p.locator('.stage-listen').getByRole('button',{name:'再练一轮',exact:true}).click();
      await tasks.activity(p,'3-4','listen',options);
      await expect(reveal).toHaveAttribute('data-kind','replay');
      await expect(reveal.getByRole('group',{name:'已获得 5 / 5 颗星',exact:true})).toBeVisible();
      await expect(reveal.locator('time')).toHaveText(date);await expect(reveal.locator('.travelling-star')).toHaveCount(0);
      await expect(reveal.locator('.gold-light-ring')).toHaveCSS('opacity','1');
      const angle=await reveal.locator('.gold-light-ring').evaluate(el=>getComputedStyle(el).getPropertyValue('--gold-angle'));
      await expect.poll(()=>reveal.locator('.gold-light-ring').evaluate(el=>getComputedStyle(el).getPropertyValue('--gold-angle'))).not.toBe(angle);
      await dismissRewardDialog(p,'Escape');await p.goto(base+'unit3-4/#learn/certificate');
      await expect(p.locator('#certificateDate')).toHaveText(date);
      await p.getByRole('link',{name:'我的纪念册',exact:true}).click();await expect(p.locator('.postoffice-scene')).toHaveAttribute('aria-busy','false');await expect(p.locator('.certificate')).toHaveAttribute('data-stars','5');
      await expect(p.getByRole('heading',{name:'我的纪念册'})).toBeVisible();
      continue;
    }
    await dismissRewardDialog(p,'Escape');
  }
  await student.context.close();
});

test('账号改变时正在展示的奖励立即关闭，不遮住身份核验',async({page,browser})=>{
  await adminLogin(page,base);const account=await createStudent(page,'奖励隐私验收班','小雨',[/Lesson 5–6/]);
  const student=await studentLogin(browser,account,base),p=student.page;
  await tasks.activity(p,'5-6','listen',options);const reveal=p.getByRole('dialog',{name:/纪念卡结算/});await expect(reveal).toBeVisible();
  const switcher=await student.context.newPage();await switcher.goto(base);await switcher.locator('.student-account > summary').click();await switcher.getByRole('button',{name:'退出登录',exact:true}).click();
  await expect(reveal).not.toBeVisible();await expect(p.getByRole('alertdialog',{name:'课程访问'})).toBeVisible();
  await student.context.close();
});
