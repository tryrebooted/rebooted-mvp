'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  progress: number;
}

interface LDUser {
  username: string;
  userType: 'LDUser' | 'EmployeeUser';
}

export default function PreviewCoursePage() {
  const router = useRouter();
  
  // Sample course data following the domain model structure
  const courseTitle = 'Workplace Safety Fundamentals';
  const courseDescription = 'Essential safety protocols and procedures for all employees';
  const teachers: LDUser[] = [
    { username: 'sarah.jones', userType: 'LDUser' },
    { username: 'mike.wilson', userType: 'LDUser' }
  ];
  const students: LDUser[] = [
    { username: 'john.doe', userType: 'EmployeeUser' },
    { username: 'jane.smith', userType: 'EmployeeUser' }
  ];

  const [modules, setModules] = useState<Module[]>([
    {
      id: 'module-1',
      title: 'Introduction to Workplace Safety',
      progress: 0.5,
      contentBlocks: [
        {
          id: 'content-1',
          type: 'Text',
          title: 'Safety Overview',
          content: 'Welcome to our comprehensive workplace safety training. This course will cover the essential knowledge and procedures every employee needs to maintain a safe working environment. By the end of this course, you will understand how to identify potential hazards, follow proper safety protocols, and respond appropriately to emergency situations.',
          isComplete: false,
        },
        {
          id: 'content-2',
          type: 'Question',
          title: 'Safety Basics Quiz',
          content: 'What is the first step when encountering a workplace hazard?',
          isComplete: false,
        },
      ]
    },
    {
      id: 'module-2',
      title: 'Emergency Procedures',
      progress: 0.0,
      contentBlocks: [
        {
          id: 'content-3',
          type: 'Text',
          title: 'Emergency Response Steps',
          content: 'In case of emergency, follow these critical steps: 1) Remain calm and assess the situation, 2) Alert nearby colleagues if safe to do so, 3) Contact emergency services (911) if required, 4) Follow evacuation procedures to designated meeting points.',
          isComplete: false,
        },
        {
          id: 'content-4',
          type: 'Question',
          title: 'Emergency Response Quiz',
          content: 'What number should you call for emergency services?',
          isComplete: false,
        },
      ]
    },
    {
      id: 'module-3',
      title: 'Equipment Safety Guidelines',
      progress: 0.0,
      contentBlocks: [
        {
          id: 'content-5',
          type: 'Text',
          title: 'PPE Requirements',
          content: 'Proper equipment usage is crucial for maintaining workplace safety. Always inspect equipment before use and report any damage or malfunctions immediately. Personal protective equipment (PPE) must be worn at all times in designated areas. This includes safety goggles, hard hats, gloves, and appropriate footwear.',
          isComplete: false,
        },
        {
          id: 'content-6',
          type: 'Question',
          title: 'Equipment Safety Quiz',
          content: 'What should you do before using any equipment?',
          isComplete: false,
        },
      ]
    }
  ]);

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

  const toggleContentCompletion = (moduleId: string, contentId: string) => {
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
    </div>
  );
} 