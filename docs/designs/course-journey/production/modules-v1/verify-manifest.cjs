'use strict';

// Frozen art manifest. This file only reads files; it never creates or updates hashes.
// Runtime code and placement coordinates are intentionally outside this art freeze.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const manifest = {
  "version": "modules-v1-art-2026-10-23",
  "frozenAt": "2026-10-23",
  "scope": "Seven adopted art assets, ten actual generation requests, seven receipts, three retained first drafts and eight original visual references. Excludes runtime, placement, editable design documentation, preview screenshots and historical machine source paths.",
  "adoptedAssetCount": 7,
  "generationCallCount": 10,
  "files": [
    {
      "path": "assets/course-journey/friends-trio-v1.webp",
      "role": "original-reference",
      "bytes": 175874,
      "sha256": "8c97dedf6894f23a6fad779704be71cae5879ecebae9bc7e80815e5a47c2de59"
    },
    {
      "path": "assets/course-journey/greeting-neighbors-v1.webp",
      "role": "original-reference",
      "bytes": 159450,
      "sha256": "f5e40c6f0793e2662ca3d8c0f9134e855e5d0464bb302a5926279ae6461fb05b"
    },
    {
      "path": "assets/course-journey/handbag-couple.webp",
      "role": "original-reference",
      "bytes": 146522,
      "sha256": "df99ee8abaf3ce1cbbc3c2849c721e2c5302355a7ebf05825092d2a263fa4967"
    },
    {
      "path": "assets/course-journey/interview-couple-v1.webp",
      "role": "original-reference",
      "bytes": 194328,
      "sha256": "eaebe41691113fb754db886352183d7ada8d55e87480edcfe0db16eea09f9843"
    },
    {
      "path": "assets/course-journey/modules-v1/ambient-water-v1.png",
      "role": "adopted-art",
      "bytes": 1906474,
      "sha256": "04fb9ebbad4ba2495955a86898cec0e1c86f645b6083a606c81881c960852f3c"
    },
    {
      "path": "assets/course-journey/modules-v1/ambient-water-v1.webp",
      "role": "adopted-art",
      "bytes": 169872,
      "sha256": "82ed21e2651122c6de10d74ce06f24b78cfa9dfc9708dd0c089f69f6759d99d4"
    },
    {
      "path": "assets/course-journey/modules-v1/unit1-2-ground.png",
      "role": "adopted-art",
      "bytes": 1811978,
      "sha256": "04459457b992610950e4d40706c9772767e44c34ccf4469855582279ba65386a"
    },
    {
      "path": "assets/course-journey/modules-v1/unit1-2-ground.webp",
      "role": "adopted-art",
      "bytes": 987428,
      "sha256": "ab751550186d000e83c9fc5cf9e9d67eb0272402c004ab7ca11723cbb9c84e1d"
    },
    {
      "path": "assets/course-journey/modules-v1/unit11-12-ground.png",
      "role": "adopted-art",
      "bytes": 1768069,
      "sha256": "af6a9758de3aab9bb3b578d01148a342af82f6238d11034f2a04ece1e0fb11ed"
    },
    {
      "path": "assets/course-journey/modules-v1/unit11-12-ground.webp",
      "role": "adopted-art",
      "bytes": 161904,
      "sha256": "21ebe7cf6da9cc82ad869e3d045c857b98cbdd97af5d732f2fb51d71eb5f7878"
    },
    {
      "path": "assets/course-journey/modules-v1/unit3-4-ground.png",
      "role": "adopted-art",
      "bytes": 1664214,
      "sha256": "5ceda37b474a79437b37a72821d709dace1b6279018e425f1fdcbad284f35b39"
    },
    {
      "path": "assets/course-journey/modules-v1/unit3-4-ground.webp",
      "role": "adopted-art",
      "bytes": 779782,
      "sha256": "9ea4d52d993f9d6c7d7208f6bbca8c7567a7a07770f5b56e57446fbddf7ef14f"
    },
    {
      "path": "assets/course-journey/modules-v1/unit5-6-ground.png",
      "role": "adopted-art",
      "bytes": 1827444,
      "sha256": "492c66fe644272d2dd49ef622b7b9d0e6f0e60d877df8f7765eb56806974245d"
    },
    {
      "path": "assets/course-journey/modules-v1/unit5-6-ground.webp",
      "role": "adopted-art",
      "bytes": 189582,
      "sha256": "2c78e1f87e6c87eae3f96afe6d2aacdfdf038201a1461b9327c47d35646f950a"
    },
    {
      "path": "assets/course-journey/modules-v1/unit7-8-ground.png",
      "role": "adopted-art",
      "bytes": 1918494,
      "sha256": "9e99aba3a4f78140178d7f03406dd1c33a65fc6e0d476aef8964dd107600a14a"
    },
    {
      "path": "assets/course-journey/modules-v1/unit7-8-ground.webp",
      "role": "adopted-art",
      "bytes": 230518,
      "sha256": "cb8af4a5d69b980f0201315875f8ab66339aafb61fefb94d4dd99b5886530126"
    },
    {
      "path": "assets/course-journey/modules-v1/unit9-10-ground.png",
      "role": "adopted-art",
      "bytes": 1879862,
      "sha256": "e01d1ebf6243199b711dfd9e28a681c6a59ccf4882486d37af6c3c89d332fd2f"
    },
    {
      "path": "assets/course-journey/modules-v1/unit9-10-ground.webp",
      "role": "adopted-art",
      "bytes": 198548,
      "sha256": "edf891b5aaf27bd87e3d91a20c8cc052901eba5578dc609efbab32941856d399"
    },
    {
      "path": "assets/course-journey/neighborhood-mobile-v1.webp",
      "role": "original-reference",
      "bytes": 312386,
      "sha256": "4f75b6ef989c8b3e72794298dc89e96a444634f9b695b7e8e65bc2aa9f601395"
    },
    {
      "path": "assets/course-journey/opening-mobile-v2.webp",
      "role": "original-reference",
      "bytes": 274858,
      "sha256": "dee8003d458cb1bb266b0a0207f647430de5d26a5ffcdbacf6d90f047bb4989c"
    },
    {
      "path": "assets/course-journey/shirt-return-v1.webp",
      "role": "original-reference",
      "bytes": 186850,
      "sha256": "c741eedb1b795fe6260db04853f68587790b2ec36b507e882d5ca26df5d29480"
    },
    {
      "path": "assets/course-journey/umbrella-counter-v1.webp",
      "role": "original-reference",
      "bytes": 167456,
      "sha256": "c1a9f4d258a4caf9134403a2171924e643e177b792b7f3ff4f12829da8732a92"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/ambient-water-v1-receipt.json",
      "role": "generation-receipt",
      "bytes": 2203,
      "sha256": "d103965d05aea38cbaeb47e90d5e86d15343c628d8798a1fe18f944bfe09681c"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/ambient-water-v1-request.json",
      "role": "generation-request",
      "bytes": 2373,
      "sha256": "49c42fea8c5d5e33b3ce864cc04ba5b80c10be541ced04b227fd1a9dec8082d5"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit1-2-ground-first-generation.png",
      "role": "retained-variant",
      "bytes": 1749222,
      "sha256": "3c0ad5890cfe59717b8080b7144cf9e8a6e77bf9c4bb5235af0975162059ce52"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit1-2-receipt.json",
      "role": "generation-receipt",
      "bytes": 3054,
      "sha256": "2d37f888e8c712fab0b52f3b5249bef36abb9d50f23038ac462478513469fe78"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit1-2-request-v2.json",
      "role": "generation-request",
      "bytes": 1624,
      "sha256": "69da1f2679fd1473e6d6c07a807c8a2a9dacfa71d713c98803b2c80dbeb6eba5"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit1-2-request.json",
      "role": "generation-request",
      "bytes": 2989,
      "sha256": "38a0cc3ef3206a4db199611c84acd2ed2c89941e131f0e2e11860fdb51424cf9"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit11-12-ground-receipt.json",
      "role": "generation-receipt",
      "bytes": 2682,
      "sha256": "2fd1ffd8eda3d34548a2de36510f26277968d1ee7e5756b666f8e90b0b718c0d"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit11-12-request.json",
      "role": "generation-request",
      "bytes": 2900,
      "sha256": "948998b499df9f5d47e1c2b6e4b948aadcbae04b0113b008e6fcc95774401c89"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit3-4-receipt.json",
      "role": "generation-receipt",
      "bytes": 2524,
      "sha256": "a82ddb43057af1bc9b5c5636a1fc3f78a71f6e15e3eda021cfeae0c7a65f1831"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit3-4-request.json",
      "role": "generation-request",
      "bytes": 2386,
      "sha256": "7c57f38f9a303334650f6b6aa81f0cf02e9b5210a4d5f4da8ce990c57b86d79d"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit5-6-receipt.json",
      "role": "generation-receipt",
      "bytes": 2331,
      "sha256": "863f3b40f5502e7d42b41ac83cbf756cc1b12456c7bc75c3db14c3d5c0db4edd"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit5-6-request-v1.json",
      "role": "generation-request",
      "bytes": 2987,
      "sha256": "e4f5647fe7776bf851380fd3f445642f0a928e8674266912ce2d8589f91febf1"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit5-6-request-v2.json",
      "role": "generation-request",
      "bytes": 1358,
      "sha256": "cef4ec0ba6a92c973c58d1c75dc860222616a458d1dae8221a82dabd95e7778f"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit7-8-receipt.json",
      "role": "generation-receipt",
      "bytes": 2146,
      "sha256": "a5f8a674ba1fe928632398ec49f87b1faef155e802a8bc96154985d6b9363082"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit7-8-request-v1.json",
      "role": "generation-request",
      "bytes": 2832,
      "sha256": "6afac292b889a4ecae879eb13dd6237eb4135c76ebbe5c924be1fd962ee2f2c2"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit9-10-ground-first-generation.png",
      "role": "retained-variant",
      "bytes": 1912210,
      "sha256": "b7c4f712f1b5e56689c63febed11d80376366d27ce52ad33e64314e1d04a262a"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit9-10-ground-receipt.json",
      "role": "generation-receipt",
      "bytes": 3657,
      "sha256": "b809773232e0c6fcd7371e932da8d218717098d314371a9eb0973cb667e69d91"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit9-10-request-v2.json",
      "role": "generation-request",
      "bytes": 1389,
      "sha256": "18494a53846fb68d36938808474539bcf6f2f8d367a6daa82eba2763fb3d9677"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/unit9-10-request.json",
      "role": "generation-request",
      "bytes": 3177,
      "sha256": "6cc8abfbe5c014395e389bcd1e114ebeaeb325f85b14c5eb2b2d41310281e8d6"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v1/variants/unit5-6-ground-v1.png",
      "role": "retained-variant",
      "bytes": 1866821,
      "sha256": "94c6051401f24bf42f8a0e2980ee08a23b23fb1c5c5c3858fe078523f6632075"
    }
  ]
};

