import React,{useEffect,useRef,useState} from 'react';

function useReducedMotion(){
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setReduced(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  return reduced;
}

export function Landmark({course,character,position,src,selected,tap,celebration,onChoose,onError,children,artboardRatio,softMotion=false,sheenMask}){
  const motion=useRef(),sheen=useRef(),bounce=useRef(),pointer=useRef(),suppress=useRef(false),lastTap=useRef(),lastCelebration=useRef();
  const [pressed,setPressed]=useState(false),reduced=useReducedMotion();
  useEffect(()=>{
    bounce.current?.cancel();
    const fresh=lastTap.current!==tap;lastTap.current=tap;
    if(fresh&&!reduced&&tap?.id===course.id){
      const animation=motion.current.animate([
        {transform:softMotion?'scale(.992)':'scale(.97)',offset:0},
        {transform:softMotion?'scale(1.012)':'scale(1.035)',offset:.43},
        {transform:softMotion?'scale(.998)':'scale(.995)',offset:.75},
        {transform:'scale(1)',offset:1}
      ],{duration:380,easing:'ease-out'});
      bounce.current=animation;
    }
    return()=>bounce.current?.cancel();
  },[tap,reduced,course.id,softMotion]);
  useEffect(()=>{
    const fresh=lastCelebration.current!==celebration;lastCelebration.current=celebration;
    if(!fresh||reduced||celebration?.id!==course.id)return;
    const animation=sheen.current.animate([
      {opacity:0,backgroundPosition:'180% 0',offset:0},
      {opacity:.8,backgroundPosition:'100% 0',offset:.22},
      {opacity:.65,backgroundPosition:'-40% 0',offset:.62},
      {opacity:0,backgroundPosition:'-80% 0',offset:1}
    ],{duration:1000,easing:'ease-in-out'});
    return()=>animation.cancel();
  },[celebration,reduced,course.id]);
  function release(cancel=false){if(pointer.current)bounce.current?.cancel();setPressed(false);if(cancel)suppress.current=true;pointer.current=null;}
  function press(event){
    if(event.button!==0||event.isPrimary===false)return;
    suppress.current=false;pointer.current={id:event.pointerId,x:event.clientX,y:event.clientY};bounce.current?.cancel();setPressed(true);
    if(!reduced)bounce.current=motion.current.animate([{transform:'scale(1)'},{transform:softMotion?'scale(.992)':'scale(.97)'}],{duration:80,easing:'ease-out'});
  }
  return <button type="button" className="journey-landmark-select" data-landmark-select={course.id} data-pressed={pressed}
    aria-pressed={selected} aria-label={`选择场景：${course.label} ${course.title}`}
    style={children?{inset:0,width:'100%',height:'100%',transform:'none'}:{left:position.feet[0]*100+'%',top:position.feet[1]*100+'%',width:position.width*100+'%',transform:`translate(-${character.anchor[0]*100}%,-${character.anchor[1]*100}%)`}}
    onPointerDown={press}
    onPointerMove={event=>{const start=pointer.current;if(start&&start.id===event.pointerId&&Math.hypot(event.clientX-start.x,event.clientY-start.y)>10){bounce.current?.cancel();suppress.current=true;setPressed(false);}}}
    onPointerUp={()=>release()} onPointerCancel={()=>release(true)} onPointerLeave={()=>release(true)}
    onClick={event=>{if(event.detail>0&&suppress.current){suppress.current=false;return;}setPressed(false);onChoose(course.id);}}>
    <span className="journey-story-motion" ref={motion} style={{transformOrigin:children?`${position.feet[0]*100}% ${position.feet[1]*100}%`:`${character.anchor[0]*100}% ${character.anchor[1]*100}%`,...(children?{width:'100%',height:artboardRatio?'auto':'100%',...(artboardRatio?{aspectRatio:artboardRatio}:{})}:{})}}>
      {children||<img className={'journey-story-art'+(course.id==='unit1-2'?' journey-couple':'')} data-story-course={course.id} src={src} alt="" width={character.width} height={character.height} decoding="async" draggable="false" onError={onError}/>}
      <span className="journey-story-sheen" ref={sheen} aria-hidden="true" style={{maskImage:sheenMask||`url("${src}")`,WebkitMaskImage:sheenMask||`url("${src}")`}}/>
    </span>
  </button>;
}

export function CompletionMedal({course,base,celebration,onReplay}){
  const icon=useRef(),lastCelebration=useRef(),reduced=useReducedMotion(),[failed,setFailed]=useState(false);
  useEffect(()=>{
    const fresh=lastCelebration.current!==celebration;lastCelebration.current=celebration;
    if(!fresh||failed||reduced||celebration?.id!==course.id)return;
    const star=[...icon.current.closest('.journey-map-stars').querySelectorAll('.journey-star[data-earned=true]')].at(-1);
    const animations=[icon.current.animate([
      {transform:'scale(1)'},{transform:'scale(.85)',offset:.2},{transform:'scale(1.16)',offset:.55},{transform:'scale(1)'}
    ],{duration:550,delay:350,easing:'ease-out'})];
    if(star)animations.push(star.animate([
      {transform:'translateY(0) scale(1)'},{transform:'translateY(-5px) scale(1.2)',offset:.4},{transform:'translateY(0) scale(1)'}
    ],{duration:650,easing:'ease-out'}));
    return()=>animations.forEach(animation=>animation.cancel());
  },[celebration,reduced,course.id,failed]);
  return <button type="button" className="journey-completion-medal" data-completion-medal={course.id} data-landmark-course={course.id}
    style={{'--journey-medal-image':`url("${base}assets/course-journey/starflower-medal-v1.webp")`,'--medal-delay':`${-Number(course.id.match(/\d+/)?.[0]||1)*.32}s`}}
    aria-label={`重看 ${course.label} 满星纪念`} title="满星纪念 · 点击重看" onClick={()=>onReplay(course.id)}>
    {failed?<span className="journey-medal-fallback" aria-hidden="true">满星</span>:<span className="journey-medal-face" ref={icon} aria-hidden="true"><img src={base+'assets/course-journey/starflower-medal-v1.webp'} alt="" draggable="false" onError={()=>setFailed(true)}/><span className="journey-star-glint journey-medal-glint"/></span>}
  </button>;
}
