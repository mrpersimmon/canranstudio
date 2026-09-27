"""Build the Chinese-native -> English report; preserve the earlier cross-language research."""
from pathlib import Path
from copy import deepcopy
import csv
import hashlib
import html
import json
import re
import subprocess
from flow_capture_plan import create_flow_plan, flow_markdown, flow_intro, render_flow_details, render_live_gallery
from live_report_content import augment_records
from super_report_content import apply_super_updates

R = Path(__file__).resolve().parent.parent
old = json.loads((R / 'background-english-all-native/report-data.json').read_text())
native = json.loads((R / 'chinese-learner-analysis.json').read_text())
native_by_id = {r['id']: r for r in native['records']}
core = json.loads((R / 'chinese-core-sources.json').read_text())
core_by_id = {i['id']: i for i in core['assets']}
esc = lambda s: html.escape(str(s), quote=True)
APPLE_MATCH = 'https://apps.apple.com/cn/iphone/story/id1605587215'
APPLE_AUDIO = 'https://apps.apple.com/cn/iphone/story/id1399754989'
GOOGLE = 'https://play.google.com/store/apps/details?hl=zh_CN&id=com.duolingo'

def official_image(key, label, full=False):
    a = core_by_id[key]
    return dict(file=a['file'], url=a['url'], source=a['sourcePage'], label=label,
        framing={'CNM01':'完整中文题页 · 正确反馈状态',
                 'CNM02':'官方双屏合成原图 · 仅前景题页完整',
                 'CNM03':'完整课程选择入口 · 不计为题型'}.get(key, '官方宣传局部图 · 不计为完整题页'),
        note=a['notes'], width=a['width'], height=a['height'], sha256=a['sha256'],
        course_direction='中文母语 → 英语', interface_language='中文', full_task_view=full,
        provenance='官方渠道公开原图', publisher=a['publisher'], capture_date='拍摄日期、应用版本未公布',
        evidence_id=key)

def historical_image(record_id):
    a = deepcopy(next(i for r in old['records'] if r['id']==record_id for i in r['images'] if i['interface_language']=='中文'))
    a.update(label='用户历史参考 · 中文界面学习英语', framing='完整中文题页 · 原始历史截图',
             course_direction='中文母语 → 英语', note='用户此前提供的真实题页；实际拍摄日期、应用版本和当时套餐未确认。')
    return a

