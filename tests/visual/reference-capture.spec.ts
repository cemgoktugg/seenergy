/**
 * Reference-side capture and measurement.
 *
 * Runs against the live reference site (project: `reference`). It does two
 * things the local specs cannot:
 *   1. proves the reference site is reachable and renderable at every viewport
 *   2. records measured geometry of the structural regions, which is the input
 *      the `reference-clone` skill turns into `reference-analysis.md`
 *
 * It deliberately writes to `artifacts/visual/reference-live/`, NOT to the
 * protected baseline in `artifacts/visual/reference/`. Refreshing the baseline
 * is an explicit, separate command:  npm run visual:update-baseline
 *
 * Network-bound, so it is excluded from the fast quality gate.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from '@playwright/test';

import {
  PATHS,
  REFERENCE_BASE_URL,
  ROUTES,
  SCREENSHOT_KINDS,
  VIEWPORTS,
  screenshotName,
} from './routes';
import { captureShot, gotoStable, measureRegion } from './visual-helpers';

const OUT_DIR = path.join(process.cwd(), PATHS.root, 'reference-live');

/**
 * Structural regions to measure. These are generic landmark selectors: the
 * reference markup is not known in advance, and a selector that does not
 * resolve is recorded as `found: false` rather than failing the run.
 */
const REGION_SELECTORS = [
  'body',
  'header',
  'header nav',
  'nav',
  'main',
  'main > *:first-child',
  'footer',
];

test.describe('reference site', () => {
  test.describe.configure({ mode: 'serial' });

  for (const viewport of VIEWPORTS) {
    test.describe(`@ ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({
        viewport: { width: viewport.width, height: viewport.height },
      });

      for (const route of ROUTES) {
        test(`captures ${route.name}`, async ({ page }, testInfo) => {
          await mkdir(OUT_DIR, { recursive: true });

          await gotoStable(page, route.referencePath);

          // The page must actually have rendered something.
          const bodyBox = await page.locator('body').boundingBox();
          expect(bodyBox, 'body should have a layout box').not.toBeNull();
          expect(bodyBox!.width).toBeGreaterThan(0);

          for (const kind of SCREENSHOT_KINDS) {
            const fileName = screenshotName(route.name, viewport.name, kind);
            await captureShot(page, testInfo, fileName, kind, OUT_DIR);
          }

          const regions = [];
          for (const selector of REGION_SELECTORS) {
            regions.push(await measureRegion(page, selector));
          }

          const measurement = {
            route: route.name,
            title: route.title,
            referenceUrl: new URL(route.referencePath, REFERENCE_BASE_URL).toString(),
            viewport,
            capturedAt: new Date().toISOString(),
            documentSize: await page.evaluate(() => ({
              scrollWidth: document.documentElement.scrollWidth,
              scrollHeight: document.documentElement.scrollHeight,
              clientWidth: document.documentElement.clientWidth,
            })),
            regions,
          };

          await writeFile(
            path.join(OUT_DIR, `${route.name}__${viewport.name}__metrics.json`),
            `${JSON.stringify(measurement, null, 2)}\n`,
            'utf8',
          );
        });
      }
    });
  }
});
