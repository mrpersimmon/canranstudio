'use strict';
const { expect } = require('@playwright/test');
async function adminLogin(page, base = '/lesson/') {
  await page.goto(base + 'admin/');
  await page.getByLabel('管理员账号').fill('teacher');
  await page.getByLabel('管理员密码').fill('Test-only-classroom-2026!');
  await page.getByRole('button', { name: '登录管理页' }).click();
  await expect(page.getByRole('heading', { name: '我的班级' })).toBeVisible();
}
async function addStudent(page, name) {
  await page.getByLabel('学生姓名或课堂称呼，每行一位').fill(name);
  await page.getByRole('button', { name: '核对姓名拼音' }).click();
  await page.getByRole('button', { name: '确认添加学生' }).click();
  await expect(page.getByRole('status')).toContainText('学生已添加');
  const number = await page.locator('.student-row').last().locator('.student-number').textContent();
  const initialPassword = await readInitialPassword(page, page.locator('.student-row').last());
  return { number, initialPassword, password: initialPassword, fresh: true };
}
async function readInitialPassword(page, row = page.locator('.student-row').first()) {
  await row.getByRole('button', { name: '查看账号' }).click();
  await expect(page.locator('.initial-password')).toBeVisible();
  await expect(page.locator('.initial-expiry')).toContainText('有效至');
  const password = await page.locator('.initial-password').textContent();
  await page.getByRole('button', { name: '返回班级', exact: true }).click();
  return password;
}
async function saveCourses(page) {
  await page.getByRole('button', { name: '保存开放课程', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '保存成功', exact: true });
  await expect(dialog).toContainText('开放课程已保存');
  await dialog.getByRole('button', { name: '知道了', exact: true }).click();
  await expect(dialog).toHaveCount(0);
}
async function createStudent(page, className, name, lessons) {
  await page.getByLabel('新班级名称').fill(className);
  await page.getByRole('button', { name: '创建班级', exact: true }).click();
  await expect(page.getByRole('heading', { name: className + ' · 班级设置', exact: true })).toBeVisible();
  for (const label of lessons) await page.getByRole('checkbox', { name: label }).check();
  await saveCourses(page);
  await expect(page.getByRole('status')).toContainText('开放课程已保存');
  return addStudent(page, name);
}
async function fillLogin(page, account, password = account.password) {
  await page.getByLabel('学号', { exact: true }).fill(account.number);
  await page.getByLabel('密码', { exact: true }).fill(password);
  await page.getByRole('button', { name: '进入我的课程' }).click();
}
async function setPassword(page, password = 'Learning-journey-2026!') {
  await expect(page.getByRole('heading', { name: '设置你的新密码' })).toBeVisible();
  await page.getByLabel('新密码', { exact: true }).fill(password);
  await page.getByLabel('再输一次新密码').fill(password);
  await page.getByRole('button', { name: '保存新密码，开始学习' }).click();
}
async function signIn(page, account, base = '/lesson/') {
  await page.goto(base); await fillLogin(page, account);
  if (account.fresh) {
    await setPassword(page); account.password = 'Learning-journey-2026!'; account.fresh = false;
  }
  await openCourseDirectory(page);
}
async function openCourseDirectory(page) {
  // Course choice is ready before decorative font/art preparation finishes.
  // Wait for the actual usable surface, never reinstate a global font gate.
  await expect(page.locator('.journey-home, #openCourseBook:visible:enabled, .course:visible').first()).toBeVisible();
  if(await page.locator('.journey-home').count()){
    if(!await page.locator('.course:visible').count())await page.locator('.journey-all').click();
    await expect(page.locator('.course:visible').first()).toBeVisible();
    return;
  }
  // Restoring a bookmark disables the cover until the saved page is ready,
  // then hides it. Do not queue a click on that disappearing disabled cover.
  const cover=page.locator('#openCourseBook:visible:enabled');
  await expect(page.locator('#openCourseBook:visible:enabled, .course:visible').first()).toBeVisible();
  if(await cover.isVisible())await cover.click();
  await expect(page.locator('.course:visible').first()).toBeVisible();
}
async function studentLogin(browser, account, base = '/lesson/', contextOptions = {}) {
  const context = await browser.newContext(contextOptions); const page = await context.newPage();
  await signIn(page, account, base); return { context, page };
}
async function waitForCourseReady(page) {
  // Match the protected-course readiness boundary already used by later
  // units. Initial zero-star markup is not an interactive, restored course.
  await expect(page.locator('html:not([data-course-preparing]) #wordPageProgress')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#courseLoader')).toHaveCount(0);
}
async function openMyAccount(page){
  const mobile=page.locator('.journey-bottom-nav button');
  if(await mobile.isVisible())await mobile.click();
  else await page.locator('.student-account > summary').click();
}
module.exports = { saveCourses, adminLogin, addStudent, createStudent, fillLogin, setPassword, signIn, studentLogin, waitForCourseReady, openCourseDirectory, openMyAccount, readInitialPassword };
