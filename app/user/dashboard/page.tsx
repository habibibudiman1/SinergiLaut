"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
  Users, Heart, Calendar, Star, Bell, ArrowRight,
  CheckCircle2, Clock, MapPin, Banknote, Package, User
} from "lucide-react"
import { formatCurrency, formatDateShort } from "@/lib/utils/helpers"

// Mock data
const volunteerHistory = [
  { id: "1", activityTitle: "Bersih-bersih Pantai Jakarta Bay", date: "2026-03-22", location: "Ancol, Jakarta", status: "approved", community: "Ocean Guardians Bali" },
  { id: "2", activityTitle: "Coral Restoration Raja Ampat", date: "2026-04-15", location: "Raja Ampat", status: "pending", community: "Coral Triangle Foundation" },
  { id: "3", activityTitle: "Workshop Biologi Laut Sekolah", date: "2026-03-25", location: "Online", status: "approved", community: "Blue Marine Jakarta" },
]

const donationHistory = [
  { id: "1", activityTitle: "Bersih-bersih Pantai Jakarta Bay", amount: 100000, type: "money", status: "completed", date: "2026-03-10" },
  { id: "2", activityTitle: "Coral Restoration Raja Ampat", amount: 0, type: "item", itemName: "Sarung Tangan (10 pasang)", status: "completed", date: "2026-03-08" },
  { id: "3", activityTitle: "Penanaman Mangrove Surabaya", amount: 250000, type: "money", status: "pending", date: "2026-03-05" },
]

const notifications = [
  { id: "1", title: "Pendaftaran disetujui!", message: "Anda diterima sebagai relawan untuk Bersih-bersih Pantai Jakarta Bay.", type: "success", time: "2 jam lalu" },
  { id: "2", title: "Donasi diterima", message: "Donasi Anda untuk Coral Restoration telah dikonfirmasi.", type: "info", time: "1 hari lalu" },
  { id: "3", title: "Kegiatan akan dimulai", message: "Jangan lupa! Workshop Biologi Laut dimulai besok pukul 09.00.", type: "warning", time: "1 hari lalu" },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  approved: { label: "Disetujui", className: "bg-green-100 text-green-700" },
  pending: { label: "Menunggu", className: "bg-yellow-100 text-yellow-700" },
  rejected: { label: "Ditolak", className: "bg-red-100 text-red-700" },
  completed: { label: "Selesai", className: "bg-blue-100 text-blue-700" },
  attended: { label: "Hadir", className: "bg-green-100 text-green-700" },
}

type UserTab = "overview" | "volunteer" | "donations" | "notifications"

export default function UserDashboardPage() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<UserTab>("overview")

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Selamat datang, {profile?.full_name?.split(" ")[0] ?? "Pengguna"}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">Pantau partisipasi dan riwayat Anda di SinergiLaut</p>
            </div>
            <Button asChild>
              <Link href="/activities">
                Temukan Kegiatan <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Kegiatan Diikuti", value: "3", icon: Calendar, color: "text-primary" },
              { label: "Total Donasi", value: formatCurrency(350000), icon: Heart, color: "text-destructive" },
              { label: "Status Aktif", value: "2", icon: CheckCircle2, color: "text-green-600" },
              { label: "Rating Rata-rata", value: "4.8", icon: Star, color: "text-yellow-500" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[
              { id: "overview", label: "Ringkasan" },
              { id: "volunteer", label: "Riwayat Relawan" },
              { id: "donations", label: "Riwayat Donasi" },
              { id: "notifications", label: "Notifikasi" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id as UserTab)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Kegiatan Relawan</CardTitle>
                    <CardDescription>Kegiatan yang Anda ikuti</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("volunteer")}>Lihat Semua</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {volunteerHistory.slice(0, 3).map((v) => (
                      <div key={v.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground line-clamp-1">{v.activityTitle}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" /> {v.date}
                            <MapPin className="h-3 w-3 ml-1" /> {v.location}
                          </div>
                        </div>
                        <Badge className={statusConfig[v.status]?.className}>{statusConfig[v.status]?.label}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Riwayat Donasi</CardTitle>
                    <CardDescription>Donasi uang dan barang Anda</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("donations")}>Lihat Semua</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {donationHistory.slice(0, 3).map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground line-clamp-1">{d.activityTitle}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {d.type === "money" ? formatCurrency(d.amount) : d.itemName}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={d.type === "money" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-foreground"}>
                            {d.type === "money" ? <Banknote className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                          </Badge>
                          <Badge className={statusConfig[d.status]?.className}>{statusConfig[d.status]?.label}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Volunteer History */}
          {activeTab === "volunteer" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Riwayat Relawan</CardTitle>
              </CardHeader>
              <CardContent>
                {volunteerHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground mb-3 opacity-40" />
                    <p className="text-muted-foreground">Belum ada riwayat pendaftaran relawan.</p>
                    <Button asChild className="mt-4"><Link href="/activities">Cari Kegiatan</Link></Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {volunteerHistory.map((v) => (
                      <div key={v.id} className="p-4 border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-foreground">{v.activityTitle}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {v.date}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.location}</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {v.community}</span>
                          </div>
                        </div>
                        <Badge className={statusConfig[v.status]?.className}>{statusConfig[v.status]?.label}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Donation History */}
          {activeTab === "donations" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" /> Riwayat Donasi</CardTitle>
              </CardHeader>
              <CardContent>
                {donationHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">Belum ada riwayat donasi.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="text-sm font-medium text-muted-foreground py-3 px-4">Kegiatan</th>
                          <th className="text-sm font-medium text-muted-foreground py-3 px-4">Jenis</th>
                          <th className="text-sm font-medium text-muted-foreground py-3 px-4">Nilai</th>
                          <th className="text-sm font-medium text-muted-foreground py-3 px-4">Tanggal</th>
                          <th className="text-sm font-medium text-muted-foreground py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donationHistory.map((d) => (
                          <tr key={d.id} className="border-b border-border last:border-0">
                            <td className="py-4 px-4 text-sm font-medium text-foreground max-w-[200px] truncate">{d.activityTitle}</td>
                            <td className="py-4 px-4">
                              <Badge className={d.type === "money" ? "bg-primary/10 text-primary" : "bg-accent/10"}>
                                {d.type === "money" ? "Uang" : "Barang"}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-sm">{d.type === "money" ? formatCurrency(d.amount) : d.itemName}</td>
                            <td className="py-4 px-4 text-sm text-muted-foreground">{d.date}</td>
                            <td className="py-4 px-4">
                              <Badge className={statusConfig[d.status]?.className}>{statusConfig[d.status]?.label}</Badge>
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

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-3">
              {notifications.map((n) => (
                <Card key={n.id}>
                  <CardContent className="p-5 flex gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.type === "success" ? "bg-green-500" : n.type === "warning" ? "bg-yellow-500" : "bg-blue-500"}`} />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{n.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{n.time}</p>
                    </div>
                    <Button size="sm" variant="ghost">Baca</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Profile Shortcut */}
          <div className="mt-8 flex justify-end">
            <Button variant="outline" asChild>
              <Link href="/user/profile"><User className="mr-2 h-4 w-4" /> Edit Profil</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
