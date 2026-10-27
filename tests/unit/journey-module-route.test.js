'use strict';
// Historical v2 endpoint fitter only; J32 runtime no longer imports it.
// Passing these tests is not evidence that a stretched bridge is acceptable.
const test=require('node:test'),assert=require('node:assert/strict');
const {connectCourtyards,layoutCourtyardLinks}=require('../../course-journey/module-route');
const modules=require('../../course-journey/module-scenes');
const asset=modules.connector;
const stage=(id,left,top,width)=>({id,left,top,width,height:width*2/3,...modules.scenes[id].route});
const close=(actual,expected,label)=>assert.ok(Math.abs(actual-expected)<1e-7,`${label}: ${actual} vs ${expected}`);
// 从绘制结果中的桥锚点反推画面位置，再与庭院的出入口比对。
// 检查的是“锚点必须接上”的几何合同，不复制运行函数求桥尺寸的逆算过程。
function joins(link,previous,next){
  assert.ok(link&&['left','top','width','height'].every(key=>Number.isFinite(link[key])),'桥的绘制框必须存在且有限');
  assert.ok(link.width>0&&link.height>0);
  close(link.left+link.width*asset.from[0],previous.left+previous.width*previous.exit[0],'前课出口 x');
  close(link.top+link.height*asset.from[1],previous.top+previous.height*previous.exit[1],'前课出口 y');
  close(link.left+link.width*asset.to[0],next.left+next.width*next.entry[0],'后课入口 x');
  close(link.top+link.height*asset.to[1],next.top+next.height*next.entry[1],'后课入口 y');
}
test('手机窄屏到大屏的连接桥始终接各自局部庭院，且不修改课程位置',()=>{
  for(const width of [288,328,358,380,414.4,420]){
    const previous=stage('unit1-2',16,28,width),next=stage('unit3-4',16,28+width*2/3+132,width);
    const original=JSON.stringify([previous,next,asset]);
    joins(connectCourtyards(previous,next,asset),previous,next);
    assert.equal(JSON.stringify([previous,next,asset]),original,'装饰桥不得反过来移动地标');
  }
});
test('桌面左右错落的两种方向和不同局部宽度都绑定真实端点',()=>{
  for(const [previous,next] of [
    [stage('unit1-2',140,38,420),stage('unit3-4',0,446,420)],
    [stage('unit3-4',0,446,420),stage('unit5-6',140,854,420)],
    [stage('unit7-8',100,24,380),stage('unit9-10',8,440,320)]
  ])joins(connectCourtyards(previous,next,asset),previous,next);
});
test('地图原点变化只平移装饰桥，整体缩放不会造成端点漂移',()=>{
  const previous=stage('unit9-10',140,38,420),next=stage('unit11-12',0,446,420);
  const initial=connectCourtyards(previous,next,asset);
  const shifted=connectCourtyards({...previous,left:previous.left+72,top:previous.top-19},{...next,left:next.left+72,top:next.top-19},asset);
  close(shifted.left,initial.left+72,'平移 left');close(shifted.top,initial.top-19,'平移 top');
  close(shifted.width,initial.width,'平移 width');close(shifted.height,initial.height,'平移 height');
  const scale=s=>({...s,left:s.left*1.5,top:s.top*1.5,width:s.width*1.5,height:s.height*1.5});
  const scaled=connectCourtyards(scale(previous),scale(next),asset);
  for(const key of ['left','top','width','height'])close(scaled[key],initial[key]*1.5,'缩放 '+key);
});
test('零、负数及非有限局部尺寸不产生可绘制桥，反向路径也不硬拉伸',()=>{
  const previous=stage('unit1-2',16,28,358),next=stage('unit3-4',16,400,358);
  for(const key of ['width','height'])for(const value of [0,-1,NaN,Infinity,-Infinity]){
    assert.equal(connectCourtyards({...previous,[key]:value},next,asset),null,'前课 '+key+'='+value);
    assert.equal(connectCourtyards(previous,{...next,[key]:value},asset),null,'后课 '+key+'='+value);
  }
  for(const key of ['left','top'])for(const value of [NaN,Infinity,-Infinity]){
    assert.equal(connectCourtyards({...previous,[key]:value},next,asset),null,'前课 '+key+'='+value);
    assert.equal(connectCourtyards(previous,{...next,[key]:value},asset),null,'后课 '+key+'='+value);
  }
  assert.equal(connectCourtyards(previous,{...next,left:600},asset),null,'后课入口在前课出口右方，不镜像桥');
  assert.equal(connectCourtyards(previous,{...next,top:-400},asset),null,'后课在上方，不倒转桥');
  assert.equal(connectCourtyards(previous,next,{...asset,to:[asset.from[0],asset.to[1]]}),null,'桥横向锚点重合');
  assert.equal(connectCourtyards(previous,next,{...asset,to:[asset.to[0],asset.from[1]]}),null,'桥纵向锚点重合');
});
test('零课和单课不画连接，只有两课时直接连接当前实际呈现的课程',()=>{
  const first=stage('unit1-2',16,28,358),last=stage('unit5-6',16,400,358);
  assert.deepEqual(layoutCourtyardLinks([],asset),[]);
  assert.deepEqual(layoutCourtyardLinks([first],asset),[]);
  // 中间课程未授权或未呈现时，输入里没有它；不能凭全目录补画任何隐藏课程。
  const links=layoutCourtyardLinks([first,last],asset);
  assert.equal(links.length,1);
  assert.deepEqual(links.map(link=>[link.id,link.next]),[['unit1-2','unit5-6']]);
  joins(links[0],first,last);
});
test('三课只连相邻实际课程；无效中间场景不偷偷跨过它连接首尾',()=>{
  const first=stage('unit7-8',140,38,420),middle=stage('unit9-10',0,446,420),last=stage('unit11-12',140,854,420);
  const links=layoutCourtyardLinks([first,middle,last],asset);
  assert.deepEqual(links.map(link=>[link.id,link.next]),[['unit7-8','unit9-10'],['unit9-10','unit11-12']]);
  joins(links[0],first,middle);joins(links[1],middle,last);
  assert.deepEqual(layoutCourtyardLinks([first,{...middle,width:0},last],asset),[]);
  const oneValid=layoutCourtyardLinks([{...first,width:0},middle,last],asset);
  assert.deepEqual(oneValid.map(link=>[link.id,link.next]),[['unit9-10','unit11-12']]);
});
test('未准备好的矩形或不完整锚点静默省略，不把NaN传给页面样式',()=>{
  const previous=stage('unit1-2',16,28,358),next=stage('unit3-4',16,400,358);
  for(const invalid of [undefined,null,[],[.2],[NaN,.5],[.5,Infinity]]){
    assert.equal(connectCourtyards({...previous,exit:invalid},next,asset),null);
    assert.equal(connectCourtyards(previous,{...next,entry:invalid},asset),null);
    assert.equal(connectCourtyards(previous,next,{...asset,from:invalid}),null);
    assert.equal(connectCourtyards(previous,next,{...asset,to:invalid}),null);
  }
  assert.equal(connectCourtyards(null,next,asset),null);
  assert.equal(connectCourtyards(previous,undefined,asset),null);
  assert.equal(connectCourtyards(previous,next,null),null);
});
