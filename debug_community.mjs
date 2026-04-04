import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

async function checkData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("=== USERS ===");
  const { data: users } = await supabase.auth.admin.listUsers();
  users.users.forEach(u => console.log(u.email, " | id:", u.id, " | role:", u.user_metadata?.role));

  console.log("\n=== COMMUNITIES ===");
  const { data: comms } = await supabase.from('communities').select('id, name, owner_id');
  console.log(comms);
  
  // Try to fix it automatically by assigning the first community without an owner to the current community user, or just assigning to lautbiru.
  const commUsers = users.users.filter(u => u.user_metadata?.role === 'community');
  for (let i = 0; i < commUsers.length; i++) {
     const user = commUsers[i];
     if (comms[i]) {
        await supabase.from('communities').update({ owner_id: user.id }).eq('id', comms[i].id);
        console.log(`Auto-assigned community ${comms[i].name} to user ${user.email}`);
     }
  }
}
checkData();
