'use strict';
const {defineConfig}=require('@playwright/test'),login=require('./playwright.login.config');
module.exports=defineConfig({...login,testMatch:['local-awards.spec.js','settlement-sequence.spec.js','award-reveal.spec.js'],outputDir:'./output/test-local-awards',projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'webkit',use:{browserName:'webkit'}}]});
