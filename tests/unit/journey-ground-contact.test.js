'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const art=require('../../course-journey/chapter-layout');
const measures=require('../support/journey-ground-contact.json');
const inside=([x,y],[left,top,right,bottom])=>x>=left&&x<=right&&y>=top&&y<=bottom;
function contactAt(scene,character,node,point,width=node.width){
  return[node.feet[0]+(point[0]/character.width-character.anchor[0])*width,
    node.feet[1]+(point[1]/character.height-character.anchor[1])*width*character.height/character.width*scene.width/scene.height];
}
// 旧检查只看整组透明轮廓有没有重叠，曾让顾客鞋底站到路灯上。
// 这里用人工读取的鞋底/桌脚/椅座像素点和背景铺地范围作独立真相；
// 分别验证320最小比例和大屏恢复上限，不从当前feet生成期望值。
test('柜台、花架和座椅样板的真实接地点在铺地，避开路灯与花丛',()=>{
  for(const fixture of measures.cases)for(const composition of ['portrait','landscape']){
    const scene=art.chapters[fixture.chapter][composition],character=art.characters[fixture.course],node=scene.nodes[fixture.course],ground=fixture[composition];
    assert.equal(character.file,fixture.asset,'换图必须重新目视标定支撑点');
    assert.deepEqual([character.width,character.height],fixture.sourceSize);
    for(const width of new Set([node.width,node.maxWidth||node.width]))for(const measured of fixture.contacts){
      const at=contactAt(scene,character,node,measured.pixel,width),context=`${fixture.course} ${composition} ${width}: ${measured.name} (${at.join(',')})`;
      assert.ok(inside(at,ground.floor),context+' 离开真实铺地范围');
      for(const obstacle of ground.forbidden)assert.ok(!inside(at,obstacle.rect),context+' 压住'+obstacle.name);
    }
  }
});
test('旧Lesson3–4顾客踩灯座的坐标必须被独立接地点规则识别',()=>{
  const fixture=measures.cases[0],scene=art.chapters.opening.portrait,character=art.characters['unit3-4'];
  const original={feet:[.38,.47],width:.45};
  const leftShoe=contactAt(scene,character,original,fixture.contacts[0].pixel);
  assert.ok(inside(leftShoe,fixture.portrait.forbidden[0].rect),'回归夹具必须能够发现本次原问题');
});
module.exports={contactAt};
