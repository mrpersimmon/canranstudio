import React,{useLayoutEffect,useRef,useState} from 'react';
import './modules.css';
import {PanoramaJourney} from './PanoramaJourney';
import {NavigationNotice} from '../student-ui/NavigationNotice';
import routeWorlds from './route-worlds';

// Keep the decoded outgoing scene until the incoming DOM images settle. A
// cached URL alone does not guarantee a newly mounted <img> has been decoded.
export function ModuleJourney(props){
 const [shown,setShown]=useState(()=>({chapter:props.chapter.id,scope:props.scopeKey}));
 const previous=useRef(props),latest=useRef(props);
 latest.current=props;
 const switching=shown.scope===props.scopeKey&&shown.chapter!==props.chapter.id;
 if(!switching)previous.current=props;
 // Never retain a different student's or a revoked authorization's picture.
 useLayoutEffect(()=>{
  if(shown.scope!==props.scopeKey)setShown({chapter:props.chapter.id,scope:props.scopeKey});
 },[props.scopeKey,props.chapter.id,shown.scope]);
 function settled(generation){
  const target=latest.current;
  if(generation!==target.generation)return;
  setShown(old=>old.chapter===target.chapter.id&&old.scope===target.scopeKey?old:{chapter:target.chapter.id,scope:target.scopeKey});
  target.onPresented?.(generation);
 }
 const layers=switching?[previous.current,props]:[props];
 return <div className="journey-panorama-switch" data-switching={switching} aria-busy={switching}>
  <img className="journey-world-distant" src={props.base+'assets/course-journey/'+routeWorlds.distant.file} alt="" aria-hidden="true" draggable="false" onLoad={event=>{event.currentTarget.style.visibility='visible';}} onError={event=>{event.currentTarget.style.visibility='hidden';}}/>
  {layers.map(layer=>{
   const staging=switching&&layer===props;
   return <div key={layer.scopeKey+':'+layer.chapter.id} className="journey-panorama-layer" data-staging={staging} inert={switching} aria-hidden={switching||undefined}>
    <PanoramaJourney {...layer} active={!switching} onSceneSettled={settled}/>
   </div>;
  })}
  {switching&&props.allowNotice&&<NavigationNotice kind="map" detail={props.chapter.label} onCancel={()=>props.onCancelSwitch(previous.current.selected)}/>}
 </div>;
}
