# 网站发布指南

发布是把已检查的版本放到正式网站。修改文件、本地测试、提交代码和上线是不同步骤。

正式地址配置为 [www.canranstudio.cn](https://www.canranstudio.cn)。直接访问服务器地址 `http://59.110.217.36` 时会跳转到 HTTPS 加密网站；加密连接与强制加密规则（HSTS）由仓库外的正式站点配置管理。

当前 `codex/butcher-version` 使用独立的 `/lesson/` 入口，按[子目录发布说明](../docs/butcher-version/2026-09-20-0109-v1.2-lesson子目录发布.md)操作。下方根目录切换命令不用于覆盖现有官网首页。

缓存改造按[网页加载缓存设计](../docs/butcher-version/publish/2026-09-24-2031-v1.0-网页加载缓存设计.md)实施并验收。本地代码和子目录配置已准备，尚未部署。下一次子目录发布须先把固定资源加入长期存储，再切换入口；具体步骤见该文档第 9 节，不能只上传 HTML。

## 先看流程

| 顺序 | 做什么 | 完成后应看到什么 |
| --- | --- | --- |
| 1 | 检查并打包已提交版本 | 发布包与提交号、文件校验值一致 |
| 2 | 查看服务器现有配置 | 明确当前版本和受影响的站点配置 |
| 3 | 上传固定发布包 | 新建的专用上传目录，不覆盖旧包 |
| 4 | 检查并启用站点配置 | 配置检查、重新加载均成功 |
| 5 | 切换网站内容 | 当前版本入口指向新发布目录，旧版仍保留 |
| 6 | 核对线上文件 | 与第 1 步发布包一致；失败则回退 |
| 7 | 清理临时上传文件 | 只删除本次已核对的临时文件 |

需要 Node.js 20+、Python 3、服务器连接权限和已配置的 `CANRAN_DEPLOY_TARGET`。这是 SSH 连接别名或主机名，不填写密码。所有步骤在项目根目录按顺序执行，使用同一已提交版本。

公开路由：`/`、`/lesson49/`、`/lesson50/`、`/lesson51/`、`/lesson52/`、`/lesson53/`、`/lesson54/`、`/soundmark/`；`/home/` 是兼容入口。

“提交号”是这次代码版本的 40 位标识；“校验值”用于确认文件没有变化；`current` 是服务器指向当前版本的入口。配置更新与内容切换分开进行，只有内容切换是一次完成的操作。

## 维护者操作

下面保留完整命令。每步报错就停在该步，按报错处理后再继续。初次建站没有可回退旧版时，需要单独设计首次部署，不能套用下面的常规更新流程。

### 1. 检查和打包

先通过测试，并确保待发布文件已提交、工作区干净。打包后记下提交号和两个校验值；记录后不要重新生成发布包。

<details>
<summary>展开完整命令</summary>

~~~bash
set -euo pipefail
require_sha() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{40}$'; }
require_sha256() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{64}$'; }
require_target() { printf '%s' "$1" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._-]*$'; }
sha256_file() { shasum -a 256 "$1" | awk '{print $1}'; }

verify_artifact() {
  RELEASE_SHA="$RELEASE_SHA" ARTIFACT_ROOT="$1" node <<'NODE'
'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(process.env.ARTIFACT_ROOT);
const commit = process.env.RELEASE_SHA;
const sha = value => typeof value === 'string' && /^[0-9a-f]{40}$/.test(value);
const hash = value => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
const safe = value => typeof value === 'string' && value && value === path.posix.normalize(value) &&
  !value.startsWith('../') && !path.posix.isAbsolute(value) && !value.split('/').includes('..');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function walk(dir, prefix, files, dirs) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const relative = prefix ? path.posix.join(prefix, entry.name) : entry.name;
    const stat = await fs.lstat(path.join(dir, entry.name));
    if (stat.isSymbolicLink()) throw new Error('symbolic link: ' + relative);
    if (stat.isDirectory()) { dirs.add(relative); await walk(path.join(dir, entry.name), relative, files, dirs); }
    else if (stat.isFile()) files.add(relative);
    else throw new Error('special entry: ' + relative);
  }
}
(async () => {
  if (!sha(commit)) throw new Error('bad release SHA');
  const rootStat = await fs.lstat(root);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) throw new Error('bad root');
  const manifestPath = path.join(root, 'release-manifest.json');
  const manifestStat = await fs.lstat(manifestPath);
  if (!manifestStat.isFile() || manifestStat.isSymbolicLink()) throw new Error('bad manifest file');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  if (!manifest || Object.keys(manifest).sort().join(',') !== 'commit,files,schema' ||
      manifest.schema !== 1 || manifest.commit !== commit || !manifest.files || Array.isArray(manifest.files)) {
    throw new Error('bad manifest');
  }
  const declared = Object.keys(manifest.files);
  if (!declared.length || declared.includes('release-manifest.json')) throw new Error('bad manifest files');
  for (const file of declared) if (!safe(file) || !hash(manifest.files[file])) throw new Error('bad manifest entry');
  const files = new Set(), dirs = new Set(); await walk(root, '', files, dirs);
  const expectedFiles = new Set(declared.concat('release-manifest.json')), expectedDirs = new Set();
  for (const file of declared) for (let parent = path.posix.dirname(file); parent !== '.'; parent = path.posix.dirname(parent)) expectedDirs.add(parent);
  const same = (a, b) => a.size === b.size && [...a].every(value => b.has(value));
  if (!same(files, expectedFiles) || !same(dirs, expectedDirs)) throw new Error('tree differs from manifest');
  for (const file of declared) if (digest(await fs.readFile(path.join(root, file))) !== manifest.files[file]) throw new Error('hash mismatch: ' + file);
  process.stdout.write('artifact verified: ' + root + '\n');
})().catch(error => { process.stderr.write(error.message + '\n'); process.exitCode = 1; });
NODE
}

