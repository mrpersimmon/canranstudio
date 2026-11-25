'use strict';
const matrix=require('./required-phone-devices.json');
function viewports(){return matrix.devices.map(({viewport:{width,height}})=>[width,height]);}
function contextOptions(device){
 return {viewport:{...device.viewport},screen:{...device.viewport},deviceScaleFactor:device.deviceScaleFactor,isMobile:true,hasTouch:true,userAgent:matrix.userAgent};
}
module.exports={matrix,devices:matrix.devices,viewports,contextOptions};
