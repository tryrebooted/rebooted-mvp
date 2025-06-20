'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  progress: number; // 0-1 representing completion percentage
}

interface LDUser {
  username: string;
  userType: 'LDUser' | 'EmployeeUser';
}

export default function ModifyCoursePage() {
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState('Workplace Safety Fundamentals');
  const [courseDescription, setCourseDescription] = useState('Essential safety protocols and procedures for all employees');
  const [teachers, setTeachers] = useState<LDUser[]>([
    { username: 'sarah.jones', userType: 'LDUser' },
    { username: 'mike.wilson', userType: 'LDUser' }
  ]);
  const [students, setStudents] = useState<LDUser[]>([
    { username: 'john.doe', userType: 'EmployeeUser' },
    { username: 'jane.smith', userType: 'EmployeeUser' }
  ]);
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
          content: 'Welcome to our comprehensive workplace safety training. This course will cover the essential knowledge and procedures every employee needs to maintain a safe working environment.',
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
    }
  ]);

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newContentTitle, setNewContentTitle] = useState('');
  const [newContentType, setNewContentType] = useState<'Text' | 'Question'>('Text');
  const [newContentContent, setNewContentContent] = useState('');

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

  const addContentToModule = (moduleId: string) => {
    if (newContentTitle.trim() && newContentContent.trim()) {
      const newContent: ContentBlock = {
        id: `content-${Date.now()}`,
        type: newContentType,
        title: newContentTitle.trim(),
        content: newContentContent.trim(),
        isComplete: false
      };

      setModules(modules.map(module =>
        module.id === moduleId
          ? { ...module, contentBlocks: [...module.contentBlocks, newContent] }
          : module
      ));

      setNewContentTitle('');
      setNewContentContent('');
      setSelectedModuleId(null);
    }
  };

  const removeContentFromModule = (moduleId: string, contentId: string) => {
    setModules(modules.map(module =>
      module.id === moduleId
        ? { 
            ...module, 
            contentBlocks: module.contentBlocks.filter(content => content.id !== contentId)
          }
        : module
    ));
  };

  const calculateModuleProgress = (module: Module): number => {
    if (module.contentBlocks.length === 0) return 0;
    const completedCount = module.contentBlocks.filter(content => content.isComplete).length;
    return completedCount / module.contentBlocks.length;
  };

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
              onClick={() => router.push('/preview-course')}
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
                            onClick={() => removeContentFromModule(module.id, content.id)}
                            className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-md text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="text-gray-700">{content.content}</div>

                      {content.type === 'Question' && (
                        <div className="mt-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                            Edit Question
                          </button>
                        </div>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={newContentTitle}
                          onChange={(e) => setNewContentTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter content title"
                        />
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
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Add Content
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
