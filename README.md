# SinergiLaut — Platform Konservasi Laut Indonesia

Platform full-stack yang mempertemukan komunitas konservasi laut, relawan, donatur, dan admin dalam satu sistem terintegrasi.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + ShadcnUI
- **Backend/API:** Next.js API Routes / Server Actions
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Storage:** Supabase Storage
- **Realtime:** Supabase Realtime
- **Deployment:** Vercel / Docker

## Cara Menjalankan Lokal

### 1. Clone & Install

```bash
git clone <repo-url>
cd SinergiLaut
pnpm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local dengan nilai Supabase project Anda
```

Isi nilai berikut di `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — dari Supabase Dashboard → Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — dari Supabase Dashboard → Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — untuk server actions (jaga kerahasiaan!)

### 3. Setup Database (Supabase)

1. Buka [Supabase Dashboard](https://supabase.com) dan buat project baru
2. Buka **SQL Editor** dan jalankan:
   ```sql
   -- Jalankan schema terlebih dahulu
   \i supabase/schema.sql
   
   -- Lalu jalankan RLS policies
   \i supabase/rls-policies.sql
   ```
3. Di **Authentication → Settings**, aktifkan Email confirmations (opsional untuk development)

### 4. Jalankan Dev Server

```bash
pnpm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5. Seed Data Dummy (Opsional)

Untuk mengisi database dengan data dummy yang lengkap:

```bash
npx tsx prisma/seed.ts
```

Script ini akan membuat **9 user, 3 komunitas, 6 kegiatan**, dan data terkait lainnya secara otomatis.

> ⚠️ **Perhatian:** Menjalankan seed akan menghapus data dummy sebelumnya dan membuat ulang. Data non-dummy yang sudah ada tidak terpengaruh.

## 🔑 Demo Login Credentials

Semua akun demo menggunakan password: **`Password123!`**

### Admin

| Email | Password | Role |
|-------|----------|------|
| `admin@sinergilaut.id` | `Password123!` | Admin |

### Community Manager

| Email | Password | Komunitas |
|-------|----------|-----------|
| `lautbiru@gmail.com` | `Password123!` | Laut Biru Nusantara |
| `karangjaga@gmail.com` | `Password123!` | Karang Jaga Indonesia |
| `pesisir@gmail.com` | `Password123!` | Pesisir Bersih Movement |

### User (Relawan / Donatur)

| Email | Password | Nama |
|-------|----------|------|
| `dewi@gmail.com` | `Password123!` | Dewi Lestari |
| `rian@gmail.com` | `Password123!` | Rian Permana |
| `maya@gmail.com` | `Password123!` | Maya Putri |
| `fajar@gmail.com` | `Password123!` | Fajar Nugroho |
| `anisa@gmail.com` | `Password123!` | Anisa Rahma |

## Struktur Proyek

```
├── app/
│   ├── (auth pages) login/, register/, forgot-password/
│   ├── auth/callback/         # Supabase OAuth callback
│   ├── admin/dashboard/       # Admin panel
│   ├── community/dashboard/   # Community manager panel
│   ├── user/dashboard/        # User/volunteer dashboard
│   ├── user/profile/          # Edit profil pengguna
│   ├── activities/            # Daftar & detail kegiatan
│   ├── community/             # Halaman publik komunitas
│   ├── about/                 # Tentang SinergiLaut
│   ├── faq/                   # FAQ
│   ├── contact/               # Kontak
│   └── not-found.tsx          # Custom 404
│
├── components/
│   ├── navigation.tsx         # Role-aware navbar
│   ├── footer.tsx             # Footer
│   └── ui/                    # ShadcnUI components
│
├── contexts/
│   └── auth-context.tsx       # React auth context
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   └── server.ts          # Server Supabase client
│   ├── types/index.ts         # TypeScript types
│   ├── constants.ts           # App constants
│   └── utils/helpers.ts       # Utility functions
│
├── middleware.ts               # Route protection & role redirects
├── supabase/
│   ├── schema.sql             # Database schema (13 tables)
│   └── rls-policies.sql       # Row Level Security policies
├── Dockerfile                 # Production Docker image
├── docker-compose.yml         # Docker Compose config
└── .env.example               # Environment template
```

## User Roles

| Role | Akses | Dashboard |
|------|-------|-----------|
| `user` | Daftar relawan, donasi, lihat kegiatan | `/user/dashboard` |
| `community` | Buat & kelola kegiatan, upload laporan | `/community/dashboard` |
| `admin` | Verifikasi komunitas, moderasi, sanksi | `/admin/dashboard` |

## Fitur Utama

### Untuk Pengguna (Volunteer/Donatur)
- Registrasi & login dengan Supabase Auth
- Daftar sebagai relawan di kegiatan
- Donasi uang atau barang
- Pantau riwayat partisipasi & donasi
- Lihat laporan transparan pasca kegiatan

### Untuk Komunitas
- Registrasi komunitas (dengan review admin)
- Buat & kelola kegiatan konservasi
- Kelola pendaftaran relawan
- Pantau donasi masuk
- Upload laporan pasca kegiatan

### Untuk Admin
- Dashboard statistik platform
- Verifikasi/tolak komunitas baru
- Moderasi kegiatan (approve/reject)
- Validasi laporan
- Beri sanksi kepada komunitas

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
# Set environment variables di Vercel Dashboard
```

### Docker

```bash
docker build -t sinergil aut .
docker run -p 3000:3000 --env-file .env.local sinergil aut

# Atau dengan Docker Compose:
docker-compose up -d
```

## Lisensi

MIT License — see LICENSE file for details.
