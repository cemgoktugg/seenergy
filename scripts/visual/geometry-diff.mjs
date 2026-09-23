#!/usr/bin/env node
/**
 * Geometry diff: reference band map vs local band map.
 *
 * A pixel-percentage diff is close to meaningless here — our imagery, brand and
 * copy legitimately differ from the reference, so most changed pixels are
 * *supposed* to be changed. What is comparable is geometry: where each band
 * starts, how tall it is, how wide the container is, how big a card is.
 *
 * This captures both sides at the same viewport and prints the deltas, largest
 * first, so an iteration can be aimed at the biggest structural error rather
 * than at whatever happens to be visible.
 *
 *   node scripts/visual/geometry-diff.mjs
 *   node scripts/visual/geometry-diff.mjs --viewport desktop-1440
 *
 * Output: reference-analysis/measurements/geometry-diff__<viewport>.json
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { LOCAL_BASE_URL, REFERENCE_BASE_URL } from '../../visual.config.mjs';
import { createContext, launchBrowser, log, stabilizePage, warn } from './capture-core.mjs';

const VIEWPORTS = {
  'desktop-1440': { name: 'desktop-1440', width: 1440, height: 900 },
  'desktop-1366': { name: 'desktop-1366', width: 1366, height: 768 },
  'tablet-768': { name: 'tablet-768', width: 768, height: 1024 },
  'mobile-390': { name: 'mobile-390', width: 390, height: 844 },
};

const OUT_DIR = 'reference-analysis/measurements';

function parseArgs(argv) {
  const a = { viewports: ['desktop-1440', 'desktop-1366', 'mobile-390'] };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--viewport') a.viewports = [argv[++i]];
  }
  return a;
}

/** Shared measurement: bands plus the handful of numbers that drive layout. */
function measure() {
  const vw = document.documentElement.clientWidth;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
  };

  const tally = new Map();
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < vw * 0.5 || r.width > vw + 2) continue;
    tally.set(Math.round(r.width), (tally.get(Math.round(r.width)) ?? 0) + 1);
  }
  const container = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? vw;

  const cands = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < container * 0.92) continue;
    if (r.height < 40) continue;
    if (r.height > document.documentElement.scrollHeight * 0.55) continue;
    if (!el.querySelector('img, a, h1, h2, h3, p, span, button, input')) continue;
    cands.push({ el, top: r.y + window.scrollY, bottom: r.y + window.scrollY + r.height });
  }
  cands.sort((a, b) => a.top - b.top || b.bottom - a.bottom);

  const kept = [];
  for (const c of cands) {
    const last = kept[kept.length - 1];
    if (last && c.top < last.bottom - 8 && c.bottom <= last.bottom + 8) continue;
    if (last && Math.abs(c.top - last.top) < 6 && c.bottom <= last.bottom + 6) continue;
    kept.push(c);
  }

  // Product cards: the reference marks them `.productItem`; ours are <article>.
  const cardNodes = Array.from(
    document.querySelectorAll('.productItem, article'),
  ).filter((el) => visible(el) && el.querySelector('img'));
  const cardSizes = new Map();
  for (const c of cardNodes) {
    const r = c.getBoundingClientRect();
    if (r.width < 100 || r.height < 150) continue;
    const k = `${Math.round(r.width)}x${Math.round(r.height)}`;
    cardSizes.set(k, (cardSizes.get(k) ?? 0) + 1);
  }

  const header =
    document.querySelector('header') || document.querySelector('.header');

  const searchEl =
    document.querySelector('header input[type="search"]') ||
    document.querySelector('input[placeholder*="ara" i]') ||
    document.querySelector('header input[type="text"]');

  /*
   * Landmarks.
   *
   * Band-index pairing is unreliable across the two builds: our markup groups a
   * section banner and its product row inside one <section>, while the
   * reference emits them as siblings, so the same page yields a different band
   * count and every index after the first grouping is off by one. Landmarks are
   * matched by content instead, which is stable under that difference and is
   * what actually needs to line up.
   */
  const landmark = (test) => {
    let best = null;
    for (const el of document.body.querySelectorAll('*')) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.height < 20) continue;
      if (!test(el, r)) continue;
      const y = Math.round(r.y + window.scrollY);
      if (best === null || y < best) best = y;
    }
    return best;
  };

  const txt = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim();

  const landmarks = {
    headerBottom: (() => {
      const h = document.querySelector('header') || document.querySelector('.header');
      return h && visible(h) ? Math.round(h.getBoundingClientRect().height) : null;
    })(),
    hero: landmark(
      (el, r) =>
        r.width > container * 0.9 &&
        r.height > 90 &&
        !!el.querySelector('img') &&
        r.y + window.scrollY > 100,
    ),
    tabStrip: landmark((el) => /^Haftanın Ürünleri/.test(txt(el)) && txt(el).length < 60),
    firstProductCard: (() => {
      const c = cardNodes[0];
      return c ? Math.round(c.getBoundingClientRect().y + window.scrollY) : null;
    })(),
    // Constrained: an unbounded ">=20 images" test matches the page wrapper at
    // y=0 on both sides. A brand wall is a single band, so bound its height.
    brandWall: landmark(
      (el, r) =>
        r.width > container * 0.9 &&
        r.height < 700 &&
        r.y + window.scrollY > 1500 &&
        el.querySelectorAll('img').length >= 20,
    ),
    popularCategories: landmark((el) => /^Popüler Kategoriler/.test(txt(el)) && txt(el).length < 900),
    footer: (() => {
      const f = document.querySelector('footer');
      return f && visible(f) ? Math.round(f.getBoundingClientRect().y + window.scrollY) : null;
    })(),
  };

  return {
    viewport: vw,
    documentHeight: document.documentElement.scrollHeight,
    container,
    landmarks,
    headerHeight: header && visible(header) ? Math.round(header.getBoundingClientRect().height) : null,
    search:
      searchEl && visible(searchEl)
        ? {
            w: Math.round(searchEl.getBoundingClientRect().width),
            h: Math.round(searchEl.getBoundingClientRect().height),
            x: Math.round(searchEl.getBoundingClientRect().x),
          }
        : null,
    cardSizes: [...cardSizes.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([size, count]) => ({ size, count })),
    bands: kept.map((c) => {
      const r = c.el.getBoundingClientRect();
      return {
        y: Math.round(r.y + window.scrollY),
        h: Math.round(r.height),
        images: c.el.querySelectorAll('img').length,
        text: (c.el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      };
    }),
  };
}

