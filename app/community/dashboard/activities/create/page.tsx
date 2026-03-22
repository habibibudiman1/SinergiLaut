"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Calendar, MapPin, Users, Banknote, Image as ImageIcon, Package } from "lucide-react"
import Link from "next/link"
import { ACTIVITY_CATEGORIES, INDONESIA_PROVINCES } from "@/lib/constants"
import { toast } from "sonner"

export default function CreateActivityPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "cleanup",
    startDate: "",
    endDate: "",
    location: "",
    volunteerQuota: "",
    fundingGoal: "",
    allowItemDonation: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value })
  }

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    setIsLoading(true)
    // In production: call Supabase API route to INSERT into activities table
    await new Promise(r => setTimeout(r, 1500))
    if (isDraft) {
      toast.success("Kegiatan disimpan sebagai draft.")
    } else {
      toast.success("Kegiatan diajukan untuk review admin. Tunggu persetujuan dalam 1-2 hari kerja.")
    }
    router.push("/community/dashboard")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <Link href="/community/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Buat Kegiatan Baru</h1>
            <p className="text-muted-foreground mt-1">Kegiatan akan direview admin sebelum dipublikasikan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Informasi Dasar</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Kegiatan *</Label>
                  <Input id="title" name="title" value={form.title} onChange={handleChange} required placeholder="Contoh: Bersih-bersih Pantai Ancol" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <select id="category" name="category" value={form.category} onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm">
                    {ACTIVITY_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Kegiatan *</Label>
                  <Textarea id="description" name="description" value={form.description} onChange={handleChange} required
                    placeholder="Jelaskan tujuan, rencana kegiatan, dan apa yang akan dilakukan..." rows={6} />
                </div>
              </CardContent>
            </Card>

            {/* Schedule & Location */}
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Calendar className="h-5 w-5" /> Waktu & Lokasi</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Tanggal & Waktu Mulai *</Label>
                    <Input id="startDate" name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Tanggal & Waktu Selesai</Label>
                    <Input id="endDate" name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi Kegiatan *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="location" name="location" value={form.location} onChange={handleChange} required
                      placeholder="Nama tempat, Kota" className="pl-10" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volunteer & Funding */}
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5" /> Relawan & Dana</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volunteerQuota">Kuota Relawan</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="volunteerQuota" name="volunteerQuota" type="number" min="0" value={form.volunteerQuota}
                        onChange={handleChange} placeholder="0 = tidak terbatas" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundingGoal">Target Dana (IDR)</Label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="fundingGoal" name="fundingGoal" type="number" min="0" value={form.fundingGoal}
                        onChange={handleChange} placeholder="0 = tidak ada target" className="pl-10" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                  <input type="checkbox" id="allowItemDonation" name="allowItemDonation"
                    checked={form.allowItemDonation} onChange={handleChange} />
                  <div>
                    <Label htmlFor="allowItemDonation" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4" /> Terima Donasi Barang
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Izinkan donatur menyumbangkan barang fisik untuk kegiatan ini</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Foto Kegiatan</CardTitle></CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary transition-colors cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Klik atau drag & drop untuk upload foto utama</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP • Maks. 5MB</p>
                  <Button type="button" variant="outline" size="sm" className="mt-3">Pilih File</Button>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={(e) => handleSubmit(e, true)} disabled={isLoading}>
                Simpan sebagai Draft
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : "Ajukan untuk Review"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