npm ci
npx playwright install chromium
npm test
npm run test:deploy
npm run build:static
git diff --check
git diff --quiet
git diff --cached --quiet
test "$(git status --short)" = ""

RELEASE_SHA="$(git rev-parse --verify HEAD)"
require_sha "$RELEASE_SHA"
test "$(node -p 'require("./dist/release-manifest.json").commit')" = "$RELEASE_SHA"
verify_artifact dist

RELEASE_ARCHIVE="/tmp/canranstudio-$RELEASE_SHA.tar.gz"
COPYFILE_DISABLE=1 tar -C dist -czf "$RELEASE_ARCHIVE" .
check_dir="$(mktemp -d /tmp/canranstudio-archive-check.XXXXXX)"
trap 'rm -rf -- "$check_dir"' EXIT
python3 - "$RELEASE_ARCHIVE" "$check_dir" <<'PYARCHIVE'
import posixpath,sys,tarfile
archive,check_dir=sys.argv[1:]
def bad(message): raise SystemExit(message)
with tarfile.open(archive,'r:gz') as tar:
 members=tar.getmembers()
 if not members: bad('empty archive')
 seen=set()
 for member in members:
  raw=member.name
  while raw.startswith('./'): raw=raw[2:]
  name=posixpath.normpath(raw) if raw else '.'
  parts=name.split('/')
  if name.startswith('/') or name=='..' or name.startswith('../') or '..' in parts: bad('unsafe tar path')
  if name in seen: bad('duplicate tar member')
  seen.add(name)
  if any(part.startswith('._') for part in parts): bad('AppleDouble tar member')
  if name=='.':
   if not member.isdir(): bad('invalid tar root')
  elif not (member.isfile() or member.isdir()): bad('link or special tar member')
 tar.extractall(check_dir,members)
PYARCHIVE
verify_artifact "$check_dir"
rm -rf -- "$check_dir"
trap - EXIT
ARCHIVE_SHA="$(sha256_file "$RELEASE_ARCHIVE")"
CONFIG_SHA="$(sha256_file deploy/nginx/canranstudio-http.conf)"
require_sha256 "$ARCHIVE_SHA"
require_sha256 "$CONFIG_SHA"
require_target "$CANRAN_DEPLOY_TARGET"
printf 'release=%s archive=%s config=%s\n' "$RELEASE_SHA" "$ARCHIVE_SHA" "$CONFIG_SHA"
~~~

</details>

### 2. 只读检查服务器

检查所有能响应目标 IP 和端口的站点，尤其是默认站点、重写、别名和根目录。处理旧站点前，由维护者核对具体文件、备份并明确批准；不能猜测要停用哪个配置。确认相关内容站点关闭文件缓存，才可只切换内容而不重载。

<details>
<summary>展开完整命令</summary>

~~~bash
set -euo pipefail
require_target() { printf '%s' "$1" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._-]*$'; }
test -n "${CANRAN_DEPLOY_TARGET:-}"
require_target "$CANRAN_DEPLOY_TARGET"
ssh "$CANRAN_DEPLOY_TARGET" 'set -eu; command -v python3; command -v sha256sum; command -v tar; command -v find; command -v nginx; command -v systemctl'
ssh "$CANRAN_DEPLOY_TARGET" 'sudo nginx -T 2>&1'
ssh "$CANRAN_DEPLOY_TARGET" 'readlink -f /var/www/canranstudio/current || true'
ssh "$CANRAN_DEPLOY_TARGET" 'sudo sha256sum /etc/nginx/conf.d/canranstudio-http.conf 2>/dev/null || true'
~~~

</details>

### 3. 上传发布包

每次上传使用包含校验值的新目录；目录已存在时停止，不能复用覆盖。

<details>
<summary>展开完整命令</summary>

