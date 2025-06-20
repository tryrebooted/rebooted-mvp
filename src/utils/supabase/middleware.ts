import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/auth/callback']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Don't redirect if user is on public routes
  if (isPublicRoute) {
    return supabaseResponse
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'auth_required')
    return NextResponse.redirect(url)
  }

  // For authenticated users, verify profile exists
  if (user && !isPublicRoute) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, username, user_type')
        .eq('id', user.id)
        .maybeSingle()
      
      // If profile doesn't exist but user is authenticated, 
      // redirect to callback to trigger profile creation
      if (!profile && !error) {
        console.log('User authenticated but no profile found, redirecting to callback')
        const url = request.nextUrl.clone()
        url.pathname = '/auth/callback'
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
      }
      
      if (error) {
        console.error('Error checking user profile:', error)
        // Continue with the request but log the error
      }
    } catch (error) {
      console.error('Unexpected error in middleware profile check:', error)
      // Continue with the request but log the error
    }
  }

  // If user is authenticated and on login page, redirect to dashboard
  if (user && pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/management-dashboard'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
} 