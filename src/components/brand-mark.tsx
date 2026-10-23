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
 * `shine` (2026-10-24, the client asked for an effect on the logo): a silver
 * glint sweeps across the letters every few seconds — the light the category
 * bar's metal carries, landing on the logo. The glint is a layer masked by the
 * logo file itself (`.logo-shine` in globals.css), so it shows on the letters
 * only; steel-blue on a white logo, where white would vanish. The logo lifts
 * slightly on hover. Still under reduced motion.
 *
 * The images are decorative (`alt=""`): every place that shows one wraps it in
 * a link that already carries the site name.
 */

import type { CSSProperties } from 'react';

type LogoProps = { className?: string; tone?: 'auto' | 'light'; shine?: boolean };

const toneClass = (tone: LogoProps['tone']) => (tone === 'light' ? 'invert' : 'logo-auto');

function Logo({
  src,
  width,
  height,
  className = '',
  tone = 'auto',
  shine = false,
}: LogoProps & { src: string; width: number; height: number }) {
  if (!shine) {
    return (
      <img src={src} width={width} height={height} alt="" decoding="async" className={`${toneClass(tone)} ${className}`} />
    );
  }
  /* The sizing and visibility classes go on the wrapper, which takes the
     image's own width; the glint layer sits on top, masked by the same file. */
  return (
    <span
      style={{ '--logo-mask': `url(${src})` } as CSSProperties}
      className={`logo-shine ${tone === 'light' ? 'logo-shine-on-dark' : ''} transition-transform duration-(--duration-base) ease-out hover:scale-[1.03] ${className}`}
    >
      <img src={src} width={width} height={height} alt="" decoding="async" className={`${toneClass(tone)} h-full w-auto`} />
    </span>
  );
}

export function BrandMark(props: LogoProps) {
  return <Logo src="/brand/seenergy-mark.webp" width={240} height={286} {...props} />;
}

export function BrandLogo(props: LogoProps) {
  return <Logo src="/brand/seenergy-logo.webp" width={960} height={216} {...props} />;
}

export function BrandLogoCompact(props: LogoProps) {
  return <Logo src="/brand/seenergy-logo-compact.webp" width={720} height={162} {...props} />;
}
