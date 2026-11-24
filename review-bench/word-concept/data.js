'use strict';
// Local design samples only. Definitions are read, never amended or saved.
const conceptEntries=[
 ['sample:word-context','语境词卡 · 六词样板','is · am · are · perhaps · today · very much'],
 ['sample:word-illustrations','插画词卡 · 六词样板','handbag · pen · book · shirt · watch · coat']
].map(([id,title,subtitle],index)=>({id,title,subtitle,index,kind:'word-concept',section:'设计样板',route:'',states:['collapsed','expanded']}));
function buildConceptData(units,registry){
 function card(unitId,en,type='context',sentence){
  const unit=units.find(u=>u.id===unitId),word=unit?.learning.WORDS.find(w=>w.en===en);
  if(!word)throw Error('Missing sample word: '+en);
  const result={unit:unitId,en:word.en,ph:word.ph,cn:word.cn,type};
  if(type==='context'){
   result.example=sentence||word.example;
   if(!result.example||!(result.example===word.example||unit.learning.DIALOGUE.some(l=>l.text===result.example)))throw Error('Sample must use an existing course sentence: '+en);
  }else{
   const art=registry.entries.find(e=>e.unit===unitId&&e.word===en&&e.status==='accepted');
   if(!art)throw Error('Sample illustration has not been reviewed: '+en);result.asset=art.asset;
  }
  return result;
 }
 const context=[card('unit1-2','is'),card('unit7-8','am'),card('unit7-8','are'),card('unit11-12','perhaps','context','Perhaps it is, sir.'),card('unit9-10','today','context','How are you today?'),card('unit1-2','very much')];
 const picture=en=>card('unit1-2',en,'illustration');
 return {groups:[
  {...conceptEntries[0],cards:context},
  {...conceptEntries[1],cards:['handbag','pen','book','shirt','watch','coat'].map(picture)}
 ]};
}
module.exports={conceptEntries,buildConceptData};
