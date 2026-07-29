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

## Production transport

The current accepted deployment target is `http://59.110.217.36`. HTTPS, HSTS, and an
HTTP-to-HTTPS redirect are intentionally out of scope until the external filing and deployment
decision changes. This is a temporary accepted risk, not a security or compliance closure.

See `deploy/README.md` for the release and verification contract.
