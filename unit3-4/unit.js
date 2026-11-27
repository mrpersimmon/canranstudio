(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit34;
  const { stages, questions, learning: content } = unit;
  const practice = core.lesson49Practice;
  core.unit34History.preserve(practice,unit);
  const runners=new Map();
  const $ = selector => document.querySelector(selector);
  const icon = core.lesson49Icons.create;
  const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag); element.textContent = text; element.className = className; return element;
  };
  function button(text, action, className = 'btn btn-green') {
    const element = node('button', text, className); element.type = 'button'; element.addEventListener('click', action);
    if(text.startsWith('下一站：')){element.textContent='下一站';element.setAttribute('aria-label',text);element.dataset.stationNext='true';}
    return element;
  }
  function art(name, label = '') {
    const word = unit.objects.find(word => word.en === name);
    const path = ['visitor', 'attendant'].includes(name) ? core.unit34Current.image(name) : word?.image;
    if (!path) return icon(name, label);
    const picture = node('img', '', 'shop-icon'); picture.src = path; picture.alt = label; return picture;
  }
  const surfaces = new Map();
  const activities = stages.flatMap(stage => stage.activities.map(([id, title]) => ({ id, title, chapter: stage.id })));
  const routes = new Set(['cover', ...stages.map(stage => stage.id), ...activities.map(item => 'learn/' + item.id)]);
  let certificateView;
  for (const stage of stages) {
    const section = node('section', '', 'shop-chapter'); section.id = stage.id;
    const heading = node('header', '', 'chapter-heading'); heading.append(node('h2', stage.title), node('span', '☆☆☆', 'lvl-stars')); section.append(heading);
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
  const aliases = { 'learn/ask': 'learn/exam', 'learn/trans': 'learn/reply', 'learn/phrases': 'learn/reply' };
  const normalizeRoute = id => aliases[id] || id;
  const navigate = core.unitSession.navigator(normalizeRoute, route);
  const locationTracker = core.unitSession.location(routes, practice);
  const markLocation = locationTracker.mark;
  function route() {
    let id; try { id = decodeURIComponent(location.hash.slice(1) || 'cover'); } catch { id = 'cover'; }
    id = normalizeRoute(id);
    if (!routes.has(id)) id = 'cover';
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    markLocation(id);
    core.unitSession.scrollToRoute(id);
  }
  $('#lessonWorkspace').addEventListener('click', event => {
    if(event.target.closest('[data-practice-review], [data-practice-review-navigation]'))return;
    const surface = event.target.closest('.shop-stage'); if (!surface) return;
    markLocation(surface.id);
    if (location.hash !== '#' + surface.id) history.replaceState(null, '', '#' + surface.id);
  }, true);
  $('.chapter-select select').addEventListener('change', event => navigate(event.target.value));
  const resume = normalizeRoute(practice.activity('unitLocation'));
  if (resume) practice.activity('unitLocation', resume);
  if (resume && routes.has(resume) && resume !== 'cover') $('#startBtn').textContent = '继续冒险';
  $('#startBtn').addEventListener('click', () => {
    const saved = normalizeRoute(practice.activity('unitLocation')); navigate(routes.has(saved) && saved !== 'cover' ? saved : unit.start);
  });
  document.querySelectorAll('[data-close]').forEach(control => control.addEventListener('click', () => control.closest('dialog').close()));
  $('#notebookButton').addEventListener('click', () => {core.learningFlow?.prepareNotebook(document.querySelector('.learning-surface'));$('#unitNotebook').showModal();});

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
      result.textContent = awardState.pendingZones?.includes(result.dataset.zone) ? settlement.pendingMessage() : '已获星';
    });
    certificateView?.update(awardState);
  }
  const complete = core.unitSession.completion(completed, signatures, practice, updateProgress);
  const settlement = core.awardReveal.create({ unit });
  const awards = core.unitAwards.create({ unit, practice, onAward: settlement.earned, onChange: state => { awardState = state; updateProgress(); } });
  function nextStation(id, actions) {
    if (!actions || actions.querySelector('.station-actions')) return;
    const next = activities[activities.findIndex(item => item.id === id) + 1]; if (!next) return;
    const group = node('div', '', 'station-actions');
    if(next.id!=='certificate')group.append(node('span','接下来：'+next.title,'station-destination'));
    group.append(button(next.id==='certificate'?'查看纪念卡':'下一站：'+next.title, () => navigate('learn/' + next.id))); actions.append(group);
  }
  function completionArt() {
    const scene = node('div', '', 'completion-art'); scene.setAttribute('aria-hidden', 'true');
    scene.append(node('span', '', 'completion-halo'), node('span', '', 'completion-ground'));
    const visitor = art('visitor'), attendant = art('attendant'), umbrella = art('umbrella');
    umbrella.src = '/assets/unit3-4/umbrella-held.svg';
    visitor.className = 'completion-man'; attendant.className = 'completion-attendant'; umbrella.className = 'completion-object';
    scene.append(visitor, attendant, umbrella); return scene;
  }
  const completionTitles = { listen: '单词寻宝完成！', roles: '故事读懂啦！', reply: '语法练习完成！', manners: '雨伞领回来了！', exam: '综合挑战完成！' };
  function mountPractice(id, settings = {}) {
    const element = node('div'); element.id = 'unit34-' + id + '-practice'; surfaces.get(id).append(element);
    if (id === 'manners') {
      settings.sceneView = core.unit34Scene.create({ element });
      settings.completionDetails = settings.sceneView.completion();
    }
    if (id === 'reply') settings.sceneView = core.unit34Current.grammar({ element, art });
    const predecessors = unit.activityPredecessors[id];
    const runner=practice.mount({ element, questions: questions[id], previousQuestionSets: [unit.voicedQuestions[id]], sessionId: unit.taskSessions?.[id] || (predecessors ? 'v2' : 'v' + unit.version),
      inputViews:core.lesson49TaskInputs, roundPolicy:unit.reward.edition, finalLabel:'完成练习', allowReview:true, onResumeResult:updateProgress,
      previousGroups: unit.taskPredecessors?.[id] || predecessors?.flatMap(old => [unit.previousQuestions[old], unit.voicedQuestions[old]].map(prior => ({ key: 'unit34-' + old + '-practice/v1', questions: prior }))), ...settings,
      onAnswer:(question,state)=>{if(settings.sceneView?.hasVisibleModel?.()){state.revealed=true;practice.record(question,state);}settings.onAnswer?.(question,state);},
      onComplete: (states,round) => {
        const { perfect, message } = settlement.complete({ id, states, round, awards, element });
        complete(id);
        nextStation(id, element.querySelector('.practice-finish-actions'));
        settings.onComplete?.(states);
        core.unit12Completion.render({ finish: element.querySelector('.practice-finish'), activity: id, states,
          theme: { title: completionTitles[id] }, artwork: core.unit34Current.completion(), details: id === 'exam' ? settings.completionDetails : null,
          celebrate: round.userCompleted, awardStatus: message,
          waitForCelebration: () => settlement.isPresenting() || (awards.state().pendingZones.includes(id) && navigator.onLine !== false && document.getElementById('studentSyncStatus')?.dataset.syncState !== 'retry') });
        const result = element.querySelector('.completion-award'); result.classList.add('award-round-result');
        result.dataset.perfect = String(perfect); result.dataset.zone = id;
        updateProgress(); } });
    runners.set(id,runner);
    return element;
  }

  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage learning-scene-stacked');
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文对话'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  const props = core.unit34Scene.storyProps();
  // Dialogue and art share a frame; the art itself keeps one 3:2 coordinate plane.
  // Text length must not reposition people, furniture or the handed-over props.
  stage.append(log,props.element);
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始故事', advanceDialogue);
  tools.append(button('重新上演', resetDialogue, 'btn btn-yellow')); controls.append(tools, advance);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再看一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(finishActions); story.append(stage, status, controls, finish);
  const gate = node('div', '', 'activity-actions'); gate.append(button('先看故事', () => navigate('learn/text'))); surfaces.get('roles').append(gate);
  let storyStarted = false, dialogue = { i: -1, viewed: [], done: false };
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountPractice('roles'); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function refreshDialogue() {
    advance.textContent = dialogue.i < 0 ? '开始故事' : dialogue.i === content.DIALOGUE.length - 1 ? '去练习' : '下一句';
    props.update(dialogue.i);
    controls.dataset.state = dialogue.i < 0 ? 'ready' : 'reading'; tools.hidden = dialogue.i < 0;
    controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
    status.textContent = dialogue.i < 0 ? '' : `${dialogue.i + 1} / ${content.DIALOGUE.length}${dialogue.done?' · 故事看完了':''}`;
    status.setAttribute('aria-label', dialogue.i < 0 ? '尚未开始阅读' : `已读 ${dialogue.i + 1} / ${content.DIALOGUE.length} 句课文`);
    log.querySelectorAll('.bubble-row').forEach((row, index) => row.classList.toggle('is-current', index === dialogue.i));
    stage.querySelectorAll('.dialogue-actor').forEach(person => person.classList.toggle('is-current', person.dataset.actor === content.DIALOGUE[dialogue.i]?.who));
  }
  function lead() { const lead = node('div', '', 'story-lead'), question=node('p','Does the man get his umbrella back?','story-question');question.lang='en';lead.append(question,node('p','这位男士拿回自己的雨伞了吗？','story-question-translation')); log.replaceChildren(lead); }
  function appendLine(index) {
    const line = content.DIALOGUE[index], row = node('div', '', 'bubble-row ' + line.who), bubble = node('div', '', 'bubble');
    const speech = node('p', '', 'btext'); speech.append(node('span', line.text)); speech.lang = 'en';
    const translation = node('p', line.cn, 'bcn'); translation.hidden = true;
    const translate = button('中文', () => { translation.hidden = !translation.hidden; translate.setAttribute('aria-label',translation.hidden?'看中文':'收起中文'); translate.setAttribute('aria-expanded', String(!translation.hidden));
      // Expanding the current translation must reveal its button as well; only
      // the transcript scrolls, never the page or the controls below it.
      if (!translation.hidden) {
        const overflow = row.getBoundingClientRect().bottom - log.getBoundingClientRect().bottom + 12;
        if (overflow > 0) log.scrollTop += overflow;
      }
    }, 'btn btn-mini btn-yellow'); translate.setAttribute('aria-expanded','false'); translate.setAttribute('aria-label','看中文');
    const actions = node('div', '', 'bbtns'); actions.append(translate);
    bubble.append(node('div', line.who === 'visitor' ? '客人' : '工作人员', 'bname'), speech, translation, actions); row.append(bubble); log.append(row);
  }
  function advanceDialogue() {
    if (dialogue.done) return;
    if (dialogue.i === content.DIALOGUE.length - 1) {
      if (!content.DIALOGUE.every((_, index) => dialogue.viewed[index] === true)) return;
      dialogue.done = true; saveDialogue(); complete('text'); unlockStory(); refreshDialogue(); core.lesson49Feedback.play('complete'); navigate('learn/roles'); return;
    }
    if (dialogue.i < 0) log.replaceChildren(); dialogue.i++; dialogue.viewed[dialogue.i] = true; saveDialogue(); appendLine(dialogue.i); refreshDialogue(); log.scrollTop = log.scrollHeight;
  }
  function resetDialogue() { dialogue = { i: -1, viewed: [], done: false }; saveDialogue(); lead(); refreshDialogue(); }
  const draft = practice.activity('unitDialogue');
  if (draft?.signature === signatures.text && Number.isInteger(draft.i) && draft.i >= 0 && draft.i < content.DIALOGUE.length) {
    // Old voiced pages already displayed the current line, even if its audio
    // was interrupted. Retain that reading position, not a new listening score.
    const legacy = !Array.isArray(draft.viewed) && Array.isArray(draft.heard);
    const source = legacy ? draft.heard : draft.viewed;
    const viewed = Array.isArray(source) ? source.slice(0, draft.i + 1) : null;
    if (Array.isArray(viewed)) {
      if (legacy) viewed[draft.i] = true;
      const gap = content.DIALOGUE.findIndex((_, index) => index <= draft.i && viewed[index] !== true);
      const index = gap < 0 ? draft.i : gap - 1;
      dialogue = { i: index, viewed: viewed.slice(0, index + 1), done: draft.done === true && index === content.DIALOGUE.length - 1 && content.DIALOGUE.every((_, i) => viewed[i] === true) };
      for (let i = 0; i <= index; i++) appendLine(i);
      if (legacy) saveDialogue();
      if (dialogue.done) complete('text');
    }
  }
  if (dialogue.i < 0) lead();
  refreshDialogue(); unlockStory();

  core.wordDeck.mount({host:surfaces.get('words'),unit,practice,navigate});
  mountPractice('listen', { allowHints: false });

  function expressionCard(expression) {
    const picture = node('img'); picture.src = expression.image; picture.alt = '';
    const caption = node('span', expression.cn);
    const card = node('article', '', 'phrase-card reference-card');
    card.append(picture, node('strong', expression.en), caption); return card;
  }
  const phraseGrid = node('div', '', 'phrase-grid');
  content.PHRASES.forEach(expression => phraseGrid.append(expressionCard(expression)));
  const sentenceModels = node('details', '', 'offline-task sentence-models');
  sentenceModels.append(node('summary', '换个人或物问一问'));
  const modelGrid = node('div', '', 'phrase-grid');
  content.SENTENCE_MODELS.forEach(expression => modelGrid.append(expressionCard(expression))); sentenceModels.append(modelGrid);
  const replyModels = node('details', '', 'offline-task sentence-models');
  replyModels.append(node('summary', '不是我的，是你的'));
  replyModels.append(node('p', '只知道“不是我的”时，还不能断定“就是你的”。下面的回答都已知物品属于对方。'));
  const replyGrid = node('div', '', 'phrase-grid reply-models');
  content.REPLY_MODELS.slice(1).forEach(expression => replyGrid.append(expressionCard(expression)));
  replyModels.append(replyGrid);
  const shortForms = node('details', '', 'offline-task');
  shortForms.append(node('summary', '一句话变短'));
  for (const [left, right] of [['Here is', "Here's"], ['It is', "It's"], ['is not', "isn't"]]) {
    const row = node('p', '', 'contraction-row'); row.append(node('span', left), node('span', '→'), node('span', right)); shortForms.append(row);
  }
  shortForms.append(node('p', 'my 指说话人的，your 指听话人的；换一个人说话，所指的人也可能变化。'));
  mountPractice('manners'); mountPractice('reply');
  const references = node('details', '', 'offline-task grammar-reference');
  references.append(node('summary', '认领表达参考'), phraseGrid, sentenceModels, replyModels, shortForms);
  surfaces.get('reply').append(references);

  mountPractice('exam', {chunkSize:questions.exam.length, finalLabel:'完成挑战'});
  core.unit34LearningProgress=()=>unit.reward.zones.map(zone=>({id:zone.id,completed:passed(zone.id)||Boolean(runners.get(zone.id)?.progress().completed),earned:Boolean(awardState.zones[zone.id])}));
  core.learningProgress=core.unit34LearningProgress;
  certificateView = core.storyCertificate.mount({element:surfaces.get('certificate'),unit,go:navigate,returnUrl:$('#logo').href,progress:id=>runners.get(id)?.progress(),restart:id=>runners.get(id)?.restart()});
  core.unit34History.show(practice,surfaces.get('certificate'));

  const writing = node('details', '', 'offline-task'); writing.id = 'unitWriting';
  writing.append(node('summary', '和家人再试试'),node('h3','Lesson 4 · 书面练习'), node('p', '各拿一件自己和家人的物品。先确定主人，再用 Is this your…? 问答，交换角色后留意 my 和 your 跟着说话人变化。只有明确知道是对方的，才能说 It’s your…。'), node('h4','A · Copy these sentences.'),node('p','抄写下面四句。'));
  const writingLines = node('ol', '', 'writing-lines'); ['This is not my umbrella.', 'Sorry, sir.', 'Is this your umbrella?', "No, it isn’t!"].forEach(text => writingLines.append(node('li', text))); writing.append(writingLines);
  const replyWriting = node('ol', '', 'reply-writing');
  content.SENTENCE_MODELS.slice(0, 10).forEach(item => {
    const line = node('li'); line.append(node('span', item.en), node('span', '', 'writing-rule'), node('span', '', 'writing-rule')); replyWriting.append(line);
  });
  writing.append(node('h4','B · Answer these questions.'),node('p', '下面每题都已知物品属于提问的家人。你来回答：不是我的，是你的。'), node('p', 'Example: Is this your umbrella?'),node('p', 'No. It isn’t my umbrella. It’s your umbrella.'), replyWriting);
  const printActions = node('div', '', 'activity-actions'); printActions.append(button('打印练习纸', () => {
    document.body.classList.add('print-writing'); root.print();
  }, 'btn btn-yellow')); writing.append(printActions); surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint', () => document.body.classList.remove('print-writing'));

  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route);
  const revealSavedLine = () => { if (dialogue.i >= 0) log.scrollTop = log.scrollHeight; };
  // Cached entry keeps the body hidden until images decode. Font readiness alone
  // can occur while the transcript has no layout and cannot restore scroll.
  // This is the loader's document event, not a canran storage key. Keep its
  // name intact when the /lesson/ publisher prefixes persistent storage keys.
  const readyEvent = ['canran', 'course-ready'].join(':');
  document.addEventListener(readyEvent,()=>{route();revealSavedLine();},{once:true});
  document.fonts.ready.then(() => requestAnimationFrame(() => { route(); revealSavedLine(); }));
})(globalThis);