# Facts below are based on the original Chinese images, not translated foreign screenshots.
confirmed = {
 'E01': dict(name='中英词语配对', images=[official_image('CNM01','中英词语配对 · 全部配对后的反馈',True)],
    goal='把英语词形与熟悉的中文意义联系起来，检查词义识别。',
    io=('两列中文与英语词语，例如“喜欢”和 like。','相互对应的词语配对。'),
    steps=['阅读“选择配对”，在两列中找到意义对应的词。','先点一侧词语，再点另一侧的对应词，逐组完成。','图示已到正确反馈状态，阅读“不错哦！”后点“继续”。'],
    ui='两列等宽词卡把找词范围固定下来；顶部显示进度，底部集中展示反馈和继续按钮。截图中词卡已变暗，因为当前画面是完成后的状态；不能据此评价未作答状态的可读性。',
    design='中文词义降低理解任务的门槛，英语词形是识别对象。两侧都有候选，所以它检查的是识别与关联，而不是无提示回忆或拼写。',
    load='既要辨认英语词形，也要在两列来回寻找；读词和找位置的负担应分开看。',
    feedback='若用于中文英语课程，错误反馈应指出这对词的意义关系；单纯颜色闪动不足以说明词义。',
    limit='一张正确反馈图不能证明具体的错配动画、自动判分时机或是否支持撤回。'),
 'E04': dict(name='英译中：用中文词块表达英语意义', images=[historical_image('E04')],
    goal='理解英语短语，再用给定中文词块表达其意义。',
    io=('英语 my mother 与中文词块。','我 / 的 / 母亲。'),
    steps=['阅读“翻译这句话”和英语短语；扬声器是可选辅助。','按中文表达顺序点选“我”“的”“母亲”。','核对已放入的词块，再点“检查”；撤回词块的具体操作尚未实测。'],
    ui='英语在角色气泡中，答案区与中文词库分开。已用词块在词库原位置留下灰色占位；绿色“检查”位于底部。',
    design='my 对应“我的”，在这里需要两个中文词块。中英词块数量不相同，提醒我们应训练短语意义，而非机械的一词一块对应。',
    load='除了理解英语，还要在中文词库中找词并组合；正确点击并不等于能写出英语。',
    feedback='可以用中文说明 my mother 是“我的母亲”，再逐步撤去词库验证英语记忆；不要只强化固定点击顺序。',
    limit='此图为提交前状态，不能据此确认错误提示或英语主动产出能力。'),
 'E05': dict(name='中译英：用英语词块组织译文', images=[official_image('CNM05','中文原句 → 英语词块 · 宣传局部图')],
    goal='读懂中文意思，在给定英语词库中选择词汇并组织英语顺序。',
    io=('“我喜欢我的英语老师。”与英语候选词块。','I like my English teacher。'),
    steps=['先阅读中文原句，确认人物、动作和对象。','从英语词库按目标语顺序选词，组成译文。','核对词序与词义，再使用题页的检查控件；本轮未操作该宣传图对应版本。'],
    ui='中文原句和英语答案处于不同区域，词库已经提供拼写。采用 iPad 宣传图，题干与答案可见，但设备下边界被裁切；官方双屏图中的另一道中译英题也有遮挡。',
    design='与英译中相比，这一方向更直接要求组织英语；但单词已经给出，仍比完全键入少了拼写提取的要求。',
    load='中文一句话不总能按原次序逐词换成英语。应分别检查词义选择、英语结构和点选操作。',
    feedback='反馈可保留原句与学习者的词块顺序，用中文解释具体的英语结构，再给重新排列的机会。',
    limit='有中文题面证据，但不是完整独立题页；键盘切换、撤回和错答状态待补。'),
 'E06': dict(name='中译英：键入完整英语句子', images=[historical_image('E06')],
    goal='从中文意思出发，自行提取英语词汇并组织问句。',
    io=('“你是我的数学老师吗？”','Are you my math teacher?'),
    steps=['读中文问句，判断要表达的关系与疑问语气。','在输入框键入英语问句，检查单词、词序与空格。','确认后点“检查”；下方录音入口属于另一种输入方式，见 E08。'],
    ui='中文在角色气泡，英语在大输入框。框下还有独立录音入口，底部为绿色“检查”。截图没有展开软键盘。',
    design='中文用“吗”表达的疑问，在这里对应英语的 Are you…? 结构。它比词块题多要求词汇提取、拼写和句法组织。',
    load='语言错误可能与输入法、漏空格、光标修改等操作问题混在一起，不能把所有改动都解释为英语不会。',
    feedback='可用中文指出问句开头为何是 Are you，并保留学习者原句供比较；自然的不同表达是否被接受需要另行验证。',
    limit='所见是已输入、未提交状态；没有验证判分、可接受答案集合、软键盘布局或错误恢复。'),
 'E07': dict(name='完成翻译：补出缺少的英语部分', images=[historical_image('E07')],
    goal='在已有英语句式的帮助下，提取中文所指的英语主语。',
    io=('“他们喜欢你。”与已有 like you.','在空位补出 They。'),
    steps=['同时阅读中文原句与已提供的英语部分。','在指定空位输入缺失的主语 They。','核对完整句子，再点“检查”。'],
    ui='“完成翻译”与短空位限定了作答范围；空位和固定的 like you. 位于同一句中，底部检查保持固定位置。',
    design='预先给出句子的大部分，把注意力集中到一个成分。单次答对支持“在支架下补主语”的判断，不能等同于整句自由生成。',
    load='学习者要区分哪些内容可改、哪些内容已提供；否则容易把任务当成重写整句。',
    feedback='可明确显示缺失成分在句子中的作用，再更换人称或减少提示检查是否会迁移。',
    limit='截图未展示判分反馈、可编辑区域焦点或软键盘；仅确认所示部分翻译状态。'),
 'E08': dict(name='翻译题中的英语语音输入入口', images=[historical_image('E06')],
    goal='如果该入口可用，通过口头组织英语完成翻译输入；具体判分方式尚未确认。',
    io=('中文原句与录音入口。','预期为口述英语或转写结果，具体流程待核。'),
    steps=['在中文翻译页找到输入框下方的录音入口。','录音权限、开始/停止、识别结果确认与提交步骤本轮均未验证。'],
    ui='当前只见独立的麦克风/录音栏；复用 E06 原图标记这个入口，没有录音中、转写后或发音评分的截图。',
    design='改变输入方式可以减少键盘负担，却可能增加语音识别和设备环境的影响；语音输入不自动等于独立的发音训练题。',
    load='英语表达、系统识别失败、环境噪声和授权失败应分开处理。',
    feedback='建议先让用户确认识别文本，并提供键入恢复入口；这只是设计建议，不是对当前功能的确认。',
    limit='仅有入口证据，不计为完整语音任务；与 E06 复用同一个图像文件，不重复计图。'),
 'E09': dict(name='英语选词填空与中文意义反馈', images=[historical_image('E09')],
    goal='根据英语句子与词义，从候选词中选出合适的修饰语。',
    io=('He is my ___ friend. 与 long / red / good。','选择 good。'),
    steps=['阅读句子和三个候选词。','选择符合语义的 good，完成提交。','图示反馈给出中文意义“他是我的好朋友”，核对后点“继续”。'],
    ui='题干、已选绿色词卡、勾选反馈与中文解释同时保留。“继续”位于反馈下方；这是作答后的正确状态。',
    design='绿色标记告诉用户选中了哪项，中文意义帮助把整个英语句子连回熟悉的表达。候选中有容易按常识排除的词，不能由这一题的成功推断复杂搭配能力。',
    load='既要知道候选词意思，也要理解该词在句中能否成立；选项排除策略会影响结果。',
    feedback='干扰项应围绕当前教学目标设计；后续可换语境验证 good 的理解，而不只复现同一组候选。',
    limit='完整正确反馈图不包含错选时的提示与重试流程，也不证明无词库时能主动产出。'),
 'E15': dict(name='英语朗读：中文指令与录音入口', images=[official_image('CNM08','中文朗读指令 · 官方宣传局部图')],
    goal='看着给定英语表达说出来，建立文字与口头输出的联系。',
    io=('中文朗读指令与英语 Hello!。','朗读给定英语。'),
    steps=['读中文任务说明，查看英语句子；可使用扬声器参考。','使用录音入口朗读英语。','查看反馈与中文意义，再点“继续”；实际授权与识别过程待实测。'],
    ui='中文任务指令、英语气泡、蓝色录音入口和底部中文反馈可见。宣传图保留主要控件，但应用底边被画布裁切。',
    design='答案文字已经给出，主要要求把文字说出来；这与自己构思英语回答是不同任务。中文反馈帮助核对意义。',
    load='发音、是否会读、录音状态与识别成功与否可能混合影响完成结果。',
    feedback='建议把“没录到声音”和“表达需要调整”分开说明，保留重新听、重新录制的路径。',
    limit='宣传图不能证明识别精度、发音评分维度或实时逐词纠错；不计完整题页。'),
 'E20': dict(name='听英语，配对中文词义', images=[official_image('CNM02','英语听音 → 中文词义 · 前景完整题页',True)],
    goal='把英语声音与中文意义联系起来，检查听觉词义识别。',
    io=('左侧音频按钮与右侧中文词义。','例如将英语 phone 的声音与“手机”配对。'),
    steps=['点击一个音频按钮听英语。','在中文选项中点对应词义，逐组完成配对。','图中 phone 与“手机”已匹配；底部仍有灰色“检查”和“现在不做听力题”。完成全部配对后的转换尚未实测。'],
    ui='音频与中文词义分成两列，已配对项目用绿色强调。原图是官方双手机合成图，前景题页完整，背景翻译题被遮挡。',
    design='中文选项把输出限制在意义选择，因此不用键入英语也能检验声音理解。与 E01 相比，输入由可见英语词形变成英语声音。',
    load='需要分辨英语声音并记住刚听的内容；不能依靠中文选项来判断是否会拼写英语。',
    feedback='建议让重听与已完成配对状态保持清楚；错误时重新连接声音和意义，而不只要求再点一次。',
    limit='这是普通课程的听力词义配对证据，不能把它当作 Sounds 专项、Radio 题页或无限心套餐的独占证据。'),
 'E21': dict(name='按中文意义，看图选择英语词', images=[official_image('CNM06','中文提示“玻璃杯” · 看图选词宣传局部图')],
    goal='根据中文意义，在带插图的英语候选中识别对应词。',
    io=('中文“玻璃杯”提示、四宫格图片与英语词标签。','图中选中 glass。'),
    steps=['阅读中文问题，确认要找的对象。','同时比较图片与英语词标签，选择对应选项。','查看所示正确反馈后继续；未作答和错选状态未实测。'],
    ui='四张图卡提供图形线索，glass 被蓝色选中。底部绿色反馈覆盖了下排词标签，宣传画布也裁掉了应用底边。',
    design='图片降低寻找对象的难度，但如果只看中文和图片就能答对，英语词形未必被认真处理。后续需减少图片帮助，检验真正的词义关联。',
    load='物品识别与英语识别在同一题中发生；插图是否易辨认会改变题目难度。',
    feedback='可在反馈中把英语词与图、中文意义并列，再在后续任务中去掉其中一种提示。',
    limit='本图不是完整无遮挡题页；下排英文标签不可完整读取，不能补写成看见的事实。'),
 'E22': dict(name='听英语，键入完整句子', images=[official_image('CNM09','中文听写指令 · 英语键入与中文反馈局部图')],
    goal='把听到的英语声音还原成有单词边界的书面句子。',
    io=('英语音频与普通/慢速播放按钮。','图中已键入 I need to pay.。'),
    steps=['根据中文指令播放音频，必要时使用慢速播放。','在输入框键入听到的英语，核对单词与空格后提交。','图中已显示正确反馈和中文意义，阅读后继续；提交前按钮及键盘展开状态未展示。'],
    ui='角色旁并列普通和慢速播放入口，下方为较大输入框；底部中文反馈与“继续”可见。原图属于底边裁切的官方宣传图。',
    design='中文解释在所示反馈中出现，帮助核对句意。听懂意思、分辨声音和正确拼写是相互关联但不同的要求，错误需要分项理解。',
    load='连贯语音、词的边界、拼写及手机键入共同影响答案；仅凭最终文本无法知道错在听辨还是输入。',
    feedback='建议允许重听并对照修正片段，分别解释词义或拼写问题；不要把漏空格都当作听不懂。',
    limit='未采集原音轨，也未验证慢速音频、拼写容错或错答状态；宣传图不计完整题页。'),
}

