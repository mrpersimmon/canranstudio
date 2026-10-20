(function (root) {
  'use strict';
  const core = root.CanranCore;
  const node = (tag, text = '', className = '') => {
    const el = document.createElement(tag); el.textContent = text; el.className = className; return el;
  };
  const facts = {
    robert: [['Name', 'Robert', 1], ['Nationality', 'Italian', 9], ['Job', 'engineer', 15]],
    sophie: [['Name', 'Sophie', 3], ['Nationality', 'French', 5], ['Job', 'keyboard operator', 13]]
  };
  function records({ portraits = false, label = '采访档案' } = {}) {
    const element = node('div', '', 'interview-records'); element.setAttribute('role', 'group'); element.setAttribute('aria-label', label);
    const fields = [];
    for (const [person, rows] of Object.entries(facts)) {
      const card = node('article', '', 'interview-record record-' + person); card.dataset.person = person;
      card.setAttribute('aria-label', core.unit78.learning.PEOPLE[person].name + ' 的采访档案');
      if (portraits) { const portrait = node('img', '', 'record-portrait'); portrait.src = core.unit78.learning.PEOPLE[person].image; portrait.alt = ''; card.append(portrait); }
      const list = node('dl');
      rows.forEach(([key, value, line]) => {
        const row = node('div'), output = node('dd', '—'); output.lang = 'en';
        row.append(node('dt', { Name: '名字', Nationality: '国籍', Job: '职业' }[key]), output); list.append(row);
        fields.push({ person, key, value, line, output });
      });
      card.append(list); element.append(card);
    }
    const show = known => fields.forEach(field => {
      const visible = known(field); field.output.textContent = visible ? field.value : '—'; field.output.classList.toggle('is-known', visible);
    });
    return { element, showLine: index => show(field => index >= field.line),
      focus(person, keys) {
        [...element.children].forEach(card => { card.hidden = card.dataset.person !== person; });
        fields.forEach(field => { field.output.parentElement.hidden = !keys.includes(field.key); });
      },
      showAnswers: values => show(field => Boolean(values[field.person]?.includes(field.key))) };
  }
  // A profile only reveals information already read or explicitly checked.
  // Displaying one never awards an answer, a star, or a completion.
  function taskView(id) {
    const box = node('div', '', 'interview-task-scene'), participants = node('div', '', 'interview-participants');
    box.dataset.task = id;
    for (const person of ['robert', 'sophie']) {
      const figure = node('figure'), img = node('img'); img.src = core.unit78.learning.PEOPLE[person].image; img.alt = '';
      figure.dataset.person = person; figure.append(img, node('figcaption', core.unit78.learning.PEOPLE[person].name)); participants.append(figure);
    }
    const heading = node('h3', '', 'interview-task-prompt'), questionArea = node('div', '', 'interview-task-question'), record = records();
    let current;
    questionArea.append(heading); box.append(participants, questionArea);
    if (id !== 'interview') box.append(record.element);
    function show(answer) {
      const values = { robert: ['Name'], sophie: ['Name'] };
      if (answer && current?.id.endsWith('story-job')) values.robert.push('Job');
      if (answer && /reply-nationality|be-name/.test(current?.id)) values.robert.push('Nationality');
      if (answer && current?.id.endsWith('be-negative')) values.sophie.push('Nationality');
      record.showAnswers(values);
    }
    return { element: box, heading: () => heading,
      present(q, progress) {
        box.hidden = false; current = q; heading.textContent = q.prompt; questionArea.replaceChildren(progress, heading);
        if (id !== 'interview') {
          const person = /story-teacher|be-negative/.test(q.id) ? 'sophie' : 'robert';
          record.focus(person, ['Name', id === 'reply' ? 'Nationality' : 'Job']);
          [...participants.children].forEach(figure => { figure.hidden = figure.dataset.person !== person; });
        }
        show(null);
      },
      answer: show, finish() { box.hidden = true; }
    };
  }
  core.unit78Scene = { records, taskView };
})(globalThis);
