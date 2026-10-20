# Sunucuya taşıma (Veridyen)

Projeyi canlı sunucuya kurmak için gereken her şey bu depoda. Tek istisna,
şifreler ve gizli anahtarlar: onlar bilerek GitHub'da değil, sunucuda ayrıca
girilir (aşağıda, 3. ve 5. adım).

## Bu klasörde

| Dosya | Ne |
|---|---|
| `seenergy.sql` | Veritabanının temiz kopyası: 60 ürün, kategori ağacı (14 ana + 12 alt; eski 10 kategori pasif), fiyatlar, stok, Vitrin içeriği (slaytlar, bannerlar, marka bantları), teknik özellikler, mağaza anahtarı |
| `rewrite-urls.sql` | Veritabanındaki yerel adresleri (`localhost:3100`, `localhost:9000`) canlı alan adlarıyla değiştirir |

Admin'den yüklenen görseller: `backend/apps/backend/static/`

**`seenergy.sql` içinde OLMAYANLAR** (bilerek): admin kullanıcısı, müşteri
hesapları, siparişler, sepetler, ödemeler. Bunlar geliştirme sırasındaki test
verisiydi ve kişisel veri içeriyordu. Admin kullanıcısı sunucuda tek komutla
oluşturulur (4. adım).

Döküm PostgreSQL 18 ile alındı, PostgreSQL 14 ve üzerinde kurulur.

## Gerekenler

- Node.js 20.19+ veya 22.12+
- PostgreSQL 14+
- nginx (alan adlarını uygulamalara yönlendirmek ve SSL için), pm2 (uygulamaları
  ayakta tutmak için)
- İki alan adı: mağaza (ör. `www.ornek.com.tr`) ve backend/admin
  (ör. `api.ornek.com.tr`)

## Adımlar

**1. Kodu al**

```
git clone https://github.com/cemgoktugg/seenergy.git
cd seenergy
```

**2. Veritabanı**

```
createdb seenergy
psql seenergy -f deploy/seenergy.sql
psql seenergy -v store=https://www.ornek.com.tr -v api=https://api.ornek.com.tr -f deploy/rewrite-urls.sql
```

Adreslerin sonunda `/` olmasın.

**3. Backend ayarları** — `backend/apps/backend/.env.template` dosyasını
`backend/apps/backend/.env` olarak kopyalayıp doldurun:

| Anahtar | Değer |
|---|---|
| `DATABASE_URL` | sunucudaki PostgreSQL bağlantısı |
| `JWT_SECRET`, `COOKIE_SECRET` | her biri uzun, rastgele bir dize |
| `AUTH_MFA_ENCRYPTION_KEY` | uzun, rastgele bir dize; admin'de iki adımlı doğrulama için (boşsa o özellik kullanılamaz) |
| `STORE_CORS` | `https://www.ornek.com.tr` |
| `ADMIN_CORS` | `https://api.ornek.com.tr` |
| `AUTH_CORS` | `https://www.ornek.com.tr,https://api.ornek.com.tr` |
| `MEDUSA_BACKEND_URL` | `https://api.ornek.com.tr` — yüklenen görseller bu adresle kaydedilir |
| `STOREFRONT_URL` | `https://www.ornek.com.tr` |
| `STOREFRONT_REVALIDATE_SECRET` | rastgele bir dize; mağazadaki `REVALIDATE_SECRET` ile **aynı** |

**4. Backend'i kur ve başlat**

```
cd backend && npm ci
cd apps/backend
npx medusa db:migrate
npx medusa user -e admin@ornek.com.tr -p <güçlü-şifre>
npm run build
```

`npm run build` çıktısı `.medusa/server` klasörüne gider. Oradan
çalıştırılırken `.env` dosyası ve `static/` (yüklenen görseller) o klasörde de
bulunmalı. **`static/` klasörünü build dışında kalıcı bir yerde tutup
`.medusa/server/static` olarak bağlayın (sembolik bağlantı)**; yoksa her
yeniden derlemede admin'den yüklenmiş görseller silinir.

Admin paneli: `https://api.ornek.com.tr/app`

**5. Mağaza ayarları** — depo kökünde `.env.production.local`:

| Anahtar | Değer |
|---|---|
| `MEDUSA_BACKEND_URL` | `https://api.ornek.com.tr` |
| `MEDUSA_PUBLISHABLE_KEY` | veritabanındaki anahtar: `select token from api_key where type = 'publishable';` |
| `REVALIDATE_SECRET` | backend'deki `STOREFRONT_REVALIDATE_SECRET` ile aynı |
| `BANK_NAME`, `BANK_HOLDER`, `BANK_IBAN` | havale/EFT bilgileri (isteğe bağlı, bkz. `.env.example`) |

**6. Mağazayı derle ve başlat** — derleme sırasında backend **çalışıyor
olmalı**, çünkü ürün sayfaları derlenirken ürün listesi backend'den alınır:

```
npm ci
npm run build
npm run start        # 3100 portunda
```

**7. nginx ve SSL** — `www.` → `localhost:3100`, `api.` → `localhost:9000`;
SSL için Let's Encrypt. İki uygulamayı da pm2 ile başlatın ki sunucu yeniden
açılınca kendiliğinden kalksınlar.

## Siteyi herkese açmadan önce

- Site arama motorlarına kapalı (`src/app/layout.tsx` → `robots`); açılışta açılacak.
- Ürünler kurgusal: gerçek ürünler girilmeli, örnekler taslağa alınmalı.
- Footer'daki telefon ve adres yer tutucu.
- Yasal sayfalar (mesafeli satış, ön bilgilendirme, KVKK, çerez, iade) yok.
- Sipariş onay e-postası gönderilmiyor.
