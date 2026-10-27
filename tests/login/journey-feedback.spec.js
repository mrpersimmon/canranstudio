'use strict';
const {test,expect,devices}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {finishZone,readStory,answers}=require('../support/unit1-2-award-flow');
const {sampleSelectionColors}=require('../support/journey-selection');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({...(process.env.JOURNEY_REVIEW_BROWSER==='webkit'?devices['iPhone 13']:{}),browserName:process.env.JOURNEY_REVIEW_BROWSER||'chromium',actionTimeout:10000});

test('地图只显示Lesson底牌，选中反馈清楚且不改变入口尺寸和星数',async({page,browser})=>{
  await adminLogin(page,base);
  const account=await createStudent(page,'地图反馈验收','当前同学',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844}}),p=student.page;
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    const before=await(await p.request.get(base+'api/me')).json();
    for(const [width,height] of [[320,568],[390,844],[768,1024],[1440,1024]]){
      await p.setViewportSize({width,height});
      await expect(async()=>{
        const labels=await p.locator('[data-map-course]').evaluateAll(nodes=>nodes.map(n=>{
          const plate=n.getBoundingClientRect(),text=n.querySelector('.journey-node-lesson-text').getBoundingClientRect();
          return{id:n.dataset.mapCourse,visibleText:n.innerText.trim(),plate:plate.toJSON(),text:text.toJSON()};
        }));
        for(const {id,visibleText,plate,text}of labels){
          expect(visibleText,`${id} map plate at ${width}px`).toBe('Lesson '+id.replace('unit','').replace('-','–'));
          expect(plate.height,`${id} touch target at ${width}px`).toBeGreaterThanOrEqual(44);
          expect(text.left).toBeGreaterThanOrEqual(plate.left+1);expect(text.right).toBeLessThanOrEqual(plate.right-1);
          expect(text.top).toBeGreaterThanOrEqual(plate.top+1);expect(text.bottom).toBeLessThanOrEqual(plate.bottom-1);
        }
      }).toPass({timeout:2000});
    }
    for(const id of ['unit3-4','unit5-6','unit1-2']){
      const node=p.locator(`[data-map-course="${id}"]`);
      const before=await node.evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,background:getComputedStyle(el).backgroundColor}));
      await node.click();
      const immediate=await sampleSelectionColors(p);
      for(const frame of immediate)for(const item of frame.nodes)expect(item.contrast,item.id+' first-frame Lesson readability').toBeGreaterThanOrEqual(4.5);
      await expect(p.locator('[data-map-course][aria-pressed="true"]')).toHaveCount(1);
      await expect(node).toHaveAttribute('aria-pressed','true');
      await expect.poll(()=>node.evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe(before.background);
      const after=await node.boundingBox();expect(after.width).toBeCloseTo(before.width,1);expect(after.height).toBeCloseTo(before.height,1);
      await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
      await expect(p.locator('.journey-dock')).toContainText('当前课程');
    }
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(before.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await student.context.close();}
});

