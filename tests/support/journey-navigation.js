'use strict';
const {expect}=require('@playwright/test');
const {MAP_CHAPTERS}=require('../../course-journey/model');
const {studentDocument}=require('./student-document');
const {openCourseDirectory}=require('../login/helpers');
// Use the same directory/search/location route available to learners. There
// is no hidden chapter picker or synthetic application-state shortcut.
async function chooseJourneyChapter(page,id){
 const chapter=MAP_CHAPTERS.find(item=>item.id===id);expect(chapter,'Known chapter').toBeTruthy();
 await openCourseDirectory(page);
 const search=page.getByRole('searchbox',{name:'查找 Lesson',exact:true});
 await search.fill('');
 const current=await page.locator('.journey-dock').getAttribute('data-selected-course');
 const candidates=chapter.courses.includes(current)?[current,...chapter.courses.filter(c=>c!==current)]:chapter.courses;
 for(const course of candidates){
  const row=page.locator('.journey-course[data-unit="'+course+'"]');if(!await row.count())continue;
  await search.fill(course.match(/\d+/)[0]);
  await row.locator('[data-course-select]').click();
  await expect(page.locator('.journey-map')).toHaveAttribute('data-chapter',id);return;
 }
 throw Error('No authorized course available in chapter '+id);
}
async function enterCourseAndReturn(page,home,courseId){
 const homeUrl=page.url();
 await home.locator('.journey-start').click();
 const course=await studentDocument(page,new RegExp('/'+courseId+'/#learn/words$'));
 await expect(course.locator('#courseLoader')).toHaveCount(0);
 await expect(course.locator('.learning-surface .unit-word').first()).toBeVisible();
 await course.getByRole('link',{name:'我的课程',exact:true}).click();
 const returned=await studentDocument(page,homeUrl);
 await expect(returned.locator('.journey-dock')).toHaveAttribute('data-selected-course',courseId);
 return returned;
}
module.exports={chooseJourneyChapter,enterCourseAndReturn};
