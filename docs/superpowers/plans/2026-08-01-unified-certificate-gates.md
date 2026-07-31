# 五门课程统一证书门槛实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 Lesson 49、50、51、54 和音标番外篇从课程初始状态起都提供同款 Lesson 51 票券式证书门槛，并把编号课资格统一为 15/15 星、音标保持 12/12 星。

**Architecture:** 新增一个可被浏览器和 Node 共用的 `CanranCore.certificateGate` UMD 模块，集中计算资格、生成票券、管理 ARIA/焦点和首个未满星跳转；五个课程页只提供实时评级、目标映射、课程主题和原证书回调。共享 CSS 是票券视觉的唯一来源，各课程原有证书弹窗、保存和打印实现继续保留，并在每次敏感动作前复核满星资格。

**Tech Stack:** 静态 HTML/CSS/JavaScript、现有 `CanranCore` UMD 模块、Node.js 20 内置测试、Playwright 1.62、现有静态构建与 HTTP 发布流程。

## Global Constraints

- 视觉真源固定为 `/Users/sunnywinter/.codex/visualizations/2026/07/29/019fad15-e13e-74b0-be3f-883cdae4e180/.superpowers/brainstorm/66403-1785522637/content/certificate-ticket-family-l51-style-v2.html`。
- 五门课程直接共用 `core/certificate-gate.js` 和 `core/certificate-gate.css`；Lesson 51 不保留单独票券实现。
- Lesson 49、50、51、54 只有五项评级全部为 3 星，即 15/15 星，才能预览、保存或打印证书。
- 音标番外篇只有 `vs`、`g1`、`g2`、`g3` 全部为 3 星，即 12/12 星，才能预览或打印证书。
- 证书入口始终可见、可聚焦、可点击；锁定入口不得使用 `disabled` 或 `aria-disabled="true"`。
- 票券固定使用 `#fffdf5` 暖白票面、`#2f271f` 三像素深色边框、左右缺口、右下实体阴影和相同双按钮布局。
- 强调色固定为 Lesson 49 `#c43f36`、Lesson 50 `#7250b5`、Lesson 51 `#1d6fb8`、Lesson 54 `#167d92`、音标 `#ef7047`。
- 主句固定为 `还差 N 颗星，还有 X 关未满星。`；音标使用 `还差 N 颗星，还有 X 项挑战未满星。`。
- 第二行固定为 `下一步：回到「目标」补齐三星`；主操作固定为 `前往「目标」补满星`；次操作固定为 `稍后再说`。
- 保留全部现有存储键、进度版本、历史最高评级和关卡 1/2/3 星算法；不清空或迁移现有评级。
- 入口、证书弹窗内的保存和打印动作都必须读取当前内存评级并重新校验，DOM 属性不能授权证书。
- 不新增后端、账户、跨设备同步、框架、第三方运行时依赖或图片资产。
- 生产继续使用 `http://59.110.217.36`；不配置 HTTPS、HSTS、HTTPS 跳转或 ICP 相关功能。
- 实施开始时必须先通过 `superpowers:using-git-worktrees` 从本规格与计划所在提交创建隔离工作树，不在当前主检出目录直接开发。

## File Structure

| 文件 | 责任 |
| --- | --- |
| `core/certificate-gate.js` | 评级归一化、满星资格、动态票券、ARIA、焦点、跳转和最终入口校验 |
| `core/certificate-gate.css` | 五页唯一共用的票券、锁定态、响应式、焦点和打印隐藏样式 |
| `tests/unit/certificate-gate.test.js` | 15/15、12/12、损坏值、缺星统计和首个未满星顺序 |
| `lesson49/index.html` | 肉店课程配置与原证书弹窗/PNG/打印回调 |
| `lesson50/index.html` | 小王子课程配置与原证书弹窗/PNG/打印回调 |
| `lesson51/index.html` | 迁移现有票券到共享控制器并改为 15/15 |
| `lesson54/index.html` | 环球课程配置与原页面打印回调 |
| `soundmark/index.html` | 音标配置、游戏标签预激活和原证书弹窗/打印回调 |
| `tests/e2e/l49-progress.spec.js` | Lesson 49 常驻入口、满星边界、票券与跳转 |
| `tests/e2e/l50-assessment.spec.js` | Lesson 50 常驻入口、满星边界、票券与跳转 |
| `tests/e2e/l51-progress.spec.js` | Lesson 51 共享迁移、15 星、动态刷新与打印 |
| `tests/e2e/l54-progress.spec.js` | Lesson 54 新增的完整证书门槛覆盖 |
| `tests/e2e/soundmark-progress.spec.js` | 11/12 锁定、游戏标签跳转和 12/12 原流程 |
| `tests/e2e/certificate-gates.spec.js` | 五页共同结构、390 像素、异常目标和打印隐藏合同 |
| `tests/e2e/accessibility.spec.js` | 弹窗资格丢失、实时播报与焦点回归 |
| `tests/deploy/static-build.test.js` | 共享 JS/CSS 被复制并进入精确哈希清单 |
| `package.json` | 把 Lesson 54 状态套件加入 `test:state` |
| `docs/superpowers/qa/2026-08-01-unified-certificate-gates.md` | 五页高保真对比、移动端、交互与控制台证据 |

---

### Task 1: 建立共享证书门槛模块

**Files:**
- Create: `core/certificate-gate.js`
- Create: `core/certificate-gate.css`
- Create: `tests/unit/certificate-gate.test.js`

**Interfaces:**
- Produces: `CanranCore.certificateGate.completionState(ratings, targets)`。
- Produces: `CanranCore.certificateGate.create(options)`，返回 `{ refresh, open, close, attempt, navigate, getState, destroy }`。
- `targets` 的精确形状为 `{ id: string, selector: string, label: string, focusSelector?: string, hash?: string }`。
- `options` 消费 `trigger`、`mount`、`status`、`getRatings`、`targets`、`courseName`、`icon`、`accent`、`pageColor`、`itemLabel`、`readyMessage`、`onEligible` 和可选 `beforeNavigate`。

- [ ] **Step 1: 写出失败的纯计算测试**

创建 `tests/unit/certificate-gate.test.js`：

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { completionState } = require('../../core/certificate-gate');

const LESSON_TARGETS = [
  { id: 'l1', selector: '#l1', label: '单词' },
  { id: 'l2', selector: '#l2', label: '课文' },
  { id: 'l3', selector: '#l3', label: '句型' },
  { id: 'l4', selector: '#l4', label: '语法' },
  { id: 'l5', selector: '#l5', label: '考核' }
];

test('numbered lesson requires fifteen stars and reports the first incomplete target', () => {
  const state = completionState(
    { l1: 3, l2: 2, l3: 3, l4: 0, l5: 3 },
    LESSON_TARGETS
  );
  assert.equal(state.eligible, false);
  assert.equal(state.earnedStars, 11);
  assert.equal(state.maxStars, 15);
  assert.equal(state.missingStars, 4);
  assert.equal(state.incompleteCount, 2);
  assert.equal(state.firstIncomplete.id, 'l2');
  assert.equal(state.firstIncomplete.label, '课文');
});

test('only three stars in every numbered target is eligible', () => {
  assert.equal(completionState(
    { l1: 3, l2: 3, l3: 3, l4: 3, l5: 2 },
    LESSON_TARGETS
  ).eligible, false);
  assert.equal(completionState(
    { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 },
    LESSON_TARGETS
  ).eligible, true);
});

test('soundmark requires twelve stars', () => {
  const targets = ['vs', 'g1', 'g2', 'g3'].map(id => ({
    id, selector: `#${id}`, label: id
  }));
  assert.equal(completionState({ vs: 3, g1: 3, g2: 3, g3: 2 }, targets).eligible, false);
  assert.equal(completionState({ vs: 3, g1: 3, g2: 3, g3: 3 }, targets).eligible, true);
});

