# Audio Lifecycle Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:systematic-debugging before changing behavior, superpowers:test-driven-development for every task, and superpowers:verification-before-completion before claiming this plan complete.

**Goal:** Make every prerecorded-audio and speech-synthesis path terminate exactly once, make interruption deterministic, and prevent playback queues or `.playing` UI states from becoming stuck.

**Architecture:** Replace the three page-local audio implementations with one dual-environment controller in `core/audio-player.js`. The controller owns one active playback, retries a failed prerecorded source through speech synthesis, normalizes all terminal paths, and reports a typed completion result exactly once. Lesson 50 keeps its page-specific queue above this controller; Lesson 49 and soundmark use interrupting playback directly.

**Tech Stack:** HTML5 Audio, Web Speech API, browser JavaScript, Node.js 20+, `node:test`, Playwright 1.62.0

## Preconditions and Constraints

- Complete `docs/superpowers/plans/2026-07-29-state-integrity-remediation.md` first.
- Start from a clean worktree with `npm test` passing.
- Preserve prerecorded MP3-first behavior and British English voice selection.
- Preserve the page-specific default speech rates.
- Do not introduce a runtime package, bundler, service worker, or backend.
- Do not treat `HTMLMediaElement.play()` promise fulfillment as playback completion.
- `onFinish` must run once for every accepted `play`, including cancellation.
- A failed prerecorded source falls back to speech synthesis in the same playback session.
- A new interrupting playback cancels the old session before it becomes active.
- Use only these terminal reasons: `ended`, `cancelled`, `error`, `timeout`, `unsupported`.

---

### Task 1: Define and test the shared audio lifecycle contract

**Files:**
- Create: `tests/unit/audio-player.test.js`
- Create: `core/audio-player.js`

**Interfaces:**

`core/audio-player.js` exports and attaches to `CanranCore.audio`:

```text
slugify(text: unknown): string

createAudioPlayer(options?): {
  play(request): { cancel(): void },
  stop(reason?: 'cancelled'): void,
  isActive(): boolean
}

request = {
  text: string,
  src?: string,
  rate?: number,
  pitch?: number,
  lang?: string,
  voice?: SpeechSynthesisVoice | null,
  onFinish?: ({reason, sourceFailed}) => void
}
```

Injected options are `AudioCtor`, `speechSynthesis`, `UtteranceCtor`, `setTimeoutFn`,
`clearTimeoutFn`, and `timeoutFor(text, sourceKind)`. Browser defaults come from `globalThis`.

- [ ] **Step 1: Write lifecycle fakes and failing unit tests**

Create `tests/unit/audio-player.test.js`:

```javascript
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
```

- [ ] **Step 2: Run the unit test and confirm the missing module**

Run:

```bash
node --test tests/unit/audio-player.test.js
```

Expected: FAIL with `Cannot find module '../../core/audio-player'`.

- [ ] **Step 3: Implement the lifecycle controller**

Create `core/audio-player.js`:

