# Engineering Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for every behavior change and superpowers:verification-before-completion before claiming this plan complete.

**Goal:** Close the remaining certificate-save, keyboard, focus, live-feedback, and external-font weaknesses without changing the visual direction or adding runtime dependencies.

**Architecture:** Keep all pages static. Repair Lesson 49 certificate export with Blob URLs and deterministic cleanup. Use native `<dialog>` for the three certificate experiences and rely on its modal focus containment, with explicit focus entry/return. Add semantic flip-card state and live regions at page initialization. Vendor pinned Fontsource WOFF2 assets and licenses into `assets/fonts/`, then narrow the HTTP CSP.

**Tech Stack:** HTML5 `<dialog>`, Canvas/Blob APIs, ARIA, browser JavaScript, Fontsource 5.3.0 build-time packages, Playwright 1.62.0

## Preconditions and Constraints

- Complete the state-integrity, audio-lifecycle, and HTTP-routing plans first.
- Paths in this plan assume Lesson 49 is at `lesson49/index.html` and the welcome page is at
  root `index.html`.
- Start from a clean worktree with these commands passing:

```bash
npm test
npm run test:deploy
npm run build:static
```

- Preserve the current colors, layout, animation style, course text, and certificate artwork.
- Keep runtime package dependencies at zero.
- Use `canvas.toBlob()` when available; use data-URL conversion only as an explicit legacy fallback.
- Never insert the raw learner name into a download filename.
- Native dialog close paths must all return focus to the opener.
- All font requests must be same-origin after this plan.

---

### Task 1: Make Lesson 49 certificate export Blob-based and revocable

**Files:**
- Create: `tests/e2e/certificate-export.spec.js`
- Modify: `lesson49/index.html` in `saveCertImage` and `showCertOverlay`

**Interfaces:**
- `sanitizeFilenamePart(value, fallback): string`
- `renderCertBlob(): Promise<Blob|null>`
- `showCertOverlay(blobUrl): HTMLElement`
- Every created Blob URL is revoked when its overlay closes or when overlay creation fails.

- [ ] **Step 1: Write the failing Blob and filename regression**

Create `tests/e2e/certificate-export.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }
    }));
    window.__toBlobCalls = 0;
    window.__createdUrls = [];
    window.__revokedUrls = [];
    window.__download = null;
    HTMLCanvasElement.prototype.toBlob = function toBlob(callback) {
      window.__toBlobCalls += 1;
      callback(new Blob(['png'], { type: 'image/png' }));
    };
    URL.createObjectURL = blob => {
      const value = `blob:canran-${window.__createdUrls.length + 1}`;
      window.__createdUrls.push({ value, type: blob.type });
      return value;
    };
    URL.revokeObjectURL = value => window.__revokedUrls.push(value);
    HTMLAnchorElement.prototype.click = function click() {
      window.__download = { href: this.href, download: this.download };
    };
  });
});

test('Lesson 49 exports through Blob, sanitizes the name, and revokes on close', async ({ page }) => {
  await page.goto('/lesson49/');
  await page.locator('#certName').fill('A/B:*?"<>|C');
  await page.locator('#certBtn').click();
  await page.locator('#certSave').click();

  await expect(page.locator('#certSaveOverlay')).toBeVisible();
  const evidence = await page.evaluate(() => ({
    toBlobCalls: window.__toBlobCalls,
    createdUrls: window.__createdUrls,
    download: window.__download
  }));
  expect(evidence.toBlobCalls).toBe(1);
  expect(evidence.createdUrls).toEqual([
    { value: 'blob:canran-1', type: 'image/png' }
  ]);
  expect(evidence.download.href).toBe('blob:canran-1');
  expect(evidence.download.download).toMatch(/^肉店小学徒结业证书-[^\\/:*?"<>|]+\.png$/);

  await page.locator('#certSaveClose').click();
  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__revokedUrls)).toEqual(['blob:canran-1']);
});
```

- [ ] **Step 2: Run the test and confirm the current data-URL behavior**

Run:

```bash
npm run test:e2e -- tests/e2e/certificate-export.spec.js
```

Expected: FAIL because Lesson 49 calls `toDataURL`, does not sanitize the learner name, and does not
revoke a Blob URL.

- [ ] **Step 3: Add deterministic filename and Blob helpers**

After `renderCertCanvas()` in `lesson49/index.html`, add:

```javascript
function sanitizeFilenamePart(value,fallback){
  const cleaned=String(value||'')
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g,'')
    .replace(/\s+/g,' ')
    .trim()
    .slice(0,40);
  return cleaned||fallback;
}

function dataUrlToBlob(dataUrl){
  const parts=dataUrl.split(',');
  const mime=(parts[0].match(/data:([^;]+)/)||[])[1]||'image/png';
  const binary=atob(parts[1]||'');
  const bytes=new Uint8Array(binary.length);
  for(let index=0;index<binary.length;index++)bytes[index]=binary.charCodeAt(index);
  return new Blob([bytes],{type:mime});
}

function renderCertBlob(){
  return new Promise(resolve=>{
    let canvas;
    try{
      canvas=renderCertCanvas();
    }catch(error){
      console.error('证书绘制失败：',error);
      resolve(null);
      return;
    }
    try{
      if(typeof canvas.toBlob==='function'){
        canvas.toBlob(blob=>resolve(blob||null),'image/png');
        return;
      }
      resolve(dataUrlToBlob(canvas.toDataURL('image/png')));
    }catch(error){
      console.error('证书转码失败：',error);
      resolve(null);
    }
  });
}
```

