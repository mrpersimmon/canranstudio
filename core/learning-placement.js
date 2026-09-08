(function attach(root, factory) {
  'use strict';
  const api = factory(typeof module === 'object' && module.exports ? require('./learning-challenges') : root.CanranCore.learningChallenges);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) (root.CanranCore ||= {}).learningPlacement = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (answers) {
  'use strict';
  const object = x => Boolean(x) && typeof x === 'object' && !Array.isArray(x);
  const cache = new WeakMap();
  function index(unit) {
    if (!cache.has(unit)) cache.set(unit, new Map((unit.placement?.questions || []).map(q => [q.id, q])));
    return cache.get(unit);
  }
  const question = (unit, id) => index(unit).get(id);
  const chapterIndex = (unit, id) => unit.chapters.findIndex(c => c.id === id);
  const boundary = (unit, id) => unit.nodes.findIndex(n => n.chapterId === id);
  function skippedUntil(unit, record) {
    return Math.max(0, ...Object.values(record?.placement?.attempts || {}).filter(a => a.status === 'passed').map(a => boundary(unit, a.targetId)));
  }
  function currentChapter(unit, record) {
    const skip = skippedUntil(unit, record);
    return unit.nodes.find((n, i) => i >= skip && !n.activityIds.every(id => record?.completed[id]))?.chapterId;
  }
  function eligible(unit, record, targetId) {
    return Boolean(unit.placement) && chapterIndex(unit, targetId) > chapterIndex(unit, currentChapter(unit, record))
      && Boolean(currentChapter(unit, record));
  }
  function seeded(seed) {
    let state = seed >>> 0;
    return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
  }
  function shuffle(items, random) {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  function sample(unit, fromId, targetId, seed) {
    const from = chapterIndex(unit, fromId), target = chapterIndex(unit, targetId), config = unit.placement;
    if (!config || from < 0 || target <= from) return [];
    const random = seeded(seed), selected = [], used = new Set();
    const pool = shuffle(config.questions, random).filter(q => chapterIndex(unit, q.chapterId) < target);
    const key = q => answers.normalize(unit.sources[q.sourceRef].text);
    const take = q => { if (q && !used.has(key(q))) { selected.push(q.id); used.add(key(q)); return true; } return false; };
    // Distribute anchors across the entire skipped range, always including its
    // last prerequisite chapter. A wide jump must not test only its easy start.
    function draw(lo, hi, count) {
      if (hi <= lo) return;
      const anchors = Math.min(hi - lo, count);
      const chapters = Array.from({length: anchors}, (_, i) => lo + Math.floor((i + 1) * (hi - lo) / anchors) - 1);
      const end = selected.length + count;
      for (const ci of shuffle(chapters, random)) take(pool.find(q => chapterIndex(unit, q.chapterId) === ci && !used.has(key(q))));
      for (const q of pool) if (selected.length < end && chapterIndex(unit, q.chapterId) >= lo && chapterIndex(unit, q.chapterId) < hi) take(q);
    }
    const total = config.questionCount;
    draw(from, target, from ? Math.ceil(total * config.skippedShare) : total);
    draw(0, from, total - selected.length);
    for (const q of pool) if (selected.length < total) take(q);
    return shuffle(selected, random);
  }
  function createAttempt(unit, record, targetId, seed, at) {
    if (!eligible(unit, record, targetId)) return null;
    const fromId = currentChapter(unit, record), questionIds = sample(unit, fromId, targetId, seed);
    if (questionIds.length !== unit.placement.questionCount) return null;
    return {version: unit.placement.version, id: at + ':' + seed, fromId, targetId, seed,
      questionIds, responses: [], cursor: 0, draft: '', status: 'active', startedAt: at};
  }
  const mistakes = attempt => attempt.responses.filter(r => !r.correct).length;
  function grade(unit, attempt, value, at) {
    if (attempt.status !== 'active' || attempt.responses.length !== attempt.cursor || !value.trim()) return null;
    const next = JSON.parse(JSON.stringify(attempt)), q = question(unit, next.questionIds[next.cursor]);
    next.responses.push({questionId:q.id, value:value.slice(0,180), correct:answers.accepts(q, value), at});
    next.draft = value.slice(0,180);
    if (mistakes(next) === unit.placement.maxMistakes) next.status = 'failed';
    else if (next.responses.length === next.questionIds.length) next.status = 'passed';
    if (next.status !== 'active') { next.cursor = next.responses.length; next.finishedAt = at; next.draft = ''; }
    return next;
  }
  function validAttempt(a, unit, targetId) {
    if (!object(a) || a.version !== unit.placement?.version || a.targetId !== targetId || typeof a.id !== 'string'
      || typeof a.startedAt !== 'string' || !Number.isSafeInteger(a.seed) || a.seed < 0 || a.seed > 4294967295
      || !Array.isArray(a.questionIds) || !Array.isArray(a.responses) || !Number.isInteger(a.cursor)
      || typeof a.draft !== 'string' || a.draft.length > 180) return false;
    if (JSON.stringify(a.questionIds) !== JSON.stringify(sample(unit,a.fromId,a.targetId,a.seed))
      || a.questionIds.length !== unit.placement.questionCount || a.responses.length > a.questionIds.length) return false;
    if (!a.responses.every((r,i) => object(r) && r.questionId === a.questionIds[i] && typeof r.value === 'string'
      && r.value.length <= 180 && Boolean(r.value.trim()) && typeof r.at === 'string'
      && r.correct === answers.accepts(question(unit,r.questionId),r.value))) return false;
    const wrong = mistakes(a), expected = wrong >= unit.placement.maxMistakes ? 'failed' : a.responses.length === a.questionIds.length ? 'passed' : 'active';
    if (a.status !== expected || wrong > unit.placement.maxMistakes
      || a.responses.slice(0,-1).filter(r=>!r.correct).length >= unit.placement.maxMistakes) return false;
    if (expected === 'active') return a.finishedAt === undefined && (a.cursor === a.responses.length || a.cursor === a.responses.length - 1 && a.draft === a.responses.at(-1).value) && a.cursor >= 0;
    return typeof a.finishedAt === 'string' && a.cursor === a.responses.length && a.draft === '';
  }
  function validProgress(value, unit) {
    return Boolean(unit.placement) && object(value) && object(value.attempts) && Object.entries(value.attempts).every(([id,a]) => validAttempt(a,unit,id));
  }
  function validateDefinitions(unit) {
    if (!unit.placement) return [];
    const p = unit.placement, errors = [], ids = new Set();
    if (p.version !== 1 || p.questionCount !== 20 || p.maxMistakes !== 5 || p.skippedShare !== .7) errors.push('invalid placement rules');
    for (const q of p.questions || []) {
      if (ids.has(q.id) || !['translation','gap'].includes(q.kind) || !q.prompt || !unit.entities[q.actorId]
        || chapterIndex(unit,q.chapterId)<0 || !unit.sources[q.sourceRef] || !Array.isArray(q.answers) || !q.answers.length
        || q.answers.some(a=>typeof a!=='string'||!answers.normalize(a))) { errors.push('invalid placement question '+q.id); continue; }
      ids.add(q.id);
      if ((q.answerType !== undefined && q.answerType !== 'word')
        || (q.answerType === 'word' && (q.kind !== 'translation' || q.answers.some(a=>/\s/.test(a.trim())))))
        errors.push('invalid placement answer type '+q.id);
      const sentence = q.kind === 'gap' ? q.prefix + q.answers[0] + q.suffix : q.answers[0];
      if (answers.normalize(sentence) !== answers.normalize(unit.sources[q.sourceRef].text)) errors.push('placement answer differs from source '+q.id);
      const lesson=unit.sources[q.sourceRef].lessonId||Number(q.sourceRef.match(/^L(\d+)-/)?.[1]);
      if (lesson && lesson>unit.chapters[chapterIndex(unit,q.chapterId)].lessonIds.at(-1)) errors.push('placement source from a future chapter '+q.id);
    }
    for (const c of unit.chapters.slice(1)) if (sample(unit,unit.chapters[0].id,c.id,37).length !== p.questionCount) errors.push('placement pool too small '+c.id);
    return errors;
  }
  return Object.freeze({question,sample,eligible,createAttempt,grade,mistakes,validProgress,validateDefinitions,skippedUntil,currentChapter});
});
