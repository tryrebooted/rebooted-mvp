'use client';

import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/management-dashboard`
      }
    })
    
    if (error) {
      alert('Error signing in: ' + error.message)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#171717'
    }}>
      <div style={{ 
        padding: '40px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        minWidth: '300px'
      }}>
        <h1 style={{ marginBottom: '20px' }}>Sign in to L&D Platform</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Access your courses and learning materials
        </p>
        <button 
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px 20px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  )
} 