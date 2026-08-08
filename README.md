# Abdülbaki Meto — Dijital Kartvizit

Tek sayfalık kişisel kartvizit sitesi: fotoğraf, isim, ünvan ve bağlantı listesi.
Instagram/WhatsApp biyografisine konulacak adres budur.

Next.js 16 · React 19 · Tailwind CSS v4 · shadcn/ui · Motion (Framer Motion) ·
[MagicUI](https://magicui.design) tema düğmesi · [React Bits](https://reactbits.dev)
gökkuşağı arka planı

---

## Çalıştırma

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Diğer komutlar:

```bash
pnpm build        # üretim derlemesi
pnpm start        # derlenmiş sürümü çalıştır
pnpm lint         # kod kontrolü
```

---

## İçeriği düzenleme

**Sitedeki bütün metin ve bağlantılar tek dosyadan gelir:**

```
src/data/resume.tsx
```

Bu dosyayı açıp `TODO` yazan yerleri doldurman yeterli. Kalan boşlukları görmek
için:

```bash
grep -rn "TODO" src/data
```

Dosyanın içindekiler:

| Alan | Açıklama |
| --- | --- |
| `CONTACT` | E-posta, telefon, WhatsApp, Instagram adresleri. Hem bağlantı satırları hem rehber kartı buradan okur — bir kez yaz, her yerde güncellensin. |
| `description` | İsmin altındaki ünvan. Arama sonuçlarında ve rehbere eklenen kişi kartının "ünvan" alanında da görünür. |
| `links` | Bağlantı listesi. Sıralamayı değiştirmek için satırların yerini değiştir; `primary: true` olan satır yeşil/vurgulu görünür ve tek olmalı. |
| `status` | Fotoğrafın sağ altındaki emoji rozeti. `label` ekran okuyucu içindir. |
| `avatarUrl` | Profil fotoğrafının yolu. |

### Fotoğraf değiştirme

Mevcut fotoğraf: `public/me.jpg` (512×512, kare).

Yeni fotoğrafı `public/` klasörüne koy ve `avatarUrl` alanına yolunu yaz
(örn. `"/me.jpg"`). Fotoğraf yuvarlak çerçevede gösterildiği için **kare** ve yüz
ortalanmış olmalı; 512×512 fazlasıyla yeterli. Boş bırakılırsa baş harfler
(`AM`) gösterilir.

### "Rehbere Ekle" nasıl çalışıyor

`/kartvizit.vcf` adresi, `src/data/resume.tsx` içindeki bilgilerden bir vCard
dosyası üretir (`src/app/kartvizit.vcf/route.ts`). iOS ve Android bu dosyayı
açtığında doğrudan "Kişi Ekle" ekranını gösterir. Ayrıca bir şey yapmana gerek
yok — iletişim bilgilerini güncellemen yeterli.

### Vurgulu satırın rengi

`src/components/link-card.tsx` içinde `emerald-700`. Değiştireceksen beyaz
metinle en az 4.5:1 kontrast veren bir ton seç (`emerald-600` 3.9:1'de kalıyor).

### Alan adı

Yayına alırken `url` alanını gerçek alan adıyla değiştir — sosyal medya önizleme
görselleri ve SEO etiketleri bunu kullanır.

---

## Yayına alma

En kolayı [Vercel](https://vercel.com): depoyu içe aktar, ayarlara dokunmadan
"Deploy" de. Yapılandırma gerekmez.

---

## Lisans

Başlangıç şablonu [MagicUI](https://github.com/magicuidesign/portfolio)
tarafından MIT lisansıyla yayımlanmıştır — bkz. [LICENSE](./LICENSE).
