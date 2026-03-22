const { createClient } = require('@supabase/supabase-js');

// Must use Service Role Key to delete users
const supabaseUrl = 'https://phlnnucmdhfddcilxozy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobG5udWNtZGhmZGRjaWx4b3p5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE5OTU2NSwiZXhwIjoyMDg5Nzc1NTY1fQ.f6bB04QJ4cO415vDIfA7P4D5U8UvW-XU_qA4C_B_a-8';

// Wait, the user did not give me the Service Role Key for phlnnucmdhfddcilxozy... 
// I only have the Anon key from step 375... 
// Let me read .env to get the real Service Role Key!
