'use strict';
const {ANSWERS,activity,story}=require('./thirteen-types-flow');
const answers=ANSWERS['1-2'];
const mount=base=>base.replace(/\/unit1-2\/$/,'');
async function finishZone(page,id,{base='/unit1-2/'}={}) { return activity(page,'1-2',id,{base:mount(base)}); }
async function readStory(page,base='/unit1-2/') { return story(page,'1-2',mount(base)); }
module.exports={answers,finishZone,readStory};
