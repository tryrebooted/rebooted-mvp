'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ContentBlock {
  id: string;
  type: 'Text' | 'Question';
  title: string;
  content: string;
  isComplete: boolean;
  position: number;
}

interface Module {
  id: string;
  title: string;
  contentBlocks: ContentBlock[];
  position: number;
}

interface LDUser {
  username: string;
  userType: 'LDUser' | 'EmployeeUser';
}

export default function PreviewCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const courseId = searchParams.get('id');

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [teachers, setTeachers] = useState<LDUser[]>([]);
  const [students, setStudents] = useState<LDUser[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('No course ID provided');
      setLoading(false);
      return;
    }

    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push('/login');
        return;
      }

      setCurrentUser(user);

      // Check user's role in this course
      const { data: userAccess, error: accessError } = await supabase
        .from('course_users')
        .select('role')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (accessError) {
        setError('You do not have access to this course');
        setLoading(false);
        return;
      }

      setUserRole(userAccess.role);

      // Fetch course basic info
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('name, description')
        .eq('id', courseId)
        .single();

      if (courseError) throw new Error('Failed to load course');

      setCourseTitle(courseData.name);
      setCourseDescription(courseData.description || '');

      // Fetch course users (teachers and students)
      const { data: courseUsers, error: usersError } = await supabase
        .from('course_users')
        .select(`
          role,
          profiles (
            username,
            user_type
          )
        `)
        .eq('course_id', courseId);

      if (usersError) throw new Error('Failed to load course users');

      const teachersList: LDUser[] = [];
      const studentsList: LDUser[] = [];

      courseUsers?.forEach((item: any) => {
        const user = {
          username: item.profiles.username,
          userType: item.profiles.user_type as 'LDUser' | 'EmployeeUser'
        };
        
        if (item.role === 'teacher') {
          teachersList.push(user);
        } else {
          studentsList.push(user);
        }
      });

      setTeachers(teachersList);
      setStudents(studentsList);

      // Fetch modules and content
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          position,
          content (
            id,
            content_type,
            content_text,
            is_complete,
            position
          )
        `)
        .eq('course_id', courseId)
        .order('position');

      if (modulesError) throw new Error('Failed to load modules');

      const formattedModules: Module[] = modulesData?.map(module => ({
        id: module.id,
        title: module.title || '',
        position: module.position,
        contentBlocks: module.content
          ?.sort((a, b) => a.position - b.position)
          .map(content => ({
            id: content.id,
            type: content.content_type as 'Text' | 'Question',
            title: `${content.content_type} Content`,
            content: content.content_text || '',
            isComplete: content.is_complete,
            position: content.position
          })) || []
      })) || [];

      setModules(formattedModules);

    } catch (err) {
      console.error('Error loading course data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEdit = () => {
    router.push(`/modify-course?id=${courseId}`);
  };

  const handlePublishCourse = () => {
    alert('Publishing functionality coming in step 6!');
    router.push('/management-dashboard');
  };

  const handleBackToDashboard = () => {
    router.push('/management-dashboard');
  };

  const toggleContentCompletion = async (moduleId: string, contentId: string) => {
    try {
      // Update in local state first for immediate UI feedback
      setModules(modules.map(module => 
        module.id === moduleId 
          ? {
              ...module,
              contentBlocks: module.contentBlocks.map(content =>
                content.id === contentId 
                  ? { ...content, isComplete: !content.isComplete }
                  : content
              )
            }
          : module
      ));

      // Update in database (only for students or if completion tracking is enabled)
      const currentContent = modules
        .find(m => m.id === moduleId)
        ?.contentBlocks.find(c => c.id === contentId);

      if (currentContent) {
        const { error } = await supabase
          .from('content')
          .update({ is_complete: !currentContent.isComplete })
          .eq('id', contentId);

        if (error) {
          console.error('Error updating completion status:', error);
          // Revert the local state change if database update failed
          setModules(modules.map(module => 
            module.id === moduleId 
              ? {
                  ...module,
                  contentBlocks: module.contentBlocks.map(content =>
                    content.id === contentId 
                      ? { ...content, isComplete: currentContent.isComplete }
                      : content
                  )
                }
              : module
          ));
        }
      }
    } catch (err) {
      console.error('Error toggling completion:', err);
    }
  };

  const calculateModuleProgress = (module: Module): number => {
    if (module.contentBlocks.length === 0) return 0;
    const completedCount = module.contentBlocks.filter(content => content.isComplete).length;
    return completedCount / module.contentBlocks.length;
  };

  const calculateOverallProgress = (): number => {
    if (modules.length === 0) return 0;
    const totalProgress = modules.reduce((sum, module) => sum + calculateModuleProgress(module), 0);
    return totalProgress / modules.length;
  };

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
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#666' }}>Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
          <div style={{
            backgroundColor: '#fff5f5',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Error</h2>
            <p style={{ color: '#dc3545', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={handleBackToDashboard}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007cba',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#171717'
    }}>
      {/* Header - Different based on user role */}
      {userRole === 'teacher' ? (
        <div style={{
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #ccc',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: 'bold', color: '#666' }}>
            🔍 Preview Mode - Teacher View
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleBackToEdit}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Back to Edit
            </button>
            <button
              onClick={handlePublishCourse}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Publish Course
            </button>
            <button
              onClick={handleBackToDashboard}
              style={{
                padding: '6px 12px',
                backgroundColor: '#007cba',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#e8f5e8',
          borderBottom: '1px solid #ccc',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>
            📚 Course Learning Mode
          </span>
          <button
            onClick={handleBackToDashboard}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            My Courses
          </button>
        </div>
      )}

      {/* Course Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Course Header */}
        <div style={{
          marginBottom: '30px',
          textAlign: 'center',
          borderBottom: '2px solid #007cba',
          paddingBottom: '20px'
        }}>
          <h1 style={{
            fontSize: '28px',
            marginBottom: '10px',
            color: '#171717'
          }}>
            {courseTitle}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '15px'
          }}>
            {courseDescription}
          </p>
          
          {/* Overall Progress */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '15px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Overall Progress:</span>
            <div style={{
              width: '200px',
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${calculateOverallProgress() * 100}%`,
                  height: '100%',
                  backgroundColor: '#007cba',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#007cba' }}>
              {Math.round(calculateOverallProgress() * 100)}%
            </span>
          </div>
        </div>

        {/* Course Content - Modules */}
        <div style={{ lineHeight: '1.6' }}>
          {modules.map((module, moduleIndex) => {
            const progress = calculateModuleProgress(module);
            return (
              <div key={module.id} style={{
                marginBottom: '30px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {/* Module Header */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px 20px',
                  borderBottom: '1px solid #ddd'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h2 style={{
                      fontSize: '20px',
                      margin: '0',
                      color: '#171717'
                    }}>
                      {moduleIndex + 1}. {module.title}
                    </h2>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        width: '100px',
                        height: '6px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            width: `${progress * 100}%`,
                            height: '100%',
                            backgroundColor: '#28a745',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {Math.round(progress * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Module Content */}
                <div style={{ padding: '20px' }}>
                  {module.contentBlocks.map((content, contentIndex) => (
                    <div key={content.id} style={{
                      marginBottom: contentIndex < module.contentBlocks.length - 1 ? '25px' : '0',
                      padding: '15px',
                      backgroundColor: content.isComplete ? '#f0f8ff' : '#ffffff',
                      border: `1px solid ${content.isComplete ? '#b3d9ff' : '#e0e0e0'}`,
                      borderRadius: '6px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '10px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: content.type === 'Text' ? '#e3f2fd' : '#f3e5f5',
                            color: content.type === 'Text' ? '#1976d2' : '#7b1fa2'
                          }}>
                            {content.type}
                          </span>
                          <h3 style={{
                            margin: '0',
                            fontSize: '16px',
                            color: '#171717'
                          }}>
                            {content.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleContentCompletion(module.id, content.id)}
                          style={{
                            padding: '4px 12px',
                            fontSize: '12px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            backgroundColor: content.isComplete ? '#d4edda' : '#f8f9fa',
                            color: content.isComplete ? '#155724' : '#495057'
                          }}
                        >
                          {content.isComplete ? '✓ Completed' : 'Mark Complete'}
                        </button>
                      </div>

                      <div style={{
                        fontSize: '14px',
                        color: '#333',
                        lineHeight: '1.5'
                      }}>
                        {content.content}
                      </div>

                      {content.type === 'Question' && (
                        <div style={{ marginTop: '15px' }}>
                          <button style={{
                            padding: '8px 16px',
                            backgroundColor: '#007cba',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}>
                            Answer Question
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Course Completion */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ color: '#171717', marginBottom: '15px' }}>
            Course Progress: {Math.round(calculateOverallProgress() * 100)}%
          </h3>
          {calculateOverallProgress() === 1 ? (
            <div>
              <p style={{ color: '#28a745', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                🎉 Congratulations! You have completed this course!
              </p>
              <button style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                Get Certificate
              </button>
            </div>
          ) : (
            <p style={{ color: '#6c757d', fontSize: '16px' }}>
              Continue completing content blocks to finish the course and earn your certificate.
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 