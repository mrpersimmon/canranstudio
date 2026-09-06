# 当前猫猫课程的单首页部署

目标地址为 `https://www.canranstudio.cn/`。本站使用现有服务器与 Nginx，首页由 `dist/learning-path/index.html` 提供。目录清理或创建分支本身不会更改线上版本。

## 发布输入

1. 在本分支生成课程包，完成测试并提交所有发布输入。
2. 运行 `npm run verify`。发布器拒绝未提交、与 HEAD 不同，或编写内容与生成课程包不同的输入。
3. 打包 `dist/learning-path/` 全部文件；保留 `release-manifest.json`。macOS 打包时禁用 AppleDouble 与扩展属性：

```bash
COPYFILE_DISABLE=1 tar --no-xattrs -czf /tmp/canranstudio-learning-path.tar.gz -C dist/learning-path .
```

4. 计算归档 SHA-256，记录本次完整提交号。通过已授权的服务器登录方式上传归档、本目录的 `activate-learning-path.py` 和 `nginx/canranstudio-learning-path.conf`。私钥、密码不写入仓库或归档。
5. 读取服务器当时的 `/etc/nginx/conf.d/lesson49.conf`，核对生效配置并计算它的 SHA-256；每次发布都重新读取，不沿用历史摘要。

## 激活

服务器上的脚本需要以下五个位置参数，以 sudo 运行：

```text
python3 activate-learning-path.py <归档路径> <新配置路径> <归档SHA256> <当前配置SHA256> <完整Git提交号>
```

脚本检查归档、文件集合、逐项内容摘要和配置是否变化，随后检查 Nginx 配置，并切换 `/var/www/canranstudio-learning-path/current`。发布目录为其 `releases/` 下的独立版本；配置与切换记录备份到 `/var/backups/canranstudio/`。激活失败会恢复本次变更前的链接与配置。

## 发布后确认

首页 HTML、课程包与全部资源须匹配发布清单；语音分段请求应返回 206。旧页面入口应跳转首页，废弃资源应返回 404；发布清单和仓库文件不公开。再通过真实浏览器确认首页、开始学习、音频结束后的手动继续和刷新恢复。

如需回退，按该次备份中的 `activation.json` 恢复原 `current` 链接和 `lesson49.conf`，检查配置再重新加载 Nginx。既有发布实例见 [V4 发布记录](../docs/designs/lesson1-6-path-v4/publication.md)。
