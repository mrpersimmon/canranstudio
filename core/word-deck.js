(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.CanranCore.wordDeck=api;})(globalThis,function(root){
 'use strict';
 const labels={illustration:'插画词卡',context:'语境词卡'};
 let active=null;
 function contextParts(sentence,focus){
  const result=[],parts=Array.isArray(focus)?focus:[focus];let cursor=0;
  for(const part of parts){const at=sentence.toLowerCase().indexOf(part.toLowerCase(),cursor);if(at<0)throw Error('Context focus missing: '+part);if(at>cursor)result.push({text:sentence.slice(cursor,at),mark:false});result.push({text:sentence.slice(at,at+part.length),mark:true});cursor=at+part.length;}
  if(cursor<sentence.length)result.push({text:sentence.slice(cursor),mark:false});return result;
 }
 function createPages(words,profiles){
  const pages=[],ordered=Object.keys(labels).flatMap(kind=>words.filter(w=>profiles[w.en]?.kind===kind)),count=Math.ceil(ordered.length/6);
  for(let offset=0;offset<ordered.length;offset+=6){
   const selected=ordered.slice(offset,offset+6),kinds=new Set(selected.map(w=>profiles[w.en].kind));
   pages.push({kind:kinds.size===1?[...kinds][0]:'mixed',label:'词卡',local:offset/6,count,words:selected});
  }
  if(pages.flatMap(p=>p.words).length!==words.length)throw Error('Every word must have one group');
  return pages;
 }
 function sanitizePosition(value,words){
  if(!value||value.version!==1||!words.some(w=>w.en===value.anchor))return null;
  const anchors={};for(const kind of Object.keys(labels))if(words.some(w=>w.en===value.anchors?.[kind]))anchors[kind]=value.anchors[kind];
  return {version:1,anchor:value.anchor,anchors};
 }
 function restore(pages,words,saved,legacy){
  const current=sanitizePosition(saved,words),oldPage=Number.isInteger(legacy)?Math.max(0,Math.min(Math.ceil(words.length/6)-1,legacy)):0;
  if(!current&&!Number.isInteger(legacy))return {index:0,anchor:pages[0]?.words[0]?.en};
  const anchor=current?.anchor||words[oldPage*6]?.en||words[0]?.en;
  const index=Math.max(0,pages.findIndex(p=>p.words.some(w=>w.en===anchor)));
  return {index,anchor};
 }
 function mount({host,unit,practice,navigate,artwork}){
  const core=root.CanranCore,words=unit.learning.WORDS,profiles=core.learningWordCards,pages=createPages(words,profiles);
  const node=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n;};
  const button=(text,action,cls='btn btn-green')=>{const b=node('button',cls,text);b.type='button';b.onclick=action;return b;};
  let saved=sanitizePosition(practice.activity('unitWordDeck'),words),position=restore(pages,words,saved,practice.activity('unitWordPage')),index=position.index;
  const grid=node('div','unit-words'),controls=node('div','word-controls'),progress=node('span','');progress.id='wordPageProgress';progress.setAttribute('aria-live','polite');
  host.dataset.wordDeck='true';
  function save(anchor,legacy=false){
   saved={version:1,anchor,anchors:{...saved?.anchors,[profiles[anchor].kind]:anchor}};practice.activity('unitWordDeck',saved);
   if(legacy)practice.activity('unitWordPage',Math.floor(words.findIndex(w=>w.en===anchor)/6));
  }
  function show(next){index=Math.max(0,Math.min(pages.length-1,next));save(pages[index].words[0].en,true);render();practice.revealQuestion(host,host.querySelector('h3'));}
  const previous=button('上一组',()=>show(index-1),'btn btn-yellow'),next=button('下一组',()=>index===pages.length-1?navigate('learn/listen'):show(index+1));
  controls.append(previous,progress,next);host.append(grid,controls);
  function render(){
   const page=pages[index];grid.replaceChildren();grid.dataset.wordKind=page.kind;
   for(const [number,word]of page.words.entries()){
    const profile=profiles[word.en],card=button('',()=>{},'opt-btn unit-word');card.dataset.wordKind=profile.kind;card.setAttribute('aria-label',word.en);card.setAttribute('aria-expanded','false');
    const id=unit.id+'-deck-'+number,phonetic=node('small','word-phonetic',word.ph),meaning=node('span','word-meaning',word.cn),example=node('small','word-example',word.example||'');
    phonetic.lang='en-US';phonetic.id=id+'-phonetic';meaning.id=id+'-meaning';meaning.hidden=true;example.hidden=true;
    if(profile.kind==='context'){
     card.dataset.wordArt='context';card.dataset.wordPresentation=profile.presentation||'context';
     if(profile.presentation!=='word'){
      const sentence=node('span','word-context');sentence.lang='en';sentence.id=id+'-context';
      for(const part of contextParts(profile.sentence,profile.focus||word.en)){if(part.mark){const mark=node('mark','',part.text);if(/\s/.test(part.text))mark.dataset.phrase='true';sentence.append(mark);}else sentence.append(document.createTextNode(part.text));}card.append(sentence);
     }
    }else if(artwork){
     const art=artwork(word),slot=node('span','word-art');slot.dataset.kind=art.kind;slot.setAttribute('aria-hidden','true');for(const source of art.sources){const image=node('img','');image.src=source;image.alt='';image.draggable=false;slot.append(image);}card.append(slot);
    }else{const image=node('img','');image.src=core.learningWordArtwork?.[word.en]||word.image;image.alt='';image.draggable=false;card.append(image);}
    const frontDescription=[profile.kind==='context'&&profile.presentation!=='word'?id+'-context':'',phonetic.id].filter(Boolean).join(' ');
    card.setAttribute('aria-describedby',frontDescription);
    card.onclick=()=>{const expanded=card.getAttribute('aria-expanded')!=='true';card.setAttribute('aria-expanded',String(expanded));meaning.hidden=!expanded;example.hidden=!expanded||!word.example||word.example===profile.sentence;card.setAttribute('aria-describedby',expanded?phonetic.id+' '+meaning.id:frontDescription);save(word.en,true);};
    card.append(node('strong','',word.en),phonetic,meaning,example);grid.append(card);
   }
   previous.disabled=index===0;progress.textContent=(index+1)+' / '+pages.length;
   next.textContent=index===pages.length-1?'下一站':'下一组';
   next.setAttribute('aria-label',index===pages.length-1?'下一站：单词寻宝':next.textContent);next.toggleAttribute('data-station-next',index===pages.length-1);
  }
  save(position.anchor);render();
  active={current:()=>({page:index,kind:pages[index].kind,anchor:saved.anchor}),goPage:show,pages};return active;
 }
 return {createPages,sanitizePosition,restore,contextParts,mount,goPage:index=>{if(Number.isInteger(index))active?.goPage(index);},current:()=>active?.current()};
});
