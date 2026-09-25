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
async function createStudent(page, className, name, lessons) {
  await page.getByLabel('新班级名称').fill(className);
  await page.getByRole('button', { name: '创建班级', exact: true }).click();
  await expect(page.getByRole('heading', { name: className + ' · 开放课程', exact: true })).toBeVisible();
  for (const label of lessons) await page.getByRole('checkbox', { name: label }).check();
  await page.getByRole('button', { name: '保存开放课程' }).click();
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
  await expect(page.locator('.course').first()).toBeVisible();
}
async function studentLogin(browser, account) {
  const context = await browser.newContext(); const page = await context.newPage();
  await signIn(page, account); return { context, page };
}
module.exports = { adminLogin, addStudent, createStudent, fillLogin, setPassword, signIn, studentLogin, readInitialPassword };
