/* eslint-disable @next/next/no-img-element */
/**
 * The SEENERGY logo — the client's own artwork, in three cuts.
 *
 * Source: img/seenergy-logo-original.jpg, a 1600×800 silver lockup on white
 * supplied on 2026-09-29. It replaced the S mark this file used to draw by
 * hand. The cuts are lifted off the white ground into transparent WebP so the
 * same files sit on the white header and on the near-black sticky bar. The
 * letter counters are transparent too, so on dark chrome the bar shows through
 * the R and the o's instead of white patches.
 *
 *   public/brand/seenergy-logo.webp          full lockup with "Güvenlik
 *                                            Teknolojileri A.Ş", 3.80 : 1
 *   public/brand/seenergy-logo-compact.webp  S + EENERGY, tagline removed —
 *                                            below ~40px tall the tagline is
 *                                            noise, 3.93 : 1
 *   public/brand/seenergy-mark.webp          the S alone, 0.84 : 1 — phone
 *                                            header; also src/app/icon.png
 *
 * The images are decorative (`alt=""`): every place that shows one wraps it in
 * a link that already carries the site name. When a vector original arrives,
 * replace the three files and the icons — nothing else changes.
 */

type LogoProps = { className?: string };

export function BrandMark({ className = '' }: LogoProps) {
  return <img src="/brand/seenergy-mark.webp" width={240} height={286} alt="" decoding="async" className={className} />;
}

export function BrandLogo({ className = '' }: LogoProps) {
  return <img src="/brand/seenergy-logo.webp" width={960} height={253} alt="" decoding="async" className={className} />;
}

export function BrandLogoCompact({ className = '' }: LogoProps) {
  return (
    <img src="/brand/seenergy-logo-compact.webp" width={720} height={183} alt="" decoding="async" className={className} />
  );
}
