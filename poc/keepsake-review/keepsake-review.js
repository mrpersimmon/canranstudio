(function attachKeepsakeReview(root) {
  'use strict';

  const STATE_ORDER = ['start', 'stage1', 'stage2', 'stage3', 'complete'];
  const PROGRESS = Object.freeze({
    start: Object.freeze({ stars: '0/6', footprints: '0/3', final: '0/12' }),
    stage1: Object.freeze({ stars: '3/6', footprints: '2/3', final: '2/12' }),
    stage2: Object.freeze({ stars: '8/12', footprints: '4/6', final: '6/12' }),
    stage3: Object.freeze({ stars: '16/20', footprints: '7/9', final: '9/12' }),
    complete: Object.freeze({ stars: '20/20', footprints: '12/12', final: '12/12' })
  });
  const BADGES = Object.freeze({
    stage1: Object.freeze({ title: '丰盛餐桌', earned: '这份奉献已经留在城区：你用食物、家庭与分享的挑战，点亮了第一段旅程。', current: '完成 3 座地标并收集足够的本城挑战星，丰盛餐桌就会收入图鉴。', locked: '先从城区的第一段旅程出发，答案会藏在热腾腾的餐桌旁。' }),
    stage2: Object.freeze({ title: '四季罗盘', earned: '四季已经住进罗盘。春花、夏阳、秋叶与冬雪会一直记录你的旅程。', current: '当前目标：本城挑战星 8/12，地标足迹 4/6。每一次真正完成的挑战，都会让罗盘更清晰。', locked: '先完成丰盛餐桌的旅程，新的方向才会在罗盘上出现。' }),
    stage3: Object.freeze({ title: '世界气候旅程', earned: '你已经能把季节、天气与世界联系起来，这张远方地图正式收入图鉴。', current: '风已经吹过地图：再完成当前城区的深度挑战，就能看清下一段航线。', locked: '神秘线索：风吹过远方的地图。继续前进，地图会逐渐显现。' }),
    final: Object.freeze({ title: '四季生活城终章', earned: '十二座地标全部落成。三段旅程在城区中心汇聚，这枚终章永远属于你。', current: '终章正在等待十二座地标汇聚。它不会消耗星星，也不需要手动领取。', locked: '当十二座地标全部落成，三段旅程会在城区中心汇成最终纪念章。' })
  });

  function normalizeState(value) {
    return STATE_ORDER.includes(value) ? value : 'stage2';
  }

  function badgeStatus(state, badgeId) {
    const stateIndex = STATE_ORDER.indexOf(state);
    if (badgeId === 'final') return state === 'complete' ? 'earned' : 'locked';
    const badgeIndex = Number.parseInt(badgeId.replace('stage', ''), 10);
    if (state === 'complete' || badgeIndex < stateIndex) return 'earned';
    if (badgeIndex === stateIndex) return 'current';
    return 'locked';
  }

  function mount(rootElement) {
    if (!rootElement) return;
    const params = new URLSearchParams(window.location.search);
    let state = normalizeState(params.get('state'));
    const stageSlots = [...rootElement.querySelectorAll('[data-stage-slot]')];
    const finalBadge = rootElement.querySelector('[data-badge="final"]');
    const reviewDock = rootElement.querySelector('[data-review-dock]');
    const dialog = rootElement.querySelector('[data-badge-dialog]');
    let controlsTimer = 0;

    function preloadBadgeVariants() {
      const urls = new Set(
        [...rootElement.querySelectorAll('[data-color-src]')]
          .flatMap(image => [image.dataset.colorSrc, image.dataset.embossedSrc])
          .filter(Boolean)
      );
      const load = () => urls.forEach(url => {
        const image = new Image();
        image.decoding = 'async';
        image.src = url;
      });
      if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 1400 });
      else window.setTimeout(load, 350);
    }

    function exposeControls(timeout = 3200) {
      window.clearTimeout(controlsTimer);
      rootElement.dataset.controls = 'visible';
      controlsTimer = window.setTimeout(() => {
        delete rootElement.dataset.controls;
      }, timeout);
    }

    function render() {
      rootElement.dataset.state = state;
      const progress = PROGRESS[state];
      stageSlots.forEach(slot => {
        const badgeId = `stage${slot.dataset.stageSlot}`;
        const status = badgeStatus(state, badgeId);
        slot.dataset.badgeState = status;
        const button = slot.querySelector('[data-badge]');
        const art = button.querySelector('[data-color-src]');
        art.src = status === 'earned' ? art.dataset.colorSrc : art.dataset.embossedSrc;
        const statusLabel = status === 'earned' ? '已获得' : status === 'current' ? '当前目标' : '尚未解锁';
        button.setAttribute('aria-label', `${BADGES[badgeId].title}纪念章，${statusLabel}`);
      });
      const finalStatus = badgeStatus(state, 'final');
      finalBadge.dataset.badgeState = finalStatus;
      const finalArt = finalBadge.querySelector('[data-color-src]');
      finalArt.src = finalStatus === 'earned' ? finalArt.dataset.colorSrc : finalArt.dataset.embossedSrc;
      rootElement.querySelector('[data-star-value]').textContent = progress.stars;
      rootElement.querySelector('[data-footprint-value]').textContent = progress.footprints;
      rootElement.querySelector('[data-final-progress]').textContent = `地标落成 ${progress.final}`;
      rootElement.querySelector('[data-final-whisper]').textContent = finalStatus === 'earned'
        ? '十二座地标已经把三段旅程汇成城区终章'
        : '三段旅程将在城区中心汇成一枚终章';
      reviewDock.querySelectorAll('[data-review-state]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.reviewState === state));
      });
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('state', state);
      window.history.replaceState(null, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    }

    function openBadge(badgeId) {
      const status = badgeStatus(state, badgeId);
      const copyKey = status === 'earned' ? 'earned' : status === 'current' ? 'current' : 'locked';
      rootElement.querySelector('[data-dialog-kicker]').textContent = status === 'earned'
        ? '已收入城区图鉴'
        : status === 'current'
          ? '当前旅程目标'
          : '尚未揭晓的线索';
      rootElement.querySelector('[data-dialog-title]').textContent = BADGES[badgeId].title;
      rootElement.querySelector('[data-dialog-copy]').textContent = BADGES[badgeId][copyKey];
      dialog.hidden = false;
      document.body.dataset.dialogOpen = 'true';
      dialog.querySelector('[data-dialog-dismiss]').focus({ preventScroll: true });
    }

    function closeDialog() {
      if (dialog.hidden) return;
      dialog.hidden = true;
      delete document.body.dataset.dialogOpen;
    }

    rootElement.addEventListener('pointermove', event => {
      if (event.clientY > window.innerHeight - 82) exposeControls(1800);
    });
    rootElement.addEventListener('touchstart', event => {
      if (event.touches[0]?.clientY > window.innerHeight - 90) exposeControls(2400);
    }, { passive: true });
    reviewDock.addEventListener('click', event => {
      const button = event.target.closest('[data-review-state]');
      if (!button) return;
      state = normalizeState(button.dataset.reviewState);
      render();
      exposeControls(2600);
    });
    rootElement.querySelectorAll('[data-badge]').forEach(button => {
      button.addEventListener('click', () => openBadge(button.dataset.badge));
    });
    dialog.addEventListener('click', closeDialog);
    rootElement.querySelector('[data-back]').addEventListener('click', () => {
      if (window.history.length > 1) window.history.back();
      else window.location.assign('/');
    });
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDialog();
      if (event.key.toLowerCase() === 'r') exposeControls(5000);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = Math.min(STATE_ORDER.length - 1, Math.max(0, STATE_ORDER.indexOf(state) + direction));
        state = STATE_ORDER[nextIndex];
        render();
        exposeControls(1800);
      }
    });

    render();
    preloadBadgeVariants();
    exposeControls();
  }

  root.CanranPoc = root.CanranPoc || {};
  root.CanranPoc.keepsakeReview = Object.freeze({ mount, normalizeState, badgeStatus });
})(globalThis);

CanranPoc.keepsakeReview.mount(document.querySelector('[data-keepsake-root]'));
