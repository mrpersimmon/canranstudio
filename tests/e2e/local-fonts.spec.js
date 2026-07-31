'use strict';

const { test, expect } = require('@playwright/test');
const { PUBLISHED_COURSES } = require('../../scripts/course-registry');

const ZCOOL_FACES = [
  {
    family: 'ZCOOL KuaiLe',
    weight: 400,
    text: 'Canran',
    file: 'zcool-kuaile-latin-400.woff2'
  },
  {
    family: 'ZCOOL KuaiLe',
    weight: 400,
    text: '快乐中文',
    file: 'zcool-kuaile-chinese-simplified-400.woff2'
  }
];
const BALOO_FACES = [500, 700, 800].map(weight => ({
  family: 'Baloo 2',
  weight,
  text: 'Canran',
  file: `baloo-2-latin-${weight}.woff2`
}));
const FREDOKA_FACES = [400, 500, 600, 700].map(weight => ({
  family: 'Fredoka',
  weight,
  text: 'Canran',
  file: `fredoka-latin-${weight}.woff2`
}));

const fontRoutes = ['/', ...PUBLISHED_COURSES.map(course => course.route)];
for (const route of fontRoutes) {
  test(`${route} loads its selected fonts without Google requests`, async ({ page }) => {
    const externalFonts = [];
    const localRequests = [];
    const localResponses = [];
    const localFailures = [];
    const localOrigins = [];
    const assetPath = url => {
      const parsed = new URL(url);
      const pathname = parsed.pathname;
      if (pathname.startsWith('/assets/fonts/')) localOrigins.push(parsed.origin);
      return pathname.startsWith('/assets/fonts/') ? pathname : null;
    };
    page.on('request', request => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) {
        externalFonts.push(request.url());
      }
      const pathname = assetPath(request.url());
      if (pathname) localRequests.push(pathname);
    });
    page.on('response', response => {
      const pathname = assetPath(response.url());
      if (!pathname) return;
      localResponses.push({
        path: pathname,
        status: response.status(),
        contentType: response.headers()['content-type'] || ''
      });
    });
    page.on('requestfailed', request => {
      const pathname = assetPath(request.url());
      if (pathname) {
        localFailures.push({
          path: pathname,
          error: request.failure()?.errorText || 'unknown request failure'
        });
      }
    });

    await page.goto(route);
    const requiredFaces = [
      ...ZCOOL_FACES,
      ...(['/soundmark/', '/lesson51/'].includes(route) ? FREDOKA_FACES : BALOO_FACES),
      ...(route === '/lesson54/' ? FREDOKA_FACES : [])
    ];
    const loadedFaces = await page.evaluate(async faces => Promise.all(
      faces.map(async face => {
        const matches = await document.fonts.load(
          `${face.weight} 16px "${face.family}"`,
          face.text
        );
        return {
          family: face.family,
          weight: String(face.weight),
          text: face.text,
          matches: matches.map(match => ({
            family: match.family,
            weight: match.weight,
            style: match.style,
            status: match.status
          }))
        };
      })
    ), requiredFaces);
    await page.evaluate(() => document.fonts.ready);

    expect(externalFonts).toEqual([]);
    expect([...new Set(localOrigins)]).toEqual([new URL(page.url()).origin]);
    expect(localFailures).toEqual([]);
    expect(loadedFaces).toEqual(requiredFaces.map(face => ({
      family: face.family,
      weight: String(face.weight),
      text: face.text,
      matches: [{
        family: face.family,
        weight: String(face.weight),
        style: 'normal',
        status: 'loaded'
      }]
    })));

    const expectedPaths = [
      '/assets/fonts/fonts.css',
      ...requiredFaces.map(face => `/assets/fonts/${face.file}`)
    ].sort();
    expect([...new Set(localRequests)].sort()).toEqual(expectedPaths);
    expect(localResponses.map(response => response.path).sort()).toEqual(expectedPaths);

    const stylesheet = localResponses.find(response => response.path.endsWith('/fonts.css'));
    expect(stylesheet).toEqual({
      path: '/assets/fonts/fonts.css',
      status: 200,
      contentType: expect.stringMatching(/^text\/css(?:;|$)/i)
    });
    for (const response of localResponses.filter(item => item.path.endsWith('.woff2'))) {
      expect(response.status, response.path).toBe(200);
      expect(response.contentType.toLowerCase(), response.path).toBe('font/woff2');
    }
  });
}
