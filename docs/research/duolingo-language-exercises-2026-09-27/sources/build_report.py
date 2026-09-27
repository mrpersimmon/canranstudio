from pathlib import Path
import json, re, html, csv, hashlib
from collections import Counter
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
def read(name): return json.loads((ROOT / name).read_text())
core, advanced, literacy = [read(x) for x in ['taxonomy-core.json','advanced-experiences.json','literacy-and-design.json']]
assets = read('evidence-assets.json')
by_url = {a['url']: a for a in assets if a.get('url')}
by_file = {a['file']: a for a in assets if a.get('file')}
cs = {s['id']:s for s in core['sources']}
ads = {s['id']:s for s in advanced['sources']}
ls = {s['id']:s for s in literacy['sources']}
cm = {m['id']:m for m in core['media']}
am = {m['id']:m for m in advanced['image_evidence']}
lm = {m['id']:m for m in literacy['assets']}
sources = {}
for s in core['sources'] + advanced['sources'] + literacy['sources']:
    sources.setdefault(s['url'],s)

def image_record(url=None, file=None, label='', frame='完整题目视口', note='', source=None):
    a = by_url[url] if url else by_file.get(file,{})
    f = file or a['file']
    p = ROOT / f
    im = Image.open(p)
    width,height = im.size
    src = source or a.get('sourcePage','')
    if src and src not in sources:
        sources[src] = {'url':src,'title':'截图补充来源','published_at':a.get('sourcePublished',''),'modified_at':a.get('sourceModified','')}
    historical = a.get('provenance','').startswith('third-party')
    dates = re.findall(r'/((?:19|20)\d{2})/(\d{2})/',url or a.get('url',''))
    date_label = f'媒体路径 {dates[0][0]}-{dates[0][1]}' if dates else (a.get('sourceVersion') or a.get('sourcePublished') or '拍摄日期未确认')
    date_label = str(date_label)[:130]
    return {'file':f,'url':url or a.get('url',''),'source':src,'label':label,'framing':frame,'note':note,'width':width,'height':height,'historical_thirdparty':historical,'date_label':date_label,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}

def cimage(mid):
    m=cm[mid]
    if '.pdf' in m['url']: return None
    return image_record(m['url'],label=m['description'],note=m.get('limitations',''))

def aimage(mid):
    m=am[mid]
    if mid in ['story_write_old','adventure_demo']: return None
    fr='完整题目视口'
    if 'montage' in m['kind']: fr='官方多屏排版；各手机视口完整'
    if 'entry_only' in m['kind']: fr='完整入口页；不是答题页'
    return image_record(m['original_image_url'],label=m['description_zh'],frame=fr,note=m.get('visible_controls_zh',''))

ui_notes = {
'C01':'词与播放控件位于图卡上方；2×2 图片网格兼有文字标签；顶部进度、底部继续清楚。标签本身也会提供答案线索。',
'C02':'目标词保留在句子语境中，下面排列文字候选；答题区与情境材料分开，能把注意力集中到词义。',
'C03':'两列词块并列，等高的按钮和统一描边让用户寻找跨列关系；选中与匹配结果应易于区分。',
'C04':'图片与母语词给出语义目标；输入区只有待写词，没有整句键入负担；按钮在底部。',
'C05':'冠词是独立按钮，名词进入文本框；同一个词的两种成分以不同控件表达，便于定位错误。',
'C06':'角色气泡呈现原句，横线区域承接答案，候选词块在下方；已使用词块留下位置占位，便于撤回和查找。',
'C07':'大文本框给整句生成留空间；键入与语音输入入口分开。自由输入要保留修改位置，避免反馈时丢失原答案。',
'C08':'原文和部分译文同时可见；已给文本固定，待填位置明确，让用户只处理缺失部分。',
'C09':'句子里的空位与独立候选对应；正确反馈保留完整句义，帮助确认所选词在句中的作用。',
'C10':'场景图位于句子上方；必须从动作或关系理解图意。下面仍用填空和词块，降低新增操作成本。',
'C11':'两个空位放在相邻句中，用户可并置比较；候选词集中在下方，减少来回翻页。',
'C12':'已给词干与可拼接词尾分开；控件在视觉上暗示组合关系，练习粒度精确到词素。',
'C13':'文字输入只对准词尾，保留其余句子；撤去候选支持，但没有增加整句打字负担。',
'C14':'代词与变化形式以表格对应；空格位置表达待补关系，规则不必全靠长段文字解释。',
'C15':'普通速度与慢速两个音频入口；答案横线与候选词分区；没有把完整听力文本直接给出。',
'C16':'音频控件和大文本框构成主体；无词库，保留慢速及无法听音入口；完整顶部和底部操作均可见。',
'C17':'播放控件旁保留已有句子，只空出目标词；常速/慢速可用，降低对整句短时记忆的要求。',
'C18':'候选项用音频控件表达，学习者必须比较声音；截图里不是两个可直接读出的文字答案。',
'C19':'左列是音频波形，右列是书面词；每行面积相近，提示建立一一对应关系。',
'C20':'段落保持可读，理解问题与选项排列在其下；用户需要提取意思，不必逐字翻译。',
'C21':'材料和答项都有播放入口；此例把答案阅读提示也撤去，区别于“听完选文字”。',
'C22':'两个说话者和气泡明确轮次；两项回应放在下方，交互只需点选，重点是对话连贯。',
'C23':'问题气泡下列三个带麦克风的回应；选义与发声结合；保留无法说话入口和检查区。',
'C24':'目标句与麦克风同屏；内容已给定，学习者集中练习发声。不同角色位置不改变核心任务。',
'C25':'两个角色已给出问答；下方麦克风引导复述回应，免去从多种回答中做语义选择。',
'C26':'翻译文本框内或旁边的麦克风把语音转成可编辑文本；仍应核对识别结果，再提交翻译答案。',
'C27':'堆叠卡片突出当前词；底部麦克风、跳过、无法说话入口减少切换；卡组完成后的回顾独立呈现。',
'C28':'大音频按钮与两个近音词相邻；候选少，视觉很简单，难点被集中在声音差异上。',
'C29':'两段音频上下并列，下方只有“同词/不同词”两种关系；不要求先拼出所听单词。',
'C30':'四段音频与四个近音词配对；补充韩文界面的官方全屏图，能看到顶部进度和底部继续。',
}

