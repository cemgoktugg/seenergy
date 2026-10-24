/**
 * Homepage smoke tests (project: `local`).
 *
 * Required by the reconstruction brief §33: prove the page loads and that
 * every structural landmark of the reference composition is actually present.
 * These are behavioural assertions, not screenshot comparisons.
 */

import { expect, test } from '@playwright/test';

import { NO_LOCAL_APP_REASON, gotoStable, hasLocalApp } from './visual-helpers';

const localApp = hasLocalApp();

test.describe('homepage', () => {
  test.skip(!localApp, NO_LOCAL_APP_REASON);
  test.use({ viewport: { width: 1440, height: 900 } });

  test('loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await gotoStable(page, '/');

    expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
  });

  test('header, search and navigation are visible', async ({ page }) => {
    await gotoStable(page, '/');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // The search field is structural, not an icon — brief §11.
    const search = page.getByRole('searchbox', { name: /ara/i }).first();
    await expect(search).toBeVisible();
    const box = await search.boundingBox();
    expect(box, 'search should have a box').not.toBeNull();
    expect(box!.width, 'search should stay a prominent field').toBeGreaterThan(400);

    await expect(page.getByRole('navigation', { name: 'Ana kategoriler' })).toBeVisible();
  });

  test('header rows match the measured reference heights', async ({ page }) => {
    await gotoStable(page, '/');

    const header = await page.locator('header').boundingBox();
    expect(header).not.toBeNull();
    // Reference measures 175px. Allow a small tolerance for font metrics.
    expect(header!.height).toBeGreaterThan(160);
    expect(header!.height).toBeLessThan(195);
  });

  test('hero campaign is visible', async ({ page }) => {
    await gotoStable(page, '/');

    const hero = page.getByRole('region', { name: 'Öne çıkan kampanyalar' });
    await expect(hero).toBeVisible();

    const box = await hero.boundingBox();
    // Reference hero measures ~445px tall; it is not a full-screen hero.
    expect(box!.height).toBeGreaterThan(380);
    expect(box!.height).toBeLessThan(520);
  });

  test('product sections and cards are visible', async ({ page }) => {
    await gotoStable(page, '/');

    const cards = page.locator('article').filter({ hasText: 'Sepete Ekle' });
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(18);

    // Purchase action is persistent, never hover-revealed — brief §17.
    await expect(cards.first().getByRole('button', { name: /Sepete Ekle/i })).toBeVisible();

    // Section headers exist as real headings. (Was "All In One Bilgisayarlar",
    // a band that became the per-brand bands; the assertion outlived it.)
    await expect(page.getByRole('heading', { name: 'Haftanın Ürünleri' }).first()).toBeVisible();
    // Since 2026-10-24 the brands have their own band under "Öne Çıkanlar"
    // and the dark band holds the blog alone.
    await expect(page.getByRole('heading', { name: 'Markalarımız', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
  });

  test('product card keeps the measured proportions', async ({ page }) => {
    await gotoStable(page, '/');

    // The paired carousels use compact cards; reference proportions apply to
    // the standard cards in the product grids.
    const card = page.locator('article:not([aria-roledescription="carousel"] article)')
      .filter({ hasText: 'Sepete Ekle' }).first();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    // Reference cards measure 248-315 wide and 357 tall.
    expect(box!.width).toBeGreaterThan(220);
    expect(box!.width).toBeLessThan(340);
    expect(box!.height).toBeGreaterThan(330);
    expect(box!.height).toBeLessThan(430);
  });

  test('brand wall, trust row and footer are visible', async ({ page }) => {
    await gotoStable(page, '/');

    // The logo wall sits in the "Markalarımız" band, under the brand cards.
    await expect(page.locator('.brand-wall-plate')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Popüler Kategoriler' })).toBeVisible();
  });
});
