#!/usr/bin/env node
/**
 * Reference-analysis capture.
 *
 * Produces the evidence set the reconstruction is argued from:
 *   reference-analysis/<viewport>/home-full.png      full page
 *   reference-analysis/<viewport>/NN-<part>.png      isolated bands
 *
 * Bands are not hard-coded to pixel offsets — offsets drift every time the shop
 * changes a product. They are re-derived from the live DOM at capture time and
 * written next to the images as `bands.json`, so a crop and the measurement it
 * came from always describe the same render.
 *
 *   node scripts/visual/capture-analysis.mjs
 *   node scripts/visual/capture-analysis.mjs --url http://localhost:3100 --out local
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { REFERENCE_BASE_URL } from '../../visual.config.mjs';
import { createContext, launchBrowser, log, stabilizePage, warn } from './capture-core.mjs';

const VIEWPORTS = [
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'desktop-1024', width: 1024, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-375', width: 375, height: 667 },
];

function parseArgs(argv) {
  const a = { url: REFERENCE_BASE_URL, path: '/', root: 'reference-analysis', only: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--url') a.url = argv[++i];
    else if (argv[i] === '--path') a.path = argv[++i];
    else if (argv[i] === '--root') a.root = argv[++i];
    else if (argv[i] === '--only') a.only = argv[++i];
  }
  return a;
}

/** Re-derive the visual band sequence for this exact render. */
function findBands() {
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

  const priceRe = /₺\s?[\d.,]{2,}/;
  const label = (el, i) => {
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const imgs = el.querySelectorAll('img').length;
    const hasProducts = priceRe.test(t);
    if (i === 0) return 'header';
    if (el.querySelector('.owl-carousel, .swiper, .slick-slider') && i <= 2) return 'hero';
    if (/haftanın|yeni ürünler|çok satanlar/.test(t)) return 'product-tabs';
    if (hasProducts) return 'products';
    if (/ücretsiz kargo.*orijinal|güvenli alışveriş/.test(t)) return 'features-footer';
    if (imgs >= 20) return 'brands';
    if (imgs === 1) return 'banner';
    if (imgs >= 2 && imgs <= 8) return 'tiles';
    if (t.length > 200) return 'text';
    return 'band';
  };

  return {
    container,
    documentHeight: document.documentElement.scrollHeight,
    bands: kept.map((c, i) => {
      const r = c.el.getBoundingClientRect();
      return {
        index: i,
        name: label(c.el, i),
        y: Math.round(r.y + window.scrollY),
        h: Math.round(r.height),
        x: Math.round(r.x),
        w: Math.round(r.width),
        images: c.el.querySelectorAll('img').length,
      };
    }),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const viewports = args.only ? VIEWPORTS.filter((v) => v.name === args.only) : VIEWPORTS;
  const url = new URL(args.path, args.url).toString();

  const browser = await launchBrowser();
  try {
    for (const viewport of viewports) {
      const dir = path.join(args.root, viewport.name);
      await mkdir(dir, { recursive: true });
      const context = await createContext(browser, viewport);
      const page = await context.newPage();
      try {
        log(`capturing ${url} @ ${viewport.name}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await page.waitForLoadState('load').catch(() => {});
        await stabilizePage(page);

        // Overlays that sit on top of real content would otherwise be baked in.
        await page
          .evaluate(() => {
            for (const f of Array.from(document.querySelectorAll('iframe'))) {
              const r = f.getBoundingClientRect();
              if (r.width > 200 && r.height > 150) f.style.display = 'none';
            }
            for (const el of Array.from(document.querySelectorAll('body *'))) {
              const s = getComputedStyle(el);
              if (s.position !== 'fixed') continue;
              const r = el.getBoundingClientRect();
              if (r.width > 220 && r.height > 180) el.style.display = 'none';
            }
          })
          .catch(() => {});
        await page.waitForTimeout(400);

        const full = path.join(dir, 'home-full.png');
        await page.screenshot({ path: full, fullPage: true, animations: 'disabled', scale: 'css' });

        const map = await page.evaluate(findBands);
        await writeFile(
          path.join(dir, 'bands.json'),
          `${JSON.stringify({ viewport, url, ...map }, null, 2)}\n`,
          'utf8',
        );

        // One image per band, cropped straight from the live page.
        const counts = new Map();
        for (const b of map.bands) {
          const n = (counts.get(b.name) ?? 0) + 1;
          counts.set(b.name, n);
          const suffix = n > 1 ? `-${n}` : '';
          const file = path.join(
            dir,
            `${String(b.index + 1).padStart(2, '0')}-${b.name}${suffix}.png`,
          );
          try {
            // `fullPage` is required: without it a clip is bounded by the
            // viewport, so every band below the fold fails with "clipped area
            // is outside the resulting image".
            await page.screenshot({
              path: file,
              fullPage: true,
              clip: { x: 0, y: b.y, width: viewport.width, height: Math.min(b.h, 2400) },
              animations: 'disabled',
              scale: 'css',
            });
          } catch (e) {
            warn(`band ${b.index} (${b.name}): ${e.message}`);
          }
        }

        log(
          `  → ${dir}  container=${map.container} doc=${map.documentHeight} bands=${map.bands.length}`,
        );
        log(`    ${map.bands.map((b) => `${b.name}@${b.y}`).join('  ')}`);
      } catch (error) {
        warn(`${viewport.name}: ${error.message}`);
      } finally {
        await context.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }
  return 0;
}

main()
  .then((c) => process.exit(c))
  .catch((e) => {
    process.stderr.write(`capture-analysis failed: ${e.stack}\n`);
    process.exit(1);
  });
