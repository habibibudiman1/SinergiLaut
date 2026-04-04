"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Waves, Mail, Lock, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Suspense } from "react"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get("redirectedFrom") || ""
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "Email atau password salah. Silakan coba lagi."
        : error.message)
      setIsLoading(false)
      return
    }

    if (data.user) {
      // Get role from JWT metadata instead of making another DB query
      const role = data.user.user_metadata?.role || "user"

      toast.success("Login berhasil! Selamat datang kembali.")

      if (redirectedFrom) {
        router.push(redirectedFrom)
      } else if (role === "admin") {
        router.push("/admin/dashboard")
      } else if (role === "community") {
        router.push("/community/dashboard")
      } else {
        router.push("/user/dashboard")
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/SinergiLautLogo-transparent.png" alt="SinergiLaut Logo" width={40} height={40} className="h-10 w-auto" />
            <span className="text-2xl font-bold text-foreground">SinergiLaut</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Masuk ke Akun Anda</CardTitle>
            <CardDescription>Platform Konservasi Laut Indonesia</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Masuk...</>
                ) : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Belum punya akun? </span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Daftar sekarang
              </Link>
            </div>


          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="hover:text-foreground transition-colors">← Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Image src="/images/SinergiLautLogo-transparent.png" alt="SinergiLaut Logo" width={40} height={40} className="h-10 w-auto animate-pulse" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
