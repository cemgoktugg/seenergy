# Sunucuya kurulum — Dokploy (Veridyen), onlinehesap.net

Diğer Medusa mağazası (testerestore) ile aynı yöntem: Dokploy'da tek bir
**Compose** servisi, kaynak bu GitHub deposu. `docker-compose.yml` içinde beş
servis var:

| Servis | Ne | Dışarıya |
|---|---|---|
| `postgres` | PostgreSQL 16 | kapalı (iç ağ) |
| `redis` | Redis 7 | kapalı (iç ağ) |
| `backend` | Medusa + admin | `https://api.onlinehesap.net` (admin: `/app`) |
| `store` | Next.js mağaza | `https://onlinehesap.net` (www → buraya yönlenir) |
| `db-backup` | günlük veritabanı + görsel yedeği | kapalı |

Bu düzen yerelde Docker ile iki kez baştan sona denendi (boş volume'lerle ilk
kurulum ve ardından bir güncelleme): veri kendiliğinden yüklendi, admin
oluştu, bütün sayfalar açıldı, yedek alındı, ikinci deploy veriyi korudu.

## 1. DNS (Türk Ticaret paneli)

`onlinehesap.net`'in ad sunucuları Türk Ticaret'te, ama **DNS bölgesi henüz
açık değil** (2026-10-21'de her sorgu "Server failed"). Panelde alan adının DNS
yönetimini açıp üç A kaydı ekleyin:

| Ad | Tür | Değer |
|---|---|---|
| `@` (onlinehesap.net) | A | `185.149.102.122` |
| `www` | A | `185.149.102.122` |
| `api` | A | `185.149.102.122` |

Kayıtlar yayılmadan HTTPS sertifikası alınamaz; önce bu adım.
Alan adının süresi **2026-12-20**'de doluyor.

## 2. Depoya erişim (depo gizli)

testerestore deposu herkese açık olduğu için "Git" sekmesi onu şifresiz
çekiyor; `seenergy` gizli. Dokploy'un çekebilmesi için bir SSH anahtarı:

1. Dokploy → Compose servisi → **Git** sekmesi → **Add SSH Key** (ya da
   Settings → SSH Keys → oluştur) → **public key**'i kopyalayın.
2. GitHub → `cemgoktugg/seenergy` → Settings → **Deploy keys** → Add deploy
   key → yapıştırın (yalnızca okuma; "Allow write access" kapalı).

## 3. Compose servisi

Projects → yeni proje (ör. `seenergy`) → Create Service → **Compose**.

**Git sekmesi:**

| Alan | Değer |
|---|---|
| Repository URL | `git@github.com:cemgoktugg/seenergy.git` |
| SSH Key | 2. adımdaki anahtar |
| Branch | `main` |
| Compose Path | `./docker-compose.yml` |

**Environment sekmesi:** `deploy/.env.dokploy.local` dosyasının içeriğini
olduğu gibi yapıştırın (bu dosya git'te yok; gizli anahtarlar hazır üretildi).
Yalnızca `ADMIN_EMAIL`'i ve istenirse `BANK_*` satırlarını doldurun. Liste ve
açıklamalar: `deploy/compose.env.example`.

**Domains sekmesi: boş bırakın.** Alan adları `docker-compose.yml`'deki Traefik
etiketlerinde, testerestore'daki gibi; Dokploy'da ayrıca alan adı eklenirse
aynı adres iki kez tanımlanır.

**Deploy.** İlk kurulumda:

- Postgres volume'ü boş olduğu için `deploy/initdb` `seenergy.sql`'i yükler ve
  adresleri `onlinehesap.net`'e çevirir (bir kez; sonraki deploy'lar dokunmaz).
- Mağaza imajı, backend henüz yokken derlenir; ilk dakika anasayfa boş
  görünebilir, backend açılınca kendiliğinden dolar.
- Backend `ADMIN_EMAIL` / `ADMIN_PASSWORD` ile admin kullanıcısını oluşturur.
  Girişi yaptıktan sonra Environment'tan `ADMIN_PASSWORD`'ü silin.

Kontrol: `https://api.onlinehesap.net/health` → `OK`, admin
`https://api.onlinehesap.net/app`, mağaza `https://onlinehesap.net`.

## Güncellemeler

GitHub'a gönderilen değişiklik → Dokploy'da **Deploy** (ya da otomatik deploy
açıksa kendiliğinden). Veritabanı, yüklenen görseller ve yedekler volume'lerde
kalır. Kategori ağacı kodda tanımlı; değişince yeniden deploy yeterli.

## Bu klasörde

| Dosya | Ne |
|---|---|
| `seenergy.sql` | Veritabanının temiz kopyası: 60 ürün, kategori ağacı, fiyatlar, stok, Vitrin içeriği, teknik özellikler. **Yok:** admin, müşteriler, siparişler, sepetler (test verisi ve kişisel veriydi). `psql` 14.19 / 15.14 / 16.10 / 17.6 ve sonrası gerekir (döküm `\restrict` kullanıyor); compose'daki Postgres 16 bunu karşılar |
| `rewrite-urls.sql` | Veritabanındaki `localhost` adreslerini canlı adreslerle değiştirir (initdb bunu çalıştırır) |
| `initdb/01-restore.sh` | İlk kurulumda yükleme + adres düzeltme |
| `compose.env.example` | Environment değişkenlerinin listesi |
| `.env.dokploy.local` | Doldurulmuş hâli (git'te değil) |

Admin'den yüklenen görseller `backend/apps/backend/static/` içinden imaja,
oradan `backend_static` volume'üne alınır.

## Siteyi herkese açmadan önce

- Site arama motorlarına kapalı (`src/app/layout.tsx` → `robots`); açılışta açılacak.
- Ürünler kurgusal: gerçek ürünler girilmeli, örnekler taslağa alınmalı.
- Footer'daki telefon ve adres yer tutucu.
- Yasal sayfalar (mesafeli satış, ön bilgilendirme, KVKK, çerez, iade) yok.
- Sipariş onay e-postası gönderilmiyor.
