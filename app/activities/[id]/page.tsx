"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
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
  CheckCircle2, Banknote, Star, Shield, FileText, Loader2, Check
} from "lucide-react"
import { formatCurrency, calcPercentage } from "@/lib/utils/helpers"
import { toast } from "sonner"

// Mock data — in prod this would fetch from Supabase
const mockActivity = {
  id: "1",
  title: "Bersih-bersih Pantai Jakarta Bay",
  description: "Bergabunglah dalam kegiatan bersih-bersih pantai mingguan di kawasan Teluk Jakarta untuk melindungi ekosistem laut dari polusi plastik. Setiap minggu, ratusan relawan turun ke pantai untuk memungut sampah, memilah, dan mendokumentasikan jenis sampah yang ditemukan untuk riset lingkungan.\n\nKegiatan ini terbuka untuk semua usia dan tidak memerlukan keahlian khusus. Perlengkapan disediakan. Parkir gratis tersedia di lokasi.",
  category: "cleanup",
  status: "published",
  start_date: "2026-03-22T07:00:00+07:00",
  end_date: "2026-03-22T12:00:00+07:00",
  location: "Pantai Ancol, Jakarta Utara",
  volunteer_quota: 60,
  volunteer_count: 45,
  funding_goal: 5000000,
  funding_raised: 3500000,
  allow_item_donation: true,
  cover_image_url: "/images/beach-cleanup.jpg",
  community: {
    id: "1",
    name: "Ocean Guardians Bali",
    logo_url: "/images/partner-1.jpg",
    is_verified: true,
  },
  items_needed: [
    { name: "Kantong Sampah (pak 100)", target: 20, donated: 15 },
    { name: "Sarung Tangan (pasang)", target: 100, donated: 67 },
    { name: "Alat Pencapit Sampah", target: 30, donated: 22 },
    { name: "Topi / Pelindung Kepala", target: 50, donated: 30 },
  ],
  reports: [
    { id: "r1", title: "Laporan Kegiatan Feb 2026", status: "validated", created_at: "2026-02-28" },
  ],
  feedbacks: [
    { id: "f1", user: "Andi R.", rating: 5, comment: "Kegiatan yang sangat berkesan. Panitia sangat ramah!", created_at: "2026-02-28" },
    { id: "f2", user: "Siti M.", rating: 4, comment: "Pengalaman baru yang menyenangkan. Akan ikut lagi!", created_at: "2026-02-25" },
  ],
}

type TabType = "detail" | "volunteer" | "donate" | "reports" | "feedback"

