"use server"

import { createClient } from "@/lib/supabase/server"

// --- ADMIN DASHBOARD ---

export async function getAdminDashboardStats() {
  const supabase = await createClient()

  // Total communities
  const { count: totalCommunities } = await supabase
    .from("communities")
    .select("*", { count: "exact", head: true })

  // Active users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  // Active activities
  const { count: totalActivities } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true })
    .in("status", ["published", "completed"])

  // Donations collected
  const { data: donations } = await supabase
    .from("donations")
    .select("amount")
    .eq("status", "completed")

  const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount || 0), 0) || 0

  return {
    totalCommunities: totalCommunities || 0,
    totalUsers: totalUsers || 0,
    totalActivities: totalActivities || 0,
    totalDonations
  }
}

export async function getPendingCommunities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false })

  if (error) console.error("Error fetching pending communities:", error)
  return data || []
}

export async function getPendingActivities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("activities")
    .select("*, community:communities(name)")
    .eq("status", "pending_review")
    .order("created_at", { ascending: false })

  if (error) console.error("Error fetching pending activities:", error)
  return data || []
}

export async function getPendingReports() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reports")
    .select("*, community:communities(name), activity:activities(title)")
    .eq("status", "submitted")
    .order("created_at", { ascending: false })

  if (error) console.error("Error fetching pending reports:", error)
  return data || []
}

export async function getAllCommunities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("communities")
    .select("*, verifications:community_verifications(*), owner:profiles(email)")
    .order("created_at", { ascending: false })

  if (error) console.error("Error fetching all communities:", error)

  // enrich with activity counts using a raw mapping if needed, or fallback.
  // For admin dashboard UI purposes, we'll map fields safely
  return data || []
}

// --- COMMUNITY DASHBOARD ---

export async function getCommunityDashboardStats(userId: string) {
  const supabase = await createClient()

  // First fetch the community owned by the user
  const { data: community } = await supabase
    .from("communities")
    .select("id")
    .eq("owner_id", userId)
    .single()

  if (!community) {
    return { totalActivities: 0, totalVolunteers: 0, totalDonations: 0, verifiedReports: "0/0" }
  }

  const communityId = community.id

  // Stats
  const { count: totalActivities } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true })
    .eq("community_id", communityId)

  const { data: acts } = await supabase
    .from("activities")
    .select("volunteer_count, funding_raised")
    .eq("community_id", communityId)

  let totalVolunteers = 0
  let totalDonations = 0
  acts?.forEach(a => {
    totalVolunteers += a.volunteer_count || 0
    totalDonations += Number(a.funding_raised || 0)
  })

  // Reports
  const { count: totalReports } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("community_id", communityId)

  const { count: verifiedReports } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("community_id", communityId)
    .eq("status", "validated")

  return {
    totalActivities: totalActivities || 0,
    totalVolunteers,
    totalDonations,
    verifiedReports: `${verifiedReports || 0}/${totalReports || 0}`
  }
}

export async function getCommunityActivities(userId: string) {
  const supabase = await createClient()
  
  const { data: community } = await supabase
    .from("communities")
    .select("id")
    .eq("owner_id", userId)
    .single()

  if (!community) return []

  // Left join to find if activity has a report
  const { data, error } = await supabase
    .from("activities")
    .select("*, reports(status)")
    .eq("community_id", community.id)
    .order("created_at", { ascending: false })

  if (error) console.error("Error fetching community activities:", error)
  return data || []
}

export async function getRegisteredCommunities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })

  if (error) console.error("Error fetching registered communities:", error)
  return data || []
}
