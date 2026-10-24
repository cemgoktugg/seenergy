/**
 * What a category or brand page shows while it has no products yet.
 *
 * The client's tree has categories whose products are still being entered,
 * and the homepage links brands ahead of their catalogue. A dashed "nothing
 * here" box under an empty filter rail read as a broken page, so the scope
 * gets a real one instead: a quote panel for exactly this product group (the
 * shop sells these on request today), the categories that do have products,
 * and the shop's featured products — admin → Vitrin → "Öne Çıkanlar", the
 * same list the homepage uses, falling back to the catalogue's first models.
 */

import Link from 'next/link';
import { ClipboardList, MessageCircle, Phone, ShieldCheck, Truck, Wrench } from 'lucide-react';

import { ProductGrid } from '@/components/sections';
import { SectionHeading } from '@/components/section-heading';
import type { Product } from '@/data/catalog';
import { CATEGORY_TREE, categoryHref } from '@/data/categories';
import { quoteHref, telHref, waHref } from '@/lib/contact';
import { loadCatalog } from '@/lib/medusa/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';

const PROMISES = [
  { icon: ClipboardList, title: 'Proje bazlı fiyat', text: 'Adet ve modele göre size özel teklif' },
  { icon: Wrench, title: 'Keşif ve kurulum desteği', text: 'Doğru ürünü birlikte seçelim' },
  { icon: ShieldCheck, title: 'Garantili ürün', text: 'Faturalı, yetkili kanaldan tedarik' },
  { icon: Truck, title: 'Hızlı tedarik', text: 'Stok dışı modellerde termin bilgisi' },
];

export async function EmptyScope({ title }: { title: string }) {
  const [{ products, byId, byCategory }, { company, lists }] = await Promise.all([loadCatalog(), loadVitrin()]);

  const featured = (lists['one-cikan'] ?? [])
    .map((id) => byId(id))
    .filter((product): product is Product => Boolean(product));
  const picks = (featured.length ? featured : products).slice(0, 8);
  const stocked = CATEGORY_TREE.filter((node) => byCategory(node.slug).length > 0);

  return (
    <div className="container-main pb-10 pt-4 dt:pt-6">
      <section
        aria-labelledby="empty-scope-title"
        className="relative overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1"
      >
        <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative grid gap-6 px-5 py-7 dt:grid-cols-[minmax(0,1fr)_minmax(0,460px)] dt:gap-10 dt:px-8 dt:py-9">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-card px-3 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              <span aria-hidden className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grad-3 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-grad-3" />
              </span>
              Katalog hazırlanıyor
            </p>
            <h2
              id="empty-scope-title"
              className="mt-4 text-[24px] font-extrabold leading-tight tracking-tight text-text-primary dt:text-[32px]"
            >
              {title} ürünleri çok yakında burada
            </h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-text-secondary">
              Bu gruptaki modelleri katalogumuza ekliyoruz. Beklemenize gerek yok: ihtiyacınızı, adedi ya da
              projenizi yazın, uygun modelleri fiyatıyla birlikte size iletelim.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={quoteHref(title)}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                <ClipboardList size={17} strokeWidth={2} aria-hidden />
                Fiyat teklifi iste
              </Link>
              <a
                href={waHref(company.whatsapp, `Merhaba, ${title} ürünleri için bilgi almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface-card px-5 text-[14px] font-semibold text-text-primary transition-colors hover:border-text-primary"
              >
                <MessageCircle size={17} strokeWidth={2} aria-hidden />
                WhatsApp
              </a>
              <a
                href={telHref(company.phone)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface-card px-5 text-[14px] font-semibold text-text-primary transition-colors hover:border-text-primary"
              >
                <Phone size={17} strokeWidth={2} aria-hidden />
                {company.phone}
              </a>
            </div>
          </div>

          <ul className="grid gap-2.5 sm:grid-cols-2">
            {PROMISES.map(({ icon: Icon, title: heading, text }) => (
              <li
                key={heading}
                className="flex items-start gap-3 rounded-(--card-radius) border border-line bg-surface-card/90 p-3.5 backdrop-blur-[2px]"
              >
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-grad-1 to-grad-4 text-white"
                >
                  <Icon size={17} strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-[13px] font-bold text-text-primary">{heading}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-text-secondary">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {stocked.length > 0 && (
        <nav aria-label="Ürünü olan kategoriler" className="mt-(--space-grid-gap)">
          <ul className="flex flex-wrap gap-1.5">
            {stocked.map((node) => (
              <li key={node.slug}>
                <Link
                  href={categoryHref(node.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface-card px-3.5 py-1.5 text-[13px] font-medium text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  {node.label}
                  <span className="text-[12px] tabular-nums opacity-60">{byCategory(node.slug).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {picks.length > 0 && (
        <section aria-labelledby="empty-scope-picks" className="mt-8">
          <SectionHeading
            id="empty-scope-picks"
            eyebrow="Keşfet"
            title="Öne çıkan ürünler"
            action={{ label: 'Tüm kategoriler', href: '/kategori' }}
          />
          <div className="mt-4">
            <ProductGrid products={picks} columns={4} layout="grid" />
          </div>
        </section>
      )}
    </div>
  );
}
