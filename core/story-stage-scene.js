(function attachStoryStageScene(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.storyStageScene = api;
    root.CanranCore.lessonThreeFourScene = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function storyStageSceneFactory() {
  'use strict';

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(label, action, className = 'story-button') {
    const node = element('button', className, label);
    node.type = 'button';
    node.dataset.action = action;
    return node;
  }

  function link(label, href, className = 'story-button') {
    const node = element('a', className, label);
    node.href = href;
    return node;
  }

  function pictureFor(entity, className = '') {
    const picture = element('picture', className);
    if (entity.assets.preferred) {
      const image = document.createElement('img');
      image.src = entity.assets.preferred;
      image.alt = entity.label;
      image.decoding = 'async';
      image.draggable = false;
      picture.append(image);
      return picture;
    }
    const avif = document.createElement('source');
    avif.type = 'image/avif';
    avif.srcset = entity.assets.avif;
    const webp = document.createElement('source');
    webp.type = 'image/webp';
    webp.srcset = entity.assets.webp;
    const image = document.createElement('img');
    image.src = entity.assets.png;
    image.alt = entity.label;
    image.decoding = 'async';
    image.draggable = false;
    picture.append(avif, webp, image);
    return picture;
  }

  const preloadCache = new Map();

  function entityAssetCandidates(entity) {
    if (entity?.assets?.preferred) return [entity.assets.preferred];
    return unique([
      entity?.assets?.avif,
      entity?.assets?.webp,
      entity?.assets?.png
    ].filter(Boolean));
  }

  function imageMime(url) {
    if (/\.avif(?:\?|$)/i.test(url || '')) return 'image/avif';
    if (/\.webp(?:\?|$)/i.test(url || '')) return 'image/webp';
    if (/\.png(?:\?|$)/i.test(url || '')) return 'image/png';
    return 'image/jpeg';
  }

  function appendResponsiveSources(picture, media, urls) {
    for (const url of unique(urls.filter(Boolean))) {
      const source = document.createElement('source');
      source.media = media;
      source.type = imageMime(url);
      source.srcset = url;
      picture.append(source);
    }
  }

  function stageAssetUrls(unit, stage) {
    const entityIds = new Set(stage.propEntityIds || []);
    for (const id of stage.entityIds || []) entityIds.add(id);
    for (const round of stage.rounds || []) {
      if (round.propEntityId) entityIds.add(round.propEntityId);
      for (const id of round.entityIds || []) entityIds.add(id);
    }
    for (const group of stage.groups || []) {
      for (const id of group.entityIds || []) entityIds.add(id);
    }
    return [...entityIds]
      .map(id => entityAssetCandidates(unit.entities[id]))
      .filter(candidates => candidates.length > 0);
  }

  function decodeImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = async () => {
        try {
          if (typeof image.decode === 'function') await image.decode();
          resolve(url);
        } catch (error) {
          reject(error);
        }
      };
      image.onerror = reject;
      image.src = url;
    });
  }

  async function preloadImages(candidateGroups) {
    if (typeof Image !== 'function') return;
    await Promise.all(candidateGroups.map(async candidates => {
      const group = Array.isArray(candidates) ? candidates : [candidates];
      const key = group.join('|');
      if (!key) return;
      if (!preloadCache.has(key)) {
        preloadCache.set(key, (async () => {
          for (const url of group) {
            try {
              return await decodeImage(url);
            } catch {
              // Try the next catalog-owned format. The visible picture element
              // uses the same AVIF -> WebP -> PNG order.
            }
          }
          return null;
        })());
      }
      await preloadCache.get(key);
    }));
  }

  function unique(values) {
    return [...new Set(values)];
  }

  function uiCopy(unit) {
    const copy = unit?.experience?.uiCopy;
    if (!copy) throw new Error('Story-stage UI copy must come from the curriculum catalog');
    return copy;
  }

  function safeRead(storage, key, revision) {
    try {
      const value = JSON.parse(storage?.getItem(key) || 'null');
      return value?.revision === revision ? value : null;
    } catch {
      return null;
    }
  }

  function buildShell(root, unit) {
    const experience = unit.experience;
    const ui = uiCopy(unit);
    const shell = element('section', 'story-stage-experience cloakroom-experience');
    shell.dataset.storyStageScene = '';
    shell.dataset.theme = experience.themeId || 'cloakroom';

    const background = element('picture', 'scene-background');
    background.dataset.fixedSceneBackground = '';
    appendResponsiveSources(background, '(max-aspect-ratio: 4/5)', [
      experience.scene.backgroundPortrait,
      experience.scene.backgroundPortraitFallback
    ]);
    appendResponsiveSources(background, '(min-aspect-ratio: 4/5)', [
      experience.scene.backgroundWide,
      experience.scene.backgroundWideFallback
    ]);
    const backgroundImage = document.createElement('img');
    backgroundImage.src = experience.scene.backgroundWideFallback || experience.scene.backgroundWide;
    backgroundImage.alt = '';
    backgroundImage.decoding = 'sync';
    background.append(backgroundImage);

    const vignette = element('div', 'scene-vignette');
    const header = element('header', 'experience-header');
    const brand = element('div', 'experience-brand');
    brand.append(
      element('span', 'experience-brand__eyebrow', `NEW CONCEPT ENGLISH · ${unit.unitLabel.toUpperCase()}`),
      element('strong', 'experience-brand__title', experience.unitTitle)
    );
    const progress = button('', 'toggle-stage-map', 'compact-progress');
    progress.setAttribute('aria-label', ui.progress.openLabel);
    progress.setAttribute('aria-haspopup', 'dialog');
    const progressTrack = element('span', 'compact-progress__track');
    const progressFill = element('span', 'compact-progress__fill');
    const progressText = element('strong', 'compact-progress__text');
    progressTrack.append(progressFill);
    progress.append(progressTrack, progressText);
    const settingsButton = button(ui.settings.visibleLabel, 'toggle-settings', 'icon-button');
    settingsButton.setAttribute('aria-label', ui.settings.ariaLabel);
    settingsButton.textContent = '⚙';
    header.append(brand, progress, settingsButton);

    const stageHeading = element('div', 'stage-heading');
    const stageTitle = element('h1', 'stage-heading__title');
    const stageInstruction = element('p', 'stage-heading__instruction');
    stageHeading.append(stageTitle, stageInstruction);

    const taskPanel = element('section', 'task-ledger');
    taskPanel.dataset.taskLedger = '';

    const hearts = element('div', 'adventure-hearts');
    hearts.dataset.adventureHearts = '';
    hearts.setAttribute('aria-label', ui.settings.heartsLabel);
    for (let index = 0; index < (experience.adventureHearts?.maximum || 3); index += 1) {
      const heart = element('span', 'adventure-heart', '♥');
      heart.setAttribute('aria-hidden', 'true');
      hearts.append(heart);
    }

    const counterPlane = element('div', 'counter-plane');
    counterPlane.dataset.counterPlane = '';
    const propLayer = element('div', 'counter-props');
    propLayer.dataset.propLayer = '';
    const propNodes = {};
    for (const [entityId, entity] of Object.entries(unit.entities || {})) {
      if ((experience.scene.actorEntityIds || []).includes(entityId)) continue;
      if (!entity.assets) continue;
      const prop = pictureFor(entity, `counter-prop counter-prop--${entity.kind}`);
      prop.dataset.entityId = entityId;
      prop.dataset.stableProp = entityId;
      prop.hidden = true;
      propLayer.append(prop);
      propNodes[entityId] = prop;
    }
    counterPlane.append(propLayer);

    const actorLayer = element('div', 'actor-layer');
    actorLayer.dataset.fixedActorLayer = '';
    const actorButtons = {};
    (experience.scene.actorEntityIds || []).forEach((entityId, index) => {
      const side = index === 0 ? 'left' : 'right';
      const actor = button('', 'select-entity', `actor actor--${side}`);
      actor.dataset.entityId = entityId;
      actor.dataset.fixedActor = entityId;
      actor.append(pictureFor(unit.entities[entityId], 'actor__picture'));
      const label = element('span', 'actor__label', unit.entities[entityId].label);
      actor.append(label);
      actor.disabled = true;
      actorLayer.append(actor);
      actorButtons[entityId] = actor;
    });

    const settings = element('aside', 'settings-sheet');
    settings.hidden = true;
    settings.dataset.settingsSheet = '';
    settings.append(
      element('h2', '', ui.settings.title),
      element('p', '', ui.settings.copy),
      button(ui.settings.restartLabel, 'restart', 'story-button story-button--danger'),
      button(ui.settings.returnLabel, 'toggle-settings', 'story-button story-button--quiet')
    );

    const stageMap = element('section', 'stage-map');
    stageMap.hidden = true;
    stageMap.dataset.stageMap = '';
    stageMap.setAttribute('role', 'dialog');
    stageMap.setAttribute('aria-modal', 'true');
    stageMap.setAttribute('aria-labelledby', 'story-stage-map-title');
    const stageMapHeader = element('div', 'stage-map__header');
    const stageMapTitle = element('h2', 'stage-map__title', ui.stageMap.title);
    stageMapTitle.id = 'story-stage-map-title';
    stageMapHeader.append(stageMapTitle, button(ui.stageMap.closeLabel, 'toggle-stage-map', 'stage-map__close'));
    const stageMapCopy = element('p', 'stage-map__copy', ui.stageMap.copy);
    const stageMapGrid = element('div', 'stage-map__grid');
    const stageButtons = {};
    experience.stages.forEach((stage, index) => {
      const marker = button('', 'navigate-stage', 'stage-map-card');
      marker.dataset.stageId = stage.stageId;
      marker.append(
        element('span', 'stage-map-card__number', String(index + 1)),
        element('strong', 'stage-map-card__title', stage.title),
        element('span', 'stage-map-card__status', '')
      );
      stageMapGrid.append(marker);
      stageButtons[stage.stageId] = marker;
    });
    stageMap.append(stageMapHeader, stageMapCopy, stageMapGrid);

    const status = element('div', 'experience-status');
    status.dataset.experienceStatus = '';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    shell.append(
      background, vignette, header, stageHeading, hearts, taskPanel,
      counterPlane, actorLayer, settings, stageMap, status
    );
    root.replaceChildren(shell);
    return {
      shell, progress, progressFill, progressText, stageTitle, stageInstruction,
      hearts, taskPanel, propLayer, propNodes, settings, settingsButton, stageMap,
      stageButtons, status, actorButtons, background, actorLayer
    };
  }

  function renderProgress(nodes, unit, state) {
    const ui = uiCopy(unit);
    const total = unit.experience.stages.length;
    const resolved = unit.experience.stages.filter(stage => (
      state.completedStageIds.includes(stage.stageId) || state.skippedStageIds.includes(stage.stageId)
    )).length;
    const current = state.currentStageIndex + 1;
    nodes.progressFill.style.width = `${(resolved / total) * 100}%`;
    nodes.progressText.textContent = `${current} / ${total}`;
    nodes.progress.disabled = state.phase === 'audio-playing';
    nodes.progress.setAttribute(
      'aria-label',
      `${ui.progress.currentPrefix} ${current} ${ui.progress.currentMiddle} ${total} ${ui.progress.currentSuffix}`
    );
    for (const [index, stage] of unit.experience.stages.entries()) {
      const marker = nodes.stageButtons[stage.stageId];
      const completed = state.completedStageIds.includes(stage.stageId);
      const skipped = state.skippedStageIds.includes(stage.stageId);
      const active = index === state.currentStageIndex && !state.navigationSession;
      const status = completed
        ? ui.stageMap.completed
        : skipped
          ? ui.stageMap.skipped
          : active
            ? ui.stageMap.current
            : ui.stageMap.locked;
      marker.dataset.state = completed ? 'completed' : skipped ? 'skipped' : active ? 'current' : 'locked';
      marker.disabled = (!completed && !skipped) || state.phase === 'audio-playing';
      marker.setAttribute(
        'aria-label',
        `${ui.stageMap.stagePrefix} ${index + 1} ${ui.stageMap.stageMiddle}${stage.title}${ui.stageMap.statusSeparator}${status}`
      );
      marker.setAttribute('aria-current', active ? 'step' : 'false');
      marker.querySelector('.stage-map-card__status').textContent = status;
    }
  }

  function renderProps(nodes, unit, entityIds) {
    const visible = new Set(unique(entityIds || []));
    for (const [entityId, prop] of Object.entries(nodes.propNodes)) {
      prop.hidden = !visible.has(entityId);
    }
  }

  function appendPrompt(container, text, className = 'task-prompt') {
    if (text) container.append(element('p', className, text));
  }

  function appendAudioButton(container, label, failed = false) {
    const action = failed ? 'retry-audio' : 'play-primary';
    const node = button(label, action, 'story-button story-button--audio');
    node.prepend(element('span', 'button-icon', '▶'));
    container.append(node);
  }

  function appendOptions(container, options, state) {
    const grid = element('div', 'choice-grid');
    for (const option of options || []) {
      const choice = button(option.label, 'answer', 'choice-card');
      choice.dataset.optionId = option.optionId;
      choice.disabled = state.phase !== 'awaiting-response';
      grid.append(choice);
    }
    container.append(grid);
  }

  function entityChoiceCard(unit, entityId, hideLabel, disabled, candidateIndex = 0) {
    const ui = uiCopy(unit);
    const entity = unit.entities[entityId];
    const card = button('', 'select-entity', 'entity-card');
    card.dataset.entityId = entityId;
    card.disabled = disabled;
    const neutralLabel = `${ui.candidates.neutralAriaPrefix}${candidateIndex + 1}`;
    card.setAttribute('aria-label', hideLabel ? neutralLabel : `${ui.candidates.selectPrefix}${entity.label}`);
    card.append(pictureFor(entity, 'entity-card__picture'));
    const label = element(
      'span',
      'entity-card__label',
      hideLabel ? `${ui.candidates.neutralVisiblePrefix}${candidateIndex + 1}` : entity.label
    );
    card.append(label);
    return card;
  }

  function appendEntityChoices(container, unit, entityIds, hideLabels, state) {
    const grid = element('div', 'entity-grid');
    for (const [index, entityId] of (entityIds || []).entries()) {
      grid.append(entityChoiceCard(
        unit,
        entityId,
        hideLabels,
        state.phase !== 'awaiting-response',
        index
      ));
    }
    container.append(grid);
  }

  function renderHearts(nodes, unit, stage, state) {
    const ui = uiCopy(unit);
    const visible = stage.affectsAdventureHearts === true
      && !['unit-complete', 'replay-complete', 'makeup-complete'].includes(state.phase);
    nodes.hearts.hidden = !visible;
    if (!visible) return;
    const remaining = state.adventureHeartsRemaining;
    [...nodes.hearts.children].forEach((heart, index) => {
      heart.dataset.filled = String(index < remaining);
    });
    nodes.hearts.setAttribute('aria-label', `${ui.hearts.remainingPrefix}${remaining}${ui.hearts.remainingSuffix}`);
  }

  function renderListen(container, unit, stage, state) {
    const ui = uiCopy(unit);
    const hasUnlockedQuestion = stage.kind !== 'dialogue-comprehension'
      || ['awaiting-response', 'stage-complete'].includes(state.phase);
    appendPrompt(
      container,
      hasUnlockedQuestion ? stage.prompt : ui.task.lockedStoryCopy
    );
    if (state.phase === 'stage-ready') appendAudioButton(container, stage.actionLabel || stage.startLabel);
    if (state.phase === 'audio-failed') appendAudioButton(container, ui.audio.retryLabel, true);
    if (stage.kind === 'dialogue-comprehension' && hasUnlockedQuestion) {
      appendOptions(container, stage.options, state);
    }
  }

  function renderEntityAction(container, nodes, unit, stage, state) {
    const ui = uiCopy(unit);
    const promptLocked = stage.promptAudioRefs?.length && state.phase === 'stage-ready';
    appendPrompt(container, promptLocked ? ui.task.lockedQuestionCopy : stage.prompt);
    if (promptLocked) appendAudioButton(container, ui.audio.playQuestionLabel);
    else if (stage.entityIds?.length
      && stage.entityIds.every(id => Object.hasOwn(nodes.actorButtons, id))) {
      container.append(element('p', 'task-help', ui.task.selectScenePersonCopy));
      for (const [entityId, actor] of Object.entries(nodes.actorButtons)) {
        actor.disabled = state.phase !== 'awaiting-response' || !stage.entityIds.includes(entityId);
      }
    } else {
      appendEntityChoices(
        container,
        unit,
        stage.entityIds,
        stage.hideEntityLabelsUntilCorrect,
        state
      );
    }
    if (state.phase === 'audio-failed') appendAudioButton(container, ui.audio.retryLabel, true);
  }

  function renderChoice(container, stage, state) {
    appendPrompt(container, stage.prompt);
    appendOptions(container, stage.options, state);
  }

  function currentRound(stage, state) {
    return stage.rounds[state.stageData.roundIndex];
  }

  function renderSequence(container, unit, stage, state) {
    const ui = uiCopy(unit);
    const round = currentRound(stage, state);
    const counter = element(
      'p',
      'round-counter',
      `${ui.task.stepPrefix}${state.stageData.roundIndex + 1}${ui.task.stepMiddle}${stage.rounds.length}${ui.task.stepSuffix}`
    );
    container.append(counter);
    appendPrompt(container, round.prompt);
    if (state.phase === 'stage-ready') appendAudioButton(container, ui.audio.playLineLabel);
    else if (round.options) appendOptions(container, round.options, state);
    else if (round.entityIds) appendEntityChoices(
      container,
      unit,
      round.entityIds,
      Boolean(round.hideEntityLabelsUntilCorrect),
      state
    );
    if (state.phase === 'audio-failed') appendAudioButton(container, ui.audio.retryLabel, true);
  }

  function renderSampledGroups(container, unit, stage, state) {
    const ui = uiCopy(unit);
    const group = stage.groups[state.stageData.activeGroupIndex];
    container.append(element(
      'p',
      'round-counter',
      `${ui.task.groupPrefix}${state.stageData.activeGroupIndex + 1}${ui.task.groupMiddle}${stage.groups.length}${ui.task.groupSuffix}`
    ));
    if (state.phase === 'stage-ready') {
      appendPrompt(container, `${ui.task.groupListenPrefix}${group.sourceRefs.length}${ui.task.groupListenSuffix}`);
      appendAudioButton(container, ui.audio.playGroupLabel);
      return;
    }
    appendPrompt(container, ui.task.sampledQuestion);
    appendEntityChoices(container, unit, group.entityIds, false, state);
    if (state.phase === 'audio-failed') appendAudioButton(container, ui.audio.retryLabel, true);
  }

  function renderAlbum(container, unit, stage, state) {
    const ui = uiCopy(unit);
    appendPrompt(container, ui.task.albumCopy);
    const tabs = element('div', 'album-tabs');
    stage.groups.forEach((group, index) => {
      const tab = button(group.label, 'set-album-group', 'album-tab');
      tab.dataset.groupIndex = String(index);
      tab.dataset.active = String(index === state.stageData.activeGroupIndex);
      tab.disabled = state.phase === 'audio-playing';
      tabs.append(tab);
    });
    container.append(tabs);
    const group = stage.groups[state.stageData.activeGroupIndex];
    const grid = element('div', 'album-grid');
    group.entityIds.forEach((entityId, index) => {
      const sourceRef = group.sourceRefs[index];
      const entity = unit.entities[entityId];
      const heard = state.contactedSourceRefs.includes(sourceRef);
      const item = button('', 'play-album-item', 'album-item');
      item.setAttribute('aria-label', `${ui.task.albumPlayPrefix}${entity.label}${ui.task.albumPlaySuffix}`);
      item.dataset.sourceRef = sourceRef;
      item.dataset.heard = String(heard);
      item.disabled = state.phase === 'audio-playing';
      item.append(pictureFor(entity, 'album-item__picture'));
      item.append(element('span', 'album-item__mark', heard ? ui.task.heardLabel : ui.task.listenLabel));
      grid.append(item);
    });
    container.append(grid);
  }

  function renderRole(container, unit, stage, state, sourceById) {
    const ui = uiCopy(unit);
    if (!state.stageData.roleId && stage.roleMode === 'choose-first') {
      appendPrompt(container, stage.prompt);
      const choices = element('div', 'role-grid');
      for (const roleId of stage.roles) {
        const roleDefinition = unit.experience.roles?.[roleId];
        const entity = unit.entities[roleDefinition?.entityId];
        const role = button(`${ui.role.choosePrefix}${roleDefinition?.label || entity?.label || roleId}`, 'select-role', 'role-card');
        role.dataset.roleId = roleId;
        choices.append(role);
      }
      container.append(choices);
      return;
    }
    if (state.phase === 'role-ready') {
      const roleDefinition = unit.experience.roles?.[state.stageData.roleId];
      appendPrompt(
        container,
        `${ui.role.assignedPrefix}${roleDefinition?.label || state.stageData.roleId}${ui.role.assignedSuffix}`
      );
      const actions = element('div', 'role-actions');
      actions.append(button(ui.role.startLabel, 'start-assigned-role', 'story-button'));
      if (stage.skippableRoleRound && !state.navigationSession) {
        actions.append(button(ui.role.skipLabel, 'skip-role', 'story-button story-button--quiet'));
      }
      container.append(actions);
      return;
    }
    const sourceRef = stage.dialogueRefs[state.stageData.turnIndex];
    const source = sourceById.get(sourceRef);
    const turnNumber = Math.min(state.stageData.turnIndex + 1, stage.dialogueRefs.length);
    container.append(element(
      'p',
      'round-counter',
      `${ui.role.linePrefix}${turnNumber}${ui.role.lineMiddle}${stage.dialogueRefs.length}${ui.role.lineSuffix}`
    ));
    if (!source) return;
    const childTurn = source.speakerRole === state.stageData.roleId;
    const shown = !childTurn || state.stageData.revealed || state.phase === 'audio-playing';
    const speaker = unit.experience.roles?.[source.speakerRole]?.label || source.speakerRole;
    const line = element('div', `dialogue-line${childTurn ? ' dialogue-line--child' : ''}`);
    line.append(element('span', 'dialogue-line__speaker', childTurn ? ui.role.childSpeakerLabel : speaker));
    line.append(element('strong', 'dialogue-line__text', shown ? source.text : ui.role.hiddenLineCopy));
    container.append(line);
    if (childTurn && state.phase === 'awaiting-response') {
      container.append(button(ui.role.revealLabel, 'play-role-line', 'story-button story-button--audio'));
    } else if (!childTurn && state.phase === 'audio-playing') {
      container.append(element('p', 'task-help', ui.role.partnerSpeakingCopy));
    }
    if (stage.skippableRoleRound && state.stageData.roleId && !state.navigationSession && state.phase !== 'audio-playing') {
      container.append(button(ui.role.skipLabel, 'skip-role', 'story-button story-button--quiet role-skip'));
    }
    if (state.phase === 'audio-failed') appendAudioButton(container, ui.audio.retryLabel, true);
  }

  function renderRescue(container, unit) {
    const ui = uiCopy(unit);
    const rescue = unit.experience.rescueExample;
    const entity = unit.entities[rescue.entityId];
    const card = element('div', 'rescue-card');
    if (entity) card.append(pictureFor(entity, 'rescue-card__picture'));
    card.append(
      element('h2', 'rescue-card__title', rescue.title),
      element('p', 'task-prompt', rescue.copy),
      button(ui.rescue.actionLabel, 'start-rescue', 'story-button story-button--audio')
    );
    container.append(card);
  }

  function renderSupport(container, unit, state) {
    if (!state.stageData.supportLevel || state.lastOutcome !== 'wrong') return;
    const copy = state.stageData.supportLevel === 1
      ? unit.experience.support.firstWrong
      : unit.experience.support.secondWrong;
    const support = element('p', 'support-note', copy);
    support.setAttribute('role', 'status');
    container.append(support);
  }

  function renderTask(nodes, unit, state, sourceById) {
    const ui = uiCopy(unit);
    const stage = unit.experience.stages[state.currentStageIndex];
    nodes.shell.dataset.stageId = stage.stageId;
    nodes.shell.dataset.phase = state.phase;
    nodes.shell.dataset.navigationMode = state.navigationSession?.mode || 'mainline';
    nodes.stageTitle.textContent = stage.title;
    nodes.stageInstruction.textContent = stage.instruction;
    for (const actor of Object.values(nodes.actorButtons)) actor.disabled = true;
    renderHearts(nodes, unit, stage, state);

    if (state.phase === 'replay-complete' || state.phase === 'makeup-complete') {
      const title = state.phase === 'replay-complete'
        ? ui.stageSession.replayCompleteTitle
        : ui.stageSession.makeupCompleteTitle;
      const copy = state.phase === 'replay-complete'
        ? ui.stageSession.replayCompleteCopy
        : ui.stageSession.makeupCompleteCopy;
      const terminal = element('div', 'completion-card stage-session-complete');
      terminal.append(
        element(
          'p',
          'task-kicker',
          state.navigationSession?.mode === 'replay'
            ? ui.stageSession.replayKicker
            : ui.stageSession.makeupKicker
        ),
        element('h2', 'completion-title', title),
        element('p', 'task-prompt', copy),
        button(ui.stageSession.returnLabel, 'exit-stage-session', 'story-button')
      );
      nodes.taskPanel.replaceChildren(terminal);
      renderProps(nodes, unit, []);
      return;
    }

    if (state.phase === 'unit-complete') {
      const content = unit.authoredContent[unit.experience.completionContentRef];
      nodes.stageTitle.textContent = content.sceneTitle;
      nodes.stageInstruction.textContent = content.sceneInstruction;
      const completion = element('div', 'completion-card');
      const hasSkippedRoles = state.skippedStageIds.length > 0;
      completion.append(
        element('p', 'task-kicker', content.kicker),
        element('h2', 'completion-title', hasSkippedRoles ? ui.completion.skippedTitle : content.title),
        element(
          'p',
          'task-prompt',
          hasSkippedRoles
            ? ui.completion.skippedCopy
            : content.copy
        )
      );
      const actions = element('div', 'completion-actions');
      actions.append(
        button(content.restartLabel, 'restart', 'story-button story-button--quiet'),
        button(content.leaveLabel, 'leave', 'story-button')
      );
      if (unit.experience.reviewRun?.href) {
        actions.append(link(ui.completion.reviewLabel, unit.experience.reviewRun.href, 'story-button story-button--quiet'));
      }
      completion.append(actions);
      nodes.taskPanel.replaceChildren(completion);
      renderProps(nodes, unit, unit.experience.scene.completionPropEntityIds || []);
      return;
    }

    const content = element('div', 'task-content');
    content.append(element(
      'p',
      'task-kicker',
      `${ui.task.segmentPrefix}${state.currentStageIndex + 1}${ui.task.segmentMiddle}${unit.unitLabel}`
    ));
    if (state.navigationSession) {
      const session = element(
        'div',
        'stage-session-banner',
        state.navigationSession.mode === 'replay'
          ? ui.stageSession.replayBanner
          : ui.stageSession.makeupBanner
      );
      session.append(button(ui.stageSession.exitLabel, 'exit-stage-session', 'stage-session-banner__exit'));
      content.append(session);
    }
    if (state.phase === 'rescue-ready') {
      renderRescue(content, unit);
    } else if (stage.kind === 'listen' || stage.kind === 'dialogue-comprehension') {
      renderListen(content, unit, stage, state);
    } else if (stage.kind === 'entity-action') {
      renderEntityAction(content, nodes, unit, stage, state);
    } else if (stage.kind === 'ownership-choice' || stage.kind === 'choice') {
      renderChoice(content, stage, state);
    } else if (stage.kind === 'sequence-choice') {
      renderSequence(content, unit, stage, state);
    } else if (stage.kind === 'sampled-prompt-groups') {
      renderSampledGroups(content, unit, stage, state);
    } else if (stage.kind === 'prompt-album') {
      renderAlbum(content, unit, stage, state);
    } else if (stage.kind === 'role-enactment') {
      renderRole(content, unit, stage, state, sourceById);
    }
    if (state.phase !== 'rescue-ready') renderSupport(content, unit, state);
    if (state.phase === 'audio-playing') {
      content.append(element('p', 'audio-status', ui.audio.playingCopy));
    }
    nodes.taskPanel.replaceChildren(content);

    let propIds = stage.propEntityIds || [];
    if (stage.kind === 'sequence-choice') {
      const round = currentRound(stage, state);
      propIds = round.propEntityId ? [round.propEntityId] : [];
    }
    renderProps(nodes, unit, propIds);
  }

  function createAudioSequencePlayer({ unit, runtime, dispatch, sourceById, onSourceChange }) {
    let activeToken = 0;
    let currentAudio = null;
    let preparedAudio = null;
    let preparedAudioUrl = null;

    function absoluteAudioUrl(value) {
      try { return new URL(value, globalThis.location.href).href; } catch { return String(value || ''); }
    }

    function prepareAudio(value) {
      if (!value) return;
      const url = absoluteAudioUrl(value);
      if (preparedAudio && preparedAudioUrl === url) return;
      const audio = globalThis.__coursePackage?.takePreparedAudio?.(value) || new Audio(value);
      audio.preload = 'auto';
      preparedAudio = audio;
      preparedAudioUrl = url;
      try { audio.load?.(); } catch { /* Playback keeps the verified package fallback. */ }
    }

    function acquireAudio(value) {
      const url = absoluteAudioUrl(value);
      if (preparedAudio && preparedAudioUrl === url) {
        const audio = preparedAudio;
        preparedAudio = null;
        preparedAudioUrl = null;
        return audio;
      }
      const audio = globalThis.__coursePackage?.takePreparedAudio?.(value) || new Audio(value);
      audio.preload = 'auto';
      return audio;
    }

    function stop() {
      activeToken += 1;
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.removeAttribute('src');
        currentAudio.load();
        currentAudio = null;
      }
      if (preparedAudio) {
        try { preparedAudio.pause(); } catch { /* no-op */ }
        preparedAudio = null;
        preparedAudioUrl = null;
      }
    }

    function waitForEnd(audio) {
      return new Promise((resolve, reject) => {
        const cleanup = () => {
          audio.removeEventListener('ended', onEnded);
          audio.removeEventListener('error', onError);
        };
        const onEnded = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error('audio playback failed')); };
        audio.addEventListener('ended', onEnded, { once: true });
        audio.addEventListener('error', onError, { once: true });
      });
    }

    async function play(pending) {
      stop();
      const token = activeToken;
      try {
        for (let index = 0; index < pending.audioRefs.length; index += 1) {
          const sourceRef = pending.audioRefs[index];
          if (token !== activeToken) return;
          const source = sourceById.get(sourceRef);
          if (!source?.audioSrc) throw new Error(`missing audio for ${sourceRef}`);
          onSourceChange?.(source);
          const audio = acquireAudio(source.audioSrc);
          currentAudio = audio;
          const nextSource = sourceById.get(pending.audioRefs[index + 1]);
          if (nextSource?.audioSrc) prepareAudio(nextSource.audioSrc);
          await audio.play();
          await waitForEnd(audio);
        }
        if (token === activeToken) {
          onSourceChange?.(null);
          dispatch({ type: 'AUDIO_ENDED', requestId: pending.requestId });
        }
      } catch (error) {
        if (token === activeToken) {
          onSourceChange?.(null);
          dispatch({ type: 'AUDIO_FAILED', requestId: pending.requestId, error: String(error) });
        }
      }
    }

    return { play, stop };
  }

  async function mount({ root, unit, storage = globalThis.localStorage }) {
    const runtime = globalThis.CanranCore?.storyStageRuntime
      || globalThis.CanranCore?.lessonThreeFourRuntime;
    if (!root || !unit || !runtime) throw new Error('Story-stage scene dependencies are unavailable');
    const ui = uiCopy(unit);
    const backgroundUrls = [
      [unit.experience.scene.backgroundWide, unit.experience.scene.backgroundWideFallback],
      [unit.experience.scene.backgroundPortrait, unit.experience.scene.backgroundPortraitFallback],
      ...(unit.experience.scene.actorEntityIds || [])
        .map(entityId => entityAssetCandidates(unit.entities[entityId]))
    ];
    await preloadImages(backgroundUrls);
    const nodes = buildShell(root, unit);
    const sourceById = runtime.sourceMap(unit);
    const progress = safeRead(storage, unit.experience.storageKey, unit.experienceRevision);
    let state = runtime.createInitialState(unit, progress || {});
    let lastAudioRequestId = null;
    let saveFailed = false;
    let currentSpokenText = '';
    let renderVersion = 0;
    const player = createAudioSequencePlayer({
      unit,
      runtime,
      dispatch,
      sourceById,
      onSourceChange(source) {
        currentSpokenText = source?.text || '';
        nodes.status.textContent = currentSpokenText || (saveFailed ? ui.saveFailureCopy : '');
        nodes.status.dataset.speaking = String(Boolean(currentSpokenText));
      }
    });

    function persist() {
      try {
        storage?.setItem(unit.experience.storageKey, JSON.stringify(runtime.serialize(unit, state)));
        saveFailed = false;
      } catch {
        saveFailed = true;
      }
    }

    async function update() {
      const version = renderVersion + 1;
      renderVersion = version;
      const currentStage = unit.experience.stages[state.currentStageIndex];
      const currentAssetGroups = state.phase === 'unit-complete'
        ? ['umbrella-star', 'ticket-five'].map(id => entityAssetCandidates(unit.entities[id]))
        : stageAssetUrls(unit, currentStage);
      await preloadImages(currentAssetGroups);
      if (version !== renderVersion) return;
      renderProgress(nodes, unit, state);
      renderTask(nodes, unit, state, sourceById);
      nodes.status.textContent = currentSpokenText || (saveFailed ? ui.saveFailureCopy : '');
      nodes.status.dataset.speaking = String(Boolean(currentSpokenText));
      const nextStage = unit.experience.stages[state.currentStageIndex + 1];
      if (nextStage) void preloadImages(stageAssetUrls(unit, nextStage));
      if (state.pendingAudio && state.pendingAudio.requestId !== lastAudioRequestId) {
        lastAudioRequestId = state.pendingAudio.requestId;
        player.play(state.pendingAudio);
      }
    }

    function dispatch(action) {
      if (action.type !== 'AUDIO_ENDED' && action.type !== 'AUDIO_FAILED') {
        if (state.phase === 'audio-playing' && !['RETRY_AUDIO'].includes(action.type)) return;
      }
      const previous = state;
      state = runtime.reduce(unit, state, action);
      if (state === previous) return;
      persist();
      void update();
    }

    function setStageMap(open) {
      nodes.stageMap.hidden = !open;
      nodes.progress.setAttribute('aria-expanded', String(open));
      nodes.shell.dataset.stageMapOpen = String(open);
      if (open) {
        const current = nodes.stageMap.querySelector('[aria-current="step"]');
        (current && !current.disabled ? current : nodes.stageMap.querySelector('button:not([disabled])'))?.focus();
      } else {
        nodes.progress.focus();
      }
    }

    function setSettings(open) {
      nodes.settings.hidden = !open;
      nodes.settingsButton.setAttribute('aria-expanded', String(open));
      if (open) nodes.settings.querySelector('button')?.focus();
      else nodes.settingsButton.focus();
    }

    nodes.shell.addEventListener('click', event => {
      const target = event.target.closest('button[data-action]');
      if (!target || target.disabled) return;
      const action = target.dataset.action;
      if (action === 'play-primary') dispatch({ type: 'PLAY_PRIMARY' });
      else if (action === 'retry-audio') dispatch({ type: 'RETRY_AUDIO' });
      else if (action === 'answer') dispatch({ type: 'ANSWER', optionId: target.dataset.optionId });
      else if (action === 'select-entity') dispatch({ type: 'ANSWER', entityId: target.dataset.entityId });
      else if (action === 'set-album-group') dispatch({ type: 'SET_ALBUM_GROUP', groupIndex: Number(target.dataset.groupIndex) });
      else if (action === 'play-album-item') dispatch({ type: 'PLAY_ALBUM_ITEM', sourceRef: target.dataset.sourceRef });
      else if (action === 'select-role') dispatch({ type: 'SELECT_ROLE', roleId: target.dataset.roleId });
      else if (action === 'start-assigned-role') dispatch({ type: 'START_ASSIGNED_ROLE' });
      else if (action === 'play-role-line') dispatch({ type: 'PLAY_ROLE_LINE' });
      else if (action === 'skip-role') dispatch({ type: 'SKIP_ROLE' });
      else if (action === 'start-rescue') dispatch({ type: 'START_RESCUE' });
      else if (action === 'continue') dispatch({ type: 'CONTINUE' });
      else if (action === 'navigate-stage') {
        setStageMap(false);
        dispatch({ type: 'NAVIGATE_STAGE', stageId: target.dataset.stageId });
      } else if (action === 'exit-stage-session') {
        player.stop();
        dispatch({ type: 'EXIT_STAGE_SESSION' });
      } else if (action === 'toggle-stage-map') {
        if (!nodes.settings.hidden) setSettings(false);
        setStageMap(nodes.stageMap.hidden);
      } else if (action === 'toggle-settings') {
        if (!nodes.stageMap.hidden) setStageMap(false);
        setSettings(nodes.settings.hidden);
      }
      else if (action === 'restart') {
        player.stop();
        storage?.removeItem(unit.experience.storageKey);
        nodes.settings.hidden = true;
        nodes.stageMap.hidden = true;
        dispatch({ type: 'RESTART' });
      } else if (action === 'leave') globalThis.location.href = unit.authoredContent[unit.experience.completionContentRef].leaveHref;
    });

    nodes.shell.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (!nodes.stageMap.hidden) setStageMap(false);
      else if (!nodes.settings.hidden) setSettings(false);
    });

    await update();
    return Object.freeze({
      getState: () => state,
      dispatch,
      destroy() { player.stop(); nodes.shell.remove(); }
    });
  }

  return Object.freeze({ mount });
});
