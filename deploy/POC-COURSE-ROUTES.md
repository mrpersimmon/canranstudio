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
- The canonical route is backed by an isolated, commit-numbered release and an atomic `current` symlink.
- Before handoff, verify the canonical route in a real browser, verify the legacy redirect, and verify representative image, audio range, package-manifest, and service-worker responses.

## Adding the next course

Name its Nginx snippet `canranstudio-lesson-<first>-<last>-location.conf`. The deployment-contract test scans every snippet with that name and rejects noncanonical lesson pairs, missing slash normalization, legacy entry exposure, or a non-isolated release root.
