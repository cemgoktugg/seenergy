/**
 * Central visual-regression configuration.
 *
 * This is the ONLY place where routes, viewports and diff thresholds are
 * defined. `tests/visual/routes.ts` re-exports it with TypeScript types, and
 * every script under `scripts/visual/` imports it directly. Change a threshold
 * here and the whole system follows.
 *
 * Plain ESM JavaScript on purpose: Playwright specs (TypeScript) and the Node
 * scripts (.mjs) both need to read it without a build step.
 */

/** @typedef {{ name: string, width: number, height: number, deviceScaleFactor?: number }} Viewport */

export const REFERENCE_BASE_URL =
  process.env.REFERENCE_BASE_URL ?? 'https://www.merterelektronik.com';

// Port 3100, not 3000: another project on this machine already serves 3000,
// and capturing the wrong application is the most expensive mistake in a
// reference-comparison workflow. `npm run dev` pins the same port.
export const LOCAL_BASE_URL =
  process.env.LOCAL_BASE_URL ?? 'http://localhost:3100';

/**
 * Rendering environment. Both sides are captured with exactly these values so
 * that a diff reflects design drift and nothing else.
 */
export const CAPTURE_ENV = {
  colorScheme: 'light',
  locale: 'tr-TR',
  timezoneId: 'Europe/Istanbul',
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
};

/**
 * Viewport matrix. `deviceScaleFactor` is pinned to 1 everywhere so reference
 * and local pixels are directly comparable.
 */
export const VIEWPORTS = [
  { name: 'desktop-xl', width: 1440, height: 1200 },
  { name: 'desktop', width: 1280, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

/**
 * Route matrix.
 *
 * `referencePath` values were taken from the live reference sitemap
 * (`/sitemap/categories/0.xml`, `/sitemap/products/0.xml`) and each was
 * verified to return HTTP 200 — none of them are invented.
 *
 * `localPath` values follow the route table this repository already documents
 * in `docs/INFORMATION_ARCHITECTURE_ELECTRONICS.md` (§ route list).
 *
 * `localReady: false` means the local application does not serve that route
 * yet. Those routes are captured on the reference side only and are skipped —
 * loudly, never silently — on the local side.
 */
export const ROUTES = [
  {
    name: 'home',
    title: 'Ana sayfa',
    referencePath: '/',
    localPath: '/',
    localReady: true,
    /** Regions that matter most; see `criticalBands` below. */
    priority: 1,
  },
  {
    name: 'category',
    title: 'Kategori / listeleme',
    referencePath: '/guvenlik-sistemleri',
    // The client's tree (2026-09-29) replaced `guvenlik-sistemleri`; its
    // counterpart is CCTV, a top-level category with subcategories, so this
    // route also exercises the subcategory row.
    localPath: '/kategori/cctv-guvenlik-sistemleri',
    localReady: true,
    priority: 2,
  },
  {
    name: 'product',
    title: 'Ürün detay',
    referencePath: '/tda-4841-ps-entegere',
    // A real slug from our own mock catalogue, not the reference's product:
    // the previous value was the reference path reused locally and would have
    // 404ed. Verified by opening it from the homepage's Tekniva brand band.
    localPath: '/urun/tekniva-tk-27aio-27-all-in-one-bilgisayar-i7-16gb-512gb',
    localReady: true,
    priority: 3,
  },
];

/**
 * Diff thresholds. Every number here is a percentage of compared pixels
 * unless stated otherwise.
 */
export const THRESHOLDS = {
  /**
   * Per-pixel colour distance passed to pixelmatch (0-1). 0.1 is the standard
   * anti-aliasing tolerance: sub-pixel text rendering differences are ignored,
   * a genuinely different colour is not.
   */
  pixelmatch: 0.1,
  /** pixelmatch anti-aliasing detection. */
  includeAA: false,
  /** First milestone: a route is "acceptable" below this. */
  maxDiffPercent: 5,
  /** Refinement milestone, used by `visual-iterate` as its success bar. */
  targetDiffPercent: 2,
  /** Full-page shots are taller and noisier; they get a slightly looser bar. */
  maxDiffPercentFullPage: 7,
  /** Playwright `toHaveScreenshot` tolerance for local-vs-local regression. */
  playwrightMaxDiffPixelRatio: 0.01,
};

/**
 * Critical regions get a tighter bar than the page as a whole. Bands are
 * measured in CSS pixels from the top of the *viewport* screenshot, so they
 * only apply to `__viewport.png` files.
 *
 * The 180px header band is not a guess: the reference header measured 175px
 * tall at 1280px wide (`artifacts/visual/reference-live/home__desktop__metrics.json`).
 * Re-measure and tighten these once `reference-analysis.md` exists.
 */
export const CRITICAL_BANDS = [
  { name: 'header+nav', fromPx: 0, toPx: 180, maxDiffPercent: 3 },
  { name: 'hero', fromPx: 180, toPx: 720, maxDiffPercent: 4 },
];

/**
 * Selectors that are masked (painted over with a flat colour) before the
 * screenshot is taken, on both sides. Use this for content that is genuinely
 * non-deterministic — never to hide a real layout difference.
 */
export const MASK_SELECTORS = [
  'video',
  'iframe[src*="youtube"]',
  'iframe[src*="vimeo"]',
  'iframe[src*="maps"]',
  '[data-visual-mask]',
];

/**
 * Best-effort cookie / consent dismissal. Each selector is tried once, a miss
 * is not an error. Applied identically to both sides so neither gets an extra
 * banner the other does not have.
 */
export const CONSENT_SELECTORS = [
  '#onetrust-accept-btn-handler',
  '.cookie-accept',
  '.cookieAccept',
  '#cookieAccept',
  '[id*="cookie"] button',
  'button:has-text("Kabul Et")',
  'button:has-text("Kabul et")',
  'button:has-text("Tamam")',
  'button:has-text("Accept")',
];

/** Timing budget. Nothing here waits forever. */
export const TIMEOUTS = {
  navigation: 45_000,
  fonts: 10_000,
  images: 15_000,
  /* 250ms. Tried at 120 to claw back suite time; the run after the change was
     SLOWER (118s -> 155s) and run-to-run variance on this machine is large
     enough that no benefit could be demonstrated either way. Reverted rather
     than kept on the strength of the argument alone: this value also paces the
     reference capture, and trading a determinism safeguard for an unmeasurable
     saving is a bad trade. */
  lazyScrollStep: 250,
  settleAfterScroll: 600,
  perRouteBudget: 90_000,
};

/** Artifact layout. Relative to the repository root. */
export const PATHS = {
  root: 'artifacts/visual',
  reference: 'artifacts/visual/reference',
  local: 'artifacts/visual/local',
  diff: 'artifacts/visual/diff',
  reports: 'artifacts/visual/reports',
  testResults: 'artifacts/visual/test-results',
  diffJson: 'artifacts/visual/reports/visual-diff.json',
  diffMarkdown: 'artifacts/visual/reports/visual-diff.md',
  diffHtml: 'artifacts/visual/reports/visual-diff.html',
  referenceAnalysis: 'artifacts/visual/reports/reference-analysis.md',
  iterationLog: 'artifacts/visual/reports/iteration-log.json',
};

/**
 * Deterministic screenshot file name.
 * `{route}__{viewport}__{kind}.png` — identical on both sides, which is what
 * makes the comparison a plain filename join.
 */
export function screenshotName(routeName, viewportName, kind) {
  return `${routeName}__${viewportName}__${kind}.png`;
}

export const SCREENSHOT_KINDS = ['viewport', 'full'];
