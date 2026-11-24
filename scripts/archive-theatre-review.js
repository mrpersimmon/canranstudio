'use strict';
// Archive real, successful browser evidence. This script does not decide
// whether a composition is visually acceptable or update review statuses.
const fs=require('node:fs/promises'),path=require('node:path'),sharp=require('sharp');
const {UNITS}=require('../server/catalog');
const root=path.resolve(__dirname,'..'),output=path.join(root,'output/story-book-review');
const destination='docs/designs/learning-flow/evidence/2026-11-15-all-theatres';
async function reports(run,file){
 const items={};for(const directory of await fs.readdir(path.join(output,run))){if(!directory.endsWith('-chromium'))continue;
  try{const value=JSON.parse(await fs.readFile(path.join(output,run,directory,file),'utf8'));items[value.unit]={...value,directory:path.join(output,run,directory)};}catch(error){if(error.code!=='ENOENT')throw error;}
 }return items;
}
async function archive(){
 const log=await fs.readFile(path.join(root,'output/story-book-verified.log'),'utf8');
 if(!/144 passed/.test(log)||/\b\d+ failed\b/.test(log))throw Error('Final 72-course run must complete successfully before archiving');
 const before=await reports('before','composition.json'),after=await reports('verified','composition.json'),stories=await reports('verified','story-findings.json'),index={},amendments=process.argv.slice(2);let poses=0,lines=0;
 for(const run of amendments){
  const result=await fs.readFile(path.join(root,'output/story-book-'+run+'.log'),'utf8');
  if(!/\b\d+ passed\b/.test(result)||/\b\d+ failed\b/.test(result))throw Error('Follow-up run is incomplete: '+run);
  Object.assign(after,await reports(run,'composition.json'));Object.assign(stories,await reports(run,'story-findings.json'));
 }
 for(const unit of UNITS){
  if(!before[unit]||!after[unit]||!stories[unit]||stories[unit].issues.length)throw Error('Incomplete evidence for '+unit);
  const target=path.join(root,destination,unit);await fs.mkdir(target,{recursive:true});
  await sharp(path.join(before[unit].directory,'middle-chrome-iphone-se.png')).jpeg({quality:86}).toFile(path.join(target,'before-se.jpg'));
  const entries=[];for(const state of ['first','middle','last'])for(const device of require('../tests/support/required-phone-devices').devices){
   const name=state+'-'+device.id;await sharp(path.join(after[unit].directory,name+'.png')).jpeg({quality:86}).toFile(path.join(target,name+'.jpg'));entries.push(destination+'/'+unit+'/'+name+'.jpg');
  }
  const states=[];for(const capture of stories[unit].captures){const name=capture.file.replace('.png','.jpg');await sharp(path.join(stories[unit].directory,capture.file)).jpeg({quality:86}).toFile(path.join(target,name));states.push({...capture,file:destination+'/'+unit+'/'+name});}
  lines+=stories[unit].lines;poses+=states.length;index[unit]={before:destination+'/'+unit+'/before-se.jpg',pages:entries,lines:stories[unit].lines,uniqueStates:states};
 }
 const summary={runs:['verified',...amendments],units:UNITS.length,lines,lineLayouts:lines*3,beforeLayouts:UNITS.length*9,afterLayouts:UNITS.length*9,uniqueStates:poses,index};
 await fs.writeFile(path.join(root,destination,'index.json'),JSON.stringify(summary,null,2)+'\n');console.log({units:UNITS.length,lines,uniqueStates:poses});
}
archive().catch(error=>{console.error(error);process.exitCode=1;});
