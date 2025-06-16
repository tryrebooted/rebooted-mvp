'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateCoursePage() {
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseContent, setCourseContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show an alert and redirect back to dashboard
    alert('Course created! (This is just a placeholder)');
    router.push('/management-dashboard');
  };

  const handleCancel = () => {
    router.push('/management-dashboard');
  };

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '600px',
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

        <div style={{ marginBottom: '15px' }}>
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

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#171717' }}>
            Course Content:
          </label>
          <textarea 
            id="content" 
            value={courseContent}
            onChange={(e) => setCourseContent(e.target.value)}
            required
            rows={8}
            placeholder="Enter your course content, lessons, or learning materials here..."
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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007cba',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Course
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