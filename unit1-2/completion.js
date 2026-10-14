(function (root) {
  'use strict';
  const core = root.CanranCore;
  const themes = {
    listen: { title: '单词寻宝完成！', object: 'book' },
    roles: { title: '故事读懂啦！', object: 'handbag' },
    manners: { title: '手提包送回去了！', caption: 'Thank you very much.', returned: true },
    trans: { title: '问答练习完成！', object: 'car' },
    exam: { title: '综合挑战完成！', returned: true }
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
  function celebrateResult(finish, stats, values, waitForCelebration) {
    let retry, started = false;
    finish.dataset.resultMotion = 'pending';
    const observer = new IntersectionObserver(() => tryStart());
    const cleanup = () => {
      observer.disconnect(); root.clearTimeout(retry);
      document.removeEventListener('close', tryStart, true);
      document.removeEventListener('visibilitychange', tryStart);
    };
    function tryStart() {
      if (started) return;
      root.clearTimeout(retry);
      if (!finish.isConnected) { cleanup(); return; }
      const box = stats.getBoundingClientRect();
      if (box.bottom <= 0 || box.top >= root.innerHeight || !box.width || document.hidden) return;
      // A reward modal owns the foreground. Start the results only after the
      // child dismisses it, not underneath the flying-star celebration.
      if (document.querySelector('dialog[open]')) return;
      if (waitForCelebration()) { retry = root.setTimeout(tryStart, 100); return; }
      started = true; cleanup();
      finish.dataset.resultMotion = 'playing';
      finish.classList.add('is-celebrating');
      const start = performance.now();
      const numbers = [...stats.querySelectorAll('.completion-number')];
      [...stats.children].forEach((card, i) => card.animate([
        { transform: 'translateY(16px) scale(.94)', opacity: 0 },
        { transform: 'translateY(-3px) scale(1.025)', opacity: 1, offset: .72 },
        { transform: 'none', opacity: 1 }
      ], { duration: 520, delay: i * 110, easing: 'ease-out', fill: 'backwards' }));
      function count(now) {
        numbers.forEach((number, i) => {
          const progress = Math.max(0, Math.min(1, (now - start - i * 110) / 600));
          if (values[i] !== null) number.textContent = String(Math.round(values[i] * (1 - Math.pow(1 - progress, 2))));
        });
        if (now - start < 850 && finish.isConnected) root.requestAnimationFrame(count);
        else {
          numbers.forEach((number, i) => { if (values[i] !== null) number.textContent = String(values[i]); });
          finish.classList.remove('is-celebrating'); finish.dataset.resultMotion = 'finished';
        }
      }
      root.requestAnimationFrame(count);
    }
    observer.observe(stats);
    document.addEventListener('close', tryStart, true);
    document.addEventListener('visibilitychange', tryStart);
    retry = root.setTimeout(tryStart, 0);
  }
  function render({ finish, activity, details = null, celebrate = false, awardStatus = '', waitForCelebration = () => false, theme = themes[activity], artwork = null }) {
    const stats = finish.querySelector('.completion-stats');
    const values = [...stats.querySelectorAll('.completion-number')].map(number => number.textContent === '—' ? null : Number(number.textContent));
    const title = node('p', 'completion-title', theme.title); title.setAttribute('role', 'heading'); title.setAttribute('aria-level', '4'); title.tabIndex = -1;
    const caption = theme.caption ? node('p', 'completion-caption', theme.caption) : null;
    if (caption) caption.lang = 'en';
    const actions = finish.querySelector('.practice-finish-actions');
    const onward = actions.querySelector('.station-actions button');
    if (onward && onward.textContent.startsWith('下一站：')) {
      const label = onward.textContent; onward.setAttribute('aria-label', label);
      onward.replaceChildren(node('span', 'completion-next-prefix', '下一站'), node('span', 'completion-next-name', label.replace(/^下一站：/, '')));
    }
    finish.classList.add('completion-card'); finish.dataset.activity = activity;
    finish.replaceChildren(artwork || illustration(theme), title, ...(caption ? [caption] : []), stats, actions);
    if (awardStatus) actions.before(node('p', 'completion-award', awardStatus));
    if (details?.childElementCount) finish.append(details);
    if (celebrate) celebrateResult(finish, stats, values, waitForCelebration);
  }
  core.unit12Completion = { render };
})(globalThis);
