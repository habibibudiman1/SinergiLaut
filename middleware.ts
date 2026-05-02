import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// ──────────────────────────────────────────────────────────────────────────────
// Rate limiting store (in-memory — ganti dengan Upstash Redis di production)
// ──────────────────────────────────────────────────────────────────────────────
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, maxAttempts = 10, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || record.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (record.count >= maxAttempts) return false // blocked

  record.count++
  return true
}

// ──────────────────────────────────────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Rate limit: endpoint login
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown'

    if (!checkRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900',
          },
        }
      )
    }
  }

  // 2. Supabase session refresh (required for SSR auth)
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — keeps user signed in across tab navigations
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Protect admin routes
  if (pathname.startsWith('/admin') || pathname === '/dashboard') {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirectedFrom=' + pathname, request.url))
    }
    // Role check via user_metadata (set during signup)
    const role = user.user_metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/user/dashboard', request.url))
    }
  }

  // 4. Protect community routes
  if (pathname.startsWith('/community/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirectedFrom=' + pathname, request.url))
    }
    const role = user.user_metadata?.role
    if (role !== 'community' && role !== 'admin') {
      return NextResponse.redirect(new URL('/user/dashboard', request.url))
    }
  }

  // 5. Protect user-only routes
  if (pathname.startsWith('/user/')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirectedFrom=' + pathname, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    // Apply to all routes except static files, images, and _next internals
    '/((?!_next/static|_next/image|favicon.ico|images/|icons/).*)',
  ],
}
