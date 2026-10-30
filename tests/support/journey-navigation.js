'use strict';
const {expect}=require('@playwright/test');
const {MAP_CHAPTERS}=require('../../course-journey/model');
// Use the same directory/search/location route available to learners. There
// is no hidden chapter picker or synthetic application-state shortcut.
async function chooseJourneyChapter(page,id){
 const chapter=MAP_CHAPTERS.find(item=>item.id===id);expect(chapter,'Known chapter').toBeTruthy();
 if(await page.locator('.journey-all').getAttribute('aria-expanded')!=='true')await page.locator('.journey-all').click();
 const current=await page.locator('.journey-dock').getAttribute('data-selected-course');
 const candidates=chapter.courses.includes(current)?[current,...chapter.courses.filter(c=>c!==current)]:chapter.courses;
 for(const course of candidates){
  const row=page.locator('.journey-course[data-unit="'+course+'"]');if(!await row.count())continue;
  await page.getByRole('searchbox',{name:'查找 Lesson',exact:true}).fill(course.match(/\d+/)[0]);
  await row.locator('.journey-locate').click();
  await expect(page.locator('.journey-map')).toHaveAttribute('data-chapter',id);return;
 }
 throw Error('No authorized course available in chapter '+id);
}
module.exports={chooseJourneyChapter};
