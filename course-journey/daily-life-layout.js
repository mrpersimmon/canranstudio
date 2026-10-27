'use strict';
// Measured native PNG alpha > 16; full alpha support and generation history are
// retained in production/daily-life-v1. Coordinates belong to these scenes.
const characters={
  'unit19-20':{file:'icecream-family-v1.webp',width:1254,height:1254,anchor:[.519537,.965710],bounds:[.063796,.059809,.975279,.965710]},
  'unit21-22':{file:'red-book-pair-v1.webp',width:1254,height:1254,anchor:[.525120,.952951],bounds:[.098086,.097289,.952153,.952951]},
  'unit23-24':{file:'shelf-glasses-pair-v1.webp',width:1254,height:1254,anchor:[.521132,.951356],bounds:[.082935,.093301,.959330,.951356]},
  'unit25-26':{file:'kitchen-host-v1.webp',width:1254,height:1254,anchor:[.517544,.956140],bounds:[.104466,.047847,.930622,.956140]},
  'unit27-28':{file:'living-room-host-v1.webp',width:1254,height:1254,anchor:[.510766,.956938],bounds:[.062201,.049442,.959330,.956938]},
  'unit29-30':{file:'tidy-room-pair-v1.webp',width:1254,height:1254,anchor:[.520335,.964115],bounds:[.090112,.047847,.950558,.964115]}
};
const chapters={
  kindness:{
    portrait:{file:'kindness-mobile-v1.webp',width:1024,height:1536,nodes:{
      'unit19-20':{feet:[.34,.797],width:.37,stars:[.34,.808],label:[.54,.86],info:{x:.54,offsetY:-68,after:'unit21-22'}},
      'unit21-22':{feet:[.35,.46],width:.36,stars:[.35,.49],label:[.54,.568],info:{x:.54,offsetY:-12,after:'unit23-24'}},
      'unit23-24':{feet:[.73,.24],width:.31,stars:[.73,.262],label:[.54,.316],info:{x:.54,offsetY:8}}
    }},
    landscape:{file:'kindness-desktop-v1.webp',width:1374,height:1145,nodes:{
      'unit19-20':{feet:[.314,.768],width:.24,stars:[.314,.794],label:[.314,.86],info:{x:.314,offsetY:4,center:true}},
      'unit21-22':{feet:[.50,.52],width:.24,stars:[.50,.545],label:[.64,.575],info:{x:.64,offsetY:-20,after:'unit23-24'}},
      'unit23-24':{feet:[.75,.31],width:.22,stars:[.75,.336],label:[.78,.375],info:{x:.78,offsetY:8,center:true}}
    }}
  },
  home:{
    portrait:{file:'home-mobile-v1.webp',width:1024,height:1536,nodes:{
      'unit25-26':{feet:[.34,.797],width:.37,stars:[.34,.808],label:[.54,.86],info:{x:.54,offsetY:-68,after:'unit27-28'}},
      'unit27-28':{feet:[.35,.46],width:.34,stars:[.35,.49],label:[.54,.568],info:{x:.54,offsetY:-12,after:'unit29-30'}},
      'unit29-30':{feet:[.73,.24],width:.30,stars:[.73,.262],label:[.54,.316],info:{x:.54,offsetY:8}}
    }},
    landscape:{file:'home-desktop-v1.webp',width:1374,height:1145,nodes:{
      'unit25-26':{feet:[.314,.768],width:.25,stars:[.314,.794],label:[.314,.86],info:{x:.314,offsetY:4,center:true}},
      'unit27-28':{feet:[.50,.52],width:.23,stars:[.50,.545],label:[.64,.575],info:{x:.64,offsetY:-20,after:'unit29-30'}},
      'unit29-30':{feet:[.75,.31],width:.21,stars:[.75,.336],label:[.78,.375],info:{x:.78,offsetY:8,center:true}}
    }}
  }
};
module.exports={characters,chapters};
