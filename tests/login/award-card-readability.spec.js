'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, studentLogin } = require('./helpers');
const { activity } = require('../support/unit4546');
const base = process.env.AWARD_TEST_BASE || '/lesson/';
test.use({browserName:process.env.AWARD_CARD_BROWSER || 'chromium'});

async function readable(card) {
  // The authenticated cold load prepares the whole course before mounting it.
  await expect(card).toBeVisible({timeout:20000});
  await card.page().evaluate(() => document.fonts.ready);
  const fontStudy = await card.getAttribute('data-unit') === 'unit45-46';
  await expect.poll(() => card.locator('img').evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth))).toBe(true);
  const geometry = await card.evaluate(el => {
    const art = el.querySelector('.story-award-illustration,.card-scene').getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const selectors = ['.story-award-brand,.card-brand', '.story-award-title,.card-title', '.story-award-name,.card-name', '.story-award-stars,.card-stars', '.story-award-foot,.card-caption'];
    return selectors.map(selector => {
      const child = el.querySelector(selector), rect = child.getBoundingClientRect();
      const range = document.createRange(); range.selectNodeContents(child);
      const text = range.getBoundingClientRect(), style = getComputedStyle(child);
      const separated = text.right <= art.left - box.width * .012 || text.bottom <= art.top - box.width * .012 || text.top >= art.bottom + box.width * .012;
      return {selector, separated, inside: text.left >= box.left && text.right <= box.right && text.top >= box.top && text.bottom <= box.bottom,
        fits: text.right <= rect.right + 1 && text.bottom <= rect.bottom + 1, shadow: style.textShadow, weight: style.fontWeight, family:style.fontFamily,
        viewport:innerWidth, bounds:{right:rect.right,bottom:rect.bottom}, content:{right:text.right,bottom:text.bottom},
        motion:child.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity&&a.playState==='running').map(a=>({target:a.effect.target.className,time:a.currentTime,duration:a.effect.getTiming().duration}))};
    });
  });
  for (const item of geometry) {
    expect.soft(item.separated, item.selector + ' must leave a gap before the illustration').toBe(true);
    expect.soft(item.inside, item.selector + ' must remain inside the card').toBe(true);
    expect.soft(item.fits, item.selector + ' must fit its text area: ' + JSON.stringify(item)).toBe(true);
  }
  for (const [index,item] of geometry.slice(0, 3).entries()) {
    expect.soft(item.shadow, item.selector + ' no artificial outline').toBe('none');
    expect.soft(item.weight, item.selector + ' use the supplied real weight').toBe(fontStudy && index > 0 ? '500' : '400');
    if(fontStudy)expect(item.family).toContain('Award Gothic');
  }
  if(fontStudy){
    expect(geometry.at(-1).family).toContain('Award Nunito');
    expect(geometry.at(-1).weight).toBe('600');
    expect(await card.page().evaluate(()=>[...document.fonts].filter(font=>/Award Gothic|Award Nunito/.test(font.family)).every(font=>font.status==='loaded'))).toBe(true);
  }
}

test('45–46 原问题：标题和姓名清晰，桌面与手机图文不重叠', async ({page,browser},info) => {
  await adminLogin(page,base);
  const account = await createStudent(page,'纪念卡清晰度验收','小禾',[/Lesson 45–46/]);
  const learner = await studentLogin(browser,account,base);
  try {
    const p=learner.page;
    for(const width of [1280,768,600,540,390,320]) {
      await p.setViewportSize({width,height:900});
      await p.goto(base+'unit45-46/#learn/certificate');
      const card=p.locator('.stage-certificate .story-award-paper');
      await readable(card);
      await card.screenshot({path:info.outputPath(`course-${width}.png`)});
    }
  } finally { await learner.context.close(); }
});