- [ ] **Step 4: Replace `saveCertImage`**

Replace the complete Lesson 49 `saveCertImage` function with:

```javascript
async function saveCertImage(){
  try{
    if(document.fonts&&document.fonts.load){
      await Promise.all([
        document.fonts.load('32px "ZCOOL KuaiLe"'),
        document.fonts.load('bold 64px "ZCOOL KuaiLe"'),
        document.fonts.load('700 27px "Baloo 2"')
      ]);
    }
  }catch{}

  const blob=await renderCertBlob();
  if(!blob){
    alert('😢 证书生成失败，请再点一次试试');
    return;
  }
  let url='';
  try{
    url=URL.createObjectURL(blob);
  }catch{}
  if(!url){
    alert('😢 当前浏览器无法生成图片，直接截图保存吧');
    return;
  }

  const name=sanitizeFilenamePart($('#certNameOut').textContent,'小学徒');
  try{
    const anchor=document.createElement('a');
    anchor.href=url;
    anchor.download='肉店小学徒结业证书-'+name+'.png';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }catch(error){
    console.error('证书下载失败：',error);
  }

  try{
    showCertOverlay(url);
  }catch(error){
    URL.revokeObjectURL(url);
    console.error('证书遮罩失败：',error);
  }
}
```

- [ ] **Step 5: Make overlay cleanup idempotent**

In `showCertOverlay`, replace its close-button/listener tail with:

```javascript
  close.id='certSaveClose';
  let closed=false;
  const closeOverlay=event=>{
    if(event)event.stopPropagation();
    if(closed)return;
    closed=true;
    try{URL.revokeObjectURL(src);}catch{}
    ov.remove();
    sndClick();
  };
  close.addEventListener('click',closeOverlay);
  ov.appendChild(tip);ov.appendChild(img);ov.appendChild(close);
  ov.addEventListener('click',event=>{
    if(event.target===ov)closeOverlay(event);
  });
  document.body.appendChild(ov);
  return ov;
```

- [ ] **Step 6: Run and commit the export repair**

Run:

```bash
npm run test:e2e -- tests/e2e/certificate-export.spec.js
git diff --check
```

Expected: the test passes and the diff check is clean.

Commit:

```bash
git add lesson49/index.html tests/e2e/certificate-export.spec.js
git commit -m "fix: export lesson 49 certificate through Blob"
```

---

### Task 2: Add keyboard flip state and live feedback semantics

**Files:**
- Create: `tests/e2e/accessibility.spec.js`
- Modify: `lesson49/index.html` in `buildCards` and initialization
- Modify: `lesson50/index.html` at initialization
- Modify: `soundmark/index.html` at initialization

- [ ] **Step 1: Write failing keyboard and live-region tests**

Create `tests/e2e/accessibility.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

test('Lesson 49 flip cards expose and update keyboard state', async ({ page }) => {
  await page.goto('/lesson49/');
  const card = page.locator('#cardGrid .fcard-in').first();

  await expect(card).toHaveAttribute('role', 'button');
  await expect(card).toHaveAttribute('tabindex', '0');
  await expect(card).toHaveAttribute('aria-expanded', 'false');
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Space');
  await expect(card).toHaveAttribute('aria-expanded', 'false');
});

for (const path of ['/lesson49/', '/lesson50/', '/soundmark/']) {
  test(`${path} marks every feedback region for polite announcement`, async ({ page }) => {
    await page.goto(path);
    const result = await page.locator('.fb').evaluateAll(elements => ({
      count: elements.length,
      complete: elements.every(element =>
        element.getAttribute('role') === 'status' &&
        element.getAttribute('aria-live') === 'polite' &&
        element.getAttribute('aria-atomic') === 'true'
      )
    }));
    expect(result.count).toBeGreaterThan(0);
    expect(result.complete).toBe(true);
    if (path === '/soundmark/') {
      await expect(page.locator('#toast')).toHaveAttribute('role', 'status');
      await expect(page.locator('#toast')).toHaveAttribute('aria-live', 'polite');
      await expect(page.locator('#toast')).toHaveAttribute('aria-atomic', 'true');
    }
  });
}
```

- [ ] **Step 2: Run the tests and confirm missing semantics**

Run:

```bash
npm run test:e2e -- tests/e2e/accessibility.spec.js
```

Expected: all four tests fail because Lesson 49 cards lack keyboard state and `.fb` elements are not
initialized as live regions.

