import { NextRequest, NextResponse } from 'next/server'
import { createServer } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/management-dashboard'

  if (code) {
    const supabase = await createServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to login with an error message if authentication failed
  return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`)
} 