# POC course public route standard

Every two-lesson course has one public browser route:

```text
/poc/lesson-<first>-<last>/
```

Examples: `/poc/lesson-1-2/`, `/poc/lesson-3-4/`, and `/poc/lesson-5-6/`.

## Required behavior

- The first lesson number is a positive odd integer; the last is the immediately following integer.
- The slashless form redirects permanently to the trailing-slash form.
- An internal source path such as `/poc/lesson1-2-experience/` is not a public entry. Its root, root with trailing slash, and `index.html` redirect permanently to the canonical route.
- Asset subpaths under an old source path may remain temporarily available during a release so an already-open lesson is not broken mid-session.
- The canonical route owns a native resource namespace. Use `course/` for lesson files, `core/` for the packaged runtime, `assets/` for shared packaged assets, `review/` for the review entry, and `review-files/` for review implementation files.
- HTML, CSS, JavaScript, catalog data, and package manifests must already reference that canonical namespace before deployment. Nginx must not rewrite response bodies with `sub_filter`; doing so invalidates content hashes and makes first-load behavior depend on server transformations.
- The course Content Security Policy permits same-origin package requests and workers with `connect-src 'self'` and `worker-src 'self'`. The canonical service-worker response declares `Service-Worker-Allowed: /poc/lesson-<first>-<last>/`.
- The canonical route is backed by an isolated, commit-numbered release and an atomic `current` symlink.
- Before handoff, verify the canonical route in a real browser, verify the legacy redirect, and verify representative image, audio range, package-manifest, and service-worker responses.

## Adding the next course

Name its Nginx snippet `canranstudio-lesson-<first>-<last>-location.conf`. The deployment-contract test scans every snippet with that name and rejects noncanonical lesson pairs, missing slash normalization, legacy entry exposure, a non-isolated release root, response-body rewriting, or an incomplete canonical resource namespace.