- [ ] **Step 3: Replace Lesson 49 flip-card event setup**

In `buildCards`, replace the two statements beginning with
`c.querySelector('.fcard-in').addEventListener` with:

```javascript
    const cardIn=c.querySelector('.fcard-in');
    const front=cardIn.querySelector('.ffront');
    const back=cardIn.querySelector('.fback');
    const labelId='l49-card-label-'+i;
    c.querySelector('.fen').id=labelId;
    cardIn.tabIndex=0;
    cardIn.setAttribute('role','button');
    cardIn.setAttribute('aria-labelledby',labelId);
    cardIn.setAttribute('aria-expanded','false');
    front.setAttribute('aria-hidden','false');
    back.setAttribute('aria-hidden','true');
    function toggleCard(){
      const flipped=c.classList.toggle('flipped');
      cardIn.setAttribute('aria-expanded',String(flipped));
      front.setAttribute('aria-hidden',String(flipped));
      back.setAttribute('aria-hidden',String(!flipped));
      sndClick();
    }
    cardIn.addEventListener('click',event=>{
      if(event.target.closest('.spk'))return;
      toggleCard();
    });
    cardIn.addEventListener('keydown',event=>{
      if(event.target.closest('.spk'))return;
      if(event.key!=='Enter'&&event.key!==' ')return;
      event.preventDefault();
      toggleCard();
    });
```

Keep the existing `.spk` click handler directly after this block.

- [ ] **Step 4: Initialize live regions on every course page**

Add this function to the main script of `lesson49/index.html` and `lesson50/index.html`:

```javascript
function initializeLiveRegions(){
  $$('.fb').forEach(element=>{
    element.setAttribute('role','status');
    element.setAttribute('aria-live','polite');
    element.setAttribute('aria-atomic','true');
  });
}
```

Call `initializeLiveRegions()` after all page builders (`buildCards`, `buildMirror`, `buildChoice`,
and other initialization functions) have run.

Add this function near the end of `soundmark/index.html`:

```javascript
function initializeLiveRegions(){
  document.querySelectorAll('.fb').forEach(element=>{
    element.setAttribute('role','status');
    element.setAttribute('aria-live','polite');
    element.setAttribute('aria-atomic','true');
  });
  const toast=document.getElementById('toast');
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  toast.setAttribute('aria-atomic','true');
}
initializeLiveRegions();
```

- [ ] **Step 5: Run and commit accessibility semantics**

Run:

```bash
npm run test:e2e -- tests/e2e/accessibility.spec.js tests/e2e/l49-progress.spec.js tests/e2e/l50-assessment.spec.js tests/e2e/soundmark-progress.spec.js
```

Expected: all targeted tests pass.

Commit:

```bash
git add lesson49/index.html lesson50/index.html soundmark/index.html tests/e2e/accessibility.spec.js
git commit -m "fix: expose card and feedback state accessibly"
```

---

### Task 3: Use native modal dialogs for all three certificate experiences

**Files:**
- Modify: `lesson49/index.html`
- Modify: `lesson50/index.html`
- Modify: `soundmark/index.html`
- Modify: `tests/e2e/accessibility.spec.js`
- Modify: `tests/e2e/soundmark-progress.spec.js`

**Dialog contract:**
- Element: native `<dialog aria-modal="true" aria-labelledby="...">`
- Open: re-check certificate eligibility, remember current focus, call `showModal()`, focus the
  primary dialog action
- Close: close button, Escape, or backdrop click
- Return: focus the element that opened the dialog
- Print/save handlers re-check eligibility independently

- [ ] **Step 1: Add failing dialog focus tests**

Append to `tests/e2e/accessibility.spec.js`:

```javascript
async function seedProgress(page, key, ratings) {
  await page.addInitScript(({ storageKey, values }) => {
    localStorage.setItem(storageKey, JSON.stringify({
      version: 2,
      ratings: values
    }));
  }, { storageKey: key, values: ratings });
}

async function expectModalFocusRoundTrip(page, opener, initialFocus) {
  await page.locator(opener).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator(initialFocus)).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => {
    const dialogElement = document.querySelector('dialog[open]');
    return dialogElement && dialogElement.contains(document.activeElement);
  })).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator(opener)).toBeFocused();
}

test('Lesson 49 certificate dialog contains focus and returns it', async ({ page }) => {
  await seedProgress(page, 'canran:l49:progress:v2',
    { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 });
  await page.goto('/lesson49/');
  await expectModalFocusRoundTrip(page, '#certBtn', '#certSave');
});

test('Lesson 50 certificate dialog contains focus and returns it', async ({ page }) => {
  await seedProgress(page, 'canran:l50:progress:v2',
    { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 });
  await page.goto('/lesson50/');
  await expectModalFocusRoundTrip(page, '#certBtn', '#certSave');
});

test('soundmark certificate dialog contains focus and returns it', async ({ page }) => {
  await seedProgress(page, 'canran:soundmark:progress:v2',
    { vs: 3, g1: 3, g2: 3, g3: 3 });
  await page.goto('/soundmark/');
  await page.locator('#certName').fill('小明');
  await expectModalFocusRoundTrip(page, '#btnOpenCert', '#certPrintAction');
});
```

