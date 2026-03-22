"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import {
  Plus, Search, Calendar, Users, Heart, Banknote, FileText,
  Eye, Edit, MoreHorizontal, CheckCircle2, AlertCircle,
  Upload, TrendingUp, ArrowUpRight
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils/helpers"

const communityStats = [
  { label: "Total Kegiatan", value: "8", icon: Calendar, change: "+2 bulan ini" },
  { label: "Total Relawan", value: "234", icon: Users, change: "+45 bulan ini" },
  { label: "Total Donasi", value: formatCurrency(12500000), icon: Banknote, change: "+18%" },
  { label: "Laporan Terverifikasi", value: "6/8", icon: FileText, change: "75% selesai" },
]

const activities = [
  { id: "1", title: "Bersih-bersih Pantai Jakarta Bay", date: "2026-03-22", status: "published", volunteers: 45, quota: 60, donations: 3500000, hasReport: true, reportStatus: "validated" },
  { id: "2", title: "Coral Restoration Raja Ampat", date: "2026-04-15", status: "published", volunteers: 28, quota: 30, donations: 18750000, hasReport: false, reportStatus: null },
  { id: "3", title: "Workshop Biologi Laut", date: "2026-03-25", status: "pending_review", volunteers: 120, quota: 200, donations: 2100000, hasReport: false, reportStatus: null },
  { id: "4", title: "Penanaman Mangrove Surabaya", date: "2026-04-05", status: "draft", volunteers: 0, quota: 100, donations: 0, hasReport: false, reportStatus: null },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  published: { label: "Aktif", className: "bg-green-100 text-green-700" },
  pending_review: { label: "Menunggu Review", className: "bg-yellow-100 text-yellow-700" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  completed: { label: "Selesai", className: "bg-blue-100 text-blue-700" },
  cancelled: { label: "Dibatalkan", className: "bg-red-100 text-red-700" },
  validated: { label: "Valid", className: "bg-green-100 text-green-700" },
  submitted: { label: "Disubmit", className: "bg-blue-100 text-blue-700" },
}

type Tab = "overview" | "activities" | "reports"

export default function CommunityDashboardPage() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [search, setSearch] = useState("")

  const filtered = activities.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm text-primary font-medium">Komunitas Terverifikasi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Komunitas</h1>
              <p className="text-muted-foreground mt-1">Kelola kegiatan, relawan, dan laporan komunitas Anda</p>
            </div>
            <Button asChild>
              <Link href="/community/dashboard/activities/create">
                <Plus className="mr-2 h-4 w-4" /> Buat Kegiatan
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {communityStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" /> {stat.change}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[{ id: "overview", label: "Ringkasan" }, { id: "activities", label: "Kelola Kegiatan" }, { id: "reports", label: "Laporan" }].map((tab) => (
              <Button key={tab.id} variant={activeTab === tab.id ? "default" : "outline"} size="sm" onClick={() => setActiveTab(tab.id as Tab)}>
                {tab.label}
              </Button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Kegiatan Terbaru</CardTitle><CardDescription>Status kegiatan aktif</CardDescription></div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("activities")}>Lihat Semua <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.slice(0, 3).map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground line-clamp-1">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.volunteers}/{a.quota} relawan • {formatCurrency(a.donations)}</p>
                        </div>
                        <Badge className={statusConfig[a.status]?.className}>{statusConfig[a.status]?.label}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status Laporan</CardTitle>
                  <CardDescription>Laporan yang perlu diupload</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.filter(a => a.status === "published").map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{a.title}</p>
                        {a.hasReport
                          ? <Badge className={statusConfig[a.reportStatus!]?.className}>{statusConfig[a.reportStatus!]?.label}</Badge>
                          : <Button size="sm" variant="outline" asChild><Link href="#"><Upload className="h-3 w-3 mr-1" /> Upload</Link></Button>
                        }
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "activities" && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div><CardTitle>Kelola Kegiatan</CardTitle><CardDescription>Buat, edit, dan pantau kegiatan</CardDescription></div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-48" />
                    </div>
                    <Button asChild><Link href="/community/dashboard/activities/create"><Plus className="mr-2 h-4 w-4" /> Buat</Link></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {["Kegiatan", "Tanggal", "Relawan", "Donasi", "Status", "Aksi"].map((h) => (
                          <th key={h} className="text-left py-3 px-3 text-sm font-medium text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((a) => (
                        <tr key={a.id} className="border-b border-border last:border-0">
                          <td className="py-3 px-3 font-medium text-foreground text-sm max-w-[160px] truncate">{a.title}</td>
                          <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">{a.date}</td>
                          <td className="py-3 px-3 text-sm text-muted-foreground">{a.volunteers}/{a.quota}</td>
                          <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">{formatCurrency(a.donations)}</td>
                          <td className="py-3 px-3"><Badge className={statusConfig[a.status]?.className}>{statusConfig[a.status]?.label}</Badge></td>
                          <td className="py-3 px-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><Link href={`/activities/${a.id}`}><Eye className="h-4 w-4 mr-2" /> Lihat</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href={`/community/dashboard/activities/${a.id}/edit`}><Edit className="h-4 w-4 mr-2" /> Edit</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href={`/community/dashboard/activities/${a.id}/volunteers`}><Users className="h-4 w-4 mr-2" /> Relawan</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href={`/community/dashboard/activities/${a.id}/donors`}><Heart className="h-4 w-4 mr-2" /> Donatur</Link></DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "reports" && (
            <Card>
              <CardHeader><CardTitle>Laporan Kegiatan</CardTitle><CardDescription>Upload laporan pasca kegiatan untuk transparansi</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.filter(a => a.status === "published" || a.status === "completed").map((a) => (
                    <div key={a.id} className="p-4 border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {a.hasReport
                          ? <><Badge className={statusConfig[a.reportStatus!]?.className}>{statusConfig[a.reportStatus!]?.label}</Badge><Button size="sm" variant="outline" asChild><Link href="#">Lihat</Link></Button></>
                          : <><Badge className="bg-orange-100 text-orange-700"><AlertCircle className="h-3 w-3 mr-1" /> Belum Ada</Badge><Button size="sm" asChild><Link href="#"><Upload className="h-3 w-3 mr-1" /> Upload</Link></Button></>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
