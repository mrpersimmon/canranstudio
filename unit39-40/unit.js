(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit3940;
  const { stages, questions, learning: content } = unit;
  const practice = core.lesson49Practice, scene = core.unit3940Scene;
  const $ = selector => document.querySelector(selector);
  const icon = core.lesson49Icons.create;
  const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag); element.textContent = text; element.className = className; return element;
  };
  function button(text, action, className = 'btn btn-green') {
    const element = node('button', text, className); element.type = 'button'; element.addEventListener('click', action); return element;
  }
  function art(name, label = '') {
    if(name==='keepsake')return scene.art();
    const word = unit.objects.find(word => word.en === name);
    const path = name==='sam-certificate' ? '/assets/unit39-40/sam-certificate.svg' : content.PEOPLE[name]?.image || word?.image;
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
      header.append(icon(illustration), node('h3', title));
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
    const element = node('div'); element.id = 'unit3940-' + id + '-practice'; surfaces.get(id).append(element);
    const predecessors=unit.activityPredecessors?.[id];
    practice.mount({ element, questions: questions[id], sessionId: unit.taskSessions?.[id] || (predecessors ? 'v2' : 'v' + unit.version),
      inputViews:core.lesson49TaskInputs,
      previousGroups: unit.taskPredecessors?.[id] || predecessors?.map(old=>({key:'unit3940-'+old+'-practice/v1',questions:unit.previousQuestions[old]})),
      completionDetails:id==='listen'?null:scene.result(id), ...settings,
      onComplete: states => { complete(id); const label=element.querySelector('.practice-finish>p');if(label)label.textContent=id==='exam'?'挑战完成！':'这一站完成了！'; nextStation(id, element.querySelector('.practice-finish-actions')); settings.onComplete?.(states); } });
    return element;
  }

  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage');
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文原文'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  const storyScene=scene.mount(stage,log);
  const status = node('p', '', 'dialogue-status'); status.setAttribute('role', 'status');
  const controls = node('div', '', 'stage-ctrl'), tools = node('div', '', 'stage-tools');
  const advance = button('开始看课文', advanceDialogue);
  tools.append(button('从头看', resetDialogue, 'btn btn-yellow')); controls.append(tools, advance);
  const finish = node('div', '', 'practice-finish'), finishActions = node('div', '', 'practice-finish-actions');
  finishActions.setAttribute('role', 'group'); finishActions.setAttribute('aria-label', '完成后的操作');
  finishActions.append(button('再看一遍', resetDialogue, 'btn btn-yellow')); nextStation('text', finishActions);
  finish.append(scene.result('text'),node('p', '课文看完了！'), finishActions); story.append(stage, status, controls, finish);
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
    storyScene.showLine(dialogue.i);
  }
  function lead() { const lead = node('div', '', 'story-lead'); lead.append(icon('book'), node('p', '这只花瓶最后会放在哪里？')); log.replaceChildren(lead); }
  function appendLine(index) {
    const line = content.DIALOGUE[index], row = node('div', '', 'bubble-row ' + line.who), bubble = node('div', '', 'bubble');
    const speech = node('p', '', 'btext'); speech.append(node('span', line.text)); speech.lang = 'en';
    const translation = node('p', line.cn, 'bcn'); translation.hidden = true;
    const translate = button('看中文', () => { translation.hidden = !translation.hidden; translate.textContent = translation.hidden ? '看中文' : '收起中文'; translate.setAttribute('aria-expanded', String(!translation.hidden)); if(!translation.hidden)requestAnimationFrame(()=>{log.scrollTop=Math.max(0,row.offsetTop+row.offsetHeight-log.clientHeight);}); }, 'btn btn-mini btn-yellow'); translate.setAttribute('aria-expanded', 'false');
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
      const pronunciation = node('small', word.ph, 'word-phonetic'); pronunciation.lang = 'en-GB';
      const meaning = node('span', word.cn, 'word-meaning'); meaning.hidden = true;
      pronunciation.id = 'u3940-' + word.en.replaceAll(' ', '-') + '-phonetic';
      meaning.id = 'u3940-' + word.en.replaceAll(' ', '-') + '-meaning';
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
  const usage=node('details','','offline-task');usage.append(node('summary','先说东西，再说给谁'),
    node('p','Give me that vase. → Give that vase to me.'),
    node('p','给……、给……看、寄送、带给：give / show / send / take 后都可以先说物品，再用 to 说接收者。物品用 it / them 时，本课使用 Give it to me. 这样的词序。'));
  const spelling=node('details','','offline-task');spelling.append(node('summary','it / them 应该放在哪里？'),
    node('p','Put on your coat. → Put it on.　Take off your shoes. → Take them off.'),
    node('p','Turn on the light. → Turn it on.　Turn off the lights. → Turn them off.'),
    node('p','一件物品用 it，多件用 them。在本课这些短语里，代词放在动词和 on / off 中间；不能说 Put on it.。Don’t 后面用动词原形：Don’t drop it!'));
  const phraseActions=node('div','','activity-actions');nextStation('phrases',phraseActions);
  surfaces.get('phrases').append(phraseGrid,usage,spelling,phraseActions);
  const gallery=node('div','','action-pages');surfaces.get('models').append(gallery);
  core.classroomScene.paginate(gallery,{items:content.GALLERY,size:2,key:'unitActionPage',label:'画册',render(item){
    const card=expressionCard(item);card.prepend(node('small',item.number+' · '+item.numberWord,'number-label'));
    const prompt=node('p',item.prompt,'printed-prompt');prompt.lang='en';card.insertBefore(prompt,card.querySelector('strong'));
    card.querySelector('strong').prepend(node('small','例：','example-label'));return card;
  }});
  const note=node('details','','offline-task');note.append(node('summary','和老师一起试试'),
    node('p','先看画面 13–16，用 put / take / turn 和 on / off 说动作。画面 17–60 用 What are you going to do with that/those …? 提问，再用 I’m going to give/show/send/take … 回答。'),
    node('p','同一件东西可以有不同打算。画册给出一种说法，和老师也可以说其他合理的打算。my 指说话人自己的关系，不是看图片猜亲属。'),
    node('p','网页用于看图与阅读。发音、听辨和真实问答由老师带着练；不用真实易碎花瓶演示。'));
  const modelActions=node('div','','activity-actions');nextStation('models',modelActions);surfaces.get('models').append(note,modelActions);
  for (const id of ['observe','be','trans']) mountPractice(id);
  const examResults = node('div', '', 'unit-results');
  mountPractice('exam', { chunkSize: questions.exam.length, finalLabel: '查看本次记录', completionDetails: examResults, onComplete: states => {
    const independent = states.filter(state => state.firstCorrect && !state.hintUsed && !state.ruleUsed && !state.revealed).length;
    const assisted = states.filter(state => state.firstCorrect && (state.hintUsed || state.ruleUsed || state.revealed)).length;
    const corrected = states.filter(state => !state.firstCorrect).length;
    examResults.replaceChildren(scene.result('exam'),node('p', `首次独立答对 ${independent} / ${questions.exam.length}`), node('p', `提示后完成 ${assisted} 题 · 修正后完成 ${corrected} 题`));
    const targets = questions.exam.filter((_, index) => !states[index].firstCorrect || states[index].hintUsed || states[index].ruleUsed || states[index].revealed).map(q => q.target);
    if (targets.length) { const details = node('details'), list = node('ul'); details.append(node('summary', '下次再练')); targets.forEach(target => list.append(node('li', target))); details.append(list); examResults.append(details); }
  } });
  certificateView = core.unitCertificate.mount({
    element: surfaces.get('certificate'), initialName: practice.activity('unitName'), initialIssuedAt: practice.activity('unitClassroomCertificateIssuedAt'), canClaim: fullyComplete,
    onClaim: ({ name, issuedAt }) => { practice.activity('unitName', name); practice.activity('unitClassroomCertificateIssuedAt', issuedAt); },
    design: {
      copy: { title: '细心的花瓶小帮手', course: '花瓶安放小帮手 · Lesson 39–40', completion: '完成 Lesson 39–40 课堂配套练习', thanks: '把位置看仔细，把叮嘱读明白！' },
      characters: ['sam-certificate', 'penny'], characterLabels: ['Sam', 'Penny'], icon: art, defaultName: '细心的花瓶小帮手', dialogTitle: '花瓶纪念', fileName: 'Lesson39-40-花瓶安放小帮手.png',
      badges: stages.map((stage, index) => ({ title: stage.title, icon: { l1: 'cards', l2: 'book', l3: 'question', l4: 'order', l5: 'star' }[stage.id], color: ['#FFF0BC', '#F1E5CF', '#E1EDD5', '#DFEAF1', '#F8DCD4'][index] }))
    }
  });

  const writing=node('details','','offline-task');writing.id='unitWriting';
  writing.append(node('summary','和朋友再试试'),node('p','跟老师读课文，用纸道具练提醒与交接。口头问答和书写由老师安排，不记作网页已测能力。'));
  writing.append(node('h4','Lesson 39–40 · 纸笔小练习'),node('p','A．换一种说法，意思不变。'),node('p','例：Give me that vase. → Give that vase to me.'));
  const aList=node('ol','','reference-writing');content.WRITING_A.forEach(sentence=>{const row=node('li');row.append(node('span',sentence),node('span','','writing-rule'));aList.append(row);});writing.append(aList);
  const writingB=node('section','','writing-b');writingB.append(node('h4','B．把要求改成自己的打算'),node('p','例：Put on your coat! → I’m going to put it on.'),node('p','Put on your shoes! → I’m going to put them on.'));
  const bList=node('ol','','reply-writing');content.WRITING_B.forEach(phrase=>{const row=node('li');row.append(node('span',phrase),node('span','','writing-rule'));bList.append(row);});writingB.append(bList);writing.append(writingB);
  const printActions=node('div','','activity-actions');printActions.append(button('打印练习纸',()=>{document.body.classList.add('print-writing');root.print();},'btn btn-yellow'));writing.append(printActions);surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
  updateProgress(); practice.initializeNotebook();
  // The student or preview strip changes the fixed navigation height after loading.
  const topbar = $('#topbar');
  const fitNavigation = () => {
    const height = Math.ceil(topbar.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--unit3940-nav-height', height + 'px');
    document.documentElement.style.scrollPaddingTop = (height + 16) + 'px';
  };
  fitNavigation(); new ResizeObserver(fitNavigation).observe(topbar);
  root.addEventListener('hashchange', route);
  document.fonts.ready.then(() => {
    const restore=()=>requestAnimationFrame(()=>{route();log.scrollTop=log.scrollHeight;});
    if(!document.documentElement.hasAttribute('data-course-preparing'))return restore();
    const ready=new MutationObserver(()=>{if(!document.documentElement.hasAttribute('data-course-preparing')){ready.disconnect();restore();}});
    ready.observe(document.documentElement,{attributes:true,attributeFilter:['data-course-preparing']});
  });
})(globalThis);
