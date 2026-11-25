'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {hashCode,normalizeOrigin}=require('./private-preview');
async function createAccessFiles({origin,version,configFile,credentialsFile}) {
  origin=normalizeOrigin(origin);
  if(!/^[a-f0-9]{40}$/.test(version||''))throw Error('A full commit SHA is required.');
  const root=path.resolve(__dirname,'..'),targets=[configFile,credentialsFile].map(file=>path.resolve(file));
  if(targets[0]===targets[1])throw Error('Configuration and credentials must use different files.');
  for(const file of targets){const relative=path.relative(root,file);if(!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative)&&!relative.startsWith('output'+path.sep)&&!relative.startsWith('.data'+path.sep))throw Error('Keep private access files outside source control.');
    try{await fs.access(file);throw Error('Refusing to overwrite existing access file: '+file);}catch(error){if(error.code!=='ENOENT')throw error;}
    await fs.mkdir(path.dirname(file),{recursive:true});}
  const code=crypto.randomBytes(18).toString('base64url');
  const config={origin,version,accessHash:await hashCode(code)};
  await fs.writeFile(targets[0],JSON.stringify(config,null,2)+'\n',{flag:'wx',mode:0o600});
  try{await fs.writeFile(targets[1],'私有验收站\n地址：'+origin+'\n验收口令：'+code+'\n版本：'+version+'\n',{flag:'wx',mode:0o600});}
  catch(error){await fs.unlink(targets[0]);throw error;}
  return {configFile:targets[0],credentialsFile:targets[1],version};
}
if(require.main===module)(async()=>{
  const args=process.argv.slice(2),values={};
  while(args.length){const key=args.shift();if(!['--origin','--version','--config','--credentials'].includes(key)||!args.length)throw Error('Use --origin, --version, --config and --credentials.');values[key.slice(2)]=args.shift();}
  if(Object.keys(values).length!==4)throw Error('All four options are required.');
  console.log(JSON.stringify(await createAccessFiles({origin:values.origin,version:values.version,configFile:values.config,credentialsFile:values.credentials}),null,2));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={createAccessFiles};
