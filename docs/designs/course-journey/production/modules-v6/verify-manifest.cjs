'use strict';
// Frozen, read-only verification. No baseline update or generation mode.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
if(process.argv.length!==2)throw Error('Read-only verification takes no arguments');
const root=path.resolve(__dirname,'../../../../..');
const expected=[
  {
    "file": "docs/designs/course-journey/production/modules-v6/drafts/home-interior-v1.png",
    "bytes": 2420176,
    "sha256": "84511f6bbde79cc2f80947fd1db46ba783e08885dda8122360d98315e50a1eb4"
  },
  {
    "file": "assets/course-journey/modules-v6/home-interior-v2.png",
    "bytes": 2302880,
    "sha256": "89ee1b29b1648016b49b7a8f2e5b3f623c86a50bf688f85cb12ebd17ca516aec"
  },
  {
    "file": "assets/course-journey/modules-v6/home-interior-v2.webp",
    "bytes": 282040,
    "sha256": "c2d63e24a9493bc6708adfca729b7a88554fa18360ef1dd75c7cc8aac1307d90"
  },
  {
    "file": "assets/course-journey/modules-v6/outdoors-riverwalk-v1.png",
    "bytes": 3009891,
    "sha256": "3f853ad3d98bed3935c724fa0c7cecaf50079152a2ba6a8ec04f370a782b442a"
  },
  {
    "file": "assets/course-journey/modules-v6/outdoors-riverwalk-v1.webp",
    "bytes": 526300,
    "sha256": "cfb897a12a0481ed9240d04f9cfc5039a92144cc64024a23f68ca15f1bfb108e"
  },
  {
    "file": "assets/course-journey/modules-v6/making-workshop-v1.png",
    "bytes": 2908160,
    "sha256": "1b640097d1ded523a442ff79965269ef3d99e8173159573cb15ca6559bb1a3bd"
  },
  {
    "file": "assets/course-journey/modules-v6/making-workshop-v1.webp",
    "bytes": 475746,
    "sha256": "b7f53a970a3867cd694ba31fca3863da2cb66cbedbaf3cc6d0bc39d735f18906"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v6/drafts/hospitality-sunroom-v1.png",
    "bytes": 2903718,
    "sha256": "978a2fd838f251c2e6d0e7440107f58e9b45ae2a3bc566eebde5e061b3ad704d"
  },
  {
    "file": "assets/course-journey/modules-v6/hospitality-sunroom-v2.png",
    "bytes": 2808924,
    "sha256": "fdb9cb92c870788ae8ddb74740fad2d22ede174c7debe2a4278ecdd690309b53"
  },
  {
    "file": "assets/course-journey/modules-v6/hospitality-sunroom-v2.webp",
    "bytes": 422980,
    "sha256": "ee592ffd2c2423b1f90862ed510c6d1af6f5cd0b09b394b1cd55c070453aee3a"
  },
  {
    "file": "assets/course-journey/modules-v6/making-workshop-v2.png",
    "bytes": 2769636,
    "sha256": "4ce394e2ef56fc027d5636f2020268ab5e29d64f1240bc6dd90a29a593bdaa37"
  },
  {
    "file": "assets/course-journey/modules-v6/making-workshop-v2.webp",
    "bytes": 441844,
    "sha256": "bc38853d5ec4335e18ffd18159b3ac6e41e932bef897ef39818752406c8bc27d"
  },
  {
    "file": "assets/course-journey/modules-v6/home-interior-v3.png",
    "bytes": 2269334,
    "sha256": "b55872098d9a214f572d110f3624b63a2d4a77302a1bd76c5fdd932b29682475"
  },
  {
    "file": "assets/course-journey/modules-v6/home-interior-v3.webp",
    "bytes": 276052,
    "sha256": "f52d09f8fdea300884af512ac3a0dd39e0a7aec8701c7dc57ebe8637e2ba4d40"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v6/requests.json",
    "bytes": 16566,
    "sha256": "853c314c1d8ae6ff7f5d800f59cde49e8fd9bd566ccaeed6dc7a4eac71cfb66e"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v6/revisions.json",
    "bytes": 2527,
    "sha256": "ef465cff73680fda58e6b104138ad104b7bdf131da1b404675f52a9b88161805"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v6/making-revision.json",
    "bytes": 1617,
    "sha256": "eae054fdcb20935d928e48de394c71aa7677dcf7b7d2cb80393660d7dbe1c401"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v6/home-relations-revision.json",
    "bytes": 1688,
    "sha256": "55574e084d38489d2c8a7e6c6928338bb26b5d15b8914a0f8a87015305eab4ca"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v6/receipt.json",
    "bytes": 7204,
    "sha256": "23e2cfe17208e1bcb3a9b75941616abe140e056ea773a8769a55c71523de9a83"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v6/reference-inputs.json",
    "bytes": 4929,
    "sha256": "f976c16638a6df945fd8781dd2aad02fff8dd7ca70e408cadc312445c28bfb15"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v6/contact-calibration.json",
    "bytes": 20735,
    "sha256": "74cc80bce16d343f6d1898ef3bfe9316373a14813bbe0c7e04aefd94fb8ea5a2"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v6/placement.json",
    "bytes": 12362,
    "sha256": "9cd5521d7a416fd52fbf3c1aad6a2f930410988e2f2933c1ffcbb3dc74bedd9b"
  },
  {
    "file": "assets/course-journey/kitchen-host-v1.webp",
    "bytes": 160184,
    "sha256": "3c09f58d2811b16f0c07dde79a622b38fc510fd36b3a9b56a6bd4b91e0b93ae8"
  },
  {
    "file": "assets/course-journey/living-room-host-v1.webp",
    "bytes": 160988,
    "sha256": "99900487b2f9ed86799860b72b0ac71993c8d958314515a6a26a3fe2c34c3514"
  },
  {
    "file": "assets/course-journey/tidy-room-pair-v1.webp",
    "bytes": 220338,
    "sha256": "49b62a66ae43e195563f2e3bc4fdeaebc8cf27e6d505f829d278f8404ee4fece"
  },
  {
    "file": "assets/course-journey/unit31-32-landmark-v1.webp",
    "bytes": 172790,
    "sha256": "e5cfb695f6015377e6fe599eaa8cba3f48748da36ea5cabdc98f7cf6ca0f4261"
  },
  {
    "file": "assets/course-journey/unit33-34-landmark-v1.webp",
    "bytes": 259382,
    "sha256": "aa6bb303a104a555d81770a65ba9360d9d841c5ebcc5f7f8da09b77dff1d1d30"
  },
  {
    "file": "assets/course-journey/unit35-36-landmark-v1.webp",
    "bytes": 233372,
    "sha256": "f9298c5733f8f5064d32aa161df96534392be0a98fb8a428ecdbff8727898367"
  },
  {
    "file": "assets/course-journey/unit37-38-landmark-v1.webp",
    "bytes": 188320,
    "sha256": "62c9c6dbd7349fbb07135567562107d6717e45c8962ad277195bcf6532c43f21"
  },
  {
    "file": "assets/course-journey/unit39-40-landmark-v1.webp",
    "bytes": 211948,
    "sha256": "7deae7c6a507b82ad8b33b72adbcf6ebf9629c107f4faf569fc38048e6eaba66"
  },
  {
    "file": "assets/course-journey/unit41-42-landmark-v1.webp",
    "bytes": 206210,
    "sha256": "059753f1afcbfdee3b4c542ec4928cc5b8274976bef52127746d518632d2608b"
  },
  {
    "file": "assets/course-journey/unit43-44-landmark-v2.webp",
    "bytes": 230376,
    "sha256": "fdbeb416a2f3c8913040e78cd56af6768b426a7495f397f2f446cfe9e449fead"
  },
  {
    "file": "assets/course-journey/unit45-46-landmark-v1.webp",
    "bytes": 200818,
    "sha256": "b5357f61992ec40a07faa4ae07959eeba65590a41b4bb981e99eefa218fc2148"
  },
  {
    "file": "assets/course-journey/unit47-48-landmark-v1.webp",
    "bytes": 192630,
    "sha256": "ffa3d9bf5188568b5ecd1572509e1fc50bcba55319e812e1ca53006c8f1925e6"
  },
  {
    "file": "assets/course-journey/modules-v5/visits-gallery-v1.png",
    "bytes": 2607857,
    "sha256": "bb39770355d95cabd6971ebde0d98632c58de65af8a59df86fa75939e45c1385"
  },
  {
    "file": "assets/course-journey/modules-v5/kindness-courtyard-v1.png",
    "bytes": 2793131,
    "sha256": "8b0c3768306087a8c34ebd52947a4a5c44aff00bf6e68ef59fc5a186368c9e52"
  }
];
for(const item of expected){const bytes=fs.readFileSync(path.join(root,item.file));if(bytes.length!==item.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw Error('Frozen source changed: '+item.file);}
console.log(expected.length+' frozen files verified; no files changed.');
