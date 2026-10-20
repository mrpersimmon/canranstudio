'use strict';
const { test, expect } = require('@playwright/test');
const crypto = require('node:crypto');
const { courseResponse } = require('../support/course-response-faults');
const { adminLogin, createStudent, studentLogin } = require('./helpers');
const flow = require('../support/thirteen-types-flow');
const base = process.env.AWARD_TEST_BASE || '/lesson/';
const course = base + 'unit1-2/';
test.use({ actionTimeout: 10000 });
test.afterEach(async ({ request }) => {
  await request.post('/__test__/course-responses', { data: { reset: true } });
});

async function learner(page, browser, label, contextOptions) {
  await adminLogin(page, base);
  const account = await createStudent(page, label, '小禾', [/Lesson 1–2/]);
  return studentLogin(browser, account, base, contextOptions);
}

async function observeCourseReady(page) {
  await page.addInitScript(() => {
    document.addEventListener('canran:course-ready', () => {
      window.recoveryCourseReadyMs = performance.now();
    }, { once: true });
  });
}

async function waitForCourseReady(page, info, label) {
  // The frozen pre-repair page also takes longer than the default assertion
  // deadline on mobile WebKit. First observe the same real ready boundary used
  // on initial entry, then check the original learning/date assertions below.
  // This is state recovery coverage, not a replacement for performance budgets.
  await page.waitForFunction(() => Number.isFinite(window.recoveryCourseReadyMs)
    && !document.querySelector('#courseLoader'), null, { timeout: 15000 });
  await info.attach(label + '-ready.json', { contentType: 'application/json',
    body: Buffer.from(JSON.stringify(await page.evaluate(() => ({ readyMs: window.recoveryCourseReadyMs })))) });
}

test('不支持 AbortSignal.any 和 timeout 的浏览器仍能进入课程并恢复词卡位置', async ({ page, browser }, info) => {
  const student = await learner(page, browser, '旧浏览器加载验收');
  const p = student.page;
  try {
    await observeCourseReady(p);
    await p.addInitScript(() => { AbortSignal.any = undefined; AbortSignal.timeout = undefined; });
    await p.goto(course + '#learn/words');
    const words = p.getByRole('region', { name: '单词小图鉴', exact: true });
    await expect(words).toBeVisible({ timeout: 15000 });
    await expect(p.locator('#courseLoader')).toHaveCount(0);
    await words.getByRole('button', { name: '下一组', exact: true }).click();
    await expect(words).toContainText('2 / 4');
    await p.reload();
    await waitForCourseReady(p, info, 'words-reload');
    await expect(words).toContainText('2 / 4');
  } finally { await student.context.close(); }
});

test('旧浏览器的连接超时也会结束等待，重试后可继续进入', async ({ page, browser }) => {
  const student = await learner(page, browser, '旧浏览器超时验收');
  const p = student.page, pattern = base + 'course-index.json';
  try {
    await p.addInitScript(() => { AbortSignal.any = undefined; AbortSignal.timeout = undefined; });
    await p.clock.install();
    await courseResponse(p, pattern, { hold: true });
    const requested = p.waitForRequest('**' + pattern);
    await p.goto(course + '#learn/words');
    await requested;
    await p.clock.fastForward(16000);
    const loader = p.getByRole('region', { name: '课程加载', exact: true });
    await expect(loader).toContainText('错误编号：L01');
    await courseResponse(p, pattern);
    await p.clock.resume();
    await loader.getByRole('button', { name: '再试一次', exact: true }).click();
    await expect(p.getByRole('region', { name: '单词小图鉴', exact: true })).toBeVisible();
  } finally { await student.context.close(); }
});

test('不支持较新取消接口时仍可查看自己的已获纪念卡', async ({ page, browser }) => {
  const student = await learner(page, browser, '旧浏览器纪念册验收');
  const p = student.page;
  try {
    await p.addInitScript(() => { AbortSignal.any = undefined; AbortSignal.timeout = undefined; });
    await flow.activity(p, '1-2', 'listen', { base: base.replace(/\/$/, '') });
    await expect(p.locator('#starCount')).toHaveText('1');
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    await p.goto(base + 'awards/');
    await expect(p.locator('.book')).toBeVisible();
    await expect(p.locator('.book')).toHaveAttribute('aria-busy', 'false');
    await p.getByRole('button', { name: '放大 Lesson 1–2 礼貌小帮手', exact: true }).click();
    const card = p.getByRole('dialog', { name: 'Lesson 1–2 纪念卡', exact: true });
    await expect(card.locator('.certificate')).toHaveAttribute('data-stars', '1');
    await card.getByRole('button', { name: '关闭纪念卡', exact: true }).click();
  } finally { await student.context.close(); }
});

