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
      eyebrow: "SEENERGY Güvenlik Teknolojileri",
      title: "Güvenlik Teknolojileri",
      description: "CCTV, kayıt, network, alarm ve geçiş kontrol ürünleri tek çatıda.",
      chips: ["CCTV ve kayıt", "Network ve PoE", "Alarm ve geçiş kontrol"],
      cta: "Kategorileri Gör",
      href: "/kategori",
      image: "/hero/seenergy-cctv.webp",
      fit: "contain",
    }, 0),
    block("hero-slide", {
      eyebrow: "Seslendirme sistemleri",
      title: "Profesyonel Ses",
      description: "Sahne ve mekân seslendirmesinde toptan fiyat avantajı.",
      chips: ["Anfi ve mikser", "Tavan ve kolon hoparlör", "Toptan fiyat"],
      cta: "Ürünleri İncele",
      href: "/kategori/seslendirme-sistemleri",
      image: "/mock/hero/hero-2.svg",
      // Wide campaign art: fills the stage (a product shot would use "contain").
      fit: "cover",
    }, 1),
    block("hero-slide", {
      eyebrow: "Network ürünleri",
      title: "Network ve PoE Çözümleri",
      description: "IP kamera sistemleri için PoE switch, ethernet switch, access point ve router.",
      chips: ["PoE Switch", "Ethernet Switch", "Access Point / Router"],
      cta: "Ürünleri İncele",
      href: "/kategori/network-urunleri",
      image: "/mock/products/cutout/router-white.svg",
      fit: "contain",
    }, 2),

    // Campaign cards: a brand tone and a product (see vitrin-upgrade-campaign-cards.ts).
    block("hero-side", { eyebrow: "Kampanya", title: "Süper Fırsat Ürünleri", href: "/kampanyalar", tone: "mor", product_image: "/mock/products/cutout/speaker-white.svg" }, 0, "hero-side-1"),
    block("hero-side", { eyebrow: "Kurumsal", title: "Toptan alım ve bayilik", href: "/toptan-satis", tone: "turkuaz", product_image: "/mock/products/cutout/nvr-white.svg" }, 1, "hero-side-2"),

    block("banner", {
      eyebrow: "CCTV güvenlik sistemleri",
      title: "AHD ve IP kamera sistemleri",
      subtitle: "Kamera, kayıt cihazı ve aksesuarlar; projeler için kurumsal teklif.",
      href: "/kategori/cctv-guvenlik-sistemleri",
      tone: "koyu",
      product_image: "/mock/products/cutout/dome-white.svg",
    }, 0, "wide"),
    block("banner", { eyebrow: "Kendi markalarımız", title: "Tescilli Markalarımız", href: "/markalar", tone: "acik", product_image: "/mock/products/cutout/receiver-white.svg" }, 1, "dual-1"),
    block("banner", { eyebrow: "Yetkili satıcılık", title: "Resmi Yetkili Satıcısı Olduğumuz Markalar", href: "/markalar", tone: "turkuaz", product_image: "/mock/products/cutout/camera-white.svg" }, 2, "dual-2"),
    block("banner", { title: "Süper Fırsat", subtitle: "Ürünleri", href: "/kampanyalar", tone: "mor", product_image: "/mock/products/cutout/dish-white.svg" }, 3, "super-firsat-promo"),

    ...[
      ["tekniva", "All in one bilgisayarlar ve monitörler"],
      ["orbisat", "Uydu alıcıları ve santral sistemleri"],
      ["sonora", "Profesyonel ses ve sahne sistemleri"],
      ["provista", "Güvenlik kameraları ve kayıt cihazları"],
      ["ledora", "Televizyon led bar ve panel yedek parçaları"],
      ["voltra", "Oto ses, multimedya ve görüntü sistemleri"],
      ["kumandax", "Televizyon, uydu ve klima kumandaları"],
    ].map(([handle, tagline], i) =>
      block("brand-band", { brand_handle: handle, tagline, banner: "", logo: `/mock/brands/${handle}.svg`, product_ids: [] }, i)
    ),

    block("tech-band", {
      eyebrow: "Neden SEENERGY",
      title: "Güvenlik altyapısında tedarik, tek adresten",
      description:
        "CCTV ve kayıt sistemlerinden network, alarm, yangın algılama ve geçiş kontrolüne, uydu ve seslendirme sistemlerine kadar güvenlik altyapısının ürünleri; hem son kullanıcıya hem kurumsal alıcıya aynı stok derinliğiyle.",
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
