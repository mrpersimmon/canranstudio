'use strict';
const path=require('node:path');
const port=Number(process.env.LESSON_PORT||4182),origin=process.env.LESSON_ORIGIN||'http://127.0.0.1:'+port;
const dataDir=path.resolve(process.env.LESSON_DATA_DIR||'.data/lesson-access');
const basePath=process.env.LESSON_BASE_PATH||'/lesson/';
const trustProxy=process.env.LESSON_TRUST_PROXY||false;
if(trustProxy!==false&&trustProxy!=='loopback')throw Error('LESSON_TRUST_PROXY must be unset or loopback');
if(process.env.NODE_ENV==='production'&&(!process.env.LESSON_DATA_DIR||!origin.startsWith('https://')||dataDir.startsWith(path.resolve(__dirname,'..')+path.sep)))throw Error('Production requires HTTPS LESSON_ORIGIN and LESSON_DATA_DIR outside the release');
if(process.env.NODE_ENV==='production'&&trustProxy!=='loopback')throw Error('Production requires LESSON_TRUST_PROXY=loopback and the trusted Nginx proxy');
require('./app').createApp({dataDir,origin,trustProxy,basePath}).then(server=>{
 server.listen(port,'127.0.0.1',()=>console.log('Lesson access server: '+origin+basePath));
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
}).catch(error=>{console.error(error.message);process.exitCode=1;});
