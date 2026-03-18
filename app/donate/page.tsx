import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Heart, Check, ArrowRight, Shield, Globe, Leaf } from "lucide-react"

const donationTiers = [
  {
    amount: 25,
    title: "Supporter",
    description: "Help clean 10 meters of coastline",
    features: ["Monthly impact report", "Supporter badge", "Newsletter updates"],
  },
  {
    amount: 50,
    title: "Protector",
    description: "Plant 5 coral fragments in damaged reefs",
    features: ["All Supporter benefits", "Personalized certificate", "Priority event access"],
    popular: true,
  },
  {
    amount: 100,
    title: "Guardian",
    description: "Fund a full day of conservation activities",
    features: ["All Protector benefits", "Name on donor wall", "Exclusive virtual tours"],
  },
  {
    amount: 500,
    title: "Champion",
    description: "Sponsor a complete reef restoration project",
    features: ["All Guardian benefits", "Direct project updates", "Annual impact meeting"],
  },
]

const impactStats = [
  { icon: Leaf, value: "50,000+", label: "Coral Fragments Planted" },
  { icon: Globe, value: "100+", label: "Coastal Communities Helped" },
  { icon: Shield, value: "25km", label: "Coastline Protected" },
]

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
              <span className="text-sm font-medium">Make an Impact Today</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
              Your Donation Protects Our Oceans
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Every contribution directly funds conservation activities, from beach cleanups to coral restoration. Together, we can preserve marine ecosystems for future generations.
            </p>
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

        {/* Donation Tiers */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Choose Your Impact Level
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Select a donation tier that works for you. All contributions are tax-deductible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {donationTiers.map((tier) => (
                <Card 
                  key={tier.amount} 
                  className={`relative overflow-hidden ${tier.popular ? "border-primary border-2" : ""}`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-foreground">${tier.amount}</p>
                      <p className="text-sm text-muted-foreground">one-time donation</p>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{tier.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={tier.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href={`/register?role=donor&amount=${tier.amount}`}>
                        Donate ${tier.amount}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Want to donate a custom amount?</p>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register?role=donor">
                  Make a Custom Donation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How Your Donation Helps */}
        <section className="py-20 lg:py-28 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/donation-impact.jpg"
                  alt="Conservation impact"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                  Where Your Money Goes
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  {"We're committed to transparency. Here's how we allocate every dollar you donate:"}
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-background rounded-full h-4 overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "70%" }} />
                    </div>
                    <span className="text-sm font-medium text-foreground w-24">70% Programs</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-background rounded-full h-4 overflow-hidden">
                      <div className="bg-primary/70 h-full rounded-full" style={{ width: "20%" }} />
                    </div>
                    <span className="text-sm font-medium text-foreground w-24">20% Operations</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-background rounded-full h-4 overflow-hidden">
                      <div className="bg-primary/40 h-full rounded-full" style={{ width: "10%" }} />
                    </div>
                    <span className="text-sm font-medium text-foreground w-24">10% Fundraising</span>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">100% Transparency:</strong> View our annual financial reports and see exactly how your donation creates impact.
                  </p>
                </div>
              </div>
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
              Partner with SinergiLaut to demonstrate your commitment to ocean conservation. Custom sponsorship packages available for organizations of all sizes.
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
