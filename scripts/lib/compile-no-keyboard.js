'use strict';
const design=require('../../content/no-keyboard-design');
const clone=x=>JSON.parse(JSON.stringify(x));
module.exports=function compileNoKeyboard(u,audioRequests=[]){
  u.entities['scene-likes-potatoes']={entityId:'scene-likes-potatoes',title:'她喜欢土豆',assetSrc:'/assets/lesson1-50/scenes/likes-potatoes.png',presentation:'scene',artDirection:'Disney-like painted imagegen',alt:'红衣猫开心地吃土豆'};
  for(const source of Object.values(u.sources).filter(s=>s.sourceId?.startsWith('G49-'))){
    source.audioSrc='/assets/lesson1-50/audio/'+source.sourceId.toLowerCase()+'.mp3';source.voiceId='af_heart';source.audioRenderMode='natural-utterance';source.audioReviewStatus='generated-awaiting-playback-review';
    audioRequests.push({sourceId:source.sourceId,text:source.text,voice:source.voiceId,speed:1,renderMode:'natural-utterance',outputPath:'.'+source.audioSrc});
  }
  u.referenceGroups.push({id:'grammar49-examples',title:'Lesson 49–50 · 用语练习（课程补充）',sourceRefs:Object.keys(u.sources).filter(ref=>ref.startsWith('G49-'))});
  u.keyboardHistory=require('../../content/history/lesson1-144-v6.1.json');
  u.recordSchema=5;u.contractVersion=3;u.answerPolicyVersion=3;u.releaseRevision='lesson1-144-v7.0';
  u.feedbackSounds=Object.fromEntries(['correct','incorrect','complete','failed'].map(sound=>[sound,{src:'/assets/feedback/duolingo-'+sound+'.mp3',volume:['correct','incorrect'].includes(sound)?.35:.5}]));
  u.settlement.challengeTitle='小镇挑战完成！';
  u.keyboardMigration={version:1,fromSchema:4,questions:[],activities:{}};
  const original=Object.values(u.activities),originalByRef=ref=>original.filter(a=>a.sourceRefs.includes(ref));
  const options=labels=>labels.map((text,i)=>({id:'o'+i,text,type:'text',lang:/[\u4e00-\u9fff]/.test(text)?'zh':'en'}));
  const assessment=(form,mechanism)=>({skill:({T03:'sound-word-matching',T04:'sound-discrimination',T05:'listening-keywords',T06:'supported-listening-assembly',T07:'supported-assembly',T08:'sentence-completion',T09:'contextual-response',T10:'reading-meaning',T11:'supported-correction',T12:'contextual-action'})[form]||'meaning-recognition',label:({T03:'音文配对',T04:'听辨声音',T05:'听音找词',T06:'听音组句',T07:'情境组句',T08:'选词补句',T09:'情境接话',T10:'理解短篇',T11:'点词改错',T12:'情境行动'})[form]||'图像与意义',support:mechanism==='order'?'word-bank':mechanism==='pairs'?'paired-options-with-elimination':'answer-options',cue:['T02','T03','T04','T05','T06'].includes(form)?'audio-without-transcript':'explicit-task',scope:'assessment',evidenceMode:'answered-with-options',boundary:'记录本题支持下的听辨、理解或组织；不作为自主拼写、自由写作或口语达标证据。'});
  function base(old,fields){
    const ref=old.sourceRef||old.sourceRefs[0],id=old.id+':tap';
    const q={id,kind:'exercise',version:1,sourceRef:ref,sourceRefs:[ref],targetId:old.targetId||old.grammarSkillId||ref,actorId:old.actorId||'explorer-cat',hint:old.hint||old.hints?.[0]||'回想课上和刚才练过的内容。',feedbackText:u.sources[ref].text,listenRefs:[],answer:['o0'],prerequisiteRefs:[ref],distractorRationale:'沿用本目标已经编写的词形、词义或情境对比；词块只承载当前目标句。',...fields};
    q.assessment={...assessment(q.form,q.mechanism),...(old.grammarSkillId?{grammarSkillId:old.grammarSkillId}:{}),...(old.assessment?.grammarSkillId?{grammarSkillId:old.assessment.grammarSkillId,phase:old.assessment.phase}: {})};
    if(q.form==='T10'&&q.listenRefs.length)Object.assign(q.assessment,{skill:'listening-meaning',label:'听懂句意',cue:'audio-without-transcript'});
    q.authoredSupport=q.assessment.support;
    if(q.assessment.grammarSkillId)q.grammarSkillId=q.assessment.grammarSkillId;
    return q;
  }
  function ordered(old,listening=false,fields={}){
    const ref=old.sourceRef||old.sourceRefs[0],words=u.sources[ref].text.trim().split(/\s+/);
    // Phrase chunks cap motor work for long sentences; no per-letter keyboard.
    const chunks=[];for(let i=0;i<words.length;i+=words.length>10?2:1)chunks.push(words.slice(i,i+(words.length>10?2:1)).join(' '));
    const opts=options(chunks);
    return base(old,{form:listening?'T06':'T07',mechanism:'order',title:listening?'听一听，拼一句':'用词块说一说',prompt:listening?'听完后，按顺序点选词块。':'用词块表达这个意思：'+(old.prompt||u.sources[ref].translation||old.title),options:opts,answer:opts.map(o=>o.id),listenRefs:listening?[ref]:[],...fields});
  }
  function fromActivity(old,a){
    const q=base(old,{form:a.kind==='cloze'?'T08':a.conversation?'T09':a.options.every(o=>o.type==='image')?(a.requiredAudio.length?'T02':'T01'):'T10',mechanism:a.kind==='cloze'?'cloze':'choice',title:a.title,prompt:a.kind==='cloze'?old.prompt:a.requiredAudio.length?'听完后，选择符合这句话的意思。':a.title,options:clone(a.options),answer:clone(a.answer),listenRefs:a.requiredAudio.map(x=>x.ref),...(a.cloze?{prefix:a.cloze.prefix,suffix:a.cloze.suffix}:{}),contextRefs:!a.requiredAudio.length&&a.kind==='choice'?[old.sourceRef]:[]});
    if(a.conversation)q.contextRefs=a.conversation.contextRefs;
    return q;
  }
  function convert(old,index=0){
    const ref=old.sourceRef,acts=originalByRef(ref),gap=acts.find(a=>a.kind==='cloze'&&a.cloze.replyRef===ref);
    if(old.kind==='gap'){
      if(gap&&gap.cloze.prefix===old.prefix&&gap.cloze.suffix===old.suffix)return fromActivity(old,gap);
      const labels=design.gaps[old.id]||design.gaps[old.id.replace(/^PL-/, '')];
      if(labels)return base(old,{form:'T08',mechanism:'cloze',title:'选词补句',prompt:old.prompt,prefix:old.prefix,suffix:old.suffix,options:options(labels)});
      // Foundation placement has a few sentence frames not used by a mainline
      // activity. Reconstruct the same learned utterance with a phrase bank.
      return ordered(old,Boolean(u.sources[ref].audioSrc));
    }
    if(design.replies[ref]){const d=design.replies[ref];return base(old,{...d,mechanism:'choice',title:'选一句，接上对话',options:options(d.options)});}
    if(old.answerType==='word'){
      if(ref==='L01-W07')return base(old,{form:'T02',mechanism:'choice',title:'听音找图',prompt:'听一听，点选对应的物品。',listenRefs:[ref],options:['handbag','watch','book'].map((entityId,i)=>({id:'o'+i,type:'image',entityId})),prerequisiteRefs:[ref,'L02-W04','L02-W03']});
      const card=original.find(a=>a.kind==='teach'&&a.items.some(i=>i.sourceRef===ref)),item=card?.items.find(i=>i.sourceRef===ref);
      if(item?.entityId){const items=card.items.filter(i=>i.entityId);return base(old,{form:'T02',mechanism:'choice',title:'听音找图',prompt:'听一听，点选对应的物品。',listenRefs:[ref],options:items.map((i,n)=>({id:'o'+n,type:'image',entityId:i.entityId})),answer:['o'+items.indexOf(item)],prerequisiteRefs:items.map(i=>i.sourceRef)});}
    }
    const authored=design.questions[old.id]||design.questions[old.id.replace(/^PL-/, '')];
    if(authored?.form==='T10'){
      const refs=authored.optionRefs;
      return base(old,{form:'T10',mechanism:'choice',title:'听一句，选意思',prompt:'听完后，选出这句话表达的意思。',listenRefs:[ref],options:options(refs.map(r=>u.sources[r].translation)),answer:['o'+refs.indexOf(ref)],prerequisiteRefs:refs,distractorRationale:authored.reason});
    }
    return ordered(old,authored?.form!=='T07'&&Boolean(u.sources[ref].audioSrc));
  }

  function map(old,q,mode){u.keyboardMigration.questions.push({oldId:old.id,newId:q.id,targetId:q.targetId,mode,reason:'保留目标，改为有选项支持的作答；历史成绩不追溯改写。'});return q;}
  function install(old,q){
    const a={...q,nodeId:old.nodeId,checkpointId:old.checkpointId,resultId:q.id+':result',channel:q.assessment.skill,requiredAudio:[],feedbackAudio:[],feedbackPlayback:'optional',instruction:'',hints:[q.hint,q.feedbackText],wrongFeedback:q.hint,...(old.reviewEligible===false?{reviewEligible:false}:{})};
    delete u.activities[old.id];u.activities[a.id]=a;
    for(const node of u.nodes)node.activityIds=node.activityIds.map(id=>id===old.id?a.id:id);
    for(const id of Object.keys(u.checkpointActivities))u.checkpointActivities[id]=u.checkpointActivities[id].map(x=>x===old.id?a.id:x);
    u.keyboardMigration.activities[old.id]=a.id;
    return a;
  }
  function add(nodeId,q){const node=u.nodes.find(n=>n.id===nodeId);if(!node)throw Error('Unknown exercise node '+nodeId);const a={...q,nodeId,checkpointId:nodeId,resultId:q.id+':result',channel:q.assessment.skill,requiredAudio:[],feedbackAudio:[],feedbackPlayback:'optional',instruction:'',hints:[q.hint,q.feedbackText],wrongFeedback:q.hint};u.activities[a.id]=a;node.activityIds.push(a.id);u.checkpointActivities[nodeId].push(a.id);return a;}
  function grammar(old,d){
    if(d.mechanism==='order')return ordered(old,false,d);
    const q=base(old,{...d,options:options(d.options)});
    if(d.mechanism==='repair'){
      q.words=d.words.map((text,i)=>({id:'w'+i,text,group:'word'}));
      q.options=[...q.words,...q.options.map(o=>({...o,group:'replacement'}))];q.answer=['w'+d.wrongIndex,'o0'];
    }
    return q;
  }
  for(const id of [...u.grammar.activityIds]){
    const old=u.activities[id],key=id.replace('L49:grammar-','');
    const q=grammar({...old,sourceRef:old.sourceRefs[0]},design.grammar[key]);map(old,q,'main');install(old,q);
  }
  u.grammar.activityIds=u.grammar.activityIds.map(id=>u.keyboardMigration.activities[id]);
  u.grammar.delayedQuestions=u.grammar.delayedQuestions.map(old=>map(old,grammar(old,design.delayed[old.id.replace('G49-delayed-','')]),'delayed'));
  for(const c of u.challenges){c.title=c.title.replace('输入挑战','挑战');c.questions=c.questions.map((old,i)=>map(old,convert(old,i),'challenge'));}
  u.placement.questions=u.placement.questions.map((old,i)=>({...map(old,convert(old,i),'placement'),chapterId:old.chapterId}));u.placement.version=3;
  // One listening sequence and one small audio/word group in each chapter with
  // suitable taught material. Replace a retrieval task instead of inflating it.
  for(const chapter of u.chapters){
    const orderedActivity=original.find(a=>a.kind==='order'&&!a.embeddedIn&&!a.conversation&&u.nodes.find(n=>n.id===a.nodeId)?.chapterId===chapter.id&&u.sources[a.sourceRefs[0]]?.audioSrc);
    if(orderedActivity)install(orderedActivity,ordered({...orderedActivity,sourceRef:orderedActivity.sourceRefs[0]},true));
    const cards=original.find(a=>a.kind==='teach'&&a.audioType==='word'&&a.items.length>=2&&u.nodes.find(n=>n.id===a.nodeId)?.chapterId===chapter.id);
    if(cards){
      const items=cards.items.slice(0,3),q=base({id:cards.id+':sound-pairs',sourceRef:items[0].sourceRef},{form:'T03',mechanism:'pairs',targetId:cards.id+':sound-word-group',feedbackText:items.map(i=>u.sources[i.sourceRef].text).join(' · '),title:'听音，找搭档',prompt:'点左边听录音，再点右边的词。配好后点检查。',sourceRefs:items.map(i=>i.sourceRef),prerequisiteRefs:items.map(i=>i.sourceRef),listenRefs:items.map(i=>i.sourceRef),options:options(items.map(i=>u.sources[i.sourceRef].text)),answer:[],pairs:items.map((i,n)=>({id:'sound'+n,sourceRef:i.sourceRef,answer:'o'+n})),activityGroup:'小镇电台'});
      const old=original.find(a=>a.nodeId===cards.nodeId&&a.kind==='choice'&&a.channel==='audio-meaning');
      if(old)install(old,q);else add(cards.nodeId,q);
    }
  }
  for(const [i,d]of design.keywords.entries())add(d.nodeId,base({id:'town-keywords-'+i,sourceRef:d.ref},{form:'T05',mechanism:'multi',title:'听音找词',prompt:'听句子，选出听到的 2 个词。',listenRefs:[d.ref],options:options(d.words),answer:d.correct.map(i=>'o'+i),prerequisiteRefs:d.prerequisites,activityGroup:'小镇电台'}));
  for(const [i,d]of design.soundContrasts.entries())for(const [j,ref]of d.refs.entries())add(d.nodeId,base({id:'town-sound-'+i+'-'+j,sourceRef:ref},{form:'T04',mechanism:'choice',title:'听清楚，选一个',prompt:'这两个词的声音很接近。听到的是哪一个？',listenRefs:[ref],options:options(d.refs.map(ref=>u.sources[ref].text)),answer:['o'+j],prerequisiteRefs:d.refs,distractorRationale:d.reason,mediaReview:'教师对比试听待确认'}));
  add('K04',base({id:'town-return-handbag',sourceRef:'L01-D06'},{form:'T12',mechanism:'mission',title:'失物招领小任务',prompt:'听完这段认领对话，先选要交还的物品，再选接收者。',listenRefs:['L01-D03','L01-D06'],sourceRefs:['L01-D03','L01-D06'],prerequisiteRefs:['L01-D03','L01-D06','L02-W05'],steps:['要交还哪件物品？','应该交给谁？'],options:[{id:'bag',entityId:'handbag',type:'image',stage:0},{id:'coat',entityId:'coat',type:'image',stage:0},{id:'owner',entityId:'handbag-owner',type:'image',stage:1},{id:'keeper',entityId:'station-keeper',type:'image',stage:1}],answer:['bag','owner'],outcome:'主人拿回手提包：Thank you very much.',feedbackText:'Yes, it is. Thank you very much.',activityGroup:'小镇任务'}));
  u.exerciseForms={T01:'图像与词句',T02:'听音选图',T03:'音文配对',T04:'近音辨析',T05:'听音找关键词',T06:'听音词块组句',T07:'情境词块组句',T08:'选词补句',T09:'对话接续',T10:'听读短篇理解',T11:'点词改错',T12:'情境行动'};
  // Word banks carry words, not punctuation clues. Preserve spelling inside
  // contractions/compounds, stable option IDs, and the complete source sentence.
  const questions=[...Object.values(u.activities),...u.challenges.flatMap(c=>c.questions),...u.placement.questions,...u.grammar.delayedQuestions];
  for(const q of questions.filter(q=>q.kind==='order'||q.mechanism==='order')){
    const original=q.options.map(o=>o.text);
    for(const o of q.options){
      o.text=o.text.replace(/[\p{P}\p{S}]/gu,(mark,index,text)=>/['’\-]/u.test(mark)&&/[\p{L}\p{N}]/u.test(text[index-1]||'')&&/[\p{L}\p{N}]/u.test(text[index+1]||'')?mark:'').trim();
      if(!o.text)throw Error('Empty word-bank tile '+q.id+':'+o.id);
    }
    // Only these collisions expand accepted permutations. Keep the former
    // labels to validate historical placement verdicts without regrading them.
    if(q.mechanism==='order'&&q.options.some((o,i)=>q.options.some((p,j)=>p.text===o.text&&original[i]!==original[j])))q.priorOrderTexts=original;
  }
  u.exerciseCoverage=u.chapters.map(c=>({chapterId:c.id,forms:[...new Set(Object.values(u.activities).filter(a=>u.nodes.find(n=>n.id===a.nodeId)?.chapterId===c.id).map(a=>a.form||({order:'T07',cloze:'T08','interactive-story':'T10',match:'T01',choice:'T10'})[a.kind]).filter(Boolean))]}));
};
