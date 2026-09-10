(function attach(root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) (root.CanranCore ||= {}).learningPathRuntime = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';
  const challenges = typeof module === 'object' && module.exports ? require('./learning-challenges') : root.CanranCore.learningChallenges;
  const placement = typeof module === 'object' && module.exports ? require('./learning-placement') : root.CanranCore.learningPlacement;
  const clone = value => JSON.parse(JSON.stringify(value));
  function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const contractIndexes=new WeakMap();
  function contracts(unit) {
    if(!contractIndexes.has(unit)) contractIndexes.set(unit,{matches:Object.values(unit.activities).filter(a=>a.kind==='match'),stories:Object.values(unit.activities).filter(a=>a.kind==='interactive-story')});
    return contractIndexes.get(unit);
  }
  const object = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  function day(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  function addDays(today, days) {
    const date = new Date(`${today}T12:00:00`);
    date.setDate(date.getDate() + days);
    return day(date);
  }
  function emptyRecord(unit) {
    return { schema: unit.recordSchema, unitId: unit.unitId, experienceRevision: unit.experienceRevision,
      ...(unit.contractVersion ? {contractVersion:unit.contractVersion} : {}),
      completed: {}, results: {}, attempts: {}, roles: {}, roleTurns: {}, storyProgress: {}, storyFacts: {}, sourceContacts: {}, legacyFacts: null,
      ...(unit.courseId ? { reviewEvents: [], teachingProgress: {}, challenges: {} } : {}) };
  }
  function validPairs(pairs, activity, complete = false) {
    return object(pairs) && (!complete || Object.keys(pairs).length === activity.items.length)
      && Object.entries(pairs).every(([ref, value]) => activity.items.some(item => item.sourceRef === ref && item.entityId === value?.entityId)
        && ['matched-with-options', 'retry-supported', 'elimination-supported', 'modeled'].includes(value.evidence) && typeof value.at === 'string');
  }
  function validRecord(record, unit, allowBackup = true) {
    if (!object(record) || record.schema !== unit.recordSchema || record.unitId !== unit.unitId || record.experienceRevision !== unit.experienceRevision) return false;
    if(record.contractVersion!==undefined && ![1,unit.contractVersion].includes(record.contractVersion))return false;
    if(record.completedNodeContracts!==undefined && (!object(record.completedNodeContracts)||Object.entries(record.completedNodeContracts).some(([id,version])=>version!==1||!unit.history?.nodes[id]?.every(aid=>record.completed?.[aid]))))return false;
    if (!['completed', 'results', 'attempts', 'roles', 'storyFacts', 'sourceContacts'].every(key => object(record[key]))) return false;
    if (!Object.entries(record.completed).every(([id, value]) => unit.activities[id] && object(value) && typeof value.at === 'string')) return false;
    if (!Object.entries(record.attempts).every(([id, value]) => unit.activities[id]?.resultId && object(value) && Number.isSafeInteger(value.wrong) && value.wrong >= 0 && typeof value.hintUsed === 'boolean')) return false;
    if (!Object.entries(record.attempts).every(([id,value])=>unit.activities[id].kind!=='input' || (value.value===undefined || typeof value.value==='string' && value.value.length<=180) && (value.errors===undefined || challenges.validErrors(value.errors)))) return false;
    if (!Object.entries(record.results).every(([id, value]) => unit.activities[value?.activityId]?.resultId === id && ['independent', 'supported', 'modeled'].includes(value.initialEvidence) && Number.isSafeInteger(value.intervalStage) && /^\d{4}-\d{2}-\d{2}$/.test(value.nextDueDay))) return false;
    if (!Object.values(record.results).every(value=>unit.activities[value.activityId].kind!=='input' || typeof value.value==='string' && value.value.length<=180 && challenges.validErrors(value.errors))) return false;
    if (record.schema >= 3) {
      if (!Object.values(record.results).every(value => (value.contractVersion === undefined || [1,unit.contractVersion].includes(value.contractVersion)) && equal(value.assessment, (value.contractVersion || record.contractVersion || 1) === 1 && unit.history ? unit.history.assessments[value.activityId] : unit.activities[value.activityId].assessment))) return false;
      for (const a of contracts(unit).matches) {
        const attempt = record.attempts[a.id], result = record.results[a.resultId];
        if (attempt && (!validPairs(attempt.matchedPairs, a) || !object(attempt.wrongByRef)
          || !Object.entries(attempt.wrongByRef).every(([ref, count]) => a.items.some(item => item.sourceRef === ref) && Number.isSafeInteger(count) && count >= 0))) return false;
        if (result && !validPairs(result.pairs, a, true)) return false;
        if (record.completed[a.id] && !result) return false;
      }
    }
    if (record.schema >= 2 && record.schema < 4) {
      const role = Object.values(unit.activities).find(a => a.kind === 'role');
      if (!role || !object(record.roleTurns) || !Object.entries(record.roleTurns).every(([ref, value]) =>
        role.turns.some(turn => turn.ref === ref && turn.actorEntityId === value?.actorEntityId)
        && value.evidence === 'manual-audio-ended' && typeof value.at === 'string')) return false;
      const finished = role.turns.map(turn => Boolean(record.roleTurns[turn.ref]));
      const firstMissing = finished.indexOf(false);
      if (firstMissing >= 0 && finished.slice(firstMissing).some(Boolean)) return false;
      if (Boolean(record.completed[role.id]) !== finished.every(Boolean)) return false;
    }
    if (record.schema >= 4) {
      if (!object(record.storyProgress) || !object(record.roleTurns) || Object.keys(record.roleTurns).length) return false;
      if (Object.keys(record.storyProgress).some(id => unit.activities[id]?.kind !== 'interactive-story')) return false;
      for (const story of contracts(unit).stories) {
        const progress = record.storyProgress[story.id];
        if (progress && !object(progress.beats)) return false;
        const beats = progress?.beats || {}, ids = Object.keys(beats);
        if (ids.some(id => !story.beats.some(beat => beat.id === id))) return false;
        let missing = false;
        for (const beat of story.beats) {
          const proof = beats[beat.id];
          if (!proof) missing = true;
          else if (missing || !object(proof) || typeof proof.at !== 'string' || proof.kind !== beat.kind) return false;
          if (beat.kind === 'line' && proof && (proof.ref !== beat.ref || proof.actorEntityId !== beat.actorEntityId || proof.evidence !== 'audio-ended')) return false;
          if (beat.kind === 'checkpoint') {
            const a = unit.activities[beat.activityId];
            if (!a || Boolean(proof) !== Boolean(record.completed[a.id]) || Boolean(proof) !== Boolean(record.results[a.resultId])) return false;
            if (proof && (proof.activityId !== a.id || proof.evidence !== 'answered')) return false;
          }
        }
        if (Boolean(record.completed[story.id]) !== (ids.length === story.beats.length)) return false;
      }
    }
    if (unit.courseId) {
      if (!challenges.validReviews(record,unit)) return false;
      if (!Array.isArray(record.reviewEvents) || !object(record.teachingProgress)) return false;
      if (record.reviewEvents.some(event => !unit.activities[event.activityId]?.resultId || !['independent','supported','modeled'].includes(event.evidence) || typeof event.at !== 'string')) return false;
      if (Object.entries(record.teachingProgress).some(([id, refs]) => unit.activities[id]?.kind !== 'teach' || !Array.isArray(refs) || refs.some(ref => !unit.activities[id].items.some(item => item.sourceRef === ref)))) return false;
      if (record.challenges !== undefined && (!object(record.challenges) || Object.entries(record.challenges).some(([id, value]) => {
        const definition = unit.challenges?.find(c => c.id === id);
        return !definition || !challenges.validProgress(value, definition, unit);
      }))) return false;
      if (record.resetBackup && (!allowBackup || typeof record.resetBackup.at !== 'string'
        || !validRecord(record.resetBackup.record, unit, false))) return false;
      if (record.placement !== undefined && (!placement || !placement.validProgress(record.placement,unit))) return false;
    }
    const roundIds = unit.legacyRolePractice.rounds.map(r => r.roundId);
    return Object.entries(record.roles).every(([id, value]) => roundIds.includes(id) && object(value) && ['completed', 'skipped'].includes(value.disposition));
  }
  function createRuntime({ unit, adapter, now = () => new Date(), random = Math.random, deferRead = false }) {
    if (!unit?.nodes?.length || !adapter?.load || !adapter?.commit) throw new TypeError('unit and durable adapter required');
    const storageKey = `poc:learning-path:${unit.unitId}:${unit.experienceRevision}`;
    let record, revision, pending = null, serial = 0, effects = [], recovery = null, draftPending = null;
    let view = { screen: 'map', saveState: null, mode: 'main', audio: null };
    let projection = null, publicRecord = null, projectedRecord = null, projectedDay = null;
    let queue = [], queueIndex = 0, extraIds = [], extraIndex = false;
    let localAttempts = {};
    // A settlement belongs to this visit, never to historical course totals.
    // Commit callbacks own scoring; retries and repeated renders cannot award twice.
    let session = null, activeSince = null, pageHidden = false;
    function beginSession() {
      session = { assessed: 0, independent: 0, streak: 0, bestStreak: 0, heardRefs: [], elapsedMs: 0, finished: false };
      activeSince = pageHidden ? null : now().getTime();
    }
    function clockSession(hidden = pageHidden, finish = false) {
      if (!session || session.finished) return;
      const time = now().getTime();
      if (activeSince !== null) session.elapsedMs += Math.max(0, time - activeSince);
      session.finished = finish;
      activeSince = hidden || finish ? null : time;
    }
    function scoreSession(independent) {
      if (!session || session.finished) return;
      session.assessed++;
      if (independent) session.independent++;
      session.streak = independent ? session.streak + 1 : 0;
      session.bestStreak = Math.max(session.bestStreak, session.streak);
    }
    const today = () => day(now());
    let journal = adapter.loadDraft?.(storageKey)?.value || null;
    function draftValue(kind, identity) {
      return journal?.baseRevision===revision && journal.kind===kind && journal.identity===identity && typeof journal.value==='string' && journal.value.length<=180 ? journal.value : null;
    }
    function writeDraft(kind, identity, value, after) {
      const next={baseRevision:revision,kind,identity,value:value.slice(0,180)};
      const result=adapter.saveDraft?.(storageKey,next);
      if (!result) {
        const full=clone(record);
        if(kind==='placement')full.placement.attempts[view.placementId].draft=next.value;
        else if(kind==='challenge')((full.challenges ||= {})[view.challengeId] ||= {answers:[]}).draft={questionId:challengeQuestion().id,value:next.value,wrong:view.challengeWrong,hintUsed:view.challengeHintUsed};
        else full.attempts[view.activityId]={wrong:view.wrong,hintUsed:view.hintUsed,value:next.value};
        save(full,after);return;
      }
      if (result.status!=='ok') {draftPending={kind,identity,value,after};view.saveState=result.status==='conflict'?'conflict':'failed';return;}
      journal=next;draftPending=null;view.saveState=null;after();
    }
    const activity = () => unit.activities[view.activityId];
    const stopAudio = (clearWords = true) => { effects.push({ type: 'stop-audio' }); view.audio = null; if (clearWords) view.wordQueue = []; };
    function inspectRecovery() {
      recovery = adapter.inspect?.(storageKey) || {status:'unavailable'};
      recovery.validBackup = null;
      for (const raw of [recovery.backup,recovery.migration]) {
        try { const backup=JSON.parse(raw); if (backup?.value && validRecord(backup.value,unit)) { recovery.validBackup=backup.value; break; } } catch {}
      }
      view.recovery = {canExport:typeof recovery.raw==='string',canRestore:Boolean(recovery.validBackup),canReset:recovery.status==='ok',code:view.saveState==='storage'?'STORAGE_UNAVAILABLE':'RECORD_INVALID'};
    }
    function recoverRecord(event) {
      if (event.type==='recovery-export' && typeof recovery?.raw==='string') effects.push({type:'export-record',content:recovery.raw});
      else if (event.type==='recovery-cancel') view.recovery.confirm=null;
      else if (event.type==='recovery-reset' && view.recovery?.canReset) view.recovery.confirm='reset';
      else if (event.type==='recovery-restore' && recovery?.validBackup) view.recovery.confirm='restore';
      else if (event.type==='recovery-confirm' && view.recovery?.confirm) {
        const next=view.recovery.confirm==='restore'?recovery.validBackup:emptyRecord(unit);
        if (!validRecord(next,unit)) return;
        const result=adapter.recover(storageKey,{expectedRaw:recovery.raw,value:next});
        if (result.persisted) { pending=null; view={screen:'map',mode:'main',saveState:null,audio:null}; read(); }
        else { view.recovery.confirm=null; view.recovery.code=result.status==='conflict'?'RECORD_CHANGED':'STORAGE_UNAVAILABLE'; }
      }
    }
    function read() {
      const loaded = adapter.load(storageKey);
      if (loaded.status !== 'ok' || (loaded.value !== null && !validRecord(loaded.value, unit))) {
        view = { screen: 'blocked', saveState: loaded.status === 'unavailable' ? 'storage' : 'unreadable', mode: 'main', audio: null };
        inspectRecovery();
        return false;
      }
      record = loaded.value || emptyRecord(unit);
      revision = loaded.revision;
      if (loaded.value && unit.contractVersion && !record.contractVersion) {
        save(clone(record), () => {});
        if (pending) return false;
      }
      const legacy = adapter.load(unit.legacy.storageKey);
      view.legacyAvailable = legacy.status === 'ok' && Boolean(legacy.value);
      if (loaded.value === null && unit.progressImports?.length) {
        for (const source of unit.progressImports) {
          const imported = adapter.load(source.storageKey);
          if (imported.status !== 'ok' || imported.value && !validRecord(imported.value, source.contract)) {
            view = { screen: 'blocked', saveState: 'unreadable', mode: 'main', audio: null };
            return false;
          }
          if (!imported.value) continue;
          const old = imported.value, next = emptyRecord(unit);
          // Preserve every original record. Carry forward only unchanged learning tasks.
          next.archivedProgress = { [source.contract.experienceRevision]: clone(old) };
          const unchanged = id => {const previous=source.contract.activities[id],current=unit.activities[id];return previous && current && equal({...previous,feedbackPlayback:current.feedbackPlayback},current);};
          for (const [id, value] of Object.entries(old.completed)) if (unchanged(id)) next.completed[id] = clone(value);
          for (const [id, value] of Object.entries(old.results)) if (unchanged(value.activityId)) next.results[id] = clone(value);
          for (const [id, value] of Object.entries(old.attempts)) if (unchanged(id)) next.attempts[id] = clone(value);
          for (const [id, value] of Object.entries(old.storyProgress || {})) if (unchanged(id)) next.storyProgress[id] = clone(value);
          next.roles = clone(old.roles); next.sourceContacts = clone(old.sourceContacts); next.storyFacts = clone(old.storyFacts);
          next.legacyFacts = clone(old.legacyFacts);
          next.progressMigration = { fromUnit: source.contract.unitId, fromRevision: source.contract.experienceRevision, at: now().toISOString() };
          save(next, () => {});
          return true;
        }
      }
      if (loaded.value === null) for (const previousRevision of unit.compatibleProgressRevisions || []) {
        const previous = adapter.load(`poc:learning-path:${unit.unitId}:${previousRevision}`);
        const version = unit.previousRevisionContracts?.[previousRevision];
        const turnRecords = ['lesson1-2-v3.5', 'lesson1-2-v3.4', 'lesson1-2-v3.3'].includes(previousRevision);
        const contracts = version?.activities || { ...unit.previousActivityContracts, [unit.legacyRolePractice.activityId]: { kind: 'role' } };
        const previousUnit = { ...unit, recordSchema: version?.schema || (turnRecords ? 2 : 1), experienceRevision: previousRevision,
          activities: Object.fromEntries(Object.entries(contracts).map(([id, contract]) => [id, { ...contract, id }])) };
        if (previous.status !== 'ok' || (previous.value !== null && !validRecord(previous.value, previousUnit))) {
          view = { screen: 'blocked', saveState: 'unreadable', mode: 'main', audio: null };
          return false;
        }
        if (previous.value === null) continue;
        // Keep historical scores in their original evidence context. Only
        // unchanged activity identities transfer; node completion is derived.
        const old = previous.value, migrated = emptyRecord(unit);
        migrated.archivedProgress = { [previousRevision]: clone(old) };
        for (const [id, completion] of Object.entries(old.completed)) if (unit.activities[id]) migrated.completed[id] = clone(completion);
        for (const [id, result] of Object.entries(old.results)) {
          const a = unit.activities[result.activityId];
          if (a?.resultId === id) migrated.results[id] = { ...clone(result), assessment: clone(a.assessment) };
        }
        for (const [id, attempt] of Object.entries(old.attempts)) if (unit.activities[id]?.resultId) migrated.attempts[id] = clone(attempt);
        migrated.roles = clone(old.roles);
        // Retired dialogue turns remain in archivedProgress, never as new story proof.
        migrated.sourceContacts = clone(old.sourceContacts);
        migrated.storyFacts = clone(old.storyFacts);
        migrated.legacyFacts = clone(old.legacyFacts || null);
        migrated.progressMigration = { fromRevision: previousRevision, at: now().toISOString(), curriculumChanged: true, interactiveStoryChanged: true,
          rolePracticeChanged: turnRecords ? Boolean(old.progressMigration?.rolePracticeChanged)
            : Boolean(old.completed[unit.legacyRolePractice.activityId]) || Object.keys(old.roles).length > 0 };
        save(migrated, () => {});
        return true;
      }
      const oldUnit = legacy.value?.units?.[unit.unitId];
      if (loaded.value === null && legacy.status === 'ok' && legacy.value?.schemaVersion === 1 && oldUnit?.experienceRevision === unit.legacy.revision) {
        const migrated = clone(record), at = now().toISOString();
        const heard = ref => Array.isArray(oldUnit.sourceContacts?.[ref]?.contactModes) && oldUnit.sourceContacts[ref].contactModes.includes('audio-ended');
        const fullDialogueHeard = Array.isArray(oldUnit.completedMicrotaskIds) && oldUnit.completedMicrotaskIds.includes('L01-M07')
          && unit.dialogueRefs.every(heard);
        if (fullDialogueHeard) {
          contact(migrated, unit.dialogueRefs, 'heard', at);
          contact(migrated, ['L01-I01', ...unit.dialogueRefs], 'observed', at);
        }
        const savedRoles = oldUnit.rolePracticeProgress?.['L01-M12:role-enactment'];
        for (const round of unit.legacyRolePractice.rounds) {
          const completed = Array.isArray(savedRoles?.completedRoundIds) && savedRoles.completedRoundIds.includes(round.roundId)
            && round.hiddenTurnRefs.every(heard);
          const skipped = Array.isArray(savedRoles?.skippedRoundIds) && savedRoles.skippedRoundIds.includes(round.roundId);
          if (completed || skipped) migrated.roles[round.roundId] = { disposition: completed ? 'completed' : 'skipped', at, migratedFrom: unit.legacy.revision };
        }
        migrated.legacyFacts = { revision: unit.legacy.revision, fullDialogueHeard, roleIds: Object.keys(migrated.roles), importedAt: at };
        // Only matching audio-ended facts and explicit role dispositions move.
        // Legacy scores, stars, audio-form-supported results, and review timing do not.
        save(migrated, () => {});
      }
      return true;
    }
    if(!deferRead)read();
    function save(next, after) {
      if(unit.contractVersion && !next.contractVersion){
        for(const result of Object.values(next.results))result.contractVersion ||= 1;
        next.completedNodeContracts=Object.fromEntries(Object.entries(unit.history.nodes || {}).filter(([,ids])=>ids.every(id=>next.completed[id])).map(([id])=>[id,1]));
        next.contractVersion=unit.contractVersion;
        next.contentMigration={from:unit.history.revision,to:unit.releaseRevision,at:now().toISOString()};
      }
      pending = { next, after };
      // The existing store adapter treats malformed envelopes as revision zero;
      // check the read here so a corrupt record is never overwritten by a retry.
      const current = adapter.load(storageKey);
      if (current.status !== 'ok' || (current.value !== null && !validRecord(current.value, unit))) {
        view.saveState = 'unreadable'; stopAudio(false); return;
      }
      if (current.revision !== revision) { view.saveState = 'conflict'; stopAudio(false); return; }
      const checkpoint = adapter.checkpoint?.(storageKey,{expectedRevision:revision,migration:Boolean(next.contentMigration && !current.value?.contractVersion)}) || {status:'ok'};
      if (checkpoint.status!=='ok') {view.saveState=checkpoint.status==='conflict'?'conflict':'failed';stopAudio(false);return;}
      const result = adapter.commit(storageKey, { expectedRevision: revision, value: next });
      if (!result.persisted || result.status !== 'committed') {
        view.saveState = result.status === 'conflict' ? 'conflict' : 'failed'; stopAudio(false); return;
      }
      record = clone(result.value); revision = result.revision; pending = null; view.saveState = null;
      after();
    }
    function mutateRecord(edit, after) {
      if (view.mode === 'repeat') { after(); return; }
      const next = clone(record); delete next.resetBackup; edit(next); save(next, after);
    }
    function play(sequence, purpose) {
      if (!sequence.length) {
        if (purpose === 'required') view.requiredDone = true;
        if (purpose === 'feedback') view.feedbackDone = true;
        return;
      }
      stopAudio(purpose !== 'word');
      const recordings = sequence.map(entry => ({ ...entry, src: unit.sources[entry.ref].audioSrc }));
      view.audio = { requestId: ++serial, sequence: recordings, index: 0, status: 'playing', purpose, rate: 1 };
      effects.push({ type: 'play-audio', requestId: serial, index: 0, src: recordings[0].src, rate: 1 });
    }
    // Explicit taps form a bounded queue. Switching used to cancel speech before
    // ended, silently losing every fast tap except the last. Never award a tap
    // as listening evidence, and never enqueue an unrequested word.
    function requestWord(ref) {
      const active = view.audio?.purpose === 'word' && view.audio.status !== 'ended';
      if (active) {
        if (view.audio.sequence[0].ref !== ref && !view.wordQueue.includes(ref)) view.wordQueue.push(ref);
      } else play(activity().requiredAudio.filter(entry => entry.ref === ref), 'word');
    }
    function nextRequestedWord() {
      const ref = view.wordQueue.shift();
      if (ref) play(activity().requiredAudio.filter(entry => entry.ref === ref), 'word');
    }
    function shuffle(options, answer) {
      const result = options.map(o => o.id);
      for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
      if (result.length > 1 && equal(result, answer)) result.push(result.shift());
      return result;
    }
    function loadActivity(id, withinStory = false) {
      stopAudio();
      if(id.startsWith('retrieval:')) {
        const entry=record.retrievalReviews[id.slice(10)],q=challenges.reviewQuestion(unit,entry);
        Object.assign(view,{screen:'challenge',activityId:null,storyActivityId:null,challengeId:entry.challengeId || 'grammar',reviewQuestion:q,reviewKey:entry.questionId,challengeIndex:0,challengeAnswer:draftValue('challenge',(entry.challengeId || 'grammar')+':'+q.id) || '',challengeWrong:0,challengeHintUsed:false,feedback:null});
        return;
      }
      view.reviewQuestion=null;view.reviewKey=null;
      const a = unit.activities[id];
      if (!withinStory) {
        view.storyActivityId = null; view.storyBeats = {}; view.storyIndex = 0;
        if (a.kind === 'interactive-story') {
          view.storyActivityId = id;
          view.storyBeats = view.mode === 'repeat' ? {} : clone(record.storyProgress[id]?.beats || {});
          view.storyIndex = a.beats.findIndex(beat => !view.storyBeats[beat.id]);
          loadStoryBeat();
          return;
        }
      }
      const previous = view.mode === 'main' && !extraIndex ? record.attempts[id] : localAttempts[id];
      Object.assign(view, { screen: 'activity', activityId: id, feedback: null, selected: [],
        inputAnswer:draftValue('activity',id) ?? previous?.value ?? '',inputErrors:clone(previous?.errors || []),inputDiagnostic:null,
        optionOrder: shuffle(a.options, a.kind === 'order' ? a.answer : []),
        wrong: previous?.wrong || 0, hintUsed: previous?.hintUsed || false, hintLevel: previous?.hintUsed ? 1 : 0,
        requiredDone: withinStory || !a.requiredAudio.length, feedbackDone: withinStory || !a.feedbackAudio.length,
        heardWords: view.mode === 'main' ? clone(record.teachingProgress?.[id] || []) : [], heardRefs: [], matchedPairs: clone(previous?.matchedPairs || {}), wrongByRef: clone(previous?.wrongByRef || {}), matchWord: null, matchImage: null, matchMessage: '', storyRevealed: false, storyLineDone: false, storyHelp: false });
      if (a.kind === 'teach' && a.items.every(item => view.heardWords.includes(item.sourceRef))) view.requiredDone = true;
      if (a.kind === 'match') {
        view.matchWordOrder = shuffle(a.items.map(item => ({ id: item.sourceRef })), []);
        view.matchImageOrder = shuffle(a.items.map(item => ({ id: item.entityId })), view.matchWordOrder.map(ref => a.items.find(item => item.sourceRef === ref).entityId));
        finishMatching();
      } else if (!withinStory && a.requiredAudio.length && a.playbackMode !== 'manual-cards') play(a.requiredAudio, 'required');
    }
    const nodeDone = node => node.activityIds.every(id => record.completed[id]) || record.completedNodeContracts?.[node.id]===1 && unit.history?.nodes[node.id]?.every(id=>record.completed[id]);
    const nodePassed = node => nodeDone(node) || unit.nodes.indexOf(node) < (placement?.skippedUntil(unit,record)||0);
    function dueItems() {
      const due = Object.values(record?.results || {}).filter(r => r.nextDueDay <= today() && unit.activities[r.activityId].reviewEligible !== false).sort((a, b) =>
        a.nextDueDay.localeCompare(b.nextDueDay) || (a.initialEvidence === 'independent' ? 1 : 0) - (b.initialEvidence === 'independent' ? 1 : 0)
      );
      const seen = new Set();
      return due.filter(r => {
        if (!unit.courseId) return true;
        const key = r.targetId || r.activityId;
        if (seen.has(key)) return false;
        seen.add(key); return true;
      }).map(r=>({id:r.activityId,day:r.nextDueDay,supported:r.initialEvidence!=='independent'})).concat(Object.values(record?.retrievalReviews || {}).filter(e=>e.nextDueDay<=today()).map(e=>({id:'retrieval:'+e.questionId,day:e.nextDueDay,supported:e.wrong>0}))).sort((a,b)=>a.day.localeCompare(b.day)||Number(b.supported)-Number(a.supported)).slice(0,unit.review.limit).map(e=>e.id);
    }
    function startNode(id, mode) {
      const index = unit.nodes.findIndex(n => n.id === id);
      if (index < 0 || (index > 0 && !nodePassed(unit.nodes[index]) && !unit.nodes.slice(0, index).every(nodePassed))) return;
      const node = unit.nodes[index];
      // Historical completion keeps the path unlocked, but it is not evidence
      // for newly added activities. Explicitly reopening earns those normally.
      if (node.activityIds.every(aid=>record.completed[aid])) mode = 'repeat';
      else mode = 'main';
      view.mode = mode; view.nodeId = id; localAttempts = {}; extraIds = []; extraIndex = false;
      queue = mode === 'main' ? node.activityIds.filter(aid => !record.completed[aid]) : [...node.activityIds];
      queueIndex = 0;
      view.sessionProgress = { completed: 0, total: queue.reduce((total, aid) => {
        const a = unit.activities[aid];
        return total + (a.kind === 'interactive-story' ? a.beats.length - (mode === 'repeat' ? 0 : Object.keys(record.storyProgress[aid]?.beats || {}).length) : 1);
      }, 0) };
      beginSession();
      if (queue.length) loadActivity(queue[0]);
    }
    function beginFeedback(type) {
      const a = activity();
      view.feedback = type;
      const autoPlay = a.feedbackPlayback!=='optional' && !view.storyActivityId && a.feedbackAudio.length && !(a.feedbackPlayback === 'support-only' && type === 'correct');
      view.feedbackDone = !autoPlay;
      if (autoPlay) play(a.feedbackAudio, 'feedback');
      else stopAudio();
    }
    function retainAttempt(after) {
      const entry = { wrong: view.wrong, hintUsed: view.hintUsed, ...(activity().kind==='input'?{value:view.inputAnswer,errors:clone(view.inputErrors)}:{}), ...(activity().kind === 'match' ? { matchedPairs: clone(view.matchedPairs), wrongByRef: clone(view.wrongByRef) } : {}) };
      localAttempts[view.activityId] = entry;
      if (view.mode !== 'main' || extraIndex) { after(); return; }
      mutateRecord(next => {
        const a=activity(),previousWrong=next.attempts[view.activityId]?.wrong || 0;
        next.attempts[view.activityId] = entry;
        if(a.kind==='input' && entry.wrong>previousWrong){
          const q=unit.grammar.delayedQuestions.find(q=>q.grammarSkillId===a.assessment.grammarSkillId);
          challenges.scheduleReview(next,{origin:'grammar',questionId:q.id,grammarSkillId:q.grammarSkillId,nextDueDay:addDays(today(),1),error:entry.errors.at(-1)});
        }
      }, after);
    }
    function finishMatching() {
      if (activity().items.every(item => view.matchedPairs[item.sourceRef])) {
        const modeled = Object.values(view.matchedPairs).some(pair => pair.evidence === 'modeled');
        beginFeedback(modeled ? 'modeled' : view.wrong || view.hintUsed ? 'supported' : 'correct');
      }
    }
    function matchPair(modeled = false) {
      const a = activity();
      if (a.kind !== 'match' || view.feedback || !view.matchWord || !view.matchImage) return;
      const item = a.items.find(item => item.sourceRef === view.matchWord);
      if (!item || view.matchedPairs[item.sourceRef] || Object.values(view.matchedPairs).some(pair => pair.entityId === view.matchImage)) return;
      stopAudio();
      if (item.entityId === view.matchImage) {
        const remaining = a.items.length - Object.keys(view.matchedPairs).length;
        view.matchedPairs[item.sourceRef] = { entityId: item.entityId, at: now().toISOString(),
          evidence: modeled ? 'modeled' : remaining === 1 ? 'elimination-supported' : view.wrongByRef[item.sourceRef] ? 'retry-supported' : 'matched-with-options' };
        view.matchMessage = modeled ? 'modeled' : 'correct';
      } else {
        view.wrong++; view.hintUsed = true;
        view.wrongByRef[item.sourceRef] = (view.wrongByRef[item.sourceRef] || 0) + 1;
        view.matchMessage = 'retry';
      }
      view.matchWord = null; view.matchImage = null;
      retainAttempt(finishMatching);
    }
    function check() {
      const a = activity();
      if(a.kind==='input') {
        if(view.feedback || !view.inputAnswer.trim())return;
        if(challenges.accepts(a,view.inputAnswer))beginFeedback(view.wrong || view.hintUsed?'supported':'correct');
        else {view.inputDiagnostic=a.diagnostics?.find(d=>d.values.some(value=>challenges.normalize(value)===challenges.normalize(view.inputAnswer))) || null;view.inputErrors=[...view.inputErrors,{value:view.inputAnswer,code:view.inputDiagnostic?.code || 'unclassified',at:now().toISOString()}].slice(-5);view.wrong++;view.hintUsed=true;view.hintLevel=Math.min(2,view.wrong);retainAttempt(()=>{view.feedback='retry';});}
        return;
      }
      if (!a.resultId || a.kind === 'match' || view.feedback || !view.requiredDone || view.selected.length !== a.answer.length) return;
      if (equal(view.selected, a.answer)) beginFeedback(view.wrong || view.hintUsed ? 'supported' : 'correct');
      else {
        view.wrong++; view.hintUsed = true; view.hintLevel = Math.min(2, view.wrong);
        retainAttempt(() => {
          if (view.wrong >= unit.remediation.modelAfterErrors) { view.selected = [...a.answer]; beginFeedback('modeled'); }
          else view.feedback = 'retry';
        });
      }
    }
    function nextActivity(count = true) {
      stopAudio();
      if (count) view.sessionProgress.completed++;
      queueIndex++;
      if (queueIndex < queue.length) { loadActivity(queue[queueIndex]); return; }
      if (!extraIndex && extraIds.length && view.mode === 'main') {
        extraIndex = true; queue = [...extraIds]; queueIndex = 0; localAttempts = {}; loadActivity(queue[0]); return;
      }
      view.screen = view.mode === 'review' ? 'review-complete' : 'celebration';
      view.activityId = null; view.storyActivityId = null;
      clockSession(pageHidden, true);
    }
    function finishActivity() {
      const a = activity();
      if (a.kind === 'interactive-story') { advanceStoryLine(); return; }
      if (!snapshot().canContinue) return;
      const evidence = view.feedback === 'modeled' ? 'modeled' : view.feedback === 'supported' ? 'supported' : 'independent';
      const at = now().toISOString();
      mutateRecord(next => {
        if (view.mode === 'review') {
          const result = next.results[a.resultId];
          const successful = evidence === 'independent';
          result.intervalStage = successful ? Math.min(result.intervalStage + 1, unit.review.intervals.length - 1) : 0;
          result.nextDueDay = addDays(today(), successful ? unit.review.intervals[result.intervalStage] : 1);
          result.lastReviewEvidence = evidence; result.lastReviewedAt = at;
          if (unit.courseId) next.reviewEvents.push({ activityId: a.id, targetId: a.targetId, evidence, at });
          if (a.kind === 'match') result.lastReviewPairs = clone(view.matchedPairs);
          return;
        }
        next.completed[a.id] ||= { at, evidence };
        if (a.resultId) {
          next.results[a.resultId] ||= { activityId: a.id, targetId: a.targetId, channel: a.channel,
            ...(unit.contractVersion ? {contractVersion:unit.contractVersion} : {}),
            ...(a.kind==='input'?{value:view.inputAnswer,errors:clone(view.inputErrors)}:{}),
            initialEvidence: evidence, wrong: view.wrong, hintUsed: view.hintUsed, at, assessment: clone(a.assessment),
            ...(a.kind === 'match' ? { pairs: clone(view.matchedPairs) } : {}),
            intervalStage: 0, nextDueDay: addDays(today(), 1) };
          if (extraIndex) next.results[a.resultId].extraPractice = { evidence, at, ...(a.kind === 'match' ? { pairs: clone(view.matchedPairs) } : {}) };
          delete next.attempts[a.id];
          if(a.kind==='input') {const q=unit.grammar.delayedQuestions.find(q=>q.grammarSkillId===a.assessment.grammarSkillId);challenges.scheduleReview(next,{origin:'grammar',questionId:q.id,grammarSkillId:q.grammarSkillId,nextDueDay:addDays(today(),1)});}
        }
        if (a.storyFact) next.storyFacts[a.storyFact] = { at };
        if (view.storyActivityId) writeStoryBeat(next, storyProof());
        {
          const observed = [...a.sourceRefs, ...(a.guideRef ? [a.guideRef] : []), ...(view.hintLevel ? a.noteRefs || [] : []), ...(a.conversation?.contextRefs || []), ...(a.conversation?.continuationRefs || []), ...a.options.filter(o => o.type === 'text').map(o => o.id)];
          contact(next, observed, 'observed', at);
          contact(next, view.heardRefs, 'heard', at);
          contact(next, a.instructionRefs || [], 'implemented-in-flow', at);
          contact(next, a.meaningRefs || [], 'posed-in-context', at);
          if (a.resultId) contact(next, a.evidenceRefs || a.sourceRefs, evidence === 'independent' ? a.assessment.evidenceMode : 'supported', at);
        }
      }, () => {
        if (a.resultId) scoreSession(evidence === 'independent');
        if (view.storyActivityId) { advanceStory(storyProof()); return; }
        if (a.assessment?.scope === 'assessment' && evidence !== 'independent' && !extraIndex && view.mode === 'main' && extraIds.length < unit.remediation.maxExtraPerNode && !extraIds.includes(a.id)) {
          extraIds.push(a.id); view.sessionProgress.total++;
        }
        nextActivity();
      });
    }
    const story = () => unit.activities[view.storyActivityId];
    const storyBeat = () => story()?.beats[view.storyIndex];
    function loadStoryBeat(autoPlay = false) {
      const beat = storyBeat();
      loadActivity(beat.kind === 'line' ? view.storyActivityId : beat.activityId, true);
      if (autoPlay && beat.kind === 'line') playStoryLine();
    }
    function playStoryLine() {
      const beat = storyBeat();
      if (beat?.kind !== 'line') return;
      view.storyRevealed = true; view.storyLineDone = false;
      const source = unit.sources[beat.ref];
      play([{ ref: beat.ref, text: source.text, speaker: source.speaker }], 'story-line');
    }
    function storyProof() {
      const beat = storyBeat(), at = now().toISOString();
      return beat.kind === 'line'
        ? { kind: 'line', ref: beat.ref, actorEntityId: beat.actorEntityId, evidence: 'audio-ended', at }
        : { kind: 'checkpoint', activityId: beat.activityId, evidence: 'answered', at };
    }
    function writeStoryBeat(next, proof) {
      const parent = story(), beat = storyBeat();
      (next.storyProgress[parent.id] ||= { beats: {} }).beats[beat.id] = proof;
      if (beat.kind === 'line') {
        contact(next, [beat.ref], 'heard', proof.at);
        contact(next, [beat.ref], 'observed', proof.at);
      }
      if (view.storyIndex === parent.beats.length - 1) {
        next.completed[parent.id] = { at: proof.at, evidence: 'interactive-story-completed' };
        contact(next, parent.instructionRefs || [], 'implemented-in-flow', proof.at);
      }
    }
    function advanceStory(proof) {
      view.storyBeats[storyBeat().id] = proof;
      view.sessionProgress.completed++;
      if (view.storyIndex === story().beats.length - 1) { view.storyActivityId = null; nextActivity(false); }
      else { view.storyIndex++; loadStoryBeat(true); }
    }
    function advanceStoryLine() {
      if (storyBeat()?.kind !== 'line' || !view.storyLineDone) return;
      const proof = storyProof();
      mutateRecord(next => writeStoryBeat(next, proof), () => advanceStory(proof));
    }
    function contact(next, refs, mode, at) {
      const visited = new Set();
      function add(ref) {
        if (!unit.sources[ref] || visited.has(ref)) return;
        visited.add(ref);
        const existing = next.sourceContacts[ref];
        next.sourceContacts[ref] = { modes: [...new Set([...(existing?.modes || []), mode])], at };
        // A word heard within a sentence is exposure, never a separate retrieval.
        if (mode === 'observed' || mode === 'heard') for (const nested of unit.sources[ref].embeddedSourceRefs || []) add(nested);
      }
      refs.forEach(add);
    }
    function handleAudio(event) {
      const active = view.audio;
      if (!active || active.requestId !== event.requestId || active.index !== event.index || active.status !== 'playing') return;
      if (event.type === 'audio-error') { active.status = event.blocked ? 'blocked' : 'failed'; return; }
      if (event.type !== 'audio-ended') return;
      if (session && !session.finished && view.screen === 'activity') {
        session.heardRefs = [...new Set([...session.heardRefs, active.sequence[active.index].ref])];
      }
      view.heardRefs = [...new Set([...(view.heardRefs || []), active.sequence[active.index].ref])];
      if (active.index + 1 < active.sequence.length) {
        active.index++;
        effects.push({ type: 'play-audio', requestId: active.requestId, index: active.index, src: active.sequence[active.index].src, rate: 1 });
      } else {
        active.status = 'ended';
        if (active.purpose === 'required') view.requiredDone = true;
        if (active.purpose === 'feedback') view.feedbackDone = true;
        if (active.purpose === 'story-line') view.storyLineDone = true;
        if (active.purpose === 'word') {
          view.heardWords = [...new Set([...view.heardWords, active.sequence[0].ref])];
          view.requiredDone = activity().items.every(item => view.heardWords.includes(item.sourceRef));
          if (unit.courseId && view.mode === 'main') mutateRecord(next => {
            next.teachingProgress[view.activityId] = [...view.heardWords];
            contact(next, [active.sequence[0].ref], 'heard', now().toISOString());
          }, nextRequestedWord);
          else nextRequestedWord();
        }
        if (active.purpose === 'reference' && unit.courseId) mutateRecord(next => contact(next, [active.sequence[0].ref], 'heard-in-reference', now().toISOString()), () => {});
      }
    }
    const challenge = () => unit.challenges?.find(c => c.id === view.challengeId);
    const challengeQuestion = () => view.reviewQuestion || challenge()?.questions[view.challengeIndex];
    const challengeUnlocked = c => c && nodePassed(unit.nodes.find(n => n.id === c.unlockNodeId));
    function showChallenge(id) {
      const definition = unit.challenges?.find(c => c.id === id);
      if (!challengeUnlocked(definition)) return;
      stopAudio();
      Object.assign(view, {screen:'challenge-intro',mode:'challenge',challengeId:id,reviewQuestion:null,reviewKey:null,activityId:null,storyActivityId:null,sessionProgress:null,feedback:null});
    }
    function loadChallengeQuestion() {
      const progress = record.challenges?.[view.challengeId] || {answers:[]};
      const draft = progress.draft;
      const typed=draftValue('challenge',view.challengeId+':'+challenge().questions[progress.answers.length]?.id);
      Object.assign(view, {screen:'challenge',challengeIndex:progress.answers.length,challengeAnswer:typed ?? draft?.value ?? '',
        challengeWrong:draft?.wrong || 0,challengeHintUsed:draft?.hintUsed || false,feedback:null});
    }
    function saveChallengeDraft(after = () => {}, error = false) {
      if (view.mode==='review' || view.screen !== 'challenge' || view.feedback === 'correct') { after(); return; }
      const next = clone(record); delete next.resetBackup;
      const progress = (next.challenges ||= {})[view.challengeId] ||= {answers:[]};
      progress.draft = {questionId:challengeQuestion().id,value:view.challengeAnswer,wrong:view.challengeWrong,hintUsed:view.challengeHintUsed};
      if(error) scheduleChallengeReview(next,true);
      save(next, after);
    }
    function challengeError() {
      const diagnostic=challengeQuestion().diagnostics?.find(d=>d.values.some(value=>challenges.normalize(value)===challenges.normalize(view.challengeAnswer)));
      return {value:view.challengeAnswer,code:diagnostic?.code || 'unclassified',at:now().toISOString()};
    }
    function scheduleChallengeReview(next,error=false) {
      const q=challengeQuestion();
      challenges.scheduleReview(next,{origin:'challenge',challengeId:view.challengeId,questionId:q.id,...(q.grammarSkillId?{grammarSkillId:q.grammarSkillId}:{}),nextDueDay:addDays(today(),1),...(error?{error:challengeError()}: {})});
    }
    function checkChallenge() {
      if (view.feedback || !view.challengeAnswer.trim()) return;
      stopAudio();
      if (challenges.accepts(challengeQuestion(), view.challengeAnswer)) view.feedback = 'correct';
      else {
        view.challengeWrong++; view.challengeHintUsed = true;
        if(view.mode==='review') mutateRecord(next=>challenges.scheduleReview(next,{...next.retrievalReviews[view.reviewKey],nextDueDay:addDays(today(),1),error:challengeError()}),()=>{view.feedback='retry';});
        else saveChallengeDraft(() => { view.feedback = 'retry'; },true);
      }
    }
    function completeChallengeQuestion() {
      if (view.feedback !== 'correct') return;
      const next = clone(record); delete next.resetBackup;
      if(view.mode==='review') {
        const entry=next.retrievalReviews[view.reviewKey],evidence=view.challengeWrong || view.challengeHintUsed?'supported':'independent';
        entry.intervalStage=evidence==='independent'?Math.min(entry.intervalStage+1,unit.review.intervals.length-1):0;
        entry.nextDueDay=addDays(today(),evidence==='independent'?unit.review.intervals[entry.intervalStage]:1);
        entry.lastEvidence=evidence;entry.lastReviewedAt=now().toISOString();
        entry.lastQuestionId=challengeQuestion().id;entry.lastAnswer=view.challengeAnswer;entry.lastAnswerPolicyVersion=unit.answerPolicyVersion || 1;
        entry.authoredSupport=challengeQuestion().authoredSupport || (challengeQuestion().kind==='gap'?'sentence-frame':'none');
        entry.reviewCount=(entry.reviewCount || 0)+1;
        save(next,()=>{scoreSession(evidence==='independent');nextActivity();});return;
      }
      const progress = (next.challenges ||= {})[view.challengeId] ||= {answers:[]};
      const definition = challenge();
      if (progress.answers.length !== view.challengeIndex) return;
      progress.answers.push({questionId:challengeQuestion().id,value:view.challengeAnswer,answerPolicyVersion:unit.answerPolicyVersion || 1,wrong:view.challengeWrong,hintUsed:view.challengeHintUsed,
        evidence:view.challengeWrong || view.challengeHintUsed ? 'supported' : 'independent',at:now().toISOString()});
      scheduleChallengeReview(next);
      delete progress.draft;
      if (progress.answers.length === definition.questions.length) progress.completedAt = now().toISOString();
      stopAudio();
      save(next, () => {
        scoreSession(progress.answers.at(-1).evidence === 'independent');
        view.sessionProgress.completed++;
        if (progress.completedAt) { view.screen = 'challenge-complete'; view.feedback = null; clockSession(pageHidden, true); }
        else loadChallengeQuestion();
      });
    }
    const placementAttempt = () => record.placement?.attempts[view.placementId];
    function showPlacement(id) {
      if (!placement.eligible(unit,record,id)) return;
      stopAudio();
      Object.assign(view,{screen:'placement-intro',mode:'placement',placementId:id,activityId:null,storyActivityId:null,challengeId:null,feedback:null,sessionProgress:null});
    }
    function loadPlacement() {
      const a=placementAttempt();
      Object.assign(view,{screen:a.status==='active'?'placement':'placement-result',mode:'placement',
        placementIndex:a.cursor,placementAnswer:(a.responses.length===a.cursor ? draftValue('placement',a.id+':'+a.questionIds[a.cursor]) : null) ?? a.draft,feedback:a.status==='active'&&a.responses.length>a.cursor?(a.responses[a.cursor].correct?'correct':'incorrect'):null,
        sessionProgress:{completed:a.responses.length,total:a.questionIds.length}});
    }
    function writePlacement(attempt,after=loadPlacement) {
      const next=clone(record); delete next.resetBackup;
      ((next.placement ||= {attempts:{}}).attempts)[view.placementId]=attempt;
      save(next,after);
    }
    function startPlacement() {
      const old=placementAttempt();
      if (old?.status==='active') { loadPlacement(); return; }
      if (!placement.eligible(unit,record,view.placementId)) return;
      // New attempts get a new seed; opening, refreshing and resuming never do.
      let seed=Math.floor(random()*4294967296)>>>0;
      if (seed===old?.seed) seed=(seed+1)>>>0;
      const attempt=placement.createAttempt(unit,record,view.placementId,seed,now().toISOString());
      if (attempt) writePlacement(attempt);
    }
    function handlePlacement(event) {
      const a=placementAttempt();
      // Identity guards also reject queued clicks/IME drafts from a previous
      // question. The persisted response is the single source of life loss.
      if (a?.status!=='active' || event.attemptId!==a.id || event.questionId!==a.questionIds[a.cursor]) return;
      if (event.type==='placement-input' && !view.feedback && typeof event.value==='string') {
        const value=event.value.slice(0,180);
        if (value!==view.placementAnswer) writeDraft('placement',a.id+':'+a.questionIds[a.cursor],value,()=>{view.placementAnswer=value;});
      } else if (event.type==='placement-check' && !view.feedback) {
        const next=placement.grade(unit,a,view.placementAnswer,now().toISOString());
        if (next) writePlacement(next);
      } else if (event.type==='placement-next' && view.feedback) {
        writePlacement({...clone(a),cursor:a.cursor+1,draft:''});
      }
    }
    function requestReset(scope, id) {
      if (!unit.courseId || !['map','challenge-intro','challenge-complete'].includes(view.screen)) return;
      if (!['course','challenges','challenge'].includes(scope) || scope === 'challenge' && !unit.challenges?.some(c => c.id === id)) return;
      stopAudio(); view.resetRequest = {scope,id};
    }
    function confirmReset() {
      if (!view.resetRequest) return;
      const {scope,id} = view.resetRequest;
      const old = clone(record); delete old.resetBackup;
      const next = scope === 'course' ? emptyRecord(unit) : clone(old);
      if (scope === 'challenges') next.challenges = {};
      if(scope!=='course' && next.retrievalReviews) for(const [key,e] of Object.entries(next.retrievalReviews))if(e.origin==='challenge'&&(scope==='challenges'||e.challengeId===id))delete next.retrievalReviews[key];
      if (scope === 'challenge') delete (next.challenges ||= {})[id];
      next.resetBackup = {at:now().toISOString(),record:old};
      save(next, () => {
        Object.assign(view,{screen:'map',mode:'main',activityId:null,storyActivityId:null,challengeId:null,resetRequest:null,sessionProgress:null});
      });
    }
    function snapshot(light = false) {
      const a = activity();
      // Compute the available prefix once, rather than rechecking all earlier
      // lessons for every node on every audio event.
      if (projectedRecord!==record || projectedDay!==today()) {
      let previousDone = true;
      const skippedUntil=placement?.skippedUntil(unit,record)||0;
      const nodes = unit.nodes.map((node,index) => {
        const done = Boolean(record && nodeDone(node));
        const skipped=Boolean(record && !done && index<skippedUntil),passed=done||skipped;
        const available = Boolean(record && (passed || previousDone));
        previousDone = previousDone && passed;
        return {id:node.id,done,skipped,passed,available,completeActivities:node.activityIds.filter(id=>record?.completed[id]).length,pendingRole:false};
      });
      projection={nodes,completedCount:unit.checkpointIds.filter(id=>unit.checkpointActivities[id].every(aid=>record?.completed[aid]) || record?.completedNodeContracts?.[id]===1 && nodes.find(n=>n.id===id)?.done).length,passedCount:nodes.filter(n=>n.passed).length,dueCount:dueItems().length};
      projectedRecord=record;projectedDay=today();publicRecord=freeze(clone(record || null));
      }
      const state=clone({ ...view, extraPractice: extraIndex,
        settlement: session?.finished && ['celebration','review-complete','challenge-complete'].includes(view.screen) && view.mode !== 'summary'
          ? { ...session, completed: view.sessionProgress.completed, heard: session.heardRefs.length } : null,
        canContinue: view.screen === 'activity' && !(a?.kind === 'teach' && (view.wordQueue.length || view.audio?.purpose === 'word' && view.audio.status !== 'ended')) && (a?.kind === 'interactive-story' ? view.storyLineDone : a?.resultId ? Boolean(view.feedback && view.feedback !== 'retry' && view.feedbackDone) : view.requiredDone && view.feedbackDone),
        ...projection,
        placementAttempt:record?.placement?.attempts[view.placementId]||null,
        });
      state.record=light ? publicRecord : clone(record || null);
      return state;
    }
    function dispatch(event, {light = false} = {}) {
      effects = [];
      if (event.type === 'session-visibility') {
        pageHidden = Boolean(event.hidden); clockSession(pageHidden);
        return {view:snapshot(light),effects};
      }
      if (draftPending) {
        if(event.type==='save-retry') writeDraft(draftPending.kind,draftPending.identity,draftPending.value,draftPending.after);
        else if(event.type==='reload') {draftPending=null;pending=null;view={screen:'map',saveState:null,mode:'main',audio:null};journal=adapter.loadDraft?.(storageKey)?.value || null;read();}
      }
      else if (event.type.startsWith('recovery-') && view.screen==='blocked') recoverRecord(event);
      else if (event.type === 'reload') {
        stopAudio(); pending = null; journal=adapter.loadDraft?.(storageKey)?.value || null; view = { screen: 'map', saveState: null, mode: 'main', audio: null }; read();
      } else if (pending || view.screen === 'blocked') {
        if (event.type === 'save-retry' && pending) save(pending.next, pending.after);
      } else if (view.resetRequest) {
        if (event.type === 'reset-cancel') view.resetRequest = null;
        if (event.type === 'reset-confirm') confirmReset();
      } else if (event.type === 'reset-request') requestReset(event.scope, event.id);
      else if (event.type === 'reset-undo' && view.screen === 'map' && record.resetBackup) {
        save(clone(record.resetBackup.record), () => {});
      } else if (event.type === 'open-placement' && view.screen==='map') showPlacement(event.id);
      else if (event.type === 'placement-start' && view.screen==='placement-intro') startPlacement();
      else if (event.type === 'placement-retry' && view.screen==='placement-result' && placementAttempt()?.status==='failed') showPlacement(view.placementId);
      else if (event.type.startsWith('placement-') && view.screen==='placement') handlePlacement(event);
      else if (event.type === 'open-challenge' && ['map','celebration','challenge-complete'].includes(view.screen)) showChallenge(event.id);
      else if (event.type === 'challenge-start' && view.screen === 'challenge-intro' && !record.challenges?.[view.challengeId]?.completedAt) {
        const completed = record.challenges?.[view.challengeId]?.answers.length || 0;
        view.sessionProgress = {completed:0,total:challenge().questions.length-completed};
        beginSession();
        loadChallengeQuestion();
      } else if (event.type === 'challenge-save-draft' && view.screen === 'challenge'
        && event.id === view.challengeId && event.questionId === challengeQuestion().id) saveChallengeDraft();
      else if (event.type === 'open-node' && view.screen === 'map') startNode(event.nodeId, event.mode);
      else if (event.type === 'map') {
        if (view.screen==='placement' && !view.feedback && view.placementAnswer!==placementAttempt().draft) writePlacement({...clone(placementAttempt()),draft:view.placementAnswer},()=>{});
        if (view.screen==='challenge') saveChallengeDraft();
        if (pending) return {view:snapshot(light),effects:clone(effects)};
        stopAudio(); view.screen = 'map'; view.activityId = null; view.storyActivityId = null; view.mode = 'main'; view.sessionProgress = null; view.challengeId = null; }
      else if (event.type === 'course-summary' && unit.courseId && unit.nodes.every(nodeDone)) {
        stopAudio(); view.screen = 'celebration'; view.mode = 'summary'; view.nodeId = unit.nodes.at(-1).id; view.activityId = null; view.storyActivityId = null; view.sessionProgress = null;
      }
      else if (event.type === 'references' && unit.referenceGroups) {
        stopAudio(); view.screen = 'references'; view.activityId = null; view.storyActivityId = null; view.mode = 'reference'; view.referenceGroupId = null; view.sessionProgress = null;
      }
      else if (event.type === 'reference-section' && view.screen === 'references' && unit.referenceGroups.some(group => group.id === event.id)) {
        stopAudio(); view.referenceGroupId = view.referenceGroupId === event.id ? null : event.id;
      }
      else if (event.type === 'reference-play' && view.screen === 'references' && unit.referenceGroups.find(group => group.id === view.referenceGroupId)?.sourceRefs.includes(event.id) && unit.sources[event.id]?.audioSrc) {
        play([{ref:event.id,text:unit.sources[event.id].text}], 'reference');
      }
      else if (event.type === 'review') {
        queue = dueItems(); if (queue.length) { view.mode = 'review'; view.nodeId = null; queueIndex = 0; extraIndex = false; extraIds = []; localAttempts = {}; view.sessionProgress = {completed:0,total:queue.length}; beginSession(); loadActivity(queue[0]); }
      } else if (event.type.startsWith('audio-')) handleAudio(event);
      else if (event.type === 'retry-audio' && ['blocked', 'failed'].includes(view.audio?.status)) play(view.audio.sequence, view.audio.purpose);
      else if (event.type === 'pause' && view.audio?.status === 'playing') { view.audio.status = 'paused'; effects.push({ type: 'pause-audio' }); }
      else if (event.type === 'resume-audio' && view.audio?.status === 'paused') { view.audio.status = 'playing'; effects.push({ type: 'resume-audio', requestId: view.audio.requestId, index: view.audio.index }); }
      else if (view.screen === 'challenge') {
        if (event.type === 'challenge-input' && !view.feedback && typeof event.value === 'string' && (!event.questionId || event.questionId===challengeQuestion().id)) writeDraft('challenge',view.challengeId+':'+challengeQuestion().id,event.value,()=>{view.challengeAnswer=event.value.slice(0,180);});
        else if (event.type === 'challenge-check') checkChallenge();
        else if (event.type === 'challenge-retry' && view.feedback === 'retry') view.feedback = null;
        else if (event.type === 'challenge-hint' && !view.feedback) { view.challengeHintUsed = true; saveChallengeDraft(); }
        else if (event.type === 'challenge-next') completeChallengeQuestion();
        else if (event.type === 'challenge-audio' && view.feedback) play([{ref:challengeQuestion().sourceRef,text:unit.sources[challengeQuestion().sourceRef].text}], 'challenge-reference');
      }
      else if (view.screen === 'activity') {
        const a = activity();
        if (event.type==='activity-input' && a.kind==='input' && !view.feedback && event.id===a.id && typeof event.value==='string') writeDraft('activity',a.id,event.value,()=>{view.inputAnswer=event.value.slice(0,180);});
        else if (event.type === 'select' && a.kind !== 'match' && view.requiredDone && !view.feedback && a.options.some(o => o.id === event.id)) {
          if (a.kind === 'order') view.selected = view.selected.includes(event.id) ? view.selected.filter(id => id !== event.id) : [...view.selected, event.id];
          else view.selected = [event.id];
        } else if (['match-word', 'match-image'].includes(event.type) && a.kind === 'match' && !view.feedback) {
          const byWord = event.type === 'match-word';
          const item = a.items.find(item => (byWord ? item.sourceRef : item.entityId) === event.id && !view.matchedPairs[item.sourceRef]);
          if (item) {
            view[byWord ? 'matchWord' : 'matchImage'] = event.id;
            view.matchMessage = '';
            matchPair();
          }
        } else if (event.type === 'match-model' && a.kind === 'match' && !view.feedback) {
          const item = a.items.find(item => item.sourceRef === view.matchWord) || a.items.find(item => !view.matchedPairs[item.sourceRef]);
          if (item) { view.hintUsed = true; view.matchWord = item.sourceRef; view.matchImage = item.entityId; matchPair(true); }
        } else if (event.type === 'match-listen' && a.kind === 'match' && view.matchedPairs[event.id]) {
          const source = unit.sources[event.id];
          play([{ ref: event.id, text: source.text, src: source.audioSrc }], 'excerpt');
        } else if (event.type === 'check') check();
        else if (event.type === 'retry' && view.feedback === 'retry') { view.feedback = null; view.selected = []; }
        else if (event.type === 'hint' && a.resultId && !view.feedback) {
          view.hintUsed = true; view.hintLevel = Math.min(2, view.hintLevel + 1); retainAttempt(() => {});
        } else if (event.type === 'word-play' && a.kind === 'teach' && a.items.some(item => item.sourceRef === event.id)) {
          requestWord(event.id);
        } else if (event.type === 'line-play') {
          const allowed = view.storyActivityId ? story().beats.filter((beat, i) => beat.kind === 'line' && (i < view.storyIndex || i === view.storyIndex && view.storyLineDone)).map(beat => beat.ref)
            : a.conversation ? view.feedback && view.feedback !== 'retry' ? view.feedbackDone ? [...a.conversation.contextRefs, a.conversation.replyRef, ...a.conversation.continuationRefs] : [] : a.conversation.contextRefs : [];
          if (allowed.includes(event.id)) {
            const source = unit.sources[event.id];
            play([{ ref: event.id, text: source.text, src: source.audioSrc, speaker: source.speaker }], 'excerpt');
          }
        } else if (['replay', 'replay-current', 'story-start'].includes(event.type) && !['teach', 'match'].includes(a.kind)) {
          if (view.storyActivityId) {
            if (storyBeat().kind === 'line') playStoryLine();
            else {
              const beat = story().beats.slice(0, view.storyIndex).findLast(beat => beat.kind === 'line');
              play([{ ref: beat.ref, text: unit.sources[beat.ref].text }], 'excerpt');
            }
          }
          else if (view.feedback && view.feedback !== 'retry') { view.feedbackDone = a.feedbackPlayback==='optional'; play(a.feedbackAudio, a.feedbackPlayback==='optional'?'excerpt':'feedback'); }
          else if (a.conversation) play(a.conversation.contextRefs.map(ref => ({ ref, text: unit.sources[ref].text, src: unit.sources[ref].audioSrc })), 'excerpt');
          else { if (!a.resultId) view.requiredDone = !a.requiredAudio.length; play(a.requiredAudio, 'required'); }
        } else if (event.type === 'story-help' && view.storyActivityId && storyBeat().noteRef) {
          view.storyHelp = !view.storyHelp;
          if (view.storyHelp) mutateRecord(next => contact(next, [storyBeat().noteRef], 'observed', now().toISOString()), () => {});
        }
        else if (event.type === 'continue') finishActivity();
      }
      return { view: snapshot(light), effects: clone(effects) };
    }
    return Object.freeze({ storageKey, dispatch, snapshot });
  }
  return Object.freeze({ createRuntime, validRecord, emptyRecord, addDays });
});
