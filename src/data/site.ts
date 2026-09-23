/**
 * Site chrome data: navigation, utility links, footer, brands.
 * Our own brand identity — nothing here is taken from the reference site.
 */

export const SITE = {
  name: 'SEENERGY',
  shortName: 'SEENERGY',
  tagline: 'Elektronik ve Teknoloji Tedariki',
  promo: '1000 TL ÜZERİ ÜCRETSİZ KARGO',
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  /** Column heading — rendered in the mega panel's orange heading style. */
  title: string;
  href: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href: string;
  /** Mega-menu columns. Measured target: 5 columns per category. */
  groups?: NavGroup[];
}

/**
 * Twelve top-level categories, matching the reference's navigation depth and
 * two-line label rhythm. Category names are generic electronics retail terms.
 *
 * Measured: the mega panel is 1400x210 and holds five columns, each a heading
 * followed by 3-6 links at a 24px pitch. Five headings with no links under
 * them collapse the panel to 63px, so every category carries a full
 * five-column set. Link counts vary the way a real catalogue does — the
 * reference's own categories were counted at 13-31 links.
 */
export const PRIMARY_NAV: NavItem[] = [
  {
    label: 'Uydu Sistemleri',
    href: '/kategori/uydu-sistemleri',
    groups: [
      {
        title: 'Uydu Alıcıları',
        href: '/kategori/uydu-alicilari',
        links: [
          { label: '4K Uydu Alıcılar', href: '/kategori/4k-uydu-alicilar' },
          { label: 'HD Uydu Alıcılar', href: '/kategori/hd-uydu-alicilar' },
          { label: 'Wifi Uydu Alıcısı', href: '/kategori/wifi-uydu-alicisi' },
          { label: 'Mini Uydu Alıcısı', href: '/kategori/mini-uydu-alicisi' },
          { label: 'IP Tv Box', href: '/kategori/ip-tv-box' },
          { label: 'Android Box', href: '/kategori/android-box' },
        ],
      },
      {
        title: 'LNB Çeşitleri',
        href: '/kategori/lnb-cesitleri',
        links: [
          { label: 'Tekli LNB', href: '/kategori/tekli-lnb' },
          { label: 'İkili LNB', href: '/kategori/ikili-lnb' },
          { label: 'Dörtlü LNB', href: '/kategori/dortlu-lnb' },
          { label: 'Sekizli LNB', href: '/kategori/sekizli-lnb' },
          { label: 'Unicable LNB', href: '/kategori/unicable-lnb' },
        ],
      },
      {
        title: 'Anten Çeşitleri',
        href: '/kategori/anten-cesitleri',
        links: [
          { label: 'Çanak Anten', href: '/kategori/canak-anten' },
          { label: 'Karavan Anteni', href: '/kategori/karavan-anteni' },
          { label: 'Çubuk Anten', href: '/kategori/cubuk-anten' },
          { label: 'Anten Direği', href: '/kategori/anten-diregi' },
          { label: 'Anten Ayağı', href: '/kategori/anten-ayagi' },
        ],
      },
      {
        title: 'Uydu Santralleri',
        href: '/kategori/uydu-santralleri',
        links: [
          { label: 'Merkezi Sistem Santrali', href: '/kategori/merkezi-sistem-santrali' },
          { label: 'Multiswitch', href: '/kategori/multiswitch' },
          { label: 'Diseqc Switch', href: '/kategori/diseqc-switch' },
          { label: 'Sinyal Yükseltici', href: '/kategori/sinyal-yukseltici' },
        ],
      },
      {
        title: 'Uydu Ekipmanları',
        href: '/kategori/uydu-ekipmanlari',
        links: [
          { label: 'Uydu Yön Bulucu', href: '/kategori/uydu-yon-bulucu' },
          { label: 'Uydu Sinyal Ölçer', href: '/kategori/uydu-sinyal-olcer' },
          { label: 'Uydu Konnektörü', href: '/kategori/uydu-konnektoru' },
          { label: 'Anten Splitter', href: '/kategori/anten-splitter' },
          { label: 'Montaj Aparatları', href: '/kategori/uydu-montaj-aparatlari' },
        ],
      },
    ],
  },
  {
    label: 'Tv Yedek Parça',
    href: '/kategori/tv-yedek-parca',
    groups: [
      {
        title: 'Led Bar Çeşitleri',
        href: '/kategori/led-bar',
        links: [
          { label: '32 İnç Led Bar', href: '/kategori/32-inc-led-bar' },
          { label: '43 İnç Led Bar', href: '/kategori/43-inc-led-bar' },
          { label: '50 İnç Led Bar', href: '/kategori/50-inc-led-bar' },
          { label: '55 İnç Led Bar', href: '/kategori/55-inc-led-bar' },
          { label: 'Led Bar Aparatları', href: '/kategori/led-bar-aparatlari' },
          { label: 'Led Bar Diyotu', href: '/kategori/led-bar-diyotu' },
        ],
      },
      {
        title: 'Tv Panel',
        href: '/kategori/tv-panel',
        links: [
          { label: 'Açık Hücre Panel', href: '/kategori/acik-hucre-panel' },
          { label: 'Panel Flex Kablosu', href: '/kategori/panel-flex-kablosu' },
          { label: 'Panel Bandı', href: '/kategori/panel-bandi' },
          { label: 'Panel Değişim Seti', href: '/kategori/panel-degisim-seti' },
        ],
      },
      {
        title: 'Kart ve Board',
        href: '/kategori/tv-kart-board',
        links: [
          { label: 'Main Board', href: '/kategori/main-board' },
          { label: 'Power Board', href: '/kategori/power-board' },
          { label: 'T-Con Board', href: '/kategori/t-con-board' },
          { label: 'Wifi Modülü', href: '/kategori/tv-wifi-modulu' },
          { label: 'Buton ve Sensör Kartı', href: '/kategori/buton-sensor-karti' },
        ],
      },
      {
        title: 'Tv Aksesuarları',
        href: '/kategori/tv-aksesuarlari',
        links: [
          { label: 'Askı Aparatları', href: '/kategori/tv-aski-aparatlari' },
          { label: 'Tv Ayağı', href: '/kategori/tv-ayagi' },
          { label: 'Ekran Koruyucu Cam', href: '/kategori/tv-ekran-koruyucu' },
          { label: 'Tv Besleme Kablosu', href: '/kategori/tv-besleme-kablosu' },
        ],
      },
      {
        title: 'Tv Tamir Malzemeleri',
        href: '/kategori/tv-tamir-malzemeleri',
        links: [
          { label: 'Panel Yapıştırıcı', href: '/kategori/panel-yapistirici' },
          { label: 'Isıya Dayanıklı Bant', href: '/kategori/isiya-dayanikli-bant' },
          { label: 'Optik ve Lens Seti', href: '/kategori/tv-optik-lens-seti' },
          { label: 'Yedek Vida Seti', href: '/kategori/yedek-vida-seti' },
        ],
      },
    ],
  },
  {
    label: 'Kumanda Çeşitleri',
    href: '/kategori/kumanda-cesitleri',
    groups: [
      {
        title: 'Televizyon Kumandaları',
        href: '/kategori/tv-kumandalari',
        links: [
          { label: 'Universal Tv Kumandası', href: '/kategori/universal-tv-kumandasi' },
          { label: 'Smart Tv Kumandası', href: '/kategori/smart-tv-kumandasi' },
          { label: 'Sesli Kumanda', href: '/kategori/sesli-kumanda' },
          { label: 'Orijinal Tv Kumandaları', href: '/kategori/orijinal-tv-kumandalari' },
        ],
      },
      {
        title: 'Uydu Kumandaları',
        href: '/kategori/uydu-kumandalari',
        links: [
          { label: 'Uydu Alıcı Kumandası', href: '/kategori/uydu-alici-kumandasi' },
          { label: 'IP Box Kumandası', href: '/kategori/ip-box-kumandasi' },
          { label: 'Android Box Kumandası', href: '/kategori/android-box-kumandasi' },
        ],
      },
      {
        title: 'Klima Kumandaları',
        href: '/kategori/klima-kumandalari',
        links: [
          { label: 'Universal Klima Kumandası', href: '/kategori/universal-klima-kumandasi' },
          { label: 'Split Klima Kumandası', href: '/kategori/split-klima-kumandasi' },
          { label: 'Isıtıcı Kumandası', href: '/kategori/isitici-kumandasi' },
        ],
      },
      {
        title: 'Akıllı Kumandalar',
        href: '/kategori/akilli-kumandalar',
        links: [
          { label: 'Wifi Akıllı Kumanda', href: '/kategori/wifi-akilli-kumanda' },
          { label: 'Bluetooth Kumanda', href: '/kategori/bluetooth-kumanda' },
          { label: 'Öğrenmeli Kumanda', href: '/kategori/ogrenmeli-kumanda' },
          { label: 'Uygulama Kontrollü Kumanda', href: '/kategori/uygulama-kontrollu-kumanda' },
        ],
      },
      {
        title: 'Kumanda Aksesuarları',
        href: '/kategori/kumanda-aksesuarlari',
        links: [
          { label: 'Kumanda Kılıfı', href: '/kategori/kumanda-kilifi' },
          { label: 'Kumanda Pili', href: '/kategori/kumanda-pili' },
          { label: 'Kumanda Tuş Takımı', href: '/kategori/kumanda-tus-takimi' },
          { label: 'Kumanda Standı', href: '/kategori/kumanda-standi' },
        ],
      },
    ],
  },
  {
    label: 'Seslendirme Sistemleri',
    href: '/kategori/seslendirme-sistemleri',
    groups: [
      {
        title: 'Hoparlör Çeşitleri',
        href: '/kategori/hoparlor-cesitleri',
        links: [
          { label: 'Kabin Hoparlörler', href: '/kategori/kabin-hoparlor' },
          { label: 'Tavan Hoparlörleri', href: '/kategori/tavan-hoparlor' },
          { label: 'Duvar Tipi Hoparlör', href: '/kategori/duvar-tipi-hoparlor' },
          { label: 'Horn Hoparlör', href: '/kategori/horn-hoparlor' },
          { label: 'Sütun Hoparlör', href: '/kategori/sutun-hoparlor' },
          { label: 'Bahçe Hoparlörü', href: '/kategori/bahce-hoparloru' },
        ],
      },
      {
        title: 'Anfi ve Mikser',
        href: '/kategori/anfi-mikser',
        links: [
          { label: 'Trafolu Anfi', href: '/kategori/trafolu-anfi' },
          { label: 'Power Anfi', href: '/kategori/power-anfi' },
          { label: 'Mikser Anfi', href: '/kategori/mikser-anfi' },
          { label: 'Ses Mikseri', href: '/kategori/ses-mikseri' },
          { label: 'Ekolayzer', href: '/kategori/ekolayzer' },
        ],
      },
      {
        title: 'Mikrofonlar',
        href: '/kategori/mikrofon',
        links: [
          { label: 'Telsiz Mikrofon', href: '/kategori/telsiz-mikrofon' },
          { label: 'Yaka Mikrofonu', href: '/kategori/yaka-mikrofonu' },
          { label: 'Kürsü Mikrofonu', href: '/kategori/kursu-mikrofonu' },
          { label: 'El Mikrofonu', href: '/kategori/el-mikrofonu' },
          { label: 'Stüdyo Mikrofonu', href: '/kategori/studyo-mikrofonu' },
        ],
      },
      {
        title: 'Cami Seslendirme',
        href: '/kategori/cami-seslendirme',
        links: [
          { label: 'Minare Hoparlörü', href: '/kategori/minare-hoparloru' },
          { label: 'Cami Anfisi', href: '/kategori/cami-anfisi' },
          { label: 'Cami Mikrofonu', href: '/kategori/cami-mikrofonu' },
          { label: 'Cami Ses Seti', href: '/kategori/cami-ses-seti' },
        ],
      },
      {
        title: 'Ses Aksesuarları',
        href: '/kategori/ses-aksesuarlari',
        links: [
          { label: 'Hoparlör Kablosu', href: '/kategori/hoparlor-kablosu' },
          { label: 'Mikrofon Standı', href: '/kategori/mikrofon-standi' },
          { label: 'Jak ve Konnektör', href: '/kategori/ses-jak-konnektor' },
          { label: 'Enstrüman Aksesuarları', href: '/kategori/enstruman-aksesuarlari' },
          { label: 'Tur Rehber Sistemi', href: '/kategori/tur-rehber-sistemi' },
        ],
      },
    ],
  },
  {
    label: 'Güvenlik Sistemleri',
    href: '/kategori/guvenlik-sistemleri',
    groups: [
      {
        title: 'Kamera Çeşitleri',
        href: '/kategori/kamera-cesitleri',
        links: [
          { label: 'AHD Kameralar', href: '/kategori/ahd-kamera' },
          { label: 'IP Kameralar', href: '/kategori/ip-kamera' },
          { label: 'Dome Kamera', href: '/kategori/dome-kamera' },
          { label: 'Bullet Kamera', href: '/kategori/bullet-kamera' },
          { label: 'Fotokapan', href: '/kategori/fotokapan' },
          { label: 'Bebek Kamerası', href: '/kategori/bebek-kamerasi' },
        ],
      },
      {
        title: 'Kayıt Cihazları',
        href: '/kategori/kayit-cihazlari',
        links: [
          { label: 'DVR Kayıt Cihazı', href: '/kategori/dvr-kayit-cihazi' },
          { label: 'NVR Kayıt Cihazı', href: '/kategori/nvr-kayit-cihazi' },
          { label: 'Güvenlik Hard Diski', href: '/kategori/guvenlik-hard-diski' },
          { label: 'Kayıt Cihazı Kabini', href: '/kategori/kayit-cihazi-kabini' },
        ],
      },
      {
        title: 'Alarm Sistemleri',
        href: '/kategori/alarm-sistemleri',
        links: [
          { label: 'Kablosuz Alarm Seti', href: '/kategori/kablosuz-alarm-seti' },
          { label: 'Hareket Dedektörü', href: '/kategori/hareket-dedektoru' },
          { label: 'Duman Dedektörü', href: '/kategori/duman-dedektoru' },
          { label: 'Siren ve Flaşör', href: '/kategori/siren-flasor' },
        ],
      },
      {
        title: 'Diafon Sistemleri',
        href: '/kategori/diafon-sistemleri',
        links: [
          { label: 'Görüntülü Diafon', href: '/kategori/goruntulu-diafon' },
          { label: 'Sesli Diafon', href: '/kategori/sesli-diafon' },
          { label: 'Kapı Otomatiği', href: '/kategori/kapi-otomatigi' },
          { label: 'İnterkom', href: '/kategori/interkom' },
        ],
      },
      {
        title: 'Kamera Setleri',
        href: '/kategori/kamera-setleri',
        links: [
          { label: '4 Kameralı Set', href: '/kategori/4-kamerali-set' },
          { label: '8 Kameralı Set', href: '/kategori/8-kamerali-set' },
          { label: '16 Kameralı Set', href: '/kategori/16-kamerali-set' },
          { label: 'Kamera Montaj Aparatı', href: '/kategori/kamera-montaj-aparati' },
          { label: 'Güvenlik Kablosu', href: '/kategori/guvenlik-kablosu' },
        ],
      },
    ],
  },
  {
    label: 'Adaptör, Akü, Pil',
    href: '/kategori/adaptor-aku-pil',
    groups: [
      {
        title: 'Adaptörler',
        href: '/kategori/adaptorler',
        links: [
          { label: 'Notebook Adaptör', href: '/kategori/notebook-adaptor' },
          { label: 'Kamera Adaptörü', href: '/kategori/kamera-adaptoru' },
          { label: 'Şerit Led Adaptörü', href: '/kategori/serit-led-adaptoru' },
          { label: 'Ayarlanabilir Adaptör', href: '/kategori/ayarlanabilir-adaptor' },
          { label: 'Priz Tipi Adaptör', href: '/kategori/priz-tipi-adaptor' },
        ],
      },
      {
        title: 'Akü Çeşitleri',
        href: '/kategori/akuler',
        links: [
          { label: 'Kuru Akü', href: '/kategori/kuru-aku' },
          { label: 'Jel Akü', href: '/kategori/jel-aku' },
          { label: 'Lityum Akü', href: '/kategori/lityum-aku' },
          { label: 'Akü Şarj Cihazı', href: '/kategori/aku-sarj-cihazi' },
        ],
      },
      {
        title: 'Pil Çeşitleri',
        href: '/kategori/piller',
        links: [
          { label: 'Kalem Pil', href: '/kategori/kalem-pil' },
          { label: 'İnce Pil', href: '/kategori/ince-pil' },
          { label: 'Düğme Pil', href: '/kategori/dugme-pil' },
          { label: 'Şarj Edilebilir Pil', href: '/kategori/sarj-edilebilir-pil' },
          { label: 'Pil Şarj Cihazı', href: '/kategori/pil-sarj-cihazi' },
        ],
      },
      {
        title: 'Güç Kaynakları',
        href: '/kategori/guc-kaynaklari',
        links: [
          { label: 'Metal Kasa Güç Kaynağı', href: '/kategori/metal-kasa-guc-kaynagi' },
          { label: 'Slim Güç Kaynağı', href: '/kategori/slim-guc-kaynagi' },
          { label: 'Kesintisiz Güç Kaynağı', href: '/kategori/kesintisiz-guc-kaynagi' },
          { label: 'İnvertör', href: '/kategori/invertor' },
        ],
      },
      {
        title: 'Şarj Ürünleri',
        href: '/kategori/sarj-urunleri',
        links: [
          { label: 'Powerbank', href: '/kategori/powerbank' },
          { label: 'Hızlı Şarj Cihazı', href: '/kategori/hizli-sarj-cihazi' },
          { label: 'Araç Şarj Cihazı', href: '/kategori/arac-sarj-cihazi' },
          { label: 'Kablosuz Şarj Standı', href: '/kategori/kablosuz-sarj-standi' },
        ],
      },
    ],
  },
  {
    label: 'Oto Ses ve Görüntü',
    href: '/kategori/oto-ses-goruntu',
    groups: [
      {
        title: 'Oto Teypler',
        href: '/kategori/oto-teyp',
        links: [
          { label: 'Android Oto Teyp', href: '/kategori/android-oto-teyp' },
          { label: 'Bluetooth Oto Teyp', href: '/kategori/bluetooth-oto-teyp' },
          { label: 'Oto Teyp Çerçevesi', href: '/kategori/oto-teyp-cercevesi' },
        ],
      },
      {
        title: 'Oto Multimedya',
        href: '/kategori/oto-multimedya',
        links: [
          { label: 'Navigasyon Ekranı', href: '/kategori/navigasyon-ekrani' },
          { label: 'Tavan Ekranı', href: '/kategori/tavan-ekrani' },
          { label: 'Multimedya Kablo Seti', href: '/kategori/multimedya-kablo-seti' },
        ],
      },
      {
        title: 'Araç Kameraları',
        href: '/kategori/arac-kamerasi',
        links: [
          { label: 'Geri Görüş Kamerası', href: '/kategori/geri-gorus-kamerasi' },
          { label: 'Araç İçi Kamera', href: '/kategori/arac-ici-kamera' },
          { label: 'Park Sensörü', href: '/kategori/park-sensoru' },
        ],
      },
      {
        title: 'Oto Ses Sistemi',
        href: '/kategori/oto-anfi',
        links: [
          { label: 'Oto Hoparlör', href: '/kategori/oto-hoparlor' },
          { label: 'Oto Subwoofer', href: '/kategori/oto-subwoofer' },
          { label: 'Oto Ses Yalıtımı', href: '/kategori/oto-ses-yalitimi' },
        ],
      },
      {
        title: 'Oto Aksesuar',
        href: '/kategori/oto-aksesuar',
        links: [
          { label: 'Telefon Tutucu', href: '/kategori/arac-telefon-tutucu' },
          { label: 'Çakmaklık Soketi', href: '/kategori/oto-cakmaklik-soketi' },
          { label: 'Araç İçi Aydınlatma', href: '/kategori/arac-ici-aydinlatma' },
        ],
      },
    ],
  },
  {
    label: 'Oem Ve Çevre Birimleri',
    href: '/kategori/oem-cevre-birimleri',
    groups: [
      {
        title: 'Ağ Ürünleri',
        href: '/kategori/ag-urunleri',
        links: [
          { label: 'Access Point / Router', href: '/kategori/access-point-router' },
          { label: 'Menzil Genişletici', href: '/kategori/menzil-genisletici' },
          { label: 'Switch Çeşitleri', href: '/kategori/switch' },
          { label: 'Modemler', href: '/kategori/modemler' },
          { label: 'Ağ Kartı', href: '/kategori/ag-karti' },
        ],
      },
      {
        title: 'Çevre Birimleri',
        href: '/kategori/cevre-birimleri',
        links: [
          { label: 'Klavye ve Mouse', href: '/kategori/klavye-mouse' },
          { label: 'Webcam', href: '/kategori/webcam' },
          { label: 'Kulaklık Seti', href: '/kategori/kulaklik-seti' },
          { label: 'USB Hub', href: '/kategori/usb-hub' },
        ],
      },
      {
        title: 'Depolama Ürünleri',
        href: '/kategori/depolama-urunleri',
        links: [
          { label: 'Harici Disk', href: '/kategori/harici-disk' },
          { label: 'SSD Çeşitleri', href: '/kategori/ssd-cesitleri' },
          { label: 'USB Bellek', href: '/kategori/usb-bellek' },
          { label: 'Hafıza Kartı', href: '/kategori/hafiza-karti' },
        ],
      },
      {
        title: 'Yazıcı ve Sarf',
        href: '/kategori/yazici-sarf',
        links: [
          { label: 'Yazıcı Kablosu', href: '/kategori/yazici-kablosu' },
          { label: 'Toner ve Kartuş', href: '/kategori/toner-kartus' },
          { label: 'Etiket Yazıcı', href: '/kategori/etiket-yazici' },
        ],
      },
      {
        title: 'Kabinet ve Montaj',
        href: '/kategori/kabinet-montaj',
        links: [
          { label: 'Rack Kabinet', href: '/kategori/rack-kabinet' },
          { label: 'Patch Panel', href: '/kategori/patch-panel' },
          { label: 'Kablo Kanalı', href: '/kategori/kablo-kanali' },
          { label: 'Priz ve Anahtar', href: '/kategori/priz-anahtar' },
          { label: 'Akım Korumalı Priz', href: '/kategori/akim-korumali-priz' },
        ],
      },
    ],
  },
  {
    label: 'Led ve Aydınlatma',
    href: '/kategori/led-aydinlatma',
    groups: [
      {
        title: 'Şerit Ledler',
        href: '/kategori/serit-led',
        links: [
          { label: 'İç Mekan Şerit Led', href: '/kategori/ic-mekan-serit-led' },
          { label: 'Dış Mekan Şerit Led', href: '/kategori/dis-mekan-serit-led' },
          { label: 'RGB Şerit Led', href: '/kategori/rgb-serit-led' },
          { label: 'Şerit Led Profili', href: '/kategori/serit-led-profili' },
          { label: 'Şerit Led Kumandası', href: '/kategori/serit-led-kumandasi' },
        ],
      },
      {
        title: 'Led Panel',
        href: '/kategori/led-panel',
        links: [
          { label: 'Sıva Altı Panel', href: '/kategori/siva-alti-panel' },
          { label: 'Sıva Üstü Panel', href: '/kategori/siva-ustu-panel' },
          { label: 'Slim Led Panel', href: '/kategori/slim-led-panel' },
          { label: 'Led Panel Kasası', href: '/kategori/led-panel-kasasi' },
        ],
      },
      {
        title: 'Ampul ve Spot',
        href: '/kategori/ampul-spot',
        links: [
          { label: 'Led Ampul', href: '/kategori/led-ampul' },
          { label: 'Led Spot', href: '/kategori/led-spot' },
          { label: 'Ray Spot', href: '/kategori/ray-spot' },
          { label: 'Sensörlü Ampul', href: '/kategori/sensorlu-ampul' },
        ],
      },
      {
        title: 'Projektörler',
        href: '/kategori/projektor',
        links: [
          { label: 'Led Projektör', href: '/kategori/led-projektor' },
          { label: 'Solar Projektör', href: '/kategori/solar-projektor' },
          { label: 'Bahçe Aydınlatma', href: '/kategori/bahce-aydinlatma' },
          { label: 'Sokak Armatürü', href: '/kategori/sokak-armaturu' },
        ],
      },
      {
        title: 'Dekoratif Aydınlatma',
        href: '/kategori/dekoratif-aydinlatma',
        links: [
          { label: 'Masa Lambası', href: '/kategori/masa-lambasi' },
          { label: 'Sarkıt Aydınlatma', href: '/kategori/sarkit-aydinlatma' },
          { label: 'Gece Lambası', href: '/kategori/gece-lambasi' },
          { label: 'Neon Led', href: '/kategori/neon-led' },
        ],
      },
    ],
  },
  {
    label: 'Ev, Yaşam ve Teknoloji',
    href: '/kategori/ev-yasam-teknoloji',
    groups: [
      {
        title: 'Akıllı Ev',
        href: '/kategori/akilli-ev',
        links: [
          { label: 'Akıllı Priz', href: '/kategori/akilli-priz' },
          { label: 'Akıllı Ampul', href: '/kategori/akilli-ampul' },
          { label: 'Akıllı Kapı Zili', href: '/kategori/akilli-kapi-zili' },
          { label: 'Akıllı Sensör', href: '/kategori/akilli-sensor' },
          { label: 'Perde Motoru', href: '/kategori/akilli-perde-motoru' },
        ],
      },
      {
        title: 'Küçük Ev Aletleri',
        href: '/kategori/kucuk-ev-aletleri',
        links: [
          { label: 'Su Isıtıcı', href: '/kategori/su-isitici' },
          { label: 'Elektrikli Süpürge', href: '/kategori/elektrikli-supurge' },
          { label: 'Tost Makinesi', href: '/kategori/tost-makinesi' },
          { label: 'Vantilatör', href: '/kategori/vantilator' },
        ],
      },
      {
        title: 'Bilgisayar',
        href: '/kategori/bilgisayar',
        links: [
          { label: 'Tablet', href: '/kategori/tablet' },
          { label: 'Monitör', href: '/kategori/monitor' },
          { label: 'Notebook Aksesuarları', href: '/kategori/notebook-aksesuarlari' },
          { label: 'Bilgisayar Kasası', href: '/kategori/bilgisayar-kasasi' },
        ],
      },
      {
        title: 'Giyilebilir Teknoloji',
        href: '/kategori/giyilebilir',
        links: [
          { label: 'Akıllı Saat', href: '/kategori/akilli-saat' },
          { label: 'Akıllı Bileklik', href: '/kategori/akilli-bileklik' },
          { label: 'Kablosuz Kulaklık', href: '/kategori/kablosuz-kulaklik' },
        ],
      },
      {
        title: 'Telefon Aksesuarları',
        href: '/kategori/telefon-aksesuarlari',
        links: [
          { label: 'Telefon Kılıfı', href: '/kategori/telefon-kilifi' },
          { label: 'Ekran Koruyucu', href: '/kategori/ekran-koruyucu' },
          { label: 'Şarj Kablosu', href: '/kategori/telefon-sarj-kablosu' },
          { label: 'Selfie Çubuğu', href: '/kategori/selfie-cubugu' },
        ],
      },
    ],
  },
  {
    label: 'Hırdavat ve Tamir Malzemeleri',
    href: '/kategori/hirdavat-tamir',
    groups: [
      {
        title: 'Havya ve Lehim',
        href: '/kategori/havya',
        links: [
          { label: 'Havya İstasyonu', href: '/kategori/havya-istasyonu' },
          { label: 'Kalem Havya', href: '/kategori/kalem-havya' },
          { label: 'Lehim Teli', href: '/kategori/lehim-teli' },
          { label: 'Lehim Pastası', href: '/kategori/lehim-pastasi' },
          { label: 'Sıcak Hava Tabancası', href: '/kategori/sicak-hava-tabancasi' },
        ],
      },
      {
        title: 'El Aletleri',
        href: '/kategori/el-aletleri',
        links: [
          { label: 'Tornavida Seti', href: '/kategori/tornavida-seti' },
          { label: 'Pense ve Kargaburun', href: '/kategori/pense-kargaburun' },
          { label: 'Kablo Sıyırıcı', href: '/kategori/kablo-siyirici' },
          { label: 'Anahtar Takımı', href: '/kategori/anahtar-takimi' },
          { label: 'Takım Çantası', href: '/kategori/takim-cantasi' },
        ],
      },
      {
        title: 'Ölçü Aletleri',
        href: '/kategori/olcu-aletleri',
        links: [
          { label: 'Multimetre', href: '/kategori/multimetre' },
          { label: 'Pens Ampermetre', href: '/kategori/pens-ampermetre' },
          { label: 'Lazer Metre', href: '/kategori/lazer-metre' },
          { label: 'Faz Kalemi', href: '/kategori/faz-kalemi' },
        ],
      },
      {
        title: 'Elektronik Malzemeler',
        href: '/kategori/elektronik-malzemeler',
        links: [
          { label: 'Direnç ve Kondansatör', href: '/kategori/direnc-kondansator' },
          { label: 'Sigorta Çeşitleri', href: '/kategori/sigorta-cesitleri' },
          { label: 'Röle ve Anahtar', href: '/kategori/role-anahtar' },
          { label: 'Devre Kartı ve Modül', href: '/kategori/devre-karti-modul' },
        ],
      },
      {
        title: 'Fener ve Işıldak',
        href: '/kategori/fener-isildak',
        links: [
          { label: 'El Feneri', href: '/kategori/el-feneri' },
          { label: 'Kafa Feneri', href: '/kategori/kafa-feneri' },
          { label: 'Şarjlı Işıldak', href: '/kategori/sarjli-isildak' },
          { label: 'Kamp Lambası', href: '/kategori/kamp-lambasi' },
        ],
      },
    ],
  },
  {
    label: 'Kablo Çeşitleri',
    href: '/kategori/kablo-cesitleri',
    groups: [
      {
        title: 'Anten Kabloları',
        href: '/kategori/anten-kablolari',
        links: [
          { label: 'RG6 Anten Kablosu', href: '/kategori/rg6-anten-kablosu' },
          { label: 'RG59 Kablo', href: '/kategori/rg59-kablo' },
          { label: 'Hazır Anten Kablosu', href: '/kategori/hazir-anten-kablosu' },
          { label: 'Anten Konnektörü', href: '/kategori/anten-konnektoru' },
        ],
      },
      {
        title: 'Görüntü Kabloları',
        href: '/kategori/goruntu-kablolari',
        links: [
          { label: 'HDMI Kablolar', href: '/kategori/hdmi-kablo' },
          { label: 'VGA Kablo', href: '/kategori/vga-kablo' },
          { label: 'DisplayPort Kablo', href: '/kategori/displayport-kablo' },
          { label: 'RCA Kablo', href: '/kategori/rca-kablo' },
          { label: 'Scart Kablo', href: '/kategori/scart-kablo' },
        ],
      },
      {
        title: 'Ağ Kabloları',
        href: '/kategori/ag-kablolari',
        links: [
          { label: 'Cat6 Kablo', href: '/kategori/cat6-kablo' },
          { label: 'Cat5e Kablo', href: '/kategori/cat5e-kablo' },
          { label: 'Hazır Patch Kablo', href: '/kategori/hazir-patch-kablo' },
          { label: 'Fiber Optik Kablo', href: '/kategori/fiber-optik-kablo' },
        ],
      },
      {
        title: 'Enerji Kabloları',
        href: '/kategori/enerji-kablolari',
        links: [
          { label: 'NYA Kablo', href: '/kategori/nya-kablo' },
          { label: 'TTR Kablo', href: '/kategori/ttr-kablo' },
          { label: 'Uzatma Kablosu', href: '/kategori/uzatma-kablosu' },
          { label: 'Makaralı Uzatma', href: '/kategori/makarali-uzatma' },
        ],
      },
      {
        title: 'Alarm Kabloları',
        href: '/kategori/alarm-kablolari',
        links: [
          { label: 'Yangın Alarm Kablosu', href: '/kategori/yangin-alarm-kablosu' },
          { label: 'Diafon Kablosu', href: '/kategori/diafon-kablosu' },
          { label: 'Hoparlör Hattı Kablosu', href: '/kategori/hoparlor-hatti-kablosu' },
          { label: 'Kablo Bağı ve Klips', href: '/kategori/kablo-bagi-klips' },
        ],
      },
    ],
  },
];

