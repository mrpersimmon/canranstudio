(function attachCertificateGate(root, factory) {
  'use strict';
  const api = factory(root || {});
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.certificateGate = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function certificateGateFactory(root) {
  'use strict';

  function clampRating(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(3, Math.trunc(value)));
  }

  function normalizeTargets(targets) {
    if (!Array.isArray(targets) || targets.length === 0) {
      throw new TypeError('certificate gate requires at least one target');
    }
    return targets.map(target => {
      if (!target || typeof target.id !== 'string' || !target.id ||
          typeof target.selector !== 'string' || !target.selector ||
          typeof target.label !== 'string' || !target.label) {
        throw new TypeError('certificate gate target is invalid');
      }
      return Object.freeze({
        id: target.id,
        selector: target.selector,
        label: target.label,
        focusSelector: typeof target.focusSelector === 'string' ? target.focusSelector : '',
        hash: typeof target.hash === 'string' && target.hash ? target.hash : target.selector
      });
    });
  }

  function completionState(ratings, targets) {
    const ordered = normalizeTargets(targets);
    const source = ratings && typeof ratings === 'object' && !Array.isArray(ratings)
      ? ratings
      : {};
    const entries = ordered.map(target => ({
      target,
      rating: clampRating(source[target.id])
    }));
    const earnedStars = entries.reduce((sum, entry) => sum + entry.rating, 0);
    const incomplete = entries.filter(entry => entry.rating < 3);
    const maxStars = ordered.length * 3;
    return Object.freeze({
      eligible: incomplete.length === 0,
      earnedStars,
      maxStars,
      missingStars: maxStars - earnedStars,
      incompleteCount: incomplete.length,
      firstIncomplete: incomplete.length ? incomplete[0].target : null
    });
  }

  function requiredElement(value, label) {
    if (!value || typeof value.addEventListener !== 'function') {
      throw new TypeError(`${label} must be a DOM element`);
    }
    return value;
  }

  function create(options = {}) {
    const trigger = requiredElement(options.trigger, 'trigger');
    const mount = requiredElement(options.mount, 'mount');
    const status = requiredElement(options.status, 'status');
    const documentRef = trigger.ownerDocument;
    const targets = normalizeTargets(options.targets);
    const getRatings = typeof options.getRatings === 'function'
      ? options.getRatings
      : () => ({});
    const onEligible = typeof options.onEligible === 'function'
      ? options.onEligible
      : () => false;
    const beforeNavigate = typeof options.beforeNavigate === 'function'
      ? options.beforeNavigate
      : () => true;
    const courseName = String(options.courseName || '课程');
    const icon = String(options.icon || '🎓');
    const accent = String(options.accent || '#1d6fb8');
    const pageColor = String(options.pageColor || '#f7f0df');
    const itemLabel = options.itemLabel === '项挑战' ? '项挑战' : '关';
    const readyMessage = String(options.readyMessage || '星星已集齐，可以领取证书。');

    if (!trigger.id) throw new TypeError('certificate trigger requires an id');
    if (!mount.id) mount.id = `${trigger.id}GatePanel`;
    if (!status.id) status.id = `${trigger.id}GateStatus`;

    mount.classList.add('certificate-gate-shell');
    mount.dataset.certificateGate = '';
    mount.hidden = true;
    mount.style.setProperty('--certificate-gate-accent', accent);
    mount.style.setProperty('--certificate-gate-page', pageColor);
    mount.innerHTML = [
      '<p class="certificate-gate-course">',
      '  <span data-certificate-icon aria-hidden="true"></span>',
      '  <span data-certificate-course></span>',
      '</p>',
      '<div class="certificate-gate-ticket">',
      '  <p class="certificate-gate-count" data-certificate-count></p>',
      '  <p class="certificate-gate-next">下一步：回到 <strong data-certificate-target></strong> 补齐三星</p>',
      '  <div class="certificate-gate-buttons">',
      '    <button type="button" class="certificate-gate-button certificate-gate-primary" data-certificate-go></button>',
      '    <button type="button" class="certificate-gate-button certificate-gate-dismiss" data-certificate-dismiss>稍后再说</button>',
      '  </div>',
      '</div>'
    ].join('');

    const count = mount.querySelector('[data-certificate-count]');
    const targetName = mount.querySelector('[data-certificate-target]');
    const go = mount.querySelector('[data-certificate-go]');
    const dismiss = mount.querySelector('[data-certificate-dismiss]');
    mount.querySelector('[data-certificate-icon]').textContent = icon;
    mount.querySelector('[data-certificate-course]').textContent = courseName;

    trigger.classList.add('certificate-gate-trigger');
    trigger.setAttribute('aria-controls', mount.id);
    trigger.setAttribute('aria-describedby', status.id);
    trigger.setAttribute('aria-expanded', 'false');
    status.classList.add('certificate-gate-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    for (const target of targets) {
      const element = documentRef.querySelector(target.selector);
      if (element) element.classList.add('certificate-gate-jump-target');
    }

    function formatCount(state) {
      return itemLabel === '项挑战'
        ? `还差 ${state.missingStars} 颗星，还有 ${state.incompleteCount} 项挑战未满星。`
        : `还差 ${state.missingStars} 颗星，还有 ${state.incompleteCount} 关未满星。`;
    }

    function close({ restoreFocus = false } = {}) {
      mount.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus && trigger.isConnected) trigger.focus();
    }

    function refresh() {
      const state = completionState(getRatings(), targets);
      trigger.disabled = false;
      trigger.removeAttribute('aria-disabled');
      trigger.dataset.certificateState = state.eligible ? 'ready' : 'locked';
      trigger.classList.toggle('is-locked', !state.eligible);
      status.textContent = state.eligible ? readyMessage : formatCount(state);
      count.textContent = formatCount(state);
      if (state.firstIncomplete) {
        targetName.textContent = `「${state.firstIncomplete.label}」`;
        go.textContent = `前往「${state.firstIncomplete.label}」补满星`;
      }
      if (state.eligible) {
        close({ restoreFocus: mount.contains(documentRef.activeElement) });
      }
      return state;
    }

    function open() {
      const state = refresh();
      if (state.eligible) return false;
      mount.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      go.focus();
      return true;
    }

    function attempt(event) {
      if (event) event.preventDefault();
      const state = refresh();
      if (!state.eligible) return open();
      return onEligible(state);
    }

    async function navigate() {
      const state = completionState(getRatings(), targets);
      if (state.eligible) {
        refresh();
        close();
        return false;
      }
      const target = state.firstIncomplete;
      await beforeNavigate(target);
      const targetElement = documentRef.querySelector(target.selector);
      if (!targetElement) {
        status.textContent = '暂时找不到目标关卡，请使用课程导航。';
        mount.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        go.focus();
        return false;
      }
      close();
      if (target.hash.startsWith('#') && root.location) root.location.hash = target.hash.slice(1);
      const requestedFocus = target.focusSelector
        ? targetElement.querySelector(target.focusSelector)
        : null;
      const focusElement = requestedFocus || targetElement.querySelector('h2,h3') || targetElement;
      if (!focusElement.hasAttribute('tabindex')) focusElement.setAttribute('tabindex', '-1');
      focusElement.focus({ preventScroll: true });
      targetElement.scrollIntoView({
        block: 'start',
        behavior: root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth'
      });
      return true;
    }

    const handleAttempt = event => attempt(event);
    const handleNavigate = () => { void navigate(); };
    const handleDismiss = () => close({ restoreFocus: true });
    trigger.addEventListener('click', handleAttempt);
    go.addEventListener('click', handleNavigate);
    dismiss.addEventListener('click', handleDismiss);
    refresh();

    return Object.freeze({
      refresh,
      open,
      close,
      attempt,
      navigate,
      getState: () => completionState(getRatings(), targets),
      destroy() {
        trigger.removeEventListener('click', handleAttempt);
        go.removeEventListener('click', handleNavigate);
        dismiss.removeEventListener('click', handleDismiss);
        close();
      }
    });
  }

  return Object.freeze({ completionState, create });
});
