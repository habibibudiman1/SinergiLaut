import { redirect } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { getUserDashboardStats } from "@/lib/actions/dashboard.actions"
import { getMyVolunteerRegistrations } from "@/lib/actions/volunteer.actions"
import { getMyDonations } from "@/lib/actions/donation.actions"
import { formatCurrency } from "@/lib/utils/helpers"
import { Calendar, Heart, CheckCircle2, ArrowRight, User } from "lucide-react"
import { DashboardClient } from "./dashboard-client"

export default async function UserDashboardPage() {
  // Verifikasi sesi server-side
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id

  // Ambil nama dari profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .single()

  // Fetch semua data paralel
  const [stats, volunteersResult, donationsResult] = await Promise.all([
    getUserDashboardStats(userId),
    getMyVolunteerRegistrations(userId),
    getMyDonations(userId),
  ])

  const volunteers = volunteersResult.data ?? []
  const donations  = donationsResult.data ?? []

  const firstName = profile?.full_name?.split(" ")[0] ?? "Pengguna"

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f8fafc] to-[#eff6ff] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(103,232,249,0.08)_0%,transparent_40%),radial-gradient(circle_at_80%_65%,rgba(6,149,138,0.06)_0%,transparent_40%)] pointer-events-none" />
      <Navigation />
      <main className="pt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0e2a3a] tracking-tight">
                Selamat datang, {firstName}! 👋
              </h1>
              <p className="text-[#475569] mt-2 font-medium">
                Pantau partisipasi dan riwayat Anda di SinergiLaut
              </p>
            </div>
            <Button variant="premium" size="lg" className="shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/activities" className="flex items-center gap-2">
                Temukan Kegiatan <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats Section with Glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Card 1: Kegiatan Diikuti */}
            <div className="group relative bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Kegiatan Diikuti</p>
                  <p className="text-4xl font-black text-[#0e2a3a] tracking-tighter">
                    {stats.totalActivities}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-14 h-14 bg-blue-50/80 border border-blue-100/50 rounded-2xl flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <Calendar className="h-7 w-7 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Total Donasi */}
            <div className="group relative bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Donasi</p>
                  <p className="text-4xl font-black text-[#0e2a3a] tracking-tighter">
                    {formatCurrency(stats.totalDonations)}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-14 h-14 bg-rose-50/80 border border-rose-100/50 rounded-2xl flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <Heart className="h-7 w-7 text-rose-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Status Aktif */}
            <div className="group relative bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Status Aktif</p>
                  <p className="text-4xl font-black text-[#0e2a3a] tracking-tighter">
                    {stats.activeActivities}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-14 h-14 bg-emerald-50/80 border border-emerald-100/50 rounded-2xl flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Component: Tabs + Lists */}
          <DashboardClient volunteers={volunteers as any} donations={donations as any} />

          {/* Profile Shortcut */}
          <div className="mt-12 flex justify-end">
            <Button variant="ghost" className="font-bold text-[#64748b] hover:text-[#0e2a3a] hover:bg-white/50 transition-all rounded-xl px-6" asChild>
              <Link href="/user/profile">
                <User className="mr-2 h-5 w-5" /> Edit Profil
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