function verify(root = path.resolve(__dirname, '../../../../..')) {
  const failures = [];
  const duplicates = new Set();
  for (const item of manifest.files) {
    if (duplicates.has(item.path)) failures.push('Duplicate manifest path: ' + item.path);
    duplicates.add(item.path);
    const fullPath = path.resolve(root, item.path);
    const relative = path.relative(root, fullPath);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
      failures.push('Manifest path escapes the repository: ' + item.path);
      continue;
    }
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
      failures.push('Missing file: ' + item.path);
      continue;
    }
    const bytes = fs.readFileSync(fullPath);
    const digest = crypto.createHash('sha256').update(bytes).digest('hex');
    if (bytes.length !== item.bytes || digest !== item.sha256) failures.push('Changed file: ' + item.path);
  }
  const requestCount = manifest.files.filter(item => item.role === 'generation-request').length;
  if (requestCount !== manifest.generationCallCount) failures.push('Generation-request count mismatch');
  const imageCount = manifest.files.filter(item => item.role === 'adopted-art').length;
  if (imageCount !== manifest.adoptedAssetCount * 2) failures.push('PNG/WebP pair count mismatch');
  return {
    version: manifest.version,
    readOnly: true,
    filesChecked: manifest.files.length,
    adoptedAssetCount: manifest.adoptedAssetCount,
    generationCallCount: requestCount,
    passed: failures.length === 0,
    failures
  };
}

if (require.main === module) {
  const result = verify();
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  if (!result.passed) process.exitCode = 1;
}

module.exports = { manifest, verify };

