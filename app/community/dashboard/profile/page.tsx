"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  Save, Loader2, Upload, Building2, MapPin, Globe,
  Instagram, Facebook, Twitter, CheckCircle2, Image as ImageIcon, X,
} from "lucide-react"
import Image from "next/image"

const FOCUS_AREAS = [
  "Beach Cleanup", "Coral Restoration", "Mangrove Planting",
  "Marine Education", "Wildlife Conservation", "Sustainable Fishing",
  "Research & Monitoring", "Community Outreach",
]

export default function CommunityProfilePage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [community, setCommunity] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    focus_areas: [] as string[],
  })

  // Fetch community data
  useEffect(() => {
    if (!profile?.id) return
    async function loadCommunity() {
      setIsLoading(true)
      const { data } = await supabase
        .from("communities")
        .select("*")
        .eq("owner_id", profile!.id)
        .single()

      if (data) {
        setCommunity(data)
        setForm({
          name:        data.name        ?? "",
          description: data.description ?? "",
          location:    data.location    ?? "",
          website:     data.website     ?? "",
          instagram:   data.instagram   ?? "",
          facebook:    data.facebook    ?? "",
          twitter:     data.twitter     ?? "",
          focus_areas: data.focus_areas ?? [],
        })
      }
      setIsLoading(false)
    }
    loadCommunity()
  }, [profile?.id])

  const handleSave = async () => {
    if (!community?.id) return
    if (form.name.trim().length < 3) {
      toast.error("Nama komunitas minimal 3 karakter.")
      return
    }
    setIsSaving(true)
    const { error } = await supabase
      .from("communities")
      .update({
        name:        form.name,
        description: form.description,
        location:    form.location,
        website:     form.website,
        instagram:   form.instagram,
        facebook:    form.facebook,
        twitter:     form.twitter,
        focus_areas: form.focus_areas,
      })
      .eq("id", community.id)

    if (error) toast.error("Gagal menyimpan: " + error.message)
    else {
      toast.success("Profil komunitas berhasil diperbarui!")
      setCommunity((prev: any) => ({ ...prev, ...form }))
    }
    setIsSaving(false)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !community?.id) return
    if (file.size > 2 * 1024 * 1024) { toast.error("Logo maksimal 2MB."); return }
    setIsUploadingLogo(true)
    const ext = file.name.split(".").pop()
    const path = `communities/logo-${community.id}-${Date.now()}.${ext}`
    const { error: uploadErr } = await supabase.storage.from("sinergilaut-assets").upload(path, file, { upsert: true })
    if (uploadErr) { toast.error("Gagal upload logo."); setIsUploadingLogo(false); return }
    const { data: urlData } = supabase.storage.from("sinergilaut-assets").getPublicUrl(path)
    await supabase.from("communities").update({ logo_url: urlData.publicUrl }).eq("id", community.id)
    setCommunity((prev: any) => ({ ...prev, logo_url: urlData.publicUrl }))
    toast.success("Logo berhasil diperbarui!")
    setIsUploadingLogo(false)
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !community?.id) return
    if (file.size > 5 * 1024 * 1024) { toast.error("Gambar sampul maksimal 5MB."); return }
    setIsUploadingCover(true)
    const ext = file.name.split(".").pop()
    const path = `communities/cover-${community.id}-${Date.now()}.${ext}`
    const { error: uploadErr } = await supabase.storage.from("sinergilaut-assets").upload(path, file, { upsert: true })
    if (uploadErr) { toast.error("Gagal upload gambar sampul."); setIsUploadingCover(false); return }
    const { data: urlData } = supabase.storage.from("sinergilaut-assets").getPublicUrl(path)
    await supabase.from("communities").update({ cover_image_url: urlData.publicUrl }).eq("id", community.id)
    setCommunity((prev: any) => ({ ...prev, cover_image_url: urlData.publicUrl }))
    toast.success("Gambar sampul berhasil diperbarui!")
    setIsUploadingCover(false)
  }

  const toggleFocus = (area: string) => {
    setForm(prev => ({
      ...prev,
      focus_areas: prev.focus_areas.includes(area)
        ? prev.focus_areas.filter(a => a !== area)
        : [...prev.focus_areas, area],
    }))
  }

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  if (!community) return (
    <div className="flex-1 flex items-center justify-center min-h-screen text-muted-foreground">
      Komunitas tidak ditemukan.
    </div>
  )

  return (
    <div className="flex-1 bg-slate-50">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pt-12 md:pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            {community.is_verified && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" /> Komunitas Terverifikasi
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">Edit Profil Komunitas</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Perbarui informasi komunitas Anda agar relawan dan donatur lebih mengenal komunitas Anda.
          </p>
        </div>

        <div className="space-y-6">

          {/* ── Foto & Gambar ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Foto &amp; Gambar</p>
                  <p className="text-xs text-slate-400">Upload logo dan gambar sampul komunitas Anda.</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">

              {/* Logo */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Logo Komunitas</p>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border-2 border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0">
                    {community.logo_url
                      ? <img src={community.logo_url} alt="Logo" className="w-full h-full object-cover" />
                      : <Building2 className="h-8 w-8 text-slate-300" />}
                  </div>
                  <div>
                    <input type="file" accept="image/*" ref={logoInputRef} className="hidden" onChange={handleLogoUpload} />
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isUploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {isUploadingLogo ? "Mengupload..." : "Pilih Logo"}
                    </button>
                    <p className="text-xs text-slate-400 mt-1.5">Format: JPG/PNG, maks. 2MB. Rasio 1:1 direkomendasikan.</p>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Gambar Sampul</p>
                {community.cover_image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-36">
                    <Image src={community.cover_image_url} alt="Cover" fill className="object-cover" />
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      className="absolute bottom-2 right-2 flex items-center gap-1.5 text-xs font-bold bg-white/90 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-white transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5" /> Ganti Gambar
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl h-36 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-colors"
                  >
                    {isUploadingCover
                      ? <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                      : <>
                          <Upload className="h-6 w-6 text-slate-400" />
                          <p className="text-sm text-slate-500 font-medium">Upload Gambar Sampul</p>
                        </>}
                  </div>
                )}
                <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={handleCoverUpload} />
                <p className="text-xs text-slate-400 mt-1.5">Format: JPG/PNG, maks. 5MB. Rasio 16:9 direkomendasikan.</p>
              </div>
            </div>
          </div>

          {/* ── Informasi Dasar ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Informasi Dasar</p>
                  <p className="text-xs text-slate-400">Detail utama komunitas Anda.</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Komunitas <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  maxLength={100}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="Nama komunitas Anda"
                />
                <p className="text-xs text-slate-400 mt-1">{form.name.length}/100 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Singkat</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={4}
                  maxLength={500}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                  placeholder="Jelaskan misi dan kegiatan komunitas Anda..."
                />
                <p className="text-xs text-slate-400 mt-1">{form.description.length}/500 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <MapPin className="inline h-4 w-4 mr-1 text-slate-400" />Lokasi
                </label>
                <input
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="contoh: Bali & Nusa Tenggara"
                />
              </div>
            </div>
          </div>

          {/* ── Fokus Kegiatan ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <p className="text-sm font-bold text-slate-800">Fokus Kegiatan</p>
              <p className="text-xs text-slate-400">Pilih jenis kegiatan yang dilakukan komunitas Anda.</p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map(area => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocus(area)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      form.focus_areas.includes(area)
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600"
                    }`}
                  >
                    {form.focus_areas.includes(area) && <span className="mr-1">✓</span>}
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Media Sosial ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <p className="text-sm font-bold text-slate-800">Media Sosial &amp; Website</p>
              <p className="text-xs text-slate-400">Link media sosial dan website resmi komunitas.</p>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "website",   icon: Globe,      placeholder: "https://website-komunitas.com",    label: "Website" },
                { key: "instagram", icon: Instagram,   placeholder: "https://instagram.com/username",   label: "Instagram" },
                { key: "facebook",  icon: Facebook,    placeholder: "https://facebook.com/page",        label: "Facebook" },
                { key: "twitter",   icon: Twitter,     placeholder: "https://twitter.com/username",     label: "Twitter" },
              ].map(({ key, icon: Icon, placeholder, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    value={(form as any)[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Save Button ── */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

        </div>
      </main>
    </div>
  )
}
