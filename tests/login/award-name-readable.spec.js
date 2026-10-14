'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {activity}=require('../support/thirteen-types-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const name='热爱探险和英语学习的小朋友李明小明';

// A learner's minimum-font preference must not make an accepted account name
// overflow. This reproduces the failure without changing records or card CSS.
test.use({browserName:'chromium',launchOptions:{args:['--blink-settings=minimumFontSize=16']}});

async function checkName(card,info,label){
  await expect(card).toBeVisible({timeout:20000});
  await card.page().evaluate(()=>document.fonts.ready);
  await expect(card.locator('.story-award-name,.card-name')).toHaveText(name);
  await card.screenshot({path:info.outputPath(label+'.png')});
  const geometry=await card.evaluate(el=>{
    const child=el.querySelector('.story-award-name,.card-name');
    const area=child.getBoundingClientRect(),range=document.createRange();
    range.selectNodeContents(child);const text=range.getBoundingClientRect();
    const art=el.querySelector('.story-award-illustration,.card-scene').getBoundingClientRect();
    const stars=el.querySelector('.story-award-stars,.card-stars').getBoundingClientRect();
    return {width:innerWidth,font:getComputedStyle(child).font,
      fits:child.scrollWidth<=child.clientWidth+1&&child.scrollHeight<=child.clientHeight+1,
      contained:text.left>=area.left-1&&text.right<=area.right+1&&text.top>=area.top-1&&text.bottom<=area.bottom+1,
      separated:text.right<art.left||text.bottom<art.top,
      aboveStars:text.bottom<=stars.top,
      area:area.toJSON(),text:text.toJSON()};
  });
  expect(geometry.fits,JSON.stringify(geometry)).toBe(true);
  expect(geometry.contained,JSON.stringify(geometry)).toBe(true);
  expect(geometry.separated,JSON.stringify(geometry)).toBe(true);
  expect(geometry.aboveStars,JSON.stringify(geometry)).toBe(true);
}

test('最小字号16px时，真实长姓名在课程、奖励与纪念册中完整显示',async({page,browser},info)=>{
  test.setTimeout(120000);
  await adminLogin(page,base);
  const account=await createStudent(page,'姓名最小字号验收',name,[/Lesson 1–2/]);
  const learner=await studentLogin(browser,account,base),p=learner.page;
  try{
    await p.goto(base+'unit1-2/#learn/certificate');
    for(const width of [1280,768,390,320]){
      await p.setViewportSize({width,height:900});
      await checkName(p.locator('.stage-certificate .story-award-paper'),info,'course-'+width);
    }
    await activity(p,'1-2','listen',{base:base.slice(0,-1),keepAward:true});
    const reveal=p.getByRole('dialog',{name:/纪念卡结算/});
    await expect(reveal.getByRole('group',{name:'已获得 1 / 5 颗星',exact:true})).toBeVisible();
    for(const width of [1280,768,390,320]){
      await p.setViewportSize({width,height:900});
      await checkName(reveal.locator('.story-award-paper'),info,'reveal-'+width);
    }
    await reveal.press('Escape');
    await p.setViewportSize({width:1280,height:1000});
    await p.goto(base+'unit1-2/#learn/certificate');
    await p.getByRole('link',{name:'我的纪念册',exact:true}).click();
    await expect(p.locator('.book')).toHaveAttribute('aria-busy','false');
    await checkName(p.locator('.certificate'),info,'book');
    await p.getByRole('button',{name:/^放大 Lesson 1–2 /}).click();
    const modal=p.getByRole('dialog',{name:'Lesson 1–2 纪念卡',exact:true});
    for(const width of [1280,768,390,320]){
      await p.setViewportSize({width,height:1000});
      await checkName(modal.locator('.certificate'),info,'enlarged-'+width);
    }
  }finally{await learner.context.close();}
});
