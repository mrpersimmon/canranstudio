(function(root){
 'use strict';
 const node=(tag,text='',className='')=>{const el=document.createElement(tag);el.textContent=text;el.className=className;return el;};
 const button=(text,action)=>{const el=node('button',text,'opt-btn');el.type='button';el.addEventListener('click',action);return el;};
 const group=(label,className)=>{const el=node('div','',className);el.setAttribute('role','group');el.setAttribute('aria-label',label);return el;};
 const encoded=pairs=>pairs.length&&pairs.every(Boolean)?JSON.stringify(pairs):null;
 const normalizedWord=value=>value.trim().toLowerCase();
 function valid(q,state){
  if(q.type==='write')return typeof (state.draftValue??'')==='string'&&state.selection===(normalizedWord(state.draftValue||'')||null);
  if(q.type==='wordbank'){
   const tokens=state.tokens||[];
   return Array.isArray(tokens)&&tokens.length<=q.slots&&new Set(tokens).size===tokens.length&&tokens.every(i=>Number.isInteger(i)&&i>=0&&i<q.tokens.length)&&state.selection===(tokens.length===q.slots?tokens.map(i=>q.tokens[i]).join(' '):null);
  }
  if(q.type==='cloze'){
   const fills=state.fills||q.blanks.map(()=>null);
   return Array.isArray(fills)&&fills.length===q.blanks.length&&fills.every((v,i)=>v===null||q.blanks[i].options.includes(v))&&state.selection===encoded(fills);
  }
  if(q.type==='locate'||q.type==='scene-find')return state.selection===null||q.options.includes(state.selection);
  if(q.type==='handoff'){
   const selected=state.handoff||{object:null,recipient:null};
   return (selected.object===null||q.objects.some(x=>x.id===selected.object))&&
    (selected.recipient===null||q.recipients.some(x=>x.id===selected.recipient))&&
    state.selection===(selected.object&&selected.recipient?JSON.stringify([selected.object,selected.recipient]):null);
  }
  const pairs=state.pairs||Array(q.pairs.length).fill(null),ids=q.pairs.map(p=>p.id);
  return Array.isArray(pairs)&&pairs.length===ids.length&&pairs.every(id=>id===null||ids.includes(id))&&
   new Set(pairs.filter(Boolean)).size===pairs.filter(Boolean).length&&state.selection===encoded(pairs);
 }
 function matching({element,question:q,state,changed}){
  element.classList.add('task-input','matching-input');
  const grid=node('div','','match-grid'),left=group(q.leftLabel||'英文','match-column'),right=group(q.rightLabel||'词义','match-column match-meanings');
  const tally=node('p','','match-count');tally.setAttribute('aria-live','polite');grid.append(left,right);element.append(grid,tally);
  state.pairs ||= Array(q.pairs.length).fill(null);
  const ids=q.pairs.map(p=>p.id),order=state.matchOrder;
  if(!Array.isArray(order)||order.length!==ids.length||new Set(order).size!==ids.length||!order.every(id=>ids.includes(id))){
   state.matchOrder=ids.slice();for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.matchOrder[i],state.matchOrder[j]]=[state.matchOrder[j],state.matchOrder[i]];}
  }
  const leftButtons=[],rightButtons=[];
  function update(){
   leftButtons.forEach((b,i)=>{b.disabled=state.checked;b.setAttribute('aria-pressed',String(state.activePair===i));b.classList.toggle('is-paired',Boolean(state.pairs[i]));const matched=q.pairs.find(p=>p.id===state.pairs[i]);b.setAttribute('aria-description',matched?'已与“'+matched.cn+'”配对':'尚未配对');});
   rightButtons.forEach(b=>{const i=state.pairs.indexOf(b.dataset.pair);b.disabled=state.checked||!Number.isInteger(state.activePair);b.setAttribute('aria-pressed',String(i>=0));b.setAttribute('aria-description',i>=0?'已与 '+q.pairs[i].en+' 配对':'尚未配对');b.querySelector('.match-badge').textContent=i>=0?String(i+1):'–';});
   tally.textContent=`已配 ${state.pairs.filter(Boolean).length} / ${q.pairs.length} 对`;
  }
  q.pairs.forEach((pair,i)=>{
   const b=button('',()=>{if(state.checked)return;state.activePair=i;update();changed();});b.setAttribute('aria-label',pair.en);
   const badge=node('span',String(i+1),'match-badge');badge.setAttribute('aria-hidden','true');
   const word=node('span',pair.en);word.lang='en';b.append(badge,word);left.append(b);leftButtons.push(b);
  });
  state.matchOrder.forEach(id=>{
   const pair=q.pairs.find(p=>p.id===id),b=button('',()=>{
    if(state.checked||!Number.isInteger(state.activePair)||state.activePair<0||state.activePair>=q.pairs.length)return;
    const i=state.activePair,remove=state.pairs[i]===id;
    state.pairs=state.pairs.map((value,index)=>index===i?(remove?null:id):value===id?null:value);
    state.selection=encoded(state.pairs);update();changed();
   });
   b.dataset.pair=id;b.setAttribute('aria-label',pair.cn);
   const badge=node('span','–','match-badge');badge.setAttribute('aria-hidden','true');b.append(badge,node('span',pair.cn));right.append(b);rightButtons.push(b);
  });
  update();changed();return{update};
 }
 function locating({element,question:q,state,changed}){
  element.classList.add('task-input','locating-input');
  if(q.speaker){const who=node('div','','source-speaker'),pic=node('img');pic.src=q.speaker.image;pic.alt='';who.append(pic,node('span',q.speaker.name));element.append(who);}
  const sentence=group('原文选词','locate-sentence');sentence.lang='en';
  const buttons=[];
  q.fragments.forEach(part=>{
   if(typeof part==='string'){sentence.append(document.createTextNode(part));return;}
   const b=button(part.value,()=>{if(state.checked)return;state.selection=part.value;update();changed();});
   sentence.append(b);buttons.push(b);
  });
  element.append(sentence);
  function update(){buttons.forEach(b=>{b.disabled=state.checked;b.setAttribute('aria-pressed',String(b.textContent===state.selection));});}
  update();return{update};
 }
 function handoff({element,question:q,state,changed}){
  element.classList.add('task-input','handoff-input');
  const request=node('div','','handoff-request'),speech=node('p',q.request,'handoff-speech');speech.lang='en';
  if(q.speaker){const who=node('div','','source-speaker'),pic=node('img');pic.src=q.speaker.image;pic.alt='';who.append(pic,node('span',q.speaker.name+' 说'));request.append(who);}
  request.append(speech);element.append(request);
  const objects=group('待选物品','handoff-objects'),people=group('接收者','handoff-people');
  people.style.setProperty('--recipients',q.recipients.length);
  const board=node('div','','handoff-board'),source=node('div','','handoff-source'),destination=node('div','','handoff-destination');
  source.append(node('p','选物品','handoff-label'),objects);destination.append(node('p','递给谁','handoff-label'),people);board.append(source,destination);element.append(board);
  state.handoff ||= {object:null,recipient:null};
  const objectCards=[],personCards=[];
  function choose(key,id){
   if(state.checked)return;
   state.handoff[key]=state.handoff[key]===id?null:id;
   state.selection=state.handoff.object&&state.handoff.recipient?JSON.stringify([state.handoff.object,state.handoff.recipient]):null;
   update();changed();
  }
  q.objects.forEach((item,i)=>{
   const b=button('',()=>choose('object',item.id)),slot=node('span','','handoff-object-slot'),pic=node('img');
   b.setAttribute('aria-label',item.name);pic.src=item.image;pic.alt=item.name;pic.className='handoff-parcel';
   slot.append(pic);b.append(slot,node('span',['甲','乙','丙','丁'][i]||String(i+1),'handoff-object-name'));objects.append(b);objectCards.push({item,b,slot,pic});
  });
  q.recipients.forEach(person=>{
   const b=button('',()=>choose('recipient',person.id)),art=node('span','','handoff-person-art'),cast=node('span','','handoff-cast'),slot=node('span','','handoff-hand');
   b.setAttribute('aria-label',person.name);
   for(const path of person.images){const pic=node('img');pic.src=path;pic.alt='';cast.append(pic);}
   art.append(cast,slot);b.append(art,node('span',person.name,'handoff-person-name'));people.append(b);personCards.push({person,b,slot});
  });
  function update(){
   const done=state.checked&&state.correct;
   for(const {item,b,slot,pic}of objectCards){
    b.disabled=state.checked;b.setAttribute('aria-pressed',String(state.handoff.object===item.id));
    const recipient=done&&state.handoff.object===item.id?personCards.find(x=>x.person.id===state.handoff.recipient):null;
    (recipient?.slot||slot).append(pic);
    pic.classList.toggle('handoff-arrived',Boolean(recipient));slot.classList.toggle('is-empty',Boolean(recipient));
    pic.alt=recipient?'已送给'+recipient.person.name+'的'+item.name:item.name;
   }
   for(const {person,b}of personCards){b.disabled=state.checked;b.setAttribute('aria-pressed',String(state.handoff.recipient===person.id));}
  }
  update();return{update};
 }
 function cloze({element,question:q,state,changed}){
  element.classList.add('task-input','cloze-input');
  if(q.reference){const reference=node('p',q.reference,'task-reference');reference.lang=/[\u3400-\u9fff]/u.test(q.reference)?'zh-CN':'en';element.append(reference);}
  state.fills ||= q.blanks.map(()=>null);
  const rows=[];
  q.blanks.forEach((blank,i)=>{
   const row=group('第'+(i+1)+'处填空','cloze-row'),sentence=node('p','','cloze-sentence'),slot=node('span','','cloze-slot'),choices=node('div','','cloze-choices');
   sentence.lang='en';sentence.append(document.createTextNode(blank.before),slot,document.createTextNode(blank.after));slot.setAttribute('aria-live','polite');
   const buttons=blank.options.map(value=>{
    const b=button(value,()=>{if(state.checked)return;state.fills[i]=state.fills[i]===value?null:value;state.selection=encoded(state.fills);update();changed();});
    b.lang='en';choices.append(b);return b;
   });
   row.append(sentence,choices);element.append(row);rows.push({slot,buttons});
  });
  function update(){rows.forEach(({slot,buttons},i)=>{
   slot.textContent=state.fills[i]||'___';slot.classList.toggle('is-filled',Boolean(state.fills[i]));
   buttons.forEach(b=>{b.disabled=state.checked;b.setAttribute('aria-pressed',String(b.textContent===state.fills[i]));});
  });}
  update();return{update};
 }
 function sceneFind({element,question:q,state,changed}){
  element.classList.add('task-input','scene-find-input');
  const reference=node('p',q.reference,'task-reference');reference.lang='en';
  const scene=group('在场景中选择','scene-find-canvas'),picture=node('picture'),source=node('source'),img=node('img');
  source.media='(max-width:640px)';source.srcset=q.mobileScene;img.src=q.sceneImage;img.alt=q.sceneDescription;picture.append(source,img);scene.append(picture);
  const buttons=q.spots.map((spot,i)=>{
   const b=button('',()=>{if(state.checked)return;state.selection=state.selection===spot.id?null:spot.id;update();changed();});
   b.classList.add('scene-find-choice');b.setAttribute('aria-label',spot.name);
   for(const[axis,n]of ['x','y','w','h'].entries()){b.style.setProperty('--s'+n,spot.bounds[axis]+'%');b.style.setProperty('--m'+n,spot.mobileBounds[axis]+'%');}
   const badge=node('span',String(i+1),'scene-find-number');badge.setAttribute('aria-hidden','true');b.append(badge);scene.append(b);return{spot,b};
  });
  element.append(reference,scene);
  function update(){buttons.forEach(({spot,b})=>{b.disabled=state.checked;b.setAttribute('aria-pressed',String(state.selection===spot.id));});}
  update();return{update};
 }
 function writing({element,question:q,state,changed}){
  element.classList.add('task-input','writing-input');
  const sentence=node('label','','write-sentence'),field=node('input');
  sentence.lang='en';field.type='text';field.className='write-word';field.setAttribute('aria-label','缺少的英文单词');
  field.autocomplete='off';field.autocapitalize='none';field.spellcheck=false;field.maxLength=32;field.enterKeyHint='done';
  field.value=state.draftValue||'';
  sentence.append(document.createTextNode(q.before),field,document.createTextNode(q.after));element.append(sentence);
  let composing=false;
  function change(){state.draftValue=field.value;state.selection=normalizedWord(field.value)||null;changed();}
  field.addEventListener('compositionstart',()=>{composing=true;});
  field.addEventListener('compositionend',()=>{composing=false;change();});
  field.addEventListener('input',()=>{if(!composing)change();});
  const update=()=>{field.disabled=state.checked;};update();return{update};
 }
 function wordbank({element,question:q,state,changed}){
  element.classList.add('task-input','translation-input');
  const answer=group('已选词块','translation-answer'),bank=group('待选词块','wordbank translation-bank');
  answer.lang=bank.lang=q.language||'en';answer.style.setProperty('--word-slots',q.slots>4?3:q.slots);state.tokens ||= [];
  const order=state.tokenOrder;
  if(!Array.isArray(order)||order.length!==q.tokens.length||new Set(order).size!==q.tokens.length||!order.every(i=>Number.isInteger(i)&&i>=0&&i<q.tokens.length)){
   state.tokenOrder=q.tokens.map((_,i)=>i);
   for(let i=state.tokenOrder.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.tokenOrder[i],state.tokenOrder[j]]=[state.tokenOrder[j],state.tokenOrder[i]];}
  }
  element.append(answer,bank);
  function change(){state.selection=state.tokens.length===q.slots?state.tokens.map(i=>q.tokens[i]).join(' '):null;update();changed();}
  const choices=state.tokenOrder.map(i=>{
   const b=button(q.tokens[i],()=>{if(state.checked||state.tokens.length>=q.slots)return;state.tokens.push(i);change();});
   b.dataset.token=i;bank.append(b);return b;
  });
  function update(){
   answer.replaceChildren();
   for(let i=0;i<q.slots;i++){
    const token=state.tokens[i];
    if(token===undefined){const slot=node('span','…','translation-slot');slot.setAttribute('aria-label','第'+(i+1)+'个词块空位');answer.append(slot);}
    else{const b=button(q.tokens[token],()=>{if(state.checked)return;state.tokens.splice(i,1);change();choices.find(item=>Number(item.dataset.token)===token)?.focus({preventScroll:true});});b.setAttribute('aria-label','撤回 '+q.tokens[token]);b.disabled=state.checked;answer.append(b);}
   }
   if(q.suffix)answer.append(node('span',q.suffix,'translation-punctuation'));
   choices.forEach(b=>{const placed=state.tokens.includes(Number(b.dataset.token));b.disabled=state.checked||placed;b.classList.toggle('is-placed',placed);b.setAttribute('aria-pressed',String(placed));});
  }
  update();changed();return{update};
 }
 const views={match:matching,locate:locating,handoff,cloze,'scene-find':sceneFind,write:writing,wordbank};
 root.CanranCore.lesson49TaskInputs={supports:q=>Boolean(views[q.type]),valid,mount:args=>views[args.question.type](args)};
})(globalThis);
