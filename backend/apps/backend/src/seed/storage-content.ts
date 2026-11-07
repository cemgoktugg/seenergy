/**
 * The client's Kayıt ve Depolama range (2026-11-07): 34 products from their
 * folder "3) KAYIT VE DEPOLAMA" — memory cards, SSDs and surveillance hard
 * disks — with the titles, descriptions and spec table of their
 * "TEKNİK ÖZELLİKLER.xlsx" and one photo each (seed-assets/storage/<handle>.webp).
 *
 * Every value is the client's: the spec table, plus what their own title
 * states (RPM, cache, TB/yıl, RV) and, where the title is silent, their
 * description. Where the sheet contradicts itself:
 *   - KIOXIA 64/128/256 GB: the table says microSDHC; the title, the photo and
 *     the capacity (over 32 GB is SDXC by definition) say microSDXC.
 *   - KIOXIA 256 GB: titled "EXCERIA", described and pictured as EXCERIA G2.
 *   - TOSHIBA 2 TB (HDWT720UZSVA): the description repeats the 1 TB model's
 *     "5700 RPM, 64MB"; the title says 5400 RPM, 128MB — the title is kept.
 *   - WD Purple Pro 12 TB: the title had no model code; the table's WD121PURP
 *     is appended like every other disk's.
 * Spacing typos are corrected; the wording is not changed.
 *
 * No price or stock was given: the products are created published with no
 * price, which the storefront shows as "Tükendi" until one is entered.
 */

export interface StorageSpecRow {
  label: string;
  value: string;
}

export interface StorageContent {
  handle: string;
  /** Manufacturer / model code; null where the sheet gives none. */
  sku: string | null;
  brand: string;
  title: string;
  description: string;
  specs: { title: string; rows: StorageSpecRow[] }[];
}

const paragraphs = (...parts: string[]) => parts.map((p) => p.replace(/\s+/g, " ").trim()).join("\n\n");

const row = (label: string, value: string | undefined): StorageSpecRow[] => (value ? [{ label, value }] : []);

/* ---- builders ---------------------------------------------------- */

function sdCard(o: {
  brand: string;
  model: string;
  capacity: string;
  type?: string;
  speedClass?: string;
  video?: string;
  rugged?: boolean;
}) {
  const general = {
    title: "Genel",
    rows: [
      ...row("Marka", o.brand),
      ...row("Model", o.model),
      ...row("Kapasite", o.capacity),
      ...row("Kart tipi", o.type),
    ],
  };
  if (!o.speedClass) return [general];
  return [
    general,
    {
      title: "Performans",
      rows: [
        ...row("Okuma hızı", "En çok 100 MB/s"),
        ...row("Hız sınıfı", o.speedClass),
        ...row("Video kaydı", o.video),
        ...row(
          "Dayanıklılık",
          o.rugged ? "Su, darbe, X-ışını, elektrostatik deşarj ve aşırı sıcaklığa dayanıklı" : undefined,
        ),
      ],
    },
  ];
}

function ssd(o: { model: string; capacity: string }) {
  return [
    {
      title: "Genel",
      rows: [
        ...row("Marka", "HI-LEVEL"),
        ...row("Seri", "Elite"),
        ...row("Model", o.model),
        ...row("Kapasite", o.capacity),
        ...row("Ürün tipi", "2.5\" SATA SSD"),
      ],
    },
    {
      title: "Performans",
      rows: [
        ...row("Arayüz", "SATA3 · 6 Gb/s"),
        ...row("Okuma hızı", "En çok 560 MB/s"),
        ...row("Yazma hızı", "En çok 540 MB/s"),
      ],
    },
  ];
}

function hdd(o: {
  brand: string;
  series: string;
  model: string;
  capacity: string;
  rpm?: string;
  cache?: string;
  workload?: string;
  rv?: boolean;
  recording?: string;
  ai?: string;
}) {
  return [
    {
      title: "Genel",
      rows: [
        ...row("Marka", o.brand),
        ...row("Seri", o.series),
        ...row("Model", o.model),
        ...row("Kapasite", o.capacity),
        ...row("Disk boyutu", "3.5\""),
      ],
    },
    {
      title: "Performans",
      rows: [
        ...row("Arayüz", "SATA3 · 6,0 Gb/s"),
        ...row("Dönüş hızı", o.rpm ? `${o.rpm} RPM` : undefined),
        ...row("Önbellek", o.cache),
        ...row("Kayıt teknolojisi", o.recording),
        ...row("İş yükü", o.workload ? `${o.workload} TB/yıl` : undefined),
        ...row("Çalışma", "7/24 kesintisiz"),
        ...row("RV sensörü", o.rv ? "Var" : undefined),
        ...row("AI desteği", o.ai),
      ],
    },
  ];
}

/* ---- the range --------------------------------------------------- */

