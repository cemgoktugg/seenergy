/**
 * The client's CCTV range, written up from their own datasheets
 * (src/CCTV/…/*DATA SHIELD.pdf, delivered 2026-10-21).
 *
 * Every value below is the datasheet's. Where a sheet contradicts itself the
 * row is the one its spec TABLE gives, and rows that are plainly template
 * leftovers are left out rather than published:
 *   - IP cameras: the table's "ÇÖZÜNÜRLÜK  IP 2MP CVBS-COMENT…" row sits on
 *     5 MP models (title, lens and the 5.0 MP badge all say 5 MP) — omitted.
 *   - IP cameras: the feature list repeats "1/2.8'' T31+SC-2335 SENSÖR" from
 *     another model; the table's DSP row is used.
 *   - SE-IPC5010MLS: table "4 Warm Led", feature list "18 WARM LED"; the
 *     photo shows four, so four.
 * Datasheet typos are corrected in the copy ("Megapikxel", "Datection").
 *
 * `code` is the model code the product was created with (the client's first
 * table, see seenergy-cctv-products) and finds it; `sku` is the code the
 * datasheet and the box use. Assets: seed-assets/cctv/<sku>.webp / .pdf.
 */

export interface CctvSpecRow {
  label: string;
  value: string;
  note?: string;
}

export interface CctvContent {
  code: string;
  sku: string;
  /** After the brand and the code: "SEENERGY SE-1080LD 2MP AHD IR Dome Kamera". */
  name: string;
  description: string;
  specs: { title: string; rows: CctvSpecRow[] }[];
}

/* ---- shared rows ------------------------------------------------- */

const AHD_IMAGE_COMMON: CctvSpecRow[] = [
  { label: "IR cut filtre", value: "Mevcut" },
  { label: "Gündüz / gece modu", value: "Renkli · otomatik · siyah-beyaz · harici" },
  { label: "Minimum aydınlatma", value: "Renkli 0,05 lux · siyah-beyaz 0,03 lux (F1.2)" },
  { label: "Sinyal / gürültü oranı", value: "> 41 dB" },
  { label: "Kazanç denetimi", value: "0 – 42 dB" },
  { label: "Gürültü azaltma", value: "2D DNR / 3D DNR" },
  { label: "Dijital efekt", value: "Dondurma · çevirme · ayna" },
];

const SMART_COMMON = {
  title: "Akıllı özellikler",
  rows: [
    { label: "Hareket algılama", value: "Açık / kapalı · 4 programlanabilir bölge" },
    { label: "Gizlilik maskeleme", value: "Açık / kapalı · 4 programlanabilir bölge" },
  ],
};

const POWER_12V = {
  title: "Güç",
  rows: [
    { label: "Giriş voltajı", value: "12 V DC" },
    { label: "Güç tüketimi", value: "En çok 3 W" },
  ],
};

const ENV_COMMON = {
  title: "Fiziksel",
  rows: [
    { label: "Çalışma sıcaklığı / nem", value: "-20 °C ~ +65 °C · %30 – %95 bağıl nem" },
    { label: "Depolama sıcaklığı / nem", value: "-20 °C ~ +65 °C · %30 – %95 bağıl nem" },
  ],
};

const IP_IMAGE_COMMON: CctvSpecRow[] = [
  { label: "Video sıkıştırma", value: "H.265+ / MJPEG · 25 fps" },
  ...AHD_IMAGE_COMMON,
];

/* ---- builders ---------------------------------------------------- */

function ahdCamera(o: {
  type: string;
  sensor: string;
  lens: string;
  led: string;
  range: string;
  compression?: boolean;
}) {
  return [
    {
      title: "Genel",
      rows: [
        { label: "Ürün tipi", value: o.type },
        { label: "Çözünürlük", value: "2 MP · AHD 1080p" },
        { label: "Lens", value: o.lens },
        { label: "Gece görüş mesafesi", value: o.range },
      ],
    },
    {
      title: "Görüntü",
      rows: [
        { label: "Sensör", value: o.sensor },
        { label: "Aydınlatma", value: o.led },
        ...(o.compression === false ? [] : [{ label: "Video formatı", value: "H.264 / MJPEG · 25 fps" }]),
        ...AHD_IMAGE_COMMON,
      ],
    },
    SMART_COMMON,
    POWER_12V,
    ENV_COMMON,
  ];
}

function ipCamera(o: { type: string; sensor: string; led: string; nightNote?: string }) {
  return [
    {
      title: "Genel",
      rows: [
        { label: "Ürün tipi", value: o.type },
        { label: "Çözünürlük", value: "5 MP" },
        { label: "Lens", value: "2,8 mm sabit · 5 MP" },
        { label: "Gece görüş mesafesi", value: "40 – 50 m", ...(o.nightNote ? { note: o.nightNote } : {}) },
      ],
    },
    {
      title: "Görüntü",
      rows: [{ label: "Sensör / işlemci", value: o.sensor }, { label: "Aydınlatma", value: o.led }, ...IP_IMAGE_COMMON],
    },
    SMART_COMMON,
    POWER_12V,
    ENV_COMMON,
  ];
}

