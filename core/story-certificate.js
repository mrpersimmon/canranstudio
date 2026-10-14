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

  // One card renderer for the course, its settlement and the saved artwork.
  // The caller supplies the account identity; never collect another name.
  function card({ unit, label = unit.copy?.compact ? '我的纪念卡' : '我的单元纪念卡' }) {
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
    function identity(recipient, identityLabel = '登录后显示姓名') {
      name.textContent = recipient || identityLabel;
      name.classList.toggle('is-placeholder', !recipient);
      Object.entries(layout.typography(unit.reward.title, name.textContent, unit.id)).forEach(([key, value]) => paper.style.setProperty(key, value));
    }
    function update(state) {
      paper.dataset.stars = String(state.stars);
      stars.setAttribute('aria-label', '已获得 ' + state.stars + ' / 5 颗星');
      showStars(state.stars);
      date.hidden = state.stars !== 5 || !state.firstFullStarAt;
      date.textContent = date.hidden ? '' : dateLabel(state.firstFullStarAt);
      if (date.hidden) date.removeAttribute('datetime'); else date.dateTime = state.firstFullStarAt;
    }
    return { element: paper, name, date, starImages, ready, update, identity };
  }

  function mount({ element, unit, go, returnUrl, progress, restart }) {
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
    const tasks = make('details', '', 'story-award-tasks'); tasks.append(make('summary', '星星进度'));
    const explanation = make('p', '每组练习一颗星：同一轮中，每题第一次都答对。');
    const list = make('ul'); list.setAttribute('aria-label', '五星任务');
    const items = unit.reward.zones.map(zone => {
      const item = make('li'), text = make('span'), link = make('button', '去挑战', 'btn btn-mini btn-yellow');
      link.type = 'button'; link.addEventListener('click', () => {
        const current = progress?.(zone.id);
        if (current?.completed && !state.zones[zone.id] && !state.pendingZones?.includes(zone.id)) restart?.(zone.id);
        go('learn/' + zone.id);
      });
      item.append(text, link); list.append(item); return { zone, text, link };
    });
    tasks.append(explanation, list); panel.append(paper, controls, status, tasks); element.append(panel);

    function showName() {
      view.identity(recipient, identityLabel);
      save.disabled = exporting || state.stars === 0 || !recipient;
    }
    root.CanranAccessReady?.then(access => {
      recipient = access.preview ? '' : String(access.student.name || '').trim();
      identityLabel = access.preview ? '班级预览' : '登录后显示姓名';
      if (!access.preview) { back.replaceChildren(backIcon,document.createTextNode('我的纪念册')); back.href=new URL('awards/',returnUrl).href; }
      showName();
    }).catch(() => { recipient = ''; showName(); });

    function update(next) {
      state = next; view.update(state);
      slots.forEach((slot, i) => { slot.dataset.earned = String(i < state.stars); });
      items.forEach(({ zone, text, link }) => {
        const current = progress?.(zone.id);
        const [status, action] = state.zones[zone.id] ? ['已获星', '查看']
          : state.pendingZones?.includes(zone.id) ? ['待同步', '查看']
          : current?.completed ? ['已完成 · 未获星', '再练一轮']
          : current?.started ? ['进行中', '继续']
          : current ? ['未开始', '开始'] : ['待挑战', '去挑战'];
        text.textContent = zone.title + ' · ' + status; link.textContent = action;
      });
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

  core.storyCertificate = { mount, card };
})(globalThis);
