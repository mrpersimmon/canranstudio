'use strict';

const { defineConfig } = require('@playwright/test');
const { TEST_ORIGIN } = require('./tests/support/test-origin');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: TEST_ORIGIN,
    browserName: 'chromium',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node tests/support/static-server.js',
    url: TEST_ORIGIN,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === '1',
    timeout: 10000
  }
});
