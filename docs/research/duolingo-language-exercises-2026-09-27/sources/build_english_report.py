from pathlib import Path
from PIL import Image
import json, copy, re, html, csv, hashlib, subprocess
R=Path(__file__).resolve().parent.parent
rd=lambda f:json.loads((R/f).read_text())
old=rd('background-all-languages/report-data.json'); oldr={x['id']:x for x in old['records']}
c=rd('english-core.json');l=rd('english-sounds-and-scope.json')
assets=rd('english-assets.json');byurl={x['url']:x for x in assets};byfile={x['file']:x for x in assets}
roots={x['id']:x for x in rd('root-english-assets.json')};cm={x['id']:x for x in c['media']};lm={x['id']:x for x in l['assets']}
sources={x['url']:x for x in c['sources']+l['sources']};records=[];modes=[]
for x in rd('root-english-assets.json'):sources.setdefault(x['sourcePage'],{'url':x['sourcePage'],'title':x['sourcePage'].rstrip('/').split('/')[-1]})
def im(url=None,file=None,label='',framing='完整任务视口',note='',course='以英语为目标语言',interface='见图中指令',source=None,full=True):
 a=byurl.get(url,{}) if url else byfile.get(file,{})
 f=file or a['file'];p=R/f;z=Image.open(p)
 return dict(file=f,url=url or a.get('url',''),source=source or a.get('sourcePage',''),label=label or a.get('label','英语课程官方图'),framing=framing,note=note or a.get('visualNote',a.get('note','')),course_direction=course,interface_language=interface,full_task_view=full,width=z.width,height=z.height,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),capture_date='未公布；公开素材年代不等于拍摄或本账号上线日期',provenance='官方公开原图')
def ri(id,**kw):
 a=roots[id];defaults=dict(label=a.get('visualNote','').split('，')[0],course='葡语→英语',interface='葡语')
 defaults.update(kw)
 return im(url=a['url'],**defaults)
def ci(id,**kw):
 a=cm[id];defaults=dict(label=a['description'],course=a['course_direction'],interface=a['interface_language'],source=next(s['url'] for s in c['sources'] if s['id']==a['source_ids'][0]))
 defaults.update(kw);return im(url=a['url'],**defaults)
def li(id,**kw):
 a=lm[id];defaults=dict(label=a['label'],course='英语专项；母语方向按来源说明',interface=a['interface_language'],source=next(s['url'] for s in l['sources'] if s['id']==a['source_ids'][0]),note=a['notes'])
 defaults.update(kw);return im(url=a['url'],**defaults)
def base(eid,cid,name=None,images=None,**kw):
 x=copy.deepcopy(oldr[cid]);x['id']=eid
 if name:x['name']=name
 if images is not None:x['images']=images
 x.update(kw);x['sources']=list(dict.fromkeys([i['source'] for i in x['images'] if i['source']]+kw.get('sources',[])))
 x.setdefault('status','有完整英语题图' if any(i.get('full_task_view') for i in x['images']) else '完整英语图待补')
 x['availability']=kw.get('availability','已确认英语课程示例；各母语方向和客户端的实际覆盖未实机遍历。')
 x['plan']=kw.get('plan','基础英语课程任务；具体平台与方向按第三节说明，截图订阅图标不等于题型独占。')
 records.append(x);return x

def userim(cid):
 a=copy.deepcopy(next(i for i in oldr[cid]['images'] if 'duolingo-dark-' in i['file']));a.update(course_direction='中文→英语课程',source='',interface_language='中文',full_task_view=True,capture_date='截图拍摄日期与应用版本未确认；来自已有用户参考',provenance='用户历史参考截图',framing='完整中文界面英语题目视口');return a

def ec(eid,ecid,group,**kw):
 a=next(x for x in c['verified_exercises'] if x['id']==ecid)
 images=kw.pop('images',[ci(i) for i in a['media_ids']]);x=dict(id=eid,name=a['name'],group=group,kind='材料变体' if a['record_kind']=='variant' else '语言任务',goal=a['learning_objective'],input=a['prompt_input'],output=a['response_output'],steps=a['user_steps'],ui=' '.join(a['ui_design_points']),design=a['learning_rationale'].replace('研究者解释：',''),caution='静态图只能证明此题与所示状态，不能代替全部判分和交互状态实测。',availability=a['scope_note'],plan='英语课程或英语 Sounds 专项；具体开放方向见第三节。',sources=list(dict.fromkeys(i['source'] for i in images if i['source'])),images=images,status='有完整英语题图')
 x.update(kw);records.append(x);return x
