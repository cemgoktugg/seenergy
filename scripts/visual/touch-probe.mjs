#!/usr/bin/env node
/**
 * Touch-target probe — measures what a FINGER can hit, not what the CSS says.
 *
 *   node scripts/visual/touch-probe.mjs [--viewport mobile] [--route /]
 *
 * WHY HIT-TESTING RATHER THAN getBoundingClientRect()
 *
 * Hit areas in this project are extended with `::before` pseudo-elements, and a
 * pseudo-element has no queryable rect — `getBoundingClientRect()` returns the
 * 6px bar and reports a failure that isn't one. So the detailed groups below
 * walk outward from each control's centre with `elementFromPoint` until the
 * hits stop resolving to that control. That measures the area which actually
 * responds to a tap.
 *
 * WHY IT ALSO CHECKS OVERLAP — this is the bug the probe exists for
 *
 * "Every target is ≥44px" is not sufficient. Extending three 10px dots sitting
 * 6px apart to 44px each makes their hit areas overlap by ~28px: every target
 * passes the size rule, and tapping between two dots still gives you whichever
 * one happens to win the hit test. Targets that are big enough but collide are
 * a FAIL here, per the 8px minimum spacing rule.
 *
 * REDUCED MOTION IS DELIBERATELY NOT INHERITED
 *
 * `CAPTURE_ENV.reducedMotion` is 'reduce', but the hero withdraws its pause
 * control under reduced motion (autoplay never starts, so there is nothing to
 * pause). Inheriting that would measure a page where the control is absent and
 * report a pass for something that was never rendered. This probe forces
 * 'no-preference' so every control is present.
 *
 * The page-wide sweep at the end is a DIFFERENT, weaker measurement: it uses
 * visual rects only, because elementFromPoint is viewport-relative and most of
 * an 8600px page is off-screen. It therefore over-reports controls that have
 * extended hit areas. Treat it as a triage list, not a verdict.
 */

import process from 'node:process';

import { chromium } from '@playwright/test';

import { CAPTURE_ENV, LOCAL_BASE_URL, TIMEOUTS, VIEWPORTS } from '../../visual.config.mjs';

const MIN = 44; // Apple HIG 44pt / Material 48dp — 44 is the floor we hold.
const MIN_GAP = 8; // Minimum spacing between adjacent touch targets.

const argv = process.argv.slice(2);
const argOf = (flag, fallback) => {
  const i = argv.indexOf(flag);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const viewportName = argOf('--viewport', 'mobile');
const route = argOf('--route', '/');
const viewport = VIEWPORTS.find((v) => v.name === viewportName);

if (!viewport) {
  console.error(
    `Unknown viewport "${viewportName}". Known: ${VIEWPORTS.map((v) => v.name).join(', ')}`,
  );
  process.exit(2);
}

const url = new URL(route, LOCAL_BASE_URL).toString();

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: viewport.width, height: viewport.height },
  deviceScaleFactor: CAPTURE_ENV.deviceScaleFactor,
  locale: CAPTURE_ENV.locale,
  timezoneId: CAPTURE_ENV.timezoneId,
  colorScheme: CAPTURE_ENV.colorScheme,
  // See the header note: NOT CAPTURE_ENV.reducedMotion.
  reducedMotion: 'no-preference',
});

const response = await page.goto(url, { waitUntil: 'load', timeout: TIMEOUTS.navigation });
if (!response || !response.ok()) {
  console.error(`FAIL  ${url} returned ${response ? response.status() : 'no response'}`);
  await browser.close();
  process.exit(1);
}
await page.waitForTimeout(600);

