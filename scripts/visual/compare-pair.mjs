#!/usr/bin/env node
/**
 * Pixel diff for one reference/local pair.
 *
 * IMPORTANT: read the caveat before quoting the number this prints.
 *
 * Our imagery, brand, copy and product photography are deliberately different
 * from the reference (they are copyrighted; see brief §10). A large share of
 * changed pixels is therefore *expected* and a raw percentage is NOT a verdict
 * on the reconstruction — `scripts/visual/geometry-diff.mjs` is the instrument
 * that actually answers "is the layout right?". What this is good for is
 * locating WHERE the two pages diverge: the per-band breakdown below shows
 * which horizontal band the changed pixels cluster in.
 *
 * The two pages are different heights, so both are compared on a shared canvas
 * of the smaller height and the height difference is reported separately rather
 * than silently padded.
 *
 *   node scripts/visual/compare-pair.mjs <ref.png> <local.png> <diff.png> [--bands 12]
 */

import { createReadStream, createWriteStream } from 'node:fs';
import process from 'node:process';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { THRESHOLDS } from '../../visual.config.mjs';

const [refPath, locPath, outPath, ...rest] = process.argv.slice(2);
if (!refPath || !locPath || !outPath) {
  process.stderr.write('usage: compare-pair.mjs <ref.png> <local.png> <diff.png> [--bands n]\n');
  process.exit(2);
}
let bandCount = 12;
for (let i = 0; i < rest.length; i += 1) if (rest[i] === '--bands') bandCount = Number(rest[i + 1]);

const read = (p) =>
  new Promise((resolve, reject) => {
    createReadStream(p)
      .pipe(new PNG())
      .on('parsed', function parsed() {
        resolve(this);
      })
      .on('error', reject);
  });

const [a, b] = await Promise.all([read(refPath), read(locPath)]);

const width = Math.min(a.width, b.width);
const height = Math.min(a.height, b.height);

/** Copy a region onto a fresh canvas so both sides share exact dimensions. */
const fit = (src) => {
  const out = new PNG({ width, height });
  PNG.bitblt(src, out, 0, 0, width, height, 0, 0);
  return out;
};

const refFit = fit(a);
const locFit = fit(b);
const diff = new PNG({ width, height });

const changed = pixelmatch(refFit.data, locFit.data, diff.data, width, height, {
  threshold: THRESHOLDS.pixelmatch,
  includeAA: THRESHOLDS.includeAA,
  diffColor: [255, 0, 255],
});

const total = width * height;
const pct = (changed / total) * 100;

// Per-band breakdown: which horizontal slice do the changed pixels sit in?
const bandHeight = Math.ceil(height / bandCount);
const bands = [];
for (let i = 0; i < bandCount; i += 1) {
  const y0 = i * bandHeight;
  const y1 = Math.min(height, y0 + bandHeight);
  if (y0 >= y1) break;
  let n = 0;
  for (let y = y0; y < y1; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width + x) << 2;
      // pixelmatch paints changed pixels magenta into `diff`.
      if (diff.data[idx] === 255 && diff.data[idx + 1] === 0 && diff.data[idx + 2] === 255) n += 1;
    }
  }
  const cells = (y1 - y0) * width;
  bands.push({ from: y0, to: y1, changed: n, percent: (n / cells) * 100 });
}

await new Promise((resolve, reject) => {
  diff.pack().pipe(createWriteStream(outPath)).on('finish', resolve).on('error', reject);
});

process.stdout.write(
  `${outPath}\n` +
    `  compared canvas   ${width} x ${height}\n` +
    `  reference size    ${a.width} x ${a.height}\n` +
    `  local size        ${b.width} x ${b.height}   (height delta ${b.height - a.height >= 0 ? '+' : ''}${b.height - a.height})\n` +
    `  changed pixels    ${changed.toLocaleString()} / ${total.toLocaleString()} = ${pct.toFixed(2)}%\n` +
    `  NOTE: assets and copy differ by design — use this to locate divergence,\n` +
    `        not as a pass/fail score. See geometry-diff.mjs for the real check.\n` +
    `  worst bands (by % changed):\n`,
);
for (const band of [...bands].sort((x, y) => y.percent - x.percent).slice(0, 6)) {
  process.stdout.write(
    `    y ${String(band.from).padStart(5)}–${String(band.to).padStart(5)}  ${band.percent.toFixed(1).padStart(5)}%\n`,
  );
}
