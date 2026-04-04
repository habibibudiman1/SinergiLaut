-- Menambahkan kolom execution_date untuk tanggal pelaksanaan kegiatan
ALTER TABLE activities ADD COLUMN execution_date TIMESTAMPTZ;
