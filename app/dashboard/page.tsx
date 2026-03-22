"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users, Building2, FileText, Banknote, Activity,
  CheckCircle2, X, AlertTriangle, Search, Eye, Shield,
  AlertCircle, MoreHorizontal, TrendingUp, Waves, Clock
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils/helpers"
import { toast } from "sonner"

const stats = [
  { label: "Total Komunitas", value: "48", icon: Building2, color: "text-primary", change: "+3 bulan ini" },
  { label: "Pengguna Aktif", value: "2,847", icon: Users, color: "text-blue-600", change: "+127 bulan ini" },
  { label: "Kegiatan Aktif", value: "24", icon: Activity, color: "text-green-600", change: "+5 minggu ini" },
  { label: "Donasi Terkumpul", value: formatCurrency(157000000), icon: Banknote, color: "text-accent-foreground", change: "+18% bulan ini" },
]

const pendingCommunities = [
  { id: "1", name: "Coral Care Indonesia", location: "Makassar, Sulawesi Selatan", email: "info@coralcare.id", submittedDate: "2026-03-20", description: "Komunitas konservasi terumbu karang di Sulawesi" },
  { id: "2", name: "Mangrove Watch Network", location: "Surabaya, Jawa Timur", email: "contact@mangrovewatch.id", submittedDate: "2026-03-19", description: "Jaringan pemantau mangrove Jawa Timur" },
  { id: "3", name: "Borneo Ocean Shield", location: "Balikpapan, Kalimantan Timur", email: "shield@borneo.id", submittedDate: "2026-03-18", description: "Pelindung ekosistem pesisir Kalimantan" },
]

const pendingActivities = [
  { id: "1", title: "Workshop Biologi Laut Sekolah", community: "Ocean Guardians Bali", date: "2026-03-25", submittedDate: "2026-03-21", category: "education", fundingGoal: 5000000 },
  { id: "2", title: "Ekspedisi Reef Check Nias", community: "Coral Triangle Foundation", date: "2026-04-10", submittedDate: "2026-03-20", category: "research", fundingGoal: 25000000 },
]

const pendingReports = [
  { id: "1", activityTitle: "Bersih-bersih Pantai Jakarta Bay", community: "Ocean Guardians Bali", submittedDate: "2026-03-19", period: "Maret 2026", filesCount: 3 },
  { id: "2", activityTitle: "Penanaman 5000 Mangrove Bali", community: "Green Coast Bali", submittedDate: "2026-03-18", period: "Februari 2026", filesCount: 5 },
]

const allCommunities = [
  { id: "1", name: "Ocean Guardians Bali", location: "Bali", status: "approved", activities: 12, members: 285, isSuspended: false },
  { id: "2", name: "Coral Triangle Foundation", location: "Jakarta", status: "approved", activities: 8, members: 134, isSuspended: false },
  { id: "3", name: "Blue Marine Jakarta", location: "Jakarta", status: "approved", activities: 5, members: 67, isSuspended: true },
]

type Tab = "overview" | "communities" | "activities" | "reports" | "users"

interface SanctionModal {
  open: boolean
  communityId: string | null
  communityName: string
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [search, setSearch] = useState("")
  const [sanctionModal, setSanctionModal] = useState<SanctionModal>({ open: false, communityId: null, communityName: "" })
  const [sanctionForm, setSanctionForm] = useState({ type: "warning", reason: "" })

  const handleApprove = (entity: string, id: string) => {
    toast.success(`${entity} #${id} berhasil disetujui`)
  }

  const handleReject = (entity: string, id: string) => {
    toast.error(`${entity} #${id} telah ditolak`)
  }

