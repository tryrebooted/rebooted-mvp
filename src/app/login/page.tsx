import { redirect } from 'next/navigation'
import { createServer } from '@/utils/supabase/server'
import LoginPage from './LoginPage'

export default async function Page() {
  const supabase = await createServer()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is already authenticated, redirect to dashboard
  if (user) {
    redirect('/management-dashboard')
  }

  // If not authenticated, show login page
  return <LoginPage />
} 