- [ ] **Step 2: Run the tests and confirm all three dialog failures**

Run:

```bash
npm run test:e2e -- tests/e2e/accessibility.spec.js
```

Expected:

- Lesson 49 and Lesson 50 overlays are not native dialogs and do not restore focus;
- soundmark has no modal certificate experience.

- [ ] **Step 3: Convert Lesson 49 markup and CSS**

Make these three exact Lesson 49 tag changes while leaving the content between them in place:

1. Replace `<div id="certModal" class="hidden">` with
   `<dialog id="certModal" aria-modal="true" aria-labelledby="l49CertTitle">`.
2. Add `id="l49CertTitle"` to the existing `肉店小学徒 · 结业证书` `<h3>`.
3. Replace the closing tag paired with the old `#certModal` wrapper with `</dialog>`; keep the
   inner `#certCard` closing `</div>`.

Replace the existing `#certModal` CSS declaration with:

```css
#certModal{
  border:0;background:transparent;padding:16px;width:100%;max-width:none;height:100%;max-height:none;
  overflow-y:auto;
}
#certModal::backdrop{background:rgba(74,50,38,.6)}
#certModal:not([open]){display:none}
#certModal[open]{display:flex;align-items:center;justify-content:center}
```

Replace the print rule for `#certModal` with:

```css
@media print{
  body *{visibility:hidden}
  #certModal,#certModal *{visibility:visible}
  #certModal{display:block;position:absolute;inset:0;background:#fff}
  .cert-btns{display:none}
}
```

Before the Lesson 49 `#certBtn` handler, add:

```javascript
const l49CertDialog=$('#certModal');
let l49CertReturnFocus=$('#certBtn');
function openL49CertificateDialog(){
  l49CertReturnFocus=document.activeElement||$('#certBtn');
  l49CertDialog.showModal();
  requestAnimationFrame(()=>$('#certSave').focus());
}
function closeL49CertificateDialog(){
  if(l49CertDialog.open)l49CertDialog.close();
  (l49CertReturnFocus||$('#certBtn')).focus();
}
l49CertDialog.addEventListener('cancel',event=>{
  event.preventDefault();
  closeL49CertificateDialog();
});
l49CertDialog.addEventListener('click',event=>{
  if(event.target===l49CertDialog)closeL49CertificateDialog();
});
```

At the start of the existing `#certBtn` handler, retain the state-plan eligibility re-check. Replace
`$('#certModal').classList.remove('hidden')` with:

```javascript
openL49CertificateDialog();
```

Replace the close listeners with:

```javascript
$('#certClose').addEventListener('click',()=>{
  closeL49CertificateDialog();
  sndClick();
});
```

Delete the old `classList.add/remove('hidden')` and overlay-click listeners.

Replace the Lesson 49 save and print listeners with guarded handlers:

```javascript
$('#certSave').addEventListener('click',()=>{
  if(!canIssueL49Certificate()){
    closeL49CertificateDialog();
    renderL49CertificateGate();
    return;
  }
  sndClick();
  saveCertImage();
});
$('#certPrint').addEventListener('click',()=>{
  if(!canIssueL49Certificate()){
    closeL49CertificateDialog();
    renderL49CertificateGate();
    return;
  }
  window.print();
});
```

- [ ] **Step 4: Convert Lesson 50 markup, CSS, and handlers**

Make these three exact Lesson 50 tag changes while leaving the content between them in place:

1. Replace `<div id="certModal" class="hidden">` with
   `<dialog id="certModal" aria-modal="true" aria-labelledby="l50CertTitle">`.
2. Add `id="l50CertTitle"` to the existing `皇家营养小顾问 · 结业证书` `<h3>`.
3. Replace the closing tag paired with the old `#certModal` wrapper with `</dialog>`; keep the
   inner `#certCard` closing `</div>`.

Use this CSS:

```css
#certModal{
  border:0;background:transparent;padding:16px;width:100%;max-width:none;height:100%;max-height:none;
  overflow-y:auto;
}
#certModal::backdrop{background:rgba(74,50,38,.6)}
#certModal:not([open]){display:none}
#certModal[open]{display:flex;align-items:center;justify-content:center}
```

Use the same print rule shown in Step 3.

Before the Lesson 50 `#certBtn` handler, add:

```javascript
const l50CertDialog=$('#certModal');
let l50CertReturnFocus=$('#certBtn');
function openL50CertificateDialog(){
  l50CertReturnFocus=document.activeElement||$('#certBtn');
  l50CertDialog.showModal();
  requestAnimationFrame(()=>$('#certSave').focus());
}
function closeL50CertificateDialog(){
  if(l50CertDialog.open)l50CertDialog.close();
  (l50CertReturnFocus||$('#certBtn')).focus();
}
l50CertDialog.addEventListener('cancel',event=>{
  event.preventDefault();
  closeL50CertificateDialog();
});
l50CertDialog.addEventListener('click',event=>{
  if(event.target===l50CertDialog)closeL50CertificateDialog();
});
```

