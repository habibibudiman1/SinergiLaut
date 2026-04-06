<div align="center">

# 🌊 SinergiLaut

**Platform Konservasi Laut Indonesia**

Platform full-stack yang mempertemukan komunitas konservasi laut, relawan, donatur, dan admin dalam satu sistem terintegrasi.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## 📦 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router) + TypeScript |
| **UI** | Tailwind CSS + ShadcnUI |
| **Backend** | Next.js Server Actions |
| **Database & Auth** | Supabase (PostgreSQL + Auth) |
| **Storage** | Supabase Storage |
| **Payment** | Midtrans (Sandbox/Production) |
| **ORM/Seed** | Prisma |

---

## 🛠️ Cara Setup Project (Tutorial Lengkap)

Ikuti langkah-langkah di bawah ini untuk clone dan menjalankan SinergiLaut secara lokal.

### Prasyarat Sistem
Pastikan tool berikut sudah terinstal di komputer kamu:
- **Node.js** (v20+) — [nodejs.org](https://nodejs.org)
- **pnpm** (Latest) — `npm install -g pnpm`
- **Git** (Latest) — [git-scm.com](https://git-scm.com)

---

### Langkah 1 — Clone & Install Dependency
Buka terminal dan clone repository ini dari GitHub:
```bash
git clone https://github.com/habibibudiman1/SinergiLaut.git
cd SinergiLaut
pnpm install
```

---

### Langkah 2 — Setup Akun & Project Supabase
SinergiLaut menggunakan Supabase untuk Database, Authentication, dan Storage.
1. Buka [supabase.com](https://supabase.com) dan buat akun/login.
2. Klik **New Project**, beri tipe/nama project bebas (misal: `sinergilaut-dev`), set password database (wajib diingat), lalu pilih region **Southeast Asia**.
3. Tunggu hingga proses setup database Supabase selesai.

---

### Langkah 3 — Konfigurasi Environment Variables (`.env.local`)
Gandakan template environment yang sudah disediakan:
```bash
cp .env.example .env.local
```
*(Pengguna Windows: Kamu bisa *copy-paste* file `.env.example` lalu ubah namanya menjadi `.env.local` secara manual via File Explorer).*

Buka `.env.local` lalu isi dengan nilai dari dashboard Supabase:
1. **`NEXT_PUBLIC_SUPABASE_URL`** dan **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Didapat dari menu **Project Settings → API**.
2. **`SUPABASE_SERVICE_ROLE_KEY`**: Didapat di halaman yang sama (bagian bawah `service_role`).
3. **`DATABASE_URL`** dan **`DIRECT_URL`**: Didapat dari menu **Project Settings → Database** lalu temukan string koneksi `URI`. 
   - Gunakan format connection string **Transaction** berakhiran `6543/postgres?pgbouncer=true` untuk `DATABASE_URL`.
   - Gunakan format **Session** berakhiran `5432/postgres` untuk `DIRECT_URL`.
   - (Jangan lupa ganti bagian `[YOUR-PASSWORD]` di link dengan password databasemu).

> ⚠️ PENTING: Jangan ubah baris kode `# ── WAJIB DIISI ──` karena SinergiLaut membutuhkan kredensial ini. Jangan sesekali commit `.env.local` ke Git.

---

### Langkah 4 — Setup Database & Trigger SQL Terpusat
Untuk membangun skema, fungsi (trigger logic), dan migrasi tabel yang dibutuhkan:
1. Di dashboard Supabase, masuk ke tab **SQL Editor** → Klik **New Query**.
2. Salin isi dari *file* `supabase/schema.sql` dan **Run** *(jalan-kan hingga sukses)*.
3. Buka Query baru, salin isi dari `supabase/migrations/20260404_add_items_needed_receipt_urls.sql` dan **Run**.
4. Terakhir, buka Query baru, salin isi dari `supabase/rls-policies.sql` dan **Run**.

*(Langkah ini sangat penting agar fitur keamanan akses data per level user bekerja optimal).*

---

### Langkah 5 — Nonaktifkan Email Konfirmasi (Tujuan Testing)
Agar kamu tidak perlu memverifikasi email saat login *testing* lokal:
- Pergi ke menu **Authentication → Providers → Email** di Supabase.
- Matikan/nonaktifkan toggle **"Confirm email"** lalu simpan.

---

### Langkah 6 — Setup Storage Bucket
Sistem mermbutuhkan *bucket* storage untuk pendaftaran user, upload gambar dll. Kami sudah menyiapkan *script* node untuk membuatnya secara instan:
```bash
node setup-storage.mjs
```

---

### Langkah 7 — Generate Prisma Client
Agar TypeScript dan backend Next.js mengenali tipe data dari server kamu (menggunakan `DATABASE_URL`), jalankan:
```bash
npx prisma generate
```

---

### Langkah 8 — (Sangat Disarankan) Seed Data Dummy
Untuk mempermudah validasi semua fitur tanpa perlu membuat data manual, jalankan seed master:
```bash
npx tsx prisma/seed.ts
```
*(Script ini otomatis mendaftarkan admin, 3 komunitas, serta berbagai relawan dan kegiatan status review)*

---

### Langkah 9 — Jalankan Server Development!
Terakhir, jalankan SinergiLaut:
```bash
pnpm run dev
```
Buka browser dan seret navigasi web kamu ke → **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 🔑 Akun Demo (Setelah Seed)

Password semua akun: **`Password123!`**

### 👑 Admin
| Email | Akses |
|-------|-------|
| `admin@sinergilaut.id` | Penuh — semua fitur admin |

### 🏢 Community Manager
| Email | Komunitas |
|-------|-----------|
| `lautbiru@gmail.com` | Laut Biru Nusantara |
| `karangjaga@gmail.com` | Karang Jaga Indonesia |
| `pesisir@gmail.com` | Pesisir Bersih Movement |

### 🙋 User (Relawan / Donatur)
| Email | Nama |
|-------|------|
| `dewi@gmail.com` | Dewi Lestari |
| `rian@gmail.com` | Rian Permana |
| `maya@gmail.com` | Maya Putri |
| `fajar@gmail.com` | Fajar Nugroho |
| `anisa@gmail.com` | Anisa Rahma |

---

## 🗂️ Struktur Proyek

```
SinergiLaut/
├── app/
│   ├── login/, register/, forgot-password/     # Auth pages
│   ├── auth/callback/                           # Supabase OAuth callback
│   │
│   ├── dashboard/                               # ✅ Admin Dashboard (Overview)
│   ├── admin/
│   │   ├── communities/                         # Kelola Komunitas
│   │   ├── activities/                          # Kelola Kegiatan + Laporan
│   │   │   └── [id]/review/                     # Halaman review kegiatan (detail)
│   │   └── users/                               # Kelola Pengguna + Verifikasi Volunteer
│   │
│   ├── community/
│   │   ├── dashboard/                           # Dashboard pengelola komunitas
│   │   └── dashboard/activities/
│   │       ├── create/                          # Form buat kegiatan baru
│   │       └── [id]/                            # Detail kegiatan komunitas
│   │
│   ├── activities/                              # Daftar & detail kegiatan (publik)
│   │   └── [id]/page.tsx
│   ├── user/dashboard/                          # Dashboard relawan/donatur
│   ├── user/profile/                            # Edit profil
│   ├── endowment/                               # Dana Abadi
│   ├── community/[id]/                          # Profil komunitas (publik)
│   ├── about/, faq/, contact/                  # Halaman statis
│   └── api/midtrans/                            # Webhook payment
│
├── components/
│   ├── navigation.tsx                           # Navbar role-aware
│   └── ui/                                      # ShadcnUI components
│
├── lib/
│   ├── supabase/client.ts, server.ts            # Supabase clients
│   ├── actions/                                 # Server Actions
│   ├── types/index.ts                           # TypeScript types
│   └── utils/helpers.ts
│
├── supabase/
│   ├── schema.sql                               # Database schema (13+ tabel)
│   ├── rls-policies.sql                         # Row Level Security
│   └── migrations/
│       └── 20260404_add_items_needed_receipt_urls.sql
│
├── prisma/
│   ├── schema.prisma                            # Prisma schema
│   └── seed.ts                                  # Script seed data
│
├── middleware.ts                                 # Route protection & role redirects
├── setup-storage.mjs                            # Script setup Supabase Storage
├── .env.example                                 # Template environment variables
└── Dockerfile & docker-compose.yml
```

---

## 👥 Role & Akses

| Role | Dashboard | Akses |
|------|-----------|-------|
| `admin` | `/dashboard` | Overview stats + moderat semua konten |
| `admin` | `/admin/communities` | Verifikasi & kelola komunitas |
| `admin` | `/admin/activities` | Moderasi kegiatan & validasi laporan |
| `admin` | `/admin/users` | Verifikasi data diri volunteer |
| `community` | `/community/dashboard` | Buat & kelola kegiatan, upload laporan |
| `user` | `/user/dashboard` | Daftar relawan, donasi, riwayat |

---

## ✨ Fitur Utama

### Untuk Komunitas
- Registrasi komunitas → review oleh admin
- Buat kegiatan konservasi dengan form lengkap
- **Donasi Barang**: Tambahkan daftar barang + harga satuan + upload foto nota/kwitansi
- Harga barang otomatis di-markup **10%** setelah kegiatan disetujui
- Kelola pendaftaran relawan & donasi masuk
- Upload laporan pasca kegiatan

### Untuk Admin
- Overview stats real-time
- **Halaman review kegiatan** terpisah (`/admin/activities/[id]/review`) yang menampilkan:
  - Detail lengkap kegiatan + daftar barang + harga markup
  - Foto nota verifikasi (dengan peringatan jika tidak ada)
  - Tombol approve/reject dengan catatan alasan
- Verifikasi KTP & data diri volunteer
- Moderasi komunitas + sanksi

### Untuk Pengguna
- Login dengan Supabase Auth
- Daftar jadi relawan di kegiatan
- Donasi uang (via Midtrans) atau barang
- Pantau riwayat partisipasi & donasi

---

## 🤝 Alur Kontribusi

```bash
# 1. Pastikan kamu di branch main yang terbaru
git pull origin main

# 2. Buat branch baru
git checkout -b feature/nama-fitur

# 3. Commit perubahan
git add .
git commit -m "feat: deskripsi singkat perubahan"

# 4. Push dan buat Pull Request
git push origin feature/nama-fitur
```

### Format Commit Message
- `feat:` — fitur baru
- `fix:` — perbaikan bug
- `refactor:` — perubahan struktur kode
- `docs:` — perubahan dokumentasi

---

## 📞 Butuh Bantuan?

Jika ada kendala setup, hubungi tim pengembang via grup internal PPL.

---

<div align="center">

**SinergiLaut 🌊** — *Melindungi Laut, Menyambung Harapan*

</div>