risks = {
'single_choice':'只证明在给定选项中辨认；还需要无选项提取验证。',
'matching':'配对可能依赖排除法；可用新顺序、延迟复习或单项提取验证。',
'translation':'需区分语言错误、可接受译法和输入失误。',
'cloze':'局部答对不能证明整句可独立生成；提示撤除后应再验收。',
'listening':'要区分听辨、短时记忆和拼写负担；记录是否用过慢速和重播。',
'speaking':'语音识别结果只是一个反馈信号；内容已给出时不能推断自发会话能力。',
'reading':'选项识别与开放复述要求不同；需避免靠单个关键词完成。',
}

records=[]
kind_labels={'atomic_task':'原子任务','composite_variant':'组合变体','context_variant':'情境变体','structural_variant':'结构变体','response_mode_variant':'输入方式变体','content_variant':'内容变体','micro_session':'微练习循环'}
for x in core['exercises']:
    if x['id']=='C31': continue
    n=int(x['id'][1:])
    group=('词汇与翻译' if n<=8 else '语法与句子构建' if n<=14 else '听力与听写' if n<=19 or n==21 else '阅读、对话与口语' if n in [20,22,23,24,25,26] else '主动回忆与声音专项')
    ims=[cimage(m) for m in x['media_ids'] if m not in ['CM01','CM32']]
    ims=[m for m in ims if m]
    src=[cs[i]['url'] for i in x['source_ids']]
    if x['id']=='C01':
        a=next(a for a in assets if a.get('id')=='APPLE-2023')
        ims=[image_record(a['url'],label='Apple 2023 发布的 Duolingo 词义选图界面',frame='官方设备框内完整题页',note='此例给西班牙语词，图片下用英语标签；与母语提示方向属于同一识别任务的方向变体。')]
        src.append(a['sourcePage'])
    if x['id']=='C30':
        a=next(a for a in assets if a.get('id')=='SOUNDS-MATCH-KO')
        ims=[image_record(a['url'],label='韩文界面的英语近音词配对；上下操作区完整')]
        src.append(a['sourcePage'])
    usermap={'C06':'duolingo-dark-translation-word-bank.jpg','C07':'duolingo-dark-translation-free-input.jpg','C08':'duolingo-dark-supported-translation.jpg','C09':'duolingo-dark-cloze-correct-feedback.jpg'}
    if x['id'] in usermap:
        f='assets/'+usermap[x['id']]
        ims.append(image_record(file=f,label='用户此前提供的真实深色界面',frame='用户历史截图；完整设备视口',note='2026-09-06 前后保存；实际拍摄日期、设备和应用版本未确认。'))
    risk=next((v for k,v in risks.items() if k in x['interaction_family']), '单个题面只覆盖一种作答状态；需进一步核验迁移、错误与重试。')
    records.append(dict(id=x['id'],name=x['name'],group=group,kind=kind_labels[x['record_kind']],goal=x['learning_objective'],input=x['prompt_input'],output=x['response_output'],steps=x['user_steps'],ui=ui_notes[x['id']],design=x['design_notes'],caution=risk,availability=x['availability_evidence'],plan=x['subscription_scope'],sources=src,images=ims))

def limg(i):
    m=lm[i]
    return image_record(m['url'],label=m['label'],note=m.get('note',''))
