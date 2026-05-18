import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserDashboardStats } from "@/lib/actions/dashboard.actions"
import { getMyVolunteerRegistrations } from "@/lib/actions/volunteer.actions"
import { getMyDonations } from "@/lib/actions/donation.actions"
import { formatCurrency } from "@/lib/utils/helpers"
import { Calendar, Heart, CheckCircle2, TrendingUp } from "lucide-react"
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

  // Fetch data user paralel (cepat — tidak termasuk activities)
  const [stats, volunteersResult, donationsResult] = await Promise.all([
    getUserDashboardStats(userId),
    getMyVolunteerRegistrations(userId),
    getMyDonations(userId),
  ])

  const volunteers = volunteersResult.data ?? []
  const donations  = donationsResult.data ?? []

  const firstName = profile?.full_name?.split(" ")[0] ?? "Pengguna"

  return (
    <main className="flex-1 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-14 md:pt-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Selamat datang, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Pantau partisipasi dan riwayat Anda di SinergiLaut
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Kegiatan Diikuti", value: stats.totalActivities,            icon: Calendar,     color: "text-teal-600",  bg: "bg-teal-50",   tag: stats.totalActivities > 0 ? "Aktif" : null },
            { label: "Total Donasi",     value: formatCurrency(stats.totalDonations), icon: Heart,    color: "text-teal-600",  bg: "bg-teal-50",   tag: null },
            { label: "Status Aktif",     value: stats.activeActivities,            icon: CheckCircle2, color: "text-teal-600",  bg: "bg-teal-50",   tag: stats.activeActivities > 0 ? "Berjalan" : "Kosong" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" /> Live
                  </p>
                </div>
                <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Component */}
        <DashboardClient volunteers={volunteers as any} donations={donations as any} />

      </div>
    </main>
  )
}
