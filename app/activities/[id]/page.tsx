"use client"

/**
 * Halaman Detail Kegiatan
 * - Data diambil dari Supabase berdasarkan params.id
 * - Form Relawan terhubung ke volunteer_registrations
 * - Form Donasi Uang terhubung ke Midtrans Snap
 * - Form Donasi Barang terhubung ke donations + donation_items
 */

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Calendar, MapPin, Users, Heart, Package, ArrowLeft,
  CheckCircle2, Banknote, Star, Shield, FileText, Loader2,
  Plus, Trash2, AlertCircle, Phone
} from "lucide-react"
import { formatCurrency, calcPercentage, formatDate } from "@/lib/utils/helpers"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { registerVolunteer } from "@/lib/actions/volunteer.actions"
import { createMoneyDonation, createItemDonation } from "@/lib/actions/donation.actions"
import type { Activity, VolunteerRegistration, Donation } from "@/lib/types"

type TabType = "detail" | "volunteer" | "donate" | "reports" | "feedback"

interface DonationItem {
  itemName: string
  quantity: string
  itemCondition: "new" | "good" | "fair"
  description: string
  trackingNumber: string
  courier: string
}

const COURIERS = ["JNE", "J&T Express", "SiCepat", "AnterAja", "Pos Indonesia", "Ninja Xpress", "GoSend", "Grab Express"]
const SKILLS_OPTIONS = ["Fotografi / Videografi", "Medis / P3K", "Logistik", "Navigasi Laut", "Menyelam (PADI)", "Bahasa Asing", "Memasak", "Pendidikan / Mengajar"]
const T_SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"]

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile, isLoading: authLoading } = useAuth()
  const supabase = createClient()

  const [activity, setActivity] = useState<Activity & {
    community: { id: string; name: string; logo_url: string | null; is_verified: boolean }
    reports: { id: string; title: string; status: string; created_at: string }[]
    feedbacks: { id: string; rating: number; comment: string | null; created_at: string; user: { full_name: string | null } }[]
    items_needed: { item_name: string; target: number; donated: number }[]
  } | null>(null)
  const [isLoadingActivity, setIsLoadingActivity] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("detail")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState<VolunteerRegistration | null>(null)
  const [myDonations, setMyDonations] = useState<Donation[]>([])

  // Volunteer form state
  const [volunteerForm, setVolunteerForm] = useState({
    fullName: "", email: "", phone: "", reason: "",
    emergencyContactName: "", emergencyContactPhone: "",
    skills: [] as string[], tShirtSize: "M", agreed: false,
  })

  // Donation form state
  const [donateForm, setDonateForm] = useState({
    type: "money" as "money" | "item",
    amount: "", paymentMethod: "",
    donorName: "", donorEmail: "", note: "", isAnonymous: false,
  })
  const [donationItems, setDonationItems] = useState<DonationItem[]>([{
    itemName: "", quantity: "1", itemCondition: "new", description: "", trackingNumber: "", courier: "JNE",
  }])

  // ── Fetch Activity ────────────────────────────────────────
  useEffect(() => {
    if (!params.id) return

    async function fetchActivity() {
      setIsLoadingActivity(true)
      const { data, error } = await supabase
        .from("activities")
        .select(`
          *,
          community:communities(id, name, logo_url, is_verified),
          reports(id, title, status, created_at),
          feedbacks(id, rating, comment, created_at, user:profiles(full_name))
        `)
        .eq("id", params.id as string)
        .single()

      if (error || !data) {
        toast.error("Kegiatan tidak ditemukan.")
        router.push("/activities")
        return
      }

      setActivity(data as typeof activity)
      setIsLoadingActivity(false)
    }

    fetchActivity()
  }, [params.id, router, supabase])

  // ── Pre-fill form jika sudah login ───────────────────────
  useEffect(() => {
    if (profile) {
      setVolunteerForm(prev => ({
        ...prev,
        fullName: profile.full_name ?? "",
        email: profile.email,
        phone: profile.phone ?? "",
      }))
      setDonateForm(prev => ({
        ...prev,
        donorName: profile.full_name ?? "",
        donorEmail: profile.email,
      }))
    }
  }, [profile])

  // ── Cek apakah sudah terdaftar sebagai relawan ────────────
  useEffect(() => {
    if (!user || !params.id) return

    async function checkRegistration() {
      const { data } = await supabase
        .from("volunteer_registrations")
        .select("*")
        .eq("activity_id", params.id as string)
        .eq("user_id", user!.id)
        .single()

      if (data) setAlreadyRegistered(data as VolunteerRegistration)
    }

    checkRegistration()
  }, [user, params.id, supabase])

  if (isLoadingActivity) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">Memuat data kegiatan...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!activity) return null

  const fundingPercent = calcPercentage(activity.funding_raised, activity.funding_goal)
  const volunteerPercent = calcPercentage(activity.volunteer_count, activity.volunteer_quota)

  // ── Handle toggle skill ───────────────────────────────────
  function toggleSkill(skill: string) {
    setVolunteerForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  // ── Handle volunteer submit ───────────────────────────────
  async function handleVolunteerSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!volunteerForm.agreed) { toast.error("Harap setujui syarat & ketentuan."); return }
    if (!user) { toast.error("Anda harus login terlebih dahulu."); router.push("/login"); return }
    if (alreadyRegistered) { toast.info(`Anda sudah terdaftar. Status: ${alreadyRegistered.status}`); return }

    setIsSubmitting(true)
    const result = await registerVolunteer({
      activityId: activity.id,
      userId: user.id,
      fullName: volunteerForm.fullName,
      email: volunteerForm.email,
      phone: volunteerForm.phone,
      reason: volunteerForm.reason,
      emergencyContactName: volunteerForm.emergencyContactName,
      emergencyContactPhone: volunteerForm.emergencyContactPhone,
      skills: volunteerForm.skills,
      tShirtSize: volunteerForm.tShirtSize,
      agreedToTerms: volunteerForm.agreed,
    })

    if (result.success) {
      toast.success("Pendaftaran berhasil! ✅ Tunggu konfirmasi dari pengelola kegiatan.")
      setAlreadyRegistered(result.data as VolunteerRegistration)
      setActiveTab("detail")
    } else {
      toast.error(result.error ?? "Gagal mendaftar. Silakan coba lagi.")
    }
    setIsSubmitting(false)
  }

  // ── Handle donate submit ──────────────────────────────────
  async function handleDonateSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    if (donateForm.type === "money") {
      const amount = parseInt(donateForm.amount)
      if (!amount || amount < 1000) {
        toast.error("Minimal donasi adalah Rp 1.000.")
        setIsSubmitting(false)
        return
      }

      const result = await createMoneyDonation({
        activityId: activity.id,
        userId: user?.id ?? null,
        donorName: donateForm.donorName,
        donorEmail: donateForm.donorEmail,
        amount,
        note: donateForm.note,
        isAnonymous: donateForm.isAnonymous,
      })

      if (result.success && result.snapToken) {
        // Buka Midtrans Snap payment UI
        const snapClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
        if (!snapClientKey) {
          toast.error("Konfigurasi payment tidak tersedia.")
          setIsSubmitting(false)
          return
        }

        // Load Midtrans Snap.js dynamically
        const script = document.createElement("script")
        script.src = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
          ? "https://app.midtrans.com/snap/snap.js"
          : "https://app.sandbox.midtrans.com/snap/snap.js"
        script.setAttribute("data-client-key", snapClientKey)
        script.onload = () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(window as any).snap?.pay(result.snapToken, {
            onSuccess: () => {
              toast.success("Pembayaran berhasil! 🎉 Terima kasih atas donasi Anda.")
              setActiveTab("detail")
              router.refresh()
            },
            onPending: () => {
              toast.info("Pembayaran sedang diproses. Silakan selesaikan pembayaran.")
              setActiveTab("detail")
            },
            onError: () => {
              toast.error("Pembayaran gagal. Silakan coba lagi.")
            },
            onClose: () => {
              toast("Pembayaran dibatalkan.")
            },
          })
        }
        document.head.appendChild(script)
      } else {
        toast.error(result.error ?? "Gagal membuat transaksi. Silakan coba lagi.")
      }
    } else {
      // Donasi barang
      const validItems = donationItems.filter(i => i.itemName.trim() && parseInt(i.quantity) > 0)
      if (validItems.length === 0) {
        toast.error("Masukkan minimal 1 barang donasi.")
        setIsSubmitting(false)
        return
      }

      const result = await createItemDonation({
        activityId: activity.id,
        userId: user?.id ?? null,
        donorName: donateForm.donorName,
        donorEmail: donateForm.donorEmail,
        note: donateForm.note,
        isAnonymous: donateForm.isAnonymous,
        items: validItems.map(i => ({
          itemName: i.itemName,
          quantity: parseInt(i.quantity),
          itemCondition: i.itemCondition,
          description: i.description,
          trackingNumber: i.trackingNumber,
          courier: i.courier,
        })),
      })

      if (result.success) {
        toast.success(`Donasi ${result.itemCount} barang berhasil dicatat! ✅ Komunitas akan segera menghubungi Anda.`)
        setActiveTab("detail")
        setDonationItems([{ itemName: "", quantity: "1", itemCondition: "new", description: "", trackingNumber: "", courier: "JNE" }])
      } else {
        toast.error(result.error ?? "Gagal menyimpan donasi barang.")
      }
    }

    setIsSubmitting(false)
  }

  // ── Donation Item helpers ─────────────────────────────────
  function addDonationItem() {
    setDonationItems(prev => [...prev, { itemName: "", quantity: "1", itemCondition: "new", description: "", trackingNumber: "", courier: "JNE" }])
  }
  function removeDonationItem(index: number) {
    setDonationItems(prev => prev.filter((_, i) => i !== index))
  }
  function updateDonationItem(index: number, field: keyof DonationItem, value: string) {
    setDonationItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/activities" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Kegiatan
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Main Content ─────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cover */}
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-secondary">
                {activity.cover_image_url ? (
                  <Image src={activity.cover_image_url} alt={activity.title} fill className="object-cover" priority />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <FileText className="h-16 w-16 opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-accent text-accent-foreground capitalize">{activity.category}</Badge>
                  <Badge className={activity.status === "published" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"}>
                    {activity.status === "published" ? "Aktif" : activity.status}
                  </Badge>
                </div>
              </div>

              {/* Community + Title */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {activity.community?.logo_url && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src={activity.community.logo_url} alt={activity.community.name} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Diselenggarakan oleh</p>
                    <div className="flex items-center gap-1">
                      <Link href={`/community/${activity.community?.id}`} className="text-sm font-medium hover:text-primary">
                        {activity.community?.name}
                      </Link>
                      {activity.community?.is_verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground">{activity.title}</h1>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: "detail", label: "Detail" },
                  { id: "volunteer", label: "Daftar Relawan" },
                  { id: "donate", label: "Donasi" },
                  { id: "reports", label: "Laporan" },
                  { id: "feedback", label: "Ulasan" },
                ].map((tab) => (
                  <Button key={tab.id} variant={activeTab === tab.id ? "default" : "outline"} size="sm"
                    onClick={() => setActiveTab(tab.id as TabType)}>
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* ── Tab: Detail ──────────────────────────────── */}
              {activeTab === "detail" && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Tanggal Mulai</p>
                            <p className="font-medium text-sm">{formatDate(activity.start_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Lokasi</p>
                            <p className="font-medium text-sm">{activity.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Relawan</p>
                            <p className="font-medium text-sm">{activity.volunteer_count} / {activity.volunteer_quota} slot</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <p className="font-medium text-sm text-green-600">
                              {activity.volunteer_count < activity.volunteer_quota ? "Pendaftaran Terbuka" : "Slot Penuh"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-3">Deskripsi Kegiatan</h3>
                      <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{activity.description}</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ── Tab: Volunteer Form ──────────────────────── */}
              {activeTab === "volunteer" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Daftar Sebagai Relawan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!user && !authLoading ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-4">Anda harus login untuk mendaftar sebagai relawan.</p>
                        <Button asChild><Link href="/login">Login Sekarang</Link></Button>
                      </div>
                    ) : alreadyRegistered ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                        <p className="font-semibold text-foreground mb-1">Anda Sudah Terdaftar!</p>
                        <p className="text-muted-foreground text-sm mb-3">
                          Status pendaftaran Anda: <Badge className={
                            alreadyRegistered.status === "approved" ? "bg-green-100 text-green-700" :
                            alreadyRegistered.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }>{alreadyRegistered.status}</Badge>
                        </p>
                        {alreadyRegistered.status === "pending" && (
                          <p className="text-xs text-muted-foreground">Pengelola sedang mereview pendaftaran Anda.</p>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleVolunteerSubmit} className="space-y-5">
                        {/* Data Diri */}
                        <div>
                          <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide">Data Diri</h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nama Lengkap *</Label>
                              <Input value={volunteerForm.fullName} onChange={e => setVolunteerForm({ ...volunteerForm, fullName: e.target.value })} required placeholder="Nama lengkap sesuai KTP" />
                            </div>
                            <div className="space-y-2">
                              <Label>Email *</Label>
                              <Input type="email" value={volunteerForm.email} onChange={e => setVolunteerForm({ ...volunteerForm, email: e.target.value })} required placeholder="email@example.com" />
                            </div>
                            <div className="space-y-2">
                              <Label>Nomor Telepon *</Label>
                              <Input type="tel" value={volunteerForm.phone} onChange={e => setVolunteerForm({ ...volunteerForm, phone: e.target.value })} required placeholder="+62 8xx xxxx xxxx" />
                            </div>
                            <div className="space-y-2">
                              <Label>Ukuran Kaos</Label>
                              <div className="flex gap-2">
                                {T_SHIRT_SIZES.map(size => (
                                  <button key={size} type="button" onClick={() => setVolunteerForm({ ...volunteerForm, tShirtSize: size })}
                                    className={`px-3 py-1.5 rounded-lg border-2 text-sm transition-all ${volunteerForm.tShirtSize === size ? "border-primary bg-primary/5 font-semibold" : "border-border hover:border-primary/40"}`}>
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Kontak Darurat */}
                        <div>
                          <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide flex items-center gap-1">
                            <Phone className="h-4 w-4" /> Kontak Darurat
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nama Kontak Darurat</Label>
                              <Input value={volunteerForm.emergencyContactName} onChange={e => setVolunteerForm({ ...volunteerForm, emergencyContactName: e.target.value })} placeholder="Nama orang tua / pasangan" />
                            </div>
                            <div className="space-y-2">
                              <Label>Telepon Kontak Darurat</Label>
                              <Input type="tel" value={volunteerForm.emergencyContactPhone} onChange={e => setVolunteerForm({ ...volunteerForm, emergencyContactPhone: e.target.value })} placeholder="+62 8xx xxxx xxxx" />
                            </div>
                          </div>
                        </div>

                        {/* Keahlian */}
                        <div>
                          <h4 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide">Keahlian yang Dimiliki</h4>
                          <div className="flex flex-wrap gap-2">
                            {SKILLS_OPTIONS.map(skill => (
                              <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                                className={`px-3 py-1.5 rounded-full border text-xs transition-all ${volunteerForm.skills.includes(skill) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"}`}>
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Alasan */}
                        <div className="space-y-2">
                          <Label>Alasan Ingin Bergabung (opsional)</Label>
                          <Textarea value={volunteerForm.reason} onChange={e => setVolunteerForm({ ...volunteerForm, reason: e.target.value })} placeholder="Ceritakan motivasi Anda ikut serta dalam kegiatan ini..." rows={3} />
                        </div>

                        {/* Persetujuan */}
                        <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                          <input id="agreed" type="checkbox" checked={volunteerForm.agreed} onChange={e => setVolunteerForm({ ...volunteerForm, agreed: e.target.checked })} className="mt-1 w-4 h-4 accent-primary" />
                          <Label htmlFor="agreed" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                            Saya menyetujui <Link href="/faq" className="text-primary hover:underline">syarat & ketentuan</Link> SinergiLaut, bersedia mengikuti arahan panitia kegiatan, dan menjamin kebenaran data yang diisi.
                          </Label>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !volunteerForm.agreed}>
                          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mendaftar...</> : "Daftar Sebagai Relawan"}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* ── Tab: Donate Form ─────────────────────────── */}
              {activeTab === "donate" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" /> Donasi untuk Kegiatan Ini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Type Selector */}
                    <div className="flex gap-2 mb-6">
                      <Button variant={donateForm.type === "money" ? "default" : "outline"} size="sm" onClick={() => setDonateForm({ ...donateForm, type: "money" })}>
                        <Banknote className="h-4 w-4 mr-2" /> Donasi Uang
                      </Button>
                      {activity.allow_item_donation && (
                        <Button variant={donateForm.type === "item" ? "default" : "outline"} size="sm" onClick={() => setDonateForm({ ...donateForm, type: "item" })}>
                          <Package className="h-4 w-4 mr-2" /> Donasi Barang
                        </Button>
                      )}
                    </div>

                    <form onSubmit={handleDonateSubmit} className="space-y-5">
                      {/* Identitas Donatur */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama Donatur {donateForm.isAnonymous ? "(anonim)" : "*"}</Label>
                          <Input value={donateForm.donorName} onChange={e => setDonateForm({ ...donateForm, donorName: e.target.value })}
                            required={!donateForm.isAnonymous} disabled={donateForm.isAnonymous} placeholder="Nama Anda" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email *</Label>
                          <Input type="email" value={donateForm.donorEmail} onChange={e => setDonateForm({ ...donateForm, donorEmail: e.target.value })} required placeholder="email@example.com" />
                        </div>
                      </div>

                      {/* ─── Form Donasi Uang ─── */}
                      {donateForm.type === "money" && (
                        <>
                          <div className="space-y-2">
                            <Label>Nominal Donasi (IDR) *</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                              {[25000, 50000, 100000, 250000, 500000].map(amt => (
                                <button key={amt} type="button"
                                  onClick={() => setDonateForm({ ...donateForm, amount: amt.toString() })}
                                  className={`p-2.5 rounded-lg border-2 text-center text-xs transition-all ${donateForm.amount === amt.toString() ? "border-primary bg-primary/5 font-semibold" : "border-border hover:border-primary/50"}`}>
                                  {formatCurrency(amt)}
                                </button>
                              ))}
                            </div>
                            <Input type="number" min={1000} value={donateForm.amount}
                              onChange={e => setDonateForm({ ...donateForm, amount: e.target.value })}
                              placeholder="Atau masukkan nominal lain (min. Rp 1.000)" />
                          </div>

                          {/* Info pembayaran via Midtrans */}
                          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">💳 Pembayaran via Midtrans</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Setelah klik "Bayar", Anda akan diarahkan ke halaman pembayaran Midtrans. Tersedia pilihan: Transfer Bank (BCA, Mandiri, BNI, BRI), QRIS, GoPay, OVO, ShopeePay, dan kartu kredit.
                            </p>
                          </div>
                        </>
                      )}

                      {/* ─── Form Donasi Barang ─── */}
                      {donateForm.type === "item" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Daftar Barang Donasi *</Label>
                            <Button type="button" size="sm" variant="outline" onClick={addDonationItem}>
                              <Plus className="h-3 w-3 mr-1" /> Tambah Barang
                            </Button>
                          </div>

                          {donationItems.map((item, index) => (
                            <div key={index} className="p-4 border border-border rounded-xl space-y-3 bg-secondary/30">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Barang #{index + 1}</span>
                                {donationItems.length > 1 && (
                                  <button type="button" onClick={() => removeDonationItem(index)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>

                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label className="text-xs">Nama Barang *</Label>
                                  <Input value={item.itemName} onChange={e => updateDonationItem(index, "itemName", e.target.value)}
                                    required placeholder="Contoh: Kantong Sampah" />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Jumlah *</Label>
                                  <Input type="number" min="1" value={item.quantity} onChange={e => updateDonationItem(index, "quantity", e.target.value)} required />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs">Kondisi Barang</Label>
                                <div className="flex gap-2">
                                  {[
                                    { value: "new", label: "Baru" },
                                    { value: "good", label: "Masih Bagus" },
                                    { value: "fair", label: "Cukup Baik" },
                                  ].map(cond => (
                                    <button key={cond.value} type="button"
                                      onClick={() => updateDonationItem(index, "itemCondition", cond.value)}
                                      className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${item.itemCondition === cond.value ? "border-primary bg-primary/5 font-semibold" : "border-border hover:border-primary/40"}`}>
                                      {cond.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs">Deskripsi (merek, spesifikasi, dsb.)</Label>
                                <Input value={item.description} onChange={e => updateDonationItem(index, "description", e.target.value)} placeholder="Contoh: Merek Bintang, ukuran 60L" />
                              </div>

                              <div className="grid sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label className="text-xs">Nomor Resi Pengiriman</Label>
                                  <Input value={item.trackingNumber} onChange={e => updateDonationItem(index, "trackingNumber", e.target.value)} placeholder="Isi setelah barang dikirim" />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Jasa Pengiriman</Label>
                                  <select value={item.courier} onChange={e => updateDonationItem(index, "courier", e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                    {COURIERS.map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                              📦 Setelah submit, komunitas akan memberikan alamat pengiriman melalui email yang Anda daftarkan. Silakan isi nomor resi pengiriman setelah barang dikirim.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Catatan */}
                      <div className="space-y-2">
                        <Label>Pesan / Catatan (opsional)</Label>
                        <Textarea value={donateForm.note} onChange={e => setDonateForm({ ...donateForm, note: e.target.value })} rows={2} placeholder="Pesan untuk pengelola kegiatan..." />
                      </div>

                      {/* Anonim toggle */}
                      <div className="flex items-center gap-2">
                        <input id="anon" type="checkbox" checked={donateForm.isAnonymous} onChange={e => setDonateForm({ ...donateForm, isAnonymous: e.target.checked })} className="w-4 h-4 accent-primary" />
                        <Label htmlFor="anon" className="text-sm text-muted-foreground cursor-pointer">Sembunyikan nama saya (donasi anonim)</Label>
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting
                          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memproses...</>
                          : donateForm.type === "money"
                            ? <><Banknote className="mr-2 h-4 w-4" />Bayar {donateForm.amount ? formatCurrency(parseInt(donateForm.amount) || 0) : "Sekarang"}</>
                            : <><Package className="mr-2 h-4 w-4" />Konfirmasi Donasi Barang</>
                        }
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* ── Tab: Reports ─────────────────────────────── */}
              {activeTab === "reports" && (
                <div className="space-y-4">
                  {activity.reports?.length === 0 ? (
                    <Card><CardContent className="p-12 text-center text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />Belum ada laporan untuk kegiatan ini.
                    </CardContent></Card>
                  ) : activity.reports?.map(r => (
                    <Card key={r.id}>
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{r.title}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(r.created_at)}</p>
                        </div>
                        <Badge className={r.status === "validated" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {r.status === "validated" ? "Tervalidasi" : r.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* ── Tab: Feedback ────────────────────────────── */}
              {activeTab === "feedback" && (
                <div className="space-y-4">
                  {activity.feedbacks?.length === 0 ? (
                    <Card><CardContent className="p-12 text-center text-muted-foreground">
                      <Star className="h-8 w-8 mx-auto mb-3 opacity-40" />Belum ada ulasan untuk kegiatan ini.
                    </CardContent></Card>
                  ) : activity.feedbacks?.map(f => (
                    <Card key={f.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                            {(f.user?.full_name ?? "U")[0]}
                          </div>
                          <span className="font-medium text-sm">{f.user?.full_name ?? "Pengguna"}</span>
                          <div className="flex ml-auto">
                            {Array(f.rating).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{f.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">{formatDate(f.created_at)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* ── Sidebar ──────────────────────────────────── */}
            <div className="space-y-6">
              <Card className="sticky top-20">
                <CardHeader><CardTitle className="text-lg">Progres Kegiatan</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground flex items-center gap-1"><Banknote className="h-4 w-4" /> Dana Terkumpul</span>
                      <span className="font-semibold text-foreground">{fundingPercent}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${fundingPercent}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(activity.funding_raised)} dari {formatCurrency(activity.funding_goal)}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground flex items-center gap-1"><Users className="h-4 w-4" /> Relawan</span>
                      <span className="font-semibold text-foreground">{volunteerPercent}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${volunteerPercent}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.volunteer_count} dari {activity.volunteer_quota} slot terisi
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button className="w-full" onClick={() => setActiveTab("volunteer")} disabled={alreadyRegistered != null}>
                      <Users className="mr-2 h-4 w-4" />
                      {alreadyRegistered ? `Terdaftar (${alreadyRegistered.status})` : "Daftar Relawan"}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("donate")}>
                      <Heart className="mr-2 h-4 w-4" /> Donasi Sekarang
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