base('E01','C03',images=[ri('pt-practice-5')],group='词汇与翻译',ui='两列五组葡语/英语词块，等高按钮与浅灰下沿提示可点；顶部进度和能量，底部无独立检查按钮。',steps=['读两列词或短语。','点一个母语词，再点对应英语词；重复完成各组。','按界面反馈推进；本轮未验证错误配对的具体复位时序。'],caution='截图证明英葡语义配对，不能单凭最终配完推断用户会自由拼写或造句。')
ec('E02','EC01','词汇与翻译')
records.append(dict(id='E03',name='Flashcards：主动说出英语词',group='词汇与翻译',kind='词汇提取任务；可切换键入',goal='从母语词义提示主动提取英语词。',input='一张母语词语卡及录音入口。',output='口头英语词；官方也说明可改为键入。',steps=['阅读卡面母语词。','用英语说出对应词；按画面提示开始录音。','不会时按提供的跳过方式处理，结束查看词卡结果。','不方便说话时用替代输入；本轮没有键入状态完整图。'],ui='中央单张卡占据视觉重心；录音按钮在下方，另有不能说话入口；结果页保留词卡，并用状态、词语和反馈提示完成情况。',design='撤去答案候选以增加主动提取；把一次任务缩小到一个词，减少句法生成的额外难度。结果列表便于识别哪些词需要再提取。',caution='官方三屏是不同结果状态的拼图。发音判分、跳过手势和键入分支未逐项实测。',availability='葡语官方明确葡语→英语词汇卡；不由此推出全部英语课程已开放。',plan='Practice 中的词汇功能；具体开放受课程、平台与更新进度影响。',sources=[next(s['url'] for s in l['sources'] if s['id']=='ES03')],images=[li('EA07',course='葡语→英语'),li('EA08',course='葡语→英语',framing='官方三屏排版；各手机结果页完整')],status='有完整英语题图'))
base('E04','C06','词块翻译：理解英语并译成母语',[userim('C06'),ri('pt-intro-4')],group='词汇与翻译',goal='把英语词或短句与母语意义联系起来。',input='英语原句及母语候选词块。',output='母语译文。',caution='此方向主要检查英语理解；母语词块正确不证明能主动组织英语。')
base('E05','C06','词块翻译：把母语组织成英语',[ri('pt-explain-1',label='葡语→英语词块翻译：答对后的完整反馈')],group='词汇与翻译',goal='提取英语词义并在候选范围内组合英语词序。',input='母语句子及英语词块。',output='英语译文。',ui='原文气泡、答案行与词库分区；所选词保留在答案行；绿色结果区同时提供答案解释和继续。',caution='本图是正确反馈态。候选已给出拼写，不能等同不带词库的整句写作。')
base('E06','C07',images=[userim('C07'),ri('pt-explain-3',label='英语自由翻译：错误答案与修正同时保留')],group='词汇与翻译',caution='中文题图证明自由译成英语的编辑态；葡语图证明错误反馈态，两者不是同一题的连续截图。')
base('E07','C08',images=[userim('C08')],group='词汇与翻译',availability='已有中文→英语历史完整题图，具体当前平台和版本未知。')
base('E08','C26','英语翻译的语音输入变体',[userim('C07'),ri('pt-ways-4',framing='官方局部图；顶部题干与进度被裁去',full=False,label='触摸说话与键盘替代输入',note='这是来源自带的局部图，本报告未补画或扩图。')],group='词汇与翻译',kind='输入方式变体，复用 E06 翻译任务',ui='完整中文题图的文本框下方有独立录音横条，位于检查按钮上方，图示状态为灰色；官方葡语局部图展示独立的触摸说话入口及键盘。',caution='已取得完整翻译题面及语音入口，但录音中、转写失败、确认转写等状态仍待实测；不是自由对话或专用音素评分。')
ec('E09','EC02','句子与阅读',images=[ci('ECM05'),userim('C09')])
ec('E10','EC03','句子与阅读',images=[ri('pt-grammar-4',framing='完整应用题面；官方图未含系统栏',label='图境辅助英语填空：基础词汇例'),ci('ECM03')],caution='基础图境与中级图文使用相同填空机制；母语提示是可展开状态，不另算一道题。')
ec('E11','EC04','句子与阅读')
ec('E12','EC05','句子与阅读')
base('E13','C15',images=[ri('pt-intro-5')],group='听力与口语',ui='正常和慢速播放在同一气泡内并列；答案横线在上、英语候选块在下；底部按钮处于未作答禁用态。')
base('E14','C21',images=[ri('pt-practice-7')],group='听力与口语',ui='英语音频可正常/慢速播放；英语理解问题在材料下，三项英语答案纵排；另有现在不能听与检查。',caution='本图不是听写，也没有完整听力文本。无法从静态图确认实际音频或自动播放节奏。')
base('E15','C24','英语整句跟读与朗读',[ri('pt-practice-6'),ri('pt-ways-3')],group='听力与口语',ui='目标英语句置于说话气泡，音频可重播；大麦克风是主要动作，底部不能说话提供退出当前录音要求的入口。',design='给定原句减少内容组织负担，把注意力集中于声音产出；同一交互可承载短语或较长句子。',caution='Falstaff 或 Lily 出现不代表 Video Call；这些是普通跟读题。语音识别通过不能证明自由交流或音素逐项评分。')
base('E16','C23','理解英语问题并说出正确回应',[ri('pt-intro-6',framing='完整英语口说选答视口；包括 CONTINUAR 与 Home 条')],group='听力与口语',status='有完整英语题图',ui='上方英语问句可重播；两条英语回复各自带麦克风。底部有现在不能说话和灰色 CONTINUAR，原图保留完整 Home 条。',caution='完整图确认了作答入口；录音与选项的具体点击时序、识别结果及失败恢复未实测。')
ec('E17','EC06','英语声音专项')
ec('E18','EC07','英语声音专项')
ec('E19','EC08','英语声音专项',images=[li('EA05',course='韩语界面→英语 Sounds',framing='完整英语配对题目视口')],ui='四个声音按钮与四个英语词并排；选中颜色与描边反馈关系，底部继续按钮及 Home 边界完整。',availability='采用官方韩语版英语 Sounds 全图；英文旧配对图因页尾缺失没有计入完整覆盖。')

