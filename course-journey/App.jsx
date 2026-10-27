import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {ArrowRight,ArrowLeft,BookOpen,CaretDown,House,MagnifyingGlass,MapPin,SquaresFour,Star,User,X,ArrowClockwise,SignOut,Key} from '@phosphor-icons/react';
import model from './model';
import {useMapLayout} from './use-map-layout';
import artwork from './chapter-layout';
import {Landmark,CompletionMedal} from './Landmark';
import {ModuleJourney} from './ModuleJourney';
import routeWorlds from './route-worlds';
import {recordArtReady,completionCandidates} from './module-readiness';
import {takeNewCompletions} from './completion-notice';
import './effects.css';

const iconProps={size:22,weight:'regular','aria-hidden':true};
function Stars({course,base,small=false,animate=true}){
  const [unavailable,setUnavailable]=useState(false);
  const count=Math.max(0,Math.min(course.maxStars||5,course.stars||0)),max=course.maxStars||5;
  return <span className={'journey-stars'+(small?' is-small':'')} data-animate={animate} role="img" aria-label={`${count} / ${max} 颗星`}>
    {Array.from({length:max},(_,i)=><span className="journey-star" data-earned={i<count} style={{'--star-order':i}} key={i} aria-hidden="true">
      {unavailable?<Star size={23} weight={i<count?'fill':'regular'}/>:<img src={base+'assets/awards/'+(i<count?'star-earned.webp':'star-empty.webp')} alt="" draggable="false" onError={()=>setUnavailable(true)}/>}
      {i<count&&<span className="journey-star-glint"/>}
    </span>)}
    <span className="journey-sr">{count} / {max}</span>
  </span>;
}
function MapCourseInfo({course,placement,base,selected,celebration,onChoose,onReplay}){
  if(!placement)return null;
  const full=(course.stars||0)>=(course.maxStars||5),{beside,multiline,...caption}=placement.label;
  return <>
    <div className="journey-map-stars is-under-landmark" data-stars-course={course.id} role="group" aria-label={course.label+' 获星'} style={{...placement.rewards,'--journey-map-star-size':placement.starSize+'px','--journey-map-star-gap':placement.starGap+'px','--journey-reward-size':placement.rewards.height+'px'}}>
      <Stars course={course} base={base} small/>
      {full&&<CompletionMedal course={course} base={base} celebration={celebration} onReplay={onReplay}/>}
    </div>
    <div className="journey-map-caption" data-map-info={course.id} data-caption-beside={beside} data-multiline={multiline} role="group" aria-label={course.label+' 课程入口'} style={caption}>
    <button type="button" data-map-course={course.id}
      className={'journey-node node-'+course.id+(selected?' is-selected':'')} aria-pressed={selected} aria-label={`选择 ${course.label} ${course.title}，${course.stars||0} / ${course.maxStars||5} 颗星`} onClick={()=>onChoose(course.id)}>
      <span className="journey-node-copy"><span className="journey-node-lesson-text">{course.label}</span></span>
    </button>
    </div>
  </>;
}
function useDesktop(){
  const [desktop,setDesktop]=useState(()=>matchMedia('(min-width:1024px)').matches);
  useEffect(()=>{const media=matchMedia('(min-width:1024px)'),change=()=>setDesktop(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  return desktop;
}
function Artwork({course,base,className='',lazy=false}){
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[course.id]);
  const src=artwork.characters[course.id]?base+'assets/course-journey/'+artwork.characters[course.id].file:(course.artwork?.[0]||course.image);
  // A reused img can keep painting its previous decoded bitmap while the new
  // source loads. Replace the image identity with the course artwork so a new
  // title can never briefly inherit the previous course's visible character.
  return failed||!src?<BookOpen className={'journey-art-fallback '+className} size={48} aria-hidden="true"/>:
    <img key={course.id+':'+src} className={className} src={src} alt="" loading={lazy?'lazy':'eager'} decoding="async" onError={()=>setFailed(true)}/>;
}
export function App({who,base,preview='',waiting=0,onRefresh,openLegacy=false}){
  const courses=who.courses,desktop=useDesktop();
  const actionLabel=course=>who.systemUpgrade?.epoch&&course.completed?'再次学习':course.started||course.stars?'继续学习':'开始学习';
  const storageKey='canran:journey:v1:'+who.student.id;
  const initial=useRef();
  if(!initial.current){let saved;try{saved=JSON.parse(sessionStorage.getItem(storageKey));}catch{}initial.current=model.restore(courses,saved);}
  const [selected,setSelected]=useState(initial.current.selected);
  const [chapterId,setChapterId]=useState(initial.current.chapter);
  const [tap,setTap]=useState(null),[celebration,setCelebration]=useState(null);
  const [directory,setDirectory]=useState(initial.current.directory);
  const [query,setQuery]=useState(initial.current.query);
  const [group,setGroup]=useState(initial.current.group);
  const [account,setAccount]=useState(openLegacy),[legacyOpen,setLegacyOpen]=useState(openLegacy),[logoutBusy,setLogoutBusy]=useState(false),[accountError,setAccountError]=useState('');
  const [loadedScene,setLoadedScene]=useState(''),[failedScene,setFailedScene]=useState(''),[failedArt,setFailedArt]=useState([]),[attempt,setAttempt]=useState(0);
  const current=courses.find(course=>course.id===selected)||courses[0];
  const visible=model.filter(courses,query,group),regions=model.groups(courses),chapters=model.mapChapters(courses);
  const chapter=chapters.find(item=>item.id===chapterId)||chapters[0]||model.MAP_CHAPTERS[0];
  // Authorization can change after a refresh without remounting the home.
  // Never retain a chapter/selection that is absent from the new course list.
  useEffect(()=>{
    if(group!=='all'&&!regions.some(item=>item.id===group))setGroup('all');
    if(courses.some(course=>course.id===selected)&&chapters.some(item=>item.id===chapterId))return;
    const next=model.restore(courses,{selected,chapter:chapterId});
    if(next.selected!==selected)setSelected(next.selected);
    if(next.chapter!==chapterId)setChapterId(next.chapter);
  },[courses,selected,chapterId,group]);
  const mapped=courses.filter(course=>chapter.courses.includes(course.id)),allMapped=courses.filter(course=>model.MAP_COURSES.includes(course.id));
  const dialog=useRef(),accountDialog=useRef(),searchInput=useRef(),desktopSearch=useRef(),directoryTrigger=useRef(),returnFocus=useRef(),focusSearch=useRef(false),mapRef=useRef(),scrollSaved=useRef(false),pendingLocate=useRef(null);
  const modular=!!routeWorlds.worlds[chapter.id];
  // Returning to the same chapter creates a new identity; an old ready set
  // must never celebrate before this mount's actual images have decoded.
  const moduleGeneration=useMemo(()=>({chapter:chapter.id}),[chapter.id]);
  const currentModuleGeneration=useRef(moduleGeneration);currentModuleGeneration.current=moduleGeneration;
  const [moduleReadiness,setModuleReadiness]=useState(null),[modulePresentation,setModulePresentation]=useState(null);
  // A longer selected title can grow the fixed dock. Measure in this commit,
  // before paint, instead of waiting for a later ResizeObserver animation frame.
  const mapLayout=useMapLayout(mapRef,desktop,modular?null:artwork.chapters[chapter.id],chapter.id+':'+selected+':'+mapped.map(course=>course.id).join(',')+':'+(modulePresentation===moduleGeneration)),composition=mapLayout?.composition||(desktop?'landscape':'portrait');
  const scene=artwork.chapters[chapter.id][composition],readyKey=modular?'modules:'+chapter.id:scene.file,mapReady=loadedScene===readyKey,mapFailed=failedScene===scene.file;
  const activeFailures=failedArt.filter(id=>chapter.courses.includes(id));
  const checkedCompletions=useRef(),pendingCompletions=useRef([]);
  useEffect(()=>{
    if(checkedCompletions.current!==courses){
      checkedCompletions.current=courses;
      let storage;try{storage=window.localStorage;}catch{return;}
      pendingCompletions.current=takeNewCompletions(storage,who.student.id,allMapped);
    }
    const fresh=completionCandidates({pending:pendingCompletions.current,chapter:chapter.courses,modular,legacyReady:mapReady,readiness:moduleReadiness,generation:moduleGeneration});
    const id=fresh.includes(selected)?selected:fresh[0];
    if(id){pendingCompletions.current=pendingCompletions.current.filter(item=>item!==id);setCelebration(previous=>({id,serial:(previous?.serial||0)+1}));}
  },[mapReady,courses,who.student.id,selected,chapter.id,modular,moduleReadiness,moduleGeneration]);
  function moduleArtReady(id,ready,generation){
    setModuleReadiness(previous=>recordArtReady(previous,currentModuleGeneration.current,generation,id,ready));
  }
  function choose(id){const nextChapter=model.chapterFor(id);if(nextChapter)setChapterId(nextChapter);setSelected(id);setTap(previous=>({id,serial:(previous?.serial||0)+1}));}
  function changeChapter(id){
    const next=chapters.find(item=>item.id===id);if(!next)return;
    const target=next.courses.includes(selected)?selected:courses.find(course=>next.courses.includes(course.id))?.id;
    if(target)choose(target);
  }
  function chapterPicker(mobile=false){
    return chapters.length>0&&<label className={'journey-region-control '+(mobile?'journey-mobile-range':'journey-range')} style={mobile?{width:148+Math.max(0,chapter.label.length-10)*6}:undefined}>
      <select aria-label="旅程地图范围" value={chapter.id} onChange={event=>changeChapter(event.target.value)}>
        {chapters.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
      </select><CaretDown size={18} aria-hidden="true"/>
    </label>;
  }
  function replay(id){setSelected(id);setCelebration(previous=>({id,serial:(previous?.serial||0)+1}));}
  const state=useRef({});
  state.current={selected,chapter:chapterId,directory,query,group};
  const save=(updates={})=>{try{sessionStorage.setItem(storageKey,JSON.stringify({...state.current,...updates,scroll:window.scrollY}));}catch{}};
  useEffect(()=>{save();},[selected,chapterId,directory,query,group]);
  useEffect(()=>{const remember=()=>save();window.addEventListener('pagehide',remember);return()=>{remember();window.removeEventListener('pagehide',remember);};},[]);
  useEffect(()=>{
    if(scrollSaved.current)return;
    scrollSaved.current=true;
    if(initial.current.scroll&&!initial.current.directory)requestAnimationFrame(()=>window.scrollTo({top:initial.current.scroll,behavior:'instant'}));
  },[]);
  useEffect(()=>{
    const update=()=>{
      const viewport=window.visualViewport;
      document.documentElement.style.setProperty('--journey-vh',(viewport?.height||window.innerHeight)+'px');
      document.documentElement.style.setProperty('--journey-vtop',(viewport?.offsetTop||0)+'px');
      document.documentElement.classList.toggle('journey-compact-viewport',(viewport?.height||window.innerHeight)<520);
    };
    update();window.visualViewport?.addEventListener('resize',update);window.visualViewport?.addEventListener('scroll',update);window.addEventListener('resize',update);
    return()=>{window.visualViewport?.removeEventListener('resize',update);window.visualViewport?.removeEventListener('scroll',update);window.removeEventListener('resize',update);document.documentElement.style.removeProperty('--journey-vh');document.documentElement.style.removeProperty('--journey-vtop');document.documentElement.classList.remove('journey-compact-viewport');};
  },[]);
  useLayoutEffect(()=>{
    const node=dialog.current;
    if(directory&&!desktop){
      if(!node.open)node.showModal();
      if(focusSearch.current)searchInput.current?.focus();else node.querySelector('h2')?.focus();
    }else if(node?.open)node.close();
    if(directory&&desktop&&focusSearch.current)desktopSearch.current?.focus();
    focusSearch.current=false;
  },[directory,desktop]);
  useLayoutEffect(()=>{
    const node=accountDialog.current;
    if(account&&!node.open)node.showModal();else if(!account&&node.open)node.close();
  },[account]);
  useEffect(()=>{
    const previous=document.body.style.overflow;
    if((directory&&!desktop)||account)document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=previous;};
  },[directory,desktop,account]);
  function openDirectory(search=false){
    returnFocus.current=document.activeElement;focusSearch.current=search;
    setDirectory(true);
    if(directory&&search)(desktop?desktopSearch:searchInput).current?.focus();
  }
  function closeDirectory(){
    setDirectory(false);setQuery('');setGroup('all');
    requestAnimationFrame(()=>{const target=returnFocus.current;((target?.isConnected&&target.getClientRects().length)?target:directoryTrigger.current)?.focus({preventScroll:true});});
  }
  function locate(course){
    pendingLocate.current=course.id;
    choose(course.id);closeDirectory();
  }
  useLayoutEffect(()=>{
    if(directory||!pendingLocate.current)return;
    const frame=requestAnimationFrame(()=>{
      const id=pendingLocate.current,node=mapRef.current?.querySelector(`[data-map-course="${id}"]`);
      if(!node||node.closest('[inert]'))return;
      pendingLocate.current=null;node.focus({preventScroll:true});
      const rect=node.getBoundingClientRect(),reserve=mapLayout?.bottomReserve||190;
      if(rect.top<90||rect.bottom>window.innerHeight-reserve)node.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    });
    return()=>cancelAnimationFrame(frame);
  },[directory,chapterId,selected,mapLayout,modulePresentation]);
  function enter(course){setSelected(course.id);save({selected:course.id});}
  function search(value){setQuery(value);setGroup('all');if(!directory)setDirectory(true);}
  function searchKey(event){
    if(event.key==='Escape'&&desktop){event.preventDefault();closeDirectory();}
    if(event.key==='Enter'&&visible.length===1){
      event.preventDefault();
      const root=desktop?document.querySelector('.journey-directory-desktop'):dialog.current;
      root?.querySelector('.journey-course:not([hidden]) [data-course-enter]')?.focus();
    }
  }
  function filters(){
    return <div className="journey-directory-filter"><label htmlFor={desktop?'journeyGroupDesktop':'journeyGroupMobile'}>课程范围</label>
      <select id={desktop?'journeyGroupDesktop':'journeyGroupMobile'} value={group} onChange={event=>{setGroup(event.target.value);setQuery('');}}>
        <option value="all">全部课程 · {courses.length} 个单元</option>{regions.map(g=><option key={g.id} value={g.id}>{g.label} · {g.count} 个单元</option>)}
      </select></div>;
  }
  function list(){
    return <><p className="journey-result-count" role="status">{query?`“${query}” 找到 ${visible.length} 个单元`:`${visible.length} 个已开放单元`}</p>
      <div className="journey-course-list course-directory">
        {courses.map(course=><article hidden={!visible.includes(course)} className={'journey-course course'+(selected===course.id?' is-current':'')} data-unit={course.id} key={course.id}>
          {!!query.trim()&&visible.includes(course)&&<Artwork course={course} base={base} className="journey-result-art" lazy/>}
          <div className="journey-course-copy"><p><span>{course.label}</span>{who.systemUpgrade?.epoch&&course.completed&&<small className="journey-completed-label">已通关</small>}</p><h3>{course.title}</h3><Stars course={course} base={base} small animate={false}/></div>
          <div className="journey-course-actions">
            <a className="primary-button journey-course-enter" data-course-enter href={model.href(course,base,preview)} aria-label={`${actionLabel(course)}：${course.title}`} onClick={()=>enter(course)}>进入课程<ArrowRight size={18} aria-hidden="true"/></a>
            {model.MAP_COURSES.includes(course.id)&&<button type="button" className="journey-locate" onClick={()=>locate(course)} aria-label={`地图定位：${course.title}`}><MapPin size={16} aria-hidden="true"/>地图定位</button>}
          </div>
        </article>)}
        {!visible.length&&<div className="journey-empty-results"><MagnifyingGlass size={32} aria-hidden="true"/><h3>没有找到这节课</h3><p>试试 Lesson 50 或课程名称。</p><button type="button" onClick={()=>{setQuery('');setGroup('all');}}>查看全部课程</button></div>}
      </div></>;
  }
  const range=courses.length?`Lesson ${model.lesson(courses[0])}–${model.lesson(courses.at(-1))+1}`:'等待老师开放课程';
  const dock=current&&<section className="journey-dock" aria-label="当前课程" data-selected-course={current.id}>
    <Artwork course={current} base={base} className="journey-dock-art"/>
    <div className="journey-dock-copy"><p><span className="journey-current-caption">当前课程</span> <span className="journey-current-lesson">{current.label}</span></p><h2>{current.title}</h2><Stars course={current} base={base}/></div>
    <a className="journey-start primary-button" href={model.href(current,base,preview)} aria-label={`${actionLabel(current)}：${current.title}`} onClick={()=>enter(current)}>
      {actionLabel(current)==='开始学习'?'进入课程':actionLabel(current)}<ArrowRight {...iconProps}/></a>
  </section>;
  return <div className="journey-home" data-journey-ready="true" style={{'--journey-earned-star':`url("${base}assets/awards/star-earned.webp")`,'--journey-bottom-reserve':mapLayout?mapLayout.bottomReserve+'px':undefined,'--journey-bottom-padding':mapLayout?mapLayout.bottomPadding+'px':undefined,'--journey-sticky-offset':mapLayout?mapLayout.stickyOffset+'px':undefined}}>
    <aside className="journey-sidebar">
      <div className="journey-heading"><div className="journey-heading-top"><h1>学习旅程<span className="journey-sr"> · {who.student.name}的课程</span></h1>{!desktop&&chapterPicker(true)}</div><p>{courses.length} 个单元<span aria-hidden="true"> · </span>{range}</p></div>
      <div className="journey-tools">
        {desktop&&<div className="journey-desktop-search journey-search"><MagnifyingGlass {...iconProps}/><input type="search" aria-label="查找 Lesson" ref={desktopSearch} value={query} placeholder="搜索 Lesson 或课程名称" maxLength={100} onChange={e=>search(e.target.value)} onKeyDown={searchKey}/>{query&&<button type="button" aria-label="清除搜索" onClick={()=>{setQuery('');desktopSearch.current?.focus();}}><X size={18}/></button>}</div>}
        <button type="button" className="journey-mobile-search journey-search" onClick={()=>openDirectory(true)} aria-label="搜索 Lesson 或课程名称"><MagnifyingGlass {...iconProps}/><span>搜索 Lesson 或课程名称</span></button>
        <button type="button" className="journey-all" ref={directoryTrigger} onClick={()=>directory&&desktop?closeDirectory():openDirectory()} aria-expanded={directory}><SquaresFour {...iconProps} weight="fill"/><span>{directory&&desktop?'返回地图':'全部课程'}</span><ArrowRight size={20} aria-hidden="true"/></button>
      </div>
      {desktop?<div className="journey-directory-desktop" hidden={!directory}>
        {filters()}{list()}
      </div>:null}
      <div className="journey-opening-links" hidden={desktop&&directory}>
        {desktop&&chapterPicker()}
        {mapped.map(course=><button type="button" key={course.id} onClick={()=>choose(course.id)} className={'journey-quick'+(selected===course.id?' is-selected':'')} aria-pressed={selected===course.id}>
          <Artwork course={course} base={base}/><span><small>{course.label}</small><strong>{course.title}</strong></span><ArrowRight size={20} aria-hidden="true"/>
        </button>)}
      </div>
      {dock}
      <p className="journey-preview-note">{who.preview?'班级预览 · 不记录成绩':who.className}</p>
      <p className="journey-home-status" role="status" data-home-status>{waiting>0?'还有学习成果保存在本机，联网后将继续同步。':''}</p>
    </aside>
    <section className="journey-map" aria-label={chapter.label+' 旅程地图'} ref={mapRef}>
      {modular?<ModuleJourney scopeKey={JSON.stringify([who.student.id,base,courses.map(course=>course.id)])} generation={moduleGeneration} chapter={chapter} courses={mapped} base={base} selected={selected} tap={tap} celebration={celebration} onChoose={choose} onArtReady={moduleArtReady} onPresented={setModulePresentation} renderInfo={course=><MapCourseInfo course={course} placement={{rewards:{width:desktop?184:148,height:desktop?48:44},label:{width:desktop?156:132,height:44,beside:false,multiline:false},starSize:desktop?20:17,starGap:2}} base={base} selected={selected===course.id} celebration={celebration} onChoose={choose} onReplay={replay}/>}/>:
      <div className="journey-map-scene" data-chapter={chapter.id} data-composition={composition} style={mapLayout?{height:mapLayout.height}:undefined} data-map-state={mapFailed?'error':mapReady?'ready':'loading'}>
        <div className="journey-map-canvas" style={mapLayout?{width:mapLayout.width,height:mapLayout.canvasHeight,left:mapLayout.left,top:mapLayout.top}:undefined}>
        <div key={scene.file+attempt} className="journey-environment">
          <img src={base+'assets/course-journey/'+scene.file+(attempt?'?retry='+attempt:'')} alt={chapter.alt} fetchPriority="high" decoding="async" onLoad={async event=>{const img=event.currentTarget,source=img.currentSrc;try{await img.decode();if(img.isConnected&&source===img.currentSrc){setLoadedScene(scene.file);setFailedScene('');}}catch{if(img.isConnected&&source===img.currentSrc)setFailedScene(scene.file);}}} onError={event=>{if(event.currentTarget.isConnected)setFailedScene(scene.file);}}/>
        </div>
        {mapped.map(course=>{const position=mapLayout?.nodes?.[course.id]||scene.nodes[course.id],character=artwork.characters[course.id];return <React.Fragment key={course.id}>
          {!failedArt.includes(course.id)&&<Landmark course={course} character={character} position={position} selected={selected===course.id} tap={tap} celebration={celebration} onChoose={choose} src={base+'assets/course-journey/'+character.file+(attempt?'?retry='+attempt:'')} onError={()=>setFailedArt(previous=>previous.includes(course.id)?previous:[...previous,course.id])}/>}
          <MapCourseInfo course={course} placement={mapLayout?.overlays?.items[course.id]} base={base} selected={selected===course.id} celebration={celebration} onChoose={choose} onReplay={replay}/>
        </React.Fragment>;})}
        </div>
        {(mapFailed||activeFailures.length>0)&&<div className="journey-map-message" role="status"><p>地图插图暂时没准备好</p><span>课程仍可从目录进入。</span><button type="button" onClick={()=>{setFailedScene('');setFailedArt(previous=>previous.filter(id=>!chapter.courses.includes(id)));setLoadedScene('');setAttempt(n=>n+1);}}><ArrowClockwise size={18} aria-hidden="true"/>重新加载地图</button></div>}
        {!mapReady&&!mapFailed&&<p className="journey-loading" role="status">正在准备旅程地图…</p>}
      </div>}
      {!mapped.length&&courses.length>0&&<div className="journey-map-unavailable"><h2>你的课程在目录里</h2><p>打开目录，继续自己的学习旅程。</p><button type="button" onClick={()=>openDirectory()}>查看我的课程<ArrowRight size={20}/></button></div>}
      {!courses.length&&<div className="journey-map-unavailable"><h2>老师还没开放课程</h2><p>开课后，再回来看看吧。</p><button type="button" onClick={onRefresh}>刷新课程</button></div>}
    </section>
    <dialog ref={dialog} className={'journey-directory-sheet'+(query.trim()&&visible.length<4?' has-short-results':'')} onCancel={event=>{event.preventDefault();closeDirectory();}} onClick={event=>{if(event.target===event.currentTarget)closeDirectory();}}>
      {!desktop&&<div className="journey-sheet-inner">
        <header className="journey-sheet-heading"><div><h2 tabIndex={-1}>全部课程</h2><p>{courses.length} 个单元 · 按自己的节奏探索</p></div><button type="button" aria-label="关闭课程目录" onClick={closeDirectory}><X {...iconProps}/></button></header>
        <div className="journey-search"><MagnifyingGlass {...iconProps}/><input type="search" aria-label="查找 Lesson" ref={searchInput} placeholder="例如 Lesson 50，或课程名称" value={query} maxLength={100} onChange={event=>search(event.target.value)} onKeyDown={searchKey}/>{query&&<button type="button" aria-label="清除搜索" onClick={()=>{setQuery('');searchInput.current?.focus();}}><X size={18}/></button>}</div>
        {filters()}{list()}
      </div>}
    </dialog>
    {!who.preview?<nav className="journey-bottom-nav" aria-label="底部主导航">
      <a href={base} aria-current="page" aria-label="我的课程" onClick={event=>{event.preventDefault();if(directory)closeDirectory();window.scrollTo({top:0,behavior:'instant'});}}><House size={26} weight="fill"/><span>课程</span></a>
      <a href={base+'awards/'} aria-label="我的纪念册"><BookOpen size={26}/><span>纪念册</span></a>
      <button type="button" onClick={()=>{returnFocus.current=document.activeElement;setAccount(true);}} aria-haspopup="dialog"><User size={26}/><span>我的</span></button>
    </nav>:<nav className="journey-bottom-nav journey-preview-nav" aria-label="预览导航"><a href={base+'admin/'}><ArrowLeft size={24}/><span>返回班级管理</span></a><button type="button" onClick={()=>openDirectory()}><SquaresFour size={24}/><span>课程目录</span></button></nav>}
    <dialog ref={accountDialog} className="journey-account-sheet" onCancel={()=>setAccount(false)}>
      <div className="journey-sheet-heading"><h2>我的</h2><button type="button" aria-label="关闭我的" onClick={()=>{setAccount(false);returnFocus.current?.focus();}}><X {...iconProps}/></button></div>
      <p className="journey-account-name">{who.student.name}</p><p className="journey-account-number">{who.student.studentNumber}</p>
      <a className="journey-account-action" href={base+'?account=password'}><Key {...iconProps}/>修改密码<ArrowRight size={18}/></a>
      <button type="button" className="journey-account-action" disabled={logoutBusy} onClick={async()=>{setLogoutBusy(true);setAccountError('');try{await window.CanranStudentShell.signOut(base);}catch{setLogoutBusy(false);setAccountError('暂时无法退出，请再试一次。');}}}><SignOut {...iconProps}/>退出登录</button>
      {accountError&&<p role="alert">{accountError}</p>}
      {!who.systemUpgrade?.epoch&&<details className="journey-legacy" open={legacyOpen} onToggle={event=>setLegacyOpen(event.currentTarget.open)}><summary><span>本机旧记录</span><CaretDown size={16} aria-hidden="true"/></summary><p>这些记录来自使用学生账号之前，不计入当前学生。</p><ul id="legacy"/></details>}
    </dialog>
  </div>;
}
