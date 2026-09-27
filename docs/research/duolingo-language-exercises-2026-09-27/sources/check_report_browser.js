async (page) => {
  const base='http://127.0.0.1:59042/report.html';
  const out='/Users/permission/Documents/ChatGPT/canranstudio.cn/docs/research/duolingo-language-exercises-2026-09-27/sources/';
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1200,height:1000});
  await page.goto(base);
  await page.locator('img').evaluateAll(els=>els.forEach(e=>e.loading='eager'));
  const decoded=await page.locator('img').evaluateAll(async els=>Promise.all(els.map(async e=>{try{await e.decode();return {src:e.getAttribute('src'),width:e.naturalWidth};}catch{return {src:e.getAttribute('src'),width:0};}})));
  const result={date:'2026-09-27',report_title:await page.title(),catalogue_rows:await page.locator('#catalogue tbody tr').count()};
  const input=page.locator('#catalogue-filter');
  await input.fill('完整中文题页');result.full_chinese_filter_rows=await page.locator('#catalogue tbody tr:visible').count();
  await input.fill('不含口语和听力');result.non_audio_filter_rows=await page.locator('#catalogue tbody tr:visible').count();
  await input.fill('');result.cleared_filter_rows=await page.locator('#catalogue tbody tr:visible').count();
  result.non_audio_article_ids=await page.locator('#non-audio article').evaluateAll(els=>els.map(e=>e.id));
  await page.goto(base+'#E02');result.pending_anchor_opens_analysis=await page.locator('#E02 > details').evaluate(e=>e.open);
  await page.goto(base+'#live-F16');result.flow_anchor_opens_gallery=await page.locator('#live-F16').evaluate(e=>e.open);
  result.super_flow_anchors_open=true;
  for(const id of ['F17','F26','F28','F31','F35']){
    await page.goto(base+'#live-'+id);
    result.super_flow_anchors_open = result.super_flow_anchors_open && await page.locator('#live-'+id).evaluate(e=>e.open);
  }
  result.flow_groups=await page.locator('details.live-flow').count();
  result.flow_step_cards=await page.locator('figure.flow-step').count();
  result.unique_flow_screenshot_files=await page.locator('.flow-step img').evaluateAll(els=>new Set(els.map(e=>e.getAttribute('src'))).size);
  result.main_image_sources=await page.locator('img').evaluateAll(els=>els.map(e=>e.getAttribute('src')));
  result.image_decode_failures=decoded.filter(x=>!x.width);
  result.document_scroll_width=await page.evaluate(()=>document.documentElement.scrollWidth);result.viewport_width=1200;
  await page.goto(base+'#top');
  await page.screenshot({path:out+'chinese-report-preview.png',scale:'css'});
  await page.goto(base+'#F26-step-21');
  await page.locator('#F26-step-21').evaluate(e=>e.scrollIntoView({block:'start'}));await page.evaluate(()=>window.scrollBy(0,-75));
  await page.locator('#F26-step-21 img').evaluate(e=>e.decode());
  await page.screenshot({path:out+'chinese-flow-preview.png',scale:'css'});
  await page.setViewportSize({width:390,height:844});await page.goto(base+'#live-F31');
  await page.locator('#F31-step-3').evaluate(e=>e.scrollIntoView({block:'start'}));await page.evaluate(()=>window.scrollBy(0,-65));
  await page.screenshot({path:out+'chinese-flow-mobile-preview.png',scale:'css'});
  result.narrow_viewport_width=390;result.narrow_document_scroll_width=await page.evaluate(()=>document.documentElement.scrollWidth);
  result.narrow_step_columns=await page.locator('#live-F31 .step-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns);
  result.javascript_errors=errors;
  await page.setViewportSize({width:1200,height:1000});await page.goto(base+'#flows');
  return result;
}
