# canranstudio

儿童英语互动课件静态站点。

## Public routes

- `/` — 课程欢迎页
- `/lesson49/` — 新概念英语 Lesson 49
- `/lesson50/` — 新概念英语 Lesson 50
- `/lesson51/` — 新概念英语 Lesson 51《A Pleasant Climate》
- `/lesson52/` — 新概念英语 Lesson 52《What Nationality Are They?》环球护照之旅 Ⅰ
- `/lesson54/` — 新概念英语 Lesson 54《Where Do They Come From?》环球护照之旅 Ⅱ
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

Certificate issue, print, and save entry points re-check their own course eligibility before they act. The five course certificate experiences provide accessible, polite, atomic feedback. Lessons 49, 50, 51, 52, and 54 require exactly 15/15 stars; soundmark requires exactly 12/12 stars. Lesson 49 continues to export through a Blob and revoke every object URL after preview closure, authorization loss, or creation failure.

## Production transport

The current accepted deployment target is `http://59.110.217.36`. HTTPS, HSTS, and an
HTTP-to-HTTPS redirect are intentionally out of scope until the external filing and deployment
decision changes. RISK-HTTP-01 remains accepted and deferred.

See `deploy/README.md` for the release and verification contract.
