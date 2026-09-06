#!/usr/bin/env node
'use strict';
// Compile reviewed textbook sources and authored tasks into the sole runtime
// catalog. The renderer never invents wording, answers, or audio mappings.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const write=(file,data)=>{fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),JSON.stringify(data,null,2)+'\n');};
const unit=read('content/expansion/lesson1-6-baseline.json');
const legacy=read('content/expansion/legacy7-20-reference.json');
const originals=require('../content/expansion/textbook21-50');
const designs=require('../content/expansion/learning-design');
const additional=require('../content/expansion/additional-scope');
const translations=require('../content/expansion/translations7-20');
const {testedSpan}=require('./lib/textbook-authoring');
const pairs=text=>text.trim().split('\n').filter(Boolean).map(line=>line.split('|'));
const pad=n=>String(n).padStart(2,'0');
const oldRoot=process.env.CANRAN_REFERENCE_ROOT||path.resolve(root,'../../canranstudio');
const audioRequests=[],copied=[],sourceIndex={},coverage=[];
const outputAudio='/assets/lesson1-50/audio/';
const speakerNames={man:'顾客猫',jane:'Jane',narrator:'探险猫',robert:'Robert',sophie:'Sophie',steven:'Steven',helen:'Helen',teacher:'老师猫',dave:'Dave',tim:'Tim',louise:'Louise',anna:'Anna','customs-officer':'海关官员猫',travellers:'旅客猫','mr-jackson':'Mr. Jackson','mr-richards':'Mr. Richards',mum:'妈妈猫',children:'孩子们','ice-cream-man':'冰淇淋店员猫','mrs-jones':'Mrs. Jones',amy:'Amy',jean:'Jean',jack:'Jack',dan:'Dan',george:'George',sam:'Sam',penny:'Penny',boss:'老板猫',bob:'Bob',pamela:'Pamela',christine:'Christine',ann:'Ann',butcher:'肉商猫','mrs-bird':'Mrs. Bird'};
const female=new Set(['jane','sophie','helen','louise','anna','mum','mrs-jones','amy','jean','penny','pamela','christine','ann','mrs-bird']);
const smallOldTextbook=read('content/textbook-sources.json');
for(const [ref,s] of Object.entries(smallOldTextbook)) if(/^L0[1-6]-/.test(ref)) sourceIndex[ref]=s;