# Advanced English evidence is added below after its source register is written.
a=rd('english-advanced.json');am={x['id']:x for x in a['image_evidence']};afs={x['id']:x for x in a['features']};ads={x['id']:x for x in a['sources']};sources.update({s['url']:s for s in a['sources']})
def ai(id):
 x=am[id];fr='官方多屏排版；各手机视口完整' if 'composite' in x['framing'] else ('完整应用题面；官方图未含系统栏' if 'without_system' in x['framing'] else '完整任务/通话视口')
 return im(url=x['original_image_url'],label=x['description_zh'],source=x['source_url'],framing=fr,note=x['visible_top_controls_zh']+' '+x['visible_bottom_controls_zh']+' '+x['target_language_basis_zh'],course=x['course_native_language']+'→英语',interface=x['ui_language'])
def ab(eid,cid,fid,ims,**kw):
 f=afs[fid];kw.setdefault('group',{'stories':'Stories 故事','radio':'Radio 电台','adventures':'Adventures 场景任务'}.get(f['container'],'Max 英语对话'))
 kw.setdefault('goal',f['design_goal_zh']);kw.setdefault('steps',f['steps_zh']);kw['sources']=[ads[i]['url'] for i in f['source_ids']];return base(eid,cid,f['name_zh'],ims,**kw)
ab('S01','S01','story_mc',[ai('story_comprehension_pt')],ui='英语角色对话在上，葡语理解问题和三个选项在下；正确选项以绿色方形勾选标记保留，底部绿色反馈与继续。',caution='故事内容视口完整，但不是整篇故事长截图；母语提问降低题干本身的英语阅读负担。')
records.append(dict(id='S02',name='故事里按释义找到英语词或词组',group='Stories 故事',kind='词义定位任务；含母语/英语释义变体',goal='结合上下文，将释义对应到故事中的英语表达。',input='已读的故事段落，母语或英语释义提示，可点击的英语句子词块。',output='一个对应的英语词或词组。',steps=afs['story_word_meaning']['steps_zh'],ui='词块直接嵌在故事句子中；既保留位置和语境，也提供明确点击边界。英语同义提示与母语提示采用相近布局。',design='将新词理解检查放在刚遇到它的语境中，减少在词典和正文间跳转；已有上下文帮助推断，词块选择限制产出负担。',caution='按释义定位词与独立默写不同；两个语言方向的配图不代表一个账号同时拥有全部版本。',availability='葡语→英语及韩语导航的英语故事官方示例。',plan='英语 Stories 课程活动；具体内容依课程进度。',sources=[ads['zpd_pt']['url'],ads['zpd_ko']['url']],images=[ai('story_meaning_tired_pt'),ai('story_synonym_bench_ko'),ai('story_synonym_normal_ko')],status='有完整英语题图'))
ab('S03','S04','story_free_write',[],status='官方确认英语功能；完整题图待补',ui='本轮未取得英语开放写作题屏，输入框、字数要求、提交按钮与反馈布局不作视觉断言。',caution='原跨语种研究中的法语写作图已移出。不能将10–60词等非英语截图要求推广到英语。',availability='葡语官方说明部分英语 Stories 有开放写作；韩语文章仍将该方向描述为未来扩展。',input='故事后的开放问题；具体英语题面待补。',output='学习者自行组织的英语回答。')
ab('R01','R01','radio_words',[ai('radio_words_junior_pt'),ai('radio_words_lucy_pt')],ui='主持人场景在上，播放按钮与五个英语词在下；题干明确选三个。两图分别为未选和三词已变绿，但不是同一题的连续状态。',caution='没有独立提交按钮；达到数量后是否立即推进、误选怎样回退未实测。')
ab('R02','R02','radio_match',[ai('radio_audio_match_pt')],ui='电台场景保持稳定，下面四行分别放声音按钮与葡语释义；底部Home边界完整。',caution='图上看不到声音内容；音频为英语的依据是官方英语课程上下文，本轮没有播放核验。')
ab('R03','R03','radio_tf',[ai('radio_tf_pt')],ui='陈述实际为英语，下方是✓/×两大按钮；底部有后退5秒、暂停、前进5秒。',caution='网页替代文字将该句写成葡语，已按原图纠正。二选判断有猜测空间，应结合多题表现解释结果。')
ab('R04','R04','radio_picture',[ri('pt-intro-9')],ui='主持人、来电者与录音设备建立节目语境；底部播放波形和两张图卡承担作答，没有英语拼写输入负担。',caution='音频英语方向由课程文章确定，静态图不能验证具体音频；选图不等于普通词汇图片单选已补齐。')
ab('A01','A01','adventure_explore',[ai('adventures_es_english')],ui='官方三屏依次展示英语入口、完整城市地图和英语对话；退出入口在场景左上，人物与物件保留空间关系。',kind='场景探索交互，非单独语言判分题',caution='截图证明场景与控件布置；具体移动手势、碰撞和所有可交互物体未实测。',availability='2024公告明确西语→英语、iOS/Android；未证实中文英语方向当前覆盖。')
ab('A02','A02','adventure_dialogue',[ai('adventures_es_english')],ui='英语角色提问叠在场景上，两条英语回应在底部；本图没有传统检查按钮。',caution='复用同一官方多屏图，新增的是任务目标分析，不把同图重复计成新的独立截图。',availability='西语→英语场景示例；点击回应后的正确/错误分支待实测。')
ab('M01','M01','roleplay',[],status='官方确认英语功能；完整聊天题图待补',plan='Max；已确认葡语→英语与日语→英语。',ui='官方说明采用多轮聊天与完成后反馈，但本轮没有可用的英语完整聊天原图。目录入口不计为题图。',caution='已排除复用法语聊天截图。现有证据足以说明功能和大致流程，不足以逐控件评价英语版聊天画面。',availability='葡语/日语 Max 官方页2026-01更新支持英语；iOS/Android说明不代表全账号同时上线。',steps=['从已开放此功能的 Max 英语课程进入情境任务。','按任务目标用英语回复角色，进行多轮交流。','完成后阅读关于表达的反馈；英语版具体输入控件与反馈版式待补图。'])
ab('M02','M02','lily_call',[ai('lily_pt_english'),ri('pt-ways-5',framing='完整通话视口；英语方向由官方课程上下文确定')],plan='Max。',ui='官方旧三屏提供英语入口、呼叫、通话；较新屏以Lily和背景场景为中心，底部红色挂断突出。',caution='通话画面本身无英语台词，目标英语由入口和官方上下文关联；未声称本轮进行了口语通话、转录或结果验收。',availability='葡语→英语入口与 Max 文档；日语→英语也有官方可用性说明。')
ab('M03','M03','falstaff_call',[ai('falstaff_english')],plan='Max 初学者引导通话。',ui='Falstaff正面对话，英语字幕位于下方，红色挂断与蓝色CC控件分开；原图保留完整通话边界。',caution='截图无母语文字，不因来源文章为葡语就把界面写成葡语。普通Falstaff跟读归E15，与通话分开。',availability='2026葡语官方公告包含英语目标、明确iOS；全面扩大到更多水平是目标，未当作既成事实。')