```javascript
(function attachAudio(root, factory) {
  'use strict';
  const api = factory(root || {});
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.audio = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function audioFactory(root) {
  'use strict';

  function slugify(value) {
    return String(value ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function createAudioPlayer(options = {}) {
    const AudioCtor = options.AudioCtor === undefined ? root.Audio : options.AudioCtor;
    const speechSynthesis = options.speechSynthesis === undefined
      ? root.speechSynthesis
      : options.speechSynthesis;
    const UtteranceCtor = options.UtteranceCtor === undefined
      ? root.SpeechSynthesisUtterance
      : options.UtteranceCtor;
    const setTimeoutFn = options.setTimeoutFn || root.setTimeout.bind(root);
    const clearTimeoutFn = options.clearTimeoutFn || root.clearTimeout.bind(root);
    const timeoutFor = options.timeoutFor || ((text, sourceKind) =>
      sourceKind === 'audio'
        ? Math.max(5000, String(text).length * 500)
        : Math.max(1800, String(text).length * 180)
    );
    const failedSources = new Set();
    let active = null;

    function clearTimer(session) {
      if (session.timer !== null) {
        clearTimeoutFn(session.timer);
        session.timer = null;
      }
    }

    function detachAudio(session, reset) {
      if (!session.audio) return;
      const audio = session.audio;
      audio.removeEventListener('ended', session.audioEnded);
      audio.removeEventListener('error', session.audioError);
      if (reset) {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch {}
      }
      session.audio = null;
    }

    function detachUtterance(session) {
      if (!session.utterance) return false;
      session.utterance.onend = null;
      session.utterance.onerror = null;
      session.utterance = null;
      return true;
    }

    function finish(session, reason) {
      if (session.finished) return;
      session.finished = true;
      clearTimer(session);
      detachAudio(session, reason === 'cancelled' || reason === 'timeout');
      detachUtterance(session);
      if (active === session) active = null;
      session.onFinish({
        reason,
        sourceFailed: session.sourceFailed
      });
    }

    function armTimeout(session, sourceKind, callback) {
      clearTimer(session);
      session.timer = setTimeoutFn(callback, timeoutFor(session.text, sourceKind));
    }

    function startSpeech(session) {
      if (session.finished) return;
      clearTimer(session);
      detachAudio(session, true);
      if (!speechSynthesis || !UtteranceCtor) {
        finish(session, 'unsupported');
        return;
      }

      let utterance;
      try {
        utterance = new UtteranceCtor(session.text);
        utterance.lang = session.lang;
        utterance.rate = session.rate;
        utterance.pitch = session.pitch;
        if (session.voice) utterance.voice = session.voice;
      } catch {
        finish(session, 'error');
        return;
      }

      session.utterance = utterance;
      utterance.onend = () => finish(session, 'ended');
      utterance.onerror = () => finish(session, 'error');
      armTimeout(session, 'speech', () => {
        const shouldCancel = detachUtterance(session);
        try {
          if (shouldCancel) speechSynthesis.cancel();
        } catch {}
        finish(session, 'timeout');
      });

      try {
        speechSynthesis.speak(utterance);
      } catch {
        finish(session, 'error');
      }
    }

    function failAudio(session) {
      if (session.finished || session.audioFailed) return;
      session.audioFailed = true;
      session.sourceFailed = true;
      if (session.src) failedSources.add(session.src);
      startSpeech(session);
    }

    function startAudio(session) {
      if (session.src && failedSources.has(session.src)) {
        session.sourceFailed = true;
        startSpeech(session);
        return;
      }
      if (!session.src || !AudioCtor) {
        startSpeech(session);
        return;
      }

      let audio;
      try {
        audio = new AudioCtor(session.src);
      } catch {
        failAudio(session);
        return;
      }

      session.audio = audio;
      session.audioEnded = () => finish(session, 'ended');
      session.audioError = () => failAudio(session);
      audio.addEventListener('ended', session.audioEnded, { once: true });
      audio.addEventListener('error', session.audioError, { once: true });
      armTimeout(session, 'audio', () => failAudio(session));

      let playResult;
      try {
        playResult = audio.play();
      } catch {
        failAudio(session);
        return;
      }
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(() => failAudio(session));
      }
    }

    function stop(reason = 'cancelled') {
      if (!active) return;
      const session = active;
      const shouldCancel = detachUtterance(session);
      try {
        if (speechSynthesis && shouldCancel) speechSynthesis.cancel();
      } catch {}
      finish(session, reason);
    }

    function play(request) {
      stop('cancelled');
      const session = {
        text: String(request.text ?? ''),
        src: request.src || '',
        rate: Number.isFinite(request.rate) ? request.rate : 0.85,
        pitch: Number.isFinite(request.pitch) ? request.pitch : 1.05,
        lang: request.lang || 'en-GB',
        voice: request.voice || null,
        onFinish: typeof request.onFinish === 'function' ? request.onFinish : () => {},
        sourceFailed: false,
        audioFailed: false,
        audio: null,
        audioEnded: null,
        audioError: null,
        utterance: null,
        timer: null,
        finished: false
      };
      active = session;
      startAudio(session);
      return {
        cancel() {
          if (active === session) stop('cancelled');
          else finish(session, 'cancelled');
        }
      };
    }

    return Object.freeze({
      play,
      stop,
      isActive: () => active !== null
    });
  }

  return Object.freeze({ slugify, createAudioPlayer });
});
```

- [ ] **Step 4: Run the lifecycle unit tests**

Run:

```bash
node --test tests/unit/audio-player.test.js
```

Expected: 7 tests pass.

- [ ] **Step 5: Add the lifecycle test to the normal unit gate and commit**

The existing `test:unit` glob already includes `tests/unit/audio-player.test.js`.

Run:

```bash
npm run test:unit
git diff --check
```

