'use strict';

const { test, expect } = require('@playwright/test');
const { PUBLISHED_COURSES } = require('../../core/course-catalog');
const { PROFILE_KEY } = require('../../core/device-profile');

const BASE_ORIGIN = 'http://127.0.0.1:4173';
const PUBLIC_ROUTES = [
  { id: 'home', route: '/' },
  ...PUBLISHED_COURSES.map(course => ({ id: course.id, route: course.route }))
];
const AUDIO_PROBES = [
  { id: 'lesson49', route: '/lesson49/', selector: '.spk:visible' },
  { id: 'lesson50', route: '/lesson50/', selector: '.spk:visible' },
  { id: 'lesson51', route: '/lesson51/', selector: '.spk:visible' },
  { id: 'lesson52', route: '/lesson52/', selector: '.spk:visible' },
  { id: 'lesson54', route: '/lesson54/', selector: '.spk:visible' },
  { id: 'soundmark', route: '/soundmark/', selector: '#g1Hear' }
];
const ALLOWED_STORAGE_KEYS = new Set([
  PROFILE_KEY,
  ...PUBLISHED_COURSES.flatMap(course => [
    course.progress?.key,
    course.progress?.legacyKey
  ]).filter(Boolean)
]);
const PRIVATE_FIELD = /^(?:anonymous|auth|child|client|device|session|student|user|visitor)[_-]?(?:id|token|uuid)$/i;

async function installBoundaryInstrumentation(page) {
  await page.addInitScript(() => {
    const events = window.__v1BoundaryEvents = {
      cookieWrites: [],
      serviceCalls: [],
      storageWrites: []
    };

    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function boundarySetItem(key, value) {
      events.storageWrites.push([String(key), String(value)]);
      return Reflect.apply(originalSetItem, this, [key, value]);
    };

    if (typeof window.fetch === 'function') {
      const originalFetch = window.fetch;
      window.fetch = function boundaryFetch(...args) {
        const input = args[0];
        events.serviceCalls.push(['fetch', String(input?.url ?? input)]);
        return Reflect.apply(originalFetch, this, args);
      };
    }

    if (typeof XMLHttpRequest === 'function') {
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function boundaryOpen(method, url, ...rest) {
        events.serviceCalls.push(['xhr', String(url)]);
        return Reflect.apply(originalOpen, this, [method, url, ...rest]);
      };
    }

    if (typeof navigator.sendBeacon === 'function') {
      const originalBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function boundaryBeacon(url, data) {
        events.serviceCalls.push(['beacon', String(url)]);
        return originalBeacon(url, data);
      };
    }

    for (const constructorName of ['WebSocket', 'EventSource']) {
      const Original = window[constructorName];
      if (typeof Original !== 'function') continue;
      window[constructorName] = new Proxy(Original, {
        construct(target, args, newTarget) {
          events.serviceCalls.push([constructorName.toLowerCase(), String(args[0])]);
          return Reflect.construct(target, args, newTarget);
        }
      });
    }

    const cookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    if (cookie?.get && cookie?.set) {
      try {
        Object.defineProperty(document, 'cookie', {
          configurable: true,
          get() {
            return cookie.get.call(document);
          },
          set(value) {
            events.cookieWrites.push(String(value));
            return cookie.set.call(document, value);
          }
        });
      } catch {
        // context.cookies() below remains the independent cookie readback.
      }
    }

    if (navigator.serviceWorker?.register) {
      const originalRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
      navigator.serviceWorker.register = function boundaryRegister(url, options) {
        events.serviceCalls.push(['service-worker', String(url)]);
        return originalRegister(url, options);
      };
    }
  });
}

async function installAudioProbe(page) {
  await page.addInitScript(() => {
    window.__audioAttempts = [];
    window.__speechAttempts = [];

    window.Audio = class BoundaryAudio extends EventTarget {
      constructor(src = '') {
        super();
        this.src = new URL(String(src), location.href).href;
        this.currentTime = 0;
        this.paused = true;
        window.__audioAttempts.push(this.src);
      }
      play() {
        this.paused = false;
        return Promise.resolve();
      }
      pause() {
        this.paused = true;
      }
    };

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        addEventListener() {},
        cancel() {},
        getVoices() { return []; },
        speak(utterance) { window.__speechAttempts.push(utterance.text); }
      }
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class BoundaryUtterance {
        constructor(text) { this.text = text; }
      }
    });
  });
}

function privateFields(value, path = []) {
  if (!value || typeof value !== 'object') return [];
  const found = [];
  for (const [key, nested] of Object.entries(value)) {
    if (PRIVATE_FIELD.test(key)) found.push([...path, key].join('.'));
    found.push(...privateFields(nested, [...path, key]));
  }
  return found;
}

