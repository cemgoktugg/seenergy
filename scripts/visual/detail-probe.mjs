#!/usr/bin/env node
/**
 * Focused follow-up probe.
 *
 * `interaction-probe.mjs` discovers *that* something happens. This measures the
 * four things the reconstruction needs exactly, using the concrete selectors the
 * earlier passes revealed rather than generic heuristics:
 *
 *   1. mega-menu column geometry + heading/link typography
 *   2. product-card hover, targeted at the real `.productItem` (the generic
 *      finder picked up a promo tile instead, which produced a false "no change")
 *   3. tab pill geometry and active vs inactive styling
 *   4. hero slider dots / arrows / slide geometry
 *
 *   node scripts/visual/detail-probe.mjs
 *   node scripts/visual/detail-probe.mjs --url http://localhost:3100 --out local-detail --prefix local
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { REFERENCE_BASE_URL } from '../../visual.config.mjs';
import { createContext, launchBrowser, log, warn } from './capture-core.mjs';

const OUT_DIR = 'reference-analysis/measurements';
const SHOT_DIR = 'reference-analysis/interactions';
const VIEWPORT = { name: 'desktop-1440', width: 1440, height: 900 };

function parseArgs(argv) {
  const a = {
    url: REFERENCE_BASE_URL,
    path: '/',
    out: 'reference-detail',
    prefix: 'ref',
    card: '.productItem',
    nav: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--url') a.url = argv[++i];
    else if (argv[i] === '--path') a.path = argv[++i];
    else if (argv[i] === '--out') a.out = argv[++i];
    else if (argv[i] === '--prefix') a.prefix = argv[++i];
    else if (argv[i] === '--card') a.card = argv[++i];
    else if (argv[i] === '--nav') a.nav = argv[++i];
  }
  return a;
}

async function settle(page) {
  await page.waitForLoadState('load').catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(2600);
  await page
    .evaluate(() => {
      for (const f of Array.from(document.querySelectorAll('iframe'))) {
        const r = f.getBoundingClientRect();
        if (r.width > 200 && r.height > 150) f.style.display = 'none';
      }
      for (const el of Array.from(document.querySelectorAll('body > div, body > section'))) {
        if (getComputedStyle(el).position !== 'fixed') return;
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
  } catch (e) {
    warn(`screenshot ${file}: ${e.message}`);
  }
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(SHOT_DIR, { recursive: true });
  const url = new URL(args.path, args.url).toString();

  const browser = await launchBrowser();
  const out = { url, probedAt: new Date().toISOString() };

  try {
    const context = await createContext(browser, VIEWPORT);
    const page = await context.newPage();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await settle(page);

    /* ---------------- 1. mega menu ---------------- */
    const navSelector =
      args.nav ??
      (await page.evaluate(() => {
        const header = document.querySelector('header') || document.body;
        let best = null;
        let n = 0;
        for (const ul of Array.from(header.querySelectorAll('ul'))) {
          const kids = Array.from(ul.children).filter(
            (k) => k.getBoundingClientRect().height > 10,
          );
          if (kids.length < 3) continue;
          const tops = kids.map((k) => Math.round(k.getBoundingClientRect().top));
          if (new Set(tops).size > 2) continue;
          if (kids.length > n) {
            n = kids.length;
            best = ul;
          }
        }
        if (!best) return null;
        best.setAttribute('data-dp-nav', '1');
        return '[data-dp-nav]';
      }));

    if (navSelector) {
      const first = await page.evaluate((s) => {
        const li = document.querySelector(s)?.children[0];
        if (!li) return null;
        li.setAttribute('data-dp-item', '1');
        const r = li.getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
      }, navSelector);

      if (first) {
        // Idle style of the trigger, before any hover.
        out.navTriggerIdle = await page.evaluate(() => {
          const a = document.querySelector('[data-dp-item] a') || document.querySelector('[data-dp-item]');
          const s = getComputedStyle(a);
          const r = a.getBoundingClientRect();
          return {
            box: { w: Math.round(r.width), h: Math.round(r.height) },
            backgroundColor: s.backgroundColor,
            color: s.color,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            borderRadius: s.borderRadius,
            transition: s.transition,
            padding: s.padding,
          };
        });

        await page.mouse.move(first.x, first.y);
        await page.waitForTimeout(700);

        out.megaMenu = await page.evaluate(() => {
          const li = document.querySelector('[data-dp-item]');
          const vis = (el) => {
            const s = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return (
              s.display !== 'none' &&
              s.visibility !== 'hidden' &&
              s.opacity !== '0' &&
              r.width > 0 &&
              r.height > 0
            );
          };
          // The panel: biggest visible descendant wider than the trigger.
          let panel = null;
          for (const el of Array.from(li.querySelectorAll('*'))) {
            if (!vis(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.width < 400 || r.height < 60) continue;
            if (!panel || r.width * r.height > panel.__area) {
              panel = el;
              panel.__area = r.width * r.height;
            }
          }
          if (!panel) return null;
          const pr = panel.getBoundingClientRect();
          const ps = getComputedStyle(panel);

          // Columns: visible children (or grandchildren) that stack side by side.
          const pickColumns = (root) => {
            const kids = Array.from(root.children).filter(vis);
            if (kids.length >= 2) {
              const tops = kids.map((k) => Math.round(k.getBoundingClientRect().top));
              if (new Set(tops).size <= 2 && kids.length >= 3) return kids;
            }
            for (const k of kids) {
              const deeper = pickColumns(k);
              if (deeper) return deeper;
            }
            return null;
          };
          const cols = pickColumns(panel) ?? [];

          const styleOf = (el) => {
            const s = getComputedStyle(el);
            return {
              fontSize: s.fontSize,
              fontWeight: s.fontWeight,
              color: s.color,
              textTransform: s.textTransform,
              lineHeight: s.lineHeight,
            };
          };

          return {
            box: {
              x: Math.round(pr.x),
              y: Math.round(pr.y),
              w: Math.round(pr.width),
              h: Math.round(pr.height),
            },
            style: {
              position: ps.position,
              backgroundColor: ps.backgroundColor,
              boxShadow: ps.boxShadow,
              borderRadius: ps.borderRadius,
              padding: ps.padding,
              transition: ps.transition,
              zIndex: ps.zIndex,
            },
            columnCount: cols.length,
            columns: cols.slice(0, 8).map((c) => {
              const r = c.getBoundingClientRect();
              const heading = c.querySelector('a, span, div, strong');
              const links = Array.from(c.querySelectorAll('a')).filter(vis);
              return {
                box: {
                  x: Math.round(r.x),
                  y: Math.round(r.y),
                  w: Math.round(r.width),
                  h: Math.round(r.height),
                },
                heading: heading ? { text: (heading.textContent || '').trim().slice(0, 30), ...styleOf(heading) } : null,
                linkCount: links.length,
                linkStyle: links[1] ? styleOf(links[1]) : null,
                linkPitch:
                  links.length > 2
                    ? Math.round(
                        links[2].getBoundingClientRect().top - links[1].getBoundingClientRect().top,
                      )
                    : null,
              };
            }),
            triggerHover: (() => {
              const a = li.querySelector('a') || li;
              const s = getComputedStyle(a);
              return {
                backgroundColor: s.backgroundColor,
                color: s.color,
                borderRadius: s.borderRadius,
              };
            })(),
          };
        });
        await shot(page, `${args.prefix}-megamenu-open.png`, {
          x: 0,
          y: 0,
          width: VIEWPORT.width,
          height: Math.min(880, (out.megaMenu?.box.y ?? 200) + (out.megaMenu?.box.h ?? 300) + 20),
        });
        await page.mouse.move(5, 700);
        await page.waitForTimeout(400);
      }
    }

    /* ---------------- 2. real product-card hover ---------------- */
    const cardFound = await page.evaluate((cardSel) => {
      // A promo tile inside a product slider also carries the card class, so a
      // real card is identified by actually having a price and a product name.
      const priceRe = /₺\s?[\d.,]{2,}/;
      const els = Array.from(document.querySelectorAll(cardSel)).filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 120 || r.height < 200) return false;
        if (!el.querySelector('img')) return false;
        return priceRe.test(el.textContent || '');
      });
      if (!els.length) return null;
      const el = els[3] ?? els[0];
      el.setAttribute('data-dp-card', '1');
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      return true;
    }, args.card);

    if (cardFound) {
      await page.waitForTimeout(700);
      const snap = () =>
        page.evaluate(() => {
          const card = document.querySelector('[data-dp-card]');
          const s = getComputedStyle(card);
          const r = card.getBoundingClientRect();
          const vis = (el) => {
            const cs = getComputedStyle(el);
            const rr = el.getBoundingClientRect();
            return (
              cs.display !== 'none' &&
              cs.visibility !== 'hidden' &&
              cs.opacity !== '0' &&
              rr.width > 0 &&
              rr.height > 0
            );
          };
          const visibleDescendants = Array.from(card.querySelectorAll('*'))
            .filter(vis)
            .map((el) => {
              const rr = el.getBoundingClientRect();
              return `${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '')
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .join('.')}@${Math.round(rr.x - r.x)},${Math.round(rr.y - r.y)},${Math.round(rr.width)}x${Math.round(rr.height)}`;
            });
          const img = card.querySelector('img');
          return {
            box: { w: Math.round(r.width), h: Math.round(r.height) },
            boxShadow: s.boxShadow,
            transform: s.transform,
            border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
            backgroundColor: s.backgroundColor,
            transition: s.transition,
            imageTransform: img ? getComputedStyle(img).transform : null,
            imageTransition: img ? getComputedStyle(img).transition : null,
            imageSrc: (img?.getAttribute('src') || '').slice(-46),
            visibleDescendants,
          };
        });

      await page.mouse.move(5, 400);
      await page.waitForTimeout(500);
      const before = await snap();
      const clip = await page.evaluate(() => {
        const r = document.querySelector('[data-dp-card]').getBoundingClientRect();
        return {
          x: Math.max(0, Math.round(r.x - 14)),
          y: Math.max(0, Math.round(r.y - 14)),
          width: Math.round(r.width + 28),
          height: Math.round(r.height + 28),
        };
      });
      await shot(page, `${args.prefix}-product-default.png`, clip);

      const center = await page.evaluate(() => {
        const r = document.querySelector('[data-dp-card]').getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
      });
      await page.mouse.move(center.x, center.y);
      await page.waitForTimeout(1000);
      const after = await snap();
      await shot(page, `${args.prefix}-product-hover.png`, clip);
      await page.mouse.move(5, 400);

      const changed = {};
      for (const k of Object.keys(before)) {
        if (k === 'visibleDescendants') continue;
        if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) {
          changed[k] = { before: before[k], after: after[k] };
        }
      }
      const beforeSet = new Set(before.visibleDescendants);
      const afterSet = new Set(after.visibleDescendants);
      out.cardHover = {
        found: true,
        changed,
        appeared: after.visibleDescendants.filter((d) => !beforeSet.has(d)),
        disappeared: before.visibleDescendants.filter((d) => !afterSet.has(d)),
        before: { box: before.box, boxShadow: before.boxShadow, transition: before.transition },
        after: { box: after.box, boxShadow: after.boxShadow },
      };
    } else {
      out.cardHover = { found: false, selector: args.card };
    }

    /* ---------------- 3. tabs ---------------- */
    out.tabs = await page.evaluate(() => {
      const wanted = /haftanın|yeni ürün|çok satan|haftanin/i;
      for (const el of Array.from(document.querySelectorAll('*'))) {
        const kids = Array.from(el.children).filter((k) => k.getBoundingClientRect().height > 15);
        if (kids.length < 2 || kids.length > 6) continue;
        const labels = kids.map((k) => (k.textContent || '').trim());
        if (!labels.some((l) => wanted.test(l))) continue;
        if (labels.some((l) => l.length > 40)) continue;
        const r = el.getBoundingClientRect();
        return {
          box: {
            x: Math.round(r.x),
            y: Math.round(r.y + window.scrollY),
            w: Math.round(r.width),
            h: Math.round(r.height),
          },
          gap: (() => {
            if (kids.length < 2) return null;
            const a = kids[0].getBoundingClientRect();
            const b = kids[1].getBoundingClientRect();
            return Math.round(b.left - a.right);
          })(),
          items: kids.map((k) => {
            const kr = k.getBoundingClientRect();
            const s = getComputedStyle(k);
            const inner = k.querySelector('a, span, button');
            const is = inner ? getComputedStyle(inner) : s;
            return {
              text: (k.textContent || '').trim().slice(0, 30),
              box: { x: Math.round(kr.x), w: Math.round(kr.width), h: Math.round(kr.height) },
              backgroundColor: s.backgroundColor !== 'rgba(0, 0, 0, 0)' ? s.backgroundColor : is.backgroundColor,
              color: is.color,
              fontSize: is.fontSize,
              fontWeight: is.fontWeight,
              borderRadius: s.borderRadius !== '0px' ? s.borderRadius : is.borderRadius,
              transition: s.transition,
              className: typeof k.className === 'string' ? k.className : '',
            };
          }),
        };
      }
      return null;
    });

    /* ---------------- 4. hero slider ---------------- */
    out.hero = await page.evaluate(() => {
      const el = document.querySelector('.owl-carousel, .swiper, .slick-slider');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const dots = Array.from(el.querySelectorAll('.owl-dot, .swiper-pagination-bullet, .slick-dots li'));
      const arrows = Array.from(
        el.querySelectorAll('.owl-prev, .owl-next, .swiper-button-next, .swiper-button-prev, .slick-arrow'),
      ).filter((a) => a.getBoundingClientRect().width > 0);
      const stage = el.querySelector('.owl-stage, .swiper-wrapper, .slick-track');
      const slide = el.querySelector('.owl-item, .swiper-slide, .slick-slide');
      const dotStyle = dots[0] ? getComputedStyle(dots[0]) : null;
      const activeDot = dots.find((d) => /active/i.test(d.className));
      return {
        box: {
          x: Math.round(r.x),
          y: Math.round(r.y + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
        },
        borderRadius: getComputedStyle(el).borderRadius,
        dotCount: dots.length,
        dotBox: dots[0]
          ? {
              w: Math.round(dots[0].getBoundingClientRect().width),
              h: Math.round(dots[0].getBoundingClientRect().height),
              y: Math.round(dots[0].getBoundingClientRect().y - r.y),
            }
          : null,
        dotStyle: dotStyle
          ? {
              backgroundColor: dotStyle.backgroundColor,
              borderRadius: dotStyle.borderRadius,
              margin: dotStyle.margin,
              opacity: dotStyle.opacity,
            }
          : null,
        activeDotStyle: activeDot
          ? {
              backgroundColor: getComputedStyle(activeDot).backgroundColor,
              width: Math.round(activeDot.getBoundingClientRect().width),
            }
          : null,
        arrowCount: arrows.length,
        slideBox: slide
          ? {
              w: Math.round(slide.getBoundingClientRect().width),
              h: Math.round(slide.getBoundingClientRect().height),
            }
          : null,
        stageTransition: stage ? getComputedStyle(stage).transitionDuration : null,
        stageTiming: stage ? getComputedStyle(stage).transitionTimingFunction : null,
      };
    });

    await context.close().catch(() => {});
  } finally {
    await browser.close().catch(() => {});
  }

  const file = path.join(OUT_DIR, `${args.out}.json`);
  await writeFile(file, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  log(`→ ${file}`);
  log(`  megaMenu: ${out.megaMenu ? `${out.megaMenu.box.w}x${out.megaMenu.box.h}, ${out.megaMenu.columnCount} cols` : 'none'}`);
  log(`  cardHover changed: ${Object.keys(out.cardHover?.changed ?? {}).join(', ') || 'none'}`);
  log(`  cardHover appeared: ${(out.cardHover?.appeared ?? []).length} nodes`);
  log(`  tabs: ${out.tabs ? out.tabs.items.map((i) => i.text).join(' | ') : 'none'}`);
  log(`  hero: ${out.hero ? `${out.hero.box.w}x${out.hero.box.h} dots=${out.hero.dotCount} arrows=${out.hero.arrowCount} t=${out.hero.stageTransition}` : 'none'}`);
  return 0;
}

main()
  .then((c) => process.exit(c))
  .catch((e) => {
    process.stderr.write(`detail-probe failed: ${e.stack}\n`);
    process.exit(1);
  });
