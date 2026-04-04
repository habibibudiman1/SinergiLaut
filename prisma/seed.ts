// ===========================================
// SinergiLaut - Database Seed Script
// Menggunakan Supabase Admin Client (service role)
// Jalankan: npx tsx prisma/seed.ts
// ===========================================

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diset di .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================
// Fixed UUIDs for referential integrity
// ============================================
const ADMIN_ID = "a0000000-0000-4000-8000-000000000001";
const COMMUNITY_USER_1 = "c0000000-0000-4000-8000-000000000001";
const COMMUNITY_USER_2 = "c0000000-0000-4000-8000-000000000002";
const COMMUNITY_USER_3 = "c0000000-0000-4000-8000-000000000003";
const USER_1 = "u0000000-0000-4000-8000-000000000001";
const USER_2 = "u0000000-0000-4000-8000-000000000002";
const USER_3 = "u0000000-0000-4000-8000-000000000003";
const USER_4 = "u0000000-0000-4000-8000-000000000004";
const USER_5 = "u0000000-0000-4000-8000-000000000005";

const COMM_1 = "d0000000-0000-4000-8000-000000000001";
const COMM_2 = "d0000000-0000-4000-8000-000000000002";
const COMM_3 = "d0000000-0000-4000-8000-000000000003";

const ACT_1 = "e0000000-0000-4000-8000-000000000001";
const ACT_2 = "e0000000-0000-4000-8000-000000000002";
const ACT_3 = "e0000000-0000-4000-8000-000000000003";
const ACT_4 = "e0000000-0000-4000-8000-000000000004";
const ACT_5 = "e0000000-0000-4000-8000-000000000005";
const ACT_6 = "e0000000-0000-4000-8000-000000000006";

const DON_1 = "f0000000-0000-4000-8000-000000000001";
const DON_2 = "f0000000-0000-4000-8000-000000000002";
const DON_3 = "f0000000-0000-4000-8000-000000000003";
const DON_4 = "f0000000-0000-4000-8000-000000000004";
const DON_5 = "f0000000-0000-4000-8000-000000000005";
const DON_6 = "f0000000-0000-4000-8000-000000000006";

const RPT_1 = "10000000-0000-4000-8000-000000000001";
const RPT_2 = "10000000-0000-4000-8000-000000000002";

const DISB_1 = "20000000-0000-4000-8000-000000000001";
const DISB_2 = "20000000-0000-4000-8000-000000000002";

// All user IDs for creating auth users
const ALL_USERS = [
  { id: ADMIN_ID, email: "admin@sinergilaut.id", full_name: "Admin SinergiLaut", role: "admin", phone: "081200000001", bio: "Platform administrator" },
  { id: COMMUNITY_USER_1, email: "lautbiru@gmail.com", full_name: "Budi Setiawan", role: "community", phone: "081200000011", bio: "Ketua Komunitas Laut Biru Nusantara" },
  { id: COMMUNITY_USER_2, email: "karangjaga@gmail.com", full_name: "Siti Nurhaliza", role: "community", phone: "081200000012", bio: "Koordinator Karang Jaga Indonesia" },
  { id: COMMUNITY_USER_3, email: "pesisir@gmail.com", full_name: "Ahmad Fauzi", role: "community", phone: "081200000013", bio: "Founder Pesisir Bersih Movement" },
  { id: USER_1, email: "dewi@gmail.com", full_name: "Dewi Lestari", role: "user", phone: "081200000021", bio: "Pecinta laut dan penyelam" },
  { id: USER_2, email: "rian@gmail.com", full_name: "Rian Permana", role: "user", phone: "081200000022", bio: "Mahasiswa biologi kelautan" },
  { id: USER_3, email: "maya@gmail.com", full_name: "Maya Putri", role: "user", phone: "081200000023", bio: "Relawan lingkungan aktif" },
  { id: USER_4, email: "fajar@gmail.com", full_name: "Fajar Nugroho", role: "user", phone: "081200000024", bio: "Fotografer bawah laut" },
  { id: USER_5, email: "anisa@gmail.com", full_name: "Anisa Rahma", role: "user", phone: "081200000025", bio: "Aktivis lingkungan hidup" },
];

