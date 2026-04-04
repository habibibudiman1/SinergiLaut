-- Migration: Tambah kolom items_needed dan receipt_urls ke tabel activities
-- Tanggal: 2026-04-04
-- Deskripsi: Mendukung fitur daftar barang yang diperlukan dan foto nota verifikasi

-- Tambah kolom items_needed (JSONB) - Array format: [{item_name, target, unit_price, donated}]
DO $$ BEGIN 
  ALTER TABLE activities ADD COLUMN items_needed JSONB DEFAULT NULL;
EXCEPTION WHEN duplicate_column THEN NULL; 
END $$;

-- Tambah kolom receipt_urls (TEXT[]) - Array URL foto nota/kwitansi untuk verifikasi admin
DO $$ BEGIN 
  ALTER TABLE activities ADD COLUMN receipt_urls TEXT[] DEFAULT '{}';
EXCEPTION WHEN duplicate_column THEN NULL; 
END $$;