modes=[
 dict(id='P01',name='英语练习目录、词汇表与错题集',kind='练习容器',goal='按薄弱技能和历史错误组织复习；复用已列出的语言任务。',steps=['进入 Practice，选择听、说、词汇或错题。','在对应合集点击开始；词汇表可点扬声器听词。','完成选出的练习。'],ui='技能入口采用图标+名称的大块条目；词汇与错题列表展示待复习内容；Max对话另有标识。',note='目录和列表都是完整视口，但不算答题截图；2026英语课程基础练习已宣布免费。',images=[ri('pt-practice-1',framing='完整练习目录；不是题页',full=False),ri('pt-practice-4',framing='完整英语词汇列表视口；不是题页',full=False),ri('pt-practice-2',framing='完整错题列表视口；不是题页',full=False)],sources=[ads['practice_pt']['url'],ads['practice_en']['url']]),
 dict(id='P02',name='Sounds：英语音素目录',kind='参考与练习入口',goal='用音素格、例词与声音帮助用户定位发音差别，再进入E17–E19的任务。',steps=['选择元音或辅音区。','点格子听声音。','点开始进入成对声音练习。'],ui='目录中音素符号、例词和播放入口相邻；辅音截图为滚动状态。',note='目录格不是独立题型；本轮未找到学习App逐音素录音评分的完整证据。',images=[li('EA01',framing='完整发音目录视口；不是题页',full=False),li('EA02',framing='完整目录滚动视口；不是题页',full=False)],sources=[next(x['url'] for x in l['sources'] if x['id']=='ES01')]),
 dict(id='P03',name='Stories：逐句读听与推进',kind='叙事容器',goal='在人物关系和连续事件中组织英语输入，穿插S系列任务。',steps=['阅读当前句子或角色对话。','需要时点击该句扬声器重听。','点继续进入下一段或理解问题。'],ui='角色头像区分说话者；每句有声音入口；内容可滚动，底部继续保持明确。',note='这是完整故事阅读视口，不是整个故事的长截图，也不代表答题状态。',images=[ri('pt-intro-8',framing='完整英语故事阅读视口',full=False)],sources=[ads['intro_pt']['url'],ads['reading_pt']['url']]),
 dict(id='P04',name='正确、错误与英语答案解释',kind='反馈层',goal='让学习者在作答后看见结果、修正和原因。',steps=['完成一道英语翻译题并提交。','在正确或错误反馈中点击解释。','查看原答案、正确表达与母语说明，再继续课程。'],ui='正确反馈使用绿色，错误使用红色，并都有图标/文字；解释页把当前语言片段用蓝色突出，底部继续课程。',note='本轮有完整英语课程例图。葡语→英语免费已确认；并未推定所有母语方向均免费开放。',images=[ri('pt-explain-1',framing='完整正确反馈视口',full=False),ri('pt-explain-2',framing='完整正确答案解释页',full=False),ri('pt-explain-3',framing='完整错误反馈视口',full=False),ri('pt-explain-4',framing='完整错误原因解释页',full=False)],sources=[ads['explain_pt']['url']]),
 dict(id='P05',name='英语路径与课程编排',kind='课程容器',goal='把知识点练习、故事、电台、听说和对话按课程目标组织。',steps=['查看当前单元目标。','点路径上可用节点。','进入该节点承载的练习或情境。'],ui='旗帜标识目标英语；单元目标在顶部，节点用耳机、书本、话筒等图标区分活动。',note='所示为历史公开英语路径。节点数量、分数和XP不能当作当前每个课程固定配置。',images=[ri('pt-intro-7',framing='完整英语路径入口；不是题页',full=False)],sources=[ads['intro_pt']['url']]),
]
# Keep authoring corrections local; the image is a course exercise, not a verified Practice-only subfeature.
next(r for r in records if r['id']=='E03')['plan']='普通课程词汇提取题；公告未给出完整套餐/逐平台矩阵，无 Super/Max 独占依据。'
fc=next(x for x in records if x['id']=='E03')
fc['steps']=['阅读当前卡面的母语词；官方示例一组五张。','用英语说出对应词；不方便说话可切换键入。','根据官方说明：正确卡变绿并移开；错误卡展示并朗读答案，回到队尾再练。','结束查看词卡总结；该公告以至少三项正确作为通过条件，未实测当前账号阈值。']
fc['caution']='图证包含口述状态和结果三屏；没有键入状态全图。官方说明容许部分拼写/发音近似，但判定阈值与算法未公开。'

