# 班级访问版本的运行与发布

当前为本地实现，未部署。产品规则见[班级课程访问方案](../../docs/butcher-version/publish/2026-09-25-0105-v1.0-班级课程访问设计与验收.md)。生产发布必须另行得到用户指令，并确认目标提交、检查结果和真机验收状态。

## 目录与首次准备

- 代码：`/opt/canran-lesson/releases/<提交号>`；`/opt/canran-lesson/current` 指向本次版本。
- 数据：`/var/lib/canran-lesson`，归专用 `canran-lesson` 用户，目录权限 700。不能位于版本目录内。
- Node.js 24 或更新版本；安装路径如不是 `/usr/bin/node`，对应修改 systemd 的 ExecStart。
- 私有工作目录保留代码和素材，HTTP 只能通过 `server/app.js` 的允许清单读取。不能把 Git 仓库、数据目录或 dist-login 直接设置为站点根目录。

发布前执行：

```bash
npm ci
npm run test:login
npm run build:login
```

`dist-login/publication.json` 仅用于核对十六单元和课包版本。生产依赖使用 `npm ci --omit=dev`，服务启动时生成受保护课包。历史课包在私有数据目录保留七天，已有页面可以补齐原版本资源；同样必须登录且具备该课资格。过期课包和无引用资源在服务启动时清理。

首次管理员初始化在服务器端运行，先配置 `LESSON_DATA_DIR=/var/lib/canran-lesson`，再运行 `node server/manage.js bootstrap`。凭据只写入该目录的 `admin-first-login.txt`。管理员登录、建班、加学生、核对拼音并打印学号账号单；不要在代码或发布记录里填写密码或账号清单。

## 切换入口

安装 [systemd 服务](canran-lesson.service)，先以 loopback 访问 `/lesson/health` 确认服务能启动。`LESSON_ORIGIN` 必须与最终 HTTPS 来源一致。

**替换**原来的 `canranstudio-lesson-location.conf` 引用为 [nginx.conf](nginx.conf)，同时移除旧 `/lesson/resources/` 和 `/lesson/course-packages/` 的静态 alias。不能把新配置与旧资源 location 并排保留，否则较长的旧 location 仍可能公开资源。检查其他旧根路径是否还指向课件，旧别名也须转入受控 `/lesson/`。

运行 `nginx -t` 后才 reload。保留主官网、证书和其他路径。权限服务不可用时返回失败，不回落到旧公开目录。每次切换必须用无痕未登录、A／B 学生、旧缓存浏览器、七个下架路径和固定资源直链重新验收。对已经完全离线的旧公开副本不作即时撤回承诺。

网站需要的只有本站 Cookie 和同源请求。服务只监听 127.0.0.1；Nginx 不缓存身份、课程清单或成果。生产启动检查 HTTPS origin 和数据目录位置，配置错误会拒绝启动。

## 备份与恢复

以数据所有者执行。备份包含数据库和配套卡片密钥，缺一不可。目录参数必须使用新目录，避免覆盖已有备份。

```bash
LESSON_DATA_DIR=/var/lib/canran-lesson node server/manage.js backup /var/backups/canran-lesson/新的备份目录
```

恢复前停服务，使用新的空数据目录，先恢复、验证，再修改服务的 LESSON_DATA_DIR 指向该目录：

```bash
LESSON_DATA_DIR=/var/lib/canran-lesson-restored node server/manage.js restore /var/backups/canran-lesson/选定备份目录
```

恢复会检查 SQLite 完整性及学习卡密钥，随后在页面核对原学生学号、新密码、班级、开放课程和真实成果。课包由发布代码重建，不依赖浏览器缓存，也不把资源缓存当成学生记录备份。

## 回退与账号恢复

回退只切换代码版本，保留数据；仅能回到已验收的班级访问版本。首次上线没有这样的前版时，应停止课程服务并修复，不能退回匿名公开站点。任何未来数据库不兼容升级都需另写迁移／恢复步骤。

重置唯一管理员：使用同一个数据目录运行 `node server/manage.js reset-admin`；生成新密码并撤销旧管理会话。学生卡在管理页逐个重发，不删除学生成果。

升级学习卡旧库前先备份。首次新服务启动会原位分配学号和初始密码并撤销旧学生会话；内部学生标识及成果不变。通知学生/家长向老师领取学号、完成首次改密；旧二维码不再自动登录。新密码只存摘要，管理员只能重置不能查看。`card-key` 目前仍是旧库兼容备份的一部分，不能单独丢弃。
