'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const PROOF = 'test-results/readability-proof.json';
const VIEWPORTS = [[320,568],[420,856],[906,801],[1440,900]];
const ACTIVITY_IDS = Object.keys(require('../content/learning-course.json').activities);
const TEACH_IDS = Object.values(require('../content/learning-course.json').activities).filter(a=>a.kind==='teach').map(a=>a.id);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function fingerprint(prepared, root = ROOT) {
  const sources = new Map(prepared.sources);
  for (const dir of ['tests/browser']) for (const file of fs.readdirSync(path.join(root, dir))) {
    sources.set(dir + '/' + file, fs.readFileSync(path.join(root, dir, file)));
  }
  for (const file of ['scripts/visual-proof.js','scripts/serve-visual-check.js','scripts/run-browser-check.js','package.json','package-lock.json']) {
    sources.set(file, fs.readFileSync(path.join(root, file)));
  }
  return hash([...sources].sort(([a],[b])=>a.localeCompare(b)).map(([name,bytes])=>name+':'+hash(bytes)).join('\n'));
}
function validateReport(report) {
  if (report?.schema !== 1 || report.status !== 'passed' || !Array.isArray(report.checks) || !report.checks.length) throw Error('Browser readability check failed or did not finish');
  if (report.checks.some(check=>!Array.isArray(check.errors)||check.errors.length)) throw Error('Browser readability violations remain');
  if (report.checks.some(check=>check.expectedTheme!=='dark'||check.canvas!=='rgb(20, 31, 35)')) throw Error('Screens do not share the approved dark theme');
  for (const viewport of VIEWPORTS) {
    const cases = report.checks.filter(check=>String(check.viewport)===String(viewport));
    for (const name of ['loader','map','story-two-lines','references','celebration','review-complete','blocked','save-failure','map-return','reload-map']) {
      if (!cases.some(check=>check.name===name)) throw Error('Missing browser coverage: '+viewport+' / '+name);
    }
    const covered=new Set(cases.filter(c=>c.activityId).map(c=>c.activityId));
    if(ACTIVITY_IDS.some(id=>!covered.has(id)))throw Error('Missing authored activity coverage: '+viewport);
    if(TEACH_IDS.some(id=>!cases.some(c=>c.name==='words-queued-'+id)||!cases.some(c=>c.name==='words-heard-'+id)))throw Error('Missing rapid-tap coverage: '+viewport);
    const map=cases.find(c=>c.name==='map');
    if(!map.journeyLayout?.gaps?.length||map.journeyLayout.gaps.some(gap=>Math.abs(gap-map.journeyLayout.pitch)>1))throw Error('Missing or uneven map geometry: '+viewport);
  }
  if (!['white-on-light','dark-multiply','missing-image','opaque-art','theme-discontinuity','uneven-node-spacing'].every(name=>report.mutations?.some(m=>m.name===name&&m.caught))) throw Error('Readability guard did not detect its negative controls');
}
function assertVisualProof(prepared, root = ROOT) {
  let proof;
  try { proof = JSON.parse(fs.readFileSync(path.join(root, PROOF))); }
  catch { throw Error('No browser readability proof. Run npm run visual:serve and open its local check page, or npm run test:browser.'); }
  validateReport(proof);
  if (proof.fingerprint !== fingerprint(prepared, root)) throw Error('Browser proof is stale: code, styles, assets or tests changed. Re-run the browser check.');
  return proof;
}
module.exports = { ROOT, PROOF, VIEWPORTS, fingerprint, validateReport, assertVisualProof };
if(require.main===module){
  try{const proof=assertVisualProof(require('./build-learning-path-release').prepare());process.stdout.write('Browser readability proof valid: '+proof.checks.length+' states\n');}
  catch(error){process.stderr.write(error.message+'\n');process.exitCode=1;}
}
