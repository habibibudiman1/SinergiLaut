"use client"

import { useState, useEffect } from "react"
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
  AlertCircle, MoreHorizontal, TrendingUp, Waves, Clock,
  UserCheck, ShieldCheck, ShieldX, Calendar, CreditCard,
  MapPin, Phone, Mail, ImageIcon, Loader2, ChevronDown,
  User as UserIcon
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { formatCurrency, formatDate } from "@/lib/utils/helpers"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import {
  getVolunteersPendingVerification,
  approveVolunteerVerification,
  rejectVolunteerVerification,
} from "@/lib/actions/volunteer-verification.actions"
import {
  getAdminDashboardStats,
  getPendingCommunities,
  getPendingActivities,
  getPendingReports,
  getAllCommunities
} from "@/lib/actions/dashboard.actions"
import type { Profile } from "@/lib/types"

// Dummy records removed; will fetch from Supabase.

type Tab = "overview" | "communities" | "activities" | "reports" | "users" | "volunteers"

interface SanctionModal {
  open: boolean
  communityId: string | null
  communityName: string
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [search, setSearch] = useState("")
  const [sanctionModal, setSanctionModal] = useState<SanctionModal>({ open: false, communityId: null, communityName: "" })
  const [sanctionForm, setSanctionForm] = useState({ type: "warning", reason: "" })

  const [stats, setStats] = useState({ totalCommunities: 0, totalUsers: 0, totalActivities: 0, totalDonations: 0 })
  const [pendingCommunities, setPendingCommunities] = useState<any[]>([])
  const [pendingActivities, setPendingActivities] = useState<any[]>([])
  const [pendingReports, setPendingReports] = useState<any[]>([])
  const [allCommunities, setAllCommunities] = useState<any[]>([])

  useEffect(() => {
    async function loadAdminData() {
      const st = await getAdminDashboardStats()
      setStats(st)
      const pc = await getPendingCommunities()
      setPendingCommunities(pc)
      const pa = await getPendingActivities()
      setPendingActivities(pa)
      const pr = await getPendingReports()
      setPendingReports(pr)
      const ac = await getAllCommunities()
      setAllCommunities(ac)
    }
    loadAdminData()
  }, [])

  const displayStats = [
    { label: "Total Komunitas", value: stats.totalCommunities, icon: Building2, color: "text-primary", change: "Live" },
    { label: "Pengguna Aktif", value: stats.totalUsers, icon: Users, color: "text-blue-600", change: "Live" },
    { label: "Kegiatan Aktif", value: stats.totalActivities, icon: Activity, color: "text-green-600", change: "Live" },
    { label: "Donasi Terkumpul", value: formatCurrency(stats.totalDonations), icon: Banknote, color: "text-accent-foreground", change: "Live" },
  ]

  // Volunteer verification state
  const [volunteers, setVolunteers] = useState<Profile[]>([])
  const [volunteersLoading, setVolunteersLoading] = useState(false)
  const [volunteerFilter, setVolunteerFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [volunteerSearch, setVolunteerSearch] = useState("")
  const [expandedVolunteerId, setExpandedVolunteerId] = useState<string | null>(null)
  const [updatingVolunteerId, setUpdatingVolunteerId] = useState<string | null>(null)
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; userId: string; userName: string }>({ open: false, userId: "", userName: "" })
  const [rejectReason, setRejectReason] = useState("")

  // Load volunteers when tab is active
  useEffect(() => {
    if (activeTab === "volunteers" || activeTab === "overview") {
      loadVolunteers()
    }
  }, [activeTab, volunteerFilter])

  async function loadVolunteers() {
    setVolunteersLoading(true)
    const statusArg = volunteerFilter === "all" ? undefined : volunteerFilter
    const result = await getVolunteersPendingVerification(statusArg as any)
    if (result.success) {
      setVolunteers(result.data as Profile[])
    }
    setVolunteersLoading(false)
  }

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