export const UTILITY_LINKS = [
  { label: 'Hakkımızda', href: '/hakkimizda', icon: 'info' as const },
  { label: 'İletişim', href: '/iletisim', icon: 'phone' as const },
  { label: 'Toptan Sipariş', href: '/toptan-satis', icon: 'truck' as const },
  { label: 'Yetkili Satıcımız Olun', href: '/bayi-basvurusu', icon: 'badge' as const },
];

/**
 * Category promo tiles.
 *
 * `image` is the tile background, `product` is the device shown on the right —
 * the reference tiles are half graphic panel, half product shot, and a tile
 * without the product reads as an empty placeholder.
 */
export interface CategoryTile {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  product: string;
}

/* `product` points at the transparent cutout, not the plated product image:
   these tiles have coloured backgrounds and the plated version shows its white
   plate as a box on them. */
export const CATEGORY_TILES: CategoryTile[] = [
  { title: 'Uydu', subtitle: 'Sistemleri', href: '/kategori/uydu-sistemleri', image: '/mock/categories/uydu-sistemleri.svg', product: '/mock/products/cutout/receiver-graphite.svg' },
  { title: 'Profesyonel', subtitle: 'Ses Sistemleri', href: '/kategori/seslendirme-sistemleri', image: '/mock/categories/ses-sistemleri.svg', product: '/mock/products/cutout/speaker-black.svg' },
  { title: 'Tv Led Bar', subtitle: 'Çeşitleri', href: '/kategori/led-bar', image: '/mock/categories/led-aydinlatma.svg', product: '/mock/products/cutout/ledbar-silver.svg' },
  { title: 'Ev ve Yaşam', subtitle: 'Ürünleri', href: '/kategori/ev-yasam-teknoloji', image: '/mock/categories/ev-teknolojileri.svg', product: '/mock/products/cutout/router-white.svg' },
];

