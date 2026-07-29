# HTTP deployment runbook

## Scope and non-goals

Production is intentionally served at http://59.110.217.36. This runbook does **not** configure TLS
or HTTPS, redirect HTTP to HTTPS, or add HSTS. It does not establish ICP or any other regulatory
compliance. H-01 (public HTTP transport) remains accepted and deferred; a successful release is
not a finding closure.

The procedure publishes only a clean, committed artifact. It does not delete old releases or
automatically disable, overwrite, rename, or remove an unknown site configuration.

## 1. Local exact-SHA release gate

Run this from the intended release commit, before making the archive. Do not continue if either
Git command emits output.

~~~bash
npm ci
npx playwright install chromium
npm test
npm run test:deploy
npm run build:static
git diff --check
git status --short
git diff --quiet
git diff --cached --quiet
RELEASE_SHA="$(git rev-parse --verify HEAD)"
test "$(git status --short)" = ""
test "$(node -p "require('./dist/release-manifest.json').commit")" = "$RELEASE_SHA"
printf '%s\n' "$RELEASE_SHA"
~~~

Record the printed SHA as RELEASE_SHA. dist/release-manifest.json is the exact local artifact that
the post-deploy verifier will compare with production.

## 2. Read-only server preflight and manual configuration gate

Set the SSH destination in the shell; it is deliberately not stored in the repository. The
commands below do not change the server.

~~~bash
test -n "$CANRAN_DEPLOY_TARGET"
ssh "$CANRAN_DEPLOY_TARGET" 'sudo nginx -T 2>&1'
ssh "$CANRAN_DEPLOY_TARGET" 'readlink -f /var/www/canranstudio/current || true'
ssh "$CANRAN_DEPLOY_TARGET" 'sudo sha256sum /etc/nginx/conf.d/canranstudio-http.conf 2>/dev/null || true'
~~~

Inspect the complete nginx -T output. Identify **every** loaded server block that can answer
59.110.217.36:80, including default_server, wildcard server_name values, and IPv4/IPv6 listeners.
Do not continue while an unaccounted rewrite, alias, root, or default block can own one of /,
/lesson49/, /lesson50/, or /soundmark/.

This is a manual observed-file gate. If an older site file must be retired, first back up and
obtain approval for that exact file observed in nginx -T, then disable only that file. Its path
must not be guessed from this repository. Before the install step, also compare the observed hash
and contents of /etc/nginx/conf.d/canranstudio-http.conf; stop if it is not the known,
operator-approved repository-owned configuration.

The routine below requires an existing, valid current release so that rollback is available. A
first-time bootstrap without one is a separate, reviewed operation and must not be presented as
an atomic rollback-capable release.

## 3. Build and upload the immutable candidate

The SHA check prevents shell interpolation through release names. Upload the archived dist/ and
the repository-owned Nginx candidate, but do not install either yet.

~~~bash
RELEASE_SHA="$(git rev-parse --verify HEAD)"
printf '%s' "$RELEASE_SHA" | grep -Eq '^[0-9a-f]{40}$'
test "$(node -p "require('./dist/release-manifest.json').commit")" = "$RELEASE_SHA"
RELEASE_ARCHIVE="/tmp/canranstudio-$RELEASE_SHA.tar.gz"
tar -C dist -czf "$RELEASE_ARCHIVE" .
scp "$RELEASE_ARCHIVE" "$CANRAN_DEPLOY_TARGET:/tmp/canranstudio-$RELEASE_SHA.tar.gz"
scp deploy/nginx/canranstudio-http.conf "$CANRAN_DEPLOY_TARGET:/tmp/canranstudio-http.conf"
~~~

## 4. Install, test the candidate configuration, and atomically activate

Run this single remote transaction from the same clean checkout. It acquires a deployment lock,
unpacks into a unique staging directory, checks the manifest commit, and atomically renames that
directory only after the check. It records and validates the old current target. It then stages
the Nginx candidate at its real path, runs nginx -t before changing content, and restores that
candidate configuration if the syntax test fails.

current is changed with a temporary symlink in the **same directory** followed by mv -T; on the
target filesystem this is an atomic rename, so there is no unlink/relink window. On a reload
failure, the script switches the link and configuration back to the recorded release and attempts
a validating reload. For a later live-verification failure, use the executable rollback in section
6. If the recovery reload fails, do not continue serving changes: preserve the printed evidence
and escalate to the server operator.

