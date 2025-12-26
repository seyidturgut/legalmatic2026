# Proje Dağıtım (Deployment) Kılavuzu

Bu proje **Next.js** (App Router) ile geliştirilmiştir. Deployment için standart PHP hostingi tek başına yeterli değildir; **Node.js** desteğine ihtiyaç duyar.

## Seçenek 1: Vercel + cPanel Veritabanı (ÖNERİLEN)
Bu yöntem en performanslı ve yönetimi en kolay olanıdır.
*   **Frontend/Backend:** Vercel üzerinde çalışır (Ücretsiz).
*   **Veritabanı:** cPanel hostinginizdeki MySQL veritabanını kullanır.

### Adımlar:
1.  **GitHub'a Gönderin:** Kodu GitHub repository'nize pushlayın.
2.  **cPanel'de Veritabanı Ayarı:**
    *   cPanel > "Remote MySQL" kısmına girin.
    *   Vercel sunucularının IP adreslerine izin verin (veya test için geçici olarak `%` ekleyerek herkese açın, sonra kısıtlayın).
3.  **Vercel'de Proje Açın:**
    *   Vercel'e GitHub ile giriş yapın.
    *   Repository'nizi seçip "Import" deyin.
    *   **Environment Variables** kısmına şunları ekleyin:
        *   `DATABASE_URL`: `mysql://getkontento_legalmaticdb:.88n-aypn%26NL@160.153.246.164:3306/getkontento_legalmaticDB`
        *   *(Not: Şifrenizdeki `&` karakteri `%26` olarak kodlanmıştır ve port `2083` değil standart MySQL portu olan `3306` olarak ayarlanmıştır.)*
        *   `NEXTAUTH_SECRET`: Rastgele uzun bir şifre (örn: `openssl rand -base64 32`).
        *   `NEXTAUTH_URL`: `https://sizin-vercel-adresiniz.vercel.app`
4.  **Deploy:** "Deploy" butonuna basın.

---

## Seçenek 2: cPanel Üzerinde Node.js (Eğer Destekleniyorsa)
Hostin paketinizde **"Setup Node.js App"** özelliği varsa bu yöntemi kullanabilirsiniz.

### Adımlar:
1.  **Dosyaları Yükleyin:** Projenizi (node_modules hariç) dosya yöneticisi veya FTP ile sunucuya yükleyin.
2.  **Node.js App Oluşturun:**
    *   cPanel > Setup Node.js App.
    *   Node sürümü olarak **18 veya 20** seçin (Next.js 14+ için gereklidir).
    *   Application Startup File: `server.js` (Bunu oluşturacağız).
3.  **Server.js Oluşturma:**
    *   Custom server kurmamız gerekebilir veya `next start` komutunu `package.json` üzerinden tetikletebilirsiniz.
4.  **Build:**
    *   SSH erişiminiz varsa terminalden `npm install` ve `npm run build` çalıştırın.
    *   Yoksa yerelde `npm run build` yapıp `.next` klasörünü de yükleyin (Bazen uyumsuzluk olabilir).

---

## GitHub'a Gönderme Komutları

Terminali açıp şu komutları sırasıyla uygulayarak kodunuzu GitHub'a gönderin:

```bash
# Değişiklikleri ekle
git add .

# Commit oluştur
git commit -m "Hazır: Admin paneli, CRM ve yeni arama tasarımı tamamlandı"

# GitHub'a gönder (main branch ise)
git push origin main
```
