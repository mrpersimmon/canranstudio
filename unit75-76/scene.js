(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit75-76/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','一家鞋店');element.setAttribute('role','group');element.setAttribute('aria-label','女士与售货员面对面比较鞋子的场景');
 let assistant;
 for(const[key,label,side]of [['lady','Lady','left'],['assistant','Shop assistant','right']]){const wrap=node('div','dialogue-actor visit-actor at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',side==='left'?'女士拿着黑色样鞋，面向右侧的售货员':'售货员面向左侧的女士，双手尚未拿鞋','webp'),node('span','actor-label',label));element.append(wrap);if(key==='assistant')assistant=wrap;}
 element.append(location);
 function update(i){


  const offer=i>=12;element.dataset.offer=String(offer);const img=assistant.querySelector('img'),src='/assets/unit75-76/'+(offer?'assistant-shoes':'assistant')+'.webp';if(img.getAttribute('src')!==src)img.src=src;
  img.alt=offer?'售货员面向女士，展示托盘上的一双紫色鞋':'售货员面向左侧的女士，双手尚未拿鞋';
 }
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u7576-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.opened='false';view.setAttribute('role','group');view.setAttribute('aria-label','核对鞋店时间记录');
  const entries={calendar:['month','March → May','记录日：五月'],stock:['pair','库存牌待核对','先看过去，再看现在'],year:['year','2014','开店记录'],morning:['wash','10:00 → afternoon','今天的记录'],question:['photo','a photograph','询问发生时间'],week:['tv','Sunday evening','本周记录已完成'], 'two-events':['wear','Monday → Tuesday','买鞋 · 穿鞋']};
  const [art,title,detail]=entries[task];view.append(picture(art,'application-prop',title));const card=node('div','diary-page');card.append(node('strong','',title),node('span','',detail));view.append(card);intro.append(view);content.prepend(intro);
 },answer(value){
  const checked=value!==null&&task==='stock';view.dataset.opened=String(checked);
  if(task==='stock'){view.querySelector('.diary-page strong').textContent=checked?'None now.':'库存牌待核对';view.querySelector('.diary-page span').textContent=checked?'当前库存已核对':'先看过去，再看现在';}
 },finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit7576Scene={storyProps,create};
})(globalThis.CanranCore);
