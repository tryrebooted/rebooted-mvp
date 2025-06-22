'use client';

import { useUser } from '@/contexts/UserContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MockLoginPage() {
  const { user, signIn } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    // Check if user is already authenticated
    if (user) {
      router.push('/management-dashboard')
      return
    }
  }, [user, router])

  useEffect(() => {
    // Check for error messages from redirects
    const errorParam = searchParams.get('error')
    if (errorParam === 'auth_required') {
      setError('Please sign in to access your dashboard.')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await signIn(username, 'password') // Password is ignored in mock
      
      if (error) {
        setError(error.message)
      } else if (data.user) {
        router.push('/management-dashboard')
      }
    } catch (err) {
      setError('Unexpected error during sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (testUser: string) => {
    setUsername(testUser)
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await signIn(testUser, 'password')
      
      if (error) {
        setError(error.message)
      } else if (data.user) {
        router.push('/management-dashboard')
      }
    } catch (err) {
      setError('Unexpected error during sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          marginBottom: '8px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#212529'
        }}>
          L&D Platform - Demo Login
        </h1>
        <p style={{ 
          color: '#6c757d', 
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Testing with Java Spring Boot Backend
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
        
        <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username (teacher1, teacher2, student1, etc.)"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px'
            }}
          />
          <button 
            type="submit"
            disabled={isLoading || !username.trim()}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: isLoading ? '#ccc' : '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading || !username.trim() ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              minHeight: '48px'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', marginBottom: '15px', color: '#666' }}>
            Quick Login (Test Users):
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => handleQuickLogin('teacher1')}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                border: '1px solid #bbdefb',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Teacher 1 (L&D User)
            </button>
            <button 
              onClick={() => handleQuickLogin('student1')}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e8f5e8',
                color: '#2e7d32',
                border: '1px solid #c8e6c8',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Student 1 (Employee User)
            </button>
          </div>
        </div>
        
        <p style={{ 
          fontSize: '12px', 
          color: '#9ca3af', 
          marginTop: '20px',
          lineHeight: '1.4'
        }}>
          Available test users: teacher1, teacher2, student1, student2, student3
        </p>
      </div>
    </div>
  )
}