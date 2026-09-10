(function attach(root, factory) {
  'use strict';
  const api = factory(typeof module === 'object' && module.exports ? require('./learning-challenges') : root.CanranCore.learningChallenges);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) (root.CanranCore ||= {}).learningPlacement = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (answers) {
  'use strict';
  const object = x => Boolean(x) && typeof x === 'object' && !Array.isArray(x);
  const cache = new WeakMap();
  const exercises=typeof module==='object'&&module.exports?require('./learning-exercises'):globalThis.CanranCore.learningExercises;
  function config(unit, version = unit.placement?.version) {
    return version === unit.placement?.version ? unit.placement : version === unit.history?.placement.version ? unit.history.placement : version===unit.keyboardHistory?.placement.version?unit.keyboardHistory.placement:null;
  }
  function index(unit, version) {
    const definition = config(unit, version);
    if (!definition) return new Map();
    if (!cache.has(definition)) cache.set(definition, new Map(definition.questions.map(q => [q.id, q])));
    return cache.get(definition);
  }
  const question = (unit, id, version) => index(unit, version).get(id);
  const chapterIndex = (unit, id) => unit.chapters.findIndex(c => c.id === id);
  const boundary = (unit, id) => unit.nodes.findIndex(n => n.chapterId === id);
  function skippedUntil(unit, record) {
    return Math.max(0, ...Object.values(record?.placement?.attempts || {}).filter(a => a.status === 'passed').map(a => boundary(unit, a.targetId)));
  }
  function currentChapter(unit, record) {
    const skip = skippedUntil(unit, record);
    return unit.nodes.find((n, i) => i >= skip && !record?.legacyCompletedNodes?.[n.id] && !record?.importedCompletedNodes?.[n.id] && !n.activityIds.every(id => record?.completed[id]))?.chapterId;
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
  function sample(unit, fromId, targetId, seed, version = unit.placement?.version) {
    const from = chapterIndex(unit, fromId), target = chapterIndex(unit, targetId), rules = config(unit, version);
    if (!rules || from < 0 || target <= from) return [];
    const random = seeded(seed), selected = [], used = new Set();
    const eligible = q => chapterIndex(unit, q.chapterId) < target;
    // v1 order is frozen for historical attempts. v2 excludes future questions
    // before shuffling, so later chapters cannot alter earlier tests.
    const pool = version === 1 ? shuffle(rules.questions, random).filter(eligible) : shuffle(rules.questions.filter(eligible), random);
    const key = q => answers.normalize(version===1 && unit.history?.placementSourceText?.[q.sourceRef] || unit.sources[q.sourceRef].text);
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
    const total = rules.questionCount;
    if(version>=2) for(const skill of unit.grammar?.skills || [])take(pool.find(q=>q.grammarSkillId===skill.id));
    if(version>=3){
      // Use distinct available mechanisms without displacing range or target anchors.
      for(const mechanism of [...new Set(pool.map(q=>q.mechanism))].slice(0,3)){
        if(selected.some(id=>question(unit,id,version).mechanism===mechanism))continue;
        take(pool.find(q=>q.mechanism===mechanism&&chapterIndex(unit,q.chapterId)>=from&&!used.has(key(q)))||pool.find(q=>q.mechanism===mechanism&&!used.has(key(q))));
      }
    }
    const selectedSkipped=selected.filter(id=>chapterIndex(unit,question(unit,id,version).chapterId)>=from).length;
    draw(from, target, Math.max(0,(from ? Math.ceil(total * rules.skippedShare) : total)-selectedSkipped));
    draw(0, from, Math.max(0,total - selected.length));
    for (const q of pool) if (selected.length < total) take(q);
    return shuffle(selected, random);
  }
  function createAttempt(unit, record, targetId, seed, at) {
    if (!eligible(unit, record, targetId)) return null;
    const fromId = currentChapter(unit, record), questionIds = sample(unit, fromId, targetId, seed);
    if (questionIds.length !== unit.placement.questionCount) return null;
    return {version: unit.placement.version, id: at + ':' + seed, fromId, targetId, seed,
      questionIds, responses: [], cursor: 0, draft: unit.placement.version>=3?exercises.empty():'', status: 'active', startedAt: at};
  }
  const mistakes = attempt => attempt.responses.filter(r => !r.correct).length;
  function grade(unit, attempt, value, at, heard=[]) {
    if(attempt.version>=3){
      const q=question(unit,attempt.questionIds[attempt.cursor],attempt.version);
      if(attempt.status!=='active'||attempt.responses.length!==attempt.cursor||!q||!exercises.ready(q,value,heard))return null;
      const next=JSON.parse(JSON.stringify(attempt));
      next.responses.push({questionId:q.id,value:JSON.parse(JSON.stringify(value)),correct:exercises.accepts(q,value),answerPolicyVersion:3,...(q.priorOrderTexts?{wordBankVersion:2}:{}),assessment:q.assessment,heardRefs:[...heard],at});next.draft=value;
      if(mistakes(next)===unit.placement.maxMistakes)next.status='failed';
      else if(next.responses.length===next.questionIds.length)next.status='passed';
      if(next.status!=='active'){next.cursor=next.responses.length;next.finishedAt=at;next.draft=exercises.empty();}
      return next;
    }
    if (attempt.status !== 'active' || attempt.responses.length !== attempt.cursor || typeof value!=='string'||!value.trim()) return null;
    const next = JSON.parse(JSON.stringify(attempt));
    const policyVersion=unit.answerPolicyVersion===unit.placement.version?unit.answerPolicyVersion:next.version;
    const q = question(unit, next.questionIds[next.cursor],policyVersion);
    next.responses.push({questionId:q.id, value:value.slice(0,180), correct:answers.accepts(q, value), answerPolicyVersion:policyVersion, at});
    next.draft = value.slice(0,180);
    if (mistakes(next) === unit.placement.maxMistakes) next.status = 'failed';
    else if (next.responses.length === next.questionIds.length) next.status = 'passed';
    if (next.status !== 'active') { next.cursor = next.responses.length; next.finishedAt = at; next.draft = ''; }
    return next;
  }
  function validAttempt(a, unit, targetId) {
    if(a?.version>=3){
      if(!object(a)||a.version!==unit.placement.version||a.targetId!==targetId||typeof a.id!=='string'||typeof a.startedAt!=='string'||!Number.isSafeInteger(a.seed)||a.seed<0||a.seed>4294967295||!Array.isArray(a.questionIds)||!Array.isArray(a.responses)||!Number.isInteger(a.cursor))return false;
      if(JSON.stringify(a.questionIds)!==JSON.stringify(sample(unit,a.fromId,a.targetId,a.seed,a.version))||a.questionIds.length!==20||a.responses.length>20)return false;
      if(!a.responses.every((r,i)=>{
        const q=question(unit,a.questionIds[i],3);
        if(!r||r.wordBankVersion!==undefined&&(r.wordBankVersion!==2||!q.priorOrderTexts))return false;
        const graded=q.priorOrderTexts&&r.wordBankVersion===undefined?{...q,options:q.options.map((o,j)=>({...o,text:q.priorOrderTexts[j]}))}:q;
        return r.questionId===q.id&&r.answerPolicyVersion===3&&typeof r.at==='string'&&exercises.ready(q,r.value,r.heardRefs)&&r.correct===exercises.accepts(graded,r.value)&&JSON.stringify(r.assessment)===JSON.stringify(q.assessment);
      }))return false;
      const wrong=mistakes(a),expected=wrong>=5?'failed':a.responses.length===20?'passed':'active';
      if(a.status!==expected||wrong>5||a.responses.slice(0,-1).filter(r=>!r.correct).length>=5)return false;
      if(expected==='active')return a.finishedAt===undefined&&a.cursor>=0&&(a.cursor===a.responses.length||a.cursor===a.responses.length-1&&JSON.stringify(a.draft)===JSON.stringify(a.responses.at(-1).value))&&exercises.valid(question(unit,a.questionIds[a.cursor],3),a.draft);
      return typeof a.finishedAt==='string'&&a.cursor===a.responses.length&&JSON.stringify(a.draft)===JSON.stringify(exercises.empty());
    }
    if (!object(a) || !config(unit, a.version) || a.targetId !== targetId || typeof a.id !== 'string'
      || typeof a.startedAt !== 'string' || !Number.isSafeInteger(a.seed) || a.seed < 0 || a.seed > 4294967295
      || !Array.isArray(a.questionIds) || !Array.isArray(a.responses) || !Number.isInteger(a.cursor)
      || typeof a.draft !== 'string' || a.draft.length > 180) return false;
    if (JSON.stringify(a.questionIds) !== JSON.stringify(sample(unit,a.fromId,a.targetId,a.seed,a.version))
      || a.questionIds.length !== unit.placement.questionCount || a.responses.length > a.questionIds.length) return false;
    if (!a.responses.every((r,i) => object(r) && r.questionId === a.questionIds[i] && typeof r.value === 'string'
      && r.value.length <= 180 && Boolean(r.value.trim()) && typeof r.at === 'string'
      && question(unit,r.questionId,r.answerPolicyVersion ?? a.version)
      && r.correct === answers.accepts(question(unit,r.questionId,r.answerPolicyVersion ?? a.version),r.value))) return false;
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
    if (![1,2,3].includes(p.version) || p.questionCount !== 20 || p.maxMistakes !== 5 || p.skippedShare !== .7) errors.push('invalid placement rules');
    for (const q of p.questions || []) {
      if(q.kind==='exercise'){
        if(ids.has(q.id)||chapterIndex(unit,q.chapterId)<0||['pairs','mission'].includes(q.mechanism))errors.push('invalid placement exercise '+q.id);
        ids.add(q.id);errors.push(...exercises.validate(q,unit));
        for(const ref of [...q.sourceRefs,...q.prerequisiteRefs,...q.listenRefs]){const s=unit.sources[ref],lesson=s?.lessonId||Number(ref.match(/^L(\d+)-/)?.[1]);if(lesson>unit.chapters[chapterIndex(unit,q.chapterId)].lessonIds.at(-1))errors.push('placement source from a future chapter '+q.id);}
        continue;
      }
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