test('长姓名和六种卡面：课程、悬浮卡、纪念册放大与实际导出保持同一安全排版', async ({page,browser,browserName},info) => {
  // This visual journey captures six units at many sizes and renders two GIFs.
  // Keep each UI assertion's normal deadline; allow WebKit enough total time.
  test.setTimeout(browserName==='webkit'?300000:180000);
  await adminLogin(page,base);
  const pairs=['1–2','3–4','5–6','41–42','43–44','45–46'];
  const account=await createStudent(page,'长姓名卡片验收','阿依努尔·阿卜杜拉',pairs.map(pair=>new RegExp('Lesson '+pair)));
  const learner=await studentLogin(browser,account,base),p=learner.page;
  try {
    for(const pair of pairs) for(const width of [390,1280]) {
      await p.setViewportSize({width,height:900});
      await p.goto(base+'unit'+pair.replace('–','-')+'/#learn/certificate');
      await readable(p.locator('.stage-certificate .story-award-paper'));
      await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath(`long-name-${pair}-${width}.png`)});
    }
    await activity(p,'listen',{base:base.slice(0,-1),keepAward:true});
    const reveal=p.getByRole('dialog',{name:/纪念卡结算/});
    // Measure the settled layout after the earned star's arrival/pop. During
    // that intentional scale animation its pixels exceed the normal slot.
    await expect(reveal.locator('.award-star[data-earned="true"]')).toHaveCount(1);
    await expect.poll(()=>reveal.locator('.story-award-paper').evaluate(el=>
      el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity)
        .every(a=>a.playState==='finished'))).toBe(true);
    for(const width of [1280,768,600,390,320]) {
      await p.setViewportSize({width,height:900});
      await readable(reveal.locator('.story-award-paper'));
      await reveal.locator('.story-award-paper').screenshot({path:info.outputPath(`reveal-${width}.png`)});
    }
    await expect(reveal).not.toHaveAttribute('data-dismissible', 'false'); await reveal.press('Escape');
    await p.setViewportSize({width:1280,height:1000});
    await p.goto(base+'unit45-46/#learn/certificate');
    const pending=p.waitForEvent('download');
    await p.getByRole('button',{name:'保存动图',exact:true}).click();
    await (await pending).saveAs(info.outputPath('course.gif'));
    await p.getByRole('link',{name:'我的纪念册',exact:true}).click();
    await expect(p.locator('.postoffice-scene')).toHaveAttribute('aria-busy','false');
    await readable(p.locator('.certificate'));
    await p.getByRole('button',{name:'查看并保存纪念卡：Lesson 45–46 沟通小能手',exact:true}).click();
    const modal=p.getByRole('dialog',{name:'Lesson 45–46 纪念卡',exact:true});
    for(const width of [1280,768,390,320]) {
      await p.setViewportSize({width,height:1000});
      await readable(modal.locator('.certificate'));
      await modal.screenshot({path:info.outputPath(`album-${width}.png`)});
    }
    const albumPending=p.waitForEvent('download');
    await modal.getByRole('button',{name:'保存动图',exact:true}).click();
    await (await albumPending).saveAs(info.outputPath('album.gif'));
    const sharp=require('sharp');
    for(const kind of ['course','album']) {
      const gif=info.outputPath(kind+'.gif'),meta=await sharp(gif,{animated:true}).metadata();
      expect(meta.pages).toBe(60);expect(meta.width).toBe(984);expect(meta.pageHeight).toBe(528);
      await sharp(gif,{page:0}).png().toFile(info.outputPath(kind+'-export.png'));
    }
    // Compare the saved text and illustration, separately from animated light.
    // WebKit occasionally changes a handful of quantized edge pixels (observed
    // 3 of 256,520 in the illustration); this must never permit shifted text.
    for(const region of [
      {left:54,top:40,width:380,height:190},
      {left:54,top:245,width:380,height:111},
      {left:443,top:30,width:530,height:484},
      {left:54,top:462,width:380,height:45}
    ]) {
      const crop=kind=>sharp(info.outputPath(kind+'.gif'),{page:0}).extract(region).ensureAlpha().raw().toBuffer();
      const a=await crop('course'),b=await crop('album');
      let differentPixels=0,totalDifference=0;
      for(let i=0;i<a.length;i+=4){
        const delta=[0,1,2].map(channel=>Math.abs(a[i+channel]-b[i+channel]));
        totalDifference+=delta.reduce((sum,value)=>sum+value,0);
        if(Math.max(...delta)>2)differentPixels++;
      }
      expect(differentPixels/(a.length/4),'saved text and illustration must keep the same positions').toBeLessThanOrEqual(.0001);
      expect(totalDifference/(a.length/4*3),'saved colors must agree').toBeLessThan(.01);
    }
  } finally { await learner.context.close(); }
});