export const CATEGORY_TILES_SECONDARY: CategoryTile[] = [
  { title: 'Elektronik', subtitle: 'Malzemeler', href: '/kategori/hirdavat-tamir', image: '/mock/categories/elektronik-malzemeler.svg', product: '/mock/products/cutout/meter-graphite.svg' },
  { title: 'Fener & Işıldak', subtitle: 'Çeşitleri', href: '/kategori/fener-isildak', image: '/mock/categories/fener-isildak.svg', product: '/mock/products/cutout/adapter-silver.svg' },
  { title: 'Ölçü Aleti', subtitle: 'Çeşitleri', href: '/kategori/olcu-aletleri', image: '/mock/categories/olcu-aletleri.svg', product: '/mock/products/cutout/meter-black.svg' },
  { title: 'Güvenlik', subtitle: 'Sistemleri', href: '/kategori/guvenlik-sistemleri', image: '/mock/categories/guvenlik-sistemleri.svg', product: '/mock/products/cutout/camera-white.svg' },
];

/**
 * Hero slides.
 *
 * `chips` are three short, concrete facts per slide — what the category
 * actually covers. Every one of them is already claimed elsewhere on this site
 * (the catalogue's own categories, the 13.000+ figure in the campaign banner,
 * the installation support named in the editorial block), because a hero is
 * the worst place to invent a promise the rest of the site cannot keep.
 */
