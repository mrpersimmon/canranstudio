(function attach(root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) (root.CanranCore ||= {}).learningPathScene = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  function createRenderer(unit) {
    const exercises=typeof module==='object'&&module.exports?require('./learning-exercises'):root.CanranCore.learningExercises;
    const c = unit.copy;
    const checkpointTotal = unit.checkpointIds.length;
    const icon = name => `<img class="lp-icon" src="${escape(unit.icons[name])}" alt="" width="24" height="24">`;
    const image = (id, className = '', labelled = false) => `<img class="${className}" src="${escape(unit.entities[id].assetSrc)}" alt="${labelled ? escape(unit.entities[id].title) : ''}" decoding="async">`;
    function button(action, text, { id = '', scope = '', disabled = false, className = '', symbol = '', label = '', pressed = null, language = '' } = {}) {
      return `<button type="button" data-action="${action}"${id ? ` data-id="${escape(id)}"` : ''}${scope ? ` data-scope="${escape(scope)}"` : ''} class="lp-button ${className}"${disabled ? ' disabled' : ''}${label ? ` aria-label="${escape(label)}"` : ''}${pressed === null ? '' : ` aria-pressed="${pressed}"`}>${symbol ? icon(symbol) : ''}${text ? `<span${language ? ` lang="${escape(language)}"` : ''}>${escape(text)}</span>` : ''}</button>`;
    }
    function header(v, label = c.learningPath) {
      const progress = v.sessionProgress;
      return `<header class="lp-header">${v.screen === 'map' ? `<div class="lp-brand">${image('explorer-cat')}<strong>${escape(unit.brandTitle)}</strong></div>` : button('map', '', { symbol: 'x-lg', className: 'lp-icon-button', label: c.rest })}${progress?.total ? `<div class="lp-progress" role="progressbar" aria-label="本次闯关进度" aria-valuemin="0" aria-valuemax="${progress.total}" aria-valuenow="${progress.completed}"><span style="width:${progress.completed / progress.total * 100}%"></span></div>` : '<div class="lp-header-spacer"></div>'}<span class="lp-header-label">${escape(label)}</span></header>`;
    }
    function scene(a, small = false, returned = false) {
      return `<div class="lp-scene${small ? ' lp-scene-small' : ''}${returned ? ' is-returned' : ''}" role="img" aria-label="${escape(c.sceneLabel)}"><span class="lp-actor lp-keeper">${image('station-keeper')}</span>${a.focusEntityId ? image(a.focusEntityId, 'lp-scene-object') : ''}<span class="lp-actor lp-owner">${image('handbag-owner')}</span></div>`;
    }
    function playback(v) {
      const playing = v.audio?.status === 'playing', paused = v.audio?.status === 'paused';
      const action = paused ? 'resume-audio' : playing ? 'pause' : 'replay';
      return `<div class="lp-playback">${button(action, paused ? c.play : playing ? c.pause : c.replay, { symbol: paused ? 'play-fill' : playing ? 'pause-fill' : 'volume-up-fill', className: 'lp-quiet' })}</div>`;
    }
    function audioNotice(v) {
      if (!['failed', 'blocked'].includes(v.audio?.status)) return '';
      return `<div class="lp-notice" role="status"><p>${escape(v.audio.status === 'blocked' ? c.audioBlocked : c.audioFailed)}</p>${button('retry-audio', c.audioRetry, { symbol: 'volume-up-fill', className: 'lp-quiet' })}</div>`;
    }
    function footer(v, body, message = '') { return `<footer class="lp-footer">${message}${audioNotice(v)}<div class="lp-footer-inner">${body}</div></footer>`; }
    function sessionMetrics(v) {
      const s = v.settlement, text = unit.settlement || {};
      if (!s) return [];
      const seconds = Math.floor(s.elapsedMs / 1000);
      const duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
      return [
        { label: text.questions || '完成题目', value: s.completed, symbol: 'check-circle-fill' },
        { label: s.assessed ? text.streak || '最佳连对' : text.listened || '听过词句', value: s.assessed ? `×${s.bestStreak}` : s.heard, symbol: s.assessed ? 'record-circle-fill' : 'volume-up-fill', asset: s.assessed ? text.metricAssets?.streak : null },
        { label: text.time || '本次用时', value: duration, symbol: unit.icons.clock ? 'clock' : 'arrow-clockwise', asset: text.metricAssets?.time }
      ];
    }
    function settlement(v, { title, message, context = '', metrics = sessionMetrics(v), secondary = '', passed = true }) {
      const metricArt = m => m.asset || (m.symbol === 'check-circle-fill' && unit.settlement?.metricAssets?.completed);
      const art = passed && unit.settlement?.celebrationAsset
        ? `<img class="lp-settlement-mascot" src="${escape(unit.settlement.celebrationAsset)}" alt="开心庆祝的探险猫" width="260" height="260" decoding="async">`
        : image('explorer-cat', 'lp-settlement-mascot');
      return `<section class="lp-celebration lp-settlement${passed ? ' is-passed' : ' is-failed'}" aria-labelledby="settlement-title">
        <div class="lp-settlement-hero">${art}</div>
        <div class="lp-settlement-copy">${context ? `<p class="lp-settlement-context">${escape(context)}</p>` : ''}<h1 id="settlement-title" tabindex="-1" data-lesson-title>${escape(title)}</h1><p class="lp-settlement-message">${escape(message)}</p></div>
        <dl class="lp-settlement-stats" aria-label="${v.mode === 'summary' ? '全部学习记录' : v.screen === 'placement-result' ? '本次跳级测试表现' : '本次练习表现'}">${metrics.map((m, i) => `<div class="lp-settlement-stat stat-${i}"><dt>${escape(m.label)}</dt><dd${String(m.value).length > 4 ? ' class="has-long-value"' : ''}>${metricArt(m) ? `<img class="lp-settlement-metric-art" src="${escape(metricArt(m))}" alt="" width="36" height="36">` : icon(m.symbol)}<span data-settlement-value>${escape(m.value)}</span></dd></div>`).join('')}</dl>
        ${secondary ? `<div class="lp-settlement-secondary">${secondary}</div>` : ''}
      </section>${footer(v, button('map', c.seePath, {className:'lp-primary lp-settlement-return'}))}`;
    }
    function chatLine(ref, v, { actorId = null, interactive = false, content = null, blank = false, current = false } = {}) {
      const source = unit.sources[ref];
      const actor = actorId || unit.sourceActors?.[ref] || (source.speaker === 'woman' ? 'handbag-owner' : 'station-keeper');
      const active = ['playing', 'paused'].includes(v.audio?.status) ? v.audio.sequence[v.audio.index]?.ref === ref : current;
      return `<article class="lp-chat-row ${unit.entities[actor].align === 'right' || actor === 'handbag-owner' ? 'is-owner' : 'is-keeper'}${active ? ' is-speaking' : ''}${blank ? ' is-reply' : ''}" data-turn-ref="${escape(ref)}"${active ? ' aria-current="true"' : ''}>${v.storyActivityId ? '' : `<span class="lp-chat-avatar">${image(actor)}</span>`}<div class="lp-chat-message"><span class="lp-chat-name">${escape(unit.speakerLabels?.[ref] || unit.entities[actor].title)}</span><div class="lp-chat-bubble">${content === null ? `<p lang="en">${escape(source.text)}</p>` : content}${interactive ? button('line-play', '', { id: ref, symbol: 'volume-up-fill', className: 'lp-icon-button lp-line-play', label: `${c.hearLine} ${source.text}` }) : ''}</div></div></article>`;
    }
    function interactiveStory(a, v) {
      const parent = unit.activities[v.storyActivityId], beat = parent.beats[v.storyIndex];
      const answered = Boolean(v.feedback && v.feedback !== 'retry');
      const returnFact = parent.returnFact || 'handbag-returned';
      const returned = parent.beats.some(b => b.kind === 'checkpoint' && unit.activities[b.activityId].storyFact === returnFact && v.storyBeats[b.id]) || a.storyFact === returnFact && answered;
      const castIds = a.castChoice ? a.options.map(o => o.entityId) : beat.visibleActorIds || parent.actorEntityIds;
      const focusId = beat.focusEntityId === undefined ? parent.focusEntityId : beat.focusEntityId;
      const cast = `<div class="lp-story-cast${returned ? ' is-returned' : ''}${a.castChoice ? ' is-choice' : ''}${focusId ? '' : ' has-no-object'}" style="--cast-count:${castIds.length}" role="group" aria-label="${escape(c.sceneLabel)}">${castIds.map(id => {
        const active = beat.actorEntityId === id;
        const selected = v.selected.includes(id), accepted = answered && a.answer.includes(id);
        const content = `${image(id)}<span class="lp-character-name">${escape(unit.entities[id].title)}</span>`;
        const cue = `<span class="lp-character-action" aria-hidden="true">${icon(accepted ? 'check-circle-fill' : selected ? 'record-circle-fill' : 'circle')}<span>${escape(accepted ? c.confirmed : selected ? c.selected : answered ? c.notSelected : c.chooseCat)}</span></span>`;
        return a.castChoice ? `<button type="button" class="lp-story-character${selected ? ' is-selected' : ''}${accepted ? ' is-accepted' : ''}${selected && v.feedback === 'retry' ? ' is-retry' : ''}" data-action="select" data-id="${escape(id)}" aria-label="${escape(`${c.chooseCat} ${unit.entities[id].title}`)}" aria-pressed="${selected}"${v.feedback ? ' disabled' : ''}>${content}${cue}</button>` : `<div class="lp-story-character${active && v.storyRevealed ? ' is-speaking' : ''}">${content}</div>`;
      }).join('')}${focusId ? image(focusId, 'lp-story-object') : ''}</div>`;
      const lines = parent.beats.filter((b, i) => b.kind === 'line' && (i < v.storyIndex || i === v.storyIndex && v.storyRevealed));
      const stage = parent.sceneEntityId ? `<figure class="lp-learning-scene">${image(parent.sceneEntityId, 'lp-scene-painting', true)}</figure>` : cast;
      const transcript = lines.length ? `<div class="lp-story-transcript lp-chat" tabindex="0" role="region" aria-label="${escape(c.previousLines)}">${lines.map(b => chatLine(b.ref, v, { actorId: b.actorEntityId, interactive: Boolean(v.storyBeats[b.id] || b.id === beat.id && v.storyLineDone), current: b.id === beat.id && v.storyRevealed })).join('')}</div>` : '';
      const support = v.storyHelp && beat.noteRef ? `<p class="lp-hint">${escape(unit.sources[beat.noteRef].text)}</p>` : '';
      const checkpoint = beat.kind === 'checkpoint' ? `${!a.castChoice && !answered ? choices(a, v) : ''}${!v.feedback && v.hintLevel ? `<p class="lp-hint">${escape(a.hints[v.hintLevel - 1])}${(a.noteRefs || []).map(ref => `<span class="lp-source-note">${escape(unit.sources[ref].text)}</span>`).join('')}</p>` : ''}${feedback(a, v)}` : '';
      return `<div class="lp-interactive-story${parent.narrative ? ' is-narrative' : ''}${beat.kind === 'checkpoint' ? ' is-checkpoint' : ''}${a.castChoice ? ' is-cast-question' : ''}">${a.castChoice ? transcript + stage : stage + transcript}${support}${checkpoint}</div>`;
    }
    function answerTokens(a, v) {
      return v.selected.map(id => {
        const text = a.options.find(option => option.id === id).text;
        return button('select', text, { id, className: 'lp-token is-selected', symbol: 'x-lg', label: `${c.removeWord} ${text}`, language: 'en', disabled: Boolean(v.feedback) });
      }).join('');
    }
    function conversation(a, v) {
      const cv = a.conversation, answered = v.feedback && v.feedback !== 'retry';
      const content = answered ? null : a.kind === 'order' && v.selected.length ? `<div class="lp-reply-tokens">${answerTokens(a, v)}</div>` : v.selected.length ? `<p lang="en">${escape(a.options.find(o => o.id === v.selected[0]).text)}</p>` : `<p class="lp-reply-placeholder">${escape(cv.prompt)}</p>`;
      const interactive = !v.feedback || Boolean(answered && v.feedbackDone);
      return `<div class="lp-chat lp-conversation" aria-label="${escape(c.conversation)}">${cv.contextRefs.map(ref => chatLine(ref, v, { interactive })).join('')}${chatLine(cv.replyRef, v, { actorId: cv.replyActorId, blank: !answered, content, interactive: Boolean(answered && v.feedbackDone) })}${answered ? cv.continuationRefs.map(ref => chatLine(ref, v, { interactive: v.feedbackDone })).join('') : ''}</div>`;
    }
    function cloze(a, v) {
      const cv = a.cloze, answered = v.feedback && v.feedback !== 'retry';
      const word = v.selected.length ? a.options.find(option => option.id === v.selected[0]).text : '…';
      const content = answered ? null : `<p lang="en">${escape(cv.prefix)}<span class="lp-cloze-slot">${escape(word)}</span>${escape(cv.suffix)}</p>`;
      return `${a.guideRef ? `<p class="lp-phrase-example" lang="en">${escape(unit.sources[a.guideRef].text)}</p>` : ''}<div class="lp-chat lp-cloze">${chatLine(cv.replyRef, v, { actorId: cv.actorId, content, blank: !answered })}</div>`;
    }
    function matching(a, v) {
      const pairs = v.matchedPairs;
      const wordColumn = `<div class="lp-match-column" role="group" aria-label="${escape(c.matchWord)}">${v.matchWordOrder.map(ref => {
        const paired = Boolean(pairs[ref]), selected = v.matchWord === ref;
        return button(paired ? 'match-listen' : 'match-word', unit.sources[ref].text, { id: ref, className: `lp-match-tile lp-match-word${paired ? ' is-paired' : ''}${selected ? ' is-selected' : ''}`, pressed: paired ? null : selected, language: 'en', symbol: paired ? 'volume-up-fill' : selected ? 'record-circle-fill' : '', label: paired ? `${c.hearLine} ${unit.sources[ref].text}` : '' });
      }).join('')}</div>`;
      const imageColumn = `<div class="lp-match-column" role="group" aria-label="${escape(c.matchPicture)}">${v.matchImageOrder.map(id => {
        const paired = Object.values(pairs).some(pair => pair.entityId === id), selected = v.matchImage === id;
        return `<button type="button" data-action="match-image" data-id="${escape(id)}" class="lp-match-tile lp-match-image${paired ? ' is-paired' : ''}${selected ? ' is-selected' : ''}" aria-label="${escape(unit.entities[id].title)}" aria-pressed="${selected}"${paired ? ' disabled' : ''}>${image(id)}${paired ? icon('check-lg') : selected ? icon('record-circle-fill') : ''}</button>`;
      }).join('')}</div>`;
      const message = v.feedback ? c.matchComplete : v.matchMessage === 'retry' ? c.matchRetry : v.matchMessage === 'modeled' ? c.matchModelNote : v.matchMessage === 'correct' ? c.matchDone : '';
      return `<div class="lp-match-board">${wordColumn}${imageColumn}</div><p class="lp-match-status${v.matchMessage === 'retry' ? ' is-retry' : ''}" role="status">${escape(message)}</p>`;
    }
    function choices(a, v) {
      if (a.conversation && v.feedback && v.feedback !== 'retry') return '';
      const chosen = a.kind === 'order' && !a.conversation ? `<div class="lp-answer-line" aria-label="${escape(c.selectOrder)}">${v.selected.length ? v.selected.map(id => {
        const o = a.options.find(option => option.id === id);
        return button('select', o.text, { id, className: 'lp-token is-selected', symbol: 'x-lg', label: `${c.removeWord} ${o.text}`, language: 'en', disabled: Boolean(v.feedback) });
      }).join('') : `<span>${escape(c.selectOrder)}</span>`}</div>` : '';
      const images = a.options.every(o => o.type === 'image');
      return `${chosen}<div class="lp-options${images ? ' lp-picture-options' : ''}${a.kind === 'order' ? ' lp-word-bank' : ''}${a.conversation ? ' lp-reply-options' : ''}" role="group" aria-label="${escape(a.conversation ? c.chooseReply : c.instructionLabel)}">${v.optionOrder.map(id => {
        const o = a.options.find(option => option.id === id), selected = v.selected.includes(id);
        const accepted = v.feedback && v.feedback !== 'retry' && a.answer.includes(id);
        const marker = `<span class="lp-choice-marker" aria-hidden="true">${icon(a.kind === 'order' ? 'plus-lg' : accepted ? 'check-circle-fill' : selected ? 'record-circle-fill' : 'circle')}</span>`;
        return `<button type="button" data-action="select" data-id="${escape(id)}" class="lp-option${selected ? ' is-selected' : ''}${accepted ? ' is-accepted' : ''}${selected && v.feedback === 'retry' ? ' is-retry' : ''}${a.kind === 'order' && selected ? ' is-placed' : ''}" aria-pressed="${selected}"${v.feedback || !v.requiredDone || a.kind === 'order' && selected ? ' disabled' : ''}>${marker}${o.type === 'image' ? `${image(o.entityId, 'lp-option-image')}<span class="lp-option-name">${escape(unit.entities[o.entityId].title)}</span>` : `<span lang="${o.lang === 'zh' ? 'zh-Hans' : 'en'}">${escape(o.text)}</span>`}</button>`;
      }).join('')}</div>`;
    }
    function vocabulary(a, v) {
      return `${a.sceneEntityId ? `<figure class="lp-learning-scene lp-vocabulary-scene">${image(a.sceneEntityId,'lp-scene-painting')}</figure>` : ''}${a.guideRef ? `<div class="lp-phrase-example"><p lang="en">${escape(unit.sources[a.guideRef].text)}</p>${a.guideCaption ? `<small>${escape(a.guideCaption)}</small>` : ''}</div>` : ''}<div class="lp-vocabulary" role="group" aria-label="${escape(a.title)}">${a.items.map(item => {
        const active = v.audio?.purpose === 'word' && ['playing', 'paused'].includes(v.audio.status) && v.audio.sequence[v.audio.index]?.ref === item.sourceRef;
        const heard = v.heardWords.includes(item.sourceRef);
        const queued = (v.wordQueue || []).includes(item.sourceRef);
        const cue = queued ? c.wordQueued || '待播放' : active ? c.wordPlaying : heard ? c.replay : a.audioType === 'sentence' && c.listenExample ? c.listenExample : c.wordListen;
        return `<button type="button" class="lp-vocabulary-card${item.presentation === 'text' ? ' lp-text-card' : ''}${active ? ' is-speaking' : ''}${queued ? ' is-queued' : ''}${heard ? ' is-heard' : ''}" data-action="word-play" data-id="${escape(item.sourceRef)}" aria-label="${escape(`${c.wordListen} ${unit.sources[item.sourceRef].text}${queued ? '，' + cue : ''}`)}"${active ? ' aria-current="true"' : ''}>${item.presentation === 'text' ? '' : image(item.entityId, 'lp-vocabulary-image')}<span class="lp-vocabulary-caption"><strong lang="en">${escape(item.term || unit.sources[item.sourceRef].text)}</strong><span>${escape(item.caption || unit.entities[item.entityId]?.title)}</span></span>${heard ? `<span class="lp-word-heard" aria-label="${escape(c.wordHeard)}">${icon('check-circle-fill')}</span>` : ''}<span class="lp-word-cue" aria-hidden="true">${icon('volume-up-fill')}<span>${escape(cue)}</span></span></button>`;
      }).join('')}</div>`;
    }
    function feedback(a, v) {
      if (!v.feedback) return '';
      const label = ({ correct: c.correct, supported: c.supported, modeled: c.modeled, retry: c.retry })[v.feedback];
      const spokenLines = a.feedbackAudio.length > 1 ? a.feedbackAudio.map(entry => entry.text) : [a.feedbackText];
      const english = v.storyActivityId || a.listening || a.cloze || a.conversation ? '' : spokenLines.filter(Boolean).map(text => `<p class="lp-feedback-english" lang="en">${escape(text)}</p>`).join('');
      return `<section class="lp-feedback ${v.feedback === 'retry' ? 'lp-feedback-retry' : 'lp-feedback-success'}" aria-live="polite" tabindex="-1"><div class="lp-feedback-title">${icon(v.feedback === 'retry' ? 'lightbulb' : 'check-circle-fill')}<strong>${escape(label)}</strong></div>${v.feedback === 'retry' ? `<p>${escape(v.inputDiagnostic?.feedback || a.wrongFeedback || a.hints[Math.min(v.hintLevel, 2) - 1])}</p>` : english}</section>`;
    }
    function renderMap(v) {
      if (unit.courseId) return renderCourseMap(v);
      const first = v.nodes.find(n => !n.done), next = first && unit.nodes.find(n => n.id === first.id);
      return `${header(v)}<div class="lp-map"><section class="lp-map-intro"><div><p class="lp-kicker">${escape(c.lessonLabel)}</p><h1>${escape(unit.title)}</h1><p>${escape(c.pathBody)}</p></div>${image('explorer-cat', 'lp-map-cat')}</section><ol class="lp-path" aria-label="${escape(c.learningPath)}">${unit.nodes.map((node, i) => {
        const n = v.nodes[i];
        const status = n.pendingRole ? c.rolePending : n.done ? c.passed : n.completeActivities ? `${n.completeActivities} / ${node.activityIds.length} ${c.stepLabel}` : node.duration;
        return `<li class="lp-path-step${n.done ? ' is-done' : ''}${n.available ? ' is-available' : ''}"><button class="lp-node" type="button" data-action="open-node" data-id="${node.id}" aria-label="${escape(`${c.nodePrefix} ${i + 1} ${c.nodeSuffix} ${node.title} ${n.pendingRole ? c.rolePending : n.done ? c.passed : n.available ? c.inProgress : c.locked}`)}"${!n.available ? ' disabled' : ''}>${icon(n.done ? 'check-lg' : n.available ? node.icon : 'lock-fill')}</button><div><span class="lp-node-number">${escape(c.nodePrefix)} ${i + 1} ${escape(c.nodeSuffix)}</span><h2>${escape(node.title)}</h2><p>${escape(status)}</p>${n.available ? button('open-node', n.pendingRole ? c.roleRecovery : n.done ? c.repeatLabel : n.completeActivities ? c.resume : c.start, { id: node.id, className: 'lp-path-action' }) : ''}</div></li>`;
      }).join('')}</ol><section class="lp-review-card">${icon('arrow-clockwise')}<div><h2>${escape(c.reviewTitle)}</h2><p>${escape(v.dueCount ? c.reviewBody : c.reviewEmpty)}</p></div>${button('review', c.reviewStart, { disabled: !v.dueCount, className: 'lp-secondary' })}</section>${v.legacyAvailable ? `<aside class="lp-legacy"><p>${escape(c.legacyMessage)}</p><a href="${escape(unit.legacy.href)}">${escape(c.legacyLink)}</a></aside>` : ''}</div>${next ? footer(v, `<p class="lp-footer-caption">${escape(next.title)}</p>${button('open-node', first.completeActivities ? c.resume : c.start, { id: next.id, className: 'lp-primary', symbol: 'arrow-right' })}`) : ''}`;
    }
    function renderCourseMap(v) {
      if (unit.journey) {
        const journey = typeof module === 'object' && module.exports ? require('./learning-journey') : root.CanranCore.learningJourney;
        return journey.render(unit, v);
      }
      const first = v.nodes.find(n => !n.done), next = first && unit.nodes.find(n => n.id === first.id);
      let chapterId = null;
      const route = unit.nodes.map((node, i) => {
        const n = v.nodes[i], chapter = unit.chapters.find(ch => ch.id === node.chapterId);
        const chapterHeading = chapterId !== node.chapterId ? `<li class="lp-chapter"><h2>${escape(chapter.title)}</h2></li>` : '';
        chapterId = node.chapterId;
        const status = n.done ? c.passed : n.completeActivities ? `${n.completeActivities} / ${node.activityIds.length} ${c.stepLabel}` : node.duration;
        return chapterHeading + `<li class="lp-path-step${n.done ? ' is-done' : ''}${n.available ? ' is-available' : ''}${node.kind === 'review' ? ' is-review' : ''}"><button class="lp-node" type="button" data-action="open-node" data-id="${node.id}" aria-label="${escape(`第 ${i+1} 关 ${node.title} ${n.done ? c.passed : n.available ? c.inProgress : c.locked}`)}"${n.available ? '' : ' disabled'}>${icon(n.done ? 'check-lg' : n.available ? node.icon : 'lock-fill')}</button><div><span class="lp-node-number">${node.kind === 'review' ? '复习' : '第 '+(i+1)+' 关'}</span><h3>${escape(node.title)}</h3><p>${escape(status)}</p>${n.available ? button('open-node',n.done ? c.repeatLabel : n.completeActivities ? c.resume : c.start,{id:node.id,className:'lp-path-action'}) : ''}</div></li>`;
      }).join('');
      const daily = `<li class="lp-path-step lp-daily-review"><button class="lp-node" type="button" data-action="review" aria-label="${escape(c.reviewTitle)}"${v.dueCount ? '' : ' disabled'}>${icon('arrow-clockwise')}</button><div><span class="lp-node-number">间隔复习</span><h3>${escape(c.reviewTitle)}</h3><p>${escape(v.dueCount ? v.dueCount+' 道题，记得更牢' : c.reviewEmpty)}</p>${v.dueCount ? button('review',c.reviewStart,{className:'lp-path-action'}) : ''}</div></li>`;
      return `${header(v)}<div class="lp-map"><section class="lp-map-intro"><div><p class="lp-kicker">${escape(c.lessonLabel)}</p><h1>${escape(unit.title)}</h1></div>${image('explorer-cat','lp-map-cat')}</section><ol class="lp-path lp-course-path" aria-label="${escape(c.learningPath)}">${route}${daily}</ol><div class="lp-reference-entry">${button('references',c.references,{className:'lp-secondary',symbol:'book'})}${!next ? button('course-summary','学习记录',{className:'lp-secondary',symbol:'check-circle-fill'}) : ''}</div></div>${next ? footer(v,`<p class="lp-footer-caption">${escape(next.title)}</p>${button('open-node',first.completeActivities ? c.resume : c.start,{id:next.id,className:'lp-primary',symbol:'arrow-right'})}`) : ''}`;
    }
    function renderReferences(v) {
      return `${header(v,c.references)}<div class="lp-lesson lp-references"><h1>${escape(c.references)}</h1>${unit.referenceGroups.map(group => {
        const open = v.referenceGroupId === group.id;
        return `<section class="lp-reference-group">${button('reference-section',group.title,{id:group.id,className:'lp-reference-toggle',pressed:open,symbol:open ? 'chevron-up' : 'chevron-down'})}${open ? `<div class="lp-reference-lines">${group.sourceRefs.map(ref => {
          const source = unit.sources[ref], isNote = /-N/.test(ref);
          const active = ['playing','paused'].includes(v.audio?.status) && v.audio?.sequence[v.audio.index]?.ref === ref;
          return `<article class="lp-reference-line${active ? ' is-speaking' : ''}"><p lang="${isNote ? 'zh-Hans' : 'en'}">${escape(source.text)}</p>${source.audioSrc ? button(active ? v.audio.status === 'playing' ? 'pause' : 'resume-audio' : 'reference-play','',{id:ref,className:'lp-icon-button',symbol:active && v.audio.status === 'playing' ? 'pause-fill' : 'volume-up-fill',label:(active ? v.audio.status === 'playing' ? c.pause : c.play : c.hearLine)+' '+source.text}) : ''}</article>`;
        }).join('')}</div>` : ''}</section>`;
      }).join('')}</div>${footer(v,button('map',c.referenceBack,{className:'lp-primary'}))}`;
    }
    function exerciseBody(q,v){
      const r=v.response||exercises.empty(),locked=Boolean(v.feedback),ordered=v.exerciseOptionOrder||q.options.map(o=>o.id);
      const tile=(o,css='lp-option',selected=r.selected.includes(o.id))=>`<button type="button" data-action="exercise-select" data-id="${escape(o.id)}" class="${css==='lp-token'?'lp-button ':''}${css}${selected?' is-selected':''}${q.mechanism==='order'&&css==='lp-option'&&selected?' is-placed':''}" aria-pressed="${selected}"${locked||q.mechanism==='order'&&css==='lp-option'&&selected?' disabled':''}>${o.entityId?`${image(o.entityId,'lp-option-image')}<span>${escape(unit.entities[o.entityId].title)}</span>`:`<span lang="${o.lang==='zh'?'zh-Hans':'en'}">${escape(o.text)}</span>`}</button>`;
      const sounds=q.mechanism==='pairs'?'':(q.listenRefs||[]).map((ref,i)=>button('exercise-listen',q.listenRefs.length===1?'播放声音':'播放第 '+(i+1)+' 段',{id:ref,symbol:'volume-up-fill',className:'lp-secondary',label:'播放'+(q.listenRefs.length===1?'声音':'第 '+(i+1)+' 段声音')})).join('');
      const listen=sounds?`<div class="lp-exercise-audio">${sounds}<p role="status">${q.listenRefs.every(ref=>v.heardRefs?.includes(ref))?'听完了，可以重听。':'听完声音，再检查答案。'}</p></div>`:'';
      const context=(q.contextRefs||[]).map(ref=>`<p class="lp-phrase-example" lang="en">${escape(unit.sources[ref].text)}</p>`).join('');
      let content='';
      if(q.mechanism==='pairs'){
        content=`<div class="lp-match-board lp-audio-pairs"><div class="lp-match-column">${q.pairs.map((p,i)=>{const pair=r.pairs.find(x=>x[0]===p.id),chosen=pair&&q.options.find(o=>o.id===pair[1]),heard=v.heardRefs?.includes(p.sourceRef),playing=v.audio?.status==='playing'&&v.audio.sequence?.[v.audio.index]?.ref===p.sourceRef;return button(locked?'exercise-listen':'exercise-select','录音 '+(i+1)+(heard?' ✓':'')+(chosen?' · '+chosen.text:''),{id:locked?p.sourceRef:p.id,className:'lp-match-tile'+(!locked&&r.anchor===p.id||playing?' is-selected':''),symbol:'volume-up-fill',pressed:locked?null:r.anchor===p.id,label:'录音 '+(i+1)+(playing?'，播放中':heard?'，已听完':'，还没听完')+(chosen?'，搭档 '+chosen.text:'')});}).join('')}</div><div class="lp-match-column">${ordered.map(id=>{const o=q.options.find(o=>o.id===id);return tile(o,'lp-match-tile',r.pairs.some(p=>p[1]===id));}).join('')}</div></div><p role="status" class="lp-exercise-count">已配 ${r.pairs.length} / ${q.pairs.length} 组 · 已听完 ${q.listenRefs.filter(ref=>v.heardRefs?.includes(ref)).length} / ${q.listenRefs.length} 段。${v.feedback?v.feedback==='retry'?'看看提示，再重新选择搭档。':'这一组完成啦，点录音还可以重听。':q.listenRefs.every(ref=>v.heardRefs?.includes(ref))?'可以检查了；点录音可重听或更换搭档。':'请把没有 ✓ 的录音听完整，再检查。'}</p>`;
      }else if(q.mechanism==='repair'){
        content=`<div class="lp-repair-sentence" role="group" aria-label="点选需要修改的词">${q.words.map(o=>tile(o,'lp-token')).join('')}</div>${r.selected.length?`<p>把这个词换成：</p><div class="lp-options">${ordered.map(id=>q.options.find(o=>o.id===id)).filter(o=>o.group==='replacement').map(o=>tile(o)).join('')}</div>`:'<p class="lp-exercise-count">先点句中的一个词。</p>'}`;
      }else if(q.mechanism==='mission'){
        content=q.steps.map((label,i)=>i<=r.selected.length?`<section class="lp-mission-step"><h2>${i+1}. ${escape(label)}</h2><div class="lp-options lp-picture-options">${ordered.map(id=>q.options.find(o=>o.id===id)).filter(o=>o.stage===i).map(o=>tile(o)).join('')}</div></section>`:'').join('');
      }else{
        const selected=r.selected.map(id=>q.options.find(o=>o.id===id));
        if(q.mechanism==='order')content=`<div class="lp-answer-line" aria-label="已选词块，点一下可撤回">${selected.length?selected.map(o=>tile(o,'lp-token',true)).join(''):'按顺序点选下面的词块'}</div>`;
        if(q.mechanism==='cloze')content=`<p class="lp-phrase-example" lang="en">${escape(q.prefix)}<span class="lp-cloze-slot">${escape(selected[0]?.text||'…')}</span>${escape(q.suffix)}</p>`;
        if(q.mechanism==='multi')content=`<p class="lp-exercise-count" role="status">选 ${q.answer.length} 个 · 已选 ${r.selected.length} 个，可再次点选撤回</p>`;
        content+=`<div class="lp-options${q.mechanism==='order'?' lp-word-bank':''}${q.options.every(o=>o.entityId)?' lp-picture-options':''}" role="group" aria-label="作答选项">${ordered.map(id=>q.options.find(o=>o.id===id)).map(o=>tile(o)).join('')}</div>`;
      }
      if(q.mechanism==='repair'&&v.feedback&&!['retry','incorrect'].includes(v.feedback))content=`<p class="lp-phrase-example" lang="en">${escape(q.feedbackText)}</p>`;
      return `<div class="lp-exercise" data-exercise-id="${escape(q.id)}" data-exercise-form="${q.form}">${q.activityGroup?`<p class="lp-kicker">${escape(q.activityGroup)}</p>`:''}${q.sceneEntityId?`<figure class="lp-learning-scene">${image(q.sceneEntityId,'lp-scene-painting')}</figure>`:''}${context}${listen}${content}${pictureChoice(q)?'':exerciseFeedback(q,v)}</div>`;
    }
    function pictureChoice(q){return !q.castChoice&&(q.kind==='choice'||q.mechanism==='choice')&&q.options.length>0&&q.options.every(o=>o.entityId);}
    function pictureFeedback(q,v){return pictureChoice(q)?`<div class="lp-picture-feedback-slot">${(q.kind==='exercise'?exerciseFeedback(q,v):feedback(q,v))||'<p class="lp-supporting">选好图片后，点「检查」。</p>'}</div>`:'';}
    function exerciseFeedback(q,v){
      const success=v.feedback&&!['retry','incorrect'].includes(v.feedback),hinted=v.challengeHintUsed||v.hintLevel;
      return v.feedback?`<section class="lp-feedback ${success?'lp-feedback-success':'lp-feedback-retry'}" aria-live="polite" tabindex="-1"><strong>${success?'答对了！':v.feedback==='incorrect'?'这次没选对':'再试一次'}</strong>${q.mechanism==='repair'&&success?'':`<p${success||v.feedback==='incorrect'?' lang="en"':''}>${escape(success?q.outcome||q.feedbackText:v.feedback==='incorrect'?q.feedbackText:q.hint)}</p>`}</section>`:hinted&&v.screen!=='placement'?`<p class="lp-hint">${escape(q.hint)}</p>`:'';
    }
    function exercisePrompt(q){return `<div class="lp-exercise-prompt">${!q.sceneEntityId?image(q.actorId||'explorer-cat','lp-exercise-guide'):''}<p>${escape(q.prompt)}</p></div>`;}
    function exerciseActions(q,v,mode){
      const actions=mode==='challenge'?['challenge-check','challenge-next','challenge-retry','challenge-hint']:mode==='placement'?['placement-check','placement-next',null,null]:['check','continue','retry','hint'];
      if(v.feedback)return `${v.feedback!=='retry'&&unit.sources[q.sourceRef]?.audioSrc?button('exercise-listen','听示范',{id:q.sourceRef,symbol:'volume-up-fill',className:'lp-quiet'}):''}${button(v.feedback==='retry'?actions[2]:actions[1],v.feedback==='retry'?'重新选择':'继续',{className:'lp-primary'})}`;
      return `${actions[3]?button(actions[3],'提示',{className:'lp-quiet',symbol:'lightbulb',disabled:Boolean(v.challengeHintUsed||v.hintLevel)}):''}${button(actions[0],'检查',{className:'lp-primary',disabled:!exercises.ready(q,v.response,v.heardRefs)})}`;
    }
    function renderChallenge(v) {
      const challenge = unit.challenges.find(item => item.id === v.challengeId) || {id:'grammar',lessonLabel:'Lesson 49 & 50',questions:[]};
      const progress = v.record.challenges?.[challenge.id] || {answers:[]};
      if (v.screen === 'challenge-intro') {
        const finished = Boolean(progress.completedAt),old=v.record.keyboardArchive?.record.challenges?.[challenge.id];
        const archive=old?.answers.length?`<details class="lp-history"><summary>查看以前完成的 ${old.answers.length} 题</summary><ol>${old.answers.map(a=>`<li><span lang="en">${escape(a.value)}</span><small>${escape(a.at.slice(0,10))} · ${a.evidence==='supported'?'有提示完成':'当时未用额外提示'}</small></li>`).join('')}</ol></details>`:'';
        return `${header(v,'小镇挑战')}<section class="lp-lesson lp-challenge-intro">${image('explorer-cat')}<p class="lp-kicker">${escape(challenge.lessonLabel)} · 选做</p><h1 tabindex="-1" data-lesson-title>${escape(challenge.title)}</h1><p>听一听，选一选，把学过的话用起来。</p><p class="lp-challenge-count">${(progress.legacyCount||0)+progress.answers.length} / ${challenge.questions.length} 题</p>${archive}${progress.legacyCount || progress.answers.length || progress.draft ? button('reset-request',finished ? '再挑战一次' : '重新开始',{scope:'challenge',id:challenge.id,className:'lp-secondary'}) : ''}</section>${footer(v,finished ? button('map',c.seePath,{className:'lp-primary'}) : button('challenge-start',progress.legacyCount || progress.answers.length || progress.draft ? '继续挑战' : '开始挑战',{className:'lp-primary'}))}`;
      }
      if (v.screen === 'challenge-complete') {
        return settlement(v, {title:unit.settlement?.challengeTitle || '小镇挑战完成！', context:challenge.lessonLabel,
          message:v.settlement?.independent ? `本次未用额外提示答对 ${v.settlement.independent} 题，做得好！` : '练习完成，再试会更熟练。',
          secondary:button('reset-request','再挑战一次',{scope:'challenge',id:challenge.id,className:'lp-quiet'})});
      }
      const q = v.reviewQuestion || challenge.questions[v.challengeIndex], feedback = v.feedback;
      const body=`<div class="lp-lesson lp-challenge"><h1 tabindex="-1" data-lesson-title>${escape(q.title)}</h1>${exercisePrompt(q)}${exerciseBody(q,v)}</div>`;
      return `${header(v,v.mode==='review'?'今日复习':'小镇挑战')}${body}${footer(v,exerciseActions(q,v,'challenge'),pictureFeedback(q,v))}`;
    }
    function renderPlacement(v) {
      const config=unit.placement, attempt=v.placementAttempt, chapter=unit.chapters.find(ch=>ch.id===v.placementId);
      const label='Lesson '+chapter.lessonIds.join(' & ');
      const wrong=v.screen==='placement-intro'&&attempt?.status!=='active'?0:attempt?.responses.filter(r=>!r.correct).length||0, remaining=config.maxMistakes-wrong;
      const hearts=`<div class="lp-placement-hearts" role="img" aria-label="剩余 ${remaining} 次机会，共 ${config.maxMistakes} 次">${Array.from({length:config.maxMistakes},(_,i)=>`<span class="${i<remaining?'is-full':'is-empty'}">${icon('heart')}</span>`).join('')}</div>`;
      const top=header(v,'跳级测试').replace('<span class="lp-header-label">跳级测试</span>',hearts);
      if(v.screen==='placement-intro') {
        const active=attempt?.status==='active';
        const interrupted=v.record.interruptedPlacements?.some(a=>a.targetId===v.placementId);
        const testedEnd=chapter.lessonIds[0]-1;
        return `${top}<section class="lp-lesson lp-placement-intro">${image('explorer-cat','lp-placement-mascot')}<p class="lp-kicker">${escape(label)}</p><h1 tabindex="-1" data-lesson-title>跳级到这里？</h1><p class="lp-placement-description">从 Lesson 1–${testedEnd} 抽取 ${config.questionCount} 题<br>重点考察要跳过的内容</p><p class="lp-placement-rule">答错 <strong>5 题</strong>，本次跳级失败</p>${interrupted&&!active?'<p>上次测试因版本更新中止，未扣机会。这次从新的 20 题开始。</p>':''}${active?`<p class="lp-placement-resume">已答 ${attempt.responses.length} / ${config.questionCount} 题 · 剩余 ${remaining} 次机会</p>`:''}</section>${footer(v,`<div class="lp-placement-actions">${button('placement-start',active?'继续测试':'开始测试',{className:'lp-primary lp-placement-start'})}${button('map','下次再说',{className:'lp-quiet'})}</div>`)}`;
      }
      if(v.screen==='placement-result') {
        const passed=attempt.status==='passed';
        let streak=0,best=0;
        for(const response of attempt.responses){streak=response.correct?streak+1:0;best=Math.max(best,streak);}
        return settlement(v,{passed,context:label,title:passed?'跳级成功！':'这次还没通过',
          message:passed?`已解锁 ${label}，开始新的探险！`:'已答错 5 题，进度保留。练一练再来！',
          metrics:[{label:'答对题数',value:`${attempt.responses.length-wrong}/${attempt.responses.length}`,symbol:'check-circle-fill'},
            {label:'最佳连对',value:`×${best}`,symbol:'record-circle-fill',asset:unit.settlement?.metricAssets?.streak},{label:'剩余机会',value:remaining,symbol:'heart'}],
          secondary:passed?'':button('placement-retry','再试一次',{className:'lp-quiet'})});
      }
      const policyVersion=attempt.responses[attempt.cursor]?.answerPolicyVersion || (attempt.responses.length>attempt.cursor?attempt.version:config.version);
      const q=(policyVersion===unit.history?.placement.version?unit.history.placement:config).questions.find(q=>q.id===attempt.questionIds[attempt.cursor]), feedback=v.feedback;
      return `${top}<div class="lp-lesson lp-placement-question"><div class="lp-lesson-heading"><h1 tabindex="-1" data-lesson-title>${escape(q.title)}</h1><span class="lp-placement-question-count">${attempt.cursor+1} / ${config.questionCount}</span></div>${exercisePrompt(q)}${exerciseBody(q,v)}</div>${footer(v,exerciseActions(q,v,'placement'),pictureFeedback(q,v))}`;
    }
    function render(v) {
      if (v.screen === 'blocked') {
        const recovery=v.recovery;
        return `<div class="station-app lp-blocked">${image('explorer-cat')}<h1>${escape(c.unsupportedRecord)}</h1><p>${recovery?.canExport?'可以重试读取，或导出原始记录留存。':'请检查这台设备的保存权限后重试。'}</p>${recovery?.confirm ? `<section role="alertdialog" aria-modal="true" aria-label="确认恢复学习记录"><p>${recovery.confirm==='restore'?'恢复这台设备上最近可用的学习备份。':'仅将这套课程从零开始，当前原始记录会另行保留。'}</p>${button('recovery-confirm','确认'+(recovery.confirm==='restore'?'恢复备份':'从零开始'),{className:'lp-primary'})}${button('recovery-cancel','取消')}</section>` : `${button('reload',c.reloadProgress,{className:'lp-primary'})}${recovery?.canExport ? button('recovery-export','导出原始记录') : ''}${recovery?.canRestore ? button('recovery-restore','恢复可用备份') : ''}${recovery?.canReset ? button('recovery-reset','这套课程从零开始') : ''}`}<small>${escape(recovery?.code || 'RECORD_UNAVAILABLE')}</small></div>`;
      }
      let html;
      if (v.screen === 'map') html = renderMap(v);
      else if (v.screen === 'references') html = renderReferences(v);
      else if (['challenge-intro','challenge','challenge-complete'].includes(v.screen)) html = renderChallenge(v);
      else if (['placement-intro','placement','placement-result'].includes(v.screen)) html = renderPlacement(v);
      else if (v.screen === 'celebration' || v.screen === 'review-complete') {
        const node = unit.nodes.find(n => n.id === v.nodeId), text = unit.settlement || {};
        const review = v.screen === 'review-complete', repeat = v.mode === 'repeat', summary = v.mode === 'summary';
        const chapter = unit.chapters?.find(ch => ch.id === node?.chapterId);
        const context = summary ? c.lessonLabel : chapter ? 'Lesson ' + chapter.lessonIds.join(' & ') : review ? c.reviewTitle : c.lessonLabel;
        const challenge = !review && !summary && unit.challenges?.find(item => item.nodeIds.includes(node?.id));
        const title = summary ? c.completedTitle : review ? text.reviewTitle || c.reviewDone : repeat ? text.repeatTitle || '越练越熟练！' : text.completedTitle || '闯关完成！';
        const message = summary ? '每一步努力，都值得记住。' : review ? text.reviewMessage : repeat ? text.repeatMessage : text.completedMessage;
        html = settlement(v, {title, context, message:message || '又前进了一步，做得好！',
          ...(summary ? {metrics:[{label:'完成关卡',value:v.nodes.filter(n=>n.done).length,symbol:'check-circle-fill'},
            {label:'学过课程',value:unit.lessonIds?.length || 2,symbol:'book'},
            {label:'完成挑战',value:Object.values(v.record.challenges || {}).filter(p=>p.completedAt).length,symbol:'star-fill'}]} : {}),
          secondary:challenge ? button('open-challenge','试试小镇挑战',{id:challenge.id,className:'lp-quiet lp-challenge-entry'}) : ''});
      } else {
        const a = unit.activities[v.activityId], node = unit.nodes.find(n => n.id === v.nodeId);
        const label = node ? `${c.nodePrefix} ${unit.nodes.indexOf(node) + 1} ${c.nodeSuffix}` : c.reviewTitle;
        let body = '', actions = '';
        if (v.storyActivityId) {
          const parent = unit.activities[v.storyActivityId], beat = parent.beats[v.storyIndex];
          body = interactiveStory(a, v);
          if (beat.kind === 'line') {
            actions = (v.storyRevealed ? playback(v) : '') + (beat.noteRef ? button('story-help', c.knowledge, { symbol: 'lightbulb', className: 'lp-quiet', pressed: v.storyHelp }) : '')
              + button(v.storyRevealed ? 'continue' : 'story-start', !v.storyRevealed ? v.storyIndex ? c.storyListen : c.storyStart : v.storyIndex === parent.beats.length - 1 ? c.finishNode : c.next, { disabled: v.storyRevealed && !v.canContinue, className: 'lp-primary' });
          } else actions = v.feedback ? button(v.feedback === 'retry' ? 'retry' : 'continue', v.feedback === 'retry' ? c.retry : c.next, { disabled: v.feedback !== 'retry' && !v.canContinue, className: 'lp-primary' })
            : `${button('hint', c.knowledge, { symbol: 'lightbulb', className: 'lp-quiet', disabled: v.hintLevel >= 2 })}${button('check', c.check, { disabled: v.selected.length !== a.answer.length, className: 'lp-primary' })}`;
        } else if (a.kind === 'exercise') {
          body=exerciseBody(a,v);actions=exerciseActions(a,v,'activity');
        } else if (a.kind === 'match') {
          body = matching(a, v);
          actions = `${['playing', 'paused'].includes(v.audio?.status) ? playback(v) : ''}<p class="lp-word-progress">${Object.keys(v.matchedPairs).length} / ${a.items.length} ${escape(c.matchedCount)}</p>${v.feedback ? button('continue', c.next, { disabled: !v.canContinue, className: 'lp-primary' }) : button('match-model', c.matchModel, { symbol: 'lightbulb', className: 'lp-quiet' })}`;
        } else if (a.kind === 'teach') {
          body = vocabulary(a, v);
          actions = `${['playing', 'paused'].includes(v.audio?.status) ? playback(v) : ''}<p class="lp-word-progress" role="status" aria-label="${escape(c.wordHeard)} ${v.heardWords.length} / ${a.items.length}">${v.heardWords.length} / ${a.items.length}</p>${button('continue', c.next, { disabled: !v.canContinue, className: 'lp-primary' })}`;
        } else {
          body = `${a.sceneEntityId ? `<figure class="lp-learning-scene">${image(a.sceneEntityId, 'lp-scene-painting', true)}</figure>` : ''}${a.scene ? scene(a, true, Boolean(a.returnOnFeedback && v.feedback && v.feedback !== 'retry')) : a.focusEntityId ? `<div class="lp-question-object">${image(a.focusEntityId)}</div>` : ''}${['audio-only', 'audio-meaning'].includes(a.channel) ? `<div class="lp-sound-prompt">${button(v.audio?.status === 'playing' ? 'pause' : v.audio?.status === 'paused' ? 'resume-audio' : 'replay-current', '', { symbol: v.audio?.status === 'playing' ? 'pause-fill' : 'volume-up-fill', className: 'lp-sound-button', label: v.audio?.status === 'playing' ? c.pause : c.play })}</div>` : ''}${a.questionText ? `<p class="lp-question-text" lang="en">${escape(a.questionText)}</p>` : ''}${a.conversation ? conversation(a, v) : a.cloze ? cloze(a, v) : a.listening && v.feedback && v.feedback !== 'retry' ? `<div class="lp-chat">${a.listening.contextRefs.map(ref => chatLine(ref, v)).join('')}</div>` : ''}${choices(a, v)}${!v.feedback && v.hintLevel ? `<p class="lp-hint" role="status">${escape(a.hints[v.hintLevel - 1])}${(a.noteRefs || []).map(ref => `<span class="lp-source-note">${escape(unit.sources[ref].text)}</span>`).join('')}</p>` : ''}${pictureChoice(a)?'':feedback(a, v)}`;
          actions = v.feedback ? v.feedback === 'retry' ? button('retry', c.retry, { className: 'lp-primary' }) : `${a.feedbackAudio.length ? playback(v) : ''}${button('continue', c.next, { disabled: !v.canContinue, className: 'lp-primary' })}` : `${!['audio-only', 'audio-meaning'].includes(a.channel) && (a.requiredAudio.length || a.conversation?.contextRefs.length) ? playback(v) : ''}${button('hint', c.knowledge, { symbol: 'lightbulb', className: 'lp-quiet', disabled: v.hintLevel >= 2 })}${button('check', c.check, { disabled: !v.requiredDone || v.selected.length !== a.answer.length, className: 'lp-primary' })}`;
        }
        html = `${header(v, v.mode === 'repeat' ? c.repeatNotice : label)}<div class="lp-lesson"><div class="lp-lesson-heading"><h1 tabindex="-1" data-lesson-title>${escape(a.title)}</h1></div>${a.prompt ? a.kind==='exercise'?exercisePrompt(a):`<p class="lp-task-context">${escape(a.prompt)}</p>` : ''}${body}</div>${footer(v, actions,pictureFeedback(a,v))}`;
      }
      if (v.saveState) html += `<div class="lp-modal-backdrop"><section class="lp-modal" role="alertdialog" aria-modal="true" aria-labelledby="lp-save-title"><h2 id="lp-save-title">${escape(v.saveState === 'conflict' ? c.saveConflict : v.saveState === 'unreadable' ? c.unsupportedRecord : c.saveFailure)}</h2>${button(v.saveState === 'failed' ? 'save-retry' : 'reload', v.saveState === 'failed' ? c.saveRetry : c.reloadProgress, { className: 'lp-primary' })}</section></div>`;
      if (v.resetRequest && !v.saveState) {
        const scope = v.resetRequest.scope;
        const title = scope === 'course' ? '全部从零开始？' : scope === 'challenge' ? '重新开始这次挑战？' : '重置所有小镇挑战？';
        const body = scope === 'course' ? '这台设备的课程进度、复习和挑战记录将重置，回到第 1 关。' : '小镇挑战记录将重置，课程路线进度保留。';
        html += `<div class="lp-modal-backdrop"><section class="lp-modal" role="alertdialog" aria-modal="true" aria-labelledby="lp-reset-title"><h2 id="lp-reset-title">${title}</h2><p>${body}</p><p>再次学习前，可以撤销这次重置。</p><div class="lp-reset-actions">${button('reset-cancel','取消',{className:'lp-secondary'})}${button('reset-confirm','确认重置',{className:'lp-primary'})}</div></section></div>`;
      }
      // Keep the package loader's existing ready-surface contract without
      // loading or coupling this renderer to V2's scene and styles.
      return `<div class="station-app lp-shell${unit.courseId ? ' lp-course' : ''}${unit.journey && v.screen === 'map' ? ' has-journey' : ''}${['celebration','review-complete','challenge-complete','placement-result'].includes(v.screen) ? ' has-settlement' : ''}">${html}</div>`;
    }
    return Object.freeze({ render });
  }
  return Object.freeze({ createRenderer, escape });
});
