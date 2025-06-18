'use client';

import { useRouter } from 'next/navigation';

export default function PreviewCoursePage() {
  const router = useRouter();

  const handleBackToEdit = () => {
    router.push('/modify-course');
  };

  const handlePublishCourse = () => {
    alert('Publishing functionality coming in step 6!');
    router.push('/management-dashboard');
  };

  const handleBackToDashboard = () => {
    router.push('/management-dashboard');
  };

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#171717'
    }}>
      {/* L&D Preview Controls Header */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ccc',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold', color: '#666' }}>
          🔍 Preview Mode - Employee View
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

      {/* Employee Course View */}
      <div style={{
        maxWidth: '700px',
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
            Workplace Safety Fundamentals
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            lineHeight: '1.5'
          }}>
            Essential safety protocols and procedures for all employees
          </p>
        </div>

        {/* Course Content */}
        <div style={{ lineHeight: '1.6' }}>
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{
              fontSize: '20px',
              marginBottom: '10px',
              color: '#171717',
              borderLeft: '4px solid #007cba',
              paddingLeft: '10px'
            }}>
              1. Introduction to Workplace Safety
            </h2>
            <p style={{ marginBottom: '15px', color: '#333' }}>
              Welcome to our comprehensive workplace safety training. This course will cover the essential 
              knowledge and procedures every employee needs to maintain a safe working environment.
            </p>
            <p style={{ color: '#333' }}>
              By the end of this course, you will understand how to identify potential hazards, 
              follow proper safety protocols, and respond appropriately to emergency situations.
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h2 style={{
              fontSize: '20px',
              marginBottom: '10px',
              color: '#171717',
              borderLeft: '4px solid #007cba',
              paddingLeft: '10px'
            }}>
              2. Emergency Procedures
            </h2>
            <p style={{ marginBottom: '15px', color: '#333' }}>
              In case of emergency, follow these critical steps:
            </p>
            <ul style={{ marginLeft: '20px', color: '#333' }}>
              <li style={{ marginBottom: '8px' }}>Remain calm and assess the situation</li>
              <li style={{ marginBottom: '8px' }}>Alert nearby colleagues if safe to do so</li>
              <li style={{ marginBottom: '8px' }}>Contact emergency services (911) if required</li>
              <li style={{ marginBottom: '8px' }}>Follow evacuation procedures to designated meeting points</li>
            </ul>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h2 style={{
              fontSize: '20px',
              marginBottom: '10px',
              color: '#171717',
              borderLeft: '4px solid #007cba',
              paddingLeft: '10px'
            }}>
              3. Equipment Safety Guidelines
            </h2>
            <p style={{ marginBottom: '15px', color: '#333' }}>
              Proper equipment usage is crucial for maintaining workplace safety. Always inspect 
              equipment before use and report any damage or malfunctions immediately.
            </p>
            <p style={{ color: '#333' }}>
              Personal protective equipment (PPE) must be worn at all times in designated areas. 
              This includes safety goggles, hard hats, gloves, and appropriate footwear.
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h2 style={{
              fontSize: '20px',
              marginBottom: '10px',
              color: '#171717',
              borderLeft: '4px solid #007cba',
              paddingLeft: '10px'
            }}>
              4. Reporting Incidents
            </h2>
            <p style={{ marginBottom: '15px', color: '#333' }}>
              All incidents, near-misses, and safety concerns must be reported immediately to your 
              supervisor or the safety department. Quick reporting helps prevent future incidents.
            </p>
            <p style={{ color: '#333' }}>
              Use the incident reporting form available on the company intranet or contact 
              the safety hotline at extension 2911.
            </p>
          </div>
        </div>

        {/* Course Completion */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          textAlign: 'center',
          border: '1px solid #ccc'
        }}>
          <h3 style={{ color: '#171717', marginBottom: '10px' }}>Course Complete</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            You have completed the Workplace Safety Fundamentals course.
          </p>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Mark as Complete
          </button>
        </div>
      </div>
    </div>
  );
} 