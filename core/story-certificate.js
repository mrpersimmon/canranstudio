(function (root) {
  'use strict';
  const core = root.CanranCore;
  const layout = root.CanranAwardCardLayout;
  const assets = {
    scene: '/assets/awards/unit1-2-handbag-closeup.webp',
    paper: '/assets/awards/paper.webp',
    earned: '/assets/awards/star-earned.webp',
    empty: '/assets/awards/star-empty.webp'
  };
  const make = (tag, text = '', className = '') => {
    const el = document.createElement(tag); el.textContent = text; el.className = className; return el;
  };
  const picture = (src, alt = '') => { const el = make('img'); el.src = src; el.alt = alt; return el; };
  const dateLabel = date => date ? new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date(date)).replaceAll('/', '.') : '';
  const retainedFor = unit => {
    const saved = root.CanranStudentAccess?.retainedCertificate;
    return saved?.course === unit.id && saved.issuedAt ? saved : null;
  };
  const originalUnit = (unit, retained) => retained?.kind === 'card'
    ? { ...unit, reward: { ...unit.reward, ...retained.meta, zones: unit.reward.zones } } : unit;

  function courseDestinations(unitId, currentUrl, returnUrl, access) {
    const current = new URL(currentUrl);
    const route = current.pathname.match(/^(.*\/)unit\d+-\d+(?:\/(?:index\.html)?)?$/);
    const base = new URL(route?.[1] || '/', current);
    const home = new URL(returnUrl || base.href, current);
    const preview = current.searchParams.get('preview');
    if (preview && home.origin === current.origin) home.searchParams.set('preview', preview);
    const pair = /^unit(\d+)-(\d+)$/.exec(unitId);
    const first = Number(pair?.[1]);
    const valid = pair && first >= 1 && first <= 143 && first % 2 === 1 && Number(pair[2]) === first + 1;
    const nextId = valid && first < 143 ? 'unit' + (first + 2) + '-' + (first + 3) : null;
    const permitted = nextId && (access === undefined || access?.nextCourse?.id === nextId);
    if (!permitted) return { home: home.href, next: null, label: '' };
    const next = new URL(nextId + '/', base);
    if (preview) next.searchParams.set('preview', preview);
    return { home: home.href, next: next.href, label: 'Lesson ' + (first + 2) + '–' + (first + 3) };
  }

  function navigation({ unit, returnUrl = document.getElementById('logo')?.href }) {
    if (!/^unit\d+-\d+$/.test(unit?.id || '')) return null;
    const nav = make('nav', '', 'course-ending-navigation');
    nav.setAttribute('aria-label', '课程结束后导航');
    const home = make('a', '返回首页', 'btn btn-yellow'); home.dataset.courseExit = 'home';
    const next = make('a', '下一课', 'btn btn-green'); next.dataset.courseExit = 'next';
    next.hidden = true;
    nav.append(home, next);
    function update(access) {
      const targets = courseDestinations(unit.id, location.href, returnUrl, access);
      home.href = targets.home;
      next.hidden = !targets.next;
      nav.dataset.hasNext = String(Boolean(targets.next));
      if (targets.next) {
        next.href = targets.next;
        next.setAttribute('aria-label', '下一课：' + targets.label);
      } else next.removeAttribute('href');
    }
    // Account entry supplies permission for the adjacent unit. Static course
    // previews use the published 72-unit sequence without an account session.
    update(root.CanranAccessReady ? null : root.CanranStudentAccess);
    root.CanranAccessReady?.then(update).catch(() => update(null));
    return nav;
  }

  // One card renderer for the course, its settlement and the saved artwork.
  // The caller supplies the account identity; never collect another name.
  function card({ unit, label = unit.copy?.compact ? '我的纪念卡' : '我的单元纪念卡' }) {
    const retained = retainedFor(unit); unit = originalUnit(unit, retained);
    const lesson = unit.reward.lesson || 'Lesson 1–2';
    const paper = make('article', '', 'story-award-paper award-card'); paper.setAttribute('aria-label', label); paper.dataset.unit = unit.id;
    const brand = make('p', '灿然英语工作室', 'story-award-brand');
    const title = make('h3', unit.reward.title, 'story-award-title');
    title.style.color = unit.reward.color || '#0b7399';
    const name = make('p', '', 'story-award-name');
    const stars = make('div', '', 'story-award-stars'); stars.setAttribute('role', 'group');
    // Retain both decoded states of each star. Changing a mounted image's src
    // briefly makes it unready again, even when its URL has been preloaded.
    const starVariants = Array.from({ length: 5 }, () => [picture(assets.empty), picture(assets.earned)]);
    const starImages = starVariants.map(([empty]) => { stars.append(empty); return empty; });
    let starsReady = false, pendingStars = 0;
    function showStars(count) {
      pendingStars = count;
      if (!starsReady) return;
      starVariants.forEach(([empty, earned], i) => {
        const next = i < count ? earned : empty;
        if (starImages[i] === next) return;
        starImages[i].replaceWith(next); starImages[i] = next;
      });
    }
    const ready = Promise.all(starVariants.flat().map(image => image.decode())).then(() => {
      starsReady = true; showStars(pendingStars); return true;
    }).catch(() => false);
    const illustration = picture(unit.reward.scene || assets.scene, unit.reward.alt || '男士把手提包交还给女士'); illustration.className = 'story-award-illustration';
    const foot = make('p', '', 'story-award-foot');
    const date = make('time');
    foot.append(make('span', lesson), date);
    paper.append(brand, title, name, stars, illustration, foot);
    const frame = make('div', '', 'card-frame'), plane = make('div', '', 'card-design-plane');
    plane.append(paper); frame.append(plane);
    const sizing = layout.observeFrame(frame);
    function identity(recipient, identityLabel = '登录后显示姓名') {
      if (retained?.kind === 'card') recipient = retained.name;
      name.textContent = recipient || identityLabel;
      name.classList.toggle('is-placeholder', !recipient);
      Object.entries(layout.typography(unit.reward.title, name.textContent, unit.id)).forEach(([key, value]) => paper.style.setProperty(key, value));
    }
    function update(state) {
      if (retained?.kind === 'card') state = { ...state, stars: 5, firstFullStarAt: retained.issuedAt };
      paper.dataset.stars = String(state.stars);
      stars.setAttribute('aria-label', '已获得 ' + state.stars + ' / 5 颗星');
      showStars(state.stars);
      date.hidden = state.stars !== 5 || !state.firstFullStarAt;
      date.textContent = date.hidden ? '' : dateLabel(state.firstFullStarAt);
      if (date.hidden) date.removeAttribute('datetime'); else date.dateTime = state.firstFullStarAt;
    }
    return { element: paper, frame, resize: sizing.update, name, date, starImages, ready, update, identity };
  }

  function mount({ element, unit, go, returnUrl, progress, restart }) {
    const retained = retainedFor(unit);
    if (retained?.kind === 'legacy-paper') {
      // A historical paper certificate is never redrawn as today's keepsake
      // with its old date. Its dedicated, read-only renderer owns all exports.
      const section = make('section', '', 'retained-paper-certificate');
      section.append(make('h3', '已通关'), make('p', '★★★★★', 'retained-certificate-stars'));
      section.querySelector('.retained-certificate-stars').setAttribute('aria-label', '已获得 5 / 5 颗星');
      const name = make('p', retained.name); name.id = 'certificateName';
      const date = make('time', dateLabel(retained.issuedAt)); date.id = 'certificateDate'; date.dateTime = retained.issuedAt;
      const link = make('a', '查看原证书', 'btn btn-green'); link.href = new URL('awards/history/' + encodeURIComponent(retained.id) + '/', returnUrl).href;
      const album = make('a', '我的纪念册', 'btn btn-yellow'); album.href = new URL('awards/', returnUrl).href;
      const actions = make('div', '', 'story-award-actions'); actions.append(link, album);
      section.append(name, date, make('p', '本课通关成果已保留。再次学习使用新的练习记录，原证书和领取日期不变。'), actions);
      if (progress) { const ending = navigation({unit,returnUrl}); if (ending) section.append(ending); }
      element.append(section); return { update() {} };
    }
    unit = originalUnit(unit, retained);
    const artwork = {...assets,scene:unit.reward.scene || assets.scene};
    const lesson = unit.reward.lesson || 'Lesson 1–2';
    let state = { stars: 0, zones: {}, firstFullStarAt: null }, exportUrl, exportJob, exporting = false;
    let recipient = '', identityLabel = '登录后显示姓名';
    const panel = make('div', '', 'story-award-panel');
    const view = card({ unit }), paper = view.element;
    const slots = view.starImages.map((image, i) => {
      const slot = make('span', '', 'award-star'); slot.style.setProperty('--star-order', i);
      const light = make('span', '', 'star-glint'); light.setAttribute('aria-hidden', 'true');
      image.replaceWith(slot); slot.append(image, light); return slot;
    });
    const rim = make('span', '', 'gold-light-ring'); rim.setAttribute('aria-hidden', 'true'); paper.append(rim);
    // Keep the ambient light on whenever the card is visible. Off-screen cards
    // do not need to spend frames while the child is answering other sections.
    let inView = false;
    const updateMotion = () => { paper.dataset.motion = inView && !document.hidden ? 'full' : 'paused'; };
    const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updateMotion(); });
    visibility.observe(paper); document.addEventListener('visibilitychange', updateMotion); updateMotion();
    view.name.id = 'certificateName'; view.date.id = 'certificateDate';
    const controls = make('div', '', 'story-award-actions');
    const save = make('button', '保存动图', 'btn btn-green'); save.type = 'button';
    const downloadIcon = picture('/assets/awards/download.svg'); downloadIcon.className = 'shop-icon'; save.prepend(downloadIcon);
    const back = make('a', '返回课程', 'btn btn-yellow'); back.href = returnUrl;
    const backIcon = picture('/assets/awards/return.svg'); backIcon.className = 'shop-icon'; back.prepend(backIcon); controls.append(save, back);
    const status = make('p', '', 'story-award-status'); status.setAttribute('role', 'status');
    panel.append(view.frame, controls, status); element.append(panel); view.resize();
    if (progress) { const ending = navigation({unit,returnUrl}); if (ending) controls.after(ending); }

    function showName() {
      view.identity(recipient, identityLabel);
      save.disabled = exporting || state.stars === 0 || !recipient;
    }
    root.CanranAccessReady?.then(access => {
      recipient = access.preview ? '' : retained?.kind === 'card' ? retained.name : String(access.student.name || '').trim();
      identityLabel = access.preview ? '班级预览' : '登录后显示姓名';
      if (!access.preview) { back.replaceChildren(backIcon,document.createTextNode('我的纪念册')); back.href=new URL('awards/',returnUrl).href; }
      showName();
    }).catch(() => { recipient = ''; showName(); });

    function update(next) {
      if (retained?.kind === 'card') next = { ...next, stars: 5, firstFullStarAt: retained.issuedAt };
      state = next; view.update(state);
      slots.forEach((slot, i) => { slot.dataset.earned = String(i < state.stars); });
      showName();
    }

    async function exportCard() {
      if (save.disabled) return;
      exporting = true; exportJob = new AbortController(); showName(); status.textContent = '正在保存…';
      // Capture one immutable snapshot so a sync during export cannot mix dates.
      const snapshot = { recipient, stars: state.stars, date: state.firstFullStarAt };
      try {
        await layout.prepareFonts(unit.id, snapshot.recipient);
        await document.fonts.ready;
        const images = await Promise.all(Object.values(artwork).map(async src => {
          const img = picture(src); await img.decode(); return img;
        }));
        const canvas = layout.draw({unitId:unit.id,title:unit.reward.title,name:snapshot.recipient,lesson,color:unit.reward.color,stars:snapshot.stars,date:dateLabel(snapshot.date),images:{scene:images[0],paper:images[1],earned:images[2],empty:images[3]},roundFont:'Award Round',latinFont:'Baloo 2'});
        const blob = await root.CanranAwardGif.encode(canvas, { ...layout.starLayout, stars: snapshot.stars, earnedImage: images[2], signal: exportJob.signal });
        exportJob.signal.throwIfAborted();
        if (exportUrl) URL.revokeObjectURL(exportUrl);
        exportUrl = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = exportUrl; link.download = lesson.replace(' ','').replace('–','-')+'-'+unit.reward.title+'.gif'; link.click();
        status.textContent = '动图已生成';
      } catch (error) { status.textContent = error.name === 'AbortError' ? '' : '暂时没能保存，请再试一次。'; }
      finally { exporting = false; showName(); }
    }
    save.addEventListener('click', exportCard);
    root.addEventListener('pagehide', () => { exportJob?.abort(); if (exportUrl) URL.revokeObjectURL(exportUrl); });
    update(state); return { update };
  }

  core.storyCertificate = { mount, card, navigation, courseDestinations };
})(globalThis);
