'use strict';
const {test,expect}=require('@playwright/test');

const CASES=[
  {
    label:'Lesson 49',path:'/lesson49/',hash:'#l5',key:'canran:l49:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#certBtn',status:'#certGateMsg',
    course:'Lesson 49 · 肉店大冒险',iconAsset:'/assets/lesson49/icons/star.svg',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#c43f36'
  },
  {
    label:'Lesson 50',path:'/lesson50/',hash:'#l5',key:'canran:l50:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#certBtn',status:'#certGateMsg',
    course:'Lesson 50 · 挑食小王子',icon:'👑',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#7250b5'
  },
  {
    label:'Lesson 51',path:'/lesson51/',hash:'#cert',key:'canran:l51:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#btnPrint',status:'#certGateMsg',
    course:'Lesson 51 · 希腊四季之旅',icon:'🏛️',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#1d6fb8'
  },
  {
    label:'Lesson 52',path:'/lesson52/',hash:'#cert',key:'canran:l52:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#btnPrint',status:'#certGate',
    course:'Lesson 52 · 环球小使者 Ⅰ',icon:'🛂',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#4A5BAE'
  },
  {
    label:'Lesson 53',path:'/lesson53/',hash:'#cert',key:'canran:l53:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#btnPrint',status:'#certGate',
    course:'Lesson 53 · 气候小主播',icon:'🌦️',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#3C9158'
  },
  {
    label:'Lesson 54',path:'/lesson54/',hash:'#cert',key:'canran:l54:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#btnPrint',status:'#certGate',
    course:'Lesson 54 · 环球小使者 Ⅱ',icon:'🛂',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#167d92'
  },
  {
    label:'soundmark',path:'/soundmark/',hash:'#cert',key:'canran:soundmark:progress:v2',
    ratings:{vs:3,g1:3,g2:2,g3:3},trigger:'#btnOpenCert',status:'#certNeed',
    course:'音标番外篇 · 魔法乐园',icon:'🪄',
    expectedCount:'还差 1 颗星，还有 1 项挑战未满星。',accent:'#ef7047'
  }
];

for(const config of CASES){
test(`${config.label} shares the responsive accessible certificate ticket`,async({page})=>{
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.addInitScript(({key,ratings})=>localStorage.setItem(key,JSON.stringify({
  version:2,ratings
})),{key:config.key,ratings:config.ratings});
await page.setViewportSize({width:390,height:844});
await page.goto(`${config.path}${config.hash}`);
const trigger=page.locator(config.trigger);
const status=page.locator(config.status);
const gate=page.locator('[data-certificate-gate]');
await expect(trigger).toBeEnabled();
await trigger.click();
await expect(gate).toBeVisible();
await expect(page.locator('[data-certificate-count]')).toHaveText(config.expectedCount);
await expect(page.locator('[data-certificate-course]')).toHaveText(config.course);
if(config.iconAsset){
  const icon=page.locator('[data-certificate-icon] img');
  await expect(icon).toHaveAttribute('src',config.iconAsset);
  await expect.poll(()=>icon.evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
}else await expect(page.locator('[data-certificate-icon]')).toHaveText(config.icon);
await expect(trigger).toHaveAttribute('aria-expanded','true');
const statusId=await status.getAttribute('id');
const gateId=await gate.getAttribute('id');
expect(statusId).toBeTruthy();
expect(gateId).toBeTruthy();
await expect(trigger).toHaveAttribute('aria-describedby',statusId);
await expect(trigger).toHaveAttribute('aria-controls',gateId);
await expect(status).toHaveAttribute('role','status');
await expect(status).toHaveAttribute('aria-live','polite');
await expect(status).toHaveAttribute('aria-atomic','true');
await expect(page.locator('[data-certificate-dismiss]')).toHaveText('稍后再说');
expect(await gate.evaluate(element=>
  getComputedStyle(element).getPropertyValue('--certificate-gate-accent').trim()
)).toBe(config.accent);
expect(await page.evaluate(()=>({
  viewport:document.documentElement.clientWidth,
  page:document.documentElement.scrollWidth
}))).toEqual({viewport:390,page:390});
await page.emulateMedia({media:'print'});
await expect(trigger).toBeHidden();
await expect(gate).toBeHidden();
expect(errors).toEqual([]);
});
}

test('missing target keeps the gate open and never prints',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('canran:l51:progress:v2',JSON.stringify({
      version:2,ratings:{l1:3,l2:2,l3:3,l4:3,l5:3}
    }));
    window.__printCalls=0;
    window.print=()=>{window.__printCalls+=1;};
  });
  await page.goto('/lesson51/#cert');
  await page.locator('#w2').evaluate(element=>element.remove());
  const before=page.url();
  await page.locator('#btnPrint').click();
  await page.locator('[data-certificate-go]').click();
  await expect(page.locator('[data-certificate-gate]')).toBeVisible();
  await expect(page.locator('#certGateMsg')).toHaveText('暂时找不到目标关卡，请使用课程导航。');
  expect(page.url()).toBe(before);
  expect(await page.evaluate(()=>window.__printCalls)).toBe(0);
});

test('certificate navigation is instant when reduced motion is requested',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(()=>{
    localStorage.setItem('canran:l51:progress:v2',JSON.stringify({
      version:2,ratings:{l1:3,l2:2,l3:3,l4:3,l5:3}
    }));
  });
  await page.goto('/lesson51/#cert');
  await page.locator('#btnPrint').click();
  await page.locator('[data-certificate-go]').click();
  await expect(page).toHaveURL(/#w2$/);
  await expect(page.locator('#w2 h2')).toBeFocused();

  const result=await page.evaluate(async()=>{
    const positions=[window.scrollY];
    await new Promise(resolve=>requestAnimationFrame(resolve));
    positions.push(window.scrollY);
    await new Promise(resolve=>requestAnimationFrame(resolve));
    positions.push(window.scrollY);
    return {
      rootBehavior:getComputedStyle(document.documentElement).scrollBehavior,
      positions
    };
  });
  expect(result.rootBehavior).toBe('auto');
  expect(new Set(result.positions).size).toBe(1);
});
