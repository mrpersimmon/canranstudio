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
    if (course.lessonIds.join(',') !== '1,2,3,4,5,6') fail('first six textbook lessons required');
    if (JSON.stringify(course.chapters.map(chapter=>chapter.lessonIds)) !== '[[1,2],[3,4],[5,6]]') fail('textbook Lesson pair sections required');
    for (const node of course.nodes) {
      if (!course.chapters.some(chapter=>chapter.id===node.chapterId)) fail('missing Lesson section '+node.id);
      if (seen.has(node.id)) fail('duplicate node '+node.id); seen.add(node.id);
      if (!node.activityIds.length) fail('empty node '+node.id);
      for (const id of node.activityIds) {
        const activity=course.activities[id];
        if (!activity || activity.embeddedIn || activity.nodeId !== node.id) fail('invalid node activity '+id);
      }
    }
    const spoken = [];
    for (const [id,act] of Object.entries(course.activities)) {
      if (id !== act.id || !['choice','teach','match','order','cloze','interactive-story'].includes(act.kind)) fail('unknown activity '+id);
      const refs=[...act.sourceRefs,...(act.noteRefs||[]),...(act.instructionRefs||[]),...(act.meaningRefs||[]),...(act.guideRef?[act.guideRef]:[])];
      for (const ref of refs) { allRefs.add(ref); if (!course.sources[ref]) fail('missing source '+ref); }
      for (const entry of [...act.requiredAudio,...act.feedbackAudio]) if (!course.sources[entry.ref]?.audioSrc) fail('missing audio '+entry.ref);
      if (act.resultId && (!act.assessment || act.kind!=='match' && (!act.answer.length || act.answer.some(x=>!act.options.some(o=>o.id===x))))) fail('invalid answer '+id);
      if (act.options?.some(o=>o.type==='image'&&!course.entities[o.entityId])) fail('missing answer image '+id);
      if (act.kind==='teach' && (act.playbackMode!=='manual-cards'||act.items.some(item=>!course.sources[item.sourceRef]?.audioSrc||!course.entities[item.entityId]))) fail('invalid teaching cards '+id);
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
    return errors;
  }
module.exports = Object.freeze({ getCourse, validateCourse });
