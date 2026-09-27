"""Chinese-native analysis from the authenticated Super walkthroughs."""
from copy import deepcopy

UPDATES = {
 'E05':dict(name='中译英：用英语词块组织译文', sample=417,
    goal='把中文意义转成英语语序，并选择必要的功能词。',input='她跟她的男朋友一起去过巴黎。与英语词库。',output='She has been to Paris with her boyfriend.',
    steps=['读中文，按需悬停去过查看英语提示；点击词块逐个构句。','已选词可撤回；移除中间的has后剩余词前移，清空后检查禁用。','切到键盘可独立编辑文字；切回词库保留原词块草稿，候选位置可能变化。','漏to的答案提交后被拒绝，纠错突出to，原草稿锁定；继续到下一题。','后段原题重现，词库清空并重新排列；逐词补全正确译文，提交通过后继续。'],
    ui='中文在角色气泡中，英语答案与词库分区，底部切换输入和检查。部分答案就可提交；错误反馈把缺失的to突出，而不是重排学习者原答案。',
    design='给出单词解决了拼写提取，把主要难点留给英语结构。在中文“去过巴黎”到英语been to Paris的转换中，功能词to是值得单独检验的知识，不只是点击完整度。',
    extra_load='中文词汇顺序不能机械映射英语；撤回、切换输入与候选重新排列也带来操作负担。两份草稿独立保存，用户必须确认当前模式的内容。',
    feedback_recommendation='保留原漏词答案，同时标清补在哪；如用于儿童课程，可增加短句中文解释been to与去过的对应，再用新地点检验迁移。',
    caution='F26取得同题错误到正确闭环。不同模式的草稿保持、撤回中间词和清空都已拍到；键盘模式没有提交本题，不能混作键入正确证据。旧宣传图仅为其他版本参考。'),
 'E06':dict(name='中译英：键入完整英语句子', sample=445,
    goal='从中文意义自主提取词汇、组织英语结构并写出句子。',input='他们在英国待了三年了。；另例：他一直都想要做一个医生。',output='They have stayed in the UK for three years.；另一题含doctor。',
    steps=['切换键盘后键入英语，部分文字即可启用检查。','可清空、改写草稿；取消退出后同一草稿仍能提交。','把三年误写为ten years会被判错；正确答案突出three，原答案仍可对照。','后段同题再次出现，输入three years的译文被接受，继续到下一题。','另一独立题提交docter拼写差异，界面绿色通过，同时提示有错别字并给出doctor。'],
    ui='大输入框承担自由书写，中文原句始终位于上方。绿色结果不总等于完全无错误：拼写容错例同样绿色，但附纠错文字。',
    design='正确性至少包含意义和书写形式两层：ten→three改变中文所表达的量，docter→doctor是本例被容忍的字形偏差。这两个真实实例支持分层解释，但不足以推断后台评分算法。',
    extra_load='输入法、光标、拼写和句法共同影响结果。docter例同时含小写开头及无句号，不能分别证明所有大小写、标点规则。',
    feedback_recommendation='把改变句意的错误与允许通过的轻微书写差异区别展示；保存原句、原答、修正片段。自然替代表达需要专门答案验证，不能只按唯一字符串匹配。',
    caution='F27是英国三年题同题闭环，F29是独立的拼写容错例。未验证移动端键盘、中间选区、全部替代译文或拼写容错阈值。'),
 'E07':dict(name='完成翻译：缺词与整句难度切换', sample=451,
    goal='在给定句式中提取缺失英语成分，并允许主动撤去句式帮助。',input='妈妈一直都这么漂亮。；Mom has always been ____ beautiful.',output='空位填so；加大难度时可写整句。',
    steps=['点空位输入，s一个字母已能启用检查；可继续输入o或清空。','加大难度切为完整英语翻译，减少难度回到短空位。','整句模式的Mom has always与空位模式分别保留草稿，切换不会自动转换。','cold提交被拒绝，反馈给出含so的完整句子。','后段原题出现，填so被接受，继续进入结算。'],
    ui='相同中文气泡下，局部可编辑空位与整框输入交替出现；底部加大难度/减少难度对应变化。判错后仍保留cold，使固定句式与错误填入内容可对照。',
    design='难度调整直接改变学习者必须提取的信息量：补一个词与自行生成整句是不同任务。操作位置近似但能力要求增加，不能把两个完成率直接等同。',
    extra_load='学习者要识别可编辑范围；切换到另一模式后见到旧草稿也可能误以为答案丢失或被替换。',
    feedback_recommendation='明确说明整句模式撤去了哪些提示，继续保留原来的局部练习；学习记录同时保存难度模式和所用帮助。',
    caution='F28完成缺词同题闭环及两种难度的草稿切换。整句模式只写到部分草稿，没有提交，不算完整英语生成成功。'),
 'E14':dict(name='听英语内容，选择对应中文解释', sample=411,
    goal='理解英语声音所表达的情境，而不是逐字拼写。',input='先听后答；他们在…；三项关于John的中文解释。',output='本题看John的护照被判正确。',
    steps=['按题意听材料，普通/慢速按钮可见；本轮未听验音轨。','选帮John找工作形成草稿，再改选看John的护照。','点击检查，第二项显示绿色正确；继续进入另一道听写。'],
    ui='声音入口与中文句干、竖排中文选项分区；选择为蓝色，判分为绿色，正确后的继续与提交前检查占据同一主操作位置。',
    design='用中文候选降低英语输出负担，把测量重点放到声音理解。能够选出意义不等于能复述或写出所听英语。',
    extra_load='还需要中文阅读与对候选的比较。仅凭猜选后正确，不能当作已验证听力能力。',
    feedback_recommendation='围绕具体误解设置干扰项；解释听到的证据，而不只给绿色勾。若允许课后回看，可将英语原句与中文解释联系起来。',
    caution='F25有初始、选择、改选、正确及下一题；第一项未提交，不能称为错误分支已实测。原题重练、音质和慢速效果未验证。'),
 'S01':dict(name='故事阅读理解：字面意义、意图与总结', sample=307,
    goal='理解连续英语情节，用中文判断人物说了什么、想表达什么及发生了什么。',input='Taxi Ride的英文叙述和对话；三道中文理解题。',output='选择与上下文一致的中文解释。',
    steps=['逐段点继续阅读英语，可悬停词语查看中文意义。','题目插入当前故事页，点击中文候选即判定，无检查按钮。','错项短暂红色后变灰禁用，继续仍禁用，可直接选另一项。','正确项变绿后点继续，题目收起，新增后续台词。'],
    ui='英语叙述与角色气泡沿纵向保留；中文问题紧接上下文，三项中文候选与底部继续分开。首题两次错误后原位正确；另两题分别检查付钱那句话的意图和手机导航结局。',
    design='中文减少答题表达成本，英语理解仍承担学习目标。字面复述、话语意图和情节总结是不同层次，不能用“故事选择题”一个名称抹平。',
    extra_load='要跨句保持人物、指代和因果。重复排除到最后一项可以完成任务，因此最后答对不能证明第一次就理解。',
    feedback_recommendation='保留相关上下文，为错项指出不一致的线索；按字面、推断、总结分别记录表现，避免只计故事完成。',
    caution='F18首题为完整同题错答闭环，另两题分别列明。该阅读题可用可见文字完成，归无需听说；但整篇故事还穿插听音任务，不能把整节故事归无听力。'),
 'S02':dict(name='故事词义定位：按中文意义点英语片段', sample=313,
    goal='把中文意义定位到当前英语句子的具体词组。',input='导航指示；The directions on my phone say that road is faster…',output='选择The directions。',
    steps=['读中文意义，比较原句中几个可点击的英语片段。','点road立即错误，稳定后该片段禁用；继续不可用。','改点The directions正确，所有片段锁定。','可打开退出再取消，原正确选择保留；继续后进入下一句。'],
    ui='答案就在原句里，按钮化片段保留语境；不可点击的连接文字与候选分布在同一行。',
    design='比脱离语境的双列表配对更强调在句中定位含义；词组粒度提醒中文意义未必对应单个英语词。',
    extra_load='要同时辨认片段边界和词义；能选中词组不等于能主动写出或口说它。',
    feedback_recommendation='让词组边界清楚，把错误词的实际意义作为可查看提示；退出取消应保留已完成状态。',
    caution='F19同题错误、正确、退出取消及继续都有原图；未验证确认退出后重进、重复点击或所有候选。'),
 'S04':dict(name='故事短语补全：带回放的缺句选择', sample=328,
    goal='在情境与声音线索下补全对话中的缺失片段；两种线索的贡献待核。',input='No, ____ . Why?；三项英语短语，旁有回放。',output="I'm going shopping。",
    steps=['读情境与不完整句子，按需回放。','点I\'m good at stopping立即错误，随后候选变灰。','点I\'m going shopping正确，缺口补成完整句子，继续启用。','点继续实际进入司机解释河边情节。'],
    ui='隐藏片段与三个英语候选同屏；正确后完整台词才显示，候选依判定变红/灰/绿。',
    design='给定短语减少自行生成要求；选项既含意义差异，也含发音相近的词组，可能同时考查声音和情境。这里只能从画面分析这两类可能，不把未听音的判断写成事实。',
    extra_load='学习者需明确是找听到的内容还是仅找情境合理回答；中文指令“选择短语”本身未完全说明线索权重。',
    feedback_recommendation='题意应明确声音与情境的使用要求，错误后给出可对照的目标片段与整句。',
    caution='F20有同题错答核心闭环；没有音轨，严格的无听力独立完成能力未验证，因此本条置于听说相关，不混入无需听说组。'),
 'S05':dict(name='故事听音重组：逐片段接受正确前缀', sample=334,
    goal='把所听句子按正确顺序重组为英语片段序列。',input='隐藏文字的对话气泡与are wrong / directions / I think my。',output='I think my directions are wrong.',
    steps=['点击一个片段，它立即接受或拒绝，无检查按钮。','首位误点are wrong短暂红色，不插入答案，随后恢复可选。','选择I think my后气泡揭晓正确前缀；再错点are wrong时前缀仍保留。','继续选择directions和are wrong，整句完成自动绿色反馈，再点继续读后文。'],
    ui='已接受前缀逐步出现，已用按钮禁用；错选不破坏已完成部分。错误片段恢复可选，因为它可能适合句子后面的正确位置。',
    design='校验单位是当前位置的一块，形成逐步帮助；普通听写词库则先允许构句再判整句。这种帮助能减少挫败，但也降低了独立复述整个句子的要求。',
    extra_load='要保留声音的顺序并定位片段。每步试错也能完成，不能用最终拼齐判断完整听辨能力。',
    feedback_recommendation='学习记录应保留各位置错误和已接受前缀；若要测独立能力，后续应撤去逐片段即时反馈。',
    caution='F21同题从两次错误到正确和继续已拍到；没有验证原音轨、播放质量或退出恢复。与E13不混用操作规则。'),
 'R01':dict(name='Radio：找出听到的两个英语单词', sample=523,
    goal='在英语话语中识别目标词形，不要求拼写整句。',input='选择你听到的2个单词；class / favorite / boring。',output='逐次找出class与favorite。',
    steps=['点击一个词即判定；boring错误后变灰禁用。','点击class立即绿色正确，但一个词不足以完成任务。','点击favorite正确后，问题自动收起并继续节目。'],
    ui='短语指令明确数量；三个英语词按钮横向排布。已对项保持绿色，错误项变灰；没有统一检查或继续按钮。',
    design='把长话语里的局部词形提出来，降低整段理解和输出压力。这里不是先多选后提交，而是逐词获得反馈并累积满足数量。',
    extra_load='需要记住声音中的词，随后比较拼写；错误候选一旦排除，剩余答案容易推出。',
    feedback_recommendation='把首次识别与试错完成分开；给后续整句上下文，防止只抓单词忽略意义。',
    caution='F33同题错误、一个正确、两个正确及自动推进已拍到。未听验音轨；没有可提交第三项的稳定界面，不能编造多选上限提示。'),
 'R02':dict(name='Radio：英语声音配中文释义', sample=502,
    goal='把英语声音连到中文意义，随后核对英语拼写。',input='四个声音与年、学校、图片、法语。',output='year / French / pictures / school分别配到中文。',
    steps=['可先点声音也可先点中文，再点另一侧。','错配短暂标红后恢复，已经配对的项目保留。','正确时变绿并揭晓英文拼写，然后变浅禁用。','四对完成后自动恢复节目播放，无需检查或继续。'],
    ui='主画面是莉莉演播室；配对位于底部两列，每列四项。英语拼写作答前隐藏、正确后才出现。',
    design='先声音、再意义、后拼写构成分阶段关联；若只看正确截图，会误以为作答前就给了英文词形。自动恢复播放把词汇任务嵌回节目时间线。',
    extra_load='声音与候选位置需要短时记忆；完成项逐渐减少也增加排除策略的帮助。',
    feedback_recommendation='保留错误后重听入口；课后结合整段台词回看声音、意义与拼写之间的关系。',
    caution='F31完成同题错误恢复到全部正确并自动播放。通过试错采集，不代表听力表现；无限红心仅属于本次Super会话。'),
 'R03':dict(name='Radio：判断中文陈述与英语内容是否一致', sample=518,
    goal='比较听到的英语内容和中文陈述，判断语义一致性。',input='她去年在学校学习了西班牙语。与一段英语声音。',output='点叉，表示该陈述不符合声音内容。',
    steps=['看到中文陈述，英语句子暂时隐藏；勾/叉两项可选。','点勾立即判错，揭示I learned French at school last year.。','错误项禁用，点叉变绿，随后自动继续节目。'],
    ui='勾和叉表示回答“对/不对”，红绿表示回答是否正确；绿色的叉是正确答案，不是系统错误。',
    design='语义判断减少自由输出，中文陈述使错在French/西班牙语这一细节更容易核对。揭晓英语在答错之后发生，属于纠错帮助。',
    extra_load='要区分题目真伪与回答正确性；二选一经过排除即可通过，最终完成不能证明首次理解。',
    feedback_recommendation='图标配合明确文字说明，避免儿童把叉等同于自己答错；纠错应把冲突的信息对应展示。',
    caution='F32同题错误、揭晓、正确、自动推进已记录。原音轨未保存，不做声音质量或学习能力判断。'),
 'R05':dict(name='Radio：中文选项核对节目内容', sample=529,
    goal='理解节目中的意思，再选与其一致的中文概括。',input='她喜欢学习；关于新地方 / 关于旧地方。',output='关于新地方。',
    steps=['回忆前文声音，点击中文候选即时判定。','关于旧地方变红后变灰禁用。','关于新地方绿色正确，自动进入节目收尾及结算。'],
    ui='节目主画面保持；下方中文短题干和竖向两个候选。这个题屏没有全文英语，也没有检查按钮。',
    design='相比R01抓词，本题要求理解new places所指的意义；中文输出减少英语产出负担，仍依赖此前声音材料。',
    extra_load='要记住刚才的节目并理解中文概括，文字候选本身不能替代英语输入。',
    feedback_recommendation='将课后文本作为回顾工具，标注答案对应哪句英语；不要因为答案用中文就把它记成纯阅读任务。',
    caution='F34记录本题完整错误到正确并自动收尾。它是内容选择变体，不是仍未遇到的R04图像选择；单独编号仅用于研究检索。'),
}

