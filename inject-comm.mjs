import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

async function injectCommunity() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: users } = await supabase.auth.admin.listUsers();
  const commUsers = users.users.filter(u => u.user_metadata?.role === 'community');
  
  if (commUsers.length === 0) {
    console.log("No community users found!");
    // Lets also convert habibi to community just in case
    const me = users.users.find(u => u.email.includes("habib"));
    if (me) {
      await supabase.auth.admin.updateUserById(me.id, { user_metadata: { role: 'community' }});
      await supabase.from('profiles').update({ role: 'community' }).eq('id', me.id);
      commUsers.push(me);
    }
  }

  for (const user of commUsers) {
    const slug = 'komando-' + Math.random().toString(36).substring(7);
    const { error } = await supabase.from('communities').insert({
      owner_id: user.id,
      name: (user.user_metadata?.full_name || user.email.split('@')[0]) + " Conservation",
      slug: slug,
      description: "Auto generated for testing activities",
      is_verified: true,
      verification_status: 'approved'
    });
    if (error && error.code !== '23505') {
       console.error("Failed to insert community:", error);
    } else {
       console.log(`Successfully injected community for ${user.email}`);
    }
  }
}
injectCommunity();
