'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const GUIDE = path.join(ROOT, 'docs/v1-map-usability-pilot-toolkit.md');
const WORKBOOK = path.join(
  ROOT,
  'outputs/019fbc71-4582-7bd0-b601-ad7557fe6608/v1-map-usability-pilot-toolkit.xlsx'
);

test('pilot guide locks both manual rounds and the explicit pass denominator', async () => {
  const guide = await fs.readFile(GUIDE, 'utf8');

  assert.match(guide, /5–8 名孩子/);
  assert.match(guide, /每人 15–20 分钟/);
  assert.match(guide, /20–30 人班级/);
  assert.match(guide, /实际使用一周/);
  assert.match(guide, /30 秒内独立找到/);
  assert.match(guide, /区分可进入与正在绘制/);
  assert.match(guide, /理解一次地图成长/);
  assert.match(guide, /至少为 80%/);
  assert.match(guide, /分母始终在汇总页显示/);
  assert.match(guide, /阻塞多数使用者的 P0 或 P1/);
});

test('pilot guide keeps identity, tracking, retention, and learning claims out of scope', async () => {
  const guide = await fs.readFile(GUIDE, 'utf8');

  for (const boundary of [
    '隐藏设备身份',
    '匿名用户 ID',
    '完整点击流',
    '个人留存',
    '学习效果',
    'HUMAN_REQUIRED — 待执行'
  ]) {
    assert.match(guide, new RegExp(boundary));
  }
  assert.match(guide, /必须由机构人工执行/);
  assert.match(guide, /不代表试用已经发生/);
});

test('blank pilot workbook is a committed XLSX artifact linked from authored guidance', async () => {
  const [stat, bytes, guide, readme] = await Promise.all([
    fs.lstat(WORKBOOK),
    fs.readFile(WORKBOOK),
    fs.readFile(GUIDE, 'utf8'),
    fs.readFile(path.join(ROOT, 'README.md'), 'utf8')
  ]);

  assert.equal(stat.isFile(), true);
  assert.equal(stat.isSymbolicLink(), false);
  assert.ok(stat.size > 20_000, 'workbook must contain the formatted multi-sheet toolkit');
  assert.deepEqual([...bytes.subarray(0, 4)], [0x50, 0x4b, 0x03, 0x04]);
  assert.notEqual(bytes.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06])), -1);
  assert.match(guide, /v1-map-usability-pilot-toolkit\.xlsx/);
  assert.match(readme, /docs\/v1-map-usability-pilot-toolkit\.md/);
});
