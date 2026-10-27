'use strict';

// Frozen art/evidence manifest. Running this file only reads files and never updates hashes.
// Paths resolve from this repository; receipt source paths are historical evidence only.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const manifest = {
  "version": "modules-v2-art-2026-10-24",
  "frozenAt": "2026-10-24",
  "scope": "Nine adopted image assets as eighteen native PNG/encoded WebP files, plus six generation request/receipt JSON files. Excludes runtime, styles, layout coordinates, screenshots, editable documentation, helper scripts, duplicate individual request JSON files, v1 assets and historical absolute source paths embedded in receipts.",
  "adoptedAssetCount": 9,
  "evidenceFileCount": 6,
  "files": [
    {
      "path": "assets/course-journey/modules-v2/unit1-2-ground.png",
      "role": "adopted-art",
      "bytes": 1866994,
      "sha256": "3db9aa001f06398651f23e31794c0d3a6d71fddec9f2afa9db230c018bd823f7"
    },
    {
      "path": "assets/course-journey/modules-v2/unit1-2-ground.webp",
      "role": "adopted-art",
      "bytes": 193316,
      "sha256": "36b12aa8b829af29ffd980cb5811a30c834fba1d231ac963ae200b6ce50f118b"
    },
    {
      "path": "assets/course-journey/modules-v2/unit3-4-ground.png",
      "role": "adopted-art",
      "bytes": 1787609,
      "sha256": "add91b48c872c3993836499f88551ff1065dcdd5cfd36da5e31ebced989676e9"
    },
    {
      "path": "assets/course-journey/modules-v2/unit3-4-ground.webp",
      "role": "adopted-art",
      "bytes": 157708,
      "sha256": "f6f2a9017022296fa93b175947b41e19e065f04ca70ca6ab6f2738fffad89cd7"
    },
    {
      "path": "assets/course-journey/modules-v2/unit5-6-ground.png",
      "role": "adopted-art",
      "bytes": 1973773,
      "sha256": "9d9a106b0dbba93ff028951352730c19f1bca519a1393a8675823925d5fce627"
    },
    {
      "path": "assets/course-journey/modules-v2/unit5-6-ground.webp",
      "role": "adopted-art",
      "bytes": 198880,
      "sha256": "e1a077fdc40e211b9f1f4198a0901eb2231a4df5f60fd7c57217200e293f6cd2"
    },
    {
      "path": "assets/course-journey/modules-v2/unit7-8-ground.png",
      "role": "adopted-art",
      "bytes": 2024319,
      "sha256": "41633c830dc1323a1639cf5ec7eabcbb702d1b1986fedae67f8caec227f62e7c"
    },
    {
      "path": "assets/course-journey/modules-v2/unit7-8-ground.webp",
      "role": "adopted-art",
      "bytes": 221388,
      "sha256": "0d83c9bf285f53462a6d9fe542c4d3815922ddc646440e5aec395fa531d1f30c"
    },
    {
      "path": "assets/course-journey/modules-v2/unit9-10-ground.png",
      "role": "adopted-art",
      "bytes": 1921360,
      "sha256": "3e07865ea9cca372b46b8f6979289451000b75497c99692ff9e08070cc4a4276"
    },
    {
      "path": "assets/course-journey/modules-v2/unit9-10-ground.webp",
      "role": "adopted-art",
      "bytes": 196108,
      "sha256": "eeddb9db3e1bbb7e9abc6a58fe784ea34887ee21a7ad749ac6450fc28acd48bd"
    },
    {
      "path": "assets/course-journey/modules-v2/unit11-12-ground.png",
      "role": "adopted-art",
      "bytes": 1838645,
      "sha256": "b6afc2762d14023084aed144ec57035afb4ba03a1368666924094732ac4b5d33"
    },
    {
      "path": "assets/course-journey/modules-v2/unit11-12-ground.webp",
      "role": "adopted-art",
      "bytes": 178580,
      "sha256": "2a2445f667a47c00e1457209990c527d089cfff38a5e47c0ac3da6f9504425c8"
    },
    {
      "path": "assets/course-journey/modules-v2/garden-route-v2.png",
      "role": "adopted-art",
      "bytes": 2568406,
      "sha256": "37f18dc74280b9bb21e29d5af88dd3256956032628371245aefa63cbb054ea8f"
    },
    {
      "path": "assets/course-journey/modules-v2/garden-route-v2.webp",
      "role": "adopted-art",
      "bytes": 346798,
      "sha256": "392664005f146a797fb24b7d7f94bbfe70dd76456a6b268d4977c1f1c88d67c3"
    },
    {
      "path": "assets/course-journey/modules-v2/stone-link-v2.png",
      "role": "adopted-art",
      "bytes": 1652568,
      "sha256": "e5402d66182e2fdbb58084ab1cbf19a282001cf51f8ab14e80b36e89db692222"
    },
    {
      "path": "assets/course-journey/modules-v2/stone-link-v2.webp",
      "role": "adopted-art",
      "bytes": 154728,
      "sha256": "9a4f771a83ad9a28670473c06ecd13401bde73edcc5b3c442aef9d541d3bc565"
    },
    {
      "path": "assets/course-journey/modules-v2/garden-route-desktop-v2.png",
      "role": "adopted-art",
      "bytes": 2696859,
      "sha256": "af6f07d722c6143ca59573ff5f51ff8cd1b4337fce94c95b96bb2e651f93a59b"
    },
    {
      "path": "assets/course-journey/modules-v2/garden-route-desktop-v2.webp",
      "role": "adopted-art",
      "bytes": 396992,
      "sha256": "8b730a333297e5392f09a682471ba5f6463b4c404d4aa4e5e799a1f6f7187721"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v2/unit1-4-receipts.json",
      "role": "generation-evidence",
      "bytes": 12871,
      "sha256": "35852e412f14b7eaf1c17846b73edfe83eb859d3e9b176c4634b881b76fccc2a"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v2/unit5-8-receipts.json",
      "role": "generation-evidence",
      "bytes": 13018,
      "sha256": "551fef756e3f2a172b2de6816ee87a01729fd41be12b4244ae43225aa7fdf0b0"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v2/unit9-12-receipts.json",
      "role": "generation-evidence",
      "bytes": 10762,
      "sha256": "1c99af47c87d144deecc4aa04b3460ed5855a902159ca91cc807df4d99c508f2"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v2/environment-requests.json",
      "role": "generation-evidence",
      "bytes": 4585,
      "sha256": "123d429437d3f2ba1c28772e8a40a743f41fdf2f3f9c5fc72a1c8b51d3c261c7"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v2/environment-receipts.json",
      "role": "generation-evidence",
      "bytes": 6367,
      "sha256": "0400f45f015e6298812a8e2079adf49497efaaaa3283438c8ce8f68aad13db31"
    },
    {
      "path": "docs/designs/course-journey/production/modules-v2/desktop-environment-receipt.json",
      "role": "generation-evidence",
      "bytes": 6247,
      "sha256": "20c99b7b159a2008daf6796955d9bee7b766865e3d44cb7cbee59a59127aafbb"
    }
  ]
};