~~~bash
RELEASE_SHA="$(git rev-parse --verify HEAD)"
printf '%s' "$RELEASE_SHA" | grep -Eq '^[0-9a-f]{40}$'

ssh "$CANRAN_DEPLOY_TARGET" 'bash -s -- "$@"' -- "$RELEASE_SHA" <<'REMOTE'
set -euo pipefail

release_sha=$1
is_sha() { printf '%s' "$1" | grep -Eq '^[0-9a-f]{40}$'; }
is_sha "$release_sha"

site_root=/var/www/canranstudio
releases="$site_root/releases"
current="$site_root/current"
archive="/tmp/canranstudio-$release_sha.tar.gz"
candidate="$releases/$release_sha"
stage="$releases/.$release_sha.staging.$$"
lock="$releases/.deploy.lock"
nginx_conf=/etc/nginx/conf.d/canranstudio-http.conf
nginx_backup="/etc/nginx/conf.d/.canranstudio-http.conf.$release_sha.predeploy"
next_link="$site_root/.current.$release_sha.$$.new"
old_target=''
had_nginx_conf=0

cleanup() {
  status=$?
  if [ -n "$stage" ] && sudo test -d "$stage"; then sudo rm -rf -- "$stage"; fi
  if [ -n "$next_link" ] && { sudo test -e "$next_link" || sudo test -L "$next_link"; }; then
    sudo rm -f -- "$next_link"
  fi
  if [ -n "$lock" ]; then sudo rmdir -- "$lock" 2>/dev/null || true; fi
  exit "$status"
}
trap cleanup EXIT

sudo install -d -m 0755 "$releases"
if ! sudo mkdir -- "$lock"; then
  echo 'another deployment owns the release lock; aborting' >&2
  exit 1
fi
if sudo test -e "$candidate" || sudo test -L "$candidate"; then
  echo "refusing to reuse existing release directory: $candidate" >&2
  exit 1
fi
if sudo test -e "$stage" || sudo test -L "$stage"; then
  echo "refusing to reuse staging directory: $stage" >&2
  exit 1
fi
sudo test -f "$archive"

