"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { 
  Check, 
  Users, 
  Heart, 
  ArrowRight, 
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  Waves
} from "lucide-react"

type Role = "volunteer" | "donor" | null
type Step = 1 | 2 | 3

const activities = [
  { id: 1, name: "Coastal Beach Cleanup - Jakarta Bay", date: "March 22, 2026" },
  { id: 2, name: "Coral Reef Restoration - Raja Ampat", date: "April 15-20, 2026" },
  { id: 3, name: "Marine Biology Workshop for Schools", date: "March 25, 2026" },
  { id: 4, name: "Mangrove Planting Day", date: "April 5, 2026" },
]

function RegisterContent() {
  const searchParams = useSearchParams()
  const activityParam = searchParams.get("activity")
  
  const [role, setRole] = useState<Role>(null)
  const [step, setStep] = useState<Step>(1)
  const [isLogin, setIsLogin] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(activityParam || "")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    organization: "",
    donationAmount: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole)
    setStep(2)
  }

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as Step)
  }

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step)
    if (step === 2) setRole(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    alert(`Registration successful! Welcome to SinergiLaut as a ${role}.`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16 bg-secondary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Waves className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold text-foreground">SinergiLaut</span>
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background text-muted-foreground border border-border"
                }`}>
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full transition-colors ${
                    step > s ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex items-center justify-center gap-2 mb-8 text-xs sm:text-sm text-muted-foreground">
            <span className={step === 1 ? "text-foreground font-medium" : ""}>
              {isLogin ? "Login" : "Sign Up"}
            </span>
            <span className="text-border">|</span>
            <span className={step === 2 ? "text-foreground font-medium" : ""}>
              Select {role === "donor" ? "Donation" : "Activity"}
            </span>
            <span className="text-border">|</span>
            <span className={step === 3 ? "text-foreground font-medium" : ""}>
              Complete
            </span>
          </div>

          {/* Step 1: Role Selection or Login/Signup */}
          {step === 1 && !role && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Join SinergiLaut</CardTitle>
                <CardDescription>
                  Choose how you'd like to contribute to ocean conservation
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect("volunteer")}
                  className="group p-6 rounded-xl border-2 border-border hover:border-primary bg-background transition-all text-left"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Become a Volunteer</h3>
                  <p className="text-sm text-muted-foreground">
                    Join activities, clean beaches, restore coral reefs, and educate communities.
                  </p>
                </button>
                <button
                  onClick={() => handleRoleSelect("donor")}
                  className="group p-6 rounded-xl border-2 border-border hover:border-accent bg-background transition-all text-left"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Become a Donor</h3>
                  <p className="text-sm text-muted-foreground">
                    Support conservation projects financially and track your impact.
                  </p>
                </button>
              </CardContent>
            </Card>
          )}

          {/* Step 1 with Role: Login/Signup Form */}
          {step === 1 && role && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {isLogin ? "Welcome Back" : "Create Your Account"}
                </CardTitle>
                <CardDescription>
                  {isLogin 
                    ? "Sign in to access your account" 
                    : `Register as a ${role} to get started`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-6">
                    {isLogin ? "Sign In" : "Continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  <span className="text-muted-foreground">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                  </span>
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </button>
                </div>
                <div className="mt-4">
                  <Button variant="ghost" onClick={() => setRole(null)} className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Change Role
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Activity or Donation */}
          {step === 2 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {role === "donor" ? "Choose Your Donation" : "Select an Activity"}
                </CardTitle>
                <CardDescription>
                  {role === "donor" 
                    ? "Your contribution helps protect our oceans"
                    : "Pick an activity to volunteer for"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {role === "volunteer" ? (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <button
                        key={activity.id}
                        onClick={() => setSelectedActivity(activity.id.toString())}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedActivity === activity.id.toString()
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{activity.name}</p>
                            <p className="text-sm text-muted-foreground">{activity.date}</p>
                          </div>
                          {selectedActivity === activity.id.toString() && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {["25", "50", "100"].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setFormData({ ...formData, donationAmount: amount })}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            formData.donationAmount === amount
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                          }`}
                        >
                          <span className="text-lg font-semibold text-foreground">${amount}</span>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Or enter custom amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="customAmount"
                          name="donationAmount"
                          type="number"
                          placeholder="Enter amount"
                          value={formData.donationAmount}
                          onChange={handleInputChange}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    className="flex-1"
                    disabled={role === "volunteer" ? !selectedActivity : !formData.donationAmount}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Personal/Payment Info */}
          {step === 3 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {role === "donor" ? "Payment Information" : "Personal Information"}
                </CardTitle>
                <CardDescription>
                  {role === "donor" 
                    ? "Secure payment processing"
                    : "Complete your volunteer profile"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+62 812 3456 7890"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    {role === "donor" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization (Optional)</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="organization"
                              name="organization"
                              placeholder="Your company name"
                              value={formData.organization}
                              onChange={handleInputChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-secondary rounded-lg border border-border">
                          <p className="text-sm text-muted-foreground mb-2">Donation Amount</p>
                          <p className="text-2xl font-bold text-foreground">${formData.donationAmount}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Lock className="h-4 w-4" />
                          <span>Your payment is secured with SSL encryption</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      {role === "donor" ? "Complete Donation" : "Complete Registration"}
                      <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Help Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Need help? <Link href="#" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Waves className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