function dvr(ch: number, multi: string, power: string) {
  return [
    {
      title: "Genel",
      rows: [
        { label: "Ürün tipi", value: `${ch} kanal AHD DVR kayıt cihazı` },
        { label: "Kanal sayısı", value: `${ch} kanal` },
        { label: "Kayıt çözünürlüğü", value: `${ch} × 1080p · 25 fps` },
        { label: "Disk desteği", value: "1 × SATA · en çok 16 TB" },
      ],
    },
    {
      title: "Kayıt",
      rows: [
        { label: "İşletim sistemi", value: "Linux" },
        { label: "Kodlama", value: `${ch} × 1080p · 25 fps` },
        { label: "Kod çözme", value: `${ch} × 1080p · 25 fps` },
        { label: "Çoklu giriş", value: multi },
        { label: "Kayıt modları", value: "Manuel · alarm · hareket algılama · zamanlı" },
        { label: "Canlı önizleme", value: `${ch} kanal` },
        { label: "Yedekleme", value: "Ağ üzerinden · USB disk · USB yazıcı · SATA yazıcı" },
      ],
    },
    {
      title: "Bağlantı",
      rows: [
        { label: "Video giriş", value: `${ch} × BNC` },
        { label: "Video çıkış", value: "1 × HDMI · 1 × VGA · 1 × BNC" },
        { label: "Ses giriş", value: `${ch} × RCA` },
        { label: "Ses çıkış", value: "1 × RCA" },
        { label: "Alarm giriş / çıkış", value: "Yok" },
        { label: "Ağ", value: "1 × RJ45 · 10/100 Mbit/s" },
        { label: "Kablosuz", value: "3G / Wi-Fi (USB adaptör ile)" },
      ],
    },
    {
      title: "Ses",
      rows: [
        { label: "Ses sıkıştırma", value: "G.711A" },
        { label: "Çift yönlü ses", value: "Destekler" },
      ],
    },
    { title: "Güç", rows: [{ label: "Besleme", value: power }] },
  ];
}

function nvr(ch: number, preview: number, disk: number) {
  return [
    {
      title: "Genel",
      rows: [
        { label: "Ürün tipi", value: `${ch} kanal NVR kayıt cihazı` },
        { label: "Kanal sayısı", value: `${ch} kanal IP` },
        { label: "Kayıt çözünürlüğü", value: `${ch} × 1080p · 25 fps` },
        { label: "Disk desteği", value: `1 × SATA · en çok ${disk} TB` },
      ],
    },
    {
      title: "Kayıt",
      rows: [
        { label: "İşletim sistemi", value: "Linux" },
        { label: "Kodlama", value: `${ch} × 1080p · 25 fps` },
        { label: "Kod çözme", value: `${ch} × 1080p · 25 fps` },
        { label: "Video standardı", value: "NTSC 30 fps · PAL 25 fps" },
        { label: "Kayıt modları", value: "Manuel · alarm · hareket algılama · zamanlı" },
        { label: "Canlı önizleme", value: `${preview} kanal` },
        { label: "Yedekleme", value: "Ağ üzerinden · USB disk · USB yazıcı · SATA yazıcı" },
      ],
    },
    {
      title: "Bağlantı",
      rows: [
        { label: "Video çıkış", value: "1 × HDMI · 1 × VGA · 1 × BNC" },
        { label: "Ses giriş", value: "1 × RCA" },
        { label: "Ses çıkış", value: "1 × RCA" },
        { label: "Alarm giriş / çıkış", value: "Yok" },
        { label: "Ağ", value: "1 × RJ45 · 10/100 Mbit/s" },
        { label: "Kablosuz", value: "3G / Wi-Fi (USB adaptör ile)" },
      ],
    },
    {
      title: "Ses",
      rows: [
        { label: "Ses sıkıştırma", value: "G.711A" },
        { label: "Çift yönlü ses", value: "Destekler" },
      ],
    },
    { title: "Güç", rows: [{ label: "Besleme", value: "12 V DC" }] },
  ];
}

function solar(o: { mp: number; lens: string; range: string; panel: string; battery: string }) {
  return [
    {
      title: "Genel",
      rows: [
        { label: "Ürün tipi", value: "4G solar PTZ kamera" },
        { label: "Çözünürlük", value: `${o.mp} MP` },
        { label: "Bağlantı", value: "4G · SIM kartlı" },
        { label: "Solar panel", value: o.panel },
      ],
    },
    {
      title: "Görüntü",
      rows: [
        { label: "Sensör", value: '1/2.7" progressive CMOS' },
        { label: "Lens", value: o.lens },
        { label: "Gece görüşü", value: o.range },
        { label: "Video sıkıştırma", value: "H.265+" },
      ],
    },
    {
      title: "Akıllı özellikler",
      rows: [
        { label: "PTZ hareketi", value: "Yatay 355° · dikey 100°" },
        { label: "Akıllı algılama", value: "İnsan algılama" },
        { label: "Ses", value: "Çift yönlü konuşma" },
      ],
    },
    {
      title: "Kayıt",
      rows: [
        { label: "Depolama", value: "Bulut + microSD kart" },
        { label: "Uzaktan izleme", value: "Mobil uygulama (UBox)" },
      ],
    },
    {
      title: "Enerji",
      rows: [
        { label: "Solar panel", value: o.panel },
        { label: "Batarya", value: o.battery },
      ],
    },
  ];
}

function wifi3mp(o: { type: string; extra?: CctvSpecRow[] }) {
  return [
    {
      title: "Genel",
      rows: [
        { label: "Ürün tipi", value: o.type },
        { label: "Çözünürlük", value: "3 MP" },
        { label: "Bağlantı", value: "Wi-Fi" },
        { label: "Depolama", value: "microSD kart" },
      ],
    },
    {
      title: "Görüntü",
      rows: [
        { label: "Lens", value: "3,6 mm" },
        { label: "Aydınlatma", value: "6 × SMD LED" },
        { label: "Gece görüşü", value: "Siyah-beyaz" },
      ],
    },
    {
      title: "Akıllı özellikler",
      rows: [
        { label: "Algılama", value: "Akıllı hareket algılama" },
        { label: "Alarm", value: "Anlık bildirim (mobil uygulama)" },
        { label: "Ses", value: "Çift yönlü konuşma" },
        { label: "Mobil uygulama", value: "VicoHome" },
      ],
    },
    { title: "Güç", rows: [{ label: "Besleme girişi", value: "USB Type-C" }, ...(o.extra ?? [])] },
  ];
}