Retain the state-plan eligibility guard. Replace the show/hide class mutations with:

```javascript
openL50CertificateDialog();
```

and:

```javascript
$('#certClose').addEventListener('click',()=>{
  closeL50CertificateDialog();
  sndClick();
});
```

Replace the Lesson 50 save and print listeners with guarded handlers:

```javascript
$('#certSave').addEventListener('click',()=>{
  if(!canIssueL50Certificate()){
    closeL50CertificateDialog();
    renderL50CertificateGate();
    return;
  }
  sndClick();
  saveCertImage();
});
$('#certPrint').addEventListener('click',()=>{
  if(!canIssueL50Certificate()){
    closeL50CertificateDialog();
    renderL50CertificateGate();
    return;
  }
  window.print();
});
```

- [ ] **Step 5: Convert soundmark certificate markup and behavior**

Replace the complete soundmark `section#cert` with:

```html
<section id="cert">
  <span class="tag">终点</span>
  <h2 class="sec-title">音标小达人毕业证书</h2>
  <p class="sec-sub" style="margin:0 auto">集满 12 颗星，写下名字后查看并打印证书。</p>
  <div class="cert-entry">
    <input id="certName" placeholder="写下你的名字" maxlength="12">
    <button class="btn" id="btnOpenCert">查看我的证书</button>
    <div id="certNeed" role="status" aria-live="polite"></div>
  </div>
  <dialog id="certModal" aria-modal="true" aria-labelledby="soundmarkCertTitle">
    <div id="certCard">
      <h3 id="soundmarkCertTitle">毕业证书</h3>
      <div style="font-size:15px;opacity:.7">CERTIFICATE OF PHONICS EXPLORER</div>
      <div style="margin-top:16px;font-size:17px">兹证明</div>
      <div id="certNameOut">音标小达人</div>
      <div style="font-size:17px">在音标魔法乐园闯过所有关卡，学会 6 个元音，<br>荣获 <b style="color:var(--tangerine)">音标小达人</b> 称号！</div>
      <div id="certStars"></div>
      <div style="font-size:14px;opacity:.6" id="certDate"></div>
      <div class="stamp">音标<br>小达人</div>
      <div class="cert-btns">
        <button class="btn" id="certPrintAction">打印证书</button>
        <button class="btn alt" id="certClose">关闭</button>
      </div>
    </div>
  </dialog>
</section>
```

Replace the soundmark certificate CSS with:

```css
#cert{text-align:center}
.cert-entry{display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:26px}
#certName{
  font-family:'ZCOOL KuaiLe';font-size:24px;border:3px solid var(--ink);border-radius:14px;
  background:#fff;text-align:center;width:min(320px,85vw);color:var(--berry);padding:9px 14px;
}
#certModal{
  border:0;background:transparent;padding:16px;width:100%;max-width:none;height:100%;max-height:none;
  overflow-y:auto;
}
#certModal::backdrop{background:rgba(43,33,24,.72)}
#certModal:not([open]){display:none}
#certModal[open]{display:flex;align-items:center;justify-content:center}
#certCard{
  background:linear-gradient(0deg,#fff,#fff),var(--paper);
  border:4px solid var(--ink);border-radius:24px;box-shadow:10px 10px 0 var(--ink);
  padding:44px 30px;max-width:640px;width:100%;margin:auto;position:relative;text-align:center;
}
#certCard::before{content:"";position:absolute;inset:10px;border:2.5px dashed var(--ink);border-radius:16px;pointer-events:none}
#certCard h3{font-size:34px;margin-bottom:6px}
#certNameOut{font-family:'ZCOOL KuaiLe';font-size:30px;color:var(--berry);margin:8px 0}
#certStars{font-size:clamp(22px,6.4vw,34px);letter-spacing:clamp(1px,.8vw,4px);margin:8px 0;min-height:44px;max-width:100%;overflow-wrap:anywhere}
#certCard .stamp{
  position:absolute;right:26px;bottom:24px;width:96px;height:96px;border:4px solid var(--berry);
  border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--berry);
  font-family:'ZCOOL KuaiLe';font-size:19px;transform:rotate(12deg);opacity:.85;background:rgba(232,68,107,.06);
}
.cert-btns{display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap}
@media print{
  body *{visibility:hidden}
  #certModal,#certModal *{visibility:visible}
  #certModal{display:block;position:absolute;inset:0;background:#fff}
  .cert-btns{display:none}
}
```

Add this soundmark controller:

