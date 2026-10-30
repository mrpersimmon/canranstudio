import React,{useLayoutEffect,useRef} from 'react';
import cardLayout from '../core/award-card-layout.js';
import paper from '../assets/awards/paper.webp';
import star from '../assets/awards/star-earned.webp';
import emptyStar from '../assets/awards/star-empty.webp';
import '../core/award-card-layout.css';
import '../assets/awards/typography-45-46.css';

// The existing keepsake's content and shared layout remain authoritative.
// A fixed design plane scales as one object, including long names and stars.
export function Certificate({card,mini=false,lazy=false}){
 return <article className={`award-paper award-card ${mini?'mini-certificate':'certificate'}`} data-stars={card.stars} data-unit={card.course}
  style={{...cardLayout.typography(card.title,card.name,card.course),'--accent':card.color,'--paper':`url(${paper})`,'--earned-star':`url(${star})`}}
  aria-label={`${card.lesson} ${card.title}，${card.name}，${card.stars} 颗星`}>
  <img className="card-scene" src={card.scene} alt={mini?'':card.alt} draggable="false" loading={lazy?'lazy':'eager'}/>
  <p className="card-brand">灿然英语工作室</p><h2 className="card-title">{card.title}</h2><p className="card-name">{card.name}</p>
  <div className="card-stars" aria-label={`${card.stars} / 5 颗星`}>{Array.from({length:5},(_,i)=><span className="award-star" data-earned={i<card.stars} style={{'--star-order':i}} key={i}><img src={i<card.stars?star:emptyStar} alt="" draggable="false"/>{!mini&&i<card.stars&&<span className="star-glint" aria-hidden="true"/>}</span>)}</div>
  <p className="card-caption"><span>{card.lesson}</span>{card.stars===5&&card.date&&<time dateTime={card.date.replaceAll('.','-')}>{card.date}</time>}</p>
  {!mini&&card.stars===5&&<span className="gold-light-ring" aria-hidden="true"/>}
 </article>;
}
export function CardFrame({card,mini=false,lazy=false}){
 const ref=useRef(null);
 useLayoutEffect(()=>{
  const node=ref.current;
  const update=()=>node.style.setProperty('--card-scale',String(node.clientWidth/1640));
  // offsetWidth is unaffected by the hero's tilt; ResizeObserver preserves
  // fractional widths and never resizes the observed frame itself.
  const initial=node.clientWidth;node.style.setProperty('--card-scale',String(initial/1640));
  if(typeof ResizeObserver==='undefined'){update();window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update);}
  const observer=new ResizeObserver(entries=>node.style.setProperty('--card-scale',String(entries[0].contentRect.width/1640)));
  observer.observe(node);return()=>observer.disconnect();
 },[]);
 return <div ref={ref} className={`card-frame ${mini?'is-mini':''}`} aria-hidden={mini?'true':undefined}><div className="card-design-plane"><Certificate card={card} mini={mini} lazy={lazy}/></div></div>;
}
