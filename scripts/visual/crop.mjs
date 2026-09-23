#!/usr/bin/env node
/**
 * Crop a vertical slice out of a full-page PNG.
 *
 * Measurements tell you a band exists; looking at it tells you what it is.
 *
 *   node scripts/visual/crop.mjs <src.png> <y> <height> <out.png> [--scale 0.5]
 */

import { createReadStream, createWriteStream } from 'node:fs';
import process from 'node:process';

import { PNG } from 'pngjs';

const [src, yArg, hArg, out, ...rest] = process.argv.slice(2);
if (!src || !out) {
  process.stderr.write('usage: crop.mjs <src.png> <y> <height> <out.png> [--scale n]\n');
  process.exit(2);
}
let scale = 1;
for (let i = 0; i < rest.length; i += 1) if (rest[i] === '--scale') scale = Number(rest[i + 1]);

createReadStream(src)
  .pipe(new PNG())
  .on('parsed', function parsed() {
    const y = Math.max(0, Math.round(Number(yArg)));
    const h = Math.min(Math.round(Number(hArg)), this.height - y);
    if (h <= 0) {
      process.stderr.write(`nothing to crop: image is ${this.width}x${this.height}, asked y=${y}\n`);
      process.exit(1);
    }
    const cropped = new PNG({ width: this.width, height: h });
    PNG.bitblt(this, cropped, 0, y, this.width, h, 0, 0);

    let final = cropped;
    if (scale !== 1) {
      const w2 = Math.max(1, Math.round(this.width * scale));
      const h2 = Math.max(1, Math.round(h * scale));
      final = new PNG({ width: w2, height: h2 });
      for (let ty = 0; ty < h2; ty += 1) {
        const sy = Math.min(h - 1, Math.floor(ty / scale));
        for (let tx = 0; tx < w2; tx += 1) {
          const sx = Math.min(this.width - 1, Math.floor(tx / scale));
          const si = (sy * cropped.width + sx) << 2;
          const ti = (ty * w2 + tx) << 2;
          final.data[ti] = cropped.data[si];
          final.data[ti + 1] = cropped.data[si + 1];
          final.data[ti + 2] = cropped.data[si + 2];
          final.data[ti + 3] = cropped.data[si + 3];
        }
      }
    }
    final.pack().pipe(createWriteStream(out)).on('finish', () => {
      process.stdout.write(`${out} (${final.width}x${final.height}) from y=${y} h=${h}\n`);
    });
  })
  .on('error', (e) => {
    process.stderr.write(`crop failed: ${e.message}\n`);
    process.exit(1);
  });
