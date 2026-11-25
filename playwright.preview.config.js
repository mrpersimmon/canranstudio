'use strict';
const {defineConfig}=require('@playwright/test');
const port=process.env.PRIVATE_PREVIEW_TEST_PORT||4417;
module.exports=defineConfig({testDir:'./tests/preview',testMatch:'*.spec.js',workers:1,timeout:90000,
  outputDir:'./output/private-preview-tests',reporter:[['list']],
  use:{baseURL:'http://127.0.0.1:'+port,trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'webkit',use:{browserName:'webkit'}}],
  webServer:{command:'node tests/preview/server.js',url:'http://127.0.0.1:'+port+'/_preview/login',
    env:{PRIVATE_PREVIEW_TEST_PORT:String(port)},reuseExistingServer:false,timeout:60000}
});
