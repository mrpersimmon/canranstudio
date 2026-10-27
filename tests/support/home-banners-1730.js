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
// The authenticated journey uses approved full-body landmarks. The static
// preview and the course cover/card keep the original scene contract above.
const LANDMARK_ART={
 '1-2':'assets/course-journey/handbag-couple.webp',
 '3-4':'assets/course-journey/umbrella-counter-v1.webp',
 '5-6':'assets/course-journey/friends-trio-v1.webp',
 '17-18':'assets/course-journey/office-introduction-v1.webp',
 '19-20':'assets/course-journey/icecream-family-v1.webp',
 '21-22':'assets/course-journey/red-book-pair-v1.webp',
 '23-24':'assets/course-journey/shelf-glasses-pair-v1.webp',
 '25-26':'assets/course-journey/kitchen-host-v1.webp',
 '27-28':'assets/course-journey/living-room-host-v1.webp',
 '29-30':'assets/course-journey/tidy-room-pair-v1.webp'
};
const LANDMARK_SHA=Object.fromEntries(Object.keys(LANDMARK_ART).map(pair=>[pair,crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../..',LANDMARK_ART[pair]))).digest('hex')]));
// The map now has its own full-body art. Compare packaged course/card pixels
// against the independently named adopted original, not against the map.
async function referenceArtworkPixels(page,src,expectedSha){
 const result=await page.evaluate(async src=>{
  const response=await fetch(src);if(!response.ok)throw Error('Reference artwork failed: '+response.status);
  const hash=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  const sha=await hash(await response.arrayBuffer()),im=new Image();im.src=src;await im.decode();
  const canvas=document.createElement('canvas');canvas.width=im.naturalWidth;canvas.height=im.naturalHeight;
  const ctx=canvas.getContext('2d');ctx.drawImage(im,0,0);
  return{sha,pixels:await hash(ctx.getImageData(0,0,canvas.width,canvas.height).data)};
 },src);
 expect(result.sha).toBe(expectedSha);return result.pixels;
}
async function landmarks(page,base,info,widths=[320,390,768,1280],pairs=PAIRS){
 const {openCourseDirectory}=require('../login/helpers'),{assertModules}=require('./journey-modules');
 // Independent visible-alpha baselines from the approved artwork review.
 // The older visits contact fixture records feet, not visible-alpha bounds.
 const acceptedBounds={
  'unit1-2':[.1013,.1188,.9147,.92504],
  'unit3-4':[.1505,.0998,.871,.95633],
  'unit5-6':[.1107,.1494,.9102,.9258],
  'unit17-18':[.093099,.078125,.923177,.959961],
  'unit19-20':[.063796,.059809,.975279,.965710],
  'unit21-22':[.098086,.097289,.952153,.952951],
  'unit23-24':[.082935,.093301,.959330,.951356],
  ...Object.fromEntries(Object.entries(require('./journey-home-hospitality-contact.json').characters).map(([id,art])=>[id,art.alpha16Bounds]))
 };
 const groups=[['1-2','3-4','5-6'],['17-18'],['19-20','21-22','23-24'],['25-26','27-28','29-30']];
 for(const width of widths){
  await page.setViewportSize({width,height:900});await expect(page.locator('.journey-desktop-search')).toHaveCount(width>=1024?1:0);
  for(const pair of pairs){
   await openCourseDirectory(page);const card=page.locator('[data-unit="unit'+pair+'"]');
   await expect(card.locator('.primary-button')).toHaveAttribute('href',base+'unit'+pair+'/#learn/words');
   const authorized=await page.locator('.course').evaluateAll(cards=>cards.map(card=>card.dataset.unit));
   await card.locator('.journey-locate').click();
   const ids=groups.find(group=>group.includes(pair)).map(value=>'unit'+value).filter(id=>authorized.includes(id)),bounds=Object.fromEntries(ids.map(id=>[id,acceptedBounds[id]]));
   const view=await assertModules(page,bounds,width),entry=page.locator('[data-module-course="unit'+pair+'"]'),picture=entry.locator('[data-story-course]');
   const url=new URL(await picture.getAttribute('src'),page.url());expect(url.origin).toBe(new URL(page.url()).origin);expect(url.pathname).toBe(base+LANDMARK_ART[pair]);
   expect(await imageHash(picture)).toBe(LANDMARK_SHA[pair]);
   for(const module of view.modules)expect((module.visible.bottom-module.visible.top)/module.board.width,'actual visible figure scale').toBeCloseTo(.36,2);
   await expect(entry.locator('[data-map-course]')).toHaveAttribute('aria-pressed','true');
   if(info&&[320,1280].includes(width))await entry.screenshot({path:info.outputPath('landmark-'+pair+'-'+width+'.png')});
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
}
module.exports={PAIRS,ART,SHA,banners,imageHash,LANDMARK_ART,LANDMARK_SHA,landmarks,referenceArtworkPixels};
