-- ============================================
-- SinergiLaut - Row Level Security Policies
-- Run AFTER schema.sql
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Helper function: get current user role
-- ============================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'admin';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if current user owns a community
CREATE OR REPLACE FUNCTION owns_community(community_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM communities WHERE id = community_id AND owner_id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- PROFILES policies
-- ============================================

-- Anyone can read public profile info
DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT USING (true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admin can update any profile
DROP POLICY IF EXISTS "Admin can update any profile" ON profiles;
CREATE POLICY "Admin can update any profile"
  ON profiles FOR UPDATE USING (is_admin());

-- ============================================
-- COMMUNITIES policies
-- ============================================

-- Public can read verified, non-suspended communities
DROP POLICY IF EXISTS "Public can read verified communities" ON communities;
CREATE POLICY "Public can read verified communities"
  ON communities FOR SELECT
  USING (is_verified = true AND is_suspended = false);

-- Admin can read all communities
DROP POLICY IF EXISTS "Admin can read all communities" ON communities;
CREATE POLICY "Admin can read all communities"
  ON communities FOR SELECT USING (is_admin());

-- Community owner can read their own community
DROP POLICY IF EXISTS "Community owner can read own community" ON communities;
CREATE POLICY "Community owner can read own community"
  ON communities FOR SELECT USING (owner_id = auth.uid());

-- Community owners can update their own community
DROP POLICY IF EXISTS "Community owner can update own" ON communities;
CREATE POLICY "Community owner can update own"
  ON communities FOR UPDATE USING (owner_id = auth.uid());

-- Admin can update any community
DROP POLICY IF EXISTS "Admin can update any community" ON communities;
CREATE POLICY "Admin can update any community"
  ON communities FOR UPDATE USING (is_admin());

-- Authenticated users can create communities
DROP POLICY IF EXISTS "Authenticated users can create communities" ON communities;
CREATE POLICY "Authenticated users can create communities"
  ON communities FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- ============================================
-- COMMUNITY VERIFICATIONS policies
-- ============================================

-- Admin can read all verifications
DROP POLICY IF EXISTS "Admin can read all verifications" ON community_verifications;
CREATE POLICY "Admin can read all verifications"
  ON community_verifications FOR SELECT USING (is_admin());

-- Community owner can read their verification
DROP POLICY IF EXISTS "Community owner can read own verification" ON community_verifications;
CREATE POLICY "Community owner can read own verification"
  ON community_verifications FOR SELECT
  USING (EXISTS (SELECT 1 FROM communities c WHERE c.id = community_id AND c.owner_id = auth.uid()));

-- Admin can update verifications
DROP POLICY IF EXISTS "Admin can update verifications" ON community_verifications;
CREATE POLICY "Admin can update verifications"
  ON community_verifications FOR UPDATE USING (is_admin());

-- Authenticated users can insert verifications
DROP POLICY IF EXISTS "Authenticated users can create verification" ON community_verifications;
CREATE POLICY "Authenticated users can create verification"
  ON community_verifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- ACTIVITIES policies
-- ============================================

-- Anyone can read published activities
DROP POLICY IF EXISTS "Public can view published activities" ON activities;
CREATE POLICY "Public can view published activities"
  ON activities FOR SELECT USING (status = 'published');

-- Admin can view all activities
DROP POLICY IF EXISTS "Admin can view all activities" ON activities;
CREATE POLICY "Admin can view all activities"
  ON activities FOR SELECT USING (is_admin());

-- Community owners can view their own activities
DROP POLICY IF EXISTS "Community can view own activities" ON activities;
CREATE POLICY "Community can view own activities"
  ON activities FOR SELECT
  USING (owns_community(community_id));

-- Community owners can create activities for their community
DROP POLICY IF EXISTS "Community can create activities" ON activities;
CREATE POLICY "Community can create activities"
  ON activities FOR INSERT
  WITH CHECK (owns_community(community_id));

-- Community owners can update their activities
DROP POLICY IF EXISTS "Community can update own activities" ON activities;
CREATE POLICY "Community can update own activities"
  ON activities FOR UPDATE USING (owns_community(community_id));

-- Admin can update any activity
DROP POLICY IF EXISTS "Admin can update any activity" ON activities;
CREATE POLICY "Admin can update any activity"
  ON activities FOR UPDATE USING (is_admin());

-- ============================================
-- VOLUNTEER REGISTRATIONS policies
-- ============================================

-- Users can see their own registrations
DROP POLICY IF EXISTS "Users can view own volunteer registrations" ON volunteer_registrations;
CREATE POLICY "Users can view own volunteer registrations"
  ON volunteer_registrations FOR SELECT USING (user_id = auth.uid());

-- Community owners can see registrations for their activities
DROP POLICY IF EXISTS "Community can view activity volunteer registrations" ON volunteer_registrations;
CREATE POLICY "Community can view activity volunteer registrations"
  ON volunteer_registrations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM activities a
    WHERE a.id = activity_id AND owns_community(a.community_id)
  ));

