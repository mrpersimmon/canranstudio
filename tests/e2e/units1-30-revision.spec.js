'use strict';
const {test,expect}=require('@playwright/test');
const {CASES: allCases,story,activity}=require('../support/units1-30-tasks');
const CASES=Object.fromEntries(Object.entries(allCases).filter(([pair])=>!['1-2','25-26'].includes(pair))); // Current editions: unit-thirteen-types.spec.js.
test.use({reducedMotion:'reduce',actionTimeout:3500});
for(const pair of Object.keys(CASES).filter(x=>CASES[x].changes.length))test(`${pair} 新题逐项可作答，错误、线索与刷新不代答`,async({page})=>{
 test.setTimeout(90000);
 if(pair==='1-2')await page.addInitScript(()=>{window.Audio=class extends EventTarget{play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};});
 else await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await story(page,pair);
 for(const change of CASES[pair].changes)await activity(page,pair,change.group,{wrongNew:true,hintNew:true});
 expect(errors).toEqual([]);
});
