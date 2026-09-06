(function attach(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) (root.CanranCore ||= {}).learningJourney = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const lessonLabel = ids => `Lesson ${ids.length > 2 ? ids[0] + '–' + ids.at(-1) : ids.join(' & ')}`;

  // This presentation model only reads the runtime's evidence. Opening a
  // preview, changing tabs or greeting the cat never awards course progress.
  function describe(unit, view) {
    const states = new Map(view.nodes.map(node => [node.id, node]));
    const currentId = view.nodes.find(node => !node.done)?.id || null;
    return {
      currentId,
      heard: unit.dialogueRefs.filter(ref => view.record.sourceContacts[ref]?.modes.some(mode => mode === 'heard' || mode === 'heard-in-reference')).length,
      practiced: Object.keys(view.record.results).length,
      nodes: unit.nodes.map((node, index) => ({ ...node, ...states.get(node.id), index, current: currentId === node.id,
        started: node.activityIds.some(id => view.record.completed[id] || view.record.teachingProgress?.[id]?.length || Object.keys(view.record.storyProgress?.[id]?.beats || {}).length || view.record.attempts[unit.activities[id].resultId])
      })),
      chapters: unit.chapters.map(chapter => ({ ...chapter, total: unit.nodes.filter(node => node.chapterId === chapter.id).length, done: unit.nodes.filter(node => node.chapterId === chapter.id && states.get(node.id)?.done).length }))
    };
  }

  function render(unit, view) {
    const j = unit.journey, c = j.copy, model = describe(unit, view);
    const range = `${unit.lessonIds[0]}–${unit.lessonIds.at(-1)}`;
    const tab = ['review', 'progress'].includes(view.journeyUI?.tab) ? view.journeyUI.tab : 'path';
    const selected = view.journeyUI?.selectedNodeId;
    const icon = (name, tone = '') => `<img class="journey-icon ${tone}" src="${escape(j.icons[name])}" alt="" width="32" height="32">`;
    const action = (type, label, { id = '', css = '', disabled = false, symbol = '', aria = '' } = {}) => `<button type="button" data-action="${type}"${id ? ` data-id="${escape(id)}"` : ''} class="journey-button ${css}"${disabled ? ' disabled' : ''}${aria ? ` aria-label="${escape(aria)}"` : ''}>${symbol ? icon(symbol) : ''}${label ? `<span>${escape(label)}</span>` : ''}</button>`;
    const navigation = `<nav class="journey-nav" aria-label="学习导航"><div class="journey-wordmark">${icon('cat', 'tone-mint')}<strong>${escape(unit.brandTitle)}</strong><small>猫猫小镇</small></div>${[['path','house','orange'],['review','arrows-clockwise','gold'],['book','book-open','blue'],['progress','chart-bar','pink']].map(([id, symbol, tone]) => `<button type="button" class="journey-nav-item${id === tab ? ' is-active' : ''}" data-action="journey-nav" data-id="${id}"${id === tab ? ' aria-current="page"' : ''}>${icon(symbol, 'tone-'+tone)}<span>${escape(c[id])}</span>${id === 'review' && view.dueCount ? '<i class="journey-nav-dot" aria-label="有待复习内容"></i>' : ''}</button>`).join('')}<p class="journey-nav-footer">听懂一句，用好一句。</p></nav>`;
    const stats = `<header class="journey-stats"><span class="journey-stat" aria-label="新概念英语第 ${unit.lessonIds[0]} 至 ${unit.lessonIds.at(-1)} 课">${icon('book-open','tone-blue')}<b>${escape(range)}</b></span><span class="journey-stat tone-gold" aria-label="已完成 ${view.completedCount} 关，共 ${unit.nodes.length} 关">${icon('star','tone-gold')}<b>${view.completedCount}<small> / ${unit.nodes.length}</small></b></span><button type="button" class="journey-stat tone-pink" data-action="journey-nav" data-id="review" aria-label="${view.dueCount} 条待复习线索">${icon('arrows-clockwise','tone-pink')}<b>${view.dueCount}</b></button></header>`;
    function preview(node) {
      const challenge = unit.challenges?.find(item=>item.nodeIds.includes(node.id));
      const label = node.done ? c.repeat : node.available ? node.started ? c.resume : c.start : `${c.first} ${node.index} ${c.level}`;
      return `<section class="journey-preview${node.available ? '' : ' is-locked'}" id="journey-preview-${node.id}" aria-label="${escape(node.title)}关卡介绍"><div class="journey-preview-heading"><span>${escape(lessonLabel(node.lessonIds))} · ${escape(j.nodeLabels[node.id])}</span>${action('journey-close','',{css:'journey-close',symbol:'x',aria:c.close})}</div><h2>${escape(node.title)}</h2>${action('open-node', label, { id: node.id, disabled: !node.available, css: 'journey-primary', symbol: node.available ? 'play' : 'lock-simple' })}${challenge && node.done ? action('open-challenge','输入挑战 · 选做',{id:challenge.id,css:'journey-outline journey-challenge-entry'}) : ''}</section>`;
    }
    function nodeMarkup(node, companion = '') {
      const state = node.done ? 'done' : node.current ? 'current' : 'locked';
      const offsets = [0, 48, 72, 48, 0, -48, -72, -48];
      const x = offsets[node.index % offsets.length];
      const status = node.done ? c.completed : node.available ? node.started ? c.resume : c.start : c.locked;
      const hint = node.current && !selected ? action('preview-node', node.started ? c.resume : c.start, { id: node.id, css: 'journey-start-hint' }) : '';
      const surface = `<img class="journey-coin" src="${escape(node.done ? j.assets.gold : j.assets.orange)}" alt="" width="92" height="86">${icon(j.nodeIcons[node.id], 'journey-node-symbol')}`;
      return `<li class="journey-step is-${state}${selected === node.id ? ' is-selected' : ''}${companion ? ' has-companion' : ''}" style="--node-x:${x}px" data-journey-node="${node.id}"${selected && selected !== node.id ? ' inert' : ''}>${hint}<button type="button" data-action="preview-node" data-id="${node.id}" class="journey-node" aria-label="第 ${node.index + 1} 关 ${escape(node.title)}，${escape(lessonLabel(node.lessonIds))}，${escape(j.nodeLabels[node.id])}，${status}" aria-expanded="${selected === node.id}"${selected === node.id ? ` aria-controls="journey-preview-${node.id}"` : ''}${node.current ? ' aria-current="step" data-journey-current' : ''}>${node.current ? `<span class="journey-ring" aria-hidden="true"></span>` : ''}${surface}${node.done ? `<span class="journey-done-badge">${icon('check')}</span>` : ''}</button>${selected === node.id ? preview(node) : ''}${companion}</li>`;
    }
    function route() {
      return `${unit.chapters.length > 3 ? `<details class="journey-lesson-index"><summary>课程目录 · Lesson ${escape(range)}</summary><nav aria-label="选择 Lesson 分区">${unit.chapters.map(ch => `<a href="#chapter-${escape(ch.id)}">${escape(lessonLabel(ch.lessonIds))}<span>${escape(ch.title)}</span></a>`).join('')}</nav></details>` : ''}${model.chapters.map((chapter, index) => {
        const nodes = model.nodes.filter(node => node.chapterId === chapter.id);
        const active = nodes.some(node => node.current), completed = chapter.done === chapter.total;
        const companionNode = active ? nodes.find(node => node.current) : completed ? nodes.at(-1) : null;
        const right = companionNode && [0,1,2,3,4].includes(companionNode.index % 8);
        const companion = companionNode ? `<div class="journey-companion ${right ? 'on-left' : 'on-right'}"><button type="button" data-action="journey-greet" class="journey-mascot" aria-label="${escape(c.greet)}"><img src="${escape(j.assets.cat)}" alt="挥手的探险猫" width="148" height="222" decoding="async"></button><span class="journey-greeting" role="status" hidden>${escape(completed ? c.doneHello : c.hello)}</span><div class="journey-chapter-stars" aria-label="本主题已完成 ${chapter.done} 关，共 ${chapter.total} 关">${nodes.map(node => icon('star',node.done ? 'tone-gold' : 'tone-locked')).join('')}</div></div>` : '';
        return `<section id="chapter-${escape(chapter.id)}" class="journey-chapter${active ? ' is-active' : ''}" aria-label="${escape(lessonLabel(chapter.lessonIds))} ${escape(chapter.title)}"><header class="journey-chapter-banner"><div><p class="journey-lesson-label">${escape(lessonLabel(chapter.lessonIds))}</p><h1${active || !model.currentId && index === 0 ? ' tabindex="-1" data-lesson-title' : ''}>${escape(chapter.title)}</h1></div>${action('journey-book','',{id:String(chapter.lessonIds[0]),css:'journey-book-button',symbol:'notebook',aria:c.bookLabel})}</header><div class="journey-trail"><ol class="journey-nodes" aria-label="${escape(chapter.title)}的关卡">${nodes.map(node => nodeMarkup(node, node.id === companionNode?.id ? companion : '')).join('')}</ol></div></section>`;
      }).join('')}<div class="journey-finish">${icon('trophy',view.completedCount === unit.nodes.length ? 'tone-gold' : 'tone-locked')}<p>${escape(view.completedCount === unit.nodes.length ? c.allDone : c.footer)}</p></div>${model.currentId ? action('journey-locate','',{css:'journey-locate',symbol:'arrow-up',aria:c.current}) : ''}`;
    }
    function challengeList() {
      return `<h2 class="journey-section-title">输入挑战 · 选做</h2><div class="journey-replay-list">${(unit.challenges || []).map(challenge => {
        const unlocked = model.nodes.find(node=>node.id===challenge.unlockNodeId)?.done;
        const progress = view.record.challenges?.[challenge.id];
        const label = unlocked ? `${challenge.title} · ${progress?.completedAt ? '已完成' : progress?.answers.length ? '继续' : '开始'}` : `${challenge.lessonLabel} · 完成第 ${unit.nodes.findIndex(n=>n.id===challenge.unlockNodeId)+1} 关后解锁`;
        return action('open-challenge',label,{id:challenge.id,disabled:!unlocked,css:'journey-replay',symbol:'trophy'});
      }).join('')}</div>`;
    }
    function reviews() {
      const done = model.nodes.filter(node => node.done);
      const message = view.dueCount ? `${view.dueCount} ${c.reviewReady}` : view.completedCount ? c.reviewEmpty : c.reviewNew;
      return `<section class="journey-panel"><p class="journey-eyebrow">${escape(c.review)}</p><h1 tabindex="-1" data-lesson-title>${escape(c.reviewTitle)}</h1><p class="journey-panel-intro">${escape(c.reviewSubtitle)}</p><div class="journey-review-feature">${icon('arrows-clockwise','tone-gold')}<h2>${escape(message)}</h2><p>${escape(c.reviewHint)}</p>${view.dueCount ? action('review',unit.copy.reviewStart,{css:'journey-primary'}) : action('journey-nav',c.backToPath,{id:'path',css:'journey-outline'})}</div>${challengeList()}<h2 class="journey-section-title">${escape(c.replayTitle)}</h2>${done.length ? `<div class="journey-replay-list">${done.map(node => action('open-node',node.title,{id:node.id,css:'journey-replay',symbol:j.nodeIcons[node.id],aria:node.title+'，再练一次'})).join('')}</div>` : `<p class="journey-empty">${escape(c.replayEmpty)}</p>`}</section>`;
    }
    function progress() {
      return `<section class="journey-panel"><p class="journey-eyebrow">${escape(c.progress)}</p><h1 tabindex="-1" data-lesson-title>${escape(c.progressTitle)}</h1><p class="journey-panel-intro">${escape(c.progressSubtitle)}</p><div class="journey-metrics">${[['star','gold',view.completedCount+' / '+unit.nodes.length,c.completedLabel],['headphones','blue',model.heard+' / '+unit.dialogueRefs.length,c.heardLabel],['check','mint',model.practiced,c.practiceLabel],['arrows-clockwise','pink',view.dueCount,c.dueLabel]].map(([symbol,tone,value,label]) => `<div>${icon(symbol,'tone-'+tone)}<strong>${value}</strong><span>${escape(label)}</span></div>`).join('')}</div><h2 class="journey-section-title">${escape(c.chapterLabel)}</h2><div class="journey-chapter-records">${model.chapters.map(chapter => `<div><span>${escape(chapter.title)}</span><b>${chapter.done} / ${chapter.total}</b><progress max="${chapter.total}" value="${chapter.done}" aria-label="${escape(chapter.title)}完成进度"></progress></div>`).join('')}</div>${view.completedCount ? '' : `<p class="journey-empty">${escape(c.noResults)}</p>`}<section class="journey-reset"><h2>重新开始</h2><p>仅影响这台设备的学习记录。</p>${action('reset-request','重置输入挑战',{id:'challenges',css:'journey-outline'})}${action('reset-request','全部从零开始',{id:'course',css:'journey-outline'})}</section></section>`;
    }
    return `<div class="journey-app" data-journey-tab="${tab}">${navigation}<div class="journey-main">${stats}${view.record.resetBackup ? `<section class="journey-reset-notice" role="status"><p>已重置，可在再次学习前撤销。</p>${action('reset-undo','撤销重置',{css:'journey-outline'})}</section>` : ''}${tab === 'path' ? route() : tab === 'review' ? reviews() : progress()}</div><aside class="journey-desktop-note">${icon('compass','tone-orange')}<h2>猫猫小镇</h2><p>新概念英语 · Lesson ${escape(range)}</p><div><strong>${view.completedCount}</strong><span> / ${unit.nodes.length} 关已完成</span></div><progress value="${view.completedCount}" max="${unit.nodes.length}" aria-label="总关卡进度"></progress><p>和探险猫一起，一步步向前。</p></aside></div>`;
  }
  return Object.freeze({ describe, render });
});
