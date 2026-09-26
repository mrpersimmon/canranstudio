(function(root){
 'use strict';
 const core=root.CanranCore, people=core.unit910.learning.PEOPLE;
 const node=(tag,text='',className='')=>{const el=document.createElement(tag);el.textContent=text;el.className=className;return el;};
 function portrait(name){const el=node('figure','','greeting-person'),img=node('img');img.src=people[name].image;img.alt='';el.append(img,node('figcaption',people[name].name));return el;}
 function friends(){
  const element=node('div','','story-friends');element.setAttribute('role','group');element.setAttribute('aria-label','聊到的朋友');
  const cards=['tony','emma'].map(name=>{const card=node('article','','story-friend'),figure=portrait(name),copy=node('p'),unknown=node('span','?','friend-unknown');unknown.setAttribute('aria-label','还没聊到的朋友');card.append(unknown,figure,copy);element.append(card);return{card,figure,copy,unknown};});
  return{element,showLine(index){cards.forEach(({card,figure,copy,unknown},i)=>{const mentioned=index>=6+i*2;figure.hidden=!mentioned;copy.hidden=!mentioned;unknown.hidden=mentioned;card.dataset.known=String(mentioned);copy.textContent=index>=7+i*2?(i?"She's very well.":"He's fine."):'…';});}};
 }
 const prompts={
  'story-emma':{person:'helen',speech:"How's Emma?",task:'课文中，Emma 身体怎么样？'},
  'story-and-you':{person:'helen',speech:'And you?',task:'Helen 正在问谁？'},
  'story-he':{person:'helen',speech:"He's fine, thanks.",task:'这句话里的 He 指谁？'},
  'reply-well':{person:'steven',speech:'How are you today?',task:'你今天很好，怎么回应？'},
  'build-return':{person:'steven',speech:'How are you today?',task:'告诉他“很好，谢谢”，再问“你呢？”'},
  'reply-see':{person:'steven',speech:'Nice to see you.',task:'你也很高兴见到他，怎么接话？'}
 };
 function taskView(id){
  const element=node('div','','greeting-task'),question=node('div','','greeting-question'),heading=node('h3','','greeting-task-heading');
  const stage=node('div','','greeting-task-stage'),speech=node('p','','greeting-speech'),response=node('p','','greeting-response');
  const steven=portrait('steven'),helen=portrait('helen'),bubbles=node('div','','greeting-task-bubbles');
  steven.dataset.person='steven';helen.dataset.person='helen';bubbles.append(speech,response);stage.append(steven,bubbles,helen);element.append(question,stage);
  return{element,heading:()=>heading,
   present(q,progress){const detail=prompts[q.id.replace('u910-v1-','')];element.hidden=false;question.replaceChildren(progress,heading);heading.textContent=detail?.task||q.prompt;speech.textContent=detail?.speech||'';stage.dataset.speaker=detail?.person||'steven';response.hidden=true;response.textContent='';element.dataset.activity=id;},
   answer(value){response.hidden=!value||id!=='reply';response.textContent=id==='reply'?(value||''):'';},
   finish(){element.hidden=true;}
  };
 }
 function result(id){
  const element=node('div','','greeting-result');
  if(id==='reply'){element.append(portrait('steven'),node('p',"I'm fine, thanks. And you?"),portrait('helen'));}
  else if(id==='roles'){element.append(portrait('tony'),node('p','问候眼前的人，也关心没到场的朋友。'),portrait('emma'));}
  else {const img=node('img');img.src='/assets/unit9-10/cold.svg';img.alt='';element.append(img,node('p',"Look at Emma. She's cold."));}
  return element;
 }
 core.unit910Scene={friends,taskView,result};
})(globalThis);
