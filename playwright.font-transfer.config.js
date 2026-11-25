'use strict';
const {defineConfig}=require('@playwright/test'),login=require('./playwright.login.config');
module.exports=defineConfig({
  ...login,
  testDir:'./tests/performance',
  testMatch:['font-navigation.spec.js','illustration-transport.spec.js'],
  workers:1,
  outputDir:'./output/font-navigation',
  webServer:process.env.ART_FONT_PREVIEW_ADMIN_FILE ? undefined : login.webServer,
  use:{...login.use,trace:'off',screenshot:'off',video:'off'}
});
