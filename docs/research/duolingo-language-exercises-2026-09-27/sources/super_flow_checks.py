"""Per-state evidence, using the actual player semantics rather than one shared model."""
def extend_checks(profiles, profile_ids, checks, partial):
    profiles['immediate-choice']=[
        ('select','点击一个候选，观察是否立即判分','是否先形成草稿、是否另有检查；只按实际界面记录。'),
        ('wrong','点击错误候选','即时红色、错误文案、是否揭晓内容与资源变化。'),
        ('after-wrong','等待错误反馈稳定','错误项恢复可选或禁用，正确路径是否仍在原题。'),
        ('retry','在同题选择另一个候选','原位继续尝试，不假定必须课末重练。'),
        ('correct','选择正确项','绿色、锁定、整句揭晓或下一步入口。'),
        ('after-correct','按实际方式推进','故事点击继续、电台自动推进；拍实际下一画面。'),
        ('exit','打开退出并取消','确认信息、恢复后当前选择是否保留。'),
    ]
    profiles['immediate-words']=[
        ('wrong','点击错误词','是否逐词判定，错误项之后是否可选。'),
        ('after-wrong','等待错误状态稳定','是否保留其他词，是否能原位继续。'),
        ('first-correct','找到一个正确词','只完成部分要求时是否锁定/推进。'),
        ('selection-count','完成要求的两个词','是否自动结束、有无额外提交或多选上限提示。'),
        ('correct','选齐目标词','全部正确状态及进度。'),
        ('after-correct','等待实际下一段','自动推进后画面或下一题。'),
        ('play','重播问题音频','按钮变化与听验分别记录。'),
        ('exit','退出后取消','已完成词是否保留。'),
    ]
    profiles['incremental-order']=[
        ('wrong','点错误位置的片段','片段是否插入答案，红色如何反馈。'),
        ('after-wrong','等待错误反馈结束','片段能否再次使用。'),
        ('prefix','选择正确前缀','文字逐步揭晓、已用片段禁用。'),
        ('wrong-after-prefix','已有前缀后选择错误片段','已完成部分是否保留。'),
        ('retry','继续选正确片段','原位恢复与顺序。'),
        ('correct','补全最后片段','是否自动完成、是否另有检查。'),
        ('after-correct','点击继续','实际后续台词。'),
        ('play','重播音频','画面与声音质量分开核对。'),
        ('exit','打开退出并取消','正确前缀是否保留。'),
    ]
    replacements={'S01':'immediate-choice','S02':'immediate-choice','S04':'immediate-choice','S05':'incremental-order','R01':'immediate-words','R03':'immediate-choice','R05':'immediate-choice'}
    for key,profile in replacements.items():
        for ids in profile_ids.values():
            if key in ids: ids.remove(key)
        profile_ids.setdefault(profile,[]).append(key)
    checks.update({
        'E05':{'initial':[417],'empty':[417,429],'first-token':[419],'more-tokens':[420,421],'undo':[426,427,428],'clear':[429],
            'reorder':[426,427,428,429,430,431,432],'hint':[418],
            'alternative':[422,423,424,425,426],'wrong':[436,437],'after-wrong':[437,438],'retry':[465,466,467,474,475],
            'correct':[475],'after-correct':[476]},
        'E06':{'initial':[445],'empty':[445,477],'focus':[445,446],'partial':[446],'edit':[446,447],
            'spelling':[463,464],'wrong':[447,450],'after-wrong':[450,451],'retry':[476,477,478,479],
            'correct':[479,464],'after-correct':[480,465],'exit':[447,448,449,450]},
        'E07':{'initial':[451],'empty':[451,457],'focus':[455],'partial':[455],'edit':[455,456,457],
            'scaffold':[452,453,454,458,459],'wrong':[460,461],'after-wrong':[461,462],
            'retry':[480,481,482],'correct':[482],'after-correct':[483]},
        'E14':{'initial':[411],'empty':[411],'select':[412,413],'correct':[414],'after-correct':[415]},
        'S01':{'initial':[307],'empty':[307],'select':[308],'wrong':[308,310],'after-wrong':[309],
            'retry':[310,311],'correct':[311,324,345],'after-correct':[312,325,346]},
        'S02':{'initial':[313],'empty':[313],'select':[314],'wrong':[314],'after-wrong':[315],
            'retry':[316],'correct':[316],'after-correct':[319],'exit':[317,318]},
        'S04':{'initial':[328],'empty':[328],'select':[329],'wrong':[329],'after-wrong':[330],
            'retry':[331],'correct':[331],'after-correct':[332]},
        'S05':{'initial':[334],'empty':[334],'wrong':[335],'after-wrong':[336],'prefix':[337],
            'wrong-after-prefix':[338],'retry':[339],'correct':[340],'after-correct':[341]},
        'R01':{'initial':[523],'empty':[523],'wrong':[524],'after-wrong':[525],'first-correct':[526,527],
            'selection-count':[527,528,529],'correct':[528],'after-correct':[529]},
        'R02':{'initial':[502],'empty':[502],'audio-controls':[503],'first-side':[503,509],
            'wrong-pair':[507,508,510],'pair-recovery':[508,511],'correct-pair':[504,505],
            'all-pairs':[514,515,516],'after-correct':[517]},
        'R03':{'initial':[518],'empty':[518],'select':[519],'wrong':[519],'after-wrong':[520],
            'retry':[521],'correct':[521],'after-correct':[522]},
        'R05':{'initial':[529],'empty':[529],'select':[530],'wrong':[530],'after-wrong':[531],
            'retry':[532],'correct':[532],'after-correct':[533,534]},
    })
    checks['E13'].update(wrong=[402,403], **{'after-wrong':[403,404]})
    for key,values in {'initial':[346],'empty':[346],'first-side':[347,352],'wrong-pair':[348,349],
        'pair-recovery':[349,350],'correct-pair':[350,351],'all-pairs':[356],'after-correct':[357]}.items():
        checks['E01'].setdefault(key,[]).extend(values)
    for key,values in {'initial':[404,438],'empty':[404,438],'first-token':[439],'more-tokens':[440,441,442],
        'correct':[410,443],'after-correct':[411,444]}.items():checks['E04'].setdefault(key,[]).extend(values)
    partial.update({
        ('E05','reorder'):'已移除中间词、清空后重新排列；没有拖拽交换或全部排列测试。',
        ('E05','alternative'):'已测词库和键盘独立草稿；没有在本题键盘模式提交答案。',
        ('E06','focus'):'桌面文本框可输入；移动端软键盘未采集。',
        ('E06','edit'):'本题从部分文本改写整句；中间字符选区与清空见另一巴黎实例，未在本题完整重测。',
        ('E06','spelling'):'只核实docter、小写开头、无句号这一组合被接受；未分别穷举规则。',
        ('E06','exit'):'取消后可提交原草稿；449为淡出动画帧，未确认退出重进。',
        ('E07','focus'):'桌面短空位可输入；移动端软键盘未采集。',
        ('E07','edit'):'已追加末尾字符并清空；中间字符选区未测。',
        ('R02','audio-controls'):'只操作声音按钮，未保存音轨或听验；没有慢速操作证据。',
    })