~~~bash
set -euo pipefail
require_sha() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{40}$'; }; require_sha256() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{64}$'; }; require_target() { printf '%s' "$1" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._-]*$'; }; sha256_file() { shasum -a 256 "$1" | awk '{print $1}'; }
for tool in git shasum ssh scp; do command -v "$tool" >/dev/null; done
test -n "${CANRAN_DEPLOY_TARGET:-}"; require_target "$CANRAN_DEPLOY_TARGET"
RELEASE_SHA="$(git rev-parse --verify HEAD)"; RELEASE_ARCHIVE="/tmp/canranstudio-$RELEASE_SHA.tar.gz"; test -f "$RELEASE_ARCHIVE"
ARCHIVE_SHA="$(sha256_file "$RELEASE_ARCHIVE")"; CONFIG_SHA="$(sha256_file deploy/nginx/canranstudio-http.conf)"
require_sha "$RELEASE_SHA"; require_sha256 "$ARCHIVE_SHA"; require_sha256 "$CONFIG_SHA"

ssh "$CANRAN_DEPLOY_TARGET" "bash -s -- $RELEASE_SHA $ARCHIVE_SHA $CONFIG_SHA" <<'REMOTE'
set -euo pipefail
release_sha=$1; archive_sha=$2; config_sha=$3
printf '%s' "$release_sha" | grep -Eq '^[0-9a-f]{40}$'
printf '%s' "$archive_sha" | grep -Eq '^[0-9a-f]{64}$'
printf '%s' "$config_sha" | grep -Eq '^[0-9a-f]{64}$'
upload_dir="/var/tmp/canranstudio-upload-$release_sha-$archive_sha-$config_sha"
umask 077
mkdir -m 700 -- "$upload_dir"
REMOTE

UPLOAD_DIR="/var/tmp/canranstudio-upload-$RELEASE_SHA-$ARCHIVE_SHA-$CONFIG_SHA"
REMOTE_ARCHIVE="$UPLOAD_DIR/release-$RELEASE_SHA-$ARCHIVE_SHA.tar.gz"
REMOTE_CONFIG="$UPLOAD_DIR/nginx-$RELEASE_SHA-$CONFIG_SHA.conf"
scp "$RELEASE_ARCHIVE" "$CANRAN_DEPLOY_TARGET:$REMOTE_ARCHIVE"
scp deploy/nginx/canranstudio-http.conf "$CANRAN_DEPLOY_TARGET:$REMOTE_CONFIG"
~~~

</details>

### 4. 启用站点配置

只处理本仓库负责的配置文件。已有配置先备份；语法检查或重新加载失败时，命令恢复原配置并再次检查。成功后保留回退状态文件。

<details>
<summary>展开完整命令</summary>

~~~bash
set -euo pipefail
require_sha() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{40}$'; }; require_sha256() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{64}$'; }; require_target() { printf '%s' "$1" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._-]*$'; }; sha256_file() { shasum -a 256 "$1" | awk '{print $1}'; }
for tool in git shasum ssh; do command -v "$tool" >/dev/null; done
test -n "${CANRAN_DEPLOY_TARGET:-}"; require_target "$CANRAN_DEPLOY_TARGET"
RELEASE_SHA="$(git rev-parse --verify HEAD)"; RELEASE_ARCHIVE="/tmp/canranstudio-$RELEASE_SHA.tar.gz"; test -f "$RELEASE_ARCHIVE"
ARCHIVE_SHA="$(sha256_file "$RELEASE_ARCHIVE")"; CONFIG_SHA="$(sha256_file deploy/nginx/canranstudio-http.conf)"
require_sha "$RELEASE_SHA"; require_sha256 "$ARCHIVE_SHA"; require_sha256 "$CONFIG_SHA"

ssh "$CANRAN_DEPLOY_TARGET" "bash -s -- $RELEASE_SHA $ARCHIVE_SHA $CONFIG_SHA" <<'REMOTE'
set -euo pipefail
release_sha=$1; archive_sha=$2; config_sha=$3
printf '%s' "$release_sha" | grep -Eq '^[0-9a-f]{40}$'
printf '%s' "$archive_sha" | grep -Eq '^[0-9a-f]{64}$'
printf '%s' "$config_sha" | grep -Eq '^[0-9a-f]{64}$'
upload_dir="/var/tmp/canranstudio-upload-$release_sha-$archive_sha-$config_sha"
candidate="$upload_dir/nginx-$release_sha-$config_sha.conf"
state="$upload_dir/config-state-$release_sha-$config_sha"
active=/etc/nginx/conf.d/canranstudio-http.conf
had_active=0
old_sha=''
if sudo test -e "$active" || sudo test -L "$active"; then
  had_active=1
  old_sha="$(sudo sha256sum "$active" | awk '{print $1}')"
  printf '%s' "$old_sha" | grep -Eq '^[0-9a-f]{64}$'
  if test "$old_sha" = "$config_sha"; then printf 'unchanged\n\n\n' > "$state"; echo 'approved configuration already active'; exit 0; fi
