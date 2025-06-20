'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function ModifyCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const courseId = searchParams.get('id');

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [teachers, setTeachers] = useState<LDUser[]>([]);
  const [students, setStudents] = useState<LDUser[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newContentType, setNewContentType] = useState<'Text' | 'Question'>('Text');
  const [newContentContent, setNewContentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [editContentType, setEditContentType] = useState<'Text' | 'Question'>('Text');
  const [editContentText, setEditContentText] = useState('');

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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push('/login');
        return;
      }

      // Check if user has teacher access to this course
      const { data: userAccess, error: accessError } = await supabase
        .from('course_users')
        .select('role')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (accessError || userAccess?.role !== 'teacher') {
        setError('You do not have permission to edit this course');
        setLoading(false);
        return;
      }

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
            title: `${content.content_type} Content`, // Since DB doesn't have title field
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

      // Update in database
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

  const addContentToModule = async (moduleId: string) => {
    if (!newContentContent.trim()) return;

    try {
      setSaving(true);

      // Get the next position for this module
      const module = modules.find(m => m.id === moduleId);
      const nextPosition = module ? module.contentBlocks.length + 1 : 1;

      // Add to database
      const { data: newContent, error } = await supabase
        .from('content')
        .insert({
          module_id: moduleId,
          content_type: newContentType,
          content_text: newContentContent.trim(),
          position: nextPosition
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const newContentBlock: ContentBlock = {
        id: newContent.id,
        type: newContentType,
        title: `${newContentType} Content`,
        content: newContentContent.trim(),
        isComplete: false,
        position: nextPosition
      };

      setModules(modules.map(module =>
        module.id === moduleId
          ? { ...module, contentBlocks: [...module.contentBlocks, newContentBlock] }
          : module
      ));

      setNewContentContent('');
      setSelectedModuleId(null);

    } catch (err) {
      console.error('Error adding content:', err);
      setError('Failed to add content block');
    } finally {
      setSaving(false);
    }
  };

  const removeContentFromModule = async (moduleId: string, contentId: string) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      // Update local state
      setModules(modules.map(module =>
        module.id === moduleId
          ? { 
              ...module, 
              contentBlocks: module.contentBlocks.filter(content => content.id !== contentId)
            }
          : module
      ));

    } catch (err) {
      console.error('Error removing content:', err);
      setError('Failed to remove content block');
    }
  };

  const startEditingContent = (contentId: string, currentType: 'Text' | 'Question', currentText: string) => {
    setEditingContentId(contentId);
    setEditContentType(currentType);
    setEditContentText(currentText);
  };

  const cancelEditingContent = () => {
    setEditingContentId(null);
    setEditContentType('Text');
    setEditContentText('');
  };

  const updateContentBlock = async () => {
    if (!editingContentId || !editContentText.trim()) return;

    try {
      setSaving(true);

      // Update in database
      const { error } = await supabase
        .from('content')
        .update({
          content_type: editContentType,
          content_text: editContentText.trim()
        })
        .eq('id', editingContentId);

      if (error) throw error;

      // Update local state
      setModules(modules.map(module => ({
        ...module,
        contentBlocks: module.contentBlocks.map(content =>
          content.id === editingContentId
            ? {
                ...content,
                type: editContentType,
                title: `${editContentType} Content`,
                content: editContentText.trim()
              }
            : content
        )
      })));

      // Clear editing state
      cancelEditingContent();

    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to update content block');
    } finally {
      setSaving(false);
    }
  };

  const calculateModuleProgress = (module: Module): number => {
    if (module.contentBlocks.length === 0) return 0;
    const completedCount = module.contentBlocks.filter(content => content.isComplete).length;
    return completedCount / module.contentBlocks.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/management-dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{courseTitle}</h1>
            <p className="text-gray-600 mt-2">{courseDescription}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push(`/preview-course?id=${courseId}`)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Preview Course
            </button>
            <button
              onClick={() => router.push('/management-dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Course Users Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Teachers (L&D Users)</h3>
            <div className="space-y-2">
              {teachers.map((teacher, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="text-gray-700">{teacher.username}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{teacher.userType}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Students (Employee Users)</h3>
            <div className="space-y-2">
              {students.map((student, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="text-gray-700">{student.username}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{student.userType}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
        <div className="space-y-6">
          {modules.map((module) => {
            const progress = calculateModuleProgress(module);
            return (
              <div key={module.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{Math.round(progress * 100)}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedModuleId(selectedModuleId === module.id ? null : module.id)}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                  >
                    {selectedModuleId === module.id ? 'Cancel' : 'Add Content'}
                  </button>
                </div>

                {/* Content Blocks */}
                <div className="space-y-4">
                  {module.contentBlocks.map((content) => (
                    <div
                      key={content.id}
                      className={`p-4 rounded-lg border ${
                        content.isComplete ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      } shadow-sm`}
                    >
                      {editingContentId === content.id ? (
                        // Inline Edit Form
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">Editing Content Block</h4>
                            <div className="flex space-x-2">
                              <button
                                onClick={updateContentBlock}
                                disabled={saving || !editContentText.trim()}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:bg-gray-400"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={cancelEditingContent}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                            <select
                              value={editContentType}
                              onChange={(e) => setEditContentType(e.target.value as 'Text' | 'Question')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Text">Text</option>
                              <option value="Question">Question</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                              value={editContentText}
                              onChange={(e) => setEditContentText(e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={editContentType === 'Text' ? 'Enter text content' : 'Enter question content'}
                            />
                          </div>
                        </div>
                      ) : (
                        // Normal Display
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  content.type === 'Text'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {content.type}
                              </span>
                              <h4 className="font-semibold text-gray-900">{content.title}</h4>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleContentCompletion(module.id, content.id)}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                  content.isComplete
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {content.isComplete ? 'Completed' : 'Mark Complete'}
                              </button>
                              <button
                                onClick={() => startEditingContent(content.id, content.type, content.content)}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-md text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeContentFromModule(module.id, content.id)}
                                className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-md text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="text-gray-700 whitespace-pre-wrap">{content.content}</div>

                          {content.type === 'Question' && !editingContentId && (
                            <div className="mt-3">
                              <button 
                                onClick={() => startEditingContent(content.id, content.type, content.content)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                              >
                                Edit Question
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Content Form */}
                {selectedModuleId === module.id && (
                  <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Add New Content Block</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                        <select
                          value={newContentType}
                          onChange={(e) => setNewContentType(e.target.value as 'Text' | 'Question')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Text">Text</option>
                          <option value="Question">Question</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                          value={newContentContent}
                          onChange={(e) => setNewContentContent(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={newContentType === 'Text' ? 'Enter text content' : 'Enter question content'}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addContentToModule(module.id)}
                          disabled={saving || !newContentContent.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                          {saving ? 'Adding...' : 'Add Content'}
                        </button>
                        <button
                          onClick={() => setSelectedModuleId(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