```javascript
const soundmarkCertDialog=document.getElementById('certModal');
let soundmarkCertReturnFocus=document.getElementById('btnOpenCert');
function openSoundmarkCertificateDialog(){
  soundmarkCertReturnFocus=document.activeElement||document.getElementById('btnOpenCert');
  soundmarkCertDialog.showModal();
  requestAnimationFrame(()=>document.getElementById('certPrintAction').focus());
}
function closeSoundmarkCertificateDialog(){
  if(soundmarkCertDialog.open)soundmarkCertDialog.close();
  (soundmarkCertReturnFocus||document.getElementById('btnOpenCert')).focus();
}
soundmarkCertDialog.addEventListener('cancel',event=>{
  event.preventDefault();
  closeSoundmarkCertificateDialog();
});
soundmarkCertDialog.addEventListener('click',event=>{
  if(event.target===soundmarkCertDialog)closeSoundmarkCertificateDialog();
});
document.getElementById('certClose').onclick=closeSoundmarkCertificateDialog;

document.getElementById('btnOpenCert').onclick=()=>{
  const name=document.getElementById('certName').value.trim();
  if(!canIssueSoundmarkCertificate()){
    renderStars();
    toast('集满 12 颗星后才能领取证书');
    return;
  }
  if(!name){
    toast('先写上你的名字哦');
    document.getElementById('certName').focus();
    return;
  }
  document.getElementById('certNameOut').textContent=name;
  document.getElementById('certDate').textContent='日期：'+new Date().toLocaleDateString('zh-CN');
  openSoundmarkCertificateDialog();
};

document.getElementById('certPrintAction').onclick=()=>{
  if(!canIssueSoundmarkCertificate()){
    closeSoundmarkCertificateDialog();
    renderStars();
    toast('集满 12 颗星后才能打印证书');
    return;
  }
  celebrate(document.getElementById('certCard'));
  window.print();
};
```

In soundmark `renderStars`, gate `#btnOpenCert` instead of the removed `#btnPrint`:

```javascript
document.getElementById('btnOpenCert').disabled=!canIssueSoundmarkCertificate();
```

Delete the old `btnPrint.onclick` handler.

- [ ] **Step 6: Update the soundmark print regression**

In `tests/e2e/soundmark-progress.spec.js`, replace `#btnPrint` assertions/actions with:

```javascript
await expect(page.locator('#btnOpenCert')).toBeEnabled();
await page.locator('#btnOpenCert').click();
await expect(page.getByRole('dialog')).toBeVisible();
await page.locator('#certPrintAction').click();
```

In the eleven-star test, replace:

```javascript
await expect(page.locator('#btnPrint')).toBeDisabled();
```

with:

```javascript
await expect(page.locator('#btnOpenCert')).toBeDisabled();
```

Replace the eleven-star test's manual-tamper block with:

```javascript
await page.locator('#btnOpenCert').evaluate(button => { button.disabled = false; });
await page.locator('#certName').fill('小明');
await page.locator('#btnOpenCert').click();
await expect(page.getByRole('dialog')).not.toBeVisible();
expect(await page.evaluate(() => window.__printed)).toBe(false);
```

- [ ] **Step 7: Run and commit all certificate dialog tests**

Run:

```bash
npm run test:e2e -- tests/e2e/accessibility.spec.js tests/e2e/certificate-export.spec.js tests/e2e/l49-progress.spec.js tests/e2e/l50-assessment.spec.js tests/e2e/soundmark-progress.spec.js
```

Expected: all tests pass, including Escape close, focus return, certificate gating, Blob save, and
soundmark printing.

Commit:

```bash
git add lesson49/index.html lesson50/index.html soundmark/index.html tests/e2e
git commit -m "fix: make certificate dialogs keyboard modal"
```

---

### Task 4: Vendor fonts and remove runtime Google Fonts requests

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `scripts/vendor-fonts.js`
- Create: `assets/fonts/fonts.css`
- Create: `assets/fonts/*.woff2`
- Create: `assets/fonts/LICENSE-*.txt`
- Modify: `index.html`
- Modify: `lesson49/index.html`
- Modify: `lesson50/index.html`
- Modify: `soundmark/index.html`
- Modify: `deploy/nginx/canranstudio-http.conf`
- Modify: `tests/deploy/nginx-config.test.js`
- Create: `tests/e2e/local-fonts.spec.js`
- Modify: `tests/support/static-server.js`

**Pinned build-time packages:**
- `@fontsource/baloo-2@5.3.0`
- `@fontsource/zcool-kuaile@5.3.0`
- `@fontsource/fredoka@5.3.0`

- [ ] **Step 1: Write the failing same-origin font test**

Create `tests/e2e/local-fonts.spec.js`:

```javascript
'use strict';

const { test, expect } = require('@playwright/test');

for (const path of ['/', '/lesson49/', '/lesson50/', '/soundmark/']) {
  test(`${path} loads its selected fonts without Google requests`, async ({ page }) => {
    const externalFonts = [];
    page.on('request', request => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) {
        externalFonts.push(request.url());
      }
    });

    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);

    expect(externalFonts).toEqual([]);
    const checks = await page.evaluate(() => ({
      zcool: document.fonts.check('16px "ZCOOL KuaiLe"'),
      display: location.pathname === '/soundmark/'
        ? document.fonts.check('16px "Fredoka"')
        : document.fonts.check('16px "Baloo 2"')
    }));
    expect(checks).toEqual({ zcool: true, display: true });
  });
}
```

