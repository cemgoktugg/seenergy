#!/usr/bin/env node
/**
 * Turn `visual-diff.json` into something a human reads in ten seconds.
 *
 *   node scripts/visual/visual-report.mjs
 *   node scripts/visual/visual-report.mjs --json artifacts/visual/reports/other.json
 *
 * Writes a Markdown summary and a side-by-side HTML page. Neither invents a
 * number: everything shown comes from the comparison report.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { PATHS } from '../../visual.config.mjs';
import { ensureDir, log, warn } from './capture-core.mjs';

function parseArgs(argv) {
  const args = {
    json: PATHS.diffJson,
    markdown: PATHS.diffMarkdown,
    html: PATHS.diffHtml,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') args.json = argv[++i];
    else if (arg === '--markdown') args.markdown = argv[++i];
    else if (arg === '--html') args.html = argv[++i];
    else if (arg === '--help' || arg === '-h') args.help = true;
    else warn(`unknown argument: ${arg}`);
  }
  return args;
}

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  );

function verdict(entry) {
  if (entry.status === 'missing-candidate') return 'MISSING';
  return entry.pass ? 'PASS' : 'FAIL';
}

function groupByRoute(comparisons) {
  const map = new Map();
  for (const entry of comparisons) {
    if (!map.has(entry.route)) map.set(entry.route, []);
    map.get(entry.route).push(entry);
  }
  return map;
}

function buildMarkdown(report) {
  const lines = [];
  const s = report.summary;

  lines.push('# Visual diff report');
  lines.push('');
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Comparison: \`${report.baselineDir}\` → \`${report.candidateDir}\``);
  lines.push(`- Threshold mode: **${report.thresholdMode}**`);
  lines.push(
    `- Result: **${s.passed} passed / ${s.failed} failed / ${s.missing} missing** ` +
      `out of ${s.total}`,
  );
  if (s.worstFile) {
    lines.push(`- Worst: \`${s.worstFile}\` at **${s.worstDiffPercent}%**`);
    lines.push(`- Average diff across compared shots: **${s.averageDiffPercent}%**`);
  }
  lines.push('');

  if (s.missing > 0) {
    lines.push(
      `> ${s.missing} baseline screenshot(s) have no counterpart on the candidate ` +
        'side. Those routes were not captured locally — they are reported as ' +
        'missing rather than scored as a perfect match.',
    );
    lines.push('');
  }

  lines.push('## By route');
  lines.push('');

  for (const [route, entries] of groupByRoute(report.comparisons)) {
    lines.push(`### \`${route}\``);
    lines.push('');
    lines.push('| Viewport | Kind | Diff % | Limit | Size match | Result |');
    lines.push('| --- | --- | ---: | ---: | :---: | :---: |');
    for (const entry of entries.sort((a, b) =>
      `${a.viewport}${a.kind}`.localeCompare(`${b.viewport}${b.kind}`),
    )) {
      if (entry.status === 'missing-candidate') {
        lines.push(
          `| ${entry.viewport} | ${entry.kind} | — | ${entry.threshold}% | — | MISSING |`,
        );
        continue;
      }
      lines.push(
        `| ${entry.viewport} | ${entry.kind} | ${entry.diffPercent}% | ` +
          `${entry.threshold}% | ${entry.sizeMismatch ? 'no' : 'yes'} | ${verdict(entry)} |`,
      );
    }
    lines.push('');

    const banded = entries.filter((e) => e.bands?.length);
    if (banded.length > 0) {
      lines.push('**Critical regions**');
      lines.push('');
      lines.push('| Viewport | Region | Diff % | Limit | Result |');
      lines.push('| --- | --- | ---: | ---: | :---: |');
      for (const entry of banded) {
        for (const band of entry.bands) {
          lines.push(
            `| ${entry.viewport} | ${band.name} (${band.fromPx}–${band.toPx}px) | ` +
              `${band.diffPercent}% | ${band.threshold}% | ${band.pass ? 'PASS' : 'FAIL'} |`,
          );
        }
      }
      lines.push('');
    }
  }

  const ranked = report.comparisons
    .filter((c) => c.status === 'compared' && !c.pass)
    .sort((a, b) => b.diffPercent - a.diffPercent);

  lines.push('## Fix order');
  lines.push('');
  if (ranked.length === 0) {
    lines.push('No comparison is over its threshold.');
  } else {
    lines.push(
      'Largest measured gap first. Structure before decoration: container width, ' +
        'header height, type scale and grid come before shadows and radii.',
    );
    lines.push('');
    ranked.forEach((entry, index) => {
      lines.push(
        `${index + 1}. \`${entry.route}\` @ ${entry.viewport} (${entry.kind}) — ` +
          `**${entry.diffPercent}%** vs ${entry.threshold}% limit` +
          (entry.sizeMismatch
            ? `, page height differs (${entry.baseline.height} vs ${entry.candidate.height})`
            : ''),
      );
    });
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(
    '_Diff images use magenta for changed pixels. A magenta block is a real ' +
      'measured difference, not an artefact._',
  );
  lines.push('');

  return lines.join('\n');
}

function buildHtml(report, htmlPath) {
  const htmlDir = path.dirname(path.resolve(process.cwd(), htmlPath));
  const rel = (p) =>
    p ? path.relative(htmlDir, path.resolve(process.cwd(), p)).split(path.sep).join('/') : '';

  const s = report.summary;
  const cards = report.comparisons
    .map((entry) => {
      if (entry.status === 'missing-candidate') {
        return `<article class="card missing">
  <header><h3>${escapeHtml(entry.file)}</h3><span class="badge miss">MISSING</span></header>
  <p class="note">${escapeHtml(entry.message ?? 'No candidate screenshot.')}</p>
</article>`;
      }
      const bandRows = (entry.bands ?? [])
        .map(
          (b) =>
            `<tr class="${b.pass ? 'ok' : 'bad'}"><td>${escapeHtml(b.name)}</td>` +
            `<td>${b.fromPx}–${b.toPx}px</td><td>${b.diffPercent}%</td>` +
            `<td>${b.threshold}%</td><td>${b.pass ? 'PASS' : 'FAIL'}</td></tr>`,
        )
        .join('');

      return `<article class="card ${entry.pass ? 'ok' : 'bad'}">
  <header>
    <h3>${escapeHtml(entry.file)}</h3>
    <span class="badge ${entry.pass ? 'pass' : 'fail'}">${entry.pass ? 'PASS' : 'FAIL'}</span>
  </header>
  <p class="metrics">
    <strong>${entry.diffPercent}%</strong> different
    (${entry.diffPixels.toLocaleString('tr-TR')} px of ${entry.totalPixels.toLocaleString('tr-TR')})
    &middot; limit ${entry.threshold}%
    ${entry.sizeMismatch ? `&middot; <span class="warn">size mismatch ${entry.baseline.width}&times;${entry.baseline.height} vs ${entry.candidate.width}&times;${entry.candidate.height}</span>` : ''}
  </p>
  <div class="triptych">
    <figure><figcaption>reference</figcaption><img loading="lazy" src="${rel(entry.baseline.path)}" alt="reference"></figure>
    <figure><figcaption>local</figcaption><img loading="lazy" src="${rel(entry.candidate.path)}" alt="local"></figure>
    <figure><figcaption>diff</figcaption><img loading="lazy" src="${rel(entry.diff.path)}" alt="diff"></figure>
  </div>
  ${bandRows ? `<table class="bands"><thead><tr><th>Region</th><th>Band</th><th>Diff</th><th>Limit</th><th></th></tr></thead><tbody>${bandRows}</tbody></table>` : ''}
</article>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visual diff — ${escapeHtml(report.label)}</title>
<style>
  :root { color-scheme: light dark; --bg:#0f1115; --fg:#e8eaf0; --muted:#9aa3b2;
          --card:#171a21; --line:#262b36; --pass:#2fbf71; --fail:#ff4d6d; --warn:#ffb020; }
  @media (prefers-color-scheme: light) {
    :root { --bg:#f6f7f9; --fg:#14161a; --muted:#5b6472; --card:#ffffff; --line:#e2e5ea; }
  }
  * { box-sizing: border-box; }
  body { margin:0; padding:32px; background:var(--bg); color:var(--fg);
         font:14px/1.55 ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif; }
  h1 { font-size:22px; margin:0 0 4px; }
  .sub { color:var(--muted); margin:0 0 24px; }
  .summary { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:28px; }
  .stat { background:var(--card); border:1px solid var(--line); border-radius:10px;
          padding:12px 16px; min-width:120px; }
  .stat b { display:block; font-size:20px; }
  .stat span { color:var(--muted); font-size:12px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:12px;
          padding:16px; margin-bottom:20px; }
  .card.bad { border-color:color-mix(in srgb, var(--fail) 55%, var(--line)); }
  .card header { display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .card h3 { font-size:14px; margin:0; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; }
  .badge { font-size:11px; letter-spacing:.06em; padding:3px 9px; border-radius:999px; }
  .badge.pass { background:color-mix(in srgb, var(--pass) 22%, transparent); color:var(--pass); }
  .badge.fail { background:color-mix(in srgb, var(--fail) 22%, transparent); color:var(--fail); }
  .badge.miss { background:color-mix(in srgb, var(--warn) 22%, transparent); color:var(--warn); }
  .metrics { color:var(--muted); margin:8px 0 14px; }
  .warn { color:var(--warn); }
  .note { color:var(--muted); }
  .triptych { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; overflow-x:auto; }
  @media (max-width: 900px) { .triptych { grid-template-columns:1fr; } }
  figure { margin:0; }
  figcaption { color:var(--muted); font-size:11px; text-transform:uppercase;
               letter-spacing:.08em; margin-bottom:6px; }
  img { width:100%; height:auto; max-height:70vh; object-fit:contain; object-position:top;
        background:#fff; border:1px solid var(--line); border-radius:8px; }
  table.bands { width:100%; border-collapse:collapse; margin-top:14px; font-size:13px; }
  table.bands th, table.bands td { text-align:left; padding:6px 8px; border-bottom:1px solid var(--line); }
  tr.bad td { color:var(--fail); }
  tr.ok td { color:var(--pass); }
  footer { color:var(--muted); margin-top:28px; font-size:12px; }
</style>
</head>
<body>
<h1>Visual diff — ${escapeHtml(report.label)}</h1>
<p class="sub">${escapeHtml(report.baselineDir)} → ${escapeHtml(report.candidateDir)} &middot; ${escapeHtml(report.generatedAt)} &middot; threshold mode: ${escapeHtml(report.thresholdMode)}</p>

<div class="summary">
  <div class="stat"><b>${s.compared}</b><span>compared</span></div>
  <div class="stat"><b>${s.passed}</b><span>passed</span></div>
  <div class="stat"><b>${s.failed}</b><span>failed</span></div>
  <div class="stat"><b>${s.missing}</b><span>missing</span></div>
  <div class="stat"><b>${s.worstDiffPercent ?? '—'}%</b><span>worst</span></div>
  <div class="stat"><b>${s.averageDiffPercent ?? '—'}%</b><span>average</span></div>
</div>

${cards}

<footer>Magenta marks changed pixels. Screenshots are measurement input only —
reference branding, copy and imagery are not reused in this project.</footer>
</body>
</html>
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    log('Usage: node scripts/visual/visual-report.mjs [--json <file>] [--markdown <file>] [--html <file>]');
    return 0;
  }

  const jsonPath = path.resolve(process.cwd(), args.json);
  if (!existsSync(jsonPath)) {
    warn(`no comparison report at ${path.relative(process.cwd(), jsonPath)}`);
    log('  Run `npm run visual:compare` first.');
    return 2;
  }

  const report = JSON.parse(await readFile(jsonPath, 'utf8'));

  await ensureDir(path.dirname(path.resolve(process.cwd(), args.markdown)));

  const markdown = buildMarkdown(report);
  const html = buildHtml(report, args.html);

  await writeFile(path.resolve(process.cwd(), args.markdown), markdown, 'utf8');
  await writeFile(path.resolve(process.cwd(), args.html), html, 'utf8');

  log('');
  log(`  markdown: ${args.markdown}`);
  log(`  html    : ${args.html}`);
  log(
    `  result  : ${report.summary.passed} passed, ${report.summary.failed} failed, ` +
      `${report.summary.missing} missing`,
  );
  log('');

  return report.summary.failed > 0 ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    process.stderr.write(`visual-report failed: ${error.stack}\n`);
    process.exit(1);
  });
