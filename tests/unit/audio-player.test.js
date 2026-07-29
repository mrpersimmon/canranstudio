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

test('a reentrant latest play supersedes its outer request without orphaning media', () => {
  const { player, clock } = makePlayer();
  const results = { a: [], b: [], c: [] };
  let cHandle;

  player.play({
    text: 'apple',
    src: 'audio/apple.mp3',
    onFinish: result => {
      results.a.push(result);
      if (result.reason === 'cancelled') {
        cHandle = player.play({
          text: 'cherry',
          src: 'audio/cherry.mp3',
          onFinish: value => results.c.push(value)
        });
      }
    }
  });
  const bHandle = player.play({
    text: 'banana',
    src: 'audio/banana.mp3',
    onFinish: result => results.b.push(result)
  });

  assert.equal(FakeAudio.instances.length, 2);
  assert.deepEqual(results.a, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.deepEqual(results.b, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.deepEqual(results.c, []);
  assert.equal(player.isActive(), true);

  bHandle.cancel();
  assert.deepEqual(results.b, [{ reason: 'cancelled', sourceFailed: false }]);
  player.stop();
  cHandle.cancel();
  assert.deepEqual(results.c, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.equal(FakeAudio.instances[1].paused, true);
  assert.equal(clock.pending(), 0);
  assert.equal(player.isActive(), false);
});

test('a superseded request can reenter from its own finish callback safely', () => {
  const { player, clock } = makePlayer();
  const results = { a: [], b: [], c: [], d: [] };

  player.play({
    text: 'apple',
    src: 'audio/apple.mp3',
    onFinish: result => {
      results.a.push(result);
      if (result.reason === 'cancelled') {
        player.play({
          text: 'cherry',
          src: 'audio/cherry.mp3',
          onFinish: value => results.c.push(value)
        });
      }
    }
  });
  const bHandle = player.play({
    text: 'banana',
    src: 'audio/banana.mp3',
    onFinish: result => {
      results.b.push(result);
      if (result.reason === 'cancelled') {
        player.play({
          text: 'date',
          src: 'audio/date.mp3',
          onFinish: value => results.d.push(value)
        });
      }
    }
  });

  assert.equal(FakeAudio.instances.length, 3);
  assert.deepEqual(results.a, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.deepEqual(results.b, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.deepEqual(results.c, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.deepEqual(results.d, []);
  bHandle.cancel();
  player.stop();
  assert.deepEqual(results.b, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.deepEqual(results.d, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.equal(clock.pending(), 0);
  assert.equal(player.isActive(), false);
});

test('explicit stop and later handle cancellation clean audio exactly once', () => {
  const { player, clock } = makePlayer();
  const results = [];
  const handle = player.play({
    text: 'apple',
    src: 'audio/apple.mp3',
    onFinish: result => results.push(result)
  });
  const audio = FakeAudio.instances[0];

  player.stop();
  handle.cancel();
  audio.dispatchEvent(new Event('ended'));

  assert.deepEqual(results, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.equal(audio.paused, true);
  assert.equal(audio.currentTime, 0);
  assert.equal(clock.pending(), 0);
  assert.equal(player.isActive(), false);
});

test('an active audio handle cancels and ignores captured late handlers', () => {
  class CapturingAudio extends FakeAudio {
    constructor(src) {
      super(src);
      this.handlers = new Map();
    }

    addEventListener(type, listener, options) {
      this.handlers.set(type, listener);
      return super.addEventListener(type, listener, options);
    }
  }
  const { player, clock } = makePlayer({ AudioCtor: CapturingAudio });
  const results = [];
  const handle = player.play({
    text: 'apple',
    src: 'audio/apple.mp3',
    onFinish: result => results.push(result)
  });
  const audio = FakeAudio.instances[0];
  const lateEnded = audio.handlers.get('ended');
  const lateError = audio.handlers.get('error');

  handle.cancel();
  handle.cancel();
  player.stop();
  lateEnded();
  lateError();

  assert.deepEqual(results, [{ reason: 'cancelled', sourceFailed: false }]);
  assert.equal(audio.paused, true);
  assert.equal(audio.currentTime, 0);
  assert.equal(clock.pending(), 0);
  assert.equal(player.isActive(), false);
});

test('audio timeout falls back with source failure and ignores late audio events', () => {
  const { player, speechSynthesis, clock } = makePlayer();
  const results = [];

  player.play({
    text: 'apple',
    src: 'audio/apple.mp3',
    onFinish: result => results.push(result)
  });
  const audio = FakeAudio.instances[0];
  clock.runNext();
  audio.dispatchEvent(new Event('error'));
  audio.dispatchEvent(new Event('ended'));
  speechSynthesis.spoken[0].onend();

  assert.deepEqual(results, [{ reason: 'ended', sourceFailed: true }]);
  assert.equal(clock.pending(), 0);
});

test('audio construction and synchronous play failures cache the source before fallback', () => {
  let constructionAttempts = 0;
  class ThrowingConstructorAudio {
    constructor() {
      constructionAttempts += 1;
      throw new Error('bad source');
    }
  }
  const first = makePlayer({ AudioCtor: ThrowingConstructorAudio });

  first.player.play({ text: 'apple', src: 'audio/apple.mp3' });
  first.speechSynthesis.spoken[0].onend();
  first.player.play({ text: 'apple', src: 'audio/apple.mp3' });
  assert.equal(constructionAttempts, 1);

  let playAttempts = 0;
  class ThrowingPlayAudio extends FakeAudio {
    play() {
      playAttempts += 1;
      throw new Error('blocked');
    }
  }
  const second = makePlayer({ AudioCtor: ThrowingPlayAudio });
  second.player.play({ text: 'pear', src: 'audio/pear.mp3' });
  second.speechSynthesis.spoken[0].onend();
  second.player.play({ text: 'pear', src: 'audio/pear.mp3' });
  assert.equal(playAttempts, 1);
});

test('synchronous speech failure and late captured utterance handlers are terminal once', () => {
  const throwingSpeech = fakeSpeech();
  throwingSpeech.speak = () => {
    throw new Error('speech unavailable');
  };
  const failed = makePlayer({ AudioCtor: null, speechSynthesis: throwingSpeech });
  const failures = [];
  failed.player.play({ text: 'apple', onFinish: result => failures.push(result) });
  assert.deepEqual(failures, [{ reason: 'error', sourceFailed: false }]);

  const { player, speechSynthesis } = makePlayer({ AudioCtor: null });
  const results = [];
  player.play({ text: 'banana', onFinish: result => results.push(result) });
  const utterance = speechSynthesis.spoken[0];
  const lateEnd = utterance.onend;
  const lateError = utterance.onerror;
  lateEnd();
  lateError();
  assert.deepEqual(results, [{ reason: 'ended', sourceFailed: false }]);
});
