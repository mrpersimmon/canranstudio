'use strict';
const {createPrivatePreviewServer,hashCode}=require('../../scripts/private-preview');
const port=Number(process.env.PRIVATE_PREVIEW_TEST_PORT||4417);
(async()=>{process.env.REVIEW_FIXED_BUILD='1';await createPrivatePreviewServer({port,origin:'http://127.0.0.1:'+port,
  version:'a'.repeat(40),accessHash:await hashCode('synthetic-preview-code-123')});console.log('Private preview test server ready');})();
