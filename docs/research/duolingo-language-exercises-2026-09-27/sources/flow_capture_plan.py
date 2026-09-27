"""Observed transition evidence and explicitly incomplete branch coverage."""
import csv
import html
import json

# These are questions for a future capture, not asserted Duolingo behavior.
COMMON = [
 ('initial','进入题目，暂不作答','完整题面、中文指令、答案区、进度/心形，以及主按钮初始状态。'),
 ('empty','保持空答案，检查提交入口','按钮是否禁用；若可点击，点击后的真实结果。禁用应截图，不强行触发。'),
]
TAIL = [
 ('correct','提交正确答案，或完成自动判分操作','正确反馈、答案是否锁定、主按钮文案，以及进度和资源变化。'),
 ('after-correct','点击正确反馈后的推进入口','截取实际去向：下一题、复习、过场或结算；不能只拍继续按钮。'),
 ('exit','打开退出入口，再取消退出','退出提示、取消后答案是否保留；没有确认框也需记录实际去向。'),
]
ERROR = [
 ('wrong','有意给出错误答案并提交','记录错误发生前的答案及提交后的真实反馈；颜色、文案、正确答案、按钮和心形变化。'),
 ('after-wrong','在错误反馈中尝试编辑，再使用可见推进入口','是否允许原位改答案、是否锁定、点击后去了哪里；未提供的操作应记录为不适用。'),
 ('retry','继续本课，检查原题何时再次出现','保留题干与课程序列；若课末复现，拍到复现并重新作答；没遇到则标未采集。'),
]
PROFILES={
 'choice': [
  ('select','选择一项但暂不提交','选择前后边框、颜色、指示符和主按钮变化。'),
  ('change','换选另一项，再尝试取消当前选择','旧选择是否解除、是否能回到空答案。'),
 ]+ERROR+TAIL,
 'wordbank': [
  ('first-token','选择第一个词块','词块移入答案区的样式、词库占位、按钮状态。'),
  ('more-tokens','继续选词，形成部分答案','顺序、换行、干扰项与剩余词块。'),
  ('undo','移除中间或最后一个已选词，再选回来','返回词库的位置、剩余答案顺序与动画结束状态。'),
  ('clear','撤回所有词块','是否回到初始状态；提交按钮是否重新禁用。'),
  ('reorder','构造错误词序，并在提交前修改','是否只能逐个撤回、能否直接换位置；只记录实际支持的方式。'),
 ]+ERROR+TAIL+[
  ('alternative','检查键盘或可选播放入口（若存在）','切换前后是否保留答案；可选入口不改变本题文字分支分类。'),
 ],
 'typing': [
  ('focus','点击输入框','光标、占位文案、移动端键盘展开后题干与按钮是否可见。'),
  ('partial','输入部分答案','输入框、字数或空位、提交按钮状态。'),
  ('edit','定位中间字符并修改，再清空','光标与选区、删除和清空后的控件状态。'),
  ('spelling','输入拼写/空格/大小写差异并按需提交','分别记录被接受、容错提示或判错；不能从一个例子概括全部容错。'),
 ]+ERROR+TAIL,
 'pairs': [
  ('first-side','点左侧或右侧的一张卡','单边选中态；是否允许两种起始方向。'),
  ('reselect','点同一卡或同列另一卡','取消/换选规则，以及高亮如何改变。'),
  ('wrong-pair','选一个不匹配的另一侧项目','错误刚出现的反馈、反馈稳定后状态；是否扣资源、是否自动解除选择。'),
  ('pair-recovery','错误后再选一对正确项目','哪些项目仍可操作，是否保留上次选择。'),
  ('correct-pair','配对正确，但不完成全部','正确颜色、禁用/消失、后续可选项目。'),
  ('all-pairs','完成所有剩余配对','是否自动判分、是否还有检查按钮、完成反馈与推进入口。'),
  ('after-correct','点击推进入口','实际下一题或结算画面。'),
  ('exit','打开退出入口，再取消退出','已配对状态是否保留。'),
 ],
 'audio-choice': [
  ('play','首次播放音频，再重播','播放中和停止后的按钮状态；声音另行听验，截图不能证明声音正常。'),
  ('rate','操作慢速播放（若存在）','切换控件与播放状态；无入口则标不适用。'),
  ('select','选择答案，再改选','单选/多选规则、要求数量与主按钮是否可用。'),
  ('skip-audio','打开不做听力/跳过入口（若存在）','真实提示、替代题或跳题结果，是否影响本课后续听力。'),
 ]+ERROR+TAIL,
 'speech': [
  ('entry','开始录音','入口、权限提示、录音中反馈；没有授权时在提示处停止。'),
  ('silence','测试未收到声音的结果（获得许可后）','是否有超时、无声音提示和恢复入口；与答错区分。'),
  ('recognized','说出给定或自行组织的英语','录音中、处理等待、识别完成状态；需要音频证据核对识别内容。'),
  ('speech-error','说错或识别不成功后恢复','错误/识别失败文案、重录、转键入或跳过的实际入口。'),
  ('retry','通过提供的入口重试','重录是否覆盖旧答案；再次识别后的结果。'),
 ]+TAIL,
 'writing': [
  ('context','阅读情境与问题，查看提示（若存在）','完整上下文、作答限制和提示开启/关闭状态。'),
  ('compose','输入部分回答，修改后提交','文本编辑、长度要求、发送/检查按钮的变化。'),
  ('off-topic','提交不满足任务的回答（若允许）','是否给语义建议、要求补写、拒收或判错；不强套单选题红绿反馈。'),
  ('revise','根据反馈修改并再次提交（若提供）','反馈与原文如何对应、是否保留旧答案、修改后的结果。'),
  ('complete','完成任务并继续','评价或总结、是否能回看、实际下一页。'),
  ('exit','退出并重进（若可安全恢复）','草稿与对话是否保留、丢弃确认。'),
 ],
 'conversation': [
  ('start','进入通话前说明，再启动','情境、目标、权限、连接中与接通画面。'),
  ('turn','完成一轮听与说','角色发言、用户轮次、字幕/提示、等待识别状态。'),
  ('clarify','请求重复或未能回答时继续','如何澄清、提示或追问；不假定存在固定判错。'),
  ('recover','处理中断或未识别情况','重连/重录/退出的实际入口；真实故障无法安全复现时记录缺口。'),
  ('end','结束通话并查看结果','总结、转录、建议、下一步及回看入口。'),
 ],
 'scene': [
  ('move','点击可走区域，再点不可交互区域','移动/无反应反馈与边界；不能把无语言判分的走动算答对。'),
  ('object','点击物体或标牌','高亮、文字提示、关闭与重开。'),
  ('dialogue','触发角色对话，再返回场景','场景与对话切换、目标是否更新；回应判分另见 A02。'),
  ('exit','退出并返回场景（若提供）','位置、目标与已触发事件是否保留。'),
 ]
}
PROFILE_IDS={
 'pairs':['E01','E19','E20','R02'],
 'wordbank':['E04','E05','E13'],
 'typing':['E06','E07','E22'],
 'speech':['E03','E08','E15','E16'],
 'audio-choice':['E14','E17','E18','R01','R03','R04'],
 'writing':['S03','M01'],
 'conversation':['M02','M03'],
 'scene':['A01'],
 'choice':['E02','E09','E10','E11','E12','E21','E23','S01','S02','A02']
}
SINGLE_STATE={
 'E01':'全部配对后的正确反馈', 'E04':'已放入中文词块、尚未提交',
 'E05':'已组成英语译文的宣传局部', 'E06':'已键入英语、尚未提交',
 'E07':'已补出英语主语、尚未提交', 'E08':'翻译页中的录音入口',
 'E09':'选词正确后的反馈', 'E15':'朗读宣传图中的反馈与录音控件',
 'E20':'一组听音词义已配对，其他组尚未完成',
 'E21':'选图后的正确反馈，部分选项被遮挡', 'E22':'键入听写后的正确反馈',
}
# A mapped check means these screenshots support the stated actual result, not every
# platform, input value, or exceptional branch included in a broad test prompt.
LIVE_CHECKS={
 'E15':{'initial':[235],'empty':[235],'entry':[236],'silence':[237],'speech-error':[237,238]},
 'E17':{'initial':[201],'empty':[201],'play':[217],'select':[202,203],'wrong':[215,216],'after-wrong':[217,218],'retry':[251,252,253],'correct':[204,253],'after-correct':[205,254]},
 'E18':{'initial':[218],'empty':[218],'play':[223,224],'select':[219,220],'wrong':[231,232],'after-wrong':[232,233],'retry':[254,255,256],'correct':[221,226,256],'after-correct':[222,257],'skip-audio':[233,234,235]},
 'E19':{'initial':[239],'empty':[239],'audio-controls':[240],'first-side':[240,245],'wrong-pair':[241,242],'pair-recovery':[242,243],'correct-pair':[243,244],'all-pairs':[249,250],'after-correct':[251]},
 'E21':{'initial':[10],'empty':[10],'select':[11],'change':[12,13,14],'wrong':[14,15,16], 'after-wrong':[16,17],'retry':[120,121,122,123],'correct':[123],'after-correct':[124]},
 'E23':{'initial':[17],'empty':[17],'select':[20],'change':[21,22],'wrong':[22,23],'after-wrong':[23,24],'retry':[124,125,126],'correct':[126,37],'after-correct':[127,38],'exit':[34,35,36]},
 'E04':{'initial':[38,50],'empty':[42,50],'first-token':[41,52],'more-tokens':[53],'undo':[54,55],'clear':[41,42],'reorder':[53,54,55],'wrong':[44,45],'after-wrong':[45,46],'retry':[128,129,130],'correct':[56,130],'after-correct':[57,131],'alternative':[51]},
 'E12':{'initial':[60],'empty':[60],'select':[61],'change':[62,63],'wrong':[63,64],'after-wrong':[64,65],'retry':[131,132,133],'correct':[133],'after-correct':[134]},
 'E01':{'initial':[90],'empty':[90],'first-side':[91,97],'reselect':[91,92],'wrong-pair':[93,94],'pair-recovery':[94,95],'correct-pair':[95,96],'all-pairs':[99,100],'after-correct':[101]},
 'E13':{'initial':[65],'empty':[65,78],'audio-controls':[70,71],'first-token':[72],'more-tokens':[79],'undo':[77,78],'clear':[78],'alternative':[72,73,77,80]},
 'E22':{'initial':[73],'empty':[73,75],'audio-controls':[70,71],'focus':[73,74],'partial':[74],'edit':[74,75,76],'wrong':[80,81,82],'after-wrong':[82,83]},
}
PARTIAL={
 ('E15','entry'):'仅见波形界面；原生授权与实际收音情况未核。',
 ('E15','silence'):'停止后出现未通过提示；没有音轨，不能判定原因是无声还是发音。',
 ('E15','speech-error'):'未通过提示与跳过已实测；没有重录成功。',
 ('E17','play'):'只验证错误反馈页仍可点播放；未听验。',
 ('E17','retry'):'课末同组选项再现；没有音轨身份核验，不证明同音同题重练。',
 ('E18','play'):'两入口均可点击；音轨质量未核。',
 ('E18','retry'):'同一词对再现；没有音轨身份核验，不证明同音同题重练。',
 ('E19','audio-controls'):'实际点击播放；无音轨听验，未见慢速入口但未据此排除其他版本。',
 ('E23','change'):'已验证改选；未验证再次点击同一文字选项能否取消。',
 ('E12','change'):'已验证改选；未验证取消同一选项。',
 ('E04','alternative'):'只验证 please 的悬停提示；本题键盘切换和播放未测试。',
 ('E01','reselect'):'只验证同列换选；再次点击同一卡未测试。',
 ('E13','undo'):'验证撤回一个词；多词中间位置移除待补。',
 ('E13','audio-controls'):'只记录按钮操作；没有音轨证据，未听验声音质量与速度。',
 ('E22','audio-controls'):'与词库同题的播放按钮已点击；没有音轨证据。',
 ('E22','focus'):'桌面输入可用；未采移动端软键盘、光标特写。',
 ('E22','partial'):'输入 coffee 后检查可用；逐字符阈值未穷举。',
 ('E22','edit'):'已验证整框清空和重填；中间字符选区修改未测试。',
}

