# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit11-12-upgrade.spec.js >> 11–12 short-exam 旧服务器先升27题再升五星，原三题和证书日期保留
- Location: tests\login\unit11-12-upgrade.spec.js:30:49

# Error details

```
Error: page.goto: net::ERR_NO_BUFFER_SPACE at http://127.0.0.1:4199/
Call log:
  - navigating to "http://127.0.0.1:4199/", waiting until "load"

```

# Test source

```ts
  1  | 'use strict';
  2  | const { expect } = require('@playwright/test');
  3  | async function adminLogin(page, base = '/lesson/') {
  4  |   await page.goto(base + 'admin/');
  5  |   await page.getByLabel('管理员账号').fill('teacher');
  6  |   await page.getByLabel('管理员密码').fill('Test-only-classroom-2026!');
  7  |   await page.getByRole('button', { name: '登录管理页' }).click();
  8  |   await expect(page.getByRole('heading', { name: '我的班级' })).toBeVisible();
  9  | }
  10 | async function addStudent(page, name) {
  11 |   await page.getByLabel('学生姓名或课堂称呼，每行一位').fill(name);
  12 |   await page.getByRole('button', { name: '核对姓名拼音' }).click();
  13 |   await page.getByRole('button', { name: '确认添加学生' }).click();
  14 |   await expect(page.getByRole('status')).toContainText('学生已添加');
  15 |   const number = await page.locator('.student-row').last().locator('.student-number').textContent();
  16 |   const initialPassword = await readInitialPassword(page, page.locator('.student-row').last());
  17 |   return { number, initialPassword, password: initialPassword, fresh: true };
  18 | }
  19 | async function readInitialPassword(page, row = page.locator('.student-row').first()) {
  20 |   await row.getByRole('button', { name: '查看账号' }).click();
  21 |   await expect(page.locator('.initial-password')).toBeVisible();
  22 |   await expect(page.locator('.initial-expiry')).toContainText('有效至');
  23 |   const password = await page.locator('.initial-password').textContent();
  24 |   await page.getByRole('button', { name: '返回班级', exact: true }).click();
  25 |   return password;
  26 | }
  27 | async function saveCourses(page) {
  28 |   await page.getByRole('button', { name: '保存开放课程', exact: true }).click();
  29 |   const dialog = page.getByRole('dialog', { name: '保存成功', exact: true });
  30 |   await expect(dialog).toContainText('开放课程已保存');
  31 |   await dialog.getByRole('button', { name: '知道了', exact: true }).click();
  32 |   await expect(dialog).toHaveCount(0);
  33 | }
  34 | async function createStudent(page, className, name, lessons) {
  35 |   await page.getByLabel('新班级名称').fill(className);
  36 |   await page.getByRole('button', { name: '创建班级', exact: true }).click();
  37 |   await expect(page.getByRole('heading', { name: className + ' · 班级设置', exact: true })).toBeVisible();
  38 |   for (const label of lessons) await page.getByRole('checkbox', { name: label }).check();
  39 |   await saveCourses(page);
  40 |   await expect(page.getByRole('status')).toContainText('开放课程已保存');
  41 |   return addStudent(page, name);
  42 | }
  43 | async function fillLogin(page, account, password = account.password) {
  44 |   await page.getByLabel('学号', { exact: true }).fill(account.number);
  45 |   await page.getByLabel('密码', { exact: true }).fill(password);
  46 |   await page.getByRole('button', { name: '进入我的课程' }).click();
  47 | }
  48 | async function setPassword(page, password = 'Learning-journey-2026!') {
  49 |   await expect(page.getByRole('heading', { name: '设置你的新密码' })).toBeVisible();
  50 |   await page.getByLabel('新密码', { exact: true }).fill(password);
  51 |   await page.getByLabel('再输一次新密码').fill(password);
  52 |   await page.getByRole('button', { name: '保存新密码，开始学习' }).click();
  53 | }
  54 | async function signIn(page, account, base = '/lesson/') {
> 55 |   await page.goto(base); await fillLogin(page, account);
     |              ^ Error: page.goto: net::ERR_NO_BUFFER_SPACE at http://127.0.0.1:4199/
  56 |   if (account.fresh) {
  57 |     await setPassword(page); account.password = 'Learning-journey-2026!'; account.fresh = false;
  58 |   }
  59 |   await expect(page.locator('.course').first()).toBeVisible();
  60 | }
  61 | async function studentLogin(browser, account, base = '/lesson/', contextOptions = {}) {
  62 |   const context = await browser.newContext(contextOptions); const page = await context.newPage();
  63 |   await signIn(page, account, base); return { context, page };
  64 | }
  65 | module.exports = { saveCourses, adminLogin, addStudent, createStudent, fillLogin, setPassword, signIn, studentLogin, readInitialPassword };
  66 | 
```