fi
test "$(sha256sum "$candidate" | awk '{print $1}')" = "$config_sha"
if test "$had_active" -eq 1; then
  backup="/etc/nginx/conf.d/.canranstudio-http.conf-$config_sha-$old_sha.predeploy"
  sudo test ! -e "$backup"
  sudo cp -p -- "$active" "$backup"
fi
restore_config() {
  if test "$had_active" -eq 1; then sudo cp -p -- "$backup" "$active"; else sudo rm -f -- "$active"; fi
  sudo nginx -t
  sudo systemctl reload nginx
}
sudo install -m 0644 -- "$candidate" "$active"
if ! sudo nginx -t; then restore_config; echo 'candidate syntax failed; configuration restored' >&2; exit 1; fi
if ! sudo systemctl reload nginx; then restore_config; echo 'candidate reload failed; configuration restored' >&2; exit 1; fi
echo "active configuration SHA-256: $config_sha"
if test "$had_active" -eq 1; then printf 'present\n%s\n%s\n' "$backup" "$old_sha" > "$state"; else printf 'absent\n\n\n' > "$state"; fi
echo "configuration rollback state: $state"
REMOTE
~~~

</details>

### 5. 切换网站内容

仅在第 4 步配置校验值一致、当前旧版有效时执行。检查压缩包、文件清单和每个文件后，一次切换 current。保存输出中的 CANRAN_PREVIOUS_RELEASE 和 CANRAN_CONFIG_STATE；不要删除旧发布目录。此步不改服务器配置，也不重新加载 Nginx。

<details>
<summary>展开完整命令</summary>

~~~bash
set -euo pipefail
require_sha() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{40}$'; }; require_sha256() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{64}$'; }; require_target() { printf '%s' "$1" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._-]*$'; }; sha256_file() { shasum -a 256 "$1" | awk '{print $1}'; }
for tool in git shasum ssh; do command -v "$tool" >/dev/null; done
test -n "${CANRAN_DEPLOY_TARGET:-}"; require_target "$CANRAN_DEPLOY_TARGET"
RELEASE_SHA="$(git rev-parse --verify HEAD)"; RELEASE_ARCHIVE="/tmp/canranstudio-$RELEASE_SHA.tar.gz"; test -f "$RELEASE_ARCHIVE"
ARCHIVE_SHA="$(sha256_file "$RELEASE_ARCHIVE")"; CONFIG_SHA="$(sha256_file deploy/nginx/canranstudio-http.conf)"
require_sha "$RELEASE_SHA"; require_sha256 "$ARCHIVE_SHA"; require_sha256 "$CONFIG_SHA"

ssh "$CANRAN_DEPLOY_TARGET" "bash -s -- $RELEASE_SHA $ARCHIVE_SHA $CONFIG_SHA" <<'REMOTE'
set -euo pipefail
release_sha=$1; archive_sha=$2; config_sha=$3
is_sha() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{40}$'; }
is_sha256() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{64}$'; }
is_sha "$release_sha"; is_sha256 "$archive_sha"; is_sha256 "$config_sha"
site_root=/var/www/canranstudio
releases="$site_root/releases"
current="$site_root/current"
lock="$releases/.deploy.lock"
upload="/var/tmp/canranstudio-upload-$release_sha-$archive_sha-$config_sha"
archive="$upload/release-$release_sha-$archive_sha.tar.gz"
active=/etc/nginx/conf.d/canranstudio-http.conf
candidate="$releases/$release_sha"
stage="$releases/.$release_sha-$archive_sha.staging.$$"
next_link="$site_root/.current.$release_sha.$$.new"
lock_owned=0