// A release changes one illustration while the earlier immutable URL is gone.
// Keep the teaching content identical: recovery must not reset the child's round.
async function releaseAfterMissingAsset(p) {
  const index = await (await p.request.get(base + 'course-index.json')).json();
  const pack = await (await p.request.get(index.courses['unit1-2'].manifest)).json();
  const old = pack.required.find(item => item.key.endsWith('/handbag.svg'));
  const original = await (await p.request.get(old.url)).body();
  const bytes = Buffer.concat([original, Buffer.from('\n<!-- loading recovery release -->')]);
  const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  const replacement = { ...old, sha256: sha(bytes), bytes: bytes.length, url: base + 'resources/' + sha(bytes) + '/handbag.svg' };
  pack.required = pack.required.map(item => item.key === old.key ? replacement : item);
  pack.revision = sha(JSON.stringify(pack.required));
  const body = Buffer.from(JSON.stringify(pack));
  index.courses['unit1-2'] = { ...index.courses['unit1-2'], revision: pack.revision,
    manifest: base + 'course-packages/unit1-2/' + pack.revision + '.json', sha256: sha(body) };
  await courseResponse(p, old.url, { status: 404, body: 'expired course resource' });
  // Simulate browser resource eviction, not a fabricated learning record.
  await p.evaluate(async ({ base, old }) => {
    for (const name of await caches.keys()) if (name.endsWith(':course-cache:v1')) {
      await (await caches.open(name)).delete(base + 'resources/' + old.sha256);
    }
  }, { base, old });
  return async () => {
    await courseResponse(p, base + 'course-index.json', { json: index });
    await courseResponse(p, index.courses['unit1-2'].manifest, { body, contentType: 'application/json' });
    await courseResponse(p, replacement.url, { body: bytes, contentType: old.type });
  };
}

for (const { name, serviceWorkers, unwritable } of [
  { name: 'Worker allow', serviceWorkers: 'allow' },
  { name: 'Worker block', serviceWorkers: 'block' },
  { name: '缓存拒绝写入', serviceWorkers: 'block', unwritable: true }
]) test(`旧课包缺图后重试和再次进入保留已获星、半途题目和本轮错答（${name}）`, async ({ page, browser }, testInfo) => {
  test.setTimeout(90000);
  const student = await learner(page, browser, '旧课包恢复验收', { serviceWorkers });
  const p = student.page;
  try {
    await flow.activity(p, '1-2', 'listen', { base: base.replace(/\/$/, '') });
    await expect(p.locator('#starCount')).toHaveText('1');
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    await p.goto(course + '#learn/manners');
    const room = p.getByRole('region', { name: '帮忙还手提包', exact: true });
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await flow.select(room, { fills: ['it'] }); await check.click();
    await expect(room.getByRole('status')).toHaveText('再看看。');
    await room.getByRole('button', { name: '再试一次', exact: true }).click();
    await flow.select(room, { fills: ['me'] }); await check.click();
    await room.getByRole('button', { name: '下一题', exact: true }).click();
    await expect(room).toContainText('第 2 / 5 题');
    if (unwritable) await p.addInitScript(() => {
      // Public browser-storage boundary; the server and learning stores stay real.
      Cache.prototype.put = async function () { throw new DOMException('Storage full', 'QuotaExceededError'); };
    });
    const publish = await releaseAfterMissingAsset(p);
    await p.reload();
    await expect(p.getByRole('button', { name: '再试一次', exact: true })).toBeVisible();
    if (serviceWorkers === 'block') {
      // Low-storage/private-browser fallback: evict resource bytes after they
      // were read for the failed attempt. Do not alter learning storage.
      await p.evaluate(async () => {
        for (const name of await caches.keys()) if (name.endsWith(':course-cache:v1')) {
          const disk = await caches.open(name);
          for (const request of await disk.keys()) await disk.delete(request);
        }
      });
    }
    await publish();
    await p.getByRole('button', { name: '再试一次', exact: true }).click();
    await expect(room).toBeVisible({ timeout: 15000 });
    await expect(room).toContainText('第 2 / 5 题');
    await expect(p.locator('#starCount')).toHaveText('1');
    await p.reload();
    await expect(room).toBeVisible({ timeout: 15000 });
    await expect(room).toContainText('第 2 / 5 题');
    await p.goto(base);
    await p.locator('.course[data-unit="unit1-2"]').getByRole('link').click();
    await expect(p.locator('#courseLoader')).toHaveCount(0, { timeout: 15000 });
    await expect(p.locator('#starCount')).toHaveText('1');
    await flow.activity(p, '1-2', 'manners', { base: base.replace(/\/$/, '') });
    await expect(p.locator('#starCount')).toHaveText('1');
    await expect(room.getByText('本次答错', { exact: true }).locator('..')).toContainText('1');
    await p.screenshot({ path: testInfo.outputPath('recovered-course.png') });
  } finally { await student.context.close(); }
});

