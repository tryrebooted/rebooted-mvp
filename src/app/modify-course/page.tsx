'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiService } from '@/services/api';
import { mockAuth } from '@/contexts/UserContext';
import { Course, Module } from '@/types/backend-aliases';
import ContentBlockList from '@/components/content/ContentBlockList';
import ContentCreator from '@/components/content/ContentCreator';

export default function ModifyCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Content creation state
  const [showContentCreator, setShowContentCreator] = useState(false);

  // Module creation state
  const [showModuleCreator, setShowModuleCreator] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [creatingModule, setCreatingModule] = useState(false);
  const [moduleCreationError, setModuleCreationError] = useState<string | null>(null);

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

      // Get current user to check permissions
      const { data: { user }, error: userError } = await mockAuth.getUser();
      if (userError || !user) {
        router.push('/login');
        return;
      }

      // Fetch course basic info
      const courseData = await apiService.getCourseById(parseInt(courseId!));
      setCourse(courseData);
      setEditedName(courseData.title ?? '');
      setEditedDescription(courseData.body ?? '');

      // Fetch modules for this course
      const modulesData = await apiService.getModulesByCourseId(parseInt(courseId!));
      setModules(modulesData);

      // Auto-select the first module if available
      if (modulesData.length > 0) {
        setSelectedModuleId(modulesData[0]?.id!);
      }

    } catch (err) {
      console.error('Error loading course data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancelEdit = () => {
    if (course) {
      setEditedName(course.title!);
      setEditedDescription(course.body!);
    }
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!courseId || !course) return;

    // Validation
    if (!editedName.trim()) {
      setSaveError('Course name is required');
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      const updatedCourse = await apiService.updateCourse(parseInt(courseId), {
        title: editedName.trim(),
        body: editedDescription.trim()
      });

      setCourse(updatedCourse);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating course:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateModule = async () => {
    if (!courseId || !newModuleName.trim()) {
      setModuleCreationError('Module name is required');
      return;
    }

    try {
      setCreatingModule(true);
      setModuleCreationError(null);

      await apiService.createModule({
        title: newModuleName.trim(),
        body: newModuleDescription.trim(),
        courseId: parseInt(courseId)
      });

      // Reset form
      setNewModuleName('');
      setNewModuleDescription('');
      setShowModuleCreator(false);

      // Refresh data
      loadCourseData();
    } catch (err) {
      console.error('Error creating module:', err);
      setModuleCreationError(err instanceof Error ? err.message : 'Failed to create module');
    } finally {
      setCreatingModule(false);
    }
  };

  const handleCancelModuleCreation = () => {
    setShowModuleCreator(false);
    setNewModuleName('');
    setNewModuleDescription('');
    setModuleCreationError(null);
  };

  const handleBackToDashboard = () => {
    router.push('/management-dashboard');
  };

  const handlePreviewCourse = () => {
    router.push(`/preview-course?id=${courseId}`);
  };

  const handleModuleClick = (moduleId: number) => {
    setSelectedModuleId(selectedModuleId === moduleId ? null : moduleId);
  };

  const handleContentUpdate = () => {
    // Refresh module data when content is updated to reflect progress changes
    loadCourseData();
  };

  const handleShowContentCreator = () => {
    setShowContentCreator(true);
  };

  const handleHideContentCreator = () => {
    setShowContentCreator(false);
  };

  const handleContentCreated = () => {
    setShowContentCreator(false);
    handleContentUpdate(); // Refresh the content list
  };

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        color: '#171717',
        textAlign: 'center'
      }}>
        <p>Loading course data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        maxWidth: '1200px',
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
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
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
        <h1>Modify Course</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePreviewCourse}
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
            onClick={handleBackToDashboard}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
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

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left Column - Course Details and Modules */}
        <div style={{ flex: '0 0 400px' }}>
          {course && (
            <div style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              backgroundColor: '#f8f9fa'
            }}>
              {/* Course Information Section */}
              {!isEditing ? (
                // Display Mode
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ marginBottom: '10px', color: '#171717' }}>{course.title}</h2>
                      <p style={{ color: '#666', marginBottom: '0' }}>{course.body}</p>
                    </div>
                    <button
                      onClick={handleEditClick}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#007cba',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginLeft: '20px'
                      }}
                    >
                      Edit Course
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div>
                  <h3 style={{ marginBottom: '20px', color: '#171717' }}>Edit Course Details</h3>

                  {/* Save Error Display */}
                  {saveError && (
                    <div style={{
                      marginBottom: '15px',
                      padding: '10px',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      border: '1px solid #f5c6cb',
                      borderRadius: '4px'
                    }}>
                      {saveError}
                    </div>
                  )}

                  <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="courseName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#171717' }}>
                      Course Name:
                    </label>
                    <input
                      type="text"
                      id="courseName"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
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
                    <label htmlFor="courseDescription" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#171717' }}>
                      Course Description:
                    </label>
                    <textarea
                      id="courseDescription"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={4}
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
                      onClick={handleSave}
                      disabled={saving || !editedName.trim()}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: saving || !editedName.trim() ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: saving || !editedName.trim() ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: saving ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Modules Section */}
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #dee2e6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3>Modules ({modules.length})</h3>
                  <button
                    onClick={() => setShowModuleCreator(true)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    + Add Module
                  </button>
                </div>

                {/* Module Creation Form */}
                {showModuleCreator && (
                  <div style={{
                    border: '1px solid #007cba',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '15px',
                    backgroundColor: '#f0f8ff'
                  }}>
                    <h4 style={{ marginBottom: '15px', color: '#171717' }}>Create New Module</h4>

                    {moduleCreationError && (
                      <div style={{
                        marginBottom: '15px',
                        padding: '10px',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px'
                      }}>
                        {moduleCreationError}
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Module name"
                      value={newModuleName}
                      onChange={(e) => setNewModuleName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newModuleName.trim()) {
                          handleCreateModule();
                        } else if (e.key === 'Escape') {
                          handleCancelModuleCreation();
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#ffffff',
                        color: '#171717'
                      }}
                      autoFocus
                    />

                    <textarea
                      placeholder="Module description (optional)"
                      value={newModuleDescription}
                      onChange={(e) => setNewModuleDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancelModuleCreation();
                        }
                      }}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '15px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        resize: 'vertical',
                        backgroundColor: '#ffffff',
                        color: '#171717'
                      }}
                    />

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={handleCreateModule}
                        disabled={creatingModule || !newModuleName.trim()}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: creatingModule || !newModuleName.trim() ? '#6c757d' : '#007cba',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: creatingModule || !newModuleName.trim() ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {creatingModule ? 'Creating...' : 'Create Module'}
                      </button>
                      <button
                        onClick={handleCancelModuleCreation}
                        disabled={creatingModule}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: creatingModule ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {modules.length > 0 ? (
                  <div style={{ listStyle: 'none', padding: 0 }}>
                    {modules.map((module, index) => (
                      <div key={module.id} style={{
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '8px',
                        backgroundColor: selectedModuleId === module.id ? '#e3f2fd' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                        onClick={() => handleModuleClick(module.id!)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{index + 1}. {module.title}</strong>
                            {module.body && (
                              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                {module.body}
                              </p>
                            )}
                          </div>
                          <span style={{
                            color: '#007cba',
                            fontSize: '18px',
                            transform: selectedModuleId === module.id ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }}>
                            ▶
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No modules created yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Content Blocks */}
        <div style={{ flex: 1 }}>
          {selectedModuleId ? (
            <div>
              {/* Content Creator */}
              {showContentCreator && (
                <ContentCreator
                  moduleId={selectedModuleId}
                  onContentCreated={handleContentCreated}
                  onCancel={handleHideContentCreator}
                />
              )}

              {/* Add Content Button */}
              {!showContentCreator && (
                <div style={{ marginBottom: '20px' }}>
                  <button
                    onClick={handleShowContentCreator}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '16px'
                    }}
                  >
                    + Add Content Block
                  </button>
                </div>
              )}

              {/* Content Block List */}
              <ContentBlockList
                moduleId={selectedModuleId}
                moduleName={modules.find(m => m.id === selectedModuleId)?.title}
                isInteractive={true}
                onContentUpdate={handleContentUpdate}
              />
            </div>
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              color: '#6c757d',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Select a Module</h3>
              <p style={{ margin: 0 }}>
                Click on a module from the left panel to view and interact with its content blocks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
