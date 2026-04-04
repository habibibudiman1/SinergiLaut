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

async function cleanAllUsers() {
  console.log("🧹 Fetching all users from Supabase Auth...");
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error("❌ Error fetching users:", error);
    return;
  }
  
  const users = data.users;
  console.log(`Found ${users.length} users. Deleting...`);
  
  for (const user of users) {
    console.log(`Deleting profile and auth for: ${user.email}`);
    await supabase.from("profiles").delete().eq("id", user.id);
    await supabase.auth.admin.deleteUser(user.id);
  }
  
  console.log("✅ All users deleted.");
}

cleanAllUsers().catch(console.error);
