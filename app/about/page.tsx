/**
 * Halaman About SinergiLaut
 * "Perjalanan Kami" — ditampilkan sebagai DIAGRAM TIMELINE + TABEL DATA
 * Data diambil dari Supabase (journey_milestones)
 *
 * Ini adalah Server Component — aman dari hydration error.
 */

import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Type definition inline agar tidak bergantung pada 'use server' action file
interface JourneyMilestone {
  id: string
  year: number
  title: string
  description: string
  impact_stat: string | null
  icon: string
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
}
import {
  Waves, Users, Target, Eye, Heart, Globe, Award, Leaf, Zap, Banknote,
  CheckCircle, BookOpen, Star, TrendingUp, Table2
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

// Peta nama ikon ke komponen Lucide React (server-safe)
const iconMap: Record<string, React.ElementType> = {
  Waves, Users, Award, Leaf, Globe, Zap, Banknote, CheckCircle,
  BookOpen, Star, TrendingUp, Target, Eye, Heart,
}

const teamMembers = [
  { name: "Dr. Arif Wicaksono", role: "Founder & CEO", image: "/images/testimonial-1.jpg", bio: "Ahli biologi kelautan dengan 15 tahun pengalaman konservasi pesisir." },
  { name: "Sari Puspita", role: "Head of Community", image: "/images/testimonial-2.jpg", bio: "Spesialis pemberdayaan komunitas pesisir di seluruh Indonesia." },
  { name: "Reza Mahendra", role: "Chief Technology Officer", image: "/images/testimonial-3.jpg", bio: "Engineer berpengalaman di bidang platform sosial dan lingkungan." },
]

const values = [
  { icon: Heart, title: "Kolaborasi", description: "Kami percaya perubahan besar terjadi ketika komunitas, individu, dan organisasi bekerja bersama." },
  { icon: Eye, title: "Transparansi", description: "Setiap rupiah donasi dan setiap kegiatan dilaporkan dengan akuntabel dan terbuka untuk publik." },
  { icon: Leaf, title: "Keberlanjutan", description: "Semua program dirancang untuk menciptakan dampak jangka panjang pada ekosistem laut." },
  { icon: Globe, title: "Inklusif", description: "Platform kami terbuka untuk semua — dari nelayan tradisional hingga korporat besar." },
]

// Fallback data jika Supabase belum tersedia
const fallbackMilestones: JourneyMilestone[] = [
  { id: "1", year: 2020, title: "SinergiLaut Didirikan", description: "Platform lahir dari keresahan sulitnya koordinasi komunitas konservasi laut di Indonesia.", impact_stat: "Misi dimulai", icon: "Waves", order_index: 1, is_published: true, created_at: "", updated_at: "" },
  { id: "2", year: 2021, title: "Komunitas Pertama Bergabung", description: "10 komunitas dari Jawa, Bali, Sulawesi bergabung. 500 relawan aktif terdaftar.", impact_stat: "10 komunitas, 500+ relawan", icon: "Users", order_index: 2, is_published: true, created_at: "", updated_at: "" },
  { id: "3", year: 2022, title: "Sistem Donasi & Transparansi", description: "Meluncurkan sistem donasi terintegrasi dengan verifikasi penggunaan dana yang transparan.", impact_stat: "Rp 1M+ dana terhimpun", icon: "Banknote", order_index: 3, is_published: true, created_at: "", updated_at: "" },
  { id: "4", year: 2023, title: "Ekspansi ke 50+ Komunitas", description: "Jaringan komunitas berkembang ke 50+ komunitas di 15 provinsi, dari Sabang hingga Papua.", impact_stat: "50+ komunitas, 15 provinsi", icon: "Globe", order_index: 4, is_published: true, created_at: "", updated_at: "" },
  { id: "5", year: 2024, title: "Milestone 10.000 Relawan", description: "Mencapai 10.000+ relawan terdaftar dan Rp 5 miliar+ dana konservasi terhimpun.", impact_stat: "10.000+ relawan, Rp 5M+ dana", icon: "Award", order_index: 5, is_published: true, created_at: "", updated_at: "" },
  { id: "6", year: 2026, title: "Platform Generasi Baru", description: "Peluncuran platform baru: realtime, Midtrans, dashboard lengkap, dan pencairan dana transparan.", impact_stat: "Fitur lengkap & real-time", icon: "Zap", order_index: 6, is_published: true, created_at: "", updated_at: "" },
]

async function getMilestones(): Promise<JourneyMilestone[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("journey_milestones")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true })

    if (error || !data || data.length === 0) return fallbackMilestones
    return data as JourneyMilestone[]
  } catch {
    return fallbackMilestones
  }
}

