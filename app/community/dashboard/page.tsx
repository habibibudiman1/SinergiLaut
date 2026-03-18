"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Activity,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  TrendingUp,
  Heart,
  Package,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  MoreHorizontal,
  ExternalLink,
  Download,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

// Mock data for the community
const communityData = {
  name: "Ocean Guardians Bali",
  logo: "/images/partner-1.jpg",
  verified: true,
  joinedDate: "January 2025",
  stats: {
    totalVolunteers: 450,
    totalDonations: 125000000,
    activeActivities: 5,
    completedActivities: 23,
  },
}

const monthlyStats = [
  { month: "Jan", volunteers: 45, donations: 12000000 },
  { month: "Feb", volunteers: 62, donations: 15000000 },
  { month: "Mar", volunteers: 78, donations: 18000000 },
  { month: "Apr", volunteers: 95, donations: 22000000 },
  { month: "May", volunteers: 110, donations: 28000000 },
  { month: "Jun", volunteers: 130, donations: 30000000 },
]

const activities = [
  {
    id: 1,
    title: "Kuta Beach Cleanup",
    date: "March 25, 2026",
    location: "Kuta Beach, Bali",
    status: "active",
    volunteers: { registered: 45, target: 50 },
    donations: { collected: 5500000, target: 8000000 },
    image: "/images/beach-cleanup.jpg",
  },
  {
    id: 2,
    title: "Coral Restoration Project",
    date: "April 10, 2026",
    location: "Nusa Dua, Bali",
    status: "active",
    volunteers: { registered: 28, target: 30 },
    donations: { collected: 12000000, target: 15000000 },
    image: "/images/coral-restoration.jpg",
  },
  {
    id: 3,
    title: "Marine Education Workshop",
    date: "April 20, 2026",
    location: "Sanur, Bali",
    status: "draft",
    volunteers: { registered: 0, target: 20 },
    donations: { collected: 0, target: 5000000 },
    image: "/images/education-workshop.jpg",
  },
  {
    id: 4,
    title: "Mangrove Planting Day",
    date: "February 15, 2026",
    location: "Benoa Bay, Bali",
    status: "completed",
    volunteers: { registered: 60, target: 50 },
    donations: { collected: 10000000, target: 8000000 },
    image: "/images/mangrove-planting.jpg",
  },
]

const recentVolunteers = [
  { id: 1, name: "Sarah Chen", email: "sarah@email.com", activity: "Kuta Beach Cleanup", date: "2 hours ago", avatar: "/images/testimonial-1.jpg" },
  { id: 2, name: "Michael Hartanto", email: "michael@email.com", activity: "Coral Restoration Project", date: "5 hours ago", avatar: "/images/testimonial-2.jpg" },
  { id: 3, name: "Dewi Putri", email: "dewi@email.com", activity: "Kuta Beach Cleanup", date: "1 day ago", avatar: "/images/testimonial-3.jpg" },
  { id: 4, name: "John Smith", email: "john@email.com", activity: "Coral Restoration Project", date: "2 days ago", avatar: "/images/testimonial-1.jpg" },
]

const recentDonations = [
  { id: 1, donor: "PT Ocean Corp", amount: 5000000, activity: "Coral Restoration Project", date: "1 hour ago", type: "money" },
  { id: 2, name: "Anonymous", amount: 500000, activity: "Kuta Beach Cleanup", date: "3 hours ago", type: "money" },
  { id: 3, donor: "Sarah Chen", amount: 0, activity: "Kuta Beach Cleanup", date: "5 hours ago", type: "items", items: "50 Trash Bags" },
  { id: 4, donor: "Green Earth Foundation", amount: 10000000, activity: "Coral Restoration Project", date: "1 day ago", type: "money" },
]

const notifications = [
  { id: 1, message: "New volunteer registered for Kuta Beach Cleanup", time: "2 hours ago", read: false },
  { id: 2, message: "Donation received: Rp 5,000,000 for Coral Restoration", time: "3 hours ago", read: false },
  { id: 3, message: "Your activity 'Mangrove Planting Day' was completed", time: "1 day ago", read: true },
  { id: 4, message: "Monthly report is ready for download", time: "2 days ago", read: true },
]

