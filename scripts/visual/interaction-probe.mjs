#!/usr/bin/env node
/**
 * Interaction / animation reverse engineering.
 *
 * Every other script in this folder deliberately *freezes* animation so that
 * two screenshots are comparable. This one does the opposite: it lets the page
 * move and measures what it does — because an animation cannot be inferred from
 * a still frame, and guessing it is exactly the failure this workflow exists to
 * prevent.
 *
 * What it measures, all from the live DOM:
 *   - header behaviour on scroll (sticky? changed height? changed background?)
 *   - navigation hover: does a panel appear, how big, with what transition
 *   - search focus / typing: suggestion panel, clear affordance
 *   - hero slider: autoplay interval and transition duration, sampled over time
 *   - product tabs: switch behaviour and transition
 *   - product card hover: which computed properties actually change
 *   - mobile: hamburger drawer geometry and animation
 *
 *   node scripts/visual/interaction-probe.mjs
 *   node scripts/visual/interaction-probe.mjs --url http://localhost:3100 --out local
 *
 * Output: reference-analysis/measurements/<out>-interactions__<viewport>.json
 *         reference-analysis/interactions/*.png   (before / after evidence)
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { REFERENCE_BASE_URL } from '../../visual.config.mjs';
import { createContext, launchBrowser, log, warn } from './capture-core.mjs';

const OUT_DIR = 'reference-analysis/measurements';
const SHOT_DIR = 'reference-analysis/interactions';

const DESKTOP = { name: 'desktop-1440', width: 1440, height: 900 };
const MOBILE = { name: 'mobile-390', width: 390, height: 844 };

function parseArgs(argv) {
  const a = { url: REFERENCE_BASE_URL, path: '/', out: 'reference', prefix: 'ref' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--url') a.url = argv[++i];
    else if (argv[i] === '--path') a.path = argv[++i];
    else if (argv[i] === '--out') a.out = argv[++i];
    else if (argv[i] === '--prefix') a.prefix = argv[++i];
  }
  return a;
}

/** Light settling only — animation stays alive on purpose. */
async function settle(page) {
  await page.waitForLoadState('load').catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(2500);
  // Dismiss overlays that would sit on top of what we want to interact with.
  const killers = [
    '#onetrust-accept-btn-handler',
    '.cookie-accept',
    '[id*="cookie"] button',
    'button:has-text("Kabul Et")',
    'button:has-text("Tamam")',
    '[class*="popup"] [class*="close"]',
    '[class*="modal"] [class*="close"]',
    '[id*="popup"] .close',
    '.fancybox-close-small',
    '[aria-label="Close"]',
  ];
  for (const k of killers) {
    try {
      const el = page.locator(k).first();
      if (await el.isVisible({ timeout: 400 })) {
        await el.click({ timeout: 1200, noWaitAfter: true, force: true });
        await page.waitForTimeout(200);
      }
    } catch {
      /* not present — normal */
    }
  }
  // Newsletter / push-notification iframes overlay the campaign band.
  await page
    .evaluate(() => {
      for (const f of Array.from(document.querySelectorAll('iframe'))) {
        const r = f.getBoundingClientRect();
        const src = f.getAttribute('src') || '';
        if (/pushhouse|push|subscribe|bulten/i.test(src) || (r.width > 200 && r.height > 150)) {
          f.setAttribute('data-probe-hidden', '1');
          f.style.display = 'none';
        }
      }
      for (const el of Array.from(document.querySelectorAll('body > div, body > section'))) {
        const s = getComputedStyle(el);
        if (s.position !== 'fixed') continue;
        const r = el.getBoundingClientRect();
        if (r.width > 250 && r.height > 200) el.style.display = 'none';
      }
    })
    .catch(() => {});
  await page.waitForTimeout(300);
}

const shot = async (page, file, clip) => {
  try {
    await page.screenshot({ path: path.join(SHOT_DIR, file), clip, timeout: 20_000 });
    return file;
  } catch (e) {
    warn(`screenshot ${file}: ${e.message}`);
    return null;
  }
};

