(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit910;
  const { stages, questions, learning: content } = unit;
  const scene = core.unit910Scene;
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
    const word = unit.objects.find(word => word.en === name);
    const path = content.PEOPLE[name]?.image || word?.image;
    if (!path) return icon(name, label);
    const picture = node('img', '', 'shop-icon'); picture.src = path; picture.alt = label; return picture;
  }
  const surfaces = new Map();
  const activities = stages.flatMap(stage => stage.activities.map(([id, title]) => ({ id, title, chapter: stage.id })));
  const aliases = { 'learn/trans': 'learn/reply' };
  const canonical = id => aliases[id] || id;
  const routes = new Set(['cover', ...stages.map(stage => stage.id), ...activities.map(item => 'learn/' + item.id)]);
  let active = '', certificateView;
  for (const stage of stages) {
    const section = node('section', '', 'shop-chapter'); section.id = stage.id;
    const heading = node('header', '', 'chapter-heading'); heading.append(node('h2', stage.title), node('span', '☆☆☆', 'lvl-stars')); section.append(heading);
    const link = node('a', stage.title); link.href = '#' + stage.id; $('.chapter-links').append(link);
    const option = node('option', stage.title); option.value = stage.id; $('.chapter-select select').append(option);
    for (const [id, title, illustration] of stage.activities) {
      const surface = node('section', '', 'shop-stage stage-' + id); surface.id = 'learn/' + id;
      surface.setAttribute('role', 'region'); surface.setAttribute('aria-label', title);
      const header = node('header', '', 'stage-heading');
      header.append(icon(illustration), node('h3', title), button('怎么玩', () => showHelp(id, title), 'workspace-back'));
      surface.append(header); surfaces.set(id, surface); section.append(surface);
    }
    $('#lessonWorkspace').append(section);
  }
  const navigate = id => {
    id = canonical(id);
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
    const original = id; id = canonical(id);
    if (!routes.has(id)) id = 'cover';
    if (id !== original) history.replaceState(null, '', '#' + id);
    markLocation(id);
    document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  $('#lessonWorkspace').addEventListener('click', event => {
    const surface = event.target.closest('.shop-stage'); if (!surface) return;
    markLocation(surface.id);
    if (location.hash !== '#' + surface.id) history.replaceState(null, '', '#' + surface.id);
  }, true);
  $('.chapter-select select').addEventListener('change', event => navigate(event.target.value));
  const resume = canonical(practice.activity('unitLocation'));
  if (resume && routes.has(resume) && resume !== 'cover') $('#startBtn').textContent = '继续冒险';
  $('#startBtn').addEventListener('click', () => {
    const saved = canonical(practice.activity('unitLocation')); navigate(routes.has(saved) && saved !== 'cover' ? saved : unit.start);
  });
  const help = {
    text: ['点“开始看课文”，用“下一句”展开对白。旧句可以向上查看，中文按句打开。'],
    roles: ['先看完故事，再来找答案。需要回顾时可以回到街角小剧场。'],
    words: ['点整张词卡看意思，再点收起。用上一组和下一组翻页。'],
    listen: ['看英文选词义，或根据图片、词义选英文。选好后点“检查答案”。'],
    phrases: ['看看不同表达怎样使用，再到下一站练一练。'],
    reply: ['先选回应，再拼出带回问的句子，最后接住朋友的告别。选好后点检查。'],
    describe: ['看清正在描述谁或什么。先选择，再点词块组织完整描述；不能从职业或一个否定词猜状态。'],
    models: ['选一个观察主题，一次比较两幅画面。冷热是另一幅画面，不改变故事中 Emma 身体好的信息。'],
    trans: ['点词块组成句子，点已选的词块可以撤回。全部用完再检查。'],
    certificate: ['完成五关后领取、保存或打印。证书记录练习完成，不评价自由口语或独立写作。']
  };
  function showHelp(id, title) {
    $('#helpTitle').textContent = title;
    $('#helpBody').replaceChildren(...(help[id] || ['选择后点“检查答案”。灯泡可以提供线索；用过线索会记在学习手记里。']).map(text => node('p', text)));
    $('#unitHelp').showModal();
  }
  document.querySelectorAll('[data-close]').forEach(control => control.addEventListener('click', () => control.closest('dialog').close()));
  $('#notebookButton').addEventListener('click', () => $('#unitNotebook').showModal());

  const signatures = Object.fromEntries(Object.entries(questions).map(([id, items]) => [id, JSON.stringify([unit.version, items])]));
  signatures.text = JSON.stringify([unit.version, content.DIALOGUE]);
  const saved = practice.activity('unitCompleted');
  const completed = saved && typeof saved === 'object' && !Array.isArray(saved) ? { ...saved } : {};
  const passed = id => practice.sameContentSignature(completed[id], signatures[id]);
  const fullyComplete = () => stages.every(stage => stage.required.every(passed));
  function updateProgress() {
    let total = 0;
    for (const stage of stages) {
      const count = stage.required.filter(passed).length, stars = Math.floor(count / stage.required.length * 3);
      total += stars;
      const label = $('#' + stage.id + ' .lvl-stars'); label.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars); label.setAttribute('aria-label', '本关 ' + stars + ' / 3 颗星');
    }
    $('#starCount').textContent = String(total);
    const next = activities.find(item => stages.find(stage => stage.id === item.chapter).required.includes(item.id) && !passed(item.id));
    certificateView?.update({ complete: fullyComplete(), completedChapters: stages.map(stage => stage.required.every(passed)), next: next ? { title: next.title, go: () => navigate('learn/' + next.id) } : null });
  }
  function complete(id) { completed[id] = signatures[id]; practice.activity('unitCompleted', completed); updateProgress(); }
  function nextStation(id, actions) {
    if (!actions || actions.querySelector('.station-actions')) return;
    const next = activities[activities.findIndex(item => item.id === id) + 1]; if (!next) return;
    const group = node('div', '', 'station-actions'); group.append(button('下一站：' + next.title, () => navigate('learn/' + next.id))); actions.append(group);
  }
  function mountPractice(id, settings = {}) {
    const element = node('div'); element.id = 'unit910-' + id + '-practice'; surfaces.get(id).append(element);
    const predecessors = unit.activityPredecessors[id];
    practice.mount({ element, questions: questions[id], sessionId: predecessors ? 'v2' : 'v' + unit.version,
      previousGroups: predecessors?.map(old => ({ key: 'unit910-' + old + '-practice/v1', questions: unit.previousQuestions[old] })), ...settings,
      onComplete: states => {
        complete(id);
        const summary = element.querySelector('.practice-finish > p');
        if (summary) summary.textContent = {roles:'故事里的朋友认清了！',reply:'问候接下去了！',describe:'观察说清楚了！',exam:'挑战完成！',listen:'寻宝完成！'}[id];
        nextStation(id, element.querySelector('.practice-finish-actions')); settings.onComplete?.(states);
      } });
    return element;
  }

  function mountGreetingTask(id) {
    const view = scene.taskView(id); surfaces.get(id).append(view.element);
    mountPractice(id, { sceneView: view, completionDetails: scene.result(id) });
  }
  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage');
  const friends = scene.friends();
  function actor(who, name) { const element = node('div', '', 'dialogue-actor'); element.dataset.actor = who; element.append(art(who === 'teacher' ? 'steven' : 'helen'), node('span', name)); return element; }
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文对话'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  stage.append(actor('teacher', 'Steven'), log, actor('student', 'Helen'));
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始看课文', advanceDialogue);
  tools.append(button('重新上演', resetDialogue, 'btn btn-yellow')); controls.append(advance, tools);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再看一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(node('p', '故事看完了！'), finishActions); story.append(stage, friends.element, status, controls, finish);
  const gate = node('div', '', 'activity-actions'); gate.append(button('先看故事', () => navigate('learn/text'))); surfaces.get('roles').append(gate);
  let storyStarted = false, dialogue = { i: -1, viewed: [], done: false };
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountGreetingTask('roles'); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function refreshDialogue() {
    friends.showLine(dialogue.i);
    stage.dataset.moment = dialogue.i < 6 ? 'greet' : dialogue.i < 10 ? 'friends' : 'goodbye';
    advance.textContent = dialogue.i < 0 ? '开始看课文' : dialogue.i === content.DIALOGUE.length - 1 ? '完成课文' : '下一句';
    controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
    status.textContent = dialogue.i < 0 ? '' : `${dialogue.i + 1} / ${content.DIALOGUE.length} 句`;
    log.querySelectorAll('.bubble-row').forEach((row, index) => row.classList.toggle('is-current', index === dialogue.i));
    stage.querySelectorAll('.dialogue-actor').forEach(person => person.classList.toggle('is-current', person.dataset.actor === content.DIALOGUE[dialogue.i]?.who));
  }
  function lead() { const lead = node('div', '', 'story-lead'); lead.append(art('emma'), node('p', 'Emma 身体好吗？')); log.replaceChildren(lead); }
  function appendLine(index) {
    const line = content.DIALOGUE[index], row = node('div', '', 'bubble-row ' + line.who), bubble = node('div', '', 'bubble');
    const speech = node('p', '', 'btext'); speech.append(node('span', line.text)); speech.lang = 'en';
    const translation = node('p', line.cn, 'bcn'); translation.hidden = true;
    const translate = button('看中文', () => {
      translation.hidden = !translation.hidden;
      translate.textContent = translation.hidden ? '看中文' : '收起中文';
      translate.setAttribute('aria-expanded', String(!translation.hidden));
      if (!translation.hidden) {
        // Reveal the new text within the fixed dialogue log, never scroll the page.
        const overflow = translation.getBoundingClientRect().bottom - log.getBoundingClientRect().bottom + 12;
        if (overflow > 0) log.scrollTop += overflow;
      }
    }, 'btn btn-mini btn-yellow'); translate.setAttribute('aria-expanded', 'false');
    const actions = node('div', '', 'bbtns'); actions.append(translate);
    bubble.append(node('div', content.PEOPLE[line.person].name, 'bname'), speech, translation, actions); row.append(bubble); log.append(row);
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
      const example = node('small', word.example || '', 'word-example'); example.hidden = !word.example;
      const card = button('', () => {
        const expanded = card.getAttribute('aria-expanded') !== 'true';
        card.setAttribute('aria-expanded', String(expanded)); meaning.hidden = !expanded;
      }, 'opt-btn unit-word');
      card.setAttribute('aria-label', word.en); card.setAttribute('aria-expanded', 'false');
      card.append(picture, node('strong', word.en), pronunciation, meaning, example); wordGrid.append(card);
    }
    previousWords.disabled = wordPage === 0; wordProgress.textContent = `${wordPage + 1} / ${pageCount}`;
    nextWords.setAttribute('aria-label', wordPage === pageCount - 1 ? '下一站：单词寻宝' : '下一组词卡');
    if (wordPage === pageCount - 1) nextWords.replaceChildren(node('span', '下一站：'), node('span', '单词寻宝'));
    else nextWords.textContent = '下一组词卡';
  }
  renderWords();
  mountPractice('listen', { allowHints: false });

  function expressionCard(expression) {
    const picture = node('img'); picture.src = expression.image; picture.alt = '';
    const caption = node('span', expression.cn);
    const card = node('article', '', 'phrase-card reference-card');
    card.append(picture, node('strong', expression.en), caption); return card;
  }
  const phraseGrid = node('div', '', 'phrase-grid');
  content.PHRASES.forEach(item => phraseGrid.append(expressionCard(item)));
  const shortForms=node('details','','offline-task');shortForms.append(node('summary','一句话变短'));
  for(const [left,right] of [['He is',"He's"],['She is',"She's"],['It is',"It's"],['How is',"How's"]]){
    const row=node('p','','contraction-row');row.append(node('span',left),node('span','→'),node('span',right));shortForms.append(row);
  }
  const phraseActions=node('div','','activity-actions');nextStation('phrases',phraseActions);surfaces.get('phrases').append(phraseGrid,shortForms,phraseActions);
  const modelExample=node('div','','model-example');modelExample.append(expressionCard(content.MODEL_EXAMPLE));
  const modelTabs=node('div','','observation-tabs');modelTabs.setAttribute('role','group');modelTabs.setAttribute('aria-label','选择观察主题');
  const modelGrid=node('div','','observation-pair');modelGrid.setAttribute('role','region');modelGrid.setAttribute('aria-label','当前观察画面');
  const modelLabels=['胖瘦','高矮','脏净','冷热','老少','忙与懒'];
  function showModels(index) {
    modelGrid.replaceChildren();
    if(index===3)modelGrid.append(node('p','另一幅画面：觉得冷、热，不等于身体不好。','observation-note'));
    else if(index===5)modelGrid.append(node('p','只描述画中情境。休息不等于懒惰，职业也不能决定忙懒。','observation-note'));
    else modelGrid.append(node('p',index<2?'只观察画中的人物，不评价身边的朋友。':'看此刻的画面，不从职业猜状态。','observation-note'));
    const pair=node('div','','phrase-grid');content.MODELS.slice(index*2,index*2+2).forEach(item=>pair.append(expressionCard(item)));modelGrid.append(pair);
    [...modelTabs.children].forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));
    practice.activity('unitObservationPair',index);
  }
  modelLabels.forEach((label,index)=>modelTabs.append(button(label,()=>showModels(index),'btn btn-mini btn-yellow')));
  const remembered=practice.activity('unitObservationPair');showModels(Number.isInteger(remembered)&&remembered>=0&&remembered<6?remembered:0);
  const reference=node('details','','offline-task');reference.append(node('summary','换个说法，说清楚'));
  reference.append(node('p','He’s = He is，She’s = She is，It’s = It is。不冷不一定就是热：只有句子或画面提供了 hot 的信息，才能说 hot。'));
  const referenceGrid=node('div','','phrase-grid');content.REFERENCE.forEach(item=>referenceGrid.append(expressionCard(item)));reference.append(referenceGrid);
  const wording=node('details','','offline-task');wording.append(node('summary','描述也要友善'),node('p','这些画面只描述图中的人，不能代表整个职业。休息不等于懒惰，胖瘦高矮也不决定一个人的好坏。练习用画中人物，不给身边的朋友贴标签。'));
  const modelActions=node('div','','activity-actions');nextStation('models',modelActions);surfaces.get('models').append(modelExample,modelTabs,modelGrid,reference,wording,modelActions);
  mountGreetingTask('reply');
  mountPractice('describe', { completionDetails: scene.result('describe') });

  const examResults = node('div', '', 'unit-results');
  mountPractice('exam', { chunkSize: questions.exam.length, finalLabel: '查看本次记录', completionDetails: examResults, onComplete: states => {
    const independent = states.filter(state => state.firstCorrect && !state.hintUsed && !state.ruleUsed && !state.revealed).length;
    const assisted = states.filter(state => state.firstCorrect && (state.hintUsed || state.ruleUsed || state.revealed)).length;
    const corrected = states.filter(state => !state.firstCorrect).length;
    examResults.replaceChildren(node('p', `首次独立答对 ${independent} / ${questions.exam.length}`), node('p', `提示后完成 ${assisted} 题 · 修正后完成 ${corrected} 题`));
    const targets = questions.exam.filter((_, index) => !states[index].firstCorrect || states[index].hintUsed || states[index].ruleUsed || states[index].revealed).map(q => q.target);
    if (targets.length) { const details = node('details'), list = node('ul'); details.append(node('summary', '下次再练')); targets.forEach(target => list.append(node('li', target))); details.append(list); examResults.append(details); }
  } });
  certificateView = core.unitCertificate.mount({
    element: surfaces.get('certificate'), initialName: practice.activity('unitName'), initialIssuedAt: practice.activity('unitClassroomCertificateIssuedAt'), canClaim: fullyComplete,
    onClaim: ({ name, issuedAt }) => { practice.activity('unitName', name); practice.activity('unitClassroomCertificateIssuedAt', issuedAt); },
    design: {
      copy: { title: '暖心的小伙伴', course: '街角问候站 · Lesson 9–10', completion: '完成 Lesson 9–10 课堂配套练习', thanks: '细心观察，友好问候，发现身边的小变化！' },
      keepsakes: [{title:'把问候接下去',text:"I'm fine, thanks. And you?"},{title:'看清楚再描述',text:"Look at that umbrella. It's dirty."}],
      characters: ['steven', 'helen'], characterLabels: ['Steven', 'Helen'], icon: art, defaultName: '暖心的小伙伴', dialogTitle: '街角问候站纪念', fileName: 'Lesson9-10-街角问候站.png',
      badges: stages.map((stage, index) => ({ title: stage.title, icon: { l1: 'cards', l2: 'book', l3: 'heart', l4: 'question', l5: 'star' }[stage.id], color: ['#FFF0BC', '#FBE2CD', '#E1EDD5', '#DFEAF1', '#F8DCD4'][index] }))
    }
  });

  const writing = node('details', '', 'offline-task'); writing.id = 'unitWriting';
  writing.append(node('summary','和朋友再试试'),node('p','课堂上跟老师读词语和课文，再听老师说词、找对应图卡。用虚构角色练习问候，轮流问 How are you? 并回应、回问。再选一张画卡，用 Look at… 描述图中的人或物。'));
  writing.append(node('h4','Lesson 9–10 · 纸笔小练习'),node('p',"A．填 He's、She's 或 It's。例：Robert isn't a teacher. He's an engineer."));
  const referenceWriting=node('ol','','reference-writing');
  ["Mr. Blake isn't a student. ___ a teacher.","This isn't my umbrella. ___ your umbrella.","Sophie isn't a teacher. ___ a keyboard operator.","Steven isn't cold. ___ hot.","Naoko isn't Chinese. ___ Japanese.","This isn't a German car. ___ a Swedish car."].forEach(text=>{const row=node('li'),[before,after]=text.split('___');row.append(document.createTextNode(before),node('span','___','writing-blank'),document.createTextNode(after));referenceWriting.append(row);});writing.append(referenceWriting);
  writing.append(node('p','B．根据所给人物和描述词写两句话。人物用 he 或 she 已标明。'),node('p',"例：Helen / well → Look at Helen. She's very well."));
  const replyWriting=node('ol','','reply-writing');content.MODELS.forEach(item=>{const row=node('li');row.append(node('span',item.subject+' / '+item.adjective+' · '+item.pronoun),node('span','','writing-rule'),node('span','','writing-rule'));replyWriting.append(row);});writing.append(replyWriting);
  const printActions = node('div', '', 'activity-actions');
  printActions.append(button('打印练习纸', () => { document.body.classList.add('print-writing'); root.print(); }, 'btn btn-yellow'));
  writing.append(printActions); surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint', () => document.body.classList.remove('print-writing'));

  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route);
  const revealSavedLine = () => { if (dialogue.i >= 0) log.scrollTop = log.scrollHeight; };
  const readyEvent = ['canran', 'course-ready'].join(':');
  document.addEventListener(readyEvent, revealSavedLine, { once: true });
  document.fonts.ready.then(() => requestAnimationFrame(() => { route(); revealSavedLine(); }));
})(globalThis);