// ============================================
// Helper: insert with error handling
// ============================================
async function insert(table: string, data: Record<string, unknown>[]) {
  const { error } = await supabase.from(table).insert(data);
  if (error) {
    console.error(`  ❌ Error inserting into ${table}:`, error.message);
    return false;
  }
  return true;
}

async function deleteAll(table: string) {
  // Delete all rows by matching any id (gte empty string for uuid)
  const { error } = await supabase.from(table).delete().gte("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    console.error(`  ⚠️ Warning deleting ${table}:`, error.message);
  }
}

// ============================================
// MAIN SEED FUNCTION
// ============================================
async function main() {
  console.log("🌊 SinergiLaut Seed — Mulai proses seeding...\n");

  // ========== CLEANUP ==========
  console.log("🧹 Menghapus data lama...");
  const tables = [
    "audit_logs", "notifications", "feedbacks", "sanctions",
    "report_files", "reports", "disbursements", "donation_items",
    "donations", "volunteer_registrations", "activities",
    "community_verifications", "communities", "journey_milestones",
  ];
  for (const table of tables) {
    await deleteAll(table);
  }

  // Delete demo auth users & profiles
  for (const user of ALL_USERS) {
    // Delete profile first
    await supabase.from("profiles").delete().eq("id", user.id);
    // Then delete auth user
    await supabase.auth.admin.deleteUser(user.id).catch(() => {});
  }
  console.log("✅ Data lama dihapus.\n");

  // ========== 1. CREATE AUTH USERS ==========
  console.log("👤 Creating auth users & profiles...");
  for (const user of ALL_USERS) {
    const { error } = await supabase.auth.admin.createUser({
      user_id: user.id,
      email: user.email,
      password: "Password123!",
      email_confirm: true,
      user_metadata: { full_name: user.full_name, role: user.role },
    });
    if (error) {
      console.error(`  ❌ Error creating user ${user.email}:`, error.message);
    } else {
      console.log(`  ✅ ${user.email} (${user.role})`);
    }
  }

  // Update profiles with additional data (trigger creates basic profile)
  // Wait a moment for triggers to fire
  await new Promise((r) => setTimeout(r, 2000));

  for (const user of ALL_USERS) {
    const updateData: Record<string, unknown> = {
      phone: user.phone,
      bio: user.bio,
      role: user.role,
    };

    // Add volunteer verification data for user-role profiles
    if (user.id === USER_1) {
      // Dewi - fully verified
      Object.assign(updateData, {
        volunteer_status: "approved",
        date_of_birth: "1998-05-15",
        nik: "3171015505980001",
        gender: "female",
        address: "Jl. Merdeka No. 10, Menteng, Jakarta Pusat",
        volunteer_verified_by: ADMIN_ID,
        volunteer_verified_at: new Date().toISOString(),
      });
    } else if (user.id === USER_2) {
      // Rian - fully verified
      Object.assign(updateData, {
        volunteer_status: "approved",
        date_of_birth: "2001-11-22",
        nik: "3171012211010002",
        gender: "male",
        address: "Jl. Kemanggisan No. 5, Slipi, Jakarta Barat",
        volunteer_verified_by: ADMIN_ID,
        volunteer_verified_at: new Date().toISOString(),
      });
    } else if (user.id === USER_3) {
      // Maya - pending verification
      Object.assign(updateData, {
        volunteer_status: "pending",
        date_of_birth: "2000-03-08",
        nik: "3171010803000003",
        gender: "female",
        address: "Jl. Sudirman No. 20, Bandung, Jawa Barat",
      });
    } else if (user.id === USER_4) {
      // Fajar - rejected (needs to resubmit)
      Object.assign(updateData, {
        volunteer_status: "rejected",
        date_of_birth: "1995-07-30",
        nik: "3171013007950004",
        gender: "male",
        address: "Jl. Pantai Indah No. 8, Surabaya, Jawa Timur",
        volunteer_verified_by: ADMIN_ID,
        volunteer_verified_at: new Date().toISOString(),
        volunteer_reject_note: "Foto KTP tidak jelas. Silakan upload ulang dengan kualitas lebih baik.",
      });
    } else if (user.id === USER_5) {
      // Anisa - verified
      Object.assign(updateData, {
        volunteer_status: "approved",
        date_of_birth: "1999-12-01",
        nik: "3171010112990005",
        gender: "female",
        address: "Jl. Asia Afrika No. 15, Yogyakarta, DIY",
        volunteer_verified_by: ADMIN_ID,
        volunteer_verified_at: new Date().toISOString(),
      });
    }

    await supabase.from("profiles").update(updateData).eq("id", user.id);
  }
  console.log("");

  // ========== 2. COMMUNITIES ==========
  console.log("🏘️ Seeding communities...");
  await insert("communities", [
    {
      id: COMM_1, owner_id: COMMUNITY_USER_1, name: "Laut Biru Nusantara", slug: "laut-biru-nusantara",
      description: "Komunitas konservasi laut yang berfokus pada pelestarian ekosistem terumbu karang di perairan Indonesia Timur.",
      location: "Manado, Sulawesi Utara", focus_areas: ["cleanup", "restoration", "education"],
      member_count: 150, is_verified: true, verification_status: "approved",
      bank_name: "BCA", bank_account_number: "1234567890", bank_account_name: "Laut Biru Nusantara",
    },
    {
      id: COMM_2, owner_id: COMMUNITY_USER_2, name: "Karang Jaga Indonesia", slug: "karang-jaga-indonesia",
      description: "Organisasi non-profit yang fokus pada perlindungan dan rehabilitasi terumbu karang di seluruh Indonesia.",
      location: "Denpasar, Bali", focus_areas: ["restoration", "research"],
      member_count: 85, is_verified: true, verification_status: "approved",
      bank_name: "BNI", bank_account_number: "0987654321", bank_account_name: "Karang Jaga Indonesia",
    },
    {
      id: COMM_3, owner_id: COMMUNITY_USER_3, name: "Pesisir Bersih Movement", slug: "pesisir-bersih-movement",
      description: "Gerakan bersih pantai dan edukasi masyarakat pesisir tentang pengelolaan sampah laut.",
      location: "Jakarta Utara, DKI Jakarta", focus_areas: ["cleanup", "education", "event"],
      member_count: 220, is_verified: false, verification_status: "pending",
      bank_name: "Mandiri", bank_account_number: "1122334455", bank_account_name: "Pesisir Bersih Movement",
    },
  ]);

  // ========== 3. COMMUNITY VERIFICATIONS ==========
  console.log("✅ Seeding community verifications...");
  await insert("community_verifications", [
    {
      community_id: COMM_1, status: "approved", admin_note: "Dokumen lengkap dan valid.",
      reviewed_by: ADMIN_ID, reviewed_at: "2025-06-15T00:00:00Z", documents: ["akta-pendirian.pdf", "surat-domisili.pdf"],
      legal_name: "Yayasan Laut Biru Nusantara", establishment_year: 2019,
      representative_name: "Budi Setiawan", representative_email: "lautbiru@gmail.com", representative_phone: "081200000011",
    },
    {
      community_id: COMM_2, status: "approved", admin_note: "Terverifikasi.",
      reviewed_by: ADMIN_ID, reviewed_at: "2025-07-20T00:00:00Z", documents: ["sk-kemenkumham.pdf"],
      legal_name: "Yayasan Karang Jaga Indonesia", establishment_year: 2020,
      representative_name: "Siti Nurhaliza", representative_email: "karangjaga@gmail.com", representative_phone: "081200000012",
    },
    {
      community_id: COMM_3, status: "pending", documents: ["proposal.pdf"],
      legal_name: "Pesisir Bersih Movement", establishment_year: 2022,
      representative_name: "Ahmad Fauzi", representative_email: "pesisir@gmail.com", representative_phone: "081200000013",
    },
  ]);

  // ========== 4. ACTIVITIES ==========
  console.log("📋 Seeding activities...");
  const now = new Date();
  const d = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();
  await insert("activities", [
    {
      id: ACT_1, community_id: COMM_1, title: "Bersih Pantai Bunaken", slug: "bersih-pantai-bunaken",
      description: "Kegiatan bersih-bersih pantai dan bawah laut di kawasan Taman Nasional Bunaken bersama masyarakat lokal dan penyelam.",
      category: "cleanup", status: "published", start_date: d(7), end_date: d(7.33),
      location: "Pantai Bunaken, Manado", latitude: 1.6232, longitude: 124.7639,
      volunteer_quota: 50, volunteer_count: 3, funding_goal: 5000000, funding_raised: 2500000,
      allow_item_donation: true, published_at: d(-5),
    },
    {
      id: ACT_2, community_id: COMM_1, title: "Transplantasi Karang Lembeh", slug: "transplantasi-karang-lembeh",
      description: "Program transplantasi terumbu karang di Selat Lembeh untuk memulihkan ekosistem yang rusak akibat aktivitas manusia.",
      category: "restoration", status: "published", start_date: d(14),
      location: "Selat Lembeh, Bitung", latitude: 1.4708, longitude: 125.268,
      volunteer_quota: 25, volunteer_count: 2, funding_goal: 15000000, funding_raised: 8000000,
      published_at: d(-3),
    },
    {
      id: ACT_3, community_id: COMM_2, title: "Edukasi Konservasi Laut untuk Anak", slug: "edukasi-konservasi-anak",
      description: "Workshop interaktif untuk anak-anak sekolah dasar di Bali tentang pentingnya menjaga ekosistem laut.",
      category: "education", status: "published", start_date: d(10),
      location: "Sanur, Bali", latitude: -8.6783, longitude: 115.2628,
      volunteer_quota: 20, funding_goal: 3000000, funding_raised: 1500000,
      published_at: d(-2),
    },
    {
      id: ACT_4, community_id: COMM_2, title: "Survey Terumbu Karang Nusa Penida", slug: "survey-karang-nusa-penida",
      description: "Survei ilmiah kondisi terumbu karang di perairan Nusa Penida untuk pemantauan ekosistem tahunan.",
      category: "research", status: "completed", start_date: d(-30), end_date: d(-28),
      location: "Nusa Penida, Bali", latitude: -8.7275, longitude: 115.5444,
      volunteer_quota: 15, volunteer_count: 12, funding_goal: 10000000, funding_raised: 10000000,
      published_at: d(-45),
    },
    {
      id: ACT_5, community_id: COMM_3, title: "Festival Laut Jakarta", slug: "festival-laut-jakarta",
      description: "Festival seni dan budaya bertema kelautan untuk meningkatkan kepedulian masyarakat urban terhadap laut.",
      category: "event", status: "pending_review", start_date: d(30),
      location: "Ancol, Jakarta Utara", latitude: -6.1231, longitude: 106.8456,
      volunteer_quota: 100, funding_goal: 25000000,
    },
    {
      id: ACT_6, community_id: COMM_3, title: "Bersih Pantai Ancol", slug: "bersih-pantai-ancol",
      description: "Aksi massal bersih-bersih Pantai Ancol bersama warga Jakarta dan komunitas peduli laut.",
      category: "cleanup", status: "draft", start_date: d(60),
      location: "Pantai Ancol, Jakarta", volunteer_quota: 200, funding_goal: 8000000,
    },
  ]);

  // ========== 5. VOLUNTEER REGISTRATIONS ==========
  console.log("🙋 Seeding volunteer registrations...");
  await insert("volunteer_registrations", [
    { activity_id: ACT_1, user_id: USER_1, full_name: "Dewi Lestari", email: "dewi@gmail.com", phone: "081200000021", reason: "Ingin berkontribusi menjaga laut", emergency_contact_name: "Agus Lestari", emergency_contact_phone: "081299900001", skills: ["diving", "photography"], t_shirt_size: "M", status: "approved", agreed_to_terms: true },
    { activity_id: ACT_1, user_id: USER_2, full_name: "Rian Permana", email: "rian@gmail.com", phone: "081200000022", reason: "Tugas kuliah dan passion", emergency_contact_name: "Ibu Rian", emergency_contact_phone: "081299900002", skills: ["research", "first_aid"], t_shirt_size: "L", status: "approved", agreed_to_terms: true },
    { activity_id: ACT_1, user_id: USER_3, full_name: "Maya Putri", email: "maya@gmail.com", phone: "081200000023", reason: "Peduli lingkungan", skills: ["logistics"], t_shirt_size: "S", status: "pending", agreed_to_terms: true },
    { activity_id: ACT_2, user_id: USER_1, full_name: "Dewi Lestari", email: "dewi@gmail.com", phone: "081200000021", reason: "Belajar transplantasi karang", skills: ["diving"], t_shirt_size: "M", status: "approved", agreed_to_terms: true },
    { activity_id: ACT_2, user_id: USER_4, full_name: "Fajar Nugroho", email: "fajar@gmail.com", phone: "081200000024", reason: "Dokumentasi bawah laut", skills: ["photography", "diving"], t_shirt_size: "XL", status: "approved", agreed_to_terms: true },
    { activity_id: ACT_3, user_id: USER_3, full_name: "Maya Putri", email: "maya@gmail.com", phone: "081200000023", reason: "Suka mengajar anak-anak", skills: ["teaching"], t_shirt_size: "S", status: "pending", agreed_to_terms: true },
    { activity_id: ACT_4, user_id: USER_2, full_name: "Rian Permana", email: "rian@gmail.com", phone: "081200000022", reason: "Riset skripsi", skills: ["research", "diving"], t_shirt_size: "L", status: "attended", agreed_to_terms: true },
    { activity_id: ACT_4, user_id: USER_5, full_name: "Anisa Rahma", email: "anisa@gmail.com", phone: "081200000025", reason: "Volunteer aktif", skills: ["logistics", "first_aid"], t_shirt_size: "M", status: "attended", agreed_to_terms: true },
  ]);

  // ========== 6. DONATIONS ==========
  console.log("💰 Seeding donations...");
  await insert("donations", [
    { id: DON_1, activity_id: ACT_1, user_id: USER_1, donor_name: "Dewi Lestari", donor_email: "dewi@gmail.com", type: "money", amount: 500000, midtrans_order_id: "SL-ord-001", midtrans_payment_type: "bank_transfer", status: "completed", note: "Semoga bermanfaat!" },
    { id: DON_2, activity_id: ACT_1, user_id: USER_4, donor_name: "Fajar Nugroho", donor_email: "fajar@gmail.com", type: "money", amount: 1000000, midtrans_order_id: "SL-ord-002", midtrans_payment_type: "gopay", status: "completed" },
    { id: DON_3, activity_id: ACT_1, user_id: null, donor_name: "Anonim", donor_email: "anonymous@mail.com", type: "money", amount: 1000000, midtrans_order_id: "SL-ord-003", status: "completed", is_anonymous: true },
    { id: DON_4, activity_id: ACT_2, user_id: USER_3, donor_name: "Maya Putri", donor_email: "maya@gmail.com", type: "money", amount: 3000000, midtrans_order_id: "SL-ord-004", midtrans_payment_type: "qris", status: "completed" },
    { id: DON_5, activity_id: ACT_2, user_id: USER_5, donor_name: "Anisa Rahma", donor_email: "anisa@gmail.com", type: "money", amount: 5000000, midtrans_order_id: "SL-ord-005", midtrans_payment_type: "bank_transfer", status: "pending" },
    { id: DON_6, activity_id: ACT_1, user_id: USER_2, donor_name: "Rian Permana", donor_email: "rian@gmail.com", type: "item", status: "completed", note: "Donasi peralatan selam" },
  ]);

  // ========== 7. DONATION ITEMS ==========
  console.log("📦 Seeding donation items...");
  await insert("donation_items", [
    { donation_id: DON_6, item_name: "Masker Snorkeling", quantity: 10, item_condition: "new", description: "Masker snorkeling merk Cressi", tracking_number: "JNE123456", courier: "JNE" },
    { donation_id: DON_6, item_name: "Fins (Kaki Katak)", quantity: 5, item_condition: "good", description: "Fins bekas pakai masih bagus", tracking_number: "JNE123456", courier: "JNE" },
    { donation_id: DON_6, item_name: "Sarung Tangan Selam", quantity: 15, item_condition: "new", tracking_number: "JNE789012", courier: "JNE" },
  ]);

  // ========== 8. DISBURSEMENTS ==========
  console.log("🏦 Seeding disbursements...");
  await insert("disbursements", [
    {
      id: DISB_1, activity_id: ACT_4, community_id: COMM_2, amount: 10000000, platform_fee: 500000,
      status: "completed", bank_name: "BNI", account_number: "0987654321", account_name: "Karang Jaga Indonesia",
      reference_number: "TRF-2026-001", notes: "Pencairan dana survey Nusa Penida",
      disbursed_by: ADMIN_ID, disbursed_at: d(-20),
    },
    {
      id: DISB_2, activity_id: ACT_1, community_id: COMM_1, amount: 2500000, platform_fee: 125000,
      status: "pending", bank_name: "BCA", account_number: "1234567890", account_name: "Laut Biru Nusantara",
      notes: "Pencairan dana bersih pantai Bunaken", disbursed_by: ADMIN_ID,
    },
  ]);

  // ========== 9. REPORTS ==========
  console.log("📝 Seeding reports...");
  await insert("reports", [
    {
      id: RPT_1, activity_id: ACT_4, community_id: COMM_2, submitted_by: COMMUNITY_USER_2,
      title: "Laporan Survey Terumbu Karang Nusa Penida 2026",
      summary: "Survey berhasil dilaksanakan selama 3 hari dengan 12 relawan. Ditemukan 45 spesies karang keras dan 120 spesies ikan karang.",
      fund_usage: [
        { category: "Transportasi", amount: 3000000, description: "Sewa kapal dan BBM" },
        { category: "Peralatan", amount: 4000000, description: "Sewa alat survey dan selam" },
        { category: "Konsumsi", amount: 2000000, description: "Makan dan minum 12 relawan 3 hari" },
        { category: "Dokumentasi", amount: 1000000, description: "Cetak laporan dan materi" },
      ],
      status: "validated", admin_note: "Laporan lengkap dan valid.", reviewed_by: ADMIN_ID,
      reviewed_at: d(-15), completion_status: "completed",
    },
    {
      id: RPT_2, activity_id: ACT_1, community_id: COMM_1, submitted_by: COMMUNITY_USER_1,
      title: "Laporan Progres Bersih Pantai Bunaken",
      summary: "Persiapan kegiatan sudah berjalan 60%. Koordinasi dengan TNB dan relawan lokal sudah selesai.",
      fund_usage: [{ category: "Koordinasi", amount: 500000, description: "Rapat koordinasi dengan pihak TNB" }],
      status: "draft", completion_status: "partial",
    },
  ]);

  // ========== 10. REPORT FILES ==========
  console.log("📎 Seeding report files...");
  await insert("report_files", [
    { report_id: RPT_1, file_url: "/reports/survey-nusa-penida-full.pdf", file_name: "survey-nusa-penida-full.pdf", file_type: "application/pdf", file_size: 2500000 },
    { report_id: RPT_1, file_url: "/reports/foto-survey-karang.zip", file_name: "foto-survey-karang.zip", file_type: "application/zip", file_size: 15000000 },
    { report_id: RPT_1, file_url: "/reports/data-spesies.xlsx", file_name: "data-spesies.xlsx", file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", file_size: 450000 },
  ]);

  // ========== 11. JOURNEY MILESTONES ==========
  console.log("🗺️ Seeding journey milestones...");
  // Delete existing milestones first
  await supabase.from("journey_milestones").delete().gte("year", 0);
  await insert("journey_milestones", [
    { year: 2020, title: "SinergiLaut Didirikan", description: "SinergiLaut lahir dari keresahan akan sulitnya koordinasi antar komunitas konservasi laut di Indonesia.", impact_stat: "Misi dimulai", icon: "Waves", order_index: 1 },
    { year: 2021, title: "Komunitas Pertama Bergabung", description: "Sebanyak 10 komunitas dari Jawa, Bali, dan Sulawesi bergabung. Total 500 relawan aktif.", impact_stat: "10 komunitas, 500+ relawan", icon: "Users", order_index: 2 },
    { year: 2022, title: "Sistem Donasi & Transparansi", description: "Meluncurkan sistem donasi terintegrasi dengan verifikasi penggunaan dana secara transparan.", impact_stat: "Rp 1M+ dana terhimpun", icon: "Banknote", order_index: 3 },
    { year: 2023, title: "Ekspansi ke 50+ Komunitas", description: "Jaringan mitra berkembang menjadi 50+ komunitas di 15 provinsi.", impact_stat: "50+ komunitas, 15 provinsi", icon: "Globe", order_index: 4 },
    { year: 2024, title: "Milestone 10.000 Relawan", description: "Mencapai 10.000+ relawan dan lebih dari Rp 5 miliar dana konservasi.", impact_stat: "10.000+ relawan, Rp 5M+", icon: "Award", order_index: 5 },
    { year: 2026, title: "Platform Generasi Baru", description: "Peluncuran platform baru dengan fitur realtime, dashboard, integrasi Midtrans, dan pencairan dana transparan.", impact_stat: "Fitur lengkap & real-time", icon: "Zap", order_index: 6 },
  ]);

  // ========== 12. SANCTIONS ==========
  console.log("⚠️ Seeding sanctions...");
  await insert("sanctions", [
    { community_id: COMM_3, issued_by: ADMIN_ID, type: "warning", reason: "Laporan kegiatan belum diserahkan lebih dari 30 hari setelah kegiatan selesai.", notes: "Peringatan pertama.", is_active: true },
  ]);

  // ========== 13. FEEDBACKS ==========
  console.log("⭐ Seeding feedbacks...");
  await insert("feedbacks", [
    { activity_id: ACT_4, user_id: USER_2, rating: 5, comment: "Pengalaman luar biasa! Belajar banyak tentang terumbu karang.", is_public: true },
    { activity_id: ACT_4, user_id: USER_5, rating: 4, comment: "Kegiatan sangat terorganisir. Sedikit masalah logistik tapi overall oke.", is_public: true },
    { activity_id: ACT_4, user_id: USER_1, rating: 5, comment: "Keren banget! Pasti ikut lagi tahun depan.", is_public: true },
  ]);

  // ========== 14. NOTIFICATIONS ==========
  console.log("🔔 Seeding notifications...");
  await insert("notifications", [
    { user_id: USER_1, title: "Pendaftaran Relawan Disetujui", message: "Pendaftaran Anda untuk kegiatan Bersih Pantai Bunaken telah disetujui.", type: "success", link: "/activities/bersih-pantai-bunaken" },
    { user_id: USER_2, title: "Pendaftaran Relawan Disetujui", message: "Pendaftaran Anda untuk kegiatan Bersih Pantai Bunaken telah disetujui.", type: "success", link: "/activities/bersih-pantai-bunaken" },
    { user_id: COMMUNITY_USER_1, title: "Donasi Baru Diterima", message: "Kegiatan Bersih Pantai Bunaken menerima donasi Rp 500.000.", type: "info", link: "/community/activities" },
    { user_id: COMMUNITY_USER_2, title: "Laporan Divalidasi", message: "Laporan Survey Nusa Penida telah divalidasi oleh admin.", type: "success", link: "/community/reports" },
    { user_id: COMMUNITY_USER_3, title: "Peringatan Diterima", message: "Komunitas Anda menerima peringatan. Silakan cek detail.", type: "warning", link: "/community/sanctions" },
    { user_id: ADMIN_ID, title: "Kegiatan Baru Menunggu Review", message: "Festival Laut Jakarta membutuhkan persetujuan.", type: "info", link: "/admin/activities" },
    { user_id: USER_3, title: "Menunggu Persetujuan", message: "Pendaftaran relawan Anda sedang ditinjau.", type: "info", link: "/activities/bersih-pantai-bunaken", is_read: true },
  ]);

  // ========== 15. AUDIT LOGS ==========
  console.log("📜 Seeding audit logs...");
  await insert("audit_logs", [
    { user_id: ADMIN_ID, action: "APPROVE", resource_type: "communities", resource_id: COMM_1, metadata: { status_from: "pending", status_to: "approved" } },
    { user_id: ADMIN_ID, action: "APPROVE", resource_type: "communities", resource_id: COMM_2, metadata: { status_from: "pending", status_to: "approved" } },
    { user_id: COMMUNITY_USER_1, action: "CREATE", resource_type: "activities", resource_id: ACT_1, metadata: { title: "Bersih Pantai Bunaken" } },
    { user_id: ADMIN_ID, action: "APPROVE", resource_type: "activities", resource_id: ACT_1, metadata: { status_from: "pending_review", status_to: "published" } },
    { user_id: USER_1, action: "CREATE", resource_type: "donations", resource_id: DON_1, metadata: { amount: 500000, type: "money" } },
    { user_id: ADMIN_ID, action: "VALIDATE", resource_type: "reports", resource_id: RPT_1, metadata: { title: "Laporan Survey Nusa Penida 2026" } },
    { user_id: ADMIN_ID, action: "CREATE", resource_type: "sanctions", metadata: { community: "Pesisir Bersih Movement", type: "warning" } },
    { user_id: ADMIN_ID, action: "CREATE", resource_type: "disbursements", resource_id: DISB_1, metadata: { amount: 10000000, community: "Karang Jaga Indonesia" } },
  ]);

  // ========== DONE ==========
  console.log("\n🎉 Seeding selesai! Data dummy berhasil dibuat:");
  console.log("   👤 9 profiles (1 admin, 3 community, 5 users)");
  console.log("   🏘️ 3 communities");
  console.log("   ✅ 3 community verifications");
  console.log("   📋 6 activities");
  console.log("   🙋 8 volunteer registrations");
  console.log("   💰 6 donations (5 uang, 1 barang)");
  console.log("   📦 3 donation items");
  console.log("   🏦 2 disbursements");
  console.log("   📝 2 reports");
  console.log("   📎 3 report files");
  console.log("   🗺️ 6 journey milestones");
  console.log("   ⚠️ 1 sanction");
  console.log("   ⭐ 3 feedbacks");
  console.log("   🔔 7 notifications");
  console.log("   📜 8 audit logs");
  console.log("\n   🔑 Semua user password: Password123!");
  console.log("   📧 Admin login: admin@sinergilaut.id / Password123!");
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
