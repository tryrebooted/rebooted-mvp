'use client';

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user && !loading) {
      router.push('/management-dashboard')
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    // Check for error messages from URL params
    const errorParam = searchParams.get('error')
    if (errorParam) {
      switch (errorParam) {
        case 'auth_required':
          setError('Please sign in to access your dashboard.')
          break
        case 'auth_failed':
          setError('Authentication failed. Please try again.')
          break
        case 'user_not_found':
          setError('User not found after authentication.')
          break
        case 'unexpected_error':
          setError('An unexpected error occurred during authentication.')
          break
        case 'no_auth_code':
          setError('No authorization code received.')
          break
        case 'session_expired':
          setError('Your session has expired. Please sign in again.')
          break
        default:
          setError('Please sign in to continue.')
      }
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    setError(null)

    try {
      const { data, error: signInError } = await signInWithGoogle()

      if (signInError) {
        setError(signInError.message || 'Failed to sign in with Google')
      } else {
        // OAuth redirect will happen automatically
        // User will be redirected to Google, then back to /auth/callback
        console.log('OAuth redirect initiated')
      }
    } catch (err) {
      setError('Unexpected error during sign in. Please try again.')
      console.error('Sign in error:', err)
    } finally {
      setIsSigningIn(false)
    }
  }

  // Show loading while checking authentication state
  if (loading) {
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
          <p style={{ color: '#666' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // If user is already authenticated, show loading while redirecting
  if (user) {
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
          <p style={{ color: '#666' }}>Redirecting to dashboard...</p>
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
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          marginBottom: '10px',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#171717'
        }}>
          Welcome to Fusen
        </h1>

        <p style={{
          marginBottom: '30px',
          color: '#666',
          fontSize: '16px'
        }}>
          Sign in to access your learning dashboard
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 24px',
            backgroundColor: isSigningIn ? '#f3f4f6' : '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: isSigningIn ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            minHeight: '48px'
          }}
        >
          {isSigningIn ? (
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
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <p style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          Use your Google account to access the platform
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