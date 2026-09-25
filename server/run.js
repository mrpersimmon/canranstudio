'use strict';
const path=require('node:path');
const port=Number(process.env.LESSON_PORT||4182),origin=process.env.LESSON_ORIGIN||'http://127.0.0.1:'+port;
const dataDir=path.resolve(process.env.LESSON_DATA_DIR||'.data/lesson-access');
if(process.env.NODE_ENV==='production'&&(!process.env.LESSON_DATA_DIR||!origin.startsWith('https://')||dataDir.startsWith(path.resolve(__dirname,'..')+path.sep)))throw Error('Production requires HTTPS LESSON_ORIGIN and LESSON_DATA_DIR outside the release');
require('./app').createApp({dataDir,origin}).then(server=>{
 server.listen(port,'127.0.0.1',()=>console.log('Lesson access server: '+origin+'/lesson/'));
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
}).catch(error=>{console.error(error.message);process.exitCode=1;});
