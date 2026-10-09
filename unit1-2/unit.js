(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit12;
  const { stages, questions, learning: content } = unit;
  const practice = core.lesson49Practice;
  const $ = selector => document.querySelector(selector);
  const icon = core.lesson49Icons.create;
  const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag); element.textContent = text; element.className = className; return element;
  };
  function button(text, action, className = 'btn btn-green') {
    const element = node('button', text, className); element.type = 'button'; element.addEventListener('click', action); return element;
  }
  function art(name, label = '') {
    if (!['man', 'woman', ...unit.objects.map(word => word.en)].includes(name)) return icon(name, label);
    const picture = node('img', '', 'shop-icon'); picture.src = '/assets/unit1-2/' + (['man', 'woman'].includes(name) ? 'scene/' : '') + name + '.svg' + (name === 'handbag' ? '?v=scene-2' : ''); picture.alt = label; return picture;
  }
  const surfaces = new Map();
  const activities = stages.flatMap(stage => stage.activities.map(([id, title]) => ({ id, title, chapter: stage.id })));
  const routes = new Set(['cover', ...stages.map(stage => stage.id), ...activities.map(item => 'learn/' + item.id)]);
  let active = '', certificateView;
  for (const stage of stages) {
    const section = node('section', '', 'shop-chapter'); section.id = stage.id;
    const heading = node('header', '', 'chapter-heading'); heading.append(node('h2', stage.title), node('span', '☆', 'lvl-stars')); section.append(heading);
    const link = node('a', stage.title); link.href = '#' + stage.id; $('.chapter-links').append(link);
    const option = node('option', stage.title); option.value = stage.id; $('.chapter-select select').append(option);
    for (const [id, title, illustration] of stage.activities) {
      const surface = node('section', '', 'shop-stage stage-' + id); surface.id = 'learn/' + id;
      surface.setAttribute('role', 'region'); surface.setAttribute('aria-label', title);
      const header = node('header', '', 'stage-heading');
      header.append(icon(illustration), node('h3', title));
      surface.append(header); surfaces.set(id, surface); section.append(surface);
    }
    $('#lessonWorkspace').append(section);
  }
  const routeAlias = id => unit.routeAliases?.[id] || id;
  const navigate = id => {
    id = routeAlias(id);
    // Scrolling back to the cover keeps the hash; resume must still reposition.
    if (location.hash === '#' + id) route();
    else location.hash = id;
  };
  function markLocation(id) {
    if (!routes.has(id)) return;
    if (active !== id) { root.dispatchEvent(new Event('lesson49:leave-activity')); active = id; }
    if (id === 'cover') return;
    practice.activity('unitLocation', id);
    const chapter = document.getElementById(id).closest('.shop-chapter');
    document.querySelectorAll('.chapter-links a').forEach(link => {
      if (link.hash === '#' + chapter?.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
    if (chapter) $('.chapter-select select').value = chapter.id;
    $('#startBtn').textContent = '继续冒险';
  }
  function route() {
    let id; try { id = decodeURIComponent(location.hash.slice(1) || 'cover'); } catch { id = 'cover'; }
    const current = id; id = routeAlias(id);
    if (id !== current) history.replaceState(null, '', '#' + id);
    if (!routes.has(id)) id = 'cover'; markLocation(id);
    document.documentElement.style.scrollPaddingTop = Math.ceil($('#topbar').getBoundingClientRect().height) + 12 + 'px';
    document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  $('#lessonWorkspace').addEventListener('click', event => {
    const surface = event.target.closest('.shop-stage'); if (!surface) return;
    markLocation(surface.id);
    if (location.hash !== '#' + surface.id) history.replaceState(null, '', '#' + surface.id);
  }, true);
  $('.chapter-select select').addEventListener('change', event => navigate(event.target.value));
  const resume = routeAlias(practice.activity('unitLocation'));
  if (resume && routes.has(resume) && resume !== 'cover') $('#startBtn').textContent = '继续冒险';
  $('#startBtn').addEventListener('click', () => {
    const saved = routeAlias(practice.activity('unitLocation')); navigate(routes.has(saved) && saved !== 'cover' ? saved : unit.start);
  });
  document.querySelectorAll('[data-close]').forEach(control => control.addEventListener('click', () => control.closest('dialog').close()));
  $('#notebookButton').addEventListener('click', () => $('#unitNotebook').showModal());

  const signatures = Object.fromEntries(Object.entries(questions).map(([id, items]) => [id, JSON.stringify([unit.version, items])]));
  signatures.text = JSON.stringify([unit.version, content.DIALOGUE]);
  const saved = practice.activity('unitCompleted');
  const completed = saved && typeof saved === 'object' && !Array.isArray(saved) ? { ...saved } : {};
  const passed = id => practice.sameContentSignature(completed[id], signatures[id]);
  let awardState = { stars: 0, zones: {}, firstFullStarAt: null };
  function updateProgress() {
    for (const stage of stages) {
      const zone = unit.reward.zones.find(zone => stage.required.includes(zone.id));
      const earned = Boolean(awardState.zones[zone.id]);
      const label = $('#' + stage.id + ' .lvl-stars'); label.textContent = earned ? '★' : '☆';
      label.setAttribute('aria-label', '本关 ' + (earned ? '1' : '0') + ' / 1 颗星');
    }
    $('#starCount').textContent = String(awardState.stars);
    document.querySelectorAll('.award-round-result[data-perfect="true"]').forEach(result => {
      result.textContent = awardState.pendingZones?.includes(result.dataset.zone) ? '整轮零错！联网同步后点亮星星。' : '整轮零错，这颗星点亮了！';
    });
    certificateView?.update(awardState);
  }
  function complete(id) { completed[id] = signatures[id]; practice.activity('unitCompleted', completed); updateProgress(); }
  const awards = core.unitAwards.create({ unit, practice, onChange: state => { awardState = state; updateProgress(); } });
  function nextStation(id, actions) {
    if (!actions || actions.querySelector('.station-actions')) return;
    const next = activities[activities.findIndex(item => item.id === id) + 1]; if (!next) return;
    const group = node('div', '', 'station-actions'); group.append(button('下一站：' + next.title, () => navigate('learn/' + next.id))); actions.append(group);
  }
  function mountPractice(id, settings = {}) {
    const element = node('div'); element.id = 'unit12-' + id + '-practice'; surfaces.get(id).append(element);
    if (questions[id].some(question => question.scene)) {
      settings.sceneView = core.unit12Scene.create({ element });
    }
    if (id === 'trans') settings.sceneView = core.unit12Grammar.create({ element, art });
    const predecessors = unit.activityPredecessors[id];
    let practicedHere = false;
    practice.mount({ element, questions: questions[id], sessionId: unit.taskSessions?.[id] || (predecessors ? 'v2' : 'v' + unit.version),
      inputViews:core.lesson49TaskInputs, roundPolicy: unit.reward.edition,
      previousGroups: unit.taskPredecessors?.[id] || predecessors?.map(old => ({ key: 'unit12-' + old + '-practice/v1', questions: unit.previousQuestions[old] })), ...settings,
      onProgress: () => { practicedHere = true; settings.onProgress?.(); },
      onComplete: (states, round) => {
        const perfect = awards.record(id, states, round);
        const awardStatus = perfect ? '整轮零错，这颗星点亮了！'
          : states.some(state => state.firstCorrect === false) ? '本轮有过错答。再练一轮，整轮零错就能点亮星星。'
          : '学习记录已保留。再练一轮，整轮零错就能点亮星星。';
        complete(id);
        nextStation(id, element.querySelector('.practice-finish-actions')); settings.onComplete?.(states);
        core.unit12Completion.render({ finish: element.querySelector('.practice-finish'), activity: id, states,
          details: settings.completionDetails, celebrate: practicedHere, awardStatus });
        const result = element.querySelector('.completion-award');
        result.classList.add('award-round-result');
        result.dataset.perfect = String(perfect); result.dataset.zone = id;
        updateProgress();
        practicedHere = false;
      } });
    return element;
  }

  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage');
  stage.id = 'unit12-dialogue';
  function actor(who, name) { const element = node('div', '', 'dialogue-actor'); element.dataset.actor = who; element.append(art(who), node('span', name)); return element; }
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文对话'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  const storyBag = art('handbag', '等待归还的手提包'); storyBag.classList.add('dialogue-handbag');
  stage.append(actor('man', '男士'), log, actor('woman', '女士'), storyBag);
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始看课文', advanceDialogue);
  tools.append(button('从头看', resetDialogue, 'btn btn-yellow')); controls.append(tools, advance);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再看一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(node('p', '故事看完了！'), finishActions); story.append(stage, status, controls, finish);
  const gate = node('div', '', 'activity-actions'); gate.append(button('先看课文', () => navigate('learn/text'))); surfaces.get('roles').append(gate);
  let storyStarted = false, dialogue = { i: -1, viewed: [], done: false };
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountPractice('roles'); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function refreshDialogue() {
    advance.textContent = dialogue.i < 0 ? '开始看课文' : dialogue.i === content.DIALOGUE.length - 1 ? '完成课文' : '下一句';
    controls.dataset.state = dialogue.i < 0 ? 'ready' : 'reading'; tools.hidden = dialogue.i < 0;
    controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
    status.textContent = dialogue.i < 0 ? '' : `${dialogue.i + 1} / ${content.DIALOGUE.length}`;
    status.setAttribute('aria-label', dialogue.i < 0 ? '尚未开始阅读' : `已读 ${dialogue.i + 1} / ${content.DIALOGUE.length} 句课文`);
    log.querySelectorAll('.bubble-row').forEach((row, index) => row.classList.toggle('is-current', index === dialogue.i));
    const returned = dialogue.viewed[5] === true;
    stage.classList.toggle('has-returned-bag', returned);
    storyBag.alt = returned ? '女士确认后的手提包' : '等待归还的手提包';
    stage.querySelectorAll('.dialogue-actor').forEach(actor=>actor.classList.toggle('speaking',actor.dataset.actor===content.DIALOGUE[dialogue.i]?.who));
  }
  function lead() { const lead = node('div', '', 'story-lead'); lead.append(node('p', '这是谁的手提包？')); log.replaceChildren(lead); }
  function appendLine(index) {
    const line = content.DIALOGUE[index], row = node('div', '', 'bubble-row ' + line.who), bubble = node('div', '', 'bubble');
    const speech = node('p', '', 'btext'); speech.append(node('span', line.text)); speech.lang = 'en';
    const translation = node('p', line.cn, 'bcn'); translation.hidden = true;
    const translate = button('看中文', () => { translation.hidden = !translation.hidden; translate.textContent = translation.hidden ? '看中文' : '收起中文'; translate.setAttribute('aria-expanded', String(!translation.hidden)); if(!translation.hidden)requestAnimationFrame(()=>{log.scrollTop=Math.max(0,row.offsetTop+row.offsetHeight-log.clientHeight);}); }, 'btn btn-mini btn-yellow'); translate.setAttribute('aria-expanded', 'false');
    const actions = node('div', '', 'bbtns'); actions.append(translate);
    bubble.append(node('div', line.who === 'man' ? '男士' : '女士', 'bname'), speech, translation, actions); row.append(bubble); log.append(row);
  }
  function advanceDialogue() {
    if (dialogue.done) return;
    if (dialogue.i === content.DIALOGUE.length - 1) {
      if (!content.DIALOGUE.every((_, index) => dialogue.viewed[index] === true)) return;
      dialogue.done = true; saveDialogue(); complete('text'); unlockStory(); refreshDialogue(); core.lesson49Feedback.play('complete'); return;
    }
    if (dialogue.i < 0) log.replaceChildren(); dialogue.i++; dialogue.viewed[dialogue.i] = true; saveDialogue(); appendLine(dialogue.i); refreshDialogue(); log.scrollTop = log.scrollHeight;
  }
  function resetDialogue() { dialogue = { i: -1, viewed: [], done: false }; saveDialogue(); lead(); refreshDialogue(); }
  const draft = practice.activity('unitDialogue');
  if (draft?.signature === signatures.text && Number.isInteger(draft.i) && draft.i >= 0 && draft.i < content.DIALOGUE.length) {
    const source = draft.viewed || draft.heard;
    const viewed = Array.isArray(source) ? source.slice(0, draft.i + 1) : null;
    if (Array.isArray(viewed)) {
      const gap = content.DIALOGUE.findIndex((_, index) => index <= draft.i && viewed[index] !== true);
      const index = gap < 0 ? draft.i : gap - 1;
      dialogue = { i: index, viewed: viewed.slice(0, index + 1), done: draft.done === true && index === content.DIALOGUE.length - 1 && content.DIALOGUE.every((_, i) => viewed[i] === true) };
      for (let i = 0; i <= index; i++) appendLine(i);
      if (dialogue.done) complete('text');
    }
  }
  if (dialogue.i < 0) lead();
  refreshDialogue(); unlockStory();

  const wordHost = surfaces.get('words'), wordGrid = node('div', '', 'unit-words');
  const wordControls = node('div', '', 'word-controls'), wordProgress = node('span');
  const pageCount = Math.ceil(content.WORDS.length / 6), savedPage = practice.activity('unitWordPage');
  let wordPage = Number.isInteger(savedPage) ? Math.max(0, Math.min(pageCount - 1, savedPage)) : 0;
  const previousWords = button('上一组词卡', () => changeWordPage(-1), 'btn btn-yellow');
  const nextWords = button('下一组词卡', () => wordPage === pageCount - 1 ? navigate('learn/listen') : changeWordPage(1));
  wordProgress.id = 'wordPageProgress'; wordControls.append(previousWords, wordProgress, nextWords); wordHost.append(wordGrid, wordControls);
  function changeWordPage(delta) { wordPage += delta; renderWords(); practice.revealQuestion(wordHost, wordHost.querySelector('h3')); }
  function renderWords() {
    wordGrid.replaceChildren(); practice.activity('unitWordPage', wordPage);
    for (const word of content.WORDS.slice(wordPage * 6, wordPage * 6 + 6)) {
      const picture = node('img'); picture.src = word.image; picture.alt = '';
      const pronunciation = node('small', word.ph, 'word-phonetic'); pronunciation.lang = 'en-US';
      const meaning = node('span', word.cn, 'word-meaning'); meaning.hidden = true;
      pronunciation.id = 'u12-' + word.en.replaceAll(' ', '-') + '-phonetic';
      meaning.id = 'u12-' + word.en.replaceAll(' ', '-') + '-meaning';
      const example = node('small', word.example || '', 'word-example'); example.hidden = !word.example;
      const card = button('', () => {
        const expanded = card.getAttribute('aria-expanded') !== 'true';
        card.setAttribute('aria-expanded', String(expanded)); meaning.hidden = !expanded;
        card.setAttribute('aria-describedby', expanded ? meaning.id : pronunciation.id);
      }, 'opt-btn unit-word');
      card.setAttribute('aria-label', word.en); card.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-describedby', pronunciation.id);
      card.append(picture, node('strong', word.en), pronunciation, meaning, example); wordGrid.append(card);
    }
    previousWords.disabled = wordPage === 0; wordProgress.textContent = `${wordPage + 1} / ${pageCount}`;
    nextWords.setAttribute('aria-label', wordPage === pageCount - 1 ? '下一站：单词寻宝' : '下一组词卡');
    if (wordPage === pageCount - 1) nextWords.replaceChildren(node('span', '下一站：'), node('span', '单词寻宝'));
    else nextWords.textContent = '下一组词卡';
  }
  renderWords();
  mountPractice('listen', { allowHints: false });

  mountPractice('trans');
  mountPractice('manners');
  core.unit12Grammar.references({ element: surfaces.get('manners'), content });

  const examResults = node('div', '', 'unit-results');
  mountPractice('exam', { chunkSize: questions.exam.length, finalLabel: '查看本次记录', completionDetails: examResults, onComplete: states => {
    examResults.replaceChildren();
    const targets = questions.exam.filter((_, index) => !states[index].firstCorrect || states[index].hintUsed || states[index].ruleUsed || states[index].revealed).map(q => q.target);
    if (targets.length) { const details = node('details'), list = node('ul'); details.append(node('summary', '下次再练')); targets.forEach(target => list.append(node('li', target))); details.append(list); examResults.append(details); }
  } });
  certificateView = core.storyCertificate.mount({
    element: surfaces.get('certificate'), unit, go: navigate, returnUrl: $('#logo').href
  });
  const writing = node('details', '', 'offline-task'); writing.id = 'unitWriting';
  writing.append(node('summary', '和家人再试试'), node('p', '拿一件确实属于你的物品，请家人用 Is this your…? 问你。你来回答 Yes, it is.，再交换角色。没听清可以说 Pardon?。'), node('p', '纸笔小练习：这些是教材的七句原文。可以选一两句慢慢抄写，留意大写和标点。'));
  const writingLines = node('ol', '', 'writing-lines'); content.DIALOGUE.forEach(line => writingLines.append(node('li', line.text))); writing.append(writingLines);
  const printActions = node('div', '', 'activity-actions'); printActions.append(button('打印练习纸', () => {
    document.body.classList.add('print-writing'); root.print();
  }, 'btn btn-yellow')); writing.append(printActions); surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint', () => document.body.classList.remove('print-writing'));

  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route);
  document.addEventListener('canran:course-ready', route, { once: true });
  document.fonts.ready.then(() => {
    const restore=()=>requestAnimationFrame(()=>{route();log.scrollTop=log.scrollHeight;});
    if(!document.documentElement.hasAttribute('data-course-preparing'))return restore();
    const ready=new MutationObserver(()=>{if(!document.documentElement.hasAttribute('data-course-preparing')){ready.disconnect();restore();}});
    ready.observe(document.documentElement,{attributes:true,attributeFilter:['data-course-preparing']});
  });
})(globalThis);
