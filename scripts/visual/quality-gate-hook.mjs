#!/usr/bin/env node
/**
 * Claude Code `Stop` hook wrapper around the fast quality gate.
 *
 * Why a wrapper instead of calling quality-gate.mjs directly:
 *
 *   1. Loop safety. A Stop hook that exits 2 blocks the stop and hands its
 *      stderr back to Claude. If the gate keeps failing, that could bounce
 *      forever. Claude Code sets `stop_hook_active: true` on the hook payload
 *      when the turn is already continuing because of a stop hook — we read
 *      that from stdin and exit 0 immediately, so the loop can run at most one
 *      extra time.
 *
 *   2. Cost control. This runs the FAST gate only. Production builds are a
 *      milestone action (`npm run quality:full`), never a per-turn tax.
 *
 *   3. Self-trigger safety. The gate only writes into `artifacts/visual/`,
 *      which is gitignored generated output, and the Stop event does not fire
 *      on file writes anyway.
 *
 * Exit codes:
 *   0  gate passed, or intentionally skipped — Claude stops normally
 *   2  gate failed — stderr is shown to Claude so it can fix the cause
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const TIMEOUT_MS = 110_000; // stays under the 120s hook timeout in settings.json

async function readStdin() {
  if (process.stdin.isTTY) return '';
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function runGate() {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [path.join('scripts', 'visual', 'quality-gate.mjs'), '--quiet'],
      { cwd: ROOT, env: { ...process.env, FORCE_COLOR: '0' } },
    );

    let output = '';
    child.stdout.on('data', (c) => (output += c.toString()));
    child.stderr.on('data', (c) => (output += c.toString()));

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      output += '\n[hook] quality gate timed out\n';
    }, TIMEOUT_MS);

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, output });
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({ code: 1, output: `${output}\n${error.message}` });
    });
  });
}

async function main() {
  let payload = {};
  try {
    const raw = await readStdin();
    if (raw.trim()) payload = JSON.parse(raw);
  } catch {
    // A malformed or absent payload is not a reason to block the turn.
  }

  // Loop guard: we are already here because of a previous Stop hook.
  if (payload.stop_hook_active === true) {
    process.exit(0);
  }

  const { code, output } = await runGate();

  if (code === 0) {
    process.exit(0);
  }

  process.stderr.write(
    [
      'Quality gate failed at the end of this turn. Nothing was reverted.',
      '',
      output.trim(),
      '',
      'Fix the cause, then re-run: npm run quality:gate',
    ].join('\n'),
  );
  process.exit(2);
}

main().catch((error) => {
  // A broken hook must never wedge the session.
  process.stderr.write(`[hook] quality-gate-hook error: ${error.message}\n`);
  process.exit(0);
});