export const STORAGE_CONTENT: StorageContent[] = [
  /* Hafıza kartları */
  {
    handle: "seenergy-se-64gb-sd-kart",
    sku: "SE-64GB",
    brand: "SEENERGY",
    title: "SEENERGY SE-64GB SD KART",
    description: "",
    specs: sdCard({ brand: "SEENERGY", model: "SE-64GB", capacity: "64GB" }),
  },
  {
    handle: "seenergy-se-128gb-sd-kart",
    sku: "SE-128GB",
    brand: "SEENERGY",
    title: "SEENERGY SE-128GB SD KART",
    description: "",
    specs: sdCard({ brand: "SEENERGY", model: "SE-128GB", capacity: "128GB" }),
  },
  {
    handle: "kioxia-exceria-32gb-microsdhc",
    sku: null,
    brand: "KIOXIA",
    title: "KIOXIA EXCERIA 32GB MICROSDHC UHS-1 C10 100MB/sn SD KART",
    description: paragraphs(
      "KIOXIA EXCERIA 32GB microSDHC hafıza kartı, akıllı telefonlar, tabletler, aksiyon kameraları ve diğer microSDHC uyumlu cihazlar için güvenilir ve yüksek performanslı depolama çözümü sunar. UHS-I teknolojisi sayesinde 100 MB/s'ye kadar okuma hızı ile fotoğraf, video ve dosyalarınıza hızlı erişim sağlar.",
      "Full HD video kayıt desteği sunan EXCERIA serisi, günlük kullanım, mobil uygulamalar ve medya depolama ihtiyaçları için idealdir. Darbeye, suya, X-ışınlarına, elektrostatik deşarja ve aşırı ısınmaya karşı dayanıklı yapısıyla verilerinizi güvenle korur.",
    ),
    specs: sdCard({
      brand: "KIOXIA",
      model: "EXCERIA",
      capacity: "32GB",
      type: "microSDHC",
      speedClass: "UHS-I · Class 10",
      video: "Full HD",
      rugged: true,
    }),
  },
  {
    handle: "kioxia-exceria-64gb-microsdxc",
    sku: null,
    brand: "KIOXIA",
    title: "KIOXIA EXCERIA 64GB MICROSDXC UHS-1 C10 100MB/sn SD KART",
    description: paragraphs(
      "KIOXIA EXCERIA 64GB microSDXC hafıza kartı, akıllı telefonlar, tabletler, dijital fotoğraf makineleri, aksiyon kameraları ve diğer microSDXC uyumlu cihazlar için yüksek performanslı ve güvenilir depolama çözümü sunar. 100 MB/s'ye kadar okuma hızı sayesinde fotoğraf, video ve dosyalarınızı hızlı bir şekilde aktarabilir ve erişebilirsiniz.",
      "UHS-I U1 ve Class 10 performansı ile Full HD video kayıtları için ideal olan EXCERIA serisi, günlük kullanımın yanı sıra yüksek çözünürlüklü fotoğraf ve videolarınızı güvenle saklamanızı sağlar. Suya, darbeye, X-ışınlarına, elektrostatik deşarja ve aşırı ısınmaya karşı dayanıklı yapısı sayesinde zorlu koşullarda da güvenilir performans sunar.",
    ),
    specs: sdCard({
      brand: "KIOXIA",
      model: "EXCERIA",
      capacity: "64GB",
      type: "microSDXC",
      speedClass: "UHS-I U1 · Class 10",
      video: "Full HD",
      rugged: true,
    }),
  },
  {
    handle: "kioxia-exceria-g2-128gb-microsdxc",
    sku: null,
    brand: "KIOXIA",
    title: "KIOXIA EXCERIA G2 128GB MICROSDXC UHS-1 100MB/sn SD KART",
    description: paragraphs(
      "KIOXIA EXCERIA G2 128GB microSDXC hafıza kartı, yüksek hız ve güvenilir depolama performansını bir araya getirerek akıllı telefonlar, tabletler, aksiyon kameraları, drone'lar, dijital fotoğraf makineleri ve diğer microSDXC uyumlu cihazlar için ideal bir çözümdür. 100 MB/s'ye kadar okuma hızı sayesinde büyük dosyaları hızlı bir şekilde aktarabilir ve uygulamalarınıza daha kısa sürede erişebilirsiniz.",
      "UHS-I U3 ve Video Speed Class V30 standartlarını destekleyen EXCERIA G2 serisi, 4K Ultra HD video kayıtları ve yüksek çözünürlüklü fotoğraf çekimleri için üstün performans sunar. Suya, darbeye, X-ışınlarına, elektrostatik deşarja ve aşırı sıcaklıklara karşı dayanıklı yapısıyla verilerinizi güvenle korur.",
    ),
    specs: sdCard({
      brand: "KIOXIA",
      model: "EXCERIA G2",
      capacity: "128GB",
      type: "microSDXC",
      speedClass: "UHS-I U3 · V30",
      video: "4K Ultra HD",
      rugged: true,
    }),
  },
  {
    handle: "kioxia-exceria-g2-256gb-microsdxc",
    sku: null,
    brand: "KIOXIA",
    title: "KIOXIA EXCERIA G2 256GB MICROSDXC UHS-1 100MB/sn SD KART",
    description: paragraphs(
      "KIOXIA EXCERIA G2 256GB microSDXC hafıza kartı, yüksek kapasiteli depolama ihtiyacı duyan kullanıcılar için geliştirilmiş, hızlı ve güvenilir bir depolama çözümüdür. Akıllı telefonlar, tabletler, aksiyon kameraları, drone'lar, dijital fotoğraf makineleri ve diğer microSDXC uyumlu cihazlarla tam uyum sağlar. 100 MB/s'ye kadar okuma hızı sayesinde büyük dosyaları hızlı bir şekilde aktarabilir ve içeriklerinize anında erişebilirsiniz.",
      "UHS-I U3 ve Video Speed Class V30 desteği sayesinde 4K Ultra HD video kayıtları, seri fotoğraf çekimleri ve yüksek veri aktarımı gerektiren uygulamalarda üstün performans sunar. Dayanıklı yapısı ile suya, darbeye, X-ışınlarına, elektrostatik deşarja ve aşırı sıcaklıklara karşı koruma sağlayarak verilerinizi güvenle saklar.",
    ),
    specs: sdCard({
      brand: "KIOXIA",
      model: "EXCERIA G2",
      capacity: "256GB",
      type: "microSDXC",
      speedClass: "UHS-I U3 · V30",
      video: "4K Ultra HD",
      rugged: true,
    }),
  },

  /* SSD */
  {
    handle: "hi-level-elite-128gb-ssd",
    sku: "HLV-SSD30ELT/128G",
    brand: "HI-LEVEL",
    title: "HI-LEVEL 128GB ELITE 560MB-540MB/s Sata 3 2.5\" SSD HLV-SSD30ELT/128G SSD HARDDISK",
    description: paragraphs(
      "HI-LEVEL Elite Series 128GB SSD, bilgisayarınızın performansını artırmak ve daha hızlı veri erişimi sağlamak için tasarlanmış güvenilir bir depolama çözümüdür. 2.5 inç SATA3 (6Gb/s) arayüzü sayesinde masaüstü ve dizüstü bilgisayarlarla geniş uyumluluk sunar. İşletim sistemi açılış sürelerini kısaltır, uygulamaların daha hızlı çalışmasını sağlar ve dosya aktarım performansını artırır.",
      "Mekanik disklerin aksine hareketli parça içermeyen SSD yapısı sayesinde daha sessiz çalışır, daha az enerji tüketir ve darbelere karşı daha dayanıklıdır. Günlük kullanım, ofis uygulamaları ve sistem yükseltmeleri için ideal bir depolama çözümüdür.",
    ),
    specs: ssd({ model: "HLV-SSD30ELT/128G", capacity: "128GB" }),
  },
  {
    handle: "hi-level-elite-256gb-ssd",
    sku: "HLV-SSD30ELT/256G",
    brand: "HI-LEVEL",
    title: "HI-LEVEL 256GB ELITE 560MB-540MB/s Sata 3 2.5\" SSD HLV-SSD30ELT/256G SSD HARDDISK",
    description: paragraphs(
      "Hi-Level Elite 256GB SSD, bilgisayarınızın performansını artırmak ve daha hızlı veri erişimi sağlamak için tasarlanmış yüksek performanslı bir depolama çözümüdür. SATA3 (6Gb/s) arayüzü ile 560 MB/s'ye kadar okuma ve 540 MB/s'ye kadar yazma hızları sunarak işletim sistemi açılışını hızlandırır, uygulamaların daha kısa sürede yüklenmesini ve dosya transferlerinin daha verimli gerçekleşmesini sağlar.",
      "2.5 inç form faktörü sayesinde masaüstü ve dizüstü bilgisayarlarla tam uyumlu olan Hi-Level Elite SSD, hareketli parça içermeyen yapısı sayesinde sessiz çalışır, düşük enerji tüketir ve darbelere karşı yüksek dayanıklılık sunar. Günlük kullanım, profesyonel çalışmalar ve oyun sistemleri için güvenilir bir depolama çözümüdür.",
    ),
    specs: ssd({ model: "HLV-SSD30ELT/256G", capacity: "256GB" }),
  },
  {
    handle: "hi-level-elite-512gb-ssd",
    sku: "HLV-SSD30ELT/512G",
    brand: "HI-LEVEL",
    title: "HI-LEVEL 512GB ELITE 560MB/540MB/s 2.5\" SATA3 HLV-SSD30ELT/512G KIZAKSIZ SSD HARDDISK",
    description: paragraphs(
      "Hi-Level Elite 512GB SSD, yüksek depolama kapasitesi ve hızlı veri aktarım performansı ile bilgisayarınızı bir üst seviyeye taşır. SATA3 (6Gb/s) arayüzü sayesinde 560 MB/s'ye kadar okuma ve 540 MB/s'ye kadar yazma hızları sunarak işletim sisteminin daha hızlı açılmasını, uygulamaların kısa sürede yüklenmesini ve dosya transferlerinin daha verimli gerçekleşmesini sağlar.",
      "2.5 inç form faktörü ile masaüstü ve dizüstü bilgisayarlarla tam uyum sağlayan Hi-Level Elite SSD, hareketli parça içermeyen yapısı sayesinde sessiz çalışma, düşük enerji tüketimi ve darbelere karşı yüksek dayanıklılık sunar. Günlük kullanımın yanı sıra oyun, grafik tasarım ve profesyonel uygulamalar için de güvenilir bir depolama çözümüdür.",
    ),
    specs: ssd({ model: "HLV-SSD30ELT/512G", capacity: "512GB" }),
  },
  {
    handle: "hi-level-elite-1tb-ssd",
    sku: "HLV-SSD30ELT/1T",
    brand: "HI-LEVEL",
    title: "HI-LEVEL 1TB ELITE 560MB-540MB/s 2,5\" SATA 3 HLV-SSD30ELT/1T SSD HARDDISK",
    description: paragraphs(
      "Hi-Level Elite 1TB SSD, yüksek depolama kapasitesi ve üstün performansı bir araya getirerek masaüstü ve dizüstü bilgisayarlar için güvenilir bir depolama çözümü sunar. SATA3 (6Gb/s) arayüzü ile 560 MB/s'ye kadar okuma ve 540 MB/s'ye kadar yazma hızlarına ulaşarak işletim sisteminin hızlı açılmasını, uygulamaların daha kısa sürede yüklenmesini ve büyük dosyaların yüksek hızda aktarılmasını sağlar.",
      "2.5 inç form faktörü sayesinde SATA bağlantısına sahip masaüstü ve dizüstü bilgisayarlarla tam uyumlu olan Hi-Level Elite SSD, hareketli parça içermeyen yapısıyla sessiz çalışma, düşük enerji tüketimi ve yüksek darbe dayanımı sunar. 1TB kapasitesi sayesinde işletim sistemi, oyunlar, profesyonel yazılımlar ve büyük dosyalar için geniş depolama alanı sağlar.",
    ),
    specs: ssd({ model: "HLV-SSD30ELT/1T", capacity: "1TB" }),
  },

  /* Toshiba */
  {
    handle: "toshiba-s300-1tb-hdwv110uzsva",
    sku: "HDWV110UZSVA",
    brand: "TOSHIBA",
    title: "TOSHIBA S300 1TB 5700RPM SATA3-3 6.0gb/s 64MB 7/24 GÜVENLİK HARDDISK (HDWV110UZSVA)",
    description: paragraphs(
      "Toshiba S300 1TB Surveillance HDD, güvenlik kamera sistemleri için özel olarak geliştirilen yüksek dayanıklılığa sahip bir sabit disktir. 7 gün 24 saat kesintisiz çalışma için tasarlanan S300 serisi, DVR, NVR ve hibrit kayıt cihazlarında güvenilir kayıt performansı sunar. 5700 RPM dönüş hızı, 64MB önbellek ve SATA3 6.0 Gb/s arayüzü sayesinde yüksek çözünürlüklü güvenlik görüntülerinin kesintisiz olarak kaydedilmesini sağlar.",
      "Güvenlik sistemlerinin yoğun çalışma koşullarına uygun olarak geliştirilen Toshiba S300, düşük güç tüketimi, yüksek güvenilirlik ve uzun ömürlü kullanım sunarak profesyonel güvenlik uygulamalarında ideal bir depolama çözümüdür.",
    ),
    specs: hdd({ brand: "TOSHIBA", series: "S300 Surveillance", model: "HDWV110UZSVA", capacity: "1TB", rpm: "5700", cache: "64MB" }),
  },
  {
    handle: "toshiba-s300-2tb-hdwt720uzsva",
    sku: "HDWT720UZSVA",
    brand: "TOSHIBA",
    title: "TOSHIBA S300 2TB 5400RPM 128MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (HDWT720UZSVA)",
    description: paragraphs(
      "Toshiba S300 2TB Surveillance HDD, profesyonel güvenlik kamera sistemleri için özel olarak geliştirilen yüksek performanslı ve güvenilir bir sabit disktir. 7 gün 24 saat kesintisiz çalışma için tasarlanan S300 serisi, DVR, NVR ve hibrit kayıt cihazlarında yüksek çözünürlüklü görüntülerin güvenli şekilde kaydedilmesini sağlar. 5400 RPM dönüş hızı, 128MB önbellek (Cache) ve SATA3 6.0 Gb/s arayüzü ile kesintisiz veri akışı ve kararlı performans sunar.",
      "Yüksek dayanıklılık ve uzun ömürlü kullanım için optimize edilen Toshiba S300, ev, iş yeri ve profesyonel güvenlik sistemlerinde güvenilir depolama çözümü olarak öne çıkar.",
    ),
    specs: hdd({ brand: "TOSHIBA", series: "S300 Surveillance", model: "HDWT720UZSVA", capacity: "2TB", rpm: "5400", cache: "128MB", workload: "180" }),
  },
  {
    handle: "toshiba-s300-4tb-hdwt840uzsva",
    sku: "HDWT840UZSVA",
    brand: "TOSHIBA",
    title: "TOSHIBA S300 4TB 256MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (HDWT840UZSVA)",
    description: paragraphs(
      "Toshiba S300 4TB Surveillance HDD, profesyonel güvenlik kamera sistemleri için özel olarak geliştirilen yüksek kapasiteli ve güvenilir bir depolama çözümüdür. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan S300 serisi, DVR, NVR ve hibrit kayıt cihazlarında yüksek çözünürlüklü video kayıtlarını güvenle depolar. SATA3 6.0 Gb/s arayüzü, 5400 RPM dönüş hızı ve 256MB önbellek (Cache) sayesinde uzun süreli kayıt işlemlerinde kararlı ve verimli performans sunar.",
    ),
    specs: hdd({ brand: "TOSHIBA", series: "S300 Surveillance", model: "HDWT840UZSVA", capacity: "4TB", rpm: "5400", cache: "256MB", workload: "180" }),
  },
  {
    handle: "toshiba-s300-6tb-hdwt860uzsva",
    sku: "HDWT860UZSVA",
    brand: "TOSHIBA",
    title: "TOSHIBA S300 6TB 256MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (HDWT860UZSVA)",
    description: paragraphs(
      "Toshiba S300 6TB Surveillance HDD, profesyonel güvenlik kamera sistemleri için özel olarak tasarlanmış yüksek kapasiteli ve uzun ömürlü bir sabit disktir. 7 gün 24 saat kesintisiz çalışmaya uygun yapısı sayesinde DVR, NVR ve hibrit kayıt cihazlarında güvenilir performans sunar. SATA3 6.0 Gb/s arayüzü, 256MB önbellek (Cache) ve güvenlik sistemlerine özel optimize edilmiş yapısı ile yüksek çözünürlüklü kamera kayıtlarının kesintisiz olarak depolanmasını sağlar.",
    ),
    specs: hdd({ brand: "TOSHIBA", series: "S300 Surveillance", model: "HDWT860UZSVA", capacity: "6TB", cache: "256MB", workload: "180" }),
  },
  {
    handle: "toshiba-s300-8tb-hdwt380uzsva",
    sku: "HDWT380UZSVA",
    brand: "TOSHIBA",
    title: "TOSHIBA S300 8TB 7200RPM 7/24 GÜVENLİK HARDDISK (HDWT380UZSVA)",
    description: paragraphs(
      "Toshiba S300 8TB Surveillance HDD, profesyonel güvenlik kamera sistemleri için geliştirilen yüksek kapasiteli ve güvenilir bir depolama çözümüdür. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan S300 serisi, DVR, NVR ve hibrit kayıt cihazlarında yüksek çözünürlüklü kamera kayıtlarını güvenle depolar. SATA3 6.0 Gb/s arayüzü, 256MB önbellek (Cache) ve güvenlik sistemlerine özel optimize edilmiş yapısı sayesinde uzun süreli kayıt işlemlerinde yüksek performans ve kararlılık sunar.",
    ),
    specs: hdd({ brand: "TOSHIBA", series: "S300 Surveillance", model: "HDWT380UZSVA", capacity: "8TB", rpm: "7200", cache: "256MB" }),
  },
  {
    handle: "toshiba-s300-10tb-hdwt31auzsva",
    sku: "HDWT31AUZSVA",
    brand: "TOSHIBA",
    title: "TOSHIBA S300 10TB 256MB 7200RPM SATA3 7/24 GÜVENLİK HARDDISK (HDWT31AUZSVA)",
    description: paragraphs(
      "Toshiba S300 10TB, profesyonel güvenlik sistemleri için tasarlanmış yüksek kapasiteli 3.5\" SATA sabit disktir. 7200 RPM dönüş hızı, 256MB önbelleği ve 7/24 kesintisiz çalışma desteği sayesinde DVR ve NVR sistemlerinde yüksek performanslı, güvenilir video kayıt çözümü sunar. Çoklu kamera desteği ve güvenlik uygulamalarına özel optimize edilmiş yapısı ile uzun süreli veri depolama ihtiyaçlarını karşılamak için geliştirilmiştir.",
    ),
    specs: hdd({ brand: "TOSHIBA", series: "S300 Surveillance", model: "HDWT31AUZSVA", capacity: "10TB", rpm: "7200", cache: "256MB" }),
  },
  {
    handle: "toshiba-mg-enterprise-12tb-mg09aca12te",
    sku: "MG09ACA12TE",
    brand: "TOSHIBA",
    title: "TOSHIBA MG ENTERPRISE 12TB 7200RPM 512MB SATA3 550TB/Y 7/24 GÜVENLİK HARDDISK (MG09ACA12TE)",
    description: paragraphs(
      "Toshiba MG Series 12TB Enterprise HDD, veri merkezleri, sunucular, NAS sistemleri ve kurumsal depolama çözümleri için geliştirilen yüksek performanslı ve yüksek kapasiteli bir sabit disktir. 7200 RPM dönüş hızı, 512MB önbellek (Cache) ve SATA3 6.0 Gb/s arayüzü sayesinde büyük veri transferlerinde yüksek performans ve kararlı çalışma sunar.",
      "Kurumsal kullanım için tasarlanan MG Serisi, 7 gün 24 saat kesintisiz çalışma desteği ve 550TB/yıl iş yükü (Workload Rating) ile yoğun veri erişimi gerektiren profesyonel sistemlerde güvenilir performans sağlar. Yüksek kapasitesi sayesinde büyük ölçekli veri depolama, yedekleme ve sanallaştırma uygulamaları için ideal bir çözümdür.",
    ),
    specs: hdd({ brand: "TOSHIBA", series: "MG Series Enterprise", model: "MG09ACA12TE", capacity: "12TB", rpm: "7200", cache: "512MB", workload: "550" }),
  },
  {
    handle: "toshiba-s300-ai-14tb-mg11aca14te-v",
    sku: "MG11ACA14TE-V",
    brand: "TOSHIBA",
    title: "TOSHIBA S300 AI 14TB 7200RPM 1024MB SATA3 550TB/Y 7/24 GÜVENLİK HARDDISK (MG11ACA14TE-V)",
    description: paragraphs(
      "Toshiba S300 AI 14TB, yapay zekâ destekli video analiz sistemleri ve profesyonel güvenlik uygulamaları için geliştirilen kurumsal sınıf bir gözetim hard diskidir. 7200 RPM dönüş hızı, 1024MB önbellek, SATA3 6.0 Gb/s arayüzü ve CMR kayıt teknolojisi ile yüksek çözünürlüklü video kayıtlarında maksimum performans sunar. 7/24 kesintisiz çalışmaya uygun yapısıyla DVR ve NVR sistemlerinde güvenilir veri depolama sağlar.",
      "AI destekli güvenlik sistemleri için optimize edilen S300 AI serisi, 64 adede kadar kamera ve 32 adede kadar AI analiz akışını destekleyerek yüz tanıma, plaka tanıma ve akıllı video analiz uygulamalarında yüksek verimlilik sağlar.",
    ),
    specs: hdd({
      brand: "TOSHIBA",
      series: "S300 AI Surveillance",
      model: "MG11ACA14TE-V",
      capacity: "14TB",
      rpm: "7200",
      cache: "1024MB",
      workload: "550",
      recording: "CMR",
      ai: "64 kameraya, 32 AI analiz akışına kadar",
    }),
  },
  {
    handle: "toshiba-s300-ai-16tb-mg11aca16te-v",
    sku: "MG11ACA16TE-V",
    brand: "TOSHIBA",
    title: "TOSHIBA S300 AI 16TB 7200RPM 1024MB SATA3 550TB/Y 7/24 GÜVENLİK HARDDISK (MG11ACA16TE-V)",
    description: paragraphs(
      "Toshiba S300 AI 16TB, yapay zekâ destekli video analiz sistemleri ve profesyonel güvenlik uygulamaları için geliştirilen yüksek kapasiteli kurumsal sınıf bir gözetim hard diskidir. 7200 RPM dönüş hızı, 1024MB önbellek, SATA3 6.0 Gb/s arayüzü ve CMR kayıt teknolojisi sayesinde yüksek çözünürlüklü kamera kayıtlarında kesintisiz performans sunar. 7 gün 24 saat kesintisiz çalışmaya uygun yapısıyla DVR ve NVR sistemlerinde güvenilir veri depolama sağlar.",
    ),
    specs: hdd({
      brand: "TOSHIBA",
      series: "S300 AI Surveillance",
      model: "MG11ACA16TE-V",
      capacity: "16TB",
      rpm: "7200",
      cache: "1024MB",
      workload: "550",
      recording: "CMR",
    }),
  },

  /* Seagate */
  {
    handle: "seagate-skyhawk-1tb-st1000vx013",
    sku: "ST1000VX013",
    brand: "SEAGATE",
    title: "SEAGATE SKYHAWK 1TB 256MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (ST1000VX013)",
    description: paragraphs(
      "Seagate SkyHawk 1TB, DVR ve NVR güvenlik sistemleri için özel olarak geliştirilen yüksek performanslı bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan SkyHawk serisi, güvenlik kameralarından gelen görüntüleri güvenilir ve kesintisiz şekilde depolar. SATA3 6.0 Gb/s arayüzü, 5400 RPM dönüş hızı ve 256MB önbelleği sayesinde uzun süreli kayıt işlemlerinde yüksek kararlılık sağlar.",
    ),
    specs: hdd({ brand: "SEAGATE", series: "SKYHAWK", model: "ST1000VX013", capacity: "1TB", rpm: "5400", cache: "256MB", workload: "180" }),
  },
  {
    handle: "seagate-skyhawk-2tb-st2000vx017",
    sku: "ST2000VX017",
    brand: "SEAGATE",
    title: "SEAGATE SKYHAWK 2TB 256MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (ST2000VX017)",
    description: paragraphs(
      "Seagate SkyHawk 2TB, DVR ve NVR güvenlik sistemleri için özel olarak geliştirilen yüksek performanslı bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan SkyHawk serisi, güvenlik kameralarından gelen görüntüleri güvenilir ve kesintisiz şekilde depolar. SATA3 6.0 Gb/s arayüzü, 5400 RPM dönüş hızı ve 256MB önbelleği sayesinde uzun süreli kayıt işlemlerinde kararlı performans sunar.",
    ),
    specs: hdd({ brand: "SEAGATE", series: "SKYHAWK", model: "ST2000VX017", capacity: "2TB", rpm: "5400", cache: "256MB", workload: "180" }),
  },
  {
    handle: "seagate-skyhawk-4tb-st4000vx016",
    sku: "ST4000VX016",
    brand: "SEAGATE",
    title: "SEAGATE SKYHAWK 4TB 256MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (ST4000VX016)",
    description: paragraphs(
      "Seagate SkyHawk 4TB, DVR ve NVR güvenlik sistemleri için özel olarak geliştirilen yüksek kapasiteli bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan SkyHawk serisi, yüksek çözünürlüklü güvenlik kameralarından gelen görüntüleri güvenilir şekilde depolayarak uzun süreli kayıt imkânı sunar. SATA3 6.0 Gb/s arayüzü, 5400 RPM dönüş hızı ve 256MB önbelleği sayesinde sürekli veri yazma işlemlerinde kararlı performans sağlar.",
    ),
    specs: hdd({ brand: "SEAGATE", series: "SKYHAWK", model: "ST4000VX016", capacity: "4TB", rpm: "5400", cache: "256MB", workload: "180" }),
  },
  {
    handle: "seagate-skyhawk-6tb-st6000vx009",
    sku: "ST6000VX009",
    brand: "SEAGATE",
    title: "SEAGATE SKYHAWK 6TB 256MB SATA3 180TB/Y RV 7/24 GÜVENLİK HARDDISK (ST6000VX009)",
    description: paragraphs(
      "Seagate SkyHawk 6TB, profesyonel DVR ve NVR güvenlik sistemleri için geliştirilen yüksek kapasiteli bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan SkyHawk serisi, yüksek çözünürlüklü güvenlik kameralarından gelen görüntüleri güvenilir şekilde depolayarak uzun süreli kayıt imkânı sunar. SATA3 6.0 Gb/s arayüzü, 5400 RPM dönüş hızı ve 256MB önbelleği sayesinde sürekli veri yazma gerektiren güvenlik uygulamalarında kararlı performans sağlar.",
    ),
    specs: hdd({ brand: "SEAGATE", series: "SKYHAWK", model: "ST6000VX009", capacity: "6TB", rpm: "5400", cache: "256MB", workload: "180", rv: true }),
  },
  {
    handle: "seagate-skyhawk-8tb-st8000vx010",
    sku: "ST8000VX010",
    brand: "SEAGATE",
    title: "SEAGATE SKYHAWK 8TB 256MB SATA3 180TB/Y RV 7/24 GÜVENLİK HARDDISK (ST8000VX010)",
    description: paragraphs(
      "Seagate SkyHawk 8TB, profesyonel DVR ve NVR güvenlik sistemleri için geliştirilen yüksek kapasiteli bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan SkyHawk serisi, yüksek çözünürlüklü güvenlik kameralarından gelen görüntüleri güvenilir şekilde depolayarak uzun süreli kayıt imkânı sunar. SATA3 6.0 Gb/s arayüzü, 7200 RPM dönüş hızı ve 256MB önbelleği sayesinde yoğun veri yazma gerektiren güvenlik uygulamalarında yüksek performans sağlar.",
    ),
    specs: hdd({ brand: "SEAGATE", series: "SKYHAWK", model: "ST8000VX010", capacity: "8TB", rpm: "7200", cache: "256MB", workload: "180", rv: true }),
  },
  {
    handle: "seagate-skyhawk-ai-10tb-st10000ve001",
    sku: "ST10000VE001",
    brand: "SEAGATE",
    title: "SEAGATE SKYHAWK AI 10TB 7200RPM 256MB SATA3 550TB/Y RV 7/24 GÜVENLİK HARDDISK (ST10000VE001)",
    description: paragraphs(
      "Seagate SkyHawk AI 10TB, yapay zekâ destekli DVR, NVR ve video analiz sistemleri için geliştirilen profesyonel bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan SkyHawk AI serisi, yüksek çözünürlüklü kamera kayıtlarını ve AI analiz işlemlerini aynı anda güvenilir şekilde yönetir. 7200 RPM dönüş hızı, 256MB önbellek ve SATA3 6.0 Gb/s arayüzü sayesinde yoğun veri yazma ve okuma işlemlerinde yüksek performans sunar.",
    ),
    specs: hdd({ brand: "SEAGATE", series: "SKYHAWK AI", model: "ST10000VE001", capacity: "10TB", rpm: "7200", cache: "256MB", workload: "550", rv: true }),
  },
  {
    handle: "seagate-skyhawk-ai-12tb-st12000ve003",
    sku: "ST12000VE003",
    brand: "SEAGATE",
    title: "SEAGATE SKYHAWK AI 12TB 7200RPM 512MB SATA3 550TB/Y RV 7/24 GÜVENLİK HARDDISK (ST12000VE003)",
    description: paragraphs(
      "Seagate SkyHawk AI 12TB, yapay zekâ destekli DVR, NVR ve gelişmiş video analiz sistemleri için tasarlanmış profesyonel bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak geliştirilen SkyHawk AI serisi, yüksek çözünürlüklü güvenlik kamera kayıtlarını ve AI tabanlı analiz işlemlerini aynı anda yüksek verimlilikle gerçekleştirir. 7200 RPM dönüş hızı, 512MB önbellek (Cache) ve SATA3 6.0 Gb/s arayüzü sayesinde yoğun veri yazma ve okuma işlemlerinde üstün performans sunar.",
    ),
    specs: hdd({ brand: "SEAGATE", series: "SKYHAWK AI", model: "ST12000VE003", capacity: "12TB", rpm: "7200", cache: "512MB", workload: "550", rv: true }),
  },
  {
    handle: "seagate-skyhawk-ai-16tb-st16000ve004",
    sku: "ST16000VE004",
    brand: "SEAGATE",
    title: "SEAGATE SKYHAWK AI 16TB 7200RPM 512MB SATA3 550TB/Y RV 7/24 GÜVENLİK HARDDISK (ST16000VE004)",
    description: paragraphs(
      "Seagate SkyHawk AI 16TB, yapay zekâ destekli DVR, NVR ve gelişmiş video analiz sistemleri için tasarlanmış yüksek kapasiteli profesyonel bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak geliştirilen SkyHawk AI serisi, yüksek çözünürlüklü güvenlik kamera kayıtlarını ve AI tabanlı analiz işlemlerini aynı anda güvenilir şekilde yönetir. 7200 RPM dönüş hızı, 512MB önbellek (Cache) ve SATA3 6.0 Gb/s arayüzü sayesinde yoğun veri yazma ve okuma işlemlerinde maksimum performans sunar.",
    ),
    specs: hdd({ brand: "SEAGATE", series: "SKYHAWK AI", model: "ST16000VE004", capacity: "16TB", rpm: "7200", cache: "512MB", workload: "550", rv: true }),
  },

  /* Western Digital */
  {
    handle: "wd-purple-1tb-wd11purz",
    sku: "WD11PURZ",
    brand: "WESTERN DIGITAL",
    title: "WD PURPLE 1TB 64MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (WD11PURZ)",
    description: paragraphs(
      "WD Purple 1TB, DVR ve NVR güvenlik sistemleri için özel olarak geliştirilen profesyonel bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan WD Purple serisi, yüksek çözünürlüklü güvenlik kameralarından gelen görüntüleri güvenilir şekilde depolar. SATA3 6.0 Gb/s arayüzü, 5400 RPM dönüş hızı ve 64MB önbelleği sayesinde sürekli kayıt gerektiren güvenlik uygulamalarında kararlı ve güvenilir performans sunar.",
    ),
    specs: hdd({ brand: "WESTERN DIGITAL", series: "PURPLE", model: "WD11PURZ", capacity: "1TB", rpm: "5400", cache: "64MB", workload: "180" }),
  },
  {
    handle: "wd-purple-2tb-wd23purz",
    sku: "WD23PURZ",
    brand: "WESTERN DIGITAL",
    title: "WD PURPLE 2TB 256MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (WD23PURZ)",
    description: paragraphs(
      "WD Purple 2TB, DVR ve NVR güvenlik sistemleri için özel olarak geliştirilen profesyonel bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan WD Purple serisi, yüksek çözünürlüklü güvenlik kameralarından gelen görüntüleri güvenilir şekilde depolar. SATA3 6.0 Gb/s arayüzü, 5400 RPM dönüş hızı ve 256MB önbelleği sayesinde sürekli kayıt gerektiren güvenlik uygulamalarında kararlı ve güvenilir performans sunar.",
    ),
    specs: hdd({ brand: "WESTERN DIGITAL", series: "PURPLE", model: "WD23PURZ", capacity: "2TB", rpm: "5400", cache: "256MB", workload: "180" }),
  },
  {
    handle: "wd-purple-4tb-wd44purz",
    sku: "WD44PURZ",
    brand: "WESTERN DIGITAL",
    title: "WD PURPLE 4TB 128MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (WD44PURZ)",
    description: paragraphs(
      "WD Purple 4TB, DVR ve NVR güvenlik sistemleri için özel olarak geliştirilen profesyonel bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan WD Purple serisi, yüksek çözünürlüklü güvenlik kameralarından gelen görüntüleri güvenilir şekilde depolar. SATA3 6.0 Gb/s arayüzü, 5400 RPM dönüş hızı ve 128MB önbelleği sayesinde sürekli kayıt gerektiren güvenlik uygulamalarında kararlı ve güvenilir performans sunar.",
    ),
    specs: hdd({ brand: "WESTERN DIGITAL", series: "PURPLE", model: "WD44PURZ", capacity: "4TB", rpm: "5400", cache: "128MB", workload: "180" }),
  },
  {
    handle: "wd-purple-6tb-wd64purz",
    sku: "WD64PURZ",
    brand: "WESTERN DIGITAL",
    title: "WD PURPLE 6TB 256MB SATA3 180TB/Y 7/24 GÜVENLİK HARDDISK (WD64PURZ)",
    description: paragraphs(
      "WD Purple 6TB, DVR ve NVR güvenlik sistemleri için özel olarak geliştirilen profesyonel bir gözetim hard diskidir. 7 gün 24 saat kesintisiz çalışmaya uygun olarak tasarlanan WD Purple serisi, yüksek çözünürlüklü güvenlik kameralarından gelen görüntüleri güvenilir şekilde depolar. SATA3 6.0 Gb/s arayüzü, 5400 RPM dönüş hızı ve 256MB önbelleği sayesinde sürekli kayıt gerektiren güvenlik uygulamalarında kararlı ve güvenilir performans sunar.",
    ),
    specs: hdd({ brand: "WESTERN DIGITAL", series: "PURPLE", model: "WD64PURZ", capacity: "6TB", rpm: "5400", cache: "256MB", workload: "180" }),
  },
  {
    handle: "wd-purple-ai-8tb-wd85purz",
    sku: "WD85PURZ",
    brand: "WESTERN DIGITAL",
    title: "WD PURPLE AI 8TB 256MB SATA3 360TB/Y 7/24 GÜVENLİK HARDDISK (WD85PURZ)",
    description: paragraphs(
      "WD Purple AI 8TB, yapay zekâ destekli güvenlik sistemleri için geliştirilmiş profesyonel sınıf bir gözetim sabit diskidir. 7/24 kesintisiz çalışmaya uygun olarak tasarlanan bu disk, yüksek kapasiteli güvenlik kayıtlarını güvenle depolarken aynı zamanda AI destekli analiz iş yüklerini de destekler.",
    ),
    specs: hdd({ brand: "WESTERN DIGITAL", series: "PURPLE AI", model: "WD85PURZ", capacity: "8TB", cache: "256MB", workload: "360" }),
  },
  {
    handle: "wd-purple-pro-ai-10tb-wd102purp",
    sku: "WD102PURP",
    brand: "WESTERN DIGITAL",
    title: "WD PURPLE PRO AI 10TB 7200RPM 512MB SATA3 550TB/Y 7/24 GÜVENLİK HARDDISK (WD102PURP)",
    description: paragraphs(
      "WD Purple Pro AI 10TB, gelişmiş yapay zekâ destekli güvenlik sistemleri için tasarlanmış profesyonel sınıf bir gözetim sabit diskidir. 7/24 kesintisiz çalışmaya uygun yapısı, 7200 RPM dönüş hızı ve 512MB önbelleği sayesinde yüksek çözünürlüklü kamera kayıtlarında üstün performans sunar.",
    ),
    specs: hdd({ brand: "WESTERN DIGITAL", series: "PURPLE PRO AI", model: "WD102PURP", capacity: "10TB", rpm: "7200", cache: "512MB", workload: "550" }),
  },
  {
    handle: "wd-purple-pro-12tb-wd121purp",
    sku: "WD121PURP",
    brand: "WESTERN DIGITAL",
    title: "WD PURPLE PRO 12TB 7200RPM 256MB SATA3 7/24 GÜVENLİK HARDDISK (WD121PURP)",
    description: paragraphs(
      "WD Purple Pro 12TB, profesyonel güvenlik sistemleri için geliştirilmiş yüksek performanslı gözetim sabit diskidir. 7/24 kesintisiz çalışmaya uygun yapısı, 7200 RPM dönüş hızı ve 256MB önbelleği sayesinde yüksek çözünürlüklü kamera kayıtlarını güvenilir şekilde depolar. Büyük ölçekli NVR, DVR ve sunucu tabanlı güvenlik sistemlerinde uzun süreli, kararlı ve yüksek performanslı kayıt çözümü sunar.",
    ),
    specs: hdd({ brand: "WESTERN DIGITAL", series: "PURPLE PRO", model: "WD121PURP", capacity: "12TB", rpm: "7200", cache: "256MB" }),
  },
];
