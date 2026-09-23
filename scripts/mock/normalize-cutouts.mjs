#!/usr/bin/env node
/**
 * Tighten every transparent cutout's viewBox to its actual drawing.
 *
 * WHY
 *
 * The device illustrations are drawn with hand-written coordinates inside a
 * 600 x 600 canvas, and they legitimately occupy very different extents — the
 * adapter body is 240 x 240, the meter 250 x 366, the all-in-one 460 x 300.
 * Wherever a cutout is placed with `object-contain` (the category tiles, the
 * campaign tile), the browser fits the WHOLE canvas into the box, so a device
 * that fills half its canvas renders at half the size of one that fills it.
 *
 * Measured on the homepage category tiles before this ran: all four images
 * occupied the same 151 x 151 box and filled 94% of it — the CSS was already
 * correct — yet the devices inside still read at visibly different sizes,
 * because the difference lives inside the artwork.
 *
 * Cropping the viewBox to the drawing makes `object-contain` do the
 * normalisation for free, everywhere, without touching a single call site.
 *
 * HOW
 *
 * Bounds are measured, not guessed: each file is rendered in a headless
 * browser and `SVGGraphicsElement.getBBox()` reports the union of what is
 * actually painted. A uniform margin is then added back so devices do not
 * touch the edge of their box.
 *
 * `width`/`height` are rewritten alongside the viewBox. Leaving them at 600
 * would re-letterbox the tightened viewBox inside a square and undo the whole
 * exercise.
 *
 * Idempotent: running it twice is a no-op, because the second pass measures
 * the same drawing and computes the same box.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { chromium } from '@playwright/test';

const DIR = path.join('public', 'mock', 'products', 'cutout');
/** Share of the longer edge left as breathing room on every side. */
const MARGIN = 0.04;

const out = (line) => process.stdout.write(`${line}\n`);

const files = (await readdir(DIR)).filter((f) => f.endsWith('.svg'));
if (files.length === 0) {
  out(`no cutouts in ${DIR}`);
  process.exit(0);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><body></body>');

let changed = 0;
let already = 0;
const ratios = [];

for (const file of files) {
  const full = path.join(DIR, file);
  const source = await readFile(full, 'utf8');

  const box = await page.evaluate((svgText) => {
    document.body.innerHTML = svgText;
    const svg = document.body.querySelector('svg');
    if (!svg) return null;
    // Measure what is painted. <defs> contributes nothing because it is not
    // rendered, so this is the device plus its ground shadow.
    const b = svg.getBBox();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  }, source);

  if (!box || box.w <= 0 || box.h <= 0) {
    out(`  ! ${file}: no measurable drawing — left alone`);
    continue;
  }

  const margin = Math.max(box.w, box.h) * MARGIN;
  const x = Math.round((box.x - margin) * 10) / 10;
  const y = Math.round((box.y - margin) * 10) / 10;
  const w = Math.round((box.w + margin * 2) * 10) / 10;
  const h = Math.round((box.h + margin * 2) * 10) / 10;

  const viewBox = `${x} ${y} ${w} ${h}`;
  const next = source
    .replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`)
    .replace(/\swidth="[^"]*"/, ` width="${Math.round(w)}"`)
    .replace(/\sheight="[^"]*"/, ` height="${Math.round(h)}"`);

  ratios.push(w / h);

  if (next === source) {
    already += 1;
  } else {
    await writeFile(full, next, 'utf8');
    changed += 1;
  }
}

await browser.close();

const min = Math.min(...ratios);
const max = Math.max(...ratios);
out(`\n  ${files.length} cutout(s) · ${changed} rewritten · ${already} already tight`);
out(`  aspect ratios now span ${min.toFixed(2)} .. ${max.toFixed(2)}`);
out('  (a spread here is correct — a column speaker IS taller than a receiver.');
out('   What matters is that each one now fills its box in its long dimension.)');