export default async function AboutPage() {
  const milestones = await getMilestones()

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative py-24 lg:py-32 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center">
                <Waves className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground">Tentang SinergiLaut</h1>
            <p className="mt-6 text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Platform konservasi laut yang mempertemukan komunitas, relawan, dan donatur dalam satu ekosistem digital terintegrasi.
            </p>
          </div>
        </section>

        {/* ── Mission & Vision ──────────────────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wide">Misi Kami</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Melindungi Laut Indonesia Bersama</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  SinergiLaut hadir sebagai jembatan antara semangat masyarakat peduli lingkungan dan kebutuhan nyata di lapangan. Kami menyediakan infrastruktur digital untuk memudahkan koordinasi kegiatan konservasi, transparansi dana, dan pengembangan komunitas.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Visi kami adalah Indonesia dengan ekosistem laut yang sehat, terlindungi, dan dikelola secara berkelanjutan oleh generasi yang peduli.
                </p>
              </div>
              <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden">
                <Image src="/images/mission-ocean.jpg" alt="Konservasi laut Indonesia" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Nilai-nilai Kami</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Prinsip yang memandu setiap keputusan dan langkah SinergiLaut.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Perjalanan Kami — TIMELINE ────────────────────── */}
        <section className="py-20 lg:py-28" id="perjalanan-kami">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Perjalanan Kami</h2>
              <p className="mt-4 text-lg text-muted-foreground">Dari mimpi kecil menjadi platform konservasi terbesar Indonesia</p>
            </div>

            {/* Timeline Diagram */}
            <div className="relative">
              {/* Garis vertikal */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden sm:block" />

              <div className="space-y-8">
                {milestones.map((m, i) => {
                  const IconComponent = iconMap[m.icon] ?? Award
                  const isLastItem = i === milestones.length - 1
                  return (
                    <div key={m.id} className={`flex gap-6 items-start ${isLastItem ? "" : "pb-2"}`}>
                      {/* Icon + Year bubble */}
                      <div className="flex-shrink-0 flex flex-col items-center gap-2 w-16">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10 relative shadow-md">
                          <IconComponent className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xs font-bold text-primary">{m.year}</span>
                      </div>

                      {/* Content card */}
                      <Card className="flex-1 hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{m.title}</h3>
                            {m.impact_stat && (
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs whitespace-nowrap">
                                {m.impact_stat}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ─── Tabel Data "Perjalanan Kami" ─────────────── */}
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Table2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Data Ringkasan Perjalanan</h3>
                  <p className="text-sm text-muted-foreground">Seluruh tonggak sejarah dalam format tabel yang mudah dibaca</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground w-20">Tahun</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Milestone</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground hidden md:table-cell">Deskripsi</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground whitespace-nowrap">Dampak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map((m, i) => {
                      const IconComponent = iconMap[m.icon] ?? Award
                      return (
                        <tr
                          key={m.id}
                          className={`border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${i % 2 === 0 ? "bg-background" : "bg-secondary/20"}`}
                        >
                          <td className="py-3 px-4">
                            <span className="font-bold text-primary">{m.year}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <IconComponent className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <span className="font-medium text-foreground">{m.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground leading-relaxed hidden md:table-cell max-w-xs">
                            {m.description}
                          </td>
                          <td className="py-3 px-4">
                            {m.impact_stat ? (
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                                {m.impact_stat}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Total {milestones.length} milestone tercatat · Data diperbarui secara berkala
              </p>
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Tim Kami</h2>
              <p className="mt-4 text-lg text-muted-foreground">Orang-orang berdedikasi di balik SinergiLaut</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {teamMembers.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardContent className="p-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Bergabunglah dengan Gerakan Kami</h2>
            <p className="text-primary-foreground/80 mb-8">Bersama kita bisa menciptakan perubahan nyata untuk laut Indonesia.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/activities">Lihat Kegiatan</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                <Link href="/contact">Hubungi Kami</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
