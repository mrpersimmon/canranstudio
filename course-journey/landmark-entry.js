// Touch browsers do not consistently count taps in click.detail. Observe
// normal, completed clicks so a pan or a cancelled press cannot open a lesson.
const DOUBLE_TAP_MS=350;
export function bindLandmarkEntry(map,enter) {
  const selector='button[data-landmark-select],button[data-map-course]';
  let press=null,lastTap=null;
  const reset=()=>{press=null;lastTap=null;};
  function start(event){
    const button=event.target.closest?.(selector);
    if(!button||!map.contains(button)||event.button!==0||!event.isPrimary||modified(event)){reset();return;}
    if(lastTap?.button!==button)lastTap=null;
    press={button,id:event.pointerId,type:event.pointerType,x:event.clientX,y:event.clientY,start:event.timeStamp,valid:true};
  }
  function measure(event){
    if(press?.id===event.pointerId&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>10){
      press.valid=false;lastTap=null;
    }
  }
  function end(event){
    if(press?.id!==event.pointerId)return;
    measure(event);press.end=event.timeStamp;
  }
  function cancelPress(){if(press)press.valid=false;lastTap=null;}
  function leave(event){
    if(press?.id===event.pointerId&&press.end===undefined&&!press.button.contains(event.relatedTarget))cancelPress();
  }
  function click(event){
    const button=event.target.closest?.(selector),tap=press,first=lastTap;
    reset();
    if(!button||event.button!==0||modified(event))return;
    if(tap?.button===button&&(!tap.valid||tap.end===undefined)){
      event.preventDefault();event.stopPropagation();return;
    }
    if(!tap||tap.button!==button)return;
    const touch=tap.type==='touch'||tap.type==='pen';
    if(touch&&tap.end-tap.start>DOUBLE_TAP_MS)return;
    const same=first?.button===button&&first.type===tap.type;
    const double=same&&(touch
      ? tap.end-first.end<=DOUBLE_TAP_MS&&Math.hypot(tap.x-first.x,tap.y-first.y)<=24
      : event.detail===2);
    if(!double){lastTap=tap;return;}
    // Consume the second click before the document's ordinary button handler
    // can cancel the navigation just requested by this shortcut.
    event.preventDefault();event.stopPropagation();enter(button);
  }
  const doc=map.ownerDocument,listeners=[
    [doc,'pointerdown',start],[doc,'scroll',cancelPress],[doc,'keydown',reset],
    [map,'pointermove',measure],[map,'pointerup',end],[map,'pointerout',leave],
    [map,'pointercancel',cancelPress],[map,'contextmenu',cancelPress],[map,'click',click]
  ];
  for(const [target,type,handler] of listeners)target.addEventListener(type,handler,true);
  return ()=>{
    for(const [target,type,handler] of listeners)target.removeEventListener(type,handler,true);
  };
}
function modified(event){return event.ctrlKey||event.metaKey||event.altKey||event.shiftKey;}