next(x for x in records if x['id']=='E14')['input']='英语音频、英语理解问题与三个英语文字选项。'
next(x for x in records if x['id']=='E14')['steps']=['播放英语材料，需要时重播或慢速播放。','阅读理解问题及三个文字选项，选择符合音频含义的答案。','提交查看反馈并继续。']
next(x for x in records if x['id']=='E18')['availability']=next(x for x in records if x['id']=='E18')['availability'].replace('EC06','E17')
specific_io={
 'E06':('母语原句与空白英语输入框。','学习者自行输入的完整英语译文。'),
 'E07':('中文原句与已写好一部分的英语译文。','补全缺失部分的英语单词或短语。'),
 'E10':('情境插图、含空缺的英语句子或短文、英语候选词。','一个填入空位的英语词；需要时展开母语提示。'),
 'E13':('英语句子音频、正常/慢速播放按钮与英语词块。','按所听内容排列的英语词块序列。'),
 'E15':('给定英语句子、可播放示范与录音入口。','按给定文字朗读的英语语音；识别反馈由应用呈现。'),
 'E16':('可播放的英语问句、两个英语完整回应与各自麦克风。','给定候选中符合语境的一句英语口头回应。'),
 'S01':('英语故事上下文、葡语理解问题与三个葡语选项。','一个与故事内容相符的选项。'),
 'R01':('Radio 英语音频、五个英语词与选出三个的指令。','三个被选中的英语词。'),
 'R02':('四个音频按钮与四个葡语释义；英语音频方向由课程来源确认。','四组英语声音与母语意义的配对。'),
 'R03':('Radio 英语音频、一个英语陈述和真/假按钮。','对陈述是否符合所听内容的判断。'),
 'R04':('英语 Radio 情节音频与两张对象图片。','一张符合所听内容的图片。'),
 'A01':('场景目标、地图、角色及可交互对象。','探索与触发情境的操作；这些动作本身不等同于英语能力判分。'),
 'A02':('英语角色问题、任务情境与两个英语候选回应。','一句符合交际目的的英语回应选项。'),
 'M01':('沟通情境、任务目标与角色发来的多轮消息；依据官方文字说明。','学习者自行组织的英语文字回复及任务后的表达反馈。'),
 'M02':('Lily 在通话中的英语话语与后续提问。','学习者即时组织的英语口头回应。'),
 'M03':('Falstaff 面向初学者的英语问题、引导与可选字幕。','在引导下组织的英语口头回应。')
}
for record in records:
 if record['id'] in specific_io:
  record['input'],record['output']=specific_io[record['id']]
next(x for x in records if x['id']=='S03')['design']='撤去有限候选，让学习者用英语重新组织故事信息；与识别正确选项相比，增加了词汇提取、句法生成和内容组织的要求。具体长度约束未获英语题图确认。'
for record in records:
 if record['id'] in {'E02','E09','E10','E11','E12'}:
  record['plan']='基础英语课程任务；具体开放方向见第三节，不归入 Sounds 专项。'
 elif record['id'] in {'E17','E18','E19'}:
  record['plan']='英语 Sounds 专项；具体课程方向与平台开放范围见来源说明。'

# Separate the written task branch from tasks whose displayed form uses listening or speech.
reading_notes={
 'E01':'阅读两列词语并点选配对，作答不依赖声音。',
 'E02':'阅读英语语境与定义，点选符合词义的一项。',
 'E04':'阅读英语原句，用母语词块组成译文；朗读是可选辅助。',
 'E05':'阅读母语原句，用英语词块组成译文。',
 'E06':'本节采用键盘输入整句译文的分支；语音输入另见 E08。',
 'E07':'阅读中文与已有英语译文，键入缺失部分。',
 'E09':'阅读句子并选词补空，不需要根据音频判断。',
 'E10':'根据插图和英语文本选择缺词。',
 'E11':'从英语段落中找到证据，再选择答案。',
 'E12':'阅读已显示的英语对话，选择下一句；播放语音是可选辅助。',
 'S01':'本节按阅读故事文本后回答理解问题的分支整理；故事本身可能伴随配音。',
 'S02':'阅读故事语境及释义，在句子中点选对应英语词或词组。',
 'S03':'按阅读故事后键入英语回应归类；英语完整写作题图仍待补。',
 'A02':'图中问题与两个回应均有英语文字，可通过阅读和点选完成；本轮未实测静音流程。',
 'M01':'依据官方文字聊天说明归类，输入为英语文字回复；完整英语聊天题图仍待补。',
}
for record in records:
 record['modality_section']='non-audio' if record['id'] in reading_notes else ('supporting-interaction' if record['id']=='A01' else 'listening-speaking')
 record['modality_label']={'non-audio':'不含口语和听力','listening-speaking':'听力与口语相关','supporting-interaction':'场景辅助交互'}[record['modality_section']]
 record['modality_note']=reading_notes.get(record['id'],'场景探索本身不是独立语言判分题。' if record['id']=='A01' else '按本报告展示的听音或口头作答形式归类；替代输入分支需分别确认。')
