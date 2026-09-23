#!/usr/bin/env node
/**
 * Capture the local application into `artifacts/visual/local/`.
 *
 * Unlike the reference set this is NOT a baseline — it is the current state of
 * the work and is expected to be overwritten on every iteration.
 *
 *   node scripts/visual/capture-local.mjs
 *   node scripts/visual/capture-local.mjs --route home
 *   node scripts/visual/capture-local.mjs --base-url http://localhost:4000
 *
 * Routes marked `localReady: false` in `visual.config.mjs` are skipped with an
 * explicit message: the local app does not serve them yet, and pretending
 * otherwise would produce a 404 screenshot that scores as a real diff.
 */

import path from 'node:path';
import process from 'node:process';

import { LOCAL_BASE_URL, PATHS, ROUTES, VIEWPORTS } from '../../visual.config.mjs';
import { captureSide, log, warn } from './capture-core.mjs';

function parseArgs(argv) {
  const args = {
    out: PATHS.local,
    baseUrl: LOCAL_BASE_URL,
    routes: [],
    viewports: [],
    force: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--out') args.out = argv[++i];
    else if (arg === '--base-url') args.baseUrl = argv[++i];
    else if (arg === '--route') args.routes.push(argv[++i]);
    else if (arg === '--viewport') args.viewports.push(argv[++i]);
    else if (arg === '--include-unready') args.force = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else warn(`unknown argument: ${arg}`);
  }
  return args;
}

/**
 * Fail fast and clearly when nothing is listening on the local port — and
 * report WHICH application answered.
 *
 * Port 3000 is the default for every Next.js project on the machine. A dev
 * server left running by a different project will answer happily and the
 * capture will succeed, silently measuring the wrong application. Printing the
 * served <title> makes that mistake visible in one line instead of after an
 * hour of confusing diffs.
 */
async function assertLocalServer(baseUrl) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(baseUrl, {
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timer);

    let title = null;
    try {
      const html = await response.text();
      title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
    } catch {
      // Body unreadable is not fatal; the status is what gates the run.
    }

    return { reachable: true, status: response.status, title };
  } catch (error) {
    return { reachable: false, reason: error.message };
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    log(
      [
        'Usage: node scripts/visual/capture-local.mjs [options]',
        '',
        '  --base-url <url>     override LOCAL_BASE_URL',
        '  --out <dir>          capture into a different directory',
        '  --route <name>       limit to one route (repeatable)',
        '  --viewport <name>    limit to one viewport (repeatable)',
        '  --include-unready    also try routes flagged localReady: false',
      ].join('\n'),
    );
    return 0;
  }

  const health = await assertLocalServer(args.baseUrl);
  if (!health.reachable) {
    log('');
    warn(`No local server answering at ${args.baseUrl}`);
    log(`    reason: ${health.reason}`);
    log('');
    log('  Start the application first, then re-run this command.');
    log('  If the storefront has not been scaffolded in this repository yet,');
    log('  local capture cannot run and the reference side is the only half');
    log('  of the comparison that exists.');
    log('');
    return 3;
  }

  log(`local server reachable at ${args.baseUrl} (HTTP ${health.status})`);
  if (health.title) {
    log(`  serving: "${health.title}"`);
    log('  ^ confirm this is THIS project before trusting any diff below.');
  }

  let routes = args.routes.length
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

  const notReady = routes.filter((r) => !r.localReady);
  if (notReady.length > 0 && !args.force) {
    log('');
    warn(
      `${notReady.length} route(s) are not served locally yet and will be skipped: ` +
        `${notReady.map((r) => r.name).join(', ')}`,
    );
    log(
      '    Flip `localReady: true` in visual.config.mjs once the local route exists,',
    );
    log('    or pass --include-unready to attempt them anyway.');
  }

  const manifest = await captureSide({
    label: 'local',
    baseUrl: args.baseUrl,
    routes,
    viewports,
    outDir: path.resolve(process.cwd(), args.out),
    resolvePath: (route) =>
      route.localReady || args.force ? route.localPath : null,
  });

  const failed = manifest.results.filter((r) => !r.ok);
  if (failed.length > 0) {
    warn(`${failed.length} local capture(s) failed.`);
    return 1;
  }
  if (manifest.results.length === 0) {
    warn('no local screenshots were produced — every route was skipped.');
    return 3;
  }

  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    process.stderr.write(`capture-local failed: ${error.stack}\n`);
    process.exit(1);
  });
