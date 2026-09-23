#!/usr/bin/env node
/**
 * Turn a diff image into "which part of the page is wrong".
 *
 *   node scripts/visual/diff-hotspots.mjs artifacts/visual/diff/home__desktop__viewport__diff.png
 *   node scripts/visual/diff-hotspots.mjs --worst
 *
 * A percentage tells you how much differs; it does not tell you where. This
 * scans the diff image for the magenta the comparator paints on changed
 * pixels and reports the vertical bands they cluster in, largest first.
 *
 * That band is the region to look at next — and if the band turns out to be a
 * carousel or a ticker rather than a layout defect, it is the selector to add
 * to MASK_SELECTORS in visual.config.mjs.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { PNG } from 'pngjs';

import { PATHS } from '../../visual.config.mjs';
import { log, warn } from './capture-core.mjs';

/**
 * Detect a pixel the comparator marked as changed.
 *
 * The comparator paints three markers (see `compare-screenshots.mjs`):
 *   magenta — a counted difference
 *   amber   — a counted difference in the other direction
 *   cyan    — anti-aliasing, which pixelmatch deliberately does NOT count
 *
 * Only the first two are matched here, so this total lines up with the
 * `diffPixels` figure in the report instead of quietly including AA noise.
 */
function isChanged(data, i) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const magenta = r > 200 && g < 90 && b > 80 && b < 200;
  const amber = r > 200 && g > 130 && g < 215 && b < 90;
  return magenta || amber;
}

function analyse(png) {
  const { width, height, data } = png;
  const rowCounts = new Array(height).fill(0);

  for (let y = 0; y < height; y += 1) {
    let count = 0;
    const rowStart = y * width * 4;
    for (let x = 0; x < width; x += 1) {
      if (isChanged(data, rowStart + x * 4)) count += 1;
    }
    rowCounts[y] = count;
  }

  // A row is "hot" when at least 0.5% of its width changed — enough to ignore
  // stray anti-aliasing, low enough to catch a thin misaligned rule.
  const hotFloor = Math.max(2, width * 0.005);
  const bands = [];
  let start = null;

  for (let y = 0; y <= height; y += 1) {
    const hot = y < height && rowCounts[y] >= hotFloor;
    if (hot && start === null) start = y;
    if (!hot && start !== null) {
      if (y - start >= 3) {
        const slice = rowCounts.slice(start, y);
        bands.push({
          fromPx: start,
          toPx: y,
          heightPx: y - start,
          peakWidthPx: Math.max(...slice),
          changedPixels: slice.reduce((sum, n) => sum + n, 0),
        });
      }
      start = null;
    }
  }

  const changedPixels = rowCounts.reduce((sum, n) => sum + n, 0);

  return {
    width,
    height,
    changedPixels,
    changedPercent: Number(((changedPixels / (width * height)) * 100).toFixed(3)),
    bands: bands.sort((a, b) => b.changedPixels - a.changedPixels),
  };
}

async function pickWorst() {
  const jsonPath = path.resolve(process.cwd(), PATHS.diffJson);
  if (!existsSync(jsonPath)) return null;
  const report = JSON.parse(await readFile(jsonPath, 'utf8'));
  const worst = report.comparisons
    .filter((c) => c.status === 'compared' && c.diff?.path)
    .sort((a, b) => b.diffPercent - a.diffPercent)[0];
  return worst?.diff?.path ?? null;
}

async function main() {
  const argv = process.argv.slice(2);

  let target = argv.find((a) => !a.startsWith('--'));
  if (argv.includes('--worst') || !target) {
    target = await pickWorst();
    if (!target) {
      warn('no diff image given and no comparison report to pick one from.');
      log('  Usage: node scripts/visual/diff-hotspots.mjs <diff.png>');
      log('     or: npm run visual:compare && node scripts/visual/diff-hotspots.mjs --worst');
      return 2;
    }
    log(`worst diff from the latest report: ${target}`);
  }

  const file = path.resolve(process.cwd(), target);
  if (!existsSync(file)) {
    warn(`no such file: ${target}`);
    return 2;
  }

  const result = analyse(PNG.sync.read(await readFile(file)));

  log('');
  log(`${path.relative(process.cwd(), file)}  ${result.width}x${result.height}`);
  log(`changed: ${result.changedPixels.toLocaleString('tr-TR')} px (${result.changedPercent}%)`);
  log('');

  if (result.bands.length === 0) {
    log('  No clustered differences — anything left is scattered anti-aliasing.');
    return 0;
  }

  log('  Vertical bands, largest first:');
  log('');
  log('    from     to   height    changed px   peak width');
  for (const band of result.bands.slice(0, 12)) {
    log(
      `    ${String(band.fromPx).padStart(5)}  ${String(band.toPx).padStart(5)}` +
        `  ${String(band.heightPx).padStart(6)}` +
        `  ${band.changedPixels.toLocaleString('tr-TR').padStart(12)}` +
        `  ${String(band.peakWidthPx).padStart(11)}`,
    );
  }
  if (result.bands.length > 12) {
    log(`    … and ${result.bands.length - 12} smaller band(s)`);
  }
  log('');
  log('  Scroll the reference and local screenshots to the top band first.');
  log('  If it is a carousel, ticker or countdown rather than a layout defect,');
  log('  add its selector to MASK_SELECTORS in visual.config.mjs.');
  log('');

  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    process.stderr.write(`diff-hotspots failed: ${error.stack}\n`);
    process.exit(1);
  });
