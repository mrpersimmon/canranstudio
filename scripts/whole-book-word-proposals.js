'use strict';
// Produces review candidates, never accepted assets or modified teaching data.
const fs=require('node:fs'),path=require('node:path');
const {definition}=require('../server/progress');
const root=path.resolve(__dirname,'..'),units=Array.from({length:60},(_,i)=>'unit'+(25+i*2)+'-'+(26+i*2));
const originals=Object.fromEntries(units.map(id=>[id,definition(root,id,'/')]));
const previous=require('../assets/word-art-v2/adoptions.json').entries;
const profiles={...require('../docs/designs/word-cards/lesson1-12-classification.json').units,...require('../docs/designs/word-cards/lesson13-24-classification.json').units};
const approved=new Map();for(const item of previous)if(item.status==='accepted'&&(profiles[item.unit]?.[item.word]?.kind==='illustration'||item.unit==='unit143-144')){const k=item.word.toLowerCase();if(!approved.has(k))approved.set(k,item);}
const newObjects=require('../docs/designs/word-cards/whole-book-new-objects.json').jobs,newMap=new Map(newObjects.map(x=>[x.word,x]));
const aliases={'electric cooker':'cooker','trousers':'long','door':'shut','dish':'plate','shopping list':'shopping list','list':'shopping list','lamp-post':'lamp-post','telephone':'telephone','phone':'telephone','car':'Volvo','a headache':'headache','an earache':'earache','a toothache':'toothache','black coffee':'coffee'};
const plurals={magazines:'magazine',newspapers:'newspaper',books:'book',armchairs:'armchair',pictures:'picture',housewives:'housewife',policemen:'policeman',knives:'knife',eggs:'egg',biscuits:'biscuit',potatoes:'potato',tomatoes:'tomato',peas:'pea',beans:'bean',cabbages:'cabbage',lettuces:'lettuce',bananas:'banana',grapes:'grape',peaches:'peach',envelopes:'envelope',oranges:'orange',apples:'apple',vegetables:'vegetable',keys:'key',tickets:'ticket',flowers:'flower',hammers:'hammer',pens:'pen'};
const originalPictures={
 'unit25-26':{kitchen:'/assets/unit25-26/kitchen-room-mobile-v1.webp'},
 'unit27-28':{'living room':'/assets/unit27-28/living-room-mobile-v1.webp'},
 'unit31-32':{garden:'/assets/unit31-32/garden-story-v1.webp'},
 'unit35-36':{village:'/assets/unit35-36/photo-village-v1.webp'},
 'unit45-46':{boss:'/assets/unit45-46/boss.svg'},
 'unit49-50':{butcher:'/assets/unit49-50/butcher.svg'},
 'unit143-144':Object.fromEntries(previous.filter(x=>x.unit==='unit143-144').map(x=>[x.word.toLowerCase(),x.asset]))
};
const countries=new Set('greece|the u.s.|brazil|the netherlands|england|france|germany|italy|norway|russia|spain|sweden|australia|australian|austria|austrian|canada|canadian|china|chinese|finland|finnish|india|indian|japan|japanese|south korea|south korean|nigeria|nigerian|poland|polish|thailand|thai|turkey|turkish|danish|swedish|denmark'.split('|'));
const norm=s=>s.toLowerCase().replace(/[‘’]/g,"'").replace(/[‐‑–—]/g,'-');
function strings(value,p=[],result=[]){if(typeof value==='string')result.push({path:p,text:value});else if(value&&typeof value==='object')for(const[k,v]of Object.entries(value))strings(v,[...p,k],result);return result;}
const verbs=new Set('climb eat clean drink shine fly sleep shave cry wash wait jump swim boil put stay dust look keep stand study plan stop enjoy smile greet lose understand have get drive telephone pack sweep make finish tell retire sell take borrow buy join catch leave slip fall believe arrive pass fail invite joke swallow drop lie happen enter repair carry travel offer guess come wave cover serve run sit cook type sharpen open shut paint listen work read show send find see ask like want rise set hear wear'.split(' '));
const irregular={eat:['ate','eaten'],drink:['drank','drunk'],shine:['shone'],fly:['flew','flown'],sleep:['slept'],swim:['swam','swum'],put:['put'],stand:['stood'],lose:['lost'],understand:['understood'],have:['had','has'],get:['got'],drive:['drove','driven'],sweep:['swept'],make:['made'],tell:['told'],sell:['sold'],take:['took','taken'],buy:['bought'],catch:['caught'],leave:['left'],fall:['fell','fallen'],lie:['lay','lain','lying'],come:['came']};
function focusCandidates(word){const n=norm(word),parts=n.split(/…|\.\.\./).map(x=>x.trim().replace(/\?$/,'')).filter(Boolean),first=n.split(' ')[0],tail=n.slice(first.length),variants=[];
 if(verbs.has(first)){const stem=first.endsWith('e')?first.slice(0,-1):first,ing=first==='lie'?'lying':['get','stop','plan','drop','swim','slip','run','sit','put','shut','set'].includes(first)?first+first.at(-1)+'ing':stem+'ing',past=first.endsWith('e')?first+'d':first.endsWith('y')?first.slice(0,-1)+'ied':['stop','plan','drop','slip'].includes(first)?first+first.at(-1)+'ed':first+'ed';for(const f of [ing,past,first+'s',first+'es',...(irregular[first]||[])])variants.push(f+tail);}
 if(['bank','time','year','day','instalment','pound','thing','visitor','piece'].includes(n))variants.push(n+'s');
 return [word,...variants,...(parts.length&&parts.join(' ')!==n?[parts.length===1?parts[0]:parts]:[]),...(n.includes("one's")?[n.replace(/one.s/,'my'),n.replace(/one.s/,'your'),n.replace(/one.s/,'his'),'made up our minds','made up my mind']:[]),...(word.includes(' – ')?[word.split(' – ')[0]]:[])];}
