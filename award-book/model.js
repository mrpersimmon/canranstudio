'use strict';
const {MAP_CHAPTERS}=require('../course-journey/model');
const names={opening:'初识小镇',neighborhood:'邻里来信',visits:'来访时光',kindness:'暖心小事',home:'家的日常',outdoors:'户外漫步',making:'巧手小屋',hospitality:'待客心意',seasons:'四季来信',everyday:'生活点滴',caring:'关心彼此',memories:'旧日回忆',appointments:'相约时光',preparations:'准备出发',decisions:'心中的决定',departures:'远行足迹',messages:'传递消息',learning:'成长手记',choices:'生活选择',surprises:'意外惊喜',stories:'故事拾光',possibilities:'未来可能',news:'小镇新讯',woodland:'林间来信'};
function normalize(query){return String(query||'').normalize('NFKC').trim().toLowerCase().replace(/[–—−~～至到]/g,'-').replace(/\s+/g,'').replace(/^lessons?/,'').replace(/^第/,'').replace(/课$/,'');}
function range(card){const values=String(card.course||card.lesson||'').match(/\d+/g)||String(card.lesson||'').match(/\d+/g)||[];return values.length?[Number(values[0]),Number(values[1]||values[0])]:null;}
function matches(card,query){
 const term=normalize(query);if(!term)return true;
 const bounds=range(card);
 if(/^\d+$/.test(term))return !!bounds&&Number(term)>=bounds[0]&&Number(term)<=bounds[1];
 const requested=/^(\d+)-(\d+)$/.exec(term);
 if(requested){const from=Number(requested[1]),to=Number(requested[2]);return !!bounds&&from<=to&&bounds[0]<=to&&bounds[1]>=from;}
 return normalize([card.lesson,card.title].join(' ')).includes(term);
}
// The awards endpoint deliberately retains earned cards after course closure.
// Do not filter this collection by the current classroom's course grants.
function chapters(cards){
 const byCourse=new Map(cards.map(card=>[card.course,card]));
 const known=new Set(MAP_CHAPTERS.flatMap(chapter=>chapter.courses));
 const result=MAP_CHAPTERS.map((chapter,index)=>({id:chapter.id,number:index+1,name:names[chapter.id]||`第${index+1}封信`,label:chapter.label,
  slots:chapter.courses.map(course=>({course,label:'Lesson '+course.slice(4).replace('-','–'),card:byCourse.get(course)||null})),
  cards:chapter.courses.map(course=>byCourse.get(course)).filter(Boolean)})).filter(chapter=>chapter.cards.length);
 const additional=cards.filter(card=>!known.has(card.course));
 for(let i=0;i<additional.length;i+=3){const members=additional.slice(i,i+3);result.push({id:'additional-'+i/3,number:25+i/3,name:'其他纪念',label:members.map(card=>card.lesson).join(' · '),cards:members,slots:members.map(card=>({course:card.course,label:card.lesson,card}))});}
 return result;
}
function restore(cards,saved){return cards.find(card=>card.id===saved)||cards[0]||null;}
function chapterFor(groups,card){return card?groups.find(chapter=>chapter.cards.some(item=>item.id===card.id))||null:null;}
function rememberedCard(chapter,saved){return chapter?restore(chapter.cards,saved):null;}
function adjacent(chapter,card,direction){if(!chapter||!card)return null;const index=chapter.cards.findIndex(item=>item.id===card.id);return index<0?null:chapter.cards[index+direction]||null;}
module.exports={normalize,matches,range,chapters,restore,chapterFor,rememberedCard,adjacent};