def apply_super_updates(records, live):
    byid = {r['id']: r for r in records}
    shots = {int(s['id'].rsplit('-',1)[1]): s for s in live['shots']}
    for key, value in UPDATES.items():
        if key not in byid:
            record = dict(id=key,kind='情境中的任务变体',group='故事阅读' if key[0]=='S' else '电台听力',
                images=[],sources=[],modality_section='listening-speaking',modality_label='听力与口语相关',
                modality_note='需要声音材料，或声音依赖尚待完整核实；不要求开口作答。')
            records.append(record); byid[key]=record
        record=byid[key]; update=deepcopy(value); sample=update.pop('sample')
        record.update(update)
        record['images']=[deepcopy(shots[sample])]+record['images']
        record.update(evidence_level='full_chinese_task',status='完整中文题页 · Super账号实测',
            ui_basis='本轮中文网页实测事实',ability_limit=record['caution'],
            availability='2026-09-27 中文→英语桌面网页版；'+shots[sample]['course']+'中实际出现。',
            plan='本次用户自行登录Super账号后实测；只证明该账号可进入，不证明题型为Super独占。未购买、升级或核实Max权益。',
            sources=list(dict.fromkeys([shots[sample]['source']]+record.get('sources',[]))),
            analysis_source='live-flow-evidence.json；会话C/D/E逐步原图；设计解读为研究分析')
    for key in ('S01','S02'):
        byid[key].update(modality_section='non-audio',modality_label='不含口语和听力',modality_note='本题英语上下文与中文问题均可见，通过阅读点选可完成；不代表整篇故事没有听力。')
    byid['S04']['modality_note']='有音频回放、作答前缺句隐藏；未验证脱离声音能否独立完成，暂不计严格无需听力。'
    byid['S05']['modality_note']='中文明确要求重组听到的句子；用点击作答，不要求口说。'
    byid['R05']['modality_note']='根据此前节目声音选择中文含义；不是纯文字阅读题，不要求开口。'
    byid['S03']['caution'] += ' 本次Taxi Ride重读已走到结算，但没有出现开放写作；不能从这一篇推断所有故事或等级。'
    # Keep the earlier guest examples, then append the account-specific variation.
    byid['E01']['caution'] += ' 新增F22：Super故事末尾有五对中英短语，错误原位恢复、正确后锁定，全部配完自动继续；本页无限红心，不沿用访客扣心结论。'
    byid['E01']['images'].insert(1,deepcopy(shots[346]))
    byid['E04']['caution'] += ' 新增F24为Super单元复习的两句较长英译中正确路径，明确分别记录，不与访客原题混接。'
    byid['E04']['images'].insert(1,deepcopy(shots[404]))
    byid['E13']['caution'] += ' 新增F23：Super复习已实际提交词库错误，纠错目标为in the same place；没有同音同题正确重练。此前“未提交词库”只限F06访客题。'
    byid['E13']['images'].insert(1,deepcopy(shots[401]))
    byid['E01']['ui']='访客F07的四对实例：'+byid['E01']['ui']+' Super故事F22为五对词语/短语，并显示无限红心。'
    byid['E13']['steps'].append('补充Super的F23：选择how are you并在词库模式检查，实际红色纠错为in the same place；继续进入英译中。')
    byid['E13']['ui']+=' Super复习F23另有词块实际提交错误，原词块锁定，底部给正确英语与中文意义。'
    for key in ('E01','E04','E13'):
        byid[key]['availability'] += ' 此次另有登录Super的会话C/D补充，详情见对应连续流程。'
        byid[key]['plan'] = '同时有A/B免费访客与C/D登录Super的实例，分别记录；均不推定Max或移动端规则。'
        byid[key]['sources']=list(dict.fromkeys(byid[key]['sources']+[i['source'] for i in byid[key]['images']]))
    return records