test('缺图失败显示原因编号，手机页面可以返回课程并在恢复后重进', async ({ page, browser }) => {
  const student = await learner(page, browser, '加载失败原因验收');
  const p = student.page;
  try {
    await p.setViewportSize({ width: 390, height: 844 });
    const missing = base + 'resources/*/handbag.svg';
    await courseResponse(p, missing, { status: 404, body: 'missing image' });
    await p.goto(course + '#learn/words');
    const loader = p.getByRole('region', { name: '课程加载', exact: true });
    await expect(loader).toContainText('错误编号：L03');
    await expect(loader).toContainText('学习记录会保留。');
    await expect(p.getByRole('region', { name: '单词小图鉴', exact: true })).not.toBeVisible();
    expect(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await p.screenshot({ path: `output/playwright/loading-recovery/${base === '/' ? 'root' : 'lesson'}-missing-image.png` });
    await loader.getByRole('link', { name: '返回课程', exact: true }).click();
    await expect(p).toHaveURL(new RegExp(base + '$'));
    await expect(p.getByRole('link', { name: '我的纪念册', exact: true })).toBeVisible();
    await courseResponse(p, missing);
    await p.goto(course + '#learn/words');
    await expect(p.getByRole('region', { name: '单词小图鉴', exact: true })).toBeVisible();
  } finally { await student.context.close(); }
});

for (const fault of [
  { name: '连接失败', code: 'L01', path: 'course-index.json', response: { status: 503, body: 'unavailable' } },
  { name: '课程清单无效', code: 'L02', path: 'course-index.json', response: { contentType: 'application/json', body: '{' } },
  { name: '图片误返回网页', code: 'L03', path: 'resources/*/handbag.svg', response: { contentType: 'text/html', body: '<p>error</p>' } },
  { name: '文件校验失败', code: 'L04', path: 'resources/*/handbag.svg', response: { contentType: 'image/svg+xml', body: '<svg/>' } },
  { name: '引导脚本未下载', code: 'L06', path: 'core/course-loader.js', response: { status: 503, body: 'unavailable' } }
]) test(`${fault.name}显示 ${fault.code}，重试恢复原章节且错误提示消失`, async ({ page, browser }) => {
  // A bootstrap network failure must not be hidden by a previously cached
  // worker response. Other cases retain the production service worker.
  const student = await learner(page, browser, '分类错误恢复验收', fault.path.startsWith('core/') ? { serviceWorkers: 'block' } : {});
  const p = student.page, pattern = base + fault.path;
  try {
    await courseResponse(p, pattern, fault.response);
    await p.goto(course + '#learn/words');
    const loader = p.getByRole('region', { name: '课程加载', exact: true });
    await expect(loader).toContainText('错误编号：' + fault.code);
    await courseResponse(p, pattern);
    await loader.getByRole('button', { name: '再试一次', exact: true }).click();
    await expect(p.getByRole('region', { name: '单词小图鉴', exact: true })).toBeVisible();
    await expect(p.locator('#courseLoader')).toHaveCount(0);
    await expect(p).toHaveURL(new RegExp(course + '#learn/words$'));
  } finally { await student.context.close(); }
});

// Publish a well-hashed package containing a genuinely undecodable image or a
// throwing course script. Neither failure may expose a partially started page.
async function brokenRelease(p, suffix, replacement) {
  const index = await (await p.request.get(base + 'course-index.json')).json();
  const pack = await (await p.request.get(index.courses['unit1-2'].manifest)).json();
  const old = pack.required.find(item => item.key.endsWith(suffix));
  const bytes = Buffer.from(replacement);
  const sha = value => crypto.createHash('sha256').update(value).digest('hex');
  const item = { ...old, sha256: sha(bytes), bytes: bytes.length, url: base + 'resources/' + sha(bytes) + '/' + suffix.split('/').pop() };
  pack.required = pack.required.map(value => value.key === old.key ? item : value);
  pack.revision = sha(JSON.stringify(pack.required));
  const body = Buffer.from(JSON.stringify(pack));
  index.courses['unit1-2'] = { ...index.courses['unit1-2'], revision: pack.revision,
    manifest: base + 'course-packages/unit1-2/' + pack.revision + '.json', sha256: sha(body) };
  const routes = [
    [base + 'course-index.json', { json: index }],
    [index.courses['unit1-2'].manifest, { body, contentType: 'application/json' }],
    [item.url, { body: bytes, contentType: item.type }]
  ];
  for (const [pattern, response] of routes) await courseResponse(p, pattern, response);
  return async () => { for (const [pattern] of routes) await courseResponse(p, pattern); };
}

for (const fault of [
  { name: '图片无法解码', code: 'L05', suffix: '/handbag.svg', body: '<svg>unfinished' },
  { name: '课程脚本中断', code: 'L06', suffix: '/unit1-2/unit.js', body: 'throw new Error("course startup test");' }
]) test(`${fault.name}仍可重试进入完整课程，重新加载不丢失目标位置`, async ({ page, browser }) => {
  const student = await learner(page, browser, '启动中断恢复验收');
  const p = student.page;
  try {
    const restore = await brokenRelease(p, fault.suffix, fault.body);
    await p.goto(course + '#learn/words');
    const loader = p.getByRole('region', { name: '课程加载', exact: true });
    await expect(loader).toContainText('错误编号：' + fault.code);
    await expect(p.getByRole('region', { name: '单词小图鉴', exact: true })).not.toBeVisible();
    await restore();
    await loader.getByRole('button', { name: '再试一次', exact: true }).click();
    const words = p.getByRole('region', { name: '单词小图鉴', exact: true });
    await expect(words).toBeVisible();
    await words.getByRole('button', { name: '下一组', exact: true }).click();
    await expect(words).toContainText('2 / 4');
    await expect(p).toHaveURL(new RegExp(course + '#learn/words$'));
  } finally { await student.context.close(); }
});

test('满星后资源失效重试不改变姓名、五星和首次满星日期，纪念册仍可查看', async ({ page, browser }, info) => {
  // Real signup + all five answer zones + recovery + two return visits + book.
  // Mobile WebKit needs a larger total budget; individual UI deadlines remain.
  test.setTimeout(120000);
  const student = await learner(page, browser, '满星缓存恢复验收');
  const p = student.page, mount = base.replace(/\/$/, '');
  try {
    await observeCourseReady(p);
    await flow.story(p, '1-2', mount);
    for (const id of ['listen', 'roles', 'trans', 'manners', 'exam']) {
      // Account confirmation can arrive after the completion controls render.
      // Finish that reward before starting another answer zone: an automatic
      // Escape handler during the next answer can swallow its in-flight click.
      await flow.activity(p, '1-2', id, { base: mount, keepAward: true });
      const reward = p.locator('dialog.award-reveal[open]');
      await expect(reward).toBeVisible();
      await p.keyboard.press('Escape');
      await expect(reward).toHaveCount(0);
    }
    await p.goto(course + '#learn/certificate');
    await expect(p.locator('#starCount')).toHaveText('5');
    await expect(p.locator('#certificateName')).toHaveText('小禾');
    const date = await p.locator('#certificateDate').textContent();
    expect(date.trim()).not.toBe('');
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    const publish = await releaseAfterMissingAsset(p);
    await p.reload();
    await expect(p.getByRole('button', { name: '再试一次', exact: true })).toBeVisible();
    await publish();
    await p.getByRole('button', { name: '再试一次', exact: true }).click();
    await expect(p.locator('#starCount')).toHaveText('5');
    await expect(p.locator('#certificateName')).toHaveText('小禾');
    await expect(p.locator('#certificateDate')).toHaveText(date);
    await p.reload();
    await waitForCourseReady(p, info, 'certificate-reload');
    await expect(p.locator('#certificateDate')).toHaveText(date);
    await p.getByRole('link', { name: '我的课程', exact: true }).click();
    await p.locator('.course[data-unit="unit1-2"]').getByRole('link').click();
    await p.goto(course + '#learn/certificate');
    await waitForCourseReady(p, info, 'certificate-directory-return');
    await expect(p.locator('#starCount')).toHaveText('5');
    await expect(p.locator('#certificateName')).toHaveText('小禾');
    await expect(p.locator('#certificateDate')).toHaveText(date);
    await p.getByRole('link', { name: '我的纪念册', exact: true }).click();
    await expect(p.locator('.book')).toHaveAttribute('aria-busy', 'false');
    await expect(p.getByRole('button', { name: '放大 Lesson 1–2 礼貌小帮手', exact: true })).toBeVisible();
  } finally { await student.context.close(); }
});
