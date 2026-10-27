(function(root){
  'use strict';
  const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels={mobile:'手机',tablet:'平板',desktop:'电脑',unknown:'未识别'};
  const pageLabels={login:'登录页',home:'课程首页',album:'纪念册',lesson:'课程学习',admin:'管理页',other:'其他页面'};
  const browserLabels={wechat:'微信',edge:'Edge',chrome:'Chrome','chrome-ios':'Chrome（iOS）',safari:'Safari',firefox:'Firefox','firefox-ios':'Firefox（iOS）',unknown:'未识别'};
  const percentage=view=>view?.percent===null||view?.percent===undefined?(view?.status==='pending-data'?'待统计':'待验证'):view.percent+'%';
  async function open({app,api,back}){
    app.innerHTML='<section class="panel"><h1>设备与窗口统计</h1><p role="status">正在读取汇总…</p></section>';
    let days=30,report;
    async function load(){
      try{
        report=await api('admin/viewport-metrics?days='+days);
        render();
      }catch(error){
        app.innerHTML='<section class="panel"><h1>设备与窗口统计</h1><p role="alert">'+e(error.message)+'</p><button id="viewportBack">返回管理</button></section>';
        app.querySelector('#viewportBack').onclick=back;
      }
    }
    function render(){
      const rows=report.rows.slice(0,100);
      app.innerHTML='<div class="toolbar"><div><p class="muted">灿然英语工作室</p><h1>设备与窗口统计</h1></div><button id="viewportBack" class="compact">返回管理</button></div>'+
        '<section class="panel"><p>'+(!report.enabled?'采集开关尚未启用；当前不会记录访问尺寸。':'采集已启用。这里只统计页面访问环境，不代表独立人数或设备数。')+'</p>'+
        '<label for="viewportDays">统计时间</label><select id="viewportDays"><option value="7">最近 7 天</option><option value="30">最近 30 天</option><option value="90">最近 90 天</option></select>'+
        '<p>'+e(report.window.from)+' 至 '+e(report.window.to)+' · '+e(report.total)+' 个有效访问上下文</p>'+
        '<h2>学生首页验证覆盖率：'+percentage(report.coverage)+'</h2><p class="muted">目标 95%。只有与页面、窗口、浏览器和页面版本对应的有效验证证据才计入；未知环境保留在分母。固定尺寸通过不等于真实访问已覆盖。</p>'+
        '<div class="tabs">'+(report.devices||[]).map(item=>'<span class="compact">'+e(labels[item.platform])+'：'+percentage(item)+'（'+e(item.visits)+'）</span>').join('')+'</div>'+
        '<button id="viewportExport" class="compact" '+(!report.candidates?.length?'disabled':'')+'>导出待验证环境</button></section>'+
        '<section class="panel"><h2>常见窗口尺寸</h2>'+(!rows.length?'<p>尚无数据。启用后需等待真实访问。</p>':'<div style="overflow:auto"><table class="viewport-metrics-table"><thead><tr><th>窗口</th><th>可见区域</th><th>页面</th><th>浏览器</th><th>设备类别</th><th>次数</th></tr></thead><tbody>'+rows.map(row=>'<tr><td>'+row.layoutWidth+' × '+row.layoutHeight+'</td><td>'+e(row.visualWidth===null?'未知':row.visualWidth+' × '+row.visualHeight)+'</td><td>'+e(pageLabels[row.pageKind]||row.pageKind)+'</td><td>'+e(browserLabels[row.browserFamily]||row.browserFamily)+'</td><td>'+e(labels[row.platformGroup])+'</td><td>'+row.count+'</td></tr>').join('')+'</tbody></table></div><p class="muted">最多展示前 100 项；覆盖率使用全部有效汇总计算。</p>')+'</section>'+
        '<section class="panel"><h2>采集质量</h2><p>接收 '+(report.quality.received||0)+' · 重复 '+(report.quality.duplicate||0)+' · 格式不符 '+(report.quality.invalid||0)+' · 限频 '+(report.quality.limited||0)+' · 页面变化达上限 '+(report.quality.capped||0)+' · 本次服务启动后丢弃 '+(report.quality.droppedSinceStart||0)+'</p><p class="muted">未收到的访问不在样本中；真机、微信和实际软键盘的验证结果须单独记录。</p></section>';
      app.querySelector('#viewportBack').onclick=back;
      const select=app.querySelector('#viewportDays');select.value=String(days);select.onchange=()=>{days=Number(select.value);load();};
      app.querySelector('#viewportExport').onclick=()=>{
        const data={version:1,status:'needs-verification',window:report.window,targetPercent:95,scope:'student-home',contexts:report.candidates};
        const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
        const a=document.createElement('a');a.href=url;a.download='viewport-candidates-'+report.window.to+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      };
    }
    await load();
  }
  root.CanranAdminViewports={open};
})(window);
