'use strict';
const {matches}=require('../server/public/course-directory');
const continuousDescriptions={outdoors:'花园石径经过开阔的河桥，通向草地和村庄岸边',making:'连续砖地串起木工作坊、陈设小院与家庭后廊',hospitality:'暖木地板与青绿玻璃窗连接备茶角、写信区和会客露台',...Object.fromEntries(Object.entries(require('./remaining-route-worlds.json')).map(([id,world])=>[id,world.description]))};
const MAP_CHAPTERS=Object.freeze([
  {id:'opening',label:'Lesson 1–6',courses:['unit1-2','unit3-4','unit5-6'],alt:'奶油色石路穿过珊瑚拱桥，连接手提包广场、雨伞认领柜台和学堂前庭'},
  {id:'neighborhood',label:'Lesson 7–12',courses:['unit7-8','unit9-10','unit11-12'],alt:'奶油石路穿过邻里街巷，连接家门会客处、街角问候站与学堂入口'},
  {id:'visits',label:'Lesson 13–18',courses:['unit13-14','unit15-16','unit17-18'],alt:'连续奶油色连廊连接家门会客处、旅行接待厅和办公室入口'},
  {id:'kindness',label:'Lesson 19–24',courses:['unit19-20','unit21-22','unit23-24'],alt:'阳光庭院的石路连接家庭休息角、阅读室门廊与餐厅露台'},
  {id:'home',label:'Lesson 25–30',courses:['unit25-26','unit27-28','unit29-30'],alt:'连续奶油色居室地面连接厨房、客厅与卧室'},
  ...require('./complete-journey-chapters.json').map(chapter=>continuousDescriptions[chapter.id]?{...chapter,alt:continuousDescriptions[chapter.id]}:chapter)
]);
const MAP_COURSES=Object.freeze(MAP_CHAPTERS.flatMap(chapter=>chapter.courses));
function chapterFor(id){return MAP_CHAPTERS.find(chapter=>chapter.courses.includes(id))?.id;}
function mapChapters(courses){return MAP_CHAPTERS.filter(chapter=>courses.some(course=>chapter.courses.includes(course.id)));}
function lesson(course){return Number(/^unit(\d+)-\d+$/.exec(course.id)?.[1]);}
function filter(courses,query=''){
  return courses.filter(course=>matches(course,query));
}
function bookmarkKey(who){
  return 'canran:journey:v1:'+who.student.id+(who.systemUpgrade?.epoch?':'+who.systemUpgrade.epoch:'');
}
function restore(courses,saved,fromCourse){
  const selected=courses.find(course=>course.id===fromCourse)?.id||courses.find(course=>course.id===saved?.selected)?.id||courses[0]?.id||null;
  const visits={};
  for(const course of courses){
    const chapter=chapterFor(course.id),visit=saved?.visits?.[chapter];
    if(visit?.selected===course.id&&Number.isFinite(visit.scroll)&&Number.isFinite(visit.width)){
      visits[chapter]={selected:course.id,scroll:Math.max(0,visit.scroll),width:visit.width};
    }
  }
  return {selected,chapter:chapterFor(selected)||'opening',scroll:Math.max(0,Math.min(10000,Number(saved?.scroll)||0)),visits};
}
function href(course,base,preview=''){
  return base+course.id+'/'+(preview?'?preview='+encodeURIComponent(preview):'')+'#learn/'+encodeURIComponent(course.next||'words');
}
function actionLabel(course,upgraded=false){
  if(course.next==='certificate')return '查看纪念卡';
  if(upgraded&&course.completed)return '再次学习';
  return course.started||course.stars?'继续学习':'开始学习';
}
module.exports={MAP_COURSES,MAP_CHAPTERS,chapterFor,mapChapters,lesson,filter,bookmarkKey,restore,href,actionLabel};
