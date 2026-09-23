/**
 * The SEENERGY "S" mark.
 *
 * Drawn rather than embedded: the mark arrived as a raster image, and a
 * hand-built SVG stays crisp at 30px in the header and at 220px in the footer
 * or an OG image. Replace it the moment the original vector lands in
 * `public/brand/` — the lockup below is the only place that would change.
 *
 * Construction (viewBox 84 × 100):
 *   stroke        22 units — 22% of the height, matching the logo's weight
 *   upper hook    a semicircle bulging left, centreline (30,11) → (30,50)
 *   lower hook    a semicircle bulging right, centreline (54,50) → (54,89)
 *   counters      two 17-unit gaps, deliberately equal — the failure mode for
 *                 a squared S is closing up and reading as a blob at 30px
 *   chamfer       the signature detail: the top-right terminal is cut at 45°,
 *                 so the bar's top edge stops at x=62 while its underside runs
 *                 out to x=84. Built as a triangle sharing the gradient, since
 *                 a stroke cap cannot be angled.
 *
 * The gradient runs bottom-left → top-right so the teal sits under the hook
 * and the purple lands on the chamfer, as it does in the original.
 */

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 84 100"
      className={className}
      role="img"
      aria-hidden
      focusable="false"
      fill="none"
    >
      <defs>
        {/* Nearly horizontal on purpose. A steep diagonal pushed the teal into
            the bottom-left corner and the mark read as blue-to-purple only;
            the original carries teal across the whole lower hook. */}
        <linearGradient
          id="seenergy-mark"
          x1="2"
          y1="74"
          x2="82"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#12A5A5" />
          <stop offset="0.38" stopColor="#2E55C8" />
          <stop offset="0.7" stopColor="#4A2E9C" />
          <stop offset="1" stopColor="#742D8E" />
        </linearGradient>
      </defs>

      <path
        d="M62 11 H30 A19 19.5 0 0 0 30 50 H54 A19 19.5 0 0 1 54 89 H4"
        stroke="url(#seenergy-mark)"
        strokeWidth="22"
      />
      <path d="M62 0 L84 22 H62 Z" fill="url(#seenergy-mark)" />
    </svg>
  );
}
