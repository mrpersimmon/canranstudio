(function (root, factory) {
  'use strict';
  const rules = factory();
  if (typeof module === 'object' && module.exports) module.exports = rules;
  else (root.CanranCore ||= {}).awardRules = rules;
})(globalThis, function () {
  'use strict';
  const record = value => value && typeof value === 'object' && !Array.isArray(value);
  const signature = value => JSON.stringify(value, (key, item) => key === 'hint' ? undefined
    : typeof item === 'string' ? item.replace(/^\/lesson\/(?=assets\/)/, '/') : item);

  // A completed round is the unit of evidence. Historical question records,
  // completion stars, and a corrected answer cannot substitute for this proof.
  function validClaim(unit, zone, claim) {
    const questions = unit.questions[zone];
    if (!unit.reward?.zones.some(item => item.id === zone) || !questions?.length || !record(claim) ||
        claim.edition !== unit.reward.edition || claim.roundPolicy !== unit.reward.edition ||
        typeof claim.runId !== 'string' || !claim.runId || claim.runId.length > 100 ||
        claim.index !== questions.length || !Array.isArray(claim.states) || claim.states.length !== questions.length) return false;
    try {
      if (signature(JSON.parse(claim.contentSignature)) !== signature([unit.version ?? null, questions])) return false;
    } catch { return false; }
    return questions.every((q, i) => {
      const state = claim.states[i];
      if (!record(state) || state.runId !== claim.runId || state.questionId !== q.id ||
          state.attempts !== 1 || state.firstCorrect !== true || state.checked !== true ||
          state.correct !== true || state.selection !== q.answer) return false;
      if (q.type === 'order' || q.type === 'wordbank') {
        const count = q.type === 'order' ? q.tokens.length : q.slots;
        return Array.isArray(state.tokens) && state.tokens.length === count &&
          new Set(state.tokens).size === count &&
          state.tokens.every(index => Number.isInteger(index) && index >= 0 && index < q.tokens.length) &&
          state.tokens.map(index => q.tokens[index]).join(' ') === q.answer;
      }
      if (q.type === 'cloze') return Array.isArray(state.fills) && state.fills.length === q.blanks.length &&
        state.fills.every((value, i) => q.blanks[i].options.includes(value)) && JSON.stringify(state.fills) === q.answer;
      if (q.type === 'match') return Array.isArray(state.pairs) && state.pairs.length === q.pairs.length &&
        new Set(state.pairs).size === q.pairs.length && state.pairs.every(id => q.pairs.some(pair => pair.id === id)) &&
        JSON.stringify(state.pairs) === q.answer;
      // Unsupported input types must not throw or earn unverified rewards.
      return ['choice', 'locate', 'scene-find'].includes(q.type || 'choice') && Array.isArray(q.options) && q.options.includes(state.selection);
    });
  }
  return { validClaim };
});
