import React,{useLayoutEffect,useRef} from 'react';
import {X} from '@phosphor-icons/react';
export function Modal({children,label,onClose,className='',heading=label,closeLabel='关闭'+label}){
 const ref=useRef(null),closeRef=useRef(onClose);closeRef.current=onClose;
 useLayoutEffect(()=>{
  const dialog=ref.current,previous=document.activeElement,old=document.body.style.overflow;
  const viewport=window.visualViewport;
  const fit=()=>{dialog.style.setProperty('--visible-height',(viewport?.height||innerHeight)+'px');dialog.style.setProperty('--visible-top',(viewport?.offsetTop||0)+'px');};
  fit();dialog.showModal();document.body.style.overflow='hidden';viewport?.addEventListener('resize',fit);viewport?.addEventListener('scroll',fit);window.addEventListener('resize',fit);
  return()=>{dialog.close();document.body.style.overflow=old;viewport?.removeEventListener('resize',fit);viewport?.removeEventListener('scroll',fit);window.removeEventListener('resize',fit);if(previous?.isConnected)previous.focus?.({preventScroll:true});};
 },[]);
 return <dialog ref={ref} className={`postoffice-dialog ${className}`} aria-label={label} onCancel={e=>{e.preventDefault();closeRef.current();}} onClick={e=>{if(e.target===e.currentTarget)closeRef.current();}}>
  <header className="postoffice-dialog-heading"><h2>{heading}</h2><button type="button" className="icon-button" aria-label={closeLabel} onClick={onClose}><X size={24}/></button></header>
  <div className="postoffice-dialog-body">{children}</div>
 </dialog>;
}
