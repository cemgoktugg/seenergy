/**
 * Local screenshot regression (project: `local`).
 *
 * This is local-vs-local: it catches a change you did not intend to make. It
 * is NOT the reference comparison — that lives in the capture + pixel-diff
 * scripts, because comparing against a live third-party site inside an
 * assertion would make the suite fail whenever that site changes.
 *
 * Baselines live in `tests/visual/__baselines__/` and are versioned source.
 * They are only rewritten by an explicit, deliberate command:
 *
 *     npx playwright test local-regression --update-snapshots
 *
 * No npm script wraps that on purpose — `npm run visual:test` must never move
 * the baseline it is measuring against.
 */

import { expect, test } from '@playwright/test';

import { ROUTES, VIEWPORTS, screenshotName } from './routes';
import {
  NO_LOCAL_APP_REASON,
  gotoStable,
  hasLocalApp,
  masksFor,
} from './visual-helpers';

const localApp = hasLocalApp();

test.describe('local visual regression', () => {
  test.skip(!localApp, NO_LOCAL_APP_REASON);
  test.describe.configure({ mode: 'serial' });

  for (const viewport of VIEWPORTS) {
    test.describe(`@ ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({
        viewport: { width: viewport.width, height: viewport.height },
      });

      for (const route of ROUTES) {
        test(`${route.name} matches its baseline`, async ({ page }) => {
          test.skip(
            !route.localReady,
            `Route "${route.name}" is not served locally yet ` +
              '(localReady: false in visual.config.mjs).',
          );

          await gotoStable(page, route.localPath);

          await expect(page).toHaveScreenshot(
            screenshotName(route.name, viewport.name, 'viewport'),
            {
              fullPage: false,
              mask: masksFor(page),
              maskColor: '#FF00FF',
            },
          );

          await expect(page).toHaveScreenshot(
            screenshotName(route.name, viewport.name, 'full'),
            {
              fullPage: true,
              mask: masksFor(page),
              maskColor: '#FF00FF',
            },
          );
        });
      }
    });
  }
});
