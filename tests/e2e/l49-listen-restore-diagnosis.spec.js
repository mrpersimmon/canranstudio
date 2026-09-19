'use strict';
const { test, expect } = require('@playwright/test');

const words = ['butcher', 'meat', 'beef', 'lamb', 'steak', 'mince', 'chicken', 'husband', 'tell', 'truth', 'either', 'mutton', 'pork', 'fish'];
const completed = word => ({ selection: word, attempts: 1, firstCorrect: true, checked: true, correct: true, hintUsed: false });
const signature = values => values.map(word => 'listen-' + word).join('|');

async function prepare(page, { coreIndex, oldExtra = false, history = false, migrated = false, advancedIndex, historyOnly = false }) {
  const core = words.slice(0, 11);
  const coreStates = core.slice(0, coreIndex).map(completed);
  coreStates.push({ selection: null, attempts: 0, checked: false, hintUsed: false });
  const extra = { index: 3, signature: signature(words.slice(11)), states: words.slice(11).map(completed) };
  const groups = { 'listenPractice/core': { index: coreIndex, signature: signature(core), states: coreStates } };
  if (oldExtra) groups['listenPractice/extra'] = extra;
  if (migrated) groups['listenPractice/all'] = {
    index: advancedIndex ?? coreIndex,
    signature: signature(words),
    states: advancedIndex === undefined ? words.map((word, i) => i < coreStates.length ? coreStates[i] : i >= 11 ? completed(word) : null) : words.map(completed)
  };
  if (historyOnly) {
    delete groups['listenPractice/core'];
    groups['listenPractice/all'].states = words.map(word => ({ ...completed(word), target: '听辨 ' + word, prompt: '听一听，选出单词。' }));
  }
  const progress = {
    version: 1, groups,
    records: history ? Object.fromEntries(words.map(word => ['listen-' + word, { ...completed(word), target: '听辨 ' + word, prompt: '听一听，选出单词。' }])) : {},
    activity: { listenMode: migrated ? 'all' : 'core', coreListeningComplete: true }
  };
  await page.addInitScript(progress => {
    if (!localStorage.getItem('canran:l49:learning:v1')) {
      localStorage.setItem('canran:l49:learning:v1', JSON.stringify(progress));
      localStorage.setItem('l49-stars-v1', JSON.stringify({ l1: 3, l2: 3, l3: 0, l4: 0, l5: 0 }));
    }
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; this.paused = true; }
      play() { this.paused = false; queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
      pause() { this.paused = true; }
    };
  }, progress);
  await page.goto('/lesson49/#learn/listen');
}

for (const advancedIndex of [13, 14]) {
  test(`已经进入${advancedIndex === 13 ? '末题正确反馈' : '完成页'}的异常旧草稿，只重做后三题且正常新答案可刷新恢复`, async ({ page }) => {
    await prepare(page, { coreIndex: 2, oldExtra: true, history: true, migrated: true, advancedIndex });
    const room = page.locator('#listenPractice');
    await expect(room).toContainText('第 12 / 14 题');
    await expect(page.locator('#starCount')).toHaveText('6');
    await page.screenshot({ path: `output/playwright/l49-v141-recovered-${advancedIndex}.png` });
    for (let i = 11; i < 14; i++) {
      await expect(room.getByRole('status')).toBeEmpty();
      await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
      await expect(room.getByRole('button', { name: words[i], exact: true })).toBeEnabled();
      await answer(room, words[i]);
      await page.reload();
      await expect(room).toContainText(`第 ${i + 1} / 14 题`);
      await expect(room.getByRole('status')).toHaveText('答对了！');
      await room.getByRole('button', { name: i < 13 ? '下一题' : '完成这一站', exact: true }).click();
    }
    await expect(room).toContainText('寻宝完成！');
    await page.reload();
    await expect(room).toContainText('寻宝完成！');
    await page.getByRole('button', { name: '学徒手记', exact: true }).click();
    await expect(page.locator('#learningRecord')).toContainText('听辨 butcher');
    await expect(page.locator('#learningRecord')).toContainText('听辨 fish');
    await expect(page.locator('#starCount')).toHaveText('6');
  });
}

