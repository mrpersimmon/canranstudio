'use strict';
// Read-only artwork provenance verification. No generation/update mode.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
if(process.argv.length!==2)throw Error('Read-only verifier takes no arguments');
const root=path.resolve(__dirname,'../../../../..'),expected=[
  {
    "file": "assets/course-journey/modules-v8/opening-mobile-clearance-v1.png",
    "bytes": 2408471,
    "sha256": "38fcb6d8adebf8ee4f0040fe91a3833237e50d1d28dea0ef49c879395b47450d"
  },
  {
    "file": "assets/course-journey/modules-v8/opening-mobile-clearance-v1.webp",
    "bytes": 331874,
    "sha256": "7c7679134bc8bf00a2cd37324f24736b3b926f3f8cac038990c0f532abbff090"
  },
  {
    "file": "assets/course-journey/modules-v8/making-mobile-clearance-v1.png",
    "bytes": 2749215,
    "sha256": "288a9321e3a0aa94e7a27d42657c1a2e24122e0f3abb5d48461c07498b657793"
  },
  {
    "file": "assets/course-journey/modules-v8/making-mobile-clearance-v1.webp",
    "bytes": 435982,
    "sha256": "c999977e08318356e47a4013d0ed4da5f10cc524abcafe9496eb3158226fd5f1"
  },
  {
    "file": "assets/course-journey/modules-v8/everyday-mobile-clearance-v1.png",
    "bytes": 2841257,
    "sha256": "8b222b9c9e6987914b2e168ae36c500f7a3aafad62d89033158bdebf74fcbf59"
  },
  {
    "file": "assets/course-journey/modules-v8/everyday-mobile-clearance-v1.webp",
    "bytes": 456306,
    "sha256": "f0499a9eea1b95784054c8904299b0936d57da06c3c9826f00a39edc7ee7537d"
  },
  {
    "file": "assets/course-journey/modules-v8/kindness-mobile-clearance-v1.png",
    "bytes": 2655419,
    "sha256": "77a7a076ae88b7c361bb2caa52b4d63c76ceb07eec3f9e9c7b693fd11bbbc4eb"
  },
  {
    "file": "assets/course-journey/modules-v8/kindness-mobile-clearance-v1.webp",
    "bytes": 429656,
    "sha256": "38b7a802f7b96c1451421e308aaac3118ce1f5ad647af55400a00146e47fda98"
  },
  {
    "file": "assets/course-journey/modules-v8/caring-mobile-clearance-v1.png",
    "bytes": 2968485,
    "sha256": "2c9bade98d2a51d734d3ff7132b1ec8589b4f5f8a914566aa54f5506384abcfd"
  },
  {
    "file": "assets/course-journey/modules-v8/caring-mobile-clearance-v1.webp",
    "bytes": 502720,
    "sha256": "a0e299e3df7e47fffa98b09ab22d9f5ece732c3232bbb9846880f0df4688b392"
  },
  {
    "file": "assets/course-journey/modules-v8/memories-mobile-clearance-v1.png",
    "bytes": 2821586,
    "sha256": "2dd88fd6b0d8d7bc48e6a69fbd9c0db1d3431bba9c71455cf17f4d86366a0a13"
  },
  {
    "file": "assets/course-journey/modules-v8/memories-mobile-clearance-v1.webp",
    "bytes": 461730,
    "sha256": "b6ab9dae1ea09cd6470437ea0e36893195a69033ff4a083946ef1f9535f32790"
  },
  {
    "file": "assets/course-journey/modules-v8/opening-mobile-clearance-v2.png",
    "bytes": 2317864,
    "sha256": "6b8f2d1fad78471992dcc417610587d2c9cee9bb03728457f018d1a7209e921b"
  },
  {
    "file": "assets/course-journey/modules-v8/opening-mobile-clearance-v2.webp",
    "bytes": 309936,
    "sha256": "f8b501b649069ec3f4d96463dafea36c7f839c90dbb859428cc6d7c06a236a4b"
  },
  {
    "file": "assets/course-journey/modules-v3/opening-world-v1.png",
    "bytes": 2463868,
    "sha256": "6fb4e002294e17052cb9d3902427613c75f40e63d04dd21db190d66bdf1b775a"
  },
  {
    "file": "assets/course-journey/modules-v6/making-workshop-v2.png",
    "bytes": 2769636,
    "sha256": "4ce394e2ef56fc027d5636f2020268ab5e29d64f1240bc6dd90a29a593bdaa37"
  },
  {
    "file": "assets/course-journey/modules-v7/everyday-evening-v2.png",
    "bytes": 2919010,
    "sha256": "ba6e19c21a9daf5ef236385fdc76a810bb49f4097167e0478a91c822e20a0f4a"
  },
  {
    "file": "assets/course-journey/modules-v5/kindness-courtyard-v1.png",
    "bytes": 2793131,
    "sha256": "8b0c3768306087a8c34ebd52947a4a5c44aff00bf6e68ef59fc5a186368c9e52"
  },
  {
    "file": "assets/course-journey/modules-v7/caring-veranda-v2.png",
    "bytes": 3066560,
    "sha256": "2364caa2b576fe81dfc19e48ddc4c81399ad57e569fb91c30af9f5f031869993"
  },
  {
    "file": "assets/course-journey/modules-v7/memories-arcade-v1.png",
    "bytes": 2968665,
    "sha256": "b268e33844f6ba46275b8f540a02142c1881bfe15282173a8a5597a48c3e8c8a"
  },
  {
    "file": "docs/designs/course-journey/evidence/2026-10-26-full72-mobile-audit/candidate-1/phone-unit1-2.png",
    "bytes": 59754,
    "sha256": "d082d0b8b28d6f1115ad33710559d318ca26158cfb336969a41e5e43da3ec658"
  },
  {
    "file": "docs/designs/course-journey/evidence/2026-10-26-full72-mobile-audit/candidate-1/phone-unit5-6.png",
    "bytes": 56903,
    "sha256": "a6d636447178eaecc91ece69c961adcc5bcc5f27e7604bdce06ecb9140084c28"
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
    "file": "assets/course-journey/unit55-56-landmark-v2.webp",
    "bytes": 235758,
    "sha256": "08851ab7d5af5dd4da039e97e19e829d50755216fd75157bab33da48f5004508"
  },
  {
    "file": "assets/course-journey/unit57-58-landmark-v1.webp",
    "bytes": 179322,
    "sha256": "d1a43be8e9478baa51f1148019129b84b1e9e46210b1f6e75ddb2a98cb8ab7ba"
  },
  {
    "file": "assets/course-journey/unit59-60-landmark-v2.webp",
    "bytes": 213870,
    "sha256": "f04bdf708e54d90a48d501b1fe9b43429c716c4185a15beb5ca2f6d0051f0c6a"
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
    "file": "assets/course-journey/unit61-62-landmark-v1.webp",
    "bytes": 256920,
    "sha256": "863339bbbf897d8052245b9071ea7b7e40f8fa375379820ff524f0ed0e5a8fdd"
  },
  {
    "file": "assets/course-journey/unit63-64-landmark-v1.webp",
    "bytes": 265784,
    "sha256": "d3fb3f168604fd5eb318f070cd1eb92517a3566bf6724e8e64fc7a4b198acad5"
  },
  {
    "file": "assets/course-journey/unit65-66-landmark-v1.webp",
    "bytes": 224908,
    "sha256": "6e0280ae26d006bdb499c551e6b12fdc00eef0e63ff25e1db2f900c679586edc"
  },
  {
    "file": "assets/course-journey/unit67-68-landmark-v1.webp",
    "bytes": 220224,
    "sha256": "7a5b29de7edf8dfdd4dfc4db2fde7dc6f9af48f06305ecde1ad754acbe0a5836"
  },
  {
    "file": "assets/course-journey/unit69-70-landmark-v1.webp",
    "bytes": 188726,
    "sha256": "3e9ea66589fc36ab2c1a12e8d0407c0800b5049501041f9af72f7cf82f943f34"
  },
  {
    "file": "assets/course-journey/unit71-72-landmark-v1.webp",
    "bytes": 235020,
    "sha256": "9254504a7fd68742bb92bb0ccf204046ed35aeb31dfc61901424841ca55e55b9"
  },
  {
    "file": "assets/course-journey/handbag-couple.webp",
    "bytes": 146522,
    "sha256": "df99ee8abaf3ce1cbbc3c2849c721e2c5302355a7ebf05825092d2a263fa4967"
  },
  {
    "file": "assets/course-journey/umbrella-counter-v1.webp",
    "bytes": 167456,
    "sha256": "c1a9f4d258a4caf9134403a2171924e643e177b792b7f3ff4f12829da8732a92"
  },
  {
    "file": "assets/course-journey/friends-trio-v1.webp",
    "bytes": 175874,
    "sha256": "8c97dedf6894f23a6fad779704be71cae5879ecebae9bc7e80815e5a47c2de59"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v8/executed-requests.json",
    "bytes": 16395,
    "sha256": "0c1053854c683d14fcc9be157e62cfaee0f695b6ba57ea9baa1aad659a2f736e"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v8/generation-receipts.json",
    "bytes": 6729,
    "sha256": "4dc873bca3e5cf332d24e655365fe2339373acd505b5edbc0dcbd19fecb702f8"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v8/opening-second-receipt.json",
    "bytes": 286,
    "sha256": "48a3f65bb8679fd773e64ccef697b3a3ea79950ab6ff0915966a5f0fa039746c"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v8/opening-second-request.json",
    "bytes": 2343,
    "sha256": "49dcf83112f6a9b36933f0bad018300ce9c09c7ec7b44161bc55e9ba1c25cf09"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v8/placement.json",
    "bytes": 19360,
    "sha256": "a0390c6529b74c6bf65e9e2b1e5a5942475a213093cfe9c482f7cf0c6245ad8a"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v8/reference-inputs.json",
    "bytes": 3499,
    "sha256": "ceee74a256dad77dc32b540c53aa7b5eed089f4c7a137283048040b7eedf0654"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v8/requests.json",
    "bytes": 13400,
    "sha256": "1930d1ea4d8e6ba774329ab7da13794d232de55a7caea164256c01a7cc89f193"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v8/review.json",
    "bytes": 706,
    "sha256": "9d6f7f471e5037a34124de81b493424cdfd0c4d961dceb518b633df77c2f9a63"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v8/second-receipts.json",
    "bytes": 859,
    "sha256": "053f98811d2421f530892968f0282cc5bd15f4f7b59478d5f259dd149c594b61"
  }
];
for(const f of expected){const b=fs.readFileSync(path.join(root,f.file));if(b.length!==f.bytes||crypto.createHash('sha256').update(b).digest('hex')!==f.sha256)throw Error('Frozen source changed: '+f.file);}
console.log(JSON.stringify({readOnly:true,files:expected.length,matched:expected.length,actualCalls:7,adoptedEnvironments:6}));
