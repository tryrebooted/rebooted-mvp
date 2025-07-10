'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import TeacherDashboard from './TeacherDashboard'
import StudentDashboard from './StudentDashboard'

export default function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const { user, loading: authLoading } = useUser()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadCourses() {
      // Wait for auth to finish loading
      if (authLoading) return

      // If no user, redirect to login
      if (!user) {
        router.push('/login?error=auth_required')
        return
      }

      try {
        setLoading(true)

        // Get the user ID for API calls
        const userId = user.id

        // Fetch courses for this user using backend API
        try {
          const coursesData = await apiService.getUserCourses(userId)

          // Transform backend UserCourseDTO to frontend Course interface
          const transformedCourses: Course[] = coursesData.map(course => ({
            id: course.id,
            title: course.title,
            body: course.body,
            role: course.role as 'teacher' | 'student'
          }))

          if (mounted) {
            setCourses(transformedCourses)
          }
        } catch (coursesError) {
          console.error('Error fetching courses:', coursesError)
          if (mounted) {
            setError('Error loading courses. Please try refreshing the page.')
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

    loadCourses()

    // Cleanup function
    return () => {
      mounted = false
    }
  }, [router, user, authLoading])

  const deleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    setDeleting(courseId)

    try {
      // Delete the course using backend API (backend handles course-user relationship cleanup)
      await apiService.deleteCourse(courseId)

      // Remove the course from local state
      setCourses(prev => prev.filter(course => course.id !== courseId))

    } catch (error) {
      console.error('Unexpected error deleting course:', error)
      setError('An unexpected error occurred while deleting the course.')
    } finally {
      setDeleting(null)
    }
  }

  // Show loading while auth is loading or data is loading
  if (authLoading || loading) {

    if (!user) {
      // This is a fallback for while the user context is loading.
      // The UserProvider should redirect if the user is not authenticated.
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
            <p style={{ color: '#666' }}>Loading dashboard...</p>
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

    if (user.role === 'teacher') {
      return <TeacherDashboard />
    }

    if (user.role === 'student') {
      return <StudentDashboard />
    }

    // Fallback if the user has an unknown role
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
                      {course.title}
                    </h3>
                    {course.body && (
                      <p style={{
                        margin: '0 0 10px 0',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        {course.body}
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Error</h1>
          <p>Your user role is not recognized. Please contact support.</p>
          <button onClick={() => router.push('/login')}>Go to Login</button>
        </div>
        )
}