# Keep original identifiers for links; new observations get separate entries.
records = deepcopy(old['records'])
for key in ('E20','E21','E22'):
    records.append(dict(id=key, kind='原子任务', group='词汇与翻译' if key=='E21' else '听力与口语', sources=[]))
for r in records:
    key = r['id']; a = native_by_id.get(key, {})
    if a:
        r.update(goal=a['ability_goal'], extra_load=a['extra_load'], design=a['chinese_explanation_role'],
            feedback_recommendation=a['ui_feedback_recommendation'], ability_limit=a['ability_limit'],
            analysis_source='chinese-learner-analysis.json；最终图证状态以当前记录 evidence_level 为准')
    if key in confirmed:
        c = confirmed[key]
        r.update(name=c['name'], images=c['images'], goal=c['goal'], input=c['io'][0], output=c['io'][1],
                 steps=c['steps'], ui=c['ui'], design=c['design'], extra_load=c['load'],
                 feedback_recommendation=c['feedback'], ability_limit=c['limit'], caution=c['limit'])
        r['sources'] = list(dict.fromkeys(i['source'] for i in r['images'] if i['source']))
        r['evidence_level'] = 'entry_only' if key=='E08' else ('full_chinese_task' if any(i['full_task_view'] for i in r['images']) else 'partial_chinese_task')
        if key=='E08':
            r['images'][0].update(full_task_view=False, label='E06 原图复用 · 这里只证明录音入口', framing='完整翻译题页中的语音入口 · 不是完整语音流程')
        r['ui_basis'] = '截图事实'
        r['availability'] = '已见中文界面与英语学习方向；证据仅适用于所示版本和状态，当前账号、地区与客户端未逐项实测。'
        r['plan'] = '普通课程任务。图片中的心形、能量或无限心不能单独证明此题是某套餐专属；本轮未核验账号权益。'
    else:
        r['images'] = []
        r['evidence_level'] = 'unverified_chinese_course'
        r['ui_basis'] = '中文适配分析，非已观察的中文界面'
        text_steps = a.get('operations',{}).get('text',[])
        audio_steps = a.get('operations',{}).get('listening_speaking',[])
        r['steps'] = text_steps if r['modality_section']!='listening-speaking' else (audio_steps or text_steps)
        if key=='E16':r['steps']=text_steps+audio_steps
        r['ui'] = '需要核对：'+'；'.join(a.get('pending',['中文任务说明、英语材料和反馈的位置']))+'。'
        r['caution'] = a.get('evidence_scope','尚未取得中文学习英语的题页，不能由其他母语课程反推中文课程已经开放。')+' '+a.get('ability_limit','')
        r['availability'] = '中文→英语具体题型和当前入口待核实；以下操作是若该任务出现在中文课程时的分析路径，不是账号实测步骤。'
        r['plan'] = '中文课程套餐归属待核实。通用产品资料见跨语言参考附录；全球英语覆盖不等于中文母语方向已开放。'
        r['generic_sources'] = r.pop('sources',[])
        r['sources'] = []
        # Avoid retaining another native language's specific inputs as Chinese facts.
        r['input'] = a.get('example',{}).get('zh','中文任务说明及该题所需的英语材料。')
        r['output'] = a.get('example',{}).get('en','按目标任务作答；中文版本仍待核。')
    r['status'] = {'full_chinese_task':'完整中文题页','partial_chinese_task':'中文宣传局部图','entry_only':'仅见中文输入入口','unverified_chinese_course':'中文课程 / 题图待核实'}[r['evidence_level']]
    if key in ('E20','E21','E22'):
        r['modality_section'] = 'non-audio' if key=='E21' else 'listening-speaking'
        r['modality_note'] = {'E20':'必须听英语声音，通过点击中文词义作答。','E21':'阅读中文提示、图片与英语词，通过点选作答，不要求听音或开口。','E22':'必须听音，使用键盘输入英语；不要求口说。'}[key]
    r['modality_label'] = {'non-audio':'不含口语和听力','listening-speaking':'听力与口语相关','supporting-interaction':'场景辅助交互'}[r['modality_section']]
    if key=='E04':r['modality_note']='阅读英语原句，用中文词块作答；播放是可选辅助。'
    if key=='E05':r['modality_note']='阅读中文原句，用英语词块作答。'
    if key=='M01':r['name']='Roleplay 英语多轮文字情境聊天（中文覆盖待核）'
    if key=='R02':r['name']='Radio 英语声音与中文释义配对（中文覆盖待核）'
    if key.startswith('S'):
        r['availability']='官方历史文章确认中文使用者学习英语的 Stories；当前具体交互、账号入口和完整中文题页仍待核实。'
        r['sources']=['https://blog.duolingo.com/duolingo-stories-the-journey-to-android/']

