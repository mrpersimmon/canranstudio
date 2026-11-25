'use strict';
const path = require('node:path');
const REVIEW_FILES = Object.freeze([
  'tests/review/layout-refinement.spec.js',
  'tests/review/state-switch.spec.js',
  'tests/review/course-ending.spec.js',
  'tests/review/word-art.spec.js'
]);
function options(argv = [], env = process.env) {
  let profile = 'full', browserOnly = false;
  for (const arg of argv) {
    if (arg.startsWith('--profile=')) profile = arg.slice(10);
    else if (arg === '--browser-only') browserOnly = true;
    else throw Error('Unknown cloud check option: ' + arg);
  }
  if (!['full', 'system-chromium', 'webkit'].includes(profile)) throw Error('Unknown browser profile: ' + profile);
  const executablePath = env.CLOUD_CHROMIUM_EXECUTABLE_PATH || (process.platform === 'linux' ? '/usr/bin/chromium' : '');
  if (profile === 'system-chromium' && (!executablePath || !path.isAbsolute(executablePath))) {
    throw Error('System Chromium requires an absolute CLOUD_CHROMIUM_EXECUTABLE_PATH.');
  }
  return {profile, browserOnly, executablePath:profile === 'system-chromium' ? executablePath : null};
}
function browserArgs(settings) {
  const projects = settings.profile === 'full' ? ['chromium','webkit'] : [settings.profile === 'webkit' ? 'webkit' : 'chromium'];
  return ['node_modules/@playwright/test/cli.js','test','-c','playwright.cloud.config.js',
    ...REVIEW_FILES, ...projects.map(project=>'--project='+project),'--workers=1','--forbid-only',
    '--output=output/cloud-development/'+settings.profile+'/browser'];
}
module.exports = {REVIEW_FILES, options, browserArgs};
