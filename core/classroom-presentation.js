(function attachClassroomPresentation(root, factory) {
  'use strict';
  const api = factory(root || {});
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.classroomPresentation = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function classroomPresentationFactory(root) {
  'use strict';

  function requiredElement(documentRef, id) {
    const element = documentRef.getElementById(id);
    if (!element) throw new Error(`classroom presentation element missing: ${id}`);
    return element;
  }

  function mount({ course, audioPlayer, document: documentRef = root.document, window: view = root } = {}) {
    if (!course || course.presentation?.declaredStatus !== 'published') {
      throw new Error('published classroom presentation contract is required');
    }
    if (!audioPlayer || typeof audioPlayer.play !== 'function' || typeof audioPlayer.stop !== 'function') {
      throw new Error('classroom presentation audio player is required');
    }
    const steps = course.presentation.steps;
    if (!Array.isArray(steps) || steps.length === 0) {
      throw new Error('classroom presentation steps are required');
    }

    const stage = requiredElement(documentRef, 'presentationStage');
    const progress = requiredElement(documentRef, 'presentationProgress');
    const stepEyebrow = requiredElement(documentRef, 'stepEyebrow');
    const stepTitle = requiredElement(documentRef, 'stepTitle');
    const stepPrompt = requiredElement(documentRef, 'stepPrompt');
    const hint = requiredElement(documentRef, 'teacherHint');
    const hintCopy = requiredElement(documentRef, 'teacherHintCopy');
    const previous = requiredElement(documentRef, 'previousControl');
    const next = requiredElement(documentRef, 'nextControl');
    const audio = requiredElement(documentRef, 'audioControl');
    const hintControl = requiredElement(documentRef, 'hintControl');
    const fullscreen = requiredElement(documentRef, 'fullscreenControl');
    const exit = requiredElement(documentRef, 'exitPresentation');
    const audioStatus = requiredElement(documentRef, 'audioStatus');
    const modeStatus = requiredElement(documentRef, 'modeStatus');

    let index = 0;
    let hintVisible = false;
    let audioPlayed = false;
    let playbackToken = 0;

    exit.href = course.route;

    function currentStep() {
      return steps[index];
    }

    function stopAudio() {
      playbackToken += 1;
      audioPlayer.stop('cancelled');
    }

    function render({ focus = false } = {}) {
      const step = currentStep();
      documentRef.body.dataset.presentationStep = step.id;
      progress.textContent = `第 ${index + 1} / ${steps.length} 步`;
      stepEyebrow.textContent = step.eyebrow;
      stepTitle.textContent = step.title;
      stepPrompt.textContent = step.prompt;
      hintCopy.textContent = step.hint;
      hint.hidden = !hintVisible;
      hintControl.setAttribute('aria-expanded', String(hintVisible));
      hintControl.textContent = hintVisible ? '收起提示' : '显示提示';
      previous.disabled = index === 0;
      next.textContent = index === steps.length - 1 ? '回到开场' : '下一步';
      audio.textContent = audioPlayed ? '重播录音' : '播放录音';
      if (focus) stepTitle.focus({ preventScroll: true });
    }

    function move(delta) {
      stopAudio();
      if (delta > 0 && index === steps.length - 1) index = 0;
      else index = Math.max(0, Math.min(steps.length - 1, index + delta));
      hintVisible = false;
      audioPlayed = false;
      audioStatus.textContent = '';
      render({ focus: true });
    }

    function toggleHint() {
      hintVisible = !hintVisible;
      render();
    }

    function playAudio() {
      const step = currentStep();
      const token = ++playbackToken;
      audioPlayed = true;
      audioStatus.textContent = '正在播放课程录音…';
      render();
      audioPlayer.play({
        text: step.audioText,
        src: `/${step.audioAsset}`,
        rate: 0.85,
        onFinish(result) {
          if (token !== playbackToken) return;
          if (result.reason === 'ended' && !result.sourceFailed) {
            audioStatus.textContent = '播放完成，可以重播或继续下一步。';
          } else if (result.reason === 'ended' && result.sourceFailed) {
            audioStatus.textContent = '原录音未能播放，已使用浏览器语音；可以继续下一步。';
          } else if (result.reason !== 'cancelled') {
            audioStatus.textContent = '录音未能播放；可以继续下一步。';
          }
        }
      });
    }

    function fullscreenElement() {
      return documentRef.fullscreenElement || documentRef.webkitFullscreenElement || null;
    }

    function renderFullscreenState() {
      const active = Boolean(fullscreenElement());
      fullscreen.textContent = active ? '退出全屏' : '进入全屏';
      fullscreen.setAttribute('aria-pressed', String(active));
      if (active) modeStatus.textContent = '已进入全屏投屏。';
    }

    async function toggleFullscreen() {
      modeStatus.textContent = '';
      try {
        if (fullscreenElement()) {
          const leave = documentRef.exitFullscreen || documentRef.webkitExitFullscreen;
          if (!leave) throw new Error('fullscreen exit unavailable');
          await leave.call(documentRef);
        } else {
          const enter = documentRef.documentElement.requestFullscreen ||
            documentRef.documentElement.webkitRequestFullscreen;
          if (!enter) throw new Error('fullscreen unavailable');
          await enter.call(documentRef.documentElement);
        }
        renderFullscreenState();
      } catch {
        modeStatus.textContent = '当前浏览器未进入全屏，页面仍可继续投屏。';
        renderFullscreenState();
      }
    }

    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    hintControl.addEventListener('click', toggleHint);
    audio.addEventListener('click', playAudio);
    fullscreen.addEventListener('click', toggleFullscreen);
    exit.addEventListener('click', stopAudio);
    documentRef.addEventListener('fullscreenchange', renderFullscreenState);
    documentRef.addEventListener('webkitfullscreenchange', renderFullscreenState);
    view.addEventListener('pagehide', stopAudio, { once: true });
    documentRef.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target.closest?.('button, a, input, textarea, select')) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
      } else if (event.key.toLowerCase() === 'h') {
        event.preventDefault();
        toggleHint();
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFullscreen();
      } else if (event.key === ' ') {
        event.preventDefault();
        playAudio();
      }
    });

    render({ focus: true });
    renderFullscreenState();

    return Object.freeze({
      currentIndex: () => index,
      move,
      playAudio,
      toggleHint,
      toggleFullscreen
    });
  }

  return Object.freeze({ mount });
});
