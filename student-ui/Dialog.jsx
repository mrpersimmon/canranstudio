import React,{useLayoutEffect,useRef} from 'react';
import {X} from '@phosphor-icons/react';
import './styles.css';

export function StudentDialog({label,children,onClose}){
 const ref=useRef(null),close=useRef(onClose);close.current=onClose;
 useLayoutEffect(()=>{
  const dialog=ref.current,previous=document.activeElement,overflow=document.body.style.overflow,viewport=window.visualViewport;
  const fit=()=>{dialog.style.setProperty('--student-visible-height',(viewport?.height||innerHeight)+'px');dialog.style.setProperty('--student-visible-top',(viewport?.offsetTop||0)+'px');};
  fit();dialog.showModal();document.body.style.overflow='hidden';
  viewport?.addEventListener('resize',fit);viewport?.addEventListener('scroll',fit);window.addEventListener('resize',fit);
  return()=>{dialog.close();document.body.style.overflow=overflow;viewport?.removeEventListener('resize',fit);viewport?.removeEventListener('scroll',fit);window.removeEventListener('resize',fit);if(previous?.isConnected)previous.focus?.({preventScroll:true});};
 },[]);
 return <dialog ref={ref} className="student-dialog student-account-sheet" aria-label={label} onCancel={event=>{event.preventDefault();close.current();}} onClick={event=>{if(event.target===event.currentTarget)close.current();}}>
  <header className="student-dialog-heading"><h2>{label}</h2><button type="button" className="student-dialog-close" aria-label={'关闭'+label} onClick={onClose}><X size={23} aria-hidden="true"/></button></header>
  <div className="student-dialog-body">{children}</div>
 </dialog>;
}
