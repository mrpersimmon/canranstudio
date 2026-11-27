'use strict';
const {expect}=require('@playwright/test');

// Use the browser's address bar for navigation assertions and the document
// the learner can interact with for course, map and performance assertions.
async function studentDocument(page,url,timeout=30000){
 await expect(page).toHaveURL(url,{timeout});
 await page.waitForFunction(()=>{
  const frame=document.querySelector('iframe[data-student-view="active"]');
  if(!frame)return !document.querySelector('iframe[data-student-view="preparing"]');
  const address=new URL(frame.contentWindow.location.href);
  address.searchParams.delete('student-view');return address.href===location.href;
 },null,{timeout});
 const handle=await page.locator('iframe[data-student-view="active"]').elementHandles();
 try{return handle.length?await handle[0].contentFrame():page.mainFrame();}
 finally{await Promise.all(handle.map(el=>el.dispose()));}
}
async function returnToHome(page,screen=page,name='我的课程'){
 const link=screen.getByRole('link',{name,exact:true});
 const url=new URL(await link.getAttribute('href'),page.url());
 await link.click();
 return studentDocument(page,url.href);
}
async function expectCachedWordReturn(page,progress,ready){
 const url=new URL(page.url());
 const home=await returnToHome(page);
 const entry=home.locator('.journey-start');
 await expect(entry).toHaveAttribute('href',new RegExp(url.pathname));
 const downloads=[],track=request=>{if(request.url().includes('/resources/'))downloads.push(request.url());};
 page.on('request',track);
 try{
  await entry.click();
  const course=await studentDocument(page,address=>address.pathname===url.pathname);
  await ready(course);await expect(course.locator('#wordPageProgress')).toHaveText(progress);
  expect(downloads).toEqual([]);
  expect(await course.locator('img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
 }finally{page.off('request',track);}
}
module.exports={studentDocument,returnToHome,expectCachedWordReturn};