verify_tree() {
  sudo python3 - "$1" "$2" <<'PYTREE'
import hashlib,json,os,posixpath,re,stat,sys
root,commit=sys.argv[1:]
def bad(message): raise SystemExit(message)
def pairs(items):
 out={}
 for key,value in items:
  if key in out: bad('duplicate JSON key')
  out[key]=value
 return out
def safe(value): return isinstance(value,str) and value and value==posixpath.normpath(value) and not value.startswith('/') and not value.startswith('../') and '..' not in value.split('/')
root_mode=os.lstat(root).st_mode
if not stat.S_ISDIR(root_mode) or stat.S_ISLNK(root_mode): bad('bad root')
manifest_path=os.path.join(root,'release-manifest.json')
if not stat.S_ISREG(os.lstat(manifest_path).st_mode): bad('bad manifest file')
with open(manifest_path,encoding='utf8') as handle: manifest=json.load(handle,object_pairs_hook=pairs)
if set(manifest)!={'schema','commit','files'} or manifest['schema']!=1 or manifest['commit']!=commit or not isinstance(manifest['files'],dict) or not manifest['files']: bad('bad manifest')
files=manifest['files']
if 'release-manifest.json' in files: bad('self manifest')
for name,digest in files.items():
 if not safe(name) or not isinstance(digest,str) or not re.fullmatch('[0-9a-f]{64}',digest): bad('bad manifest entry')
actual_files=set(); actual_dirs=set()
for base,dirs,names in os.walk(root,topdown=True,followlinks=False):
 for name in dirs:
  absolute=os.path.join(base,name); mode=os.lstat(absolute).st_mode
  if not stat.S_ISDIR(mode) or stat.S_ISLNK(mode): bad('bad directory entry')
  actual_dirs.add(os.path.relpath(absolute,root).replace(os.sep,'/'))
 for name in names:
  absolute=os.path.join(base,name); mode=os.lstat(absolute).st_mode
  if not stat.S_ISREG(mode) or stat.S_ISLNK(mode): bad('bad file entry')
  actual_files.add(os.path.relpath(absolute,root).replace(os.sep,'/'))
expected_files=set(files)|{'release-manifest.json'}; expected_dirs=set()
for name in files:
 parent=posixpath.dirname(name)
 while parent not in ('','.'): expected_dirs.add(parent); parent=posixpath.dirname(parent)
if actual_files!=expected_files or actual_dirs!=expected_dirs: bad('tree mismatch')
for name,digest in files.items():
 with open(os.path.join(root,name),'rb') as handle:
  if hashlib.sha256(handle.read()).hexdigest()!=digest: bad('hash mismatch')
PYTREE
}
cleanup() {
 status=$?
 if test -n "$stage" && sudo test -d "$stage"; then sudo rm -rf -- "$stage"; fi
 if test -n "$next_link" && { sudo test -e "$next_link" || sudo test -L "$next_link"; }; then sudo rm -f -- "$next_link"; fi
 if test "$lock_owned" -eq 1; then sudo rmdir -- "$lock" 2>/dev/null || true; fi
 exit "$status"
}
trap cleanup EXIT
sudo install -d -m 0755 "$releases"
if ! sudo mkdir -- "$lock"; then echo 'lock already owned' >&2; exit 1; fi
lock_owned=1
test "$(sudo sha256sum "$active" | awk '{print $1}')" = "$config_sha"
test "$(sha256sum "$archive" | awk '{print $1}')" = "$archive_sha"
if sudo test -e "$candidate" || sudo test -L "$candidate"; then echo 'release exists' >&2; exit 1; fi
old_target="$(sudo readlink -f "$current" || true)"
case "$old_target" in "$releases"/[0-9a-f][0-9a-f]*) ;; *) echo 'reviewed bootstrap required' >&2; exit 1;; esac
old_sha="$(basename "$old_target")"; is_sha "$old_sha"; verify_tree "$old_target" "$old_sha"
test "$old_target" = "$releases/$old_sha"
sudo mkdir -m 0755 -- "$stage"
sudo python3 - "$archive" "$stage" <<'PYARCHIVE'
import posixpath,sys,tarfile
archive,stage=sys.argv[1:]
def bad(message): raise SystemExit(message)
with tarfile.open(archive,'r:gz') as tar:
 members=tar.getmembers()
 if not members: bad('empty archive')
 seen=set()
 for member in members:
  raw=member.name
  while raw.startswith('./'): raw=raw[2:]
  name=posixpath.normpath(raw) if raw else '.'
  if name.startswith('/') or name=='..' or name.startswith('../') or '..' in name.split('/'): bad('unsafe tar path')
  if name in seen: bad('duplicate tar member')
  seen.add(name)
  if name=='.':
   if not member.isdir(): bad('invalid tar root')
  elif not (member.isfile() or member.isdir()): bad('link or special tar member')
 tar.extractall(stage,members)
PYARCHIVE
verify_tree "$stage" "$release_sha"
sudo mv -T -- "$stage" "$candidate"; stage=''
if sudo test -e "$next_link" || sudo test -L "$next_link"; then echo 'temporary link exists' >&2; exit 1; fi
sudo ln -s -- "$candidate" "$next_link"
sudo mv -Tf -- "$next_link" "$current"; next_link=''
echo "atomic content activation: $candidate"
echo "previous content release retained: $old_target"
echo "export CANRAN_PREVIOUS_RELEASE=$old_sha"
echo "export CANRAN_CONFIG_STATE=$upload/config-state-$release_sha-$config_sha"
REMOTE
~~~

</details>

### 6. 核对线上版本

使用上传时同一份本地 dist，先比对清单，再核对全部可访问文件、响应头和旧首页跳转。默认同时下载 2 个资源，每个超时 60 秒。本地测试通过不能代替本步。

<details>
<summary>展开完整命令</summary>

