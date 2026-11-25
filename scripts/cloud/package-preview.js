'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const zlib=require('node:zlib'),{pipeline}=require('node:stream/promises');
const root=path.resolve(__dirname,'../..');
async function main() {
  const revision=process.argv[2];
  if(!/^[a-f0-9]{40}$/.test(revision||''))throw Error('Pass the exact committed source SHA.');
  const resolved=execFileSync('git',['rev-parse','--verify',revision+'^{commit}'],{cwd:root,encoding:'utf8'}).trim();
  if(resolved!==revision)throw Error('Commit mismatch.');
  const out=path.join(root,'output/preview-package',revision);await fs.mkdir(out,{recursive:true});
  const tar=path.join(out,'source.tar'),archive=path.join(out,'canran-preview.tar.gz');
  // Archive Git bytes only. No working-tree changes, .data, secrets, reports, or production database.
  const entries=['package.json','package-lock.json','.npmrc','core','assets','server','scripts','review-bench',
    'tests/support/required-phone-devices.json'];
  const directories=execFileSync('git',['ls-tree','--name-only',revision],{cwd:root,encoding:'utf8'}).trim().split('\n');
  entries.push(...directories.filter(name=>/^unit\d+-\d+$/.test(name)));
  if(entries.filter(name=>name.startsWith('unit')).length!==72)throw Error('Expected all 72 teaching units.');
  execFileSync('git',['archive','--format=tar','--output='+tar,revision,'--',...entries],{cwd:root,stdio:'inherit'});
  const metadata=path.join(out,'metadata');await fs.mkdir(metadata,{recursive:true});
  await fs.writeFile(path.join(metadata,'preview-release.json'),JSON.stringify({commit:revision,units:72})+'\n');
  execFileSync('tar',['-rf',tar,'-C',metadata,'preview-release.json'],{cwd:root,stdio:'inherit'});
  await pipeline(require('node:fs').createReadStream(tar),zlib.createGzip({level:6}),require('node:fs').createWriteStream(archive));
  const hash=crypto.createHash('sha256');for await(const chunk of require('node:fs').createReadStream(archive))hash.update(chunk);
  const manifest={schema:1,commit:revision,archive:'canran-preview.tar.gz',sha256:hash.digest('hex'),bytes:(await fs.stat(archive)).size,units:72};
  await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({directory:out,...manifest},null,2));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
