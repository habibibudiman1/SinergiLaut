import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShieldCheck, TrendingUp, Users } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getEndowmentStats, getEndowmentDisbursements } from "@/lib/actions/endowment.actions"
import { formatCurrency } from "@/lib/utils/helpers"

export default async function EndowmentPage() {
  const stats = await getEndowmentStats()
  const disbursements = await getEndowmentDisbursements()
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-24">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-black/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">Transparansi Finansial</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 text-foreground">
              Dana Abadi SinergiLaut
            </h1>
            <p className="text-xl text-muted-foreground">
              Sebuah inisiatif urun dana transparan yang dialokasikan untuk membantu menyokong komunitas-komunitas penggerak kebersihan laut yang membutuhkan bantuan pendanaan darurat.
            </p>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>100% Transparan</CardTitle>
                <CardDescription>
                  Semua arus kas dan penyaluran dana abadi dapat dipantau langsung oleh publik untuk menjaga kepercayaan.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Dukungan Komunitas</CardTitle>
                <CardDescription>
                  Dana dialokasikan prioritas untuk komunitas kecil yang kekurangan resource agar kegiatan kebersihan laut tetap berjalan.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Berdampak Jangka Panjang</CardTitle>
                <CardDescription>
                  Setiap donasi membantu keberlangsungan pemeliharaan ekosistem laut tanpa henti dan mendukung regenerasi relawan.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Status Dana */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Status & Alokasi Dana Saat Ini</h2>
            <p className="text-muted-foreground">Catatan transparan akumulasi dana abadi dan riwayat pendistribusiannya.</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="grid sm:grid-cols-2 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border">
                <div className="text-center sm:pr-8">
                  <p className="text-sm text-muted-foreground mb-2">Total Dana Terkumpul</p>
                  <p className="text-4xl font-bold text-primary">{formatCurrency(stats.totalRaised)}</p>
                  <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Live auto-update
                  </p>
                </div>
                <div className="text-center sm:pl-8 pt-8 sm:pt-0">
                  <p className="text-sm text-muted-foreground mb-2">Dana Sudah Disalurkan</p>
                  <p className="text-4xl font-bold text-foreground">{formatCurrency(stats.disbursed)}</p>
                  <p className="text-xs text-muted-foreground mt-2">Kepada {disbursements.length} komunitas</p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5" /> Riwayat Penyaluran Terbaru
                </h3>
                <div className="space-y-4">
                  {disbursements.length === 0 && (
                     <p className="text-muted-foreground text-center py-4 text-sm">Belum ada riwayat penyaluran dana abadi secara spesifik.</p>
                  )}
                  {disbursements.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.community?.name || "Bantuan Komunitas"}</p>
                        <p className="text-sm text-muted-foreground">{item.notes}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {formatCurrency(item.amount)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
    </div>
  </section>
      </main>
      <Footer />
    </div>
  )
}
