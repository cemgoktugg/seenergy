/**
 * Form primitives shared by checkout and the account forms, so every input on
 * the site has one height, one border and one error treatment.
 */

export const inputClass =
  'mt-1 block h-11 w-full rounded-(--card-radius) border border-line-strong bg-surface-card px-3 text-[14px] text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-brand aria-invalid:border-danger';

/** Spread onto an input: marks it invalid and points it at its message. */
export const invalidProps = (errors: Partial<Record<string, string>>, name: string) =>
  errors[name] ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-error` } : {};

export function Field({
  name,
  label,
  error,
  hint,
  className = '',
  children,
}: {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-[13px] font-semibold text-text-primary">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-[12px] font-medium text-danger-ink">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-[12px] text-text-secondary">{hint}</p>
      ) : null}
    </div>
  );
}
