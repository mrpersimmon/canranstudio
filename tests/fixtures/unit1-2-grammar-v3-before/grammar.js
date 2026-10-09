(function (root) {
  'use strict';
  const core = root.CanranCore;

  function mount({ element, content, objects, art, activity, onNext }) {
    const make = (tag, text = '', className = '') => {
      const item = document.createElement(tag); item.textContent = text; item.className = className; return item;
    };
    const button = (label, action, className = '') => {
      const item = make('button', label, className); item.type = 'button'; item.addEventListener('click', action); return item;
    };
    const names = { man: '男士', woman: '女士' };
    const measures = { handbag: '这个手提包', book: '这本书', pen: '这支钢笔' };
    const examples = ['handbag', 'book', 'pen'].map(en => objects.find(word => word.en === en));
    const previous = activity('unitPhraseGuide');
    const current = previous?.guideVersion === 3 ? previous : {};
    const state = {
      guideVersion: 3,
      step: Number.isInteger(current.step) && current.step >= 0 && current.step <= 2 ? current.step : 0,
      object: examples.some(word => word.en === previous?.object) ? previous.object : 'handbag',
      speaker: 'man',
      form: current.form === 'question' ? 'question' : 'statement',
      utterance: current.utterance === 'question' ? 'question' : 'statement',
      belongs: current.belongs !== false
    };
    const guide = make('div', '', 'grammar-guide');
    const tabs = make('div', '', 'guide-topics');
    tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', '句型示范');
    const topics = ['问一问', '变问句', '答一答'].map((label, index) => {
      const item = button(label, () => change({ step: index }), 'guide-topic');
      item.setAttribute('aria-controls', 'unit12-phrase-example'); tabs.append(item); return item;
    });
    const example = make('div', '', 'guide-example'); example.id = 'unit12-phrase-example';
    const heading = make('h4', '', 'guide-title');
    const scene = make('div', '', 'guide-scene');
    scene.setAttribute('role', 'region'); scene.setAttribute('aria-label', '示范对话');
    const figures = {};
    for (const who of ['man', 'woman']) {
      const figure = make('figure', '', 'guide-person guide-person-' + who);
      const label = make('figcaption', names[who]);
      const role = make('span', '', 'guide-person-role');
      figure.append(art(who), label, role); scene.append(figure); figures[who] = { figure, role };
    }
    const conversation = make('div', '', 'guide-conversation');
    const question = make('div', '', 'guide-bubble guide-question');
    const questionName = make('span', '', 'guide-bubble-name');
    const questionText = make('p'); questionText.lang = 'en';
    const subject = make('span', '', 'guide-word');
    const verb = make('span', '', 'guide-word guide-verb');
    const ownership = make('span', '', 'guide-word');
    const noun = make('span', '', 'guide-word guide-noun');
    const punctuation = document.createTextNode('');
    let motion = [];
    const reduceMotion = root.matchMedia('(prefers-reduced-motion: reduce)');
    question.append(questionName, questionText);
    const response = make('div', '', 'guide-bubble guide-response');
    const responseName = make('span', '', 'guide-bubble-name');
    const responseText = make('p'); responseText.lang = 'en';
    const responseStart = document.createTextNode(''), responseEnd = document.createTextNode('');
    responseText.append(responseStart, make('span', 'it', 'guide-focus'), responseEnd);
    response.append(responseName, responseText); conversation.append(question, response); scene.append(conversation);
    const objectSpot = make('div', '', 'guide-object');
    const pictures = examples.map(word => {
      const image = art(word.en, word.cn); objectSpot.append(image); return { word, image };
    });
    scene.append(objectSpot);
    const condition = make('p', '', 'guide-condition');
    const explanation = make('p', '', 'guide-explanation');
    const note = make('p', '', 'guide-note');
    const explanationRegion = make('div', '', 'guide-meaning');
    explanationRegion.setAttribute('aria-live', 'polite'); explanationRegion.setAttribute('aria-atomic', 'true');
    explanationRegion.append(condition, explanation, note);

    const controls = make('div', '', 'guide-controls');
    const objectChoices = make('div', '', 'guide-object-choices');
    objectChoices.setAttribute('role', 'group'); objectChoices.setAttribute('aria-label', '换个物品');
    const objectButtons = examples.map(word => {
      const item = button('', () => change({ object: word.en }), 'guide-object-choice');
      item.setAttribute('aria-label', word.en);
      const image = art(word.en), label = make('span', word.en); label.lang = 'en';
      item.append(image, label); objectChoices.append(item); return { word, item };
    });
    const modes = make('div', '', 'guide-toggle');
    modes.setAttribute('role', 'group'); modes.setAttribute('aria-label', '说话的目的');
    const modeButtons = [['statement', '陈述'], ['question', '询问']].map(([mode, label]) => {
      const item = button(label, () => change({ utterance: mode }), 'btn btn-yellow');
      modes.append(item); return { mode, item };
    });
    const ownershipChoices = make('div', '', 'guide-toggle');
    ownershipChoices.setAttribute('role', 'group'); ownershipChoices.setAttribute('aria-label', '假设物品归属');
    const ownershipButtons = [[true, '是她的'], [false, '不是她的']].map(([belongs, label]) => {
      const item = button(label, () => change({ belongs }), 'btn btn-yellow');
      ownershipChoices.append(item); return { belongs, item };
    });
    const transform = button('变成问句', () => change({ form: state.form === 'question' ? 'statement' : 'question' }), 'btn btn-yellow guide-transform');
    controls.append(modes, transform, ownershipChoices, objectChoices);
    example.append(heading, scene, explanationRegion, controls);
    const actions = make('div', '', 'guide-actions');
    actions.setAttribute('role', 'group'); actions.setAttribute('aria-label', '示范翻页');
    const back = button('上一页', () => change({ step: Math.max(0, state.step - 1) }), 'btn btn-yellow');
    const next = button('下一页', () => state.step < 2 ? change({ step: state.step + 1 }) : onNext(), 'btn btn-green');
    actions.append(back, next); guide.append(tabs, example, actions); element.append(guide);

    // Reference material remains available without becoming a scored activity.
    const phrases = make('details', '', 'offline-task guide-reference');
    phrases.append(make('summary', '礼貌用语'));
    const phraseList = make('dl', '', 'guide-expression-list');
    for (const phrase of content.PHRASES) {
      const en = make('dt', phrase.en); en.lang = 'en'; phraseList.append(en, make('dd', phrase.cn));
    }
    phrases.append(phraseList); element.append(phrases);
    const models = make('details', '', 'offline-task sentence-models guide-reference');
    models.append(make('summary', '换个物品问一问'));
    const modelGrid = make('div', '', 'phrase-grid');
    for (const model of content.SENTENCE_MODELS) {
      const card = make('article', '', 'phrase-card reference-card');
      const picture = make('img'); picture.src = model.image; picture.alt = '';
      const en = make('strong', model.en); en.lang = 'en';
      card.append(picture, en, make('span', model.cn)); modelGrid.append(card);
    }
    models.append(modelGrid); element.append(models);

    function change(patch) {
      motion.forEach(animation => animation.cancel()); motion = [];
      const moving = 'form' in patch && state.step === 1 && !reduceMotion.matches;
      const before = moving ? [subject, verb].map(node => node.getBoundingClientRect()) : [];
      Object.assign(state, patch); activity('unitPhraseGuide', { ...state }); render();
      // Only the two changing word positions move. Rapid clicks cancel the old
      // animation; display and saved state always represent the latest action.
      if (moving) motion = [subject, verb].map((node, index) => {
        const after = node.getBoundingClientRect();
        return node.animate([
          { transform: `translate(${before[index].x - after.x}px, ${before[index].y - after.y}px)` },
          { transform: 'translate(0, 0)' }
        ], { duration: 460, easing: 'ease-in-out' });
      });
    }
    function render() {
      const word = examples.find(item => item.en === state.object);
      const listener = state.speaker === 'man' ? 'woman' : 'man';
      guide.dataset.step = String(state.step); scene.dataset.speaker = state.speaker;
      topics.forEach((item, index) => item.setAttribute('aria-pressed', String(index === state.step)));
      heading.textContent = ['告诉别人，还是问一问？', '这句话，怎样变成问句？', '是自己的，还是不是？'][state.step];
      questionName.textContent = names[state.speaker]; responseName.textContent = names[listener];
      question.dataset.person = state.speaker; response.dataset.person = listener;
      const asking = state.step === 2 || (state.step === 0 ? state.utterance : state.form) === 'question';
      subject.textContent = asking ? 'this' : 'This'; verb.textContent = asking ? 'Is' : 'is';
      ownership.textContent = 'your'; noun.textContent = word.en;
      verb.classList.toggle('guide-focus', state.step === 1);
      ownership.classList.toggle('guide-focus', state.step === 0);
      punctuation.textContent = asking ? '?' : '.';
      questionText.replaceChildren(...(asking ? [verb, ' ', subject] : [subject, ' ', verb]), ' ', ownership, ' ', noun, punctuation);
      response.hidden = state.step !== 2;
      responseStart.textContent = state.belongs ? 'Yes, ' : 'No, ';
      responseEnd.textContent = state.belongs ? ' is.' : " isn't.";
      pictures.forEach(({ word: item, image }) => { image.hidden = item.en !== state.object; });
      for (const [who, { figure, role }] of Object.entries(figures)) {
        figure.classList.toggle('is-addressed', who === listener && state.step === 2);
        role.textContent = who === state.speaker ? (asking ? '提问' : '陈述') : (state.step === 2 ? '回答' : '听话人');
      }
      condition.textContent = state.step === 0
        ? `这是你的${word.cn}${asking ? '吗？' : '。'}`
        : state.step === 1 ? `原句：This is your ${word.en}.`
        : `假设${measures[word.en]}${state.belongs ? '是' : '不是'}女士的`;
      explanation.textContent = state.step === 0
        ? asking ? '一般疑问句：可以用 Yes 或 No 回答。' : '陈述句：告诉别人一件事。'
        : state.step === 1 ? '把 is 放到 this 前面，句末用 ?。'
        : `it 指刚问到的${word.cn}；isn't 就是 is not。`;
      note.textContent = state.step === 0 ? 'your 表示“你的”，男士正在对女士说话。' : '';
      transform.hidden = state.step !== 1;
      transform.textContent = state.form === 'question' ? '变回陈述句' : '变成问句';
      modes.hidden = state.step !== 0; ownershipChoices.hidden = state.step !== 2;
      objectButtons.forEach(({ word: item, item: control }) => control.setAttribute('aria-pressed', String(item.en === state.object)));
      modeButtons.forEach(({ mode, item }) => item.setAttribute('aria-pressed', String(mode === state.utterance)));
      ownershipButtons.forEach(({ belongs, item }) => item.setAttribute('aria-pressed', String(belongs === state.belongs)));
      back.disabled = state.step === 0;
      next.classList.toggle('guide-next-final', state.step === 2);
      next.setAttribute('aria-label', state.step === 2 ? '下一站：帮忙还手提包' : '下一页');
      if (state.step === 2) next.replaceChildren(make('span', '下一站：'), make('span', '帮忙还手提包', 'guide-destination'));
      else next.textContent = '下一页';
    }
    render();
  }
  core.unit12Grammar = { mount };
})(window);