writing_specs=[
('W01','假名按路径描写',['A01'],'建立字形及笔画动作的联系。','观察淡色轮廓与起笔点。|沿蓝色路径描写。|完成后按底部继续。','大书写区、十字参考线、起笔圆点和箭头协同提示方向。','把复杂字形拆成当前一笔，减少初学者同时处理的内容。','只证明有引导的描写，不能等同无提示默写。'),
('W02','根据转写选择假名组合',['A02'],'把罗马音提示映射到假名字形。','阅读转写提示。|比较四个假名组合。|点选后检查并继续。','转写在题干中，四组字符独立成卡；题干实际要求按 shisu 选字。','相近字符成为比较对象，操作者只需选择，难点留给字形辨认。','不能把本图误写成“听音选字”；是否播放需看具体题面。'),
('W03','看假名选择读音',['A03'],'从文字提取读音。','看目标假名。|需要时点音频。|选择读音选项并继续。','大假名音频卡是视觉锚点，三个罗马音选项在下方。','与 W02 的方向相反；检查从字到音的映射。','有音频提示时，答案不能单独证明无提示识读。'),
('W04','补全假名缺失笔画',['A05'],'识别字形中缺少的部分并补写。','观察已有字形和缺口。|沿当前笔画指引绘制。|完成后继续。','保留字形背景，缺笔画的方向用虚线和箭头标记。','缩小生成范围，连接识别与运动产出。','本图是平假名あ，不是汉字题，也不是笔顺排序题。'),
('W05','汉字描写与局部补写',[],'通过逐步减少字形支架练习书写。','阅读词语和目标汉字。|按当前提示描写或补足缺失部件。|观察结果后继续下一题。','字形占据主体；词语中的目标字被突出，描写区有定位线、指引和底部反馈。','保留完整词语使汉字与词义相连；支架量改变所需提取程度。','所附静帧证明引导描写和局部补写；未取得独立“完全无引导整字默写”题屏。'),
('W06','日语汉字部件拼合',['A04'],'理解汉字部件及空间结构。','看目标词和空槽。|选择对应部件，按槽位组合。|完成后继续。','大轮廓槽与部件卡一一对应；蓝色当前槽提示本次放置位置。','把字形分解成可组合单元，避免从整张复杂图中盲目辨认。','图示为日语汉字“画”，不能当作中文或韩文课程证据。'),
('W07','看汉字选择拼音',['A11'],'建立汉字与音节读法的对应。','看汉字。|比较拼音选项。|选择读音并检查。','字符被放大，转写选项集中；选项和目标字不混在一段长句里。','将识读任务与句义理解分开，先建立基本映射。','2020 历史界面；不证明当前所有中文课程保留同版。'),
('W08','汉字与拼音配对',['A12'],'把多个字与各自读音关联。','阅读字符和拼音块。|依次点选对应关系。|配完全部后继续。','字符和拼音混排为短按钮，匹配双方并非严格左右两列。','通过多项对应重复提取；随机位置避免仅记住按钮坐标。','随机化是设计建议，本轮未验证后台排序逻辑。'),
('W09','韩文音节块组装',['A15'],'理解音节由字母部件构成。','观察目标音节及槽位。|选取字母部件组装。|完成后继续。','大音节结构框与小字母候选分离；空间组合本身承载教学信息。','同是拼合，学习对象是韩文音节结构，不能沿用汉字教学解释。','只证明该示例构字操作，未核实所有韩文组合规则的覆盖。'),
('W10','阿拉伯字母描写',['A16'],'练习字母形状及书写动作。','看目标字母与位置形式。|沿引导路径描写。|完成后继续。','大描写区保留起点与方向；字形细节是学习材料，不能任意美术化。','隔离字形学习困难，再将字母放回词中理解。','未实测笔顺、轨迹容差和位置字形判分规则。'),
('W11','按转写选择天城文字母',['A17'],'将转写与天城文字形对应。','阅读 ka 等提示。|比较四个字符。|点选并检查。','真实题面是2×2共四个选项；不能把文章替代文字误读成4×4。','候选数量少，保留足够字形尺度来比较关键笔画。','此图是印地语实例，不代表所有天城文字母练习。'),
]
for id,name,mi,goal,steps,ui,design,caution in writing_specs:
    ims=[limg(m) for m in mi]
    if id=='W05':
        u=lm['A06']['url'];s=ls['S01']['url']
        ims=[image_record(file='assets/frame-kanji-430.png',label='官方动图第430帧：描写任务',frame='官方原始动图静帧；完整题目视口',source=s,note='未裁剪、未重绘；源动图另存。'),image_record(file='assets/frame-30b2a7e5fa-scaffolded_trace_small-523.png',label='官方动图第523帧：局部补写',frame='官方原始动图静帧；完整题目视口',source=s,note='2023 官方日语字符文章中的原动图。')]
        for im in ims: im['url']=u;im['date_label']='2023-09 官方动图'
    if id=='W06':
        ims.append(image_record(file='assets/frame-ff1a8234c0-puzzle_output-1-75.png',label='官方动图第75帧：汉字的部件槽位',frame='官方原始动图静帧；完整题目视口',source=ls['S01']['url']))
        ims[-1]['url']=lm['A07']['url'];ims[-1]['date_label']='2023-09 官方动图'
    src=list(dict.fromkeys([im['source'] for im in ims if im['source']]))
    records.append(dict(id=id,name=name,group='文字系统与识读',kind='文字学习任务/语言变体',goal=goal,input='字形、读音或转写及必要的结构提示。',output='选择、配对、部件组装或手写轨迹。',steps=steps.split('|'),ui=ui,design=design,caution=caution,availability='官方不同年代的课程实例；现行逐端、逐语言方向矩阵未完成实机核验。',plan='来源未标为 Super/Max 独占；不能由此保证全部账号均可见。',sources=src,images=ims))

