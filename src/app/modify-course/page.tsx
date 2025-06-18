'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ContentBlock {
  id: string;
  type: 'article' | 'quiz';
  title: string;
  content: string;
  completed: boolean;
}

export default function CoursePage() {
  const router = useRouter();
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      id: '1',
      type: 'article',
      title: 'Introduction to Web Development',
      content: 'Web development is the work involved in developing a website for the Internet or an intranet...',
      completed: false,
    },
    {
      id: '2',
      type: 'quiz',
      title: 'Web Development Basics Quiz',
      content: 'Test your knowledge about web development fundamentals...',
      completed: false,
    },
  ]);

  const toggleCompletion = (id: string) => {
    setContentBlocks(blocks =>
      blocks.map(block =>
        block.id === id ? { ...block, completed: !block.completed } : block
      )
    );
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Content</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Content Block
            </button>
            <button
              onClick={() => router.push('/preview-course')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Preview Course
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {contentBlocks.map((block) => (
            <div
              key={block.id}
              className={`p-6 rounded-lg border ${
                block.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      block.type === 'article'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {block.type === 'article' ? 'Article' : 'Quiz'}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900">{block.title}</h2>
                </div>
                <button
                  onClick={() => toggleCompletion(block.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    block.completed
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {block.completed ? 'Completed' : 'Mark Complete'}
                </button>
              </div>

              <div className="prose max-w-none text-gray-700">{block.content}</div>

              {block.type === 'quiz' && (
                <div className="mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Start Quiz
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
