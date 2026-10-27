'use strict';
// Preserve the original asset measurements; current placement refinements
// live here, separately from the frozen production receipts.
const opening=require('./scene-layout');
const dailyLife=require('./daily-life-layout');
const openingInfo={portrait:{x:.54,offsetY:-24,after:'unit5-6'},landscape:{x:.61,offsetY:-40,after:'unit5-6'}};
const characters={...opening.characters,...dailyLife.characters,
  'unit7-8':{file:'interview-couple-v1.webp',width:1254,height:1254,anchor:[.519936,.974482],bounds:[.106858,.074163,.933014,.974482]},
  'unit9-10':{file:'greeting-neighbors-v1.webp',width:1254,height:1254,anchor:[.509171,.850080],bounds:[.187400,.193780,.830941,.850080]},
  'unit11-12':{file:'shirt-return-v1.webp',width:1536,height:1024,anchor:[.51,.927734],bounds:[.172526,.086914,.853516,.927734]},
  'unit13-14':{file:'dress-friends-v1.webp',width:1254,height:1254,anchor:[.51,.917863],bounds:[.089314,.124402,.927432,.917863]},
  'unit15-16':{file:'passport-travelers-v1.webp',width:1536,height:1024,anchor:[.52,.926758],bounds:[.146484,.102539,.904948,.926758]},
  'unit17-18':{file:'office-introduction-v1.webp',width:1536,height:1024,anchor:[.51,.959961],bounds:[.093099,.078125,.923177,.959961]}
};
const chapters={opening:Object.fromEntries(Object.entries(opening.scenes).map(([composition,scene])=>[composition,{...scene,nodes:{...scene.nodes,...(composition==='portrait'?{'unit1-2':{...scene.nodes['unit1-2'],width:.38},'unit5-6':{...scene.nodes['unit5-6'],feet:[.74,.24]}}:{'unit1-2':{...scene.nodes['unit1-2'],width:.24}}),'unit3-4':{...scene.nodes['unit3-4'],...(composition==='portrait'?{feet:[.38,.47],width:.45}:{}),info:openingInfo[composition]}}}])),neighborhood:{
  portrait:{file:'neighborhood-mobile-v1.webp',width:1024,height:1536,nodes:{
    'unit7-8':{feet:[.349,.797],width:.36,stars:[.349,.808],label:[.59,.775]},
    'unit9-10':{feet:[.37,.46],width:.46,stars:[.35,.516],label:[.56,.568],info:{x:.55,offsetY:-20,after:'unit11-12'}},
    'unit11-12':{feet:[.73,.27],width:.49,stars:[.68,.274],label:[.54,.35],info:{x:.57,offsetY:8}}
  }},
  landscape:{file:'neighborhood-desktop-v1.webp',width:1374,height:1145,nodes:{
    'unit7-8':{feet:[.314,.768],width:.23,stars:[.314,.794],label:[.314,.85],center:true},
    'unit9-10':{feet:[.53,.50],width:.295,stars:[.49,.545],label:[.58,.60],info:{x:.55,offsetY:8,center:true,after:'unit11-12'}},
    'unit11-12':{feet:[.765,.32],width:.30,stars:[.75,.336],label:[.67,.39],info:{x:.765,offsetY:12,center:true}}
  }}
},visits:{
  portrait:{file:'visits-mobile-v2.webp',width:1024,height:1536,nodes:{
    'unit13-14':{feet:[.349,.797],width:.40,stars:[.349,.808],label:[.54,.86],info:{x:.54,offsetY:-68,after:'unit15-16'}},
    'unit15-16':{feet:[.35,.46],width:.44,stars:[.35,.49],label:[.54,.568],info:{x:.54,offsetY:-12,after:'unit17-18'}},
    'unit17-18':{feet:[.73,.24],width:.38,stars:[.73,.262],label:[.54,.316],info:{x:.54,offsetY:8}}
  }},
  landscape:{file:'visits-desktop-v1.webp',width:1374,height:1145,nodes:{
    // The label anchor also reserves the map's lower extent when info controls
    // the actual title position. Keep the new shoe clearance inside that extent.
    'unit13-14':{feet:[.314,.768],width:.25,stars:[.314,.794],label:[.314,.86],info:{x:.314,offsetY:4,center:true}},
    'unit15-16':{feet:[.50,.52],width:.34,stars:[.50,.545],label:[.64,.575],info:{x:.64,offsetY:-20,after:'unit17-18'}},
    'unit17-18':{feet:[.75,.31],width:.30,stars:[.75,.336],label:[.67,.375],info:{x:.78,offsetY:8,center:true}}
  }}
},...dailyLife.chapters};
const complete=require('./complete-journey-layout.json');
const {calibrateGround}=require('./ground-contact-layout');
const allCharacters={...characters,...complete.characters};
module.exports={characters:allCharacters,chapters:calibrateGround({...chapters,...complete.chapters},allCharacters)};
