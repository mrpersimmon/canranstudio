#!/bin/sh
# Install as an executable in /etc/letsencrypt/renewal-hooks/deploy/.
# Only this preview certificate triggers a reload through this hook.
set -eu
if [ "${RENEWED_LINEAGE:-}" = /etc/letsencrypt/live/preview.canranstudio.cn ]; then
 /usr/sbin/nginx -t
 /usr/bin/systemctl reload nginx
fi
