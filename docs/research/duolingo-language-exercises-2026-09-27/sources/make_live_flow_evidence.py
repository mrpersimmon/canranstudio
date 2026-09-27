"""Index unmodified, visually checked screenshots from the authorized live session."""
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import hashlib
import json
import shutil
from PIL import Image

ROOT=Path(__file__).resolve().parent.parent
CAPTURE=ROOT.parents[2]/'output/playwright/duolingo-chinese-flow'
DEST=ROOT/'assets/flows'
DEST.mkdir(exist_ok=True)

# Capture number, actual action, observed result. Filenames are not treated as facts.
ROWS='''
10|进入“哪个是茶”|三张图卡尚未选中；检查为灰色，红心为5。
11|点击 coffee|coffee 变蓝；检查变绿；尚未判定正确与否。
12|改点 tea|tea 变蓝，coffee 恢复；维持单选。
13|再次点击已选 tea|tea 仍选中；重复点击未回到空答案。
14|改点 sugar，准备提交|sugar 变蓝；这是错误草稿，还没有判错。
15|点击检查|红心5变4；首次错误说明弹层遮住题目，底部已出现红色答案反馈。
16|关闭红心说明中的继续|显示“正确答案：tea”；选项已锁定，底部红色继续。
17|点击错误反馈的继续|进入下一道文字选词题“茶”；不是在原看图题内编辑。
20|文字选词题中点击 coffee|coffee 变蓝；检查可用。
21|改选 tea|选中状态从 coffee 转移到 tea。
22|改选 hot，准备提交|hot 为当前蓝色选项；尚未判错。
23|点击检查|显示正确答案 tea，原选项锁定；红心4变3。
24|点击继续|切换到新的看图题“哪个是咖啡”。
30|咖啡看图题点击 coffee|coffee 蓝色选中，检查可用。
31|点击检查|coffee 变绿，底部显示“棒棒哒！”；红心仍为3。
32|点击继续|进入中文“咖啡”的文字选词题；不是词块题。
34|文字选词题点击 coffee|蓝色选中 coffee，尚未提交。
35|点击左上角退出|弹出“现在离开的话，你的进度就没了”；提供继续努力与退出。
36|点击继续努力|返回原题，coffee 的选择仍保留。
37|点击检查|coffee 变绿，显示你太棒了和连对2题。
38|点击继续|进入英译中词块题 welcome；首次提示可悬停查看词义。
40|悬停 welcome|本帧仍显示首次操作引导；不能把它当成词典释义已展开。
41|点击热茶|热茶进入答案区；词库原位变灰；检查启用。
42|点击答案区的热茶|词块撤回；答案清空，检查重新变灰。
43|点击欢迎|欢迎进入答案区，热茶仍可选；尚未提交。
44|撤回欢迎，再点热茶|再次形成错误草稿；实际提交前的答案为热茶。
45|点击检查|红色反馈给出欢迎；词块均锁定；红心3变2。
46|点击继续|进入新的文字选择题“欢迎”；不是在原词块题内重答。
50|进入 Tea, please. 翻译题|词库为谢谢、牛奶、茶；答案为空。
51|悬停 please|实际展开词义提示：谢谢、感谢、多谢。
52|先点击谢谢|只有一个词块也能启用检查；非完整答案仍可提交。
53|再点击茶|形成“谢谢 茶”的未提交草稿；未验证这个词序会被怎样判分。
54|点击答案区的谢谢|前面的词块撤回，茶留在答案区并前移。
55|再次点击词库谢谢|它追加到答案末尾，组成“茶 谢谢”。
56|点击检查|绿色正确反馈出现；全部词块锁定。
57|点击继续|进入新题 I'd like coffee.。
60|进入完成对话 Coffee or tea?|两个选项 Coffee, please. 和 Welcome.；检查禁用。
61|点击 Welcome.|蓝色选中；检查启用；角色空白气泡未直接填入答案。
62|改选 Coffee, please.|蓝色选择转移，尚未判分。
63|改回 Welcome.|保留错误回答作为提交前证据。
64|点击检查|红心2变1；同时显示正确英文 Coffee, please. 与中文“咖啡，谢谢。”。
65|点击继续|进入听力词块题；有普通播放、乌龟慢速、现在不做听力题、使用键盘。
70|点击普通播放|保留点击后的播放控件画面；没有保存音轨，不能证明声音正常或播放持续时间。
71|点击乌龟慢速播放|保留慢速入口点击后的画面；音频速度与声音质量未另行听验。
72|点击词块 please|please 进入答案区，检查启用。
73|点击使用键盘|标题变为键入你听到的内容；首次键盘草稿为空，检查禁用。
74|键入 coffee|输入框出现草稿；检查启用。
75|清空输入框|显示占位文字，检查再次禁用。
76|键入 Tea, please.|形成新的未提交草稿；此时尚无正确判断。
77|切回使用词库|先前的 please 词块草稿恢复；两个输入模式各有草稿。
78|撤回 please|词块答案清空，检查禁用。
79|按顺序点 tea、please|两个词块进入答案区；不代表必须使用全部词块。
80|切回键盘|Tea, please. 文本草稿仍保留。
81|提交 Tea, please.|实际判错，正确答案为 tea；红心归零，弹出本次入门课的免费补心提示。
82|点击免费重新注入|红心恢复为5；仍停在错误反馈页，原文本锁定，显示英文 tea 与中文茶。
83|点击继续|进入新的对话 Tea or coffee?；听写不能原位编辑。
90|进入中英配对|左列茶、欢迎、咖啡、热；右列 hot、coffee、tea、welcome；检查禁用。
91|先点击左列茶|单边蓝色选中，尚未判分。
92|改点同列欢迎|选中项从茶转到欢迎；同列操作不会组成一对。
93|点击不匹配的右列 tea，立即截图|欢迎与tea瞬间变红；红心5变4；无底部整题错误栏。
94|等错误高亮自然结束|两项恢复白色，仍留在本题，可重新选择；检查依旧禁用。
95|重新点欢迎，再点 welcome，立即截图|正确的两项瞬间变绿。
96|等正确高亮自然结束|已配对的欢迎与welcome变浅并禁用；其他项保持可操作。
97|从右列 tea 开始下一对|右列也可先选，显示蓝色选中态。
98|再点左列茶|第二对变浅并锁定。
99|点击咖啡与 coffee|第三对完成，仅热与hot尚未配对。
100|点击热与 hot|全部完成后自动给出绿色反馈与继续；没有按检查。
101|点击继续|进入另一道键入听力题；这是后继题，不是刚才的配对重试。
110|点击现在不做听力题|黄色反馈“听力题已跳过，将在15分钟后恢复”；红心保持4。
111|点击继续|进入文本翻译 coffee，答案为空。
112|点击普通翻译题的跳过|红色区域给出正确答案咖啡；本次红心仍为4。
113|点击继续|进入新的完成对话题。
120|完成中间题目后继续|出现“复习一下之前你不太熟练的部分”过场；不是一道新题。
121|点击复习过场的继续|同一“哪个是茶”与原三个选项重现，带错题重练标签。
122|在重练题中点击 tea|重新选择，未沿用第一次的错误答案。
123|点击检查|同题答对，tea变绿，显示绿色继续。
124|点击继续|原文字题“茶”及 coffee/hot/tea 三个选项重现，带错题重练。
125|点击 tea|重练题的正确选项变蓝，等待提交。
126|点击检查|同题绿色反馈，标记连对3题。
127|点击继续|显示鼓励过场“你的辛勤付出得到了回报！”；本帧不是welcome题。
128|再点击继续|welcome 英译中题重现；词库顺序与首次不同，带错题重练标签。
129|点击欢迎|正确词块进入答案区。
130|点击检查|同题出现绿色正确反馈，连对4题。
131|点击继续|原对话 Coffee or tea? 及两项原选项重现，带错题重练。
132|点击 Coffee, please.|正确回答变蓝，等待提交。
133|点击检查|绿色反馈，同时给中文意思，连对5题。
134|点击继续|之前被普通跳过的 coffee 翻译题重现，带错题重练。
135|点击咖啡|形成重练答案。
136|点击检查|绿色正确反馈，进度条到末尾。
137|点击继续|实际进入单元结算：12经验、74%；这是本次人为测试，不代表真实学习水平。
138|点击回顾本单元|打开成绩单弹层，以红绿小卡分别保留首次与重练记录；这是当前视口，底部可滚动。
139|点击第一次“哪个是茶”的红色记录|显示你的答案sugar、正确答案tea；没有被重练后的正确记录覆盖。
'''

