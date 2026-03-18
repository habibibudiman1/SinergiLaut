"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  Heart,
  Activity,
  ArrowRight,
  Share2,
} from "lucide-react"

// Mock data - in real app this would come from database
const communitiesData: Record<string, {
  id: number
  name: string
  logo: string
  coverImage: string
  location: string
  description: string
  longDescription: string
  verified: boolean
  members: number
  totalActivities: number
  totalDonationsReceived: number
  joinedDate: string
  focus: string[]
  socialLinks: {
    website?: string
    instagram?: string
    facebook?: string
    twitter?: string
    email: string
    phone: string
  }
  activities: {
    id: number
    title: string
    date: string
    location: string
    image: string
    volunteers: { registered: number; target: number }
    donations: { collected: number; target: number }
    status: string
  }[]
  gallery: string[]
}> = {
  "1": {
    id: 1,
    name: "Ocean Guardians Bali",
    logo: "/images/partner-1.jpg",
    coverImage: "/images/community-hero.jpg",
    location: "Bali, Indonesia",
    description: "Dedicated to protecting Bali's coastline through community-driven conservation efforts.",
    longDescription: "Ocean Guardians Bali is a community-driven organization founded in 2020 with a mission to protect and restore the marine ecosystems of Bali. Through regular beach cleanups, coral restoration projects, and marine education programs, we engage local communities, tourists, and businesses in meaningful conservation work. Our efforts have resulted in the removal of over 50 tons of plastic from Bali's beaches and the successful planting of 10,000 coral fragments.",
    verified: true,
    members: 450,
    totalActivities: 28,
    totalDonationsReceived: 125000000,
    joinedDate: "January 2025",
    focus: ["Beach Cleanup", "Coral Restoration", "Marine Education"],
    socialLinks: {
      website: "https://oceanguardiansbali.org",
      instagram: "@oceanguardiansbali",
      facebook: "OceanGuardiansBali",
      twitter: "@ogbali",
      email: "contact@oceanguardiansbali.org",
      phone: "+62 812 3456 7890",
    },
    activities: [
      {
        id: 1,
        title: "Kuta Beach Cleanup",
        date: "March 25, 2026",
        location: "Kuta Beach, Bali",
        image: "/images/beach-cleanup.jpg",
        volunteers: { registered: 45, target: 50 },
        donations: { collected: 5500000, target: 8000000 },
        status: "active",
      },
      {
        id: 2,
        title: "Coral Restoration Project",
        date: "April 10, 2026",
        location: "Nusa Dua, Bali",
        image: "/images/coral-restoration.jpg",
        volunteers: { registered: 28, target: 30 },
        donations: { collected: 12000000, target: 15000000 },
        status: "active",
      },
      {
        id: 3,
        title: "Marine Education Workshop",
        date: "April 20, 2026",
        location: "Sanur, Bali",
        image: "/images/education-workshop.jpg",
        volunteers: { registered: 12, target: 20 },
        donations: { collected: 2000000, target: 5000000 },
        status: "active",
      },
    ],
    gallery: [
      "/images/beach-cleanup.jpg",
      "/images/coral-restoration.jpg",
      "/images/mangrove-planting.jpg",
      "/images/education-workshop.jpg",
    ],
  },
}

// Default community data for other IDs
const defaultCommunity = {
  id: 2,
  name: "Blue Marine Jakarta",
  logo: "/images/partner-2.jpg",
  coverImage: "/images/hero-ocean.jpg",
  location: "Jakarta, Indonesia",
  description: "Urban marine conservation focusing on education and coastal cleanup in Jakarta Bay.",
  longDescription: "Blue Marine Jakarta is an urban conservation initiative dedicated to protecting Jakarta Bay and its surrounding marine ecosystems. Founded by a group of passionate environmentalists, we focus on community education, coastal cleanup, and advocacy for sustainable urban development. Our programs reach thousands of Jakarta residents annually through school programs, corporate partnerships, and public awareness campaigns.",
  verified: true,
  members: 320,
  totalActivities: 15,
  totalDonationsReceived: 85000000,
  joinedDate: "March 2025",
  focus: ["Marine Education", "Beach Cleanup", "Community Outreach"],
  socialLinks: {
    website: "https://bluemarinejakarta.org",
    instagram: "@bluemarinejakarta",
    email: "info@bluemarinejakarta.org",
    phone: "+62 821 9876 5432",
  },
  activities: [
    {
      id: 1,
      title: "Jakarta Bay Cleanup",
      date: "March 30, 2026",
      location: "Ancol Beach, Jakarta",
      image: "/images/beach-cleanup.jpg",
      volunteers: { registered: 35, target: 40 },
      donations: { collected: 4000000, target: 6000000 },
      status: "active",
    },
  ],
  gallery: [
    "/images/beach-cleanup.jpg",
    "/images/education-workshop.jpg",
  ],
}

