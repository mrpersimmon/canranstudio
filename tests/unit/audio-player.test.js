'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createAudioPlayer, slugify } = require('../../core/audio-player');

class FakeAudio extends EventTarget {
  static instances = [];

  constructor(src) {
    super();
    this.src = src;
    this.currentTime = 0;
    this.paused = false;
    this.playResult = Promise.resolve();
    FakeAudio.instances.push(this);
  }

  play() {
    return this.playResult;
  }

  pause() {
    this.paused = true;
  }
}

class FakeUtterance {
  constructor(text) {
    this.text = text;
    this.onend = null;
    this.onerror = null;
  }
}

function fakeSpeech() {
  return {
    spoken: [],
    cancelCount: 0,
    speak(utterance) {
      this.spoken.push(utterance);
    },
    cancel() {
      this.cancelCount += 1;
    }
  };
}

function fakeClock() {
  let nextId = 1;
  const timers = new Map();
  return {
    setTimeoutFn(callback) {
      const id = nextId++;
      timers.set(id, callback);
      return id;
    },
    clearTimeoutFn(id) {
      timers.delete(id);
    },
    runNext() {
      const first = timers.entries().next().value;
      assert.ok(first, 'expected a pending timer');
      const [id, callback] = first;
      timers.delete(id);
      callback();
    },
    pending() {
      return timers.size;
    }
  };
}

function makePlayer(overrides = {}) {
  const speechSynthesis = overrides.speechSynthesis ?? fakeSpeech();
  const clock = overrides.clock ?? fakeClock();
  const player = createAudioPlayer({
    AudioCtor: overrides.AudioCtor === undefined ? FakeAudio : overrides.AudioCtor,
    speechSynthesis,
    UtteranceCtor: overrides.UtteranceCtor === undefined
      ? FakeUtterance
      : overrides.UtteranceCtor,
    setTimeoutFn: clock.setTimeoutFn,
    clearTimeoutFn: clock.clearTimeoutFn,
    timeoutFor: () => 100
  });
  return { player, speechSynthesis, clock };
}

test.beforeEach(() => {
  FakeAudio.instances.length = 0;
});

test('slugify keeps the repository audio filename convention', () => {
  assert.equal(slugify("Don't eat that!"), 'don_t_eat_that');
  assert.equal(slugify('  APPLE  '), 'apple');
  assert.equal(slugify(null), '');
});

test('prerecorded audio finishes on ended, not on play promise fulfillment', async () => {
  const { player } = makePlayer();
  const results = [];

  player.play({
    text: 'apple',
    src: 'audio/apple.mp3',
    onFinish: result => results.push(result)
  });
  await Promise.resolve();

  assert.deepEqual(results, []);
  assert.equal(player.isActive(), true);
  FakeAudio.instances[0].dispatchEvent(new Event('ended'));
  assert.deepEqual(results, [{ reason: 'ended', sourceFailed: false }]);
  assert.equal(player.isActive(), false);
});

test('audio error falls back to speech and finishes once when speech ends', () => {
  const { player, speechSynthesis } = makePlayer();
  const results = [];

  player.play({
    text: 'apple',
    src: 'audio/apple.mp3',
    onFinish: result => results.push(result)
  });
  FakeAudio.instances[0].dispatchEvent(new Event('error'));

  assert.equal(speechSynthesis.spoken.length, 1);
  assert.deepEqual(results, []);
  speechSynthesis.spoken[0].onend();
  speechSynthesis.spoken[0].onerror?.();
  assert.deepEqual(results, [{ reason: 'ended', sourceFailed: true }]);
});

test('rejected play promise falls back and caches the failed source', async () => {
  class RejectingAudio extends FakeAudio {
    play() {
      return Promise.reject(new Error('blocked'));
    }
  }
  const { player, speechSynthesis } = makePlayer({ AudioCtor: RejectingAudio });

  player.play({ text: 'apple', src: 'audio/apple.mp3' });
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(speechSynthesis.spoken.length, 1);

  speechSynthesis.spoken[0].onend();
  player.play({ text: 'apple', src: 'audio/apple.mp3' });
  assert.equal(RejectingAudio.instances.length, 1);
  assert.equal(speechSynthesis.spoken.length, 2);
});

test('starting a new playback cancels the old playback exactly once', () => {
  const { player } = makePlayer();
  const first = [];
  const second = [];

  player.play({
    text: 'apple',
    src: 'audio/apple.mp3',
    onFinish: result => first.push(result)
  });
  const oldAudio = FakeAudio.instances[0];
  player.play({
    text: 'banana',
    src: 'audio/banana.mp3',
    onFinish: result => second.push(result)
  });

  assert.equal(oldAudio.paused, true);
  assert.equal(oldAudio.currentTime, 0);
  assert.deepEqual(first, [{ reason: 'cancelled', sourceFailed: false }]);
  oldAudio.dispatchEvent(new Event('ended'));
  assert.equal(first.length, 1);
  assert.deepEqual(second, []);
});

test('speech error and timeout are terminal and idempotent', () => {
  const { player, speechSynthesis, clock } = makePlayer({ AudioCtor: null });
  const errored = [];

  player.play({ text: 'apple', onFinish: result => errored.push(result) });
  speechSynthesis.spoken[0].onerror();
  speechSynthesis.spoken[0].onend?.();
  assert.deepEqual(errored, [{ reason: 'error', sourceFailed: false }]);

  const timedOut = [];
  player.play({ text: 'banana', onFinish: result => timedOut.push(result) });
  clock.runNext();
  speechSynthesis.spoken[1].onend?.();
  assert.deepEqual(timedOut, [{ reason: 'timeout', sourceFailed: false }]);
});

test('unsupported playback still completes exactly once', () => {
  const { player } = makePlayer({
    AudioCtor: null,
    speechSynthesis: null,
    UtteranceCtor: null
  });
  const results = [];

  player.play({ text: 'apple', onFinish: result => results.push(result) });

  assert.deepEqual(results, [{ reason: 'unsupported', sourceFailed: false }]);
  assert.equal(player.isActive(), false);
});
