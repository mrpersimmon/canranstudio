'use strict';
const fs = require('node:fs');
const {options} = require('./profile');
async function main() {
  const {executablePath} = options(['--profile=system-chromium']);
  if (!fs.existsSync(executablePath)) throw Error('System Chromium is not installed: ' + executablePath);
  const {chromium} = require('@playwright/test');
  const browser = await chromium.launch({executablePath,headless:true});
  try {
    const page = await browser.newPage();
    await page.setContent('<title>canran-cloud-ready</title><h1>Ready</h1>');
    if (await page.title() !== 'canran-cloud-ready') throw Error('Chromium did not render the readiness page.');
    console.log('System Chromium verified: ' + browser.version());
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
