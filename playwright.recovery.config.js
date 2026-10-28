'use strict';
const { defineConfig, devices } = require('@playwright/test');
const login = require('./playwright.login.config');

// Exercise Safari's engine with a phone viewport and touch input. This is not
// a substitute for physical iPhone / WeChat acceptance on the deployed build.
module.exports = defineConfig({
  ...login,
  testMatch: ['course-loading-recovery.spec.js', 'course-update-choice.spec.js', 'course-update-performance.spec.js', 'course-worker-upgrade.spec.js', 'journey-touch.spec.js'],
  outputDir: './output/test-recovery-webkit',
  use: { ...login.use, ...devices['iPhone 13'], browserName: 'webkit' }
});