live_evidence=json.loads((R/'live-flow-evidence.json').read_text())
records=augment_records(records,live_evidence)
records=apply_super_updates(records,live_evidence)
records.sort(key=lambda r: (['E','S','R','A','M'].index(r['id'][0]),int(r['id'][1:])))
mode = dict(id='P05',name='确认课程方向：通过中文学习英语',kind='课程入口，非题型',
    goal='先确认课程的学习基础语言与目标语言，再讨论中文指令和英语题目。',
    steps=['在“通过中文学习”分组找到“英语”。','确认选择的是中文母语学习英语；列表下方“通过英语学习”的课程属于不同方向。'],
    ui='课程分组标题、国旗与语言名称明确显示学习方向；底部保留继续按钮。',
    note='该图是官方历史公开入口，不是本轮账号操作记录，也不证明之后所有功能均可用。',
    images=[official_image('CNM03','通过中文学习 → 英语 · 课程入口')],sources=[APPLE_MATCH])
modes=[mode]
sections=[]
for id_,title in [('non-audio','4.1 不含口语和听力的题目'),('listening-speaking','4.2 听力与口语相关题目'),('supporting-interaction','4.3 场景辅助交互')]:
    members=[r for r in records if r['modality_section']==id_]
    shown=[r for r in members if r['images']]; pending=[r for r in members if not r['images']]
    full=sum(r['evidence_level']=='full_chinese_task' for r in shown)
    section_intro=f'本组 {len(members)} 个研究条目：{len(shown)} 项有中文图像证据，其中 {full} 项有完整题页；另 {len(pending)} 项仍待核实中文课程与具体题图。条目含情境和输入变体，不是官方题型总数。'
    if id_=='non-audio':
        section_intro+='\n\n按当前文字/图片分支能否独立完成归类：通过点选、配对或键入作答；可选播放按钮不使其成为必做听力题。Stories 的 S01/S02 本轮已实测可见文字分支；整篇故事仍含听音任务。Adventures 与 Roleplay 文字分支继续待核，不承诺整节课完全无声。'
    if id_=='listening-speaking':section_intro+='\n\n听音输入与口头输出分别说明。语音输入入口、朗读给定答案、自己组织英语回应不是同一种能力要求。'
    if id_=='supporting-interaction':section_intro+='\n\n走动、点物和触发对话属于情境组织，不单独当作英语能力判分题。'
    sections.append(dict(id=id_,title=title,intro=section_intro,records=members,shown=shown,pending=pending))

main_images={}
for r in records+modes:
    for i in r['images']:
        if i['file'] not in main_images:main_images[i['file']]=i
for i in live_evidence['shots']:main_images.setdefault(i['file'],i)
full_records=[r for r in records if r['evidence_level']=='full_chinese_task']
counts=dict(research_entries_including_unverified=len(records), entries_with_chinese_image_evidence=sum(bool(r['images']) for r in records),
    entries_with_full_chinese_task_view=len(full_records), entries_with_partial_chinese_task_view=sum(r['evidence_level']=='partial_chinese_task' for r in records),
    entries_with_only_input_entry=sum(r['evidence_level']=='entry_only' for r in records), entries_with_chinese_course_or_image_unverified=sum(not r['images'] for r in records),
    main_unique_image_files=len(main_images), main_unique_task_image_files=len({i['file'] for r in records for i in r['images']}),
    official_chinese_image_files=sum(i['provenance']=='官方渠道公开原图' for i in main_images.values()),historical_user_image_files=4,
    non_audio_research_entries=len(sections[0]['records']),non_audio_entries_with_chinese_evidence=len(sections[0]['shown']),
    non_audio_entries_with_full_chinese_task_view=sum(r['evidence_level']=='full_chinese_task' for r in sections[0]['records']),
    not_official_total_exercise_types=True)
