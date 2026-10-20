(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit73-74/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','伦敦街角 · 车站旁');element.setAttribute('role','group');element.setAttribute('aria-label','Mills夫人与游客在街角相遇的场景');
 let tourist;
 for(const[key,label,side]of [['mills','Mrs. Mills','left'],['tourist','The tourist','right']]){const wrap=node('div','dialogue-actor visit-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',label+(side==='left'?'面向右侧的游客':'面向左侧的Mills夫人'),'webp'),node('span','actor-label',label));element.append(wrap);if(key==='tourist')tourist=wrap;}
 element.append(location);
 function update(i){


  tourist.hidden=i<2;const state=i<10?'pocket':i===10?'closed':'open';element.dataset.book=state;
  const name=state==='pocket'?'tourist':state==='closed'?'tourist-closed':'tourist-reading';const img=tourist.querySelector('img'),src='/assets/unit73-74/'+name+'.webp';if(img.getAttribute('src')!==src)img.src=src;
  img.alt=state==='pocket'?'游客面向Mills夫人，手册尚在衣袋里':state==='closed'?'游客面向Mills夫人，拿出合着的短语手册':'游客面向Mills夫人，低头阅读打开的短语手册';
 }
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u7374-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.opened='false';view.setAttribute('role','group');view.setAttribute('aria-label','核对旅行手记');
  const entries={note:['bus','yesterday afternoon','记录行车方式'],phrasebook:['phrasebook','翻开短语手册','核对想说的意思'],request:['way','King Street','礼貌问路'],choice:['drink','water or tea?','核对昨天的选择'],greeting:['greet','Jane · yesterday','写下问候记录'],pocket:['pocket','先后顺序','跟着材料核对'],quote:['phrase','Tom said…','保留人物原话'],safe:['shave','this morning','读懂动作与结果']};
  const [art,title,detail]=entries[task];view.append(picture(art,'application-prop',title));const page=node('div','diary-page');page.append(node('strong','',title),node('span','',detail));view.append(page);intro.append(view);content.prepend(intro);
 },answer(value){
  const opened=value!==null&&task==='phrasebook';view.dataset.opened=String(opened);
  if(task==='phrasebook'){const img=view.querySelector('img');img.src='/assets/unit73-74/'+(opened?'phrasebook-open':'phrasebook')+'.svg';img.alt=opened?'核对成功，短语手册已翻开':'尚未翻开的短语手册';}
 },finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit7374Scene={storyProps,create};
})(globalThis.CanranCore);
