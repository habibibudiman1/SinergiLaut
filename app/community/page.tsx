import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Users, MapPin, Globe, Award, Building, MessageCircle } from "lucide-react"

const communityStats = [
  { icon: Users, value: "15,000+", label: "Active Members" },
  { icon: MapPin, value: "50+", label: "Coastal Communities" },
  { icon: Globe, value: "12", label: "Partner Countries" },
]

const partnerOrganizations = [
  { name: "Ocean Conservation Trust", logo: "/images/partner-1.jpg", type: "NGO Partner" },
  { name: "Blue Marine Foundation", logo: "/images/partner-2.jpg", type: "Research Partner" },
  { name: "Coral Triangle Initiative", logo: "/images/partner-3.jpg", type: "Regional Partner" },
  { name: "WWF Indonesia", logo: "/images/partner-4.jpg", type: "Conservation Partner" },
]

const testimonials = [
  {
    quote: "SinergiLaut connected me with like-minded people who share my passion for ocean conservation. The beach cleanup events are incredibly well organized.",
    name: "Sarah Chen",
    role: "Volunteer, Jakarta",
    image: "/images/testimonial-1.jpg",
  },
  {
    quote: "As a corporate sponsor, we've seen firsthand the impact our donations make. The transparency and regular updates keep us engaged and committed.",
    name: "Michael Hartanto",
    role: "CSR Director, PT Ocean Corp",
    image: "/images/testimonial-2.jpg",
  },
  {
    quote: "The education workshops have transformed how our local fishing community thinks about sustainable practices. Real change is happening.",
    name: "Pak Budi",
    role: "Community Leader, Makassar",
    image: "/images/testimonial-3.jpg",
  },
]

const upcomingEvents = [
  { title: "Global Ocean Day Celebration", date: "June 8, 2026", location: "Multiple Locations" },
  { title: "Annual Volunteer Summit", date: "July 15, 2026", location: "Bali, Indonesia" },
  { title: "Coral Restoration Workshop", date: "August 20, 2026", location: "Raja Ampat" },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/community-hero.jpg"
              alt="Marine conservation community"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-foreground/70" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
              Join Our Global Conservation Community
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Connect with passionate individuals, organizations, and communities dedicated to protecting our oceans. Together, we're making waves of change.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/register">
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white" asChild>
                <Link href="#partners">View Partners</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-12 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {communityStats.map((stat) => (
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

        {/* How to Get Involved */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Ways to Get Involved
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                There are many ways to contribute to our mission. Find the path that suits you best.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Become a Volunteer</h3>
                  <p className="text-muted-foreground mb-6">
                    Join our activities, meet like-minded people, and make a direct impact on ocean conservation.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/activities">View Activities</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow border-primary border-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Support as Donor</h3>
                  <p className="text-muted-foreground mb-6">
                    Your financial contribution directly funds conservation projects and community programs.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/donate">Donate Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Corporate Partnership</h3>
                  <p className="text-muted-foreground mb-6">
                    Partner with us to demonstrate your organization's commitment to sustainability.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="#partners">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-28 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Voices from Our Community
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from the people who make our conservation efforts possible.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-background">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div className="h-px bg-border flex-1" />
                    </div>
                    <p className="text-muted-foreground italic mb-6 leading-relaxed">
                      {`"${testimonial.quote}"`}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Organizations */}
        <section id="partners" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Our Partner Organizations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We collaborate with leading organizations worldwide to maximize our conservation impact.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {partnerOrganizations.map((partner) => (
                <Card key={partner.name} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-secondary">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{partner.type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Interested in becoming a partner?</p>
              <Button size="lg" asChild>
                <Link href="/register">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 lg:py-28 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground text-balance">
                Upcoming Community Events
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Join us at these upcoming events and be part of the movement.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="bg-primary-foreground/10 border-primary-foreground/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-primary-foreground mb-2">{event.title}</h3>
                    <div className="space-y-1 text-sm text-primary-foreground/80">
                      <p>{event.date}</p>
                      <p>{event.location}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="mt-4" asChild>
                      <Link href="/activities">Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