from super_flow_checks import extend_checks
extend_checks(PROFILES,PROFILE_IDS,LIVE_CHECKS,PARTIAL)

def create_flow_plan(records,root):
    live=json.loads((root/'live-flow-evidence.json').read_text())
    shots={int(s['id'].rsplit('-',1)[1]):s for s in live['shots']}
    profile_by_id={key:p for p,ids in PROFILE_IDS.items() for key in ids}
    assert set(profile_by_id)=={r['id'] for r in records}
    items=[]
    for r in records:
        key=r['id'];profile=profile_by_id[key]
        steps=list(COMMON if profile not in ('conversation','scene') else COMMON[:1])+list(PROFILES[profile])
        if key in ('E13','E19','E20','E22','R02'):
            steps.insert(1,('audio-controls','播放、重播与慢速播放（按实际入口）','控件操作截图与声音证据分开记录，截图不能证明声音正常。'))
        if key=='E05':steps.insert(2,('hint','悬停中文词查看英语提示','词义浮层、原题是否保留；不把查词算正确作答。'))
        if key=='E07':steps.insert(3,('scaffold','加大难度、减少难度，分别输入再切回','空位与整句的切换、独立草稿是否保留；整句提交另核。'))
        states=[]
        for n,(code,action,observe) in enumerate(steps,1):
            nums=LIVE_CHECKS.get(key,{}).get(code,[])
            partial=PARTIAL.get((key,code))
            states.append(dict(id=f'{key}-{code}',number=n,action=action,observe=observe,
                status=('部分已采集' if partial else '已采集本次实例') if nums else '待实测；适用性也待核',
                screenshot=[shots[z]['file'] for z in nums],
                actual_result='；'.join(f'#{z:03d} {shots[z]["result"]}' for z in nums) if nums else None,
                remaining=partial or ('仅支持本次实例，其他条件仍受整体边界限制。' if nums else '尚无对应中文连续操作证据。')))
        runs=[f['id'] for f in live['runs'] if key in f['type_ids']]
        files={p for f in live['runs'] if key in f['type_ids'] for p in [s['screenshot'] for s in f['steps']]}
        observed=sum(bool(s['screenshot']) for s in states)
        item=dict(id=key,name=r['name'],modality=r['modality_label'],profile=profile,states=states,
            known_static_state=SINGLE_STATE.get(key,'单态证据见题型卡片'),
            static_reference_files=[i['file'] for i in r['images'] if i.get('provenance')!='本轮独立浏览器实测原图'],
            static_reference_is_not_transition_evidence=True,complete_flow=False,
            core_loop_complete=key in live['core_loop_type_ids'],live_run_ids=runs,
            observed_checks=observed,missing_capture_reason=('已取得操作原图，未穷举所有条件分支；具体缺项见下表。' if runs else '本次访客基础课、发音专项及Super故事/单元复习/电台未采到该条目。后续单元、客户端或Max条件仍需核实；未遇到不等于产品不支持。'))
        items.append(item)
        r['flow_evidence']=dict(complete=False,core_loop_complete=item['core_loop_complete'],captured_transition_count=observed,unique_flow_screenshots=len(files),planned_checks=len(states),anchor='flow-'+key,live_run_ids=runs)
    data=dict(date=live['date'],scope='中文用户学英语；同题同会话操作、错误与恢复分支',
        current_live_capture_count=live['screenshot_count'],complete_flow_count=0,
        core_loop_count=len(live['core_loop_type_ids']),live_type_count=len(live['flow_entries_with_live_evidence']),
        all_important_branches_captured=False,
        counts=dict(research_entries=len(items),planned_checks=sum(len(x['states']) for x in items),
          observed_checks=sum(x['observed_checks'] for x in items),completed_checks=sum(s['status']=='已采集本次实例' for x in items for s in x['states']),
          partial_checks=sum(s['status']=='部分已采集' for x in items for s in x['states'])),
        criteria=['同题同会话；不同题干、不同版本与课内间隔明确标注','每步都有操作、真实结果和未修改的原图','核心闭环与全部条件分支分别统计','没有测试不能标为不适用','免费访客与登录Super分别记录，均不推定Max、移动端或所有账号'],
        live=live,items=items)
    (root/'flow-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    with (root/'flow-coverage.csv').open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.writer(f);w.writerow(['题型编号','题型','节点编号','用户动作','需要观察的结果','状态','实测结果','截图','未覆盖条件'])
        for item in items:
            for s in item['states']:w.writerow([item['id'],item['name'],s['id'],s['action'],s['observe'],s['status'],s['actual_result'] or '', ' | '.join(s['screenshot']),s['remaining']])
    return data

def flow_intro(data):
    return f'''## 4.0 逐步操作截图：从作答到错题重练

**累计 {data['current_live_capture_count']} 张原始操作截图，整理为 {len(data['live']['runs'])} 组流程，涉及 {data['live_type_count']} 个题型/输入变体；其中 {data['core_loop_count']} 类跑通“错误→恢复→正确→继续”的核心闭环（包含自动推进）。所有条件分支均穷举的题型仍为 0，不能把核心闭环称为全覆盖。**

实测范围：2026-09-27，桌面Chrome，中文→英语。A为免费访客基础入门课，B为访客发音专项；C为用户自行登录Super后的Taxi Ride故事重读，D为第21部分单元复习，E为学习法国文化电台复习。视口1200×1189，具体产品构建号未取得。登录后的三条流程都已完成并返回入口；没有升级或购买Max。

**直接看此次Super新增：**[故事阅读与各插题 F17–F22](#live-F17) · [中译英词块全过程 F26](#live-F26) · [键入错误与容错 F27/F29](#live-F27) · [缺词/整句切换 F28](#live-F28) · [电台四种任务 F31–F35](#live-F31)。新增186张原图、19组流程；已有访客流程继续保留。

按图序阅读每一步的**操作 → 实际结果 → 原图**。原图保留完整视口，点击可放大；红心弹层、重练过场、结算与可滚动回顾页分别注明。步骤编号是当前流程内的顺序；原图编号是整场采集索引，所以不必连续。跨到课末重练前确实完成了其他题，不能理解成答错后立即回原题。

**按实际判分单位分开阅读**：普通翻译草稿提交后锁定，后段原题重现；配对错误闪红后原位恢复；故事/电台选择常把错误候选禁用，允许当场选另一项；故事重组则逐片段接受正确前缀。电台完成任务后自动继续节目。它们不能共用一张“答错后重试”的示意图。

故事阅读的S01/S02可用可见文字完成，单列在无需听说组；整个故事仍有S05听音重组，S04短语补全的声音依赖待核。听力入口、录音界面与跳过已有操作图，但没有保存音轨、听验质量或验证成功朗读。Max、移动端、未出现题型与异常分支仍留缺口。

[逐步骤覆盖表](flow-coverage.csv) · [结构化流程证据](live-flow-evidence.json) · [全部分支核对表](flow-data.json)

以下先分开展示无需听说、听力和共用回顾，再列出每一种研究条目的未完成操作。
'''

def flow_markdown(data):
    lines=[flow_intro(data)]
    for run in data['live']['runs']:
        lines+=['',f'<a id="live-{run["id"]}"></a>',f'### {run["id"]} · {run["title"]}','',f'**题干：**{run["prompt"]}',run['summary'],'',f'**连续性与缺口：**{run["limitations"]}','']
        for step in run['steps']:
            lines += [f'**{step["number"]}. {step["action"]}** — {step["actual_result"]}','',f'![{run["id"]} 步骤{step["number"]}：{step["actual_result"]}]({step["screenshot"]})','']
    lines += ['## 各题型操作分支覆盖表','']
    for item in data['items']:
        lines+=['',f'<a id="flow-{item["id"]}"></a>',f'### {item["id"]} · {item["name"]}','',item['missing_capture_reason'],'',
                '| 步骤 | 用户动作 | 状态 | 实测结果 / 缺口 |','| --- | --- | --- | --- |']
        for s in item['states']:lines.append(f'| {s["number"]} | {s["action"]} | {s["status"]} | {(s["actual_result"] or s["observe"])} {s["remaining"]} |')
    return '\n'.join(lines)+'\n'

def render_live_gallery(data):
    esc=lambda x:html.escape(str(x),quote=True)
    shots={s['id']:s for s in data['live']['shots']}
    groups=[('flow-non-audio','无需听力或口语：同题错误与恢复',['F01','F02','F03','F04','F05','F07','F08','F09','F11']),('flow-audio','听说相关：听写、故事声音任务与电台',['F06','F10','F13','F14','F15','F16']),('flow-shared','完整容器与共用层：故事阅读路径、结算、答案回顾',['F12'])]
    for gid,title,ids in groups:
        group={'flow-non-audio':'non-audio','flow-audio':'audio','flow-shared':'shared'}[gid]
        ids.extend(f['id'] for f in data['live']['runs'] if f.get('gallery_group')==group)
    assert {f['id'] for f in data['live']['runs']}=={id_ for _,_,ids in groups for id_ in ids}
    out=[]
    for gid,title,ids in groups:
        out.append(f'<section class="flow-group" id="{gid}"><h3>{title}</h3><div class="flow-jumps">')
        for f in data['live']['runs']:
            if f['id'] in ids:out.append(f'<a href="#live-{f["id"]}">{f["id"]} · {esc(f["title"])}</a>')
        out.append('</div>')
        for f in data['live']['runs']:
            if f['id'] not in ids:continue
            badge='同题核心闭环已实测' if f['core_wrong_recovery_correct_loop'] else '部分分支已实测'
            opened=' open' if f['id']=='F01' else ''
            out.append(f'<details class="live-flow" id="live-{f["id"]}"{opened}><summary><span>{f["id"]} · {esc(f["title"])}</span><small>{len(f["steps"])} 步 · {badge} · 点击展开原图</small></summary><p><b>题干：</b>{esc(f["prompt"])}</p><p>{esc(f["summary"])}</p><p class="limit"><b>连续性与缺口：</b>{esc(f["limitations"])}</p><p>会话 {esc(f["lesson_run"])} · 桌面中文→英语 · '+(' · '.join(f'<a href="#{k}">{k} 题型分析</a>' for k in f['type_ids']) or '共用反馈层')+'</p><div class="step-grid">')
            for s in f['steps']:
                shot=shots[s['shot_id']]
                out.append(f'<figure class="flow-step" id="{f["id"]}-step-{s["number"]}"><figcaption><span class="step-num">{s["number"]:02d}</span><h4>{esc(s["action"])}</h4><p>{esc(s["actual_result"])}</p></figcaption><a href="{s["screenshot"]}" target="_blank" rel="noopener" aria-label="打开{f["id"]}第{s["number"]}步原图"><img src="{s["screenshot"]}" width="{shot["width"]}" height="{shot["height"]}" loading="lazy" alt="{esc(s["actual_result"])}"></a><p class="shot-meta">原图 {shot["id"]} · {esc(shot["capture_date"][11:19])} · <a href="{s["screenshot"]}" target="_blank" rel="noopener">放大完整原图 ↗</a></p></figure>')
            out.append('</div></details>')
        out.append('</section>')
    return ''.join(out)

def render_flow_details(data):
    esc=lambda x:html.escape(str(x),quote=True)
    out=['<h3>逐题型分支覆盖：已拍到什么，还缺什么</h3><p>“已采集本次实例”只表示该节点有实测图证；“部分已采集”仍有明确子条件未验证。所有题型的全条件穷举状态均未完成。</p>']
    for item in data['items']:
        rows=[]
        for s in item['states']:
            refs=' · '.join(f'<a href="{p}" target="_blank">#{p.rsplit("/",1)[1].split(".")[0]}</a>' for p in s['screenshot'])
            rows.append(f'<tr><td>{s["number"]}</td><td>{esc(s["action"])}</td><td>{esc(s["status"])}<br>{refs}</td><td>{esc(s["actual_result"] or s["observe"])}<br><em>{esc(s["remaining"])}</em></td></tr>')
        live_links=' · '.join(f'<a href="#live-{f}">{f} 连续截图</a>' for f in item['live_run_ids'])
        out.append(f'<details class="flow-detail" id="flow-{item["id"]}"><summary>{item["id"]} · {esc(item["name"])} — {item["observed_checks"]}/{len(item["states"])} 节点有本轮截图</summary><p>{esc(item["missing_capture_reason"])}</p><p>{live_links} · <a href="#{item["id"]}">题型分析</a></p><div class="table-scroll"><table><thead><tr><th>步骤</th><th>用户动作</th><th>采集状态</th><th>实测结果与未覆盖条件</th></tr></thead><tbody>{"".join(rows)}</tbody></table></div></details>')
    return ''.join(out)
