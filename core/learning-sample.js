/* Lesson 1–24 reviewed visual sample. Compose teaching relations from reviewed artwork;
   never mutate words, question definitions, answers or the progress ledger. */
(function(core){
 'use strict';
 if(['unit13-14','unit15-16','unit17-18','unit19-20','unit21-22','unit23-24'].includes(core.learningContext?.id))document.body.dataset.learningSample='expanded';
 if(core.learningVisual)document.body.dataset.learningSample='whole-book';
 const original=core.learningFlow.prepare;
 const originalResize=core.learningFlow.resize;
 const questionArt=new Map(Object.entries(core.learningQuestionArtwork||{}));
 function prepareQuestionArt(surface){
  for(const image of surface.querySelectorAll('.picture-option img,img.practice-scene')){
   const source=(image.getAttribute('src')||'').split('?')[0],target=questionArt.get(source);
   if(target&&source!==target)image.src=target;
  }
 }
 function prepareQuestionDetails(surface){
  if(!core.learningVisual)return;
  const content=surface.querySelector('.practice-content'),picture=content?.querySelector('img.practice-scene:not(.practice-options img)'),button=content?.querySelector('.learning-context-preview');
  if(!picture||!button||button.dataset.reviewedMaterial)return;
  const originalScene=button.nextElementSibling?.classList.contains('learning-context-source')?button.nextElementSibling.querySelector('[class$="-application"]'):null;
  button.dataset.reviewedMaterial='true';button.setAttribute('aria-label','查看题目材料');
  button.querySelector('.learning-context-preview-copy>span').textContent='查看题目材料';
  const source=document.createElement('details');source.hidden=true;source.className='learning-material-source sample-question-details';content.append(source);
  button.onclick=()=>{const summary=document.createElement('summary');summary.textContent='题目材料';const image=picture.cloneNode(false);image.className='learning-material-image';source.replaceChildren(summary,image,...[...content.querySelectorAll('.practice-context,.task-reference')].filter(e=>!e.closest('.sample-question-details,.learning-context-source,.learning-material-source')).map(e=>e.cloneNode(true)));if(originalScene)source.append(originalScene.cloneNode(true));core.learningFlow.openReference(source,button);};
 }
 function sizeBackground(surface){
  const scene=surface.querySelector('.dialogue-stage');if(!scene)return;
  const width=Math.min(scene.clientWidth,document.body.classList.contains('unit34-workspace')?600:Infinity);
  const full=core.learningVisual?.fullScene;
  const paintedWidth=full?Math.min(width,Math.max(150,scene.clientHeight-132-(full.captionSpace||0))*1.5):width;
  scene.style.setProperty('--sample-bg-height',paintedWidth/1.5+'px');
  if(full)scene.style.setProperty('--sample-bg-width',paintedWidth+'px');
 }
 function sizeWords(surface){
  const content=surface.querySelector('.learning-word-content'),grid=content?.querySelector('.unit-words');
  if(!grid)return;
  const cards=[...grid.querySelectorAll(':scope>.unit-word:not([hidden])')];if(!cards.length)return;
  grid.dataset.wordLayout='balanced';
  const columns=matchMedia('(max-width:600px)').matches?2:3,fullRows=Math.ceil(6/columns),rows=Math.ceil(cards.length/columns),gap=10;
  const style=getComputedStyle(content),available=content.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
  if(available<=0)return;
  // Derive a fixed card size from a full page and keep natural row order.
  // Opening a meaning or reaching a short last group cannot change this size.
  const height=Math.floor(Math.max(surface.hasAttribute('data-word-deck')?132:140,Math.min(280,(available-gap*(fullRows-1))/fullRows)));
  grid.style.setProperty('--word-columns',String(columns*2));
  grid.style.setProperty('--word-rows',String(rows));
  grid.style.setProperty('--word-card-height',height+'px');
  for(const card of cards)card.style.gridColumn='span 2';
  for(const card of cards){
   const context=card.querySelector('.word-context');if(!context||card.getAttribute('aria-expanded')==='true')continue;
   context.style.removeProperty('font-size');
   const space=parseFloat(getComputedStyle(card).gridTemplateRows),maximum=parseFloat(getComputedStyle(context).fontSize);
   for(let size=maximum;size>=16;size-=.5){context.style.fontSize=size+'px';if(context.getBoundingClientRect().height<=space+.5)break;}
  }
 }
 const make=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text)e.textContent=text;return e;};
 function compose(card,spec){
  if(card.querySelector(':scope>.sample-word-art'))return;
  const slot=make('span','sample-word-art');slot.dataset.kind=spec.kind;slot.setAttribute('aria-hidden','true');
  for(const [i,src]of (spec.sources||[]).entries()){
   const part=make('span','sample-art-part'),image=make('img','');image.src=src;image.alt='';part.append(image);
   if(spec.scales?.[i])image.style.setProperty('--sample-part-scale',String(spec.scales[i]));
   if(spec.labels?.[i])part.append(make('span','sample-art-label',spec.labels[i]));
   if(spec.focus===i)part.dataset.focus='true';slot.append(part);
   if(spec.kind==='ownership'&&i===0)slot.append(make('span','sample-art-arrow','→'));
  }
  if(spec.text)slot.append(make('span','sample-art-text',spec.text));
  for(const item of card.querySelectorAll(':scope>img,:scope>.word-art'))item.hidden=true;
  card.prepend(slot);card.dataset.wordComposition=spec.kind;
 }
 core.learningFlow.prepare=function(surface,runner,view){
  if(view==='question')prepareQuestionArt(surface);
  original(surface,runner,view);
  if(view==='question'){prepareQuestionDetails(surface);if(core.learningVisual?.background){const background='url("'+core.learningVisual.background+'")';surface.style.setProperty('--sample-practice-world',background);for(const scene of surface.querySelectorAll(':is(.learning-context-source,.learning-material-source)>[class$="-application"]')){scene.dataset.sharedWorld='true';scene.style.setProperty('--sample-practice-world',background);}}}
  if(view==='story')sizeBackground(surface);
  if(view==='words'){
   for(const card of surface.querySelectorAll('.unit-word')){
    const spec=core.learningWordComposition?.[card.getAttribute('aria-label')];if(spec&&card.dataset.wordKind!=='context')compose(card,spec);
   }
   sizeWords(surface);
  }
 };
 core.learningFlow.resize=function(surface,view,prepared){
  originalResize(surface,view,prepared);
  if(!prepared){if(view==='story')sizeBackground(surface);if(view==='words')sizeWords(surface);}
 };
})(globalThis.CanranCore);
