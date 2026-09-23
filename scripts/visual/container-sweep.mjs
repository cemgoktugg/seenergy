#!/usr/bin/env node
/**
 * Container-width sweep.
 *
 * Container width drives every other horizontal number in the reconstruction,
 * so it is measured across the whole breakpoint range rather than inferred from
 * two data points. Also reports the product-grid column count at each width,
 * which is what actually changes the page's density.
 *
 *   node scripts/visual/container-sweep.mjs
 *   node scripts/visual/container-sweep.mjs --url http://localhost:3100 --out local-container
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { REFERENCE_BASE_URL } from '../../visual.config.mjs';
import { createContext, launchBrowser, log, warn } from './capture-core.mjs';

const WIDTHS = [1920, 1600, 1440, 1366, 1280, 1200, 1024, 900, 768, 600, 430, 390, 375];
const OUT_DIR = 'reference-analysis/measurements';

function parseArgs(argv) {
  const a = { url: REFERENCE_BASE_URL, path: '/', out: 'reference-container' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--url') a.url = argv[++i];
    else if (argv[i] === '--path') a.path = argv[++i];
    else if (argv[i] === '--out') a.out = argv[++i];
  }
  return a;
}

function measure() {
  const vw = document.documentElement.clientWidth;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden';
  };

  // Dominant content width below the viewport.
  const tally = new Map();
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < vw * 0.5 || r.width > vw - 1) continue;
    const k = Math.round(r.width);
    tally.set(k, (tally.get(k) ?? 0) + 1);
  }
  const ranked = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

  // Product cards: how many fit per row, and how wide are they?
  const priceRe = /₺\s?[\d.,]{2,}/;
  const cards = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 100 || r.width > vw * 0.6) continue;
    if (r.height < 150) continue;
    if (!el.querySelector('img')) continue;
    if (!priceRe.test(el.textContent || '')) continue;
    const cls = typeof el.className === 'string' ? el.className.trim() : '';
    if (!/item|product|urun/i.test(cls)) continue;
    cards.push({ w: Math.round(r.width), y: Math.round(r.y + window.scrollY), x: Math.round(r.x) });
  }
  // Group by row to find the column count.
  const byRow = new Map();
  for (const c of cards) {
    const key = Math.round(c.y / 20);
    if (!byRow.has(key)) byRow.set(key, []);
    byRow.get(key).push(c);
  }
  let cols = 0;
  let cardWidth = 0;
  for (const [, arr] of byRow) {
    const uniq = new Map();
    for (const c of arr) uniq.set(c.x, c);
    if (uniq.size > cols) {
      cols = uniq.size;
      cardWidth = [...uniq.values()][0].w;
    }
  }

  const header =
    document.querySelector('header') || document.querySelector('.header');
  const searchEl =
    document.querySelector('header input[type="search"]') ||
    document.querySelector('input[placeholder*="ara" i]') ||
    document.querySelector('header input[type="text"]');

  return {
    viewport: vw,
    containerCandidates: ranked.map(([width, count]) => ({ width, count })),
    container: ranked[0]?.[0] ?? null,
    gutter: ranked[0] ? Math.round((vw - ranked[0][0]) / 2) : null,
    headerHeight: header && visible(header) ? Math.round(header.getBoundingClientRect().height) : null,
    search:
      searchEl && visible(searchEl)
        ? {
            w: Math.round(searchEl.getBoundingClientRect().width),
            h: Math.round(searchEl.getBoundingClientRect().height),
            x: Math.round(searchEl.getBoundingClientRect().x),
          }
        : null,
    productColumns: cols,
    productCardWidth: cardWidth,
    documentHeight: document.documentElement.scrollHeight,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await mkdir(OUT_DIR, { recursive: true });
  const url = new URL(args.path, args.url).toString();

  const browser = await launchBrowser();
  const rows = [];
  try {
    const context = await createContext(browser, { width: 1440, height: 900 });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForLoadState('load').catch(() => {});
    await page.waitForTimeout(2500);

    for (const width of WIDTHS) {
      try {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(900);
        // Nudge lazy images that only decode once in view.
        await page.evaluate(async () => {
          window.scrollTo(0, 1500);
          await new Promise((r) => setTimeout(r, 350));
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 250));
        });
        const data = await page.evaluate(measure);
        rows.push(data);
        log(
          `  ${String(width).padStart(4)} → container ${String(data.container).padStart(4)} ` +
            `gutter ${String(data.gutter).padStart(3)}  header ${String(data.headerHeight).padStart(3)}  ` +
            `cols ${data.productColumns} @ ${data.productCardWidth}px  ` +
            `search ${data.search ? `${data.search.w}x${data.search.h}` : '—'}`,
        );
      } catch (e) {
        warn(`${width}: ${e.message}`);
      }
    }
    await context.close().catch(() => {});
  } finally {
    await browser.close().catch(() => {});
  }

  const file = path.join(OUT_DIR, `${args.out}.json`);
  await writeFile(file, `${JSON.stringify({ url, rows }, null, 2)}\n`, 'utf8');
  log(`\n→ ${file}`);
  return 0;
}

main()
  .then((c) => process.exit(c))
  .catch((e) => {
    process.stderr.write(`container-sweep failed: ${e.stack}\n`);
    process.exit(1);
  });