-- Admin can see all
DROP POLICY IF EXISTS "Admin can view all volunteer registrations" ON volunteer_registrations;
CREATE POLICY "Admin can view all volunteer registrations"
  ON volunteer_registrations FOR SELECT USING (is_admin());

-- Authenticated users can register as volunteer
DROP POLICY IF EXISTS "Authenticated users can register as volunteer" ON volunteer_registrations;
CREATE POLICY "Authenticated users can register as volunteer"
  ON volunteer_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Community can update registration status
DROP POLICY IF EXISTS "Community can update volunteer status" ON volunteer_registrations;
CREATE POLICY "Community can update volunteer status"
  ON volunteer_registrations FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM activities a
    WHERE a.id = activity_id AND owns_community(a.community_id)
  ));

-- ============================================
-- DONATIONS policies
-- ============================================

-- Anyone can view completed, non-anonymous donations
DROP POLICY IF EXISTS "Public can view public donations" ON donations;
CREATE POLICY "Public can view public donations"
  ON donations FOR SELECT
  USING (status = 'completed' AND is_anonymous = false);

-- Users can view their own donations
DROP POLICY IF EXISTS "Users can view own donations" ON donations;
CREATE POLICY "Users can view own donations"
  ON donations FOR SELECT USING (user_id = auth.uid());

-- Community can view donations for their activities
DROP POLICY IF EXISTS "Community can view activity donations" ON donations;
CREATE POLICY "Community can view activity donations"
  ON donations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM activities a
    WHERE a.id = activity_id AND owns_community(a.community_id)
  ));

-- Admin can view all donations
DROP POLICY IF EXISTS "Admin can view all donations" ON donations;
CREATE POLICY "Admin can view all donations"
  ON donations FOR SELECT USING (is_admin());

-- Anyone can create donations
DROP POLICY IF EXISTS "Anyone can create donations" ON donations;
CREATE POLICY "Anyone can create donations"
  ON donations FOR INSERT WITH CHECK (true);

-- Admin can update donations
DROP POLICY IF EXISTS "Admin can update donations" ON donations;
CREATE POLICY "Admin can update donations"
  ON donations FOR UPDATE USING (is_admin());

-- ============================================
-- DONATION ITEMS policies
-- ============================================

-- Inherit access from parent donation
DROP POLICY IF EXISTS "View donation items if can view donation" ON donation_items;
CREATE POLICY "View donation items if can view donation"
  ON donation_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM donations d
    WHERE d.id = donation_id AND (
      d.user_id = auth.uid() OR
      is_admin() OR
      EXISTS (SELECT 1 FROM activities a WHERE a.id = d.activity_id AND owns_community(a.community_id))
    )
  ));

DROP POLICY IF EXISTS "Anyone can insert donation items" ON donation_items;
CREATE POLICY "Anyone can insert donation items"
  ON donation_items FOR INSERT WITH CHECK (true);

-- ============================================
-- REPORTS policies
-- ============================================

-- Public can view validated reports
DROP POLICY IF EXISTS "Public can view validated reports" ON reports;
CREATE POLICY "Public can view validated reports"
  ON reports FOR SELECT USING (status = 'validated');

-- Community can view own reports
DROP POLICY IF EXISTS "Community can view own reports" ON reports;
CREATE POLICY "Community can view own reports"
  ON reports FOR SELECT USING (owns_community(community_id));