shots={}
for row in ROWS.strip().splitlines():
    number,action,result=row.split('|',2)
    p=next(CAPTURE.glob(f'{int(number):03d}-*.png'))
    dst=DEST/f'{int(number):03d}.png'
    shutil.copy2(p,dst)
    with Image.open(dst) as im: width,height=im.size
    shots[number]=dict(id=f'CN-LIVE-{int(number):03d}',file=dst.relative_to(ROOT).as_posix(),
        action=action,result=result,label=f'{action}；{result}',width=width,height=height,
        source='https://zh-cn.duolingo.com/lesson',url='https://zh-cn.duolingo.com/lesson',
        interface_language='中文',course_direction='中文母语 → 英语',
        provenance='本轮独立浏览器实测原图',capture_date=datetime.fromtimestamp(p.stat().st_mtime,ZoneInfo('Asia/Shanghai')).isoformat(timespec='seconds'),
        full_task_view=number not in ('15','81','120','127','137','138','139'),
        framing='完整桌面视口；保留题干、作答区、进度与反馈；弹层状态单独标明',
        note='2026-09-27 桌面 Chrome，中文→英语访客课程。未重绘或改写原图。具体产品构建版本未公布。',
        sha256=hashlib.sha256(dst.read_bytes()).hexdigest(),original_capture_filename=p.name,
        visual_reviewed=True)