old_target="$(sudo readlink -f "$current" || true)"
case "$old_target" in "$releases"/*) ;; *) echo 'current is missing or outside releases; use reviewed bootstrap' >&2; exit 1;; esac
old_sha="$(basename "$old_target")"
is_sha "$old_sha"
sudo test -f "$old_target/release-manifest.json"
test "$(sudo sed -nE 's/^[[:space:]]*"commit"[[:space:]]*:[[:space:]]*"([0-9a-f]{40})",?[[:space:]]*$/\1/p' "$old_target/release-manifest.json")" = "$old_sha"
printf 'recorded previous release: %s\n' "$old_target"

if sudo test -e "$nginx_conf" || sudo test -L "$nginx_conf"; then
  had_nginx_conf=1
  sudo cp -p -- "$nginx_conf" "$nginx_backup"
fi

# Reject traversal before extracting; the archive must contain relative entries only.
sudo tar -tzf "$archive" | LC_ALL=C awk '
  { sub(/^\.\//, ""); if ($0 == "" || $0 ~ /^\// || $0 ~ /(^|\/)\.\.($|\/)/) exit 1 }
  END { if (NR == 0) exit 1 }
'
sudo mkdir -m 0755 -- "$stage"
sudo tar -xzf "$archive" --no-same-owner --no-same-permissions -C "$stage"
sudo test -f "$stage/release-manifest.json"
test "$(sudo sed -nE 's/^[[:space:]]*"commit"[[:space:]]*:[[:space:]]*"([0-9a-f]{40})",?[[:space:]]*$/\1/p' "$stage/release-manifest.json")" = "$release_sha"
sudo mv -T -- "$stage" "$candidate"
stage=''

restore_nginx_candidate() {
  if [ "$had_nginx_conf" -eq 1 ]; then
    sudo mv -f -- "$nginx_backup" "$nginx_conf"
  else
    sudo rm -f -- "$nginx_conf"
  fi
}

sudo install -m 0644 -- /tmp/canranstudio-http.conf "$nginx_conf"
if ! sudo nginx -t; then
  restore_nginx_candidate
  echo 'candidate Nginx configuration failed syntax validation; release link was not changed' >&2
  exit 1
fi

sudo ln -s -- "$candidate" "$next_link"
sudo mv -Tf -- "$next_link" "$current"
next_link=''

if ! sudo systemctl reload nginx; then
  echo 'reload failed; restoring recorded release and prior configuration' >&2
  sudo ln -s -- "$old_target" "$next_link"
  sudo mv -Tf -- "$next_link" "$current"
  next_link=''
  restore_nginx_candidate
  sudo nginx -t
  sudo systemctl reload nginx
  exit 1
fi

echo "activated release: $candidate"
echo "previous release retained: $old_target"
if [ "$had_nginx_conf" -eq 1 ]; then
  echo "configuration backup retained: $nginx_backup"
fi
REMOTE
~~~

Do not delete the old release directory. The printed previous release is the rollback artifact.
The retained .predeploy Nginx copy is also required if the configuration must be rolled back.

## 5. Exact-release live verification

Only after the activation command reports success, run the verifier from the same local checkout
whose dist/ manifest was uploaded. It must report five 200 responses with identical SHA-256
values for /, /lesson49/, /lesson50/, /soundmark/, and /release-manifest.json, and each response
must carry the expected HTTP security headers.

~~~bash
test "$(git rev-parse --verify HEAD)" = "$RELEASE_SHA"
test "$(node -p "require('./dist/release-manifest.json').commit")" = "$RELEASE_SHA"
npm run verify:live:http
ssh "$CANRAN_DEPLOY_TARGET" 'cat /var/www/canranstudio/current/release-manifest.json'
~~~

Confirm that both manifests name RELEASE_SHA. A local build or verifier success alone is not live
evidence.

## 6. Executable rollback

Use only the exact previous release printed by the activation command. If that command reported a
configuration backup, set CANRAN_NGINX_BACKUP_RELEASE to the SHA embedded in that printed backup
path (normally the failed candidate RELEASE_SHA). Both environment values are validated before
use; the SHA and fixed path shape prevent them from selecting arbitrary server paths. This
rollback preserves the failed new release for diagnosis.

~~~bash
test -n "$CANRAN_PREVIOUS_RELEASE"
printf '%s' "$CANRAN_PREVIOUS_RELEASE" | grep -Eq '^[0-9a-f]{40}$'
test -n "$CANRAN_NGINX_BACKUP_RELEASE"
printf '%s' "$CANRAN_NGINX_BACKUP_RELEASE" | grep -Eq '^[0-9a-f]{40}$'

ssh "$CANRAN_DEPLOY_TARGET" 'bash -s -- "$@"' -- "$CANRAN_PREVIOUS_RELEASE" "$CANRAN_NGINX_BACKUP_RELEASE" <<'REMOTE'
set -euo pipefail
previous_sha=$1
backup_sha=$2
printf '%s' "$previous_sha" | grep -Eq '^[0-9a-f]{40}$'
printf '%s' "$backup_sha" | grep -Eq '^[0-9a-f]{40}$'

site_root=/var/www/canranstudio
releases="$site_root/releases"
current="$site_root/current"
previous="$releases/$previous_sha"
nginx_conf=/etc/nginx/conf.d/canranstudio-http.conf
nginx_backup="/etc/nginx/conf.d/.canranstudio-http.conf.$backup_sha.predeploy"
next_link="$site_root/.current.rollback.$previous_sha.$$.new"

sudo test -d "$previous"
sudo test -f "$previous/release-manifest.json"
test "$(sudo sed -nE 's/^[[:space:]]*"commit"[[:space:]]*:[[:space:]]*"([0-9a-f]{40})",?[[:space:]]*$/\1/p' "$previous/release-manifest.json")" = "$previous_sha"

sudo test -f "$nginx_backup"
sudo cp -p -- "$nginx_backup" "$nginx_conf"
sudo nginx -t
sudo ln -s -- "$previous" "$next_link"
sudo mv -Tf -- "$next_link" "$current"
sudo systemctl reload nginx
printf 'rolled back to: %s\n' "$previous"
REMOTE
~~~

Rebuild dist/ at the rollback SHA, then run npm run verify:live:http; otherwise the expected hash
comparison will fail. Do not remove either release while the outcome is being investigated.
