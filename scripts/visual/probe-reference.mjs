#!/usr/bin/env node
/**
 * Structural probe of the reference site.
 *
 * Reads real geometry out of the rendered page — not the raw HTML, not memory.
 * Produces the measurements that `docs/REFERENCE_SITE_SPEC.md` is written from
 * and that the reconstruction is checked against.
 *
 *   node scripts/visual/probe-reference.mjs
 *   node scripts/visual/probe-reference.mjs --path /guvenlik-sistemleri --name category
 *
 * Output: reference/_probe/<name>__<viewport>.json
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { REFERENCE_BASE_URL } from '../../visual.config.mjs';
import { createContext, launchBrowser, log, stabilizePage, warn } from './capture-core.mjs';

/** The viewports this reconstruction is judged at. */
const PROBE_VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'mobile-390', width: 390, height: 844 },
];

const OUT_DIR = 'reference/_probe';

function parseArgs(argv) {
  const args = { path: '/', name: 'homepage' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--path') args.path = argv[++i];
    else if (argv[i] === '--name') args.name = argv[++i];
  }
  return args;
}

/**
 * Everything below runs inside the page. It is deliberately generic: the
 * reference markup is unknown, so structure is discovered by geometry and
 * repetition rather than by guessing class names.
 */
function probeInPage() {
  const round = (n) => Math.round(n * 10) / 10;

  const box = (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: round(r.x),
      y: round(r.y + window.scrollY),
      w: round(r.width),
      h: round(r.height),
    };
  };

  const describe = (el) => {
    const cls =
      typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 4).join('.') : '';
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls ? `.${cls}` : ''}`;
  };

  const styleOf = (el, props) => {
    const s = getComputedStyle(el);
    const out = {};
    for (const p of props) out[p] = s[p];
    return out;
  };

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
  };

  const all = Array.from(document.body.querySelectorAll('*')).filter(visible);
  const vw = document.documentElement.clientWidth;

  // ---- container width -------------------------------------------------
  // The dominant content width: the most common block width that is narrower
  // than the viewport but still a large fraction of it.
  const widthTally = new Map();
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width < vw * 0.55 || r.width > vw - 2) continue;
    const key = Math.round(r.width);
    widthTally.set(key, (widthTally.get(key) ?? 0) + 1);
  }
  const containerCandidates = [...widthTally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([width, count]) => ({ width, count }));

  // ---- header rows -----------------------------------------------------
  const headerEl = document.querySelector('header') ?? null;
  const headerRows = [];
  if (headerEl) {
    const walk = (el, depth) => {
      for (const child of Array.from(el.children)) {
        if (!visible(child)) continue;
        const r = child.getBoundingClientRect();
        // A "row" spans most of the header width and has real height.
        if (r.width > vw * 0.7 && r.height >= 20) {
          headerRows.push({
            depth,
            selector: describe(child),
            box: box(child),
            style: styleOf(child, ['backgroundColor', 'borderBottom', 'paddingTop', 'paddingBottom']),
          });
          if (depth < 2) walk(child, depth + 1);
        }
      }
    };
    walk(headerEl, 0);
  }

  // ---- repeated blocks (product cards, category tiles, brand logos) ----
  const signature = new Map();
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width < 60 || r.height < 60) continue;
    const cls = typeof el.className === 'string' ? el.className.trim() : '';
    if (!cls) continue;
    const key = `${cls}|${Math.round(r.width / 5) * 5}x${Math.round(r.height / 5) * 5}`;
    if (!signature.has(key)) {
      signature.set(key, { count: 0, selector: describe(el), sample: null, el });
    }
    const entry = signature.get(key);
    entry.count += 1;
    if (!entry.sample) entry.sample = box(el);
  }

  const repeated = [...signature.values()]
    .filter((e) => e.count >= 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, 14)
    .map((e) => {
      const el = e.el;
      const img = el.querySelector('img');
      const texts = Array.from(el.querySelectorAll('*'))
        .filter((n) => n.children.length === 0 && n.textContent.trim())
        .slice(0, 6)
        .map((n) => ({
          text: n.textContent.trim().slice(0, 40),
          ...styleOf(n, ['fontSize', 'fontWeight', 'color', 'lineHeight']),
        }));
      const btn = el.querySelector('button, .btn, [class*="sepet"], [class*="cart"]');
      return {
        selector: e.selector,
        count: e.count,
        box: e.sample,
        style: styleOf(el, [
          'backgroundColor',
          'borderRadius',
          'border',
          'boxShadow',
          'padding',
        ]),
        image: img ? { box: box(img), objectFit: getComputedStyle(img).objectFit } : null,
        texts,
        action: btn
          ? { selector: describe(btn), box: box(btn), ...styleOf(btn, ['backgroundColor', 'borderRadius', 'fontSize']) }
          : null,
      };
    });

  // ---- horizontal bands (the homepage section sequence) ----------------
  // There is no <main> on this site and the whole page sits inside an ASP.NET
  // <form>, so the section stack has to be found by geometry: descend through
  // single-heavy-child wrappers until a node whose children actually stack.
  const findSectionStack = () => {
    let node = document.body;
    for (let depth = 0; depth < 12; depth += 1) {
      const kids = Array.from(node.children).filter((el) => {
        if (!visible(el)) return false;
        const r = el.getBoundingClientRect();
        return r.height > 40 && r.width > vw * 0.5;
      });
      if (kids.length >= 4) return node;
      const heaviest = kids.sort(
        (a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height,
      )[0];
      if (!heaviest) return node;
      node = heaviest;
    }
    return node;
  };

  const root = findSectionStack();
  const bands = Array.from(root.children)
    .filter(visible)
    .map((el) => {
      const b = box(el);
      const img = el.querySelectorAll('img').length;
      return {
        selector: describe(el),
        box: b,
        images: img,
        text: (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 70),
        style: styleOf(el, ['backgroundColor', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom']),
      };
    })
    .filter((b) => b.box.h > 30);

  // ---- section titles ---------------------------------------------------
  // The commercial section headers ("Haftanın Ürünleri", "Çok Satanlar") are
  // not h1-h3 on this site, so they are found by role: short, prominent text
  // sitting on its own row above a block of products.
  const sectionTitles = all
    .filter((el) => {
      if (el.children.length > 1) return false;
      const text = (el.textContent ?? '').trim();
      if (text.length < 3 || text.length > 48) return false;
      const s = getComputedStyle(el);
      const size = parseFloat(s.fontSize);
      if (size < 15) return false;
      const r = el.getBoundingClientRect();
      return r.height >= 18 && r.height < 90 && r.width > 100;
    })
    .map((el) => ({
      selector: describe(el),
      text: el.textContent.trim().replace(/\s+/g, ' '),
      box: box(el),
      ...styleOf(el, ['fontSize', 'fontWeight', 'color', 'textTransform', 'borderBottom']),
    }))
    .sort((a, b) => a.box.y - b.box.y)
    .slice(0, 40);

  // ---- headings (SEO / editorial) ---------------------------------------
  const headings = Array.from(document.querySelectorAll('h1,h2,h3'))
    .filter(visible)
    .slice(0, 25)
    .map((el) => ({
      tag: el.tagName.toLowerCase(),
      text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 60),
      box: box(el),
      ...styleOf(el, ['fontSize', 'fontWeight', 'color', 'textTransform', 'fontFamily']),
    }));

  // ---- search + header actions ----------------------------------------
  const searchEl =
    document.querySelector('input[type="search"]') ??
    document.querySelector('input[name*="search" i]') ??
    document.querySelector('input[placeholder*="ara" i]') ??
    document.querySelector('header input[type="text"]');
  const logoEl =
    document.querySelector('header a[href="/"] img') ??
    document.querySelector('header img');

  // ---- footer ----------------------------------------------------------
  const footerEl = document.querySelector('footer');
  const footerCols = footerEl
    ? Array.from(footerEl.querySelectorAll('ul'))
        .filter(visible)
        .slice(0, 10)
        .map((el) => ({ box: box(el), items: el.children.length }))
    : [];

  return {
    viewportWidth: vw,
    documentHeight: document.documentElement.scrollHeight,
    bodyStyle: styleOf(document.body, ['backgroundColor', 'fontFamily', 'fontSize', 'color']),
    containerCandidates,
    header: headerEl
      ? {
          box: box(headerEl),
          style: styleOf(headerEl, ['position', 'backgroundColor', 'borderBottom']),
          rows: headerRows,
        }
      : null,
    search: searchEl
      ? {
          selector: describe(searchEl),
          box: box(searchEl),
          placeholder: searchEl.getAttribute('placeholder'),
          ...styleOf(searchEl, ['height', 'fontSize', 'borderRadius', 'border', 'backgroundColor']),
        }
      : null,
    logo: logoEl ? { box: box(logoEl), alt: logoEl.getAttribute('alt') } : null,
    bands,
    sectionTitles,
    headings,
    repeated,
    footer: footerEl
      ? {
          box: box(footerEl),
          style: styleOf(footerEl, ['backgroundColor', 'color', 'paddingTop', 'paddingBottom']),
          columns: footerCols,
        }
      : null,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await launchBrowser();
  try {
    for (const viewport of PROBE_VIEWPORTS) {
      const context = await createContext(browser, viewport);
      const page = await context.newPage();
      try {
        const url = new URL(args.path, REFERENCE_BASE_URL).toString();
        log(`probing ${url} @ ${viewport.name}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
        await page.waitForLoadState('load').catch(() => {});
        await stabilizePage(page);

        const data = await page.evaluate(probeInPage);
        data.meta = { url, viewport, probedAt: new Date().toISOString() };

        const file = path.join(OUT_DIR, `${args.name}__${viewport.name}.json`);
        await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
        log(`  → ${file}`);
        log(
          `  container candidates: ${data.containerCandidates
            .slice(0, 3)
            .map((c) => `${c.width}px×${c.count}`)
            .join(', ')}`,
        );
        log(`  header: ${data.header ? `${data.header.box.h}px, ${data.header.rows.length} rows` : 'not found'}`);
        log(`  bands: ${data.bands.length}  repeated blocks: ${data.repeated.length}`);
      } catch (error) {
        warn(`${viewport.name}: ${error.message}`);
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
    process.stderr.write(`probe-reference failed: ${e.stack}\n`);
    process.exit(1);
  });
