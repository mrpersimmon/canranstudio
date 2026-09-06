(function attach(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) (root.CanranCore ||= {}).learningChallenges = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const object = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  // Forgive presentation differences, never missing words or changed grammar.
  function normalize(value) {
    return String(value).normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'")
      .replace(/[.,!?;:。]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function accepts(question, value) {
    const answer = normalize(value);
    return Boolean(answer) && question.answers.some(candidate => normalize(candidate) === answer);
  }
  function validProgress(progress, challenge) {
    if (!object(progress) || !Array.isArray(progress.answers) || progress.answers.length > challenge.questions.length) return false;
    if (!progress.answers.every((answer, i) => object(answer) && answer.questionId === challenge.questions[i].id
      && typeof answer.value === 'string' && accepts(challenge.questions[i], answer.value)
      && ['independent','supported'].includes(answer.evidence) && typeof answer.at === 'string')) return false;
    if (Boolean(progress.completedAt) !== (progress.answers.length === challenge.questions.length)) return false;
    if (progress.completedAt !== undefined && typeof progress.completedAt !== 'string') return false;
    if (progress.draft) {
      const draft = progress.draft;
      if (!object(draft) || draft.questionId !== challenge.questions[progress.answers.length]?.id || typeof draft.value !== 'string' || draft.value.length > 180
        || !Number.isSafeInteger(draft.wrong) || draft.wrong < 0 || typeof draft.hintUsed !== 'boolean') return false;
    }
    return true;
  }
  function validateDefinitions(unit) {
    const errors=[], ids=new Set(), questionIds=new Set();
    for(const c of unit.challenges || []) {
      if(ids.has(c.id) || !c.questions?.length || !unit.nodes.some(n=>n.id===c.unlockNodeId)
        || !c.nodeIds?.every(id=>unit.nodes.some(n=>n.id===id))) errors.push('invalid challenge '+c.id);
      ids.add(c.id);
      for(const q of c.questions || []) {
        if(questionIds.has(q.id) || !['translation','gap'].includes(q.kind) || !q.prompt || !q.hint
          || !unit.sources[q.sourceRef] || !unit.entities[q.actorId]
          || !Array.isArray(q.answers) || !q.answers.length || q.answers.some(a=>!normalize(a))) errors.push('invalid challenge question '+q.id);
        questionIds.add(q.id);
        const sentence = q.kind==='gap' ? q.prefix+q.answers[0]+q.suffix : q.answers[0];
        if(normalize(sentence)!==normalize(unit.sources[q.sourceRef]?.text)) errors.push('challenge answer differs from learned source '+q.id);
      }
    }
    return errors;
  }
  return Object.freeze({normalize, accepts, validProgress, validateDefinitions});
});
