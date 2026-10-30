/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

import { imageProps } from '@/lib/image';
import type { PageSection, Project, Reference } from '@/lib/medusa/vitrin';

/**
 * The corporate pages' editable parts (admin → Vitrin), drawn inside
 * InfoPage's `.info-prose` body.
 *
 * A text section is plain text with two conventions the admin explains:
 * [yazı](/yol) is a link, and in a list "Etiket: açıklama" sets the label in
 * bold. Nothing else is interpreted — no HTML from the admin reaches the page.
 */

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Text with its [yazı](/yol) links. Site paths use Link; web addresses open in a new tab. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    if (match.index > last) out.push(text.slice(last, match.index));
    out.push(
      href.startsWith('/') ? (
        <Link key={match.index} href={href}>
          {label}
        </Link>
      ) : (
        <a key={match.index} href={href} target="_blank" rel="noopener">
          {label}
        </a>
      ),
    );
    last = match.index + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** A list line: "Etiket: açıklama" → bold label; anything else as written. */
function item(line: string): ReactNode {
  const match = /^([^:[\]()/]{1,60}):\s+(.+)$/.exec(line);
  if (!match) return inline(line);
  return (
    <>
      <strong>{match[1]}:</strong> {inline(match[2])}
    </>
  );
}

const lines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export function PageSections({ sections }: { sections: PageSection[] }) {
  return sections.map((section, index) => (
    <Fragment key={`${section.heading}-${index}`}>
      {section.heading ? <h2>{section.heading}</h2> : null}
      {section.style === 'paragraf' ? (
        section.text
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map((paragraph, n) => <p key={n}>{inline(paragraph.replace(/\s*\n\s*/g, ' '))}</p>)
      ) : section.style === 'adimlar' ? (
        <ol>
          {lines(section.text).map((line, n) => (
            <li key={n}>{item(line)}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {lines(section.text).map((line, n) => (
            <li key={n}>{item(line)}</li>
          ))}
        </ul>
      )}
    </Fragment>
  ));
}

/** /referanslar's client cards: logo when there is one, name, sector, a line of text. */
export function ReferenceGrid({ title, references }: { title: string; references: Reference[] }) {
  if (references.length === 0) return null;
  return (
    <>
      <h2>{title}</h2>
      <ul className="not-prose grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {references.map((ref, index) => {
          const card = (
            <article className="flex h-full flex-col rounded-(--card-radius) border border-line bg-white p-4 shadow-e1 transition-[box-shadow,border-color] duration-(--duration-base) group-hover:border-line-strong group-hover:shadow-e2">
              {ref.logo ? (
                <div className="mb-3 flex h-14 items-center justify-center">
                  <img {...imageProps(ref.logo, 160)} alt="" loading="lazy" className="h-10 w-[140px] object-contain" />
                </div>
              ) : null}
              <h3 className="text-[14px] font-extrabold leading-snug text-text-primary">{ref.name}</h3>
              {ref.sector ? (
                <p className="mt-0.5 text-[12px] font-bold uppercase tracking-[0.14em] text-text-secondary">{ref.sector}</p>
              ) : null}
              {ref.text ? <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{ref.text}</p> : null}
            </article>
          );
          return (
            <li key={`${ref.name}-${index}`}>
              {ref.href ? (
                <a
                  href={ref.href}
                  className="group block h-full"
                  {...(ref.href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener' })}
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** /projeler's project cards: photo, type, name, place · year, a line of text. */
export function ProjectGrid({ title, projects }: { title: string; projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <>
      <h2>{title}</h2>
      <ul className="not-prose grid gap-(--space-grid-gap) sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <li key={`${project.title}-${index}`}>
            <article className="flex h-full flex-col overflow-hidden rounded-(--card-radius) border border-line bg-surface-card shadow-e1">
              <div className="relative aspect-[4/3] bg-linear-to-br from-wash-fixed to-line">
                {project.image ? (
                  <img
                    {...imageProps(project.image, 420)}
                    alt={project.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
                {project.category ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[12px] font-bold text-text-primary shadow-e1">
                    {project.category}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                <h3 className="text-[16px] font-extrabold leading-snug tracking-tight text-text-primary">{project.title}</h3>
                {project.location || project.year ? (
                  <p className="mt-0.5 text-[13px] text-text-secondary">
                    {[project.location, project.year].filter(Boolean).join(' · ')}
                  </p>
                ) : null}
                {project.text ? <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{project.text}</p> : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
