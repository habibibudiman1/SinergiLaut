// Migration: Add volunteer verification columns to profiles
// Uses postgres.js for direct database connection
import postgres from "postgres";
import "dotenv/config";

const directUrl = process.env.DIRECT_URL!;
if (!directUrl) {
  console.error("❌ DIRECT_URL not set in .env");
  process.exit(1);
}

const sql = postgres(directUrl, { ssl: false });

async function migrate() {
  console.log("🔄 Running migration: Add volunteer verification columns...\n");

  try {
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS volunteer_status text NOT NULL DEFAULT 'pending'`;
    console.log("  ✅ volunteer_status");
    
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE`;
    console.log("  ✅ date_of_birth");
    
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nik TEXT`;
    console.log("  ✅ nik");
    
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT`;
    console.log("  ✅ gender");
    
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT`;
    console.log("  ✅ address");
    
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ktp_url TEXT`;
    console.log("  ✅ ktp_url");
    
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS volunteer_verified_by UUID`;
    console.log("  ✅ volunteer_verified_by");
    
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS volunteer_verified_at TIMESTAMPTZ`;
    console.log("  ✅ volunteer_verified_at");
    
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS volunteer_reject_note TEXT`;
    console.log("  ✅ volunteer_reject_note");

    console.log("\n🎉 Migration completed successfully!");

    // Verify
    const result = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'profiles' 
        AND column_name IN ('volunteer_status', 'date_of_birth', 'nik', 'gender', 'address', 'ktp_url', 'volunteer_verified_by', 'volunteer_verified_at', 'volunteer_reject_note')
      ORDER BY column_name
    `;
    console.log("\n📋 Verified columns:", result.map(r => r.column_name).join(", "));
  } catch (e: any) {
    console.error("❌ Migration error:", e.message);
  }

  await sql.end();
}

migrate();
