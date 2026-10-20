'use strict';
const {test}=require('@playwright/test');
const {banners}=require('../support/home-banners-1730');
test.use({actionTimeout:7000,...(process.env.BANNER_REVIEW_BROWSER==='webkit'?{browserName:'webkit'}:{})});
test('静态首页17–30入口使用现行插画，四宽不裁切且正确链接课程',async({page},info)=>{
 test.setTimeout(120000);await page.goto('/');await banners(page,'/',info);
});