# 韩文字音任务有完整官方2026实例，不把目录页计作题页。
for id,name,num,goal,ui in [
('W12','韩语听音选词',1,'把听到的韩语词与书面形式对应。','大播放按钮下四个韩语词；每个词含音节块，不能误写成四个单字母。'),
('W13','听音用韩文字块重组',2,'将听到的音串重建为文字序列。','常速/慢速播放，答案位置与韩文字块分区；第三张展示正确反馈。')]:
    matches=[a for a in assets if f'Character-Bingo-{num}.jpg' in a.get('url','')]
    ims=[image_record(matches[0]['url'],label=name+'：官方韩语示例')]
    if id=='W13':ims.append(image_record(next(a for a in assets if 'Character-Bingo-3.jpg' in a.get('url',''))['url'],label='重组完成后的反馈状态'))
    records.append(dict(id=id,name=name,group='文字系统与识读',kind='声音任务的语言/单位变体',goal=goal,input='音频与候选韩语词或音节块。',output='一个词，或一串按顺序排列的音节块。',steps=['播放音频。','选词题点选听到的词；重组题按顺序点选音节块。','检查答案，查看结果后继续。'],ui=ui,design='选词任务连接整词的声音与字形；重组任务将书面输出拆成音节块，改变用户需要处理的单位。',caution='与听辨和 C15 听写的核心操作相通；这里单列语言/单位变体，不计作新的独立机制。',availability='2026 官方听力文章截图，未验证全账号当前覆盖。',plan='课程内文字与听力练习。',sources=[ads['listening']['url']],images=ims))

advanced_ids=[('S01','story_mc'),('S02','story_audio_tiles'),('S03','story_cloze'),('S04','story_free_write'),('R01','radio_words'),('R02','radio_match'),('R03','radio_tf'),('R04','radio_picture'),('A01','adventure_explore'),('A02','adventure_dialogue'),('M01','roleplay'),('M02','lily_call'),('M03','falstaff_call')]
adesign={
'S01':'前文成为理解条件，答案需要与故事信息相符；选择题为叙事插入短检查。',
'S02':'把声音还原嵌入故事轮次，使听音与角色说话情境相连。',
'S03':'保留前后文，要求在语篇约束下补充词语；与普通孤立填空相比，信息跨度更长。',
'S04':'撤去有限候选，让学习者自行组织语言；字数提示把任务规模控制在可完成范围。',
'R01':'从连续音频检索指定词，重点是听觉分段与词形辨认。',
'R02':'音频与释义建立直接联系，配对使短时理解能立即接受检验。',
'R03':'将连续信息压缩为一个真假判断，操作轻，但猜测概率较高。',
'R04':'用图像作答减少拼写负担，让听到的意义映射到场景对象。',
'A01':'语言信息分布在场景里，探索动作给阅读和理解一个需要完成的目的。',
'A02':'回应是否合适要联系人物和任务目标；界面用场景反馈维持行动的连续性。',
'M01':'情境目标为开放回复设定边界；聊天与事后复盘承担不同职责。',
'M02':'通话隐喻把重心转向轮流听说；缺少固定答案，要求在线组织内容。',
'M03':'给初学者更明确的提示、翻译与反馈，使开放口语要求保持可完成。',
}
asteps={
'S01':['阅读或听完当前故事段落。','点选符合前文的答案。','查看反馈，按继续进入下一段。'],
'S02':['播放当前角色的音频。','按听到的顺序点选词块，补成当前句子。','检查可见答案，并按继续推进故事。'],
'S03':['阅读前后文及带空位的句子。','把候选词填入对应空位。','完成后按页面提示继续故事。'],
'S04':['阅读故事后的开放问题。','点输入框，用目标语自行回答；示例提示10–60词。','点检查提交，或使用画面提供的跳过入口。'],
'R01':['听当前电台片段，需要时点播放控件。','从词块中选出题目指定数量。','观察反馈并按后续提示推进；本轮未实测自动提交时序。'],
'R02':['点一个音频选项听声音。','点对应的文字释义，重复配完各组。','根据反馈继续后面的电台内容。'],
'R03':['听节目并阅读当前判断句。','选择勾或叉表达正确/错误。','查看结果并继续节目。'],
'R04':['听节目或当前音频。','点选与内容相关的图片。','依据后续反馈继续；原图没有独立检查按钮。'],
'A01':['从路径进入场景任务，了解当前目标。','在场景中点选可交互的人物或物件，读取对话及线索。','根据任务目标继续探索。'],
'A02':['进入角色对话，阅读或播放其发言。','从底部选项中选择适合当前任务的回应。','观察角色反应并继续行动。'],
'M01':['进入 Roleplay，阅读情境和沟通目标。','在输入区键入回复，或使用图中麦克风输入，再提交。','与角色交替回复。','结束后阅读对话反馈与修改建议。'],
'M02':['点视频节点与呼叫按钮，等待接通。','听 Lily 的问题，在出现的说话控件上启动回答。','根据对话继续回应，可用语言请求重复或放慢。','用通话结束/退出控件结束，再查看后续结果。'],
'M03':['进入 Falstaff 引导通话。','听问题，必要时使用字幕；按提示组织短回答。','利用提供的语言帮助继续对话。','结束时使用底部挂断控件。'],
}
for id,aid in advanced_ids:
    x=next(f for f in advanced['features'] if f['id']==aid)
    ims=[aimage(m) for m in x['image_ids']];ims=[m for m in ims if m]
    av=next(v for v in advanced['availability'] if aid in v['feature_ids'])
    group='Stories 故事' if id.startswith('S') else 'Radio 电台' if id.startswith('R') else 'Adventures 场景任务' if id.startswith('A') else 'Max 开放对话'
    ui=' '.join(x.get('ui_keypoints_zh',[]))
    if id=='S04':ui='顶部退出、进度与能量；自由输入框；示例显示10–60词提示，以及跳过、检查。旧局部图不作本条完整图证据。'
    if id=='R04':ui='主持人场景位于上方；下方有音频波形与两张相关图片候选。原图未显示单独检查按钮，具体自动判定时序未实测。'
    records.append(dict(id=id,name=x['name_zh'],group=group,kind='情境交互' if not id.startswith('M') else '开放对话体验',goal=x['design_goal_zh'],input='当前情境、文字/音频或对话轮次。',output='与当前任务相符的选择或自主表达。',steps=asteps[id],ui=ui,design=adesign[id],caution='流程依据公开说明与截图；未实测本账号的错误、重试和异常状态。',availability=av['platforms']+' '+av['course_limits'],plan=av['tier'],sources=[ads[i]['url'] for i in x['source_ids']],images=ims))

