(function (root) {
  'use strict';
  const core = root.CanranCore;
  const node = (tag, text = '', className = '') => {
    const item = document.createElement(tag); item.textContent = text; item.className = className; return item;
  };
  // Only presentation lives here. Selection, retry, hint use, migration and
  // first-submission results remain owned by the shared practice runner.
  function create({ element, art }) {
    let heading, rule, questionStart;
    return {
      present(question, progress) {
        element.classList.remove('role-runner'); element.classList.add('grammar-runner');
        const q = question.workshop; questionStart = progress;
        const content = element.querySelector('.practice-content');
        const intro = node('div', '', 'grammar-intro');
        heading = node('h3', question.prompt); heading.tabIndex = -1;
        intro.append(progress, heading); content.prepend(intro);
        if (q.speakers) {
          const cast = node('div', '', 'grammar-cast'); cast.setAttribute('aria-label', '说话的人');
          for (const [who, label] of [['woman', '女士：I（我）'], ['man', '男士问她：you（你）']]) {
            const person = node('figure'); person.append(art(who), node('figcaption', who === 'woman' ? '女士' : '男士')); cast.append(person);
          }
          intro.append(cast);
        }
        if (q.model) {
          const demo = node('aside', '', 'grammar-model'); demo.setAttribute('role', 'region'); demo.setAttribute('aria-label', '短示范');
          const lines = q.speakers ? [['I · you', 'I 指说话人；you 指听话人。']] : q.model.lines;
          for (const [en, cn] of lines) {
            const row = node('div', '', 'grammar-model-line');
            const english = node('p', en); english.lang = 'en'; row.append(english, node('small', cn)); demo.append(row);
          }
          // Demonstration precedes the task, with a different example where
          // possible. Independent transfer questions never include this panel.
          intro.insertBefore(demo, heading);
        }
        rule = node('p', q.rule || '', 'grammar-rule'); rule.hidden = true;
        element.querySelector('.practice-answer-note').append(rule);
      },
      answer(value) { if (rule) rule.hidden = value === null || !rule.textContent; },
      finish() {},
      // A model can sit above the task title. Reveal the whole question from
      // its progress line, so the sticky navigation cannot hide that model.
      heading() { return questionStart?.isConnected ? questionStart : element.querySelector('.practice-finish > p'); }
    };
  }
  function references({ element, content }) {
    const phrases = node('details', '', 'offline-task grammar-reference'); phrases.append(node('summary', '礼貌用语'));
    const list = node('dl', '', 'grammar-expression-list');
    for (const item of content.PHRASES) { const en = node('dt', item.en); en.lang = 'en'; list.append(en, node('dd', item.cn)); }
    phrases.append(list); element.append(phrases);
    const models = node('details', '', 'offline-task grammar-reference'); models.append(node('summary', '换个物品问一问'));
    const grid = node('div', '', 'phrase-grid');
    for (const item of content.SENTENCE_MODELS) {
      const card = node('article', '', 'phrase-card reference-card'), picture = node('img'); picture.src = item.image; picture.alt = '';
      const en = node('strong', item.en); en.lang = 'en'; card.append(picture, en, node('span', item.cn)); grid.append(card);
    }
    models.append(grid); element.append(models);
  }
  core.unit12Grammar = { create, references };
})(globalThis);
