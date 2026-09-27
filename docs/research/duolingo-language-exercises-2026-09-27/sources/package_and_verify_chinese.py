from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from urllib.request import build_opener, ProxyHandler
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import hashlib
import json
import zipfile

ROOT=Path(__file__).resolve().parent.parent
ZIP_NAME='duolingo-chinese-english-report.zip'
PREVIEW='http://127.0.0.1:59042/'

class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.links=[];self.images=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='img':
            assert a.get('alt'),'Missing alt'
            self.images.append(a['src'])
        for k in ('src','href'):
            v=a.get(k,'');u=urlsplit(v)
            if v and not u.scheme and not v.startswith('//'):self.links.append(u)

def parse(content):
    p=Page();p.feed(content)
    assert len(p.ids)==len(set(p.ids)),'Duplicate ids'
    return p

def check_links(pages,files):
    for name,page in pages.items():
        for u in page.links:
            target=unquote(u.path) or name
            assert target in files,(name,target)
            if u.fragment and target in pages:
                assert unquote(u.fragment) in pages[target].ids,(name,target,u.fragment)

data=json.loads((ROOT/'report-data.json').read_text())
main=json.loads((ROOT/'adopted-images.json').read_text())
reference=json.loads((ROOT/'reference-images.json').read_text())
browser=json.loads((ROOT/'sources/chinese-report-browser-check.json').read_text())
records=data['records'];all_images=main+reference
live=json.loads((ROOT/'live-flow-evidence.json').read_text())
flow=json.loads((ROOT/'flow-data.json').read_text())
assert len(records)==38
assert len({r['id'] for r in records})==len(records)
assert {r['id'] for r in records if r['evidence_level']=='full_chinese_task'}==set(live['flow_entries_with_live_evidence'])|{'E09','E20'}
assert not {r['id'] for r in records if r['evidence_level']=='partial_chinese_task'}
assert {r['id'] for r in records if r['evidence_level']=='entry_only'}=={'E08'}
assert len(main)==len({i['file'] for i in main})==live['screenshot_count']+11
assert len(reference)==len({i['file'] for i in reference})==44
assert all(i['interface_language']=='中文' for i in main)
assert all(i['interface_language']!='中文' for i in reference)
assert not {i['file'] for i in main}&{i['file'] for i in reference}
assert not data['all_types_have_full_chinese_screenshot']
required=('id','name','goal','input','output','steps','ui','design','extra_load','feedback_recommendation','caution','availability','plan','status')
for r in records:
    assert all(r.get(k) for k in required),r['id']
    if not r['images']:assert r['evidence_level']=='unverified_chinese_course',r['id']
for i in all_images:
    file=ROOT/i['file']
    assert hashlib.sha256(file.read_bytes()).hexdigest()==i['sha256'],file
    with Image.open(file) as im:
        assert im.size==(i['width'],i['height']),file
        im.verify()

page_names=['report.html','reference-other-native-languages.html']
pages={name:parse((ROOT/name).read_text()) for name in page_names}
assert set(pages['report.html'].images)=={i['file'] for i in main}
assert set(pages['reference-other-native-languages.html'].images)=={i['file'] for i in reference}
assert browser['report_title']=='中文用户学英语 · Duolingo 题型与界面分析'
assert browser['catalogue_rows']==browser['cleared_filter_rows']==len(records)
assert browser['full_chinese_filter_rows']==data['counts']['entries_with_full_chinese_task_view']==25
assert browser['non_audio_filter_rows']==17
assert set(browser['non_audio_article_ids'])=={r['id'] for r in records if r['modality_section']=='non-audio'}
assert browser['pending_anchor_opens_analysis']
assert browser['main_image_sources']==list(pages['report.html'].images)
assert browser['document_scroll_width']<=browser['viewport_width']
assert browser['narrow_document_scroll_width']<=browser['narrow_viewport_width']
assert browser['flow_anchor_opens_gallery'] and browser['super_flow_anchors_open'] and browser['flow_groups']==len(live['runs'])==35
assert not browser['image_decode_failures'] and not browser['javascript_errors']
assert browser['unique_flow_screenshot_files']==live['screenshot_count']==len(live['shots'])==336
assert flow['live_type_count']==len(live['flow_entries_with_live_evidence'])==23
assert flow['core_loop_count']==len(live['core_loop_type_ids'])==17
assert live['account_verification']['active'] and live['account_verification']['plan']=='Super Duolingo'
assert not live['account_verification']['max_verified'] and not live['account_verification']['purchase_or_upgrade_performed']
assert not live['exhaustive_branch_type_ids'] and not flow['all_important_branches_captured']
assert {s['shot_id'] for run in live['runs'] for s in run['steps']}=={s['id'] for s in live['shots']}
for shot in live['shots']:
    original=ROOT.parents[2]/'output/playwright/duolingo-chinese-flow'/shot['original_capture_filename']
    assert hashlib.sha256(original.read_bytes()).hexdigest()==shot['sha256']
    assert shot['visual_reviewed'] and shot['interface_language']=='中文'

