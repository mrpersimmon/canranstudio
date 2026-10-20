(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
const picture=(name,alt,cls='',extension='svg')=>{const e=node('img',cls);e.src='/assets/unit15-16/'+name+'.'+extension;e.alt=alt;return e;};
function storyProps(){
 const element=node('div','travel-world');element.setAttribute('role','group');element.setAttribute('aria-label','海关官员与两位姑娘的检查站');
 const cast=node('div','travel-cast'),location=node('p','travel-location','海关检查站');
 for(const [who,name,asset,alt]of [['officer','海关官员','cast-officer-v1','海关官员面向右侧的姑娘们，伸手示意'],['girls','姑娘们','cast-girls-v1','两位姑娘站在一起，面向左侧的官员']]){const actor=node('div','dialogue-actor '+who);actor.dataset.actor=who;actor.append(picture(asset,alt,'cast-image','webp'),node('span','actor-label',name));cast.append(actor);}
 const friends=node('div','travel-friends');friends.append(picture('cast-friends-v1','两位同行朋友在旁边等候','','webp'),node('span','actor-label','同行朋友'));
 const counter=picture('counter','','travel-counter'),passports=picture('passports','姑娘们拿出的两本护照','travel-passports'),other=picture('cases-grey','官员询问的一对灰色箱子，物主尚未确认','travel-other-cases'),own=picture('cases-brown','姑娘们自己的两只棕色箱子','travel-own-cases');
 cast.append(counter,passports,other,own);element.append(location,cast,friends);
 function placePassports(){
  if(passports.hidden)return;
  const who=passports.dataset.place,img=cast.querySelector('.'+who+' .cast-image'),bounds=img.getBoundingClientRect(),frame=cast.getBoundingClientRect();
  if(!bounds.width||!img.naturalWidth)return;
  // Anchors were reviewed on the source sprites. Account for contain's real
  // painted rectangle and bottom alignment, not the larger image element box.
  const scale=Math.min(bounds.width/img.naturalWidth,bounds.height/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  const hand=who==='girls'?[.105,.435]:[.80,.53],x=bounds.left+(bounds.width-w)/2+w*hand[0]-frame.left,y=bounds.bottom-h+h*hand[1]-frame.top;
  const paper=passports.getBoundingClientRect();
  passports.style.left=(x-paper.width/2)+'px';passports.style.top=(y-paper.height*154/180)+'px';
 }
 const resize=new ResizeObserver(placePassports);resize.observe(cast);cast.querySelectorAll('img').forEach(img=>img.addEventListener('load',placePassports));
 document.addEventListener(['canran','course-ready'].join(':'),placePassports);
 return{element,update(i){cast.dataset.phase=i<6?'arrival':i===6?'request':i<8?'handover':i<10?'other-cases':i<12?'own-cases':'travellers';passports.hidden=i<6;passports.dataset.place=i===6?'girls':'officer';passports.alt=i===6?'姑娘们拿出的两本护照':'已经递到官员面前的两本护照';other.hidden=i<8;own.hidden=i<10;own.dataset.place=i===10?'waiting':'girls';friends.dataset.referenced=String([3,4,5,14,15].includes(i));requestAnimationFrame(placePassports);}};
}
function create({element}){let status,heading;return{present(question,progress){element.classList.add('travel-runner');const content=element.querySelector('.practice-content'),intro=node('div','travel-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','travel-task-status','选好表达，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},answer(value){status.textContent=value===null?'选好表达，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return element.querySelector('.travel-intro .practice-progress')||heading;}};}
core.unit1516Scene={storyProps,create};
})(globalThis.CanranCore);