/**
 * The two tiles stacked beside the hero from `dt` up.
 *
 * Both destinations already exist on this site and both claims are already
 * made elsewhere on the homepage — the campaign tile in band 07 and the b2b
 * badge in the masthead. Nothing here is a new promise: a hero is the worst
 * place to invent one, and a secondary tile beside it is the second worst.
 *
 * They are the two most valuable non-category entry points a technical
 * storefront has: what is discounted, and how a business buys.
 */
export const HERO_SIDE = [
  {
    eyebrow: 'Kampanya',
    title: 'Süper Fırsat Ürünleri',
    href: '/kampanyalar',
    /* wide-2 and wide-3, not half-1/half-2: those two are the dual brand
       banners further down the page, and using them here put the same artwork
       on screen twice. */
    image: '/mock/campaigns/wide-2.svg',
  },
  {
    eyebrow: 'Kurumsal',
    title: 'Toptan alım ve bayilik',
    href: '/toptan-satis',
    image: '/mock/campaigns/wide-3.svg',
  },
];

export const HERO_SLIDES = [
  {
    eyebrow: 'Akıllı ev ve güvenlik',
    title: 'Akıllı Ev Sistemleri',
    description: 'Kameradan diafona, tüm akıllı ev çözümleri tek çatıda.',
    chips: ['Kamera ve diafon', 'Akıllı priz ve röle', 'Kurulum desteği'],
    cta: 'Alışverişe Başla',
    href: '/kategori/akilli-ev',
    image: '/mock/hero/hero-1.svg',
  },
  {
    eyebrow: 'Seslendirme sistemleri',
    title: 'Profesyonel Ses',
    description: 'Sahne ve mekân seslendirmesinde toptan fiyat avantajı.',
    chips: ['Anfi ve mikser', 'Tavan ve kolon hoparlör', 'Toptan fiyat'],
    cta: 'Ürünleri İncele',
    href: '/kategori/seslendirme-sistemleri',
    image: '/mock/hero/hero-2.svg',
  },
  {
    eyebrow: 'Televizyon yedek parça',
    title: 'Tv Yedek Parça',
    description: '13.000+ televizyon modeline uyumlu led bar ve panel stoğu.',
    chips: ['13.000+ model', 'Led bar ve panel', 'Uyumluluk desteği'],
    cta: 'Stoğu Görüntüle',
    href: '/kategori/tv-yedek-parca',
    image: '/mock/hero/hero-3.svg',
  },
];

