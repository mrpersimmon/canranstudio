'use strict';
const {test,expect}=require('@playwright/test');
const KEY='canran:l53:progress:v2';

async function seed(page,ratings){
  await page.addInitScript(({key,values})=>{
    if(localStorage.getItem(key)===null){
      localStorage.setItem(key,JSON.stringify({version:2,ratings:values}));
    }
  },{key:KEY,values:ratings});
}

async function controlCertificatePrintTimer(page){
  await page.addInitScript(()=>{
    const nativeSetTimeout=window.setTimeout.bind(window);
    const nativeClearTimeout=window.clearTimeout.bind(window);
    let nextTimerId=100000;
    const pending=new Map();
    window.__printCalls=0;
    window.__clearedCertificatePrintTimers=[];
    window.print=()=>{window.__printCalls+=1;};
    window.setTimeout=(callback,delay,...args)=>{
      if(delay!==600)return nativeSetTimeout(callback,delay,...args);
      const timerId=nextTimerId++;
      pending.set(timerId,()=>callback(...args));
      return timerId;
    };
    window.clearTimeout=timerId=>{
      if(pending.delete(timerId)){
        window.__clearedCertificatePrintTimers.push(timerId);
        return;
      }
      nativeClearTimeout(timerId);
    };
    window.__pendingCertificatePrintTimers=()=>pending.size;
    window.__runCertificatePrintTimers=()=>{
      const callbacks=Array.from(pending.values());
      pending.clear();
      callbacks.forEach(callback=>callback());
    };
  });
}

test('Lesson 53 exposes an actionable locked certificate from zero stars',async({page})=>{
  await page.goto('/lesson53/#cert');
  await expect(page.locator('#btnPrint')).toBeEnabled();
  await expect(page.locator('#btnPrint')).toHaveAttribute('data-certificate-state','locked');
  await page.locator('#btnPrint').click();
  await expect(page.locator('[data-certificate-count]')).toHaveText('还差 15 颗星，还有 5 关未满星。');
});

test('Lesson 53 jumps to its first not-full-star passport stop',async({page})=>{
  await seed(page,{l1:3,l2:2,l3:3,l4:0,l5:3});
  await page.goto('/lesson53/#cert');
  await page.locator('#btnPrint').click();
  await expect(page.locator('[data-certificate-go]')).toHaveText('前往「伦敦小剧场」补满星');
  await page.locator('[data-certificate-go]').click();
  await expect(page).toHaveURL(/#w2$/);
  await expect(page.locator('#w2 h2')).toBeFocused();
});

test('Lesson 53 blocks fourteen stars and prints at fifteen',async({page})=>{
  await seed(page,{l1:3,l2:3,l3:3,l4:3,l5:2});
  await page.addInitScript(()=>{window.__printCalls=0;window.print=()=>{window.__printCalls+=1;};});
  await page.goto('/lesson53/#cert');
  await page.locator('#certName').fill('小明');
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(()=>window.__printCalls)).toBe(0);
  await page.waitForTimeout(700);
  expect(await page.evaluate(()=>window.__printCalls)).toBe(0);
  await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({
    version:2,ratings:{l1:3,l2:3,l3:3,l4:3,l5:3}
  })),KEY);
  await page.reload();
  await page.locator('#certName').fill('小明');
  await page.locator('#btnPrint').click();
  await expect.poll(()=>page.evaluate(()=>window.__printCalls),{timeout:1500}).toBe(1);
});

test('Lesson 53 rechecks eligibility at the delayed print boundary',async({page})=>{
  await seed(page,{l1:3,l2:3,l3:3,l4:3,l5:3});
  await controlCertificatePrintTimer(page);
  await page.goto('/lesson53/#cert');
  await page.locator('#certName').fill('小明');
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(()=>window.__pendingCertificatePrintTimers())).toBe(1);

  await page.evaluate(()=>{
    window.eval('stars={l1:3,l2:3,l3:3,l4:3,l5:2}');
    window.__runCertificatePrintTimers();
  });

  expect(await page.evaluate(()=>window.__printCalls)).toBe(0);
  await expect(page.locator('#btnPrint')).toHaveAttribute('data-certificate-state','locked');
  await expect(page.locator('[data-certificate-gate]')).toBeVisible();
  await expect(page.locator('[data-certificate-go]')).toBeFocused();
});

test('Lesson 53 keeps only one pending delayed print',async({page})=>{
  await seed(page,{l1:3,l2:3,l3:3,l4:3,l5:3});
  await controlCertificatePrintTimer(page);
  await page.goto('/lesson53/#cert');
  await page.locator('#certName').fill('小明');

  await page.locator('#btnPrint').evaluate(button=>{
    button.click();
    button.click();
  });

  expect(await page.evaluate(()=>window.__pendingCertificatePrintTimers())).toBe(1);
  expect(await page.evaluate(()=>window.__clearedCertificatePrintTimers)).toHaveLength(1);
  await page.evaluate(()=>window.__runCertificatePrintTimers());
  expect(await page.evaluate(()=>window.__printCalls)).toBe(1);
});
