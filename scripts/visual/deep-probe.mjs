#!/usr/bin/env node
/**
 * Deep structural probe of the reference site.
 *
 * `probe-reference.mjs` answers "roughly how is this page built?". This answers
 * the questions a reconstruction actually needs: what is the exact section
 * sequence, how many columns does each band use, what is the full anatomy of a
 * product card down to each child box, which elements carry transitions, and where
 * do the header's rows put the logo / search / account / cart.
 *
 *   node scripts/visual/deep-probe.mjs
 *   node scripts/visual/deep-probe.mjs --url http://localhost:3100 --out local
 *
 * Output: reference-analysis/measurements/<out>__<viewport>.json
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { REFERENCE_BASE_URL } from '../../visual.config.mjs';
import { createContext, launchBrowser, log, stabilizePage, warn } from './capture-core.mjs';

const PROBE_VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

const OUT_DIR = 'reference-analysis/measurements';

function parseArgs(argv) {
  const args = { url: REFERENCE_BASE_URL, path: '/', out: 'reference-home', only: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--url') args.url = argv[++i];
    else if (argv[i] === '--path') args.path = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
    else if (argv[i] === '--only') args.only = argv[++i];
  }
  return args;
}

/* ------------------------------------------------------------------ *
 * Everything below this line is serialised into the page.            *
 * ------------------------------------------------------------------ */