const result = await page.evaluate(
  ({ MIN, MIN_GAP }) => {
    const owns = (el, hit) =>
      Boolean(hit) && (hit === el || el.contains(hit) || hit.closest('button,a') === el);

    /** Walk outward until elementFromPoint stops resolving to `el`. */
    const reach = (el, cx, cy, dx, dy, limit = 80) => {
      let n = 0;
      for (let i = 1; i <= limit; i += 1) {
        if (!owns(el, document.elementFromPoint(Math.round(cx + dx * i), Math.round(cy + dy * i))))
          break;
        n = i;
      }
      return n;
    };

    /**
     * Is this control deliberately inert? The condensed sticky bar renders its
     * logo, search and cart at all times and hides them with
     * `pointer-events-none` + `aria-hidden` until you scroll. Those are not
     * failures, and reporting them as "blocked" trains the reader to ignore the
     * probe — which would hide the case that matters, a control genuinely
     * covered by something else.
     */
    const inert = (el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        if (getComputedStyle(n).pointerEvents === 'none') return true;
        if (n.getAttribute?.('aria-hidden') === 'true') return true;
        if (n.hasAttribute?.('inert')) return true;
      }
      return false;
    };

    const measure = (el, label) => {
      // elementFromPoint is viewport-relative, so a control below the fold
      // cannot be hit-tested where it sits. Centre it first — `block: 'center'`
      // also keeps it clear of the sticky header, which would otherwise read as
      // "covered by something else" and produce a false failure.
      const pre = el.getBoundingClientRect();
      const offscreen =
        pre.top < 0 ||
        pre.bottom > window.innerHeight ||
        pre.left < 0 ||
        pre.right > window.innerWidth;
      // `inline: 'center'` is not optional: several of these controls live in
      // horizontally-scrolling rails, where centring vertically alone leaves
      // them off-screen sideways. elementFromPoint then returns null and the
      // row reads "ÜSTÜNDE: (yok)" — the probe failing, not the application.
      if (offscreen) el.scrollIntoView({ block: 'center', inline: 'center' });
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const visual = `${Math.round(r.width)}x${Math.round(r.height)}`;
      if (inert(el)) return { label, visual, inert: true };
      const top = document.elementFromPoint(Math.round(cx), Math.round(cy));
      if (!owns(el, top)) {
        // Name the culprit: "blocked" with no element named is unactionable,
        // and it is also how a probe artifact is told apart from a real cover.
        const cls =
          top && typeof top.className === 'string' && top.className.trim()
            ? `.${top.className.trim().split(/\s+/).slice(0, 2).join('.')}`
            : '';
        return { label, visual, blocked: true, by: top ? `${top.tagName.toLowerCase()}${cls}` : '(yok)' };
      }
      const left = reach(el, cx, cy, -1, 0);
      const right = reach(el, cx, cy, 1, 0);
      const up = reach(el, cx, cy, 0, -1);
      const down = reach(el, cx, cy, 0, 1);
      const hitW = left + right + 1;
      const hitH = up + down + 1;
      return {
        label,
        visual,
        hitW,
        hitH,
        hitLeft: cx - left,
        hitRight: cx + right,
        visLeft: r.left,
        visRight: r.right,
        pass: hitW >= MIN && hitH >= MIN,
      };
    };

    const groups = [];

    // --- hero ------------------------------------------------------------
    const hero = document.querySelector('[aria-roledescription="carousel"]');
    const heroRows = [];
    if (hero) {
      hero.querySelectorAll('li button').forEach((el, i) => heroRows.push(measure(el, `nokta ${i + 1}`)));
      const label = (el) => el.getAttribute('aria-label') || '';
      const pause = [...hero.querySelectorAll('button')].find((el) =>
        /otomatik geçişi/i.test(label(el)),
      );
      if (pause) heroRows.push(measure(pause, 'durdur/başlat'));
      [...hero.querySelectorAll('button')]
        .filter((el) => /^(Önceki|Sonraki) kampanya$/.test(label(el)))
        .forEach((el) => heroRows.push(measure(el, label(el).split(' ')[0].toLowerCase())));
    }
    groups.push({ name: 'hero', rows: heroRows });

    // --- header ----------------------------------------------------------
    const header = document.querySelector('header');
    const headerRows = [];
    if (header) {
      [...header.querySelectorAll('button, a[href]')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.top < window.innerHeight;
        })
        .slice(0, 12)
        .forEach((el, i) => {
          const name =
            el.getAttribute('aria-label') ||
            (el.textContent || '').trim().slice(0, 16) ||
            el.tagName.toLowerCase();
          headerRows.push(measure(el, `${i + 1}. ${name}`));
        });
    }
    groups.push({ name: 'header', rows: headerRows });

    // --- paired product sliders -------------------------------------------
    // Hit-tested rather than trusted: the page-wide sweep reads visual rects
    // only, so an extended hit area is invisible to it. These carry the same
    // shape of control as the hero dots and had the same failure.
    const sliderRows = [];
    [...document.querySelectorAll('button[aria-label*="ürün grubu"]')]
      .slice(0, 6)
      .forEach((el) => {
        const label = (el.getAttribute('aria-label') || '').replace(' ürün grubu', '');
        sliderRows.push(measure(el, label.slice(0, 22)));
      });
    groups.push({ name: 'ürün sliderı', rows: sliderRows });

    // --- product card controls --------------------------------------------
    const cardRows = [];
    [...document.querySelectorAll('button[aria-label*="favorilere"]')]
      .slice(0, 3)
      .forEach((el, i) => cardRows.push(measure(el, `${i + 1}. favori`)));
    groups.push({ name: 'ürün kartı', rows: cardRows });

    // --- adjacency among the hero dots ------------------------------------
    const dots = heroRows.filter((r) => r.label.startsWith('nokta') && !r.blocked);
    const gaps = [];
    for (let i = 0; i < dots.length - 1; i += 1) {
      gaps.push({
        pair: `${i + 1}-${i + 2}`,
        visualGap: Math.round(dots[i + 1].visLeft - dots[i].visRight),
        hitGap: Math.round(dots[i + 1].hitLeft - dots[i].hitRight),
      });
    }

    // --- page-wide sweep (visual rects only — see the header note) --------
    const all = [...document.querySelectorAll('a[href], button, input, select, [role="button"]')];
    const small = all.filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      return r.width < MIN || r.height < MIN;
    });
    const worst = small
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          name:
            el.getAttribute('aria-label') ||
            (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) ||
            '(isimsiz)',
          size: `${Math.round(r.width)}x${Math.round(r.height)}`,
          area: r.width * r.height,
        };
      })
      .sort((a, b) => a.area - b.area)
      .slice(0, 12);

    return { groups, gaps, MIN_GAP, totalControls: all.length, smallCount: small.length, worst };
  },
  { MIN, MIN_GAP },
);