- [ ] **Step 2: Run the test and confirm Google requests are still present**

Run:

```bash
npm run test:e2e -- tests/e2e/local-fonts.spec.js
```

Expected: all four tests fail because the pages still request Google Fonts.

- [ ] **Step 3: Install pinned build-time font sources**

Run:

```bash
npm install --save-dev \
  @fontsource/baloo-2@5.3.0 \
  @fontsource/zcool-kuaile@5.3.0 \
  @fontsource/fredoka@5.3.0
```

Expected: `package.json` and `package-lock.json` pin all three packages at `5.3.0`.

- [ ] **Step 4: Create the font-vendoring script**

Create `scripts/vendor-fonts.js`:

```javascript
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets/fonts');
const COPIES = [
  ['@fontsource/baloo-2/files/baloo-2-latin-500-normal.woff2', 'baloo-2-latin-500.woff2'],
  ['@fontsource/baloo-2/files/baloo-2-latin-700-normal.woff2', 'baloo-2-latin-700.woff2'],
  ['@fontsource/baloo-2/files/baloo-2-latin-800-normal.woff2', 'baloo-2-latin-800.woff2'],
  ['@fontsource/zcool-kuaile/files/zcool-kuaile-latin-400-normal.woff2', 'zcool-kuaile-latin-400.woff2'],
  ['@fontsource/zcool-kuaile/files/zcool-kuaile-chinese-simplified-400-normal.woff2', 'zcool-kuaile-chinese-simplified-400.woff2'],
  ['@fontsource/fredoka/files/fredoka-latin-400-normal.woff2', 'fredoka-latin-400.woff2'],
  ['@fontsource/fredoka/files/fredoka-latin-500-normal.woff2', 'fredoka-latin-500.woff2'],
  ['@fontsource/fredoka/files/fredoka-latin-600-normal.woff2', 'fredoka-latin-600.woff2'],
  ['@fontsource/fredoka/files/fredoka-latin-700-normal.woff2', 'fredoka-latin-700.woff2'],
  ['@fontsource/baloo-2/LICENSE', 'LICENSE-Baloo-2.txt'],
  ['@fontsource/zcool-kuaile/LICENSE', 'LICENSE-ZCOOL-KuaiLe.txt'],
  ['@fontsource/fredoka/LICENSE', 'LICENSE-Fredoka.txt']
];

const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const CJK = 'U+2E80-2EFF,U+2F00-2FDF,U+3000-303F,U+31C0-31EF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FFEF';

function face(family, file, weight, range) {
  return [
    '@font-face {',
    `  font-family: '${family}';`,
    '  font-style: normal;',
    `  font-weight: ${weight};`,
    '  font-display: swap;',
    `  src: url('./${file}') format('woff2');`,
    `  unicode-range: ${range};`,
    '}',
    ''
  ].join('\n');
}

async function vendorFonts() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });
  for (const [modulePath, target] of COPIES) {
    const source = path.join(ROOT, 'node_modules', modulePath);
    await fs.copyFile(source, path.join(OUT, target));
  }
  const css = [
    face('Baloo 2', 'baloo-2-latin-500.woff2', 500, LATIN),
    face('Baloo 2', 'baloo-2-latin-700.woff2', 700, LATIN),
    face('Baloo 2', 'baloo-2-latin-800.woff2', 800, LATIN),
    face('ZCOOL KuaiLe', 'zcool-kuaile-latin-400.woff2', 400, LATIN),
    face('ZCOOL KuaiLe', 'zcool-kuaile-chinese-simplified-400.woff2', 400, CJK),
    face('Fredoka', 'fredoka-latin-400.woff2', 400, LATIN),
    face('Fredoka', 'fredoka-latin-500.woff2', 500, LATIN),
    face('Fredoka', 'fredoka-latin-600.woff2', 600, LATIN),
    face('Fredoka', 'fredoka-latin-700.woff2', 700, LATIN)
  ].join('\n');
  await fs.writeFile(path.join(OUT, 'fonts.css'), css);
}

vendorFonts().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
```

Add to `package.json`:

```json
{
  "vendor:fonts": "node scripts/vendor-fonts.js"
}
```

Run:

```bash
npm run vendor:fonts
```

Expected: all listed WOFF2 files, `fonts.css`, and three license files exist in `assets/fonts/`.

- [ ] **Step 5: Switch all four pages to the local stylesheet**

In each of:

- `index.html`
- `lesson49/index.html`
- `lesson50/index.html`
- `soundmark/index.html`

delete every Google Fonts `preconnect` and stylesheet tag, then add immediately after `<title>`:

