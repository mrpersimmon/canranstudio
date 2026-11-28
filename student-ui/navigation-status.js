const HINT_DELAY = 160;

function destination(kind, detail) {
  if (kind === 'map') return ' ' + detail + ' 地图';
  if (kind === 'lesson') {
    const pair = /^unit(\d+)-(\d+)$/.exec(detail);
    return pair ? ' Lesson ' + pair[1] + '–' + pair[2] : '课程';
  }
  return kind === 'album' ? '纪念册' : '课程首页';
}

// A page can be opened while a previously requested map is still loading.
// Keep only the foreground wait visible and announced, including after cancel.
function showForegroundNotice(doc) {
  const items = Array.from(doc.querySelectorAll('[data-navigation-notice]'));
  const current = items.filter(item => item.dataset.navigationNotice === 'page').pop() || items[items.length - 1];
  for (const item of items) item.hidden = item !== current;
}

export function presentNavigationStatus(doc, {kind, detail, error, heading, onCancel, onRetry, documentTransition}) {
  let notice, dockObserver;
  function show() {
    if (doc.defaultView.CanranStudentHandoff?.retired) return;
    const originControl = doc.activeElement;
    notice = doc.createElement('div');
    notice.className = 'student-navigation-status' + (documentTransition ? ' student-document-status' : '');
    notice.dataset.navigationNotice = kind === 'map' ? 'map' : 'page';
    notice.dataset.state = error ? 'error' : 'waiting';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.setAttribute('aria-atomic', 'true');
    notice.hidden = true;
    const label = doc.createElement(heading ? 'h1' : 'span');
    label.className = 'student-navigation-label';
    const name = destination(kind, detail);
    label.textContent = error ? '暂时无法打开' + name : '正在打开' + name + '…';
    notice.append(label);
    function action(text, run) {
      const button = doc.createElement('button');
      button.type = 'button';
      button.textContent = text;
      button.setAttribute('aria-label', text + '切换');
      button.onclick = run;
      notice.append(button);
    }
    if (error && onRetry) action('重试', onRetry);
    if (onCancel) action('取消', event => {
      onCancel();
      if (doc.activeElement === event.currentTarget && originControl?.isConnected) originControl.focus({preventScroll:true});
    });
    const dialog = Array.from(doc.querySelectorAll('dialog[open]')).filter(el => !el.closest('[inert]')).pop();
    (dialog || doc.body).append(notice);
    const dock = Array.from(doc.querySelectorAll('.journey-dock')).find(el => !el.closest('[inert]') && el.getClientRects().length);
    if (dock && !dialog) {
      const measure = () => notice.style.setProperty('--notice-dock-height', dock.getBoundingClientRect().height + 'px');
      measure();
      dockObserver = new ResizeObserver(measure);
      dockObserver.observe(dock);
    }
    showForegroundNotice(doc);
  }
  const timer = error ? null : setTimeout(show, HINT_DELAY);
  if (error) show();
  return () => {
    clearTimeout(timer);
    dockObserver?.disconnect();
    if (notice) {
      notice.remove();
      showForegroundNotice(doc);
    }
  };
}
