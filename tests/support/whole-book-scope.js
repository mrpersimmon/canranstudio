'use strict';
// Node preload for scoped checks; never loaded by a student course.
const at=process.argv.findIndex(arg=>arg.startsWith('--course-scope='));
const units=at<0?Array.from({length:60},(_,i)=>'unit'+(25+i*2)+'-'+(26+i*2)):process.argv.splice(at,1)[0].slice('--course-scope='.length).split(',');
if(!units.length||units.some(id=>!/^unit\d+-\d+$/.test(id)))throw Error('Invalid course check scope');
for(const key of ['SAMPLE_UNITS','ROLLOUT_UNITS','WORD_DECK_UNITS','WHOLE_BOOK_UNITS','STORY_UNITS'])process.env[key]=units.join(',');

process.env.STORY_TRANSLATION_CHECK='1';