export default function CommunityProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const community = communitiesData[id] || { ...defaultCommunity, id: parseInt(id) }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Cover Image */}
        <section className="relative h-64 md:h-80">
          <Image
            src={community.coverImage}
            alt={community.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </section>

        {/* Profile Header */}
        <section className="relative -mt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-background border-4 border-background shadow-xl">
                <Image
                  src={community.logo}
                  alt={community.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{community.name}</h1>
                  {community.verified && (
                    <Badge className="bg-primary/10 text-primary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{community.location}</span>
                  <span className="text-muted-foreground/50">|</span>
                  <span>Joined {community.joinedDate}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {community.focus.map((f) => (
                    <Badge key={f} variant="secondary">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button asChild>
                  <Link href={`/activities?community=${community.id}`}>
                    View Activities
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-6 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{community.members}</span>
                </div>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{community.totalActivities}</span>
                </div>
                <p className="text-sm text-muted-foreground">Activities</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Heart className="h-5 w-5 text-accent" />
                  <span className="text-2xl font-bold text-foreground">
                    {formatCurrency(community.totalDonationsReceived)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Donations Received</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    {community.activities.filter((a) => a.status === "active").length}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Active Activities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - About & Contact */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">About</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {community.longDescription}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Contact</h2>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${community.socialLinks.email}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{community.socialLinks.email}</span>
                      </a>
                      <a
                        href={`tel:${community.socialLinks.phone}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{community.socialLinks.phone}</span>
                      </a>
                      {community.socialLinks.website && (
                        <a
                          href={community.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">{community.socialLinks.website}</span>
                        </a>
                      )}
                    </div>

                    {(community.socialLinks.instagram || community.socialLinks.facebook || community.socialLinks.twitter) && (
                      <>
                        <div className="border-t border-border my-4" />
                        <div className="flex items-center gap-3">
                          {community.socialLinks.instagram && (
                            <a
                              href={`https://instagram.com/${community.socialLinks.instagram.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                            >
                              <Instagram className="h-5 w-5" />
                            </a>
                          )}
                          {community.socialLinks.facebook && (
                            <a
                              href={`https://facebook.com/${community.socialLinks.facebook}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                            >
                              <Facebook className="h-5 w-5" />
                            </a>
                          )}
                          {community.socialLinks.twitter && (
                            <a
                              href={`https://twitter.com/${community.socialLinks.twitter.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                            >
                              <Twitter className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Gallery */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {community.gallery.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Activities */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Active Activities</h2>
                  <Button variant="outline" asChild>
                    <Link href={`/activities?community=${community.id}`}>View All</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {community.activities.map((activity) => (
                    <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
                            <Image
                              src={activity.image}
                              alt={activity.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-foreground mb-1">{activity.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {activity.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {activity.location}
                                  </span>
                                </div>
                              </div>
                              <Badge>{activity.status}</Badge>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">Volunteers</span>
                                  <span className="font-medium text-foreground">
                                    {activity.volunteers.registered}/{activity.volunteers.target}
                                  </span>
                                </div>
                                <Progress
                                  value={(activity.volunteers.registered / activity.volunteers.target) * 100}
                                  className="h-2"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">Donations</span>
                                  <span className="font-medium text-foreground">
                                    {formatCurrency(activity.donations.collected)} / {formatCurrency(activity.donations.target)}
                                  </span>
                                </div>
                                <Progress
                                  value={(activity.donations.collected / activity.donations.target) * 100}
                                  className="h-2"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                              <Button size="sm" asChild>
                                <Link href={`/register?activity=${activity.id}`}>
                                  Join as Volunteer
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/donate/${activity.id}`}>
                                  <Heart className="h-4 w-4 mr-2" />
                                  Donate
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {community.activities.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No active activities</h3>
                      <p className="text-muted-foreground">
                        This community doesn&apos;t have any active activities at the moment.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