function deepProbeInPage() {
  const R = (n) => Math.round(n * 10) / 10;

  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: R(r.x), y: R(r.y + window.scrollY), w: R(r.width), h: R(r.height) };
  };

  const sel = (el) => {
    if (!el || !el.tagName) return '';
    const cls =
      typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls ? `.${cls}` : ''}`;
  };

  const css = (el, props) => {
    const s = getComputedStyle(el);
    const out = {};
    for (const p of props) out[p] = s[p];
    return out;
  };

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
  };

  const text = (el, n = 60) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, n);

  const vw = document.documentElement.clientWidth;
  const all = Array.from(document.body.querySelectorAll('*')).filter(visible);

  /* ---- 1. typography + colour inventory ---------------------------- */
  const tally = (map, key) => map.set(key, (map.get(key) ?? 0) + 1);
  const fontSizes = new Map();
  const fontFamilies = new Map();
  const bgColors = new Map();
  const textColors = new Map();
  const radii = new Map();
  const shadows = new Map();
  const borderColors = new Map();

  for (const el of all) {
    const s = getComputedStyle(el);
    const hasText = el.children.length === 0 && (el.textContent || '').trim().length > 0;
    if (hasText) {
      tally(fontSizes, `${s.fontSize}/${s.fontWeight}`);
      tally(textColors, s.color);
      tally(fontFamilies, s.fontFamily.split(',')[0].replace(/["']/g, ''));
    }
    const r = el.getBoundingClientRect();
    if (r.width >= 24 && r.height >= 16) {
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') tally(bgColors, s.backgroundColor);
      if (s.borderRadius !== '0px') tally(radii, s.borderRadius);
      if (s.boxShadow !== 'none') tally(shadows, s.boxShadow);
      if (s.borderTopWidth !== '0px' || s.borderBottomWidth !== '0px') {
        tally(borderColors, `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`);
      }
    }
  }
  const top = (map, n = 12) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([value, count]) => ({ value, count }));

  /* ---- 3. header anatomy ------------------------------------------- */
  const headerEl =
    document.querySelector('header') ||
    document.querySelector('.header') ||
    document.querySelector('#header');

  const partBox = (root, selectors) => {
    if (!root) return null;
    for (const s of selectors) {
      const el = root.querySelector(s);
      if (el && visible(el)) {
        return { selector: sel(el), box: box(el), text: text(el, 30) };
      }
    }
    return null;
  };

  let header = null;
  if (headerEl) {
    // Rows: direct-ish descendants that span the header and stack vertically.
    const rows = [];
    const walkRows = (node, depth) => {
      for (const child of Array.from(node.children)) {
        if (!visible(child)) continue;
        const r = child.getBoundingClientRect();
        if (r.width > vw * 0.85 && r.height >= 18) {
          const b = box(child);
          const dup = rows.find((x) => Math.abs(x.box.y - b.y) < 2 && Math.abs(x.box.h - b.h) < 2);
          if (!dup) {
            rows.push({
              depth,
              selector: sel(child),
              box: b,
              style: css(child, [
                'backgroundColor',
                'borderBottomWidth',
                'borderBottomColor',
                'position',
                'zIndex',
              ]),
              text: text(child, 90),
            });
          }
          if (depth < 3) walkRows(child, depth + 1);
        }
      }
    };
    walkRows(headerEl, 0);
    rows.sort((a, b) => a.box.y - b.box.y || a.depth - b.depth);

    const logoEl = headerEl.querySelector('a[href="/"] img, .logo img, #logo img, img');
    const searchEl =
      headerEl.querySelector('input[type="search"]') ||
      headerEl.querySelector('input[placeholder*="ara" i]') ||
      headerEl.querySelector('input[name*="ara" i]') ||
      headerEl.querySelector('input[type="text"]');
    const searchBtn = searchEl
      ? searchEl.parentElement?.querySelector('button, .search-button, [type=submit], a.button')
      : null;

    // Nav: the horizontal list with the most direct link children.
    let navList = null;
    let navBest = 0;
    for (const ul of Array.from(headerEl.querySelectorAll('ul'))) {
      if (!visible(ul)) continue;
      const kids = Array.from(ul.children).filter(visible);
      if (kids.length < 3) continue;
      const ys = kids.map((k) => Math.round(k.getBoundingClientRect().top));
      const horizontal = new Set(ys).size <= 2;
      if (horizontal && kids.length > navBest) {
        navBest = kids.length;
        navList = ul;
      }
    }
    const navItems = navList
      ? Array.from(navList.children)
          .filter(visible)
          .map((li) => {
            const a = li.querySelector('a') || li;
            return {
              text: text(li, 40),
              box: box(li),
              href: a.getAttribute && a.getAttribute('href'),
              style: css(a, ['fontSize', 'fontWeight', 'color', 'textTransform', 'padding']),
              hasSubmenu: !!li.querySelector('ul, .sub-menu, .dropdown, .mega-menu'),
            };
          })
      : [];

    header = {
      box: box(headerEl),
      style: css(headerEl, ['position', 'backgroundColor', 'zIndex']),
      rows,
      logo: logoEl
        ? { box: box(logoEl), src: logoEl.getAttribute('src'), alt: logoEl.getAttribute('alt') }
        : null,
      search: searchEl
        ? {
            selector: sel(searchEl),
            box: box(searchEl),
            placeholder: searchEl.getAttribute('placeholder'),
            style: css(searchEl, [
              'height',
              'fontSize',
              'borderRadius',
              'borderWidth',
              'borderColor',
              'backgroundColor',
              'paddingLeft',
              'color',
            ]),
            button: searchBtn ? { selector: sel(searchBtn), box: box(searchBtn) } : null,
          }
        : null,
      account: partBox(headerEl, [
        '[href*="uye"]',
        '[href*="giris"]',
        '[href*="hesab"]',
        '[href*="account"]',
        '[class*="account"]',
        '[class*="uye"]',
      ]),
      cart: partBox(headerEl, [
        '[href*="sepet"]',
        '[class*="sepet"]',
        '[href*="cart"]',
        '[class*="cart"]',
      ]),
      nav: navList
        ? {
            selector: sel(navList),
            box: box(navList),
            itemCount: navItems.length,
            items: navItems,
          }
        : null,
    };
  }

  /* ---- 4. the section stack, in DOM order --------------------------- */
  // Descend past single-heavy-child wrappers until children genuinely stack.
  const findStack = () => {
    let node = document.body;
    for (let d = 0; d < 14; d += 1) {
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

  /** How many equal-top boxes sit in the widest row of this subtree? */
  const columnCount = (root) => {
    const rows = new Map();
    for (const el of Array.from(root.querySelectorAll('*'))) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 80 || r.height < 60) continue;
      if (r.width > root.getBoundingClientRect().width * 0.9) continue;
      const key = `${Math.round(r.top / 8)}|${Math.round(r.width / 8)}`;
      if (!rows.has(key)) rows.set(key, []);
      rows.get(key).push(R(r.width));
    }
    let best = 0;
    let bestWidth = 0;
    for (const [, arr] of rows) {
      if (arr.length > best) {
        best = arr.length;
        bestWidth = arr[0];
      }
    }
    return { columns: best, itemWidth: bestWidth };
  };

  const stackRoot = findStack();
  const sections = Array.from(stackRoot.children)
    .filter(visible)
    .map((el, i) => {
      const b = box(el);
      if (b.h < 24) return null;
      const s = getComputedStyle(el);
      // The widest inner block that is narrower than the section = its container.
      let container = null;
      for (const inner of Array.from(el.querySelectorAll('*')).slice(0, 400)) {
        if (!visible(inner)) continue;
        const r = inner.getBoundingClientRect();
        if (r.width > b.w * 0.5 && r.width < b.w - 8) {
          if (!container || r.width > container.w) container = { w: R(r.width), x: R(r.x) };
        }
      }
      const heading = Array.from(el.querySelectorAll('h1,h2,h3,h4,.title,[class*="baslik"]')).find(
        (h) => visible(h) && text(h, 10),
      );
      const cols = columnCount(el);
      return {
        index: i,
        selector: sel(el),
        box: b,
        style: {
          backgroundColor: s.backgroundColor,
          backgroundImage: s.backgroundImage === 'none' ? 'none' : 'image',
          marginTop: s.marginTop,
          marginBottom: s.marginBottom,
          paddingTop: s.paddingTop,
          paddingBottom: s.paddingBottom,
        },
        container,
        heading: heading ? { tag: heading.tagName.toLowerCase(), text: text(heading, 50) } : null,
        images: el.querySelectorAll('img').length,
        links: el.querySelectorAll('a').length,
        columns: cols.columns,
        itemWidth: cols.itemWidth,
        text: text(el, 110),
      };
    })
    .filter(Boolean);

  /* ---- 5. product-card anatomy -------------------------------------- */
  // Find the most-repeated box that contains an image AND a price-looking string.
  const priceRe = /(₺|TL|\bTRY\b)\s?[\d.,]{2,}|[\d.,]{2,}\s?(₺|TL)/i;
  const cardGroups = new Map();
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width < 120 || r.width > 480 || r.height < 180 || r.height > 720) continue;
    if (!el.querySelector('img')) continue;
    const t = el.textContent || '';
    if (!priceRe.test(t)) continue;
    // Skip wrappers whose only child is the real card.
    const cls = typeof el.className === 'string' ? el.className.trim() : '';
    const key = `${cls}|${Math.round(r.width / 4) * 4}`;
    if (!cardGroups.has(key)) cardGroups.set(key, []);
    cardGroups.get(key).push(el);
  }
  let cardEls = [];
  for (const [, arr] of cardGroups) if (arr.length > cardEls.length) cardEls = arr;

  const anatomy = (card) => {
    const cb = card.getBoundingClientRect();
    const parts = [];
    const walk = (node, depth) => {
      for (const ch of Array.from(node.children)) {
        if (!visible(ch)) continue;
        const r = ch.getBoundingClientRect();
        const s = getComputedStyle(ch);
        const own = Array.from(ch.childNodes)
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent.trim())
          .join(' ')
          .trim();
        parts.push({
          depth,
          selector: sel(ch),
          tag: ch.tagName.toLowerCase(),
          rel: { x: R(r.x - cb.x), y: R(r.y - cb.y), w: R(r.width), h: R(r.height) },
          text: own.slice(0, 46),
          style: {
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            color: s.color,
            lineHeight: s.lineHeight,
            backgroundColor: s.backgroundColor === 'rgba(0, 0, 0, 0)' ? null : s.backgroundColor,
            borderRadius: s.borderRadius === '0px' ? null : s.borderRadius,
            textDecoration: s.textDecorationLine === 'none' ? null : s.textDecorationLine,
            objectFit: ch.tagName === 'IMG' ? s.objectFit : undefined,
            display: s.display,
            padding: s.padding,
          },
        });
        if (depth < 5) walk(ch, depth + 1);
      }
    };
    walk(card, 0);
    return {
      selector: sel(card),
      box: box(card),
      style: css(card, [
        'backgroundColor',
        'border',
        'borderRadius',
        'boxShadow',
        'padding',
        'margin',
        'transition',
      ]),
      image: (() => {
        const img = card.querySelector('img');
        if (!img) return null;
        const r = img.getBoundingClientRect();
        return {
          rel: { x: R(r.x - cb.x), y: R(r.y - cb.y), w: R(r.width), h: R(r.height) },
          objectFit: getComputedStyle(img).objectFit,
          src: (img.getAttribute('src') || '').slice(0, 80),
        };
      })(),
      parts: parts.slice(0, 60),
    };
  };

  const productCard = cardEls.length ? anatomy(cardEls[0]) : null;
  const productCardCount = cardEls.length;
  const productCardSizes = cardEls.slice(0, 12).map((el) => {
    const r = el.getBoundingClientRect();
    return { w: R(r.width), h: R(r.height), x: R(r.x), y: R(r.y + window.scrollY) };
  });

  /* ---- 6. sliders, tabs, carousels ---------------------------------- */
  const sliderSelectors = [
    '.owl-carousel',
    '.swiper',
    '.swiper-container',
    '.slick-slider',
    '.flickity-enabled',
    '[class*="slider"]',
    '[class*="carousel"]',
  ];
  const sliders = [];
  const seenSlider = new Set();
  for (const s of sliderSelectors) {
    for (const el of Array.from(document.querySelectorAll(s))) {
      if (!visible(el) || seenSlider.has(el)) continue;
      seenSlider.add(el);
      const r = el.getBoundingClientRect();
      if (r.width < 200 || r.height < 80) continue;
      sliders.push({
        selector: sel(el),
        box: box(el),
        slides: el.querySelectorAll(
          '.owl-item, .swiper-slide, .slick-slide, [class*="slide"]',
        ).length,
        dots: el.querySelectorAll('.owl-dot, .swiper-pagination-bullet, .slick-dots li').length,
        arrows: el.querySelectorAll(
          '.owl-prev, .owl-next, .swiper-button-next, .swiper-button-prev, .slick-arrow, [class*="arrow"]',
        ).length,
      });
    }
  }

  // Tab strips: a row of 2-6 sibling controls above a content block.
  const tabStrips = [];
  for (const el of all) {
    const kids = Array.from(el.children).filter(visible);
    if (kids.length < 2 || kids.length > 6) continue;
    const r = el.getBoundingClientRect();
    if (r.width < vw * 0.45 || r.height > 120 || r.height < 22) continue;
    const tops = kids.map((k) => Math.round(k.getBoundingClientRect().top));
    if (new Set(tops).size > 1) continue;
    const labels = kids.map((k) => text(k, 28)).filter(Boolean);
    if (labels.length !== kids.length) continue;
    if (labels.some((l) => l.length > 28 || /₺|TL/.test(l))) continue;
    tabStrips.push({
      selector: sel(el),
      box: box(el),
      labels,
      items: kids.map((k) => ({
        text: text(k, 28),
        box: box(k),
        style: css(k, [
          'backgroundColor',
          'color',
          'fontSize',
          'fontWeight',
          'borderBottom',
          'borderRadius',
        ]),
      })),
    });
  }

  /* ---- 7. footer ----------------------------------------------------- */
  const footerEl = document.querySelector('footer') || document.querySelector('[class*="footer"]');
  const footer = footerEl
    ? {
        box: box(footerEl),
        style: css(footerEl, ['backgroundColor', 'color', 'paddingTop', 'paddingBottom']),
        columns: Array.from(footerEl.querySelectorAll('ul'))
          .filter(visible)
          .slice(0, 14)
          .map((ul) => ({
            box: box(ul),
            items: Array.from(ul.children).filter(visible).length,
            heading: (() => {
              let p = ul.previousElementSibling;
              while (p && !text(p, 5)) p = p.previousElementSibling;
              return p ? text(p, 40) : null;
            })(),
            sample: Array.from(ul.children).slice(0, 3).map((li) => text(li, 26)),
          })),
      }
    : null;

  return {
    viewportWidth: vw,
    documentHeight: document.documentElement.scrollHeight,
    title: document.title.trim(),
    bodyStyle: css(document.body, ['backgroundColor', 'fontFamily', 'fontSize', 'color']),
    // `transitions` is filled in by a separate pass that runs *before*
    // stabilisation — see probeTransitions() and the note in main().
    inventory: {
      fontFamilies: top(fontFamilies, 6),
      fontSizes: top(fontSizes, 16),
      textColors: top(textColors, 10),
      backgroundColors: top(bgColors, 14),
      borderRadii: top(radii, 10),
      boxShadows: top(shadows, 8),
      borders: top(borderColors, 10),
    },
    transitions: transitionInventory,
    header,
    sections,
    productCard,
    productCardCount,
    productCardSizes,
    sliders,
    tabStrips,
    footer,
  };
}

/**
 * Transition inventory.
 *
 * MUST run before `stabilizePage`, which injects `transition-duration: 0s` to
 * make screenshots deterministic. Reading transitions after that returns an
 * empty set for every element — the freeze erases exactly what we are trying to
 * measure.
 */
function probeTransitions() {
  const sel = (el) => {
    const cls =
      typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls ? `.${cls}` : ''}`;
  };
  const map = new Map();
  for (const el of document.body.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    if (s.transitionDuration === '0s' || s.transitionProperty === 'none') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const key = `${s.transitionProperty} | ${s.transitionDuration} | ${s.transitionTimingFunction} | ${s.transitionDelay}`;
    if (!map.has(key)) map.set(key, { count: 0, samples: [] });
    const e = map.get(key);
    e.count += 1;
    if (e.samples.length < 3) e.samples.push(sel(el));
  }

  const anims = new Map();
  for (const el of document.body.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    if (s.animationName === 'none') continue;
    const key = `${s.animationName} | ${s.animationDuration} | ${s.animationTimingFunction} | ${s.animationIterationCount}`;
    if (!anims.has(key)) anims.set(key, { count: 0, samples: [] });
    const e = anims.get(key);
    e.count += 1;
    if (e.samples.length < 2) e.samples.push(sel(el));
  }

  const rank = (m, n) =>
    [...m.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, n)
      .map(([spec, v]) => ({ spec, count: v.count, samples: v.samples }));

  return { transitions: rank(map, 24), animations: rank(anims, 10) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await mkdir(OUT_DIR, { recursive: true });

  const viewports = args.only
    ? PROBE_VIEWPORTS.filter((v) => v.name === args.only)
    : PROBE_VIEWPORTS;

  const browser = await launchBrowser();
  try {
    for (const viewport of viewports) {
      const context = await createContext(browser, viewport);
      const page = await context.newPage();
      try {
        const url = new URL(args.path, args.url).toString();
        log(`deep-probing ${url} @ ${viewport.name}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await page.waitForLoadState('load').catch(() => {});

        // Read motion first: stabilizePage() zeroes every transition duration.
        await page.waitForTimeout(2000);
        const motion = await page.evaluate(probeTransitions);

        await stabilizePage(page);

        const data = await page.evaluate(deepProbeInPage);
        data.transitions = motion.transitions;
        data.animations = motion.animations;
        data.meta = { url, viewport, probedAt: new Date().toISOString() };

        const file = path.join(OUT_DIR, `${args.out}__${viewport.name}.json`);
        await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
        log(`  → ${file}`);
        log(`  title: ${data.title}`);
        log(`  docHeight: ${data.documentHeight}  sections: ${data.sections.length}`);
        log(
          `  header: ${data.header ? `${data.header.box.h}px / ${data.header.rows.length} rows / nav ${data.header.nav?.itemCount ?? 0} items` : 'none'}`,
        );
        log(
          `  card: ${data.productCard ? `${data.productCard.box.w}x${data.productCard.box.h} (${data.productCardCount} found)` : 'none'}`,
        );
        log(`  sliders: ${data.sliders.length}  tabStrips: ${data.tabStrips.length}`);
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
    process.stderr.write(`deep-probe failed: ${e.stack}\n`);
    process.exit(1);
  });
