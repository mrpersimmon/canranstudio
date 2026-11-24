'use strict';
// Vocabulary fronts omit translations; exercises keep the original labelled SVGs.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const flags=['french','german','japanese','south-korean','chinese','swedish','english','american'];
const output=path.join(root,'assets/unit5-6-word-cards/flags');
fs.mkdirSync(output,{recursive:true});
for(const flag of flags){
 const source=fs.readFileSync(path.join(root,'assets/unit5-6-current',flag+'-v154.svg'),'utf8');
 // Match only the trailing nameplate, never an arbitrary path inside the flag.
 const caption=/\s*<rect x="16" y="92"[^>]*\/>\s*<g aria-label="[^"]+"[^>]*>[\s\S]*?<\/g>\s*(?=<\/svg>)/;
 if(!caption.test(source))throw Error('Flag caption structure changed: '+flag);
 const front=source.replace(caption,'\n').replace(/<title>[^<]*<\/title>/,'<title>Flag</title>').replace('viewBox="0 0 120 120"','viewBox="0 0 120 98"').replace(/\r\n/g,'\n');
 if(/\p{Script=Han}|aria-label=|<text\b/u.test(front))throw Error('Translated label remains: '+flag);
 fs.writeFileSync(path.join(output,flag+'.svg'),front);
}
console.log('Prepared 8 word-only flags; original exercise images unchanged.');
