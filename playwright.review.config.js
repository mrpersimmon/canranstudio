'use strict';
const {defineConfig}=require('@playwright/test');
const port=process.env.REVIEW_TEST_PORT||4411;
module.exports=defineConfig({
 testDir:'./tests/review',fullyParallel:false,workers:1,timeout:90000,
 outputDir:'./output/test-review-bench',reporter:[['list']],
 use:{baseURL:'http://127.0.0.1:'+port,viewport:{width:1440,height:1100},trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'webkit',use:{browserName:'webkit'}}],
 webServer:{command:'node scripts/review-bench.js',env:{REVIEW_PORT:String(port),REVIEW_FIXED_BUILD:'1'},url:'http://127.0.0.1:'+port,reuseExistingServer:false,timeout:30000}
});