~~~bash
set -euo pipefail
require_sha() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{40}$'; }; require_target() { printf '%s' "$1" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._-]*$'; }
for tool in git node npm ssh; do command -v "$tool" >/dev/null; done
test -n "${CANRAN_DEPLOY_TARGET:-}"; require_target "$CANRAN_DEPLOY_TARGET"
RELEASE_SHA="$(git rev-parse --verify HEAD)"; require_sha "$RELEASE_SHA"
test "$(node -p 'require("./dist/release-manifest.json").commit')" = "$RELEASE_SHA"
if ! npm run verify:live; then echo 'live verification failed; run the full rollback block below' >&2; exit 1; fi
remote_manifest="$(ssh "$CANRAN_DEPLOY_TARGET" 'cat /var/www/canranstudio/current/release-manifest.json')"
RELEASE_SHA="$RELEASE_SHA" REMOTE_MANIFEST="$remote_manifest" node -e 'if (JSON.parse(process.env.REMOTE_MANIFEST).commit !== process.env.RELEASE_SHA) process.exit(1)'
~~~

</details>

### 核对失败时：完整回退

先设置第 5 步记录的 CANRAN_PREVIOUS_RELEASE。下面恢复旧内容和记录的旧配置；任何恢复失败都交由维护者处理。成功后，在旧提交号上重新构建 dist，再运行 npm run verify:live；失败版本的 dist 不能用于验证旧版本。

<details>
<summary>展开完整命令</summary>

~~~bash
set -euo pipefail
require_sha() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{40}$'; }; require_sha256() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{64}$'; }; require_target() { printf '%s' "$1" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._-]*$'; }; sha256_file() { shasum -a 256 "$1" | awk '{print $1}'; }
for tool in git shasum ssh; do command -v "$tool" >/dev/null; done
test -n "${CANRAN_DEPLOY_TARGET:-}"; test -n "${CANRAN_PREVIOUS_RELEASE:-}"; require_target "$CANRAN_DEPLOY_TARGET"; require_sha "$CANRAN_PREVIOUS_RELEASE"
RELEASE_SHA="$(git rev-parse --verify HEAD)"; RELEASE_ARCHIVE="/tmp/canranstudio-$RELEASE_SHA.tar.gz"; test -f "$RELEASE_ARCHIVE"
ARCHIVE_SHA="$(sha256_file "$RELEASE_ARCHIVE")"; CONFIG_SHA="$(sha256_file deploy/nginx/canranstudio-http.conf)"
require_sha "$RELEASE_SHA"; require_sha256 "$ARCHIVE_SHA"; require_sha256 "$CONFIG_SHA"