# 历史作者实测仅证明所展示的UI，会员和上线范围不沿用旧文章。
supp=[
('S05','故事补选缺失短语','story-missing','读上下文，选能补进对话的短语。','长条候选承载短语，空缺位保留在角色气泡中。','通过上下文限制选项，减少孤立猜词。'),
('S06','故事句中点选指定词义','story-meaning','读给定释义，在句中点选对应词块。','候选嵌在完整句子里；保留语境。','把词义检索与实际语境连接。'),
('S07','故事选择接下来的内容','story-next','结合前文选择接续内容，查看反馈后继续。','所附是正确反馈态；不据此推定答前已经展示全文。','需要处理语篇连贯，而不仅是孤立词义。'),
('S08','故事结尾词语配对','story-pairs','成对点选对应词语，配完后继续。','短词块混排，复习本故事词汇。','用同一配对操作收束语境中的重点词。')]
for id,name,aid,step,ui,design in supp:
    a=next(a for a in assets if a.get('id')==aid)
    im=image_record(a['url'],label='作者公开的历史实测图',frame='第三方历史完整截图',note='2021 媒体；文章2024更新。未将其范围与付费说明当作现行规则。')
    records.append(dict(id=id,name=name,group='Stories 故事',kind='历史题面补充/情境变体',goal='在故事语境内检索和理解语言。',input='前文及当前句子。',output='短语、词块或配对。',steps=[step],ui=ui,design=design,caution='证明历史作答形式；当前保留情况未逐账号确认。',availability='作者历史实测，2021媒体；2024-03-03文章更新。',plan='当前套餐边界不由此图推断。',sources=[a['sourcePage']],images=[im]))

group_order=['词汇与翻译','语法与句子构建','听力与听写','阅读、对话与口语','主动回忆与声音专项','文字系统与识读','Stories 故事','Radio 电台','Adventures 场景任务','Max 开放对话']
records.sort(key=lambda r:(group_order.index(r['group']),r['id']))

modes=[]
for id,aid in [('P01','practice_tab'),('P02','explain_answer'),('P03','match_madness'),('P04','rapid_review'),('P05','legendary'),('P06','ramp_up')]:
    f=next(f for f in advanced['features'] if f['id']==aid)
    ims=[aimage(m) for m in f['image_ids']];ims=[m for m in ims if m]
    if aid in ['match_madness','rapid_review','ramp_up']:
        a=next(a for a in assets if a.get('id')==aid.replace('_','-'))
        ims.append(image_record(a['url'],label='作者历史实测补图',frame='历史完整入口页' if aid=='ramp_up' else '历史完整题目视口',note='仅作历史操作结构证据。'))
    modes.append(dict(id=id,name=f['name_zh'],kind=f['kind'],steps=f['steps_zh'],goal=f['design_goal_zh'],ui=' '.join(f.get('ui_keypoints_zh',[])),images=ims,sources=[ads[i]['url'] for i in f['source_ids']],note='该条是容器或反馈层，不计作新的语言原子题型。'+('只有入口图，缺当前完整答题过程图。' if aid in ['legendary','ramp_up'] else '')))

history=[]
for name,aid,desc in [('旧故事角色跟读','story-speaking-old','在角色轮次中点麦克风复述；当前保留情况未确认。'),('旧故事隐藏文本听读','story-listening-old','先听隐藏文本，必要时点揭示；属于减少文字提示的模式。')]:
    a=next(a for a in assets if a.get('id')==aid)
    history.append(dict(name=name,description=desc,image=image_record(a['url'],label=name,frame='第三方历史完整截图',note='2021媒体，仅用于历史设计比较。')))

used={im['file']:im for r in records+modes for im in r['images']}
used.update({x['image']['file']:x['image'] for x in history})