/* ---------------------------- header on scroll ---------------------------- */
async function probeHeaderScroll(page, prefix) {
  const read = () =>
    page.evaluate(() => {
      const h =
        document.querySelector('header') ||
        document.querySelector('.header') ||
        document.querySelector('#header');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      const s = getComputedStyle(h);
      // Any descendant that became fixed/sticky counts as "the sticky part".
      let stickyPart = null;
      for (const el of Array.from(h.querySelectorAll('*')).slice(0, 300)) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.position === 'sticky') {
          const er = el.getBoundingClientRect();
          if (er.height > 20 && er.width > window.innerWidth * 0.6) {
            stickyPart = {
              selector: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}`,
              position: cs.position,
              top: Math.round(er.top),
              height: Math.round(er.height),
              backgroundColor: cs.backgroundColor,
              transform: cs.transform,
              transition: cs.transition,
            };
            break;
          }
        }
      }
      return {
        top: Math.round(r.top),
        height: Math.round(r.height),
        position: s.position,
        backgroundColor: s.backgroundColor,
        boxShadow: s.boxShadow,
        transform: s.transform,
        transition: s.transition,
        stickyPart,
      };
    });

  const atTop = await read();
  await shot(page, `${prefix}-header-top.png`, { x: 0, y: 0, width: 1440, height: 200 });

  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
  await page.waitForTimeout(900);
  const scrolledDown = await read();
  await shot(page, `${prefix}-header-scrolled.png`, { x: 0, y: 0, width: 1440, height: 200 });

  // Scroll back up a little: many sites reveal a condensed bar only on up-scroll.
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
  await page.waitForTimeout(900);
  const scrolledUp = await read();
  await shot(page, `${prefix}-header-scrollup.png`, { x: 0, y: 0, width: 1440, height: 200 });

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(600);

  return {
    atTop,
    scrolledDown,
    scrolledUp,
    isSticky:
      scrolledDown?.stickyPart != null ||
      ['fixed', 'sticky'].includes(scrolledDown?.position ?? ''),
    heightChanged: atTop && scrolledDown ? atTop.height !== scrolledDown.height : null,
  };
}

/* ------------------------------- nav hover -------------------------------- */
async function probeNavHover(page, prefix) {
  const items = await page.evaluate(() => {
    const header = document.querySelector('header') || document.body;
    let best = null;
    let bestCount = 0;
    for (const ul of Array.from(header.querySelectorAll('ul'))) {
      const kids = Array.from(ul.children).filter((k) => k.getBoundingClientRect().height > 10);
      if (kids.length < 3) continue;
      const tops = kids.map((k) => Math.round(k.getBoundingClientRect().top));
      if (new Set(tops).size > 2) continue;
      if (kids.length > bestCount) {
        bestCount = kids.length;
        best = ul;
      }
    }
    if (!best) return [];
    best.setAttribute('data-probe-nav', '1');
    return Array.from(best.children).map((li, i) => {
      const r = li.getBoundingClientRect();
      li.setAttribute('data-probe-nav-item', String(i));
      return {
        index: i,
        text: (li.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30),
        x: Math.round(r.x + r.width / 2),
        y: Math.round(r.y + r.height / 2),
      };
    });
  });

  const results = [];
  for (const item of items.slice(0, 4)) {
    await page.mouse.move(item.x, item.y);
    await page.waitForTimeout(650);
    const panel = await page.evaluate((idx) => {
      const li = document.querySelector(`[data-probe-nav-item="${idx}"]`);
      if (!li) return null;
      // The largest visible descendant that is not the trigger row itself.
      let best = null;
      for (const el of Array.from(li.querySelectorAll('*'))) {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') continue;
        if (r.height < 60 || r.width < 120) continue;
        if (!best || r.width * r.height > best.area) {
          best = {
            area: r.width * r.height,
            selector: `${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').split(/\s+/).slice(0, 2).join('.')}`,
            box: {
              x: Math.round(r.x),
              y: Math.round(r.y),
              w: Math.round(r.width),
              h: Math.round(r.height),
            },
            columns: (() => {
              const kids = Array.from(el.children).filter(
                (k) => k.getBoundingClientRect().height > 20,
              );
              const tops = kids.map((k) => Math.round(k.getBoundingClientRect().top));
              return new Set(tops).size <= 1 ? kids.length : 1;
            })(),
            linkCount: el.querySelectorAll('a').length,
            style: {
              position: s.position,
              backgroundColor: s.backgroundColor,
              boxShadow: s.boxShadow,
              borderRadius: s.borderRadius,
              transition: s.transition,
              transform: s.transform,
              opacity: s.opacity,
              padding: s.padding,
              zIndex: s.zIndex,
            },
          };
        }
      }
      const trigger = li.querySelector('a') || li;
      const ts = getComputedStyle(trigger);
      return {
        panel: best,
        triggerHoverStyle: {
          backgroundColor: ts.backgroundColor,
          color: ts.color,
          transition: ts.transition,
        },
      };
    }, item.index);

    if (panel?.panel) {
      await shot(page, `${prefix}-nav-${item.index}-open.png`, {
        x: 0,
        y: 0,
        width: 1440,
        height: Math.min(900, panel.panel.box.y + panel.panel.box.h + 20),
      });
    }
    results.push({ item: item.text, ...panel });
    await page.mouse.move(5, 700);
    await page.waitForTimeout(350);
  }

  return results;
}