/* ---- the range --------------------------------------------------- */

export const CCTV_CONTENT: CctvContent[] = [
  /* AHD Sistem */
  {
    code: "SE-1080LD",
    sku: "SE-1080LD",
    name: "2MP AHD IR Dome Kamera",
    description: [
      "SEENERGY SE-1080LD, 2 megapiksel AHD dome kameradır. 1/2.7\" sensörü ve 2,8 mm sabit lensiyle geniş bir alanı Full HD 1080p çözünürlükte görüntüler; 18 SMD IR LED ile karanlıkta 15 – 30 metreye kadar görür.",
      "Ofis, mağaza, depo ve konut girişleri gibi tavana montajın tercih edildiği alanlar için uygundur. AHD kayıt cihazlarıyla (SE-4000, SE-8000, SE-16000) koaksiyel kablo üzerinden çalışır.",
      "• 2 MP · AHD 1080p görüntü\n• 2,8 mm sabit lens · 1/2.7\" FH/F33 sensör\n• 18 SMD IR LED · 15 – 30 m gece görüşü\n• IR cut filtre · 2D/3D gürültü azaltma\n• 4 bölgeli hareket algılama ve gizlilik maskeleme\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: ahdCamera({
      type: "AHD IR dome kamera",
      sensor: "1/2.7\" FH/F33",
      lens: "2,8 mm sabit · 3 MP",
      led: "18 × SMD IR LED",
      range: "15 – 30 m",
    }),
  },
  {
    code: "SE-1080MD",
    sku: "SE-1080MD",
    name: "2MP AHD Mini Metal Dome Kamera",
    description: [
      "SEENERGY SE-1080MD, metal gövdeli 2 megapiksel AHD mini dome kameradır. Kompakt yapısı sayesinde dar tavan ve köşe noktalarına rahatça yerleşir; 12 IR LED ile 15 – 30 metre gece görüşü sağlar.",
      "Mağaza, koridor, asansör önü ve küçük ofisler için idealdir. SEENERGY AHD DVR kayıt cihazlarıyla uyumludur.",
      "• 2 MP · AHD 1080p görüntü\n• Metal mini dome gövde\n• 2,8 mm sabit lens · 1/2.7\" FH8536H/F33 sensör\n• 12 IR LED · 15 – 30 m gece görüşü\n• IR cut filtre · 2D/3D gürültü azaltma\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: ahdCamera({
      type: "AHD mini metal dome kamera",
      sensor: "1/2.7\" FH8536H/F33",
      lens: "2,8 mm sabit · 3 MP",
      led: "12 × IR LED",
      range: "15 – 30 m",
      compression: false,
    }),
  },
  {
    code: "SE-1080MC",
    sku: "SE-1080MC",
    name: "2MP AHD IR Dome Kamera 1,8 mm",
    description: [
      "SEENERGY SE-1080MC, 1,8 mm geniş açılı lensli 2 megapiksel AHD dome kameradır. Kısa odak uzaklığı sayesinde tek kamerayla daha geniş bir alanı kapsar; 12 IR LED ile 15 – 30 metre gece görüşü sunar.",
      "Oda, giriş holü ve kasa önü gibi bütün alanın tek karede görülmesi gereken iç mekânlar için uygundur.",
      "• 2 MP · AHD 1080p görüntü\n• 1,8 mm geniş açı sabit lens\n• 1/2.7\" FH/F33 sensör\n• 12 IR LED · 15 – 30 m gece görüşü\n• IR cut filtre · 2D/3D gürültü azaltma\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: ahdCamera({
      type: "AHD IR dome kamera",
      sensor: "1/2.7\" FH/F33",
      lens: "1,8 mm sabit (geniş açı) · 3 MP",
      led: "12 × IR LED",
      range: "15 – 30 m",
    }),
  },
  {
    code: "SE-3824",
    sku: "SE-3824",
    name: "2MP AHD IR Bullet Kamera",
    description: [
      "SEENERGY SE-3824, 36 IR LED'li 2 megapiksel AHD bullet kameradır. Güçlü IR aydınlatması 30 – 40 metre gece görüşü sağlar; montaj ayağı sayesinde izlenecek noktaya kolayca yöneltilir. Depo, otopark girişi, koridor ve bina çevresi için uygundur.",
      "• 2 MP · AHD 1080p görüntü\n• 2,8 mm sabit lens · 1/2.7\" FH8536H/SOI F37P sensör\n• 36 IR LED · 30 – 40 m gece görüşü\n• IR cut filtre · 2D/3D gürültü azaltma\n• 4 bölgeli hareket algılama ve gizlilik maskeleme\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: ahdCamera({
      type: "AHD IR bullet kamera",
      sensor: "1/2.7\" FH8536H/SOI F37P",
      lens: "2,8 mm sabit · 3 MP",
      led: "36 × IR LED",
      range: "30 – 40 m",
    }),
  },
  {
    code: "SE-1080ML",
    sku: "SE-1080ML",
    name: "2MP AHD IR Bullet Kamera IP66",
    description: [
      "SEENERGY SE-1080ML, IP66 korumalı 2 megapiksel AHD bullet kameradır. Toza ve yağmura dayanıklı gövdesiyle dış mekânda çalışır; 18 SMD IR LED ile 20 – 30 metre gece görüşü sağlar.",
      "OSD menüsünden BLC, HLC, AGC, AWB ve dijital WDR ayarlanır; menü Türkçe dahil 10 dilde kullanılabilir.",
      "• 2 MP · AHD 1080p görüntü\n• IP66 dış mekân gövdesi\n• 2,8 mm sabit lens · 1/2.7\" CMOS sensör\n• 18 SMD IR LED · 20 – 30 m gece görüşü\n• OSD menü · BLC / HLC / AGC / AWB / D-WDR\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: [
      {
        title: "Genel",
        rows: [
          { label: "Ürün tipi", value: "AHD IR bullet kamera" },
          { label: "Çözünürlük", value: "2 MP · AHD 1080p" },
          { label: "Lens", value: "2,8 mm sabit · 3 MP" },
          { label: "Gece görüş mesafesi", value: "20 – 30 m" },
        ],
      },
      {
        title: "Görüntü",
        rows: [
          { label: "Sensör", value: "1/2.7\" CMOS" },
          { label: "Aydınlatma", value: "18 × SMD IR LED" },
          { label: "Kare hızı", value: "1080p 25 fps (50 Hz) · 1080p 30 fps (60 Hz)" },
          { label: "Video çıkışı", value: "AHD 2 MP 1080p · CVBS 960H" },
          { label: "Sinyal sistemi", value: "PAL" },
          { label: "IR cut filtre", value: "Mevcut" },
          { label: "Gündüz / gece modu", value: "Renkli · otomatik · siyah-beyaz · harici" },
          { label: "Minimum aydınlatma", value: "Renkli 0,05 lux · siyah-beyaz 0,09 lux (F1.2)" },
          { label: "Sinyal / gürültü oranı", value: "> 52 dB" },
          { label: "Kazanç denetimi", value: "0 – 52 dB" },
          { label: "Gürültü azaltma", value: "2D DNR / 3D DNR" },
          { label: "Dijital efekt", value: "Dondurma · çevirme · ayna" },
          { label: "OSD menü", value: "BLC · HLC · AGC · AWB · D-WDR" },
          { label: "OSD dili", value: "Türkçe, İngilizce, Almanca, Fransızca, İtalyanca, İspanyolca, Lehçe, Rusça, Portekizce, Felemenkçe" },
        ],
      },
      SMART_COMMON,
      POWER_12V,
      { title: "Fiziksel", rows: [{ label: "Koruma sınıfı", value: "IP66" }, ...ENV_COMMON.rows] },
    ],
  },
  {
    code: "SE-1080MLW",
    sku: "SE-1080MLW",
    name: "2MP AHD Renkli Gece Görüşlü Bullet Kamera",
    description: [
      "SEENERGY SE-1080MLW, gece de renkli görüntü veren 2 megapiksel AHD bullet kameradır. Kızılötesi yerine 4 sıcak beyaz (warm) LED kullanır; karanlıkta 30 – 40 metreye kadar renkleri ayırt edilebilen görüntü sunar.",
      "Araç, kıyafet rengi gibi ayrıntıların önemli olduğu giriş, otopark ve bahçe alanları için uygundur.",
      "• 2 MP · AHD 1080p görüntü\n• Renkli gece görüşü · 4 sıcak beyaz LED\n• 3,6 mm sabit lens · 1/2.7\" FH8536H/F33 sensör\n• 30 – 40 m gece görüş mesafesi\n• 2D/3D gürültü azaltma\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: ahdCamera({
      type: "AHD renkli gece görüşlü bullet kamera",
      sensor: "1/2.7\" FH8536H/F33",
      lens: "3,6 mm sabit · 3 MP",
      led: "4 × mini sıcak beyaz LED (renkli gece görüşü)",
      range: "30 – 40 m",
    }),
  },
  {
    code: "SE-4000",
    sku: "SE-4000",
    name: "4 Kanal AHD DVR Kayıt Cihazı",
    description: [
      "SEENERGY SE-4000, 4 kanallı AHD DVR kayıt cihazıdır. Dört kameranın görüntüsünü 1080p çözünürlükte kaydeder; 5 MP-N ve 4 MP-N kameraları da destekler. HDMI ve VGA çıkışıyla monitöre doğrudan bağlanır.",
      "Tek SATA yuvasına 16 TB'a kadar disk takılır. Kayıtlar ağ üzerinden, USB disk veya yazıcı ile yedeklenebilir.",
      "• 4 kanal AHD · 4 × 1080p kayıt\n• 5 MP-N 20 fps / 4 MP-N 25 fps / 1080p 25 fps giriş\n• HDMI + VGA + BNC video çıkışı\n• 4 kanal ses girişi · çift yönlü ses\n• 1 × SATA · en çok 16 TB\n• 12 V 3 A besleme",
    ].join("\n\n"),
    specs: dvr(4, "4 × 5 MP-N 20 fps · 4 × 4 MP-N 25 fps · 4 × 1080p 25 fps", "12 V DC · 3 A"),
  },
  {
    code: "SE-8000",
    sku: "SE-8000",
    name: "8 Kanal AHD DVR Kayıt Cihazı",
    description: [
      "SEENERGY SE-8000, 8 kanallı AHD DVR kayıt cihazıdır. Sekiz kameranın görüntüsünü 1080p çözünürlükte kaydeder; 5 MP-N ve 4 MP-N kameraları da destekler. HDMI ve VGA çıkışıyla monitöre doğrudan bağlanır.",
      "Tek SATA yuvasına 16 TB'a kadar disk takılır. Kayıtlar ağ üzerinden, USB disk veya yazıcı ile yedeklenebilir.",
      "• 8 kanal AHD · 8 × 1080p kayıt\n• 5 MP-N 12 fps / 4 MP-N 15 fps / 1080p 30 fps giriş\n• HDMI + VGA + BNC video çıkışı\n• 8 kanal ses girişi · çift yönlü ses\n• 1 × SATA · en çok 16 TB\n• 12 V 5 A besleme",
    ].join("\n\n"),
    specs: dvr(8, "8 × 5 MP-N 12 fps · 8 × 4 MP-N 15 fps · 8 × 1080p 30 fps", "12 V DC · 5 A"),
  },
  {
    code: "SE-16000",
    sku: "SE-16000",
    name: "16 Kanal AHD DVR Kayıt Cihazı",
    description: [
      "SEENERGY SE-16000, 16 kanallı AHD DVR kayıt cihazıdır. On altı kameranın görüntüsünü 1080p çözünürlükte kaydeder; 5 MP-N ve 4 MP-N kameraları da destekler. Site, fabrika ve çok katlı işletmeler gibi kamera sayısı yüksek projeler için uygundur.",
      "Tek SATA yuvasına 16 TB'a kadar disk takılır. Kayıtlar ağ üzerinden, USB disk veya yazıcı ile yedeklenebilir.",
      "• 16 kanal AHD · 16 × 1080p kayıt\n• 5 MP-N 12 fps / 4 MP-N 15 fps / 1080p 30 fps giriş\n• HDMI + VGA + BNC video çıkışı\n• 16 kanal ses girişi · çift yönlü ses\n• 1 × SATA · en çok 16 TB\n• 12 V 5 A besleme",
    ].join("\n\n"),
    specs: dvr(16, "16 × 5 MP-N 12 fps · 16 × 4 MP-N 15 fps · 16 × 1080p 30 fps", "12 V DC · 5 A"),
  },

  /* IP Sistem */
  {
    code: "SE-IP5083LD",
    sku: "SE-IPC5083LD",
    name: "5MP IP Dome Kamera",
    description: [
      "SEENERGY SE-IPC5083LD, 5 megapiksel IP dome kameradır. 2,8 mm lensiyle iç mekânı yüksek çözünürlükte görüntüler; H.265+ sıkıştırma sayesinde aynı diskte daha uzun kayıt süresi sağlar. Gece görüş mesafesi 40 – 50 metredir.",
      "SEENERGY NVR kayıt cihazlarıyla (SE-NVR1010, SE-NVR1016, SE-NVR2036, SE-NVR4036) ağ kablosu üzerinden çalışır.",
      "• 5 MP IP görüntü\n• 2,8 mm sabit lens · Hi3516CV608 + GC2083\n• H.265+ / MJPEG · 25 fps\n• 2 IR LED · 40 – 50 m gece görüşü\n• 4 bölgeli hareket algılama ve gizlilik maskeleme\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: ipCamera({ type: "IP dome kamera", sensor: "Hi3516CV608 + GC2083", led: "2 × IR LED" }),
  },
  {
    code: "SE-IPC5010LDS",
    sku: "SE-IPC5010LDS",
    name: "5MP IP Renkli Gece Görüşlü Dome Kamera",
    description: [
      "SEENERGY SE-IPC5010LDS, gece de renkli görüntü veren 5 megapiksel IP dome kameradır. 4 sıcak beyaz LED ile karanlıkta 40 – 50 metreye kadar renkli görüntü sunar; H.265+ sıkıştırma ile disk alanını verimli kullanır.",
      "Mağaza, lobi ve giriş alanları gibi gece de renk ayrıntısının önemli olduğu yerler için uygundur.",
      "• 5 MP IP görüntü\n• Renkli gece görüşü · 4 sıcak beyaz LED\n• 2,8 mm sabit lens · 3516CV610 + 04D10\n• H.265+ / MJPEG · 25 fps\n• 40 – 50 m gece görüş mesafesi\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: ipCamera({
      type: "IP renkli gece görüşlü dome kamera",
      sensor: "3516CV610 + 04D10",
      led: "4 × sıcak beyaz LED (renkli gece görüşü)",
    }),
  },
  {
    code: "SE-IPC5083B",
    sku: "SE-IPC5083B",
    name: "5MP IP Bullet Kamera",
    description: [
      "SEENERGY SE-IPC5083B, 5 megapiksel IP bullet kameradır. 18 SMD LED ile 40 – 50 metre gece görüşü sağlar; montaj ayağı sayesinde izlenecek noktaya kolayca yöneltilir. H.265+ sıkıştırma ile aynı diskte daha uzun kayıt süresi sağlar.",
      "• 5 MP IP görüntü\n• 2,8 mm sabit lens · Hi3516CV608 + GC2083\n• H.265+ / MJPEG · 25 fps\n• 18 SMD LED · 40 – 50 m gece görüşü\n• 4 bölgeli hareket algılama ve gizlilik maskeleme\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: ipCamera({ type: "IP bullet kamera", sensor: "Hi3516CV608 + GC2083", led: "18 × SMD LED" }),
  },
  {
    code: "SE-IPC5010MLS",
    sku: "SE-IPC5010MLS",
    name: "5MP IP Renkli Gece Görüşlü Bullet Kamera",
    description: [
      "SEENERGY SE-IPC5010MLS, gece de renkli görüntü veren 5 megapiksel IP bullet kameradır. 4 sıcak beyaz LED ile karanlıkta 40 – 50 metreye kadar renkli görüntü sunar.",
      "Araç plakası, kıyafet rengi gibi ayrıntıların önemli olduğu otopark, bahçe ve bina girişleri için uygundur.",
      "• 5 MP IP görüntü\n• Renkli gece görüşü · 4 sıcak beyaz LED\n• 2,8 mm sabit lens · 3516CV610 + 04D10\n• H.265+ / MJPEG · 25 fps\n• 40 – 50 m gece görüş mesafesi\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: ipCamera({
      type: "IP renkli gece görüşlü bullet kamera",
      sensor: "3516CV610 + 04D10",
      led: "4 × sıcak beyaz LED (renkli gece görüşü)",
    }),
  },
  {
    code: "SE-NVR1010",
    sku: "SE-NVR1010",
    name: "10 Kanal NVR Kayıt Cihazı",
    description: [
      "SEENERGY SE-NVR1010, 10 kanallı NVR (ağ video kayıt) cihazıdır. On IP kameranın görüntüsünü 1080p çözünürlükte kaydeder; HDMI ve VGA çıkışıyla monitöre doğrudan bağlanır.",
      "Tek SATA yuvasına 14 TB'a kadar disk takılır. Küçük işletme ve konut projeleri için uygundur.",
      "• 10 kanal IP · 10 × 1080p kayıt\n• HDMI + VGA + BNC video çıkışı\n• Çift yönlü ses · G.711A\n• 1 × SATA · en çok 14 TB\n• 3G / Wi-Fi (USB adaptör ile)\n• 12 V DC besleme",
    ].join("\n\n"),
    specs: nvr(10, 10, 14),
  },
  {
    code: "SE-NVR1016",
    sku: "SE-NVR1016",
    name: "16 Kanal NVR Kayıt Cihazı",
    description: [
      "SEENERGY SE-NVR1016, 16 kanallı NVR (ağ video kayıt) cihazıdır. On altı IP kameranın görüntüsünü 1080p çözünürlükte kaydeder; HDMI ve VGA çıkışıyla monitöre doğrudan bağlanır.",
      "Tek SATA yuvasına 14 TB'a kadar disk takılır. Mağaza, ofis ve orta ölçekli işletmeler için uygundur.",
      "• 16 kanal IP · 16 × 1080p kayıt\n• HDMI + VGA + BNC video çıkışı\n• Çift yönlü ses · G.711A\n• 1 × SATA · en çok 14 TB\n• 3G / Wi-Fi (USB adaptör ile)\n• 12 V DC besleme",
    ].join("\n\n"),
    specs: nvr(16, 16, 14),
  },
  {
    code: "SE-NVR2036",
    sku: "SE-NVR2036",
    name: "36 Kanal NVR Kayıt Cihazı",
    description: [
      "SEENERGY SE-NVR2036, 36 kanallı NVR (ağ video kayıt) cihazıdır. Otuz altı IP kameranın görüntüsünü 1080p çözünürlükte kaydeder; canlı izlemede 16 kanal aynı anda görüntülenir.",
      "Tek SATA yuvasına 14 TB'a kadar disk takılır. Site, fabrika ve çok binalı projeler için uygundur.",
      "• 36 kanal IP · 36 × 1080p kayıt\n• 16 kanal eşzamanlı canlı önizleme\n• HDMI + VGA + BNC video çıkışı\n• Çift yönlü ses · G.711A\n• 1 × SATA · en çok 14 TB\n• 12 V DC besleme",
    ].join("\n\n"),
    specs: nvr(36, 16, 14),
  },
  {
    code: "SE-NVR4036",
    sku: "SE-NVR4036",
    name: "36 Kanal NVR Kayıt Cihazı 16 TB",
    description: [
      "SEENERGY SE-NVR4036, 36 kanallı NVR (ağ video kayıt) cihazıdır. Otuz altı IP kameranın görüntüsünü 1080p çözünürlükte kaydeder; canlı izlemede 16 kanal aynı anda görüntülenir.",
      "Tek SATA yuvasına 16 TB'a kadar disk takılır. Büyük ölçekli projeler ve merkezi izleme odaları için uygundur.",
      "• 36 kanal IP · 36 × 1080p kayıt\n• 16 kanal eşzamanlı canlı önizleme\n• HDMI + VGA + BNC video çıkışı\n• Çift yönlü ses · G.711A\n• 1 × SATA · en çok 16 TB\n• 12 V DC besleme",
    ].join("\n\n"),
    specs: nvr(36, 16, 16),
  },

  /* WiFi Kameralar */
  {
    code: "3800WM",
    sku: "SE-3800WM",
    name: "3MP Wi-Fi Mini Kamera",
    description: [
      "SEENERGY SE-3800WM, kablosuz ağa bağlanan 3 megapiksel Wi-Fi kameradır. Ayaklı kompakt gövdesi masa ya da rafa kolayca yerleşir; VicoHome mobil uygulamasıyla canlı izleme, hareket bildirimi ve çift yönlü konuşma telefonunuzdan yapılır.",
      "Ev, çocuk ve evcil hayvan takibi ile küçük ofisler için uygundur. Kayıtlar microSD karta alınır.",
      "• 3 MP görüntü · 3,6 mm lens\n• Wi-Fi bağlantı · VicoHome uygulaması\n• Akıllı hareket algılama · anlık bildirim\n• Çift yönlü konuşma\n• 6 SMD LED · siyah-beyaz gece görüşü\n• microSD kart desteği · USB Type-C besleme",
    ].join("\n\n"),
    specs: wifi3mp({ type: "Wi-Fi iç mekân kamera" }),
  },
  {
    code: "3800WP",
    sku: "SE-3800WP",
    name: "3MP Wi-Fi Kamera",
    description: [
      "SEENERGY SE-3800WP, kablosuz ağa bağlanan 3 megapiksel Wi-Fi kameradır. VicoHome mobil uygulamasıyla canlı izleme, hareket bildirimi ve çift yönlü konuşma telefonunuzdan yapılır.",
      "Ev, bebek odası ve küçük işletmeler için uygundur. Kayıtlar microSD karta alınır.",
      "• 3 MP görüntü · 3,6 mm lens\n• Wi-Fi bağlantı · VicoHome uygulaması\n• Akıllı hareket algılama · anlık bildirim\n• Çift yönlü konuşma\n• 6 SMD LED · siyah-beyaz gece görüşü\n• microSD kart desteği · USB Type-C besleme",
    ].join("\n\n"),
    specs: wifi3mp({ type: "Wi-Fi iç mekân kamera" }),
  },
  {
    code: "3800WB",
    sku: "SE-3800WB",
    name: "3MP Wi-Fi Bataryalı Kamera",
    description: [
      "SEENERGY SE-3800WB, kablo çekmeden kurulan bataryalı 3 megapiksel Wi-Fi kameradır. 4400 mAh dahili bataryası, PIR sensör ve yapay zekâ destekli insan algılamayla yalnızca gerektiğinde kayda geçer.",
      "Çift ışık (IR + beyaz LED) gece görüşü ve çift yönlü konuşma özelliği vardır. Kapı önü, bahçe ve kablo çekilmesi zor noktalar için uygundur.",
      "• 3 MP · 2304 × 1296 görüntü · 3,6 mm lens\n• 4400 mAh dahili batarya · kablosuz kurulum\n• PIR + yapay zekâ insan algılama · anlık bildirim\n• Çift ışık gece görüşü (IR + beyaz LED)\n• Çift yönlü konuşma\n• microSD kart desteği · VicoHome uygulaması",
    ].join("\n\n"),
    specs: [
      {
        title: "Genel",
        rows: [
          { label: "Ürün tipi", value: "Bataryalı Wi-Fi kamera" },
          { label: "Çözünürlük", value: "3 MP · 2304 × 1296" },
          { label: "Bağlantı", value: "Wi-Fi" },
          { label: "Batarya", value: "4400 mAh dahili" },
        ],
      },
      {
        title: "Görüntü",
        rows: [
          { label: "Lens", value: "3,6 mm" },
          { label: "Gece görüşü", value: "Çift ışık · IR + beyaz LED" },
        ],
      },
      {
        title: "Akıllı özellikler",
        rows: [
          { label: "Algılama", value: "PIR + yapay zekâ insan algılama" },
          { label: "Alarm", value: "Anlık bildirim (mobil uygulama)" },
          { label: "Ses", value: "Çift yönlü konuşma" },
          { label: "Mobil uygulama", value: "VicoHome" },
        ],
      },
      { title: "Kayıt", rows: [{ label: "Depolama", value: "microSD kart" }] },
    ],
  },
  {
    code: "IPC5010LDW",
    sku: "SE-IPC5010LDW",
    name: "5MP Wi-Fi IP Dome Kamera",
    description: [
      "SEENERGY SE-IPC5010LDW, 5 megapiksel Wi-Fi IP dome kameradır. 2,8 mm lensiyle iç mekânı yüksek çözünürlükte görüntüler; H.265+ sıkıştırma ile kayıt süresini uzatır. Gece görüş mesafesi 40 – 50 metredir.",
      "• 5 MP IP görüntü\n• Wi-Fi bağlantı\n• 2,8 mm sabit lens · FH8852V201 + GC2083\n• H.265+ / MJPEG · 25 fps\n• 4 IR LED · 40 – 50 m gece görüşü\n• 12 V DC · en çok 3 W",
    ].join("\n\n"),
    specs: [
      {
        title: "Genel",
        rows: [
          { label: "Ürün tipi", value: "Wi-Fi IP dome kamera" },
          { label: "Çözünürlük", value: "5 MP" },
          { label: "Lens", value: "2,8 mm sabit · 5 MP" },
          { label: "Gece görüş mesafesi", value: "40 – 50 m" },
        ],
      },
      {
        title: "Görüntü",
        rows: [
          { label: "Sensör / işlemci", value: "FH8852V201 + GC2083" },
          { label: "Aydınlatma", value: "4 × IR LED" },
          ...IP_IMAGE_COMMON,
        ],
      },
      SMART_COMMON,
      POWER_12V,
      ENV_COMMON,
    ],
  },
  {
    code: "1080M4G",
    sku: "SE-1080M4G",
    name: "2MP 4G SIM Kartlı Bataryalı Kamera",
    description: [
      "SEENERGY SE-1080M4G, internet altyapısı olmayan yerlerde 4G SIM kartla çalışan 2 megapiksel bataryalı kameradır. 3000 mAh dahili bataryası ve otomatik insan takibi özelliğiyle şantiye, bağ evi, depo ve araç gibi noktalarda kullanılır.",
      "Hareket algılandığında mobil uygulamaya anlık bildirim gönderir; kayıtlar buluta ve microSD karta alınır.",
      "• 2 MP · 1080p görüntü\n• 4G SIM kart bağlantısı\n• 3000 mAh dahili batarya · Micro USB şarj\n• Otomatik insan takibi\n• Bulut + microSD kart kayıt\n• Çift yönlü konuşma · siyah-beyaz gece görüşü",
    ].join("\n\n"),
    specs: [
      {
        title: "Genel",
        rows: [
          { label: "Ürün tipi", value: "4G SIM kartlı bataryalı kamera" },
          { label: "Çözünürlük", value: "2 MP · 1080p" },
          { label: "Bağlantı", value: "4G · SIM kartlı" },
          { label: "Batarya", value: "3000 mAh dahili" },
        ],
      },
      { title: "Görüntü", rows: [{ label: "Gece görüşü", value: "Siyah-beyaz" }] },
      {
        title: "Akıllı özellikler",
        rows: [
          { label: "Akıllı takip", value: "Otomatik insan takibi" },
          { label: "Alarm", value: "Mobil uygulamaya anlık bildirim" },
          { label: "Ses", value: "Çift yönlü konuşma" },
        ],
      },
      { title: "Kayıt", rows: [{ label: "Depolama", value: "Bulut + microSD kart" }] },
      { title: "Enerji", rows: [{ label: "Batarya", value: "3000 mAh dahili" }, { label: "Şarj girişi", value: "Micro USB" }] },
    ],
  },

  /* Solar Kameralar */
  {
    code: "3004G",
    sku: "SE-3004G",
    name: "3MP 4G Solar PTZ Kamera",
    description: [
      "SEENERGY SE-3004G, elektrik ve internet hattı gerektirmeyen 3 megapiksel 4G solar PTZ kameradır. 8 W monokristal güneş paneli dahili lityum bataryayı şarj eder; görüntü 4G SIM kart üzerinden telefonunuza ulaşır.",
      "Yatayda 355°, dikeyde 100° döner; insan algılama ve 30 metre tam renkli gece görüşü sunar. Tarla, bağ-bahçe, şantiye ve otopark gibi altyapısız alanlar için uygundur.",
      "• 3 MP görüntü · 3,6 mm lens\n• 4G SIM kart bağlantısı\n• 8 W monokristal solar panel · 6 × 18650 lityum batarya\n• 355° yatay / 100° dikey PTZ\n• 30 m tam renkli gece görüşü · insan algılama\n• Bulut + microSD kart kayıt · çift yönlü konuşma",
    ].join("\n\n"),
    specs: solar({
      mp: 3,
      lens: "3,6 mm · 3 MP",
      range: "30 m · tam renkli",
      panel: "8 W monokristal silikon",
      battery: "Dahili 6 × 18650 şarj edilebilir lityum pil",
    }),
  },
  {
    code: "5010X-4G",
    sku: "SE-5010X-4G",
    name: "5MP 10x Zoom 4G Solar PTZ Kamera",
    description: [
      "SEENERGY SE-5010X-4G, 10x optik yakınlaştırmalı 5 megapiksel 4G solar PTZ kameradır. 5 – 50 mm motorlu lensiyle uzaktaki ayrıntıları yakına getirir; 8 W güneş paneli ve 6 × 2600 mAh lityum bataryayla elektrik hattı olmadan çalışır.",
      "Yatayda 355°, dikeyde 100° döner; insan algılama ve 30 metre tam renkli gece görüşü sunar. Geniş arazi, şantiye ve otopark gözetimi için uygundur.",
      "• 5 MP görüntü · 5 – 50 mm lens (10x zoom)\n• 4G SIM kart bağlantısı\n• 8 W monokristal solar panel · 6 × 2600 mAh lityum batarya\n• 355° yatay / 100° dikey PTZ\n• 30 m tam renkli gece görüşü · insan algılama\n• Bulut + microSD kart kayıt · çift yönlü konuşma",
    ].join("\n\n"),
    specs: solar({
      mp: 5,
      lens: "5 – 50 mm · 10x zoom · 5 MP",
      range: "30 m · tam renkli",
      panel: "8 W monokristal silikon",
      battery: "Dahili 6 × 2600 mAh şarj edilebilir lityum",
    }),
  },
  {
    code: "6010XD-4G",
    sku: "SE-6010XD-4G",
    name: "6MP Çift Lensli 10x Zoom 4G Solar PTZ Kamera",
    description: [
      "SEENERGY SE-6010XD-4G, çift lensli 6 megapiksel 4G solar PTZ kameradır. Sabit lens geniş alanı izlerken PTZ lens 10x yakınlaştırmayla ayrıntıya odaklanır. 9 W güneş paneli ve 6 × 2600 mAh lityum bataryayla elektrik hattı olmadan çalışır.",
      "Yatayda 355°, dikeyde 100° döner; insan algılama ve 40 metre tam renkli gece görüşü sunar. Geniş arazi, fabrika çevresi ve şantiyeler için uygundur.",
      "• 6 MP görüntü · çift lens (sabit + PTZ) · 10x zoom\n• 4G SIM kart bağlantısı\n• 9 W monokristal solar panel · 6 × 2600 mAh lityum batarya\n• 355° yatay / 100° dikey PTZ\n• 40 m tam renkli gece görüşü · insan algılama\n• Bulut + microSD kart kayıt · çift yönlü konuşma",
    ].join("\n\n"),
    specs: solar({
      mp: 6,
      lens: "Çift lens (sabit + PTZ) · 10x zoom · 6 MP",
      range: "40 m · tam renkli",
      panel: "9 W monokristal silikon",
      battery: "Dahili 6 × 2600 mAh şarj edilebilir lityum",
    }),
  },
];
