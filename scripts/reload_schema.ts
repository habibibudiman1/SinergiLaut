import postgres from "postgres";
import "dotenv/config";

const directUrl = process.env.DIRECT_URL!;
if (!directUrl) {
  console.error("❌ DIRECT_URL not set in .env");
  process.exit(1);
}

const sql = postgres(directUrl, { ssl: false });

async function reload() {
  console.log("🔄 Reloading Supabase PostgREST schema cache...");
  try {
    await sql`NOTIFY pgrst, 'reload schema'`;
    console.log("✅ Schema cache reloaded successfully.");
  } catch (e: any) {
    console.error("❌ Error:", e.message);
  }
  await sql.end();
}

reload();
