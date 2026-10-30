'use strict';
// Read only the former anonymous namespace. Student-owned and pending records
// remain private to their existing account flows and are never claimed here.
function readLegacyRecords(storage){
 const rows=[];
 try{for(let i=0;i<storage.length;i++){
  const key=storage.key(i);if(!/^canran:(?:lesson:)?(?:unit\d+-\d+:learning|l\d+:progress|soundmark:progress)/.test(key||''))continue;
  try{
   const value=JSON.parse(storage.getItem(key));if(!value||typeof value!=='object')continue;
   const course=key.match(/unit\d+-\d+|l\d+/)?.[0];
   const label=course?'Lesson '+course.replace(/^unit|^l/,'').replace('-','–'):'音标课程';
   const completed=value.activity?.unitCompleted;
   const summary=completed&&typeof completed==='object'?Object.keys(completed).length+' 项活动完成':Object.values(value.ratings||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+' 颗星';
   rows.push({key,label,summary});
  }catch{/* A malformed local copy must not prevent opening the account panel. */}
 }}catch{/* A browser may disable storage. Viewing account actions still works. */}
 return rows;
}
module.exports={readLegacyRecords};