test('只有历史成绩回填形成的旧完成草稿恢复为待答，历史手记与星星保留', async ({ page }) => {
  await prepare(page, { coreIndex: 0, history: true, migrated: true, advancedIndex: 14, historyOnly: true });
  const room = page.locator('#listenPractice');
  await expect(room).toContainText('第 1 / 14 题');
  await expect(room.getByRole('status')).toBeEmpty();
  await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await page.reload();
  await expect(room).toContainText('第 1 / 14 题');
  await page.getByRole('button', { name: '学徒手记', exact: true }).click();
  await expect(page.locator('#learningRecord')).toContainText('听辨 mutton');
  await expect(page.locator('#learningRecord')).toContainText('听辨 fish');
  await expect(page.locator('#starCount')).toHaveText('6');
});

async function answer(room, word) {
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await room.getByRole('button', { name: word, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
}

for (const damage of ['上一轮答案', '另一题答案', '零次提交却已答对', '答案与判分矛盾', '未答完却停在完成页', '未知草稿版本']) {
  test(`草稿防护：${damage}不能被恢复为本轮正确作答`, async ({ page }) => {
    await prepare(page, { coreIndex: 0 });
    const room = page.locator('#listenPractice');
    await answer(room, 'butcher');
    // Inject a damaged persisted draft at the browser Storage boundary.
    await page.evaluate(damage => {
      const saved = JSON.parse(localStorage.getItem('canran:l49:learning:v1'));
      const draft = saved.groups['listenPractice/all'];
      const state = draft.states[0];
      if (damage === '上一轮答案') state.runId = 'previous-run';
      if (damage === '另一题答案') state.questionId = 'listen-fish';
      if (damage === '零次提交却已答对') state.attempts = 0;
      if (damage === '答案与判分矛盾') state.selection = 'husband';
      if (damage === '未答完却停在完成页') draft.index = 14;
      if (damage === '未知草稿版本') draft.draftVersion = 999;
      localStorage.setItem('canran:l49:learning:v1', JSON.stringify(saved));
    }, damage);
    await page.reload();
    const isGap = damage === '未答完却停在完成页';
    await expect(room).toContainText(`第 ${isGap ? 2 : 1} / 14 题`);
    await expect(room.getByRole('status')).toBeEmpty();
    await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await expect(room.getByRole('button', { name: isGap ? 'meat' : 'butcher', exact: true })).toBeEnabled();
    await answer(room, isGap ? 'meat' : 'butcher');
    await page.reload();
    await expect(room.getByRole('status')).toHaveText('答对了！');
  });
}

for (const scenario of [
  { name: '旧主线第3题继续，旧三词已完成', coreIndex: 2, oldExtra: true, history: true },
  { name: '最小复现：旧主线第11题继续，仅旧三词草稿', coreIndex: 10, oldExtra: true },
  { name: '对照：旧主线第11题继续，无旧三词与历史成绩', coreIndex: 10 },
  { name: '历史成绩回填：无三词草稿但有历史成绩', coreIndex: 10, history: true },
  { name: '已经合并为14词的草稿仍含旧三词答案', coreIndex: 10, oldExtra: true, migrated: true }
]) {
  test(scenario.name + '，12至14题必须等待本轮选择', async ({ page }, testInfo) => {
    await prepare(page, scenario);
    const room = page.locator('#listenPractice');
    for (let i = scenario.coreIndex; i < 11; i++) {
      await expect(room).toContainText(`第 ${i + 1} / 14 题`);
      await answer(room, words[i]);
      await room.getByRole('button', { name: '下一题', exact: true }).click();
    }
    const observed = [];
    for (let i = 11; i < 14; i++) {
      await expect(room).toContainText(`第 ${i + 1} / 14 题`);
      const status = await room.getByRole('status').innerText();
      observed.push({
        question: i + 1,
        selected: await room.locator('.practice-options [aria-pressed="true"]').allTextContents(),
        locked: await room.locator('.practice-options button:disabled').count(),
        feedback: status,
        checkVisible: await room.getByRole('button', { name: '检查答案', exact: true }).isVisible()
      });
      if (i < 13) {
        // Record each question before any input; answer only if the page is awaiting input.
        if (!status) await answer(room, words[i]);
        await room.getByRole('button', { name: '下一题', exact: true }).click();
      }
    }
    await testInfo.attach('questions-before-user-input', { body: JSON.stringify(observed, null, 2), contentType: 'application/json' });
    await page.screenshot({ path: testInfo.outputPath('question-14-before-input.png') });
    expect(observed).toEqual([12, 13, 14].map(question => ({ question, selected: [], locked: 0, feedback: '', checkVisible: true })));
  });
}