RUNS=[]
def run(id_,types,title,prompt,nums,summary,limitations,loop=False):
    RUNS.append(dict(id=id_,type_ids=types,title=title,prompt=prompt,lesson_run='CN-WEB-20260927-A',
        core_wrong_recovery_correct_loop=loop,all_branches_complete=False,
        summary=summary,limitations=limitations,
        steps=[dict(number=n,shot_id=shots[str(k)]['id'],screenshot=shots[str(k)]['file'],action=shots[str(k)]['action'],actual_result=shots[str(k)]['result']) for n,k in enumerate(nums,1)]))

run('F01',['E21'],'看图选词：同题答错到课末答对','哪个是“茶”呢？',[10,11,12,13,14,15,16,17,120,121,122,123,124],
    '蓝色只表示选择；提交才判分。答错后选项锁定，继续进入下一题；本课后段同题以错题重练重现，答对后再推进。',
    '17与120之间实际完成了其他题，明确作为课内间隔，不伪装成紧接下一步。未穷举所有错误选项、快捷键和外部异常。',True)
run('F02',['E23'],'中文词义选英文：改选、错误与重练','茶 → coffee / hot / tea',[17,20,21,22,23,24,124,125,126,127],
    '没有图片可供直接匹配；需要把中文词义连到英语词形。错误反馈给出tea，之后在课末重练同题。',
    '24到124之间是其他题目。E23是本轮新发现的中文词义选英文，不冒充E02英文定义选择。',True)
run('F03',['E04'],'英译中词块：撤回、清空、答错与重练','welcome → 热茶 / 欢迎',[38,40,41,42,43,44,45,46,128,129,130,131],
    '答案区词块可撤回；清空后检查禁用；提交后锁定。课末重练改变了词库位置，原题正确重答。',
    '首次悬停截图只显示操作引导；真实词义浮层见F04。重练前经过其他题。',True)
run('F04',['E04'],'多词词块：部分答案、查词与改顺序','Tea, please. → 茶 / 谢谢',[50,51,52,53,54,55,56,57],
    '部分答案就能提交。撤回前面的词，再从词库点回，可改变排列顺序。词义提示在题面内出现。',
    '“谢谢 茶”只保存为未提交草稿；没有实测该词序的判分，不能称为已被系统判错。')
