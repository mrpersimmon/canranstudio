'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, saveCourses } = require('./helpers');
const ORIGIN = 'http://127.0.0.1:' + (process.env.LOGIN_TEST_PORT || 4181);

async function createClass(page, name) {
  await adminLogin(page);
  await page.getByLabel('新班级名称').fill(name);
  await page.getByRole('button', { name: '创建班级', exact: true }).click();
  await expect(page.getByRole('heading', { name: name + ' · 班级设置', exact: true })).toBeVisible();
  return (await state(page)).classes.find(c => c.name === name);
}
async function state(page) { return (await page.request.get('/lesson/api/admin/state')).json(); }
const courseBoxes = page => page.locator('#courses input[name=course]');
const selectedCourses = page => page.locator('#courses input[name=course]:checked');
const successDialog = page => page.getByRole('dialog', { name: '保存成功', exact: true });
const updateClass = (page, body) => page.request.post('/lesson/api/admin/classes', { headers: { Origin: ORIGIN }, data: body });

test('班级改名即时更新标签和学生归属，保留账号及未保存的课程选择', async ({ page }) => {
  await adminLogin(page);
  const account = await createStudent(page, '班级改名原名', '测试小同学', [/Lesson 1–2 /]);
  const before = await state(page), group = before.classes.find(c => c.name === '班级改名原名');
  await page.getByRole('checkbox', { name: /Lesson 13–14 / }).check();
  await page.getByLabel('班级名称', { exact: true }).fill('  周六进阶班  ');
  await page.getByRole('button', { name: '保存班级名称', exact: true }).click();
  await expect(successDialog(page)).toContainText('班级名称已保存：周六进阶班。');
  await successDialog(page).getByRole('button', { name: '知道了' }).click();
  await expect(page.getByRole('button', { name: '管理 周六进阶班', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '周六进阶班 · 班级设置', exact: true })).toBeVisible();
  await expect(page.locator('.student-row [data-class-name]')).toHaveText('周六进阶班');
  await expect(page.getByLabel('班级名称', { exact: true })).toHaveValue('周六进阶班');
  await expect(page.getByRole('checkbox', { name: /Lesson 13–14 / })).toBeChecked();
  const after = await state(page);
  expect(after.classes.find(c => c.id === group.id)).toEqual({ ...group, name: '周六进阶班' });
  expect(after.students).toEqual(before.students);
  const accounts = await page.request.post('/lesson/api/admin/accounts', { headers: { Origin: ORIGIN }, data: { classId: group.id } });
  expect((await accounts.json()).accounts[0].initialPassword).toBe(account.initialPassword);
  await page.reload();
  await page.getByRole('button', { name: '管理 周六进阶班', exact: true }).click();
  await expect(page.getByLabel('班级名称', { exact: true })).toHaveValue('周六进阶班');
  await expect(selectedCourses(page)).toHaveCount(1);
  await page.getByRole('button', { name: '打印全班账号', exact: true }).click();
  await expect(page.locator('.account-heading p')).toHaveText('周六进阶班');
});

test('开放课程全选、部分选择、取消全选与保存后的重新打开保持一致', async ({ page }) => {
  const group = await createClass(page, '全选课程体验班');
  await expect(courseBoxes(page)).toHaveCount(21);
  await expect(page.locator('#courseSelectionCount')).toHaveText('已选 0 / 21 门课程');
  await page.getByRole('button', { name: '全选课程', exact: true }).click();
  await expect(selectedCourses(page)).toHaveCount(21);
  await expect(page.locator('#courseSelectionCount')).toHaveText('已选 21 / 21 门课程');
  await page.getByRole('checkbox', { name: /Lesson 13–14 / }).uncheck();
  await expect(page.locator('#courseSelectionCount')).toHaveText('已选 20 / 21 门课程');
  await page.getByRole('button', { name: '全选课程', exact: true }).click();
  await saveCourses(page);
  expect((await state(page)).classes.find(c => c.id === group.id).courses).toHaveLength(21);
  await page.reload();await page.getByRole('button', { name: '管理 全选课程体验班', exact: true }).click();
  await expect(selectedCourses(page)).toHaveCount(21);
  await page.getByRole('button', { name: '取消全选', exact: true }).click();
  await expect(selectedCourses(page)).toHaveCount(0);
  await page.getByRole('button', { name: '保存开放课程', exact: true }).click();
  await expect(successDialog(page)).toContainText('已开放 0 门课程');
  await successDialog(page).getByRole('button', { name: '知道了' }).click();
  expect((await state(page)).classes.find(c => c.id === group.id).courses).toEqual([]);
});

test('保存课程保留未提交的改名草稿，并保留另一个管理页面已保存的新班名', async ({ page }) => {
  const group = await createClass(page, '独立保存原名');
  await page.getByLabel('班级名称', { exact: true }).fill('尚未保存的班名');
  expect((await updateClass(page, { id: group.id, name: '另一页面已改名' })).ok()).toBe(true);
  await page.getByRole('checkbox', { name: /Lesson 13–14 / }).check();
  await saveCourses(page);
  await expect(page.getByLabel('班级名称', { exact: true })).toHaveValue('尚未保存的班名');
  await expect(page.getByRole('button', { name: '管理 另一页面已改名', exact: true })).toBeVisible();
  expect((await state(page)).classes.find(c => c.id === group.id)).toEqual({ id: group.id, name: '另一页面已改名', courses: ['unit13-14'] });
});

