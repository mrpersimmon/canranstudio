'use strict';
const fs=require('node:fs'),path=require('node:path');
const {definition}=require('../server/progress');
const registries=['lesson1-12-classification.json','lesson13-24-classification.json','lesson25-144-classification.json'];
function reviewedUnits(root){
 return Object.assign({},...registries.map(file=>JSON.parse(fs.readFileSync(path.join(root,'docs/designs/word-cards',file),'utf8')).units));
}
function compileProfiles(unit,review){
 if(!review)throw Error('Missing word classification: '+unit.id);
 const result={};
 if(Object.keys(review).length!==unit.learning.WORDS.length)throw Error('Word classification count changed: '+unit.id);
 for(const word of unit.learning.WORDS){
  const item=review[word.en];if(!item||!['illustration','context'].includes(item.kind)||!item.reviewNote)throw Error('Unreviewed word: '+unit.id+' '+word.en);
  result[word.en]={kind:item.kind};
  if(item.kind==='context'){
   const original=item.source?.path.reduce((value,key)=>value?.[key],unit),quote=item.source?.quote;
   if(typeof original!=='string'||!quote||!original.includes(quote))throw Error('Context source changed: '+unit.id+' '+word.en);
   if(item.presentation==='word'){
    if(original!==word.en||quote!==word.en)throw Error('纯文字卡必须引用原词条来源：'+word.en);
    result[word.en].presentation='word';continue;
   }
   const focus=item.focus||word.en,parts=Array.isArray(focus)?focus:[focus];let at=0;
   if(item.focus&&!item.focusNote)throw Error('突出词形缺少核对说明：'+word.en);
   for(const part of parts){if(typeof part!=='string'||!part)throw Error('Invalid context focus: '+word.en);const next=quote.toLowerCase().indexOf(part.toLowerCase(),at);if(next<0)throw Error('Context focus missing: '+word.en);at=next+part.length;}
   result[word.en].sentence=quote;
   if(item.focus)result[word.en].focus=focus;
  }
 }
 return result;
}
function profilesFor(root,id,unit=definition(root,id,'/')){
 const units=reviewedUnits(root);
 return units[id]?compileProfiles(unit,units[id]):null;
}
function run(root=path.resolve(__dirname,'..')){
 const units=reviewedUnits(root);
 for(const id of Object.keys(units)){
  const profiles=compileProfiles(definition(root,id,'/'),units[id]);
  fs.writeFileSync(path.join(root,id,'learning-words.js'),'/* Reviewed presentation only; original learning definitions remain unchanged. */\nCanranCore.learningWordCards='+JSON.stringify(profiles,null,2)+';\n');
 }
 console.log('Prepared '+Object.keys(units).length+' course word decks.');
}
if(require.main===module)run();
module.exports={compileProfiles,profilesFor,reviewedUnits,run};