function source(s,lesson,original=true) {
  const ref=s.sourceId;
  if(unit.sources[ref]) throw Error('Duplicate authored source '+ref);
  s={...s,lessonId:lesson,provenance:original?'supplied-textbook':'course-authored',sourcePage:33+2*lesson};
  const spoken=!!s.audioSrc||['dialogue','narrative','vocabulary','course-example','number'].includes(s.sourceKind);
  if(spoken){
    const previous=s.audioSrc;
    s.audioSrc=outputAudio+ref.toLowerCase().replace(/[^a-z0-9-]/g,'-')+'.mp3';
    s.voiceId=s.voiceId||(s.speaker==='woman'?'af_heart':'am_michael');
    s.audioRenderMode='natural-utterance';
    s.audioReviewStatus='generated-awaiting-playback-review';
    const target=path.join(root,s.audioSrc);
    fs.mkdirSync(path.dirname(target),{recursive:true});
    if(previous && fs.existsSync(path.join(oldRoot,previous))){
      fs.copyFileSync(path.join(oldRoot,previous),target);
      copied.push({sourceId:ref,source:previous,destination:s.audioSrc});
    }else audioRequests.push({sourceId:ref,text:s.text,voice:s.voiceId,speed:1,renderMode:'natural-utterance',phonemeOverrides:{pamela:'pˈæmələ',ann:'ˈæn',christine:'kɹɪstˈin'},outputPath:'.'+s.audioSrc});
  }
  unit.sources[ref]=s;
  if(original)sourceIndex[ref]={sourceId:ref,text:s.text,lessonId:lesson,sourceKind:s.sourceKind,pdfPages:[33+2*lesson,34+2*lesson]};
  return ref;
}
function actor(role,lesson){
  const id=`L${pad(lesson)}-actor-${role}`;
  if(!unit.entities[id]){
    const woman=female.has(role),base=unit.entities[role==='narrator'?'explorer-cat':woman?'handbag-owner':'station-keeper'];
    unit.entities[id]={...base,entityId:id,title:speakerNames[role]||role,characterSpecies:'cat',pronoun:woman?'she':'he',align:woman?'right':'left'};
    delete unit.entities[id].facing;
    unit.speakerLabels[id]=speakerNames[role]||role;
  }
  return id;
}
function audio(ref){const s=unit.sources[ref];return{ref,text:s.text,src:s.audioSrc,speaker:s.speaker||null};}
function node(id,title,chapter,lessonIds,kind='practice'){
  const n={id,title,chapterId:chapter.id,lessonIds,kind,description:'',icon:kind==='story'?'book-open':kind==='review'?'arrows-clockwise':'star',duration:'约 3–5 分钟',activityIds:[],checkpointIds:[id],completionTitle:title+'，完成！'};
  unit.nodes.push(n);unit.checkpointIds.push(id);unit.checkpointActivities[id]=[];
  unit.journey.nodeIcons[id]=n.icon;unit.journey.nodeLabels[id]=kind==='story'?'互动故事':kind==='review'?'综合复习':'听与练';
  return n;
}
function activity(n,data){
  const a={instruction:'',sourceRefs:[],requiredAudio:[],feedbackAudio:[],options:[],...data,nodeId:n.id,checkpointId:n.id};
  if(unit.activities[a.id])throw Error('Duplicate activity '+a.id);
  unit.activities[a.id]=a;
  if(!a.embeddedIn){n.activityIds.push(a.id);unit.checkpointActivities[n.id].push(a.id);}
  return a;
}
function evidence(skill,label,support,scope='assessment'){
  return{skill,label,cue:skill==='listening-meaning'?'audio-without-transcript':'explicit-task',support,evidenceMode:scope==='practice'?'practised-with-support':'answered-with-options',scope,boundary:'仅记录本题提供的支持条件；有词库和选项的表现不作为无提示表达证据。'};
}
function choice(n,id,title,ref,labels,extra={}){
  if(new Set(labels).size!==labels.length)throw Error('Ambiguous duplicate answer '+id);
  return activity(n,{id,resultId:id+':result',targetId:extra.targetId||ref,kind:'choice',title,channel:'reading-meaning',audioType:'sentence',sourceRefs:[ref],answer:[id+'-0'],options:labels.map((text,i)=>({id:id+'-'+i,type:'text',text,lang:/[\u4e00-\u9fff]/.test(text)?'zh':'en'})),feedbackText:unit.sources[ref].text,hints:[extra.explanation||'回想刚刚听过的词句。',extra.explanation||labels[0]],wrongFeedback:extra.explanation||'再听一次，注意词句的意思。',assessment:evidence('reading-meaning','理解句意','answer-options'),...extra});
}
function teach(n,id,refs,title,scene,examples=false){
  const entitiesByWord={pen:'pen',pencil:'pencil',book:'book',watch:'watch',coat:'coat',dress:'dress',skirt:'skirt',shirt:'shirt',car:'car',house:'house',umbrella:'umbrella',suit:'suit',school:'school',teacher:'teacher'};
  return activity(n,{id,kind:'teach',title,sceneEntityId:scene,playbackMode:'manual-cards',audioType:examples?'sentence':'word',sourceRefs:refs,requiredAudio:refs.map(audio),items:refs.map(ref=>{const s=unit.sources[ref],entity=entitiesByWord[s.text.toLowerCase()];return{sourceRef:ref,term:s.text,caption:s.translation||s.text,...(entity&&unit.entities[entity]&&!examples?{entityId:entity}:{presentation:'text'})};})});
}
function cloze(n,id,example,scene){
  const {ref,en,zh,focus,distractors,hint}=example,span=testedSpan(en,focus);
  const labels=[focus,...distractors];
  return choice(n,id,'补全句子',ref,labels,{kind:'cloze',channel:'sentence-completion',prompt:zh,sceneEntityId:scene,cloze:{...span,replyRef:ref,actorId:'explorer-cat'},requiredAudio:[],feedbackAudio:[audio(ref)],feedbackPlayback:'always',explanation:hint,hints:[hint,en],assessment:evidence('sentence-completion','补全句子','word-options')});
}
function order(n,id,example){
  // Distinct phrase blocks avoid indistinguishable duplicate word IDs.
  const chunks=example.en.trim().split(/\s+/),counts=new Map();
  for(let i=0;i<chunks.length;i++){if(counts.has(chunks[i].toLowerCase())&&i>0){chunks[i-1]+=' '+chunks[i];chunks.splice(i,1);i--;}else counts.set(chunks[i].toLowerCase(),true);}
  const a=activity(n,{id,resultId:id+':result',targetId:example.ref,kind:'order',title:'组成这句话',prompt:example.zh,channel:'assembly',audioType:'sentence',sourceRefs:[example.ref],options:chunks.map((text,i)=>({id:id+'-'+i,type:'text',text})),answer:chunks.map((_,i)=>id+'-'+i),feedbackAudio:[audio(example.ref)],feedbackPlayback:'always',feedbackText:example.en,hints:[example.hint,example.en],wrongFeedback:example.hint,assessment:evidence('supported-assembly','词块组句','word-bank')});
  return a;
}
function numberWords(n){
  const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  if(n<20)return small[n];
  if(n<100)return tens[Math.floor(n/10)]+(n%10?'-'+small[n%10]:'');
  if(n<1000)return small[Math.floor(n/100)]+' hundred'+(n%100?' and '+numberWords(n%100):'');
  if(n<1000000)return numberWords(Math.floor(n/1000))+' thousand'+(n%1000?(n%1000<100?' and ':' ')+numberWords(n%1000):'');
  return numberWords(Math.floor(n/1000000))+' million'+(n%1000000?(n%1000000<100?' and ':' ')+numberWords(n%1000000):'');
}
function sentenceAnswers(text){
  const answers=new Set([text]);
  for(const [expanded,contracted] of [['I am',"I'm"],['We are',"We're"],['They are',"They're"],['She is',"She's"],['He is',"He's"],['It is',"It's"],['do not',"don't"],['Do not',"Don't"],['does not',"doesn't"],['is not',"isn't"],['are not',"aren't"],['cannot',"can't"],['What is',"What's"],['Where is',"Where's"]])for(const candidate of [...answers])if(candidate.includes(expanded))answers.add(candidate.replace(expanded,contracted));
  return [...answers];
}

