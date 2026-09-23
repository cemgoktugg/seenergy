/**
 * Deterministic screenshot capture — shared by `capture-reference.mjs`,
 * `capture-local.mjs` and (through `tests/visual/visual-helpers.ts`) by the
 * Playwright specs.
 *
 * The single job of this module is to make two different origins render as
 * comparably as a browser allows: same viewport, same scale factor, same
 * colour scheme, locale and timezone, no animation, no caret, fonts settled,
 * images decoded, lazy content triggered, scroll returned to the top.
 *
 * Nothing here waits forever. Every wait is bounded and degrades to a warning.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from '@playwright/test';

import {
  CAPTURE_ENV,
  CONSENT_SELECTORS,
  MASK_SELECTORS,
  SCREENSHOT_KINDS,
  TIMEOUTS,
  VIEWPORTS,
  screenshotName,
} from '../../visual.config.mjs';

/** CSS that removes every source of frame-to-frame variation we can reach. */
const FREEZE_CSS = `
  *, *::before, *::after {
    animation-delay: -0.0001s !important;
    animation-duration: 0s !important;
    animation-iteration-count: 1 !important;
    animation-play-state: paused !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
  html { scroll-behavior: auto !important; }
  /* Anchors that shift content while images decode. */
  * { overflow-anchor: none !important; }
  /* The Next.js dev-tools indicator is not part of the design and would
     otherwise be captured into every local screenshot. */
  nextjs-portal, #__next-build-watcher, [data-nextjs-toast] { display: none !important; }
`;

export function log(message) {
  process.stdout.write(`${message}\n`);
}

export function warn(message) {
  process.stdout.write(`  ! ${message}\n`);
}

export async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

/** Bounded wait: resolves to `false` on timeout instead of throwing. */
async function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(Symbol.for('timeout')), ms);
  });
  try {
    const result = await Promise.race([promise, timeout]);
    if (result === Symbol.for('timeout')) {
      warn(`${label} timed out after ${ms}ms — continuing`);
      return false;
    }
    return true;
  } catch (error) {
    warn(`${label} failed: ${error.message} — continuing`);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function launchBrowser() {
  return chromium.launch({
    args: [
      // Deterministic text rendering across machines.
      '--font-render-hinting=none',
      '--disable-lcd-text',
      '--force-color-profile=srgb',
      '--disable-skia-runtime-opts',
      '--hide-scrollbars',
    ],
  });
}

export async function createContext(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor ?? CAPTURE_ENV.deviceScaleFactor,
    colorScheme: CAPTURE_ENV.colorScheme,
    locale: CAPTURE_ENV.locale,
    timezoneId: CAPTURE_ENV.timezoneId,
    reducedMotion: CAPTURE_ENV.reducedMotion,
    // A predictable, honest UA. Not an attempt to look like something else.
    extraHTTPHeaders: { 'Accept-Language': 'tr-TR,tr;q=0.9' },
  });

  // Injected before any document script runs, so animations never get a frame.
  await context.addInitScript(() => {
    // Freeze Math.random so randomised placements settle identically.
    let seed = 42;
    Math.random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
  });

  return context;
}

/** Best-effort consent dismissal. A miss is normal and never fatal. */
async function dismissConsent(page) {
  for (const selector of CONSENT_SELECTORS) {
    try {
      const target = page.locator(selector).first();
      if (await target.isVisible({ timeout: 700 })) {
        await target.click({ timeout: 1500, noWaitAfter: true });
        await page.waitForTimeout(250);
        return selector;
      }
    } catch {
      // Selector invalid on this page, or nothing there. Try the next one.
    }
  }
  return null;
}

async function waitForFonts(page) {
  await withTimeout(
    page.evaluate(() => document.fonts?.ready ?? Promise.resolve()),
    TIMEOUTS.fonts,
    'document.fonts.ready',
  );
}

async function waitForImages(page) {
  await withTimeout(
    page.evaluate(
      () =>
        new Promise((resolve) => {
          /* Which images are worth waiting for?
             Eager ones always. A lazy one only if the browser is actually
             going to load it — otherwise the wait can never resolve and burns
             the entire budget on a single image.

             The vertical band is the cheap half of that test. The other half
             is horizontal: a card parked off to the right inside a horizontal
             rail still reports an on-screen rect, but it is clipped by the
             rail's scroll box, so the lazy loader leaves it alone forever.
             Walking the ancestors and dropping anything a scroll/hidden box
             clips out of view is what keeps this bounded. */
          const clippedOutOfView = (img) => {
            const rect = img.getBoundingClientRect();
            for (let el = img.parentElement; el; el = el.parentElement) {
              const style = window.getComputedStyle(el);
              const scrolls = `${style.overflowX} ${style.overflowY}`;
              if (!/auto|scroll|hidden/.test(scrolls)) continue;
              const box = el.getBoundingClientRect();
              const outside =
                rect.right <= box.left + 1 ||
                rect.left >= box.right - 1 ||
                rect.bottom <= box.top + 1 ||
                rect.top >= box.bottom - 1;
              if (outside) return true;
            }
            return false;
          };

          const images = Array.from(document.images).filter((img) => {
            if (img.loading !== 'lazy') return true;
            if (img.getBoundingClientRect().top >= window.innerHeight * 3) return false;
            return !clippedOutOfView(img);
          });
          let pending = images.length;
          if (pending === 0) {
            resolve(true);
            return;
          }
          const done = () => {
            pending -= 1;
            if (pending <= 0) resolve(true);
          };
          for (const img of images) {
            if (img.complete && img.naturalWidth > 0) {
              done();
            } else {
              img.addEventListener('load', done, { once: true });
              img.addEventListener('error', done, { once: true });
            }
          }
        }),
    ),
    TIMEOUTS.images,
    'image decode',
  );
}

