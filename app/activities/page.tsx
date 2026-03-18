"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Filter,
  ChevronDown,
  Leaf,
  Heart,
  GraduationCap,
  Anchor
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const activities = [
  {
    id: 1,
    title: "Coastal Beach Cleanup - Jakarta Bay",
    description: "Join our weekly beach cleanup initiative to remove plastic waste and debris from Jakarta Bay's coastline.",
    image: "/images/beach-cleanup.jpg",
    date: "March 22, 2026",
    location: "Jakarta Bay, Indonesia",
    type: "cleanup",
    volunteers: 45,
    slots: 60,
    icon: Leaf,
  },
  {
    id: 2,
    title: "Coral Reef Restoration - Raja Ampat",
    description: "Participate in our coral planting program to restore damaged reef ecosystems in Raja Ampat.",
    image: "/images/coral-restoration.jpg",
    date: "April 15-20, 2026",
    location: "Raja Ampat, Indonesia",
    type: "restoration",
    volunteers: 28,
    slots: 30,
    icon: Heart,
  },
  {
    id: 3,
    title: "Marine Biology Workshop for Schools",
    description: "Educational workshop teaching students about marine ecosystems and conservation practices.",
    image: "/images/education-workshop.jpg",
    date: "March 25, 2026",
    location: "Online Event",
    type: "education",
    volunteers: 120,
    slots: 200,
    icon: GraduationCap,
  },
  {
    id: 4,
    title: "Mangrove Planting Day",
    description: "Help plant mangrove seedlings to protect coastal areas and provide marine habitats.",
    image: "/images/mangrove-planting.jpg",
    date: "April 5, 2026",
    location: "Surabaya, Indonesia",
    type: "restoration",
    volunteers: 67,
    slots: 100,
    icon: Leaf,
  },
  {
    id: 5,
    title: "Ocean Photography Exhibition",
    description: "Community event showcasing underwater photography to raise awareness about marine conservation.",
    image: "/images/ocean-photography.jpg",
    date: "April 10-12, 2026",
    location: "Bali, Indonesia",
    type: "event",
    volunteers: 25,
    slots: 50,
    icon: Anchor,
  },
  {
    id: 6,
    title: "Sustainable Fishing Workshop",
    description: "Training local fishermen on sustainable fishing practices to protect marine biodiversity.",
    image: "/images/fishing-workshop.jpg",
    date: "March 28, 2026",
    location: "Makassar, Indonesia",
    type: "education",
    volunteers: 35,
    slots: 40,
    icon: GraduationCap,
  },
]

const locations = ["All Locations", "Jakarta", "Raja Ampat", "Bali", "Surabaya", "Makassar", "Online"]
const activityTypes = ["All Types", "Cleanup", "Restoration", "Education", "Event"]

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedType, setSelectedType] = useState("All Types")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = selectedLocation === "All Locations" || 
                          activity.location.toLowerCase().includes(selectedLocation.toLowerCase())
    const matchesType = selectedType === "All Types" || 
                       activity.type === selectedType.toLowerCase()
    return matchesSearch && matchesLocation && matchesType
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="bg-secondary py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Conservation Activities
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Find volunteer opportunities that match your interests and make a real impact on ocean conservation.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mt-10 flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background"
                />
              </div>
              
              <div className="flex gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-12 min-w-[160px] justify-between bg-background">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedLocation}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    {locations.map((location) => (
                      <DropdownMenuItem 
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                      >
                        {location}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-12 min-w-[140px] justify-between bg-background">
                      <span className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {selectedType}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[140px]">
                    {activityTypes.map((type) => (
                      <DropdownMenuItem 
                        key={type}
                        onClick={() => setSelectedType(type)}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredActivities.length}</span> activities
              </p>
            </div>

            {filteredActivities.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredActivities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={activity.image}
                        alt={activity.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium capitalize">
                          {activity.type}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <activity.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground leading-tight">{activity.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>{activity.volunteers} / {activity.slots} volunteers</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(activity.volunteers / activity.slots) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.slots - activity.volunteers} slots remaining
                        </p>
                      </div>

                      <Button className="w-full" asChild>
                        <Link href={`/register?activity=${activity.id}`}>Join as Volunteer</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No activities found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
              {"Can't find what you're looking for?"}
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Contact us to propose a new conservation activity or get personalized recommendations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/community">Join Our Community</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                <Link href="/donate">Support with Donation</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