flow_data=create_flow_plan(records,R)
counts.update(complete_operation_flows=flow_data['complete_flow_count'],
              current_run_product_flow_screenshots=flow_data['current_live_capture_count'],
              live_type_entries=flow_data['live_type_count'],core_wrong_recovery_correct_loop_types=flow_data['core_loop_count'],
              screenshot_flow_groups=len(live_evidence['runs']),operation_checks_with_live_evidence=flow_data['counts']['observed_checks'])
flow_md=flow_markdown(flow_data).replace('](assets/',']('+str(R)+'/assets/')
(R/'FLOW_AUDIT.md').write_text('# 中文英语题目：完整操作截图清单\n\n'+flow_md)

node='/Users/permission/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
marked='/Users/permission/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js'
def mdhtml(s):
    js='import {marked} from '+json.dumps(marked)+';let s="";for await(const c of process.stdin)s+=c;process.stdout.write(marked.parse(s));'
    t=subprocess.run([node,'--input-type=module','-e',js],input=s,text=True,capture_output=True,check=True).stdout
    return t.replace('<table>','<div class="table-scroll"><table>').replace('</table>','</table></div>')
def links(urls):
    return ' · '.join(f'<a href="{esc(u)}" target="_blank" rel="noopener">来源 {n}</a>' for n,u in enumerate(urls,1))
def fig(i):
    source=f'<a href="{esc(i["source"])}" target="_blank" rel="noopener">来源页面</a>' if i['source'] else '已有用户历史参考'
    return f'''<figure><a href="{esc(i['file'])}" target="_blank"><img src="{esc(i['file'])}" alt="{esc(i['label'])}" width="{i['width']}" height="{i['height']}" loading="lazy"></a><figcaption><strong>{esc(i['label'])}</strong><br>{esc(i['framing'])} · {i['width']} × {i['height']}<br>界面：{esc(i['interface_language'])}；学习方向：{esc(i['course_direction'])}<br>{esc(i['note'])}<span class="img-links"><a href="{esc(i['file'])}" target="_blank">查看原图</a> · {source}</span></figcaption></figure>'''
def card(r):
    known=bool(r['images'])
    qualifier='' if known else '<p class="limit">此条目尚无中文题页。下述内容是中文用户视角的条件分析，不代表当前中文课程已开放。</p>'
    f=r['flow_evidence']
    if f['live_run_ids']:
        flowlinks=' · '.join(f'<a href="#live-{key}">{key} 逐步原图</a>' for key in f['live_run_ids'])
        qualifier+=f'<p class="flow-evidence"><b>{"同题错误到正确的核心闭环已实测" if f["core_loop_complete"] else "部分操作已实测"}：</b>{flowlinks}。<a href="#flow-{r["id"]}">查看剩余分支</a>；尚非所有条件全覆盖。</p>'
    else:
        qualifier+=f'<p class="limit"><b>连续操作尚未采集：</b><a href="#flow-{r["id"]}">查看本题 {f["planned_checks"]} 项待验证操作</a>。</p>'
    steps=''.join('<li>'+esc(s)+'</li>' for s in r['steps'])
    io_title='输入 → 输出' if known else '中文视角示例（分析示例，非中文题图转录）'
    body=f'''{qualifier}<div class="exercise-body"><div class="analysis"><p class="modality"><b>作答方式：</b>{esc(r['modality_note'])}</p><p><b>能力目标：</b>{esc(r['goal'])}</p><p><b>{io_title}：</b>{esc(r['input'])} → {esc(r['output'])}</p><h4>{'用户如何操作' if known else '若中文课程提供该任务，操作如何理解'}</h4><ol>{steps}</ol><p><b>{esc(r['ui_basis'])}：</b>{esc(r['ui'])}</p><p><b>中文用户的任务负担：</b>{esc(r['extra_load'])}</p><p><b>设计解读：</b>{esc(r['design'])}</p><p><b>反馈建议（分析）：</b>{esc(r['feedback_recommendation'])}</p><p class="limit"><b>证据与能力边界：</b>{esc(r['caution'])}</p><details><summary>课程与套餐边界</summary><p>{esc(r['availability'])}</p><p>{esc(r['plan'])}</p></details><p class="sources-inline">{links(r['sources'])}</p>'''
    if not known:body+=f'<p class="sources-inline"><a href="reference-other-native-languages.html#{r["id"]}">查看通用机制的跨语言参考（不计中文覆盖）</a></p>'
    body+='</div>'
    if known:body+='<div class="screens">'+''.join(fig(i) for i in r['images'])+'</div>'
    body+='</div>'
    heading=f'<div class="exercise-heading"><span class="number">{r["id"]}</span><div><p class="eyebrow">{esc(r["group"])} · {esc(r["status"])}</p><h3>{esc(r["name"])}</h3></div></div>'
    if known:return f'<article class="exercise" id="{r["id"]}" data-evidence="{r["evidence_level"]}">{heading}{body}</article>'
    return f'<article class="exercise pending" id="{r["id"]}" data-evidence="{r["evidence_level"]}"><details><summary>{r["id"]} · {esc(r["name"])} <span>中文待核实 · 展开分析</span></summary>{body}</details></article>'

intro=(R/'sources/chinese-editorial.md').read_text()
ending=(R/'sources/chinese-synthesis.md').read_text()
source_urls=set(re.findall(r'\]\((https://[^)]+)\)',intro+ending+flow_md))
for r in records+modes:source_urls.update(r['sources'])
titles={s['url']:s.get('title',s['url']) for s in old['sources']}
for a in core['assets']:titles[a['sourcePage']]=a['sourceTitle']
titles.update({'https://blog.duolingo.com/guide-to-duolingo-practice-hub/':'Duolingo 官方：免费的 Practice 技能练习',
               'https://blog.duolingo.com/duolingo-stories-the-journey-to-android/':'Duolingo 官方历史说明：Stories 上线 Android 与课程范围',
               'https://blog.duolingo.com/duolingo-max/':'Duolingo 官方：Max 功能与课程方向'})
