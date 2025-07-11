'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'

export default function SignOutButton() {
  const { signOut } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    
    try {
      await signOut()
      // Redirect to login page
      router.push('/login')
    } catch (error) {
      console.error('Unexpected error during sign out:', error)
      alert('An unexpected error occurred while signing out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: isLoading ? '#ccc' : '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
        minHeight: '36px'
      }}
    >
      {isLoading ? (
        <>
          <div style={{ 
            border: '2px solid transparent',
            borderTop: '2px solid white',
            borderRadius: '50%',
            width: '12px',
            height: '12px',
            animation: 'spin 1s linear infinite'
          }} />
          Signing out...
        </>
      ) : (
        'Sign Out'
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
} 