test('真实一星持续亮光，满星庆祝一次留下金章，重看和刷新不改变成果',async({page,browser})=>{
  test.setTimeout(240000);await adminLogin(page,base);
  const account=await createStudent(page,'地图星光验收','星光同学',[/Lesson 1–2 /,/Lesson 3–4 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:1440,height:1024},reducedMotion:'no-preference'}),p=student.page;
  const row=()=>p.locator('[data-stars-course="unit1-2"]');
  const home=async()=>{await p.getByRole('link',{name:'我的课程',exact:true}).click();await expect(p.locator('[data-journey-ready]')).toBeVisible();};
  try{
    await expect(row().locator('.journey-star[data-earned="false"]')).toHaveCount(5);
    await expect(p.locator('[data-landmark-course]')).toHaveCount(0);
    const zones=Object.keys(answers);
    await finishZone(p,zones[0],{base:base+'unit1-2/'});
    await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');await home();
    await expect(row().locator('.journey-star[data-earned="true"]')).toHaveCount(1);
    const earned=row().locator('.journey-star[data-earned="true"]');
    await expect(earned.locator('img')).toHaveAttribute('src',base+'assets/awards/star-earned.webp');
    await expect(p.locator('[data-landmark-course]')).toHaveCount(0);
    const glint=earned.locator('.journey-star-glint');
    const motion=await glint.evaluate(async element=>{
      const values=new Set(),start=performance.now();
      while(performance.now()-start<5300&&values.size<4){const css=getComputedStyle(element);values.add(css.opacity+':'+css.transform);await new Promise(requestAnimationFrame);}
      return {values:[...values],repeat:getComputedStyle(element).animationIterationCount};
    });
    expect(motion.repeat).toBe('infinite');expect(motion.values.length).toBeGreaterThan(3);
    expect(await row().locator('[data-earned="false"]').evaluateAll(stars=>stars.every(s=>s.getAnimations({subtree:true}).length===0))).toBe(true);
    // Understanding questions are unlocked by actually reading the story.
    // Follow the existing lesson flow rather than injecting a completion flag.
    await readStory(p,base+'unit1-2/');
    for(const zone of zones.slice(1))await finishZone(p,zone,{base:base+'unit1-2/'});
    await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');await home();
    await expect(row().locator('[data-earned="true"]')).toHaveCount(5);
    await expect(p.locator('[data-landmark-course="unit1-2"]')).toBeVisible();
    await expect.poll(()=>p.locator('[data-landmark-select="unit1-2"] .journey-story-sheen').evaluate(el=>el.getAnimations().length)).toBe(1);
    await expect(p.locator('[data-landmark-course="unit3-4"]')).toHaveCount(0);
    const saved=await(await p.request.get(base+'api/me')).json();
    const savedAwards=await(await p.request.get(base+'api/awards')).json();
    const fullCard=savedAwards.cards.find(card=>card.course==='unit1-2'&&card.current);
    expect(fullCard.stars).toBe(5);expect(fullCard.firstFullStarAt).toBeTruthy();
    const medal=p.locator('[data-completion-medal="unit1-2"]');
    const sheen=p.locator('[data-landmark-select="unit1-2"] .journey-story-sheen');
    await expect(p.locator('.journey-landmark-light,.journey-landmark-ring')).toHaveCount(0);
    await expect.poll(()=>sheen.evaluate(el=>el.getAnimations().length)).toBe(0);
    expect(await medal.locator('img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
    const medalLight=await medal.locator('.journey-medal-face').evaluate(async el=>{
      const samples=new Set(),start=performance.now();
      while(performance.now()-start<5300&&samples.size<4){const style=getComputedStyle(el,'::after');samples.add(style.opacity+':'+style.backgroundPosition);await new Promise(requestAnimationFrame);}
      return {samples:[...samples],repeat:getComputedStyle(el,'::after').animationIterationCount};
    });
    expect(medalLight.repeat).toBe('infinite');expect(medalLight.samples.length).toBeGreaterThan(3);
    // An explicit replay is reviewable even when a test account already had
    // full stars. It is an animation only, never another completion event.
    await medal.click();
    await expect.poll(()=>sheen.evaluate(el=>el.getAnimations().length)).toBe(1);
    await expect.poll(()=>sheen.evaluate(el=>el.getAnimations().length)).toBe(0);
    await p.locator('[data-map-course="unit3-4"]').click();
    await expect(medal).toBeVisible();await expect(p.locator('[data-landmark-course="unit3-4"]')).toHaveCount(0);
    await p.reload();await expect(medal).toBeVisible();
    expect(await sheen.evaluate(el=>el.getAnimations().length)).toBe(0);
    expect(await medal.locator('img').evaluate(el=>el.getAnimations().length)).toBe(0);
    await p.emulateMedia({reducedMotion:'reduce'});
    await expect.poll(()=>p.locator('.journey-star-glint').evaluateAll(nodes=>nodes.every(el=>getComputedStyle(el).animationName==='none'))).toBe(true);
    expect(await earned.first().evaluate(el=>getComputedStyle(el,'::after').animationName)).toBe('none');
    expect(await medal.locator('.journey-medal-face').evaluate(el=>getComputedStyle(el,'::after').animationName)).toBe('none');
    await medal.click();expect(await sheen.evaluate(el=>el.getAnimations().length)).toBe(0);
    await expect(medal).toBeVisible();
    await p.emulateMedia({reducedMotion:'no-preference'});
    expect(await sheen.evaluate(el=>el.getAnimations().length)).toBe(0);
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(saved.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
    const afterAwards=await(await p.request.get(base+'api/awards')).json();
    expect(afterAwards.cards.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(savedAwards.cards.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await student.context.close();}
});