export default function CommunityDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showCreateActivity, setShowCreateActivity] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navigation />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-background border-2 border-primary">
                <Image
                  src={communityData.logo}
                  alt={communityData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{communityData.name}</h1>
                  {communityData.verified && (
                    <Badge className="bg-primary/10 text-primary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">Community Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="/community/dashboard/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Dialog open={showCreateActivity} onOpenChange={setShowCreateActivity}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Activity</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new conservation activity.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Activity Title</label>
                      <Input placeholder="e.g., Beach Cleanup at Kuta" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea placeholder="Describe your activity..." rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Time</label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <Input placeholder="e.g., Kuta Beach, Bali" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Target Volunteers</label>
                        <Input type="number" placeholder="50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Donation Target (IDR)</label>
                        <Input type="number" placeholder="10000000" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Activity Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beach-cleanup">Beach Cleanup</SelectItem>
                          <SelectItem value="coral-restoration">Coral Restoration</SelectItem>
                          <SelectItem value="mangrove-planting">Mangrove Planting</SelectItem>
                          <SelectItem value="education">Marine Education</SelectItem>
                          <SelectItem value="research">Research & Monitoring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Cover Image</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowCreateActivity(false)}>
                      Cancel
                    </Button>
                    <Button variant="outline">Save as Draft</Button>
                    <Button>Publish Activity</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volunteers</p>
                    <p className="text-2xl font-bold text-foreground">{communityData.stats.totalVolunteers}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +18% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Donations</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(communityData.stats.totalDonations)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +24% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Activities</p>
                    <p className="text-2xl font-bold text-foreground">{communityData.stats.activeActivities}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {communityData.stats.completedActivities} completed total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Items Received</p>
                    <p className="text-2xl font-bold text-foreground">156</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  From 42 donors
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Charts */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Volunteer Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
                            <YAxis className="text-muted-foreground" fontSize={12} />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="volunteers"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={{ fill: "hsl(var(--primary))" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
                            <YAxis
                              className="text-muted-foreground"
                              fontSize={12}
                              tickFormatter={(value) => `${value / 1000000}M`}
                            />
                            <Tooltip
                              formatter={(value: number) => formatCurrency(value)}
                            />
                            <Bar
                              dataKey="donations"
                              fill="hsl(var(--accent))"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Notifications */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Notifications</CardTitle>
                      <Button variant="ghost" size="sm">View all</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {notifications.slice(0, 3).map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            notif.read ? "bg-background" : "bg-primary/5"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 ${notif.read ? "bg-muted" : "bg-primary"}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-between" asChild>
                        <Link href="/community/1">
                          View Public Profile
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-between">
                        Download Report
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="w-full justify-between" asChild>
                        <Link href="/community/dashboard/settings">
                          Edit Community Info
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Your Activities</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setShowCreateActivity(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Activity
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="relative w-full sm:w-24 h-32 sm:h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                          <Image
                            src={activity.image}
                            alt={activity.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground truncate">{activity.title}</h4>
                            <Badge
                              variant={
                                activity.status === "active"
                                  ? "default"
                                  : activity.status === "draft"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {activity.status}
                            </Badge>
                          </div>
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
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {activity.volunteers.registered}/{activity.volunteers.target} volunteers
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(activity.donations.collected)} / {formatCurrency(activity.donations.target)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <Eye className="h-4 w-4 sm:mr-2" />
                            <span className="sm:inline">View</span>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <Edit className="h-4 w-4 sm:mr-2" />
                            <span className="sm:inline">Edit</span>
                          </Button>
                          <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="volunteers">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Registered Volunteers</CardTitle>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Volunteer</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Activity</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Registered</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentVolunteers.map((volunteer) => (
                          <tr key={volunteer.id} className="border-b border-border last:border-0">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-secondary">
                                  <Image
                                    src={volunteer.avatar}
                                    alt={volunteer.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{volunteer.name}</p>
                                  <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground">{volunteer.activity}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{volunteer.date}</td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Donations</CardTitle>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Donor</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount/Items</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Activity</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentDonations.map((donation) => (
                          <tr key={donation.id} className="border-b border-border last:border-0">
                            <td className="py-3 px-4">
                              <p className="font-medium text-foreground">{donation.donor}</p>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={donation.type === "money" ? "default" : "secondary"}>
                                {donation.type === "money" ? "Money" : "Items"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground">
                              {donation.type === "money" ? formatCurrency(donation.amount) : donation.items}
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground">{donation.activity}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{donation.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