next(r for r in records if r['id']=='S01')['steps']=['阅读故事画面中已显示的英语上下文。','从三个理解选项中选择与文本相符的一项。','查看选择标记与反馈，继续故事；本节不要求通过听音取得答案。']
next(r for r in records if r['id']=='A02')['steps']=['进入角色对话。','阅读画面中的英语问题与两个候选回应。','点击符合任务与语境的一句英语回应。']
reading_records=[r for r in records if r['id'] in reading_notes]
reading_full_count=sum(any(i['full_task_view'] for i in r['images']) for r in reading_records)
reading_intro=f'''以完成当前题目是否必须听音或开口为准：本节的材料可从文字或图片获得，答案通过点选、配对或键入完成。可选播放、角色配音或语音输入入口不改变这里所整理的阅读与书面作答分支。

共 **{len(reading_records)} 项**：词汇与翻译 6 项、句子与阅读 4 项、Stories 3 项、Adventures 回应选择 1 项、Max 文字聊天 1 项。其中 **{reading_full_count} 项有完整英语任务画面**；S03 故事开放写作与 M01 Roleplay 的英语完整题图仍待补。

分类限定当前题目或文字分支，不代表整节 Stories、Adventures 或账号流程完全无声；本轮未完成静音实测。E03 Flashcards 的现有完整配图是口说形式，键入分支缺完整图，暂留在听说相关部分。A01 场景探索另列为辅助交互。
'''
reading_table=['| 编号 | 题目 | 无需听说时如何完成 |','| --- | --- | --- |']+[f"| [{r['id']}](#{r['id']}) | {r['name']} | {r['modality_note']} |" for r in reading_records]
reading_intro+='\n'+'\n'.join(reading_table)
reading_sections=[
 dict(id='non-audio',title='4.1 不含口语和听力的题目',intro=reading_intro,records=reading_records),
 dict(id='listening-speaking',title='4.2 听力与口语相关题目',intro='以下按当前展示的听音或口头作答形式集中整理，包含听写、听辨、朗读、语音输入、Radio 与口语通话。',records=[r for r in records if r['modality_section']=='listening-speaking']),
 dict(id='supporting-interaction',title='4.3 场景探索：辅助交互',intro='场景探索可依靠画面与文字线索操作，承担进入情境和触发任务的作用；本报告将其与独立语言判分题分开。',records=[r for r in records if r['modality_section']=='supporting-interaction']),
]

# Register only the sources actually cited by the English report.
intro=(R/'sources/english-editorial.md').read_text();ending=(R/'sources/english-synthesis.md').read_text()
for s in old['sources']:sources.setdefault(s['url'],s)
used_sources=set(re.findall(r'\]\((https://[^)]+)\)',intro+ending))
for r in records+modes:
 used_sources.update(u for u in r['sources'] if u.startswith('http'))
 for i in r['images']:
  if i['source'].startswith('http'):used_sources.add(i['source'])
for u in used_sources:sources.setdefault(u,{'url':u,'title':u.rstrip('/').split('/')[-1]})
sources={u:sources[u] for u in sorted(used_sources)}
used={}
for r in records+modes:
 for i in r['images']:used.setdefault(i['file'],i)
full=[r for r in records if any(i.get('full_task_view') for i in r['images'])]
counts=dict(catalogue_entries=len(records),entries_with_full_English_task_view=len(full),entries_with_only_partial_or_uncertain_view=sum(bool(r['images']) and not any(i.get('full_task_view') for i in r['images']) for r in records),entries_without_English_task_image=sum(not r['images'] for r in records),modes=len(modes),unique_image_files=len(used),official_image_files=sum(i['provenance']=='官方公开原图' for i in used.values()),historical_user_images=sum(i['provenance']=='用户历史参考截图' for i in used.values()),source_pages=len(sources))
counts['not_official_total_exercise_types']=True
counts.update(entries_without_required_listening_or_speaking=len(reading_records),reading_writing_entries_with_full_English_task_view=reading_full_count,listening_speaking_entries=len(reading_sections[1]['records']),supporting_interaction_entries=len(reading_sections[2]['records']))
esc=lambda s:html.escape(str(s),quote=True)
def links(us):return ' · '.join(f'<a href="{esc(u)}" target="_blank" rel="noopener">来源{i+1}</a>' for i,u in enumerate(us) if u.startswith('http'))
node='/Users/permission/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
marked='/Users/permission/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js'
def mdhtml(s):
 js='import {marked} from '+json.dumps(marked)+';let s="";for await(const c of process.stdin)s+=c;process.stdout.write(marked.parse(s));'
 t=subprocess.run([node,'--input-type=module','-e',js],input=s,text=True,capture_output=True,check=True).stdout
 return t.replace('<table>','<div class="table-scroll"><table>').replace('</table>','</table></div>')
def fig(i):
 cls='wide' if i['width']/i['height']>1 else ''
 refs=(f'<a href="{esc(i["source"])}" target="_blank" rel="noopener">来源文章</a>' if i['source'].startswith('http') else '用户此前提供的参考图')
 return f'''<figure class="{cls}"><a href="{esc(i['file'])}" target="_blank"><img src="{esc(i['file'])}" alt="{esc(i['label'])}" width="{i['width']}" height="{i['height']}" loading="lazy"></a><figcaption><strong>{esc(i['label'])}</strong><br>{esc(i['framing'])} · {i['width']} × {i['height']}<br>课程：{esc(i['course_direction'])}；界面：{esc(i['interface_language'])}<br>{esc(i['note'])}<span class="img-links"><a href="{esc(i['file'])}" target="_blank">查看原尺寸</a> · {refs}</span></figcaption></figure>'''
