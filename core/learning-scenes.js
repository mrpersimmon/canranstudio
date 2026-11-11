/* Shared layout adapter for the existing story worlds. Story controllers retain
   their original poses, prop updates, reading gates and dialogue chronology. */
(function(core){
 'use strict';
 const previous=core.learningFlowOptions||{};
 const originals=new WeakMap(),textStyles=new WeakMap(),watched=new WeakSet();
 const shown=el=>el.getClientRects().length&&!el.closest('[hidden]')&&getComputedStyle(el).visibility!=='hidden'&&Number(getComputedStyle(el).opacity)!==0;
 function fitWorld(world){
  if(!originals.has(world))originals.set(world,{width:world.style.width,height:world.style.height,zoom:world.style.zoom});
  Object.assign(world.style,originals.get(world));
  const labels=[...world.querySelectorAll('*')].filter(el=>!el.childElementCount&&el.textContent.trim()&&!el.closest('svg')&&!['SCRIPT','STYLE'].includes(el.tagName));
  for(const label of labels){
   if(!textStyles.has(label))textStyles.set(label,{fontSize:label.style.fontSize,lineHeight:label.style.lineHeight});
   Object.assign(label.style,textStyles.get(label));
  }
  const base=world.getBoundingClientRect();if(!base.width||!base.height)return;
  const artPlane=[...world.children].find(child=>/(?:^|\s)[\w-]+-visual(?:\s|$)/.test(child.className));
  if(artPlane){
   const [w,h=1]=getComputedStyle(artPlane).aspectRatio.split('/').map(Number),ratio=w/h;
   if(ratio>0){const width=Math.min(base.width,base.height*ratio),height=width/ratio;artPlane.classList.add('learning-scene-plane');Object.assign(artPlane.style,{width:width+'px',height:height+'px',top:base.height-height+'px'});}
  }
  // Room illustrations and their percentage hotspots must share the same
  // aspect-ratio frame. Shrinking only the picture would detach the hotspots.
  const pictureGroup=[...world.children].find(child=>child.querySelector('picture'));
  if(pictureGroup){
   const image=pictureGroup.querySelector('picture img'),ratio=image?.naturalWidth/image?.naturalHeight||1;
   const height=Math.max(100,base.height-36),width=Math.min(base.width,height*ratio);
   pictureGroup.classList.add('learning-picture-group');
   pictureGroup.style.width=width+'px';pictureGroup.style.height=width/ratio+'px';pictureGroup.style.top=36+(height-width/ratio)/2+'px';
  }
  const fonts=labels.map(el=>({el,size:parseFloat(getComputedStyle(el).fontSize)}));
  let scale=1,fits=false;
  for(let pass=0;pass<7;pass++){
   world.style.zoom=String(scale);world.style.width=base.width/scale+'px';world.style.height=base.height/scale+'px';
   for(const {el,size}of fonts)if(size*scale<12){el.style.fontSize=12/scale+'px';el.style.lineHeight=16/scale+'px';}
   const box=world.getBoundingClientRect(),items=[...world.querySelectorAll('img,svg'),...labels].filter(shown).map(el=>el.getBoundingClientRect());
   if(!items.length){fits=true;break;}
   const left=Math.min(...items.map(r=>r.left)),right=Math.max(...items.map(r=>r.right)),top=Math.min(...items.map(r=>r.top)),bottom=Math.max(...items.map(r=>r.bottom));
   fits=left>=box.left-1&&right<=box.right+1&&top>=box.top-1&&bottom<=box.bottom+1;
   if(fits)break;
   const ratio=Math.min(.96,box.width/(right-left+12),box.height/(bottom-top+12),box.height/Math.max(box.height,box.bottom-top+6));
   const next=scale*ratio;if(next<.3)break;scale=next;
  }
  world.dataset.sceneScale=scale.toFixed(3);world.dataset.sceneFit=fits?'ready':'overflow';
 }
 function prepare(scene){
  const log=scene.querySelector('.dialogue-log');
  const surface=scene.closest('.shop-stage');
  if(log.parentElement!==scene){
   const oldReader=log.parentElement;scene.append(log);
   const controls=oldReader.querySelector('.stage-ctrl');if(controls)surface.append(controls);
   if(!oldReader.childElementCount)oldReader.remove();
  }
  const world=[...scene.children].find(child=>child!==log&&!child.contains(log));
  if(world){
   scene.classList.add('learning-scene-stacked','learning-scene-unified');world.classList.add('learning-story-art');fitWorld(world);
   const artHeight=world.getBoundingClientRect().height+'px';if(scene.style.getPropertyValue('--learning-story-art-height')!==artHeight)scene.style.setProperty('--learning-story-art-height',artHeight);
   for(const image of world.querySelectorAll('picture img'))if(!watched.has(image)){watched.add(image);image.addEventListener('load',()=>{if(scene.closest('.learning-surface'))prepare(scene);});}
  }
  for(const button of log.querySelectorAll('.bbtns button[aria-expanded]')){
   const expanded=button.getAttribute('aria-expanded')==='true',label=expanded?'收起中文':'看中文',text=expanded?'收起':'中文';
   if(button.getAttribute('aria-label')!==label)button.setAttribute('aria-label',label);
   if(button.textContent!==text)button.textContent=text;
  }
  const finish=surface.querySelector(':scope>.practice-finish'),status=surface.querySelector('.dialogue-status');
  const advance=surface.querySelector('.stage-ctrl>.btn-green');
  if(advance){
   const text=advance.textContent;
   if(text==='开始看课文')advance.textContent='开始故事';
   if(text==='完成课文'){advance.textContent='去练习';advance.dataset.storyFinal='true';}
   else if(text!=='去练习')delete advance.dataset.storyFinal;
  }
  if(finish&&!finish.hidden&&status){
   const count=status.textContent.match(/\d+\s*\/\s*\d+/)?.[0],summary=count&&count+' · 故事看完了';if(summary&&status.textContent!==summary)status.textContent=summary;
   const title=finish.querySelector(':scope>p');if(title)title.remove();
   const next=finish.querySelector('.practice-finish-actions button[data-station-next]');
   if(next){
    let actions=next.closest('.station-actions');
    if(!actions){actions=document.createElement('div');actions.className='station-actions';next.before(actions);actions.append(next);}
    if(!actions.querySelector('.station-destination')){const label=document.createElement('p');label.className='station-destination';label.textContent='接下来：'+next.getAttribute('aria-label').replace(/^下一站：/,'');actions.prepend(label);}
   }
  }
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-story-final]');if(!button)return;
  const surface=button.closest('.shop-stage');
  // Let the original controller validate every read line and persist completion
  // first. Only that successful completion can advance to its existing route.
  const finish=surface.querySelector(':scope>.practice-finish');if(finish&&!finish.hidden)finish.querySelector('[data-station-next]')?.click();
 });
 core.learningFlowOptions={...previous,prepareStory(scene){
  prepare(scene);
  previous.prepareStory?.(scene);
 },resizeStory(scene){if(scene)prepare(scene);previous.resizeStory?.(scene);}};
})(globalThis.CanranCore);
