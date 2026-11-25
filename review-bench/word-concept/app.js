(async function(){
 'use strict';
 const params=new URLSearchParams(location.search),frameId=params.get('request');let requestId=frameId;
 const $=id=>document.getElementById(id),el=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n;};
 const send=(type,extra={})=>parent.postMessage({type,requestId,...extra},location.origin);
 let groups=[],at=0,selection={unit:'unit1-2',page:params.get('page'),state:params.get('state')||'collapsed',device:params.get('device'),stars:5};
 const setExpanded=(card,expanded)=>{card.setAttribute('aria-expanded',String(expanded));card.querySelector('.card-front').hidden=expanded;card.querySelector('.card-back').hidden=!expanded;};
 function makeCard(word){
  const card=el('button','sample-card');card.type='button';card.dataset.word=word.en;card.dataset.kind=word.type;card.setAttribute('aria-label',word.en);card.title=word.en+' · Lesson '+word.unit.slice(4).replace('-','–');
  const front=el('span','card-front'),back=el('span','card-back');
  if(word.type==='context'){
   const sentence=el('span','card-context'),index=word.example.toLowerCase().indexOf(word.en.toLowerCase());sentence.lang='en';
   sentence.append(document.createTextNode(word.example.slice(0,index)),el('mark','',word.example.slice(index,index+word.en.length)),document.createTextNode(word.example.slice(index+word.en.length)));front.append(sentence);
  }else{const picture=el('img','card-picture');picture.src='/lesson'+word.asset;picture.alt='';front.append(picture);}
  for(const face of [front,back]){const wordName=el('strong','card-word',word.en),phonetic=el('span','card-phonetic',word.ph);wordName.lang='en';phonetic.lang='en';face.append(wordName,phonetic);}
  back.append(el('span','card-meaning',word.cn));card.append(front,back);setExpanded(card,false);
  card.onclick=()=>{setExpanded(card,card.getAttribute('aria-expanded')!=='true');selection.state=groups[at].node.querySelector('[aria-expanded=true]')?'expanded':'collapsed';send('review-position',{selection});};
  return card;
 }
 function show(index,state='collapsed',announce=false){
  at=Math.max(0,Math.min(groups.length-1,index));selection={...selection,page:groups[at].id,state};
  groups.forEach((group,i)=>{group.node.hidden=i!==at;});
  for(const card of groups[at].node.children)setExpanded(card,state==='expanded');
  $('context-tab').setAttribute('aria-pressed',String(at===0));$('illustration-tab').setAttribute('aria-pressed',String(at===1));
  $('sample-title').textContent=at===0?'在句子里认识单词':'看插画认识单词';
  $('position').textContent=at===0?'6 张语境词卡':'6 张插画词卡';
  $('next').textContent=at===0?'看插画词卡':'看语境词卡';$('cards').scrollTop=0;
  if(announce)send('review-position',{selection});
 }
 try{
  const response=await fetch('/review/word-concept/data.json');if(!response.ok)throw Error('样板内容未能加载');
  const data=await response.json();groups=data.groups.map(group=>{const node=el('section','sample-group');node.setAttribute('aria-label',group.title);node.append(...group.cards.map(makeCard));$('cards').append(node);return {...group,node};});
  show(Math.max(0,groups.findIndex(g=>g.id===selection.page)),selection.state);
  $('context-tab').onclick=()=>show(0,selection.state,true);$('illustration-tab').onclick=()=>show(1,selection.state,true);
  $('next').onclick=()=>show(at===0?1:0,selection.state,true);
  // Both groups stay mounted. Decode their images before allowing the
  // first tab swap; changing a state never reloads this frame or reads storage.
  await Promise.all([...document.images].map(image=>image.decode()));await document.fonts.ready;
  addEventListener('message',event=>{
   const data=event.data;if(event.source!==parent||event.origin!==location.origin||data?.frameId!==frameId||data.type!=='review-apply')return;
   const index=groups.findIndex(g=>g.id===data.selection?.page);if(index<0)return;
   requestId=data.requestId;selection={...selection,...data.selection};show(index,selection.state);send('review-ready',{selection,fastStates:true});
  });
  send('review-ready',{selection,fastStates:true});
 }catch(error){$('sample-error').hidden=false;$('sample-error').textContent=error.message;send('review-error',{message:error.message});}
})();