def esc(s):return html.escape(str(s))
def links(urls):return ' · '.join(f'<a href="{esc(u)}" target="_blank" rel="noopener">来源 {i+1}</a>' for i,u in enumerate(dict.fromkeys(urls)))
def fig(im):
    tag='历史作者实测' if im['historical_thirdparty'] else '用户提供' if not im['url'] else '官方发布'
    return f'''<figure class="{'wide' if im['width']/im['height']>1.05 else ''}"><a href="{esc(im['file'])}" target="_blank"><img src="{esc(im['file'])}" alt="{esc(im['label'])}" loading="lazy" width="{im['width']}" height="{im['height']}"></a><figcaption><strong>{esc(im['label'])}</strong><br>{esc(tag)} · {esc(im['framing'])}<br>{esc(im['date_label'])} · 原图 {im['width']}×{im['height']}<br>{esc(im['note'])}<span class="img-links"><a href="{esc(im['file'])}" target="_blank">查看完整原图</a>{(' · <a href="'+esc(im['url'])+'" target="_blank" rel="noopener">源媒体</a>') if im['url'] else ''}{(' · <a href="'+esc(im['source'])+'" target="_blank" rel="noopener">来源页面</a>') if im['source'] else ''}</span></figcaption></figure>'''

import subprocess
def mdhtml(s):
    node='/Users/permission/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
    code="import { marked } from 'file:///Users/permission/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js'; let data=''; for await (const chunk of process.stdin) data+=chunk; process.stdout.write(marked.parse(data));"
    return subprocess.run([node,'--input-type=module','-e',code],input=s,text=True,capture_output=True,check=True).stdout
intro=(ROOT/'sources/editorial.md').read_text()
ending=(ROOT/'sources/synthesis.md').read_text()

toc_rows=''.join(f'<tr><td><a href="#{r["id"]}">{r["id"]}</a></td><td><a href="#{r["id"]}">{esc(r["name"])}</a></td><td>{esc(r["kind"])}</td><td>{len(r["images"])}幅</td><td>{"历史作者实测" if r["id"] in ["S05","S06","S07","S08"] else "完整题页/官方全屏排版"}</td></tr>' for r in records)
sections=[]
for g in group_order:
    body=f'<section class="family" id="group-{group_order.index(g)}"><h2>{esc(g)}</h2>'
    for r in [r for r in records if r['group']==g]:
        steps=''.join('<li>'+esc(s)+'</li>' for s in r['steps'])
        body+=f'''<article class="exercise" id="{r['id']}"><div class="exercise-heading"><span class="number">{r['id']}</span><div><p class="eyebrow">{esc(r['kind'])}</p><h3>{esc(r['name'])}</h3></div></div><div class="analysis"><p><b>训练什么</b> {esc(r['goal'])}</p><p><b>输入 → 输出</b> {esc(r['input'])} → {esc(r['output'])}</p><h4>用户如何操作</h4><ol>{steps}</ol><p><b>画面与控件</b> {esc(r['ui'])}</p><p><b>设计解读</b> {esc(r['design'])}</p><p class="limit"><b>不能由此推出</b> {esc(r['caution'])}</p><details><summary>平台、课程和套餐边界</summary><p>{esc(r['availability'])}</p><p>{esc(r['plan'])}</p></details><p class="sources-inline">{links(r['sources'])}</p></div><div class="screens">{''.join(fig(im) for im in r['images'])}</div></article>'''
    sections.append(body+'</section>')

modehtml='<section id="modes"><h2>5. 练习容器、限时模式与反馈层</h2><p>它们改变题目如何组合、反馈或使用，不自动构成新的语言题型。入口和实际作答图分开标注。</p>'
for m in modes:
    modehtml+=f'<article class="exercise" id="{m["id"]}"><h3>{m["id"]} · {esc(m["name"])}</h3><p>{esc(m["goal"])}</p><p><b>操作：</b>{esc(" ".join(m["steps"]))}</p><p><b>界面：</b>{esc(m["ui"])}</p><p class="limit">{esc(m["note"])}</p><p>{links(m["sources"])}</p><div class="screens">'+''.join(fig(im) for im in m['images'])+'</div></article>'
modehtml+='<h3>历史模式补充</h3>'
for h in history:modehtml+='<details class="history"><summary>'+esc(h['name'])+'</summary><p>'+esc(h['description'])+'</p><div class="screens">'+fig(h['image'])+'</div></details>'
modehtml+='</section>'

sourcehtml='<section id="sources"><h2>10. 来源与可追溯记录</h2><p>来源检索日均为2026-09-27。媒体拍摄日期和全量上线日期未必与文章日期相同。原始研究分册和完整媒体索引保存在同一目录。</p><ol>'
for u,s in sources.items():
    title=s.get('title') or u.rstrip('/').split('/')[-1]
    pub=s.get('published_at') or s.get('published') or '未确认'
    mod=s.get('modified_at') or s.get('modified_metadata') or '未确认'
    sourcehtml+=f'<li><a href="{esc(u)}" target="_blank" rel="noopener">{esc(title)}</a><small>发表 {esc(str(pub)[:10])} · 修改 {esc(str(mod)[:10])}</small></li>'
sourcehtml+='</ol></section>'

