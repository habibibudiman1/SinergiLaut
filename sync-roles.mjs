import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log("Fetching users from auth...");
  
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error("Error fetching users:", usersError);
    process.exit(1);
  }

  let synced = 0;
  for (const user of usersData.users) {
    const roleFromMeta = user.user_metadata?.role || 'user';
    
    // Hardcode sync based on README to be absolutely sure
    let fixedRole = roleFromMeta;
    if (user.email === 'admin@sinergilaut.id') fixedRole = 'admin';
    if (['lautbiru@gmail.com', 'karangjaga@gmail.com', 'pesisir@gmail.com'].includes(user.email)) fixedRole = 'community';
    
    // Update auth metadata if it's not correct
    if (user.user_metadata?.role !== fixedRole) {
      await supabase.auth.admin.updateUserById(user.id, { user_metadata: { role: fixedRole } });
    }

    // Force sync the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: fixedRole })
      .eq('id', user.id);
      
    if (profileError) {
      console.error(`Error updating profile for ${user.email}:`, profileError);
    } else {
      console.log(`Synced ${user.email} -> ${fixedRole}`);
      synced++;
    }
  }
  
  console.log(`Synchronization complete! Synced ${synced} accounts.`);
}

main();
