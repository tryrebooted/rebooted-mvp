import { NextRequest, NextResponse } from 'next/server'
import { createServer } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/management-dashboard'

  if (code) {
    const supabase = await createServer()
    
    try {
      // Exchange code for session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Session exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/login?error=auth_failed`)
      }

      // Get the authenticated user with retry logic
      let user = null
      let userError = null
      
      // Retry getting user up to 3 times to handle timing issues
      for (let i = 0; i < 3; i++) {
        const result = await supabase.auth.getUser()
        user = result.data.user
        userError = result.error
        
        if (user && !userError) {
          break
        }
        
        // Wait a bit before retrying
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      
      if (userError || !user) {
        console.error('Error getting user after session exchange:', userError)
        return NextResponse.redirect(`${origin}/login?error=user_not_found`)
      }

      // Handle profile creation with robust error handling
      await ensureUserProfile(supabase, user)
      
      // Add a small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return NextResponse.redirect(`${origin}${next}`)
      
    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
      return NextResponse.redirect(`${origin}/login?error=unexpected_error`)
    }
  }

  // Return the user to login with an error message if no code
  return NextResponse.redirect(`${origin}/login?error=no_auth_code`)
}

async function ensureUserProfile(supabase: any, user: any) {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    // If profile exists, we're done
    if (existingProfile) {
      return
    }

    // If there was an error other than "no rows", log it but continue
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', checkError)
    }

    // Generate unique username
    const username = await generateUniqueUsername(supabase, user)
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown User'
    
    // Create the profile using the correct schema field names
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: username,
        full_name: fullName, // Using correct field name from schema
        user_type: 'EmployeeUser' // Default as per schema
      })

    if (createError) {
      console.error('Failed to create profile:', createError)
      
      // If it's a unique constraint violation, try with a different username
      if (createError.code === '23505') {
        const fallbackUsername = `user_${user.id.slice(0, 8)}_${Date.now()}`
        
        const { error: retryError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: fallbackUsername,
            full_name: fullName,
            user_type: 'EmployeeUser'
          })
          
        if (retryError) {
          console.error('Failed to create profile with fallback username:', retryError)
          throw new Error('Profile creation failed after retry')
        }
      } else {
        throw new Error(`Profile creation failed: ${createError.message}`)
      }
    }
    
  } catch (error) {
    console.error('Error in ensureUserProfile:', error)
    // Don't throw - we don't want to break the login flow completely
    // but we should log this for debugging
  }
}

async function generateUniqueUsername(supabase: any, user: any): Promise<string> {
  // Start with email prefix or fallback to user ID
  const emailPrefix = user.email?.split('@')[0] || `user${user.id.slice(0, 8)}`
  
  // Clean up username - only allow alphanumeric and underscore
  const baseUsername = emailPrefix.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
  
  // First try the base username
  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', baseUsername)
    .maybeSingle()
    
  if (!existing) {
    return baseUsername
  }
  
  // If base username exists, try with numbers
  for (let i = 2; i <= 100; i++) {
    const candidateUsername = `${baseUsername}${i}`
    
    const { data: existingNumbered } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', candidateUsername)
      .maybeSingle()
      
    if (!existingNumbered) {
      return candidateUsername
    }
  }
  
  // Fallback to timestamp-based username
  return `${baseUsername}_${Date.now()}`
} 