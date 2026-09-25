(function(root){
  'use strict';
  const core=root.CanranCore,{learning:content,stages,questions}=core.unit4950,practice=core.lesson49Practice;
  const $=selector=>document.querySelector(selector),icon=core.lesson49Icons.create;
  const audio=core.audio.createAudioPlayer();
  function node(tag,copy='',className=''){const el=document.createElement(tag);el.className=className;el.textContent=copy;return el;}
  function button(copy,action,className='btn btn-green'){const el=node('button',copy,className);el.type='button';el.addEventListener('click',action);return el;}
  function speak(text,onFinish){return audio.play({text,src:content.AUDIO[text]?core.courseCatalog.publicAssetUrl(content.AUDIO[text]):'',retrySource:true,onFinish:result=>onFinish?.(result.sourceFailed?{...result,reason:'failed'}:result)});}
  const surfaces=new Map(),activities=stages.flatMap(stage=>stage.activities.map(([id,title,art])=>({id,title,art,stage:stage.id})));
  const routeIds=new Set(['cover',...stages.map(stage=>stage.id),...activities.map(activity=>'learn/'+activity.id)]);
  let activeActivity=null;
  for(const stage of stages){
    const section=node('section','','shop-chapter');section.id=stage.id;
    const header=node('header','','chapter-heading');header.append(node('h2',stage.title),node('span','☆☆☆','lvl-stars'));section.append(header);
    const link=node('a',stage.title);link.href='#'+stage.id;$('.chapter-links').append(link);
    const option=node('option',stage.title);option.value=stage.id;$('.chapter-select select').append(option);
    for(const [id,title,art] of stage.activities){
      const surface=node('section','','shop-stage stage-'+id);surface.id='learn/'+id;surface.setAttribute('aria-label',title);surface.setAttribute('role','region');
      const heading=node('header','','stage-heading');heading.append(icon(art),node('h3',title));
      const help=button('怎么玩',()=>showHelp(id,title),'workspace-back');heading.append(help);surface.append(heading);section.append(surface);surfaces.set(id,surface);
    }
    $('#lessonWorkspace').append(section);
  }
  function navigate(id){
    // Scrolling back to the cover keeps the hash; resume must still reposition.
    if(location.hash==='#'+id)route();
    else location.hash=id;
  }
  function markLocation(id){
    if(!routeIds.has(id))return;
    if(activeActivity!==id){audio.stop();root.dispatchEvent(new Event('lesson49:leave-activity'));activeActivity=id;}
    if(id==='cover')return;
    if(practice.activity('unitLocation')!==id)practice.activity('unitLocation',id);
    $('#startBtn').textContent='继续采购';
    const section=document.getElementById(id).closest('.shop-chapter');
    document.querySelectorAll('.chapter-links a').forEach(link=>{if(link.hash==='#'+section?.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    if(section)$('.chapter-select select').value=section.id;
  }
  function route(){
    let id;try{id=decodeURIComponent(location.hash.slice(1)||'cover');}catch{id='cover';}
    const target=document.getElementById(routeIds.has(id)?id:'cover');
    if(!target)return;
    markLocation(target.id);
    target.scrollIntoView({block:'start',behavior:'instant'});
  }
  $('#lessonWorkspace').addEventListener('click',event=>{
    const activity=event.target.closest('.shop-stage');if(!activity)return;
    markLocation(activity.id);
    // Long-page interactions update the return location without scrolling or
    // cancelling playback. Capture runs before a next-station button navigates.
    if(location.hash!=='#'+activity.id)history.replaceState(null,'','#'+activity.id);
  },true);
  $('.chapter-select select').addEventListener('change',event=>navigate(event.target.value));
  const resumeLocation=()=>routeIds.has(practice.activity('unitLocation'))&&practice.activity('unitLocation')!=='cover'?practice.activity('unitLocation'):null;
  $('#startBtn').textContent=resumeLocation()?'继续采购':'开始采购';
  $('#startBtn').addEventListener('click',()=>navigate(resumeLocation()||'learn/words'));
  function openHelp(title,lines){$('#helpTitle').textContent=title;$('#helpBody').replaceChildren(...lines.map(line=>node('p',line)));$('#unitHelp').showModal();}
  function showHelp(id,title){
    const copy={words:['点整张词卡，听发音、看中文。'],listen:['先点喇叭，选出听到的单词。听完才能检查，可以重复听。'],text:['点“开始听课文”。每句听完后点“下一句”；点旧句可以重听。'],roles:['先听完整故事，再选答案。题目说“如果”时，要按新情境回答。'],trans:['点下面的词块组成句子；点已选的词块可以撤回。'],certificate:['完成五关后领取。证书记录本单元的练习完成，不代表自由口语或独立写作的评定。']};
    if(id==='subjects'){core.lesson49Subjects.markRuleUsed();openHelp(title,content.SUBJECTS.help);return;}
    openHelp(title,copy[id]||['选好答案，再点“检查答案”。灯泡可以提供本题线索。可以随时离开，回来继续。']);
  }
  document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>el.closest('dialog').close()));
  $('#notebookButton').addEventListener('click',()=>$('#unitNotebook').showModal());
  const words=[...content.WORDS,...content.PHRASES],pages=Math.ceil(words.length/6);
  const storedWordPage=practice.activity('unitWordPage');
  let wordPage=Number.isInteger(storedWordPage)?Math.max(0,Math.min(pages-1,storedWordPage)):0;
  const wordHost=surfaces.get('words'),grid=node('div','','unit-words'),controls=node('div','','word-controls');
  const previous=button('上一组词卡',()=>changeWordPage(-1),'btn btn-yellow');
  const next=button('下一组词卡',()=>{if(wordPage===pages-1)navigate('learn/listen');else changeWordPage(1);},'btn btn-green');
  const pageLabel=node('span');pageLabel.id='wordPageProgress';controls.append(previous,pageLabel,next);wordHost.append(grid,controls);
  function changeWordPage(delta){wordPage+=delta;audio.stop();renderWords();practice.revealQuestion(wordHost,wordHost.querySelector('h3'));}
  function renderWords(){
    practice.activity('unitWordPage',wordPage);grid.replaceChildren();
    words.slice(wordPage*6,wordPage*6+6).forEach(word=>{
      const card=button(' ',()=>{const expanded=card.getAttribute('aria-expanded')!=='true';card.setAttribute('aria-expanded',String(expanded));meaning.hidden=!expanded;speak(word.en);},'opt-btn unit-word');
      card.setAttribute('aria-label',word.en);card.setAttribute('aria-expanded','false');
      const img=node('img');img.src=word.image;img.alt='';
      const meaning=node('span',word.cn,'word-meaning');meaning.hidden=true;card.replaceChildren(img,node('strong',word.en),node('small',word.ph||''),meaning);grid.append(card);
    });
    previous.disabled=wordPage===0;pageLabel.textContent=(wordPage+1)+' / '+pages;
    next.setAttribute('aria-label',wordPage===pages-1?'下一站：听音寻宝':'下一组词卡');
    if(wordPage===pages-1)next.replaceChildren(node('span','下一站：'),node('span','听音寻宝'));else next.textContent='下一组词卡';
  }
  renderWords();

  // A completion belongs to this unit and this activity's content version.
  // Replaying creates a fresh draft without turning earned completion into answers.
  const required=Object.fromEntries(stages.map(stage=>[stage.id,stage.required]));
  const signatures=Object.fromEntries(Object.entries(questions).map(([id,items])=>[id,'v1:'+items.map(q=>q.id).join('|')]));
  signatures.text='v1:'+content.DIALOGUE.map(line=>line.text).join('|');signatures.subjects='v1:'+content.SUBJECTS.version;
  const saved=practice.activity('unitCompleted');
  const completed=saved&&typeof saved==='object'&&!Array.isArray(saved)?{...saved}:{};
  let certificateView;
  const passed=id=>completed[id]===signatures[id];
  const fullyComplete=()=>Object.values(required).flat().every(passed);
  function updateProgress(){
    let total=0;
    for(const [chapter,ids] of Object.entries(required)){
      const count=ids.filter(passed).length;
      const stars=count===ids.length?3:Math.floor(count/ids.length*3);
      total+=stars;const label=document.querySelector('#'+chapter+' .lvl-stars');
      label.textContent='★'.repeat(stars)+'☆'.repeat(3-stars);label.setAttribute('aria-label','本关 '+stars+' / 3 颗星');
    }
    $('#starCount').textContent=String(total);
    if(!certificateView)return;
    const next=activities.find(activity=>Object.values(required).flat().includes(activity.id)&&!passed(activity.id));
    certificateView.update({complete:fullyComplete(),completedChapters:Object.values(required).map(ids=>ids.every(passed)),next:next?{title:next.title,go:()=>navigate('learn/'+next.id)}:null});
  }
  function complete(id){completed[id]=signatures[id];practice.activity('unitCompleted',completed);updateProgress();}
  function nextStation(id,actions){
    const next=activities[activities.findIndex(activity=>activity.id===id)+1];
    if(!next||actions.querySelector('.station-actions'))return;
    const group=node('div','','station-actions');group.append(button('下一站：'+next.title,()=>navigate('learn/'+next.id)));actions.append(group);
  }
  const hosts=new Map();
  function host(id){const element=node('div');element.id='unit-'+id+'-practice';surfaces.get(id).append(element);hosts.set(id,element);return element;}
  function mountPractice(id,options={}){
    const element=hosts.get(id)||host(id);
    practice.mount({element,questions:questions[id],playAudio:speak,...options,onComplete:states=>{
      complete(id);nextStation(id,element.querySelector('.practice-finish-actions'));options.onComplete?.(states);
    }});
  }
  mountPractice('listen',{allowHints:false,optionImages:Object.fromEntries(content.WORDS.map(word=>[word.en,word.image]))});

  const roleBar=node('div');roleBar.id='roleBar';
  const roleInfo=node('p','听完故事，来找答案。');roleInfo.id='roleInfo';
  const roleListen=button('先听故事',()=>navigate('learn/text'));roleListen.id='roleListenBtn';roleBar.append(roleInfo,roleListen);surfaces.get('roles').append(roleBar);
  const roleStage=core.lesson49RoleStage.create({bar:roleBar,playAudio:speak});
  const roleHost=host('roles');roleHost.hidden=true;let storyStarted=false;
  function unlockStory(){
    if(!passed('text')||storyStarted)return;
    storyStarted=true;roleHost.hidden=false;roleStage.setReady(true);mountPractice('roles',{sceneView:roleStage});
  }

  const textHost=surfaces.get('text'),theatre=node('div');theatre.id='stage';
  for(const [id,art,title] of [['charButcher','butcher','老板'],['charBird','bird','伯德夫人']]){
    const character=node('div','','char');character.id=id;character.append(icon(art),node('div',title,'name-tag'));theatre.append(character);
  }
  const log=node('div');log.id='bubbleArea';log.setAttribute('role','log');log.setAttribute('aria-label','课文对话');log.setAttribute('aria-live','off');log.tabIndex=0;
  const dialogueStatus=node('p','','fb');dialogueStatus.id='dialogueStatus';dialogueStatus.setAttribute('role','status');theatre.append(log);
  const dialogueControls=node('div','','stage-ctrl'),tools=node('div','','stage-tools');
  const nextLineButton=button('开始听课文',advanceDialogue,'btn btn-green');nextLineButton.id='nextBtn';
  const replayLine=button('重听本句',()=>{if(dialogue.i<0)advanceDialogue();else playLine(dialogue.i);},'btn btn-yellow');
  const restart=button('重新上演',resetDialogue,'btn btn-yellow');tools.append(replayLine,restart);dialogueControls.append(nextLineButton,tools);
  const textFinish=node('div','','practice-finish');textFinish.hidden=true;
  const textFinishActions=node('div','','practice-finish-actions');textFinishActions.setAttribute('role','group');textFinishActions.setAttribute('aria-label','完成后的操作');
  textFinishActions.append(button('再听一遍',resetDialogue,'btn btn-yellow'));nextStation('text',textFinishActions);textFinish.append(node('p','故事听完了！'),textFinishActions);
  textHost.append(theatre,dialogueStatus,dialogueControls,textFinish);
  let dialogue={i:-1,heard:[],done:false},dialogueGeneration=0;
  function saveDialogue(){practice.activity('unitDialogue',{...dialogue,signature:signatures.text});}
  function clearPlaying(){log.querySelectorAll('.bubble-row').forEach(row=>{row.classList.remove('is-playing');row.querySelector('.btext').setAttribute('aria-busy','false');});theatre.querySelectorAll('.char').forEach(character=>character.classList.remove('speaking'));}
  function refreshDialogue(){
    nextLineButton.disabled=dialogue.i>=0&&dialogue.heard[dialogue.i]!==true;
    nextLineButton.textContent=dialogue.i<0?'开始听课文':dialogue.i===content.DIALOGUE.length-1?'完成课文学习':'下一句';
    dialogueControls.hidden=dialogue.done;textFinish.hidden=!dialogue.done;replayLine.disabled=dialogue.i<0;
  }
  function showLead(){const lead=node('div','','story-lead'),list=node('ol');content.STORY_LEAD.forEach(copy=>list.append(node('li',copy)));lead.append(node('h3','带着问题听'),list);log.replaceChildren(lead);}
  function appendLine(index){
    const line=content.DIALOGUE[index],row=node('div','','bubble-row '+line.who),bubble=node('div','','bubble');
    const speech=button('',()=>playLine(index),'btext');speech.setAttribute('aria-busy','false');speech.append(node('span',line.text),icon('audio'));
    const meaning=node('p',line.cn,'bcn');meaning.hidden=true;
    const translation=button('看中文',()=>{meaning.hidden=!meaning.hidden;translation.textContent=meaning.hidden?'看中文':'收起中文';translation.setAttribute('aria-expanded',String(!meaning.hidden));},'btn btn-mini btn-yellow');translation.setAttribute('aria-expanded','false');
    const actions=node('div','','bbtns');actions.append(translation);
    bubble.append(node('div',line.who==='butcher'?'BUTCHER 老板':'MRS. BIRD 伯德夫人','bname'),speech,meaning,actions);row.append(bubble);log.append(row);
  }
  function playLine(index){
    const generation=++dialogueGeneration;clearPlaying();dialogueStatus.textContent='';
    const row=log.children[index];row.classList.add('is-playing');row.querySelector('.btext').setAttribute('aria-busy','true');
    $(content.DIALOGUE[index].who==='butcher'?'#charButcher':'#charBird').classList.add('speaking');
    if(index===dialogue.i)nextLineButton.disabled=true;
    speak(content.DIALOGUE[index].text,result=>{
      if(generation!==dialogueGeneration)return;
      clearPlaying();
      if(index===dialogue.i&&result.reason==='ended'){dialogue.heard[index]=true;saveDialogue();}
      refreshDialogue();
      if(result.reason!=='ended'&&result.reason!=='cancelled')dialogueStatus.textContent='录音还没有播放完，点这句再听一次。';
    });
  }
  function advanceDialogue(){
    if(dialogue.done||(dialogue.i>=0&&dialogue.heard[dialogue.i]!==true))return;
    if(dialogue.i===content.DIALOGUE.length-1){
      if(!content.DIALOGUE.every((_,i)=>dialogue.heard[i]===true))return;
      dialogue.done=true;saveDialogue();complete('text');unlockStory();refreshDialogue();core.lesson49Feedback.play('complete');return;
    }
    if(dialogue.i<0)log.replaceChildren();dialogue.i++;saveDialogue();appendLine(dialogue.i);refreshDialogue();log.scrollTop=log.scrollHeight;playLine(dialogue.i);
  }
  function resetDialogue(){++dialogueGeneration;audio.stop();clearPlaying();dialogue={i:-1,heard:[],done:false};saveDialogue();showLead();dialogueStatus.textContent='';refreshDialogue();}
  const draft=practice.activity('unitDialogue');
  if(draft?.signature===signatures.text&&Number.isInteger(draft.i)&&draft.i>=0&&draft.i<content.DIALOGUE.length&&Array.isArray(draft.heard)){
    const earliestGap=content.DIALOGUE.findIndex((_,i)=>i<draft.i&&draft.heard[i]!==true);
    const index=earliestGap<0?draft.i:earliestGap;
    dialogue={i:index,heard:draft.heard.slice(0,index+1).map(value=>value===true),done:draft.done===true&&index===content.DIALOGUE.length-1&&content.DIALOGUE.every((_,i)=>draft.heard[i]===true)};
    for(let i=0;i<=dialogue.i;i++)appendLine(i);
    if(dialogue.done)complete('text');
  }else showLead();
  refreshDialogue();unlockStory();
  root.addEventListener('lesson49:leave-activity',()=>{++dialogueGeneration;clearPlaying();refreshDialogue();});

  mountPractice('doare',{presentation:'question'});mountPractice('give');mountPractice('needs');
  const pouchGrid=node('div');pouchGrid.id='pouchGrid';
  content.POUCH.forEach(expression=>{
    const card=node('details','','expression-card'),title=node('summary',expression.en);
    card.append(title,node('p',expression.cn),node('p',expression.example),button('听表达',()=>speak(expression.en),'btn btn-mini btn-yellow'));pouchGrid.append(card);
  });surfaces.get('pouch').append(pouchGrid);mountPractice('pouch');mountPractice('either',{presentation:'reply'});
  const subjects=host('subjects');core.lesson49Subjects.mount({element:subjects,onComplete:()=>{complete('subjects');nextStation('subjects',subjects.querySelector('.practice-finish-actions'));}});
  mountPractice('fill',{presentation:'cloze'});mountPractice('choice',{presentation:'cloze'});mountPractice('trans');
  const results=node('div','','unit-results');
  mountPractice('exam',{chunkSize:questions.exam.length,finalLabel:'查看本次记录',completionDetails:results,onComplete:states=>{
    const independent=states.filter(state=>state.firstCorrect&&!state.hintUsed&&!state.revealed).length;
    const assisted=states.filter(state=>state.firstCorrect&&(state.hintUsed||state.revealed)).length;
    const corrected=states.filter(state=>!state.firstCorrect).length;
    results.replaceChildren(node('p',`首次独立答对 ${independent} / ${questions.exam.length}`),node('p',`提示后完成 ${assisted} 题 · 修正后完成 ${corrected} 题`));
    const review=questions.exam.filter((_,i)=>!states[i].firstCorrect||states[i].hintUsed||states[i].revealed);
    if(review.length){const details=node('details'),list=node('ul');details.append(node('summary','下次再练'));review.forEach(q=>list.append(node('li',q.target)));details.append(list);results.append(details);}
  }});
  const examHost=hosts.get('exam'),examHeading=surfaces.get('exam').querySelector('.stage-heading');
  function placePause(){
    const tools=examHost.querySelector('.practice-session-tools');
    if(tools){
      examHeading.querySelector('.practice-session-tools')?.remove();
      tools.querySelector('button').addEventListener('click',()=>audio.stop());
      examHeading.insertBefore(tools,examHeading.lastElementChild);
    }
    const pause=examHeading.querySelector('.practice-session-tools');
    if(pause)pause.hidden=!examHost.querySelector('.practice-content');
  }
  new MutationObserver(placePause).observe(examHost,{childList:true,subtree:true});placePause();
  certificateView=core.unitCertificate.mount({element:surfaces.get('certificate'),initialName:practice.activity('unitName'),initialIssuedAt:practice.activity('unitCertificateIssuedAt'),canClaim:fullyComplete,onClaim:({name,issuedAt})=>{
    practice.activity('unitName',name);practice.activity('unitCertificateIssuedAt',issuedAt);
  }});
  updateProgress();practice.initializeNotebook();root.addEventListener('hashchange',route);root.addEventListener('pagehide',()=>audio.stop());
  document.fonts.ready.then(()=>requestAnimationFrame(()=>{route();log.scrollTop=log.scrollHeight;}));
})(globalThis);