```html
<link rel="stylesheet" href="/assets/fonts/fonts.css">
```

In `tests/support/static-server.js`, add the WOFF2 MIME mapping to `TYPES`:

```javascript
'.woff2': 'font/woff2',
```

- [ ] **Step 6: Narrow the HTTP CSP and its policy test**

In `deploy/nginx/canranstudio-http.conf`, replace the CSP value with:

```nginx
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'" always;
```

Append to the security-header test in `tests/deploy/nginx-config.test.js`:

```javascript
  assert.doesNotMatch(config, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.match(config, /font-src 'self' data:/);
```

- [ ] **Step 7: Run font, CSP, artifact, and Nginx checks**

Run:

```bash
npm run test:e2e -- tests/e2e/local-fonts.spec.js
npm run test:deploy
npm run build:static
test -f dist/assets/fonts/fonts.css
docker run --rm \
  -v "$PWD/deploy/nginx/canranstudio-http.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:1.28.0-alpine nginx -t
rg -n "fonts\\.googleapis\\.com|fonts\\.gstatic\\.com" \
  index.html lesson49/index.html lesson50/index.html soundmark/index.html deploy/nginx
```

Expected:

- local-font tests pass;
- deployment tests and Nginx syntax pass;
- the built artifact contains fonts;
- the final search prints no matches.

- [ ] **Step 8: Commit the vendored fonts**

```bash
git add package.json package-lock.json scripts/vendor-fonts.js assets/fonts \
  index.html lesson49/index.html lesson50/index.html soundmark/index.html \
  deploy/nginx/canranstudio-http.conf tests/deploy/nginx-config.test.js \
  tests/e2e/local-fonts.spec.js tests/support/static-server.js
git commit -m "build: self-host course fonts"
```

---

### Task 5: Update documentation and run the final local release gate

**Files:**
- Modify: `README.md`
- Modify: `lesson49/README.md`
- Modify: `lesson50/README.md`
- Modify: `soundmark/README.md`
- Modify: `tests/README.md`
- Modify: `.github/workflows/verify.yml`

- [ ] **Step 1: Update page and test documentation**

Document these exact facts:

- runtime remains static and package-free;
- `npm run vendor:fonts` regenerates committed font assets from pinned Fontsource packages;
- WOFF2 files and OFL license copies are under `assets/fonts/`;
- all certificate issue/print/save handlers re-check their eligibility;
- Lesson 49 uses Blob certificate export and revokes every object URL;
- the three certificate experiences are native modal dialogs;
- live feedback uses polite atomic status regions.

Add these targeted commands to `tests/README.md`:

```markdown
npm run test:e2e -- tests/e2e/certificate-export.spec.js
npm run test:e2e -- tests/e2e/accessibility.spec.js
npm run test:e2e -- tests/e2e/local-fonts.spec.js
```

- [ ] **Step 2: Ensure CI regenerates fonts before browser and artifact tests**

After `npm ci` and before browser tests in `.github/workflows/verify.yml`, add:

```yaml
      - run: npm run vendor:fonts
      - run: git diff --exit-code -- assets/fonts
```

The diff check ensures committed font assets match the pinned packages and vendoring script.

- [ ] **Step 3: Run the complete verification suite**

Run:

```bash
npm ci
npm run vendor:fonts
git diff --exit-code -- assets/fonts
npm run test:unit
npm run test:e2e
npm run test:deploy
npm run build:static
docker run --rm \
  -v "$PWD/deploy/nginx/canranstudio-http.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:1.28.0-alpine nginx -t
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 4: Perform focused manual keyboard checks**

In Chromium with the repository static server:

1. Tab to the first Lesson 49 flip card, use Enter and Space, and confirm the visible face and
   announced expanded state agree.
2. Open each certificate dialog, cycle Tab and Shift+Tab, press Escape, and confirm focus returns to
   the opening button.
3. In Lesson 49, save a certificate, close the image overlay, and confirm the overlay disappears.
4. With the network panel filtered to `font`, confirm every request starts with
   `http://127.0.0.1:4173/assets/fonts/`.

Record these as manual verification evidence; do not replace the automated tests with this step.

- [ ] **Step 5: Commit documentation and CI**

```bash
git add README.md lesson49/README.md lesson50/README.md soundmark/README.md \
  tests/README.md .github/workflows/verify.yml
git commit -m "docs: record hardening verification contract"
```

## Final Plan Exit Gate

Run:

```bash
npm test
npm run test:deploy
npm run build:static
git status --short
git rev-parse HEAD
```

Expected:

- the full test suite passes;
- deployment policy and static artifact tests pass;
- the worktree is clean;
- `dist/release-manifest.json` names the printed commit SHA;
- all four pages load fonts from `/assets/fonts/`;
- RISK-HTTP-01 is still recorded as accepted/deferred until the transport decision changes.

Only after this gate may the exact `dist/` artifact proceed through
`deploy/README.md` and `npm run verify:live:http`.
