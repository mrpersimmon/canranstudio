"""Second live lesson: Chinese English pronunciation practice; unmodified captures."""
from copy import deepcopy
from datetime import datetime
from zoneinfo import ZoneInfo
import hashlib
import shutil
from PIL import Image

ROWS=[
(200,'打开中文发音页','免费访客可见英语发音入口、元音/辅音词卡；这里只截当前视口，不是完整发音表。'),
(201,'点击开始进入专项','出现你听到了什么、dock/deck 两选项、大播放按钮；检查禁用，题页顶部没有红心显示。'),
(202,'点击 dock','dock 变蓝；这张即时帧的检查仍灰色，不能拿它证明已完成按钮过渡。'),
(203,'改点 deck','选择转移到 deck；此时检查为绿色。'),
(204,'改回 dock，点击检查','本题实际正确，dock 与底部反馈变绿；提供太简单、太难、报错。'),
(205,'点击继续','新题选项为 got/get；不能把相同标题当成同一条音频。'),
(206,'点击 got','got 蓝色选中，检查可用。'),
(207,'点击检查','本题实际正确，绿色反馈及连对2题。'),
(208,'点击继续','另一题为 deck/dock，选项顺序改变；答案尚空。'),
(209,'点击 dock','右侧 dock 变蓝。'),
(210,'点击检查','本题实际正确；不能因选项排列变化推断音频相同。'),
(211,'点击继续','又出现 got/get 选项，属于课序中的另一次呈现。'),
(212,'点击 get','右侧 get 变蓝，尚未提交。'),
(213,'点击检查','此题 get 被判正确，绿色反馈。'),
(214,'点击继续','下一道仍为 got/get；只凭文字不能知道其音频与上一题是否相同。'),
(215,'点击 get','get 变蓝，等待提交。'),
(216,'点击检查','此次 get 被判错，红色提示还不太准确，再多听几次吧；选项锁定，未列出正确词。'),
(217,'在错误反馈页点击播放','仍显示错误反馈，播放入口可点击；原音轨与播放质量没有保存验证。'),
(218,'点击继续','进入先听后答：两个音频入口、同一个词/两个不同的词；英语词形暂时隐藏。'),
(219,'选择同一个词','第一项蓝色选中，检查启用。'),
(220,'改选两个不同的词','蓝色选择转移，单词仍隐藏。'),
(221,'点击检查','实际正确；播放位置显示 deck 与 dock，底部补出单词及音标。'),
(222,'点击继续','进入下一道声音同异题，两词再次隐藏。'),
(223,'点击上方音频入口','保留点击后按钮画面；没有据此宣称声音正常。'),
(224,'点击下方音频入口','两个声音可以分别触发；这不是语音输入。'),
(225,'选择同一个词','形成未提交选择。'),
(226,'点击检查','实际正确；两个位置显示 get，底部为 get 及音标。'),
(227,'点击继续','下一道声音同异题初始态。'),
(228,'选择同一个词','选择变蓝，尚未揭晓词形。'),
(229,'点击检查','实际正确；两个位置都是 deck，底部出现对应音标。'),
(230,'点击继续','再一道声音同异题初始态。'),
(231,'选择同一个词','作答草稿为同一个词。'),
(232,'点击检查','实际判错；揭晓 got 与 get 及两者音标，红色反馈；选项锁定。'),
(233,'点击继续','转到另一道声音同异题，不是在原题原位修改。'),
(234,'未选答案，点击跳过','底部是黄色反馈和继续，显示 get/get 及音标；尽管文案为看，多练几次真的有用吧，不能把跳过算正确作答。'),
(235,'点击继续','进入朗读下面的句子，实际材料只有 got；提供点击并开始录音与现在不做口语题。'),
(236,'点击并开始录音','录音条变为波形界面，示范播放禁用；未提供可核对的口述音轨，波形不证明录音或识别质量。'),
(237,'等待后点击录音条停止','捕获黄色瞬时提示：呃～听起来不太对哦，再试一次吧；随后重新出现录音入口。未判断原因是无声、设备还是发音。'),
(238,'点击现在不做口语题','出现黄色跳过状态，录音入口禁用，文案却是发音好棒哦；此操作没有成功朗读，不能解释成识别正确。'),
(239,'点击继续','进入四组声音—英语书面词配对；左列四音频、右列 deck/got/dock/get，检查禁用。'),
(240,'点击第1个声音','音频卡出现蓝色高亮，还未形成配对。'),
(241,'点击 deck，立即截图','第1声音与 deck 短暂标红；错误局限于当前一对，题页未显示红心。'),
(242,'等错误反馈自然结束','仍在原题；错误对恢复可选，可以重新配对。'),
(243,'重选第1声音与 got','这对短暂变绿，实际配对正确。'),
(244,'等正确反馈自然结束','第1声音和 got 变浅并禁用，其他项目仍可操作。'),
(245,'从右列 deck 开始','右列也能先选，文字出现蓝色高亮。'),
(246,'再点第2声音','当前这一对标红；已完成的 got 对仍保留。'),
(247,'重新选第2声音，再点 dock','这一对变绿，后续锁定。'),
(248,'点第3声音，再点 deck','第三声音与 deck 不匹配，再次短暂标红。'),
(249,'重选第3声音，再点 get','该对变绿，前三对已完成。'),
(250,'点第4声音，再点 deck','所有项目禁用，自动出现绿色正确与继续；没有点击检查。'),
(251,'点击继续','回到 got/get 听辨选择；与早先错误题有同样文字，音轨身份未核实。'),
(252,'选择 got','此轮 got 为提交草稿。'),
(253,'点击检查','got 实际被判正确；只确认此次结果，不凭文字相同断言是原音轨重练。'),
(254,'点击继续','再次进入声音同异题；作答前英语词形隐藏。'),
(255,'选择两个不同的词','保留作答草稿，准备检查。'),
(256,'点击检查','实际正确，显示 got/get 与音标；对应词对与之前错误实例一致，但没有核对原音轨一致性。'),
(257,'点击继续','发音专项实际进入单元完成页；本次研究采集显示11经验、83%，不代表听说能力或正常学习成效。'),
]

