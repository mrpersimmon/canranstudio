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
    const preparedSources = new Map();
    let active = null;
    let generation = 0;

    function takePreparedAudio(src) {
      const prepared = preparedSources.get(src);
      if (!prepared) return null;
      preparedSources.delete(src);
      prepared.audio.removeEventListener('error', prepared.onError);
      return prepared.audio;
    }

    function preload(request = {}) {
      const src = String(request.src || '');
      if (!src || !AudioCtor || failedSources.has(src) || preparedSources.has(src)) return false;

      let audio;
      try {
        audio = new AudioCtor(src);
      } catch {
        failedSources.add(src);
        return false;
      }

      const onError = () => {
        const prepared = preparedSources.get(src);
        if (prepared?.audio !== audio) return;
        preparedSources.delete(src);
        failedSources.add(src);
        audio.removeEventListener('error', onError);
      };
      preparedSources.set(src, { audio, onError });
      audio.addEventListener('error', onError, { once: true });
      try {
        audio.preload = 'auto';
        audio.load?.();
      } catch {
        preparedSources.delete(src);
        audio.removeEventListener('error', onError);
        failedSources.add(src);
        return false;
      }
      return true;
    }

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
        audio = takePreparedAudio(session.src) || new AudioCtor(session.src);
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
      const requestGeneration = ++generation;
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
      stop('cancelled');
      if (generation !== requestGeneration) {
        finish(session, 'cancelled');
        return {
          cancel() {
            finish(session, 'cancelled');
          }
        };
      }
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
      preload,
      stop,
      isActive: () => active !== null
    });
  }

  return Object.freeze({ slugify, createAudioPlayer });
});
