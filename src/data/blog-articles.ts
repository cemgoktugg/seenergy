/**
 * The blog's articles (2026-10-24). The homepage's blog cards (BLOG_POSTS in
 * site.ts) link to the first four; the CCTV guide is listed on /blog. Each
 * body is a list of blocks: `h` a heading, `p` a paragraph, `ul` a list.
 * General, verifiable product knowledge only — no claims about the shop.
 */

export type Block = { h: string } | { p: string } | { ul: string[] };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  /** Where the reader goes next: a category that sells what the article is about. */
  related: { label: string; href: string };
  body: Block[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'ahd-mi-ip-kamera-mi',
    title: 'AHD mi, IP Kamera mı? Doğru Güvenlik Kamerası Sistemini Seçmek',
    excerpt:
      'Koaksiyel kabloyla çalışan AHD sistemler ile ağ kablosuyla çalışan IP sistemler arasındaki farklar ve hangisinin size uygun olduğu.',
    image: '/mock/products/cutout/camera-white.svg',
    related: { label: 'CCTV Güvenlik Sistemleri', href: '/kategori/cctv-guvenlik-sistemleri' },
    body: [
      {
        p: 'Güvenlik kamerası sistemi kurarken ilk karar teknolojidir: AHD (analog yüksek çözünürlük) mi, IP (ağ tabanlı) mi? İkisi de bugün net görüntü verir; fark kablolama, kurulum esnekliği ve büyüme imkânındadır.',
      },
      { h: 'AHD sistem nasıl çalışır?' },
      {
        p: 'AHD kameralar görüntüyü koaksiyel kablo (BNC bağlantı) üzerinden DVR adı verilen kayıt cihazına iletir. Her kamera DVR’a ayrı bir kabloyla bağlanır ve kameraya ayrıca 12 V besleme verilir.',
      },
      {
        ul: [
          'Kurulumu basittir, ağ ayarı gerektirmez.',
          'Eski analog sistemlerin koaksiyel kabloları çoğu zaman yeniden kullanılabilir.',
          'Maliyeti genellikle IP sistemlerden düşüktür.',
          '2 MP (1080p) çözünürlük ev ve küçük iş yerleri için çoğu zaman yeterlidir.',
        ],
      },
      { h: 'IP sistem nasıl çalışır?' },
      {
        p: 'IP kameralar görüntüyü ağ kablosu (Cat5e / Cat6) üzerinden NVR kayıt cihazına veya doğrudan ağa iletir. PoE destekli cihazlarda görüntü ve elektrik aynı kablodan geçer.',
      },
      {
        ul: [
          '5 MP ve üzeri yüksek çözünürlük, daha fazla ayrıntı.',
          'H.265+ sıkıştırma sayesinde aynı diskte daha uzun kayıt süresi.',
          'Kameralar ağ üzerinden eklendiği için sistemi büyütmek kolaydır.',
          'İnsan / araç algılama gibi akıllı özellikler daha yaygındır.',
        ],
      },
      { h: 'Hangisini seçmeliyim?' },
      {
        ul: [
          'Mevcut koaksiyel kablolar varsa ve 4–8 kamera yetecekse: AHD sistem ekonomik bir çözümdür.',
          'Yeni kablolama yapılacaksa, plaka / yüz ayrıntısı gerekiyorsa veya sistem büyüyecekse: IP sistem.',
          'Kablo çekilemeyen yerler için: Wi-Fi kameralar; elektrik ve internet olmayan alanlar için 4G solar kameralar.',
        ],
      },
      {
        p: 'Kamera sayısı, gece görüş mesafesi ve kayıt süresi gibi bilgileri ilettiğinizde size uygun kamera ve kayıt cihazı listesini birlikte çıkarabiliriz.',
      },
    ],
  },
  {
    slug: 'adaptor-nedir',
    title: 'Adaptör Nedir? Adaptör Çeşitleri Nelerdir?',
    excerpt: 'Adaptörün görevi, voltaj ve akım değerlerinin anlamı ve doğru adaptör seçerken dikkat edilmesi gerekenler.',
    image: '/mock/products/cutout/adapter-white.svg',
    related: { label: 'Aksesuarlar', href: '/kategori/aksesuarlar' },
    body: [
      {
        p: 'Adaptör, şebekeden gelen 220 V alternatif akımı (AC) cihazların ihtiyaç duyduğu düşük voltajlı doğru akıma (DC) çeviren güç kaynağıdır. Güvenlik kameraları, modemler ve kayıt cihazları gibi birçok elektronik cihaz bir adaptörle çalışır.',
      },
      { h: 'Etiketteki değerler ne anlama gelir?' },
      {
        ul: [
          'Çıkış voltajı (V): Cihazın istediği değerle birebir aynı olmalıdır. Güvenlik kameralarının çoğu 12 V DC ile çalışır.',
          'Çıkış akımı (A): Adaptörün verebileceği en yüksek akımdır; cihazın çektiği akıma eşit ya da ondan büyük olmalıdır.',
          'Güç (W): Voltaj ile akımın çarpımıdır (12 V × 2 A = 24 W).',
          'Uç tipi ve kutup: Fiş çapı ve artı / eksi yönü cihaza uygun olmalıdır.',
        ],
      },
      { h: 'Adaptör çeşitleri' },
      {
        ul: [
          'Priz tipi adaptörler: Tek bir cihazı besler, en yaygın tiptir.',
          'Masaüstü (kablolu) adaptörler: Daha yüksek güç verir; kayıt cihazlarında ve dizüstü bilgisayarlarda kullanılır.',
          'Merkezi güç kaynakları (metal kasa): Birden fazla kamerayı tek noktadan besler.',
          'PoE switch / enjektörler: IP kameralara ağ kablosu üzerinden elektrik verir; ayrı adaptör gerektirmez.',
        ],
      },
      { h: 'Seçerken dikkat edin' },
      {
        p: 'Birden fazla kamerayı tek adaptörle besleyecekseniz kameraların toplam akımına yaklaşık %20 pay ekleyin. Uzun kablo mesafelerinde voltaj düşümü olabileceğini unutmayın; mümkünse kaliteli ve yeterli kesitte kablo kullanın.',
      },
    ],
  },
  {
    slug: 'access-point-router',
    title: 'Access Point ve Router Arasındaki Farklar Nelerdir?',
    excerpt: 'Router ile access point aynı şey mi? Görevleri, farkları ve evinizde ya da iş yerinizde hangisine ihtiyaç duyduğunuz.',
    image: '/mock/products/cutout/router-white.svg',
    related: { label: 'Network Ürünleri', href: '/kategori/network-urunleri' },
    body: [
      {
        p: 'Router ve access point (erişim noktası) çoğu zaman aynı kutuda bulunduğu için karıştırılır. Ancak görevleri farklıdır.',
      },
      { h: 'Router ne yapar?' },
      {
        p: 'Router (yönlendirici), yerel ağınızı internete bağlar. Cihazlara IP adresi dağıtır, ağ trafiğini yönlendirir ve güvenlik duvarı gibi korumaları sağlar. Ev tipi modemlerin çoğu aynı zamanda router ve kablosuz erişim noktasıdır.',
      },
      { h: 'Access point ne yapar?' },
      {
        p: 'Access point, var olan kablolu bir ağa kablosuz (Wi-Fi) erişim ekler. İnternet bağlantısını kendisi kurmaz; router’a ya da switch’e kabloyla bağlanır ve Wi-Fi kapsama alanını genişletir.',
      },
      { h: 'Hangisine ihtiyacım var?' },
      {
        ul: [
          'İnternet bağlantısı kuracaksanız: router (genellikle servis sağlayıcınızın modemi).',
          'Geniş bir evde, ofiste veya depoda Wi-Fi zayıf kalıyorsa: kabloyla bağlanan ek access point’ler.',
          'Wi-Fi güvenlik kameraları kullanacaksanız: kameraların bulunduğu bölgede güçlü sinyal için access point.',
        ],
      },
      {
        p: 'Kapsama için tekrarlayıcı (repeater) yerine kabloyla bağlanan access point kullanmak hız kaybını önler.',
      },
    ],
  },
  {
    slug: 'abs-plastik-nedir',
    title: 'ABS Plastik Nedir? Nerelerde Kullanılır?',
    excerpt: 'Elektronik cihaz kasalarında sık kullanılan ABS plastiğin özellikleri, avantajları ve dış mekân kullanımında dikkat edilecekler.',
    image: '/mock/products/cutout/nvr-silver.svg',
    related: { label: 'Kayıt ve Depolama', href: '/kategori/kayit-ve-depolama' },
    body: [
      {
        p: 'ABS (akrilonitril bütadien stiren), dayanıklılığı ve kolay şekil alabilmesi nedeniyle elektronik cihaz kasalarında en çok kullanılan mühendislik plastiklerinden biridir.',
      },
      { h: 'Özellikleri' },
      {
        ul: [
          'Darbeye karşı dayanıklıdır, kolay kırılmaz.',
          'Hafiftir ve iyi bir elektrik yalıtkanıdır.',
          'Kalıplanması kolaydır, düzgün ve parlak yüzey verir.',
          'Uygun maliyetlidir.',
        ],
      },
      { h: 'Nerelerde kullanılır?' },
      {
        p: 'Kayıt cihazı ve modem kasaları, iç mekân güvenlik kameraları, kumandalar, priz ve adaptör gövdeleri, bilgisayar parçaları ve oyuncaklar ABS’nin yaygın kullanım alanlarıdır.',
      },
      { h: 'Dış mekânda dikkat' },
      {
        p: 'ABS, güneş ışığının (UV) etkisiyle zamanla sararıp kırılganlaşabilir. Bu nedenle dış mekân kameralarında genellikle metal (alüminyum) gövde veya UV dayanımlı plastikler tercih edilir. Dış mekân ürünü seçerken IP66 / IP67 gibi koruma sınıflarına da bakın.',
      },
    ],
  },
  {
    slug: 'akilli-kumanda-sifirlama',
    title: 'Akıllı Kumanda Nasıl Sıfırlanır?',
    excerpt: 'Yanıt vermeyen ya da yanlış cihazla eşleşen akıllı ve öğrenmeli kumandaları sıfırlamanın genel adımları.',
    image: '/mock/products/cutout/remote-white.svg',
    related: { label: 'Aksesuarlar', href: '/kategori/aksesuarlar' },
    body: [
      {
        p: 'Akıllı (öğrenmeli veya Bluetooth eşleşmeli) kumandalar zaman zaman yanıt vermeyebilir ya da yanlış cihazla eşleşebilir. Sıfırlama çoğu durumda sorunu çözer. Aşağıdaki adımlar geneldir; tam tuş kombinasyonu modelin kullanım kılavuzunda yer alır.',
      },
      { h: 'Önce kontrol edin' },
      {
        ul: [
          'Pilleri yenileriyle değiştirin ve kutup yönünü kontrol edin.',
          'Telefon kamerasıyla kumandanın ucuna bakıp bir tuşa basın; kızılötesi ışık görünüyorsa kumanda sinyal gönderiyordur.',
          'Kumanda ile cihaz arasında engel olmadığından emin olun.',
        ],
      },
      { h: 'Genel sıfırlama adımları' },
      {
        ul: [
          'Pilleri çıkarın ve herhangi bir tuşa 10–15 saniye basılı tutarak kalan elektriği boşaltın.',
          'Pilleri geri takın.',
          'Kılavuzda belirtilen sıfırlama tuş kombinasyonuna (çoğu modelde iki tuşa birlikte) basılı tutun; ışık yanıp sönünce bırakın.',
          'Bluetooth kumandalarda, eşleşmeyi cihazın ayarlar menüsünden kaldırıp yeniden eşleştirin.',
        ],
      },
      {
        p: 'Öğrenmeli kumandalarda sıfırlama, öğretilmiş tüm tuşları siler; tuşları orijinal kumandadan yeniden öğretmeniz gerekir.',
      },
    ],
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((article) => article.slug === slug);
