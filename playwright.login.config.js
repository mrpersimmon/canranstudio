'use strict';
const { defineConfig } = require('@playwright/test');
process.env.NO_PROXY = '127.0.0.1,localhost';
process.env.no_proxy = process.env.NO_PROXY;
module.exports = defineConfig({
  testDir: './tests/login', workers: 1, timeout: 60000,
  expect: { timeout: 5000 }, reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4181', browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: { command: 'node tests/login/server.js', url: 'http://127.0.0.1:4181/lesson/', reuseExistingServer: false, timeout: 30000 }
});
