# PM App

Node.js ve MongoDB tabanlı bu küçük proje yönetimi API'si; kullanıcı kimlik doğrulaması, proje üyelik rolleri ve görev takibini tek bir REST servisi altında toplar.

## Özellikler
- JWT tabanlı kimlik doğrulama ve parola hashleme
- Proje başlatma, üyeleri rol bazlı yönetme (admin/üye)
- Projelere bağlı görev oluşturma, listeleme ve durum güncelleme
- Orta katman (middleware) ile yetkilendirme ve rol kontrolü
- Mongoose ile MongoDB üzerinde şema tanımları ve ilişkiler

## Teknolojiler
- Node.js & Express 5
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv

## Gereksinimler
- Node.js >= 18
- npm >= 9
- Çalışır durumda bir MongoDB örneği

## Kurulum
```bash
# Depoyu klonla
git clone <repo-url>
cd pm-app

# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini tanımla
cp .env.example .env # örnek dosya yoksa aşağıyı kullan
```

`.env` dosyanız en azından şu değerleri içermelidir:

```dotenv
MONGO_URI=mongodb://localhost:27017/pm-app
JWT_SECRET=super-secret-key
PORT=3000
```

## Çalıştırma
```bash
# Geliştirme modunda (nodemon)
npm run dev

# Üretim/normal çalışma
npm start
```

Sunucu ayakta olduğunda API uç noktalarına `http://localhost:3000/api` taban adresinden erişebilirsiniz.

## API Hakkında
Tüm uç noktalar ve örnek istek/yanıtlar `docs/api.md` dosyasında detaylı şekilde açıklanmıştır. Öne çıkan yollar:
- `POST /api/auth/register` & `POST /api/auth/login`
- `POST /api/projects/create`, `POST /api/projects/:id/add-member`, `GET /api/projects/my-projects`
- `POST /api/tasks/create`, `GET /api/tasks/by-project/:id`, `PATCH /api/tasks/:id/update`

JWT token'ınızı `Authorization: Bearer <token>` başlığıyla göndermeyi unutmayın.

## Proje Yapısı
```text
pm-app/
├── server.js
├── config/
│   └── db.js
├── middleware/
│   ├── auth.js
│   └── projectRoleCheck.js
├── models/
│   ├── Project.js
│   ├── Task.js
│   └── User.js
├── Routes/
│   ├── authRoutes.js
│   ├── projectsRoutes.js
│   └── tasksRoutes.js
└── docs/
    └── api.md
```

## Testler
Projede henüz otomatik test senaryosu bulunmuyor. Test altyapısı eklemek için `npm test` komutunu güncelleyebilir ve Jest veya benzeri çerçeveleri entegre edebilirsiniz.

## Katkı
1. Forkla, yeni bir dal aç ve değişikliklerini yap.
2. `npm run lint` gibi ek kontrol adımları tanımladıysan çalıştır.
3. Pull Request açmadan önce değişikliklerini açıklayan bir not ekle.

## Lisans
Bu proje `ISC` lisansı ile yayınlanmıştır. Ayrıntılar için `package.json` içindeki `license` alanına bakabilirsiniz.
