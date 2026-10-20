'use strict';
const fs=require('fs/promises');
const {expect}=require('@playwright/test');
async function installPrevious(page,folder='unit1-2-before-v154'){
 const files=await fs.readdir('tests/fixtures/'+folder),routes=[];
 for(const name of files.filter(n=>/\.(js|css|html)$/.test(n))){
  const pattern=name==='index.html'?'**/unit1-2/':`**/unit1-2/${name}*`;
  const body=await fs.readFile('tests/fixtures/'+folder+'/'+name);await page.route(pattern,r=>r.fulfill({body,contentType:name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript'}));routes.push(pattern);
 }
 return async()=>{for(const pattern of routes)await page.unroute(pattern);};
}
async function book(page){return page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit1-2:learning:v1')));}
async function noOverflow(page,width){expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);}
async function currentArt(page){await expect.poll(()=>page.locator('img[src*="man-v154"],img[src*="woman-v154"]').evaluateAll(imgs=>imgs.length>=2&&imgs.every(im=>im.complete&&im.naturalWidth>0))).toBe(true);}
module.exports={installPrevious,book,noOverflow,currentArt};