local_files={p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file()}
check_links(pages,local_files|{ZIP_NAME})

def http_check(path):
    with build_opener(ProxyHandler({})).open(PREVIEW+path,timeout=10) as response:
        assert response.status==200,path
        assert response.read()==(ROOT/path).read_bytes(),path
        return path
preview_files=page_names+[i['file'] for i in all_images]
with ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(http_check,preview_files))

verification=dict(date='2026-09-27',scope='Chinese-native -> English report; two desktop guest and three authenticated Super walkthroughs',counts=data['counts'],
    passed=dict(chinese_main_and_foreign_appendix_images_separated=True,full_partial_entry_counts_verified=True,
        record_fields_present=True,image_dimensions_and_sha256_verified=len(all_images),
        main_html_image_references=len(pages['report.html'].images),html_broken_links_or_anchors=0,
        local_http_files_match_disk=len(preview_files),archive_crc_and_resource_links=True,
        portable_markdown_images=True,report_browser=browser,live_original_screenshots_verified=len(live['shots']),live_flow_groups=len(live['runs']),core_loop_type_count=len(live['core_loop_type_ids']),all_live_shots_referenced=True),
    not_performed=['Every Chinese exercise type and all conditional branches; five sample sessions completed','Max, Adventures and cross-account/platform eligibility; one authenticated Super account sampled','Original audio quality, successful speech recognition and audio identity validation','Duolingo mobile clients and mobile keyboard; report itself checked at 390px','Application regression suite because no runtime files changed','Commit, push and website deployment'],
    remaining_evidence=[dict(id=r['id'],name=r['name'],status=r['status']) for r in records if r['evidence_level']!='full_chinese_task'],
    exhaustive_current_type_coverage=False,preview_url=PREVIEW+'report.html')
(ROOT/'verification.json').write_text(json.dumps(verification,ensure_ascii=False,indent=2)+'\n')
package_files=page_names+['REPORT.md','README.md','coverage.csv','report-data.json','adopted-images.json','reference-images.json','verification.json','sources/chinese-report-browser-check.json','sources/chinese-report-preview.png','sources/chinese-flow-preview.png','sources/chinese-flow-mobile-preview.png','FLOW_AUDIT.md','flow-data.json','flow-coverage.csv','live-flow-evidence.json']+[i['file'] for i in all_images]
with zipfile.ZipFile(ROOT/ZIP_NAME,'w',zipfile.ZIP_DEFLATED) as z:
    for name in package_files:
        payload=(ROOT/name).read_bytes()
        if name in ('REPORT.md','README.md','FLOW_AUDIT.md'):
            payload=payload.decode().replace(str(ROOT)+'/assets/','assets/').replace(f'[duolingo-chinese-english-report.zip]({ZIP_NAME})','当前解压目录').encode()
        elif name=='report.html':payload=payload.decode().replace(f'<a href="{ZIP_NAME}">离线报告包</a>','').encode()
        z.writestr(name,payload)
with zipfile.ZipFile(ROOT/ZIP_NAME) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(set(z.namelist()))==len(package_files)
    check_links({name:parse(z.read(name).decode()) for name in page_names},set(z.namelist()))
    assert str(ROOT) not in z.read('REPORT.md').decode()
    assert str(ROOT) not in z.read('FLOW_AUDIT.md').decode()
    for i in all_images:assert hashlib.sha256(z.read(i['file'])).hexdigest()==i['sha256']
print(json.dumps(dict(status='passed',main_original_images=len(main),appendix_reference_images=len(reference),local_http_files=len(preview_files),archive_files=len(package_files),archive_mib=round((ROOT/ZIP_NAME).stat().st_size/1024**2,2),counts=data['counts']),ensure_ascii=False,indent=2))
