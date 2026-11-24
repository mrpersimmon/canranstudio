'use strict';
// Setting a file is an explicit opt-in. The destination cannot be supplied by the environment.
const {test:baseTest}=require('@playwright/test'),{provision,origin}=require('./first-course-preview-student');
const adminFile=process.env.ART_FONT_PREVIEW_ADMIN_FILE,proxy=process.env.ART_FONT_PREVIEW_PROXY;
if(adminFile&&proxy&&!/^http:\/\/127\.0\.0\.1:\d+$/.test(proxy))throw Error('Expected a loopback preview connection');
const preview=Boolean(adminFile),base=preview?origin+'/':'/lesson/';
const test=baseTest.extend({temporaryStudent:async({},use)=>{
 const owner=preview?await provision(adminFile,proxy):null;
 try{await use(owner?.account);}finally{await owner?.close();}
}});
module.exports={test,preview,base,previewOptions:preview?{baseURL:origin,...(proxy?{proxy:{server:proxy}}:{})}:{}};
