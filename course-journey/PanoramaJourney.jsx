import React,{useEffect,useRef,useState} from 'react';
import {ArrowClockwise} from '@phosphor-icons/react';
import routeWorlds from './route-worlds';
import {Landmark} from './Landmark';
import './panorama.css';

function WorldStop({course,world,index,base,ground,groundReady,groundFailed,retryGround,selected,tap,celebration,onChoose,onArtReady,onPersonState,active,generation,renderInfo}){
 const character=routeWorlds.characters[course.id],position=routeWorlds.sceneFor(world,course.id);
 const [attempt,setAttempt]=useState(0),[person,setPerson]=useState('loading');
 const version=useRef(0),callback=useRef(onArtReady),personCallback=useRef(onPersonState);callback.current=onArtReady;personCallback.current=onPersonState;
 const ready=groundReady&&person==='ready',failed=groundFailed||person==='error';
 useEffect(()=>{callback.current(course.id,active&&ready,generation);},[active,ready,course.id,generation]);
 useEffect(()=>{personCallback.current(course.id,person,generation);},[person,course.id,generation]);
 function retry(){callback.current(course.id,false,generation);if(groundFailed)retryGround();version.current++;setPerson('loading');setAttempt(value=>value+1);}
 function loaded(event){
  const img=event.currentTarget,source=img.currentSrc,current=attempt;
  img.decode().then(()=>{if(img.isConnected&&img.currentSrc===source&&version.current===current)setPerson('ready');})
   .catch(()=>{if(img.isConnected&&version.current===current)setPerson('error');});
 }
 const mask=`radial-gradient(ellipse ${position.patchRadii[0]*100}% ${position.patchRadii[1]*100}% at ${position.feet[0]*100}% ${position.feet[1]*100}%,#000 65%,transparent 100%)`;
 return <article className="journey-module journey-world-stop" data-module-course={course.id} data-world-index={index} data-art-state={failed?'error':ready?'ready':'loading'} style={{'--journey-figure-bottom':position.visualBottom*100+'%'}}>
  <div className="journey-module-stage" data-module-stage={course.id}>
   <Landmark course={course} character={character} position={position} src={ground} selected={selected} tap={active?tap:null} celebration={active?celebration:null} onChoose={onChoose} artboardRatio={1} softMotion sheenMask={mask}>
    <span className="journey-world-ground-patch" data-ground-frame={course.id} style={{maskImage:mask,WebkitMaskImage:mask}}>
     <img className="journey-world-patch-source" data-module-ground={course.id} src={ground} alt="" width={world.width} height={world.height} draggable="false" style={{top:-index*world.height/(world.ids.length*world.width)*100+'%'}}/>
    </span>
    <img key={attempt} className="journey-module-character" data-story-course={course.id} src={base+'assets/course-journey/'+character.file+(attempt?'?retry='+attempt:'')} alt="" width={character.width} height={character.height} decoding="async" draggable="false" style={{left:position.feet[0]*100+'%',top:position.feet[1]*100+'%',width:position.width*100+'%',transform:`translate(-${character.anchor[0]*100}%,-${character.anchor[1]*100}%)`}} onLoad={loaded} onError={event=>{if(event.currentTarget.isConnected&&version.current===attempt){callback.current(course.id,false,generation);setPerson('error');}}}/>
   </Landmark>
   {!ready&&<div className="journey-module-status" role="status"><span>{failed?'场景暂时没准备好':'正在准备小场景…'}</span>{failed&&<button type="button" onClick={retry} aria-label={'重新加载 '+course.label+' 场景'}><ArrowClockwise size={18} aria-hidden="true"/>重新加载场景</button>}</div>}
  </div>
  {renderInfo(course)}
 </article>;
}

export function PanoramaJourney({chapter,courses,base,selected,tap,celebration,onChoose,onArtReady,generation,renderInfo,active=true,onSceneSettled}){
 const world=routeWorlds.worlds[chapter.id],slots=routeWorlds.visibleSlots(world,courses);
 const [attempt,setAttempt]=useState(0),[status,setStatus]=useState('loading'),version=useRef(0);
 const [people,setPeople]=useState({}),settledCallback=useRef(onSceneSettled),currentGeneration=useRef(generation);
 settledCallback.current=onSceneSettled;currentGeneration.current=generation;
 function personState(id,state,eventGeneration){
  if(eventGeneration!==currentGeneration.current)return;
  setPeople(old=>old[id]===state?old:{...old,[id]:state});
 }
 const ids=courses.map(course=>course.id).join(',');
 useEffect(()=>{
  const terminal=state=>state==='ready'||state==='error';
  if(!courses.length||status==='error'||(status==='ready'&&courses.every(course=>terminal(people[course.id]))))settledCallback.current?.(generation);
 },[status,people,ids,generation]);
 const ground=base+'assets/course-journey/'+world.file+(attempt?'?retry='+attempt:'');
 function retry(){version.current++;setStatus('loading');setAttempt(value=>value+1);}
 function loaded(event){const img=event.currentTarget,source=img.currentSrc,current=attempt;img.decode().then(()=>{if(img.isConnected&&img.currentSrc===source&&version.current===current)setStatus('ready');}).catch(()=>{if(img.isConnected&&version.current===current)setStatus('error');});}
 return <div className="journey-map-scene journey-modules journey-panorama" data-chapter={chapter.id} data-composition="modules" data-map-state="ready" data-empty={!slots.length}>
  <div className="journey-world" data-route-world={chapter.id} data-world-state={status} style={{'--journey-stop-ratio':world.width*world.ids.length/world.height}}>
   {!!slots.length&&<img key={attempt} className="journey-world-terrain" data-route-terrain src={ground} alt="" width={world.width} height={world.height} decoding="async" draggable="false" style={{top:-slots[0].index*100/slots.length+'%',visibility:status==='ready'?'visible':'hidden'}} onLoad={loaded} onError={event=>{if(event.currentTarget.isConnected&&version.current===attempt)setStatus('error');}}/>}
   {slots.map(slot=>slot.course?<WorldStop key={slot.course.id} course={slot.course} world={world} index={slot.index} base={base} ground={ground} groundReady={status==='ready'} groundFailed={status==='error'} retryGround={retry} selected={selected===slot.course.id} tap={tap} celebration={celebration} onChoose={onChoose} onArtReady={onArtReady} onPersonState={personState} active={active} generation={generation} renderInfo={renderInfo}/>:<div key={'passage:'+slot.index} className="journey-world-passage" aria-hidden="true"/>)}
  </div>
 </div>;
}
