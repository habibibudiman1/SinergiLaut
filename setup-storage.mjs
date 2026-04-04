import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

async function setupStorage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const bucketName = 'sinergilaut-assets';

  console.log(`Checking bucket: ${bucketName}`);
  const { data: buckets } = await supabase.storage.listBuckets();
  
  let exists = buckets?.find(b => b.name === bucketName);
  
  if (!exists) {
    console.log(`Bucket ${bucketName} not found. Creating...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    });
    
    if (error) {
      console.error("Failed to create bucket:", error);
    } else {
      console.log("Bucket created successfully.");
      
      // Attempt to set public policy for the bucket 
      // Sometimes creating bucket via API is enough if it's public: true,
      // but inserting objects requires RLS on storage.objects.
      // Easiest is to bypass RLS by using service_role on the client? No, client uses Anon.
      // So anon needs INSERT access. Let's create an SQL policy for storage.objects.
    }
  } else {
    console.log("Bucket already exists.");
  }
}
setupStorage();
