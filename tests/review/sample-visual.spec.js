'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const units=process.env.SAMPLE_UNITS?.split(',')||['unit1-2','unit3-4','unit5-6','unit7-8','unit9-10','unit11-12'];
test('a short sentence task shares its umbrella art and fits on iPhone SE',async({page})=>{
 await page.goto('/?'+new URLSearchParams({unit:'unit9-10',page:'q:u910-five-a-umbrella',state:'correct',device:devices[0].id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),content=frame.locator('.learning-surface .practice-content');
 expect(await content.evaluate(e=>e.scrollHeight-e.clientHeight)).toBeLessThanOrEqual(1);
 await expect(content.locator('img.practice-scene')).toHaveAttribute('src',/unit3-4-journey\/umbrella-purple-v1\.webp$/);
});
test('question objects reuse the reviewed vocabulary art without changing teaching choices',async({page})=>{
 await page.goto('/?'+new URLSearchParams({unit:'unit1-2',page:'q:u12-types-v1-c08',state:'before',device:devices[0].id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
 await expect(frame.locator('.learning-surface .picture-option').filter({hasText:'房子'}).locator('img')).toHaveAttribute('src',/\/sample1-12\/house-v1\.webp$/);
  expect((await frame.locator('.learning-surface .picture-option>span').allTextContents()).sort()).toEqual(['房子','小汽车','外套'].sort());
  await frame.locator('.learning-surface .picture-option').filter({hasText:'房子'}).click();
  await frame.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(frame.locator('.learning-surface .fb')).toHaveText('答对了！');
});
for(const unit of units)test(unit+' illustrated story keeps dialogue transparent and actors inside the scene',async({page},info)=>{
 for(const device of devices){
  await page.goto('/?'+new URLSearchParams({unit,page:'story-complete',device:device.id}));
  await expect(page.locator('#loading')).toBeHidden({timeout:45000});
  await expect(page.locator('#error')).toBeHidden();
  const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),scene=frame.locator('.learning-surface .dialogue-stage');
  const paint=await scene.evaluate(e=>({background:getComputedStyle(e).backgroundImage,log:getComputedStyle(e.querySelector('.dialogue-log')).backgroundColor}));
  expect(paint.background).toMatch(/(?:learning-sample-v[12]|unit3-4-journey)/);
  expect(paint.log).toBe('rgba(0, 0, 0, 0)');
  if(['unit15-16','unit17-18','unit19-20'].includes(unit))expect(Number(await scene.locator('.learning-story-art').getAttribute('data-scene-scale')),'one ground plane must not shrink a legacy two-row cast').toBeGreaterThanOrEqual(.95);
  const last=frame.locator('.dialogue-log .bubble-row').last();
  const name=await last.locator('.bname').boundingBox(),button=await last.locator('.bbtns').boundingBox(),text=await last.locator('.btext').boundingBox();
  expect(Math.abs(name.y+name.height/2-button.y-button.height/2)).toBeLessThan(6);
  expect(text.y).toBeGreaterThanOrEqual(name.y+name.height-1);
  const clipped=await scene.evaluate(e=>{const b=e.getBoundingClientRect();return [...e.querySelectorAll('img')].filter(i=>i.getClientRects().length&&!i.closest('[hidden]')).filter(i=>{const r=i.getBoundingClientRect();return r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom+1;}).map(i=>i.getAttribute('src'));});
  expect(clipped).toEqual([]);
  await page.locator('#frame-shell').screenshot({path:info.outputPath(unit+'-'+device.id+'.png')});
 }
});
