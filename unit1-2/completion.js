(function (root) {
  'use strict';
  const core = root.CanranCore;
  const themes = {
    listen: { title: '单词寻宝完成！', caption: '身边的小物品，都来报到啦。', object: 'book' },
    roles: { title: '故事读懂啦！', caption: '你找到了对白里的小线索。', object: 'handbag' },
    manners: { title: '手提包送回去了！', caption: 'Thank you very much.', returned: true },
    trans: { title: '会问，也会答！', caption: '带着学会的问答，继续出发吧。', object: 'car' },
    exam: { title: '礼貌挑战完成！', caption: '会问一问，也会说谢谢！', returned: true }
  };
  function node(tag, className, text = '') {
    const element = document.createElement(tag); element.className = className; element.textContent = text; return element;
  }
  function picture(name, className) {
    const img = node('img', className);
    img.src = '/assets/unit1-2/' + (['man', 'woman'].includes(name) ? 'scene/' : '') + name + '.svg';
    img.alt = ''; return img;
  }
  function resultIcon(kind) {
    const img = node('img', 'shop-icon');
    img.src = '/assets/unit1-2/completion/' + kind + '-v1.png';
    img.alt = ''; img.width = 128; img.height = 128;
    img.setAttribute('aria-hidden', 'true'); return img;
  }
  function illustration(theme) {
    const scene = node('div', 'completion-art'); scene.setAttribute('aria-hidden', 'true');
    scene.append(node('span', 'completion-halo'), node('span', 'completion-ground'));
    const man = picture('man', 'completion-man'), woman = node('div', 'completion-woman');
    woman.append(picture('woman', 'completion-person'));
    if (theme.returned) woman.append(picture('handbag', 'completion-returned-bag'));
    scene.append(man, woman);
    if (theme.object) scene.append(picture(theme.object, 'completion-object'));
    for (let i = 0; i < 3; i++) {
      const star = resultIcon('streak'); star.className = 'completion-spark spark-' + i; scene.append(star);
    }
    return scene;
  }
  function render({ finish, activity, states, details = null, celebrate = false, awardStatus = '' }) {
    const theme = themes[activity];
    let streak = 0, best = 0, correct = 0;
    // The runner supplies validated states in question order for this round.
    // Retries and hints do not rewrite a question's first submitted outcome.
    for (const state of states) {
      if (state.firstCorrect) { correct++; streak++; best = Math.max(best, streak); }
      else streak = 0;
    }
    const stats = node('ul', 'completion-stats'); stats.setAttribute('aria-label', '本轮成果');
    const values = [
      ['最高连对', best, 'streak'],
      ['本次答对', correct, 'correct'],
      ['本次答错', states.length - correct, 'incorrect']
    ];
    for (const [label, value, kind] of values) {
      const card = node('li', 'completion-stat stat-' + kind), body = node('div', 'completion-stat-value');
      body.append(resultIcon(kind), node('strong', 'completion-number', String(value)), node('span', 'completion-unit', '题'));
      card.append(node('span', 'completion-stat-label', label), body); stats.append(card);
    }
    const title = node('p', 'completion-title', theme.title); title.setAttribute('role', 'heading'); title.setAttribute('aria-level', '4'); title.tabIndex = -1;
    const caption = node('p', 'completion-caption', theme.caption); if (activity === 'manners') caption.lang = 'en';
    const actions = finish.querySelector('.practice-finish-actions');
    const onward = actions.querySelector('.station-actions button');
    if (onward) {
      const label = onward.textContent; onward.setAttribute('aria-label', label);
      onward.replaceChildren(node('span', 'completion-next-prefix', '下一站'), node('span', 'completion-next-name', label.replace(/^下一站：/, '')));
    }
    finish.classList.add('completion-card'); finish.dataset.activity = activity;
    finish.replaceChildren(illustration(theme), title, caption, stats, actions);
    if (awardStatus) actions.before(node('p', 'completion-award', awardStatus));
    if (details?.childElementCount) finish.append(details);
    if (celebrate && !root.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish.classList.add('is-celebrating');
      root.setTimeout(() => finish.classList.remove('is-celebrating'), 900);
    }
  }
  core.unit12Completion = { render };
})(globalThis);
