"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Waves, Mail, Lock, User, Phone, Building, AlertCircle, Loader2, Check, ArrowRight, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

type RoleType = "user" | "community" | null
type Step = 1 | 2 | 3

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<RoleType>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    // Community fields
    communityName: "",
    communityDescription: "",
    location: "",
    website: "",
    representative: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok.")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter.")
      setIsLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: role,
          phone: formData.phone,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }

    if (data.user && role === "community" && formData.communityName) {
      // Create community record
      const slug = formData.communityName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")

      await supabase.from("communities").insert({
        owner_id: data.user.id,
        name: formData.communityName,
        slug,
        description: formData.communityDescription,
        location: formData.location,
        website: formData.website,
        verification_status: "pending",
      })
    }

    toast.success("Pendaftaran berhasil! Silakan cek email untuk verifikasi.")
    router.push("/login")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Waves className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">SinergiLaut</span>
          </Link>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground border border-border"
              }`}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-1 mx-2 rounded-full ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Choose Role */}
        {step === 1 && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Bergabung dengan SinergiLaut</CardTitle>
              <CardDescription>Pilih bagaimana Anda ingin berkontribusi</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => { setRole("user"); setStep(2) }}
                className="group p-6 rounded-xl border-2 border-border hover:border-primary bg-background transition-all text-left"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Volunteer / Donatur</h3>
                <p className="text-sm text-muted-foreground">Ikut kegiatan konservasi, donasi, dan pantau dampak Anda.</p>
              </button>
              <button
                onClick={() => { setRole("community"); setStep(2) }}
                className="group p-6 rounded-xl border-2 border-border hover:border-primary bg-background transition-all text-left"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Building className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Komunitas / Organisasi</h3>
                <p className="text-sm text-muted-foreground">Buat dan kelola kegiatan konservasi, rekrut relawan, terima donasi.</p>
              </button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Account Info */}
        {step === 2 && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Buat Akun</CardTitle>
              <CardDescription>
                {role === "community" ? "Akun pengelola komunitas" : "Akun volunteer / donatur"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); setStep(3) }} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="fullName" placeholder="Nama lengkap" value={formData.fullName} onChange={handleChange} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nomor Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="phone" type="tel" placeholder="+62 812 3456 7890" value={formData.phone} onChange={handleChange} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="password" type="password" placeholder="Minimal 8 karakter" value={formData.password} onChange={handleChange} className="pl-10" required minLength={8} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="confirmPassword" type="password" placeholder="Ulangi password" value={formData.confirmPassword} onChange={handleChange} className="pl-10" required />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <Button type="button" variant="outline" onClick={() => { setStep(1); setRole(null) }} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                  </Button>
                  <Button type="submit" className="flex-1">
                    Lanjutkan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Community Info (if community) or Confirmation */}
        {step === 3 && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{role === "community" ? "Info Komunitas" : "Konfirmasi Pendaftaran"}</CardTitle>
              <CardDescription>
                {role === "community" ? "Data komunitas Anda" : "Periksa data sebelum mendaftar"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {role === "community" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Nama Komunitas / Organisasi</Label>
                      <Input name="communityName" placeholder="Nama komunitas" value={formData.communityName} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Deskripsi Singkat</Label>
                      <Input name="communityDescription" placeholder="Deskripsi komunitas" value={formData.communityDescription} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Lokasi</Label>
                      <Input name="location" placeholder="Kota, Provinsi" value={formData.location} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Website (opsional)</Label>
                      <Input name="website" type="url" placeholder="https://..." value={formData.website} onChange={handleChange} />
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                      ⚠️ Komunitas akan diverifikasi admin sebelum bisa mempublikasikan kegiatan (1-3 hari kerja).
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-secondary rounded-lg space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Nama:</span> <span className="font-medium">{formData.fullName}</span></p>
                    <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{formData.email}</span></p>
                    <p><span className="text-muted-foreground">Role:</span> <span className="font-medium capitalize">{role}</span></p>
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mendaftar...</> : <><Check className="mr-2 h-4 w-4" /> Daftar</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">Masuk di sini</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Waves className="h-10 w-10 text-primary animate-pulse" /></div>}>
      <RegisterContent />
    </Suspense>
  )
}
