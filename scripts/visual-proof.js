'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const PROOF = 'test-results/readability-proof.json';
const VIEWPORTS = [[320,568],[420,856],[906,801],[1440,900]];
const ACTIVITY_IDS = Object.keys(require('../content/learning-course.json').activities);
const TEACH_IDS = Object.values(require('../content/learning-course.json').activities).filter(a=>a.kind==='teach').map(a=>a.id);
const NODE_IDS = require('../content/learning-course.json').nodes.map(node=>node.id);
const CHALLENGES = require('../content/learning-course.json').challenges;
const CHALLENGE_SCREENS = ['challenge-menu','reset-confirm-course','reset-confirm-challenges','reset-cancelled','reset-challenges-saved','reset-undo','reset-failed','reset-course-saved','reset-reload','reset-undo-restored',
  ...CHALLENGES.flatMap(c=>['challenge-intro-','challenge-complete-','challenge-return-','challenge-draft-restored-','challenge-node-preview-','challenge-finished-intro-','reset-confirm-single-','reset-single-'].map(prefix=>prefix+c.id))];
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function fingerprint(prepared, root = ROOT) {
  const sources = new Map(prepared.sources);
  for (const dir of ['tests/browser']) for (const file of fs.readdirSync(path.join(root, dir))) {
    sources.set(dir + '/' + file, fs.readFileSync(path.join(root, dir, file)));
  }
  for (const file of ['scripts/visual-proof.js','scripts/serve-visual-check.js','scripts/run-browser-check.js','scripts/verify-course-media.js','package.json','package-lock.json']) {
    sources.set(file, fs.readFileSync(path.join(root, file)));
  }
  return hash([...sources].sort(([a],[b])=>a.localeCompare(b)).map(([name,bytes])=>name+':'+hash(bytes)).join('\n'));
}
function validateReport(report) {
  if (report?.schema !== 1 || report.status !== 'passed' || !Array.isArray(report.checks) || !report.checks.length) throw Error('Browser readability check failed or did not finish');
  if (report.checks.some(check=>!Array.isArray(check.errors)||check.errors.length)) throw Error('Browser readability violations remain');
  if (report.checks.some(check=>check.expectedTheme!=='dark'||check.canvas!=='rgb(20, 31, 35)')) throw Error('Screens do not share the approved dark theme');
  if (report.checks.some(check=>{
    const g=check.viewportGeometry;
    return !g || !['width','contentWidth','scrollWidth','scrollbarWidth'].every(key=>Number.isFinite(g[key]))
      || g.width!==check.viewport[0] || g.contentWidth<=0 || g.scrollbarWidth<1
      || Math.abs(g.width-g.contentWidth-g.scrollbarWidth)>1 || g.scrollWidth>g.contentWidth+1;
  })) throw Error('Missing reserved-scrollbar coverage or horizontal overflow remains');
  for (const viewport of VIEWPORTS) {
    const cases = report.checks.filter(check=>String(check.viewport)===String(viewport));
    for (const name of ['loader','map','story-two-lines','references','celebration','replay-complete','replay-return-map','review-complete','review-return-map','blocked','save-failure','map-return','reload-map',...NODE_IDS.map(id=>'completion-return-'+id),...CHALLENGE_SCREENS]) {
      if (!cases.some(check=>check.name===name)) throw Error('Missing browser coverage: '+viewport+' / '+name);
    }
    for (const check of cases.filter(c=>['celebration','replay-complete','review-complete'].includes(c.name) || c.name.startsWith('challenge-complete-'))) {
      if (check.completionBoundary?.action !== 'map' || !check.completionBoundary.inViewport) throw Error('Completion must offer a visible return to the path: '+viewport);
      if (check.sessionProgress?.label !== '本次闯关进度' || check.sessionProgress.total<=0 || check.sessionProgress.completed !== check.sessionProgress.total) throw Error('Completion must show a completed session, not the route: '+viewport);
    }
    for(const c of CHALLENGES) for(const q of c.questions) for(const prefix of ['challenge-empty-','challenge-filled-','challenge-correct-'])
      if(!cases.some(check=>check.name===prefix+q.id))throw Error('Missing written challenge state: '+viewport+' / '+prefix+q.id);
    const covered=new Set(cases.filter(c=>c.activityId).map(c=>c.activityId));
    if(ACTIVITY_IDS.some(id=>!covered.has(id)))throw Error('Missing authored activity coverage: '+viewport);
    if(TEACH_IDS.some(id=>!cases.some(c=>c.name==='words-queued-'+id)||!cases.some(c=>c.name==='words-heard-'+id)))throw Error('Missing rapid-tap coverage: '+viewport);
    const map=cases.find(c=>c.name==='map');
    if(!map.journeyLayout?.gaps?.length||map.journeyLayout.gaps.some(gap=>Math.abs(gap-map.journeyLayout.pitch)>1))throw Error('Missing or uneven map geometry: '+viewport);
    if(!map.centeredIcons?.some(icon=>icon.action==='journey-locate') || map.centeredIcons.some(icon=>Math.abs(icon.x)>1 || Math.abs(icon.y)>1))throw Error('Missing or uncentered icon geometry: '+viewport);
  }
  if (!['white-on-light','dark-multiply','missing-image','opaque-art','theme-discontinuity','uneven-node-spacing','completion-skips-map','completion-button-offscreen','off-center-arrow','route-progress-in-lesson','scrollbar-width-overflow','low-contrast-sticky-title','covered-sticky-title'].every(name=>report.mutations?.some(m=>m.name===name&&m.caught))) throw Error('Readability guard did not detect its negative controls');
}
function assertVisualProof(prepared, root = ROOT) {
  let proof;
  try { proof = JSON.parse(fs.readFileSync(path.join(root, PROOF))); }
  catch { throw Error('No browser readability proof. Run npm run visual:serve and open its local check page, or npm run test:browser.'); }
  validateReport(proof);
  if (proof.fingerprint !== fingerprint(prepared, root)) throw Error('Browser proof is stale: code, styles, assets or tests changed. Re-run the browser check.');
  return proof;
}
module.exports = { ROOT, PROOF, VIEWPORTS, CHALLENGE_SCREENS, fingerprint, validateReport, assertVisualProof };
if(require.main===module){
  try{const proof=assertVisualProof(require('./build-learning-path-release').prepare());process.stdout.write('Browser readability proof valid: '+proof.checks.length+' states\n');}
  catch(error){process.stderr.write(error.message+'\n');process.exitCode=1;}
}