/* --------------------------- hero slider timing --------------------------- */
async function probeSlider(page, prefix) {
  // Identify the hero slider and sample which slide is active over time.
  const found = await page.evaluate(() => {
    const cands = Array.from(
      document.querySelectorAll('.owl-carousel, .swiper, .slick-slider, [class*="carousel"]'),
    ).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 600 && r.height > 200 && r.top + window.scrollY < 900;
    });
    if (!cands.length) return null;
    const el = cands[0];
    el.setAttribute('data-probe-slider', '1');
    const dots = el.querySelectorAll(
      '.owl-dot, .swiper-pagination-bullet, .slick-dots li, [class*="dot"]',
    );
    const r = el.getBoundingClientRect();
    return {
      selector: `${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').split(/\s+/).slice(0, 2).join('.')}`,
      box: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
      dotCount: dots.length,
      arrows: el.querySelectorAll('[class*="prev"], [class*="next"], [class*="arrow"]').length,
      stageTransition: (() => {
        const stage = el.querySelector('.owl-stage, .swiper-wrapper, .slick-track');
        if (!stage) return null;
        const s = getComputedStyle(stage);
        return {
          transitionDuration: s.transitionDuration,
          transitionTimingFunction: s.transitionTimingFunction,
          transform: s.transform,
        };
      })(),
    };
  });

  if (!found) return { found: false };

  // Sample the active dot / transform every 200ms for 16s.
  const samples = await page.evaluate(
    async () =>
      new Promise((resolve) => {
        const el = document.querySelector('[data-probe-slider]');
        const out = [];
        const t0 = performance.now();
        const read = () => {
          const dots = Array.from(
            el.querySelectorAll('.owl-dot, .swiper-pagination-bullet, .slick-dots li'),
          );
          const active = dots.findIndex((d) => /active|current|selected/i.test(d.className));
          const stage = el.querySelector('.owl-stage, .swiper-wrapper, .slick-track');
          const tf = stage ? getComputedStyle(stage).transform : 'none';
          out.push({ t: Math.round(performance.now() - t0), active, transform: tf });
        };
        const id = setInterval(read, 200);
        setTimeout(() => {
          clearInterval(id);
          resolve(out);
        }, 16000);
      }),
  );

  // Derive autoplay interval from active-index change times.
  const changes = [];
  for (let i = 1; i < samples.length; i += 1) {
    if (samples[i].active !== samples[i - 1].active && samples[i].active >= 0) {
      changes.push(samples[i].t);
    }
  }
  const gaps = [];
  for (let i = 1; i < changes.length; i += 1) gaps.push(changes[i] - changes[i - 1]);
  const avgGap = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : null;

  // Transform settle time ≈ transition duration.
  let moveStart = null;
  let moveEnd = null;
  for (let i = 1; i < samples.length; i += 1) {
    if (samples[i].transform !== samples[i - 1].transform) {
      if (moveStart === null) moveStart = samples[i - 1].t;
      moveEnd = samples[i].t;
    } else if (moveStart !== null && moveEnd !== null && samples[i].t - moveEnd > 600) {
      break;
    }
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await shot(page, `${prefix}-hero-slide-a.png`, {
    x: 0,
    y: Math.max(0, found.box.y - 10),
    width: 1440,
    height: Math.min(500, found.box.h + 20),
  });
  await page.waitForTimeout((avgGap ?? 5000) + 800);
  await shot(page, `${prefix}-hero-slide-b.png`, {
    x: 0,
    y: Math.max(0, found.box.y - 10),
    width: 1440,
    height: Math.min(500, found.box.h + 20),
  });

  return {
    found: true,
    ...found,
    autoplayIntervalMs: avgGap,
    changeTimestamps: changes,
    declaredTransitionDuration: found.stageTransition?.transitionDuration ?? null,
    sampleCount: samples.length,
  };
}

