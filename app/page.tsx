import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Users, Heart, Leaf, Calendar, MapPin } from "lucide-react"

const featuredActivities = [
  {
    id: 1,
    title: "Beach Cleanup Drive",
    description: "Join local volunteers to clean coastal areas and protect marine life from plastic pollution.",
    image: "/images/beach-cleanup.jpg",
    date: "Every Saturday",
    location: "Multiple Locations",
    volunteers: 245,
    icon: Leaf,
  },
  {
    id: 2,
    title: "Coral Restoration Project",
    description: "Help restore damaged coral reefs through our scientific coral planting program.",
    image: "/images/coral-restoration.jpg",
    date: "April 15-20, 2026",
    location: "Raja Ampat",
    volunteers: 48,
    icon: Heart,
  },
  {
    id: 3,
    title: "Marine Education Workshop",
    description: "Educational events for communities to learn about ocean conservation and sustainable practices.",
    image: "/images/education-workshop.jpg",
    date: "Monthly Events",
    location: "Online & In-Person",
    volunteers: 312,
    icon: Users,
  },
]

const stats = [
  { value: "15,000+", label: "Volunteers" },
  { value: "250+", label: "Activities" },
  { value: "50+", label: "Coastal Areas Protected" },
  { value: "$2.5M", label: "Funds Raised" },
]

export default function HomePage() {
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
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base" asChild>
                <Link href="/activities">
                  Find Volunteer Opportunities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white" asChild>
                <Link href="/donate">Make a Donation</Link>
              </Button>
            </div>
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

        {/* Featured Activities Section */}
        <section className="py-20 lg:py-28">
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
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
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
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link href="/donate">Support Our Mission</Link>
                  </Button>
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

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Ready to Make a Difference?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you want to volunteer your time or support through donations, every action counts in protecting our oceans.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Join as Volunteer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/donate">Become a Donor</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