test('missing and malformed ratings safely normalize to zero through three', () => {
  const state = completionState(
    { l1: 999, l2: 2.9, l3: '3', l4: Infinity, l5: -4 },
    LESSON_TARGETS
  );
  assert.equal(state.earnedStars, 5);
  assert.equal(state.missingStars, 10);
  assert.equal(state.incompleteCount, 4);
  assert.equal(state.firstIncomplete.id, 'l2');
});
```

- [ ] **Step 2: 运行测试并确认 RED**

Run:

```bash
node --test tests/unit/certificate-gate.test.js
```

Expected: FAIL with `Cannot find module '../../core/certificate-gate'`。

- [ ] **Step 3: 实现 UMD 模块与精确公共接口**

创建 `core/certificate-gate.js`，使用与 `core/progress.js` 相同的 UMD 外壳。计算层必须实现以下逻辑：

```js
(function attachCertificateGate(root,factory){
  'use strict';
  const api=factory(root||{});
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root){
    root.CanranCore=root.CanranCore||{};
    root.CanranCore.certificateGate=api;
  }
})(typeof globalThis!=='undefined'?globalThis:this,function certificateGateFactory(root){
  'use strict';

function clampRating(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(3, Math.trunc(value)));
}

function normalizeTargets(targets) {
  if (!Array.isArray(targets) || targets.length === 0) {
    throw new TypeError('certificate gate requires at least one target');
  }
  return targets.map(target => {
    if (!target || typeof target.id !== 'string' || !target.id ||
        typeof target.selector !== 'string' || !target.selector ||
        typeof target.label !== 'string' || !target.label) {
      throw new TypeError('certificate gate target is invalid');
    }
    return Object.freeze({
      id: target.id,
      selector: target.selector,
      label: target.label,
      focusSelector: typeof target.focusSelector === 'string' ? target.focusSelector : '',
      hash: typeof target.hash === 'string' && target.hash ? target.hash : target.selector
    });
  });
}

function completionState(ratings, targets) {
  const ordered = normalizeTargets(targets);
  const source = ratings && typeof ratings === 'object' && !Array.isArray(ratings)
    ? ratings
    : {};
  const entries = ordered.map(target => ({
    target,
    rating: clampRating(source[target.id])
  }));
  const earnedStars = entries.reduce((sum, entry) => sum + entry.rating, 0);
  const incomplete = entries.filter(entry => entry.rating < 3);
  const maxStars = ordered.length * 3;
  return Object.freeze({
    eligible: incomplete.length === 0,
    earnedStars,
    maxStars,
    missingStars: maxStars - earnedStars,
    incompleteCount: incomplete.length,
    firstIncomplete: incomplete.length ? incomplete[0].target : null
  });
}
```

`create(options)` 必须按以下 DOM 和行为合同实现，且导入模块时不能访问 `document`：

```js
function requiredElement(value, label) {
  if (!value || typeof value.addEventListener !== 'function') {
    throw new TypeError(`${label} must be a DOM element`);
  }
  return value;
}

function create(options = {}) {
  const trigger = requiredElement(options.trigger, 'trigger');
  const mount = requiredElement(options.mount, 'mount');
  const status = requiredElement(options.status, 'status');
  const documentRef = trigger.ownerDocument;
  const targets = normalizeTargets(options.targets);
  const getRatings = typeof options.getRatings === 'function'
    ? options.getRatings
    : () => ({});
  const onEligible = typeof options.onEligible === 'function'
    ? options.onEligible
    : () => false;
  const beforeNavigate = typeof options.beforeNavigate === 'function'
    ? options.beforeNavigate
    : () => true;
  const courseName = String(options.courseName || '课程');
  const icon = String(options.icon || '🎓');
  const accent = String(options.accent || '#1d6fb8');
  const pageColor = String(options.pageColor || '#f7f0df');
  const itemLabel = options.itemLabel === '项挑战' ? '项挑战' : '关';
  const readyMessage = String(options.readyMessage || '星星已集齐，可以领取证书。');

  if (!trigger.id) throw new TypeError('certificate trigger requires an id');
  if (!mount.id) mount.id = `${trigger.id}GatePanel`;
  if (!status.id) status.id = `${trigger.id}GateStatus`;

mount.classList.add('certificate-gate-shell');
mount.dataset.certificateGate = '';
mount.hidden = true;
mount.style.setProperty('--certificate-gate-accent', accent);
mount.style.setProperty('--certificate-gate-page', pageColor);
mount.innerHTML = [
  '<p class="certificate-gate-course">',
  '  <span data-certificate-icon aria-hidden="true"></span>',
  '  <span data-certificate-course></span>',
  '</p>',
  '<div class="certificate-gate-ticket">',
  '  <p class="certificate-gate-count" data-certificate-count></p>',
  '  <p class="certificate-gate-next">下一步：回到 <strong data-certificate-target></strong> 补齐三星</p>',
  '  <div class="certificate-gate-buttons">',
  '    <button type="button" class="certificate-gate-button certificate-gate-primary" data-certificate-go></button>',
  '    <button type="button" class="certificate-gate-button certificate-gate-dismiss" data-certificate-dismiss>稍后再说</button>',
  '  </div>',
  '</div>'
].join('');

  const count = mount.querySelector('[data-certificate-count]');
  const targetName = mount.querySelector('[data-certificate-target]');
  const go = mount.querySelector('[data-certificate-go]');
  const dismiss = mount.querySelector('[data-certificate-dismiss]');
  mount.querySelector('[data-certificate-icon]').textContent = icon;
  mount.querySelector('[data-certificate-course]').textContent = courseName;

  trigger.classList.add('certificate-gate-trigger');
  trigger.setAttribute('aria-controls', mount.id);
  trigger.setAttribute('aria-describedby', status.id);
  trigger.setAttribute('aria-expanded', 'false');
  status.classList.add('certificate-gate-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  for (const target of targets) {
    const element = documentRef.querySelector(target.selector);
    if (element) element.classList.add('certificate-gate-jump-target');
  }
```

控制器内部方法必须使用同一组名字和语义：

```js
function formatCount(state) {
  return itemLabel === '项挑战'
    ? `还差 ${state.missingStars} 颗星，还有 ${state.incompleteCount} 项挑战未满星。`
    : `还差 ${state.missingStars} 颗星，还有 ${state.incompleteCount} 关未满星。`;
}

function close({ restoreFocus = false } = {}) {
  mount.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus && trigger.isConnected) trigger.focus();
}

function refresh() {
  const state = completionState(getRatings(), targets);
  trigger.disabled = false;
  trigger.removeAttribute('aria-disabled');
  trigger.dataset.certificateState = state.eligible ? 'ready' : 'locked';
  trigger.classList.toggle('is-locked', !state.eligible);
  status.textContent = state.eligible ? readyMessage : formatCount(state);
  count.textContent = formatCount(state);
  if (state.firstIncomplete) {
    targetName.textContent = `「${state.firstIncomplete.label}」`;
    go.textContent = `前往「${state.firstIncomplete.label}」补满星`;
  }
  if (state.eligible) close();
  return state;
}

function open() {
  const state = refresh();
  if (state.eligible) return false;
  mount.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  go.focus();
  return true;
}

function attempt(event) {
  if (event) event.preventDefault();
  const state = refresh();
  if (!state.eligible) return open();
  return onEligible(state);
}

async function navigate() {
  const state = completionState(getRatings(), targets);
  if (state.eligible) {
    refresh();
    close();
    return false;
  }
  const target = state.firstIncomplete;
  await beforeNavigate(target);
  const targetElement = documentRef.querySelector(target.selector);
  if (!targetElement) {
    status.textContent = '暂时找不到目标关卡，请使用课程导航。';
    mount.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    go.focus();
    return false;
  }
  close();
  if (target.hash.startsWith('#') && root.location) root.location.hash = target.hash.slice(1);
  const requestedFocus = target.focusSelector
    ? targetElement.querySelector(target.focusSelector)
    : null;
  const focusElement = requestedFocus || targetElement.querySelector('h2,h3') || targetElement;
  if (!focusElement.hasAttribute('tabindex')) focusElement.setAttribute('tabindex', '-1');
  focusElement.focus({ preventScroll: true });
  targetElement.scrollIntoView({
    block: 'start',
    behavior: root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'
  });
  return true;
}
```

在 `create` 的结尾使用以下精确绑定和返回对象：

```js
  const handleAttempt = event => attempt(event);
  const handleNavigate = () => { void navigate(); };
  const handleDismiss = () => close({ restoreFocus: true });
  trigger.addEventListener('click', handleAttempt);
  go.addEventListener('click', handleNavigate);
  dismiss.addEventListener('click', handleDismiss);
  refresh();

  return Object.freeze({
    refresh,
    open,
    close,
    attempt,
    navigate,
    getState: () => completionState(getRatings(), targets),
    destroy() {
      trigger.removeEventListener('click', handleAttempt);
      go.removeEventListener('click', handleNavigate);
      dismiss.removeEventListener('click', handleDismiss);
      close();
    }
  });
}