export default function ActivityDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<TabType>("detail")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [volunteerForm, setVolunteerForm] = useState({
    fullName: "", email: "", phone: "", reason: "", agreed: false
  })
  const [donateForm, setDonateForm] = useState({
    type: "money" as "money" | "item",
    amount: "",
    paymentMethod: "",
    donorName: "", donorEmail: "", note: "",
    itemName: "", quantity: "1", description: "", trackingNumber: "",
    isAnonymous: false,
  })

  const activity = mockActivity
  const fundingPercent = calcPercentage(activity.funding_raised, activity.funding_goal)
  const volunteerPercent = calcPercentage(activity.volunteer_count, activity.volunteer_quota)

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!volunteerForm.agreed) { toast.error("Harap setujui syarat & ketentuan."); return }
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success("Pendaftaran berhasil! Tunggu konfirmasi dari pengelola.")
    setActiveTab("detail")
    setIsSubmitting(false)
  }

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success("Donasi berhasil dicatat! Terima kasih atas kontribusi Anda.")
    setActiveTab("detail")
    setIsSubmitting(false)
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
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cover Image */}
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
                <Image src={activity.cover_image_url} alt={activity.title} fill className="object-cover" priority />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-accent text-accent-foreground capitalize">{activity.category}</Badge>
                  <Badge className={activity.status === "published" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"}>
                    {activity.status === "published" ? "Aktif" : activity.status}
                  </Badge>
                </div>
              </div>

              {/* Title + Community */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src={activity.community.logo_url} alt={activity.community.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diselenggarakan oleh</p>
                    <div className="flex items-center gap-1">
                      <Link href={`/community/${activity.community.id}`} className="text-sm font-medium text-foreground hover:text-primary">
                        {activity.community.name}
                      </Link>
                      {activity.community.is_verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
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
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id as TabType)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "detail" && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Tanggal</p>
                            <p className="font-medium text-sm">22 Maret 2026, 07.00 – 12.00 WIB</p>
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
                            <p className="font-medium text-sm text-green-600">Pendaftaran Terbuka</p>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-3">Deskripsi Kegiatan</h3>
                      <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                        {activity.description}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Items Needed */}
                  {activity.allow_item_donation && (
                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Barang yang Dibutuhkan</CardTitle></CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {activity.items_needed.map((item, i) => (
                            <div key={i}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-foreground">{item.name}</span>
                                <span className="text-muted-foreground">{item.donated}/{item.target}</span>
                              </div>
                              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-accent rounded-full" style={{ width: `${calcPercentage(item.donated, item.target)}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-4" variant="outline" onClick={() => setActiveTab("donate")}>Donasikan Barang</Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Volunteer Form */}
              {activeTab === "volunteer" && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Daftar Sebagai Relawan</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama Lengkap</Label>
                          <Input value={volunteerForm.fullName} onChange={(e) => setVolunteerForm({ ...volunteerForm, fullName: e.target.value })} required placeholder="Nama lengkap" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={volunteerForm.email} onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })} required placeholder="email@example.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Nomor Telepon</Label>
                        <Input type="tel" value={volunteerForm.phone} onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })} required placeholder="+62 8xx xxxx xxxx" />
                      </div>
                      <div className="space-y-2">
                        <Label>Alasan Ikut Serta (opsional)</Label>
                        <Textarea value={volunteerForm.reason} onChange={(e) => setVolunteerForm({ ...volunteerForm, reason: e.target.value })} placeholder="Ceritakan motivasi Anda..." rows={3} />
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="agreed" checked={volunteerForm.agreed} onChange={(e) => setVolunteerForm({ ...volunteerForm, agreed: e.target.checked })} className="mt-1" />
                        <Label htmlFor="agreed" className="text-sm text-muted-foreground leading-relaxed">
                          Saya menyetujui <Link href="/faq" className="text-primary hover:underline">syarat & ketentuan</Link> dan bersedia mengikuti pengaturan kegiatan.
                        </Label>
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mendaftar...</> : "Daftar Sebagai Relawan"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Donate Form */}
              {activeTab === "donate" && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" /> Donasi untuk Kegiatan Ini</CardTitle></CardHeader>
                  <CardContent>
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
                    <form onSubmit={handleDonateSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama Donatur</Label>
                          <Input value={donateForm.donorName} onChange={(e) => setDonateForm({ ...donateForm, donorName: e.target.value })} required={!donateForm.isAnonymous} placeholder="Nama Anda" disabled={donateForm.isAnonymous} />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={donateForm.donorEmail} onChange={(e) => setDonateForm({ ...donateForm, donorEmail: e.target.value })} required placeholder="email@example.com" />
                        </div>
                      </div>

                      {donateForm.type === "money" ? (
                        <>
                          <div className="space-y-2">
                            <Label>Nominal Donasi (IDR)</Label>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              {[50000, 100000, 250000, 500000, 1000000].map((amt) => (
                                <button
                                  type="button"
                                  key={amt}
                                  onClick={() => setDonateForm({ ...donateForm, amount: amt.toString() })}
                                  className={`p-3 rounded-lg border-2 text-center text-sm transition-all ${donateForm.amount === amt.toString() ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                                >
                                  {formatCurrency(amt)}
                                </button>
                              ))}
                            </div>
                            <Input
                              type="number"
                              value={donateForm.amount}
                              onChange={(e) => setDonateForm({ ...donateForm, amount: e.target.value })}
                              placeholder="Atau masukkan jumlah lain"
                              min={1000}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Metode Pembayaran</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {[{ v: "bank_transfer", l: "Transfer Bank" }, { v: "qris", l: "QRIS" }, { v: "gopay", l: "GoPay" }].map((m) => (
                                <button type="button" key={m.v} onClick={() => setDonateForm({ ...donateForm, paymentMethod: m.v })}
                                  className={`p-3 rounded-lg border-2 text-center text-xs transition-all ${donateForm.paymentMethod === m.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                                  {m.l}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label>Nama Barang</Label>
                            <Input value={donateForm.itemName} onChange={(e) => setDonateForm({ ...donateForm, itemName: e.target.value })} required placeholder="Contoh: Kantong Sampah" />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Jumlah</Label>
                              <Input type="number" min="1" value={donateForm.quantity} onChange={(e) => setDonateForm({ ...donateForm, quantity: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                              <Label>No. Resi Pengiriman</Label>
                              <Input value={donateForm.trackingNumber} onChange={(e) => setDonateForm({ ...donateForm, trackingNumber: e.target.value })} placeholder="JNE123456789" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Deskripsi Barang</Label>
                            <Textarea value={donateForm.description} onChange={(e) => setDonateForm({ ...donateForm, description: e.target.value })} rows={2} placeholder="Kondisi, merk, dsb." />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label>Pesan / Catatan (opsional)</Label>
                        <Textarea value={donateForm.note} onChange={(e) => setDonateForm({ ...donateForm, note: e.target.value })} rows={2} placeholder="Pesan untuk pengelola..." />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="anon" checked={donateForm.isAnonymous} onChange={(e) => setDonateForm({ ...donateForm, isAnonymous: e.target.checked })} />
                        <Label htmlFor="anon" className="text-sm text-muted-foreground">Donasi secara anonim</Label>
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</> : `Konfirmasi Donasi ${donateForm.type === "money" ? "Uang" : "Barang"}`}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Reports */}
              {activeTab === "reports" && (
                <div className="space-y-4">
                  {activity.reports.length === 0 ? (
                    <Card><CardContent className="p-12 text-center text-muted-foreground"><FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />Belum ada laporan untuk kegiatan ini.</CardContent></Card>
                  ) : activity.reports.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{r.title}</p>
                          <p className="text-sm text-muted-foreground">{r.created_at}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Tervalidasi</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Feedback */}
              {activeTab === "feedback" && (
                <div className="space-y-4">
                  {activity.feedbacks.map((f) => (
                    <Card key={f.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">{f.user[0]}</div>
                          <span className="font-medium text-sm">{f.user}</span>
                          <div className="flex ml-auto">{Array(f.rating).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                        </div>
                        <p className="text-sm text-muted-foreground">{f.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">{f.created_at}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Progress */}
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
                    <p className="text-xs text-muted-foreground mt-1">{formatCurrency(activity.funding_raised)} dari {formatCurrency(activity.funding_goal)}</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground flex items-center gap-1"><Users className="h-4 w-4" /> Relawan</span>
                      <span className="font-semibold text-foreground">{volunteerPercent}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${volunteerPercent}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.volunteer_count} dari {activity.volunteer_quota} slot terisi</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button className="w-full" onClick={() => setActiveTab("volunteer")}>
                      <Users className="mr-2 h-4 w-4" /> Daftar Relawan
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
