'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fitFrame,overlayLayout}=require('../../course-journey/overlay-layout');
const art=require('../../course-journey/chapter-layout');
const {viewports}=require('../support/journey-viewports');
const rect=box=>({...box,right:box.right??box.left+box.width,bottom:box.bottom??box.top+box.height});
const distance=(a,b)=>Math.hypot(Math.max(0,a.left-b.right,b.left-a.right),Math.max(0,a.top-b.bottom,b.top-a.bottom));
const center=box=>(box.left+box.right)/2;

// 侧边中文删除后，名字仍沿用旧宽高/递归避让会继续串位。本检查按
// 用户看到的整组轮廓、完整星章行和 Lesson 点击底牌独立验证一条轴线。
test('地图入口固定为人物、星章、Lesson 单列，不受中文或旧避让元数据影响',()=>{
  const scene=art.chapters.opening.portrait;
  const changed={...scene,nodes:Object.fromEntries(Object.entries(scene.nodes).map(([id,node])=>[id,{...node,info:{x:20,offsetY:999,after:'unit1-2'},caption:{compact:{width:900,height:900},mobile:{width:900,height:900},desktop:{width:900,height:900}}}]))};
  for(const desktop of [false,true]){
    const args={characters:art.characters,width:390,height:585,viewportWidth:390,desktop,composition:'portrait'};
    const actual=overlayLayout({...args,scene});
    assert.deepEqual(actual,overlayLayout({...args,scene:changed}),'中文占位或旧 after 链不能改变单列坐标');
    for(const [id,item]of Object.entries(actual.items)){
      const figure=actual.figures[id],row=rect(item.rewards),name=rect(item.label);
      assert.ok(Math.abs(center(name)-center(figure))<.001,id+' 课号必须与人物同轴');
      assert.ok(Math.abs(center(row)-center(figure))<.001,id+' 星章必须与人物同轴');
      assert.equal(row.top,figure.bottom+6);
      assert.equal(name.top,row.bottom+8);
      assert.equal(name.height,44,'课号保留 44px 点击目标');
      assert.equal(item.label.beside,false);
      assert.equal(item.label.multiline,false);
    }
  }
});

test('全部 24 段在完整固定尺寸矩阵中保持单列归属、完整边界和相邻安全距离',()=>{
  for(const [screenWidth,screenHeight]of viewports('map','full')){
    const desktop=screenWidth>=1024,viewportWidth=desktop?Math.min(screenWidth,1440)-340:screenWidth;
    const available=Math.max(1,screenHeight-86);
    for(const [chapter,scenes]of Object.entries(art.chapters)){
      let composition=viewportWidth>=600&&viewportWidth/available>=1?'landscape':'portrait';
      const fit=kind=>fitFrame({scene:scenes[kind],characters:art.characters,viewportWidth,available,desktop,composition:kind});
      let frame=fit(composition);
      if(composition==='landscape'&&frame.overlays.collisions.length){composition='portrait';frame=fit(composition);}
      const context=`${chapter} ${screenWidth}×${screenHeight} ${composition}`;
      assert.deepEqual(frame.overlays.collisions,[],context+' 星章或课号会落入邻课');
      const groups=Object.entries(frame.overlays.items).map(([id,item])=>[id,[frame.overlays.figures[id],rect(item.rewards),rect(item.label)]]);
      for(const [id,[figure,row,name]]of groups){
        assert.ok(Math.abs(center(name)-center(figure))<.001&&Math.abs(center(row)-center(figure))<.001,context+' '+id+' 未同轴');
        assert.equal(row.top,figure.bottom+6);
        assert.equal(name.top,row.bottom+8);
        assert.equal(name.height,44);
        assert.ok(name.width>=132,context+' 最长 Lesson 143–144 不能换行');
        for(const box of [figure,row,name]){
          assert.ok(box.left+frame.left>=6-.01&&box.right+frame.left<=viewportWidth-6+.01,context+' '+id+' 越过横边界');
          assert.ok(box.top+frame.top>=6-.01&&box.bottom+frame.top<=frame.height-6+.01,context+' '+id+' 被地图裁切');
        }
        for(const [other,boxes]of groups)if(id!==other){
          for(const own of [figure,row,name])for(const box of boxes)assert.ok(distance(own,box)>=12-.01,context+' '+id+' 与 '+other+' 不足12px');
        }
      }
    }
  }
});

test('可用高度变化不能被课程中文名称引起的底部卡片高度带动而缩放人物',()=>{
  for(const viewportWidth of [320,390,768,1100])for(const composition of ['portrait','landscape']){
    for(const scene of Object.values(art.chapters).map(chapter=>chapter[composition])){
      const args={scene,characters:art.characters,viewportWidth,desktop:viewportWidth>=1024,composition};
      const short=fitFrame({...args,available:300}),tall=fitFrame({...args,available:900});
      for(const key of ['width','canvasHeight','left','top'])assert.equal(short[key],tall[key],`${viewportWidth}/${scene.file}/${key}`);
      assert.deepEqual(short.overlays,tall.overlays,'选择课程不能改变人物和单列入口的相对位置');
    }
  }
});

test('更宽手机利用安全空间恢复人物比例，最终节点始终介于落地最小值和安全上限之间',()=>{
  for(const [chapter,scenes]of Object.entries(art.chapters)){
    const scene={...scenes.portrait,nodes:Object.fromEntries(Object.entries(scenes.portrait.nodes).map(([id,node])=>[id,{...node,maxWidth:Math.max(node.width*1.4,node.maxWidth||0)}]))};
    let previous;
    for(const viewportWidth of [320,390,430,495]){
      const frame=fitFrame({scene,characters:art.characters,viewportWidth,desktop:false,composition:'portrait'});
      assert.ok(frame.nodes,chapter+' 必须返回与碰撞计算一致的真实渲染节点');
      assert.deepEqual(frame.overlays.collisions,[],chapter+' '+viewportWidth);
      for(const [id,node]of Object.entries(frame.nodes)){
        assert.ok(node.width>=scene.nodes[id].width-.00001&&node.width<=scene.nodes[id].maxWidth+.00001,id+' 缩放越过真实落地上下限');
        assert.deepEqual(node.feet,scene.nodes[id].feet,id+' 不能为课号移动脚点');
        const box=frame.overlays.figures[id];
        if(previous){
          const before=previous.overlays.figures[id];
          assert.ok(box.right-box.left>=before.right-before.left-.01,chapter+' '+id+' 较宽手机反而缩小人物');
        }
      }
      previous=frame;
    }
    assert.ok(Object.entries(previous.nodes).some(([id,node])=>node.width>scene.nodes[id].width*1.1),chapter+' 不能永久锁在320最小比例');
  }
});

test('画布水平空间不足时不以至少等于屏宽为由突破真实边界',()=>{
  const scene={width:1024,height:1536,nodes:{only:{feet:[.9,.6],width:.1}}};
  const characters={only:{width:100,height:100,anchor:[.5,1],bounds:[0,0,1,1]}};
  const frame=fitFrame({scene,characters,viewportWidth:320,desktop:false,composition:'portrait'});
  assert.ok(frame.width<320,'不安全的自然画布必须允许回退为居中留白');
  for(const box of [frame.overlays.figures.only,rect(frame.overlays.items.only.rewards),rect(frame.overlays.items.only.label)])assert.ok(box.left+frame.left>=6-.01&&box.right+frame.left<=314+.01,'不能静默突破边界');
});
