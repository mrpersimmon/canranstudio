(function learningRuntimeReview() {
  'use strict';

  const BEATS = {
    discover: {
      title: '发现问题',
      eyebrow: '订单板 · 第一步',
      mission: '这张订单还缺什么？',
      copy: '先找出“谁要什么、不要什么、数量多少”里没有说清楚的线索。',
      hint: '点选一张还需要问清楚的线索',
      answers: [
        { id: 'item', title: '什么', subtitle: '需要哪种食材？' },
        { id: 'quantity', title: '多少', subtitle: '需要几份？' },
        { id: 'person', title: '谁', subtitle: '是哪位客人？' }
      ],
      near: {
        eyebrow: '野餐便签 · 新地点',
        mission: '这张野餐便签还缺什么？',
        copy: '地点和客人都换了。找出会让备货数量不确定的那条空白。',
        hint: '在新便签里重新判断缺少的线索',
        answers: [
          { id: 'place', title: '哪里', subtitle: '在哪儿野餐？' },
          { id: 'quantity', title: '多少', subtitle: '需要几份？' },
          { id: 'guest', title: '谁来', subtitle: '有哪些客人？' }
        ]
      }
    },
    understand: {
      title: '听懂线索',
      eyebrow: '备货台 · 听完整句',
      mission: '伯德夫人要哪一份？',
      copy: '先听完整句话，声音结束后再把食材和数量放进订单。',
      hint: '播放一句，再选择正确的商品篮',
      answers: [
        { id: 'steak', title: 'steak', subtitle: '牛排' },
        { id: 'beef', title: 'beef', subtitle: '牛肉' },
        { id: 'mince', title: 'mince', subtitle: '肉馅' }
      ],
      near: {
        eyebrow: '野餐补给 · 新录音',
        mission: '新客人想把哪份装进篮子？',
        copy: '说话人和用途已经换了。听完整句子，只根据新的声音线索判断。',
        hint: '听完新录音，再选择对应的食材',
        answers: [
          { id: 'fruit', title: 'fruit', subtitle: '水果' },
          { id: 'beef', title: 'beef', subtitle: '牛肉' },
          { id: 'bread', title: 'bread', subtitle: '面包' }
        ]
      }
    },
    teach: {
      title: '教会小猫',
      eyebrow: '句子工坊 · 找出错因',
      mission: 'He doesn’t likes potatoes. 哪里不对？',
      copy: 'doesn’t 已经承担了第三人称变化。帮小猫选出后面应该使用的动词形式。',
      hint: '先找 doesn’t，再选择正确的动词形式',
      answers: [
        { id: 'likes', title: 'likes', subtitle: '保留第三人称 s' },
        { id: 'liking', title: 'liking', subtitle: '使用 ing 形式' },
        { id: 'like', title: 'like', subtitle: '使用动词原形' }
      ],
      near: {
        eyebrow: '野餐便签 · 新句子',
        mission: 'She doesn’t wants peaches. 应该怎么改？',
        copy: '人物和商品都换了，但 doesn’t 后面的动词规则不变。',
        hint: '换一个句子，再独立选择正确形式',
        answers: [
          { id: 'wants', title: 'wants', subtitle: '保留第三人称 s' },
          { id: 'wanting', title: 'wanting', subtitle: '使用 ing 形式' },
          { id: 'want', title: 'want', subtitle: '使用动词原形' }
        ]
      }
    },
    transfer: {
      title: '换个情境使用',
      eyebrow: '早餐摊位 · 新人物',
      mission: '为两位新客人配好早餐篮',
      copy: '人物、商品和目的都变了。根据偏好卡组织问句，再说明每个人喜欢什么。',
      hint: '选择一位客人，完成新的询问与配篮',
      answers: [
        { id: 'ben', title: 'Ben', subtitle: '不要 peas' },
        { id: 'together', title: '一起', subtitle: '选择 pears' },
        { id: 'mia', title: 'Mia', subtitle: '喜欢 grapes' }
      ],
      near: {
        eyebrow: '野餐补给台 · 换个目的',
        mission: '谁的野餐篮还没配对？',
        copy: '现在要按野餐偏好重新询问。不要照抄早餐摊位的人物答案。',
        hint: '只根据这张新偏好卡选择客人',
        answers: [
          { id: 'mia', title: 'Mia', subtitle: '想要 grapes' },
          { id: 'together', title: '一起', subtitle: '分享 pears' },
          { id: 'ben', title: 'Ben', subtitle: '不要 peas' }
        ]
      }
    },
    build: {
      title: '建造地标',
      eyebrow: '营业前核对 · 第五幕',
      mission: '市集可以开门了吗？',
      copy: '核对人物、商品、数量和偏好。今天完成建设，最终灯光要等以后真正想起来才点亮。',
      hint: '完成最后一次真实核对',
      answers: [
        { id: 'order', title: '再核对', subtitle: '数量还不清楚' },
        { id: 'preference', title: '先暂停', subtitle: '偏好仍放错' },
        { id: 'ready', title: '可以开门', subtitle: '四类线索都清楚' }
      ],
      near: {
        eyebrow: '野餐出发前 · 新核对',
        mission: '野餐补给可以出发了吗？',
        copy: '换成另一张订单，重新核对人物、商品、数量与偏好是否完整。',
        hint: '只根据新订单决定是否可以出发',
        answers: [
          { id: 'order', title: '再核对', subtitle: '数量还不清楚' },
          { id: 'preference', title: '先暂停', subtitle: '偏好仍放错' },
          { id: 'ready', title: '可以出发', subtitle: '四类线索都清楚' }
        ]
      }
    }
  };

  const STATES = {
    ready: { text: '', tone: '' },
    correct: { text: '答对了。订单和市集发生了真实变化，现在可以继续下一步。', tone: 'success' },
    'first-error': { text: '这次还没对。先重新观察题目里的线索，不会直接显示答案。', tone: 'error' },
    'partial-cue': { text: '局部线索：先找已经固定的结构，再检查仍需变化的部分。', tone: 'warning' },
    model: { text: '小猫示范的是判断方法。接下来换情境时，要自己重新判断。', tone: 'warning' },
    'near-transfer': { text: '近迁移：规则不变，但人物、商品和目的已经换了。', tone: 'success' },
    'storage-failure': { text: '这一步暂时没有保存。画面不会假装地标已经永久建好。', tone: 'error' }
  };

  const MICROSTEPS = new Set([
    'task', 'audio-waiting', 'audio-playing', 'audio-completed', 'audio-fallback'
  ]);
  const MOTIONS = new Set(['full', 'reduced']);
  const VIEWPORTS = new Set(['iphone12', 'huawei', 'tablet', 'desktop']);
  const root = document.querySelector('[data-learning-review-root]');
  if (!root) return;

  const core = globalThis.CanranCore || {};
  const curriculumCatalog = core.curriculumCatalog;
  const learningStore = core.learningStore;
  const learningLedger = core.learningLedger;
  const learningRuntime = core.learningRuntime;
  const unit = curriculumCatalog?.getTeachingUnit?.('FLC-U01');
  const engineReady = Boolean(
    unit
    && unit.beats?.every(beat => beat.task?.answerKeyByContext)
    && learningStore?.createMemoryAdapter
    && learningLedger?.open
    && learningRuntime?.create
  );
  const beatIds = Object.keys(BEATS);
  const reviewClock = Object.freeze({ learningDay: () => '2026-08-10' });
  const storageKey = 'poc:learning-runtime-review';
  let previousBodyOverflow = '';
  let latestScenario = null;

  function normalizedQuery() {
    const params = new URLSearchParams(location.search);
    return {
      beat: Object.hasOwn(BEATS, params.get('beat')) ? params.get('beat') : 'discover',
      state: Object.hasOwn(STATES, params.get('state')) ? params.get('state') : 'ready',
      viewport: VIEWPORTS.has(params.get('viewport')) ? params.get('viewport') : 'iphone12',
      microstep: MICROSTEPS.has(params.get('microstep')) ? params.get('microstep') : 'task',
      motion: MOTIONS.has(params.get('motion')) ? params.get('motion') : 'full'
    };
  }

  let model = normalizedQuery();

  function replaceQuery() {
    const params = new URLSearchParams(model);
    history.replaceState(null, '', `${location.pathname}?${params}`);
  }

  function setPressed(group, value) {
    for (const button of document.querySelectorAll(`[data-${group}-controls] button`)) {
      const selected = button.dataset.value === value;
      button.setAttribute('aria-pressed', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
  }

  function seedPriorCheckpoints(ledger, selectedBeatIndex) {
    for (let index = 0; index < selectedBeatIndex; index += 1) {
      const beat = unit.beats[index];
      const result = ledger.apply({
        eventId: `review-seed:${beat.beatId}`,
        type: 'checkpoint-completed',
        unitId: unit.unitId,
        beatId: beat.beatId,
        checkpointId: `${beat.beatId}:complete`,
        buildStage: beat.buildStage
      });
      if (result.persisted !== true) throw new Error(`cannot seed ${beat.beatId}`);
    }
  }

  function failingAdapter(memory) {
    return Object.freeze({
      load: key => memory.load(key),
      commit: (key, request) => ({
        status: 'unavailable',
        persisted: false,
        revision: request.expectedRevision,
        value: null,
        key
      })
    });
  }

  function authoredAnswer(runtime, shouldBeCorrect) {
    const snapshot = runtime.snapshot();
    const beat = unit.beats.find(candidate => candidate.beatId === snapshot.beatId);
    const answerKey = beat?.task?.answerKeyByContext?.[snapshot.contextId];
    return {
      action: {
        type: 'answer/submit',
        answerId: shouldBeCorrect ? answerKey : `review-wrong:${beat?.beatId || 'unknown'}`
      },
      answerKey
    };
  }

  function playAudio(runtime) {
    if (runtime.snapshot().microstepId !== 'understand-audio') return null;
    runtime.dispatch({ type: 'audio/play', audioId: 'review-line' });
    return runtime.snapshot().audio?.requestId || null;
  }

  function completeAudio(runtime) {
    const requestId = playAudio(runtime);
    if (requestId) runtime.dispatch({ type: 'audio/completed', requestId });
  }

  function applySelectedMicrostep(runtime, forceTask) {
    if (runtime.snapshot().microstepId !== 'understand-audio') return;
    const selected = forceTask ? 'task' : model.microstep;
    if (selected === 'audio-waiting') return;
    const requestId = playAudio(runtime);
    if (!requestId || selected === 'audio-playing') return;
    if (selected === 'audio-fallback') {
      runtime.dispatch({ type: 'audio/failed', requestId, reason: 'review-fixture' });
      return;
    }
    runtime.dispatch({ type: 'audio/completed', requestId });
  }

  function buildScenario() {
    if (!engineReady) {
      return {
        snapshot: { status: 'unavailable', beatId: model.beat, buildStage: 0, supportLevel: 0 },
        effects: [{ type: 'runtime/unavailable' }],
        persisted: false,
        answerKey: null
      };
    }

    const beatIndex = beatIds.indexOf(model.beat);
    const memory = learningStore.createMemoryAdapter();
    const seedLedger = learningLedger.open({
      store: memory,
      key: storageKey,
      catalog: curriculumCatalog,
      clock: reviewClock
    });
    seedPriorCheckpoints(seedLedger, beatIndex);

    const activeLedger = model.state === 'storage-failure'
      ? learningLedger.open({
        store: failingAdapter(memory),
        key: storageKey,
        catalog: curriculumCatalog,
        clock: reviewClock
      })
      : seedLedger;
    const effects = [];
    const runtime = learningRuntime.create({
      unit,
      ledger: activeLedger,
      seed: 49,
      effectSink: effect => effects.push(effect)
    });
    runtime.enter({ entryLesson: beatIndex < 2 ? unit.lessonIds[0] : unit.lessonIds[1] });

    const answerStates = new Set([
      'correct', 'first-error', 'partial-cue', 'model', 'near-transfer', 'storage-failure'
    ]);
    applySelectedMicrostep(runtime, answerStates.has(model.state));

    if (model.state === 'correct' || model.state === 'storage-failure') {
      runtime.dispatch(authoredAnswer(runtime, true).action);
    }
    const wrongAttempts = {
      'first-error': 1,
      'partial-cue': 2,
      model: 3,
      'near-transfer': 3
    }[model.state] || 0;
    for (let attempt = 0; attempt < wrongAttempts; attempt += 1) {
      runtime.dispatch(authoredAnswer(runtime, false).action);
    }

    const snapshot = runtime.snapshot();
    const presentationContextId = model.state === 'model'
      ? unit.beats[beatIndex].task.contextId
      : snapshot.contextId;
    const answerKey = unit.beats[beatIndex].task.answerKeyByContext[presentationContextId] || null;
    const persistenceFailed = effects.some(effect => effect.type === 'runtime/persistence-failed');
    return {
      snapshot,
      effects,
      answerKey,
      presentationContextId,
      persisted: model.state === 'correct'
        ? !persistenceFailed
        : (model.state === 'storage-failure' ? false : null)
    };
  }

  function audioStatusCopy(scenario) {
    if (model.beat !== 'understand' && model.microstep !== 'task') return '本幕没有读音门槛';
    if (model.microstep === 'audio-waiting') return '等待播放 · 孩子还没有开始听';
    if (model.microstep === 'audio-playing') return '正在播放 · 任务暂时不能作答';
    if (model.microstep === 'audio-completed') return '播放完成 · 现在可以作答';
    if (model.microstep === 'audio-fallback') return '无声替代 · 可看文字和图片继续';
    if (scenario.snapshot.audio?.status === 'playing') return '正在播放';
    return '';
  }

  function render() {
    const beat = BEATS[model.beat];
    const state = STATES[model.state];
    const scenario = buildScenario();
    latestScenario = scenario;
    const runtimeBeat = scenario.snapshot.beatId || model.beat;
    const buildStage = scenario.snapshot.buildStage || 0;
    const sceneMode = model.state === 'model'
      ? 'model'
      : (model.state === 'near-transfer' ? 'near-transfer' : 'task');
    const presentation = sceneMode === 'near-transfer' ? beat.near : beat;

    root.dataset.beat = model.beat;
    root.dataset.state = model.state;
    root.dataset.viewport = model.viewport;
    root.dataset.microstep = model.microstep;
    root.dataset.motion = model.motion;
    root.dataset.runtimeStatus = scenario.snapshot.status;
    root.dataset.runtimeBeat = runtimeBeat;
    root.dataset.runtimeMicrostep = scenario.snapshot.microstepId || 'none';
    root.dataset.runtimeAudioStatus = scenario.snapshot.audio?.status || 'none';
    root.dataset.runtimeBuildStage = String(buildStage);
    root.dataset.runtimeSupportLevel = String(scenario.snapshot.supportLevel || 0);
    root.dataset.runtimePersisted = scenario.persisted === null ? 'not-applicable' : String(scenario.persisted);
    root.dataset.runtimeEffects = scenario.effects.map(effect => effect.type).join(' ');
    root.dataset.runtimeContext = scenario.snapshot.contextId || 'none';

    const childScene = document.querySelector('[data-child-scene]');
    childScene.dataset.sceneMode = sceneMode;
    document.querySelector('[data-scene-title]').textContent = beat.title;
    document.querySelector('[data-mission-eyebrow]').textContent = presentation.eyebrow;
    document.querySelector('[data-mission-title]').textContent = presentation.mission;
    document.querySelector('[data-mission-copy]').textContent = presentation.copy;
    document.querySelector('[data-action-hint]').textContent = presentation.hint;

    const modelPanel = document.querySelector('[data-model-panel]');
    modelPanel.hidden = sceneMode !== 'model';

    const audioStatus = document.querySelector('[data-audio-status]');
    const audioCopy = audioStatusCopy(scenario);
    audioStatus.hidden = !audioCopy;
    document.querySelector('[data-audio-status-copy]').textContent = audioCopy;

    const feedback = document.querySelector('[data-feedback]');
    feedback.textContent = engineReady ? state.text : '核心学习运行时没有加载，当前画面不能用于验收。';
    feedback.dataset.tone = engineReady ? state.tone : 'error';
    feedback.hidden = engineReady ? !state.text : false;

    const answers = document.querySelectorAll('[data-answer-grid] button');
    answers.forEach((button, index) => {
      const answer = presentation.answers[index];
      button.dataset.answer = answer.id;
      button.querySelector('b').textContent = answer.title;
      button.querySelector('span').textContent = answer.subtitle;
    });

    document.querySelector('[data-landmark-source]').srcset = `/assets/adventure-map/lesson49/states/state-${buildStage}-768.avif`;
    document.querySelector('[data-landmark-image]').src = `/assets/adventure-map/lesson49/states/state-${buildStage}-768.webp`;
    document.querySelectorAll('[data-beat-progress] li').forEach((item, index) => {
      const complete = index < buildStage;
      const current = buildStage < 5 && index === buildStage;
      item.dataset.complete = String(complete);
      item.dataset.current = String(current);
      item.toggleAttribute('aria-current', current);
      if (current) item.setAttribute('aria-current', 'step');
      item.setAttribute(
        'aria-label',
        `第${index + 1}幕，${current ? '当前' : (complete ? '已完成' : '未开始')}`
      );
    });
    setPressed('beat', model.beat);
    setPressed('state', model.state);
    setPressed('viewport', model.viewport);
    setPressed('microstep', model.microstep);
    setPressed('motion', model.motion);
  }

  function selectFixture(key, value) {
    model = { ...model, [key]: value };
    replaceQuery();
    render();
  }

  function bindControl(group, key) {
    const control = document.querySelector(`[data-${group}-controls]`);
    control?.addEventListener('click', event => {
      const button = event.target.closest('button[data-value]');
      if (button) selectFixture(key, button.dataset.value);
    });
    control?.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const buttons = [...control.querySelectorAll('button[data-value]')];
      const current = Math.max(0, buttons.indexOf(document.activeElement));
      let next = current;
      if (event.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length;
      if (event.key === 'ArrowRight') next = (current + 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      event.preventDefault();
      buttons[next].focus();
      buttons[next].click();
    });
  }

  function setImmersive(active) {
    root.dataset.immersive = String(active);
    if (active) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.querySelector('[data-immersive-exit]')?.focus();
      return;
    }
    document.body.style.overflow = previousBodyOverflow;
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    document.querySelector('[data-immersive-toggle]')?.focus();
  }

  bindControl('beat', 'beat');
  bindControl('state', 'state');
  bindControl('viewport', 'viewport');
  bindControl('microstep', 'microstep');
  bindControl('motion', 'motion');
  document.querySelector('[data-answer-grid]')?.addEventListener('click', event => {
    const button = event.target.closest('button[data-answer]');
    if (!button) return;
    selectFixture('state', button.dataset.answer === latestScenario?.answerKey ? 'correct' : 'first-error');
  });
  document.querySelector('[data-immersive-toggle]')?.addEventListener('click', () => {
    setImmersive(true);
    root.requestFullscreen?.().catch(() => {});
  });
  document.querySelector('[data-immersive-exit]')?.addEventListener('click', () => setImmersive(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && root.dataset.immersive === 'true') setImmersive(false);
    if (event.key.toLowerCase() === 'f' && event.target === document.body) {
      setImmersive(root.dataset.immersive !== 'true');
    }
  });

  render();
})();
