import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {ArrowRight,ArrowLeft,BookOpen,CaretLeft,CaretRight,House,MagnifyingGlass,Star,User,X,ArrowClockwise} from '@phosphor-icons/react';
import model from './model';
import {useMapLayout} from './use-map-layout';
import artwork from './chapter-layout';
import {Landmark,CompletionMedal} from './Landmark';
import {bindLandmarkEntry} from './landmark-entry';
import {ModuleJourney} from './ModuleJourney';
import routeWorlds from './route-worlds';
import {recordArtReady,completionCandidates} from './module-readiness';
import {takeNewCompletions} from './completion-notice';
import './effects.css';
import {AccountDialog} from '../student-ui/AccountDialog';

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
    <button type="button" data-map-course={course.id} title="单击选课，双击进入课程"
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
export function App({who,base,preview='',waiting=0,onRefresh,openLegacy=false,openProfile=false,embedded=false,active=true,onReady}){
  const [preparingDocument,setPreparingDocument]=useState(!!window.CanranStudentHandoff?.preparing);
  useEffect(()=>{const activate=()=>setPreparingDocument(false);window.addEventListener('canran:student-view-active',activate);return()=>window.removeEventListener('canran:student-view-active',activate);},[]);
  const activeRef=useRef(active),readyCallback=useRef(onReady);activeRef.current=active;readyCallback.current=onReady;
  const courses=who.courses,desktop=useDesktop();
  const actionLabel=course=>model.actionLabel(course,Boolean(who.systemUpgrade?.epoch));
  const storageKey=model.bookmarkKey(who);
  const initial=useRef();
  if(!initial.current){
    let saved;try{saved=JSON.parse(sessionStorage.getItem(storageKey));}catch{}
    const from=window.CanranStudentHandoff?.returningCourse?.(who);
    initial.current={...model.restore(courses,saved,from),from,sameBookmark:!!from&&saved?.selected===from};
  }
  const [selected,setSelected]=useState(initial.current.selected);
  const [tap,setTap]=useState(null),[celebration,setCelebration]=useState(null);
  const [directory,setDirectory]=useState(false),[query,setQuery]=useState('');
  const [accountView,setAccountView]=useState(openLegacy?'legacy':openProfile?'profile':null);
  const [loadedScene,setLoadedScene]=useState(''),[failedScene,setFailedScene]=useState(''),[failedArt,setFailedArt]=useState([]),[attempt,setAttempt]=useState(0);
  const current=courses.find(course=>course.id===selected)||courses[0];
  const visible=model.filter(courses,query);
  const chapters=useMemo(()=>model.mapChapters(courses),[courses]);
  const chapterIndex=chapters.findIndex(item=>item.courses.includes(current?.id));
  const chapter=chapters[chapterIndex]||model.MAP_CHAPTERS[0],chapterId=chapter.id;
  const previousChapter=chapters[chapterIndex-1],nextChapter=chapters[chapterIndex+1];
  const chapterVisits=useRef(initial.current.visits),chapterLabel=useRef();
  // Use only the current authorization, including on the first refreshed render.
  useEffect(()=>{if(selected!==(current?.id||null))setSelected(current?.id||null);},[selected,current?.id]);
  const mapped=courses.filter(course=>chapter.courses.includes(course.id)),allMapped=courses.filter(course=>model.MAP_COURSES.includes(course.id));
  const dialog=useRef(),listRef=useRef(),previousQuery=useRef(''),searchInput=useRef(),searchTrigger=useRef(),mapRef=useRef(),pendingLocate=useRef(null);
  const entryLink=useRef();
  useEffect(()=>{
    if(!active||!mapRef.current)return;
    return bindLandmarkEntry(mapRef.current,button=>{
      const link=entryLink.current,id=button.dataset.landmarkSelect||button.dataset.mapCourse;
      if(!link||link.closest('[data-selected-course]')?.dataset.selectedCourse!==id)return;
      if(!window.CanranStudentHandoff?.followLink(link,button))link.click();
    });
  },[active]);
  const modular=!!routeWorlds.worlds[chapter.id];
  // Returning to the same chapter creates a new identity; an old ready set
  // must never celebrate before this mount's actual images have decoded.
  const moduleGeneration=useMemo(()=>({chapter:chapter.id}),[chapter.id]);
  const currentModuleGeneration=useRef(moduleGeneration);currentModuleGeneration.current=moduleGeneration;
  const [moduleReadiness,setModuleReadiness]=useState(null),[modulePresentation,setModulePresentation]=useState(null);
  // A longer selected title can grow the fixed dock. Measure in this commit,
  // before paint, instead of waiting for a later ResizeObserver animation frame.
  const layoutKey=chapter.id+':'+selected+':'+mapped.map(course=>course.id).join(',')+':'+(modulePresentation===moduleGeneration);
  const mapLayout=useMapLayout(mapRef,desktop,modular?null:artwork.chapters[chapter.id],layoutKey),composition=mapLayout?.composition||(desktop?'landscape':'portrait');
  const scene=artwork.chapters[chapter.id][composition],readyKey=modular?'modules:'+chapter.id:scene.file,mapReady=loadedScene===readyKey,mapFailed=failedScene===scene.file;
  const activeFailures=failedArt.filter(id=>chapter.courses.includes(id));
  const checkedCompletions=useRef(),pendingCompletions=useRef([]);
  useEffect(()=>{
    if(!active||preparingDocument)return;
    if(checkedCompletions.current!==courses){
      checkedCompletions.current=courses;
      let storage;try{storage=window.localStorage;}catch{return;}
      pendingCompletions.current=takeNewCompletions(storage,who.student.id,allMapped);
    }
    const fresh=completionCandidates({pending:pendingCompletions.current,chapter:chapter.courses,modular,legacyReady:mapReady,readiness:moduleReadiness,generation:moduleGeneration});
    const id=fresh.includes(selected)?selected:fresh[0];
    if(id){pendingCompletions.current=pendingCompletions.current.filter(item=>item!==id);setCelebration(previous=>({id,serial:(previous?.serial||0)+1}));}
  },[active,preparingDocument,mapReady,courses,who.student.id,selected,chapter.id,modular,moduleReadiness,moduleGeneration]);
  useEffect(()=>{if(!courses.length||modular&&modulePresentation===moduleGeneration||!modular&&(mapReady||mapFailed))readyCallback.current?.(restoreCoursePosition);},[courses.length,modular,modulePresentation,moduleGeneration,mapReady,mapFailed]);
  function moduleArtReady(id,ready,generation){
    setModuleReadiness(previous=>recordArtReady(previous,currentModuleGeneration.current,generation,id,ready));
  }
  function rememberMap(){
    if(current&&!pendingLocate.current)chapterVisits.current[chapterId]={selected:current.id,scroll:window.scrollY,width:mapRef.current.clientWidth};
  }
  function choose(id){
    if(model.chapterFor(id)!==chapterId)rememberMap();
    pendingLocate.current=null;
    if(query&&!visible.some(course=>course.id===id))setQuery('');
    setSelected(id);setTap(previous=>({id,serial:(previous?.serial||0)+1}));
  }
  function browseChapter(target,trigger){
    if(!active||!target)return;
    const candidates=courses.filter(course=>target.courses.includes(course.id));
    if(!candidates.length)return;
    rememberMap();
    const visit=chapterVisits.current[target.id],remembered=candidates.find(course=>course.id===visit?.selected);
    const id=(remembered||candidates[0]).id;
    pendingLocate.current={id,browsing:true,scroll:remembered&&visit.width===mapRef.current.clientWidth?visit.scroll:null,trigger};
    setSelected(id);
  }
  function cancelChapter(id){
    pendingLocate.current=null;
    setSelected(id);
    const control=desktop?listRef.current?.querySelector('[data-course-select="'+id+'"]'):chapterLabel.current;
    control?.focus({preventScroll:true});
  }
  function replay(id){pendingLocate.current=null;setSelected(id);setCelebration(previous=>({id,serial:(previous?.serial||0)+1}));}
  const state=useRef({});
  state.current={selected,chapter:chapterId};
  const save=(updates={})=>{if(!activeRef.current)return;try{sessionStorage.setItem(storageKey,JSON.stringify({...state.current,...updates,scroll:window.scrollY,visits:chapterVisits.current}));}catch{}};
  useEffect(()=>{save();},[selected,chapterId]);
  useLayoutEffect(()=>{
    const remember=event=>{
      if(window.CanranStudentHandoff?.retired)return;
      const target=event?.detail?.target,match=target&&new URL(target).pathname.match(/\/(unit\d+-\d+)\/?$/);
      save(match?{selected:match[1],chapter:model.chapterFor(match[1])}:{});
    };
    window.addEventListener('pagehide',remember);window.addEventListener('canran:save-journey',remember);
    return()=>{remember();window.removeEventListener('pagehide',remember);window.removeEventListener('canran:save-journey',remember);};
  },[]);
  useLayoutEffect(()=>{
    if(!embedded&&initial.current.scroll)window.scrollTo({top:initial.current.scroll,behavior:'instant'});
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
    if(directory&&!desktop&&active){
      if(!node.open)node.showModal();
      node.querySelector('h2')?.focus({preventScroll:true});
    }else if(node?.open)node.close();
    if(desktop&&directory)setDirectory(false);
  },[directory,desktop,active]);
  useLayoutEffect(()=>{
    if(embedded)return;
    const open=()=>setAccountView('profile');
    window.addEventListener('canran:open-account',open);
    return()=>window.removeEventListener('canran:open-account',open);
  },[]);
  useEffect(()=>{
    if(!directory||desktop||!active)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=previous;};
  },[directory,desktop,active]);
  useEffect(()=>{if(!embedded)return;const show=()=>{if(activeRef.current)closeDirectory();};window.addEventListener('canran:show-courses',show);return()=>window.removeEventListener('canran:show-courses',show);},[]);
  function openDirectory(){
    if(desktop){searchInput.current?.focus();return;}
    setQuery('');setDirectory(true);
  }
  function closeDirectory(restoreFocus=true){
    setDirectory(false);setQuery('');
    if(restoreFocus&&dialog.current?.open)requestAnimationFrame(()=>searchTrigger.current?.focus({preventScroll:true}));
  }
  function locate(course){
    choose(course.id);
    pendingLocate.current={id:course.id};
    if(!desktop)closeDirectory(false);
  }
  function keepRowVisible(){
    const list=listRef.current,row=list?.querySelector('[aria-pressed="true"]');
    if(!row||!list.clientHeight)return;
    const r=row.getBoundingClientRect(),box=list.getBoundingClientRect();
    if(r.top<box.top)list.scrollTop+=r.top-box.top;
    else if(r.bottom>box.bottom)list.scrollTop+=r.bottom-box.bottom;
  }
  useLayoutEffect(()=>{
    if(!active||(!desktop&&!directory))return;
    const changed=previousQuery.current!==query;previousQuery.current=query;
    if(query&&changed){if(listRef.current)listRef.current.scrollTop=0;}
    else keepRowVisible();
  },[active,desktop,directory,query,current?.id]);
  function positionLandmark(id,focus=false,preserveVisible=false){
    const map=mapRef.current,button=map?.querySelector(`[data-map-course="${id}"]`);
    if(!button||button.closest('[inert]'))return false;
    if(focus)button.focus({preventScroll:true});
    const caption=button.getBoundingClientRect(),figure=map.querySelector(`[data-story-course="${id}"]`)?.getBoundingClientRect();
    const headerBottom=document.querySelector('#siteHeader')?.getBoundingClientRect().bottom||0;
    const top=Math.max(0,headerBottom,desktop?0:map.parentElement.querySelector('.journey-tools').getBoundingClientRect().bottom)+8;
    const bottom=innerHeight-(mapLayout?.bottomReserve||0)-8;
    const center=figure?figure.top+figure.height/2:caption.top+caption.height/2;
    if(preserveVisible&&center>=top&&center<=bottom)return true;
    // Keep the label and the figure together when they fit. Scroll only this
    // document: the parent is still showing the classroom during a handoff.
    const start=Math.max(figure?.top??caption.top,caption.bottom-Math.max(0,bottom-top));
    if(start<top||caption.bottom>bottom)window.scrollBy({top:(start+caption.bottom-top-bottom)/2,behavior:'instant'});
    return true;
  }
  function restoreCoursePosition(){
    keepRowVisible();
    if(initial.current.from&&current)positionLandmark(current.id,false,initial.current.sameBookmark);
  }
  useLayoutEffect(()=>{
    const request=pendingLocate.current;
    if(!request||directory||request.id!==current?.id)return;
    if(modular?modulePresentation!==moduleGeneration:!mapReady&&!mapFailed)return;
    if(request.browsing){
      // A shorter map can have 24px less padding under the fixed dock. Wait
      // for this chapter's measured padding before restoring a bottom bookmark.
      if(mapLayout?.measuredFor!==layoutKey)return;
      window.scrollTo({top:request.scroll??0,behavior:'instant'});
      if(request.scroll===null)positionLandmark(request.id);
      if(!request.trigger.isConnected||request.trigger.disabled)chapterLabel.current?.focus({preventScroll:true});
    }else if(!positionLandmark(request.id,!desktop))return;
    pendingLocate.current=null;
    save();
  },[tap,directory,current?.id,desktop,mapLayout,layoutKey,modular,moduleGeneration,modulePresentation,mapReady,mapFailed]);
  function enter(course){setSelected(course.id);save({selected:course.id});}
  function searchKey(event){
    if(event.key==='Escape'&&desktop){setQuery('');return;}
    if(event.key==='Enter'&&!event.nativeEvent.isComposing&&visible.length===1){
      event.preventDefault();locate(visible[0]);
    }
  }
  function searchField(){
    return <div className="journey-search"><MagnifyingGlass {...iconProps}/><input type="search" aria-label="查找 Lesson" ref={searchInput} value={query} placeholder="搜索 Lesson 或课程名称" maxLength={100} onChange={event=>setQuery(event.target.value)} onKeyDown={searchKey}/>{query&&<button type="button" aria-label="清除搜索" onClick={()=>{setQuery('');searchInput.current?.focus();}}><X size={18}/></button>}</div>;
  }
  function courseList(){
    return <div className={'journey-course-list'+(desktop?' journey-directory-desktop':'')} ref={listRef} role="group" aria-label="已开放课程">
      {visible.map(course=><div className="journey-course course" data-unit={course.id} key={course.id}>
        <button type="button" className="journey-quick" data-course-select={course.id} aria-pressed={current?.id===course.id} onClick={()=>locate(course)}>
          {(desktop||directory)&&<Artwork course={course} base={base} className="journey-result-art" lazy/>}
          <span className="journey-row-copy"><small>{course.label}</small><strong>{course.title}</strong></span>
          {who.systemUpgrade?.epoch&&course.completed&&<small className="journey-completed-label">已通关</small>}
          <span className={course.stars?'journey-row-stars':'journey-sr'}>{!!course.stars&&<Star size={15} weight="fill" aria-hidden="true"/>}{course.stars||0} / {course.maxStars||5}</span>
        </button>
      </div>)}
      {query&&!visible.length&&<div className="journey-empty-results" role="status"><h3>没有找到这节课</h3><button type="button" onClick={()=>{setQuery('');searchInput.current?.focus();}}>清除搜索条件</button></div>}
    </div>;
  }
  const range=courses.length?`Lesson ${model.lesson(courses[0])}–${model.lesson(courses.at(-1))+1}`:'等待老师开放课程';
  const waypost=!desktop&&nextChapter&&<button type="button" className="journey-waypost" aria-label={`前往下一张地图：${nextChapter.label}`} onClick={event=>browseChapter(nextChapter,event.currentTarget)}>
    <span className="journey-waypost-lettering"><small>前往</small> <strong>{nextChapter.label}</strong></span>
  </button>;
  const dock=current&&<section className="journey-dock" aria-label="当前课程" data-selected-course={current.id}>
    <Artwork course={current} base={base} className="journey-dock-art"/>
    <div className="journey-dock-copy"><p><span className="journey-current-caption">当前课程</span> <span className="journey-current-lesson">{current.label}</span></p><h2>{current.title}</h2><Stars course={current} base={base}/></div>
    <a ref={entryLink} className="journey-start primary-button" href={model.href(current,base,preview)} aria-label={`${actionLabel(current)}：${current.title}`} onClick={()=>enter(current)}>
      {actionLabel(current)==='开始学习'?'进入课程':actionLabel(current)}<ArrowRight {...iconProps}/></a>
  </section>;
  return <div className="journey-home" data-journey-ready="true" style={{'--journey-earned-star':`url("${base}assets/awards/star-earned.webp")`,'--journey-bottom-reserve':mapLayout?mapLayout.bottomReserve+'px':undefined,'--journey-bottom-padding':mapLayout?mapLayout.bottomPadding+'px':undefined,'--journey-sticky-offset':mapLayout?mapLayout.stickyOffset+'px':undefined}}>
    <aside className="journey-sidebar">
      <div className="journey-heading"><div className="journey-heading-top"><h1>学习旅程<span className="journey-sr"> · {who.student.name}的课程</span></h1></div><p>{courses.length} 个单元<span aria-hidden="true"> · </span>{range}</p></div>
      <div className="journey-tools">
        {desktop?searchField():<>
          {!!chapters.length&&<nav className="journey-chapter-nav" aria-label="地图导航">
            {chapters.length>1&&<button type="button" aria-label="上一张地图" disabled={!previousChapter} onClick={event=>browseChapter(previousChapter,event.currentTarget)}><CaretLeft {...iconProps}/></button>}
            <span className="journey-chapter-label" ref={chapterLabel} tabIndex={-1} aria-live="polite" aria-atomic="true">{chapter.label}</span>
            {chapters.length>1&&<button type="button" aria-label="下一张地图" disabled={!nextChapter} onClick={event=>browseChapter(nextChapter,event.currentTarget)}><CaretRight {...iconProps}/></button>}
          </nav>}
          <button type="button" className="journey-mobile-search" ref={searchTrigger} onClick={openDirectory} aria-label="搜索 Lesson 或课程名称" title="搜索课程" aria-haspopup="dialog" aria-expanded={directory}><MagnifyingGlass {...iconProps}/></button>
        </>}
      </div>
      {desktop&&courseList()}
      {dock}
      <p className="journey-preview-note">{who.preview?'班级预览 · 不记录成绩':who.className}</p>
      <p className="journey-home-status" role="status" data-home-status>{waiting>0?'还有学习成果保存在本机，联网后将继续同步。':who.directoryReviewMessage||''}</p>
    </aside>
    <section className="journey-map" data-chapter={chapter.id} aria-label={chapter.label+' 旅程地图'} ref={mapRef}>
      {modular?<ModuleJourney allowNotice={active&&!preparingDocument} onCancelSwitch={cancelChapter} scopeKey={JSON.stringify([who.student.id,base,courses.map(course=>course.id)])} generation={moduleGeneration} chapter={chapter} courses={mapped} waypost={waypost} base={base} selected={selected} tap={tap} celebration={celebration} onChoose={choose} onArtReady={moduleArtReady} onPresented={setModulePresentation} renderInfo={course=><MapCourseInfo course={course} placement={{rewards:{width:desktop?184:148,height:desktop?48:44},label:{width:desktop?156:132,height:44,beside:false,multiline:false},starSize:desktop?20:17,starGap:2}} base={base} selected={selected===course.id} celebration={celebration} onChoose={choose} onReplay={replay}/>}/>:
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
        {(mapFailed||activeFailures.length>0)&&<div className="journey-map-message" role="status"><p>地图插图暂时没准备好</p><span>仍可用当前课程按钮进入。</span><button type="button" onClick={()=>{setFailedScene('');setFailedArt(previous=>previous.filter(id=>!chapter.courses.includes(id)));setLoadedScene('');setAttempt(n=>n+1);}}><ArrowClockwise size={18} aria-hidden="true"/>重新加载地图</button></div>}
        {!mapReady&&!mapFailed&&<p className="journey-loading" role="status">正在准备旅程地图…</p>}
      </div>}
      {!mapped.length&&courses.length>0&&<div className="journey-map-unavailable"><h2>你的课程在目录里</h2><p>通过搜索找到要学习的课程。</p><button type="button" onClick={()=>openDirectory()}>查看我的课程<ArrowRight size={20}/></button></div>}
      {!courses.length&&<div className="journey-map-unavailable"><h2>老师还没开放课程</h2><p>开课后，再回来看看吧。</p><button type="button" onClick={onRefresh}>刷新课程</button></div>}
    </section>
    <dialog ref={dialog} aria-label="选择课程" className="journey-directory-sheet" onCancel={event=>{event.preventDefault();closeDirectory();}} onClick={event=>{if(event.target===event.currentTarget)closeDirectory();}}>
      {!desktop&&<div className="journey-sheet-inner">
        <header className="journey-sheet-heading"><h2 tabIndex={-1}>选择课程</h2><button type="button" aria-label="关闭课程目录" onClick={()=>closeDirectory()}><X {...iconProps}/></button></header>
        {searchField()}{courseList()}
      </div>}
    </dialog>
    {!embedded&&(!who.preview?<nav className="journey-bottom-nav" aria-label="底部主导航">
      <a href={base} aria-current="page" aria-label="我的课程" onClick={event=>{event.preventDefault();if(directory)closeDirectory();window.scrollTo({top:0,behavior:'instant'});}}><House size={26} weight="fill"/><span>课程</span></a>
      <a href={base+'awards/'} aria-label="我的纪念册"><BookOpen size={26}/><span>纪念册</span></a>
      <button type="button" onClick={()=>setAccountView('profile')} aria-haspopup="dialog"><User size={26}/><span>我的</span></button>
    </nav>:<nav className="journey-bottom-nav journey-preview-nav" aria-label="预览导航"><a href={base+'admin/'}><ArrowLeft size={24}/><span>返回班级管理</span></a></nav>)}
    {!embedded&&!who.preview&&accountView&&<AccountDialog student={who.student} base={base} view={accountView} onViewChange={setAccountView} onClose={()=>setAccountView(null)}/>}
  </div>;
}
