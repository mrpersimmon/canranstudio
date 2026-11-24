'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),target=path.join(root,'assets/word-art-v2/sample13-24/flags');fs.mkdirSync(target,{recursive:true});
for(const word of ['danish','norwegian','russian','dutch','swedish','english','american']){
 const original=fs.readFileSync(path.join(root,'assets/unit15-16',word+'.svg'),'utf8'),large=original.includes('viewBox="0 0 160 160"'),at=original.indexOf(large?'<rect x="29" y="123"':'<rect x="16" y="92"');
 if(at<0)throw Error('Unexpected caption structure: '+word);
 const front=original.slice(0,at).replace(/<title>[^<]*<\/title>/,'<title>Flag</title>').replace('viewBox="0 0 160 160"','viewBox="0 0 160 126"').replace('viewBox="0 0 120 120"','viewBox="0 0 120 98"')+(large?'</g>':'')+'</svg>\n';
 if(/\p{Script=Han}|data-label=|aria-label=|<text\b/u.test(front))throw Error('Caption remains: '+word);
 fs.writeFileSync(path.join(target,word+'.svg'),front);
}
console.log('Prepared seven label-free travel flags; original exercise flags unchanged.');
