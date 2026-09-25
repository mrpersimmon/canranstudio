# 班级访问版本的运行与发布

生产布局已经用户确认：根目录是新版课程入口，原首页迁到 `/exercise/`，旧 `/lesson/` 下线。账号规则见[班级访问方案](../../docs/butcher-version/publish/2026-09-26-0048-v1.2-班级课程访问设计与验收.md)，迁移规则见[根目录发布与迁移](../../docs/butcher-version/publish/2026-09-26-0134-v1.0-根目录发布与迁移.md)。文档中的发布步骤不代表线上已完成，提交号与线上结果单独记录。

## 地址与目录

| 用途 | 地址或目录 |
| --- | --- |
| 学生登录、登录后的班级课程导航 | `https://www.canranstudio.cn/` |
| 教师管理 | `https://www.canranstudio.cn/admin/` |
| 原首页和练习内容 | `https://www.canranstudio.cn/exercise/` |
| 旧课程入口 | `/lesson`、`/lesson/` 及其内容返回 410，不重定向回旧课件 |
| 私有代码 | `/opt/canran-lesson/releases/<提交号>`；`/opt/canran-lesson/current` 指向本次版本 |
| 学生数据 | `/var/lib/canran-lesson`；专用用户所有、目录 700，不放在版本目录中 |
| Node.js | `/opt/canran-node/bin/node`，使用经官方 SHA-256 核验的 Node.js 24 或更新版本 |
| 原站迁移产物 | `/var/www/canranstudio-exercise/releases/<迁移版本>`；`current` 指向该版本 |

HTTP 只通过账号服务的资源允许清单读取新版课程。不能把仓库、数据目录或 dist-login 作为静态根目录。旧练习站保留原有公开方式，它不使用新版学生成果。

## 发布前检查

```bash
npm ci
npm run check:plan
npm run check:commit
npm run test:login
LESSON_BASE_PATH=/ npm run build:login
```

当前账号测试包含根目录整课通关、旧目录下线、迁址后的真实已完成活动保留。`dist-login/publication.json` 是十六单元及课包版本核对表，不是可公开的静态课件。正式包来自已提交版本；生产运行只安装 `npm ci --omit=dev`，不携带本地数据、密钥或 Git 目录。

## 首次部署或升级

1. 记录并备份当前站点配置、首页发布目录和 `/lesson/` 发布目录；保留旧版本在非公开位置。
2. 从原首页完整发布包制作迁移产物：`node scripts/migrate-exercise.js <原首页目录> <新的迁移输出目录>`。脚本先核对原发布清单，重写 `/exercise/` 地址，再重算媒体清单、课包、首页及发布清单的校验值。不可禁用完整性校验来解决加载失败。
3. 上传并核对已提交的账号服务与迁移产物。安装 [systemd 服务](canran-lesson.service)，先在回环地址 `/health` 检查服务，尚不切换公网。
4. `LESSON_BASE_PATH=/`、`LESSON_ORIGIN=https://www.canranstudio.cn`、`LESSON_TRUST_PROXY=loopback` 和独立 `LESSON_DATA_DIR` 均须显式配置。本地预览默认仍为 `/lesson/`；根目录预览显式配置 `/`。
5. 数据迁移必须使用配套 SQLite 备份和 card-key，不能复制运行中的数据库单文件。首次管理员初始化或旧管理员恢复使用下方管理命令；是否迁入本地班级数据按用户决定执行。
6. 用 [site.conf](site.conf) 和 [nginx.conf](nginx.conf) 替换已确认的主域名站点规则。旧 `/lesson/` 及其资源静态 alias 必须取消，不能与新规则并存。TLS 证书与其他独立域名的配置保持原有管理方式。
7. 先 `nginx -t`，通过后才 reload；再验证根目录登录、班级导航、实际作答与刷新、匿名资源拒绝、旧地址 410，以及 `/exercise/` 首访和复访。正式 Nginx 来源限流也在此阶段验收。

Nginx 必须以 `$remote_addr` 覆写 `X-Forwarded-For`，不能追加客户端输入。生产漏配信任代理会拒绝启动。服务只监听 127.0.0.1，不缓存身份、课程清单和成果；服务不可用时不能回落到公开课件。

新旧缓存分别作用于 `/` 与 `/exercise/`。旧 `/lesson/core/subpath-worker.js` 只保留网络直通的退役脚本，替换旧公开缓存；这是清退机制，不是保留旧课程内容。旧根目录课包 Worker 的原地址也返回受权限约束的新 Worker，以更新联网的旧浏览器。已经离线保存且未收到更新的副本无法被即时撤回。

## 数据初始化、备份与恢复

以数据所有者运行，环境中先设置 `LESSON_DATA_DIR=/var/lib/canran-lesson`。首次 `node server/manage.js bootstrap` 将新管理员登录信息写入私有 `admin-first-login.txt`；不在代码或发布记录中填写密码。已有管理员时不会覆盖。

```bash
LESSON_DATA_DIR=/var/lib/canran-lesson node server/manage.js backup /var/backups/canran-lesson/新的备份目录
```

恢复前停服务，使用新的空数据目录，恢复并检查后再改变服务的数据目录：

```bash
LESSON_DATA_DIR=/var/lib/canran-lesson-restored node server/manage.js restore /var/backups/canran-lesson/选定备份目录
```

恢复核对 SQLite 完整性、加密密钥、学生身份、学号、正式密码、班级、开放课程和成果。课包从发布代码重建。初始密码的截止时间及领取状态以所选备份为准；旧快照不包含备份之后的领取或改密，需要教师核对并重新发放相关待激活账号。

旧库升级只为待激活且已核对拼音的账号轮换随机初始密码，撤销旧学生／待改密会话；正式密码及成果保留。初始密码固定 7 天内可领取一次，领取后最多 15 分钟完成改密，不能超过原截止时间。旧账号单需重新发放。姓名拼音不再作为密码。

## 回退

已发布的账号服务只能回退到同样执行随机密码、代理限流和访问控制的兼容版本，保留独立数据目录。首次上线没有兼容前版时，应保持课程服务不可用并修复，不能把新版受限课程退回匿名公开状态。`/exercise/` 有独立的发布目录和链接，不因账号服务回退丢失。

管理员恢复使用同一数据目录运行 `node server/manage.js reset-admin`，生成新密码并撤销旧管理会话；不能删除重建学生以解决登录问题。开发、检查、提交、推送、生产切换和真机验收分别记录。