titles['https://blog.duolingo.com/spaced-repetition-for-learning/']='Duolingo 官方：错题复习与间隔重复'
sources=[dict(url=u,title=titles.get(u,u.rstrip('/').split('/')[-1])) for u in sorted(source_urls)]
css=(R/'sources/build_report.py').read_text().split("css='''",1)[1].split("'''",1)[0]
css+='''
.flow-group{margin:36px 0}.flow-jumps{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.flow-jumps a{padding:6px 11px;border:1px solid var(--line);border-radius:6px;font-size:13px}.live-flow{padding:20px;margin:18px 0;border:1px solid #b8c7ad;background:#f9fbf7;border-radius:12px;scroll-margin-top:100px}.live-flow>summary{cursor:pointer;font-size:19px;font-weight:700}.live-flow>summary small{display:block;font-size:13px;font-weight:400;color:#59654e;margin-top:5px}.step-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.flow-step{margin:0;width:auto;max-width:none;min-width:0;background:white;border:1px solid var(--line);border-radius:8px;overflow:hidden}.flow-step figcaption{padding:17px;min-height:148px;font-size:14px;line-height:1.6}.flow-step h4{margin:0 0 8px;font-size:16px}.flow-step figcaption p{margin:0}.step-num{float:right;color:#778665;font-weight:800;font-size:24px;margin-left:10px}.flow-step img{display:block;width:100%;height:auto;max-height:none;object-fit:contain;border-top:1px solid var(--line);background:white}.shot-meta{font-size:11px;color:var(--muted);padding:10px 16px;margin:0}.flow-evidence{background:#e9f3df;border-left:4px solid #74a849;padding:14px 18px}.flow-detail{margin:12px 0;padding:14px;border:1px solid var(--line);border-radius:8px}.flow-detail table{font-size:13px}.flow-detail td{vertical-align:top}.flow-detail em{color:#786042}.flow-detail td:last-child{min-width:280px}.flow-step a:focus-visible,.live-flow>summary:focus-visible{outline:3px solid #166dc4;outline-offset:3px}@media(max-width:700px){.step-grid{grid-template-columns:1fr}.live-flow{padding:12px}.flow-step figcaption{min-height:0}}
html{scroll-behavior:auto}
.search{width:100%;padding:13px 16px;border:1px solid var(--line);border-radius:8px;font:inherit;background:white}.exercise-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,330px);gap:32px}.exercise-body>.analysis:only-child{grid-column:1/-1}.screens{display:block;padding:0;margin:18px 0 0;border:0}.screens figure{width:100%;max-width:330px;margin:0 auto 24px}.screens img{max-height:720px}.modality{background:#f0f7eb;padding:10px 14px;border-left:3px solid #6a994e}.pending{padding:0;margin:14px 0;border-radius:10px}.pending>details{border:0;margin:0;padding:16px 22px}.pending summary span{display:block;font-size:12px;color:var(--muted);font-weight:400}.pending .exercise-body{display:block}.pending .limit{margin-top:22px}.status{font-size:12px;font-weight:600;display:inline-block;padding:3px 8px;border-radius:6px;background:#edf3e8}.status.pending-state{background:#fbf4e8}.section-index{font-size:14px}#sources{overflow-wrap:anywhere}#catalogue td:first-child{white-space:nowrap}@media(max-width:900px){.exercise-body{grid-template-columns:1fr}.screens figure{max-width:380px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{.pending details>*{display:block}.exercise-body{display:block}}
'''
notice=f'''主体以中文母语学习英语为准：{counts['entries_with_chinese_image_evidence']} 个条目有中文图证，其中 {len(full_records)} 项有完整题页、{counts['entries_with_partial_chinese_task_view']} 项为宣传局部图、1 项仅见输入入口。另有 {counts['entries_with_chinese_course_or_image_unverified']} 项待核实中文课程或题图。{len(records)} 是研究条目数，含情境与输入变体，不是已确认的现行题型总数。所有截图拍摄版本与当前账号体验分开判断。'''
notice=f'累计 {flow_data["current_live_capture_count"]} 张原始操作截图，{len(live_evidence["runs"])} 组流程，{flow_data["live_type_count"]} 类有连续实测，{flow_data["core_loop_count"]} 类完成同题错误→恢复→正确→继续（含自动推进）的核心闭环。全条件分支穷举仍未完成。'+notice
flow_html='<section id="flows">'+mdhtml(flow_intro(flow_data))+render_live_gallery(flow_data)+render_flow_details(flow_data)+'</section>'
toc_rows=''.join(f'<tr><td><a href="#{r["id"]}">{r["id"]}</a></td><td>{esc(r["name"])}</td><td><a href="#{r["modality_section"]}">{esc(r["modality_label"])}</a></td><td><span class="status {"pending-state" if not r["images"] else ""}">{esc(r["status"])}</span></td></tr>' for r in records)
section_html=[]
for s in sections:
    content=f'<section id="{s["id"]}"><h2>{s["title"]}</h2>'+mdhtml(s['intro'])
    if s['shown']:
        content+='<p class="section-index">已见中文界面：'+' · '.join(f'<a href="#{r["id"]}">{r["id"]} {esc(r["name"])}</a>' for r in s['shown'])+'</p>'
        content+=''.join(card(r) for r in s['shown'])
    if s['pending']:
        content+='<h3>中文课程与题图待核实</h3><p>保留研究线索和中文用户分析；点击展开。以下条目不计入已确认中文题图覆盖。</p>'
        content+=''.join(card(r) for r in s['pending'])
    section_html.append(content+'</section>')
