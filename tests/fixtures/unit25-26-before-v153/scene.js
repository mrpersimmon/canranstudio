(function(core){
'use strict';
const node=(tag,cls='',text='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};
function storyProps(){
 const element=node('div','desk-world');element.setAttribute('role','group');element.setAttribute('aria-label','史密斯太太的厨房，从画面正面看');
 const frame=node('div','kitchen-picture'),picture=node('picture'),mobile=node('source'),image=node('img','room-image');
 mobile.media='(max-width:600px)';mobile.srcset='/assets/unit25-26/kitchen-room-mobile-v1.webp';image.src='/assets/unit25-26/kitchen-room-v1.webp';image.alt='左侧蓝色电炉，右侧白色冰箱，中间桌上有一个空瓶子和一只干净杯子';picture.append(mobile,image);
 const focus=node('span','kitchen-focus');focus.setAttribute('aria-hidden','true');frame.append(picture,focus);element.append(node('p','desk-location','厨房 · 从画面正面看'),frame);
 const desktop={fridge:[78.5,35,17,51],cooker:[6,45,18,41],table:[34,60,33,26],bottle:[43,46,5,18],cup:[53,54,7,10]};
 const phone={fridge:[71,30,28,47],cooker:[2,43,29,34],table:[30,59,42,25],bottle:[41,47,8,16],cup:[54,54,11,9]};
 let index=-1;function draw(){const target=index<1?'room':index<4?'fridge':index<7?'cooker':index===7?'table':index<10?'bottle':'cup';element.dataset.focus=target;focus.hidden=target==='room';if(target!=='room'){const[x,y,w,h]=(matchMedia('(max-width:600px)').matches?phone:desktop)[target];Object.assign(focus.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});}}
 addEventListener('resize',draw);return{element,update(i){index=i;draw();}};
}
function restyle(element){for(const image of element.querySelectorAll('img[src="/assets/unit25-26/Mrs.svg"]'))image.src='/assets/unit25-26/cast-mrs-v1.webp';}
function create({element}){const inquiry=core.unit2526Scene.inquiry({element});let useInquiry=false,status,heading;return{
 present(question,progress){useInquiry=question.scene?.kind==='inquiry';if(useInquiry){inquiry.present(question,progress);return;}element.classList.add('desk-runner');const content=element.querySelector('.practice-content'),intro=node('div','desk-intro');heading=node('h3','',question.prompt);heading.tabIndex=-1;intro.append(progress,heading);const facts=content.querySelector('.practice-context');if(facts)intro.append(facts);status=node('p','desk-task-status','读清介绍，再检查。');status.setAttribute('role','note');intro.append(status);content.prepend(intro);},
 answer(value){if(useInquiry){inquiry.answer(value);return;}status.textContent=value===null?'读清介绍，再检查。':'这条表达已核对。';status.dataset.recorded=String(value!==null);},finish(){},completion(){return null;},heading(){return useInquiry?inquiry.heading():element.querySelector('.desk-intro .practice-progress')||heading;}
};}
core.unit2526Scene={storyProps,restyle,create};
})(globalThis.CanranCore);

(function(core){
 'use strict';
 const node=(tag,text='',className='')=>{const el=document.createElement(tag);el.textContent=text;el.className=className;return el;};
 core.unit2526Scene.inquiry=({element})=>{
  let question,heading,reply,reveal,answer;
  return{
   supports:q=>q.scene?.kind==='inquiry',
   present(q,progress){
    question=q;element.classList.remove('role-runner');
    const content=element.querySelector('.practice-content');heading=node('h3',q.prompt);heading.tabIndex=-1;
    const intro=node('div','','inquiry-intro');intro.append(progress,heading);
    const scene=node('div','','inquiry-scene');scene.setAttribute('role','group');scene.setAttribute('aria-label','厨房里问位置');
    const friend=node('div','','inquiry-friend'),portrait=node('img');portrait.src='/assets/unit25-26/cast-mrs-v1.webp';portrait.alt='朋友';friend.append(portrait);
    const dialogue=node('div','','inquiry-dialogue'),request=node('p',q.scene.before,'inquiry-bubble');request.lang='en';
    answer=node('p','','inquiry-bubble is-you');answer.lang='en';reply=node('p','','inquiry-bubble');reply.lang='en';
    dialogue.append(request,answer,reply);friend.append(dialogue);
    reveal=node('div','','inquiry-discovery');scene.append(friend,reveal);content.prepend(intro,scene);
   },
   answer(value){
    const solved=value!==null;answer.textContent=solved?value:'';reply.textContent=solved?question.scene.after:'';
    answer.hidden=reply.hidden=!solved;reveal.replaceChildren();reveal.classList.toggle('is-discovered',solved);
    if(solved){const pic=node('img');pic.src=question.scene.image;pic.alt='找到位置：勺子在杯子里面';reveal.append(pic,node('p','知道勺子在哪里了！'));}
    else{reveal.append(node('span','?','inquiry-question'),node('p','勺子在哪里？'));}
   },
   heading:()=>heading?.isConnected?heading:element.querySelector('.practice-finish>p'),finish(){}
  };
 };
})(globalThis.CanranCore);