css='''
:root{--paper:#fbfaf6;--ink:#17251f;--muted:#617068;--line:#d7dfd5;--accent:#21663e;--soft:#edf3e8;--warn:#83561c}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:80px}body{margin:0;color:var(--ink);background:var(--paper);font:17px/1.8 system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif}a{color:#24664a;text-underline-offset:3px}main{max-width:1180px;margin:auto;padding:42px 48px 90px}header{background:#172f24;color:white;padding:52px max(24px,calc((100vw - 1084px)/2));}header h1{font-size:clamp(30px,4.2vw,54px);line-height:1.2;margin:14px 0;max-width:880px}header p{color:#d5e6d3;max-width:780px}header .kicker{letter-spacing:.13em;font-size:13px}.stats{display:flex;gap:28px;flex-wrap:wrap;margin-top:26px}.stats b{font-size:32px;color:#c4ed96}.stats span{display:block;font-size:13px}nav{position:sticky;top:0;z-index:4;background:#fbfaf6f5;backdrop-filter:blur(12px);border-bottom:1px solid var(--line);padding:12px 24px;display:flex;gap:22px;overflow-x:auto;white-space:nowrap;font-size:14px}h1,h2,h3,h4{line-height:1.45;letter-spacing:-.02em}h2{font-size:29px;margin:64px 0 22px;padding-top:16px;border-top:2px solid var(--ink)}h3{font-size:24px;margin:8px 0 18px}h4{font-size:17px;margin:22px 0 8px}p{margin:14px 0}li{margin:7px 0}table{width:100%;border-collapse:collapse;font-size:15px;margin:24px 0}th,td{padding:13px 14px;vertical-align:top;text-align:left;border-bottom:1px solid var(--line)}th{background:var(--soft);font-weight:650}tr:nth-child(even) td{background:#f4f5ef}td:first-child{white-space:nowrap}.table-scroll{overflow:auto}details{margin:18px 0;border:1px solid var(--line);border-radius:10px;padding:12px 18px}summary{cursor:pointer;font-weight:650}.exercise{margin:28px 0 56px;border:1px solid var(--line);border-radius:16px;background:white;padding:32px}.exercise-heading{display:flex;align-items:flex-start;gap:18px}.number{font-size:16px;font-weight:750;background:var(--ink);color:#e5f8c7;min-width:56px;text-align:center;padding:10px;border-radius:9px}.eyebrow{font-size:13px;color:var(--muted);margin:0}.analysis{max-width:920px}.limit{background:#fbf4e8;border-left:3px solid #d4a868;padding:12px 16px;color:#654c2b;font-size:15px}.sources-inline{font-size:14px}.screens{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;margin-top:26px;padding-top:26px;border-top:1px solid var(--line)}figure{margin:0;flex:0 1 310px;max-width:100%;min-width:0}figure.wide{flex-basis:100%}figure>a{display:block;background:#f6f7f3;border:1px solid #e3e8df;border-radius:9px;padding:10px;text-align:center}figure img{width:auto;max-width:100%;height:auto;max-height:740px;object-fit:contain;display:block;margin:auto}figure.wide img{max-height:none;width:100%}figcaption{font-size:12px;line-height:1.7;color:var(--muted);padding:12px 3px;overflow-wrap:anywhere}figcaption strong{color:#354b3e}.img-links{display:block;margin-top:6px}#sources{font-size:14px}#sources small{display:block;color:var(--muted)}.notice{background:var(--soft);border-radius:12px;padding:20px 24px}.tools{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0 28px}.tools a{border:1px solid var(--line);border-radius:7px;padding:6px 12px;text-decoration:none;font-size:14px}.top-link{position:fixed;right:20px;bottom:20px;background:var(--ink);color:white;border-radius:99px;padding:10px 17px;font-size:13px;text-decoration:none}footer{border-top:1px solid var(--line);padding-top:24px;font-size:13px;color:var(--muted)}@media(max-width:700px){main{padding:24px 18px 60px}header{padding:32px 22px}h2{font-size:24px}.exercise{padding:20px 16px}h3{font-size:21px}.screens{justify-content:center}figure{flex-basis:100%}figure img{max-height:800px}table{font-size:13px}th,td{padding:8px}td:first-child{white-space:normal}nav{gap:18px}.top-link{right:10px;bottom:10px}}@media print{nav,.top-link,.tools{display:none}header{background:white;color:black;padding:0}header p{color:black}body{font-size:11pt;background:white}main{padding:0;max-width:none}.exercise{break-inside:auto;padding:12px;border-color:#bbb}.exercise-heading{break-after:avoid}figure{break-inside:avoid;flex-basis:240px}figure img{max-height:520px}h2{break-before:page}a{color:inherit}.stats b{color:black}details>*{display:block}summary{list-style:none}}
'''
total=len(records)
html_doc=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Duolingo语言学习题型、真实完整界面、操作与设计原理的可追溯研究报告"><title>Duolingo 语言学习题型与界面设计研究</title><style>{css}</style></head><body id="top"><header><div class="kicker">CANRAN STUDIO · PRODUCT RESEARCH · 2026.09.27</div><h1>Duolingo 语言学习<br>题型与界面设计研究</h1><p>从学习任务出发，逐项分析输入、操作、反馈和支架。原始截图与判断依据并列，便于设计讨论与后续复核。</p><div class="stats"><div><b>{total}</b><span>题型与变体分析条目</span></div><div><b>{len(used)}</b><span>报告采用的独立图像文件</span></div><div><b>{len(modes)}</b><span>容器与反馈模式</span></div><div><b>3</b><span>免费 · Super · Max</span></div></div></header><nav><a href="#overview">研究结论</a><a href="#index">题型索引</a><a href="#group-5">文字系统</a><a href="#group-6">Stories</a><a href="#group-9">Max 对话</a><a href="#modes">模式与反馈</a><a href="#synthesis">设计结论与缺口</a><a href="#sources">来源</a></nav><main><div class="tools"><a href="REPORT.md">Markdown 报告</a><a href="coverage.csv">覆盖清单</a><a href="report-data.json">结构化研究</a><a href="evidence-assets.json">原图证据索引</a></div><section id="overview">{mdhtml(intro)}</section><div class="notice"><b>截图覆盖的准确含义：</b>主体{total}个条目均有完整题目视口或完整手机视口的官方多屏图；其中包含历史图片和原始动图静帧。它们不是{total}种互不重叠的内部题型，也不是所有现行课程已经实测的证明。目录页、未核实项目和只取得入口图的模式另列，不混入完整题页统计。</div><section id="index"><h2>题型索引</h2><p>点击编号可跳到操作、设计分析和完整截图。每幅图可点开原尺寸。</p><div class="table-scroll"><table><thead><tr><th>编号</th><th>题型 / 变体</th><th>分类</th><th>配图</th><th>证据边界</th></tr></thead><tbody>{toc_rows}</tbody></table></div></section>{''.join(sections)}{modehtml}<section id="synthesis">{mdhtml(ending)}</section>{sourcehtml}<footer>本报告用于产品与教学设计研究。Duolingo 界面、插画及品牌归其权利人所有。保存的是研究来源原图；不包含重绘、生成式补图或冒充实机的 UI。图中词句仅为界面证据，未作为可直接复制到儿童课程的题库验收。</footer></main><a class="top-link" href="#top">返回顶部 ↑</a></body></html>'''
(ROOT/'report.html').write_text(html_doc)

