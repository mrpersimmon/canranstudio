# 获星时刻交互原型

这是可丢弃的设计演示，不是正式奖励实现。基于原有 Lesson 1–2 完成页和已确认的纪念卡素材，已按用户选择收敛到 C 悬浮纪念卡：获星时卡片之外没有标题、说明、按钮或工具条；升级续做在卡下仅补充用户确认的一句提醒；点击任意位置退出。A/B 仅保留作历史对照。

从仓库根目录运行：

```sh
node poc/award-reveal-prototype/serve.js
```

打开 <http://127.0.0.1:4271/poc/award-reveal-prototype/?variant=C&case=first>。结算时只有卡片，点击卡片或背景任意位置退出，键盘支持 Esc、回车与空格。退出后才显示演示工具条，可切换情境、重播或减少动态。`variant=A|B|C`、`case=first|earned|full|upgrade|retry|already|pending` 可复制分享本地地址。

仅监听本机。演示姓名、星数和日期均为内存样例；不加载真实课程练习引擎，不读写浏览器学习记录，不调用账号或奖励 API。正式课程仍通过原来的 4270 端口预览。非本机域名不运行原型；原型不注册到课程导航和课程资源清单。

用户已选择 C 并要求保持克制；正式接入仍待实施，须按正式数据、幂等、资源准备、焦点和页面验收规则重新接入；不能将该原型直接当作生产功能合入。

亮星与满星流光演示：<http://127.0.0.1:4271/poc/award-reveal-prototype/?variant=C&case=full&motion=full>。`motion=full|reduced` 只控制原型动效；省略时尊重系统减少动态偏好。星星有暖光与高光，满星金边约5.8秒流转一圈；退出即停止。

升级续做提醒：<http://127.0.0.1:4271/poc/award-reveal-prototype/?variant=C&case=upgrade&motion=full>。文案为“课程已升级，重新挑战，全对即可点亮星星！”，桌面一行、手机两行，点击提醒文字也可退出；不会修改星数或学习记录。
