#!/usr/bin/env node
/**
 * Quality gate — run after a group of changes, not after every keystroke.
 *
 *   node scripts/visual/quality-gate.mjs          # fast gate
 *   node scripts/visual/quality-gate.mjs --full   # + production build
 *
 * Rules this script follows:
 *   - It only runs commands that actually exist. A missing `typecheck` script
 *     is reported as "not configured", never invented and never faked.
 *   - It stops at the first failure so an expensive build never runs behind a
 *     broken lint.
 *   - It never reverts, resets or stashes anything. Your files are yours.
 *   - It refuses to re-enter itself, so a Claude Code hook cannot loop.
 *
 * WHY THE TWO MODES SOURCE THEIR SERVER DIFFERENTLY
 *
 * The server-dependent stages (`warm-routes`, `responsive-smoke`) need
 * something answering on the local port, and the two modes get it from
 * opposite directions:
 *
 *   fast   the dev server you already have running. `PW_EXTERNAL_SERVER=1`
 *          keeps Playwright from managing it — see playwright.config.ts.
 *   full   its own `next start` over the build it just produced.
 *
 * `--full` used to run the same stage order as the fast gate and simply append
 * the build at the end. That combination could never execute cleanly: the smoke
 * stage required a dev server to be up, and CLAUDE.md forbids `next build`
 * while one is (the build replaces `.next` underneath it and every later
 * capture silently measures an unstyled page). So --full either had no server
 * for its tests or corrupted the one it had. It is therefore reordered here —
 * build FIRST, then serve the build — and it refuses to start at all while a
 * server already holds the port, because that server is the thing the build
 * would pull the rug out from under.
 *
 * The reorder is also better evidence: the milestone check now measures the
 * production bundle that ships rather than the dev bundle that does not.
 */

import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';

import { LOCAL_BASE_URL } from '../../visual.config.mjs';

const ROOT = process.cwd();
const REPORT_PATH = 'artifacts/visual/reports/quality-gate.json';
const REENTRY_FLAG = 'CLAUDE_QUALITY_GATE_RUNNING';

const args = process.argv.slice(2);
const FULL = args.includes('--full');
const QUIET = args.includes('--quiet');

const out = (line) => process.stdout.write(`${line}\n`);

function tail(text, limit = 2400) {
  const trimmed = text.trimEnd();
  return trimmed.length <= limit ? trimmed : `…\n${trimmed.slice(-limit)}`;
}

/**
 * Run a command and capture its output.
 * `shell: true` is required on Windows for `npm`/`npx` (.cmd shims); every
 * command string here is built from this repository's own package.json, never
 * from external input.
 */
