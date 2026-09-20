(function (root) {
  'use strict';
  const core = root.CanranCore;
  const defaultCopy = {
    title: '晚餐采购小达人',
    course: '晚餐采购大冒险 · Lesson 49–50',
    completion: '完成 Lesson 49–50 单元练习',
    thanks: '谢谢你，晚餐准备好啦！',
    reward: '15 颗星 · 五关完成'
  };
  const defaultBadges = [
    { title: '采购准备', icon: 'audio', color: '#FFF0BC' },
    { title: '肉店小剧场', icon: 'book', color: '#FBE2CD' },
    { title: '帮忙买晚餐', icon: 'give', color: '#E1EDD5' },
    { title: '表达训练场', icon: 'cards', color: '#DFEAF1' },
    { title: '晚餐准备好了', icon: 'star', color: '#F8DCD4' }
  ];
  const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag);
    element.className = className; element.textContent = text;
    return element;
  };
  const icon = core.lesson49Icons.create;
  const button = (text, action, className = 'btn btn-green') => {
    const element = node('button', text, className); element.type = 'button';
    element.addEventListener('click', action); return element;
  };
  const displayDate = value => new Date(value).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

  function mount({ element, initialName, initialIssuedAt, canClaim, onClaim, design = {} }) {
    const copy = { ...defaultCopy, ...design.copy };
    const badges = design.badges || defaultBadges;
    const characters = design.characters || ['butcher', 'bird'];
    const characterLabels = design.characterLabels || ['肉店老板', '伯德夫人'];
    const drawIcon = design.icon || icon;
    const defaultName = design.defaultName || '采购小学徒';
    let issuedAt = typeof initialIssuedAt === 'string' && Number.isFinite(Date.parse(initialIssuedAt)) ? initialIssuedAt : null;
    let exportTicket = 0, downloadUrl = null;
    const panel = node('div', '', 'unit-certificate');
    const greeting = node('div', '', 'certificate-greeting');
    greeting.append(icon('star'), node('p', '', 'certificate-ready-copy'));
    const status = greeting.querySelector('p');
    const track = node('ol', '', 'certificate-track'); track.setAttribute('aria-label', '五关进度');
    const trackItems = badges.map(badge => {
      const item = node('li'); item.append(icon(badge.icon), node('span', badge.title));
      track.append(item); return item;
    });
    const nameLabel = node('label', '证书上的名字', 'certificate-name-label'); nameLabel.htmlFor = 'unitCertificateInput';
    const name = node('input'); name.id = 'unitCertificateInput'; name.placeholder = '你的名字';
    name.maxLength = 20; name.autocomplete = 'given-name';
    name.value = typeof initialName === 'string' ? initialName.slice(0, 20) : '';
    const resume = button('继续任务', () => {}, 'btn btn-yellow');
    const claim = button('领取单元证书', () => {
      if (!canClaim()) return;
      issuedAt ||= new Date().toISOString();
      const recipient = name.value.trim();
      nameOut.textContent = recipient || defaultName;
      nameOut.classList.toggle('is-long', Array.from(nameOut.textContent).length > 10);
      dateOut.textContent = '领取于 ' + displayDate(issuedAt);
      onClaim({ name: recipient, issuedAt });
      saveStatus.textContent = ''; dialog.showModal();
    });
    claim.disabled = true;
    const panelActions = node('div', '', 'unit-certificate-actions'); panelActions.append(resume, claim);
    panel.append(greeting, track, nameLabel, name, panelActions); element.append(panel);

    const dialog = node('dialog', '', 'unit-dialog certificate-dialog'); dialog.id = 'certificateDialog';
    dialog.setAttribute('aria-labelledby', 'certificateTitle');
    const header = node('div', '', 'unit-dialog-heading');
    const title = node('h2', design.dialogTitle || '采购纪念'); title.id = 'certificateTitle';
    header.append(title, button('关闭', () => dialog.close(), 'workspace-back'));
    const paper = node('article', '', 'certificate-paper'); paper.setAttribute('aria-label', '我的冒险纪念证书');
    const stars = node('div', '', 'certificate-crown'); stars.setAttribute('aria-hidden', 'true');
    stars.append(icon('star'), icon('star'), icon('star'));
    paper.append(node('p', copy.course, 'certificate-course'), stars, node('h3', copy.title, 'certificate-award'));
    const heroes = node('div', '', 'certificate-heroes');
    const recipient = node('div', '', 'certificate-recipient');
    const nameOut = node('p', '', 'certificate-recipient-name'); nameOut.id = 'certificateName';
    recipient.append(node('span', '送给', 'certificate-to'), nameOut);
    heroes.append(drawIcon(characters[0], characterLabels[0]), recipient, drawIcon(characters[1], characterLabels[1]));
    paper.append(heroes, node('p', copy.completion, 'certificate-completion'), node('p', copy.thanks, 'certificate-thanks'));
    const stamps = node('ol', '', 'certificate-badges'); stamps.setAttribute('aria-label', '我的五关徽章');
    badges.forEach(badge => {
      const stamp = node('li', '', 'certificate-badge'); stamp.style.setProperty('--badge-color', badge.color);
      const art = node('span', '', 'certificate-badge-art'); art.append(icon(badge.icon));
      stamp.append(art, node('span', badge.title)); stamps.append(stamp);
    });
    const foot = node('footer', '', 'certificate-foot');
    const reward = node('p', copy.reward, 'certificate-reward');
    const dateOut = node('p', '', 'certificate-date'); dateOut.id = 'certificateDate';
    foot.append(reward, dateOut); paper.append(stamps, foot);
    const actions = node('div', '', 'unit-certificate-actions certificate-export-actions');
    const save = button('保存图片', saveCertificate);
    const print = button('打印证书', () => { if (canClaim()) root.print(); }, 'btn btn-yellow');
    save.prepend(icon('cards')); print.prepend(icon('book')); actions.append(save, print);
    const saveStatus = node('p', '', 'certificate-save-status'); saveStatus.id = 'certificateSaveStatus'; saveStatus.setAttribute('role', 'status');
    const exportArea = node('div', '', 'certificate-export-area'); exportArea.append(actions, saveStatus);
    dialog.append(header, paper, exportArea); document.body.append(dialog);

    function discardDownload() {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
    }
    dialog.addEventListener('close', () => { exportTicket++; discardDownload(); save.disabled = false; });
    root.addEventListener('pagehide', () => { exportTicket++; discardDownload(); });

    async function saveCertificate() {
      if (!canClaim() || save.disabled) return;
      const ticket = ++exportTicket;
      save.disabled = true; saveStatus.textContent = '正在制作你的纪念图片…';
      try {
        await document.fonts.ready;
        // Use the same characters, badge labels, colours and personal details as
        // the visible certificate; never fall back to the old text-only export.
        const images = new Map();
        await Promise.all([...paper.querySelectorAll('img')].map(async image => {
          await image.decode(); images.set(image.getAttribute('src').split('/').pop().replace('.svg', ''), image);
        }));
        const paperStyle = root.getComputedStyle(paper);
        const theme = {
          page: root.getComputedStyle(document.body).backgroundColor,
          paper: paperStyle.backgroundColor,
          band: root.getComputedStyle(paper, '::before').backgroundColor,
          accent: root.getComputedStyle(paper.querySelector('.certificate-award')).color,
          edge: paperStyle.getPropertyValue('--certificate-edge').trim() || '#DDBB87'
        };
        const canvas = drawCertificate({ name: nameOut.textContent, date: dateOut.textContent, images, copy, badges, characters, theme });
        const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('No image')), 'image/png'));
        if (ticket !== exportTicket || !dialog.open || !canClaim()) return;
        discardDownload(); downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.download = design.fileName || 'Lesson49-50-采购纪念.png'; link.href = downloadUrl; link.click();
        saveStatus.textContent = '纪念图片已保存，快给家人看看吧！';
      } catch {
        if (ticket === exportTicket) saveStatus.textContent = '图片暂时没有生成，请重试，或使用打印证书。';
      } finally {
        if (ticket === exportTicket) save.disabled = false;
      }
    }

    return {
      update({ complete, completedChapters, next }) {
        claim.disabled = !complete;
        panel.classList.toggle('is-ready', complete);
        status.textContent = complete ? '五关完成，轮到你领奖啦！' : '集齐五关徽章，领取你的冒险纪念。';
        trackItems.forEach((item, index) => {
          const earned = completedChapters[index];
          item.classList.toggle('is-earned', earned);
          item.setAttribute('aria-label', badges[index].title + (earned ? '：已完成' : '：未完成'));
        });
        resume.hidden = !next;
        if (next) { resume.textContent = '继续：' + next.title; resume.onclick = next.go; }
      }
    };
  }

  function drawCertificate({ name, date, images, copy, badges, characters, theme }) {
    const canvas = document.createElement('canvas'); canvas.width = 1440; canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    const brown = '#4A3226', paper = theme.paper, gold = '#F4A72C';
    function box(x, y, width, height, radius, fill, stroke = '', lineWidth = 3) {
      ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); ctx.fillStyle = fill; ctx.fill();
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
    }
    function text(value, x, y, size, color = brown, playful = false, maxWidth = 1300) {
      const family = playful ? '"ZCOOL KuaiLe", sans-serif' : '"Baloo 2", sans-serif';
      do { ctx.font = `${playful ? '400' : '700'} ${size}px ${family}`; size--; } while (ctx.measureText(value).width > maxWidth && size > 18);
      ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(value, x, y);
    }
    function art(id, x, y, width, height = width) {
      const image = images.get(id), scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
      ctx.drawImage(image, x + (width - w) / 2, y + (height - h) / 2, w, h);
    }
    ctx.fillStyle = theme.page; ctx.fillRect(0, 0, 1440, 1100);
    box(24, 24, 1392, 1052, 34, paper, brown, 6);
    box(44, 44, 1352, 1012, 22, paper, theme.edge, 2);
    box(27, 27, 1386, 40, [30, 30, 0, 0], theme.band);
    text(copy.course, 720, 112, 30, '#795F4B');
    art('star', 615, 172, 48); art('star', 682, 150, 76); art('star', 777, 172, 48);
    text(copy.title, 720, 286, 84, theme.accent, true);
    art(characters[0], 125, 354, 205, 238); art(characters[1], 1110, 354, 205, 238);
    text('送给', 720, 374, 30, '#795F4B');
    text(name, 720, 449, 92, brown, true, 740);
    box(453, 504, 534, 8, 4, gold);
    text(copy.completion, 720, 565, 34);
    text(copy.thanks, 720, 627, 38, '#4C753B', true);
    badges.forEach((badge, index) => {
      const x = 100 + index * 250;
      box(x, 704, 240, 206, 24, badge.color, '#D3B697', 2);
      art(badge.icon, x + 72, 733, 96);
      text(badge.title, x + 120, 866, 30, brown, true, 214);
    });
    box(471, 948, 498, 58, 29, '#E1EDD5'); text(copy.reward, 720, 978, 32, '#426B32');
    text(date, 720, 1030, 25, '#795F4B');
    return canvas;
  }
  core.unitCertificate = { mount };
})(globalThis);
