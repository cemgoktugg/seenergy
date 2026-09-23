/**
 * Mock catalogue.
 *
 * Product names, brands and SKUs are invented for this project. They are not
 * copied from the reference site — only the *shape* of the data a commercial
 * electronics storefront needs is reproduced.
 *
 * Rating fields are explicitly mock and are never emitted as structured data.
 */

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  stock: number;
  freeShipping: boolean;
  instalment: boolean;
  badge?: 'super-firsat' | 'yeni' | 'cok-satan';
  /** Mock only — never rendered into JSON-LD. */
  ratingMock: number;
  reviewCountMock: number;
}

const P = 'https://placeholder.invalid'; // never used; kept out of the bundle
void P;

type Seed = [
  brand: string,
  name: string,
  category: string,
  image: string,
  price: number,
  discountPct: number,
  stock: number,
];

/**
 * A fixed seed list — no Math.random anywhere, so every render and every
 * screenshot is byte-identical. Deterministic data is what makes visual
 * regression meaningful.
 */
const SEEDS: Seed[] = [
  ['Orbisat', 'Orbisat OR-9500 4K Ultra HD Uydu Alıcısı Wi-Fi Destekli', 'uydu', 'receiver-graphite', 2849.9, 12, 24],
  ['Orbisat', 'Orbisat OR-7200 Full HD Mini Uydu Alıcısı USB Kayıt', 'uydu', 'receiver-black', 1249.5, 0, 41],
  ['Antenix', 'Antenix AX-4400 Kaskatlı Uydu Santrali 4 Çıkışlı', 'uydu', 'receiver-silver', 6480, 8, 6],
  ['Antenix', 'Antenix AX-120 Single LNB 0.1dB Gürültü Seviyesi', 'uydu', 'receiver-white', 389.9, 0, 120],
  ['Kumandax', 'Kumandax KX-500 Universal Uydu Alıcı Kumandası', 'kumanda', 'remote-black', 189.9, 15, 88],
  ['Kumandax', 'Kumandax KX-780 Akıllı TV Kumandası Sesli Komut', 'kumanda', 'remote-graphite', 449.9, 0, 33],
  ['Kumandax', 'Kumandax KX-210 Klima Kumandası Çok Markalı', 'kumanda', 'acremote-white', 149.5, 20, 64],
  ['Vizyontek', 'Vizyontek VT-330 Android TV Box Kumanda Seti', 'kumanda', 'remote-white', 279, 0, 17],
  ['Sonora', 'Sonora SN-1500 15" 1000W Aktif Kabin Hoparlör', 'ses', 'speaker-black', 14980, 9, 4],
  ['Sonora', 'Sonora SN-820 Bluetooth Taşınabilir Hoparlör 60W', 'ses', 'speaker-graphite', 2190, 18, 29],
  ['Sesyapı', 'Sesyapı SY-40 Tavan Hoparlörü 6" 40W Beyaz', 'ses', 'speaker-white', 649.9, 0, 74],
  ['Sesyapı', 'Sesyapı SY-2400 Anfi ve Mikser 240W 4 Kanal', 'ses', 'speaker-silver', 8450, 6, 9],
  ['Fotokam', 'Fotokam FK-8200 5MP AHD Bullet Güvenlik Kamerası', 'guvenlik', 'camera-white', 1349.9, 14, 52],
  ['Fotokam', 'Fotokam FK-360 Wi-Fi İç Mekan Kamera 360° Hareketli', 'guvenlik', 'camera-graphite', 989, 0, 38],
  ['Provista', 'Provista PV-16 16 Kanal AHD Kayıt Cihazı 5MP', 'guvenlik', 'nvr-black', 5490, 10, 7],
  ['Provista', 'Provista PV-KIT4 4 Kameralı Güvenlik Seti Harddisk Dahil', 'guvenlik', 'camera-silver', 12750, 16, 3],
  ['Ledora', 'Ledora LD-3228 32" Televizyon Led Bar Takımı', 'led', 'ledbar-silver', 549.9, 0, 96],
  ['Ledora', 'Ledora LD-5540 55" Televizyon Led Bar Takımı 4K Panel', 'led', 'ledbar-white', 1290, 11, 22],
  ['Lumenta', 'Lumenta LM-5050 Şerit Led 5 Metre RGB Kumandalı', 'led', 'ledbar-graphite', 389.9, 25, 140],
  ['Lumenta', 'Lumenta LM-P10 P10 Led Panel Kontrol Kartı', 'led', 'ledbar-black', 1875, 0, 12],
  ['Powerin', 'Powerin PW-1220 12V 2A Adaptör Fişli Güç Kaynağı', 'adaptor', 'adapter-black', 249.9, 0, 210],
  ['Powerin', 'Powerin PW-19653 19V 6.53A Notebook Adaptörü', 'adaptor', 'adapter-graphite', 689.9, 12, 45],
  ['Bataryam', 'Bataryam BT-100 12V 100Ah Jel Akü Derin Döngü', 'adaptor', 'battery-silver', 9850, 7, 5],
  ['Bataryam', 'Bataryam BT-18650 Şarj Edilebilir Li-ion Pil 6lı Set', 'adaptor', 'battery-white', 429.9, 20, 68],
  ['Voltra', 'Voltra VT-7010 Oto Teyp Bluetooth USB 4x60W', 'oto', 'headunit-black', 1890, 15, 31],
  ['Voltra', 'Voltra VT-9200 7" Dokunmatik Oto Multimedya CarPlay', 'oto', 'headunit-graphite', 6490, 10, 11],
  ['Voltra', 'Voltra VT-CAM1 Araç İçi Kayıt Kamerası Full HD', 'oto', 'camera-black', 1450, 0, 27],
  ['Sinyalis', 'Sinyalis SG-40 Oto Anfi 4 Kanal 800W', 'oto', 'headunit-white', 3290, 18, 8],
  ['Nexora', 'Nexora NX-AC1200 Dual Band Access Point Router', 'oem', 'router-white', 1590, 0, 36],
  ['Nexora', 'Nexora NX-300 ADSL Modem 4 Port Wi-Fi N300', 'oem', 'router-graphite', 749.9, 22, 54],
  ['Digiwave', 'Digiwave DW-POE8 8 Port PoE Switch Gigabit', 'oem', 'router-black', 2890, 0, 14],
  ['Digiwave', 'Digiwave DW-EXT Menzil Genişletici Wi-Fi 6', 'oem', 'router-silver', 899, 13, 40],
  ['Metrion', 'Metrion MT-890 Dijital Multimetre True RMS', 'olcum', 'meter-graphite', 1249.9, 0, 19],
  ['Metrion', 'Metrion MT-330 Pens Ampermetre AC/DC 600A', 'olcum', 'meter-black', 1890, 9, 13],
  ['Devrelab', 'Devrelab DL-858 Sıcak Hava Havya İstasyonu 700W', 'olcum', 'meter-silver', 3450, 14, 6],
  ['Devrelab', 'Devrelab DL-PSU30 Ayarlı Güç Kaynağı 30V 5A', 'olcum', 'meter-white', 4290, 0, 4],
  ['Cabletek', 'Cabletek CT-RG6 RG6 U6 Anten Kablosu 100 Metre', 'kablo', 'cable-black', 1890, 0, 58],
  ['Cabletek', 'Cabletek CT-HDMI21 HDMI 2.1 Kablo 8K 3 Metre', 'kablo', 'cable-graphite', 389.9, 25, 132],
  ['Kablonis', 'Kablonis KB-CAT6 Cat6 UTP Ağ Kablosu 305m Makara', 'kablo', 'cable-silver', 4950, 8, 9],
  ['Kablonis', 'Kablonis KB-ALARM 6x0.22 Alarm Kablosu 100 Metre', 'kablo', 'cable-white', 749, 0, 47],
  ['Tekniva', 'Tekniva TK-27AIO 27" All In One Bilgisayar i7 16GB 512GB', 'bilgisayar', 'aio-white', 29927.45, 6, 3],
  ['Tekniva', 'Tekniva TK-24AIO 24" All In One Bilgisayar i5 8GB 256GB', 'bilgisayar', 'aio-silver', 19174.92, 0, 5],
  ['Tekniva', 'Tekniva TK-22MON 22" Full HD Monitör IPS 100Hz', 'bilgisayar', 'monitor-graphite', 4890, 12, 21],
  ['Optivolt', 'Optivolt OV-32SM 32" Smart Led TV HD Wi-Fi', 'bilgisayar', 'monitor-black', 8990, 15, 10],
  ['Tamirix', 'Tamirix TX-120 Elektronik Tamir Seti 120 Parça', 'hirdavat', 'meter-graphite', 1290, 20, 34],
  ['Tamirix', 'Tamirix TX-LED Fener ve Işıldak Şarjlı 1200 Lümen', 'hirdavat', 'adapter-silver', 549.9, 0, 62],
  ['Servisan', 'Servisan SV-ABS ABS Plastik Kutu Seti 10 Adet', 'hirdavat', 'adapter-white', 289.9, 0, 88],
  ['Megavolt', 'Megavolt MV-INV2000 İnvertör 12V 2000W Modifiye Sinüs', 'hirdavat', 'adapter-graphite', 4750, 11, 7],

  /* Depth for the seven brand showcases on the homepage.
     Each of those bands shows four products from one brand, and the original
     seed list gave most brands only two or three — these top every featured
     brand up to four. Appended rather than interleaved on purpose: ids, slugs
     and badges are derived from the seed index, so inserting in the middle
     would silently renumber every product after the insertion point. */
  ['Orbisat', 'Orbisat OR-3100 HD Uydu Alıcısı Ethernet Portlu', 'uydu', 'receiver-silver', 1699.9, 10, 33],
  ['Orbisat', 'Orbisat OR-90 90cm Ofset Çanak Anten Seti LNB Dahil', 'uydu', 'dish-white', 1290, 0, 29],
  ['Kumandax', 'Kumandax KX-900 Öğrenmeli Universal Kumanda 8 Cihaz', 'kumanda', 'remote-white', 329.9, 12, 57],
  ['Sonora', 'Sonora SN-300 Kolon Hoparlör 120W Çift Yönlü', 'ses', 'column-white', 3890, 10, 15],
  ['Sonora', 'Sonora SN-950 Aktif Kabin Hoparlör 12" 600W', 'ses', 'speaker-silver', 4250, 0, 12],
  ['Provista', 'Provista PV-8 8 Kanal NVR IP Kayıt Cihazı 4K', 'guvenlik', 'nvr-white', 4290, 12, 16],
  ['Provista', 'Provista PV-DOME3 3MP IP Dome Kamera Gece Görüşlü', 'guvenlik', 'dome-graphite', 1690, 0, 44],
  ['Ledora', 'Ledora LD-4332 43" Televizyon Led Bar Takımı', 'led', 'ledbar-graphite', 749.9, 10, 48],
  ['Ledora', 'Ledora LD-TEST Led Bar Test Cihazı 0-300V Dokunmatik', 'led', 'meter-white', 2450, 0, 18],
  ['Voltra', 'Voltra VT-6100 Oto Multimedya Ekranı 9" Android', 'oto', 'headunit-white', 2190, 15, 26],
  ['Tekniva', 'Tekniva TK-32AIO 32" All In One Bilgisayar i9 32GB 1TB', 'bilgisayar', 'aio-black', 41250, 8, 2],
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const PRODUCTS: Product[] = SEEDS.map(
  ([brand, name, category, image, price, discountPct, stock], index) => {
    const compareAtPrice =
      discountPct > 0 ? Math.round((price / (1 - discountPct / 100)) * 100) / 100 : undefined;
    return {
      id: `p-${String(index + 1).padStart(3, '0')}`,
      slug: slugify(name),
      brand,
      name,
      sku: `${brand.slice(0, 3).toUpperCase()}-${1000 + index * 7}`,
      category,
      price,
      compareAtPrice,
      image: `/mock/products/${image}.svg`,
      stock,
      freeShipping: price >= 1000,
      instalment: price >= 500,
      badge:
        discountPct >= 18 ? 'super-firsat' : index % 9 === 0 ? 'yeni' : index % 7 === 0 ? 'cok-satan' : undefined,
      // Deterministic pseudo-values, clearly labelled as mock.
      ratingMock: 3.6 + ((index * 13) % 14) / 10,
      reviewCountMock: 4 + ((index * 17) % 180),
    };
  },
);

/**
 * Category keys carry a Turkish label and a route, so a breadcrumb and a spec
 * row never have to re-derive either from the key.
 */
export const CATEGORY_META: Record<string, { label: string; href: string }> = {
  uydu: { label: 'Uydu Sistemleri', href: '/kategori/uydu-sistemleri' },
  kumanda: { label: 'Kumanda Çeşitleri', href: '/kategori/kumanda-cesitleri' },
  ses: { label: 'Seslendirme Sistemleri', href: '/kategori/seslendirme-sistemleri' },
  guvenlik: { label: 'Güvenlik Sistemleri', href: '/kategori/guvenlik-sistemleri' },
  led: { label: 'Led ve Aydınlatma', href: '/kategori/led-aydinlatma' },
  adaptor: { label: 'Adaptör, Akü, Pil', href: '/kategori/adaptor-aku-pil' },
  oto: { label: 'Oto Ses ve Görüntü', href: '/kategori/oto-ses-goruntu' },
  oem: { label: 'Oem ve Çevre Birimleri', href: '/kategori/oem-cevre-birimleri' },
  olcum: { label: 'Ölçü Aletleri', href: '/kategori/olcu-aletleri' },
  kablo: { label: 'Kablo Çeşitleri', href: '/kategori/kablo-cesitleri' },
  bilgisayar: { label: 'Bilgisayar ve Monitör', href: '/kategori/bilgisayar' },
  hirdavat: { label: 'Hırdavat ve Tamir Malzemeleri', href: '/kategori/hirdavat-tamir' },
};

export const categoryMeta = (category: string) =>
  CATEGORY_META[category] ?? { label: 'Tüm Ürünler', href: '/kategori' };

/**
 * One brand → one slug, everywhere. The product slugifier is reused rather than
 * a second lowercase-and-strip rule, so `Sesyapı` resolves to `sesyapi` in a
 * link, a filter and a route alike instead of three different spellings.
 */
export const brandSlug = (brand: string): string => slugify(brand);

export const brandFromSlug = (slug: string): string | undefined =>
  PRODUCTS.find((product) => brandSlug(product.brand) === slug)?.brand;

export const byBrandSlug = (slug: string): Product[] =>
  PRODUCTS.filter((product) => brandSlug(product.brand) === slug);

/** Lookup by id — what the cart, favourites and compare lists store. */
export const byId = (id: string): Product | undefined =>
  PRODUCTS.find((product) => product.id === id);

export const bySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((product) => product.slug === slug);

/**
 * The other models of the same brand — the product page's most important rail.
 * Excludes the product being viewed, keeps seed order, and falls back to an
 * empty list rather than padding with other brands: "diğer modeller" has to
 * mean what it says.
 */
export const otherModelsOf = (product: Product, count = 8): Product[] =>
  PRODUCTS.filter((item) => item.brand === product.brand && item.id !== product.id).slice(
    0,
    count,
  );

/** Same category, different brand — the secondary rail. */
export const alternativesTo = (product: Product, count = 5): Product[] =>
  PRODUCTS.filter(
    (item) => item.category === product.category && item.brand !== product.brand,
  ).slice(0, count);

/**
 * Discount percentage is DERIVED, never authored (docs/COMMERCE_RULES §5), so
 * it can never disagree with the two prices printed beside it.
 */
export const discountPercent = (product: Product): number | null =>
  product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

export const byCategory = (category: string): Product[] =>
  PRODUCTS.filter((product) => product.category === category);

export const takeFrom = (category: string, count: number): Product[] =>
  byCategory(category).slice(0, count);

/** Products of one brand, in seed order — what the brand showcases render. */
export const byBrand = (brand: string, count?: number): Product[] => {
  const list = PRODUCTS.filter((product) => product.brand === brand);
  return count === undefined ? list : list.slice(0, count);
};

/** Deterministic "mixed" selection used by the multi-category rails. */
export const mixed = (offset: number, count: number): Product[] => {
  const out: Product[] = [];
  for (let i = 0; i < count; i += 1) {
    out.push(PRODUCTS[(offset + i * 5) % PRODUCTS.length]);
  }
  return out;
};

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(value);