/* ------------------------------ product tabs ------------------------------ */
async function probeTabs(page, prefix) {
  const strip = await page.evaluate(() => {
    const wanted = /haftanın|yeni ürün|çok satan/i;
    for (const el of Array.from(document.querySelectorAll('*'))) {
      const kids = Array.from(el.children).filter((k) => k.getBoundingClientRect().height > 15);
      if (kids.length < 2 || kids.length > 6) continue;
      const labels = kids.map((k) => (k.textContent || '').trim());
      if (!labels.some((l) => wanted.test(l))) continue;
      if (labels.some((l) => l.length > 40)) continue;
      el.setAttribute('data-probe-tabs', '1');
      kids.forEach((k, i) => k.setAttribute('data-probe-tab', String(i)));
      const r = el.getBoundingClientRect();
      return {
        box: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        labels,
        itemStyles: kids.map((k) => {
          const s = getComputedStyle(k.querySelector('a, button') || k);
          return {
            text: (k.textContent || '').trim().slice(0, 26),
            backgroundColor: s.backgroundColor,
            color: s.color,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            borderRadius: s.borderRadius,
            transition: s.transition,
            width: Math.round(k.getBoundingClientRect().width),
          };
        }),
      };
    }
    return null;
  });

  if (!strip) return { found: false };

  await page.evaluate(() => {
    const el = document.querySelector('[data-probe-tabs]');
    el?.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await page.waitForTimeout(700);

  const stripBox = await page.evaluate(() => {
    const r = document.querySelector('[data-probe-tabs]').getBoundingClientRect();
    return { x: 0, y: Math.max(0, r.top - 10), width: 1440, height: 520 };
  });
  await shot(page, `${prefix}-tab-before.png`, stripBox);

  // Click the second tab and watch what changes.
  const switchInfo = await page.evaluate(
    async () =>
      new Promise((resolve) => {
        const tab = document.querySelector('[data-probe-tab="1"]');
        const clickable = tab.querySelector('a, button') || tab;
        const panelOf = () => {
          const strip = document.querySelector('[data-probe-tabs]');
          let n = strip.nextElementSibling;
          while (n && n.getBoundingClientRect().height < 100) n = n.nextElementSibling;
          return n;
        };
        const panel = panelOf();
        const before = panel
          ? {
              firstText: (panel.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70),
              height: Math.round(panel.getBoundingClientRect().height),
              opacity: getComputedStyle(panel).opacity,
              transition: getComputedStyle(panel).transition,
            }
          : null;

        const frames = [];
        const t0 = performance.now();
        const id = setInterval(() => {
          const p = panelOf();
          if (!p) return;
          frames.push({
            t: Math.round(performance.now() - t0),
            opacity: getComputedStyle(p).opacity,
            transform: getComputedStyle(p).transform,
            h: Math.round(p.getBoundingClientRect().height),
          });
        }, 60);

        clickable.click();

        setTimeout(() => {
          clearInterval(id);
          const p = panelOf();
          resolve({
            before,
            after: p
              ? {
                  firstText: (p.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70),
                  height: Math.round(p.getBoundingClientRect().height),
                  opacity: getComputedStyle(p).opacity,
                }
              : null,
            frames,
            activeTabClass: document.querySelector('[data-probe-tab="1"]')?.className ?? '',
            activeTabStyle: (() => {
              const t = document.querySelector('[data-probe-tab="1"]');
              const s = getComputedStyle(t.querySelector('a, button') || t);
              return { backgroundColor: s.backgroundColor, color: s.color };
            })(),
          });
        }, 1800);
      }),
  );

  await page.waitForTimeout(400);
  await shot(page, `${prefix}-tab-after.png`, stripBox);

  return { found: true, ...strip, switch: switchInfo };
}

/* --------------------------- product card hover --------------------------- */
async function probeCardHover(page, prefix) {
  const target = await page.evaluate(() => {
    const priceRe = /₺\s?[\d.,]{2,}/;
    const cards = Array.from(document.querySelectorAll('*')).filter((el) => {
      const r = el.getBoundingClientRect();
      return (
        r.width > 150 &&
        r.width < 400 &&
        r.height > 200 &&
        r.height < 600 &&
        el.querySelector('img') &&
        priceRe.test(el.textContent || '')
      );
    });
    if (!cards.length) return null;
    // Prefer the innermost such card.
    const card = cards.find((c) => !cards.some((o) => o !== c && c.contains(o))) ?? cards[0];
    card.setAttribute('data-probe-card', '1');
    card.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = card.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });

  if (!target) return { found: false };
  await page.waitForTimeout(500);

  const snapshot = () =>
    page.evaluate(() => {
      const card = document.querySelector('[data-probe-card]');
      const s = getComputedStyle(card);
      const r = card.getBoundingClientRect();
      const img = card.querySelector('img');
      const is = img ? getComputedStyle(img) : null;
      // Anything inside that is currently hidden/shown matters most.
      const hidden = Array.from(card.querySelectorAll('*'))
        .filter((el) => {
          const cs = getComputedStyle(el);
          return cs.opacity !== '1' || cs.visibility === 'hidden' || cs.display === 'none';
        })
        .slice(0, 8)
        .map((el) => ({
          selector: `${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').split(/\s+/).slice(0, 2).join('.')}`,
          opacity: getComputedStyle(el).opacity,
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
        }));
      const visibleButtons = Array.from(card.querySelectorAll('button, a[class*="sepet"], [class*="cart"], [class*="quantity"], [class*="adet"]'))
        .filter((el) => el.getBoundingClientRect().height > 8)
        .slice(0, 8)
        .map((el) => ({
          selector: `${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').split(/\s+/).slice(0, 2).join('.')}`,
          text: (el.textContent || '').trim().slice(0, 24),
          box: (() => {
            const b = el.getBoundingClientRect();
            return { w: Math.round(b.width), h: Math.round(b.height) };
          })(),
        }));
      return {
        box: { w: Math.round(r.width), h: Math.round(r.height) },
        boxShadow: s.boxShadow,
        transform: s.transform,
        borderColor: s.borderColor,
        borderWidth: s.borderWidth,
        backgroundColor: s.backgroundColor,
        transition: s.transition,
        zIndex: s.zIndex,
        imageTransform: is?.transform ?? null,
        imageTransition: is?.transition ?? null,
        imageSrc: (img?.getAttribute('src') || '').slice(-40),
        hiddenChildren: hidden,
        buttons: visibleButtons,
      };
    });

  await page.mouse.move(5, 400);
  await page.waitForTimeout(400);
  const before = await snapshot();
  const clip = await page.evaluate(() => {
    const r = document.querySelector('[data-probe-card]').getBoundingClientRect();
    return {
      x: Math.max(0, Math.round(r.x - 12)),
      y: Math.max(0, Math.round(r.y - 12)),
      width: Math.round(r.width + 24),
      height: Math.round(r.height + 24),
    };
  });
  await shot(page, `${prefix}-card-default.png`, clip);

  await page.mouse.move(target.x, target.y);
  await page.waitForTimeout(900);
  const after = await snapshot();
  await shot(page, `${prefix}-card-hover.png`, clip);
  await page.mouse.move(5, 400);

  const changed = {};
  for (const k of Object.keys(before)) {
    if (k === 'hiddenChildren' || k === 'buttons') continue;
    if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) {
      changed[k] = { before: before[k], after: after[k] };
    }
  }
  return {
    found: true,
    before,
    after,
    changed,
    buttonsAppearedOnHover: after.buttons.length - before.buttons.length,
  };
}

/* -------------------------------- search --------------------------------- */
async function probeSearch(page, prefix) {
  const info = await page.evaluate(() => {
    const el =
      document.querySelector('header input[type="search"]') ||
      document.querySelector('input[placeholder*="ara" i]') ||
      document.querySelector('header input[type="text"]');
    if (!el) return null;
    el.setAttribute('data-probe-search', '1');
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      placeholder: el.getAttribute('placeholder'),
      style: {
        borderRadius: s.borderRadius,
        border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
        backgroundColor: s.backgroundColor,
        fontSize: s.fontSize,
        transition: s.transition,
      },
    };
  });
  if (!info) return { found: false };

  await page.click('[data-probe-search]').catch(() => {});
  await page.waitForTimeout(400);
  const focused = await page.evaluate(() => {
    const el = document.querySelector('[data-probe-search]');
    const s = getComputedStyle(el);
    return { borderColor: s.borderColor, boxShadow: s.boxShadow, outline: s.outline };
  });

  await page.type('[data-probe-search]', 'kamera', { delay: 110 }).catch(() => {});
  await page.waitForTimeout(1600);

  const suggestions = await page.evaluate(() => {
    // A panel that appeared under the field.
    const el = document.querySelector('[data-probe-search]');
    const r = el.getBoundingClientRect();
    let best = null;
    for (const n of Array.from(document.querySelectorAll('div, ul'))) {
      const nr = n.getBoundingClientRect();
      const s = getComputedStyle(n);
      if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') continue;
      if (nr.height < 40 || nr.width < 150) continue;
      if (nr.top < r.bottom - 4 || nr.top > r.bottom + 60) continue;
      if (!best || nr.height > best.box.h) {
        best = {
          selector: `${n.tagName.toLowerCase()}.${(typeof n.className === 'string' ? n.className : '').split(/\s+/).slice(0, 2).join('.')}`,
          box: { x: Math.round(nr.x), y: Math.round(nr.y), w: Math.round(nr.width), h: Math.round(nr.height) },
          items: n.querySelectorAll('li, a').length,
          backgroundColor: s.backgroundColor,
          boxShadow: s.boxShadow,
          borderRadius: s.borderRadius,
        };
      }
    }
    return best;
  });

  await shot(page, `${prefix}-search-typing.png`, {
    x: 0,
    y: 0,
    width: 1440,
    height: Math.min(700, (suggestions?.box.y ?? 200) + (suggestions?.box.h ?? 100) + 30),
  });

  return { found: true, ...info, focused, suggestions };
}

