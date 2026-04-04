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

### Prasyarat

Pastikan sudah tersedia di komputer kamu:

| Tool | Versi | Cara Install |
|------|-------|--------------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org) |
| **pnpm** | Latest | `npm install -g pnpm` |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

---

### Langkah 1 — Clone & Install

```bash
git clone https://github.com/habibibudiman1/SinergiLaut.git
cd SinergiLaut
pnpm install
```

---

### Langkah 2 — Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) → **Start your project** → Login/Register
2. Klik **New Project**, isi nama project (contoh: `sinergilaut-dev`), pilih region **Southeast Asia**
3. Salin **Project URL** dan **API Keys** dari:
   > **Project Settings → API**

---

### Langkah 3 — Konfigurasi Environment Variables

Salin file template:

```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi variabel berikut:

```env
# ── WAJIB DIISI ─────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co        # dari Project Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...                    # "anon / public" key
SUPABASE_SERVICE_ROLE_KEY=eyJh...                        # "service_role" key ⚠️ RAHASIA!

NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=sinergilaut-assets
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ── PEMBAYARAN (untuk fitur donasi uang) ─────────────────
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx                   # dari dashboard.sandbox.midtrans.com
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

> ⚠️ **JANGAN commit file `.env.local` ke Git!** File ini sudah ada di `.gitignore`.

---

### Langkah 4 — Setup Database

Pergi ke **Supabase Dashboard → SQL Editor → New Query**, lalu jalankan file-file SQL berikut **satu per satu secara berurutan**:

#### Step 4a — Schema Utama
Salin dan jalankan isi file:
```
supabase/schema.sql
```

#### Step 4b — Migration (Fitur Donasi Barang)
Salin dan jalankan isi file:
```
supabase/migrations/20260404_add_items_needed_receipt_urls.sql
```

#### Step 4c — Row Level Security (RLS)
Salin dan jalankan isi file:
```
supabase/rls-policies.sql
```

#### Step 4d — Nonaktifkan Email Konfirmasi (untuk testing lokal)
Masuk ke: **Authentication → Providers → Email**
→ Matikan toggle **"Confirm email"**

---

### Langkah 5 — Setup Storage Bucket

Bucket storage dibutuhkan untuk menyimpan foto kegiatan, foto nota verifikasi, dan dokumen komunitas.

```bash
node setup-storage.mjs
```

Output yang diharapkan:
```
Checking bucket: sinergilaut-assets
Bucket already exists.  ✓
```

---

### Langkah 6 — Generate Prisma Client

Prisma digunakan untuk type-safe query dan script seeding.

```bash
npx prisma generate
```

---

### Langkah 7 — Jalankan Server Development

```bash
pnpm run dev
```

Buka browser dan kunjungi → **[http://localhost:3000](http://localhost:3000)** 🎉

---

### Langkah 8 — Seed Data Dummy (Opsional tapi Direkomendasikan)

Agar dashboard tidak kosong saat testing, jalankan script seed:

```bash
npx tsx prisma/seed.ts
```

Script ini akan otomatis membuat:
- **1 akun admin**
- **3 komunitas** (masing-masing sudah terverifikasi)
- **6 kegiatan** (beberapa dalam status review)
- **5 akun relawan/donatur**

> ⚠️ Menjalankan seed akan menghapus data dummy sebelumnya dan membuat ulang. Data real tidak terpengaruh.

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
