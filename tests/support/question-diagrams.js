'use strict';
const {expect}=require('@playwright/test');
const {withQuestionMaterial}=require('./course-controls');

async function expectReadableImage(image,minimumWidth){
  await expect(image).toBeVisible();
  const size=await image.evaluate(async el=>{
    await el.decode();
    const box=el.getBoundingClientRect();
    return {width:box.width,height:box.height,aspect:el.naturalWidth/el.naturalHeight};
  });
  expect(size.width).toBeGreaterThanOrEqual(minimumWidth);
  expect(size.width/size.height).toBeCloseTo(size.aspect,1);
}

async function inspectQuestionDiagrams(room,minimumWidth,screenshot){
  const choices=room.locator('.picture-option[aria-description]');
  if(await choices.count()){
    const expected=await choices.evaluateAll(buttons=>buttons.map(button=>({
      label:button.getAttribute('aria-label'),src:button.querySelector('img').getAttribute('src'),
      alt:button.querySelector('img').alt
    })));
    const trigger=room.getByRole('button',{name:'查看题目材料',exact:true});
    await trigger.click();
    const sheet=room.page().getByRole('dialog',{name:'题目材料',exact:true}),figures=sheet.locator('figure');
    await expect(figures.locator('figcaption')).toHaveText(expected.map(item=>item.label));
    for(const [i,item] of expected.entries()){
      const image=figures.nth(i).locator('img');
      await expect(image).toHaveAttribute('src',item.src);
      await expect(image).toHaveAttribute('alt',item.alt);
      await expectReadableImage(image,minimumWidth);
    }
    await sheet.screenshot({path:screenshot});
    await sheet.getByRole('button',{name:'关闭学习参考'}).click();
    await expect(trigger).toBeFocused();
    await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  }else if(await room.locator('img.practice-scene').count()){
    await withQuestionMaterial(room,async(surface,image)=>{
      await expectReadableImage(image,minimumWidth);
      await surface.screenshot({path:screenshot});
    });
  }
}
module.exports={inspectQuestionDiagrams};