/* ------------------------------ mobile drawer ----------------------------- */
async function probeMobileMenu(page, prefix) {
  const opened = await page.evaluate(() => {
    const candidates = Array.from(
      document.querySelectorAll(
        '[class*="hamburger"], [class*="menu-toggle"], [class*="mobil"], button[aria-label*="menu" i], .off-canvas-toggle, [class*="nav-icon"]',
      ),
    ).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 12 && r.height > 12 && r.top < 120;
    });
    if (!candidates.length) return null;
    const el = candidates[0];
    el.setAttribute('data-probe-burger', '1');
    const r = el.getBoundingClientRect();
    return {
      selector: `${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').split(/\s+/).slice(0, 2).join('.')}`,
      box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    };
  });
  if (!opened) return { found: false };

  await shot(page, `${prefix}-mobile-menu-closed.png`, { x: 0, y: 0, width: 390, height: 844 });
  await page.click('[data-probe-burger]', { force: true }).catch(() => {});
  await page.waitForTimeout(1000);

  const panel = await page.evaluate(() => {
    let best = null;
    for (const el of Array.from(document.querySelectorAll('div, nav, aside, ul'))) {
      const s = getComputedStyle(el);
      if (!['fixed', 'absolute'].includes(s.position)) continue;
      if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') continue;
      const r = el.getBoundingClientRect();
      if (r.height < 250 || r.width < 150) continue;
      if (r.left > window.innerWidth || r.right < 0) continue;
      if (!best || r.width * r.height > best.area) {
        best = {
          area: r.width * r.height,
          selector: `${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').split(/\s+/).slice(0, 2).join('.')}`,
          box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          backgroundColor: s.backgroundColor,
          transform: s.transform,
          transition: s.transition,
          links: el.querySelectorAll('a').length,
        };
      }
    }
    return best;
  });

  await shot(page, `${prefix}-mobile-menu-open.png`, { x: 0, y: 0, width: 390, height: 844 });
  return { found: true, trigger: opened, panel };
}

