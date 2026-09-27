(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit2930;
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
    text: ['点“开始看课文”，用“下一句”展开原文。旧句可以向上查看，中文按句打开。'],
    roles: ['先看完课文，再来找答案。需要回顾时可以回到房间小剧场。'],
    words: ['点整张词卡看意思，再点收起。用上一组和下一组翻页。'],
    listen: ['看英文选词义，或根据图片、词义选英文。选好后点“检查答案”。'],
    phrases: ['看看不同表达怎样使用，再到下一站练一练。'],
    observe: ['看看怎样询问任务、发出指令。'],
    be: ['读清楚英文要求，再选择图片或合适的表达。'],
    models: ['选一组动作，跟老师读一读，用图片卡和朋友轮流给任务。'],
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
    const element = node('div'); element.id = 'unit2930-' + id + '-practice'; surfaces.get(id).append(element);
    practice.mount({ element, questions: questions[id], sessionId: 'v' + unit.version, ...settings,
      onComplete: states => { complete(id); nextStation(id, element.querySelector('.practice-finish-actions')); settings.onComplete?.(states); } });
    return element;
  }

  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage');
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文原文'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  function actor(person) { const element=node('div','','dialogue-actor'); element.dataset.actor=person; element.append(art(person),node('span',content.PEOPLE[person].name)); return element; }
  stage.append(actor('Jones'), log, actor('Amy'));
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始看课文', advanceDialogue);
  tools.append(button('从头看', resetDialogue, 'btn btn-yellow')); controls.append(advance, tools);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再看一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(node('p', '课文看完了！'), finishActions); story.append(stage, status, controls, finish);
  const gate = node('div', '', 'activity-actions'); gate.append(button('先看课文', () => navigate('learn/text'))); surfaces.get('roles').append(gate);
  let storyStarted = false, dialogue = { i: -1, viewed: [], done: false };
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountPractice('roles'); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function refreshDialogue() {
    advance.textContent = dialogue.i < 0 ? '开始看课文' : dialogue.i === content.DIALOGUE.length - 1 ? '完成课文' : '下一句';
    controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
    status.textContent = dialogue.i < 0 ? '' : `${dialogue.i + 1} / ${content.DIALOGUE.length} 句原文`;
    log.querySelectorAll('.bubble-row').forEach((row, index) => row.classList.toggle('is-current', index === dialogue.i));
    const speaker = content.DIALOGUE[dialogue.i]?.person;
    stage.querySelectorAll('.dialogue-actor').forEach(person => person.classList.toggle('is-current', speaker === person.dataset.actor));
  }
  function lead() { const lead = node('div', '', 'story-lead'); lead.append(icon('book'), node('p', '艾米要怎样清理地板？')); log.replaceChildren(lead); }
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
      pronunciation.id = 'u2930-' + word.en.replaceAll(' ', '-') + '-phonetic';
      meaning.id = 'u2930-' + word.en.replaceAll(' ', '-') + '-meaning';
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
  const usage=node('details','','offline-task');usage.append(node('summary','指令怎样开头？'),
    node('p','本课指令通常省略主语 you，从动词原形开始，例如 Shut the door, please.。指令可以表达请求、邀请等，不只是命令。please 可以让请求更礼貌。'),
    node('p','What must I do? 询问自己应该做的任务。本课 must 表示必须、应该；后面的动作使用原形。不要把它理解成想做什么，也不把本课含义套到所有语境。'),
    node('p','This bedroom’s very untidy. = This bedroom is very untidy. 这里的 ’s 是 is 的缩写；前面学过的 Mrs. Smith’s 表示史密斯太太的。要看上下文。'));
  const context=node('details','','offline-task');context.append(node('summary','这些词在这里是什么意思？'),
    node('p','air the room 是给房间通风；dust the dressing table 是掸掉灰尘；empty the cup 是把杯子倒空。相同词在别处可能有其他词性或含义。'),
    node('p','make the bed 是整理床铺，不是造床。untidy 是不整齐，不等同于 dirty，也不是给人物贴“懒惰”的标签。clothes 是复数形式，不写 a clothes。'),
    node('p','Read this book. 中的 read 使用原形，读 /riːd/；不要套用过去式的读音。词卡采用美式音标，短语按本课义项标注；课堂读整句时由老师示范自然重音。'));
  surfaces.get('phrases').append(phraseGrid,usage,context,phraseActions);
  const pairGrid=node('div','','phrase-grid');[
    ['Open the book. / Shut the book.','打开或合上书。','book'],
    ['Turn on the lamp. / Turn off the lamp.','开灯或关灯。','turn on'],
    ['Put on your shirt. / Take off your shirt.','穿上或脱下衬衫。','put on'],
    ['Put the clothes in the wardrobe.','把衣服放进衣柜。','put']
  ].forEach(([en,cn,picture])=>pairGrid.append(expressionCard({en,cn,image:'/assets/unit29-30/'+picture.replaceAll(' ','-')+'.svg'})));
  const galleryDetails=node('details','','offline-task visual-gallery');galleryDetails.append(node('summary','看看35个动作搭配'));
  content.GALLERY.forEach(group=>{const section=node('section','','action-family');section.append(node('h4',group.title));const grid=node('div','','phrase-grid comparison-gallery');group.items.forEach(item=>{const card=expressionCard(item);card.prepend(node('small','图 '+item.number));grid.append(card);});section.append(grid);galleryDetails.append(section);});
  galleryDetails.append(node('p','Open your desk. 这里指打开带活动桌盖的课桌。Sweep the kitchen / living room / bedroom. 指扫相应房间的地面。'),node('p','穿戴、开关的两句是两种相反操作，可轮流练；不是要同时做。炉灶和刀具只用图片卡练表达，真实操作由成人处理。'));
  const reference=node('details','','offline-task');reference.append(node('summary','把问题变成行动'),node('p','例：The cup isn’t empty. → Empty it! 这里 it 指杯子；前句 empty 说状态，后句 Empty 发出动作指令。'));
  const referenceList=node('ol','','be-models');content.REFERENCE.forEach(item=>referenceList.append(node('li',item.prompt+' → '+item.en)));reference.append(referenceList);
  const models=node('details','','offline-task');models.append(node('summary','自由搭配任务卡'),node('p','分别从动作库和物品库选合适的内容，不按同一行配对。句子要意思合理，this 搭配单数，these 搭配复数。'));
  const bank=node('div','','writing-bank');bank.append(node('p','动作库：'+content.WRITING_VERBS.join(' · ')),node('p','物品库：'+content.WRITING_NOUNS.join(' · ')));models.append(bank);
  const examples=node('details','','offline-task');examples.append(node('summary','看看一种搭配'),node('p','例：Shut the door! 下面是另外十一句示例，并非只有这些答案。'));
  const list=node('ol','','be-models');content.MODELS.forEach(en=>list.append(node('li',en)));examples.append(list);models.append(examples);
  const modelActions=node('div','','activity-actions');nextStation('models',modelActions);
  surfaces.get('models').append(pairGrid,galleryDetails,reference,models,modelActions);
  for (const id of ['observe','be','trans']) mountPractice(id);
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
      copy: { title: '能干的整理小帮手', course: '房间整理行动 · Lesson 29–30', completion: '完成 Lesson 29–30 课堂配套练习', thanks: '读懂任务，理清先后，一起完成整理行动！' },
      characters: ['Jones', 'Amy'], characterLabels: ['琼斯太太', '艾米'], icon: art, defaultName: '能干的整理小帮手', dialogTitle: '房间整理行动纪念', fileName: 'Lesson29-30-房间整理行动.png',
      badges: stages.map((stage, index) => ({ title: stage.title, icon: { l1: 'cards', l2: 'book', l3: 'question', l4: 'order', l5: 'star' }[stage.id], color: ['#FFF0BC', '#F1E5CF', '#E1EDD5', '#DFEAF1', '#F8DCD4'][index] }))
    }
  });

  const writing=node('details','','offline-task');writing.id='unitWriting';
  writing.append(node('summary','和朋友再试试'),node('p','跟老师读课文，听指令、做安全的模拟动作。两人轮流问 What must I do?，用图片卡给任务。发音、听辨和真实交流由老师安排；炉灶和刀具只用图片卡。'));
  writing.append(node('h4','Lesson 29–30 · 纸笔小练习'),node('p','A．仿照例子，把问题变成动作指令。'),node('p','例：The cup isn’t empty. → Empty it!'));
  const referenceWriting=node('ol','','reference-writing');content.REFERENCE.forEach(item=>{const row=node('li');row.append(node('span',item.prompt),node('span','','writing-rule'));referenceWriting.append(row);});writing.append(referenceWriting);
  writing.append(node('p','B．从两个词库中自由搭配，仿照例子写十一句指令。不是按同一行配对，合理的搭配可以不同。'),node('p','例：Shut the door!'));
  const writingBank=node('div','','writing-bank');writingBank.append(node('p','动作库：'+content.WRITING_VERBS.join(' · ')),node('p','物品库：'+content.WRITING_NOUNS.join(' · ')));writing.append(writingBank);
  const response=node('ol','','writing-response');for(let i=0;i<11;i++){const row=node('li');row.append(node('span','','writing-rule'));response.append(row);}writing.append(response);
  const printActions=node('div','','activity-actions');printActions.append(button('打印练习纸',()=>{document.body.classList.add('print-writing');root.print();},'btn btn-yellow'));
  writing.append(printActions);surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route);
  document.fonts.ready.then(() => requestAnimationFrame(() => { route(); log.scrollTop = log.scrollHeight; }));
})(globalThis);
