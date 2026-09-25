'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, studentLogin, signIn } = require('./helpers');

async function appearance(dialog) {
  return dialog.evaluate(element => {
    function colour(value) { const parts=value.match(/[\d.]+/g).map(Number); return [...parts.slice(0,3),parts[3]??1]; }
    function luminance(channels) { return channels.slice(0,3).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0); }
    const box=element.getBoundingClientRect();
    return {
      viewport:{width:innerWidth,height:innerHeight}, box:{x:box.x,y:box.y,width:box.width,height:box.height}, overflow:element.scrollWidth>element.clientWidth,
      buttons:[...element.querySelectorAll('button')].map(button=>{
        const text=colour(getComputedStyle(button).color); let parent=button,background;
        while(parent){background=colour(getComputedStyle(parent).backgroundColor);if(background[3]===1)break;parent=parent.parentElement;}
        const values=[luminance(text),luminance(background)].sort((a,b)=>b-a);
        const rect=button.getBoundingClientRect();
        return {label:button.textContent,contrast:(values[0]+.05)/(values[1]+.05),width:rect.width,height:rect.height,x:rect.x,y:rect.y,right:rect.right,bottom:rect.bottom};
      })
    };
  });
}

async function openSettings(page) {
  const trigger=page.getByRole('button',{name:'界面体验 · 学习设置'});
  await expect(trigger).toBeVisible();
  const rect=await trigger.boundingBox();
  // A real tap on the visible sticky header; locator.click's automatic scrolling
  // otherwise moves the page before the popup handler even receives the click.
  expect(rect.y).toBeGreaterThanOrEqual(0);
  expect(rect.y+rect.height).toBeLessThanOrEqual(page.viewportSize().height);
  await page.mouse.click(rect.x+rect.width/2,rect.y+rect.height/2);
  const dialog=page.getByRole('dialog',{name:/^界面体验的\s*学习设置$/});
  await expect(dialog).toBeVisible();
  return dialog;
}

async function expectUsable(dialog) {
  const result=await appearance(dialog);
  expect(Math.abs(result.box.x+result.box.width/2-result.viewport.width/2),'horizontal centre').toBeLessThanOrEqual(2);
  expect(Math.abs(result.box.y+result.box.height/2-result.viewport.height/2),'vertical centre').toBeLessThanOrEqual(2);
  expect(result.box.x).toBeGreaterThanOrEqual(15);
  expect(result.box.y).toBeGreaterThanOrEqual(15);
  expect(result.box.width).toBeLessThanOrEqual(result.viewport.width-30);
  expect(result.box.height).toBeLessThanOrEqual(result.viewport.height-30);
  expect(result.overflow,'dialog horizontal overflow').toBe(false);
  for(const button of result.buttons){
    expect(button.contrast,button.label+' text contrast').toBeGreaterThanOrEqual(4.5);
    expect(button.width,button.label+' tap width').toBeGreaterThanOrEqual(44);
    expect(button.height,button.label+' tap height').toBeGreaterThanOrEqual(44);
  }
}

test('学习设置在屏幕中间，按钮文字清晰且关闭不改变学习', async ({ page, browser }) => {
  await adminLogin(page);
  const account=await createStudent(page,'设置检查班','界面体验',[/Lesson 1–2 /]);
  const student=await studentLogin(browser,account);
  try {
    await student.page.setViewportSize({width:1180,height:720});
    await student.page.goto('/lesson/unit1-2/#learn/words');
    await expect(student.page.locator('.unit-word').first()).toBeVisible();
    await student.page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
    const before={url:student.page.url(),stars:await student.page.locator('#starCount').textContent(),scroll:await student.page.evaluate(()=>scrollY)};
    const dialog=await openSettings(student.page);
    await expectUsable(dialog);
    await student.page.screenshot({path:'output/login/settings-unit12-desktop.png'});
    expect(await student.page.evaluate(()=>scrollY)).toBe(before.scroll);
    await dialog.getByRole('button',{name:'关闭',exact:true}).click();
    await expect(dialog).toHaveCount(0);
    expect(student.page.url()).toBe(before.url);await expect(student.page.locator('#starCount')).toHaveText(before.stars);
    expect(await student.page.evaluate(()=>scrollY)).toBe(before.scroll);
    await expect(student.page.getByRole('button',{name:'界面体验 · 学习设置'})).toBeFocused();
  } finally { await student.context.close(); }
});

test('16 个单元的学习设置在桌面和手机均清晰居中，Escape 返回原课程',async({page,browser})=>{
  test.setTimeout(120000);
  await adminLogin(page);
  const account=await createStudent(page,'设置全课班','界面体验',[/Lesson 1–2 /]);
  await page.getByRole('button',{name:'管理 设置全课班'}).click();
  for(const box of await page.getByRole('checkbox').all())await box.check();
  await page.getByRole('button',{name:'保存开放课程'}).click();
  await expect(page.getByRole('status')).toContainText('开放课程已保存');
  const student=await studentLogin(browser,account);
  try{
    const courses=[...Array.from({length:15},(_,i)=>`unit${i*2+1}-${i*2+2}`),'unit49-50'];
    for(const course of courses)for(const viewport of [{width:1180,height:720},{width:390,height:844}])await test.step(`${course} ${viewport.width}px`,async()=>{
      await student.page.setViewportSize(viewport);
      await student.page.goto(`/lesson/${course}/#learn/words`);
      await expect(student.page.locator('.unit-word').first()).toBeVisible();
      const dialog=await openSettings(student.page);
      await expectUsable(dialog);
      if(viewport.width===390&&['unit1-2','unit49-50'].includes(course))await student.page.screenshot({path:`output/login/settings-${course}-mobile.png`});
      await student.page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(student.page).toHaveURL(new RegExp(`/${course}/#learn/words$`));
      await expect(student.page.getByRole('button',{name:'界面体验 · 学习设置'})).toBeFocused();
    });
  }finally{await student.context.close();}
});

test('窄屏与横屏的重开确认可读，取消不丢已选答案，账号按钮仍可使用',async({page,browser})=>{
  await adminLogin(page);
  const account=await createStudent(page,'设置操作班','界面体验',[/Lesson 13–14 /]);
  const student=await studentLogin(browser,account);
  try{
    for(const [index,viewport] of [{width:320,height:568},{width:740,height:360}].entries()){
      await student.page.setViewportSize(viewport);
      await student.page.goto('/lesson/unit13-14/#learn/colours');
      const choice=student.page.locator('.stage-colours').getByRole('button',{name:"What colour's your hat?",exact:true});
      await choice.click();
      const dialog=await openSettings(student.page);
      await dialog.getByRole('button',{name:'重开本课',exact:true}).click();
      await expect(dialog.getByRole('button',{name:'确认清空本课个人成果',exact:true})).toBeVisible();
      await expectUsable(dialog);
      await student.page.screenshot({path:`output/login/settings-confirm-${viewport.width}.png`});
      await dialog.getByRole('button',{name:'关闭',exact:true}).click();
      await expect(choice).toHaveAttribute('aria-pressed','true');
      await expect(student.page.locator('#starCount')).toHaveText('0');
      const reopened=await openSettings(student.page);
      await expect(reopened.getByRole('button',{name:'重开本课',exact:true})).toBeVisible();
      await reopened.getByRole('button',{name:index?'退出登录':'切换学生',exact:true}).click();
      await expect(student.page.getByRole('button',{name:'进入我的课程'})).toBeVisible();
      if(!index)await signIn(student.page,account);
    }
  }finally{await student.context.close();}
});
