# 本地账号合并检查记录

21 组已选检查中，20 组通过。缓存组有 1 项合并前也能复现的性能超标；本轮不等于完整发布验收。

| 检查 | 通过执行数 | 未通过数 |
| --- | ---: | ---: |
| `browser-login` | 27 | 0 |
| `workflow` | 10 | 0 |
| `unit` | 93 | 0 |
| `browser-smoke` | 21 | 0 |
| `browser-course-cache` | 73 | 1 |
| `browser-pronunciation` | 18 | 0 |
| `browser-unit56` | 27 | 0 |
| `browser-unit78` | 24 | 0 |
| `browser-units9-12` | 54 | 0 |
| `browser-unit1314` | 20 | 0 |
| `browser-unit1516` | 22 | 0 |
| `browser-unit1718` | 23 | 0 |
| `browser-unit1920` | 26 | 0 |
| `browser-unit2122` | 30 | 0 |
| `browser-unit2324` | 29 | 0 |
| `browser-unit2526` | 28 | 0 |
| `browser-unit2728` | 28 | 0 |
| `browser-unit2930` | 27 | 0 |
| `browser-retry-feedback` | 47 | 0 |
| `browser-state` | 10 | 0 |
| `browser-layout` | 29 | 0 |

各组有交叉覆盖，执行数不代表独立功能数。另行执行的 Lesson 49–50 历史迁移用例通过；`build:login` 验证 16 个受保护单元通过。

复访性能标准仍为 P95 < 1500 毫秒；相同顺序下合并前为 1614 毫秒，合并后为 1639 毫秒。单独运行通过，不能代替整组性能验收。具体样本见 [性能记录](cache-performance.json)。

本次仅在本地运行浏览器检查，没有推送、部署或微信真机验收。
