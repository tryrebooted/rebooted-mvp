'use client';

import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // User is already authenticated, redirect to dashboard
          router.push('/management-dashboard')
          return
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [supabase, router])

  useEffect(() => {
    // Check for error messages from the auth callback or middleware
    const errorParam = searchParams.get('error')
    if (errorParam) {
      switch (errorParam) {
        case 'auth_failed':
          setError('Authentication failed. Please try signing in again.')
          break
        case 'user_not_found':
          setError('Unable to retrieve user information. Please try again.')
          break
        case 'unexpected_error':
          setError('An unexpected error occurred during sign in. Please try again.')
          break
        case 'no_auth_code':
          setError('Invalid authentication code. Please try signing in again.')
          break
        case 'auth_required':
          setError('Please sign in to access your dashboard.')
          break
        case 'session_expired':
          setError('Your session has expired. Please sign in again.')
          break
        default:
          setError('An error occurred during sign in. Please try again.')
      }
    }
  }, [searchParams])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/management-dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      
      if (error) {
        setError('Error initiating sign in: ' + error.message)
        setIsLoading(false)
      }
      // Don't set loading to false here - redirect is happening
    } catch (err) {
      setError('Unexpected error during sign in. Please try again.')
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #4285f4',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#666' }}>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      color: '#171717'
    }}>
      <div style={{ 
        padding: '40px',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          marginBottom: '8px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#212529'
        }}>
          Welcome to L&D Platform
        </h1>
        <p style={{ 
          color: '#6c757d', 
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Sign in to access your courses and learning materials
        </p>
        
        {error && (
          <div style={{
            backgroundColor: '#fff5f5',
            border: '1px solid #ff6b6b',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '20px',
            color: '#dc3545',
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {error}
          </div>
        )}
        
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px 20px',
            backgroundColor: isLoading ? '#ccc' : '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            minHeight: '48px'
          }}
        >
          {isLoading ? (
            <>
              <div style={{ 
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                animation: 'spin 1s linear infinite'
              }} />
              Signing in...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>
        
        <p style={{ 
          fontSize: '12px', 
          color: '#9ca3af', 
          marginTop: '20px',
          lineHeight: '1.4'
        }}>
          By signing in, you agree to access the learning platform with your organizational Google account.
        </p>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 