'use strict';
const {test,expect}=require('@playwright/test');

for(const base of ['/','/lesson/']) {
  test(`${base} 导航进入两个独立单元，分别继续，所有资源保留在正确路径`,async({page})=>{
    const failed=[],outside=[],errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)failed.push(response.url());});
    page.on('request',request=>{const url=new URL(request.url());if(base==='/lesson/'&&url.origin==='http://127.0.0.1:4173'&&!url.pathname.startsWith(base))outside.push(url.pathname);});
    await page.goto(base);
    const beginner=page.getByRole('region',{name:'礼貌小帮手',exact:true});
    await beginner.getByRole('link',{name:'开始学习：礼貌小帮手',exact:true}).click();
    await expect(page).toHaveURL(new RegExp(base+'unit1-2/#learn/words$'));
    await expect(page.getByRole('navigation',{name:'学习关卡',exact:true}).getByRole('link')).toHaveText(['身边的小物品','手提包的故事','开口有礼貌','问句小工坊','小帮手出发']);
    await page.getByRole('link',{name:'问句小工坊',exact:true}).click();
    await page.getByRole('link',{name:'我的课程',exact:true}).click();
    await expect(beginner).toContainText('上次学到 · 问句小工坊');
    await expect(beginner.getByRole('link',{name:'继续学习：礼貌小帮手',exact:true})).toHaveAttribute('href',base+'unit1-2/#l4');
    const older=page.getByRole('region',{name:'晚餐采购大冒险',exact:true});
    await expect(older.getByRole('link',{name:'开始学习',exact:true})).toHaveAttribute('href',base+'unit49-50/#learn/words');
    await older.getByRole('link',{name:'开始学习',exact:true}).click();
    await page.getByRole('link',{name:'表达训练场',exact:true}).click();
    await page.getByRole('link',{name:'我的课程',exact:true}).click();
    await expect(older).toContainText('上次学到 · 表达训练场');
    await expect(beginner).toContainText('上次学到 · 问句小工坊');
    await expect.poll(()=>page.locator('main img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
    expect(errors).toEqual([]);expect(failed).toEqual([]);expect(outside).toEqual([]);
  });
}

test('子目录重开清除两个单元，只影响该版本，取消不会清除任何记录',async({page})=>{
  await page.goto('/unit1-2/#learn/words');
  await page.goto('/lesson/unit1-2/#learn/ask');
  await page.goto('/lesson/unit49-50/#learn/give');
  await page.goto('/lesson/');
  const snapshot=()=>page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key.includes('learning:'))));
  const before=await snapshot();
  await page.getByRole('button',{name:'设备冒险设置',exact:true}).click();
  await page.getByRole('button',{name:'重开冒险',exact:true}).click();
  await page.getByRole('button',{name:'继续确认',exact:true}).click();
  await page.getByRole('button',{name:'取消重开',exact:true}).click();
  expect(await snapshot()).toEqual(before);
  await page.getByRole('button',{name:'重开冒险',exact:true}).click();
  await page.getByRole('button',{name:'继续确认',exact:true}).click();
  await page.getByRole('button',{name:'确认重开',exact:true}).click();
  const after=await snapshot();
  expect(after['canran:unit1-2:learning:v1']).toBe(before['canran:unit1-2:learning:v1']);
  expect(after['canran:lesson:unit1-2:learning:v1']).toBeUndefined();
  expect(after['canran:lesson:unit49-50:learning:v1']).toBeUndefined();
});

test('新学习从图鉴开始，图鉴末组前往听音；已有位置继续原活动',async({page})=>{
  await page.goto('/unit1-2/');
  await page.getByRole('button',{name:'开始冒险',exact:true}).click();
  await expect(page).toHaveURL(/\/unit1-2\/#learn\/words$/);
  const words=page.getByRole('region',{name:'物品小图鉴',exact:true});
  await expect(words.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
  for(let i=0;i<3;i++)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();
  await words.getByRole('button',{name:'下一站：听音寻宝',exact:true}).click();
  await expect(page).toHaveURL(/#learn\/listen$/);
  await page.goto('/unit1-2/#learn/ask');
  await page.goto('/unit1-2/');
  await page.getByRole('button',{name:'继续冒险',exact:true}).click();
  await expect(page).toHaveURL(/#learn\/ask$/);
});

test('章节换序仍能从原有章节链接继续，不把故事和物品记录对调',async({page})=>{
  for(const [anchor,title] of [['l1','手提包的故事'],['l2','身边的小物品']]){
    await page.goto('/unit1-2/#'+anchor);
    await expect(page.getByRole('heading',{name:title,exact:true})).toBeInViewport();
    await page.getByRole('link',{name:'我的课程',exact:true}).click();
    const beginner=page.getByRole('region',{name:'礼貌小帮手',exact:true});
    await expect(beginner).toContainText('上次学到 · '+title);
    await beginner.getByRole('link',{name:'继续学习：礼貌小帮手',exact:true}).click();
    await expect(page.getByRole('heading',{name:title,exact:true})).toBeInViewport();
  }
});
