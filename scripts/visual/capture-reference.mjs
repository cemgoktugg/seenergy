#!/usr/bin/env node
/**
 * Capture the reference site into `artifacts/visual/reference/`.
 *
 * The reference set is a BASELINE. Once it exists it is not overwritten by
 * accident: a second run refuses unless `--refresh-baseline` is passed
 * explicitly, and a refresh announces itself loudly before it starts.
 *
 *   node scripts/visual/capture-reference.mjs
 *   node scripts/visual/capture-reference.mjs --refresh-baseline
 *   node scripts/visual/capture-reference.mjs --out artifacts/visual/_determinism
 *   node scripts/visual/capture-reference.mjs --route home --viewport desktop
 *
 * Content policy: screenshots are measurement input for layout, spacing and
 * hierarchy analysis. Reference branding, copy and imagery are never copied
 * into the project.
 */

import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import {
  PATHS,
  REFERENCE_BASE_URL,
  ROUTES,
  VIEWPORTS,
} from '../../visual.config.mjs';
import { captureSide, log, warn } from './capture-core.mjs';

function parseArgs(argv) {
  const args = {
    refresh: false,
    out: PATHS.reference,
    routes: [],
    viewports: [],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--refresh-baseline') args.refresh = true;
    else if (arg === '--out') args.out = argv[++i];
    else if (arg === '--route') args.routes.push(argv[++i]);
    else if (arg === '--viewport') args.viewports.push(argv[++i]);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else {
      warn(`unknown argument: ${arg}`);
    }
  }
  return args;
}

async function containsScreenshots(dir) {
  if (!existsSync(dir)) return false;
  const entries = await readdir(dir);
  return entries.some((name) => name.endsWith('.png'));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    log(
      [
        'Usage: node scripts/visual/capture-reference.mjs [options]',
        '',
        '  --refresh-baseline   overwrite the existing reference baseline',
        '  --out <dir>          capture into a different directory',
        '  --route <name>       limit to one route (repeatable)',
        '  --viewport <name>    limit to one viewport (repeatable)',
      ].join('\n'),
    );
    return 0;
  }

  const outDir = path.resolve(process.cwd(), args.out);
  const isCanonicalBaseline =
    path.resolve(process.cwd(), PATHS.reference) === outDir;

  if (isCanonicalBaseline && (await containsScreenshots(outDir))) {
    if (!args.refresh) {
      log('');
      log('  Reference baseline already exists and was left untouched.');
      log(`  ${outDir}`);
      log('');
      log('  Capturing again would silently move the target you are measuring');
      log('  against. If that is what you want, run the explicit command:');
      log('');
      log('      npm run visual:update-baseline');
      log('');
      return 2;
    }

    log('');
    log('  ================================================================');
    log('   BASELINE REFRESH — the reference baseline is being REPLACED.');
    log('   Every previously measured diff percentage becomes historical.');
    log('   Re-run `npm run visual:compare` afterwards before trusting any');
    log('   number in an existing report.');
    log('  ================================================================');
    log('');
  }

  const routes = args.routes.length
    ? ROUTES.filter((r) => args.routes.includes(r.name))
    : ROUTES;
  const viewports = args.viewports.length
    ? VIEWPORTS.filter((v) => args.viewports.includes(v.name))
    : VIEWPORTS;

  if (routes.length === 0) {
    warn(`no route matched: ${args.routes.join(', ')}`);
    return 1;
  }
  if (viewports.length === 0) {
    warn(`no viewport matched: ${args.viewports.join(', ')}`);
    return 1;
  }

  const manifest = await captureSide({
    label: 'reference',
    baseUrl: REFERENCE_BASE_URL,
    routes,
    viewports,
    outDir,
    resolvePath: (route) => route.referencePath,
  });

  const failed = manifest.results.filter((r) => !r.ok);
  if (failed.length > 0) {
    warn(
      `${failed.length} capture(s) failed. The reference site may be rate limiting, ` +
        'geo-restricting or blocking automated clients — this is reported, not hidden.',
    );
    return 1;
  }

  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    process.stderr.write(`capture-reference failed: ${error.stack}\n`);
    process.exit(1);
  });
