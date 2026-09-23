import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * First vitrin content — exactly what the storefront showed while it was
 * hard-coded in src/data/site.ts, so switching the homepage to Medusa changes
 * nothing a visitor can see. From here on the shop edits it in the admin
 * (Vitrin menu).
 *
 * Product lists reproduce the old deterministic `mixed(offset, count)` picks
 * over the seed order. Where the homepage showed the same concept twice (a
 * "Haftanın Ürünleri" slider AND a "Haftanın Ürünleri" tab) there is now one
 * list feeding both, so the shop maintains it in one place.
 */

const mixed = <T>(items: T[], offset: number, count: number): T[] =>
  Array.from({ length: count }, (_, i) => items[(offset + i * 5) % items.length]);

export default async function vitrin_seed({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  if ((await vitrin.listVitrinLists({}, { take: 1 })).length > 0) {
    logger.info("Vitrin: content already present, seed skipped.");
    return;
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "metadata"],
  });
  const legacy = (p: { metadata?: Record<string, unknown> | null }) =>
    Number(/^p-(\d+)$/.exec(String(p.metadata?.legacy_id ?? ""))?.[1] ?? Infinity);
  const ordered = [...products].sort((a, b) => legacy(a) - legacy(b)).map((p) => p.id);

  await vitrin.createVitrinLists([
    {
      key: "haftanin",
      title: "Haftanın Ürünleri",
      description: "Ana sayfadaki 'Haftanın Ürünleri' rafı (ilk 8) ve sekmesi (ilk 12).",
      product_ids: mixed(ordered, 2, 12),
    },
    {
      key: "yeni",
      title: "Yeni Gelenler",
      description: "'Yeni Gelenler' rafı (ilk 8) ve 'Yeni Ürünler' sekmesi (ilk 12).",
      product_ids: mixed(ordered, 11, 12),
    },
    {
      key: "cok-satan",
      title: "Çok Satanlar",
      description: "Sekmeli bloktaki 'Çok Satanlar' (ilk 12).",
      product_ids: mixed(ordered, 23, 12),
    },
    {
      key: "super-firsat",
      title: "Süper Fırsat Ürünleri",
      description: "Mor fırsat kartının yanındaki 4 ürün.",
      product_ids: mixed(ordered, 0, 4),
    },
  ]);

  const block = (group: string, data: Record<string, unknown>, rank = 0, key: string | null = null) => ({
    group,
    key,
    rank,
    is_active: true,
    data,
  });

  await vitrin.createVitrinBlocks([
    block("announcement", { text: "1000 TL ÜZERİ ÜCRETSİZ KARGO" }),

    block("hero-slide", {
      eyebrow: "Akıllı ev ve güvenlik",
      title: "Akıllı Ev Sistemleri",
      description: "Kameradan diafona, tüm akıllı ev çözümleri tek çatıda.",
      chips: ["Kamera ve diafon", "Akıllı priz ve röle", "Kurulum desteği"],
      cta: "Alışverişe Başla",
      href: "/kategori/akilli-ev",
      image: "/mock/hero/hero-1.svg",
    }, 0),
    block("hero-slide", {
      eyebrow: "Seslendirme sistemleri",
      title: "Profesyonel Ses",
      description: "Sahne ve mekân seslendirmesinde toptan fiyat avantajı.",
      chips: ["Anfi ve mikser", "Tavan ve kolon hoparlör", "Toptan fiyat"],
      cta: "Ürünleri İncele",
      href: "/kategori/seslendirme-sistemleri",
      image: "/mock/hero/hero-2.svg",
    }, 1),
    block("hero-slide", {
      eyebrow: "Televizyon yedek parça",
      title: "Tv Yedek Parça",
      description: "13.000+ televizyon modeline uyumlu led bar ve panel stoğu.",
      chips: ["13.000+ model", "Led bar ve panel", "Uyumluluk desteği"],
      cta: "Stoğu Görüntüle",
      href: "/kategori/tv-yedek-parca",
      image: "/mock/hero/hero-3.svg",
    }, 2),

    block("hero-side", { eyebrow: "Kampanya", title: "Süper Fırsat Ürünleri", href: "/kampanyalar", image: "/mock/campaigns/wide-2.svg" }, 0, "hero-side-1"),
    block("hero-side", { eyebrow: "Kurumsal", title: "Toptan alım ve bayilik", href: "/toptan-satis", image: "/mock/campaigns/wide-3.svg" }, 1, "hero-side-2"),

    block("banner", {
      title: "Türkiye'nin en geniş yedek parça stoğu",
      subtitle: "13.000+ televizyona uyumlu led bar çeşitleri",
      href: "/kategori/tv-yedek-parca",
      image: "/mock/campaigns/wide-1.svg",
    }, 0, "wide"),
    block("banner", { eyebrow: "Kendi markalarımız", title: "Tescilli Markalarımız", href: "/markalar", image: "/mock/campaigns/half-1.svg" }, 1, "dual-1"),
    block("banner", { eyebrow: "Yetkili satıcılık", title: "Resmi Yetkili Satıcısı Olduğumuz Markalar", href: "/markalar", image: "/mock/campaigns/half-2.svg" }, 2, "dual-2"),
    block("banner", { title: "Süper Fırsat", subtitle: "Ürünleri", href: "/kampanyalar", image: "/mock/products/cutout/dish-white.svg" }, 3, "super-firsat-promo"),

    ...[
      ["tekniva", "All in one bilgisayarlar ve monitörler"],
      ["orbisat", "Uydu alıcıları ve santral sistemleri"],
      ["sonora", "Profesyonel ses ve sahne sistemleri"],
      ["provista", "Güvenlik kameraları ve kayıt cihazları"],
      ["ledora", "Televizyon led bar ve panel yedek parçaları"],
      ["voltra", "Oto ses, multimedya ve görüntü sistemleri"],
      ["kumandax", "Televizyon, uydu ve klima kumandaları"],
    ].map(([handle, tagline], i) =>
      block("brand-band", { brand_handle: handle, tagline, logo: `/mock/brands/${handle}.svg`, product_ids: [] }, i)
    ),

    block("tech-band", {
      eyebrow: "Neden SEENERGY",
      title: "Elektronikte tedarik, tek adresten",
      description:
        "Uydu ve güvenlik sistemlerinden televizyon yedek parçaya, oto ses sistemlerinden devre elemanlarına kadar geniş bir katalog; hem son kullanıcıya hem kurumsal alıcıya aynı stok derinliğiyle.",
      stats: [
        { value: "12.000+", label: "Katalogdaki ürün çeşidi" },
        { value: "45+", label: "Yetkili satıcısı olduğumuz marka" },
        { value: "16:00", label: "Aynı gün kargo için son saat" },
        { value: "24 ay", label: "Garanti kapsamındaki ürünler" },
      ],
      cta_label: "Kurumsal alım ve bayilik",
      cta_href: "/toptan-satis",
    }),

    block("trust", { title: "Ücretsiz Kargo", subtitle: "1000 TL ve Üzeri Alışverişlerde", icon: "truck" }, 0),
    block("trust", { title: "Faturalı Ürün", subtitle: "Garanti Kapsamında", icon: "badge" }, 1),
    block("trust", { title: "Güvenli Alışveriş", subtitle: "256Bit SSL Koruması", icon: "lock" }, 2),
    block("trust", { title: "Kolay İade", subtitle: "14 İş Günü İçinde", icon: "refresh" }, 3),
  ]);

  logger.info("Vitrin: seeded 4 product lists and the homepage content blocks.");
}