def extend_evidence(data,root,capture):
    lookup={int(s['id'].rsplit('-',1)[1]):s for s in data['shots']}
    for n,action,result in ROWS:
        origin=next(capture.glob(f'{n:03d}-*.png'));dest=root/'assets/flows'/f'{n:03d}.png';shutil.copy2(origin,dest)
        with Image.open(dest) as im:w,h=im.size
        shot=deepcopy(data['shots'][0]);shot.update(id=f'CN-LIVE-{n:03d}',file=dest.relative_to(root).as_posix(),action=action,result=result,label=action+'；'+result,width=w,height=h,
          source='https://zh-cn.duolingo.com/characters' if n==200 else 'https://zh-cn.duolingo.com/alphabets/en/pronunciation',
          capture_date=datetime.fromtimestamp(origin.stat().st_mtime,ZoneInfo('Asia/Shanghai')).isoformat(timespec='seconds'),
          full_task_view=n not in (200,257),original_capture_filename=origin.name,sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),
          course='中文→英语，发音专项（同一免费访客，第二节采集课）',lesson_run='CN-WEB-20260927-B',visual_reviewed=True)
        shot['url']=shot['source'];lookup[n]=shot;data['shots'].append(shot)
    def run(id_,ids,title,prompt,nums,summary,limits,core=False):
        data['runs'].append(dict(id=id_,type_ids=ids,title=title,prompt=prompt,lesson_run='CN-WEB-20260927-B',core_wrong_recovery_correct_loop=core,all_branches_complete=False,summary=summary,limitations=limits,
          steps=[dict(number=i,shot_id=lookup[n]['id'],screenshot=lookup[n]['file'],action=lookup[n]['action'],actual_result=lookup[n]['result']) for i,n in enumerate(nums,1)]))
    run('F13',['E17'],'近音听辨：改选、正确、错误与后续呈现','你听到了什么？dock/deck 与 got/get',list(range(200,219))+[251,252,253,254],
      '保持第一段实际课序，列出多个音频实例。错误时选项仍为蓝色草稿样式，底部红色建议多听，并未直给正确词；后续同组选项再次出现。',
      '不是把所有 got/get 画面当成同一道题：音轨未保存，相同选项可能对应不同声音。218到251之间完成了声音同异、朗读和配对，因此不计严格同音同题核心闭环。难度评价与报错入口未提交。')
    run('F14',['E18'],'声音同异：隐藏词形、揭晓、错误、跳过与后续呈现','同一个词 / 两个不同的词',list(range(218,236))+[254,255,256,257],
      '作答前只有两个音频入口，提交后才出现英语词形与音标。错误为红色；跳过为黄色，即使出现鼓励文案也不能记作正确回答。',
      '此组包含 deck/dock、get/get、deck/deck、got/get 等明确分开的实例；235到254之间有其他题。后段再现 got/get，但音轨身份未核实，未计同音同题核心闭环。')
    run('F15',['E15'],'朗读：启动、未通过提示与不做口语','朗读下面的句子：got',list(range(235,240)),
      '记录完整题页、开始后的波形、停止后瞬时黄色未通过提示及跳过到配对题。跳过出现发音好棒哦的文字，但它不证明成功朗读。',
      '没有可核对的口述音轨；本轮没有说出英语并验证识别正确。未通过原因不明，不能定性为发音错误；浏览器原生授权流程、重录成功等仍缺证据。')
    run('F16',['E19'],'声音配对书面词：错误恢复、左右先选与全部完成','四个英语声音 ↔ deck / got / dock / get',list(range(239,252)),
      '错误对瞬时变红、原位恢复；成功对变浅锁定。右列也能先选，全部配完自动出现绿色继续；点击继续后的新题已拍到。',
      '本次实测同一配对题的错误到全部正确；声音质量没有听验，首次选择借助试错完成，不算英语听力表现。尚未测全部排列、快捷键和退出。',True)
    data['screenshot_count']=len(data['shots'])
    data['flow_entries_with_live_evidence']=sorted(set(data['flow_entries_with_live_evidence']+['E15','E17','E18','E19']))
    data['core_loop_type_ids']=sorted(set(data['core_loop_type_ids']+['E19']))
    data['sessions']=[dict(id='CN-WEB-20260927-A',course=data['course'],status='已走到结算与回顾'),dict(id='CN-WEB-20260927-B',course='中文→英语发音专项',status='已走到结算')]
    data['course']='中文→英语：访客基础入门课，以及中文发音专项；两节课分别编号'
    assert len({s['file'] for s in data['shots']})==len(data['shots'])
    assert {s['shot_id'] for r in data['runs'] for s in r['steps']}=={s['id'] for s in data['shots']}
    return data
