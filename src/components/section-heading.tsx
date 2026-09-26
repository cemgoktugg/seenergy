import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * The one section heading.
 *
 * The homepage had four: a coloured dot over the slider titles, a vertical bar
 * with a rule under "Blog & Markalarımız", a dot again over the brands, and no
 * heading at all over the product tabs. Each was reasonable; together they read
 * as four hands. This is the mark the hero, the campaign cards and the tech
 * band already use — a short gradient tick before an uppercase eyebrow, then a
 * tight heading — so every band now opens the same way.
 *
 * `children` is the right-hand slot (slider arrows); `action` a "Tümü" link.
 */
export function SectionHeading({
  eyebrow,
  title,
  id,
  action,
  tone = 'light',
  children,
}: {
  eyebrow: string;
  title: string;
  /** For `aria-labelledby` on the section it names. */
  id?: string;
  action?: { label: string; href: string };
  /** `dark` for the chrome bands, where the ink inverts. */
  tone?: 'light' | 'dark';
  children?: React.ReactNode;
}) {
  const dark = tone === 'dark';

  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <p
          className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] dt:text-[11px] ${
            dark ? 'text-white/60' : 'text-text-secondary'
          }`}
        >
          <span aria-hidden className="h-[3px] w-6 shrink-0 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          <span className="truncate">{eyebrow}</span>
        </p>
        <h2
          id={id}
          className={`mt-1 truncate text-[18px] font-extrabold tracking-tight dt:mt-1.5 dt:text-[22px] ${
            dark ? 'text-white' : 'text-text-primary'
          }`}
        >
          {title}
        </h2>
      </div>

      {action || children ? (
        <div className="flex shrink-0 items-center gap-1.5">
          {action ? (
            <Link
              href={action.href}
              className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors duration-(--duration-fast) sm:inline-flex ${
                dark ? 'text-white/70 hover:text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {action.label}
              <ArrowRight size={13} strokeWidth={2.25} aria-hidden />
            </Link>
          ) : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}