  // Volunteer verification actions
  async function handleApproveVolunteer(userId: string) {
    if (!user) return
    setUpdatingVolunteerId(userId)
    const result = await approveVolunteerVerification(userId)
    if (result.success) {
      toast.success("Volunteer berhasil diverifikasi! ✅")
      setVolunteers(prev => prev.map(v => v.id === userId ? { ...v, volunteer_status: "approved" as const } : v))
    } else {
      toast.error(result.error ?? "Gagal memverifikasi.")
    }
    setUpdatingVolunteerId(null)
  }

  async function handleRejectVolunteer() {
    if (!user || !rejectDialog.userId) return
    if (!rejectReason.trim()) {
      toast.error("Harap isi alasan penolakan.")
      return
    }
    setUpdatingVolunteerId(rejectDialog.userId)
    const result = await rejectVolunteerVerification(rejectDialog.userId, rejectReason)
    if (result.success) {
      toast.info("Verifikasi volunteer ditolak.")
      setVolunteers(prev => prev.map(v => v.id === rejectDialog.userId ? {
        ...v, volunteer_status: "rejected" as const, volunteer_reject_note: rejectReason
      } : v))
      setRejectDialog({ open: false, userId: "", userName: "" })
      setRejectReason("")
    } else {
      toast.error(result.error ?? "Gagal menolak.")
    }
    setUpdatingVolunteerId(null)
  }

  // Filtered volunteers
  const filteredVolunteers = volunteers.filter(v => {
    const matchSearch = !volunteerSearch ||
      v.full_name?.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.email.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.nik?.includes(volunteerSearch)
    return matchSearch
  })

