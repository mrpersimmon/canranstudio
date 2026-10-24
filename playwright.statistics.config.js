'use strict';
const { defineConfig, devices } = require('@playwright/test');
const login = require('./playwright.login.config');

module.exports = defineConfig({
  ...login,
  testMatch: ['submission-statistics.spec.js', 'settlement-sequence.spec.js'],
  outputDir: './output/test-statistics',
  projects: [
    { name: 'chromium', use: { ...login.use, browserName: 'chromium' } },
    { name: 'webkit-phone', use: { ...login.use, ...devices['iPhone 13'], browserName: 'webkit' } }
  ]
});
