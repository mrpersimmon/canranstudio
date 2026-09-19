'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

const chapters = ['开门准备','肉店小剧场','招呼有妙招','店员训练场','小店我当家'];
const activities = ['肉店小图鉴','听音寻宝','老板与客人','故事小侦探','问话小帮手','交接小帮手','店员小锦囊','心声接力','分拣小能手','动词换装间','句子检查站','词块拼装台','老板的挑战','我的学徒证书'];

test('五关十四个舞台连续展开，顶部导航只定位且标记当前关卡', async ({page}) => {
  await page.goto('/lesson49/');
  await page.evaluate(() => document.fonts.ready);
  const nav = page.getByRole('navigation', {name:'学习关卡'});
  for (const name of chapters) await expect(nav.getByRole('link',{name,exact:true})).toBeVisible();
  let previousBottom = 0;
  for (const name of activities) {
    const stage = page.getByRole('region',{name,exact:true});
    await expect(stage).toBeVisible();
    const box = await stage.boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(previousBottom);
    previousBottom = box.y + box.height;
  }
  await nav.getByRole('link',{name:'招呼有妙招',exact:true}).click();
  await expect(page.getByRole('heading',{name:'招呼有妙招',exact:true})).toBeInViewport();
  await expect(nav.getByRole('link',{name:'招呼有妙招',exact:true})).toHaveAttribute('aria-current','location');
  await expect(page.getByRole('region',{name:'肉店小图鉴',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:/返回本关|全部关卡/})).toHaveCount(0);
  await expect(page.getByRole('tab')).toHaveCount(0);
});

test('词卡按6／6／5分组，末组可明确前往听音寻宝，刷新保留位置', async ({page}) => {
  await page.goto('/lesson49/#learn/words');
  await expect(page.locator('#cardGrid .fcard:visible')).toHaveCount(6);
  const cards = await page.locator('#cardGrid .fcard:visible').all();
  const boxes = await Promise.all(cards.map(card => card.boundingBox()));
  expect(boxes[0].y).toBe(boxes[2].y);
  expect(boxes[3].y).toBeGreaterThan(boxes[0].y);
  await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  await expect(page.locator('#cardGrid .fcard:visible')).toHaveCount(6);
  await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  await expect(page.locator('#cardGrid .fcard:visible')).toHaveCount(5);
  await page.reload();
  await expect(page.locator('#wordPageProgress')).toHaveText('3 / 3');
  await page.getByRole('button',{name:'下一站：听音寻宝',exact:true}).click();
  await expect(page.getByRole('heading',{name:'听音寻宝',exact:true})).toBeFocused();
  await expect(page.getByRole('heading',{name:'听音寻宝',exact:true})).toBeInViewport();
  await expect(page.locator('#listenPractice')).toContainText('第 1 / 14 题');
  await expect(page.locator('#cardGrid .fcard:visible')).toHaveCount(5);
});

for (const viewport of [{width:1280,height:900},{width:768,height:1024},{width:390,height:844}]) {
  test(viewport.width + '宽度下检查、重试、下一题不移动整页，选项位置稳定', async ({page}) => {
    await page.setViewportSize(viewport);
    await page.goto('/lesson49/#learn/doare');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading',{name:'问话小帮手',exact:true})).toBeInViewport();
    const room = page.locator('#doarePractice');
    await room.getByRole('button',{name:'Are you like meat?',exact:true}).click();
    const check = room.getByRole('button',{name:'检查答案',exact:true});
    await check.scrollIntoViewIfNeeded();
    const initial = await page.evaluate(() => scrollY);
    const options = room.locator('.practice-options');
    const before = await options.boundingBox();
    await check.click();
    expect(await page.evaluate(() => scrollY)).toBe(initial);
    expect((await options.boundingBox()).y).toBe(before.y);
    await room.getByRole('button',{name:'再试一次',exact:true}).click();
    expect(await page.evaluate(() => scrollY)).toBe(initial);
    await room.getByRole('button',{name:'Do you like meat?',exact:true}).click();
    await check.scrollIntoViewIfNeeded();
    const selected = await page.evaluate(() => scrollY);
    const selectedOptions = await options.boundingBox();
    await check.click();
    expect((await options.boundingBox()).y).toBe(selectedOptions.y);
    expect(await page.evaluate(() => scrollY)).toBe(selected);
    await room.getByRole('button',{name:'下一题',exact:true}).click();
    await expect(room).toContainText('想知道新朋友是不是老师');
    expect(await page.evaluate(() => scrollY)).toBe(selected);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('刷新书签仍定位原活动；手机紧凑导航能定位五关', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/lesson49/#learn/give');
  await expect(page.getByRole('heading',{name:'交接小帮手',exact:true})).toBeInViewport();
  await page.reload();
  await expect(page.getByRole('heading',{name:'交接小帮手',exact:true})).toBeInViewport();
  const menu = page.getByRole('combobox',{name:'选择关卡'});
  await expect(menu).toBeVisible();
  await menu.selectOption({label:'店员训练场'});
  await expect(page.getByRole('heading',{name:'店员训练场',exact:true})).toBeInViewport();
  await expect(menu).toHaveValue('l4');
});

test('五个锦囊按需展开，浏览不算作答；怎么玩和学徒手记可关闭', async ({page}) => {
  await page.goto('/lesson49/#learn/pouch');
  const stage = page.getByRole('region',{name:'店员小锦囊',exact:true});
  await expect(stage.locator('.expression-card')).toHaveCount(5);
  await stage.locator('.expression-card summary').filter({hasText:'To tell you the truth'}).click();
  await expect(stage.locator('.expression-card[open]')).toContainText('坦白自己的真实想法');
  await stage.getByRole('button',{name:'怎么玩',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('打开锦囊只算浏览');
  await page.getByRole('dialog').getByRole('button',{name:'关闭',exact:true}).click();
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'学徒手记'})).toContainText('还没有新的作答记录');
  await page.getByRole('dialog',{name:'学徒手记'}).getByRole('button',{name:'关闭',exact:true}).click();
  await expect(stage).toBeVisible();
});

test('直接操作另一个舞台会中止旧朗读，键盘点词也更新继续上次的位置', async ({page}) => {
  await page.addInitScript(() => {
    window.stageAudio = [];
    window.Audio = class extends EventTarget {
      constructor(src){super();this.src=src;this.currentTime=0;this.paused=true;window.stageAudio.push(this);}
      play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}
    };
  });
  await page.goto('/lesson49/#learn/text');
  await page.getByRole('button',{name:'开始听课文',exact:true}).click();
  const word = page.locator('#cardGrid').getByRole('button',{name:'butcher',exact:true});
  await word.focus(); await page.keyboard.press('Enter');
  expect(await page.evaluate(() => window.stageAudio.filter(audio=>!audio.paused).map(audio=>audio.src))).toEqual(['/lesson49/audio/butcher.mp3']);
  await page.goto('/lesson49/#cover');
  await page.getByRole('button',{name:'继续上次',exact:true}).click();
  await expect(page.getByRole('heading',{name:'肉店小图鉴',exact:true})).toBeFocused();
  await expect(word).toHaveAttribute('aria-expanded','true');
});

