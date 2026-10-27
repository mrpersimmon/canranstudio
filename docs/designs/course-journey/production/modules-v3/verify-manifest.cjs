'use strict';

// Frozen artwork and generation evidence. This file has no write/update mode.
// Historical absolute returnedPath/source fields are evidence, never paths used by this check.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const manifest={
  "version": "modules-v3-art-2026-10-24",
  "frozenAt": "2026-10-24",
  "scope": "Three adopted image assets as six native PNG/encoded WebP files plus five actual generation request/receipt JSON files. Excludes runtime, layout coordinates, styles, screenshots, editable documents and historical absolute source paths embedded in receipts.",
  "adoptedAssetCount": 3,
  "generationCallCount": 3,
  "evidenceFileCount": 5,
  "files": [
    {
      "path": "assets/course-journey/modules-v3/opening-world-v1.png",
      "role": "adopted-art",
      "bytes": 2463868,
      "sha256": "6fb4e002294e17052cb9d3902427613c75f40e63d04dd21db190d66bdf1b775a"
    },
    {
      "path": "assets/course-journey/modules-v3/opening-world-v1.webp",
      "role": "adopted-art",
      "bytes": 348220,
      "sha256": "d903bc4ebb797e3fdb26e45d18ffa7d10e9dde0b43f215f842e5a5887bf3ac86"
    },
    {
      "path": "assets/course-journey/modules-v3/neighborhood-world-v1.png",
      "role": "adopted-art",
      "bytes": 2511839,
      "sha256": "056d08afef9a2be1add1505181d701f6a94a2543c5d6973fe5fead4c45a86fae"
    },
    {
      "path": "assets/course-journey/modules-v3/neighborhood-world-v1.webp",
      "role": "adopted-art",
      "bytes": 370828,
      "sha256": "caf4b380811879e2b26b88a56864ede332fa5305384314475534cd1e01deb1c7"
    },
    {
      "path": "assets/course-journey/modules-v3/distant-garden-v1.png",
      "role": "adopted-art",
      "bytes": 1708952,
      "sha256": "24dd2d3b0f105bb8713fede406131b84765b18cdad46e029c9e297cdba085dfa"
    },
    {
      "path": "assets/course-journey/modules-v3/distant-garden-v1.webp",
      "role": "adopted-art",
      "bytes": 102448,
      "sha256": "5fbd6176888ac3b0f44e6ebe47cf1259400398584d60ae107af6ee34b0cce90e"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v3/opening-request.json",
      "role": "generation-evidence",
      "bytes": 3608,
      "sha256": "5a45ae433fb266f444e2117bfc54fcd73971a89e0b94f0017fe58923488475e9"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v3/opening-world-v1-receipt.json",
      "role": "generation-evidence",
      "bytes": 4953,
      "sha256": "d036c085edbdcde29bc2898a00c96bd80753b85dd8519abe94aab049e2270c25"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v3/neighborhood-request.json",
      "role": "generation-evidence",
      "bytes": 2615,
      "sha256": "e9c5d15bcb8e17f4356c7ff27a41087a8a3a3473813256f6194aaabba550443d"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v3/neighborhood-world-v1-receipt.json",
      "role": "generation-evidence",
      "bytes": 3827,
      "sha256": "093c49dc616b2d20b7f86d4e98b3e61a66018a6fc63ae14a0b03d18a59e77108"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v3/distant-receipt.json",
      "role": "generation-evidence",
      "bytes": 3678,
      "sha256": "e5b541da03deffeb02ccdffa8b0a2c7f49874c7979e1a6eddedff4cff240a0cc"
    }
  ]
};
const root=path.resolve(__dirname,'../../../../..');
if(process.argv.length>2)throw new Error('Read-only verification accepts no arguments and cannot update baselines.');
const failures=[];
let matched=0;
for(const expected of manifest.files){
 const target=path.resolve(root,expected.path);
 if(!target.startsWith(root+path.sep)){failures.push({path:expected.path,reason:'Outside repository'});continue;}
 try{
  const bytes=fs.readFileSync(target);
  const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  if(bytes.length!==expected.bytes||sha256!==expected.sha256)failures.push({path:expected.path,reason:'Changed',expectedBytes:expected.bytes,actualBytes:bytes.length,expectedSha256:expected.sha256,actualSha256:sha256});
  else matched++;
 }catch(error){failures.push({path:expected.path,reason:'Unreadable',code:error.code||'READ_ERROR'});}
}
const result={version:manifest.version,readOnly:true,filesChecked:manifest.files.length,filesMatched:matched,adoptedAssetCount:manifest.adoptedAssetCount,generationCallCount:manifest.generationCallCount,artFileCount:manifest.files.filter(file=>file.role==='adopted-art').length,evidenceFileCount:manifest.evidenceFileCount,passed:failures.length===0,failures};
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exitCode=1;