md=[intro,'\n## 题型索引\n','| 编号 | 题型/变体 | 分类 | 图片数量 |\n| --- | --- | --- | --- |']
for r in records:md.append(f'| {r["id"]} | {r["name"]} | {r["kind"]} | {len(r["images"])} |')
def md_images(images):
    out=[]
    for im in images:
        out+=['',f'![{im["label"]}]({ROOT/im["file"]})','',f'图证：{im["framing"]}；{im["date_label"]}；{im["width"]}×{im["height"]}。{im["note"]}']
        if im['source']:out.append(f'[来源页面]({im["source"]})'+(f' · [原始媒体]({im["url"]})' if im['url'] else ''))
    return out
for g in group_order:
    md+=['',f'## {g}','']
    for r in [r for r in records if r['group']==g]:
        md+=['',f'### {r["id"]} · {r["name"]}','',f'分类：{r["kind"]}。',f'训练目标：{r["goal"]}',f'输入 → 输出：{r["input"]} → {r["output"]}','', '**用户操作**','']
        md += [f'{i}. {s}' for i,s in enumerate(r['steps'],1)]
        md += ['',f'**界面关键点：** {r["ui"]}',f'**设计解读：** {r["design"]}',f'**推断边界：** {r["caution"]}',f'**平台/课程：** {r["availability"]}',f'**套餐：** {r["plan"]}',' · '.join(f'[来源{i+1}]({u})' for i,u in enumerate(r['sources']))]+md_images(r['images'])
md+=['','## 5. 容器、模式与反馈层','']
for m in modes:
    md+=['',f'### {m["id"]} · {m["name"]}','',m['goal'],'操作：'+' '.join(m['steps']),'界面：'+m['ui'],'边界：'+m['note']]+md_images(m['images'])
md+=['','### 历史模式补充','']
for h in history:md+=['',h['name']+'：'+h['description']]+md_images([h['image']])
md+=['',ending,'','## 10. 来源目录','']
for u,s in sources.items():md.append(f'- [{s.get("title") or u.rstrip("/").split("/")[-1]}]({u})')
(ROOT/'REPORT.md').write_text('\n'.join(md)+'\n')

with (ROOT/'coverage.csv').open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.writer(f);w.writerow(['编号','题型','分类','章节','完整界面图数','本轮实机验证','来源','证据边界','图片文件'])
    for r in records:w.writerow([r['id'],r['name'],r['kind'],r['group'],len(r['images']),'未完成',' | '.join(r['sources']),r['availability'],' | '.join(im['file'] for im in r['images'])])
    for m in modes:w.writerow([m['id'],m['name'],'模式/容器','练习与反馈',len(m['images']),'未完成',' | '.join(m['sources']),m['note'],' | '.join(im['file'] for im in m['images'])])
data=dict(date='2026-09-27',scope='language learning only; Free, Super, Max',records=records,modes=modes,historical_modes=history,sources=list(sources.values()),counts=dict(catalogue_entries=len(records),modes=len(modes),unique_displayed_image_files=len(used),source_pages=len(sources)),live_account_walkthrough=False,method='official sources and visually inspected published screenshots; explicit historical author screenshots and exact decoded animation frames; no generated UI')
(ROOT/'report-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
(ROOT/'adopted-images.json').write_text(json.dumps(list(used.values()),ensure_ascii=False,indent=2))
print(json.dumps(data['counts'],ensure_ascii=False))