Expected: the previous 13 tests plus 7 audio tests pass, for 20 passing unit tests.

Commit:

```bash
git add core/audio-player.js tests/unit/audio-player.test.js
git commit -m "feat: normalize audio playback lifecycle"
```

---

### Task 2: Integrate soundmark and prove interrupted UI cleanup

**Files:**
- Modify: `soundmark/index.html:575-646`
- Modify: `soundmark/index.html:767-778`
- Modify: `soundmark/index.html:838-849`
- Modify: `soundmark/index.html:878-885`
- Modify: `soundmark/index.html:923-930`
- Modify: `soundmark/index.html:1000-1009`
- Create: `tests/e2e/audio-lifecycle.spec.js`

**Interfaces:**
- Consumes: `CanranCore.audio.createAudioPlayer` and `CanranCore.audio.slugify`.
- Produces: `speak(text, rate, onend)` with one normalized completion callback.
- Adds stable `data-audio-word` attributes to generated audio controls.

- [ ] **Step 1: Write the failing soundmark interruption regression**

Create `tests/e2e/audio-lifecycle.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

function installManualAudio(page) {
  return page.addInitScript(() => {
    window.__audios = [];
    window.Audio = class FakeAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.currentTime = 0;
        this.paused = false;
        window.__audios.push(this);
      }
      play() {
        return Promise.resolve();
      }
      pause() {
        this.paused = true;
      }
    };
  });
}

test('starting a second soundmark word clears the first playing state', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/soundmark/');
  const bit = page.locator('[data-audio-word="bit"]');
  const fit = page.locator('[data-audio-word="fit"]');

  await bit.click();
  await expect(bit).toHaveClass(/playing/);
  await fit.click();

  await expect(bit).not.toHaveClass(/playing/);
  await expect(fit).toHaveClass(/playing/);
  expect(await page.evaluate(() => window.__audios[0].paused)).toBe(true);

  await page.evaluate(() => {
    window.__audios.at(-1).dispatchEvent(new Event('ended'));
  });
  await expect(fit).not.toHaveClass(/playing/);
});
```

- [ ] **Step 2: Run the test and confirm the missing stable selectors**

Run:

```bash
npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js
```

Expected: FAIL because `[data-audio-word="bit"]` and `[data-audio-word="fit"]` do not exist.

- [ ] **Step 3: Load the shared controller and replace soundmark speech code**

Add this after the state-integrity core scripts and before the main soundmark script:

```html
<script src="/core/audio-player.js"></script>
```

Keep `UK_VOICE_KEYS`, `ukVoice`, and `pickBritishVoice`. Delete `slug`, `audioFailCache`,
`curAudio`, `stopCurAudio`, `tryAudio`, and `speakSynth`. Define:

```javascript
const soundmarkAudio=CanranCore.audio.createAudioPlayer();
function speak(text,rate=0.85,onend){
  const value=String(text);
  const source=CanranCore.audio.slugify(value);
  return soundmarkAudio.play({
    text:value,
    src:source?'audio/'+source+'.mp3':'',
    rate,
    voice:ukVoice||pickBritishVoice(),
    onFinish:result=>{
      if(result.reason==='unsupported'&&!speechWarned){
        speechWarned=true;
        toast('当前浏览器不支持语音朗读，可以用 Chrome / Edge 打开试试～');
      }
      if(onend)onend(result);
    }
  });
}
```

- [ ] **Step 4: Add stable audio-control identities**

When creating a `.wchip`, add:

```javascript
c.dataset.audioWord=w;
```

When creating each `.half`, its existing `data-w` is already stable; also add:

```javascript
h.dataset.audioWord=h.dataset.w;
```

When creating each `.ph-cell`, add:

```javascript
c.dataset.audioWord=e;
```

Do not change the existing class-removal callbacks. The new controller invokes those callbacks for
`ended`, `cancelled`, `error`, `timeout`, and `unsupported`, so every terminal path clears UI.

- [ ] **Step 5: Run the soundmark audio and smoke tests**

Run:

```bash
npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js tests/e2e/soundmark-progress.spec.js tests/e2e/smoke.spec.js
```

Expected: all targeted tests pass.

- [ ] **Step 6: Commit the first page integration**

```bash
git add soundmark/index.html tests/e2e/audio-lifecycle.spec.js
git commit -m "fix: finalize soundmark playback on interruption"
```

---

### Task 3: Rebuild the Lesson 50 queue above the shared controller

