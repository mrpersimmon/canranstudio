'use strict';
const {expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
// These seven illustrations are the adopted course artwork, independently
// selected from the visual review. Other courses may use another composition.
const PAIRS=['17-18','19-20','21-22','23-24','25-26','27-28','29-30'];
const ART=Object.fromEntries(PAIRS.map(pair=>[pair,`assets/unit${pair}/keepsake-story-v1.webp`]));
const SHA=Object.fromEntries(PAIRS.map(pair=>[pair,crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../..',ART[pair]))).digest('hex')]));
async function imageHash(locator){return locator.evaluate(async im=>{await im.decode();const bytes=await(await fetch(im.currentSrc)).arrayBuffer();return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');});}
async function banners(page,base,info){
 for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:900});
  for(const pair of PAIRS){
   const card=page.locator(`[data-unit="unit${pair}"]`),picture=card.locator('.featured-art img');
   await card.scrollIntoViewIfNeeded();await expect(picture).toHaveCount(1);await expect(picture).toHaveAttribute('src',base+ART[pair]);await expect(picture).toBeVisible();
   await expect.poll(()=>picture.evaluate(im=>im.complete&&im.naturalWidth>0)).toBe(true);
   const bounds=await picture.evaluate(im=>{const a=im.getBoundingClientRect(),b=im.closest('.featured-art').getBoundingClientRect(),c=im.closest('.featured-course').querySelector('.featured-copy').getBoundingClientRect();return{image:{x:a.x,y:a.y,w:a.width,h:a.height},art:{x:b.x,y:b.y,w:b.width,h:b.height},copy:{x:c.x,y:c.y,w:c.width,h:c.height},fit:getComputedStyle(im).objectFit};});
   expect(bounds.fit).toBe('contain');expect(bounds.image.w).toBeGreaterThan(150);expect(bounds.image.h).toBeGreaterThan(100);
   expect(bounds.image.x).toBeGreaterThanOrEqual(bounds.art.x-1);expect(bounds.image.x+bounds.image.w).toBeLessThanOrEqual(bounds.art.x+bounds.art.w+1);expect(bounds.image.y).toBeGreaterThanOrEqual(bounds.art.y-1);expect(bounds.image.y+bounds.image.h).toBeLessThanOrEqual(bounds.art.y+bounds.art.h+1);
   const a=bounds.image,c=bounds.copy;expect(a.x+a.w<=c.x+1||c.x+c.w<=a.x+1||a.y+a.h<=c.y+1||c.y+c.h<=a.y+1).toBe(true);
   await expect(card.locator('.primary-button')).toHaveAttribute('href',base+'unit'+pair+'/#learn/words');
   if([320,1280].includes(width))await card.screenshot({path:info.outputPath(`banner-${pair}-${width}.png`)});
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 for(const pair of PAIRS)expect(await imageHash(page.locator(`[data-unit="unit${pair}"] .featured-art img`))).toBe(SHA[pair]);
}
module.exports={PAIRS,ART,SHA,banners,imageHash};