def card(r):
 images=''.join(fig(i) for i in r['images']) or '<p class="missing">完整英语题图待补。此处保留证据缺口，不以其他语言或生成图替代。</p>'
 steps=''.join('<li>'+esc(x)+'</li>' for x in r['steps'])
 return f'''<article class="exercise" id="{r['id']}"><div class="exercise-heading"><span class="number">{r['id']}</span><div><p class="eyebrow">{esc(r['group'])} · {esc(r['kind'])} · {esc(r['status'])}</p><h3>{esc(r['name'])}</h3></div></div><div class="analysis"><p class="modality"><b>作答方式：</b>{esc(r['modality_note'])}</p><p><b>训练什么：</b>{esc(r['goal'])}</p><p><b>输入 → 输出：</b>{esc(r['input'])} → {esc(r['output'])}</p><h4>用户如何操作</h4><ol>{steps}</ol><p><b>画面与控件：</b>{esc(r['ui'])}</p><p><b>设计解读：</b>{esc(r['design'])}</p><p class="limit"><b>证据边界：</b>{esc(r['caution'])}</p><details><summary>课程、平台与套餐</summary><p>{esc(r['availability'])}</p><p>{esc(r['plan'])}</p></details><p class="sources-inline">{links(r['sources'])}</p></div><div class="screens">{images}</div></article>'''
sections=[f'<section id="{s["id"]}"><h2>{esc(s["title"])}</h2>'+mdhtml(s['intro'])+''.join(card(r) for r in s['records'])+'</section>' for s in reading_sections]
toc_rows=''.join(f'<tr><td><a href="#{r["id"]}">{r["id"]}</a></td><td>{esc(r["name"])}</td><td>{esc(r["group"])}</td><td><a href="#{r["modality_section"]}">{esc(r["modality_label"])}</a></td><td>{esc(r["status"])}</td></tr>' for r in records)
modehtml='<section id="modes"><h2>5. 入口、课程容器与反馈层</h2><p>以下画面解释题目如何组织与反馈；不增加原子题型数量。</p>'
for m in modes:
 modehtml+=f'<article class="exercise" id="{m["id"]}"><p class="eyebrow">{m["id"]} · {m["kind"]}</p><h3>{m["name"]}</h3><p>{m["goal"]}</p><ol>'+''.join('<li>'+esc(x)+'</li>' for x in m['steps'])+f'</ol><p><b>UI：</b>{esc(m["ui"])}</p><p class="limit">{esc(m["note"])}</p><p>{links(m["sources"])}</p><div class="screens">'+''.join(fig(i) for i in m['images'])+'</div></article>'
modehtml+='</section>'
sourcehtml='<section id="sources"><h2>10. 来源与追溯</h2><p>以下为本报告实际引用的官方页面；检索日为2026-09-27。文章修改日期不是截图拍摄日期或本账号上线日期。四张中文英语原图来自已有用户参考，拍摄日期与版本未知。</p><ol>'
for u,s in sources.items():
 pub=s.get('published_at') or s.get('published') or '未确认';mod=s.get('modified_at') or s.get('modified_metadata') or '未确认'
 sourcehtml+=f'<li><a href="{esc(u)}" target="_blank" rel="noopener">{esc(s.get("title") or u)}</a><small>发表 {esc(str(pub)[:10])} · 修改 {esc(str(mod)[:10])}</small></li>'
