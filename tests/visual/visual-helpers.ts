/**
 * Helpers shared by the visual specs.
 *
 * The stabilisation logic itself is NOT reimplemented here — it is imported
 * from `scripts/visual/capture-core.mjs`, which is also what the standalone
 * capture scripts use. One implementation, so a screenshot taken by a spec and
 * a screenshot taken by a script are the same screenshot.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { Page, TestInfo } from '@playwright/test';
import { expect } from '@playwright/test';

import { stabilizePage } from '../../scripts/visual/capture-core.mjs';
import { MASK_SELECTORS, TIMEOUTS, type ScreenshotKind } from './routes';

const ROOT = process.cwd();

/**
 * Is there a local application to test at all?
 *
 * This repository ships the visual workbench and the documentation set; the
 * storefront is not scaffolded here yet. Rather than fail every local spec
 * with a connection error, they skip with a stated reason — and start running
 * by themselves the moment a dev server script exists.
 *
 * Override with VISUAL_LOCAL_READY=1 when the app is served some other way.
 */
export function hasLocalApp(): boolean {
  if (process.env.VISUAL_LOCAL_READY === '1') return true;
  if (process.env.VISUAL_LOCAL_READY === '0') return false;

  const pkgPath = path.join(ROOT, 'package.json');
  if (!existsSync(pkgPath)) return false;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };
    const scripts = pkg.scripts ?? {};
    return Boolean(scripts.dev ?? scripts['start:dev'] ?? scripts.serve);
  } catch {
    return false;
  }
}

export const NO_LOCAL_APP_REASON =
  'No local application in this repository yet (no dev server script). ' +
  'These specs start running automatically once the storefront is scaffolded.';

/** Navigate and bring the page to a still, comparable state. */
export async function gotoStable(page: Page, url: string): Promise<void> {
  const response = await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: TIMEOUTS.navigation,
  });

  if (response) {
    expect(
      response.status(),
      `${url} should not return an error status`,
    ).toBeLessThan(400);
  }

  await page.waitForLoadState('load', { timeout: TIMEOUTS.navigation }).catch(() => {
    // A stalled sub-resource must not fail the run; the explicit asset waits
    // inside stabilizePage() are the real gate.
  });

  await stabilizePage(page);
}

/** Locators for the masked (non-deterministic) regions. */
export function masksFor(page: Page) {
  return MASK_SELECTORS.map((selector) => page.locator(selector));
}

/**
 * Take a deterministic screenshot and attach it to the test report.
 * Returns the buffer so a caller can also write it somewhere.
 */
export async function captureShot(
  page: Page,
  testInfo: TestInfo,
  fileName: string,
  kind: ScreenshotKind,
  outDir?: string,
): Promise<Buffer> {
  const buffer = await page.screenshot({
    path: outDir ? path.join(outDir, fileName) : undefined,
    fullPage: kind === 'full',
    animations: 'disabled',
    caret: 'hide',
    scale: 'css',
    mask: masksFor(page),
    maskColor: '#FF00FF',
    timeout: 30_000,
  });

  await testInfo.attach(fileName, { body: buffer, contentType: 'image/png' });
  return buffer;
}

/**
 * Horizontal overflow is the single most common responsive defect and it is
 * cheap to detect, so every viewport in the smoke suite checks it.
 */
export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const offenders: string[] = [];
    const viewportWidth = doc.clientWidth;

    for (const element of Array.from(document.body.querySelectorAll('*'))) {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.right > viewportWidth + 1) {
        const el = element as HTMLElement;
        const id = el.id ? `#${el.id}` : '';
        const cls =
          typeof el.className === 'string' && el.className
            ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
            : '';
        offenders.push(`${el.tagName.toLowerCase()}${id}${cls} → ${Math.round(rect.right)}px`);
        if (offenders.length >= 5) break;
      }
    }

    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: viewportWidth,
      offenders,
    };
  });

  expect(
    overflow.scrollWidth,
    `Horizontal overflow at ${overflow.clientWidth}px. First offenders: ${
      overflow.offenders.join(', ') || 'none identified'
    }`,
  ).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

/** Measured geometry of a region, for the reference-analysis report. */
export interface RegionMetrics {
  selector: string;
  found: boolean;
  width?: number;
  height?: number;
  top?: number;
  paddingTop?: string;
  paddingBottom?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  gap?: string;
  gridTemplateColumns?: string;
  maxWidth?: string;
}

/**
 * Read the computed box and type metrics of a region. This is what turns
 * "the header looks taller" into a number worth acting on.
 */
export async function measureRegion(
  page: Page,
  selector: string,
): Promise<RegionMetrics> {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return { selector: sel, found: false };

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return {
      selector: sel,
      found: true,
      width: Math.round(rect.width * 100) / 100,
      height: Math.round(rect.height * 100) / 100,
      top: Math.round(rect.top * 100) / 100,
      paddingTop: style.paddingTop,
      paddingBottom: style.paddingBottom,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      color: style.color,
      backgroundColor: style.backgroundColor,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow,
      gap: style.gap,
      gridTemplateColumns: style.gridTemplateColumns,
      maxWidth: style.maxWidth,
    };
  }, selector);
}
