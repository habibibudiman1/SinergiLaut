const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://phlnnucmdhfddcilxozy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobG5udWNtZGhmZGRjaWx4b3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTk1NjUsImV4cCI6MjA4OTc3NTU2NX0.OSujNtzRjNGiuEndupRrW1FUdoklhBMDATS0uiOF5lA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log("Menghubungkan ke Proyek Supabase V3 (Baru)...");
    
    // Test login
    console.log("Testing Login sebagai admin@sinergilaut.id...");
    const { data: signin, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@sinergilaut.id',
        password: 'password123'
    });
    
    if (authError) {
        console.error("❌ Login Error:", authError.message);
    } else {
        console.log("✅ Login SUKSES! Token Session didapatkan.");
    }

    // Test profiles table
    console.log("Testing Akses Tabel Profiles...");
    const { data: profiles, error: dbError } = await supabase.from('profiles').select('*');
    if (dbError) {
        console.error("❌ Profiles Table Error:", dbError.message);
    } else {
        console.log("✅ Profiles Table SUKSES! Menemukan", profiles.length, "profil.");
        profiles.forEach(p => console.log('   - ' + p.email + ' [Role: ' + p.role + ']'));
    }
}

verify();