for (const setting of ['courses', 'name']) test(`${setting} 保存中阻止重复提交，失败保留输入且可重试`, async ({ page }) => {
  const group = await createClass(page, '保存失败重试班-' + setting);
  const form = page.locator(setting === 'name' ? '#renameClass' : '#courses');
  const buttonName = setting === 'name' ? '保存班级名称' : '保存开放课程';
  if (setting === 'name') await page.getByLabel('班级名称', { exact: true }).fill('重试后班名');
  await page.getByRole('checkbox', { name: /Lesson 13–14 / }).check();
  let release, calls = 0;
  const gate = new Promise(resolve => { release = resolve; });
  const route = async route => {
    calls++;await gate;
    await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: '暂时无法保存，请重试' }) });
  };
  await page.route('**/api/admin/classes', route);
  try {
    await page.getByRole('button', { name: buttonName, exact: true }).click();
    await expect(page.getByRole('button', { name: '正在保存…', exact: true })).toBeDisabled();
    await expect(form.locator('input').first()).toBeDisabled();
    await form.evaluate(form => { form.requestSubmit();form.requestSubmit(); });
    await expect.poll(() => calls).toBe(1);
    release();
    await expect(form.getByRole('alert')).toHaveText('暂时无法保存，请重试');
    await expect(successDialog(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: buttonName, exact: true })).toBeEnabled();
    await expect(page.getByRole('checkbox', { name: /Lesson 13–14 / })).toBeChecked();
    expect((await state(page)).classes.find(c => c.id === group.id).courses).toEqual([]);
  } finally { release();await page.unroute('**/api/admin/classes', route); }
  await page.getByRole('button', { name: buttonName, exact: true }).click();
  await expect(successDialog(page)).toBeVisible();
  await successDialog(page).getByRole('button', { name: '知道了' }).click();
  await expect(form.getByRole('alert')).toHaveCount(0);
  const saved = (await state(page)).classes.find(c => c.id === group.id);
  expect(saved).toEqual({ ...group, ...(setting === 'name' ? { name:'重试后班名' } : { courses:['unit13-14'] }) });
  await expect(page.getByRole('checkbox', { name: /Lesson 13–14 / })).toBeChecked();
});

test('成功弹窗在桌面和窄屏居中，键盘关闭后焦点回到保存按钮', async ({ page }) => {
  await createClass(page, '保存成功弹窗体验班');
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.getByRole('button', { name: /^(全选课程|取消全选)$/ }).click();
    await page.getByRole('button', { name: '保存开放课程', exact: true }).click();
    const dialog = successDialog(page), confirm = dialog.getByRole('button', { name: '知道了' });
    await expect(dialog).toBeVisible();await expect(confirm).toBeFocused();
    const layout = await dialog.evaluate(el => { const r = el.getBoundingClientRect();return { x:r.x,y:r.y,right:r.right,bottom:r.bottom,cx:r.x+r.width/2,cy:r.y+r.height/2,width:innerWidth,height:innerHeight,overflow:el.scrollWidth>el.clientWidth }; });
    expect(Math.abs(layout.cx-layout.width/2)).toBeLessThan(2);expect(Math.abs(layout.cy-layout.height/2)).toBeLessThan(2);
    expect(layout.x).toBeGreaterThanOrEqual(12);expect(layout.right).toBeLessThanOrEqual(width-12);
    expect(layout.y).toBeGreaterThanOrEqual(12);expect(layout.bottom).toBeLessThanOrEqual(832);expect(layout.overflow).toBe(false);
    await page.screenshot({ path: `output/playwright/class-settings/saved-${width}.png` });
    await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('button', { name: '保存开放课程', exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('部分班级更新拒绝未登录、跨来源、空名称和无效课程，不改变已存设置', async ({ page, request }) => {
  const group = await createClass(page, '班级接口检查');
  const anonymous = await request.post('/lesson/api/admin/classes', { headers: { Origin: ORIGIN }, data: { id:group.id,name:'未授权改名' } });
  expect(anonymous.status()).toBe(401);
  const cross = await page.request.post('/lesson/api/admin/classes', { headers: { Origin:'https://another-origin.invalid' }, data: { id:group.id,courses:['unit13-14'] } });
  expect(cross.status()).toBe(403);
  for (const patch of [{ name:'   ' },{ courses:['not-a-course'] },{ courses:null },{}]) {
    expect((await updateClass(page, { id:group.id,...patch })).status()).toBe(400);
  }
  expect((await updateClass(page, { id:'missing',name:'不存在' })).status()).toBe(404);
  expect((await state(page)).classes.find(c => c.id === group.id)).toEqual(group);
});