async function capture(browser, url, viewport) {
  const context = await createContext(browser, viewport);
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForLoadState('load').catch(() => {});
    await stabilizePage(page);
    await page
      .evaluate(() => {
        for (const f of Array.from(document.querySelectorAll('iframe'))) {
          const r = f.getBoundingClientRect();
          if (r.width > 200 && r.height > 150) f.style.display = 'none';
        }
        for (const el of Array.from(document.querySelectorAll('body *'))) {
          if (getComputedStyle(el).position !== 'fixed') continue;
          const r = el.getBoundingClientRect();
          if (r.width > 220 && r.height > 180) el.style.display = 'none';
        }
      })
      .catch(() => {});
    return await page.evaluate(measure);
  } finally {
    await context.close().catch(() => {});
  }
}

const pad = (v, n) => String(v).padStart(n);
const signed = (n) => (n > 0 ? `+${n}` : `${n}`);

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await launchBrowser();
  const report = { comparedAt: new Date().toISOString(), viewports: {} };

  try {
    for (const key of args.viewports) {
      const viewport = VIEWPORTS[key];
      if (!viewport) {
        warn(`unknown viewport ${key}`);
        continue;
      }
      log(`\n=== ${key} ===`);
      const ref = await capture(browser, REFERENCE_BASE_URL, viewport);
      const loc = await capture(browser, LOCAL_BASE_URL, viewport);

      const metrics = [
        ['document height', ref.documentHeight, loc.documentHeight],
        ['container', ref.container, loc.container],
        ['header height', ref.headerHeight, loc.headerHeight],
        ['search width', ref.search?.w ?? null, loc.search?.w ?? null],
        ['band count', ref.bands.length, loc.bands.length],
      ];
      log('  metric              reference    local     delta');
      for (const [label, r, l] of metrics) {
        const d = r != null && l != null ? signed(l - r) : '—';
        log(`  ${label.padEnd(20)}${pad(r ?? '—', 9)}${pad(l ?? '—', 9)}${pad(d, 10)}`);
      }

      log(`  reference cards: ${ref.cardSizes.map((c) => `${c.size}×${c.count}`).join('  ')}`);
      log(`  local cards:     ${loc.cardSizes.map((c) => `${c.size}×${c.count}`).join('  ')}`);

      log('\n  landmark            reference    local     delta');
      const landmarkRows = [];
      for (const key of Object.keys(ref.landmarks)) {
        const r = ref.landmarks[key];
        const l = loc.landmarks[key];
        const d = r != null && l != null ? l - r : null;
        landmarkRows.push({ key, reference: r, local: l, delta: d });
        log(
          `  ${key.padEnd(20)}${pad(r ?? '—', 9)}${pad(l ?? '—', 9)}${pad(d != null ? signed(d) : '—', 10)}`,
        );
      }

      // Gaps between consecutive landmarks isolate *which* stretch of the page
      // is short or tall, rather than just reporting accumulated drift.
      const order = ['headerBottom', 'hero', 'tabStrip', 'brandWall', 'popularCategories', 'footer'];
      log('\n  stretch                        reference   local    delta');
      for (let i = 1; i < order.length; i += 1) {
        const a = order[i - 1];
        const b = order[i];
        if (ref.landmarks[a] == null || ref.landmarks[b] == null) continue;
        if (loc.landmarks[a] == null || loc.landmarks[b] == null) continue;
        const rGap = ref.landmarks[b] - ref.landmarks[a];
        const lGap = loc.landmarks[b] - loc.landmarks[a];
        log(`  ${`${a} → ${b}`.padEnd(30)}${pad(rGap, 8)}${pad(lGap, 9)}${pad(signed(lGap - rGap), 9)}`);
      }
      const rTail = ref.documentHeight - (ref.landmarks.footer ?? 0);
      const lTail = loc.documentHeight - (loc.landmarks.footer ?? 0);
      log(`  ${'footer → end'.padEnd(30)}${pad(rTail, 8)}${pad(lTail, 9)}${pad(signed(lTail - rTail), 9)}`);

      // Band-by-band, paired positionally. Both sides are the same page in the
      // same order, so index pairing is meaningful; a count mismatch is itself
      // the finding and is reported rather than smoothed over.
      const n = Math.max(ref.bands.length, loc.bands.length);
      const rows = [];
      log('\n   #   ref y/h          local y/h         Δy     Δh');
      for (let i = 0; i < n; i += 1) {
        const r = ref.bands[i];
        const l = loc.bands[i];
        const row = {
          index: i,
          reference: r ? { y: r.y, h: r.h, text: r.text } : null,
          local: l ? { y: l.y, h: l.h, text: l.text } : null,
          dy: r && l ? l.y - r.y : null,
          dh: r && l ? l.h - r.h : null,
        };
        rows.push(row);
        log(
          `  ${pad(i, 2)}  ${r ? `${pad(r.y, 5)}/${pad(r.h, 4)}` : '    —     '}   ` +
            `${l ? `${pad(l.y, 5)}/${pad(l.h, 4)}` : '    —     '}   ` +
            `${row.dy != null ? pad(signed(row.dy), 6) : '     —'} ${row.dh != null ? pad(signed(row.dh), 6) : '     —'}`,
        );
      }

      const worst = rows
        .filter((r) => r.dh != null)
        .sort((a, b) => Math.abs(b.dh) - Math.abs(a.dh))
        .slice(0, 5);
      log('\n  largest height errors:');
      for (const w of worst) {
        log(
          `    band ${w.index}  Δh ${signed(w.dh)}  ref "${w.reference.text.slice(0, 30)}"  local "${w.local.text.slice(0, 30)}"`,
        );
      }

      report.viewports[key] = { reference: ref, local: loc, rows, worst, landmarks: landmarkRows };
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const file = path.join(OUT_DIR, 'geometry-diff.json');
  await writeFile(file, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  log(`\n→ ${file}`);
  return 0;
}

main()
  .then((c) => process.exit(c))
  .catch((e) => {
    process.stderr.write(`geometry-diff failed: ${e.stack}\n`);
    process.exit(1);
  });
