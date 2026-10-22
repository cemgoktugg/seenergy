/* eslint-disable @next/next/no-img-element */
/**
 * The SEENERGY logo — the client's own artwork, in three cuts.
 *
 * Source: img/logo.jpeg, a black "SEENERGY®" wordmark on white supplied on
 * 2026-10-22. It replaced the silver lockup with the "Güvenlik Teknolojileri
 * A.Ş" line (img/seenergy-logo-original.jpg, 2026-09-29). The cuts are lifted
 * off the white ground — darkness read as coverage, so the letter edges keep
 * their anti-aliasing — into transparent WebP in solid near-black.
 *
 *   public/brand/seenergy-logo.webp          the wordmark, 4.45 : 1
 *   public/brand/seenergy-logo-compact.webp  the same wordmark, smaller file —
 *                                            the new artwork has no tagline to
 *                                            drop, so the two cuts now match
 *   public/brand/seenergy-mark.webp          the S alone, 0.84 : 1 — phone
 *                                            header; also src/app/icon.png and
 *                                            apple-icon.png (white S on black)
 *   public/brand/seenergy-logo-hero.webp     the wordmark at slide size
 *
 * The artwork is black, so its colour follows the surface it sits on:
 *   tone="auto"   black on the light theme, white under the dark theme
 *                 (`.logo-auto` in globals.css inverts it) — the header,
 *                 the drawer
 *   tone="light"  always white — surfaces that are dark in both themes,
 *                 such as the condensed sticky bar
 *
 * The images are decorative (`alt=""`): every place that shows one wraps it in
 * a link that already carries the site name.
 */

type LogoProps = { className?: string; tone?: 'auto' | 'light' };

const toneClass = (tone: LogoProps['tone']) => (tone === 'light' ? 'invert' : 'logo-auto');

export function BrandMark({ className = '', tone = 'auto' }: LogoProps) {
  return (
    <img
      src="/brand/seenergy-mark.webp"
      width={240}
      height={286}
      alt=""
      decoding="async"
      className={`${toneClass(tone)} ${className}`}
    />
  );
}

export function BrandLogo({ className = '', tone = 'auto' }: LogoProps) {
  return (
    <img
      src="/brand/seenergy-logo.webp"
      width={960}
      height={216}
      alt=""
      decoding="async"
      className={`${toneClass(tone)} ${className}`}
    />
  );
}

export function BrandLogoCompact({ className = '', tone = 'auto' }: LogoProps) {
  return (
    <img
      src="/brand/seenergy-logo-compact.webp"
      width={720}
      height={162}
      alt=""
      decoding="async"
      className={`${toneClass(tone)} ${className}`}
    />
  );
}
