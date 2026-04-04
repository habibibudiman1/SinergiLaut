-- ============================================
-- Migration: Add Volunteer Verification Columns
-- Run this SQL in Supabase Dashboard > SQL Editor
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS volunteer_status text NOT NULL DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nik TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ktp_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS volunteer_verified_by UUID;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS volunteer_verified_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS volunteer_reject_note TEXT;

-- Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('volunteer_status', 'date_of_birth', 'nik', 'gender', 'address', 'ktp_url', 'volunteer_verified_by', 'volunteer_verified_at', 'volunteer_reject_note')
ORDER BY column_name;
