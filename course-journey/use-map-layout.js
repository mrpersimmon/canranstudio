import {useLayoutEffect,useState} from 'react';
import artwork from './scene-layout';
import overlays from './overlay-layout';
import allArtwork from './chapter-layout';

// The illustration and its landmarks share one artboard. Only the camera
// crops decorative edges; it never stretches the image independently of UI.
export function useMapLayout(mapRef,desktop,scenes=artwork.scenes,contentKey=''){
  const [layout,setLayout]=useState(null);
  useLayoutEffect(()=>{
    const map=mapRef.current,home=map?.closest('.journey-home');
    if(!map||!home)return;
    const header=document.querySelector('#siteHeader'),sidebar=home.querySelector('.journey-sidebar'),tools=home.querySelector('.journey-tools'),dock=home.querySelector('.journey-dock'),nav=home.querySelector('.journey-bottom-nav')||document.querySelector('[data-student-bottom-nav]');
    const height=element=>element?.getBoundingClientRect().height||0;
    // Scroll avoidance and painted page space serve different purposes. The
    // existing scene tail can sit behind the rounded dock without hiding a
    // Lesson button; adding the full avoidance margin outside it exposed paper.
    const chrome=tail=>{
      const obstruction=desktop?0:height(dock)+height(nav);
      const overlap=Math.min(24,Math.max(0,tail-16));
      return {
        bottomReserve:desktop?0:Math.ceil(obstruction+16),
        bottomPadding:desktop?0:Math.max(0,Math.ceil(obstruction-overlap)),
        stickyOffset:desktop?0:Math.max(0,Math.round((tools?.getBoundingClientRect().top||0)-(sidebar?.getBoundingClientRect().top||0)-8))
      };
    };
    let frame;
    const measure=()=>{
      const width=map.clientWidth;
      if(!width)return;
      if(!scenes){
        const scene=map.querySelector('.journey-map-scene');
        const captions=[...map.querySelectorAll('[data-map-info]')].filter(node=>!node.closest('[data-staging=true]'));
        const tail=scene&&captions.length?scene.getBoundingClientRect().bottom-Math.max(...captions.map(node=>node.getBoundingClientRect().bottom)):0;
        const next=chrome(tail);
        setLayout(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
        return;
      }
      // Use layout dimensions, not the map's scrolled screen position. This
      // prevents a resize/scroll feedback loop and keeps selection stationary.
      // Dock copy changes when a course is selected. It may reserve more page
      // scroll space, but must not switch the composition or zoom the artwork.
      const viewportHeight=Math.max(1,window.innerHeight-height(header));
      let composition=width>=600&&width/viewportHeight>=1?'landscape':'portrait';
      const calculate=kind=>overlays.fitFrame({scene:scenes[kind],characters:allArtwork.characters,viewportWidth:width,desktop,composition:kind});
      let next=calculate(composition);
      // A wide screen is not enough when any part of the complete entry stack
      // comes within 12px of another course. Prefer the portrait composition.
      if(composition==='landscape'&&next.overlays.collisions.length){composition='portrait';next=calculate(composition);}
      // Keep 16px above the dock plus a 2px underlap for fractional pixel and
      // scroll rounding, without scaling or moving the original artboard.
      if(!desktop)next.height=Math.max(next.height,next.top+next.overlays.bottom+18);
      Object.assign(next,chrome(next.height-next.top-next.overlays.bottom));
      setLayout(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
    };
    const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
    const observer=new ResizeObserver(schedule);
    [map,header,sidebar,dock,nav].filter(Boolean).forEach(element=>observer.observe(element));
    window.addEventListener('resize',schedule);measure();
    return()=>{observer.disconnect();window.removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
  },[mapRef,desktop,scenes,contentKey]);
  return layout;
}
