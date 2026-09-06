#!/usr/bin/env python3
"""Activate a verified home-only release; invoke as root on the existing host."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import time


def sha(data):
    return hashlib.sha256(data).hexdigest()


def run(*args):
    return subprocess.check_output(args, stderr=subprocess.STDOUT).decode()


def replace_link(link, target):
    temp = link.with_name(link.name + '.next')
    if temp.exists() or temp.is_symlink():
        raise RuntimeError('Unexpected pending link: ' + str(temp))
    temp.symlink_to(target)
    os.replace(str(temp), str(link))


def main():
    if os.geteuid() != 0:
        raise RuntimeError('Run with sudo')
    archive, config, archive_sha, old_config_sha, commit = sys.argv[1:]
    if not re.fullmatch('[a-f0-9]{40}', commit):
        raise RuntimeError('Invalid commit')
    archive, config = Path(archive), Path(config)
    if sha(archive.read_bytes()) != archive_sha:
        raise RuntimeError('Uploaded archive checksum mismatch')
    current_config = Path('/etc/nginx/conf.d/lesson49.conf')
    if sha(current_config.read_bytes()) != old_config_sha:
        raise RuntimeError('Observed site configuration changed; inspect again')
    config_bytes = config.read_bytes()
    release_id = commit + '-' + archive_sha[:12]
    root = Path('/var/www/canranstudio-learning-path')
    releases = root / 'releases'
    releases.mkdir(parents=True, exist_ok=True)
    release = releases / release_id
    staging = releases / ('.staging-' + release_id)
    if release.exists() or staging.exists():
        raise RuntimeError('Release path already exists')
    staging.mkdir()
    with tarfile.open(str(archive), 'r:gz') as tar:
        seen = set()
        for member in tar.getmembers():
            name = member.name
            while name.startswith('./'):
                name = name[2:]
            if name in ('', '.') and member.isdir():
                continue
            parts = name.split('/')
            if name.startswith('/') or '..' in parts or any(p.startswith('._') for p in parts) or name in seen:
                raise RuntimeError('Unsafe archive member')
            seen.add(name)
            target = staging / name
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True)
            elif member.isfile():
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(tar.extractfile(member).read())
                target.chmod(0o644)
            else:
                raise RuntimeError('Links and special entries are not allowed')
    manifest = json.loads((staging / 'release-manifest.json').read_text())
    if manifest['schema'] != 2 or manifest['commit'] != commit:
        raise RuntimeError('Release manifest commit mismatch')
    actual = set(str(p.relative_to(staging)) for p in staging.rglob('*') if p.is_file())
    if actual != set(manifest['files']) | {'release-manifest.json'}:
        raise RuntimeError('Release file set differs from manifest')
    for name, expected in manifest['files'].items():
        if sha((staging / name).read_bytes()) != expected:
            raise RuntimeError('Release file checksum mismatch: ' + name)
    if set(p for p in actual if p.endswith('.html')) != {'index.html'}:
        raise RuntimeError('Only the current home page may be published')
    os.replace(str(staging), str(release))

    # Validate the complete effective configuration before changing the live file.
    master = Path('/etc/nginx/nginx.conf').read_text()
    include = 'include /etc/nginx/conf.d/*.conf;'
    if master.count(include) != 1:
        raise RuntimeError('Unexpected Nginx include structure')
    conf_files = sorted(Path('/etc/nginx/conf.d').glob('*.conf'))
    includes = '\n'.join('include ' + str(config if p == current_config else p) + ';' for p in conf_files)
    candidate = config.parent / 'nginx-candidate.conf'
    candidate.write_text(master.replace(include, includes))
    run('nginx', '-t', '-c', str(candidate))

    stamp = datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    backup = Path('/var/backups/canranstudio') / (stamp + '-' + release_id[:12])
    backup.mkdir(parents=True, mode=0o700)
    shutil.copy2(str(current_config), str(backup / 'lesson49.conf'))
    (backup / 'nginx-before.txt').write_text(run('nginx', '-T'))
    link = root / 'current'
    previous = os.readlink(str(link)) if link.is_symlink() else None
    if link.exists() and previous is None:
        raise RuntimeError('Current release is not a symlink')
    if sha(current_config.read_bytes()) != old_config_sha:
        raise RuntimeError('Site changed while preparing release')
    state = {'commit': commit, 'release': str(release), 'backup': str(backup),
             'previousLearningPath': previous, 'oldConfigSha256': old_config_sha,
             'newConfigSha256': sha(config_bytes), 'archiveSha256': archive_sha,
             'previousMainRelease': os.path.realpath('/var/www/canranstudio/current')}
    (backup / 'activation.json').write_text(json.dumps(state, indent=2) + '\n')
    try:
        replace_link(link, 'releases/' + release_id)
        candidate_live = current_config.with_name('lesson49.conf.next')
        candidate_live.write_bytes(config_bytes)
        candidate_live.chmod(0o644)
        os.replace(str(candidate_live), str(current_config))
        run('nginx', '-t')
        run('systemctl', 'reload', 'nginx')
        for attempt in range(10):
            response = subprocess.check_output(['curl', '--silent', '--show-error', '--fail',
                '--resolve', 'www.canranstudio.cn:443:127.0.0.1', 'https://www.canranstudio.cn/'])
            if sha(response) == manifest['files']['index.html']:
                break
            time.sleep(0.3)
        else:
            raise RuntimeError('Live home page does not match the verified release')
    except Exception:
        shutil.copy2(str(backup / 'lesson49.conf'), str(current_config))
        if previous is None:
            link.unlink()
        else:
            replace_link(link, previous)
        run('nginx', '-t')
        run('systemctl', 'reload', 'nginx')
        raise
    state['activatedAt'] = stamp
    state['status'] = 'active'
    (backup / 'activation.json').write_text(json.dumps(state, indent=2) + '\n')
    print(json.dumps(state, indent=2))


if __name__ == '__main__':
    main()