unit.lessonIds=Array.from({length:50},(_,i)=>i+1);
unit.title='猫猫小镇 · Lesson 1–50';
unit.releaseRevision='lesson1-50-v5.0';
// Opaque storage identity deliberately stays unchanged: expanding the scope is
// append-only, not a new learner record. Tests protect old evidence and resets.
unit.copy.lessonLabel='新概念英语 · Lesson 1–50';
unit.copy.completedTitle='前五十课探险完成！';
unit.journey.copy.footer='猫猫小镇 · Lesson 1–50';
unit.journey.copy.allDone='前五十课探险完成！';
unit.publicationScope='Lesson 1–50 continuous learning path';
let previousExamples=[];const exampleHistory=[];
for(const design of designs){
  const l=design.lesson,key='L'+pad(l),chapter={id:'lesson-'+l+'-'+(l+1),title:design.title,lessonIds:[l,l+1],goal:design.goal};
  unit.chapters.push(chapter);
  const sceneName=l===11?'shirt':l===23?'glasses':design.scene,scene='scene-'+sceneName;
  unit.entities[scene]={entityId:scene,title:design.title,assetSrc:'/assets/lesson1-50/scenes/'+sceneName+'.webp',presentation:'scene',artDirection:'Disney-like painted imagegen',alt:design.title+'的猫猫故事插画'};
  const lessonSources=[],wordRefs=[],dialogue=[];
  const old=legacy.find(x=>x.lessonIds.includes('lesson'+l));
  if(old){
    for(const [name,lesson] of Object.entries(old.lessonContent)){
      const lessonNo=Number(name.replace('lesson','')),refs=[];
      for(const entry of Object.values(lesson.sources)){
        const s={...entry};
        if(/-W\d+$/.test(s.sourceId))s.sourceKind='vocabulary';
        const ref=source(s,lessonNo);refs.push(ref);
        if(s.sourceKind==='dialogue')dialogue.push(ref);
        if(s.sourceKind==='vocabulary')wordRefs.push(ref);
      }
      unit.lessonContent[name]={...lesson,sources:Object.fromEntries(refs.map(ref=>[ref,unit.sources[ref]]))};
      lessonSources.push({lesson:lessonNo,refs,title:lesson.textbookTitle});
    }
  }else{
    const o=originals.find(x=>x.lesson===l);
    const refs=[];
    pairs(o.lines).forEach(([role,text,translation],index)=>{
      const ref=source({sourceId:key+'-D'+pad(index+1),sourceKind:o.narrative?'narrative':'dialogue',text,translation,speakerRole:role,speaker:female.has(role)?'woman':'man'},l);dialogue.push(ref);refs.push(ref);
    });
    for(const [lessonNo,words,title] of [[l,o.words,o.title],[l+1,o.evenWords,o.evenTitle]]){
      const own=lessonNo===l?refs:[];
      words.split(';').filter(Boolean).forEach((word,index)=>{
        const colon=word.indexOf(':'),text=word.slice(0,colon),translation=word.slice(colon+1);
        const ref=source({sourceId:'L'+pad(lessonNo)+'-W'+pad(index+1),sourceKind:'vocabulary',text,translation},lessonNo);wordRefs.push(ref);own.push(ref);
      });
      lessonSources.push({lesson:lessonNo,refs:own,title});
      unit.lessonContent['lesson'+lessonNo]={lessonId:'lesson'+lessonNo,textbookTitle:title,textbookSource:`外研社《新概念英语智慧版 1》PDF 页 ${33+2*lessonNo}–${34+2*lessonNo}`,requiredSourceIds:own,sources:Object.fromEntries(own.map(ref=>[ref,unit.sources[ref]]))};
    }
  }
  const note=source({sourceId:key+'-N-GRAMMAR',sourceKind:'course-note',text:design.note||originals.find(x=>x.lesson===l).note},l,false);
  if(translations[l]){
    const meanings=translations[l].split('\n');
    if(meanings.length!==dialogue.length)throw Error('Dialogue translation count differs '+l);
    dialogue.forEach((ref,index)=>unit.sources[ref].translation=meanings[index]);
  }
  const refsByLesson=new Map(lessonSources.map(s=>[s.lesson,s.refs]));
  const examples=pairs(design.examples+'\n'+(additional.examples[l]||'')).map(([en,zh,focus,wrong,hint],index)=>{
    const ref=source({sourceId:key+'-E'+pad(index+1),sourceKind:'course-example',text:en,translation:zh,derivedFrom:[note]},l+1,false);
    return{ref,en,zh,focus,distractors:wrong.split('/'),hint};
  });
  const numberRefs=(additional.numbers[l+1]||[]).map((n,index)=>source({sourceId:key+'-NUM'+pad(index+1),sourceKind:'number',text:numberWords(n),translation:n.toLocaleString('en-US'),printedValue:String(n),derivedFromPdfPage:35+2*l},l+1,false));
  const ordinalRefs=(additional.ordinals[l+1]||[]).map((text,index)=>source({sourceId:key+'-ORD'+pad(index+1),sourceKind:'number',text,translation:'第 '+(l===47?index+1:index+13)+' 个',printedValue:text,derivedFromPdfPage:35+2*l},l+1,false));
  // Full textbook story, manual turn-by-turn audio, with two contextual checks.
  const sn=node(key+'-STORY',design.title,chapter,[l],'story'),storyId=key+':story',beats=[],cast=[];
  const checkRows=pairs(design.checks);
  dialogue.forEach((ref,index)=>{
    const s=unit.sources[ref],actorId=actor(s.speakerRole||'narrator',l);
    unit.sourceActors[ref]=actorId;if(!cast.includes(actorId))cast.push(actorId);
    let noteRef=note;
    if(s.translation)noteRef=source({sourceId:key+'-N-LINE'+pad(index+1),text:s.translation,sourceKind:'course-note'},l,false);
    beats.push({id:ref,kind:'line',ref,actorEntityId:actorId,noteRef});
    for(const [after,title,correct,wrong,explanation] of checkRows){
      if(Number(after)!==index+1)continue;
      const id=key+':story-check-'+after;
      const a=choice(sn,id,title,ref,[correct,...wrong.split('/')],{embeddedIn:storyId,channel:'story-context',explanation,assessment:evidence('story-meaning','理解故事','heard-text-and-options')});
      beats.push({id,kind:'checkpoint',activityId:a.id});
    }
  });
  if(beats.filter(b=>b.kind==='checkpoint').length!==checkRows.length)throw Error('Invalid story checkpoint position '+l);
  activity(sn,{id:storyId,kind:'interactive-story',title:design.title,playbackMode:'manual-story',audioType:'sentence',sourceRefs:dialogue,noteRefs:[...new Set(beats.filter(b=>b.noteRef).map(b=>b.noteRef))],actorEntityIds:cast,sceneEntityId:scene,narrative:!!originals.find(x=>x.lesson===l)?.narrative,beats});
  unit.dialogueRefs.push(...dialogue);
  // Teach the textbook vocabulary in small groups. Each vocabulary node also
  // asks a retrieval question; new words are never tested before introduction.
  const learnedWords=wordRefs.filter(ref=>!['cigarette','tobacco','Scotch whisky','wine','beer'].includes(unit.sources[ref].text));
  let lastWordsNode;
  for(let start=0;start<learnedWords.length;start+=8){
    const group=learnedWords.slice(start,start+8),vn=node(key+'-WORDS-'+(start/8+1),'词语与用法 '+(start/8+1),chapter,[l,l+1]);
    lastWordsNode=vn;
    for(let j=0;j<group.length;j+=4)teach(vn,vn.id+':teach-'+j,group.slice(j,j+4),'认识这些词',j===0?scene:undefined);
    if(group.length>1){
      const pick=group[0],options=[pick,...group.slice(1,4)].map(ref=>unit.sources[ref].translation||unit.sources[ref].text);
      const unique=[...new Set(options)];
      if(unique.length>1)choice(vn,vn.id+':hear', '听词，选意思',pick,unique,{channel:'audio-meaning',requiredAudio:[audio(pick)],audioType:'word',feedbackAudio:[audio(pick)],explanation:unit.sources[pick].text+'：'+options[0],assessment:evidence('listening-meaning','听词辨义','meaning-options')});
    }
  }
  const selectedNumbers=ordinalRefs.length?ordinalRefs:[...new Set([numberRefs[0],numberRefs[Math.floor(numberRefs.length/3)],numberRefs[Math.floor(numberRefs.length*2/3)],numberRefs.at(-1)].filter(Boolean))];
  if(selectedNumbers.length){
    const nn=selectedNumbers.length>4||!lastWordsNode?node(key+'-NUMBERS',ordinalRefs.length?'用英语说顺序':'数字小练习',chapter,[l+1]):lastWordsNode;
    for(let i=0;i<selectedNumbers.length;i+=4)teach(nn,key+':numbers-'+i,selectedNumbers.slice(i,i+4),ordinalRefs.length?'认识序数词':'数字怎么读');
    for(const [i,ref] of [selectedNumbers[0],selectedNumbers.at(-1)].entries())if(selectedNumbers.length>1)choice(nn,key+':number-check-'+i,'听一听，选数字',ref,[ref,...selectedNumbers.filter(r=>r!==ref).slice(0,2)].map(r=>unit.sources[r].translation),{channel:'audio-meaning',requiredAudio:[audio(ref)],feedbackAudio:[audio(ref)],explanation:unit.sources[ref].text+'：'+unit.sources[ref].translation,assessment:evidence('listening-meaning','听数字辨义','numeric-options')});
  }
  const pn=node(key+'-USE','把句子用起来',chapter,[l,l+1]);
  for(let i=0;i<examples.length;i+=4)teach(pn,key+':examples'+(i?'-'+i:''),examples.slice(i,i+4).map(e=>e.ref),'听听怎么说',undefined,true);
  cloze(pn,key+':gap-1',examples[0]);
  order(pn,key+':order-2',examples[1]);
  cloze(pn,key+':gap-3',examples[2]);
  const rn=node(key+'-REVIEW',l===49?'前五十课综合闯关':'换个情境再试试',chapter,previousExamples.length?[l-2,l-1,l,l+1]:[5,6,l,l+1],'review');
  const ex=examples[3];
  // Meaning distractors are other explicitly learned sentences, never random
  // translations produced from the answer at rendering time.
  choice(rn,key+':meaning', '听句子，选意思',ex.ref,[ex.zh,...examples.slice(0,2).map(e=>e.zh)],{channel:'audio-meaning',requiredAudio:[audio(ex.ref)],feedbackAudio:[audio(ex.ref)],explanation:ex.hint,assessment:evidence('listening-meaning','听句辨义','meaning-options')});
  order(rn,key+':transfer',examples[2]);
  cloze(rn,key+':contrast',examples[1]);
  for(let i=4;i<examples.length;i++)cloze(rn,key+':extra-'+i,examples[i]);
  if(previousExamples.length){order(rn,key+':return',previousExamples[0]);cloze(rn,key+':return-gap',exampleHistory[Math.max(0,exampleHistory.length-4)][3]);}
  else {cloze(rn,key+':first-review',examples[3]);}
  if(l===49)for(const [index,exampleSet]of exampleHistory.filter((_,i)=>i%5===0).entries())order(rn,key+':final-recall-'+index,exampleSet[1]);
  const challenge={id:'CH'+l+'-'+(l+1),title:design.title+'挑战',lessonLabel:`Lesson ${l} & ${l+1}`,unlockNodeId:rn.id,nodeIds:[rn.id],questions:[]};
  for(const [index,e] of examples.entries()){
    const isGap=index%2===0;
    challenge.questions.push({id:challenge.id+'-'+index,kind:isGap?'gap':'translation',sourceRef:e.ref,prompt:e.zh,answers:isGap?[e.focus]:sentenceAnswers(e.en),actorId:'explorer-cat',hint:e.hint,...(isGap?testedSpan(e.en,e.focus):{})});
  }
  // Two later recall questions use earlier sources and were introduced in the
  // main path; optional challenge completion never blocks the next section.
  for(const [index,e] of previousExamples.slice(0,2).entries())challenge.questions.push({id:challenge.id+'-recall-'+index,kind:'translation',sourceRef:e.ref,prompt:e.zh,answers:sentenceAnswers(e.en),actorId:'explorer-cat',hint:e.hint});
  unit.challenges.push(challenge);
  for(const ls of lessonSources){
    const extras=ls.lesson===l?[note]:[...examples.map(e=>e.ref),...numberRefs,...ordinalRefs];
    unit.referenceGroups.push({id:'lesson'+ls.lesson,title:`Lesson ${ls.lesson} · ${ls.title}`,sourceRefs:[...ls.refs,...extras]});
  }
  coverage.push({lessonIds:chapter.lessonIds,goal:design.goal,originalStoryLines:dialogue.length,originalVocabulary:wordRefs.length,taughtVocabulary:learnedWords.length,referenceOnly:wordRefs.filter(r=>!learnedWords.includes(r)),numbers:[...numberRefs,...ordinalRefs],taughtNumbers:selectedNumbers,examples:examples.map(e=>e.ref),nodeIds:unit.nodes.filter(n=>n.chapterId===chapter.id).map(n=>n.id),challengeId:challenge.id});
  previousExamples=examples;
  exampleHistory.push(examples);
}
unit.coverage.lesson1To50=coverage;
unit.status='implementation-candidate';
write('content/learning-course.json',unit);
write('content/textbook-sources.json',sourceIndex);
write('content/expansion/audio-request.json',{model:'Kokoro-82M',revision:'f3ff3571791e39611d31c381e3a41a3af07b4987',items:audioRequests});
write('content/expansion/audio-reused.json',copied);
write('docs/designs/lesson1-50/coverage.json',coverage);
console.log(JSON.stringify({lessons:unit.lessonIds.length,sections:unit.chapters.length,nodes:unit.nodes.length,activities:Object.keys(unit.activities).length,storyLines:unit.dialogueRefs.length,challenges:unit.challenges.length,audioToGenerate:audioRequests.length,audioCopied:copied.length}));
