# 时光邮局 Lesson 1–12 交互演示

方案 2 的独立手机原型：两章六张原纪念卡，提供跨章 Lesson／卡名搜索、章节信箱、卡片切换和原 GIF 保存。点击主卡进入保存面板；没有独立查看按钮、放大原图或新窗口跳转。使用演示账号收藏，不改正式纪念册、学习数据或线上网站。

- 本地地址：<http://127.0.0.1:4197/>
- 统一标准：`../../docs/award-version/纪念册统一设计标准.md`
- 设计基准、提示词与原卡来源：`design/`
- 验收记录：`design-qa.md`

## 开发和检查

使用 Node.js 24。`npm ci` 安装依赖；`npm run dev -- --host 127.0.0.1 --port 4197 --strictPort` 启动。`npm run test:postoffice` 验证搜索语义和原卡字节；`npm run check:runtime` 检查手机壳完整性；`npm run build` 检查类型和构建。

业务代码位于 `src/Prototype.tsx`、`src/prototype.css`、`src/postoffice-model.ts`。手机壳由 Product Design mobile-app 模板提供，按 AGENTS.md 保留。右上角可切换 iPhone 与 Pixel 10；该模拟界面不等于真实微信或夸克测试。

生成环境只作为后景，原卡来自原纪念册的真实演示导出。Phosphor 图标为现有库导出；品牌和字体来自本仓库。
