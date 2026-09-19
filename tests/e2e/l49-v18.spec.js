'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion:'reduce', actionTimeout:5000 });

async function capture(page, stage, name) {
  const viewport=page.viewportSize();
  await page.setViewportSize({width:viewport.width,height:1800});
  await stage.screenshot({path:`output/playwright/l49-v18-${name}-${viewport.width}.png`,style:'#topbar{visibility:hidden!important} :focus{outline:none!important}'});
  await page.setViewportSize(viewport);
}
async function bulbLayout(stage) {
  const hint=stage.getByRole('button',{name:'给点线索',exact:true});
  const check=stage.getByRole('button',{name:'检查答案',exact:true});
  await expect(hint.locator('img')).toBeVisible();
  expect(await hint.locator('img').evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
  await expect(hint).toHaveText('');
  const h=await hint.boundingBox(),c=await check.boundingBox();
  expect(h.width).toBe(52);expect(h.height).toBe(52);
  expect(Math.abs(h.y-c.y)).toBeLessThan(1);
  expect(c.x-h.x-h.width).toBeGreaterThanOrEqual(8);
  expect(c.x-h.x-h.width).toBeLessThanOrEqual(16);
  const group=stage.getByRole('group',{name:'作答操作',exact:true});
  const g=await group.boundingBox(),s=await stage.boundingBox();
  expect(Math.abs(g.x+g.width/2-s.x-s.width/2)).toBeLessThan(2);
  return {hint,check};
}

test('问话线索统一为检查左侧灯泡，展开、检查、重试与刷新保持稳定',async({page})=>{
  await page.setViewportSize({width:320,height:664});
  await page.goto('/lesson49/#learn/doare');await page.evaluate(()=>document.fonts.ready);
  const stage=page.locator('.stage-doare');
  await capture(page,stage,process.env.L49_HINT_PASS==='before'?'before':'doare');
  const {hint,check}=await bulbLayout(stage);
  const top=element=>element.evaluate(node=>node.getBoundingClientRect().top+scrollY);
  const options=stage.locator('.practice-options');
  const initial={check:await top(check),options:await top(options)};
  await hint.focus();const before=await page.evaluate(()=>scrollY);
  await hint.press('Enter');
  await expect(hint).toHaveAttribute('aria-expanded','true');
  await expect(stage.locator('.practice-hint')).toContainText('本句用动词 like 表达喜好');
  await expect(stage.locator('.practice-hint')).toBeInViewport();
  await expect(check).toBeDisabled();
  await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);
  await expect(page.locator('#starCount')).toHaveText('0');
  expect(await page.evaluate(()=>scrollY)).toBe(before);
  expect(await top(check)).toBe(initial.check);expect(await top(options)).toBe(initial.options);
  await capture(page,stage,'doare-hint');
  await options.getByRole('button',{name:'Are you like meat?',exact:true}).click();
  await check.scrollIntoViewIfNeeded();const selectedScroll=await page.evaluate(()=>scrollY);
  await check.press('Enter');
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。本句用动词 like 表达喜好，一般现在时问句是 Do you like meat?');
  await expect(hint).toBeDisabled();await expect(stage.locator('.practice-hint')).toBeHidden();
  const retry=stage.getByRole('button',{name:'再试一次',exact:true});
  expect(await top(retry)).toBe(initial.check);expect(await top(options)).toBe(initial.options);
  expect(await page.evaluate(()=>scrollY)).toBe(selectedScroll);
  await retry.click();
  await expect(hint).toBeEnabled();await expect(hint).toHaveAttribute('aria-expanded','true');
  await expect(stage.locator('.practice-hint')).toBeVisible();
  await page.reload();
  await bulbLayout(stage);await expect(hint).toHaveAttribute('aria-expanded','true');
  await expect(check).toBeDisabled();
  await options.getByRole('button',{name:'Do you like meat?',exact:true}).click();
  await check.click();await expect(hint).toBeDisabled();
  const next=stage.getByRole('button',{name:'下一题',exact:true});
  expect(await top(next)).toBe(initial.check);
  await next.click();await expect(hint).toBeEnabled();
  await expect(hint).toHaveAttribute('aria-expanded','false');await expect(check).toBeDisabled();
});

async function prepare(page, automatic=true) {
  await page.addInitScript(automatic=>{
    if(!localStorage.getItem('canran:l49:learning:v1')){
      localStorage.setItem('canran:l49:learning:v1',JSON.stringify({version:1,groups:{},records:{},activity:{fullDialogue:true}}));
      localStorage.setItem('l49-stars-v1',JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3}));
    }
    // Audio is the browser boundary; all learning actions use visible controls.
    window.playedAudio=[];
    window.Audio=class extends EventTarget{
      constructor(src){super();this.src=src;this.paused=true;this.currentTime=0;}
      play(){this.paused=false;window.playedAudio.push(this);if(automatic)queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}
      pause(){this.paused=true;}
    };
  },automatic);
}

