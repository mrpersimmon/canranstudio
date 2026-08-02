# canranstudio

儿童英语互动课件静态站点。

## Public routes

- `/` — 课程欢迎页
- `/lesson49/` — 新概念英语 Lesson 49
- `/lesson49/present/` — Lesson 49 公开课堂投屏
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

For a clean V1 release candidate, run the complete local boundary gate:

```bash
npm run verify:v1:release
```

This command runs unit, browser, deployment-contract, and exact static-build verification. It
does not commit, push, deploy, or change ICP, DNS, TLS, or the accepted HTTP origin. The final
build step deliberately refuses public files that differ from `HEAD`.

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

See `docs/course-authoring.md` for the single-catalog workflow used when adding another numbered
Lesson while the V1 map remains limited to Lesson 49–60.

See `docs/classroom-presentation.md` for the public, device-data-free classroom presentation contract.

See `docs/mobile-release-smoke-checklist.md` for the required real-device WeChat, iPhone Safari,
and Android Chromium evidence. Those checks remain manual and must not be replaced by desktop
browser simulation.

See `docs/superpowers/qa/2026-08-02-v1-map-09-public-static-boundary.md` for the public, indexable,
credential-free static V1 release boundary and its automated/manual evidence split.

See `docs/v1-map-usability-pilot-toolkit.md` and its linked workbook for the blank, privacy-safe
two-round child usability and teacher-presentation trial kit. Actual trial results remain an
institution-run manual requirement.

Lesson 49 is the first catalog-declared classroom presentation. Its standalone public route uses
the existing same-origin recordings and deliberately omits device progress and profile runtimes.
