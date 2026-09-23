import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { defineConfig, devices } from '@playwright/test';

import {
  CAPTURE_ENV,
  LOCAL_BASE_URL,
  PATHS,
  REFERENCE_BASE_URL,
  THRESHOLDS,
  TIMEOUTS,
} from './visual.config.mjs';

const rootDir = dirname(fileURLToPath(import.meta.url));
const isCI = Boolean(process.env.CI);

/**
 * The local application is optional. This repository currently ships the
 * visual workbench and the documentation set; the storefront itself is not
 * scaffolded yet. Rather than hard-code a dev command that does not exist,
 * detect it — the moment a `dev` script appears in package.json, Playwright
 * starts booting it automatically.
 */
function detectDevCommand(): string | null {
  const pkgPath = resolve(rootDir, 'package.json');
  if (!existsSync(pkgPath)) return null;

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };
    const scripts = pkg.scripts ?? {};
    // Only a real application dev server counts. The visual:* scripts are ours.
    for (const candidate of ['dev', 'start:dev', 'serve']) {
      if (scripts[candidate]) return `npm run ${candidate}`;
    }
  } catch {
    return null;
  }
  return null;
}

const devCommand = detectDevCommand();

/**
 * `PW_EXTERNAL_SERVER=1` means "a dev server is already running; do not manage
 * one". The quality gate sets it, because in this repository a dev server is
 * always up on 3100 (see CLAUDE.md) and `webServer` could then only do harm:
 * its reuse probe has a short fuse, and when a busy dev server answers too
 * slowly the probe concludes nothing is listening, spawns a second server,
 * hits EADDRINUSE on the port the first one holds, and aborts the whole run
 * before a single test executes. That was observed twice — the second time
 * seconds after a warmup had just fetched every route successfully, which is
 * what ruled out slowness-on-first-compile as the only cause.
 *
 * The cost is that the suite no longer starts a server for you when none is
 * running. The gate's `warm-routes` stage reports ERR/TIMEOUT for every route
 * in that case, so the reason is stated rather than guessed at.
 */
const externalServer = process.env.PW_EXTERNAL_SERVER === '1';

export default defineConfig({
  testDir: './tests/visual',
  outputDir: PATHS.testResults,

  // Screenshot baselines are versioned source, not build output, so they live
  // under tests/ and stay out of the gitignored artifacts tree.
  snapshotPathTemplate:
    '{testDir}/__baselines__/{projectName}/{testFilePath}/{arg}{ext}',

  // Off globally on purpose: the `reference` project talks to the live
  // reference site, and that should never be hit from several workers at once.
  // The `local` project turns it back on for itself.
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  // Two, not four — measured both ways rather than guessed.
  //
  // Four workers against one `next dev` is genuine contention: it compiles on
  // a single lane, so four workers requesting four different routes force it
  // to interleave compiles and the cost grows superlinearly instead of
  // dividing. Dropping to two took a run from 287s to 98s and removed the
  // flakiness with it.
  //
  // A CORRECTION worth keeping, because the first version of this comment got
  // it wrong: the drift was blamed on the homepage growing to ~10000px. It was
  // not. The dev server had been up six days holding 5.2GB, and individual
  // smoke tests took 16-60s against it. Restarting it put the same tests at
  // 3.0-7.5s and the whole gate at ~43s with zero flaky. Page size was a
  // rounding error next to that.
  //
  // Two is still the setting. The suite finishes in ~35s here, well inside the
  // Stop hook's 110s budget, so four would buy perhaps fifteen seconds while
  // bringing the contention back. Raise it only if the suite grows enough to
  // need it — and if timings ever drift again, check the server's uptime and
  // memory before touching this number.
  workers: isCI ? 1 : 2,

  timeout: TIMEOUTS.perRouteBudget,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: THRESHOLDS.playwrightMaxDiffPixelRatio,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: `${PATHS.reports}/playwright-html`, open: 'never' }],
    ['json', { outputFile: `${PATHS.reports}/playwright-results.json` }],
  ],

  use: {
    ...devices['Desktop Chrome'],
    colorScheme: CAPTURE_ENV.colorScheme as 'light',
    locale: CAPTURE_ENV.locale,
    timezoneId: CAPTURE_ENV.timezoneId,
    deviceScaleFactor: CAPTURE_ENV.deviceScaleFactor,
    ignoreHTTPSErrors: false,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    navigationTimeout: TIMEOUTS.navigation,
    actionTimeout: 15_000,
  },

  projects: [
    {
      // Runs against the live reference site. Network-bound, so it is tagged
      // and excluded from the fast quality gate.
      name: 'reference',
      testMatch: /reference-capture\.spec\.ts/,
      use: { baseURL: REFERENCE_BASE_URL },
    },
    {
      // Runs against localhost. Skips itself with an explicit reason when no
      // local server is configured.
      name: 'local',
      testMatch: /(local-regression|responsive-smoke|homepage-smoke)\.spec\.ts/,
      // Independent page loads against our own dev server: safe to spread
      // across workers, and the only way the suite's wall-clock tracks the
      // slowest test rather than the sum of all of them.
      fullyParallel: true,
      use: { baseURL: LOCAL_BASE_URL },
    },
  ],

  // Never boot a server in CI, never invent one that does not exist, and never
  // race one that is already running.
  webServer:
    devCommand && !isCI && !externalServer
      ? {
          command: devCommand,
          url: LOCAL_BASE_URL,
          reuseExistingServer: true,
          timeout: 120_000,
          stdout: 'pipe',
          stderr: 'pipe',
        }
      : undefined,
});
