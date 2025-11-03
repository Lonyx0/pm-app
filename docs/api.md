# PM Uygulaması API Dokümantasyonu

## Genel Bilgiler
- **Temel URL:** `http://localhost:3000/api`
- **Kimlik Doğrulama:** JSON Web Token (JWT). Kayıt veya giriş sonrası aldığınız token'ı `Authorization: Bearer <token>` başlığıyla tüm korumalı isteklere ekleyin.
- **İçerik Tipi:** Tüm istek ve cevaplar JSON formatındadır (`Content-Type: application/json`).
- **Ortam Değişkenleri:**
  - `MONGO_URI` – MongoDB bağlantı adresi.
  - `JWT_SECRET` – JWT imzalamak için kullanılan gizli anahtar.

---

## Kimlik Doğrulama

### Kayıt (Register)
- **Metot & Yol:** `POST /auth/register`
- **Açıklama:** Yeni kullanıcı oluşturur ve anında kullanılabilecek bir JWT döner.
- **İstek Gövdesi:**
  ```json
  {
    "username": "ayse",
    "email": "ayse@example.com",
    "password": "Guv3nliParola"
  }
  ```
- **201 Cevabı:**
  ```json
  {
    "token": "<jwt-token>"
  }
  ```
- **Hata Durumları:**
  - `400` kullanıcı adı veya e-posta zaten varsa.
  - `500` sunucu hatası.

### Giriş (Login)
- **Metot & Yol:** `POST /auth/login`
- **Açıklama:** E-posta veya kullanıcı adı ve şifre ile oturum açar.
- **İstek Gövdesi:**
  ```json
  {
    "emailOrUsername": "ayse",
    "password": "Guv3nliParola"
  }
  ```
- **200 Cevabı:**
  ```json
  {
    "token": "<jwt-token>"
  }
  ```
- **Hata Durumları:**
  - `400` geçersiz kimlik bilgileri.
  - `500` sunucu hatası.

---

## Projeler
Tüm proje uç noktaları geçerli bir JWT gerektirir.

### Proje Oluşturma
- **Metot & Yol:** `POST /projects/create`
- **Rol:** Herhangi bir doğrulanmış kullanıcı (projenin yöneticisi olur).
- **İstek Gövdesi:**
  ```json
  {
    "name": "Pazarlama Sitesi",
    "description": "Q4 yeniden tasarım"
  }
  ```
- **201 Cevabı:** Oluşturulan proje dokümanını döner, `members` listesinde çağıran kişi admin olarak yer alır.
- **Notlar:** İsteği yapan kullanıcı `admin` alanına ve `members` listesine yönetici rolüyle eklenir.

### Projeye Üye Ekleme
- **Metot & Yol:** `POST /projects/:id/add-member`
- **Rol:** Yalnızca proje yöneticisi.
- **İstek Gövdesi:**
  ```json
  {
    "email": "mehmet@example.com"
  }
  ```
- **200 Cevabı:**
  ```json
  {
    "message": "Member added successfully",
    "project": { ...guncellenenProje }
  }
  ```
- **Hata Durumları:**
  - `400` e-posta eksikse veya kullanıcı zaten üyeyse.
  - `404` kullanıcı veya proje bulunamazsa.
  - `403` çağıran kişi proje yöneticisi değilse.

### Projelerimi Getir
- **Metot & Yol:** `GET /projects/my-projects`
- **Rol:** Projenin herhangi bir üyesi.
- **Açıklama:** Kullanıcının üye olduğu projeleri listeler.
- **200 Cevabı:** Üyelerin `username` ve `email` bilgileri doldurulmuş proje listesi döner.

---

## Görevler
Tüm görev uç noktaları geçerli bir JWT gerektirir.

### Görev Oluşturma
- **Metot & Yol:** `POST /tasks/create`
- **Rol:** İlgili projenin yöneticisi.
- **İstek Gövdesi:**
  ```json
  {
    "title": "Hero alanını tasarla",
    "description": "Masaüstü ve mobil varyantları hazırla",
    "projectId": "<projectId>",
    "assignedTo": "<userId>"
  }
  ```
- **201 Cevabı:** Oluşturulan görev dokümanını döner.
- **Notlar:** `projectId` middleware tarafından doğrulanır. `assignedTo` geçerli bir kullanıcı ID'si olmalıdır.

### Projeye Göre Görevleri Getir
- **Metot & Yol:** `GET /tasks/by-project/:id`
- **Rol:** Projenin herhangi bir üyesi.
- **Açıklama:** Belirtilen proje ID'sine ait görevleri döner.
- **200 Cevabı:** `assignedTo` alanı kullanıcı `username` ve `email` ile doldurulmuş görev listesi döner.

### Görev Güncelleme
- **Metot & Yol:** `PATCH /tasks/:id/update`
- **Rol:** Görevin bağlı olduğu projenin herhangi bir üyesi.
- **İstek Gövdesi:** Kısmi görev nesnesi; gönderilen alanlar mevcut göreve işlenir.
  ```json
  {
    "status": "done"
  }
  ```
- **200 Cevabı:** Güncellenmiş görev dokümanı.
- **Hata Durumları:**
  - `404` görev bulunamazsa.
  - `403` çağıran kişi proje üyesi değilse.

---

## Hata Yönetimi
Aksi belirtilmedikçe başarısız cevaplar şu yapıyı izler:
```json
{
  "message": "<aciklama>"
}
```
- `401` token eksik veya geçersiz ise.
- `403` proje rolü yeterli değilse.
- `500` beklenmedik sunucu hatası durumunda.

## Lokal Çalıştırma
1. Bağımlılıkları kurun: `npm install`
2. `.env` dosyası oluşturup `MONGO_URI` ve `JWT_SECRET` değerlerini girin.
3. Geliştirme sunucusunu başlatın: `npm run dev`
