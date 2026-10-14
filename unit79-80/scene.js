(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit79-80/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','家里的备物台');element.setAttribute('role','group');element.setAttribute('aria-label','Carol与Tom面对面讨论购物清单的厨房场景');
 for(const[key,label,side,alt]of [['carol','Carol','left','Carol拿清单与笔，面向右侧的Tom'],['tom','Tom','right','Tom张开手与Carol交谈，面向左侧的Carol']]){const wrap=node('div','dialogue-actor visit-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',alt,'webp'),node('span','actor-label',label));element.append(wrap);}
 const timeline=node('aside','story-timeline');timeline.setAttribute('aria-label','故事进展');const title=node('strong'),detail=node('span');timeline.append(title,detail);element.append(location,timeline);
 const entries=[['关心她在做什么','What are you doing?'],['正在写清单','a shopping list'],['一起核对需要','What do we need?'],['这周需要许多东西','a lot of things'],['食品杂货','茶、咖啡不多；糖、果酱没有'],['接着看蔬菜','What about vegetables?'],['蔬菜库存','番茄不多；土豆很多'],['肉的库存','一点儿肉也没有'],['询问还有什么','Have we got any…?'],['说明购买计划','她不打算买酒'],['希望还有钱','some money'],['Carol的钱不多','not much'],['Tom的钱也不多','两人的钱都不多']];
 function update(i){const entry=i<0?['一起计划购物','先看看家里缺什么']:entries[i];title.textContent=entry[0];detail.textContent=entry[1];element.dataset.stock=i>=10?'money':i>=9?'plan':i>=7?'meat':i>=6?'vegetables':i>=4?'groceries':'start';}
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u7980-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.opened='false';view.setAttribute('role','group');view.setAttribute('aria-label','核对库存与购物清单');
  const entries={stock:['list','准备补买什么','核对库存后登记'],quantity:['groceries','数量小记录','两种都不多'],zero:['none','Sugar: none','一点儿也没有'],has:['biscuits','She doesn’t have any biscuits.','保留原来的意思'],shop:['shopping','准备去哪里','按本课目录选择'],need:['envelopes','写信前的准备','读材料，再说需要什么'],optional:['potatoes','Enough potatoes','土豆已经足够'],purpose:['bananas','Bananas → greengrocer’s','说清去处与目的']};
  const[art,title,detail]=entries[task];view.append(picture(art,'application-prop',title));const card=node('div','diary-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){
  const checked=value!==null&&['stock','shop'].includes(task);view.dataset.opened=String(checked);
  if(task==='stock'){view.querySelector('.diary-page strong').textContent=checked?'jam':'准备补买什么';view.querySelector('.diary-page span').textContent=checked?'已写入计划，还未购买':'核对库存后登记';}
  if(task==='shop'){view.querySelector('.diary-page strong').textContent=checked?'the baker’s':'准备去哪里';view.querySelector('.diary-page span').textContent=checked?'去买面包':'按本课目录选择';}
 },finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
 };}
core.unit7980Scene={storyProps,create};
})(globalThis.CanranCore);
