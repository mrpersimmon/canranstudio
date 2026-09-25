'use strict';

const { defineConfig } = require('@playwright/test');
const testUrl = 'http://127.0.0.1:' + (process.env.COURSE_TEST_PORT || 4173);

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: testUrl,
    browserName: 'chromium',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node tests/support/static-server.js',
    url: testUrl,
    reuseExistingServer: false,
    timeout: 10000
  }
});
