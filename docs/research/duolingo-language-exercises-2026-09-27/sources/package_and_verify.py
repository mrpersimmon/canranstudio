from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from urllib.request import build_opener, ProxyHandler
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parent.parent
ZIP_NAME = 'duolingo-english-report.zip'
PREVIEW = 'http://127.0.0.1:59042/'

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.local_links = []
        self.anchors = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'img':
            assert a.get('alt'), 'Image missing alt text'
            self.images.append(a['src'])
        for field in ('src', 'href'):
            value = a.get(field, '')
            if value.startswith('#'):
                self.anchors.append(unquote(value[1:]))
            elif value and not urlsplit(value).scheme and not value.startswith('//'):
                self.local_links.append(unquote(urlsplit(value).path))

def check_page(content, files):
    page = Page()
    page.feed(content)
    assert len(page.ids) == len(set(page.ids)), 'Duplicate HTML ids'
    assert set(page.anchors) <= set(page.ids), 'Broken internal anchors'
    assert set(page.local_links) <= files, sorted(set(page.local_links) - files)
    return page

data = json.loads((ROOT / 'report-data.json').read_text())
images = json.loads((ROOT / 'adopted-images.json').read_text())
sources = json.loads((ROOT / 'sources/source-link-check.json').read_text())
browser_check = json.loads((ROOT / 'sources/report-browser-check.json').read_text())
assert len(data['records']) == 31
assert len(data['modes']) == 5
assert sum(any(i['full_task_view'] for i in r['images']) for r in data['records']) == 29
assert {r['id'] for r in data['records'] if not r['images']} == {'S03', 'M01'}
assert len(images) == len({i['file'] for i in images}) == 48
assert [r['id'] for r in data['records'] if r['modality_section']=='non-audio'] == browser_check['non_audio_article_ids']
assert data['counts']['entries_without_required_listening_or_speaking'] == browser_check['non_audio_filter_rows'] == 15
assert browser_check['cleared_filter_rows'] == len(data['records'])
assert {s['url'] for s in data['sources']} == {s['url'] for s in sources}
assert all(s['status'] == 200 for s in sources)
required = ('id', 'name', 'goal', 'input', 'output', 'steps', 'ui', 'design', 'caution', 'availability', 'plan', 'status')
for r in data['records']:
    assert all(r.get(k) for k in required), r['id']
for i in images:
    p = ROOT / i['file']
    assert hashlib.sha256(p.read_bytes()).hexdigest() == i['sha256'], p
    with Image.open(p) as im:
        assert im.size == (i['width'], i['height']), p
        im.verify()

local_files = {p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file()}
page = check_page((ROOT / 'report.html').read_text(), local_files | {ZIP_NAME})
assert len(page.images) == 52
assert set(page.images) == {i['file'] for i in images}

def http_check(path):
    opener = build_opener(ProxyHandler({}))
    with opener.open(PREVIEW + path, timeout=8) as response:
        payload = response.read()
        assert response.status == 200, path
        assert payload == (ROOT / path).read_bytes(), path
        return path

preview_files = ['report.html'] + [i['file'] for i in images]
with ThreadPoolExecutor(max_workers=6) as pool:
    assert len(list(pool.map(http_check, preview_files))) == 49

verification = {
    'date': '2026-09-27',
    'scope': 'English-target-language report artifacts; no application runtime changes',
    'counts': data['counts'],
    'passed': {
        'all_record_fields_present': True,
        'all_adopted_images_decode': True,
        'all_adopted_image_dimensions_match': True,
        'all_adopted_image_sha256_match': True,
        'html_image_references': len(page.images),
        'html_duplicate_ids': 0,
        'html_broken_internal_anchors': 0,
        'html_broken_local_links': 0,
        'official_source_pages_http_200': len(sources),
        'local_preview_and_all_image_files_http_200': 49,
        'local_http_payload_matches_disk': True,
        'offline_archive_crc_and_resource_links': True,
        'offline_markdown_image_paths_portable': True,
        'report_non_audio_section_visual_check': True,
        'report_navigation_and_filter': browser_check,
    },
    'not_performed': [
        'Live Duolingo account walkthrough across English courses, plans and clients',
        'Microphone, speech recognition, audio content and dynamic feedback validation',
        'Full report rendering on additional devices and viewport sizes',
        'Application regression suite, because no runtime files were changed',
        'Commit, push and website deployment',
    ],
    'incomplete_evidence': ['S03 English story free-writing screenshot', 'M01 English Roleplay chat screenshot', 'Additional candidate types and modes listed in report section 8'],
    'preview_url': PREVIEW + 'report.html',
    'exhaustive_current_type_coverage': False,
}

package_files = ['report.html', 'REPORT.md', 'README.md', 'coverage.csv', 'report-data.json', 'adopted-images.json', 'verification.json', 'sources/source-link-check.json', 'sources/report-browser-check.json'] + [i['file'] for i in images]
(ROOT / 'verification.json').write_text(json.dumps(verification, ensure_ascii=False, indent=2) + '\n')
with zipfile.ZipFile(ROOT / ZIP_NAME, 'w', zipfile.ZIP_DEFLATED) as z:
    for name in package_files:
        payload = (ROOT / name).read_bytes()
        if name == 'REPORT.md':
            payload = payload.decode().replace(str(ROOT) + '/assets/', 'assets/').encode()
        elif name == 'report.html':
            payload = payload.decode().replace('<a href="duolingo-english-report.zip">离线报告包</a>', '').encode()
        z.writestr(name, payload)
with zipfile.ZipFile(ROOT / ZIP_NAME) as z:
    assert z.testzip() is None
    assert len(z.namelist()) == len(set(z.namelist())) == len(package_files)
    check_page(z.read('report.html').decode(), set(z.namelist()))
    assert str(ROOT) not in z.read('REPORT.md').decode()
    for i in images:
        assert hashlib.sha256(z.read(i['file'])).hexdigest() == i['sha256']
check_page((ROOT / 'report.html').read_text(), local_files | {ZIP_NAME})
print(json.dumps({'counts': data['counts'], 'archive_files': len(package_files), 'archive_MiB': round((ROOT / ZIP_NAME).stat().st_size / 1024 ** 2, 2), 'checks': 'passed', 'browser_rendering': 'non-audio section and directory filter checked; other viewports not checked'}, ensure_ascii=False, indent=2))
