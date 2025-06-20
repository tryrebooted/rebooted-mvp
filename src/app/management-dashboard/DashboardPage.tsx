'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import SignOutButton from './SignOutButton'

interface Course {
  id: string
  name: string
  description: string | null
  role: 'teacher' | 'student'
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadUserAndCourses() {
      try {
        // Get current user with retry logic for session timing issues
        let user = null
        let userError = null
        
        // Retry up to 5 times with increasing delays
        for (let attempt = 1; attempt <= 5; attempt++) {
          const { data: { user: currentUser }, error: currentError } = await supabase.auth.getUser()
          user = currentUser
          userError = currentError
          
          if (user && !userError) {
            break
          }
          
          if (attempt < 5) {
            // Wait with exponential backoff: 500ms, 1s, 2s, 4s
            await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt - 1)))
          }
        }
        
        if (userError || !user) {
          console.error('Authentication error after retries:', userError)
          router.push('/login?error=auth_required')
          return
        }

        if (!mounted) return

        setUser(user)

        // Check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, full_name, user_type')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError) {
          console.error('Error fetching user profile:', profileError)
          setError('Error loading user profile. Please try refreshing the page.')
          return
        }

        if (!profile) {
          console.error('User profile not found for user ID:', user.id)
          setError('User profile not found. Please sign out and sign in again.')
          return
        }

        // Fetch courses for this user
        const { data: coursesData, error: coursesError } = await supabase
          .from('course_users')
          .select(`
            role,
            courses (
              id,
              name,
              description
            )
          `)
          .eq('user_id', user.id)

        if (coursesError) {
          console.error('Error fetching courses:', coursesError)
          setError('Error loading courses. Please try refreshing the page.')
        } else {
          // Transform the data to flatten the structure
          const transformedCourses = coursesData?.map((item: any) => ({
            id: item.courses.id,
            name: item.courses.name,
            description: item.courses.description,
            role: item.role
          })) || []
          
          if (mounted) {
            setCourses(transformedCourses)
          }
        }
      } catch (error) {
        console.error('Unexpected error loading data:', error)
        if (mounted) {
          setError('An unexpected error occurred. Please try refreshing the page.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadUserAndCourses()

    // Cleanup function
    return () => {
      mounted = false
    }
  }, [router, supabase])

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    setDeleting(courseId)
    
    try {
      // First, delete all course_users entries for this course
      const { error: courseUsersError } = await supabase
        .from('course_users')
        .delete()
        .eq('course_id', courseId)

      if (courseUsersError) {
        console.error('Error deleting course users:', courseUsersError)
        setError('Error deleting course. Please try again.')
        return
      }

      // Then delete the course itself
      const { error: courseError } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (courseError) {
        console.error('Error deleting course:', courseError)
        setError('Error deleting course. Please try again.')
        return
      }

      // Remove the course from local state
      setCourses(prev => prev.filter(course => course.id !== courseId))
      
    } catch (error) {
      console.error('Unexpected error deleting course:', error)
      setError('An unexpected error occurred while deleting the course.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        paddingTop: '100px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        color: '#171717',
        textAlign: 'center'
      }}>
        <p>Loading your dashboard...</p>
        <div style={{ 
          marginTop: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          This may take a few moments while we set up your session.
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        paddingTop: '100px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        color: '#171717',
        textAlign: 'center'
      }}>
        <div style={{
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#fff5f5',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Error</h2>
          <p style={{ marginBottom: '20px' }}>{error}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007cba',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
            <SignOutButton />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
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
      
      {courses.length === 0 ? (
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
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {courses.map((course) => (
            <div
              key={course.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '10px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    color: '#171717'
                  }}>
                    {course.name}
                  </h3>
                  {course.description && (
                    <p style={{
                      margin: '0 0 10px 0',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      {course.description}
                    </p>
                  )}
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: course.role === 'teacher' ? '#e3f2fd' : '#e8f5e8',
                  color: course.role === 'teacher' ? '#1976d2' : '#2e7d32',
                  marginLeft: '15px'
                }}>
                  {course.role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {course.role === 'teacher' && (
                  <>
                    <a
                      href={`/modify-course?id=${course.id}`}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#007cba',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      Edit Course
                    </a>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      disabled={deleting === course.id}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: deleting === course.id ? '#ccc' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: deleting === course.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {deleting === course.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
                <a
                  href={`/preview-course?id=${course.id}`}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: course.role === 'teacher' ? '#28a745' : '#007cba',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  {course.role === 'teacher' ? 'Preview' : 'Start Course'}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ 
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <a 
          href="/create-course"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#007cba',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Create New Course
        </a>
      </div>
    </div>
  )
} 