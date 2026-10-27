'use strict';
const {defineConfig}=require('@playwright/test');
process.env.VIEWPORT_TEST_ENABLED='1';
const login=require('./playwright.login.config');
module.exports=defineConfig({
  ...login,testMatch:'viewport-metrics.spec.js',outputDir:'./output/test-viewports',
  use:{...login.use,browserName:process.env.VIEWPORT_TEST_BROWSER||'chromium'}
});
