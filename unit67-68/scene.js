(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function picture(name,cls,alt,ext='svg'){const e=node('img',cls);e.src='/assets/unit67-68/'+name+'.'+ext;e.alt=alt;return e;}
function storyProps(){
 const element=node('div','visit-world'),location=node('p','visit-location','商店街 · 两位老朋友');element.setAttribute('role','group');element.setAttribute('aria-label','两位夫人在商店街相向交谈的场景');
 for(const[key,label,side]of [['johnson','Mrs. Johnson','left'],['williams','Mrs. Williams','right']]){const wrap=node('div','dialogue-actor visit-actor actor-'+key+' at-'+side);wrap.dataset.actor=key;wrap.append(picture(key,'visit-cast',label+(side==='left'?'朝向右侧交谈者':'朝向左侧交谈者')+'，头发、双手、衣服与鞋子完整','webp'),node('span','actor-label',label));element.append(wrap);}
 const timeline=node('aside','story-timeline');timeline.setAttribute('aria-label','故事时间线');const time=node('strong'),detail=node('span');timeline.append(time,detail);element.append(location,timeline);
 function update(i){element.dataset.beat=i>=6?'plan':i>=5?'last-week':i>=2?'places':'greeting';const entry=i>=6?['周末计划','Fri · Sat · Sun → 3 days']:i>=5?['上周缺课','Mon · Tue · Wed · Thu']:i>=3?['今天','Jimmy is very well.']:i>=2?['刚才','Williams：肉店 · Johnson：果蔬店']:['街角碰面','两位朋友聊起近况'];time.textContent=entry[0];detail.textContent=entry[1];}
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('visit-runner');const content=element.querySelector('.practice-content'),intro=node('div','visit-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u6768-v1-a-','');view=node('div','visit-application');view.dataset.task=task;view.dataset.stamped='false';view.setAttribute('role','group');view.setAttribute('aria-label','根据日记完成记录');
  const entries={place:['bakers','Fri · 6 June','the baker’s'],stamp:['dairy','Sat · 7 July','the dairy'],health:['keep','last week → today','Anna'],where:['office','Tuesday','Ben'], 'at-on':['grocers','Mon · 9 September','the grocer’s'],articles:['home','yesterday','Mum · Dad'],clock:['clock-0140','1:40','diary'],record:['church','Monday','Ann + You']};
  const [art,title,detail]=entries[task];view.append(picture(art,'application-prop','日记里的'+detail));const page=node('div','diary-page');page.append(node('strong','',title),node('span','',detail));if(task==='stamp'){const stamp=node('span','diary-stamp','待核对');stamp.setAttribute('role','status');page.append(stamp);}view.append(page);intro.append(view);content.prepend(intro);
 },answer(value){const stamped=value!==null&&task==='stamp';view.dataset.stamped=String(stamped);const label=view.querySelector('.diary-stamp');if(label)label.textContent=stamped?'已核对 ✓':'待核对';},finish(){},completion(){return null;},heading(){return element.querySelector('.visit-intro .practice-progress')||heading;}
};}
core.unit6768Scene={storyProps,create};
})(globalThis.CanranCore);
