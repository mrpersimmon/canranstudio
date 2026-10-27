'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const manifest={
  "version": "modules-v4-town-2026-10-25",
  "generationCalls": 3,
  "adoptedAssets": 1,
  "files": [
    {
      "path": "assets/course-journey/modules-v4/neighborhood-town-v1.png",
      "bytes": 2810740,
      "sha256": "b0820c8379f85f31d76a0c2bfbab3ba8fb0cbcce0f5a427b26ad80605676dde1"
    },
    {
      "path": "assets/course-journey/modules-v4/neighborhood-town-v1.webp",
      "bytes": 475830,
      "sha256": "6e58d2a13912da9ff7b6e5d3d50fab79361d42be1bfc048630c5e8a800c322ac"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v4/drafts/town-attempt-1.png",
      "bytes": 2504599,
      "sha256": "fb44ad1fea4e286138810aa1467e0588393c1354ae0bba4fdfdc3ac6326699b9"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v4/drafts/town-attempt-2.png",
      "bytes": 2583046,
      "sha256": "6c36cb1ad41720defc21aa04ad179b6509ebc1c4350112ece9e3d2c01f8e5832"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v4/requests.json",
      "bytes": 10313,
      "sha256": "4ff42aecec741ee86ddbadfcef45f23b6a6df0faa7a30cc7b0918ce92a08cca6"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v4/receipt.json",
      "bytes": 4141,
      "sha256": "19cd7996335d5b48f3f0049e446750ec5bcbec04aae8fbcb950cf4ecab89a419"
    }
  ]
};
const root=path.resolve(__dirname,'../../../../..');
if(process.argv.length>2)throw Error('Read-only verification; no update arguments.');
const failures=[];
for(const f of manifest.files){const p=path.resolve(root,f.path);if(!p.startsWith(root+path.sep))throw Error('Outside repository');try{const b=fs.readFileSync(p),sha=crypto.createHash('sha256').update(b).digest('hex');if(b.length!==f.bytes||sha!==f.sha256)failures.push({path:f.path,reason:'Changed'});}catch(e){failures.push({path:f.path,reason:'Unreadable'});}}
console.log(JSON.stringify({version:manifest.version,readOnly:true,filesChecked:manifest.files.length,generationCalls:manifest.generationCalls,adoptedAssets:manifest.adoptedAssets,passed:!failures.length,failures},null,2));
if(failures.length)process.exitCode=1;