function matchFocus(quote,focus){const parts=Array.isArray(focus)?focus:[focus],nq=norm(quote),actual=[];let at=0;for(const part of parts){const np=norm(part),i=nq.indexOf(np,at);if(i<0||/[a-z]/.test(nq[i-1]||'')||/[a-z]/.test(nq[i+np.length]||''))return null;actual.push(quote.slice(i,i+np.length));at=i+np.length;}return actual.length===1?actual[0]:actual;}
function contexts(unit,word){const values=[...strings(unit.learning,['learning']),...strings(unit.questions,['questions'])],out=[];
 for(const item of values){const last=item.path.at(-1);if(['ph','source','id','image','alt','audio','path','url','hint','explanation','feedback','decision','target','keyword'].includes(last)||last==='cn'&&/\p{Script=Han}/u.test(item.text)||item.path.includes('distractorReasons')||item.path.includes('options')||/\/assets\/|\[|\]|___|_{2}|<[^>]*>/.test(item.text))continue;
  const limit=word.en.split(/\s+/).length>2?68:84;
  const segments=[item.text,...item.text.split(/\n|(?<=[.!?])\s+(?=[A-Z])/),...(item.text.match(/[A-Za-z][A-Za-z0-9\s’',.!?£:;…–—()\/-]{8,}/g)||[])];
  for(let quote of segments){quote=quote.trim();if(quote.length>limit||quote.length<Math.max(8,word.en.length+3)||/\p{Script=Han}|\[|\]|_{2}|→|\||\//u.test(quote)||/\([a-z -]+\)$/i.test(quote)||!/[a-z]/i.test(quote))continue;
   for(const focus of focusCandidates(word.en)){const actual=matchFocus(quote,focus);if(!actual)continue;
    let score=item.path[0]==='learning'?30:10;if(item.path.includes('WORDS')&&last==='example')score+=70;if(item.path.includes('DIALOGUE'))score+=60;if(['PHRASES','REFERENCE','MODELS','GALLERY'].some(k=>item.path.includes(k)))score+=35;if(/[.!?]$/.test(quote))score+=8;if(quote===item.text.trim())score+=4;score-=Math.max(0,quote.length-40)/3;if(/[\/:]|\b(?:prompt|option|record|source)\b/i.test(quote))score-=15;
    out.push({source:{path:item.path,quote},focus:actual,score});break;
   }
  }
 }
 const unique=new Map();for(const item of out.sort((a,b)=>b.score-a.score))if(!unique.has(item.source.quote))unique.set(item.source.quote,item);return [...unique.values()].slice(0,6);
}
function concrete(unit,word){const key=word.en.toLowerCase();let k=plurals[key]||aliases[key]||key;
 // Identical spellings can have different meanings in different lessons.
 if((unit.id==='unit123-124'&&key==='australia')||(key==='water'&&word.cn.includes('浇'))||(key==='little'&&/数量|很少|不可数/.test(word.cn))||key==='catch'||(key==='watch'&&!word.cn.includes('手表'))||(key==='clean'&&!word.cn.includes('干净'))||(key==='empty'&&!word.cn.startsWith('空'))||(['open','shut'].includes(key)&&!word.cn.includes('着'))||(key==='old'&&!word.cn.includes('年老'))||key==='suit'||key==='light'||key==='country'||key==='pool'||key==='bar'||key==='pound'||key==='paper'||key==='note'||key==='return'||key==='left'||key==='right'||key==='thin'&&word.cn.includes('薄')||key==='short'&&word.cn.includes('短')||key==='cold'&&word.cn.includes('感冒')||key==='chicken'&&word.cn.includes('；')||key==='lamb'&&word.cn.includes('；'))return null;
 if(unit.id==='unit97-98'&&key==='case'||unit.id==='unit83-84'&&key==='suitcase')k='case-blue';
 if(unit.id==='unit121-122'&&key==='hat')k='hat-brown';
 if(unit.id==='unit141-142'&&key==='handbag')k='handbag-brown';
 if(key==='glasses'&&word.cn.includes('眼镜'))k='glasses';
 let base;
 if(originalPictures[unit.id]?.[key])base={asset:originalPictures[unit.id][key],method:'approved-source-reuse',presentation:'illustration'};
 else if(countries.has(key)&&word.image.endsWith('.svg'))base={asset:word.image,method:'factual-source-preservation',presentation:'fact'};
 else if(!(k==='orange'&&word.cn.includes('橙子'))&&!(key==='glasses'&&word.cn.includes('眼镜'))&&approved.has(k.toLowerCase())){const p=approved.get(k.toLowerCase());base={asset:p.asset,method:'approved-source-reuse',presentation:p.presentation,composition:p.composition};}
 else if(newMap.has(k)){const p=newMap.get(k);base={asset:'/assets/word-art-v2/whole-book/'+p.id+'-v1.webp',method:'reference-generation',presentation:'illustration',promptId:p.id};}
 else if(['doctor','nurse','pilot','porter','conductor','engineer','mechanic','butcher','policeman','policewoman'].includes(key)){
  const own=word.image.replace(/\.svg$/,'.webp');if(own!==word.image&&fs.existsSync(path.join(root,own)))base={asset:own,method:'approved-source-reuse',presentation:'illustration'};
  else if(word.image.endsWith('.webp'))base={asset:word.image,method:'approved-source-reuse',presentation:'illustration'};
  else if(fs.existsSync(path.join(root,word.image))&&/<image[\s>]/.test(fs.readFileSync(path.join(root,word.image),'utf8')))base={asset:word.image,method:'approved-source-reuse',presentation:'illustration'};
 }
 if(base&&plurals[key]){base.composition={kind:'pair',sources:[base.asset,base.asset]};base.presentation='relation';}
 return base;
}
function run(){const registry={version:1,units:{}},art=[],missing=[];
for(const id of units){const unit=originals[id],entries=registry.units[id]={};for(const word of unit.learning.WORDS){const image=concrete(unit,word),choices=contexts(unit,word);if(image){entries[word.en]={kind:'illustration',reviewNote:'待审：'+word.cn};art.push({unit:id,word:word.en,cn:word.cn,original:word.image,...image,contextAlternatives:choices.slice(0,2)});}else if(choices.length){const {source,focus}=choices[0];entries[word.en]={kind:'context',reviewNote:'待审：原句对应本课词义“'+word.cn+'”',source,...(norm(typeof focus==='string'?focus:'')!==norm(word.en)?{focus,focusNote:'待审：原词在原句中的实际表达'}:{})};}else{entries[word.en]={kind:'pending',reviewNote:'尚无合适原句或已审图'};missing.push({unit:id,...word});}}}
fs.mkdirSync(path.join(root,'output/whole-book-design'),{recursive:true});
fs.writeFileSync(path.join(root,'output/whole-book-design/classification-proposal.json'),JSON.stringify(registry,null,2));
fs.writeFileSync(path.join(root,'output/whole-book-design/art-proposal.json'),JSON.stringify({entries:art},null,2));
fs.writeFileSync(path.join(root,'output/whole-book-design/context-missing.json'),JSON.stringify(missing,null,2));
console.log({illustration:art.length,context:Object.values(registry.units).flatMap(Object.values).filter(x=>x.kind==='context').length,missing:missing.length,generatedAssets:new Set(art.filter(x=>x.method==='reference-generation').map(x=>x.promptId)).size});
}
if(require.main===module)run();
module.exports={contexts,concrete,focusCandidates,matchFocus,run};