for(const width of [320,768,1280])test(`${width} 宽度八个非听辨活动统一灯泡，提示可读且刷新不预选、不播放`,async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width,height:width<500?664:900});await prepare(page);
  for(const id of ['roles','doare','give','pouch','either','fill','choice','trans']){
    await page.goto(`/lesson49/#learn/${id}`);await page.evaluate(()=>document.fonts.ready);
    const stage=page.locator(`.stage-${id}`),{hint,check}=await bulbLayout(stage);
    await expect(hint.locator('img')).toHaveAttribute('src','/assets/lesson49/icons/hint.svg');
    await expect(hint).toHaveAttribute('aria-expanded','false');
    const options=stage.locator('.practice-options');
    const top=element=>element.evaluate(node=>node.getBoundingClientRect().top+scrollY);
    const geometry={options:await top(options),check:await top(check)};
    await hint.focus();const scroll=await page.evaluate(()=>scrollY);
    await hint.press('Space');
    const copy=stage.locator('.practice-hint');
    await expect(copy).toBeVisible();await expect(copy).not.toBeEmpty();
    await expect(hint).toHaveAttribute('aria-expanded','true');
    await expect(check).toBeDisabled();
    await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);
    await expect(stage.getByRole('group',{name:'已选词块',exact:true}).getByRole('button')).toHaveCount(0);
    expect(await page.evaluate(()=>scrollY)).toBe(scroll);
    expect(await top(check)).toBe(geometry.check);expect(await top(options)).toBe(geometry.options);
    // The beginning of even a long hint must be reachable, without moving the page.
    const note=copy.locator('..'),n=await note.boundingBox(),p=await copy.boundingBox();
    expect(p.y).toBeGreaterThanOrEqual(n.y-1);
    expect(await copy.evaluate(node=>node.scrollWidth<=node.clientWidth+1)).toBe(true);
    await expect(copy).toBeInViewport();
    await expect(page.locator('#starCount')).toHaveText('15');
    expect(await page.evaluate(()=>window.playedAudio.length)).toBe(0);
    if(['doare','trans','exam'].includes(id)&&[320,1280].includes(width))await capture(page,stage,`${id}-all-hints`);
    await page.reload();
    await expect(hint).toHaveAttribute('aria-expanded','true');await expect(copy).toBeVisible();
    await expect(check).toBeDisabled();await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);
    expect(await page.evaluate(()=>window.playedAudio.length)).toBe(0);
  }
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();
  await expect(page.locator('#learningRecord')).toContainText('还没有新的作答记录');
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  await expect(page.locator('.stage-listen').getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
});

test('词块题用线索后仍需手动拼装，记录提示后完成，下一题和重练清空线索',async({page})=>{
  await prepare(page);await page.goto('/lesson49/#learn/trans');
  const stage=page.locator('.stage-trans'),{hint,check}=await bulbLayout(stage);
  await hint.click();await page.reload();await expect(hint).toHaveAttribute('aria-expanded','true');
  const bank=stage.getByRole('group',{name:'待选词块',exact:true});
  await expect(stage.getByRole('group',{name:'已选词块',exact:true}).getByRole('button')).toHaveCount(0);
  await expect(check).toBeDisabled();
  for(const word of ['She','likes','peaches.'])await bank.getByRole('button',{name:word,exact:true}).click();
  await check.click();await expect(stage.getByRole('status')).toHaveText('答对了！');
  await expect(hint).toBeDisabled();await expect(stage.locator('.practice-hint')).toBeHidden();
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();
  await expect(page.locator('#learningRecord')).toContainText('提示后完成');
  await expect(page.locator('#learningRecord')).toContainText('额外提示已用');
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  await stage.getByRole('button',{name:'下一题',exact:true}).click();
  await expect(hint).toHaveAttribute('aria-expanded','false');await expect(check).toBeDisabled();
  for(const word of ['He','wants','a car.'])await bank.getByRole('button',{name:word,exact:true}).click();
  await check.click();await stage.getByRole('button',{name:'完成这一站',exact:true}).click();
  await expect(hint).toHaveCount(0);
  await stage.getByRole('button',{name:'再练一轮',exact:true}).click();
  await expect(hint).toBeEnabled();await expect(hint).toHaveAttribute('aria-expanded','false');await expect(check).toBeDisabled();
});

test('挑战听辨保留听完门槛；阅读题灯泡、暂停和刷新不自动作答',async({page})=>{
  await prepare(page,false);await page.goto('/lesson49/#learn/exam');await page.locator('#quizStartBtn').click();
  const stage=page.locator('.stage-exam'),check=stage.getByRole('button',{name:'检查答案',exact:true});
  await expect(stage.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
  await stage.locator('.practice-options').getByRole('button',{name:'mince',exact:true}).click();
  await expect(check).toBeDisabled();
  await stage.getByRole('button',{name:'暂停，稍后继续',exact:true}).click();
  await page.reload();await stage.getByRole('button',{name:'继续挑战',exact:true}).click();
  await expect(check).toBeDisabled();
  expect(await page.evaluate(()=>window.playedAudio.length)).toBe(0);
  await stage.getByRole('button',{name:'听一遍',exact:true}).click();await expect(check).toBeDisabled();
  await page.evaluate(()=>window.playedAudio.at(-1).dispatchEvent(new Event('ended')));
  await expect(check).toBeEnabled();await check.click();
  await expect(stage.getByRole('status')).toHaveText('答对了！');
  await stage.getByRole('button',{name:'下一题',exact:true}).click();
  const {hint}=await bulbLayout(stage);
  await expect(hint).toHaveAttribute('aria-expanded','false');await expect(check).toBeDisabled();
  await hint.click();
  await stage.getByRole('button',{name:'暂停，稍后继续',exact:true}).click();
  await page.reload();await stage.getByRole('button',{name:'继续挑战',exact:true}).click();
  await bulbLayout(stage);
  await expect(hint).toHaveAttribute('aria-expanded','true');await expect(check).toBeDisabled();
  await expect(stage.locator('.practice-hint')).toBeVisible();
  await expect(stage.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
  expect(await page.evaluate(()=>window.playedAudio.length)).toBe(0);
});