**Files:**
- Modify: `lesson50/index.html:883-975`
- Modify: `tests/e2e/audio-lifecycle.spec.js`

**Interfaces:**
- `speak(text, onDone)` interrupts active and queued playback.
- `speakLater(text)` appends only after the first user interaction.
- `speechBusy` is true only while the queue owns an active playback.
- `onDone` runs once for every terminal result, including cancellation, so challenge locks release
  without waiting for their secondary safety timer.

- [ ] **Step 1: Add failing queue and interruption tests**

Append to `tests/e2e/audio-lifecycle.spec.js`:

```javascript
test('Lesson 50 queued speech advances only after the active item finishes', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/lesson50/');
  await page.locator('body').dispatchEvent('pointerdown');

  await page.evaluate(() => {
    speakLater('apple');
    speakLater('banana');
  });
  await expect.poll(() => page.evaluate(() => window.__audios.length)).toBe(1);
  expect(await page.evaluate(() => speechBusy)).toBe(true);

  await page.evaluate(() => window.__audios[0].dispatchEvent(new Event('ended')));
  await expect.poll(() => page.evaluate(() => window.__audios.length)).toBe(2);
  expect(await page.evaluate(() => window.__audios[1].src.endsWith('audio/banana.mp3'))).toBe(true);

  await page.evaluate(() => window.__audios[1].dispatchEvent(new Event('ended')));
  await expect.poll(() => page.evaluate(() => speechBusy)).toBe(false);
  expect(await page.evaluate(() => speechQ.length)).toBe(0);
});

test('Lesson 50 interruption finalizes stale work exactly once', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/lesson50/');

  await page.evaluate(() => {
    window.__firstDone = 0;
    window.__secondDone = 0;
    speak('apple', () => { window.__firstDone += 1; });
    speak('banana', () => { window.__secondDone += 1; });
  });

  expect(await page.evaluate(() => window.__audios[0].paused)).toBe(true);
  expect(await page.evaluate(() => window.__firstDone)).toBe(1);
  await page.evaluate(() => window.__audios[1].dispatchEvent(new Event('ended')));
  await expect.poll(() => page.evaluate(() => window.__secondDone)).toBe(1);
  expect(await page.evaluate(() => window.__firstDone)).toBe(1);
  expect(await page.evaluate(() => speechBusy)).toBe(false);
});
```

- [ ] **Step 2: Run the Lesson 50 audio tests and confirm the lifecycle mismatch**

Run:

```bash
npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js
```

Expected: soundmark passes, while Lesson 50 queue/interruption assertions fail against the old
page-local token implementation.

- [ ] **Step 3: Load the controller and replace Lesson 50 playback internals**

Add this after the state-integrity core scripts and before the main Lesson 50 script:

```html
<script src="/core/audio-player.js"></script>
```

Keep `UK_VOICE_KEYS`, `ukVoice`, and `pickBritishVoice`. Delete `slug`, `audioFailCache`,
`curAudio`, `stopCurAudio`, `playT`, `speakSynthEnd`, and the old `pumpSpeech`, `speak`, and
`speakLater` implementations. Replace them with:

```javascript
const lesson50Audio=CanranCore.audio.createAudioPlayer();
let speechBusy=false;
let speechQ=[];
let playToken=0;

function audioRequest(text,onFinish){
  const value=String(text);
  const source=CanranCore.audio.slugify(value);
  return {
    text:value,
    src:source?'audio/'+source+'.mp3':'',
    rate:0.85,
    voice:ukVoice||pickBritishVoice(),
    onFinish
  };
}

function startSpeech(text,onDone){
  speechBusy=true;
  const token=++playToken;
  lesson50Audio.play(audioRequest(text,result=>{
    if(result.reason==='cancelled'){
      if(token===playToken)speechBusy=false;
      if(onDone)onDone(result);
      return;
    }
    if(token!==playToken)return;
    speechBusy=false;
    if(result.reason==='unsupported'&&!speechWarned){
      speechWarned=true;
      alert('当前浏览器不支持语音朗读 😢 可以用 Chrome / Edge 打开试试～');
    }
    if(onDone)onDone(result);
    pumpSpeech();
  }));
}

function pumpSpeech(){
  if(speechBusy||speechQ.length===0)return;
  const item=speechQ.shift();
  startSpeech(item.text,item.onDone);
}

function speak(text,onDone){
  speechQ.length=0;
  playToken++;
  lesson50Audio.stop('cancelled');
  speechBusy=false;
  startSpeech(text,onDone);
}

function speakLater(text){
  if(!userInteracted)return;
  speechQ.push({text,onDone:null});
  pumpSpeech();
}
```