sourcehtml+='</ol></section>'
css=(R/'sources/build_report.py').read_text().split("css='''",1)[1].split("'''",1)[0]
css+='\n.missing{padding:28px;background:#fbf4e8;border:1px dashed #d4a868;border-radius:10px;width:100%;color:#73521e}.search{width:100%;padding:13px 16px;border:1px solid var(--line);border-radius:8px;font:inherit;background:#fff}td:first-child{white-space:normal}.screens figure{flex-basis:330px}.screens figure.wide{flex-basis:100%}figure img{max-height:780px}figure.wide img{max-height:none}#sources{overflow-wrap:anywhere}.modality{background:#f0f7eb;padding:12px 15px;border-left:3px solid #6a994e}'
intro_no_h1=intro.split('\n',1)[1]
notice=f"本报告包含 {len(records)} 个英语题型、交互与变体分析条目，{len(full)} 项已有完整英语任务/通话视口；另有 {counts['entries_without_English_task_image']} 项缺英语题图。另列 {len(modes)} 类入口与反馈。{len(used)} 份独立图像文件不等于同数量题型；重复使用的原图仅计一次。仍待确认是否适用于英语的候选题型，见第8节。"
html_doc=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Duolingo英语课程真实界面、逐题操作与设计分析，明确完整截图与证据缺口"><title>Duolingo 英语题型与 UI 设计分析</title><style>{css}</style></head><body id="top"><header><div class="kicker">CANRAN STUDIO · ENGLISH LEARNING · 2026.09.27</div><h1>Duolingo 英语学习<br>题型、操作与界面设计</h1><p>从学习任务出发，逐项分析输入、操作、反馈和支架。只把目标语言明确为英语的截图放进主体，保留每项证据的边界。</p><div class="stats"><div><b>{len(records)}</b><span>分析条目，含输入与情境变体</span></div><div><b>{len(full)}</b><span>已有完整英语任务视口的条目</span></div><div><b>{len(used)}</b><span>采用的独立原图文件</span></div><div><b>3</b><span>免费 · Super · Max</span></div></div></header><nav><a href="#overview">研究与范围</a><a href="#index">题型索引</a><a href="#non-audio">不含口语和听力</a><a href="#listening-speaking">听力与口语</a><a href="#supporting-interaction">场景辅助交互</a><a href="#modes">入口与反馈</a><a href="#synthesis">设计结论与缺口</a><a href="#sources">来源</a></nav><main><div class="tools"><a href="REPORT.md">Markdown 报告</a><a href="coverage.csv">覆盖清单</a><a href="report-data.json">结构化研究</a><a href="adopted-images.json">采用原图索引</a><a href="duolingo-english-report.zip">离线报告包</a></div><div class="notice">{notice}</div><section id="overview">{mdhtml(intro_no_h1)}</section><section id="index"><h2>题型索引</h2><p>点击编号查看操作、设计分析和截图；每幅图可打开原尺寸。筛选只影响下方目录。</p><label for="catalogue-filter">查找题型</label><input class="search" id="catalogue-filter" type="search" placeholder="例如：不含口语和听力、翻译、Radio、待补" autocomplete="off"><div class="table-scroll"><table id="catalogue"><thead><tr><th>编号</th><th>题型 / 交互 / 变体</th><th>类别</th><th>听说分类</th><th>图证状态</th></tr></thead><tbody>{toc_rows}</tbody></table></div></section>{''.join(sections)}{modehtml}<section id="synthesis">{mdhtml(ending)}</section>{sourcehtml}<footer>本地研究报告，非 Duolingo 官方题型总表。界面、插画及品牌归其权利人所有。保存原始公开素材用于分析；没有生成或重绘题图。本轮未完成实时账号逐题走查。</footer></main><a class="top-link" href="#top">返回顶部 ↑</a><script>document.getElementById('catalogue-filter').addEventListener('input',function(){{let q=this.value.trim().toLowerCase();document.querySelectorAll('#catalogue tbody tr').forEach(r=>r.hidden=q&&!r.textContent.toLowerCase().includes(q));}});</script></body></html>'''
(R/'report.html').write_text(html_doc)
md=[intro,'\n'+notice,'\n## 题型索引\n','| 编号 | 题型/交互/变体 | 类别 | 听说分类 | 图证状态 |\n| --- | --- | --- | --- | --- |']
for r in records:md.append(f'| [{r["id"]}](#{r["id"]}) | {r["name"]} | {r["group"]} | {r["modality_label"]} | {r["status"]} |')
def mdimages(images):
 out=[]
 for i in images:
  out += ['',f'![{i["label"]}]({R/i["file"]})','',f'图证：{i["framing"]}；{i["width"]}×{i["height"]}；{i["course_direction"]}；界面：{i["interface_language"]}。{i["note"]}']
  if i['source'].startswith('http'):out.append(f'[来源文章]({i["source"]})')
 return out
for section in reading_sections:
 md+=['',f'<a id="{section["id"]}"></a>',f'## {section["title"]}','',section['intro']]
 for r in section['records']:
  md+=['',f'<a id="{r["id"]}"></a>',f'### {r["id"]} · {r["name"]}','',f'**作答方式：**{r["modality_note"]}',f'**图证状态：**{r["status"]}',f'**训练目标：**{r["goal"]}',f'**输入 → 输出：**{r["input"]} → {r["output"]}','','**用户操作**','']+[f'{n}. {s}' for n,s in enumerate(r['steps'],1)]+['',f'**界面关键点：**{r["ui"]}',f'**设计解读：**{r["design"]}',f'**证据边界：**{r["caution"]}',f'**课程/平台：**{r["availability"]}',f'**套餐：**{r["plan"]}',' · '.join(f'[来源{n}]({u})' for n,u in enumerate(r['sources'],1) if u.startswith('http'))]+mdimages(r['images'])
  if not r['images']:md+=['','完整英语题图待补；未使用其他目标语言或生成图代替。']
md+=['','## 5. 入口、课程容器与反馈层','']
for m in modes:md+=['',f'### {m["id"]} · {m["name"]}','',m['goal'],'操作：'+' '.join(m['steps']),'界面：'+m['ui'],'边界：'+m['note']]+mdimages(m['images'])
md+=['',ending,'','## 10. 来源目录','']
for u,s in sources.items():md.append(f'- [{s.get("title") or u}]({u})')
(R/'REPORT.md').write_text('\n'.join(md)+'\n')
with (R/'coverage.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.writer(f);w.writerow(['编号','名称','分类','听说分类','归类说明','图证状态','完整任务视口图片数','所有配图数','学习方向','本轮账号实测','来源','图片文件'])
 for r in records:w.writerow([r['id'],r['name'],r['group'],r['modality_label'],r['modality_note'],r['status'],sum(i.get('full_task_view',False) for i in r['images']),len(r['images']),' | '.join(dict.fromkeys(i['course_direction'] for i in r['images'])),'未完成',' | '.join(r['sources']),' | '.join(i['file'] for i in r['images'])])
 for m in modes:w.writerow([m['id'],m['name'],m['kind'],'入口/参考/反馈单列','不是独立作答题型。','入口/参考/反馈单列',0,len(m['images']),'英语课程或专项','未完成',' | '.join(m['sources']),' | '.join(i['file'] for i in m['images'])])
data=dict(date='2026-09-27',scope='English as the target language; Free, Super, Max; exclude other target languages, Duolingo ABC and DET',records=records,modes=modes,reading_sections=[dict(id=s['id'],title=s['title'],record_ids=[r['id'] for r in s['records']]) for s in reading_sections],sources=list(sources.values()),counts=counts,live_account_walkthrough=False,exhaustive_current_type_coverage=False,method='Official sources, original published images and four existing user reference images; visual verification; no generated UI')
(R/'report-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2));(R/'adopted-images.json').write_text(json.dumps(list(used.values()),ensure_ascii=False,indent=2))
print(json.dumps(counts,ensure_ascii=False,indent=2))
