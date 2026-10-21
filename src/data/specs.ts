/**
 * Product specifications.
 *
 * Two sources, deliberately separated:
 *
 *   1. `keySpecsOf()` DERIVES the 3-6 headline specs from the product's own
 *      name. The catalogue's names already carry real values — "16 Kanal",
 *      "5MP", "12V 2A", "27\"", "100 Metre" — so the headline specs vary per
 *      product without a single invented figure.
 *
 *   2. `CATEGORY_SPECS` carries the grouped spec table and the compatibility
 *      list, authored per category. These are realistic-but-invented, which is
 *      what docs/PRODUCT_MODEL §mock-data asks for: specs shaped like the real
 *      sector so the layout is stress-tested by real string lengths. They state
 *      technical standards (IP66, DiSEqC, RG6) and never a certification.
 *
 * Ratings and reviews appear nowhere, by rule.
 */

import { CATEGORY_META, type Product } from '@/data/catalog';

export interface SpecRow {
  label: string;
  value: string;
  note?: string;
}

export interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

export interface CompatibilityItem {
  label: string;
  values: string[];
  note?: string;
}

export interface CategorySpec {
  groups: SpecGroup[];
  compatibility: CompatibilityItem[];
}

/* ------------------------------------------------------------------ */
/* 1. Headline specs, read out of the product name                     */
/* ------------------------------------------------------------------ */

/**
 * Ordered on purpose: the first match for a label wins, so "i7 16GB 512GB"
 * reports 16 GB rather than both, and a name that mentions both Wi-Fi and
 * Bluetooth reports the first one it states.
 */
