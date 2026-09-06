'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const { setup, unit, story } = require('./support/learning-path-harness');

test('the opening waits for a click, reveals only the current line and never advances on audio ending', () => {
  const s = setup(); s.send({ type: 'open-node', nodeId: 'K01' });
  assert.equal(s.view().audio, null);
  for (const ref of unit.dialogueRefs) assert.ok(!s.html().includes(`data-turn-ref="${ref}"`));
  s.send({ type: 'continue' }); assert.equal(s.view().storyIndex, 0);
  s.send({ type: 'line-play', id: 'L01-D07' }); assert.equal(s.view().audio, null);
  s.send({ type: 'story-start' });
  assert.ok(s.html().includes('data-turn-ref="L01-D01"')); assert.ok(!s.html().includes('data-turn-ref="L01-D02"'));
  const request = s.view().audio;
  const ended = s.rt.dispatch({ type: 'audio-ended', requestId: request.requestId, index: 0 });
  assert.equal(ended.view.storyIndex, 0); assert.ok(!ended.effects.some(e => e.type === 'play-audio'));
  assert.deepEqual(ended.view.record.storyProgress, {});
  s.send({ type: 'continue' }); assert.equal(s.view().storyIndex, 1); assert.equal(s.view().audio.sequence[0].ref, 'L01-D02');
});
test('all seven original lines are singly triggered and each of the three decisions pauses the same story', () => {
  const s = setup(); s.send({ type: 'open-node', nodeId: 'K01' });
  const heard = [], checkpoints = [];
  for (const [index, beat] of story.beats.entries()) {
    assert.equal(s.view().storyActivityId, story.id); assert.equal(s.view().storyIndex, index);
    if (beat.kind === 'line') {
      if (!s.view().storyRevealed) s.send({ type: 'story-start' });
      assert.equal(s.view().audio.sequence.length, 1); heard.push(s.view().audio.sequence[0].ref);
      s.hear(); assert.equal(s.view().storyIndex, index);
    } else {
      checkpoints.push(beat.activityId); assert.equal(s.view().audio, null); s.answer();
      assert.equal(s.view().audio, null, 'checking never automatically plays or echoes a story line');
    }
    s.send({ type: 'continue' });
  }
  assert.deepEqual(heard, unit.dialogueRefs); assert.equal(checkpoints.length, 3); assert.equal(s.view().screen, 'celebration');
});
test('a history replay cannot reveal or complete the current line, including after a failed replay and retry', () => {
  const s = setup(); s.send({ type: 'open-node', nodeId: 'K01' }); s.completeStep();
  assert.equal(s.view().storyIndex, 1); assert.equal(s.view().storyLineDone, false);
  s.send({ type: 'line-play', id: 'L01-D01' }); const current = s.view().audio;
  s.send({ type: 'audio-error', requestId: current.requestId, index: 0, blocked: false });
  s.send({ type: 'retry-audio' }); assert.equal(s.view().audio.sequence[0].ref, 'L01-D01'); s.hear();
  assert.equal(s.view().storyLineDone, false); s.send({ type: 'continue' }); assert.equal(s.view().storyIndex, 1);
  s.send({ type: 'line-play', id: 'L01-D03' }); assert.equal(s.view().audio.sequence[0].ref, 'L01-D01');
  s.send({ type: 'replay' }); assert.equal(s.view().audio.sequence[0].ref, 'L01-D02'); s.hear();
  s.send({ type: 'continue' }); assert.equal(s.view().storyIndex, 2);
});
test('stale endings, pause, autoplay blocking and playback errors never count as a completed story line', () => {
  const s = setup(); s.send({ type: 'open-node', nodeId: 'K01' }); s.send({ type: 'story-start' });
  const stale = s.view().audio; s.send({ type: 'replay' });
  s.send({ type: 'audio-ended', requestId: stale.requestId, index: 0 }); assert.equal(s.view().canContinue, false);
  let a = s.view().audio; s.send({ type: 'pause' }); s.send({ type: 'audio-ended', requestId: a.requestId, index: 0 }); assert.equal(s.view().canContinue, false);
  s.send({ type: 'resume-audio' }); s.send({ type: 'audio-error', requestId: a.requestId, index: 0, blocked: true });
  s.send({ type: 'continue' }); assert.equal(s.view().storyIndex, 0); assert.equal(s.view().wrong, 0);
  s.send({ type: 'retry-audio' }); s.hear(); assert.equal(s.view().canContinue, true);
});
test('both complete cats stay in the story; handing over uses the cast instead of duplicate character cards', () => {
  const s = setup(); s.reach('v3.6:story:owner'); const html = s.html();
  assert.ok(html.includes('lp-story-cast')); assert.ok(html.includes('is-choice'));
  for (const entity of ['station-keeper', 'handbag-owner']) {
    assert.ok(html.includes(`data-action="select" data-id="${entity}"`));
    assert.equal(html.split(unit.entities[entity].assetSrc).length - 1, 1);
  }
  assert.ok(!html.includes('lp-picture-options'));
  assert.ok(html.indexOf('lp-story-transcript') < html.indexOf('lp-story-cast'), 'read the context before the character answers');
  for (const entity of ['station-keeper', 'handbag-owner']) assert.ok(html.includes(`aria-label="${unit.copy.chooseCat} ${unit.entities[entity].title}"`));
  s.send({ type: 'select', id: 'handbag-owner' });
  assert.ok(s.html().includes(unit.copy.selected));
  assert.ok(!s.html().includes('lp-story-cast is-returned'), 'selection alone must not confirm the answer or hand over the bag');
  s.answer(); assert.ok(s.html().includes('lp-story-cast is-returned'));
  assert.ok(s.html().includes(unit.copy.confirmed));
  s.send({ type: 'continue' }); assert.equal(s.view().activityId, 'v3.6:story:thanks');
  assert.ok(s.html().includes('lp-story-cast is-returned'));
});
test('learning surfaces omit redundant instruction, mode paragraphs, mascot headings and slow controls', () => {
  const s = setup();
  for (const node of unit.nodes) {
    s.send({ type: 'open-node', nodeId: node.id }); let guard = 0;
    while (s.view().screen === 'activity' && guard++ < 100) {
      const html = s.html();
      for (const text of ['跟着气泡听故事', 'Listen then answer this question.', 'Look, listen and repeat.', '慢速听', '正常听', '轻松重练', 'lp-heading-cat', 'lp-task-step']) assert.ok(!html.includes(text), text);
      assert.equal((html.match(/<h1 /g) || []).length, 1);
      assert.ok(!html.includes('undefined')); s.completeStep();
    }
  }
});
test('word-bank dialogue withholds the answer and continuation, then plays both only after checking', () => {
  const s = setup(); s.reach('v3:L02-M15:C01'); const a = unit.activities[s.view().activityId], cv = a.conversation;
  assert.ok(!s.html().includes(`lang="en">${unit.sources[cv.replyRef].text}`));
  for (const ref of cv.continuationRefs) assert.ok(!s.html().includes(`data-turn-ref="${ref}"`));
  s.send({ type: 'line-play', id: cv.replyRef }); assert.equal(s.view().audio, null);
  for (const id of a.answer) s.send({ type: 'select', id }); s.send({ type: 'check' });
  assert.deepEqual(s.view().audio.sequence.map(line => line.ref), [cv.replyRef, ...cv.continuationRefs]);
  assert.ok(!s.html().includes('class="lp-options')); assert.equal(s.view().canContinue, false);
  s.hear(); assert.equal(s.view().canContinue, true);
});
