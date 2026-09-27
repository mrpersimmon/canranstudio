(function (root) {
  'use strict';
  const core = root.CanranCore, unit = core.unit1314;
  const { stages, questions, learning: content } = unit;
  const practice = core.lesson49Practice, scene = core.unit1314Scene;
  history.scrollRestoration = 'manual';
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
    roles: ['先看完故事，再来找答案。需要回顾时可以回到新衣小剧场。'],
    words: ['点整张词卡看意思，再点收起。用上一组和下一组翻页。'],
    listen: ['看英文选词义，或根据图片、词义选英文。选好后点“检查答案”。'],
    phrases: ['看看不同表达怎样使用，再到下一站练一练。'],
    colours: ['先分清问颜色还是问主人，再看看一句话说了几种颜色。'],
    models: ['看物品和颜色；展开完整问答与合句示范。'],
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
    const element = node('div'); element.id = 'unit1314-' + id + '-practice'; surfaces.get(id).append(element);
    const predecessors = unit.activityPredecessors?.[id];
    practice.mount({ element, questions: questions[id], sessionId: predecessors ? 'v2' : 'v' + unit.version,
      previousGroups: predecessors?.map(old => ({ key: 'unit1314-' + old + '-practice/v1', questions: unit.previousQuestions[old] })), ...settings,
      onComplete: states => { complete(id); const summary=element.querySelector('.practice-finish > p'); if(summary) summary.textContent=id==='exam'?'挑战完成！':'这一站完成了！'; nextStation(id, element.querySelector('.practice-finish-actions')); settings.onComplete?.(states); } });
    return element;
  }

  function mountDressTask(id) { const view=scene.taskView(); surfaces.get(id).append(view.element); mountPractice(id,{sceneView:view,completionDetails:scene.result(id)}); }
  const story = surfaces.get('text'), stage = node('div', '', 'dialogue-stage'), cast=scene.cast();
  const log = node('div', '', 'dialogue-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-label', '课文对话'); log.setAttribute('aria-live', 'off'); log.tabIndex = 0;
  stage.append(log, cast.element);
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
  function unlockStory() { if (!passed('text') || storyStarted) return; storyStarted = true; gate.remove(); mountDressTask('roles'); }
  function saveDialogue() { practice.activity('unitDialogue', { ...dialogue, signature: signatures.text }); }
  function refreshDialogue() {
    advance.textContent = dialogue.i < 0 ? '开始看课文' : dialogue.i === content.DIALOGUE.length - 1 ? '完成课文' : '下一句';
    controls.hidden = dialogue.done; finish.hidden = !dialogue.done;
    status.textContent = dialogue.i < 0 ? '' : `${dialogue.i + 1} / ${content.DIALOGUE.length} 句`;
    log.querySelectorAll('.bubble-row').forEach((row, index) => row.classList.toggle('is-current', index === dialogue.i));
    cast.showLine(dialogue.i);
    stage.dataset.floor = dialogue.i < 3 ? 'stairs' : 'room';
  }
  function lead() { const lead = node('div', '', 'story-lead'); lead.append(art('colour'), node('p', 'Anna 的帽子是什么颜色？')); log.replaceChildren(lead); }
  function appendLine(index) {
    const line = content.DIALOGUE[index], row = node('div', '', 'bubble-row ' + line.who), bubble = node('div', '', 'bubble');
    const speech = node('p', '', 'btext'); speech.append(node('span', line.text)); speech.lang = 'en';
    const translation = node('p', line.cn, 'bcn'); translation.hidden = true;
    const translate = button('看中文', () => { translation.hidden = !translation.hidden; translate.textContent = translation.hidden ? '看中文' : '收起中文'; translate.setAttribute('aria-expanded', String(!translation.hidden));
      if (!translation.hidden && row.offsetTop + row.offsetHeight > log.scrollTop + log.clientHeight) log.scrollTop = row.offsetTop + row.offsetHeight - log.clientHeight + 12; }, 'btn btn-mini btn-yellow'); translate.setAttribute('aria-expanded', 'false');
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
  const phraseGrid=node('div','','phrase-grid');content.PHRASES.forEach(item=>phraseGrid.append(expressionCard(item)));
  const phraseActions=node('div','','activity-actions');nextStation('phrases',phraseActions);
  const contractions=node('details','','offline-task');contractions.append(node('summary','缩写里藏着什么？'),
    node('p',"What colour's = What colour is。"),node('p',"Steven's umbrella's black. → Steven's umbrella is black."),
    node('p',"这句中，Steven's 表示“Steven 的”；umbrella's 表示 umbrella is。要放回句子里分清。"));
  surfaces.get('phrases').append(phraseGrid,contractions,phraseActions);
  function referencePager(items, className, label, nouns, key) {
    const group=node('div','',className),card=expressionCard(items[0]);group.setAttribute('role','group');group.setAttribute('aria-label',label);group.append(card);
    const controls=node('div','','album-controls'),count=node('span');count.setAttribute('aria-live','polite');
    const savedIndex=practice.activity(key);let index=Number.isInteger(savedIndex)?Math.max(0,Math.min(items.length-1,savedIndex)):0;
    const previous=button('上一'+nouns,()=>{index--;render();},'btn btn-yellow'),next=button('下一'+nouns,()=>{index++;render();});controls.append(previous,count,next);
    function render(){const item=items[index];card.querySelector('img').src=item.image;card.querySelector('strong').textContent=item.en;card.querySelector('span').textContent=item.cn;previous.disabled=index===0;next.disabled=index===items.length-1;count.textContent=(index+1)+' / '+items.length;practice.activity(key,index);}
    render();return{group,controls};
  }
  const gallery=referencePager(content.GALLERY,'colour-gallery','当前配色图','幅配色图','unitGalleryPage');
  const modelExample=node('div','','model-example');modelExample.append(expressionCard(content.MODEL_EXAMPLE));
  const models=node('details','','offline-task');models.append(node('summary','看看完整问答'));
  const modelPages=referencePager(content.MODELS,'reply-models','当前配色问答','份问答','unitModelPage');models.append(modelPages.group,modelPages.controls);
  const reference=node('details','','offline-task');reference.append(node('summary','两句合一句'),
    node('p',"This is Stella. This is her handbag. → This is Stella's handbag."));
  const mergeGrid=node('div','','phrase-grid merge-models');content.REFERENCE.forEach(item=>{
    const card=expressionCard(item);card.insertBefore(card.lastElementChild,card.querySelector('strong'));mergeGrid.append(card);
  });reference.append(mergeGrid);
  const modelActions=node('div','','activity-actions');nextStation('models',modelActions);
  surfaces.get('models').append(gallery.group,gallery.controls,modelExample,models,reference,modelActions);
  for (const id of ['colours','trans']) mountDressTask(id);
  const examResults = node('div', '', 'unit-results'), examScene=scene.taskView(); surfaces.get('exam').append(examScene.element);
  mountPractice('exam', { sceneView:examScene, chunkSize: questions.exam.length, finalLabel: '查看本次记录', completionDetails: examResults, onComplete: states => {
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
      copy: { title: '细心的配色小达人', course: '新衣配色屋 · Lesson 13–14', completion: '完成 Lesson 13–14 课堂配套练习', thanks: '把颜色看清楚，把新发现说清楚！' },
      characters: ['louise', 'anna'], characterLabels: ['Louise', 'Anna'], icon: art, defaultName: '细心的配色小达人', dialogTitle: '新衣配色屋纪念', fileName: 'Lesson13-14-新衣配色屋.png',
      badges: stages.map((stage, index) => ({ title: stage.title, icon: { l1: 'cards', l2: 'book', l3: 'question', l4: 'order', l5: 'star' }[stage.id], color: ['#FFF0BC', '#FBE2CD', '#E1EDD5', '#DFEAF1', '#F8DCD4'][index] }))
    }
  });

  const writing=node('details','','offline-task');writing.id='unitWriting';
  writing.append(node('summary','和朋友再试试'),node('p','课堂上跟老师读词语和课文，再听老师说颜色、找图卡。用虚构人物和物品卡两人问答：先问颜色，再介绍一件有两种颜色的物品。交换角色，试着说 same colour；不用介绍自己的衣物。'));
  writing.append(node('h4','Lesson 13–14 · 纸笔小练习'),node('p',"A．把两句合成一句。例：This is Stella. This is her handbag. → This is Stella's handbag."));
  const referenceWriting=node('ol','','reference-writing');content.REFERENCE.forEach(item=>{const row=node('li');row.append(node('span',item.cn),node('span','','writing-rule'));referenceWriting.append(row);});writing.append(referenceWriting);
  writing.append(node('p','B．问颜色，再用 His／Her 回答。人物按 he／she 物主卡判断。'),node('p',"例：Steven / umbrella / black · he → What colour's Steven's umbrella? His umbrella's black."));
  const replyWriting=node('ol','','reply-writing');content.MODELS.forEach(item=>{const row=node('li');row.append(node('span',item.owner+' / '+item.object+' / '+item.colour+' · '+(item.possessive==='his'?'he':'she')),node('span','','writing-rule'),node('span','','writing-rule'));replyWriting.append(row);});writing.append(replyWriting);
  const printActions=node('div','','activity-actions');printActions.append(button('打印练习纸',()=>{document.body.classList.add('print-writing');root.print();},'btn btn-yellow'));
  writing.append(printActions);surfaces.get('certificate').append(writing);
  root.addEventListener('afterprint',()=>document.body.classList.remove('print-writing'));
  updateProgress(); practice.initializeNotebook();
  root.addEventListener('hashchange', route);
  const restoreView = () => requestAnimationFrame(() => { route(); log.scrollTop = log.scrollHeight; });
  // Cached entry hides the lesson while images decode; hidden logs have no scroll range.
  document.fonts.ready.then(() => {
    const preparing = () => document.documentElement.hasAttribute('data-course-preparing');
    if (!preparing()) { restoreView(); return; }
    const ready = new MutationObserver(() => {
      if (preparing()) return;
      ready.disconnect(); restoreView();
    });
    ready.observe(document.documentElement, { attributes: true, attributeFilter: ['data-course-preparing'] });
  });
})(globalThis);
