'use strict';
const { defineConfig } = require('@playwright/test');
process.env.NO_PROXY = '127.0.0.1,localhost';
process.env.no_proxy = process.env.NO_PROXY;
const testUrl = 'http://127.0.0.1:' + (process.env.LOGIN_TEST_PORT || 4181);
module.exports = defineConfig({
  testDir: './tests/login', workers: 1, timeout: 60000,
  // Keep account traces separate from course checks running in another process.
  outputDir: './output/test-login',
  expect: { timeout: 5000 }, reporter: [['list']],
  use: { baseURL: testUrl, browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: { command: 'node tests/login/server.js', url: testUrl + (process.env.AWARD_TEST_BASE || '/lesson/'), reuseExistingServer: false, timeout: 30000 }
});
