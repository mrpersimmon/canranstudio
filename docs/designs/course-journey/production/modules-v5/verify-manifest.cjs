'use strict';
// Read-only production receipts; this tool never updates a baseline.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
if(process.argv.length!==2)throw Error('Read-only verification takes no arguments');
const root=path.resolve(__dirname,'../../../../..');
const expected=[
  {
    "file": "assets/course-journey/modules-v5/visits-gallery-v1.png",
    "bytes": 2607857,
    "sha256": "bb39770355d95cabd6971ebde0d98632c58de65af8a59df86fa75939e45c1385"
  },
  {
    "file": "assets/course-journey/modules-v5/visits-gallery-v1.webp",
    "bytes": 393810,
    "sha256": "b3455251e6ae4f93f3472e74836b844814229d8cfe582571f5a21b4b9b2309f7"
  },
  {
    "file": "assets/course-journey/modules-v5/kindness-courtyard-v1.png",
    "bytes": 2793131,
    "sha256": "8b0c3768306087a8c34ebd52947a4a5c44aff00bf6e68ef59fc5a186368c9e52"
  },
  {
    "file": "assets/course-journey/modules-v5/kindness-courtyard-v1.webp",
    "bytes": 476294,
    "sha256": "26573da419fac04ff45a78879d3829dac072aafd5b9a1dc35c43ea759ef5a840"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v5/requests.json",
    "bytes": 8832,
    "sha256": "0dba5105ddb89532e9a16b1033e5f9a02f14e352598c11d3c7c378a6b57d5a9b"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v5/receipt.json",
    "bytes": 2380,
    "sha256": "2f55a063c3a1e1ddaf6d9e206dd86cac4e2cc39e3c29ad0095889f4b907334d3"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v5/placement.json",
    "bytes": 5896,
    "sha256": "02080fc22b8125fa76f09ec3bbd4d98b2271dd85cff2287214b144848098bcb5"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v5/contact-calibration.json",
    "bytes": 8195,
    "sha256": "1aa43bd7e26a9ecc51605e007b5ca7d8353d8019940ab6a28b94fa2a249ee5f6"
  },
  {
    "file": "assets/course-journey/dress-friends-v1.webp",
    "bytes": 241924,
    "sha256": "530fb6814a93c8eac50016aba904d79e6c6af2ee363b33149d9ba918399fb3f8"
  },
  {
    "file": "assets/course-journey/passport-travelers-v1.webp",
    "bytes": 202696,
    "sha256": "d4c62c5346a653c6dc682a4815ab6ebb55ad27e4f0ccddaa82ba8a88fbc97e25"
  },
  {
    "file": "assets/course-journey/office-introduction-v1.webp",
    "bytes": 213316,
    "sha256": "76b56f534f84e6cf4d552e38d51982441363ede96a71086c241a5765a96ea2d2"
  },
  {
    "file": "assets/course-journey/icecream-family-v1.webp",
    "bytes": 252628,
    "sha256": "88a6e91c270b7ba7f89a321306bccc04bda586808905b3db43d8cd9a4102b921"
  },
  {
    "file": "assets/course-journey/red-book-pair-v1.webp",
    "bytes": 176172,
    "sha256": "6ea1c1b82c9f94631cdde2fe75a78183ff8440016f99be753dca246e96d3b8c2"
  },
  {
    "file": "assets/course-journey/shelf-glasses-pair-v1.webp",
    "bytes": 190772,
    "sha256": "5c66cbf8060c302918721a95be60abf063936c27d8cb3663a1dea31b0eb316ae"
  },
  {
    "file": "assets/course-journey/modules-v4/neighborhood-town-v1.png",
    "bytes": 2810740,
    "sha256": "b0820c8379f85f31d76a0c2bfbab3ba8fb0cbcce0f5a427b26ad80605676dde1"
  },
  {
    "file": "assets/course-journey/modules-v3/opening-world-v1.png",
    "bytes": 2463868,
    "sha256": "6fb4e002294e17052cb9d3902427613c75f40e63d04dd21db190d66bdf1b775a"
  }
];
const failures=[];for(const item of expected){try{const data=fs.readFileSync(path.join(root,item.file)),hash=crypto.createHash('sha256').update(data).digest('hex');if(data.length!==item.bytes||hash!==item.sha256)failures.push(item.file);}catch{failures.push(item.file);}}
console.log(JSON.stringify({files:expected.length,matched:expected.length-failures.length,failures},null,2));if(failures.length)process.exitCode=1;