The token is incremented before `stop` so the cancelled session cannot mutate the new queue.
Cancellation still runs the old request's `onDone` exactly once, allowing a challenge that was
waiting for speech to unlock immediately. The active non-cancel path also runs `onDone`, including
audio fallback, speech error, timeout, and unsupported completion.

- [ ] **Step 4: Run Lesson 50 audio and assessment regressions**

Run:

```bash
npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js tests/e2e/l50-assessment.spec.js
npm run test:unit
```

Expected: audio, queue, first-attempt scoring, and stable-option tests all pass.

- [ ] **Step 5: Commit the queued integration**

```bash
git add lesson50/index.html tests/e2e/audio-lifecycle.spec.js
git commit -m "fix: make lesson 50 speech queue terminal"
```

---

### Task 4: Integrate Lesson 49 and close the audio regression gate

**Files:**
- Modify: `index.html:961-1032`
- Modify: `tests/e2e/audio-lifecycle.spec.js`
- Modify: `tests/README.md`

**Interfaces:**
- Consumes: the same shared controller.
- Preserves: `speak(text)` as the Lesson 49 call surface.

- [ ] **Step 1: Add a failing Lesson 49 replacement test**

Append to `tests/e2e/audio-lifecycle.spec.js`:

```javascript
test('Lesson 49 replaces an active recording without leaving two players', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/');

  await page.evaluate(() => {
    speak('apple');
    speak('banana');
  });

  expect(await page.evaluate(() => window.__audios.length)).toBe(2);
  expect(await page.evaluate(() => window.__audios[0].paused)).toBe(true);
  expect(await page.evaluate(() => window.__audios[1].paused)).toBe(false);
});
```

- [ ] **Step 2: Run the test before integration**

Run:

```bash
npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js
```

Expected: Lesson 49 fails because it still owns the old playback implementation.

- [ ] **Step 3: Load the controller and replace Lesson 49 speech code**

Add this after the state-integrity core scripts and before the main Lesson 49 script:

```html
<script src="/core/audio-player.js"></script>
```

Keep `UK_VOICE_KEYS`, `ukVoice`, and `pickBritishVoice`. Delete `slug`, `audioFailCache`,
`curAudio`, `stopCurAudio`, `tryAudio`, and `speakSynth`. Define:

```javascript
const lesson49Audio=CanranCore.audio.createAudioPlayer();
function speak(text){
  const value=String(text);
  const source=CanranCore.audio.slugify(value);
  return lesson49Audio.play({
    text:value,
    src:source?'audio/'+source+'.mp3':'',
    rate:0.85,
    voice:ukVoice||pickBritishVoice(),
    onFinish:result=>{
      if(result.reason==='unsupported'&&!speechWarned){
        speechWarned=true;
        alert('当前浏览器不支持语音朗读 😢 可以用 Chrome / Edge 打开试试～');
      }
    }
  });
}
```

- [ ] **Step 4: Document the audio regression command**

Add to `tests/README.md`:

```markdown
`npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js` verifies terminal playback,
interruption cleanup, and the Lesson 50 queue.
```

- [ ] **Step 5: Run the complete audio exit gate**

Run:

```bash
npm run test:unit
npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js
npm test
git diff --check
rg -n "function (tryAudio|playT|speakSynth|speakSynthEnd|stopCurAudio)" index.html lesson50/index.html soundmark/index.html
```

Expected:

- 20 unit tests pass;
- every audio lifecycle browser test passes;
- the full repository suite passes;
- `git diff --check` prints no output;
- the final search prints no page-local playback implementations.

- [ ] **Step 6: Commit the final page migration**

```bash
git add index.html tests/e2e/audio-lifecycle.spec.js tests/README.md
git commit -m "fix: share terminal audio lifecycle across lessons"
```

## Plan Exit Gate

Before starting HTTP route/deployment work:

```bash
npm test
git status --short
```

Expected:

- all tests exit 0;
- the working tree is clean;
- each accepted `play` request has exactly one normalized terminal result;
- each cancelled Lesson 50 request releases its own pending continuation exactly once;
- no audio control remains `.playing` after end, cancellation, error, timeout, or unsupported audio.
