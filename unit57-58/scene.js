(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const el=document.createElement(tag);el.className=cls;el.textContent=text;return el;};
const picture=(name,cls,alt,format='svg')=>{const el=node('img',cls);el.src='/assets/unit57-58/'+name+'.'+format;el.alt=alt;return el;};
const beats=[
 ['school',8,'早晨 · 去上学','children-walking','孩子们背着书包步行去学校'],
 ['shops',10,'上午 · 去商店','mother-shops','索耶夫人提着篮子去商店'],
 ['tea',4,'下午 · 花园喝茶','mother-tea','索耶夫人坐在花园里喝茶'],
 ['play',6,'傍晚 · 花园玩耍','children-playing','孩子们在花园里一起玩球'],
 ['read',9,'今晚 · 读一本书','father-reading','索耶先生正在读书，合好的报纸放在一旁']
];
function storyProps(){
 const element=node('div','moment-world');element.setAttribute('role','group');element.setAttribute('aria-label','索耶一家今天的场景');
 const clock=picture('clock-8','moment-clock','八点整'),location=node('p','moment-location'),cast=picture('children-walking','moment-cast','孩子们步行去学校','webp');element.append(clock,location,cast);
 function update(i){const[beat,hour,title,asset,alt]=beats[Math.max(0,Math.min(4,i))];element.dataset.beat=beat;clock.src='/assets/unit57-58/clock-'+hour+'.svg';clock.alt=hour+'点整';location.textContent=title;cast.src='/assets/unit57-58/'+asset+'.webp';cast.alt=alt;}
 update(-1);return{element,update};
}
function create({element}){let view,heading,task;return{
 present(question,progress){
  element.classList.remove('role-runner');element.classList.add('moment-runner');const content=element.querySelector('.practice-content'),intro=node('div','moment-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress);
  if(question.workshop?.model){const demo=node('aside','grammar-model moment-model');demo.setAttribute('role','region');demo.setAttribute('aria-label','短示范');for(const[en,cn]of question.workshop.model.lines){const row=node('div','grammar-model-line'),p=node('p','',en);p.lang='en';row.append(p,node('small','',cn));demo.append(row);}intro.append(demo);}
  intro.append(heading);const material=content.querySelector('.practice-context');if(material)intro.append(material);
  task=question.id.replace('u5758-v1-a-','');view=node('div','moment-application');view.dataset.task=task;view.dataset.sent='false';view.setAttribute('role','group');view.setAttribute('aria-label','观察记录区');
  if(task==='time')view.append(picture('clock-10','observation-clock','时钟：十点整'));
  else if(task==='caption'){view.append(picture('clock-6','moment-clock','时钟：六点整'),picture('children-playing','observation-cast','孩子们在花园里玩耍','webp'));}
  else{view.append(picture('notebook','observation-notebook','观察笔记'),node('p','observation-label','观察笔记'));}
  intro.append(view);content.prepend(intro);
 },
 answer(value){view.dataset.sent=String(value!==null&&task==='caption');},finish(){},completion(){return null;},heading(){return element.querySelector('.moment-intro .practice-progress')||heading;}
};}
core.unit5758Scene={storyProps,create};
})(globalThis.CanranCore);
