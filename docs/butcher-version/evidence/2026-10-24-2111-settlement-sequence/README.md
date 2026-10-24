# 全课程结算顺序修复证据

对应[修复与验收记录](../../2026-10-24-2111-v1.0-全部课程结算顺序修复与验收.md)。

- [结算专项汇总](test-summary.json)：两种浏览器、两种挂载、现有奖励和同步回归的实际范围，保留首错说明。
- [72课接入与资源校验](course-coverage.json)：每课包含相同的当前共用结算资源。
- [原问题红测](red.log)：真实全对、确认尚未返回时统计提前可见。
- [全对卡片](perfect-card.png)、[关卡后的统计](perfect-statistics.png)、[错答直接统计](mistake-statistics.png)：独立本地体验的真实按钮作答截图。
- [旧15星升级](legacy3738.log)、[旧证原件与日期](legacy4950.log)、[统计与布局](completion-layout.log)：对应已运行的实际专项。
- [手机统计复验](statistics-webkit-ready.log)与[独立清理复验](statistics-webkit-cleanup.log)：3项通过、1项业务完成后在原90秒内清理trace未完成；后者仍为失败，不改记通过。

未纳入真实用户数据、原始浏览器trace、凭据或测试数据库。Windows完整单元检查的6项平台限制、上述1项手机测试收尾失败及未跑全套范围详见主记录；不据此放宽课程或数据保留要求。
