#!/usr/bin/env node
/**
 * Homepage band map.
 *
 * The reference homepage is an ASP.NET/Ticimax page with no <main> and no clean
 * section stack, so `deep-probe.mjs`'s generic descent finds only the Elementor
 * footer. This script instead reconstructs the *visual* band sequence the way a
 * reader sees it: every visible element that spans the content container is
 * collected, clustered by vertical position, and reduced to the outermost box
 * at each band. That yields the real top-to-bottom section order.
 *
 *   node scripts/visual/band-map.mjs
 *   node scripts/visual/band-map.mjs --url http://localhost:3100 --out local-bands
 *
 * Output: reference-analysis/measurements/<out>__<viewport>.json
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { REFERENCE_BASE_URL } from '../../visual.config.mjs';
import { createContext, launchBrowser, log, stabilizePage, warn } from './capture-core.mjs';

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

const OUT_DIR = 'reference-analysis/measurements';

function parseArgs(argv) {
  const a = { url: REFERENCE_BASE_URL, path: '/', out: 'reference-bands', only: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--url') a.url = argv[++i];
    else if (argv[i] === '--path') a.path = argv[++i];
    else if (argv[i] === '--out') a.out = argv[++i];
    else if (argv[i] === '--only') a.only = argv[++i];
  }
  return a;
}

function bandMapInPage() {
  const R = (n) => Math.round(n * 10) / 10;
  const vw = document.documentElement.clientWidth;

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
  };
  const sel = (el) => {
    const cls =
      typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls ? `.${cls}` : ''}`;
  };
  const txt = (el, n = 80) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, n);
  const abs = (el) => {
    const r = el.getBoundingClientRect();
    return { x: R(r.x), y: R(r.y + window.scrollY), w: R(r.width), h: R(r.height) };
  };

  // Which content width dominates? Bands are elements at or above that width.
  const tally = new Map();
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < vw * 0.5 || r.width > vw + 2) continue;
    const k = Math.round(r.width);
    tally.set(k, (tally.get(k) ?? 0) + 1);
  }
  const containerWidth = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? vw;

  // Candidate bands: wide enough, tall enough, and carrying actual content.
  const cands = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < containerWidth * 0.92) continue;
    if (r.height < 40) continue;
    // A band that is nearly the whole document is a wrapper, not a band.
    if (r.height > document.documentElement.scrollHeight * 0.55) continue;
    if (!el.querySelector('img, a, h1, h2, h3, p, span, button, input')) continue;
    cands.push({ el, top: r.y + window.scrollY, bottom: r.y + window.scrollY + r.height });
  }
  cands.sort((a, b) => a.top - b.top || b.bottom - a.bottom);

  // Reduce to outermost non-overlapping bands: walk in order, keep a candidate
  // only if it is not substantially contained by the previous kept band.
  const bands = [];
  for (const c of cands) {
    const last = bands[bands.length - 1];
    if (last && c.top < last.bottom - 8 && c.bottom <= last.bottom + 8) continue; // nested
    if (last && Math.abs(c.top - last.top) < 6 && c.bottom <= last.bottom + 6) continue;
    bands.push(c);
  }

  const describeBand = ({ el }) => {
    const b = abs(el);
    const s = getComputedStyle(el);
    const imgs = Array.from(el.querySelectorAll('img')).filter(visible);

    // Grid shape: the most common (top,width) cluster of medium-size children.
    const rows = new Map();
    for (const n of el.querySelectorAll('*')) {
      if (!visible(n)) continue;
      const r = n.getBoundingClientRect();
      if (r.width < 60 || r.height < 50) continue;
      if (r.width > b.w * 0.92) continue;
      const key = `${Math.round((r.y + window.scrollY) / 10)}|${Math.round(r.width / 6)}`;
      if (!rows.has(key)) rows.set(key, { count: 0, w: R(r.width), h: R(r.height) });
      rows.get(key).count += 1;
    }
    let grid = { columns: 0, itemWidth: 0, itemHeight: 0 };
    for (const [, v] of rows) {
      if (v.count > grid.columns) grid = { columns: v.count, itemWidth: v.w, itemHeight: v.h };
    }

    // A short prominent line of text acts as the band's title.
    let title = null;
    for (const n of el.querySelectorAll('h1,h2,h3,h4,div,span,a,strong')) {
      if (!visible(n)) continue;
      if (n.children.length > 1) continue;
      const t = txt(n, 46);
      if (!t || t.length < 3 || t.length > 44) continue;
      const cs = getComputedStyle(n);
      if (parseFloat(cs.fontSize) < 14) continue;
      const r = n.getBoundingClientRect();
      if (r.y + window.scrollY > b.y + 90) continue;
      title = { text: t, fontSize: cs.fontSize, fontWeight: cs.fontWeight, color: cs.color };
      break;
    }

    const priceRe = /₺\s?[\d.,]{2,}/;
    const productish = Array.from(el.querySelectorAll('*')).filter(
      (n) =>
        visible(n) &&
        n.querySelector('img') &&
        priceRe.test(n.textContent || '') &&
        n.getBoundingClientRect().width < b.w * 0.4,
    ).length;

    return {
      selector: sel(el),
      box: b,
      style: {
        backgroundColor: s.backgroundColor,
        backgroundImage: s.backgroundImage === 'none' ? 'none' : 'image',
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom,
      },
      title,
      images: imgs.length,
      links: el.querySelectorAll('a').length,
      grid,
      hasProducts: productish > 0,
      isSlider: !!el.querySelector('.owl-carousel, .swiper, .slick-slider, [class*="carousel"]'),
      text: txt(el, 130),
    };
  };

  return {
    viewportWidth: vw,
    documentHeight: document.documentElement.scrollHeight,
    containerWidth,
    bandCount: bands.length,
    bands: bands.map(describeBand),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await mkdir(OUT_DIR, { recursive: true });
  const viewports = args.only ? VIEWPORTS.filter((v) => v.name === args.only) : VIEWPORTS;

  const browser = await launchBrowser();
  try {
    for (const viewport of viewports) {
      const context = await createContext(browser, viewport);
      const page = await context.newPage();
      try {
        const url = new URL(args.path, args.url).toString();
        log(`band-mapping ${url} @ ${viewport.name}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await page.waitForLoadState('load').catch(() => {});
        await stabilizePage(page);

        const data = await page.evaluate(bandMapInPage);
        data.meta = { url, viewport, probedAt: new Date().toISOString() };

        const file = path.join(OUT_DIR, `${args.out}__${viewport.name}.json`);
        await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
        log(`  → ${file}  container=${data.containerWidth}  bands=${data.bandCount}`);
        for (const b of data.bands) {
          log(
            `    y=${String(Math.round(b.box.y)).padStart(5)} h=${String(Math.round(b.box.h)).padStart(4)} ` +
              `cols=${String(b.grid.columns).padStart(2)} img=${String(b.images).padStart(3)} ` +
              `${b.isSlider ? 'SLIDER' : '      '} ${b.hasProducts ? 'PROD' : '    '} ` +
              `${b.title ? b.title.text.slice(0, 30) : b.text.slice(0, 30)}`,
          );
        }
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
    process.stderr.write(`band-map failed: ${e.stack}\n`);
    process.exit(1);
  });
