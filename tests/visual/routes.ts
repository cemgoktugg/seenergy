/**
 * Typed view over the central visual configuration.
 *
 * The values themselves live in `visual.config.mjs` at the repository root so
 * that the Node scripts and the Playwright specs read the *same* numbers.
 * This file adds nothing but types and a couple of lookups — if you are
 * changing a route, a viewport or a threshold, change `visual.config.mjs`.
 */

import {
  CAPTURE_ENV as CAPTURE_ENV_RAW,
  CRITICAL_BANDS as CRITICAL_BANDS_RAW,
  LOCAL_BASE_URL as LOCAL_BASE_URL_RAW,
  MASK_SELECTORS as MASK_SELECTORS_RAW,
  PATHS as PATHS_RAW,
  REFERENCE_BASE_URL as REFERENCE_BASE_URL_RAW,
  ROUTES as ROUTES_RAW,
  SCREENSHOT_KINDS as SCREENSHOT_KINDS_RAW,
  THRESHOLDS as THRESHOLDS_RAW,
  TIMEOUTS as TIMEOUTS_RAW,
  VIEWPORTS as VIEWPORTS_RAW,
  screenshotName as screenshotNameRaw,
} from '../../visual.config.mjs';

export interface VisualRoute {
  /** Stable identifier used in every file name and report row. */
  name: string;
  /** Human label for reports. */
  title: string;
  /** Path on the reference site. Verified to return HTTP 200. */
  referencePath: string;
  /** Path on the local application, per docs/INFORMATION_ARCHITECTURE_ELECTRONICS.md. */
  localPath: string;
  /** False while the local app does not serve this route yet. */
  localReady: boolean;
  /** Lower number = fix this route first. */
  priority: number;
}

export interface VisualViewport {
  name: string;
  width: number;
  height: number;
  deviceScaleFactor?: number;
}

export interface CriticalBand {
  name: string;
  fromPx: number;
  toPx: number;
  maxDiffPercent: number;
}

export type ScreenshotKind = 'viewport' | 'full';

export const ROUTES: VisualRoute[] = ROUTES_RAW as VisualRoute[];
export const VIEWPORTS: VisualViewport[] = VIEWPORTS_RAW as VisualViewport[];
export const CRITICAL_BANDS: CriticalBand[] = CRITICAL_BANDS_RAW as CriticalBand[];
export const SCREENSHOT_KINDS: ScreenshotKind[] =
  SCREENSHOT_KINDS_RAW as ScreenshotKind[];

export const REFERENCE_BASE_URL: string = REFERENCE_BASE_URL_RAW;
export const LOCAL_BASE_URL: string = LOCAL_BASE_URL_RAW;
export const CAPTURE_ENV = CAPTURE_ENV_RAW;
export const THRESHOLDS = THRESHOLDS_RAW;
export const TIMEOUTS = TIMEOUTS_RAW;
export const MASK_SELECTORS: string[] = MASK_SELECTORS_RAW as string[];
export const PATHS = PATHS_RAW;

export const screenshotName: (
  route: string,
  viewport: string,
  kind: ScreenshotKind,
) => string = screenshotNameRaw;

/** Routes the local application can actually serve today. */
export const localReadyRoutes = (): VisualRoute[] =>
  ROUTES.filter((route) => route.localReady);

export const routeByName = (name: string): VisualRoute | undefined =>
  ROUTES.find((route) => route.name === name);

export const viewportByName = (name: string): VisualViewport | undefined =>
  VIEWPORTS.find((viewport) => viewport.name === name);
