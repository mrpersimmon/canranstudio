# canranstudio

儿童英语互动课件静态站点。

## Public routes

- `/` — 课程欢迎页
- `/lesson49/` — 新概念英语 Lesson 49
- `/lesson50/` — 新概念英语 Lesson 50
- `/soundmark/` — 音标魔法乐园
- `/home/` — 兼容入口，跳转到 `/`

## Local verification

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install chromium
npm test
```

## Runtime and font assets

The published site remains static and package-free at runtime. The pinned Fontsource 5.3.0
packages are build-time inputs only: run `npm run vendor:fonts` after `npm ci` to regenerate the
committed local font assets. The generated WOFF2 files, `fonts.css`, and copied OFL licenses all
live under `assets/fonts/`, and every public page loads its fonts from that same-origin path.

Certificate issue, print, and save entry points re-check their own course eligibility before they
act. The three course certificate experiences use native modal dialogs, and their feedback status
regions are polite and atomic. Lesson 49 exports its certificate through a Blob and revokes every
object URL after its preview is closed or cannot be created.

## Production transport

The current accepted deployment target is `http://59.110.217.36`. HTTPS, HSTS, and an
HTTP-to-HTTPS redirect are intentionally out of scope until the external filing and deployment
decision changes. H-01 remains accepted and deferred: this is a temporary accepted risk, not a
security or compliance closure.

See `deploy/README.md` for the release and verification contract.
