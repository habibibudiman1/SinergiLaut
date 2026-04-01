"use server"

/**
 * SinergiLaut — Volunteer Actions
 * Semua operasi CRUD untuk volunteer_registrations ke Supabase
 */

import { createClient } from "@/lib/supabase/client"
import type { VolunteerRegistration, VolunteerStatus } from "@/lib/types"

export interface RegisterVolunteerPayload {
  activityId: string
  userId: string
  fullName: string
  email: string
  phone: string
  reason?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  skills?: string[]
  tShirtSize?: string
  agreedToTerms: boolean
}

/** Mendaftarkan user sebagai relawan untuk suatu kegiatan */
export async function registerVolunteer(payload: RegisterVolunteerPayload) {
  const supabase = createClient()

  // Cek apakah user sudah terdaftar sebelumnya
  const { data: existing } = await supabase
    .from("volunteer_registrations")
    .select("id, status")
    .eq("activity_id", payload.activityId)
    .eq("user_id", payload.userId)
    .single()

  if (existing) {
    return {
      success: false,
      error: `Anda sudah terdaftar sebagai relawan untuk kegiatan ini. Status: ${existing.status}`,
    }
  }

  const { data, error } = await supabase
    .from("volunteer_registrations")
    .insert({
      activity_id: payload.activityId,
      user_id: payload.userId,
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      reason: payload.reason ?? null,
      emergency_contact_name: payload.emergencyContactName ?? null,
      emergency_contact_phone: payload.emergencyContactPhone ?? null,
      skills: payload.skills ?? [],
      t_shirt_size: payload.tShirtSize ?? null,
      agreed_to_terms: payload.agreedToTerms,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("[registerVolunteer] error:", error)
    return { success: false, error: "Gagal mendaftar relawan. Silakan coba lagi." }
  }

  return { success: true, data }
}

/** Ambil semua pendaftar relawan untuk activity tertentu (untuk pengelola komunitas) */
export async function getActivityVolunteers(activityId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("volunteer_registrations")
    .select(`
      *,
      user:profiles(id, full_name, avatar_url, email, phone)
    `)
    .eq("activity_id", activityId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[getActivityVolunteers] error:", error)
    return { success: false, data: [], error: "Gagal mengambil data relawan." }
  }

  return { success: true, data: data as (VolunteerRegistration & { user: unknown })[] }
}

/** Update status relawan: approved, rejected, atau attended */
export async function updateVolunteerStatus(
  registrationId: string,
  status: Extract<VolunteerStatus, "approved" | "rejected" | "attended">
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("volunteer_registrations")
    .update({ status })
    .eq("id", registrationId)
    .select()
    .single()

  if (error) {
    console.error("[updateVolunteerStatus] error:", error)
    return { success: false, error: "Gagal mengubah status relawan." }
  }

  return { success: true, data }
}

/** Ambil riwayat pendaftaran relawan untuk user yang sedang login */
export async function getMyVolunteerRegistrations(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("volunteer_registrations")
    .select(`
      *,
      activity:activities(id, title, slug, start_date, location, cover_image_url, status,
        community:communities(name, logo_url)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[getMyVolunteerRegistrations] error:", error)
    return { success: false, data: [], error: "Gagal mengambil data relawan." }
  }

  return { success: true, data }
}
