/**
 * Fast responsive smoke test (project: `local`).
 *
 * Cheap, deterministic, no screenshot comparison — this is the pass the
 * quality gate runs after every change group. It answers one question per
 * viewport: did the last change break the layout in a way a human would
 * immediately call a bug?
 *
 *   - no horizontal overflow
 *   - the page has a real layout box and visible content
 *   - the document declares its language
 *   - a skip-to-content affordance exists (accessibility floor)
 */

import { expect, test } from '@playwright/test';

import { ROUTES, VIEWPORTS } from './routes';
import {
  NO_LOCAL_APP_REASON,
  expectNoHorizontalOverflow,
  gotoStable,
  hasLocalApp,
} from './visual-helpers';

const localApp = hasLocalApp();
const smokeRoutes = ROUTES.filter((route) => route.localReady);

test.describe('responsive smoke', () => {
  test.skip(!localApp, NO_LOCAL_APP_REASON);

  for (const viewport of VIEWPORTS) {
    test.describe(`@ ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({
        viewport: { width: viewport.width, height: viewport.height },
      });

      for (const route of smokeRoutes) {
        test(`${route.name} lays out cleanly`, async ({ page }) => {
          await gotoStable(page, route.localPath);

          await expectNoHorizontalOverflow(page);

          const box = await page.locator('body').boundingBox();
          expect(box, 'body should have a layout box').not.toBeNull();
          expect(box!.height, 'page should not be empty').toBeGreaterThan(200);

          const lang = await page.getAttribute('html', 'lang');
          expect(lang, '<html> should declare a language').toBeTruthy();
        });
      }
    });
  }

  /**
   * Once, not once per viewport.
   *
   * This lived inside the viewport loop, which read as four viewport-specific
   * checks. It never was: the body immediately calls `setViewportSize` to 320
   * and always loads `smokeRoutes[0]`, so all four runs did the identical thing
   * — same width, same route, same assertion. The name promised coverage the
   * test did not provide.
   *
   * It is also the most expensive test in the file (a cold 320px load plus a
   * full stabilize). Measured on one run the four copies cost 33.7 + 32.6 +
   * 22.2 + 19.6 = ~108s of a 174s suite, which is what pushed the Stop hook
   * past its 110s budget. Coverage after this change is byte-for-byte what it
   * was before; only the three duplicates are gone.
   */
  test('narrow phone width does not overflow', async ({ page }) => {
    // 320px is the floor the project brief names explicitly.
    await page.setViewportSize({ width: 320, height: 720 });
    const home = smokeRoutes[0];
    test.skip(!home, 'no locally served route to check');
    await gotoStable(page, home.localPath);
    await expectNoHorizontalOverflow(page);
  });
});
