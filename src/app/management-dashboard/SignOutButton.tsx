'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Error signing out: ' + error.message)
    } else {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Sign Out
    </button>
  )
} 