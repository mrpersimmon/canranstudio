/* Browser-computed checks, shared by the in-app browser and CI. */
(function () {
  'use strict';
  const rgb = color => (color.match(/[\d.]+/g) || []).map(Number);
  const luminance = color => rgb(color).slice(0, 3).map(value => {
    value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  const rasterProof = new Map();
  function checkCutout(win,img){
    if(rasterProof.has(img.currentSrc))return rasterProof.get(img.currentSrc);
    const canvas=win.document.createElement('canvas');canvas.width=64;canvas.height=64;
    const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(img,0,0,64,64);
    const rgba=context.getImageData(0,0,64,64).data;
    let transparent=0,opaque=0;
    for(let i=3;i<rgba.length;i+=4){if(rgba[i]<8)transparent++;if(rgba[i]>248)opaque++;}
    const result={transparent,opaque,samples:4096};rasterProof.set(img.currentSrc,result);return result;
  }
  function surface(win, element) {
    for (let el = element; el; el = el.parentElement) {
      const color = win.getComputedStyle(el).backgroundColor;
      if (rgb(color).length === 3 || rgb(color)[3] === 1) return color;
    }
    return 'rgb(255, 255, 255)';
  }
  // axe conservatively flags an ancestor's arrow whenever its area is larger
  // than a short label, even when the arrow is outside the button. Resolve only
  // opaque, flat controls after proving every such decoration misses the text.
  // Gradients, translucent layers and unresolvable geometry still fail closed.
  function flatControlContrast(win, element) {
    const button=element.closest('button,.lp-modal');if(!button)return null;
    const textRect=element.getBoundingClientRect(), bs=win.getComputedStyle(button), fg=win.getComputedStyle(element);
    if(rgb(bs.backgroundColor).length===4&&rgb(bs.backgroundColor)[3]!==1)return null;
    const decorations=[];
    for(let el=element;el;el=el.parentElement){
      const style=win.getComputedStyle(el);
      if(style.opacity!=='1'||style.filter!=='none'||style.mixBlendMode!=='normal'||style.backgroundImage!=='none')return null;
      for(const pseudo of ['::before','::after']){
        const s=win.getComputedStyle(el,pseudo);
        if(s.content==='none'||s.display==='none'||s.visibility==='hidden')continue;
        if(s.content!=='""'||s.position!=='absolute'||!['width','height','top','left'].every(key=>s[key].endsWith('px')))return null;
        const box=el.getBoundingClientRect(),w=parseFloat(s.width),h=parseFloat(s.height),origin=s.transformOrigin.split(' ').map(parseFloat),m=new win.DOMMatrixReadOnly(s.transform==='none'?undefined:s.transform);
        const points=[[0,0],[w,0],[w,h],[0,h]].map(([x,y])=>({x:box.left+el.clientLeft+parseFloat(s.left)+origin[0]+m.a*(x-origin[0])+m.c*(y-origin[1])+m.e,y:box.top+el.clientTop+parseFloat(s.top)+origin[1]+m.b*(x-origin[0])+m.d*(y-origin[1])+m.f}));
        const rect={left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};
        if(rect.left<textRect.right&&rect.right>textRect.left&&rect.top<textRect.bottom&&rect.bottom>textRect.top)return null;
        decorations.push(rect);
      }
    }
    const a=luminance(fg.color),b=luminance(bs.backgroundColor),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    const large=parseFloat(fg.fontSize)>=24||parseFloat(fg.fontSize)>=18.667&&Number(fg.fontWeight)>=700;
    return {ratio,minimum:large?3:4.5,foreground:fg.color,background:bs.backgroundColor,decorations};
  }
  function modalTextContrast(win,element){
    if(!element.closest('.lp-modal'))return null;
    const range=win.document.createRange();range.selectNodeContents(element);
    for(const rect of range.getClientRects())for(const x of [.1,.5,.9])for(const y of [.25,.75]){
      const hit=win.document.elementFromPoint(rect.left+rect.width*x,rect.top+rect.height*y);
      if(!hit||!element.contains(hit))return null;
    }
    return flatControlContrast(win,element);
  }
  window.auditReadability = async function (win, { expectedTheme, name }) {
    const doc = win.document, errors = [], resolved = [];
    const root = doc.querySelector('[data-learning-path]');
    let completionBoundary = null;
    if (root.querySelector('.lp-celebration')) {
      const actions = root.querySelectorAll('.lp-footer .lp-primary');
      const button = actions[0], rect = button?.getBoundingClientRect();
      const inViewport = Boolean(rect && rect.top >= 0 && rect.bottom <= win.innerHeight && rect.left >= 0 && rect.right <= win.innerWidth);
      completionBoundary = {action:button?.dataset.action, inViewport};
      if (actions.length !== 1 || button.dataset.action !== 'map' || button.disabled) errors.push({rule:'completion-primary-action',action:button?.dataset.action});
      if (!inViewport) errors.push({rule:'completion-action-offscreen'});
    }
    const journeyLayout = { gaps: [], pitch: null };
    if (root.querySelector('[data-journey-tab="path"]')) {
      journeyLayout.pitch = parseFloat(win.getComputedStyle(root.querySelector('.journey-app')).getPropertyValue('--journey-pitch'));
      for (const list of root.querySelectorAll('.journey-nodes')) {
        const nodes = [...list.querySelectorAll('.journey-node')];
        for (let i = 1; i < nodes.length; i++) {
          const previous = nodes[i-1].getBoundingClientRect(), current = nodes[i].getBoundingClientRect();
          const distance = current.top + current.height/2 - previous.top - previous.height/2;
          journeyLayout.gaps.push(distance);
          if (!Number.isFinite(journeyLayout.pitch) || Math.abs(distance - journeyLayout.pitch) > 1) errors.push({rule:'journey-node-spacing',node:nodes[i].dataset.id,distance,expected:journeyLayout.pitch});
        }
        for (const cat of list.querySelectorAll('.journey-mascot')) if (cat.getClientRects().length) {
          const a = cat.getBoundingClientRect();
          for (const node of nodes) {
            const b = node.getBoundingClientRect();
            if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) errors.push({rule:'journey-art-overlap',node:node.dataset.id});
          }
        }
      }
    }
    const shell = root.querySelector('.station-app,.course-package-shell') || root;
    const canvas = surface(win, shell);
    const expected = expectedTheme === 'dark' ? 'rgb(20, 31, 35)' : 'rgb(223, 230, 223)';
    if (canvas !== expected) errors.push({rule:'screen-canvas', actual:canvas, expected});
    const chromeColor=doc.querySelector('meta[name="theme-color"]')?.content;
    if(chromeColor!=='#141f23')errors.push({rule:'browser-theme',actual:chromeColor,expected:'#141f23'});
    if (doc.documentElement.scrollWidth > win.innerWidth + 1) errors.push({rule:'horizontal-overflow', width:doc.documentElement.scrollWidth, viewport:win.innerWidth});
    let visibleImages = 0;
    for (const img of root.querySelectorAll('img')) {
      const essential=img.matches('.lp-story-character>img,.lp-actor img,.lp-story-object,.lp-question-object>img,.lp-vocabulary-image,.lp-option-image,.lp-chat-avatar>img');
      const bounds=img.getBoundingClientRect();
      if(essential&&(bounds.width<16||bounds.height<16))errors.push({rule:'hidden-teaching-image',src:img.getAttribute('src')});
      const scene=img.matches('.lp-actor img')&&img.closest('.lp-scene')?.getBoundingClientRect();
      if(scene&&(bounds.top<scene.top-1||bounds.bottom>scene.bottom+1))errors.push({rule:'overflowing-character',src:img.getAttribute('src')});
      if (!img.getClientRects().length) continue;
      visibleImages++;
      const style = win.getComputedStyle(img);
      if (!img.complete || !img.naturalWidth) errors.push({rule:'image-loaded', src:img.getAttribute('src')});
      else if(essential||img.matches('.lp-celebration>img,.lp-blocked>img,.course-package-shell>img')){
        try{const pixels=checkCutout(win,img);if(pixels.transparent<40||pixels.opaque<40)errors.push({rule:'teaching-art-cutout',src:img.getAttribute('src'),...pixels});}
        catch(error){errors.push({rule:'teaching-art-unresolved',src:img.getAttribute('src'),message:String(error)});}
      }
      if (style.mixBlendMode === 'multiply' && luminance(surface(win, img)) < .5) errors.push({rule:'darkened-art', src:img.getAttribute('src')});
      if (!img.closest('[disabled],[aria-disabled="true"]') && Number(style.opacity) < .5) errors.push({rule:'faded-art', src:img.getAttribute('src')});
      if(essential)for(let el=img;el;el=el.parentElement){
        const s=win.getComputedStyle(el);
        if(s.visibility!=='visible'||Number(s.opacity)<.5||s.filter!=='none'){
          errors.push({rule:'obscured-teaching-image',src:img.getAttribute('src'),visibility:s.visibility,opacity:s.opacity,filter:s.filter});break;
        }
      }
    }
    for(const button of root.querySelectorAll('.lp-footer button,.lp-option,.lp-vocabulary-card,.lp-line-play,.journey-preview button,[data-journey-current],.journey-start-hint')){
      if(button.disabled||button.closest('[inert]')||!button.getClientRects().length)continue;
      const rect=button.getBoundingClientRect();
      if(rect.width<44||rect.height<44)errors.push({rule:'small-action',label:button.getAttribute('aria-label')||button.textContent});
      const history=button.closest('.lp-story-transcript,.lp-role-history'),clip=history?.getBoundingClientRect();
      const clippedHistory=clip&&(rect.top<clip.top||rect.bottom>clip.bottom);
      if(!clippedHistory&&rect.top>=0&&rect.bottom<=win.innerHeight&&rect.left>=0&&rect.right<=win.innerWidth){
        const top=doc.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2);
        if(top&&!button.contains(top)){
          let reachable=false;
          if(top.closest('.lp-footer')&&doc.documentElement.scrollHeight>win.innerHeight){
            const scroll=win.scrollY;button.scrollIntoView({block:'center',behavior:'instant'});
            const moved=button.getBoundingClientRect(),hit=doc.elementFromPoint(moved.x+moved.width/2,moved.y+moved.height/2);
            reachable=Boolean(hit&&button.contains(hit));win.scrollTo({top:scroll,behavior:'instant'});
          }
          if(reachable)resolved.push({label:button.textContent,method:'scroll-action-and-recheck'});
          else errors.push({rule:'covered-action',label:button.getAttribute('aria-label')||button.textContent,coveredBy:top.className});
        }
      }
    }
    if(win.fixture?.errors.length)errors.push({rule:'browser-error',messages:win.fixture.errors});
    const results = await win.axe.run(root, {runOnly:{type:'rule',values:['color-contrast']}, resultTypes:['violations','incomplete']});
    for (const v of results.violations) for (const node of v.nodes) errors.push({rule:v.id, target:node.target, message:node.failureSummary});
    // Do not quietly turn unmeasurable text into a pass.
    for (const v of results.incomplete) for (const node of v.nodes) {
      const element=node.target.length===1&&doc.querySelector(node.target[0]);
      const measurement=element&&(node.any.some(check=>check.data?.messageKey==='pseudoContent')?flatControlContrast(win,element):modalTextContrast(win,element));
      if(measurement&&measurement.ratio>=measurement.minimum)resolved.push({target:node.target,...measurement});
      else {
        // Previous lines intentionally live in a scrollable transcript. Inspect
        // clipped text by actually scrolling it into view, then run the same
        // contrast rule again. Do not exclude the transcript from checking.
        const history=element?.closest('.lp-story-transcript'),box=element?.getBoundingClientRect(),bounds=history?.getBoundingClientRect();
        if(history&&box&&(box.top<bounds.top||box.bottom>bounds.bottom)&&node.any.some(c=>c.data?.messageKey==='elmPartiallyObscured')){
          const scroll=history.scrollTop,top=win.scrollY;
          element.scrollIntoView({block:'center',behavior:'instant'});
          const retry=await win.axe.run(element,{runOnly:{type:'rule',values:['color-contrast']},resultTypes:['violations','incomplete']});
          history.scrollTop=scroll;win.scrollTo({top,behavior:'instant'});
          if(!retry.violations.length&&!retry.incomplete.length){resolved.push({target:node.target,method:'scroll-and-recheck'});continue;}
        }
        errors.push({rule:'contrast-unresolved', target:node.target, message:node.failureSummary});
      }
    }
    return {name, expectedTheme, viewport:[win.innerWidth,win.innerHeight], canvas, visibleImages, journeyLayout, completionBoundary, resolved, errors};
  };
})();