return Object.freeze({ completionState, create });
});
```

- [ ] **Step 4: 创建唯一共享票券样式**

创建 `core/certificate-gate.css`，实现以下固定结构；五个课程页不得复制这些规则：

```css
.certificate-gate-trigger.is-locked{filter:saturate(.78);cursor:pointer}
.certificate-gate-trigger:focus-visible,
.certificate-gate-button:focus-visible{outline:4px solid #ffc93c;outline-offset:4px}
.certificate-gate-status{display:block;min-height:24px;margin:8px 0 0;font-family:'ZCOOL KuaiLe',sans-serif;font-size:16px}
.certificate-gate-shell{--certificate-gate-accent:#1d6fb8;--certificate-gate-page:#f7f0df;width:min(620px,calc(100% - 36px));margin:18px auto 0;color:#2f271f}
.certificate-gate-shell[hidden]{display:none!important}
.certificate-gate-course{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 0 10px;font-family:'ZCOOL KuaiLe',sans-serif;font-size:15px;font-weight:800;color:#4e443b}
.certificate-gate-course [data-certificate-icon]{font-size:20px}
.certificate-gate-ticket{position:relative;padding:18px 19px;background:#fffdf5;border:3px solid #2f271f;border-radius:14px;box-shadow:7px 7px 0 #2f271f}
.certificate-gate-ticket::before,
.certificate-gate-ticket::after{content:'';position:absolute;top:50%;z-index:1;width:28px;height:28px;background:var(--certificate-gate-page);border:3px solid #2f271f;border-radius:50%;transform:translateY(-50%);pointer-events:none}
.certificate-gate-ticket::before{left:-15px;clip-path:inset(0 0 0 50%)}
.certificate-gate-ticket::after{right:-15px;clip-path:inset(0 50% 0 0)}
.certificate-gate-count{position:relative;z-index:2;margin:0 0 5px;text-align:center;font-family:'ZCOOL KuaiLe',sans-serif;font-size:20px;line-height:1.4;font-weight:800}
.certificate-gate-next{position:relative;z-index:2;margin:0 0 13px;text-align:center;color:#6b6056;font-size:13px;line-height:1.45}
.certificate-gate-next strong{color:var(--certificate-gate-accent)}
.certificate-gate-buttons{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:14px}
.certificate-gate-button{display:flex;align-items:center;justify-content:center;min-height:42px;padding:9px 12px;border:3px solid #2f271f;border-radius:12px;font:800 15px/1.3 'ZCOOL KuaiLe',sans-serif;background:#fff;color:#2f271f;box-shadow:3px 4px 0 #2f271f;cursor:pointer}
.certificate-gate-primary{background:var(--certificate-gate-accent);color:#fff}
.certificate-gate-button:active{transform:translate(2px,2px);box-shadow:1px 2px 0 #2f271f}
.certificate-gate-jump-target{scroll-margin-top:96px}
@media(max-width:620px){
  .certificate-gate-shell{width:min(100% - 32px,620px)}
  .certificate-gate-ticket{padding:15px 14px}
  .certificate-gate-buttons{grid-template-columns:1fr;gap:10px}
}
@media(prefers-reduced-motion:reduce){
  .certificate-gate-button{transition:none}
}
@media print{
  .certificate-gate-trigger,
  .certificate-gate-status,
  .certificate-gate-shell{display:none!important}
}
```

- [ ] **Step 5: 运行共享模块测试并确认 GREEN**

Run:

```bash
node --test tests/unit/certificate-gate.test.js
npm run test:unit
git diff --check
```

Expected: 新增测试和全部单元测试 PASS，且没有空白错误。

- [ ] **Step 6: 提交共享模块**

```bash
git add core/certificate-gate.js core/certificate-gate.css tests/unit/certificate-gate.test.js
git commit -m "feat: add shared certificate gate"
```

### Task 2: 把 Lesson 51 迁移成共享基准

**Files:**
- Modify: `lesson51/index.html:4-197,340-375,532-613,960-993`
- Modify: `tests/e2e/l51-progress.spec.js:79-191`

**Interfaces:**
- Consumes: `CanranCore.certificateGate.create` 和 `completionState`。
- Produces: `L51_CERTIFICATE_TARGETS`、`l51CertificateGate`、`issueL51Certificate()`。
- 保留: `ratings`、`renderStars()`、姓名校验、`celebrate()` 和 `window.print()`。

- [ ] **Step 1: 先把 Lesson 51 测试改成满星与共享票券合同**

把锁定测试夹具改成：

```js
ratings: { l1: 3, l2: 2, l3: 3, l4: 0, l5: 3 }
```

并断言：

```js
await expect(page.locator('#btnPrint')).toBeEnabled();
await expect(page.locator('#btnPrint')).toHaveAttribute('data-certificate-state', 'locked');
await page.locator('#btnPrint').click();
await expect(page.locator('[data-certificate-gate]')).toBeVisible();
await expect(page.locator('[data-certificate-count]')).toHaveText('还差 4 颗星，还有 2 关未满星。');
await expect(page.locator('[data-certificate-go]')).toHaveText('前往「课文剧场」补满星');
await expect(page.locator('[data-certificate-go]')).toBeFocused();
```

把现有合资格夹具从全 `1` 改为全 `3`，增加 14/15 边界，并把证书星星断言改成：

```js
await expect(page.locator('#certStars')).toHaveText(/^★{15}$/);
```

跳转测试必须断言 URL 为 `#w2`，且 `#w2 h2` 获得焦点；“稍后再说”继续断言焦点返回 `#btnPrint`。

再增加展开期间达到满星的刷新断言：

```js
await page.locator('#btnPrint').click();
await page.evaluate(()=>{
  window.eval('ratings={l1:3,l2:3,l3:3,l4:3,l5:3}');
  window.renderStars();
});
await expect(page.locator('[data-certificate-gate]')).toBeHidden();
await expect(page.locator('#btnPrint')).toHaveAttribute('data-certificate-state','ready');
```

- [ ] **Step 2: 运行 Lesson 51 测试并确认 RED**

Run:

```bash
npx playwright test tests/e2e/l51-progress.spec.js
```

Expected: FAIL，因为旧代码仍按每关 1 星解锁，并使用内联票券节点和旧文案。

- [ ] **Step 3: 替换内联票券并接入共享控制器**

在字体样式后加载 `/core/certificate-gate.css`，在 `/core/progress.js` 后加载 `/core/certificate-gate.js`。删除 `lesson51/index.html:171-185` 的旧票券 CSS，只保留证书本体样式；同时从该页原有 `@media print` 规则移除已经被删除的 `#certGateActions`，打印隐藏统一由共享 CSS 接管。

把旧门槛 DOM 替换为：

```html
<button class="btn blue" id="btnPrint">打印我的证书</button>
<p id="certGateMsg"></p>
<div id="l51CertificateGate"></div>
```

定义精确配置：

```js
const L51_CERTIFICATE_TARGETS = [
  {id:'l1',selector:'#w1',label:'单词行囊'},
  {id:'l2',selector:'#w2',label:'课文剧场'},
  {id:'l3',selector:'#w3',label:'月份归队'},
  {id:'l4',selector:'#w4',label:'频率阶梯'},
  {id:'l5',selector:'#w5',label:'导游考核'}
];

function canIssueL51Certificate(){
  return CanranCore.certificateGate
    .completionState(ratings,L51_CERTIFICATE_TARGETS).eligible;
}

function issueL51Certificate(){
  const name=document.getElementById('certName').value.trim();
  if(!name){
    toast('先写上你的名字哦');
    document.getElementById('certName').focus();
    return false;
  }
  renderStars();
  document.getElementById('certDate').textContent='日期：'+new Date().toLocaleDateString('zh-CN');
  celebrate(document.getElementById('certCard'));
  window.print();
  return true;
}

const l51CertificateGate=CanranCore.certificateGate.create({
  trigger:document.getElementById('btnPrint'),
  mount:document.getElementById('l51CertificateGate'),
  status:document.getElementById('certGateMsg'),
  getRatings:()=>ratings,
  targets:L51_CERTIFICATE_TARGETS,
  courseName:'Lesson 51 · 希腊四季之旅',
  icon:'🏛️',
  accent:'#1d6fb8',
  pageColor:'var(--paper)',
  itemLabel:'关',
  readyMessage:'15/15 颗星已集齐，可以打印证书。',
  onEligible:issueL51Certificate
});
```

删除旧 `firstMissingL51Level`、打开/关闭/渲染函数和三个旧点击处理器。`renderStars()` 的最后一行改为 `l51CertificateGate.refresh()`；把当前位于其定义后的首次 `renderStars()` 调用移动到 `l51CertificateGate` 创建完成之后，课程授星仍通过现有 `renderStars()` 自动刷新。

把证书区副标题改为 `集齐 15 颗星，写下名字后打印证书。`。

把第五关完成提示改成实时资格文案，避免单独完成考核就承诺领证：

```js
toast(canIssueL51Certificate()
  ?'15 颗星集齐，去领证书吧'
  :'考核完成！继续把五关都补到三星吧');
```

- [ ] **Step 4: 运行 Lesson 51 聚焦回归并确认 GREEN**

Run:

```bash
npx playwright test tests/e2e/l51-progress.spec.js tests/e2e/l51-audio.spec.js
```

Expected: 两个套件全部 PASS，锁定时打印调用数保持 0，15/15 时原打印流程执行一次。

- [ ] **Step 5: 提交 Lesson 51 共享迁移**

```bash
git add lesson51/index.html tests/e2e/l51-progress.spec.js
git commit -m "refactor: share the lesson 51 certificate gate"
```

### Task 3: 接入 Lesson 49 肉店证书门槛

**Files:**
- Modify: `lesson49/index.html:6-374,798-833,1008-1052,1693-1759,2074-2115`
- Modify: `tests/e2e/l49-progress.spec.js:5-71`

**Interfaces:**
- Produces: `L49_CERTIFICATE_TARGETS`、`l49CertificateGate`、`issueL49Certificate()`。
- Consumes: 现有 `stars`、证书 dialog、PNG 保存、`fanfare()`、`confetti()`。

- [ ] **Step 1: 写出 Lesson 49 常驻入口与 15 星失败测试**

把现有证书用例改为以下边界：

```js
test('Lesson 49 keeps its locked certificate entry visible from zero stars', async ({ page }) => {
  await page.goto('/lesson49/#l5');
  await expect(page.locator('#certArea')).toBeVisible();
  await expect(page.locator('#certBtn')).toBeEnabled();
  await expect(page.locator('#certBtn')).toHaveAttribute('data-certificate-state','locked');
});

test('Lesson 49 five one-star levels remain locked', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('canran:l49:progress:v2',JSON.stringify({
    version:2,ratings:{l1:1,l2:1,l3:1,l4:1,l5:1}
  })));
  await page.goto('/lesson49/#l5');
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).not.toBeVisible();
  await expect(page.locator('[data-certificate-count]')).toHaveText('还差 10 颗星，还有 5 关未满星。');
});
```

增加部分进度 `{l1:3,l2:2,l3:3,l4:0,l5:3}`，断言缺 4 星、2 关、主操作为 `前往「课文剧场」补满星`；取消后焦点回到 `#certBtn`，再次打开后主操作跳到 `#l2` 并聚焦 `#l2 h2`。增加全 `3` 时弹窗可见，并保留损坏数据与 DOM 篡改不能开证书的断言。

- [ ] **Step 2: 运行 Lesson 49 测试并确认 RED**

Run:

```bash
npx playwright test tests/e2e/l49-progress.spec.js
```

Expected: FAIL，因为 `#certArea` 仍在零星时隐藏，入口仍被禁用，且五个 1 星会错误解锁。

- [ ] **Step 3: 让入口常驻并配置共享门槛**

加载共享 CSS/JS，移除 `#certArea` 的 `hidden` 类，给 `#certGateMsg` 增加一个空的共享挂载点：

```html
<div id="certArea">
  <input id="certName" maxlength="12" placeholder="写上你的大名 ✍️">
  <button class="btn btn-green" id="certBtn">📜 生成结业证书</button>
  <span id="certGateMsg"></span>
</div>
<div id="l49CertificateGate"></div>
```

用以下配置替换 `renderL49CertificateGate()` 中的隐藏与禁用逻辑：

```js
const L49_CERTIFICATE_TARGETS=[
  {id:'l1',selector:'#l1',label:'单词'},
  {id:'l2',selector:'#l2',label:'课文剧场'},
  {id:'l3',selector:'#l3',label:'句型魔法屋'},
  {id:'l4',selector:'#l4',label:'三单训练营'},
  {id:'l5',selector:'#l5',label:'老板考核'}
];
function canIssueL49Certificate(){
  return CanranCore.certificateGate
    .completionState(stars,L49_CERTIFICATE_TARGETS).eligible;
}
function renderL49CertificateGate(){
  if(l49CertificateGate)l49CertificateGate.refresh();
}
```

把当前 `#certBtn` 合资格分支原样移动到 `issueL49Certificate()`，返回 `true`；将它传给：

```js
const l49CertificateGate=CanranCore.certificateGate.create({
  trigger:$('#certBtn'),mount:$('#l49CertificateGate'),status:$('#certGateMsg'),
  getRatings:()=>stars,targets:L49_CERTIFICATE_TARGETS,
  courseName:'Lesson 49 · 肉店大冒险',icon:'🥩',accent:'#c43f36',
  pageColor:'var(--cream)',itemLabel:'关',
  readyMessage:'15/15 颗星已集齐，可以生成证书。',
  onEligible:issueL49Certificate
});
```

删除旧入口点击监听器。`openL49CertificateDialog()`、`#certSave`、`#certPrint` 发现资格丢失时，先关闭 dialog，再调用 `l49CertificateGate.open()`；不得把按钮设为禁用。把第五关描述改为 `答完后继续补满五关 15 颗星，就能领取结业证书。`。

- [ ] **Step 4: 运行 Lesson 49 证书与导出回归**

Run:

```bash
npx playwright test tests/e2e/l49-progress.spec.js tests/e2e/certificate-export.spec.js
```

Expected: 全部 PASS，PNG 导出保持原样，5/15 锁定，15/15 才打开证书弹窗。

- [ ] **Step 5: 提交 Lesson 49 接入**

```bash
git add lesson49/index.html tests/e2e/l49-progress.spec.js
git commit -m "feat: guide locked lesson 49 certificates"
```

### Task 4: 接入 Lesson 50 皇家证书门槛

**Files:**
- Modify: `lesson50/index.html:13-330,715-752,986-1037,1831-1918`
- Modify: `tests/e2e/l50-assessment.spec.js:181-268`

**Interfaces:**
- Produces: `L50_CERTIFICATE_TARGETS`、`l50CertificateGate`、`issueL50Certificate()`。
- Consumes: 现有 `stars`、证书 dialog、PNG 保存、`fanfare()`、`confetti()`。

- [ ] **Step 1: 写出 Lesson 50 常驻入口与 15 星失败测试**

把 `certificate entry stays hidden before the final assessment has a rating` 改为：

```js
test('Lesson 50 certificate entry is visible and actionable before the final rating', async ({ page }) => {
  await page.goto('/lesson50/#l5');
  await expect(page.locator('#certArea')).toBeVisible();
  await expect(page.locator('#certBtn')).toBeEnabled();
  await expect(page.locator('#certBtn')).toHaveAttribute('data-certificate-state','locked');
});
```

把“all five levels have ratings”改成全 `3` 才成功；另加全 `1` 仍显示 `还差 10 颗星，还有 5 关未满星。`。使用 `{l1:3,l2:2,l3:3,l4:0,l5:3}` 断言主操作为 `前往「餐桌」补满星`，取消恢复焦点，跳转到 `#l2` 并聚焦标题。

- [ ] **Step 2: 运行 Lesson 50 测试并确认 RED**

Run:

```bash
npx playwright test tests/e2e/l50-assessment.spec.js
```

Expected: 证书常驻、可点击锁定态、满星门槛和共享票券断言 FAIL。

- [ ] **Step 3: 配置 Lesson 50 共享门槛**

加载共享 CSS/JS，移除 `#certArea` 的 `hidden` 类，增加 `<div id="l50CertificateGate"></div>`，并定义：

```js
const L50_CERTIFICATE_TARGETS=[
  {id:'l1',selector:'#l1',label:'蔬果图鉴'},
  {id:'l2',selector:'#l2',label:'餐桌'},
  {id:'l3',selector:'#l3',label:'动词变身魔法屋'},
  {id:'l4',selector:'#l4',label:'照妖镜挑战'},
  {id:'l5',selector:'#l5',label:'皇家大考核'}
];
function canIssueL50Certificate(){
  return CanranCore.certificateGate
    .completionState(stars,L50_CERTIFICATE_TARGETS).eligible;
}
function renderL50CertificateGate(){
  if(l50CertificateGate)l50CertificateGate.refresh();
}
```

把当前入口的合资格分支移动到 `issueL50Certificate()`，然后创建：

```js
const l50CertificateGate=CanranCore.certificateGate.create({
  trigger:$('#certBtn'),mount:$('#l50CertificateGate'),status:$('#certGateMsg'),
  getRatings:()=>stars,targets:L50_CERTIFICATE_TARGETS,
  courseName:'Lesson 50 · 挑食小王子',icon:'👑',accent:'#7250b5',
  pageColor:'var(--cream)',itemLabel:'关',
  readyMessage:'15/15 颗星已集齐，可以领取证书。',
  onEligible:issueL50Certificate
});
```

删除旧入口监听器。dialog 打开、保存和打印的资格丢失分支改为关闭 dialog 后调用 `l50CertificateGate.open()`。把第五关描述改为 `完成考核后继续补满五关 15 颗星，就能领取结业证书。`。

- [ ] **Step 4: 运行 Lesson 50 聚焦回归并确认 GREEN**

Run:

```bash
npx playwright test tests/e2e/l50-assessment.spec.js tests/e2e/certificate-export.spec.js
```

Expected: 全部 PASS，证书弹窗和 PNG 保存没有回归。

- [ ] **Step 5: 提交 Lesson 50 接入**

```bash
git add lesson50/index.html tests/e2e/l50-assessment.spec.js
git commit -m "feat: guide locked lesson 50 certificates"
```

### Task 5: 为 Lesson 54 建立完整门槛覆盖并接入

**Files:**
- Create: `tests/e2e/l54-progress.spec.js`
- Modify: `lesson54/index.html:7-213,342-374,522-551,815-822,857-858`
- Modify: `package.json:14`

**Interfaces:**
- Produces: `L54_CERTIFICATE_TARGETS`、`l54CertificateGate`、`issueL54Certificate()`。
- Consumes: `stars`、`renderStars()`、`celebrate()` 和现有延迟打印。

- [ ] **Step 1: 创建 Lesson 54 失败套件**

创建 `tests/e2e/l54-progress.spec.js`，至少包含以下三项：

```js
'use strict';
const {test,expect}=require('@playwright/test');
const KEY='canran:l54:progress:v2';

async function seed(page,ratings){
  await page.addInitScript(({key,values})=>localStorage.setItem(key,JSON.stringify({
    version:2,ratings:values
  })),{key:KEY,values:ratings});
}

test('Lesson 54 exposes an actionable locked certificate from zero stars',async({page})=>{
  await page.goto('/lesson54/#cert');
  await expect(page.locator('#btnPrint')).toBeEnabled();
  await expect(page.locator('#btnPrint')).toHaveAttribute('data-certificate-state','locked');
  await page.locator('#btnPrint').click();
  await expect(page.locator('[data-certificate-count]')).toHaveText('还差 15 颗星，还有 5 关未满星。');
});

test('Lesson 54 jumps to its first not-full-star passport stop',async({page})=>{
  await seed(page,{l1:3,l2:2,l3:3,l4:0,l5:3});
  await page.goto('/lesson54/#cert');
  await page.locator('#btnPrint').click();
  await expect(page.locator('[data-certificate-go]')).toHaveText('前往「机场广播剧」补满星');
  await page.locator('[data-certificate-go]').click();
  await expect(page).toHaveURL(/#w2$/);
  await expect(page.locator('#w2 h2')).toBeFocused();
});

test('Lesson 54 blocks fourteen stars and prints at fifteen',async({page})=>{
  await seed(page,{l1:3,l2:3,l3:3,l4:3,l5:2});
  await page.addInitScript(()=>{window.__printCalls=0;window.print=()=>{window.__printCalls+=1;};});
  await page.goto('/lesson54/#cert');
  await page.locator('#certName').fill('小明');
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(()=>window.__printCalls)).toBe(0);
  await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({
    version:2,ratings:{l1:3,l2:3,l3:3,l4:3,l5:3}
  })),KEY);
  await page.reload();
  await page.locator('#certName').fill('小明');
  await page.locator('#btnPrint').click();
  await expect.poll(()=>page.evaluate(()=>window.__printCalls),{timeout:1500}).toBe(1);
});
```

- [ ] **Step 2: 运行新套件并确认 RED**

Run:

```bash
npx playwright test tests/e2e/l54-progress.spec.js
```

Expected: locked dataset、票券和 15 星边界断言 FAIL。

- [ ] **Step 3: 接入 Lesson 54 配置**

加载共享 CSS/JS，把入口、状态和挂载点调整为与 Lesson 51 相同的顺序：

```html
<div style="margin-top:26px">
  <button class="btn primary" id="btnPrint">🖨️ 打印我的证书</button>
  <div id="certGate"></div>
  <div id="l54CertificateGate"></div>
</div>
```

随后定义：

```js
const L54_CERTIFICATE_TARGETS=[
  {id:'l1',selector:'#w1',label:'单词签证官'},
  {id:'l2',selector:'#w2',label:'机场广播剧'},
  {id:'l3',selector:'#w3',label:'护照盖章'},
  {id:'l4',selector:'#w4',label:'句型魔法屋'},
  {id:'l5',selector:'#w5',label:'海关终极考核'}
];
function canIssue(){
  return CanranCore.certificateGate
    .completionState(stars,L54_CERTIFICATE_TARGETS).eligible;
}
function renderCertGate(){
  if(l54CertificateGate)l54CertificateGate.refresh();
}
function issueL54Certificate(){
  const name=$('#certName').value.trim();
  if(!name){toast('先写上你的名字哦');$('#certName').focus();return false;}
  celebrate();
  setTimeout(()=>window.print(),600);
  return true;
}
const l54CertificateGate=CanranCore.certificateGate.create({
  trigger:$('#btnPrint'),mount:$('#l54CertificateGate'),status:$('#certGate'),
  getRatings:()=>stars,targets:L54_CERTIFICATE_TARGETS,
  courseName:'Lesson 54 · 环球小使者',icon:'🛂',accent:'#167d92',
  pageColor:'var(--cream)',itemLabel:'关',
  readyMessage:'15/15 颗星已集齐，可以打印证书。',
  onEligible:issueL54Certificate
});
```

删除旧 `#btnPrint` 监听器和每关 1 星文案。证书副标题改为 `五关全部三星（15/15），写下名字后打印专属证书！`。第五关结果中的“去领证书”改为：

```js
const certificateHint=canIssue()
  ?'15 颗星集齐，去领证书吧！'
  :'继续把五关都补到三星吧！';
```

把 `certificateHint` 写入现有考核结果的提示 `<span>`；`renderStars()` 继续调用 `renderCertGate()`。

- [ ] **Step 4: 把 Lesson 54 纳入状态回归并确认 GREEN**

把 `package.json` 的脚本改为：

```json
"test:state": "playwright test tests/e2e/l49-progress.spec.js tests/e2e/home-progress.spec.js tests/e2e/l50-assessment.spec.js tests/e2e/soundmark-progress.spec.js tests/e2e/l51-progress.spec.js tests/e2e/l54-progress.spec.js"
```

Run:

```bash
npx playwright test tests/e2e/l54-progress.spec.js
npm run test:state
```

Expected: Lesson 54 和全部状态套件 PASS。

- [ ] **Step 5: 提交 Lesson 54 接入**

```bash
git add lesson54/index.html tests/e2e/l54-progress.spec.js package.json
git commit -m "feat: add the lesson 54 certificate gate"
```

### Task 6: 接入音标番外篇并实现游戏标签跳转

**Files:**
- Modify: `soundmark/index.html:5-320,504-539,642-691,1095-1103,1130-1227`
- Modify: `tests/e2e/soundmark-progress.spec.js:64-155`

**Interfaces:**
- Produces: `SOUNDMARK_CERTIFICATE_TARGETS`、`soundmarkCertificateGate`、`activateSoundmarkGame(id)`、`issueSoundmarkCertificate()`。
- Consumes: 现有 12 星资格、证书 dialog、`soundRatings` 和 `celebrate()`。

- [ ] **Step 1: 把音标测试改成可点击锁定态和标签跳转**

把 11 星测试的禁用断言改为：

```js
await expect(page.locator('#btnOpenCert')).toBeEnabled();
await expect(page.locator('#btnOpenCert')).toHaveAttribute('data-certificate-state','locked');
await page.locator('#btnOpenCert').click();
await expect(page.locator('[data-certificate-count]')).toHaveText('还差 1 颗星，还有 1 项挑战未满星。');
await expect(page.locator('[data-certificate-go]')).toHaveText('前往「拼读小达人」补满星');
await expect(page.getByRole('dialog')).not.toBeVisible();
```

增加 `g2` 跳转测试：评级 `{vs:3,g1:3,g2:2,g3:3}`，打开票券后点击主操作，断言 `.gtab[data-g="g2"]` 和 `#g2` 都有 `on` 类、`#g2` 可见、`#g2 .g-card` 获得焦点、URL 以 `#g2` 结束。保留 12/12 姓名校验、对话框和打印复核用例。

- [ ] **Step 2: 运行音标测试并确认 RED**

Run:

```bash
npx playwright test tests/e2e/soundmark-progress.spec.js
```

Expected: 入口可用性、票券和 `g2` 标签激活断言 FAIL。

- [ ] **Step 3: 抽出标签激活函数并配置共享门槛**

加载共享 CSS/JS，在 `.cert-entry` 后增加 `<div id="soundmarkCertificateGate"></div>`。把旧标签点击逻辑改为：

```js
function activateSoundmarkGame(id){
  const tab=document.querySelector(`.gtab[data-g="${id}"]`);
  const panel=document.getElementById(id);
  if(!tab||!panel)return false;
  document.querySelectorAll('.gtab').forEach(item=>item.classList.remove('on'));
  document.querySelectorAll('.game-panel').forEach(item=>item.classList.remove('on'));
  tab.classList.add('on');
  panel.classList.add('on');
  return true;
}
document.querySelectorAll('.gtab').forEach(tab=>{
  tab.onclick=()=>activateSoundmarkGame(tab.dataset.g);
});
```

配置共享门槛：

```js
const SOUNDMARK_CERTIFICATE_TARGETS=[
  {id:'vs',selector:'#vs',label:'元音 vs 辅音'},
  {id:'g1',selector:'#g1',label:'听音小侦探',focusSelector:'.g-card'},
  {id:'g2',selector:'#g2',label:'左耳右耳',focusSelector:'.g-card'},
  {id:'g3',selector:'#g3',label:'拼读小达人',focusSelector:'.g-card'}
];
function canIssueSoundmarkCertificate(){
  return CanranCore.certificateGate
    .completionState(soundRatings,SOUNDMARK_CERTIFICATE_TARGETS).eligible;
}
function issueSoundmarkCertificate(){
  const name=document.getElementById('certName').value.trim();
  if(!name){toast('先写上你的名字哦');document.getElementById('certName').focus();return false;}
  document.getElementById('certNameOut').textContent=name;
  document.getElementById('certDate').textContent='日期：'+new Date().toLocaleDateString('zh-CN');
  return openSoundmarkCertificateDialog();
}
const soundmarkCertificateGate=CanranCore.certificateGate.create({
  trigger:document.getElementById('btnOpenCert'),
  mount:document.getElementById('soundmarkCertificateGate'),
  status:document.getElementById('certNeed'),
  getRatings:()=>soundRatings,targets:SOUNDMARK_CERTIFICATE_TARGETS,
  courseName:'音标番外篇 · 魔法乐园',icon:'🪄',accent:'#ef7047',
  pageColor:'var(--paper)',itemLabel:'项挑战',
  readyMessage:'12/12 颗星已集齐，可以查看证书。',
  onEligible:issueSoundmarkCertificate,
  beforeNavigate:target=>{
    if(target.id.startsWith('g'))activateSoundmarkGame(target.id);
  }
});
```

`renderStars()` 删除 `button.disabled`，改为 `soundmarkCertificateGate.refresh()`。把当前首次 `renderStars()` 调用移动到 `soundmarkCertificateGate` 创建之后，保证初始化时实例已经存在。删除旧入口监听器；dialog 内打印仍复核资格，资格丢失时关闭 dialog 后调用 `soundmarkCertificateGate.open()`。证书正文改为 `在音标魔法乐园完成四项满星挑战，学会 6 个元音`。

- [ ] **Step 4: 运行音标与弹窗回归并确认 GREEN**

Run:

```bash
npx playwright test tests/e2e/soundmark-progress.spec.js tests/e2e/accessibility.spec.js -g "soundmark|音标"
```

Expected: 11/12 锁定引导、12/12 对话框、标签跳转和打印复核全部 PASS。

- [ ] **Step 5: 提交音标接入**

```bash
git add soundmark/index.html tests/e2e/soundmark-progress.spec.js
git commit -m "feat: guide locked soundmark certificates"
```

### Task 7: 完成跨页无障碍、异常、视觉与构建验收

**Files:**
- Create: `tests/e2e/certificate-gates.spec.js`
- Modify: `tests/e2e/accessibility.spec.js:238-453`
- Modify: `tests/deploy/static-build.test.js:95-143`
- Modify if visual fixes require it: `core/certificate-gate.css`
- Modify if behavior fixes require it: `core/certificate-gate.js`
- Modify if course wiring fixes require it: `lesson49/index.html`
- Modify if course wiring fixes require it: `lesson50/index.html`
- Modify if course wiring fixes require it: `lesson51/index.html`
- Modify if course wiring fixes require it: `lesson54/index.html`
- Modify if course wiring fixes require it: `soundmark/index.html`
- Create: `docs/superpowers/qa/2026-08-01-unified-certificate-gates.md`

**Interfaces:**
- Consumes: 五页相同的 `[data-certificate-gate]`、`[data-certificate-count]`、`[data-certificate-go]`、`[data-certificate-dismiss]` 合同。
- Produces: 五页共同验收套件和 `final result: passed` 的视觉证据。

- [ ] **Step 1: 添加五页共同失败测试**

创建 `tests/e2e/certificate-gates.spec.js`，先定义精确配置：

```js
'use strict';
const {test,expect}=require('@playwright/test');

const CASES=[
  {
    label:'Lesson 49',path:'/lesson49/',hash:'#l5',key:'canran:l49:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#certBtn',status:'#certGateMsg',
    course:'Lesson 49 · 肉店大冒险',icon:'🥩',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#c43f36'
  },
  {
    label:'Lesson 50',path:'/lesson50/',hash:'#l5',key:'canran:l50:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#certBtn',status:'#certGateMsg',
    course:'Lesson 50 · 挑食小王子',icon:'👑',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#7250b5'
  },
  {
    label:'Lesson 51',path:'/lesson51/',hash:'#cert',key:'canran:l51:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#btnPrint',status:'#certGateMsg',
    course:'Lesson 51 · 希腊四季之旅',icon:'🏛️',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#1d6fb8'
  },
  {
    label:'Lesson 54',path:'/lesson54/',hash:'#cert',key:'canran:l54:progress:v2',
    ratings:{l1:3,l2:2,l3:3,l4:0,l5:3},trigger:'#btnPrint',status:'#certGate',
    course:'Lesson 54 · 环球小使者',icon:'🛂',
    expectedCount:'还差 4 颗星，还有 2 关未满星。',accent:'#167d92'
  },
  {
    label:'soundmark',path:'/soundmark/',hash:'#cert',key:'canran:soundmark:progress:v2',
    ratings:{vs:3,g1:3,g2:2,g3:3},trigger:'#btnOpenCert',status:'#certNeed',
    course:'音标番外篇 · 魔法乐园',icon:'🪄',
    expectedCount:'还差 1 颗星，还有 1 项挑战未满星。',accent:'#ef7047'
  }
];
```

逐页验证 390 像素、共享结构、强调色、ARIA、打印隐藏和控制台无错误。每个用例先种入对应评级，再使用以下断言：

```js
for(const config of CASES){
test(`${config.label} shares the responsive accessible certificate ticket`,async({page})=>{
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.addInitScript(({key,ratings})=>localStorage.setItem(key,JSON.stringify({
  version:2,ratings
})),{key:config.key,ratings:config.ratings});
await page.setViewportSize({width:390,height:844});
await page.goto(`${config.path}${config.hash}`);
const trigger=page.locator(config.trigger);
const status=page.locator(config.status);
const gate=page.locator('[data-certificate-gate]');
await expect(trigger).toBeEnabled();
await trigger.click();
await expect(gate).toBeVisible();
await expect(page.locator('[data-certificate-count]')).toHaveText(config.expectedCount);
await expect(page.locator('[data-certificate-course]')).toHaveText(config.course);
await expect(page.locator('[data-certificate-icon]')).toHaveText(config.icon);
await expect(trigger).toHaveAttribute('aria-expanded','true');
const statusId=await status.getAttribute('id');
const gateId=await gate.getAttribute('id');
expect(statusId).toBeTruthy();
expect(gateId).toBeTruthy();
await expect(trigger).toHaveAttribute('aria-describedby',statusId);
await expect(trigger).toHaveAttribute('aria-controls',gateId);
await expect(status).toHaveAttribute('role','status');
await expect(status).toHaveAttribute('aria-live','polite');
await expect(status).toHaveAttribute('aria-atomic','true');
await expect(page.locator('[data-certificate-dismiss]')).toHaveText('稍后再说');
expect(await gate.evaluate(element=>
  getComputedStyle(element).getPropertyValue('--certificate-gate-accent').trim()
)).toBe(config.accent);
expect(await page.evaluate(()=>({
  viewport:document.documentElement.clientWidth,
  page:document.documentElement.scrollWidth
}))).toEqual({viewport:390,page:390});
await page.emulateMedia({media:'print'});
await expect(trigger).toBeHidden();
await expect(gate).toBeHidden();
expect(errors).toEqual([]);
});
}
```

另加异常目标测试：

```js
test('missing target keeps the gate open and never prints',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('canran:l51:progress:v2',JSON.stringify({
      version:2,ratings:{l1:3,l2:2,l3:3,l4:3,l5:3}
    }));
    window.__printCalls=0;
    window.print=()=>{window.__printCalls+=1;};
  });
  await page.goto('/lesson51/#cert');
  await page.locator('#w2').evaluate(element=>element.remove());
  const before=page.url();
  await page.locator('#btnPrint').click();
  await page.locator('[data-certificate-go]').click();
  await expect(page.locator('[data-certificate-gate]')).toBeVisible();
  await expect(page.locator('#certGateMsg')).toHaveText('暂时找不到目标关卡，请使用课程导航。');
  expect(page.url()).toBe(before);
  expect(await page.evaluate(()=>window.__printCalls)).toBe(0);
});
```

- [ ] **Step 2: 更新跨页资格丢失与焦点测试**

把 `tests/e2e/accessibility.spec.js` 中所有用于打开 Lesson 49/50 证书的全 `1` 评级改为全 `3`。在“save and print reject eligibility lost after opening”中，把打开后的状态从某项 `0` 改为某项 `2`，并用以下断言替换禁用断言：

```js
await expect(page.locator('#certBtn')).toBeEnabled();
await expect(page.locator('#certBtn')).toHaveAttribute('data-certificate-state','locked');
await expect(page.locator('[data-certificate-gate]')).toBeVisible();
await expect(page.locator('[data-certificate-go]')).toBeFocused();
```

保留 dialog 焦点闭环、快速 Escape、删除 opener 后的回退、保存预览和 Blob URL 清理用例。

- [ ] **Step 3: 运行共同测试并修复到 GREEN**

Run:

```bash
npx playwright test tests/e2e/certificate-gates.spec.js tests/e2e/accessibility.spec.js tests/e2e/certificate-export.spec.js
```

Expected: 首轮至少暴露仍存在的 fixture、打印样式或移动端差异；修复共享模块或对应接线后，三个套件全部 PASS，浏览器无 page error。

- [ ] **Step 4: 明确验证共享文件进入静态制品**

在 `tests/deploy/static-build.test.js` 的输出文件循环加入：

```js
'core/certificate-gate.js',
'core/certificate-gate.css',
```

并在 manifest 断言中加入：

```js
assert.match(manifest.files['core/certificate-gate.js'],/^[a-f0-9]{64}$/);
assert.match(manifest.files['core/certificate-gate.css'],/^[a-f0-9]{64}$/);
```

- [ ] **Step 5: 完成五页高保真与移动端视觉 QA**

Run:

```bash
node tests/support/static-server.js
```

在相同桌面视口按共同测试配置的真实入口锚点打开五页（Lesson 49/50 使用 `#l5`，Lesson 51/54 和音标使用 `#cert`），分别种入规格高保真中的部分星状态并点击入口。捕获：

- `/tmp/canran-certificate-l49.png`
- `/tmp/canran-certificate-l50.png`
- `/tmp/canran-certificate-l51.png`
- `/tmp/canran-certificate-l54.png`
- `/tmp/canran-certificate-soundmark.png`
- `/tmp/canran-certificate-family-comparison.png`

同屏比较高保真真源和五张实现截图，逐项检查票面、缺口、边框、阴影、间距、按钮、课程名称、图标、强调色和文案。再用 `390 × 844` 检查每页无横向溢出或裁切、按钮纵向排列、跳转目标不被吸顶栏遮挡。任何 P0/P1/P2 差异存在时继续修复并重新截图。

创建 `docs/superpowers/qa/2026-08-01-unified-certificate-gates.md`，记录真源、五张截图、视口、进度夹具、对比历史、交互、键盘、播报、打印、控制台和修复结果；最后一行必须严格为：

```text
final result: passed
```

- [ ] **Step 6: 运行最终本地回归并提交 QA**

Run:

```bash
git diff --check
npm run test:unit
npm run test:state
npx playwright test tests/e2e/certificate-gates.spec.js tests/e2e/accessibility.spec.js tests/e2e/certificate-export.spec.js
```

Expected: 全部 PASS，QA 文档没有未解决差异。

Commit:

```bash
git add core/certificate-gate.js core/certificate-gate.css \
  lesson49/index.html lesson50/index.html lesson51/index.html lesson54/index.html soundmark/index.html \
  tests/e2e/certificate-gates.spec.js tests/e2e/accessibility.spec.js \
  tests/deploy/static-build.test.js docs/superpowers/qa/2026-08-01-unified-certificate-gates.md
git commit -m "test: verify unified certificate gates"
```

- [ ] **Step 7: 在干净提交上验证静态构建合同**

Run:

```bash
test -z "$(git status --short)"
node --test tests/deploy/static-build.test.js
npm run test:deploy
```

Expected: 共享 JS/CSS 出现在 `dist/` 与 `release-manifest.json` 中，全部部署合同 PASS。

### Task 8: 完整验证、快进主干、推送并部署 HTTP 生产环境

**Files:**
- No source changes expected.
- Consumes: `deploy/README.md` sections 1–7 and the exact verified Git commit.

**Interfaces:**
- Produces: 远端 `main`、本地 `main`、生产 `release-manifest.json` 三者一致的 40 位提交 SHA。
- Produces: `http://59.110.217.36` 的精确字节、路由、响应头与五页手工交互证据。

- [ ] **Step 1: 使用完成与验证技能审查最终分支**

调用 `superpowers:verification-before-completion`，随后调用 `superpowers:finishing-a-development-branch`。在功能分支执行：

```bash
git status --short
git diff --check
npm test
npm run test:deploy
```

Expected: 工作树干净，全部单元、E2E 和部署测试零失败。

- [ ] **Step 2: 推送审计分支并快进本地 main**

使用实施时创建的功能分支名 `codex/unified-certificate-gates`：

```bash
git fetch origin
test "$(git merge-base origin/main HEAD)" = "$(git rev-parse origin/main)"
git push origin HEAD:refs/heads/codex/unified-certificate-gates
```

若祖先检查失败，说明实施期间远端 `main` 已前进：停止发布，不得强推；把功能分支变基到最新 `origin/main`，从 Task 7 Step 6 起重新执行本地回归，并在通过后重新进入本步骤。

回到持有 `main` 的主检出目录：

```bash
git status --short
git merge --ff-only codex/unified-certificate-gates
git push origin main
```

Expected: 仅发生 fast-forward，无合并提交和冲突。

- [ ] **Step 3: 确认远端主干与本地发布提交相同**

Run:

```bash
RELEASE_SHA="$(git rev-parse --verify HEAD)"
test "$RELEASE_SHA" = "$(git rev-parse --verify main)"
test "$RELEASE_SHA" = "$(git ls-remote origin refs/heads/main | awk '{print $1}')"
printf 'release=%s\n' "$RELEASE_SHA"
```

Expected: 三个 SHA 完全相同且为 40 位十六进制值。

- [ ] **Step 4: 从精确主干构建并验证制品**

在干净的本地 `main` 上按 `deploy/README.md` 第 1 节完整执行；核心门槛为：

```bash
npm ci
npx playwright install chromium
npm test
npm run test:deploy
npm run build:static
git diff --check
test -z "$(git status --short)"
RELEASE_SHA="$(git rev-parse --verify HEAD)"
test "$(node -p 'require("./dist/release-manifest.json").commit')" = "$RELEASE_SHA"
```

继续执行 runbook 的 `verify_artifact dist`、安全归档、解包复核、`ARCHIVE_SHA` 与 `CONFIG_SHA` 校验。Expected: 本地制品、归档和 manifest 全部绑定同一个 `RELEASE_SHA`。

- [ ] **Step 5: 执行只读服务器预检和安全发布**

使用用户已授权的 SSH 凭据，通过安全输入加载到临时 SSH 会话；不得把私钥或 sudo 密码写入仓库、计划、日志或提交。设置已批准目标：

```bash
export CANRAN_DEPLOY_TARGET=59.110.217.36
```

严格按 `deploy/README.md` 第 2–5 节执行：

1. 只读检查远端工具、完整 `nginx -T`、当前 release 和配置哈希；
2. 确认没有未知 server block 影响 `/`、`/lesson49/`、`/lesson50/`、`/lesson51/`、`/lesson54/`、`/soundmark/`；
3. 上传带 `RELEASE_SHA`、`ARCHIVE_SHA`、`CONFIG_SHA` 的不可复用制品；
4. 配置相同时记录 `unchanged`，不做无意义修改；配置不同时使用 runbook 的备份、`nginx -t`、reload 和恢复保护；
5. 在远端锁内完成 staging 校验和 `current` 符号链接原子切换，保留旧 release。

Expected: 输出新的 `atomic content activation` 路径和可回滚的 `CANRAN_PREVIOUS_RELEASE`。

- [ ] **Step 6: 验证精确线上字节并在失败时回滚**

Run:

```bash
test "$(node -p 'require("./dist/release-manifest.json").commit')" = "$(git rev-parse --verify HEAD)"
npm run verify:live:http
```

随后读取远端 manifest 并校验：

```bash
remote_manifest="$(ssh "$CANRAN_DEPLOY_TARGET" 'cat /var/www/canranstudio/current/release-manifest.json')"
RELEASE_SHA="$(git rev-parse --verify HEAD)" REMOTE_MANIFEST="$remote_manifest" \
  node -e 'if(JSON.parse(process.env.REMOTE_MANIFEST).commit!==process.env.RELEASE_SHA)process.exit(1)'
```

Expected: manifest、全部 HTML/JS/CSS/字体/图片/音频、HTTP-only 路由和安全响应头验证全部 PASS。若任一项失败，立即执行 `deploy/README.md` 第 6 节完整内容与配置回滚块，不得只回滚页面文件。

- [ ] **Step 7: 完成生产浏览器回归与上传清理**

在隔离浏览器状态中打开以下地址：

```text
http://59.110.217.36/lesson49/#l5
http://59.110.217.36/lesson50/#l5
http://59.110.217.36/lesson51/#cert
http://59.110.217.36/lesson54/#cert
http://59.110.217.36/soundmark/#cert
```

逐页验证锁定票券、准确计数、首个未满星跳转、取消焦点、满星原证书流程和浏览器控制台。通过后执行 `deploy/README.md` 第 7 节 SHA 限定的上传目录清理，不删除旧 release。

- [ ] **Step 8: 报告最终闭环证据**

最终报告必须包含：

- 功能分支和 `main` 的远端 SHA；
- `release-manifest.json` 的线上 commit；
- `npm test`、`npm run test:deploy`、`npm run verify:live:http` 的通过结果；
- 五个线上 URL；
- 视觉 QA 文档路径；
- 旧 release 仍保留及回滚状态；
- 明确说明生产仍为 HTTP-only，未增加 HTTPS/HSTS。
