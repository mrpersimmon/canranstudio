(function (root) {
  'use strict';
  const core = root.CanranCore;
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

  function mount({ element, unit, go, returnUrl }) {
    const artwork = {...assets,scene:unit.reward.scene || assets.scene};
    const lesson = unit.reward.lesson || 'Lesson 1–2';
    let state = { stars: 0, zones: {}, firstFullStarAt: null }, exportUrl, exporting = false;
    let recipient = '', identityLabel = '登录后显示姓名';
    const panel = make('div', '', 'story-award-panel');
    const paper = make('article', '', 'story-award-paper'); paper.setAttribute('aria-label', '我的单元纪念卡');
    const brand = make('p', '灿然英语工作室', 'story-award-brand');
    const title = make('h3', unit.reward.title, 'story-award-title');
    title.style.color = unit.reward.color || '#0b7399';
    const name = make('p', '', 'story-award-name'); name.id = 'certificateName';
    const stars = make('div', '', 'story-award-stars'); stars.setAttribute('role', 'group');
    const starImages = Array.from({ length: 5 }, () => { const img = picture(assets.empty); stars.append(img); return img; });
    const illustration = picture(artwork.scene, unit.reward.alt || '男士把手提包交还给女士'); illustration.className = 'story-award-illustration';
    const foot = make('p', '', 'story-award-foot');
    const date = make('time'); date.id = 'certificateDate';
    foot.append(make('span', lesson), date);
    paper.append(brand, title, name, stars, illustration, foot);
    const controls = make('div', '', 'story-award-actions');
    const save = make('button', '保存纪念卡', 'btn btn-green'); save.type = 'button';
    const downloadIcon = picture('/assets/awards/download.svg'); downloadIcon.className = 'shop-icon'; save.prepend(downloadIcon);
    const back = make('a', '返回课程', 'btn btn-yellow'); back.href = returnUrl;
    const backIcon = picture('/assets/awards/return.svg'); backIcon.className = 'shop-icon'; back.prepend(backIcon); controls.append(save, back);
    const status = make('p', '', 'story-award-status'); status.setAttribute('role', 'status');
    const tasks = make('details', '', 'story-award-tasks'); tasks.append(make('summary', '查看五星任务'));
    const explanation = make('p', '每个答题区整轮零错，点亮一颗星。');
    const list = make('ul'); list.setAttribute('aria-label', '五星任务');
    const items = unit.reward.zones.map(zone => {
      const item = make('li'), text = make('span'), link = make('button', '去挑战', 'btn btn-mini btn-yellow');
      link.type = 'button'; link.addEventListener('click', () => go('learn/' + zone.id));
      item.append(text, link); list.append(item); return { zone, text };
    });
    tasks.append(explanation, list); panel.append(paper, controls, status, tasks); element.append(panel);

    function showName() {
      name.textContent = recipient || identityLabel;
      name.classList.toggle('is-placeholder', !recipient);
      name.style.setProperty('--name-size', Math.min(10, 36 / Math.max(3.6, Array.from(name.textContent).length)) + 'cqw');
      save.disabled = exporting || state.stars === 0 || !recipient;
    }
    root.CanranAccessReady?.then(access => {
      recipient = access.preview ? '' : String(access.student.name || '').trim();
      identityLabel = access.preview ? '班级预览' : '登录后显示姓名';
      if (!access.preview) { back.replaceChildren(backIcon,document.createTextNode('我的纪念册')); back.href=new URL('awards/',returnUrl).href; }
      showName();
    }).catch(() => { recipient = ''; showName(); });

    function update(next) {
      state = next; paper.dataset.stars = String(state.stars);
      stars.setAttribute('aria-label', '已获得 ' + state.stars + ' / 5 颗星');
      starImages.forEach((img, i) => { img.src = i < state.stars ? assets.earned : assets.empty; });
      date.hidden = state.stars !== 5 || !state.firstFullStarAt;
      date.textContent = date.hidden ? '' : dateLabel(state.firstFullStarAt);
      if (date.hidden) date.removeAttribute('datetime'); else date.dateTime = state.firstFullStarAt;
      items.forEach(({ zone, text }) => { text.textContent = zone.title + (state.zones[zone.id] ? ' · 已获星' : state.pendingZones?.includes(zone.id) ? ' · 等待同步' : ' · 待挑战'); });
      showName();
    }

    async function exportCard() {
      if (save.disabled) return;
      exporting = true; showName(); status.textContent = '正在保存…';
      // Capture one immutable snapshot so a sync during export cannot mix dates.
      const snapshot = { recipient, stars: state.stars, date: state.firstFullStarAt };
      try {
        await document.fonts.ready;
        const images = await Promise.all(Object.values(artwork).map(async src => {
          const img = picture(src); await img.decode(); return img;
        }));
        const canvas = draw(snapshot, images, unit.reward.title,lesson,unit.reward.color);
        const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(Error('export')), 'image/png'));
        if (exportUrl) URL.revokeObjectURL(exportUrl);
        exportUrl = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = exportUrl; link.download = lesson.replace(' ','').replace('–','-')+'-'+unit.reward.title+'.png'; link.click();
        status.textContent = '纪念卡已保存。';
      } catch { status.textContent = '暂时没能保存，请再试一次。'; }
      finally { exporting = false; showName(); }
    }
    save.addEventListener('click', exportCard);
    root.addEventListener('pagehide', () => { if (exportUrl) URL.revokeObjectURL(exportUrl); });
    update(state); return { update };
  }

  function draw(snapshot, [scene, texture, earned, empty], title,lesson,color) {
    const canvas = document.createElement('canvas'); canvas.width = 1640; canvas.height = 880;
    const ctx = canvas.getContext('2d');
    ctx.beginPath(); ctx.roundRect(8, 8, 1624, 864, 34); ctx.fillStyle = '#fffdf6'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = ctx.createPattern(texture, 'repeat'); ctx.fillRect(0, 0, 1640, 880);
    const width = 985, height = 815, scale = Math.min(width / scene.naturalWidth, height / scene.naturalHeight);
    ctx.drawImage(scene, 1630 - scene.naturalWidth * scale, 834 - scene.naturalHeight * scale, scene.naturalWidth * scale, scene.naturalHeight * scale);
    ctx.restore(); ctx.strokeStyle = '#4a3226'; ctx.lineWidth = 4; ctx.stroke();
    if (snapshot.stars === 5) {
      ctx.beginPath(); ctx.roundRect(15, 15, 1610, 850, 29); ctx.strokeStyle = '#f4bd55'; ctx.lineWidth = 10; ctx.stroke();
      ctx.beginPath(); ctx.roundRect(23, 23, 1594, 834, 23); ctx.strokeStyle = '#ac741e'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    function text(value, x, y, size, color, family = '"Award Round"', maxWidth = 675, stroke = 0) {
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      do { ctx.font = `700 ${size--}px ${family}, sans-serif`; } while (ctx.measureText(value).width > maxWidth && size > 12);
      ctx.fillStyle = color;
      if (stroke) { ctx.strokeStyle = color; ctx.lineJoin = 'round'; ctx.lineWidth = size * stroke; ctx.strokeText(value, x, y); }
      ctx.fillText(value, x, y);
    }
    text('灿然英语工作室', 91, 116, 36, '#4a3226');
    text(title, 91, 286, 127, color || '#0b7399', '"Award Round"', 680, .03);
    text(snapshot.recipient, 91, 478, 162, '#4a3226', '"Award Round"', 595, .036);
    for (let i = 0; i < 5; i++) ctx.drawImage(i < snapshot.stars ? earned : empty, 85 + i * 126, 593, 101, 101);
    text(lesson + (snapshot.stars === 5 && snapshot.date ? ' · ' + dateLabel(snapshot.date) : ''), 91, 798, 35, '#795a46', '"Baloo 2"');
    return canvas;
  }
  core.storyCertificate = { mount };
})(globalThis);
