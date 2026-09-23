#!/usr/bin/env node
/**
 * Pixel-diff two screenshot directories and write a machine-readable report.
 *
 *   node scripts/visual/compare-screenshots.mjs
 *   node scripts/visual/compare-screenshots.mjs --target
 *   node scripts/visual/compare-screenshots.mjs \
 *       --baseline artifacts/visual/reference \
 *       --candidate artifacts/visual/_determinism
 *
 * The directories are deliberately parameters rather than constants. The same
 * engine serves three jobs:
 *   1. reference vs local        — the actual design gap
 *   2. reference vs reference-2  — capture noise / determinism check
 *   3. local  vs local-2         — regression between two of your own runs
 *
 * Exit code is non-zero when any comparison exceeds its threshold, so this can
 * gate a loop without any extra glue.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import {
  CRITICAL_BANDS,
  PATHS,
  THRESHOLDS,
} from '../../visual.config.mjs';
import { ensureDir, log, warn } from './capture-core.mjs';

function parseArgs(argv) {
  const args = {
    baseline: PATHS.reference,
    candidate: PATHS.local,
    out: PATHS.diff,
    json: PATHS.diffJson,
    max: null,
    useTarget: false,
    label: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--baseline') args.baseline = argv[++i];
    else if (arg === '--candidate') args.candidate = argv[++i];
    else if (arg === '--out') args.out = argv[++i];
    else if (arg === '--json') args.json = argv[++i];
    else if (arg === '--max') args.max = Number(argv[++i]);
    else if (arg === '--target') args.useTarget = true;
    else if (arg === '--label') args.label = argv[++i];
    else if (arg === '--help' || arg === '-h') args.help = true;
    else warn(`unknown argument: ${arg}`);
  }
  return args;
}

/** `home__desktop__viewport.png` -> { route, viewport, kind } */
function parseName(file) {
  const base = file.replace(/\.png$/i, '');
  const [route, viewport, kind] = base.split('__');
  return { route, viewport, kind };
}

async function readPng(file) {
  return PNG.sync.read(await readFile(file));
}

/**
 * Place `src` at the top-left of a `width`x`height` white canvas.
 * Used when the two sides differ in size so a single diff still covers the
 * whole union area instead of quietly cropping the taller page away.
 */
function padToCanvas(src, width, height) {
  if (src.width === width && src.height === height) return src;

  const canvas = new PNG({ width, height });
  canvas.data.fill(0xff); // opaque white
  PNG.bitblt(src, canvas, 0, 0, Math.min(src.width, width), Math.min(src.height, height), 0, 0);
  return canvas;
}

/** Extract rows [y0, y1) as a standalone RGBA buffer. */
function cropRows(png, y0, y1) {
  const top = Math.max(0, Math.min(y0, png.height));
  const bottom = Math.max(top, Math.min(y1, png.height));
  const height = bottom - top;
  if (height <= 0) return null;

  const out = new PNG({ width: png.width, height });
  PNG.bitblt(png, out, 0, top, png.width, height, 0, 0);
  return out;
}

function diffOf(a, b) {
  const output = new PNG({ width: a.width, height: a.height });
  const diffPixels = pixelmatch(a.data, b.data, output.data, a.width, a.height, {
    threshold: THRESHOLDS.pixelmatch,
    includeAA: THRESHOLDS.includeAA,
    alpha: 0.25,
    // Three distinct, saturated markers so a diff image can be read by eye and
    // re-analysed by `diff-hotspots.mjs` without ambiguity:
    diffColor: [255, 0, 128], //  magenta — counted difference
    diffColorAlt: [255, 170, 0], //  amber  — counted difference, other direction
    aaColor: [0, 200, 255], //  cyan   — anti-aliasing, deliberately NOT counted
  });
  const totalPixels = a.width * a.height;
  return {
    output,
    diffPixels,
    totalPixels,
    diffPercent: totalPixels === 0 ? 0 : (diffPixels / totalPixels) * 100,
  };
}

