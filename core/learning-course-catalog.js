'use strict';
// Authoring data is independent of the retired course catalog and renderers.
const course = require('../content/learning-course.json');
const textbookSources = require('../content/textbook-sources.json');
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
freeze(course); freeze(textbookSources);
function getCourse() { return course; }

  function validateCourse(course = getCourse()) {
    const errors = [], seen = new Set(), allRefs = new Set();
    const fail = text => errors.push(text);
    const lessonIds = course.lessonIds || [];
    if (!lessonIds.length || lessonIds.length % 2 || lessonIds.some((id,index)=>id!==index+1)) fail('continuous textbook lessons starting at 1 required');
    const expectedPairs = Array.from({length:Math.floor(lessonIds.length/2)},(_,index)=>[index*2+1,index*2+2]);
    if (JSON.stringify(course.chapters.map(chapter=>chapter.lessonIds)) !== JSON.stringify(expectedPairs)) fail('textbook Lesson pair sections required');
    if (new Set(course.chapters.map(chapter=>chapter.id)).size !== course.chapters.length) fail('duplicate Lesson section');
    for (const node of course.nodes) {
      if (!course.chapters.some(chapter=>chapter.id===node.chapterId)) fail('missing Lesson section '+node.id);
      if (!node.lessonIds?.length || node.lessonIds.some(id=>!lessonIds.includes(id))) fail('invalid Lesson scope '+node.id);
      if (seen.has(node.id)) fail('duplicate node '+node.id); seen.add(node.id);
      if (!node.activityIds.length) fail('empty node '+node.id);
      for (const id of node.activityIds) {
        const activity=course.activities[id];
        if (!activity || activity.embeddedIn || activity.nodeId !== node.id) fail('invalid node activity '+id);
      }
    }
    const spoken = [];
    for (const [id,act] of Object.entries(course.activities)) {
      if (id !== act.id || !['choice','teach','match','order','cloze','exercise','interactive-story'].includes(act.kind)) fail('unknown activity '+id);
      if(act.kind==='exercise')errors.push(...require('./learning-exercises').validate(act,course));
      const refs=[...act.sourceRefs,...(act.noteRefs||[]),...(act.instructionRefs||[]),...(act.meaningRefs||[]),...(act.guideRef?[act.guideRef]:[])];
      for (const ref of refs) { allRefs.add(ref); if (!course.sources[ref]) fail('missing source '+ref); }
      for (const entry of [...act.requiredAudio,...act.feedbackAudio]) if (!course.sources[entry.ref]?.audioSrc) fail('missing audio '+entry.ref);
      if (act.resultId && (!act.assessment || !['match','exercise'].includes(act.kind) && (!act.answer.length || act.answer.some(x=>!act.options.some(o=>o.id===x))))) fail('invalid answer '+id);
      if(act.kind==='input' && (!['gap','translation'].includes(act.taskKind)||!act.answers?.length||act.answers.some(x=>typeof x!=='string'||!x.trim())||!act.assessment.grammarSkillId))fail('invalid input activity '+id);
      if (act.options?.some(o=>o.type==='image'&&!course.entities[o.entityId])) fail('missing answer image '+id);
      if (act.kind==='teach' && (act.playbackMode!=='manual-cards'||!act.items.length||act.items.some(item=>!course.sources[item.sourceRef]?.audioSrc||(item.presentation==='text' ? !item.caption : !course.entities[item.entityId])))) fail('invalid teaching cards '+id);
      if (act.sceneEntityId && course.entities[act.sceneEntityId]?.presentation!=='scene') fail('invalid teaching scene '+id);
      if (act.embeddedIn && !course.activities[act.embeddedIn]?.beats?.some(beat=>beat.kind==='checkpoint'&&beat.activityId===id)) fail('unreachable story check '+id);
      if (act.kind==='interactive-story') {
        for (const id of act.actorEntityIds) {
          const actor=course.entities[id];
          if (actor?.facing && actor.align && actor.facing===actor.align) fail('story actor must face the other speaker '+id);
        }
        const beatIds = new Set();
        for (const beat of act.beats) {
          if (beatIds.has(beat.id)) fail('duplicate story beat '+beat.id); beatIds.add(beat.id);
          if (beat.kind==='line') {
            spoken.push(beat.ref);
            if (!course.sources[beat.ref]?.audioSrc) fail('silent story line '+beat.ref);
            if (course.entities[beat.actorEntityId]?.characterSpecies!=='cat') fail('story actor must be cat '+beat.actorEntityId);
            const expected=course.sourceActors[beat.ref];
            if (expected && expected!==beat.actorEntityId) fail('wrong speaker '+beat.ref);
          } else if (course.activities[beat.activityId]?.embeddedIn!==id) fail('orphan story check '+beat.activityId);
          if (beat.visibleActorIds && (beat.visibleActorIds.length>3 || beat.visibleActorIds.some(x=>!act.actorEntityIds.includes(x)))) fail('invalid visible cast '+beat.id);
        }
      }
    }
    for (const ref of course.dialogueRefs) if (spoken.filter(x=>x===ref).length!==1) fail('original dialogue must occur once '+ref);
    for (const [ref,source] of Object.entries(textbookSources)) {
      if (course.sources[ref]?.text!==source.text) fail('textbook text changed '+ref);
    }
    if (!course.nodes.some(n=>n.kind==='review'&&n.lessonIds.length>2)) fail('cross-lesson review required');
    errors.push(...require('./learning-challenges').validateDefinitions(course));
    errors.push(...require('./learning-placement').validateDefinitions(course));
    return errors;
  }
module.exports = Object.freeze({ getCourse, validateCourse });