  const pendingVolunteerCount = volunteers.filter(v => v.volunteer_status === "pending").length

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
            {displayStats.map((stat) => (
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("communities")}>
              <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">{pendingCommunities.length} komunitas</p>
                <p className="text-xs text-yellow-600">Menunggu verifikasi</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("activities")}>
              <Activity className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">{pendingActivities.length} kegiatan</p>
                <p className="text-xs text-blue-600">Menunggu persetujuan</p>
              </div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("reports")}>
              <FileText className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">{pendingReports.length} laporan</p>
                <p className="text-xs text-green-600">Menunggu validasi</p>
              </div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("volunteers")}>
              <UserCheck className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-purple-800">{pendingVolunteerCount} volunteer</p>
                <p className="text-xs text-purple-600">Menunggu verifikasi data diri</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[
              { id: "overview", label: "Ringkasan" },
              { id: "communities", label: "Komunitas" },
              { id: "activities", label: "Kegiatan" },
              { id: "reports", label: "Laporan" },
              { id: "volunteers", label: `Verifikasi Volunteer${pendingVolunteerCount > 0 ? ` (${pendingVolunteerCount})` : ""}` },
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
              {/* Pending Volunteer Verification */}
              {pendingVolunteerCount > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle>Volunteer Menunggu Verifikasi</CardTitle><CardDescription>Data diri perlu diverifikasi</CardDescription></div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("volunteers")}>Lihat Semua</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredVolunteers.filter(v => v.volunteer_status === "pending").slice(0, 3).map((v) => (
                        <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary rounded-lg border-l-4 border-l-purple-400">
                          <div>
                            <p className="font-medium text-foreground">{v.full_name ?? "—"}</p>
                            <p className="text-xs text-muted-foreground">{v.email} • NIK: {v.nik ?? "—"}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50"
                              disabled={updatingVolunteerId === v.id} onClick={() => handleApproveVolunteer(v.id)}>
                              {updatingVolunteerId === v.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 mr-1" /> Setujui</>}
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-50"
                              onClick={() => setRejectDialog({ open: true, userId: v.id, userName: v.full_name ?? "Volunteer" })}>
                              <X className="h-4 w-4 mr-1" /> Tolak
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

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
                          <p className="text-xs text-muted-foreground">{c.location || "Tanpa Lokasi"} • Daftar: {formatDate(c.created_at || new Date())}</p>
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
                          <p className="text-xs text-muted-foreground">{a.community?.name || "Komunitas"} • {formatDate(a.start_date || new Date())} • Target: {formatCurrency(a.funding_goal || 0)}</p>
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
                          <p className="font-medium text-foreground">{r.activity?.title || "Kegiatan"}</p>
                          <p className="text-xs text-muted-foreground">{r.community?.name || "Komunitas"} • Dibuat: {formatDate(r.created_at || new Date())}</p>
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

          {/* ═══════════ TAB: VOLUNTEER VERIFICATION ═══════════ */}
          {activeTab === "volunteers" && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" /> Verifikasi Data Diri Volunteer</CardTitle>
                    <CardDescription>Review dan verifikasi data diri volunteer sebelum mereka dapat mendaftar kegiatan</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari nama / email / NIK..." value={volunteerSearch}
                      onChange={(e) => setVolunteerSearch(e.target.value)} className="pl-9 w-64" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter chips */}
                <div className="flex gap-2 mb-6">
                  {([
                    { key: "all", label: "Semua", count: volunteers.length },
                    { key: "pending", label: "Menunggu", count: volunteers.filter(v => v.volunteer_status === "pending").length },
                    { key: "approved", label: "Disetujui", count: volunteers.filter(v => v.volunteer_status === "approved").length },
                    { key: "rejected", label: "Ditolak", count: volunteers.filter(v => v.volunteer_status === "rejected").length },
                  ] as const).map(f => (
                    <button key={f.key} onClick={() => setVolunteerFilter(f.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        volunteerFilter === f.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}>
                      {f.label} ({f.count})
                    </button>
                  ))}
                </div>

                {volunteersLoading ? (
                  <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : filteredVolunteers.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <UserCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>Tidak ada volunteer yang ditemukan.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredVolunteers.map((v) => (
                      <div key={v.id} className={`border rounded-xl overflow-hidden transition-all ${
                        v.volunteer_status === "pending" ? "border-yellow-300 bg-yellow-50/30 dark:bg-yellow-950/10" :
                        v.volunteer_status === "rejected" ? "border-red-200 bg-red-50/20 dark:bg-red-950/10" :
                        "border-border"
                      }`}>
                        {/* Header row */}
                        <button type="button"
                          onClick={() => setExpandedVolunteerId(expandedVolunteerId === v.id ? null : v.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                              {(v.full_name ?? "?")[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground text-sm">{v.full_name ?? "—"}</p>
                                <Badge className={
                                  v.volunteer_status === "approved" ? "bg-green-100 text-green-700" :
                                  v.volunteer_status === "rejected" ? "bg-red-100 text-red-700" :
                                  "bg-yellow-100 text-yellow-700"
                                }>
                                  {v.volunteer_status === "approved" ? "Disetujui" :
                                   v.volunteer_status === "rejected" ? "Ditolak" : "Menunggu"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{v.email} • NIK: {v.nik ?? "—"}</p>
                            </div>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedVolunteerId === v.id ? "rotate-180" : ""}`} />
                        </button>

                        {/* Expanded detail */}
                        {expandedVolunteerId === v.id && (
                          <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Nama Lengkap</p>
                                  <p className="font-medium">{v.full_name ?? "—"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Email</p>
                                  <p className="font-medium">{v.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Telepon</p>
                                  <p className="font-medium">{v.phone ?? "—"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">NIK</p>
                                  <p className="font-medium font-mono">{v.nik ?? "—"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Tanggal Lahir</p>
                                  <p className="font-medium">{v.date_of_birth ?? "—"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Jenis Kelamin</p>
                                  <p className="font-medium">{v.gender === "male" ? "Laki-laki" : v.gender === "female" ? "Perempuan" : "—"}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs text-muted-foreground">Alamat</p>
                                <p className="font-medium">{v.address ?? "—"}</p>
                              </div>
                            </div>

                            {/* KTP Image */}
                            {v.ktp_url && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" /> Foto KTP</p>
                                <a href={v.ktp_url} target="_blank" rel="noopener noreferrer"
                                  className="inline-block border border-border rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                                  <img src={v.ktp_url} alt="Foto KTP" className="max-w-xs max-h-48 object-contain" />
                                </a>
                              </div>
                            )}

                            {/* Rejection note */}
                            {v.volunteer_status === "rejected" && v.volunteer_reject_note && (
                              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg text-sm">
                                <p className="text-xs text-red-600 font-medium mb-1">Alasan Penolakan:</p>
                                <p className="text-red-700 dark:text-red-300">{v.volunteer_reject_note}</p>
                              </div>
                            )}

                            {/* Action buttons */}
                            {v.volunteer_status === "pending" && (
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-1"
                                  disabled={updatingVolunteerId === v.id} onClick={() => handleApproveVolunteer(v.id)}>
                                  {updatingVolunteerId === v.id ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <ShieldCheck className="h-3.5 w-3.5 mr-1" />}
                                  Setujui Verifikasi
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                                  onClick={() => setRejectDialog({ open: true, userId: v.id, userName: v.full_name ?? "Volunteer" })}>
                                  <ShieldX className="h-3.5 w-3.5 mr-1" /> Tolak
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
                          <p className="text-sm text-muted-foreground">{c.location || "Tanpa Lokasi"} • {c.owner?.email || "Tidak ada email"}</p>
                          <p className="text-sm text-muted-foreground mt-1">{c.description || "Tidak ada deskripsi"}</p>
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
                          <td className="py-3 px-3 text-sm text-muted-foreground">{c.location || "—"}</td>
                          <td className="py-3 px-3 text-sm text-muted-foreground">—</td>
                          <td className="py-3 px-3 text-sm text-muted-foreground">{c.member_count || 0}</td>
                          <td className="py-3 px-3">
                            {c.is_suspended
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

          {/* Activities moderation */}
          {activeTab === "activities" && (
            <Card>
              <CardHeader><CardTitle>Moderasi Kegiatan</CardTitle><CardDescription>Review dan setujui kegiatan yang diajukan komunitas</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingActivities.map((a) => (
                    <div key={a.id} className="p-4 border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.community?.name || "Komunitas"} • {formatDate(a.start_date || new Date())}</p>
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

          {/* Reports validation */}
          {activeTab === "reports" && (
            <Card>
              <CardHeader><CardTitle>Validasi Laporan</CardTitle><CardDescription>Periksa dan validasi laporan pasca kegiatan</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingReports.map((r) => (
                    <div key={r.id} className="p-4 border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{r.activity?.title || "Kegiatan"}</p>
                        <p className="text-sm text-muted-foreground">{r.community?.name || "Komunitas"} • Dibuat: {formatDate(r.created_at || new Date())}</p>
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

          {/* Users tab */}
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

      {/* Reject Volunteer Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => { if (!open) setRejectDialog({ open: false, userId: "", userName: "" }) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Verifikasi Volunteer</DialogTitle>
            <DialogDescription>Berikan alasan penolakan untuk {rejectDialog.userName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Alasan Penolakan *</Label>
              <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Foto KTP tidak jelas, NIK tidak valid, data tidak lengkap..." rows={4} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setRejectDialog({ open: false, userId: "", userName: "" })}>Batal</Button>
            <Button variant="destructive" className="flex-1" onClick={handleRejectVolunteer} disabled={!rejectReason.trim() || updatingVolunteerId === rejectDialog.userId}>
              {updatingVolunteerId === rejectDialog.userId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldX className="h-4 w-4 mr-2" />}
              Tolak Verifikasi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
