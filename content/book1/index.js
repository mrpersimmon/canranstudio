'use strict';
const lessons=[...require('./lessons51-62'),...require('./lessons63-72'),...require('./lessons73-84'),...require('./lessons85-96'),...require('./lessons97-108'),...require('./lessons109-120'),...require('./lessons121-132'),...require('./lessons133-144')];
const expected=Array.from({length:47},(_,i)=>51+i*2);
if(JSON.stringify(lessons.map(x=>x.lesson))!==JSON.stringify(expected))throw Error('Book 1 continuation must cover every pair through 143 & 144');
module.exports=lessons;