test('every public V1 route is directly reachable and exposes indexable static metadata', async ({ page }) => {
  for (const { id, route } of PUBLIC_ROUTES) {
    const response = await page.goto(route);
    expect(response?.status(), `${id} status`).toBe(200);
    expect(new URL(page.url()).pathname, `${id} direct route`).toBe(route);

    const metadata = await page.evaluate(() => ({
      charset: document.characterSet,
      credentialInputs: document.querySelectorAll([
        'input[type="password"]',
        'input[type="email"]',
        'input[type="tel"]',
        '[autocomplete="current-password"]',
        '[autocomplete="one-time-code"]'
      ].join(',')).length,
      lang: document.documentElement.lang,
      robots: document.querySelector('meta[name="robots" i]')?.content || '',
      text: document.body.innerText,
      title: document.title.trim(),
      viewport: document.querySelector('meta[name="viewport" i]')?.content || ''
    }));

    expect(metadata.lang, `${id} language`).toBe('zh-CN');
    expect(metadata.charset.toLowerCase(), `${id} charset`).toBe('utf-8');
    expect(metadata.viewport, `${id} viewport`).toMatch(/(?:^|,)\s*width=device-width(?:\s*,|$)/i);
    expect(metadata.viewport, `${id} viewport`).toMatch(/(?:^|,)\s*initial-scale=1(?:\.0)?(?:\s*,|$)/i);
    expect(metadata.title.length, `${id} title`).toBeGreaterThan(5);
    expect(metadata.robots, `${id} robots`).not.toMatch(/noindex|nofollow/i);
    expect(metadata.credentialInputs, `${id} credential inputs`).toBe(0);
    expect(metadata.text, `${id} credential gate copy`).not.toMatch(/授权码|学习码|邀请码|请(?:先)?登录|登录后(?:继续|使用)|注册(?:账号|账户)/);

    const xRobots = response?.headers()['x-robots-tag'] || '';
    expect(xRobots, `${id} X-Robots-Tag`).not.toMatch(/noindex|nofollow/i);
  }
});

test('public V1 runtime stays static, same-origin, cookieless, and identity-free', async ({ page, context }) => {
  await installBoundaryInstrumentation(page);
  const browserRequests = [];
  page.on('request', request => browserRequests.push({
    resourceType: request.resourceType(),
    url: request.url()
  }));

  for (const { id, route } of PUBLIC_ROUTES) {
    browserRequests.length = 0;
    await page.goto(route);
    await page.waitForTimeout(700);

    const events = await page.evaluate(() => window.__v1BoundaryEvents);
    expect(events.serviceCalls, `${id} application service calls`).toEqual([]);
    expect(events.cookieWrites, `${id} cookie writes`).toEqual([]);
    expect(await context.cookies(BASE_ORIGIN), `${id} cookies`).toEqual([]);

    for (const request of browserRequests) {
      const url = new URL(request.url);
      expect(url.origin, `${id} request ${request.url}`).toBe(BASE_ORIGIN);
      expect(['fetch', 'xhr', 'websocket', 'eventsource'], `${id} ${request.url}`)
        .not.toContain(request.resourceType);
      expect(url.pathname, `${id} application endpoint`).not.toMatch(
        /^\/(?:api|auth|login|oauth|session|analytics|collect|events?|track)(?:\/|$)/i
      );
    }

    for (const [key, encoded] of events.storageWrites) {
      expect(ALLOWED_STORAGE_KEYS.has(key), `${id} storage key ${key}`).toBe(true);
      expect(key, `${id} hidden identity key`).not.toMatch(PRIVATE_FIELD);
      try {
        expect(privateFields(JSON.parse(encoded)), `${id} hidden identity fields`).toEqual([]);
      } catch (error) {
        if (error?.matcherResult) throw error;
      }
    }
  }
});

for (const probe of AUDIO_PROBES) {
  test(`${probe.id} waits for a user gesture and then uses a same-origin recording`, async ({ page }) => {
    await installAudioProbe(page);
    await page.goto(probe.route);
    await page.waitForTimeout(700);

    expect(await page.evaluate(() => window.__audioAttempts), 'recording before gesture').toEqual([]);
    expect(await page.evaluate(() => window.__speechAttempts), 'speech fallback before gesture').toEqual([]);

    await page.locator(probe.selector).first().click();
    await expect.poll(() => page.evaluate(() => window.__audioAttempts.length)).toBeGreaterThan(0);

    const attempts = await page.evaluate(() => window.__audioAttempts);
    for (const attempt of attempts) {
      const audio = new URL(attempt);
      expect(audio.origin).toBe(BASE_ORIGIN);
      expect(audio.pathname).toMatch(new RegExp(`^/${probe.id}/audio/.+\\.mp3$`, 'i'));
    }
    expect(await page.evaluate(() => window.__speechAttempts)).toEqual([]);
  });
}
