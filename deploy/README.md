# Sunucuya taşıma — Dokploy (Veridyen)

Diğer Medusa mağazası (`testerestore`) ile aynı yapı: bir Dokploy projesinde
PostgreSQL, Redis ve uygulamalar. Fark: burada iki uygulama var — Medusa
backend + admin ve Next.js mağaza.

| Servis | Dokploy türü | Kaynak |
|---|---|---|
| `seenergy-postgres` | Database → PostgreSQL | `deploy/seenergy.sql` buraya yüklenir |
| `seenergy-redis` | Database → Redis | — |
| `seenergy-backend` | Application | GitHub, `backend/Dockerfile`, port **9000** |
| `seenergy-store` | Application | GitHub, `Dockerfile`, port **3100** |

İki Dockerfile da yerelde Docker ile derlendi ve bu düzenin birebir provası
yapıldı (Postgres'e geri yüklenmiş döküm + Redis + backend + mağaza): bütün
sayfalar 200, admin paneli açılıyor, yüklenen görseller sunuluyor.

## Bu klasörde

| Dosya | Ne |
|---|---|
| `seenergy.sql` | Veritabanının temiz kopyası: 60 ürün, kategori ağacı (14 ana + 12 alt; eski 10 kategori pasif), fiyatlar, stok, Vitrin içeriği, teknik özellikler, mağaza anahtarı. **Yok:** admin kullanıcısı, müşteriler, siparişler, sepetler (test verisi ve kişisel veriydi). PostgreSQL 14+ |
| `rewrite-urls.sql` | Veritabanındaki `localhost:3100` / `localhost:9000` adreslerini canlı alan adlarıyla değiştirir |

Admin'den yüklenen görseller: `backend/apps/backend/static/` (imaja kopyalanır).

## Önce: alan adları

DNS'te iki kayıt (A kaydı → sunucu IP'si, `185.149.102.122`):

- `www.ORNEK.com.tr` → mağaza
- `api.ORNEK.com.tr` → backend ve admin (`/app`)

Aşağıda `ORNEK.com.tr` yerine gerçek alan adını yazın.

## 1. PostgreSQL

Create Service → Database → **PostgreSQL**, ad `seenergy-postgres`,
veritabanı `seenergy`. Oluşunca:

- **Internal Connection URL**'i not edin (backend bunu kullanacak).
- Veriyi yüklemek için geçici olarak bir **External Port** açın, ardından
  dökümü ve adres düzeltmesini yükleyin:

```
psql "postgresql://KULLANICI:SIFRE@185.149.102.122:DIS_PORT/seenergy" -f deploy/seenergy.sql
psql "postgresql://KULLANICI:SIFRE@185.149.102.122:DIS_PORT/seenergy" \
  -v store=https://www.ORNEK.com.tr -v api=https://api.ORNEK.com.tr -f deploy/rewrite-urls.sql
```

Yükleme bitince external port'u kapatın.

## 2. Redis

Create Service → Database → **Redis**, ad `seenergy-redis`. **Internal
Connection URL**'i not edin.

## 3. Backend — `seenergy-backend`

Create Service → **Application**.

- **Provider:** GitHub → depo `cemgoktugg/seenergy`, dal `main`
- **Build Type:** Dockerfile — Docker File `backend/Dockerfile`, Docker Context Path `backend`
- **Environment:**

```
DATABASE_URL=<Postgres Internal Connection URL>?sslmode=disable
REDIS_URL=<Redis Internal Connection URL>
JWT_SECRET=<uzun rastgele dize>
COOKIE_SECRET=<uzun rastgele dize>
AUTH_MFA_ENCRYPTION_KEY=<uzun rastgele dize>
STORE_CORS=https://www.ORNEK.com.tr
ADMIN_CORS=https://api.ORNEK.com.tr
AUTH_CORS=https://www.ORNEK.com.tr,https://api.ORNEK.com.tr
MEDUSA_BACKEND_URL=https://api.ORNEK.com.tr
STOREFRONT_URL=https://www.ORNEK.com.tr
STOREFRONT_REVALIDATE_SECRET=<uzun rastgele dize — mağazadaki REVALIDATE_SECRET ile AYNI>
```

> **`?sslmode=disable` şart.** Medusa, adresi `localhost` olmayan her
> veritabanına SSL ile bağlanmaya çalışır; Dokploy'un iç PostgreSQL'i SSL
> kullanmaz ve bağlantı 10 saniyede zaman aşımına düşer. Provada aynen
> görüldü, bu ekle düzeldi.

- **Domains:** host `api.ORNEK.com.tr`, container port **9000**, HTTPS açık (Let's Encrypt)
- **Advanced → Volumes:** volume mount, mount path **`/server/static`** —
  admin'den yüklenen görseller burada durur; volume olmazsa her deploy'da
  silinir.
- **Deploy.** Açılış ~20 saniye. Kontrol: `https://api.ORNEK.com.tr/health` → `OK`.

Admin kullanıcısı (bir kez) — uygulamanın terminalinde (`/server` klasörü):

```
npx medusa user -e admin@ORNEK.com.tr -p <güçlü-şifre>
```

Admin paneli: `https://api.ORNEK.com.tr/app`

## 4. Mağaza — `seenergy-store`

**Backend çalışır durumdayken** oluşturun: mağaza derlenirken ürün, kategori
ve marka sayfaları backend'den alınarak önceden oluşturulur.

Create Service → **Application**.

- **Provider:** GitHub → aynı depo, dal `main`
- **Build Type:** Dockerfile — Docker File `Dockerfile`, Docker Context Path `.`
- **Build-time Arguments:**

```
MEDUSA_BACKEND_URL=https://api.ORNEK.com.tr
MEDUSA_PUBLISHABLE_KEY=<anahtar>
```

- **Environment:** aynı ikisi, ek olarak:

```
REVALIDATE_SECRET=<backend'deki STOREFRONT_REVALIDATE_SECRET ile aynı>
BANK_NAME=…
BANK_HOLDER=…
BANK_IBAN=…
```

Anahtar veritabanında: `select token from api_key where type = 'publishable';`

- **Domains:** host `www.ORNEK.com.tr`, container port **3100**, HTTPS açık
- **Deploy.**

## Sonra

- Ürün kaydedilince mağaza anında güncellenir (`STOREFRONT_URL` +
  revalidate anahtarı). Kategori ağacı kodda tanımlı; değişince mağaza
  yeniden deploy edilir.
- Sunucuda her iki Node derlemesi ~1 GB bellek ister; aynı anda başlatmayın.

## Siteyi herkese açmadan önce

- Site arama motorlarına kapalı (`src/app/layout.tsx` → `robots`); açılışta açılacak.
- Ürünler kurgusal: gerçek ürünler girilmeli, örnekler taslağa alınmalı.
- Footer'daki telefon ve adres yer tutucu.
- Yasal sayfalar (mesafeli satış, ön bilgilendirme, KVKK, çerez, iade) yok.
- Sipariş onay e-postası gönderilmiyor.
