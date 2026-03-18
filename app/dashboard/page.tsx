"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { 
  Users, 
  Heart, 
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Bell,
  ChevronDown,
  Waves
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const monthlyData = [
  { month: "Oct", volunteers: 120, donations: 8500 },
  { month: "Nov", volunteers: 180, donations: 12000 },
  { month: "Dec", volunteers: 220, donations: 18500 },
  { month: "Jan", volunteers: 280, donations: 22000 },
  { month: "Feb", volunteers: 350, donations: 28000 },
  { month: "Mar", volunteers: 420, donations: 35000 },
]

const activityData = [
  { name: "Cleanup", value: 45 },
  { name: "Restoration", value: 30 },
  { name: "Education", value: 18 },
  { name: "Events", value: 7 },
]

const recentActivities = [
  { 
    id: 1, 
    name: "Beach Cleanup - Jakarta Bay", 
    date: "Mar 22, 2026",
    status: "active",
    volunteers: 45,
    maxVolunteers: 60,
  },
  { 
    id: 2, 
    name: "Coral Restoration - Raja Ampat", 
    date: "Apr 15-20, 2026",
    status: "pending",
    volunteers: 28,
    maxVolunteers: 30,
  },
  { 
    id: 3, 
    name: "Marine Workshop for Schools", 
    date: "Mar 25, 2026",
    status: "active",
    volunteers: 120,
    maxVolunteers: 200,
  },
  { 
    id: 4, 
    name: "Mangrove Planting Day", 
    date: "Apr 5, 2026",
    status: "pending",
    volunteers: 67,
    maxVolunteers: 100,
  },
]

const recentDonations = [
  { id: 1, name: "Sarah Johnson", amount: 100, date: "Mar 19, 2026", status: "completed" },
  { id: 2, name: "PT Ocean Corp", amount: 5000, date: "Mar 18, 2026", status: "pending" },
  { id: 3, name: "Michael Chen", amount: 50, date: "Mar 18, 2026", status: "completed" },
  { id: 4, name: "Emily Davis", amount: 25, date: "Mar 17, 2026", status: "completed" },
  { id: 5, name: "Green Solutions Ltd", amount: 2500, date: "Mar 16, 2026", status: "pending" },
]

const recentVolunteers = [
  { id: 1, name: "Ahmad Rizki", email: "ahmad@email.com", activity: "Beach Cleanup", date: "Mar 19, 2026", status: "approved" },
  { id: 2, name: "Lisa Wang", email: "lisa@email.com", activity: "Coral Restoration", date: "Mar 18, 2026", status: "pending" },
  { id: 3, name: "David Smith", email: "david@email.com", activity: "Marine Workshop", date: "Mar 18, 2026", status: "approved" },
  { id: 4, name: "Maria Santos", email: "maria@email.com", activity: "Mangrove Planting", date: "Mar 17, 2026", status: "pending" },
]

const stats = [
  { 
    title: "Total Volunteers", 
    value: "2,847", 
    change: "+12%", 
    changeType: "positive",
    icon: Users,
    color: "text-primary"
  },
  { 
    title: "Total Donations", 
    value: "$124,500", 
    change: "+23%", 
    changeType: "positive",
    icon: DollarSign,
    color: "text-accent"
  },
  { 
    title: "Active Activities", 
    value: "18", 
    change: "+3", 
    changeType: "positive",
    icon: Calendar,
    color: "text-chart-4"
  },
  { 
    title: "Engagement Rate", 
    value: "87%", 
    change: "+5%", 
    changeType: "positive",
    icon: TrendingUp,
    color: "text-chart-2"
  },
]

type TabType = "overview" | "activities" | "volunteers" | "donations"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      approved: "bg-green-100 text-green-700",
    }
    return styles[status as keyof typeof styles] || "bg-secondary text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Monitor and manage conservation activities</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Create Activity
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "activities", label: "Activities" },
              { id: "volunteers", label: "Volunteers" },
              { id: "donations", label: "Donations" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Volunteer Growth</CardTitle>
                    <CardDescription>Monthly volunteer registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData}>
                          <defs>
                            <linearGradient id="colorVolunteers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="volunteers" 
                            stroke="hsl(var(--primary))" 
                            fillOpacity={1} 
                            fill="url(#colorVolunteers)" 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Donation Trends</CardTitle>
                    <CardDescription>Monthly donation amounts ($)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Bar dataKey="donations" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity Lists */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Recent Activities</CardTitle>
                      <CardDescription>Latest conservation activities</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="#" onClick={() => setActiveTab("activities")}>View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{activity.name}</p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(activity.status)}`}>
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Recent Donations</CardTitle>
                      <CardDescription>Latest donation transactions</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="#" onClick={() => setActiveTab("donations")}>View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentDonations.slice(0, 3).map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{donation.name}</p>
                            <p className="text-xs text-muted-foreground">{donation.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-foreground">${donation.amount}</span>
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(donation.status)}`}>
                              {donation.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === "activities" && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Manage Activities</CardTitle>
                    <CardDescription>View and manage all conservation activities</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Activity</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Volunteers</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((activity) => (
                        <tr key={activity.id} className="border-b border-border last:border-0">
                          <td className="py-4 px-4">
                            <p className="font-medium text-foreground">{activity.name}</p>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{activity.date}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-secondary rounded-full h-2 overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${(activity.volunteers / activity.maxVolunteers) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {activity.volunteers}/{activity.maxVolunteers}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Check className="h-4 w-4 mr-2" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <X className="h-4 w-4 mr-2" /> Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Volunteers Tab */}
          {activeTab === "volunteers" && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Volunteer Registrations</CardTitle>
                    <CardDescription>Review and approve volunteer applications</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search volunteers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Activity</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentVolunteers.map((volunteer) => (
                        <tr key={volunteer.id} className="border-b border-border last:border-0">
                          <td className="py-4 px-4">
                            <p className="font-medium text-foreground">{volunteer.name}</p>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{volunteer.email}</td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{volunteer.activity}</td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{volunteer.date}</td>
                          <td className="py-4 px-4">
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(volunteer.status)}`}>
                              {volunteer.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {volunteer.status === "pending" ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" className="h-8">
                                  <Check className="h-4 w-4 mr-1" /> Approve
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" /> View
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Donations Tab */}
          {activeTab === "donations" && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Donation Management</CardTitle>
                    <CardDescription>Track and verify donation transactions</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search donations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Donor</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDonations.map((donation) => (
                        <tr key={donation.id} className="border-b border-border last:border-0">
                          <td className="py-4 px-4">
                            <p className="font-medium text-foreground">{donation.name}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-foreground">${donation.amount.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{donation.date}</td>
                          <td className="py-4 px-4">
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusBadge(donation.status)}`}>
                              {donation.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {donation.status === "pending" ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" className="h-8">
                                  <Check className="h-4 w-4 mr-1" /> Verify
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" /> View
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