export const BLOG_POSTS = [
  { title: 'Adaptör Nedir? Adaptör Çeşitleri Nelerdir?', href: '/blog/adaptor-nedir', image: '/mock/blog/blog-1.svg' },
  { title: 'Access Point ve Router Arasındaki Farklar Nelerdir?', href: '/blog/access-point-router', image: '/mock/blog/blog-2.svg' },
  { title: 'ABS Plastik Nedir? Nerelerde Kullanılır?', href: '/blog/abs-plastik-nedir', image: '/mock/blog/blog-3.svg' },
  { title: 'Akıllı Kumanda Nasıl Sıfırlanır?', href: '/blog/akilli-kumanda-sifirlama', image: '/mock/blog/blog-4.svg' },
];

export const BRANDS = [
  'Voltra', 'Nexora', 'Kablonis', 'Sunmax', 'Orbisat', 'Lumenta',
  'Akuform', 'Tekniva', 'Sonora', 'Provista', 'Elektroma', 'Digiwave',
  'Amperis', 'Cabletek', 'Vizyontek', 'Megavolt', 'Sesyapı', 'Ledora',
  'Kumandax', 'Servisan', 'Metrion', 'Bataryam', 'Antenix', 'Fotokam',
  'Powerin', 'Sinyalis', 'Tamirix', 'Optivolt', 'Rezonans', 'Devrelab',
  'Elektromar', 'Voltbir', 'Kabloteknik', 'Sesmar', 'Antenpro', 'Ledvolt',
  'Trafolux', 'Guvenix', 'Sarjmatik', 'Devreport', 'Termolab', 'Anahtarix',
  'Isiksan', 'Enerjix', 'Kontakform',
].map((name) => ({
  name,
  href: `/marka/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
  image: `/mock/brands/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.svg`,
}));

/**
 * Brand showcases — the seven homepage bands the client asked for, built on the
 * structure the "All In One Bilgisayarlar" band used, one per brand.
 *
 * `brand` is the catalogue key, so the band's products come from the catalogue
 * itself (`byBrand`) rather than a hand-maintained second list that could drift
 * out of sync with it. Every featured brand carries at least four products.
 */
export interface BrandSectionItem {
  brand: string;
  tagline: string;
  href: string;
  logo: string;
}

export const BRAND_SECTIONS: BrandSectionItem[] = [
  { brand: 'Tekniva', tagline: 'All in one bilgisayarlar ve monitörler', href: '/marka/tekniva', logo: '/mock/brands/tekniva.svg' },
  { brand: 'Orbisat', tagline: 'Uydu alıcıları ve santral sistemleri', href: '/marka/orbisat', logo: '/mock/brands/orbisat.svg' },
  { brand: 'Sonora', tagline: 'Profesyonel ses ve sahne sistemleri', href: '/marka/sonora', logo: '/mock/brands/sonora.svg' },
  { brand: 'Provista', tagline: 'Güvenlik kameraları ve kayıt cihazları', href: '/marka/provista', logo: '/mock/brands/provista.svg' },
  { brand: 'Ledora', tagline: 'Televizyon led bar ve panel yedek parçaları', href: '/marka/ledora', logo: '/mock/brands/ledora.svg' },
  { brand: 'Voltra', tagline: 'Oto ses, multimedya ve görüntü sistemleri', href: '/marka/voltra', logo: '/mock/brands/voltra.svg' },
  { brand: 'Kumandax', tagline: 'Televizyon, uydu ve klima kumandaları', href: '/marka/kumandax', logo: '/mock/brands/kumandax.svg' },
];

/**
 * The five product-page statements (docs/COMMERCE_RULES §12).
 *
 * CONFIGURABLE PLACEHOLDERS — deliberately so. Not one of them asserts a
 * certification, a guarantee percentage or an award, because none of that can
 * be substantiated from here. Replace the text, keep the restraint.
 */
export const PRODUCT_TRUST = [
  { icon: 'invoice' as const, label: 'Faturalı ürün' },
  { icon: 'badge' as const, label: 'Garanti kapsamında' },
  { icon: 'truck' as const, label: 'Kargoya aynı gün hazırlanır' },
  { icon: 'refresh' as const, label: '14 gün içinde iade' },
  { icon: 'support' as const, label: 'Teknik destek hattı' },
];

export const TRUST_ITEMS = [
  { title: 'Ücretsiz Kargo', subtitle: '1000 TL ve Üzeri Alışverişlerde', icon: 'truck' as const },
  // Was "Orijinal Ürünler — %100 Faturalı ve Garantili". Both halves broke
  // docs/COMMERCE_RULES §12: a guarantee percentage ("%100 …") is named there
  // as forbidden anywhere in the build, and "orijinal" asserts an authenticity
  // this project cannot substantiate. Restated to match PRODUCT_TRUST, which
  // already held the right tone.
  { title: 'Faturalı Ürün', subtitle: 'Garanti Kapsamında', icon: 'badge' as const },
  { title: 'Güvenli Alışveriş', subtitle: '256Bit SSL Koruması', icon: 'lock' as const },
  { title: 'Kolay İade', subtitle: '14 İş Günü İçinde', icon: 'refresh' as const },
];

/**
 * Measured: the reference's corporate footer is three link columns of 7 / 7 / 5
 * followed by a contact block on the right, not four even columns of five.
 */
export const FOOTER_COLUMNS = [
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'B2B Bayi Girişi', href: '/b2b-giris' },
      { label: 'Bayi Başvurusu', href: '/bayi-basvurusu' },
      { label: 'İş İlanları', href: '/is-ilanlari' },
      { label: 'İletişim', href: '/iletisim' },
      { label: 'Blog', href: '/blog' },
      { label: 'Toptan Satış', href: '/toptan-satis' },
    ],
  },
  {
    title: 'Müşteri İlişkileri',
    links: [
      { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis' },
      { label: 'Gizlilik ve Güvenlik', href: '/gizlilik' },
      { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
      { label: 'İade ve Değişim Şartları', href: '/iade-degisim' },
      { label: 'Kişisel Verilerin Korunması', href: '/kvkk' },
      { label: 'Çerez Politikası', href: '/cerez-politikasi' },
      { label: 'Sıkça Sorulan Sorular', href: '/sss' },
    ],
  },
  {
    title: 'Sipariş İşlemleri',
    links: [
      { label: 'Sipariş Takibi', href: '/siparis-takibi' },
      { label: 'Havale Bildirim Formu', href: '/havale-bildirim' },
      { label: 'Kargo ve Teslimat', href: '/kargo-teslimat' },
      { label: 'Garanti Koşulları', href: '/garanti' },
      { label: 'Toptan Alışveriş', href: '/toptan-satis' },
    ],
  },
];

/**
 * Measured: the reference renders "Popüler Kategoriler" as 6 columns × 5 rows
 * = 30 links. At 16 items the block was two rows short and the footer came out
 * ~400px under the reference's 897px (brief §25 — footer density must match).
 */
export const POPULAR_CATEGORIES = [
  'Uydu Alıcı Sistemleri', '4K Uydu Alıcılar', 'LNB Çeşitleri', 'Elektronik Malzemeler',
  'Uydu Alıcılar', 'Seslendirme Hoparlörleri', 'Merkezi Anten Santralleri', 'Tv Yedek Parça',
  'Tv Led Bar', 'IP Tv Box', 'Anten Kabloları', 'Enstrüman Aksesuarları',
  'Çanak Anten', 'Cami Seslendirme', 'Fotokapan', 'Askı Aparatları',
  'Access Point', 'İnvertör Fiyatları', 'Kuru Akü', 'Akım Korumalı Priz',
  'Notebook Adaptör', 'Samsung Led Bar', 'Tv Tamir Malzemeleri', 'Tırnak Masa Lambası',
  'Güvenlik Sistemleri', 'Tv Panel Değişimi', 'Akü Şarj Cihazı', 'Tur Rehber Sistemi',
  'Kumanda Çeşitleri', 'Ölçü Aletleri',
];

/**
 * Accepted payment methods, drawn as neutral text chips.
 * The reference shows a row of card-scheme logos here; those are third-party
 * trademarks, so the row's *shape* is reproduced with generic labels instead
 * (brief §10).
 */
export const PAYMENT_METHODS = [
  'Kredi Kartı', 'Banka Kartı', 'Havale / EFT', 'Kapıda Ödeme',
  'Taksitli Ödeme', 'Kurumsal Fatura',
];
