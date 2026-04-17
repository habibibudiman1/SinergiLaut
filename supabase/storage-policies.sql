-- ============================================
-- SinergiLaut - Storage RLS Policies
-- Jalankan skrip ini di SQL Editor Supabase Dashboard
-- ============================================

-- Pastikan bucket 'sinergilaut-assets' ada
-- (Dijalankan via setup-storage.mjs sebelumnya)

-- 1. Izinkan akses BACA ke semua file di bucket public bagi siapa saja
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'sinergilaut-assets' );

-- 2. Izinkan pengguna terautentikasi (authenticated) untuk UNGGAH ke folder avatars/ dan ktp/
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'sinergilaut-assets' AND
    (storage.foldername(name))[1] IN ('avatars', 'ktp')
);

-- 3. Izinkan pengguna untuk UPDATE file mereka sendiri (berdasarkan nama file yang diawali user id)
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'sinergilaut-assets' AND
    (auth.uid()::text = (storage.foldername(name))[2] OR name LIKE (auth.uid()::text || '%'))
);

-- 4. Izinkan pengguna untuk DELETE file mereka sendiri
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'sinergilaut-assets' AND
    (auth.uid()::text = (storage.foldername(name))[2] OR name LIKE (auth.uid()::text || '%'))
);
