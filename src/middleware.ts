import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If the request is for the root path
  if (request.nextUrl.pathname === '/') {
    // Redirect to /login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/',
} 