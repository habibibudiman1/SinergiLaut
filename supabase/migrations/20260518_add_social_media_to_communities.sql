-- Menambahkan kolom media sosial ke tabel communities
-- Digunakan oleh halaman /community/dashboard/profile untuk update profil komunitas

DO $$ BEGIN
  ALTER TABLE communities ADD COLUMN instagram TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE communities ADD COLUMN facebook TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE communities ADD COLUMN twitter TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