const NAME_PATTERNS: {
  re: RegExp;
  label: string;
  format: (match: RegExpMatchArray) => string;
  /**
   * Labels this pattern makes redundant once it matches. Deduping by label
   * alone is not enough: two patterns can report the same fact under different
   * names, which is how one product ended up listing both
   * "Bellek / depolama: 16 GB / 512 GB" and "Bellek: 16 GB".
   */
  blocks?: string[];
}[] = [
  { re: /(\d+)\s*Kanal/i, label: 'Kanal sayısı', format: (m) => `${m[1]} kanal` },
  { re: /(\d+)\s*MP\b/i, label: 'Çözünürlük', format: (m) => `${m[1]} MP` },
  { re: /\b(4K Ultra HD|4K|Full HD|HD)\b/, label: 'Görüntü', format: (m) => m[1] },
  { re: /(\d+)"/, label: 'Ekran boyutu', format: (m) => `${m[1]}"` },
  { re: /(\d+)\s*Hz\b/i, label: 'Yenileme hızı', format: (m) => `${m[1]} Hz` },
  { re: /\b(i[3579])\b/, label: 'İşlemci', format: (m) => m[1] },
  // Two capacities in one name are memory AND storage — reported together,
  // because reporting only the first loses the more interesting half.
  {
    re: /(\d+)\s*GB\b[^0-9]{0,12}(\d+)\s*(GB|TB)\b/i,
    label: 'Bellek / depolama',
    format: (m) => `${m[1]} GB / ${m[2]} ${m[3].toUpperCase()}`,
    blocks: ['Bellek', 'Depolama'],
  },
  { re: /(\d+(?:[.,]\d+)?)\s*V\b/, label: 'Çalışma gerilimi', format: (m) => `${m[1]} V` },
  { re: /(\d+(?:[.,]\d+)?)\s*A\b(?!h)/, label: 'Akım', format: (m) => `${m[1]} A` },
  { re: /(\d+)\s*Ah\b/i, label: 'Kapasite', format: (m) => `${m[1]} Ah` },
  { re: /(\d+)\s*x\s*(\d+)\s*W\b/i, label: 'Çıkış gücü', format: (m) => `${m[1]} × ${m[2]} W` },
  { re: /(\d+)\s*W\b/i, label: 'Güç', format: (m) => `${m[1]} W` },
  { re: /(\d+)\s*GB\b/i, label: 'Bellek', format: (m) => `${m[1]} GB` },
  { re: /(\d+)\s*TB\b/i, label: 'Depolama', format: (m) => `${m[1]} TB` },
  { re: /\bIP(\d{2})\b/, label: 'Koruma sınıfı', format: (m) => `IP${m[1]}` },
  { re: /(\d+)\s*Port\b/i, label: 'Port sayısı', format: (m) => `${m[1]} port` },
  { re: /(\d+)\s*Metre\b/i, label: 'Uzunluk', format: (m) => `${m[1]} m` },
  { re: /(\d+)\s*Lümen\b/i, label: 'Işık akısı', format: (m) => `${m[1]} lümen` },
  { re: /(\d+)\s*Cihaz\b/i, label: 'Desteklenen cihaz', format: (m) => `${m[1]} cihaz` },
  { re: /(\d+)\s*Parça\b/i, label: 'Parça sayısı', format: (m) => `${m[1]} parça` },
  { re: /(\d+)\s*(?:lı|li|lu|lü)\s*Set\b/i, label: 'Paket içeriği', format: (m) => `${m[1]} adet` },
  { re: /(Öğrenmeli|Universal|Çok Markalı|Sesli Komut)/i, label: 'Kullanım', format: (m) => m[1] },
  { re: /(Gigabit|Dual Band|Wi-?Fi 6|PoE)/i, label: 'Ağ', format: (m) => m[1] },
  { re: /(Bluetooth|Wi-?Fi|Ethernet)/i, label: 'Bağlantı', format: (m) => m[1] },
  { re: /(Şarjlı|Kablosuz)/i, label: 'Besleme', format: (m) => m[1] },
];

/**
 * Headline specs, 3-4 of them.
 *
 * Read from the product's own name first, because that is per-product and
 * invented by nobody. Names that carry no figure at all — a remote control, a
 * plastic box — would otherwise show an empty strip, so those top up from the
 * category sheet's "Genel" rows, which are category-true statements written for
 * exactly this purpose.
 */
export function keySpecsOf(product: Product, max = 4, own: SpecGroup[] = []): SpecRow[] {
  /* The product's own sheet, when it has one, says it best: its "Genel"
     group is written to lead with the headline values (the CCTV range's
     datasheets: type, resolution, lens, night range). */
  const general = own.find((group) => group.title.trim().toLocaleLowerCase('tr') === 'genel');
  if (general && general.rows.length > 0) return general.rows.slice(0, max);

  const out: SpecRow[] = [];
  const used = new Set<string>();

  for (const pattern of NAME_PATTERNS) {
    if (out.length >= max) break;
    if (used.has(pattern.label)) continue;
    const match = product.name.match(pattern.re);
    if (!match) continue;
    used.add(pattern.label);
    for (const blocked of pattern.blocks ?? []) used.add(blocked);
    out.push({ label: pattern.label, value: pattern.format(match) });
  }

  /* No top-up for a product still on price-on-request: that is a model whose
     data has not been entered yet (the client's CCTV range arrived as model
     codes only), and the buy box would state the category's guess — "8 kanal
     IP kamera ve NVR kiti" on an AHD camera — as this product's fact. The
     full sheet further down still shows the template, labelled as typical. */
  if (out.length < 3 && product.price != null) {
    const general = categorySpec(product.category)?.groups.find(
      (group) => group.title === 'Genel',
    );
    for (const row of general?.rows ?? []) {
      if (out.length >= max) break;
      if (used.has(row.label)) continue;
      /* A sheet row that restates a value already on the strip is noise:
         "Parça sayısı: 120 parça" beside "Set içeriği: 120 parça · 62 bit ucu"
         reports one fact twice. Deduping by label cannot catch this — the
         derived label and the sheet's label differ by design — so the value is
         compared too, in both directions, because one usually contains the
         other rather than matching it exactly. */
      const restated = out.some(
        (shown) => row.value.includes(shown.value) || shown.value.includes(row.value),
      );
      if (restated) continue;
      used.add(row.label);
      out.push(row);
    }
  }

  return out;
}

/* ------------------------------------------------------------------ */
/* 2. Category spec sheets                                             */
/* ------------------------------------------------------------------ */

export const CATEGORY_SPECS: Record<string, CategorySpec> = {
  uydu: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "Uydu alıcı, LNB ve merkezi sistem" },
        { label: "Alıcı tipi", value: "DVB-S2 · QPSK / 8PSK demodülasyon" },
        { label: "Sembol oranı", value: "2 – 45 MS/s" },
        { label: "Video çıkışı", value: "HDMI 2.0 · 3840 × 2160 px · H.265" },
        { label: "Kanal hafızası", value: "6.000 kanal · 100 uydu" },
        { label: "Kayıt", value: "USB 2.0 üzerinden harici diske PVR" },
        ],
      },
      {
        title: "Sinyal ve alım",
        rows: [
        { label: "Giriş frekansı", value: "950 – 2150 MHz" },
        { label: "LNB gürültü katsayısı", value: "0,2 dB tipik · 0,3 dB en çok" },
        { label: "Dönüşüm kazancı", value: "60 dB" },
        { label: "Yerel osilatör", value: "9750 / 10600 MHz · Universal Ku bant" },
        { label: "Anahtarlama", value: "DiSEqC 1.0 / 1.1 / 1.2 · USALS · 22 kHz" },
        { label: "LNB beslemesi", value: "13 / 18 V · 400 mA", note: "Merkezi sistemde besleme multiswitch üzerinden verilir." },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Reflektör ölçüsü", value: "90 cm ofset · galvanizli çelik" },
        { label: "Direk bağlantısı", value: "Ø 50 mm boru boğazı" },
        { label: "Besleme", value: "12 V / 1,5 A harici adaptör" },
        { label: "Bekleme tüketimi", value: "En çok 1 W" },
        { label: "Çalışma sıcaklığı", value: "Alıcı 0 / +45 °C" },
        { label: "Dış ünite sıcaklığı", value: "-30 / +60 °C · anten ve LNB" },
        ],
      },
    ],
    compatibility: [
      { label: "Desteklenen uydu sistemleri", values: ["Tekli LNB", "Çiftli / dörtlü çıkışlı LNB", "Merkezi multiswitch sistemi", "Motorlu sistem · DiSEqC 1.2"] },
      { label: "Uyumlu kablo ve konnektörler", values: ["RG6 U6 koaksiyel", "RG11 ana hat", "F konnektör · 7 mm"] },
      { label: "Uyumlu televizyon girişleri", values: ["HDMI girişli televizyon", "HDMI girişli projeksiyon cihazı"] },
      { label: "Kayıt ortamı", values: ["exFAT / NTFS USB bellek", "2,5 inç harici disk · en çok 1 TB"] },
    ],
  },

  kumanda: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "Öğrenmeli üniversal kumanda" },
        { label: "Sinyal tipi", value: "Kızılötesi (IR) · 30 – 60 kHz taşıyıcı" },
        { label: "Kablosuz bağlantı", value: "Bluetooth 5.0 LE · dahili mikrofon" },
        { label: "Menzil", value: "8 m · ±30° yayılım açısı" },
        { label: "Tuş takımı", value: "45 tuş · silikon membran" },
        { label: "Tuş ömrü", value: "200.000 basma" },
        ],
      },
      {
        title: "Kod ve öğrenme",
        rows: [
        { label: "Kod kütüphanesi", value: "4.800 cihaz kodu" },
        { label: "Öğrenme kapasitesi", value: "8 cihaz · tuş başına IR kopyalama", note: "Öğretilen tuşlar kod kütüphanesinden bağımsız çalışır." },
        { label: "Taşıyıcı kopyalama", value: "Öğrenmede kaynak taşıyıcı korunur" },
        { label: "Kurulum", value: "Otomatik kod tarama · marka kodu girişi" },
        { label: "Makro", value: "4 adımlı tek tuş makro" },
        { label: "Kalıcı hafıza", value: "EEPROM · pilsiz 10 yıl veri saklama" },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Besleme", value: "2 × AAA alkalin · 1,5 V" },
        { label: "Pil ömrü", value: "Tipik 6 ay (günde 50 basma)", note: "Günde 10 sesli komutla ölçülen tipik değerdir." },
        { label: "Ölçüler", value: "175 × 48 × 21 mm" },
        { label: "Ağırlık", value: "78 g · pilsiz" },
        { label: "Gövde", value: "ABS · mat dokulu kaplama" },
        { label: "Çalışma sıcaklığı", value: "-10 / +50 °C" },
        ],
      },
    ],
    compatibility: [
      { label: "Uyumlu cihaz tipleri", values: ["LED / LCD televizyon", "Uydu alıcı ve set üstü kutu", "Akıllı TV / medya kutusu", "Split klima iç ünitesi"] },
      { label: "Kopyalanabilir IR sinyalleri", values: ["36 kHz IR kumandalar", "38 kHz IR kumandalar", "56 kHz IR kumandalar"] },
      { label: "Desteklenen pil tipleri", values: ["AAA / LR03 alkalin", "AAA Ni-MH şarjlı · 1,2 V"] },
      { label: "Sesli komut bağlantısı", values: ["Bluetooth 5.0 eşleşmeli televizyon", "Bluetooth 5.0 eşleşmeli medya kutusu"] },
    ],
  },

  oem: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "Yönlendirici, erişim noktası, anahtar" },
        { label: "Kablosuz standart", value: "IEEE 802.11 a/b/g/n/ac · Wi-Fi 5" },
        { label: "Bant hızı", value: "2,4 GHz 300 Mbit/s · 5 GHz 867 Mbit/s" },
        { label: "Anten", value: "4 × 5 dBi çift bant · 2 × 2 MIMO" },
        { label: "İşlemci ve bellek", value: "880 MHz çift çekirdek · 128 MB DDR3" },
        { label: "Eşzamanlı istemci", value: "64 cihaz" },
        ],
      },
      {
        title: "Ağ ve kablosuz",
        rows: [
        { label: "Ethernet bağlantıları", value: "8 × 10/100/1000 Mbit/s RJ45" },
        { label: "WAN girişi", value: "1 × Gigabit WAN · RJ11 VDSL2 / ADSL2+" },
        { label: "PoE beslemesi", value: "IEEE 802.3af/at · port başına 30 W", note: "Toplam PoE bütçesi 8 portta 120 W ile sınırlıdır." },
        { label: "Anahtarlama kapasitesi", value: "16 Gbit/s" },
        { label: "Kablosuz güvenlik", value: "WPA2 / WPA3-Personal · AES" },
        { label: "Çalışma modları", value: "Yönlendirici · erişim noktası · köprü" },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Besleme", value: "12 V / 2 A · PoE anahtarda 54 V / 2,78 A" },
        { label: "Tüketim", value: "En çok 18 W (PoE yükü hariç)" },
        { label: "PoE dahil tüketim", value: "En çok 138 W" },
        { label: "Ölçüler", value: "230 × 144 × 35 mm" },
        { label: "Soğutma", value: "Yönlendiricide pasif · anahtarda fanlı" },
        { label: "Çalışma sıcaklığı", value: "-5 / +45 °C" },
        ],
      },
    ],
    compatibility: [
      { label: "Desteklenen bağlantı tipleri", values: ["VDSL2 / ADSL2+", "Fiber · PPPoE", "Statik IP / DHCP"] },
      { label: "PoE ile beslenen cihazlar", values: ["IP kamera · en çok 30 W", "IP telefon", "Kablosuz erişim noktası"] },
      { label: "Uyumlu kablolama", values: ["Cat5e U/UTP", "Cat6 U/UTP · en çok 100 m", "RJ45 8P8C konnektör"] },
      { label: "Yönetim arayüzü", values: ["Web tarayıcı · HTTPS", "SSH komut satırı", "Bulut yönetim hesabı"] },
    ],
  },

  ses: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "Aktif kabin · 2 yollu bas refleks" },
        { label: "Sürücü yapısı", value: "15″ woofer · 1″ kompresyon tweeter" },
        { label: "Amfi çıkış gücü", value: "300 W RMS · 600 W tepe · D sınıfı", note: "Tepe değer 10 ms darbe içindir." },
        { label: "Girişler", value: "2 × XLR/TRS kombo · 1 × çift RCA" },
        { label: "Kablosuz giriş", value: "Bluetooth 5.3 · A2DP · TWS eşleme" },
        { label: "Hat çıkışı", value: "1 × XLR link out · analog geçiş", note: "DSP gecikmesi 1,2 ms'dir; zincirlemede birikmez." },
        ],
      },
      {
        title: "Ses",
        rows: [
        { label: "Frekans aralığı", value: "45 Hz – 20 kHz (±3 dB)" },
        { label: "Duyarlılık", value: "97 dB · 1 W / 1 m" },
        { label: "En çok ses basıncı", value: "124 dB SPL (1 m · tepe)", note: "97 dB duyarlılık ve 600 W tepe güçten gelir." },
        { label: "Kapsama açısı", value: "90° × 60° (yatay × dikey)" },
        { label: "Ayırıcı filtre", value: "Aktif · 2,2 kHz · 24 dB/oktav" },
        { label: "Kanal işleme", value: "4 bant ekolayzer · limitör", note: "Geri besleme bastırma devresi bulunur." },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Kabin", value: "15 mm kontrplak · poliüretan kaplama" },
        { label: "Ölçüler", value: "720 × 460 × 410 mm (Y × G × D)" },
        { label: "Kabin ağırlığı", value: "26,5 kg" },
        { label: "Montaj", value: "35 mm tripod yuvası · 4 × M10 askı" },
        { label: "Besleme", value: "220 – 240 V AC · 50/60 Hz · 380 W" },
        { label: "Çalışma sıcaklığı", value: "0 / +35 °C", note: "Güç katı zorlanmış hava ile soğutulur." },
        ],
      },
    ],
    compatibility: [
      { label: "Desteklenen kaynak cihazları", values: ["Mikser masası (hat seviyesi)", "Kablosuz mikrofon alıcısı", "Ses kartı · dizüstü bilgisayar", "Bluetooth 5.3 telefon"] },
      { label: "Uyumlu konnektör tipleri", values: ["XLR 3 pin dişi", "6,35 mm TRS jak", "RCA çift", "3,5 mm stereo (adaptörle)"] },
      { label: "Sistem genişletme", values: ["İkinci aktif kabin · XLR link out", "Aktif subwoofer üzerinden hat geçişi", "İki kabinde TWS kablosuz eşleme"] },
      { label: "Montaj uyumluluğu", values: ["35 mm hoparlör tripodu", "M10 askı aparatı", "Duvar U braketi", "45° yatık monitör kullanımı"] },
    ],
  },

  oto: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "2-DIN dokunmatik oto multimedya" },
        { label: "Ekran", value: "9″ IPS dokunmatik · 1280 × 720 px" },
        { label: "Sistem", value: "8 çekirdek · 2 GB RAM · 32 GB depolama" },
        { label: "Kanal başına çıkış gücü", value: "4 × 50 W (en çok) · 4 × 22 W RMS", note: "RMS değer 4 Ω yükte, %10 THD ile ölçülür." },
        { label: "Radyo", value: "FM 87,5 – 108 MHz · AM · RDS" },
        { label: "Ses işleme", value: "13 bant ekolayzer · 3 yollu ayırıcı" },
        ],
      },
      {
        title: "Bağlantı",
        rows: [
        { label: "Bluetooth", value: "5.3 · HFP / A2DP / AVRCP · iki telefon" },
        { label: "Kablosuz ağ", value: "Wi-Fi 5 · 2,4 / 5 GHz" },
        { label: "USB", value: "2 × USB-A · 5 V / 2 A" },
        { label: "Ön çıkışlar", value: "3 çift RCA (ön · arka · sub) · 4 V" },
        { label: "Kamera girişi", value: "1 × RCA · geri vites tetiklemeli" },
        { label: "Direksiyon kumandası", value: "Analog SWC girişi · öğrenmeli" },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Montaj yuvası", value: "2-DIN · 178 × 100 mm", note: "Farklı yuva ölçüsünde araca özel çerçeve gerekir." },
        { label: "Montaj derinliği", value: "75 mm (soket payı hariç)" },
        { label: "Besleme", value: "12 V DC · 10 A sigorta" },
        { label: "Çalışma akımı", value: "0,3 A bekleme · 9 A (en çok)", note: "Tam güçte çekiş 10 A sigortanın altında kalır." },
        { label: "Çalışma sıcaklığı", value: "-20 / +70 °C" },
        { label: "Ağırlık", value: "1,6 kg" },
        ],
      },
    ],
    compatibility: [
      { label: "Araç uyumluluğu", values: ["Standart 2-DIN yuvalı binek araçlar", "12 V araç elektriği", "24 V araçlarda 12 V dönüştürücü ile", "Fabrika amfili sistemlerde ISO kablo"] },
      { label: "Uyumlu konnektör tipleri", values: ["ISO 10487 güç ve hoparlör soketi", "Quadlock ara kablosu", "ISO / Fakra anten adaptörü", "4 pinli geri görüş kamerası soketi"] },
      { label: "Telefon yansıtma", values: ["Kablosuz yansıtma · 5 GHz Wi-Fi", "Kablolu yansıtma · USB-A", "Bluetooth ile eller serbest arama"] },
      { label: "Desteklenen dosya biçimleri", values: ["MP3 · FLAC · WAV · APE", "MP4 · MKV · AVI", "FAT32 / exFAT biçimli USB bellek"] },
    ],
  },

  led: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "Televizyon LED bar takımı", note: "Doğrudan arka aydınlatmalı panellerde kullanılır." },
        { label: "Takım yapısı", value: "8 çubuk · çubuk başına 6 LED · 48 LED" },
        { label: "LED tipi", value: "SMD 2835 · mercekli" },
        { label: "Besleme", value: "3 V / LED · 144 V DC tam dizi", note: "Dizi tamamlanmadan besleme uygulanmamalıdır." },
        { label: "Sürücü akımı", value: "180 mA sabit" },
        { label: "Toplam güç", value: "26 W (144 V × 180 mA)" },
        ],
      },
      {
        title: "Aydınlatma",
        rows: [
        { label: "Işık akısı", value: "2.640 lm · 55 lm/LED" },
        { label: "Renk sıcaklığı", value: "6.500 K · soğuk beyaz" },
        { label: "Renk koordinatı", value: "x 0,313 · y 0,329 (CIE 1931)" },
        { label: "Mercek açısı", value: "155°" },
        { label: "Karartma", value: "PWM · 1 kHz · panel kartı üzerinden" },
        { label: "Aydınlatma düzeni", value: "Doğrudan aydınlatma · 120 mm aralık" },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Çubuk ölçüsü", value: "560 × 16 × 1,0 mm", note: "Çubuk boyu ve yuva aralığı panelle eşleşmelidir." },
        { label: "Taşıyıcı", value: "Alüminyum tabanlı PCB" },
        { label: "Uç bağlantısı", value: "2 pinli soket · lehimli uç seçeneği" },
        { label: "Montaj", value: "Isı iletken çift taraflı bant · klips" },
        { label: "Çalışma sıcaklığı", value: "0 / +60 °C", note: "Kapalı televizyon şasisi içini kapsar." },
        { label: "Takım ağırlığı", value: "480 g" },
        ],
      },
    ],
    compatibility: [
      { label: "Uyumlu panel tipleri", values: ["43″ (108 cm) LED paneller", "8 çubuklu · 6 LED'li dizilim", "Çubuk yuva aralığı 120 mm", "Doğrudan arka aydınlatmalı şasi"] },
      { label: "Uyumlu sürücü kartları", values: ["144 V DC sabit akım çıkışı", "180 mA sürücü akımı", "PWM karartma girişli LED sürücü katı"] },
      { label: "Test ve ölçüm uyumluluğu", values: ["0 – 300 V LED bar test cihazı", "Çubuk başına 18 V test gerilimi", "Tek LED için 3 V nokta testi"] },
    ],
  },

  guvenlik: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "8 kanal IP kamera ve NVR kayıt seti" },
        { label: "Kamera çözünürlüğü", value: "4 MP · 2560 × 1440 px" },
        { label: "Gece görüşü", value: "IR aydınlatma · 25 m" },
        { label: "Video sıkıştırma", value: "H.265+ / H.264" },
        { label: "Ağ arayüzü", value: "1 × RJ45 10/100/1000 Mbit/s" },
        { label: "PoE çıkışı", value: "8 × RJ45 · IEEE 802.3af · en çok 80 W", note: "Sekiz kanalın toplam PoE bütçesi 80 W ile sınırlıdır." },
        ],
      },
      {
        title: "Kayıt",
        rows: [
        { label: "Kayıt kapasitesi", value: "8 × 4 MP · 25 fps" },
        { label: "Depolama", value: "1 × 3,5″ SATA disk · en çok 8 TB", note: "Disk kızağı ve SATA kablosu kutudadır." },
        { label: "Kayıt modu", value: "Sürekli · hareket · zamanlayıcı" },
        { label: "Hareket algılama", value: "4 bölge · 1 – 8 duyarlılık kademesi" },
        { label: "Görüntü çıkışı", value: "HDMI 4K 30 Hz · VGA 1920 × 1080 px" },
        { label: "Uzaktan erişim", value: "P2P · RTSP · HTTPS web arayüzü" },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Kamera koruma sınıfı", value: "IP67" },
        { label: "Kamera beslemesi", value: "48 V PoE · IEEE 802.3af" },
        { label: "Kamera sıcaklığı", value: "-30 / +60 °C" },
        { label: "Kayıt cihazı ölçüleri", value: "260 × 225 × 48 mm" },
        { label: "Kutu içeriği", value: "4 × kamera · 1 × kayıt cihazı", note: "Sette 4 × 18 m hazır Cat5e U/UTP kablo bulunur." },
        { label: "Kayıt cihazı sıcaklığı", value: "0 / +45 °C" },
        { label: "Besleme", value: "48 V / 2,5 A · 120 W adaptör" },
        ],
      },
    ],
    compatibility: [
      { label: "Desteklenen protokoller", values: ["ONVIF Profile S", "RTSP akış", "H.265+ / H.264 IP kamera"] },
      { label: "Uyumlu disk tipleri", values: ["3,5″ SATA HDD · en çok 8 TB", "2,5″ SATA SSD · en çok 2 TB", "7/24 çalışmaya uygun izleme diski"] },
      { label: "Kablolama seçenekleri", values: ["Cat6 U/UTP · en çok 100 m PoE", "Cat5e U/UTP · en çok 100 m PoE", "Cat6 S/FTP · dış ortam kanalı"] },
      { label: "Uzaktan izleme", values: ["Eşzamanlı 4 kanal canlı izleme", "P2P seri numarası ile eşleme", "64-bit masaüstü izleme yazılımı"] },
    ],
  },

  bilgisayar: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "Hepsi bir arada masaüstü bilgisayar" },
        { label: "İşlemci", value: "10 çekirdek / 16 iş parçacığı · 3,4 GHz" },
        { label: "Bellek", value: "16 GB DDR5-5600 · 2 × SO-DIMM yuva" },
        { label: "Depolama", value: "512 GB NVMe SSD · PCIe 4.0" },
        { label: "Ağ bağlantısı", value: "Wi-Fi 6 (802.11ax) · 1 × RJ45 1 Gbit/s", note: "Bluetooth 5.3 ile kablosuz klavye ve kulaklık bağlanır." },
        { label: "Bağlantı noktaları", value: "2 × USB-A 3.2 Gen 1 · 1 × USB-C Gen 2", note: "USB-A 5 Gbit/s, USB-C 10 Gbit/s ve DP Alt Mode sağlar." },
        ],
      },
      {
        title: "Ekran",
        rows: [
        { label: "Panel", value: "23,8″ IPS · mat yüzey" },
        { label: "Çözünürlük", value: "1920 × 1080 px · 16:9" },
        { label: "Yenileme hızı", value: "100 Hz" },
        { label: "Tepki süresi", value: "5 ms (GtG)" },
        { label: "Parlaklık ve renk", value: "300 cd/m² · sRGB %99" },
        { label: "HDMI giriş", value: "1 × HDMI 2.1 giriş · 1920 × 1080 px", note: "4K kaynaklar 1920 × 1080 px'e ölçeklenir." },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Besleme", value: "19 V / 6,32 A · 120 W harici adaptör" },
        { label: "Dahili hoparlör", value: "2 × 5 W" },
        { label: "Ses bağlantısı", value: "1 × 3,5 mm kulaklık ve mikrofon" },
        { label: "Montaj deliği", value: "VESA 100 × 100 mm", note: "Ayak sökülerek M4 × 10 mm vida ile monte edilir." },
        { label: "Ölçüler", value: "540 × 400 × 175 mm (ayak dahil)" },
        { label: "Ağırlık", value: "6,4 kg" },
        ],
      },
    ],
    compatibility: [
      { label: "İşletim sistemi desteği", values: ["64-bit masaüstü işletim sistemleri", "Güncel Linux dağıtımları"] },
      { label: "Uyumlu bellek modülleri", values: ["DDR5-4800 SO-DIMM", "DDR5-5600 SO-DIMM", "Yuva başına en çok 32 GB"] },
      { label: "Uyumlu görüntü kaynakları", values: ["HDMI kaynak · 1920 × 1080 px / 100 Hz", "HDMI kaynak · 1920 × 1080 px / 60 Hz"] },
      { label: "Duvar montaj aparatları", values: ["VESA 100 × 100 mm askı", "M4 × 10 mm montaj vidası"] },
      { label: "Harici ekran çıkışı", values: ["USB-C DP Alt Mode · 1920 × 1080 px"] },
    ],
  },

  olcum: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "True RMS dijital multimetre" },
        { label: "Ekran", value: "20.000 sayım · aydınlatmalı LCD", note: "Çift satır gösterge ve bargraf içerir." },
        { label: "Ölçüm kategorisi", value: "CAT III 600 V / CAT II 1000 V" },
        { label: "Temel doğruluk", value: "±%0,09 + 3 hane (DC gerilim)" },
        { label: "Örnekleme hızı", value: "5 ölçüm/s" },
        { label: "Pil beslemesi", value: "1 × 9 V 6LR61 · 15 dk otomatik kapanma" },
        ],
      },
      {
        title: "Ölçüm",
        rows: [
        { label: "DC gerilim", value: "600 mV – 1000 V · 5 kademe" },
        { label: "AC gerilim", value: "6 V – 750 V · True RMS" },
        { label: "Akım", value: "600 µA – 10 A (AC/DC)", note: "10 A girişinde sürekli ölçüm süresi 30 s'dir." },
        { label: "Direnç", value: "600 Ω – 60 MΩ" },
        { label: "Kapasite ve frekans", value: "1 nF – 10 mF · 10 Hz – 10 MHz" },
        { label: "Ek fonksiyonlar", value: "Süreklilik · diyot · -40 / +1000 °C" },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Giriş koruması", value: "10 A ve 0,5 A · 1000 V HRC sigorta", note: "Sigorta kesme kapasitesi 20 kA ve 10 kA'dır." },
        { label: "Gövde ve koruma", value: "ABS kasa · silikon kılıf · IP54" },
        { label: "Prob girişi", value: "4 mm emniyet tipi muz jak" },
        { label: "Gövde ölçüleri", value: "180 × 88 × 48 mm" },
        { label: "Ağırlık", value: "380 g", note: "Ağırlığa pil ve kılıf dahildir." },
        { label: "Çalışma sıcaklığı", value: "-10 / +55 °C · yoğuşmasız", note: "Doğruluk 18 – 28 °C · ≤ %75 nemde geçerlidir." },
        ],
      },
    ],
    compatibility: [
      { label: "Uyumlu prob ve aparatlar", values: ["4 mm emniyet tipi muz jak prob", "K tipi termokupl prob", "600 A pens adaptörü · 1 mV/A çıkış"] },
      { label: "Ölçülebilir devre tipleri", values: ["230 V / 50 Hz şebeke hattı", "12 – 48 V DC akü ve panel hattı", "PWM invertör çıkışı · True RMS"] },
      { label: "Yedek parça ve sigorta", values: ["9 V 6LR61 pil", "10 A / 1000 V HRC seramik · 20 kA", "0,5 A / 1000 V HRC seramik · 10 kA"] },
    ],
  },

  adaptor: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "Fişli adaptör, akü ve şarjlı pil grubu" },
        { label: "Şebeke beslemesi", value: "100 – 240 V AC · 50/60 Hz" },
        { label: "Çıkış gerilimi", value: "12 V DC · 19 V DC" },
        { label: "Çıkış akımı", value: "2 A – 6,32 A · 24 W – 120 W" },
        { label: "Dönüşüm verimi", value: "≥ %88 · tam yükte" },
        ],
      },
      {
        title: "Enerji",
        rows: [
        { label: "Akü teknolojisi", value: "Kurşun-asit jel · derin döngü" },
        { label: "Nominal kapasite", value: "12 V / 100 Ah", note: "C20 boşalma oranında ölçülen değerdir." },
        { label: "Akü şarj gerilimi", value: "13,8 V yüzdürme · 14,4 V çevrim", note: "Harici kademeli şarj cihazı gerektirir; gruptaki 12 V adaptör akü şarjında kullanılmaz." },
        { label: "Şarj yöntemi", value: "Kademeli · dolum, absorbe, yüzdürme", note: "Profilsiz düz doğrultuculu cihazlarla şarj edilmez." },
        { label: "Hücre tipi", value: "18650 Li-ion · 3,7 V / 2.600 mAh" },
        { label: "Koruma devreleri", value: "Kısa devre · aşırı akım · aşırı ısınma" },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Fiş tipi", value: "CEE 7/16 · iki uçlu" },
        { label: "Çıkış konnektörü", value: "5,5 × 2,1 mm namlu jak" },
        { label: "Dalgalanma gerilimi", value: "≤ 120 mVpp" },
        { label: "Kablo uzunluğu", value: "1,2 m DC · 1,5 m AC" },
        { label: "Akü terminali", value: "M6 cıvatalı bakır terminal" },
        { label: "Çalışma sıcaklığı", value: "-10 / +40 °C · akü +5 / +35 °C" },
        { label: "Ağırlık", value: "Adaptör 210 g · jel akü 30,5 kg" },
        ],
      },
    ],
    compatibility: [
      { label: "Beslenebilen cihazlar", values: ["12 V kamera ve kayıt cihazı", "19 V girişli dizüstü bilgisayar", "Modem ve yönlendirici", "LED şerit sürücüleri"] },
      { label: "Uyumlu jak ölçüleri", values: ["5,5 × 2,1 mm", "5,5 × 2,5 mm", "4,0 × 1,7 mm", "7,4 × 5,0 mm pinli"] },
      { label: "Akü şarj profilleri", values: ["Kademeli jel akü profili", "Kademeli AGM profili", "Li-ion 4,2 V/hücre"] },
      { label: "Sistem uygulamaları", values: ["12 V invertör girişi", "Güneş paneli şarj regülatörü", "Kesintisiz besleme hattı"] },
    ],
  },

  kablo: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "Koaksiyel, veri, HDMI ve alarm kablosu" },
        { label: "Standart", value: "RG6 U6 · Cat6 U/UTP · HDMI 2.1" },
        { label: "İletken", value: "RG6 1,02 mm · Cat6 0,57 mm tam bakır" },
        { label: "Ekranlama", value: "Alüminyum folyo + 112 tel bakır örgü" },
        { label: "Kılıf malzemesi", value: "PVC · LSZH seçeneği", note: "Doğrudan toprak altı döşeme için uygun değildir." },
        { label: "Makara uzunluğu", value: "100 m · 305 m" },
        ],
      },
      {
        title: "İletim",
        rows: [
        { label: "Empedans", value: "75 Ω koaksiyel · 100 Ω veri" },
        { label: "Bant genişliği", value: "RG6 5 – 3000 MHz · Cat6 250 MHz" },
        { label: "Zayıflama", value: "≤ 20 dB / 100 m @ 862 MHz" },
        { label: "Veri hızı", value: "10 Gbit/s", note: "10GBASE-T için hat uzunluğu en çok 55 m'dir." },
        { label: "HDMI taşıma kapasitesi", value: "48 Gbit/s · 8K 60 Hz" },
        { label: "İletken direnci", value: "RG6 ≤ 22 Ω/km · Cat6 ≤ 94 Ω/km" },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Dış çap", value: "6,8 mm RG6 · 6,0 mm Cat6" },
        { label: "Damar yapısı", value: "6 × 0,22 mm² alarm kablosu" },
        { label: "Bükülme yarıçapı", value: "En az 50 mm" },
        { label: "Çalışma sıcaklığı", value: "-25 / +70 °C" },
        { label: "Kılıf rengi", value: "Beyaz · siyah" },
        ],
      },
    ],
    compatibility: [
      { label: "Uyumlu konnektör tipleri", values: ["F konnektör · RG6", "RJ45 Cat6 keystone", "BNC sıkmalı", "HDMI Tip A"] },
      { label: "Desteklenen ağ standartları", values: ["1000BASE-T", "2.5GBASE-T", "10GBASE-T · en çok 55 m", "IEEE 802.3af / 802.3at PoE"] },
      { label: "Kurulduğu sistemler", values: ["Merkezi uydu dağıtımı", "IP ve AHD kamera hattı", "Alarm paneli zon hattı"] },
      { label: "Döşeme ortamı", values: ["İç mekân kablo kanalı", "Sıva altı spiral boru", "Kablo tavası"] },
    ],
  },

  hirdavat: {
    groups: [
      {
        title: "Genel",
        rows: [
        { label: "Ürün tipi", value: "Tamir seti, fener, buat ve invertör" },
        { label: "Set içeriği", value: "120 parça · 62 bit ucu" },
        { label: "Bit ölçüsü", value: "4 mm altıgen şaft · S2 çelik", note: "1/4 inç altıgen adaptör set içindedir." },
        { label: "Işık kaynağı", value: "LED · 1.000 lm · 3 kademe" },
        { label: "Şarj arayüzü", value: "USB-C · 5 V / 2 A" },
        ],
      },
      {
        title: "Güç",
        rows: [
        { label: "İnvertör girişi", value: "10,5 – 15 V DC · en çok 185 A", note: "2.000 W çıkış için en az 35 mm² kablo ve 250 A sigorta gerekir." },
        { label: "Sürekli / tepe güç", value: "2.000 W / 4.000 W", note: "Tepe değer, 5 saniyeye kadar süren kalkış yükleri içindir." },
        { label: "AC çıkışı", value: "230 V · 50 Hz · modifiye sinüs" },
        { label: "Bekleme tüketimi", value: "En çok 10 W" },
        { label: "Fener bataryası", value: "3,7 V · 5.200 mAh Li-ion" },
        { label: "Aydınlatma süresi", value: "2 saat yüksek · 9 saat düşük" },
        ],
      },
      {
        title: "Fiziksel",
        rows: [
        { label: "Kutu gövdesi", value: "ABS plastik · gri" },
        { label: "Kutu ölçüleri", value: "100 × 68 × 50 mm" },
        { label: "Kutu sızdırmazlığı", value: "IP65 contalı kapak" },
        { label: "Fener gövdesi", value: "Alüminyum · kauçuk kaplamalı" },
        { label: "İnvertör soğutma", value: "2 × 80 mm termostatlı fan", note: "Fan devri, gövde sıcaklığına göre kademeli artar." },
        { label: "Çalışma sıcaklığı", value: "-10 / +45 °C" },
        ],
      },
    ],
    compatibility: [
      { label: "Uyumlu vida başları", values: ["Yıldız PH000 – PH2", "Torx T3 – T20", "Pentalobe P2", "Altıgen 0,7 – 4 mm"] },
      { label: "İnvertör beslemesi", values: ["12 V jel/AGM akü · doğrudan terminal", "Araç çakmak soketi · en çok 150 W", "Şarj regülatörü akü çıkışı"] },
      { label: "Kutu montaj seçenekleri", values: ["DIN ray klipsi", "Duvar vida kulağı", "M12 – M20 rakor deliği"] },
      { label: "Fener aksesuar uyumluluğu", values: ["1/4 inç tripod dişi", "Mıknatıslı taban", "Kemer klipsi"] },
    ],
  },
};

/**
 * A category's template, through the tree: CATEGORY_SPECS is keyed by
 * template ("guvenlik", "uydu"…), and a category — or a subcategory, by
 * inheritance — names the template it uses. None named, no template.
 */
export const categorySpec = (category: string): CategorySpec | undefined => {
  const template = CATEGORY_META[category]?.spec;
  return template ? CATEGORY_SPECS[template] : undefined;
};