function run(command, { timeoutMs = 15 * 60 * 1000, env = {} } = {}) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(command, {
      cwd: ROOT,
      shell: true,
      env: { ...process.env, [REENTRY_FLAG]: '1', FORCE_COLOR: '0', ...env },
    });

    let buffer = '';
    const append = (chunk) => {
      buffer += chunk.toString();
      if (!QUIET) process.stdout.write(chunk);
    };

    child.stdout.on('data', append);
    child.stderr.on('data', append);

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      buffer += `\n[quality-gate] timed out after ${timeoutMs}ms\n`;
    }, timeoutMs);

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        exitCode: code ?? 1,
        durationMs: Date.now() - started,
        output: buffer,
      });
    });

    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({
        exitCode: 1,
        durationMs: Date.now() - started,
        output: `${buffer}\n${error.message}`,
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/* the production server --full manages for itself                      */
/* ------------------------------------------------------------------ */

const LOCAL_PORT = Number(new URL(LOCAL_BASE_URL).port || 80);

/** Is anything holding the local port right now? */
function portInUse(port) {
  return new Promise((resolve) => {
    const socket = net
      .connect({ port, host: '127.0.0.1' })
      .on('connect', () => {
        socket.destroy();
        resolve(true);
      })
      .on('error', () => resolve(false));
    socket.setTimeout(1500, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

/** Poll the base URL until it answers, or give up. */
async function waitForServer(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function readPackageJson() {
  const file = path.join(ROOT, 'package.json');
  if (!existsSync(file)) return { scripts: {}, deps: {} };
  try {
    const pkg = JSON.parse(await readFile(file, 'utf8'));
    return {
      scripts: pkg.scripts ?? {},
      deps: { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) },
    };
  } catch {
    return { scripts: {}, deps: {} };
  }
}

/**
 * Decide what to run, from what the repository actually has.
 * Each stage resolves to a command string, or a reason it cannot run.
 */
function planStages({ scripts, deps }) {
  const has = (name) => typeof scripts[name] === 'string' && scripts[name].length > 0;

  const stages = [];

  // 1. Format — check-only variants. A bare `format` script usually rewrites
  //    files, and a quality gate must not edit the tree behind the author.
  const formatCheck = ['format:check', 'format:ci', 'prettier:check'].find(has);
  stages.push({
    name: 'format',
    command: formatCheck ? `npm run ${formatCheck}` : null,
    skipReason: has('format')
      ? 'only a write-mode `format` script exists; a gate must not rewrite files'
      : 'no format:check script configured',
  });

  // 2. Lint
  stages.push({
    name: 'lint',
    command: has('lint') ? 'npm run lint' : null,
    skipReason: 'no `lint` script configured',
  });

  // 3. Typecheck — fall back to the framework-safe command only when the
  //    project genuinely is a TypeScript project.
  let typecheck = null;
  let typecheckSkip = 'no `typecheck` script and no tsconfig.json + typescript dependency';
  if (has('typecheck')) {
    typecheck = 'npm run typecheck';
  } else if (existsSync(path.join(ROOT, 'tsconfig.json')) && deps.typescript) {
    typecheck = 'npx tsc --noEmit';
    typecheckSkip = null;
  }
  stages.push({ name: 'typecheck', command: typecheck, skipReason: typecheckSkip });

  // 4. Unit tests
  stages.push({
    name: 'unit-tests',
    command: has('test') ? 'npm run test' : null,
    skipReason: 'no `test` script configured',
  });

  const hasPlaywright =
    existsSync(path.join(ROOT, 'playwright.config.ts')) ||
    existsSync(path.join(ROOT, 'playwright.config.js'));

  // 5. Route warmup — `next dev` compiles a route on first request, which cost
  //    this gate two different false failures (a mid-compile 500 masked by a
  //    retry, and a webServer probe that timed out and spawned a duplicate
  //    server into EADDRINUSE). The warmup cannot fail the gate; it only
  //    removes the artifact so a failure means the code is wrong.
  const warmScript = path.join('scripts', 'visual', 'warm-routes.mjs');
  const warmStage = {
    name: 'warm-routes',
    command:
      hasPlaywright && existsSync(path.join(ROOT, warmScript))
        ? `node ${warmScript}`
        : null,
    skipReason: existsSync(path.join(ROOT, warmScript))
      ? 'no Playwright configuration found'
      : 'no warm-routes script',
    needsServer: true,
  };

  // 6. Responsive smoke — cheap Playwright pass against localhost.
  //    `PW_EXTERNAL_SERVER=1` stops Playwright managing the dev server: it is
  //    already running here, and its reuse probe has twice misjudged a busy
  //    server, spawned a duplicate and killed the run with EADDRINUSE before
  //    any test executed. See the note in playwright.config.ts.
  const smokeStage = {
    name: 'responsive-smoke',
    command: hasPlaywright
      ? 'npx playwright test responsive-smoke --project=local --reporter=list'
      : null,
    // True in BOTH modes: in fast mode the server is the dev server, in full
    // mode it is the `next start` this script owns. Either way it is not
    // Playwright's to manage.
    env: { PW_EXTERNAL_SERVER: '1' },
    skipReason: 'no Playwright configuration found',
    needsServer: true,
  };

  // 7. Production build — milestone only.
  const buildStage = {
    name: 'build',
    command: FULL ? (has('build') ? 'npm run build' : null) : null,
    skipReason: FULL
      ? 'no `build` script configured'
      : 'skipped in fast mode — run `npm run quality:full` at a milestone',
    fullOnly: true,
  };

  // Order is the whole point — see the header note. In --full the build has to
  // land before anything needs a server, because the server the later stages
  // use is served FROM that build. In fast mode there is no build, and the
  // stage exists only to report itself as skipped, so it goes last.
  if (FULL) stages.push(buildStage, warmStage, smokeStage);
  else stages.push(warmStage, smokeStage, buildStage);

  return stages;
}

async function main() {
  if (process.env[REENTRY_FLAG] === '1') {
    out('[quality-gate] already running inside this process tree — not re-entering.');
    return 0;
  }

  out('');
  out(`Quality gate — ${FULL ? 'FULL (includes production build)' : 'fast'}`);
  out(`Repository: ${ROOT}`);
  out('');

  const pkg = await readPackageJson();
  const stages = planStages(pkg);

  // --full builds, and a build replaces `.next` underneath anything already
  // serving from it. Refuse up front rather than corrupting a running dev
  // server and then reporting green against an unstyled page.
  if (FULL && (await portInUse(LOCAL_PORT))) {
    out(`  ================ QUALITY GATE REFUSED ================`);
    out(`  Something is already serving port ${LOCAL_PORT}.`);
    out('');
    out('  `--full` runs a production build, which replaces .next underneath a');
    out('  running dev server — every capture taken afterwards silently measures');
    out('  an unstyled page (CLAUDE.md). It then serves the build itself for the');
    out('  warm-routes and smoke stages, so the port has to be free.');
    out('');
    out('  Stop the dev server and re-run, or use `npm run quality:gate`, which');
    out('  does not build and is happy to test the dev server you have.');
    out('  =====================================================');
    out('');
    return 1;
  }

  const results = [];
  let failed = null;
  let server = null;

  for (const stage of stages) {
    // In --full the build has just produced something to serve; start it the
    // moment a stage first needs one. In fast mode the dev server is already
    // there and this does nothing.
    if (FULL && stage.needsServer && stage.command && !server && !failed) {
      out(`  ▶     ${'serve-build'.padEnd(18)} npx next start -p ${LOCAL_PORT}`);
      server = spawn(`npx next start -p ${LOCAL_PORT}`, {
        cwd: ROOT,
        shell: true,
        env: { ...process.env, [REENTRY_FLAG]: '1', FORCE_COLOR: '0' },
        stdio: 'ignore',
        // Its own process group, so the shutdown below can signal the whole
        // tree. Windows has no groups and uses taskkill /T instead.
        detached: process.platform !== 'win32',
      });
      const up = await waitForServer(LOCAL_BASE_URL);
      if (!up) {
        results.push({
          name: 'serve-build',
          status: 'failed',
          reason: `no answer from ${LOCAL_BASE_URL} within 60s`,
        });
        out(`  FAIL  ${'serve-build'.padEnd(18)} no answer from ${LOCAL_BASE_URL}`);
        failed = 'serve-build';
      } else {
        results.push({ name: 'serve-build', status: 'passed', command: 'npx next start' });
        out(`  PASS  ${'serve-build'.padEnd(18)} serving the production build`);
      }
    }

    if (failed) {
      results.push({
        name: stage.name,
        status: 'not-run',
        reason: `earlier stage \`${failed}\` failed`,
      });
      out(`  ---- ${stage.name.padEnd(18)} not run (${failed} failed first)`);
      continue;
    }

    if (!stage.command) {
      results.push({
        name: stage.name,
        status: stage.fullOnly && !FULL ? 'skipped' : 'not-configured',
        reason: stage.skipReason,
      });
      out(`  ····  ${stage.name.padEnd(18)} ${stage.skipReason}`);
      continue;
    }

    out(`  ▶     ${stage.name.padEnd(18)} ${stage.command}`);
    const result = await run(stage.command, { env: stage.env });
    const ok = result.exitCode === 0;

    results.push({
      name: stage.name,
      status: ok ? 'passed' : 'failed',
      command: stage.command,
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      output: ok ? undefined : tail(result.output),
    });

    out(
      `  ${ok ? 'PASS ' : 'FAIL '} ${stage.name.padEnd(18)} exit ${result.exitCode} ` +
        `(${(result.durationMs / 1000).toFixed(1)}s)`,
    );

    if (!ok) failed = stage.name;
  }

  // Hand the port back. `shell: true` means `server.pid` is the shell, not the
  // node process holding the socket, so on Windows the tree has to go — killing
  // the shell alone leaves 3100 occupied and the NEXT run refuses to start.
  if (server) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
      } else {
        process.kill(-server.pid, 'SIGTERM');
      }
    } catch {
      server.kill('SIGTERM');
    }
    // Do not report success until the socket is actually released.
    for (let i = 0; i < 20 && (await portInUse(LOCAL_PORT)); i += 1) {
      await new Promise((r) => setTimeout(r, 250));
    }
    out(`  ····  ${'serve-build'.padEnd(18)} stopped; port ${LOCAL_PORT} released`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: FULL ? 'full' : 'fast',
    passed: !failed,
    failedStage: failed,
    stages: results,
  };

  await writeFile(
    path.join(ROOT, REPORT_PATH),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  ).catch(() => {});

  out('');
  if (failed) {
    const detail = results.find((r) => r.name === failed);
    out('  ================ QUALITY GATE FAILED ================');
    out(`  Stage: ${failed}   command: ${detail?.command}   exit: ${detail?.exitCode}`);
    out('');
    out(detail?.output ?? '(no output captured)');
    out('  =====================================================');
    out('');
    out('  Nothing was reverted. Fix the cause and re-run:');
    out(`      npm run ${FULL ? 'quality:full' : 'quality:gate'}`);
    out('');
    return 1;
  }

  const ran = results.filter((r) => r.status === 'passed').map((r) => r.name);
  const absent = results.filter((r) => r.status === 'not-configured');

  out(`  Quality gate passed. Ran: ${ran.length ? ran.join(', ') : 'nothing'}`);
  if (absent.length > 0) {
    out(`  Not configured in this repository: ${absent.map((r) => r.name).join(', ')}`);
  }
  out(`  Report: ${REPORT_PATH}`);
  out('');
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    process.stderr.write(`quality-gate failed: ${error.stack}\n`);
    process.exit(1);
  });
