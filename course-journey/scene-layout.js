'use strict';
// Asset coordinates are measured from the final generated images. All layers
// share this artboard; UI labels retain readable sizes when the camera changes.
const characters={
  'unit1-2':{file:'handbag-couple.webp',width:1254,height:1254,anchor:[.5,.92504],bounds:[.1013,.1188,.9147,.92504]},
  'unit3-4':{file:'umbrella-counter-v1.webp',width:1402,height:1122,anchor:[.51,.95633],bounds:[.1505,.0998,.871,.95633]},
  'unit5-6':{file:'friends-trio-v1.webp',width:1536,height:1024,anchor:[.51,.9258],bounds:[.1107,.1494,.9102,.9258]}
};
const scenes={
  portrait:{file:'opening-mobile-v2.webp',width:1024,height:1536,nodes:{
    'unit1-2':{feet:[.349,.797],width:.40,stars:[.349,.808],label:[.59,.775]},
    'unit3-4':{feet:[.38,.492],width:.48,stars:[.38,.516],label:[.56,.568]},
    'unit5-6':{feet:[.71,.24],width:.50,stars:[.71,.262],label:[.60,.316]}
  }},
  landscape:{file:'opening-desktop-v2.webp',width:1374,height:1145,nodes:{
    'unit1-2':{feet:[.314,.768],width:.25,stars:[.314,.794],label:[.314,.85],center:true},
    'unit3-4':{feet:[.49,.52],width:.32,stars:[.49,.545],label:[.58,.575]},
    'unit5-6':{feet:[.75,.31],width:.35,stars:[.75,.336],label:[.67,.375]}
  }}
};
module.exports={characters,scenes};
