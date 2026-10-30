import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { keepsakes, chapters, collectionLabel, chapterForCard, cardsInChapter, restoreChapterCard, searchKeepsakes, isOutsideDemo } from '../src/postoffice-model.ts';
const require = createRequire(import.meta.url);
const ids = query => searchKeepsakes(keepsakes, query).map(card => card.id);
test('单个 Lesson 精确归属成对单元，不误匹配数字子串', () => {
  for (let lesson = 1; lesson <= 12; lesson++) {
    const start = lesson % 2 ? lesson : lesson - 1;
    assert.deepEqual(ids(String(lesson)), [`unit${start}-${start + 1}`]);
  }
  assert.deepEqual(ids('111'),[]);
  assert.deepEqual(ids('0'),[]);
});
test('支持英文、大小写、全角数字、中文课号', () => {
  for (const query of [' Lesson 3 ', 'LESSON 03','Ｌｅｓｓｏｎ ３','第3课']) assert.deepEqual(ids(query),['unit3-4']);
  for (const query of ['LESSON ８','第１２课']) assert.ok(ids(query)[0].startsWith(query.includes('１２') ? 'unit11' : 'unit7'));
});
test('范围搜索支持不同横线，交叉范围返回所属单元', () => {
  for (const query of ['3-4','3–4','3—4','３－４','3至4','Lesson 3 到 4']) assert.deepEqual(ids(query),['unit3-4']);
  assert.deepEqual(ids('2-5'),['unit1-2','unit3-4','unit5-6']);
  assert.deepEqual(ids('6-9'),['unit5-6','unit7-8','unit9-10']);
  assert.deepEqual(ids('6-1'),[]);
});
test('卡名搜索和空查询，未命中可清空恢复', () => {
  assert.deepEqual(ids('认领'),['unit3-4']);
  assert.deepEqual(ids('新朋友'),['unit5-6','unit7-8']);
  assert.deepEqual(ids('问候'),['unit9-10']);
  assert.deepEqual(ids('不存在'),[]);
  assert.equal(ids('  ').length,6);
});
test('区分演示外 Lesson 与普通无结果', () => {
  assert.equal(isOutsideDemo('Lesson 144'),true);
  assert.equal(isOutsideDemo('7-12'),false);
  assert.equal(isOutsideDemo('13'),true);
  assert.equal(isOutsideDemo('5-8'),false);
  assert.equal(isOutsideDemo('不存在'),false);
});
test('每章三张不同主卡，不重复计数', () => {
  assert.equal(new Set(chapters.flatMap(chapter => chapter.cardIds)).size,6);
  for (const chapter of chapters) {
    assert.equal(chapter.cardIds.length,3);
    assert.deepEqual(cardsInChapter(chapter.id).map(card => card.id),chapter.cardIds);
    assert.ok(cardsInChapter(chapter.id).every(card=>card.chapterId===chapter.id));
  }
});
test('跨章定位及记忆恢复不会混用另一章的卡片', () => {
  assert.equal(chapterForCard('unit9-10').id,'neighborhood');
  assert.equal(restoreChapterCard('neighborhood','unit9-10').id,'unit9-10');
  assert.equal(restoreChapterCard('opening','unit9-10').id,'unit1-2');
  assert.equal(restoreChapterCard('neighborhood','missing').id,'unit7-8');
  assert.equal(restoreChapterCard('missing'),null);
  assert.throws(()=>chapterForCard('missing'));
});
test('章节课程范围与现有旅程模型一致，卡名沿用奖励目录', () => {
  const { MAP_CHAPTERS } = require('../../../course-journey/model.js');
  const catalog = require('../../../server/award-catalog.js');
  for (const chapter of chapters) assert.deepEqual(chapter.cardIds,MAP_CHAPTERS.find(item=>item.id===chapter.id).courses);
  for (const card of keepsakes) assert.ok(Object.values(catalog[card.id]).some(meta=>meta.title===card.title&&meta.lesson===card.label));
  assert.equal(collectionLabel,'Lesson 1–12');
});
test('导出原文件保持字节一致、GIF格式和984×528比例', async () => {
  for (const card of keepsakes) {
    const bytes=await readFile(new URL(`../public${card.image}`,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),card.sha256);
    assert.match(bytes.subarray(0,6).toString(),/^GIF8[79]a$/);
    assert.equal(bytes.readUInt16LE(6),984); assert.equal(bytes.readUInt16LE(8),528);
    assert.equal(card.firstFullStarAt,card.chapterId==='opening'?'2026.10.16':'2026.10.22'); assert.equal(card.stars,5);
  }
});
