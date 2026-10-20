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

| Adres | Ne | DNS (A → `185.149.102.122`) |
|---|---|---|
| `ecommercore.com` | mağaza | hazır |
| `www.ecommercore.com` | mağaza → `ecommercore.com`'a yönlenir | hazır |
| `api.ecommercore.com` | backend ve admin (`/app`) | hazır |

> `ecommercore.com` ve `www` bugün (2026-10-20) Dokploy'da **testerestore.com'a
> 301 yönlendiriliyor**. Mağazaya bağlamadan önce o yönlendirme kaldırılmalı
> (testerestore uygulamasının Domains sekmesi ya da Traefik File System);
> aynı alan adı iki yerde tanımlı kalırsa Traefik hangisini seçeceğini
> garanti etmez. testerestore.com bundan etkilenmez.

## 1. PostgreSQL

Create Service → Database → **PostgreSQL**, ad `seenergy-postgres`,
veritabanı `seenergy`. Oluşunca:

- **Internal Connection URL**'i not edin (backend bunu kullanacak).
- Veriyi yüklemek için geçici olarak bir **External Port** açın, ardından
  dökümü ve adres düzeltmesini yükleyin:

```
psql "postgresql://KULLANICI:SIFRE@185.149.102.122:DIS_PORT/seenergy" -f deploy/seenergy.sql
psql "postgresql://KULLANICI:SIFRE@185.149.102.122:DIS_PORT/seenergy" \
  -v store=https://ecommercore.com -v api=https://api.ecommercore.com -f deploy/rewrite-urls.sql
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
STORE_CORS=https://ecommercore.com,https://www.ecommercore.com
ADMIN_CORS=https://api.ecommercore.com
AUTH_CORS=https://ecommercore.com,https://www.ecommercore.com,https://api.ecommercore.com
MEDUSA_BACKEND_URL=https://api.ecommercore.com
STOREFRONT_URL=https://ecommercore.com
STOREFRONT_REVALIDATE_SECRET=<uzun rastgele dize — mağazadaki REVALIDATE_SECRET ile AYNI>
```

> **`?sslmode=disable` şart.** Medusa, adresi `localhost` olmayan her
> veritabanına SSL ile bağlanmaya çalışır; Dokploy'un iç PostgreSQL'i SSL
> kullanmaz ve bağlantı 10 saniyede zaman aşımına düşer. Provada aynen
> görüldü, bu ekle düzeldi.

- **Domains:** host `api.ecommercore.com`, container port **9000**, HTTPS açık (Let's Encrypt)
- **Advanced → Volumes:** volume mount, mount path **`/server/static`** —
  admin'den yüklenen görseller burada durur; volume olmazsa her deploy'da
  silinir.
- **Deploy.** Açılış ~20 saniye. Kontrol: `https://api.ecommercore.com/health` → `OK`.

Admin kullanıcısı (bir kez) — uygulamanın terminalinde (`/server` klasörü):

```
npx medusa user -e <admin-e-postası> -p <güçlü-şifre>
```

Admin paneli: `https://api.ecommercore.com/app`

## 4. Mağaza — `seenergy-store`

**Backend çalışır durumdayken** oluşturun: mağaza derlenirken ürün, kategori
ve marka sayfaları backend'den alınarak önceden oluşturulur.

Create Service → **Application**.

- **Provider:** GitHub → aynı depo, dal `main`
- **Build Type:** Dockerfile — Docker File `Dockerfile`, Docker Context Path `.`
- **Build-time Arguments:**

```
MEDUSA_BACKEND_URL=https://api.ecommercore.com
MEDUSA_PUBLISHABLE_KEY=pk_11ce8aef229a358bc58bce50360456b85790a7113cfe2e62a0e4ca6a8c0c1e33
```

- **Environment:** aynı ikisi, ek olarak:

```
REVALIDATE_SECRET=<backend'deki STOREFRONT_REVALIDATE_SECRET ile aynı>
BANK_NAME=…
BANK_HOLDER=…
BANK_IBAN=…
```

Anahtar (herkese açık türden, gizli değil) veritabanında da var: `select token from api_key where type = 'publishable';`

- **Domains:** iki kayıt, ikisi de container port **3100**, HTTPS açık: `ecommercore.com` ve `www.ecommercore.com`
- **Advanced → Redirects:** "www'dan www'suz adrese" yönlendirmesi, adres tek kalsın
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
