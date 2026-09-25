(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit56;
  const { stages, questions, learning: content } = unit;
  const practice = core.lesson49Practice;
  const $ = selector => document.querySelector(selector);
  const icon = core.lesson49Icons.create;
  // A missing recording never silently changes the voice or counts as heard.
  const audio = core.audio.createAudioPlayer({ speechSynthesis: null, UtteranceCtor: null });
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
  function speak(text, onFinish, source = content.AUDIO[text]) {
    return audio.play({ text, src: source ? core.courseCatalog.publicAssetUrl(source) : '', retrySource: true,
      onFinish: result => onFinish?.(result.sourceFailed ? { ...result, reason: 'failed' } : result) });
  }
  const surfaces = new Map();
  const activities = stages.flatMap(stage => stage.activities.map(([id, title]) => ({ id, title, chapter: stage.id })));
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
    // Scrolling back to the cover keeps the hash; resume must still reposition.
    if (location.hash === '#' + id) route();
    else location.hash = id;
  };
  function markLocation(id) {
    if (!routes.has(id)) return;
    if (active !== id) { audio.stop(); root.dispatchEvent(new Event('lesson49:leave-activity')); active = id; }
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
    if (!routes.has(id)) id = 'cover'; markLocation(id);
    document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  $('#lessonWorkspace').addEventListener('click', event => {
    const surface = event.target.closest('.shop-stage'); if (!surface) return;
    markLocation(surface.id);
    if (location.hash !== '#' + surface.id) history.replaceState(null, '', '#' + surface.id);
  }, true);
  $('.chapter-select select').addEventListener('change', event => navigate(event.target.value));
  const resume = practice.activity('unitLocation');
  if (resume && routes.has(resume) && resume !== 'cover') $('#startBtn').textContent = '继续冒险';
  $('#startBtn').addEventListener('click', () => {
    const saved = practice.activity('unitLocation'); navigate(routes.has(saved) && saved !== 'cover' ? saved : unit.start);
  });
  const help = {
    text: ['点“开始听课文”，每句听完后点“下一句”。点旧句可以重听，中文按句查看。'],
    roles: ['先听完故事，再来找答案。需要回顾时可以回到教室小剧场。'],
    words: ['点整张词卡听发音、看意思。用上一组和下一组翻页。'],
    listen: ['先点喇叭，再选出听到的单词。录音听完才可以检查，随时可以重听。'],
    phrases: ['点表达卡听一听，再到下一站试着使用。'],
    refer: ['看清句子接着介绍谁，再选择 he、she 或 it。'],
    articles: ['选好空格中的内容，再检查；没有需要的词时选“不填”。'],
    models: ['点卡片听介绍；展开后可以听完整问答。'],
    choice: ['读清问题，选择能回答它的一句话。'],
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
  // This pronunciation-only replacement keeps the same text and questions.
  // Accept only the exact former audio path, not arbitrary older story content.
  const priorPronunciationSignature = JSON.stringify([unit.version, content.DIALOGUE.map(line =>
    line.id === 'L05-D12' && line.audio === 'unit5-6/audio/l05-d12-v2.mp3'
      ? { ...line, audio: 'unit5-6/audio/l05-d12.mp3' } : line)]);
  const sameDialogue = signature => signature === signatures.text || signature === priorPronunciationSignature;
  const saved = practice.activity('unitCompleted');
  const completed = saved && typeof saved === 'object' && !Array.isArray(saved) ? { ...saved } : {};
  if (completed.text === priorPronunciationSignature && completed.text !== signatures.text) {
    completed.text = signatures.text; practice.activity('unitCompleted', completed);
  }
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
    const element = node('div'); element.id = 'unit56-' + id + '-practice'; surfaces.get(id).append(element);
    practice.mount({ element, questions: questions[id], playAudio: speak, sessionId: 'v' + unit.version, ...settings,
      onComplete: states => { complete(id); nextStation(id, element.querySelector('.practice-finish-actions')); settings.onComplete?.(states); } });
    return element;
  }

  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage');
  function actor(who, name) { const element = node('div', '', 'dialogue-actor'); element.dataset.actor = who; element.append(art(who === 'teacher' ? 'blake' : 'sophie'), node('span', name)); return element; }
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文对话'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  stage.append(actor('teacher', 'Mr. Blake'), log, actor('student', 'Sophie'));
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始听课文', advanceDialogue);
  const replay = button('重听本句', () => playLine(dialogue.i), 'btn btn-yellow');
  tools.append(replay, button('重新上演', resetDialogue, 'btn btn-yellow')); controls.append(advance, tools);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再听一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(node('p', '故事听完了！'), finishActions); story.append(stage, status, controls, finish);
  const gate = node('div', '', 'activity-actions'); gate.append(button('先听故事', () => navigate('learn/text'))); surfaces.get('roles').append(gate);
  let storyStarted = false, dialogue = { i: -1, heard: [], done: false }, generation = 0;
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountPractice('roles'); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function clearPlaying() {
    log.querySelectorAll('.bubble-row').forEach(row => { row.classList.remove('is-playing'); row.querySelector('.btext').setAttribute('aria-busy', 'false'); });
    stage.querySelectorAll('.dialogue-actor').forEach(person => person.classList.remove('speaking'));
  }
  function refreshDialogue() {
    advance.disabled = dialogue.i >= 0 && !dialogue.heard[dialogue.i];
    advance.textContent = dialogue.i < 0 ? '开始听课文' : dialogue.i === content.DIALOGUE.length - 1 ? '完成课文学习' : '下一句';
    replay.disabled = dialogue.i < 0; controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
  }
  function lead() { const lead = node('div', '', 'story-lead'); lead.append(art('chang'), node('p', 'Chang-woo 是中国人吗？')); log.replaceChildren(lead); }
  function showPerson(index) {
    const person = content.PEOPLE[content.DIALOGUE[index]?.focus || 'students'];
    const actor = stage.querySelector('[data-actor="student"]');
    actor.querySelector('img').src = person.image;
    actor.querySelector('span').textContent = person.name;
  }
  function appendLine(index) {
    const line = content.DIALOGUE[index], row = node('div', '', 'bubble-row ' + line.who), bubble = node('div', '', 'bubble');
    const speech = button('', () => playLine(index), 'btext'); speech.append(node('span', line.text), icon('audio')); speech.setAttribute('aria-busy', 'false');
    const translation = node('p', line.cn, 'bcn'); translation.hidden = true;
    const translate = button('看中文', () => { translation.hidden = !translation.hidden; translate.textContent = translation.hidden ? '看中文' : '收起中文'; translate.setAttribute('aria-expanded', String(!translation.hidden)); }, 'btn btn-mini btn-yellow'); translate.setAttribute('aria-expanded', 'false');
    const actions = node('div', '', 'bbtns'); actions.append(translate);
    bubble.append(node('div', content.PEOPLE[line.person].name, 'bname'), speech, translation, actions); row.append(bubble); log.append(row);
  }
  function playLine(index) {
    if (index < 0) return;
    showPerson(index);
    const ticket = ++generation, line = content.DIALOGUE[index]; clearPlaying(); status.textContent = '';
    const row = log.children[index]; row.classList.add('is-playing'); row.querySelector('.btext').setAttribute('aria-busy', 'true');
    stage.querySelector('[data-actor="' + line.who + '"]').classList.add('speaking');
    if (index === dialogue.i) advance.disabled = true;
    speak(line.text, result => {
      if (ticket !== generation) return;
      clearPlaying();
      if (index === dialogue.i && result.reason === 'ended') { dialogue.heard[index] = true; saveDialogue(); }
      refreshDialogue();
      if (!['ended', 'cancelled'].includes(result.reason)) status.textContent = '录音还没听完，点句子再试一次。';
    }, line.audio);
  }
  function advanceDialogue() {
    if (dialogue.done || (dialogue.i >= 0 && !dialogue.heard[dialogue.i])) return;
    if (dialogue.i === content.DIALOGUE.length - 1) {
      if (!content.DIALOGUE.every((_, index) => dialogue.heard[index] === true)) return;
      dialogue.done = true; saveDialogue(); complete('text'); unlockStory(); refreshDialogue(); core.lesson49Feedback.play('complete'); return;
    }
    if (dialogue.i < 0) log.replaceChildren(); dialogue.i++; saveDialogue(); appendLine(dialogue.i); refreshDialogue(); log.scrollTop = log.scrollHeight; playLine(dialogue.i);
  }
  function resetDialogue() { ++generation; audio.stop(); clearPlaying(); dialogue = { i: -1, heard: [], done: false }; saveDialogue(); lead(); showPerson(-1); status.textContent = ''; refreshDialogue(); }
  const draft = practice.activity('unitDialogue');
  if (sameDialogue(draft?.signature) && Number.isInteger(draft.i) && draft.i >= 0 && draft.i < content.DIALOGUE.length && Array.isArray(draft.heard)) {
    const gap = content.DIALOGUE.findIndex((_, index) => index < draft.i && draft.heard[index] !== true), index = gap < 0 ? draft.i : gap;
    dialogue = { i: index, heard: draft.heard.slice(0, index + 1).map(value => value === true), done: draft.done === true && index === content.DIALOGUE.length - 1 && content.DIALOGUE.every((_, i) => draft.heard[i] === true) };
    for (let i = 0; i <= index; i++) appendLine(i);
    if (draft.signature !== signatures.text) saveDialogue();
    if (dialogue.done) complete('text');
  } else lead();
  showPerson(dialogue.i); refreshDialogue(); unlockStory();
  root.addEventListener('lesson49:leave-activity', () => { ++generation; clearPlaying(); refreshDialogue(); });

  const wordHost = surfaces.get('words'), wordGrid = node('div', '', 'unit-words');
  const wordControls = node('div', '', 'word-controls'), wordProgress = node('span');
  const pageCount = Math.ceil(content.WORDS.length / 6), savedPage = practice.activity('unitWordPage');
  let wordPage = Number.isInteger(savedPage) ? Math.max(0, Math.min(pageCount - 1, savedPage)) : 0;
  const previousWords = button('上一组词卡', () => changeWordPage(-1), 'btn btn-yellow');
  const nextWords = button('下一组词卡', () => wordPage === pageCount - 1 ? navigate('learn/listen') : changeWordPage(1));
  wordProgress.id = 'wordPageProgress'; wordControls.append(previousWords, wordProgress, nextWords); wordHost.append(wordGrid, wordControls);
  function changeWordPage(delta) { wordPage += delta; audio.stop(); renderWords(); practice.revealQuestion(wordHost, wordHost.querySelector('h3')); }
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
        speak(word.en, result => {
          card.classList.remove('is-playing'); card.setAttribute('aria-busy', 'false');
          if (!['ended', 'cancelled'].includes(result.reason)) { meaning.textContent = '录音暂时没播出，再点一次试试。'; meaning.hidden = false; }
        }, word.audio);
        card.classList.add('is-playing'); card.setAttribute('aria-busy', 'true'); meaning.textContent = word.cn;
      }, 'opt-btn unit-word');
      card.setAttribute('aria-label', word.en); card.setAttribute('aria-expanded', 'false'); card.setAttribute('aria-busy', 'false');
      card.append(picture, node('strong', word.en), pronunciation, meaning, example); wordGrid.append(card);
    }
    previousWords.disabled = wordPage === 0; wordProgress.textContent = `${wordPage + 1} / ${pageCount}`;
    nextWords.setAttribute('aria-label', wordPage === pageCount - 1 ? '下一站：听音寻宝' : '下一组词卡');
    if (wordPage === pageCount - 1) nextWords.replaceChildren(node('span', '下一站：'), node('span', '听音寻宝'));
    else nextWords.textContent = '下一组词卡';
  }
  renderWords();
  mountPractice('listen', { allowHints: false, optionImages: Object.fromEntries(unit.objects.map(word => [word.en, word.image])) });

  function expressionCard(expression) {
    const picture = node('img'); picture.src = expression.image; picture.alt = '';
    const caption = node('span', expression.cn);
    const card = button('', () => {
      card.setAttribute('aria-busy', 'true'); caption.textContent = expression.cn;
      speak(expression.en, result => {
        card.setAttribute('aria-busy', 'false');
        if (!['ended', 'cancelled'].includes(result.reason)) caption.textContent = '录音暂时没播出，再点一次试试。';
      });
    }, 'opt-btn phrase-card');
    card.setAttribute('aria-label', expression.en); card.setAttribute('aria-busy', 'false');
    card.append(picture, node('strong', expression.en), caption); return card;
  }
  const phraseGrid = node('div', '', 'phrase-grid');
  content.PHRASES.forEach(expression => phraseGrid.append(expressionCard(expression)));
  const reference = node('details', '', 'offline-task'); reference.append(node('summary', '他、她、它怎么接着说'));
  const referenceGrid = node('div', '', 'phrase-grid'); content.REFERENCE.forEach(item => referenceGrid.append(expressionCard(item))); reference.append(referenceGrid);
  reference.append(node('p', '本课用 he 说 Hans，用 she 说 Sophie、Alice；说汽车用 it。her 是“她的”，his 是“他的”，不把汽车当成人。'));
  const articleGuide = node('details', '', 'offline-task'); articleGuide.append(node('summary', 'a、an 放在哪里'));
  articleGuide.append(node('p', 'a French student · an English car。a／an 看紧接着的发音，不只看字母。She is French. 里的 French 直接说明国籍，前面不加 a 或 an。'));
  const soundExamples = node('div', '', 'activity-actions');
  ['French', 'English'].forEach(en => soundExamples.append(button(en, () => speak(en), 'btn btn-yellow'))); articleGuide.append(soundExamples);
  const shortForms = node('details', '', 'offline-task'); shortForms.append(node('summary', '一句话变短'));
  for (const [left, right] of [['He is', "He's"], ['She is', "She's"], ['It is', "It's"], ['is not', "isn't"]]) {
    const row = node('p', '', 'contraction-row'); row.append(node('span', left), node('span', '→'), node('span', right)); shortForms.append(row);
  }
  const phraseActions = node('div', '', 'activity-actions'); nextStation('phrases', phraseActions);
  surfaces.get('phrases').append(phraseGrid, reference, articleGuide, shortForms, phraseActions);
  const carGrid = node('div', '', 'phrase-grid'); content.CARS.forEach(item => carGrid.append(expressionCard(item)));
  const makeGuide = expressionCard({en:'What make is it?',cn:'问汽车品牌',image:'/assets/unit5-6/make.svg'});
  const choices = node('details', '', 'offline-task'); choices.append(node('summary', '换个朋友或汽车问一问'));
  choices.append(node('p', 'or 给出两种选择，回答要说清是哪一种。下面都先否定不符合的情况，再说明正确情况。'));
  for (const item of content.CHOICE_MODELS) {
    const pair=node('div','','model-pair'); pair.append(node('p',item.name+' · '+item.right));
    const grid=node('div','','phrase-grid'); grid.append(expressionCard({en:item.question,cn:'问一问',image:item.image}),expressionCard({en:item.answer,cn:'答一答',image:item.image}));pair.append(grid);choices.append(pair);
  }
  const modelActions=node('div','','activity-actions');nextStation('models',modelActions);
  surfaces.get('models').append(makeGuide,carGrid,choices,modelActions);
  for(const id of ['refer','articles','choice','trans'])mountPractice(id);

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
    element: surfaces.get('certificate'), initialName: practice.activity('unitName'), initialIssuedAt: practice.activity('unitCertificateIssuedAt'), canClaim: fullyComplete,
    onClaim: ({ name, issuedAt }) => { practice.activity('unitName', name); practice.activity('unitCertificateIssuedAt', issuedAt); },
    design: {
      copy: { title: '新朋友小使者', course: '新朋友见面会 · Lesson 5–6', completion: '完成 Lesson 5–6 单元练习', thanks: '认识新朋友，大方说你好！' },
      characters: ['blake', 'sophie'], characterLabels: ['Mr. Blake', 'Sophie'], icon: art, defaultName: '新朋友小使者', dialogTitle: '新朋友见面会纪念', fileName: 'Lesson5-6-新朋友见面会.png',
      badges: stages.map((stage, index) => ({ title: stage.title, icon: { l1: 'cards', l2: 'book', l3: 'heart', l4: 'question', l5: 'star' }[stage.id], color: ['#FFF0BC', '#FBE2CD', '#E1EDD5', '#DFEAF1', '#F8DCD4'][index] }))
    }
  });

  const writing = node('details', '', 'offline-task'); writing.id = 'unitWriting';
  writing.append(node('summary', '和朋友再试试'), node('p', '各选一张课文人物卡，轮流问好、介绍对方，再交换角色。用卡片上明确写出的信息，不猜真实朋友的国籍。'));
  writing.append(node('h4', 'Lesson 5–6 · 纸笔小练习'), node('p', 'A．填 he、she 或 it。句首字母大写。Stella 是女同学；Spanish 是“西班牙的”。'), node('p', '例：Stella is a student. She isn’t German. She is Spanish.'));
  const referenceWriting = node('ol', '', 'reference-writing');
  ['Alice 是女同学。Alice is a student. ___ isn’t German. ___ is French.', 'This is her car. ___ is a French car.', 'Hans is a student. ___ isn’t French. ___ is German.', 'This is his car. ___ is a German car.'].forEach(text => referenceWriting.append(node('li', text)));
  writing.append(referenceWriting, node('p', 'B．按所给条件，先否定斜线后的一项，再说明斜线前的正确情况。Naoko、Xiaohui 用 she；Hans、Chang-woo、Luming 用 he；汽车用 it。'), node('p', '例：Sophie · French / Swedish → She isn’t a Swedish student. She’s a French student.'), node('p', '例：Volvo · Swedish / French → It isn’t a French car. It’s a Swedish car.'));
  const replyWriting = node('ol', '', 'reply-writing');
  content.CHOICE_MODELS.slice(2).forEach(item => {
    const row = node('li'); row.append(node('span', `${item.name} · ${item.right} / ${item.wrong}`), node('span', '', 'writing-rule'), node('span', '', 'writing-rule')); replyWriting.append(row);
  });
  writing.append(replyWriting);
  const printActions = node('div', '', 'activity-actions');
  printActions.append(button('打印练习纸', () => { document.body.classList.add('print-writing'); root.print(); }, 'btn btn-yellow'));
  writing.append(printActions); surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint', () => document.body.classList.remove('print-writing'));

  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route); root.addEventListener('pagehide', () => audio.stop());
  document.fonts.ready.then(() => requestAnimationFrame(() => { route(); log.scrollTop = log.scrollHeight; }));
})(globalThis);
