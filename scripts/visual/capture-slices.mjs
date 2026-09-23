#!/usr/bin/env node
/**
 * Reference screenshots for visual inspection.
 *
 *   node scripts/visual/capture-slices.mjs
 *   node scripts/visual/capture-slices.mjs --path /guvenlik-sistemleri --name category
 *
 * Produces:
 *   reference/desktop-1440/<name>.png    full page
 *   reference/desktop-1366/<name>.png    full page
 *   reference/mobile-390/<name>.png      full page
 *   reference/_slices/<name>__<vp>__NN.png
 *
 * The slices exist because a 6000px-tall screenshot cannot actually be read.
 * Cutting it into viewport-sized bands is what makes the section sequence
 * legible — to a human reviewer and to the agent doing the reconstruction.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { LOCAL_BASE_URL, REFERENCE_BASE_URL } from '../../visual.config.mjs';
import { createContext, launchBrowser, log, stabilizePage, warn } from './capture-core.mjs';

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900, slices: true },
  { name: 'desktop-1366', width: 1366, height: 768, slices: false },
  { name: 'mobile-390', width: 390, height: 844, slices: true },
];

const SLICE_HEIGHT = { 'desktop-1440': 1100, 'mobile-390': 1400 };
const MAX_SLICES = 12;

function parseArgs(argv) {
  const args = { path: '/', name: 'homepage', local: false, root: 'reference' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--path') args.path = argv[++i];
    else if (argv[i] === '--name') args.name = argv[++i];
    // Same script, same stabilisation, same viewports — pointed at localhost.
    // Using one capture path for both sides is what makes the comparison fair.
    else if (argv[i] === '--local') {
      args.local = true;
      args.root = 'reference/local';
    } else if (argv[i] === '--root') args.root = argv[++i];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = args.local ? LOCAL_BASE_URL : REFERENCE_BASE_URL;
  const url = new URL(args.path, base).toString();
  const sliceDir = path.join(args.root, '_slices');

  await mkdir(sliceDir, { recursive: true });

  const browser = await launchBrowser();
  try {
    for (const vp of VIEWPORTS) {
      const dir = path.join(args.root, vp.name);
      await mkdir(dir, { recursive: true });

      const context = await createContext(browser, vp);
      const page = await context.newPage();
      try {
        log(`capturing ${url} @ ${vp.name}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
        await page.waitForLoadState('load').catch(() => {});
        await stabilizePage(page);

        const full = path.join(dir, `${args.name}.png`);
        await page.screenshot({
          path: full,
          fullPage: true,
          animations: 'disabled',
          caret: 'hide',
          scale: 'css',
          timeout: 60_000,
        });

        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        const width = await page.evaluate(() => document.documentElement.clientWidth);
        log(`  full page: ${width}x${height} -> ${full}`);

        if (!vp.slices) continue;

        const step = SLICE_HEIGHT[vp.name] ?? 1100;
        const count = Math.min(MAX_SLICES, Math.ceil(height / step));
        for (let i = 0; i < count; i += 1) {
          const y = i * step;
          const h = Math.min(step, height - y);
          if (h < 40) break;
          const file = path.join(
            sliceDir,
            `${args.name}__${vp.name}__${String(i + 1).padStart(2, '0')}.png`,
          );
          await page.screenshot({
            path: file,
            // `clip` is relative to the full-page image, so fullPage must stay
            // on — otherwise anything below the fold is "outside the image".
            fullPage: true,
            clip: { x: 0, y, width, height: h },
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
            timeout: 45_000,
          });
        }
        log(`  ${count} slices of ${step}px`);
      } catch (error) {
        warn(`${vp.name}: ${error.message}`);
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
    process.stderr.write(`capture-slices failed: ${e.stack}\n`);
    process.exit(1);
  });