test('完成后下一站出现在当前舞台，重练时恢复未作答状态', async ({page}) => {
  await page.addInitScript(() => {
    localStorage.setItem('l49-stars-v1',JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3}));
    if(!localStorage.getItem('canran:l49:learning:v1'))localStorage.setItem('canran:l49:learning:v1',JSON.stringify({version:1,groups:{},records:{},activity:{fullDialogue:true}}));
  });
  await page.goto('/lesson49/#learn/roles');
  const stage = page.getByRole('region',{name:'故事小侦探',exact:true});
  for (const answer of ['steak','Beef, please.',"To tell you the truth, Mrs. Bird, I don't like chicken either.",'Lamb, please.','I like steak, too.']) {
    await stage.getByRole('button',{name:answer,exact:true}).click();
    await stage.getByRole('button',{name:'检查答案',exact:true}).click();
    await stage.getByRole('button',{name:/^(下一题|完成这一站)$/}).click();
  }
  await stage.getByRole('button',{name:'下一站：问话小帮手',exact:true}).click();
  await expect(page.getByRole('heading',{name:'问话小帮手',exact:true})).toBeFocused();
  await stage.getByRole('button',{name:'再练一轮',exact:true}).click();
  await expect(stage.getByRole('button',{name:'下一站：问话小帮手',exact:true})).toBeHidden();
  await expect(stage.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});

test('旧版四张分组的草稿迁移到同一个词，新组可往返且再次刷新不重复迁移', async ({page}) => {
  await page.addInitScript(() => {
    if(!localStorage.getItem('canran:l49:learning:v1'))localStorage.setItem('canran:l49:learning:v1',JSON.stringify({version:1,groups:{},records:{},activity:{wordPage:3,workspaceRoute:'learn/words'}}));
  });
  await page.goto('/lesson49/');
  await page.getByRole('button',{name:'继续上次',exact:true}).click();
  await expect(page.locator('#wordPageProgress')).toHaveText('3 / 3');
  await expect(page.getByRole('button',{name:'truth',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'上一组词卡',exact:true}).click();
  await page.reload();
  await expect(page.locator('#wordPageProgress')).toHaveText('2 / 3');
});

test('桌面与手机舞台截图，所有词卡翻面文字都在卡内', async ({page}) => {
  test.setTimeout(60000);
  await page.addInitScript(() => {
    window.Audio=class extends EventTarget {constructor(src){super();this.src=src;this.currentTime=0;}play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};
  });
  await page.setViewportSize({width:1280,height:920});
  await page.goto('/lesson49/'); await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'output/playwright/l49-v13-cover-desktop.png'});
  for(const id of ['words','text','doare','either','subjects','trans']) {
    await page.goto('/lesson49/#learn/'+id);
    if(id==='text'){await page.locator('#nextBtn').click();await expect(page.locator('#nextBtn')).toBeEnabled();}
    await page.screenshot({path:'output/playwright/l49-v13-'+id+'-desktop.png'});
  }
  await page.setViewportSize({width:320,height:700});
  await page.goto('/lesson49/#learn/words');
  for(let group=0;group<3;group++){
    for(const card of await page.locator('#cardGrid .fcard:visible').all()){
      await card.getByRole('button').click();
      const bounds=await card.locator('.fback').boundingBox();
      for(const copy of await card.locator('.fback .fcn,.fback .word-context').all()){
        const box=await copy.boundingBox();
        expect(box.y+box.height).toBeLessThanOrEqual(bounds.y+bounds.height);
      }
    }
    if(group<2)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('/lesson49/#learn/doare');
  await page.screenshot({path:'output/playwright/l49-v13-doare-mobile.png'});
  await page.goto('/lesson49/#learn/text');
  await page.screenshot({path:'output/playwright/l49-v13-text-mobile.png'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
