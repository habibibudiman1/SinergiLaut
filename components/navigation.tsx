"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Menu, X, Bell, ChevronDown, LogOut, User, LayoutDashboard, Settings, Shield, Building2 } from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/lib/utils/helpers"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"

const publicNavLinks = [
  { href: "/activities", label: "Kegiatan" },
  { href: "/community", label: "Komunitas" },
  { href: "/endowment", label: "Dana Abadi" },
  { href: "/about", label: "Tentang" },
]

const userNavLinks = [
  { href: "/activities", label: "Kegiatan" },
  { href: "/community", label: "Komunitas" },
  { href: "/endowment", label: "Dana Abadi" },
  { href: "/user/dashboard", label: "Dashboard" },
]

const communityNavLinks = [
  { href: "/activities", label: "Kegiatan" },
  { href: "/endowment", label: "Dana Abadi" },
  { href: "/community/dashboard", label: "Dashboard Komunitas" },
]

const adminNavLinks = [
  { href: "/admin/dashboard", label: "Dashboard Admin" },
  { href: "/admin/communities", label: "Komunitas" },
  { href: "/admin/activities", label: "Kegiatan" },
  { href: "/admin/reports", label: "Laporan" },
  { href: "/endowment", label: "Dana Abadi" },
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, profile, role, signOut, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const navLinks = !user || !role
    ? publicNavLinks
    : role === "admin"
    ? adminNavLinks
    : role === "community"
    ? communityNavLinks
    : userNavLinks

  const getDashboardLink = () => {
    if (role === "admin") return "/admin/dashboard"
    if (role === "community") return "/community/dashboard"
    return "/user/dashboard"
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success("Berhasil keluar.")
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image src="/images/SinergiLautLogo-transparent.png" alt="SinergiLaut Logo" width={32} height={32} className="h-8 w-auto" />
              <span className="text-xl font-bold text-foreground">SinergiLaut</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-none">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + "/"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-semibold transition-all relative ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[26px] left-0 right-0 h-1 bg-primary rounded-t-lg mx-auto w-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center justify-end gap-3 flex-1">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : user && profile ? (
              <>
                {/* Notification bell */}
                <Button variant="ghost" size="sm" className="relative" asChild>
                  <Link href={getDashboardLink()}>
                    <Bell className="h-4 w-4" />
                  </Link>
                </Button>

                {/* Role Badge */}
                {role === "admin" && (
                  <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3" /> Admin
                  </span>
                )}
                {role === "community" && (
                  <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    <Building2 className="h-3 w-3" /> Komunitas
                  </span>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {getInitials(profile.full_name || profile.email)}
                      </div>
                      <span className="text-sm font-medium max-w-[100px] truncate">
                        {profile.full_name || profile.email.split("@")[0]}
                      </span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>
                        <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={role === "community" ? "/community/dashboard" : "/user/profile"}>
                        <User className="h-4 w-4 mr-2" /> Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" /> Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + "/"));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base font-semibold px-2 py-2 rounded-md transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user && profile ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {getInitials(profile.full_name || profile.email)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{profile.full_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{role}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link href={getDashboardLink()}>Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="w-full text-destructive" onClick={() => { handleSignOut(); setIsMenuOpen(false) }}>
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link href="/login">Masuk</Link>
                    </Button>
                    <Button asChild onClick={() => setIsMenuOpen(false)}>
                      <Link href="/register">Daftar</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
