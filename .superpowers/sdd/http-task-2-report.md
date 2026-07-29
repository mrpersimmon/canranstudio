# HTTP Task 2: static release artifact report

Status: committed; final release SHA is reported in the task handoff.

## TDD evidence

- Initial RED: `node --test tests/deploy/static-build.test.js` failed with
  `Cannot find module '../../scripts/build-static'`.
- Security RED: a controlled temporary-sandbox test passed a repository ancestor
  through a symbolic-link alias. Before the physical-path check, the build reached
  source validation instead of rejecting its output path; the sandbox marker and
  repository remained intact.
- Review-driven RED: a source file replaced by a link after preflight was copied
  rather than rejected. The build now revalidates each file immediately before copy
  and opens it with `O_NOFOLLOW`.
- Review-driven RED: `core/` was replaced by an external symbolic-link directory
  after preflight. The build now opens the directory, verifies its current path,
  and enumerates through that open directory handle.
- Review-driven RED: after an already-open `core/` yielded `audio-player.js`, the
  directory was replaced by an external directory containing the same file name.
  The build now resolves every file and directory against the physical repository
  root before copying and rejects an escaping child path.

## Safety model

- Before any `fs.rm`, output paths are rejected when they are the repository root,
  a filesystem root, a repository ancestor, or a symbolic-link alias resolving to
  any of those locations.
- The regression probes use only `mkdtemp` sandboxes and prove their marker and
  repository are not removed.
- Allowlisted inputs reject symbolic links and non-regular files (including FIFO).
  Files are revalidated and opened with `O_NOFOLLOW`; directories are enumerated
  from an opened directory handle; each copy path must still physically resolve
  inside the repository.
- Trust boundary: Node's path APIs do not expose an `openat`/directory-fd copy API,
  so this builder assumes the working tree is not being maliciously and
  continuously mutated during a build. It rejects the controlled replacement and
  escape cases covered by the deployment tests, rather than claiming kernel-level
  atomic protection against an adversarial local writer.

## GREEN evidence

- `node --test tests/deploy/static-build.test.js`: 8 passing tests.
- `npm run test:deploy`: 8 passing tests.
- `npm test`: all 27 unit tests passed; the single real Playwright run exited and
  `test-results/.last-run.json` recorded `status: "passed"` with no failed tests.
- `npm run build:static` was run twice and `cmp` confirmed byte-identical manifest
  output.
- The pre-commit artifact contained 283 files: 282 hashed public files and
  `release-manifest.json`. Schema is `1`; the manifest does not hash itself.
- The two pre-commit manifests had SHA-256
  `d648c522cb9ef1780e1c276622cc7b18dfe873f85065daaf794acca0d2ecfa1f`.
- `git diff --check` passed.
