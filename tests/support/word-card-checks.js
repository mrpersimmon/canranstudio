'use strict';
const {expect}=require('@playwright/test');
const {courseButton,courseWord}=require('./course-controls');

// Check the independently authored word on its reviewed page, then return to
// the first group so the caller can exercise every subsequent page in order.
async function checkWordAndReturn(room,word,phonetic,meaning){
  const previous=courseButton(room,'previousWords');
  await expect(previous).toBeDisabled();
  const card=await courseWord(room,word);
  await expect(card.locator('.word-phonetic')).toHaveText(phonetic);
  await expect(card.locator('.word-meaning')).toBeHidden();
  await card.press('Enter');
  await expect(card).toHaveAttribute('aria-expanded','true');
  await expect(card.locator('.word-meaning')).toBeVisible();
  await expect(card.locator('.word-meaning')).toHaveText(meaning);
  await card.press('Enter');
  while(await previous.isEnabled())await previous.click();
  await expect(previous).toBeDisabled();
}

module.exports={checkWordAndReturn};