ssh "$CANRAN_DEPLOY_TARGET" "bash -s -- $CANRAN_PREVIOUS_RELEASE $RELEASE_SHA $ARCHIVE_SHA $CONFIG_SHA" <<'REMOTE'
set -euo pipefail
previous_sha=$1
release_sha=$2; archive_sha=$3; config_sha=$4
printf '%s' "$previous_sha" | grep -Eq '^[0-9a-f]{40}$'
printf '%s' "$release_sha" | grep -Eq '^[0-9a-f]{40}$'; printf '%s' "$archive_sha" | grep -Eq '^[0-9a-f]{64}$'; printf '%s' "$config_sha" | grep -Eq '^[0-9a-f]{64}$'
site_root=/var/www/canranstudio; releases="$site_root/releases"; current="$site_root/current"
previous="$releases/$previous_sha"; lock="$releases/.deploy.lock"
next_link="$site_root/.current.rollback.$previous_sha.$$.new"
compensation_link="$site_root/.current.compensate.$release_sha.$$.new"
lock_owned=0; next_link_owned=0; compensation_link_owned=0
upload="/var/tmp/canranstudio-upload-$release_sha-$archive_sha-$config_sha"; state="$upload/config-state-$release_sha-$config_sha"; active=/etc/nginx/conf.d/canranstudio-http.conf
candidate_config="$upload/nginx-$release_sha-$config_sha.conf"
mutated=0; success=0; compensating=0
verify_tree() {
 sudo python3 - "$1" "$2" <<'PYTREE'
import hashlib,json,os,posixpath,re,stat,sys
root,commit=sys.argv[1:]
def bad(message): raise SystemExit(message)
def pairs(items):
 out={}
 for key,value in items:
  if key in out: bad('duplicate JSON key')
  out[key]=value
 return out
def safe(value): return isinstance(value,str) and value and value==posixpath.normpath(value) and not value.startswith('/') and not value.startswith('../') and '..' not in value.split('/')
root_mode=os.lstat(root).st_mode
if not stat.S_ISDIR(root_mode) or stat.S_ISLNK(root_mode): bad('bad root')
with open(os.path.join(root,'release-manifest.json'),encoding='utf8') as handle: manifest=json.load(handle,object_pairs_hook=pairs)
if set(manifest)!={'schema','commit','files'} or manifest['schema']!=1 or manifest['commit']!=commit or not isinstance(manifest['files'],dict) or not manifest['files']: bad('bad manifest')
files=manifest['files']; actual_files=set(); actual_dirs=set()
if 'release-manifest.json' in files: bad('self manifest')
for name,digest in files.items():
 if not safe(name) or not isinstance(digest,str) or not re.fullmatch('[0-9a-f]{64}',digest): bad('bad entry')
for base,dirs,names in os.walk(root,topdown=True,followlinks=False):
 for name in dirs:
  absolute=os.path.join(base,name); mode=os.lstat(absolute).st_mode
  if not stat.S_ISDIR(mode) or stat.S_ISLNK(mode): bad('bad dir')
  actual_dirs.add(os.path.relpath(absolute,root).replace(os.sep,'/'))
 for name in names:
  absolute=os.path.join(base,name); mode=os.lstat(absolute).st_mode
  if not stat.S_ISREG(mode) or stat.S_ISLNK(mode): bad('bad file')
  actual_files.add(os.path.relpath(absolute,root).replace(os.sep,'/'))
expected_files=set(files)|{'release-manifest.json'}; expected_dirs=set()
for name in files:
 parent=posixpath.dirname(name)
 while parent not in ('','.'): expected_dirs.add(parent); parent=posixpath.dirname(parent)
if actual_files!=expected_files or actual_dirs!=expected_dirs: bad('tree mismatch')
for name,digest in files.items():
 with open(os.path.join(root,name),'rb') as handle:
  if hashlib.sha256(handle.read()).hexdigest()!=digest: bad('hash mismatch')
PYTREE
}
validate_inputs() {
 sudo test -d "$releases"; sudo test ! -L "$releases"
 test "$previous_sha" != "$release_sha"
 sudo test -d "$previous"; sudo test ! -L "$previous"; verify_tree "$previous" "$previous_sha"
 sudo test -L "$current"
 failed_target="$(sudo readlink -f "$current")"
 test "$failed_target" = "$releases/$release_sha"
 sudo test -d "$failed_target"; sudo test ! -L "$failed_target"; verify_tree "$failed_target" "$release_sha"
 test -d "$upload"; test ! -L "$upload"; test -O "$upload"
 test -f "$state"; test ! -L "$state"; test -O "$state"
 {
  IFS= read -r mode || return 1
  IFS= read -r backup || return 1
  IFS= read -r backup_sha || return 1
  extra=''
  if IFS= read -r extra || test -n "$extra"; then return 1; fi
 } < "$state"
 sudo test -f "$active"; sudo test ! -L "$active"
 test "$(sudo sha256sum "$active" | awk '{print $1}')" = "$config_sha"
 candidate_count=0; only_candidate=''
 while IFS= read -r -d '' found_candidate; do candidate_count=$((candidate_count + 1)); only_candidate="$found_candidate"; done < <(find "$upload" -mindepth 1 -maxdepth 1 -type f -name 'nginx-*.conf' -print0)
 test "$candidate_count" -eq 1
 test "$only_candidate" = "$candidate_config"
 test -f "$candidate_config"; test ! -L "$candidate_config"; test -O "$candidate_config"
 test "$(sha256sum "$candidate_config" | awk '{print $1}')" = "$config_sha"
 case "$mode" in
  unchanged) test -z "$backup$backup_sha" ;;
  present)
   printf '%s' "$backup_sha" | grep -Eq '^[0-9a-f]{64}$'
   test "$backup" = "/etc/nginx/conf.d/.canranstudio-http.conf-$config_sha-$backup_sha.predeploy"
   sudo test -f "$backup"; sudo test ! -L "$backup"
   test "$(sudo sha256sum "$backup" | awk '{print $1}')" = "$backup_sha"
   ;;
  absent) test -z "$backup$backup_sha" ;;
  *) echo 'invalid configuration rollback state' >&2; return 1 ;;
 esac
 if sudo test -e "$lock" || sudo test -L "$lock"; then echo 'lock already owned' >&2; return 1; fi
 if sudo test -e "$next_link" || sudo test -L "$next_link"; then echo 'rollback temporary link exists' >&2; return 1; fi
 if sudo test -e "$compensation_link" || sudo test -L "$compensation_link"; then echo 'compensation temporary link exists' >&2; return 1; fi
}
cleanup() {
 status=$?
 trap - EXIT
 set +e
 if test "$mutated" -eq 1 && test "$success" -eq 0 && test "$compensating" -eq 0; then
  compensating=1
  compensation_failed=0
  if ! test -f "$candidate_config" || test -L "$candidate_config" ||
     ! test "$(sha256sum "$candidate_config" | awk '{print $1}')" = "$config_sha" ||
     ! sudo cp -p -- "$candidate_config" "$active" ||
     ! sudo test -f "$active" || sudo test -L "$active" ||
     ! test "$(sudo sha256sum "$active" | awk '{print $1}')" = "$config_sha"; then
   compensation_failed=1
  fi
  if sudo ln -s -- "$failed_target" "$compensation_link"; then
   compensation_link_owned=1
   if sudo mv -Tf -- "$compensation_link" "$current"; then compensation_link_owned=0; else compensation_failed=1; fi
  else
   compensation_failed=1
  fi
  if ! sudo test -L "$current" || ! test "$(sudo readlink -f "$current")" = "$failed_target"; then compensation_failed=1; fi
  if sudo nginx -t; then
   if ! sudo systemctl reload nginx; then compensation_failed=1; fi
  else
   compensation_failed=1
  fi
  if test "$compensation_failed" -eq 0; then
   echo 'rollback failed; candidate state restored' >&2
  else
   echo 'ROLLBACK AND COMPENSATION FAILED; operator escalation required' >&2
  fi
 fi
 if test "$next_link_owned" -eq 1; then sudo rm -f -- "$next_link"; fi
 if test "$compensation_link_owned" -eq 1; then sudo rm -f -- "$compensation_link"; fi
 if test "$lock_owned" -eq 1; then sudo rmdir -- "$lock" 2>/dev/null || true; fi
 exit "$status"
}
trap cleanup EXIT
validate_inputs
if ! sudo mkdir -- "$lock"; then echo 'lock already owned' >&2; exit 1; fi
lock_owned=1
mutated=1
case "$mode" in
 unchanged) ;;
 present) sudo cp -p -- "$backup" "$active" ;;
 absent) sudo rm -f -- "$active" ;;
