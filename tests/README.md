# Tests

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install chromium
npm run test:unit
npm run test:state
npm test
```

`test:unit` verifies storage, finite ratings, first-attempt scoring, and stable option identity.
`test:state` verifies the four pages against the repository-local static server.
`npm test` is the complete pre-commit gate.

The soundmark v1 integer cannot identify completed challenges. Its one-time v2 migration therefore
resets soundmark progress to zero. Lesson 49 and Lesson 50 preserve and clamp legacy level ratings.
