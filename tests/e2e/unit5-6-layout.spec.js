'use strict';
const { test, expect } = require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
for(const width of [320,390,768,1280])test(`${width} 宽度各站没有横向溢出，图片完整，帮助关闭后焦点回原处`,async({page})=>{
  test.setTimeout(60000);await page.setViewportSize({width,height:740});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const activity of ['words','listen','text','roles','phrases','introduce','models','cars','exam','certificate']){
    await page.goto('/unit5-6/#learn/'+activity);const room=page.locator('.stage-'+activity);
    await expect(room.getByRole('heading').first()).toBeInViewport();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect.poll(()=>room.locator('img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
    await expect(room.getByRole('button',{name:'怎么玩',exact:true})).toHaveCount(0);await page.locator('#notebookButton').click();await page.keyboard.press('Escape');await expect(page.locator('#notebookButton')).toBeFocused();
    if([390,1280].includes(width)&&['words','text','listen','introduce','cars'].includes(activity))await page.screenshot({path:`output/playwright/unit5-6/${activity}-${width}.png`});
  }
  expect(errors).toEqual([]);
});

test('24 张词卡的配套音标在窄屏翻面和刷新后不丢失、不裁切',async({page})=>{
  await page.setViewportSize({width:320,height:740});await page.goto('/unit5-6/#learn/words');const room=page.locator('.stage-words');
  const phonetics=['/frentʃ/','/ˈdʒɝːmən/','/ˌdʒæpəˈniːz/','/ˌsaʊθ kəˈriːən/','/tʃaɪˈniːz/','/ˈswiːdɪʃ/','/ˈɪŋɡlɪʃ/','/əˈmerɪkən/','/ˈstuːdənt/','/ˈmɪstɚ/','/mɪs/','/ˈmɔːrnɪŋ/','/ɡʊd/','/nuː/','/naɪs/','/miːt/','/tuː/','/meɪk/','/ˈvɑːlvoʊ/','/pɜːˈʒoʊ/','/mɚˈseɪdiːz/','/tɔɪˈjoʊt̬ə/','/fɔːrd/','/ˈmɪni/'];
  for(let i=0;i<24;i+=6){
    const cards=room.locator('.unit-word');await expect(cards.locator('.word-phonetic')).toHaveText(phonetics.slice(i,i+6));
    for(const card of await cards.all()){
      await card.click();await expect(card.locator('.word-meaning')).toBeVisible();expect(await card.evaluate(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)).toBe(true);
      await card.click();await expect(card).toHaveAttribute('aria-expanded','false');await expect(card.locator('.word-phonetic')).toBeVisible();
    }
    if(i<18)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
  }
  await page.reload();await expect(room.getByRole('button',{name:'Peugeot',exact:true})).toContainText('/pɜːˈʒoʊ/');
});

for(const width of [320,1280])test(`${width} 提示位于检查左侧，错答不加绿，末题与结束按钮稳定`,async({page})=>{
  await page.setViewportSize({width,height:740});await page.goto('/unit5-6/#learn/introduce');await page.evaluate(()=>document.fonts.ready);
  const room=page.locator('.stage-introduce'),actions=room.getByRole('group',{name:'作答操作',exact:true}),check=room.getByRole('button',{name:'检查答案',exact:true}),hint=room.getByRole('button',{name:'给点线索',exact:true});
  const y=()=>actions.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await y(),h=await hint.boundingBox(),c=await check.boundingBox();expect(h.x+h.width).toBeLessThan(c.x);
  await hint.click();expect(await y()).toBeCloseTo(before,0);await room.getByRole('button',{name:'He',exact:true}).click();await check.click();
  expect(await y()).toBeCloseTo(before,0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  const answers=require('../support/unit5-6-flow').ANSWERS.introduce;
  for(const [i,answer] of answers.entries()){
    await require('../support/units1-30-tasks').select(room,answer);await check.click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
    await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
  }
  await expect(page.locator('#starCount')).toHaveText('0');
  const finish=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(finish.getByRole('button')).toHaveCount(2);
  for(const b of await finish.getByRole('button').all()){const box=await b.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width);expect(box.height).toBeGreaterThanOrEqual(44);}
  await room.screenshot({path:`output/playwright/unit5-6/finish-${width}.png`});
});

test('拼句可撤回与重试，刷新保留草稿，下一题无旧答案；键盘也能作答',async({page})=>{
  await page.goto('/unit5-6/#learn/cars');const room=page.locator('.stage-cars');await room.getByRole('button',{name:"It's a Volvo.",exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();const bank=room.getByRole('group',{name:'待选词块',exact:true}),selected=room.getByRole('group',{name:'已选词块',exact:true});
  const order=await bank.getByRole('button').allTextContents();await bank.getByRole('button',{name:'or',exact:true}).click();await selected.getByRole('button',{name:'撤回 or',exact:true}).click();
  for(const token of ['she','Is','a Japanese student','or','a German student?'])await bank.getByRole('button',{name:token,exact:true}).click();
  await page.reload();expect(await bank.getByRole('button').allTextContents()).toEqual(order);await expect(selected.getByRole('button')).toHaveCount(5);
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');await room.getByRole('button',{name:'再试一次',exact:true}).click();
  for(const token of ['Is','she','a Japanese student','or','a German student?'])await bank.getByRole('button',{name:token,exact:true}).press('Enter');
  await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');await expect(room.getByRole('status')).toContainText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();
  await expect(selected.getByRole('button')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
