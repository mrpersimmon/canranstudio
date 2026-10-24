# 统一五星切换与原证归档证据

对应[实施记录](../../2026-10-24-2200-v1.0-统一五星切换与原证归档.md)与[现行标准v1.55](../../publish/2026-10-24-2200-v1.55-教学单元设计标准与验收清单.md)。

- [预览迁移摘要](preview-summary.json)：真实作答、5／5／1→5／5／0、原证日期与备份哈希。
- [加载与旧Worker摘要](loader-summary.json)：自动最新版、无旧版选择、失败恢复、性能与旧Worker能力更新。
- [迁移单元检查](migration-tests.log)、[最终相关单元检查](final-unit.log)、[工作流检查](workflow-final.log)。
- [旧纸证及资源权限](certificate-etag.log)、[本机未同步旧纸证](certificate-local.log)：真实原件及PNG对照，原始trace未复制。
- [新版目录](after-directory.png)、[保留的原卡](after-unit1-2-certificate.png)、[重置后的课程](after-reset-course.png)、[原纸证](archived-paper-view.png)。
- [空白新课不再生成旧记录](fresh-history-after.json)：当前epoch没有旧快照、旧迁移标记或0／15入口；红测原始资料留在本机输出目录。
- [五星卡正常展示、不重复归类](certificate-section-five-star.log)及[15星原证保留与首轮定位失败](certificate-section-initial.log)：分类纠正后的两条真实流程；首轮五星断言定位写错，后续文件记录原断言校正后通过，不将首错改记为通过。

截图与摘要仅包含独立测试身份。真实用户数据库、密钥、密码、账号文件及原始网络trace不纳入此目录。根／子路径、浏览器、历史模板和未执行范围分别记录，不将单项或静态检查扩大为全站发布验收。