mode_html=f'<section id="modes"><h2>5. 中文课程入口与反馈层</h2><article class="exercise" id="P05"><h3>{mode["name"]}</h3><div class="exercise-body"><div><p>{mode["goal"]}</p><ol>'+''.join('<li>'+s+'</li>' for s in mode['steps'])+f'</ol><p>{mode["ui"]}</p><p class="limit">{mode["note"]}</p><p>反馈层不另加题型计数：E01 的配对反馈、E09 的中文句意、E15 与 E22 的宣传反馈均在对应条目中分析。Super练习基地、故事书架和电台入口已有中文实测，分别见F17、F30、F31；Max仍待核，不用外语界面代替。</p></div><div class="screens">{fig(mode["images"][0])}</div></div></article></section>'
source_html='<section id="sources"><h2>10. 中文证据来源</h2><p>官方平台编辑文章、开发者商店素材与用户历史图分别标注。来源页面更新日期不等于截图日期。跨语言机制的来源另见附录。</p><ol>'+''.join(f'<li><a href="{esc(s["url"])}" target="_blank" rel="noopener">{esc(s["title"])}</a></li>' for s in sources)+'</ol><p>四份完整深色题图来自已有用户参考，见每图说明；未改写原图中的语言或内容。</p></section>'
script='''document.getElementById('catalogue-filter').addEventListener('input',function(){const q=this.value.trim().toLowerCase();let n=0;document.querySelectorAll('#catalogue tbody tr').forEach(r=>{r.hidden=Boolean(q&&!r.textContent.toLowerCase().includes(q));if(!r.hidden)n++;});document.getElementById('filter-count').textContent='显示 '+n+' 个研究条目';});function revealHash(){const e=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(e&&e.classList.contains('pending'))e.querySelector('details').open=true;if(e){let p=e;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}}}window.addEventListener('hashchange',revealHash);revealHash();'''
doc=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="以中文母语学习英语为准，逐题分析 Duolingo 中文界面、操作、学习负担与设计，明确完整截图和缺口"><title>中文用户学英语 · Duolingo 题型与界面分析</title><style>{css}</style></head><body id="top"><header><div class="kicker">CANRAN STUDIO · 中文母语 → 英语 · 2026.09.27</div><h1>中文用户学英语<br>Duolingo 题型与界面</h1><p>从中文指令、英语理解与表达出发，重新分析用户怎样作答、界面提供什么帮助，以及“答对”究竟说明了什么。</p><div class="stats"><div><b>{counts['current_run_product_flow_screenshots']}</b><span>累计原始操作截图</span></div><div><b>{counts['screenshot_flow_groups']}</b><span>逐步截图流程组</span></div><div><b>{counts['live_type_entries']}</b><span>题型/输入变体连续实测</span></div><div><b>{counts['core_wrong_recovery_correct_loop_types']}</b><span>同题错答到正确核心闭环</span></div><div><b>{counts['entries_with_chinese_course_or_image_unverified']}</b><span>条目中文图证仍待核</span></div></div></header><nav><a href="#overview">中文学习视角</a><a href="#index">题型与图证索引</a><a href="#flows">逐步操作与截图</a><a href="#non-audio">不含口语和听力</a><a href="#listening-speaking">听力与口语</a><a href="#supporting-interaction">场景辅助</a><a href="#modes">中文课程入口</a><a href="#synthesis">设计结论与缺口</a><a href="#sources">来源</a></nav><main><div class="tools"><a href="REPORT.md">Markdown 报告</a><a href="coverage.csv">中文覆盖清单</a><a href="flow-coverage.csv">逐步骤截图清单</a><a href="reference-other-native-languages.html">跨语言参考附录</a><a href="adopted-images.json">中文原图索引</a><a href="duolingo-chinese-english-report.zip">离线报告包</a></div><div class="notice">{notice}</div><section id="overview">{mdhtml(intro.split(chr(10),1)[1])}</section><section id="index"><h2>题型与中文图证索引</h2><p>先看“图证状态”，再看分析。待核实条目不代表当前中文账号已提供该题型。</p><label for="catalogue-filter">查找题型或证据状态</label><input class="search" id="catalogue-filter" type="search" placeholder="例如：完整中文题页、不含口语和听力、翻译、待核实" autocomplete="off"><p id="filter-count" role="status">显示 {len(records)} 个研究条目</p><div class="table-scroll"><table id="catalogue"><thead><tr><th>编号</th><th>任务 / 情境 / 输入变体</th><th>听说分类</th><th>中文图证状态</th></tr></thead><tbody>{toc_rows}</tbody></table></div></section>{flow_html}{''.join(section_html)}{mode_html}<section id="synthesis">{mdhtml(ending)}</section>{source_html}<footer>中文母语学习英语的本地研究报告。原始图片及品牌归其权利人所有；未生成、重绘或翻译界面冒充实机截图。当前中文课程全题型与各套餐账号走查尚未完成。</footer></main><a class="top-link" href="#top">返回顶部 ↑</a><script>{script}</script></body></html>'''
(R/'report.html').write_text(doc)

# Appendix is deliberately a separate page, with independent coverage and provenance.
reference_images={}; reference_parts=[]
for r in old['records']+old['modes']:
    imgs=[i for i in r['images'] if i['interface_language']!='中文']
    for i in imgs:reference_images.setdefault(i['file'],i)
    reference_parts.append(f'<article class="exercise" id="{r["id"]}"><h2>{r["id"]} · {esc(r["name"])}</h2><p class="limit">以下是其他母语学习英语的参考，不证明中文课程可用性，也不计入中文完整题图数量。</p><p>{links(r["sources"])}</p><div class="reference-screens">'+(''.join(fig(i) for i in imgs) if imgs else '<p>上一版也未取得该项目的完整跨语言题图。</p>')+'</div></article>')
reference_doc=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>跨语言参考附录 · 不计中文课程覆盖</title><style>{css}.reference-screens{{display:flex;gap:24px;flex-wrap:wrap}}</style></head><body><header><h1>跨语言参考附录</h1><p>仅用于理解通用机制与比较界面。此页不是中文用户界面报告。</p></header><main><p><a href="report.html">← 返回中文用户主报告</a></p><div class="notice">本页保留 {len(reference_images)} 份其他界面语言的原图。英语是学习目标，并不代表学习者母语为中文。所有附录截图均不计入主报告的中文图证统计。</div>{''.join(reference_parts)}<p><a href="report.html">返回主报告</a></p></main></body></html>'''
(R/'reference-other-native-languages.html').write_text(reference_doc)
(R/'reference-images.json').write_text(json.dumps(list(reference_images.values()),ensure_ascii=False,indent=2)+'\n')
counts['reference_only_unique_image_files']=len(reference_images)

