import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Heart, ArrowRight, Shield, Globe, Leaf, Banknote, Package, Calendar, MapPin, Users } from "lucide-react"

const impactStats = [
  { icon: Leaf, value: "50,000+", label: "Coral Fragments Planted" },
  { icon: Globe, value: "100+", label: "Coastal Communities Helped" },
  { icon: Shield, value: "25km", label: "Coastline Protected" },
]

const featuredActivities = [
  {
    id: 1,
    title: "Coastal Beach Cleanup - Jakarta Bay",
    image: "/images/beach-cleanup.jpg",
    date: "March 22, 2026",
    location: "Jakarta Bay, Indonesia",
    fundingGoal: 5000000,
    fundingRaised: 3500000,
    itemsNeeded: 5,
    category: "Beach Cleanup",
  },
  {
    id: 2,
    title: "Coral Reef Restoration - Raja Ampat",
    image: "/images/coral-restoration.jpg",
    date: "April 15-20, 2026",
    location: "Raja Ampat, Indonesia",
    fundingGoal: 25000000,
    fundingRaised: 18750000,
    itemsNeeded: 5,
    category: "Reef Restoration",
  },
  {
    id: 4,
    title: "Mangrove Planting Day",
    image: "/images/mangrove-planting.jpg",
    date: "April 5, 2026",
    location: "Surabaya, Indonesia",
    fundingGoal: 8000000,
    fundingRaised: 4000000,
    itemsNeeded: 5,
    category: "Restoration",
  },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function DonatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/donate-hero.jpg"
              alt="Ocean conservation"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-foreground/70" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-white px-4 py-2 rounded-full mb-6">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Support Conservation Activities</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
              Your Donation Powers Real Conservation
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Every activity on SinergiLaut needs resources to succeed. Choose an activity and contribute money or items directly to support their specific needs.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/activities">
                Browse Activities to Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                How Activity-Based Donations Work
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Your contributions go directly to the activities that need them most
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Choose an Activity</h3>
                <p className="text-muted-foreground">
                  Browse conservation activities and find one that resonates with your passion for ocean protection.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Select Your Contribution</h3>
                <p className="text-muted-foreground">
                  Donate money to fund the activity, or choose specific items from their needs list to contribute.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">See Your Impact</h3>
                <p className="text-muted-foreground">
                  Track the progress of activities you support and receive updates on how your donation made a difference.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-12 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {impactStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-4 justify-center">
                  <div className="w-12 h-12 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                    <p className="text-sm text-primary-foreground/80">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Types */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Two Ways to Support
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose how you want to make an impact
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="relative overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Banknote className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Donate Money</h3>
                  <p className="text-muted-foreground mb-6">
                    Contribute funds to help activities reach their funding goals. Your donation helps cover equipment, transportation, and other operational costs.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left mb-6">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Secure payment processing
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Tax deductible receipts
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Transparent fund tracking
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Donate Items</h3>
                  <p className="text-muted-foreground mb-6">
                    Each activity lists specific items they need. Choose items from their wishlist and we will ensure they get delivered to the organizers.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left mb-6">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      See exactly what is needed
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      Direct impact visibility
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      Track item delivery
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Activities */}
        <section className="py-16 lg:py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Activities Seeking Support
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                These activities are actively fundraising. Your donation can help them reach their goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {featuredActivities.map((activity) => {
                const fundingPercentage = Math.round((activity.fundingRaised / activity.fundingGoal) * 100)
                return (
                  <Card key={activity.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={activity.image}
                        alt={activity.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                          {activity.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-foreground mb-2 leading-tight">{activity.title}</h3>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                      
                      {/* Funding Progress */}
                      <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Banknote className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium text-foreground">Funding Progress</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden mb-1">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${fundingPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{formatCurrency(activity.fundingRaised)}</span>
                          <span className="font-medium text-foreground">{fundingPercentage}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Package className="h-4 w-4 text-accent" />
                        <span>{activity.itemsNeeded} items needed</span>
                      </div>

                      <Button className="w-full" asChild>
                        <Link href={`/donate/${activity.id}`}>Support This Activity</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/activities">
                  View All Activities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Corporate Sponsors CTA */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Corporate Partnership Opportunities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Partner with SinergiLaut to sponsor multiple activities and demonstrate your commitment to ocean conservation. Custom sponsorship packages available.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/community">
                Become a Corporate Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