/** Walk the page to trigger lazy content, then return to the very top. */
async function triggerLazyContent(page, stepDelay) {
  await withTimeout(
    page.evaluate(async (delay) => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const maxSteps = 40; // hard stop: never chase an infinite-scroll page
      let step = 0;
      let position = 0;

      while (step < maxSteps) {
        const height = document.documentElement.scrollHeight;
        position += window.innerHeight;
        if (position >= height) break;
        window.scrollTo(0, position);
        await sleep(delay);
        step += 1;
      }

      window.scrollTo(0, 0);
      await sleep(delay);
    }, stepDelay),
    TIMEOUTS.perRouteBudget / 2,
    'lazy-content scroll',
  );
}

/** Stop anything that keeps painting after load. */
async function freezeMedia(page) {
  await page
    .evaluate(() => {
      for (const video of Array.from(document.querySelectorAll('video'))) {
        try {
          video.pause();
          video.currentTime = 0;
          video.removeAttribute('autoplay');
          video.setAttribute('data-visual-mask', '');
        } catch {
          /* cross-origin or detached */
        }
      }
      for (const marquee of Array.from(document.querySelectorAll('marquee'))) {
        try {
          marquee.stop();
        } catch {
          /* not supported */
        }
      }
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    })
    .catch(() => {});
}

/**
 * Bring a loaded page into a comparable, still state.
 * Returns a small record of what actually happened, for the manifest.
 */
export async function stabilizePage(page) {
  const notes = {};

  await page.addStyleTag({ content: FREEZE_CSS }).catch(() => {});
  notes.consentDismissed = await dismissConsent(page);
  await waitForFonts(page);
  await waitForImages(page);
  await triggerLazyContent(page, TIMEOUTS.lazyScrollStep);
  // Late-loading imagery revealed by the scroll pass.
  await waitForImages(page);
  await freezeMedia(page);
  // Re-apply: some sites re-inject styles or swap classes after hydration.
  await page.addStyleTag({ content: FREEZE_CSS }).catch(() => {});
  await page.waitForTimeout(TIMEOUTS.settleAfterScroll);
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(150);

  return notes;
}

function buildMasks(page) {
  return MASK_SELECTORS.map((selector) => page.locator(selector));
}

/**
 * Capture one route at one viewport, producing both the viewport shot and the
 * full-page shot under deterministic file names.
 */
export async function captureRoute({ context, url, routeName, viewport, outDir }) {
  const page = await context.newPage();
  const result = {
    route: routeName,
    viewport: viewport.name,
    url,
    files: {},
    ok: false,
  };

  try {
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUTS.navigation,
    });
    result.status = response?.status() ?? null;

    if (response && !response.ok()) {
      result.error = `HTTP ${response.status()}`;
      warn(`${routeName} @ ${viewport.name}: ${result.error}`);
      return result;
    }

    // Explicit, asset-based settling instead of an unreliable networkidle.
    await withTimeout(
      page.waitForLoadState('load'),
      TIMEOUTS.navigation,
      'load event',
    );

    const notes = await stabilizePage(page);
    result.notes = notes;

    const masks = buildMasks(page);

    for (const kind of SCREENSHOT_KINDS) {
      const file = screenshotName(routeName, viewport.name, kind);
      const target = path.join(outDir, file);
      await page.screenshot({
        path: target,
        fullPage: kind === 'full',
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
        mask: masks,
        maskColor: '#FF00FF',
        timeout: 30_000,
      });
      result.files[kind] = file;
    }

    const dimensions = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    }));
    result.dimensions = dimensions;
    result.ok = true;
    log(
      `  ok  ${routeName} @ ${viewport.name}  (${dimensions.scrollWidth}x${dimensions.scrollHeight})`,
    );
  } catch (error) {
    result.error = error.message;
    warn(`${routeName} @ ${viewport.name}: ${error.message}`);
  } finally {
    await page.close().catch(() => {});
  }

  return result;
}

/**
 * Capture every (route, viewport) pair for one side of the comparison.
 *
 * `resolvePath(route)` returns the path to visit, or `null` to skip the route
 * on this side — skips are reported, never silent.
 */
export async function captureSide({
  label,
  baseUrl,
  routes,
  outDir,
  resolvePath,
  viewports = VIEWPORTS,
}) {
  await ensureDir(outDir);

  log(`\n${label}: ${baseUrl}`);
  log(`  output: ${outDir}`);

  const browser = await launchBrowser();
  const results = [];
  const skipped = [];

  try {
    for (const viewport of viewports) {
      const context = await createContext(browser, viewport);
      try {
        for (const route of routes) {
          const routePath = resolvePath(route);
          if (routePath === null || routePath === undefined) {
            skipped.push({ route: route.name, viewport: viewport.name });
            continue;
          }
          const url = new URL(routePath, baseUrl).toString();
          results.push(
            await captureRoute({
              context,
              url,
              routeName: route.name,
              viewport,
              outDir,
            }),
          );
        }
      } finally {
        await context.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const manifest = {
    label,
    baseUrl,
    capturedAt: new Date().toISOString(),
    environment: CAPTURE_ENV,
    viewports: viewports.map((v) => v.name),
    results,
    skipped,
  };

  await writeFile(
    path.join(outDir, '_manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.length - okCount;

  log(
    `\n${label} summary: ${okCount} captured, ${failCount} failed, ${skipped.length} skipped`,
  );

  if (skipped.length > 0) {
    const names = [...new Set(skipped.map((s) => s.route))].join(', ');
    warn(`skipped routes (not available on this side): ${names}`);
  }

  return manifest;
}