md=[intro,notice,'\n## 题型与中文图证索引\n','| 编号 | 题型 / 交互 | 听说分类 | 中文图证状态 |','| --- | --- | --- | --- |']
for r in records:md.append(f'| [{r["id"]}](#{r["id"]}) | {r["name"]} | {r["modality_label"]} | {r["status"]} |')
def mdimages(images):
    out=[]
    for i in images:
        out+=['',f'![{i["label"]}]({R/i["file"]})','',f'图证：{i["framing"]}；界面：中文；学习方向：中文母语→英语。{i["note"]}']
        if i['source']:out.append(f'[来源页面]({i["source"]})')
    return out
md+=['',flow_md]
for s in sections:
    md+=['',f'<a id="{s["id"]}"></a>',f'## {s["title"]}','',s['intro']]
    for r in s['shown']+s['pending']:
        md+=['',f'<a id="{r["id"]}"></a>',f'### {r["id"]} · {r["name"]}','',f'**中文图证：**{r["status"]}',f'**作答方式：**{r["modality_note"]}',f'**能力目标：**{r["goal"]}',f'**输入与输出（待核项目为分析示例）：**{r["input"]} → {r["output"]}','','**用户操作（待核项目为条件分析）**','']+[f'{n}. {v}' for n,v in enumerate(r['steps'],1)]+['',f'**{r["ui_basis"]}：**{r["ui"]}',f'**中文用户的任务负担：**{r["extra_load"]}',f'**设计解读：**{r["design"]}',f'**反馈建议（分析）：**{r["feedback_recommendation"]}',f'**证据与能力边界：**{r["caution"]}',f'**课程与套餐：**{r["availability"]} {r["plan"]}']+mdimages(r['images'])
        if not r['images']:md+=['',f'[跨语言参考，不能作为中文开放证明](reference-other-native-languages.html#{r["id"]})']
md+=['','## 5. 中文课程入口与反馈层','',mode['goal'],mode['ui'],mode['note']]+mdimages(mode['images'])+['',ending,'','## 10. 中文证据来源','']
md += [f'- [{s["title"]}]({s["url"]})' for s in sources]
(R/'REPORT.md').write_text('\n'.join(md)+'\n')
with (R/'coverage.csv').open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.writer(f);w.writerow(['编号','名称','听说分类','中文图证状态','完整中文题页','中文配图数','当前中文账号实测','来源','图片文件','证据限制'])
    for r in records:w.writerow([r['id'],r['name'],r['modality_label'],r['status'],r['evidence_level']=='full_chinese_task',len(r['images']),('已实测；账号范围见对应会话；非全分支' if r['flow_evidence']['live_run_ids'] else '未完成'),' | '.join(r['sources']),' | '.join(i['file'] for i in r['images']),r['caution']])
data=dict(date='2026-09-27',scope='Chinese-native speakers learning English; Chinese-interface screenshots only in main report; Free/Super/Max coverage separately qualified',records=records,modes=modes,
    reading_sections=[dict(id=s['id'],title=s['title'],record_ids=[r['id'] for r in s['records']]) for s in sections],sources=sources,counts=counts,
    live_account_walkthrough=True,live_super_walkthrough=True,live_max_walkthrough=False,live_guest_walkthrough=True,live_capture_manifest='live-flow-evidence.json',exhaustive_current_type_coverage=False,all_types_have_full_chinese_screenshot=False,all_operation_flows_captured=False,flow_data_file='flow-data.json',
    method='Independent Chinese desktop guest and authenticated Super walkthroughs plus original Chinese images and source-specific claims; cross-language reference appendix is excluded from Chinese coverage; design recommendations are analytical inferences')
(R/'report-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
(R/'adopted-images.json').write_text(json.dumps(list(main_images.values()),ensure_ascii=False,indent=2)+'\n')
(R/'README.md').write_text(f'''# 中文用户学英语：Duolingo 题型与界面分析\n\n- 主报告：[report.html](report.html)；本地预览 http://127.0.0.1:59042/report.html 。\n- 完整操作与分支：[FLOW_AUDIT.md](FLOW_AUDIT.md)；逐步骤清单：[flow-coverage.csv](flow-coverage.csv)。\n- 无需听说的题目：[独立章节](report.html#non-audio)。\n- 文字版：[REPORT.md](REPORT.md)；逐项证据：[coverage.csv](coverage.csv)。\n- 其他语言界面：[参考附录](reference-other-native-languages.html)，不计中文覆盖。\n- 离线包：[duolingo-chinese-english-report.zip](duolingo-chinese-english-report.zip)。解压后打开 report.html。\n\n{notice}\n\n研究日期：2026-09-27。累计实测{counts["current_run_product_flow_screenshots"]}张原始截图，{counts["screenshot_flow_groups"]}组流程；{counts["core_wrong_recovery_correct_loop_types"]}类核心闭环；其中此次Super补充186张原图、19组流程。尚非全题型全分支。已有用户历史图4份，官方渠道中文图{counts['official_chinese_image_files']}份，其中课程入口单列。没有生成或重绘界面。文件核验见 verification.json，浏览器核验见 sources/chinese-report-browser-check.json。旧版材料保留在 background-english-all-native/ 与旧离线包，旧版不再代表当前中文范围。业务代码、Git提交、推送及官网发布均未执行。\n''')
print(json.dumps(counts,ensure_ascii=False,indent=2))
