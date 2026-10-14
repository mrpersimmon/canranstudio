'use strict';
const {test,expect}=require('@playwright/test');

test('纪念卡医生白大褂的左肩与上臂保持完整棕色外轮廓',async({page},info)=>{
  await page.goto('/unit61-62/#learn/certificate');
  const card=page.locator('.stage-certificate .story-award-paper');
  const picture=card.locator('.story-award-illustration');
  await picture.evaluate(img=>img.decode());
  // Inspect the illustration actually rendered by the page, not a parallel asset.
  // The original image's opaque white sleeve reached its left canvas boundary;
  // later transparent padding hid the clipping from generic edge-alpha checks.
  const contour=await picture.evaluate(img=>{
    const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
    const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
    const {data}=ctx.getImageData(0,0,canvas.width,canvas.height);
    let visibleRows=0,outlinedRows=0;
    // Doctor's upper arm, left of the child and quilt in this approved composition.
    for(let y=Math.round(canvas.height*.51);y<canvas.height*.63;y+=3){
      let edge=-1;
      for(let x=0;x<canvas.width*.3;x++)if(data[(y*canvas.width+x)*4+3]>220){edge=x;break;}
      if(edge<0)continue;visibleRows++;
      for(let x=edge;x<Math.min(edge+12,canvas.width*.3);x++){
        const i=(y*canvas.width+x)*4;
        if(data[i+3]>220&&data[i]<145&&data[i+1]<125&&data[i+2]<115){outlinedRows++;break;}
      }
    }
    return {visibleRows,outlinedRows};
  });
  for(const width of [320,1280]){
    await page.setViewportSize({width,height:900});
    await card.scrollIntoViewIfNeeded();
    const box=await card.boundingBox(),art=await picture.boundingBox();
    expect(art.x).toBeGreaterThanOrEqual(box.x);
    expect(art.x+art.width).toBeLessThanOrEqual(box.x+box.width);
    await card.screenshot({path:info.outputPath(`doctor-coat-${width}.png`)});
  }
  expect(contour.visibleRows).toBeGreaterThan(20);
  expect(contour.outlinedRows/contour.visibleRows,'白大褂左侧不能是无描边的垂直截面').toBeGreaterThan(.85);
});
