# 私有验收站

独立服务及域名承载现有72单元验收台，使用演示数据，不调用官网的账号、成绩或纪念册数据接口。

## 地址与发布隔离

- 建议域名：`preview.canranstudio.cn`，需先配置DNS和独立TLS证书。
- 源码：`/opt/canran-preview/releases/<完整提交号>`；`/opt/canran-preview/current`只指向验收版本。
- 私有配置：`/etc/canran-preview/config.json`，包含公开来源、版本及口令的scrypt散列；owner为`canran-preview`，权限0600。
- 服务：`canran-preview.service`，仅监听`127.0.0.1:4403`。
- 公开访问由独立Nginx虚拟主机提供HTTPS。不要修改官网current链接、学生数据库、card-key或现有官网虚拟主机内容。

## 准备与安装

1. 对已提交版本运行 `node scripts/cloud/package-preview.js <40位提交号>`。打包使用Git中的文件，不包括本机未提交修改、账号数据、Git目录和测试报告。保留生成的`manifest.json`和包SHA-256。
2. 将包上传到新的验收版本目录，服务器核对SHA-256后解压，使用Node.js24执行`npm ci --omit=dev`。不覆盖已有版本。
3. 单独创建无交互登录权限的`canran-preview`服务用户。版本目录只读；配置文件仅服务用户可读。先核对服务器Node路径和systemd能力，再采用[服务模板](canran-preview.service)。
4. 用 `node scripts/preview-access.js --origin https://preview.canranstudio.cn --version <完整提交号> --config <私有配置文件> --credentials <本地口令说明文件>`生成验收口令及散列。口令不放在URL、日志、Git或发布包中；重复执行不会覆盖已有口令文件。
5. 安装配置和服务，先通过回环地址、正确Host与Origin验证登录、目录、资源边界和退出。服务构建完成前不切换公开入口。
6. 核对DNS记录后申请独立证书。将[虚拟主机模板](site.conf.template)中的主机名和证书路径替换为已核实的值，新增独立配置文件；`nginx -t`通过后再reload。
7. 使用公开HTTPS地址复查：匿名无法读取课程资源、输入验收口令、完整72课目录、深链接、切换状态、材料弹层、三档手机尺寸、退出后的旧会话失效。核对官网健康和发布目录未变化。

口令保护是独立验收用途，不能替代正式学生账号。共享口令不提供人员级审计；需要多人独立权限时再接入正式的访问身份服务。

## 缓存与来源约束

所有验收响应为`no-store`。课程iframe禁止注册Service Worker，退出会撤销服务端会话并清理本验收来源缓存；官网缓存不受影响。原回环验收台仍保留原Host／Origin规则，外层认证服务只向固定回环端口代理，不接受任意上游。

对外只允许精确配置的HTTPS来源。HTTP仅支持回环测试；外部Host、跨来源表单、伪造会话、过期会话和过大表单均拒绝。失败尝试限流保存在进程内，独立服务重启会清空所有验收会话。

## 回退

记录切换前的验收`current`链接和配置副本；验收异常时仅回退该链接并重启`canran-preview`。首次部署失败则停止验收服务、撤销本次新增虚拟主机。任何回退均不操作`canran-lesson`或官网数据。

## 验证

`node --test tests/unit/private-preview.test.js`覆盖真实HTTP访问边界；`npx playwright test -c playwright.preview.config.js`覆盖三档必测手机的口令错误／成功、课程深链接、版本标识、状态切换、材料弹层、无Service Worker和退出失效。测试使用固定的合成口令，不连接官网。
