import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Waves, Users, Target, Eye, Heart, Globe, Award, Leaf, Mail, MapPin } from "lucide-react"

const teamMembers = [
  { name: "Dr. Arif Wicaksono", role: "Founder & CEO", image: "/images/testimonial-1.jpg", bio: "Ahli biologi kelautan dengan 15 tahun pengalaman konservasi pesisir." },
  { name: "Sari Puspita", role: "Head of Community", image: "/images/testimonial-2.jpg", bio: "Spesialis pemberdayaan komunitas pesisir di seluruh Indonesia." },
  { name: "Reza Mahendra", role: "Chief Technology Officer", image: "/images/testimonial-3.jpg", bio: "Engineer berpengalaman di bidang platform sosial dan lingkungan." },
]

const milestones = [
  { year: "2020", event: "SinergiLaut didirikan dengan misi mempermudah konservasi laut kolaboratif." },
  { year: "2021", event: "Bergabung dengan 10 komunitas pertama dan 500 volunteer aktif pertama." },
  { year: "2022", event: "Meluncurkan sistem donasi terintegrasi dan verifikasi transparansi dana." },
  { year: "2023", event: "Memperluas jaringan ke 50+ komunitas di seluruh nusantara." },
  { year: "2024", event: "Mencapai 10.000+ volunteer terdaftar dan Rp 5M+ dana terhimpun." },
  { year: "2026", event: "Platform generasi baru dengan fitur realtime, laporan, dan dashboard lengkap." },
]

const values = [
  { icon: Heart, title: "Kolaborasi", description: "Kami percaya perubahan besar terjadi ketika komunitas, individu, dan organisasi bekerja bersama." },
  { icon: Eye, title: "Transparansi", description: "Setiap rupiah donasi dan setiap kegiatan dilaporkan dengan akuntabel dan terbuka untuk publik." },
  { icon: Leaf, title: "Keberlanjutan", description: "Semua program dirancang untuk menciptakan dampak jangka panjang pada ekosistem laut." },
  { icon: Globe, title: "Inklusif", description: "Platform kami terbuka untuk semua — dari nelayan tradisional hingga korporat besar." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        {/* Hero */}
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

        {/* Mission & Vision */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wide">Misi Kami</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Melindungi Laut Indonesia Bersama
                </h2>
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

        {/* Values */}
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

        {/* Timeline */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Perjalanan Kami</h2>
              <p className="mt-4 text-lg text-muted-foreground">Dari mimpi kecil menjadi platform konservasi terbesar Indonesia</p>
            </div>
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 text-right">
                    <span className="text-sm font-bold text-primary">{m.year}</span>
                  </div>
                  <div className="flex-shrink-0 w-px bg-border relative">
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="text-foreground leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
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

        {/* CTA */}
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
