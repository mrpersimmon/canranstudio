## Lesson 77–78 专项

[设计与验收](../docs/butcher-version/2026-10-14-0130-v1.0-Lesson77-78设计与验收.md)。独立题稿答案`tests/support/unit7778.js`；66题、24词卡、12轮完整原文与五区五星。`tests/e2e/unit77-78*.spec.js`检查材料可见、事实回应、错答与部分填空、四宽短屏、相向人物及完整参考；`tests/login/unit77-78.spec.js`检查权限、卡册／实际GIF、动画、字体、跨设备与缓存。`UNIT77_BROWSER=webkit`切换引擎；账号`AWARD_TEST_BASE=/`验根路径，默认测试`/lesson/`。实际结果与边界只记在单元文档，用例存在不代表已通过。

## Lesson 75–76 专项

[设计与验收](../docs/butcher-version/2026-10-14-0047-v1.0-Lesson75-76设计与验收.md)。独立答案`tests/support/unit7576.js`；60题、30词卡、15轮原文、固定参照的时间任务、五区五星。`tests/e2e/unit75-76*.spec.js`检查真实页面与四宽，含题目资料真实可见；`tests/login/unit75-76.spec.js`检查权限、卡册／GIF、字体、动画、隔离、缓存和跨设备。`UNIT75_BROWSER=webkit`切换引擎；账号`AWARD_TEST_BASE=/`验根路径，默认测试`/lesson/`。实际通过项在单元记录，不以用例存在代替通过。

# Lesson 73–74（2026-10-14）

[设计与验收](../docs/butcher-version/2026-10-13-2345-v1.0-Lesson73-74设计与验收.md)。独立题稿 `tests/support/unit7374.js`；72题、42词卡、五区五星、14段完整原文、旁白／思想／原话分层、手册三姿态、固定三卡与四宽短屏。`unit73-74.spec.js` 和 `unit73-74-story-layout.spec.js` 检查真实页面；`tests/login/unit73-74.spec.js` 验证权限、真实获星、卡册／GIF、隔离、跨设备、缺图重试与复访。账号根路径用 `AWARD_TEST_BASE=/`，`UNIT73_BROWSER=webkit` 验WebKit；实际通过范围写在单元文档，不能以用例存在代替通过。

# Lesson 61–62（2026-10-13）

纪念卡白大褂修补：`unit61-62-keepsake-art.spec.js`读取页面实际显示图片的左上臂轮廓，旧图为0、新图须有连续棕色描边，并检查320／1280卡面不裁图；透明外边距不能替代内部人物完整性。卡册与GIF仍走真实账号页面用例。

[设计与验收](../docs/butcher-version/2026-10-13-1558-v1.0-Lesson61-62设计与验收.md)。页面检查63题、26张音标词卡、五区五星、疾病冠词变体、错答与草稿、场景检查后变化、四宽／短屏。`unit61-62-story-layout.spec.js`逐句检查15轮原文、四个人物切换和相向、完整床与手脚、中文内部滚动。独立答案：`tests/support/unit6162.js`。账号用例：`tests/login/unit61-62.spec.js`；`AWARD_TEST_BASE=/`验根路径，`UNIT61_BROWSER=webkit`验WebKit。含真实奖励、卡册、GIF、跨设备／账号、权限、缺图与复访。实际结果以单元记录为准。

# Lesson 59–60（2026-10-13）

[设计与验收](../docs/butcher-version/2026-10-13-1413-v1.0-Lesson59-60设计与验收.md)。`unit59-60.spec.js`核对60题、34张音标词卡、五区五星、错答订正、部分填空、撤回／刷新、完整参考和四宽短屏；`unit59-60-story-layout.spec.js`逐句检查16轮对白、道具归属、人物实际大小、姓名与提示不重叠、中文内部滚动。独立答案在`tests/support/unit5960.js`。账号用例为`tests/login/unit59-60.spec.js`，`AWARD_TEST_BASE=/`验根目录，`UNIT59_BROWSER=webkit`验WebKit手机模拟；覆盖权限、五次获星、卡册／真实GIF、跨设备、隔离、缺图恢复及复访。实际通过范围记录在单元文档，手机微信另验。

# Lesson 57–58（2026-10-13）

[设计与验收](../docs/butcher-version/2026-10-13-1334-v1.0-Lesson57-58设计与验收.md)。`unit57-58.spec.js`检查58题、18张音标词卡、五区五星、订正计次、撤回／刷新／重练、完整参考材料及四宽短屏；`unit57-58-story-layout.spec.js`逐段核对5段原文、时钟与场景、中文内部滚动及完整人物。独立答案在`tests/support/unit5758.js`。账号运行`npx playwright test -c playwright.login.config.js tests/login/unit57-58.spec.js`；`AWARD_TEST_BASE=/`验根路径，`UNIT57_BROWSER=webkit`验WebKit手机模拟，覆盖授权、卡册、真实GIF、获星动画、跨设备、缺图与复访。实际结果写在单元记录，不以用例存在代替通过。

# Lesson 55–56（2026-10-13）

[设计与验收](../docs/butcher-version/2026-10-13-1255-v1.0-Lesson55-56设计与验收.md)。`unit55-56.spec.js`检查62题、24张音标词卡、五区五星、订正计次、刷新重练、完整参考材料及四宽短屏；`unit55-56-story-layout.spec.js`检查8段旁白、中文内部滚动、全身人物及日程切换。独立答案在`tests/support/unit5556.js`。账号运行`npx playwright test -c playwright.login.config.js tests/login/unit55-56.spec.js`，`AWARD_TEST_BASE=/`切换根目录，`UNIT55_BROWSER=webkit`启用WebKit手机模拟；覆盖授权、卡册、真实GIF、五次奖励动画、跨设备、资源缺失与复访。手机微信和教学效果由人工另验。

# 新单元验收（2026-10-13）

Lesson53–54：[设计与验收](../docs/butcher-version/2026-10-13-1208-v1.0-Lesson53-54设计与验收.md)。`unit53-54.spec.js`核对69题、42词卡、五区五星、错误订正与续做；`unit53-54-story-layout.spec.js`核对8轮原文、四宽、长句中文和人物。`tests/login/unit53-54.spec.js`检查真实授权、缓存、五星／动图／纪念册、换设备和隔离。`AWARD_TEST_BASE=/`验根路径，`UNIT53_BROWSER=webkit`验WebKit。独立题稿答案见`tests/support/unit5354.js`。

Lesson51–52：[设计与验收](../docs/butcher-version/2026-10-13-1127-v1.0-Lesson51-52设计与验收.md)。`tests/e2e/unit51-52.spec.js`核对56题、42词卡、五区五星、错误订正、续做、四宽短屏；`unit51-52-story-layout.spec.js`逐句核对12轮原文与中文、场景内滚动、相向人物及相册变化。`tests/login/unit51-52.spec.js`检查授权、缺图重试、五星／动图／纪念册、跨设备与隔离账号；根路径用`AWARD_TEST_BASE=/`，WebKit用`UNIT51_BROWSER=webkit`。独立答案见`tests/support/unit5152.js`。真实微信、教师和儿童验收另列。

Lesson 49–50：[设计与验收](../docs/butcher-version/2026-10-13-0130-v2.0-Lesson49-50设计与验收.md)。`tests/e2e/unit49-50-current.spec.js`检查60题、30张IPA词卡、五区五星、订正与续做、四宽短屏及无配音；`unit49-50-story-layout.spec.js`逐句检查11段对白、中文、相向完整人物和肉块交接；`unit49-50-upgrade.spec.js`通过冻结旧页面实际操作空白／仅选择／中途／15星完成后升级。独立答案见`tests/support/unit4950.js`。

账号运行`npx playwright test -c playwright.login.config.js tests/login/unit49-50.spec.js tests/login/unit49-50-upgrade.spec.js`；根路径另加`AWARD_TEST_BASE=/`，WebKit加`UNIT49_BROWSER=webkit`。覆盖五颗新星、三卡统计与奖励先后、卡册／真实GIF、跨设备、缺图与复访；旧账号专项启动真实旧站与数据库完成15星，再升级同一数据，检查旧姓名／日期与15星历史独立保留、新题空白、新星可同步。历史音频及15星回归通过`tests/support/unit4950-legacy.js`显式加载冻结版本，不把旧版通过当作新版验收。自动化浏览器与手机尺寸模拟不代替微信真机验收。

Lesson 47–48：[设计与验收](../docs/butcher-version/2026-10-13-0048-v1.0-Lesson47-48设计与验收.md)。`tests/e2e/unit47-48.spec.js`检查53题、26张IPA词卡、五区五星、错答重试／续做、四宽短屏与无配音；`tests/e2e/unit47-48-story-layout.spec.js`逐句检查12段对白、中文和完整相向的人物；`tests/login/unit47-48.spec.js`验证班级授权、卡册／GIF、跨设备、姓名隔离和缺图恢复。账号根路径及`/lesson/`测试路径分别验证，追加`--browser=webkit`运行WebKit；`UNIT47_BROWSER=webkit`另启用iPhone尺寸模拟。独立答案见`tests/support/unit4748.js`，真实手机验收另列。

Lesson 45–46：[设计与验收](../docs/butcher-version/2026-10-12-1627-v1.0-Lesson45-46设计与验收.md)。`tests/e2e/unit45-46.spec.js` 检查49题、14段故事、24张音标词卡、五区五星、本轮计次、错答不泄题、撤回续做、信件归属和四宽短屏；`tests/login/unit45-46.spec.js` 覆盖授权、跨设备、纪念册、GIF、隔离与缺图恢复。账号分别运行根目录和测试子路径；`UNIT45_BROWSER=webkit` 运行 WebKit。独立答案见 `tests/support/unit4546.js`。具体已验范围与未验边界写在单元记录，不以测试存在代替通过。

小剧场字体／人物裁切专项：`npx playwright test tests/e2e/unit45-46-story-layout.spec.js`，追加 `--browser=webkit` 复查 WebKit。从真实第6句检查老板手部边缘，并遍历14句的全部可见姿态，检查四宽下对白在场景内且不遮人／打字机、中文展开稳定和刷新续读；Bob 在两间办公室都面向对方，姓名不镜像。现行布局见[场景内对白设计](../docs/butcher-version/2026-10-12-2058-v1.3-Lesson45-46场景内对白布局.md)，字体与断手定位见[历史修复记录](../docs/butcher-version/2026-10-12-1940-v1.2-Lesson45-46小剧场修复.md)。

# Lesson 41–42（2026-10-12）

Lesson 43–44：[设计与验收](../docs/butcher-version/2026-10-12-1542-v1.0-Lesson43-44设计与验收.md)。`tests/e2e/unit43-44.spec.js` 检查44题、15段故事、五区五星、3／5／2统计、重试续做、物品守恒和四宽短屏；`tests/login/unit43-44.spec.js` 验证真实账号、班级权限、纪念册、跨设备、GIF与缓存失败恢复，根路径和 `/lesson/` 测试子路径分别运行。答案来自独立题稿，不读程序答案字段。


[现行教学与纪念卡设计](../docs/butcher-version/2026-10-12-1342-v1.3-Lesson41-42教学与纪念卡优化.md)。`tests/e2e/unit41-42.spec.js` 从真实页面检查43题、16句课文、五区五星、本轮三卡、错答重试、撤回与提示、刷新、场景交接、参考材料和四种宽度；新增物品守恒、指令先于场景、旧空白／中途／已获星升级与对白切换尺寸恢复。`tests/login/unit41-42.spec.js` 用隔离班级学生检查授权、五区奖励动画顺序、跨设备、纪念册、60帧 GIF、离线恢复、缺图重试和复访，并与 Lesson 1–2／3–4 同姓名同星数对照。账号用例分别运行根目录（`AWARD_TEST_BASE=/`）和默认测试子路径。答案为独立审定文字，不读程序答案字段，不注入获星状态。

# Lesson 3–4 语法小工坊（2026-10-11）

现行五区共 33 题：5／3／10／4／11。依据、对应题号和本轮证据见[语法小工坊 v3.0](../docs/butcher-version/2026-10-11-1321-v3.0-Lesson3-4语法小工坊与验收.md)。`unit3-4-grammar.spec.js` 验证短示范与撤除、错答不泄题、提示／刷新、词块与配对、固定三卡、四种宽度、旧空草稿获星和旧题不代答新题。`tests/login/unit3-4-grammar.spec.js` 用隔离学生验证五区同步、另一设备、纪念册、课内断网续练与重新进入时的联网核验。原衣帽间分镜与交接、完整课文、无配音、词卡和迁移检查继续适用。

# 现行验收入口

