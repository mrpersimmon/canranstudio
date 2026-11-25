'use strict';
// Node preload for scoped checks; never loaded by a student course.
const at=process.argv.findIndex(arg=>arg.startsWith('--course-scope='));
// Workers inherit this preload but do not receive the parent's CLI arguments.
const selection=at<0?process.env.CANRAN_TEST_COURSE_SCOPE:process.argv.splice(at,1)[0].slice('--course-scope='.length);
const units=selection===undefined?Array.from({length:60},(_,i)=>'unit'+(25+i*2)+'-'+(26+i*2)):selection.split(',');
if(!units.length||units.some(id=>!/^unit\d+-\d+$/.test(id)))throw Error('Invalid course check scope');
const scope=units.join(',');
for(const key of ['CANRAN_TEST_COURSE_SCOPE','SAMPLE_UNITS','ROLLOUT_UNITS','WORD_DECK_UNITS','WHOLE_BOOK_UNITS','STORY_UNITS'])process.env[key]=scope;

process.env.STORY_TRANSLATION_CHECK='1';
