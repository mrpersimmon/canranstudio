'use strict';
// Frozen read-only source verification; no update-baseline or generation mode.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
if(process.argv.length!==2)throw Error('Read-only verification takes no arguments');
const root=path.resolve(__dirname,'../../../../..');
const expected=[
  {
    "file": "assets/course-journey/modules-v7/seasons-market-v1.png",
    "bytes": 3030874,
    "sha256": "eb4cd3edc27218cd1fc23290ff7dbf7a96eeb6c83f6f52419272bbd69fc52f18"
  },
  {
    "file": "assets/course-journey/modules-v7/everyday-evening-v1.png",
    "bytes": 3031131,
    "sha256": "d02b6fc3b41486c3f08e5ceb50ed8bd1c1d316629c1ce52aff4577a79e34310b"
  },
  {
    "file": "assets/course-journey/modules-v7/everyday-evening-v1.webp",
    "bytes": 514006,
    "sha256": "de48a214409beb4658d2c6c8e285126c01fbcef09dcdeb0cb1367cd1376fe795"
  },
  {
    "file": "assets/course-journey/modules-v7/caring-veranda-v1.png",
    "bytes": 3184385,
    "sha256": "496b3a127e79fa317f84dfd9a9b9cbfa50c3a983cba9249bf4ce7f1bd198aff7"
  },
  {
    "file": "assets/course-journey/modules-v7/memories-arcade-v1.png",
    "bytes": 2968665,
    "sha256": "b268e33844f6ba46275b8f540a02142c1881bfe15282173a8a5597a48c3e8c8a"
  },
  {
    "file": "assets/course-journey/modules-v7/memories-arcade-v1.webp",
    "bytes": 501150,
    "sha256": "c71cc2910573884d4959b86c3ac3a7cec85a6f5b6147dfc11be8b08be8acaf04"
  },
  {
    "file": "assets/course-journey/modules-v7/appointments-street-v1.png",
    "bytes": 3055620,
    "sha256": "369f4bbeef1dffb5eca1acf27e6c5bbcc9cc1505a7c6c0a0612e9f239df64a34"
  },
  {
    "file": "assets/course-journey/modules-v7/preparations-home-v1.png",
    "bytes": 2716611,
    "sha256": "d4e9639680700b2aa33b0089085bd76b8cc62d69c2c2cd66e034616bb4ad7507"
  },
  {
    "file": "assets/course-journey/modules-v7/decisions-block-v1.png",
    "bytes": 3115148,
    "sha256": "0a9c8247bbb1b58c84d2a295c4b1c6d43972f4f9730173eb568f6b565f40b50a"
  },
  {
    "file": "assets/course-journey/modules-v7/decisions-block-v1.webp",
    "bytes": 525498,
    "sha256": "d2cf36bcf21620265998ea9edfec7aec517482d422f391e8e14e5cdf2e49846e"
  },
  {
    "file": "assets/course-journey/modules-v7/departures-promenade-v1.png",
    "bytes": 2992382,
    "sha256": "2cee0bdcf14a7065239cb75ba4cddfdc381a1e71dc0fb68b5fd00d447b0dff01"
  },
  {
    "file": "assets/course-journey/modules-v7/departures-promenade-v1.webp",
    "bytes": 507412,
    "sha256": "e46ed03d3c4d20da0aa8d73e144ded28e37b487d5557ff7c6ce93fa8d5f3029b"
  },
  {
    "file": "assets/course-journey/modules-v7/messages-courtyard-v1.png",
    "bytes": 3021638,
    "sha256": "34847f019c7a10ef77b3bd7c5ca04eecdb353bd022e4914400e6343e0c964ec0"
  },
  {
    "file": "assets/course-journey/modules-v7/messages-courtyard-v1.webp",
    "bytes": 519450,
    "sha256": "ba3b6d169fa8a1315be0e64945e083f3dac0fe00851e96224ba70c469d354c00"
  },
  {
    "file": "assets/course-journey/modules-v7/learning-atrium-v1.png",
    "bytes": 2989391,
    "sha256": "af33c886a03cd913fe946bc73791c547b0e6e9a8dbf5ac6685650e52863ee41d"
  },
  {
    "file": "assets/course-journey/modules-v7/learning-atrium-v1.webp",
    "bytes": 512104,
    "sha256": "9b5a5651656fbf6e9c690e62ed9289937f1cd4b8743f74aa3e0ccc9f7f611a61"
  },
  {
    "file": "assets/course-journey/modules-v7/choices-transit-v1.png",
    "bytes": 2921187,
    "sha256": "dc1b876d7d00ab0599b655bcc8696980b7ad208422d6ce0bfa10e088da30c843"
  },
  {
    "file": "assets/course-journey/modules-v7/surprises-house-v1.png",
    "bytes": 3001338,
    "sha256": "5eec0f3bf591a74419a7be0415c71ea5c818738cdb4ed8cae513c38b41ae3357"
  },
  {
    "file": "assets/course-journey/modules-v7/stories-rain-gallery-v1.png",
    "bytes": 2873181,
    "sha256": "2091118b26c41c332c3281fe0408ac9856db4fbcd71b82807b49ec8cd81f4244"
  },
  {
    "file": "assets/course-journey/modules-v7/stories-rain-gallery-v1.webp",
    "bytes": 447820,
    "sha256": "3dcc470aecd7402361c7f2989e269f833c6c75e9a4012ac291b765e3a0aa0de8"
  },
  {
    "file": "assets/course-journey/modules-v7/possibilities-plane-trees-v1.png",
    "bytes": 3070032,
    "sha256": "7cd6ce8fc05b9a1d934a27104b088313b67e09aad1fe38bfcfd06ffbea937595"
  },
  {
    "file": "assets/course-journey/modules-v7/possibilities-plane-trees-v1.webp",
    "bytes": 546622,
    "sha256": "5ab533ee27315749f7769c96cf149a376d15da727a9877cce704ba648a8904e0"
  },
  {
    "file": "assets/course-journey/modules-v7/news-terraces-v1.png",
    "bytes": 2935012,
    "sha256": "6520a0726e12e15c748832930e8e0bdc80dd169621a7cf4d2c36cc0d5db97306"
  },
  {
    "file": "assets/course-journey/modules-v7/news-terraces-v1.webp",
    "bytes": 484392,
    "sha256": "01e3ee25a05f36ffcacc3e4b96e9a8a5e187f605fdba3c5f99028f08f782cde2"
  },
  {
    "file": "assets/course-journey/modules-v7/woodland-station-v1.png",
    "bytes": 2969902,
    "sha256": "5c4fe78ff6a318a851c5ef3be3289e989e2eef8b99714f42fe7bb673b604ca71"
  },
  {
    "file": "assets/course-journey/modules-v7/woodland-station-v1.webp",
    "bytes": 503504,
    "sha256": "b177c5fb50cc9502244a35d04f136f1563051eaf2cb257d22427cbd840ce5b43"
  },
  {
    "file": "assets/course-journey/modules-v7/seasons-market-v2.png",
    "bytes": 2949862,
    "sha256": "afc834b3531069640906673f6902d964d64f239fbc9ff56a040842ee2f2e043a"
  },
  {
    "file": "assets/course-journey/modules-v7/seasons-market-v2.webp",
    "bytes": 501112,
    "sha256": "2f2fbf89f0ce0bc7de3fb54ce4badcdd8c4f21fb1313409bdf2ce27dfd88ec89"
  },
  {
    "file": "assets/course-journey/modules-v7/appointments-street-v2.png",
    "bytes": 2986914,
    "sha256": "f19573ae21ec1ea30843f3e75928b92d32514cc76801d0a67bffd6182a9324b9"
  },
  {
    "file": "assets/course-journey/modules-v7/appointments-street-v2.webp",
    "bytes": 495808,
    "sha256": "caf4036ee4af6439092ae32daeec3ad2a406d8b30771e255d717fdd6cedbe8f6"
  },
  {
    "file": "assets/course-journey/modules-v7/preparations-home-v2.png",
    "bytes": 2647609,
    "sha256": "d3a529101d2a505662ca5cdbb5a31942900a74db8cf225a5ff8024dff88eec18"
  },
  {
    "file": "assets/course-journey/modules-v7/preparations-home-v2.webp",
    "bytes": 368760,
    "sha256": "f1d34dbea1c2c346fa84d95eca9ab5c8e40db12af5e709480c13edab3745bbb0"
  },
  {
    "file": "assets/course-journey/modules-v7/caring-veranda-v2.png",
    "bytes": 3066560,
    "sha256": "2364caa2b576fe81dfc19e48ddc4c81399ad57e569fb91c30af9f5f031869993"
  },
  {
    "file": "assets/course-journey/modules-v7/caring-veranda-v2.webp",
    "bytes": 533628,
    "sha256": "039bafb975f3ccdc7aa8ac839390e308cba21a48aa4f86db887a58e989267da8"
  },
  {
    "file": "assets/course-journey/modules-v7/departures-promenade-v2.png",
    "bytes": 2838911,
    "sha256": "1079184717917d897645dda6804f53df07364ae54054f7d014e33dfe886b8789"
  },
  {
    "file": "assets/course-journey/modules-v7/departures-promenade-v2.webp",
    "bytes": 463632,
    "sha256": "c09197b92c6317e206d47e51b2ba6d2a9bd5b29d229eb645c620c24f8bfd72a6"
  },
  {
    "file": "assets/course-journey/modules-v7/choices-transit-v2.png",
    "bytes": 2820540,
    "sha256": "27044f517f885c9460dceb949a8736069fb3ff3b3145d323a267227663cd4032"
  },
  {
    "file": "assets/course-journey/modules-v7/choices-transit-v2.webp",
    "bytes": 458746,
    "sha256": "6adbbb74b9b77b321a508925aa0f6599814daf7e175450d564e954b9345bcbf7"
  },
  {
    "file": "assets/course-journey/modules-v7/surprises-house-v2.png",
    "bytes": 2950469,
    "sha256": "bfd4b0735bfc7ee12fe70359980b9ca42a3f56ccd294686a7bfb520ecd1f6616"
  },
  {
    "file": "assets/course-journey/modules-v7/surprises-house-v2.webp",
    "bytes": 512410,
    "sha256": "ffe838888fc8be483d63cfd6f311081c2a6ea8301b21606ccaf3eda8de27358c"
  },
  {
    "file": "assets/course-journey/modules-v7/departures-promenade-v3.png",
    "bytes": 2788997,
    "sha256": "d47b8e63b78c5ce6eb33d75157c1ea730d8f889490c7011e0ae6bc97d806cbd1"
  },
  {
    "file": "assets/course-journey/modules-v7/choices-transit-v3.png",
    "bytes": 2788364,
    "sha256": "ddb559d1b74948a9dd8b78aa394d485816f9e56d0d49090298f62f4c692b3f46"
  },
  {
    "file": "assets/course-journey/modules-v7/choices-transit-v3.webp",
    "bytes": 455230,
    "sha256": "1c54e5ad9aa397a05a4eef3aa2d35732cbf6cb0a80a0604d2f6eca110a6808ed"
  },
  {
    "file": "assets/course-journey/modules-v7/departures-promenade-v4.png",
    "bytes": 2803344,
    "sha256": "9af32760436da4435d9afb7ec41dc0510804e92db10d6eb46bb40da02b48ec34"
  },
  {
    "file": "assets/course-journey/modules-v7/woodland-station-v2.png",
    "bytes": 2796033,
    "sha256": "63628eb1a9f2353cced9d86eab2cb9492b12c73055e56558a42487e32f460e2f"
  },
  {
    "file": "assets/course-journey/modules-v7/woodland-station-v2.webp",
    "bytes": 451832,
    "sha256": "e41023b1c6161b47620e3236c34bc40dd8647b76c5e323b327a3fc3a44846eb6"
  },
  {
    "file": "assets/course-journey/modules-v7/everyday-evening-v2.png",
    "bytes": 2919010,
    "sha256": "ba6e19c21a9daf5ef236385fdc76a810bb49f4097167e0478a91c822e20a0f4a"
  },
  {
    "file": "assets/course-journey/modules-v7/everyday-evening-v2.webp",
    "bytes": 479278,
    "sha256": "d1fd46c9422fe3e0209a5408d408ed3081730933e197e70d2e75c723fc24abdf"
  },
  {
    "file": "assets/course-journey/modules-v7/preparations-home-v3.png",
    "bytes": 2576907,
    "sha256": "b2b2f9456f83d6e7d69a32cf0e7366592ea5432bec543746cbec4d2081e800bd"
  },
  {
    "file": "assets/course-journey/modules-v7/preparations-home-v3.webp",
    "bytes": 355918,
    "sha256": "c3892d4b9cbbbe221b458d6339153b77e30845a5f0b94ae1e99f7e8476f50030"
  },
  {
    "file": "assets/course-journey/unit49-50-landmark-v1.webp",
    "bytes": 212858,
    "sha256": "bedc2064d602997488da7391ad8389302e82db975e771f160e061173ba694a6e"
  },
  {
    "file": "assets/course-journey/unit51-52-landmark-v1.webp",
    "bytes": 228814,
    "sha256": "355ab4939956325776c7612f2d9313353d6588bf44095666305ead46daa0ba61"
  },
  {
    "file": "assets/course-journey/unit53-54-landmark-v1.webp",
    "bytes": 240612,
    "sha256": "92847a32e18793d050534b3cc335103bd1d9f88f65415745ec0e32276f257168"
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
    "file": "assets/course-journey/unit73-74-landmark-v1.webp",
    "bytes": 202802,
    "sha256": "eb96fc4fb13b8fb9fcf8c413487aca079f802f320eb8ab7e0455714ae7a8a030"
  },
  {
    "file": "assets/course-journey/unit75-76-landmark-v1.webp",
    "bytes": 191660,
    "sha256": "7f975ba90c4534fd2eff4f89fdea79b88bc643eed8071161138cc3d38590ceb9"
  },
  {
    "file": "assets/course-journey/unit77-78-landmark-v1.webp",
    "bytes": 211774,
    "sha256": "8d7fbfa17116d3f1102dad84ebd489f40b74ba2047185a5e628036fcf9f21cf6"
  },
  {
    "file": "assets/course-journey/unit79-80-landmark-v1.webp",
    "bytes": 186520,
    "sha256": "17d801590c9bfc2c79f70b3ebf6187d84f6f6ff81fb0e22a0e6f9c00b8ed77a6"
  },
  {
    "file": "assets/course-journey/unit81-82-landmark-v2.webp",
    "bytes": 221080,
    "sha256": "0e614ee1bd78e348609f2fbc4e1bc871f8a5a0b67bba5ab3c65ee0d0196dfae3"
  },
  {
    "file": "assets/course-journey/unit83-84-landmark-v1.webp",
    "bytes": 244320,
    "sha256": "e496e7c470aa58db336065d4dd2e22b518038b484e2811db6013cd8f144df227"
  },
  {
    "file": "assets/course-journey/unit85-86-landmark-v1.webp",
    "bytes": 196764,
    "sha256": "5c08469fe31e13f4616994b862bcfe1f513c46bbec1fb129f763dd599a781345"
  },
  {
    "file": "assets/course-journey/unit87-88-landmark-v1.webp",
    "bytes": 209820,
    "sha256": "a93cede055b9904c115852500dd3b0ddb305f4df3827dfd5f2c9fe8056425e31"
  },
  {
    "file": "assets/course-journey/unit89-90-landmark-v2.webp",
    "bytes": 166274,
    "sha256": "64b978d1fefd57d6e0035cc0828b49e747248b40c5386d9f60a02453b561f597"
  },
  {
    "file": "assets/course-journey/unit91-92-landmark-v1.webp",
    "bytes": 232284,
    "sha256": "d2c699bc6ed471663abbf2dcff7982e07821abc7d1d1581de6d4d2f9179615c9"
  },
  {
    "file": "assets/course-journey/unit93-94-landmark-v1.webp",
    "bytes": 162160,
    "sha256": "eb755d4f0bbb645cdf1bd6b274321916c046e97b843db70df010f68282efa747"
  },
  {
    "file": "assets/course-journey/unit95-96-landmark-v1.webp",
    "bytes": 254944,
    "sha256": "38520dc2f5288fd58ebf95dcf3b01bb3f510df77273648c40b3c7b3a0c374a89"
  },
  {
    "file": "assets/course-journey/unit97-98-landmark-v1.webp",
    "bytes": 197354,
    "sha256": "79220a83d0542721867f02adf4f0222cb8b2087806675e7f5153289c3374eb75"
  },
  {
    "file": "assets/course-journey/unit99-100-landmark-v1.webp",
    "bytes": 201214,
    "sha256": "11c20622db41223fd5b4d056ca53ba756944e4774358bc7e408ebc8d07dab993"
  },
  {
    "file": "assets/course-journey/unit101-102-landmark-v1.webp",
    "bytes": 218080,
    "sha256": "a0e36e4025cf02b307153f2aecc53390afd5d30d41aa769451a932729e6be2f5"
  },
  {
    "file": "assets/course-journey/unit103-104-landmark-v1.webp",
    "bytes": 207488,
    "sha256": "27cbb4d70503303b6570a4bd4e597e584cf27ac597f3dab57699e1156ed4d1c8"
  },
  {
    "file": "assets/course-journey/unit105-106-landmark-v2.webp",
    "bytes": 193498,
    "sha256": "a87d36f75d485712c22a5edc3d9b1079553552840af596e4cc7579cdd5de5e4e"
  },
  {
    "file": "assets/course-journey/unit107-108-landmark-v1.webp",
    "bytes": 220494,
    "sha256": "417157e8d03311e7d92480e04c3c581a12dd35b23fa615c6a424d510facac2ba"
  },
  {
    "file": "assets/course-journey/unit109-110-landmark-v1.webp",
    "bytes": 220632,
    "sha256": "4cbcf1935297416bec77add98bf122899c79d91b992750ff9e9c36e11385ab75"
  },
  {
    "file": "assets/course-journey/unit111-112-landmark-v2.webp",
    "bytes": 225088,
    "sha256": "0a529c1c1e3b5281ae64a9b1dfc5c5d0164a7ddabb871e744f1a12d5d91ebf63"
  },
  {
    "file": "assets/course-journey/unit113-114-landmark-v1.webp",
    "bytes": 239284,
    "sha256": "a00ab28f0afc90ebab7483ea301ea80d3b46f844ce0603ca1285c2261ea9af57"
  },
  {
    "file": "assets/course-journey/unit115-116-landmark-v1.webp",
    "bytes": 222564,
    "sha256": "cf8c6521ba28af0d025622633f6aa6448938b70569a6dba7466d418fad7a9e5e"
  },
  {
    "file": "assets/course-journey/unit117-118-landmark-v1.webp",
    "bytes": 243080,
    "sha256": "03fad65fd51a95f7ec17552682b1769fb18fa4852d0690618d0a9454ec875884"
  },
  {
    "file": "assets/course-journey/unit119-120-landmark-v1.webp",
    "bytes": 178456,
    "sha256": "8647ce03452fec7594083239df72d9831fe7e32b258b711f5ecdad3fbffa4f49"
  },
  {
    "file": "assets/course-journey/unit121-122-landmark-v1.webp",
    "bytes": 218174,
    "sha256": "a3b0de65a7ab95cd03506fd148ab0c1f89f4a0a3133305f2905446c791a5da38"
  },
  {
    "file": "assets/course-journey/unit123-124-landmark-v1.webp",
    "bytes": 223926,
    "sha256": "946b60d2c8d881db4bb77bf3cd60e2622cd37ac667bd7bb4907920f1de8e9f2d"
  },
  {
    "file": "assets/course-journey/unit125-126-landmark-v1.webp",
    "bytes": 232106,
    "sha256": "d8d864bf924e25078675ab58f6faec79ebdc80de578ffd49ea3b7c2443736996"
  },
  {
    "file": "assets/course-journey/unit127-128-landmark-v1.webp",
    "bytes": 233938,
    "sha256": "c5803ef988c1284e7b80bb72eac106484de74da76f7d04a038047393f23f2e7a"
  },
  {
    "file": "assets/course-journey/unit129-130-landmark-v1.webp",
    "bytes": 241742,
    "sha256": "3ed63f7fc91afed1718ab82fa9277cd3950e1c8718177776d3f4c2df9ef2a39a"
  },
  {
    "file": "assets/course-journey/unit131-132-landmark-v1.webp",
    "bytes": 222360,
    "sha256": "7e2be8c261907a9d4c7f3d5bebf0beff977fac92c54b1266ae19e779b63bba57"
  },
  {
    "file": "assets/course-journey/unit133-134-landmark-v1.webp",
    "bytes": 187444,
    "sha256": "99fcd2c28258e250fe98ad563835b1a956137823b553ad6757bb64b21249c4a4"
  },
  {
    "file": "assets/course-journey/unit135-136-landmark-v1.webp",
    "bytes": 223408,
    "sha256": "5510f3e976d40355a46434e37d3da7477ab075e07f7419f430d11cde882dd301"
  },
  {
    "file": "assets/course-journey/unit137-138-landmark-v1.webp",
    "bytes": 224402,
    "sha256": "202347d24399a713891906396297c066909e7f15c1541444d94dd2ab05edcd54"
  },
  {
    "file": "assets/course-journey/unit139-140-landmark-v1.webp",
    "bytes": 219200,
    "sha256": "e6846b6940d5c5aeb43fc373823083e595bc1d00e9d8735510caa3569a06d453"
  },
  {
    "file": "assets/course-journey/unit141-142-landmark-v2.webp",
    "bytes": 218706,
    "sha256": "490d546d4c23cccbf01f9a29915fd989259a751562fc253cef1c0a45574a48d6"
  },
  {
    "file": "assets/course-journey/unit143-144-landmark-v1.webp",
    "bytes": 272452,
    "sha256": "ff4802663163377b6e10da96928711f92d51d913d5b5d1bb5daf586c4c8f0a08"
  },
  {
    "file": "assets/course-journey/modules-v6/making-workshop-v2.png",
    "bytes": 2769636,
    "sha256": "4ce394e2ef56fc027d5636f2020268ab5e29d64f1240bc6dd90a29a593bdaa37"
  },
  {
    "file": "assets/course-journey/modules-v6/hospitality-sunroom-v2.png",
    "bytes": 2808924,
    "sha256": "fdb9cb92c870788ae8ddb74740fad2d22ede174c7debe2a4278ecdd690309b53"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/composite-review-revisions.json",
    "bytes": 2675,
    "sha256": "12e06e00e716768e4d32f2b1f8135d5f925a8d5da9fb69f92f419912909dcd5d"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/contact-calibration.json",
    "bytes": 89040,
    "sha256": "fe7115c40631b3b107f30ac7b528d59e4e76d305a17b19aa653708dc68e28368"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/departures-canvas-revision.json",
    "bytes": 1420,
    "sha256": "6edabdb334c4bc85f5caf15e3be01ffee3aab27de2108e3d697f7d96a160b252"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/executed-requests.json",
    "bytes": 81811,
    "sha256": "ac3f4f43a15b8d8f83317dd5a7a6b4ed1f51dd03e4f487795b4680f0bbe058c6"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/generated-canvas-revision-job.json",
    "bytes": 303,
    "sha256": "171443d0269228f388f7619c225f4441752dbd2d7fe17f4ab877e504f87f19c2"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/generated-composite-revision-jobs.json",
    "bytes": 596,
    "sha256": "8c0fbd0ef179dc73e210d6b3850f3a7a5dd35ccad4980224e5a90c6eb2090d3d"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/generated-jobs.json",
    "bytes": 4482,
    "sha256": "f0f20af88c9f30442f103d6bab467013dcf0f73dde4117508b82f2ef0e934e87"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/generated-last-revision-jobs.json",
    "bytes": 575,
    "sha256": "e377939f655020610ffe319090c5ce0e122dc3cd6dca9e44eb5a8af7186a9e0f"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/generated-revision-jobs.json",
    "bytes": 2000,
    "sha256": "abe60dc6dd864e557f8adf740babbf5cba326652e8cdcbf069b4086e63b77457"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/generated-woodland-revision-job.json",
    "bytes": 297,
    "sha256": "458d3d6cff2bebbf69c1d745e197acb52ca3a062b45d3aa0d37bac3cda85792f"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/generation-receipts.json",
    "bytes": 33083,
    "sha256": "bf8caa2abbf803deefd1302f0208ec262c63c9b65bbfa2a85741db20066b1eed"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/placement.json",
    "bytes": 52718,
    "sha256": "2e39728b0eb92e368f23484f442d7f3b32ea38cb74ea449777da56401b33c788"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/prior-support-reference.json",
    "bytes": 2001,
    "sha256": "973a7b446257ed4f09ca628774f268052f985e2d4bc81a1a4d89b3538e973d66"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/reference-inputs.json",
    "bytes": 6699,
    "sha256": "4da011530ee770426a90fb3e11168b851f3802ae18c026c7fe6c10c97b3788e8"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/requests-final-four.json",
    "bytes": 21131,
    "sha256": "278657dfc814959c8957905bab258124bab63c6f455e8598f9a5ee85e1aaea68"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/requests.json",
    "bytes": 70348,
    "sha256": "ca0d99d6a30faa60755a5ba093bd5ab98b0d763d0073096311504a4b4726216d"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/revisions-round1.json",
    "bytes": 10310,
    "sha256": "29c0fbf3d5b68bfb5c9215da3f2ff081a54917cf510652bb9e6e7e9f764b7b64"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/revisions-round2.json",
    "bytes": 2169,
    "sha256": "43035f6bbb33aaa599ed904bd1cfe7e01fede530d08e27997e4a5e331dabea88"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/story-plan.json",
    "bytes": 38024,
    "sha256": "fb9495e86a3506ed529fb8fc3bc81050c58d6848273ce8b4b1c5f6f2a4879293"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/support-rois.json",
    "bytes": 23733,
    "sha256": "58b336b2ab8e86d798c75f4b0e4112680541976717d9edbd24ab56aba4f0ad33"
  },
  {
    "file": "docs/designs/course-journey/production/modules-v7/woodland-interior-revision.json",
    "bytes": 1943,
    "sha256": "54ec667457e4e7e5c98726078f35c8678979113e4669a6424f4e0394d58926be"
  },
  {
    "file": "docs/designs/course-journey/production/complete-journey-v1/story-briefs.json",
    "bytes": 260334,
    "sha256": "675f4493d6acefcb196318ce253403bb66f6076888579555656df37d4e006077"
  },
  {
    "file": "docs/designs/course-journey/production/complete-journey-v1/selected-variants.json",
    "bytes": 400,
    "sha256": "6f6f72636b6392fcd00d00d1a14149e34fa02b751249a3b57b6beae5444768aa"
  }
];
for(const r of expected){const b=fs.readFileSync(path.join(root,r.file));if(b.length!==r.bytes||crypto.createHash('sha256').update(b).digest('hex')!==r.sha256)throw Error('Frozen source changed: '+r.file);}
console.log(JSON.stringify({readOnly:true,files:expected.length,matched:expected.length,actualGenerationCalls:29,adoptedEnvironments:16}));
