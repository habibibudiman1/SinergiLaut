"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Banknote, 
  Package, 
  Calendar, 
  MapPin, 
  Users,
  Check,
  Heart,
  CreditCard,
  Building,
  Wallet,
  Plus,
  Minus
} from "lucide-react"

const activitiesData: Record<string, {
  id: number
  title: string
  description: string
  image: string
  date: string
  location: string
  volunteers: number
  slots: number
  fundingGoal: number
  fundingRaised: number
  itemsNeeded: { name: string; quantity: number; donated: number; unitPrice: number }[]
  organizer: string
  category: string
}> = {
  "1": {
    id: 1,
    title: "Coastal Beach Cleanup - Jakarta Bay",
    description: "Join our weekly beach cleanup initiative to remove plastic waste and debris from Jakarta Bay's coastline. Your donations help provide equipment and resources for our volunteers.",
    image: "/images/beach-cleanup.jpg",
    date: "March 22, 2026",
    location: "Jakarta Bay, Indonesia",
    volunteers: 45,
    slots: 60,
    fundingGoal: 5000000,
    fundingRaised: 3500000,
    itemsNeeded: [
      { name: "Trash Bags (pack of 100)", quantity: 20, donated: 15, unitPrice: 75000 },
      { name: "Work Gloves (pairs)", quantity: 100, donated: 67, unitPrice: 25000 },
      { name: "Trash Pickers", quantity: 30, donated: 22, unitPrice: 85000 },
      { name: "First Aid Kits", quantity: 5, donated: 3, unitPrice: 150000 },
      { name: "Drinking Water (cartons)", quantity: 50, donated: 30, unitPrice: 45000 },
    ],
    organizer: "Jakarta Ocean Warriors",
    category: "Beach Cleanup",
  },
  "2": {
    id: 2,
    title: "Coral Reef Restoration - Raja Ampat",
    description: "Participate in our coral planting program to restore damaged reef ecosystems in Raja Ampat. Donations fund coral fragments, diving equipment, and expert marine biologists.",
    image: "/images/coral-restoration.jpg",
    date: "April 15-20, 2026",
    location: "Raja Ampat, Indonesia",
    volunteers: 28,
    slots: 30,
    fundingGoal: 25000000,
    fundingRaised: 18750000,
    itemsNeeded: [
      { name: "Coral Fragments", quantity: 500, donated: 380, unitPrice: 35000 },
      { name: "Diving Equipment Sets", quantity: 15, donated: 10, unitPrice: 2500000 },
      { name: "Underwater Cement (kg)", quantity: 100, donated: 75, unitPrice: 45000 },
      { name: "Marine Monitoring Cameras", quantity: 5, donated: 2, unitPrice: 3500000 },
      { name: "Boat Fuel (liters)", quantity: 200, donated: 120, unitPrice: 15000 },
    ],
    organizer: "Raja Ampat Marine Foundation",
    category: "Reef Restoration",
  },
  "3": {
    id: 3,
    title: "Marine Biology Workshop for Schools",
    description: "Educational workshop teaching students about marine ecosystems and conservation practices. Support our efforts to inspire the next generation of ocean protectors.",
    image: "/images/education-workshop.jpg",
    date: "March 25, 2026",
    location: "Online Event",
    volunteers: 120,
    slots: 200,
    fundingGoal: 3000000,
    fundingRaised: 2100000,
    itemsNeeded: [
      { name: "Educational Kits", quantity: 50, donated: 35, unitPrice: 125000 },
      { name: "Marine Specimen Samples", quantity: 20, donated: 12, unitPrice: 200000 },
      { name: "Student Microscopes", quantity: 10, donated: 6, unitPrice: 750000 },
      { name: "Printed Workbooks", quantity: 200, donated: 150, unitPrice: 25000 },
      { name: "Video Equipment", quantity: 2, donated: 1, unitPrice: 5000000 },
    ],
    organizer: "Ocean Education Network",
    category: "Education",
  },
  "4": {
    id: 4,
    title: "Mangrove Planting Day",
    description: "Help plant mangrove seedlings to protect coastal areas and provide marine habitats. Your support funds seedlings, tools, and community engagement programs.",
    image: "/images/mangrove-planting.jpg",
    date: "April 5, 2026",
    location: "Surabaya, Indonesia",
    volunteers: 67,
    slots: 100,
    fundingGoal: 8000000,
    fundingRaised: 4000000,
    itemsNeeded: [
      { name: "Mangrove Seedlings", quantity: 1000, donated: 450, unitPrice: 5000 },
      { name: "Planting Tools", quantity: 50, donated: 30, unitPrice: 75000 },
      { name: "Organic Fertilizer (kg)", quantity: 200, donated: 80, unitPrice: 15000 },
      { name: "Protective Barriers", quantity: 100, donated: 45, unitPrice: 25000 },
      { name: "Volunteer T-Shirts", quantity: 100, donated: 60, unitPrice: 50000 },
    ],
    organizer: "Surabaya Green Coast",
    category: "Restoration",
  },
  "5": {
    id: 5,
    title: "Ocean Photography Exhibition",
    description: "Community event showcasing underwater photography to raise awareness about marine conservation. Support helps with venue, printing, and educational materials.",
    image: "/images/ocean-photography.jpg",
    date: "April 10-12, 2026",
    location: "Bali, Indonesia",
    volunteers: 25,
    slots: 50,
    fundingGoal: 15000000,
    fundingRaised: 12000000,
    itemsNeeded: [
      { name: "Large Photo Frames", quantity: 30, donated: 25, unitPrice: 350000 },
      { name: "Display Stands", quantity: 15, donated: 12, unitPrice: 500000 },
      { name: "Brochures (packs of 100)", quantity: 100, donated: 80, unitPrice: 150000 },
      { name: "Event Banners", quantity: 10, donated: 8, unitPrice: 250000 },
      { name: "Audio Guide Devices", quantity: 20, donated: 15, unitPrice: 400000 },
    ],
    organizer: "Bali Marine Arts Collective",
    category: "Event",
  },
  "6": {
    id: 6,
    title: "Sustainable Fishing Workshop",
    description: "Training local fishermen on sustainable fishing practices to protect marine biodiversity. Donations fund equipment, training materials, and expert facilitators.",
    image: "/images/fishing-workshop.jpg",
    date: "March 28, 2026",
    location: "Makassar, Indonesia",
    volunteers: 35,
    slots: 40,
    fundingGoal: 10000000,
    fundingRaised: 6500000,
    itemsNeeded: [
      { name: "Sustainable Fishing Nets", quantity: 20, donated: 12, unitPrice: 450000 },
      { name: "Training Manuals", quantity: 100, donated: 65, unitPrice: 35000 },
      { name: "GPS Devices", quantity: 10, donated: 4, unitPrice: 1500000 },
      { name: "Safety Equipment Sets", quantity: 20, donated: 10, unitPrice: 350000 },
      { name: "Ice Boxes", quantity: 15, donated: 8, unitPrice: 250000 },
    ],
    organizer: "Makassar Fishermen Alliance",
    category: "Education",
  },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const suggestedAmounts = [50000, 100000, 250000, 500000, 1000000]

export default function ActivityDonatePage() {
  const params = useParams()
  const activityId = params.activityId as string
  const activity = activitiesData[activityId]

  const [donationType, setDonationType] = useState<"money" | "items">("money")
  const [customAmount, setCustomAmount] = useState("")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({})
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    anonymous: false,
  })
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Activity Not Found</h1>
            <Button asChild>
              <Link href="/activities">Back to Activities</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const fundingPercentage = Math.round((activity.fundingRaised / activity.fundingGoal) * 100)

  const updateItemQuantity = (itemName: string, delta: number) => {
    const item = activity.itemsNeeded.find((i) => i.name === itemName)
    if (!item) return
    
    const remaining = item.quantity - item.donated
    const current = selectedItems[itemName] || 0
    const newValue = Math.max(0, Math.min(remaining, current + delta))
    
    setSelectedItems((prev) => ({
      ...prev,
      [itemName]: newValue,
    }))
  }

  const totalItemsDonation = Object.entries(selectedItems).reduce((sum, [itemName, qty]) => {
    const item = activity.itemsNeeded.find((i) => i.name === itemName)
    return sum + (item ? item.unitPrice * qty : 0)
  }, 0)

  const totalDonation = donationType === "money" 
    ? (selectedAmount || Number(customAmount) || 0)
    : totalItemsDonation

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-16 flex items-center justify-center bg-secondary">
          <div className="max-w-lg mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Thank You for Your Donation!</h1>
            <p className="text-muted-foreground mb-6">
              Your generous contribution of {formatCurrency(totalDonation)} to <strong>{activity.title}</strong> will make a real difference in our conservation efforts.
            </p>
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Donation Type</span>
                    <span className="font-medium text-foreground capitalize">{donationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-foreground">{formatCurrency(totalDonation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium text-foreground capitalize">{paymentMethod}</span>
                  </div>
                  {donationType === "items" && Object.entries(selectedItems).filter(([, qty]) => qty > 0).length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium text-foreground mb-2">Items Donated:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {Object.entries(selectedItems)
                          .filter(([, qty]) => qty > 0)
                          .map(([itemName, qty]) => (
                            <li key={itemName}>{qty}x {itemName}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/activities">Explore More Activities</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/donate/${activityId}`} onClick={() => setIsSubmitted(false)}>
                  Make Another Donation
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Back Link */}
        <div className="bg-secondary py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/activities" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Activities
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Activity Info Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {activity.category}
                  </span>
                  <h2 className="text-lg font-semibold text-foreground mt-3 mb-2">{activity.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{activity.description}</p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
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

                  {/* Funding Progress */}
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">Funding Progress</span>
                    </div>
                    <div className="h-3 bg-background rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${fundingPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{formatCurrency(activity.fundingRaised)} raised</span>
                      <span className="font-semibold text-foreground">{fundingPercentage}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Goal: {formatCurrency(activity.fundingGoal)}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">Organized by</p>
                    <p className="text-sm font-medium text-foreground">{activity.organizer}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Donation Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Support This Activity</CardTitle>
                  <p className="text-muted-foreground">Choose how you would like to contribute</p>
                </CardHeader>
                <CardContent>
                  <Tabs value={donationType} onValueChange={(v) => setDonationType(v as "money" | "items")}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="money" className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Donate Money
                      </TabsTrigger>
                      <TabsTrigger value="items" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Donate Items
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="money" className="space-y-6">
                      {step === 1 && (
                        <>
                          <div>
                            <Label className="text-base font-medium">Select Amount</Label>
                            <p className="text-sm text-muted-foreground mb-4">Choose a suggested amount or enter a custom value</p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                              {suggestedAmounts.map((amount) => (
                                <Button
                                  key={amount}
                                  type="button"
                                  variant={selectedAmount === amount ? "default" : "outline"}
                                  className="h-12"
                                  onClick={() => {
                                    setSelectedAmount(amount)
                                    setCustomAmount("")
                                  }}
                                >
                                  {formatCurrency(amount).replace("Rp", "").trim()}
                                </Button>
                              ))}
                            </div>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                              <Input
                                type="number"
                                placeholder="Enter custom amount"
                                value={customAmount}
                                onChange={(e) => {
                                  setCustomAmount(e.target.value)
                                  setSelectedAmount(null)
                                }}
                                className="pl-10 h-12"
                              />
                            </div>
                          </div>

                          {(selectedAmount || customAmount) && (
                            <Button className="w-full h-12" onClick={() => setStep(2)}>
                              Continue with {formatCurrency(selectedAmount || Number(customAmount))}
                            </Button>
                          )}
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <div>
                            <Label className="text-base font-medium">Payment Method</Label>
                            <p className="text-sm text-muted-foreground mb-4">Select your preferred payment method</p>
                            <div className="grid sm:grid-cols-3 gap-3">
                              {[
                                { id: "card", label: "Credit Card", icon: CreditCard },
                                { id: "bank", label: "Bank Transfer", icon: Building },
                                { id: "ewallet", label: "E-Wallet", icon: Wallet },
                              ].map((method) => (
                                <Button
                                  key={method.id}
                                  type="button"
                                  variant={paymentMethod === method.id ? "default" : "outline"}
                                  className="h-16 flex-col gap-1"
                                  onClick={() => setPaymentMethod(method.id)}
                                >
                                  <method.icon className="h-5 w-5" />
                                  <span className="text-xs">{method.label}</span>
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                  id="name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  placeholder="Enter your name"
                                  className="mt-1.5"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                  placeholder="Enter your email"
                                  className="mt-1.5"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Enter your phone number"
                                className="mt-1.5"
                              />
                            </div>
                            <div>
                              <Label htmlFor="message">Message (Optional)</Label>
                              <Input
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Leave a message for the organizers"
                                className="mt-1.5"
                              />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.anonymous}
                                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                                className="rounded border-input"
                              />
                              <span className="text-sm text-muted-foreground">Make my donation anonymous</span>
                            </label>
                          </div>

                          <div className="p-4 bg-secondary rounded-lg">
                            <div className="flex justify-between mb-2">
                              <span className="text-muted-foreground">Donation Amount</span>
                              <span className="font-semibold text-foreground">{formatCurrency(totalDonation)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Payment Method</span>
                              <span className="text-foreground capitalize">{paymentMethod || "Not selected"}</span>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                              Back
                            </Button>
                            <Button 
                              className="flex-1" 
                              onClick={handleSubmit}
                              disabled={!paymentMethod || !formData.name || !formData.email}
                            >
                              Complete Donation
                            </Button>
                          </div>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="items" className="space-y-6">
                      {step === 1 && (
                        <>
                          <div>
                            <Label className="text-base font-medium">Items Needed for This Activity</Label>
                            <p className="text-sm text-muted-foreground mb-4">Select items you would like to donate</p>
                            
                            <div className="space-y-3">
                              {activity.itemsNeeded.map((item) => {
                                const remaining = item.quantity - item.donated
                                const selected = selectedItems[item.name] || 0
                                const progress = ((item.donated + selected) / item.quantity) * 100

                                return (
                                  <Card key={item.name} className="overflow-hidden">
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-foreground">{item.name}</h4>
                                          <p className="text-sm text-muted-foreground">
                                            {formatCurrency(item.unitPrice)} per unit
                                          </p>
                                          <div className="mt-2">
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                              <div 
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${Math.min(100, progress)}%` }}
                                              />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {item.donated + selected} / {item.quantity} ({remaining - selected} remaining)
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateItemQuantity(item.name, -1)}
                                            disabled={selected === 0}
                                          >
                                            <Minus className="h-4 w-4" />
                                          </Button>
                                          <span className="w-8 text-center font-medium">{selected}</span>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateItemQuantity(item.name, 1)}
                                            disabled={selected >= remaining}
                                          >
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              })}
                            </div>
                          </div>

                          {totalItemsDonation > 0 && (
                            <>
                              <div className="p-4 bg-secondary rounded-lg">
                                <h4 className="font-medium text-foreground mb-2">Your Item Donation</h4>
                                <ul className="space-y-1 text-sm mb-3">
                                  {Object.entries(selectedItems)
                                    .filter(([, qty]) => qty > 0)
                                    .map(([itemName, qty]) => {
                                      const item = activity.itemsNeeded.find((i) => i.name === itemName)
                                      return (
                                        <li key={itemName} className="flex justify-between text-muted-foreground">
                                          <span>{qty}x {itemName}</span>
                                          <span>{formatCurrency(item ? item.unitPrice * qty : 0)}</span>
                                        </li>
                                      )
                                    })}
                                </ul>
                                <div className="flex justify-between font-semibold text-foreground pt-2 border-t">
                                  <span>Total Value</span>
                                  <span>{formatCurrency(totalItemsDonation)}</span>
                                </div>
                              </div>

                              <Button className="w-full h-12" onClick={() => setStep(2)}>
                                Continue with Item Donation
                              </Button>
                            </>
                          )}
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <div>
                            <Label className="text-base font-medium">Payment for Items</Label>
                            <p className="text-sm text-muted-foreground mb-4">Your payment will be used to purchase these items for the activity</p>
                            <div className="grid sm:grid-cols-3 gap-3">
                              {[
                                { id: "card", label: "Credit Card", icon: CreditCard },
                                { id: "bank", label: "Bank Transfer", icon: Building },
                                { id: "ewallet", label: "E-Wallet", icon: Wallet },
                              ].map((method) => (
                                <Button
                                  key={method.id}
                                  type="button"
                                  variant={paymentMethod === method.id ? "default" : "outline"}
                                  className="h-16 flex-col gap-1"
                                  onClick={() => setPaymentMethod(method.id)}
                                >
                                  <method.icon className="h-5 w-5" />
                                  <span className="text-xs">{method.label}</span>
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name-items">Full Name</Label>
                                <Input
                                  id="name-items"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  placeholder="Enter your name"
                                  className="mt-1.5"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email-items">Email</Label>
                                <Input
                                  id="email-items"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                  placeholder="Enter your email"
                                  className="mt-1.5"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="phone-items">Phone Number</Label>
                              <Input
                                id="phone-items"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Enter your phone number"
                                className="mt-1.5"
                              />
                            </div>
                            <div>
                              <Label htmlFor="message-items">Message (Optional)</Label>
                              <Input
                                id="message-items"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Leave a message for the organizers"
                                className="mt-1.5"
                              />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.anonymous}
                                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                                className="rounded border-input"
                              />
                              <span className="text-sm text-muted-foreground">Make my donation anonymous</span>
                            </label>
                          </div>

                          <div className="p-4 bg-secondary rounded-lg">
                            <h4 className="font-medium text-foreground mb-2">Items to Donate</h4>
                            <ul className="space-y-1 text-sm mb-3">
                              {Object.entries(selectedItems)
                                .filter(([, qty]) => qty > 0)
                                .map(([itemName, qty]) => {
                                  const item = activity.itemsNeeded.find((i) => i.name === itemName)
                                  return (
                                    <li key={itemName} className="flex justify-between text-muted-foreground">
                                      <span>{qty}x {itemName}</span>
                                      <span>{formatCurrency(item ? item.unitPrice * qty : 0)}</span>
                                    </li>
                                  )
                                })}
                            </ul>
                            <div className="flex justify-between font-semibold text-foreground pt-2 border-t">
                              <span>Total</span>
                              <span>{formatCurrency(totalItemsDonation)}</span>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                              Back
                            </Button>
                            <Button 
                              className="flex-1" 
                              onClick={handleSubmit}
                              disabled={!paymentMethod || !formData.name || !formData.email}
                            >
                              Complete Donation
                            </Button>
                          </div>
                        </>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
