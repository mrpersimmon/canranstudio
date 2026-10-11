// Throwaway opening study: three motions on /awards/?prototype=opening&variant=A.
// Uses the signed-in collection read-only; absent from the normal production bundle.
import React, {useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, ArrowCounterClockwise, Pause, Play} from '@phosphor-icons/react';
import './opening-prototype.css';

const variants = [
  {id:'A',name:'侧翻书封',duration:1800,description:'像翻开一本真正的书'},
  {id:'B',name:'向上揭封',duration:1500,description:'像打开一本横版相册'},
  {id:'C',name:'双扉展开',duration:1700,description:'两片封面向两侧舒展'}
];
const ease = t => .5 - Math.cos(Math.PI * Math.max(0,Math.min(1,t))) / 2;
const icon = {size:20,weight:'bold','aria-hidden':true};

function CoverFront({logo,half}){
  return <span className={`cover-front study-cover-front ${half?'split-'+half:''}`}>
    <span className="study-cover-decoration"><span className="cover-emblem"><img src={logo} alt="" draggable="false"/></span></span>
  </span>;
}

export function OpeningPrototype({children,mobile,logo,book,paper,renderLeaf,start}){
  const [variant,setVariant]=useState(()=>variants.find(v=>v.id===new URLSearchParams(location.search).get('variant'))||variants[0]);
  const [progress,setProgress]=useState(0),[playing,setPlaying]=useState(true);
  const position=useRef(0),frame=useRef(0);
  const active=progress<1;
  useEffect(()=>{
    if(!playing)return;
    let previous;
    const tick=time=>{
      if(previous!==undefined)position.current=Math.min(1,position.current+(time-previous)/variant.duration);
      previous=time;setProgress(position.current);
      if(position.current<1)frame.current=requestAnimationFrame(tick);else setPlaying(false);
    };
    frame.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame.current);
  },[playing,variant]);
  function jump(value){cancelAnimationFrame(frame.current);position.current=value;setProgress(value);setPlaying(false);}
  function replay(){position.current=0;setProgress(0);setPlaying(true);}
  function choose(direction){
    const next=variants[(variants.indexOf(variant)+direction+variants.length)%variants.length];
    const url=new URL(location.href);url.searchParams.set('variant',next.id);history.replaceState(null,'',url);
    position.current=0;setProgress(0);setVariant(next);setPlaying(true);
  }
  useEffect(()=>{
    const keys=e=>{
      if(e.target.closest('input,textarea,[contenteditable],button')||!['ArrowLeft','ArrowRight'].includes(e.key))return;
      e.preventDefault();e.stopPropagation();choose(e.key==='ArrowLeft'?-1:1);
    };
    window.addEventListener('keydown',keys,true);return()=>window.removeEventListener('keydown',keys,true);
  },[variant]);
  const turn=ease((progress-.12)/.85);
  const angle=turn*Math.PI;
  // Centre the physical footprint of the single-cover book, not an independent page layer.
  const shift=mobile?0:(angle<=Math.PI/2?-25:-25*(1+Math.cos(angle)));
  const variables={'--book-art':`url(${book})`,'--paper':`url(${paper})`};
  return <>
    <div className={`opening-study ${mobile?'study-mobile':''}`} data-variant={variant.id} data-playing={playing} data-progress={progress.toFixed(3)} style={variables}>
      <div className="study-original" style={{visibility:active?'hidden':'visible'}} inert={active?'':undefined}>{children}</div>
      {active&&<div className={`study-scene study-${variant.id.toLowerCase()}`}>
        {variant.id==='A'?<div className="study-side-rig" style={{transform:`translateX(${shift}%)`}}>
          <div className="study-fixed-right">{renderLeaf(mobile?start:start+1,mobile?'study-mobile-leaf':'study-right-leaf')}</div>
          <div className="study-hinge study-side-cover" style={{transform:`rotateY(${-180*turn}deg)`}}>
            <CoverFront logo={logo}/>
            <div className="study-cover-inside">{!mobile&&renderLeaf(start,'study-left-leaf')}</div>
          </div>
        </div>:<>
          <div className="study-underlay">
            {mobile?renderLeaf(start,'study-mobile-leaf'):<>{renderLeaf(start,'leaf-left')}{renderLeaf(start+1,'leaf-right')}</>}
          </div>
          {variant.id==='B'?<div className="study-hinge study-top-cover" style={{transform:`rotateX(${112*turn}deg)`}}><CoverFront logo={logo}/><div className="study-cover-lining"/></div>:<>
            <div className="study-hinge study-gate study-gate-left" style={{transform:`rotateY(${-115*turn}deg)`}}><CoverFront logo={logo} half="left"/><div className="study-cover-lining"/></div>
            <div className="study-hinge study-gate study-gate-right" style={{transform:`rotateY(${115*turn}deg)`}}><CoverFront logo={logo} half="right"/><div className="study-cover-lining"/></div>
          </>}
        </>}
        <button className="study-skip" aria-label="跳过开场，打开纪念册" onClick={()=>jump(1)}/>
      </div>}
    </div>
    <aside className="opening-study-controls" aria-label="开书动画方案比较">
      <div className="study-controls-row">
        <button onClick={()=>choose(-1)} aria-label="上一个开场方案"><ArrowLeft {...icon}/></button>
        <div className="study-variant-name" aria-live="polite"><strong>{variant.id} · {variant.name}</strong><span>{variant.description}</span></div>
        <button onClick={()=>choose(1)} aria-label="下一个开场方案"><ArrowRight {...icon}/></button>
        <span className="study-controls-divider"/>
        <button onClick={()=>playing?setPlaying(false):active?setPlaying(true):replay()} aria-label={playing?'暂停开场':'播放开场'}>{playing?<Pause {...icon}/>:<Play {...icon}/>}</button>
        <button onClick={replay} aria-label="重播开场"><ArrowCounterClockwise {...icon}/></button>
      </div>
      <input type="range" min="0" max="1000" value={Math.round(progress*1000)} onChange={e=>jump(Number(e.target.value)/1000)} aria-label="开场动画进度"/>
    </aside>
  </>;
}