function verify(root = path.resolve(__dirname, '../../../../..')) {
  const failures = [];
  const checkedPaths = new Set();
  let filesMatched = 0;
  for (const item of manifest.files) {
    if (checkedPaths.has(item.path)) failures.push('Duplicate manifest path: ' + item.path);
    checkedPaths.add(item.path);
    const fullPath = path.resolve(root, item.path);
    const relative = path.relative(root, fullPath);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
      failures.push('Manifest path escapes repository: ' + item.path);
      continue;
    }
    try {
      if (!fs.statSync(fullPath).isFile()) {
        failures.push('Not a regular file: ' + item.path);
        continue;
      }
      const data = fs.readFileSync(fullPath);
      const digest = crypto.createHash('sha256').update(data).digest('hex');
      if (data.length !== item.bytes || digest !== item.sha256) failures.push('Changed file: ' + item.path);
      else filesMatched += 1;
    } catch (error) {
      failures.push('Cannot read file: ' + item.path + ' (' + error.code + ')');
    }
  }
  const artFiles = manifest.files.filter(item => item.role === 'adopted-art');
  const evidenceFiles = manifest.files.filter(item => item.role === 'generation-evidence');
  const stems = new Set(artFiles.map(item => item.path.replace(/\.(png|webp)$/, '')));
  if (manifest.files.length !== 24 || checkedPaths.size !== 24) failures.push('Expected exactly 24 unique frozen files');
  if (artFiles.length !== manifest.adoptedAssetCount * 2 || stems.size !== manifest.adoptedAssetCount) failures.push('Expected nine PNG/WebP asset pairs');
  for (const stem of stems) {
    if (!checkedPaths.has(stem + '.png') || !checkedPaths.has(stem + '.webp')) failures.push('Missing PNG/WebP pair: ' + stem);
  }
  if (evidenceFiles.length !== manifest.evidenceFileCount) failures.push('Expected six generation evidence JSON files');
  return {
    version: manifest.version,
    readOnly: true,
    filesChecked: manifest.files.length,
    filesMatched,
    adoptedAssetCount: manifest.adoptedAssetCount,
    artFileCount: artFiles.length,
    evidenceFileCount: evidenceFiles.length,
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
