'use strict';
// Archive screenshots only from successful real-page checks. This does not
// mark artwork accepted; source/meaning and visual review remain separate.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const {definition}=require('../server/progress'),{profilesFor}=require('./prepare-word-decks'),{createPages}=require('../core/word-deck');
const root=path.resolve(__dirname,'..'),runs=process.argv.slice(2),units=Array.from({length:60},(_,i)=>'unit'+(25+i*2)+'-'+(26+i*2));
(async()=>{const resolved={},dest='docs/designs/learning-flow/evidence/2026-11-15-whole-book/words';
 for(const run of runs){const log=fs.readFileSync(path.join(root,run+'.log'),'utf8'),dirs=fs.readdirSync(path.join(root,run));
  for(const line of log.split(/\r?\n/)){
   // The primary evidence set uses Chromium. Never pick a different project's
   // similarly named directory when a follow-up run contains both engines.
   if(!/\bok\s+\d+/.test(line)||!line.includes('[chromium]')||!/(?:sample-words|word-text-layout)\.spec\.js/.test(line))continue;
   const id=line.match(/(unit\d+-\d+) (?:real grouped|all word text)/)?.[1];if(!id)continue;
   const projectDirs=dirs.filter(d=>d.endsWith('-chromium'));
   const directory=projectDirs.find(d=>d.startsWith((line.includes('word-text-layout.spec.js')?'word-text-layout-':'sample-words-')+id+'-'));
   const fallback=directory||projectDirs.find(d=>{const file=path.join(root,run,d,'text-findings.json');return fs.existsSync(file)&&JSON.parse(fs.readFileSync(file,'utf8')).unit===id;});
   if(fallback)resolved[id]=path.join(root,run,fallback);
  }
 }
 const evidence={};for(const id of units){if(!resolved[id])throw Error('No successful real word-page run for '+id);const u=definition(root,id,'/'),pages=createPages(u.learning.WORDS,profilesFor(root,id,u));evidence[id]={};
  for(const page of pages){const sources=[];for(const device of require('../tests/support/required-phone-devices').devices){const file=page.kind+'-'+page.local+'-'+device.id+'.png',source=path.join(resolved[id],file),target=dest+'/'+id+'/'+page.local+'-'+device.id+'.jpg';fs.mkdirSync(path.dirname(path.join(root,target)),{recursive:true});await sharp(source).jpeg({quality:84,chromaSubsampling:'4:4:4'}).toFile(path.join(root,target));sources.push(target);}
   for(const word of page.words)evidence[id][word.en]=sources;
  }
 }
 fs.writeFileSync(path.join(root,'docs/designs/learning-flow/evidence/2026-11-15-whole-book/word-pages.json'),JSON.stringify(evidence,null,2)+'\n');console.log('Archived all sixty unit word pages from successful runs.');
})().catch(error=>{console.error(error);process.exitCode=1;});
