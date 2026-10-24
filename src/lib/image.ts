/**
 * Uploaded product photos arrive at 1200 × 1200 and were drawn at 40–240px:
 * measured on a category page, 27 of 31 images were over 2.5× the size they
 * were shown at (1.3 MB for one listing). These helpers route an upload
 * through Next's image optimizer at the size it is drawn, with a 2× source
 * for sharp screens — ~45 KB became ~6 KB for a card.
 *
 * Plain <img> stays in use (the cards' layout depends on it); only the URL
 * changes. Local files — the mock catalogue's SVGs, /brand, /hero — pass
 * through untouched: vectors need no resizing and the rest are already sized.
 * The backend host is allowed in next.config.ts (`images.remotePatterns`).
 */

/** Widths Next's optimizer accepts by default (imageSizes + deviceSizes). */
const WIDTHS = [64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200];

const isUpload = (src: string) => /^https?:\/\//.test(src) && !/\.svg(\?|$)/i.test(src);

export function imageUrl(src: string, width: number): string {
  if (!isUpload(src)) return src;
  const w = WIDTHS.find((candidate) => candidate >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=80`;
}

/** `src` and a 1×/2× `srcSet` for an image drawn `width` CSS pixels wide. */
export function imageProps(src: string, width: number): { src: string; srcSet?: string } {
  if (!isUpload(src)) return { src };
  return { src: imageUrl(src, width), srcSet: `${imageUrl(src, width)} 1x, ${imageUrl(src, width * 2)} 2x` };
}
