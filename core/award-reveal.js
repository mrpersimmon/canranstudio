(function (root) {
  'use strict';
  const core = root.CanranCore;
  const UPGRADE = '课程已升级，重新挑战，全对即可点亮星星！';
  const earnedImage = '/assets/awards/star-earned.webp';
  const node = (tag, className, text = '') => {
    const el = document.createElement(tag); el.className = className; el.textContent = text; return el;
  };
  const decorative = className => { const el = node('span', className); el.setAttribute('aria-hidden', 'true'); return el; };

  function create({ unit }) {
    const dialog = node('dialog', 'award-reveal'); dialog.tabIndex = -1;
    dialog.setAttribute('aria-label', '纪念卡结算；点击任意位置，或按回车、空格、Esc 关闭');
    const stage = node('div', 'award-reveal-stage'), panel = node('div', 'award-reveal-panel');
    const view = core.storyCertificate.card({ unit, label: unit.reward.title + '纪念卡' });
    const wrap = node('div', 'award-reveal-card'); wrap.append(view.element);
    const slots = view.starImages.map((image, i) => {
      const slot = decorative('award-star'); slot.style.setProperty('--star-order', i);
      image.replaceWith(slot); slot.append(image, decorative('star-glint')); return slot;
    });
    view.element.append(decorative('gold-light-ring'));
    const source = decorative('star-source'); source.hidden = true; wrap.append(source);
    const reminder = node('p', 'award-upgrade-reminder'); reminder.id = 'awardUpgradeReminder';
    reminder.append(node('span', '', '课程已升级，重新挑战，'), node('span', '', '全对即可点亮星星！'));
    panel.append(wrap); stage.append(panel); dialog.append(stage); document.body.append(dialog);
    let generation = 0, loading = false, queue = [], current = null, focusTarget;
    const seen = new Set(), completionTargets = new Map();
    // Keep the actual animation image ready, not just another image with the
    // same URL. A fresh unready <img> would reopen the course's page guard.
    const flightImage = new Image(); flightImage.src = earnedImage; flightImage.alt = '';
    // These assets are also part of the course's required cache package. Raw
    // internal previews still wait for decoding instead of showing a half card.
    const ready = Promise.all([
      root.CanranAccessReady || Promise.resolve(null),
      view.ready,
      document.fonts.load('20px "Award Round"'),
      flightImage.decode(),
      ...[view.element.querySelector('.story-award-illustration').src,
        '/assets/awards/star-empty.webp', '/assets/awards/paper.webp'].map(src => {
        const image = new Image(); image.src = src; return image.decode();
      })
    ]).then(async ([access, preparedStars]) => {
      if (!preparedStars) return false;
      await root.CanranAwardCardLayout.prepareFonts(unit.id, access?.student?.name || '');
      view.identity(access && !access.preview ? String(access.student.name || '').trim() : '', access?.preview ? '班级预览' : '登录后显示姓名');
      return true;
    }).catch(() => false); // A visual failure never changes or blocks learning.

    function paint(snapshot) {
      view.update(snapshot);
      slots.forEach((slot, i) => { slot.dataset.earned = String(i < snapshot.stars); });
    }
    function stop() {
      generation++; loading = false; dialog.dataset.motion = 'stopped';
      dialog.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      dialog.querySelectorAll('.travelling-star,.sparkle,.star-trail,.star-bloom').forEach(el => el.remove());
    }
    function dismiss(restore = true) {
      stop();
      if (current) paint(current.state);
      current = null;
      if (dialog.open) dialog.close();
      if (restore && focusTarget?.isConnected && !focusTarget.closest('[inert]')) focusTarget.focus({ preventScroll: true });
      focusTarget = null;
      queueMicrotask(showNext);
    }
    function cancel() { queue = []; dismiss(false); }
    async function showNext() {
      if (dialog.open || loading || !queue.length || document.hidden || document.documentElement.hasAttribute('data-access-locked') ||
        document.querySelector('dialog[open]')) return;
      loading = true; const token = generation;
      const prepared = await ready;
      if (token !== generation) return;
      loading = false;
      if (!prepared) { queue = []; return; }
      if (document.hidden || document.documentElement.hasAttribute('data-access-locked') || document.querySelector('dialog[open]')) return;
      current = queue.shift(); if (!current) return;
      focusTarget = current.target || document.activeElement;
      reminder.remove(); dialog.removeAttribute('aria-describedby');
      if (current.kind === 'upgrade') { panel.append(reminder); dialog.setAttribute('aria-describedby', reminder.id); }
      dialog.dataset.kind = current.kind;
      // Reward celebrations play by default, independent of the OS preference.
      // They are always dismissible, including before the falling star lands.
      dialog.dataset.motion = 'full';
      paint(current.kind === 'upgrade' ? current.state : current.before);
      dialog.showModal(); dialog.focus({ preventScroll: true });
      void animate(current, token).catch(() => { if (token === generation && current) paint(current.state); });
    }
    function enqueue(item) {
      if (seen.has(item.key)) return;
      seen.add(item.key); queue.push(item); queueMicrotask(showNext);
    }
    function earned({ before, state, zoneIds }) {
      // The ledger calls this only after local-preview or account confirmation.
      // A sync may confirm several offline rounds together: one card, in order.
      const focused = document.activeElement;
      enqueue({ kind: state.stars === 5 ? 'full' : 'earned', before, state,
        key: 'earned:' + zoneIds.join('|'), target: focused?.matches('button,a,select,input') ? focused : completionTargets.get(zoneIds.at(-1)) });
    }
    function pendingMessage() {
      if (!unit.copy?.compact) return '整轮零错！联网同步后点亮星星。';
      return root.navigator.onLine === false || document.getElementById('studentSyncStatus')?.dataset.syncState === 'retry'
        ? '已保存，联网后同步星星。' : '正在同步星星…';
    }
    function complete({ id, states, round, awards, element }) {
      completionTargets.set(id, element.querySelector('.practice-finish-actions button'));
      const previous = awards.state();
      const perfect = awards.record(id, states, round), state = awards.state();
      let message;
      if (state.pendingZones.includes(id)) message = pendingMessage();
      else if (state.zones[id]) message = unit.copy?.compact ? '已获星' : '这颗星已经点亮。';
      else if (states.some(item => item.firstCorrect === false)) message = unit.copy?.compact ? '这轮有过答错，再挑战一轮争取星星。' : '本轮有过错答。再练一轮，整轮零错就能点亮星星。';
      else if (round.roundPolicy !== unit.reward.edition) {
        message = UPGRADE;
        if (round.userCompleted) enqueue({ kind: 'upgrade', before: state, state,
          key: 'upgrade:' + id + ':' + round.runId, target: element.querySelector('.practice-finish-actions button') });
      } else message = '学习记录已保留。请重新挑战完整一轮。';
      // A perfect replay still deserves a card presentation. It reuses the
      // earned snapshot, so neither a new flying star nor a new award is made.
      if (perfect && previous.zones[id] && round.userCompleted) enqueue({
        kind: 'replay', before: state, state, key: 'replay:' + id + ':' + round.runId,
        target: element.querySelector('.practice-finish-actions button')
      });
      // The Finish button has been replaced by the completion actions. Restore
      // focus there after a foreground award, never to a detached old button.
      for (const item of queue) if (item.kind !== 'upgrade' && !item.target) item.target = element.querySelector('.practice-finish-actions button');
      return { perfect, message };
    }
    async function animate(item, token) {
      await panel.animate([{ opacity: 0, transform: 'translateY(10px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' }).finished;
      if (item.kind === 'upgrade') return;
      for (let index = item.before.stars; index < item.state.stars && token === generation; index++) {
        source.hidden = false; const origin = source.getBoundingClientRect(); source.hidden = true;
        const target = view.starImages[index], dest = target.getBoundingClientRect();
        const fly = decorative('travelling-star');
        fly.append(flightImage, decorative('star-glint'));
        Object.assign(fly.style, { left: origin.x + 'px', top: origin.y + 'px', width: origin.width + 'px', height: origin.height + 'px' }); dialog.append(fly);
        const dx = dest.x + dest.width / 2 - origin.x - origin.width / 2;
        const dy = dest.y + dest.height / 2 - origin.y - origin.height / 2;
        for (let i = 0; i < 6; i++) {
          const trail = decorative('star-trail');
          Object.assign(trail.style, { left: origin.x + origin.width / 2 - 4 + 'px', top: origin.y + origin.height / 2 - 4 + 'px' }); dialog.append(trail);
          trail.animate([{ opacity: 0, transform: 'translate(0,-10px) scale(.2)' }, { opacity: .8, transform: 'translate(0,-10px)', offset: .25 },
            { opacity: .65, transform: `translate(${dx * .65 + i * 2}px,${dy * .2 - 25 + i * 2}px) scale(.8)`, offset: .6 },
            { opacity: 0, transform: `translate(${dx}px,${dy}px) scale(.1)` }],
          { duration: 1060, delay: i * 42, easing: 'cubic-bezier(.22,.7,.28,1)', fill: 'both' }).finished.then(() => trail.remove(), () => trail.remove());
        }
        await fly.animate([{ opacity: 0, transform: 'translate(0,-15px) scale(.5) rotate(-15deg)' },
          { opacity: 1, transform: 'translate(0,-10px) scale(1.15) rotate(5deg)', offset: .25 },
          { opacity: 1, transform: `translate(${dx * .65}px,${dy * .2 - 25}px) scale(.95) rotate(-7deg)`, offset: .6 },
          { opacity: 1, transform: `translate(${dx}px,${dy}px) scale(${dest.width / origin.width})` }],
        { duration: 1060, easing: 'cubic-bezier(.22,.7,.28,1)', fill: 'forwards' }).finished;
        if (token !== generation) return;
        fly.remove(); paint({ ...item.state, stars: index + 1 });
        slots[index].animate([{ transform: 'scale(.7)' }, { transform: 'scale(1.3)', offset: .48 }, { transform: 'scale(1)' }], { duration: 540, easing: 'ease-out' });
        const bloom = decorative('star-bloom');
        Object.assign(bloom.style, { left: dest.x + dest.width / 2 - 45 + 'px', top: dest.y + dest.height / 2 - 45 + 'px' }); dialog.append(bloom);
        bloom.animate([{ opacity: 0, transform: 'scale(.25)' }, { opacity: .9, transform: 'scale(.7)', offset: .18 }, { opacity: 0, transform: 'scale(1.35)' }], { duration: 720, easing: 'ease-out' }).finished.then(() => bloom.remove(), () => bloom.remove());
        for (let i = 0; i < 12; i++) {
          const spark = decorative('sparkle'), angle = Math.PI * 2 * i / 12, reach = i % 2 ? 42 : 62;
          Object.assign(spark.style, { left: dest.x + dest.width / 2 - 5 + 'px', top: dest.y + dest.height / 2 - 5 + 'px' }); dialog.append(spark);
          spark.animate([{ opacity: 1, transform: 'scale(.4)' }, { opacity: .8, transform: `translate(${Math.cos(angle) * reach * .5}px,${Math.sin(angle) * reach * .5}px)`, offset: .4 },
            { opacity: 0, transform: `translate(${Math.cos(angle) * reach}px,${Math.sin(angle) * reach}px) scale(.1) rotate(30deg)` }],
          { duration: 760 + i % 3 * 90, easing: 'ease-out' }).finished.then(() => spark.remove(), () => spark.remove());
        }
      }
    }
    dialog.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); dismiss(); });
    dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
    dialog.addEventListener('keydown', event => {
      if (['Enter', ' ', 'Escape'].includes(event.key)) { event.preventDefault(); event.stopPropagation(); dismiss(); }
    });
    document.addEventListener('close', () => queueMicrotask(showNext), true);
    root.addEventListener('lesson49:leave-activity', cancel);
    root.addEventListener('hashchange', cancel);
    root.addEventListener('pagehide', cancel);
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); else void showNext(); });
    return { earned, complete, pendingMessage, isPresenting: () => dialog.open || loading || queue.length > 0 };
  }
  core.awardReveal = { create };
})(globalThis);
