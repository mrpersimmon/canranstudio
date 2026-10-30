import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BottomSheet, KeyboardInput, MobileScroll, useKeyboard, useKeyboardInsets, useMobileDevice } from './mobile';
import icons from './icons.json';
import { chapters, keepsakes, collectionLabel, chapterForCard, cardsInChapter, restoreChapterCard, searchKeepsakes, isOutsideDemo, type Keepsake } from './postoffice-model';

type SelectionOrigin = 'card' | 'search' | 'chapter';
type SelectionRequest = { card: Keepsake; origin: SelectionOrigin; sequence: number };

function Icon({ name }: { name: keyof typeof icons }) {
  // Local, unchanged Phosphor exports; never user-provided markup.
  return <span className="post-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] }} />;
}
export default function Prototype() {
  const [selected, setSelected] = useState(keepsakes[0].id);
  const [sheet, setSheet] = useState<'search' | 'card' | 'chapters' | 'scope' | null>(null);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('');
  const [toast, setToast] = useState('');
  const [loaded, setLoaded] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [imageVersions, setImageVersions] = useState<Record<string, number>>({});
  const [remembered, setRemembered] = useState<Record<string, string>>({});
  const [pendingSelection, setPendingSelection] = useState<SelectionRequest | null>(null);
  const [failedSelection, setFailedSelection] = useState<SelectionRequest | null>(null);
  const imageRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const selectionSequence = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const cardTrigger = useRef<HTMLButtonElement>(null);
  const chapterTrigger = useRef<HTMLButtonElement>(null);
  const focusTimer = useRef<number | undefined>(undefined);
  const searchActionPointer = useRef(false);
  const keyboard = useKeyboard();
  const { bottomInset, availableHeight } = useKeyboardInsets();
  const { device } = useMobileDevice();
  // BottomSheet already subtracts up to 180px for the keyboard. Supply a
  // snap that caps its final height at the actual area below the status bar.
  const searchSnap = Math.min(.9, (availableHeight - device.geometry.safeArea.top + Math.min(keyboard.height, 180)) / device.geometry.screen.height);
  const current = keepsakes.find(card => card.id === selected)!;
  const chapter = chapterForCard(selected);
  const chapterCards = cardsInChapter(chapter.id);
  const currentIndex = chapterCards.indexOf(current);
  const results = searchKeepsakes(keepsakes, query);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => () => window.clearTimeout(focusTimer.current), []);
  useEffect(() => {
    if (!pendingSelection) return;
    const job = pendingSelection;
    let cancelled = false;
    let timeout: number | undefined;
    const prepare = async () => {
      try {
        const image = imageRefs.current[job.card.id];
        if (!image) throw new Error('Card image is not mounted');
        await Promise.race([
          image.decode(),
          new Promise<never>((_, reject) => { timeout = window.setTimeout(() => reject(new Error('Card image timeout')), 15000); }),
        ]);
        if (cancelled || job.sequence !== selectionSequence.current) return;
        // The chapter, thumbnails, date and download all derive from this ID.
        // Keep the old selection visible until the new image is decoded.
        setSelected(job.card.id);
        setRemembered(previous => ({ ...previous, [job.card.chapterId]: job.card.id }));
        setPendingSelection(null);
        setFailedSelection(null);
        if (job.origin !== 'card') {
          setSheet(null);
          setToast(job.origin === 'search' ? `已找到 ${job.card.label} · ${job.card.title}` : `已打开 ${chapterForCard(job.card.id).name}`);
          focusTimer.current = window.setTimeout(() => {
            if (job.sequence !== selectionSequence.current) return;
            cardTrigger.current?.focus({ preventScroll: true });
            cardTrigger.current?.closest('.mobile-scroll')?.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          }, 260);
        }
      } catch {
        if (cancelled || job.sequence !== selectionSequence.current) return;
        setFailedSelection(job);
        setPendingSelection(null);
      } finally { window.clearTimeout(timeout); }
    };
    void prepare();
    return () => { cancelled = true; window.clearTimeout(timeout); };
  }, [pendingSelection, imageVersions]);
  function cancelSelection() {
    selectionSequence.current++;
    setPendingSelection(null);
    setFailedSelection(null);
  }
  function open(next: NonNullable<typeof sheet>) {
    window.clearTimeout(focusTimer.current);
    cancelSelection();
    searchActionPointer.current = false;
    keyboard.hide(); setSheet(next);
  }
  function close() {
    window.clearTimeout(focusTimer.current);
    cancelSelection();
    searchActionPointer.current = false;
    keyboard.hide(); const previous = sheet; setSheet(null);
    focusTimer.current = window.setTimeout(() => {
      const trigger = previous === 'search' ? searchTrigger : previous === 'chapters' ? chapterTrigger : cardTrigger;
      trigger.current?.focus({ preventScroll: true });
    }, 260);
  }
  function choose(card: Keepsake, origin: SelectionOrigin = 'card') {
    window.clearTimeout(focusTimer.current);
    keyboard.hide();
    setToast('');
    setFailedSelection(null);
    setPendingSelection({ card, origin, sequence: ++selectionSequence.current });
  }
  function chooseChapter(id: string) {
    const card = restoreChapterCard(id, remembered[id]);
    if (card) choose(card, 'chapter');
  }
  function retryCard(card = current, origin: SelectionOrigin = 'card') {
    setFailed(ids => ids.filter(id => id !== card.id));
    setImageVersions(previous => ({ ...previous, [card.id]: (previous[card.id] ?? 0) + 1 }));
    choose(card, origin);
  }
  async function markLoaded(id: string, image: HTMLImageElement) {
    try {
      await image.decode();
      if (imageRefs.current[id] !== image) return;
      setLoaded(ids => ids.includes(id) ? ids : [...ids, id]);
    } catch { setFailed(ids => ids.includes(id) ? ids : [...ids, id]); }
  }
  function selectionNotice() {
    if (pendingSelection) return <p className="selection-notice" role="status">正在准备 {pendingSelection.card.label}…</p>;
    if (failedSelection) return <div className="selection-notice" role="status"><p>这张纪念暂时无法打开，当前卡片已保留。</p><button className="secondary-action" onClick={() => retryCard(failedSelection.card, failedSelection.origin)}>重新加载 {failedSelection.card.label}</button></div>;
    return null;
  }
  function hideSearchKeyboardAfterFocus() {
    // A button receives focus on pointerdown. Moving the sheet before
    // pointerup can make the browser drop its click. Let that action finish.
    window.setTimeout(() => {
      if (!searchActionPointer.current && document.activeElement !== inputRef.current) keyboard.hide();
    }, 0);
  }
  return <div className="postoffice-app" style={{ '--post-safe-top': `${device.geometry.safeArea.top}px` } as CSSProperties}>
    <MobileScroll className="postoffice-scroll">
      <main className="postoffice-content">
        <section className="postoffice-scene" aria-label="时光邮局柜台">
          <img className="scene-art" src="/art/postoffice-scene-v3.png" alt="阳光照进小镇邮局，木柜台上放着一封展开的信" draggable="false" fetchPriority="high" />
          <header className="postoffice-heading">
            <div className="postoffice-brand"><img src="/art/starflower.png" alt="" /><span>灿然英语工作室</span></div>
            <div className="postoffice-title-row"><h1>我的纪念册</h1><button ref={searchTrigger} className="search-trigger" onClick={() => open('search')} aria-label="搜索 Lesson 或纪念卡名称" title="搜索 Lesson 或纪念卡" aria-haspopup="dialog" aria-expanded={sheet === 'search'}><Icon name="MagnifyingGlass" /></button></div>
            <p className="chapter-label">{chapter.name}<span>·</span>{chapter.label}</p>
          </header>
          <button ref={cardTrigger} className="hero-card" onClick={() => open('card')} aria-label={`查看并保存纪念卡：${current.label} ${current.title}`} title="点击卡片查看并保存" aria-haspopup="dialog" aria-expanded={sheet === 'card'} disabled={!loaded.includes(selected)}>
            {keepsakes.map(card => <img key={`${card.id}-${imageVersions[card.id] ?? 0}`} ref={image => { imageRefs.current[card.id] = image; }} className={card.id === selected ? 'is-selected' : ''} src={card.image} width="984" height="528" alt={card.id === selected ? `${card.title}，预览同学，五星，${card.firstFullStarAt}` : ''} aria-hidden={card.id !== selected} draggable="false"
              onLoad={event => { void markLoaded(card.id, event.currentTarget); }} onError={() => setFailed(ids => ids.includes(card.id) ? ids : [...ids, card.id])} />)}
          </button>
          {!loaded.includes(selected) && <div className="card-load-state" role="status">{failed.includes(selected) ? <><p>这张纪念还没送到</p><button onClick={() => retryCard()}>重新载入</button></> : '正在打开纪念卡…'}</div>}
          <span className="postoffice-selection-status" role="status">已选 {current.label}，{current.title}，第 {currentIndex + 1} 张，共 {chapterCards.length} 张</span>
        </section>
        <section className="chapter-keepsakes" aria-label="本章的三张纪念卡">
          <h2>这一章的三张纪念</h2>
          <div className="card-options" role="group" aria-label="选择纪念卡">
            {chapterCards.map(card => <button key={card.id} aria-label={`选择 ${card.label} ${card.title}`} aria-pressed={card.id === selected} className="card-option" onClick={() => choose(card)}><span className="thumbnail"><img src={card.image} alt="" width="984" height="528" draggable="false" /></span><span className="thumbnail-label">{card.label}</span></button>)}
          </div>
          {!sheet && selectionNotice()}
          <button ref={chapterTrigger} className="chapters-action" onClick={() => open('chapters')}><Icon name="BookOpen" /><span>章节信箱</span><small>{chapters.length} 封信 · {keepsakes.length} 张纪念</small><Icon name="CaretRight" /></button>
          <p className="demo-note">{collectionLabel} 体验版 · 演示收藏</p>
        </section>
      </main>
    </MobileScroll>
    <nav className="postoffice-nav" aria-label="主要导航" style={{ paddingBottom: bottomInset }}>
      <button onClick={() => { setScope('课程'); open('scope'); }}><Icon name="House" /><span>课程</span></button>
      <button aria-current="page" onClick={() => { if (sheet) close(); }}><Icon name="BookOpen" /><span>纪念册</span></button>
      <button onClick={() => { setScope('我的'); open('scope'); }}><Icon name="User" /><span>我的</span></button>
    </nav>
    {toast && <div className="postoffice-toast" role="status" style={{ bottom: bottomInset + 80 }}><Icon name="Check" />{toast}</div>}
    <BottomSheet open={sheet === 'search'} onOpenChange={value => { if (!value) close(); }} title="找一张纪念" description="按 Lesson 或卡名，找到旅程中的小小成就。" snap={searchSnap}>
      <div className="postoffice-sheet search-sheet"
        onPointerDownCapture={event => { searchActionPointer.current = event.target instanceof Element && !!event.target.closest('button, a'); }}
        onPointerUpCapture={() => { searchActionPointer.current = false; hideSearchKeyboardAfterFocus(); }}
        onPointerCancelCapture={() => { searchActionPointer.current = false; hideSearchKeyboardAfterFocus(); }}>
        <div className="sheet-toolbar"><span>{collectionLabel} · {keepsakes.length} 张纪念</span><button className="icon-button" onClick={close} aria-label="关闭搜索"><Icon name="X" /></button></div>
        <form onSubmit={event => { event.preventDefault(); if (results.length === 1) choose(results[0], 'search'); else keyboard.hide(); }}>
          <div className="search-field"><Icon name="MagnifyingGlass" /><KeyboardInput ref={inputRef} type="search" value={query} onChange={event => { cancelSelection(); setQuery(event.target.value); }} onBlur={hideSearchKeyboardAfterFocus} aria-label="搜索 Lesson 或卡名" placeholder="如 Lesson 8、9–10、问候" enterKeyHint="search" autoComplete="off" />{query && <button type="button" className="icon-button" aria-label="清空搜索" onClick={() => { cancelSelection(); setQuery(''); inputRef.current?.focus({ preventScroll: true }); }}><Icon name="X" /></button>}</div>
        </form>
        <p className="results-count" aria-live="polite">{query ? `找到 ${results.length} 张纪念卡` : '全部章节的纪念'}</p>
        {selectionNotice()}
        <div className="search-results">
          {results.map(card => <button className="search-result" key={card.id} onClick={() => choose(card, 'search')}><img src={card.image} alt="" /><span><small>{card.label}</small><strong>{card.title}</strong><span className="result-caption">{chapterForCard(card.id).name} · 已珍藏</span></span><Icon name="CaretRight" /></button>)}
          {!results.length && <div className="empty-state"><Icon name="MagnifyingGlass" /><h3>{isOutsideDemo(query) ? '这一段旅程还未放入演示' : '还没找到这张纪念'}</h3><p>{isOutsideDemo(query) ? `当前体验 ${collectionLabel}。完整版本将在全部已授权收藏中搜索。` : '试试课号「8」、范围「9–10」，或卡名「问候」。'}</p><button className="secondary-action" onClick={() => { cancelSelection(); setQuery(''); keyboard.hide(); }}>查看全部纪念</button></div>}
        </div>
      </div>
    </BottomSheet>
    <BottomSheet open={sheet === 'card'} onOpenChange={value => { if (!value) close(); }} title={current.title} description={`${current.label} · ${chapter.name}`} snap={0.88}>
      <div className="postoffice-sheet card-sheet">
        <div className="sheet-toolbar"><span>珍藏于 {current.firstFullStarAt}</span><button className="icon-button" onClick={close} aria-label="收起原卡"><Icon name="X" /></button></div>
        <div className="card-preview"><img src={current.image} width="984" height="528" alt={`${current.label} ${current.title} 原纪念卡`} /></div>
        <div className="card-paging"><button className="icon-button" aria-label="上一张纪念卡" disabled={currentIndex === 0} onClick={() => choose(chapterCards[currentIndex - 1])}><Icon name="CaretLeft" /></button><span>{currentIndex + 1} / {chapterCards.length}</span><button className="icon-button" aria-label="下一张纪念卡" disabled={currentIndex === chapterCards.length - 1} onClick={() => choose(chapterCards[currentIndex + 1])}><Icon name="CaretRight" /></button></div>
        {selectionNotice()}
        <a className="primary-action" href={current.image} download={`${current.label}-${current.title}-预览同学.gif`} onClick={() => setToast('已开始下载，可在浏览器下载中查看')}><Icon name="DownloadSimple" /><span>保存原卡动图</span></a>
        <p className="save-hint">保留原有姓名、星光和纪念日期。</p>
      </div>
    </BottomSheet>
    <BottomSheet open={sheet === 'chapters'} onOpenChange={value => { if (!value) close(); }} title="章节信箱" description="每六课一封信，收好三张旅程纪念。" snap={0.75}>
      <div className="postoffice-sheet"><div className="sheet-toolbar"><span>{chapters.length} 封信 · {keepsakes.length} 张纪念</span><button className="icon-button" onClick={close} aria-label="关闭章节信箱"><Icon name="X" /></button></div>
        <div className="chapter-list">{chapters.map(item => <button key={item.id} className="chapter-result" aria-pressed={item.id === chapter.id} onClick={() => chooseChapter(item.id)}><img src={cardsInChapter(item.id)[0].image} alt="" /><span><small>{item.letter} · {item.label}</small><strong>{item.name}</strong><span>{item.cardIds.length} / {item.cardIds.length} 张已珍藏</span></span><Icon name={item.id === chapter.id ? 'Check' : 'CaretRight'} /></button>)}</div>
        {selectionNotice()}
        <p className="scope-note">完整版本将按 24 章收纳 72 个单元。当前可体验 {collectionLabel} 的两封信，其余章节尚未接入。</p>
      </div>
    </BottomSheet>
    <BottomSheet open={sheet === 'scope'} onOpenChange={value => { if (!value) close(); }} title={scope === '我的' ? '预览同学' : '我的课程'} description={`时光邮局 · ${collectionLabel} 体验版`} snap={0.5}>
      <div className="postoffice-sheet scope-panel"><p>{scope === '我的' ? '这里使用演示收藏。正式接入后沿用现有账号和“我的”页面。' : '这次可以体验纪念卡搜索、切换、查看与保存。学习旅程仍保留在原课程页面。'}</p><button className="primary-action" onClick={close}>回到纪念册</button></div>
    </BottomSheet>
  </div>;
}
