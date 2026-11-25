'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {devices,viewports,contextOptions}=require('../support/required-phone-devices');
const journey=require('../support/journey-viewports');
test('required phone presets keep Chrome sizes rather than library names or physical pixels',()=>{
 assert.deepEqual(devices.map(d=>[d.name,d.viewport.width,d.viewport.height,d.deviceScaleFactor]),[
  ['iPhone SE',375,667,2],['iPhone 14 Pro Max',430,932,3],['iPhone 16 Pro Max',440,956,3]
 ]);
 for(const device of devices){const context=contextOptions(device);assert.equal(context.hasTouch,true);assert.equal(context.isMobile,true);assert.deepEqual(context.screen,device.viewport);context.viewport.width=1;assert.notEqual(device.viewport.width,1);}
});
test('required phones cannot disappear from journey smoke or mobile interaction checks',()=>{
 for(const suite of [['map','smoke'],['map','full'],['mobileInteraction','full']]){
  const actual=new Set(journey.viewports(...suite).map(pair=>pair.join('x')));
  for(const size of viewports())assert.ok(actual.has(size.join('x')),suite.join('/')+': '+size);
 }
 assert.ok(journey.viewports('map','smoke').some(([w,h])=>w===320&&h===568));
});
