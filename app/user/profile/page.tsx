"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { User, Camera, Save, Loader2, Phone, Mail, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getInitials } from "@/lib/utils/helpers"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function UserProfilePage() {
  const { profile, refreshProfile } = useAuth()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    bio: profile?.bio ?? "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setIsLoading(true)
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      phone: form.phone,
      bio: form.bio,
    }).eq("id", profile.id)

    if (error) {
      toast.error("Gagal memperbarui profil.")
    } else {
      toast.success("Profil berhasil diperbarui!")
      await refreshProfile()
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <Link href="/user/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Edit Profil</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                        {getInitials(profile?.full_name ?? profile?.email ?? "?")}
                      </div>
                    )}
                    <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{profile?.full_name ?? "Pengguna"}</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    <p className="text-xs text-primary capitalize mt-1 font-medium">{profile?.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Info */}
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Informasi Pribadi</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} className="pl-10" placeholder="Nama lengkap" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={profile?.email ?? ""} disabled className="pl-10 bg-secondary text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="pl-10" placeholder="+62 8xx xxxx xxxx" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Tentang Saya</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="bio" name="bio" value={form.bio} onChange={handleChange} className="pl-10" rows={4}
                      placeholder="Ceritakan sedikit tentang diri Anda dan minat Anda di bidang konservasi laut..." />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
