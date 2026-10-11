import React, {useLayoutEffect, useRef} from 'react';
import './opening.css';

const DURATION=1800;
export function BookOpening({mobile,logo,leftPage,rightPage,onFinish,onError}){
  const root=useRef(null),rig=useRef(null),cover=useRef(null);
  const finish=useRef(()=>{});
  useLayoutEffect(()=>{
    let disposed=false,done=false,frame=0,fallback=0;
    const complete=(focus=false)=>{
      if(disposed||done)return;
      done=true;cancelAnimationFrame(frame);clearTimeout(fallback);onFinish(focus);
    };
    finish.current=complete;
    const preparation=setTimeout(()=>{if(!disposed&&!done)onError();},20000);
    // Decode the mounted images, including the real card on the inside cover.
    // Preloading a URL alone does not make a newly mounted image paint-ready.
    Promise.all([...root.current.closest('.book').querySelectorAll('img')].map(img=>img.decode())).then(()=>{
      if(disposed||done)return;
      clearTimeout(preparation);root.current.dataset.ready='true';
      const started=performance.now();
      const animate=now=>{
        if(disposed||done)return;
        const progress=Math.min(1,(now-started)/DURATION);
        const travel=Math.max(0,Math.min(1,(progress-.12)/.85));
        const turn=(1-Math.cos(Math.PI*travel))/2,angle=turn*Math.PI;
        const shift=mobile?0:angle<=Math.PI/2?-25:-25*(1+Math.cos(angle));
        rig.current.style.transform=`translateX(${shift}%)`;
        cover.current.style.transform=`rotateY(${-180*turn}deg)`;
        // Paint the final aligned frame before revealing the original pages.
        frame=requestAnimationFrame(progress===1?()=>complete():animate);
      };
      frame=requestAnimationFrame(animate);
      fallback=setTimeout(()=>complete(),DURATION+700);
    }).catch(()=>{if(!disposed&&!done){clearTimeout(preparation);onError();}});
    return()=>{disposed=true;cancelAnimationFrame(frame);clearTimeout(fallback);clearTimeout(preparation);};
  },[mobile,onFinish,onError]);
  return <div className="book-opening" ref={root} onClick={()=>finish.current(true)}>
    <div className="opening-spread" ref={rig} style={{transform:mobile?'translateX(0)':'translateX(-25%)'}}>
      <div className="opening-right-page" aria-hidden="true" inert="">{rightPage}</div>
      <button className="book-cover" ref={cover} aria-label="打开纪念册" style={{transform:'rotateY(0deg)'}}>
        <span className="cover-front"><span className="cover-emblem"><img src={logo} alt="灿然英语工作室" draggable="false"/></span></span>
        <div className="cover-back" aria-hidden="true">{!mobile&&leftPage}</div>
      </button>
    </div>
  </div>;
}
