'use strict';
// Only remembers which server-confirmed completion has already been seen on
// this browser. It never writes grades, awards, or the first-full-star date.
function takeNewCompletions(storage,studentId,courses){
  const key='canran:journey:completion-notice:v1:'+studentId;
  let previous;
  try{previous=JSON.parse(storage.getItem(key));}catch{}
  const known=previous?.version===1&&previous.courses&&typeof previous.courses==='object'?previous.courses:{};
  const next={...known},fresh=[];
  for(const course of courses){
    const full=(course.stars||0)>=(course.maxStars||5);
    // First visits and newly authorized courses establish a quiet baseline.
    if(full&&known[course.id]===false)fresh.push(course.id);
    next[course.id]=full;
  }
  try{storage.setItem(key,JSON.stringify({version:1,courses:next}));}catch{}
  return fresh;
}
module.exports={takeNewCompletions};