const pad = (s, n) => String(s).padEnd(n);
console.log(`\n=== dokunma hedefleri · ${viewport.name} ${viewport.width}x${viewport.height} · ${url} ===`);

let fails = 0;
for (const group of result.groups) {
  if (group.rows.length === 0) continue;
  console.log(`\n[${group.name}]`);
  console.log(`  ${pad('kontrol', 24)}${pad('görsel', 12)}${pad('dokunma', 12)}${MIN}px?`);
  for (const row of group.rows) {
    if (row.inert) {
      // Deliberately non-interactive at this scroll position (the condensed
      // sticky bar). Reported, but never counted as a failure.
      console.log(
        `  ${pad(row.label, 24)}${pad(row.visual, 12)}${pad('—', 12)}ATLANDI (şu an etkisiz)`,
      );
      continue;
    }
    if (row.blocked) {
      fails += 1;
      console.log(
        `  ${pad(row.label, 24)}${pad(row.visual, 12)}${pad('ENGELLİ', 12)}ÜSTÜNDE: ${row.by}`,
      );
      continue;
    }
    if (!row.pass) fails += 1;
    console.log(
      `  ${pad(row.label, 24)}${pad(row.visual, 12)}${pad(`${row.hitW}x${row.hitH}`, 12)}${
        row.pass ? 'GEÇTİ' : 'KALDI'
      }`,
    );
  }
}

let collisions = 0;
if (result.gaps.length > 0) {
  console.log(`\n[komşuluk]  hedef aralığı < 0 = ÇAKIŞMA, < ${MIN_GAP}px = kural ihlali`);
  for (const gap of result.gaps) {
    if (gap.hitGap < 0) collisions += 1;
    else if (gap.hitGap < MIN_GAP) collisions += 1;
    console.log(
      `  nokta ${gap.pair}: görsel ${String(gap.visualGap).padStart(3)}px   ` +
        `hedef ${String(gap.hitGap).padStart(4)}px   ` +
        `${gap.hitGap < 0 ? 'ÇAKIŞMA' : gap.hitGap < MIN_GAP ? `${MIN_GAP}px ALTI` : 'TAMAM'}`,
    );
  }
}

console.log(
  `\n[sayfa geneli]  ${result.smallCount} / ${result.totalControls} kontrol görsel olarak ${MIN}px altında`,
);
console.log('  (görsel ölçüm — genişletilmiş dokunma alanları burada görünmez, triyaj listesidir)');
for (const w of result.worst) {
  console.log(`  ${pad(w.size, 10)}${pad(w.tag, 8)}${w.name}`);
}

console.log(
  `\nSONUÇ: ${fails} hedef ${MIN}px altında · ${collisions} komşuluk ihlali (detaylı gruplarda)\n`,
);
await browser.close();
process.exit(fails > 0 || collisions > 0 ? 1 : 0);