esac
sudo nginx -t
sudo ln -s -- "$previous" "$next_link"; next_link_owned=1
sudo mv -Tf -- "$next_link" "$current"; next_link_owned=0
sudo systemctl reload nginx
success=1
echo "full rollback completed: $previous / $mode"
REMOTE
~~~

</details>

### 7. 清理临时上传文件

仅在线上核对成功后，或重新上传前使用。命令会核对目录归属和全部条目；发现未知文件就停止。它不删除旧发布目录或配置备份。

<details>
<summary>展开完整命令</summary>

~~~bash
set -euo pipefail
require_sha() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{40}$'; }
require_sha256() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{64}$'; }
require_target() { printf '%s' "$1" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._-]*$'; }
sha256_file() { shasum -a 256 "$1" | awk '{print $1}'; }
for tool in git shasum ssh; do command -v "$tool" >/dev/null; done
test -n "$CANRAN_DEPLOY_TARGET"; require_target "$CANRAN_DEPLOY_TARGET"
RELEASE_SHA="$(git rev-parse --verify HEAD)"; RELEASE_ARCHIVE="/tmp/canranstudio-$RELEASE_SHA.tar.gz"; test -f "$RELEASE_ARCHIVE"
ARCHIVE_SHA="$(sha256_file "$RELEASE_ARCHIVE")"; CONFIG_SHA="$(sha256_file deploy/nginx/canranstudio-http.conf)"
require_sha "$RELEASE_SHA"; require_sha256 "$ARCHIVE_SHA"; require_sha256 "$CONFIG_SHA"
ssh "$CANRAN_DEPLOY_TARGET" "bash -s -- $RELEASE_SHA $ARCHIVE_SHA $CONFIG_SHA" <<'REMOTE'
set -euo pipefail
release_sha=$1; archive_sha=$2; config_sha=$3
command -v find >/dev/null; command -v mktemp >/dev/null
upload="/var/tmp/canranstudio-upload-$release_sha-$archive_sha-$config_sha"
test -d "$upload"; test ! -L "$upload"; test -O "$upload"
entry_list="$(mktemp /var/tmp/canranstudio-cleanup.XXXXXX)"
cleanup_list() { status=$?; trap - EXIT; rm -f -- "$entry_list"; exit "$status"; }
trap cleanup_list EXIT
find "$upload" -mindepth 1 -maxdepth 1 -print0 > "$entry_list"
while IFS= read -r -d '' entry; do
 test -e "$entry" || test -L "$entry"
 test -f "$entry"; test ! -L "$entry"
 case "$entry" in
  "$upload/release-$release_sha-$archive_sha.tar.gz"|"$upload/nginx-$release_sha-$config_sha.conf"|"$upload/config-state-$release_sha-$config_sha") ;;
  *) echo "unexpected upload entry: $entry" >&2; exit 1 ;;
 esac
done < "$entry_list"
while IFS= read -r -d '' entry; do rm -f -- "$entry"; done < "$entry_list"
rmdir -- "$upload"
REMOTE
~~~

</details>

## 发布后的人工检查

按[真机检查表](../docs/mobile-release-smoke-checklist.md)确认课程、声音、进度恢复和手机布局。报告应分别写明提交、推送、发布、线上核对和人工验收的结果。
