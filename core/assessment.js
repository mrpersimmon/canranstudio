(function attachAssessment(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.assessment = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function assessmentFactory() {
  'use strict';

  function createAttempt() {
    return { firstTry: true, solved: false };
  }

  function submitAttempt(state, correct) {
    if (state.solved) {
      return { state: { ...state }, accepted: false, solved: true, scored: false };
    }
    if (correct) {
      return {
        state: { firstTry: state.firstTry, solved: true },
        accepted: true,
        solved: true,
        scored: state.firstTry
      };
    }
    return {
      state: { firstTry: false, solved: false },
      accepted: true,
      solved: false,
      scored: false
    };
  }

  function shuffleOptions(options, correctIndex, random = Math.random) {
    const entries = options.map((text, id) => ({
      id,
      text,
      correct: id === correctIndex
    }));
    for (let index = entries.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [entries[index], entries[swap]] = [entries[swap], entries[index]];
    }
    return entries;
  }

  return Object.freeze({ createAttempt, submitAttempt, shuffleOptions });
});
