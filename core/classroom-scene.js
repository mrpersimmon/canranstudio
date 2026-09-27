(function(root){
 'use strict';
 const core=root.CanranCore;
 const node=(tag,text='',className='')=>{const el=document.createElement(tag);el.textContent=text;el.className=className;return el;};
 function create(spec){
  const picture=(name,alt='')=>{const el=node('img');el.src='/assets/'+spec.unit+'/'+name+'.svg';el.alt=alt;return el;};
  function illustration(){
   const el=node('div','','classroom-illustration'), narrow=matchMedia('(max-width:640px)');
   function draw(){
    el.dataset.layout=narrow.matches&&spec.mobileSvg?'mobile':'desktop';
    el.innerHTML=el.dataset.layout==='mobile'?spec.mobileSvg:spec.svg;
    el.querySelector('svg').setAttribute('aria-hidden','true');
    paint(el,Number(el.dataset.frame??-1));
   }
   draw();if(spec.mobileSvg)narrow.addEventListener('change',draw);return el;
  }
  function paint(el,index){
   el.dataset.frame=String(index);
   el.querySelectorAll('[data-actor]').forEach(part=>part.classList.toggle('scene-speaker',part.dataset.actor===spec.speakers[index]||(spec.speakers[index]==='children'&&['girl','boy'].includes(part.dataset.actor))));
   el.querySelectorAll('[data-from]').forEach(part=>{part.style.display=index>=Number(part.dataset.from)&&index<=Number(part.dataset.to??999)?'':'none';});
   el.querySelectorAll('[data-focus]').forEach(part=>part.classList.toggle('scene-focus',part.dataset.focus.split(' ').includes(String(index))));
   for(const[key,steps]of Object.entries((el.dataset.layout==='mobile'?spec.mobileMoves:spec.moves)||{})){const part=el.querySelector('[data-part="'+key+'"]');if(part)part.style.transform=steps.filter(([at])=>index>=at).at(-1)?.[1]||'';}
  }
  function mount(stage,log){
   stage.classList.add('classroom-stage');if(spec.theatreVersion===2){stage.classList.add('is-story-theatre');stage.dataset.unit=spec.unit;stage.style.setProperty('--scene-wall',spec.wall);}if(spec.narration)stage.classList.add('is-narration');
   const view=illustration(),caption=node('p','','scene-caption');view.append(caption);view.setAttribute('role','img');stage.replaceChildren(view,log);
   return{showLine(index){paint(view,index);const label=spec.frames[Math.max(0,index)]||spec.title;caption.textContent=index<0?spec.title:label;view.setAttribute('aria-label',index<0?spec.title:label);
    view.querySelectorAll('[data-actor]').forEach(part=>part.classList.toggle('scene-speaker',part.style.display!=='none'&&(part.dataset.actor===spec.speakers[index]||(spec.speakers[index]==='children'&&['girl','boy'].includes(part.dataset.actor)))));
   }};
  }
  function taskView(){
   const element=node('div','','classroom-task'),head=node('div'),heading=node('h3','','classroom-question'),view=illustration(),result=node('p','','classroom-task-result');element.append(head,view,result);let effect;
   return{element,heading:()=>heading,present(q,progress){effect=spec.effects?.[q.id.split('final-v2-')[1]];head.replaceChildren(progress,heading);heading.textContent=q.prompt;heading.tabIndex=-1;element.hidden=false;view.hidden=!effect;result.hidden=!effect;result.textContent='';if(effect){view.setAttribute('role','img');view.setAttribute('aria-label',effect.beforeLabel);paint(view,effect.before);}},answer(value){
    element.dataset.checked=String(!!value);if(!effect)return;paint(view,value?effect.after:effect.before);view.setAttribute('aria-label',value?effect.afterLabel:effect.beforeLabel);result.textContent=value?effect.result:'';
   },finish(){element.hidden=true;}};
  }
  function result(id){const box=node('div','','classroom-keepsake');if(id==='text')return box;const art=picture('keepsake','本课场景纪念');if(id==='exam'&&spec.completionArt)art.src=spec.completionArt;box.append(art);box.append(node('p',id==='exam'?spec.finish:'这一站的线索整理好了。'));return box;}
  return{mount,taskView,result,art:()=>{const art=picture('keepsake');if(spec.completionArt)art.src=spec.completionArt;return art;},spec};
 }
 // Paginate the complete reference collection; switching cards never awards completion.
 function paginate(host,{items,render,size=1,key,label='图册'}){
  const practice=core.lesson49Practice,controls=node('div','','album-controls'),count=node('span');count.setAttribute('aria-live','polite');
  const total=Math.ceil(items.length/size),saved=practice.activity(key);let index=Number.isInteger(saved)?Math.max(0,Math.min(total-1,saved)):0;
  const button=(text,delta)=>{const b=node('button',text,'btn '+(delta<0?'btn-yellow':'btn-green'));b.type='button';b.onclick=()=>{index+=delta;show();};return b;};
  const prev=button('上一页'+label,-1),next=button('下一页'+label,1);controls.append(prev,count,next);host.before(controls);host.setAttribute('role','group');host.setAttribute('aria-label','当前'+label);host.classList.add('paged-reference');
  function show(){host.replaceChildren(...items.slice(index*size,index*size+size).map(render));prev.disabled=index===0;next.disabled=index===total-1;count.textContent=(index+1)+' / '+total;practice.activity(key,index);}
  show();
 }
 core.classroomScene={create,paginate};
})(globalThis);