run('F05',['E12'],'完成对话：错误意思反馈与同题重练','Coffee or tea? → Coffee, please. / Welcome.',[60,61,62,63,64,65,131,132,133,134],
    '选择符合话轮的回应，系统错误与正确反馈均给中文意思；看见会话角色不等于自由对话生成。',
    '65到131之间经过其他题。字幕材料完整可读，播放为可选辅助；本分支归无必需听说。',True)
run('F06',['E13','E22'],'听力词块与键盘：两份草稿、清空、错误与补心','音频目标由错误反馈确认是 tea',[65,70,71,72,73,74,75,76,77,78,79,80,81,82,83],
    '两种输入方式各保留草稿。提交Tea, please.被判错，正确答案为tea；用满全部候选词块并不等于正确。红心归零时本次入门课提供一次免费补心。',
    '本轮没有保存原音轨，播放按钮点击不证明听验完成。未取得此题答对及同题重练；随后临时跳过听力使本课未重现该听写。不能外推所有账号都有免费补心。')
run('F07',['E01'],'中英配对：瞬时错误、原位重试与全部完成','茶/欢迎/咖啡/热 ↔ tea/welcome/coffee/hot',[90,91,92,93,94,95,96,97,98,99,100,101],
    '第二侧点击立即判定；错配短暂变红且扣心，恢复后可留在本题重试；配对正确后词条禁用，全部完成自动给绿色继续。',
    '已验证左右两侧都能先选；未逐项穷举所有排列、重复点击和退出恢复。错误/正确瞬间与稳定状态是不同原始截图。',True)
run('F08',['E21'],'看图选择的直接正确路径','哪个是“咖啡”呢？',[24,30,31,32],
    '初始、选中、提交成功和实际下一题均已拍到。',
    '这是一道独立的咖啡题，不与茶题拼成同一条连续流程。')
run('F09',['E23'],'保留选择的退出取消路径','咖啡 → welcome / hot / coffee',[32,34,35,36,37,38],
    '退出入口先确认；点继续努力返回后，原选项保留。',
    '只实测取消退出；最终退出并重进的恢复规则尚未验证。')
run('F10',['E22'],'临时不做听力','第二道听写；音频内容未转录',[101,110,111],
    '黄色状态告知听力跳过且15分钟后恢复；本次红心不变，继续转到文字题。',
    '这是另一道题。15分钟是屏幕提示，不代表已经等待并验证自动恢复。')
run('F11',['E04'],'普通跳过与课末重练','coffee → 的 / 咖啡',[111,112,113,134,135,136,137],
    '普通跳过直接展示正确答案，本次不扣心；仍在课末标为错题重练，答对后进入结算。',
    '这是独立的coffee题；本次事实不能概括所有课程的跳过计分规则。')
run('F12',[],'结算与答案回顾','同一节课首次错误和重练分开保留',[137,138,139],
    '结算与回顾是学习记录层，不新增为语言题型；首次sugar错误与之后tea正确记录并存。',
    '这是人为答错和跳过的研究采集。74%不能当作学习成效或正常用户水平；回顾弹层图是当前视口。')

assert {s['shot_id'] for r in RUNS for s in r['steps']}=={s['id'] for s in shots.values()}
data=dict(date='2026-09-27',session='CN-WEB-20260927-A',entry_url='https://zh-cn.duolingo.com/course/en/zh/学习-英语',
    course='中文（简体）→英语，第1阶段第1部分：提供或接受饮料，访客入门单元',
    platform='桌面网页版，Chrome，独立临时访客会话',plan='无登录的免费访客；未开通Super或Max',
    version='产品构建号未从界面取得；日期与页面版本范围如实记录',
    screenshot_count=len(shots),flow_entries_with_live_evidence=['E01','E04','E12','E13','E21','E22','E23'],
    core_loop_type_ids=['E01','E04','E12','E21','E23'],
    exhaustive_branch_type_ids=[],all_types_covered=False,
    audio_verified=False,shots=list(shots.values()),runs=RUNS)
from pronunciation_evidence import extend_evidence
data=extend_evidence(data,ROOT,CAPTURE)
from super_evidence import extend_super
data=extend_super(data,ROOT,CAPTURE)
(ROOT/'live-flow-evidence.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in data.items() if k not in ('shots','runs')},ensure_ascii=False,indent=2))
