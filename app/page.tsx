import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Users, Heart, Leaf, Calendar, MapPin, CheckCircle, Search, Gift, LineChart, FileText } from "lucide-react"

import { DUMMY_ACTIVITIES, SUCCESSFUL_ACTIVITIES } from "@/lib/data/dummy-activities"

import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils/helpers"

const stats = [
  { value: "15,000+", label: "Volunteers" },
  { value: "250+", label: "Activities" },
  { value: "50+", label: "Coastal Areas Protected" },
  { value: "$2.5M", label: "Funds Raised" },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: realActivities } = await supabase
    .from("activities")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3)

  let mappedSupabaseActivities: any[] = []
  if (realActivities) {
    mappedSupabaseActivities = realActivities.map(d => ({
      ...d,
      id: d.id,
      title: d.title,
      description: d.description,
      image: d.cover_image_url || "/images/placeholder.jpg",
      date: formatDate(d.start_date || new Date().toISOString()),
      location: d.location || "Online",
      volunteers: d.volunteer_count || 0,
      icon: Leaf,
    }))
  }

  const allActivities = [...mappedSupabaseActivities, ...DUMMY_ACTIVITIES]
  const featuredActivities = allActivities.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-16">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-ocean.jpg"
              alt="Ocean waves"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-foreground/60" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
              Join the Movement to Protect Our Oceans
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Connect with marine conservation communities, volunteers, and donors to make a lasting impact on our ocean ecosystems.
            </p>

          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="mt-2 text-sm text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Introduction Banner Section */}
        <section className="py-16 bg-blue-50/50 dark:bg-blue-950/20 border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Mengenal SinergiLaut Lebih Dekat
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
              SinergiLaut hadir sebagai wadah kolaboratif yang menghubungkan berbagai elemen masyarakat—mulai dari relawan, donatur, hingga komunitas lokal—untuk bersinergi melindungi dan menjaga kelestarian ekosistem laut Nusantara melalui aksi nyata dan berkesinambungan.
            </p>
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/about">
                Tentang SinergiLaut
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Successful Conservation Section */}
        <section className="py-20 lg:py-28 bg-green-50/30 dark:bg-green-950/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance flex items-center justify-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                Successful Conservation
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Aksi nyata yang telah berhasil diselesaikan berkat dukungan dari donatur dan relawan kami yang luar biasa.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {SUCCESSFUL_ACTIVITIES.map((activity) => (
                <Card key={activity.id} className="overflow-hidden border-green-200 dark:border-green-800/50 hover:shadow-xl transition-all shadow-md group">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="relative w-full sm:w-2/5 h-56 sm:h-auto overflow-hidden">
                      <Image
                        src={activity.image}
                        alt={activity.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </div>
                    </div>
                    <CardContent className="p-6 sm:w-3/5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">{activity.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                          {activity.description}
                        </p>
                      </div>

                      <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between text-sm bg-secondary/50 p-2 rounded-lg">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="h-4 w-4 text-primary" />
                            <span><strong className="text-foreground">{activity.volunteers}</strong> <span className="hidden sm:inline">Relawan</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="truncate max-w-[100px] sm:max-w-none">{activity.location.split(',')[0]}</span>
                          </div>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                          <Link href={`/activities/${activity.id}`}>
                            Lihat Laporan & Dokumentasi
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Activities Section */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Featured Conservation Activities
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover meaningful ways to contribute to ocean conservation through our diverse programs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {activity.volunteers} volunteers
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <activity.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg text-foreground">{activity.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location}</span>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href={`/activities/${activity.id}`}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/activities">
                  View All Activities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 lg:py-28 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                  Our Mission: Sustainable Ocean Conservation
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  SinergiLaut brings together passionate individuals, organizations, and corporations to create lasting positive change for our marine ecosystems. Through collaborative action and education, we're building a future where oceans thrive.
                </p>
                <div className="mt-8 grid sm:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Community First</h3>
                      <p className="text-sm text-muted-foreground mt-1">Empowering local communities to lead conservation efforts.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Transparent Impact</h3>
                      <p className="text-sm text-muted-foreground mt-1">Every donation and effort is tracked and reported.</p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="relative h-80 lg:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/mission-ocean.jpg"
                  alt="Ocean conservation in action"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Donation Flow Section */}
        <section className="py-20 lg:py-28 bg-blue-50/30 dark:bg-blue-950/20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Bagaimana Cara Berdonasi?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Langkah mudah dan transparan untuk ikut berkontribusi dalam menjaga kelestarian laut.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-border z-0" />

              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-background border-4 border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-105 group-hover:border-primary transition-all duration-300">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Pilih Kegiatan</h3>
                <p className="text-muted-foreground text-sm leading-relaxed px-4">
                  Telusuri dan pilih aksi pelestarian lingkungan atau pesisir yang ingin Anda dukung.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-background border-4 border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-105 group-hover:border-primary transition-all duration-300">
                  <Gift className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Pilih Jenis Donasi</h3>
                <p className="text-muted-foreground text-sm leading-relaxed px-4">
                  Sumbangkan sejumlah dana atau belikan barang yang sedang dibutuhkan oleh relawan.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-background border-4 border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-105 group-hover:border-primary transition-all duration-300">
                  <LineChart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Pantau Eksekusi</h3>
                <p className="text-muted-foreground text-sm leading-relaxed px-4">
                  Lacak setiap progres pendanaan dan persiapan aksi kegiatan secara transparan & real-time.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-background border-4 border-primary/20 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-105 group-hover:border-primary transition-all duration-300">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">4. Terima Laporan</h3>
                <p className="text-muted-foreground text-sm leading-relaxed px-4">
                  Buka tab laporan untuk melihat bukti dokumen RAB dan galeri foto hasil kegiatan konservasi.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/activities">
                  Mulai Berdonasi Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
