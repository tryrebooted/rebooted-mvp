'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ContentBlock {
  id: string;
  type: 'Text' | 'Question';
  title: string;
  content: string;
  isComplete: boolean;
}

interface Module {
  id: string;
  title: string;
  contentBlocks: ContentBlock[];
}

interface LDUser {
  username: string;
  userType: 'LDUser' | 'EmployeeUser';
}

export default function CreateCoursePage() {
  const router = useRouter();
  const supabase = createClient();
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [teachers, setTeachers] = useState<LDUser[]>([]);
  const [students, setStudents] = useState<LDUser[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [newTeacherUsername, setNewTeacherUsername] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!courseTitle.trim() || !courseDescription.trim()) {
        throw new Error('Course title and description are required');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to create a course');
      }

      // Validate that all teacher/student usernames exist
      const allUsernames = [...teachers.map(t => t.username), ...students.map(s => s.username)];
      if (allUsernames.length > 0) {
        const { data: existingUsers, error: usersError } = await supabase
          .from('profiles')
          .select('username')
          .in('username', allUsernames);

        if (usersError) throw new Error('Error validating users');

        const existingUsernames = existingUsers?.map(u => u.username) || [];
        const missingUsers = allUsernames.filter(username => !existingUsernames.includes(username));
        
        if (missingUsers.length > 0) {
          throw new Error(`These users don't exist: ${missingUsers.join(', ')}`);
        }
      }

      // Create the course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          name: courseTitle.trim(),
          description: courseDescription.trim()
        })
        .select()
        .single();

      if (courseError) {
        if (courseError.code === '23505' && courseError.message.includes('courses_name_key')) {
          throw new Error('A course with this title already exists. Please choose a different title.');
        }
        throw new Error(`Failed to create course: ${courseError.message}`);
      }

      const courseId = courseData.id;

      // Create modules if any
      if (modules.length > 0) {
        const moduleInserts = modules.map((module, index) => ({
          course_id: courseId,
          title: module.title,
          position: index + 1
        }));

        const { error: modulesError } = await supabase
          .from('modules')
          .insert(moduleInserts);

        if (modulesError) throw new Error('Failed to create modules');
      }

      // Link teachers and students to the course
      const courseUserInserts = [];

      // Add teachers
      if (teachers.length > 0) {
        const { data: teacherProfiles, error: teacherError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('username', teachers.map(t => t.username));

        if (teacherError) throw new Error('Failed to find teacher profiles');

        teacherProfiles?.forEach(profile => {
          courseUserInserts.push({
            course_id: courseId,
            user_id: profile.id,
            role: 'teacher'
          });
        });
      }

      // Add students
      if (students.length > 0) {
        const { data: studentProfiles, error: studentError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('username', students.map(s => s.username));

        if (studentError) throw new Error('Failed to find student profiles');

        studentProfiles?.forEach(profile => {
          courseUserInserts.push({
            course_id: courseId,
            user_id: profile.id,
            role: 'student'
          });
        });
      }

      // Add current user as teacher if not already added
      const currentUserIsTeacher = teachers.some(t => t.username === user.user_metadata?.preferred_username || t.username === user.email?.split('@')[0]);
      if (!currentUserIsTeacher) {
        // Get the current user's profile ID
        const { data: currentUserProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (profileError) throw new Error('Failed to find current user profile');

        courseUserInserts.push({
          course_id: courseId,
          user_id: currentUserProfile.id,
          role: 'teacher'
        });
      }

      // Insert all course-user relationships
      if (courseUserInserts.length > 0) {
        const { error: courseUsersError } = await supabase
          .from('course_users')
          .insert(courseUserInserts);

        if (courseUsersError) throw new Error('Failed to assign users to course');
      }

      // Success! Redirect to the new course
      router.push(`/modify-course?id=${courseId}`);

    } catch (err) {
      console.error('Error creating course:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/management-dashboard');
  };

  const handlePreview = () => {
    router.push('/preview-course');
  };

  const addTeacher = () => {
    if (newTeacherUsername.trim()) {
      setTeachers([...teachers, { username: newTeacherUsername.trim(), userType: 'LDUser' }]);
      setNewTeacherUsername('');
    }
  };

  const addStudent = () => {
    if (newStudentUsername.trim()) {
      setStudents([...students, { username: newStudentUsername.trim(), userType: 'EmployeeUser' }]);
      setNewStudentUsername('');
    }
  };

  const removeTeacher = (index: number) => {
    setTeachers(teachers.filter((_, i) => i !== index));
  };

  const removeStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const addModule = () => {
    if (newModuleTitle.trim()) {
      const newModule: Module = {
        id: `module-${Date.now()}`,
        title: newModuleTitle.trim(),
        contentBlocks: []
      };
      setModules([...modules, newModule]);
      setNewModuleTitle('');
    }
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#171717'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#171717' }}>Create New Course</h1>
      
      <form onSubmit={handleSubmit} style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '20px',
        backgroundColor: '#fafafa'
      }}>
        {/* Basic Course Information */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#171717' }}>
            Course Title:
          </label>
          <input 
            type="text" 
            id="title" 
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
            style={{ 
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              color: '#171717'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#171717' }}>
            Course Description:
          </label>
          <textarea 
            id="description" 
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            required
            rows={3}
            style={{ 
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical',
              backgroundColor: '#ffffff',
              color: '#171717'
            }}
          />
        </div>

        {/* Teachers Section */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#171717' }}>
            Teachers (L&D Users):
          </label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
              type="text" 
              value={newTeacherUsername}
              onChange={(e) => setNewTeacherUsername(e.target.value)}
              placeholder="Enter teacher username"
              style={{ 
                flex: 1,
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                color: '#171717'
              }}
            />
            <button 
              type="button"
              onClick={addTeacher}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007cba',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Teacher
            </button>
          </div>
          <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '5px' }}>
            {teachers.map((teacher, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px', backgroundColor: '#e3f2fd', margin: '2px 0', borderRadius: '3px' }}>
                <span>{teacher.username} ({teacher.userType})</span>
                <button 
                  type="button"
                  onClick={() => removeTeacher(index)}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', padding: '2px 8px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Students Section */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#171717' }}>
            Students (Employee Users):
          </label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
              type="text" 
              value={newStudentUsername}
              onChange={(e) => setNewStudentUsername(e.target.value)}
              placeholder="Enter student username"
              style={{ 
                flex: 1,
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                color: '#171717'
              }}
            />
            <button 
              type="button"
              onClick={addStudent}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Student
            </button>
          </div>
          <div style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '5px' }}>
            {students.map((student, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px', backgroundColor: '#e8f5e8', margin: '2px 0', borderRadius: '3px' }}>
                <span>{student.username} ({student.userType})</span>
                <button 
                  type="button"
                  onClick={() => removeStudent(index)}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', padding: '2px 8px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modules Section */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#171717' }}>
            Course Modules:
          </label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
              type="text" 
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Enter module title"
              style={{ 
                flex: 1,
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                color: '#171717'
              }}
            />
            <button 
              type="button"
              onClick={addModule}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Module
            </button>
          </div>
          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '5px' }}>
            {modules.map((module, index) => (
              <div key={module.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f8f9fa', margin: '2px 0', borderRadius: '3px', border: '1px solid #dee2e6' }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>{module.title}</span>
                  <span style={{ color: '#6c757d', fontSize: '12px', marginLeft: '10px' }}>
                    ({module.contentBlocks.length} content blocks)
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeModule(index)}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
            {modules.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
                No modules added yet. Modules will contain content blocks (Text and Questions).
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: isSubmitting ? '#6c757d' : '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
          <button 
            type="button"
            onClick={handlePreview}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Preview Course
          </button>
          <button 
            type="button"
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 