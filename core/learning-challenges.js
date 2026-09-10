(function attach(root, factory) {
  'use strict';
  const api = factory(typeof module === 'object' && module.exports ? require('./learning-exercises') : root.CanranCore.learningExercises);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) (root.CanranCore ||= {}).learningChallenges = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (exercises) {
  'use strict';
  const object = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  // Forgive presentation differences, never missing words or changed grammar.
  function normalize(value) {
    return String(value).normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'")
      .replace(/[.,!?;:。]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function accepts(question, value) {
    if(question.kind==='exercise')return exercises.accepts(question,value);
    const answer = normalize(value);
    return Boolean(answer) && question.answers.some(candidate => normalize(candidate) === answer);
  }
  function validProgress(progress, challenge, unit) {
    if(challenge.questions[0]?.kind==='exercise'){
      const offset=progress?.legacyCount||0,qs=challenge.questions;
      if(!object(progress)||!Number.isSafeInteger(offset)||offset<0||offset>qs.length||!Array.isArray(progress.answers)||offset+progress.answers.length>qs.length)return false;
      if(!progress.answers.every((a,i)=>a?.questionId===qs[offset+i].id&&a.answerPolicyVersion===3&&exercises.accepts(qs[offset+i],a.value)&&exercises.ready(qs[offset+i],a.value,a.heardRefs)&&JSON.stringify(a.assessment)===JSON.stringify(qs[offset+i].assessment)&&['independent','supported'].includes(a.evidence)&&typeof a.at==='string'))return false;
      if(progress.completedAt!==undefined&&typeof progress.completedAt!=='string')return false;
      if(Boolean(progress.completedAt)!==(offset+progress.answers.length===qs.length))return false;
      const d=progress.draft,q=qs[offset+progress.answers.length];
      return !d||q&&d.questionId===q.id&&exercises.valid(q,d.value)&&Number.isSafeInteger(d.wrong)&&d.wrong>=0&&typeof d.hintUsed==='boolean';
    }
    const historical = unit?.history?.challenges.find(c => c.id === challenge.id);
    const gradedQuestion = (answer, i) => (answer.answerPolicyVersion || 1) === 1 && historical ? historical.questions[i] : challenge.questions[i];
    if (!object(progress) || !Array.isArray(progress.answers) || progress.answers.length > challenge.questions.length) return false;
    if (!progress.answers.every((answer, i) => object(answer) && answer.questionId === challenge.questions[i].id
      && (answer.answerPolicyVersion === undefined || [1,unit?.answerPolicyVersion].includes(answer.answerPolicyVersion))
      && typeof answer.value === 'string' && gradedQuestion(answer,i) && accepts(gradedQuestion(answer,i), answer.value)
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
        if(q.kind==='exercise'){
          if(questionIds.has(q.id))errors.push('duplicate exercise '+q.id);
          questionIds.add(q.id);errors.push(...exercises.validate(q,unit));continue;
        }
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
  function reviewQuestion(unit, entry) {
    if(entry.origin==='activity')return unit.activities[entry.questionId];
    if(entry.origin==='grammar')return unit.grammar?.delayedQuestions.find(q=>q.id===entry.questionId);
    const original=unit.challenges?.find(c=>c.id===entry.challengeId)?.questions.find(q=>q.id===entry.questionId);
    return original && (unit.grammar?.delayedQuestions.find(q=>q.grammarSkillId===original.grammarSkillId) || original);
  }
  function validReviews(record,unit) {
    if(record.retrievalReviews===undefined)return true;
    return object(record.retrievalReviews) && Object.entries(record.retrievalReviews).every(([id,e])=>object(e) && id===e.questionId && ['grammar','challenge','activity'].includes(e.origin)
      && reviewQuestion(unit,e) && /^\d{4}-\d{2}-\d{2}$/.test(e.nextDueDay) && Number.isSafeInteger(e.intervalStage) && e.intervalStage>=0 && e.intervalStage<unit.review.intervals.length
      && Number.isSafeInteger(e.wrong) && e.wrong>=0 && validErrors(e.errors)
      && (e.lastEvidence===undefined || ['independent','supported'].includes(e.lastEvidence))
      && (e.lastQuestionId===undefined || e.lastQuestionId===reviewQuestion(unit,e).id && accepts(reviewQuestion(unit,e),e.lastAnswer) && e.lastAnswerPolicyVersion===unit.answerPolicyVersion));
  }
  function validErrors(errors) {
    return Array.isArray(errors) && errors.length<=5 && errors.every(error=>object(error) && (typeof error.value==='string' ? error.value.length<=180 : object(error.value)&&JSON.stringify(error.value).length<=4000) && typeof error.at==='string' && (error.code===undefined || typeof error.code==='string' && error.code.length<=80));
  }
  function scheduleReview(record, details) {
    const queue=record.retrievalReviews ||= {}, {questionId,nextDueDay,error,...identity}=details;
    const entry=queue[questionId] ||= {...identity,questionId,nextDueDay,intervalStage:0,wrong:0,errors:[]};
    if(error){entry.wrong++;entry.errors=[...entry.errors,error].slice(-5);entry.nextDueDay=nextDueDay;entry.intervalStage=0;}
    return entry;
  }
  return Object.freeze({normalize, accepts, validProgress, validateDefinitions, reviewQuestion, validReviews, validErrors, scheduleReview});
});