/* --------------------------------- main ---------------------------------- */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(SHOT_DIR, { recursive: true });
  const url = new URL(args.path, args.url).toString();

  const browser = await launchBrowser();
  const out = { url, probedAt: new Date().toISOString() };

  try {
    /* ---- desktop ---- */
    {
      const context = await createContext(browser, DESKTOP);
      const page = await context.newPage();
      // Animation must stay alive here, so the reduced-motion default from
      // CAPTURE_ENV is explicitly overridden for this page.
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      try {
        log(`interaction probe (desktop) ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await settle(page);

        out.headerScroll = await probeHeaderScroll(page, args.prefix);
        log(`  header sticky: ${out.headerScroll?.isSticky}`);
        out.navHover = await probeNavHover(page, args.prefix);
        log(`  nav panels: ${out.navHover.filter((n) => n.panel).length}/${out.navHover.length}`);
        out.search = await probeSearch(page, args.prefix);
        log(`  search suggestions: ${out.search?.suggestions ? 'yes' : 'no'}`);
        await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
        await settle(page);
        out.slider = await probeSlider(page, args.prefix);
        log(`  slider autoplay: ${out.slider?.autoplayIntervalMs ?? 'n/a'}ms`);
        out.tabs = await probeTabs(page, args.prefix);
        log(`  tabs: ${out.tabs?.found ? out.tabs.labels.join(' / ') : 'none'}`);
        out.cardHover = await probeCardHover(page, args.prefix);
        log(`  card hover changes: ${Object.keys(out.cardHover?.changed ?? {}).join(', ') || 'none'}`);
      } catch (e) {
        warn(`desktop: ${e.message}`);
        out.desktopError = e.message;
      } finally {
        await context.close().catch(() => {});
      }
    }

    /* ---- mobile ---- */
    {
      const context = await createContext(browser, MOBILE);
      const page = await context.newPage();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      try {
        log(`interaction probe (mobile) ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await settle(page);
        out.mobileMenu = await probeMobileMenu(page, args.prefix);
        log(`  mobile drawer: ${out.mobileMenu?.panel ? `${out.mobileMenu.panel.box.w}px` : 'not found'}`);
      } catch (e) {
        warn(`mobile: ${e.message}`);
        out.mobileError = e.message;
      } finally {
        await context.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const file = path.join(OUT_DIR, `${args.out}-interactions.json`);
  await writeFile(file, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  log(`\n→ ${file}`);
  return 0;
}

main()
  .then((c) => process.exit(c))
  .catch((e) => {
    process.stderr.write(`interaction-probe failed: ${e.stack}\n`);
    process.exit(1);
  });
