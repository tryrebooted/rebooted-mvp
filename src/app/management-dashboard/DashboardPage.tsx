import { redirect } from 'next/navigation'
import { createServer } from '@/utils/supabase/server'
import SignOutButton from './SignOutButton'

export default async function DashboardPage() {
  const supabase = await createServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#171717'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h1>Welcome, {user.user_metadata?.full_name || user.email}</h1>
        <SignOutButton />
      </div>
      
      <h2 style={{ marginBottom: '20px' }}>Your Courses</h2>
      
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#fafafa'
      }}>
        <p style={{ 
          marginBottom: '20px',
          color: '#666',
          fontSize: '16px'
        }}>
          No courses yet
        </p>
        <a 
          href="/create-course"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007cba',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Create Your First Course
        </a>
      </div>
    </div>
  )
} 