-- Admin can view all reports
DROP POLICY IF EXISTS "Admin can view all reports" ON reports;
CREATE POLICY "Admin can view all reports"
  ON reports FOR SELECT USING (is_admin());

-- Community can create reports for their activities
DROP POLICY IF EXISTS "Community can create reports" ON reports;
CREATE POLICY "Community can create reports"
  ON reports FOR INSERT
  WITH CHECK (owns_community(community_id) AND submitted_by = auth.uid());

-- Community can update own draft/submitted reports
DROP POLICY IF EXISTS "Community can update own reports" ON reports;
CREATE POLICY "Community can update own reports"
  ON reports FOR UPDATE
  USING (owns_community(community_id) AND status IN ('draft', 'submitted'));

-- Admin can update any report
DROP POLICY IF EXISTS "Admin can update any report" ON reports;
CREATE POLICY "Admin can update any report"
  ON reports FOR UPDATE USING (is_admin());

-- ============================================
-- REPORT FILES policies  
-- ============================================

DROP POLICY IF EXISTS "Public can view files of validated reports" ON report_files;
CREATE POLICY "Public can view files of validated reports"
  ON report_files FOR SELECT
  USING (EXISTS (SELECT 1 FROM reports r WHERE r.id = report_id AND r.status = 'validated'));

DROP POLICY IF EXISTS "Community can view own report files" ON report_files;
CREATE POLICY "Community can view own report files"
  ON report_files FOR SELECT
  USING (EXISTS (SELECT 1 FROM reports r WHERE r.id = report_id AND owns_community(r.community_id)));

DROP POLICY IF EXISTS "Admin can view all report files" ON report_files;
CREATE POLICY "Admin can view all report files"
  ON report_files FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Community can insert report files" ON report_files;
CREATE POLICY "Community can insert report files"
  ON report_files FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM reports r WHERE r.id = report_id AND owns_community(r.community_id)));

-- ============================================
-- SANCTIONS policies
-- ============================================

-- Admin can view all sanctions
DROP POLICY IF EXISTS "Admin can manage sanctions" ON sanctions;
CREATE POLICY "Admin can manage sanctions"
  ON sanctions FOR ALL USING (is_admin());

-- Community can view own sanctions
DROP POLICY IF EXISTS "Community can view own sanctions" ON sanctions;
CREATE POLICY "Community can view own sanctions"
  ON sanctions FOR SELECT USING (owns_community(community_id));

-- ============================================
-- FEEDBACKS policies
-- ============================================

-- Public can read public feedbacks
DROP POLICY IF EXISTS "Public can read public feedbacks" ON feedbacks;
CREATE POLICY "Public can read public feedbacks"
  ON feedbacks FOR SELECT USING (is_public = true);

-- Users can view their own feedbacks
DROP POLICY IF EXISTS "Users can view own feedbacks" ON feedbacks;
CREATE POLICY "Users can view own feedbacks"
  ON feedbacks FOR SELECT USING (user_id = auth.uid());

-- Authenticated users can create feedback
DROP POLICY IF EXISTS "Users can create feedback" ON feedbacks;
CREATE POLICY "Users can create feedback"
  ON feedbacks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own feedback
DROP POLICY IF EXISTS "Users can update own feedback" ON feedbacks;
CREATE POLICY "Users can update own feedback"
  ON feedbacks FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS policies
-- ============================================

-- Users can view own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT USING (user_id = auth.uid());

-- Users can update own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Service role inserts notifications
DROP POLICY IF EXISTS "Service role can insert notifications" ON notifications;
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT WITH CHECK (true);

-- ============================================
-- AUDIT LOGS policies
-- ============================================

-- Only admin can view audit logs
DROP POLICY IF EXISTS "Admin can view audit logs" ON audit_logs;
CREATE POLICY "Admin can view audit logs"
  ON audit_logs FOR SELECT USING (is_admin());

-- Service role inserts audit logs
DROP POLICY IF EXISTS "Service role can insert audit logs" ON audit_logs;
CREATE POLICY "Service role can insert audit logs"
  ON audit_logs FOR INSERT WITH CHECK (true);


-- ============================================