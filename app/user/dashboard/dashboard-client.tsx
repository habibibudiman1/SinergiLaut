"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users, Heart, Calendar, MapPin, Banknote, Package
} from "lucide-react"
import { formatCurrency, formatDateShort } from "@/lib/utils/helpers"

type UserTab = "overview" | "volunteer" | "donations"

const statusConfig: Record<string, { label: string; className: string }> = {
  approved:  { label: "Disetujui",  className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  pending:   { label: "Menunggu",   className: "bg-amber-50 text-amber-700 border-amber-100" },
  rejected:  { label: "Ditolak",    className: "bg-rose-50 text-rose-700 border-rose-100" },
  completed: { label: "Selesai",    className: "bg-blue-50 text-blue-700 border-blue-100" },
  attended:  { label: "Hadir",      className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
}

interface VolunteerItem {
  id: string
  status: string
  created_at: string
  activity: {
    id: string
    title: string
    slug: string
    start_date: string | null
    location: string | null
    cover_image_url: string | null
    status: string
    community: { name: string; logo_url: string | null } | null
  } | null
}

interface DonationItem {
  id: string
  type: string
  amount: number | null
  status: string
  created_at: string
  is_anonymous: boolean
  note: string | null
  activity: { id: string; title: string; slug: string } | null
  items: { item_name: string; quantity: number }[]
}

interface DashboardClientProps {
  volunteers: VolunteerItem[]
  donations: DonationItem[]
}

export function DashboardClient({ volunteers, donations }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<UserTab>("overview")

  const tabs = [
    { id: "overview",   label: "Ringkasan" },
    { id: "volunteer",  label: "Riwayat Relawan" },
    { id: "donations",  label: "Riwayat Donasi" },
  ]

  return (
    <>
      {/* Premium Tabs */}
      <div className="flex p-1.5 bg-white/50 backdrop-blur-md border border-white/80 rounded-2xl mb-8 w-fit gap-1 shadow-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as UserTab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                isActive 
                  ? "bg-linear-to-br from-[#06958a] to-[#0e7268] text-white shadow-md transform scale-105" 
                  : "text-[#475569] hover:bg-white/60 hover:text-[#0e2a3a]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Kegiatan Relawan */}
          <Card className="bg-white/70 backdrop-blur-xl border-white/80 shadow-sm overflow-hidden rounded-2xl group transition-all duration-500 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-extrabold text-[#0e2a3a]">Kegiatan Relawan</CardTitle>
                <CardDescription className="text-sm font-medium text-[#64748b]">Kegiatan yang Anda ikuti</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="font-bold text-[#06958a] hover:bg-[#06958a]/10" onClick={() => setActiveTab("volunteer")}>
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent>
              {volunteers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Belum ada riwayat pendaftaran relawan.
                </p>
              ) : (
                <div className="space-y-4">
                  {volunteers.slice(0, 3).map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-4 bg-white/40 border border-white/50 rounded-xl hover:bg-white/80 transition-all duration-300">
                      <div>
                        <p className="text-sm font-bold text-[#0e2a3a] line-clamp-1 mb-1">
                          {v.activity?.title ?? "—"}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] font-semibold text-[#64748b]">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-[#06958a]" />
                            {v.activity?.start_date ? formatDateShort(v.activity.start_date) : "—"}
                          </span>
                          {v.activity?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-[#06958a]" />
                              {v.activity.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className={`border px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusConfig[v.status]?.className}`}>
                        {statusConfig[v.status]?.label ?? v.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Riwayat Donasi */}
          <Card className="bg-white/70 backdrop-blur-xl border-white/80 shadow-sm overflow-hidden rounded-2xl group transition-all duration-500 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-extrabold text-[#0e2a3a]">Riwayat Donasi</CardTitle>
                <CardDescription className="text-sm font-medium text-[#64748b]">Donasi uang dan barang Anda</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="font-bold text-[#06958a] hover:bg-[#06958a]/10" onClick={() => setActiveTab("donations")}>
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Belum ada riwayat donasi.
                </p>
              ) : (
                <div className="space-y-4">
                  {donations.slice(0, 3).map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-4 bg-white/40 border border-white/50 rounded-xl hover:bg-white/80 transition-all duration-300">
                      <div>
                        <p className="text-sm font-bold text-[#0e2a3a] line-clamp-1 mb-1">
                          {d.activity?.title ?? "—"}
                        </p>
                        <p className="text-[11px] font-semibold text-[#06958a]">
                          {d.type === "money"
                            ? formatCurrency(d.amount ?? 0)
                            : d.items?.map((i) => `${i.item_name} (${i.quantity})`).join(", ") || "Barang"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <div className={`p-1.5 rounded-lg ${d.type === "money" ? "bg-emerald-50 text-emerald-600" : "bg-[#06958a]/10 text-[#06958a]"}`}>
                          {d.type === "money" ? <Banknote className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                        </div>
                        <Badge className={`border px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusConfig[d.status]?.className}`}>
                          {statusConfig[d.status]?.label ?? d.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Volunteer History */}
    {activeTab === "volunteer" && (
        <Card className="bg-white/70 backdrop-blur-xl border-white/80 shadow-sm overflow-hidden rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-extrabold text-[#0e2a3a]">
              <Users className="h-6 w-6 text-[#06958a]" /> Riwayat Relawan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {volunteers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-8 w-8 mx-auto text-muted-foreground mb-3 opacity-40" />
                <p className="text-muted-foreground">Belum ada riwayat pendaftaran relawan.</p>
                <Button asChild className="mt-4">
                  <Link href="/activities">Cari Kegiatan</Link>
                </Button>
              </div>
            ) : (
                <div className="space-y-4">
                {volunteers.map((v) => (
                  <div
                    key={v.id}
                    className="p-5 bg-white/40 border border-white/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/80"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {v.activity?.title ?? "—"}
                      </p>
                      <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-[#64748b] mt-3">
                        {v.activity?.start_date && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#06958a]" />
                            {formatDateShort(v.activity.start_date)}
                          </span>
                        )}
                        {v.activity?.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#06958a]" />
                            {v.activity.location}
                          </span>
                        )}
                        {v.activity?.community?.name && (
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-[#06958a]" />
                            {v.activity.community.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={`border px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${statusConfig[v.status]?.className}`}>
                      {statusConfig[v.status]?.label ?? v.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Donation History */}
    {activeTab === "donations" && (
        <Card className="bg-white/70 backdrop-blur-xl border-white/80 shadow-sm overflow-hidden rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-extrabold text-[#0e2a3a]">
              <Heart className="h-6 w-6 text-rose-500" /> Riwayat Donasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {donations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Belum ada riwayat donasi.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/40 text-left">
                      <th className="text-[11px] font-black text-[#64748b] uppercase tracking-widest py-4 px-5">Kegiatan</th>
                      <th className="text-[11px] font-black text-[#64748b] uppercase tracking-widest py-4 px-5">Jenis</th>
                      <th className="text-[11px] font-black text-[#64748b] uppercase tracking-widest py-4 px-5">Nilai</th>
                      <th className="text-[11px] font-black text-[#64748b] uppercase tracking-widest py-4 px-5">Tanggal</th>
                      <th className="text-[11px] font-black text-[#64748b] uppercase tracking-widest py-4 px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {donations.map((d) => (
                      <tr key={d.id} className="hover:bg-white/30 transition-colors">
                        <td className="py-5 px-5 text-sm font-bold text-[#0e2a3a] max-w-[220px] truncate">
                          {d.activity?.title ?? "—"}
                        </td>
                        <td className="py-5 px-5 text-center">
                          <div className={`inline-flex p-2 rounded-lg ${d.type === "money" ? "bg-emerald-50 text-emerald-600" : "bg-[#06958a]/10 text-[#06958a]"}`}>
                            {d.type === "money" ? <Banknote className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                          </div>
                        </td>
                        <td className="py-5 px-5 text-sm font-extrabold text-[#06958a]">
                          {d.type === "money"
                            ? formatCurrency(d.amount ?? 0)
                            : d.items?.map((i) => `${i.item_name} (${i.quantity})`).join(", ") || "—"}
                        </td>
                        <td className="py-5 px-5 text-xs font-semibold text-[#64748b]">
                          {formatDateShort(d.created_at)}
                        </td>
                        <td className="py-5 px-5">
                          <Badge className={`border px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${statusConfig[d.status]?.className}`}>
                            {statusConfig[d.status]?.label ?? d.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