function thresholdFor(kind, args) {
  if (args.max !== null && Number.isFinite(args.max)) return args.max;
  if (args.useTarget) return THRESHOLDS.targetDiffPercent;
  return kind === 'full'
    ? THRESHOLDS.maxDiffPercentFullPage
    : THRESHOLDS.maxDiffPercent;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    log(
      [
        'Usage: node scripts/visual/compare-screenshots.mjs [options]',
        '',
        '  --baseline <dir>   default artifacts/visual/reference',
        '  --candidate <dir>  default artifacts/visual/local',
        '  --out <dir>        diff image output directory',
        '  --json <file>      report path',
        '  --max <percent>    override the pass threshold',
        '  --target           use the tighter target threshold',
        '  --label <text>     label recorded in the report',
      ].join('\n'),
    );
    return 0;
  }

  const baselineDir = path.resolve(process.cwd(), args.baseline);
  const candidateDir = path.resolve(process.cwd(), args.candidate);
  const diffDir = path.resolve(process.cwd(), args.out);

  if (!existsSync(baselineDir)) {
    warn(`baseline directory does not exist: ${baselineDir}`);
    return 2;
  }

  const baselineFiles = (await readdir(baselineDir))
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .sort();

  if (baselineFiles.length === 0) {
    warn(`no baseline screenshots in ${baselineDir}`);
    log('  Run `npm run visual:reference` first.');
    return 2;
  }

  await ensureDir(diffDir);
  await ensureDir(path.dirname(path.resolve(process.cwd(), args.json)));

  const comparisons = [];

  log('');
  log(`baseline : ${baselineDir}`);
  log(`candidate: ${candidateDir}`);
  log('');

  for (const file of baselineFiles) {
    const { route, viewport, kind } = parseName(file);
    const baselinePath = path.join(baselineDir, file);
    const candidatePath = path.join(candidateDir, file);
    const threshold = thresholdFor(kind, args);

    if (!existsSync(candidatePath)) {
      comparisons.push({
        file,
        route,
        viewport,
        kind,
        status: 'missing-candidate',
        pass: false,
        threshold,
        message: `no counterpart in ${path.relative(process.cwd(), candidateDir)}`,
      });
      log(`  MISSING  ${file}`);
      continue;
    }

    const baselinePng = await readPng(baselinePath);
    const candidatePng = await readPng(candidatePath);

    const sizeMismatch =
      baselinePng.width !== candidatePng.width ||
      baselinePng.height !== candidatePng.height;

    const width = Math.max(baselinePng.width, candidatePng.width);
    const height = Math.max(baselinePng.height, candidatePng.height);

    const a = padToCanvas(baselinePng, width, height);
    const b = padToCanvas(candidatePng, width, height);

    const { output, diffPixels, totalPixels, diffPercent } = diffOf(a, b);

    const diffFile = file.replace(/\.png$/i, '__diff.png');
    await writeFile(path.join(diffDir, diffFile), PNG.sync.write(output));

    // Critical regions get their own, tighter measurement — but only on the
    // viewport shot, where "180px from the top" means the header.
    const bands = [];
    if (kind === 'viewport') {
      for (const band of CRITICAL_BANDS) {
        const bandA = cropRows(a, band.fromPx, band.toPx);
        const bandB = cropRows(b, band.fromPx, band.toPx);
        if (!bandA || !bandB) continue;
        const bandDiff = diffOf(bandA, bandB);
        bands.push({
          name: band.name,
          fromPx: band.fromPx,
          toPx: band.toPx,
          diffPixels: bandDiff.diffPixels,
          totalPixels: bandDiff.totalPixels,
          diffPercent: Number(bandDiff.diffPercent.toFixed(3)),
          threshold: band.maxDiffPercent,
          pass: bandDiff.diffPercent <= band.maxDiffPercent,
        });
      }
    }

    const pass = diffPercent <= threshold && bands.every((band) => band.pass);

    comparisons.push({
      file,
      route,
      viewport,
      kind,
      status: 'compared',
      sizeMismatch,
      baseline: {
        path: path.relative(process.cwd(), baselinePath),
        width: baselinePng.width,
        height: baselinePng.height,
      },
      candidate: {
        path: path.relative(process.cwd(), candidatePath),
        width: candidatePng.width,
        height: candidatePng.height,
      },
      diff: {
        path: path.relative(process.cwd(), path.join(diffDir, diffFile)),
        width,
        height,
      },
      diffPixels,
      totalPixels,
      diffPercent: Number(diffPercent.toFixed(3)),
      threshold,
      bands,
      pass,
    });

    const flag = pass ? 'PASS' : 'FAIL';
    const size = sizeMismatch
      ? `  [size ${baselinePng.width}x${baselinePng.height} vs ${candidatePng.width}x${candidatePng.height}]`
      : '';
    log(
      `  ${flag}  ${file}  ${diffPercent.toFixed(2)}% (${diffPixels} px, limit ${threshold}%)${size}`,
    );
    for (const band of bands.filter((x) => !x.pass)) {
      log(
        `        band ${band.name}: ${band.diffPercent.toFixed(2)}% over ${band.threshold}%`,
      );
    }
  }

  const compared = comparisons.filter((c) => c.status === 'compared');
  const failing = comparisons.filter((c) => !c.pass);
  const worst = [...compared].sort((a, b) => b.diffPercent - a.diffPercent);

  const report = {
    generatedAt: new Date().toISOString(),
    label: args.label ?? `${path.basename(baselineDir)} → ${path.basename(candidateDir)}`,
    baselineDir: path.relative(process.cwd(), baselineDir),
    candidateDir: path.relative(process.cwd(), candidateDir),
    thresholdMode: args.useTarget ? 'target' : args.max !== null ? 'custom' : 'initial',
    thresholds: THRESHOLDS,
    summary: {
      total: comparisons.length,
      compared: compared.length,
      missing: comparisons.filter((c) => c.status === 'missing-candidate').length,
      passed: comparisons.filter((c) => c.pass).length,
      failed: failing.length,
      worstDiffPercent: worst.length ? worst[0].diffPercent : null,
      worstFile: worst.length ? worst[0].file : null,
      averageDiffPercent: compared.length
        ? Number(
            (
              compared.reduce((sum, c) => sum + c.diffPercent, 0) / compared.length
            ).toFixed(3),
          )
        : null,
    },
    comparisons,
  };

  const jsonPath = path.resolve(process.cwd(), args.json);
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  log('');
  log(
    `  compared ${compared.length}, passed ${report.summary.passed}, ` +
      `failed ${report.summary.failed}, missing ${report.summary.missing}`,
  );
  if (report.summary.worstFile) {
    log(
      `  worst: ${report.summary.worstFile} at ${report.summary.worstDiffPercent}%`,
    );
  }
  log(`  report: ${path.relative(process.cwd(), jsonPath)}`);
  log('');

  return failing.length > 0 ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    process.stderr.write(`compare-screenshots failed: ${error.stack}\n`);
    process.exit(1);
  });