按[统一设计标准 v1.49](../docs/butcher-version/publish/2026-10-14-0013-v1.49-教学单元设计标准与验收清单.md)选择本次范围；第 4、6、8 节覆盖统一字体、交谈朝向、人物画风、场景内对白、逐姿态防裁切、真实账号、持续动效、GIF 和恢复复访。规则生效不代表已有脚本全部符合新口径；只改文档执行文档与引用检查，不冒记重新通过页面测试。

# 课程加载失败恢复（2026-10-11）

规则见[网页加载缓存设计第 11 节](../docs/butcher-version/publish/2026-09-24-2031-v1.0-网页加载缓存设计.md#11-加载失败后的恢复2026-10-11)。`tests/login/course-loading-recovery.spec.js` 的 15 项检查使用隔离的临时账号：禁用较新取消接口后正常进入与超时恢复，以及查看／放大已获纪念卡；旧包缺图后发布新地址再重试；区分 L01–L06；手机返回课程；启动中断后重新进入。旧包恢复分别覆盖正常 Worker、Worker 不可用且资源被回收、浏览器拒绝写入缓存；重试成功后还必须刷新、从课程列表再次进入并继续真实答题。已有星星、半途题目、本轮错答、姓名和首次满星日期保持不变，纪念册仍可打开。不得通过重写学习记录制造测试状态。

Chromium：`LOGIN_TEST_PORT=空闲端口 npm run test:login -- tests/login/course-loading-recovery.spec.js`。WebKit：先运行 `npx playwright install webkit`，再运行 `LOGIN_TEST_PORT=空闲端口 npm run test:recovery:webkit`；两者另加 `AWARD_TEST_BASE=/` 验证根目录。WebKit 使用 iPhone 13 的视口和触摸设置，不等同于真机或旧 iOS 内核。`browser-login` 与 `browser-recovery-webkit` 会进入相关提交检查；CI 对两个入口分别执行 WebKit 恢复测试，并纳入最终必需检查。

文件失效、错误清单和新课包由 `tests/support/course-response-faults.js` 在临时测试服务器的 HTTP 边界提供，保证正式 Worker 的请求也遇到实际故障；不能依赖 `page.route()` 拦截 Worker 请求。引导脚本故障单独禁用 Worker，防止已有引导脚本缓存掩盖故障。资源回收只删除测试浏览器的课件资源字节；拒绝写入通过浏览器 Cache API 边界模拟，不触碰学习数据。生产服务器不加载测试故障入口。

共用加载器变动还须验证 `course-loading`、`course-cache-updates`、`course-image-transitions`、加载失败的多尺寸／键盘操作，以及带账号的获星防闪页面。性能计时单独运行，避免并行浏览器影响结果。测试覆盖不等同于用户的手机真机验收或已经发布。

# 新版纪念卡持续动效与 GIF（2026-10-11）

- `tests/login/award-card-readability.spec.js`：真实账号验证标题／长姓名与插画留白、常规字体、六种新版卡面、320–1280 宽度、悬浮卡／书页／放大卡及两端真实 GIF 一致。原问题先失败，修复后通过；`AWARD_CARD_BROWSER=webkit` 可检查另一浏览器，不能替代手机真机验收。对应[字体与排版修复记录](../docs/butcher-version/2026-10-12-2140-v1.4-Lesson45-46纪念卡字体与排版修复.md)。历史题稿的 HTML 同步声明当前共用卡片的依赖，旧题目、控制器和学习记录规则不变。

以[持续星光与动图保存 v0.29](../docs/award-version/2026-10-11-0925-v0.29-纪念卡持续星光与动图保存.md)为准，Lesson 1–2、3–4、5–6 及其账号纪念册的保存方式改为 GIF。其他课程和下方历史记录的 PNG 不受影响。

- `tests/login/award-card-motion.spec.js`：真实获星后检查课程底部、书页与放大卡片的持续星光，五星金边随时间变化；关闭翻页动画不关闭卡片动效。实际下载并解码 60 帧 GIF，检查循环、尺寸、体积、星光／满星边框变化、文字静止、离线保存、取消生成、刷新后星数与首次日期不变，以及 320／390／1280 宽度。
- `tests/login/unit1-2-award.spec.js` 与 `tests/login/award-book.spec.js`：继续验证三个单元、姓名、跨设备和账号隔离、失败重试、翻页与真实 GIF 导出；不能只改扩展名或模拟下载事件。
- 悬浮奖励的落星、统计衔接、防整页闪回由 `tests/login/award-reveal.spec.js` 继续保护。默认 `/lesson/` 与 `AWARD_TEST_BASE=/` 都要验证共享路径。

# 本轮提交统计与结算动画（2026-10-12）

现行结算要求见[统一标准第 5 节](../docs/butcher-version/publish/2026-10-14-0013-v1.49-教学单元设计标准与验收清单.md#5-怎样结算固定三卡只统计本轮实际提交)：固定「连续答对／本次答对／本次答错」，单位「次」，按本轮实际提交计数。订正计答对、重复错答逐次计；每题首次证据仍用于独立获星判断。已先复现旧口径偏差再修复，实际范围与结果见[统计对齐验收 v0.30](../docs/award-version/2026-10-12-0111-v0.30-本轮提交统计对齐与记录保留验收.md)，不沿用旧首次分类断言宣称新统计通过。

- `tests/e2e/unit1-2-completion.spec.js`：五题第三题错两次后改对为 3／5／2，每题错两次再订正为 1／5／10；刷新不丢次数，重练回到本轮零计数。保留五区、四种宽度及短屏、三卡中间帧与跳数检查。相关文案、五区、语法、挑战与历史升级测试同步更正统计预期，首次结果和既有获星断言保留。
- `tests/e2e/submission-statistics.spec.js`：逐一完成其他 19 个无配音配对单元词汇区，另验 Lesson 49–50 分拣的真实错答顺序；手机三卡和图片完整、刷新一致。配对／多空整组只算一次，选改、提示和重复按已禁用按钮不计次数。教学区没有作答统计。
- `tests/login/submission-statistics.spec.js`：隔离账号经真实旧包先获得五星，再带中途两次错答升级续做，另一会话显示相同统计、旧星与首次日期；故意丢失同步回复后重发不重复计数。使用冻结旧运行器构建完整课包，不写入虚构分数。
- `tests/e2e/unit1-2-five-zones.spec.js` 与 `unit1-2-award-grammar-upgrade.spec.js`：活动合并导致不可核验的轮次显示“—”，保留学习证据，重新完整挑战后显示数字。
- `npm run test:statistics` 通过 `playwright.statistics.config.js` 运行 Chromium 与 WebKit 两组账号检查；另加 `AWARD_TEST_BASE=/` 验证根路径。显式创建的两个账号会话同样应用手机项目的视口与触摸设置。CI 在两个路径追加 WebKit 统计检查；相关改动会选择 `browser-statistics-webkit`，仍需按实际变更运行其他有关页面检查。WebKit 自动化不代表原用户实体 iPhone 验收。
- `tests/login/award-reveal.spec.js`：悬浮纪念卡在前景时统计卡须等待；关闭后才播放入场与跳数。新获星保留飞入和闪光；已经获星的环节整轮首次全对也展示已有卡面与星光，但不能新增飞星、增加星数或修改首次满星日期。使用真实隔离账号，同时覆盖 `/lesson/` 与根目录入口。
- `tests/e2e/award-reveal.spec.js`：重练全对展示、错后订正不触发本次奖励、刷新不重播；原来的「已获星重练不展示」断言已过时，永久收藏与计星断言保留。

## 共用结算短屏与检查范围（PR #19 后续修复）

新增统计后，不能继续用旧的「整个区块小于 440px」作为版式要求，也不能只检查宽度：普通共用结束页须在 320×568 短屏完整展示三项统计和两个操作，标签／数字不裁切，按钮至少 44px 高；较长的人物成果页保持原插画并允许正常纵向滚动。新增内容不应挤掉推进操作，刷新／重进须同样验证，不能仅用刚关闭获星弹窗后的滚动位置证明可用。

- `l49-v14.spec.js` 保留旧记录合并、未选不代答和星数保留，改以 320×568、768×1024、1280×900 的实际内容、位置和操作验收；两按钮相邻居中、次左主右。点击下一站、返回刷新、再练均检查，取消过时高度断言而不删行为要求。
- `submission-statistics.spec.js` 将其他 19 个配对单元词汇区的结算改在 320×568 验证，包括刷新后的统计与操作；Lesson 1–2 的人物成果、动画和其他短屏由 `unit1-2-completion.spec.js` 保留验证。
- 账号版 `submission-statistics.spec.js` 增加真实 Lesson 3–4 获星后关闭弹卡、点击下一站、返回刷新、重练的短屏检查；账号栏占用高度也计入。配合原有旧包五星、首次日期与跨设备同步场景，Chromium／WebKit 和 `/`、`/lesson/` 都要通过。
- 共用运行器、分拣、页面编排、样式或结算组件变动自动选择 `browser-completion` 与 `browser-statistics-webkit`。前者包含上述三份课程页面测试，后者验证账号与成果保留。`tests/workflow/check-workflow.test.js` 对这些文件逐一模拟变更并检查实际测试命令，避免只靠记忆选范围。

修复依据与复测入口见[短屏结算与检查范围 v0.31](../docs/award-version/2026-10-12-0923-v0.31-短屏结算与检查范围修复.md)。检查组通过不等于完整 CI 通过，PR 必须以最新提交的全部必需检查终态为准。

# Lesson 1–2 与纪念册文案精简（2026-10-11）

其他文案及验收见[文案精简实施 v0.27](../docs/award-version/2026-10-11-0205-v0.27-Lesson1-2与纪念册文案精简实施.md)。其中「首次答对 n/N」替代三项统计卡的方案，已按用户后续要求由上方 v0.28 恢复。题干精简、学习记录折叠、纪念册文案与同步状态保持。

- `tests/e2e/unit1-2-copy.spec.js`：星星进度对应真实开始、继续、重练与查看；短题干仍保留判断条件；三句摘录可展开七句原文；错答订正、记录折叠与重练；冻结改文案前的内容，真实答到第三题后升级，原位继续并正常获星。
- `tests/login/copy-polish.spec.js`：临时账号从空纪念册到获星入册；目录、动画开关、点击放大、GIF 与焦点返回；本机草稿、在线等待、请求失败和恢复同步的文案。分别用默认 `/lesson/` 与 `AWARD_TEST_BASE=/` 验证，不能把跨脚本的同步事件放进会被存储命名空间改写的前缀。
- 共用卡片和文案修改继续运行已有五区、三单元奖励、历史升级、开书、翻页、账号隔离、首次满星日期、重开练习与窄屏检查。只替换已批准修改的文字预期，保留原先的业务断言。

# 悬浮纪念卡结算（2026-10-10）

`tests/e2e/award-reveal.spec.js` 从三个单元真实答题验证新星、五星流动金边、首次日期、旧版续做与原题重练、错误原因、无按钮和任意位置退出、动画中断及窄屏。奖励浮层默认播放动效：系统减少动态开启／关闭时都检查实际落星、星光变化与金边角度变化，不只检查动画名称。`tests/login/award-reveal.spec.js` 使用临时账号，验证服务器确认、离线与补传、真实姓名、跨设备、账号隔离与身份失效。根目录可用 `AWARD_TEST_BASE=/` 运行同一套账号检查。

获星动画的防闪烁检查必须走带账号和课程加载保护的完整页面。页面测试在动画期间同时观察每帧与短暂 DOM 变化，要求课程加载页不重新遮挡纪念卡；覆盖三单元、桌面／手机、离线补传及连续五次获星，并验证飞行星星实际移动、落位后继续闪亮。不能只检查结算最终截图。飞行星星及空星／亮星切换均须使用已准备好的实际图片节点；仅预加载相同网址，不能保证新建或改换图片的节点立即可显示。

共用卡面变动继续检查原三单元奖励、Lesson 1–2 完成页、缓存断网旅程、纪念册及 GIF。历史脚本须按新页面点击关闭结算；不能删除原先的获星、学习记录和导出断言。完整代码与实际结果见[悬浮卡正式接入](../docs/award-version/2026-10-10-1646-v0.22-悬浮纪念卡正式接入与验收.md)。

# 翻页纪念册正式接入（2026-10-09）

Lesson 1–2、3–4、5–6 现行规则为每单元五个答题区、整轮首次提交全部正确才获星，题量分别为 37／25／26。Lesson 1–2 已衔接下方语法五区方案。下方历史验收中的 15 星、填写姓名和领取弹窗不适用于这三门课；阅读完成与获星须分开验证。Lesson 5–6 的指代／冠词合为“介绍小工坊”，品牌／拼句合为“汽车小问答”，保留原题与旧链接兼容。

- `tests/login/award-book.spec.js`：临时真实学生的首星入册、三张卡、跨设备、课程关闭后的收藏、切换账号、未登录拒绝、失败重试、待同步上传、长姓名、四种宽度、真实翻页和 GIF。翻页／放大／导出不新增个人接口请求；同一套可用 `AWARD_TEST_BASE=/` 验证根目录部署。
- `tests/login/award-book-opening.spec.js`：正式 A 侧翻开场逐帧检查封面不透明、真实卡片随封底落位、图片就绪及末帧衔接；手机自动展开／点击跳过、键盘和焦点、旧样板链接不显示比较条。与上项同跑以保护真实翻页、持续星光和五星流动金边，不能只检查最终截图。
- `tests/e2e/three-unit-awards.spec.js`：错答订正不补星、刷新不重置本轮失误、完整重练获星、已获星不撤回；冻结发卡前 HTML／内容／控制器，真实完成后升级，旧题记录和旧证书仍在，新版不自动获星。
- 三单元已有课程、账号、旧内容升级检查一起执行。旧录音 A04 检查改用冻结配音页面，继续检查实际播放结束、文件指纹和失败重试；现行无配音页面单独检查无英语请求。撤下的暂停按钮改为刷新后验证未提交选择，不跳过原目标。
- `tests/unit/award-collection.test.js`：服务器规则、分版本留存、学生隔离、重置保留和首次满星日期。

并行工作树可用 `LOGIN_TEST_PORT=4374 npm run check:commit`；账号检查的备份、迁址和旧版升级辅助服务会按相同偏移使用独立端口，来源校验也随之更新。该配置纳入检查结果缓存标识，不能复用另一测试地址的成功结果。课程测试仍按下方端口限制执行。

实施范围和未验边界见[纪念册正式接入与验收](../docs/award-version/2026-10-09-1322-v0.20-纪念册正式接入与验收.md)。浏览器自动检查不代替真实安卓微信保存图片、线上并发和正式发布验收。

缓存复访计时独立在 `tests/e2e/course-cache-performance.spec.js`：完成一次正常准备后，保持同一浏览器与持久缓存，20 次重新打开导航页、真实点课，恢复交替保存的第 2／3 页词卡；P95 仍小于 1500 ms，图片、字体和脚本不重新下载。以浏览器内的实际点击时刻到图片、字体与真实按钮全部就绪的画面计时，不把测试工具轮询算入加载时间，工具侧耗时另列。不录制追踪、不强制垃圾回收、不额外预热其他课程。成功或失败都保留部分样本、失败步骤和浏览器错误。

`course-cache-cold.spec.js` 中的 10 Mbps／150 ms 冷加载采用相同边界：从导航中的真实点击事件计时，直至加载层消失、字体和图片就绪、词卡可操作且进入已渲染画面；仍须小于 5 秒。不把点击前的自动滚动、按钮等待或断言轮询计为用户等待。报告同时保留 `elapsedMs`（页面实际耗时）与 `driverElapsedMs`（原工具耗时），无论通过或失败均输出到 CI 日志及附件；计时场景不启用追踪，其余故障行为检查保留追踪。

同一标签连续刷新 20 次另验位置、完整素材、可操作按钮和零重下载，保留压力场景的实际耗时，不把它替代缓存标准 C03 的“从点课到恢复位置”。CI 使用 `@cache-performance` 标签把冷加载与复访计时放到独立任务，并以两个命令分别启动浏览器；四组课程检查运行其余全部用例，汇总 `test` 同时要求性能任务成功，不能静默跳过。本地计划相应使用 `browser-cache-cold`、`browser-cache-revisit` 和不含这两项计时的 `browser-course-cache`；5 秒冷加载与 P95 1.5 秒复访门槛保持不变。PR #15 合入时合计 1385 项页面检查（1384 项课程行为＋1 项复访计时）。共享缓存代码变化仍同时验证冷加载、复访和连续刷新。`course-loading.spec.js` 还验证课程不预载其他单元场景，以及 Lesson 1–2、3–4、49–50 各自背景实际显示。

# 老师体系（2026-10-09）

`node --test tests/unit/teachers.test.js` 验证老师 `字母＋1＋七位流水` 与学生 `字母＋0＋七位流水` 的独立编号、用户给定的三位老师示例、不可变工号及上限、拼音＋三位随机数（含前导零）、首次改密、初始密码失效／到期／重启／备份、启禁用、多对多关联与版本冲突、按当前班级授权、打印／单人／混合批量／转班／学习详情／课程预览及固定资源、异步批量期间撤权／转班／禁用的整批回滚、双身份资源访问及老师限流。

老师页面验证使用本地虚构账号：创建／编辑、拼音核对、多班分配、姓名／工号搜索、启禁用和密码重置、首次改密、无班级空状态、班级多老师、学习页、预览、保存失败保留草稿、同项并发冲突和独立字段保存；检查 320／390／1280 宽度、Esc 和焦点恢复，截图不含密码。共用入口和权限变化仍运行现有 `npm run test:login`；发布、手机真机、教师试用分别验收。设计和实际结果见 [管理系统／老师体系设计与验收](../docs/管理系统/老师体系设计与验收.md)。

# 学习进度管理（2026-10-08）

`node --test tests/unit/admin-learning.test.js` 验证现行 21 门课、未开始／学习中／已完成三态、零星作答、独立星星规则、必做阅读、未提交隔离、重复／乱序同步、旧内容和重开隔离、课程关闭与转班、多状态并集筛选、星星升降序、同星按学号排序、先排序后分页、最近有效学习时间及 HTTP 权限；原跟进接口已撤下。浏览器检查四列名单、表头姓名／学号搜索、多状态筛选弹层、表头星星排序、跨页顺序、条件标签清除、键盘／Esc／点击空白关闭、学习时间、详情／返回／刷新、旧链接、错误重试及桌面／窄屏布局。时间单元检查覆盖访问／重复同步不计时、零星重试计时、课程范围、关闭与重开隔离及旧成果时间未知；实际浏览器和历史零星真实作答验证见实现记录。[实现与验收说明](../docs/butcher-version/2026-10-08-学习进度管理实现与验收.md)。共享账号、同步与样式修改仍按 `check:plan` 的相关范围验证。
# Lesson 1–2 五区整合（2026-10-09）

与 PR #15 衔接后的纪念卡、获星和旧版升级边界见[衔接 v1.6](../docs/butcher-version/2026-10-09-2305-v1.6-语法与纪念册合入衔接.md)。`unit1-2-award-grammar-upgrade.spec.js` 从已发布的旧五区页面真实完成后升级；账号和纪念册检查继续验证永久收藏、零错新星、离线补传、首次日期和不同学生隔离。旧证书元数据保留，但新版卡片姓名只来自账号，满星日期只来自新版获星记录。

现行方案见[五区整合 v1.5](../docs/butcher-version/2026-10-09-1134-v1.5-Lesson1-2五区整合与验收.md)：5／5／12／5／10 共 37 题，五颗零错星与学习完成分开。以下六区、15 星等旧记录只说明对应历史版本。

- `unit1-2-five-zones.spec.js`：五区、旧入口、迁入题、工坊配对、零错星与重练、冻结六区页面升级；不注入学习状态。
- `unit1-2-completion.spec.js`：五个新版结算页、三张 imagegen 图标、四种宽度、390×500 短屏与重练统计。
- 工坊、布局、历史语法版本、综合挑战与 `unit-thirteen-types.spec.js`：37 题完整流程及 Lesson 25–26 共用题型回归。
- 登录配置下的 `unit1-2-five-zones.spec.js`、`thirteen-types.spec.js`：临时账号实际学习、首页五颗星、错答后完成不发星、另一设备恢复、已获星与新一轮草稿独立保存。

本轮实际运行结果见 v1.5 文档；不等于线上发布或真实手机验收。

# Lesson 1–2 结算页恢复（2026-10-09）

[修复与验收 v1.4](../docs/butcher-version/2026-10-09-0121-v1.4-Lesson1-2结算页恢复与验收.md)：六个答题环节统一人物成果画面和三张固定统计卡，使用已认可的 imagegen PNG。`unit1-2-completion.spec.js` 从实际作答核对六个结束页、正确素材及加载、普通／缓存路径、四种宽度、零值与两位数、刷新和重练。现有工坊、布局和综合挑战检查继续核对统计与学习记录；不得再以旧SVG作为正确预期。

本次四个文件共12项页面检查通过，详情见上方文档。不代表其他单元、真实手机或线上发布已验收。

# Lesson 1–2 语法小工坊（2026-10-09）

当前设计见[v1.3与验收](../docs/butcher-version/2026-10-09-0018-v1.3-Lesson1-2语法小工坊设计与验收.md)：全课37题，工坊12题、综合10题。只通过页面行为验收。

- `unit1-2-grammar-workshop.spec.js`：连续练习、短示范、错答重试、人称变化、灯泡记录、三张统计卡、重练清零。
- `unit1-2-grammar-guide.spec.js`：四种宽度、动作区稳定、顶栏不遮题、原参考材料、键盘和未提交草稿。
- `unit1-2-grammar-v2.spec.js / v3.spec.js`：三个真实历史版本正常作答后升级，新增题空白、未改成绩和证书信息保留。旧独立示范已被新流程替代，不再要求三页动画控件存在。
- `unit1-2-exam.spec.js` 与 `unit-thirteen-types.spec.js`：十题综合、完整通关、子路径缓存加载、证书、Lesson 25–26 同题型回归。旧样本仅供路由测试，不公开暴露。

可用独立端口运行上述6个文件：`COURSE_TEST_PORT=4268 ./node_modules/.bin/playwright test <文件…>`。实际结果只见本次设计文档和证据，不沿用历史21项结果。

# 新版纪念卡迁移（2026-10-08）

Lesson 1–2 在本段所述历史版本为25题无配音课堂版，原找物与拼句合并后共五个答题区，按整轮零错计星。`unit1-2-award.spec.js`、`unit1-2-certificate.spec.js`、`unit1-2-award-migration.spec.js` 验证错误／重练、旧进度、五星日期、卡片及独立练习纸；`tests/login/unit1-2-award.spec.js` 用临时账号验证姓名、离线同步、不同学生、换设备、重开、真实 GIF、长姓名与导出失败重试。通过 `LOGIN_TEST_PORT` 独立选端口，`AWARD_TEST_BASE=/` 可追加网站根目录验收。

共用题目行为回归使用 `unit-thirteen-types.spec.js`、`common-interactions.spec.js`、`retry-feedback.spec.js` 和导航／综合挑战检查。Lesson 1–2 的旧15星验收不再代表当前奖励规则；其余课程仍沿用原实现。实际结果见 [奖励设计与迁移](../docs/award-version/README.md)，提交、推送、发布与真实手机验收另列。

# 共性交互修复（2026-10-06）

现行规则见 [统一标准 v1.49](../docs/butcher-version/publish/2026-10-14-0013-v1.49-教学单元设计标准与验收清单.md)。当前声音模式以现行标准第7节及各单元记录为准，以下旧测试范围不代表今天的课程模式。

- `common-interactions.spec.js` 验证 20 个无配音单元的手机／桌面课文三态按钮、精简进度、全页无玩法／暂停／键入题；从真实旧暂停和原输入版通关记录验证直接续做、改题重答与证书纪念保留。
- `unit-thirteen-types.spec.js` 文件名沿用最初试排；当前验证点击版；Lesson 1–2为37题，Lesson 25–26为27题。E07 已撤下，测试不再要求英文输入框。
- 旧玩法弹窗检查改为教学例句或学习手记；旧暂停测试继续核对刷新后的未提交选择、错误和进度，不能删除学习状态断言。冻结前版仅在测试路由内使用。
- 共用控件还需回归 `retry-feedback.spec.js`、`l49-focus.spec.js`、受影响单元布局与登录成果；运行结果见本次修复记录。以下早期记录保留为历史，不作为当前题数和声音模式的判据。

# 怎样检查修改

历史范围（2026-10-07，不作为当前豁免）：当时按上线前无正式学生的前提，五项历史课程升级用例不纳入当前验收：`units1-6-exam-upgrade.spec.js` 的 Lesson 1–2、3–4，`unit11-12-upgrade.spec.js` 的 classroom、short-exam 两项，以及 `units17-30-upgrade.spec.js` 的 Lesson 25–26。这些现存历史跳过项明确标为 skipped，不计为通过；测试内容和运行时迁移逻辑保留。现已存在学生记录，后续涉及其格式或行为的修改必须重新评估范围，不能沿用当时前提跳过保留记录与升级验证；不能仅改文档或删断言把它们记为通过。新学生创建、首次改密、正常学习、刷新与跨设备同步、密码重置及备份恢复仍照常验收。

班级访问分支另运行 `npm run test:login`（4181 端口，备份恢复 4194、公开缓存迁移 4195、学习卡升级 4196）。现行测试覆盖真实学号登录、首次强制改密、老师查找/重置、主动改密、多音字校正、同名不同号、旧码停用与成绩迁移，以及原管理、权限、缓存与成果同步。此前 21 个不同页面行为用例的两轮结果见[账号验收](../docs/butcher-version/2026-09-25-1151-v1.1-学号密码实施与验收.md)。本次新增 3 个设置弹窗用例：`npm run test:login -- tests/login/settings.spec.js` 覆盖全部十六个单元的桌面／手机居中、文字对比度、窄屏确认、关闭保留操作及切换／退出，详情见[弹窗修复记录](../docs/butcher-version/2026-09-25-1643-v1.0-学习设置弹窗修复与验收.md)。`npm run build:login` 核对当前三十个受保护单元（新增课程仍须逐班授权）；本分支的 `build:static` 拒绝发布。以下无身份旧课件测试只用于内部教学／缓存回归，不能当作生产权限验收。完整发布还需真实手机与线上检查。

账号安全回归：`npm run test:login -- tests/login/security.spec.js tests/login/student-accounts.spec.js tests/login/recovery.spec.js`。覆盖拼音加三位随机数字的初始／重置密码（含前导零、同拼音新账号不重复）、并发重放、到期／重启不续期、旧库迁移、待领取凭据的备份恢复、真实页面打印和找回流程，以及代理来源分桶、伪造头与等价地址防绕过。使用临时虚构账号，不读取或改动真实学生数据；实际 Nginx 和手机微信验收另列。

班级设置专项：`npm run test:login -- tests/login/class-settings.spec.js`，验证班级独立改名及即时刷新、课程全选／取消全选与计数、保存成功弹窗、键盘关闭和焦点返回、320／390／1280 宽度、保存期间防重复提交、失败保留输入与重试，以及部分更新不覆盖另一项设置。后台接口和课程权限同时回归 `access.spec.js`、`security.spec.js`；原有页面用例明确关闭成功弹窗后继续操作。

打印窗口另外验证：在普通 Chrome 中点“打印账号”，确认实际打印预览打开，随后取消；A4 PDF 导出不能替代这个检查。`student-accounts.spec.js` 还模拟内置浏览器的 `window.print()` 静默返回，确保页面显示改用 Chrome／Safari 的提示，按钮可重试。

账号批量操作：`node --test tests/unit/admin-accounts.test.js tests/unit/server-security.test.js`，核对新建／重置密码为拼音加三位数字（含前导零）、同拼音新账号不重复、单人／批量重置的会话撤销、未选学生与成果保留、失败整批回滚、并发改密和管理员指定密码的标准输入路径。页面另检查“所有学生”／班级／搜索的全选、半选、取消、确认、手机宽度，以及重置后的旧密码拒绝和首次改密。A4 导出实际 PDF：普通账号每页 10 张，长字段每页 6／4 张，不缺人、不重复、不跨页裁切；账号页验证本地 Maple Mono NL 字体成功加载，目视检查大小写及 `I/l/L/1`、`O/0` 字形。相关课程选项数量只统计 `#courses`，不把学生选择框计入开放课程。

security-version 另有 `node --test tests/unit/server-security.test.js tests/unit/preview-security.test.js`，验证授权记录有界、旧 token 保留、持久登录冷却、限流记录容量、私有文件权限和预览路径隔离。账号专项增加跨来源/重启冷却、老师恢复和真实浏览器 CSP；预览修改连同 `course-loading.spec.js`、`lesson-deployment.spec.js`、`landmark-review.spec.js` 检查正常路由。真实 Nginx 模板检查为 `NGINX_BIN=/实际路径/nginx OPENSSL_BIN=/实际路径/openssl node --test tests/deploy/login-nginx.test.js`，未配置二进制时明确跳过。详见[安全加固方案](../docs/security-version/2026-09-28-安全加固方案与验证.md)。

`test:deploy` 中旧 `buildStatic` 使用独立的公开课程测试目录，验证输出白名单、文件摘要和干净的 Git 版本；不能再把当前账号版仓库作为匿名公开站点来构建。另有真实命令检查，确认当前仓库拒绝 `build:static`；账号版发布清单使用 `build:login`，实际登录与资源权限由账号页面和正式服务验收。

多个工作目录同时验收时，课程检查可通过 `COURSE_TEST_PORT=空闲端口 npx playwright test ...` 选择独立端口，现行缓存、导航、跨窗口和公开边界检查均跟随该配置。账号检查另设 `LOGIN_TEST_PORT`，辅助服务随之偏移。不要结束其他会话占用端口的进程。

Lesson 3–4 现行为无配音课堂配套版，共 25 题；前置场景见[无配音优化与验收](../docs/butcher-version/2026-09-25-0148-v2.0-Lesson3-4无配音优化与验收.md)。`npx playwright test tests/e2e/unit3-4` 检查全声音失败通关、零英语请求、25 张音标词卡、完整原文、柜台正确确认后才交接、旧真实记录迁移、窄屏、缓存与 PNG／A4。`unit3-4-umbrella.spec.js` 另按[已确认分镜](../docs/butcher-version/2026-09-25-1607-v2.2-Lesson3-4雨伞叙事与验收.md)验证三把伞的出现时机、身份不变的交接、快速点击与重演、减少动态效果和缺图／断网恢复；正常动画与减少动态效果分别在实际浏览器检查。历史配音检查已收至 `tests/fixtures/unit3-4-voiced-before/`。共享题目草稿迁移仅接受明确前一版内容，不从历史成绩填答案；需连同 `unit-dedup.spec.js` 和 `l49-v110-defenses.spec.js` 回归。

Lesson 1–2 当前场景样板见[设计与验收](../docs/butcher-version/2026-09-24-0121-v2.0-Lesson1-2场景样板与验收.md)，共 29 道练习。`npx playwright test tests/e2e/unit1-2` 覆盖原有流程与新增 `unit1-2-scene.spec.js`：归还前后的场景状态、未提交不交包、错答不推进、刷新与重练、对白不遮住手机上的人物按钮、旧记录升级及 `/lesson/` 资源路径。`tests/fixtures/unit1-2-scene-before/` 保留真实旧内容与页面行为，只用于升级验证。

[对白与道具优化 v2.1](../docs/butcher-version/2026-09-24-1312-v2.1-Lesson1-2对白与道具优化.md)的布局回归连同 `unit-themes.spec.js` 执行：检查短句、长句、历史翻译、内部重听、人物与手提包的间距及已归还比例。最终落位在反馈动画结束后测量；页面截图仍需目视复看。`assets/unit1-2/handbag.svg` 也用于 Lesson 11–12 的认领小画册，修改图标须复看该处。

[人物与场景优化 v2.1](../docs/butcher-version/2026-09-25-1136-v2.1-Lesson3-4人物与场景优化.md)增加 `unit3-4-scene.spec.js`：检查人物不再过小／悬空、雨伞实际交到客人手边、错答及未提交不交接、刷新与重练、中文展开不裁掉当前句；带加载页的入口还会模拟较慢图片解码，确认刷新后当前句与保留进度一致。截图在 `output/playwright/unit3-4-scene/`；仍须实际目视复核，不能只凭尺寸断言判定美观。

统一标准 v1.49 将功能与视觉验收分开：除题目去重，还要对照相邻单元的场景与任务，复看角色、道具、短／长对白、作答前后和每个结束页。新单元依据自己的教学内容建立页面预期；样板用例通过不代表其他单元已通过。

网页加载与缓存的行为清单单独见[缓存方案 C01–C15](../docs/butcher-version/publish/2026-09-24-2031-v1.0-网页加载缓存设计.md#7-页面行为验收清单)。实现覆盖首访完整图片、重启复访、弱网失败、缓存缺失、更新与旧页并存、子目录隔离及实际证书。缓存专项运行 `npx playwright test tests/e2e/course-loading.spec.js tests/e2e/course-cache-cold.spec.js tests/e2e/course-cache-updates.spec.js tests/e2e/course-cache-performance.spec.js tests/e2e/course-cache-journeys.spec.js tests/e2e/lesson-deployment.spec.js`；最后一次真实结果见缓存文档，不把单元旧测试当作缓存证明。

先按[统一标准的模式对照](../docs/butcher-version/publish/2026-10-14-0013-v1.49-教学单元设计标准与验收清单.md#7-声音加载与访问)确定本次范围：两种模式都验证第8节共用清单；依据第7节追加配音听审与播放门槛、或无配音全流程检查；切换模式或内容升级另验记录迁移。无配音版须验证全部声音失败仍可完成、零英语配音请求与零系统朗读，反馈音另在正常环境验证。停用录音的播放项记不适用，历史待听审状态保留，不算通过。

错答反馈统一按[现行设计标准](../docs/butcher-version/publish/2026-10-14-0013-v1.49-教学单元设计标准与验收清单.md)验收。运行 `npx playwright test tests/e2e/retry-feedback.spec.js tests/e2e/l49-focus.spec.js`，覆盖 23 个现行课程入口的短反馈、原题重试、不高亮／朗读答案、灯泡不以解析兜底、真实空格及旧记录衔接，也覆盖 Lesson 49 和 49–50 分拣题从错答到原题重试的手机滚动位置。课程和共享练习改动会自动加入包含两份测试的 `browser-retry-feedback` 检查计划。历史测试中“答错显示正确答案”或“答错直接继续”的预期已经失效；不能为了保留旧断言恢复泄题或跳题。

需要 Node.js 24 或更新版本。首次检查前，在项目根目录运行：

```bash
npm ci
npx playwright install chromium
```

浏览器测试会自己启动本地网站。4173 被其他会话占用时，使用上面的独立端口，不停止其他会话的服务。

## Lesson 1–30 现行题目改版检查

现行题量与逐题依据以 [v4.0 题稿和验收记录](../docs/butcher-version/2026-09-27-2116-v4.0-Lesson1-30题目优化与验收.md) 为准：14个单元新增／改写41道任务，21–22保留已确认样板，15个单元合计449道必做任务。下方各单元的早期记录保留历史背景，不能以旧题数判断当前页面失败。

- 新控件和新题：`npx playwright test tests/e2e/units1-30-tasks.spec.js tests/e2e/units1-30-revision.spec.js tests/e2e/units-room-tasks.spec.js tests/e2e/units1-30-scene-cues.spec.js`。覆盖配对、原文定位、逐空填答、整句排序与房间找物的错误、提示、重试、刷新、场景映射；期望答案从独立题稿转录，不从运行页面获取。
- 逐课验收：`npx playwright test tests/e2e/units1-30-acceptance.spec.js`。15单元全流程、14单元真实旧轮次升级、每道新题四种宽度与状态、14单元同环节改前截图。截图还需目视复核，画廊在上述记录中。
- 自动检查的新截图写入 `output/test-units1-30-tasks/` 和 `output/test-unit21-22-tasks/`；审阅后才手动归档到文档证据目录。复跑不能直接覆盖已发布证据或修改检查输入。
- 账号成果：`npx playwright test -c playwright.login.config.js tests/login/units1-30-tasks-upgrade.spec.js`。使用4223的临时服务器与临时账号，先完成旧版、第二个浏览器补新版、第三个浏览器核对同步；不读写真实学生数据。
- 共用错误反馈：`npx playwright test tests/e2e/retry-feedback.spec.js tests/e2e/l49-focus.spec.js`。旧课程受影响的回归继续按下方命令选择。

Lesson 1–2仍有英语声音。用于题目迁移的播放结束替身只验证页面流程，不代表录音质量已听审；Lesson 3–30须阻断声音仍可完成、零英语声音请求与零系统朗读。真实微信、触控设备和课堂验收另列。

## 选哪项检查

| 改了什么 | 运行命令 | 检查内容 |
| --- | --- | --- |
| 共享计算或存储 | `npm run test:unit` | 评分、进度、数据异常 |
| 课程进度和刷新恢复 | `npm run test:state` | 首页、Lesson 49–54、音标课 |
| Lesson 49 活动 | `npm run test:l49:behavior` | 题目、提示、重试、重练、旧记录 |
| 页面交互 | `npm run test:e2e -- <测试文件>` | 受影响的浏览器操作 |
| 路由、文档、发布规则 | `npm run test:deploy` | 发布文件、目录配置、跳转 |
| 日常开发和提交 | `npm run check:commit` | 按改动选择逻辑和浏览器专项 |
| 只运行快速逻辑检查 | `npm run test:quick` | 单元检查和检查流程回归 |
| 完整回归 | `npm run test:full` | 单元检查和完整浏览器检查 |
| 准备正式发布 | `npm run verify:v1:release` | 上述检查及静态发布包 |

最后一项要求公开文件已经提交、工作区满足构建要求。它只检查和构建，不会自动提交、推送或上线。

## 提交和推送的完成条件

先用 `npm run check:plan` 查看本次范围。`check:commit` 默认比较工作区与 HEAD，包含已暂存、未暂存、新增和删除文件；检查已提交的一组修改时加 `-- --base <起始提交>`。

纯文档检查差异和本地链接；代码修改检查逻辑，并按音频、进度、布局和改动的测试文件增加浏览器专项。自动选取的是提交前基础检查，功能修复仍需覆盖原问题和受影响的真实页面。

提交前核对暂存内容与已测工作区一致；部分暂存与已测内容不一致时，先对齐待提交版本并检查。相关检查通过后完成已授权的提交、推送。目标远端提交号一致即推送完成，CI 状态单列；完整发布验收在正式发布阶段执行。

## 复用检查结果

检查入口把耗时、日志和成功记录保存在 `.cache/check-workflow/`，24 小时内可复用同一输入。源码、测试、命令、依赖版本、Node、系统或浏览器变化，失败、缺少所需产物、执行期间输入变化，均不能复用。加 `--force` 可强制复查，例如 `npm run test:quick -- --force`。

`npm run test:e2e:cached` 执行或复用完整浏览器检查；`npm test` 和发布命令继续保留完整覆盖。缓存命中只说明对应范围通过，不等于发布完成。检查锁残留时，先确认原进程已结束，再只删除提示的该项锁目录。

CI 按下方触发范围执行，同分支的新版本会取消过时检查。正式发布只接受目标版本自己的完整有效结果，并完成下列实际页面和线上检查。

## CI：少重复，覆盖不减

- 普通分支推送：`quick` 只跑检查流程、单元与发布契约测试。它不能代替合并检查。
- 所有 PR、`main`／`codex/release-canranstudio` 推送及手动运行：`verify` 完整执行；必需状态仍叫 `test`，任何必需组失败、取消、跳过或缺失都不能通过。一个功能分支提交不再同时触发两套完整浏览器检查。
- 课程按历史耗时分成 8 组，账号分成 3 组；文件内部仍串行，每组独立服务。缓存性能保持单独运行，WebKit 保留根目录和 `/lesson/` 两种路径。
- 每次从 Playwright 实际发现用例，再分配完整文件。历史数据只估算耗时，不是用例白名单；新增测试自动加入。`node scripts/ci/browser-suite.js verify` 核对各组实际选择的用例，确保总清单无遗漏、无重复，保留既有跳过用例。
- CI 保存 7 天的分组清单、JSON 报告和已有失败追踪／截图；不上传账号数据库。下载对应任务的附件定位问题，不能把失败后重跑的成功结果算作首次成功。

查看分组：`node scripts/ci/browser-suite.js plan courses`（或 `accounts`）。复查某组：`node scripts/ci/browser-suite.js run courses 1`；仍可用原 Playwright 命令复查单文件。

耗时基线在 [timings.json](../scripts/ci/timings.json)，来源为 [PR #20 最终成功检查](https://github.com/mrpersimmon/canranstudio/actions/runs/38544207131)。按当时数据，课程组由最慢约 48 分钟测试时间均衡到约 21.5 分钟／组，账号约 20 分钟／组；**这不是新工作流的实测承诺**，安装、排队、机器差异另计。后续按成功运行的 JSON 报告逐文件更新耗时，保留来源；不要为加速删题、放宽断言、拆散串行文件或只复跑失败项作为最终门槛。

## 针对某个问题复查

在 `npm run test:e2e --` 后加测试文件路径，例如：

```bash
npm run test:e2e -- tests/e2e/audio-lifecycle.spec.js
```

常用文件：音频 `audio-lifecycle.spec.js`、证书 `certificate-export.spec.js`、键盘与读屏 `accessibility.spec.js`、字体 `local-fonts.spec.js`、移动布局 `mobile-release.spec.js`，都在 `tests/e2e/`。

当前分支的课程导航检查用 `butcher-navigation.spec.js`，覆盖组合单元入口、继续学习、旧地址、触屏、键盘与进度隔离；组合单元完整流程用 `unit49-50.spec.js`。旧城区地图的界面专属检查已随设计替换归档在 `tests/archive/atlas-2026-09-19/`，现行路由、进度与设备检查仍保留运行。

Lesson 1–2 与 Lesson 25–26 当前采用[共性交互修复后的点击版](../docs/butcher-version/question/2026-10-06-1649-共性问题修复与验收.md)。运行 `npx playwright test tests/e2e/common-interactions.spec.js tests/e2e/unit-thirteen-types.spec.js tests/e2e/unit1-2 tests/e2e/unit25-26`：两课均为无配音，分别 25／27 题，按实际任务覆盖 10／12 类。专项核对中文词块、点击补词、连续阅读、正确后才推进的场景、未提交草稿与排序恢复、真实旧轮次升级、根路径与 `/lesson/` 全流程、四种宽度和实际证书 PNG。教材原文、词卡、书面材料和单页 A4 仍单列检查。教师、儿童与实体手机体验仍需人工验收；当前无必做英文键入题。

首轮试排使用 `types-v1`；本次改写的补词题和礼貌题使用 `clicks-v1`。相同题才承接旧记录，证书姓名和原日期保留。两轮改版前的真实内容分别冻结在 `tests/fixtures/unit1-2-types-before/`、`tests/fixtures/unit25-26-types-before/` 和 `tests/fixtures/common-interaction-before/`，仅通过测试拦截提供，不扩大本地服务器公开范围，也不进入发布包。Lesson 1–2 的历史配音、旧题序与旧分镜检查随页面归档，现行页面零英语音频请求由 `course-loading.spec.js` 验证；共享提示、重试与末题防护继续由 `l49-v18.spec.js`、`retry-feedback.spec.js` 覆盖。词块固定行高由 `unit25-26-layout.spec.js` 检查，缓存后的两课完整离线作答由 `course-cache-journeys.spec.js` 检查。

账号入口用 `npx playwright test -c playwright.login.config.js tests/login/thirteen-types.spec.js tests/login/units1-30-tasks-upgrade.spec.js --grep '1-2|25-26'`：虚构临时新账号完整通关、换设备恢复 15 星与证书，以及真实旧服务器升级后新题空白、亲自补答、第三设备同步和原日期保留。两类结果分别报告，不以匿名页面通过代替账号同步验收。证书共享修改时，连同 `unit49-50-certificate.spec.js` 回归；导航与子目录修改时，连同 `butcher-navigation.spec.js` 和 `lesson-deployment.spec.js` 回归。

Lesson 5–6 的检查用 `npx playwright test tests/e2e/unit5-6`：按[无配音优化 v2.0](../docs/butcher-version/2026-09-25-1643-v2.0-Lesson5-6无配音优化与验收.md)独立验证 20 句、30 题、24 张音标国旗词卡、全声音失败通关、正误反馈音、Sophie 留场及逐句人物切换、错答/提示记录、四种宽度、键盘、证书 PNG 与单页 A4、首页继续和 `/lesson/` 缓存离线恢复。`unit5-6-upgrade.spec.js` 通过冻结旧页面实际产生旧记录，再检查中断续读、历史配音版旧 15 星转为 9 星、新词义与综合题空白、姓名与未改题保留及重练优先。换组闪烁另运行 `tests/e2e/course-image-transitions.spec.js`，逐帧和 DOM 变化时记录全页可见性、加载层及缺图，覆盖配音／无配音、首访／复访、离线与会话降级；已加入共用缓存检查计划。历史 80 段录音检查保存在 `tests/fixtures/unit5-6-voiced-before/audio-checks.js`，不再要求现行页面播放；教师与儿童试用另验收。

Lesson 7–8 当前是[综合挑战无配音版 v2.1](../docs/butcher-version/2026-09-26-1521-v2.1-Lesson7-8综合挑战与验收.md)，用 `npx playwright test tests/e2e/unit7-8`：37 项页面检查覆盖 16 句、32 题（挑战 10 题）、22 张音标词卡、档案填写、参考答案延后开放、零英语配音请求、全声音失败通关、末题刷新不代答、稳定按钮、词块撤回、四种宽度、证书 PNG／单页 A4 和练习纸。新挑战单独有 8 项，按独立题稿逐题作答，核对首次／提示／修正记录、六词块完整显示、暂停续做、旧三题迁移和离线恢复；不能从程序答案字段生成预期。

升级验证从历史页面实际操作产生旧记录，再加载现行页面。历史配音版、27 题课堂版、25 题且挑战仅三题的版本分别在 `tests/fixtures/unit7-8-voiced-before/`、`tests/fixtures/unit7-8-classroom-before/`、`tests/fixtures/unit7-8-exam3-before/`，均不发布。只导入内容一致的有效作答，新增 her 题及七道综合题保持未答，重练不能再导入旧答案。`browser-unit78` 随源码、素材、历史样例及两个流程辅助变化加入检查计划。

账号入口另运行 `npx playwright test -c playwright.login.config.js tests/login/course-integration.spec.js tests/login/unit7-8-exam-upgrade.spec.js --grep '7–8'`：新账号无配音通关、更早 27 题版本升级后 9→15 星、旧三题版本升级后 12→15 星；名字、证书日期及成绩在新设备恢复。旧服务器样例用 4199、虚构临时账号，不读写真实学生数据库。共享成果规则改动时同时运行 9–10／11–12 的旧服务器升级检查。

`tests/login/portal-worker.spec.js` 延迟真实缓存脚本，先在页面输入，再释放安装：根目录与 `/lesson/` 的首页／课程直链不得刷新清空输入。缓存接管同时连同 `root-mount.spec.js`、`recovery.spec.js` 的旧公开页面迁移验收，不能只保住输入却放宽访问边界。页面检查可用 `COURSE_TEST_PORT=4192` 隔离端口，账号检查使用另一输出目录，避免覆盖证据。教师、儿童及真实手机验收单列。

I 词卡可单独运行 `npx playwright test tests/e2e/unit7-8-audio.spec.js -g 'I 词卡'`：现行预期是保留 /aɪ/ 和释义，翻面、刷新和相邻 am／are 不请求英语配音；两种路径都检查。原 65 段播放和 I 文件指纹检查随历史页面保留在上述样例目录的 `audio.spec.js`，不再作为现行页面交互预期。恢复配音前须重新听审，不能为了通过测试而更换指纹；历史证据见[I 修复记录](../docs/butcher-version/2026-09-21-2112-v1.1-Lesson7-8词音修复与防护.md)。

Lesson 9–10 当前为[综合挑战无配音版 v2.1](../docs/butcher-version/2026-09-26-1732-v2.1-Lesson9-10综合挑战与验收.md)。运行 `npx playwright test tests/e2e/unit9-10 tests/e2e/units9-12-classroom.spec.js --grep-invert 'Lesson 11'`，本课共 44 项：14 句、33 题（挑战 10 题）、22 张音标词卡、问候分镜、六组观察示范、无声通关、重试不泄题、末题不代答、四种宽度、中文展开不裁切、正确回应不推移按钮、旧链接、真实 PNG 及 A4。挑战的新增 8 项按独立教材题稿逐题作答，核对首次／提示／修正、长选项与五词块、暂停、旧三题升级和离线草稿。打印保留 A 六题／B 十二题；页数检查不能代替目视验收。

`unit9-10-upgrade.spec.js` 使用历史页面真实作答检查题目重新分组后的正确记录、未提交草稿、重练隔离、离线图片与翻卡稳定。课堂分组前旧页保存在 `tests/fixtures/unit9-10-classroom-before/`，本轮扩题前旧页在 `tests/fixtures/unit9-10-short-exam-before/`，更早配音页在 `tests/fixtures/unit9-10-voiced-before/`，均不发布。账号检查另行运行 `npx playwright test -c playwright.login.config.js tests/login/course-integration.spec.js tests/login/unit9-10-upgrade.spec.js --grep '9–10'`，共 3 项：新学生完整通关，以及两种 26 题旧服务器升级换设备后，保留原三题、先显示 12 星，新增七题亲自完成后同步 15 星、姓名和原证书日期。全部使用虚构临时账号，不读写真实学生数据库。更早配音版 9→15 星的路径继续由课程检查覆盖。

Lesson 11–12 当前为[认领分镜与综合挑战 v2.1](../docs/butcher-version/2026-09-26-2113-v2.1-Lesson11-12审视优化与综合验收.md)。运行 `npx playwright test tests/e2e/unit11-12 tests/e2e/units9-12-classroom.spec.js --grep-invert 'Lesson 9'`：16 句、30 题（挑战十题）、18 张音标词卡、12 份档案，四种宽度与短屏、无声通关、中文内部滚动、最后一题、PNG／A4；道具不能早于原文出现或确认，Perhaps 题的正确结果只能是请本人确认。

`unit11-12-exam.spec.js` 用独立题稿验证十题覆盖、重试不泄题、灯泡与独立成绩、末题刷新、四选项两行两列和长对白／词块在四种宽度完整；`unit11-12-exam-upgrade.spec.js` 从冻结的旧三题页面实际作答，验证 12→15 星、新七题空白、旧草稿不代答、暂停和断网续答。`unit11-12-scene.spec.js` 检查道具时序、错误和未提交不生成结果、档案完整翻页；`unit11-12-upgrade.spec.js` 从 `tests/fixtures/unit11-12-classroom-before/` 的旧页面真实学习后升级，验证完成记录、草稿、姓名和证书日期保留，以及整课加载、断网续读和翻词卡。`playwright.login.config.js` 下的 `unit11-12-upgrade.spec.js` 与 `course-integration.spec.js --grep '11–12'` 使用临时服务器和账号检查两种旧课堂版本升级、补题后跨设备成果和姓名／证书日期，不读取或修改线上学生。其中 short-exam 场景保留浏览器产生的真实数据，把当前完成签名中的一个汉字分成两段 HTTP 写入，再检查新设备的十题和 15 星；防止请求分段解码损坏中文成绩。

Lesson 13–14 从第一版为课堂配套版，使用 `npx playwright test tests/e2e/unit13-14`：独立题稿的 13 句、34 题（挑战十题）、21 张音标词卡，十幅配色图和 A 五组／B 十二组完整材料；全部声音失败仍通关、反馈音真实结束、末三题刷新不代答、提示和错答分别记录、词块撤回、内容更新保留未改活动、四种宽度与短屏、证书 PNG 和单页打印。图卡正面显示英文和音标，翻面显示中文；不能把翻面隐藏正面内容当作音标丢失。`unit13-14-scene.spec.js` 覆盖分镜道具时序、对白与人物不重叠、内部中文不裁切、固定操作区和翻页画册；`unit13-14-exam.spec.js` 使用独立题稿检查十题与长选项、五词块；`unit13-14-upgrade.spec.js` 通过冻结的 `tests/fixtures/unit13-14-classroom-before/` 旧页面真实学习，检查两题承接、新八题空白、草稿不代答、旧姓名／日期保留、暂停刷新及断网继续。`browser-unit1314` 随源码、插图、冻结样例和流程辅助变化加入检查计划；导航改动回归同上三个文件。导出的实际图片、A4 和颜色图仍须目视检查，教师与儿童验收单列。

本课登录验收使用 `npx playwright test -c playwright.login.config.js tests/login/unit13-14-upgrade.spec.js tests/login/course-integration.spec.js --grep '13–14'`：新账号全程及旧服务器升级后换设备、补齐新题后恢复 15 星与原证书日期。账号与数据均在测试临时环境，不访问线上学生。本次 36 项课程页面、2 项本课登录升级及 2 项共享账号回归的实际命令、截图和限制见[本轮证据](../docs/butcher-version/evidence/2026-09-26-2154-unit13-14-review/README.md)。

Lesson 15–16 当前为[海关分镜与综合挑战 v2.0](../docs/butcher-version/2026-09-27-0013-v2.0-Lesson15-16场景与综合练习优化.md)，采用无配音课堂配套版，使用 `npx playwright test tests/e2e/unit15-16`：完整 18 句、34 题（挑战十一题）、25 张音标词卡、四张国籍卡和十五幅复数物品图；Written A 六题、B 十二组材料与单页练习纸。覆盖正常反馈音、阻断全部声音后全程通关、两种路径隔离、旧记录内容升版、末题不代答、四种宽度和短屏、实际证书 PNG 与打印。`unit15-16-scene.spec.js` 检查护照递交、两对不同箱子的出现及归属顺序、手机对白与人物分区、桌面短屏同屏操作，以及错误和未提交不产生结果；`unit15-16-exam.spec.js` 按独立题稿作答十一题；`unit15-16-upgrade.spec.js` 从冻结的旧页面真实学习，检查有效两题承接、新九题空白、草稿不代答、旧姓名／日期保留及缓存断网续学。`browser-unit1516` 随源码、插图、冻结样例和流程辅助变化加入检查计划。页面截图需核对物品数量和颜色，教师与儿童验收单列。

本课账号入口运行 `npx playwright test -c playwright.login.config.js tests/login/unit15-16-upgrade.spec.js tests/login/course-integration.spec.js --grep '15–16'`：临时新账号无配音通关、旧服务器升级后换设备，补题前 12 星、补齐后 15 星，保留原证书日期和名字；不访问线上学生。实际结果见[本轮证据](../docs/butcher-version/evidence/2026-09-27-0013-unit15-16-review/README.md)。

Lesson 17–18 使用 `npx playwright test tests/e2e/unit17-18`：独立教材题稿对应 22 题、16 句原文、30 张音标词卡、15 组职业图、Written A 六题与 B 十组；检查无配音完整通关、正常反馈音、错答不泄题、末题刷新、四种宽度、打印导出、保存与隔离。`browser-unit1718` 随新单元、素材、流程辅助变化加入计划。内容审查须区分 not very busy 与 lazy，代词有课文身份依据，复数规则不过度推广。

Lesson 19–20 使用 `npx playwright test tests/e2e/unit19-20`：独立题稿对应 28 题、13 段完整对白、34 张音标词卡、20 幅对比图、Written A 六题与 B 十组。验证合说人物、两个相同词块独立选取、原题重试、末三题刷新、全音频阻断通关、反馈音、四种宽度、保存与内容更新、两种路径隔离和实际 PNG／A4 导出。`browser-unit1920` 随本单元、素材和流程辅助变化加入检查计划。目视审查成对插图尺度、轻重证据与同词不同语境；不把否定扩大为未说的相反状态。

Lesson 21–22 使用 `npx playwright test tests/e2e/unit21-22`：现行 30 个评分任务（含两组三对配对、两道原文定位、两道双条件交接）、8 段原文、36 张音标词卡、16 幅物品图、Written A 六题与 B 八组。验证全部声音失败仍通关、反馈音、连续错答不泄题、末三题刷新、重复 one? 词块独立撤回、四种宽度与短屏、保存和内容更新、根路径与 `/lesson/` 隔离、PNG 和 A4 实际导出。`browser-unit2122` 随本单元、素材和流程辅助变化进入计划。目视核对空满、大小与刀刃图；内容核对 one 的语境、接收者与所属、your 的说话人数及信息不足时再确认。

Lesson 23–24 使用 `npx playwright test tests/e2e/unit23-24`：现行 30 个评分任务（含两组三对配对、两道原文定位、两道双条件交接）、8 段原文、30 张音标词卡、十幅房间位置图、Written A 六题与 B 十组。验证全部声音失败仍通关、反馈音、连续错答不泄题、末三题刷新、图片选项的同等文字描述和显示尺度、词块撤回、四种宽度与短屏、保存与内容更新、两种路径隔离、实际证书 PNG 与 A4 导出。`browser-unit2324` 随本单元、素材与流程辅助变化进入计划。目视核对 on 的实际接触、近远参照与图中位置；不把 some 固定为两件，也不把 ones 固定为杯子。教师内容验收和儿童试用单列。

Lesson 25–26 当前检查用上方两课专项及 `npx playwright test tests/e2e/unit25-26`：独立教材题稿的 27 题、12 句叙述原文、36 张音标词卡、8 组位置与状态图、Written A 四题八空和 B 七组双句。验证无配音完整通关、重试不泄题、刷新末题、原文逐句完成、长词拼句、图选的同等文字描述、声音全失败、星星与保存隔离、证书真实 PNG 与一张 A4 练习纸。`browser-unit2526` 随新单元、素材和流程辅助变化加入计划。位置图须目视核对内部、表面接触、物品状态；冠词不能简化为字母判断或计出现次数。教师与儿童验收另行记录。若本机设置了代理，运行前为 `127.0.0.1,localhost` 配置 `NO_PROXY`，避免本地验收请求绕行代理。

Lesson 27–28 使用 `npx playwright test tests/e2e/unit27-28`：独立教材题稿的 19 题、13 句叙述原文、30 张音标词卡、10 组位置图、Written A 五题与 B 十组五句问答。覆盖全部声音失败仍通关、正常反馈音、原题重试不泄题、末题刷新、长词块完整显示与撤回、提示和修正分别记录、四种宽度、保存隔离、证书真实 PNG 与单页 A4。打印页保留 A 五题与 B 十组提示，B 任选一组书写五句；目视核对充足的整行空间。`browser-unit2728` 随单元、素材与流程辅助变化进入计划。内容审查特别核对 trousers 复数形式、some/any 使用范围及书面练习与原文场景的区别。教师内容验收与儿童试用单列。

Lesson 29–30 使用 `npx playwright test tests/e2e/unit29-30`：独立教材题稿的 23 题、9 句双人原文、30 张音标卡、35 个编号图项（含成对动作共 50 句）、Written A 三题与 B 完整词库和十一句书写。验证无配音全程、全部声音失败、正常反馈音、重试不泄题、刷新不代答、重复词块、四种宽度、记录隔离、真实 PNG 和单页 A4。`browser-unit2930` 随单元、素材和流程辅助变化进入计划。逐图核对动作对象，尤其可开启桌盖的 desk；核对 air / dust / empty 的本课词性、read 原形音标和自由搭配不设唯一答案。教师验收与儿童试用另行记录。


两个单元交付时同时运行 `npx playwright test tests/e2e/unit9-10 tests/e2e/unit11-12 tests/e2e/units9-12-classroom.spec.js`：增加完整原文、语境词义与图片题、正误反馈音、全部声音失败仍可领证、旧录音中断续读、旧 15 星迁移为 9 星后完成新题、稳定按钮与长选项检查。旧记录从两份 `tests/fixtures/unit*-voiced-before/` 历史页面实际产生，57／55 段旧音频的原测试保留在其中，不再要求现行页面播放。`browser-units9-12` 已加入相关源码、样例与流程辅助变化时的检查计划。首页、继续学习、重开和 `/lesson/` 隔离继续检查，导航变化回归前述三个文件；教师与儿童验收另记。

重复题整改用 `npx playwright test tests/e2e/unit-dedup.spec.js`：覆盖三单元新题、基础拼句到完整接力的顺序、综合挑战、分拣错题原题重试，以及真实旧题稿升级后不代答、未改活动保留。历史题稿放在 `tests/fixtures/unit-dedup-before/`，只用于隔离的浏览器升级检查；课件从当前内容加载。完整流程当前分别验证 28、27、73 题，并回归 `l49-v110.spec.js`、`l49-v110-defenses.spec.js`，确保 Lesson 49 单课的十二题、原题重试和旧回练记录衔接不被组合单元修改。题目必要性仍需按统一标准人工审稿，不能靠程序数题代替。

其中 `unit1-2-navigation.spec.js` 检查新学习先图鉴、旧章节地址与独立继续；`unit1-2-vocabulary-standard.spec.js` 逐卡检查 21 条按词典核对的音标、翻面与窄屏，`unit1-2.spec.js` 验证听辨后进入课文、理解和后续练习以及证书徽章顺序。词典标注检查不等于人工发音听审。

修改封面继续、章节定位或路由时，另运行 `npx playwright test tests/e2e/unit-resume-scroll.spec.js`：覆盖两单元在根路径和 `/lesson/` 的桌面、手机、手动滚回封面、连续继续、键盘、浏览器返回和未提交选择恢复，并对照 Lesson 49。必须检查目标标题进入可视区域，不能仅以地址正确判断跳转成功。

两单元的主题或容器修改，另运行 `npx playwright test tests/e2e/unit-themes.spec.js`：检查冷暖区分、选项平等、文字对比、旧作答恢复，以及 320 / 1100 像素下的人物位置、对白和翻页操作。保存图片的主题还由两单元证书流程与页面配色交叉核对。运行通过后，仍需对照设计稿目视检查真实页面和下载图片。

组合单元的领奖、长名字、手机布局、真实图片下载、图片失败重试与 A4 单页打印用 `unit49-50-certificate.spec.js`，和 `unit49-50.spec.js` 一起运行。准备记录来自完整页面作答，不伪造通关状态。

`/lesson/` 发布路径用 `lesson-deployment.spec.js`：检查导航与资源路径、原课程进度隔离、完整单元、证书、旧官网缓存下的录音，以及手机布局。

题目进度检查用 `l49-v115-progress.spec.js`：覆盖 Lesson 49 和合并单元的答对即时填绿、末题、错答、回练、重练、刷新、暂停和 320 像素窄屏。去重改变题量或分段时也必须运行：单课仍为十二题分拣、十题分段挑战；组合单元是十一题分拣、五题连续挑战，不能共用旧题量。分拣现按原题重试检查，错答和重试不填绿，真正改对后只补一格，末题和刷新同样适用。它也会随 `test:l49:behavior` 执行。

## 怎样判断完成

### 发音素材排查

发音要求统一看[设计标准第 7 节](../docs/butcher-version/publish/2026-10-14-0013-v1.49-教学单元设计标准与验收清单.md#7-声音加载与访问)。素材排查是只读诊断，不替代课程的页面行为测试或人工听审，也不自动改录音、提交或发布。

在项目根目录清点当前课程文件：

```bash
mkdir -p tmp/audio-audit
node scripts/media/course-audio-inventory.cjs > tmp/audio-audit/inventory.json
```

初筛另需 FFmpeg、Python 的 `numpy` 与 `faster-whisper`，以及本地已有的模型缓存；脚本不下载模型。本次使用 `faster-whisper 1.2.1`、`ctranslate2 4.8.2`、`numpy 2.5.3`。配置好相应 Python 环境后运行：

```bash
python scripts/media/audit-course-audio.py tmp/audio-audit/inventory.json \
  --output tmp/audio-audit --model base.en --model-cache <已有模型缓存目录>
```

生成的 JSONL 按文件指纹、模型名与参数缓存。复用前仍核对当前文件；更新模型内容时使用新的输出目录，避免把同名不同版本视为同一模型。要复核指定文件，可再加 `--model tiny.en --only-paths <文件路径数组.json>`。期望文字不会作为识别提示；转写不同只进入待复核队列，不能自动判错。

旧课程动态标签可以通过真实浏览器观察后传给清点工具的 `--dom-bindings <观察记录.json>`；本轮记录与全量清单见[2026-09-21 发音排查](../docs/butcher-version/2026-09-21-2143-v1.0-全课程发音排查.md)。只从文件名推断的条目必须继续补查文字真源。页内音频验证继续走各单元的实际控件，确认新文件和两种访问路径；人工结论记录审核人、日期和文件指纹。

### 发音修复防回退

五处发音修复与 I 词卡现行行为的相关页面检查：

```bash
npx playwright test tests/e2e/pronunciation-repairs.spec.js tests/e2e/unit7-8-audio.spec.js \
  --grep '修订录音|loose|新录音|只更换录音|I 词卡' --reporter=line
```

五处修复覆盖真实控件收到的文件与指纹、原速原生结束、重听、刷新、失败重试、根路径与 `/lesson/`。A01、A02 的 Lesson 5–6 与 A03 的 Lesson 11–12 已改为无配音，相关录音检查通过冻结的历史配音页验证，标题明确标为“历史”；现行页面停用录音的行为另由课堂配套检查覆盖。I 词卡同样检查英语配音保持停用。旧进度验证先在旧页面实际学习，再升级，不直接写入本地记录。`browser-pronunciation` 已加入相关课程、播放器、生成工具和原问题样例变化时的检查计划；手动运行上面的命令也可复验。

修订预期保存在 `tests/fixtures/pronunciation-repairs.json`，原问题样例放在 `tests/fixtures/pronunciation-before/`，不从待测课程清单生成预期。更换录音必须复核读音、留存新证据，再更新预期，不能只为通过指纹检查而改值。

生成配方位于 `scripts/media/lexemes/`。配置清单所记录的 Kokoro／Misaki／FFmpeg 环境后，可用 `python scripts/media/render-lexeme.py <配方.json> --output <新候选.mp3>` 复现；例外必须命中完整词及指定次数，实际音素与目标边界不符时停止。工具只生成待听审候选，不覆盖现用文件，也不自动取得人工通过。实际环境与拒绝诊断见[本次修复记录](../docs/butcher-version/2026-09-22-0018-v1.0-五处发音问题修复与验收.md)。

### 交付状态

共用拼句区域调整后，需运行 `tests/e2e/unit23-24-layout.spec.js` 中的“四种宽度全部拼句”检查。它同时覆盖正常字体和字体文件不可用：三个词块也可能换行，选取与撤回不能裁切词块或推动检查按钮。其他课程的正常布局检查继续保留，不能只凭字体加载成功时的截图验收。

命令结束且没有失败项，只说明对应自动检查通过。还需在真实页面检查题目意思、反馈、重听、重练、刷新恢复和小屏布局；真机结果填入[真机检查表](../docs/mobile-release-smoke-checklist.md)。

发布后用同一发布包运行 `npm run verify:live`，确认线上文件一致，详见[发布指南](../deploy/README.md)。

旧数据规则：Lesson 49、50 保留并限制有效星级；音标旧版只存总分，无法还原各关成绩，首次迁移到 v2 时归零。任何迁移都不能伪造新题的作答记录。

### 整课缓存下的旧页面检查

`/lesson/` 的 HTML 到达后仍可能在准备资源，跨课续学检查须等实际活动可见再离开，不能把文档响应成功当作学习页面已进入。关闭脚本时使用文字导航；课程入口应明确说明如何恢复，不能无限停在加载页。

资源地址可能是原路径、带校验值的固定路径或浏览器会话中的 `blob:` 地址。路径隔离只统计实际 HTTP 请求；无配音检查用 `tests/support/course-resource-urls.js` 区分三个已知反馈音与英语录音，不能因为路径改变把反馈音判成配音。修改该辅助文件时须复查引用它的页面检查。

原生播放是否结束与是否发起网络请求是两件事。复听已缓存录音可以没有新请求，应观察真实播放器结束，并核对其实际地址返回文件的独立校验值。模拟“未缓存录音网络失败”的检查使用无 Worker 的真实浏览器回退路径；有缓存时网络断开仍能播放，则由缓存专项检查覆盖。不能以删除失败断言代替这两种场景。

Lesson 1–6 的综合挑战按[覆盖表](../docs/butcher-version/2026-09-26-1655-v1.0-Lesson1-6综合挑战与验收.md)分别扩充为 8／9／10 题，整课 28／27／30 题。专项用 `COURSE_TEST_PORT=4192 npx playwright test tests/e2e/unit1-2-exam.spec.js tests/e2e/unit3-4-exam.spec.js tests/e2e/unit5-6-exam.spec.js tests/e2e/units1-6-exam-layout.spec.js tests/e2e/units1-6-exam-upgrade.spec.js`；覆盖末题刷新、错答／线索记录、四种宽度的长词块与操作稳定、缓存断网和真实旧页面升级。前置活动不变，仍连同各单元完整页面检查与 `unit-dedup.spec.js` 验证。

旧短挑战页面在 `tests/fixtures/unit{1-2,3-4,5-6}-short-exam-before/`，只用于验收，不发布。账号升级用 `npx playwright test -c playwright.login.config.js tests/login/units1-6-exam-upgrade.spec.js`，在临时旧服务器真实完成课程，重启为新版本后用新浏览器登录；必须先显示 12 星、旧题有效、新题空白，再补题同步 15 星及姓名／原证书日期。全部测试账号虚构，不改真实学生数据。

## Lesson 17–30 七单元场景与综合挑战

[内容与题稿记录](../docs/butcher-version/2026-09-27-0059-v2.0-Lesson17-30场景与综合练习优化.md)依据同一教材审视七课综合目标；[舞台整改与逐课视觉记录 v2.1](../docs/butcher-version/2026-09-27-1202-v2.1-Lesson17-30逐课舞台整改与验收.md)记录舞台；[人物身份与情境姿态 v2.2](../docs/butcher-version/2026-09-27-1346-v2.2-Lesson19-28人物身份与情境姿态优化.md)补充跨课人物取舍与并排验收。所有运行检查通过页面操作，答案预期来自独立审过的题稿。

- `npx playwright test tests/e2e/unit17-18 tests/e2e/unit19-20 tests/e2e/unit21-22 tests/e2e/unit23-24 tests/e2e/unit25-26 tests/e2e/unit27-28 tests/e2e/unit29-30 tests/e2e/units17-30`：完整教材/词卡/图册/配套写作、全声音失败、七套综合题、四种宽度、分镜与道具交接、按钮稳定、错误不泄题、断网复访与旧页面升级。
- `npx playwright test -c playwright.login.config.js tests/login/units17-30-upgrade.spec.js`：七个真实旧服务器分别产生两题旧完成记录，升级后在新设备保留12星；独立补完后同步15星、名字和原证书日期。测试用4199及临时虚构账户，不读写线上学生数据。
- 图册变为分页后，旧的“同时存在全部图卡”断言改为逐页核对全部内容，不能用分页为由减少教材覆盖。`tests/fixtures/unit*-classroom-before` 是当前批次冻结的旧内容/行为样例，原素材从现行仓库提供，不用于历史视觉还原。
- `core/classroom-scene.*` 只由这七个单元显式加载；共享的场景绘制不改变成绩，只有既有题目控制器能判分。该模块、七课内容/素材、冻结样例和独立题稿变化时，检查计划加入 `browser-units17-30-review`。
- `tests/e2e/units17-30-theatre.spec.js`：七课分别在 320、390、768、1280 宽度逐句推进，检查中文展开、历史恢复、人物与对白分层、操作位置稳定及完成后的操作；保存转折、末句与结束画面。19/21/23 额外保存坐下、拿起、否认与接收时刻。截图必须逐课目视复核，并将相邻易混人物的词卡／纪念图并排对照；尺寸断言通过不能单独判定画面合格。
- 场景重绘入口是 `python3 scripts/art/redraw-classroom-stages.py 17-18`（一次明确指定一个单元）。图形源、手机构图及道具时序一起维护；不能仅改生成文件或用通用人物模板重新覆盖整批。
- 当前验收数字、截图与实际未验范围以方案文档末尾为准；真实手机/教师/儿童与上线验收单列。

Lesson 21–22 新题型专项：`npx playwright test tests/e2e/unit21-22-tasks.spec.js tests/e2e/unit21-22-tasks-upgrade.spec.js`；真实旧 34 题页面升级与原题记录衔接，错答／重试／未提交草稿／暂停／单物品交接、四种宽度和图片证据。登录换设备升级另用 `npx playwright test -c playwright.login.config.js tests/login/unit21-22-tasks-upgrade.spec.js`，通过临时班级与真实页面完成记录验证，不注入学习成绩。

## Lesson 31–32 与账号横幅

`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit31-32.spec.js tests/e2e/butcher-navigation.spec.js`：无配音完整通关、逐题错误／修正／续做、原文、音标图鉴、动作画册、手机、缓存与证书。题稿见[本地设计与验收](../docs/butcher-version/2026-09-28-2212-v1.0-Lesson31-32设计与验收.md)。

`npx playwright test -c playwright.login.config.js tests/login/course-banners.spec.js tests/login/access.spec.js tests/login/root-mount.spec.js`：真实登录后的单列横幅、图片失败与重试、当前20课开课选择、新课默认关闭、成果同步和根目录权限。本地临时账号与生产学生数据分开。共享导航样式更新须同时检查静态首页与登录首页，不能以其中一个替代另一个。


## Lesson 33–34 河畔发现

`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit33-34.spec.js`：独立教材题稿验证33道任务、10句原文、22张音标词卡、12组动作与A5/B12；13题挑战逐题答错、原题修正、部分选择、撤回词块、暂停刷新、末题确认、正常反馈音／全声音失败、四种宽度、场景点击、缓存与真实PNG/A4。答案只从审定题稿转录，不能读取程序答案对象。

`npx playwright test -c playwright.login.config.js tests/login/unit33-34.spec.js tests/login/course-banners.spec.js tests/login/access.spec.js`：当前二十个课程开课选项、33–34默认关闭、跨班直链拒绝、登录完整通关与跨设备同步、根目录与子目录。33–34根目录用例另占4234端口，仅使用临时虚构账号。导航及资源登记修改时回归31–32。详见[教材覆盖、实际验证与未完成项](../docs/butcher-version/2026-09-29-1004-v1.0-Lesson33-34设计与验收.md)。


## Lesson 35–36 村庄相册

`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit35-36.spec.js`：独立教材题稿验证35道任务、15句叙述、16张音标词卡、12组位置路线、A3/B12；16题综合挑战逐题答错重试、暂存刷新、撤回词块和末题确认；三张照片、方向对照图、四种宽度、声音失败全通关、反馈音、缓存首次准备／离线复访／单张缺图恢复，以及真实PNG／A4。预期只从教材与独立设计题稿转录。

`npx playwright test -c playwright.login.config.js tests/login/unit35-36.spec.js tests/login/course-banners.spec.js tests/login/access.spec.js`：二十个可选单元，新课默认关闭；授权学生通关与跨设备同步，跨班直链拒绝，根目录／子目录。35–36根目录用例使用4238端口，仅创建临时虚构账号。详见[设计、教材依据与验收](../docs/butcher-version/2026-09-29-1344-v1.0-Lesson35-36设计与验收.md)。

证书共用导出改动追加 `tests/e2e/unit49-50-certificate.spec.js` 与 `tests/e2e/unit35-36.spec.js` 的证书相关场景，已登记 `browser-certificates`。用真实页面通关检查普通图片地址与缓存降级后的内存图片地址；导出人物和徽章不依赖资源文件名。35–36的降级用例先复现“图片暂时没有生成”，修复后实际下载PNG并目视检查，不用模拟发出下载事件替代。


## Lesson 37–38 书架制作小工坊

`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit37-38.spec.js`：独立教材题稿验证33道任务、18句原文、11张音标词卡、六组12句计划／正在对照、A4/B5；16题挑战逐题错答后原题修正、未选禁用、末题确认、暂存刷新及词块撤回。覆盖两把锤子的初始／拿起／否认／确认／交接，以及粉色只作计划色样；四种宽度与1280×720短屏、全声音失败通关／零英语语音与正常反馈音、键盘、缓存首访／离线／缺图重试／会话降级、实际证书PNG和A4及三页练习纸。答案从独立题稿转录，不从程序答案对象生成。

`npx playwright test -c playwright.login.config.js tests/login/unit37-38.spec.js tests/login/course-banners.spec.js tests/login/access.spec.js`：二十个可选单元，新课默认关闭；本课授权学生通关、成果跨设备同步、跨班直链拒绝、根目录／子目录及旧入口下架。37–38根目录用例另用4243端口，仅使用临时虚构账号。参见[设计与实际验证](../docs/butcher-version/2026-09-29-1507-v1.0-Lesson37-38设计与验收.md)。


## Lesson 39–40 无配音课堂配套版

依据[设计与验收](../docs/butcher-version/2026-10-01-0036-v1.0-Lesson39-40设计与验收.md)。`COURSE_TEST_PORT=4246 npx playwright test tests/e2e/unit39-40.spec.js` 覆盖33题、13句、9张音标词卡、12幅画册，花瓶每句只有一份且按交接／安放时机显示；包括全声音失败通关、真实正误与完成音、16题错答修正、词块撤回、两空未齐、四宽与短屏、逐帧词卡无闪、缓存离线与缺图重试、PNG与单页A4实物、相邻课记录隔离。期望由教材和独立题稿转录，截图需目视复核。

账号：`npx playwright test -c playwright.login.config.js tests/login/unit39-40.spec.js tests/login/course-banners.spec.js tests/login/access.spec.js`。仅临时虚构账号；验证新增课默认关闭、管理员预览、实际学生完整通关同步与另一设备恢复、跨班直链、根目录和内部前缀，生产旧 `/lesson/` 不恢复。根目录专项占用4248，先确认空闲。完整线上发布、真机微信、教师和儿童验收另列。

## Lesson 63–64：禁令与时长

独立题稿在 `tests/support/unit6364.js`，不读取运行时答案：`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit63-64.spec.js tests/e2e/unit63-64-story-layout.spec.js` 覆盖57题、22张音标词卡、12轮完整对白、四宽与短屏、连续错答／刷新／撤回／线索、场景检查后挂牌、三卡及无英语音频。场景另用 `--browser=webkit` 复查。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit63-64.spec.js`；用 `/lesson/` 复查子路径、`UNIT63_BROWSER=webkit` 复查移动WebKit。真实作答发五颗星，检查身份／班级隔离、悬浮卡与普通结算不抢播、纪念册、同名同星基准、60帧GIF、跨设备日期与离线重进、独立场景缺图拦截及复访缓存。详见[设计与实际结果](../docs/butcher-version/2026-10-13-1709-v1.0-Lesson63-64设计与验收.md)。

## Lesson 65–66：反身词与时间约定

`tests/support/unit6566.js`保存独立答案，不读取课程答案字段。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit65-66.spec.js tests/e2e/unit65-66-story-layout.spec.js` 检查69题、30词卡、13轮完整课文、连续错答与刷新、配对撤回、两空及词块门槛、检查后交钥匙、五区三卡、四宽和短屏。小剧场另加`--browser=webkit`。

`LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit65-66.spec.js`检查完整账号、跨设备五星日期、真实纪念册／60帧GIF、同姓名同星数样板对照、班级隔离、独立资源故障和复访；`AWARD_TEST_BASE=/lesson/`与`UNIT65_BROWSER=webkit`分别覆盖子路径和移动WebKit。生产旧/lesson/仍下线。实际证据及未完成边界见[本单元记录](../docs/butcher-version/2026-10-13-1822-v1.0-Lesson65-66设计与验收.md)。

## Lesson 67–68：过去的地点、状态与日记

`tests/support/unit6768.js`保存独立答案，依据教材纸页134–137、同步导学Grammar纸页122。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit67-68.spec.js tests/e2e/unit67-68-story-layout.spec.js`覆盖62题、30词卡、8轮原文、连续错答／续做／撤回、正确检查后盖章、四宽短屏、五区五星与三卡。小剧场另用`--browser=webkit`。

`LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit67-68.spec.js`检查完整账号、实际五星同步、纪念册和60帧GIF、认可卡对照、权限隔离、独立街景丢失的拦截恢复与素材复访。`AWARD_TEST_BASE=/lesson/`和`UNIT67_BROWSER=webkit`覆盖子路径及移动WebKit。真实结果与待验边界见[单元记录](../docs/butcher-version/2026-10-13-1927-v1.0-Lesson67-68设计与验收.md)。

## Lesson 69–70：赛车相册、时间介词与日期

`tests/support/unit6970.js`保存依据教材138–141、导学Grammar125独立编写的答案；`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit69-70.spec.js tests/e2e/unit69-70-story-layout.spec.js`覆盖72题、42词卡、5段全文、连续错答与订正、撤回与刷新、正确检查后盖章、四宽短屏、五区五星。小剧场另用`--browser=webkit`。

`LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit69-70.spec.js`覆盖账号授权、五颗星同步、卡册与GIF、认可卡对照、独立赛场缺图拦截恢复与快速复访；另以`AWARD_TEST_BASE=/lesson/`、`UNIT69_BROWSER=webkit`核对子路径与移动WebKit。实测结果及未验边界只维护在[单元记录](../docs/butcher-version/2026-10-13-2003-v1.0-Lesson69-70设计与验收.md)。

### Lesson 71–72 新单元页面验收

独立答案与原文分别位于 `tests/support/unit7172.js`、`tests/e2e/unit71-72-story-layout.spec.js`。`unit71-72.spec.js` 覆盖68题、34张词卡、过去式对比、配对／两空／词块、重复错答与统计、参考材料及四宽短屏；故事用例逐句核对12句原文、真正说话人与完整人物。登录用例覆盖新课授权、五区同步、纪念册、真实GIF、长姓名与账号隔离、独立缺图恢复与缓存复访。`UNIT71_BROWSER=webkit` 可切换本课页面／账号用例的引擎；根目录和 `/lesson/` 测试子路径分别运行，不代表线上仍有该旧路径。执行结果与证据仅记入单元验收文档。

### Lesson 79–80：购物清单与must／need

独立题稿位于 `tests/support/unit7980.js`；真实页面用 `COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit79-80.spec.js tests/e2e/unit79-80-story-layout.spec.js` 检查62题、36张词卡、13轮原文、六类商店26种物品及A5/B7参考。覆盖mustn’t／needn’t区别、需要物品／需要做事、零库存与数量不足、连续错答与刷新、未提交不更新清单、四宽和短屏、三卡与五区五星。`UNIT79_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit79-80.spec.js`；`AWARD_TEST_BASE=/lesson/`为内部子路径验收，生产旧入口不恢复。真实作答验证跨设备同步、权限、纪念册、同名同星样板对照、60帧GIF、长姓名、缺图拦截与缓存复访；移动WebKit使用同一`UNIT79_BROWSER`开关。实际结果与未验边界记入[本单元设计与验收](../docs/butcher-version/2026-10-14-0954-v1.0-Lesson79-80设计与验收.md)。

### Lesson 81–82：晚餐故事与have表示活动

独立答案与18轮原文位于 `tests/support/unit8182.js`、`tests/e2e/unit81-82-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit81-82.spec.js tests/e2e/unit81-82-story-layout.spec.js` 覆盖66题、30张词卡、82课12项活动和A6/B12参考，包含have活动义、各时态问答、未发生的安排、错误重试与续做、两空／配对／词块、五区三卡及四宽短屏。逐场核对Tom从楼上回应时不提前出现在楼下、真实说话人及人物完整；`UNIT81_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit81-82.spec.js`，并分别以`AWARD_TEST_BASE=/lesson/`和`UNIT81_BROWSER=webkit`核对内部子路径、移动WebKit。包括班级授权、真实66题获星与同步、纪念册、同名同星样板对照、实际1／5星GIF解码、长姓名、缺图拦截恢复、复访素材复用及离线重连保留作答。引擎限制与实际结果仅记入[单元验收](../docs/butcher-version/2026-10-14-1035-v1.0-Lesson81-82设计与验收.md)；本地测试不代表生产部署或手机微信验收。

### Lesson 83–84：行李箱故事与现在完成时

独立答案与12轮原文位于 `tests/support/unit8384.js`、`tests/e2e/unit83-84-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit83-84.spec.js tests/e2e/unit83-84-story-layout.spec.js` 覆盖73题、36张词卡、84课20项数字材料和A7/B10参考；检查两种完成时含义、助动词与过去分词、肯否问答、副词与some／one、错误重试／续做、未提交不更新行前记录、四宽短屏和五区三卡。`UNIT83_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit83-84.spec.js`，分别以内部`AWARD_TEST_BASE=/lesson/`和`UNIT83_BROWSER=webkit`检查子路径及移动WebKit，包括授权、真实获星同步、纪念册、同名同星认可卡对照、1／5星60帧GIF、长姓名、缺图拦截／恢复、快速复访和离线重连续做。实际结果与未验边界记入[单元验收](../docs/butcher-version/2026-10-14-1111-v1.0-Lesson83-84设计与验收.md)，不代表部署或微信真机验收。

### Lesson 85–86：电影院外的旅行经历

独立答案与13轮原文位于 `tests/support/unit8586.js`、`tests/e2e/unit85-86-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit85-86.spec.js tests/e2e/unit85-86-story-layout.spec.js` 覆盖65题、30词卡、86课15动作／序数和A7/B12；检查三种去向、过去时间与不规则分词、错答续做、场景检查正确后更新、四宽短屏和五区三卡。`UNIT85_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit85-86.spec.js`，再用 `AWARD_TEST_BASE=/lesson/` 和 `UNIT85_BROWSER=webkit` 验两种挂载及移动WebKit。覆盖权限、真实获星、纪念册、1／5星实际GIF、同名同星认可卡对照、长姓名、缺图恢复和复访续做；结果及真机边界记入[单元验收](../docs/butcher-version/2026-10-14-1159-v1.0-Lesson85-86设计与验收.md)。

### Lesson 87–88：修理厂里的进度单

独立答案与13轮原文位于 `tests/support/unit8788.js`、`tests/e2e/unit87-88-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit87-88.spec.js tests/e2e/unit87-88-story-layout.spec.js` 检查66题、26词卡、4组问答／12组动词与A6／B10原题；完成与过去时间、持续／已结束对比、开始不等于完成、错答续做、四宽短屏与车库转场。`UNIT87_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit87-88.spec.js`，再用`AWARD_TEST_BASE=/lesson/`及`UNIT87_BROWSER=webkit`验两种挂载与移动WebKit。包含五区获星、卡册、真实1／5星GIF、长姓名、隔离与缺图复访；实际结果和未验边界写入[单元验收](../docs/butcher-version/2026-10-14-1241-v1.0-Lesson87-88设计与验收.md)，用例存在不代表通过。

### Lesson 89–90：看房时的时间线索

独立答案与16轮原文位于 `tests/support/unit8990.js`、`tests/e2e/unit89-90-story-layout.spec.js`。`COURSE_TEST_PORT=空闲端口 npx playwright test tests/e2e/unit89-90.spec.js tests/e2e/unit89-90-story-layout.spec.js` 检查65题、24词卡、4组问答／15组动词与A6／B6原题；for／since、持续证据、同形异音、错答续做、四宽短屏与门前／客厅转场。`UNIT89_BROWSER=webkit`复查另一引擎。

账号用 `LOGIN_TEST_PORT=空闲端口 AWARD_TEST_BASE=/ npx playwright test -c playwright.login.config.js tests/login/unit89-90.spec.js`，再用`AWARD_TEST_BASE=/lesson/`及`UNIT89_BROWSER=webkit`验两种挂载与移动WebKit。包含五区获星、卡册、真实1／5星GIF、长姓名、身份隔离与缺图复访；实际结果和未验边界写入[单元验收](../docs/butcher-version/2026-10-14-1310-v1.0-Lesson89-90设计与验收.md)，用例存在不代表通过。
