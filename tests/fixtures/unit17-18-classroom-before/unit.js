(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit1718;
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
    const word = unit.objects.find(word => word.en === name);
    const path = content.PEOPLE[name]?.image || word?.image;
    if (!path) return icon(name, label);
    const picture = node('img', '', 'shop-icon'); picture.src = path; picture.alt = label; return picture;
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
    text: ['点“开始看课文”，用“下一句”展开对白。旧句可以向上查看，中文按句打开。'],
    roles: ['先看完故事，再来找答案。需要回顾时可以回到办公室小剧场。'],
    words: ['点整张词卡看意思，再点收起。用上一组和下一组翻页。'],
    listen: ['看英文选词义，或根据图片、词义选英文。选好后点“检查答案”。'],
    phrases: ['看看不同表达怎样使用，再到下一站练一练。'],
    refer: ['根据课文和说话者的位置，选出合适的表达。'],
    forms: ['想想一个人变成多个人时，单词怎样变化。'],
    models: ['展开职业图和完整问答，课堂上和朋友交换介绍者与访客的角色。'],
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
    const element = node('div'); element.id = 'unit1718-' + id + '-practice'; surfaces.get(id).append(element);
    practice.mount({ element, questions: questions[id], sessionId: 'v' + unit.version, ...settings,
      onComplete: states => { complete(id); nextStation(id, element.querySelector('.practice-finish-actions')); settings.onComplete?.(states); } });
    return element;
  }

  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage');
  function actor(who, name) { const element = node('div', '', 'dialogue-actor'); element.dataset.actor = who; element.append(art(who === 'teacher' ? 'jackson' : 'richards'), node('span', name)); return element; }
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文对话'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  stage.append(actor('teacher', 'Mr. Jackson'), log, actor('student', 'Mr. Richards'));
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始看课文', advanceDialogue);
  tools.append(button('重新上演', resetDialogue, 'btn btn-yellow')); controls.append(advance, tools);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再看一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(node('p', '故事看完了！'), finishActions); story.append(stage, status, controls, finish);
  const gate = node('div', '', 'activity-actions'); gate.append(button('先看故事', () => navigate('learn/text'))); surfaces.get('roles').append(gate);
  let storyStarted = false, dialogue = { i: -1, viewed: [], done: false };
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountPractice('roles'); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function refreshDialogue() {
    advance.textContent = dialogue.i < 0 ? '开始看课文' : dialogue.i === content.DIALOGUE.length - 1 ? '完成课文' : '下一句';
    controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
    status.textContent = dialogue.i < 0 ? '' : `${dialogue.i + 1} / ${content.DIALOGUE.length} 句`;
    log.querySelectorAll('.bubble-row').forEach((row, index) => row.classList.toggle('is-current', index === dialogue.i));
    stage.querySelectorAll('.dialogue-actor').forEach(person => person.classList.toggle('is-current', person.dataset.actor === content.DIALOGUE[dialogue.i]?.who));
  }
  function lead() { const lead = node('div', '', 'story-lead'); lead.append(art('employee'), node('p', 'Michael 和 Jeremy 是做什么工作的？')); log.replaceChildren(lead); }
  function appendLine(index) {
    const line = content.DIALOGUE[index], row = node('div', '', 'bubble-row ' + line.who), bubble = node('div', '', 'bubble');
    const speech = node('p', '', 'btext'); speech.append(node('span', line.text)); speech.lang = 'en';
    const translation = node('p', line.cn, 'bcn'); translation.hidden = true;
    const translate = button('看中文', () => { translation.hidden = !translation.hidden; translate.textContent = translation.hidden ? '看中文' : '收起中文'; translate.setAttribute('aria-expanded', String(!translation.hidden)); }, 'btn btn-mini btn-yellow'); translate.setAttribute('aria-expanded', 'false');
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
    const source = draft.viewed;
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
      pronunciation.id = 'u1718-' + word.en.replaceAll(' ', '-') + '-phonetic';
      meaning.id = 'u1718-' + word.en.replaceAll(' ', '-') + '-meaning';
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

  function expressionCard(expression) {
    const picture = node('img'); picture.src = expression.image; picture.alt = '';
    const caption = node('span', expression.cn);
    const card = node('article', '', 'phrase-card reference-card');
    card.append(picture, node('strong', expression.en), caption); return card;
  }
  const phraseGrid=node('div','','phrase-grid');content.PHRASES.forEach(item=>phraseGrid.append(expressionCard(item)));
  const phraseActions=node('div','','activity-actions');nextStation('phrases',phraseActions);
  const pronouns=node('details','','offline-task');pronouns.append(node('summary','they 和 their 怎么分？'),
    node('p',"They are sales reps. 中 They 表示他们，作主语。their 表示他们的／她们的／它们的，放在名词前：their jobs。"),
    node('p',"they are = they're；are not = aren't。What are their jobs? 问职业；Who is this young man? 问人是谁。"));
  const context=node('details','','offline-task');context.append(node('summary','把话放回故事里'),
    node('p','They aren’t very busy! 只表示他们不很忙，不能据此判断他们懒惰。'),
    node('p','They’re very lazy. 是 Jackson 对这两位同事的评价，不是对某一种职业或性别的评价。休息、喝茶也不等于懒惰。'),
    node('p','How do you do? 是初次正式见面的问候，通常也用 How do you do? 回应，并不是询问健康。'));
  surfaces.get('phrases').append(phraseGrid,pronouns,context,phraseActions);
  const galleryDetails=node('details','','offline-task');galleryDetails.append(node('summary','看看成双的职业'));
  const gallery=node('div','','phrase-grid job-gallery');content.GALLERY.forEach(item=>gallery.append(expressionCard(item)));galleryDetails.append(gallery);
  const modelExample=node('div','','model-example');modelExample.append(expressionCard(content.MODEL_EXAMPLE));
  const models=node('details','','offline-task');models.append(node('summary','看看完整问答'));
  const modelGrid=node('div','','phrase-grid reply-models');content.MODELS.forEach(item=>modelGrid.append(expressionCard(item)));models.append(modelGrid);
  const reference=node('details','','offline-task');reference.append(node('summary','He、She、We 还是 They？'),
    node('p','例：Those men are lazy. They are sales reps.'),
    node('p','第 4 句的 office assistant 指课文 Jim；第 5 句的 Nicola 指 Nicola Grey。根据课文确定身份，不按职业或姓名猜性别。'));
  const pronounList=node('ol','','pronoun-models');content.REFERENCE.forEach(item=>pronounList.append(node('li',item.en)));reference.append(pronounList);
  const plurals=node('details','','offline-task');plurals.append(node('summary','一个人变多个人'),
    node('p','man → men；woman → women。policeman → policemen；policewoman → policewomen；milkman → milkmen；postman → postmen。'),
    node('p','housewife → housewives。这个词把 fe 改成 ves；并非所有 f 或 fe 结尾的词都这样变化。'),
    node('p','跟老师读：man /mæn/ → men /men/；woman /ˈwʊmən/ → women /ˈwɪmɪn/。'));
  const numbers=node('details','','offline-task');numbers.append(node('summary','跟老师读数字'),node('p','100 · 200 · 300 · 400 · 500 · 600 · 700 · 800 · 900 · 1,000 · 1,001 · 1,002 · 1,003 · 1,004 · 1,005'));
  const modelActions=node('div','','activity-actions');nextStation('models',modelActions);
  surfaces.get('models').append(modelExample,galleryDetails,models,reference,plurals,numbers,modelActions);
  for (const id of ['refer','forms','trans']) mountPractice(id);
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
      copy: { title: '热心的小小介绍员', course: '办公室探访记 · Lesson 17–18', completion: '完成 Lesson 17–18 课堂配套练习', thanks: '认识新同事，把他们的工作介绍清楚！' },
      characters: ['jackson', 'richards'], characterLabels: ['Mr. Jackson', 'Mr. Richards'], icon: art, defaultName: '热心的小小介绍员', dialogTitle: '办公室探访记纪念', fileName: 'Lesson17-18-办公室探访记.png',
      badges: stages.map((stage, index) => ({ title: stage.title, icon: { l1: 'cards', l2: 'book', l3: 'question', l4: 'order', l5: 'star' }[stage.id], color: ['#FFF0BC', '#DCEDE5', '#E1EDD5', '#DFEAF1', '#F8DCD4'][index] }))
    }
  });

  const writing=node('details','','offline-task');writing.id='unitWriting';
  writing.append(node('summary','和朋友再试试'),node('p','跟老师听辨职业、读课文和复数词。拿人物职业卡，两人交换介绍者与访客的角色：先问好，再问 Who is this …? 和 What are their jobs?，用 Are they … or …? 猜职业并核对。'));
  writing.append(node('h4','Lesson 17–18 · 纸笔小练习'),node('p','A．用 He、She、We 或 They 填空。例：Those men are lazy. They are sales reps.'),node('p','第 4 题 office assistant 指课文 Jim；第 5 题 Nicola 指课文 Nicola Grey。'));
  const referenceWriting=node('ol','','reference-writing');content.REFERENCE.forEach(item=>{const row=node('li'),sentence=node('span'),parts=item.prompt.split('___');sentence.append(document.createTextNode(parts[0]),node('span','___','writing-blank'),document.createTextNode(parts[1]));row.append(sentence);referenceWriting.append(row);});writing.append(referenceWriting);
  writing.append(node('p','B．仿照例子，问职业并纠正猜测。'),node('p',"例：(mechanics) / sales reps → What are their jobs? Are they mechanics or sales reps? They aren't mechanics. They're sales reps."));
  const replyWriting=node('ol','','reply-writing');content.MODELS.forEach(item=>{const row=node('li');row.append(node('span','('+item.wrong+') / '+item.right));for(let i=0;i<6;i++)row.append(node('span','','writing-rule'));replyWriting.append(row);});writing.append(replyWriting);
  const printActions=node('div','','activity-actions');printActions.append(button('打印练习纸',()=>{document.body.classList.add('print-writing');root.print();},'btn btn-yellow'));
  writing.append(printActions);surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route);
  document.fonts.ready.then(() => requestAnimationFrame(() => { route(); log.scrollTop = log.scrollHeight; }));
})(globalThis);
