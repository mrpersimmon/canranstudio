import {useEffect,useState} from 'react';
const KEY='canran-award-book-v1:motion',EVENT='canran:keepsake-motion';
let inPageChoice=null;
function preference(){
 if(inPageChoice!==null)return inPageChoice;
 for(const storage of ['localStorage','sessionStorage'])try{const value=window[storage].getItem(KEY);if(value==='on'||value==='off')return value==='on';}catch{}
 return null;
}
export function useKeepsakeMotion(){
 const [choice,setChoice]=useState(preference),[system,setSystem]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)'),updateSystem=()=>setSystem(media.matches),sync=()=>setChoice(preference());
  const storage=event=>{if(event.key===KEY||event.key===null){inPageChoice=null;sync();}};
  media.addEventListener('change',updateSystem);window.addEventListener('storage',storage);window.addEventListener(EVENT,sync);
  return()=>{media.removeEventListener('change',updateSystem);window.removeEventListener('storage',storage);window.removeEventListener(EVENT,sync);};
 },[]);
 const enabled=choice===null?!system:choice;
 // Storage can be unavailable in embedded browsers. Keep the visible setting
 // for this page and its other consumers even when persistence is denied.
 const toggle=()=>{const next=!enabled;inPageChoice=next;setChoice(next);try{localStorage.setItem(KEY,next?'on':'off');}catch{try{sessionStorage.setItem(KEY,next?'on':'off');}catch{}}window.dispatchEvent(new Event(EVENT));};
 return {enabled,reduced:!enabled,toggle};
}
