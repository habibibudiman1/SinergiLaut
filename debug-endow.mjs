import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

async function testQuery() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: activities, error: actError } = await supabase
    .from("activities")
    .select("funding_raised, funding_goal, status")
    .in("status", ["completed", "cancelled"]);

  if (actError) {
    console.error("Activities Error full:", JSON.stringify(actError, null, 2));
  } else {
    console.log("Activities success:", activities?.length);
  }

  const { data: disbursements, error: disError } = await supabase
    .from("disbursements")
    .select("amount, notes")
    .eq("status", "completed")
    .ilike("notes", "%Dana Abadi%");

  if (disError) {
    console.error("Disbursements Error full:", JSON.stringify(disError, null, 2));
  } else {
    console.log("Disbursements success:", disbursements?.length);
  }
}

testQuery();
