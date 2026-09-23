#!/usr/bin/env node
/**
 * Warm every locally-served route once, before the smoke suite runs.
 *
 * WHY THIS EXISTS
 *
 * `next dev` compiles a route on its first request, and a cold route can take
 * seconds to answer. Warming every route first means the suite measures the
 * application rather than the compiler, and it makes a slow route visible in
 * the gate output instead of hidden inside a test's duration.
 *
 * It does NOT fix the `EADDRINUSE` abort. That was the original hope and it
 * was wrong: the gate died that way again seconds after this script had
 * fetched all three routes successfully. Playwright's `webServer` reuse probe
 * simply misjudges a busy server, spawns a duplicate and aborts the run. The
 * fix for that is `PW_EXTERNAL_SERVER=1`, which the gate sets so Playwright
 * never tries to manage a server that is already running — see the note in
 * playwright.config.ts.
 *
 * WHAT THIS DOES **NOT** FIX — measured, not assumed
 *
 * The smoke suite also fails intermittently with
 * "…should not return an error status … Received: 500". That one is NOT cold
 * compile. The dev server log shows the real cause, and it is the same every
 * time:
 *
 *     ⨯ SyntaxError: Unexpected end of JSON input
 *         at JSON.parse (<anonymous>)  { page: '/urun/…' }
 *     ✓ Compiled in 5.9s (1127 modules)     <- a full rebuild; normal is 441
 *     GET /urun/… 500 in 7659ms
 *
 * `next dev` is reading its own build manifest while it is still being
 * written — a truncated JSON read provoked by several workers requesting at
 * once. It has been observed on a route that this script had warmed to HTTP
 * 200 two seconds earlier, so no amount of warming prevents it.
 *
 * `retries: 1` absorbs it. The alternatives were weighed and rejected:
 * dropping to two workers roughly doubles the suite's wall clock and pushes
 * the Stop-hook gate back toward its 110s budget, and running the suite
 * against a production build collides with this repository's own rule against
 * building while the dev server is running.
 *
 * So: a "1 flaky" line on a smoke run is expected under load and is a dev-server
 * artifact. A *reproducible* failure is not.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *
 * It never fails the gate. A warmup that can fail is a new source of failure,
 * and a warmup that hides a 500 is worse than no warmup at all — so every
 * status is printed plainly and the smoke suite remains the judge.
 */

import process from 'node:process';

import { LOCAL_BASE_URL, ROUTES, TIMEOUTS } from '../../visual.config.mjs';

const out = (line) => process.stdout.write(`${line}\n`);

const routes = ROUTES.filter((route) => route.localReady);

if (routes.length === 0) {
  out('  (no locally-ready routes to warm)');
  process.exit(0);
}

let slow = 0;
let errored = 0;

for (const route of routes) {
  const url = new URL(route.localPath, LOCAL_BASE_URL).toString();
  const started = Date.now();

  let status = 'ERR';
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUTS.navigation),
      headers: { 'Accept-Language': 'tr-TR,tr;q=0.9' },
    });
    status = String(response.status);
    // Drain the body so the server finishes the render rather than being left
    // with a half-consumed stream.
    await response.arrayBuffer();
    if (!response.ok) errored += 1;
  } catch (error) {
    errored += 1;
    status = error?.name === 'TimeoutError' ? 'TIMEOUT' : 'ERR';
  }

  const ms = Date.now() - started;
  if (ms > 1000) slow += 1;
  out(`  ${status.padEnd(7)} ${String(ms).padStart(5)}ms  ${route.localPath}`);
}

out(
  `  warmed ${routes.length} route(s) · ${slow} needed over 1s (cold) · ${errored} did not return 2xx`,
);
if (errored > 0) {
  out('  NOTE: a non-2xx above is reported, not suppressed — the smoke suite still judges it.');
}

process.exit(0);