  const handleSanction = () => {
    toast.warning(`Sanksi diberikan pada ${sanctionModal.communityName}`)
    setSanctionModal({ open: false, communityId: null, communityName: "" })
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Kelola platform SinergiLaut</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
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
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pending Alerts */}
          {(pendingCommunities.length > 0 || pendingActivities.length > 0 || pendingReports.length > 0) && (
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">{pendingCommunities.length} komunitas</p>
                  <p className="text-xs text-yellow-600">Menunggu verifikasi</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">{pendingActivities.length} kegiatan</p>
                  <p className="text-xs text-blue-600">Menunggu persetujuan</p>
                </div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">{pendingReports.length} laporan</p>
                  <p className="text-xs text-green-600">Menunggu validasi</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[
              { id: "overview", label: "Ringkasan" },
              { id: "communities", label: "Komunitas" },
              { id: "activities", label: "Kegiatan" },
              { id: "reports", label: "Laporan" },
              { id: "users", label: "Pengguna" },
            ].map((tab) => (
              <Button key={tab.id} variant={activeTab === tab.id ? "default" : "outline"} size="sm"
                onClick={() => setActiveTab(tab.id as Tab)}>
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Pending Communities */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Komunitas Menunggu Verifikasi</CardTitle><CardDescription>Perlu tindakan admin</CardDescription></div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("communities")}>Lihat Semua</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingCommunities.slice(0, 3).map((c) => (
                      <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary rounded-lg border-l-4 border-l-yellow-400">
                        <div>
                          <p className="font-medium text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.location} • Daftar: {c.submittedDate}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50" onClick={() => handleApprove("Komunitas", c.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Setujui
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-50" onClick={() => handleReject("Komunitas", c.id)}>
                            <X className="h-4 w-4 mr-1" /> Tolak
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Activities */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Kegiatan Menunggu Persetujuan</CardTitle></div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("activities")}>Lihat Semua</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingActivities.map((a) => (
                      <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary rounded-lg border-l-4 border-l-blue-400">
                        <div>
                          <p className="font-medium text-foreground">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.community} • {a.date} • Target: {formatCurrency(a.fundingGoal)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleApprove("Kegiatan", a.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" /> Setujui
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject("Kegiatan", a.id)}>
                            <X className="h-4 w-4 mr-1 text-red-600" /> Tolak
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Reports */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Laporan Menunggu Validasi</CardTitle></div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("reports")}>Lihat Semua</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingReports.map((r) => (
                      <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary rounded-lg border-l-4 border-l-green-400">
                        <div>
                          <p className="font-medium text-foreground">{r.activityTitle}</p>
                          <p className="text-xs text-muted-foreground">{r.community} • {r.period} • {r.filesCount} file</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1" /> Review</Button>
                          <Button size="sm" variant="outline" onClick={() => handleApprove("Laporan", r.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" /> Validasi
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Communities Management */}
          {activeTab === "communities" && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div><CardTitle>Manajemen Komunitas</CardTitle><CardDescription>Seluruh komunitas terdaftar</CardDescription></div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari komunitas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-56" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-semibold text-foreground">Pending Verifikasi ({pendingCommunities.length})</h3>
                  {pendingCommunities.map((c) => (
                    <div key={c.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{c.name}</p>
                            <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{c.location} • {c.email}</p>
                          <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove("Komunitas", c.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Verifikasi
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject("Komunitas", c.id)}>
                            <X className="h-4 w-4 mr-1" /> Tolak
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-semibold text-foreground mb-3">Komunitas Aktif</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {["Komunitas", "Lokasi", "Kegiatan", "Anggota", "Status", "Aksi"].map((h) => (
                          <th key={h} className="text-left py-3 px-3 text-sm font-medium text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allCommunities.map((c) => (
                        <tr key={c.id} className="border-b border-border last:border-0">
                          <td className="py-3 px-3 font-medium text-sm text-foreground">{c.name}</td>
                          <td className="py-3 px-3 text-sm text-muted-foreground">{c.location}</td>
                          <td className="py-3 px-3 text-sm text-muted-foreground">{c.activities}</td>
                          <td className="py-3 px-3 text-sm text-muted-foreground">{c.members}</td>
                          <td className="py-3 px-3">
                            {c.isSuspended
                              ? <Badge className="bg-red-100 text-red-700">Disuspend</Badge>
                              : <Badge className="bg-green-100 text-green-700">Aktif</Badge>
                            }
                          </td>
                          <td className="py-3 px-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> Lihat Detail</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => setSanctionModal({ open: true, communityId: c.id, communityName: c.name })}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-2" /> Beri Sanksi
                                </DropdownMenuItem>
                                {c.isSuspended
                                  ? <DropdownMenuItem><CheckCircle2 className="h-4 w-4 mr-2" /> Cabut Suspend</DropdownMenuItem>
                                  : <DropdownMenuItem className="text-destructive"><AlertCircle className="h-4 w-4 mr-2" /> Suspend</DropdownMenuItem>
                                }
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

          {/* Activities moderation placeholder */}
          {activeTab === "activities" && (
            <Card>
              <CardHeader><CardTitle>Moderasi Kegiatan</CardTitle><CardDescription>Review dan setujui kegiatan yang diajukan komunitas</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingActivities.map((a) => (
                    <div key={a.id} className="p-4 border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.community} • {a.date}</p>
                        <Badge className="bg-primary/10 text-primary capitalize mt-1" >{a.category}</Badge>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1" /> Review</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove("Kegiatan", a.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Publis
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject("Kegiatan", a.id)}>
                          <X className="h-4 w-4 mr-1" /> Tolak
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports validation placeholder */}
          {activeTab === "reports" && (
            <Card>
              <CardHeader><CardTitle>Validasi Laporan</CardTitle><CardDescription>Periksa dan validasi laporan pasca kegiatan</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingReports.map((r) => (
                    <div key={r.id} className="p-4 border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{r.activityTitle}</p>
                        <p className="text-sm text-muted-foreground">{r.community} • {r.period} • {r.filesCount} file lampiran</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1" /> Buka Laporan</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove("Laporan", r.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Validasi
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject("Laporan", r.id)}>
                          <X className="h-4 w-4 mr-1" /> Tolak
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users tab placeholder */}
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div><CardTitle>Manajemen Pengguna</CardTitle><CardDescription>Pantau dan kelola seluruh pengguna</CardDescription></div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari pengguna..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-52" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto opacity-40 mb-3" />
                  <p>Data pengguna akan ditampilkan dari Supabase setelah konfigurasi.</p>
                  <p className="text-sm mt-1">Pastikan environment variables sudah dikonfigurasi.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Sanction Modal */}
      <Dialog open={sanctionModal.open} onOpenChange={(open) => setSanctionModal({ ...sanctionModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Beri Sanksi Komunitas</DialogTitle>
            <DialogDescription>{sanctionModal.communityName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Jenis Sanksi</Label>
              <div className="flex gap-2">
                {[{ v: "warning", l: "Peringatan" }, { v: "suspend", l: "Suspend" }, { v: "ban", l: "Ban Permanen" }].map((s) => (
                  <button key={s.v} type="button"
                    onClick={() => setSanctionForm({ ...sanctionForm, type: s.v })}
                    className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${sanctionForm.type === s.v ? "border-destructive bg-destructive/5 text-destructive" : "border-border"}`}>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alasan Sanksi</Label>
              <Textarea value={sanctionForm.reason} onChange={(e) => setSanctionForm({ ...sanctionForm, reason: e.target.value })} placeholder="Jelaskan alasan pemberian sanksi..." rows={4} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setSanctionModal({ open: false, communityId: null, communityName: "" })}>Batal</Button>
            <Button variant="destructive" className="flex-1" onClick={handleSanction} disabled={!sanctionForm.reason}>
              <AlertTriangle className="h-4 w-4 mr-2" /> Berikan Sanksi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
